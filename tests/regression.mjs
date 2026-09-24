/* regression.mjs — verrou CI : 40+ questions réelles d'élèves doivent toutes
   obtenir une réponse (jamais « لا أعرف »). Exécuté par Node dans le pipeline. */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const store = {};
globalThis.window = globalThis;
globalThis.document = {
  addEventListener(){}, removeEventListener(){}, dispatchEvent(){},
  querySelector(){ return null; }, querySelectorAll(){ return []; },
  createElement(){ return { style:{}, classList:{ add(){}, remove(){} }, setAttribute(){}, appendChild(){} }; },
  body:{ appendChild(){} }
};
globalThis.localStorage = { getItem:k => (k in store ? store[k] : null),
  setItem:(k,v)=>{ store[k]=String(v); }, removeItem:k=>{ delete store[k]; } };
globalThis.sessionStorage = globalThis.localStorage;
globalThis.navigator = { language:'ar', onLine:true, userAgent:'node-ci' };
globalThis.CustomEvent = class { constructor(t,o){ this.type=t; this.detail=o&&o.detail; } };
globalThis.fetch = async u => {
  const rel = String(u).replace(/^https?:\/\/[^/]+\//,'').replace(/^\//,'').split('?')[0];
  const p = path.join(root, rel);
  if(!fs.existsSync(p)) return { ok:false, status:404, json:async()=>({}), text:async()=>'' };
  return { ok:true, status:200,
    json:async()=>JSON.parse(fs.readFileSync(p,'utf8')),
    text:async()=>fs.readFileSync(p,'utf8') };
};
vm.runInThisContext(read('rag.js'), { filename:'rag.js' });
const fn = globalThis.reponsePedagogique
  || (globalThis.RAG && (globalThis.RAG.reponsePedagogique || globalThis.RAG.repondre))
  || (globalThis.PROF && globalThis.PROF.repondre);
if(typeof fn !== 'function'){
  console.error('❌ régression : fonction de réponse introuvable (window.reponsePedagogique / RAG)');
  process.exit(1);
}
const qs = JSON.parse(read('tests/questions_regression.json'));
const fails = [];
for(const item of qs){
  let rep = '';
  try{ rep = await fn(item.q); }catch(e){ rep = ''; }
  if(rep && typeof rep === 'object') rep = rep.texte || rep.reponse || rep.rep || JSON.stringify(rep);
  rep = String(rep || '');
  if(!rep || rep.indexOf('لا أعرف') !== -1 || rep.indexOf('لا اعرف') !== -1)
    fails.push(item.q + '  →  ' + rep.slice(0, 70));
}
if(fails.length){
  console.error('❌ RÉGRESSION : ' + fails.length + ' question(s) élève sans réponse valide :');
  fails.forEach(f => console.error('   · ' + f));
  process.exit(1);
}
console.log('✅ Régression OK : ' + qs.length + ' questions élèves (ar/fr/darja/de) → toutes ont une réponse');
