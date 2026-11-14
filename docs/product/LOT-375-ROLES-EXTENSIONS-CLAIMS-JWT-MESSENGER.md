# Lot 375 — rôles PostgreSQL, extensions et contexte JWT du baseline Messenger

Date : 13 novembre 2026  
Source : catalogue PostgreSQL Supabase actif, SELECT uniquement. Aucun secret, jeton, utilisateur ou donnée applicative consulté.

## 1. Version et extensions

- PostgreSQL actif : 17.6 (server_version_num=170006).
- Extensions recensées :
  - pg_stat_statements 1.11, schéma extensions
  - pgcrypto 1.3, schéma extensions
  - plpgsql 1.0, schéma pg_catalog
  - supabase_vault 0.3.1, schéma vault
  - uuid-ossp 1.1, schéma extensions

Le baseline de test doit distinguer les extensions nécessaires au schéma applicatif de celles gérées par Supabase et ne pas tenter de recréer les extensions managées sans vérifier leur disponibilité.

## 2. Rôles clés et propriétés observées

| Rôle | LOGIN | BYPASSRLS | Usage dans les tests |
|---|---:|---:|---|
| anon | non | non | requêtes non authentifiées |
| authenticated | non | non | tests RLS de chaque compte synthétique |
| authenticator | oui | non | rôle de connexion API, pas identité d'élève |
| service_role | non | oui | tests privilégiés isolés uniquement |
| postgres | oui | oui | restauration/administration, jamais preuve de RLS |
| supabase_admin | oui | oui, superuser | rôle managé, hors harness applicatif |
| supabase_auth_admin | oui | non | administration Auth managée |
| supabase_storage_admin | oui | non | administration Storage managée |
| pgbouncer | oui | non | rôle d'infrastructure |

Les rôles authenticator, supabase_realtime_admin et postgres disposent de memberships vers certains rôles API ; les memberships et options observés doivent être reproduits uniquement dans la mesure nécessaire au test, sans copier les privilèges d'infrastructure en bloc.

Les rôles anon et authenticated ont des statement_timeout spécifiques (3 s et 8 s). authenticator a des paramètres de session supplémentaires. Ces paramètres sont documentés comme caractéristiques d'environnement, pas comme dépendances applicatives à imposer à une instance autonome.

## 3. Contexte JWT : comportement réel de auth.uid()

Les définitions actives de auth.uid(), auth.jwt() et auth.role() ont été extraites :
- auth.uid() lit request.jwt.claim.sub, avec fallback sur request.jwt.claims ->> 'sub'.
- auth.jwt() lit request.jwt.claim, avec fallback sur request.jwt.claims.
- auth.role() lit request.jwt.claim.role, avec fallback sur request.jwt.claims ->> 'role'.

Conséquence pour le harness : chaque scénario doit installer des claims de test cohérents avec le rôle SQL effectif, puis exécuter sous le rôle authenticated (ou anon). Un simple SET ROLE authenticated sans claim sub ne simule pas un compte ; inversement, un claim sans rôle SQL adéquat ne valide pas les ACL/RLS. Ne jamais utiliser le rôle postgres ou service_role pour prétendre avoir testé RLS utilisateur.

## 4. Fonctions Storage utilisées par les policies

Les définitions de storage.foldername(text), storage.filename(text) et storage.extension(text) ont été capturées pour permettre de reproduire les expressions de chemins dans les tests Storage. Ces fonctions appartiennent au schéma managé storage et ne doivent pas être considérées comme des objets applicatifs à réinventer.

## 5. Conséquences pour la restauration fidèle

Le schéma public seul ne suffit pas. Le test doit tenir compte de :
- rôles SQL API et ACL ;
- claims JWT et fonctions auth.uid()/jwt()/role() ;
- objets et fonctions managés auth et storage ;
- versions d'extensions ;
- privilèges BYPASSRLS, en particulier l'exclusion de service_role/postgres des tests d'autorisation ordinaires.

Un environnement PostgreSQL générique peut tester une partie des policies avec un harness JWT explicite, mais ne sera pas automatiquement équivalent à Supabase Auth/Storage/Realtime. Le rapport final devra distinguer les tests Postgres purs des tests intégrés Supabase.

## 6. État et limites

- Catalogue rôles/memberships/extensions et fonctions auth/storage extrait en lecture seule.
- Aucun secret, JWT, profil ou donnée réelle consulté.
- Aucun test PostgreSQL/RLS exécuté.
- Aucun SQL d'écriture, DDL, migration ou changement Auth/RLS/GRANT/Storage/Realtime.
- Aucun projet de test créé, aucun frais engagé.
- PR #17 reste ouverte et non fusionnée ; main et production inchangées.
