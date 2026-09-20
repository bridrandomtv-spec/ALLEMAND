/* supabase.js — client cloud de la plateforme (module ES)
   Auth réelle + sync + storage privé 'prive'. Repli localStorage si hors-ligne. */
const URL = 'https://azjwcybivirvpxbfhyzk.supabase.co';
const KEY = 'sb_publishable_eLv27yLjmxuiE9xP_h50qw_4ID6dDHz';
let client = null;

async function sb(){
  if(client) return client;
  const m = await import('https://esm.sh/@supabase/supabase-js@2');
  client = m.createClient(URL, KEY, { auth: { persistSession: true } });
  return client;
}
async function login(email, pass){
  const c = await sb();
  const r = await c.auth.signInWithPassword({ email, password: pass });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, user: r.data.user };
}
async function signup(email, pass, meta){
  const c = await sb();
  const r = await c.auth.signUp({ email, password: pass, options: { data: meta || {} } });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, user: r.data.user };
}
async function me(){
  const c = await sb();
  const r = await c.auth.getSession();
  return r.data.session ? r.data.session.user : null;
}
async function logout(){ const c = await sb(); await c.auth.signOut(); }

/* sync mémoire locale → cloud */
async function pushMemoire(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb();
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
  const c = await sb();
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
  const c = await sb();
  const path = u.id + '/' + file.name;
  const r = await c.storage.from('prive').upload(path, file, { upsert: true });
  if(r.error) return { ok: false, err: r.error.message };
  await c.from('documents_meta').upsert({ owner_id: u.id, nom: file.name,
    chemin: path, type: file.type, taille: file.size }, { onConflict: 'chemin' });
  return { ok: true, path };
}
async function listFiles(){
  const u = await me(); if(!u) return { ok: false, err: 'non connecté' };
  const c = await sb();
  const r = await c.from('documents_meta').select('*').eq('owner_id', u.id).order('at', { ascending: false });
  return r.error ? { ok: false, err: r.error.message } : { ok: true, files: r.data || [] };
}
async function fileUrl(chemin){
  const c = await sb();
  const r = await c.storage.from('prive').createSignedUrl(chemin, 3600);
  return r.error ? null : r.data.signedUrl;
}

window.SB = { login, signup, me, logout, pushMemoire, pullMemoire, upload, listFiles, fileUrl, sb };
document.dispatchEvent(new CustomEvent('dz:sbready'));
