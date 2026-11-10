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
assert.match(sql, /else\s+exists\s*\([\s\S]*?p\.role in \('prof',\s*'admin',\s*'parent'\)/,
  'SQL helper must fail closed for every role outside the explicit exemption list');
assert.doesNotMatch(sql, /\n\s*else true\s*\n/,
  'SQL helper must not exempt arbitrary or null profile roles');
assert.match(edge, /if \(!isStudent && !isExemptRole\)\s*\{\s*return json\(403,[\s\S]*?PROFILE_ROLE_NOT_ALLOWED/,
  'Edge status must reject unknown profile roles');
assert.match(edge, /if \(!isStudent\) return json\(403,[\s\S]*?STUDENT_MFA_ONLY/,
  'Challenge start/verify must remain student-only');
assert.match(client, /typeof emailState\.required!==['"]boolean['"]/,
  'Client must fail closed when the Edge Function omits the required flag');

console.log('MFA static security checks passed: student mandatory; prof/admin/parent exempt; unknown roles denied; client metadata fail-closed.');
