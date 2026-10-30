# Supabase live security review — read-only findings
Date: 2026-10-30
Project ref: azjwcybivirvpxbfhyzk
Scope: catalog/function/policy inspection only. No SQL writes, no production changes.

## Confirmed live definitions

### 1. Signup trigger: `public.handle_new_user()`
- SECURITY DEFINER trigger function.
- No function-level fixed `search_path` is declared.
- Inserts profile fields `niveau`, `filiere`, and `wilaya` directly from `auth.users.raw_user_meta_data`.
- Allows metadata role `parent` or `eleve`; other values are converted to `eleve`.
- Risk: public signup metadata controls privileged profile attributes and parent classification unless another trigger/constraint reliably overrides them. Verify intended onboarding and parent-link flow before changing behavior.
- Hardening direction: set a fixed search_path (prefer `pg_catalog, public` with schema-qualified objects), derive role from a trusted server-side onboarding flow, and validate/assign school attributes server-side. Do not break legitimate parent signup.

### 2. Messaging moderator: `public.msg_is_moderator(uid uuid)`
- SECURITY DEFINER, fixed search_path `public`.
- Returns true for any profile whose role is `admin` or `prof`.
- Live policies use it for message SELECT/UPDATE and pending-profile verification.
- Risk: every teacher receives global moderator scope, not a class/wilaya-limited scope. This is broader than a scoped moderation model.
- Hardening direction: separate platform admin moderation from teacher/class-specific verification and enforce conversation/class/wilaya scope in the relevant policies and RPCs.

### 3. Notes visibility
- Policy `prof lit sa classe` is SELECT with condition `auth.uid() = eleve_id OR is_prof()`.
- Risk: any account satisfying `is_prof()` can read all notes, not just its own class/students.
- Hardening direction: replace the broad teacher predicate with an explicit teacher-to-student/class assignment check. Preserve student self-read.

### 4. Platform settings
- Policy `settings lecture connectes` grants SELECT to authenticated users with condition `true`.
- Risk: all settings values are readable by every authenticated account, including values that may be operational or sensitive.
- Hardening direction: classify settings into public client configuration and private operational secrets; expose only an allowlisted public view/RPC.

### 5. Sponsor submissions
- Policy `public insert sponsor` permits INSERT with `WITH CHECK (true)` for PUBLIC.
- Risk: unauthenticated clients can insert arbitrary sponsor rows and may set workflow fields unless constrained elsewhere.
- Hardening direction: accept only public application fields, force initial status server-side, validate lengths/types, and keep approval fields admin-only.

### 6. Messaging policy scope
- `msg_messages` UPDATE policy allows `auth.uid() = sender_id OR msg_is_moderator(auth.uid())`.
- SELECT permits conversation members OR moderators.
- Since the moderator function treats all teachers as moderators, this inherits the global teacher scope described above.
- Review message immutability and ensure sender updates cannot alter conversation_id, sender_id, or moderation state.

## Additional function observations
- `assignment_set_active(uid, active)` uses `UPDATE ... SET active = active` with an argument of the same name. This is ambiguous and should be rewritten with an unambiguous parameter name or positional reference (for example `p_active`) after checking all callers.
- `agreement_status_for(uid, cle)` has a fixed search_path and compares the latest acceptance to the latest active agreement. The live definition alone does not establish whether parent acceptance/withdrawal semantics are correct; inspect callers and related RPCs before patching.
- `payment_set_statut` uses a local variable `v_statut := statut` and writes that variable; the previously suspected `SET statut = statut` ambiguity is not present in this live definition.
- `setting_set` checks `admin_can(auth.uid(), 'settings.manage')`; the live function still lacks a visible key allowlist, so review permitted keys and callers before changing it.

## Safe remediation order (no live writes performed)
1. Map every caller and intended role for signup, moderation, sponsor intake, settings, and notes.
2. Add regression tests for student, parent, teacher, wilaya agent, and admin personas.
3. Prepare one small migration per security domain on a disposable test database/branch or a local PostgreSQL test environment.
4. Review the migration and test results before any production application.

## Explicit boundary
This report is a read-only assessment. It does not apply migrations, alter policies, change grants, create a Supabase branch, or modify production data.
