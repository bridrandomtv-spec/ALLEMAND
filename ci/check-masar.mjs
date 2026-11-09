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
assert.match(css, /\.sd-subjects-panel[^}]*grid-column:1\/-1/s, 'panneau matières pleine largeur absent');
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
assert.match(html, /style-prototype-dz\.css\?v=179/, 'cache CSS v176 non actualisé');
assert.match(html, /masar\.js\?v=3516/, 'cache JS non actualisé');
assert.match(sw, /dz-de-v3\.185\.0\.0\.97/, 'version service worker v3.185 non actualisée');
assert.match(sw, /style-prototype-dz\.css\?v=179/, 'précache CSS v176 non actualisé');
assert.match(sw, /masar\.js\?v=3516/, 'précache JS non actualisé');

assert.match(html, /app\.js\?v=3551/, 'cache app.js non actualisé');
assert.match(sw, /app\.js\?v=3551/, 'précache app.js non actualisé');


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


assert.match(css, /\\.sd-subject-name\\{font-size:15px/, 'typographie du nom de matière alignée sur le HTML réel absente');
assert.match(css, /\\.sd-subject-meta\\{font-size:11px/, 'lisibilité des métadonnées de matière absente');
assert.match(css, /\\.sd-subject-progress>div\\{font-size:11px/, 'lisibilité de la progression de matière absente');
assert.match(css, /\\.sd-subject-open\\{font-size:12px/, 'taille du lien matière absente');

console.log('✅ مسارك : calculs réels par unité, prochaine séance, compétences, cartes et caches contrôlés');
