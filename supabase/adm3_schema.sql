-- ══ ADM-3 — accords d'utilisation : versions + acceptations horodatées (mineurs → représentant) ══
create table if not exists public.agreements (
  id bigint generated always as identity primary key,
  cle text not null,
  version int not null default 1,
  titre text not null,
  corps text not null,
  actif boolean not null default true,
  cree_par uuid,
  cree_at timestamptz not null default now(),
  unique (cle, version)
);
alter table public.agreements enable row level security;
create table if not exists public.agreement_acceptances (
  id bigint generated always as identity primary key,
  agreement_id bigint not null references public.agreements(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  accepte_par uuid not null,
  nom_representant text not null default '',
  lien_representant text not null default '',
  accepte_at timestamptz not null default now(),
  meta jsonb not null default '{}'
);
alter table public.agreement_acceptances enable row level security;

create or replace function public.agreement_current(cle text) returns public.agreements
language sql stable security definer set search_path = public as $$
  select * from public.agreements where cle = $1 and actif order by version desc limit 1;
$$;

create or replace function public.agreement_accept(aid bigint, nom_representant text default '', lien_representant text default '') returns jsonb
language plpgsql security definer set search_path = public as $$
declare pr public.profiles%rowtype;
begin
  select * into pr from public.profiles where id = auth.uid();
  if pr.role = 'eleve' and coalesce(nom_representant,'') = '' then
    raise exception 'representant_requis_pour_mineur';
  end if;
  insert into public.agreement_acceptances (agreement_id, user_id, accepte_par, nom_representant, lien_representant)
  values (aid, auth.uid(), auth.uid(),
          case when pr.role = 'eleve' then nom_representant else coalesce(nullif(nom_representant,''), pr.pseudo) end,
          coalesce(nullif(lien_representant,''), case when pr.role = 'eleve' then 'representant_legal' else 'self' end));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.agreement_accept_for(aid bigint, child_uid uuid, nom_representant text default '', lien_representant text default '') returns jsonb
language plpgsql security definer set search_path = public as $$
declare pr public.profiles%rowtype;
begin
  if not exists (select 1 from public.child_links cl where cl.parent_id = auth.uid() and cl.child_id = child_uid) then
    raise exception 'lien_parent_enfant_absent';
  end if;
  select * into pr from public.profiles where id = auth.uid();
  insert into public.agreement_acceptances (agreement_id, user_id, accepte_par, nom_representant, lien_representant, meta)
  values (aid, child_uid, auth.uid(),
          coalesce(nullif(nom_representant,''), pr.pseudo),
          coalesce(nullif(lien_representant,''), 'parent'),
          '{"par_representant":true}');
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.agreement_withdraw(aid bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  insert into public.agreement_acceptances (agreement_id, user_id, accepte_par, meta)
  values (aid, auth.uid(), auth.uid(), '{"retrait":true}');
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.agreement_status_for(cle text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce((
    select case
      when (last.meta->>'retrait') = 'true' then 'retire'
      when last.agreement_id <> (select c.id from public.agreements c where c.cle = $1 and c.actif order by c.version desc limit 1) then 'version_a_reevaluer'
      else 'accepte' end
    from (select a.* from public.agreement_acceptances a
           join public.agreements g on g.id = a.agreement_id
          where a.user_id = auth.uid() and g.cle = $1
          order by a.accepte_at desc, a.id desc limit 1) last
  ), 'jamais');
$$;

create or replace function public.agreement_publish(cle text, titre text, corps text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v int; nid bigint;
begin
  if not public.admin_can(auth.uid(), 'agreements.manage') then raise exception 'permission_refusee'; end if;
  select coalesce(max(version),0)+1 into v from public.agreements where cle = agreement_publish.cle;
  update public.agreements set actif = false where cle = agreement_publish.cle and actif;
  insert into public.agreements (cle, version, titre, corps, cree_par)
  values (cle, v, titre, corps, auth.uid()) returning id into nid;
  perform public.audit_log('agreement.publish','agreement', nid::text, null, jsonb_build_object('cle', cle, 'version', v), '');
  return jsonb_build_object('ok', true, 'id', nid, 'version', v);
end $$;

drop trigger if exists agreement_acceptances_tr_immuable on public.agreement_acceptances;
create trigger agreement_acceptances_tr_immuable before update or delete on public.agreement_acceptances
  for each row execute function public.immutable_row();

create or replace function public.acceptances_tr_audit_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.audit_log(
    case when (new.meta->>'retrait') = 'true' then 'agreement.retrait' else 'agreement.accept' end,
    'agreement_acceptance', new.id::text, null,
    jsonb_build_object('agreement', new.agreement_id, 'pour', new.user_id, 'representant', new.nom_representant), '');
  return new;
end $$;
drop trigger if exists agreement_acceptances_tr_audit on public.agreement_acceptances;
create trigger agreement_acceptances_tr_audit after insert on public.agreement_acceptances
  for each row execute function public.acceptances_tr_audit_fn();

drop policy if exists "agreements lecture tous connectes" on public.agreements;
create policy "agreements lecture tous connectes" on public.agreements for select to authenticated using (true);
drop policy if exists "acceptances lecture propre+rapports" on public.agreement_acceptances;
create policy "acceptances lecture propre+rapports" on public.agreement_acceptances for select to authenticated
  using (user_id = auth.uid() or accepte_par = auth.uid() or public.admin_can(auth.uid(), 'reports.read'));

insert into public.agreements (cle, version, titre, corps) values
 ('conditions_utilisation', 1, 'Conditions d utilisation — v1',
  'Article 1 — Objet : espace pedagogique et messagerie scolaire pour eleves, parents et enseignants. Article 2 — Compte personnel ; l eleve mineur declare un representant legal lors des acceptations. Article 3 — Donnees traitees pour les seuls besoins du service ; pieces jointes de la messagerie dans le bucket prive. Article 4 — Tout signalement confirme peut entrainer la suspension. Article 5 — Un recu numerote est emis apres confirmation ; aucune correction ne supprime la trace ecrite.')
on conflict (cle, version) do nothing;
insert into public.admin_permissions (role_cle, permission) values ('admin_general','agreements.manage')
on conflict (role_cle, permission) do nothing;
