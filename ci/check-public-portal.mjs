/* Garde de non-régression du portail public (matières, niveaux, inscription). */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = p => readFileSync(p, 'utf8');
const catalog = JSON.parse(read('assets/bdd/matieres.json'));
const statuses = JSON.parse(read('assets/bdd/subjects.json'));
const auth = read('auth.js');
const portal = read('public-portal.js');
const app = read('app.js');
const html = read('index.html');

const fail = message => { throw new Error('Portail public : ' + message); };
const expected = {
  '1AS': ['tc-lettres', 'tc-sciences'],
  '2AS': ['sciences', 'math', 'tech', 'gestion', 'philo', 'langues'],
  '3AS': ['sciences', 'math', 'tech', 'gestion', 'philo', 'langues']
};
const levels = Object.keys(catalog.par_niveau || {});
assert.deepEqual(levels, Object.keys(expected), 'les trois niveaux doivent être publiés dans l’ordre');
const byId = new Map((catalog.matieres || []).map(item => [item.id, item]));

for (const [level, branches] of Object.entries(expected)) {
  const actual = catalog.par_niveau[level] || {};
  assert.deepEqual(Object.keys(actual), branches, level + ' : filières incohérentes');
  for (const [branch, ids] of Object.entries(actual)) {
    if (!Array.isArray(ids)) fail(level + '/' + branch + ' : liste de matières invalide');
    for (const id of ids) {
      if (!byId.has(id)) fail(level + '/' + branch + ' : matière inconnue ' + id);
    }
  }
}

const germanLevels = levels.filter(level =>
  Object.values(catalog.par_niveau[level] || {}).some(ids => ids.includes('allemand')));
assert.deepEqual(germanLevels, ['2AS', '3AS'], 'l’allemand ne doit pas apparaître en 1AS');
if (!byId.has('allemand') || byId.get('allemand').statut !== 'actif') {
  fail('la fiche allemande doit être active');
}
if (byId.has('anglais') && byId.get('anglais').statut !== 'partiel') {
  fail('l’anglais ne doit pas être présenté comme entièrement disponible');
}
if (catalog.matieres.some(x => /تربية بدنية|éducation physique/i.test(
  [x.id, x.ar, x.desc].filter(Boolean).join(' ')))) {
  fail('التربية البدنية doit rester absente du catalogue');
}

const statusById = Object.fromEntries(statuses.map(x => [x.id, x.status]));
if (statusById.allemand !== 'implemented') fail('statut allemand non implémenté');
if (statusById.anglais !== 'partial') fail('statut anglais non partiel');
for (const id of ['tc-lettres', 'tc-sciences', 'sciences', 'math', 'tech', 'gestion', 'philo', 'langues']) {
  if (!auth.includes("id:'" + id + "'")) fail('filière absente du formulaire d’inscription : ' + id);
}

for (const marker of [
  "function chooseSignup()",
  "n.value = state.level",
  "n.dispatchEvent(new Event('change'",
  "f.value = state.branch",
  "const b = $('[data-gate-open=\"signup\"]')",
  "case 'signup': chooseSignup()"
]) {
  if (!portal.includes(marker)) fail('liaison du parcours inscription absente : ' + marker);
}
for (const id of ['publicExplorer', 'publicExplorerContent', 'suNiveau', 'suFiliere']) {
  if (!html.includes('id="' + id + '"')) fail('élément HTML absent : #' + id);
}
if (!portal.includes('متاحة جزئيًا') || !portal.includes('قيد البرمجة')) {
  fail('les libellés de disponibilité doivent distinguer partiel et programmé');
}

/* Une seule couche possède l'ouverture des écrans de connexion/inscription. */
if (app.includes("querySelectorAll('[data-gate-open]')")) {
  fail('app.js ne doit pas doubler le gestionnaire public-portal.js');
}
if (!portal.includes("document.addEventListener('click'") ||
    !portal.includes("gate.hidden = false") ||
    !portal.includes("gate.classList.add('public-auth-page')")) {
  fail('le portail public doit dévoiler #gate avant d’afficher la carte de connexion');
}

console.log('✅ Portail public : 3 niveaux, 14 matières, filières cohérentes');
console.log('✅ Parcours allemand : 2AS/3AS uniquement ; anglais : disponibilité partielle');
console.log('✅ Inscription : niveau et filière transmis au formulaire existant');

