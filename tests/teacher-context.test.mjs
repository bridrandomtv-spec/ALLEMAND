import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/teacher-context.js', import.meta.url), 'utf8');
const selector = { value: 'ar-DZ' };
const window = {
  CONTEXT: { ctx: () => ({ subject: 'anglais', level: '3AS', track: 'sciences' }) },
  SUBJECT: { get: id => id === 'anglais' ? { name: 'Anglais', status: 'partial' } : null },
  document: { getElementById: id => id === 'chatVoiceLang' ? selector : null }
};
vm.runInNewContext(source, { window, globalThis: window, Object, JSON, String });
const built = JSON.parse(window.TEACHER_CONTEXT.build('  اشرحلي present perfect  '));
assert.equal(built.schema, 'teacher-context-v1');
assert.equal(built.trust, 'client_unverified');
assert.equal(built.question, 'اشرحلي present perfect');
assert.deepEqual(JSON.parse(JSON.stringify(built.subject)), {
  id: 'anglais', name: 'Anglais', status: 'partial'
});
assert.equal(built.level, '3AS');
assert.equal(built.track, 'sciences');
assert.equal(built.dictationLanguage, 'ar-DZ');
assert.equal(built.responseLanguage, 'auto');
assert.deepEqual(JSON.parse(JSON.stringify(built.retrievedSources)), []);
assert.ok(window.TEACHER_CONTEXT.build('x'.repeat(800)).length < 1200);
process.stdout.write('Teacher context envelope: passed.\n');
