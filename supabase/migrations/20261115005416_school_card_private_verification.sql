-- Lot 556: private school-card evidence required for student verification.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cartes-scolaires','cartes-scolaires',false,5242880,
  array['image/jpeg','image/png','image/webp','application/pdf']::text[])
on conflict (id) do update set
  public=false,
  file_size_limit=5242880,
  allowed_mime_types=excluded.allowed_mime_types;

alter table public.profiles add column if not exists carte_scolaire_path text;

drop policy if exists "cartes scolaires upload owner" on storage.objects;
create policy "cartes scolaires upload owner" on storage.objects
for insert to authenticated
with check (
  bucket_id='cartes-scolaires'
  and (storage.foldername(name))[1]=(select auth.uid())::text
  and owner_id=(select auth.uid())::text
  and coalesce((metadata->>'size')::bigint,0) between 1 and 5242880
  and lower(coalesce(metadata->>'mimetype',''))=any(array['image/jpeg','image/png','image/webp','application/pdf'])
);

drop policy if exists "cartes scolaires read owner moderator" on storage.objects;
create policy "cartes scolaires read owner moderator" on storage.objects
for select to authenticated
using (
  bucket_id='cartes-scolaires'
  and (
    (storage.foldername(name))[1]=(select auth.uid())::text
    or exists (
      select 1 from public.profiles p
      where p.id::text=(storage.foldername(name))[1]
        and p.verif_statut='en_attente'
        and public.admin_can((select auth.uid()),'students.verify')
        and public.admin_sees_wilaya((select auth.uid()),p.wilaya)
    )
    or public.is_admin()
  )
);

drop policy if exists "cartes scolaires delete owner" on storage.objects;
create policy "cartes scolaires delete owner" on storage.objects
for delete to authenticated
using (
  bucket_id='cartes-scolaires'
  and (storage.foldername(name))[1]=(select auth.uid())::text
);

create or replace function public.profiles_verif_guard()
returns trigger
language plpgsql
security definer
set search_path=pg_catalog,public
as $function$
declare can_verify boolean; card_exists boolean:=false;
begin
  if NEW.verif_statut is not distinct from OLD.verif_statut
     and NEW.verif_by is not distinct from OLD.verif_by
     and NEW.matricule is not distinct from OLD.matricule
     and NEW.section is not distinct from OLD.section
     and NEW.carte_scolaire_path is not distinct from OLD.carte_scolaire_path then
    return NEW;
  end if;
  can_verify:=auth.uid() is not null and (
    public.is_admin()
    or (public.admin_can(auth.uid(),'students.verify') and public.admin_sees_wilaya(auth.uid(),NEW.wilaya))
  );
  if can_verify then
    if NEW.verif_statut='verifie' and OLD.verif_statut is distinct from 'verifie' then
      if nullif(btrim(NEW.pseudo),'') is null
         or nullif(btrim(NEW.matricule),'') is null
         or NEW.matricule !~ '^[0-9]{1,20}$'
         or nullif(btrim(NEW.niveau),'') is null
         or nullif(btrim(NEW.wilaya),'') is null
         or nullif(btrim(NEW.filiere),'') is null
         or nullif(btrim(NEW.section),'') is null
         or nullif(btrim(NEW.carte_scolaire_path),'') is null then
        raise exception 'verification_incomplete_profile' using errcode='23514',
          hint='Le matricule, le niveau, la wilaya, la filiere, la section et le justificatif scolaire sont obligatoires.';
      end if;
      select exists(select 1 from storage.objects o
        where o.bucket_id='cartes-scolaires' and o.name=NEW.carte_scolaire_path
          and (storage.foldername(o.name))[1]=NEW.id::text) into card_exists;
      if not card_exists then
        raise exception 'verification_document_missing' using errcode='23514',
          hint='Le justificatif scolaire privé est introuvable pour ce compte.';
      end if;
    end if;
    return NEW;
  end if;
  if auth.uid()=OLD.id and OLD.verif_statut in ('non_verifie','rejete')
     and NEW.verif_statut='en_attente' and NEW.verif_by is not distinct from OLD.verif_by then
    return NEW;
  end if;
  raise exception 'verif_reservee_moderation';
end;
$function$;
