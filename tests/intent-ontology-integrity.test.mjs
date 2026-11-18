import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const readJson = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const normalize = value => String(value || '').toLowerCase().normalize('NFKC')
  .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
  .replace(/[\u064B-\u065F\u0670]/g, '')
  .replace(/[؟?!.,،؛:()\[\]{}"'«»]/g, ' ')
  .replace(/\s+/g, ' ').trim();

test('les formulations de l’ontologie ne désignent pas plusieurs intentions', () => {
  const ontology = readJson('../assets/bdd/intent_ontology.json');
  const owners = new Map();
  for (const item of ontology.intents || []) {
    for (const group of [item.patterns || {}, item.expansion || {}]) {
      for (const phrases of Object.values(group)) {
        for (const phrase of phrases || []) {
          const key = normalize(phrase);
          if (!key) continue;
          if (!owners.has(key)) owners.set(key, new Set());
          owners.get(key).add(item.intent);
        }
      }
    }
  }
  const collisions = [...owners].filter(([, intents]) => intents.size > 1);
  assert.deepEqual(collisions.map(([phrase]) => phrase), [],
    'une formulation partagée doit être retirée ou traitée comme ambiguë');
});

test('le jeu d’évaluation ne contient aucune question à étiquettes contradictoires', () => {
  const ontology = readJson('../assets/bdd/intent_ontology.json');
  const dataset = readJson('../assets/bdd/intent_eval_set.json');
  const known = new Set((ontology.intents || []).map(item => item.intent));
  const labels = new Map();
  for (const sample of dataset.eval || []) {
    const key = normalize(sample.q);
    assert.ok(key, 'question vide dans le jeu d’évaluation');
    assert.ok(known.has(sample.intent), 'intention inconnue : ' + sample.intent);
    if (!labels.has(key)) labels.set(key, new Set());
    labels.get(key).add(sample.intent);
  }
  const collisions = [...labels].filter(([, intents]) => intents.size > 1);
  assert.deepEqual(collisions.map(([phrase]) => phrase), []);
  assert.equal(dataset._meta.n, dataset.eval.length);
  assert.equal(new Set(dataset.eval.map(sample => sample.intent)).size, known.size,
    'chaque intention doit conserver au moins un exemple non ambigu');
});
