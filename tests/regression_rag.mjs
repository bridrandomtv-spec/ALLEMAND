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
const matcher = globalThis.RAG && globalThis.RAG.matchOnto;
if (typeof matcher !== 'function') {
  console.log('::error::ONTO : matchOnto absent du contrat de test RAG');
  process.exit(1);
}
const ambiguous = await matcher('هاد الدرس');
const candidates = new Set((ambiguous && ambiguous.candidates) || []);
if (!ambiguous || ambiguous.ambiguous !== true
    || !candidates.has('summarize_lesson')
    || !candidates.has('explain_lesson')) {
  console.log('::error::ONTO : une égalité entre intentions doit provoquer une abstention');
  process.exit(1);
}
const unique = await matcher('شرحلي هاد الدرس');
if (!unique || unique.ambiguous || !unique.it || unique.it.intent !== 'explain_lesson') {
  console.log('::error::ONTO : une formulation non ambiguë doit conserver son intention');
  process.exit(1);
}
console.log('✅ ONTO : égalité détectée sans choix arbitraire ; intention unique conservée');
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

/* Garde de sécurité : un verbe du tableau local ne doit pas être révélé
   lorsque le contrôle d'accès manque ou que le catalogue ne rattache le
   verbe à aucune ressource pédagogique vérifiable. */
const savedFetch = globalThis.fetch;
const hadAccess = Object.prototype.hasOwnProperty.call(globalThis, 'ACCESS');
const savedAccess = globalThis.ACCESS;
try {
  delete globalThis.ACCESS;
  const withoutAccess = await fn('konjugiere mögen');
  if (!withoutAccess || withoutAccess.locked !== true) {
    throw new Error('conjugaison locale révélée sans contrôle ACCESS');
  }

  globalThis.fetch = async () => ({
    ok: false, status: 404,
    json: async () => ({}), text: async () => ''
  });
  globalThis.ACCESS = {
    refresh: async () => {},
    canAccessLesson: () => false,
    canAccessQuiz: () => false,
    entitlement: () => ({ ok: false }),
    paywall: () => {}
  };
  const withoutResource = await fn('konjugiere mögen');
  if (!withoutResource || withoutResource.locked !== true) {
    throw new Error('conjugaison locale révélée sans ressource vérifiable');
  }
  console.log('✅ RAG lock : conjugaison refusée sans ACCESS et sans ressource vérifiable');
} catch (e) {
  console.log('::error::RAG lock · ' + e.message);
  process.exitCode = 1;
} finally {
  globalThis.fetch = savedFetch;
  if (hadAccess) globalThis.ACCESS = savedAccess;
  else delete globalThis.ACCESS;
}

/* Lot 650 : les demandes portant sur une unité complète ne passent jamais
   sans preuve d'entitlement backend, même si le professeur cloud est ouvert. */
const priorAccess650 = globalThis.ACCESS;
try {
  delete globalThis.ACCESS;
  const noAccessUnit = await fn('explique unité 3');
  if (!noAccessUnit || noAccessUnit.locked !== true) {
    throw new Error('résumé d’unité révélé sans ACCESS');
  }
  const freeSummaryWithoutAccess = await fn('اشرح الوحدة 2');
  if (freeSummaryWithoutAccess && freeSummaryWithoutAccess.locked === true) {
    throw new Error('résumé explicitement gratuit bloqué à tort');
  }
  const noAccessRule = await fn('Explique le Genitiv.');
  if (!noAccessRule || noAccessRule.locked !== true) {
    throw new Error('règle Genitiv révélée localement sans ACCESS');
  }
  const noAccessArabicRule = await fn('اشرح التَّحْوِيلَ الاسْمِيَّ');
  if (!noAccessArabicRule || noAccessArabicRule.locked !== true) {
    throw new Error('règle arabe révélée localement malgré les diacritiques');
  }
  globalThis.ACCESS = {
    refresh: async () => {},
    entitlement: () => ({ ok:false, src:'backend' }),
    paywall: () => {}
  };
  const noEntitlementUnit = await fn('explique unité 3');
  if (!noEntitlementUnit || noEntitlementUnit.locked !== true) {
    throw new Error('résumé d’unité révélé sans entitlement actif');
  }
  const noEntitlementRule = await fn('Explique le Genitiv.');
  if (!noEntitlementRule || noEntitlementRule.locked !== true) {
    throw new Error('règle Genitiv révélée sans entitlement backend');
  }
  globalThis.uniteActive = () => ({ n:3 });
  delete globalThis.ACCESS;
  const activeUnitWithoutAccess = await fn('explique cette unité');
  if (!activeUnitWithoutAccess || activeUnitWithoutAccess.locked !== true) {
    throw new Error('explication de l’unité active révélée sans ACCESS');
  }
  globalThis.uniteActive = () => null;
  const lessonWithoutUnit = await fn('explique la séance 2');
  if (!lessonWithoutUnit || lessonWithoutUnit.locked !== true) {
    throw new Error('séance explicite révélée sans unité vérifiable ni ACCESS');
  }
  globalThis.ACCESS = {
    refresh: async () => {},
    entitlement: () => ({ ok:false, src:'backend' }),
    paywall: () => {}
  };
  globalThis.ACCESS.refresh = async () => { throw new Error('backend unavailable'); };
  const backendUnavailable = await fn('explique unité 3');
  if (!backendUnavailable || backendUnavailable.locked !== true) {
    throw new Error('résumé d’unité révélé quand le contrôle backend échoue');
  }
  console.log('✅ RAG lock : unité complète refusée sans ACCESS, sans entitlement et si le backend échoue');
} catch (e) {
  console.log('::error::RAG lock unité · ' + e.message);
  process.exitCode = 1;
} finally {
  if (priorAccess650 === undefined) delete globalThis.ACCESS;
  else globalThis.ACCESS = priorAccess650;
  delete globalThis.uniteActive;
}
