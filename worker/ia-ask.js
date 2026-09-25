/* worker/ia-ask.js — CERVEAU de la plateforme (Cloudflare Workers AI, gratuit)
   Déploiement : Cloudflare → Workers & Pages → Create → Hello World → coller ce fichier
   → Settings → Variables & Secrets → ajouter une liaison « AI » nommée AI
     (ou secrets CF_AI_TOKEN + CF_ACCOUNT_ID si pas de liaison)
   → Deploy → copier l'URL (https://ia-ask.XXX.workers.dev)
   → la coller dans assets/bdd/config.json → "ia_proxy"
   Sécurité : aucune clé dans le code ; CORS limité à tes origines ; quota 20 req/min. */
const ORIGINS = ['https://allemand.brid-randomtv.workers.dev',
                 'https://bridrandomtv-spec.github.io'];
let HITS = [];
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/mistral/mistral-small-3.1-24b-instruct'];
const SYSTEM =
  'Tu es l\'assistant pédagogique d\'allemand de la plateforme du Professeur Kharif '
  + '(الثانوية الافتراضية الجزائرية). Règles strictes : '
  + '1) Réponds dans la langue de la question : allemand → allemand ; arabe ou darija → '
  + 'arabe clair avec les exemples en allemand ; français → français avec exemples en allemand. '
  + '2) Appuie-toi sur le CONTEXTE vérifié fourni et sur la grammaire allemande A1–B2 ; '
  + 'n\'invente JAMAIS de faits (notes, personnes, prix, contenu de la plateforme). '
  + '3) Réponse courte (80 mots max), structurée, avec 1 ou 2 exemples allemands quand utile. '
  + '4) Si la question sort de l\'allemand / de l\'école, ramène doucement vers l\'apprentissage. '
  + '5) Ton : professeur algérien bienveillant et encourageant.';
function cors(res, o){
  res.headers.set('Access-Control-Allow-Origin', o || ORIGINS[0]);
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
const json = (o, st, org) => cors(new Response(JSON.stringify(o),
  { status: st || 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }), org);
export default {
  async fetch(req, env){
    const org = ORIGINS.filter(o => (req.headers.get('Origin') || '') === o)[0] || ORIGINS[0];
    if(req.method === 'OPTIONS') return cors(new Response(null), org);
    const url = new URL(req.url);
    if(url.pathname === '/health') return json({ ok:true, ai: !!env.AI }, 200, org);
    if(url.pathname !== '/ask' || req.method !== 'POST') return json({ ok:false, err:'not-found' }, 404, org);
    let b = {};
    const raw = await req.text();
    try{ b = raw ? JSON.parse(raw) : {}; }catch(e){ b = {}; }
    const q = String(b.q || b.text || raw || '').slice(0, 600);
    const ctx = String(b.ctx || '').slice(0, 3000);
    if(!q) return json({ ok:false, err:'q-vide' }, 400, org);
    const now = Date.now();
    HITS = HITS.filter(t => now - t < 60000);
    if(HITS.length >= 20) return json({ ok:false, err:'quota-min' }, 429, org);
    HITS.push(now);
    const msgs = [{ role:'system', content: SYSTEM },
      { role:'user', content: (ctx ? 'CONTEXTE VÉRIFIÉ :\n' + ctx + '\n\nQUESTION : ' : '') + q }];
    try{
      let rep = '';
      if(env.AI){
        let lastErr = '';
        for(const m of MODELS){
          try{
            const r = await env.AI.run(m, { messages: msgs, max_tokens: 320 });
            rep = (r && (r.response || r.result)) || '';
            if(rep) break;
          }catch(e){ lastErr = String((e && e.message) || e); }
        }
        if(!rep) return json({ ok:false, err:'ai:' + lastErr.slice(0, 120) }, 500, org);
      }else if(env.CF_AI_TOKEN && env.CF_ACCOUNT_ID){
        const r = await fetch('https://api.cloudflare.com/client/v4/accounts/' + env.CF_ACCOUNT_ID
          + '/ai/run/@cf/meta/llama-3.1-8b-instruct', { method:'POST',
            headers:{ 'Authorization':'Bearer ' + env.CF_AI_TOKEN, 'Content-Type':'application/json' },
            body: JSON.stringify({ messages: msgs, max_tokens: 320 }) });
        const j = await r.json();
        rep = ((j.result || {}).response) || '';
      }else return json({ ok:false, err:'ai-non-configuré' }, 500, org);
      return json({ ok:true, rep: String(rep).trim() }, 200, org);
    }catch(e){
      return json({ ok:false, err: String((e && e.message) || e) }, 500, org);
    }
  }
};
