-- F1 — garde de périmètre profiles (wilaya · niveau · filiere)
-- Les changements de niveau scolaire sont réservés aux administrateurs.
-- Les professeurs peuvent gérer wilaya/filiere hors de leur propre profil,
-- mais ne peuvent jamais changer le niveau. RLS reste la première barrière.
-- Console SQL / service_role (auth.uid() NULL) conserve la main pour l'exploitation.
create or replace function public.profiles_scope_guard() returns trigger
language plpgsql security definer set search_path = public as $scope_guard$
declare
  actor_role text;
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

  select p.role into actor_role
    from public.profiles p
   where p.id = auth.uid();

  if new.niveau is distinct from old.niveau
     and actor_role is distinct from 'admin' then
    raise exception 'niveau_reserve_admin';
  end if;

  if actor_role = 'admin' then return new; end if;

  if actor_role = 'prof'
     and new.niveau is not distinct from old.niveau then
    return new;
  end if;

  raise exception 'perimetre_reserve_moderation';
end;
$scope_guard$;

drop trigger if exists profiles_tr_scope on public.profiles;
create trigger profiles_tr_scope before update on public.profiles
  for each row execute function public.profiles_scope_guard();
