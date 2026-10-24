-- ══ ADM-5 — comptabilité immuable, rapports scopés, support, notifications ══
create table if not exists public.accounting_entries (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  sens text not null check (sens in ('recette','remboursement','depense')),
  categorie text not null default '',
  montant int not null,
  devise text not null default 'DZD',
  ref_type text not null default '',
  ref_id text not null default '',
  acteur uuid,
  wilaya text not null default '',
  meta jsonb not null default '{}'
);
alter table public.accounting_entries enable row level security;
create table if not exists public.support_tickets (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sujet text not null,
  corps text not null default '',
  statut text not null default 'ouvert' check (statut in ('ouvert','en_cours','resolu')),
  assigne_to uuid,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
alter table public.support_tickets enable row level security;
create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  cle text not null,
  payload jsonb not null default '{}',
  lue boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;

create or replace function public.accounting_entry_immutable_fn() returns trigger
language plpgsql security definer set search_path = public as $
begin
  -- Le service backend conserve le comportement historique de contournement contrôlé.
  if auth.uid() is null then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;
  -- Seul le drapeau de rapprochement peut changer; les montants et références restent immuables.
  if tg_op = 'UPDATE'
     and (to_jsonb(new) - 'rapproche') = (to_jsonb(old) - 'rapproche') then
    return new;
  end if;
  raise exception 'ligne_immuable_%', tg_relname;
end $;
drop trigger if exists accounting_entries_tr_immuable on public.accounting_entries;
create trigger accounting_entries_tr_immuable before update or delete on public.accounting_entries
  for each row execute function public.accounting_entry_immutable_fn();

create or replace function public.accounting_tr_payment_fn() returns trigger
language plpgsql security definer set search_path = public as $$
declare w text := '';
begin
  select coalesce(p.wilaya,'') into w from public.profiles p where p.id = new.user_id;
  if new.statut is distinct from old.statut then
    if new.statut in ('confirme','valide') and old.statut not in ('confirme','valide') then
      insert into public.accounting_entries (sens, categorie, montant, devise, ref_type, ref_id, acteur, wilaya, methode)
      values ('recette', 'abonnement', new.montant, new.devise, 'payment', new.id::text, auth.uid(), w, new.methode);
    elsif new.statut = 'rembourse' and old.statut <> 'rembourse' then
      insert into public.accounting_entries (sens, categorie, montant, devise, ref_type, ref_id, acteur, wilaya, methode)
      values ('remboursement', 'abonnement', -new.montant, new.devise, 'payment', new.id::text, auth.uid(), w, new.methode);
    end if;
  end if;
  return new;
end $$;
drop trigger if exists accounting_tr_payment on public.payments;
create trigger accounting_tr_payment after update on public.payments
  for each row execute function public.accounting_tr_payment_fn();

create or replace function public.accounting_depense(montant int, categorie text, meta jsonb default '{}') returns jsonb
language plpgsql security definer set search_path = public as $$
declare nid bigint;
begin
  if not public.admin_can(auth.uid(), 'accounting.manage') then raise exception 'permission_refusee'; end if;
  if montant <= 0 then raise exception 'montant_depense_positif_attendu'; end if;
  insert into public.accounting_entries (sens, categorie, montant, ref_type, acteur, meta)
  values ('depense', categorie, montant, 'manuel', auth.uid(), meta) returning id into nid;
  perform public.audit_log('accounting.depense','accounting_entry', nid::text, null,
    jsonb_build_object('montant', montant, 'categorie', categorie), '');
  return jsonb_build_object('ok', true, 'id', nid);
end $$;

create or replace function public.notify(cible uuid, cle text, payload jsonb default '{}') returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, cle, payload) values (cible, cle, payload);
end $$;

create or replace function public.notify_tr_payment_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.statut in ('confirme','valide') and old.statut not in ('confirme','valide') then
    perform public.notify(new.user_id, 'paiement_confirme',
      jsonb_build_object('payment', new.id, 'montant', new.montant));
  end if;
  return new;
end $$;
drop trigger if exists notify_tr_payment on public.payments;
create trigger notify_tr_payment after update on public.payments
  for each row execute function public.notify_tr_payment_fn();

create or replace function public.notify_tr_receipt_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.notify(new.user_id, 'recu_emis',
    jsonb_build_object('numero', new.numero, 'payment', new.payment_id));
  return new;
