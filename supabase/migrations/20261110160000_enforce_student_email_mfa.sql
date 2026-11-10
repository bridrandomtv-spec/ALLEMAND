-- Le schéma versionné possède déjà le déclencheur on_auth_user_created.
-- On durcit sa fonction existante au lieu d'ajouter un second déclencheur concurrent.
-- Le rôle initial est imposé à eleve ; aucune métadonnée client de rôle n'est lue.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, pseudo, role, niveau, filiere, wilaya)
  values (
    new.id,
    coalesce(
      nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'pseudo'), ''),
      nullif(pg_catalog.split_part(coalesce(new.email, ''), '@', 1), ''),
      'Élève'
    ),
    'eleve',
    nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'niveau'), ''),
    nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'filiere'), ''),
    nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'wilaya'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Une fonction trigger ne doit pas devenir une RPC accessible aux clients.
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Les trois tables et les deux RPC MFA sont déclarés ici afin que cette migration
-- soit autonome : ils existaient dans le projet actif, mais n'étaient pas versionnés
-- dans la migration de la PR. Les données et secrets ne sont jamais copiés.
create table if not exists public.mfa_email_factors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled_at timestamptz not null default pg_catalog.now(),
  created_at timestamptz not null default pg_catalog.now()
);

create table if not exists public.mfa_email_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  verified_at timestamptz not null default pg_catalog.now(),
  expires_at timestamptz not null,
  primary key (user_id, session_id),
  constraint mfa_email_sessions_expiry_check check (expires_at > verified_at)
);

create table if not exists public.mfa_email_challenges (
  challenge_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  purpose text not null check (purpose in ('enroll', 'login')),
  code_hash bytea not null,
  created_at timestamptz not null default pg_catalog.now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts smallint not null default 0,
  constraint mfa_email_challenges_attempts_check check (attempts between 0 and 5),
  constraint mfa_email_challenges_expiry_check check (expires_at > created_at)
);

create index if not exists mfa_email_challenges_user_created_idx
  on public.mfa_email_challenges (user_id, created_at desc);

-- Ces tables ne sont accessibles qu'au backend privilégié de l'Edge Function.
-- RLS sans policy pour les rôles clients ; service_role reçoit uniquement le CRUD requis.
alter table public.mfa_email_factors enable row level security;
alter table public.mfa_email_sessions enable row level security;
alter table public.mfa_email_challenges enable row level security;

revoke all on table public.mfa_email_factors, public.mfa_email_sessions,
  public.mfa_email_challenges from public, anon, authenticated;
grant select, insert, update, delete on table public.mfa_email_factors,
  public.mfa_email_sessions, public.mfa_email_challenges to service_role;

-- Les RPC sont invoker (pas SECURITY DEFINER) et réservées à service_role.
-- L'Edge Function authentifie l'utilisateur et contrôle son rôle avant cet appel.
create or replace function public.mfa_email_issue_challenge(
  p_challenge_id uuid,
  p_user_id uuid,
  p_session_id uuid,
  p_purpose text,
  p_code_hash bytea
)
returns text
language plpgsql
set search_path = ''
as $function$
declare
  v_count integer;
begin
  if p_purpose not in ('enroll', 'login') then
    return 'invalid_purpose';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text, 0)
  );

  if exists (
    select 1
    from public.mfa_email_challenges c
    where c.user_id = p_user_id
      and c.created_at > pg_catalog.now() - interval '60 seconds'
  ) then
    return 'cooldown';
  end if;

  select pg_catalog.count(*) into v_count
  from public.mfa_email_challenges c
  where c.user_id = p_user_id
    and c.created_at > pg_catalog.now() - interval '1 hour';

  if v_count >= 5 then
    return 'hourly_limit';
  end if;

  select pg_catalog.count(*) into v_count
  from public.mfa_email_challenges c
  where c.user_id = p_user_id
    and c.created_at > pg_catalog.now() - interval '24 hours';

  if v_count >= 10 then
    return 'daily_limit';
  end if;

  update public.mfa_email_challenges
  set consumed_at = pg_catalog.now()
  where user_id = p_user_id
    and consumed_at is null;

  delete from public.mfa_email_challenges
  where created_at < pg_catalog.now() - interval '7 days';

  insert into public.mfa_email_challenges (
    challenge_id, user_id, session_id, purpose, code_hash, expires_at
  ) values (
    p_challenge_id, p_user_id, p_session_id, p_purpose, p_code_hash,
    pg_catalog.now() + interval '5 minutes'
  );

  return 'ok';
end;
$function$;

