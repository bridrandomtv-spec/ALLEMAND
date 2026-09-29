/* ci/check-access.mjs — garde-fou d'accès + TEST DE FUITE (Node, sans réseau) */
import fs from 'node:fs';
import vm from 'node:vm';
const fails = [];
const cfg = JSON.parse(fs.readFileSync('assets/bdd/access_config.json', 'utf8'));
const src = fs.readFileSync('access.js', 'utf8');
const idx = fs.readFileSync('index.html', 'utf8');
const sw  = fs.readFileSync('sw.js', 'utf8');

/* câblage */
if (!/<script src="access\.js"><\/script>/.test(idx)) fails.push('index.html : access.js non chargé');
if (!src.includes('./access.js') && !sw.includes('access.js')) fails.push('sw.js : access.js absent du precache');
if (!sw.includes('access_config.json')) fails.push('sw.js : access_config.json absent du precache (le gratuit doit marcher hors-ligne)');

/* configuration */
if (cfg.FREE_LESSONS_LIMIT !== 2) fails.push('config : FREE_LESSONS_LIMIT != 2');
const fu = (cfg.free && cfg.free.units && cfg.free.units['1']) || [];
if (fu.indexOf(1) === -1 || fu.indexOf(2) === -1) fails.push('config : U1 séances 1-2 non gratuites');
if (fu.indexOf(3) !== -1) fails.push('config : la séance 3 ne doit PAS être gratuite');

/* environnement stub : pas de réseau, pas de Backend.
   defineProperty : sous Node ≥21, navigator/fetch/CustomEvent sont des
   globaux en lecture seule — une affectation directe lèverait TypeError. */
function def(k, v){
  try { Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true }); }
  catch (e) { try { globalThis[k] = v; } catch (e2) { fails.push('stub ' + k + ' impossible'); } }
}
const NAV = { onLine: true };
const store = {};
const LS = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; }, clear: () => { for (const k in store) delete store[k]; } };
const sstore = {};
const SS = { getItem: k => (k in sstore ? sstore[k] : null), setItem: (k, v) => { sstore[k] = String(v); }, removeItem: k => { delete sstore[k]; } };
globalThis.sessionStorage = SS;
def('window', globalThis);
def('navigator', NAV);
def('localStorage', LS);
def('document', { addEventListener(){}, dispatchEvent(){ return true; } });
def('CustomEvent', class { constructor(t, o){ this.type = t; this.detail = (o || {}).detail; } });
def('fetch', () => Promise.reject(new Error('reseau coupe')));
(0, eval)(src);
const A = globalThis.ACCESS || globalThis.window.ACCESS;
if (!A) { console.log('❌ check-access : window.ACCESS absent'); process.exit(1); }

/* gratuit */
if (A.canAccessLesson(1, 1) !== true) fails.push('fuite inverse : U1S1 (gratuite) refusée');
if (A.canAccessLesson(1, 2) !== true) fails.push('fuite inverse : U1S2 (gratuite) refusée');
/* payant sans session */
if (A.canAccessLesson(1, 3) !== false) fails.push('FUITE : U1S3 payante accessible sans entitlement');
if (A.canAccessLesson(2, 1) !== false) fails.push('FUITE : U2S1 payante accessible sans entitlement');
if (A.canAccessQuiz(5) !== false) fails.push('FUITE : quiz u5 payant accessible');
if (A.canAccessCorrection() !== false) fails.push('FUITE : correction accessible sans entitlement');
if (A.canAccessProf('manage_classes') !== false) fails.push('FUITE : outil prof avancé accessible');
if (A.canAccessParent('full_reports') !== false) fails.push('FUITE : rapport parent avancé accessible');
/* démos gratuites des rôles */
if (A.canAccessProf('demo_lecon') !== true) fails.push('démo prof (demo_lecon) refusée à tort');
if (A.canAccessParent('demo_dashboard') !== true) fails.push('démo parent (demo_dashboard) refusée à tort');

/* TEST DE FUITE n°2 : faux entitlement en cache + hors-ligne → toujours verrouillé */
store['dz_ent_ui'] = JSON.stringify({ ok: true, until: '2999-01-01', ui_only: true });
NAV.onLine = false;
if (A.canAccessLesson(1, 3) !== false) fails.push('FUITE CACHE : le cache local déverrouille le payant');
if (A.canAccessLesson(2, 1) !== false) fails.push('FUITE CACHE : hors-ligne + cache = payant ouvert');
/* le gratuit, lui, reste ouvert hors-ligne */
if (A.canAccessLesson(1, 1) !== true) fails.push('le gratuit doit rester accessible hors-ligne');

/* TEST DE FUITE n°3 : refresh sans Backend → verrouillé, src explicite */
NAV.onLine = true;
const ent = await A.refresh();
if (ent.ok !== false) fails.push('FUITE : refresh sans Backend donne un entitlement actif');
if (['no-backend', 'backend-error', 'offline-locked', 'no-session'].indexOf(ent.src) === -1) fails.push('refresh : src non documenté : ' + ent.src);
if (A.canAccessLesson(2, 1) !== false) fails.push('FUITE : payant ouvert après refresh échoué');


