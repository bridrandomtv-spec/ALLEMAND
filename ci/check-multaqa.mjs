/* ci/check-multaqa.mjs — garde-fous de navigation du ملتقى الطلاب */
import fs from 'node:fs';
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const msg = fs.readFileSync('msg.js', 'utf8');
const communityClient = fs.readFileSync('multaqa.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
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
has(/id="mtqApp"/.test(html) && /multaqa\.js\?v=1/.test(html), 'index.html : conteneur et client dynamique du fil absents');
has(/multaqa_feed/.test(communityClient) && /multaqa_create_post/.test(communityClient) && /multaqa_create_comment/.test(communityClient), 'multaqa.js : lecture et publication RPC absentes');
has(/multaqa_toggle_reaction/.test(communityClient) && /multaqa_report/.test(communityClient) && /multaqa_comments/.test(communityClient), 'multaqa.js : réactions, commentaires et signalements RPC absents');
has(/verif_statut!==\'verifie\'/.test(communityClient), 'multaqa.js : garde de vérification scolaire côté interface absente');
has(/function esc\(/.test(communityClient) && /esc\(p\.body\)/.test(communityClient), 'multaqa.js : échappement des contenus utilisateurs absent');
has(/multaqa\.js\?v=1/.test(sw), 'sw.js : client communautaire absent du précache');


const communitySql = fs.readFileSync('supabase/migrations/202611130002_multaqa_community_feed.sql', 'utf8');
for (const table of ['multaqa_posts','multaqa_comments','multaqa_reactions','multaqa_reports']) {
  has(communitySql.includes('create table if not exists public.' + table), 'migration communauté : table ' + table + ' absente');
  has(new RegExp('alter table public\\.' + table + '\\s+enable row level security').test(communitySql), 'migration communauté : RLS absent pour ' + table);
  has(communitySql.includes('revoke all on public.' + table + ' from public, anon, authenticated'), 'migration communauté : accès REST direct non révoqué pour ' + table);
}
for (const fn of ['multaqa_feed','multaqa_comments','multaqa_create_post','multaqa_create_comment','multaqa_toggle_reaction','multaqa_report','multaqa_delete_own_post','multaqa_delete_own_comment']) {
  has(communitySql.includes('function public.' + fn), 'migration communauté : RPC ' + fn + ' absente');
  has(communitySql.includes('grant execute on function public.' + fn), 'migration communauté : grant RPC ' + fn + ' absent');
}
has((communitySql.match(/p\.role = 'eleve'/g) || []).length >= 8, 'migration communauté : contrôle rôle élève manquant sur une ou plusieurs RPC');
has((communitySql.match(/p\.verif_statut = 'verifie'/g) || []).length >= 6, 'migration communauté : vérification scolaire exigée pour les contenus personnels');
has(communitySql.includes('élève vérifié sans abonnement') && communitySql.includes('compte non vérifié/en attente'), 'migration communauté : distinction vérification/abonnement non documentée');
has(communitySql.includes('author_pseudo text') && communitySql.includes('join public.profiles pr on pr.id = p.author_id'), 'migration communauté : projection publique limitée au pseudo absente');
has(communitySql.includes('my_post boolean') && communitySql.includes('(p.author_id = v_uid)'), 'migration communauté : indicateur auteur minimal absent');
has(communitySql.includes('post_rate_limit') && communitySql.includes('comment_rate_limit'), 'migration communauté : quotas anti-spam absents');
has(communitySql.includes('NON exécutée sur Supabase') && communitySql.includes('Tests PostgreSQL isolés obligatoires'), 'migration communauté : statut préparatoire et tests requis non documentés');


if (fails.length) { for (const failure of fails) console.error('❌ ' + failure); process.exit(1); }
console.log('✅ ملتقى الطلاب : route protégée côté interface, navigation desktop/mobile filtrée, Messenger distinct, fil RPC avec vérification, sans données fictives.');
console.log('ℹ️ Contrôle statique uniquement : ne remplace pas des tests multi-comptes ni les autorisations serveur.');
