-- Lot 454 — cycle de vie réel des invitations sur PostgreSQL 17 jetable.
-- Aucun accès à Supabase actif, aucun compte ou message réel.
\set ON_ERROR_STOP on

do $$ begin
  if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;

create schema auth;
create function auth.uid() returns uuid language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table auth.users(id uuid primary key);
create table public.profiles(
 id uuid primary key references auth.users(id),
 role text not null, verif_statut text not null, pseudo text not null,
 wilaya text, niveau text, filiere text
);
create table public.msg_conversations(
 id bigint generated always as identity primary key,
 type text not null check(type in ('direct','groupe')),
 wilaya text, niveau text, filiere text, titre text not null default '',
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 last_activity timestamptz not null default now()
);
create table public.msg_members(
 conversation_id bigint not null references public.msg_conversations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 primary key(conversation_id,user_id)
);
create table public.msg_blocks(
 blocker_id uuid not null references auth.users(id),
 blocked_id uuid not null references auth.users(id),
 primary key(blocker_id,blocked_id)
);

insert into auth.users values
 ('20000000-0000-4000-8000-000000000001'),
 ('20000000-0000-4000-8000-000000000002'),
 ('20000000-0000-4000-8000-000000000003'),
 ('20000000-0000-4000-8000-000000000004');
insert into public.profiles values
 ('20000000-0000-4000-8000-000000000001','eleve','verifie','Alpha','34','2AS','Sciences'),
 ('20000000-0000-4000-8000-000000000002','eleve','verifie','Beta','34','2AS','Sciences'),
 ('20000000-0000-4000-8000-000000000003','eleve','verifie','Gamma','34','2AS','Sciences'),
 ('20000000-0000-4000-8000-000000000004','eleve','verifie','Delta','34','2AS','Sciences');

create function public.msg_is_moderator(uid uuid) returns boolean
language sql stable security definer set search_path=pg_catalog,public as $$ select false $$;
create function public.msg_can_dm(a uuid,b uuid) returns boolean
language sql stable security definer set search_path=pg_catalog,public as $$
 select auth.uid() is not null and a<>b and exists(
   select 1 from public.profiles x join public.profiles y
     on x.wilaya=y.wilaya and x.niveau=y.niveau and x.filiere=y.filiere
   where x.id=a and y.id=b and x.role='eleve' and y.role='eleve'
     and x.verif_statut='verifie' and y.verif_statut='verifie'
 )
$$;
create function public.msg_open_direct(p_peer uuid) returns bigint
language sql security definer as $$ select 999::bigint $$;
grant execute on function public.msg_open_direct(uuid) to authenticated;

create function public.msg_member_ok(cid bigint,uid uuid) returns boolean
language sql stable security definer set search_path=pg_catalog,public as $fn$
 select exists(select 1 from public.msg_conversations c
   where c.id=cid and (c.type='direct' or exists(
     select 1 from public.profiles p where p.id=uid
       and p.wilaya=c.wilaya and p.niveau=c.niveau
       and (c.filiere is null or p.filiere=c.filiere))))
$fn$;

create function public.msg_guard_direct() returns trigger
language plpgsql security definer set search_path=pg_catalog,public as $$
declare v_type text; v_other uuid;
begin
 select type into v_type from public.msg_conversations where id=new.conversation_id;
 if v_type='direct' then
   select user_id into v_other from public.msg_members
    where conversation_id=new.conversation_id and user_id<>new.user_id limit 1;
   if v_other is not null and not public.msg_can_dm(new.user_id,v_other) then
     raise exception 'msg_dm_interdit';
   end if;
 end if;
 return new;
end $$;
create trigger msg_tr_direct before insert on public.msg_members
for each row execute function public.msg_guard_direct();

alter table public.msg_conversations enable row level security;
alter table public.msg_members enable row level security;
grant select,insert,delete on public.msg_conversations,public.msg_members to authenticated;
create policy "msg conv creation" on public.msg_conversations for insert to authenticated
 with check(auth.uid()=created_by and (type='direct' or public.msg_is_moderator(auth.uid())));
create policy "msg members ajout" on public.msg_members for insert to authenticated
 with check(auth.uid()=user_id and public.msg_member_ok(conversation_id,auth.uid()));


-- Helpers de lecture réservés au test : contournent la RLS uniquement dans la
-- base éphémère pour vérifier l'état produit par les RPC SECURITY DEFINER.
create function public.test_direct_count() returns bigint
language sql security definer set search_path=pg_catalog,public as $test$
 select count(*) from public.msg_conversations where type='direct'
