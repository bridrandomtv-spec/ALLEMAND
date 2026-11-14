#!/usr/bin/env bash
set -euo pipefail
: "${PGHOST:=127.0.0.1}"; : "${PGPORT:=5432}"; : "${PGUSER:=postgres}"; : "${PGDATABASE:=postgres}"; : "${PGPASSWORD:=postgres}"
export PGHOST PGPORT PGUSER PGDATABASE PGPASSWORD
tmp="$(mktemp -d)"
cleanup() {
  psql -X -v ON_ERROR_STOP=1 -q -c "drop trigger if exists lot488_pause_invite_status on public.msg_invites; drop function if exists public.lot488_pause_invite_status();" >/dev/null 2>&1 || true
  rm -rf "$tmp"
}
trap cleanup EXIT
A='20000000-0000-4000-8000-000000000005'; B='20000000-0000-4000-8000-000000000006'
C='20000000-0000-4000-8000-000000000007'; D='20000000-0000-4000-8000-000000000008'
AB1='48800000-0000-4000-8000-000000000001'; AB2='48800000-0000-4000-8000-000000000002'
CD1='48800000-0000-4000-8000-000000000003'; CD2='48800000-0000-4000-8000-000000000004'
psql -X -v ON_ERROR_STOP=1 -q <<SQL
insert into auth.users(id) values ('$A'),('$B'),('$C'),('$D');
insert into public.profiles(id,role,verif_statut,pseudo,wilaya,niveau,filiere) values
 ('$A','eleve','verifie','Lot488-A','34','2AS','Sciences'),
 ('$B','eleve','verifie','Lot488-B','34','2AS','Sciences'),
 ('$C','eleve','verifie','Lot488-C','34','2AS','Sciences'),
 ('$D','eleve','verifie','Lot488-D','34','2AS','Sciences');
insert into public.msg_invites(id,sender_id,recipient_id,status) values
 ('$AB1','$A','$B','pending'),('$AB2','$B','$A','pending'),('$CD1','$C','$D','pending');
create or replace function public.lot488_pause_invite_status()
returns trigger language plpgsql as \$fn\$
begin
 if old.status='pending' and new.status in ('accepted','cancelled') then perform pg_sleep(1.5); end if;
 return new;
end;
\$fn\$;
create trigger lot488_pause_invite_status before update of status on public.msg_invites
for each row execute function public.lot488_pause_invite_status();
SQL
wait_until_sleeping() {
 local app="$1"
 for _ in $(seq 1 80); do
  local n
  n="$(psql -X -Atq -c "select count(*) from pg_stat_activity where application_name='$app' and state='active' and wait_event='PgSleep'")"
  [[ "$n" -ge 1 ]] && return 0
  sleep 0.05
 done
 echo "Session $app non synchronisée sur pg_sleep." >&2; return 1
}
run_accept() {
 local app="$1" actor="$2" invite="$3" out="$4"
 PGAPPNAME="$app" psql -X -v ON_ERROR_STOP=1 -Atq -c "begin; set local role authenticated; select set_config('request.jwt.claim.sub','$actor',true); select public.msg_invite_accept('$invite'); commit;" >"$out" 2>&1
}
run_cancel() {
 local app="$1" actor="$2" invite="$3" out="$4"
 PGAPPNAME="$app" psql -X -v ON_ERROR_STOP=1 -Atq -c "begin; set local role authenticated; select set_config('request.jwt.claim.sub','$actor',true); select public.msg_invite_cancel('$invite'); commit;" >"$out" 2>&1
}
# 1) Acceptation simultanée de deux invitations opposées : un seul DM.
run_accept lot488-accept-ab "$B" "$AB1" "$tmp/ab1" & p1=$!
wait_until_sleeping lot488-accept-ab
run_accept lot488-accept-ba "$A" "$AB2" "$tmp/ab2" & p2=$!
set +e; wait "$p1"; s1=$?; wait "$p2"; s2=$?; set -e
if [[ "$s1" -ne 0 || "$s2" -eq 0 ]] || ! grep -q invite_not_pending "$tmp/ab2"; then cat "$tmp/ab1" "$tmp/ab2"; exit 1; fi
read -r n m states < <(psql -X -Atq -F ' ' -c "select (select count(*) from public.msg_conversations c where c.type='direct' and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$A') and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$B')), (select count(*) from public.msg_members x join public.msg_conversations c on c.id=x.conversation_id where c.type='direct' and exists(select 1 from public.msg_members z where z.conversation_id=c.id and z.user_id='$A') and exists(select 1 from public.msg_members z where z.conversation_id=c.id and z.user_id='$B')), (select string_agg(status,',' order by id) from public.msg_invites where id in ('$AB1','$AB2'))")
[[ "$n" = 1 && "$m" = 2 && "$states" = accepted,cancelled ]] || { echo "État réciproque invalide: $n/$m/$states"; exit 1; }
echo "PASS: deux acceptations réciproques -> un DM, deux membres."

# 2) Annulation gagnante : l'acceptation attend le verrou puis échoue.
run_cancel lot488-cancel-first "$C" "$CD1" "$tmp/c1" & p1=$!
wait_until_sleeping lot488-cancel-first
run_accept lot488-accept-after-cancel "$D" "$CD1" "$tmp/a1" & p2=$!
set +e; wait "$p1"; s1=$?; wait "$p2"; s2=$?; set -e
[[ "$s1" -eq 0 && "$s2" -ne 0 ]] && grep -q invite_not_pending "$tmp/a1" || { cat "$tmp/c1" "$tmp/a1"; exit 1; }
read -r state n < <(psql -X -Atq -F ' ' -c "select (select status from public.msg_invites where id='$CD1'), (select count(*) from public.msg_conversations c where c.type='direct' and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$C') and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$D'))")
[[ "$state" = cancelled && "$n" = 0 ]] || { echo "Annulation gagnante invalide: $state/$n"; exit 1; }
echo "PASS: annulation gagnante -> pas de DM."

# 3) Acceptation gagnante : l'annulation attend puis retourne false.
psql -X -v ON_ERROR_STOP=1 -q -c "insert into public.msg_invites(id,sender_id,recipient_id,status) values ('$CD2','$C','$D','pending')"
run_accept lot488-accept-first "$D" "$CD2" "$tmp/a2" & p1=$!
wait_until_sleeping lot488-accept-first
run_cancel lot488-cancel-after-accept "$C" "$CD2" "$tmp/c2" & p2=$!
set +e; wait "$p1"; s1=$?; wait "$p2"; s2=$?; set -e
[[ "$s1" -eq 0 && "$s2" -eq 0 ]] && grep -qx f "$tmp/c2" || { cat "$tmp/a2" "$tmp/c2"; exit 1; }
read -r state n m < <(psql -X -Atq -F ' ' -c "select (select status from public.msg_invites where id='$CD2'), (select count(*) from public.msg_conversations c where c.type='direct' and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$C') and exists(select 1 from public.msg_members x where x.conversation_id=c.id and x.user_id='$D')), (select count(*) from public.msg_members x join public.msg_conversations c on c.id=x.conversation_id where c.type='direct' and exists(select 1 from public.msg_members z where z.conversation_id=c.id and z.user_id='$C') and exists(select 1 from public.msg_members z where z.conversation_id=c.id and z.user_id='$D'))")
[[ "$state" = accepted && "$n" = 1 && "$m" = 2 ]] || { echo "Acceptation gagnante invalide: $state/$n/$m"; exit 1; }
echo "PASS: acceptation gagnante -> annulation false, un DM à deux membres."
