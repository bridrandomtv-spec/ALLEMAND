import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');

function response(value) {
  return { ok: true, json: async () => value };
}

async function boot(files) {
  const listeners = {};
  const document = {
    addEventListener(name, callback) { listeners[name] = callback; },
    querySelector() { return null; }
  };
  const context = {
    document,
    window: {},
    console,
    fetch: async (url) => Object.prototype.hasOwnProperty.call(files, url)
      ? response(files[url])
      : { ok: false, json: async () => null },
    setTimeout,
    clearTimeout
  };
  vm.runInNewContext(source, context, { filename: 'rag.js' });
  await Promise.resolve();
  return context.window.RAG;
}

const corpus = {
  documents: [
    { id: 'doc-valid', droits_statut: 'verifies', droits_reference: 'autorisation-123' },
    { id: 'doc-unverified', droits_statut: 'a_verifier', droits_reference: 'autorisation-999' },
    { id: 'doc-no-reference', droits_statut: 'verifies', droits_reference: '  ' }
  ]
};
const query = 'freiheit schule';

{
  const rag = await boot({
    'assets/bdd/corpus.json': corpus,
    'assets/bdd/shards_manifest.json': { shards: [{ file: 'part-001.json' }] },
    'assets/bdd/shards/part-001.json': {
      termes: { freiheit: [0, 1], schule: [0, 1] },
      chunks: [
        { n: 0, doc: 'doc-unverified', texte: 'Unverified document must never be returned.' },
        { n: 1, doc: 'doc-valid', texte: 'Verified lesson about Freiheit und Schule.' }
      ]
    }
  });
  const result = await rag.cherche(query);
  assert.equal(result.doc, 'doc-valid', 'sharded search must return the verified source');
}

{
  const rag = await boot({
    'assets/bdd/corpus.json': { documents: [corpus.documents[1], corpus.documents[2]] },
    'assets/bdd/shards_manifest.json': { shards: [{ file: 'part-001.json' }] },
    'assets/bdd/shards/part-001.json': {
      termes: { freiheit: [0], schule: [0] },
      chunks: [{ n: 0, doc: 'doc-unverified', texte: 'Forbidden source.' }]
    }
  });
  assert.equal(await rag.cherche(query), null,
    'sharded search must abstain when every matching source is unverified');
}

{
  const rag = await boot({
    'assets/bdd/corpus.json': corpus,
    'assets/bdd/shards_manifest.json': { shards: [] },
    'assets/bdd/corpus_chunks_index.json': {
      termes: { freiheit: [0, 1], schule: [0, 1] },
      chunks: [
        { n: 0, doc: 'doc-no-reference', texte: 'Verified flag without evidence is insufficient.' },
        { n: 1, doc: 'doc-valid', texte: 'Verified legacy-index lesson.' }
      ]
    }
  });
  const result = await rag.cherche(query);
  assert.equal(result.doc, 'doc-valid', 'unsharded fallback must apply the same rights filter');
}

{
  const rag = await boot({
    'assets/bdd/corpus.json': { documents: [] },
    'assets/bdd/shards_manifest.json': { shards: [] },
    'assets/bdd/corpus_chunks_index.json': {
      termes: { freiheit: [0], schule: [0] },
      chunks: [{ n: 0, doc: 'doc-valid', texte: 'No matching document registry entry.' }]
    }
  });
  assert.equal(await rag.cherche(query), null,
    'search must abstain if the registry has no admitted document');
}

process.stdout.write('RAG rights guard: 4 scenarios passed.\\n');
