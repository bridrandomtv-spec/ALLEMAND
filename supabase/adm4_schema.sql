-- ══ ADM-4 — tableau de bord scopé, fiches élèves consolidées, paramètres plateforme ══
create table if not exists public.platform_settings (
  cle text primary key,
  valeur jsonb not null default '{}',
  maj_par uuid,
  maj_at timestamptz not null default now()
);
alter table public.platform_settings enable row level security;
drop policy if exists "settings lecture connectes" on public.platform_settings;
create policy "settings lecture connectes" on public.platform_settings for select to authenticated using (true);

drop policy if exists "profils lecture agents scopés" on public.profiles;
create policy "profils lecture agents scopés" on public.profiles for select to authenticated
  using (public.admin_can(auth.uid(), 'students.read')
         and public.admin_sees_wilaya(auth.uid(), wilaya));

create or replace function public.setting_set(cle text, valeur jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_can(auth.uid(), 'settings.manage') then raise exception 'permission_refusee'; end if;
  insert into public.platform_settings (cle, valeur, maj_par) values (cle, valeur, auth.uid())
  on conflict (cle) do update set valeur = excluded.valeur, maj_par = excluded.maj_par, maj_at = now();
  perform public.audit_log('setting.change','platform_setting', cle, null, valeur, '');
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_dashboard() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare general boolean; wils text[]; out jsonb;
begin
  if not public.admin_can(auth.uid(), 'reports.read') then raise exception 'permission_refusee'; end if;
  general := (public.admin_role_of(auth.uid()) = 'admin_general');
  wils := public.admin_wilayas(auth.uid());
  select jsonb_build_object(
    'eleves', (select count(*) from public.profiles p where p.role='eleve' and (general or p.wilaya = any(wils))),
    'paiements_attente', (select count(*) from public.payments pay join public.profiles p on p.id = pay.user_id
                           where pay.statut in ('declare','en_attente') and (general or p.wilaya = any(wils))),
    'recettes_confirmees_da', (select coalesce(sum(pay.montant),0) from public.payments pay join public.profiles p on p.id = pay.user_id
                           where pay.statut in ('confirme','valide') and (general or p.wilaya = any(wils))),
    'remboursements', (select count(*) from public.payments pay join public.profiles p on p.id = pay.user_id
                           where pay.statut = 'rembourse' and (general or p.wilaya = any(wils))),
    'verifications_attente', (select count(*) from public.profiles p where p.verif_statut = 'en_attente' and (general or p.wilaya = any(wils))),
    'signalements_ouverts', (select count(*) from public.msg_reports r
                           join public.msg_messages m on m.id = r.msg_id
                           join public.profiles p on p.id = m.sender_id
                           where r.statut = 'ouvert' and (general or p.wilaya = any(wils))),
    'perimetre', case when general then 'national' else array_to_string(wils, ',') end
  ) into out;
  return out;
end $$;

create or replace function public.admin_student(cible uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare pr public.profiles%rowtype;
begin
  if not public.admin_can(auth.uid(), 'students.read') then raise exception 'permission_refusee'; end if;
  select * into pr from public.profiles where id = cible;
  if not found then raise exception 'profil_introuvable'; end if;
  if not public.admin_sees_wilaya(auth.uid(), pr.wilaya) then raise exception 'wilaya_hors_perimetre'; end if;
  return jsonb_build_object(
    'profil', jsonb_build_object('id', pr.id, 'pseudo', pr.pseudo, 'role', pr.role, 'niveau', pr.niveau,
                                 'filiere', pr.filiere, 'wilaya', pr.wilaya, 'verif', pr.verif_statut),
    'paiements', (select coalesce(jsonb_agg(jsonb_build_object('id',pay.id,'montant',pay.montant,'statut',pay.statut,'methode',pay.methode)), '[]')
                    from public.payments pay where pay.user_id = cible),
    'recus', (select coalesce(jsonb_agg(jsonb_build_object('numero',r.numero,'montant',r.montant,'emis_at',r.emis_at)), '[]')
                    from public.receipts r where r.user_id = cible),
    'accords', (select coalesce(jsonb_agg(jsonb_build_object('agreement',a.agreement_id,'representant',a.nom_representant,'at',a.accepte_at,'meta',a.meta)), '[]')
                    from public.agreement_acceptances a where a.user_id = cible)
  );
end $$;

insert into public.admin_permissions (role_cle, permission) values ('admin_general','settings.manage')
on conflict (role_cle, permission) do nothing;
insert into public.platform_settings (cle, valeur) values
 ('identite', '{"nom":"الثانوية الافتراضية — Lycée virtuel","devise":"DZD"}')
on conflict (cle) do nothing;
