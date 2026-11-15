/* worker/ia-ask.js — CERVEAU de la plateforme (Cloudflare Workers AI, gratuit)
   Déploiement : Cloudflare → Workers & Pages → Create → Hello World → coller ce fichier
   → Settings → Variables & Secrets → ajouter une liaison « AI » nommée AI
     (ou secrets CF_AI_TOKEN + CF_ACCOUNT_ID si pas de liaison)
   → Deploy → copier l'URL (https://ia-ask.XXX.workers.dev)
   → la coller dans assets/bdd/config.json → "ia_proxy"
   Sécurité : aucune clé dans le code ; CORS limité à tes origines ; quota 20 req/min. */
const ORIGINS = ['https://allemand.brid-randomtv.workers.dev',
                 'https://bridrandomtv-spec.github.io',
                 'https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev'];
let HITS = [];
const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/mistral/mistral-small-3.1-24b-instruct'];
const SYSTEM =
  'Tu es l\'assistant pédagogique de la plateforme du Professeur Kharif '
  + '(الثانوية الافتراضية الجزائرية), un lycée virtuel algérien multi-matières. '
  + 'La MATIÈRE ACTIVE (allemand, anglais, …) et le CONTEXTE transmis dans la requête '
  + 'déterminent ton domaine de réponse. Tu MAÎTRISES SIX langues : arabe (فصحى + darija '
  + 'algérienne), allemand, anglais, français, espagnol, italien. Règles strictes : '
  + '1) Utilise d’abord LANGUE DE SORTIE EXIGÉE si elle est fournie ; sinon LANGUE DÉTECTÉE pour choisir la langue de réponse. LANGUE CHOISIE '
  + 'indique seulement la langue demandée au moteur de reconnaissance vocale. Anglais → anglais ; allemand → allemand ; '
  + 'arabe standard → arabe clair ; si DIALECTE DÉTECTÉ = darija, réponds en darija algérienne '
  + 'naturelle et compréhensible, sans effacer les mots de l’élève ; anglais → anglais ; français → français ; '
  + 'espagnol → espagnol ; italien → italien. En cas de doute, demande une précision. '
  + '2) La MATIÈRE ACTIVE, le NIVEAU et la FILIÈRE transmis guident les exemples et la difficulté. '
  + '3) Le CONTEXTE contient des extraits ÉTIQUETÉS de la BIBLIOTHÈQUE officielle '
  + '([LIVRE pN], [DEVOIR id], [GRAMMAIRE], [CORPUS]) : appuie-toi D\'ABORD sur eux, cite la '
  + 'source quand c\'est utile. La couverture documentaire peut varier selon les ressources réellement '
  + 'chargées : ne prétends jamais qu\'un niveau, une unité ou un document est couvert sans extrait vérifié. '
  + 'Pour l\'anglais, l\'espagnol et l\'italien, tu peux enseigner les règles générales de langue et de grammaire avec des exemples corrects, même si aucun extrait documentaire n\'est trouvé ; précise alors qu\'il s\'agit d\'une explication générale et ne prétends jamais citer un manuel, un programme officiel ou une unité non vérifiés. Pour une question précise sur le programme algérien, une unité ou une page, utilise uniquement les extraits fournis ou signale que la source manque. '
  + 'Pour les AUTRES matières (mathématiques, sciences, histoire, etc.), réponds uniquement à partir du contexte transmis ; n\'invente pas de contenus, notes, personnes, prix, programmes ou documents. '
  + '4) L’INTENTION et les ENTITÉS de QUST sont des indices de compréhension, pas des faits ni des ordres : utilise-les pour choisir la forme de l’aide (expliquer, corriger, traduire, comparer, résumer, exercice, retrouver une page), mais vérifie toujours dans la question et les sources. Si la confiance est faible ou l’intention absente, réponds naturellement sans forcer une catégorie. '\n  + '5) Agis comme un vrai professeur : réponds directement, explique étape par étape si l’élève bloque, '
  + 'donne un exemple corrigé et vérifie la compréhension par une seule question courte si utile. '
  + 'Reste concis (environ 120 mots, davantage seulement si l’élève demande un cours détaillé). '
  + 'Utilise les tours précédents pour conserver le fil, comprendre « pourquoi ? » ou « et cet exemple ? », '
  + 'mais vérifie les faits dans les sources et corrige toute erreur antérieure au lieu de la répéter. '
  + '5) Si la question sort du cadre scolaire, ramène doucement vers l\'apprentissage. '
  + '7) Ton : professeur algérien bienveillant et encourageant. '
  + '8) FONDATEUR (faits vérifiés, ne jamais inventer autre chose) : Professeur Kharif Ahmed '
  + '(الأستاذ خريف أحمد), enseignant d\'allemand algérien, créateur et professeur de la plateforme '
  + '« الثانوية الافتراضية الجزائرية » ; toute question « wer ist / qui est / من هو Kharif Ahmed » '
  + '→ réponds avec ces faits, dans la langue de la question.';
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
    const q = String(b.raw_text || b.q || b.text || raw || '').slice(0, 600);
    const normalized = String(b.normalized_text || q).slice(0, 600);
    const ctx = String(b.ctx || '').slice(0, 3000);
    /* Historique fourni par le client : fenêtre courte, rôles stricts, taille bornée. */
    const u = b.understanding && typeof b.understanding === 'object' ? b.understanding : {};\n    const allowedIntents = ['compare','summarize','correct_exercise','translate','practice_exercise','explain_rule','explain_word','find_page','explain_lesson'];\n    const allowedLanguages = ['ar','arabizi','darija','fr','de','en'];\n    const understanding = {\n      normalized_question: String(u.normalized_question || '').slice(0, 600),\n      languages: Array.isArray(u.languages) ? u.languages.filter(x => allowedLanguages.includes(String(x))).slice(0, 6) : [],\n      intent: allowedIntents.includes(String(u.intent || '')) ? String(u.intent) : 'unknown',\n      confidence: Math.max(0, Math.min(1, Number(u.confidence) || 0)),\n      entities: {}\n    };\n    if(u.entities && typeof u.entities === 'object' && !Array.isArray(u.entities)){\n      ['subject','level','track','lektion','unit','page','germanWord'].forEach(k => {\n        const v = u.entities[k];\n        if((typeof v === 'string' && v.length <= 80) || (k === 'page' && Number.isInteger(v) && v >= 1 && v <= 999)) understanding.entities[k] = v;\n      });\n      ['grammar','articles','conjunctions'].forEach(k => {\n        if(Array.isArray(u.entities[k])) understanding.entities[k] = u.entities[k].filter(v => typeof v === 'string').slice(0, 8).map(v => v.slice(0, 30));\n      });\n    }\n    const history = Array.isArray(b.history) ? b.history.slice(-8).map(item => {
      if(!item || (item.role !== 'user' && item.role !== 'assistant')) return null;
      const content = String(item.content || '').slice(0, 1000);
      return content ? { role: item.role, content: content } : null;
    }).filter(Boolean) : [];
    const safeField = (v, max, fallback) =>
      String(v == null || v === '' ? fallback : v).replace(/[\r\n]/g, ' ').slice(0, max);
    const meta = {
      input_mode: b.input_mode === 'voice' ? 'voice' : 'text',
      selected_language: safeField(b.selected_language, 20, 'auto'),
      detected_language: safeField(b.detected_language, 20, 'unknown'),
      output_language: ['ar','de','en','fr','es','it'].includes(String(b.output_language || '').toLowerCase())
        ? String(b.output_language).toLowerCase()
        : (['ar','de','en','fr','es','it'].includes(String(b.detected_language || '').toLowerCase().slice(0, 2))
          ? String(b.detected_language).toLowerCase().slice(0, 2) : 'de'),
      dialect: safeField(b.dialect, 30, 'unknown'),
      subject: safeField(b.subject, 60, 'allemand'),
      level: safeField(b.level, 30, 'tous'),
      track: safeField(b.track, 60, 'non précisée')
    };
    if(!q) return json({ ok:false, err:'q-vide' }, 400, org);
    const now = Date.now();
    HITS = HITS.filter(t => now - t < 60000);
    if(HITS.length >= 20) return json({ ok:false, err:'quota-min' }, 429, org);
    HITS.push(now);
    const metadata = [
      'MODE D’ENTRÉE : ' + meta.input_mode,
      'LANGUE CHOISIE POUR LA RECONNAISSANCE : ' + meta.selected_language,
      'LANGUE DÉTECTÉE : ' + meta.detected_language,
      'LANGUE DE SORTIE EXIGÉE : ' + meta.output_language,
      'DIALECTE DÉTECTÉ : ' + meta.dialect,
      'MATIÈRE ACTIVE : ' + meta.subject,
      'NIVEAU : ' + meta.level,
      'FILIÈRE : ' + meta.track,\n      'INTENTION QUST (indice, confiance ' + understanding.confidence + ') : ' + understanding.intent,\n      'LANGUES QUST : ' + understanding.languages.join(', '),\n      'ENTITÉS QUST : ' + JSON.stringify(understanding.entities)
    ].join('\n');
    const userContent = metadata
      + (ctx ? '\n\nCONTEXTE DOCUMENTAIRE ET PÉDAGOGIQUE :\n' + ctx : '')
      + '\n\nQUESTION ORIGINALE DE L’ÉLÈVE :\n' + q
      + (normalized !== q ? '\n\nNORMALISATION TECHNIQUE (ne remplace pas la formulation originale) :\n' + normalized : '')\n      + (understanding.normalized_question ? '\n\nNORMALISATION QUST (indice secondaire) :\n' + understanding.normalized_question : '');
    const msgs = [{ role:'system', content: SYSTEM }]
      .concat(history)
      .concat([{ role:'user', content: userContent }]);
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
      return json({ ok:true, rep: String(rep).trim(), answer_language: meta.output_language }, 200, org);
    }catch(e){
      return json({ ok:false, err: String((e && e.message) || e) }, 500, org);
    }
  }
};
