import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../src/site-worker.js', import.meta.url), 'utf8');
const devoirsSource = fs.readFileSync(new URL('../devoirs_unite.js', import.meta.url), 'utf8');
const devoirnoteSource = fs.readFileSync(new URL('../devoirnote.js', import.meta.url), 'utf8');

function harness(options = {}) {
  const calls = [];
  const assets = [];
  const context = {
    URL, Headers, Response, Request,
    fetch: async (url, init = {}) => {
      calls.push({ url:String(url), init });
      if (String(url).includes('/rest/v1/lesson_content')) {
        if (options.rlsThrows) throw new Error('RLS unavailable');
        return options.rlsResponse || new Response(JSON.stringify(options.rlsRows || []), {
          status:200, headers:{ 'Content-Type':'application/json' }
        });
      }
      throw new Error('unexpected network request: ' + url);
    }
  };
  vm.runInNewContext(source.replace('export default {', 'globalThis.__worker = {'), context, {
    filename:'src/site-worker.js'
  });
  const env = {
    SUPABASE_URL: options.configured === false ? '' : 'https://project.supabase.co',
    SUPABASE_ANON_KEY: options.configured === false ? '' : 'sb_publishable_test',
    ASSETS:{
      async fetch(request){
        assets.push(request);
        return new Response('asset-content', { status:200 });
      }
    }
  };
  return { context, env, calls, assets };
}

function request(path, token) {
  const headers = {};
  if (token) headers.Authorization = 'Bearer ' + token;
  return new Request('https://allemand.bridrandomtv.workers.dev' + path, { headers });
}

for (const path of [
  '/assets/bdd/devoirs.json',
  '/assets/bdd/compositions.json',
  '/assets/bdd/annales.json',
  '/assets/bdd/corpus_rag_chunks.json',
  '/assets/bdd/corpus_rag_vectors.json'
]) {
  test('refuse sans JWT l’accès direct à ' + path, async () => {
    const h = harness();
    const response = await h.context.__worker.fetch(request(path + '?v=1'), h.env);
    assert.equal(response.status, 401);
    assert.equal(h.calls.length, 0);
    assert.equal(h.assets.length, 0);
  });
}

test('refuse les vecteurs PDF sans entitlement RLS', async () => {
  const h = harness({ rlsRows:[] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/corpus_rag_vectors.json','user-without-entitlement'), h.env);
  assert.equal(response.status,403);
  assert.equal(h.assets.length,0);
});

test('sert les vecteurs PDF uniquement après validation RLS', async () => {
  const h = harness({ rlsRows:[{ id:'visible-paid-lesson' }] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/corpus_rag_vectors.json','subscribed-user'), h.env);
  assert.equal(response.status,200);
  assert.equal(h.assets.length,1);
  assert.equal(h.assets[0].url,'https://allemand.bridrandomtv.workers.dev/assets/bdd/corpus_rag_vectors.json');
  assert.equal(h.assets[0].headers.get('Authorization'),'Bearer subscribed-user');
});

test('refuse un compte sans entitlement RLS pour les compositions', async () => {
  const h = harness({ rlsRows:[] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/compositions.json','valid-user-token'), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.length, 1);
  assert.equal(h.assets.length, 0);
  assert.match(h.calls[0].url, /free=eq\.false/);
  assert.equal(h.calls[0].init.headers.Authorization, 'Bearer valid-user-token');
});

test('sert les annales à un abonné validé par le RLS existant', async () => {
  const h = harness({ rlsRows:[{ id:'lesson-row-visible-to-subscriber' }] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/annales.json','active-user-token'), h.env);
  assert.equal(response.status, 200);
  assert.equal(h.assets.length, 1);
  assert.equal(h.assets[0].url, 'https://allemand.bridrandomtv.workers.dev/assets/bdd/annales.json');
  assert.equal(h.assets[0].headers.get('Authorization'), 'Bearer active-user-token');
});

test('refuse les chunks PDF sans entitlement RLS', async () => {
  const h = harness({ rlsRows:[] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/corpus_rag_chunks.json','user-without-entitlement'), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.assets.length, 0);
  assert.equal(h.calls[0].init.headers.Authorization, 'Bearer user-without-entitlement');
});

test('sert les chunks PDF uniquement après validation RLS', async () => {
  const h = harness({ rlsRows:[{ id:'visible-paid-lesson' }] });
  const response = await h.context.__worker.fetch(request('/assets/bdd/corpus_rag_chunks.json','subscribed-user'), h.env);
  assert.equal(response.status, 200);
  assert.equal(h.assets.length, 1);
  assert.equal(h.assets[0].url, 'https://allemand.bridrandomtv.workers.dev/assets/bdd/corpus_rag_chunks.json');
  assert.equal(h.assets[0].headers.get('Authorization'), 'Bearer subscribed-user');
});

test('échoue fermé si la configuration Supabase du Worker du site manque', async () => {
  const h = harness({ configured:false });
  const response = await h.context.__worker.fetch(request('/assets/bdd/compositions.json','active-user-token'), h.env);
  assert.equal(response.status, 503);
  assert.equal(h.calls.length, 0);
  assert.equal(h.assets.length, 0);
});

test('ne bloque pas le catalogue grammatical public', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request('/assets/bdd/grammaire.json'), h.env);
  assert.equal(response.status, 200);
  assert.equal(h.calls.length, 0);
  assert.equal(h.assets.length, 1);
});

test('les chargeurs de devoirs transmettent le JWT au Worker du site', () => {
  assert.match(devoirsSource, /CONTENT1\.authHeaders/);
  assert.match(devoirsSource, /headers:headers/);
  assert.match(devoirnoteSource, /CONTENT1\.authHeaders/);
  assert.match(devoirnoteSource, /cj\('assets\/bdd\/devoirs\.json',\s*true\)/);
});
