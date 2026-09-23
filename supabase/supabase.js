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

window.SB = { login, signup, me, logout, pushMemoire, pullMemoire, upload, listFiles, fileUrl, sb, myProfile, listProfiles, listNotes, setRole, createSub, mySubs, setPreuve, listSubs, setSubStatut, addSponsor, listSponsors, setSponsorStatut, activeAds, createAd };
document.dispatchEvent(new CustomEvent('dz:sbready'));
