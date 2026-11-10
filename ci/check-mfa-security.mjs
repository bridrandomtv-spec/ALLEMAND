import fs from 'node:fs';
import assert from 'node:assert/strict';

const sql = fs.readFileSync('supabase/migrations/20261110160000_enforce_student_email_mfa.sql', 'utf8');
const edge = fs.readFileSync('supabase/functions/mfa-email/index.ts', 'utf8');
const client = fs.readFileSync('mfa-security.js', 'utf8');
const supabaseClient = fs.readFileSync('supabase/supabase.js', 'utf8');
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
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
assert.ok(schema.includes('create or replace function public.handle_new_user()') &&
  schema.includes('drop trigger if exists on_auth_user_created on auth.users') &&
  schema.includes('create trigger on_auth_user_created'),
  'The canonical schema must define the existing Auth-user profile trigger');
assert.ok(sql.includes('create or replace function public.handle_new_user()') &&
  sql.includes("set search_path = ''") &&
  sql.includes("    'eleve',") &&
  sql.includes('on conflict (id) do nothing'),
  'MFA migration must harden the existing trigger function, force the default student role and preserve any profile provisioned by another trusted trigger');
assert.ok(sql.includes("new.raw_user_meta_data ->> 'pseudo'") &&
  sql.includes("new.raw_user_meta_data ->> 'niveau'") &&
  !sql.includes("new.raw_user_meta_data ->> 'role'"),
  'Profile provisioning may use student metadata but must never trust client-supplied role metadata');
assert.ok(sql.includes('drop trigger if exists on_auth_user_created on auth.users') &&
  sql.includes('create trigger on_auth_user_created') &&
  sql.includes('revoke all on function public.handle_new_user() from public, anon, authenticated') &&
  !sql.includes('create_student_profile_for_new_auth_user') &&
  !sql.includes('on_auth_user_created_student_profile'),
  'Migration must recreate and lock down the one canonical trigger instead of adding a duplicate');
// The profile role is the server-side switch for mandatory student MFA.
// Prevent a student from changing that role through the historical own-profile UPDATE policy.
const roleGuardStart = sql.indexOf('create or replace function public.profiles_role_guard()');
const roleGuardEnd = sql.indexOf('$function$;', roleGuardStart);
const roleGuardSource = sql.slice(roleGuardStart, roleGuardEnd);
assert.ok(roleGuardStart >= 0 &&
  roleGuardSource.includes("set search_path = ''") &&
  roleGuardSource.includes("session_user in ('postgres', 'supabase_admin')") &&
  roleGuardSource.includes("(select auth.jwt() ->> 'role') = 'service_role'") &&
  roleGuardSource.includes("(select auth.uid()) is not null") &&
  roleGuardSource.includes("p.role = 'admin'") &&
  roleGuardSource.includes("raise exception 'role_reservee_admin'") &&
  !roleGuardSource.includes('security definer'),
  'Profile role guard must be SECURITY INVOKER, pin an empty search_path and allow role changes only to trusted SQL/service_role or an existing admin');
assert.ok(sql.includes('revoke all on function public.profiles_role_guard() from public, anon, authenticated') &&
  sql.includes('drop trigger if exists profiles_tr_role on public.profiles') &&
  sql.includes('create trigger profiles_tr_role') &&
  sql.includes('before update on public.profiles'),
  'Mandatory MFA migration must install the role-protection trigger, not rely on an optional manual SQL file');
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
assert.ok(client.includes("case 'NETWORK_UNAVAILABLE'") &&
  client.includes("تعذر الاتصال بخدمة التحقق الآن") &&
  supabaseClient.includes("error:'NETWORK_UNAVAILABLE'"),
  'MFA network interruptions must return a stable error code and a student-friendly message');
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
// Exhaustive audit: every SECURITY DEFINER routine in this migration must be
// classified, hardened, and covered by the MFA boundary (except the Auth trigger
// and the private boolean gate, which have their own explicit contracts).
const definerFunctions = [...sql.matchAll(
  /create or replace function\s+([a-z0-9_.]+)\s*\(([\s\S]*?)\)\s*returns[\s\S]*?\bas\s+\$function\$([\s\S]*?)\$function\$;/gi
)].map(match => {
  const statement = match[0];
  const header = statement.slice(0, statement.indexOf('as $function$'));
  return { name: match[1], header, body: match[3] };
}).filter(fn => /security\s+definer/i.test(fn.header));
const expectedDefiners = [
  'public.handle_new_user',
  'private.student_email_mfa_access_allowed',
  ...protectedRpcSignatures.map(signature => 'public.' + signature.slice(0, signature.indexOf('(')))
];
assert.deepEqual(definerFunctions.map(fn => fn.name).sort(), expectedDefiners.sort(),
  'Every SECURITY DEFINER routine must be explicitly included in the reviewed inventory');
