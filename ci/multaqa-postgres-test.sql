-- Tests PostgreSQL isolés du fil ملتقى الطلاب.
-- Exécuté uniquement dans le service PostgreSQL éphémère de GitHub Actions.
-- Aucun accès au projet Supabase actif et aucune donnée réelle.
\set ON_ERROR_STOP on

do $$
begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;

create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null,
  verif_statut text not null,
  pseudo text not null
);

insert into auth.users(id) values
 ('10000000-0000-4000-8000-000000000001'),
 ('10000000-0000-4000-8000-000000000002'),
 ('10000000-0000-4000-8000-000000000003');
insert into public.profiles(id,role,verif_statut,pseudo) values
 ('10000000-0000-4000-8000-000000000001','eleve','verifie','EleveVerifie'),
 ('10000000-0000-4000-8000-000000000002','eleve','en_attente','EleveAttente'),
 ('10000000-0000-4000-8000-000000000003','professeur','verifie','ProfesseurTest');

\i supabase/migrations/202611130002_multaqa_community_feed.sql

-- Vérification des privilèges : aucun accès direct aux tables, RPC réservées
-- aux comptes authentifiés.
do $$
declare t text;
begin
  foreach t in array array['multaqa_posts','multaqa_comments','multaqa_reactions','multaqa_reports'] loop
    if has_table_privilege('authenticated','public.'||t,'SELECT')
       or has_table_privilege('authenticated','public.'||t,'INSERT')
       or has_table_privilege('anon','public.'||t,'SELECT') then
      raise exception 'direct_table_access_not_revoked: %', t;
    end if;
  end loop;
  if has_function_privilege('anon','public.multaqa_feed(integer,bigint)','EXECUTE') then
    raise exception 'anon_can_execute_feed';
  end if;
  if not has_function_privilege('authenticated','public.multaqa_feed(integer,bigint)','EXECUTE') then
    raise exception 'authenticated_cannot_execute_feed';
  end if;
end $$;

-- Compte élève vérifié : publication, lecture, commentaire, réaction,
-- signalement et suppression fonctionnent via les RPC.
set role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',false);
do $$
declare p bigint; c bigint; n integer;
begin
  p := public.multaqa_create_post('Publication synthétique de test');
  if p is null then raise exception 'post_creation_failed'; end if;
  select count(*) into n from public.multaqa_feed(20,null) where post_id=p;
  if n <> 1 then raise exception 'verified_student_feed_failed'; end if;
  c := public.multaqa_create_comment(p,'Commentaire synthétique',null);
  if c is null then raise exception 'comment_creation_failed'; end if;
  select count(*) into n from public.multaqa_comments(p,50,null) where comment_id=c;
  if n <> 1 then raise exception 'comment_read_failed'; end if;
  if not public.multaqa_toggle_reaction(p,'like') then raise exception 'reaction_add_failed'; end if;
  if public.multaqa_toggle_reaction(p,'like') then raise exception 'reaction_remove_failed'; end if;
  if not public.multaqa_report('post',p,'other',null) then raise exception 'report_failed'; end if;
  if not public.multaqa_delete_own_comment(c) then raise exception 'own_comment_delete_failed'; end if;
  if not public.multaqa_delete_own_post(p) then raise exception 'own_post_delete_failed'; end if;
end $$;

-- Compte non vérifié et compte non élève : aucune lecture du fil personnel.
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',false);
do $$
begin
  begin
    perform * from public.multaqa_feed(20,null);
    raise exception 'unverified_student_was_allowed';
  exception when others then
    if sqlerrm = 'unverified_student_was_allowed' then raise; end if;
    if sqlerrm <> 'student_account_required' then raise; end if;
  end;
end $$;

select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000003',false);
do $$
begin
  begin
    perform * from public.multaqa_feed(20,null);
    raise exception 'non_student_was_allowed';
  exception when others then
    if sqlerrm = 'non_student_was_allowed' then raise; end if;
    if sqlerrm <> 'student_account_required' then raise; end if;
  end;
end $$;

-- Session authentifiée sans identité : refus.
select set_config('request.jwt.claim.sub','',false);
do $$
begin
  begin
    perform * from public.multaqa_feed(20,null);
    raise exception 'anonymous_session_was_allowed';
  exception when others then
    if sqlerrm = 'anonymous_session_was_allowed' then raise; end if;
    if sqlerrm <> 'student_account_required' then raise; end if;
  end;
end $$;
reset role;

select 'PASS: migration isolée, privilèges, vérification scolaire et RPC principales' as result;
