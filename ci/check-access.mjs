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


/* ── Phase 4 : paywall (statique + comportemental) ── */
const pwSrc = fs.existsSync('paywall.js') ? fs.readFileSync('paywall.js', 'utf8') : '';
const bilSrc = fs.readFileSync('billing.js', 'utf8');
if (!pwSrc) fails.push('3.4 : paywall.js absent');
else {
  if (!pwSrc.includes("dz:paywall")) fails.push('3.4 : paywall n\'écoute pas dz:paywall');
  if (!pwSrc.includes('فتح البرنامج الكامل')) fails.push('3.4 : CTA « فتح البرنامج الكامل » absent');
  if (!pwSrc.includes('paiement')) fails.push('3.4 : plans non lus depuis config.paiement');
  if (/(1\s?800|9\s?000|15\s?000)/.test(pwSrc)) fails.push('3.4 : prix codés en dur dans paywall.js (interdit)');
  if (!pwSrc.includes('dz_paywall_plan')) fails.push('3.4 : plan choisi non transmis à billing');
  if (!pwSrc.includes('🔐')) fails.push('3.4 : mention sécurité absente');
  if (!pwSrc.includes('pw-ret')) fails.push('3.4 : annonce du chemin de retour absente');
}
if (!/paywall\.js/.test(idx)) fails.push('3.4 : index.html ne charge pas paywall.js');
if (idx.indexOf('paywall.js') < idx.indexOf('billing.js')) fails.push('3.4 : paywall.js chargé avant billing.js');
if (!bilSrc.includes('PREPLAN')) fails.push('3.4 : billing.js ne pré-sélectionne pas le plan du paywall');
if (!sw.includes('paywall.js')) fails.push('3.4 : paywall.js absent du precache sw');
if (!fs.readFileSync('style.css', 'utf8').includes('.paywall{')) fails.push('3.4 : styles .paywall absents');
/* comportemental : ouverture sur événement + rendu depuis la config (prix stub) */
{
  const g3 = { console, setTimeout, clearTimeout };
  g3.window = g3; g3.navigator = { onLine: true };
  const st3 = {};
  g3.localStorage = { getItem: k => (k in st3 ? st3[k] : null), setItem: (k, v) => { st3[k] = String(v); }, removeItem: k => { delete st3[k]; } };
  g3.sessionStorage = { getItem: k => (k in st3 ? st3[k] : null), setItem: (k, v) => { st3[k] = String(v); }, removeItem: k => { delete st3[k]; } };
  const body3 = { children: [] , appendChild(o){ this.children.push(o); } };
  g3.document = {
    _h: {},
    addEventListener(t, f){ (this._h[t] = this._h[t] || []).push(f); },
    dispatchEvent(e){ (this._h[e.type] || []).forEach(f => f(e)); return true; },
    createElement(){ return { style: {}, classList: { add(){}, remove(){} }, _html: '',
      set innerHTML(v){ this._html = v; }, get innerHTML(){ return this._html; },
      appendChild(){}, remove(){}, addEventListener(){}, querySelectorAll(){ return []; },
      getAttribute(){ return null; }, setAttribute(){} }; },
    body: body3,
    getElementById(){ return null; }
  };
  g3.CustomEvent = class { constructor(t, o){ this.type = t; this.detail = (o || {}).detail; } };
  g3.fetch = () => Promise.resolve({ ok: true, json: async () => ({ paiement: { titulaire: 'T', ccp: 'C', baridimob: 'B',
    plans: [ { id: 'm1', label: '1 mois', prix: 1800, par_mois: 1800 },
             { id: 'm6', label: '6 mois', prix: 9000, par_mois: 1500, eco: '-17%' } ] } }) });
  g3.ACCESS = { entitlement: () => ({ ok: false, src: 'test', until: null }),
                trialFinished: () => true,
                getReturn: () => ({ view: 'seances', unite: 2, seance: 3 }) };
  g3.AUTH = { session: () => ({ role: 'eleve' }) };
  g3.go = () => {};
  const ctx3 = vm.createContext(g3);
  vm.runInContext(pwSrc || '// absent', ctx3);
  g3.document.dispatchEvent({ type: 'dz:paywall', detail: { type: 'seance', unite: 2, seance: 3 } });
  await new Promise(r => setTimeout(r, 120));
  const ov = body3.children[0];
  if (!ov) fails.push('3.4 : dz:paywall n\'ouvre aucun overlay');
  else {
    const h3 = ov.innerHTML || '';
    if (!h3.includes('فتح البرنامج الكامل')) fails.push('3.4 : overlay sans CTA');
    if (!h3.includes('9000')) fails.push('3.4 : overlay sans les prix de la config (rendu non config-driven)');
    if (!h3.includes('الوحدة 2 · الحصة 3')) fails.push('3.4 : overlay ne nomme pas la cible verrouillée');
    if (!h3.includes('الحصة 3')) fails.push('3.4 : chemin de retour non annoncé');
    if (!h3.includes('🔐')) fails.push('3.4 : overlay sans mention sécurité');
  }
}


