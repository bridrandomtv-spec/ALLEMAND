import { readFileSync } from 'node:fs';
const fail = [];
const ok = (c, label) => { if (c) { console.log('  ✅ ' + label); } else { fail.push(label); console.log('  ❌ ' + label); } };
console.log('== check-msg · messagerie EduDZ ==');
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
const sbjs = readFileSync('supabase/supabase.js', 'utf8');
const msgjs = readFileSync('msg.js', 'utf8');
const idx = readFileSync('index.html', 'utf8');
const sw = readFileSync('sw.js', 'utf8');
const app = readFileSync('app.js', 'utf8');
const TABLES = ['msg_conversations','msg_members','msg_messages','msg_attachments','msg_reports','msg_blocks','msg_log'];
for (const t of TABLES) {
  ok(sql.includes('create table if not exists public.' + t), 'table ' + t);
  ok(new RegExp('alter table public\\.' + t + '\\s+enable row level security').test(sql), 'RLS activé ' + t);
}
ok(!/grant[^;\n]*\sto\s+anon/.test(sql), 'aucun GRANT au rôle anon');
ok((sql.match(/to authenticated/g) || []).length >= 7, 'grants authenticated présents');
for (const f of ['msg_is_member','msg_is_moderator','msg_can_dm','msg_not_blocked','msg_member_ok','profiles_verif_guard'])
  ok(sql.includes('function public.' + f), 'fonction ' + f);
for (const tr of ['msg_tr_rate','msg_tr_direct','msg_tr_log_rep','msg_tr_log_att','msg_tr_log_del','profiles_tr_verif'])
  ok(sql.includes('create trigger ' + tr), 'trigger ' + tr);
ok(sql.includes("pa.verif_statut = 'verifie'"), 'DM = deux profils vérifiés (Lot 6)');
ok(/create policy "msg members ajout"[\s\S]{0,400}?msg_member_ok/.test(sql), 'adhésion groupes = msg_member_ok (Lot 1b)');
ok(/create policy "msg conv creation"[\s\S]{0,400}?msg_is_moderator/.test(sql), 'création groupe = modérateur (Lot 5b)');
ok(sql.includes("bucket_id = 'prive'") && sql.includes("(storage.foldername(name))[1] = 'msg'"), 'stockage scopé prive/msg/');
ok(sql.includes('alter publication supabase_realtime add table public.msg_messages'), 'realtime armé');
ok(!/service_role/i.test(sbjs), 'client Supabase : aucune clé service_role');
const METHODS = ['msgConvs','msgMessages','msgSend','msgCanDm','msgOpenDirect','msgGroups','msgReport','msgBlock','msgUnblock','msgEdit','msgDelete','msgUpload','msgSubscribe','msgReportsOpen','msgHandle','msgCreateGroup','msgLogLast','msgMyVerification','msgRequestVerification','msgVerificationQueue','msgSetVerification'];
for (const m of METHODS) ok(sbjs.includes('function ' + m), 'méthode SB.' + m);
ok(!/\.from\('msg_/.test(msgjs), 'vue msg.js : aucune écriture directe dans msg_*');
ok(idx.includes('data-view="msg"') && idx.includes('msg.js?v='), 'vue + script câblés dans index.html');
ok(app.includes('msg-nav-shortcut') && app.includes('data-go=\"msg\"'), 'Messenger affiché comme raccourci desktop direct');
ok(/const VIEWS\s*=\s*\[[^\]]*'msg'/.test(app), 'route msg autorisée par le routeur principal');
ok(/\['msg',\s*'💬 الرسائل'\]/.test(app), 'Messenger présent dans la navigation rapide mobile');
ok(app.includes("'english', 'msg'"), 'Messenger réservé au raccourci desktop sans doublon de secours');
ok(!/tabs\.filter\(t\s*=>\s*t\[0\]\s*!==\s*'msg'/.test(app), 'Messenger non exclu du menu');

const dmStart = sbjs.indexOf('async function msgOpenDirect(');
const dmEnd = sbjs.indexOf('\nasync function msgGroups(', dmStart);
const dmMethod = sbjs.slice(dmStart, dmEnd);
ok(dmStart >= 0 && dmEnd > dmStart &&
   dmMethod.includes("err:'msg_invitation_requise'") &&
   !/\.from\('msg_conversations'\)\.insert/.test(dmMethod) &&
   !/\.from\('msg_members'\)\.insert/.test(dmMethod),
   'nouveau DM interdit côté client avant invitation acceptée');


// Lot 359 — interface visible de la messagerie en arabe RTL.
ok(msgjs.includes('💬 الرسائل — منصة المراسلة الوطنية للتلاميذ'), 'accueil Messenger entièrement en arabe');
ok(msgjs.includes('ابحث في محادثاتي ومجموعاتي') && msgjs.includes('فتح المحادثة'), 'recherche et actions de conversation en arabe');
ok(msgjs.includes('إرسال ➤') && msgjs.includes('إرفاق ملف'), 'rédaction et pièces jointes en arabe');
ok(!/Messages — compte cloud requis|Groupes officiels|Ouvrir la discussion|Envoyer ➤|Actualiser|Rechercher dans mes conversations|Partage et reçois|Les messages arrivent instantanément|Modération \\(signalements/.test(msgjs), 'absence des anciens libellés français visibles prioritaires');
ok(idx.includes('المراسلة الوطنية — مجموعات دراسية حسب الولاية والمستوى والشعبة'), 'bandeau de la vue messagerie en arabe');
ok(idx.includes('msg.js?v=3513'), 'version cache du module de messagerie actualisée');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.145'") && sw.includes("./msg.js?v=3513"), 'service worker et précache Messenger synchronisés');
ok(!/isميغابايتd0|isميغابايتd|ميغابايتdération/.test(msgjs), 'identifiants JavaScript préservés après traduction');

// Lot 359-C — ne pas réintroduire le dernier libellé français de pièce jointe.
ok(!/indisponible pour ce compte/.test(msgjs), 'aucun message de pièce jointe en français');

if (fail.length) { console.error('::error:: check-msg : ' + fail.length + ' échec(s)'); process.exit(1); }
console.log('== check-msg : TOUT PASSE ==');
