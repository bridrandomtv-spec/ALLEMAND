/* regression_rag.mjs — couverture REELLE de rag.js sur SON contrat uniquement. */
import fs from 'node:fs';
import vm from 'node:vm';
const read = p => fs.readFileSync(p, 'utf8');
const data = JSON.parse(read('tests/questions_regression.json'));
const qs = data.questions || data.items || data;
const contrat = (data.meta && data.meta.moteur_rag) || [];
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
const fn = globalThis.reponsePedagogique || (globalThis.RAG && globalThis.RAG.reponsePedagogique);
if (typeof fn !== 'function') { console.log('::error::regression_rag : reponsePedagogique absente'); process.exit(1); }
const valide = rep => { const t = typeof rep === 'string' ? rep : (rep && (rep.html || rep.texte || rep.reponse)) || ''; return !!t && t.indexOf('لا أعرف') === -1 && t.indexOf('لا اعرف') === -1; };
const fails = []; let ok = 0;
for (const i of contrat) {
  const q = (typeof qs[i] === 'string') ? qs[i] : (qs[i].q || qs[i].question);
  let rep = ''; let err = null;
  try { rep = await fn(q); } catch(e){ err = e; }
  if (valide(rep)) ok++; else fails.push('[' + i + '] ' + q + ' → ' + (err ? 'CRASH ' + err.message : 'vide/لا أعرف'));
}
console.log('✅ RAG contrat : ' + ok + '/' + contrat.length + ' questions répondues par rag.js');
if (fails.length) { fails.forEach(f => console.log('::error::REG-RAG · ' + f)); process.exit(1); }
