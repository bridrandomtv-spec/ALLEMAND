/* ci/check-parcours.mjs — MATRICE COMPLÈTE des parcours (phases 9 → 13)
   élève / prof / parent × gratuit / abonné / expiré + renouvellement sans perte
   + tentatives de contournement (cache forgé, hors-ligne). */
import fs from 'node:fs';
import vm from 'node:vm';
const src = fs.readFileSync('access.js', 'utf8');
const cfg = JSON.parse(fs.readFileSync('assets/bdd/access_config.json', 'utf8'));
const fails = []; let nok = 0;
function check(label, cond){ if (cond) { nok++; console.log('   ✅ ' + label); } else { fails.push(label); console.log('   ❌ ' + label); } }
const DAY = 86400000;
const FUT = new Date(Date.now() + 30 * DAY).toISOString();
const PAS = new Date(Date.now() - 3 * DAY).toISOString();

function realm(role, subs, rpcChild, store){
  const st = store || {};
  const g = { console };
  g.window = g; g.navigator = { onLine: true };
  const LS = { getItem: k => (k in st ? st[k] : null), setItem: (k, v) => { st[k] = String(v); }, removeItem: k => { delete st[k]; } };
  g.localStorage = LS; g.sessionStorage = LS;
  g.document = { addEventListener(){}, dispatchEvent(){ return true; }, getElementById(){ return null; },
    createElement(){ return { style:{}, classList:{ add(){}, remove(){} }, appendChild(){}, remove(){}, addEventListener(){},
      set innerHTML(v){ this._h = v; }, get innerHTML(){ return this._h || ''; }, querySelectorAll(){ return []; }, getAttribute(){ return null; } }; },
    body:{ appendChild(){} } };
  g.CustomEvent = class { constructor(t, o){ this.type = t; this.detail = (o || {}).detail; } };
  g.fetch = () => Promise.resolve({ ok: true, json: async () => cfg });
  g.AUTH = { session: () => ({ role: role }) };
  g.SB = { me: async () => ({ id: 'user-' + role }),
           mySubs: async () => (subs || []),
           sb: async () => ({ rpc: async (n) => ({ data: (n === 'child_active_entitlement' ? !!rpcChild : false) }) }) };
  vm.createContext(g);
  vm.runInContext(src, g);
  return g;
}

console.log('── phase 9 : élève ──');
{ const g = realm('eleve', []); const A = g.window.ACCESS; await A.refresh();
  check('9.1 élève gratuit : U1S1 ouverte', A.canAccessLesson(1, 1) === true);
  check('9.2 élève gratuit : U1S2 ouverte', A.canAccessLesson(1, 2) === true);
  check('9.3 élève gratuit : U1S3 verrouillée (paywall)', A.canAccessLesson(1, 3) === false);
  check('9.4 élève gratuit : unité 2 verrouillée', A.canAccessUnit(2) === false);
  check('9.5 élève gratuit : quiz u5 verrouillé', A.canAccessQuiz(5) === false);
  check('9.6 élève gratuit : correction verrouillée', A.canAccessCorrection() === false); }
{ const g = realm('eleve', [{ id: 1, statut: 'actif', fin: FUT }]); const A = g.window.ACCESS; await A.refresh();
  check('9.7 élève abonné : U1S3 ouverte', A.canAccessLesson(1, 3) === true);
  check('9.8 élève abonné : unité 2 ouverte', A.canAccessUnit(2) === true);
  check('9.9 élève abonné : quiz ouvert', A.canAccessQuiz(5) === true);
  check('9.10 élève abonné : correction ouverte', A.canAccessCorrection() === true); }
{ const g = realm('eleve', [{ id: 2, statut: 'actif', fin: PAS }]); const A = g.window.ACCESS; await A.refresh();
  check('9.11 élève expiré : U1S1 reste ouverte', A.canAccessLesson(1, 1) === true);
  check('9.12 élève expiré : payant verrouillé', A.canAccessLesson(1, 3) === false); }

console.log('── phase 10 : professeur ──');
{ const g = realm('prof', []); const A = g.window.ACCESS; await A.refresh();
  check('10.1 prof gratuit : démo leçon ouverte', A.canAccessProf('demo_lecon') === true);
  check('10.2 prof gratuit : démo dashboard ouverte', A.canAccessProf('demo_dashboard') === true);
  check('10.3 prof gratuit : gestion de classes verrouillée', A.canAccessProf('manage_classes') === false);
  check('10.4 prof gratuit : stats complètes verrouillées', A.canAccessProf('stats_completes') === false); }
{ const g = realm('prof', [{ id: 3, statut: 'actif', fin: FUT }]); const A = g.window.ACCESS; await A.refresh();
  check('10.5 prof abonné : gestion de classes ouverte', A.canAccessProf('manage_classes') === true);
  check('10.6 prof abonné : stats complètes ouvertes', A.canAccessProf('stats_completes') === true); }

