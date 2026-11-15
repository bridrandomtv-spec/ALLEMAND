
DROP POLICY IF EXISTS "msg messages edition" ON public.msg_messages;
CREATE POLICY "msg messages edition"
ON public.msg_messages
FOR UPDATE
TO authenticated
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