$test$;
create function public.test_member_count(cid bigint) returns bigint
language sql security definer set search_path=pg_catalog,public as $test$
 select count(*) from public.msg_members where conversation_id=cid
$test$;

\i supabase/migrations/202611130001_msg_invitation_consent.sql

-- A envoie à B : seule une demande pending existe, aucun DM n'est créé.
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
create temporary table test_invite(id uuid);
insert into test_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000002');
do $$ begin
 if public.test_direct_count()<>0 then
   raise exception 'dm_created_before_consent';
 end if;
 if (select status from public.msg_invites where id=(select id from test_invite))<>'pending' then
   raise exception 'invite_not_pending';
 end if;
end $$;

-- Une répétition de la même demande pendante reste idempotente au plafond du quota.
reset role;
insert into public.msg_invites(sender_id,recipient_id,status,created_at,responded_at)
select '20000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000002',
       'declined', now()-interval '1 hour', now()
from generate_series(1,20);
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
do $$ begin
 if public.msg_invite_send('20000000-0000-4000-8000-000000000002')
    <> (select id from test_invite) then
   raise exception 'pending_invite_retry_blocked_by_rate_limit';
 end if;
end $$;
reset role;
update public.msg_invites
   set created_at=now()-interval '2 days'
 where sender_id='20000000-0000-4000-8000-000000000001'
   and recipient_id='20000000-0000-4000-8000-000000000002'
   and status='declined'
   and created_at > now()-interval '2 hours';

-- L'expéditeur ne peut pas accepter/refuser la demande reçue par B.
do $$ begin
 begin
   perform public.msg_invite_accept((select id from test_invite));
   raise exception 'sender_accepted_own_invite';
 exception when others then
   if sqlerrm='sender_accepted_own_invite' then raise; end if;
   if sqlerrm<>'invite_not_found' then raise; end if;
 end;
 if public.msg_invite_decline((select id from test_invite)) then
   raise exception 'sender_declined_as_recipient';
 end if;
end $$;

-- B seul accepte : un DM et exactement deux membres sont créés.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000002',false);
create temporary table accepted_conv(id bigint);
insert into accepted_conv select public.msg_invite_accept((select id from test_invite));
do $$ begin
 if public.test_direct_count()<>1 then
   raise exception 'accepted_invite_did_not_create_one_dm';
 end if;
 if public.test_member_count((select id from accepted_conv))<>2 then
   raise exception 'accepted_dm_membership_invalid';
 end if;
 if (select status from public.msg_invites where id=(select id from test_invite))<>'accepted' then
   raise exception 'invite_not_accepted';
 end if;
 if public.msg_invite_accept((select id from test_invite))<>(select id from accepted_conv) then
   raise exception 'accept_not_idempotent';
 end if;
end $$;

-- Une demande distincte peut être annulée par son expéditeur.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
create temporary table cancel_invite(id uuid);
insert into cancel_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000003');
do $$ begin
 if not public.msg_invite_cancel((select id from cancel_invite)) then
   raise exception 'sender_cannot_cancel';
 end if;
 if (select status from public.msg_invites where id=(select id from cancel_invite))<>'cancelled' then
   raise exception 'cancel_status_invalid';
 end if;
end $$;

-- Le destinataire peut refuser, l'expéditeur ne le peut pas.
create temporary table decline_invite(id uuid);
insert into decline_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000004');
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000004',false);
do $$ begin
 if not public.msg_invite_decline((select id from decline_invite)) then
   raise exception 'recipient_cannot_decline';
 end if;
 if (select status from public.msg_invites where id=(select id from decline_invite))<>'declined' then
   raise exception 'decline_status_invalid';
 end if;
end $$;

-- Les transitions d'expiration par le destinataire/l'expéditeur sont signalées comme réussies.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
create temporary table expired_cancel_invite(id uuid);
insert into expired_cancel_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000003');
reset role;
update public.msg_invites set created_at=now()-interval '8 days'
 where id=(select id from expired_cancel_invite);
set role authenticated;
do $$ begin
 if not public.msg_invite_cancel((select id from expired_cancel_invite)) then
   raise exception 'expired_cancel_not_reported';
 end if;
 if (select status from public.msg_invites where id=(select id from expired_cancel_invite))<>'expired' then
   raise exception 'expired_cancel_status_invalid';
 end if;
end $$;