console.log('── phase 11 : parent (décision C) ──');
{ const g = realm('parent', [], false); const A = g.window.ACCESS; await A.refresh();
  check('11.1 parent gratuit : dashboard démo ouvert', A.canAccessParent('demo_dashboard') === true);
  check('11.2 parent gratuit : suivi complet verrouillé', A.canAccessParent('full_reports') === false);
  check('11.3 parent gratuit sans enfant abonné : rapport de base verrouillé', (await A.canAccessParentChild('c1')) === false); }
{ const g = realm('parent', [], true); const A = g.window.ACCESS; await A.refresh();
  check('11.4 parent dont l\'enfant est ACTIF : rapport de base ouvert (décision C)', (await A.canAccessParentChild('c1')) === true);
  check('11.5 parent dont l\'enfant est ACTIF : outils avancés toujours verrouillés', A.canAccessParent('full_reports') === false); }
{ const g = realm('parent', [{ id: 4, statut: 'actif', fin: FUT }], false); const A = g.window.ACCESS; await A.refresh();
  check('11.6 parent abonné : suivi complet ouvert', A.canAccessParent('full_reports') === true);
  check('11.7 parent abonné : rapport de base ouvert', (await A.canAccessParentChild('c1')) === true); }

console.log('── phase 12 : expiration + renouvellement (aucune perte) ──');
{ const S = {};
  const g1 = realm('eleve', [{ id: 5, statut: 'actif', fin: FUT }], false, S); const A1 = g1.window.ACCESS; await A1.refresh();
  S['dz_de_seances_v1:u1'] = JSON.stringify({ done: [1, 2] });
  const avant = S['dz_de_seances_v1:u1'];
  check('12.1 abonné actif : payant ouvert', A1.canAccessLesson(1, 3) === true);
  const g2 = realm('eleve', [{ id: 5, statut: 'actif', fin: PAS }], false, S); const A2 = g2.window.ACCESS; await A2.refresh();
  check('12.2 expiration : payant verrouillé', A2.canAccessLesson(1, 3) === false);
  check('12.3 expiration : gratuit encore ouvert', A2.canAccessLesson(1, 1) === true);
  check('12.4 expiration : progression intacte', S['dz_de_seances_v1:u1'] === avant);
  const g3 = realm('eleve', [{ id: 5, statut: 'actif', fin: FUT }], false, S); const A3 = g3.window.ACCESS; await A3.refresh();
  check('12.5 renouvellement : accès restauré', A3.canAccessLesson(1, 3) === true);
  check('12.6 renouvellement : progression restaurée identique', S['dz_de_seances_v1:u1'] === avant); }

console.log('── phase 13 : tentatives de contournement (client) ──');
{ const g = realm('eleve', [], false); const A = g.window.ACCESS; await A.refresh();
  g.localStorage.setItem('dz_ent_ui', JSON.stringify({ ok: true, until: '2999-01-01', ui_only: true }));
  g.sessionStorage.setItem('dz_ent_ui', JSON.stringify({ ok: true }));
  check('13.1 cache local forgé : payant RESTE verrouillé', A.canAccessLesson(1, 3) === false);
  g.navigator.onLine = false;
  check('13.2 hors-ligne : payant RESTE verrouillé', A.canAccessLesson(1, 3) === false);
  check('13.3 hors-ligne : gratuit encore ouvert', A.canAccessLesson(1, 1) === true); }
{ const g = realm('eleve', [{ id: 6, statut: 'actif', fin: FUT }]); const A = g.window.ACCESS; await A.refresh();
  check('13.4 abonné en ligne : payant ouvert', A.canAccessLesson(1, 3) === true);
  g.navigator.onLine = false;
  check('13.5 abonné mais hors-ligne : payant verrouillé (règle serveur)', A.canAccessLesson(1, 3) === false); }

console.log('');
if (fails.length) { console.log('::error::Matrice parcours : ' + fails.length + ' ligne(s) rouge(s)'); fails.forEach(f => console.log('::error::PARCOURS · ' + f)); process.exit(1); }
console.log('✅ Matrice parcours : ' + nok + '/' + nok + ' lignes vertes (phases 9→13)');
