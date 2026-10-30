-- READ-ONLY Supabase security inventory
-- Run in the Supabase SQL Editor against the intended project.
-- This script reads PostgreSQL catalogs only; it does not modify schema or data.
-- Export results for review. Do not run against production unless you intend only to inspect it.

-- 1) Tables, RLS state, FORCE RLS, row estimates (no row contents)
select n.nspname as schema_name,
       c.relname as table_name,
       c.relkind,
       c.reltuples::bigint as estimated_rows,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname in ('public','storage')
  and c.relkind in ('r','p','v','m')
order by 1,2;

-- 2) RLS policies, including USING and WITH CHECK expressions
select schemaname, tablename, policyname, permissive, roles,
       cmd, qual as using_expression, with_check
from pg_policies
where schemaname in ('public','storage')
order by schemaname, tablename, policyname;

-- 3) Triggers on application and Storage tables
select event_object_schema as schema_name,
       event_object_table as table_name,
       trigger_name, event_manipulation, action_timing,
       action_orientation, action_condition, action_statement
from information_schema.triggers
where event_object_schema in ('public','storage')
order by 1,2,3,4;

-- 4) Functions: security-definer status, owner, search_path and ACL
select n.nspname as schema_name,
       p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_userbyid(p.proowner) as owner,
       p.prosecdef as security_definer,
       p.provolatile as volatility,
       p.proconfig as function_settings,
       coalesce(array_to_string(p.proacl, ', '), '(default ACL)') as acl,
       exists (
         select 1
         from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
         where a.grantee = 0 and a.privilege_type = 'EXECUTE'
       ) as public_can_execute,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('public','storage')
order by 1,2,3;

-- 5) Explicit table/sequence privileges for API roles
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema in ('public','storage')
  and grantee in ('anon','authenticated','service_role','PUBLIC')
order by 1,2,3,4;

select sequence_schema, sequence_name, grantee, privilege_type
from information_schema.role_usage_grants
where object_type = 'SEQUENCE'
  and sequence_schema in ('public','storage')
  and grantee in ('anon','authenticated','service_role','PUBLIC')
order by 1,2,3,4;

-- 6) Column-level privileges (important where table DML grants are broad)
select table_schema, table_name, column_name, grantee, privilege_type
from information_schema.column_privileges
where table_schema in ('public','storage')
  and grantee in ('anon','authenticated','service_role','PUBLIC')
order by 1,2,3,4,5;

-- 7) Storage buckets: configuration only, no object names or file metadata
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
order by id;

-- 8) Realtime publication membership
select p.pubname, n.nspname as schema_name, c.relname as table_name
from pg_publication_tables p
join pg_namespace n on n.nspname = p.schemaname
join pg_class c on c.relname = p.tablename and c.relnamespace = n.oid
where p.pubname = 'supabase_realtime'
order by 2,3;

-- 9) Installed extensions relevant to security / auth
select e.extname, e.extversion, n.nspname as schema_name
from pg_extension e
join pg_namespace n on n.oid = e.extnamespace
order by e.extname;

-- 10) Auth-related triggers (metadata only; no user records)
select event_object_schema, event_object_table, trigger_name,
       action_timing, event_manipulation, action_statement
from information_schema.triggers
where event_object_schema = 'auth'
order by event_object_table, trigger_name;
