import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const js = read('masar.js');
const css = read('style-prototype-dz.css');
const html = read('index.html');
const sw = read('sw.js');
const app = read('app.js');


assert.match(app, /sd-learning-map/, 'carte pédagogique complète absente');
assert.match(app, /sd-map-unit/, 'cartes des unités absentes');
assert.match(app, /sd-map-lesson/, 'jalons réels des séances absents');
assert.match(app, /loadSeancesFor\(u\.n\)/, 'état des séances par unité absent');
assert.match(app, /nextInfo\.prochaine/, 'action de prochaine séance absente');
assert.match(css, /\.sd-map-units/, 'grille de la carte pédagogique absente');
assert.match(css, /html\[data-theme="dark"\].*sd-map-unit/s, 'thème sombre de la carte pédagogique absent');
assert.match(html, /خريطة التعلم البيداغوجية/, 'titre de la carte pédagogique absent');

// Tableau de bord étudiant : la grille interne doit être active et ses panneaux structurés.
assert.match(html, /class="sd-panel sd-path-panel"/, 'panneau parcours pleine largeur absent');
assert.match(html, /class="sd-panel sd-subjects-panel"/, 'panneau matières absent');
assert.match(html, /class="sd-panel sd-skills-panel"/, 'panneau compétences absent');
assert.match(html, /class="sd-panel sd-recommend-panel"/, 'panneau recommandation absent');
assert.match(html, /class="sd-panel sd-messages-panel"/, 'panneau messages absent');
assert.match(html, /id="sdMessages"/, 'conteneur des messages du tableau de bord absent');
assert.match(app, /function renderStudentDashboardMessages\(host\)/, 'chargement des conversations réelles absent');
assert.match(app, /window\.SB\.msgConvs\(\)/, 'source Supabase des conversations absente');
assert.match(app, /renderStudentDashboardMessages\(\$\('#sdMessages'\)\)/, 'rendu des conversations non branché au tableau de bord');
assert.match(css, /#shell #app \.sd-main\{[^}]*display:grid/s, 'grille interne du tableau de bord non activée');
assert.match(html, /class="sd-panel sd-unit-progress-panel"/, 'panneau progression unités absent');
assert.match(html, /id="sdUnitProgress"/, 'conteneur progression unités absent');
assert.match(css, /\.sd-subjects-panel\{grid-column:span 4/, 'proportion matières 2/3 absente');
assert.match(css, /\.sd-unit-progress-panel\{grid-column:span 2/, 'proportion unités 1/3 absente');
assert.match(css, /@media\(min-width:641px\) and \(max-width:980px\)[\s\S]*?\.sd-unit-progress-panel\{grid-column:1\/-1\}/, 'panneaux tablette pleine largeur absents');
assert.match(css, /\.sd-subject-status\{max-width:100%;line-height:1\.5;text-align:center;white-space:normal\}/, 'statuts matière adaptatifs absents');
assert.match(css, /\.sd-unit-chart-item small,#shell #app \.sd-unit-chart-item em\{font-size:10px/, 'libellés du graphique unités trop petits');
assert.match(css, /\.sd-skill-row small,#shell #app \.sd-skill-row em\{font-size:11px/, 'détails des résultats quiz trop petits');
assert.match(app, /unitProgressHost\.innerHTML=.*sd-unit-chart/s, 'graphique réel des unités absent');
assert.match(app, /لا توجد بيانات كافية بعد/, 'état vide du graphique absent');
assert.match(css, /\.sd-skills-panel\{[^}]*grid-column:span 4/s, 'proportion compétences 2/3 absente');
assert.match(css, /\.sd-recommend-panel\{[^}]*grid-column:span 2/s, 'proportion recommandations 1/3 absente');
assert.match(css, /\.sd-goals-panel,#shell #app \.sd-achievements-panel\{grid-column:span 3/s, 'équilibre objectifs/badges absent');

assert.match(css, /@media\(max-width:640px\)[\s\S]*?\.sd-main\{[^}]*grid-template-columns:minmax\(0,1fr\)/, 'grille dashboard mobile absente');


assert.match(js, /function progressData\(\)/, 'calcul de progression absent');
assert.match(js, /loadSeancesFor\(u\.n\)/, 'progression par unité absente');
assert.match(js, /activeLevel\(\)/, 'niveau du compte non résolu');
assert.doesNotMatch(js, /window\.prochaineSeance\s*\(/, 'ancienne prochaineSeance non filtrée réutilisée');
assert.match(js, /data-masar-unit/, 'action de prochaine séance absente');
assert.match(js, /MEMOIRE\.carteErreurs/, 'source des compétences absente');
assert.match(js, /ms-unit-grid/, 'cartes de progression par unité absentes');
assert.match(css, /grid-template-areas:"hero hero" "next chart" "progress progress" "units units"/, 'grille desktop مسارك absente');
assert.match(css, /grid-template-areas:"hero" "next" "chart" "progress" "units"/, 'grille mobile مسارك absente');
assert.match(css, /html\[data-theme="dark"\].*ms-unit-card/s, 'thème sombre des unités absent');
assert.match(html, /style-prototype-dz\.css\?v=191/, 'cache CSS v184 non actualisé');
assert.match(html, /masar\.js\?v=3516/, 'cache JS non actualisé');
assert.match(sw, /dz-de-v3\.185\.0\.0\.112/, 'version service worker v3.185 non actualisée');
assert.match(sw, /style-prototype-dz\.css\?v=191/, 'précache CSS v184 non actualisé');
assert.match(sw, /masar\.js\?v=3516/, 'précache JS non actualisé');

assert.match(html, /app\.js\?v=3558/, 'cache app.js non actualisé');
assert.match(sw, /app\.js\?v=3558/, 'précache app.js non actualisé');


assert.match(app, /function studentSession\(\)/, 'le coach doit vérifier la session élève');
assert.match(app, /userStorageKey\('dismissed',session\)/, 'la fermeture du coach doit être mémorisée par compte');
assert.match(app, /userStorageKey\('done',session\)/, 'la fin du coach doit être mémorisée par compte');
assert.match(app, /i\+1>=STEPS\.length/, 'le coach doit terminer à la dernière étape');
assert.match(app, /view:"revision"/, 'la destination de révision doit être valide');
assert.doesNotMatch(app, /view:"memoire"/, 'ancienne destination mémoire invalide encore présente');
assert.doesNotMatch(app, /تشخيص مستواك|Diagnosetest/, 'le coach ne doit pas promettre un diagnostic inexistant');


assert.ok(app.includes('"Ich trage einen Hut. → « einen » masc Akk.", "t"'), 'corrigé du mini-quiz : accusatif masculin de Hut incorrect');
assert.ok(app.includes('"Er lebt in einer reichen Gesellschaft. → « einer » Datif.", "t"'), 'corrigé du mini-quiz : datif après in incorrect');

assert.doesNotMatch(app, /كل أسبوع:|1-3 مرات|تصحيح فوري/, 'le coach ne doit pas promettre une fréquence ou une correction non garantie');


assert.match(css, /\.sd-subject-name\{font-size:15px/, 'typographie du nom de matière alignée sur le HTML réel absente');
assert.match(css, /\.sd-subject-meta\{font-size:11px/, 'lisibilité des métadonnées de matière absente');
assert.match(css, /\.sd-subject-progress>div\{font-size:11px/, 'lisibilité de la progression de matière absente');
assert.match(css, /\.sd-subject-open\{font-size:12px/, 'taille du lien matière absente');


assert.match(app, /subjectTones=\{allemand:'amber',math:'indigo',physique:'violet'/, 'palette chromatique des matières absente');
assert.match(app, /tone-'\+tone/, 'identité chromatique non reliée aux cartes matières');
assert.match(css, /\.sd-subject-card\.tone-indigo\{--sd-subject-accent:#4f46e5/, 'palette indigo des matières absente');
assert.match(css, /\.sd-subject-card\.tone-emerald\{--sd-subject-accent:#059669/, 'palette émeraude des matières absente');
assert.match(css, /html\[data-theme="dark"\].*sd-subject-card\[class\*="tone-"\]/s, 'palette des matières en thème sombre absente');

assert.match(app, /role="group"[^>]*aria-label="نشاط آخر سبعة أيام"/, 'description accessible du graphique hebdomadaire absente');
assert.ok(css.includes('@media(min-width:981px){\n  #shell #app .sd-hero-metrics{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}'), 'composition compacte des indicateurs du bandeau étudiant absente');
assert.ok(app.includes("role=\"img\" aria-label=\"'+names[d.getDay()]+' '+key+' : '+(on?'jour actif':'aucune activité enregistrée')+'\""), 'libellés accessibles des jours actifs absents');
assert.match(css,/sd-goal-unit \.sd-goal-icon\{background:linear-gradient\(145deg,#3b82f6,#1d4ed8\)/,'carte objectif pédagogique bleue absente');
assert.match(css,/sd-goal-quiz \.sd-goal-icon\{background:linear-gradient\(145deg,#8b5cf6,#6d28d9\)/,'carte objectif quiz violette absente');
assert.match(css,/sd-goal-review \.sd-goal-icon\{background:linear-gradient\(145deg,#fbbf24,#d97706\)/,'carte objectif révision dorée absente');
assert.match(css,/sd-achievement\.is-unlocked\.is-tone-2>span/,'palette stable par catégorie des badges absente');
assert.match(css,/sd-achievement\.is-unlocked\.is-tone-6>span/,'sixième catégorie de badge absente');
assert.doesNotMatch(css,/sd-achievement\.is-unlocked:nth-child/,'palette badge dépendante de la position DOM');
assert.match(css,/prefers-reduced-motion:reduce/,'respect de la réduction des animations absent');
console.log('✅ مسارك : données réelles, objectifs et badges colorés, responsive, caches contrôlés');

// Lot 167 — garde-fous visuels objectifs et badges.

assert.match(css,/sd-goal-unit \.sd-goal-icon\{background:linear-gradient\(145deg,#3b82f6,#1d4ed8\)/,'carte objectif pédagogique bleue absente');
assert.match(css,/sd-goal-quiz \.sd-goal-icon\{background:linear-gradient\(145deg,#8b5cf6,#6d28d9\)/,'carte objectif quiz violette absente');
assert.match(css,/sd-goal-review \.sd-goal-icon\{background:linear-gradient\(145deg,#fbbf24,#d97706\)/,'carte objectif révision dorée absente');
assert.match(css,/sd-achievement\.is-unlocked\.is-tone-2>span/,'palette stable par catégorie des badges absente');
assert.match(css,/sd-achievement\.is-unlocked\.is-tone-6>span/,'sixième catégorie de badge absente');
assert.doesNotMatch(css,/sd-achievement\.is-unlocked:nth-child/,'palette badge dépendante de la position DOM');
assert.match(css,/prefers-reduced-motion:reduce/,'respect de la réduction des animations absent');

// Lot 168 — l'assistant du tableau de bord est une bannière pleine largeur, hors colonne latérale.
assert.ok(html.indexOf('sd-path-panel') < html.indexOf('sd-ai-feature'), 'assistant pédagogique doit suivre les panneaux du tableau de bord, comme dans le prototype étudiant');
assert.ok(html.indexOf('sd-ai-feature') < html.indexOf('sd-quick'), 'les raccourcis complémentaires ne doivent pas précéder le parcours et les panneaux du prototype étudiant');
assert.doesNotMatch(html, /<aside class="sd-aside">\s*<\/section>/, 'balise section orpheline dans la colonne latérale');
assert.match(css, /\.sd-ai-feature\{[^}]*grid-template-areas:"head action" "copy action" "caps action"/, 'composition horizontale de l’assistant absente');
assert.match(css, /@media\(max-width:720px\)[\s\S]*?\.sd-ai-feature\{[^}]*grid-template-areas:"head" "copy" "caps" "action"/, 'adaptation mobile de la bannière assistant absente');

assert.match(app,/sd-unit-chart-legend/,'légende des états de progression absente');
assert.match(app,/sd-unit-chart-item is-/,'état réel de chaque unité absent du graphique');
assert.match(css,/sd-unit-chart-item\.is-complete/,'couleur des unités terminées absente');
assert.match(css,/sd-unit-chart-item\.is-started/,'couleur des unités commencées absente');
assert.match(css,/sd-unit-chart-item\.is-pending/,'couleur des unités non commencées absente');
assert.match(css,/sd-skill-row\.is-tone-1/,'première couleur stable des résultats par unité absente');
assert.match(css,/sd-skill-row\.is-tone-6/,'sixième couleur stable des résultats par unité absente');
assert.match(css,/html\[data-theme="dark"\].*sd-skill-row/s,'adaptation sombre des indicateurs colorés absente');
assert.match(css,/sd-unit-chart-legend/,'légende graphique absente');

assert.match(css,/sd-subject-icon\{width:48px;height:48px/,'icône des cartes matières trop petite');
assert.match(css,/sd-subject-name\{font-size:16px/,'typographie desktop des matières absente');
assert.match(css,/sd-subject-meta\{font-size:12px/,'descriptions des matières trop petites');
assert.ok(css.includes('#shell #app [data-view="dashboard"] .sd-subject-grid{grid-template-columns:minmax(0,1fr);gap:12px}'),'grille matières mobile à une colonne absente');

assert.match(app,/sd-skill-row is-tone-/,'palette stable par unité absente');
assert.match(app,/ألوان البطاقات للتمييز بين الوحدات فقط/,'explication de la signification des couleurs absente');
assert.doesNotMatch(css,/sd-skill-row:nth-child\(6n/,'palette compétences dépendante de la position DOM');
