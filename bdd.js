/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — bdd.js
   Moteur de base de données : 684 fiches (devoirs · compositions · BAC · حوليات)
   Chargement progressif · index · recherche plein-texte · filtres facettés
   ══════════════════════════════════════════════════════════════ */
'use strict';

const BDD = (function(){
  const SOURCES = [
    { id:'devoir',      file:'assets/bdd/devoirs.json',      ar:'فروض',              de:'Kontrollarbeiten' },
    { id:'composition', file:'assets/bdd/compositions.json', ar:'اختبارات فصلية',    de:'Trimesterprüfungen' },
    { id:'bac',         file:'assets/bdd/bac.json',          ar:'بكالوريا',          de:'Baccalauréat' },
    { id:'annales',     file:'assets/bdd/annales.json',      ar:'حوليات',            de:'Annales' }
  ];
  const REF_FILE = 'assets/bdd/referentiel.json';

  const S = {
    items: [], index: null, ref: null,
    loaded: 0, total: SOURCES.length, ready: false, error: null,
    q: '', filtres: { type:'tous', niveau:'tous', filiere:'tous', wilaya:'tous',
                      annee:'tous', trimestre:'tous', unite:'tous', difficulte:'tous',
                      corrige:'tous' },
    tri: 'recent', page: 1, perPage: 12, resultats: []
  };

  /* ── Normalisation pour la recherche ── */
  const ARAB_MAP = { 'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ة':'ه','ى':'ي','ؤ':'و','ئ':'ي','ء':'' };
  function normalise(t){
    let s = String(t || '').toLowerCase();
    s = s.replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c));
    s = s.replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
         .replace(/[ؤئء]/g,'').replace(/[\u064B-\u065F\u0670]/g,'');
    s = s.replace(/[^a-z0-9\u0600-\u06FF ]/g,' ').replace(/\s+/g,' ').trim();
    return s;
  }

  /* ── Chargement ── */
  async function load(onProgress){
    try{
      const rr = await fetch(REF_FILE, { cache:'force-cache' });
      if(rr.ok) S.ref = await rr.json();
    }catch(e){}

    let ok = 0;
    await Promise.all(SOURCES.map(async src => {
      try{
        const res = await fetch(src.file, { cache:'force-cache' });
        if(!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        (data.items || []).forEach(it => { it._src = src.id; S.items.push(it); });
        ok++;
      }catch(e){ console.warn('[bdd]', src.file, e); }
      S.loaded++;
      if(onProgress) onProgress(S.loaded, S.total, S.items.length);
    }));

    if(!S.items.length){ S.error = 'تعذّر تحميل قاعدة البيانات'; return false; }
    buildIndex();
    S.ready = true;
    document.dispatchEvent(new CustomEvent('dz:bdd', { detail:{ total:S.items.length } }));
    return true;
  }

  /* ── Index plein-texte ── */
  function buildIndex(){
    S.index = S.items.map(it => ({
      ref: it,
      txt: normalise([it.titre, it.titre_de, it.unite_de, it.unite_ar, it.wilaya, it.ville,
                      it.lycee, it.filiere, it.source, (it.tags || []).join(' '), it.sujet].join(' ')),
      annee: it.annee || 0, vues: it.vues || 0
    }));
  }

  /* ── Recherche + filtres ── */
  function search(){
    const f = S.filtres, q = normalise(S.q);
    const terms = q ? q.split(' ').filter(Boolean) : [];

    S.resultats = S.index.filter(e => {
      const it = e.ref;
      if(f.type       !== 'tous' && it.type      !== f.type)       return false;
      if(f.niveau     !== 'tous' && it.niveau    !== f.niveau)     return false;
      if(f.filiere    !== 'tous' && it.filiere   !== f.filiere)    return false;
      if(f.wilaya     !== 'tous' && it.code_wilaya !== f.wilaya)   return false;
      if(f.annee      !== 'tous' && String(it.annee) !== f.annee)  return false;
      if(f.trimestre  !== 'tous' && String(it.trimestre) !== f.trimestre) return false;
      if(f.unite      !== 'tous' && String(it.unite) !== f.unite)  return false;
      if(f.difficulte !== 'tous' && String(it.difficulte) !== f.difficulte) return false;
      if(f.corrige === 'oui' && !it.corrige_inclus) return false;
      if(f.corrige === 'non' &&  it.corrige_inclus) return false;
      if(terms.length && !terms.every(t => e.txt.indexOf(t) !== -1)) return false;
      return true;
    });

    const tri = S.tri;
    S.resultats.sort((a,b) => {
      if(tri === 'recent')    return b.annee - a.annee || b.ref.trimestre - a.ref.trimestre;
      if(tri === 'ancien')    return a.annee - b.annee || a.ref.trimestre - b.ref.trimestre;
      if(tri === 'populaire') return (b.ref.vues||0) - (a.ref.vues||0);
      if(tri === 'note')      return (b.ref.note_moyenne||0) - (a.ref.note_moyenne||0);
      if(tri === 'difficile') return (b.ref.difficulte||0) - (a.ref.difficulte||0);
      return 0;
    });
    S.page = 1;
    return S.resultats.length;
  }

  function page(){
    const start = (S.page - 1) * S.perPage;
    return S.resultats.slice(start, start + S.perPage).map(e => e.ref);
  }
  function pages(){ return Math.max(1, Math.ceil(S.resultats.length / S.perPage)); }
  function setPage(n){ S.page = Math.min(Math.max(1, n), pages()); }

  /* ── Facettes ── */
  function facet(champ, prefix){
    const c = {};
    S.items.forEach(it => { const k = prefix ? it[prefix] : it[champ];
                            if(k !== undefined && k !== null) c[k] = (c[k]||0) + 1; });
    return c;
  }
  function countByType(){
    const c = { devoir:0, composition:0, bac:0, annales:0 };
    S.items.forEach(i => { if(c[i.type] !== undefined) c[i.type]++; });
    return c;
  }

  /* ── KPI ── */
  function kpis(){
    const c = countByType();
    const wil = new Set(S.items.map(i => i.code_wilaya)).size;
    const an  = S.items.reduce((a,i) => a + (i.annee||0), 0) / (S.items.length||1);
    return {
      total: S.items.length, devoirs:c.devoir, compositions:c.composition,
      bac:c.bac, annales:c.annales, wilayas: wil,
      annees: S.items.length ? (Math.min.apply(null,S.items.map(i=>i.annee)) + '→' +
                                 Math.max.apply(null,S.items.map(i=>i.annee))) : '—',
      corriges: S.items.filter(i => i.corrige_inclus).length,
      unites: new Set(S.items.map(i => i.unite_de)).size,
      moyenne: S.items.length ? (S.items.reduce((a,i)=>a+(i.note_moyenne||0),0)/S.items.length).toFixed(1) : '—'
    };
  }

  function get(id){ return S.items.filter(i => i.id === id)[0] || null; }

  function setFiltre(k, v){ S.filtres[k] = v; search(); }
  function reset(){
    S.q = ''; S.tri = 'recent'; S.page = 1;
    Object.keys(S.filtres).forEach(k => S.filtres[k] = 'tous');
    search();
  }
  function setQuery(q){ S.q = q; search(); }
  function setTri(t){ S.tri = t; search(); }
  function setPerPage(n){ S.perPage = n; S.page = 1; }

  /* Statistiques de consultation (locales) */
  function logVue(id){
    try{
      const v = JSON.parse(localStorage.getItem('dz_de_vues_bdd') || '{}');
      v[id] = (v[id]||0) + 1;
      localStorage.setItem('dz_de_vues_bdd', JSON.stringify(v));
    }catch(e){}
  }
  function vuesLocales(){
    try{ return JSON.parse(localStorage.getItem('dz_de_vues_bdd') || '{}'); }catch(e){ return {}; }
  }

  return {
    SOURCES:SOURCES, state:S, load:load, search:search, page:page, pages:pages,
    setPage:setPage, kpis:kpis, countByType:countByType, facet:facet, get:get,
    setFiltre:setFiltre, setQuery:setQuery, setTri:setTri, setPerPage:setPerPage,
    reset:reset, logVue:logVue, vuesLocales:vuesLocales, normalise:normalise
  };
})();
