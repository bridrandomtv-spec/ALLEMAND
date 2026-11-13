-- Lot 453 — tests isolés PostgreSQL 17 de la découverte privée.
-- Aucun accès à Supabase actif ni aucune donnée réelle.
\set ON_ERROR_STOP on
do $$ begin
  if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.profiles(
 id uuid primary key references auth.users(id),
 role text not null, verif_statut text not null, pseudo text not null,
 wilaya text, niveau text, filiere text
);
insert into auth.users values
 ('10000000-0000-4000-8000-000000000001'),
 ('10000000-0000-4000-8000-000000000002'),
 ('10000000-0000-4000-8000-000000000003'),
 ('10000000-0000-4000-8000-000000000004'),
 ('10000000-0000-4000-8000-000000000005');
insert into public.profiles values
 ('10000000-0000-4000-8000-000000000001','eleve','verifie','Alpha Student','34','2AS','Sciences'),
 ('10000000-0000-4000-8000-000000000002','eleve','verifie','Beta Student','34','2AS','Sciences'),
 ('10000000-0000-4000-8000-000000000003','eleve','en_attente','Gamma Student','34','2AS','Sciences'),
 ('10000000-0000-4000-8000-000000000004','prof','verifie','Teacher','34','2AS','Sciences'),
 ('10000000-0000-4000-8000-000000000005','eleve','verifie','Other Class','16','3AS','Maths');

create function public.msg_pair_blocked(a uuid,b uuid) returns boolean
language sql stable security definer set search_path=pg_catalog,public as $$ select false $$;
\i supabase/migrations/202611130003_msg_student_discovery.sql

select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',false);
do $ begin
 if public.msg_can_dm('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002') is not true then
   raise exception 'verified_same_class_pair_denied';
 end if;
 if public.msg_can_dm('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003') then
   raise exception 'unverified_target_allowed';
 end if;
 if public.msg_can_dm('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000004') then
   raise exception 'non_student_target_allowed';
 end if;
end $$;

set role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',false);
do $$ declare n integer; begin
 select count(*) into n from public.msg_student_search('Beta',12);
 if n<>1 then raise exception 'discovery_expected_one_verified_peer_got_%',n; end if;
 select count(*) into n from public.msg_student_search('Gamma',12);
 if n<>0 then raise exception 'unverified_profile_leaked'; end if;
 select count(*) into n from public.msg_student_search('Other',12);
 if n<>0 then raise exception 'other_class_profile_leaked'; end if;
 begin
   perform * from public.msg_student_search('Be',12);
   raise exception 'short_query_allowed';
 exception when others then
   if sqlerrm='short_query_allowed' then raise; end if;
   if sqlerrm<>'search_query_length' then raise; end if;
 end;
 for i in 1..5 loop perform * from public.msg_student_search('Beta',12); end loop;
 begin
   perform * from public.msg_student_search('Beta',12);
   raise exception 'search_quota_not_enforced';
 exception when others then
   if sqlerrm='search_quota_not_enforced' then raise; end if;
   if sqlerrm<>'search_rate_limit' then raise; end if;
 end;
end $;
-- Le compte non vérifié ne peut pas lancer de recherche.
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000003',false);
do $$ begin
 begin
   perform * from public.msg_student_search('Beta',12);
   raise exception 'unverified_search_allowed';
 exception when others then
   if sqlerrm='unverified_search_allowed' then raise; end if;
   if sqlerrm<>'school_verification_required' then raise; end if;
 end;
end $$;
-- Aucun accès direct à la table de limitation ni à la fonction interne.
do $$ begin
 if has_table_privilege('authenticated','public.msg_discovery_limits','SELECT')
    or has_table_privilege('authenticated','public.msg_discovery_limits','INSERT') then
   raise exception 'rate_table_exposed';
 end if;
 if has_function_privilege('authenticated','public.msg_can_dm(uuid,uuid)','EXECUTE') then
   raise exception 'internal_dm_guard_exposed';
 end if;
 if has_function_privilege('anon','public.msg_student_search(text,integer)','EXECUTE') then
   raise exception 'anon_search_allowed';
 end if;
end $$;
reset role;
select 'PASS: recherche limitée aux élèves vérifiés de la même classe' as result;
