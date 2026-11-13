import { readFileSync } from 'node:fs';
const fail = [];
const ok = (c, label) => { if (c) { console.log('  ✅ ' + label); } else { fail.push(label); console.log('  ❌ ' + label); } };
console.log('== check-msg · messagerie EduDZ ==');
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
const sbjs = readFileSync('supabase/supabase.js', 'utf8');
const msgjs = readFileSync('msg.js', 'utf8');
const billing = readFileSync('billing.js', 'utf8');
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
ok(!/Messages — compte cloud requis|Groupes officiels|Ouvrir la discussion|Envoyer ➤|Actualiser|Rechercher dans mes conversations|Partage et reçois|Les messages arrivent instantanément|Modération \(signalements/.test(msgjs), 'absence des anciens libellés français visibles prioritaires');
ok(idx.includes('المراسلة الوطنية — مجموعات دراسية حسب الولاية والمستوى والشعبة'), 'bandeau de la vue messagerie en arabe');
ok(idx.includes('msg.js?v=3517'), 'version cache du module de messagerie actualisée');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.155'") && sw.includes("./msg.js?v=3517") && sw.includes("./style-prototype-dz.css?v=202"), 'service worker et précache Messenger synchronisés');
ok(!/isميغابايتd0|isميغابايتd|ميغابايتdération/.test(msgjs), 'identifiants JavaScript préservés après traduction');

// Lot 359-C — ne pas réintroduire le dernier libellé français de pièce jointe.
ok(!/indisponible pour ce compte/.test(msgjs), 'aucun message de pièce jointe en français');

// Lot 437 — contrat de consentement Messenger (migration préparée, non exécutée).
const inviteSql = readFileSync('supabase/migrations/202611130001_msg_invitation_consent.sql', 'utf8');
ok(inviteSql.includes('create table if not exists public.msg_invites'), 'table invitations Messenger versionnée');
ok(inviteSql.includes('msg_invite_send') && inviteSql.includes('msg_invite_accept') &&
   inviteSql.includes('msg_invite_decline') && inviteSql.includes('msg_invite_cancel'),
   'RPC distinctes envoyer/accepter/refuser/annuler');
ok(inviteSql.includes("revoke execute on function public.msg_open_direct(uuid) from public, anon, authenticated"),
   'ancienne RPC directe sans consentement révoquée');
ok(inviteSql.includes("type = 'groupe'") && inviteSql.includes('public.msg_is_moderator(auth.uid())'),
   'création directe interdite par policy');
ok(inviteSql.includes('msg_guard_direct_consent') && inviteSql.includes('msg_invitation_requise'),
   'ajout de membres DM protégé côté serveur');
ok(/create or replace function public\.msg_member_ok[\s\S]*?c\.type='groupe'/.test(inviteSql),
   'auto-ajout direct d’un membre à un DM existant interdit');
ok(inviteSql.includes('msg_pair_blocked') && /create or replace function public\.msg_is_member[\s\S]*?c\.type = 'direct'[\s\S]*?public\.msg_pair_blocked\(uid,peer\.user_id\)/.test(inviteSql),
   'blocage bilatéral appliqué aux accès DM');


ok(!/^as \$$/m.test(inviteSql) && !/^\$;$/m.test(inviteSql),
   'quotage dollar SQL valide pour toutes les fonctions');
ok(/create or replace function public\.msg_is_member[\s\S]*?uid = auth\.uid\(\)/.test(inviteSql),
   'msg_is_member reste limité à l’utilisateur connecté');
ok(/create or replace function public\.msg_member_ok[\s\S]*?uid = auth\.uid\(\)/.test(inviteSql),
   'msg_member_ok ne révèle pas les droits d’un autre profil');
ok(/create or replace function public\.msg_not_blocked[\s\S]*?snd = auth\.uid\(\)/.test(inviteSql),
   'msg_not_blocked reste lié à l’expéditeur connecté');
ok(/revoke all on function public\.msg_pair_blocked\(uuid, uuid\) from public, anon, authenticated/.test(inviteSql),
   'fonction interne de blocage non exposée comme oracle');
ok(/status='expired'[\s\S]*?return null/.test(inviteSql) &&
   !/status='expired'[\s\S]*?raise exception 'invite_expired'/.test(inviteSql),
   'expiration persistante sans rollback de la transaction');

ok(/msg_invite_send[\s\S]*?pg_advisory_xact_lock\(hashtextextended\(v_sender::text, 0\)\)/.test(inviteSql),
   'limite 24 h sérialisée contre les envois concurrents');
ok(/Première lecture sans verrou de ligne[\s\S]*?pg_advisory_xact_lock[\s\S]*?Relecture verrouillée après le verrou de paire/.test(inviteSql),
   'acceptation verrouille la paire avant la ligne pour éviter les deadlocks réciproques');
ok(/Une invitation réciproque devenue redondante[\s\S]*?status='cancelled'/.test(inviteSql),
   'invitation réciproque annulée après ouverture du DM');

ok(/msg_invite_send[\s\S]*?status='expired'[\s\S]*?created_at <= now\(\) - interval '7 days'/.test(inviteSql),
   'anciennes invitations sortantes expirées avant une nouvelle demande');
ok(/msg_invite_decline[\s\S]*?set status = 'expired'[\s\S]*?set status = 'declined'/.test(inviteSql),
   'refus d’une demande ancienne la marque expirée, pas refusée');
ok(/msg_invite_cancel[\s\S]*?set status = 'expired'[\s\S]*?set status = 'cancelled'/.test(inviteSql),
   'annulation d’une demande ancienne la marque expirée');

ok(/alter publication supabase_realtime add table public\.msg_invites/.test(inviteSql),
   'notifications d’invitation publiées en Realtime');
ok(/create policy msg_invites_participant_read[\s\S]*?auth\.uid\(\) in \(sender_id, recipient_id\)/.test(inviteSql),
   'événements Realtime limités aux deux participants par RLS');
ok(inviteSql.includes('NON exécutée sur Supabase') && inviteSql.includes('Tests obligatoires'),
   'migration identifiée comme non appliquée et tests documentés');

if (fail.length) { console.error('::error:: check-msg : ' + fail.length + ' échec(s)'); process.exit(1); }
console.log('== check-msg : TOUT PASSE ==');

// Lot 450 — vérification scolaire gratuite, indépendante de l'abonnement.
ok(msgjs.includes('رقم التسجيل المدرسي (مجاني)'), 'formulaire Messenger indique la vérification scolaire gratuite');
ok(sbjs.includes('async function msgRequestVerification(schoolRegistrationNumber, section)'), 'fonction de demande de vérification scolaire présente');
ok(sbjs.includes("update({ verif_statut:'en_attente', matricule:number"), 'demande déposée sur le profil du compte courant');
ok(!msg.includes('رقم الاشتراك') && !msg.includes('رقم اشتراك'), 'aucun ancien libellé abonnement dans le parcours de vérification');
ok(msg.includes('رقم التسجيل المدرسي') && msg.includes('التحقق المدرسي مجاني'), 'parcours de vérification gratuit et libellé scolaire cohérent');
const verificationFn = sbjs.slice(sbjs.indexOf('async function msgRequestVerification('), sbjs.indexOf('async function msgVerificationQueue('));
ok(!verificationFn.includes(".from('subscriptions')"), 'vérification scolaire sans contrôle d’abonnement payant');

if (fail.length) { console.error('::error:: check-msg Lot 360 : ' + fail.length + ' échec(s)'); process.exit(1); }

ok(msgjs.includes('msg-pro-hero') && msgjs.includes('msg-pro-stats'), 'nouvelle hiérarchie pédagogique Messenger');
ok(msgjs.includes("x.titre || ('مجموعة '+") && !msgjs.includes("('مجموعة '("), 'libellé de groupe construit sans appel de chaîne invalide');
ok(msgjs.includes("closest('[data-conv],[data-act],[data-report],[data-msg-filter]')"), 'filtres Messenger accessibles via délégation de clic');
ok(idx.includes('style-prototype-dz.css?v=202') && idx.includes('msg.js?v=3517'), 'versions de ressources Messenger actualisées');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.155'") && sw.includes('./style-prototype-dz.css?v=202') && sw.includes('./msg.js?v=3517'), 'précache synchronisé avec la nouvelle interface');

ok(msgjs.includes('msg-thread-topbar') && msgjs.includes('msg-conversation-panel') && msgjs.includes('msg-composer-mark'), 'écran de conversation structuré et zone de rédaction pédagogique');


// Lot 444 — exécuter aussi les contrôles du fil communautaire dans le pipeline CI actif.
await import('./check-multaqa.mjs');
