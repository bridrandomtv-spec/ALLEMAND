/* ── Worker du site allemand.brid-randomtv.workers.dev ──
   Rôle unique : servir les actifs statiques (binding ASSETS) en imposant
   Cache-Control: no-store sur les chemins qui ne doivent JAMAIS être figés
   au bord (mise à jour du Service Worker, page d'entrée, JSON de données
   dont certains ont été pseudonymisés). Tout le reste garde le comportement
   de cache par défaut des Workers Static Assets (rapide).
   Déployé par l'intégration Git Cloudflare via wrangler.toml. */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
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
