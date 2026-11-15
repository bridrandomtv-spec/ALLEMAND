-- Lot 557: scheduled 30-day private school-card retention.
create schema if not exists private;
revoke all on schema private from public,anon,authenticated;
grant usage on schema private to service_role;

create or replace function public.school_card_retention_secret_valid(p_secret text)
returns boolean language plpgsql security definer
set search_path=pg_catalog,public,vault
as $function$
declare stored_secret text;
begin
  if auth.role()<>'service_role' or p_secret is null then return false; end if;
  select decrypted_secret into stored_secret from vault.decrypted_secrets
    where name='school_card_retention_token' limit 1;
  return stored_secret is not null and stored_secret=p_secret;
end;
$function$;
revoke all on function public.school_card_retention_secret_valid(text) from public,anon,authenticated;
grant execute on function public.school_card_retention_secret_valid(text) to service_role;

create or replace function public.school_card_retention_clear_path(p_profile_id uuid,p_expected_path text)
returns boolean language plpgsql security definer
set search_path=pg_catalog,public
as $function$
declare affected integer;
begin
  if auth.role()<>'service_role' then raise exception 'service_role_required' using errcode='42501'; end if;
  update public.profiles set carte_scolaire_path=null
  where id=p_profile_id and verif_statut in ('verifie','rejete')
    and verif_at<=now()-interval '30 days'
    and carte_scolaire_path=p_expected_path
    and p_expected_path like p_profile_id::text||'/%';
  get diagnostics affected=row_count;
  return affected=1;
end;
$function$;
revoke all on function public.school_card_retention_clear_path(uuid,text) from public,anon,authenticated;
grant execute on function public.school_card_retention_clear_path(uuid,text) to service_role;

create or replace function public.profiles_verif_guard()
returns trigger language plpgsql security definer
set search_path=pg_catalog,public
as $function$
declare can_verify boolean; card_exists boolean:=false;
begin
  if NEW.verif_statut is not distinct from OLD.verif_statut
     and NEW.verif_by is not distinct from OLD.verif_by
     and NEW.matricule is not distinct from OLD.matricule
     and NEW.section is not distinct from OLD.section
     and NEW.carte_scolaire_path is not distinct from OLD.carte_scolaire_path then return NEW; end if;
  if auth.role()='service_role' and OLD.verif_statut in ('verifie','rejete')
     and OLD.verif_at<=now()-interval '30 days' and OLD.carte_scolaire_path is not null
     and NEW.carte_scolaire_path is null
     and NEW.verif_statut is not distinct from OLD.verif_statut
     and NEW.verif_by is not distinct from OLD.verif_by
     and NEW.verif_at is not distinct from OLD.verif_at
     and NEW.matricule is not distinct from OLD.matricule
     and NEW.section is not distinct from OLD.section then return NEW; end if;
  can_verify:=auth.uid() is not null and (
    public.is_admin()
    or (public.admin_can(auth.uid(),'students.verify') and public.admin_sees_wilaya(auth.uid(),NEW.wilaya))
  );
  if can_verify then
    if NEW.verif_statut='verifie' and OLD.verif_statut is distinct from 'verifie' then
      if nullif(btrim(NEW.pseudo),'') is null or nullif(btrim(NEW.matricule),'') is null
         or NEW.matricule !~ '^[0-9]{1,20}$' or nullif(btrim(NEW.niveau),'') is null
         or nullif(btrim(NEW.wilaya),'') is null or nullif(btrim(NEW.filiere),'') is null
         or nullif(btrim(NEW.section),'') is null or nullif(btrim(NEW.carte_scolaire_path),'') is null then
        raise exception 'verification_incomplete_profile' using errcode='23514',
          hint='Le matricule, le niveau, la wilaya, la filiere, la section et le justificatif scolaire sont obligatoires.';
      end if;
      select exists(select 1 from storage.objects o where o.bucket_id='cartes-scolaires'
        and o.name=NEW.carte_scolaire_path and (storage.foldername(o.name))[1]=NEW.id::text)
        into card_exists;
      if not card_exists then raise exception 'verification_document_missing' using errcode='23514',
        hint='Le justificatif scolaire privé est introuvable pour ce compte.'; end if;
    end if;
    return NEW;
  end if;
  if auth.uid()=OLD.id and OLD.verif_statut in ('non_verifie','rejete')
     and NEW.verif_statut='en_attente' and NEW.verif_by is not distinct from OLD.verif_by then return NEW; end if;
  raise exception 'verif_reservee_moderation';
end;
$function$;

do $$
begin
  if not exists(select 1 from vault.decrypted_secrets where name='school_card_retention_token') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'school_card_retention_token',
      'Token for scheduled private school-card retention worker');
  end if;
end $$;

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;
select cron.unschedule(jobid) from cron.job where jobname='school-card-retention-daily';
select cron.schedule('school-card-retention-daily','17 2 * * *',$cron$
  select net.http_post(
    url:='https://azjwcybivirvpxbfhyzk.supabase.co/functions/v1/school-card-retention',
    headers:=jsonb_build_object('Content-Type','application/json','x-school-card-retention',
      (select decrypted_secret from vault.decrypted_secrets where name='school_card_retention_token')),
    body:='{}'::jsonb,timeout_milliseconds:=15000
  );
$cron$);
