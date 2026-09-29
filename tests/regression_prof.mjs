/* regression_prof.mjs — couverture REELLE du moteur PROF (prof_core.js) sur SON contrat. */
import fs from 'node:fs';
import vm from 'node:vm';
const read = p => fs.readFileSync(p, 'utf8');
const data = JSON.parse(read('tests/questions_regression.json'));
const qs = data.questions || data.items || data;
const contrat = (data.meta && data.meta.moteur_prof) || [];
function defg(k, v){ try { Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true }); } catch(e){ globalThis[k] = v; } }
defg('window', globalThis);
vm.runInThisContext(read('prof_core.js'), { filename: 'prof_core.js' });
const P = globalThis.PROF;
if (!P || typeof P.trouver !== 'function') { console.log('::error::regression_prof : PROF.trouver absent'); process.exit(1); }
const fails = []; let ok = 0;
for (const i of contrat) {
  const q = (typeof qs[i] === 'string') ? qs[i] : (qs[i].q || qs[i].question);
  let e = null; let err = null;
  try { e = P.trouver(q); } catch(x){ err = x; }
  if (e && (e.r || e.texte || e.msg)) ok++;
  else fails.push('[' + i + '] ' + q + ' → ' + (err ? 'CRASH ' + err.message : 'aucun topic PROF'));
}
console.log('✅ PROF contrat : ' + ok + '/' + contrat.length + ' questions répondues par le moteur PROF');
if (fails.length) { fails.forEach(f => console.log('::error::REG-PROF · ' + f)); process.exit(1); }
