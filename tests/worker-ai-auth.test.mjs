import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const workerSource = fs.readFileSync(new URL('../worker/ia-ask.js', import.meta.url), 'utf8');
const appSource = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const iaSource = fs.readFileSync(new URL('../ia.js', import.meta.url), 'utf8');
function loadCorpusDocumentResolvers(){
  const start = iaSource.indexOf('  function corpusDocumentResource(question){');
  const end = iaSource.indexOf('  function officialDocumentResource(question){', start);
  assert.ok(start >= 0 && end > start, 'corpus document/search resolvers must exist');
  const sandbox = {};
  vm.runInNewContext(iaSource.slice(start, end)
    + '; globalThis.resolveDocument = corpusDocumentResource; globalThis.resolveSearch = corpusSearchResource;', sandbox);
  return { document:sandbox.resolveDocument, search:sandbox.resolveSearch };
}
function loadOfficialDocumentResolver(){
  const start = iaSource.indexOf('  function officialDocumentResource(question){');
  const end = iaSource.indexOf('function exerciseBankResource(question){', start);
  assert.ok(start >= 0 && end > start, 'officialDocumentResource must exist');
  const sandbox = {};
  vm.runInNewContext(iaSource.slice(start, end) + '; globalThis.resolve = officialDocumentResource;', sandbox);
  return sandbox.resolve;
}

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
      if(String(url).includes('/rest/v1/lesson_content')){
        if(options.lessonContentThrows) throw new Error('lesson content lookup failed');
        if(options.lessonContentByPage){
          const page = new URL(String(url)).searchParams.get('page')?.replace('eq.','');
          return new Response(JSON.stringify(options.lessonContentByPage[page] || []), {
            status:200, headers:{ 'Content-Type':'application/json' }
          });
        }
        return options.lessonContentResponse || new Response(JSON.stringify(options.lessonContent || []), {
          status:200, headers:{ 'Content-Type':'application/json' }
        });
      }
      if(String(url).includes('/unite3as1_free.js')){
        if(options.freeLessonThrows) throw new Error('free lesson lookup failed');
        return options.freeLessonResponse || new Response(options.freeLessonText || 'window.UNITES_3AS_A = [{meta:{duree_totale:120},seances:[{n:1},{n:2}]}];', {
          status:200, headers:{ 'Content-Type':'text/javascript' }
        });
      }
      if(String(url).includes('/assets/bdd/malakhiss.json')){
        if(options.freeSummaryThrows) throw new Error('free summary lookup failed');
        return options.freeSummaryResponse || new Response(JSON.stringify(options.freeSummaryData || {
          malakhiss:[
            { id:'MK-2AS-U7', niveau:'2AS', unite:7, titre_de:'2AS summary U7', idee:'Résumé libre 2AS.' },
            { id:'m07', niveau:'3AS', unite:7, titre_de:'3AS summary U1', idee:'Résumé libre 3AS unité 1.' },
            { id:'m08', niveau:'3AS', unite:8, titre_de:'3AS summary U2', idee:'Résumé libre 3AS unité 2.' }
          ]
        }), { status:200, headers:{ 'Content-Type':'application/json' } });
      }

      if(String(url).includes('/unite10.js')){
        return options.paidUnit10Response || new Response(options.paidUnit10Source || "const UNITE10_META = { n:10, niveau:'3AS', de:'Wissenschaft und Technologie' }; const SEANCES_U10 = [{n:1,de:'PAID UNIT FOUR SESSION ONE'},{n:2,de:'PAID UNIT FOUR SESSION TWO'}];", {
          status:200, headers:{ 'Content-Type':'text/javascript' }
        });
      }
      if(String(url).includes('/unites3as_a.js')){
        return options.paidUnitResponse || new Response(options.paidUnitSource || "const U3AS_1 = { meta:{n:1,niveau:'3AS',de:'Unit One'}, seances:[{n:1,de:'FREE SESSION ONE'},{n:2,de:'FREE SESSION TWO'},{n:3,de:'PAID SESSION THREE',gram:{t:'Relativsätze'}},{n:4,de:'PAID SESSION FOUR'}] };", {
          status:200, headers:{ 'Content-Type':'text/javascript' }
        });
      }
      if(String(url).includes('/assets/bdd/corpus_rag_chunks.json')){
        if(options.corpusDocumentResponse) return options.corpusDocumentResponse;
        return new Response(JSON.stringify(options.corpusDocumentData || {
          version:1,
          documents:[{ id:'pdf-0123456789abcdef', title:'Cours allemand autorisé',
            license:'production_propre', rights_confirmed:true }],
          chunks:[
            { id:'pdf-0123456789abcdef-p1-c0', document_id:'pdf-0123456789abcdef',
              page:1, part:0, text:'Der Perfekt wird mit haben oder sein und dem Partizip II gebildet.' },
            { id:'pdf-0123456789abcdef-p2-c0', document_id:'pdf-0123456789abcdef',
              page:2, part:0, text:'Die Familie und die Schule sind wichtige Themen.' }
          ]
        }), { status:200, headers:{ 'Content-Type':'application/json' } });
      }
      if(String(url).includes('/assets/bdd/compositions.json') || String(url).includes('/assets/bdd/annales.json')){
        if(options.officialDocumentResponse) return options.officialDocumentResponse;
        return new Response(JSON.stringify(options.officialDocumentData || { items:[
          { id:'CP-2023-2-0312', type:'composition', titre:'Sujet environnement', titre_de:'Umwelt und Natur', niveau:'2AS', unite:15, unite_de:'Sich vorstellen', annee:2023, source:'MEN', tags:['Umwelt'], sujet:'Sujet officiel sur Umwelt.', corrige:'Corrigé détaillé.', parties:[] }
        ] }), { status:200, headers:{ 'Content-Type':'application/json' } });
      }
      if(String(url).includes('/assets/bdd/contenu_original.json')){
        if(options.freeBankThrows) throw new Error('free bank lookup failed');
        return options.freeBankResponse || new Response(JSON.stringify(options.freeBankData || {
          B_exercices:[
            { id:'b01', niveau:'2AS', comp:'conjugaison', q:'Ich ___ müde.', opts:['bin','bist'], a:0, why:'ich → bin.' },
            { id:'b11', niveau:'3AS', comp:'vocabulaire', q:'Die Identität bedeutet …', opts:['Identität','Haus'], a:0, why:'Vocabulaire 3AS.' },
            { id:'b12', niveau:'3AS', comp:'Perfekt', q:'Wir ___ gelernt.', opts:['haben','hat'], a:0, why:'Perfekt 3AS.' }
          ]
        }), { status:200, headers:{ 'Content-Type':'application/json' } });
      }      return options.cloudflareResponse || new Response(JSON.stringify({
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

test('accepte un utilisateur Auth valide mais ne transmet aucun contexte client au modèle', async () => {
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
  assert.equal(h.messages[1].content, 'Propose une méthode de révision efficace.');
  assert.doesNotMatch(h.messages[1].content, /page 42|NON AUTHENTIFIÉ|CONTEXTE VÉRIFIÉ/);
});

test('ignore un extrait de leçon verrouillée injecté dans ctx avec une question générique', async () => {
  const h = harness();
  const secret = 'CONTENU PAYANT CONFIDENTIEL — explication complète du Perfekt';
  const response = await h.context.__worker.fetch(request({
    q:'Peux-tu me proposer une méthode de révision ?',
    ctx:secret
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(h.messages[1].content, 'Peux-tu me proposer une méthode de révision ?');
  assert.doesNotMatch(h.messages[1].content, /CONTENU PAYANT CONFIDENTIEL|Perfekt/);
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/subscriptions')), false);
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
  assert.match(ragSource, /window\.verifieAccesContenuIA = verifieAccesContenuIA/);
});

test('les pages verrouillées ne sont jamais révélées depuis l’index public via un entitlement client falsifiable', () => {
  const ragSource = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
  assert.doesNotMatch(ragSource, /if\(e && e\.locked && \(e\.lignes \|\| e\.texte\)\)/);
  assert.match(ragSource, /\.eq\('subject', 'allemand'\)\.eq\('page', \+pg\[1\]\)\.eq\('level'/);
  assert.match(ragSource, /Le corps vient uniquement[\s\S]*?filtrée par RLS/);
});

test('ACCESS mappe les identifiants visibles 3AS 10–19 vers les clés gratuites 1–10', async () => {
  const accessSource = fs.readFileSync(new URL('../access.js', import.meta.url), 'utf8');
  const sandbox = {
    window:{ getNiveauActif:() => '3AS' },
    navigator:{ onLine:true },
    fetch:async () => new Response(JSON.stringify({
      free:{ units:{ '1':[1,2] }, units_3as:{ '1':[1,2] }, quizzes:['u1'], devoirs:[], features:[] }
    }), { status:200, headers:{ 'Content-Type':'application/json' } })
  };
  vm.runInNewContext(accessSource, sandbox, { filename:'access.js' });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(sandbox.window.ACCESS.isFreeLesson(10, 1), true);
  assert.equal(sandbox.window.ACCESS.isFreeLesson(10, 2), true);
  assert.equal(sandbox.window.ACCESS.isFreeLesson(10, 3), false);
  assert.equal(sandbox.window.ACCESS.isFreeLesson(11, 1), false);
  assert.equal(sandbox.window.ACCESS.canAccessUnit(10), true);
  assert.equal(sandbox.window.ACCESS.canAccessUnit(11), false);
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
  const freeSummary = await guard('اشرح الوحدة 2');
  assert.equal(freeSummary, null);
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

test('le Worker verrouille toute conjugaison générique sans ressource pédagogique vérifiée', async () => {
  for (const q of ['Konjugiere arbeiten.', 'Conjugate bleiben in the present tense.', 'كيفاش نصرف arbeiten؟']) {
    const h = harness();
    const response = await h.context.__worker.fetch(request({ q }), h.env);
    const payload = await response.json();
    assert.equal(response.status, 403, q);
    assert.equal(payload.err, 'content-locked', q);
    assert.equal(h.calls.filter(x => x.url.includes('/rest/v1/subscriptions')).length, 1, q);
    assert.equal(h.messages, null, q);
  }
});

test('le Worker refuse une demande de séance numérotée sans ressource vérifiable', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1.'
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.messages, null);
});

test('une séance gratuite ne court-circuite pas le verrou d’une conjugaison rattachée à une séance payante', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Conjugaison sein unité 1 séance 1'
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
  assert.equal(h.messages, null);
});

test('refuse les règles grammaticales du programme absentes de l’ancienne liste, même avec un sélecteur gratuit falsifié', async () => {
  const cases = [
    { q:'Explique le Genitiv.', resource:{ type:'free_summary', level:'3AS', unit:1 } },
    { q:'Explain Nomen-Verb-Verbindungen.', resource:{ type:'free_exercise_bank', level:'3AS' } },
    { q:'اشرح التحويل الاسمي.', resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:1 } },
    { q:'Explique le Genitiv.', resource:{ type:'book_page', page:42, level:'2AS' } },
    { q:'Explique le Genitiv.', resource:{ type:'book_pages', pages:[42], level:'2AS' } },
    { q:'Explique le Genitiv.', resource:{ type:'unit_lesson', level:'3AS', unit:2, lesson:1 } }
  ];
  for (const item of cases) {
    const h = harness();
    const response = await h.context.__worker.fetch(request(item), h.env);
    const payload = await response.json();
    assert.equal(response.status, 403, item.q);
    assert.equal(payload.err, 'content-locked', item.q);
    assert.equal(h.messages, null, item.q);
    assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/malakhiss.json') || x.url.includes('/assets/bdd/contenu_original.json') || x.url.includes('/unite3as1_free.js')), false, item.q);
  }
});

test('refuse aussi une demande d’explication d’une règle verrouillée sans mot « conjugaison »', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
});

test('refuse les explications de règles verrouillées formulées en Darija arabe et Arabizi', async () => {
  for (const q of [
    '3lach ma fhemtch Perfekt?',
    'علاش ما فهمتش Perfekt؟',
    'ما فهمتش Perfekt',
    'fassarli Dativ',
    'شرحلي Perfekt',
    'Was ist Perfekt?',
    'What is Perfekt?'
  ]) {
    const h = harness();
    const response = await h.context.__worker.fetch(request({ q }), h.env);
    const payload = await response.json();
    assert.equal(response.status, 403, q);
    assert.equal(payload.err, 'content-locked', q);
    assert.equal(h.messages, null, q);
  }
});

test('refuse une conjugaison verrouillée demandée en Darija/Arabizi', async () => {
  for (const q of ['kifach nsarref sein?', 'كيفاش نصرف sein؟']) {
    const h = harness();
    const response = await h.context.__worker.fetch(request({ q }), h.env);
    const payload = await response.json();
    assert.equal(response.status, 403, q);
    assert.equal(payload.err, 'content-locked', q);
    assert.equal(h.messages, null, q);
  }
});

test("un abonné actif conserve l'accès à une conjugaison verrouillée", async () => {
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
  const allowed = await free.context.__worker.fetch(request({
    q:'Explique la leçon 1 de l’unité 1.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:1 }
  }), free.env);
  assert.equal(allowed.status, 200);
  const free2 = harness();
  const allowed2 = await free2.context.__worker.fetch(request({
    q:'Explique la leçon 2 de l’unité 1.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:2 }
  }), free2.env);
  assert.equal(allowed2.status, 200);
});

test('échoue fermé si la vérification read-only de l’abonnement est indisponible', async () => {
  const h = harness({ subscriptionThrows:true });
  const response = await h.context.__worker.fetch(request({ q:'Explique le Perfekt.' }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.err, 'access-unavailable');
  assert.equal(h.messages, null);
});

test('les demandes verrouillées sont elles aussi soumises au quota avant la lecture d’abonnement', async () => {
  const h = harness();
  let last;
  for(let i=0;i<21;i++){
    last = await h.context.__worker.fetch(request({ q:'conjugaison sein' }), h.env);
  }
  assert.equal(last.status, 429);
  assert.equal(h.calls.filter(x => x.url.includes('/rest/v1/subscriptions')).length, 20);
});

test('récupère une page du manuel côté Worker via JWT et RLS, sans utiliser ctx client', async () => {
  const h = harness({ lessonContent:[{ titre:'Perfekt', body:'Das Perfekt wird mit haben oder sein gebildet.' }] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette page.',
    ctx:'TEXTE CLIENT FALSIFIÉ',
    resource:{ type:'book_page', page:42, level:'2AS' }
  }), h.env);
  const payload = await response.json();
  const lookup = h.calls.find(x => x.url.includes('/rest/v1/lesson_content'));
  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.ok(lookup);
  assert.match(lookup.url, /subject=eq\.allemand/);
  assert.match(lookup.url, /page=eq\.42/);
  assert.match(lookup.url, /level=eq\.2AS/);
  assert.equal(lookup.init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.match(h.messages[1].content, /CONTENU PÉDAGOGIQUE AUTORISÉ/);
  assert.match(h.messages[1].content, /Das Perfekt wird mit haben oder sein gebildet/);
  assert.doesNotMatch(h.messages[1].content, /TEXTE CLIENT FALSIFIÉ/);
});

test('refuse une page dont le RLS ne retourne aucun contenu', async () => {
  const h = harness({ lessonContent:[] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette page.',
    resource:{ type:'book_page', page:42, level:'2AS' }
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
  assert.equal(h.messages, null);
});

test('refuse un identifiant de page falsifié hors des bornes du manuel', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette page.',
    resource:{ type:'book_page', page:999, level:'2AS' }
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.equal(payload.err, 'invalid-resource');
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/lesson_content')), false);
});

test('échoue fermé si la lecture RLS de lesson_content est indisponible', async () => {
  const h = harness({ lessonContentThrows:true });
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette page.',
    resource:{ type:'book_page', page:42, level:'3AS' }
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 503);
  assert.equal(payload.err, 'access-unavailable');
  assert.equal(h.messages, null);
});

test('le fichier public 3AS ne contient que les deux séances gratuites de l’unité 1', () => {
  const freeSource = fs.readFileSync(new URL('../unite3as1_free.js', import.meta.url), 'utf8');
  const sandbox = { window:{} };
  vm.runInNewContext(freeSource, sandbox);
  const units = sandbox.window.UNITES_3AS_A;
  assert.equal(units.length, 1);
  assert.equal(units[0].meta.n, 1);
  assert.equal(units[0].meta.niveau, '3AS');
  assert.equal(units[0].meta.duree_totale, 120);
  assert.deepEqual(Array.from(units[0].seances, s => s.n), [1, 2]);
  assert.equal(units[0].devoir, null);
  assert.equal(units[0].corrige, null);
  assert.doesNotMatch(freeSource, /Staatsbürgerschaft|Leben in der Gesellschaft|Konsolidierung|Évaluation/i);
  assert.match(appSource, /unite3as1_free\.js/);
  assert.match(appSource, /'unite3as1_free\.js','unite2\.js'/);
});

test('lessonResource résout les séances 2AS vers toutes leurs pages RLS et les séances 3AS vers leur ressource bornée', () => {
  const start = iaSource.indexOf('  function lessonResource(question){');
  const end = iaSource.indexOf('  function summaryResource(question){', start);
  assert.ok(start >= 0 && end > start);
  const fn = iaSource.slice(start, end);
  function resolve(level, activeUnit, question, extras={}){
    const sandbox = {
      window:{
        getNiveauActif:() => level,
        uniteActive:() => ({ n:activeUnit }),
        ...extras.window
      },
      SEANCES_U1:extras.SEANCES_U1
    };
    vm.runInNewContext(fn + '\nresult = lessonResource(' + JSON.stringify(question) + ');', sandbox);
    return JSON.parse(JSON.stringify(sandbox.result));
  }
  assert.deepEqual(resolve('2AS',1,'Explique la séance 1.',{
    SEANCES_U1:[{n:1,pages:[5,6]},{n:2,pages:[7,10,25]}]
  }),{ type:'book_pages', pages:[5,6], level:'2AS' });
  assert.deepEqual(resolve('2AS',2,'Explique la séance 1.',{
    window:{ SEANCES_U2:[{n:1,page:31}] }
  }),{ type:'book_page', page:31, level:'2AS' });
  assert.deepEqual(resolve('3AS',10,'Explique la séance 1.'),{
    type:'free_unit_lesson', level:'3AS', unit:1, lesson:1
  });
  assert.deepEqual(resolve('3AS',13,'Explique la séance 1.'),{
    type:'unit_lesson', level:'3AS', unit:4, lesson:1
  });
});

test('le client transmet des sélecteurs de page RLS et de séance gratuite 3AS', () => {
  assert.ok(iaSource.includes('async function pageResource(question)'));
  assert.ok(iaSource.includes('if(!entry) return null;'));
  assert.ok(iaSource.includes("if(level === '2AS')"));
  assert.ok(iaSource.includes("window['SEANCES_U' + unit]"));
  assert.ok(iaSource.includes("type:'book_page', page:pages[0], level:'2AS'"));
  assert.ok(iaSource.includes("type:'book_pages', pages:pages, level:'2AS'"));
  assert.doesNotMatch(iaSource, /entry\.locked !== true/);
  assert.ok(iaSource.includes('function lessonResource(question)'));
  assert.ok(iaSource.includes("type:'free_unit_lesson', level:'3AS', unit:1"));
  assert.ok(iaSource.includes("type:'unit_lesson', level:'3AS', unit:unit"));
  assert.ok(iaSource.includes('function summaryResource(question)'));
  assert.ok(iaSource.includes("type:'free_summary', level:level, unit:unit"));
  assert.ok(iaSource.includes('function exerciseBankResource(question)'));
  assert.ok(iaSource.includes('function officialDocumentResource(question)'));
  assert.ok(iaSource.includes("type:'official_document', collection:collection"));
  assert.ok(iaSource.includes("type:'free_exercise_bank', level:level"));
  assert.ok(iaSource.includes('await pageResource(q) || lessonResource(q) || summaryResource(q) || exerciseBankResource(q)'));
  assert.ok(iaSource.includes('resource: resource'));
});

test('le Worker récupère toutes les pages gratuites d’une séance 2AS via RLS', async () => {
  const h = harness({ lessonContentByPage:{
    '5':[{ titre:'L1 p5', body:'Ich heiße Amira.' }],
    '6':[{ titre:'L1 p6', body:'Das deutsche Alphabet.' }]
  }});
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 1 en 2AS.',
    resource:{ type:'book_pages', pages:[5,6], level:'2AS' }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /PAGE 5/);
  assert.match(h.messages[1].content, /PAGE 6/);
  assert.match(h.messages[1].content, /Ich heiße Amira/);
  assert.match(h.messages[1].content, /Das deutsche Alphabet/);
  assert.equal(h.calls.filter(x => x.url.includes('/rest/v1/lesson_content')).length, 2);
});

test('le Worker peut transmettre une page gratuite 2AS via RLS pour une séance de l’unité 1', async () => {
  const h = harness({ lessonContent:[{ titre:'L1 p5 — Guten Tag', body:'Ich heiße Amira. Ich komme aus Algerien.' }] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 1 en 2AS.',
    resource:{ type:'book_page', page:5, level:'2AS' }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /PAGE 5/);
  assert.match(h.messages[1].content, /Ich heiße Amira/);
});

test('le Worker récupère côté serveur uniquement le contenu gratuit 3AS unité 1 séances 1–2', async () => {
  const freeSource = 'window.UNITES_3AS_A = [{meta:{n:1,niveau:"3AS",duree_totale:120},seances:[{n:1},{n:2}]}];';
  const h = harness({ freeLessonText:freeSource });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 10 en 3AS.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:1 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url === 'https://allemand.brid-randomtv.workers.dev/unite3as1_free.js'));
  assert.match(h.messages[1].content, /CONTENU PÉDAGOGIQUE AUTORISÉ — SOURCE GRATUITE PUBLIQUE/);
  assert.ok(h.messages[1].content.includes(freeSource));
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/subscriptions')), false);
});

test('une autre unité 3AS ne devient pas gratuite par falsification du sélecteur unité 1', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 11 en 3AS.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:1 }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.some(x => x.url.includes('/unite3as1_free.js')), false);
  assert.equal(h.messages, null);
});

