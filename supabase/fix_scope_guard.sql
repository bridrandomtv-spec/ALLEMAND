-- ══ F1 — garde de périmètre profiles (wilaya · niveau · filiere) ══
-- Défense en profondeur SOUS les politiques RLS existantes :
-- aucune policy n'est supprimée ni remplacée ; aucun trigger existant n'est touché.
-- Console SQL / service_role (auth.uid() NULL) conserve la main pour l'exploitation.
create or replace function public.profiles_scope_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare ismod boolean;
begin
  if auth.uid() is null then return new; end if;
  if new.wilaya is not distinct from old.wilaya
     and new.niveau is not distinct from old.niveau
     and new.filiere is not distinct from old.filiere then
    return new;
  end if;
  if auth.uid() = old.id then
    raise exception 'perimetre_propre_reserve_console';
  end if;
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role in ('admin','prof')) into ismod;
  if ismod then return new; end if;
  raise exception 'perimetre_reserve_moderation';
end $$;
drop trigger if exists profiles_tr_scope on public.profiles;
create trigger profiles_tr_scope before update on public.profiles
  for each row execute function public.profiles_scope_guard();
