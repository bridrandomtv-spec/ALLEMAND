/* Lot 609 — tests runtime isolés du lecteur RAG.
   Exécution depuis la racine : node tests/rag_loader_runtime.mjs
   Le fichier rag.js est évalué dans un VM avec document/fetch simulés.
   Aucun réseau, navigateur réel ni fichier de corpus n'est utilisé.
*/
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('rag.js', 'utf8');
const ok = data => ({ ok: true, json: async () => data });
const missing = () => ({ ok: false, json: async () => null });

async function createRag(routes) {
  const document = { addEventListener() {}, querySelector() { return null; } };
  const window = {};
  const fetch = async url => {
    if (url === 'assets/bdd/sharh.json') return missing();
    return Object.prototype.hasOwnProperty.call(routes, url) ? routes[url]() : missing();
  };
  vm.runInNewContext(source, { window, document, fetch, console, setTimeout, clearTimeout });
  assert.ok(window.RAG && typeof window.RAG.cherche === 'function', 'API window.RAG absente');
  return window.RAG;
}
const GENERATION = 'a'.repeat(64);
const manifest = shards => ({
  version: '2.0.0', generation: GENERATION, nb_shards: shards.length,
  total_chunks: shards.reduce((n, s) => n + s.nb_chunks, 0), shards
});
const chunk = (id, texte, doc='doc-test') => ({ global_id: id, texte, doc });
const index = (id=90) => ({
  chunks: [chunk(id, 'fallback-complet')],
  termes: { alpha: [id], beta: [id] }
});
const routesFor = (man, shardRoutes={}, full=index()) => ({
  'assets/bdd/shards_manifest.json': () => ok(man),
  'assets/bdd/corpus_rag_index.json': () => full ? ok(full) : missing(),
  ...shardRoutes
});

const results = [];
async function test(name, fn) {
  try { await fn(); results.push([name, true]); }
  catch (e) { results.push([name, false, e.message]); }
}

await test('le meilleur score global est retenu dans le dernier shard', async () => {
  const man = manifest([{file:'shard_00.json',nb_chunks:1},{file:'shard_01.json',nb_chunks:1}]);
  const firstTerms = Object.fromEntries(['alpha','beta','gamma','delta','epsilon'].map(t=>[t,[0]]));
  const laterTerms = Object.fromEntries(['alpha','beta','gamma','delta','epsilon','zeta'].map(t=>[t,[1]]));
  const routes = routesFor(man, {
    'assets/bdd/shards/shard_00.json':()=>ok({_generation:GENERATION,chunks:[chunk(0,'premier-score-5')],termes:firstTerms}),
    'assets/bdd/shards/shard_01.json':()=>ok({_generation:GENERATION,chunks:[chunk(1,'meilleur-score-6')],termes:laterTerms})
  }, null);
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta gamma delta epsilon zeta');
  assert.equal(found.texte, 'meilleur-score-6');
});

await test('un shard absent déclenche le repli sur index complet', async () => {
  const man = manifest([{file:'shard_00.json',nb_chunks:1}]);
  const routes = routesFor(man, {'assets/bdd/shards/shard_00.json':missing}, index(90));
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found.texte, 'fallback-complet');
});

await test('un posting orphelin déclenche le repli', async () => {
  const man = manifest([{file:'shard_00.json',nb_chunks:1}]);
  const routes = routesFor(man, {
    'assets/bdd/shards/shard_00.json':()=>ok({
      _generation:GENERATION, chunks:[chunk(1,'shard-invalide')],termes:{alpha:[999],beta:[1]}
    })
  }, index(90));
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found.texte, 'fallback-complet');
});

await test('un ID répété entre deux shards déclenche le repli', async () => {
  const man = manifest([{file:'shard_00.json',nb_chunks:1},{file:'shard_01.json',nb_chunks:1}]);
  const shard = ()=>ok({_generation:GENERATION,chunks:[chunk(5,'duplicate')],termes:{alpha:[5],beta:[5]}});
  const routes = routesFor(man, {
    'assets/bdd/shards/shard_00.json':shard,
    'assets/bdd/shards/shard_01.json':shard
  }, index(90));
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found.texte, 'fallback-complet');
});

await test('un manifeste v1 vide ou incompatible bascule vers l’index complet', async () => {
  const routes = routesFor({version:'1.0.0',nb_shards:0,total_chunks:0,shards:[]},{},index(90));
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found.texte, 'fallback-complet');
});

await test('sans shards valides ni index complet, aucun résultat n’est inventé', async () => {
  const routes = routesFor({version:'1.0.0',nb_shards:0,total_chunks:0,shards:[]},{},null);
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found, null);
});


await test('une génération de shard différente du manifeste déclenche le repli', async () => {
  const man = manifest([{file:'shard_00.json',nb_chunks:1}]);
  const routes = routesFor(man, {
    'assets/bdd/shards/shard_00.json':()=>ok({
      _generation:'b'.repeat(64),
      chunks:[chunk(0,'generation-perimee')],
      termes:{alpha:[0],beta:[0]}
    })
  }, index(90));
  const rag = await createRag(routes);
  const found = await rag.cherche('alpha beta');
  assert.equal(found.texte, 'fallback-complet');
});



await test('la source RAG est résolue uniquement si le SHA-256 concorde', async () => {
  const digest = 'c'.repeat(64);
  const routes = {
    'assets/bdd/corpus.json':()=>ok({documents:[{
      id:'doc-source', titre:'Manuel synthétique', matiere:'allemand',
      niveau:'2AS', annee:'2026/2027', source:'fixture contrôlée',
      format:'pdf', source_sha256:digest
    }]})
  };
  const rag = await createRag(routes);
  const ref = await rag.source({
    doc:'doc-source', page_start:4, page_end:4, source_sha256:digest
  });
  assert.equal(ref.title, 'Manuel synthétique');
  assert.equal(ref.page_start, 4);
  assert.equal(ref.sha256, digest);
  const mismatch = await rag.source({
    doc:'doc-source', page_start:4, page_end:4, source_sha256:'d'.repeat(64)
  });
  assert.equal(mismatch, null);
});


for (const [name, passed, message] of results) {
  console.log((passed ? 'PASS ' : 'FAIL ') + name + (message ? ' — ' + message : ''));
}
const failed = results.filter(x=>!x[1]).length;
console.log('\nLecteur RAG runtime : '+(results.length-failed)+'/'+results.length);
if (failed) process.exitCode = 1;
