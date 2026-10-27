-- Diagnostic READ-ONLY : ACL des fonctions RPC d'administration.
-- Version corrigée : PUBLIC est contrôlé via aclexplode(), pas has_function_privilege('public', ...).
-- À exécuter dans Supabase SQL Editor sur un projet de TEST.
-- Ne modifie aucune donnée, aucun privilège et aucune fonction.

-- 1) Définition, SECURITY DEFINER, search_path et ACL des fonctions ciblées.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  coalesce(p.proacl::text, '(ACL NULL : droits par défaut PostgreSQL)') as acl
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_role_of', 'admin_wilayas', 'admin_can', 'admin_sees_wilaya')
order by p.proname, identity_arguments;

-- 2) Droits EXECUTE : PUBLIC est le grantee OID 0 dans les ACL PostgreSQL.
-- anon/authenticated : has_function_privilege calcule leurs droits effectifs,
-- y compris les droits hérités de PUBLIC.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  exists (
    select 1
    from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
    where a.grantee = 0
      and a.privilege_type = 'EXECUTE'
  ) as public_can_execute,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_role_of', 'admin_wilayas', 'admin_can', 'admin_sees_wilaya')
order by p.proname, identity_arguments;

-- 3) Vérifier si le schéma public est exposé aux rôles client.
select
  has_schema_privilege('anon', 'public', 'USAGE') as anon_has_public_usage,
  has_schema_privilege('authenticated', 'public', 'USAGE') as authenticated_has_public_usage;

-- 4) Fonctions qui appellent les fonctions ciblées dans leur définition.
-- Recherche textuelle indicative : elle peut manquer les appels dynamiques.
select
  n.nspname as schema_name,
  p.proname as caller_function,
  pg_get_function_identity_arguments(p.oid) as caller_arguments,
  p.prosecdef as caller_is_security_definer,
  p.prosrc as source_body
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosrc ~ 'admin_role_of|admin_wilayas|admin_can|admin_sees_wilaya'
order by p.proname;

-- Limites d'interprétation :
-- * Ce script diagnostique uniquement les quatre fonctions listées.
-- * La recherche des appelants est textuelle et peut manquer des appels dynamiques.
-- * Un droit EXECUTE n'établit pas à lui seul qu'une fonction est exposée par la Data API.
-- * Ne pas appliquer de REVOKE/GRANT depuis ce diagnostic.
-- * Ne pas publier de sortie contenant des données sensibles ou des identifiants.
