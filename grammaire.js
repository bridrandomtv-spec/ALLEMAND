/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — grammaire.js
   مكتبة القواعد : 28 قاعدة (2AS T1/T2/T3 + 3AS BAC) · CEFR A1→B2
   Recherche plein-texte · fiches détaillées · exemples sonores
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let D = null, CH = [];
  let q = '', chap = 'tous', niveau = 'tous', cefr = 'tous';

  const norm = t => String(t||'').toLowerCase()
    .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c))
    .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
    .replace(/[\u064B-\u065F\u0670]/g,'').replace(/\s+/g,' ').trim();

  async function boot(){
    const box = $('#gramBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل مكتبة القواعد…</div>';
      try{
        const r = await fetch('assets/bdd/grammaire.json', { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
        CH = D.chapitres || [];
        (D.items || []).forEach(it => { it._n = norm(it.titre_de + ' ' + it.titre_ar + ' ' +
          it.explication + ' ' + it.astuce + ' ' + (it.mots_cles || []).join(' ')); });
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر التحميل : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
  }

  function render(){
    const box = $('#gramBody'); if(!box) return;
    const items = filtrer();
    const st = $('#bddStatus2');
    box.innerHTML =
      '<div class="bdd-status ok" id="bddStatus2">📘 <b class="de-in">' + (D.items||[]).length +
        '</b> قاعدة · 4 فصول · CEFR A1 → B2 · ' +
        '<b class="de-in">' + items.length + '</b> نتيجة</div>' +
      '<div class="filters">' +
        '<div class="filters-h"><b>🔎 البحث في القواعد</b>' +
          '<button class="btn btn-o btn-sm" id="gReset">↺ إعادة الضبط</button></div>' +
        '<div class="frow"><div class="fld2 search-bar"><span>🔍 بحث</span>' +
          '<input id="gQ" type="search" value="' + esc(q) + '" ' +
          'placeholder="Passiv · Konjunktiv · الأفعال الانفصالية · Akkusativ…">' +
          '<span class="s-ico">🔍</span></div>' +
          '<div class="fld2"><span>📚 الفصل</span><select id="gChap">' +
            '<option value="tous"' + (chap === 'tous' ? ' selected' : '') + '>كل الفصول</option>' +
            CH.map(c => '<option value="' + esc(c.id) + '"' + (chap === c.id ? ' selected' : '') + '>' +
              c.icone + ' ' + esc(c.titre) + ' (' + c.nombre + ')</option>').join('') +
          '</select></div></div>' +
        '<div class="frow">' +
          '<div class="fld2"><span>🎓 المستوى</span><select id="gNiv">' +
            opt2('tous','الكل',niveau) + opt2('2AS','السنة الثانية',niveau) + opt2('3AS','السنة الثالثة / BAC',niveau) +
          '</select></div>' +
          '<div class="fld2"><span>🌍 CEFR</span><select id="gCefr">' +
            opt2('tous','الكل',cefr) + opt2('A1','A1 — مبتدئ',cefr) + opt2('A2','A2 — أساسي',cefr) +
            opt2('B1','B1 — متوسّط',cefr) + opt2('B2','B2 — متقدّم',cefr) +
          '</select></div></div>' +
        '<div class="chips">' + CH.map(c =>
          '<span class="fchip' + (chap === c.id ? ' on' : '') + '" data-chap="' + esc(c.id) + '">' +
          c.icone + ' ' + esc(c.titre) + ' · ' + c.nombre + '</span>').join('') + '</div>' +
      '</div>' +
      '<div id="gList">' + (items.length ? items.map(carte).join('')
        : '<div class="card empty"><div class="empty-i">🔍</div><h3>لا توجد قاعدة مطابقة</h3>' +
          '<p>جرّب كلمة ألمانية (Passiv, Akkusativ) أو عربية (الماضي، النفي).</p></div>') + '</div>';
    bind();
  }

  function opt2(v, l, sel){ return '<option value="' + v + '"' + (sel === v ? ' selected' : '') + '>' + l + '</option>'; }

  function filtrer(){
    const t = norm(q);
    return (D.items || []).filter(it => {
      if(chap !== 'tous' && it.chapitre !== chap) return false;
      if(niveau !== 'tous' && it.niveau !== niveau) return false;
      if(cefr !== 'tous' && it.cefr !== cefr) return false;
      if(t && it._n.indexOf(t) === -1) return false;
      return true;
    });
  }

  function carte(it){
    return '<article class="fiche gram-fiche" data-regle="' + esc(it.id) + '">' +
      '<div class="fiche-h"><div><div class="fiche-t de-display" style="font-size:19px">' +
        esc(it.titre_de) + '</div><div class="fiche-de" style="color:var(--m)">' +
        esc(it.titre_ar) + '</div></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<span class="badge ' + badgeClass(it.chapitre) + '">' + it.cefr + '</span>' +
        '<span class="chip">' + it.icone + ' ' + esc(it.trimestre) + '</span></div></div>' +
      '<div class="g-exp">' + esc(it.explication) + '</div>' +
      '<div class="fiche-meta"><span class="mchip">📘 <b>' + esc(it.chapitre_titre) + '</b></span>' +
        '<span class="mchip">🔢 <b>' + it.num_global + '/' + (D.items||[]).length + '</b></span>' +
        '<span class="mchip">💡 <b>' + (it.exemples||[]).length + ' مثال</b></span></div>' +
      '<div class="fiche-foot"><div class="fiche-src">' + esc(it.chapitre_sous_titre) + '</div>' +
        '<button class="btn btn-o btn-sm">📖 القاعدة كاملة</button></div></article>';
  }
  function badgeClass(ch){
    if(ch.indexOf('T1') !== -1) return 'devoir';
    if(ch.indexOf('T2') !== -1) return 'composition';
    if(ch.indexOf('T3') !== -1) return 'annales';
    return 'bac';
  }

  function bind(){
    let t = null;
    const qi = $('#gQ');
    if(qi) qi.addEventListener('input', () => {
      clearTimeout(t); t = setTimeout(() => { q = qi.value; render(); }, 220);
    });
    ['gChap','gNiv','gCefr'].forEach(id => {
      const e = $('#' + id);
      if(e) e.addEventListener('change', () => {
        if(id === 'gChap') chap = e.value;
        if(id === 'gNiv')  niveau = e.value;
        if(id === 'gCefr') cefr = e.value;
        render();
      });
    });
    const rs = $('#gReset');
    if(rs) rs.addEventListener('click', () => { q = ''; chap = 'tous'; niveau = 'tous'; cefr = 'tous'; render(); });
  }

  function fiche(id){
    const it = (D.items || []).filter(x => x.id === id)[0]; if(!it) return;
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div>' +
      '<span class="badge ' + badgeClass(it.chapitre) + '">' + it.icone + ' ' + esc(it.chapitre_titre) +
        ' · ' + it.cefr + '</span>' +
      '<h2 style="margin:9px 0 3px;font-family:var(--ff-de-display);font-size:24px;direction:ltr;' +
        'text-align:right">' + esc(it.titre_de) + '</h2>' +
      '<div class="fiche-t">' + esc(it.titre_ar) + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' +
        '<div class="gram"><h4>📘 الشرح</h4><div style="font-size:14px;line-height:1.95">' +
          esc(it.explication) + '</div></div>' +
        '<div style="margin:15px 0 9px"><b>🔎 أمثلة — Beispiele</b></div>' +
        '<div class="exemples">' + (it.exemples || []).map(e => {
          const parts = String(e).split('—');
          return '<div class="ex-i"><div class="ex-de">' + esc(parts[0].trim()) +
                 '<button class="speak" data-speak="' + esc(parts[0].trim()) + '">🔊</button></div>' +
                 (parts[1] ? '<div class="ex-ar">' + esc(parts.slice(1).join('—').trim()) + '</div>' : '') +
                 '</div>';
        }).join('') + '</div>' +
        '<div class="warn-box"><b>⚠️ الخطأ الشائع</b><div>' + fmt(it.erreur_courante) + '</div></div>' +
        '<div class="tip-box"><b>💡 قاعدة ذهبية</b><div>' + fmt(it.astuce) + '</div></div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:15px">' +
          '<button class="btn btn-o btn-sm" id="gPrint">🖨️ طباعة</button>' +
          '<button class="btn btn-p btn-sm" data-go="seances">📚 تدرّب في الحصص</button>' +
          '<button class="btn btn-g btn-sm" data-go="biblio">🗂️ فروض حول هذه القاعدة</button>' +
          '<button class="btn btn-o btn-sm" id="gPrev"' + (it.num_global <= 1 ? ' disabled' : '') + '>› السابقة</button>' +
          '<button class="btn btn-o btn-sm" id="gNext"' +
            (it.num_global >= (D.items||[]).length ? ' disabled' : '') + '>‹ التالية</button>' +
        '</div>' +
        '<div class="fiche-src" style="margin-top:13px;text-align:center">🔖 ' + esc(it.id) +
          ' · ' + esc(it.chapitre) + ' · règle ' + it.ordre + '/' + it.chapitre_nombre() + '</div>' +
      '</div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    const pr = $('#gPrint'); if(pr) pr.addEventListener('click', () => window.print());
    const pv = $('#gPrev'); if(pv && !pv.disabled) pv.addEventListener('click', () => nav(it.num_global - 1));
    const nx = $('#gNext'); if(nx && !nx.disabled) nx.addEventListener('click', () => nav(it.num_global + 1));
  }

  function nav(n){
    const it = (D.items || []).filter(x => x.num_global === n)[0];
    if(it) fiche(it.id);
  }

  /* mise en forme légère : **gras** + ~~barré~~ */
  function fmt(s){
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                 .replace(/~~(.+?)~~/g, '<s style="color:var(--r)">$1</s>');
  }

  document.addEventListener('click', ev => {
    const ch = ev.target.closest('[data-chap]');
    if(ch){ chap = (chap === ch.dataset.chap) ? 'tous' : ch.dataset.chap; render(); return; }
    const g = ev.target.closest('[data-regle]');
    if(g){ fiche(g.dataset.regle); return; }
  });

  /* petit correctif : nombre de règles du chapitre */
  document.addEventListener('DOMContentLoaded', () => {});
  Object.defineProperty(Object.prototype, 'chapitre_nombre', {
    value: function(){ return 0; }, enumerable: false, configurable: true, writable: true
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'grammaire') boot(); });
  window.renderGrammaire = boot;
  window.DZ_GRAM = { boot:boot, render:render, fiche:fiche };
})();