create or replace function public.mfa_email_consume_challenge(
  p_challenge_id uuid,
  p_user_id uuid,
  p_session_id uuid,
  p_code_hash bytea
)
returns table(ok boolean, purpose text, reason text)
language plpgsql
set search_path = ''
as $function$
declare
  v_challenge public.mfa_email_challenges%rowtype;
begin
  select c.* into v_challenge
  from public.mfa_email_challenges c
  where c.challenge_id = p_challenge_id
    and c.user_id = p_user_id
    and c.session_id = p_session_id
  for update;

  if not found then
    return query select false, null::text, 'invalid';
    return;
  end if;

  if v_challenge.consumed_at is not null then
    return query select false, v_challenge.purpose, 'used';
    return;
  end if;

  if v_challenge.expires_at <= pg_catalog.now() then
    update public.mfa_email_challenges
    set consumed_at = pg_catalog.now()
    where challenge_id = p_challenge_id;
    return query select false, v_challenge.purpose, 'expired';
    return;
  end if;

  if v_challenge.attempts >= 5 then
    return query select false, v_challenge.purpose, 'locked';
    return;
  end if;

  if v_challenge.code_hash is distinct from p_code_hash then
    update public.mfa_email_challenges
    set attempts = attempts + 1,
        consumed_at = case when attempts + 1 >= 5 then pg_catalog.now() else consumed_at end
    where challenge_id = p_challenge_id;
    return query select false, v_challenge.purpose, 'invalid_code';
    return;
  end if;

  update public.mfa_email_challenges
  set consumed_at = pg_catalog.now()
  where challenge_id = p_challenge_id;

  return query select true, v_challenge.purpose, 'ok';
end;
$function$;

revoke all on function public.mfa_email_issue_challenge(uuid, uuid, uuid, text, bytea)
  from public, anon, authenticated;
revoke all on function public.mfa_email_consume_challenge(uuid, uuid, uuid, bytea)
  from public, anon, authenticated;
grant execute on function public.mfa_email_issue_challenge(uuid, uuid, uuid, text, bytea)
  to service_role;
grant execute on function public.mfa_email_consume_challenge(uuid, uuid, uuid, bytea)
  to service_role;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create or replace function private.student_email_mfa_access_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select case
    when (select auth.jwt() ->> 'role') = 'service_role' then true
    when (select auth.uid()) is null then false
    when not exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
    ) then false
    when exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.role = 'eleve'
    ) then exists (
      select 1
      from public.mfa_email_factors f
      join public.mfa_email_sessions s
        on s.user_id = f.user_id
      where f.user_id = (select auth.uid())
        and s.session_id::text = coalesce((select auth.jwt() ->> 'session_id'), '')
        and s.expires_at > pg_catalog.now()
        and exists (
          select 1
          from auth.sessions auth_session
          where auth_session.id::text = coalesce((select auth.jwt() ->> 'session_id'), '')
            and auth_session.user_id = (select auth.uid())
            and (auth_session.not_after is null or auth_session.not_after > pg_catalog.now())
        )
    )
    else exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('prof', 'admin', 'parent')
    )
  end;
$function$;

revoke all on function private.student_email_mfa_access_allowed() from public, anon;
grant execute on function private.student_email_mfa_access_allowed() to authenticated, service_role;

-- Un garde restrictif par table : il s'additionne aux politiques actuelles
-- sans remplacer les règles de propriété, de rôle, de modération ou de wilaya.
do $migration$
declare
  v_table record;
begin
  for v_table in
    select c.relname
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
      and c.relrowsecurity
  loop
    execute pg_catalog.format(
      'drop policy if exists student_email_mfa_gate on public.%I',
      v_table.relname
    );
    execute pg_catalog.format(
      'create policy student_email_mfa_gate on public.%I as restrictive for all to authenticated using ((select private.student_email_mfa_access_allowed())) with check ((select private.student_email_mfa_access_allowed()))',
      v_table.relname
    );
  end loop;
end
$migration$;

-- Le bucket privé "prive" contient aussi des documents et pièces jointes.
-- Les URL signées déjà émises restent des liens porteurs jusqu'à leur expiration.
drop policy if exists student_email_mfa_gate on storage.objects;
create policy student_email_mfa_gate
  on storage.objects as restrictive
  for all to authenticated
  using (
    bucket_id <> 'prive'
    or (select private.student_email_mfa_access_allowed())
  )
  with check (
    bucket_id <> 'prive'
    or (select private.student_email_mfa_access_allowed())
  );

