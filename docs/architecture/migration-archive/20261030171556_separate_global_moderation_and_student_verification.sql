
BEGIN;

-- Only the national administrator receives global moderation and verification.
INSERT INTO public.admin_permissions(role_cle, permission)
VALUES
  ('admin_general','messaging.moderate'),
  ('admin_general','students.verify')
ON CONFLICT (role_cle, permission) DO NOTHING;

-- A professor is no longer a global moderator.
CREATE OR REPLACE FUNCTION public.msg_is_moderator(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'pg_catalog','public'
AS $function$
  SELECT auth.uid() IS NOT NULL
     AND uid = auth.uid()
     AND (
       public.is_admin()
       OR public.admin_can(auth.uid(), 'messaging.moderate')
     );
$function$;

-- Student verification is independent from messaging moderation.
CREATE OR REPLACE FUNCTION public.profiles_verif_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog','public'
AS $function$
DECLARE
  can_verify boolean;
BEGIN
  IF NEW.verif_statut IS NOT DISTINCT FROM OLD.verif_statut
     AND NEW.verif_by IS NOT DISTINCT FROM OLD.verif_by
     AND NEW.matricule IS NOT DISTINCT FROM OLD.matricule
     AND NEW.section IS NOT DISTINCT FROM OLD.section THEN
    RETURN NEW;
  END IF;

  can_verify := auth.uid() IS NOT NULL
    AND (
      public.is_admin()
      OR public.admin_can(auth.uid(), 'students.verify')
    );

  IF can_verify THEN
    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.id
     AND OLD.verif_statut IN ('non_verifie','rejete')
     AND NEW.verif_statut = 'en_attente'
     AND NEW.verif_by IS NOT DISTINCT FROM OLD.verif_by THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'verif_reservee_moderation';
END;
$function$;

COMMIT;
