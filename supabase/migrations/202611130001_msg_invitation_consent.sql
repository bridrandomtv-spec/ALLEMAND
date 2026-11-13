-- Lot 437 — consentement serveur pour les nouveaux DM.
-- IMPORTANT : migration préparée sur la branche, NON exécutée sur Supabase.
-- Prérequis vérifiés dans le catalogue actif : msg_conversations, msg_members,
-- msg_blocks, profiles et msg_open_direct(uuid) existent.
-- Ne crée/modifie aucun compte et ne touche pas aux conversations historiques.
--
-- Déploiement : revue humaine + environnement PostgreSQL isolé + tests négatifs
-- avant toute application à la base active. Ne pas rejouer msg_schema.sql historique.

begin;

create table if not exists public.msg_invites (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','accepted','declined','cancelled','expired')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  conversation_id bigint references public.msg_conversations(id) on delete set null,
  constraint msg_invites_no_self check (sender_id <> recipient_id)
);

create unique index if not exists msg_invites_one_pending_pair
  on public.msg_invites(sender_id, recipient_id) where status = 'pending';
create index if not exists msg_invites_inbox_idx
  on public.msg_invites(recipient_id, created_at desc) where status = 'pending';
create index if not exists msg_invites_outbox_idx
  on public.msg_invites(sender_id, created_at desc);

alter table public.msg_invites enable row level security;
revoke all on public.msg_invites from anon, authenticated;
grant select on public.msg_invites to authenticated;

drop policy if exists msg_invites_participant_read on public.msg_invites;
create policy msg_invites_participant_read on public.msg_invites
  for select to authenticated
  using (auth.uid() in (sender_id, recipient_id));

-- Aucun accès direct en écriture : tous les changements passent par RPC.
revoke insert, update, delete on public.msg_invites from anon, authenticated;

create or replace function public.msg_pair_blocked(a uuid, b uuid)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.msg_blocks x
    where (x.blocker_id = a and x.blocked_id = b)
       or (x.blocker_id = b and x.blocked_id = a)
  );
$$;
-- Fonction interne uniquement : ne pas exposer un oracle de blocage entre deux UUID.
revoke all on function public.msg_pair_blocked(uuid, uuid) from public, anon, authenticated;

-- Bloquer également la lecture d'un DM dès qu'une des deux parties bloque l'autre.
-- Les règles de groupes restent inchangées.
create or replace function public.msg_is_member(uid uuid, cid bigint)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
     and uid = auth.uid()
     and exists (
    select 1
      from public.msg_conversations c
     where c.id = cid
       and (
         (c.type = 'direct'
          and exists (select 1 from public.msg_members mine
                       where mine.conversation_id=c.id and mine.user_id=uid)
          and not exists (
            select 1 from public.msg_members peer
             where peer.conversation_id=c.id and peer.user_id<>uid
               and public.msg_pair_blocked(uid,peer.user_id)
          ))
         or
         (c.type = 'groupe'
          and (
            exists (select 1 from public.msg_members m
                     where m.conversation_id=c.id and m.user_id=uid)
            or exists (
              select 1 from public.profiles p
               where p.id=uid and p.wilaya is not null and p.niveau is not null
                 and p.wilaya=c.wilaya and p.niveau=c.niveau
                 and (c.filiere is null or p.filiere=c.filiere)
            )
          ))
       )
  );
$$;

-- Le test existant reste requis (identité vérifiée + compatibilité scolaire).
-- On lui ajoute le blocage bilatéral au niveau des contrôles de parcours DM.
create or replace function public.msg_not_blocked(cid bigint, snd uuid)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
     and snd = auth.uid()
     and not exists (
    select 1
    from public.msg_members m
    where m.conversation_id = cid
      and m.user_id <> snd
      and public.msg_pair_blocked(snd, m.user_id)
  );
$$;

-- La policy historique msg members ajoutait un membre à soi-même dès que
-- msg_member_ok retournait true; l'ancienne fonction autorisait tout DM.
-- Désormais, seuls les groupes scolaires peuvent être rejoints par INSERT
-- direct du client. La RPC SECURITY DEFINER d'acceptation ajoute les membres
-- d'un DM après vérification du consentement et passe par le trigger ci-dessous.
create or replace function public.msg_member_ok(cid bigint, uid uuid)
returns boolean
language sql stable security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
     and uid = auth.uid()
     and exists (
    select 1 from public.msg_conversations c
    join public.profiles p on p.id=uid
    where c.id=cid and c.type='groupe'
      and p.wilaya is not null and p.niveau is not null
      and p.wilaya=c.wilaya and p.niveau=c.niveau
      and (c.filiere is null or p.filiere=c.filiere)
  );
