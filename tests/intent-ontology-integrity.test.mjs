import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const readJson = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const normalize = value => String(value || '').toLowerCase().normalize('NFKD')
  .replace(/[\\u0300-\\u036f\\u064B-\\u065F\\u0670]/g, '')
  .replace(/\\u0640/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/[ؤئ]/g, 'ء')
  .replace(/ة/g, 'ه').replace(/ى/g, 'ي')
  .replace(/[؟?!.,،؛:()\\[\\]{}"'«»]/g, ' ')
  .replace(/\\s+/g, ' ').trim();

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

test('la route d’intentions reste protégée et ne sert aucun contenu pédagogique statique', () => {
  const rag = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  const start = rag.indexOf('async function ontoRoute(q){');
  const end = rag.indexOf('/* P5-A : repli QUST', start);
  assert.ok(start >= 0 && end > start, 'ontoRoute doit rester identifiable pour audit');
  const route = rag.slice(start, end);
  assert.match(route, /await verifieAccesContenuIA\(q\)/,
    'la route doit appliquer le garde d’accès avant toute décision');
  assert.match(route, /contentIntents\.has\(id\)\) return null/,
    'les intentions de contenu doivent revenir au pipeline pédagogique sécurisé');
  assert.doesNotMatch(route, /chargeMalakhiss\(|chargeCorp\(|map\(e2 =>|suj\.map/,
    'la route ne doit pas construire de réponses depuis des corpus statiques');
  assert.doesNotMatch(rag, /await ontoRoute\(/,
    'ontoRoute reste dormante tant que son routage complet n’est pas validé');
  assert.doesNotMatch(rag, /window\.RAG\s*=\s*\{[^}]*ontoRoute/,
    'la route statique ne doit pas être exposée sur l’API publique de test');
});

test('la bibliothèque du Professeur IA vérifie l’entitlement avant toute restitution', () => {
  const rag = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  const start = rag.indexOf('async function intentBiblio(q){');
  const end = rag.indexOf('/* ── خطوة 2 : Intent Ontology', start);
  assert.ok(start >= 0 && end > start, 'intentBiblio doit être identifiable');
  const route = rag.slice(start, end);
  assert.ok(route.indexOf('await verifieAccesBibliothequeIA()') >= 0,
    'intentBiblio doit vérifier le backend avant stats/search');
  assert.ok(route.indexOf('await verifieAccesBibliothequeIA()') < route.indexOf('BIBLIO.stats()'),
    'le contrôle doit précéder les statistiques');
  assert.ok(route.indexOf('await verifieAccesBibliothequeIA()') < route.indexOf('BIBLIO.search(q, 2)'),
    'le contrôle doit précéder la recherche documentaire');
  const trad = rag.indexOf('const tr = await BIBLIO.traduire(mDe[0]);');
  const guard = rag.indexOf('await verifieAccesBibliothequeIA()', trad);
  assert.ok(trad >= 0 && guard > trad && guard < rag.indexOf("out.innerHTML = '<div class=\"rg-ok rg-ped\"><b>📖", trad),
    'le raccourci de traduction doit vérifier l’accès avant restitution');
});

test('le lecteur de page ne bascule jamais vers le manuel de l’autre niveau', () => {
  const rag = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  const start = rag.indexOf('async function intentLecture(q){');
  const end = rag.indexOf('const lec = q.match', start);
  assert.ok(start >= 0 && end > start, 'intentLecture doit rester identifiable');
  const route = rag.slice(start, end);
  assert.doesNotMatch(route, /is3\s*\?\s*await loadPages\(\)\s*:\s*await loadPages3as\(\)/,
    'une page absente ne doit pas déclencher un repli vers l’autre manuel');
  assert.match(route, /e\.locked === false/,
    'un corps statique doit avoir un marqueur explicite locked:false');
  assert.match(route, /nicht indexiert/,
    'une page absente doit être signalée comme non indexée dans le niveau demandé');
});


test('les métadonnées de l’ontologie et les catégories du jeu d’évaluation sont cohérentes', () => {
  const ontology = readJson('../assets/bdd/intent_ontology.json');
  const dataset = readJson('../assets/bdd/intent_eval_set.json');
  const allowedCategories = new Set([
    'EXPLAIN', 'TRANSLATE', 'SEARCH', 'PRACTICE',
    'CORRECTION', 'REVISION', 'NAVIGATION'
  ]);
  const knownLevels = new Set(['2AS', '3AS']);
  const byIntent = new Map();

  for (const item of ontology.intents || []) {
    assert.ok(item.intent && typeof item.intent === 'string', 'identifiant d’intention absent');
    assert.ok(!byIntent.has(item.intent), 'identifiant d’intention dupliqué : ' + item.intent);
    assert.ok(allowedCategories.has(item.category), 'catégorie inconnue : ' + item.category);
    assert.ok(typeof item.action === 'string' && /^[A-Z][A-Z0-9_]*$/.test(item.action),
      'action invalide pour ' + item.intent);
    assert.ok(Array.isArray(item.niveau) && item.niveau.length > 0,
      'niveaux absents pour ' + item.intent);
    assert.ok(item.niveau.every(level => knownLevels.has(level)),
      'niveau inconnu pour ' + item.intent);
    byIntent.set(item.intent, item);
  }

  for (const sample of dataset.eval || []) {
    const item = byIntent.get(sample.intent);
    assert.ok(item, 'intention inconnue : ' + sample.intent);
    assert.equal(sample.category, item.category,
      'catégorie d’évaluation incohérente pour ' + sample.intent);
  }

  assert.equal(dataset._meta.n, dataset.eval.length,
    'le compteur du jeu d’évaluation doit refléter le nombre réel de questions');
  for (const item of byIntent.values()) {
    assert.ok(dataset.eval.some(sample => sample.intent === item.intent),
      'intention sans exemple d’évaluation : ' + item.intent);
  }
});
