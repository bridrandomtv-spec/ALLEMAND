import { readFileSync } from 'node:fs';
const sql = readFileSync('supabase/msg_schema.sql', 'utf8');
let fails = 0;
const t = (cond, label) => { console.log((cond ? '  ✅ ' : '  ❌ ') + label); if (!cond) fails++; };
console.log('== msg_test · invariants de sécurité messagerie ==');
const ui = readFileSync('msg.js', 'utf8');
t(ui.includes("table:'msg_invites'") && ui.includes("event:'*'") && ui.includes('function startInviteChannel()'),
  'le centre des invitations écoute les événements Realtime msg_invites');
t(ui.includes('function closeInviteChannel()') && ui.includes('closeInviteChannel();') && ui.includes('startInviteChannel();'),
  'le canal Realtime des invitations est fermé au changement de vue et relancé dans la liste');
t(ui.includes("if(state.me!==userId || state.conv!==null) return;") && ui.includes('renderList();'),
  'les changements d’invitation actualisent la liste uniquement pour la session active hors fil de discussion');

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
t(sql.includes('create policy "profils visibles entre membres"'), 'visibilité profils entre membres du même groupe (parité base/dépôt)');
t(sql.includes('piece_jointe_trop_lourde') && sql.includes('document_trop_lourd'), 'MSG-LIM : gardes serveur de taille (5 Mo) sur pièces jointes et documents');
t(sql.includes('function public.profiles_role_guard'), 'garde de rôle profiles_role_guard présente (Lot 6b)');
t(sql.includes('create trigger profiles_tr_role'), 'trigger profiles_tr_role présent');
t(sql.includes("raise exception 'role_reservee_admin'"), 'auto-promotion client = exception SQL');
t(sql.includes("session_user in ('postgres', 'supabase_admin')") &&
  sql.includes("(select auth.jwt() ->> 'role') = 'service_role'") &&
  sql.includes("(select auth.uid()) is not null") &&
  sql.includes("p.role = 'admin'") &&
  !sql.includes('if auth.uid() is null then return new; end if;'),
  'promotions réservées à la console SQL, service_role explicite ou administrateur déjà établi');
const roleGuardStart = sql.indexOf('create or replace function public.profiles_role_guard()');
const roleGuardEnd = sql.indexOf('$function$;', roleGuardStart);
const roleGuard = sql.slice(roleGuardStart, roleGuardEnd);
t(roleGuardStart >= 0 && roleGuard.includes('language plpgsql') &&
  roleGuard.includes("set search_path = ''") &&
  !roleGuard.includes('security definer'),
  'garde de rôle SECURITY INVOKER avec search_path vide');

const sbjs = readFileSync('supabase/supabase.js', 'utf8');
const openDirectStart = sbjs.indexOf('async function msgOpenDirect(');
const openDirectEnd = sbjs.indexOf('\nasync function msgGroups(', openDirectStart);
const openDirect = sbjs.slice(openDirectStart, openDirectEnd);
t(openDirectStart >= 0 && openDirectEnd > openDirectStart, 'msgOpenDirect existe et peut être audité isolément');
t(openDirect.includes("err:'msg_invitation_requise'") &&
  !/\.from\('msg_conversations'\)\.insert/.test(openDirect) &&
  !/\.from\('msg_members'\)\.insert/.test(openDirect),
  'aucun DM ni membre destinataire créé côté client sans invitation acceptée');

if (fails) { console.error('::error:: msg_test : ' + fails + ' échec(s)'); process.exit(1); }
console.log('== msg_test : TOUT PASSE ==');