$$;

-- Le rôle authenticated ne peut plus créer lui-même une conversation directe.
drop policy if exists "msg conv creation" on public.msg_conversations;
create policy "msg conv creation" on public.msg_conversations
  for insert to authenticated
  with check (
    auth.uid() = created_by
    and type = 'groupe'
    and public.msg_is_moderator(auth.uid())
  );

-- L'ancienne RPC SECURITY DEFINER ouvrait un DM sans invitation acceptée.
revoke execute on function public.msg_open_direct(uuid) from public, anon, authenticated;

create or replace function public.msg_invite_send(p_recipient uuid)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_sender uuid := auth.uid();
  v_id uuid;
  v_count integer;
begin
  if v_sender is null then raise exception 'auth_required'; end if;
  if p_recipient is null or p_recipient = v_sender then raise exception 'invalid_recipient'; end if;

  -- Sérialise les envois d'un même compte : le plafond 24 h résiste aux appels concurrents.
  perform pg_advisory_xact_lock(hashtextextended(v_sender::text, 0));

  if public.msg_pair_blocked(v_sender, p_recipient) then raise exception 'user_blocked'; end if;
  if not public.msg_can_dm(v_sender, p_recipient) then raise exception 'school_verification_required'; end if;

  select count(*) into v_count
  from public.msg_invites
  where sender_id = v_sender and created_at > now() - interval '24 hours';
  if v_count >= 20 then raise exception 'invite_rate_limit'; end if;

  -- Réutilise une demande pendante identique (idempotence).
  select id into v_id from public.msg_invites
   where sender_id = v_sender and recipient_id = p_recipient and status = 'pending'
   limit 1;
  if v_id is not null then return v_id; end if;

  insert into public.msg_invites(sender_id, recipient_id)
  values (v_sender, p_recipient)
  returning id into v_id;
  return v_id;
exception
  when unique_violation then
    select id into v_id from public.msg_invites
     where sender_id = v_sender and recipient_id = p_recipient and status = 'pending'
     limit 1;
    return v_id;
end;
$$;

create or replace function public.msg_invite_decline(p_invite uuid)
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  update public.msg_invites
     set status = 'declined', responded_at = now()
   where id = p_invite and recipient_id = auth.uid() and status = 'pending'
     and created_at > now() - interval '7 days';
  return found;
end;
$$;

create or replace function public.msg_invite_cancel(p_invite uuid)
returns boolean
language plpgsql security definer
set search_path = pg_catalog, public
as $$
begin
  update public.msg_invites
     set status = 'cancelled', responded_at = now()
   where id = p_invite and sender_id = auth.uid() and status = 'pending';
  return found;
end;
$$;

create or replace function public.msg_invite_accept(p_invite uuid)
returns bigint
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_inv public.msg_invites%rowtype;
  v_conv bigint;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  -- Première lecture sans verrou de ligne : prendre le verrou de paire avant
  -- le verrou d'invitation évite un deadlock sur deux invitations réciproques.
  select * into v_inv
    from public.msg_invites
   where id = p_invite and recipient_id = auth.uid();
  if not found then raise exception 'invite_not_found'; end if;

  -- Une seule création de DM par paire, même si deux invitations opposées sont acceptées simultanément.
  perform pg_advisory_xact_lock(
    hashtextextended(
      least(v_inv.sender_id::text, v_inv.recipient_id::text) || ':' ||
      greatest(v_inv.sender_id::text, v_inv.recipient_id::text),
      0
    )
  );

  -- Relecture verrouillée après le verrou de paire : statut potentiellement modifié.
  select * into v_inv
    from public.msg_invites
   where id = p_invite and recipient_id = auth.uid()
   for update;
  if not found then raise exception 'invite_not_found'; end if;

  if v_inv.status = 'accepted' and v_inv.conversation_id is not null then
    return v_inv.conversation_id;
  end if;
  if v_inv.status <> 'pending' then raise exception 'invite_not_pending'; end if;
  if v_inv.created_at < now() - interval '7 days' then
    update public.msg_invites set status='expired', responded_at=now() where id=p_invite;
    -- Ne pas lever d'exception ici : elle annulerait aussi le passage à expired.
    return null;
  end if;
  if public.msg_pair_blocked(v_inv.sender_id, v_inv.recipient_id) then
    raise exception 'user_blocked';
  end if;
  if not public.msg_can_dm(v_inv.sender_id, v_inv.recipient_id) then
    raise exception 'school_verification_required';
  end if;

  -- Vérifie d'abord l'existence d'un DM historique entre les deux parties.
  select c.id into v_conv
    from public.msg_conversations c
   where c.type='direct'
     and exists (select 1 from public.msg_members m where m.conversation_id=c.id and m.user_id=v_inv.sender_id)
     and exists (select 1 from public.msg_members m where m.conversation_id=c.id and m.user_id=v_inv.recipient_id)
   order by c.last_activity desc
   limit 1;

  if v_conv is null then
    insert into public.msg_conversations(type, created_by, titre)
    values ('direct', v_inv.sender_id, '')
    returning id into v_conv;

    -- État accepté établi avant l'ajout des deux membres : le trigger ci-dessous
    -- et le garde historique peuvent vérifier le consentement serveur.
    update public.msg_invites
       set status='accepted', responded_at=now(), conversation_id=v_conv
     where id=p_invite;

    insert into public.msg_members(conversation_id,user_id) values (v_conv,v_inv.sender_id);
    insert into public.msg_members(conversation_id,user_id) values (v_conv,v_inv.recipient_id);
  else
    update public.msg_invites
       set status='accepted', responded_at=now(), conversation_id=v_conv
     where id=p_invite;
  end if;

  -- Une invitation réciproque devenue redondante ne doit pas rester pendante.
  update public.msg_invites
     set status='cancelled', responded_at=now()
   where sender_id=v_inv.recipient_id
     and recipient_id=v_inv.sender_id
     and status='pending';

  return v_conv;