test('le Worker récupère le résumé gratuit 3AS unité 1 via le bon enregistrement m07', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Donne-moi le résumé de l’unité 1 en 3AS.',
    resource:{ type:'free_summary', level:'3AS', unit:1 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url === 'https://allemand.brid-randomtv.workers.dev/assets/bdd/malakhiss.json'));
  assert.match(h.messages[1].content, /RÉSUMÉ GRATUIT — 3AS, UNITÉ 1/);
  assert.match(h.messages[1].content, /3AS summary U1/);
  assert.doesNotMatch(h.messages[1].content, /2AS summary U7|3AS summary U2/);
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/subscriptions')), false);
});

test('le Worker distingue les résumés 2AS et 3AS malgré les numéros d’unité qui se chevauchent', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Résumé de l’unité 7 en 2AS.',
    resource:{ type:'free_summary', level:'2AS', unit:7 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /2AS summary U7/);
  assert.doesNotMatch(h.messages[1].content, /3AS summary U1|3AS summary U2/);
});

test('le Worker refuse un résumé hors des bornes pédagogiques configurées', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Résumé de cette unité.',
    resource:{ type:'free_summary', level:'3AS', unit:11 }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/malakhiss.json')), false);
  assert.equal(h.messages, null);
});

test('le Worker récupère la banque générale gratuite filtrée sur le niveau 3AS', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Donne-moi des exercices de l’unité 10 en 3AS.',
    resource:{ type:'free_exercise_bank', level:'3AS' }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url === 'https://allemand.brid-randomtv.workers.dev/assets/bdd/contenu_original.json'));
  assert.match(h.messages[1].content, /BANQUE GÉNÉRALE D’EXERCICES GRATUITE/);
  assert.match(h.messages[1].content, /b11|Die Identität/);
  assert.doesNotMatch(h.messages[1].content, /b01|Ich ___ müde/);
  assert.equal(h.calls.some(x => x.url.includes('/rest/v1/subscriptions')), false);
});

