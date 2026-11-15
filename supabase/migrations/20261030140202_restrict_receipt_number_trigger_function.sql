-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.receipts_tr_numero_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
begin
  if new.numero is null or new.numero = '' then
    new.numero := 'REC-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.receipts_seq')::text, 6, '0');
  end if;
  return new;
end $function$

revoke all on function public.receipts_tr_numero_fn() from public, anon, authenticated;
