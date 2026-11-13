-- Lot 444 — première tranche serveur du fil ملتقى الطلاب.
-- Préparée sur la branche uniquement. NON exécutée sur Supabase.
-- L'accès aux contenus personnels exige un compte élève vérifié (profiles.verif_statut = 'verifie').
-- Aucun abonnement n'est requis. Les comptes en attente/non vérifiés ne voient pas le fil personnel.
-- Aucune lecture directe des profils : les RPC ne retournent que profiles.pseudo.
--
-- Périmètre : publications texte, commentaires/réponses, réactions, signalements.
-- Pas de fichiers/images, annuaire, relation زمالة, ni modération administrative
-- dans cette première tranche. Ne pas appliquer sans tests PostgreSQL isolés.

begin;

create table if not exists public.multaqa_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 3000),
  status text not null default 'published'
    check (status in ('published','hidden','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists multaqa_posts_feed_idx
  on public.multaqa_posts(id desc) where status = 'published';
create index if not exists multaqa_posts_author_idx
  on public.multaqa_posts(author_id, created_at desc);

create table if not exists public.multaqa_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.multaqa_posts(id) on delete cascade,
  parent_id bigint references public.multaqa_comments(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  status text not null default 'published'
    check (status in ('published','hidden','deleted')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists multaqa_comments_post_idx
  on public.multaqa_comments(post_id, id) where status = 'published';
create index if not exists multaqa_comments_author_idx
  on public.multaqa_comments(author_id, created_at desc);

create table if not exists public.multaqa_reactions (
  post_id bigint not null references public.multaqa_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null default 'like'
    check (reaction in ('like','helpful','support')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.multaqa_reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_kind text not null check (target_kind in ('post','comment')),
  target_id bigint not null,
  reason text not null check (reason in ('spam','harassment','inappropriate','misinformation','other')),
  details text check (details is null or char_length(details) <= 500),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_kind, target_id)
);

create index if not exists multaqa_reports_queue_idx
  on public.multaqa_reports(created_at) where status = 'open';
create index if not exists multaqa_reports_reporter_idx
  on public.multaqa_reports(reporter_id, created_at desc);

alter table public.multaqa_posts enable row level security;
alter table public.multaqa_comments enable row level security;
alter table public.multaqa_reactions enable row level security;
alter table public.multaqa_reports enable row level security;

-- Aucun accès REST direct : lecture et mutations exclusivement via RPC.
revoke all on public.multaqa_posts from public, anon, authenticated;
revoke all on public.multaqa_comments from public, anon, authenticated;
revoke all on public.multaqa_reactions from public, anon, authenticated;
revoke all on public.multaqa_reports from public, anon, authenticated;

create or replace function public.multaqa_feed(p_limit integer default 20, p_before bigint default null)
returns table (
  post_id bigint,
  body text,
  created_at timestamptz,
  author_pseudo text,
  comments_count bigint,
  reactions_count bigint,
  my_reaction text,
  my_post boolean
)
language plpgsql stable security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then
    raise exception 'student_account_required';
  end if;

  return query
  select p.id, p.body, p.created_at, pr.pseudo,
    (select count(*) from public.multaqa_comments c
      where c.post_id = p.id and c.status = 'published'),
    (select count(*) from public.multaqa_reactions r where r.post_id = p.id),
    (select r.reaction from public.multaqa_reactions r
      where r.post_id = p.id and r.user_id = v_uid),
    (p.author_id = v_uid)
  from public.multaqa_posts p
  join public.profiles pr on pr.id = p.author_id
  where p.status = 'published'
    and (p_before is null or p.id < p_before)
  order by p.id desc
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
end;
$$;

create or replace function public.multaqa_comments(
  p_post_id bigint, p_limit integer default 50, p_before bigint default null
)
returns table (
  comment_id bigint,
  parent_id bigint,
  body text,
  created_at timestamptz,
  author_pseudo text
)
language plpgsql stable security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then
    raise exception 'student_account_required';
  end if;
  if not exists (
    select 1 from public.multaqa_posts p
    where p.id = p_post_id and p.status = 'published'
  ) then
    raise exception 'post_not_found';
  end if;

  return query
  select c.id, c.parent_id, c.body, c.created_at, pr.pseudo
  from public.multaqa_comments c
  join public.profiles pr on pr.id = c.author_id
  where c.post_id = p_post_id and c.status = 'published'
    and (p_before is null or c.id > p_before)
  order by c.id asc
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
end;
$$;

create or replace function public.multaqa_create_post(p_body text)
returns bigint
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_id bigint;
  v_body text := btrim(coalesce(p_body, ''));
  v_count integer;
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then raise exception 'student_account_required'; end if;
  if char_length(v_body) < 1 or char_length(v_body) > 3000 then
    raise exception 'invalid_post_length';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 444));
  select count(*) into v_count from public.multaqa_posts
   where author_id = v_uid and created_at > now() - interval '24 hours';
  if v_count >= 10 then raise exception 'post_rate_limit'; end if;

  insert into public.multaqa_posts(author_id, body)
  values (v_uid, v_body) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.multaqa_create_comment(
  p_post_id bigint, p_body text, p_parent_id bigint default null
)
returns bigint
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_id bigint;
  v_body text := btrim(coalesce(p_body, ''));
  v_count integer;
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then raise exception 'student_account_required'; end if;
  if char_length(v_body) < 1 or char_length(v_body) > 2000 then
    raise exception 'invalid_comment_length';
  end if;
  if not exists (
    select 1 from public.multaqa_posts p where p.id = p_post_id and p.status = 'published'
  ) then raise exception 'post_not_found'; end if;
  if p_parent_id is not null and not exists (
    select 1 from public.multaqa_comments c
    where c.id = p_parent_id and c.post_id = p_post_id and c.status = 'published'
  ) then raise exception 'parent_comment_not_found'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 445));
  select count(*) into v_count from public.multaqa_comments
   where author_id = v_uid and created_at > now() - interval '24 hours';
  if v_count >= 30 then raise exception 'comment_rate_limit'; end if;

  insert into public.multaqa_comments(post_id, parent_id, author_id, body)
  values (p_post_id, p_parent_id, v_uid, v_body) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.multaqa_toggle_reaction(p_post_id bigint, p_reaction text default 'like')
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_existing text;
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then raise exception 'student_account_required'; end if;
  if p_reaction not in ('like','helpful','support') then raise exception 'invalid_reaction'; end if;
  if not exists (
    select 1 from public.multaqa_posts p where p.id = p_post_id and p.status = 'published'
  ) then raise exception 'post_not_found'; end if;

  select r.reaction into v_existing from public.multaqa_reactions r
   where r.post_id = p_post_id and r.user_id = v_uid for update;
  if v_existing = p_reaction then
    delete from public.multaqa_reactions where post_id = p_post_id and user_id = v_uid;
    return false;
  end if;
  insert into public.multaqa_reactions(post_id, user_id, reaction)
  values (p_post_id, v_uid, p_reaction)
  on conflict (post_id, user_id) do update set reaction = excluded.reaction, created_at = now();
  return true;
