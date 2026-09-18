/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — malakhiss.js
   📑 ملخصات الوحدات (الجيل الثاني) — اجتهاد أصلي من الأستاذ
   كل ملخص : الفكرة + المفردات + القواعد + البنى النموذجية + نصيحتان
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let D = null, niv = '';

  async function charge(){
    if(!D){
      try{
        const r = await fetch('assets/bdd/malakhiss.json', { cache:'force-cache' });
        D = r.ok ? await r.json() : { malakhiss: [] };
      }catch(e){ D = { malakhiss: [] }; }
    }
    return D;
  }

  function render(){
    const box = $('#malakhissBody'); if(!box) return;
    charge().then(() => {
      const list = (D.malakhiss || []).filter(m => !niv || m.niveau === niv);
      let h = '<div class="mk-hero"><span class="mk-crest">📑</span><div>'
        + '<h2>ملخصات الوحدات</h2>'
        + '<p class="mk-sub">الجيل الثاني — اجتهاد أصلي : فكرة · مفردات · قواعد · بنى · نصائح</p>'
        + '</div><div class="mk-count"><b>' + list.length + '</b><span>ملخصًا</span></div></div>'
        + '<div class="mk-filtre"><select id="mkNiv">'
        + '<option value="">المستوى : الكل</option>'
        + '<option value="2AS"' + (niv === '2AS' ? ' selected' : '') + '>2AS</option>'
        + '<option value="3AS"' + (niv === '3AS' ? ' selected' : '') + '>3AS</option>'
        + '</select></div>'
        + '<div class="mk-list">' + list.map((m, i) =>
            '<details class="mk-c" data-i="' + i + '">'
          + '<summary><span class="mk-u">U' + m.unite + '</span>'
          + '<span class="mk-n">' + esc(m.niveau) + '</span>'
          + '<b class="mk-t">' + esc(m.titre_ar) + ' — ' + esc(m.titre_de) + '</b></summary>'
          + '<div class="mk-body">'
          + '<p class="mk-idee">💡 ' + esc(m.idee) + '</p>'
          + '<div class="mk-sec"><b>🔑 المفردات</b><div class="mk-chips">'
          + m.vocabulaire.map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('')
          + '</div></div>'
          + '<div class="mk-sec"><b>📘 القواعد</b><ul>'
          + m.grammaire.map(g => '<li class="de-in">' + esc(g) + '</li>').join('') + '</ul></div>'
          + '<div class="mk-sec"><b>🗣️ بنى نموذجية</b><ul>'
          + m.structures.map(s => '<li class="de-in">' + esc(s) + '</li>').join('') + '</ul></div>'
          + '<div class="mk-sec mk-tip"><b>⚠️ نصائح</b><ul>'
          + m.conseils.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>'
          + '</div></details>').join('') + '</div>';
      box.innerHTML = h;
      const s = $('#mkNiv');
      if(s) s.addEventListener('change', () => { niv = s.value; render(); });
    });
  }

  /* ── ملخصات نصوص الدروس (وحدة بوحدة) ── */
  let ongM = 'wahadat';
  function renderDourous(){
    const list = (D.dourous || []).filter(m => !niv || m.unite === +niv);
    const unites = Array.from(new Set((D.dourous || []).map(m => m.unite))).sort((a,b)=>a-b);
    return '<div class="mk-filtre"><select id="mkNiv2">'
      + '<option value="">الوحدة : الكل</option>'
      + unites.map(u => '<option value="' + u + '"' + (+niv === u ? ' selected' : '') + '>الوحدة '
        + u + '</option>').join('') + '</select></div>'
      + '<div class="mk-list">' + list.map(m =>
          '<details class="mk-c"><summary><span class="mk-u">د' + m.n + '</span>'
        + '<span class="mk-n">U' + m.unite + '</span>'
        + '<b class="mk-t">' + esc(m.titre_ar) + ' — ' + esc(m.titre_de) + '</b></summary>'
        + '<div class="mk-body">'
        + '<p class="mk-idee">📖 ' + esc(m.idee) + '</p>'
        + '<div class="mk-sec"><b>🔑 مفردات النص</b><div class="mk-chips">'
        + m.mots.map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('') + '</div></div>'
        + '<div class="mk-sec"><b>📘 القاعدة</b><ul><li class="de-in">' + esc(m.regle) + '</li></ul></div>'
        + '<div class="mk-sec"><b>🗣️ مثال</b><ul><li class="de-in">' + esc(m.exemple) + '</li></ul></div>'
        + '<div class="mk-sec mk-tip"><b>⚠️ انتبه</b><ul><li>' + esc(m.intibah) + '</li></ul></div>'
        + '</div></details>').join('') + '</div>';
  }
  function render2(){
    const box = $('#malakhissBody'); if(!box) return;
    charge().then(() => {
      let h = '<div class="mk-hero"><span class="mk-crest">📑</span><div>'
        + '<h2>ملخصات الوحدات ونصوص الدروس</h2>'
        + '<p class="mk-sub">الجيل الثاني — اجتهاد أصلي وحدة بوحدة ودرسًا درسًا</p></div>'
        + '<div class="mk-count"><b>' + ((D.malakhiss || []).length) + '</b><span>ملخص وحدة</span>'
        + '</div></div>'
        + '<div class="bq-tabs" style="margin-bottom:13px">'
        + '<button class="bq-tab' + (ongM === 'wahadat' ? ' on' : '') + '" data-m="wahadat">📑 ملخصات الوحدات</button>'
        + '<button class="bq-tab' + (ongM === 'dourous' ? ' on' : '') + '" data-m="dourous">📖 نصوص الدروس</button>'
        + '</div>';
      if(ongM === 'wahadat'){
        h += '<div class="mk-filtre"><select id="mkNiv">'
          + '<option value="">المستوى : الكل</option>'
          + '<option value="2AS"' + (niv === '2AS' ? ' selected' : '') + '>2AS</option>'
          + '<option value="3AS"' + (niv === '3AS' ? ' selected' : '') + '>3AS</option>'
          + '</select></div><div class="mk-list">' + (D.malakhiss || []).filter(m => !niv || m.niveau === niv)
            .map(m => '<details class="mk-c"><summary><span class="mk-u">U' + m.unite + '</span>'
            + '<span class="mk-n">' + esc(m.niveau) + '</span><b class="mk-t">'
            + esc(m.titre_ar) + ' — ' + esc(m.titre_de) + '</b></summary><div class="mk-body">'
            + '<p class="mk-idee">💡 ' + esc(m.idee) + '</p>'
            + '<div class="mk-sec"><b>🔑 المفردات</b><div class="mk-chips">'
            + m.vocabulaire.map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('') + '</div></div>'
            + '<div class="mk-sec"><b>📘 القواعد</b><ul>'
            + m.grammaire.map(g => '<li class="de-in">' + esc(g) + '</li>').join('') + '</ul></div>'
            + '<div class="mk-sec"><b>🗣️ بنى نموذجية</b><ul>'
            + m.structures.map(s => '<li class="de-in">' + esc(s) + '</li>').join('') + '</ul></div>'
            + '<div class="mk-sec mk-tip"><b>⚠️ نصائح</b><ul>'
            + m.conseils.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>'
            + '</div></details>').join('') + '</div>';
      }else{
        h += renderDourous();
      }
      box.innerHTML = h;
      box.querySelectorAll('.bq-tab').forEach(b => b.addEventListener('click', () => {
        ongM = b.dataset.m; render2();
      }));
      const s = box.querySelector('#mkNiv');
      if(s) s.addEventListener('change', () => { niv = s.value; render2(); });
      const s2 = box.querySelector('#mkNiv2');
      if(s2) s2.addEventListener('change', () => { niv = s2.value; render2(); });
    });
  }

  window.renderMalakhiss = render2;
  document.addEventListener('dz:view', e => { if(e.detail === 'malakhiss') render(); });
})();
