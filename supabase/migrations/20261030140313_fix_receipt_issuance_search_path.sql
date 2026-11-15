-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.issue_receipt(pid bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare pay public.payments%rowtype; rec public.receipts%rowtype; w text := '';
begin
  if not public.admin_can(auth.uid(), 'receipts.issue') then raise exception 'permission_refusee'; end if;
  select * into pay from public.payments where id = pid;
  if not found then raise exception 'paiement_introuvable'; end if;
  if pay.statut not in ('confirme','valide') then raise exception 'recu_apres_confirmation_seulement'; end if;
  select coalesce(p.wilaya,'') into w from public.profiles p where p.id = pay.user_id;
  if not public.admin_sees_wilaya(auth.uid(), w) then raise exception 'wilaya_hors_perimetre'; end if;
  if exists (select 1 from public.receipts r where r.payment_id = pid) then raise exception 'recu_deja_emis'; end if;
  insert into public.receipts (payment_id, user_id, montant, devise, methode, ref_plateforme, emis_par)
  values (pay.id, pay.user_id, pay.montant, pay.devise, pay.methode, pay.ref_plateforme, auth.uid())
  returning * into rec;
  perform public.audit_log('receipt.issue','receipt', rec.id::text, null,
    jsonb_build_object('numero', rec.numero, 'payment', pid), w);
  return jsonb_build_object('ok', true, 'numero', rec.numero, 'id', rec.id);
end $function$

revoke all on function public.issue_receipt(bigint) from public, anon;
grant execute on function public.issue_receipt(bigint) to authenticated;