end;
$$;

create or replace function public.multaqa_report(
  p_target_kind text, p_target_id bigint, p_reason text, p_details text default null
)
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_details text := nullif(btrim(coalesce(p_details, '')), '');
  v_count integer;
begin
  if v_uid is null or not exists (
    select 1 from public.profiles p where p.id = v_uid and p.role = 'eleve' and p.verif_statut = 'verifie'
  ) then raise exception 'student_account_required'; end if;
  if p_target_kind not in ('post','comment') then raise exception 'invalid_report_target'; end if;
  if p_reason not in ('spam','harassment','inappropriate','misinformation','other') then
    raise exception 'invalid_report_reason';
  end if;
  if v_details is not null and char_length(v_details) > 500 then raise exception 'report_too_long'; end if;

  perform pg_advisory_xact_lock(hashtextextended(v_uid::text, 446));
  select count(*) into v_count from public.multaqa_reports
   where reporter_id = v_uid and created_at > now() - interval '24 hours';
  if v_count >= 20 then raise exception 'report_rate_limit'; end if;

  if p_target_kind = 'post' and not exists (
    select 1 from public.multaqa_posts p where p.id = p_target_id and p.status = 'published'
  ) then raise exception 'content_not_found'; end if;
  if p_target_kind = 'comment' and not exists (
    select 1 from public.multaqa_comments c
    join public.multaqa_posts p on p.id = c.post_id
    where c.id = p_target_id and c.status = 'published' and p.status = 'published'
  ) then raise exception 'content_not_found'; end if;

  insert into public.multaqa_reports(reporter_id, target_kind, target_id, reason, details)
  values (v_uid, p_target_kind, p_target_id, p_reason, v_details)
  on conflict (reporter_id, target_kind, target_id) do nothing;
  return true;
