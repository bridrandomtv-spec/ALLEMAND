
CREATE OR REPLACE FUNCTION public.msg_touch_conversation_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
