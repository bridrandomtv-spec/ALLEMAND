-- Reconciled from the live Supabase catalog for the recorded applied migration.
create table if not exists public.mfa_email_factors (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists public.mfa_email_challenges (
 challenge_id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 session_id uuid not null,
 purpose text not null check (purpose in ('enroll','login')),
 code_hash bytea not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 consumed_at timestamptz,
 attempts smallint not null default 0 check (attempts between 0 and 5)
);
create index if not exists mfa_email_challenges_user_created_idx on public.mfa_email_challenges(user_id,created_at desc);
create table if not exists public.mfa_email_sessions (
 user_id uuid not null references auth.users(id) on delete cascade,
 session_id uuid not null,
 verified_at timestamptz not null default now(),
 expires_at timestamptz not null,
 primary key(user_id,session_id)
);
alter table public.mfa_email_factors enable row level security;
alter table public.mfa_email_challenges enable row level security;
alter table public.mfa_email_sessions enable row level security;
revoke all on public.mfa_email_factors,public.mfa_email_challenges,public.mfa_email_sessions from public,anon,authenticated;
grant all on public.mfa_email_factors,public.mfa_email_challenges,public.mfa_email_sessions to service_role;
comment on table public.mfa_email_challenges is 'One-time HMAC-hashed email challenges, session-bound, 5-minute expiry and five-attempt cap; service_role only.';
comment on table public.mfa_email_factors is 'Custom email second-step enrollment state; service_role only, RLS enabled with no client policies.';
comment on table public.mfa_email_sessions is 'Server-side verification state bound to an Auth session; service_role only.';
