/* ci/check-multaqa.mjs — garde-fous de navigation du ملتقى الطلاب */
import fs from 'node:fs';
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const msg = fs.readFileSync('msg.js', 'utf8');
const fails = [];
const has = (condition, message) => { if (!condition) fails.push(message); };
has(/\['dashboard',[\s\S]{0,160}?'msg','multaqa'/.test(app), 'app.js : route multaqa absente de VIEWS/TABS');
has(/function canSeeStudentDashboard\s*\(\)\s*\{[\s\S]{0,220}?s\.role\s*===\s*'eleve'/.test(app), 'app.js : contrôle de rôle élève absent ou affaibli');
has(/if\s*\(view\s*===\s*'multaqa'\s*&&\s*!canSeeStudentDashboard\(\)\)/.test(app), 'app.js : accès direct à #multaqa sans garde de rôle');
has(/t\[0\]\s*!==\s*'multaqa'\s*\|\|\s*canSeeStudentDashboard\(\)/.test(app), 'app.js : onglet principal du ملتقى non filtré par rôle');
has(/item\[0\]\s*!==\s*'multaqa'\s*\|\|\s*canSeeStudentDashboard\(\)/.test(app), 'app.js : raccourci mobile du ملتقى non filtré par rôle');
has(/data-view="multaqa"[^>]*class="view mtq-view"[^>]*hidden/.test(html), 'index.html : vue ملتقى absente ou non masquée initialement');
has(/data-view="msg"/.test(html) && /data-go="msg"[^>]*>💬 الانتقال إلى الرسائل/.test(html), 'index.html : lien distinct vers Messenger absent');
has(/document\.addEventListener\('dz:view'/.test(msg), 'msg.js : écoute du cycle de navigation Messenger absente');
has(/نسخة أولية للواجهة/.test(html) && /لا تُقرأ أي بيانات طلاب/.test(html), 'index.html : avertissement de maquette et absence de lecture des données absent');
if (fails.length) { for (const failure of fails) console.error('❌ ' + failure); process.exit(1); }
console.log('✅ ملتقى الطلاب : route protégée côté interface, navigation desktop/mobile filtrée, Messenger distinct, maquette sans données élèves.');
console.log('ℹ️ Contrôle statique uniquement : ne remplace pas des tests multi-comptes ni les autorisations serveur.');
