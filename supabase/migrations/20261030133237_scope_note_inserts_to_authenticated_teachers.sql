-- Reconciled from the live Supabase catalog for the recorded applied migration.
drop policy if exists "teacher inserts own notes" on public.notes;
create policy "teacher inserts own notes" on public.notes for insert to authenticated
with check ((select auth.uid())=prof_id and public.is_prof());
