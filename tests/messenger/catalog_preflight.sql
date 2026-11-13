-- Messenger catalogue preflight — SELECT ONLY.
-- Safe for read-only inspection. Does not create fixtures or mutate schema/data.
-- Run against the isolated test database before any behavioral RLS test.

WITH expected_tables(schema_name, table_name) AS (
  VALUES
    ('public','msg_conversations'),
    ('public','msg_members'),
    ('public','msg_messages'),
    ('public','msg_attachments'),
    ('public','msg_blocks'),
    ('public','msg_reports'),
    ('public','msg_log'),
    ('public','profiles'),
    ('public','audit_logs'),
    ('public','admin_roles'),
    ('public','admin_permissions'),
    ('public','wilaya_assignments')
),
table_state AS (
  SELECT
    e.schema_name,
    e.table_name,
    c.oid IS NOT NULL AS exists,
    COALESCE(c.relrowsecurity, false) AS rls_enabled,
    COALESCE(c.relforcerowsecurity, false) AS force_rls
  FROM expected_tables e
  LEFT JOIN pg_namespace n ON n.nspname = e.schema_name
  LEFT JOIN pg_class c ON c.relnamespace = n.oid
    AND c.relname = e.table_name
    AND c.relkind IN ('r','p')
),
policy_state AS (
  SELECT schemaname, tablename, count(*)::int AS policy_count,
         string_agg(policyname, ', ' ORDER BY policyname) AS policy_names
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN (
      'msg_conversations','msg_members','msg_messages','msg_attachments',
      'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
      'admin_roles','admin_permissions','wilaya_assignments'
    )
  GROUP BY schemaname, tablename
),
trigger_state AS (
  SELECT n.nspname AS schema_name, c.relname AS table_name,
         count(*) FILTER (WHERE NOT t.tgisinternal)::int AS trigger_count,
         string_agg(t.tgname, ', ' ORDER BY t.tgname)
           FILTER (WHERE NOT t.tgisinternal) AS trigger_names
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname IN (
      'msg_conversations','msg_members','msg_messages','msg_attachments',
      'msg_blocks','msg_reports','msg_log','profiles','audit_logs'
    )
  GROUP BY n.nspname, c.relname
),
function_state AS (
  SELECT n.nspname AS schema_name, p.proname AS function_name,
         count(*)::int AS overload_count,
         bool_or(p.prosecdef) AS has_security_definer,
         string_agg(pg_get_function_identity_arguments(p.oid), '; ' ORDER BY
                    pg_get_function_identity_arguments(p.oid)) AS signatures
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname IN (
      'msg_open_direct','msg_can_dm','msg_member_ok','msg_not_blocked',
      'msg_guard_direct','msg_rate_limit','profiles_verif_guard',
      'profiles_scope_guard','handle_new_user','audit_log'
    )
  GROUP BY n.nspname, p.proname
)
SELECT
  'TABLE'::text AS section,
  t.schema_name || '.' || t.table_name AS object_name,
  CASE
    WHEN NOT t.exists THEN 'MISSING'
    WHEN t.rls_enabled THEN 'PRESENT_RLS_ON'
    ELSE 'PRESENT_RLS_OFF'
  END AS status,
  jsonb_build_object('force_rls', t.force_rls) AS details
FROM table_state t

UNION ALL

SELECT
  'POLICY',
  p.schemaname || '.' || p.tablename,
  CASE WHEN p.policy_count IS NULL THEN 'NO_POLICY' ELSE 'PRESENT' END,
  jsonb_build_object('count', p.policy_count, 'names', p.policy_names)
FROM policy_state p

UNION ALL

SELECT
  'TRIGGER',
  t.schema_name || '.' || t.table_name,
  CASE WHEN t.trigger_count IS NULL THEN 'NO_TRIGGER' ELSE 'PRESENT' END,
  jsonb_build_object('count', t.trigger_count, 'names', t.trigger_names)
FROM trigger_state t

UNION ALL

SELECT
  'FUNCTION',
  f.schema_name || '.' || f.function_name,
  'PRESENT',
  jsonb_build_object(
    'overloads', f.overload_count,
    'security_definer_any', f.has_security_definer,
    'signatures', f.signatures
  )
FROM function_state f

UNION ALL

SELECT
  'FUNCTION',
  x.function_name,
  'MISSING',
  '{}'::jsonb
FROM (
  VALUES
    ('public.msg_open_direct'),
    ('public.msg_can_dm'),
    ('public.msg_member_ok'),
    ('public.msg_not_blocked'),
    ('public.msg_guard_direct'),
    ('public.msg_rate_limit'),
    ('public.profiles_verif_guard'),
    ('public.profiles_scope_guard'),
    ('public.handle_new_user'),
    ('public.audit_log')
) AS x(function_name)
WHERE NOT EXISTS (
  SELECT 1 FROM function_state f
  WHERE f.schema_name || '.' || f.function_name = x.function_name
)
ORDER BY section, object_name;
