/* ══════════════════════════════════════════════════════════════
   برنامج الأصل — DEUTSCH-DZ-APP · modules.js
   Module 1 : محاكاة الفرض (chronométrée, correction /20, résultat secret)
   Module 2 : فضاء الأولياء (rapport hebdomadaire + WhatsApp)
   Dépend de app.js (window.DZ)
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  if(!window.DZ){ console.error('[modules.js] app.js non chargé'); return; }
  const DZ = window.DZ;
  const { $, $$, load, store, esc, toast, LS, WA_NUMBER } = DZ;
  /* DEVOIR et SEANCES sont commutables (multi-unités) → accès dynamique */
  const devoir = () => DZ.DEVOIR;
  const DEVOIR = new Proxy({}, { get: (t, k) => {
    if (k === 'parties') return devoir().parties;
    return devoir()[k];
  }});

  /* ══════════════ MODULE 1 — SIMULATION CHRONOMÉTRÉE ══════════════ */
  const MODES = [
    { id:'reel',  i:'⏱️', t:'وضع حقيقي',  d:'45 دقيقة — مثل يوم الفرض تماماً', s:45 * 60 },
    { id:'mini',  i:'⚡',  t:'وضع مصغّر', d:'10 دقائق — مراجعة سريعة',       s:10 * 60 }
  ];

  const SIM = {
    mode   : null,
    left   : 0,
    tick   : null,
    answers: {},
    started: false
  };

  /* Banc de questions objectivable (tiré du devoir officiel) */
  function bank(){
    const out = [];
    DEVOIR.parties.forEach(p => p.questions.forEach(q => {
      if(q.type === 'vf' || q.type === 'qcm' || q.type === 'txt') out.push(Object.assign({part:p.id}, q));
    }));
    return out;
  }

  function ptsMaxAuto(){ return bank().reduce((a, q) => a + q.pts, 0); }

  function renderSim(){
    const box = $('#simBody'); if(!box) return;
    const hist = load(LS.sim, {best:null, tries:[], secret:true});

    let h = '<div class="privacy">🔒 <b>منهج الحصة 7 :</b> نتيجتك تبقى <b>سرّية</b> — '
          + 'تُخزَّن على جهازك فقط (<span class="de-in">localStorage</span>) ولا تُنشر أبداً.</div>';

    h += '<div class="sim-modes">' + MODES.map(m =>
         '<div class="mode' + (SIM.mode === m.id ? ' on' : '') + '" data-mode="' + m.id + '">'
       + '<div class="mode-i">' + m.i + '</div><div class="mode-t">' + m.t + '</div>'
       + '<div class="mode-d">' + m.d + '</div></div>').join('') + '</div>';

    if(!SIM.started){
      h += '<div class="card"><h2>📋 تعليمات المحاكاة</h2><ul style="margin:0 20px;font-size:13.5px;color:var(--m)">'
         + '<li>اختر الوضع ثم اضغط «ابدأ»</li>'
         + '<li>المؤقّت يعمل — لا يمكن الإيقاف المؤقت</li>'
         + '<li>عند انتهاء الوقت يُصحَّح الفرض آلياً</li>'
         + '<li>التصحيح حسب السلّم الرسمي (/20)</li></ul>'
         + '<button class="btn btn-g btn-block" id="btnStart"' + (SIM.mode ? '' : ' disabled') + '>🚀 ابدأ المحاكاة</button></div>';

      h += '<div class="card"><h2>📊 سجّل نتائجك</h2>';
      if(!hist.tries || !hist.tries.length){
        h += '<p style="color:var(--m);font-size:13.5px">لا توجد محاولات بعد.</p>';
      } else {
        h += '<table class="bareme"><tr><th>#</th><th>الوضع</th><th>النتيجة</th><th>التاريخ</th></tr>'
           + hist.tries.slice(-8).reverse().map((t, i) =>
               '<tr><td>' + (hist.tries.length - i) + '</td><td>' + (t.mode === 'reel' ? '⏱️ حقيقي' : '⚡ مصغّر')
             + '</td><td class="' + (t.note >= 10 ? 'rep-v ok' : 'rep-v ko') + '">' + t.note + '/20</td>'
             + '<td>' + t.date + '</td></tr>').join('') + '</table>';
      }
      h += '<div style="margin-top:13px;display:flex;gap:9px;flex-wrap:wrap">'
         + '<button class="btn btn-o btn-sm" id="btnExport">📤 تصدير النتيجة (للأستاذ)</button>'
         + '<button class="btn btn-r btn-sm" id="btnReset">🗑️ حذف السجل</button></div></div>';
      box.innerHTML = h;
      return;
    }

    /* ── Épreuve en cours ── */
    h += '<div class="timer"><div><b>' + (SIM.mode === 'reel' ? '⏱️ وضع حقيقي' : '⚡ وضع مصغّر') + '</b>'
       + '<div style="font-size:11.5px;color:var(--m)">فرض الوحدة 1 — /20</div></div>'
       + '<div class="timer-t" id="clock">' + fmt(SIM.left) + '</div>'
       + '<button class="btn btn-g btn-sm" id="btnSubmit">📤 سلّم الورقة</button></div>';

    h += '<div class="card" id="simPaper">';
    DEVOIR.parties.forEach(p => {
      const qs = p.questions.filter(q => q.type !== 'redac');
      if(!qs.length) return;
      h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + p.t + '</b>'
         + '<span class="note">' + p.pts + ' pts</span></div><div class="part-b">';
      if(p.texte) h += p.texte;
      qs.forEach(q => {
        h += '<div class="q" data-sq="' + q.id + '"><div class="q-t"><span class="q-n">' + q.id + '</span>'
           + q.t + ' <span class="note" style="font-size:11px">' + q.pts + ' pt' + (q.pts > 1 ? 's' : '') + '</span></div>';
        if(q.type === 'vf'){
          h += '<div class="opts">' + ['Richtig (صحيح)','Falsch (خطأ)'].map((o, i) =>
               '<button class="opt" data-svf="' + i + '">' + o + '</button>').join('') + '</div>';
        } else if(q.type === 'qcm'){
          h += '<div class="opts">' + q.opts.map((o, i) =>
               '<button class="opt" data-sqcm="' + i + '">' + esc(o) + '</button>').join('') + '</div>';
        } else {
          h += '<input class="txt-in" style="min-height:44px" data-stxt="' + q.id + '" placeholder="…">';
        }
        h += '</div>';
      });
      h += '</div></div>';
    });
    h += '</div>';
    box.innerHTML = h;
    startClock();
  }

  function fmt(sec){
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startClock(){
    clearInterval(SIM.tick);
    SIM.tick = setInterval(() => {
      SIM.left--;
      const c = $('#clock');
      if(c){
        c.textContent = fmt(SIM.left);
        c.className = 'timer-t' + (SIM.left <= 60 ? ' dang' : (SIM.left <= 300 ? ' warn' : ''));
      }
      if(SIM.left <= 0){ clearInterval(SIM.tick); toast('⏰ انتهى الوقت!','ko'); corriger(true); }
    }, 1000);
  }

  function startSim(){
    const m = MODES.filter(x => x.id === SIM.mode)[0]; if(!m) return;
    SIM.left = m.s; SIM.started = true; SIM.answers = {};
    renderSim();
    toast('🚀 بدأت المحاكاة — بالتوفيق!', 'ok');
  }

  /* ── Correction automatique selon le barème officiel ── */
  function corriger(auto){
    clearInterval(SIM.tick);
    /* Récupération des réponses texte encore dans le DOM */
    $$('[data-stxt]').forEach(i => { if(i.value.trim()) SIM.answers[i.dataset.stxt] = i.value.trim(); });

    let score = 0, maxAuto = 0, detail = [];

    bank().forEach(q => {
      maxAuto += q.pts;
      const a = SIM.answers[q.id];
      let ok = false, got = '';

      if(q.type === 'vf'){
        ok = a !== undefined && ((+a === 0) === (q.rep === 'Richtig'));
        got = a === undefined ? '—' : (+a === 0 ? 'Richtig' : 'Falsch');
      } else if(q.type === 'qcm'){
        ok = a !== undefined && +a === q.a;
        got = a === undefined ? '—' : q.opts[+a];
      } else if(q.type === 'txt'){
        const norm = String(a || '').toLowerCase()
          .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c))
          .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        ok = (q.key || []).some(k => norm.indexOf(k.toLowerCase()
             .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c))) !== -1);
        got = a || '—';
      }
      if(ok) score += q.pts;
      detail.push({id:q.id, ok:ok, got:got, rep:q.rep || q.opts[q.a], pts:q.pts});
    });

    /* Rédaction : auto-évaluation guidée (/4) sur la grille officielle */
    const redac = DEVOIR.parties.filter(p => p.questions.some(q => q.type === 'redac'))[0];
    let redacPts = 0;
    if(redac) redacPts = 4;   /* affiché séparément, noté par le professeur */

    const note = Math.round(score * DEVOIR.total / maxAuto * 10) / 10;

    /* Persistance locale — SECRET (méthode de la séance 7) */
    const hist = load(LS.sim, {best:null, tries:[], secret:true});
    const now = new Date();
    const entry = { mode:SIM.mode, note:note, date:now.toLocaleDateString('fr-DZ'),
                    at:now.getTime(), detail:detail };
    hist.tries = (hist.tries || []).concat([entry]).slice(-20);
    if(hist.best === null || note > hist.best) hist.best = note;
    hist.secret = true;
    store(LS.sim, hist);

    SIM.started = false;
    paintResult(note, score, maxAuto, detail, redac, auto);
    if(DZ.renderStats) DZ.renderStats();
  }

  function paintResult(note, score, maxAuto, detail, redac, auto){
    const box = $('#simBody'); if(!box) return;
    const cls = note >= 14 ? 'ok' : (note >= 10 ? 'md' : 'ko');
    const msg = note >= 16 ? 'ممتاز يا ولدي! 🏆' : note >= 14 ? 'جيد جداً 👏'
              : note >= 10 ? 'حسن — واصل المراجعة 📖' : 'تحتاج مراجعة الوحدة 1 🔁';

    let h = '<div class="card result"><div class="mini-i">🎯</div>'
      + '<div class="result-n ' + cls + '">' + note + '<span style="font-size:22px;color:var(--m)">/20</span></div>'
      + '<div class="result-l">' + msg + '</div>'
      + '<div class="secret">🔒 نتيجة سرّية — محفوظة على جهازك فقط، لم تُرسل لأي خادم</div></div>';

    h += '<div class="card"><h2>📊 التحليل التفصيلي</h2>'
      + '<table class="bareme"><tr><th>السؤال</th><th>إجابتك</th><th>الصواب</th><th>النقطة</th></tr>'
      + detail.map(d => '<tr><td class="de-in"><b>' + d.id + '</b></td>'
        + '<td style="color:' + (d.ok ? 'var(--g)' : 'var(--r)') + '">' + (d.ok ? '✅ ' : '❌ ') + esc(String(d.got)) + '</td>'
        + '<td style="color:var(--m)">' + esc(String(d.rep)) + '</td>'
        + '<td>' + (d.ok ? d.pts : 0) + '/' + d.pts + '</td></tr>').join('')
      + '</table>'
      + '<div style="margin-top:13px;font-size:13px;color:var(--m)">'
      + 'الجزء الموضوعي : <b class="de-in">' + score + '/' + maxAuto + '</b> → معدَّل إلى <b class="de-in">'
      + note + '/20</b><br>الجزء الكتابي (✍️ /4) يُصحّحه الأستاذ حسب السلّم الرسمي.</div></div>';

    if(redac){
      const q = redac.questions.filter(x => x.type === 'redac')[0];
      h += '<div class="corrige"><h3>✍️ سلّم تنقيط الإنتاج الكتابي (/4)</h3>'
        + '<table class="bareme"><tr><th>المعيار</th><th>النقطة</th></tr>'
        + q.grille.map(g => '<tr><td>' + g[0] + '</td><td>' + g[1] + '</td></tr>').join('') + '</table>'
        + '<div style="margin-top:13px"><b>نموذج الإجابة :</b></div>' + q.modele + '</div>';
    }

    h += '<div style="display:flex;gap:11px;flex-wrap:wrap;margin-top:5px">'
      + '<button class="btn btn-p" id="btnAgain">🔁 إعادة المحاكاة</button>'
      + '<button class="btn btn-w" id="btnSendProf">💬 إرسال النتيجة للأستاذ</button>'
      + '<button class="btn btn-o" id="btnBackSim">↩️ العودة</button></div>';

    box.innerHTML = h;
    box.scrollIntoView({behavior:'smooth', block:'start'});

    const wa = $('#btnSendProf');
    if(wa) wa.addEventListener('click', () => {
      const txt = encodeURIComponent('السلام عليكم أستاذ خريف، نتيجتي في محاكاة فرض الوحدة 1 : '
        + note + '/20 (وضع ' + (SIM.mode === 'reel' ? 'حقيقي 45د' : 'مصغّر 10د') + ')');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + txt, '_blank');
    });
  }

  function exportResult(){
    const hist = load(LS.sim, {best:null, tries:[]});
    if(!hist.tries || !hist.tries.length){ toast('لا توجد نتائج للتصدير','ko'); return; }
    const last = hist.tries[hist.tries.length - 1];
    const txt = 'برنامج الأصل — DEUTSCH-DZ-APP\n'
      + 'التلميذ : …………\n'
      + 'فرض الوحدة 1 : Sich vorstellen\n'
      + 'الوضع : ' + (last.mode === 'reel' ? 'حقيقي (45 د)' : 'مصغّر (10 د)') + '\n'
      + 'النتيجة : ' + last.note + '/20\n'
      + 'التاريخ : ' + last.date + '\n'
      + 'أفضل نتيجة : ' + hist.best + '/20\n'
      + '──────────────\n'
      + (last.detail || []).map(d => (d.ok ? '[OK]  ' : '[--]  ') + d.id + ' → ' + d.got + ' (صواب: ' + d.rep + ')').join('\n');
    try{
      const blob = new Blob([txt], {type:'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'resultat-allemand-unite1.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast('📥 تم تنزيل النتيجة','ok');
    }catch(e){ toast('⚠️ تعذّر التصدير','ko'); }
  }

  /* ══════════════ MODULE 2 — ESPACE PARENTS ══════════════ */
  function renderParents(){
    const box = $('#parentsBody'); if(!box) return;
    const st   = DZ.loadSeances();
    const sim  = load(LS.sim, {best:null, tries:[]});
    const cfg  = load(LS.parent, {nom:''});

    const done = (st.done || []).length;
    const exoTotal = Object.keys(st.exo || {}).length;
    const exoOk = Object.values(st.exo || {}).filter(x => x.ok).length;
    const pctExo = exoTotal ? Math.round(exoOk / exoTotal * 100) : 0;
    const tries = (sim.tries || []).length;
    const semaine = (sim.tries || []).filter(t => Date.now() - (t.at || 0) < 7 * 864e5).length;
    const presence = Math.min(100, Math.round((done * 12 + semaine * 8)));

    let h = '<div class="privacy">👨‍👩‍👧 تقرير أسبوعي شفّاف — يُبنى محلياً من نشاط التلميذ على هذا الجهاز.</div>';

    h += '<div class="card"><h2>📊 تقرير هذا الأسبوع</h2>'
      + row('الحصص المكتملة', done + ' / 8', done >= 6 ? 'ok' : (done >= 3 ? '' : 'ko'))
      + row('نسبة إنجاز التمارين', pctExo + '%', pctExo >= 70 ? 'ok' : '')
      + row('عدد المحاكيات', tries, tries ? 'ok' : '')
      + row('محاكيات هذا الأسبوع', semaine, semaine ? 'ok' : 'ko')
      + row('أفضل نتيجة', sim.best !== null ? sim.best + '/20' : '—',
            sim.best >= 14 ? 'ok' : (sim.best >= 10 ? '' : 'ko'))
      + row('مؤشر الحضور', presence + '%', presence >= 60 ? 'ok' : '')
      + '<div class="progress-wrap" style="margin-top:13px"><div class="progress" style="width:' + presence + '%"></div></div>'
      + '</div>';

    h += '<div class="card"><h2>🧾 الواجبات المنزلية</h2>'
      + '<div class="rep-row"><span>مراجعة مفردات الوحدة 1</span><span class="rep-v ' + (done >= 5 ? 'ok' : 'ko') + '">'
      + (done >= 5 ? '✅ منجزة' : '⏳ قيد الإنجاز') + '</span></div>'
      + '<div class="rep-row"><span>فرض الوحدة 1 (/20)</span><span class="rep-v ' + (tries ? 'ok' : 'ko') + '">'
      + (tries ? '✅ ' + tries + ' محاولة' : '⏳ لم يُجتز بعد') + '</span></div>'
      + '<div class="rep-row"><span>الإنتاج الكتابي ✍️</span><span class="rep-v">'
      + (st.exo && st.exo['s6_e0'] ? '✅ مُسلَّم' : '⏳ مطلوب') + '</span></div>'
      + '</div>';

    h += '<div class="card"><h2>📱 التواصل مع الأستاذ</h2>'
      + '<p style="color:var(--m);font-size:13px;margin-bottom:11px">'
      + 'للاستفسار عن مستوى ابنك/ابنتك أو لحجز حصّة، راسلنا مباشرة :</p>'
      + '<input class="txt-in" id="parentNom" style="min-height:44px;margin-bottom:9px" '
      + 'placeholder="اسم الولي (اختياري)" value="' + esc(cfg.nom || '') + '">'
      + '<a class="btn btn-w btn-block" id="btnWaParent" href="#" target="_blank" rel="noopener" '
      + 'style="margin-top:9px">💬 واتساب : 0555 57 79 31</a>'
      + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:11px">'
      + '<button class="btn btn-o btn-sm" id="btnShareReport">📤 مشاركة التقرير</button>'
      + '<button class="btn btn-o btn-sm" id="btnPrint">🖨️ طباعة التقرير</button></div>'
      + '</div>';

    h += '<div class="card"><h2>🎁 العرض الافتتاحي</h2>'
      + '<p style="font-size:13.5px;color:var(--m)">حصّة أولى <b style="color:var(--g)">مجانية</b> — '
      + 'ساري حتى <b>30 سبتمبر 2026</b>. الأماكن محدودة، الأولوية للتسجيل.</p>'
      + '<button class="btn btn-g btn-block" data-go="seances">🚀 بدء الحصّة الأولى</button></div>';

    box.innerHTML = h;

    const nom = $('#parentNom'), wa = $('#btnWaParent');
    const majWa = () => {
      const n = (nom.value || '').trim();
      store(LS.parent, {nom:n});
      const txt = encodeURIComponent('السلام عليكم أستاذ خريف' + (n ? '، أنا ' + n : '')
        + '. أريد الاستفسار عن مستوى ابني في الألمانية.');
      wa.href = 'https://wa.me/' + WA_NUMBER + '?text=' + txt;
    };
    majWa();
    if(nom) nom.addEventListener('input', majWa);

    const sh = $('#btnShareReport');
    if(sh) sh.addEventListener('click', async () => {
      const txt = 'تقرير أسبوعي — برنامج الأصل (الألمانية)\n'
        + 'الحصص المكتملة : ' + done + '/8\n'
        + 'نسبة التمارين : ' + pctExo + '%\n'
        + 'أفضل نتيجة : ' + (sim.best !== null ? sim.best + '/20' : '—') + '\n'
        + 'مؤشر الحضور : ' + presence + '%';
      try{
        if(navigator.share){ await navigator.share({title:'تقرير الألمانية', text:txt}); }
        else { await navigator.clipboard.writeText(txt); toast('📋 نُسح التقرير','ok'); }
      }catch(e){ toast('⚠️ تعذّرت المشاركة','ko'); }
    });

    const pr = $('#btnPrint');
    if(pr) pr.addEventListener('click', () => window.print());
  }

  function row(lib, val, cls){
    return '<div class="rep-row"><span>' + lib + '</span><span class="rep-v ' + (cls || '') + '">' + val + '</span></div>';
  }

  /* ══════════════ ÉVÉNEMENTS ══════════════ */
  document.addEventListener('click', ev => {
    const m = ev.target.closest('[data-mode]');
    if(m){ SIM.mode = m.dataset.mode; renderSim(); return; }

    if(ev.target.closest('#btnStart')){ startSim(); return; }

    if(ev.target.closest('#btnSubmit')){
      if(!confirm('هل تريد تسليم الورقة الآن؟')) return;
      corriger(false); return;
    }
    if(ev.target.closest('#btnAgain')){ SIM.mode = null; SIM.started = false; SIM.answers = {}; renderSim(); return; }
    if(ev.target.closest('#btnBackSim')){ SIM.started = false; clearInterval(SIM.tick); renderSim(); return; }
    if(ev.target.closest('#btnExport')){ exportResult(); return; }
    if(ev.target.closest('#btnReset')){
      if(!confirm('حذف كل نتائج المحاكاة من هذا الجهاز؟')) return;
      store(LS.sim, {best:null, tries:[], secret:true});
      if(DZ.renderStats) DZ.renderStats();
      renderSim(); toast('🗑️ تم حذف السجل','ok'); return;
    }

    /* Réponses de la simulation */
    const vf = ev.target.closest('[data-svf]');
    if(vf){ const q = vf.closest('[data-sq]'); if(q){
      $$('[data-svf]', q).forEach(o => o.classList.remove('ok','ko'));
      vf.classList.add('ok'); SIM.answers[q.dataset.sq] = +vf.dataset.svf; } return; }

    const qc = ev.target.closest('[data-sqcm]');
    if(qc){ const q = qc.closest('[data-sq]'); if(q){
      $$('[data-sqcm]', q).forEach(o => o.classList.remove('ok','ko'));
      qc.classList.add('ok'); SIM.answers[q.dataset.sq] = +qc.dataset.sqcm; } return; }
  });

  document.addEventListener('input', ev => {
    const t = ev.target.closest('[data-stxt]');
    if(t){ SIM.answers[t.dataset.stxt] = t.value.trim(); }
  });

  /* Alerte avant de quitter une épreuve en cours */
  window.addEventListener('beforeunload', ev => {
    if(SIM.started){ ev.preventDefault(); ev.returnValue = ''; }
  });

  /* ══════════════ EXPORT ══════════════ */
  window.renderSim     = renderSim;
  window.renderParents = renderParents;
})();
