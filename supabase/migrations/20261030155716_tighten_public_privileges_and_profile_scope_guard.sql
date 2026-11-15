
BEGIN;

CREATE OR REPLACE FUNCTION public.profiles_scope_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.wilaya IS NOT DISTINCT FROM OLD.wilaya
     AND NEW.niveau IS NOT DISTINCT FROM OLD.niveau
     AND NEW.filiere IS NOT DISTINCT FROM OLD.filiere THEN
    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.id THEN
    RAISE EXCEPTION 'perimetre_propre_reserve_console';
  END IF;

  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF public.admin_can(auth.uid(), 'students.read')
     AND (OLD.wilaya IS NULL
          OR public.admin_sees_wilaya(auth.uid(), OLD.wilaya))
     AND NEW.wilaya IS NOT NULL
     AND public.admin_sees_wilaya(auth.uid(), NEW.wilaya) THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'perimetre_reserve_administration_autorisee';
END
$function$;

REVOKE ALL PRIVILEGES ON TABLE
  public.accounting_closures, public.admin_permissions, public.admin_roles,
  public.agreement_acceptances, public.agreements, public.audit_logs,
  public.child_links, public.documents_meta, public.lesson_content_trad,
  public.memoire_cards, public.notes, public.notifications, public.payments,
  public.platform_settings, public.receipts, public.seances_done,
  public.subscriptions, public.support_tickets, public.wilaya_assignments
FROM anon;

REVOKE ALL PRIVILEGES ON TABLE public.ads, public.lesson_content, public.plans FROM anon;
GRANT SELECT ON TABLE public.ads, public.lesson_content, public.plans TO anon;

REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
ON TABLE public.admin_permissions, public.admin_roles, public.platform_settings
FROM authenticated;
REVOKE INSERT
ON TABLE public.accounting_closures, public.audit_logs, public.receipts
FROM authenticated;
REVOKE UPDATE, DELETE ON TABLE public.notes FROM authenticated;
REVOKE INSERT, DELETE ON TABLE public.notifications FROM authenticated;
REVOKE DELETE ON TABLE public.support_tickets, public.profiles FROM authenticated;
REVOKE UPDATE ON TABLE public.child_links FROM authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

COMMIT;