/* ── Phase 5 : plans administrables + lien parent-enfant (décisions B & C) ── */
const sql5 = fs.existsSync('supabase/plans.sql') ? fs.readFileSync('supabase/plans.sql', 'utf8') : '';
for (const k of ['create table if not exists public.plans', 'child_links', 'child_active_entitlement',
                 'link_child', 'my_linked_children', 'on conflict (id) do nothing'])
  if (!sql5.includes(k)) fails.push('3.5 : plans.sql sans ' + k);
if ((sql5.match(/null,/g) || []).length < 6) fails.push('3.5 : prix prof/parent doivent rester NULL (décision B)');
if (sql5.includes('drop table')) fails.push('3.5 : plans.sql ne doit supprimer aucune table');
const adm5 = fs.readFileSync('admin.js', 'utf8');
const clo5 = fs.readFileSync('cloud.js', 'utf8');
const bil5 = fs.readFileSync('billing.js', 'utf8');
const pw5  = fs.readFileSync('paywall.js', 'utf8');
if (!adm5.includes('chargerPlansAdmin')) fails.push('3.5 : admin.js sans éditeur de plans');
if (!clo5.includes('link_child')) fails.push('3.5 : cloud.js sans lien parent-enfant');
if (!bil5.includes('window.BILLING_PLANS')) fails.push('3.5 : billing.js n expose pas BILLING_PLANS');
if (!pw5.includes('BILLING_PLANS')) fails.push('3.5 : paywall.js ne lit pas les plans de la table');
if (/prix_da:\s*(1800|9000|15000)/.test(adm5 + bil5 + pw5)) fails.push('3.5 : prix codés en dur côté client (interdit)');


/* ── Phase 6 : payment séparé de subscription + message arabe d'échec ── */
const pay6 = fs.existsSync('supabase/payments.sql') ? fs.readFileSync('supabase/payments.sql', 'utf8') : '';
for (const k of ['create table if not exists public.payments', 'enable row level security',
                 'own payments', 'create own payment', 'admin payments'])
  if (!pay6.includes(k)) fails.push('3.6 : payments.sql sans ' + k);
if (pay6.includes('drop table')) fails.push('3.6 : payments.sql ne doit supprimer aucune table');
const sb6 = fs.readFileSync('supabase/supabase.js', 'utf8');
for (const k of ['createPayment', 'myPayments', 'adminPayments', 'deciderSub'])
  if (!sb6.includes('function ' + k)) fails.push('3.6 : supabase.js sans ' + k);
const bil6 = fs.readFileSync('billing.js', 'utf8');
if (!bil6.includes('createPayment')) fails.push('3.6 : billing.js ne trace pas le payment à l\'envoi du reçu');
if (!bil6.includes('لم تكتمل عملية الدفع')) fails.push('3.6 : message arabe d\'échec absent de billing.js');
if (!bil6.includes('blMeth')) fails.push('3.6 : sélecteur CCP/BaridiMob absent de billing.js');
const adm6 = fs.readFileSync('admin.js', 'utf8');
if (!adm6.includes('deciderSub')) fails.push('3.6 : admin.js ne décide pas via deciderSub');
if (!adm6.includes('adminPayments')) fails.push('3.6 : admin.js n\'affiche pas les payments');
/* sécurité : un élève ne peut PAS se rendre actif lui-même (RLS + statut refus→en_attente) */
if (!sb6.includes("statut:'en_attente', preuve:''")) fails.push('3.6 : refus ne remet pas la sub en en_attente (retry impossible)');


