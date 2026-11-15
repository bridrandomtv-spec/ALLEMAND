import { readFileSync } from 'node:fs';
const fail = [];
const ok = (c, label) => { if (c) { console.log('  ✅ ' + label); } else { fail.push(label); console.log('  ❌ ' + label); } };
console.log('== check-msg · messagerie EduDZ ==');
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
const sbjs = readFileSync('supabase/supabase.js', 'utf8');
const msgjs = readFileSync('msg.js', 'utf8');
const adminjs = readFileSync('admin.js', 'utf8');
const legaljs = readFileSync('legal.js', 'utf8');
const privacyHtml = readFileSync('privacy.html', 'utf8');
const retentionFn = readFileSync('supabase/functions/school-card-retention/index.ts', 'utf8');
const retentionHoldSql = readFileSync('supabase/migrations/20261115011056_school_card_retention_appeal_holds.sql', 'utf8');
const adminCss = readFileSync('style-prototype-dz.css', 'utf8');
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
const METHODS = ['msgConvs','msgMessages','msgSend','msgCanDm','msgOpenDirect','msgGroups','msgReport','msgBlock','msgUnblock','msgEdit','msgDelete','msgUpload','msgSubscribe','msgReportsOpen','msgHandle','msgCreateGroup','msgLogLast','msgMyVerification','msgUploadSchoolCard','msgRequestVerification','msgVerificationQueue','msgSchoolCardUrl','msgSetVerification'];
for (const m of METHODS) ok(sbjs.includes('function ' + m), 'méthode SB.' + m);
const verifyStart = sbjs.indexOf('async function msgVerificationQueue(');
const verifyEnd = sbjs.indexOf('async function msgSetVerification(', verifyStart);
const verifyMethod = sbjs.slice(verifyStart, verifyEnd);
ok(verifyStart >= 0 && verifyEnd > verifyStart &&
   verifyMethod.includes("{ count:'exact' }") &&
   verifyMethod.includes(".range(from,to)") &&
   verifyMethod.includes(".order('id',{ascending:true})"),
   'file de vérification paginée avec total et ordre stable');
ok(sbjs.includes("if(!/^\\d{1,20}$/.test(number))") && !sbjs.includes("Number.isSafeInteger(Number(number))"), 'numéro scolaire accepté sans conversion numérique risquée');
ok(sbjs.includes(".eq('id', uid).eq('verif_statut','en_attente')\n    .select('id').maybeSingle()") && sbjs.includes("if(!r.data) return { ok:false"), 'modération confirmée uniquement si une ligne est réellement modifiée');
ok(msgjs.indexOf('if(renderEpoch!==state.renderEpoch) return;\\n      window.__msgVerificationRows = vq') > msgjs.indexOf('var vq = await window.SB.msgVerificationQueue()'),
   'Messenger : réponse asynchrone obsolète ignorée avant remplacement des données de contrôle');
ok(msgjs.includes("t.closest('[data-conv],[data-act],[data-report],[data-msg-filter],[data-invite-act],[data-peer-key],[data-msg-act],[data-mod]')") &&
   msgjs.includes('data-mod="verif-doc"') &&
   msgjs.includes("if(mod==='verif-doc')") &&
   msgjs.includes("startsWith(String(docUid)+'/')") &&
   msgjs.includes("window.SB.msgSchoolCardUrl(docPath)") &&
   msgjs.includes("window.open('about:blank','_blank')"),
   'Messenger : actions de modération déléguées et ouverture contrôlée de la carte scolaire');
ok(msgjs.includes('function verificationMissing(q)') &&
   msgjs.includes("startsWith(String(q.id)+'/')") &&
   msgjs.includes("window.__msgVerificationRows = vq && vq.ok") &&
   msgjs.includes('disabled title="أكمل معلومات الهوية المدرسية أولاً"') &&
   msgjs.includes('missingForApproval.length'),
   'Messenger : confirmation bloquée si identité ou carte scolaire absente, côté rendu et clic');
ok(adminjs.includes("if(!x.id || !String(x.carte_scolaire_path||'').startsWith(String(x.id)+'/')) missing.push('البطاقة المدرسية أو مسارها غير صالح')") &&
   adminjs.includes("!String(docPath).startsWith(String(verifyDoc)+'/')") &&
   adminjs.includes("docQueueEpoch !== verificationQueueEpoch") &&
   adminjs.includes("var verifyRow = (window.__admVerificationRows||[]).find(function(row){ return row.id===verifyId; })") &&
   adminjs.includes("verifyQueueEpoch !== verificationQueueEpoch"),
   'Administration : chemin de carte lié à l’UUID et réponses obsolètes neutralisées');
