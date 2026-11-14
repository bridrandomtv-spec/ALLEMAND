# Lot 381 — shim Auth pour PostgreSQL générique isolé

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`

## Livrable préparé

`tests/messenger/auth_test_shim_generic_postgres.sql` fournit un adaptateur minimal pour les fonctions utilisées dans les policies RLS :
- `auth.uid()`
- `auth.jwt()`
- `auth.role()`

Il crée les rôles `anon` et `authenticated` uniquement s'ils sont absents, avec NOLOGIN, NOSUPERUSER, NOBYPASSRLS et sans privilèges de création de base ou de rôles. Les fonctions lisent les claims de test depuis les paramètres de session PostgreSQL.

## Protection contre une exécution accidentelle

Le script refuse de s'exécuter si le paramètre `app.messenger_test_environment` n'est pas explicitement égal à `isolated-postgres-only`. Il n'est pas destiné à Supabase ni à une base de production.

## Limites documentées

- Ce shim ne reproduit pas Supabase Auth : il ne valide pas de JWT, ne gère pas les sessions et ne crée pas auth.users.
- Les claims sont contrôlés par le testeur SQL ; ils ne constituent pas une authentification contre un utilisateur ayant accès direct à la connexion PostgreSQL.
- `auth.users`, `handle_new_user`, Storage et Realtime restent à adapter séparément.
- Le compte SQL de test doit pouvoir faire SET ROLE authenticated ; aucun rôle BYPASSRLS ne doit être utilisé pour les assertions.
- Le shim n'a pas été exécuté, car aucun moteur PostgreSQL isolé n'est actuellement disponible.

## Statut

- Shim préparé et versionné : oui.
- Exécution : non.
- Comptes synthétiques créés : non.
- Test RLS comportemental : non.
- Supabase actif modifié : non.
- Dépense : 0 USD.
- PR #17 : ouverte, non fusionnée ; main inchangée.