end;
$;

-- Les nouvelles conversations directes ne peuvent recevoir de membres que
-- pendant la RPC d'acceptation. Les DM historiques restent consultables.
create or replace function public.msg_guard_direct_consent()
returns trigger
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_type text;
  v_other uuid;
  v_ok boolean;
begin
  select type into v_type from public.msg_conversations where id=new.conversation_id;
  if v_type <> 'direct' then return new; end if;

  select user_id into v_other from public.msg_members
   where conversation_id=new.conversation_id and user_id<>new.user_id
   limit 1;

  if v_other is null then
    -- Premier membre uniquement si une invitation acceptée référence ce DM.
    select exists (
      select 1 from public.msg_invites i
      where i.conversation_id=new.conversation_id and i.status='accepted'
        and new.user_id in (i.sender_id,i.recipient_id)
    ) into v_ok;
  else
    select exists (
      select 1 from public.msg_invites i
      where i.conversation_id=new.conversation_id and i.status='accepted'
        and ((i.sender_id=new.user_id and i.recipient_id=v_other)
          or (i.recipient_id=new.user_id and i.sender_id=v_other))
    ) into v_ok;
  end if;
  if not coalesce(v_ok,false) then raise exception 'msg_invitation_requise'; end if;
  if v_other is not null and public.msg_pair_blocked(new.user_id,v_other) then
    raise exception 'user_blocked';
  end if;
  return new;
end;
$$;

drop trigger if exists msg_tr_direct_consent on public.msg_members;
create trigger msg_tr_direct_consent
  before insert on public.msg_members
  for each row execute function public.msg_guard_direct_consent();

revoke all on function public.msg_invite_send(uuid) from public, anon;
revoke all on function public.msg_invite_decline(uuid) from public, anon;
revoke all on function public.msg_invite_cancel(uuid) from public, anon;
revoke all on function public.msg_invite_accept(uuid) from public, anon;
grant execute on function public.msg_invite_send(uuid) to authenticated;
grant execute on function public.msg_invite_decline(uuid) to authenticated;
grant execute on function public.msg_invite_cancel(uuid) to authenticated;
grant execute on function public.msg_invite_accept(uuid) to authenticated;

commit;

-- Tests obligatoires avant application à la production :
-- 1. non-membre ne peut ni INSERT direct dans msg_conversations/msg_members,
--    ni appeler msg_open_direct(uuid).
-- 2. A envoie une invitation : B seul peut accepter/refuser; A seul annule.
-- 3. A ne peut pas accepter l'invitation reçue par B; invitation expirée/refusée
--    ne crée aucun membre ni conversation.
-- 4. un blocage dans un sens interdit l'invitation, l'acceptation et l'envoi
--    dans les deux sens.
-- 5. les conversations de groupe, pièces jointes, Realtime et DM historiques
--    restent fonctionnels.
-- 6. vérifier les policies actives et les privilèges table avant de déployer.
