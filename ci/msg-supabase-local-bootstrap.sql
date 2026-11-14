-- Local Supabase integration fixture for Messenger only.
-- Runs exclusively against the ephemeral Supabase CLI stack in GitHub Actions.
-- No production data, secrets, or real student identities.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null,
  verif_statut text not null,
  pseudo text not null,
  wilaya text,
  niveau text,
  filiere text
);

create table public.msg_conversations (
  id bigint generated always as identity primary key,
  type text not null check (type in ('direct','groupe')),
  wilaya text,
  niveau text,
  filiere text,
  titre text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_activity timestamptz not null default now()
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
  flagged int not null default 0,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table public.msg_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  primary key (blocker_id,blocked_id),
  check (blocker_id <> blocked_id)
);

create function public.msg_is_moderator(uid uuid)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select false $$;

create function public.msg_is_member(uid uuid,cid bigint)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select auth.uid() is not null and uid=auth.uid()
  and exists(select 1 from public.msg_members m where m.conversation_id=cid and m.user_id=uid) $$;

create function public.msg_member_ok(cid bigint,uid uuid)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select exists(select 1 from public.msg_conversations c
  where c.id=cid and (c.type='direct' or exists(
    select 1 from public.profiles p where p.id=uid
      and p.wilaya=c.wilaya and p.niveau=c.niveau
      and (c.filiere is null or p.filiere=c.filiere)))) $$;

create function public.msg_can_dm(a uuid,b uuid)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select auth.uid() is not null and a<>b $$;

create function public.msg_not_blocked(cid bigint,snd uuid)
returns boolean language sql stable security definer
set search_path=pg_catalog,public
as $$ select not exists(select 1 from public.msg_members m
  join public.msg_blocks b on b.blocker_id=m.user_id and b.blocked_id=snd
  where m.conversation_id=cid) $$;

create function public.msg_open_direct(p_peer uuid)
returns bigint language sql security definer
set search_path=pg_catalog,public
as $$ select null::bigint $$;

alter table public.msg_conversations enable row level security;
alter table public.msg_members enable row level security;
alter table public.msg_blocks enable row level security;
alter table public.msg_messages enable row level security;
alter table public.profiles enable row level security;

create policy "msg conv lecture" on public.msg_conversations
  for select to authenticated
  using (public.msg_is_member(auth.uid(),id) or public.msg_is_moderator(auth.uid()));
create policy "msg conv creation" on public.msg_conversations
  for insert to authenticated
  with check (auth.uid()=created_by and (type='direct' or public.msg_is_moderator(auth.uid())));
create policy "msg members lecture" on public.msg_members
  for select to authenticated
  using (public.msg_is_member(auth.uid(),conversation_id) or public.msg_is_moderator(auth.uid()));
create policy "msg members ajout" on public.msg_members
  for insert to authenticated
  with check (auth.uid()=user_id and public.msg_member_ok(conversation_id,auth.uid()));

create policy "msg messages lecture" on public.msg_messages
  for select to authenticated
  using (public.msg_is_member(auth.uid(),conversation_id) or public.msg_is_moderator(auth.uid()));
create policy "msg messages envoi" on public.msg_messages
  for insert to authenticated
  with check (auth.uid()=sender_id
    and public.msg_is_member(auth.uid(),conversation_id)
    and public.msg_not_blocked(conversation_id,sender_id));
create policy "msg messages edition" on public.msg_messages
  for update to authenticated
  using (auth.uid()=sender_id or public.msg_is_moderator(auth.uid()))
  with check (auth.uid()=sender_id or public.msg_is_moderator(auth.uid()));

grant usage on schema public to anon,authenticated,service_role;
grant select on public.msg_conversations,public.msg_members to authenticated;
grant all on public.profiles to service_role;

grant select, insert, delete on public.msg_messages to authenticated;
grant update (body, edited_at, deleted_at) on public.msg_messages to authenticated;
grant usage, select on sequence public.msg_messages_id_seq to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname='supabase_realtime') then
    alter publication supabase_realtime add table public.msg_messages;
  end if;
exception when duplicate_object then null;
end $$;
