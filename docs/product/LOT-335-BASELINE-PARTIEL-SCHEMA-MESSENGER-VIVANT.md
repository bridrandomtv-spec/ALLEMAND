# LOT 335 — Baseline partiel du schéma Messenger vivant (12 novembre 2026)

## Objectif et méthode

Produire une photographie technique datée du Messenger PostgreSQL actif, après constat que les 27 corps de migrations historiques ne sont pas récupérables depuis GitHub/Supabase avec les accès disponibles.

Source : projet Supabase `azjwcybivirvpxbfhyzk`, PostgreSQL 17.6. Extraction uniquement par requêtes SELECT sur `information_schema`, `pg_catalog`, `pg_policies` et `storage.buckets`. Aucun contenu de message, profil nominatif ou fichier Storage n'a été consulté.

**Nature du livrable : baseline partiel dérivé du catalogue vivant, pas un pg_dump complet, pas un historique de migrations, pas un script de restauration.** Les définitions de toutes les fonctions, contraintes et ACL de l'ensemble du projet ne sont pas encore rassemblées dans un artefact complet. Les résultats de ce lot couvrent le périmètre Messenger ciblé.

## Structure constatée

Tables examinées : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, ainsi que les politiques associées de `msg_log` et `storage.objects`.

Colonnes structurantes :

- `msg_conversations` : id, type, wilaya, niveau, filiere, titre, created_by, created_at, last_activity.
- `msg_members` : conversation_id, user_id, role, joined_at, muted_until ; PK composite (conversation_id, user_id).
- `msg_messages` : id, conversation_id, sender_id, body, attachment_id, flagged, created_at, edited_at, deleted_at.
- `msg_attachments` : id, message_id, uploader, storage_path, mime, octets, sha256, statut, created_at.
- `msg_blocks` : blocker_id, blocked_id, created_at ; PK composite.
- `msg_reports` : id, message_id, reporter_id, motif, statut, handled_by, handled_at, created_at ; unicité (message_id, reporter_id).

Index relevés : PK des tables, `msg_conv_geo_idx(wilaya,niveau,filiere)`, `msg_conv_type_idx(type)`, `msg_members_user_idx(user_id)`, `msg_msg_conv_idx(conversation_id,created_at DESC)`, `msg_msg_sender_idx(sender_id,created_at DESC)`, `msg_att_msg_idx(message_id)`, et index unique de signalement.

## Fonctions et droits d'exécution

Fonctions Messenger examinées par définition et ACL :

- `msg_open_direct(uuid)` : SECURITY DEFINER, `search_path='' `, exécutable par authenticated et service_role, pas anon. Vérifie `auth.uid()`, refuse le self-DM, appelle `msg_can_dm`, prend un advisory transaction lock par paire d'utilisateurs, retrouve un DM à exactement deux membres ou crée atomiquement conversation et deux adhésions.
- `msg_can_dm(uuid,uuid)` : authenticated/service_role. Exige les deux profils `verif_statut='verifie'` et l'égalité wilaya+niveau+filiere.
- `msg_guard_direct()` : trigger SECURITY DEFINER, non exécutable par authenticated directement. Verrouille la conversation FOR UPDATE, exige le créateur en premier membre, refuse au-delà de deux membres et appelle `msg_can_dm` pour le second.
- `msg_member_ok` : authenticated/service_role. Autorise l'auto-adhésion au DM lorsque la conversation n'a aucun membre et que le compte est créateur, ou lorsqu'il y a exactement un membre compatible ; pas de contrôle d'invitation acceptée.
- `msg_is_member` : authenticated/service_role. Vérifie l'identité `uid=auth.uid()`, l'adhésion explicite ou l'éligibilité géographique à un groupe selon wilaya/niveau/filiere.
- `msg_is_moderator` : authenticated/service_role, via `is_admin()` ou permission `messaging.moderate`.
- `msg_not_blocked` : authenticated/service_role. Vérifie qu'aucun membre de la conversation n'a bloqué l'expéditeur courant ; la sémantique de blocage bilatéral reste à tester en intégration.
- Les fonctions internes de trigger `msg_logfn`, `msg_rate_limit`, `msg_touch_conversation_fn` et `msg_tr_taille_fn` ne sont pas exécutables directement par authenticated/anon dans l'ACL interrogée.

## Politiques RLS constatées

