-- Reconciled from the live Supabase catalog for the recorded applied migration.
drop policy if exists "parent_role_requests_admin_read" on public.parent_role_requests;
create policy "parent_role_requests_admin_read" on public.parent_role_requests for select to authenticated using (public.is_admin());
