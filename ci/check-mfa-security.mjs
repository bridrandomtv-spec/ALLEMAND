import fs from 'node:fs';
import assert from 'node:assert/strict';

const sql = fs.readFileSync('supabase/migrations/20261110160000_enforce_student_email_mfa.sql', 'utf8');
const edge = fs.readFileSync('supabase/functions/mfa-email/index.ts', 'utf8');
const client = fs.readFileSync('mfa-security.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
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

assert.ok(edge.includes('contractVersion: 1') && client.includes('emailState.contractVersion!==1'),
  'Client and Edge Function must explicitly agree on MFA response contract version 1');
assert.ok(client.includes("typeof emailState.required!=='boolean'"),
  'Client must fail closed when the Edge Function omits the required flag');
assert.ok(client.includes('if(emailState.required && (!emailState.enrolled || !emailState.verified))'),
  'Student login must enroll or challenge whenever the required factor is absent or unverified');
const appSource = app;
assert.ok(appSource.includes('function friendlyCloudAuthMessage(code, detail)') &&
  appSource.includes('email_not_confirmed') &&
  appSource.includes('افتح رسالة التأكيد واضغط الرابط الموجود فيها') &&
  appSource.includes('تم إنشاء طلب حسابك. أرسلنا رابط تأكيد') &&
  appSource.includes('const loginTab = document.querySelector(\'[data-gate="login"]\')'),
  'Cloud signup must guide unconfirmed students to the login tab and confirm their e-mail before first MFA enrollment');
assert.ok(client.includes("emailMessage(emailState.error||emailState.err") &&
  'Unconfirmed e-mail status must show the actionable confirmation-link instruction before MFA enrollment');
assert.ok(client.includes("function emailMessage(code,fallback)") &&
  client.includes("case 'VERIFIED_EMAIL_REQUIRED'") &&
  client.includes("افتح رسالة تأكيد البريد الإلكتروني") &&
  client.includes("case 'PLEASE_WAIT'") && client.includes("case 'RATE_LIMITED'") &&
  client.includes("case 'expired'") && client.includes("case 'invalid_code'"),
  'Student-facing MFA flow must translate known email, rate-limit and challenge errors into actionable Arabic guidance');
assert.ok(client.includes("تعذر الاتصال بخدمة التحقق الآن") &&
  !client.includes("error&&error.message||'تعذر التحقق من الرمز.'"),
  'Student-facing MFA network failures must not expose raw backend exception text');
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
const protectedRpcSignatures = [
  'active_entitlement(uuid)',
  'agreement_accept(bigint, text, text)',
  'agreement_status_for(uuid, text)',
  'agreement_withdraw(bigint)',
  'msg_can_dm(uuid, uuid)',
  'msg_is_member(uuid, bigint)',
  'msg_member_ok(bigint, uuid)',
  'msg_not_blocked(bigint, uuid)',
  'msg_open_direct(uuid)',
  'my_parent_link_requests()',
  'respond_parent_link_request(bigint, boolean)',
  'subscription_set_preuve(bigint, text)',
  'unlink_child(uuid)',
];
for (const signature of protectedRpcSignatures) {
  assert.ok(sql.includes(`revoke all on function public.${signature} from public, anon;`),
    `SECURITY DEFINER RPC ${signature} must revoke PUBLIC and anon execution`);
  assert.ok(sql.includes(`grant execute on function public.${signature} to authenticated, service_role;`),
    `SECURITY DEFINER RPC ${signature} must explicitly grant authenticated/service_role execution`);
}

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



assert.ok(client.includes('gatePass=true;return false;') &&
  client.includes('consumeGatePass:function(){if(!gatePass)return false;gatePass=false;return true;}'),
  'Successful MFA verification must create a one-time entry permit');
assert.ok(app.includes("if(session && session.src === 'cloud'){") &&
  app.includes("typeof window.DZ_MFA.consumeGatePass !== 'function'") &&
  app.includes("if(!window.DZ_MFA.consumeGatePass()){") &&
  app.includes("window.DZ_MFA.requireGate().then(function(blocked){") &&
  app.includes("if(shellNode) shellNode.hidden = true;") &&
  app.includes("if(gateNode) gateNode.hidden = false;"),
  'The central enterApp boundary must fail closed and require a one-time MFA permit for every cloud session');

assert.ok(html.includes('id="mfaChallengeForm"') && html.includes('id="mfaChallengeCode"') && html.includes('autocomplete="one-time-code"'),
  'Student MFA challenge must expose an accessible one-time-code input');
assert.ok(html.includes('id="mfaLoginEmailResend"') && html.includes('data-mfa-email-resend'),
  'Student email MFA challenge must expose an explicit resend control');
assert.ok(client.includes("var resendEmail=ev.target.closest('[data-mfa-email-resend]')") &&
  client.includes("SB.mfaEmail({action:'start',purpose:pending.purpose||'login'})") &&
  client.includes('pending.challengeId=loginSent.challengeId'),
  'Email resend must request a fresh challenge and replace the challenge identifier used for verification');
assert.ok(client.includes("pending&&pending.type==='email'?await SB.mfaEmail({action:'verify',challengeId:pending.challengeId,code:value})") &&
  client.includes('if(result&&result.ok){pending=null;await finishLogin();return;}'),
  'Email challenge verification must use the current challenge ID and re-run the central MFA gate before entry');

console.log('MFA static security checks passed: explicit student policy; known-role exemptions only; unknown roles denied; challenge/disable guards; client fail-closed and recheck.');
