-- ══════════════════════════════════════════════════════════════════
--  admin.sql — permet au rôle admin de gérer les rôles (à Run dans SQL Editor)
-- ══════════════════════════════════════════════════════════════════
create policy "admin update roles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- (une seule fois) promeut ton compte au rôle admin :
-- update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'TON_EMAIL_ICI');
