-- Lot 380 — export catalogue baseline Messenger (SELECT ONLY)
-- Execute each SELECT independently against the active project for schema metadata only.
-- Never export rows from profiles, auth.users, messages, conversations or audit logs.
-- Output is a catalogue snapshot, NOT a pg_dump and NOT directly restorable SQL.

-- A. Tables, columns, defaults and identity/generated metadata.
SELECT jsonb_build_object(
  'schema', n.nspname,
  'table', c.relname,
  'rls_enabled', c.relrowsecurity,
  'force_rls', c.relforcerowsecurity,
  'columns', (
    SELECT jsonb_agg(jsonb_build_object(
      'position', a.attnum,
      'name', a.attname,
      'type', format_type(a.atttypid,a.atttypmod),
      'not_null', a.attnotnull,
      'default', pg_get_expr(d.adbin,d.adrelid),
      'identity', a.attidentity,
      'generated', a.attgenerated
    ) ORDER BY a.attnum)
    FROM pg_attribute a
    LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
    WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
  )
) AS table_definition
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p')
  AND c.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY c.relname;

-- B. Constraints and indexes.
SELECT jsonb_build_object(
  'table', format('%I.%I',ns.nspname,cl.relname),
  'constraint_name',co.conname,
  'constraint_type',co.contype,
  'definition',pg_get_constraintdef(co.oid,true),
  'validated',co.convalidated,
  'deferrable',co.condeferrable,
  'initially_deferred',co.condeferred
) AS constraint_definition
FROM pg_constraint co
JOIN pg_class cl ON cl.oid=co.conrelid
JOIN pg_namespace ns ON ns.oid=cl.relnamespace
WHERE ns.nspname='public'
  AND cl.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY cl.relname,co.conname;

SELECT jsonb_build_object(
  'table',format('%I.%I',ns.nspname,t.relname),
  'index_name',i.relname,
  'definition',pg_get_indexdef(i.oid),
  'valid',x.indisvalid,
  'ready',x.indisready,
  'unique',x.indisunique,
  'primary',x.indisprimary
) AS index_definition
FROM pg_index x
JOIN pg_class t ON t.oid=x.indrelid
JOIN pg_class i ON i.oid=x.indexrelid
JOIN pg_namespace ns ON ns.oid=t.relnamespace
WHERE ns.nspname='public'
  AND t.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY t.relname,i.relname;

-- C. Policies, triggers and functions (definitions only).
SELECT jsonb_build_object(
  'schema',schemaname,'table',tablename,'policy',policyname,
  'permissive',permissive,'roles',roles,'command',cmd,
  'using',qual,'with_check',with_check
) AS policy_definition
FROM pg_policies
WHERE schemaname='public'
  AND tablename IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY tablename,policyname;

SELECT jsonb_build_object(
  'table',format('%I.%I',ns.nspname,cl.relname),
  'trigger',tg.tgname,
  'enabled_state',tg.tgenabled,
  'definition',pg_get_triggerdef(tg.oid,true),
  'function',pg_get_functiondef(tg.tgfoid)
) AS trigger_definition
FROM pg_trigger tg
JOIN pg_class cl ON cl.oid=tg.tgrelid
JOIN pg_namespace ns ON ns.oid=cl.relnamespace
WHERE NOT tg.tgisinternal AND ns.nspname='public'
  AND cl.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY cl.relname,tg.tgname;

SELECT jsonb_build_object(
  'schema',ns.nspname,'function',p.proname,
  'identity_arguments',pg_get_function_identity_arguments(p.oid),
  'result',pg_get_function_result(p.oid),
  'language',l.lanname,'security_definer',p.prosecdef,
  'volatility',p.provolatile,'settings',p.proconfig,
  'owner',pg_get_userbyid(p.proowner),
  'acl',COALESCE(p.proacl::text,'<default>'),
  'definition',pg_get_functiondef(p.oid)
) AS function_definition
FROM pg_proc p
JOIN pg_namespace ns ON ns.oid=p.pronamespace
JOIN pg_language l ON l.oid=p.prolang
WHERE ns.nspname='public'
  AND p.proname IN (
    'msg_open_direct','msg_can_dm','msg_member_ok','msg_not_blocked',
    'msg_guard_direct','msg_rate_limit','profiles_verif_guard',
    'profiles_scope_guard','handle_new_user','audit_log',
    'msg_is_member','msg_is_moderator'
  )
ORDER BY p.proname,pg_get_function_identity_arguments(p.oid);

-- D. Object-level ACL for target relations. Column grants are extracted separately.
SELECT jsonb_build_object(
  'object',format('%I.%I',ns.nspname,cl.relname),
  'grantee',CASE WHEN acl.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(acl.grantee) END,
  'privilege',acl.privilege_type,
  'grantable',acl.is_grantable,
  'grantor',pg_get_userbyid(acl.grantor)
) AS relation_grant
FROM pg_class cl
JOIN pg_namespace ns ON ns.oid=cl.relnamespace
CROSS JOIN LATERAL aclexplode(COALESCE(cl.relacl,acldefault(
  CASE WHEN cl.relkind='S' THEN 'S'::"char" ELSE 'r'::"char" END,cl.relowner
))) acl
WHERE ns.nspname='public'
  AND cl.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY cl.relname,grantee,privilege;

SELECT jsonb_build_object(
  'table',format('%I.%I',ns.nspname,cl.relname),
  'column',a.attname,
  'grantee',CASE WHEN acl.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(acl.grantee) END,
  'privilege',acl.privilege_type,
  'grantable',acl.is_grantable
) AS column_grant
FROM pg_attribute a
JOIN pg_class cl ON cl.oid=a.attrelid
JOIN pg_namespace ns ON ns.oid=cl.relnamespace
CROSS JOIN LATERAL aclexplode(a.attacl) acl
WHERE ns.nspname='public' AND a.attnum>0 AND NOT a.attisdropped
  AND cl.relname IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  )
ORDER BY cl.relname,a.attnum,grantee,privilege;

-- E. Explicitly record extensions and publication membership; do not mutate them.
SELECT extname,extversion FROM pg_extension ORDER BY extname;
SELECT pubname,schemaname,tablename
FROM pg_publication_tables
WHERE schemaname IN ('public','storage')
  AND tablename IN ('msg_conversations','msg_messages')
ORDER BY pubname,tablename;
