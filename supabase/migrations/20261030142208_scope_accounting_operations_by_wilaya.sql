-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.accounting_depense(montant integer, categorie text, meta jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  nid bigint;
  wils text[];
  w text;
BEGIN
  IF NOT public.admin_can(auth.uid(), 'accounting.manage') THEN
    RAISE EXCEPTION 'permission_refusee';
  END IF;
  IF montant IS NULL OR montant <= 0 THEN
    RAISE EXCEPTION 'montant_depense_positif_attendu';
  END IF;
  wils := public.admin_wilayas(auth.uid());
  IF coalesce(cardinality(wils), 0) <> 1 THEN
    RAISE EXCEPTION 'perimetre_wilaya_ambigu';
  END IF;
  w := wils[1];
  INSERT INTO public.accounting_entries
    (sens, categorie, montant, ref_type, acteur, wilaya, meta)
  VALUES
    ('depense', coalesce(categorie, ''), montant, 'manuel', auth.uid(), w, coalesce(meta, '{}'::jsonb))
  RETURNING id INTO nid;
  PERFORM public.audit_log(
    'accounting.depense', 'accounting_entry', nid::text, NULL,
    jsonb_build_object('montant', montant, 'categorie', categorie, 'wilaya', w), ''
  );
  RETURN jsonb_build_object('ok', true, 'id', nid, 'wilaya', w);
END
$function$

CREATE OR REPLACE FUNCTION public.accounting_mark_rapproche(eid bigint, rapproche boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  w text;
BEGIN
  IF NOT public.admin_can(auth.uid(), 'accounting.manage') THEN
    RAISE EXCEPTION 'permission_refusee';
  END IF;
  SELECT e.wilaya INTO w
  FROM public.accounting_entries e
  WHERE e.id = eid
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ecriture_introuvable';
  END IF;
  IF NOT public.admin_sees_wilaya(auth.uid(), w) THEN
    RAISE EXCEPTION 'perimetre_wilaya_refuse';
  END IF;
  UPDATE public.accounting_entries e
  SET rapproche = $2
  WHERE e.id = $1;
  PERFORM public.audit_log(
    'accounting.rapprochement', 'accounting_entry', eid::text, NULL,
    jsonb_build_object('rapproche', $2, 'wilaya', w), ''
  );
  RETURN jsonb_build_object('ok', true, 'id', eid, 'rapproche', $2);
END
$function$

CREATE OR REPLACE FUNCTION public.accounting_close_month(periode text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  snap jsonb;
BEGIN
  IF NOT public.admin_can(auth.uid(), 'accounting.manage')
     OR public.admin_role_of(auth.uid()) IS DISTINCT FROM 'admin_general' THEN
    RAISE EXCEPTION 'permission_refusee';
  END IF;
  IF periode IS NULL OR periode !~ '^\d{4}-(0[1-9]|1[0-2])$' THEN
    RAISE EXCEPTION 'format_periode_invalide';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.accounting_closures c WHERE c.periode = accounting_close_month.periode
  ) THEN
    RAISE EXCEPTION 'periode_deja_close';
  END IF;
  snap := public.admin_report(
    (periode || '-01')::date,
    (date_trunc('month', (periode || '-01')::date) + interval '1 month - 1 day')::date
  );
  INSERT INTO public.accounting_closures (periode, closed_by, snapshot)
  VALUES (periode, auth.uid(), snap);
  PERFORM public.audit_log(
    'accounting.closure', 'accounting_closure', periode, NULL, snap, ''
  );
  RETURN jsonb_build_object('ok', true, 'periode', periode);
END
$function$

