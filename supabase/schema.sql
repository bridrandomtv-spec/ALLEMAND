-- ══════════════════════════════════════════════════════════════════
--  Phase 1 : schéma Supabase de la plateforme (à coller dans SQL Editor)
--  Projet : azjwcybivirvpxbfhyzk
-- ══════════════════════════════════════════════════════════════════

-- ── profils ──
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  pseudo text not null default '',
  role text not null default 'eleve',
  niveau text, filiere text, wilaya text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own"  on public.profiles for insert with check (auth.uid() = id);
create policy "update own"  on public.profiles for update using (auth.uid() = id);
create policy "admin voit tout" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ── séances faites ──
create table if not exists public.seances_done (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  unite int not null, seance_n int not null,
  at timestamptz default now(),
  unique (user_id, seance_n)
);
alter table public.seances_done enable row level security;
create policy "own seances" on public.seances_done for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── cartes de mémoire (Leitner) ──
create table if not exists public.memoire_cards (
  id text primary key,
  user_id uuid not null references auth.users on delete cascade,
  comp text, q text, bad text, good text,
  box int default 1, due timestamptz, hits int default 0, misses int default 0,
  updated_at timestamptz default now()
);
alter table public.memoire_cards enable row level security;
create policy "own cards" on public.memoire_cards for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── notes saisies par les profs ──
create table if not exists public.notes (
  id bigint generated always as identity primary key,
  eleve_id uuid not null references auth.users on delete cascade,
  prof_id  uuid not null references auth.users on delete cascade,
  matiere text default 'allemand',
  trimestre int, valeur numeric, appreciation text,
  at timestamptz default now()
);
alter table public.notes enable row level security;
create policy "eleve voit ses notes" on public.notes for select using (auth.uid() = eleve_id);
create policy "prof insere" on public.notes for insert with check (
  auth.uid() = prof_id and exists (select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('prof','admin')));
create policy "prof lit sa classe" on public.notes for select using (
  exists (select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('prof','admin')));

-- ── métadonnées des documents privés (le fichier vit dans storage 'prive') ──
create table if not exists public.documents_meta (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  nom text not null, chemin text not null, type text, taille bigint,
  at timestamptz default now()
);
alter table public.documents_meta enable row level security;
create policy "owner only" on public.documents_meta for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "admin all" on public.documents_meta for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ── profil auto à l'inscription ──
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, pseudo, role, niveau, filiere, wilaya)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'pseudo',''),
          coalesce(new.raw_user_meta_data->>'role','eleve'),
          new.raw_user_meta_data->>'niveau',
          new.raw_user_meta_data->>'filiere',
          new.raw_user_meta_data->>'wilaya')
  on conflict (id) do nothing;
  return new;
end; $$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── bucket privé + politiques storage (fichiers sous <uid>/…) ──
insert into storage.buckets (id, name, public)
values ('prive', 'prive', false) on conflict (id) do nothing;
create policy "owner upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'prive' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner read" on storage.objects for select to authenticated
  using (bucket_id = 'prive' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'prive' and (storage.foldername(name))[1] = auth.uid()::text);

-- ══════════════════════════════════════════════════════════════════
--  grants.sql — GRANTS explicites Data API (changement Supabase du 30 octobre)
--  Idempotent : peut être ré-exécuté sans risque, à tout moment.
--  Rappel : les GRANTS autorisent l'ACCÈS à la table ; ce sont les politiques
--  RLS qui décident QUELLES lignes chaque rôle voit. Les deux se combinent.
-- ══════════════════════════════════════════════════════════════════
grant select on table public.profiles to anon;
grant select on table public.seances_done to anon;
grant select on table public.memoire_cards to anon;
grant select on table public.notes to anon;
grant select on table public.documents_meta to anon;
grant select on table public.subscriptions to anon;
grant select on table public.sponsors to anon;
grant select on table public.ads to anon;
grant insert on table public.sponsors to anon;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.seances_done to authenticated;
grant select, insert, update, delete on table public.seances_done to service_role;
grant select, insert, update, delete on table public.memoire_cards to authenticated;
grant select, insert, update, delete on table public.memoire_cards to service_role;
grant select, insert, update, delete on table public.notes to authenticated;
grant select, insert, update, delete on table public.notes to service_role;
grant select, insert, update, delete on table public.documents_meta to authenticated;
grant select, insert, update, delete on table public.documents_meta to service_role;
grant select, insert, update, delete on table public.subscriptions to authenticated;
grant select, insert, update, delete on table public.subscriptions to service_role;
grant select, insert, update, delete on table public.sponsors to authenticated;
grant select, insert, update, delete on table public.sponsors to service_role;
grant select, insert, update, delete on table public.ads to authenticated;
grant select, insert, update, delete on table public.ads to service_role;
