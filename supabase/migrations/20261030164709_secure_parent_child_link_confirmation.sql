-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.respond_parent_link_request(p_request_id bigint, p_accept boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
DECLARE
  v_req public.parent_link_requests%ROWTYPE;
  v_parent_role text;
  v_child_role text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'auth_required';
  END IF;
  IF p_request_id IS NULL OR p_accept IS NULL THEN
    RAISE EXCEPTION 'parametres_invalides';
  END IF;

  SELECT * INTO v_req
  FROM public.parent_link_requests
  WHERE id = p_request_id
    AND child_id = auth.uid()
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'demande_indisponible';
  END IF;

  SELECT role INTO v_parent_role FROM public.profiles WHERE id = v_req.parent_id;
  SELECT role INTO v_child_role FROM public.profiles WHERE id = auth.uid();

  IF v_parent_role IS DISTINCT FROM 'parent'
     OR v_child_role IS DISTINCT FROM 'eleve' THEN
    RAISE EXCEPTION 'roles_incompatibles';
  END IF;

  IF p_accept THEN
    INSERT INTO public.child_links(parent_id, child_id)
    VALUES (v_req.parent_id, v_req.child_id)
    ON CONFLICT (parent_id, child_id) DO NOTHING;
    UPDATE public.parent_link_requests
      SET status='accepted', decided_at=now(), decided_by=auth.uid()
      WHERE id=v_req.id;
  ELSE
    UPDATE public.parent_link_requests
      SET status='rejected', decided_at=now(), decided_by=auth.uid()
      WHERE id=v_req.id;
  END IF;

  RETURN jsonb_build_object('ok', true, 'status',
    CASE WHEN p_accept THEN 'accepted' ELSE 'rejected' END);
END;
$function$

CREATE OR REPLACE FUNCTION public.cancel_parent_link_request(p_request_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'auth_required'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id=auth.uid() AND role='parent'
  ) THEN RAISE EXCEPTION 'parent_role_required'; END IF;

  UPDATE public.parent_link_requests
    SET status='cancelled', decided_at=now(), decided_by=auth.uid()
    WHERE id=p_request_id AND parent_id=auth.uid() AND status='pending';

  IF NOT FOUND THEN RAISE EXCEPTION 'demande_indisponible'; END IF;
  RETURN jsonb_build_object('ok',true,'status','cancelled');
END;
$function$

CREATE OR REPLACE FUNCTION public.my_parent_link_requests()
 RETURNS TABLE(request_id bigint, parent_id uuid, parent_pseudo text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
  SELECT r.id, r.parent_id, COALESCE(p.pseudo,''), r.created_at
  FROM public.parent_link_requests r
  LEFT JOIN public.profiles p ON p.id = r.parent_id
  WHERE auth.uid() IS NOT NULL
    AND r.child_id = auth.uid()
    AND r.status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.profiles me
      WHERE me.id = auth.uid() AND me.role = 'eleve'
    )
  ORDER BY r.created_at DESC;
$function$

CREATE OR REPLACE FUNCTION public.my_child_link_requests()
 RETURNS TABLE(request_id bigint, child_id uuid, child_pseudo text, status text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
  SELECT r.id, r.child_id, COALESCE(p.pseudo,''), r.status, r.created_at
  FROM public.parent_link_requests r
  LEFT JOIN public.profiles p ON p.id = r.child_id
  WHERE auth.uid() IS NOT NULL
    AND r.parent_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles me
      WHERE me.id = auth.uid() AND me.role = 'parent'
    )
  ORDER BY r.created_at DESC
  LIMIT 100;
$function$

CREATE OR REPLACE FUNCTION public.my_linked_children()
 RETURNS TABLE(child_id uuid, pseudo text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
  SELECT l.child_id, COALESCE(p.pseudo, '')
  FROM public.child_links l
  LEFT JOIN public.profiles p ON p.id=l.child_id
  WHERE l.parent_id=auth.uid()
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles me
      WHERE me.id=auth.uid() AND me.role='parent'
    );
$function$

