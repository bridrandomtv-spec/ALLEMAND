
BEGIN;

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
      OR (
        public.admin_can(auth.uid(), 'students.verify')
        AND public.admin_sees_wilaya(auth.uid(), NEW.wilaya)
      )
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

DROP POLICY IF EXISTS "profils en attente visibles modérateurs" ON public.profiles;
CREATE POLICY "profils en attente visibles modérateurs"
ON public.profiles FOR SELECT TO authenticated
USING (
  verif_statut = 'en_attente'
  AND (
    public.is_admin()
    OR (
      public.admin_can(auth.uid(), 'students.verify')
      AND public.admin_sees_wilaya(auth.uid(), wilaya)
    )
  )
);

DROP POLICY IF EXISTS "verif update par modérateurs" ON public.profiles;
CREATE POLICY "verif update par modérateurs"
ON public.profiles FOR UPDATE TO authenticated
USING (
  verif_statut = 'en_attente'
  AND (
    public.is_admin()
    OR (
      public.admin_can(auth.uid(), 'students.verify')
      AND public.admin_sees_wilaya(auth.uid(), wilaya)
    )
  )
)
WITH CHECK (
  public.is_admin()
  OR (
    public.admin_can(auth.uid(), 'students.verify')
    AND public.admin_sees_wilaya(auth.uid(), wilaya)
  )
);

COMMIT;
