/* Lot 638 — contrat des chemins BIBLIO / RAG.
   Exécution : node tests/index_paths_contract.mjs
   Contrôle statique ; ne génère aucun index et ne réalise aucune ingestion.
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

assert.ok(catalogue._meta.architecture['3_index_biblio'].includes('corpus_index.json'));
assert.ok(catalogue._meta.architecture['3_index_biblio'].includes('biblio.js'));
assert.ok(catalogue._meta.architecture['4_index_rag'].includes('corpus_rag_index.json'));
assert.ok(catalogue._meta.architecture['4_index_rag'].includes('chunks[]'));
assert.ok(biblio.includes('assets/bdd/corpus_index.json'));
assert.ok(ingest.includes('INDEX = os.path.join(BDD, "corpus_rag_index.json")'));
assert.ok(indexer.includes('INDEX = os.path.join("assets", "bdd", "corpus_rag_index.json")'));
assert.ok(sharder.includes('SRC = os.path.join("assets", "bdd", "corpus_rag_index.json")'));
assert.ok(rag.includes("fetch('assets/bdd/corpus_rag_index.json'"));
assert.ok(rag.includes('const idx = await chargeLegacy()'));
assert.ok(indexer.includes('ne modifie jamais corpus_index.json'));
assert.ok(ingest.includes('corpus_rag_index.json'));

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
  console.log('WARN aucun shard RAG publié : le lecteur ne peut pas fournir de réponse RAG shardée');
}
console.log('PASS séparation corpus_index.json (BIBLIO) / corpus_rag_index.json (RAG)');
console.log('PASS chemins cohérents entre indexeurs, ingestion, sharder et lecteur');
console.log('PASS contrôle de disponibilité sans confondre les deux index');