test('la banque libre ne déverrouille pas un exercice rattaché à une unité payante', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique un exercice de l’unité 11 en 3AS.',
    resource:{ type:'free_exercise_bank', level:'3AS' }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/contenu_original.json')), false);
  assert.equal(h.messages, null);
});

test('le Worker refuse un niveau non reconnu pour la banque libre', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Donne-moi des exercices.',
    resource:{ type:'free_exercise_bank', level:'1AS' }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/contenu_original.json')), false);
  assert.equal(h.messages, null);
});

test('ia.js résout les identifiants exacts de compositions et annales', () => {
  const resolve = loadOfficialDocumentResolver();
  assert.deepEqual(JSON.parse(JSON.stringify(resolve('Corrige le sujet CP-2023-2-0312.'))), {
    type:'official_document', collection:'compositions', id:'CP-2023-2-0312'
  });
  assert.deepEqual(JSON.parse(JSON.stringify(resolve('Explique AN-2022-3-0558.'))), {
    type:'official_document', collection:'annales', id:'AN-2022-3-0558'
  });
  assert.equal(resolve('Explique un exercice sur Umwelt.'), null);
});

test('le Worker récupère un document officiel exact via le Worker du site avec le JWT', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique le sujet CP-2023-2-0312 et son corrigé.',
    resource:{ type:'official_document', collection:'compositions', id:'CP-2023-2-0312' }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url.includes('/assets/bdd/compositions.json')), JSON.stringify(h.calls));
  const call = h.calls.find(x => x.url.includes('/assets/bdd/compositions.json'));
  assert.equal(call.init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.match(h.messages[1].content, /CP-2023-2-0312/);
  assert.match(h.messages[1].content, /Corrigé détaillé/);
  assert.doesNotMatch(h.messages[1].content, /OTHER-PRIVATE-DOCUMENT/);
});