ok(adminjs.includes("if(!/^[0-9]{1,20}$/.test(String(x.matricule||'').trim())) missing.push('رقم التسجيل')") && adminjs.includes('data-status="verifie"') && adminjs.includes('disabled title="أكمل معلومات الهوية المدرسية أولاً"'), 'activation bloquée dans l’interface si informations scolaires absentes');
ok(adminjs.includes('data-adm-verif-page') &&
   adminjs.includes('renderVerificationQueue(Number(verifyPage))') &&
   adminjs.includes('var pageSize = 50'),
   'navigation de la file par pages de 50 demandes');
ok(adminCss.includes('#admVerificationCard.adm-verification-card') &&
   adminCss.includes('background:var(--p)!important') && adminCss.includes('background:var(--p2)') && adminCss.includes('adm-verif-missing'),
   'palette standard et alerte des champs manquants dans la file de vérification');
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
ok(idx.includes('msg.js?v=3532'), 'version cache du module de messagerie actualisée');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.181'") && sw.includes("./msg.js?v=3532") && sw.includes("./style-prototype-dz.css?v=204"), 'service worker et précache Messenger synchronisés');
ok(!/isميغابايتd0|isميغابايتd|ميغابايتdération/.test(msgjs), 'identifiants JavaScript préservés après traduction');

// Lot 359-C — ne pas réintroduire le dernier libellé français de pièce jointe.
ok(!/indisponible pour ce compte/.test(msgjs), 'aucun message de pièce jointe en français');

// Lot 437 — contrat de consentement Messenger (migration préparée, non exécutée).
const inviteSql = readFileSync('supabase/migrations/202611130001_msg_invitation_consent.sql', 'utf8');
const postgresSql = readFileSync('ci/msg-invitation-postgres-test.sql', 'utf8');
const concurrencySql = readFileSync('ci/msg-invitation-concurrency-test.sh', 'utf8');
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


ok(!/^as \$/m.test(inviteSql) && !/^\$;$/m.test(inviteSql),
   'quotage dollar SQL valide pour toutes les fonctions');
ok(!/^do \$(?!\$)/m.test(postgresSql) && !/^end \$(?!\$);$/m.test(postgresSql),
   'blocs PL/pgSQL du test PostgreSQL correctement délimités');
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
ok(/demande pendante identique reste idempotente[\s\S]*?if v_id is not null then return v_id; end if;[\s\S]*?select count\(\*\) into v_count/.test(inviteSql),
   'répétition idempotente vérifiée avant la limite 24 h');
ok(postgresSql.includes('pending_invite_retry_blocked_by_rate_limit'),
   'test PostgreSQL : répétition pendante autorisée au plafond du quota');
ok(concurrencySql.includes('lot488-accept-ab') && concurrencySql.includes('lot488-cancel-first') && concurrencySql.includes('lot488-accept-first'),
   'test concurrent couvre acceptations réciproques et les deux issues annulation/acceptation');
ok(concurrencySql.includes('pg_stat_activity') && concurrencySql.includes('pg_sleep(1.5)'),
   'test concurrent synchronise réellement deux sessions PostgreSQL');
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
ok(/msg_invite_decline[\s\S]*?get diagnostics v_changed = row_count[\s\S]*?if v_changed > 0 then return true/.test(inviteSql), 'un refus d’invitation expirée confirme la transition expired');
ok(/msg_invite_cancel[\s\S]*?get diagnostics v_changed = row_count[\s\S]*?if v_changed > 0 then return true/.test(inviteSql), 'une annulation d’invitation expirée confirme la transition expired');
ok(postgresSql.includes('expired_cancel_not_reported') && postgresSql.includes('expired_decline_not_reported'), 'tests PostgreSQL du retour positif des transitions expirées');

ok(/alter publication supabase_realtime add table public\.msg_invites/.test(inviteSql),
   'notifications d’invitation publiées en Realtime');
ok(/create policy msg_invites_participant_read[\s\S]*?auth\.uid\(\) in \(sender_id, recipient_id\)/.test(inviteSql),
   'événements Realtime limités aux deux participants par RLS');
ok(inviteSql.includes('NON exécutée sur Supabase') && inviteSql.includes('Tests obligatoires'),
   'migration identifiée comme non appliquée et tests documentés');

