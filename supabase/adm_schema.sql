-- ══ ADM-1 — sous-administrateurs, permissions et périmètres wilaya ══
create table if not exists public.admin_roles (
  cle text primary key,
  libelle text not null,
  priorite int not null default 100
);
create table if not exists public.admin_permissions (
  role_cle text not null references public.admin_roles(cle) on delete cascade,
  permission text not null,
  primary key (role_cle, permission)
);
create table if not exists public.wilaya_assignments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  code_wilaya text not null,
  role_cle text not null references public.admin_roles(cle) on delete restrict,
  primary key (user_id, code_wilaya)
);
alter table public.admin_roles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.wilaya_assignments enable row level security;

alter table public.wilaya_assignments add column if not exists active boolean not null default true;

create or replace function public.admin_role_of(uid uuid) returns text
language sql stable security definer set search_path = public as $$
  select wa.role_cle from public.wilaya_assignments wa
    join public.admin_roles r on r.cle = wa.role_cle
   where wa.user_id = uid and wa.active
   order by r.priorite asc limit 1;
$$;
create or replace function public.admin_wilayas(uid uuid) returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(wa.code_wilaya), '{}') from public.wilaya_assignments wa where wa.user_id = uid and wa.active;
$$;
create or replace function public.admin_can(uid uuid, perm text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.wilaya_assignments wa
    join public.admin_permissions p on p.role_cle = wa.role_cle
    where wa.user_id = uid and wa.active and p.permission = perm
  );
$$;
create or replace function public.admin_sees_wilaya(uid uuid, w text) returns boolean
language sql stable security definer set search_path = public as $$
  select case when public.admin_role_of(uid) = 'admin_general' then true
              else w = any(public.admin_wilayas(uid)) end;
$$;

drop policy if exists "roles lecture" on public.admin_roles;
create policy "roles lecture" on public.admin_roles for select to authenticated using (true);
drop policy if exists "permissions lecture" on public.admin_permissions;
create policy "permissions lecture" on public.admin_permissions for select to authenticated using (true);
drop policy if exists "assignments lecture soi+gestion" on public.wilaya_assignments;
create policy "assignments lecture soi+gestion" on public.wilaya_assignments for select to authenticated
  using (user_id = auth.uid()
         or public.admin_can(auth.uid(), 'agents.manage')
         or (public.admin_role_of(auth.uid()) = 'responsable_regional'
             and code_wilaya = any(public.admin_wilayas(auth.uid()))));
drop policy if exists "assignments gestion" on public.wilaya_assignments;
create policy "assignments gestion" on public.wilaya_assignments for all to authenticated
  using (public.admin_can(auth.uid(), 'agents.manage'))
  with check (public.admin_can(auth.uid(), 'agents.manage'));

drop policy if exists "payments lecture agent scopé" on public.payments;
create policy "payments lecture agent scopé" on public.payments for select to authenticated
  using (public.admin_can(auth.uid(), 'payments.validate')
         and exists (select 1 from public.profiles st
                      where st.id = payments.user_id
                        and public.admin_sees_wilaya(auth.uid(), st.wilaya)));
drop policy if exists "payments validation agent scopé" on public.payments;
create policy "payments validation agent scopé" on public.payments for update to authenticated
  using (public.admin_can(auth.uid(), 'payments.validate')
         and exists (select 1 from public.profiles st
                      where st.id = payments.user_id
                        and public.admin_sees_wilaya(auth.uid(), st.wilaya)))
  with check (public.admin_can(auth.uid(), 'payments.validate'));

insert into public.admin_roles (cle, libelle, priorite) values
  ('admin_general','Administrateur général',10),
  ('responsable_regional','Responsable régional',20),
  ('agent_paiement','Agent de paiement',30),
  ('responsable_pedagogique','Responsable pédagogique',40),
  ('agent_support','Agent de support',50)
on conflict (cle) do nothing;
insert into public.admin_permissions (role_cle, permission) values
  ('admin_general','agents.manage'), ('admin_general','payments.validate'), ('admin_general','receipts.issue'),
  ('admin_general','students.read'), ('admin_general','plans.edit'), ('admin_general','tickets.handle'), ('admin_general','reports.read'),
  ('responsable_regional','students.read'), ('responsable_regional','reports.read'),
  ('responsable_regional','payments.validate'), ('responsable_regional','tickets.handle'),
  ('agent_paiement','payments.validate'), ('agent_paiement','receipts.issue'),
  ('responsable_pedagogique','students.read'), ('responsable_pedagogique','plans.edit'),
  ('agent_support','tickets.handle')
on conflict (role_cle, permission) do nothing;

create or replace function public.assignment_set_active(uid uuid, active boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare w text;
begin
  if not public.admin_can(auth.uid(), 'agents.manage') then raise exception 'permission_refusee'; end if;
  select code_wilaya into w from public.wilaya_assignments where user_id = uid limit 1;
  update public.wilaya_assignments set active = active where user_id = uid;
  perform public.audit_log(case when active then 'agent.reactivate' else 'agent.suspend' end,
    'wilaya_assignment', uid::text, null, jsonb_build_object('active', active, 'wilaya', coalesce(w,'')), coalesce(w,''));
  return jsonb_build_object('ok', true);
end $$;
