-- supabase/plans.sql — PHASE 5 : plans administrables + lien parent-enfant (décision C)
-- À exécuter UNE fois dans Supabase → SQL Editor → Run. Idempotent.
-- Aucune donnée existante n'est déplacée ni supprimée : uniquement créations + seeds.

-- ── 1) Table des plans (source de vérité des prix, administrable) ──
create table if not exists public.plans (
  id text primary key,
  role text not null,
  duree_jours int not null,
  prix_da int,
  label_ar text not null default '',
  actif boolean not null default true,
  created_at timestamptz default now()
);
alter table public.plans enable row level security;
drop policy if exists "plans lecture publique" on public.plans;
create policy "plans lecture publique" on public.plans for select using (true);
drop policy if exists "plans insert admin" on public.plans;
create policy "plans insert admin" on public.plans for insert with check (public.is_admin());
drop policy if exists "plans update admin" on public.plans;
create policy "plans update admin" on public.plans for update
  using (public.is_admin()) with check (public.is_admin());

-- Seeds : élève = prix EXISTANTS (config.json, jamais inventés) · prof/parent = NULL (décision B)
insert into public.plans (id, role, duree_jours, prix_da, label_ar) values
  ('eleve-m1',  'eleve',  30,  1800,  'شهر واحد'),
  ('eleve-m6',  'eleve',  180, 9000,  'ستة أشهر'),
  ('eleve-m12', 'eleve',  365, 15000, 'سنة كاملة'),
  ('prof-m1',   'prof',   30,  null,  'شهر واحد'),
  ('prof-m6',   'prof',   180, null,  'ستة أشهر'),
  ('prof-m12',  'prof',   365, null,  'سنة كاملة'),
  ('parent-m1', 'parent', 30,  null,  'شهر واحد'),
  ('parent-m6', 'parent', 180, null,  'ستة أشهر'),
  ('parent-m12','parent', 365, null,  'سنة كاملة')
on conflict (id) do nothing;

-- ── 2) Lien parent ↔ enfant (décision C) ──
create table if not exists public.child_links (
  parent_id uuid not null references auth.users on delete cascade,
  child_id  uuid not null references auth.users on delete cascade,
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  primary key (parent_id, child_id)
);
alter table public.child_links add column if not exists confirmed_at timestamptz;
alter table public.child_links enable row level security;
drop policy if exists "liens visibles par les deux bouts + admin" on public.child_links;
drop policy if exists "parent crée ses liens" on public.child_links;
drop policy if exists "parent défait ses liens" on public.child_links;
create policy "liens visibles par les deux bouts + admin" on public.child_links for select
  using (auth.uid() = parent_id or auth.uid() = child_id or public.is_admin());
-- Le rattachement ne peut jamais être créé/supprimé par un accès direct à la table.
-- Seules les RPC de demande, consentement et déliaison contrôlent les rôles.
revoke all on table public.child_links from public, anon, authenticated;
grant select on table public.child_links to authenticated;

-- ── 3) Décision C : rapport de BASE d'un enfant = enfant ACTIF **ou** parent ACTIF ──
create or replace function public.child_active_entitlement(parent_id uuid, child_id uuid)
returns boolean language sql stable security definer
set search_path = pg_catalog, public as $function$
  select auth.uid() is not null
    and $1 = auth.uid()
    and exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'parent'
    )
    and exists (
      select 1 from public.child_links l
      where l.parent_id = $1 and l.child_id = $2
        and l.confirmed_at is not null
    )
    and exists (
      select 1 from public.subscriptions s
      where s.user_id = $2 and s.statut = 'actif'
        and (s.fin is null or s.fin > now())
    );
$function$;

-- ── 4) Self-service parent : lier par email, lister, délier ──
-- Compatibilité de schéma uniquement : l'ancien lien direct ne peut plus
-- créer de relation. Le seul parcours autorisé est demande parent + accord élève.
create or replace function public.link_child(p_email text)
returns uuid language plpgsql security definer
set search_path = pg_catalog, public as $function$
begin
  raise exception 'use_parent_link_request_flow';
end; $function$;
revoke all on function public.link_child(text) from public, anon, authenticated;

create or replace function public.my_linked_children()
returns table (child_id uuid, pseudo text) language sql stable security definer
set search_path = public as $$
  select l.child_id, coalesce(p.pseudo, '')
  from public.child_links l
  left join public.profiles p on p.id = l.child_id
  where l.parent_id = auth.uid()
    and auth.uid() is not null
    and l.confirmed_at is not null
    and exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'parent'
    );
$;

grant execute on function public.child_active_entitlement(uuid, uuid) to authenticated;
grant execute on function public.my_linked_children() to authenticated;
