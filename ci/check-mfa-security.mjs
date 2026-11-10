import fs from 'node:fs';
import assert from 'node:assert/strict';

const sql = fs.readFileSync('supabase/migrations/20261110160000_enforce_student_email_mfa.sql', 'utf8');
const edge = fs.readFileSync('supabase/functions/mfa-email/index.ts', 'utf8');
const client = fs.readFileSync('mfa-security.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');

for (const role of ['prof', 'admin', 'parent']) {
  assert.ok(sql.includes(`'${role}'`), `SQL helper must explicitly allow ${role}`);
  assert.ok(edge.includes(`"${role}"`), `Edge Function must explicitly allow ${role}`);
}
assert.ok(sql.includes("else exists (") && sql.includes("p.role in ('prof', 'admin', 'parent')"),
  'SQL helper must fail closed for roles outside the explicit exemption list');
assert.ok(!sql.includes('else true'), 'SQL helper must not exempt arbitrary or null profile roles');

assert.ok(edge.includes('admin.from("profiles")') && edge.includes('.select("role").eq("id", user.id).maybeSingle()'),
  'Edge Function must derive the role from the server-side profiles row');
assert.ok(edge.includes('if (!isStudent && !isExemptRole)') && edge.includes('PROFILE_ROLE_NOT_ALLOWED'),
  'Edge status must reject unknown profile roles');
assert.ok(edge.includes('required: false') && edge.includes('required: isStudent'),
  'Edge status must return explicit policy metadata for known roles');
assert.ok(edge.includes('if (action === "start")') && edge.includes('if (!isStudent) return json(403, { ok: false, error: "STUDENT_MFA_ONLY" });'),
  'Challenge start must remain student-only');
assert.ok(edge.includes('if (action === "verify")') && edge.includes('if (!isStudent) return json(403, { ok: false, error: "STUDENT_MFA_ONLY" });'),
  'Challenge verification must remain student-only');
assert.ok(edge.includes('if (action === "disable")') && edge.includes('error: "EMAIL_FACTOR_REQUIRED"'),
  'Mandatory e-mail MFA must not be disabled through the Edge Function');

assert.ok(client.includes("typeof emailState.required!=='boolean'"),
  'Client must fail closed when the Edge Function omits the required flag');
assert.ok(client.includes('if(emailState.required && (!emailState.enrolled || !emailState.verified))'),
  'Student login must enroll or challenge whenever the required factor is absent or unverified');
assert.ok(client.includes('نسخة خدمة التحقق الأمني غير متوافقة مع المنصة') &&
  client.includes('لم يتم تجاوز فحص الأمان'),
  'Client must explain that a missing policy flag requires a compatible Edge Function update');
assert.ok(client.includes('async function finishLogin()') &&
  client.includes('if(await requireGate())return;'),
  'Login must re-run the security gate before entering the application');


for (const table of ['mfa_email_factors', 'mfa_email_sessions', 'mfa_email_challenges']) {
  assert.ok(sql.includes(`create table if not exists public.${table}`),
    `Migration must create the ${table} table`);
  assert.ok(sql.includes(`alter table public.${table} enable row level security`),
    `Migration must enable RLS on ${table}`);
}
assert.ok(sql.includes('create or replace function public.mfa_email_issue_challenge') &&
  sql.includes('create or replace function public.mfa_email_consume_challenge'),
  'Migration must define both challenge RPCs used by the Edge Function');
assert.ok(sql.includes('grant execute on function public.mfa_email_issue_challenge') &&
  sql.includes('grant execute on function public.mfa_email_consume_challenge') &&
  sql.includes('to service_role'),
  'Challenge RPCs must be executable by service_role only');
assert.ok(sql.includes('attempts between 0 and 5') &&
  sql.includes("interval '5 minutes'") &&
  sql.includes("interval '60 seconds'") &&
  sql.includes("interval '1 hour'") &&
  sql.includes("interval '24 hours'"),
  'Challenge storage must enforce attempt, expiry and issuance rate limits');


assert.ok(sql.includes('revoke all on table public.mfa_email_factors') &&
  sql.includes('from public, anon, authenticated') &&
  sql.includes('to service_role'),
  'MFA tables must deny direct client-role access and grant backend access only');
assert.ok(sql.includes('revoke all on function public.mfa_email_issue_challenge') &&
  sql.includes('revoke all on function public.mfa_email_consume_challenge'),
  'Challenge RPCs must revoke default PUBLIC/client execution');
assert.ok(sql.includes('pg_catalog.pg_advisory_xact_lock') &&
  sql.includes('for update') &&
  sql.includes('attempts >= 5') &&
  sql.includes('attempts + 1 >= 5') &&
  sql.includes('set consumed_at = pg_catalog.now()'),
  'Challenge RPCs must serialize issuance, lock verification and enforce one-time/attempt limits');

assert.ok(app.includes("const cloudRestorePending = !!(s && s.src === 'cloud');"),
  'A remembered cloud session must always enter the MFA restoration gate');
assert.ok(!app.includes("const cloudRestorePending = !!(s && s.src === 'cloud' && !authLocalMode());"),
  'Demo/offline mode must not bypass MFA for a remembered cloud session');


console.log('MFA static security checks passed: explicit student policy; known-role exemptions only; unknown roles denied; challenge/disable guards; client fail-closed and recheck.');
