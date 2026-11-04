/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — masar.js
   🧭 مسارك : UNE seule prochaine action, décidée par ta mémoire
   ──────────────────────────────────────────────────────────────────────
   Règle : s'il reste des cartes de révision dues → réviser d'abord
   (la mémoire prime sur le neuf). Sinon → prochaine séance non faite.
   Sinon → félicitations + proposer le niveau suivant.
   Aucune donnée nouvelle : tout vient de MEMOIRE + prochaineSeance().
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function progressData(){
    let total = 0, done = 0, units = 0;
    try{
      if(typeof UNITES !== 'undefined' && typeof loadSeancesFor === 'function'){
        UNITES.forEach(u => {
          const sessions = Array.isArray(u.seances) ? u.seances : [];
          if(!sessions.length) return;
          const state = loadSeancesFor(u.n) || {};
          const completed = Array.isArray(state.done) ? state.done : [];
          total += sessions.length;
          done += sessions.filter(s => completed.indexOf(s.n) !== -1).length;
          units++;
        });
      }
    }catch(e){}
    if(!total && typeof window.prochaineSeance === 'function'){
      const n = window.prochaineSeance();
      if(n){ total = n.total || 0; done = n.faites || 0; units = 1; }
    }
    return {total,done,units,pct:total ? Math.round(done/total*100) : 0};
  }

  function render(){
    const box = $('#masarBody'); if(!box) return;
    const dues = (window.MEMOIRE && MEMOIRE.dues) ? MEMOIRE.dues() : [];
    const next = (window.prochaineSeance) ? window.prochaineSeance() : null;
    const faibles = (window.MEMOIRE && MEMOIRE.carteErreurs) ? MEMOIRE.carteErreurs() : [];
    const progress = progressData();
    const circumference = 2 * Math.PI * 43;
    const offset = circumference * (1 - progress.pct / 100);

    let h = '<div class="ms-hero">'
      + '<div class="ms-hero-copy"><span class="ms-kicker">🇩🇿 رحلتك التعليمية</span>'
      + '<h2>كل خطوة تقرّبك من النجاح</h2>'
      + '<p class="ms-sub">تقدّمك الحقيقي، مهاراتك، وخطوتك القادمة في مكان واحد</p>'
      + '<div class="ms-hero-meta"><span>📚 ' + progress.units + ' وحدات متاحة</span>'
      + '<span>✓ ' + progress.done + ' حصة مكتملة</span>'
      + '<span>⏳ ' + Math.max(0,progress.total-progress.done) + ' متبقية</span></div></div>'
      + '<div class="ms-ring-wrap"><svg class="ms-ring" viewBox="0 0 112 112" role="img" aria-label="التقدم العام ' + progress.pct + '%">'
      + '<circle class="ms-ring-track" cx="56" cy="56" r="43"/>'
      + '<circle class="ms-ring-value" cx="56" cy="56" r="43" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>'
      + '</svg><div class="ms-ring-label"><b>' + progress.pct + '%</b><span>التقدم العام</span></div></div>'
      + '</div>';

    /* 1) priorité : révision due */
    if(dues.length){
      const top = faibles[0];
      h += '<div class="card ms-next prio">'
        + '<div class="ms-tag">🔄 أولوية اليوم: تثبيت التعلّم</div>'
        + '<h3>راجع ' + dues.length + ' بطاقة من بطاقات الأخطاء</h3>'
        + '<p class="ms-why">لأنك أخطأت فيها وحان موعد مراجعتها اليوم'
        + (top ? ' · نقطة تحتاج إلى تقوية: <b>' + esc(top.comp) + ' (' + top.taux + '%)</b>' : '')
        + '</p>'
        + '<div class="ms-bar"><i style="width:' +
          Math.round(100 - (top ? top.taux : 50)) + '%"></i></div>'
        + '<button class="btn btn-p btn-block" data-go="revision">🧠 راجع الآن '
        + '(' + dues.length + ')</button></div>';
    }
    /* 2) sinon : prochaine séance */
    else if(next){
      h += '<div class="card ms-next">'
        + '<div class="ms-tag">▶ الخطوة التالية</div>'
        + '<h3>الحصة ' + (next.prochaine ? next.prochaine.n : '?') + ' · '
        + esc(next.prochaine ? next.prochaine.ar : '') + '</h3>'
        + '<p class="ms-why">الوحدة ' + next.unite + ' — ' + esc(next.titre) + ' · '
        + next.faites + '/' + next.total + ' حصّة منجزة</p>'
        + '<div class="ms-bar"><i style="width:' +
          Math.round(next.faites / next.total * 100) + '%"></i></div>'
        + '<button class="btn btn-p btn-block" data-go="seances">📚 ابدأ الحصّة</button>'
        + '</div>';
    }
    /* 3) sinon : tout est fait */
    else {
      h += '<div class="card ms-next ok"><div class="ms-tag">✓ أنت على المسار الصحيح</div>'
        + '<h3>أحسنت! لا توجد مراجعات مستحقة الآن</h3>'
        + '<p class="ms-why">أنجزت حصصك وأتممت مراجعة بطاقات الأخطاء. '
        + 'عد غدًا لمواصلة المراجعة المتباعدة.</p>'
        + '<button class="btn btn-o btn-block" data-go="examen">🎓 تدرّب على امتحان البكالوريا</button>'
        + '</div>';
    }

    /* Graphique des résultats réels issus de la mémoire locale */
    if(faibles.length){
      h += '<section class="ms-chart card"><div class="ms-chart-head"><div><span class="ms-chart-kicker">تحليل الأداء</span>'
        + '<h3>مؤشر الإجابات الصحيحة حسب المهارة</h3><p>نتائجك المسجّلة في بطاقات الذاكرة</p></div>'
        + '<span class="ms-chart-icon">▥</span></div>'
        + '<div class="ms-bars" role="img" aria-label="نسب الإجابات الصحيحة حسب المهارة">'
        + faibles.slice(0,5).map((f,i) =>
            '<div class="ms-chart-row"><div class="ms-chart-label"><span class="ms-chart-dot d' + i + '"></span><b>' + esc(f.comp) + '</b>'
            + '<small>' + f.total + ' محاولة · ' + f.cartes + ' بطاقة</small></div>'
            + '<div class="ms-chart-track"><i style="width:' + Math.max(0,Math.min(100,f.taux)) + '%"></i></div>'
            + '<strong>' + f.taux + '%</strong></div>').join('')
        + '</div><p class="ms-chart-note">تُحدَّث هذه المؤشرات تلقائياً مع كل إجابة وتقييم جديد.</p></section>';
    }else{
      h += '<section class="ms-chart ms-chart-empty card"><div class="ms-chart-head"><div><span class="ms-chart-kicker">تحليل الأداء</span>'
        + '<h3>سيظهر منحنى مهاراتك هنا</h3><p>أجب عن التمارين وسجّل تقييمك لتكوين الرسم البياني.</p></div>'
        + '<span class="ms-chart-icon">▥</span></div><div class="ms-empty-line"><span>🎯</span><b>ابدأ بتمرين قصير لرؤية مؤشراتك</b></div></section>';
    }
    if(next){
      h += '<div class="card ms-prog"><div class="ms-prog-head"><div><span class="ms-chart-kicker">المحطة الحالية</span>'
        + '<h3>تقدّم الوحدة ' + numNiveau(next.unite) + '</h3></div><b class="ms-prog-pct">'
        + Math.round(next.faites / next.total * 100) + '%</b></div>'
        + '<div class="ms-bar big"><i style="width:' +
          Math.round(next.faites / next.total * 100) + '%"></i></div>'
        + '<p class="ms-why">' + next.faites + ' / ' + next.total + ' حصة منجزة · '
        + (next.total - next.faites) + ' متبقية</p></div>';
    }
    box.innerHTML = h;
  }

  window.renderMasar = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'masar') render(); });
})();
