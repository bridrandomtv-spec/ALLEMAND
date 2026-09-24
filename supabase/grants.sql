-- ══════════════════════════════════════════════════════════════════
--  grants.sql — GRANTS explicites Data API (changement Supabase du 30 octobre)
--  Idempotent : peut être ré-exécuté sans risque, à tout moment.
--  Rappel : les GRANTS autorisent l'ACCÈS à la table ; ce sont les politiques
--  RLS qui décident QUELLES lignes chaque rôle voit. Les deux se combinent.
-- ══════════════════════════════════════════════════════════════════
grant select on table public.profiles to anon;
grant select on table public.seances_done to anon;
grant select on table public.memoire_cards to anon;
grant select on table public.notes to anon;
grant select on table public.documents_meta to anon;
grant select on table public.subscriptions to anon;
grant select on table public.sponsors to anon;
grant select on table public.ads to anon;
grant insert on table public.sponsors to anon;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.seances_done to authenticated;
grant select, insert, update, delete on table public.seances_done to service_role;
grant select, insert, update, delete on table public.memoire_cards to authenticated;
grant select, insert, update, delete on table public.memoire_cards to service_role;
grant select, insert, update, delete on table public.notes to authenticated;
grant select, insert, update, delete on table public.notes to service_role;
grant select, insert, update, delete on table public.documents_meta to authenticated;
grant select, insert, update, delete on table public.documents_meta to service_role;
grant select, insert, update, delete on table public.subscriptions to authenticated;
grant select, insert, update, delete on table public.subscriptions to service_role;
grant select, insert, update, delete on table public.sponsors to authenticated;
grant select, insert, update, delete on table public.sponsors to service_role;
grant select, insert, update, delete on table public.ads to authenticated;
grant select, insert, update, delete on table public.ads to service_role;