test('le Worker refuse un document officiel si le Worker du site signale un verrou', async () => {
  const h = harness({ officialDocumentResponse:new Response('{"error":"abonnement_requis"}', { status:403 }) });
  const response = await h.context.__worker.fetch(request({
    q:'Corrige le sujet CP-2023-2-0312.',
    resource:{ type:'official_document', collection:'compositions', id:'CP-2023-2-0312' }
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
  assert.equal(h.messages, null);
});


test('ia.js résout un identifiant PDF et déclenche une recherche naturelle sans identifiant', () => {
  const resolvers = loadCorpusDocumentResolvers();
  assert.deepEqual(JSON.parse(JSON.stringify(resolvers.document('Explique le PDF pdf-0123456789ABCDEF.'))), {
    type:'corpus_document', id:'pdf-0123456789abcdef'
  });
  assert.equal(resolvers.document('Explique ce document.'), null);
  assert.deepEqual(JSON.parse(JSON.stringify(resolvers.search('Explique le Perfekt dans les documents PDF.'))), { type:'corpus_search' });
  assert.deepEqual(JSON.parse(JSON.stringify(resolvers.search('اشرح لي قاعدة Perfekt في الملفات'))), { type:'corpus_search' });
  assert.equal(resolvers.search('Explique le Perfekt.'), null);
});

test('le Worker récupère les chunks PDF côté serveur avec JWT et limite le contexte', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt dans le PDF pdf-0123456789abcdef.',
    resource:{ type:'corpus_document', id:'pdf-0123456789abcdef' }
  }), h.env);
  assert.equal(response.status, 200);
  const call = h.calls.find(x => x.url.includes('/assets/bdd/corpus_rag_chunks.json'));
  assert.ok(call);
  assert.equal(call.init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.match(h.messages[1].content, /CONTENU PÉDAGOGIQUE AUTORISÉ — CORPUS PDF/);
  assert.match(h.messages[1].content, /Perfekt/);
  assert.doesNotMatch(h.messages[1].content, /Die Familie und die Schule/);
});

