-- ══════════════════════════════════════════════════════════════════
--  CORRECTIF 42P17 (récursion RLS) — à coller dans SQL Editor puis Run
-- ══════════════════════════════════════════════════════════════════

-- fonctions SECURITY DEFINER : lisent profiles SANS repasser par le RLS
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create or replace function public.is_prof() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles
                  where id = auth.uid() and role in ('prof','admin'));
$$;

-- profiles : la policy admin ne doit PAS requêter profiles sous RLS
drop policy if exists "admin voit tout" on public.profiles;
create policy "admin voit tout" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- notes : idem via is_prof()
drop policy if exists "prof insere" on public.notes;
create policy "prof insere" on public.notes for insert
  with check (auth.uid() = prof_id and public.is_prof());
drop policy if exists "prof lit sa classe" on public.notes;
create policy "prof lit sa classe" on public.notes
  for select using (auth.uid() = eleve_id or public.is_prof());

-- documents_meta : idem via is_admin()
drop policy if exists "admin all" on public.documents_meta;
create policy "admin all" on public.documents_meta
  for all using (auth.uid() = owner_id or public.is_admin());
