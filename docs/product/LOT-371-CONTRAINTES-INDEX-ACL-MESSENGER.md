# Lot 371 — contraintes, index et ACL PostgreSQL Messenger

Date : 13 novembre 2026  
Source : catalogues PostgreSQL du projet Supabase actif, requêtes SELECT uniquement.  
Aucune donnée utilisateur n'a été lue. Aucun changement SQL n'a été appliqué.

## 1. Contraintes référentielles confirmées

### Tables Messenger

- `msg_conversations` : PK bigint ; `created_by → auth.users(id)` ON DELETE CASCADE ; type limité à `direct` ou `groupe`.
- `msg_members` : PK composite `(conversation_id,user_id)` ; conversation → `msg_conversations(id)` CASCADE ; utilisateur → `auth.users(id)` CASCADE ; rôle limité à `member` ou `moderateur`.
- `msg_messages` : PK bigint ; conversation → `msg_conversations(id)` CASCADE ; expéditeur → `auth.users(id)` CASCADE.
- `msg_attachments` : PK bigint ; message → `msg_messages(id)` CASCADE ; uploader → `auth.users(id)` CASCADE ; MIME limité à PNG/JPEG/WEBP/PDF ; taille 1 à 5 242 880 octets ; SHA-256 vide ou 64 caractères hexadécimaux ; statut pending/ok/retire ; chemin contraint à `msg/<conversation>/<uploader>-<nom>`.
- `msg_blocks` : PK `(blocker_id,blocked_id)` ; deux références Auth CASCADE ; blocage de soi-même interdit.
- `msg_reports` : PK bigint ; message → messages CASCADE ; reporter → Auth CASCADE ; `handled_by → auth.users` SET NULL ; unicité `(message_id,reporter_id)` ; statut ouvert/traite/rejete.
- `msg_log` : PK bigint.
- `profiles` : PK UUID et FK `id → auth.users(id)` CASCADE ; statut de vérification limité à non_verifie/en_attente/verifie/rejete.

### Dépendances d'administration

- `admin_permissions` : PK `(role_cle,permission)`, FK rôle → `admin_roles(cle)` CASCADE.
- `admin_roles` : PK `cle`.
- `wilaya_assignments` : PK `(user_id,code_wilaya)`, FK utilisateur → `profiles(id)` CASCADE, FK rôle → `admin_roles(cle)` RESTRICT.

La restauration nécessite donc un schéma Auth compatible et les rôles/fonctions Supabase nécessaires. Recréer uniquement les tables public ne suffit pas.

## 2. Index observés

- Conversations : PK id ; index type ; index géographique `(wilaya,niveau,filiere)`.
- Membres : PK `(conversation_id,user_id)` ; index user_id.
- Messages : PK id ; index `(conversation_id,created_at DESC)` ; index `(sender_id,created_at DESC)`.
- Pièces jointes : PK id ; index message_id.
- Blocages : PK `(blocker_id,blocked_id)`.
- Signalements : PK id ; unique `(message_id,reporter_id)`.
- Profils : PK id.
- Affectations admin : PK `(user_id,code_wilaya)`.
- Rôles admin : PK cle ; permissions : PK `(role_cle,permission)`.

Ces index doivent être reproduits pour que le jeu de test corresponde à la structure active et que les scénarios concurrents restent pertinents.

## 3. ACL de fonctions observées

Les fonctions d'accès destinées à la session authentifiée incluent notamment :
- `msg_open_direct(uuid)` : EXECUTE par authenticated et service_role.
- `msg_can_dm`, `msg_is_member`, `msg_is_moderator`, `msg_member_ok`, `msg_not_blocked) : EXECUTE par authenticated et service_role.
- `admin_can`, `admin_role_of`, `admin_sees_wilaya`, `admin_wilayas`, `is_admin` : EXECUTE par authenticated et service_role.

Les fonctions internes de triggers `msg_guard_direct`, `msg_logfn`, `msg_rate_limit`, `msg_touch_conversation_fn`, `msg_tr_taille_fn`, `profiles_tr_audit_role_fn`, `protect_role_niveau` ne sont pas accordées à authenticated dans l'ACL observée ; elles restent exécutées par les triggers. Ne pas leur accorder EXECUTE à authenticated lors d'une reconstruction.

Privilèges table observés : authenticated a SELECT/INSERT/UPDATE/DELETE sur les tables Messenger selon les tables (msg_log reste lecture seule), mais les opérations restent limitées par RLS. Les tables de rôles/permissions admin accordent SELECT à authenticated ; les tables Messenger et profiles sont aussi accordées à service_role. Le dump exact des ACL doit conserver les différences par table et par fonction.

## 4. Autres dépendances à terminer

- `profiles_tr_audit_role_fn()` appelle `audit_log(...)` ; l'ACL observée de `audit_log` ne donne EXECUTE qu'à postgres et service_role.
- `protect_role_niveau()` dépend de `is_admin()` et de `current_user` ; le test doit préserver le contexte d'exécution réel du trigger.
- Les triggers de profil doivent être restaurés en plus des triggers Messenger.
- La requête de policies Storage filtrée sur le motif `msg/%` n'a pas retourné de ligne dans cette extraction ; cela ne permet pas de conclure à l'absence de policies Storage. Il faut exporter séparément l'intégralité des policies `storage.objects` et les règles du bucket privé.

## 5. État

- Contraintes et index du périmètre extraits.
- ACL table et ACL EXECUTE des fonctions ciblées extraites.
- Aucun dump SQL restaurable complet assemblé.
- Aucun test PostgreSQL/RLS multi-compte exécuté.
- Aucun projet de test créé et aucun coût engagé.
- Projet actif inchangé ; aucun changement main, fusion PR #17 ou déploiement.

## 6. Étape suivante

Terminer le catalogue Storage/Realtime/ACL complet, extraire les dépendances d'audit, puis assembler un baseline SQL versionné sans données réelles. Le baseline ne sera appliqué qu'à une instance isolée autorisée, jamais au projet actif.