end;
$$;

create or replace function public.multaqa_delete_own_post(p_post_id bigint)
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'eleve'
  ) then raise exception 'student_account_required'; end if;
  update public.multaqa_posts set status='deleted', deleted_at=now(), updated_at=now()
   where id=p_post_id and author_id=auth.uid() and status='published';
  return found;
end;
$$;

create or replace function public.multaqa_delete_own_comment(p_comment_id bigint)
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'eleve'
  ) then raise exception 'student_account_required'; end if;
  update public.multaqa_comments set status='deleted', deleted_at=now()
   where id=p_comment_id and author_id=auth.uid() and status='published';
  return found;
end;
$$;

-- Les fonctions ne sont pas des API anonymes. Le profil est projeté uniquement
-- par pseudo dans les RPC de lecture, jamais par SELECT direct sur profiles.
revoke all on function public.multaqa_feed(integer, bigint) from public, anon;
revoke all on function public.multaqa_comments(bigint, integer, bigint) from public, anon;
revoke all on function public.multaqa_create_post(text) from public, anon;
revoke all on function public.multaqa_create_comment(bigint, text, bigint) from public, anon;
revoke all on function public.multaqa_toggle_reaction(bigint, text) from public, anon;
revoke all on function public.multaqa_report(text, bigint, text, text) from public, anon;
revoke all on function public.multaqa_delete_own_post(bigint) from public, anon;
revoke all on function public.multaqa_delete_own_comment(bigint) from public, anon;

grant execute on function public.multaqa_feed(integer, bigint) to authenticated;
grant execute on function public.multaqa_comments(bigint, integer, bigint) to authenticated;
grant execute on function public.multaqa_create_post(text) to authenticated;
grant execute on function public.multaqa_create_comment(bigint, text, bigint) to authenticated;
grant execute on function public.multaqa_toggle_reaction(bigint, text) to authenticated;
grant execute on function public.multaqa_report(text, bigint, text, text) to authenticated;
grant execute on function public.multaqa_delete_own_post(bigint) to authenticated;
grant execute on function public.multaqa_delete_own_comment(bigint) to authenticated;

commit;

-- Tests PostgreSQL isolés obligatoires avant application :
-- 1. compte non connecté, role != eleve, ou session élève absente : toutes RPC refusées.
-- 2. élève vérifié sans abonnement : lecture/création autorisées ; compte non vérifié/en attente : fil personnel refusé.
-- 2b. élève dont la vérification est révoquée : lecture/interactions refusées ; suppression de ses propres contenus encore possible.
-- 3. lecture feed/commentaires : uniquement pseudo, jamais matricule/section/verif_by/verif_at.
-- 4. pagination keyset, limites 1..50/100, aucun contenu hidden/deleted.
-- 5. commentaire parent d'un autre post refusé; suppression limitée à l'auteur.
-- 6. réaction idempotente/concurrente : une seule ligne par couple post/utilisateur.
-- 7. quotas concurrentiels : 10 posts et 30 commentaires / 24 h maximum.
-- 8. signalement idempotent, cible inexistante, raisons invalides et quota 20/24 h refusés.
-- 9. accès REST direct aux quatre tables refusé malgré RPC autorisées.
-- 10. aucune régression sur les tables Messenger, groupes, RLS, Realtime ou Auth.