// Lot 557 — conservation et recours des justificatifs scolaires.
ok(retentionFn.includes('school_card_retention_secret_valid') && retentionFn.includes('school_card_retention_is_held'), 'purge serveur authentifiée et respect des suspensions');
ok(retentionFn.includes('.storage.from(BUCKET).remove([path])') && retentionFn.includes('school_card_retention_clear_path'), 'suppression via Storage API puis effacement conditionnel de la référence');
ok(retentionHoldSql.includes('school_card_retention_set_hold') && retentionHoldSql.includes('p_days not between 1 and 90'), 'suspension de purge limitée à 90 jours via RPC autorisée');
ok(adminjs.includes('data-adm-card-hold') && adminjs.includes('data-adm-card-release'), 'fiche élève : contrôles de suspension et levée de suspension');
ok(legaljs.includes('90 يوماً قابلة للتجديد') && privacyHtml.includes('90 يوماً قابلة للتجديد'), 'notice juridique : suspension de purge avec durée plafonnée');

if (fail.length) { console.error('::error:: check-msg : ' + fail.length + ' échec(s)'); process.exit(1); }
console.log('== check-msg : TOUT PASSE ==');

// Lot 450 — vérification scolaire gratuite, indépendante de l'abonnement.
ok(msgjs.includes('رقم التسجيل المدرسي (مجاني)'), 'formulaire Messenger indique la vérification scolaire gratuite');
ok(sbjs.includes('async function msgRequestVerification(schoolRegistrationNumber, section)'), 'fonction de demande de vérification scolaire présente');
ok(sbjs.includes("update({ verif_statut:'en_attente', matricule:number"), 'demande déposée sur le profil du compte courant');
ok(!msgjs.includes('رقم الاشتراك') && !msgjs.includes('رقم اشتراك'), 'aucun ancien libellé abonnement dans le parcours de vérification');
ok(msgjs.includes('رقم التسجيل المدرسي') && msgjs.includes('التحقق المدرسي مجاني'), 'parcours de vérification gratuit et libellé scolaire cohérent');
const verificationFn = sbjs.slice(sbjs.indexOf('async function msgRequestVerification('), sbjs.indexOf('async function msgVerificationQueue('));
ok(/async function msgInvites\(\)/.test(sbjs), 'lecture du centre des invitations disponible');
ok(/async function msgInviteSend\(studentKey\)/.test(sbjs) && sbjs.includes("rpc('msg_invite_send_by_key',{p_student_key:studentKey})"), 'envoi d’invitation par jeton opaque via RPC serveur');
ok(/async function msgInviteAccept\(inviteId\)/.test(sbjs) && /msg_invite_accept/.test(sbjs), 'acceptation explicite d’une invitation par RPC');
ok(/async function msgInviteDecline\(inviteId\)/.test(sbjs) && /msg_invite_decline/.test(sbjs), 'refus réservé au destinataire via RPC');
ok(/async function msgInviteCancel\(inviteId\)/.test(sbjs) && /msg_invite_cancel/.test(sbjs), 'annulation réservée à l’expéditeur via RPC');
ok(msgjs.includes('data-invite-act="accept"') && msgjs.includes('data-invite-act="decline"') && msgjs.includes('data-invite-act="cancel"'), 'interface des invitations : accepter, refuser et annuler');
ok(msgjs.includes('[data-invite-act]') && msgjs.includes('لا ينشئ زمالة تلقائياً'), 'délégation des actions et séparation entre زمالة et conversation privée');

ok(!verificationFn.includes(".from('subscriptions')"), 'vérification scolaire sans contrôle d’abonnement payant');

if (fail.length) { console.error('::error:: check-msg Lot 360 : ' + fail.length + ' échec(s)'); process.exit(1); }

ok(msgjs.includes('msg-pro-hero') && msgjs.includes('msg-pro-stats'), 'nouvelle hiérarchie pédagogique Messenger');
ok(msgjs.includes("x.titre || ('مجموعة '+") && !msgjs.includes("('مجموعة '("), 'libellé de groupe construit sans appel de chaîne invalide');
ok(msgjs.includes("closest('[data-conv],[data-act],[data-report],[data-msg-filter],[data-invite-act],[data-peer-key]')"), 'filtres Messenger accessibles via délégation de clic');
ok(idx.includes('style-prototype-dz.css?v=204') && idx.includes('msg.js?v=3532'), 'versions de ressources Messenger actualisées');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.181'") && sw.includes('./style-prototype-dz.css?v=204') && sw.includes('./msg.js?v=3532'), 'précache synchronisé avec la nouvelle interface');

ok(msgjs.includes('msg-thread-topbar') && msgjs.includes('msg-conversation-panel') && msgjs.includes('msg-composer-mark'), 'écran de conversation structuré et zone de rédaction pédagogique');
 
