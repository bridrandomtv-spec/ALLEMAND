-- Lot 385 — export canonique du manifeste de structure Messenger.
-- STRICTEMENT SELECT ONLY : aucun contenu de conversation ou ligne applicative.
-- Exécuter sur Supabase actif en lecture seule puis sur la base locale restaurée.
WITH target_tables AS (
 SELECT c.oid,c.relname,c.relrowsecurity,c.relforcerowsecurity
 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='public' AND c.relname IN
 ('msg_conversations','msg_members','msg_messages','msg_attachments','msg_blocks','msg_reports','msg_log','profiles','audit_logs','admin_roles','admin_permissions','wilaya_assignments')
), target_funcs AS (
 SELECT p.oid,p.proname,pg_get_function_identity_arguments(p.oid) args,
        p.prosecdef,p.provolatile,l.lanname,p.proconfig,pg_get_functiondef(p.oid) definition
 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
 JOIN pg_language l ON l.oid=p.prolang
 WHERE n.nspname='public' AND p.proname IN
 ('msg_open_direct','msg_can_dm','msg_member_ok','msg_not_blocked','msg_guard_direct','msg_rate_limit','profiles_verif_guard','profiles_scope_guard','handle_new_user','audit_log')
)
SELECT jsonb_build_object(
 'format_version',1,
 'scope','public Messenger tables/functions; catalog metadata only',
 'tables',(SELECT jsonb_agg(jsonb_build_object('name',relname,'rls',relrowsecurity,'force_rls',relforcerowsecurity) ORDER BY relname) FROM target_tables),
 'policies',(SELECT jsonb_agg(jsonb_build_object('table',tablename,'name',policyname,'command',cmd,'roles',roles,'using',qual,'with_check',with_check) ORDER BY tablename,policyname) FROM pg_policies WHERE schemaname='public' AND tablename IN (SELECT relname FROM target_tables)),
 'triggers',(SELECT jsonb_agg(jsonb_build_object('table',t.relname,'name',g.tgname,'enabled',g.tgenabled,'definition',pg_get_triggerdef(g.oid,true)) ORDER BY t.relname,g.tgname) FROM pg_trigger g JOIN target_tables t ON t.oid=g.tgrelid WHERE NOT g.tgisinternal),
 'constraints',(SELECT jsonb_agg(jsonb_build_object('table',t.relname,'name',c.conname,'type',c.contype,'definition',pg_get_constraintdef(c.oid,true)) ORDER BY t.relname,c.conname) FROM pg_constraint c JOIN target_tables t ON t.oid=c.conrelid),
 'indexes',(SELECT jsonb_agg(jsonb_build_object('table',t.relname,'name',i.indexrelid::regclass::text,'definition',pg_get_indexdef(i.indexrelid)) ORDER BY t.relname,i.indexrelid::regclass::text) FROM pg_index i JOIN target_tables t ON t.oid=i.indrelid),
 'functions',(SELECT jsonb_agg(jsonb_build_object('name',proname,'identity_args',args,'security_definer',prosecdef,'volatility',provolatile,'language',lanname,'config',proconfig,'definition',definition) ORDER BY proname,args) FROM target_funcs)
) AS messenger_catalog_manifest;
