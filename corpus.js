/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — corpus.js
   📚 Corpus : base documentaire organisée (cours, sujets, corrigés, scans…)
   · registre corpus.json (métadonnées) + recherche plein-texte côté client
   · filtres matière / niveau / type / année · lecture / téléchargement
   · sert de source au tuteur et à la révision espacée
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let D = null, IDX = null;
  let filtres = { matiere:'', niveau:'', type:'', annee:'', q:'' };

  async function charge(){
    if(!D){
      try{
        const r = await fetch('assets/bdd/corpus.json', { cache:'force-cache' });
        D = r.ok ? await r.json() : { documents: [] };
      }catch(e){ D = { documents: [] }; }
    }
    if(!IDX){
      try{
        const r = await fetch('assets/bdd/corpus_index.json', { cache:'force-cache' });
        IDX = r.ok ? await r.json() : null;
      }catch(e){ IDX = null; }
    }
    return D;
  }

  function norm(s){ return String(s||'').toLowerCase(); }

  function resultats(){
    const docs = (D && D.documents) || [];
    let out = docs.filter(d =>
      (!filtres.matiere || d.matiere === filtres.matiere) &&
      (!filtres.niveau  || d.niveau  === filtres.niveau) &&
      (!filtres.type    || d.type    === filtres.type) &&
      (!filtres.annee   || String(d.annee) === filtres.annee));
    const q = norm(filtres.q);
    if(q){
      out = out.filter(d => norm(d.titre).indexOf(q) !== -1 ||
                            norm(d.extrait).indexOf(q) !== -1 ||
                            (d.tags || []).some(t => norm(t).indexOf(q) !== -1));
    }
    return out;
  }

  const LIB_TYPE = { cours:'📖 cours', manuel_perso:'📘 manuel perso', exercices:'✏️ exercices',
                     sujet:'📝 sujet', composition:'🧾 composition', corrige:'✅ corrigé',
                     annale:'🗂️ annale', resume:'📄 résumé', methode:'🧭 méthode', scan:'📷 scan' };

  function render(){
    const box = $('#corpusBody'); if(!box) return;
    charge().then(() => {
      const docs = (D && D.documents) || [];
      const matieres = Array.from(new Set(docs.map(d => d.matiere))).sort();
      const types = Array.from(new Set(docs.map(d => d.type))).sort();
      const annees = Array.from(new Set(docs.map(d => String(d.annee)))).sort();
      const res = resultats();

      let h = '<div class="cp-hero"><span class="cp-crest">📚</span><div>'
        + '<h2>Corpus pédagogique</h2>'
        + '<p class="cp-sub">' + docs.length + ' documents organisés · source d’information '
        + 'et base d’apprentissage · recherche hors-ligne</p></div>'
        + '<div class="cp-count"><b>' + res.length + '</b><span>résultats</span></div></div>';

      h += '<div class="card cp-filtres">'
        + '<input type="search" id="cpQ" placeholder="🔍 chercher un cours, un sujet, un corrigé…" '
        +   'value="' + esc(filtres.q) + '">'
        + '<div class="cp-sel">'
        + sel('cpMatiere', matieres, filtres.matiere, 'matière')
        + sel('cpNiveau', ['1AS','2AS','3AS'], filtres.niveau, 'niveau')
        + sel('cpType', types, filtres.type, 'type')
        + sel('cpAnnee', annees, filtres.annee, 'année')
        + '</div></div>';

      if(!res.length){
        h += '<div class="card cp-vide"><div class="cp-vi">🗂️</div>'
          + '<h3>aucun document</h3><p>Élargis les filtres, ou ajoute des documents via '
          + '<code>tools/ingest_corpus.py</code>.</p></div>';
      }else{
        h += '<div class="cp-grid">' + res.map(d =>
            '<div class="cp-c">'
          + '<div class="cp-top"><span class="cp-t">' + esc(LIB_TYPE[d.type] || d.type) + '</span>'
          + '<span class="cp-n">' + esc(d.niveau) + '</span></div>'
          + '<b class="cp-ti">' + esc(d.titre) + '</b>'
          + '<p class="cp-x">' + esc(d.extrait || '') + '</p>'
          + '<div class="cp-meta">' + esc(d.matiere) + ' · ' + esc(String(d.annee))
          + ' · ' + esc(d.format) + '</div>'
          + '<div class="cp-lic">© ' + esc(d.licence || '—') + '</div>'
          + '<div class="cp-btns"><a class="btn btn-p btn-sm" href="' + esc(d.url) + '" '
          + 'target="_blank" rel="noopener">📂 ouvrir</a>'
          + '<a class="btn btn-o btn-sm" href="' + esc(d.url) + '" download>⬇️</a></div>'
          + '</div>').join('') + '</div>';
      }
      box.innerHTML = h;

      $('#cpQ').addEventListener('input', e => { filtres.q = e.target.value; renderListe(); });
      ['cpMatiere','cpNiveau','cpType','cpAnnee'].forEach(id => {
        const el = $('#' + id);
        if(el) el.addEventListener('change', () => {
          filtres[{cpMatiere:'matiere',cpNiveau:'niveau',cpType:'type',cpAnnee:'annee'}[id]] = el.value;
          renderListe();
        });
      });
    });
  }

  function sel(id, opts, val, lbl){
    return '<select id="' + id + '"><option value="">' + lbl + ' : toutes</option>'
      + opts.map(o => '<option value="' + esc(o) + '"' + (o === val ? ' selected' : '') + '>'
        + esc(o) + '</option>').join('') + '</select>';
  }

  /* re-rend seulement la grille (garde le focus de la recherche) */
  function renderListe(){
    const box = $('#corpusBody'); if(!box) return;
    const res = resultats();
    const grid = $('.cp-grid', box) || $('.cp-vide', box);
    const cnt = $('.cp-count b', box);
    if(cnt) cnt.textContent = String(res.length);
    if(!grid) { render(); return; }
    if(!res.length){
      grid.outerHTML = '<div class="card cp-vide"><div class="cp-vi">🗂️</div>'
        + '<h3>aucun document</h3><p>Élargis les filtres.</p></div>';
      return;
    }
    const html = res.map(d =>
        '<div class="cp-c">'
      + '<div class="cp-top"><span class="cp-t">' + esc(LIB_TYPE[d.type] || d.type) + '</span>'
      + '<span class="cp-n">' + esc(d.niveau) + '</span></div>'
      + '<b class="cp-ti">' + esc(d.titre) + '</b>'
      + '<p class="cp-x">' + esc(d.extrait || '') + '</p>'
      + '<div class="cp-meta">' + esc(d.matiere) + ' · ' + esc(String(d.annee))
      + ' · ' + esc(d.format) + '</div>'
      + '<div class="cp-lic">© ' + esc(d.licence || '—') + '</div>'
      + '<div class="cp-btns"><a class="btn btn-p btn-sm" href="' + esc(d.url) + '" '
      + 'target="_blank" rel="noopener">📂 ouvrir</a>'
      + '<a class="btn btn-o btn-sm" href="' + esc(d.url) + '" download>⬇️</a></div>'
      + '</div>').join('');
    if(grid.classList.contains('cp-vide')){
      grid.outerHTML = '<div class="cp-grid">' + html + '</div>';
    }else{
      grid.innerHTML = html;
    }
  }

  window.renderCorpus = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'corpus') render(); });
})();
