-- ══════════════════════════════════════════════════════════════════
--  billing.sql — monétisation : abonnements + sponsors + pubs
-- ══════════════════════════════════════════════════════════════════
create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  plan text not null, montant int not null, devise text default 'DZD',
  statut text not null default 'en_attente',
  ref text not null default '', preuve text default '',
  debut timestamptz, fin timestamptz, created_at timestamptz default now());
alter table public.subscriptions enable row level security;
create policy "own subs" on public.subscriptions for select using (auth.uid() = user_id);
create policy "create own sub" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "update own preuve" on public.subscriptions for update
  using (auth.uid() = user_id and statut in ('en_attente','preuve'));
create policy "admin subs" on public.subscriptions for all
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.sponsors (
  id bigint generated always as identity primary key,
  nom text not null, type text not null, contact text not null,
  slot text not null, budget text default '', message text default '',
  statut text not null default 'en_attente', created_at timestamptz default now());
alter table public.sponsors enable row level security;
create policy "public insert sponsor" on public.sponsors for insert with check (true);
create policy "admin sponsors" on public.sponsors for all
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.ads (
  id bigint generated always as identity primary key,
  titre text not null, texte text not null, url text default '',
  slot text not null default 'accueil',
  debut timestamptz default now(), fin timestamptz default now() + interval '30 days',
  actif bool default true, created_at timestamptz default now());
alter table public.ads enable row level security;
create policy "everyone sees active ads" on public.ads for select
  using (actif and now() between debut and fin);
create policy "admin ads" on public.ads for all
  using (public.is_admin()) with check (public.is_admin());

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
