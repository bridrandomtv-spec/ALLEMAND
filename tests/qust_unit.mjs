/* qust_unit.mjs — suite unitaire déterministe de QUST, sans navigateur ni réseau.
   Exécution : node tests/qust_unit.mjs
   Cette suite exprime le contrat attendu, pas une preuve de qualité pédagogique.
*/
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('js/qust.js', 'utf8');
const sandbox = {
  window: {},
  module: { exports: {} }
};
vm.runInNewContext(source, sandbox, { filename: 'js/qust.js', timeout: 1000 });
const understand = sandbox.module.exports?.understand || sandbox.window?.QUST?.understand;
assert.equal(typeof understand, 'function', 'QUST.understand doit être exporté');

const cases = [
  {
    id: 'QST-001', q: 'واش الفرق بين Dativ و Akkusativ؟',
    langs: ['ar', 'darija', 'de'], intent: 'compare',
    entities: { grammar: ['akkusativ', 'dativ'] }
  },
  {
    id: 'QST-002', q: '3lach le verbe yji f lekher m3a weil ?',
    langs: ['arabizi', 'de'], intent: 'explain_rule',
    entities: { conjunctions: ['weil'] }
  },
  {
    id: 'QST-003', q: 'wach nsta3mel kein wela nicht ?',
    langs: ['darija', 'de'], intent: 'compare',
    entities: {}
  },
  {
    id: 'QST-004', q: 'ما فهمتش Konjunktiv II، شرحلي ببساطة',
    langs: ['ar', 'darija'], intent: 'explain_lesson',
    context: { subject: 'allemand', level: '3AS', track: 'علوم تجريبية' },
    entities: { subject: 'allemand', level: '3AS', track: 'علوم تجريبية' }
  },
  {
    id: 'QST-005', q: 'Explique la différence entre mit et für',
    langs: ['fr', 'de'], intent: 'compare',
    entities: {}
  },
  {
    id: 'QST-006', q: 'اشرحلي الوحدة 8',
    langs: ['ar'], intent: 'explain_lesson',
    entities: { unit: 'U8' }
  },
  {
    id: 'QST-007', q: 'À quelle page trouve-t-on les W-Fragen ?',
    langs: ['fr', 'de'], intent: 'find_page',
    entities: { page: 42 },
    qOverride: 'À quelle page 42 trouve-t-on les W-Fragen ?'
  },
  {
    id: 'QST-008', q: 'Donne-moi la règle sur le Dativ en 3AS',
    langs: ['fr', 'de'], intent: 'explain_rule',
    entities: { level: '3AS', grammar: ['dativ'] }
  },
  {
    id: 'QST-009', q: 'واش تقدر تشرحلي weil und obwohl en français avec exemples ?',
    langs: ['ar', 'darija', 'fr', 'de'], intent: 'explain_lesson',
    entities: { conjunctions: ['weil'] }
  },
  {
    id: 'QST-010', q: 'résume la Lektion 4 en 2AS',
    langs: ['fr', 'de'], intent: 'summarize',
    entities: { level: '2AS', lektion: 'L4' }
  }
];

const failures = [];
for (const c of cases) {
  const input = c.qOverride || c.q;
  const got = understand(input, c.context || { subject: 'allemand' });
  const checks = [];
  for (const lang of c.langs) {
    if (!got.langs.includes(lang)) checks.push('langue absente: ' + lang);
  }
  if (got.intent !== c.intent) checks.push('intention: attendu=' + c.intent + ', obtenu=' + got.intent);
  for (const [key, expected] of Object.entries(c.entities || {})) {
    const actual = got.entities?.[key];
    const equal = Array.isArray(expected)
      ? Array.isArray(actual) && expected.every(v => actual.includes(v))
      : actual === expected;
    if (!equal) checks.push('entité ' + key + ': attendu=' + JSON.stringify(expected) + ', obtenu=' + JSON.stringify(actual));
  }
  if (checks.length) failures.push({ id: c.id, checks });
  console.log((checks.length ? 'FAIL ' : 'PASS ') + c.id + (checks.length ? ' — ' + checks.join(' ; ') : ''));
}
console.log('\nBilan QUST : ' + (cases.length - failures.length) + '/' + cases.length + ' cas conformes.');
if (failures.length) {
  console.error('Écarts détectés : ' + failures.length + '. Cette suite est volontairement bloquante tant que les contrats ne sont pas satisfaits.');
  process.exitCode = 1;
}
