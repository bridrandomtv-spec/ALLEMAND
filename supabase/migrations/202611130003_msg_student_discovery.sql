-- Lot 453 — découverte privée et vérification effective des élèves avant DM.
-- Préparée sur la branche uniquement. NE PAS appliquer à Supabase sans accord distinct.
-- Dépend de 202611130001_msg_invitation_consent.sql et des tables msg_* existantes.
begin;

-- La fonction historique ne contrôlait que la classe commune. Le statut de
-- vérification doit être imposé côté serveur, pas seulement par l'interface.
create or replace function public.msg_can_dm(a uuid, b uuid)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
     and auth.uid() in (a, b)
     and a <> b
     and not public.msg_pair_blocked(a,b)
     and exists (
       select 1
       from public.profiles pa
       join public.profiles pb
         on pb.wilaya = pa.wilaya
        and pb.niveau = pa.niveau
        and pb.filiere = pa.filiere
       where pa.id = a and pb.id = b
         and pa.role = 'eleve' and pb.role = 'eleve'
         and pa.verif_statut = 'verifie'
         and pb.verif_statut = 'verifie'
         and pa.wilaya is not null
         and pa.niveau is not null
         and pa.filiere is not null
     );
$$;
revoke all on function public.msg_can_dm(uuid,uuid) from public, anon, authenticated;

-- Compteur de recherches par acteur : aucune lecture client directe.
create table if not exists public.msg_discovery_limits (
  actor_id uuid primary key references auth.users(id) on delete cascade,
  window_started timestamptz not null default now(),
  searches integer not null default 0 check (searches >= 0)
);
alter table public.msg_discovery_limits enable row level security;
revoke all on public.msg_discovery_limits from public, anon, authenticated;

-- Jetons aléatoires à durée courte : le client ne reçoit jamais le UUID du compte cible.
create table if not exists public.msg_discovery_targets (
  token uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  used_at timestamptz
);
alter table public.msg_discovery_targets
  add column if not exists used_at timestamptz;
create index if not exists msg_discovery_targets_actor_expiry_idx
  on public.msg_discovery_targets(actor_id, expires_at);
create index if not exists msg_discovery_targets_expiry_idx
  on public.msg_discovery_targets(expires_at);
alter table public.msg_discovery_targets enable row level security;
revoke all on public.msg_discovery_targets from public, anon, authenticated;

-- Le contrat public renvoie un jeton opaque, jamais l'UUID auth/profil.
drop function if exists public.msg_student_search(text,integer);
create function public.msg_student_search(p_query text, p_limit integer default 12)
returns table(student_key uuid, pseudo text, niveau text, filiere text, wilaya text)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor uuid := auth.uid();
  v_query text := btrim(coalesce(p_query,''));
  v_profile public.profiles%rowtype;
  v_count integer;
begin
  if v_actor is null then raise exception 'auth_required'; end if;
  if char_length(v_query) < 3 or char_length(v_query) > 40 then
    raise exception 'search_query_length';
  end if;

  select * into v_profile from public.profiles p where p.id=v_actor;
  if not found or v_profile.role <> 'eleve' or v_profile.verif_statut <> 'verifie' then
    raise exception 'school_verification_required';
  end if;
  if v_profile.wilaya is null or v_profile.niveau is null or v_profile.filiere is null then
    raise exception 'school_profile_incomplete';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_actor::text || ':msg-search',0));
  insert into public.msg_discovery_limits(actor_id,window_started,searches)
  values(v_actor,now(),1)
  on conflict(actor_id) do update
    set window_started = case
          when public.msg_discovery_limits.window_started <= now()-interval '10 minutes' then now()
          else public.msg_discovery_limits.window_started end,
        searches = case
          when public.msg_discovery_limits.window_started <= now()-interval '10 minutes' then 1
          else public.msg_discovery_limits.searches+1 end;

  select searches into v_count from public.msg_discovery_limits where actor_id=v_actor;
  if v_count > 8 then raise exception 'search_rate_limit'; end if;

  -- Nettoyage global borné par l'index d'expiration : évite de conserver
  -- indéfiniment les jetons expirés des comptes qui ne relancent pas de recherche.
  delete from public.msg_discovery_targets
   where expires_at <= now();

  return query
    with candidates as materialized (
      select p.id, p.pseudo, p.niveau, p.filiere, p.wilaya
        from public.profiles p
       where p.id <> v_actor
         and p.role='eleve'
         and p.verif_statut='verifie'
         and p.wilaya=v_profile.wilaya
         and p.niveau=v_profile.niveau
         and p.filiere=v_profile.filiere
         and position(lower(v_query) in lower(coalesce(p.pseudo,''))) > 0
         and not public.msg_pair_blocked(v_actor,p.id)
       order by lower(p.pseudo), p.id
       limit greatest(1,least(coalesce(p_limit,12),15))
    ),
    issued as (
      insert into public.msg_discovery_targets(actor_id,student_id,expires_at)
      select v_actor,c.id,now()+interval '5 minutes' from candidates c
      returning token, student_id
    )
    select i.token, c.pseudo, c.niveau, c.filiere, c.wilaya
      from issued i join candidates c on c.id=i.student_id;
end;
$$;

-- Seul le propriétaire du jeton peut le convertir en invitation ; le jeton expire.
create or replace function public.msg_invite_send_by_key(p_student_key uuid)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_actor uuid := auth.uid();
  v_recipient uuid;
begin
  if v_actor is null then raise exception 'auth_required'; end if;
  -- Consommation atomique : un jeton ne peut être converti qu'une seule fois.
  -- Si msg_invite_send échoue, la transaction annule aussi cette consommation.
  update public.msg_discovery_targets
     set used_at=now()
   where token=p_student_key and actor_id=v_actor
     and expires_at>now() and used_at is null
   returning student_id into v_recipient;
  if v_recipient is null then raise exception 'discovery_result_expired'; end if;
  return public.msg_invite_send(v_recipient);
end;
$$;
revoke all on function public.msg_student_search(text,integer) from public, anon;
grant execute on function public.msg_student_search(text,integer) to authenticated;
revoke all on function public.msg_invite_send_by_key(uuid) from public, anon;
grant execute on function public.msg_invite_send_by_key(uuid) to authenticated;

commit;
