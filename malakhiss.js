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

  window.renderMalakhiss = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'malakhiss') render(); });
})();
