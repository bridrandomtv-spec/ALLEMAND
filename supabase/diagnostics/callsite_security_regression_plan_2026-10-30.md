# Security call-site review and regression plan
Date: 2026-10-30
Branch: ops/supabase-readonly-inventory-2026-10-30
Scope: compare current repository client calls and SQL definitions with the read-only live Supabase findings. No database writes.

## A. Confirmed client call sites

| Surface | Repository location | Current behavior | Security consequence |
|---|---|---|---|
| Notes | `supabase/supabase.js:listNotes()` | Selects every row from `notes` | RLS is the only isolation boundary; live `prof lit sa classe` grants any `is_prof()` all notes. |
| Signup | `supabase/schema.sql:handle_new_user()` | Repository SQL forces role to `eleve`, but copies niveau/filiere/wilaya from metadata | Live function differs: accepts `parent` metadata role. Repo SQL is not an accurate snapshot of live behavior. |
| Sponsor form | `supabase/supabase.js:addSponsor(s)` | Inserts caller-provided object unchanged | Live PUBLIC INSERT policy has `WITH CHECK (true)`; caller-controlled workflow fields may be accepted unless table constraints/triggers stop them. |
| Sponsor moderation | `setSponsorStatut(id, statut)` | Direct client UPDATE of status | Must remain admin-only via RLS; verify all columns and status transitions, not only role. |
| Settings administration | `admSettings()`, `admSetSetting()` | Reads settings table directly; writes through `setting_set` RPC | Live SELECT policy is `true` for authenticated; admin RPC permission is checked, but read exposure is broad. |
| Public platform identity | `platformIdentity()` | Reads `platform_settings` row where key = `identite` | This is a legitimate public-facing use case; split public identity from private settings rather than blocking this feature. |
| Message moderation | `msgReportsOpen()`, `msgHandle()` | Reads open reports, then updates attachments/messages/reports | RLS currently defines every teacher as a moderator; client has no class/wilaya scope. |
| Message attachments | `msgUpload()` | Uploads object first, then inserts metadata row | If metadata insert fails, uploaded object is orphaned. SQL INSERT policy checks uploader/MIME/size but does not bind message_id to a message in a conversation where uploader is a member. |
| Message edits | `msgEdit()`, `msgDelete()` | Sender-filtered update from client | DB RLS remains authoritative. Review immutable columns: sender_id, conversation_id, attachment_id, flagged and moderation fields. |
| Agent activation | `admSetAgentActive()` | Calls `assignment_set_active(uid, active)` | Live function has an ambiguous `SET active = active`; parameter and column share a name. |

## B. Additional SQL-level findings from repository source

1. `supabase/msg_schema.sql` implements `msg_is_moderator` as role IN ('admin','prof'), and reuses it for conversation/message visibility, message UPDATE, report processing, attachment moderation, and message-log visibility.
2. `msg_att upload` only verifies uploader identity, MIME and size. It does not require a non-null message_id, membership in that message's conversation, or that the message sender/uploader relationship is valid.
3. `msg_messages edition` uses only `auth.uid() = sender_id OR msg_is_moderator(auth.uid())`. It has no explicit column-level protection or trigger in this policy definition.
4. `supabase/schema.sql` gives teachers broad notes SELECT in the repository source too. This is not merely a live drift.
5. `supabase/grants.sql` grants broad authenticated DML on core tables. This can be acceptable only if every table has complete RLS and every column transition is constrained; the grant list is not itself a security boundary.
6. `supabase/adm_schema.sql` contains the same ambiguous `UPDATE ... SET active = active` expression as the live function.

## C. Live-vs-repository drift requiring reconciliation

- Signup: live `handle_new_user()` permits `parent` or `eleve`; repository `schema.sql` forces `eleve`. Do not deploy repository SQL blindly: it could change legitimate parent onboarding.
- Other function/policy behavior must be compared against the live inventory before any migration. Repository SQL is not proof of the currently deployed schema.

## D. Regression matrix — expected outcomes

Run only in a disposable database or isolated local PostgreSQL fixture. These are acceptance criteria, not tests already executed.

| Test identity | Attempt | Expected |
|---|---|---|
| Anonymous | Insert sponsor with `statut='valide'` or admin-only fields | Rejected, or accepted only as a minimal pending application with server-forced status |
| Student A | Read Student B notes | Denied |
| Teacher A | Read notes for an unassigned student/class | Denied |
| Teacher A | Read notes for assigned student/class | Allowed only if teaching assignment is active |
| Teacher A | Read another class's messages/reports | Denied |
| Teacher A | Moderate a message outside assigned scope | Denied |
| Parent A | Register with metadata role=admin/prof | Stored role cannot exceed the trusted parent/student onboarding flow |
| New student | Supply another wilaya/niveau/filiere in metadata | Server validates/derives scope; client cannot self-assign protected attributes |
| Authenticated student | Read private settings keys | Denied |
| Authenticated user | Read public `identite` configuration | Allowed |
| Message member | Attach file to own conversation message | Allowed within MIME/size rules |
| Message member | Attach file to another user's message in a conversation they cannot access | Denied |
| Message sender | Change sender_id or move a message to another conversation | Denied |
| Wilaya agent | Activate agent outside authorized scope | Denied |
| Authorized admin | Activate/deactivate assigned agent | Correct row changes to requested boolean; audit event matches |

## E. Safe next implementation sequence

1. Split `msg_is_moderator` into explicit platform-admin moderation and scoped teacher actions; map the actual teacher verification workflow before changing it.
2. Add a trigger/RLS guard for message immutable fields and attachment-to-message membership.
3. Make sponsor intake a narrow server-controlled operation (minimal columns; initial status forced to pending).
4. Split public identity settings from private operational settings, preserving `platformIdentity()`.
5. Repair signup metadata trust only after documenting parent account creation and child-link lifecycle.
6. Rename the `assignment_set_active` argument (e.g. `p_active`) and update its single client RPC call in the same release.
7. Add tests for each role before preparing production migration scripts.

## F. Explicit non-actions
- No Supabase branch created (avoids paid resources).
- No migration or SQL DDL/DML executed.
- No production code deployed.
- No PR opened and no changes merged.