for (const fn of definerFunctions) {
  assert.ok(/set search_path/i.test(fn.header), `SECURITY DEFINER ${fn.name} must pin search_path`);
  if (fn.name === 'public.handle_new_user') {
    assert.ok(/set search_path\s*=\s*''/i.test(fn.header) &&
      /revoke all on function public\.handle_new_user\(\) from public, anon, authenticated/i.test(sql),
      'Auth trigger must use an empty search_path and must not be callable by client roles');
  } else if (fn.name === 'private.student_email_mfa_access_allowed') {
    assert.ok(/auth\.uid\(\)/i.test(fn.body) &&
      /grant execute on function private\.student_email_mfa_access_allowed\(\) to authenticated, service_role/i.test(sql) &&
      /revoke all on function private\.student_email_mfa_access_allowed\(\) from public, anon/i.test(sql),
      'Private MFA predicate must bind authorization to auth.uid and have explicit ACLs');
  } else {
    assert.ok(/auth\.uid\(\)/i.test(fn.body) &&
      /private\.student_email_mfa_access_allowed\(\)/i.test(fn.body),
      `SECURITY DEFINER RPC ${fn.name} must bind caller identity and enforce the MFA gate`);
    const escaped = fn.name.replace('.', '\\.');
    assert.ok(new RegExp(`revoke all on function ${escaped}\\(`, 'i').test(sql) &&
      new RegExp(`grant execute on function ${escaped}\\(`, 'i').test(sql),
      `SECURITY DEFINER RPC ${fn.name} must have explicit revoke/grant ACLs`);
  }
}

for (const signature of protectedRpcSignatures) {
  assert.ok(sql.includes(`revoke all on function public.${signature} from public, anon;`),
    `SECURITY DEFINER RPC ${signature} must revoke PUBLIC and anon execution`);
  assert.ok(sql.includes(`grant execute on function public.${signature} to authenticated, service_role;`),
    `SECURITY DEFINER RPC ${signature} must explicitly grant authenticated/service_role execution`);
}

const notifyStart = sql.indexOf('create or replace function public.notify(cible uuid, cle text, payload jsonb');
const notifyEnd = sql.indexOf('$function$;', notifyStart);
const notifySource = sql.slice(notifyStart, notifyEnd);
assert.ok(notifyStart >= 0 &&
  /security\\s+definer/i.test(notifySource) &&
  /set search_path to 'pg_catalog', 'public'/i.test(notifySource) &&
  notifySource.includes('insert into public.notifications') &&
  sql.includes('revoke all on function public.notify(uuid, text, jsonb)') &&
  /revoke all on function public\\.notify\\(uuid, text, jsonb\\)\\s+from public, anon, authenticated, service_role/i.test(sql),
  'Notification helper must be server-trigger-only, use a pinned search_path and deny direct RPC execution to all client/API roles');

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
const restoreStart = app.indexOf('if(cloudRestorePending){');
const restoreGate = app.indexOf('if(await window.DZ_MFA.requireGate()) return;', restoreStart);
const restoreProfile = app.indexOf('const profile = window.cloudAuthority ? await window.cloudAuthority() : null;', restoreGate);
const restoreEnter = app.indexOf('if(profile){ enterApp(profile); return; }', restoreProfile);
const restoreEnd = app.indexOf("if(window.BDD && !BDD.state.ready", restoreStart);
assert.ok(restoreStart >= 0 && restoreGate > restoreStart && restoreProfile > restoreGate && restoreEnter > restoreProfile,
  'Cloud session restoration must pass the MFA gate before loading the profile or entering the app');
assert.ok(restoreEnd > restoreStart && !app.slice(restoreStart, restoreEnd).includes('error && error.message'),
  'Cloud session restoration must not expose raw exception/provider details to students');
assert.ok(app.includes('تعذر استعادة جلسة الدخول بأمان. تحقق من اتصال الإنترنت ثم سجّل الدخول مجددًا.'),
  'Cloud session restoration must show a student-friendly fail-closed error');



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


assert.ok(edge.includes('.eq("user_id", user.id).eq("session_id", sessionId).gt("expires_at", new Date().toISOString())'),
  'MFA status must bind verification to the current authenticated session and reject expired verification');
assert.ok(edge.includes('new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()') &&
  edge.includes('p_session_id: sessionId') &&
  edge.includes('${user.id}:${sessionId}:${challengeId}:${code}'),
  'Email challenge and its 12-hour verification grant must be bound to the current user and Auth session');
assert.ok(sql.includes("s.session_id::text = coalesce((select auth.jwt() ->> 'session_id'), '')") &&
  sql.includes('from auth.sessions auth_session') &&
  sql.includes('auth_session.user_id = (select auth.uid())') &&
  sql.includes('(auth_session.not_after is null or auth_session.not_after > pg_catalog.now())'),
  'Protected data access must require a matching, non-expired Supabase Auth session in addition to email MFA');
assert.ok(client.includes('if(emailState.required && (!emailState.enrolled || !emailState.verified))') &&
  client.includes("var purpose=emailState.enrolled?'login':'enroll';"),
  'An enrolled student without a valid verification for the current session must receive a login challenge, not skip MFA');

console.log('MFA static security checks passed: explicit student policy; known-role exemptions only; unknown roles denied; challenge/disable guards; client fail-closed and recheck.');