end $$;
drop trigger if exists notify_tr_receipt on public.receipts;
create trigger notify_tr_receipt after insert on public.receipts
  for each row execute function public.notify_tr_receipt_fn();

create or replace function public.ticket_set_statut(tid bigint, statut text, assigne uuid default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare t public.support_tickets%rowtype; w text := '';
begin
  if not public.admin_can(auth.uid(), 'tickets.handle') then raise exception 'permission_refusee'; end if;
  select * into t from public.support_tickets where id = tid;
  if not found then raise exception 'ticket_introuvable'; end if;
  select coalesce(p.wilaya,'') into w from public.profiles p where p.id = t.user_id;
  if not public.admin_sees_wilaya(auth.uid(), w) then raise exception 'wilaya_hors_perimetre'; end if;
  update public.support_tickets set statut = $2,
         assigne_to = coalesce($3, assigne_to),
         closed_at = case when $2 = 'resolu' then now() else closed_at end
   where id = $1;
  perform public.notify(t.user_id, 'ticket_statut', jsonb_build_object('ticket', $1, 'statut', $2));
  perform public.audit_log('ticket.statut','support_ticket', $1::text,
    jsonb_build_object('statut', t.statut), jsonb_build_object('statut', $2), w);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.admin_report(debut date default null, fin date default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare general boolean; wils text[]; out jsonb;
begin
  if not public.admin_can(auth.uid(), 'reports.read') then raise exception 'permission_refusee'; end if;
  general := (public.admin_role_of(auth.uid()) = 'admin_general');
  wils := public.admin_wilayas(auth.uid());
  select jsonb_build_object(
    'perimetre', case when general then 'national' else array_to_string(wils, ',') end,
    'recettes_da', (select coalesce(sum(e.montant),0) from public.accounting_entries e
                     where e.sens = 'recette' and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)),
    'remboursements_da', (select coalesce(sum(-e.montant),0) from public.accounting_entries e
                     where e.sens = 'remboursement' and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)),
    'depenses_da', (select coalesce(sum(e.montant),0) from public.accounting_entries e
                     where e.sens = 'depense'
                       and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)),
    'par_wilaya', (select coalesce(jsonb_object_agg(wl, mt), '{}') from (
                     select e.wilaya as wl, sum(e.montant) as mt from public.accounting_entries e
                     where e.sens = 'recette' and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)
                     group by e.wilaya) s),
    'par_mois', (select coalesce(jsonb_object_agg(mo, mt), '{}') from (
                     select to_char(e.at,'YYYY-MM') as mo, sum(e.montant) as mt from public.accounting_entries e
                     where e.sens = 'recette' and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)
                     group by mo order by mo) s),
    'par_methode', (select coalesce(jsonb_object_agg(me, mt), '{}') from (
                     select e.methode as me, sum(e.montant) as mt from public.accounting_entries e
                     where e.sens = 'recette' and (general or e.wilaya = any(wils))
                       and (debut is null or e.at::date >= debut) and (fin is null or e.at::date <= fin)
                     group by e.methode) s),
    'paiements_sans_ecriture', (select count(*) from public.payments pay
                     join public.profiles p on p.id = pay.user_id
                     where pay.statut in ('confirme','valide') and (general or p.wilaya = any(wils))
                       and not exists (select 1 from public.accounting_entries e
                                        where e.ref_type = 'payment' and e.ref_id = pay.id::text)),
    'ecritures_orphelines', (select count(*) from public.accounting_entries e
                     where e.ref_type = 'payment' and e.ref_id <> ''
                       and not exists (select 1 from public.payments pay where pay.id::text = e.ref_id)),
    'ecritures_rapproches', (select count(*) from public.accounting_entries e
                     where e.rapproche and (general or e.wilaya = any(wils))),
    'tickets_ouverts', (select count(*) from public.support_tickets t
                     join public.profiles p on p.id = t.user_id
                     where t.statut in ('ouvert','en_cours') and (general or p.wilaya = any(wils)))
  ) into out;
  return out;
end $$;

drop policy if exists "ecritures lecture rapports scopés" on public.accounting_entries;
create policy "ecritures lecture rapports scopés" on public.accounting_entries for select to authenticated
  using (public.admin_can(auth.uid(), 'reports.read')
         and public.admin_sees_wilaya(auth.uid(), wilaya));
