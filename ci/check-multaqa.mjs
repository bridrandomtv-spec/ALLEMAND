/* ci/check-multaqa.mjs — garde-fous de navigation du ملتقى الطلاب */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const msg = fs.readFileSync('msg.js', 'utf8');
const communityClient = fs.readFileSync('multaqa.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const fails = [];
try { execFileSync(process.execPath, ['--check', 'multaqa.js']); } catch (e) { console.error('❌ multaqa.js : erreur de syntaxe JavaScript'); process.exit(1); }
const has = (condition, message) => { if (!condition) fails.push(message); };
has(/\['dashboard',[\s\S]{0,160}?'msg','multaqa'/.test(app), 'app.js : route multaqa absente de VIEWS/TABS');
has(/function canSeeStudentDashboard\s*\(\)\s*\{[\s\S]{0,220}?s\.role\s*===\s*'eleve'/.test(app), 'app.js : contrôle de rôle élève absent ou affaibli');
has(/if\s*\(view\s*===\s*'multaqa'\s*&&\s*!canSeeStudentDashboard\(\)\)/.test(app), 'app.js : accès direct à #multaqa sans garde de rôle');
has(/t\[0\]\s*!==\s*'multaqa'\s*\|\|\s*canSeeStudentDashboard\(\)/.test(app), 'app.js : onglet principal du ملتقى non filtré par rôle');
has(/item\[0\]\s*!==\s*'multaqa'\s*\|\|\s*canSeeStudentDashboard\(\)/.test(app), 'app.js : raccourci mobile du ملتقى non filtré par rôle');
has(/data-view="multaqa"[^>]*class="view mtq-view"[^>]*hidden/.test(html), 'index.html : vue ملتقى absente ou non masquée initialement');
has(/data-view="msg"/.test(html) && /data-go="msg"[^>]*>💬 الانتقال إلى الرسائل/.test(html), 'index.html : lien distinct vers Messenger absent');
has(/document\.addEventListener\('dz:view'/.test(msg), 'msg.js : écoute du cycle de navigation Messenger absente');
has(/id="mtqApp"/.test(html) && /multaqa\.js\?v=4/.test(html), 'index.html : conteneur et client dynamique du fil absents');
has(/function accessCard\(\)[\s\S]*?data-go="msg"/.test(communityClient), 'multaqa.js : accès direct au formulaire de vérification Messenger absent');
has(/data-go="compte"[^>]*>[\s\S]*?الهوية المدرسية/.test(html), 'index.html : accès identité scolaire depuis le tableau de bord absent');
has(/dz-account-verification[\s\S]*?accountVerificationStatus[\s\S]*?data-go="msg"/.test(app), 'app.js : statut centralisé et accès au formulaire Messenger absents');
has(/multaqa_feed/.test(communityClient) && /multaqa_create_post/.test(communityClient) && /multaqa_create_comment/.test(communityClient), 'multaqa.js : lecture et publication RPC absentes');
has(/multaqa_toggle_reaction/.test(communityClient) && /multaqa_report/.test(communityClient) && /multaqa_comments/.test(communityClient), 'multaqa.js : réactions, commentaires et signalements RPC absents');
has(/verif_statut!==\'verifie\'/.test(communityClient), 'multaqa.js : garde de vérification scolaire côté interface absente');
has(/function esc\(/.test(communityClient) && /esc\(p\.body\)/.test(communityClient), 'multaqa.js : échappement des contenus utilisateurs absent');
has(/function waitForSupabase\(\)/.test(communityClient) && /dz:sbready/.test(communityClient), 'multaqa.js : attente du client Supabase absente');
has(/function updateProfileCard\(\)/.test(communityClient) && /updateProfileCard\(\)/.test(communityClient), 'multaqa.js : profil du membre vérifié non affiché');
has(/multaqa\.js\?v=4/.test(sw), 'sw.js : client communautaire absent du précache');
has(sw.includes("VERSION = 'dz-de-v3.185.0.0.168'") && sw.includes('./app.js?v=3570'), 'sw.js : version et cache du compte synchronisés');


const communitySql = fs.readFileSync('supabase/migrations/202611130002_multaqa_community_feed.sql', 'utf8');
for (const table of ['multaqa_posts','multaqa_comments','multaqa_reactions','multaqa_reports']) {
  has(communitySql.includes('create table if not exists public.' + table), 'migration communauté : table ' + table + ' absente');
  has(new RegExp('alter table public\\.' + table + '\\s+enable row level security').test(communitySql), 'migration communauté : RLS absent pour ' + table);
  has(communitySql.includes('revoke all on public.' + table + ' from public, anon, authenticated'), 'migration communauté : accès REST direct non révoqué pour ' + table);
}
for (const fn of ['multaqa_feed','multaqa_comments','multaqa_create_post','multaqa_create_comment','multaqa_toggle_reaction','multaqa_report','multaqa_delete_own_post','multaqa_delete_own_comment']) {
  has(communitySql.includes('function public.' + fn), 'migration communauté : RPC ' + fn + ' absente');
  has(communitySql.includes('grant execute on function public.' + fn), 'migration communauté : grant RPC ' + fn + ' absent');
  has(communitySql.includes('revoke all on function public.' + fn) && communitySql.includes('from public, anon, authenticated;'), 'migration communauté : révocation préalable RPC ' + fn + ' absente');
}
has((communitySql.match(/p\.role = 'eleve'/g) || []).length >= 8, 'migration communauté : contrôle rôle élève manquant sur une ou plusieurs RPC');
has((communitySql.match(/p\.verif_statut = 'verifie'/g) || []).length >= 6, 'migration communauté : vérification scolaire exigée pour les contenus personnels');
has(communitySql.includes('élève vérifié sans abonnement') && communitySql.includes('compte non vérifié/en attente'), 'migration communauté : distinction vérification/abonnement non documentée');
has(communitySql.includes('author_pseudo text') && communitySql.includes('join public.profiles pr on pr.id = p.author_id'), 'migration communauté : projection publique limitée au pseudo absente');
has(communitySql.includes('my_post boolean') && communitySql.includes('(p.author_id = v_uid)'), 'migration communauté : indicateur auteur minimal absent');
has(communitySql.includes('post_rate_limit') && communitySql.includes('comment_rate_limit'), 'migration communauté : quotas anti-spam absents');
has(communitySql.includes('create table if not exists public.multaqa_posts') && communitySql.includes('Migration appliquée au projet Supabase gratuit actif'), 'migration communauté : périmètre et prérequis de test absents');


if (fails.length) { for (const failure of fails) console.error('❌ ' + failure); process.exit(1); }
console.log('✅ ملتقى الطلاب : route protégée côté interface, navigation desktop/mobile filtrée, Messenger distinct, fil RPC avec vérification, sans données fictives.');
console.log('ℹ️ Contrôle statique uniquement : ne remplace pas des tests multi-comptes ni les autorisations serveur.');
