/* Lot 618 — ingestion réelle du catalogue grammaire dans BIBLIO.
   Exécution : node tests/biblio_grammar_runtime.mjs */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('biblio.js', 'utf8');
const window = {};
async function fetchAsset(url){
  try{
    const raw = fs.readFileSync(String(url), 'utf8');
    return { ok:true, json:async () => JSON.parse(raw) };
  }catch(e){ return { ok:false, json:async () => null }; }
}
vm.runInNewContext(source, { window, fetch:fetchAsset, console });
assert.equal(typeof window.BIBLIO?.stats, 'function', 'BIBLIO doit exposer stats');
const stats = await window.BIBLIO.stats();
assert.ok(stats.grammaire >= 86, 'les 86 règles doivent être indexées individuellement : ' + stats.grammaire);

const akkusativ = await window.BIBLIO.search('Akkusativ', 8);
assert.ok(akkusativ.some(x => x.src === 'grammaire' && /Akkusativ/i.test(x.titre + ' ' + x.texte)),
  'Akkusativ doit être retrouvable comme entrée de grammaire');
const wfragen = await window.BIBLIO.search('W-Fragen', 8);
assert.ok(wfragen.some(x => x.src === 'grammaire' && /W-Fragen/i.test(x.titre + ' ' + x.texte)),
  'W-Fragen doit être retrouvable comme entrée de grammaire');
const longQuestion = 'ما فهمتش قاعدة Akkusativ، علاش der تتبدل إلى den؟';
const hints = { intent:'explain_rule', confidence:0.85, entities:{ grammar:['akkusativ'] } };
const longHits = await window.BIBLIO.search(longQuestion, 4, hints);
assert.ok(longHits[0] && /Akkusativ/i.test(longHits[0].titre + ' ' + longHits[0].texte),
  'la notion grammaticale QUST doit rester en tête sur une question longue en darija');
const context = await window.BIBLIO.context(longQuestion, 1800, hints);
assert.match(context, /GRAMMAIRE/i, 'le contexte transmis doit citer la source grammaire');
assert.match(context, /Akkusativ/i, 'le contexte doit contenir la règle demandée');

console.log('PASS BIBLIO indexe ' + stats.grammaire + ' règles grammaticales séparées');
console.log('PASS recherche Akkusativ et W-Fragen');
console.log('PASS contexte documentaire étiqueté pour le cerveau IA');
