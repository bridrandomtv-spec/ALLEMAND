import { readFileSync } from 'node:fs';
const fail = [];
const ok = (c, label) => { if (c) { console.log('  ✅ ' + label); } else { fail.push(label); console.log('  ❌ ' + label); } };
console.log('== check-msg · messagerie EduDZ ==');
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
const sbjs = readFileSync('supabase/supabase.js', 'utf8');
const msgjs = readFileSync('msg.js', 'utf8');
const idx = readFileSync('index.html', 'utf8');
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
if (fail.length) { console.error('::error:: check-msg : ' + fail.length + ' échec(s)'); process.exit(1); }
console.log('== check-msg : TOUT PASSE ==');