test('le Worker recherche naturellement dans tous les PDF autorisés sans identifiant technique', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }], corpusDocumentData:{
    documents:[
      { id:'pdf-0123456789abcdef', title:'Grammaire Perfekt', license:'cc_by', rights_confirmed:true },
      { id:'pdf-aaaaaaaaaaaaaaaa', title:'Identité et école', license:'production_propre', rights_confirmed:true },
      { id:'pdf-bbbbbbbbbbbbbbbb', title:'Document utilisateur', license:'document_utilisateur', rights_confirmed:true }
    ],
    chunks:[
      { document_id:'pdf-0123456789abcdef', page:4, text:'Das Perfekt wird mit haben oder sein und dem Partizip II gebildet.' },
      { document_id:'pdf-aaaaaaaaaaaaaaaa', page:2, text:'Die Familie und die Schule sind wichtige Themen.' },
      { document_id:'pdf-bbbbbbbbbbbbbbbb', page:1, text:'Das Perfekt wird mit haben oder sein gebildet. Unberechtigtes Dokument.' }
    ]
  }});
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt avec haben oder sein.',
    resource:{ type:'corpus_search' }
  }), h.env);
  assert.equal(response.status, 200);
  const call = h.calls.find(x => x.url.includes('/assets/bdd/corpus_rag_chunks.json'));
  assert.ok(call);
  assert.equal(call.init.headers.Authorization, 'Bearer ' + TOKEN);
  assert.match(h.messages[1].content, /Grammaire Perfekt/);
  assert.match(h.messages[1].content, /Das Perfekt wird mit haben oder sein/);
  assert.doesNotMatch(h.messages[1].content, /Unberechtigtes Dokument|Document utilisateur/);
});

