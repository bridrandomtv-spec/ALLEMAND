# Live trigger-function findings — 2026-10-30

Project: azjwcybivirvpxbfhyzk
Branch: ops/supabase-readonly-inventory-2026-10-30
Method: read-only catalog inspection. No SQL writes.

## Profile guards

### profiles_role_guard()
The live SECURITY DEFINER function returns immediately when auth.uid() IS NULL. Otherwise it allows role changes only if the caller's profile has role admin. The NULL-auth bypass is a risk for trusted server/database execution contexts. It is not, by itself, proof that anonymous PostgREST users can exploit it; reachable RPC paths and execution context must be tested.

### profiles_scope_guard()
The live SECURITY DEFINER function also returns immediately when auth.uid() IS NULL. For non-null callers it blocks self-changes to wilaya/niveau/filiere, but permits admin OR prof to change another profile's scope. There is no active teacher-to-student/class assignment check in this trigger body. This is broader than a scoped teacher workflow.

### profiles_verif_guard()
No NULL-auth early return. It permits admin/prof, and permits the profile owner to resubmit verification from non_verifie/rejete to en_attente without changing verif_by. All other verification-field changes are rejected. Because prof is accepted globally, teacher verification authority remains broad.

### protect_role_niveau()
Also SECURITY DEFINER with search_path=public. It checks current_user NOT IN ('postgres','service_role'). In a SECURITY DEFINER function current_user is the function owner during execution, so the effectiveness of this legacy guard depends on its owner. Confirm owner and trigger attachment; if owned by postgres, the condition may exempt every invocation. Do not assume this guard protects role/niveau changes.

## Messaging guards

### msg_guard_direct()
The live trigger function selects one other participant using LIMIT 1, then checks only that participant with msg_can_dm(). It does not validate the full participant set or enforce exactly two members in its body. If other policies/constraints allow additional members, this check is incomplete. Verify the table's RLS insert paths and constraints before calling it exploitable.

### msg_tr_taille_fn()
The live SECURITY DEFINER trigger checks only octets > 5,242,880. It does not itself validate MIME, positive size, message existence, uploader membership in the message conversation, storage path ownership, or pending status. Some checks exist in the INSERT policy/client, but client-side validation is not a security boundary.

## Required next tests

1. Enumerate every callable RPC and trigger path that can update profiles with auth.uid() NULL; test with an isolated PostgreSQL fixture.
2. Test whether a teacher can alter another profile's wilaya/niveau/filiere through any exposed update/RPC path.
3. Confirm protect_role_niveau owner and actual trigger attachment.
4. Test direct conversations with 2, 3, and 4 participants through every permitted insertion path.
5. Attempt attachment rows with NULL message_id, another user's message_id, non-pending status, invalid MIME, and invalid size.
6. Verify sponsor intake cannot set statut or admin-only fields despite PUBLIC INSERT.

## Severity interpretation
These are confirmed implementation weaknesses in deployed function bodies, not automatically confirmed remote exploits. Exploitability depends on API grants, RLS, function ownership, trigger attachment, and transaction context.

## Non-actions
No database writes, migrations, branch creation, deployment, or production changes were performed.
