/* Lot 617 — intégration de QUST : détection Darija/Arabizi, intentions et entités.
   Exécution : node tests/qust_runtime_contract.mjs
   Ce test vérifie l'analyse déterministe, pas la qualité d'une réponse LLM. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const source = fs.readFileSync('js/qust.js', 'utf8');
const ctx = { subject:'allemand', level:'2AS', track:'langues' };
const window = { CONTEXT:{ ctx:() => ctx } };
vm.runInNewContext(source, { window });
assert.equal(typeof window.QUST?.understand, 'function', 'QUST doit exposer understand');

const arabic = window.QUST.understand('ما فهمتش قاعدة Akkusativ', null);
assert.equal(arabic.dialect, 'darija');
assert.equal(arabic.intent, 'explain_rule');
assert.equal(arabic.entities.level, '2AS');
assert.deepEqual(Array.from(arabic.entities.grammar), ['akkusativ']);

const compare = window.QUST.understand('واش الفرق بين der و die؟', null);
assert.equal(compare.dialect, 'darija');
assert.equal(compare.intent, 'compare');

const arabizi = window.QUST.understand('wach kifach nsta3mel dativ?', null);
assert.equal(arabizi.dialect, 'darija');
assert.equal(arabizi.intent, 'explain_rule');
assert.deepEqual(Array.from(arabizi.entities.grammar), ['dativ']);

const correction = window.QUST.understand('صحح هذا التمرين', null);
assert.equal(correction.intent, 'correct_exercise');

const page = window.QUST.understand('Explique la page 12 en 3AS', null);
assert.equal(page.entities.page, 12);
assert.equal(page.entities.level, '3AS');

const msa = window.QUST.understand('كيف أراجع الدرس؟', null);
assert.equal(msa.dialect, 'unknown', 'l’arabe standard ne doit pas être classé Darija');

const german = window.QUST.understand('Wie geht es dir?', null);
assert.equal(german.dialect, 'unknown', 'l’allemand ne doit pas être classé Darija');
assert.ok(german.langs.includes('de'), 'allemand non reconnu par QUST');

const english = window.QUST.understand('What is the difference between present simple and present continuous?', null);
assert.ok(english.langs.includes('en'), 'anglais non reconnu par QUST');
assert.ok(!english.langs.includes('fr'), 'une question anglaise ne doit pas être classée française');
const french = window.QUST.understand('Explique la différence entre les articles', null);
assert.ok(french.langs.includes('fr'), 'français non reconnu par QUST');
assert.ok(!french.langs.includes('es'), 'une phrase française ne doit pas être classée espagnole');
const spanish = window.QUST.understand('¿Cuál es la diferencia entre ser y estar?', null);
assert.ok(spanish.langs.includes('es'), 'espagnol non reconnu par QUST');
const italian = window.QUST.understand('Qual è la differenza tra essere e avere?', null);
assert.ok(italian.langs.includes('it'), 'italien non reconnu par QUST');

const ia = fs.readFileSync('ia.js', 'utf8');
const worker = fs.readFileSync('worker/ia-ask.js', 'utf8');
assert.match(ia, /window\.QUST && typeof window\.QUST\.understand/);
assert.match(ia, /understanding: understanding \?/);
assert.match(worker, /allowedIntents/);
assert.match(worker, /allowedLanguages/);
assert.match(worker, /INTENTION QUST/);
assert.match(worker, /ENTITÉS QUST/);

console.log('PASS QUST : Darija arabe, Arabizi, MSA, allemand, anglais, espagnol, italien, intentions et entités');
console.log('PASS intégration ia.js → Worker et validation des métadonnées QUST');
