import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../devoirs_unite.js', import.meta.url), 'utf8');
const bddSource = fs.readFileSync(new URL('../bdd.js', import.meta.url), 'utf8');
const librarySource = fs.readFileSync(new URL('../library.js', import.meta.url), 'utf8');
const bddMatch = bddSource.match(/function correctionStatus\\(it\\)\\{[\\s\\S]*?\\n  \\}/);
assert.ok(bddMatch, 'correctionStatus doit être défini dans bdd.js');
const correctionStatus = vm.runInNewContext('(' + bddMatch[0] + ')');
const match = source.match(/function statutCorrige\(doc\)\{[\s\S]*?\n  \}/);
assert.ok(match, 'statutCorrige doit être défini dans devoirs_unite.js');
const statutCorrige = vm.runInNewContext('(' + match[0] + ')');

test('les corrigés génériques ou absents ne sont pas présentés comme validés', () => {
  assert.equal(statutCorrige({ corrige_inclus: false, corrige: 'texte' }), '—');
  assert.equal(statutCorrige({ corrige_inclus: true, corrige: '' }), '⚠️ corrigé à vérifier');
  assert.equal(statutCorrige({ corrige_inclus: true, corrige: 'Vrai/Faux selon le texte officiel' }), '⚠️ corrigé à vérifier');
  assert.equal(statutCorrige({ corrige_inclus: true, corrige: 'Ich heiße Omar. Ich bin 16 Jahre alt.' }), '⚠️ corrigé à vérifier');
  assert.equal(statutCorrige({ corrige_inclus: true, corrige: 'Corrigé littéral : Antworten passend zum Text.' }), '✅ corrigé présent');
});

test('les lots historiques connus signalent les modèles génériques', () => {
  const annales = JSON.parse(fs.readFileSync(new URL('../assets/bdd/annales.json', import.meta.url), 'utf8')).items;
  const compositions = JSON.parse(fs.readFileSync(new URL('../assets/bdd/compositions.json', import.meta.url), 'utf8')).items;
  assert.equal(annales.length, 126);
  assert.equal(annales.filter(x => statutCorrige(x) === '⚠️ corrigé à vérifier').length, 126);
  assert.equal(compositions.length, 171);
  assert.equal(compositions.filter(x => statutCorrige(x) === '⚠️ corrigé à vérifier').length, 168);
});

test('la bibliothèque masque le texte générique et utilise le statut central', () => {
  assert.equal(correctionStatus({ corrige_inclus: false, corrige: 'texte' }), 'absent');
  assert.equal(correctionStatus({ corrige_inclus: true, corrige: '' }), 'unverified');
  assert.equal(correctionStatus({ corrige_inclus: true, corrige: 'Vrai/Faux selon le texte officiel' }), 'unverified');
  assert.equal(correctionStatus({ corrige_inclus: true, corrige: 'Ich heiße Omar. Ich bin 16 Jahre alt.' }), 'unverified');
  assert.equal(correctionStatus({ corrige_inclus: true, corrige: 'Corrigé littéral : Antworten passend zum Text.' }), 'present');
  assert.match(librarySource, /BDD\\.correctionStatus\\(f\\) === 'present'/);
  assert.match(librarySource, /texte général ou non complet|texte عام أو غير مكتمل/);
});

test('le filtre et le KPI comptent uniquement les textes de correction présents', () => {
  assert.match(bddSource, /correctionStatus\\(it\\) !== 'present'/);
  assert.match(bddSource, /correctionStatus\\(i\\) === 'present'/);
});
