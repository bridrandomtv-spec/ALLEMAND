/* ── Worker du site allemand.brid-randomtv.workers.dev ──
   Rôle 1 : servir les actifs statiques (binding ASSETS) en imposant
   Cache-Control: no-store sur les chemins sensibles (sw, entrée, JSON bdd).
   Rôle 2 (CONTENT-1) : GARDE server-side des contenus payants — les fichiers
   d'unités et les JSON de livres/traductions ne partent qu'avec un jeton
   Supabase dont l'entitlement est vérifié PAR LE RLS EXISTANT (lesson_content).
   Variables CF requises : SUPABASE_URL, SUPABASE_ANON_KEY.
   Tant qu'elles sont absentes : mode temporaire fail-open signalé par
   X-Content-Guard: config-manquante (le retirer = bloquer tout le monde). */
const PROT = [
  /^\/unite(2|3|4|5|6|10|11|12|13|14|15|16)\.js$/,
  /^\/unites3as_[ab]\.js$/,
  /^\/devoirs_unite\.js$/,
  /^\/assets\/bdd\/buch_3as_.*\.json$/,
  /^\/assets\/bdd\/traductions_livre\.json$/
];
function jsonRes(o, status){
  return new Response(JSON.stringify(o), { status: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (PROT.some(function(re){ return re.test(url.pathname); })) {
      if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        const r = await env.ASSETS.fetch(request);
        const h = new Headers(r.headers);
        h.set('Cache-Control', 'no-store');
        h.set('X-Content-Guard', 'config-manquante');
        return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
      }
      const auth = request.headers.get('Authorization') || '';
      if (!/^Bearer .+/.test(auth)) return jsonRes({ error: 'abonnement_requis' }, 401);
      let ok = false;
      try {
        const chk = await fetch(env.SUPABASE_URL + '/rest/v1/lesson_content?select=id&limit=1',
          { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: auth } });
        const j = await chk.json();
        ok = Array.isArray(j) && j.length > 0;
      } catch (e) { ok = false; }
      if (!ok) return jsonRes({ error: 'abonnement_requis' }, 403);
    }
    const response = await env.ASSETS.fetch(request);
    const noStore =
      url.pathname === '/sw.js' ||
      url.pathname === '/' ||
      url.pathname === '/index.html' ||
      url.pathname.startsWith('/assets/bdd/');
    if (noStore) {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return response;
  },
};
