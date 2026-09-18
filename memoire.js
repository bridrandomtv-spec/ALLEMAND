/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — memoire.js
   🧠 mémoire des erreurs + révision espacée (Leitner 4 boîtes)
   ──────────────────────────────────────────────────────────────────────
   Principe pédagogique (retrieval practice + Ebbinghaus) :
     chaque erreur devient une carte de révision qui revient à J+1, J+3,
     J+7 puis J+21. Une carte sue 4 fois de suite sort de la file.
   Aucune donnée ne quitte l'appareil (localStorage).
   Branché automatiquement sur quiz.js / officiels.js via window.MEMOIRE.record().
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const K = 'dz_de_memorie_v1';
  const JOURS = { 1:1, 2:3, 3:7, 4:21 };   /* intervalles Leitner en jours */
  const JOUR_MS = 864e5;

  let M = null;

  function charge(){
    if(M) return M;
    try{ M = JSON.parse(localStorage.getItem(K)) || { cartes: [] }; }
    catch(e){ M = { cartes: [] }; }
    if(!Array.isArray(M.cartes)) M.cartes = [];
    return M;
  }
  function sauve(){ try{ localStorage.setItem(K, JSON.stringify(M)); }catch(e){} }

  function idDe(c){
    const s = String(c.q || '') + '||' + String(c.good || '');
    let h = 5381;
    for(let i=0;i<s.length;i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return 'c' + h.toString(36);
  }

  /* Enregistre une erreur. Si la carte existe déjà, elle retombe en boîte 1. */
  function record(err){
    if(!err || !err.q || !err.good) return null;
    M = charge();
    const id = idDe(err);
    let c = M.cartes.filter(x => x.id === id)[0];
    const now = Date.now();
    if(c){
      c.box = 1; c.due = now + JOURS[1] * JOUR_MS;
      c.misses = (c.misses || 0) + 1;
      c.bad = err.bad != null ? err.bad : c.bad;
      c.last = now;
    }else{
      c = { id:id, unite:err.unite || null, comp:err.comp || 'général',
            q:String(err.q), bad:(err.bad != null ? String(err.bad) : ''),
            good:String(err.good), src:err.src || 'quiz',
            box:1, due: now + JOURS[1] * JOUR_MS, created:now, last:now,
            hits:0, misses:1 };
      M.cartes.push(c);
    }
    /* plafond : 400 cartes, on retire les plus anciennes sues */
    if(M.cartes.length > 400){
      M.cartes.sort((a,b) => (b.box - a.box) || (a.last - b.last));
      M.cartes = M.cartes.slice(0, 400);
    }
    sauve();
    rafraichitBadge();
    return c;
  }

  function dues(){
    M = charge();
    const now = Date.now();
    return M.cartes.filter(c => (c.due || 0) <= now)
                   .sort((a,b) => (a.due - b.due));
  }

  /* Auto-évaluation : je savais / je savais pas */
  function grade(id, sue){
    M = charge();
    const c = M.cartes.filter(x => x.id === id)[0];
    if(!c) return null;
    const now = Date.now();
    if(sue){
      c.box = Math.min(4, (c.box || 1) + 1);
      c.hits = (c.hits || 0) + 1;
    }else{
      c.box = 1;
      c.misses = (c.misses || 0) + 1;
    }
    c.due = now + (JOURS[c.box] || 1) * JOUR_MS;
    c.last = now;
    sauve();
    rafraichitBadge();
    return c;
  }

  /* Carte d'erreurs par compétence : taux de réussite */
  function carteErreurs(){
    M = charge();
    const map = {};
    M.cartes.forEach(c => {
      const k = c.comp || 'général';
      map[k] = map[k] || { hits:0, misses:0, cartes:0 };
      map[k].hits += (c.hits || 0);
      map[k].misses += (c.misses || 0);
      map[k].cartes += 1;
    });
    return Object.keys(map).map(k => {
      const t = map[k].hits + map[k].misses;
      return { comp:k, total:t, taux: t ? Math.round(map[k].hits / t * 100) : 0,
               cartes: map[k].cartes };
    }).sort((a,b) => a.taux - b.taux);
  }

  function rafraichitBadge(){
    const b = $('#memoBadge');
    if(b) b.textContent = String(dues().length);
    const hc = $('#memoHomeCount');
    if(hc) hc.textContent = String(dues().length);
  }

  /* ── Vue 🧠 révision ── */
  let file = null;      /* file de cartes affichées */
  let idx = 0;
  let revelee = false;

  function render(){
    const box = $('#memoBody'); if(!box) return;
    M = charge();
    if(!file || idx >= file.length) file = dues();
    const map = carteErreurs();

    let h = '<div class="mm-hero"><span class="mm-crest">🧠</span><div>'
      + '<h2>mémoire des erreurs</h2>'
      + '<p class="mm-sub">chaque faute devient un rendez-vous : J+1 → J+3 → J+7 → J+21</p>'
      + '</div><div class="mm-count"><b id="memoHomeCount">' + dues().length +
      '</b><span>à revoir</span></div></div>';

    if(!file.length){
      h += '<div class="card mm-vide"><div class="mm-vi">🎉</div>'
        + '<h3>rien à revoir aujourd’hui</h3>'
        + '<p>Toutes tes cartes d’erreur sont à jour. Reviens demain : '
        + 'les cartes ratées reviendront automatiquement.</p></div>';
    }else{
      const c = file[idx];
      h += '<div class="card mm-carte">'
        + '<div class="mm-top"><span class="mm-u">U' + esc(c.unite || '?') + '</span>'
        + '<span class="mm-c">' + esc(c.comp) + '</span>'
        + '<span class="mm-b">boîte ' + (c.box || 1) + '/4</span></div>'
        + '<div class="mm-q">' + esc(c.q) + '</div>'
        + (revelee
            ? '<div class="mm-r"><div class="mm-bad">✗ ta réponse : ' + esc(c.bad || '—') + '</div>'
              + '<div class="mm-good">✓ la bonne : ' + esc(c.good) + '</div></div>'
            : '<button class="btn btn-o btn-block" id="mmReveal">👁️ voir la réponse</button>')
        + (revelee
            ? '<div class="mm-btns">'
              + '<button class="btn btn-p" id="mmKnew">✅ je savais</button>'
              + '<button class="btn btn-o" id="mmNot">🔁 je savais pas</button></div>'
            : '')
        + '<div class="mm-prog">' + (idx + 1) + ' / ' + file.length + '</div>'
        + '</div>';
    }

    if(map.length){
      h += '<div class="card mm-map"><h3>🗺️ carte d’erreurs par compétence</h3>'
        + map.slice(0, 8).map(m =>
            '<div class="mm-l"><span class="mm-ln">' + esc(m.comp) + '</span>'
            + '<span class="mm-bar"><i style="width:' + m.taux + '%"></i></span>'
            + '<span class="mm-t">' + m.taux + '%</span>'
            + '<span class="mm-n">' + m.cartes + ' carte(s)</span></div>').join('')
        + '</div>';
    }
    box.innerHTML = h;

    const rv = $('#mmReveal');
    if(rv) rv.addEventListener('click', () => { revelee = true; render(); });
    const kn = $('#mmKnew');
    if(kn) kn.addEventListener('click', () => {
      grade(file[idx].id, true); revelee = false; idx++; render();
    });
    const nt = $('#mmNot');
    if(nt) nt.addEventListener('click', () => {
      grade(file[idx].id, false); revelee = false; idx++; render();
    });
  }

  /* ── Carte « à revoir aujourd'hui » sur l'accueil ── */
  function carteAccueil(){
    const host = $('#accueilMemo'); if(!host) return;
    const n = dues().length;
    if(!n){ host.innerHTML = ''; return; }
    host.innerHTML = '<div class="card mm-home">'
      + '<div class="mm-hi">🔄</div><div class="mm-ht">'
      + '<b>à revoir aujourd’hui : ' + n + ' carte(s)</b>'
      + '<i>tes erreurs revenues pour révision espacée</i></div>'
      + '<button class="btn btn-p btn-sm" data-go="revision">réviser</button></div>';
  }

  window.MEMOIRE = { record:record, dues:dues, grade:grade,
                     carteErreurs:carteErreurs, render:render, carteAccueil:carteAccueil };
  window.renderMemoire = render;
  document.addEventListener('dz:view', e => {
    if(e.detail === 'revision'){ file = null; idx = 0; revelee = false; render(); }
    if(e.detail === 'accueil') carteAccueil();
  });
})();
