-- ══════════════════════════════════════════════════════════════════
--  p0_locks.sql — VERROUS P0 : role & niveau ne peuvent plus être
--  auto-modifiés par un étudiant (escalade de privilèges neutralisée).
--  À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
-- ══════════════════════════════════════════════════════════════════

-- ── P0.1 + P0.2 : UPDATE verrouillé (role & niveau immuables pour l'owner) ──
drop policy if exists "update own" on public.profiles;
create policy "update own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- Important : ne pas relire public.profiles dans cette policy (récursion RLS).
-- Le trigger protect_role_niveau ci-dessous bloque les changements de rôle/niveau.

-- ── P0.1 (suite) : INSERT limité — on ne naît pas admin/prof par auto-inscription ──
drop policy if exists "insert own" on public.profiles;
create policy "insert own" on public.profiles
  for insert
  with check (
    auth.uid() = id
    and role in ('eleve','parent')
  );

-- ── Dépendance explicite : le script P0 peut être exécuté seul ──
-- Même définition que dans fix_rls.sql ; CREATE OR REPLACE reste idempotent.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $is_admin$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$is_admin$;

-- ── Garde-fou : trigger bloquant tout changement de role/niveau par un
--    non-admin. EXCEPTION : postgres / service_role (SQL Editor, scripts
--    serveur) pour conserver la promotion administrative manuelle. ──
create or replace function public.protect_role_niveau()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.niveau is distinct from old.niveau)
     and not public.is_admin()
     and current_user not in ('postgres','service_role') then
    raise exception 'P0: role/niveau modifiables uniquement par un administrateur';
  end if;
  return new;
end $$;

drop trigger if exists trg_protect_role_niveau on public.profiles;
create trigger trg_protect_role_niveau
  before update on public.profiles
  for each row execute function public.protect_role_niveau();
