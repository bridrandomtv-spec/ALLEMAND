# LOT 333 — Traçabilité des migrations SQL actives

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : inventaire GitHub + liste des migrations Supabase, en lecture seule.

## Résultat exécutif

- Supabase signale **27 migrations appliquées** sur le projet actif.
- L'arbre Git de la branche contient **zéro fichier sous un répertoire `migrations/`**.
- Le dépôt contient 17 scripts SQL directement sous `supabase/`, mais aucun n'est identifié par les versions/timestamps des 27 migrations actives.
- Les scripts `supabase/schema.sql`, `supabase/msg_schema.sql`, `supabase/grants.sql`, `supabase/harden.sql`, `supabase/fix_rls.sql`, `supabase/fix_scope_guard.sql` et `supabase/p0_locks.sql` sont des scripts historiques/agrégés. Ils ne constituent pas, à eux seuls, un journal de migrations fidèle et ordonné.
- Le connecteur Supabase disponible expose les versions et noms des migrations, mais ne fournit pas le corps SQL historique de chacune. Aucun outil de récupération du SQL source des migrations appliquées n'a été trouvé dans les actions disponibles.

## Liste des 27 migrations actives retournées par Supabase

| Version | Nom |
|---|---|
| 20261030131545 | harden_messages_attachments_sponsors_and_direct_rpc |
| 20261030132222 | secure_direct_message_membership |
| 20261030132344 | harden_auth_signup_trigger_function |
| 20261030132512 | close_direct_chat_join_and_lock_trigger_functions |
| 20261030132541 | restrict_message_membership_helper_access |
| 20261030133016 | enforce_message_attachment_metadata_constraints |
| 20261030133217 | scope_notes_visibility_to_owner_teacher_and_admin |
| 20261030133237 | scope_note_inserts_to_authenticated_teachers |
| 20261030133323 | restrict_settings_write_rpc_to_authenticated_admins |
| 20261030134155 | restrict_internal_notification_helper |
| 20261030134243 | restrict_payment_notification_trigger_functions |
| 20261030140202 | restrict_receipt_number_trigger_function |
| 20261030140313 | fix_receipt_issuance_search_path |
| 20261030141527 | restrict_immutable_accounting_trigger_function |
| 20261030141607 | scope_accounting_expenses_in_admin_report |
| 20261030141651 | harden_accounting_function_search_paths |
| 20261030142208 | scope_accounting_operations_by_wilaya |
| 20261030155716 | tighten_public_privileges_and_profile_scope_guard |
| 20261030164709 | secure_parent_child_link_confirmation |
| 20261030164908 | add_admin_approved_parent_role_requests |
| 20261030165207 | add_admin_only_policy_parent_role_requests |
| 20261030171035 | scope_message_edits_and_attachment_moderation |
| 20261030171056 | update_conversation_activity_on_message_insert |
| 20261030171127 | enforce_message_storage_upload_limits |
| 20261030171556 | separate_global_moderation_and_student_verification |
| 20261030171618 | scope_student_verification_by_wilaya |
| 20261109210413 | add_email_mfa_challenge_store |

Note : la dernière migration mentionne un stockage de défis MFA. Son existence historique est constatée, mais le sujet MFA/2FA reste explicitement hors périmètre produit et aucune suppression ni modification n'est proposée ici.

## Fichiers SQL présents dans GitHub

Les 17 fichiers SQL situés directement dans `supabase/` sont :

- `adm2_schema.sql`, `adm3_schema.sql`, `adm4_schema.sql`, `adm5_schema.sql`, `adm_schema.sql`
- `admin.sql`, `billing.sql`, `fix_rls.sql`, `fix_scope_guard.sql`, `grants.sql`
- `harden.sql`, `lesson_content.sql`, `msg_schema.sql`, `p0_locks.sql`
- `payments.sql`, `plans.sql`, `schema.sql`

Aucun fichier de ces 17 scripts n'est une migration horodatée correspondant directement à la liste active ci-dessus. Le dépôt contient aussi des scripts de contenu pédagogique dans `tools/` et un brouillon SQL sous `docs/security/`, sans lien démontré avec les 27 migrations actives.

## Conséquence pour le banc de tests PostgreSQL

Il serait dangereux de reconstruire une base de test en exécutant ces scripts agrégés dans un ordre supposé : cela pourrait produire un schéma différent du projet actif, masquer les dérives de migrations ou créer des faux positifs/négatifs dans les tests RLS et concurrence.

Le banc reproductible doit attendre une source de vérité complète et vérifiable :
1. récupérer le corps exact de chacune des 27 migrations appliquées depuis la source qui les a déployées (historique CI/CD, dépôt privé d'origine ou export autorisé) ;
2. associer chaque fichier à sa version et vérifier les sommes SHA-256 ;
3. reconstruire une base PostgreSQL jetable, sans données personnelles ni données de production ;
4. exécuter les tests multi-rôles/RLS et les tests de concurrence sur cette base ;
5. comparer le schéma final reconstruit au schéma actif en lecture seule.

Si le SQL source exact ne peut pas être retrouvé, la solution correcte est de créer un nouveau jeu de migrations de référence à partir d'un export contrôlé du schéma, avec revue manuelle, et non de présenter les scripts historiques comme l'historique authentique.

## Contrôles GitHub

- CI #3203 : `success`, commit `6adb449af0139af6db2a307e86a6ea5d64560054`.
- PR #17 : ouverte, non fusionnée, `mergeable=true`, `mergeable_state=clean`.
- HEAD PR : `6da36ebe0a1aacd29216fbf90f57a35c3daa2b23`.

## Actions explicitement non réalisées

Aucune migration SQL appliquée, aucune requête d'écriture, aucune modification Auth/RLS/GRANT/Storage, aucune branche Supabase créée, aucun déploiement Cloudflare, aucun changement sur `main), aucune fusion de PR. Aucun travail de facturation ou MFA/2FA entrepris.
