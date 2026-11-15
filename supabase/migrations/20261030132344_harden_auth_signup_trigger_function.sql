-- Reconciled from the live Supabase catalog for the recorded applied migration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id,pseudo,role,niveau,filiere,wilaya)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'pseudo',''),
    'eleve',
    NEW.raw_user_meta_data->>'niveau',
    NEW.raw_user_meta_data->>'filiere',
    NEW.raw_user_meta_data->>'wilaya'
  )
  ON CONFLICT (id) DO NOTHING;

  IF lower(COALESCE(NEW.raw_user_meta_data->>'requested_role',''))='parent' THEN
    INSERT INTO public.parent_role_requests(user_id,status)
    VALUES (NEW.id,'pending')
    ON CONFLICT (user_id) WHERE status='pending' DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$

revoke all on function public.handle_new_user() from public, anon, authenticated;
