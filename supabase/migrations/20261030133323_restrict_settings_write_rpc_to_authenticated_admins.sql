-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.setting_set(cle text, valeur jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
begin
  if not public.admin_can(auth.uid(), 'settings.manage') then raise exception 'permission_refusee'; end if;
  insert into public.platform_settings (cle, valeur, maj_par) values (cle, valeur, auth.uid())
  on conflict (cle) do update set valeur = excluded.valeur, maj_par = excluded.maj_par, maj_at = now();
  perform public.audit_log('setting.change','platform_setting', cle, null, valeur, '');
  return jsonb_build_object('ok', true);
end $function$

revoke all on function public.setting_set(text,jsonb) from public, anon;
grant execute on function public.setting_set(text,jsonb) to authenticated;
