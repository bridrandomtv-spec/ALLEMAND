/* ci/check-access.mjs — garde-fou d'accès + TEST DE FUITE (Node, sans réseau) */
import fs from 'node:fs';
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

if (fails.length) { console.log('❌ check-access : ' + fails.length + ' fuite(s)/défaut(s)'); fails.forEach(f => console.log('   - ' + f)); process.exit(1); }
console.log('✅ Accès : gratuit U1S1-S2 + quiz u1 · payant verrouillé sans Backend · cache ui_only inopérant · hors-ligne = gratuit seulement · démos rôles OK');