/* ── Phase 7 : le contenu payant ne vit PLUS dans le domaine public ── */
const bp7 = JSON.parse(fs.readFileSync('assets/bdd/buch_pages.json', 'utf8'));
const pg7 = bp7.pages || bp7;
const corps7 = Object.keys(pg7).filter(k => /^\d+$/.test(k) && ((pg7[k].lignes || []).length || pg7[k].texte));
const lock7  = Object.keys(pg7).filter(k => /^\d+$/.test(k) && pg7[k].locked);
if (corps7.map(Number).sort((a, b) => a - b).join(',') !== '5,6,7,10,25')
  fails.push('3.7 : corps publics != [5,6,7,10,25] → ' + corps7.join(','));
if (lock7.length < 200) fails.push('3.7 : pages locked < 200 (' + lock7.length + ')');
if (!fs.existsSync('docs/private/buch_pages_full.json')) fails.push('3.7 : BACKUP docs/private/buch_pages_full.json absent');
const rag7 = fs.readFileSync('rag.js', 'utf8');
if (!rag7.includes('lesson_content')) fails.push('3.7 : rag.js ne lit pas lesson_content');
if (!rag7.includes('ACCESS.paywall')) fails.push('3.7 : rag.js ne déclenche pas le paywall sur page payante');
const app7 = fs.readFileSync('app.js', 'utf8');
if (!app7.includes('data-paypage') || !app7.includes('e.locked')) fails.push('3.7 : app.js sans carte 🔒 / bouton paypage');


/* ── Phase 8 : AR/RTL des écrans ajoutés (phases 3-7) ── */
const pw8  = fs.readFileSync('paywall.js', 'utf8');
const bil8 = fs.readFileSync('billing.js', 'utf8');
const clo8 = fs.readFileSync('cloud.js', 'utf8');
const adm8 = fs.readFileSync('admin.js', 'utf8');
if (!pw8.includes("p.label_ar ? p.label_ar + ' — '")) fails.push('3.8 : paywall n affiche pas le libellé arabe en premier');
if (!pw8.includes('dir="ltr"')) fails.push('3.8 : paywall sans isolation LTR (éco)');
const FR_INTERDITS = [
  ['billing.js', bil8, 'laufende Anfrage'], ['billing.js', bil8, "'1 mois'"],
  ['billing.js', bil8, 'Abonnement Premium'], ['billing.js', bil8, ' DA</div>'],
  ['cloud.js', clo8, 'Compte enfant lié'], ['cloud.js', clo8, 'aucun compte enfant'],
  ['admin.js', adm8, 'Plans abonnement'], ['admin.js', adm8, 'aucun payment'],
  ['admin.js', adm8, '<th>sub</th>'],
];
for (const [f, src8, fr] of FR_INTERDITS)
  if (src8.includes(fr)) fails.push('3.8 : ' + f + ' contient encore « ' + fr + ' »');
if (!bil8.includes('شهر واحد')) fails.push('3.8 : billing sans libellés de plans arabes');
if (!clo8.includes('ربط حساب الطفل')) fails.push('3.8 : cloud sans carte enfant arabe');
if (!adm8.includes('خطط الاشتراك')) fails.push('3.8 : admin sans titre plans arabe');


/* ── Phase 7bis : 3AS séparé du 2AS et verrouillé ── */
const b3 = fs.existsSync('assets/bdd/buch3as_pages.json') ? JSON.parse(fs.readFileSync('assets/bdd/buch3as_pages.json', 'utf8')) : null;
if (!b3) fails.push('3.7b : buch3as_pages.json absent');
else {
  const nums3 = Object.keys(b3).filter(k => /^\d+$/.test(k));
  if (nums3.length < 5) fails.push('3.7b : moins de 5 pages 3AS indexées');
  for (const k of nums3) {
    const e3 = b3[k];
    if (!e3.locked) fails.push('3.7b : page 3AS ' + k + ' non verrouillée');
    if ((e3.lignes || []).length || e3.texte) fails.push('3.7b : corps 3AS ' + k + ' dans le domaine public (interdit)');
  }
}
const sql3 = fs.existsSync('tools/seed_lesson_content_3as.sql') ? fs.readFileSync('tools/seed_lesson_content_3as.sql', 'utf8') : '';
if ((sql3.match(/insert into public.lesson_content/g) || []).length < 5) fails.push('3.7b : seed 3AS < 5 inserts');
if (sql3 && !sql3.includes("'3AS'")) fails.push('3.7b : seed 3AS sans level 3AS');
const rag7b = fs.readFileSync('rag.js', 'utf8');
if (!rag7b.includes('loadPages3as')) fails.push('3.7b : rag.js ne lit pas l index 3AS');
if (!rag7b.includes("eq('level'")) fails.push('3.7b : rag.js ne filtre pas lesson_content par level');
const app7b = fs.readFileSync('app.js', 'utf8');
if (!app7b.includes('window.getNiveauActif')) fails.push('3.7b : app.js n expose pas le niveau actif');
/* l'essai gratuit reste intact : U1 S1-S2 */
const cfg7b = JSON.parse(fs.readFileSync('assets/bdd/access_config.json', 'utf8'));
if (JSON.stringify(cfg7b.free.units) !== JSON.stringify({ '1': [1, 2] })) fails.push('3.7b : essai gratuit modifié (doit rester U1 S1-S2)');