-- Les fonctions SECURITY DEFINER ci-dessous contournent les politiques RLS
-- pendant leur exécution. Elles appliquent donc explicitement le même garde
-- pour les opérations et lectures personnelles accessibles aux étudiants.

create or replace function public.active_entitlement(uid uuid)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select case
    when not private.student_email_mfa_access_allowed() then false
    when uid is null then false
    when auth.uid() is distinct from uid
         and not public.is_admin()
      then false
    else exists (
      select 1
      from public.subscriptions s
      where s.user_id = uid
        and s.statut = 'actif'
        and (s.fin is null or s.fin > now())
    )
  end;
$function$;

create or replace function public.agreement_accept(aid bigint, nom_representant text default ''::text, lien_representant text default ''::text)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $function$
declare
  pr public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;
  if not private.student_email_mfa_access_allowed() then
    raise exception 'mfa_required';
  end if;
  if not exists (
    select 1 from public.agreements a
    where a.id = aid and a.actif
  ) then
    raise exception 'agreement_indisponible';
  end if;
  select * into pr from public.profiles where id = auth.uid();
  if not found then raise exception 'profil_introuvable'; end if;
  if pr.role = 'eleve' and coalesce(nom_representant,'') = '' then
    raise exception 'representant_requis_pour_mineur';
  end if;
  insert into public.agreement_acceptances
    (agreement_id, user_id, accepte_par, nom_representant, lien_representant)
  values (
    aid, auth.uid(), auth.uid(),
    case when pr.role = 'eleve'
      then agreement_accept.nom_representant
      else coalesce(nullif(agreement_accept.nom_representant,''), pr.pseudo)
    end,
    coalesce(
      nullif(agreement_accept.lien_representant,''),
      case when pr.role = 'eleve' then 'representant_legal' else 'self' end
    )
  );
  return jsonb_build_object('ok', true);
end;
$function$;

create or replace function public.agreement_status_for(uid uuid, cle text)
returns text
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select case
    when auth.uid() is null then null
    when not private.student_email_mfa_access_allowed() then null
    when $1 is distinct from auth.uid()
      and not public.admin_can(auth.uid(), 'reports.read') then null
    else coalesce((
      select case
        when (last.meta->>'retrait') = 'true' then 'retire'
        when last.agreement_id <> (
          select c.id from public.agreements c
          where c.cle = $2 and c.actif
          order by c.version desc limit 1
        ) then 'version_a_reevaluer'
        else 'accepte'
      end
      from (
        select a.* from public.agreement_acceptances a
        join public.agreements g on g.id = a.agreement_id
        where a.user_id = $1 and g.cle = $2
        order by a.accepte_at desc, a.id desc limit 1
      ) last
    ), 'jamais')
  end;
$function$;

create or replace function public.agreement_withdraw(aid bigint)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $function$
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if not private.student_email_mfa_access_allowed() then raise exception 'mfa_required'; end if;
  if not exists (
    select 1 from public.agreement_acceptances a
    where a.agreement_id = aid
      and a.user_id = auth.uid()
      and a.meta->>'retrait' is distinct from 'true'
  ) then raise exception 'acceptation_introuvable'; end if;
  insert into public.agreement_acceptances
    (agreement_id, user_id, accepte_par, meta)
  values (aid, auth.uid(), auth.uid(), '{"retrait":true}'::jsonb);
  return jsonb_build_object('ok', true);
end;
$function$;

