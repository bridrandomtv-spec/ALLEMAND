-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.admin_report(debut date DEFAULT NULL::date, fin date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  general boolean;
  wils text[];
  out jsonb;
begin
  if not public.admin_can(auth.uid(), 'reports.read') then
    raise exception 'permission_refusee';
  end if;

  general := (public.admin_role_of(auth.uid()) = 'admin_general');
  wils := public.admin_wilayas(auth.uid());

  if debut is not null and fin is not null and debut > fin then
    raise exception 'periode_invalide';
  end if;

  select jsonb_build_object(
    'perimetre', case when general then 'national' else array_to_string(wils, ',') end,
    'recettes_da', (
      select coalesce(sum(e.montant),0)
      from public.accounting_entries e
      where e.sens = 'recette'
        and (general or e.wilaya = any(wils))
        and (debut is null or e.at::date >= debut)
        and (fin is null or e.at::date <= fin)
    ),
    'remboursements_da', (
      select coalesce(sum(-e.montant),0)
      from public.accounting_entries e
      where e.sens = 'remboursement'
        and (general or e.wilaya = any(wils))
        and (debut is null or e.at::date >= debut)
        and (fin is null or e.at::date <= fin)
    ),
    'depenses_da', (
      select coalesce(sum(e.montant),0)
      from public.accounting_entries e
      where e.sens = 'depense'
        and (general or e.wilaya = any(wils))
        and (debut is null or e.at::date >= debut)
        and (fin is null or e.at::date <= fin)
    ),
    'par_wilaya', (
      select coalesce(jsonb_object_agg(wl, mt), '{}')
      from (
        select e.wilaya as wl, sum(e.montant) as mt
        from public.accounting_entries e
        where e.sens = 'recette'
          and (general or e.wilaya = any(wils))
          and (debut is null or e.at::date >= debut)
          and (fin is null or e.at::date <= fin)
        group by e.wilaya
      ) s
    ),
    'par_mois', (
      select coalesce(jsonb_object_agg(mo, mt), '{}')
      from (
        select to_char(e.at,'YYYY-MM') as mo, sum(e.montant) as mt
        from public.accounting_entries e
        where e.sens = 'recette'
          and (general or e.wilaya = any(wils))
          and (debut is null or e.at::date >= debut)
          and (fin is null or e.at::date <= fin)
        group by mo
        order by mo
      ) s
    ),
    'par_methode', (
      select coalesce(jsonb_object_agg(me, mt), '{}')
      from (
        select e.methode as me, sum(e.montant) as mt
        from public.accounting_entries e
        where e.sens = 'recette'
          and (general or e.wilaya = any(wils))
          and (debut is null or e.at::date >= debut)
          and (fin is null or e.at::date <= fin)
        group by e.methode
      ) s
    ),
    'paiements_sans_ecriture', (
      select count(*)
      from public.payments pay
      join public.profiles p on p.id = pay.user_id
      where pay.statut in ('confirme','valide')
        and (general or p.wilaya = any(wils))
        and not exists (
          select 1 from public.accounting_entries e
          where e.ref_type = 'payment' and e.ref_id = pay.id::text
        )
    ),
    'ecritures_orphelines', (
      select count(*)
      from public.accounting_entries e
      where e.ref_type = 'payment'
        and e.ref_id <> ''
        and (general or e.wilaya = any(wils))
        and not exists (
          select 1 from public.payments pay
          where pay.id::text = e.ref_id
        )
    ),
    'ecritures_rapproches', (
      select count(*)
      from public.accounting_entries e
      where e.rapproche
        and (general or e.wilaya = any(wils))
    ),
    'tickets_ouverts', (
      select count(*)
      from public.support_tickets t
      join public.profiles p on p.id = t.user_id
      where t.statut in ('ouvert','en_cours')
        and (general or p.wilaya = any(wils))
    )
  ) into out;

  return out;
end;
$function$

revoke all on function public.admin_report(date,date) from public, anon;
grant execute on function public.admin_report(date,date) to authenticated;
