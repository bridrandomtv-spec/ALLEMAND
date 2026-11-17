'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('js/qust.js', 'utf8');
const sandbox = { module: { exports: {} }, window: {} };
vm.runInNewContext(source, sandbox, { filename: 'js/qust.js' });
const understand = sandbox.module.exports.understand;
test('conserve transcript brut et texte normalisé séparément', () => {
  const r = understand('3lach ma fhemtch Perfekt?', {}, 'شرحلي Perfekt');
  assert.equal(r.raw_text, '3lach ma fhemtch Perfekt?');
  assert.equal(r.normalized_text, 'شرحلي perfekt');
  assert.equal(r.norm, '3lach ma fhemtch perfekt?');
});
test('comprend les formulations Darija/Arabizi sur Perfekt', () => {
  for (const q of ['3lach ma fhemtch Perfekt?', 'علاش ما فهمتش Perfekt؟', 'wach kifach nsta3mel Perfekt?']) {
    const r = understand(q, {});
    assert.equal(r.intent, 'explain_rule', q);
    assert.ok(r.langs.includes('darija'), q);
  }
});
test('ne classe pas une pagination comme Arabizi', () => {
  assert.ok(!understand('page 3', {}).langs.includes('arabizi'));
});
test('préserve la compatibilité de l’API historique à deux arguments et le contexte', () => {
  const r = understand('page 3', { subject: 'allemand', level: '2AS' });
  assert.equal(r.norm, 'page 3');
  assert.equal(r.raw_text, 'page 3');
  assert.equal(r.normalized_text, 'page 3');
  assert.equal(r.entities.subject, 'allemand');
  assert.equal(r.entities.level, '2AS');
  assert.equal(r.entities.page, 3);
});
test('détecte Arabizi dans un mot, pas dans un chiffre isolé', () => {
  assert.ok(understand('3lach', {}).langs.includes('arabizi'));
  assert.ok(!understand('page 3', {}).langs.includes('arabizi'));
});
test('RAG conserve la question brute avant darja et la transmet à QUST', () => {
  const rag = fs.readFileSync('rag.js', 'utf8');
  assert.match(rag, /async function reponsePedagogique\(q, meta\)/);
  assert.match(rag, /var rawQuestion = String\(q == null \? "" : q\)/);
  assert.match(rag, /understand\(rawQuestion, _qctx, q\)/);
});
test('IA et voix transmettent le transcript brut et sa normalisation distincte', () => {
  const ia = fs.readFileSync('ia.js', 'utf8');
  const parle = fs.readFileSync('parle.js', 'utf8');
  assert.match(ia, /reponseIA = async function\(q, meta\)/);
  assert.match(ia, /localObj = await fn\(q, meta \|\| null\)/);
  assert.match(parle, /fn\(q, \{ normalized_text: canon\(q\) \}\)/);
});

test('exécute le passage réel RAG → QUST avec transcript brut et normalisé', async () => {
  const rag = fs.readFileSync('rag.js', 'utf8');
  const calls = [];
  const sandbox = {
    window: {
      QUST: { understand: (raw, context, normalized) => {
        calls.push({ raw, context, normalized });
        return null;
      } },
      SUBJECT: { active: () => ({ id: 'allemand' }) }
    },
    document: { addEventListener() {}, querySelector() { return null; } },
    fetch: async () => ({ ok: false, json: async () => null })
  };
  vm.runInNewContext(rag, sandbox, { filename: 'rag.js' });
  await sandbox.window.reponsePedagogique('3lach ma fhemtch Perfekt?', {
    normalized_text: 'شرحلي perfekt'
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].raw, '3lach ma fhemtch Perfekt?');
  assert.equal(calls[0].normalized, 'شرحلي perfekt');
  assert.equal(calls[0].context.subject, 'allemand');
});

test('exécute le passage réel reponseIA → RAG sans perdre les métadonnées', async () => {
  const ia = fs.readFileSync('ia.js', 'utf8');
  let received = null;
  const sandbox = {
    window: {
      reponsePedagogique: async (q, meta) => {
        received = { q, meta };
        return { html: 'Dies ist eine ausreichend lange lokale Erklärung zum Perfekt.' };
      }
    },
    document: {
      getElementById() { return null; },
      readyState: 'loading',
      addEventListener() {}
    },
    fetch: async () => ({ ok: false }),
    setTimeout,
    clearTimeout,
    AbortController
  };
  vm.runInNewContext(ia, sandbox, { filename: 'ia.js' });
  const response = await sandbox.window.reponseIA('3lach ma fhemtch Perfekt?', {
    normalized_text: 'شرحلي perfekt'
  });
  assert.equal(received.q, '3lach ma fhemtch Perfekt?');
  assert.equal(received.meta.normalized_text, 'شرحلي perfekt');
  assert.match(response, /Erklärung zum Perfekt/);
});
