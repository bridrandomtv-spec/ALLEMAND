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

  function render(){
    const box = $('#masarBody'); if(!box) return;
    const dues = (window.MEMOIRE && MEMOIRE.dues) ? MEMOIRE.dues() : [];
    const next = (window.prochaineSeance) ? window.prochaineSeance() : null;
    const faibles = (window.MEMOIRE && MEMOIRE.carteErreurs) ? MEMOIRE.carteErreurs() : [];

    let h = '<div class="ms-hero"><span class="ms-crest">🧭</span><div>'
      + '<h2>مسارك</h2><p class="ms-sub">شيء واحد فقط الآن — '
      + 'والباقي ينتظر</p></div></div>';

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
        + '<button class="btn btn-p btn-block" data-go="revision">🧠 réviser maintenant '
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
        + '<button class="btn btn-o btn-block" data-go="examen">🎓 entraîne-toi au BAC</button>'
        + '</div>';
    }

    /* bloc secondaire : point faible + progression */
    if(faibles.length){
      h += '<div class="card ms-weak"><h3>🗺️ المهارتان الأكثر حاجة إلى التحسين</h3>'
        + faibles.slice(0, 2).map(f =>
            '<div class="ms-w"><span>' + esc(f.comp) + '</span>'
            + '<span class="ms-bar"><i style="width:' + f.taux + '%"></i></span>'
            + '<b>' + f.taux + '%</b></div>').join('')
        + '<p class="ms-why">ستحظى هاتان المهارتان بأولوية أكبر في مراجعاتك القادمة.</p></div>';
    }
    if(next){
      h += '<div class="card ms-prog"><h3>📈 تقدّم الوحدة ' + numNiveau(next.unite) + '</h3>'
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
