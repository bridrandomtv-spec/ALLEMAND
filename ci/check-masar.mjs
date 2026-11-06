import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const js = read('masar.js');
const css = read('style-prototype-dz.css');
const html = read('index.html');
const sw = read('sw.js');

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
assert.match(html, /style-prototype-dz\.css\?v=151/, 'cache CSS v151 non actualisé');
assert.match(html, /masar\.js\?v=3516/, 'cache JS non actualisé');
assert.match(sw, /dz-de-v3\.178\.0\.0\.57/, 'version service worker v3.179 non actualisée');
assert.match(sw, /style-prototype-dz\.css\?v=151/, 'précache CSS v151 non actualisé');
assert.match(sw, /masar\.js\?v=3516/, 'précache JS non actualisé');

assert.match(html, /app\.js\?v=3537/, 'cache app.js non actualisé');
assert.match(sw, /app\.js\?v=3537/, 'précache app.js non actualisé');

console.log('✅ مسارك : calculs réels par unité, prochaine séance, compétences, cartes et caches contrôlés');
