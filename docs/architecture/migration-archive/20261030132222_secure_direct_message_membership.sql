CREATE OR REPLACE FUNCTION public.msg_member_ok(cid bigint, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.msg_conversations c
    WHERE c.id = cid
      AND (
        (c.type = 'direct'
          AND (SELECT count(*) FROM public.msg_members m
               WHERE m.conversation_id = cid) < 2)
        OR
        (c.type <> 'direct'
          AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = uid
              AND p.wilaya IS NOT NULL
              AND p.niveau IS NOT NULL
              AND p.wilaya = c.wilaya
              AND p.niveau = c.niveau
              AND (c.filiere IS NULL OR p.filiere = c.filiere)
          ))
      )
  );
$function$;

CREATE OR REPLACE FUNCTION public.msg_guard_direct()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_type text;
  v_other uuid;
  v_count integer;
BEGIN
  SELECT c.type
    INTO v_type
    FROM public.msg_conversations c
   WHERE c.id = NEW.conversation_id
   FOR UPDATE;

  IF v_type = 'direct' THEN
    SELECT count(*)
      INTO v_count
      FROM public.msg_members m
     WHERE m.conversation_id = NEW.conversation_id;

    IF v_count >= 2 THEN
      RAISE EXCEPTION 'msg_direct_complet';
    END IF;

    IF v_count = 1 THEN
      SELECT m.user_id
        INTO v_other
        FROM public.msg_members m
       WHERE m.conversation_id = NEW.conversation_id
         AND m.user_id <> NEW.user_id
       LIMIT 1;

      IF v_other IS NULL OR NOT public.msg_can_dm(NEW.user_id, v_other) THEN
        RAISE EXCEPTION 'msg_dm_interdit';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;