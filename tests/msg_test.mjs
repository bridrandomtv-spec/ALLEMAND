import { readFileSync } from 'node:fs';
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
let fails = 0;
const t = (cond, label) => { console.log((cond ? '  ✅ ' : '  ❌ ') + label); if (!cond) fails++; };
console.log('== msg_test · invariants de sécurité messagerie ==');
const pols = [...sql.matchAll(/create policy "(msg[^"]*)" on public\.(\w+) for (\w+) to (\w+)/g)];
t(pols.length >= 18, 'au moins 18 politiques msg_* (' + pols.length + ')');
t(pols.every(p => p[4] === 'authenticated'), 'toutes les politiques msg_* → to authenticated');
t(!/using\s*\(\s*true\s*\)/.test(sql), 'aucun using(true) nu (porte ouverte)');
const envoi = sql.match(/create policy "msg messages envoi"[\s\S]{0,600}?\);/);
t(!!envoi && envoi[0].includes('auth.uid() = sender_id') && envoi[0].includes('msg_is_member') && envoi[0].includes('msg_not_blocked'),
  'envoi = soi-même + membre + non bloqué');
const lect = sql.match(/create policy "msg messages lecture"[\s\S]{0,300}?\);/);
t(!!lect && lect[0].includes('msg_is_member') && lect[0].includes('msg_is_moderator'),
  'lecture = membre ou modérateur');
t(!/on public\.msg_log for (insert|update|delete)/.test(sql), 'msg_log : lecture seule (écriture par triggers uniquement)');
t(sql.includes('n >= 20') && sql.includes('length(new.body) > 2000'), 'rate-limit 20/min + 2000 caractères');
t(sql.includes("'image/png','image/jpeg','image/webp','application/pdf'") && sql.includes('5242880'), 'PJ : whitelist mime + 5 Mo');
t(sql.includes("old.verif_statut in ('non_verifie','rejete')") && sql.includes("new.verif_statut = 'en_attente'"),
  'garde vérif : un élève ne peut que DEMANDER (en_attente)');
t(sql.includes("raise exception 'verif_reservee_moderation'"), 'auto-validation élève = exception SQL');
t(sql.includes('function public.profiles_role_guard'), 'garde de rôle profiles_role_guard présente (Lot 6b)');
t(sql.includes('create trigger profiles_tr_role'), 'trigger profiles_tr_role présent');
t(sql.includes("raise exception 'role_reservee_admin'"), 'auto-promotion client = exception SQL');
t(sql.includes('if auth.uid() is null then return new; end if;'), 'promotions réservées console (auth.uid NULL) ou admin');
if (fails) { console.error('::error:: msg_test : ' + fails + ' échec(s)'); process.exit(1); }
console.log('== msg_test : TOUT PASSE ==');
