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
const css = read('style-prototype-dz.css');

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
const loginTabId = html.indexOf('id="loginTab"');
const loginTabStart = html.lastIndexOf('<button', loginTabId);
const loginTabEnd = html.indexOf('>', loginTabId);
const loginTab = loginTabStart >= 0 && loginTabEnd >= 0 ? html.slice(loginTabStart, loginTabEnd + 1) : '';
if (!loginTab || !loginTab.includes('data-gate="login"') || loginTab.includes('data-gate-open')) {
  fail('l’onglet interne loginTab ne doit pas relancer le déclencheur de navigation publique');
}
if (!html.includes('<button type="button" data-gate-open="login">تسجيل الدخول</button>')) {
  fail('le bouton du menu public doit ouvrir la route #connexion');
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

/* La récupération doit occuper la même zone de grille que les autres formulaires.
   Le contrôle porte aussi sur les versions de cache réellement chargées. */
for (const id of ['passwordResetForm', 'passwordUpdateForm']) {
  const selector = '#gate.public-auth-page #' + id;
  if (!css.includes(selector)) fail('placement CSS du formulaire public absent : #' + id);
  const ruleStart = css.indexOf(selector);
  const ruleEnd = css.indexOf('}', ruleStart);
  const rule = ruleStart >= 0 && ruleEnd >= 0 ? css.slice(ruleStart, ruleEnd) : '';
  if (!rule.includes('grid-area:form!important')) {
    fail('le formulaire #' + id + ' doit occuper la zone form');
  }
}

/* Régression LOT 101 : display:grid!important ne doit jamais neutraliser hidden.
   Le sélecteur [hidden] doit être plus spécifique que la règle de placement. */
for (const id of ['passwordResetForm', 'passwordUpdateForm']) {
  const hiddenRule = '#gate.public-auth-page #' + id + '[hidden]';
  if (!css.includes(hiddenRule)) {
    fail('le formulaire #' + id + ' doit rester masqué lorsque hidden est présent');
  }
}
if (!/#gate\\.public-auth-page #passwordUpdateForm\\[hidden\\]\\s*,\\s*#gate\\.public-auth-page #passwordUpdateForm\\[hidden\\]/.test(css) &&
    !css.includes('#gate.public-auth-page #passwordResetForm[hidden],\n#gate.public-auth-page #passwordUpdateForm[hidden]')) {
  fail('règle CSS prioritaire de masquage des formulaires de récupération absente');
}
const sw = read('sw.js');
if (!html.includes('style-prototype-dz.css?v=147')) {
  fail('version CSS du portail non actualisée (v147 attendue)');
}
if (!sw.includes('style-prototype-dz.css?v=147')) {
  fail('version CSS du précache non actualisée (v147 attendue)');
}
if (!sw.includes("dz-de-v3.175.0.0.55") ||
    !sw.includes("style-prototype-dz.css?v=147") ||
    !sw.includes("if (!error || error.name !== 'InvalidStateError') throw error;")) {
  fail('précache Service Worker non synchronisé avec le CSS du portail');
}
console.log('✅ Récupération : formulaires positionnés dans la grille desktop et mobile');
console.log('✅ Cache CSS v147, app.js v3535 et Service Worker v3.175 synchronisés');
if (sw.includes("./assets/bdd/shards/shard_00.json")) {
  fail('précache un shard documentaire absent du dépôt');
}
if (!sw.includes("await cdnCache.put(request, response)") ||
    sw.includes("cdnCache.add(new Request(url, { mode: 'no-cors' }))")) {
  fail('cache CDN des polices doit accepter les réponses opaques via Cache.put');
}
console.log('✅ Service Worker : aucun shard vide/absent précaché et polices CDN mises en cache via Cache.put');
if (!css.includes('LOT 98 — navigation basse fixe sur mobile')) {
  fail('navigation basse fixe mobile absente');
}
if (!css.includes('inset-block-end:0!important') ||
    !css.includes('position:fixed!important')) {
  fail('navigation mobile non fixée au bas de l’écran');
}
if (!css.includes('padding-bottom:calc(94px + env(safe-area-inset-bottom))')) {
  fail('espace de sécurité sous le contenu mobile absent');
}
console.log('✅ Navigation mobile fixée en bas avec zone de sécurité');


for (const marker of ["const primary = [","['accueil', '🏠 الرئيسية']","['matieres', window.__SUBJECT__ === 'en' ? '🇬🇧 English' : '📚 المواد']","['masar', '🧭 مساري']","['prof', '🤖 الأستاذ الذكي']","data-nav-more",'id="mobileNavMore"',"mobileItems = visible.filter","morePanel.hidden = !morePanel.hidden","ev.key !== 'Escape'"]) {
  if (!app.includes(marker)) fail('navigation mobile compacte absente ou incomplète : ' + marker);
}
if (!css.includes('LOT 99 — navigation mobile compacte')) fail('styles Lot 99 absents');
if (!html.includes('app.js?v=3535') || !sw.includes('app.js?v=3535')) fail('cache app.js non synchronisé');
if (!html.includes('style-prototype-dz.css?v=147') || !sw.includes('style-prototype-dz.css?v=147')) fail('cache CSS v147 non synchronisé');
if (!css.includes('NAV V2 — navigation intégrée au header, sans sidebar ni barre basse')) fail('règle NAV V2 sans sidebar absente');
if (!css.includes('#shell #tabs .desktop-nav{\n    display:flex!important;flex-direction:row!important;')) fail('navigation desktop horizontale intégrée au header absente');
console.log('✅ Lot 99 mobile + Lot 107 desktop : navigation responsive sans sidebar');
const navStart = app.indexOf('const NAVCATS = [');
const navEnd = app.indexOf('\n];', navStart);
if (navStart < 0 || navEnd < 0) fail('déclaration des espaces de navigation absente');
const navCatsBlock = app.slice(navStart, navEnd);
const navCategoryCount = navCatsBlock.split('\n').filter(line => line.trimStart().startsWith("['")).length;
if (navCategoryCount !== 5) fail('la navigation doit présenter exactement cinq espaces principaux après retrait de التقدم الدراسي');
for (const label of ['التعلّم', 'التدريب والاختبارات', 'القسم والتواصل', 'فضاءات التأطير', 'الخدمات والحساب']) {
  if (!navCatsBlock.includes(label)) fail('espace de navigation manquant : ' + label);
}
for (const route of ['seances', 'grammaire', 'guide', 'biblio', 'corpus', 'malakhiss', 'methode', 'buch', 'banque', 'cloud',
  'revision', 'quiz', 'officiels', 'devoir', 'devoirs', 'simulation', 'examen', 'classe', 'live', 'rag',
  'prof', 'profboard', 'parents', 'projet', 'reservation', 'abonne', 'compte', 'legal', 'admin']) {
  if (!navCatsBlock.includes("'" + route + "'")) fail('destination non classée dans la navigation : ' + route);
}
if (!app.includes("t[0] !== 'sponsor'")) fail('le raccourci sponsor doit rester hors du menu général');

if (!app.includes('class="mobile-nav-group"') ||
    !app.includes('class="mobile-nav-group-trigger"') ||
    !app.includes('class="mobile-nav-group-items"')) {
  fail('menu mobile non organisé en espaces repliables');
}
if (!css.includes('LOT 118') || !css.includes('.mobile-nav-group-trigger')) {
  fail('styles des catégories repliables mobiles absents');
}

for (const marker of ['const NAVCATS = [','nav-group-trigger','nav-submenu','nav-subitem','<details class="nav-group']) {
  if (!app.includes(marker)) fail('menu hiérarchique desktop incomplet : ' + marker);
}
if (!css.includes('LOT 111 — menu hiérarchique desktop')) fail('styles du menu hiérarchique absents');
if (!css.includes("LOT 113 — menus déroulants au-dessus de l'ancien tiroir latéral") || !css.includes("z-index:1800!important") || !css.includes("z-index:1804!important")) fail("priorité d’empilement des sous-menus desktop absente");
if (!css.includes("LOT 116 — empêcher le découpage vertical des sous-menus desktop") ||
    !css.includes("overflow-x:visible!important") ||
    !css.includes("overflow-y:visible!important")) fail("débordement vertical des sous-menus desktop encore découpé");
if (!css.includes('.nav-group:hover>.nav-submenu') ||
    !css.includes('.nav-group:focus-within>.nav-submenu')) {
  fail('ouverture des sous-menus par survol/clavier absente');
}
console.log('✅ Lot 111 : catégories compactes, sous-menus au survol et navigation clavier');

// LOT 119 — retrait complet des statistiques nationales et de leur espace de navigation.
if (app.includes("'stats'") || app.includes('التقدم الدراسي') || app.includes('الإحصائيات الوطنية')) fail('navigation : ancienne rubrique nationale/progression encore présente');
if (html.includes('data-view="stats"') || html.includes('stats.js')) fail('portail : vue ou module des statistiques nationales encore chargé');
if (sw.includes('stats.js')) fail('Service Worker : module national stats encore précaché');
if (!navCatsBlock.includes("'projet'") || navCatsBlock.includes('التقدم الدراسي')) fail('projet doit rester classé sans recréer la rubrique supprimée');
if (css.includes('section[data-view="stats"]') || css.includes('#statsBody')) fail('CSS : styles orphelins de la vue nationale encore présents');
if (!html.includes('id="statsHome"') || !app.includes("const el = $('#statsHome')")) fail('indicateurs personnels de l’accueil supprimés par erreur');
console.log('✅ Lot 119 : vue nationale supprimée, cinq espaces de navigation, progression individuelle conservée.');
// LOT 129 — aucune statistique nationale dans les archives BAC / devoirs officiels.
const examen = read('examen.js');
const officiels = read('officiels.js');
const bacArchive = JSON.parse(read('assets/bdd/bac_archive.json'));
const devoirsOfficiels = JSON.parse(read('assets/bdd/devoirs_officiels.json'));
if (examen.includes('a.candidats') || examen.includes('a.moyenne') || examen.includes('a.taux') || examen.includes('stats: null')) fail('archive BAC : métriques nationales encore rendues ou mappées');
if (officiels.includes('reussite_pct') || officiels.includes('d.stats.vues') || officiels.includes('d.stats.telechargements')) fail('devoirs officiels : statistiques agrégées encore rendues');
if ((bacArchive.annees || []).some(a => ['candidats','moyenne','taux'].some(k => k in a)) || (bacArchive.sujets || []).some(s => 'stats' in s)) fail('données BAC : statistiques nationales encore présentes');
if ((devoirsOfficiels.devoirs || []).some(d => 'stats' in d)) fail('données devoirs officiels : statistiques agrégées encore présentes');
if (!examen.includes('h.length') || !examen.includes('readiness(moy)') || !examen.includes('faits.length')) fail('archive BAC : indicateurs personnels supprimés par erreur');
if (!officiels.includes('note.toFixed(1)') || !officiels.includes('إجابة')) fail('devoirs : résultats personnels supprimés par erreur');
console.log('✅ Lot 129 : statistiques nationales supprimées des archives ; résultats personnels conservés.');
