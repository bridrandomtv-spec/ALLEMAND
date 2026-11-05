/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — مسارك
   Progression réelle par unité + prochaine action + analyse mémoire.
   Aucune statistique de démonstration ni progression artificielle.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $ = (s,c) => (c || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct = (done,total) => total > 0 ? Math.max(0,Math.min(100,Math.round(done / total * 100))) : 0;

  function activeLevel(){
    try{
      const session = window.AUTH && typeof AUTH.session === 'function' ? AUTH.session() : null;
      if(session && ['2AS','3AS'].includes(session.niveau)) return session.niveau;
    }catch(e){}
    try{
      const selected = typeof window.getNiveauActif === 'function' ? window.getNiveauActif() : null;
      if(['2AS','3AS','tous'].includes(selected)) return selected;
    }catch(e){}
    const dzLevel = window.DZ && window.DZ.niveauActif;
    return ['2AS','3AS','tous'].includes(dzLevel) ? dzLevel : 'tous';
  }

  function progressData(){
    const niveau = activeLevel();
    let units = [];
    try{
      if(typeof UNITES !== 'undefined' && typeof loadSeancesFor === 'function'){
        const scope = niveau === 'tous' ? UNITES : UNITES.filter(u => (u.niveau || '2AS') === niveau);
        units = scope.map(u => {
          const sessions = Array.isArray(u.seances) ? u.seances : [];
          const state = loadSeancesFor(u.n) || {};
          const completed = Array.isArray(state.done) ? state.done : [];
          const done = sessions.filter(s => completed.indexOf(s.n) !== -1).length;
          return {
            id:u.n, level:u.niveau || '2AS', title:u.ar || u.de || ('الوحدة ' + u.n),
            sessions:sessions.length, done:done, remaining:Math.max(0,sessions.length-done),
            pct:pct(done,sessions.length)
          };
        }).filter(u => u.sessions > 0);
      }
    }catch(e){}
    const total = units.reduce((n,u) => n + u.sessions,0);
    const done = units.reduce((n,u) => n + u.done,0);
    const nextUnit = units.find(u => u.remaining > 0) || null;
    let next = null;
    if(nextUnit && typeof UNITES !== 'undefined'){
      const source = UNITES.find(u => u.n === nextUnit.id);
      const state = typeof loadSeancesFor === 'function' ? (loadSeancesFor(nextUnit.id) || {}) : {};
      const completed = Array.isArray(state.done) ? state.done : [];
      const sessions = source && Array.isArray(source.seances) ? source.seances : [];
      const upcoming = sessions.find(s => completed.indexOf(s.n) === -1) || null;
      next = {
        unite:nextUnit.id, titre:source ? (source.de || '') : '',
        ar:source ? (source.ar || '') : '', faites:nextUnit.done,
        total:nextUnit.sessions, prochaine:upcoming, niveau:nextUnit.level
      };
    }
    return {niveau,units,total,done,remaining:Math.max(0,total-done),pct:pct(done,total),next};
  }

  function render(){
    const box = $('#masarBody');
    if(!box) return;

    const progress = progressData();
    const dues = window.MEMOIRE && typeof MEMOIRE.dues === 'function' ? MEMOIRE.dues() : [];
    const allSkills = window.MEMOIRE && typeof MEMOIRE.carteErreurs === 'function' ? MEMOIRE.carteErreurs() : [];
    const skills = allSkills.filter(x => Number(x.total) > 0).slice(0,5);
    const next = progress.next;
    const circumference = 2 * Math.PI * 43;
    const offset = circumference * (1 - progress.pct / 100);
    const levelLabel = progress.niveau === 'tous' ? 'كل المستويات' : 'المستوى ' + progress.niveau;
    const unitLabel = u => {
      try{ return typeof window.numNiveau === 'function' ? window.numNiveau(u.id) : u.id; }
      catch(e){ return u.id; }
    };

    let h = '<div class="ms-hero">'
      + '<div class="ms-hero-copy"><span class="ms-kicker">🇩🇿 رحلتك التعليمية</span>'
      + '<h2>مسارك الدراسي، خطوة بخطوة نحو التميّز</h2>'
      + '<p class="ms-sub">لوحة متابعة تجمع إنجازاتك الفعلية، مهاراتك التي تحتاج إلى دعم، وخطوتك التعليمية القادمة.</p>'
      + '<div class="ms-hero-meta"><span>🎓 ' + esc(levelLabel) + '</span>'
      + '<span>📚 ' + progress.units.length + ' وحدات متاحة في المسار</span>'
      + '<span>✓ ' + progress.done + ' حصة مكتملة</span>'
      + '<span>⏳ ' + progress.remaining + ' حصة متبقية</span></div></div>'
      + '<div class="ms-ring-wrap"><svg class="ms-ring" viewBox="0 0 112 112" role="img" aria-label="التقدم العام ' + progress.pct + '%">'
      + '<circle class="ms-ring-track" cx="56" cy="56" r="43"/>'
      + '<circle class="ms-ring-value" cx="56" cy="56" r="43" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>'
      + '</svg><div class="ms-ring-label"><b>' + (progress.total ? progress.pct + '%' : '—') + '</b><span>نسبة الإنجاز</span></div></div>'
      + '</div>';

    if(dues.length){
      const weakest = skills[0];
      h += '<section class="card ms-next ms-priority">'
        + '<div class="ms-card-eyebrow"><span class="ms-tag">🔄 أولوية المراجعة</span><span class="ms-card-index">01 / 03</span></div>'
        + '<h3>لديك ' + dues.length + ' بطاقة مراجعة مستحقة</h3>'
        + '<p class="ms-why">ابدأ بتثبيت المعلومات التي سبق أن واجهت فيها صعوبة.'
        + (weakest ? ' المهارة التي تستحق اهتمامك: <b>' + esc(weakest.comp) + '</b>.' : '') + '</p>'
        + '<button class="btn btn-p ms-action" data-go="revision">🧠 ابدأ المراجعة الآن <span>←</span></button>'
        + '</section>';
    }else if(next){
      h += '<section class="card ms-next">'
        + '<div class="ms-card-eyebrow"><span class="ms-tag">▶ خطوتك التعليمية التالية</span><span class="ms-card-index">01 / 03</span></div>'
        + '<h3>' + esc(next.prochaine ? next.prochaine.ar : 'تابع وحدتك التعليمية') + '</h3>'
        + '<p class="ms-why">الوحدة ' + esc(unitLabel({id:next.unite})) + ' · ' + esc(next.titre)
        + '<br>' + next.faites + ' من ' + next.total + ' حصص منجزة في هذه الوحدة.</p>'
        + '<div class="ms-inline-progress"><span style="width:' + pct(next.faites,next.total) + '%"></span></div>'
        + '<button class="btn btn-p ms-action" data-masar-unit="' + next.unite + '">📚 متابعة الحصة التالية <span>←</span></button>'
        + '</section>';
    }else if(progress.total){
      h += '<section class="card ms-next ms-complete">'
        + '<div class="ms-card-eyebrow"><span class="ms-tag">✓ مسار مكتمل</span><span class="ms-card-index">01 / 03</span></div>'
        + '<h3>أحسنت! أتممت جميع الحصص المتاحة في هذا المستوى.</h3>'
        + '<p class="ms-why">يمكنك الآن مراجعة بطاقات الذاكرة أو الانتقال إلى التدرب على الاختبارات.</p>'
        + '<button class="btn btn-p ms-action" data-go="examen">🎓 انتقل إلى الاختبارات <span>←</span></button>'
        + '</section>';
    }else{
      h += '<section class="card ms-next ms-empty-next">'
        + '<div class="ms-card-eyebrow"><span class="ms-tag">مسارك التعليمي</span><span class="ms-card-index">01 / 03</span></div>'
        + '<h3>لا توجد حصص مسجلة لهذا المستوى حتى الآن.</h3>'
        + '<p class="ms-why">اختر مستوى تتوفر له وحدات تعليمية لعرض تقدمك الحقيقي هنا.</p>'
        + '<button class="btn btn-p ms-action" data-go="seances">📚 اكتشف الحصص <span>←</span></button>'
        + '</section>';
    }

    h += '<section class="card ms-chart"><div class="ms-chart-head"><div>'
      + '<span class="ms-chart-kicker">تحليل الأداء</span><h3>مؤشرات مهاراتك</h3>'
      + '<p>مبنية على محاولاتك المسجلة في بطاقات الذاكرة</p></div><span class="ms-chart-icon">▥</span></div>';
    if(skills.length){
      h += '<div class="ms-bars" role="img" aria-label="نسب الإجابات الصحيحة حسب المهارة">'
        + skills.map((f,i) => '<div class="ms-chart-row"><div class="ms-chart-label"><span class="ms-chart-dot d' + i + '"></span><b>' + esc(f.comp) + '</b><small>' + f.total + ' محاولة · ' + f.cartes + ' بطاقة</small></div>'
          + '<strong>' + f.taux + '%</strong><div class="ms-chart-track"><i style="width:' + Math.max(0,Math.min(100,f.taux)) + '%"></i></div></div>').join('')
        + '</div><p class="ms-chart-note">النسبة محسوبة من الإجابات الصحيحة مقارنة بإجمالي المحاولات المسجلة لكل مهارة.</p>';
    }else{
      h += '<div class="ms-empty-line"><span>🎯</span><div><b>تحليلك سيظهر هنا بعد أولى المحاولات</b><p>حلّ تمريناً أو راجع بطاقة خطأ حتى تتكوّن مؤشرات أداء قابلة للقياس.</p></div></div>';
    }
    h += '</section>';

    h += '<section class="card ms-prog"><div class="ms-prog-head"><div>'
      + '<span class="ms-chart-kicker">ملخص الإنجاز</span><h3>تقدمك في هذا المستوى</h3></div>'
      + '<b class="ms-prog-pct">' + (progress.total ? progress.pct + '%' : '—') + '</b></div>'
      + '<div class="ms-bar big"><i style="width:' + progress.pct + '%"></i></div>'
      + '<div class="ms-summary-stats"><div><b>' + progress.done + '</b><span>حصة مكتملة</span></div>'
      + '<div><b>' + progress.remaining + '</b><span>حصة متبقية</span></div>'
      + '<div><b>' + progress.units.length + '</b><span>وحدات متاحة</span></div></div>'
      + '</section>';

    h += '<section class="card ms-units"><div class="ms-chart-head"><div>'
      + '<span class="ms-chart-kicker">خريطة التقدم</span><h3>إنجاز الوحدات التعليمية</h3>'
      + '<p>كل وحدة تعرض عدد الحصص التي أنجزتها فعلياً.</p></div><span class="ms-chart-icon">▦</span></div>';
    if(progress.units.length){
      h += '<div class="ms-unit-grid">' + progress.units.map(u => {
        const state = u.pct === 100 ? 'done' : (u.done > 0 ? 'active' : 'new');
        const stateText = u.pct === 100 ? 'مكتملة' : (u.done > 0 ? 'قيد الإنجاز' : 'لم تبدأ');
        return '<article class="ms-unit-card ' + state + '"><div class="ms-unit-top"><span>الوحدة ' + esc(unitLabel(u)) + '</span><b>' + u.pct + '%</b></div>'
          + '<h4>' + esc(u.title) + '</h4><div class="ms-unit-track"><i style="width:' + u.pct + '%"></i></div>'
          + '<div class="ms-unit-foot"><span>' + u.done + ' / ' + u.sessions + ' حصص</span><span>' + stateText + '</span></div></article>';
      }).join('') + '</div>';
    }else{
      h += '<div class="ms-empty-line"><span>📚</span><div><b>لا توجد وحدات ذات حصص متاحة في هذا الاختيار.</b><p>ستظهر الوحدات هنا عندما تكون بيانات الحصص متاحة.</p></div></div>';
    }
    h += '</section>';

    box.innerHTML = h;
  }

  document.addEventListener('click', function(e){
    const action = e.target.closest('[data-masar-unit]');
    if(!action) return;
    e.preventDefault();
    const unit = Number(action.dataset.masarUnit);
    if(!Number.isFinite(unit) || typeof selectUnite !== 'function' || typeof go !== 'function') return;
    selectUnite(unit);
    go('seances');
  });

  window.renderMasar = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'masar') render(); });
})();