/* ── Phase 7bis : aucun corps 3AS dans le domaine public ── */
const bp38 = fs.existsSync('assets/bdd/buch3as_pages.json') ? JSON.parse(fs.readFileSync('assets/bdd/buch3as_pages.json', 'utf8')) : null;
if (!bp38) fails.push('3.7b : buch3as_pages.json absent');
else {
  const pg8 = bp38.pages || bp38;
  const corps8 = Object.keys(pg8).filter(k => /^\d+$/.test(k) && ((pg8[k].lignes || []).length || pg8[k].texte));
  if (corps8.length) fails.push('3.7b : corps 3AS payants dans le domaine public : ' + corps8.join(','));
}
if (!fs.existsSync('tools/seed_lesson_content_3as_L4_p71_75.sql')) fails.push('3.7b : seed 3AS L4 p71-75 absent');


/* ── Phase 7ter : arbre du manuel 3AS = EXACTEMENT 8 Lektionen, plages figées ── */
const R3G = [[1,3,29],[2,31,48],[3,49,70],[4,71,92],[5,93,110],[6,111,127],[7,129,151],[8,153,175]];
const b3c = JSON.parse(fs.readFileSync('assets/bdd/buch3as_pages.json', 'utf8'));
const pg3c = b3c.pages || b3c;
const nums3c = Object.keys(pg3c).filter(k => /^\d+$/.test(k)).map(Number);
if (R3G.length !== 8) fails.push('3.9 : R3G != 8 Lektionen');
let cov3 = 0;
for (const [n3, a3, b3b] of R3G) {
  const in3 = nums3c.filter(p => p >= a3 && p <= b3b);
  if (!in3.length) fails.push('3.9 : Lektion ' + n3 + ' vide');
  if (in3.length && Math.min(...in3) !== a3) fails.push('3.9 : Lektion ' + n3 + ' min != ' + a3);
  if (in3.length && Math.max(...in3) > b3b) fails.push('3.9 : Lektion ' + n3 + ' max > ' + b3b);
  cov3 += in3.length;
  const u3 = new Set(in3.map(p => pg3c[String(p)].unite));
  if (u3.size !== 1 || ![...u3][0] !== n3 + 9 && [...u3][0] !== n3 + 9) {}
  if (u3.size !== 1 || [...u3][0] !== n3 + 9) fails.push('3.9 : Lektion ' + n3 + ' unite != ' + (n3 + 9));
}
if (cov3 !== nums3c.length) fails.push('3.9 : pages 3AS hors des 8 plages (' + (nums3c.length - cov3) + ')');
const buch3c = fs.readFileSync('buch.js', 'utf8');
if (!buch3c.includes('L3_PLAGES')) fails.push('3.9 : buch.js sans L3_PLAGES');
if (!buch3c.includes('buch3as_pages.json')) fails.push('3.9 : buch.js sans source buch3as_pages.json');
if (!buch3c.includes('reponseIA')) fails.push('3.9 : lecteur 3AS sans reponseIA (lecteur existant)');
if (!buch3c.includes('VOIX.parler')) fails.push('3.9 : lecteur 3AS sans VOIX.parler');


