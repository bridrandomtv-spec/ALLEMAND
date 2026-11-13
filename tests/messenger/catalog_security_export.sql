-- Lot 425 — export complémentaire des autorisations Messenger
-- STRICTEMENT SELECT ONLY : catalogues PostgreSQL uniquement.
-- Ne lit aucune ligne de profiles, auth.users, messages, conversations,
-- pièces jointes, journaux ou objets Storage.
-- Exécuter uniquement sur une copie isolée, ou sur le projet actif après
-- autorisation explicite de consultation en lecture seule.
--
-- Ce fichier complète baseline_catalog_export.sql ; il ne remplace pas ce fichier.
-- Les résultats peuvent dépendre des privilèges du rôle qui exécute les SELECT.

-- A. Policies RLS : inclure public + storage.objects.
SELECT
  schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
    'admin_roles','admin_permissions','wilaya_assignments'
  ))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, policyname;

-- B. Triggers : état d'activation, définition et fonction déclenchée.
WITH target_relations AS (
  SELECT c.oid, n.nspname, c.relname
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE (n.nspname = 'public' AND c.relname IN (
      'msg_conversations','msg_members','msg_messages','msg_attachments',
      'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
      'admin_roles','admin_permissions','wilaya_assignments'
    ))
     OR (n.nspname = 'storage' AND c.relname = 'objects')
)
SELECT
  r.nspname AS schema_name,
  r.relname AS table_name,
  t.tgname AS trigger_name,
  CASE t.tgenabled
    WHEN 'O' THEN 'enabled_origin'
    WHEN 'D' THEN 'disabled'
    WHEN 'R' THEN 'enabled_replica'
    WHEN 'A' THEN 'enabled_always'
    ELSE t.tgenabled::text
  END AS enabled_state,
  pg_get_triggerdef(t.oid, true) AS trigger_definition,
  fn_ns.nspname AS function_schema,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS identity_arguments,
  p.prosecdef AS security_definer,
  p.proconfig AS function_settings,
  pg_get_userbyid(p.proowner) AS function_owner
FROM target_relations r
JOIN pg_trigger t ON t.tgrelid = r.oid
JOIN pg_proc p ON p.oid = t.tgfoid
JOIN pg_namespace fn_ns ON fn_ns.oid = p.pronamespace
WHERE NOT t.tgisinternal
ORDER BY r.nspname, r.relname, t.tgname;

-- C. Fonctions Messenger, auxiliaires identifiées par dépendance aux policies,
-- et fonctions de triggers. Toutes les surcharges sont conservées.
WITH target_relations AS (
  SELECT c.oid
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE (n.nspname = 'public' AND c.relname IN (
      'msg_conversations','msg_members','msg_messages','msg_attachments',
      'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
      'admin_roles','admin_permissions','wilaya_assignments'
    ))
     OR (n.nspname = 'storage' AND c.relname = 'objects')
),
policy_functions AS (
  SELECT DISTINCT d.refobjid AS function_oid
  FROM pg_depend d
  JOIN pg_policy pol
    ON d.classid = 'pg_policy'::regclass AND d.objid = pol.oid
  JOIN target_relations tr ON tr.oid = pol.polrelid
  WHERE d.refclassid = 'pg_proc'::regclass
),
trigger_functions AS (
  SELECT DISTINCT t.tgfoid AS function_oid
  FROM pg_trigger t
  JOIN target_relations tr ON tr.oid = t.tgrelid
  WHERE NOT t.tgisinternal
),
selected_functions AS (
  SELECT p.oid
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND (
      p.proname LIKE 'msg\_%' ESCAPE '\'
      OR p.proname ILIKE '%verif%'
      OR p.proname ILIKE '%block%'
      OR p.proname ILIKE '%invitation%'
      OR p.oid IN (SELECT function_oid FROM policy_functions)
      OR p.oid IN (SELECT function_oid FROM trigger_functions)
    )
)
SELECT
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS identity_arguments,
  pg_get_function_result(p.oid) AS result_type,
  l.lanname AS language,
  pg_get_userbyid(p.proowner) AS owner_name,
  p.prosecdef AS security_definer,
  p.provolatile AS volatility,
  p.proleakproof AS leakproof,
  p.proconfig AS function_settings,
  COALESCE(p.proacl::text, '(default ACL)') AS raw_acl,
  pg_get_functiondef(p.oid) AS function_definition
FROM selected_functions sf
JOIN pg_proc p ON p.oid = sf.oid
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_language l ON l.oid = p.prolang
ORDER BY n.nspname, p.proname, identity_arguments;

