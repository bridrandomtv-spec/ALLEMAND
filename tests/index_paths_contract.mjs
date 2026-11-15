/* Lot 638 — contrat des chemins BIBLIO / RAG.
   Exécution : node tests/index_paths_contract.mjs
   Contrôle statique des responsabilités et du comportement de repli ;
   ne génère aucun index et ne réalise aucune ingestion.
*/
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const json = p => JSON.parse(read(p));
const catalogue = json('assets/bdd/corpus.json');
const biblio = read('biblio.js');
const ingest = read('tools/ingest_corpus.py');
const indexer = read('tools/indexer_pdf.py');
const sharder = read('tools/sharder_index.py');
const rag = read('rag.js');

assert.match(catalogue._meta.architecture['3_index_biblio'], /corpus_index\\.json/);
assert.match(catalogue._meta.architecture['3_index_biblio'], /biblio\\.js/);
assert.match(catalogue._meta.architecture['4_index_rag'], /corpus_rag_index\\.json/);
assert.match(catalogue._meta.architecture['4_index_rag'], /chunks\\[\\]/);
assert.match(biblio, /assets\\/bdd\\/corpus_index\\.json/);
assert.match(ingest, /INDEX = os\\.path\\.join\\(BDD, "corpus_rag_index\\.json"\\)/);
assert.match(indexer, /INDEX = os\\.path\\.join\\("assets", "bdd", "corpus_rag_index\\.json"\\)/);
assert.match(sharder, /SRC = os\\.path\\.join\\("assets", "bdd", "corpus_rag_index\\.json"\\)/);
assert.match(rag, /fetch\\('assets\\/bdd\\/corpus_rag_index\\.json'/);
assert.match(rag, /const idx = await chargeLegacy\\(\\);[\\s\\S]*?return idx \\? meilleur\\(idx, ts\\) : null/);
assert.match(indexer, /ne modifie jamais corpus_index\\.json/);
assert.match(ingest, /corpus_rag_index\\.json/);

const legacy = json('assets/bdd/corpus_index.json');
assert.ok(Array.isArray(legacy.items), 'l’index lexical BIBLIO historique doit conserver items[]');

const ragPath = 'assets/bdd/corpus_rag_index.json';
if (fs.existsSync(ragPath)) {
  const idx = json(ragPath);
  assert.ok(Array.isArray(idx.chunks), 'chunks[] absent de l’index RAG présent');
  assert.ok(idx.termes && typeof idx.termes === 'object', 'termes{} absent de l’index RAG présent');
} else {
  console.log('WARN index RAG absent : aucune réponse RAG documentaire ne peut être certifiée sur ce checkout');
}

const manifest = json('assets/bdd/shards_manifest.json');
if (!manifest.shards?.length || !manifest.total_chunks) {
  console.log('WARN aucun shard RAG publié : le lecteur doit utiliser uniquement un index complet RAG valide, sinon retourner null');
}
console.log('PASS séparation corpus_index.json (BIBLIO) / corpus_rag_index.json (RAG)');
console.log('PASS chemins cohérents entre indexeurs, ingestion, sharder et lecteur');
console.log('PASS repli RAG sans confusion avec le catalogue BIBLIO');
