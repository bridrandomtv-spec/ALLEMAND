
-- 1) Enforce attachment-to-message membership and immutable initial moderation state.
alter table public.msg_attachments
  alter column message_id set not null;

drop policy if exists "msg att upload" on public.msg_attachments;
create policy "msg att upload"
on public.msg_attachments
for insert
to authenticated
with check (
  auth.uid() = uploader
  and message_id is not null
  and mime in ('image/png','image/jpeg','image/webp','application/pdf')
  and octets between 1 and 5242880
  and statut = 'pending'
  and exists (
    select 1
    from public.msg_messages m
    where m.id = message_id
      and public.msg_is_member(auth.uid(), m.conversation_id)
      and storage_path like (
        'msg/' || m.conversation_id::text || '/' || auth.uid()::text || '-%'
      )
  )
);

-- 2) Restrict sponsor submissions to application fields; moderation remains admin-only.
drop policy if exists "public insert sponsor" on public.sponsors;
create policy "public insert sponsor"
on public.sponsors
for insert
to anon, authenticated
with check (statut = 'en_attente');

revoke all privileges on table public.sponsors from anon, authenticated;
grant insert (nom, type, contact, slot, budget, message)
  on table public.sponsors to anon, authenticated;
grant select, update
  on table public.sponsors to authenticated;

-- 3) Provide an atomic, authenticated RPC for creating a valid direct conversation.
create or replace function public.msg_open_direct(p_other uuid)
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_conv bigint;
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;

  if p_other is null or p_other = v_uid then
    raise exception 'msg_invalid_recipient';
  end if;

  if not public.msg_can_dm(v_uid, p_other) then
    raise exception 'msg_dm_interdit';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      least(v_uid::text, p_other::text) || ':' || greatest(v_uid::text, p_other::text),
      0
    )
  );

  select c.id
    into v_conv
  from public.msg_conversations c
  join public.msg_members m on m.conversation_id = c.id
  where c.type = 'direct'
  group by c.id
  having count(*) = 2
     and count(*) filter (where m.user_id = v_uid) = 1
     and count(*) filter (where m.user_id = p_other) = 1
  order by c.id desc
  limit 1;

  if v_conv is not null then
    return v_conv;
  end if;

  insert into public.msg_conversations (type, created_by, titre)
  values ('direct', v_uid, '')
  returning id into v_conv;

  insert into public.msg_members (conversation_id, user_id)
  values (v_conv, v_uid), (v_conv, p_other);

  return v_conv;
end;
$function$;

revoke all on function public.msg_open_direct(uuid) from public, anon;
grant execute on function public.msg_open_direct(uuid) to authenticated;