drop policy if exists "tickets propres" on public.support_tickets;
create policy "tickets propres" on public.support_tickets for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "tickets creation propre" on public.support_tickets;
create policy "tickets creation propre" on public.support_tickets for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "tickets agents scopés" on public.support_tickets;
create policy "tickets agents scopés" on public.support_tickets for update to authenticated
  using (public.admin_can(auth.uid(), 'tickets.handle')
         and exists (select 1 from public.profiles st where st.id = support_tickets.user_id
                       and public.admin_sees_wilaya(auth.uid(), st.wilaya)))
  with check (public.admin_can(auth.uid(), 'tickets.handle')
         and exists (select 1 from public.profiles st where st.id = support_tickets.user_id
                       and public.admin_sees_wilaya(auth.uid(), st.wilaya)));
drop policy if exists "notifications propres" on public.notifications;
create policy "notifications propres" on public.notifications for select to authenticated
  using (user_id = auth.uid());
drop policy if exists "notifications marquage propre" on public.notifications;
create policy "notifications marquage propre" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into public.admin_permissions (role_cle, permission) values ('admin_general','accounting.manage')
on conflict (role_cle, permission) do nothing;

-- ══ F6 — rapprochement, clôtures mensuelles, méthode, notifications agents, D-5/D-6 ══
alter table public.accounting_entries add column if not exists methode text not null default '';
alter table public.accounting_entries add column if not exists rapproche boolean not null default false;
create table if not exists public.accounting_closures (
  periode text primary key,
  closed_by uuid,
  closed_at timestamptz not null default now(),
  snapshot jsonb not null default '{}'
);
alter table public.accounting_closures enable row level security;
drop policy if exists "closures lecture rapports" on public.accounting_closures;
create policy "closures lecture rapports" on public.accounting_closures for select to authenticated
  using (public.admin_can(auth.uid(), 'reports.read'));
drop trigger if exists accounting_closures_tr_immuable on public.accounting_closures;
create trigger accounting_closures_tr_immuable before update or delete on public.accounting_closures
  for each row execute function public.immutable_row();
create or replace function public.accounting_tr_periode_close_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.accounting_closures c where c.periode = to_char(new.at,'YYYY-MM')) then
    raise exception 'periode_closee';
  end if;
  return new;
end $$;
drop trigger if exists accounting_tr_periode_close on public.accounting_entries;
create trigger accounting_tr_periode_close before insert on public.accounting_entries
  for each row execute function public.accounting_tr_periode_close_fn();
create or replace function public.accounting_close_month(periode text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare snap jsonb;
begin
  if not public.admin_can(auth.uid(), 'accounting.manage') then raise exception 'permission_refusee'; end if;
  if exists (select 1 from public.accounting_closures c where c.periode = $1) then
    raise exception 'periode_deja_close';
  end if;
  snap := public.admin_report(($1 || '-01')::date,
          (date_trunc('month', ($1 || '-01')::date) + interval '1 month - 1 day')::date);
  insert into public.accounting_closures (periode, closed_by, snapshot) values ($1, auth.uid(), snap);
  perform public.audit_log('accounting.closure','accounting_closure', $1, null, snap, '');
  return jsonb_build_object('ok', true, 'periode', periode);
end $$;
create or replace function public.accounting_mark_rapproche(eid bigint, rapproche boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not public.admin_can(auth.uid(), 'accounting.manage') then raise exception 'permission_refusee'; end if;
  update public.accounting_entries set rapproche = $2 where id = $1;
  perform public.audit_log('accounting.rapprochement','accounting_entry', $1::text, null,
    jsonb_build_object('rapproche', $2), '');
  return jsonb_build_object('ok', true);
end $$;
create or replace function public.notifications_tr_lue_only_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;
  if new.user_id is distinct from old.user_id
     or new.cle is distinct from old.cle
     or new.payload is distinct from old.payload
     or (old.lue and not new.lue) then
    raise exception 'notification_modification_interdite';
  end if;
  return new;
end $$;
drop trigger if exists notifications_tr_lue_only on public.notifications;
create trigger notifications_tr_lue_only before update on public.notifications
  for each row execute function public.notifications_tr_lue_only_fn();
