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
    ['corpus', 'assets/bdd/corpus_index.json'],
    ['darja', 'assets/bdd/darja.json'],
    ['sharh', 'assets/bdd/sharh.json'],
    ['mm', 'assets/bdd/biblio_multimatieres.json'],
    ['trad', 'assets/bdd/traductions_livre.json']
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
    /* SHARH-1 : explications approfondies par unité, indexées pour le cerveau local ET cloud */
    const SH = data.sharh;
    if(SH && SH.unites){
      Object.keys(SH.unites).forEach(function(k){
        const un = SH.unites[k];
        (un.sections || []).forEach(function(s, i){
          E.push({ src:'sharh', id:'u' + k + 's' + i, titre:'الوحدة ' + k + ' — ' + String(s.t || ''),
            texte:String(s.x || '').slice(0, 1600), tags:['sharh', 'unite' + k, 'explication'] });
        });
      });
    }
    /* DARJA-1 : base derja originale — explications et lexique en darija algérienne */
    const DJ = data.darja;
    if(DJ && Array.isArray(DJ.entrees)){
      DJ.entrees.forEach(function(x){
        if(!x || typeof x !== 'object') return;
        E.push({ src:'darja', id:String(x.cle || ''),
          titre:String((x.de || '') + ' — ' + (x.type || 'darja')),
          texte:String((x.darja || '') + ' ' + (x.ar || '') + ' ' + (x.de || '')).slice(0, 1400),
          tags:['darja', 'unite' + (x.unite || 0), String(x.type || '')] });
      });
    }
    /* BIBLIO-1 : bibliothèque multimatieres du propriétaire (1213 entrées déposées) —
       indexation assainie : clés normalisées (espaces finals du fichier), conjugaisons
       regroupées par verbe, exemples template corrigés (Die Freunde au pluriel, adverbes
       doublonnés, comparatifs naturels), français EXCLU du texte indexé (règle FUS). */
    const MM0 = data.mm;
    if(MM0){
      const MM = {}; Object.keys(MM0).forEach(function(k){ MM[String(k).trim()] = MM0[k]; });
      const ENT = Array.isArray(MM.entrees) ? MM.entrees : [];
      const VERB_FIX = { ist:'sind', wird:'werden', braucht:'brauchen', spielt:'spielen', muss:'müssen',
        kann:'können', hat:'haben', verändert:'verändern', sollte:'sollten', hilft:'helfen' };
      const EX_FIX = {
        'Dieses Buch ist mehr als das andere.': 'Ich habe mehr Zeit als du.',
        'Dieses Buch ist lieber als das andere.': 'Ich lese lieber, als ich schreibe.',
        'Dieses Buch ist höher als das andere.': 'Dieses Haus ist höher als das andere.',
        'Dieses Buch ist näher als das andere.': 'Die Schule ist näher als der Markt.' };
      const fixFriends = function(s){ return String(s).replace(/Die Freunde (ist|wird|braucht|spielt|muss|kann|hat|verändert|sollte|hilft)/g, function(s2, v){ return 'Die Freunde ' + VERB_FIX[v]; }); };
      const conj = {};
      ENT.forEach(function(x0){
        if(!x0 || typeof x0 !== 'object') return;
        const x = {}; Object.keys(x0).forEach(function(k){ x[String(k).trim()] = x0[k]; });
        const cat = String(x.categorie || '').trim();
        let de = String(x.allemand || '').trim();
        const ar = String(x.arabe || '').trim();
        const regle = String(x.regle_grammaticale || '').trim();
        let ex = String(x.exemple_allemand || '').trim();
        if(!de) return;
        if(cat === 'conjugaison'){
          const m = de.match(/^(\w+)\s*\|\s*(.+)$/);
          if(m){ (conj[m[1]] = conj[m[1]] || []).push(m[2].trim()); }
          return;
        }
        de = fixFriends(de); ex = fixFriends(ex);
        ex = ex.replace(/\b(hier|dort|oben|unten|links|rechts|überall|nirgendwo) hier\./g, '$1.');
        if(EX_FIX[ex]) ex = EX_FIX[ex];
        E.push({ src:'mm', id:String(x.id || '').trim(), titre:de,
          texte:(de + ' ' + ar + ' ' + regle + ' ' + ex).slice(0, 1200),
          tags:['mm', cat, String(x.niveau || '').trim()] });
      });
      Object.keys(conj).forEach(function(v){
        E.push({ src:'mm', id:'conj-' + v, titre:v, texte:v + ' : ' + conj[v].join(', '),
          tags:['mm', 'conjugaison'] });
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
        try{ const hd = (window.CONTENT1 && CONTENT1.authHeaders) ? await CONTENT1.authHeaders() : {}; const r = await fetch(pr[1], { cache:'no-store', headers: hd }); if(r.ok) data[pr[0]] = await r.json(); }catch(e){}
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
    /* TRAD-2 : traductions officielles des phrases du livre, indexées + moteur traduire() */
    const TRD0 = data.trad;
    if(TRD0){
      const TRD = {}; Object.keys(TRD0).forEach(function(k){ TRD[String(k).trim()] = TRD0[k]; });
      (Array.isArray(TRD.entrees) ? TRD.entrees : []).forEach(function(x, i){
        if(!x || typeof x !== 'object' || !x.de) return;
        E.push({ src:'trad', id:'t' + i, titre:String(x.de), ar:String(x.ar || ''),
          page:(x.page === null || x.page === undefined) ? '' : String(x.page),
          livre:String(x.livre || ''), texte:String(x.de) + ' § ' + String(x.ar || ''),
          tags:['trad', 'livre'] });
      });
    }
    function normTR(s){
      return String(s || '').toLowerCase().replace(/ß/g, 'ss')
        .replace(/[^a-z0-9äöü\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function stripArt(s){ return String(s).replace(/^(der|die|das|ein|eine) /, ''); }
    function gloseTR(de, E){
      const toks = normTR(de).split(' ').filter(function(t){ return t.length > 2; });
      const out = [];
      toks.forEach(function(t){
        const hit = E.filter(function(e){ return (e.src === 'mm' || e.src === 'trad') && e.ar; })
          .find(function(e){ return stripArt(normTR(e.titre)) === stripArt(t) || normTR(e.titre) === stripArt(t); });
        if(hit) out.push(t + ' = ' + hit.ar);
      });
      return out.join(' · ');
    }
  /* TRAD-SEC-2 : traductions privées (lesson_content_trad) — lues via le client Supabase
     de la session ; le RLS de la table fait le tri (abonné actif / admin), un anonyme
     reçoit un tableau vide. Cache de 5 minutes par session. */
  let PTRAD = null, PTRAD_AT = 0;
  async function privateTrad(nd){
    try{
      if(!window.SB || !SB.sb) return null;
      const now = Date.now();
      if(!PTRAD || now - PTRAD_AT > 300000){
        const c = await SB.sb();
        const r = await c.from('lesson_content_trad').select('de,ar');
        PTRAD = (r && r.data) ? r.data : [];
        PTRAD_AT = now;
      }
      for(let i = 0; i < PTRAD.length; i++){
        if(normTR(PTRAD[i].de) === nd) return PTRAD[i];
      }
      return null;
    }catch(e){ return null; }
  }
    async function traduire(q){
      const E = await load();
      const frags = String(q).match(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\s.,!?'«»-]{2,}/g) || [];
      frags.sort(function(a, b){ return b.length - a.length; });
      const de = (frags[0] || '').trim();
      if(!de) return null;
      const nd = normTR(de);
      const cur = E.find(function(e){ return e.src === 'trad' && normTR(e.titre) === nd; });
      if(cur) return { type:'curated', de:cur.titre, ar:cur.ar, page:cur.page, livre:cur.livre };
      const page = E.find(function(e){ return e.src === 'livre' && normTR(e.texte).indexOf(nd) !== -1; });
      const gl = gloseTR(de, E);
      if(page) return { type:'page', de:de, ar:gl, page:page.id.replace('p', ''), livre:'' };
      const pv = await privateTrad(nd);
      if(pv) return { type:'prive', de:pv.de, ar:pv.ar, page:'', livre:'3AS' };
      if(gl) return { type:'gloss', de:de, ar:gl, page:'', livre:'' };
      return { type:'none', de:de, ar:'', page:'', livre:'' };
    }
  window.BIBLIO = { search: search, context: context, stats: stats, load: load, traduire: traduire };
})();
