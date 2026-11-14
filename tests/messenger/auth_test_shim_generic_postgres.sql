-- Lot 381 — Auth shim pour PostgreSQL générique ISOLÉ UNIQUEMENT.
-- NE PAS exécuter dans Supabase, ni dans une base de production.
-- Ce shim n'est PAS Supabase Auth : il simule uniquement les claims JWT utiles
-- aux tests SQL RLS. Il ne crée aucun utilisateur ni aucune session réelle.
--
-- Précondition obligatoire, à définir explicitement dans la base locale jetable :
--   SET app.messenger_test_environment = 'isolated-postgres-only';
-- Le script refuse de continuer si ce marqueur n'est pas présent.

DO $guard$
BEGIN
  IF current_setting('app.messenger_test_environment', true)
       IS DISTINCT FROM 'isolated-postgres-only' THEN
    RAISE EXCEPTION
      'STOP: Auth shim autorisé uniquement dans PostgreSQL isolé jetable. Marqueur app.messenger_test_environment absent.';
  END IF;
  IF current_setting('transaction_read_only', true) = 'on' THEN
    RAISE EXCEPTION 'STOP: environnement en lecture seule ; ne pas poursuivre.';
  END IF;
END
$guard$;

DO $roles$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    CREATE ROLE anon NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
  END IF;
END
$roles$;

CREATE SCHEMA IF NOT EXISTS auth;
REVOKE ALL ON SCHEMA auth FROM PUBLIC;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Lit le sujet JWT de test dans les paramètres de session PostgreSQL.
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $fn$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid,
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
  )::uuid
$fn$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $fn$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb,
    jsonb_build_object(
      'sub', NULLIF(current_setting('request.jwt.claim.sub', true), ''),
      'role', NULLIF(current_setting('request.jwt.claim.role', true), '')
    )
  )
$fn$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql
STABLE
AS $fn$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    auth.jwt() ->> 'role',
    current_user
  )
$fn$;

REVOKE ALL ON FUNCTION auth.uid() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.jwt() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.jwt() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated;

-- Exemples de claims SYNTHÉTIQUES à utiliser dans une transaction de test :
-- SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000000a',true);
-- SELECT set_config('request.jwt.claim.role','authenticated',true);
-- SELECT set_config('request.jwt.claims',
--   '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}',true);
-- SET LOCAL ROLE authenticated;
--
-- IMPORTANT :
-- 1. Le compte SQL qui lance SET ROLE doit être membre de authenticated.
-- 2. N'utilisez jamais postgres/supabase_admin/service_role pour conclure sur RLS.
-- 3. Le shim ne reproduit ni la signature, ni le cycle de vie, ni les garanties
--    cryptographiques de Supabase Auth ; les tests doivent être étiquetés "shim".
-- 4. auth.users, le trigger handle_new_user, Storage et Realtime ne sont pas
--    créés ici. Ils nécessitent des adaptateurs/test doubles séparés.
-- 5. Les claims sont des variables de session modifiables par le testeur :
--    ils ne sont pas une frontière d'authentification contre un utilisateur
--    contrôlant directement la connexion SQL.
