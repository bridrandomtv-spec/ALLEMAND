/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — biblio.js
   📚 AGENT BIBLIOTHÈQUE : l'intelligence de la plateforme s'appuie sur sa
   base pédagogique officielle — livre page par page, devoirs corrigés,
   grammaire, corpus de vocabulaire. Recherche unifiée + contexte vérifié
   fourni au cerveau (local ET cloud). Aucune connaissance hors bibliothèque.
   ══════════════════════════════════════════════════════════════ */
'use strict';
(function(){
  const SRC = [
    ['livre', 'assets/bdd/buch_pages.json'],
    ['devoirs', 'assets/bdd/devoirs.json'],
    ['grammaire', 'assets/bdd/grammaire.json'],
    ['corpus', 'assets/bdd/corpus_index.json']
  ];
  let ENTRIES = null, LOADING = null;
  const STOP = new Set(['der','die','das','und','ist','ein','eine','ich','du','le','la','les','de','du','des','un','une','et','en','dans','pour','sur','avec','que','qui','what','the','a','an','is','are','von','mit','auf','من','في','على','عن','ما','هل','كيف','شنو','واش','pourquoi','dans']);
  function toks(s){
    return String(s || '').toLowerCase().replace(/[\u064B-\u0652]/g, '')
      .split(/[^a-z\u00e4\u00f6\u00fc\u00df\u0600-\u06FF0-9]+/i)
      .filter(t => t.length > 2 && !STOP.has(t));
  }
  function build(data){
    const E = [];
    const L = data.livre || {};
    Object.keys(L).forEach(k => {
      if(k === '_meta' || !L[k] || !L[k].titre) return;
      E.push({ src:'livre', id:'p'+k, titre:L[k].titre,
        texte:(L[k].titre + ' ' + (L[k].lignes || []).join(' ')).slice(0, 1800),
        tags:['page', k, 'lektion'] });
    });
    const D = (data.devoirs && data.devoirs.items) || [];
    D.forEach(x => {
      E.push({ src:'devoir', id:String(x.id || ''), titre:String(x.titre || x.titre_de || ''),
        texte:String((x.titre || '') + ' ' + (x.titre_de || '') + ' ' + (x.sujet || '') + ' ' + (x.corrige || '') + ' ' + (x.unite_ar || '')).slice(0, 1800),
        tags:['unite' + (x.unite || 0), String(x.type || 'devoir'), String(x.trimestre || '')] });
    });
    const G = data.grammaire;
    if(Array.isArray(G)){
      G.forEach((g, i) => E.push({ src:'grammaire', id:'g' + i,
        titre:String(g.titre || g.nom || ('règle ' + (i + 1))),
        texte:String((g.titre || g.nom || '') + ' ' + (g.texte || g.contenu || g.regle || JSON.stringify(g).slice(0, 600))).slice(0, 1200),
        tags:['grammaire'] }));
    }else if(G && typeof G === 'object'){
      Object.keys(G).forEach(k => {
        const g = G[k];
        if(g && typeof g === 'object') E.push({ src:'grammaire', id:k, titre:String(g.titre || k),
          texte:String((g.titre || k) + ' ' + JSON.stringify(g).slice(0, 900)), tags:['grammaire'] });
      });
    }
    const C = data.corpus;
    if(C){
      const arr = Array.isArray(C) ? C : (C.items || C.index || []);
      (Array.isArray(arr) ? arr : []).slice(0, 500).forEach((c, i) => {
        if(c && typeof c === 'object') E.push({ src:'corpus', id:'c' + i,
          titre:String(c.mot || c.titre || c.de || ''),
          texte:String(JSON.stringify(c).slice(0, 500)), tags:['vocabulaire'] });
      });
    }
    return E;
  }
  async function load(){
    if(ENTRIES) return ENTRIES;
    if(LOADING) return LOADING;
    LOADING = (async () => {
      const data = {};
      for(const pr of SRC){
        try{ const r = await fetch(pr[1], { cache:'force-cache' }); if(r.ok) data[pr[0]] = await r.json(); }catch(e){}
      }
      ENTRIES = build(data);
      return ENTRIES;
    })();
    return LOADING;
  }
  function score(e, qt){
    let s = 0;
    const T = String(e.titre || '').toLowerCase();
    const X = String(e.texte || '').toLowerCase();
    for(const t of qt){
      if(T.indexOf(t) !== -1) s += 5;
      else if(X.indexOf(t) !== -1) s += 2;
      if((e.tags || []).some(g => String(g).toLowerCase().indexOf(t) !== -1)) s += 3;
    }
    return s;
  }
  async function search(q, k){
    const E = await load();
    let qt = toks(q);
    const mp = q.match(/page\s*(\d+)|seite\s*(\d+)|\u0627\u0644\u0635\u0641\u062d\u0629\s*(\d+)/i);
    if(mp){
      const n = mp[1] || mp[2] || mp[3];
      const hit = E.filter(e => e.src === 'livre' && e.id === 'p' + n);
      if(hit.length) return hit;
    }
    const mu = q.match(/unit[eé]\s*(\d+)|\u0627\u0644\u0648\u062d\u062f\u0629\s*(\d+)|lektion\s*(\d+)/i);
    if(mu) qt = qt.concat(['unite' + (mu[1] || mu[2] || mu[3])]);
    return E.map(e => ({ e: e, s: score(e, qt) })).filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s).slice(0, k || 4).map(x => x.e);
  }
  async function context(q, max){
    try{
      const hits = await search(q, 4);
      if(!hits.length) return '';
      return hits.map(h => '[' + h.src.toUpperCase() + ' ' + h.id + ' — ' + String(h.titre || '').slice(0, 60) + ']\n' + String(h.texte || '').slice(0, 700)).join('\n\n').slice(0, max || 2600);
    }catch(e){ return ''; }
  }
  async function stats(){
    const E = await load();
    const c = {};
    E.forEach(e => { c[e.src] = (c[e.src] || 0) + 1; });
    return c;
  }
  window.BIBLIO = { search: search, context: context, stats: stats, load: load };
})();
