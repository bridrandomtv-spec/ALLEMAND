/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — library.js
   Interface de la bibliothèque : KPI · filtres facettés · pagination · fiche détaillée
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  if(!window.BDD) return;
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const TYPES = [
    { id:'devoir',      ar:'فرض',       de:'Kontrollarbeit',    i:'📄' },
    { id:'composition', ar:'اختبار',    de:'Trimesterprüfung',  i:'📘' },
    { id:'bac',         ar:'بكالوريا',  de:'Baccalauréat',      i:'🎓' },
    { id:'annales',     ar:'حوليات',    de:'Annales',           i:'📚' }
  ];
  const TRIS = [['recent','🕐 الأحدث'],['populaire','🔥 الأكثر مشاهدة'],
                ['note','⭐ الأعلى معدلاً'],['difficile','⚡ الأصعب'],['ancien','📜 الأقدم']];
  const K_BDD_STATE = 'dz_de_bdd_loaded';

  let rendered = false;

  /* ── Chargement ── */
  async function boot(){
    const st = $('#bddStatus');
    if(!st) return;
    if(BDD.state.ready){ render(); return; }
    try{
      const ok = await BDD.load((done, total, n) => {
        st.className = 'bdd-status';
        st.innerHTML = '⏳ جارٍ تحميل قاعدة البيانات… <b class="de-in">' + n +
                       '</b> fiche · ' + done + '/' + total + ' fichiers';
      });
      if(ok){ render(); }
      else { st.className = 'bdd-status err'; st.innerHTML = '❌ ' + (BDD.state.error || 'خطأ'); }
    }catch(e){
      st.className = 'bdd-status err';
      st.innerHTML = '❌ تعذّر التحميل : ' + esc(e.message);
    }
  }

  /* ── Rendu principal ── */
  function render(){
    const st = $('#bddStatus'); if(st){
      const k = BDD.kpis();
      st.className = 'bdd-status ok';
      st.innerHTML = '✅ قاعدة البيانات جاهزة — <b class="de-in">' + k.total + '</b> fiche · ' +
                     k.wilayas + ' ولاية · ' + k.unites + ' وحدة · ' + k.annees + ' · ' +
                     k.corriges + ' تصحيح نموذجي';
    }
    const box = $('#biblioBody'); if(!box) return;
    BDD.search();
    if(!rendered){ box.innerHTML = shell(); bind(); rendered = true; }
    paintKPI(); paintFilters(); paintResults();
  }

  function shell(){
    return '' +
      '<div class="bdd-kpis" id="bddKpi"></div>' +
      '<div class="filters">' +
        '<div class="filters-h"><b>🔎 البحث والتصفية</b>' +
          '<button class="btn btn-o btn-sm" id="btnResetF">↺ إعادة الضبط</button></div>' +
        '<div class="frow"><div class="fld2 search-bar"><span>🔍 بحث حر</span>' +
          '<input id="fQ" type="search" placeholder="sein · حوليات 2024 · Bouira · BAC…">' +
          '<span class="s-ico">🔍</span></div>' +
          '<div class="fld2"><span>📊 الترتيب</span><select id="fTri"></select></div></div>' +
        '<div class="frow" id="fRow1"></div>' +
        '<div class="frow" id="fRow2"></div>' +
        '<div class="chips" id="fChips"></div>' +
      '</div>' +
      '<div class="result-bar"><div>النتائج : <span class="result-n" id="rCount">0</span></div>' +
        '<div id="rPageInfo"></div></div>' +
      '<div id="rList"></div>' +
      '<div class="pager" id="rPager"></div>';
  }

  function bind(){
    let t = null;
    const q = $('#fQ');
    if(q) q.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { BDD.setQuery(q.value); paintResults(); paintChips(); }, 220);
    });
    const tri = $('#fTri');
    if(tri) tri.addEventListener('change', () => { BDD.setTri(tri.value); paintResults(); });
    const rs = $('#btnResetF');
    if(rs) rs.addEventListener('click', () => {
      BDD.reset();
      $$('.filters select, .filters input').forEach(e => {
        if(e.id === 'fQ') e.value = ''; else e.value = 'tous';
      });
      paintResults(); paintChips();
    });
    document.addEventListener('change', ev => {
      const s = ev.target.closest('[data-filtre]');
      if(s){ BDD.setFiltre(s.dataset.filtre, s.value); paintResults(); paintChips(); }
    });
    document.addEventListener('click', ev => {
      const t2 = ev.target.closest('[data-type]');
      if(t2){
        const cur = BDD.state.filtres.type;
        BDD.setFiltre('type', cur === t2.dataset.type ? 'tous' : t2.dataset.type);
        syncSelects(); paintResults(); paintChips(); return;
      }
      const pg = ev.target.closest('[data-page]');
      if(pg){ BDD.setPage(+pg.dataset.page); paintResults();
        const el = $('#rList'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); return; }
      const fc = ev.target.closest('[data-fiche]');
      if(fc){ openFiche(fc.dataset.fiche); return; }
      if(ev.target.closest('#mClose') || ev.target.id === 'modal'){ closeModal(); return; }
      const cor = ev.target.closest('#mCorrige');
      if(cor){ const b = $('#mCorrigeBox'); if(b){ b.hidden = !b.hidden;
        cor.textContent = b.hidden ? '✅ عرض التصحيح النموذجي' : '🙈 إخفاء التصحيح'; } return; }
    });
  }

  function syncSelects(){
    const f = BDD.state.filtres;
    $$('[data-filtre]').forEach(s => { if(f[s.dataset.filtre] !== undefined) s.value = f[s.dataset.filtre]; });
  }

  /* ── KPI ── */
  function paintKPI(){
    const k = BDD.kpis(), el = $('#bddKpi'); if(!el) return;
    const cur = BDD.state.filtres.type;
    const cards = [
      { id:'devoir',      i:'📄', n:k.devoirs,      ar:'فروض',              de:'Kontrollarbeiten' },
      { id:'composition', i:'📘', n:k.compositions, ar:'اختبارات فصلية',    de:'Trimesterprüfungen' },
      { id:'bac',         i:'🎓', n:k.bac,          ar:'بكالوريا',          de:'Baccalauréat' },
      { id:'annales',     i:'📚', n:k.annales,      ar:'حوليات',            de:'Annales' }
    ];
    el.innerHTML = cards.map(c =>
      '<div class="kpi' + (cur === c.id ? ' on' : '') + '" data-type="' + c.id + '">' +
      '<div class="kpi-i">' + c.i + '</div><div class="kpi-n">' + c.n + '</div>' +
      '<div class="kpi-l">' + c.ar + '</div><div class="kpi-d">' + c.de + '</div></div>').join('');
  }

  /* ── Filtres ── */
  function paintFilters(){
    const ref = BDD.state.ref || { items:[] };
    const it = (ref.items && ref.items[0]) ? ref.items[0] : null;
    const wilayas = (it && it.wilayas) || [];
    const unites  = (it && it.unites_2AS) || [];
    const unites3 = (it && it.unites_3AS) || [];
    const filieres= (it && it.filieres) || [];
    const annees  = (it && it.annees_scolaires) || [];

    /* Dérivation depuis les données si le référentiel est absent */
    const W = wilayas.length ? wilayas
      : Object.keys(BDD.facet('code_wilaya')).sort().map(c => {
          const s = BDD.state.items.filter(i => i.code_wilaya === c)[0];
          return { code:c, nom: s ? s.wilaya : c }; });
    const A = annees.length ? annees
      : Array.from(new Set(BDD.state.items.map(i => i.annee_scolaire))).sort().reverse();
    const U = (unites.length ? unites : []).concat(unites3.length ? unites3 : []);
    const UU = U.length ? U
      : Array.from(new Set(BDD.state.items.map(i => i.unite))).sort((a,b)=>a-b).map(n => {
          const s = BDD.state.items.filter(i => i.unite === n)[0];
          return { n:n, de:s.unite_de, ar:s.unite_ar }; });
    const F = filieres.length ? filieres : Array.from(new Set(BDD.state.items.map(i => i.filiere))).sort();

    const opt = (v,l,sel) => '<option value="' + esc(v) + '"' + (sel===v?' selected':'') + '>' + esc(l) + '</option>';
    const f = BDD.state.filtres;

    const r1 = $('#fRow1');
    if(r1) r1.innerHTML =
      fld('🎓 المستوى','niveau', opt('tous','الكل',f.niveau) +
        ['2AS','3AS'].map(n => opt(n, n === '2AS' ? 'الثانية ثانوي' : 'الثالثة ثانوي', f.niveau)).join('')) +
      fld('📚 الوحدة','unite', opt('tous','الكل',f.unite) +
        UU.map(u => opt(u.n, u.n + ' — ' + u.de + ' · ' + u.ar, f.unite)).join('')) +
      fld('📍 الولاية','wilaya', opt('tous','كل الولايات (' + W.length + ')',f.wilaya) +
        W.map(w => opt(w.code, w.code + ' — ' + w.nom, f.wilaya)).join('')) +
      fld('🗓️ السنة','annee', opt('tous','الكل',f.annee) +
        A.map(a => opt(String(typeof a === 'string' ? a.split('/')[1] : a), a, f.annee)).join(''));

    const r2 = $('#fRow2');
    if(r2) r2.innerHTML =
      fld('📅 الفصل','trimestre', opt('tous','الكل',f.trimestre) +
        [1,2,3].map(t => opt(t, 'الفصل ' + t, f.trimestre)).join('')) +
      fld('🎯 الشعبة','filiere', opt('tous','الكل',f.filiere) +
        F.map(x => opt(x, x, f.filiere)).join('')) +
      fld('⚡ الصعوبة','difficulte', opt('tous','الكل',f.difficulte) +
        [[1,'سهل'],[2,'متوسط'],[3,'صعب']].map(d => opt(d[0], d[1], f.difficulte)).join('')) +
      fld('✅ التصحيح','corrige', opt('tous','الكل',f.corrige) +
        opt('oui','مع التصحيح',f.corrige) + opt('non','بدون تصحيح',f.corrige));

    const tri = $('#fTri');
    if(tri) tri.innerHTML = TRIS.map(t => opt(t[0], t[1], BDD.state.tri)).join('');

    function fld(label, key, options){
      return '<div class="fld2"><span>' + label + '</span>' +
             '<select data-filtre="' + key + '">' + options + '</select></div>';
    }
    paintChips();
  }

  function paintChips(){
    const el = $('#fChips'); if(!el) return;
    const f = BDD.state.filtres, out = [];
    if(BDD.state.q) out.push(['🔍 « ' + BDD.state.q + ' »', null]);
    Object.keys(f).forEach(k => {
      if(f[k] !== 'tous'){
        const lbl = { type:'النوع', niveau:'المستوى', filiere:'الشعبة', wilaya:'الولاية',
                      annee:'السنة', trimestre:'الفصل', unite:'الوحدة',
                      difficulte:'الصعوبة', corrige:'التصحيح' }[k] || k;
        out.push([lbl + ' : ' + f[k], k]);
      }
    });
    if(!out.length){ el.innerHTML = '<span class="fchip">684 fiche · 58 ولاية · 12 سنة · 22 وحدة</span>'; return; }
    el.innerHTML = out.map(o => '<span class="fchip on" data-clear="' + (o[1]||'q') + '">' +
                     esc(o[0]) + ' ✕</span>').join('') +
                 '<span class="fchip" id="chipAll">🗑️ مسح الكل</span>';
    $$('[data-clear]', el).forEach(c => c.addEventListener('click', () => {
      const k = c.dataset.clear;
      if(k === 'q'){ BDD.setQuery(''); const q = $('#fQ'); if(q) q.value = ''; }
      else { BDD.setFiltre(k, 'tous'); syncSelects(); }
      paintResults(); paintKPI(); paintChips();
    }));
    const all = $('#chipAll', el);
    if(all) all.addEventListener('click', () => {
      BDD.reset(); const q = $('#fQ'); if(q) q.value = '';
      syncSelects(); paintResults(); paintKPI(); paintChips();
    });
  }

  /* ── Résultats ── */
  function paintResults(){
    const list = $('#rList'), cnt = $('#rCount'), info = $('#rPageInfo'), pager = $('#rPager');
    if(!list) return;
    const n = BDD.state.resultats.length;
    if(cnt) cnt.textContent = n;
    const rows = BDD.page();

    if(!rows.length){
      list.innerHTML = '<div class="card empty"><div class="empty-i">🔍</div>' +
        '<h3>لا توجد نتائج مطابقة</h3><p>جرّب توسيع البحث أو أعد ضبط المرشّحات.</p></div>';
      if(pager) pager.innerHTML = ''; if(info) info.textContent = '';
      return;
    }
    if(info) info.textContent = 'صفحة ' + BDD.state.page + ' / ' + BDD.pages();

    list.innerHTML = rows.map(ficheCard).join('');

    if(pager){
      const p = BDD.state.page, max = BDD.pages();
      let h = '<button class="pg" data-page="' + (p-1) + '"' + (p<=1?' disabled':'') + '>›</button>';
      const win = [];
      for(let i = Math.max(1, p-2); i <= Math.min(max, p+2); i++) win.push(i);
      if(win[0] > 1){ h += '<button class="pg" data-page="1">1</button>'; if(win[0] > 2) h += '<span class="pg" style="border:none;background:none">…</span>'; }
      win.forEach(i => { h += '<button class="pg' + (i===p?' on':'') + '" data-page="' + i + '">' + i + '</button>'; });
      if(win[win.length-1] < max){ if(win[win.length-1] < max-1) h += '<span class="pg" style="border:none;background:none">…</span>';
        h += '<button class="pg" data-page="' + max + '">' + max + '</button>'; }
      h += '<button class="pg" data-page="' + (p+1) + '"' + (p>=max?' disabled':'') + '>‹</button>';
      pager.innerHTML = h;
    }
  }

  function ficheCard(f){
    const t = TYPES.filter(x => x.id === f.type)[0] || TYPES[0];
    const d = [0,0,0].map((_,i) => '<i class="' + (i < f.difficulte ? 'on' : '') + '"></i>').join('');
    return '<article class="fiche" data-fiche="' + esc(f.id) + '">' +
      '<div class="fiche-h"><div><div class="fiche-t">' + esc(f.titre) + '</div>' +
        '<div class="fiche-de">' + esc(f.titre_de) + '</div></div>' +
        '<span class="badge ' + f.type + '">' + t.i + ' ' + t.ar + '</span></div>' +
      '<div class="fiche-meta">' +
        mchip('📅', f.annee_scolaire) +
        mchip('🎓', f.niveau) +
        (f.trimestre ? mchip('📆', 'الفصل ' + f.trimestre) : '') +
        mchip('📍', f.code_wilaya + ' · ' + f.wilaya) +
        mchip('🏫', f.lycee) +
        mchip('📖', 'الوحدة ' + f.unite) +
        mchip('⏱️', f.duree_minutes + ' د') +
        mchip('🧮', '/' + f.bareme) +
      '</div>' +
      '<div class="fiche-foot">' +
        '<div class="fiche-src">📌 ' + esc(f.source) + '</div>' +
        '<div style="display:flex;gap:11px;align-items:center;flex-wrap:wrap">' +
          '<span class="diff" title="الصعوبة">' + d + '</span>' +
          '<span class="mchip">👁️ ' + f.vues + '</span>' +
          '<span class="mchip">⭐ ' + f.note_moyenne + '</span>' +
          (f.corrige_inclus ? '<span class="mchip" style="color:var(--g)">✅ تصحيح</span>' : '') +
        '</div>' +
      '</div></article>';
    function mchip(i,v){ return '<span class="mchip">' + i + ' <b>' + esc(v) + '</b></span>'; }
  }

  /* ── Fiche détaillée ── */
  function openFiche(id){
    const f = BDD.get(id); if(!f) return;
    BDD.logVue(id);
    const t = TYPES.filter(x => x.id === f.type)[0] || TYPES[0];
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;

    c.innerHTML =
      '<div class="modal-h"><div><span class="badge ' + f.type + '">' + t.i + ' ' + t.ar +
        ' · ' + t.de + '</span><h2 style="margin:9px 0 3px;font-family:var(--ff-ar-display);font-size:19px">' +
        esc(f.titre) + '</h2><div class="fiche-de">' + esc(f.titre_de) + '</div></div>' +
        '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' +
        '<div class="info-grid">' +
          info('📅 السنة الدراسية', f.annee_scolaire) +
          info('🎓 المستوى', f.niveau + ' · ' + f.filiere) +
          info('📆 الفصل', f.trimestre ? 'الفصل ' + f.trimestre : '—') +
          info('📍 الجهة', 'الجزائر') +
          info('🏛️ المدينة', f.ville) +
          info('🏫 المصدر', 'وثيقة تربوية') +
          info('📖 الوحدة', f.unite + ' — ' + f.unite_de) +
          info('⏱️ المدة', f.duree_minutes + ' دقيقة') +
          info('🧮 السلّم', f.bareme + ' نقطة') +
          info('👁️ المشاهدات', f.vues) +
          info('📥 التحميلات', f.telechargements) +
          info('⭐ المعدل', f.note_moyenne + '/20') +
        '</div>' +
        '<div style="margin-bottom:13px"><b>🧩 سلّم التنقيط</b>' +
          '<table class="bareme"><tr><th>الجزء</th><th>المحتوى</th><th>النقاط</th></tr>' +
          (f.parties || []).map(p => '<tr><td><b>' + esc(p.id) + '</b></td><td>' + esc(p.titre) +
            '</td><td>' + p.points + '</td></tr>').join('') +
          '<tr style="background:rgba(61,220,132,.1)"><td colspan="2"><b>المجموع</b></td>' +
          '<td><b>' + f.bareme + '</b></td></tr></table></div>' +
        '<div style="margin-bottom:13px"><b>🏷️ الوسوم</b><div class="chips">' +
          (f.tags || []).map(x => '<span class="fchip on">' + esc(x) + '</span>').join('') +
          '</div></div>' +
        '<div style="margin-bottom:9px"><b>📄 نص الموضوع</b></div>' +
        '<div class="sujet-box">' + esc(f.sujet) + '</div>' +
        (f.corrige_inclus
          ? '<button class="btn btn-g btn-block" id="mCorrige">✅ عرض التصحيح النموذجي</button>' +
            '<div class="corrige-box" id="mCorrigeBox" hidden style="margin-top:13px">' +
            esc(f.corrige) + '</div>'
          : '<div class="privacy">⚠️ لا يتوفّر تصحيح نموذجي لهذه الوثيقة.</div>') +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:15px">' +
          '<button class="btn btn-o btn-sm" id="mPrint">🖨️ طباعة</button>' +
          '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" href="https://wa.me/213555577931?text=' +
            encodeURIComponent('السلام عليكم أستاذ، أريد شرح ' + f.titre) + '">💬 اطلب شرح الأستاذ</a>' +
        '</div>' +
        '<div class="fiche-src" style="margin-top:13px;text-align:center">🔖 ' + esc(f.id) +
          ' · المصدر : ' + esc(f.source) + '</div>' +
      '</div>';

    m.hidden = false; document.body.style.overflow = 'hidden';
    const pr = $('#mPrint'); if(pr) pr.addEventListener('click', () => window.print());
  }
  function info(k,v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                             '<div class="info-v">' + esc(v) + '</div></div>'; }
  function closeModal(){
    const m = $('#modal'); if(m) m.hidden = true;
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  /* ── Hook sur la navigation ── */
  document.addEventListener('dz:view', e => { if(e.detail === 'biblio') boot(); });
  window.addEventListener('DOMContentLoaded', () => {
    const box = $('#biblioBody');
    if(box && location.hash === '#biblio') boot();
  });
  window.renderBiblio = boot;
  window.DZ_BDD_UI = { render:render, boot:boot, openFiche:openFiche, closeModal:closeModal };
})();
