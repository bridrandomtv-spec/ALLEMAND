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
