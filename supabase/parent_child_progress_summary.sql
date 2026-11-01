-- Script SQL autonome préparé pour le RPC de rapport parent-enfant.
-- Ce dépôt ne contient actuellement ni supabase/config.toml ni historique
-- Supabase CLI de migrations. Ce fichier n'est donc PAS présenté comme une
-- migration CLI générée. Ne pas l'exécuter en production sans validation
-- préalable sur un projet Supabase de test et revue des types/ACL.
--
-- Préconditions vérifiées sur la base actuelle :
--   * public.child_active_entitlement(uuid, uuid) existe.
--   * profiles, child_links, subscriptions, seances_done, notes,
--     memoire_cards existent avec les colonnes référencées.
--
-- Contrôle : rôle parent + rôle élève + lien confirmé + abonnement actif
-- du parent OU de l'enfant, vérifiés côté serveur.

BEGIN;

--   * les tables profiles, child_links, subscriptions, seances_done,
--     notes et memoire_cards possèdent les colonnes référencées ci-dessous.
--
-- La fonction vérifie l'identité, le rôle parent, le rôle enfant, le lien
-- confirmé et l'abonnement actif du parent OU de l'enfant côté serveur.

BEGIN;

CREATE OR REPLACE FUNCTION public.parent_child_progress_summary(p_child_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'pg_catalog','public'
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'auth_required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'parent'
  ) THEN
    RAISE EXCEPTION 'parent_role_required';
  END IF;

  IF p_child_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = p_child_id AND role = 'eleve'
  ) THEN
    RAISE EXCEPTION 'compte_eleve_introuvable';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.child_links
    WHERE parent_id = auth.uid() AND child_id = p_child_id
  ) THEN
    RAISE EXCEPTION 'lien_parent_enfant_non_confirme';
  END IF;

  -- Même règle que ACCESS.canAccessParentChild :
  -- abonnement actif du parent OU de l'enfant.
  -- La vérification est serveur et ne dépend pas du paywall JavaScript.
  IF NOT (
    EXISTS (
      SELECT 1
      FROM public.subscriptions s
      WHERE s.user_id = auth.uid()
        AND s.statut = 'actif'
        AND (s.fin IS NULL OR s.fin > now())
    )
    OR public.child_active_entitlement(auth.uid(), p_child_id)
  ) THEN
    RAISE EXCEPTION 'abonnement_requis';
  END IF;

  SELECT jsonb_build_object(
    'seances_total', (
      SELECT count(*)
      FROM public.seances_done
      WHERE user_id = p_child_id
    ),
    'seances_7j', (
      SELECT count(*)
      FROM public.seances_done
      WHERE user_id = p_child_id
        AND at >= now() - interval '7 days'
    ),
    'par_unite', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object('unite', q.unite, 'total', q.total)
        ORDER BY q.unite
      )
      FROM (
        SELECT unite, count(*) AS total
        FROM public.seances_done
        WHERE user_id = p_child_id
        GROUP BY unite
      ) q
    ), '[]'::jsonb),
    'notes_total', (
      SELECT count(*)
      FROM public.notes
      WHERE eleve_id = p_child_id
    ),
    'notes_moyenne', (
      SELECT round(avg(valeur), 2)
      FROM public.notes
      WHERE eleve_id = p_child_id
    ),
    'cartes_total', (
      SELECT count(*)
      FROM public.memoire_cards
      WHERE user_id = p_child_id
    ),
    'cartes_fragiles', (
      SELECT count(*)
      FROM public.memoire_cards
      WHERE user_id = p_child_id
        AND (COALESCE(box, 0) <= 2 OR COALESCE(misses, 0) >= 2)
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.parent_child_progress_summary(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.parent_child_progress_summary(uuid)
  TO authenticated;

COMMIT;

