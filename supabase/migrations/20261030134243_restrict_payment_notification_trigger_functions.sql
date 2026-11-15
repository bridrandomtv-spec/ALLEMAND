-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.notify_tr_payment_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
begin
  if new.statut in ('confirme','valide') and old.statut not in ('confirme','valide') then
    perform public.notify(new.user_id, 'paiement_confirme',
      jsonb_build_object('payment', new.id, 'montant', new.montant));
  end if;
  return new;
end $function$

CREATE OR REPLACE FUNCTION public.notify_tr_receipt_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
begin
  perform public.notify(new.user_id, 'recu_emis',
    jsonb_build_object('numero', new.numero, 'payment', new.payment_id));
  return new;
end $function$

revoke all on function public.notify_tr_payment_fn() from public, anon, authenticated;
revoke all on function public.notify_tr_receipt_fn() from public, anon, authenticated;
