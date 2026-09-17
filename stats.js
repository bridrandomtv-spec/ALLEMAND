/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — stats.js
   🗺️ الإحصائيات الوطنية · Statistiques nationales
   Carte SVG interactive des 58 wilayas (projection équirectangulaire)
   Répartition par type · évolution par année · heatmap difficulté × trimestre
   Statistiques BAC nationales · tableau complet triable
   Sources : assets/bdd/{devoirs,compositions,bac,annales,wilayas_geo,bac_archive}.json
   Agrégats uniquement — aucune donnée nominative
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const GEO   = 'assets/bdd/wilayas_geo.json';
  const FILES = ['devoirs','compositions','bac','annales'];
  const TYPES = { devoir:['📄','فروض','Kontrollarbeiten'],
                  composition:['📘','اختبارات','Trimesterprüfungen'],
                  bac:['🎓','بكالوريا','Baccalauréat'],
                  annales:['📚','حوليات','Annales'] };
  const VB_W = 620, VB_H = 800, PAD = 26;

  let GEO_D = null, ITEMS = null, BAC = null;
  let onglet = 'carte';
  let survol = null;
  let triCol = 'docs', triSens = -1;
  let fRegion = 'tous';

  /* ── Chargement (carte + corpus documentaire) ── */
  async function boot(){
    const box = $('#statsBody'); if(!box) return;
    box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل الإحصائيات الوطنية…</div>';
    try{
      if(!GEO_D){
        const r = await fetch(GEO, { cache:'force-cache' });
        if(!r.ok) throw new Error('geo HTTP ' + r.status);
        GEO_D = await r.json();
      }
      if(!ITEMS) ITEMS = await chargerCorpus();
    }catch(e){
      box.innerHTML = '<div class="bdd-status err">❌ تعذّر التحميل : ' + esc(e.message) + '</div>';
      return;
    }
    render();
  }

  async function chargerCorpus(){
    /* Priorité au moteur BDD déjà chargé (évite de re-télécharger 1,6 Mo) */
    if(window.BDD && BDD.state && BDD.state.ready && BDD.state.items.length){
      return BDD.state.items;
    }
    if(window.BDD && typeof BDD.load === 'function'){
      try{ await BDD.load(null);
        if(BDD.state.ready) return BDD.state.items; }catch(e){}
    }
    const out = [];
    await Promise.all(FILES.map(async f => {
      try{
        const r = await fetch('assets/bdd/' + f + '.json', { cache:'force-cache' });
        if(!r.ok) return;
        const d = await r.json();
        (d.items || []).forEach(it => out.push(it));
      }catch(e){}
    }));
    return out;
  }

  /* ── Projection équirectangulaire ── */
  function proj(lat, lon){
    const b = GEO_D.bbox;
    const x = PAD + (lon - b.lon_min) / (b.lon_max - b.lon_min) * (VB_W - 2 * PAD);
    const y = PAD + (b.lat_max - lat) / (b.lat_max - b.lat_min) * (VB_H - 2 * PAD);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  }
  function cheminOutline(){
    return (GEO_D.outline || []).map((p, i) => {
      const c = proj(p.lat, p.lon);
      return (i === 0 ? 'M' : 'L') + c[0] + ' ' + c[1];
    }).join(' ') + ' Z';
  }

  /* ── Agrégats ── */
  function agreger(){
    const parWilaya = {};
    (GEO_D.wilayas || []).forEach(w => {
      parWilaya[w.code] = { code:w.code, nom_ar:w.nom_ar, nom_fr:w.nom_fr, lat:w.lat, lon:w.lon,
                            region:w.region, docs:0, types:{}, annees:{},
                            diff:{1:0,2:0,3:0}, trim:{1:0,2:0,3:0},
                            corriges:0, duree:0, notes:0, nbNotes:0 };
    });
    (ITEMS || []).forEach(it => {
      const k = it.code_wilaya;
      if(!parWilaya[k]) return;
      const w = parWilaya[k];
      w.docs++;
      w.types[it.type] = (w.types[it.type] || 0) + 1;
      const an = String(it.annee || '');
      if(an) w.annees[an] = (w.annees[an] || 0) + 1;
      if(it.difficulte) w.diff[it.difficulte] = (w.diff[it.difficulte] || 0) + 1;
      if(it.trimestre) w.trim[it.trimestre] = (w.trim[it.trimestre] || 0) + 1;
      if(it.corrige_inclus) w.corriges++;
      w.duree += (it.duree_minutes || 0);
      if(it.note_moyenne){ w.notes += it.note_moyenne; w.nbNotes++; }
    });
    return parWilaya;
  }

  function globaux(){
    const t = { total:0, types:{}, annees:{}, wilayas:new Set(), trim:{1:0,2:0,3:0},
                diff:{1:0,2:0,3:0}, corriges:0, unites:{} };
    (ITEMS || []).forEach(it => {
      t.total++;
      t.types[it.type] = (t.types[it.type] || 0) + 1;
      const an = String(it.annee || '');
      if(an) t.annees[an] = (t.annees[an] || 0) + 1;
      if(it.code_wilaya) t.wilayas.add(it.code_wilaya);
      if(it.trimestre) t.trim[it.trimestre] = (t.trim[it.trimestre] || 0) + 1;
      if(it.difficulte) t.diff[it.difficulte] = (t.diff[it.difficulte] || 0) + 1;
      if(it.corrige_inclus) t.corriges++;
      if(it.unite) t.unites[it.unite] = (t.unites[it.unite] || 0) + 1;
    });
    t.wilayas = t.wilayas.size;
    return t;
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#statsBody'); if(!box) return;
    box.innerHTML =
      entete() +
      '<div class="onglets" id="stOng">' +
        ong('carte','🗺️ الخريطة') + ong('types','📊 التوزيع') +
        ong('temps','📈 الزمن') + ong('difficulte','🌡️ الصعوبة') +
        ong('bac','🎓 البكالوريا') + ong('tableau','📋 الجدول') +
      '</div>' +
      '<div id="stContenu"></div>';
    paint();
  }
  function ong(id,lbl){
    return '<button class="ong' + (onglet===id?' on':'') + '" data-stong="' + id + '">' + lbl + '</button>';
  }

  function entete(){
    const g = globaux();
    const nbW = Object.keys(GEO_D.wilayas || {}).length || (GEO_D.wilayas || []).length;
    return '<div class="card st-hero">' +
      '<div><div class="ch-badge">🗺️ الإحصائيات الوطنية — ' +
        esc(GEO_D._meta.annee_scolaire || '2026/2027') + '</div>' +
      '<h2>' + esc(GEO_D._meta.titre_fr) + '</h2>' +
      '<div class="ch-sub">' + esc(GEO_D._meta.source) + '</div></div>' +
      '<div class="st-kpis">' +
        kpi('📚', g.total, 'وثيقة') + kpi('📍', g.wilayas + '/' + nbW, 'ولاية مغطاة') +
        kpi('🗓️', Object.keys(g.annees).length, 'سنة دراسية') +
        kpi('🧩', Object.keys(g.unites).length, 'وحدة') +
        kpi('✅', Math.round(g.corriges / (g.total||1) * 100) + '%', 'مع تصحيح') +
        kpi('🏛️', (GEO_D.regions||[]).length, 'مناطق') +
      '</div></div>';
    function kpi(i,n,l){ return '<div class="stk"><div class="stk-n">' + n + '</div>' +
      '<div class="stk-l">' + l + '</div><div class="stk-i">' + i + '</div></div>'; }
  }

  function paint(){
    const c = $('#stContenu'); if(!c) return;
    if(onglet === 'carte')      c.innerHTML = vueCarte();
    if(onglet === 'types')      c.innerHTML = vueTypes();
    if(onglet === 'temps')      c.innerHTML = vueTemps();
    if(onglet === 'difficulte') c.innerHTML = vueDifficulte();
    if(onglet === 'bac')        c.innerHTML = vueBac();
    if(onglet === 'tableau')    c.innerHTML = vueTableau();
    if(onglet === 'bac' && !BAC) chargerBac();
  }

  /* ══════ 1. CARTE ══════ */
  function vueCarte(){
    const agg = agreger();
    const max = Math.max.apply(null, Object.keys(agg).map(k => agg[k].docs).concat([1]));
    const pts = Object.keys(agg).map(k => {
      const w = agg[k];
      const c = proj(w.lat, w.lon);
      const r = 3.2 + Math.sqrt(w.docs / max) * 11;
      const cls = w.docs === 0 ? 'z' : (w.docs / max > 0.66 ? 'a' : (w.docs / max > 0.33 ? 'b' : 'c'));
      return '<circle class="wpt ' + cls + '" cx="' + c[0] + '" cy="' + c[1] + '" r="' +
        r.toFixed(1) + '" data-w="' + esc(k) + '"><title>' + esc(w.nom_ar) + ' (' + w.nom_fr +
        ') — ' + w.docs + ' وثيقة</title></circle>';
    }).join('');

    const top = Object.keys(agg).map(k => agg[k]).sort((a,b) => b.docs - a.docs).slice(0, 12);

    return '<div class="st-map-wrap">' +
      '<svg class="st-map" viewBox="' + esc(GEO_D._meta.viewbox || ('0 0 ' + VB_W + ' ' + VB_H)) +
        '" role="img" aria-label="خريطة الولايات الـ58">' +
        '<defs><linearGradient id="gDZ" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#0d3d24"/><stop offset="100%" stop-color="#071d12"/>' +
        '</linearGradient></defs>' +
        '<path class="dz-outline" d="' + cheminOutline() + '" fill="url(#gDZ)"/>' +
        pts +
      '</svg>' +
      '<div class="st-legend">' +
        '<div class="lg-t">📚 عدد الوثائق</div>' +
        '<div class="lg-r"><span class="lg-d a"></span> كثيف</div>' +
        '<div class="lg-r"><span class="lg-d b"></span> متوسّط</div>' +
        '<div class="lg-r"><span class="lg-d c"></span> قليل</div>' +
        '<div class="lg-r"><span class="lg-d z"></span> لا توجد</div>' +
        '<div class="lg-n">حجم الدائرة ∝ √(عدد الوثائق)</div>' +
      '</div>' +
      '<div class="st-tip" id="stTip" hidden></div>' +
      '</div>' +
      '<div class="grid2">' +
        '<div class="card"><h2>🏆 أهم 12 ولاية</h2><div class="wlist">' +
          top.map((w,i) => {
            const pct = Math.round(w.docs / max * 100);
            return '<div class="wrow" data-w="' + esc(w.code) + '">' +
              '<span class="wn"><b>' + (i+1) + '.</b> ' + w.code + ' · ' + esc(w.nom_ar) + '</span>' +
              '<span class="wbar"><i style="width:' + pct + '%"></i></span>' +
              '<span class="wv ok">' + w.docs + '</span></div>';
          }).join('') + '</div></div>' +
        '<div class="card"><h2>🌍 التوزيع حسب المنطقة</h2>' + vueRegions(agg) + '</div>' +
      '</div>';
  }

  function vueRegions(agg){
    const parReg = {};
    Object.keys(agg).forEach(k => {
      const r = agg[k].region;
      parReg[r] = parReg[r] || { docs:0, wilayas:0 };
      parReg[r].docs += agg[k].docs; parReg[r].wilayas++;
    });
    const max = Math.max.apply(null, Object.keys(parReg).map(r => parReg[r].docs).concat([1]));
    return '<div class="wlist">' + (GEO_D.regions || []).map(r => {
      const d = parReg[r.id] || { docs:0, wilayas:r.nombre };
      const pct = Math.round(d.docs / max * 100);
      return '<div class="wrow" data-region="' + esc(r.id) + '">' +
        '<span class="wn"><b>' + esc(r.ar) + '</b><br><i>' + esc(r.id) + ' · ' +
          r.nombre + ' ولاية</i></span>' +
        '<span class="wbar"><i style="width:' + pct + '%"></i></span>' +
        '<span class="wv ok">' + d.docs + '</span></div>';
    }).join('') + '</div>';
  }

  /* ══════ 2. TYPES ══════ */
  function vueTypes(){
    const g = globaux();
    const tot = g.total || 1;
    const cols = { devoir:'#3ddc84', composition:'#4f8cff', bac:'#e8b64c', annales:'#b39aff' };
    let cum = 0;
    const segs = Object.keys(TYPES).map(k => {
      const v = g.types[k] || 0;
      const p = v / tot * 100;
      const seg = '<span style="background:' + cols[k] + ';width:' + p.toFixed(2) + '%" ' +
        'title="' + TYPES[k][1] + ' : ' + v + ' (' + p.toFixed(1) + '%)"></span>';
      cum += p;
      return seg;
    }).join('');

    return '<div class="grid2">' +
      '<div class="card"><h2>📊 التوزيع حسب النوع</h2>' +
        '<div class="donut-wrap"><svg class="donut" viewBox="0 0 42 42">' +
          Object.keys(TYPES).map(k => {
            const v = g.types[k] || 0, p = v / tot * 100;
            return donutArc(p, cols[k]);
          }).join('') +
          '<circle class="donut-hole" cx="21" cy="21" r="15.91549431"/>' +
          '<text class="donut-n" x="21" y="20.2">' + g.total + '</text>' +
          '<text class="donut-l" x="21" y="25">وثيقة</text>' +
        '</svg></div>' +
        '<div class="legende">' + Object.keys(TYPES).map(k => {
          const v = g.types[k] || 0;
          return '<div class="lg-i"><span class="lg-c" style="background:' + cols[k] + '"></span>' +
            '<b>' + TYPES[k][0] + ' ' + esc(TYPES[k][1]) + '</b>' +
            '<i class="de-display">' + esc(TYPES[k][2]) + '</i>' +
            '<span class="lg-v">' + v + ' · ' + (v/tot*100).toFixed(1) + '%</span></div>';
        }).join('') + '</div></div>' +
      '<div class="card"><h2>📐 الشريط المئوي</h2><div class="stack">' + segs + '</div>' +
        '<div class="privacy" style="margin-top:13px">🧮 ' + g.corriges + ' / ' + g.total +
        ' وثيقة تتضمّن تصحيحاً نموذجياً (' + Math.round(g.corriges/tot*100) +
        '%) · ' + g.wilayas + ' ولاية مغطاة</div>' +
        '<h3 style="margin:15px 0 9px">📖 حسب الوحدة</h3>' + barres(g.unites, 'الوحدة') +
      '</div></div>' +
      '<div class="card"><h2>🏛️ التوزيع حسب المنطقة</h2>' + vueRegions(agreger()) + '</div>';
  }

  function donutArc(pct, color){
    if(!pct) return '';
    let offset = donutArc._o === undefined ? 25 : donutArc._o;
    donutArc._o = (offset - pct + 100) % 100;
    return '<circle class="donut-seg" cx="21" cy="21" r="15.91549431" fill="transparent" ' +
      'stroke="' + color + '" stroke-width="6" stroke-dasharray="' + pct.toFixed(3) + ' ' +
      (100 - pct).toFixed(3) + '" stroke-dashoffset="' + offset.toFixed(3) + '"></circle>';
  }

  function barres(obj, label){
    const ks = Object.keys(obj).sort((a,b) => (+a) - (+b));
    if(!ks.length) return '<p style="color:var(--m);font-size:13px">لا توجد بيانات.</p>';
    const max = Math.max.apply(null, ks.map(k => obj[k]));
    return '<div class="wlist">' + ks.map(k =>
      '<div class="wrow"><span class="wn">' + esc(label) + ' ' + esc(k) + '</span>' +
      '<span class="wbar"><i style="width:' + Math.round(obj[k]/max*100) + '%"></i></span>' +
      '<span class="wv ok">' + obj[k] + '</span></div>').join('') + '</div>';
  }

  /* ══════ 3. TEMPS ══════ */
  function vueTemps(){
    const g = globaux();
    const ans = Object.keys(g.annees).sort();
    const max = Math.max.apply(null, ans.map(a => g.annees[a]).concat([1]));
    const moy = g.total / (ans.length || 1);

    return '<div class="card"><h2>📈 تطور حجم الوثائق حسب السنة الدراسية</h2>' +
      '<div class="chart-col">' + ans.map(a => {
        const v = g.annees[a], h = Math.round(v / max * 100);
        const cls = v >= moy ? 'hi' : 'lo';
        return '<div class="cc"><span class="cc-v' + (v >= moy ? ' on' : '') + '">' + v + '</span>' +
          '<span class="cc-b"><i class="' + cls + '" style="height:' + h + '%"></i></span>' +
          '<span class="cc-l">' + esc(a.slice(2)) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="hleg">' + ans.length + ' سنة دراسية · ' + ans[0] + ' → ' + ans[ans.length-1] +
        ' · moyenne ' + moy.toFixed(1) + ' document/an</div></div>' +
      '<div class="grid2">' +
        '<div class="card"><h2>📅 حسب الفصل</h2>' +
          barres({1: g.trim[1]||0, 2: g.trim[2]||0, 3: g.trim[3]||0}, 'الفصل') + '</div>' +
        '<div class="card"><h2>🏆 السنوات الأغزر</h2>' +
          '<div class="wlist">' + ans.slice().sort((a,b) => g.annees[b] - g.annees[a]).slice(0,8)
            .map(a => '<div class="wrow"><span class="wn de-in">' + esc(a) + '</span>' +
              '<span class="wbar"><i style="width:' + Math.round(g.annees[a]/max*100) + '%"></i></span>' +
              '<span class="wv ok">' + g.annees[a] + '</span></div>').join('') + '</div></div>' +
      '</div>';
  }

  /* ══════ 4. DIFFICULTÉ ══════ */
  function vueDifficulte(){
    const g = globaux();
    const agg = agreger();
    const LIB = { 1:'سهل', 2:'متوسط', 3:'صعب' };
    const tot = Math.max(1, (g.diff[1]||0) + (g.diff[2]||0) + (g.diff[3]||0));

    /* heatmap région × difficulté */
    const regs = (GEO_D.regions || []);
    const hm = {};
    regs.forEach(r => { hm[r.id] = {1:0,2:0,3:0}; });
    Object.keys(agg).forEach(k => {
      const w = agg[k];
      if(!hm[w.region]) return;
      [1,2,3].forEach(d => { hm[w.region][d] += (w.diff[d] || 0); });
    });
    const maxCell = Math.max.apply(null, regs.map(r => Math.max(hm[r.id][1], hm[r.id][2], hm[r.id][3])).concat([1]));

    return '<div class="card"><h2>🌡️ توزيع الصعوبة على المستوى الوطني</h2>' +
      '<div class="diff-bar">' + [1,2,3].map(d => {
        const v = g.diff[d] || 0, p = v / tot * 100;
        return '<span class="db d' + d + '" style="width:' + p.toFixed(2) + '%">' +
          (p > 8 ? LIB[d] + ' ' + v : (p > 3 ? v : '')) + '</span>';
      }).join('') + '</div>' +
      '<div class="rleg" style="margin-top:11px">' + [1,2,3].map(d =>
        '<span class="d' + d + '">' + (d===1?'🟢':d===2?'🟡':'🔴') + ' ' + LIB[d] + ' : ' +
        (g.diff[d]||0) + ' (' + ((g.diff[d]||0)/tot*100).toFixed(1) + '%)</span>').join('') +
      '</div></div>' +
      '<div class="card"><h2>🔥 الخريطة الحرارية — المنطقة × الصعوبة</h2>' +
      '<table class="bareme hm"><tr><th>المنطقة</th><th>🟢 سهل</th><th>🟡 متوسط</th>' +
      '<th>🔴 صعب</th><th>المجموع</th><th>الصعب %</th></tr>' +
      regs.map(r => {
        const h = hm[r.id], s = h[1] + h[2] + h[3];
        const pd = s ? Math.round(h[3] / s * 100) : 0;
        return '<tr><td style="text-align:right"><b>' + esc(r.ar) + '</b>' +
          '<div style="font-size:10.5px;color:var(--m)">' + esc(r.id) + '</div></td>' +
          [1,2,3].map(d => '<td class="hmc" style="background:' + cell(h[d], maxCell, d) + '">' +
            h[d] + '</td>').join('') +
          '<td><b>' + s + '</b></td>' +
          '<td class="rep-v ' + (pd > 40 ? 'ko' : pd > 25 ? '' : 'ok') + '">' + pd + '%</td></tr>';
      }).join('') + '</table>' +
      '<div class="hleg" style="margin-top:11px">شدة اللون ∝ عدد الوثائق · ' +
        'العمود « الصعب % » = حصة المستوى الصعب في المنطقة</div></div>' +
      '<div class="card"><h2>📊 الصعوبة حسب الفصل</h2>' +
      '<table class="bareme"><tr><th>الفصل</th><th>عدد الوثائق</th><th>الحصة</th></tr>' +
      [1,2,3].map(t => '<tr><td>الفصل ' + t + '</td><td>' + (g.trim[t]||0) + '</td>' +
        '<td>' + ((g.trim[t]||0) / (g.total||1) * 100).toFixed(1) + '%</td></tr>').join('') +
      '</table></div>';

    function cell(v, mx, d){
      const a = mx ? (v / mx) : 0;
      const base = d === 1 ? '61,220,132' : (d === 2 ? '255,180,84' : '255,107,125');
      return 'rgba(' + base + ',' + (0.06 + a * 0.55).toFixed(3) + ')';
    }
  }

  /* ══════ 5. BAC ══════ */
  function vueBac(){
    if(!BAC) return '<div class="card"><div class="bdd-status">⏳ جارٍ تحميل أرشيف البكالوريا…</div></div>';
    const an = BAC.annees || [];
    const maxC = Math.max.apply(null, an.map(a => a.candidats).concat([1]));
    const maxM = Math.max.apply(null, an.map(a => a.moyenne).concat([20]));
    const suj = BAC.sujets || [];
    const themes = BAC.themes || [];

    return '<div class="bdd-kpis">' +
      kpi('🎓', suj.length, 'موضوع') + kpi('🗓️', an.length, 'دورة') +
      kpi('📅', BAC._meta.annee_min + '→' + BAC._meta.annee_max, 'الفترة') +
      kpi('⏱️', BAC._meta.duree_officielle + ' د', 'المدة الرسمية') +
      kpi('🧩', themes.length, 'محور') + kpi('📘', (BAC.grammaire_ciblee||[]).length, 'نقطة قواعد') +
      '</div>' +
      '<div class="card"><h2>📈 تطور البكالوريا — المترشحون والمعدّل الوطني</h2>' +
      '<div class="chart-col tall">' + an.map(a =>
        '<div class="cc"><span class="cc-v' + (a.moyenne >= 10 ? ' on' : '') + '">' +
          a.moyenne.toFixed(1) + '</span>' +
        '<span class="cc-b"><i class="bac" style="height:' +
          Math.round(a.candidats / maxC * 100) + '%"></i></span>' +
        '<span class="cc-l">' + a.annee + '</span></div>').join('') + '</div>' +
      '<div class="hleg">ارتفاع العمود ∝ عدد المترشحين · الرقم أعلاه = المعدّل الوطني /20 · ' +
        'اللون الأخضر = معدّل ≥ 10</div></div>' +
      '<div class="grid2">' +
        '<div class="card"><h2>🧩 المحاور الأكثر وروداً</h2>' +
          '<div class="wlist">' + themes.slice(0, 10).map(t =>
            '<div class="wrow"><span class="wn"><b class="de-display">' + esc(t.de) + '</b>' +
            '<br><i>' + esc(t.ar) + '</i></span>' +
            '<span class="wbar"><i style="width:' +
              Math.round(t.n / (themes[0].n || 1) * 100) + '%"></i></span>' +
            '<span class="wv ok">' + t.n + '</span></div>').join('') + '</div></div>' +
        '<div class="card"><h2>🏆 الدورات الأعلى معدّلاً</h2>' +
          '<div class="wlist">' + an.slice().sort((a,b) => b.moyenne - a.moyenne).slice(0,8)
            .map(a => '<div class="wrow"><span class="wn de-in">BAC ' + a.annee + '</span>' +
            '<span class="wbar"><i style="width:' + Math.round(a.moyenne / maxM * 100) + '%"></i></span>' +
            '<span class="wv ' + (a.moyenne >= 10 ? 'ok' : 'ko') + '">' +
              a.moyenne.toFixed(2) + '</span></div>').join('') + '</div>' +
          '<button class="btn btn-g btn-block" data-go="examen" style="margin-top:13px">' +
            '🎓 افتح أرشيف البكالوريا (' + suj.length + ' موضوعاً)</button></div>' +
      '</div>';
    function kpi(i,n,l){ return '<div class="kpi"><div class="kpi-i">' + i + '</div>' +
      '<div class="kpi-n">' + n + '</div><div class="kpi-l">' + l + '</div></div>'; }
  }

  async function chargerBac(){
    try{
      const r = await fetch('assets/bdd/bac_archive.json', { cache:'force-cache' });
      if(r.ok) BAC = await r.json();
    }catch(e){}
    if(onglet === 'bac') paint();
  }

  /* ══════ 6. TABLEAU ══════ */
  function vueTableau(){
    const agg = agreger();
    let rows = Object.keys(agg).map(k => agg[k]);
    if(fRegion !== 'tous') rows = rows.filter(w => w.region === fRegion);
    rows.sort((a,b) => {
      let x, y;
      if(triCol === 'code'){ x = a.code; y = b.code; return x.localeCompare(y) * triSens; }
      if(triCol === 'nom'){ x = a.nom_ar; y = b.nom_ar; return x.localeCompare(y, 'fr') * triSens; }
      if(triCol === 'region'){ x = a.region; y = b.region; return x.localeCompare(y) * triSens; }
      if(triCol === 'corriges'){ x = a.corriges; y = b.corriges; }
      else { x = a.docs; y = b.docs; }
      return (x - y) * triSens;
    });
    const max = Math.max.apply(null, rows.map(r => r.docs).concat([1]));

    return '<div class="filters"><div class="filters-h"><b>📋 جدول الولايات الـ58</b>' +
      '<span class="result-n">' + rows.length + '</span></div>' +
      '<div class="frow"><div class="fld2"><span>🏛️ المنطقة</span><select data-stsel="region">' +
        '<option value="tous"' + (fRegion==='tous'?' selected':'') + '>كل المناطق</option>' +
        (GEO_D.regions||[]).map(r => '<option value="' + esc(r.id) + '"' +
          (fRegion===r.id?' selected':'') + '>' + esc(r.ar) + ' — ' + esc(r.id) +
          ' (' + r.nombre + ')</option>').join('') + '</select></div>' +
      '<div class="fld2"><span>📊 الترتيب</span><select data-stsel="tri">' +
        [['docs','عدد الوثائق'],['code','رمز الولاية'],['nom','الاسم'],
         ['region','المنطقة'],['corriges','التصحيحات']].map(o =>
          '<option value="' + o[0] + '"' + (triCol===o[0]?' selected':'') + '>' + o[1] + '</option>').join('') +
        '</select></div>' +
      '<div class="fld2"><span>↕️ الاتجاه</span><select data-stsel="sens">' +
        '<option value="-1"' + (triSens===-1?' selected':'') + '>تنازلي</option>' +
        '<option value="1"' + (triSens===1?' selected':'') + '>تصاعدي</option>' +
        '</select></div></div></div>' +
      '<div class="card" style="padding:0;overflow-x:auto"><table class="tble"><thead><tr>' +
        '<th>#</th><th>الرمز</th><th>الولاية</th><th>المنطقة</th><th>الوثائق</th>' +
        '<th>التوزيع</th><th>📄</th><th>📘</th><th>🎓</th><th>📚</th>' +
        '<th>مع تصحيح</th><th>🟢/🟡/🔴</th></tr></thead><tbody>' +
        rows.map((w,i) => '<tr data-w="' + esc(w.code) + '">' +
          '<td class="tc-c de-in">' + (i+1) + '</td>' +
          '<td class="tc-c de-in"><b>' + esc(w.code) + '</b></td>' +
          '<td><div class="tc-n">' + esc(w.nom_ar) + '</div>' +
            '<div class="tc-s">' + esc(w.nom_fr) + '</div></td>' +
          '<td class="tc-s">' + esc(regionAr(w.region)) + '</td>' +
          '<td class="tc-c"><b class="rep-v ' + (w.docs ? 'ok' : '') + '">' + w.docs + '</b></td>' +
          '<td><span class="wbar sm"><i style="width:' + Math.round(w.docs/max*100) + '%"></i></span></td>' +
          ['devoir','composition','bac','annales'].map(t =>
            '<td class="tc-c' + (w.types[t] ? '' : ' tc-z') + '">' + (w.types[t] || '—') + '</td>').join('') +
          '<td class="tc-c">' + (w.docs ? Math.round(w.corriges/w.docs*100) + '%' : '—') + '</td>' +
          '<td class="tc-c de-in" style="font-size:11px">' + (w.diff[1]||0) + ' / ' +
            (w.diff[2]||0) + ' / ' + (w.diff[3]||0) + '</td></tr>').join('') +
        '</tbody></table></div>' +
      '<div class="card"><div class="hleg">💡 انقر على أي سطر أو على دائرة في الخريطة لعرض ' +
        'تفاصيل الولاية · ' + rows.filter(r => r.docs === 0).length +
        ' ولاية بدون وثائق بعد</div></div>';
  }
  function regionAr(id){
    const r = (GEO_D.regions || []).filter(x => x.id === id)[0];
    return r ? r.ar : id;
  }

  /* ══════ Fiche wilaya ══════ */
  function ficheWilaya(code){
    const agg = agreger();
    const w = agg[code]; if(!w) return;
    const an = Object.keys(w.annees).sort();
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div><span class="badge composition">📍 ' + esc(w.code) +
      ' · ' + esc(w.region) + '</span>' +
      '<h2 style="margin:9px 0 3px;font-family:var(--ff-ar-display);font-size:20px">' +
        esc(w.nom_ar) + '</h2>' +
      '<div class="fiche-de de-display">' + esc(w.nom_fr) + ' · ' + w.lat + ', ' + w.lon + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' +
        '<div class="info-grid">' +
          info('📚 الوثائق', String(w.docs)) +
          info('✅ مع تصحيح', w.corriges + ' (' + (w.docs ? Math.round(w.corriges/w.docs*100) : 0) + '%)') +
          info('🗓️ السنوات', String(an.length)) +
          info('⏱️ متوسط المدة', w.docs ? Math.round(w.duree / w.docs) + ' د' : '—') +
          info('⭐ متوسط النقاط', w.nbNotes ? (w.notes / w.nbNotes).toFixed(2) + '/20' : '—') +
          info('🏛️ المنطقة', regionAr(w.region)) +
        '</div>' +
        '<h3 style="margin:15px 0 9px">📊 حسب النوع</h3>' +
        '<div class="wlist">' + Object.keys(TYPES).map(k =>
          '<div class="wrow"><span class="wn">' + TYPES[k][0] + ' ' + esc(TYPES[k][1]) + '</span>' +
          '<span class="wbar"><i style="width:' +
            Math.round((w.types[k]||0) / Math.max(1, w.docs) * 100) + '%"></i></span>' +
          '<span class="wv ok">' + (w.types[k]||0) + '</span></div>').join('') + '</div>' +
        '<h3 style="margin:15px 0 9px">🌡️ الصعوبة</h3>' +
        '<div class="diff-bar">' + [1,2,3].map(d => {
          const v = w.diff[d]||0, s = Math.max(1, (w.diff[1]||0)+(w.diff[2]||0)+(w.diff[3]||0));
          return '<span class="db d' + d + '" style="width:' + (v/s*100).toFixed(2) + '%">' +
            (v/s > 0.12 ? v : '') + '</span>';
        }).join('') + '</div>' +
        '<div class="rleg" style="margin-top:9px"><span>🟢 سهل ' + (w.diff[1]||0) + '</span>' +
          '<span>🟡 متوسط ' + (w.diff[2]||0) + '</span><span>🔴 صعب ' + (w.diff[3]||0) + '</span></div>' +
        (an.length ? '<h3 style="margin:15px 0 9px">📅 حسب السنة</h3>' +
          '<div class="wlist">' + an.map(a =>
            '<div class="wrow"><span class="wn de-in">' + esc(a) + '</span>' +
            '<span class="wbar"><i style="width:' +
              Math.round(w.annees[a] / Math.max.apply(null, an.map(x => w.annees[x])) * 100) +
              '%"></i></span><span class="wv ok">' + w.annees[a] + '</span></div>').join('') + '</div>' : '') +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:16px">' +
          '<button class="btn btn-g btn-sm" data-wil-biblio="' + esc(w.code) + '">🗂️ وثائق هذه الولاية</button>' +
          '<button class="btn btn-o btn-sm" id="mPrint">🖨️ طباعة</button>' +
        '</div>' +
      '</div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    const pr = $('#mPrint'); if(pr) pr.addEventListener('click', () => window.print());
    const bb = $('[data-wil-biblio]');
    if(bb) bb.addEventListener('click', () => {
      m.hidden = true; document.body.style.overflow = '';
      if(window.BDD && window.DZ){
        BDD.setFiltre('wilaya', bb.dataset.wilBiblio);
        DZ.go('biblio');
        toast('🗂️ المكتبة مُصفّاة على الولاية ' + bb.dataset.wilBiblio, 'ok');
      }
    });
    function info(k,v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                               '<div class="info-v">' + esc(v) + '</div></div>'; }
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-stong]');
    if(o){ onglet = o.dataset.stong;
      $$('#stOng .ong').forEach(x => x.classList.toggle('on', x.dataset.stong === onglet));
      donutArc._o = undefined;
      paint(); return; }
    const w = ev.target.closest('.wpt, [data-w]');
    if(w && w.dataset.w){ ficheWilaya(w.dataset.w); return; }
    const r = ev.target.closest('[data-region]');
    if(r){ fRegion = r.dataset.region; onglet = 'tableau';
      $$('#stOng .ong').forEach(x => x.classList.toggle('on', x.dataset.stong === 'tableau'));
      paint(); return; }
  });

  document.addEventListener('change', ev => {
    const s = ev.target.closest('[data-stsel]'); if(!s) return;
    if(s.dataset.stsel === 'region') fRegion = s.value;
    if(s.dataset.stsel === 'tri') triCol = s.value;
    if(s.dataset.stsel === 'sens') triSens = +s.value;
    paint();
  });

  document.addEventListener('mousemove', ev => {
    const p = ev.target.closest('.wpt');
    const tip = $('#stTip');
    if(!tip) return;
    if(!p){ tip.hidden = true; survol = null; return; }
    if(survol === p.dataset.w && !tip.hidden) return;
    survol = p.dataset.w;
    const agg = agreger();
    const w = agg[p.dataset.w]; if(!w) return;
    tip.innerHTML = '<b>' + esc(w.code) + ' · ' + esc(w.nom_ar) + '</b>' +
      '<span>' + esc(w.nom_fr) + ' — ' + esc(regionAr(w.region)) + '</span>' +
      '<span>📚 ' + w.docs + ' وثيقة · ✅ ' + w.corriges + ' مع تصحيح</span>';
    const wrap = $('.st-map-wrap');
    const rect = wrap ? wrap.getBoundingClientRect() : null;
    if(rect){
      tip.style.left = Math.min(Math.max(8, ev.clientX - rect.left + 14), rect.width - 190) + 'px';
      tip.style.top  = Math.max(8, ev.clientY - rect.top - 12) + 'px';
    }
    tip.hidden = false;
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'stats') boot(); });
  window.renderStats2 = boot;
  window.DZ_STATS = { boot:boot, render:render, agreger:agreger, globaux:globaux,
                      proj:proj, ficheWilaya:ficheWilaya };
})();
