/* Lot 603 — diagnostic de contrat BIBLIO/RAG et d'identité des chunks.
   Exécution depuis la racine : node tests/corpus_contract.mjs
   Suite volontairement bloquante tant que les contrats de production ne sont pas réparés.
   Non intégrée au workflow CI pendant la phase d'audit.
*/
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const json = p => JSON.parse(read(p));
const checks = [];
function check(id, fn) {
  try { fn(); checks.push({ id, ok: true }); }
  catch (error) { checks.push({ id, ok: false, message: error.message }); }
}

const catalogue = json('assets/bdd/corpus_index.json');
const manifest = json('assets/bdd/shards_manifest.json');
const biblio = read('biblio.js');
const rag = read('rag.js');
const ingest = read('tools/ingest_corpus.py');
const sharder = read('tools/sharder_index.py');

check('CAT-001 catalogue BIBLIO au format documenté', () => {
  assert.ok(catalogue && typeof catalogue === 'object' && !Array.isArray(catalogue));
  assert.ok(Array.isArray(catalogue.items), 'corpus_index.json doit exposer items[] pour BIBLIO');
  assert.match(biblio, /C\.items\s*\|\|\s*C\.index/);
});
check('RAG-001 index inversé séparé du catalogue', () => {
  assert.ok(fs.existsSync('assets/bdd/corpus_rag_index.json'),
    'artefact corpus_rag_index.json absent : le catalogue BIBLIO et l’index RAG ne sont pas séparés');
});
check('RAG-002 format inversé disponible', () => {
  const idx = json('assets/bdd/corpus_rag_index.json');
  assert.ok(idx && typeof idx.termes === 'object', 'termes{} absent');
  assert.ok(Array.isArray(idx.chunks), 'chunks[] absent');
});
check('ING-001 ingestion sans écrasement du catalogue', () => {
  assert.match(ingest, /corpus_rag_index\.json/,
    'ingest_corpus.py écrit encore corpus_index.json au lieu de l’artefact RAG séparé');
});
check('SHARD-001 postings filtrés par identifiants globaux', () => {
  assert.match(sharder, /global_id|chunk_id/,
    'le sharder ne déclare pas de clé globale explicite de chunk');
  assert.doesNotMatch(sharder, /ns\s*=\s*\{c\[['"]n['"]\]\s+for c in part\}/,
    'le sharder construit encore ns depuis les numéros locaux c.n');
  assert.doesNotMatch(sharder, /if v in ns/,
    'le sharder compare encore les postings globaux à l’ensemble des numéros locaux');
});
check('SHARD-002 identité stable utilisée par le lecteur RAG', () => {
  assert.match(rag, /global_id|chunk_id/,
    'rag.js ne résout pas les postings via un identifiant global explicite');
  assert.doesNotMatch(rag, /c\.n\s*===\s*\+cid/,
    'rag.js recherche encore un chunk par son numéro local n');
});
check('MAN-001 manifeste cohérent avec un index RAG disponible', () => {
  assert.ok(Array.isArray(manifest.shards), 'shards[] absent');
  assert.ok(manifest.nb_shards > 0 && manifest.total_chunks > 0,
    'aucun shard/chunk publié dans le manifeste');
  assert.equal(manifest.nb_shards, manifest.shards.length);
});

// Reproduction déterministe du défaut d'identité : deux documents ont chacun n=0,
// mais leurs identifiants globaux sont différents (0 et 250).
check('FIXTURE-001 les chunks de documents distincts ont des identifiants uniques', () => {
  const fixture = [
    { global_id: 0, doc: 'doc-A', n: 0 },
    { global_id: 250, doc: 'doc-B', n: 0 }
  ];
  assert.equal(new Set(fixture.map(x => x.global_id)).size, fixture.length);
  assert.equal(new Set(fixture.map(x => x.n)).size, fixture.length,
    'n local n’est pas unique entre documents : il ne peut pas identifier un chunk global');
});

for (const c of checks) {
  console.log((c.ok ? 'PASS ' : 'FAIL ') + c.id + (c.message ? ' — ' + c.message : ''));
}
const failed = checks.filter(c => !c.ok);
console.log('\nBilan contrat corpus : ' + (checks.length - failed.length) + '/' + checks.length + ' contrôles conformes.');
if (failed.length) {
  console.error('Blocages détectés : ' + failed.length + '. Aucun index n’a été généré ou modifié par cette suite.');
  process.exitCode = 1;
}
