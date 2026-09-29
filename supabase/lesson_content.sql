-- supabase/lesson_content.sql — PHASE 7 : le contenu PAYANT quitte le domaine public
-- Ordre du propriétaire : Backup → Migration → Verification → RLS test → switch → full test.
-- Ce fichier = le SCHÉMA uniquement (la donnée est dans tools/seed_lesson_content.sql).
create table if not exists public.lesson_content (
  id text primary key,
  subject text not null default 'allemand',
  level text not null default '2AS',
  unite int not null,
  page int not null,
  titre text not null default '',
  body text not null,
  free boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists lc_page_idx on public.lesson_content (page);
create index if not exists lc_unite_idx on public.lesson_content (unite);
alter table public.lesson_content enable row level security;

-- entitlement : abonnement actif (statut 'actif' et non expiré) — source de vérité serveur
create or replace function public.active_entitlement(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = uid and s.statut = 'actif'
      and (s.fin is null or s.fin > now())
  );
$$;

-- LECTURE : pages gratuites pour tout le monde ; pages payantes UNIQUEMENT
-- pour un abonné actif (ou l'admin). Un anon / élève non abonné ne reçoit rien.
drop policy if exists "lc lecture selon entitlement" on public.lesson_content;
create policy "lc lecture selon entitlement" on public.lesson_content for select
  using (free or public.active_entitlement(auth.uid()) or public.is_admin());
-- ÉCRITURE : admin seulement
drop policy if exists "lc ecriture admin" on public.lesson_content;
create policy "lc ecriture admin" on public.lesson_content for all
  using (public.is_admin()) with check (public.is_admin());
grant select on public.lesson_content to anon, authenticated;
