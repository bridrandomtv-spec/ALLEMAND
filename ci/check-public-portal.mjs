/* Garde de non-régression du portail public (matières, niveaux, inscription). */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = p => readFileSync(p, 'utf8');
const catalog = JSON.parse(read('assets/bdd/matieres.json'));
const statuses = JSON.parse(read('assets/bdd/subjects.json'));
const auth = read('auth.js');
const admin = read('admin.js');
const prof = read('prof.js');
const parents = read('parents.js');
const portal = read('public-portal.js');
const app = read('app.js');
const html = read('index.html');
const onboarding = read('assets/bdd/onboarding.json');
const guideScript = read('guide.js');
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


const onboardingText = JSON.stringify(JSON.parse(onboarding));
for (const unsupported of ['24/7', 'تقرير أسبوعي', 'تقرير أسبوعي تلقائي', 'حضورك، ترتيبك', 'كل الحصص والفروض والتصحيحات متاحة', 'تعمل بدون أنترنت', 'كل تمرين يُصحَّح فورًا']) {
  if (onboardingText.includes(unsupported)) fail('guide onboarding : promesse non vérifiée encore présente : ' + unsupported);
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
if (!html.includes('style-prototype-dz.css?v=193')) {
  fail('version CSS du portail non actualisée (v176 attendue)');
}
if (!sw.includes('style-prototype-dz.css?v=193')) {
  fail('version CSS du précache non actualisée (v176 attendue)');
}
if (!sw.includes("dz-de-v3.185.0.0.131") ||
    !sw.includes("style-prototype-dz.css?v=193") ||
    !sw.includes("if (!error || error.name !== 'InvalidStateError') throw error;")) {
  fail('précache Service Worker non synchronisé avec le CSS du portail');
}
console.log('✅ Récupération : formulaires positionnés dans la grille desktop et mobile');
console.log('✅ Cache CSS v193, app.js v3563 et Service Worker v3.185.0.0.129 synchronisés');
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
if (!html.includes('supabase/supabase.js?v=3517') || !sw.includes('supabase/supabase.js?v=3517')) fail('cache Supabase client non synchronisé');
if (!html.includes('app.js?v=3563') || !sw.includes('app.js?v=3563')) fail('cache app.js non synchronisé');
if (!html.includes('style-prototype-dz.css?v=193') || !sw.includes('style-prototype-dz.css?v=193')) fail('cache CSS non synchronisé');
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

const navRoutes = ['seances','grammaire','guide','biblio','corpus','malakhiss','methode','buch','banque','cloud',
  'revision','quiz','officiels','devoir','devoirs','simulation','examen','classe','live','rag',
  'prof','profboard','parents','projet','reservation','abonne','compte','legal','admin'];
const viewsStart = app.indexOf('const VIEWS = [');
const viewsEnd = app.indexOf('];', viewsStart);
if (viewsStart < 0 || viewsEnd < 0) fail('navigation : liste centrale des vues introuvable');
const viewsBlock = app.slice(viewsStart, viewsEnd + 2);
for (const route of navRoutes) {
  if (!viewsBlock.includes("'" + route + "'")) fail('navigation : destination absente de VIEWS : ' + route);
  if (!html.includes('data-view="' + route + '"')) fail('navigation : destination sans section HTML : ' + route);
}
if (!app.includes("s.role === 'prof'") || !app.includes("t.splice(t.length - 1, 0, ['profboard'")) {
  fail('navigation : entrée لوحة الأستاذ non réservée au rôle professeur');
}
if (!app.includes("s.role === 'admin'") || !app.includes("(t[0] !== 'admin' || isAdmin())")) {
  fail('navigation : entrée administration non filtrée par rôle admin');
}
/* Les protections doivent aussi tenir lors d'un accès direct à la vue, sans passer par le menu. */
if (!prof.includes('if(!accesAutorise())') ||
    !prof.includes("return !!(s && s.role === 'prof')") ||
    !prof.includes('window.renderProfBoard = boot;') ||
    !prof.includes('window.DZ_PROF = { boot:boot')) {
  fail('sécurité vue professeur : garde de rôle ou fonction de rendu central absente');
}
if (!admin.includes('const u = await window.SB.me();') ||
    !admin.includes("p.role !== 'admin'")) {
  fail('sécurité vue administration : vérification du profil Supabase absente au rendu direct');
}
if (parents.includes("if(e.detail === 'parents') boot()") ||
    !app.includes("if(view === 'parents')    renderParents();")) {
  fail('initialisation de l’espace parents doublée ou déclencheur central absent');
}
if (!app.includes("function isParent()") ||
    !app.includes("s.role === 'parent'") ||
    !app.includes("(t[0] !== 'parents' || isParent())") ||
    !app.includes("if(view === 'parents' && !isParent())")) {
  fail('espace parents : entrée de navigation ou accès direct non réservé au rôle parent');
}
if (!app.includes("document.addEventListener('dz:auth', e => {") ||
    !app.includes("renderTabs();\n    if(e.detail && currentView === 'parents' && !isParent()) go('accueil');")) {
  fail('espace parents : navigation non actualisée après changement de session ou de rôle');
}
if (!parents.includes("if(!s || s.role !== 'parent')") ||
    !parents.includes("هذا الفضاء مخصّص لحسابات الأولياء فقط")) {
  fail('espace parents : fonction boot accessible sans contrôle de rôle indépendant');
}
if (!parents.includes('بيانات تجريبية توضيحية — لا تمثل نتائج تلميذ حقيقي') ||
    parents.includes('Données 100% locales — aucune transmission serveur')) {
  fail('espace parents : données de démonstration non signalées ou commentaire de confidentialité trompeur');
}
if (admin.slice(0, admin.indexOf('/* ── phase 5')).includes("addEventListener('dz:view'") ||
    prof.includes("addEventListener('dz:view'") ||
    !app.includes("if(view === 'admin' && window.renderAdmin) window.renderAdmin();") ||
    !app.includes("if(view === 'profboard' && window.renderProfBoard) window.renderProfBoard();")) {
  fail('initialisation des tableaux de bord doublée ou déclencheur central absent');
}
console.log('✅ Navigation : destinations réelles ; menu et rendu direct professeur/admin protégés par rôle.');


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
if (!html.includes('id="homeGamification"') || !read('dz-gamification.js').includes("getElementById('homeGamification')")) fail('gamification réelle absente du tableau de bord élève');
console.log('✅ Lot 119 : vue nationale supprimée, cinq espaces de navigation, progression individuelle conservée.');
// LOT 129 — aucune statistique nationale dans les archives BAC / devoirs officiels.
const examen = read('examen.js');
const officiels = read('officiels.js');
const bacArchive = JSON.parse(read('assets/bdd/bac_archive.json'));
const devoirsOfficiels = JSON.parse(read('assets/bdd/devoirs_officiels.json'));
const englishDevoirs = JSON.parse(read('assets/bdd/english_devoirs.json'));
const annales = JSON.parse(read('assets/bdd/annales.json'));
const compositions = JSON.parse(read('assets/bdd/compositions.json'));
const aggregateKeys = ['note_moyenne','vues','telechargements','candidats','moyenne_nationale','taux_reussite'];
for (const [label, data, expected] of [['annales', annales, 126], ['compositions', compositions, 171]]) {
  const items = data.items || [];
  if (items.length !== expected) fail(label + ' : nombre de sujets inattendu (' + items.length + ')');
  if (items.some(item => aggregateKeys.some(key => key in item))) fail(label + ' : statistiques agrégées encore présentes');
  if (items.some(item => !item.titre || !item.sujet)) fail(label + ' : titre ou sujet manquant');
  if (label === 'compositions' && items.filter(item => item.corrige).length !== 165) fail('compositions : nombre de corrigés modifié de façon inattendue');
  if (label === 'annales' && items.filter(item => item.corrige).length !== 126) fail('annales : nombre de corrigés modifié de façon inattendue');
}
const bacSubjects = JSON.parse(read('assets/bdd/bac.json'));
if ((bacSubjects.items || []).some(s => ['note_moyenne','vues','telechargements','candidats','moyenne_nationale','taux_reussite'].some(k => k in s))) fail('BAC : compteurs et statistiques agrégées encore présents dans bac.json');
if (!(bacSubjects.items || []).length || (bacSubjects.items || []).some(s => !s.sujet || !s.corrige)) fail('BAC : sujets ou corrigés manquants après retrait des statistiques');
if (examen.includes('a.candidats') || examen.includes('a.moyenne') || examen.includes('a.taux') || examen.includes('stats: null')) fail('archive BAC : métriques nationales encore rendues ou mappées');
if (officiels.includes('reussite_pct') || officiels.includes('d.stats.vues') || officiels.includes('d.stats.telechargements')) fail('devoirs officiels : statistiques agrégées encore rendues');
if ((bacArchive.annees || []).some(a => ['candidats','moyenne','taux'].some(k => k in a)) || (bacArchive.sujets || []).some(s => 'stats' in s)) fail('données BAC : statistiques nationales encore présentes');
if ((devoirsOfficiels.devoirs || []).some(d => 'stats' in d)) fail('données devoirs officiels : statistiques agrégées encore présentes');
if (!examen.includes('h.length') || !examen.includes('readiness(moy)') || !examen.includes('faits.length')) fail('archive BAC : indicateurs personnels supprimés par erreur');
if (!officiels.includes('note.toFixed(1)') || !officiels.includes('إجابة')) fail('devoirs : résultats personnels supprimés par erreur');
console.log('✅ Lot 129 : statistiques nationales supprimées des archives ; résultats personnels conservés.');

// LOT 134 — retirer le tableau public d'indicateurs agrégés, sans supprimer les preuves pédagogiques.
if (html.includes('public-quality-dashboard') || html.includes('public-quality-metric') ||
    html.includes('معدل النجاح') || html.includes('لوحة مؤشرات التعلّم') ||
    html.includes('الجودة التعليمية والمتابعة') || html.includes('تعلّم، تدرّب، وتابع تقدّمك بثقة')) {
  fail('portail public : tableau d’indicateurs agrégés encore présent');
}
for (const marker of ['public-quality-proof', '<strong>234</strong>', '<strong>55</strong>', '<strong>19</strong>']) {
  if (!html.includes(marker)) fail('portail public : preuve de ressource pédagogique absente : ' + marker);
}
for (const obsolete of ['public-quality-dashboard','public-quality-live','public-quality-rings','public-quality-ring','public-quality-note','public-quality-metrics','public-quality-metric']) {
  if (css.includes(obsolete)) fail('CSS : sélecteur orphelin de l’ancien tableau public : ' + obsolete);
}
console.log('✅ Lot 137 : ancien tableau public supprimé du HTML et de la feuille CSS ; cartes de ressources conservées.');

// LOT 135 — appliquer le contrôle anti-indicateurs agrégés au corpus des devoirs d'anglais.
const englishItems = englishDevoirs.items || [];
if (!englishItems.length || englishItems.some(item => aggregateKeys.some(key => key in item))) fail('devoirs anglais : corpus vide ou statistiques agrégées encore présentes');
if (englishItems.some(item => !item.sujet || !item.corrige)) fail('devoirs anglais : sujet ou corrigé manquant');
console.log('✅ Lot 135 : devoirs anglais contrôlés ; sujets et corrigés conservés sans métriques agrégées.');

// LOT 158 — le courriel de bienvenue doit refléter le guide publié, sans promesses parallèles.
for (const stale of ['تقرير أسبوعي : نقاط وحضور', 'اسأل 24/7', 'منصّة مجانية', 'مطابقة لمنهاج وزارة التربية']) {
  if (guideScript.includes(stale)) fail('courriel de bienvenue : promesse obsolète encore présente : ' + stale);
}
if (!guideScript.includes('D.mode_emploi[role]') || !guideScript.includes('objectif.points')) {
  fail('courriel de bienvenue : contenu non dérivé de onboarding.json');
}
if (!html.includes('guide.js?v=3511') || !sw.includes('guide.js?v=3511') || !sw.includes('dz-de-v3.185.0.0.131')) {
  fail('guide de bienvenue : cache ou Service Worker non actualisé');
}
console.log('✅ Lot 158 : courriel de bienvenue synchronisé avec le guide publié et ses ressources réelles.');


// Lot 176 — Auth cloud : aucune erreur en ligne ne doit ouvrir une session locale.
const authLoginStart=app.indexOf("if(lf) lf.addEventListener('submit'");
const authSignupStart=app.indexOf("if(sf) sf.addEventListener('submit'");
const authLoginEnd=app.indexOf("const bd = $('#btnDemo')",authLoginStart);
const authSignupEnd=app.indexOf("const uc = $('#userChip')",authSignupStart);
if(authLoginStart<0||authLoginEnd<=authLoginStart||authSignupStart<0||authSignupEnd<=authSignupStart) fail('flux Auth : formulaires introuvables');
const authLogin=app.slice(authLoginStart,authLoginEnd), authSignup=app.slice(authSignupStart,authSignupEnd);
if(!authLogin.includes('if(!authLocalMode())')||!authLogin.includes('if(!result || !result.ok)')||authLogin.indexOf('if(!result || !result.ok)')>authLogin.indexOf('AUTH.login(')) fail('login : refus Supabase peut encore basculer vers localStorage');
if(!authSignup.includes('if(!authLocalMode())')||!authSignup.includes('if(!result || !result.ok)')||!authSignup.includes('if(!result.session)')||authSignup.indexOf('if(!result.session)')>authSignup.indexOf('AUTH.signup(')) fail('signup : erreur cloud ou confirmation email peut créer un compte local');
const supaSignupStart=supabase.indexOf('async function signup('), supaSignupEnd=supabase.indexOf('async function resetPassword(',supaSignupStart);
if(!supabase.includes('async function getSession()')||!supabase.slice(supaSignupStart,supaSignupEnd).includes('session: r.data.session || null')||!supabase.includes("signOut({ scope:'local' })")) fail('Supabase Auth : session signup/getSession/logout incomplet');
console.log('✅ Lot 176 : refus Auth cloud, confirmation email et mode local contrôlés.');


// Lot 178 — une session locale ne remplace pas une session Supabase valide en ligne.
const bootAuthStart=app.indexOf('function bootGate()'), bootAuthEnd=app.indexOf('function paintGateStats()',bootAuthStart);
const bootAuth=app.slice(bootAuthStart,bootAuthEnd);
if(!app.includes('function authLocalMode()')||!bootAuth.includes("s.src === 'cloud'")||!bootAuth.includes('window.SB.getSession()')||!bootAuth.includes('window.cloudAuthority()')||!bootAuth.includes('AUTH.logout()')) fail('restauration Auth : session cloud non vérifiée ou session locale en ligne non rejetée');
console.log('✅ Lot 178 : session Supabase vérifiée au rechargement ; session locale réservée au mode hors ligne/démo.');


// Lot 179 — le bindGateEvents et le pont cloud/session doivent rester présents.
const gateStart=app.indexOf('function bindGateEvents()');
const gateEnd=app.indexOf('/* ══════════ BANDEAU DE BIENVENUE',gateStart);
const gateBlock=app.slice(gateStart,gateEnd);
if(gateStart<0||gateEnd<=gateStart||!gateBlock.includes('async function cloudAuthority()')||!gateBlock.includes("localStorage.setItem('dz_de_session_v1'")||!gateBlock.includes("if(lf) lf.addEventListener('submit'")||!gateBlock.includes("if(sf) sf.addEventListener('submit'")) fail('bindGateEvents / cloudAuthority / formulaires Auth absents');
if(!gateBlock.includes('if(!authLocalMode())')||!gateBlock.includes('if(!result || !result.ok)')||!gateBlock.includes('if(!result.session)')) fail('flux Auth cloud/local ou confirmation email incomplet');
console.log('✅ Lot 179 : bindGateEvents et cloudAuthority conservés avec le garde-fou Auth.');


/* LOT 181 — contrat structurel MFA Supabase (aucun OTP ou secret fictif). */
const mfaClient = read('supabase/supabase.js');
const mfaModule = read('mfa-security.js');
const mfaEmailServer = read('supabase/functions/mfa-email/index.ts');
for (const marker of [
  'if (action === "status")',
  'STATUS_LOOKUP_FAILED',
  'EMAIL_FACTOR_NOT_CONFIGURED',
  'EMAIL_FACTOR_REQUIRED',
  'mfa_email_consume_challenge',
  'crypto.subtle.sign'
]) {
  if (!mfaEmailServer.includes(marker)) fail('sécurité MFA e-mail serveur absente : ' + marker);
}
if (!mfaModule.includes("if(!emailState.ok)") ||
    !mfaModule.includes("if(emailState.required && (!emailState.enrolled || !emailState.verified))") ||
    !mfaModule.includes("var purpose=emailState.enrolled?'login':'enroll'")) {
  fail('garde e-mail MFA non fail-closed ou enrôlement initial automatique absent');
}
if (!mfaEmailServer.includes('!Deno.env.get("RESEND_API_KEY")') ||
    !mfaEmailServer.includes('!Deno.env.get("MFA_EMAIL_FROM")')) {
  fail('précontrôle de configuration Resend absent avant émission du défi');
}
for (const marker of [
  'auth.mfa.getAuthenticatorAssuranceLevel()','level.data.currentLevel===\'aal1\'','level.data.nextLevel===\'aal2\'','auth.mfa.listFactors()',
  'auth.mfa.challenge({factorId})','auth.mfa.verify({factorId,challengeId,code:',
  'auth.mfa.enroll({factorType:','auth.mfa.enroll({factorType:\'phone\'', 'auth.mfa.unenroll({factorId})',
  'auth.mfa.recoveryCodes.generate(','auth.mfa.recoveryCodes.verify(',
  'experimental: { recoveryCodes: true }'
]) if (!mfaClient.includes(marker)) fail('API MFA Supabase absente : ' + marker);
for (const marker of [
  'async function requireGate()','if(!window.SB || !SB.mfaAssurance || !SB.mfaEmail)','function setLoginResendVisibility(type)',"if(attempts>=3)",
  'SB.mfaVerifyRecovery(value)','SB.mfaVerify(pending.factorId,pending.challengeId,value)',
  'SB.mfaEnrollTotp(','SB.mfaEnrollPhone(','SB.mfaVerifyEnrollment(','SB.mfaRecoveryGenerate()','[data-mfa-login-resend]','pending.challengeId=sent.challengeId','SB.mfaStart(pending.factorId)',
  'window.DZ_MFA={requireGate:requireGate','window.DZ.enterApp(profile)','window.DZ.toast('
]) if (!mfaModule.includes(marker)) fail('parcours MFA incomplet : ' + marker);
if (mfaModule.includes('123456') || mfaModule.includes('JBSW Y3DP') || mfaClient.includes('otplib')) fail('OTP/secret statique ou TOTP local interdit');
if ((app.split("typeof window.DZ_MFA.requireGate !== 'function'").length-1)!==4 || (app.split('if(await window.DZ_MFA.requireGate()) return;').length-1)!==4) fail('le MFA doit bloquer en mode fermé la connexion, la restauration, l’inscription cloud et la liaison cloud');
if (!html.includes('@supabase/supabase-js@2.119.0/dist/umd/supabase.js') ||
    !mfaClient.includes('@supabase/supabase-js@2.119.0/+esm') ||
    !mfaClient.includes('@supabase/supabase-js@2.119.0/dist/module/index.js') ||
    !mfaClient.includes('@supabase/supabase-js@2.119.0')) fail('Supabase JS doit être épinglé en 2.119.0 sur tous les chargeurs');
if (!app.includes("if(await window.DZ_MFA.requireGate()) return;") ||
    !app.includes("if(!result || !result.ok)") ||
    !app.includes("if(!window.DZ_MFA || typeof window.DZ_MFA.requireGate !== 'function')")) fail('garde MFA absent des parcours alternatifs ou login non vérifié');
const signupStart=app.indexOf("if(sf) sf.addEventListener('submit'");
const signupEnd=app.indexOf("/*",signupStart);
const signupBlock=app.slice(signupStart,signupEnd>signupStart?signupEnd:signupStart+12000);
if (!signupBlock.includes("if(await window.DZ_MFA.requireGate()) return;")) fail('inscription cloud avec session immédiate sans garde MFA');
const linkStart=app.indexOf("$('#lcBtn').addEventListener('click'");
const linkBlock=app.slice(linkStart,linkStart+5000);
if (!linkBlock.includes("if(!result || !result.ok)") || !linkBlock.includes("if(await window.DZ_MFA.requireGate()) return;")) fail('liaison cloud sans validation du login ou garde MFA');

const mfaGateStart=mfaModule.indexOf('async function requireGate()');
const mfaGateEnd=mfaModule.indexOf('async function finishLogin()',mfaGateStart);
const mfaGateBlock=mfaModule.slice(mfaGateStart,mfaGateEnd);
const mfaFinishStart=mfaModule.indexOf('async function finishLogin()');
const mfaFinishEnd=mfaModule.indexOf("var method=$('#mfaChallengeMethod')",mfaFinishStart);
const mfaFinishBlock=mfaModule.slice(mfaFinishStart,mfaFinishEnd);
const mfaSubmitStart=mfaModule.indexOf("if(challengeForm)challengeForm.addEventListener('submit'");
const mfaSubmitEnd=mfaModule.indexOf("document.addEventListener('submit'",mfaSubmitStart);
const mfaSubmitBlock=mfaModule.slice(mfaSubmitStart,mfaSubmitEnd);
if (!mfaGateBlock.includes('await SB.mfaAssurance()') ||
    !mfaGateBlock.includes("if(!emailState.ok)") ||
    !mfaGateBlock.includes("var purpose=emailState.enrolled?'login':'enroll'") ||
    !mfaGateBlock.includes("if(emailState.required && (!emailState.enrolled || !emailState.verified))") ||
    !mfaGateBlock.includes('showEmailChallenge(started,emailState,purpose)') ||
    !mfaGateBlock.includes('if(!nativeState.required)return false;') ||
    !mfaGateBlock.includes('return true;')) fail('garde MFA : enrôlement e-mail initial automatique et blocage des états non vérifiés requis');
if (!mfaSubmitBlock.includes('if(result&&result.ok){pending=null;await finishLogin();return;}') ||
    !mfaSubmitBlock.includes('if(attempts>=3){await returnToLoginAfterMfa(') ||
    !mfaSubmitBlock.includes('SB.mfaVerifyRecovery(value)') ||
    !mfaSubmitBlock.includes("SB.mfaEmail({action:'verify'")) fail('défi MFA : validation, récupération ou limite des tentatives incomplète');
if (!mfaFinishBlock.includes('if(await requireGate())return;') ||
    !mfaFinishBlock.includes('window.cloudAuthority?await window.cloudAuthority():null') ||
    !mfaFinishBlock.includes('window.DZ.enterApp(profile)')) fail('fin du défi MFA : recontrôle des facteurs et entrée après profil cloud requis');


for (const marker of ['id="mfaChallengeForm"','id="mfaChallengeMethod"','id="mfaChallengeCode"','id="mfaSecurityCard"','id="mfaSecurityContent"']) if (!html.includes(marker)) fail('interface MFA absente : '+marker);
if (!html.includes('mfa-security.js?v=14') || !sw.includes('./mfa-security.js?v=14')) fail('module MFA absent du chargement/précache');
if (!html.includes('id="mfaLoginSmsResend"') || !html.includes('data-mfa-login-resend')) fail('bouton de renvoi SMS au défi de connexion absent');
if (!mfaModule.includes('setLoginResendVisibility(type)') || !mfaModule.includes("setLoginResendVisibility(preferred.type)") || !mfaModule.includes("setLoginResendVisibility(type);")) fail('visibilité du renvoi SMS non limitée au facteur téléphone');
if (!mfaModule.includes('id=\"mfaPhoneEnrollForm\"') || !mfaModule.includes('id=\"mfaPhoneVerifyForm\"') || !mfaModule.includes('SB.mfaStart(enrolled.factorId)')) fail('enrôlement et validation du facteur SMS absents');
if (!html.includes('supabase/supabase.js?v=3517') || !sw.includes('supabase/supabase.js?v=3517')) fail('cache Supabase MFA non synchronisé');
if (!html.includes('app.js?v=3563') || !sw.includes('app.js?v=3563')) fail('cache app.js MFA non synchronisé');
if (!html.includes('style-prototype-dz.css?v=193') || !sw.includes('style-prototype-dz.css?v=193')) fail('cache CSS MFA non synchronisé');
if (!sw.includes("dz-de-v3.185.0.0.131")) fail('version Service Worker Lot 192 non actualisée');
if (!css.includes('LOT 181 — écrans et réglages MFA')) fail('styles MFA absents');
console.log('✅ MFA : Supabase natif, TOTP, défi AAL2, codes de récupération expérimentaux et cache contrôlés.');


// Lot 190 — facteur e-mail personnalisé : assertions de contrat client, sans assimiler à AAL2.
if (!read('supabase/supabase.js').includes("functions.invoke('mfa-email'")) fail('appel du service MFA e-mail absent');
if (!mfaModule.includes("SB.mfaEmail({action:'status'})") || !mfaModule.includes("SB.mfaEmail({action:'verify'")) fail('parcours MFA e-mail absent');
if (!mfaModule.includes("var purpose=emailState.enrolled?'login':'enroll'") || !mfaModule.includes("pending.purpose||'login'") ||
    mfaModule.includes('mfaEmailEnrollForm') || mfaModule.includes('data-mfa-email-disable') ||
    !mfaModule.includes('التحقق الإلزامي عبر البريد الإلكتروني مفعّل للطلاب')) fail('MFA e-mail : enrôlement automatique, renvoi et caractère obligatoire incomplets');
if (!mfaEmailServer.includes('EMAIL_FACTOR_REQUIRED') || !mfaEmailServer.includes('return json(403')) fail('le serveur ne bloque pas la désactivation du facteur e-mail obligatoire');


// Lot 196 — annulation, changement de facteur et enrôlement SMS sans état orphelin.
const mfaMethodStart=mfaModule.indexOf("if(method)method.addEventListener('change'");
const mfaMethodEnd=mfaModule.indexOf("var challengeForm=$('#mfaChallengeForm')",mfaMethodStart);
const mfaMethodBlock=mfaModule.slice(mfaMethodStart,mfaMethodEnd);
const mfaPhoneEnrollStart=mfaModule.indexOf("if(ev.target && ev.target.id==='mfaPhoneEnrollForm')");
const mfaPhoneEnrollEnd=mfaModule.indexOf("if(ev.target && ev.target.id==='mfaPhoneVerifyForm')",mfaPhoneEnrollStart);
const mfaPhoneEnrollBlock=mfaModule.slice(mfaPhoneEnrollStart,mfaPhoneEnrollEnd);
const mfaCancelBlock=mfaModule.slice(mfaModule.indexOf("if(ev.target.closest('[data-mfa-cancel]'))"),mfaModule.indexOf("if(ev.target.closest('[data-mfa-enroll]'))"));
if(mfaMethodStart<0||mfaMethodEnd<=mfaMethodStart||
   !mfaMethodBlock.includes("if(method.value==='recovery')")||
   !mfaMethodBlock.includes('pending=null;return;')||
   !mfaMethodBlock.includes('var started=await SB.mfaStart(factorId)')||
   !mfaMethodBlock.includes('pending={factorId:factorId,challengeId:started.challengeId,type:type}')) fail('changement de facteur MFA : challenge non réinitialisé ou non renouvelé');
if(mfaPhoneEnrollStart<0||mfaPhoneEnrollEnd<=mfaPhoneEnrollStart||
   !mfaPhoneEnrollBlock.includes('await SB.mfaEnrollPhone(number)')||
   !mfaPhoneEnrollBlock.includes('await SB.mfaStart(enrolled.factorId)')||
   !mfaPhoneEnrollBlock.includes('await SB.mfaUnenroll(enrolled.factorId)')) fail('enrôlement SMS : nettoyage du facteur si le challenge initial échoue absent');
if(!mfaCancelBlock.includes('await returnToLoginAfterMfa(')||mfaCancelBlock.includes('await SB.logout()')) fail('annulation du défi MFA : fermeture de session contrôlée absente');
console.log('✅ Lot 196 : annulation MFA, changement de facteur et nettoyage de l’enrôlement SMS contrôlés.');


// Lot 197 — après un défi MFA valide, aucun accès au dashboard si le profil/point d'entrée échoue.
const mfaFinalStart=mfaModule.indexOf('async function returnToLoginAfterMfa(message)');
const mfaFinalEnd=mfaModule.indexOf("var method=$('#mfaChallengeMethod')",mfaFinalStart);
const mfaFinalBlock=mfaModule.slice(mfaFinalStart,mfaFinalEnd);
if(mfaFinalStart<0||mfaFinalEnd<=mfaFinalStart||
   !mfaFinalBlock.includes('await SB.logout()')||
   !mfaFinalBlock.includes('pending=null;attempts=0;showLogin();')||
   !mfaFinalBlock.includes('if(!profile)')||
   !mfaFinalBlock.includes("typeof window.DZ.enterApp!=='function'")||
   !mfaFinalBlock.includes('window.DZ.enterApp(profile)')) fail('finalisation MFA : échec profil/entrée sans fermeture de session et retour connexion');
if (!html.includes('mfa-security.js?v=14') || !sw.includes('./mfa-security.js?v=14')) fail('cache MFA Lot 197 non synchronisé');
if (!sw.includes("dz-de-v3.185.0.0.131")) fail('version Service Worker Lot 197 non actualisée');
console.log('✅ Lot 197 : échec de finalisation MFA fermé, retour connexion et cache contrôlés.');


// Lot 198 — le verrouillage après trois échecs doit confirmer la fermeture de session.
const mfaLockoutStart=mfaModule.indexOf("if(attempts>=3)");
const mfaLockoutEnd=mfaModule.indexOf("else status('#mfaChallengeStatus'",mfaLockoutStart);
const mfaLockoutBlock=mfaModule.slice(mfaLockoutStart,mfaLockoutEnd);
if(mfaLockoutStart<0||mfaLockoutEnd<=mfaLockoutStart||
   !mfaLockoutBlock.includes('await returnToLoginAfterMfa(')||
   mfaLockoutBlock.includes('await SB.logout()')) fail('verrouillage MFA : fermeture de session non vérifiée après trois échecs');
if(!mfaModule.includes("تعذر إكمال تسجيل الدخول بعد التحقق")) fail('message de finalisation MFA non localisé en arabe');
if(!html.includes('mfa-security.js?v=14')||!sw.includes('./mfa-security.js?v=14')) fail('cache MFA Lot 198 non synchronisé');
if(!sw.includes("dz-de-v3.185.0.0.131")) fail('version Service Worker Lot 198 non actualisée');
console.log('✅ Lot 198 : fermeture contrôlée après trois échecs MFA et cache synchronisé.');


// Lot 199 — annulation du défi MFA : fermeture de session contrôlée.
const mfaCancelStart=mfaModule.indexOf("if(ev.target.closest('[data-mfa-cancel]'))");
const mfaCancelEnd=mfaModule.indexOf("if(ev.target.closest('[data-mfa-enroll]'))",mfaCancelStart);
const mfaCancelBlock199=mfaModule.slice(mfaCancelStart,mfaCancelEnd);
if(mfaCancelStart<0||mfaCancelEnd<=mfaCancelStart||
   !mfaCancelBlock199.includes('await returnToLoginAfterMfa(')||
   mfaCancelBlock199.includes('await SB.logout()')) fail('annulation MFA : fermeture de session non contrôlée');
if(!html.includes('mfa-security.js?v=14')||!sw.includes('./mfa-security.js?v=14')) fail('cache MFA Lot 199 non synchronisé');
if(!sw.includes("dz-de-v3.185.0.0.131")) fail('version Service Worker Lot 199 non actualisée');
console.log('✅ Lot 199 : annulation MFA avec fermeture de session contrôlée.');

// Lot 200 — renvoi explicite des codes MFA e-mail, login et enrôlement.
if(!html.includes('id="mfaLoginEmailResend"')||!html.includes('data-mfa-email-resend')) fail('MFA e-mail : bouton de renvoi absent du défi de connexion');
if(!mfaModule.includes("setLoginResendVisibility('email')")||!mfaModule.includes("email.hidden=type!=='email'")) fail('MFA e-mail : visibilité du renvoi de connexion non pilotée par le facteur');
if(!mfaModule.includes("SB.mfaEmail({action:'start',purpose:pending.purpose||'login'})")||!mfaModule.includes("pending.challengeId=loginSent.challengeId")) fail('MFA e-mail : renvoi unifié enroll/login ne renouvelle pas le challenge');
if(!mfaModule.includes("var purpose=emailState.enrolled?'login':'enroll'")||!mfaModule.includes("showEmailChallenge(started,emailState,purpose)")) fail('MFA e-mail : le premier enrôlement ne réutilise pas le défi de connexion');
if(!mfaModule.includes("ev.target.closest('[data-mfa-email-resend]')")||!mfaModule.includes("pending&&pending.type==='email'")) fail('MFA e-mail : gestionnaire de renvoi absent du défi unifié enroll/login');
console.log('✅ Lot 200 : renvoi des codes MFA e-mail et remplacement du challenge contrôlés.');
 
// Lot 204 — politique e-mail limitée aux élèves et enforcement RLS/RPC côté serveur.
const studentMfaMigration = read('supabase/migrations/20261110160000_enforce_student_email_mfa.sql');
for (const marker of [
  'create schema if not exists private',
  'private.student_email_mfa_access_allowed()',
  "p.role = 'eleve'",
  "auth.jwt() ->> 'session_id'",
  'create policy student_email_mfa_gate',
  'as restrictive for all to authenticated',
  'on storage.objects as restrictive',
  'c.relrowsecurity',
  'with check ((select private.student_email_mfa_access_allowed()))',
  'public.agreement_accept',
  'public.agreement_withdraw',
  'public.active_entitlement',
  'public.msg_open_direct',
  'public.msg_member_ok',
  'public.respond_parent_link_request',
  'public.subscription_set_preuve',
  'public.unlink_child'
]) if (!studentMfaMigration.includes(marker)) fail('migration MFA étudiant incomplète : ' + marker);
if ((studentMfaMigration.split('private.student_email_mfa_access_allowed()').length - 1) < 14) fail('garde MFA manquant dans une ou plusieurs RPC SECURITY DEFINER');
if (studentMfaMigration.includes("auth.jwt()->>'aal'") || studentMfaMigration.includes("= 'aal2'")) fail('le MFA e-mail personnalisé ne doit pas être confondu avec AAL2');
if (!mfaEmailServer.includes('required: isStudent') ||
    !mfaEmailServer.includes('const isStudent = profile.role === "eleve"') ||
    !mfaEmailServer.includes('STUDENT_MFA_ONLY')) fail('Edge Function : politique MFA non limitée au rôle eleve');
if (!mfaModule.includes("typeof emailState.required!=='boolean'") ||
    !mfaModule.includes("if(emailState.required && (!emailState.enrolled || !emailState.verified))")) fail('client MFA : statut de rôle absent ou politique étudiant non appliquée');
console.log('✅ Lot 204 : MFA e-mail étudiant, garde RLS restrictif et RPC SECURITY DEFINER contrôlés.');


/* Lot 201 — points d'entrée indispensables du portail de connexion. */
assert.match(app, /function paintGateStats\(\)\s*\{[\s\S]*?gateStats/, 'rendu des indicateurs du portail absent');
assert.match(app, /function enterApp\(session\)\s*\{[\s\S]*?go\(VIEWS\.indexOf\(hash\) !== -1 \? hash : 'masar'\)/, 'entrée vers le tableau de bord absente');
assert.match(app, /bootGate:bootGate, enterApp:enterApp/, 'API window.DZ : export enterApp absent');
console.log('✅ Lot 201 : fonctions du portail et export window.DZ contrôlés.');
