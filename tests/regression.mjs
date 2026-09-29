/* regression.mjs — runner UNION : intégrité de la partition + contrats + couverture mesurée. */
import fs from 'node:fs';
import vm from 'node:vm';
const read = p => fs.readFileSync(p, 'utf8');
const data = JSON.parse(read('tests/questions_regression.json'));
const qs = data.questions || data.items || data;
const meta = data.meta || {};
const CR = meta.moteur_rag || [], CP = meta.moteur_prof || [], CC = meta.moteur_cloud || [];
function defg(k, v){ try { Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true }); } catch(e){ globalThis[k] = v; } }
const NAV = { onLine: true, language: 'ar' };
const store = {};
defg('window', globalThis);
defg('navigator', NAV);
defg('localStorage', { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } });
defg('document', { addEventListener(){}, dispatchEvent(){ return true; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, getElementById(){ return null; }, createElement(){ return { style:{}, appendChild(){}, addEventListener(){} }; }, body:{ appendChild(){} } });
defg('CustomEvent', class { constructor(t, o){ this.type = t; this.detail = (o||{}).detail; } });
defg('fetch', async u => { const rel = String(u).replace(/^https?:\/\/[^/]+\//, '').replace(/^\//, ''); if (fs.existsSync(rel)) return { ok: true, json: async () => JSON.parse(fs.readFileSync(rel, 'utf8')), text: async () => fs.readFileSync(rel, 'utf8') }; return { ok: false, status: 404, json: async () => ({}), text: async () => '' }; });
defg('speechSynthesis', { speak(){}, cancel(){}, getVoices: () => [] });
vm.runInThisContext(read('rag.js'), { filename: 'rag.js' });
vm.runInThisContext(read('prof_core.js'), { filename: 'prof_core.js' });
const fn = globalThis.reponsePedagogique;
const P = globalThis.PROF;
const fails = [];
const n = qs.length;
const tous = [...new Set([...CR, ...CP, ...CC])];
if (tous.length !== n || CR.some(i => CP.includes(i) || CC.includes(i)) || CP.some(i => CC.includes(i)))
  fails.push('partition invalide : rag=' + CR.length + ' prof=' + CP.length + ' cloud=' + CC.length + ' total=' + n);
const valide = rep => { const t = typeof rep === 'string' ? rep : (rep && (rep.html || rep.texte || rep.reponse)) || ''; return !!t && t.indexOf('لا أعرف') === -1; };
let aR = 0, aP = 0, aU = 0;
const cloudRestants = [];
for (let i = 0; i < n; i++) {
  const q = (typeof qs[i] === 'string') ? qs[i] : (qs[i].q || qs[i].question);
  let r1 = false, r2 = false;
  try { r1 = valide(await fn(q)); } catch(e){}
  try { const e2 = P.trouver(q); r2 = !!(e2 && (e2.r || e2.texte || e2.msg)); } catch(e){}
  if (r1) aR++; if (r2) aP++; if (r1 || r2) aU++; else cloudRestants.push(i);
  if (CR.includes(i) && !r1) fails.push('contrat rag non couvert : [' + i + '] ' + q);
  if (CP.includes(i) && !r2) fails.push('contrat prof non couvert : [' + i + '] ' + q);
}
console.log('✅ UNION : rag répond ' + aR + '/' + n + ' · prof répond ' + aP + '/' + n + ' · union locale ' + aU + '/' + n + ' · tier cloud (LLM groundé) ' + cloudRestants.length);
if (cloudRestants.length) console.log('   tier cloud (ids) : ' + cloudRestants.join(','));
if (fails.length) { fails.slice(0, 12).forEach(f => console.log('::error::REG-UNION · ' + f)); process.exit(1); }
