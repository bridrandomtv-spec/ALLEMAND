-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.immutable_accounting_entry()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
    -- Une écriture comptable ne peut jamais être supprimée.
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'ligne_immuable_%', TG_TABLE_NAME;
    END IF;

    -- Seul le champ rapproche peut être modifié.
    IF (to_jsonb(NEW) - 'rapproche')
       IS DISTINCT FROM
       (to_jsonb(OLD) - 'rapproche') THEN
        RAISE EXCEPTION 'ligne_immuable_%', TG_TABLE_NAME;
    END IF;

    RETURN NEW;
END;
$function$

revoke all on function public.immutable_accounting_entry() from public, anon, authenticated;
