-- Reconciled from the live Supabase catalog for the recorded applied migration.
drop policy if exists "notes owner teacher admin read" on public.notes;
create policy "notes owner teacher admin read" on public.notes for select to authenticated
using ((select auth.uid())=eleve_id or ((select auth.uid())=prof_id and public.is_prof()) or public.is_admin());
