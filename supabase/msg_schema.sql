-- ══════════════════════════════════════════════════════════════
--  supabase/msg_schema.sql — LOT 1 · messagerie nationale EduDZ
--  À COLLER DANS SUPABASE SQL EDITOR (après schema.sql) — JAMAIS exécuté
--  par un robot : ce fichier est préparé, validé statiquement, non exécuté.
--  Idempotent (create if not exists / create or replace / drop policy if exists).
--  Sécurité mineurs : AUCUN grant anon · DM limités au groupe scolaire commun
--  (wilaya+niveau+filière) · rate-limit serveur · auto-flag liens · journal
--  de modération immuable · supervision parentale NON incluse (décision propriétaire).
-- ══════════════════════════════════════════════════════════════

-- ── tables ──
create table if not exists public.msg_conversations (
  id bigint generated always as identity primary key,
  type text not null check (type in ('direct','groupe')),
  wilaya text, niveau text, filiere text,
  titre text not null default '',
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  last_activity timestamptz not null default now()
);
create index if not exists msg_conv_type_idx on public.msg_conversations(type);
create index if not exists msg_conv_geo_idx  on public.msg_conversations(wilaya,niveau,filiere);

create table if not exists public.msg_members (
  conversation_id bigint not null references public.msg_conversations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null default 'member' check (role in ('member','moderateur')),
  joined_at timestamptz not null default now(),
  muted_until timestamptz,
  primary key (conversation_id, user_id)
);
create index if not exists msg_members_user_idx on public.msg_members(user_id);

