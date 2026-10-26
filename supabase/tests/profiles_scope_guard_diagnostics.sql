-- Diagnostics en lecture seule pour l'audit de profiles.
-- Exécuter uniquement dans Supabase SQL Editor ou psql sur une base de test.
-- Ces requêtes n'installent/modifient aucune policy, fonction, trigger ou donnée.

-- 1) Policies RLS actuellement installées sur public.profiles.
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname, cmd;

-- 2) État RLS de la table.
select n.nspname as schema_name,
       c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'profiles';

-- 3) Triggers actifs (non internes) attachés à public.profiles.
select t.tgname as trigger_name,
       pg_get_triggerdef(t.oid, true) as trigger_definition,
       p.proname as function_name,
       pg_get_functiondef(p.oid) as function_definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
where n.nspname = 'public'
  and c.relname = 'profiles'
  and not t.tgisinternal
order by t.tgname;

-- 4) Fonctions de contrôle connues, y compris si elles ne sont pas reliées
-- à un trigger actuellement actif.
select n.nspname as schema_name,
       p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer,
       p.proconfig as function_settings,
       pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'is_admin',
    'is_prof',
    'protect_role_niveau',
    'profiles_scope_guard'
  )
order by p.proname;

-- 5) Confirmer les droits SQL déclarés sur public.profiles.
-- Ces grants ne remplacent pas les contrôles RLS.
select grantee, privilege_type, is_grantable
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'profiles'
order by grantee, privilege_type;

-- Lecture du résultat :
-- * Des policies absentes ne doivent pas être supposées installées.
-- * Plusieurs policies permissives d'une même commande peuvent s'additionner (OR).
-- * Les triggers listés sont ceux réellement présents, pas ceux simplement définis
--   dans les fichiers du dépôt.
-- * Ne pas publier de sortie contenant des données sensibles ou des identifiants.
