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

-- Un seul compteur par compte, sans exposer l'historique de recherche.
create table if not exists public.msg_discovery_limits (
  actor_id uuid primary key references auth.users(id) on delete cascade,
  window_started timestamptz not null default now(),
  searches integer not null default 0 check (searches between 0 and 8)
);
alter table public.msg_discovery_limits enable row level security;
revoke all on public.msg_discovery_limits from public, anon, authenticated;

create or replace function public.msg_student_search(p_query text, p_limit integer default 12)
returns table(student_id uuid, pseudo text, niveau text, filiere text, wilaya text)
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

  return query
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
     limit greatest(1,least(coalesce(p_limit,12),15));
end;
$$;

revoke all on function public.msg_student_search(text,integer) from public, anon;
grant execute on function public.msg_student_search(text,integer) to authenticated;

commit;