test('les alias arabes et français ne contournent pas les règles grammaticales verrouillées', async () => {
  for (const q of ['اشرح الماضي المركب.', 'اشرح المَاضِي المُرَكَّب.', 'اشرح المآضي المركب.', 'Explique le passé composé.', 'اشرح حالة الجر.', 'Explique le passif.']) {
    for (const resource of [
      { type:'free_summary', level:'3AS', unit:1 },
      { type:'book_page', page:5, level:'2AS' }
    ]) {
      const h = harness();
      const response = await h.context.__worker.fetch(request({ q, resource }), h.env);
      const payload = await response.json();
      assert.equal(response.status, 403, q);
      assert.equal(payload.err, 'content-locked', q);
      assert.equal(h.messages, null, q);
    }
  }
});

test('la recherche PDF relie les formulations arabes et françaises aux termes allemands', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }], corpusDocumentData:{
    documents:[
      { id:'pdf-0123456789abcdef', title:'Grammaire Perfekt', license:'cc_by', rights_confirmed:true },
      { id:'pdf-aaaaaaaaaaaaaaaa', title:'Präsens', license:'production_propre', rights_confirmed:true }
    ],
    chunks:[
      { document_id:'pdf-0123456789abcdef', page:4, text:'Das Perfekt wird mit haben oder sein und dem Partizip II gebildet.' },
      { document_id:'pdf-aaaaaaaaaaaaaaaa', page:2, text:'Das Präsens beschreibt Handlungen in der Gegenwart.' }
    ]
  }});
  const response = await h.context.__worker.fetch(request({
    q:'اِشْرَح الماضي المُرَكَّب في ملفات PDF.',
    resource:{ type:'corpus_search' }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /Grammaire Perfekt/);
  assert.match(h.messages[1].content, /Das Perfekt wird mit haben oder sein/);
  assert.doesNotMatch(h.messages[1].content, /Das Präsens beschreibt/);
});

