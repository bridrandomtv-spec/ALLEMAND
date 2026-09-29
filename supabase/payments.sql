-- supabase/payments.sql — PHASE 6 : table payments (PAYMENT séparé de SUBSCRIPTION)
-- À exécuter UNE fois : Supabase → SQL Editor → Run. Idempotent.
-- Aucune donnée existante n'est déplacée ni supprimée : création pure.

create table if not exists public.payments (
  id bigint generated always as identity primary key,
  sub_id bigint not null references public.subscriptions(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  montant int not null,
  devise text not null default 'DZD',
  methode text not null default 'ccp',
  ref_plateforme text not null default '',
  ref_banque text not null default '',
  statut text not null default 'en_attente',
  note_admin text not null default '',
  created_at timestamptz default now(),
  decided_at timestamptz
);
alter table public.payments enable row level security;
drop policy if exists "own payments" on public.payments;
create policy "own payments" on public.payments for select
  using (auth.uid() = user_id or public.is_admin());
drop policy if exists "create own payment" on public.payments;
create policy "create own payment" on public.payments for insert
  with check (auth.uid() = user_id and statut = 'en_attente');
drop policy if exists "admin payments" on public.payments;
create policy "admin payments" on public.payments for update
  using (public.is_admin()) with check (public.is_admin());
create index if not exists payments_sub_idx on public.payments (sub_id);
create index if not exists payments_user_idx on public.payments (user_id);