// Lot 526 — un INSERT asynchrone ne doit pas écrire dans un ancien DOM.
const insertStart = msgjs.indexOf(".on('postgres_changes', { event:'INSERT', schema:'public', table:'msg_messages'");
const insertEnd = msgjs.indexOf(".on('postgres_changes', { event:'UPDATE'", insertStart);
const insertHandler = msgjs.slice(insertStart, insertEnd);
ok(insertStart >= 0 && insertEnd > insertStart &&
   insertHandler.includes('var eventRenderEpoch = state.renderEpoch;') &&
   insertHandler.includes('eventRenderEpoch!==state.renderEpoch') &&
   insertHandler.includes("el('msgBody').querySelector('.msg-thread')") &&
   insertHandler.includes('currentThread.isConnected') &&
   insertHandler.includes("currentThread.querySelector('[data-mid="'+m.id+'"]')"),
   'INSERT Realtime : DOM courant revalidé après les lectures asynchrones, sans écriture dans un fil détaché');



 
 // Lot 536 — les actions de vérification, modération et signalement restent liées à leur session.
ok(msgjs.includes('verificationIdentityEpoch = state.authEpoch') &&
   msgjs.includes('if(state.authEpoch!==verificationIdentityEpoch) return;'),
   'demande de vérification : callback neutralisé après changement de compte');
ok(msgjs.includes('groupIdentityEpoch = state.authEpoch') &&
   msgjs.includes('if(state.authEpoch!==groupIdentityEpoch) return;'),
   'création de groupe : callback neutralisé après changement de compte');
ok(msgjs.includes('moderationIdentityEpoch = state.authEpoch') &&
   msgjs.includes('if(state.authEpoch!==moderationIdentityEpoch) return;') &&
   msgjs.includes('reportActionIdentityEpoch = state.authEpoch') &&
   msgjs.includes('if(state.authEpoch!==reportActionIdentityEpoch) return;'),
   'validation scolaire et traitement des signalements : résultats obsolètes ignorés');
ok(msgjs.includes('reportIdentityEpoch = state.authEpoch') &&
   msgjs.includes('if(state.authEpoch!==reportIdentityEpoch || !t.isConnected) return;'),
   'signalement utilisateur : aucun callback sur un ancien compte ou un bouton détaché');
ok(idx.includes('msg.js?v=3532') && sw.includes('msg.js?v=3532') &&
   sw.includes("dz-de-v3.185.0.0.181"),
   'cache module et service worker alignés sur Lot 536');
// Lot 535 — upload de pièce jointe lié à la conversation et à l'identité initiatrices.
const uploadStart = msgjs.indexOf("document.addEventListener('change', async function(e){");
const uploadEnd = msgjs.indexOf("\n  document.addEventListener('keydown'", uploadStart);
const uploadFn = msgjs.slice(uploadStart, uploadEnd);
ok(uploadFn.includes('uploadIdentityEpoch=state.authEpoch') &&
   uploadFn.includes('function uploadContextCurrent()') &&
   (uploadFn.match(/if\(!uploadContextCurrent\(\)\) return;/g)||[]).length>=3,
   'pièce jointe : arrêt du flux UI après changement de compte ou de conversation');
ok(uploadFn.includes('if(!uploadContextCurrent()) return;\n      var uploaded=await window.SB.msgUpload') &&
   uploadFn.includes('catch(error)') &&
   uploadFn.includes('input.isConnected'),
   'pièce jointe : pas de transfert Storage démarré après invalidation; erreurs et éléments DOM détachés protégés');
ok(idx.includes('msg.js?v=3532') && sw.includes('msg.js?v=3532') &&
   sw.includes("dz-de-v3.185.0.0.181"),
   'cache module et service worker alignés sur Lot 537');

// Lot 534 — les réponses de découverte et d'invitation ne traversent pas une transition Auth.
const peerSendStart = msgjs.indexOf("var peerKey = t.getAttribute('data-peer-key');");
const peerSendEnd = msgjs.indexOf("var inviteAct = t.getAttribute('data-invite-act');", peerSendStart);
const peerSendFn = msgjs.slice(peerSendStart, peerSendEnd);
ok(peerSendFn.includes('inviteIdentityEpoch = state.authEpoch') &&
   peerSendFn.includes('if(state.authEpoch!==inviteIdentityEpoch) return;') &&
   peerSendFn.includes('if(state.authEpoch!==inviteIdentityEpoch) return;'),
   'envoi d’invitation par jeton opaque : résultat/erreur tardifs ignorés après changement de compte');
const inviteActionStart = msgjs.indexOf("var inviteAct = t.getAttribute('data-invite-act');");
const inviteActionEnd = msgjs.indexOf("if(t.getAttribute('data-conv'))", inviteActionStart);
const inviteActionFn = msgjs.slice(inviteActionStart, inviteActionEnd);
ok(inviteActionFn.includes('inviteActionIdentityEpoch = state.authEpoch') &&
   inviteActionFn.includes('if(state.authEpoch!==inviteActionIdentityEpoch) return;'),
   'acceptation/refus/annulation : réponse tardive neutralisée après transition Auth');
