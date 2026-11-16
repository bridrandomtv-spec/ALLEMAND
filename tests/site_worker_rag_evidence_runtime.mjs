/* Lot 650 — tests du signataire RAG dans le Worker du site.
   Fixtures en mémoire ; aucun déploiement, réseau ou secret réel. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

const source = fs.readFileSync('src/site-worker.js', 'utf8')
  .replace('export default {', 'globalThis.__worker = {');
const sandbox = { Response, Request, URL, Headers, crypto:webcrypto, TextEncoder, TextDecoder, atob, btoa };
vm.runInNewContext(source, sandbox);
const worker = sandbox.__worker;
assert.ok(worker && typeof worker.fetch === 'function');

const secret = 'fixture-only-site-rag-hmac-secret-32-bytes';
const sourceHash = 'b'.repeat(64);
const documentId = 'fixture-deutschbuch';
const chunk = {
  global_id:7, doc:documentId,
  texte:'Explique la règle weil : le verbe conjugué se place à la fin de la subordonnée.',
  page_start:4, page_end:4, source_sha256:sourceHash
};
const manifest = { version:'2.0.0', generation:'a'.repeat(64),
  nb_shards:1, total_chunks:1,
  shards:[{ file:'shard_00.json', nb_chunks:1, nb_termes:3 }] };
const shard = { _generation:manifest.generation, chunks:[chunk],
  termes:{ explique:[7], weil:[7], verbe:[7] } };
const corpus = { documents:[{ id:documentId, titre:'Grammaire allemande',
  matiere:'allemand', niveau:'2AS', annee:'2026/2027', format:'pdf',
  source:'Document pédagogique de test', source_sha256:sourceHash,
  droits:{ licence:'production_propre', source:'Cours original', titulaire_droits:'Auteur du cours',
    declarant:'Auteur du cours', date_declaration:'2026-11-15', declaration_droits:true,
    usages_autorises:['hebergement_source','extraction_texte','indexation_rag','restitution_extraits'],
    validation:{ statut:'valide', verificateur:'Responsable pédagogique',
      date:'2026-11-15', reference_preuve:'fixture-droits-001' } } }] };
let corrupt = false;
const assets = {
  fetch: async request => {
    const path = new URL(request.url).pathname;
    let value;
    if(path === '/assets/bdd/shards_manifest.json') value = manifest;
    else if(path === '/assets/bdd/corpus.json') value = corpus;
    else if(path === '/assets/bdd/shards/shard_00.json')
      value = corrupt ? { ...shard, _generation:'c'.repeat(64) } : shard;
    else return new Response('not found', { status:404 });
    return new Response(JSON.stringify(value), { status:200,
      headers:{ 'Content-Type':'application/json' } });
  }
};
async function evidence(q, withSecret=true){
  const request = new Request('https://site.test/api/rag-evidence', {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ q })
  });
  const env = withSecret ? { ASSETS:assets, RAG_EVIDENCE_HMAC_KEY:secret } : { ASSETS:assets };
  const response = await worker.fetch(request, env, {});
  return { response, data:await response.json() };
}

const valid = await evidence('Explique la page 4');
assert.equal(valid.response.status, 200);
assert.equal(valid.data.ok, true);
assert.equal(valid.data.scope_type, 'page');
assert.equal(valid.data.scope_value, 4);
assert.match(valid.data.context, /Grammaire allemande/);
assert.match(valid.data.context, /verbe conjugué se place à la fin/);
const [payload, signature] = valid.data.token.split('.');
assert.ok(payload && signature);
const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
assert.equal(decoded.iss, 'lycee-virtuel-rag');
assert.equal(decoded.aud, 'ia-ask');
assert.equal(decoded.doc_id, documentId);
assert.equal(decoded.chunk_id, '7');
assert.equal(decoded.scope_type, 'page');
assert.equal(decoded.scope_value, 4);
assert.equal(decoded.source_sha256, sourceHash);
const contextHash = Buffer.from(await webcrypto.subtle.digest(
  'SHA-256', new TextEncoder().encode(valid.data.context))).toString('hex');
assert.equal(decoded.context_sha256, contextHash);
const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(secret),
  { name:'HMAC', hash:'SHA-256' }, false, ['verify']);
const sigBytes = Buffer.from(signature, 'base64url');
assert.equal(await webcrypto.subtle.verify('HMAC', key, sigBytes,
  new TextEncoder().encode(payload)), true);

const wrongPage = await evidence('Explique la page 5');
assert.equal(wrongPage.response.status, 404);
assert.equal(wrongPage.data.error, 'rag_scope_or_match_not_found');

const unsupportedUnit = await evidence('Explique unité 7');
assert.equal(unsupportedUnit.response.status, 404);
assert.equal(unsupportedUnit.data.error, 'rag_scope_or_match_not_found');

const noKey = await evidence('Explique la page 4', false);
assert.equal(noKey.response.status, 503);
assert.equal(noKey.data.error, 'rag_evidence_signer_not_configured');

corrupt = true;
const invalidShard = await evidence('Explique la page 4');
assert.equal(invalidShard.response.status, 503);
assert.equal(invalidShard.data.error, 'rag_shards_incoherent');

console.log('PASS Worker site : preuve HMAC signée depuis les actifs publiés et contexte canonique');
console.log('PASS Worker site : page divergente, unité absente, clé absente et shard incohérent refusés');
