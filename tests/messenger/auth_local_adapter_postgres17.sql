-- Lot 383 — adaptateur Auth local minimal pour PostgreSQL 17 jetable.
-- INTERDIT dans Supabase actif ou toute base contenant des comptes réels.
-- Précondition : baseline applicatif restauré dans une instance isolée.
-- Exiger le marqueur explicite avant toute création d'objet.

DO $guard$
BEGIN
  IF current_setting('app.messenger_test_environment', true)
       IS DISTINCT FROM 'isolated-postgres-only' THEN
    RAISE EXCEPTION
      'STOP: adaptateur Auth réservé à une base PostgreSQL isolée et jetable.';
  END IF;
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'STOP: restaurer d''abord public.profiles depuis le baseline.';
  END IF;
  IF to_regclass('public.parent_role_requests') IS NULL THEN
    RAISE EXCEPTION 'STOP: restaurer d''abord public.parent_role_requests.';
  END IF;
  IF to_regprocedure('public.handle_new_user()') IS NULL THEN
    RAISE EXCEPTION 'STOP: restaurer d''abord public.handle_new_user().';
  END IF;
END
$guard$;

CREATE SCHEMA IF NOT EXISTS auth;

-- Table de substitution, volontairement limitée aux deux champs lus par
-- public.handle_new_user(). Elle ne reproduit pas le schéma Auth de Supabase.
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Trigger distinct : ne pas prétendre reproduire ou remplacer les triggers
-- internes Supabase. Le trigger actif de production n'est jamais touché.
DROP TRIGGER IF EXISTS auth_local_user_created_test ON auth.users;
CREATE TRIGGER auth_local_user_created_test
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fixtures exclusivement synthétiques. À exécuter manuellement dans la base
-- isolée après avoir restauré le baseline et le shim Auth.
--
-- BEGIN;
-- INSERT INTO auth.users(id,raw_user_meta_data) VALUES
-- ('00000000-0000-4000-8000-00000000000a',
--  '{"pseudo":"Eleve A","niveau":"2AS","filiere":"SC","wilaya":"01"}'),
-- ('00000000-0000-4000-8000-00000000000e',
--  '{"pseudo":"Eleve E","niveau":"2AS","filiere":"SC","wilaya":"01"}'),
-- ('00000000-0000-4000-8000-00000000000f',
--  '{"pseudo":"Eleve F","niveau":"2AS","filiere":"SC","wilaya":"01"}'),
-- ('00000000-0000-4000-8000-000000000014',
--  '{"pseudo":"Role escalation attempt","requested_role":"admin",
--    "niveau":"2AS","filiere":"SC","wilaya":"01"}'),
-- ('00000000-0000-4000-8000-000000000015',
--  '{"pseudo":"Parent request","requested_role":"parent"}');
-- ROLLBACK;
--
-- Les INSERT ci-dessus ne créent que des profils par le vrai trigger applicatif
-- restauré. Ils n'attribuent PAS les statuts verifie/rejete et ne créent PAS
-- de permissions administratives. Les profils privilégiés et états de
-- vérification sont à établir par des fixtures contrôlées séparées dans la
-- base jetable, puis à vérifier avec les triggers/policies correspondants.
--
-- Ne jamais ajouter d'email, mot de passe, token ou identifiant réel ici.
-- Ne jamais copier auth.users de production.
