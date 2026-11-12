# LOT 346 — Inventaire DDL ciblé : Messenger et profils

Date : 12 novembre 2026  
Projet observé : Supabase `azjwcybivirvpxbfhyzk`  
Méthode : requêtes SELECT sur les catalogues PostgreSQL ; aucune donnée personnelle ou conversationnelle extraite.

## 1. Tables et colonnes observées

L'inventaire porte sur les sept tables Messenger et `public.profiles`. Les colonnes, types, NOT NULL et expressions DEFAULT ont été extraits directement des catalogues.

| Table | Colonnes |
|---|---:|
| `msg_attachments` | 9 |
| `msg_blocks` | 3 |
| `msg_conversations` | 9 |
| `msg_log` | 6 |
| `msg_members` | 5 |
| `msg_messages` | 9 |
| `msg_reports` | 8 |
| `profiles` | 12 |

## 2. Contraintes observées

### Messenger
- `msg_conversations` : PK `id`, CHECK type `direct|groupe`, FK `created_by -> auth.users`.
- `msg_members` : PK composite `(conversation_id,user_id)`, FK vers conversations et `auth.users`, rôle limité à `member|moderateur`.
- `msg_messages` : PK `id`, FK vers conversations et `auth.users`.
- `msg_attachments` : PK `id`, FK vers messages et `auth.users`; MIME allowlist PNG/JPEG/WEBP/PDF, taille 1 à 5 242 880 octets, format SHA-256, état et chemin contraints.
- `msg_blocks` : PK composite `(blocker_id,blocked_id)`, deux FK Auth, interdiction de se bloquer soi-même.
- `msg_reports` : PK `id`, FK message/reporter/handler, unicité `(message_id,reporter_id)`, états contrôlés.
- `msg_log` : PK `id`.

### Profils
- `profiles.id` est PK et FK vers `auth.users(id)`.
- `verif_statut` est contraint aux états `non_verifie|en_attente|verifie|rejete`.
- Aucun FK vers un établissement scolaire canonique ni vers une affiliation annuelle n'a été identifié dans le modèle audité.

## 3. Points d'attention pour le baseline et le futur Messenger

1. Les tables de membres et de messages référencent directement `auth.users`. Le baseline applicatif doit donc prévoir un contrat Auth de test, pas remplacer silencieusement ces références par des UUID libres.
2. L'affiliation scolaire officielle reste absente du modèle actuel ; les champs de profil ne suffisent pas à établir l'établissement d'inscription.
3. Le modèle de DM ne contient toujours aucune table d'invitations. Les contraintes DDL seules ne matérialisent pas le consentement du destinataire.
4. Le lien `msg_messages.attachment_id` est nullable ; dans les contraintes extraites, aucune FK dédiée de cette colonne vers `msg_attachments` n'apparaît. À vérifier avec les triggers et le sens métier avant de proposer une modification.
5. Les checks de taille/MIME/path valident les métadonnées et le chemin, pas le contenu binaire réel ni une analyse antivirus.

## 4. Limites

Ce document est un inventaire DDL ciblé, pas un script `CREATE TABLE` restaurable. Il ne comprend pas encore les séquences/identités, index complets, propriétaires, ACL, policies, fonctions et triggers complets. Les objets Auth restent des dépendances managées.

## 5. Sécurité

- SELECT uniquement ; aucun contenu de profil, message ou pièce jointe lu.
- Aucun SQL d'écriture, DDL, migration, modification Auth/RLS/GRANT/Storage.
- Aucun déploiement Cloudflare, aucun changement `main`, aucun merge PR #17.
- Aucun environnement payant créé.

## 6. Suite

Compléter les objets non-table : séquences et identity, index/validité, fonctions avec définitions et ACL EXECUTE, triggers, policies et ACL par colonne. Puis assembler un baseline contrôlé et un jeu de tests synthétiques sans exécuter les migrations sur le projet actif.
