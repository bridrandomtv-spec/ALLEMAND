import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const workerSource = fs.readFileSync(new URL('../worker/ia-ask.js', import.meta.url), 'utf8');
const appSource = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const iaSource = fs.readFileSync(new URL('../ia.js', import.meta.url), 'utf8');
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyLTEyMyJ9.signature';
const ORIGIN = 'https://allemand.brid-randomtv.workers.dev';

function harness(options = {}){
  const calls = [];
  let messages = null;
  const context = {
    URL, Request, Response, Headers, TextDecoder, Uint8Array, AbortController,
    setTimeout, clearTimeout, Date, JSON, String,
    fetch: async (url, init = {}) => {
      calls.push({ url:String(url), init });
      if(String(url).includes('/auth/v1/user')){
        if(options.authThrows) throw new Error('network detail must not leak');
        return options.authResponse || new Response(JSON.stringify({ id:'user-123' }), {
          status:200, headers:{ 'Content-Type':'application/json' }
        });
      }
      return options.cloudflareResponse || new Response(JSON.stringify({
        success:true, result:{ response:'Réponse distante.' }
      }), { status:200, headers:{ 'Content-Type':'application/json' } });
    }
  };
  vm.runInNewContext(workerSource.replace('export default {', 'globalThis.__worker = {'),
    context, { filename:'worker/ia-ask.js' });
  const env = {
    SUPABASE_URL:'https://project.supabase.co',
    SUPABASE_ANON_KEY:'sb_publishable_test',
    AI:{
      async run(_model, input){
        messages = input.messages;
        return { response:'Réponse pédagogique.' };
      }
    }
  };
  return { context, env, calls, get messages(){ return messages; } };
}

function request(body, token = TOKEN){
  const headers = { 'Content-Type':'application/json', Origin:ORIGIN };
  if(token !== null) headers.Authorization = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
  return new Request('https://teacher.example/ask', {
    method:'POST', headers, body:typeof body === 'string' ? body : JSON.stringify(body)
  });
}

test('refuse /ask sans JWT avant tout appel Auth ou modèle', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }, null), h.env);
  assert.equal(response.status, 401);
  assert.equal(h.calls.length, 0);
});

test('refuse un en-tête Bearer mal formé', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }, 'Bearer invalid token'), h.env);
  assert.equal(response.status, 401);
  assert.equal(h.calls.length, 0);
});

test('refuse un JWT rejeté par Supabase Auth', async () => {
  const h = harness({ authResponse:new Response('{"message":"invalid"}', { status:401 }) });
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  assert.equal(response.status, 401);
  assert.equal(h.calls.length, 1);
});

test('échoue fermé si Supabase Auth est indisponible', async () => {
  const h = harness({ authThrows:true });
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.err, 'auth-unavailable');
  assert.equal(JSON.stringify(payload).includes('network detail'), false);
});

test('accepte un utilisateur Auth valide et marque le contexte comme non authentifié', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt.',
    ctx:'Extrait client : page 42'
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.rep, 'Réponse pédagogique.');
  assert.equal(h.calls[0].url, 'https://project.supabase.co/auth/v1/user');
  assert.equal(h.calls[0].init.headers.apikey, 'sb_publishable_test');
  assert.equal(h.calls[0].init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.match(h.messages[1].content, /NON AUTHENTIFIÉ/);
  assert.doesNotMatch(h.messages[1].content, /CONTEXTE VÉRIFIÉ/);
});

test('rejette les champs supplémentaires envoyés par le navigateur', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt.', user_id:'forged-user'
  }), h.env);
  assert.equal(response.status, 400);
});

test('rejette un corps supérieur à 8 Kio', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt.', ctx:'x'.repeat(9000)
  }), h.env);
  assert.equal(response.status, 413);
});

test('limite le quota à 20 appels par utilisateur et par minute dans un isolate', async () => {
  const h = harness();
  let last;
  for(let i=0;i<21;i++){
    last = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  }
  assert.equal(last.status, 429);
});

test('les parcours chat et voix transmettent le jeton Supabase et respectent le schéma q/ctx', () => {
  for(const source of [appSource, iaSource]){
    assert.match(source, /window\.SB/);
    assert.match(source, /getSession\(\)/);
    assert.match(source, /Authorization['"]?\s*:\s*['"]Bearer ['"]\s*\+\s*accessToken/);
    assert.doesNotMatch(source, /Authorization['"]?\s*:\s*.*localStorage/);
  }
  assert.doesNotMatch(iaSource, /JSON\.stringify\(\{\s*q\s*:\s*q\s*,\s*text\s*:/);
  assert.doesNotMatch(iaSource, /Content-Type['"]?\s*:\s*['"]text\/plain/);
});
