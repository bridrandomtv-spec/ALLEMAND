-- Lot 557: moderator-controlled retention holds for documented appeals.
create table if not exists private.school_card_retention_holds (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  hold_until timestamptz not null,
  reason text not null,
  created_by uuid not null,
  updated_at timestamptz not null default now(),
  constraint school_card_retention_hold_reason_length check (char_length(btrim(reason)) between 10 and 500)
);
revoke all on private.school_card_retention_holds from public,anon,authenticated;
grant select,insert,update,delete on private.school_card_retention_holds to service_role;

create or replace function public.school_card_retention_set_hold(p_profile_id uuid,p_days integer,p_reason text)
returns boolean language plpgsql security definer
set search_path=pg_catalog,public,private
as $function$
declare target_wilaya text; target_status text; target_path text;
begin
  if auth.uid() is null or p_days not between 1 and 90
     or char_length(btrim(coalesce(p_reason,''))) not between 10 and 500 then
    raise exception 'invalid_retention_hold_request' using errcode='22023';
  end if;
  select wilaya,verif_statut,carte_scolaire_path into target_wilaya,target_status,target_path
  from public.profiles where id=p_profile_id;
  if not found or target_status not in ('verifie','rejete') or target_path is null then
    raise exception 'profile_not_eligible_for_hold' using errcode='22023';
  end if;
  if not (public.is_admin() or (public.admin_can(auth.uid(),'students.verify') and public.admin_sees_wilaya(auth.uid(),target_wilaya))) then
    raise exception 'verification_scope_required' using errcode='42501';
  end if;
  insert into private.school_card_retention_holds(profile_id,hold_until,reason,created_by,updated_at)
  values(p_profile_id,now()+make_interval(days=>p_days),btrim(p_reason),auth.uid(),now())
  on conflict(profile_id) do update set hold_until=excluded.hold_until,reason=excluded.reason,
    created_by=excluded.created_by,updated_at=now();
  return true;
end;
$function$;
revoke all on function public.school_card_retention_set_hold(uuid,integer,text) from public,anon;
grant execute on function public.school_card_retention_set_hold(uuid,integer,text) to authenticated;

create or replace function public.school_card_retention_release_hold(p_profile_id uuid)
returns boolean language plpgsql security definer
set search_path=pg_catalog,public,private
as $function$
declare target_wilaya text; affected integer;
begin
  if auth.uid() is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select wilaya into target_wilaya from public.profiles where id=p_profile_id;
  if not found then return false; end if;
  if not (public.is_admin() or (public.admin_can(auth.uid(),'students.verify') and public.admin_sees_wilaya(auth.uid(),target_wilaya))) then
    raise exception 'verification_scope_required' using errcode='42501';
  end if;
  delete from private.school_card_retention_holds where profile_id=p_profile_id;
  get diagnostics affected=row_count;
  return affected=1;
end;
$function$;
revoke all on function public.school_card_retention_release_hold(uuid) from public,anon;
grant execute on function public.school_card_retention_release_hold(uuid) to authenticated;

create or replace function public.school_card_retention_is_held(p_profile_id uuid)
returns boolean language plpgsql security definer
set search_path=pg_catalog,private
as $function$
begin
  if auth.role()<>'service_role' then raise exception 'service_role_required' using errcode='42501'; end if;
  return exists(select 1 from private.school_card_retention_holds where profile_id=p_profile_id and hold_until>now());
end;
$function$;
revoke all on function public.school_card_retention_is_held(uuid) from public,anon,authenticated;
grant execute on function public.school_card_retention_is_held(uuid) to service_role;
