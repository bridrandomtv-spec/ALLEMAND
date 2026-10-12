-- ══ ADM-2 — reçus numérotés immuables, journal d'audit, transitions de paiement ══
create sequence if not exists public.receipts_seq;
create table if not exists public.receipts (
  id bigint generated always as identity primary key,
  numero text not null default '',
  payment_id bigint not null references public.payments(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  montant int not null,
  devise text not null default 'DZD',
  methode text not null default '',
  ref_plateforme text not null default '',
  emis_par uuid not null default auth.uid(),
  emis_at timestamptz not null default now(),
  meta jsonb not null default '{}'
);
alter table public.receipts enable row level security;
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  acteur uuid,
  action text not null,
  cible_type text not null default '',
  cible_id text not null default '',
  avant jsonb,
  apres jsonb,
  wilaya text not null default ''
);
alter table public.audit_logs enable row level security;
alter table public.payments add column if not exists motif_rejet text not null default '';

create or replace function public.receipts_tr_numero_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.numero is null or new.numero = '' then
    new.numero := 'REC-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.receipts_seq')::text, 6, '0');
  end if;
  return new;
end $$;
drop trigger if exists receipts_tr_numero on public.receipts;
create trigger receipts_tr_numero before insert on public.receipts for each row execute function public.receipts_tr_numero_fn();

create or replace function public.immutable_row() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return old; end if;
  raise exception 'ligne_immuable_%', tg_relname;
end $$;
drop trigger if exists receipts_tr_immuable on public.receipts;
create trigger receipts_tr_immuable before update or delete on public.receipts for each row execute function public.immutable_row();
drop trigger if exists audit_logs_tr_immuable on public.audit_logs;
create trigger audit_logs_tr_immuable before update or delete on public.audit_logs for each row execute function public.immutable_row();

create or replace function public.audit_log(action text, cible_type text, cible_id text, avant jsonb, apres jsonb, wilaya text default '') returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_logs (acteur, action, cible_type, cible_id, avant, apres, wilaya)
  values (auth.uid(), action, cible_type, cible_id, avant, apres, wilaya);
end $$;

create or replace function public.payments_tr_statut_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.statut is not distinct from old.statut then return new; end if;
  if auth.uid() is null then return new; end if;
  if (old.statut, new.statut) not in (('declare','confirme'),('en_attente','confirme'),('en_attente','valide'),
                                      ('declare','rejete'),('en_attente','rejete'),
                                      ('confirme','rembourse'),('valide','rembourse')) then
    raise exception 'transition_paiement_interdite';
  end if;
  return new;
end $$;
drop trigger if exists payments_tr_statut on public.payments;
create trigger payments_tr_statut before update on public.payments for each row execute function public.payments_tr_statut_fn();

create or replace function public.payments_tr_audit_fn() returns trigger
language plpgsql security definer set search_path = public as $$
declare w text := '';
begin
  select coalesce(p.wilaya,'') into w from public.profiles p where p.id = new.user_id;
  if new.statut is distinct from old.statut then
    perform public.audit_log('payment.statut','payment', new.id::text,
      jsonb_build_object('statut', old.statut),
      jsonb_build_object('statut', new.statut, 'motif', new.motif_rejet), w);
  end if;
  return new;
end $$;
drop trigger if exists payments_tr_audit on public.payments;
create trigger payments_tr_audit after update on public.payments for each row execute function public.payments_tr_audit_fn();

create or replace function public.assignments_tr_audit_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    perform public.audit_log('agent.assign','wilaya_assignment', new.user_id::text, null,
      jsonb_build_object('role', new.role_cle, 'wilaya', new.code_wilaya), new.code_wilaya);
    return new;
  elsif tg_op = 'DELETE' then
    perform public.audit_log('agent.revoke','wilaya_assignment', old.user_id::text,
      jsonb_build_object('role', old.role_cle, 'wilaya', old.code_wilaya), null, old.code_wilaya);
    return old;
  end if;
  return null;
end $$;
drop trigger if exists assignments_tr_audit on public.wilaya_assignments;
create trigger assignments_tr_audit after insert or delete on public.wilaya_assignments for each row execute function public.assignments_tr_audit_fn();

create or replace function public.profiles_tr_audit_role_fn() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    perform public.audit_log('role.change','profile', new.id::text,
      jsonb_build_object('role', old.role), jsonb_build_object('role', new.role), coalesce(new.wilaya,''));
  end if;
  return new;
end $$;
drop trigger if exists profiles_tr_audit_role on public.profiles;
create trigger profiles_tr_audit_role after update on public.profiles for each row execute function public.profiles_tr_audit_role_fn();

create or replace function public.payment_set_statut(pid bigint, statut text, motif text default '') returns jsonb
language plpgsql security definer set search_path = public as $$
declare r public.payments%rowtype; w text := '';
begin
  if not public.admin_can(auth.uid(), 'payments.validate') then raise exception 'permission_refusee'; end if;
  select coalesce(p.wilaya,'') into w from public.payments pay join public.profiles p on p.id = pay.user_id where pay.id = pid;
  if not public.admin_sees_wilaya(auth.uid(), w) then raise exception 'wilaya_hors_perimetre'; end if;
  update public.payments set statut = statut, motif_rejet = motif where id = pid returning * into r;
  return jsonb_build_object('ok', true, 'id', r.id, 'statut', r.statut);
end $$;

create or replace function public.issue_receipt(pid bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare pay public.payments%rowtype; rec public.receipts%rowtype; w text := '';
begin
  if not public.admin_can(auth.uid(), 'receipts.issue') then raise exception 'permission_refusee'; end if;
  select * into pay from public.payments where id = pid;
  if not found then raise exception 'paiement_introuvable'; end if;
  if pay.statut not in ('confirme','valide') then raise exception 'recu_apres_confirmation_seulement'; end if;
  select coalesce(p.wilaya,'') into w from public.profiles p where p.id = pay.user_id;
  if not public.admin_sees_wilaya(auth.uid(), w) then raise exception 'wilaya_hors_perimetre'; end if;
  if exists (select 1 from public.receipts r where r.payment_id = pid) then raise exception 'recu_deja_emis'; end if;
  insert into public.receipts (payment_id, user_id, montant, devise, methode, ref_plateforme, emis_par)
  values (pay.id, pay.user_id, pay.montant, pay.devise, pay.methode, pay.ref_plateforme, auth.uid())
  returning * into rec;
  perform public.audit_log('receipt.issue','receipt', rec.id::text, null,
    jsonb_build_object('numero', rec.numero, 'payment', pid), w);
  return jsonb_build_object('ok', true, 'numero', rec.numero, 'id', rec.id);
end $$;

drop policy if exists "receipts lecture propre+agents" on public.receipts;
create policy "receipts lecture propre+agents" on public.receipts for select to authenticated
  using (user_id = auth.uid()
         or (public.admin_can(auth.uid(), 'receipts.issue')
             and exists (select 1 from public.profiles st where st.id = receipts.user_id
                           and public.admin_sees_wilaya(auth.uid(), st.wilaya))));
drop policy if exists "audit lecture acteurs+rapports" on public.audit_logs;
create policy "audit lecture acteurs+rapports" on public.audit_logs for select to authenticated
  using (acteur = auth.uid() or public.admin_can(auth.uid(), 'reports.read'));
