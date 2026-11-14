-- Lot 503: isolated Storage integration fixture. Ephemeral Supabase only.
-- No production identities, data, buckets, or secrets.
create table public.msg_conversations (
  id bigint generated always as identity primary key,
  created_by uuid not null references auth.users(id) on delete cascade
);
create table public.msg_members (
  conversation_id bigint not null references public.msg_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (conversation_id,user_id)
);
create table public.msg_messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.msg_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '',
  attachment_id bigint,
  created_at timestamptz not null default now()
);
create table public.msg_attachments (
  id bigint generated always as identity primary key,
  message_id bigint references public.msg_messages(id) on delete cascade,
  uploader uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  mime text not null,
  octets int not null default 0,
  sha256 text not null default '',
  statut text not null default 'pending' check (statut in ('pending','ok','retire')),
  created_at timestamptz not null default now()
);
create function public.msg_is_member(uid uuid, cid bigint)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select exists (
  select 1 from public.msg_members m
  where m.user_id=uid and m.conversation_id=cid
) $$;
alter table public.msg_messages enable row level security;
alter table public.msg_attachments enable row level security;
create policy "lot503 messages own read" on public.msg_messages
  for select to authenticated using (sender_id=auth.uid());
create policy "lot503 attachments own read" on public.msg_attachments
  for select to authenticated using (uploader=auth.uid());

create policy "lot503 messages insert own" on public.msg_messages
  for insert to authenticated with check (
    sender_id=auth.uid()
    and public.msg_is_member(auth.uid(),conversation_id)
  );
create policy "lot503 messages update own" on public.msg_messages
  for update to authenticated
  using (sender_id=auth.uid())
  with check (sender_id=auth.uid());
create policy "lot503 attachments insert own" on public.msg_attachments
  for insert to authenticated with check (
    uploader=auth.uid()
    and exists (
      select 1 from public.msg_messages m
      where m.id=message_id and m.sender_id=auth.uid()
    )
  );
create policy "lot503 attachments update own" on public.msg_attachments
  for update to authenticated
  using (uploader=auth.uid())
  with check (uploader=auth.uid());

grant usage on schema public to anon,authenticated,service_role;
grant select,insert,update,delete on public.msg_messages,public.msg_attachments to authenticated,service_role;
grant select,insert,update,delete on public.msg_conversations,public.msg_members to authenticated,service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('prive','prive',false,5242880,array['application/pdf'])
on conflict (id) do nothing;
-- Narrow upload rule matching the Messenger path contract used by msgUpload().
create policy "lot503 msg storage upload" on storage.objects
  for insert to authenticated with check (
    bucket_id='prive'
    and owner=auth.uid()
    and (storage.foldername(name))[1]='msg'
    and cardinality(storage.foldername(name))=2
    and split_part(name,'/',3) like auth.uid()::text || '-%'
    and case when (storage.foldername(name))[2] ~ '^[0-9]+$'
      then public.msg_is_member(auth.uid(),(storage.foldername(name))[2]::bigint)
      else false end
  );

-- Reproduce the pre-existing permissive owner-delete rule. PostgreSQL RLS
-- permissive policies combine with OR; the candidate must not widen this rule.
create policy "owner delete" on storage.objects
  for delete to authenticated using (
    bucket_id='prive'
    and owner=auth.uid()
    and (storage.foldername(name))[1]=auth.uid()::text
  );