create table if not exists public.msg_messages (
  id bigint generated always as identity primary key,
  conversation_id bigint not null references public.msg_conversations on delete cascade,
  sender_id uuid not null references auth.users on delete cascade,
  body text not null default '',
  attachment_id bigint,
  flagged int not null default 0,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
create index if not exists msg_msg_conv_idx   on public.msg_messages(conversation_id, created_at desc);
create index if not exists msg_msg_sender_idx on public.msg_messages(sender_id, created_at desc);

create table if not exists public.msg_attachments (
  id bigint generated always as identity primary key,
  message_id bigint references public.msg_messages on delete cascade,
  uploader uuid not null references auth.users on delete cascade,
  storage_path text not null,
  mime text not null,
  octets int not null default 0,
  sha256 text not null default '',
  statut text not null default 'pending' check (statut in ('pending','ok','retire')),
  created_at timestamptz not null default now()
);
create index if not exists msg_att_msg_idx on public.msg_attachments(message_id);

create table if not exists public.msg_reports (
  id bigint generated always as identity primary key,
  message_id bigint not null references public.msg_messages on delete cascade,
  reporter_id uuid not null references auth.users on delete cascade,
  motif text not null default '',
  statut text not null default 'ouvert' check (statut in ('ouvert','traite','rejete')),
  handled_by uuid references auth.users on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (message_id, reporter_id)
);

create table if not exists public.msg_blocks (
  blocker_id uuid not null references auth.users on delete cascade,
  blocked_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.msg_log (
  id bigint generated always as identity primary key,
  actor_id uuid not null,
  action text not null,
  cible_type text not null default '',
  cible_id text not null default '',
  at timestamptz not null default now()
);

-- ── fonctions (security definer : lecture profiles/members sans fuite RLS) ──
create or replace function public.msg_is_moderator(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.role in ('admin','prof'));
$$;

create or replace function public.msg_is_member(uid uuid, cid bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.msg_members m where m.conversation_id = cid and m.user_id = uid
    union all
    select 1 from public.msg_conversations c
     where c.id = cid and c.type = 'groupe'
       and exists (select 1 from public.profiles p
                    where p.id = uid and p.wilaya is not null and p.niveau is not null
                      and p.wilaya = c.wilaya and p.niveau = c.niveau
                      and (c.filiere is null or p.filiere = c.filiere))
  );
$$;

-- DM autorisé uniquement entre profils du MÊME groupe scolaire (wilaya+niveau+filière)
create or replace function public.msg_can_dm(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles pa
    join public.profiles pb
      on pb.wilaya = pa.wilaya and pb.niveau = pa.niveau and pb.filiere = pa.filiere
     where pa.id = a and pb.id = b and a <> b
       and pa.wilaya is not null and pa.niveau is not null and pa.filiere is not null
  );
$$;

-- « new » n'existe QUE dans les triggers : le test de blocage est donc
-- encapsulé dans une fonction security definer, appelée par la politique.
create or replace function public.msg_not_blocked(cid bigint, snd uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.msg_members m
    join public.msg_blocks b on b.blocker_id = m.user_id and b.blocked_id = snd
     where m.conversation_id = cid
  );
$$;

-- Lot 1b : un groupe officiel ne peut être rejoint que par un profil correspondant
-- (wilaya+niveau+filière) — ferme l'auto-inscription abusive côté RLS.
create or replace function public.msg_member_ok(cid bigint, uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.msg_conversations c
     where c.id = cid
       and ( c.type = 'direct'
             or exists (select 1 from public.profiles p
                         where p.id = uid and p.wilaya is not null and p.niveau is not null
                           and p.wilaya = c.wilaya and p.niveau = c.niveau
                           and (c.filiere is null or p.filiere = c.filiere)) )
  );
$$;

-- ── triggers : rate-limit + longueur + auto-flag liens ──
create or replace function public.msg_rate_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from public.msg_messages
   where sender_id = new.sender_id and created_at > now() - interval '60 seconds';
  if n >= 20 then raise exception 'msg_rate_limit'; end if;
  if length(new.body) > 2000 then raise exception 'msg_body_trop_long'; end if;
  if new.body ~* 'https?://' then new.flagged = 1; end if;
  return new;
end $$;
drop trigger if exists msg_tr_rate on public.msg_messages;
create trigger msg_tr_rate before insert on public.msg_messages
  for each row execute function public.msg_rate_limit();

-- ── trigger : un DM exige un groupe scolaire commun ──
create or replace function public.msg_guard_direct() returns trigger
language plpgsql security definer set search_path = public as $$
declare t text; other uuid;
begin
  select c.type into t from public.msg_conversations c where c.id = new.conversation_id;
  if t = 'direct' then
    select m.user_id into other from public.msg_members m
     where m.conversation_id = new.conversation_id and m.user_id <> new.user_id limit 1;
    if other is not null and not public.msg_can_dm(new.user_id, other) then
      raise exception 'msg_dm_interdit';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists msg_tr_direct on public.msg_members;
create trigger msg_tr_direct before insert on public.msg_members
  for each row execute function public.msg_guard_direct();

-- ── trigger : journal de modération immuable ──
create or replace function public.msg_logfn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.msg_log(actor_id, action, cible_type, cible_id)
  values (coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid),
          tg_op || '.' || tg_table_name, tg_table_name, coalesce(new.id::text, ''));
  return new;
end $$;
drop trigger if exists msg_tr_log_rep on public.msg_reports;
create trigger msg_tr_log_rep after update on public.msg_reports
  for each row execute function public.msg_logfn();
drop trigger if exists msg_tr_log_att on public.msg_attachments;
create trigger msg_tr_log_att after update on public.msg_attachments
  for each row execute function public.msg_logfn();
drop trigger if exists msg_tr_log_del on public.msg_messages;
create trigger msg_tr_log_del after update of deleted_at on public.msg_messages
  for each row execute function public.msg_logfn();

-- ── RLS ──
alter table public.msg_conversations enable row level security;
alter table public.msg_members      enable row level security;
alter table public.msg_messages     enable row level security;
alter table public.msg_attachments  enable row level security;
alter table public.msg_reports      enable row level security;
alter table public.msg_blocks       enable row level security;
alter table public.msg_log          enable row level security;

drop policy if exists "msg conv lecture" on public.msg_conversations;
create policy "msg conv lecture" on public.msg_conversations for select to authenticated
  using (public.msg_is_member(auth.uid(), id) or public.msg_is_moderator(auth.uid()));
drop policy if exists "msg conv creation" on public.msg_conversations;
create policy "msg conv creation" on public.msg_conversations for insert to authenticated
  with check (auth.uid() = created_by
              and (type = 'direct' or public.msg_is_moderator(auth.uid())));

drop policy if exists "msg members lecture" on public.msg_members;
create policy "msg members lecture" on public.msg_members for select to authenticated
  using (public.msg_is_member(auth.uid(), conversation_id) or public.msg_is_moderator(auth.uid()));
drop policy if exists "msg members ajout" on public.msg_members;
create policy "msg members ajout" on public.msg_members for insert to authenticated
  with check (auth.uid() = user_id
              and public.msg_member_ok(conversation_id, auth.uid()));
drop policy if exists "msg members retrait" on public.msg_members;
create policy "msg members retrait" on public.msg_members for delete to authenticated
  using (auth.uid() = user_id or public.msg_is_moderator(auth.uid()));

drop policy if exists "msg messages lecture" on public.msg_messages;
create policy "msg messages lecture" on public.msg_messages for select to authenticated
  using (public.msg_is_member(auth.uid(), conversation_id) or public.msg_is_moderator(auth.uid()));
drop policy if exists "msg messages envoi" on public.msg_messages;
create policy "msg messages envoi" on public.msg_messages for insert to authenticated
  with check (auth.uid() = sender_id
              and public.msg_is_member(auth.uid(), conversation_id)
              and public.msg_not_blocked(conversation_id, sender_id));
drop policy if exists "msg messages edition" on public.msg_messages;
create policy "msg messages edition" on public.msg_messages for update to authenticated
  using (auth.uid() = sender_id or public.msg_is_moderator(auth.uid()));

drop policy if exists "msg att lecture" on public.msg_attachments;
create policy "msg att lecture" on public.msg_attachments for select to authenticated
  using (exists (select 1 from public.msg_messages m
                  where m.id = message_id
                    and (public.msg_is_member(auth.uid(), m.conversation_id) or public.msg_is_moderator(auth.uid()))));
drop policy if exists "msg att upload" on public.msg_attachments;
create policy "msg att upload" on public.msg_attachments for insert to authenticated
  with check (auth.uid() = uploader
              and mime in ('image/png','image/jpeg','image/webp','application/pdf')
              and octets between 1 and 5242880);
drop policy if exists "msg att moderation" on public.msg_attachments;
create policy "msg att moderation" on public.msg_attachments for update to authenticated
  using (public.msg_is_moderator(auth.uid()));

drop policy if exists "msg reports lecture" on public.msg_reports;
create policy "msg reports lecture" on public.msg_reports for select to authenticated
  using (auth.uid() = reporter_id or public.msg_is_moderator(auth.uid()));
drop policy if exists "msg reports creation" on public.msg_reports;
create policy "msg reports creation" on public.msg_reports for insert to authenticated
  with check (auth.uid() = reporter_id
              and exists (select 1 from public.msg_messages m
                           where m.id = message_id
                             and public.msg_is_member(auth.uid(), m.conversation_id)));
drop policy if exists "msg reports traitement" on public.msg_reports;
create policy "msg reports traitement" on public.msg_reports for update to authenticated
  using (public.msg_is_moderator(auth.uid()));

drop policy if exists "msg blocks lecture" on public.msg_blocks;
create policy "msg blocks lecture" on public.msg_blocks for select to authenticated
  using (auth.uid() in (blocker_id, blocked_id) or public.msg_is_moderator(auth.uid()));
drop policy if exists "msg blocks creation" on public.msg_blocks;
create policy "msg blocks creation" on public.msg_blocks for insert to authenticated
  with check (auth.uid() = blocker_id);
drop policy if exists "msg blocks retrait" on public.msg_blocks;
create policy "msg blocks retrait" on public.msg_blocks for delete to authenticated
  using (auth.uid() = blocker_id);

drop policy if exists "msg log lecture moderateurs" on public.msg_log;
create policy "msg log lecture moderateurs" on public.msg_log for select to authenticated
  using (public.msg_is_moderator(auth.uid()));

-- ── grants : authentifiés uniquement, JAMAIS anon ──
grant select, insert, update, delete on public.msg_conversations to authenticated;
grant select, insert, update, delete on public.msg_members      to authenticated;
grant select, insert, update, delete on public.msg_messages     to authenticated;
grant select, insert, update, delete on public.msg_attachments  to authenticated;
grant select, insert, update, delete on public.msg_reports      to authenticated;
grant select, insert, update, delete on public.msg_blocks       to authenticated;
grant select                          on public.msg_log         to authenticated;
do $$ declare r record;
begin
  for r in select sequencename from pg_sequences where schemaname = 'public' and sequencename like 'msg_%'
  loop execute format('grant usage, select on sequence public.%I to authenticated', r.sequencename); end loop;
end $$;

-- ── stockage : convention de chemin msg/<conversation_id>/<fichier> dans le bucket prive ──
drop policy if exists "msg storage lecture" on storage.objects;
create policy "msg storage lecture" on storage.objects for select to authenticated
  using (bucket_id = 'prive' and (storage.foldername(name))[1] = 'msg'
         and public.msg_is_member(auth.uid(), coalesce(nullif((storage.foldername(name))[2], '')::bigint, 0))
         or (bucket_id = 'prive' and (storage.foldername(name))[1] = 'msg' and public.msg_is_moderator(auth.uid())));
drop policy if exists "msg storage upload" on storage.objects;
create policy "msg storage upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'prive' and (storage.foldername(name))[1] = 'msg'
              and auth.uid() = owner
              and public.msg_is_member(auth.uid(), coalesce(nullif((storage.foldername(name))[2], '')::bigint, 0)));

-- ── realtime : postgres_changes (le payload respecte le RLS ci-dessus) ──
do $$ begin alter publication supabase_realtime add table public.msg_messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.msg_conversations;
exception when duplicate_object then null; when undefined_object then null; end $$;
