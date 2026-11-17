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
      if(String(url).includes('/rest/v1/subscriptions')){
        if(options.subscriptionThrows) throw new Error('subscription lookup failed');
        return options.subscriptionResponse || new Response(JSON.stringify(options.subscriptions || []), {
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
  const response = await h.context.__worker.fetch(request({ q:'Propose une méthode de révision efficace.' }, null), h.env);
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
    q:'Propose une méthode de révision efficace.',
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

test('accepte tout compte authentifié même sans abonnement actif', async () => {
  const h = harness({ authResponse:new Response(JSON.stringify({
    id:'user-free-123',
    user_metadata:{ plan:'free', subscription_status:'inactive' }
  }), { status:200, headers:{ 'Content-Type':'application/json' } }) });
  const response = await h.context.__worker.fetch(request({ q:'Propose une méthode de révision efficace.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.rep, 'Réponse pédagogique.');
  assert.equal(h.calls[0].url, 'https://project.supabase.co/auth/v1/user');
});

test('le chat direct app.js impose le même timeout de 25 s que ia.js', () => {
  assert.match(appSource, /setTimeout\(function\(\)\{ controller\.abort\(\); \}, 25000\)/);
  assert.match(appSource, /signal:controller\.signal/);
  assert.match(appSource, /finally\(function\(\)\{ clearTimeout\(timeout\); \}\)/);
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
    last = await h.context.__worker.fetch(request({ q:'Propose une méthode de révision efficace.' }), h.env);
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


test('le chat direct vérifie les cadenas avant le RAG et le Worker distant', () => {
  const start = appSource.indexOf('async function sendChat(v)');
  const end = appSource.indexOf('\nfunction ', start + 20);
  const body = appSource.slice(start, end > start ? end : start + 9000);
  const guard = body.indexOf('window.verifieAccesContenuIA(v)');
  const rag = body.indexOf('window.RAG.cherche(v)');
  const cloud = body.indexOf("fetch(proxy + '/ask'");
  assert.ok(guard >= 0, 'le contrôle des cadenas doit exister dans sendChat');
  assert.ok(rag < 0 || guard < rag, 'le contrôle doit précéder le RAG');
  assert.ok(cloud < 0 || guard < cloud, 'le contrôle doit précéder le Worker');
});

test('le RAG applique les cadenas avant les réponses pédagogiques locales', () => {
  const ragSource = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  assert.match(ragSource, /async function verifieAccesContenuIA\(question\)/);
  assert.match(ragSource, /const _lock = await verifieAccesContenuIA\(rawQuestion\)/);
  assert.match(ragSource, /ACCESS\.canAccessLesson\(target\.unit, target\.lesson\)/);
  assert.match(ragSource, /ACCESS\.canAccessQuiz\(quizUnit\)/);
  assert.match(ragSource, /type\.id === 'sharh' \|\| type\.id === 'murajaa'/);
  assert.match(ragSource, /window\.verifieAccesContenuIA = verifieAccesContenuIA/);
});

test('ACCESS résout les séances gratuites par niveau et refuse les listes vides', () => {
  const accessSource = fs.readFileSync(new URL('../access.js', import.meta.url), 'utf8');
  assert.match(accessSource, /if\(window\.getNiveauActif && window\.getNiveauActif\(\) === '3AS'\) niv = '3AS'/);
  assert.match(accessSource, /function isFreeLesson\(u, n\)\{ var l = freeUnitsFor\(u\)\[String\(u\)\]/);
  assert.match(accessSource, /canAccessUnit: function\(u\)\{ var l = freeUnitsFor\(u\)\[String\(u\)\]/);
});


test('le garde de cadenas distingue séance gratuite, séance payante, conjugaison et synthèse', async () => {
  const ragSource = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  const malakhiss = JSON.parse(fs.readFileSync(new URL('../assets/bdd/malakhiss.json', import.meta.url), 'utf8'));
  const questions = JSON.parse(fs.readFileSync(new URL('../assets/bdd/questions_eleve.json', import.meta.url), 'utf8'));
  const access = {
    refresh:async () => ({ ok:true }),
    entitlement:() => ({ ok:false, src:'backend' }),
    canAccessLesson:(unit, lesson) => unit === 1 && lesson <= 2,
    canAccessQuiz:unit => unit === 1,
    canAccessUnit:unit => unit === 1,
    paywall:() => {}
  };
  const windowStub = {
    ACCESS:access,
    getNiveauActif:() => '2AS',
    uniteActive:() => ({ n:1 }),
    SUBJECT:{ active:() => ({ id:'allemand', niveau:'2AS' }) }
  };
  const documentStub = { addEventListener:() => {}, querySelector:() => null };
  const fetchStub = async url => {
    const value = String(url).includes('malakhiss.json') ? malakhiss
      : String(url).includes('questions_eleve.json') ? questions
      : { unites:{} };
    return { ok:true, json:async() => value };
  };
  const context = { window:windowStub, document:documentStub, ACCESS:access, fetch:fetchStub,
    console, setTimeout, clearTimeout, Promise, String, Number, Array, Object, Math, RegExp };
  vm.runInNewContext(ragSource, context, { filename:'rag.js' });
  const guard = windowStub.verifieAccesContenuIA;
  assert.equal(typeof guard, 'function');
  const freeLesson = await guard('اشرح الحصة 1 الوحدة 1');
  assert.equal(freeLesson, null);
  const lockedLesson = await guard('اشرح الحصة 3 الوحدة 1');
  assert.equal(lockedLesson.locked, true);
  const lockedVerb = await guard('conjugaison sein');
  assert.equal(lockedVerb.locked, true);
  const lockedSummary = await guard('اشرح الوحدة 2');
  assert.equal(lockedSummary.locked, true);
  const freeBank = await guard('تمارين الوحدة 2');
  assert.equal(freeBank, null);
});


test('refuse côté Worker une conjugaison verrouillée pour un compte sans abonnement', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({ q:'conjugaison sein' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
  assert.equal(h.calls.filter(x => x.url.includes('/rest/v1/subscriptions')).length, 1);
  assert.equal(h.messages, null);
});

test('refuse aussi une demande d’explication d’une règle verrouillée sans mot « conjugaison »', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({ q:'Explique sein.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
});

test('un abonné actif conserve l'accès à une conjugaison verrouillée', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:null }] });
  const response = await h.context.__worker.fetch(request({ q:'conjugaison sein' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/subscriptions')), true);
});

test('refuse côté Worker une séance verrouillée et laisse passer les deux séances gratuites', async () => {
  const blocked = harness();
  const denied = await blocked.context.__worker.fetch(request({ q:'Explique la leçon 3 de l’unité 1.' }), blocked.env);
  assert.equal(denied.status, 403);
  const free = harness();
  const allowed = await free.context.__worker.fetch(request({ q:'Explique la leçon 1 de l’unité 1.' }), free.env);
  assert.equal(allowed.status, 200);
});

test('échoue fermé si la vérification read-only de l’abonnement est indisponible', async () => {
  const h = harness({ subscriptionThrows:true });
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.err, 'access-unavailable');
  assert.equal(h.messages, null);
});
