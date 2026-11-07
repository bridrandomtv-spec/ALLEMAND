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
assert.match(css, /#shell #app \.sd-main\\?\s*\\?\{?display:grid|#shell #app \.sd-main\\?\s*\{[^}]*display:grid/s, 'grille interne du tableau de bord non activée');
assert.match(css, /#shell #app \.sd-subjects-panel[^}]*grid-column:1\\/-1/s, 'panneau matières pleine largeur absent');
assert.match(css, /@media\\(max-width:640px\\)[\\s\\S]*?\.sd-main[^}]*grid-template-columns:minmax\\(0,1fr\\)/, 'grille dashboard mobile absente');


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
assert.match(html, /style-prototype-dz\.css\?v=175/, 'cache CSS v174 non actualisé');
assert.match(html, /masar\.js\?v=3516/, 'cache JS non actualisé');
assert.match(sw, /dz-de-v3\.185\.0\.0\.89/, 'version service worker v3.185 non actualisée');
assert.match(sw, /style-prototype-dz\.css\?v=175/, 'précache CSS v174 non actualisé');
assert.match(sw, /masar\.js\?v=3516/, 'précache JS non actualisé');

assert.match(html, /app\.js\?v=3547/, 'cache app.js non actualisé');
assert.match(sw, /app\.js\?v=3547/, 'précache app.js non actualisé');

console.log('✅ مسارك : calculs réels par unité, prochaine séance, compétences, cartes et caches contrôlés');