/* ── Phase 3.2 : tests A–L (gates UI, chemin de retour, écran 🎉, config-driven) ── */
const appSrc = fs.readFileSync('app.js', 'utf8');
/* E : événement paywall émis avec sa cible */
let evt32 = null;
const origDispatch32 = globalThis.document.dispatchEvent;
globalThis.document.dispatchEvent = e => { evt32 = e; return true; };
A.setReturn({ view: 'seances', unite: 1, seance: 3 });
A.paywall({ type: 'seance', unite: 1, seance: 3 });
if (!evt32 || evt32.type !== 'dz:paywall') fails.push('3.2-E : événement dz:paywall non émis');
globalThis.document.dispatchEvent = origDispatch32;
/* J : chemin de retour lisible puis effaçable */
const ret32 = A.getReturn();
if (!ret32 || ret32.seance !== 3 || ret32.unite !== 1 || ret32.view !== 'seances') fails.push('3.2-J : chemin de retour non relisible');
A.clearReturn();
if (A.getReturn() !== null) fails.push('3.2-J : clearReturn n\'efface pas');
/* E/F : gate openSeance AVANT tout rendu de corps, sans fetch préalable */
const iOpen = appSrc.indexOf('function openSeance');
const iGate = appSrc.indexOf('ACCESS.canAccessLesson(uniteActive().n, n)', iOpen);
const iBody = appSrc.indexOf('box.innerHTML = h', iOpen);
if (iOpen === -1 || iGate === -1 || iBody === -1 || iGate > iBody) fails.push('3.2-E/F : gate openSeance absent ou placé après le rendu du corps');
const seg32 = appSrc.slice(iOpen, iGate === -1 ? iOpen + 500 : iGate);
if (/fetch\(/.test(seg32)) fails.push('3.2-F : fetch avant le gate dans openSeance');
if (appSrc.indexOf('ACCESS.setReturn', iOpen) === -1 || appSrc.indexOf('ACCESS.paywall', iOpen) === -1) fails.push('3.2-E/J : setReturn/paywall non appelés dans openSeance');
if (appSrc.indexOf('ACCESS.getReturn()') === -1) fails.push('3.2-J : chemin de retour jamais rejoué');
/* go() : gate canAccessView présent dans la fonction */
const iGo = appSrc.indexOf('function go(');
const iGoGate = appSrc.indexOf('ACCESS.canAccessView(view)', iGo);
const iGoNext = appSrc.indexOf('\nfunction ', iGo + 10);
if (iGoGate === -1 || (iGoNext !== -1 && iGoGate > iGoNext)) fails.push('3.2-E : go() ne passe pas par ACCESS.canAccessView');
/* K : écran 🎉 seulement à la fin RÉELLE du parcours gratuit défini par la config */
store['dz_de_seances_v1:u1'] = JSON.stringify({ done: [] });
if (A.trialFinished() !== false) fails.push('3.2-K : trialFinished vrai sans leçon faite');
store['dz_de_seances_v1:u1'] = JSON.stringify({ done: [1] });
if (A.trialFinished() !== false) fails.push('3.2-K : trialFinished vrai avec parcours partiel');
store['dz_de_seances_v1:u1'] = JSON.stringify({ done: [1, 2] });
if (A.trialFinished() !== true) fails.push('3.2-K : trialFinished faux après le parcours gratuit complet (config 1:[1,2])');
if (appSrc.indexOf('ACCESS.trialFinished()') === -1 || appSrc.indexOf('function showTrialDone') === -1) fails.push('3.2-K : écran 🎉 non câblé à la progression réelle');
store['dz_de_seances_v1:u1'] = JSON.stringify({ done: [] });
/* L : limites pilotées par la config, sans toucher à la logique (royaumes isolés) */
for (const [tag, units, attente] of [['lim1', { '1': [1] }, false], ['lim3', { '1': [1, 2, 3] }, true]]) {
  const g2 = { console };
  g2.window = g2; g2.navigator = { onLine: true };
  const st2 = {};
  g2.localStorage = { getItem: k => (k in st2 ? st2[k] : null), setItem: (k, v) => { st2[k] = String(v); }, removeItem: k => { delete st2[k]; } };
  g2.sessionStorage = g2.localStorage;
  g2.document = { addEventListener(){}, dispatchEvent(){ return true; }, getElementById(){ return null; }, createElement(){ return { style:{}, appendChild(){}, addEventListener(){}, remove(){} }; }, body:{ appendChild(){} } };
  g2.CustomEvent = class { constructor(t, o){ this.type = t; this.detail = (o||{}).detail; } };
  const cfg2 = JSON.parse(JSON.stringify(cfg)); cfg2.free.units = units;
  g2.fetch = () => Promise.resolve({ ok: true, json: async () => cfg2 });
  const ctx = vm.createContext(g2);
  vm.runInContext(src, ctx);
  await new Promise(r => setTimeout(r, 40));
  const A2x = ctx.window.ACCESS;
  if (!A2x) { fails.push('3.2-L : ACCESS absent du royaume ' + tag); continue; }
  if (A2x.canAccessLesson(1, 3) !== attente) fails.push('3.2-L : config ' + tag + ' → canAccessLesson(1,3)=' + A2x.canAccessLesson(1, 3) + ' attendu ' + attente);
  if (tag === 'lim1' && A2x.canAccessLesson(1, 1) !== true) fails.push('3.2-L : lim1 casse le gratuit U1S1');
}
/* paid_views : gating de vue entière par config, vide par défaut */
if (typeof A.canAccessView !== 'function') fails.push('3.2 : ACCESS.canAccessView absent');
else if (A.canAccessView('accueil') !== true) fails.push('3.2 : vue non payante bloquée à tort');

if (fails.length) { console.log('❌ check-access : ' + fails.length + ' fuite(s)/défaut(s)'); fails.forEach(f => console.log('   - ' + f)); process.exit(1); }
console.log('✅ Accès : gratuit U1S1-S2 + quiz u1 · payant verrouillé sans Backend · cache ui_only inopérant · hors-ligne = gratuit seulement · démos rôles OK');
