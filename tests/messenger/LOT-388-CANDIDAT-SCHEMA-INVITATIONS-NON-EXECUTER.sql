-- LOT 388 — CANDIDAT UNIQUEMENT : NE PAS EXECUTER SUR SUPABASE ACTIF.
-- PostgreSQL 17 / Supabase. Aucun DROP, aucune modification des tables msg_* existantes.
-- Prérequis non satisfaits : source officielle d'affiliation scolaire et contrat
-- institutionnel des contacts. Ce fichier ne contient volontairement PAS les RPC DM.
-- Son application isolée ne rendrait pas les invitations utilisables.

begin;

create table public.msg_invitations (
  id bigint generated always as identity primary key,
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','accepted','rejected','cancelled','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  responded_at timestamptz,
  conversation_id bigint references public.msg_conversations(id) on delete restrict,

  constraint msg_invitations_distinct_users
    check (requester_id <> recipient_id),
  constraint msg_invitations_expiry_after_creation
    check (expires_at > created_at),
  constraint msg_invitations_terminal_state_consistency
    check (
      (status = 'pending' and responded_at is null and conversation_id is null)
      or
      (status = 'accepted' and responded_at is not null and conversation_id is not null)
      or
      (status in ('rejected','cancelled','expired')
        and responded_at is not null and conversation_id is null)
    )
);

-- Une seule invitation en attente par paire, quel que soit le sens.
create unique index msg_invitations_one_pending_pair
  on public.msg_invitations (
    least(requester_id, recipient_id),
    greatest(requester_id, recipient_id)
  )
  where status = 'pending';

create index msg_invitations_inbox_idx
  on public.msg_invitations (recipient_id, created_at desc)
  where status = 'pending';

create index msg_invitations_outbox_idx
  on public.msg_invitations (requester_id, created_at desc);

create index msg_invitations_conversation_idx
  on public.msg_invitations (conversation_id)
  where conversation_id is not null;

alter table public.msg_invitations enable row level security;

create policy msg_invitations_participant_read
  on public.msg_invitations
  for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- Pas de policy INSERT/UPDATE/DELETE pour authenticated : les transitions
-- devront passer par des RPC SECURITY DEFINER avec identité tirée de auth.uid().
revoke all privileges on table public.msg_invitations from anon, authenticated;
grant select on table public.msg_invitations to authenticated;

comment on table public.msg_invitations is
  'Lot 388 candidate: invitation-only DM consent ledger. Not production-ready until official affiliation resolver, RPC and trigger hardening are reviewed.';

comment on column public.msg_invitations.conversation_id is
  'Set only in the same transaction that accepts the invitation and creates/reuses the exact two-member direct conversation.';

commit;