- `msg_conversations` INSERT : autorise un compte à créer une conversation direct si `created_by=auth.uid()`; aucun état d'invitation n'est contrôlé.
- `msg_members` INSERT : autorise l'auto-ajout si `user_id=auth.uid()` et `msg_member_ok`; aucun état d'invitation acceptée n'est contrôlé.
- Ces politiques, combinées à `msg_open_direct` exécutable par authenticated, confirment que l'exigence « invitation acceptée avant DM » n'est pas encore imposée par la base.
- `msg_messages` INSERT : expéditeur égal à auth.uid(), membre de la conversation et `msg_not_blocked`.
- `msg_messages` SELECT : membre ou modérateur ; UPDATE : auteur membre ou modérateur.
- `msg_attachments` INSERT : uploader courant, message dans une conversation dont il est membre, MIME parmi PNG/JPEG/WebP/PDF, taille 1 à 5 242 880 octets, statut pending et chemin lié à conversation/utilisateur.
- `msg_reports` INSERT : reporter courant et message dans une conversation dont il est membre ; lecture au reporter ou modérateur ; traitement réservé au modérateur.
- Storage `objects` : règles spécifiques au bucket privé `prive` et au chemin `msg/<conversation>/<user>-...`, accès membre/modérateur et contrôle metadata taille/MIME. Le bucket est `public=false`. Ses propriétés globales `file_size_limit` et `allowed_mime_types` sont nulles : les restrictions constatées sont donc portées par les politiques/contrôles, pas par ces deux paramètres de bucket.

## Triggers actifs relevés

- `msg_attachments` : `msg_tr_taille` BEFORE INSERT ; `msg_tr_log_att` AFTER UPDATE.
- `msg_members` : `msg_tr_direct` BEFORE INSERT.
- `msg_messages` : `msg_tr_rate` BEFORE INSERT ; `msg_touch_conversation` AFTER INSERT ; `msg_tr_log_del` AFTER UPDATE OF deleted_at.
- `msg_reports` : `msg_tr_log_rep` AFTER UPDATE.

## Décisions et risques confirmés

1. **Blocage prioritaire : invitation absente côté serveur.** Le client a été modifié pour refuser un nouveau DM sans invitation, mais la base permet toujours la création via RPC et politiques RLS. Il faut fermer les voies de contournement au niveau serveur dans une migration contrôlée, après tests.
2. **Périmètre national non atteint :** `msg_can_dm` impose la même wilaya, le même niveau et la même filière. Le DM inter-wilayas n'est pas possible avec la règle actuelle.
3. **Groupes :** l'appartenance peut être évaluée par compatibilité géographique dans `msg_is_member` / `msg_member_ok`, à tester avec plusieurs comptes et scénarios de sortie.
4. **Pièces jointes :** bucket privé et contrôles de métadonnées observés ; aucune preuve d'analyse antivirus ou de validation du contenu binaire réel. Les métadonnées déclarées par le client ne remplacent pas un scanner serveur.
5. **Blocage :** le contrôle est directionnel dans la fonction inspectée ; formaliser et tester les deux sens (A bloque B, B bloque A) avant de déclarer le comportement bilatéral.
6. Les fonctions SECURITY DEFINER observées ont un search_path configuré ; cela ne remplace pas l'examen de leurs corps et des ACL dans un test multi-rôle.

## Limites et suites

- Pas de `pg_dump` disponible dans l'environnement ; pas de moteur PostgreSQL local, Docker ou Podman.
- Ce rapport ne contient pas les définitions exhaustives de toutes les fonctions et politiques de toute la base, ni les données de restauration.
- Aucun test multi-session PostgreSQL, aucun test RLS avec vrais rôles et aucun test binaire d'upload n'a été exécuté.
- Prochaine étape : compléter un baseline reproductible par domaine (Messenger puis registre scolaire) et obtenir un PostgreSQL jetable sans coût ou une autorisation séparée après présentation explicite du coût. Ne pas créer de branche Supabase payante sans accord.
- Après disponibilité d'un moteur isolé : tests à deux sessions sur création DM concurrente, bypass invitation, acceptation idempotente, membres supplémentaires, blocage bilatéral, RLS des groupes, accès Storage et permissions de colonnes.

## État de sécurité opérationnel

Aucune écriture SQL, aucun DDL, aucune migration, aucune modification Auth/RLS/GRANT/Storage, aucune création de branche Supabase, aucun déploiement Cloudflare, aucun changement sur `main), aucune fusion de PR #17. MFA/2FA et facturation restent hors périmètre.
