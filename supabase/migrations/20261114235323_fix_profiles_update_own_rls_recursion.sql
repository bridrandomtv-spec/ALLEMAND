-- Restore non-recursive own-profile update policy.
drop policy if exists "update own" on public.profiles;
create policy "update own"
on public.profiles
for update to public
using (auth.uid() = id)
with check (auth.uid() = id);
