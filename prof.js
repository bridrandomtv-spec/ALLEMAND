/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — prof.js
   لوحة الأستاذ · Tableau de bord professeur
   Saisie des notes (I/8 · II/8 · III/4) · readiness 10/7 ·
   statistiques par wilaya · histogramme · export CSV · journal d'audit
   Accès réservé au rôle « prof » — données 100% locales
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const K_OVERRIDE = 'dz_de_prof_notes_v1';
  const K_AUDIT    = 'dz_de_prof_audit_v1';
  const PRET = 10, CONS = 7;
  const BAR = [{p:'I', lbl:'فهم المكتوب', max:8},
               {p:'II', lbl:'اللغة',       max:8},
               {p:'III',lbl:'إنتاج كتابي', max:4}];

  let D = null, eleves = [], evals = [], meta = null;
  let onglet = 'apercu', tri = 'nom', sens = 1, q = '', fEval = 'all', fReady = 'all';

  /* ── Chargement ── */
  async function boot(){
    const box = $('#profBody'); if(!box) return;
    if(!accesAutorise()){
      box.innerHTML = '<div class="card empty"><div class="empty-i">🔒</div>' +
        '<h3>مساحة خاصة بالأساتذة</h3>' +
        '<p>هذه اللوحة محجوزة لدور <b>أستاذ</b>. سجّل الدخول بحساب أستاذ أو أنشئ حساباً ' +
        'بهذا الدور من بوابة الاتصال.</p>' +
        '<button class="btn btn-o" data-go="compte">⚙️ فتح حسابي</button></div>';
      return;
    }
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل سجلّ القسم…</div>';
      try{
        const r = await fetch('assets/bdd/eleves.json', { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
        meta = D._meta; evals = D.evaluations || [];
        eleves = (D.eleves || []).map(e => Object.assign({}, e, {
          notes: Object.assign({}, e.notes, (overrides()[e.id] || {}))
        }));
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر تحميل السجلّ : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
  }

  function accesAutorise(){
    if(!window.AUTH) return false;
    const s = AUTH.session();
    return !!(s && s.role === 'prof');
  }

  /* ── Persistance locale des saisies ── */
  function overrides(){
    try{ return JSON.parse(localStorage.getItem(K_OVERRIDE) || '{}'); }catch(e){ return {}; }
  }
  function saveOverride(elId, evId, part, val){
    const all = overrides();
    all[elId] = all[elId] || {};
    const cur = all[elId][evId] || {};
    cur[part] = val;
    all[elId][evId] = cur;
    try{ localStorage.setItem(K_OVERRIDE, JSON.stringify(all)); }catch(e){}
  }
  function audit(action, cible, detail){
    let a = [];
    try{ a = JSON.parse(localStorage.getItem(K_AUDIT) || '[]'); }catch(e){}
    a.push({ t:new Date().toISOString(), action:action, cible:cible, detail:detail || '' });
    try{ localStorage.setItem(K_AUDIT, JSON.stringify(a.slice(-200))); }catch(e){}
  }

  /* ── Moteur de notation ── */
  function noteOf(el, evId){
    const n = el.notes[evId];
    if(!n) return null;
    if(typeof n === 'object' && n.total !== undefined) return n.total;
    return null;
  }
  function calcTotal(o){
    let t = 0, complet = true;
    BAR.forEach(b => {
      const v = o[b.p];
      if(v === null || v === undefined || v === '') complet = false;
      else t += clampPartie(b.p, Number(v));
    });
    return { total: Math.round(t * 10) / 10, complet: complet };
  }
  function clampPartie(p, v){
    const b = BAR.filter(x => x.p === p)[0];
    if(!b || isNaN(v)) return 0;
    return Math.max(0, Math.min(b.max, v));
  }
  function moyenneEleve(el){
    const vals = [];
    evals.forEach(ev => {
      const t = noteOf(el, ev.id);
      if(t !== null) vals.push({ t:t, coef: ev.coef || 1 });
    });
    if(!vals.length) return null;
    let s = 0, c = 0;
    vals.forEach(v => { s += v.t * v.cof; c += v.cof; });
    return Math.round(s / c * 100) / 100;
  }
  function readiness(t){
    if(t === null || t === undefined) return { k:'non_note', l:'○ غير منقّط', c:'' };
    if(t >= PRET) return { k:'pret',         l:'✅ جاهز',        c:'ok' };
    if(t >= CONS) return { k:'a_consolider', l:'⚠️ يحتاج تثبيت', c:'mid' };
    return          { k:'non_pret',      l:'❌ غير جاهز',   c:'ko' };
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#profBody'); if(!box) return;
    const sec = D.section || {};
    box.innerHTML =
      '<div class="card prof-hero">' +
        '<div><div class="ch-badge">🔐 لوحة الأستاذ — accès ' +
          esc((window.AUTH && AUTH.session()) ? AUTH.session().nom : '') + '</div>' +
        '<h2>' + esc(sec.prof_principal || 'الأستاذ') + ' · قسم ' + esc(sec.ar || sec.id) +
          ' <span class="pill">' + (sec.effectif || eleves.length) + ' تلميذ</span></h2>' +
        '<div class="ch-sub">' + esc(sec.matiere || 'اللغة الألمانية') + ' · ' +
          esc(sec.filiere || '') + ' · ' + esc(sec.salle || '') + ' · ' +
          esc((D._meta || {}).annee_scolaire || '') + '</div></div>' +
        '<div class="ph-act">' +
          '<button class="btn btn-g btn-sm" id="pCsv">📥 تصدير CSV</button>' +
          '<button class="btn btn-o btn-sm" id="pPrint">🖨️ طباعة</button>' +
          '<button class="btn btn-o btn-sm" id="pReset">↺ إلغاء تعديلاتي</button>' +
        '</div>' +
      '</div>' +
      '<div class="onglets" id="prOng">' +
        ong('apercu','📊 نظرة عامة') + ong('eleves','👥 التلاميذ') +
        ong('saisie','✍️ إدخال النقاط') + ong('stats','📈 الإحصائيات') +
        ong('audit','🧾 السجل') +
      '</div>' +
      '<div class="privacy">🔒 <b>سرّية تامة</b> — كل التعديلات تُحفظ على جهازك فقط ' +
        '(<span class="de-in">localStorage</span>) ولا تُرسل لأي خادم. ' +
        'السلّم الرسمي : <b>I /8 · II /8 · III /4 = /20</b> · ' +
        'العتبات : <b>≥10 جاهز</b> · <b>7–9,9 يحتاج تثبيت</b> · <b>&lt;7 غير جاهز</b>.</div>' +
      '<div id="prContenu"></div>';
    paint();
  }
  function ong(id, lbl){
    return '<button class="ong' + (onglet === id ? ' on' : '') + '" data-prong="' + id + '">' + lbl + '</button>';
  }

  function paint(){
    const c = $('#prContenu'); if(!c) return;
    if(onglet === 'apercu') c.innerHTML = vueApercu();
    if(onglet === 'eleves') c.innerHTML = vueEleves();
    if(onglet === 'saisie') c.innerHTML = vueSaisie();
    if(onglet === 'stats')  c.innerHTML = vueStats();
    if(onglet === 'audit')  c.innerHTML = vueAudit();
  }

  function vueApercu(){
    const m = moyennes();
    const r = compteReadiness();
    const pres = (eleves.reduce((a,e) => a + (e.presence||0), 0) / (eleves.length||1)) * 100;
    return '' +
    '<div class="bdd-kpis">' +
      kpi('👥', eleves.length, 'تلميذ في القسم', 'Effectif') +
      kpi('📊', m.classe === null ? '—' : m.classe.toFixed(2), 'معدّل القسم /20', 'Moyenne') +
      kpi('✅', r.pret, 'تلميذ جاهز (≥10)', 'Prêts') +
      kpi('⚠️', r.a_consolider, 'يحتاج تثبيت (7–9,9)', 'À consolider') +
      kpi('❌', r.non_pret, 'غير جاهز (&lt;7)', 'Non prêts') +
      kpi('🕐', pres.toFixed(0) + '%', 'نسبة الحضور', 'Présence') +
      kpi('📝', evals.length, 'تقييم مبرمج', 'Évaluations') +
      kpi('🏆', m.max === null ? '—' : m.max.toFixed(1), 'أعلى معدّل', 'Meilleure') +
    '</div>' +
    '<div class="card"><h2>📋 التقييمات المبرمجة</h2>' +
      '<table class="bareme"><tr><th>المعرّف</th><th>النوع</th><th>العنوان</th>' +
      '<th>التاريخ</th><th>المدة</th><th>المعامل</th><th>منقّط</th><th>معدّل</th></tr>' +
      evals.map(ev => {
        const s = statsEval(ev.id);
        return '<tr><td class="de-in">' + esc(ev.id) + '</td><td>' + esc(ev.type) + '</td>' +
          '<td style="text-align:right">' + esc(ev.label) + '</td><td>' + esc(ev.date) + '</td>' +
          '<td>' + ev.duree + ' د</td><td>×' + (ev.coef||1) + '</td>' +
          '<td>' + s.n + '/' + eleves.length + '</td>' +
          '<td class="' + (s.moy >= PRET ? 'rep-v ok' : s.moy >= CONS ? 'rep-v' : 'rep-v ko') + '">' +
            (s.n ? s.moy.toFixed(2) : '—') + '</td></tr>';
      }).join('') + '</table></div>' +
    '<div class="grid2">' +
      '<div class="card"><h2>🧭 خريطة الجاهزية</h2>' + barre(r) + '</div>' +
      '<div class="card"><h2>📍 معدّلات حسب الولاية</h2>' + miniWilayas() + '</div>' +
    '</div>' +
    '<div class="card"><h2>⚡ تلاميذ يحتاجون تدخّلاً</h2>' + listeAlerte() + '</div>';
  }

  function kpi(i, n, l, de){
    return '<div class="kpi"><div class="kpi-i">' + i + '</div><div class="kpi-n">' + n +
           '</div><div class="kpi-l">' + l + '</div><div class="kpi-d">' + esc(de) + '</div></div>';
  }

  function moyennes(){
    const v = eleves.map(moyenneEleve).filter(x => x !== null);
    return { classe: v.length ? v.reduce((a,b)=>a+b,0)/v.length : null,
             max: v.length ? Math.max.apply(null, v) : null,
             min: v.length ? Math.min.apply(null, v) : null,
             n: v.length };
  }
  function compteReadiness(){
    const r = { pret:0, a_consolider:0, non_pret:0, non_note:0 };
    eleves.forEach(e => { r[readiness(moyenneEleve(e)).k]++; });
    return r;
  }
  function statsEval(id){
    const v = [];
    eleves.forEach(e => { const t = noteOf(e, id); if(t !== null) v.push(t); });
    if(!v.length) return { n:0, moy:0, min:0, max:0, pret:0, cons:0, np:0 };
    return { n:v.length,
             moy: v.reduce((a,b)=>a+b,0)/v.length,
             min: Math.min.apply(null, v), max: Math.max.apply(null, v),
             pret: v.filter(x=>x>=PRET).length,
             cons: v.filter(x=>x>=CONS && x<PRET).length,
             np:   v.filter(x=>x<CONS).length };
  }
  function barre(r){
    const tot = r.pret + r.a_consolider + r.non_pret + r.non_note || 1;
    const seg = [['ok', r.pret], ['mid', r.a_consolider], ['ko', r.non_pret], ['nn', r.non_note]];
    return '<div class="rbar">' + seg.map(s =>
      s[1] ? '<span class="rseg ' + s[0] + '" style="width:' + (s[1]/tot*100) + '%" title="' +
             s[1] + '">' + s[1] + '</span>' : '').join('') + '</div>' +
      '<div class="rleg"><span class="ok">✅ جاهز ' + r.pret + '</span>' +
      '<span class="mid">⚠️ تثبيت ' + r.a_consolider + '</span>' +
      '<span class="ko">❌ غير جاهز ' + r.non_pret + '</span>' +
      '<span class="nn">○ غير منقّط ' + r.non_note + '</span></div>';
  }
  function parWilaya(){
    const m = {};
    eleves.forEach(e => {
      const t = moyenneEleve(e);
      if(t === null) return;
      const k = e.code_wilaya;
      m[k] = m[k] || { wilaya:e.wilaya, n:0, s:0 };
      m[k].n++; m[k].s += t;
    });
    return Object.keys(m).sort().map(k => ({
      code:k, wilaya:m[k].wilaya, n:m[k].n, moy: m[k].s / m[k].n }));
  }
  function miniWilayas(){
    const w = parWilaya();
    const mx = Math.max.apply(null, w.map(x => x.moy).concat([20]));
    return '<div class="wlist">' + w.map(x =>
      '<div class="wrow"><span class="wn">' + x.code + ' · ' + esc(x.wilaya) + '</span>' +
      '<span class="wbar"><i style="width:' + (x.moy/mx*100) + '%"></i></span>' +
      '<span class="wv' + (x.moy >= PRET ? ' ok' : x.moy >= CONS ? ' mid' : ' ko') + '">' +
        x.moy.toFixed(2) + '</span><span class="wc">' + x.n + ' ت</span></div>').join('') + '</div>';
  }
  function listeAlerte(){
    const al = eleves.map(e => ({ e:e, m:moyenneEleve(e) }))
      .filter(x => x.m !== null && x.m < PRET)
      .sort((a,b) => a.m - b.m);
    if(!al.length) return '<p style="color:var(--g);font-size:13.5px">✅ لا يوجد تلميذ تحت العتبة — القسم كله جاهز.</p>';
    return '<div class="alert-list">' + al.slice(0, 10).map(x => {
      const r = readiness(x.m);
      return '<div class="alert-i" data-eleve="' + esc(x.e.id) + '">' +
        '<div><b>' + esc(x.e.nom_complet) + '</b>' +
        '<div style="font-size:11.5px;color:var(--m)">' + esc(x.e.matricule) + ' · ' +
          esc(x.e.ville) + ' · حضور ' + Math.round((x.e.presence||0)*100) + '%</div></div>' +
        '<div style="text-align:left"><div class="rep-v ' + r.c + '">' + x.m.toFixed(2) + '/20</div>' +
        '<div style="font-size:11px">' + r.l + '</div></div></div>';
    }).join('') + (al.length > 10 ?
      '<div style="text-align:center;color:var(--m);font-size:12px;margin-top:9px">+ ' +
      (al.length - 10) + ' تلميذ آخر</div>' : '') + '</div>';
  }

  function vueEleves(){
    const list = filtrer();
    return '<div class="filters"><div class="filters-h"><b>👥 سجلّ التلاميذ</b>' +
      '<span class="result-n">' + list.length + '</span></div>' +
      '<div class="frow"><div class="fld2 search-bar"><span>🔍 بحث</span>' +
        '<input id="pQ" type="search" value="' + esc(q) + '" placeholder="الاسم · الرقم · المدينة…">' +
        '<span class="s-ico">🔍</span></div>' +
      '<div class="fld2"><span>📋 الترتيب</span><select id="pTri">' +
        opt('nom','الاسم',tri) + opt('moyenne','المعدّل',tri) + opt('presence','الحضور',tri) +
        opt('points','النقاط',tri) + opt('wilaya','الولاية',tri) +
      '</select></div>' +
      '<div class="fld2"><span>🧭 الجاهزية</span><select id="pReady">' +
        opt('all','الكل',fReady) + opt('pret','✅ جاهز',fReady) +
        opt('a_consolider','⚠️ يحتاج تثبيت',fReady) + opt('non_pret','❌ غير جاهز',fReady) +
        opt('non_note','○ غير منقّط',fReady) +
      '</select></div></div></div>' +
      '<div class="card" style="padding:0;overflow-x:auto"><table class="tble"><thead><tr>' +
        '<th>التلميذ</th><th>القسم / الولاية</th><th>الحضور</th>' +
        evals.map(ev => '<th>' + esc(ev.type) + '<br><span class="thd">' + esc(ev.id) + '</span></th>').join('') +
        '<th>المعدّل</th><th>الجاهزية</th></tr></thead><tbody>' +
        list.map(ligneEleve).join('') + '</tbody></table></div>' +
      (list.length ? '' : '<div class="card empty"><div class="empty-i">🔍</div><p>لا نتائج</p></div>');
  }
  function opt(v,l,sel){ return '<option value="' + v + '"' + (sel===v?' selected':'') + '>' + l + '</option>'; }

  function ligneEleve(e){
    const m = moyenneEleve(e), r = readiness(m);
    return '<tr data-eleve="' + esc(e.id) + '">' +
      '<td><div class="tc-n">' + esc(e.nom_complet) + '</div>' +
        '<div class="tc-s">' + esc(e.matricule) + '</div></td>' +
      '<td><div class="tc-n">' + esc(e.section) + '</div><div class="tc-s">' +
        e.code_wilaya + ' · ' + esc(e.ville) + '</div></td>' +
      '<td><div class="tc-n ' + ((e.presence||0) >= 0.85 ? 'ok' : (e.presence||0) >= 0.7 ? 'mid' : 'ko') + '">' +
        Math.round((e.presence||0)*100) + '%</div>' +
        '<div class="tc-s">' + (e.absences||0) + ' غياب · ' + (e.retards||0) + ' تأخّر</div></td>' +
      evals.map(ev => {
        const t = noteOf(e, ev.id);
        const rr = readiness(t);
        return '<td class="tc-c"><span class="tnote ' + rr.c + '">' +
          (t === null ? '—' : t.toFixed(1)) + '</span></td>';
      }).join('') +
      '<td class="tc-c"><b class="rep-v ' + r.c + '">' + (m === null ? '—' : m.toFixed(2)) + '</b></td>' +
      '<td class="tc-c"><span class="rchip ' + r.c + '">' + r.l + '</span></td></tr>';
  }

  function vueSaisie(){
    const ev = evals.filter(x => x.id === fEval)[0] || evals[0] || null;
    let h = '<div class="filters"><div class="filters-h"><b>✍️ إدخال النقاط — السلّم الرسمي /20</b></div>' +
      '<div class="frow"><div class="fld2"><span>📝 التقييم</span><select id="pEval">' +
      evals.map(x => '<option value="' + esc(x.id) + '"' + (ev && x.id === ev.id ? ' selected' : '') + '>' +
        esc(x.type) + ' — ' + esc(x.label) + ' (' + esc(x.date) + ')</option>').join('') +
      '</select></div></div></div>';
    if(!ev) return h + '<div class="card empty"><p>لا توجد تقييمات.</p></div>';

    const s = statsEval(ev.id);
    h += '<div class="card"><h2>' + esc(ev.label) + ' <span class="pill de-in">' + esc(ev.id) + '</span></h2>' +
      '<div class="info-grid">' +
        info('📅 التاريخ', ev.date) + info('⏱️ المدة', ev.duree + ' دقيقة') +
        info('🧮 المعامل', '×' + (ev.coef||1)) + info('👥 منقّط', s.n + '/' + eleves.length) +
        info('📊 المعدّل', s.n ? s.moy.toFixed(2) + '/20' : '—') +
        info('🏆 المدى', s.n ? s.min.toFixed(1) + ' → ' + s.max.toFixed(1) : '—') +
      '</div>' +
      '<div class="bareme-strip">' + BAR.map(b =>
        '<span class="bs"><b class="de-in">' + b.p + '</b> ' + b.lbl + ' <i>/' + b.max + '</i></span>').join('') +
        '<span class="bs tot"><b>= /20</b></span></div></div>';

    h += '<div class="card" style="padding:0;overflow-x:auto"><table class="tble saisie"><thead><tr>' +
      '<th>التلميذ</th>' +
      BAR.map(b => '<th>' + esc(b.lbl) + '<br><span class="thd">' + b.p + ' / ' + b.max + '</span></th>').join('') +
      '<th>المجموع</th><th>الجاهزية</th><th>ملاحظة الأستاذ</th></tr></thead><tbody>' +
      eleves.map(e => ligneSaisie(e, ev.id)).join('') + '</tbody></table></div>';
    h += '<div class="card"><div style="display:flex;gap:9px;flex-wrap:wrap">' +
      '<button class="btn btn-p" id="pSave">💾 حفظ كل النقاط</button>' +
      '<button class="btn btn-g" id="pCsvEval">📥 تصدير هذا التقييم (CSV)</button>' +
      '<button class="btn btn-o" id="pMail">📩 توليد رسائل الأولياء</button></div>' +
      '<div id="pSaveMsg"></div></div>';
    return h;
  }

  function ligneSaisie(e, evId){
    const n = e.notes[evId] || {};
    const has = n && n.total !== undefined ? n : {};
    const t = noteOf(e, evId), r = readiness(t);
    return '<tr data-row="' + esc(e.id) + '">' +
      '<td><div class="tc-n">' + esc(e.nom_complet) + '</div>' +
        '<div class="tc-s">' + esc(e.matricule) + '</div></td>' +
      BAR.map(b => {
        const v = (has[b.p] !== undefined && has[b.p] !== null) ? has[b.p] : '';
        return '<td class="tc-c"><input class="ninp" type="number" step="0.5" min="0" max="' + b.max +
          '" value="' + v + '" data-e="' + esc(e.id) + '" data-ev="' + esc(evId) +
          '" data-p="' + b.p + '" placeholder="0-' + b.max + '"></td>';
      }).join('') +
      '<td class="tc-c"><b class="rep-v ' + r.c + '" id="tot_' + esc(e.id) + '">' +
        (t === null ? '—' : t.toFixed(1)) + '</b></td>' +
      '<td class="tc-c"><span class="rchip ' + r.c + '" id="rd_' + esc(e.id) + '">' + r.l + '</span></td>' +
      '<td><input class="cinp" type="text" value="' + esc(has.note_prof || '') + '" ' +
        'data-appr="' + esc(e.id) + '" placeholder="ملاحظة…"></td></tr>';
  }

  function vueStats(){
    const m = moyennes(), r = compteReadiness();
    const hist = histogramme();
    return '' +
    '<div class="grid2">' +
      '<div class="card"><h2>📈 توزيع المعدّلات</h2>' + hist + '</div>' +
      '<div class="card"><h2>🧭 الجاهزية العامة</h2>' + barre(r) +
        '<div class="info-grid" style="margin-top:14px">' +
          info('👥 منقّطون', m.n + ' / ' + eleves.length) +
          info('📊 المعدّل', m.classe === null ? '—' : m.classe.toFixed(2)) +
          info('🏆 الأعلى', m.max === null ? '—' : m.max.toFixed(2)) +
          info('📉 الأدنى', m.min === null ? '—' : m.min.toFixed(2)) +
        '</div></div>' +
    '</div>' +
    '<div class="card"><h2>📍 الإحصائيات حسب الولاية</h2>' + tableWilaya() + '</div>' +
    '<div class="card"><h2>📝 الإحصائيات حسب التقييم</h2>' + tableEval() + '</div>' +
    '<div class="card"><h2>🕐 الحضور والانضباط</h2>' + tablePresence() + '</div>';
  }

  function histogramme(){
    const pal = [[0,5],[5,7],[7,10],[10,12],[12,14],[14,16],[16,18],[18,20.01]];
    const v = eleves.map(moyenneEleve).filter(x => x !== null);
    const cnt = pal.map(p => v.filter(x => x >= p[0] && x < p[1]).length);
    const mx = Math.max.apply(null, cnt.concat([1]));
    return '<div class="histo">' + pal.map((p,i) =>
      '<div class="hcol"><span class="hv' + (cnt[i] ? ' on' : '') + '">' + (cnt[i]||'') + '</span>' +
      '<span class="hb"><i style="height:' + (cnt[i]/mx*100) + '%"></i></span>' +
      '<span class="hl">' + p[0] + '–' + (p[1] > 20 ? 20 : p[1]) + '</span></div>').join('') + '</div>' +
      '<div class="hleg">توزيع ' + v.length + ' تلميذ منقّط حسب المعدّل العام /20</div>';
  }

  function tableWilaya(){
    const w = parWilaya();
    return '<table class="bareme"><tr><th>الرمز</th><th>الولاية</th><th>التلاميذ</th>' +
      '<th>المعدّل</th><th>الجاهزية</th><th>التوزيع</th></tr>' +
      w.map(x => {
        const r = readiness(x.moy);
        return '<tr><td class="de-in">' + x.code + '</td><td>' + esc(x.wilaya) + '</td>' +
        '<td>' + x.n + '</td><td class="rep-v ' + r.c + '">' + x.moy.toFixed(2) + '</td>' +
        '<td>' + r.l + '</td><td><span class="wbar sm"><i style="width:' +
          (x.moy/20*100) + '%"></i></span></td></tr>';
      }).join('') + '</table>';
  }
  function tableEval(){
    return '<table class="bareme"><tr><th>التقييم</th><th>منقّط</th><th>المعدّل</th>' +
      '<th>الأدنى</th><th>الأعلى</th><th>✅ جاهز</th><th>⚠️ تثبيت</th><th>❌ غير جاهز</th></tr>' +
      evals.map(ev => {
        const s = statsEval(ev.id);
        return '<tr><td style="text-align:right"><b>' + esc(ev.type) + '</b> ' + esc(ev.label) + '</td>' +
        '<td>' + s.n + '</td><td class="rep-v' + (s.n && s.moy < PRET ? ' ko' : ' ok') + '">' +
          (s.n ? s.moy.toFixed(2) : '—') + '</td>' +
        '<td>' + (s.n ? s.min.toFixed(1) : '—') + '</td><td>' + (s.n ? s.max.toFixed(1) : '—') + '</td>' +
        '<td>' + s.pret + '</td><td>' + s.cons + '</td><td>' + s.np + '</td></tr>';
      }).join('') + '</table>';
  }
  function tablePresence(){
    const tri2 = eleves.slice().sort((a,b) => (a.presence||0) - (b.presence||0));
    const faibles = tri2.slice(0, 8);
    return '<div class="info-grid">' +
      info('🕐 متوسّط الحضور', (eleves.reduce((a,e)=>a+(e.presence||0),0)/(eleves.length||1)*100).toFixed(1) + '%') +
      info('❌ مجموع الغيابات', String(eleves.reduce((a,e)=>a+(e.absences||0),0))) +
      info('⏰ مجموع التأخّرات', String(eleves.reduce((a,e)=>a+(e.retards||0),0))) +
      info('📚 حصص مكتملة', String(eleves.reduce((a,e)=>a+(e.seances_terminees||0),0))) +
      info('⏱️ محاكيات', String(eleves.reduce((a,e)=>a+(e.simulations||0),0))) +
      '</div><h3 style="margin:14px 0 9px">⚠️ أضعف 8 نسب حضور</h3>' +
      '<table class="bareme"><tr><th>التلميذ</th><th>الحضور</th><th>غياب</th><th>تأخّر</th>' +
      '<th>المعدّل</th></tr>' + faibles.map(e => {
        const m = moyenneEleve(e), r = readiness(m);
        return '<tr><td style="text-align:right">' + esc(e.nom_complet) + '</td>' +
          '<td class="rep-v ko">' + Math.round((e.presence||0)*100) + '%</td>' +
          '<td>' + (e.absences||0) + '</td><td>' + (e.retards||0) + '</td>' +
          '<td class="rep-v ' + r.c + '">' + (m === null ? '—' : m.toFixed(2)) + '</td></tr>';
      }).join('') + '</table>';
  }

  function vueAudit(){
    let a = [];
    try{ a = JSON.parse(localStorage.getItem(K_AUDIT) || '[]'); }catch(e){}
    const ov = overrides();
    const nb = Object.keys(ov).reduce((s,k) => s + Object.keys(ov[k]).length, 0);
    return '<div class="card"><h2>🧾 سجلّ العمليات</h2>' +
      '<div class="info-grid">' +
        info('✍️ تعديلات محفوظة', String(nb)) +
        info('📜 عمليات مسجّلة', String(a.length)) +
        info('🔒 التخزين', 'localStorage (محلي)') +
        info('👤 الأستاذ', (window.AUTH && AUTH.session()) ? AUTH.session().nom : '—') +
      '</div>' +
      (a.length ? '<table class="bareme" style="margin-top:13px"><tr><th>التوقيت</th>' +
        '<th>العملية</th><th>الهدف</th><th>التفاصيل</th></tr>' +
        a.slice(-40).reverse().map(x => '<tr><td class="de-in">' + esc(x.t.replace('T',' ').slice(0,19)) +
          '</td><td>' + esc(x.action) + '</td><td>' + esc(x.cible) + '</td><td>' +
          esc(x.detail) + '</td></tr>').join('') + '</table>'
        : '<p style="color:var(--m);font-size:13px;margin-top:11px">لا توجد عمليات بعد.</p>') +
      '</div>';
  }

  function info(k,v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                             '<div class="info-v">' + esc(v == null ? '—' : v) + '</div></div>'; }

  /* ── Filtrage / tri ── */
  function filtrer(){
    const t = q.trim().toLowerCase();
    let l = eleves.filter(e => {
      if(t){
        const hay = (e.nom_complet + ' ' + e.matricule + ' ' + e.ville + ' ' + e.wilaya +
                     ' ' + e.section + ' ' + (e.email||'')).toLowerCase();
        if(hay.indexOf(t) === -1) return false;
      }
      if(fReady !== 'all' && readiness(moyenneEleve(e)).k !== fReady) return false;
      return true;
    });
    l.sort((a,b) => {
      let x, y;
      if(tri === 'nom'){ x = a.nom_complet; y = b.nom_complet; return x.localeCompare(y,'fr') * sens; }
      if(tri === 'wilaya'){ x = a.code_wilaya; y = b.code_wilaya; return x.localeCompare(y) * sens; }
      if(tri === 'points'){ x = a.points||0; y = b.points||0; }
      else if(tri === 'presence'){ x = a.presence||0; y = b.presence||0; }
      else { x = moyenneEleve(a); y = moyenneEleve(b);
             x = x === null ? -1 : x; y = y === null ? -1 : y; }
      return (y - x) * sens;
    });
    return l;
  }

  /* ── Export CSV ── */
  function toCSV(onlyEval){
    const sep = ';';
    const head = ['matricule','id','nom','prenom','section','niveau','filiere',
                  'code_wilaya','wilaya','ville','lycee_origine','telephone_parent',
                  'presence_pct','absences','retards','points','seances_terminees','simulations'];
    const evs = onlyEval ? evals.filter(e => e.id === onlyEval) : evals;
    evs.forEach(ev => { head.push(ev.id + '_I', ev.id + '_II', ev.id + '_III',
                                  ev.id + '_total', ev.id + '_readiness'); });
    head.push('moyenne_generale','readiness','appreciation');
    const rows = [head.join(sep)];
    filtrer().forEach(e => {
      const r = [e.matricule, e.id, e.nom, e.prenom, e.section, e.niveau, e.filiere,
                 e.code_wilaya, e.wilaya, e.ville, e.lycee_origine, e.telephone_parent,
                 Math.round((e.presence||0)*100), e.absences||0, e.retards||0,
                 e.points||0, e.seances_terminees||0, e.simulations||0];
      evs.forEach(ev => {
        const n = e.notes[ev.id];
        if(n && n.total !== undefined){
          r.push(n.I, n.II, n.III, n.total, readiness(n.total).k);
        } else { r.push('', '', '', '', 'non_note'); }
      });
      const m = moyenneEleve(e);
      r.push(m === null ? '' : m.toFixed(2), readiness(m).k, e.appreciation || '');
      rows.push(r.map(csvCell).join(sep));
    });
    return '\uFEFF' + rows.join('\r\n');   /* BOM UTF-8 pour Excel */
  }
  function csvCell(v){
    const s = String(v == null ? '' : v);
    return /[;"\r\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }
  function telecharger(txt, nom){
    try{
      const blob = new Blob([txt], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nom;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      if(window.DZ && DZ.toast) DZ.toast('📥 تم تنزيل ' + nom, 'ok');
      audit('export_csv', nom, String(txt.split('\r\n').length - 1) + ' lignes');
    }catch(e){ if(window.DZ && DZ.toast) DZ.toast('⚠️ تعذّر التصدير','ko'); }
  }

  /* ── Événements ── */
  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-prong]');
    if(o){ onglet = o.dataset.prong;
      $$('.ong').forEach(x => x.classList.toggle('on', x.dataset.prong === onglet));
      paint(); return; }
    if(ev.target.closest('#pCsv')){
      telecharger(toCSV(null), 'notes-2AS3-allemand-' + Date.now() + '.csv'); return; }
    if(ev.target.closest('#pCsvEval')){
      telecharger(toCSV(fEval), 'notes-' + fEval + '-' + Date.now() + '.csv'); return; }
    if(ev.target.closest('#pPrint')){ window.print(); return; }
    if(ev.target.closest('#pReset')){
      if(!confirm('إلغاء كل تعديلاتك المحلية والعودة إلى السجلّ الأصلي؟')) return;
      try{ localStorage.removeItem(K_OVERRIDE); }catch(e){}
      const ov = {};
      eleves.forEach(e => { e.notes = Object.assign({}, (D.eleves.filter(x=>x.id===e.id)[0]||{}).notes); });
      audit('reset', 'tous', 'retour au registre original');
      paint(); if(window.DZ && DZ.toast) DZ.toast('↺ تم إلغاء التعديلات','ok');
      return; }
    if(ev.target.closest('#pSave')){ saveAll(); return; }
    if(ev.target.closest('#pMail')){ genererMessages(); return; }
    const al = ev.target.closest('[data-eleve]');
    if(al && !ev.target.closest('input')){
      fEval = evals[0] ? evals[0].id : fEval;
      onglet = 'saisie';
      $$('.ong').forEach(x => x.classList.toggle('on', x.dataset.prong === 'saisie'));
      paint();
      const inp = $('#pEval'); if(inp){ inp.value = fEval; }
      setTimeout(() => {
        const row = $('[data-row="' + al.dataset.eleve + '"]');
        if(row) row.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 90);
      return; }
  });

  document.addEventListener('input', ev => {
    const t = ev.target.closest('.ninp');
    if(!t) return;
    recalcLigne(t);
  });
  document.addEventListener('change', ev => {
    const t = ev.target.closest('.ninp');
    if(t){ recalcLigne(t, true); return; }
    const s = ev.target.closest('#pEval');
    if(s){ fEval = s.value; paint(); return; }
    const tr = ev.target.closest('#pTri');
    if(tr){ tri = tr.value; paint(); return; }
    const rd = ev.target.closest('#pReady');
    if(rd){ fReady = rd.value; paint(); return; }
  });

  function recalcLigne(inp, commit){
    const row = inp.closest('[data-row]'); if(!row) return;
    const eId = inp.dataset.e, evId = inp.dataset.ev;
    const o = {};
    BAR.forEach(b => {
      const f = row.querySelector('.ninp[data-p="' + b.p + '"]');
      o[b.p] = f && f.value !== '' ? clampPartie(b.p, Number(f.value)) : null;
      if(f && f.value !== '') f.classList.remove('ko');
      if(f && Number(f.value) > b.max){ f.classList.add('ko'); }
    });
    const r = calcTotal(o);
    const rr = readiness(r.complet ? r.total : null);
    const tot = $('#tot_' + eId, row), chip = $('#rd_' + eId, row);
    if(tot){ tot.textContent = r.complet ? r.total.toFixed(1) : '—'; tot.className = 'rep-v ' + rr.c; }
    if(chip){ chip.textContent = rr.l; chip.className = 'rchip ' + rr.c; }
    if(commit && r.complet){
      saveOverride(eId, evId, null, null);          /* nettoyage éventuel */
      const all = overrides();
      all[eId] = all[eId] || {};
      all[eId][evId] = Object.assign({}, all[eId][evId], o, { total:r.total });
      try{ localStorage.setItem(K_OVERRIDE, JSON.stringify(all)); }catch(e){}
      const el = eleves.filter(x => x.id === eId)[0];
      if(el){ el.notes[evId] = Object.assign({}, el.notes[evId], o, { total:r.total }); }
      audit('note', eId + '/' + evId, 'I=' + o.I + ' II=' + o.II + ' III=' + o.III +
           ' → ' + r.total + '/20 (' + rr.k + ')');
    }
  }

  function saveAll(){
    let n = 0, invalide = 0;
    $$('.ninp').forEach(inp => {
      const row = inp.closest('[data-row]');
      const o = {};
      BAR.forEach(b => {
        const f = row.querySelector('.ninp[data-p="' + b.p + '"]');
        o[b.p] = f && f.value !== '' ? clampPartie(b.p, Number(f.value)) : null;
      });
      if(o.I === null && o.II === null && o.III === null) return;
      if(o.I === null || o.II === null || o.III === null){ invalide++; return; }
      const eId = inp.dataset.e, evId = inp.dataset.ev;
      const r = calcTotal(o);
      const all = overrides();
      all[eId] = all[eId] || {};
      all[eId][evId] = Object.assign({}, all[eId][evId], o, { total:r.total });
      try{ localStorage.setItem(K_OVERRIDE, JSON.stringify(all)); }catch(e){}
      const el = eleves.filter(x => x.id === eId)[0];
      if(el) el.notes[evId] = Object.assign({}, el.notes[evId], o, { total:r.total });
      n++;
    });
    $$('.cinp').forEach(inp => {
      const eId = inp.dataset.appr;
      const el = eleves.filter(x => x.id === eId)[0];
      if(el){ el.appreciation = inp.value; }
    });
    audit('save_all', fEval, n + ' notes enregistrées' + (invalide ? ' · ' + invalide + ' incomplètes' : ''));
    const msg = $('#pSaveMsg');
    if(msg) msg.innerHTML = '<div class="fbk show ' + (invalide ? 'ko' : 'ok') + '">' +
      (invalide ? '⚠️ ' : '✅ ') + n + ' نقطة محفوظة محلياً' +
      (invalide ? ' · ' + invalide + ' سطر ناقص (يجب ملء I و II و III)' : '') + '</div>';
    if(window.DZ && DZ.toast) DZ.toast('💾 ' + n + ' نقطة محفوظة', 'ok');
  }

  function genererMessages(){
    const al = eleves.map(e => ({ e:e, m:moyenneEleve(e) }))
      .filter(x => x.m !== null && x.m < PRET).sort((a,b) => a.m - b.m);
    if(!al.length){ if(window.DZ && DZ.toast) DZ.toast('✅ لا توجد حالات تستدعي مراسلة','ok'); return; }
    const txt = al.map(x =>
      'ولي التلميذ(ة) ' + x.e.nom_complet + ' (' + x.e.matricule + ') — قسم ' + x.e.section + '\n' +
      'المعدّل : ' + x.m.toFixed(2) + '/20 · الجاهزية : ' + readiness(x.m).l + '\n' +
      'الحضور : ' + Math.round((x.e.presence||0)*100) + '% · هاتف : ' + x.e.telephone_parent + '\n' +
      'ملاحظة الأستاذ : ' + (x.e.appreciation || '—')).join('\n\n');
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div><h2 style="margin:0;font-family:var(--ff-ar-display)">' +
      '📩 رسائل الأولياء — ' + al.length + ' حالة</h2>' +
      '<div class="fiche-de">تلاميذ تحت عتبة الجاهزية (10/20)</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b"><textarea class="txt-in" style="min-height:280px" id="mailTxt">' +
      esc(txt) + '</textarea>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:13px">' +
      '<button class="btn btn-o btn-sm" id="mailCopy">📋 نسخ</button>' +
      '<button class="btn btn-g btn-sm" id="mailDl">📥 تنزيل .txt</button>' +
      '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" href="https://wa.me/213555577931?text=' +
      encodeURIComponent('السلام عليكم، تقرير عن تلاميذ يحتاجون متابعة.') + '">💬 واتساب</a></div>' +
      '<div class="privacy" style="margin-top:13px">🔒 أرقام الأولياء تبقى على جهازك — لا تُرسل لأي خادم.</div></div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    audit('messages_parents', String(al.length), 'génération du rapport');
    const cp = $('#mailCopy');
    if(cp) cp.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#mailTxt').value);
        if(window.DZ && DZ.toast) DZ.toast('📋 نُسخ','ok'); }catch(e){}
    });
    const dl = $('#mailDl');
    if(dl) dl.addEventListener('click', () => {
      const b = new Blob([$('#mailTxt').value], { type:'text/plain;charset=utf-8' });
      const u = URL.createObjectURL(b), a = document.createElement('a');
      a.href = u; a.download = 'rapport-parents-2AS3.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 1200);
    });
  }

  document.addEventListener('dz:view', e => { if(e.detail === 'profboard') boot(); });
  window.renderProfBoard = boot;
  window.DZ_PROF = { boot:boot, render:render, toCSV:toCSV, moyenneEleve:moyenneEleve,
                     readiness:readiness, accesAutorise:accesAutorise, PRET:PRET, CONS:CONS };
})();
