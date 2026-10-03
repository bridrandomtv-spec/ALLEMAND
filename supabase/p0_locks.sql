-- ══════════════════════════════════════════════════════════════════
--  p0_locks.sql — VERROUS P0 : role & niveau ne peuvent plus être
--  auto-modifiés par un étudiant (escalade de privilèges neutralisée).
--  À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
--
--  Effet :
--   · un compte authentifié peut toujours modifier pseudo/filiere/wilaya
--     (sa propre ligne) mais PLUS son role ni son niveau ;
--   · l'INSERT initial est limité aux rôles 'eleve' / 'parent'
--     (prof/admin uniquement par promotion administrative) ;
--   · l'admin conserve la main via la policy « admin update roles ».
-- ══════════════════════════════════════════════════════════════════

-- ── P0.1 + P0.2 : UPDATE verrouillé (role & niveau immuables pour l'owner) ──
drop policy if exists "update own" on public.profiles;
create policy "update own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role   = (select p.role   from public.profiles p where p.id = auth.uid())
    and niveau = (select p.niveau from public.profiles p where p.id = auth.uid())
  );

-- ── P0.1 (suite) : INSERT limité — on ne naît pas admin/prof par auto-inscription ──
drop policy if exists "insert own" on public.profiles;
create policy "insert own" on public.profiles
  for insert
  with check (
    auth.uid() = id
    and role in ('eleve','parent')
  );

-- ── Garde-fou supplémentaire : trigger bloquant tout changement de role/niveau
--    par un non-admin (double défense, indépendant des policies) ──
create or replace function public.protect_role_niveau()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.niveau is distinct from old.niveau)
     and not public.is_admin() then
    raise exception 'P0: role/niveau modifiables uniquement par un administrateur';
  end if;
  return new;
end $$;

drop trigger if exists trg_protect_role_niveau on public.profiles;
create trigger trg_protect_role_niveau
  before update on public.profiles
  for each row execute function public.protect_role_niveau();

-- ── Promotion prof/admin réservée à l'admin (rappel, déjà possible via
--    « admin update roles » ; exemple :) ──
-- update public.profiles set role = 'prof'  where id = '<UID>' ;  -- par un admin
