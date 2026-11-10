import fs from 'node:fs';
import assert from 'node:assert/strict';

const sql = fs.readFileSync('supabase/migrations/20261110160000_enforce_student_email_mfa.sql', 'utf8');
const edge = fs.readFileSync('supabase/functions/mfa-email/index.ts', 'utf8');
const client = fs.readFileSync('mfa-security.js', 'utf8');

const exemptRoles = ['prof', 'admin', 'parent'];
for (const role of exemptRoles) {
  assert.ok(sql.includes(`'${role}'`), `SQL helper must explicitly allow ${role}`);
  assert.ok(edge.includes(`"${role}"`), `Edge Function must explicitly allow ${role}`);
}
assert.match(sql, /else\\s+exists\\s*\\([\\s\\S]*?p\\.role in \\('prof',\\s*'admin',\\s*'parent'\\)/,
  'SQL helper must fail closed for every role outside the explicit exemption list');
assert.doesNotMatch(sql, /\\n\\s*else true\\s*\\n/,
  'SQL helper must not exempt arbitrary or null profile roles');
assert.match(edge, /admin\\.from\\("profiles"\\)\\s*\\.select\\("role"\\)\\.eq\\("id", user\\.id\\)\\.maybeSingle\\(\\)/,
  'Edge Function must derive the role from the server-side profiles row');
assert.match(edge, /if \\(!isStudent && !isExemptRole\\)\\s*\\{\\s*return json\\(403,[\\s\\S]*?PROFILE_ROLE_NOT_ALLOWED/,
  'Edge status must reject unknown profile roles');
assert.match(edge, /required:\\s*false/,
  'Known non-student roles must receive an explicit required=false policy');
assert.match(edge, /required:\\s*isStudent/,
  'Student status must return an explicit required=true policy');
assert.match(edge, /if \\(action === "start"\\) \\{\\s*if \\(!isStudent\\) return json\\(403,[\\s\\S]*?STUDENT_MFA_ONLY/,
  'Challenge start must remain student-only');
assert.match(edge, /if \\(action === "verify"\\) \\{\\s*if \\(!isStudent\\) return json\\(403,[\\s\\S]*?STUDENT_MFA_ONLY/,
  'Challenge verification must remain student-only');
assert.match(edge, /if \\(action === "disable"\\) \\{[\\s\\S]*?return json\\(403,[\\s\\S]*?EMAIL_FACTOR_REQUIRED/,
  'Mandatory e-mail MFA must not be disabled through the Edge Function');
assert.match(client, /typeof emailState\\.required!==['"]boolean['"]/,
  'Client must fail closed when the Edge Function omits the required flag');
assert.match(client, /if\\(emailState\\.required && \\(!emailState\\.enrolled \\|\\| !emailState\\.verified\\)\\)/,
  'Student login must enroll or challenge whenever the required factor is absent or unverified');
assert.match(client, /نسخة خدمة التحقق الأمني غير متوافقة مع المنصة[\\s\\S]*لم يتم تجاوز فحص الأمان/,
  'Client must explain that a missing policy flag requires a compatible Edge Function update');
assert.match(client, /async function finishLogin\\(\\)\\s*\\{\\s*try\\{\\s*if\\(await requireGate\\(\\)\\)return;/,
  'Login must re-run the security gate before entering the application');

console.log('MFA static security checks passed: explicit student policy; known-role exemptions only; unknown roles denied; challenge/disable guards; client fail-closed and recheck.');
