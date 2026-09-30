-- supabase/harden.sql — PHASE 13 (durcissement) : les RPC de la décision C
-- ne doivent PAS être appelables par un client ANONYME (sonde 5 : HTTP 200 en anon).
-- À exécuter UNE fois : SQL Editor → Run. Idempotent.
revoke execute on function public.child_active_entitlement(uuid, uuid) from public;
revoke execute on function public.link_child(text) from public;
revoke execute on function public.my_linked_children() from public;
grant execute on function public.child_active_entitlement(uuid, uuid) to authenticated;
grant execute on function public.link_child(text) to authenticated;
grant execute on function public.my_linked_children() to authenticated;
