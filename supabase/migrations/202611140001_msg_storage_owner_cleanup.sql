-- Lot 502 — Messenger Storage owner-scoped cleanup
-- CANDIDATE ONLY: do not apply to the active Supabase project before isolated tests.
-- Preconditions: public.msg_messages, public.msg_attachments and bucket 'prive'.
-- Preserve the existing generic owner-delete policy.

begin;

-- Derive identity from auth.uid(); callers cannot impersonate another uploader.
-- SECURITY DEFINER permits a reliable linkage check even when table RLS hides rows.
create or replace function public.msg_storage_cleanup_allowed(p_path text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
    and split_part(p_path, '/', 1) = 'msg'
    and cardinality(storage.foldername(p_path)) = 2
    and (storage.foldername(p_path))[2] ~ '^[0-9]+$'
    and split_part(p_path, '/', 3) like auth.uid()::text || '-%'
    and not exists (
      select 1
      from public.msg_attachments a
      join public.msg_messages m on m.id = a.message_id
      where a.storage_path = p_path
        and a.uploader = auth.uid()
        and m.attachment_id = a.id
    );
$$;

create or replace function public.msg_attachment_cleanup_allowed(p_attachment_id bigint)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.msg_attachments a
    join public.msg_messages m on m.id = a.message_id
    where a.id = p_attachment_id
      and a.uploader = auth.uid()
      and a.statut = 'pending'
      and m.sender_id = auth.uid()
      and m.attachment_id is distinct from a.id
  );
$$;

revoke all on function public.msg_storage_cleanup_allowed(text) from public, anon;
revoke all on function public.msg_attachment_cleanup_allowed(bigint) from public, anon;
grant execute on function public.msg_storage_cleanup_allowed(text) to authenticated;
grant execute on function public.msg_attachment_cleanup_allowed(bigint) to authenticated;

drop policy if exists "msg storage delete own" on storage.objects;
create policy "msg storage delete own"
  on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'prive'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = 'msg'
    and cardinality(storage.foldername(name)) = 2
    and split_part(name, '/', 3) like auth.uid()::text || '-%'
    and (storage.foldername(name))[2] ~ '^[0-9]+$'
    -- Linked attachment objects are not eligible for orphan cleanup.
    and public.msg_storage_cleanup_allowed(name)
  );

drop policy if exists "msg att cleanup own unlinked" on public.msg_attachments;
create policy "msg att cleanup own unlinked"
  on public.msg_attachments
  for delete to authenticated
  using (public.msg_attachment_cleanup_allowed(id));

commit;