const studentSearchStart = msgjs.indexOf("if(act==='search-students'){");
const studentSearchEnd = msgjs.indexOf("if(act==='refresh')", studentSearchStart);
const studentSearchFn = msgjs.slice(studentSearchStart, studentSearchEnd);
ok(studentSearchFn.includes('searchIdentityEpoch = state.authEpoch') &&
   studentSearchFn.includes('if(state.authEpoch!==searchIdentityEpoch) return;') &&
   studentSearchFn.includes('resultsBox && resultsBox.isConnected'),
   'recherche de camarades : aucune liste de jetons ni erreur injectée par une ancienne session');
ok(idx.includes('msg.js?v=3532') && sw.includes('msg.js?v=3532') &&
   sw.includes("dz-de-v3.185.0.0.181"),
   'cache module et version service worker alignés sur Lot 534');

// Lot 531 — le canal d'invitations a son propre cycle de reprise.
ok(msgjs.includes('inviteRecoveryTimer:null') && msgjs.includes('inviteRecoveryAttempts:0') &&
   msgjs.includes('inviteNeedsRecovery:false'),
   'état de reprise des invitations isolé du canal de conversation');
ok(msgjs.includes("ch.subscribe(function(status, err){") &&
   msgjs.includes("if(epoch!==state.inviteEpoch || state.inviteCh!==ch || state.me!==userId) return;") &&
   msgjs.includes("if(status==='SUBSCRIBED'){") &&
   msgjs.includes("if(status==='TIMED_OUT' || status==='CLOSED') scheduleInviteRecovery();"),
   'canal invitations : statut, génération, identité et reprise après fermeture contrôlés');
ok(msgjs.includes("window.console.warn('[Messenger invitations Realtime]', status, err || null);") &&
   msgjs.includes('Math.min(32000, 500 * Math.pow(2, attempt))') &&
   msgjs.includes('renderList().catch(function(){});'),
   'diagnostic sans jeton et reprise exponentielle bornée des invitations');
ok(msgjs.includes('scheduleInviteRecovery();') &&
   msgjs.includes("if(document.visibilityState==='visible'){") &&
   msgjs.includes('state.inviteNeedsRecovery = false;'),
   'reprise invitations à la reconnexion/visibilité et annulation après SUBSCRIBED');