select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
create temporary table expired_decline_invite(id uuid);
insert into expired_decline_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000004');
reset role;
update public.msg_invites set created_at=now()-interval '8 days'
 where id=(select id from expired_decline_invite);
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000004',false);
do $$ begin
 if not public.msg_invite_decline((select id from expired_decline_invite)) then
   raise exception 'expired_decline_not_reported';
 end if;
 if (select status from public.msg_invites where id=(select id from expired_decline_invite))<>'expired' then
   raise exception 'expired_decline_status_invalid';
 end if;
end $$;

-- Le destinataire ne peut pas accepter une demande déjà annulée/refusée.
do $$ begin
 begin
   perform public.msg_invite_accept((select id from decline_invite));
   raise exception 'declined_invite_accepted';
 exception when others then
   if sqlerrm='declined_invite_accepted' then raise; end if;
   if sqlerrm<>'invite_not_pending' then raise; end if;
 end;
end $$;

-- Expiration après sept jours : le destinataire ne peut plus accepter et aucun DM n'est créé.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
create temporary table expiry_invite(id uuid);
insert into expiry_invite select public.msg_invite_send('20000000-0000-4000-8000-000000000003');

-- Un blocage du destinataire vers l'expéditeur interdit l'acceptation.
reset role;
insert into public.msg_blocks(blocker_id,blocked_id)
values('20000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001');
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000003',false);
do $$ begin
 begin
   perform public.msg_invite_accept((select id from expiry_invite));
   raise exception 'blocked_pair_was_accepted';
 exception when others then
   if sqlerrm='blocked_pair_was_accepted' then raise; end if;
   if sqlerrm<>'user_blocked' then raise; end if;
 end;
end $$;

-- Le blocage dans le sens inverse interdit également l'envoi d'une invitation.
reset role;
delete from public.msg_blocks
 where blocker_id='20000000-0000-4000-8000-000000000003'
   and blocked_id='20000000-0000-4000-8000-000000000001';
insert into public.msg_blocks(blocker_id,blocked_id)
values('20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003');
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',false);
do $$ begin
 begin
   perform public.msg_invite_send('20000000-0000-4000-8000-000000000003');
   raise exception 'blocked_pair_sent_invite';
 exception when others then
   if sqlerrm='blocked_pair_sent_invite' then raise; end if;
   if sqlerrm<>'user_blocked' then raise; end if;
 end;
end $$;

-- On retire le blocage pour isoler le scénario d'expiration.
reset role;
delete from public.msg_blocks
 where blocker_id='20000000-0000-4000-8000-000000000001'
   and blocked_id='20000000-0000-4000-8000-000000000003';
update public.msg_invites
   set created_at=now()-interval '8 days'
 where id=(select id from expiry_invite);
set role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000003',false);
do $$ declare v_result bigint; begin
 v_result:=public.msg_invite_accept((select id from expiry_invite));
 if v_result is not null then raise exception 'expired_invite_created_dm'; end if;
 if (select status from public.msg_invites where id=(select id from expiry_invite))<>'expired' then
   raise exception 'expired_invite_status_invalid';
 end if;
 if public.test_direct_count()<>1 then
   raise exception 'expired_invite_changed_dm_count';
 end if;
end $$;

-- Les anciennes RPC et INSERT directs ne permettent plus de contourner le consentement.
do $$ begin
 if has_function_privilege('authenticated','public.msg_open_direct(uuid)','EXECUTE') then
   raise exception 'legacy_direct_rpc_still_executable';
 end if;
 if has_function_privilege('authenticated','public.msg_invite_accept(uuid)','EXECUTE') is not true then
   raise exception 'accept_rpc_not_granted';
 end if;
end $$;

-- Le test passe en rôle propriétaire pour isoler le trigger du filtrage RLS.
reset role;
do $$
declare v_conv bigint;
begin
 begin
   -- La politique autorise la création d'un conteneur direct vide par son créateur.
   -- Le garde-fou doit refuser le premier membre tant qu'aucune invitation n'est acceptée.
   insert into public.msg_conversations(type,created_by,titre)
   values('direct','20000000-0000-4000-8000-000000000001','bypass')
   returning id into v_conv;
   insert into public.msg_members(conversation_id,user_id)
   values(v_conv,'20000000-0000-4000-8000-000000000001');
   raise exception 'direct_membership_bypass';
 exception when others then
   if sqlerrm='direct_membership_bypass' then raise; end if;
   if sqlerrm<>'msg_invitation_requise' then raise; end if;
 end;
end $$;

reset role;
select 'PASS: envoi, consentement, refus, annulation, idempotence et anti-contournement DM' as result;
