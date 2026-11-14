-- Lot 502 — Messenger Storage owner-scoped cleanup
-- CANDIDATE ONLY: do not apply to the active Supabase project before isolated tests.
-- Preconditions: public.msg_messages, public.msg_attachments, public.msg_is_member()
-- and the bucket 'prive' already exist. Existing owner delete policy is preserved
-- for non-Messenger user files; this adds a separate, narrower Messenger policy.

begin;

drop policy if exists "msg storage delete own" on storage.objects;
create policy "msg storage delete own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'prive'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = 'msg'
    -- Messenger path contract: msg/<conversation_id>/<uploader-...filename>
    and cardinality(storage.foldername(name)) = 2
    and split_part(name, '/', 3) like auth.uid()::text || '-%'
    -- Guard the cast: malformed path segments must deny, not raise.
    and case
      when (storage.foldername(name))[2] ~ '^[0-9]+$'
        then true
      else false
    end
  );

-- Permit the uploader to remove only a pending metadata row that was never
-- linked to its message. Linked attachments remain protected from self-delete.
drop policy if exists "msg att cleanup own unlinked" on public.msg_attachments;
create policy "msg att cleanup own unlinked"
  on public.msg_attachments
  for delete
  to authenticated
  using (
    uploader = auth.uid()
    and statut = 'pending'
    and exists (
      select 1
      from public.msg_messages m
      where m.id = message_id
        and m.sender_id = auth.uid()
        and m.attachment_id is distinct from public.msg_attachments.id
    )
  );

commit;
