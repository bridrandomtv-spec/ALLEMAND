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
const retrieved = [{ documentId: 'doc-42', title: 'Leçon témoin', subject: 'allemand', level: '2AS', type: 'cours', language: 'de+ar', chunkId: 7, excerpt: 'Ein kurzer Auszug.', trust: 'server_verified' }];
const built = JSON.parse(window.TEACHER_CONTEXT.build('  اشرحلي present perfect  ', retrieved));
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
assert.equal(built.retrievedSources.length, 1);
assert.equal(built.retrievedSources[0].documentId, 'doc-42');
assert.equal(built.retrievedSources[0].chunkId, 7);
assert.equal(built.retrievedSources[0].trust, 'client_unverified', 'browser source metadata must never upgrade its trust level');
assert.equal(built.retrievedSources[0].excerpt, 'Ein kurzer Auszug.');
const bounded = JSON.parse(window.TEACHER_CONTEXT.build('question', [
  { documentId: 'x', excerpt: 'a'.repeat(2000) },
  { documentId: 'y', excerpt: 'b'.repeat(2000) },
  { documentId: 'z', excerpt: 'third source' }
]));
assert.equal(bounded.retrievedSources.length, 2);
assert.equal(bounded.retrievedSources[0].excerpt.length, 900);
assert.ok(window.TEACHER_CONTEXT.build('x'.repeat(800)).length < 1200);
process.stdout.write('Teacher context envelope: passed.\n');
