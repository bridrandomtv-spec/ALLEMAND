# Archive des migrations SQL Messenger — provenance et empreintes

Date d'extraction : 12 novembre 2026  
Projet source : Supabase `azjwcybivirvpxbfhyzk`  
Source : `supabase_migrations.schema_migrations.statements[1]`  
Méthode : SELECT en lecture seule ; SHA-256 calculé dans PostgreSQL sur UTF-8 exact via `digest(convert_to(...),'sha256')`.

## Statut et précautions

Ces 11 fichiers sont des **copies archivées de migrations déjà appliquées sur le projet source**, pas des migrations à appliquer. Ils sont rangés sous `docs/architecture/migration-archive/`, volontairement hors de `supabase/migrations/` pour éviter tout déclenchement ou application automatique.

Ils ne constituent ni une chaîne complète de reconstruction ni un baseline initial. Aucun rollback n'est disponible dans le journal pour les 27 migrations recensées. Ne pas rejouer ces fichiers sur le projet actif. La reproduction doit être testée sur un PostgreSQL isolé après reconstruction du baseline complet et comparaison de l'état résultant.

Les fichiers reproduisent le contenu SQL retourné par la colonne `statements[1]` sans en-tête ni réécriture. Le hash correspond au texte SQL exact en UTF-8, pas au hash Git du fichier.

## Fichiers archivés

| Version | Nom | SHA-256 |
|---|---|---|
| 20261030131545 | `harden_messages_attachments_sponsors_and_direct_rpc` | `5556a84eca9c3e976c689aef877d4dbf3abbef46e3d6941f797d210c815159a0` |
| 20261030132222 | `secure_direct_message_membership` | `73a016c9a8cbe5551353cda6294737696aab2a6b09596af9a7b8ce0f3d57c879` |
| 20261030132512 | `close_direct_chat_join_and_lock_trigger_functions` | `e973056c22658a954107100d58f52f4812e99b246f89a7602433972768aa5d98` |
| 20261030132541 | `restrict_message_membership_helper_access` | `002ea9b9289c917de58afe7152f405b86cba3e5bee3cddfe1cfbdc3aef5ca38e` |
| 20261030133016 | `enforce_message_attachment_metadata_constraints` | `d90ba221216154100dabc5f724ab3b308672c0ba08093ced437faae3d0ab8eba` |
| 20261030155716 | `tighten_public_privileges_and_profile_scope_guard` | `d7755b25ad6e0f74a825502edf829af2a49f9c83b523fae58b5d1e124642656a` |
| 20261030171035 | `scope_message_edits_and_attachment_moderation` | `679b4296ff40f7d9f52b929247f8a24c245a7b53fa9d6ac4a26a7453670cea5f` |
| 20261030171056 | `update_conversation_activity_on_message_insert` | `909109fe6285cefa55334f5ba14ead5e2e0f1a056125e95b24229dbbeee75028` |
| 20261030171127 | `enforce_message_storage_upload_limits` | `b3a7fbd58ee82e84f5be1260609f8a6213317b2d3e6fa0184bb7fed72d85ac3b` |
| 20261030171556 | `separate_global_moderation_and_student_verification` | `5866727ea07242b1aeb2f8f12335814c5ab7bf3130efc4993613bb02c8a6893f` |
| 20261030171618 | `scope_student_verification_by_wilaya` | `9f42c969406edd19aeea4fdd75d1dc667aad580550ebc765fd338e2e97bfe349` |

## Périmètre

Les copies couvrent les règles de pièces jointes, l'ouverture de DM, l'appartenance aux conversations, les privilèges de profils, les modifications de messages, l'activité des conversations, les limites Storage, la séparation modération/vérification et la portée wilaya de la vérification.

Les 16 autres migrations ne sont pas archivées dans ce lot : elles comprennent des domaines hors périmètre (comptabilité, paiements, Auth, notes, notifications, liens parent-enfant et autres). La migration de stockage MFA n'est pas incluse. Aucune de ces migrations hors périmètre n'a été modifiée.

## Contrôles

- 11 lignes SQL sources, 11 fichiers créés.
- 11 empreintes SHA-256 issues de la base source.
- Aucun SQL exécuté en écriture, aucune DDL/migration appliquée.
- Aucun changement Auth/RLS/GRANT/Storage en base active.
- Aucun déploiement Cloudflare, aucun changement `main), aucun merge PR #17.