-- D. EXECUTE effectif déclaré par ACL pour le même périmètre de fonctions que C.
WITH target_relations AS (
  SELECT c.oid
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE (n.nspname = 'public' AND c.relname IN (
      'msg_conversations','msg_members','msg_messages','msg_attachments',
      'msg_blocks','msg_reports','msg_log','profiles','audit_logs',
      'admin_roles','admin_permissions','wilaya_assignments'
    ))
     OR (n.nspname = 'storage' AND c.relname = 'objects')
),
policy_functions AS (
  SELECT DISTINCT d.refobjid AS function_oid
  FROM pg_depend d
  JOIN pg_policy pol
    ON d.classid = 'pg_policy'::regclass AND d.objid = pol.oid
  JOIN target_relations tr ON tr.oid = pol.polrelid
  WHERE d.refclassid = 'pg_proc'::regclass
),
trigger_functions AS (
  SELECT DISTINCT t.tgfoid AS function_oid
  FROM pg_trigger t
  JOIN target_relations tr ON tr.oid = t.tgrelid
  WHERE NOT t.tgisinternal
),
selected_functions AS (
  SELECT p.oid
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND (
      p.proname LIKE 'msg\_%' ESCAPE '\'
      OR p.proname ILIKE '%verif%'
      OR p.proname ILIKE '%block%'
      OR p.proname ILIKE '%invitation%'
      OR p.oid IN (SELECT function_oid FROM policy_functions)
      OR p.oid IN (SELECT function_oid FROM trigger_functions)
    )
)
SELECT
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS identity_arguments,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC'
       ELSE grantee.rolname END AS grantee,
  a.privilege_type,
  a.is_grantable,
  pg_get_userbyid(a.grantor) AS grantor,
  pg_get_userbyid(p.proowner) AS function_owner
FROM selected_functions sf
JOIN pg_proc p ON p.oid = sf.oid
CROSS JOIN LATERAL aclexplode(
  COALESCE(p.proacl, acldefault('f', p.proowner))
) a
LEFT JOIN pg_roles grantee ON grantee.oid = a.grantee
WHERE a.privilege_type = 'EXECUTE'
ORDER BY p.proname, identity_arguments, grantee;

-- E. Rôles applicatifs et appartenances pertinentes : métadonnées seulement.
SELECT
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin,
  rolreplication,
  rolbypassrls
FROM pg_roles
WHERE rolname IN (
  'anon','authenticated','service_role','authenticator',
  'postgres','supabase_admin','dashboard_user'
)
ORDER BY rolname;

SELECT
  parent.rolname AS granted_role,
  member.rolname AS member_role,
  grantor.rolname AS grantor_role,
  m.admin_option
FROM pg_auth_members m
JOIN pg_roles parent ON parent.oid = m.roleid
JOIN pg_roles member ON member.oid = m.member
JOIN pg_roles grantor ON grantor.oid = m.grantor
WHERE parent.rolname IN ('anon','authenticated','service_role')
   OR member.rolname IN ('anon','authenticated','service_role')
ORDER BY parent.rolname, member.rolname;

-- F. Grants sur schémas et séquences publiques (ACL de catalogue seulement).
SELECT
  n.nspname AS schema_name,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC'
       ELSE r.rolname END AS grantee,
  a.privilege_type,
  a.is_grantable,
  pg_get_userbyid(a.grantor) AS grantor
FROM pg_namespace n
CROSS JOIN LATERAL aclexplode(
  COALESCE(n.nspacl, acldefault('n', n.nspowner))
) a
LEFT JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname IN ('public','storage','auth')
ORDER BY n.nspname, grantee, a.privilege_type;

SELECT
  n.nspname AS schema_name,
  c.relname AS sequence_name,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC'
       ELSE r.rolname END AS grantee,
  a.privilege_type,
  a.is_grantable,
  pg_get_userbyid(a.grantor) AS grantor
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
CROSS JOIN LATERAL aclexplode(
  COALESCE(c.relacl, acldefault('S', c.relowner))
) a
LEFT JOIN pg_roles r ON r.oid = a.grantee
WHERE c.relkind = 'S' AND n.nspname = 'public'
ORDER BY n.nspname, c.relname, grantee, a.privilege_type;

-- G. ACL par défaut qui peuvent accorder des droits aux futurs objets.
SELECT
  pg_get_userbyid(d.defaclrole) AS owner_role,
  n.nspname AS schema_name,
  d.defaclobjtype AS object_type,
  CASE WHEN a.grantee = 0 THEN 'PUBLIC'
       ELSE r.rolname END AS grantee,
  a.privilege_type,
  a.is_grantable
FROM pg_default_acl d
LEFT JOIN pg_namespace n ON n.oid = d.defaclnamespace
CROSS JOIN LATERAL aclexplode(d.defaclacl) a
LEFT JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname IN ('public','storage','auth')
   OR d.defaclnamespace = 0
ORDER BY owner_role, schema_name, object_type, grantee, a.privilege_type;

-- H. Tables réellement présentes dans les publications Realtime pertinentes.
SELECT pubname, schemaname, tablename
FROM pg_publication_tables
WHERE (schemaname = 'public' AND tablename IN (
    'msg_conversations','msg_members','msg_messages','msg_attachments',
    'msg_blocks','msg_reports','msg_log'
  ))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY pubname, schemaname, tablename;
