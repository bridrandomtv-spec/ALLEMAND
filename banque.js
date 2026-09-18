/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — banque.js
   ✍️ Banque de contenu ORIGINAL : exercices par compétence · fiches de
   révision · sujets d'entraînement type BAC. 100% production propre.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let D = null, ong = 'exos', fil = { comp:'', niveau:'' };

  async function charge(){
    if(!D){
      try{
        const r = await fetch('assets/bdd/contenu_original.json', { cache:'force-cache' });
        D = r.ok ? await r.json() : { B_exercices: [], C_fiches: [], D_sujets: [] };
      }catch(e){ D = { B_exercices: [], C_fiches: [], D_sujets: [] }; }
    }
    return D;
  }

  function render(){
    const box = $('#banqueBody'); if(!box) return;
    charge().then(() => {
      const comps = Array.from(new Set((D.B_exercices || []).map(x => x.comp))).sort();
      const nivs = Array.from(new Set((D.B_exercices || []).map(x => x.niveau))).sort();
      let h = '<div class="bq-hero"><span class="bq-crest">✍️</span><div>'
        + '<h2>Banque de contenu original</h2>'
        + '<p class="bq-sub">' + (D.B_exercices || []).length + ' exercices · '
        + (D.C_fiches || []).length + ' fiches · ' + (D.D_sujets || []).length
        + ' sujets — production propre, aucun manuel</p></div>'
        + '<div class="bq-tabs">'
        + tab('exos', '✏️ Exercices') + tab('fiches', '📄 Fiches') + tab('sujets', '📝 Sujets BAC')
        + '</div>';
      if(ong === 'exos'){
        h += '<div class="bq-filtres">'
          + sel('bqComp', comps, fil.comp, 'compétence')
          + sel('bqNiv', nivs, fil.niveau, 'niveau') + '</div>'
          + '<div id="bqListe">' + listeExos() + '</div>';
      }else if(ong === 'fiches'){
        h += '<div id="bqListe">' + listeFiches() + '</div>';
      }else{
        h += '<div id="bqListe">' + listeSujets() + '</div>';
      }
      box.innerHTML = h;
      $$('.bq-tab', box).forEach(b => b.addEventListener('click', () => {
        ong = b.dataset.ong; render();
      }));
      const c = $('#bqComp'); if(c) c.addEventListener('change', () => { fil.comp = c.value; majListe(); });
      const n = $('#bqNiv'); if(n) n.addEventListener('change', () => { fil.niveau = n.value; majListe(); });
      bindExos(box);
      bindSujets(box);
    });
  }
  function tab(id, lbl){
    return '<button class="bq-tab' + (ong === id ? ' on' : '') + '" data-ong="' + id + '">'
      + lbl + '</button>';
  }
  function sel(id, opts, val, lbl){
    return '<select id="' + id + '"><option value="">' + lbl + ' : toutes</option>'
      + opts.map(o => '<option value="' + esc(o) + '"' + (o === val ? ' selected' : '') + '>'
        + esc(o) + '</option>').join('') + '</select>';
  }
  function majListe(){
    const box = $('#banqueBody'); const l = $('#bqListe', box);
    if(l) l.innerHTML = listeExos();
    bindExos(box);
  }
  function listeExos(){
    const list = (D.B_exercices || []).filter(x =>
      (!fil.comp || x.comp === fil.comp) && (!fil.niveau || x.niveau === x.niveau && (!fil.niveau || x.niveau === fil.niveau)));
    return list.map((x, i) =>
        '<div class="bq-c" data-i="' + i + '">'
      + '<div class="bq-top"><span class="bq-comp">' + esc(x.comp) + '</span>'
      + '<span class="bq-niv">' + esc(x.niveau) + '</span></div>'
      + '<b class="bq-q">' + esc(x.q) + '</b>'
      + '<div class="bq-opts">' + x.opts.map((o, k) =>
          '<button class="bq-o" data-k="' + k + '">' + esc(o) + '</button>').join('') + '</div>'
      + '<div class="bq-fb" hidden></div></div>').join('');
  }
  function bindExos(box){
    $$('.bq-c', box).forEach(card => {
      const i = +card.dataset.i;
      const list = (D.B_exercices || []).filter(x =>
        (!fil.comp || x.comp === fil.comp) && (!fil.niveau || x.niveau === fil.niveau));
      const x = list[i]; if(!x) return;
      $$('.bq-o', card).forEach(b => b.addEventListener('click', () => {
        const k = +b.dataset.k;
        const fb = $('.bq-fb', card);
        $$('.bq-o', card).forEach((bb, kk) => {
          bb.disabled = true;
          bb.classList.remove('ok', 'ko');
          if(kk === x.a) bb.classList.add('ok');
          else if(kk === k) bb.classList.add('ko');
        });
        fb.hidden = false;
        fb.className = 'bq-fb ' + (k === x.a ? 'ok' : 'ko');
        fb.innerHTML = (k === x.a ? '✅ صحيح! ' : '❌ خطأ. ') + '💡 ' + esc(x.why);
        if(window.MEMOIRE && k !== x.a){
          try{ window.MEMOIRE.record({ q: x.q, bad: x.opts[k], good: x.opts[x.a],
                                       comp: x.comp, unite: null, src: 'banque' }); }catch(e){}
        }
      }));
    });
  }
  function listeFiches(){
    return (D.C_fiches || []).map(f =>
        '<div class="bq-f"><b class="bq-q">' + esc(f.comp) + '</b>'
      + '<div class="bq-reg">📘 ' + esc(f.regle) + '</div>'
      + '<div class="bq-ex">✍️ ' + esc(f.exemple) + '</div>'
      + '<div class="bq-pi">⚠️ ' + esc(f.piege) + '</div></div>').join('');
  }
  function listeSujets(){
    return (D.D_sujets || []).map((s, i) =>
        '<div class="bq-s" data-s="' + i + '">'
      + '<div class="bq-top"><span class="bq-comp">' + esc(s.niveau) + '</span>'
      + '<span class="bq-niv">' + s.duree + ' min · barème ' + s.bareme.I + '/' + s.bareme.II
      + '/' + s.bareme.III + '</span></div>'
      + '<b class="bq-q">' + esc(s.titre) + '</b>'
      + '<div class="bq-txt">' + esc(s.comprehension.texte) + '</div>'
      + '<div class="bq-qs">' + s.comprehension.questions.map((q, k) =>
          '<div class="bq-qq"><span>' + (k + 1) + '. ' + esc(q.q) + '</span>'
          + '<button class="bq-rev" data-q="' + k + '">👁️</button>'
          + '<div class="bq-rep" hidden>✓ ' + esc(q.rep) + '</div></div>').join('') + '</div>'
      + '<div class="bq-lang"><b>📘 Langue</b>' + s.langue.map((q, k) =>
          '<div class="bq-qq"><span>' + (k + 1) + '. ' + esc(q.q) + '</span>'
          + '<button class="bq-rev2" data-q="' + k + '">👁️</button>'
          + '<div class="bq-rep2" hidden>✓ ' + esc(q.rep) + '</div></div>').join('') + '</div>'
      + '<div class="bq-exp"><b>✍️ Expression</b><p>' + esc(s.expression) + '</p></div>'
      + '</div>').join('');
  }
  function bindSujets(box){
    $$('.bq-s', box).forEach(card => {
      const i = +card.dataset.s;
      const s = (D.D_sujets || [])[i]; if(!s) return;
      $$('.bq-rev', card).forEach(b => b.addEventListener('click', () => {
        const r = card.querySelectorAll('.bq-rep')[+b.dataset.q];
        if(r) r.hidden = !r.hidden;
      }));
      $$('.bq-rev2', card).forEach(b => b.addEventListener('click', () => {
        const r = card.querySelectorAll('.bq-rep2')[+b.dataset.q];
        if(r) r.hidden = !r.hidden;
      }));
    });
  }

  window.renderBanque = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'banque') render(); });
})();
