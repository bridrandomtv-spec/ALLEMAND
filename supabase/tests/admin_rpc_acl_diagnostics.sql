-- Diagnostic READ-ONLY : ACL des fonctions RPC d'administration.
-- À exécuter dans Supabase SQL Editor sur un projet de TEST.
-- Ne modifie aucune donnée, aucun privilège et aucune fonction.
-- Les résultats doivent être interprétés avec les rôles effectifs du projet.

-- 1) Définition, SECURITY DEFINER, search_path et ACL explicite des fonctions ciblées.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  coalesce(p.proacl::text, '(ACL NULL : privilèges par défaut à examiner)') as acl
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_role_of', 'admin_wilayas', 'admin_can', 'admin_sees_wilaya')
order by p.proname, identity_arguments;

-- 2) Droit d'exécution effectif pour PUBLIC (pseudo-rôle), anon et authenticated.
-- has_function_privilege(role_name, oid, privilege) tient compte des ACL applicables.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  has_function_privilege('public', p.oid, 'EXECUTE') as public_can_execute,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_role_of', 'admin_wilayas', 'admin_can', 'admin_sees_wilaya')
order by p.proname, identity_arguments;

-- 3) Vérifie si le schéma public est exposé aux rôles client.
select
  has_schema_privilege('anon', 'public', 'USAGE') as anon_has_public_usage,
  has_schema_privilege('authenticated', 'public', 'USAGE') as authenticated_has_public_usage;

-- 4) Fonctions qui appellent les fonctions ciblées dans leur définition.
-- Cette recherche textuelle est indicative et peut manquer les appels dynamiques.
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

-- Important :
-- - Ne pas appliquer de REVOKE/GRANT depuis ce diagnostic.
-- - PUBLIC dans has_function_privilege est le pseudo-rôle PostgreSQL, pas un utilisateur.
-- - Une fonction appelée par une autre fonction SECURITY DEFINER ou par une policy RLS
--   peut nécessiter des droits différents d'un appel RPC direct.
-- - Avant tout durcissement, inventorier tous les appels et tester les flux légitimes.