/* ── Phase 7quater : navigateur pages 2AS (9 Lektionen) + gate interactif L2/L3 ── */
const R2G = [[1,5,29],[2,31,55],[3,57,76],[4,77,101],[5,103,127],[6,129,149],[7,151,180],[8,181,205],[9,207,223]];
const bp2 = JSON.parse(fs.readFileSync('assets/bdd/buch_pages.json', 'utf8'));
const pg2 = bp2.pages || bp2;
const nums2 = Object.keys(pg2).filter(k => /^\d+$/.test(k)).map(Number);
if (R2G.length !== 9) fails.push('3.10 : RANGES2 != 9 Lektionen');
let cov2 = 0;
for (const [n2, a2, b2b] of R2G) {
  const in2 = nums2.filter(p => p >= a2 && p <= b2b);
  if (!in2.length) fails.push('3.10 : Lektion 2AS ' + n2 + ' vide');
  if (in2.length && Math.min(...in2) !== a2) fails.push('3.10 : Lektion 2AS ' + n2 + ' min != ' + a2);
  if (in2.length && Math.max(...in2) > b2b) fails.push('3.10 : Lektion 2AS ' + n2 + ' max > ' + b2b);
  cov2 += in2.length;
}
if (cov2 !== nums2.length) fails.push('3.10 : pages 2AS hors des 9 plages (' + (nums2.length - cov2) + ')');
const buch4 = fs.readFileSync('buch.js', 'utf8');
if (!buch4.includes('RANGES2')) fails.push('3.10 : buch.js sans navigateur pages 2AS (RANGES2)');
if (!buch4.includes('canAccessUnit')) fails.push('3.10 : gate interactif L2/L3 absent (canAccessUnit)');
if (!buch4.includes('buch_pages.json')) fails.push('3.10 : source pages 2AS absente (buch_pages.json)');
if (!buch4.includes('reponseIA')) fails.push('3.10 : lecteur 2AS sans reponseIA');


/* ── Phase 7quinquies : interactif 3AS L4→L8 — corrigés obligatoires ── */
for (const f3 of ['buch_3as_l4.json','buch_3as_l5.json','buch_3as_l6.json','buch_3as_l7.json','buch_3as_l8.json']) {
  const p34 = 'assets/bdd/' + f3;
  if (!fs.existsSync(p34)) { fails.push('3.11 : ' + f3 + ' absent (interactif 3AS)'); continue; }
  const j34 = JSON.parse(fs.readFileSync(p34, 'utf8'));
  const ex34 = j34.exos || [];
  if (ex34.length < 40) fails.push('3.11 : ' + f3 + ' < 40 Aufgaben (' + ex34.length + ')');
  if (!j34._meta || j34._meta.niveau !== '3AS') fails.push('3.11 : ' + f3 + ' _meta.niveau != 3AS');
  for (const k3 of ['objectifs','grammaire_objectifs','textes','vocab','tables']) {
    if (!Array.isArray(j34[k3]) || !j34[k3].length) fails.push('3.11 : ' + f3 + ' section ' + k3 + ' vide');
  }
  for (const x of ex34) {
    const okA = (x.g === 'prod') ? Array.isArray(x.checklist) && x.checklist.length >= 3
              : (x.a !== undefined && x.a !== null && x.a !== '');
    if (!x.g || !x.q || !okA) fails.push('3.11 : ' + f3 + ' exo ' + (x.id || '?') + ' sans corrigé/checklist');
    if (x.g === 'mcq' && (!Array.isArray(x.opts) || x.opts.length < 2 || x.a >= x.opts.length)) fails.push('3.11 : ' + f3 + ' mcq ' + x.id + ' opts/a incohérents');
    if (x.g === 'vf' && typeof x.a !== 'boolean') fails.push('3.11 : ' + f3 + ' vf ' + x.id + ' non booléen');
  }
  const ids34 = ex34.map(x => x.id);
  if (new Set(ids34).size !== ids34.length) fails.push('3.11 : ' + f3 + ' ids dupliqués');
}
const buch5 = fs.readFileSync('buch.js', 'utf8');
if (!buch5.includes('buch_3as_l4.json')) fails.push('3.11 : buch.js ne charge pas buch_3as_l4.json');
if (!buch5.includes('render3inter')) fails.push('3.11 : rendu interactif 3AS absent');

if (fails.length) { console.log('❌ check-access : ' + fails.length + ' fuite(s)/défaut(s)'); fails.forEach(f => console.log('   - ' + f)); process.exit(1); }
console.log('✅ Accès : gratuit U1S1-S2 + quiz u1 · payant verrouillé sans Backend · cache ui_only inopérant · hors-ligne = gratuit seulement · démos rôles OK');