/* Contrat de l'écran de connexion : routes, onglets, champs et vraie soumission. */
const loginStart = html.indexOf('<form id="loginForm"');
const loginEnd = html.indexOf('</form>', loginStart);
const loginForm = loginStart >= 0 && loginEnd >= 0
  ? html.slice(loginStart, loginEnd + '</form>'.length) : '';
if (!loginForm) fail('formulaire #loginForm absent');
for (const marker of [
  'id="loginUser"', 'autocomplete="username"',
  'id="loginPass"', 'autocomplete="current-password"',
  'type="submit"'
]) {
  if (!loginForm.includes(marker)) fail('contrat de connexion absent : ' + marker);
}
for (const marker of [
  "function setAuthPage(target, syncHash)",
  "gate.hidden = false",
  "card.hidden = false",
  "tab.click()",
  "focus = mode === 'signup' ? $('#suName') : $('#loginUser')",
  "location.hash === '#connexion'",
  "location.hash === '#inscription'"
]) {
  if (!portal.includes(marker)) fail('route/affichage connexion-inscription absent : ' + marker);
}
for (const marker of [
  "document.addEventListener('click'",
  "ev.target.closest('[data-gate-open]')",
  "setAuthPage(gateTrigger.dataset.gateOpen === 'signup' ? 'signup' : 'login', true)"
]) {
  if (!portal.includes(marker)) fail('déclencheur public de connexion absent : ' + marker);
}
for (const marker of [
  "Array.from(document.querySelectorAll('.gtab'))",
  "const isLogin = b.dataset.gate === 'login'",
  "if(lf) lf.addEventListener('submit'",
  "window.SB.login(",
  "AUTH.login("
]) {
  if (!app.includes(marker)) fail('comportement formulaire/onglets ou authentification absent : ' + marker);
}
if (!html.includes('data-gate="login"') || !html.includes('data-gate="signup"')) {
  fail('onglets connexion et inscription absents');
}
for (const marker of [
  'role="tablist"', 'role="tab"', 'aria-selected="true"',
  'aria-controls="loginForm"', 'aria-controls="signupForm"',
  'role="tabpanel"', 'aria-labelledby="loginTab"', 'aria-labelledby="signupTab"'
]) {
  if (!html.includes(marker)) fail('accessibilité des onglets/formulaires absente : ' + marker);
}
for (const marker of [
  "x.setAttribute('aria-selected', selected ? 'true' : 'false')",
  "x.tabIndex = selected ? 0 : -1"
]) {
  if (!app.includes(marker)) fail('état accessible des onglets non synchronisé : ' + marker);
}

console.log('✅ Connexion : routes #connexion/#inscription, onglets, champs et submit contrôlés');
console.log('✅ التربية البدنية absente ; aucune modification du système Auth');

/* Contrat du parcours complet de récupération du mot de passe Supabase. */
const supabase = read('supabase/supabase.js');
for (const marker of [
  'async function resetPassword(email)',
  'c.auth.resetPasswordForEmail(',
  'async function updatePassword(password)',
  'c.auth.updateUser({ password })',
  'resetPassword, updatePassword'
]) {
  if (!supabase.includes(marker)) fail('API de récupération Supabase absente : ' + marker);
}
for (const marker of [
  'id="passwordResetForm"',
  'id="resetEmail"',
  'data-password-reset-open',
  'id="passwordUpdateForm"',
  'id="newPassword"',
  'id="confirmNewPassword"',
  'id="passwordResetStatus"',
  'id="passwordUpdateStatus"'
]) {
  if (!html.includes(marker)) fail('interface de récupération absente : ' + marker);
}
for (const marker of [
  "function setRecoveryPage(mode, syncHash)",
  "location.hash === '#mot-de-passe-oublie'",
  "location.hash === '#reinitialiser-mot-de-passe'",
  "isPasswordRecoveryCallback()"
]) {
  if (!portal.includes(marker)) fail('route de récupération absente : ' + marker);
}
for (const marker of [
  "window.SB.resetPassword($('#resetEmail').value)",
  "window.SB.updatePassword(password)",
  "password!==confirmation",
  "location.hash='#mot-de-passe-oublie'"
]) {
  if (!app.includes(marker)) fail('gestionnaire de récupération absent : ' + marker);
}
console.log('✅ Récupération : envoi email, lien de réinitialisation et mise à jour du mot de passe contrôlés');