// Lot 530 — le SDK renouvelle le JWT Realtime; l'UI suit les changements d'identité.
ok(/client\.auth\.onAuthStateChange\(function\(event\)/.test(msgjs) &&
   msgjs.includes("if(event!=='SIGNED_IN' && event!=='SIGNED_OUT') return;"),
   'Messenger observe les changements de session sans intercepter le renouvellement normal du jeton');
ok(msgjs.includes('if(authClient!==client) return;') &&
   msgjs.includes("if(event==='SIGNED_OUT'){"),
   'changement de compte : ancien client ignoré et déconnexion traitée');
ok(msgjs.includes('if(state.inviteViewActive) renderList();') &&
   msgjs.includes('if(activeConv) renderThread(activeConv);'),
   'vue Messenger réconciliée après connexion ou déconnexion');
ok(msgjs.includes('authEpoch:0') && msgjs.includes('var transitionEpoch = ++state.authEpoch;') &&
   msgjs.includes('state.renderEpoch++;') && msgjs.includes('state.peers = {};') &&
   msgjs.includes('state.authEpoch!==transitionEpoch') &&
   msgjs.indexOf('var transitionEpoch = ++state.authEpoch;') < msgjs.indexOf('setTimeout(function(){', msgjs.indexOf('var transitionEpoch = ++state.authEpoch;')) &&
   msgjs.includes("if(event==='SIGNED_OUT') state.conv = null;"),
   'transition Auth : epochs invalidés synchroniquement, ancien timer ignoré et état de session nettoyé avant le rendu différé');
const fetchNamesStart = msgjs.indexOf('async function fetchNames(ids){');
const fetchNamesEnd = msgjs.indexOf('\n  function nameOf(id)', fetchNamesStart);
const fetchNamesFn = msgjs.slice(fetchNamesStart, fetchNamesEnd);
ok(fetchNamesStart>=0 && fetchNamesEnd>fetchNamesStart &&
   fetchNamesFn.includes('identityEpoch = state.authEpoch') &&
   (fetchNamesFn.match(/identityEpoch!==state\.authEpoch/g)||[]).length>=3 &&
   fetchNamesFn.indexOf('identityEpoch!==state.authEpoch') < fetchNamesFn.indexOf('(r.data||[]).forEach'),
   'fetchNames : lecture de profil abandonnée si la session change avant alimentation du cache');
ok(msgjs.includes('state.names = {};') &&
   msgjs.indexOf('state.names = {};') < msgjs.indexOf('setTimeout(function(){', msgjs.indexOf('var transitionEpoch = ++state.authEpoch;')),
   'cache global des noms purgé synchroniquement à chaque transition Auth');
ok(msgjs.includes('identityEpoch = state.authEpoch') &&
   (msgjs.match(/state\.authEpoch!==identityEpoch/g)||[]).length>=2,
   'envoi : une réponse tardive de l’ancienne identité ne modifie pas la nouvelle session');
ok(msgjs.includes('actionIdentityEpoch = state.authEpoch') &&
   (msgjs.match(/state\.authEpoch===actionIdentityEpoch/g)||[]).length===4,
   'édition/suppression : callbacks neutralisés après changement de compte');
ok(msgjs.includes('Supabase JS 2.x propage lui-même le JWT vers Realtime sur TOKEN_REFRESHED') &&
   !/realtime\.setAuth\(/.test(msgjs),
   'aucun setAuth manuel concurrent : le SDK Supabase gère déjà TOKEN_REFRESHED');
// Lot 529 — initialisation single-flight : un seul client Auth/Realtime même en repli CDN.
const sbInitStart = sbjs.indexOf('async function sb(){');
const sbInitEnd = sbjs.indexOf('\nasync function login(', sbInitStart);
const sbInit = sbjs.slice(sbInitStart, sbInitEnd);
ok(sbInitStart >= 0 && sbInitEnd > sbInitStart &&
   sbInit.includes('if(clientPromise) return clientPromise;') &&
   sbInit.includes('clientPromise = (async function(){') &&
   sbInit.includes('if(!ready) clientPromise = null;') &&
   sbInit.includes('catch(e){\n    clientPromise = null;'),
   'client Supabase : initialisation mutualisée, sans instances Auth/Realtime concurrentes lors du repli CDN');

// Lot 528 — reprise contrôlée sur TIMED_OUT/CLOSED et diagnostic des statuts Realtime.
ok(/ch\.subscribe\(function\(st2, err\)/.test(msgjs) &&
   msgjs.includes("window.console.warn('[Messenger Realtime]', st2, err || null)"),
   'statut Realtime et erreur complète transmis au diagnostic console');
ok(msgjs.includes("if(st2==='TIMED_OUT' || st2==='CLOSED') scheduleThreadRecovery();") &&
   msgjs.includes("if(st2==='SUBSCRIBED'){\n          if(state.recoveryTimer){ clearTimeout(state.recoveryTimer); state.recoveryTimer=null; }") &&
   msgjs.includes('state.recoveryAttempts=0;'),
   'TIMED_OUT/CLOSED planifient une reprise; SUBSCRIBED annule le timer et réinitialise le backoff');
ok(msgjs.includes('if(state.recoveryTimer) return;') &&
   msgjs.includes('250 * Math.pow(2, attempt)') &&
   msgjs.includes('state.recoveryAttempts = Math.min((state.recoveryAttempts || 0) + 1, 7);'),
   'reprise bornée avec backoff exponentiel, sans boucle de recréation rapide');

// Lot 527 — les rafales UPDATE ne déclenchent pas des rendus concurrents non bornés.
const updateRefreshFnStart = msgjs.indexOf('function scheduleUpdateRefresh(id, epoch){');
const updateRefreshFnEnd = msgjs.indexOf('\n  async function startChannel(id){', updateRefreshFnStart);
const updateRefreshFn = msgjs.slice(updateRefreshFnStart, updateRefreshFnEnd);
ok(updateRefreshFnStart >= 0 && updateRefreshFnEnd > updateRefreshFnStart &&
   updateRefreshFn.includes('clearTimeout(state.updateRefreshTimer)') &&
   updateRefreshFn.includes('setTimeout(function()') &&
   updateRefreshFn.includes('epoch!==state.channelEpoch || state.conv!==id') &&
   updateRefreshFn.includes('renderThread(id, true)') &&
   msgjs.includes("if(state.updateRefreshTimer){ clearTimeout(state.updateRefreshTimer); state.updateRefreshTimer=null; }") &&
   /scheduleUpdateRefresh\(id, epoch\)/.test(msgjs),
   'UPDATE Realtime : rafales regroupées, canal obsolète ignoré et timer annulé à la fermeture');

// Lot 525 — ordre déterministe des messages partageant le même created_at.
const messagesFnStart = sbjs.indexOf('async function msgMessages(');
const messagesFnEnd = sbjs.indexOf('\nasync function msgSend(', messagesFnStart);
const messagesFn = sbjs.slice(messagesFnStart, messagesFnEnd);
ok(messagesFnStart >= 0 && messagesFnEnd > messagesFnStart &&
   messagesFn.includes(".order('created_at',{ascending:false}).order('id',{ascending:false})"),
   'historique Messenger : tri stable par horodatage puis identifiant');
ok(/create table if not exists public\.msg_messages \([\s\S]*?id bigint generated always as identity primary key[\s\S]*?created_at timestamptz not null default now\(\)/.test(sql) &&
   !/client_nonce|idempotency_key|request_id/.test(sql),
   'schéma actuel : identifiant serveur, sans clé d’idempotence client');
// Lot 524 — une réponse d'envoi asynchrone ne doit jamais voler la vue courante.
const sendStart = msgjs.indexOf('async function send(){');
const sendEnd = msgjs.indexOf('\n  function scheduleThreadRecovery()', sendStart);
const sendFn = msgjs.slice(sendStart, sendEnd);
ok(sendStart >= 0 && sendEnd > sendStart && /if\(state\.conv!==conv\) return;/.test(sendFn),
   'envoi terminé après navigation : aucun retour forcé à l’ancienne conversation');
ok(sendFn.includes('try{') && sendFn.includes('catch(error)') && sendFn.includes('currentButton.disabled=false'),
   'erreur réseau d’envoi traitée sans laisser le bouton bloqué');
ok(sendFn.includes('if(currentComposer===t) currentComposer.value=\'\';'),
   'le résultat d’un envoi ne vide pas un composeur remplacé entre-temps');

 
// Lot 523 — cycle de vie Realtime : ignorer les anciens canaux et resynchroniser au retour.
ok(/epoch!==state\.channelEpoch \|\| state\.conv!==id \|\| state\.ch!==ch/.test(msgjs),
   'callback SUBSCRIBED ignore un canal obsolète');
ok(/epoch!==state\.channelEpoch \|\| !m \|\| state\.conv!==id/.test(msgjs),
   'événement INSERT ignore un canal obsolète');
ok(/epoch===state\.channelEpoch && state\.conv===id/.test(msgjs),
   'événement UPDATE ignore un canal obsolète');
ok(/epoch!==state\.channelEpoch \|\| state\.conv!==id/.test(msgjs),
   'présence ignore un canal obsolète');
ok(msgjs.includes("st2==='CHANNEL_ERROR' || st2==='TIMED_OUT' || st2==='CLOSED'"),
   'états CHANNEL_ERROR, TIMED_OUT et CLOSED signalés');
ok(msgjs.includes("window.addEventListener('online', scheduleThreadRecovery)") &&
   msgjs.includes("window.addEventListener('pageshow', scheduleThreadRecovery)") &&
   msgjs.includes("document.addEventListener('visibilitychange'"),
   'reprise réseau, retour de page et visibilité déclenchent une réconciliation');
ok(msgjs.includes('renderThread(id).catch(function(){})'),
   'retour au premier plan recharge le fil et recrée le canal');
ok(msgjs.includes('if(!state.inviteViewActive) state.conv = null') &&
   msgjs.includes('if(state.recoveryTimer){ clearTimeout(state.recoveryTimer); state.recoveryTimer=null; }'),
   'navigation hors Messenger annule la récupération différée');



// Lot 444 — exécuter aussi les contrôles du fil communautaire dans le pipeline CI actif.
await import('./check-multaqa.mjs');


const discoverySql = readFileSync('supabase/migrations/202611130003_msg_student_discovery.sql', 'utf8');
ok(discoverySql.includes('create function public.msg_student_search'), 'RPC de recherche scolaire versionnée');
ok(discoverySql.includes("pa.verif_statut = 'verifie'") && discoverySql.includes("pb.verif_statut = 'verifie'"), 'DM exige deux identités vérifiées côté serveur');
ok(/create or replace function public\.msg_can_dm\(a uuid, b uuid\)[\s\S]*?auth\.uid\(\) is not null[\s\S]*?auth\.uid\(\) in \(a, b\)/.test(discoverySql),
   'msg_can_dm conserve la liaison entre JWT appelant et paire concernée');
ok(discoverySql.includes("p.role='eleve'") && discoverySql.includes("p.verif_statut='verifie'"), 'annuaire limité aux élèves vérifiés');
ok(discoverySql.includes('msg_discovery_limits') && discoverySql.includes('interval \'10 minutes\'') && discoverySql.includes('v_count > 8'), 'recherche protégée contre le scraping par quota');
ok(discoverySql.includes('position(lower(v_query) in lower(coalesce(p.pseudo'), 'recherche uniquement sur le pseudo');
ok(discoverySql.includes('revoke all on function public.msg_student_search(text,integer) from public, anon'), 'recherche interdite aux visiteurs anonymes');
ok(sbjs.includes('async function msgStudentSearch(query, limit)') && sbjs.includes("rpc('msg_student_search'"), 'client appelle exclusivement la RPC de recherche');
ok(msgjs.includes('data-peer-key') && msgjs.includes('state.peers[key]=p.student_key'), 'jeton opaque de destinataire conservé hors du DOM');
ok(discoverySql.includes('returns table(student_key uuid') && discoverySql.includes('msg_discovery_targets'), 'recherche retourne un jeton opaque stocké côté serveur');
ok(discoverySql.includes('expires_at>now()') && discoverySql.includes('actor_id=v_actor'), 'jeton de découverte expirant et lié au compte demandeur');
ok(discoverySql.includes('used_at=now()') && discoverySql.includes('used_at is null') && discoverySql.includes('returning student_id into v_recipient'), 'jeton de découverte consommé atomiquement une seule fois');
ok(test.includes('Le jeton est à usage unique') && test.includes('expected: false'), 'test d’intégration du rejeu de jeton');
ok(discoverySql.includes('msg_discovery_targets_expiry_idx') && discoverySql.includes('where expires_at <= now()'), 'jetons expirés nettoyés avec index de rétention');
ok(/create or replace function public\.msg_invite_send_by_key\(p_student_key uuid\)/.test(discoverySql) && discoverySql.includes('return public.msg_invite_send(v_recipient)'), 'RPC serveur dédiée à la conversion du jeton opaque');
ok(discoverySql.includes('grant execute on function public.msg_invite_send_by_key(uuid) to authenticated'), 'conversion du jeton autorisée uniquement aux comptes connectés');
ok(sbjs.includes("rpc('msg_invite_send_by_key',{p_student_key:studentKey})"), 'client envoie le jeton opaque sans UUID destinataire');
ok(msgjs.includes('msgStudentSearch(query,12)') && msgjs.includes('msgInviteSend(recipientKey)'), 'recherche reliée à l’envoi de demande de consentement par jeton opaque');
ok(msgjs.includes('ابحث عن زميل لطلب محادثة خاصة'), 'interface de découverte en arabe');

// Lot 556 — justificatif scolaire privé obligatoire pour l'activation.
ok(sbjs.includes("from('cartes-scolaires').upload") && sbjs.includes('carte_scolaire_path:cardPath'), 'dépôt carte scolaire dans le bucket privé et chemin enregistré au profil');
ok(sbjs.includes("select('carte_scolaire_path')") && sbjs.includes('remove([cardPath])') && sbjs.includes('remove([oldPath])'), 'nettoyage du nouvel upload si échec et remplacement de l’ancienne carte');
ok(sbjs.includes(".select('id').maybeSingle()") && sbjs.includes("if(r.error || !r.data)"), 'demande de vérification confirmée uniquement si une ligne profil a été mise à jour');
ok(msgjs.includes('id="vfCard"') && msgjs.includes('msgUploadSchoolCard(cardFile)'), 'formulaire étudiant : justificatif obligatoire avant envoi');
ok(adminjs.includes("missing.push('البطاقة المدرسية')") && adminjs.includes('data-adm-verif-doc'), 'file administrative : pièce obligatoire et bouton de consultation');
ok(sbjs.includes('createSignedUrl(path,300)'), 'consultation par lien signé limité à 5 minutes');
ok(msgjs.includes('if(r4.cleanupWarning) window.alert'), 'avertissement de nettoyage de l’ancienne carte affiché à l’élève');
ok(idx.includes('supabase/supabase.js?v=3527') && sw.includes("'./supabase/supabase.js?v=3527'") && sw.includes("VERSION = 'dz-de-v3.185.0.0.181'"), 'cache Supabase et version du service worker synchronisés Lot 562');
ok(idx.includes('msg.js?v=3532') && idx.includes('admin.js?v=3518') && idx.includes('supabase/supabase.js?v=3527'), 'versions des modules de vérification actualisées');
ok(sw.includes("VERSION = 'dz-de-v3.185.0.0.181'") && sw.includes("./msg.js?v=3532") && sw.includes("./admin.js?v=3518") && sw.includes("./supabase/supabase.js?v=3527"), 'précache et service worker synchronisés Lot 556');

if (fail.length) { console.error('::error:: check-msg Lot 453 : ' + fail.length + ' échec(s)'); process.exit(1); }
console.log('== check-msg Lot 453 : TOUT PASSE ==');
