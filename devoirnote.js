/* devoirnote.js — 📝 Devoirs notés : questions EN ALLEMAND, barème officiel I/8 II/8 III/4
   · onglet A : devoirs générés & corrigés auto (16 unités × 3 variantes = 48)
   · onglet B : les 312 devoirs RÉELS envoyés (filtres + mode composition + corrigé)   */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let MAL = null, BAN = null, DV = null;
  async function cj(u){ try{ const r = await fetch(u, { cache:'no-store' });
      return r.ok ? await r.json() : null; }catch(e){ return null; } }
  async function data(){
    if(MAL === null) MAL = await cj('assets/bdd/malakhiss.json');
    if(BAN === null) BAN = await cj('assets/bdd/contenu_original.json');
    if(DV === null) DV = await cj('assets/bdd/devoirs.json');
    return { mal: MAL || {}, ban: BAN || {}, dv: (DV && DV.items) || [] };
  }
  /* faits grammaticaux vérifiés (pour Vrai/Faux en allemand) */
  const KONJ = {
    sein: ['bin','bist','ist','sind','seid','sind'],
    haben: ['habe','hast','hat','haben','habt','haben']
  };
  const PERS = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const WFR = ['wie','wo','woher','wie alt','was','wer','wann','warum'];

  function rng(seed){ let s = seed; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; }

  function genere(u, variante, d){
    const un = ((d.mal.malakhiss || []).filter(m => m.unite === u)[0]) || {};
    const r = rng(u * 97 + variante * 13 + 5);
    const structures = un.structures || [];
    const vocab = un.vocabulaire || [];
    const Q = [];
    /* ── I. Leseverstehen : 4 Vrai/Faux (1 pt) + 2 phrases (2 pts) ── */
    const vf = [];
    const v = Math.floor(r() * 6), verbe = r() < 0.5 ? 'sein' : 'haben';
    vf.push({ q: 'Richtig oder falsch?  « ' + PERS[v] + ' » + ' + verbe + ' → « '
        + KONJ[verbe][v] + ' ».', a: true });
    const v2 = Math.floor(r() * 6);
    vf.push({ q: 'Richtig oder falsch?  « ' + PERS[v2] + ' » + ' + verbe + ' → « '
        + KONJ[verbe][(v2 + 1) % 6] + ' ».', a: false });
    const w = WFR[Math.floor(r() * WFR.length)];
    vf.push({ q: 'Richtig oder falsch?  « ' + w + ' » ist ein W-Fragewort.', a: true });
    vf.push({ q: 'Richtig oder falsch?  Im Aussagesatz steht das Verb an letzter Stelle.', a: false });
    vf.forEach((x, i) => Q.push({ type: 'vf', partie: 'I', pts: 1, q: x.q, a: x.a }));
    const ph = structures.slice(variante, variante + 2);
    ph.forEach(s => Q.push({ type: 'phrase', partie: 'I', pts: 2,
      q: 'Beantworte in einem vollständigen Satz:  Was passt zu « ' + esc(un.titre_de || ('Unité ' + u))
        + ' » ?  (Inspiration : ' + esc(s) + ')', a: s }));
    /* ── II. Sprachbausteine : 4 MCQ (2 pts) en allemand ── */
    const comps = [];
    const g = (un.grammaire || []).join(' ').toLowerCase();
    if(/w-fragen|frage/.test(g)) comps.push('w-fragen');
    if(/akkusativ/.test(g)) comps.push('akkusativ');
    if(/dativ/.test(g)) comps.push('dativ');
    if(/perfekt/.test(g)) comps.push('perfekt');
    if(/sein|haben|präsens|konjug/.test(g)) comps.push('conjugaison');
    if(!comps.length) comps.push('vocabulaire');
    const niv = u <= 6 ? '2AS' : '3AS';
    const pool = ((d.ban.B_exercices || []).filter(x =>
        comps.indexOf(x.comp) !== -1 && x.niveau === niv));
    const pick = [];
    while(pick.length < 4 && pool.length){
      const c = pool[Math.floor(r() * pool.length)];
      if(pick.indexOf(c) === -1) pick.push(c);
    }
    pick.forEach(x => Q.push({ type: 'mcq', partie: 'II', pts: 2, q: x.q,
        opts: x.opts, a: x.a, why: x.why }));
    /* ── III. Textproduktion (4 pts, auto-évaluation) ── */
    Q.push({ type: 'prod', partie: 'III', pts: 4,
      q: 'Schreibe mindestens 5 Sätze zum Thema « ' + esc(un.titre_de || ('Unité ' + u))
        + ' ».  Benutze: 1 W-Frage, 1 × weil, 1 × ' + esc(vocab[0] || 'ein Verb') + '.',
      checklist: ['5 Sätze oder mehr', 'Verb an 2. Position', '1 × weil', '1 W-Frage',
                  'Nomen großgeschrieben'] });
    return { un: un, Q: Q };
  }

  function corrige(Q, host, meta){
    let note = 0, total = 0;
    Q.forEach((x, i) => {
      total += x.pts;
      let ok = null;
      if(x.type === 'vf'){
        const sel = host.querySelector('input[name="vf' + i + '"]:checked');
        ok = sel && ((sel.value === 'true') === x.a);
      }else if(x.type === 'mcq'){
        const sel = host.querySelector('input[name="mcq' + i + '"]:checked');
        ok = sel && (+sel.value === x.a);
      }else if(x.type === 'prod'){
        const n = +((host.querySelector('#prod' + i) || {}).value || 0);
        note += Math.min(x.pts, Math.max(0, n));
        return;
      }else{ /* phrase : auto-évaluation */
        const n = +((host.querySelector('#ph' + i) || {}).value || 0);
        note += Math.min(x.pts, Math.max(0, n));
        return;
      }
      if(ok) note += x.pts;
      else if(window.MEMOIRE){
        try{ window.MEMOIRE.record({ q: x.q, bad: 'à revoir', good: x.why || x.a || '',
          comp: meta.unite + '', unite: meta.unite, src: 'devoir-note' }); }catch(e){}
      }
    });
    return { note: note, total: total };
  }

  async function render(){
    const box = $('#devoirsBody'); if(!box) return;
    const d = await data();
    box.innerHTML =
        '<div class="dn-hero"><span class="dn-crest">📝</span><div>'
      + '<h2>Devoirs notés — auf Deutsch</h2><p class="dn-sub">48 devoirs générés corrigés '
      + 'automatiquement + ' + d.dv.length + ' devoirs réels de wilayas · barème officiel '
      + 'I/8 · II/8 · III/4</p></div></div>'
      + '<div class="dn-tabs"><button class="btn btn-p btn-sm" id="dnA">📝 générés</button> '
      + '<button class="btn btn-o btn-sm" id="dnB">📄 réels (' + d.dv.length + ')</button></div>'
      + '<div id="dnZone"></div>';
    $('#dnA').addEventListener('click', () => zoneA(d));
    $('#dnB').addEventListener('click', () => zoneB(d));
    zoneA(d);
  }

  function zoneA(d){
    const z = $('#dnZone');
    let h = '<div class="card"><b>choisis unité + variante :</b><div class="dn-pick">';
    for(let u = 1; u <= 16; u++){
      h += '<span class="dn-g">U' + u + ' ' + [1,2,3].map(v =>
        '<button class="dn-v" data-u="' + u + '" data-v="' + v + '">' + v + '</button>').join('')
        + '</span>';
    }
    h += '</div><div id="dnSujet"></div></div>';
    z.innerHTML = h;
    z.querySelectorAll('.dn-v').forEach(b => b.addEventListener('click', () => {
      const u = +b.dataset.u, v = +b.dataset.v;
      const g = genere(u, v, d);
      const s = $('#dnSujet');
      s.innerHTML = '<div class="dn-suj"><div class="dn-head"><b>Kontrollarbeit — '
        + esc(g.un.titre_de || ('Unité ' + u)) + '</b><span>Variant ' + v + ' · /20 · 45 Min</span></div>'
        + '<div class="dn-p"><b>I. Leseverstehen (8 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'I').map((x, i) => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><div class="dn-p"><b>II. Sprachbausteine (8 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'II').map(x => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><div class="dn-p"><b>III. Textproduktion (4 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'III').map(x => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><button class="btn btn-p btn-block" id="dnCorr">✅ corriger ma copie</button>'
        + '<div id="dnNote"></div></div>';
      $('#dnCorr').addEventListener('click', () => {
        const res = corrige(g.Q, s, { unite: u });
        $('#dnNote').innerHTML = '<div class="dn-res">Note : <b>' + res.note.toFixed(1)
          + ' / 20</b>  ·  mention ' + mention(res.note)
          + '<br><span>chaque erreur est devenue une carte 🧠 mémoire</span></div>';
      });
    }));
  }
  function mention(n){
    return n >= 16 ? 'Très bien 👏' : n >= 14 ? 'Bien 👍' : n >= 10 ? 'Passable ✔'
         : n >= 8 ? 'Insuffisant — revois les cartes 🧠' : 'À reprendre avec l’unité 📗';
  }
  function qHtml(x, i){
    if(x.type === 'vf') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q)
      + '</span><label><input type="radio" name="vf' + i + '" value="true"> richtig</label>'
      + '<label><input type="radio" name="vf' + i + '" value="false"> falsch</label></div>';
    if(x.type === 'mcq') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q) + '</span>'
      + (x.opts || []).map((o, k) => '<label><input type="radio" name="mcq' + i + '" value="' + k
          + '"> ' + esc(o) + '</label>').join('') + '</div>';
    if(x.type === 'phrase') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q)
      + '</span><textarea rows="2" placeholder="deine Antwort (ganzer Satz)"></textarea>'
      + '<div class="dn-self">auto-note : <select id="ph' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option></select> / ' + x.pts + '</div></div>';
    return '<div class="dn-q"><span class="dn-qt">' + esc(x.q) + '</span>'
      + '<textarea rows="5" placeholder="Schreibe hier deine 5 Sätze…"></textarea>'
      + '<div class="dn-check">' + x.checklist.map(c => '<span>☐ ' + c + '</span>').join('')
      + '</div><div class="dn-self">auto-note : <select id="prod' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option><option value="3">3</option>'
      + '<option value="4">4</option></select> / ' + x.pts + '</div></div>';
  }

  function zoneB(d){
    const z = $('#dnZone');
    const nivs = [...new Set(d.dv.map(x => x.niveau))];
    z.innerHTML = '<div class="card"><div class="dn-filt">'
      + '<select id="fNiv"><option value="">tous niveaux</option>'
      + nivs.map(n => '<option>' + esc(n) + '</option>').join('') + '</select>'
      + '<select id="fTri"><option value="1">trimestre 1</option><option value="2">T2</option>'
      + '<option value="3">T3</option><option value="">tous</option></select>'
      + '<input id="fQ" placeholder="rechercher (wilaya, titre, unité…)">'
      + '</div><div id="fList"></div></div>';
    const maj = () => {
      const q = ($('#fQ').value || '').toLowerCase();
      const rows = d.dv.filter(x =>
        (!$('#fNiv').value || x.niveau === $('#fNiv').value)
        && (!$('#fTri').value || String(x.trimestre) === $('#fTri').value)
        && (!q || (x.titre + x.wilaya + x.unite_de + x.lycee).toLowerCase().indexOf(q) !== -1))
        .slice(0, 40);
      $('#fList').innerHTML = '<p class="dn-sub">' + rows.length + ' affichés / ' + d.dv.length
        + '</p>' + rows.map((x, i) => '<div class="dn-r"><b>' + esc(x.titre_de || x.titre)
        + '</b><span>' + esc(x.niveau) + ' · ' + esc(x.wilaya) + ' · ' + (x.annee_scolaire || '')
        + ' · /' + x.bareme + ' · ' + x.duree_minutes + ' min</span>'
        + '<button class="btn btn-o btn-sm" data-i="' + i + '">voir sujet + corrigé</button>'
        + '<div class="dn-zone" id="dz' + i + '"></div></div>').join('');
      $('#fList').querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
        const x = rows[+b.dataset.i];
        $('#dz' + b.dataset.i).innerHTML = '<div class="dn-suj"><b>Sujet</b>'
          + '<pre class="dn-pre">' + esc(x.sujet || '') + '</pre>'
          + '<b>Corrigé</b><pre class="dn-pre">' + esc(x.corrige || '(corrigé inclus : '
          + (x.corrige_inclus ? 'oui' : 'non') + ')') + '</pre></div>';
      }));
    };
    $('#fNiv').addEventListener('change', maj);
    $('#fTri').addEventListener('change', maj);
    $('#fQ').addEventListener('input', maj);
    maj();
  }

  window.renderDevoirs = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'devoirs') render(); });
})();