test('la recherche naturelle PDF refuse tout accès si le Worker du site bloque le corpus', async () => {
  const h = harness({ corpusDocumentResponse:new Response('{"error":"abonnement_requis"}', { status:403 }) });
  const response = await h.context.__worker.fetch(request({
    q:'Explique le Perfekt dans les documents PDF.',
    resource:{ type:'corpus_search' }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.messages, null);
});

test('la recherche naturelle PDF refuse un sélecteur avec identifiant ou champ forgé', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique ce document.',
    resource:{ type:'corpus_search', id:'pdf-0123456789abcdef' }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.messages, null);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/corpus_rag_chunks.json')), false);
});

test('le Worker refuse un PDF verrouillé par le Worker du site avant le modèle', async () => {
  const h = harness({ corpusDocumentResponse:new Response('{"error":"abonnement_requis"}', { status:403 }) });
  const response = await h.context.__worker.fetch(request({
    q:'Explique le PDF pdf-0123456789abcdef.',
    resource:{ type:'corpus_document', id:'pdf-0123456789abcdef' }
  }), h.env);
  const payload = await response.json();
  assert.equal(response.status, 403);
  assert.equal(payload.err, 'content-locked');
  assert.equal(h.messages, null);
});

test('le Worker refuse un PDF sans licence autorisée', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }], corpusDocumentData:{
    documents:[{ id:'pdf-0123456789abcdef', title:'Livre éditeur', license:'document_utilisateur', rights_confirmed:true }],
    chunks:[{ document_id:'pdf-0123456789abcdef', page:1, text:'Contenu privé suffisamment long.' }]
  }});
  const response = await h.context.__worker.fetch(request({
    q:'Explique le PDF pdf-0123456789abcdef.',
    resource:{ type:'corpus_document', id:'pdf-0123456789abcdef' }
  }), h.env);
  assert.equal(response.status, 404);
  assert.equal(h.messages, null);
});

test('le Worker rejette un sélecteur PDF falsifié avec champ supplémentaire', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique ce PDF.',
    resource:{ type:'corpus_document', id:'pdf-0123456789abcdef', url:'https://evil.example/file.pdf' }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.messages, null);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/corpus_rag_chunks.json')), false);
});

test('le Worker rejette un sélecteur de document officiel falsifié', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Corrige ce sujet.',
    resource:{ type:'official_document', collection:'compositions', id:'AN-2023-2-0559', extra:'forged' }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.calls.some(x => x.url.includes('/assets/bdd/compositions.json') || x.url.includes('/assets/bdd/annales.json')), false);
  assert.equal(h.messages, null);
});

