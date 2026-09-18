/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — rag.js
   🔎 RAG GARDÉ : retrieval-augmented generation SANS génération
   ──────────────────────────────────────────────────────────────────────
   Principe : une question ouverte est cherchée dans TON corpus
   (corpus_index.json = index inversé de chunks). La réponse est TOUJOURS
   un EXTRAIT VERBATIM d'un chunk de TA base + sa source + sa licence.
   Jamais de texte inventé : si le score est sous le seuil, on répond
   « je ne sais pas » + la règle la plus proche, jamais une règle fabriquée.
   Aucun LLM, aucun coût, aucune hallucination, fonctionne hors-ligne.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SEUIL = 2;          /* au moins 2 termes communs pour considérer pertinent */
  let IDX = null, CORP = null;

  async function charge(){
    if(!IDX){
      try{
        const r = await fetch('assets/bdd/corpus_index.json', { cache:'force-cache' });
        IDX = r.ok ? await r.json() : null;
      }catch(e){ IDX = null; }
    }
    if(!CORP){
      try{
        const r = await fetch('assets/bdd/corpus.json', { cache:'force-cache' });
        CORP = r.ok ? await r.json() : { documents: [] };
      }catch(e){ CORP = { documents: [] }; }
    }
    return { IDX: IDX, CORP: CORP };
  }

  function termes(q){
    return Array.from(new Set(
      String(q || '').toLowerCase().match(/[a-zà-ÿ\u0600-\u06FF]{3,}/g) || []));
  }

  /* cherche : retourne { score, texte, doc } ou null */
  async function cherche(q){
    const c = await charge();
    if(!c.IDX || !c.IDX.chunks) return null;
    const ts = termes(q);
    if(!ts.length) return null;
    const scores = {};
    ts.forEach(t => {
      (c.IDX.termes[t] || []).forEach(cid => { scores[cid] = (scores[cid] || 0) + 1; });
    });
    let best = null, bestScore = 0;
    Object.keys(scores).forEach(cid => {
      if(scores[cid] > bestScore){ bestScore = scores[cid]; best = +cid; }
    });
    if(best === null || bestScore < SEUIL) return null;
    const chunk = c.IDX.chunks[best];
    if(!chunk) return null;
    const doc = (c.CORP.documents || []).filter(d => d.id === chunk.doc)[0] || null;
    return { score: bestScore, texte: chunk.texte, doc: doc };
  }

  /* réponse prête à afficher : extrait verbatim + source + licence */
  function formule(r){
    if(!r) return null;
    const extrait = String(r.texte || '').split(/\s+/).slice(0, 70).join(' ');
    return '📚 <b>من قاعدة معرفتك</b> — '
      + (r.doc ? '« ' + esc(r.doc.titre) + ' » (' + esc(r.doc.licence || '—') + ')' : 'corpus')
      + ' :<br><span class="rag-x">« ' + esc(extrait) + ' … »</span>'
      + '<br><span class="rag-src">réponse extraite de ta base (score ' + r.score
      + ') — jamais inventée.</span>';
  }

  /* vue 🔎 اسأل المنصة */
  async function render(){
    const box = $('#ragBody'); if(!box) return;
    box.innerHTML =
        '<div class="rg-hero"><span class="rg-crest">🔎</span><div>'
      + '<h2>اسأل المنصة (RAG gardé)</h2>'
      + '<p class="rg-sub">la réponse vient TOUJOURS d’un extrait de ton corpus — '
      + 'jamais inventée · hors-ligne</p></div></div>'
      + '<div class="card rg-box">'
      + '<form id="ragForm"><input type="search" id="ragQ" '
      + 'placeholder="مثال : كيف أصرف sein ؟ · ما قاعدة الأفعال الانفصالية ؟"></form>'
      + '<div id="ragOut" class="rg-out"></div></div>';
    $('#ragForm').addEventListener('submit', async ev => {
      ev.preventDefault();
      const q = ($('#ragQ').value || '').trim();
      const out = $('#ragOut');
      if(!q){ out.innerHTML = ''; return; }
      out.innerHTML = '<div class="rg-load">⏳ recherche dans ton corpus…</div>';
      const r = await cherche(q);
      const f = formule(r);
      out.innerHTML = f
        ? '<div class="rg-ok">' + f + '</div>'
        : '<div class="rg-non">🤷 <b>لا أعرف / je ne sais pas.</b><br>'
          + 'Aucun extrait de ton corpus ne répond avec assez de confiance. '
          + 'Je n’invente jamais : ajoute le document via '
          + '<code>tools/ingest_corpus.py</code> puis repose la question.</div>';
    });
  }

  window.RAG = { cherche: cherche, formule: formule, SEUIL: SEUIL, render: render };
  window.renderRag = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'rag') render(); });
})();