create or replace function public.msg_can_dm(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select private.student_email_mfa_access_allowed()
     and auth.uid() is not null
     and auth.uid() in (a, b)
     and exists (
       select 1
       from public.profiles pa
       join public.profiles pb
         on pb.wilaya = pa.wilaya
        and pb.niveau = pa.niveau
        and pb.filiere = pa.filiere
       where pa.id = a and pb.id = b and a <> b
         and pa.wilaya is not null and pa.niveau is not null
         and pa.filiere is not null
         and pa.verif_statut = 'verifie'
         and pb.verif_statut = 'verifie'
     );
$function$;

create or replace function public.msg_is_member(uid uuid, cid bigint)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select private.student_email_mfa_access_allowed()
     and auth.uid() is not null
     and uid = auth.uid()
     and (
       exists (
         select 1 from public.msg_members m
         where m.conversation_id = cid and m.user_id = auth.uid()
       )
       or exists (
         select 1
         from public.msg_conversations c
         join public.profiles p on p.id = auth.uid()
         where c.id = cid and c.type = 'groupe'
           and p.wilaya is not null and p.niveau is not null
           and p.wilaya = c.wilaya and p.niveau = c.niveau
           and (c.filiere is null or p.filiere = c.filiere)
       )
     );
$function$;

create or replace function public.msg_member_ok(cid bigint, uid uuid)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select private.student_email_mfa_access_allowed()
     and auth.uid() is not null
     and uid = auth.uid()
     and exists (
       select 1 from public.msg_conversations c
       where c.id = cid and (
         (
           c.type = 'direct' and (
             (
               (select count(*) from public.msg_members m where m.conversation_id = cid) = 0
               and c.created_by = auth.uid()
             )
             or (
               (select count(*) from public.msg_members m where m.conversation_id = cid) = 1
               and exists (
                 select 1 from public.msg_members m
                 where m.conversation_id = cid
                   and m.user_id <> auth.uid()
                   and public.msg_can_dm(auth.uid(), m.user_id)
               )
             )
           )
         )
         or (
           c.type <> 'direct'
           and exists (
             select 1 from public.profiles p
             where p.id = auth.uid()
               and p.wilaya is not null and p.niveau is not null
               and p.wilaya = c.wilaya and p.niveau = c.niveau
               and (c.filiere is null or p.filiere = c.filiere)
           )
         )
       )
     );
$function$;

create or replace function public.msg_not_blocked(cid bigint, snd uuid)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select private.student_email_mfa_access_allowed()
     and auth.uid() is not null
     and snd = auth.uid()
     and not exists (
       select 1
       from public.msg_members m
       join public.msg_blocks b
         on b.blocker_id = m.user_id
        and b.blocked_id = auth.uid()
       where m.conversation_id = cid
     );
$function$;

create or replace function public.msg_open_direct(p_other uuid)
returns bigint
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_conv bigint;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if not private.student_email_mfa_access_allowed() then raise exception 'mfa_required'; end if;
  if p_other is null or p_other = v_uid then raise exception 'msg_invalid_recipient'; end if;
  if not public.msg_can_dm(v_uid, p_other) then raise exception 'msg_dm_interdit'; end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      least(v_uid::text, p_other::text) || ':' || greatest(v_uid::text, p_other::text), 0
    )
  );
  select c.id into v_conv
  from public.msg_conversations c
  join public.msg_members m on m.conversation_id = c.id
  where c.type = 'direct'
  group by c.id
  having count(*) = 2
     and count(*) filter (where m.user_id = v_uid) = 1
     and count(*) filter (where m.user_id = p_other) = 1
  order by c.id desc limit 1;
  if v_conv is not null then return v_conv; end if;
  insert into public.msg_conversations (type, created_by, titre)
  values ('direct', v_uid, '')
  returning id into v_conv;
  insert into public.msg_members (conversation_id, user_id)
  values (v_conv, v_uid), (v_conv, p_other);
  return v_conv;
end;
$function$;

create or replace function public.my_parent_link_requests()
returns table(request_id bigint, parent_id uuid, parent_pseudo text, created_at timestamp with time zone)
language sql
stable
security definer
set search_path to 'pg_catalog', 'public'
as $function$
  select r.id, r.parent_id, coalesce(p.pseudo,'') as parent_pseudo, r.created_at
  from public.parent_link_requests r
  left join public.profiles p on p.id = r.parent_id
  where auth.uid() is not null
    and private.student_email_mfa_access_allowed()
    and r.child_id = auth.uid()
    and r.status = 'pending'
    and exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.role = 'eleve'
    )
  order by r.created_at desc;
$function$;

