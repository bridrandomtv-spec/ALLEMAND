/* Lot 616 — test runtime du routage multilingue et de l'isolation documentaire.
   Exécution : node tests/english_subject_runtime.mjs
   Le Worker et le réseau sont simulés; les fichiers pédagogiques proviennent du dépôt. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const iaSource = fs.readFileSync('ia.js', 'utf8');
const englishAssets = {
  'assets/bdd/english_pages.json': JSON.parse(fs.readFileSync('assets/bdd/english_pages.json', 'utf8')),
  'assets/bdd/english_devoirs.json': JSON.parse(fs.readFileSync('assets/bdd/english_devoirs.json', 'utf8')),
  'assets/bdd/english_malakhiss.json': JSON.parse(fs.readFileSync('assets/bdd/english_malakhiss.json', 'utf8'))
};

async function askForSubject(subject, question, expectedLanguage) {
  let workerBody = null;
  let localCalls = 0, biblioCalls = 0, ragCalls = 0;
  const response = value => ({ ok:true, status:200, json:async()=>value });
  const fetchMock = async (url, options={}) => {
    if (url === 'assets/bdd/config.json') return response({ ia_proxy:'https://mock.tutor.local' });
    if (englishAssets[url]) return response(englishAssets[url]);
    if (url === 'https://mock.tutor.local/ask') {
      workerBody = JSON.parse(options.body);
      return response({ ok:true, rep:'This is a grounded language-teaching response with a clear example.', answer_language:expectedLanguage });
    }
    throw new Error('URL inattendue dans le test : ' + url);
  };
  const windowMock = {
    CONTEXT:{ ctx:()=>({subject,level:subject==='anglais'?'1AS':'2AS',track:'langues'}) },
    AUTH:{ session:()=>null },
    reponsePedagogique:async()=>{ localCalls++; return 'Réponse locale allemande qui ne doit pas être utilisée.'; },
    BIBLIO:{ context:async()=>{ biblioCalls++; return 'extrait allemand'; } },
    RAG:{ cherche:async()=>{ ragCalls++; return {texte:'extrait allemand'}; } }
  };
  const documentMock = { addEventListener:()=>{}, getElementById:()=>null };
  const storageMock = { getItem:()=> '0', setItem:()=>{} };
  class AbortControllerMock { constructor(){ this.signal={}; } abort(){} }
  const run = new Function('window','document','localStorage','fetch','AbortController','setTimeout','clearTimeout',
    iaSource + '\nreturn window.reponseIA;');
  const reponseIA = run(windowMock,documentMock,storageMock,fetchMock,AbortControllerMock,()=>1,()=>{});
  const result = await reponseIA({
    raw_text:question, normalized_text:question, input_mode:'text',
    selected_language:'auto', detected_language:'', dialect:'unknown'
  });
  assert.ok(workerBody, 'le Worker doit recevoir une requête pour ' + subject);
  assert.equal(workerBody.subject, subject);
  assert.equal(workerBody.output_language, expectedLanguage);
  assert.equal(windowMock.__IA_LAST_LANGUAGE, expectedLanguage);
  assert.match(result, /grounded language-teaching response/);
  if (subject === 'anglais') {
    assert.equal(localCalls, 0, 'le moteur local allemand ne doit pas traiter l’anglais');
    assert.equal(biblioCalls, 0, 'BIBLIO allemande ne doit pas enrichir l’anglais');
    assert.equal(ragCalls, 0, 'RAG allemand ne doit pas enrichir l’anglais');
    assert.match(workerBody.ctx, /ANGLAIS — DEVOIR DV-EN-U1-01/, 'le devoir anglais correspondant doit être retrouvé');
    assert.doesNotMatch(workerBody.ctx, /extrait allemand|BIBLIOTHÈQUE ALLEMANDE/);
  } else {
    assert.equal(localCalls, 0, 'le moteur local allemand ne doit pas traiter ' + subject);
    assert.equal(biblioCalls, 0, 'BIBLIO allemande ne doit pas enrichir ' + subject);
    assert.equal(ragCalls, 0, 'RAG allemand ne doit pas enrichir ' + subject);
    assert.doesNotMatch(workerBody.ctx, /ANGLAIS —|extrait allemand/);
  }
  return {subject,language:workerBody.output_language,contextLength:workerBody.ctx.length};
}

const results = [];
results.push(await askForSubject('anglais','What is the present simple?','en'));
results.push(await askForSubject('espanol','¿Cuál es la diferencia entre ser y estar?','es'));
results.push(await askForSubject('italien','Qual è la differenza tra essere e avere?','it'));
for (const r of results) console.log('PASS ' + r.subject + ' → ' + r.language + ' · contexte ' + r.contextLength + ' caractères');
console.log('PASS aucune ressource locale allemande ne fuit vers anglais/espagnol/italien');
