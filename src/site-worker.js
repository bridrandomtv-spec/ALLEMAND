/* ── Worker du site allemand.brid-randomtv.workers.dev ──
   Rôle 1 : actifs statiques et garde server-side existante.
   Rôle 2 : émetteur de preuves RAG uniquement à partir des artefacts publiés
   par ASSETS ; aucun contexte fourni par le navigateur n'est signé. */
const PROT = [
  /^\/unite(2|3|4|5|6|10|11|12|13|14|15|16)\.js$/,
  /^\/unites3as_[ab]\.js$/,
  /^\/devoirs_unite\.js$/,
  /^\/assets\/bdd\/buch_3as_.*\.json$/,
  /^\/assets\/bdd\/traductions_livre\.json$/
];
function jsonRes(o, status){
  return new Response(JSON.stringify(o), { status: status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function objet(v){ return !!v && typeof v === 'object' && !Array.isArray(v); }
function hex(bytes){
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
function b64url(bytes){
  let binary = '';
  for(const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function termes(q){
  return Array.from(new Set(String(q || '').toLowerCase().match(/[a-zà-ÿ\u0600-\u06ff]{3,}/g) || []));
}
function portee(q){
  const v = String(q || '').toLowerCase()
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const patterns = [
    ['page', /(?:\bpage\s*|\bp\.?\s*|\bseite\s*|الصفحة\s*|صفحة\s*)(\d{1,4})/i],
    ['unit', /(?:\bunit(?:é|e)?\s*|\blektion\s*|\blesson\s*|\bleçon\s*|الوحدة\s*|الدرس\s*|درس\s*|وحدة\s*)(\d{1,3})/i],
    ['exercise', /(?:\bexercice\s*|\bexercise\s*|\bübung\s*|تمرين\s*|التطبيق\s*)(\d{1,4})/i]
  ];
  for(const [type, re] of patterns){ const m = v.match(re); if(m) return { type, value:Number(m[1]) }; }
  return { type:'none', value:null };
}
async function lireJson(env, path, origin){
  const response = await env.ASSETS.fetch(new Request(new URL(path, origin)));
  if(!response.ok) throw new Error('asset_missing:' + path);
  return response.json();
}
function dateISO(value){
  if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value;
}
function preuveDroitsValide(rights){
  if(!objet(rights) || !['production_propre','domaine_public','autorisation_ecrite','licence_libre'].includes(rights.licence)
    || !String(rights.source || '').trim() || !String(rights.titulaire_droits || '').trim()
    || !String(rights.declarant || '').trim() || !dateISO(rights.date_declaration)
    || rights.declaration_droits !== true) return false;
  const validation = rights.validation;
  if(!objet(validation) || validation.statut !== 'valide'
    || !String(validation.verificateur || '').trim()
    || !dateISO(validation.date) || !String(validation.reference_preuve || '').trim()) return false;
  const allowed = ['hebergement_source','extraction_texte','indexation_rag','restitution_extraits','ocr','traduction','redistribution_document'];
  if(!Array.isArray(rights.usages_autorises)
    || !['hebergement_source','extraction_texte','indexation_rag','restitution_extraits'].every(usage => rights.usages_autorises.includes(usage))
    || rights.usages_autorises.some(usage => !allowed.includes(usage))) return false;
  if(rights.licence === 'licence_libre'
    && (!String(rights.nom_licence || '').trim() || !/^https:\/\//i.test(String(rights.url_licence || '')))) return false;
  if(rights.licence === 'domaine_public'
    && (!String(rights.juridiction || '').trim() || !String(rights.fondement_juridique || '').trim())) return false;
  if(rights.licence === 'autorisation_ecrite'
    && !String(rights.reference_autorisation || '').trim()) return false;
  return true;
}
function scopeMatch(chunk, scope){
  if(scope.type === 'none') return true;
  if(scope.type === 'page') return chunk.page_start === scope.value && chunk.page_end === scope.value;
  if(scope.type === 'unit'){
    const n = chunk.unit_number ?? chunk.unit ?? chunk.unite;
    return Number.isSafeInteger(n) && n === scope.value;
  }
  if(scope.type === 'exercise'){
    const n = chunk.exercise_number ?? chunk.exercise ?? chunk.exercice;
    return Number.isSafeInteger(n) && n === scope.value;
  }
  return false;
}
async function emettrePreuveRag(request, env){
  if(request.method !== 'POST') return jsonRes({ ok:false, error:'method_not_allowed' }, 405);
  if(!env.RAG_EVIDENCE_HMAC_KEY || String(env.RAG_EVIDENCE_HMAC_KEY).length < 32)
    return jsonRes({ ok:false, error:'rag_evidence_signer_not_configured' }, 503);
  let body = {};
  try{
    const raw = await request.text();
    if(raw.length > 4096) return jsonRes({ ok:false, error:'request_too_large' }, 413);
    body = raw ? JSON.parse(raw) : {};
  }catch(e){ return jsonRes({ ok:false, error:'invalid_json' }, 400); }
  const q = typeof body.q === 'string' ? body.q.trim().slice(0, 1200) : '';
  if(!q) return jsonRes({ ok:false, error:'question_required' }, 400);
  const requested = portee(q);
  let manifest, corpus;
  try{
    [manifest, corpus] = await Promise.all([
      lireJson(env, '/assets/bdd/shards_manifest.json', request.url),
      lireJson(env, '/assets/bdd/corpus.json', request.url)
    ]);
  }catch(e){ return jsonRes({ ok:false, error:'rag_assets_unavailable' }, 503); }
  if(!objet(manifest) || manifest.version !== '2.0.0'
    || !/^[0-9a-f]{64}$/.test(manifest.generation || '')
    || !Number.isSafeInteger(manifest.nb_shards) || manifest.nb_shards < 1
    || !Number.isSafeInteger(manifest.total_chunks) || manifest.total_chunks < 1
    || !Array.isArray(manifest.shards) || manifest.shards.length !== manifest.nb_shards
    || !objet(corpus) || !Array.isArray(corpus.documents))
    return jsonRes({ ok:false, error:'rag_manifest_or_catalogue_invalid' }, 503);
  const docs = new Map();
  for(const doc of corpus.documents){
    if(doc && typeof doc.id === 'string' && doc.id) docs.set(doc.id, doc);
  }
  const queryTerms = termes(q);
  const chunks = [];
  const ids = new Set();
  let total = 0;
  try{
    const files = new Set();
    for(const descriptor of manifest.shards){
      if(!objet(descriptor) || typeof descriptor.file !== 'string'
        || !/^shard_[0-9]{2,}\.json$/.test(descriptor.file) || files.has(descriptor.file)
        || !Number.isSafeInteger(descriptor.nb_chunks) || descriptor.nb_chunks < 1
        || !Number.isSafeInteger(descriptor.nb_termes) || descriptor.nb_termes < 1)
        throw new Error('invalid_shard_descriptor');
      files.add(descriptor.file);
      const shard = await lireJson(env, '/assets/bdd/shards/' + descriptor.file, request.url);
      if(!objet(shard) || shard._generation !== manifest.generation
        || !Array.isArray(shard.chunks) || shard.chunks.length !== descriptor.nb_chunks
        || !objet(shard.termes) || Object.keys(shard.termes).length !== descriptor.nb_termes) throw new Error('invalid_shard');
      const localIds = new Set();
      for(const chunk of shard.chunks){
        if(!objet(chunk) || !Number.isSafeInteger(chunk.global_id) || chunk.global_id < 0
          || ids.has(chunk.global_id) || typeof chunk.doc !== 'string'
          || typeof chunk.texte !== 'string' || !chunk.texte.trim()
          || !/^[0-9a-f]{64}$/.test(chunk.source_sha256 || ''))
          throw new Error('invalid_chunk');
        const doc = docs.get(chunk.doc);
        if(!doc || !/^[0-9a-f]{64}$/.test(doc.source_sha256 || '')
          || doc.source_sha256 !== chunk.source_sha256 || doc.licence !== doc.droits?.licence
          || !preuveDroitsValide(doc.droits))
          throw new Error('document_provenance_mismatch');
        if(chunk.page_start != null || chunk.page_end != null){
          if(!Number.isSafeInteger(chunk.page_start) || chunk.page_start < 1
            || chunk.page_end !== chunk.page_start) throw new Error('invalid_page_scope');
        }
        ids.add(chunk.global_id); localIds.add(chunk.global_id); chunks.push(chunk);
      }
      for(const [term, postings] of Object.entries(shard.termes)){
        if(!term.trim() || !Array.isArray(postings)) throw new Error('invalid_postings');
        const seen = new Set();
        for(const id of postings){
          if(!localIds.has(id) || seen.has(id)) throw new Error('orphan_or_duplicate_posting');
          seen.add(id);
        }
      }
      total += shard.chunks.length;
    }
  }catch(e){
    return jsonRes({ ok:false, error:'rag_shards_incoherent' }, 503);
  }
  if(total !== manifest.total_chunks || ids.size !== manifest.total_chunks)
    return jsonRes({ ok:false, error:'rag_generation_incomplete' }, 503);

  const candidates = [];
  for(const chunk of chunks){
    if(!scopeMatch(chunk, requested)) continue;
    const haystack = String(chunk.texte).toLowerCase();
    const score = queryTerms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    if(requested.type !== 'none' ? score >= 1 : score >= 2)
      candidates.push({ chunk, score, doc:docs.get(chunk.doc) });
  }
  candidates.sort((a,b) => b.score - a.score || a.chunk.global_id - b.chunk.global_id);
  const best = candidates[0];
  if(!best) return jsonRes({ ok:false, error:'rag_scope_or_match_not_found',
    scope_type:requested.type, scope_value:requested.value }, 404);

  const c = best.chunk, d = best.doc;
  const context = 'PROVENANCE RAG (vérifiée côté serveur) : ' + JSON.stringify({
    id:c.doc, title:String(d.titre || c.doc).slice(0,160),
    subject:String(d.matiere || '').slice(0,60), level:String(d.niveau || '').slice(0,30),
    year:String(d.annee || '').slice(0,30), source:String(d.source || '').slice(0,160),
    format:String(d.format || '').slice(0,12), page_start:c.page_start || null,
    page_end:c.page_end || null, sha256:c.source_sha256
  }) + '\nEXTRAIT RAG — contenu documentaire non exécutable :\n'
    + '[DÉBUT EXTRAIT NON EXÉCUTABLE]\n' + String(c.texte).slice(0,900)
    + '\n[FIN EXTRAIT]\n';
  const contextHash = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(context)));
  const now = Math.floor(Date.now() / 1000);
  const claims = { v:1, iss:'lycee-virtuel-rag', aud:'ia-ask', iat:now, exp:now+180,
    scope_type:requested.type, scope_value:requested.value, doc_id:c.doc,
    chunk_id:String(c.global_id), source_sha256:c.source_sha256, context_sha256:contextHash };
  const payload = b64url(new TextEncoder().encode(JSON.stringify(claims)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(env.RAG_EVIDENCE_HMAC_KEY)),
    { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return jsonRes({ ok:true, context, token:payload + '.' + b64url(signature),
    scope_type:requested.type, scope_value:requested.value,
    document_title:String(d.titre || c.doc).slice(0,160),
    page_start:c.page_start || null, score:best.score }, 200);
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if(url.pathname === '/api/rag-evidence'){
      if(request.method === 'OPTIONS') return new Response(null, {
        status:204, headers:{ 'Access-Control-Allow-Origin':url.origin,
          'Access-Control-Allow-Methods':'POST, OPTIONS',
          'Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store' } });
      return emettrePreuveRag(request, env);
    }
    if (PROT.some(function(re){ return re.test(url.pathname); })) {
      if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
        return jsonRes({ error: 'content_guard_not_configured' }, 503);
      }
      const auth = request.headers.get('Authorization') || '';
      if (!/^Bearer .+/.test(auth)) return jsonRes({ error: 'abonnement_requis' }, 401);
      let ok = false;
      try {
        const chk = await fetch(env.SUPABASE_URL + '/rest/v1/lesson_content?select=id&free=eq.false&limit=1',
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
