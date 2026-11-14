# LOT 343 — Inventaire du baseline PostgreSQL vivant (lecture seule)

Date : 12 novembre 2026  
Projet observé : Supabase `azjwcybivirvpxbfhyzk`  
Objet : identifier les composants nécessaires à un baseline reproductible.  
Méthode : catalogues PostgreSQL / information_schema, agrégats et métadonnées uniquement ; aucune donnée d'élève, aucun contenu de message, aucun secret extrait.

## 1. Périmètre des schémas et tables

Schémas applicatifs/plateforme présents : `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `realtime`, `storage`, `supabase_migrations`, `vault`.

Tables de base recensées par schéma :
- `public` : 37
- `auth` : 27
- `realtime` : 10
- `storage` : 10
- `supabase_migrations` : 1
- `vault` : 1

Les 37 tables de `public` et les 10 tables de `storage` ont RLS activé. Aucune de ces tables n'a `FORCE ROW LEVEL SECURITY` activé au moment de la requête. Ce point doit être conservé dans le baseline et expliqué par rôle/propriétaire ; ne pas supposer que RLS activé équivaut à FORCE RLS.

## 2. Extensions

| Extension | Version |
|---|---|
| pg_stat_statements | 1.11 |
| pgcrypto | 1.3 |
| plpgsql | 1.0 |
| supabase_vault | 0.3.1 |
| uuid-ossp | 1.1 |

La disponibilité et la version de ces extensions doivent être vérifiées dans le PostgreSQL isolé. Les fonctions de hash SHA-256 du Lot 342 utilisent `pgcrypto`.

## 3. Fonctions et sécurité

Inventaire des fonctions dans les schémas concernés :
- `public` : 74 fonctions, dont 71 `SECURITY DEFINER`.
- `storage` : 24 fonctions, dont 3 `SECURITY DEFINER`.
- `auth` : 4 fonctions, aucune `SECURITY DEFINER` selon le catalogue interrogé.

Les 71 fonctions `SECURITY DEFINER` de `public` ont une configuration `search_path` définie dans le catalogue ; la majorité fixe `pg_catalog, public`, et `msg_open_direct(uuid)` utilise `search_path = ''`. La liste des signatures et configurations doit être exportée dans le baseline complet et chaque fonction sensible doit être revue pour son propriétaire, ses ACL EXECUTE et ses dépendances.

Cette statistique n'est pas une validation de sécurité. Elle ne prouve ni la correction des corps SQL, ni l'absence de chemins d'exécution indirects.

## 4. Triggers

Nombre de triggers par schéma :
- `public` : 37
- `storage` : 13
- `auth` : 1

Triggers Messenger observés :
- `msg_attachments` : journalisation après UPDATE et contrôle de taille avant INSERT.
- `msg_members` : garde avant INSERT via `msg_guard_direct()`.
- `msg_messages` : mise à jour de l'activité de conversation après INSERT, journalisation après UPDATE, limite de débit avant INSERT.
- `msg_reports` : journalisation après UPDATE.

Le baseline doit capturer les définitions complètes des triggers et les fonctions cibles, pas seulement leurs noms.

## 5. RLS et politiques

- `public` : 71 policies sur 34 tables.
- `storage` : 5 policies sur 1 table (`storage.objects`).

Politiques Messenger présentes : lecture/ajout/retrait des membres, création/lecture des conversations, envoi/lecture/édition des messages, lecture/ajout/modération des pièces jointes, création/lecture/traitement des signalements, lecture/création/retrait des blocages, lecture des journaux modérateurs.
La politique d'insertion dans `msg_conversations` autorise encore un créateur authentifié à créer une conversation de type `direct` ; la politique d'insertion `msg_members` permet l'auto-ajout si `msg_member_ok` l'autorise. Cela concorde avec le NO-GO des Lots 325/330/335 : le workflow d'invitation acceptée n'est pas imposé par ces politiques.

Les cinq policies Storage comprennent des règles génériques de propriétaire et deux règles Messenger dédiées (`msg storage lecture`, `msg storage upload`). Leur coexistence doit être testée en intégration, car les policies permissives se combinent par OR pour une même commande/rôle.

## 6. Realtime

Deux publications :
- `supabase_realtime` : `public.msg_conversations`, `public.msg_messages`.
- `supabase_realtime_messages_publication` : huit tables partitionnées `realtime.messages_2026_10_12` à `realtime.messages_2026_10_18`.

Un environnement de test doit reproduire la publication Messenger et vérifier la livraison d'événements sous deux identités, y compris le refus de réception par un non-membre. La simple présence des tables dans une publication ne prouve pas la bonne isolation des événements.

## 7. Storage

Bucket observé :
- ID/nom : `prive`
- `public = false`
- `file_size_limit = NULL`
- `allowed_mime_types = NULL`

Les restrictions Messenger de taille (5 MiB) et MIME (PNG/JPEG/WEBP/PDF) sont donc principalement portées par les policies/contrôles SQL et les métadonnées d'objet ; le bucket global ne déclare pas de plafond ni d'allowlist MIME. La validation de type binaire réel/antivirus n'est pas prouvée par cet inventaire.

## 8. Index, contraintes et privilèges

- Le schéma `public` contient les tables Messenger `msg_attachments`, `msg_blocks`, `msg_conversations`, `msg_log`, `msg_members`, `msg_messages`, `msg_reports`.
- Le comptage des index a été relevé table par table ; les tables Messenger ont entre 1 et 3 index chacune selon le catalogue interrogé. Le détail index/colonnes/expressions/validité doit être archivé dans un export structuré avant toute restauration.
- Les contraintes PK/FK/UNIQUE/CHECK sont présentes sur les tables Messenger ; le détail complet a été recensé dans l'inventaire Lot 335 et devra être inclus dans le baseline final.
- Les privilèges `anon`, `authenticated`, `service_role` et `postgres` diffèrent entre `public` et `storage`. L'inventaire agrégé donne le nombre d'ACL par type, mais ne remplace pas les ACL par objet, colonnes, séquences, fonctions, schémas et default privileges.

## 9. Éléments manquants pour un baseline réellement reconstructible

L'inventaire est un premier cadrage, pas un dump :
1. DDL complet de toutes les tables/colonnes/types/defaults/identités/contraintes/index.
2. Propriétaires, rôles et memberships, ACL par objet, ACL par colonne, séquences et default privileges.
3. Définitions exactes des 74 fonctions publiques, 24 Storage et fonctions Auth nécessaires, avec dépendances et ACL EXECUTE.
4. Définitions de 51 triggers (37 public, 13 storage, 1 auth) et de leurs fonctions.
5. Expressions complètes des 76 policies (71 public, 5 storage) et options RLS/force RLS.
6. Publications et tables Realtime, paramètres de réplication requis.
7. Bucket(s), policies Storage, configuration, extensions et objets gérés par Supabase.
8. Objets Auth/Realtime/Storage/Vault dépendants de services managés : leur présence dans les catalogues ne signifie pas qu'ils sont portables dans un PostgreSQL vanilla.
9. Données de référence minimales synthétiques et procédure d'amorçage ; aucune donnée personnelle réelle.
10. Procédure de restauration et comparaison automatisée du catalogue obtenu au snapshot source.

## 10. Décision

Le projet vivant est plus large que le schéma applicatif `public` : un simple `schema.sql` ou `msg_schema.sql` ne suffit pas à reproduire Auth, Storage, Realtime, Vault, rôles et ACL. La reconstruction doit distinguer les objets applicatifs contrôlés par le dépôt des objets internes gérés par Supabase.

Le prochain livrable doit être un **baseline applicatif contrôlé** (public + contrats nécessaires) et un manifeste des dépendances managées, pas une tentative de copier les schémas internes `auth`, `realtime`, `storage` ou `vault` dans un PostgreSQL nu.

Aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage, export de données personnelles, création de ressource payante, modification client, déploiement Cloudflare, changement `main) ou merge PR #17. Pas de MFA/2FA ni de travail facturation.
