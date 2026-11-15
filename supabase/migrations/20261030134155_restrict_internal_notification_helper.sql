-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.notify(cible uuid, cle text, payload jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
begin
  insert into public.notifications (user_id, cle, payload)
  values (cible, cle, payload);
end $function$

revoke all on function public.notify(uuid,text,jsonb) from public, anon, authenticated;
