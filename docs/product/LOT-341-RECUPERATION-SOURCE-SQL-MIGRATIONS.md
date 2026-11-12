# LOT 341 — Récupération de la source SQL des migrations actives

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : découverte et vérification de provenance, lecture seule. Aucune migration exécutée.

## 1. Découverte déterminante

Les Lots 333/334 avaient établi que le connecteur `list_migrations` n'exposait que les versions et noms, et que GitHub ne contenait aucun dossier `supabase/migrations/`. Une inspection complémentaire du catalogue `supabase_migrations.schema_migrations` du projet actif a révélé des colonnes supplémentaires :

- `version`
- `name`
- `statements` (ARRAY)
- `created_by`
- `idempotency_key`
- `rollback` (ARRAY)

**Les corps SQL exacts sont donc récupérables depuis la base active**, dans `statements`, même si aucun fichier historique correspondant n'existe dans le dépôt Git.

## 2. Inventaire exact

La requête en lecture seule retourne 27 entrées ordonnées, du 30 octobre au 9 novembre 2026. Chacune contient exactement un élément dans `statements`. La somme des caractères SQL varie de 86 à 14 173 selon la migration. Le champ `rollback` est NULL pour les 27 entrées (cardinalité NULL), donc aucun rollback versionné n'est fourni par cette table.

Les 11 migrations directement pertinentes pour le Messenger, les profils, les pièces jointes et la vérification scolaire sont :

| Version | Nom |
|---|---|
| 20261030131545 | `harden_messages_attachments_sponsors_and_direct_rpc` |
| 20261030132222 | `secure_direct_message_membership` |
| 20261030132512 | `close_direct_chat_join_and_lock_trigger_functions` |
| 20261030132541 | `restrict_message_membership_helper_access` |
| 20261030133016 | `enforce_message_attachment_metadata_constraints` |
| 20261030155716 | `tighten_public_privileges_and_profile_scope_guard` |
| 20261030171035 | `scope_message_edits_and_attachment_moderation` |
| 20261030171056 | `update_conversation_activity_on_message_insert` |
| 20261030171127 | `enforce_message_storage_upload_limits` |
| 20261030171556 | `separate_global_moderation_and_student_verification` |
| 20261030171618 | `scope_student_verification_by_wilaya` |

Les 16 autres entrées portent sur les fonctions Auth, notes, paramètres, notifications, comptabilité et liens parent-enfant. La migration de novembre relative à un stockage de défis MFA est un élément historique du journal ; elle n'est ni modifiée, ni réactivée, ni intégrée au périmètre fonctionnel Messenger.

## 3. Vérification du contenu Messenger

Les corps SQL des 11 migrations ciblées ont été récupérés en lecture seule depuis `statements[1]`. Ils confirment notamment :

- La première migration crée/remplace `msg_open_direct(uuid)` en `SECURITY DEFINER`, prend un verrou transactionnel de paire, recherche un DM existant à deux membres, puis crée la conversation et ses deux adhésions si aucun DM n'existe.
- Cette RPC exige `msg_can_dm`, mais **ne vérifie pas l'existence d'une invitation acceptée**.
- La migration `secure_direct_message_membership` durcit `msg_member_ok` et `msg_guard_direct`, sans introduire de table d'invitations.
- La migration `close_direct_chat_join_and_lock_trigger_functions` exige que le créateur soit le premier membre et vérifie la compatibilité lors de l'ajout du second membre ; elle ne lie toujours pas cet ajout à un consentement d'invitation enregistré.
- Les migrations ultérieures ajoutent les contraintes MIME/taille/hash/chemin, limitent l'édition des messages et le stockage, mettent à jour l'activité des conversations et séparent les permissions de modération de celles de vérification scolaire.
- Les politiques et grants vivants doivent toujours être audités ensemble avec ces fonctions ; la récupération des migrations ne prouve pas à elle seule que l'état final de la base correspond au dépôt.

Cela confirme le constat de NO-GO du Messenger national : les migrations historiques disponibles n'implémentent pas le workflow d'invitation du Lot 337.

## 4. Ce que cette découverte permet — et ne permet pas

**Permet :**
1. Récupérer les 27 corps SQL exacts à partir du catalogue actif.
2. Les archiver sous leur version/nom dans une branche de travail, avec empreinte SHA-256 et provenance explicite.
3. Comparer les deltas réels avec les scripts agrégés du dépôt.
4. Construire une base de test seulement après récupération d'un baseline initial complet et vérification des prérequis PostgreSQL.

**Ne permet pas encore :**
- reconstruire la base depuis zéro : les 27 entrées sont des deltas, pas nécessairement le DDL initial complet ;
- établir l'état initial antérieur au 30 octobre ;
- garantir que tous les objets/extensions/roles/storage/realtime ont une source de reconstruction ;
- fournir des rollbacks, car la colonne `rollback` est NULL pour ces entrées ;
- exécuter les tests d'intégration : aucun moteur PostgreSQL isolé n'est disponible dans l'environnement actuel.

Les fichiers `supabase/schema.sql` et `supabase/msg_schema.sql` restent des scripts de préparation historiques et ne doivent pas être présumés être le baseline initial fidèle.

## 5. Prochaine méthode sûre

1. Exporter chaque `statements[1]` sans réécriture, dans un fichier horodaté distinct, et calculer SHA-256 sur le contenu UTF-8 exact.
2. Comparer les 27 fichiers exportés avec les migrations du dépôt (actuellement absentes) et consigner toute différence.
3. Construire séparément un baseline contrôlé à partir du schéma vivant : tables, colonnes, types, contraintes, index, fonctions, triggers, policies, grants, publications Realtime, buckets et policies Storage.
4. Faire revoir ce baseline avant de le considérer comme source de test ; ne jamais l'appliquer au projet actif.
5. Une fois la source de reconstruction complète, provisionner un PostgreSQL jetable sans coût additionnel et y exécuter les tests multi-rôles/concurrence.

## 6. Corrections aux Lots 333/334

Les affirmations « les corps SQL ne sont pas récupérables depuis les sources accessibles » et « le connecteur ne fournit que versions/noms » étaient trop larges. Elles sont corrigées ainsi :

- GitHub ne contient toujours aucun fichier ni commit sous `supabase/migrations/`.
- `list_migrations` renvoie versions/noms, mais le catalogue actif `supabase_migrations.schema_migrations` contient aussi les corps SQL dans `statements`.
- Les 27 corps sont récupérables par requête SELECT en lecture seule ; ils n'ont pas encore été archivés dans Git.
- Il manque toujours un baseline initial complet et les rollbacks sont NULL.

## 7. Contrôle CI et PR

- CI #3212 : success.
- CI #3213 : success.
- CI #3214 : success.
- CI #3215 : success, run [43313811101](https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43313811101).
- PR #17 : ouverte, non fusionnée, mergeable=true ; aucune fusion.

Aucune écriture SQL, DDL, migration, changement Auth/RLS/GRANT/Storage, création de ressource payante, modification client, déploiement Cloudflare, changement `main) ou merge PR #17. Aucun travail fonctionnel MFA/2FA ou facturation.

**Décision :** la chaîne de deltas est récupérable depuis le catalogue vivant ; le baseline initial reste à reconstruire et à valider. Le Messenger national reste NO-GO jusqu'à la fermeture serveur des DM sans invitation, à l'affiliation officielle et aux tests réels isolés.
