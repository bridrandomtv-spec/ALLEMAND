-- Lot 384 — contrôle de cohérence structurelle Messenger
-- SELECT ONLY. Peut être exécuté sur une base isolée restaurée OU sur le catalogue
-- actif en lecture seule. N'accède à aucune ligne applicative et ne modifie rien.
-- Résultat : lignes PASS / FAIL / INFO pour comparer les objets indispensables.
WITH expected_tables(table_name, expected_policies, expected_triggers) AS (
  VALUES
    ('msg_conversations',2,0),
    ('msg_members',3,1),
    ('msg_messages',3,3),
    ('msg_attachments',3,2),
    ('msg_blocks',3,0),
    ('msg_reports',3,1),
    ('msg_log',1,0),
    ('profiles',7,5),
    ('audit_logs',1,1),
    ('admin_roles',1,0),
    ('admin_permissions',1,0),
    ('wilaya_assignments',2,0)
),
table_checks AS (
-- NOTE: Le rattachement du schéma public est contrôlé dans table_checks ;
-- une table homonyme d'un autre schéma ne doit pas satisfaire le contrôle.
  SELECT e.table_name,e.expected_policies,e.expected_triggers,
    (c.oid IS NOT NULL) AS exists_table,
    COALESCE(c.relrowsecurity,false) AS rls_enabled,
    COALESCE(c.relforcerowsecurity,false) AS force_rls,
    (SELECT count(*)::int FROM pg_policies p
      WHERE p.schemaname='public' AND p.tablename=e.table_name) AS actual_policies,
    (SELECT count(*)::int FROM pg_trigger t
      WHERE t.tgrelid=c.oid AND NOT t.tgisinternal) AS actual_triggers
  FROM expected_tables e
  LEFT JOIN pg_class c ON c.relname=e.table_name
  LEFT JOIN pg_namespace n ON n.oid=c.relnamespace AND n.nspname='public'
  WHERE c.oid IS NULL OR n.oid IS NOT NULL
),
required_functions(function_name) AS (
  VALUES ('msg_open_direct'),('msg_can_dm'),('msg_member_ok'),
         ('msg_not_blocked'),('msg_guard_direct'),('msg_rate_limit'),
         ('profiles_verif_guard'),('profiles_scope_guard'),
         ('handle_new_user'),('audit_log')
),
function_checks AS (
  SELECT f.function_name,
    EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname='public' AND p.proname=f.function_name
    ) AS exists_function
  FROM required_functions f
),
required_profile_columns(column_name) AS (
  VALUES ('id'),('pseudo'),('role'),('niveau'),('filiere'),('wilaya'),
         ('verif_statut'),('verif_by'),('verif_at'),('matricule'),('section')
),
profile_column_checks AS (
  SELECT r.column_name,
    EXISTS (
      SELECT 1 FROM pg_attribute a
      JOIN pg_class c ON c.oid=a.attrelid
      JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname='public' AND c.relname='profiles'
        AND a.attname=r.column_name AND a.attnum>0 AND NOT a.attisdropped
    ) AS exists_column
  FROM required_profile_columns r
)
SELECT 'TABLE' AS check_group, table_name AS object_name,
  CASE
    WHEN NOT exists_table THEN 'FAIL'
    WHEN NOT rls_enabled THEN 'FAIL'
    WHEN actual_policies<>expected_policies THEN 'FAIL'
    WHEN actual_triggers<>expected_triggers THEN 'FAIL'
    ELSE 'PASS'
  END AS status,
  jsonb_build_object(
    'exists',exists_table,'rls_enabled',rls_enabled,'force_rls',force_rls,
    'policies_expected',expected_policies,'policies_actual',actual_policies,
    'triggers_expected',expected_triggers,'triggers_actual',actual_triggers
  ) AS details
FROM table_checks
UNION ALL
SELECT 'FUNCTION',function_name,
  CASE WHEN exists_function THEN 'PASS' ELSE 'FAIL' END,
  jsonb_build_object('exists',exists_function)
FROM function_checks
UNION ALL
SELECT 'PROFILE_COLUMN',column_name,
  CASE WHEN exists_column THEN 'PASS' ELSE 'FAIL' END,
  jsonb_build_object('exists',exists_column)
FROM profile_column_checks
ORDER BY check_group,object_name;

-- Contrôle séparé des deux dépendances Auth critiques.
SELECT 'AUTH_DEPENDENCY' AS check_group, x.object_name,
  CASE WHEN x.exists_object THEN 'PASS' ELSE 'FAIL' END AS status,
  jsonb_build_object('exists',x.exists_object) AS details
FROM (
  SELECT 'auth.users' AS object_name,to_regclass('auth.users') IS NOT NULL AS exists_object
  UNION ALL
  SELECT 'auth.uid()',to_regprocedure('auth.uid()') IS NOT NULL
  UNION ALL
  SELECT 'auth.jwt()',to_regprocedure('auth.jwt()') IS NOT NULL
  UNION ALL
  SELECT 'auth.role()',to_regprocedure('auth.role()') IS NOT NULL
) x
ORDER BY x.object_name;

-- Synthèse des totaux : attendus 12 tables, 29 policies, 13 triggers.
SELECT
  count(*) AS target_tables,
  sum((SELECT count(*) FROM pg_policies p
       WHERE p.schemaname='public' AND p.tablename=e.table_name)) AS policy_total,
  sum((SELECT count(*) FROM pg_trigger t
       JOIN pg_class c ON c.oid=t.tgrelid
       JOIN pg_namespace n ON n.oid=c.relnamespace
       WHERE n.nspname='public' AND c.relname=e.table_name
         AND NOT t.tgisinternal)) AS trigger_total
FROM (VALUES
 ('msg_conversations'),('msg_members'),('msg_messages'),('msg_attachments'),
 ('msg_blocks'),('msg_reports'),('msg_log'),('profiles'),('audit_logs'),
 ('admin_roles'),('admin_permissions'),('wilaya_assignments')
) e(table_name);
