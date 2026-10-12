/* supabase.js — client cloud de la plateforme (module ES)
   Auth réelle + sync + storage privé 'prive'. Repli localStorage si hors-ligne. */
const URL = 'https://azjwcybivirvpxbfhyzk.supabase.co';
const KEY = 'sb_publishable_eLv27yLjmxuiE9xP_h50qw_4ID6dDHz';
let client = null;

async function sb(){
  if(client) return client;
  if(window.supabase && window.supabase.createClient){
    client = window.supabase.createClient(URL, KEY, { auth: { persistSession: true } });
    return client;
  }
  const urls = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
    'https://unpkg.com/@supabase/supabase-js@2/dist/module/index.js',
    'https://esm.sh/@supabase/supabase-js@2'
  ];
  for(const u of urls){
    try{
      const m = await import(u);
      if(m && m.createClient){
        client = m.createClient(URL, KEY, { auth: { persistSession: true } });
        return client;
      }
    }catch(e){}
  }
  return null;
}

async function login(email, pass){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.auth.signInWithPassword({ email, password: pass });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, user: r.data.user };
}
async function signup(email, pass, meta){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.auth.signUp({ email, password: pass, options: { data: meta || {} } });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, user: r.data.user };
}
async function me(){
  try{
    const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
    if(!c) return null;
    const r = await c.auth.getSession();
    return r.data.session ? r.data.session.user : null;
  }catch(e){ return null; }
}
async function logout(){ const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' }; await c.auth.signOut(); }

/* sync mémoire locale → cloud */
async function pushMemoire(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const local = JSON.parse(localStorage.getItem('dz_de_memorie_v1') || '{"cartes":[]}');
  const rows = (local.cartes || []).map(k => ({
    id: k.id, user_id: u.id, comp: k.comp || null, q: k.q || null,
    bad: k.bad || null, good: k.good || null, box: k.box || 1,
    due: k.due ? new Date(k.due).toISOString() : null,
    hits: k.hits || 0, misses: k.misses || 0 }));
  if(!rows.length) return { ok: true, n: 0 };
  const r = await c.from('memoire_cards').upsert(rows, { onConflict: 'id' });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, n: rows.length };
}
async function pullMemoire(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('memoire_cards').select('*').eq('user_id', u.id);
  if(r.error) return { ok: false, err: r.error.message };
  const local = JSON.parse(localStorage.getItem('dz_de_memorie_v1') || '{"cartes":[]}');
  const byId = {}; (local.cartes || []).forEach(k => byId[k.id] = k);
  (r.data || []).forEach(k => { byId[k.id] = { id: k.id, comp: k.comp, q: k.q, bad: k.bad,
    good: k.good, box: k.box, due: k.due ? Date.parse(k.due) : Date.now(),
    hits: k.hits, misses: k.misses }; });
  local.cartes = Object.values(byId);
  localStorage.setItem('dz_de_memorie_v1', JSON.stringify(local));
  return { ok: true, n: (r.data || []).length };
}
/* storage privé */
async function upload(file){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const path = u.id + '/' + file.name;
  const r = await c.storage.from('prive').upload(path, file, { upsert: true });
  if(r.error) return { ok: false, err: r.error.message };
  await c.from('documents_meta').upsert({ owner_id: u.id, nom: file.name,
    chemin: path, type: file.type, taille: file.size }, { onConflict: 'chemin' });
  return { ok: true, path };
}
async function listFiles(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('documents_meta').select('*').eq('owner_id', u.id).order('at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, files: r.data || [] };
}
async function fileUrl(chemin){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.storage.from('prive').createSignedUrl(chemin, 3600);
  return r.error ? null : r.data.signedUrl;
}

async function myProfile(){
  const u = await me(); if(!u) return null;
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('profiles').select('*').eq('id', u.id).single();
  return r.data || null;
}
async function listProfiles(){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('profiles').select('*').order('created_at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function listNotes(){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('notes').select('*').order('at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function setRole(id, role){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('profiles').update({ role: role }).eq('id', id);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}

async function createSub(plan, montant){
  const u = await me(); if(!u) return { ok: false, err: 'non connecte' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const ref = 'DZ-' + Date.now().toString(36).toUpperCase();
  const r = await c.from('subscriptions').insert({ user_id: u.id, plan: plan,
    montant: montant, ref: ref, statut: 'en_attente' }).select().single();
  return r.error ? { ok: false, err: r.error.message } : { ok: true, row: r.data };
}
async function mySubs(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecte' };
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('subscriptions').select('*').eq('user_id', u.id)
    .order('created_at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function setPreuve(id, preuve){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('subscriptions').update({ preuve: preuve, statut: 'preuve' }).eq('id', id);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}
async function listSubs(){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('subscriptions').select('*').order('created_at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function setSubStatut(id, statut, mois){
  const patch = { statut: statut };
  if(statut === 'actif'){
    patch.debut = new Date().toISOString();
    patch.fin = new Date(Date.now() + mois * 30 * 86400000).toISOString();
  }
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('subscriptions').update(patch).eq('id', id);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}
async function addSponsor(s){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('sponsors').insert(s);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}
async function listSponsors(){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('sponsors').select('*').order('created_at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function setSponsorStatut(id, statut){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('sponsors').update({ statut: statut }).eq('id', id);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}
async function activeAds(slot){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  let q = c.from('ads').select('*').eq('actif', true);
  if(slot) q = q.eq('slot', slot);
  const r = await q;
  return r.error ? { ok: false, err: r.error.message } : { ok: true, rows: r.data || [] };
}
async function createAd(a){
  const c = await sb(); if(!c) return { ok: false, err: 'cloud indisponible (reseau/CDN)' };
  const r = await c.from('ads').insert(a);
  return r.error ? { ok: false, err: r.error.message } : { ok: true };
}


  /* ── PHASE 6 : payments — le PAYMENT est séparé de la SUBSCRIPTION ── */
  async function createPayment(o){
    try{
      const c = await sb(); if(!c) return { ok:false, err:'non connecté' };
      const u = await me(); if(!u) return { ok:false, err:'non connecté' };
      const r = await c.from('payments').insert({
        sub_id: o.sub_id, user_id: u.id, montant: o.montant || 0, devise: 'DZD',
        methode: o.methode || 'ccp', ref_plateforme: o.ref || '',
        ref_banque: o.ref_banque || '', statut: 'en_attente'
      }).select().single();
      if(r.error) return { ok:false, err:r.error.message };
      return { ok:true, row:r.data };
    }catch(e){ return { ok:false, err:String((e && e.message) || e) }; }
  }
  async function myPayments(){
    try{
      const c = await sb(); if(!c) return { ok:false, err:'non connecté' };
      const r = await c.from('payments').select('*').order('created_at', { ascending:false });
      if(r.error) return { ok:false, err:r.error.message };
      return { ok:true, rows:r.data };
    }catch(e){ return { ok:false, err:String((e && e.message) || e) }; }
  }
  async function adminPayments(){
    try{
      const c = await sb(); if(!c) return { ok:false, err:'non connecté' };
      const r = await c.from('payments').select('*').order('created_at', { ascending:false }).limit(200);
      if(r.error) return { ok:false, err:r.error.message };
      return { ok:true, rows:r.data };
    }catch(e){ return { ok:false, err:String((e && e.message) || e) }; }
  }
  /* décision admin : subscription + payment tranchés ensemble.
     refus → subscription retourne 'en_attente' (l'élève PEUT retenter) + payment 'refuse'
     avec note_admin en arabe ; jamais 'actif' sans décision admin (RLS le garantit). */
  async function deciderSub(sub_id, ok, mois, note){
    try{
      const c = await sb(); if(!c) return { ok:false, err:'non connecté' };
      if(ok){
        const r1 = await setSubStatut(sub_id, 'actif', mois || 1);
        if(!r1.ok) return r1;
      }else{
        const r1 = await c.from('subscriptions').update({ statut:'en_attente', preuve:'' }).eq('id', sub_id);
        if(r1.error) return { ok:false, err:r1.error.message };
      }
      const r2 = await c.from('payments').update({
        statut: ok ? 'valide' : 'refuse',
        note_admin: note || '',
        decided_at: new Date().toISOString()
      }).eq('sub_id', sub_id).eq('statut', 'en_attente');
      if(r2.error) return { ok:true, payments:0, warn:r2.error.message };
      return { ok:true, payments:(r2.data || []).length };
    }catch(e){ return { ok:false, err:String((e && e.message) || e) }; }
  }

  
/* ── MSG-2 · messagerie EduDZ — côté client FIN : toute autorisation vit en RLS/SQL ──
   Aucune logique de permission ici : chaque appel passe par les politiques du Lot 1.
   Erreurs serveur (msg_dm_interdit, msg_rate_limit…) remontent dans { ok:false, err }. */
async function msgConvs(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_conversations').select('id,type,wilaya,niveau,filiere,titre,last_activity')
    .order('last_activity',{ascending:false}).limit(50);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, convs:r.data || [] };
}
async function msgMessages(convId, before, limit){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  let q = c.from('msg_messages').select('id,conversation_id,sender_id,body,attachment_id,flagged,created_at,edited_at')
    .eq('conversation_id', convId).is('deleted_at', null)
    .order('created_at',{ascending:false}).limit(limit || 50);
  if(before) q = q.lt('created_at', before);
  const r = await q;
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, msgs:(r.data || []).reverse() };
}
async function msgSend(convId, body){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const t = String(body || '').slice(0, 2000);
  if(!t.trim()) return { ok:false, err:'message vide' };
  const r = await c.from('msg_messages').insert({ conversation_id:convId, sender_id:u.id, body:t })
    .select('id,created_at').single();
  if(r.error) return { ok:false, err:r.error.message };
  await c.from('msg_conversations').update({ last_activity:new Date().toISOString() }).eq('id', convId);
  return { ok:true, msg:r.data };
}
async function msgCanDm(otherId){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.rpc('msg_can_dm', { a:u.id, b:otherId });
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, allowed:!!r.data };
}
async function msgOpenDirect(otherId){
  const can = await msgCanDm(otherId); if(!can.ok) return can;
  if(!can.allowed) return { ok:false, err:'msg_dm_interdit' };
  const u = await me(); const c = await sb();
  const ex = await c.from('msg_members').select('conversation_id').in('user_id',[u.id, otherId]);
  const ids = (ex.data || []).map(function(x){ return x.conversation_id; });
  if(ids.length){
    const m = await c.from('msg_members').select('conversation_id').in('conversation_id', ids).in('user_id',[u.id, otherId]);
    const cnt = {}; (m.data || []).forEach(function(x){ cnt[x.conversation_id] = (cnt[x.conversation_id]||0)+1; });
    for(const id of ids){
      if(cnt[id] === 2){
        const t = await c.from('msg_conversations').select('id').eq('id', id).eq('type','direct').maybeSingle();
        if(t.data) return { ok:true, convId:id, existing:true };
      }
    }
  }
  const r = await c.from('msg_conversations').insert({ type:'direct', created_by:u.id, titre:'' }).select('id').single();
  if(r.error) return { ok:false, err:r.error.message };
  const m1 = await c.from('msg_members').insert([{conversation_id:r.data.id,user_id:u.id},{conversation_id:r.data.id,user_id:otherId}]);
  if(m1.error) return { ok:false, err:m1.error.message };
  return { ok:true, convId:r.data.id, existing:false };
}
async function msgGroups(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_conversations').select('id,titre,wilaya,niveau,filiere,last_activity')
    .eq('type','groupe').order('last_activity',{ascending:false}).limit(50);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, groups:r.data || [] };
}
async function msgReport(messageId, motif){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_reports').insert({ message_id:messageId, reporter_id:u.id, motif:String(motif||'').slice(0,300) });
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgBlock(otherId){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_blocks').insert({ blocker_id:u.id, blocked_id:otherId });
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgUnblock(otherId){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_blocks').delete().eq('blocker_id', u.id).eq('blocked_id', otherId);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgEdit(msgId, body){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_messages').update({ body:String(body||'').slice(0,2000), edited_at:new Date().toISOString() })
    .eq('id', msgId).eq('sender_id', u.id).is('deleted_at', null);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgDelete(msgId){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const r = await c.from('msg_messages').update({ deleted_at:new Date().toISOString() })
    .eq('id', msgId).eq('sender_id', u.id);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgUpload(convId, msgId, file){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible (reseau/CDN)' };
  const okMime = ['image/png','image/jpeg','image/webp','application/pdf'].indexOf(file.type) !== -1;
  if(!okMime) return { ok:false, err:'type de fichier interdit (png/jpeg/webp/pdf seulement)' };
  if(!file.size || file.size > 5242880) return { ok:false, err:'fichier trop lourd (5 Mo max)' };
  const safe = String(file.name).replace(/[^a-zA-Z0-9._-]/g,'_').slice(-60);
  const path = 'msg/' + convId + '/' + u.id + '-' + Date.now() + '-' + safe;
  const up = await c.storage.from('prive').upload(path, file, { upsert:false });
  if(up.error) return { ok:false, err:up.error.message };
  const r = await c.from('msg_attachments').insert({ message_id:msgId, uploader:u.id, storage_path:path, mime:file.type, octets:file.size, statut:'pending' });
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, path:path };
}
function msgSubscribe(convId, cb){
  let ch = null;
  (async function(){
    const c = await sb(); if(!c) return;
    ch = c.channel('msg-' + convId)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'msg_messages', filter:'conversation_id=eq.' + convId },
          function(p){ if(cb) cb(p.new); })
      .subscribe();
  })();
  return function(){ try{ if(ch && ch.unsubscribe) ch.unsubscribe(); }catch(e){} };
}


/* ── MSG-5 · modération prof/admin : signalements, retraits, journal, groupes officiels ──
   Toute autorisation vient du RLS Lot 1 (update reports/attachments/messages = modérateur).
   Chaque action modération est journalisée par les triggers msg_logfn (immuable). */
async function msgReportsOpen(){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('msg_reports').select('id,message_id,reporter_id,motif,statut,created_at,msg_messages(body,sender_id,conversation_id,deleted_at)')
    .eq('statut','ouvert').order('created_at',{ascending:false}).limit(50);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, reports:r.data || [] };
}
async function msgHandle(reportId, decision, opts){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  opts = opts || {};
  const rr = await c.from('msg_reports').select('id,message_id').eq('id', reportId).maybeSingle();
  if(rr.error || !rr.data) return { ok:false, err:(rr.error && rr.error.message) || 'signalement introuvable' };
  const mid = rr.data.message_id;
  if(opts.retireAtt){
    const a = await c.from('msg_attachments').update({ statut:'retire' }).eq('message_id', mid);
    if(a.error) return { ok:false, err:a.error.message };
  }
  if(opts.deleteMsg){
    const d = await c.from('msg_messages').update({ deleted_at:new Date().toISOString() }).eq('id', mid);
    if(d.error) return { ok:false, err:d.error.message };
  }
  const up = await c.from('msg_reports').update({ statut:decision, handled_by:u.id, handled_at:new Date().toISOString() }).eq('id', reportId);
  if(up.error) return { ok:false, err:up.error.message };
  return { ok:true };
}
async function msgLogLast(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('msg_log').select('id,actor_id,action,cible_type,cible_id,at').order('at',{ascending:false}).limit(50);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, log:r.data || [] };
}
async function msgCreateGroup(wilaya, niveau, filiere, titre){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const t = String(titre || ('Groupe officiel ' + (wilaya||'?') + ' · ' + (niveau||'?') + ' ' + (filiere||'')));
  const r = await c.from('msg_conversations').insert({ type:'groupe', wilaya:String(wilaya||''), niveau:String(niveau||''), filiere:String(filiere||''), titre:t, created_by:u.id }).select('id').single();
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, convId:r.data.id };
}

window.SB = { login, signup, me, logout, pushMemoire, pullMemoire, upload, listFiles, fileUrl, sb, myProfile, listProfiles, listNotes, setRole, createSub, mySubs, setPreuve, listSubs, setSubStatut, createPayment, myPayments, adminPayments, deciderSub, addSponsor, listSponsors, setSponsorStatut, activeAds, createAd, msgConvs, msgMessages, msgSend, msgCanDm, msgOpenDirect, msgGroups, msgReport, msgBlock, msgUnblock, msgEdit, msgDelete, msgUpload, msgSubscribe, msgReportsOpen, msgHandle, msgLogLast, msgCreateGroup };
document.dispatchEvent(new CustomEvent('dz:sbready'));

/* ── MSG-6 · vérification d'identité scolaire (client fin — le RLS et le trigger décident) ── */
async function msgMyVerification(){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('profiles').select('verif_statut,matricule,section').eq('id', u.id).maybeSingle();
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, statut:(r.data && r.data.verif_statut) || 'non_verifie', matricule:(r.data && r.data.matricule) || '', section:(r.data && r.data.section) || '' };
}
async function msgRequestVerification(matricule, section){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('profiles')
    .update({ verif_statut:'en_attente', matricule:String(matricule||'').slice(0,40), section:String(section||'').slice(0,40) })
    .eq('id', u.id).or('verif_statut.eq.non_verifie,verif_statut.eq.rejete');
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function msgVerificationQueue(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('profiles')
    .select('id,pseudo,role,niveau,filiere,wilaya,matricule,section,created_at')
    .eq('verif_statut','en_attente').order('created_at',{ascending:true}).limit(50);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, queue:r.data||[] };
}
async function msgSetVerification(uid, statut){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  if(statut!=='verifie' && statut!=='rejete') return { ok:false, err:'statut invalide' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('profiles')
    .update({ verif_statut:statut, verif_by:u.id, verif_at:new Date().toISOString() })
    .eq('id', uid).eq('verif_statut','en_attente');
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
Object.assign(window.SB, { msgMyVerification, msgRequestVerification, msgVerificationQueue, msgSetVerification });

/* ── ADM-1 · sous-admins & wilayas (client fin — le RLS décide) ── */
async function admMyPerms(){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('wilaya_assignments').select('role_cle, code_wilaya, admin_permissions(permission)').eq('user_id', u.id);
  if(r.error) return { ok:false, err:r.error.message };
  const perms = []; const wilayas = []; let role = '';
  const prio = ['admin_general','responsable_regional','agent_paiement','responsable_pedagogique','agent_support'];
  (r.data||[]).forEach(function(row){
    wilayas.push(row.code_wilaya);
    (row.admin_permissions||[]).forEach(function(p){ if(perms.indexOf(p.permission)===-1) perms.push(p.permission); });
    if(!role || prio.indexOf(row.role_cle) < prio.indexOf(role)) role = row.role_cle;
  });
  return { ok:true, role:role, wilayas:wilayas, perms:perms };
}
async function admListAgents(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('wilaya_assignments').select('user_id, role_cle, code_wilaya, profiles(pseudo, wilaya)').order('user_id');
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, agents:r.data||[] };
}
async function admAssign(uid, roleCle, codes){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const d = await c.from('wilaya_assignments').delete().eq('user_id', uid);
  if(d.error) return { ok:false, err:d.error.message };
  const rows = (codes||[]).map(function(w){ return { user_id: uid, role_cle: roleCle, code_wilaya: String(w) }; });
  if(!rows.length) return { ok:true };
  const r = await c.from('wilaya_assignments').insert(rows);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function admRevoke(uid){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('wilaya_assignments').delete().eq('user_id', uid);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true };
}
async function admListProfiles(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('profiles').select('id,pseudo,role,niveau,wilaya').order('pseudo').limit(200);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, profiles:r.data||[] };
}
Object.assign(window.SB, { admMyPerms, admListAgents, admAssign, admRevoke, admListProfiles });

/* ── ADM-2 · file de validation, reçus, journal (client fin — le RLS + fonctions décident) ── */
async function admQueue(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('payments').select('id,montant,devise,statut,methode,ref_plateforme,user_id,profiles(pseudo,wilaya)')
    .in('statut', ['declare','en_attente']).order('id', { ascending:false }).limit(60);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, rows:r.data||[] };
}
async function admSetPaymentStatut(pid, statut, motif){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('payment_set_statut', { pid: pid, statut: statut, motif: motif || '' });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
async function admIssueReceipt(pid){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('issue_receipt', { pid: pid });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
async function admAuditLast(n){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('audit_logs').select('id,at,acteur,action,cible_type,cible_id,apres,wilaya')
    .order('at', { ascending:false }).limit(n || 15);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, rows:r.data||[] };
}
Object.assign(window.SB, { admQueue, admSetPaymentStatut, admIssueReceipt, admAuditLast });

/* ── ADM-3 · accords d'utilisation (client fin — fonctions serveur décident) ── */
async function myAgreements(){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const g = await c.from('agreements').select('id,cle,version,titre').eq('actif', true).order('cle');
  if(g.error) return { ok:false, err:g.error.message };
  const rows = [];
  for(const a of (g.data||[])){
    const s = await c.rpc('agreement_status_for', { uid: u.id, cle: a.cle });
    rows.push({ id:a.id, cle:a.cle, version:a.version, titre:a.titre, statut:(s.error ? 'inconnu' : s.data) });
  }
  return { ok:true, rows:rows };
}
async function acceptAgreement(aid, nomRep, lienRep){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('agreement_accept', { aid: aid, nom_representant: nomRep || '', lien_representant: lienRep || '' });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
async function acceptAgreementFor(aid, childUid, nomRep, lienRep){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('agreement_accept_for', { aid: aid, child_uid: childUid, nom_representant: nomRep || '', lien_representant: lienRep || '' });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
async function withdrawAgreement(aid){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('agreement_withdraw', { aid: aid });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
async function agreementText(aid){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('agreements').select('*').eq('id', aid).maybeSingle();
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, accord:r.data };
}
async function myChildren(){
  const u = await me(); if(!u) return { ok:false, err:'non connecté' };
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('child_links').select('child_id, profiles(pseudo, niveau, wilaya)').eq('parent_id', u.id);
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, children:r.data||[] };
}
async function admAgreements(){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.from('agreements').select('id,cle,version,titre,actif,cree_at').order('cle').order('version', { ascending:false });
  if(r.error) return { ok:false, err:r.error.message };
  return { ok:true, rows:r.data||[] };
}
async function admPublishAgreement(cle, titre, corps){
  const c = await sb(); if(!c) return { ok:false, err:'cloud indisponible' };
  const r = await c.rpc('agreement_publish', { cle: cle, titre: titre, corps: corps });
  if(r.error) return { ok:false, err:r.error.message };
  return r.data || { ok:true };
}
Object.assign(window.SB, { myAgreements, acceptAgreement, acceptAgreementFor, withdrawAgreement, agreementText, myChildren, admAgreements, admPublishAgreement });
