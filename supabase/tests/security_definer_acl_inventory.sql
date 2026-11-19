-- Inventaire READ-ONLY des fonctions SECURITY DEFINER exposées dans public.
-- À exécuter uniquement dans un projet Supabase/PostgreSQL de TEST.
-- Aucune fonction, donnée, policy ou ACL n'est modifiée.

-- 1) Toutes les fonctions SECURITY DEFINER de public et leurs droits EXECUTE.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  coalesce(p.proacl::text, '(ACL NULL : droits par défaut PostgreSQL)') as acl,
  exists (
    select 1
    from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
    where a.grantee = 0 and a.privilege_type = 'EXECUTE'
  ) as public_can_execute,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
order by p.proname, identity_arguments;

-- 2) Corps des fonctions SECURITY DEFINER : contrôler auth.uid(), les permissions,
-- les paramètres contrôlés par le client et l'usage d'un search_path sûr.
-- Cette sortie peut être longue ; ne pas la publier si elle révèle des informations sensibles.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.proconfig as function_settings,
  p.prosrc as source_body
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
order by p.proname, identity_arguments;

-- 3) Liste indicative des fonctions qui mentionnent le nom d'une fonction SECURITY DEFINER.
-- Recherche textuelle uniquement : peut manquer les appels dynamiques, les wrappers SQL
-- et les appels construits par d'autres mécanismes.
select
  target.proname as target_function,
  pg_get_function_identity_arguments(target.oid) as target_arguments,
  caller.proname as possible_caller,
  pg_get_function_identity_arguments(caller.oid) as caller_arguments,
  caller.prosecdef as caller_is_security_definer,
  caller.proconfig as caller_settings
from pg_proc target
join pg_namespace tn on tn.oid = target.pronamespace
join pg_proc caller
  on caller.oid <> target.oid
 and caller.prosrc ilike '%' || target.proname || '%'
join pg_namespace cn on cn.oid = caller.pronamespace
where tn.nspname = 'public'
  and cn.nspname = 'public'
  and target.prosecdef
order by target.proname, caller.proname;

-- 4) Vérifier l'exposition du schéma public aux rôles clients.
select
  has_schema_privilege('anon', 'public', 'USAGE') as anon_has_public_usage,
  has_schema_privilege('authenticated', 'public', 'USAGE') as authenticated_has_public_usage;

-- Interprétation :
-- * Un droit EXECUTE ne prouve pas, à lui seul, que la fonction est exposée par la Data API.
-- * PUBLIC est le grantee OID 0 dans les ACL PostgreSQL.
-- * La recherche d'appelants est indicative et peut produire des correspondances textuelles
--   qui ne sont pas des appels réels ; vérifier chaque résultat dans son contexte.
-- * Vérifier les ACL de chaque signature complète, pas seulement le nom de fonction.
-- * Ne pas appliquer de REVOKE/GRANT à partir de cet inventaire seul.