test('le Worker extrait une séance 3AS payante après validation de l’abonnement et du Worker du site', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 3 de l’unité 1 en 3AS.',
    resource:{ type:'unit_lesson', level:'3AS', unit:1, lesson:3 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url === 'https://allemand.brid-randomtv.workers.dev/unites3as_a.js'));
  assert.match(h.messages[1].content, /PAID SESSION THREE/);
  assert.doesNotMatch(h.messages[1].content, /PAID SESSION FOUR/);
  assert.match(h.messages[1].content, /CONTENU PÉDAGOGIQUE AUTORISÉ/);
});

test('le parseur extrait une séance réelle de unites3as_a.js sans inclure les autres séances', async () => {
  const paidUnitSource = fs.readFileSync(new URL('../unites3as_a.js', import.meta.url), 'utf8');
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }], paidUnitSource });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 3 de l’unité 1 en 3AS.',
    resource:{ type:'unit_lesson', level:'3AS', unit:1, lesson:3 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /Partizip I und II als Adjektiv/);
  assert.doesNotMatch(h.messages[1].content, /Textverständnis : «Identität in zwei Kulturen»|Konsolidierung \+ Évaluation/);
});

test('un compte gratuit ne reçoit jamais une séance 3AS payante', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 3 de l’unité 1 en 3AS.',
    resource:{ type:'unit_lesson', level:'3AS', unit:1, lesson:3 }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.some(x => x.url.includes('/unites3as_a.js')), false);
  assert.equal(h.messages, null);
});

test('le contrôle RLS du Worker du site bloque aussi un sélecteur de séance sans contexte explicite', async () => {
  const h = harness({ paidUnitResponse:new Response('{"error":"abonnement_requis"}', { status:403 }) });
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette séance.',
    resource:{ type:'unit_lesson', level:'3AS', unit:2, lesson:1 }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.some(x => x.url.includes('/unites3as_a.js')), true);
  assert.equal(h.messages, null);
});

test('le Worker refuse les unités 3AS hors des bornes du RAG serveur', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1.',
    resource:{ type:'unit_lesson', level:'3AS', unit:11, lesson:1 }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.calls.some(x => x.url.includes('/unites3as_a.js')), false);
  assert.equal(h.messages, null);
});

test('le parseur extrait une vraie séance depuis unite10.js sans inclure les autres séances', async () => {
  const paidUnit10Source = fs.readFileSync(new URL('../unite10.js', import.meta.url), 'utf8');
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }], paidUnit10Source });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 4 en 3AS.',
    resource:{ type:'unit_lesson', level:'3AS', unit:4, lesson:1 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.match(h.messages[1].content, /Wortschatz: Wissenschaft und Technik/);
  assert.doesNotMatch(h.messages[1].content, /de:'Passiv mit Modalverben'|de:'Kausal- und Finalsätze'/);
});

test('le Worker extrait une séance 3AS des fichiers individuels des unités 4–10', async () => {
  const h = harness({ subscriptions:[{ statut:'actif', fin:'2099-12-31T00:00:00Z' }] });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 4 en 3AS.',
    resource:{ type:'unit_lesson', level:'3AS', unit:4, lesson:1 }
  }), h.env);
  assert.equal(response.status, 200);
  assert.ok(h.calls.some(x => x.url === 'https://allemand.brid-randomtv.workers.dev/unite10.js'));
  assert.match(h.messages[1].content, /PAID UNIT FOUR SESSION ONE/);
  assert.doesNotMatch(h.messages[1].content, /PAID UNIT FOUR SESSION TWO/);
});

test('le Worker refuse un sélecteur gratuit 3AS falsifié hors unité 1 séances 1–2', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique cette leçon.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:2, lesson:1 }
  }), h.env);
  assert.equal(response.status, 400);
  assert.equal(h.calls.some(x => x.url.includes('/unite3as1_free.js')), false);
  assert.equal(h.messages, null);
});

test('une question sur une séance verrouillée reste refusée même avec un sélecteur gratuit falsifié', async () => {
  const h = harness();
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 3 de l’unité 1 en 3AS.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:2 }
  }), h.env);
  assert.equal(response.status, 403);
  assert.equal(h.calls.some(x => x.url.includes('/unite3as1_free.js')), false);
  assert.equal(h.messages, null);
});

test('le Worker échoue fermé si l’artefact gratuit 3AS est indisponible', async () => {
  const h = harness({ freeLessonThrows:true });
  const response = await h.context.__worker.fetch(request({
    q:'Explique la séance 1 de l’unité 1 en 3AS.',
    resource:{ type:'free_unit_lesson', level:'3AS', unit:1, lesson:1 }
  }), h.env);
  assert.equal(response.status, 503);
  assert.equal(h.messages, null);
});

test('le quota est appliqué avant toute lecture RLS du document', async () => {
  const h = harness({ lessonContent:[{ titre:'Page', body:'Contenu autorisé.' }] });
  let last;
  for(let i=0;i<21;i++){
    last = await h.context.__worker.fetch(request({
      q:'Explique cette page.',
      resource:{ type:'book_page', page:42, level:'2AS' }
    }), h.env);
  }
  assert.equal(last.status, 429);
  assert.equal(h.calls.filter(x => x.url.includes('/rest/v1/lesson_content')).length, 20);
});
