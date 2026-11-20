import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const json = path => JSON.parse(fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const archive = json('assets/bdd/bac_archive.json');
const bac = json('assets/bdd/bac.json');
const devoirs = json('assets/bdd/devoirs_officiels.json');
const examenSource = fs.readFileSync(new URL('../examen.js', import.meta.url), 'utf8');
const officielsSource = fs.readFileSync(new URL('../officiels.js', import.meta.url), 'utf8');

function distinctContent(items, subjectKey, correctionKey) {
  return new Set(items.map(item => JSON.stringify([
    item[subjectKey] ?? item.parties ?? null,
    item[correctionKey] ?? item.corrige ?? null
  ]))).size;
}

test('les 68 fiches BAC archivées ne sont pas présentées comme officiellement vérifiées', () => {
  assert.equal(archive.sujets.length, 68);
  assert.equal(distinctContent(archive.sujets, 'parties', 'corrige'), 12);
  assert.equal(archive.sujets.every(item => item.officiel === false), true);
  assert.equal(archive.sujets.every(item => item.provenance_verifiee === false), true);
  assert.equal(archive._meta.provenance_verifiee, false);
  assert.match(archive._meta.note_provenance, /aucune URL|référence primaire/i);
  assert.match(examenSource, /archive pédagogique/);
  assert.match(examenSource, /المصدر المعلن/);
});

test('la banque BAC secondaire garde ses 79 fiches mais marque les provenances non vérifiées', () => {
  assert.equal(bac.items.length, 79);
  assert.equal(distinctContent(bac.items, 'sujet', 'corrige'), 13);
  assert.equal(bac.items.every(item => item.officiel === false), true);
  assert.equal(bac.items.every(item => item.provenance_verifiee === false), true);
  assert.equal(bac._meta.provenance_verifiee, false);
});

test('la banque des devoirs conserve ses 55 sujets et corrige le décompte de métadonnées', () => {
  assert.equal(devoirs.devoirs.length, 55);
  assert.equal(devoirs._meta.nombre, 55);
  assert.equal(devoirs.devoirs.every(item => item.officiel === false), true);
  assert.equal(devoirs.devoirs.every(item => item.provenance_verifiee === false), true);
  assert.equal(devoirs.devoirs.every(item => !item.source_url && !item.document_id), true);
  assert.match(devoirs._meta.note_provenance, /55 fiches|référence documentaire primaire/i);
});

test('l’interface des devoirs ne revendique plus de sources officielles non documentées', () => {
  assert.match(officielsSource, /provenance documentaire à vérifier/);
  assert.match(officielsSource, /مصدر الوثائق قيد التحقق/);
  assert.match(officielsSource, /المؤسسات غير محددة/);
  assert.match(officielsSource, /replace\(\/رسمي\/g, 'تدريبي'\)/);
  assert.doesNotMatch(officielsSource, /مصادر رسمية|Archive fidèle/);
});
