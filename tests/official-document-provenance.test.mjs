import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => JSON.parse(fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const compositions = read('assets/bdd/compositions.json');
const annales = read('assets/bdd/annales.json');
const worker = fs.readFileSync(new URL('../worker/ia-ask.js', import.meta.url), 'utf8');
const library = fs.readFileSync(new URL('../library.js', import.meta.url), 'utf8');
const devoirsUnite = fs.readFileSync(new URL('../devoirs_unite.js', import.meta.url), 'utf8');

function distinct(items) {
  return new Set(items.map(item => JSON.stringify([item.sujet ?? null, item.corrige ?? null]))).size;
}

for (const [name, bank, count, unique] of [
  ['compositions', compositions, 171, 30],
  ['annales', annales, 126, 22]
]) {
  test(name + ' conserve les contenus et marque explicitement la provenance non vérifiée', () => {
    assert.equal(bank.items.length, count);
    assert.equal(distinct(bank.items), unique);
    assert.equal(bank._meta.provenance_verifiee, false);
    assert.equal(bank._meta.statut_provenance, 'non_verifiee');
    assert.equal(bank.items.every(item => item.officiel === false), true);
    assert.equal(bank.items.every(item => item.provenance_verifiee === false), true);
    assert.equal(bank.items.every(item => item.statut_provenance === 'non_verifiee'), true);
    assert.equal(bank.items.every(item => !item.source_url && !item.document_id), true);
  });
}

test('le Worker ne présente comme officiel qu’un document avec provenance et référence primaire', () => {
  assert.match(worker, /doc\.provenance_verifiee === true/);
  assert.match(worker, /doc\.officiel === true/);
  assert.match(worker, /source_url/);
  assert.match(worker, /DOCUMENT PÉDAGOGIQUE — PROVENANCE NON VÉRIFIÉE/);
  assert.match(worker, /DOCUMENT OFFICIEL À PROVENANCE VÉRIFIÉE/);
  assert.doesNotMatch(worker, /CONTENU PÉDAGOGIQUE AUTORISÉ — DOCUMENT OFFICIEL '/);
});

test('la bibliothèque et les cartes par unité affichent un avertissement de provenance', () => {
  assert.match(library, /provenance documentaire non vérifiée/);
  assert.match(library, /المصدر المعلن/);
  assert.match(devoirsUnite, /مصدر الوثيقة غير متحقق/);
});
