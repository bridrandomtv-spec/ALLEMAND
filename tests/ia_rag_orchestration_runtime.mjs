/* Lot 646 — intégration navigateur/orchestrateur RAG → endpoint /ask simulé.
   Exécution : node tests/ia_rag_orchestration_runtime.mjs
   Aucun réseau, modèle externe, secret, navigateur réel ou corpus de production.
*/
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('ia.js', 'utf8');

async function runCase(sourceState) {
  let posted = null;
  const responseText = 'La conjonction « weil » introduit une proposition subordonnée.';
  const window = {
    AUTH: { session: () => ({ user: 'student-fixture' }) },
    QUST: { understand: () => ({
      norm: 'expliquer weil', langs: ['fr','de'], intent: 'explain_rule',
      confidence: 0.95, entities: { grammar: ['weil'] }, dialect: 'unknown'
    }) },
    CONTEXT: { ctx: () => ({ subject: 'allemand', level: '2AS', track: 'langues' }) },
    BIBLIO: { context: async () => '' },
    RAG: {
      cherche: async () => ({
        doc: 'fixture-de-2as', texte: 'weil introduit une subordonnée.',
        score: 5, page_start: 4, page_end: 4,
        source_sha256: 'a'.repeat(64)
      }),
      source: async hit => sourceState === 'verified' ? ({
        id: hit.doc, title: 'Manuel allemand synthétique',
        subject: 'allemand', level: '2AS', year: '2026/2027',
        source: 'fixture de test', format: 'pdf',
        page_start: 4, page_end: 4, sha256: hit.source_sha256
      }) : null
    },
    reponsePedagogique: async () => ({ html: 'لا أعرف' })
  };
  const document = { addEventListener() {}, getElementById() { return null; } };
  const storage = new Map();
  const localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value))
  };
  const fetch = async (url, options={}) => {
    if (url === 'assets/bdd/config.json') return {
      ok: true, json: async () => ({ ia_proxy: 'https://worker.test' })
    };
    if (url === 'https://worker.test/ask') {
      posted = JSON.parse(options.body);
      return { ok: true, json: async () => ({
        ok: true, rep: responseText, answer_language: 'fr'
      }) };
    }
    throw new Error('URL inattendue dans le test : ' + url);
  };
  vm.runInNewContext(source, {
    window, document, fetch, localStorage, console,
    setTimeout, clearTimeout
  });
  const answer = await window.reponseIA({
    raw_text: 'Explique weil en français',
    normalized_text: 'expliquer weil',
    input_mode: 'text', selected_language: 'auto',
    detected_language: 'fr', output_language: 'fr'
  });
  assert.ok(posted, 'aucune requête /ask émise');
  assert.equal(posted.raw_text, 'Explique weil en français');
  assert.match(posted.ctx, /EXTRAIT RAG/);
  return { answer, context: posted.ctx, payload: posted };
}

const verified = await runCase('verified');
assert.equal(verified.payload.rag_source_status, 'verified');
assert.match(verified.context, /SHA-256 concordant/);
assert.match(verified.context, /Manuel allemand synthétique/);
assert.match(verified.answer, /Source documentaire : Manuel allemand synthétique/);
assert.match(verified.answer, /p\. 4/);

const absent = await runCase('absent');
assert.equal(absent.payload.rag_source_status, 'unverified');
assert.match(absent.context, /PROVENANCE RAG : non certifiée/);
assert.doesNotMatch(absent.answer, /Source documentaire/);

const mismatch = await runCase('mismatch');
assert.equal(mismatch.payload.rag_source_status, 'unverified');
assert.match(mismatch.context, /PROVENANCE RAG : non certifiée/);
assert.doesNotMatch(mismatch.answer, /Source documentaire/);

console.log('PASS ia.js transmet la question originale et le contexte RAG au endpoint /ask simulé');
console.log('PASS une source vérifiée produit une citation avec titre et page');
console.log('PASS une source absente ou non concordante ne produit aucune citation vérifiée');