create or replace function public.respond_parent_link_request(p_request_id bigint, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $function$
declare
  v_req public.parent_link_requests%rowtype;
  v_parent_role text;
  v_child_role text;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if not private.student_email_mfa_access_allowed() then raise exception 'mfa_required'; end if;
  if p_request_id is null or p_accept is null then raise exception 'parametres_invalides'; end if;
  select * into v_req
  from public.parent_link_requests
  where id = p_request_id and child_id = auth.uid() and status = 'pending'
  for update;
  if not found then raise exception 'demande_indisponible'; end if;
  select role into v_parent_role from public.profiles where id = v_req.parent_id;
  select role into v_child_role from public.profiles where id = auth.uid();
  if v_parent_role is distinct from 'parent' or v_child_role is distinct from 'eleve' then
    raise exception 'roles_incompatibles';
  end if;
  if p_accept then
    insert into public.child_links(parent_id, child_id)
    values (v_req.parent_id, v_req.child_id)
    on conflict (parent_id, child_id) do nothing;
    update public.parent_link_requests
      set status='accepted', decided_at=now(), decided_by=auth.uid()
      where id=v_req.id;
  else
    update public.parent_link_requests
      set status='rejected', decided_at=now(), decided_by=auth.uid()
      where id=v_req.id;
  end if;
  return jsonb_build_object('ok', true, 'status',
    case when p_accept then 'accepted' else 'rejected' end);
end;
$function$;

create or replace function public.subscription_set_preuve(p_subscription_id bigint, p_preuve text)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_id bigint;
begin
  if v_uid is null then raise exception 'authentification_requise'; end if;
  if not private.student_email_mfa_access_allowed() then raise exception 'mfa_required'; end if;
  if p_preuve is null or btrim(p_preuve) = '' then raise exception 'preuve_obligatoire'; end if;
  update public.subscriptions as s
     set preuve = p_preuve, statut = 'preuve'
   where s.id = p_subscription_id
     and s.user_id = v_uid
     and s.statut in ('en_attente', 'preuve')
  returning s.id into v_id;
  if v_id is null then raise exception 'abonnement_introuvable_ou_non_modifiable'; end if;
  return jsonb_build_object('ok', true, 'id', v_id, 'statut', 'preuve');
end;
$function$;

create or replace function public.unlink_child(p_child_id uuid)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog', 'public'
as $function$
declare
  v_deleted integer;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if not private.student_email_mfa_access_allowed() then raise exception 'mfa_required'; end if;
  if p_child_id is null then raise exception 'enfant_invalide'; end if;
  delete from public.child_links cl
  where cl.child_id = p_child_id
    and (
      (cl.parent_id = auth.uid() and exists (
        select 1 from public.profiles p where p.id = auth.uid() and p.role = 'parent'
      ))
      or (cl.child_id = auth.uid() and exists (
        select 1 from public.profiles p where p.id = auth.uid() and p.role = 'eleve'
      ))
      or public.is_admin()
    );
  get diagnostics v_deleted = row_count;
  if v_deleted = 0 then raise exception 'lien_introuvable_ou_non_autorise'; end if;
  return jsonb_build_object('ok', true);
end;
$function$;

-- Les fonctions SECURITY DEFINER publiques de cette migration sont des RPC
-- réservées aux sessions authentifiées. CREATE OR REPLACE ne retire pas les
-- droits EXECUTE implicites de PUBLIC : les révoquer explicitement évite tout
-- appel anonyme, puis accorder les rôles applicatifs attendus.
revoke all on function public.active_entitlement(uuid) from public, anon;
grant execute on function public.active_entitlement(uuid) to authenticated, service_role;

revoke all on function public.agreement_accept(bigint, text, text) from public, anon;
grant execute on function public.agreement_accept(bigint, text, text) to authenticated, service_role;

revoke all on function public.agreement_status_for(uuid, text) from public, anon;
grant execute on function public.agreement_status_for(uuid, text) to authenticated, service_role;

revoke all on function public.agreement_withdraw(bigint) from public, anon;
grant execute on function public.agreement_withdraw(bigint) to authenticated, service_role;

revoke all on function public.msg_can_dm(uuid, uuid) from public, anon;
grant execute on function public.msg_can_dm(uuid, uuid) to authenticated, service_role;

revoke all on function public.msg_is_member(uuid, bigint) from public, anon;
grant execute on function public.msg_is_member(uuid, bigint) to authenticated, service_role;

revoke all on function public.msg_member_ok(bigint, uuid) from public, anon;
grant execute on function public.msg_member_ok(bigint, uuid) to authenticated, service_role;

revoke all on function public.msg_not_blocked(bigint, uuid) from public, anon;
grant execute on function public.msg_not_blocked(bigint, uuid) to authenticated, service_role;

revoke all on function public.msg_open_direct(uuid) from public, anon;
grant execute on function public.msg_open_direct(uuid) to authenticated, service_role;

revoke all on function public.my_parent_link_requests() from public, anon;
grant execute on function public.my_parent_link_requests() to authenticated, service_role;

revoke all on function public.respond_parent_link_request(bigint, boolean) from public, anon;
grant execute on function public.respond_parent_link_request(bigint, boolean) to authenticated, service_role;

revoke all on function public.subscription_set_preuve(bigint, text) from public, anon;
grant execute on function public.subscription_set_preuve(bigint, text) to authenticated, service_role;

revoke all on function public.unlink_child(uuid) from public, anon;
grant execute on function public.unlink_child(uuid) to authenticated, service_role;

comment on function private.student_email_mfa_access_allowed() is
  'Allows authenticated non-students; requires an unexpired custom e-mail MFA session for profiles.role=eleve.';
