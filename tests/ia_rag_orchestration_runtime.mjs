/* Lot 646 — intégration navigateur/orchestrateur RAG → endpoint /ask simulé.
   Exécution : node tests/ia_rag_orchestration_runtime.mjs
   Aucun réseau, modèle externe, secret, navigateur réel ou corpus de production.
*/
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('ia.js', 'utf8');

async function runCase(sourceState, question='Explique weil en français') {
  let posted = null;
  const responseText = 'La conjonction « weil » introduit une proposition subordonnée.';
  const window = {
    AUTH: { session: () => ({ user: 'student-fixture' }) },
    QUST: { understand: () => ({
      norm: 'expliquer weil', langs: ['fr','de'], intent: 'explain_rule',
      confidence: 0.95, entities: { grammar: ['weil'] }, dialect: 'unknown'
    }) },
    CONTEXT: { ctx: () => ({ subject: 'allemand', level: '2AS', track: 'langues' }) },
    BIBLIO: { context: async () => sourceState === 'biblio-only' ? 'Extrait BIBLIO de fixture sans référence documentaire vérifiée.' : '' },
    RAG: {
      cherche: async () => ['unavailable','biblio-only'].includes(sourceState) ? null : ({
        doc: 'fixture-de-2as', texte: 'weil introduit une subordonnée.',
        score: 5, page_start: 4, page_end: 4,
        source_sha256: 'a'.repeat(64)
      }),
      source: async hit => ['verified','client-unattested'].includes(sourceState) ? ({
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
    if (url === '/api/rag-evidence') {
      const request = JSON.parse(options.body);
      if (sourceState === 'verified' && /page 4/i.test(request.q)) return {
        ok:true, json:async () => ({
          ok:true, context:'PROVENANCE RAG vérifiée côté serveur\\nEXTRAIT RAG — page 4',
          token:'fixture-signed-rag-evidence-token',
          document_title:'Manuel allemand synthétique côté serveur', page_start:4
        })
      };
      return { ok:false, status:404, json:async () => ({ ok:false }) };
    }
    if (url === 'https://worker.test/ask') {
      posted = JSON.parse(options.body);
      return { ok: true, json: async () => ({
        ok: true, rep: responseText, answer_language: 'fr',
        rag_evidence_verified: sourceState === 'verified'
      }) };
    }
    throw new Error('URL inattendue dans le test : ' + url);
  };
  vm.runInNewContext(source, {
    window, document, fetch, localStorage, console,
    setTimeout, clearTimeout
  });
  const answer = await window.reponseIA({
    raw_text: question,
    normalized_text: question,
    input_mode: 'text', selected_language: 'auto',
    detected_language: 'fr', output_language: 'fr'
  });
  assert.ok(posted, 'aucune requête /ask émise');
  assert.equal(posted.raw_text, question);
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

const unavailable = await runCase('unavailable');
assert.equal(unavailable.payload.rag_source_status, 'unavailable');
assert.match(unavailable.context, /aucun extrait RAG pertinent et vérifié/);
assert.doesNotMatch(unavailable.answer, /Source documentaire/);

const exactPage = await runCase('verified', 'Explique la page 4');
assert.equal(exactPage.payload.rag_scope_type, 'page');
assert.equal(exactPage.payload.rag_scope_value, 4);
assert.equal(exactPage.payload.rag_scope_status, 'verified');
assert.equal(exactPage.payload.rag_evidence_token, 'fixture-signed-rag-evidence-token');
assert.match(exactPage.context, /vérifiée côté serveur/);
assert.doesNotMatch(exactPage.context, /RÉPONSE LOCALE/,
  'le contexte signé doit être transmis sans ajout local qui invaliderait son empreinte');
assert.match(exactPage.answer, /Source documentaire : Manuel allemand synthétique côté serveur/);

const unknownPage = await runCase('verified', 'Explique la page 42');
assert.equal(unknownPage.payload.rag_scope_status, 'mismatch');
assert.doesNotMatch(unknownPage.answer, /Source documentaire/, 'ne pas citer une page différente de celle demandée');

const requestedUnit = await runCase('verified', 'Explique unité 7');
assert.equal(requestedUnit.payload.rag_scope_type, 'unit');
assert.equal(requestedUnit.payload.rag_scope_status, 'unsupported');
assert.doesNotMatch(requestedUnit.answer, /Source documentaire/, 'ne pas citer une unité non certifiée');

const requestedExercise = await runCase('verified', 'Corrige exercice 3');
assert.equal(requestedExercise.payload.rag_scope_type, 'exercise');
assert.equal(requestedExercise.payload.rag_scope_status, 'unsupported');
assert.doesNotMatch(requestedExercise.answer, /Source documentaire/, 'ne pas citer un exercice non certifié');

const general = await runCase('verified', 'Explique weil en français');
assert.equal(general.payload.rag_scope_type, 'none');
assert.equal(general.payload.rag_scope_status, 'none');

const clientOnly = await runCase('client-unattested', 'Explique la page 4 sans preuve');
assert.equal(clientOnly.payload.rag_source_status, 'verified');
assert.equal(clientOnly.payload.rag_scope_status, 'verified');
assert.equal(clientOnly.payload.rag_evidence_token, '');
assert.doesNotMatch(clientOnly.answer, /Source documentaire/,
  'une provenance locale déclarée vérifiée ne suffit pas sans attestation Worker');

const biblioOnly = await runCase('biblio-only', 'Donne la page 4 du manuel');
assert.equal(biblioOnly.payload.rag_source_status, 'unavailable');
assert.equal(biblioOnly.payload.rag_scope_status, 'unavailable');
assert.match(biblioOnly.context, /Extrait BIBLIO de fixture/);

console.log('PASS portée RAG : page exacte admise, page différente refusée, unité/exercice non certifiés');
console.log('PASS portée RAG : explication générale non bloquée et BIBLIO seul ne certifie aucune référence');

console.log('PASS ia.js transmet la question originale et le contexte RAG au endpoint /ask simulé');
console.log('PASS une source vérifiée produit une citation avec titre et page');
console.log('PASS source absente, provenance non concordante et RAG sans résultat ne produisent aucune citation vérifiée');
