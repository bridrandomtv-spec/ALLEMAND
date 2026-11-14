# Lot 374 — règles de vérification des profils et triggers Messenger

Date : 13 novembre 2026  
Source : catalogue PostgreSQL Supabase actif, requêtes SELECT uniquement. Aucune ligne de profil ni donnée personnelle consultée.

## 1. Périmètre extrait

Lecture des définitions de fonctions et triggers associés à :
- `profiles`
- `msg_conversations`
- `msg_members`
- `msg_messages`
- `msg_attachments`
- `msg_blocks`
- `msg_reports`
- `audit_logs`

Les définitions proviennent de `pg_get_functiondef` et `pg_get_triggerdef`. Ce lot complète les Lots 370 à 373 ; il ne remplace pas les exports de colonnes, contraintes, index, policies et ACL déjà consignés.

## 2. Vérification du profil : constat important

Le trigger `profiles_tr_verif` appelle `profiles_verif_guard()` avant UPDATE.

La fonction autorise une modification des champs `verif_statut`, `verif_by`, `matricule` ou `section` si :
- l'utilisateur courant est authentifié et `is_admin()` ;
- ou il possède `students.verify` et `admin_sees_wilaya(auth.uid(), NEW.wilaya)` confirme son périmètre.

Exception limitée pour l'élève lui-même : si son ancien statut est `non_verifie` ou `rejete`, il peut passer à `en_attente`, sans modifier `verif_by`.

Toute autre modification déclenche `verif_reservee_moderation`.

Conséquence produit : le client peut demander une vérification, mais ne peut pas s'auto-certifier. Cette protection interne ne constitue toutefois pas une preuve d'inscription dans un lycée. Aucun référentiel officiel élève↔lycée n'a été trouvé dans les Lots 366 et 368.

## 3. Protection du périmètre scolaire

Le trigger `profiles_tr_scope` appelle `profiles_scope_guard()` :
- un utilisateur ne peut pas modifier son propre `wilaya`, `niveau` ou `filiere` ;
- un administrateur peut modifier le périmètre ;
- un agent avec `students.read` peut effectuer une modification uniquement dans les limites de wilaya prévues ;
- sinon, exception `perimetre_reserve_administration_autorisee`.

Le trigger `trg_protect_role_niveau` protège aussi `role` et `niveau` contre les modifications non autorisées, avec exception dédiée.

Le trigger `profiles_tr_role` protège le changement de rôle ; `profiles_tr_audit_role` enregistre les changements autorisés via `audit_log`.

## 4. Triggers Messenger confirmés

- `msg_members.msg_tr_direct` → `msg_guard_direct()` : impose créateur en premier membre, limite à deux membres pour un DM, et appelle `msg_can_dm` pour le second membre.
- `msg_messages.msg_tr_rate` → `msg_rate_limit()` : limite à 20 messages par minute et 2 000 caractères ; marque les messages contenant une URL.
- `msg_messages.msg_touch_conversation` → met à jour `last_activity`.
- `msg_messages.msg_tr_log_del` → journalise les mises à jour de `deleted_at`.
- `msg_attachments.msg_tr_taille` → refuse les pièces jointes supérieures à 5 MiB.
- Les triggers de journalisation des pièces jointes et signalements écrivent dans `msg_log`.
- `audit_logs.audit_logs_tr_immuable` bloque UPDATE/DELETE authentifiés.

## 5. Risque fonctionnel toujours ouvert

Les gardes de vérification de profil empêchent l'auto-validation du statut, mais ne créent pas de workflow d'invitation Messenger. La RPC `msg_open_direct` vérifie toujours `msg_can_dm`, mais ne requiert pas une invitation préalablement acceptée. La policy `msg_member_ok` et les INSERT autorisés restent donc des chemins à tester sur PostgreSQL isolé.

Le statut `verifie` reste une vérification interne. Il ne doit pas être interprété comme affiliation institutionnelle certaine ni servir seul à ouvrir un annuaire national inter-lycées.

## 6. Matrice de tests synthétiques à préparer

1. Élève A : modification de son propre statut vers `en_attente` autorisée selon les conditions du trigger.
2. Élève A : passage direct à `verifie` refusé.
3. Élève A : modification de `matricule`, `section` ou `verif_by` refusée.
4. Modérateur hors wilaya : vérification refusée.
5. Modérateur autorisé dans la wilaya : vérification autorisée.
6. Élève : modification de son propre périmètre scolaire refusée.
7. Agent : modification d'un périmètre hors habilitation refusée.
8. Changement de rôle non autorisé : refus et absence d'audit partiel.
9. DM sans invitation acceptée : vérifier le contournement via RPC et INSERT directs.
10. DM avec blocage dans chaque sens : vérifier A bloque B puis B bloque A.
11. Pièce jointe : tester taille, MIME, propriétaire, chemin et lien avec l'auteur du message.
12. Limite de débit : 20 messages/minute et longueur de 2 000 caractères.

Ces scénarios sont une spécification de test, pas des résultats d'exécution.

## 7. État et limites

- Définitions de fonctions et triggers extraites en lecture seule.
- Aucune donnée applicative, profil, message, pièce jointe ou journal réel consulté.
- Aucun test PostgreSQL/RLS exécuté.
- Aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage/Realtime.
- Aucun projet de test créé, aucun frais engagé.
- PR #17 reste ouverte et non fusionnée ; main et production inchangées.

