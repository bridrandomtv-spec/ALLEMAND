/* buch.js — 📗 Livre officiel 2AS : Lektion 1 interactive (textes, vocab, tables,
   57 exercices en allemand corrigés automatiquement, note /20) */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let LS = null, CUR = 0;
  async function livre(){
    if(LS !== null) return LS;
    LS = [];
    try{
      const r1 = await fetch('assets/bdd/buch_2as.json', { cache:'no-store' });
      if(r1.ok){ const j = await r1.json();
        const l1 = (j && j.lektionen && j.lektionen[0]) ? j.lektionen[0]
                 : (j && j._meta ? Object.assign({ n:1 }, j) : null);
        if(l1 && l1._meta) LS.push(l1); }
      const r2 = await fetch('assets/bdd/buch_l2.json', { cache:'no-store' });
      if(r2.ok){ const o2 = await r2.json();
        if(o2){ if(!o2._meta) o2._meta = { titre: o2.titre || ('Lektion ' + (o2.n || 2)), niveau: '2AS' }; LS.push(o2); } }
      const r3 = await fetch('assets/bdd/buch_l3.json', { cache:'no-store' });
      if(r3.ok){ const o3 = await r3.json();
        if(o3){ if(!o3._meta) o3._meta = { titre: o3.titre || ('Lektion ' + (o3.n || 3)), niveau: '2AS' }; LS.push(o3); } }
    }catch(e){}
    return LS;
  }
  const PERS = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const GRP = { vf:'Richtig oder falsch? (1 Pkt)', gap:'Ergänze das Verb (1 Pkt)',
    mcq:'Wähle die richtige Antwort (1 Pkt)', num:'Zahlen (1 Pkt)',
    prod:'Textproduktion (4 Pkt)' };

  async function render(){
    const box = $('#buchBody'); if(!box) return;
    /* niveau actif 3AS → navigateur du manuel 3AS (8 Lektionen) ;
       tout autre niveau → parcours 2AS existant, inchangé */
    const niv0 = (window.getNiveauActif && window.getNiveauActif()) || '';
    if(niv0 === '3AS'){ return render3as(box); }
    if(B2V !== 'inter'){ return render2browser(box); }
    const L = (await livre()).filter(x => x && x._meta);
    if(!L.length){ box.innerHTML = '<div class="dn-sub">📗 Buchinhalt nicht verfügbar.</div>'; return; }
    if(CUR >= L.length) CUR = 0;
    const b = L[CUR] || L[0];
    if(b && !b._meta) b._meta = { titre: b.titre || ('Lektion ' + (b.n || '?')), niveau: '2AS' };
    const sel = '<button class="btn btn-g btn-sm" id="bk2pages" style="margin-bottom:8px">' +
      '📖 صفحات الكتاب 2AS (L1→L9)</button>' +
      '<div class="dn-tabs">' + L.map((x, i) =>
      '<button class="btn btn-' + (i === CUR ? 'p' : 'o') + ' btn-sm" data-lk="' + i + '">📗 Lektion '
      + x.n + (window.ACCESS && !ACCESS.canAccessUnit(i + 1) ? ' 🔒' : '') + '</button>').join(' ') + '</div>';
    /* Porte existante (access.js) : L1 gratuite (essai), L2/L3 = abonnés */
    if(window.ACCESS && !ACCESS.canAccessUnit(CUR + 1)){
      box.innerHTML = sel + '<div class="card"><b>🔒 Lektion ' + (CUR + 1) + ' — interactif</b>'
        + '<p class="dn-sub">هذا الدرس التفاعلي ضمن محتوى المشتركين · المجاني : Lektion 1 فقط.</p>'
        + '<button class="btn btn-p btn-sm" id="bkLock">فتح البرنامج الكامل</button></div>';
      const bl2 = $('#bkLock');
      if(bl2) bl2.addEventListener('click', function(){
        try{ ACCESS.setReturn({ view:'buch' }); ACCESS.paywall({ type:'view', view:'buch' }); }catch(e){}
      });
      const bp0 = $('#bk2pages');
      if(bp0) bp0.addEventListener('click', function(){ B2V = 'list'; B2_CUR = 0; B2_PAGE = 0; render(); });
      box.querySelectorAll('[data-lk]').forEach(bl => bl.addEventListener('click', () => { CUR = +bl.dataset.lk; render(); }));
      return;
    }
    let h = sel + '<div class="dn-hero"><span class="dn-crest">📗</span><div><h2>'
      + esc(b._meta.titre) + '</h2><p class="dn-sub">offizielles Lehrbuch ' + esc(b._meta.niveau)
      + ' · ' + b.exos.length + ' Aufgaben auf Deutsch · Texte & Dialoge aus dem Buch</p></div></div>'
      + '<div class="card"><b>🎯 Ziele</b><div class="dn-check">'
      + b.objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div>'
      + '<b style="margin-top:9px">📘 Grammatik</b><div class="dn-check">'
      + b.grammaire_objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div></div>'
      + '<div class="card"><b>📖 Texte & Dialoge aus dem Buch</b>'
      + b.textes.map((t, i) => '<div class="dn-q"><span class="dn-qt"><b>' + esc(t.titre)
          + '</b><br>' + esc(t.de) + '</span>'
          + '<button class="btn btn-o btn-sm" data-t="' + i + '">🔊 hören</button></div>').join('')
      + '</div>'
      + '<div class="card"><b>🔑 Wortschatz</b><div class="dn-check">'
      + b.vocab.map(v => '<span>' + esc(v) + '</span>').join('') + '</div>'
      + '<b style="margin-top:9px">📐 Konjugation</b>'
      + b.tables.map(t => '<div class="dn-q"><span class="dn-qt"><b>' + esc(t.verbe)
          + '</b> · ' + t.formes.map((f, i) => PERS[i] + ' ' + esc(f)).join(' · ')
          + '</span></div>').join('') + '</div>'
      + '<div class="card"><b>✍️ Übungen — ' + b.exos.length + ' Aufgaben (wie eine Klassenarbeit)</b>'
      + b.exos.map((x, i) => exoHtml(x, i)).join('')
      + '<button class="btn btn-p btn-block" id="bkCorr">✅ Meine Arbeit korrigieren</button>'
      + '<div id="bkNote"></div></div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-lk]').forEach(bl => bl.addEventListener('click', () => {
      CUR = +bl.dataset.lk; render();
    }));
    const bp = $('#bk2pages');
    if(bp) bp.addEventListener('click', () => { B2V = 'list'; B2_CUR = 0; B2_PAGE = 0; render(); });
    box.querySelectorAll('[data-t]').forEach(bt => bt.addEventListener('click', () => {
      const t = b.textes[+bt.dataset.t];
      if(window.VOIX && window.VOIX.parler) window.VOIX.parler(t.de, 'de-DE');
    }));
    $('#bkCorr').addEventListener('click', () => corriger(b, box));
  }

  function exoHtml(x, i){
    let inner = '<span class="dn-qt">' + (i + 1) + '. ' + esc(x.q) + '</span>';
    if(x.g === 'vf') inner += '<label><input type="radio" name="bk' + i + '" value="1"> richtig</label>'
      + '<label><input type="radio" name="bk' + i + '" value="0"> falsch</label>';
    else if(x.g === 'mcq') inner += x.opts.map((o, k) => '<label><input type="radio" name="bk' + i
      + '" value="' + k + '"> ' + esc(o) + '</label>').join('');
    else if(x.g === 'prod') inner += '<textarea rows="5" placeholder="Schreibe hier…"></textarea>'
      + '<div class="dn-check">' + x.checklist.map(c => '<span>☐ ' + c + '</span>').join('') + '</div>'
      + '<div class="dn-self">Selbstnote: <select id="bkp' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option><option value="3">3</option>'
      + '<option value="4">4</option></select> / 4</div>';
    else inner += '<input class="bk-in" id="bki' + i + '" placeholder="deine Antwort">';
    return '<div class="dn-q" data-i="' + i + '">' + inner + '<div class="bk-fb" id="bkf' + i
      + '" hidden></div></div>';
  }

  function corriger(b, box){
    let pts = 0, tot = 0, errs = 0;
    b.exos.forEach((x, i) => {
      const poids = x.g === 'prod' ? 4 : 1;
      tot += poids;
      const fb = $('#bkf' + i);
      let ok = null, got = '';
      if(x.g === 'vf'){
        const s = box.querySelector('input[name="bk' + i + '"]:checked');
        got = s ? (s.value === '1' ? 'richtig' : 'falsch') : '';
        ok = s && ((s.value === '1') === x.a);
      }else if(x.g === 'mcq'){
        const s = box.querySelector('input[name="bk' + i + '"]:checked');
        got = s ? x.opts[+s.value] : '';
        ok = s && (+s.value === x.a);
      }else if(x.g === 'prod'){
        const n = Math.min(4, Math.max(0, +(($('#bkp' + i) || {}).value || 0)));
        pts += n;
        if(fb){ fb.hidden = false; fb.className = 'bk-fb ' + (n >= 3 ? 'ok' : 'ko');
          fb.textContent = 'Selbstnote: ' + n + ' / 4'; }
        return;
      }else{
        got = (($('#bki' + i) || {}).value || '').trim().toLowerCase();
        ok = got === String(x.a).toLowerCase();
      }
      if(ok) pts += poids;
      else {
        errs++;
        if(window.MEMOIRE) try{ window.MEMOIRE.record({ q: x.q, bad: got || '(vide)',
          good: x.a === true ? 'richtig' : x.a === false ? 'falsch' : String(x.a),
          comp: 'livre-L' + b.n, unite: b.n, src: 'buch' }); }catch(e){}
      }
      if(fb){ fb.hidden = false; fb.className = 'bk-fb ' + (ok ? 'ok' : 'ko');
        fb.innerHTML = (ok ? '✅ ' : '❌ ') + (ok ? '' : '→ ' + esc(
          x.a === true ? 'richtig' : x.a === false ? 'falsch'
          : (x.opts ? x.opts[x.a] : x.a)) + (x.why ? ' · ' + esc(x.why) : '')); }
    });
    const note = pts / tot * 20;
    $('#bkNote').innerHTML = '<div class="dn-res">Note: <b>' + note.toFixed(1) + ' / 20</b> · '
      + (pts) + '/' + tot + ' points · ' + errs + ' Fehler'
      + '<br><span>jeder Fehler ist eine 🧠 Lernkarte geworden (Lektion 1)</span></div>';
    $('#bkNote').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── Navigateur MANUEL 3AS — source de vérité : assets/bdd/buch3as_pages.json
     (fichier NON modifié, non dupliqué). Accès pages = mécanisme EXISTANT :
     window.reponseIA (intentLecture → lesson_content → RLS serveur) +
     ACCESS.paywall + VOIX.parler. Aucune nouvelle logique de permission.
     Validation stricte : exactement 8 Lektionen, plages figées ; sinon STOP affiché. */
  const L3_PLAGES = [[1,3,29],[2,31,48],[3,49,70],[4,71,92],[5,93,110],[6,111,127],[7,129,151],[8,153,175]];
  let B3 = null, B3_ERR = '', L3_CUR = -1, L3_PAGE = 0;
  async function load3(){
    if(B3 || B3_ERR) return B3;
    try{
      const r = await fetch('assets/bdd/buch3as_pages.json', { cache:'no-store' });
      const j = r.ok ? await r.json() : null;
      const pg = (j && j.pages) || j || {};
      const groups = {};
      for(const k of Object.keys(pg)){
        if(!/^\d+$/.test(k)) continue;
        const u = pg[k].unite, p = +k;
        if(!Number.isInteger(u) || u < 10 || u > 17){ B3_ERR = 'page ' + k + ' sans unite 10-17'; return null; }
        (groups[u] = groups[u] || []).push(p);
      }
      const us = Object.keys(groups).map(Number).sort((a,b)=>a-b);
      if(us.length !== 8){ B3_ERR = 'nombre de Lektionen != 8 (' + us.length + ')'; return null; }
      for(let i=0;i<8;i++){
        const g = groups[us[i]].sort((a,b)=>a-b), att = L3_PLAGES[i];
        if(us[i] !== att[0]+9 || g[0] !== att[1] || g[g.length-1] > att[2]
           || !g.every(p => p >= att[1] && p <= att[2])){
          B3_ERR = 'Lektion ' + att[0] + ' : pages reelles ' + g[0] + '-' + g[g.length-1]
                 + ' hors plage attendue ' + att[1] + '-' + att[2];
          return null;
        }
      }
      B3 = { pg: pg, groups: groups };
      return B3;
    }catch(e){ B3_ERR = 'lecture index : ' + e; return null; }
  }
  function l3Titre(p){
    const e = (B3 && B3.pg[String(p)]) || {};
    return String(e.titre || ('Seite ' + p)).replace(/^L\d+ 3AS p\d+ — /, '');
  }
  function l3Badge(p){
    const e = (B3 && B3.pg[String(p)]) || {};
    return (e.lignes && e.lignes.length) || e.texte ? '🆓' : '🔒';
  }
  async function render3as(box){
    const B = await load3();
    if(!B){
      box.innerHTML = '<div class="dn-hero"><span class="dn-crest">📗</span><div><h2>Buch — 3AS</h2>'
        + '<p class="dn-sub">⚠️ structure du manuel 3AS non conforme au contrat : ' + esc(B3_ERR)
        + ' — navigation désactivée, contenu inchangé.</p></div></div>';
      return;
    }
    const nPages = Object.keys(B.pg).filter(k => /^\d+$/.test(k)).length;
    let h = '<div class="dn-hero"><span class="dn-crest">📗</span><div><h2>Buch — 3AS</h2>'
      + '<p class="dn-sub">manuel officiel · 8 Lektionen · ' + nPages + ' pages · 🔒 = abonnés</p></div></div>';
    if(L3_PAGE){
      const p = L3_PAGE;
      h += '<button class="btn btn-o btn-sm" id="b3back2">← Lektion ' + (L3_CUR+1) + '</button>'
        + '<div class="card" style="margin-top:10px"><b>📄 Page ' + p + '</b>'
        + '<div class="dn-sub">' + esc(l3Titre(p)) + '</div>'
        + '<div id="b3txt" style="white-space:pre-wrap;margin-top:8px;line-height:1.7" dir="ltr" lang="de">⏳ …</div>'
        + '<button class="btn btn-p btn-sm" id="b3voix" style="margin-top:8px">🔊 hören</button></div>';
      box.innerHTML = h;
      $('#b3back2').addEventListener('click', () => { L3_PAGE = 0; render3as(box); });
      $('#b3voix').addEventListener('click', () => {
        const t = ($('#b3txt') || {}).textContent || '';
        if(window.VOIX && VOIX.parler && t && t.indexOf('⏳') !== 0) VOIX.parler(t, 'de-DE');
      });
      let txt = '';
      try{ if(window.reponseIA) txt = await reponseIA('lis la page ' + p + ' (3AS)'); }catch(e){ txt = ''; }
      const el = $('#b3txt');
      if(el) el.textContent = txt || '🔒';
      return;
    }
    if(L3_CUR >= 0){
      const pages = B.groups[L3_CUR+10].sort((a,b)=>a-b);
      h += '<button class="btn btn-o btn-sm" id="b3back1">← Lektionen</button>'
        + '<h3 style="margin:10px 0 6px">📗 Lektion ' + (L3_CUR+1) + ' · pages '
        + L3_PLAGES[L3_CUR][1] + '-' + L3_PLAGES[L3_CUR][2] + ' · ' + pages.length + ' indexées</h3>'
        + '<div style="display:flex;flex-direction:column;gap:6px">'
        + pages.map(p => '<button class="btn btn-o btn-sm" data-p3="' + p
            + '" style="text-align:right;white-space:normal;height:auto;line-height:1.5">'
            + l3Badge(p) + ' 📄 Page ' + p + ' · ' + esc(l3Titre(p).slice(0,70)) + '</button>').join('')
        + '</div>';
      box.innerHTML = h;
      $('#b3back1').addEventListener('click', () => { L3_CUR = -1; render3as(box); });
      box.querySelectorAll('[data-p3]').forEach(bt => bt.addEventListener('click', () => {
        L3_PAGE = +bt.getAttribute('data-p3'); render3as(box);
      }));
      return;
    }
    h += '<div style="display:flex;flex-direction:column;gap:6px">'
      + L3_PLAGES.map((pl, i) => {
          const g = B.groups[i+10];
          return '<button class="btn btn-o btn-sm" data-l3="' + i
            + '" style="text-align:right">📗 Lektion ' + (i+1) + ' · ' + g.length
            + ' pages (' + pl[1] + '-' + pl[2] + ')</button>';
        }).join('') + '</div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-l3]').forEach(bt => bt.addEventListener('click', () => {
      L3_CUR = +bt.getAttribute('data-l3'); L3_PAGE = 0; render3as(box);
    }));
  }
  /* re-rendre le 📗 quand l'utilisateur change de niveau depuis la vue */
  document.addEventListener('click', e => {
    try{
      if(e.target && e.target.closest && e.target.closest('[data-niveau]')){
        setTimeout(() => { const bx = $('#buchBody'); if(bx && bx.offsetParent !== null) render(); }, 0);
      }
    }catch(err){}
  });
  window.renderBuch = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'buch') render(); });

  /* ── Navigateur PAGES 2AS (9 Lektionen) — source de vérité : buch_pages.json ;
     lecteur = window.reponseIA (intentLecture → lesson_content → RLS) + VOIX ;
     badges 🔒/🆓 = état locked de l'index ; aucune nouvelle permission. ── */
  const RANGES2 = [[1,5,29],[2,31,55],[3,57,76],[4,77,101],[5,103,127],[6,129,149],[7,151,180],[8,181,205],[9,207,223]];
  let B2 = null, B2V = 'inter', B2_CUR = 0, B2_PAGE = 0;
  async function load2idx(){
    if(B2) return B2;
    try{
      const r = await fetch('assets/bdd/buch_pages.json', { cache:'no-store' });
      const j = r.ok ? await r.json() : null;
      B2 = (j && (j.pages || j)) || {};
    }catch(e){ B2 = {}; }
    return B2;
  }
  function valide2(pgs){
    const ns = Object.keys(pgs).filter(k => /^\d+$/.test(k)).map(Number);
    if(!ns.length || RANGES2.length !== 9) return false;
    let couvert = 0;
    for(const rg of RANGES2){
      const c = ns.filter(p => p >= rg[1] && p <= rg[2]).length;
      if(!c) return false;
      couvert += c;
    }
    return couvert === ns.length;
  }
  function b2Titre(p){
    const e = (B2 && B2[String(p)]) || {};
    return String(e.titre || ('Seite ' + p)).replace(/\((?:page|p\.)\s*\d+\)/gi, '').trim();
  }
  function b2Badge(p){
    const e = (B2 && B2[String(p)]) || {};
    return ((e.lignes && e.lignes.length) || e.texte) ? '🆓' : '🔒';
  }
  function wire2(box){
    const bi = box.querySelector('[data-b2inter]'); if(bi) bi.addEventListener('click', () => { B2V = 'inter'; render(); });
    const bl = box.querySelector('[data-b2list]');  if(bl) bl.addEventListener('click', () => { B2_CUR = 0; B2_PAGE = 0; render(); });
    const bb = box.querySelector('[data-b2back]');  if(bb) bb.addEventListener('click', () => { B2_PAGE = 0; render(); });
    box.querySelectorAll('[data-b2lk]').forEach(bt => bt.addEventListener('click', () => { B2_CUR = +bt.getAttribute('data-b2lk'); B2_PAGE = 0; render(); }));
    box.querySelectorAll('[data-b2pg]').forEach(bt => bt.addEventListener('click', () => { B2_PAGE = +bt.getAttribute('data-b2pg'); render(); }));
  }
  async function render2browser(box){
    const pgs = await load2idx();
    if(!valide2(pgs)){
      box.innerHTML = '<div class="card"><b>📖 صفحات الكتاب 2AS</b><p class="dn-sub">Structure invalide : '
        + '9 Lektionen attendues (5-29 · 31-55 · 57-76 · 77-101 · 103-127 · 129-149 · 151-180 · 181-205 · 207-223).</p></div>';
      return;
    }
    const backInter = '<button class="btn btn-o btn-sm" data-b2inter="1">← Lektionen interactives</button>';
    if(B2_PAGE){
      box.innerHTML = backInter + ' <button class="btn btn-o btn-sm" data-b2back="1">← Lektion ' + B2_CUR + '</button>'
        + '<div class="card" style="margin-top:8px"><b>📄 Page ' + B2_PAGE + ' — ' + esc(b2Titre(B2_PAGE)) + '</b>'
        + '<p class="dn-sub" id="b2st">⏳ ouverture via le lecteur existant…</p>'
        + '<div id="b2txt" dir="ltr" lang="de" style="white-space:pre-wrap;line-height:1.75;text-align:left"></div>'
        + '<button class="btn btn-g btn-sm" id="b2voix" style="display:none;margin-top:8px">🔊 écouter</button></div>';
      wire2(box);
      let txt = '';
      try{
        const r = await window.reponseIA('lis la page ' + B2_PAGE + ' (2AS)');
        txt = (r && typeof r === 'object') ? strip3(r.html || r.texte || r.reponse || '') : String(r || '');
      }catch(err){ txt = ''; }
      const st = $('#b2st'), tv = $('#b2txt'), bv = $('#b2voix');
      if(tv) tv.textContent = txt || '(page verrouillée)';
      if(st) st.textContent = txt ? '' : '🔒 contenu abonnés — paywall ouvert automatiquement si non abonné';
      if(txt && bv && window.VOIX && VOIX.parler){ bv.style.display = ''; bv.addEventListener('click', () => VOIX.parler(txt, 'de-DE')); }
      return;
    }
    if(B2_CUR){
      const rg = RANGES2[B2_CUR - 1];
      const ns = Object.keys(pgs).map(Number).filter(p => p >= rg[1] && p <= rg[2]).sort((x, y) => x - y);
      box.innerHTML = backInter + ' <button class="btn btn-o btn-sm" data-b2list="1">← Lektionen</button>'
        + '<h3 style="margin:10px 0 6px">📗 Lektion ' + B2_CUR + ' · pages ' + rg[1] + '-' + rg[2]
        + ' · ' + ns.length + ' indexées</h3>'
        + '<div style="display:flex;flex-direction:column;gap:6px">'
        + ns.map(p => '<button class="btn btn-o btn-sm" data-b2pg="' + p
            + '" style="text-align:right;white-space:normal;height:auto;line-height:1.5">'
            + b2Badge(p) + ' 📄 Page ' + p + ' · ' + esc(b2Titre(p).slice(0, 70)) + '</button>').join('')
        + '</div>';
      wire2(box);
      return;
    }
    box.innerHTML = backInter
      + '<div class="dn-hero" style="margin-top:8px"><span class="dn-crest">📖</span><div>'
      + '<h2>Manuel 2AS — 9 Lektionen (pages)</h2>'
      + '<p class="dn-sub">livre officiel · Lektion → pages → lecteur · 🔒 = abonnés · 🆓 = essai gratuit</p></div></div>'
      + '<div style="display:flex;flex-direction:column;gap:6px">'
      + RANGES2.map((rg, i) => {
          const c = Object.keys(pgs).filter(k => { const p = +k; return p >= rg[1] && p <= rg[2]; }).length;
          return '<button class="btn btn-o btn-sm" data-b2lk="' + (i + 1) + '" style="text-align:right">📗 Lektion '
            + (i + 1) + ' · ' + c + ' pages (' + rg[1] + '-' + rg[2] + ')</button>';
        }).join('')
      + '</div>';
    wire2(box);
  }
})();
