-- Messagerie : édition limitée et activité mise à jour côté serveur.
-- Appliqué au projet azjwcybivirvpxbfhyzk le 2026-10-30.

BEGIN;

DROP POLICY IF EXISTS "msg messages edition" ON public.msg_messages;
CREATE POLICY "msg messages edition"
ON public.msg_messages
FOR UPDATE TO authenticated
USING (
  (auth.uid() = sender_id AND public.msg_is_member(auth.uid(), conversation_id))
  OR public.msg_is_moderator(auth.uid())
)
WITH CHECK (
  (auth.uid() = sender_id AND public.msg_is_member(auth.uid(), conversation_id))
  OR public.msg_is_moderator(auth.uid())
);

REVOKE UPDATE ON TABLE public.msg_messages FROM authenticated;
GRANT UPDATE (body, edited_at, deleted_at) ON TABLE public.msg_messages TO authenticated;

REVOKE UPDATE ON TABLE public.msg_attachments FROM authenticated;
GRANT UPDATE (statut) ON TABLE public.msg_attachments TO authenticated;

CREATE OR REPLACE FUNCTION public.msg_touch_conversation_fn()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'pg_catalog','public'
AS $$
BEGIN
  UPDATE public.msg_conversations
     SET last_activity = NEW.created_at
   WHERE id = NEW.conversation_id
     AND (last_activity IS NULL OR last_activity < NEW.created_at);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.msg_touch_conversation_fn() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS msg_touch_conversation ON public.msg_messages;
CREATE TRIGGER msg_touch_conversation
AFTER INSERT ON public.msg_messages
FOR EACH ROW EXECUTE FUNCTION public.msg_touch_conversation_fn();

COMMIT;
