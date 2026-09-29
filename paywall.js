/* paywall.js — phase 4 : paywall professionnel RTL (overlay), déclenché par
   l'événement dz:paywall émis par ACCESS.paywall(). Les prix viennent UNIQUEMENT
   de assets/bdd/config.json (paiement.plans) — aucun prix codé ici. */
'use strict';
(function(){
  var OV = null;
  function el(id){ return document.getElementById(id); }
  function cfgPaiement(){
    return fetch('assets/bdd/config.json', { cache:'no-store' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ return (j && j.paiement) || null; })
      .catch(function(){ return null; });
  }
  function role(){
    try{ if(window.AUTH && AUTH.session){ var s = AUTH.session(); if(s && s.role) return s.role; } }catch(e){}
    return 'eleve';
  }
  function cibleTxt(t){
    t = t || {};
    if(t.type === 'seance' && t.unite && t.seance) return 'الوحدة ' + t.unite + ' · الحصة ' + t.seance;
    if(t.type === 'view' && t.view) return 'فضاء : ' + t.view;
    if(t.type === 'trial_complete') return 'إكمال المسار التجريبي المجاني';
    if(t.unite && t.seance) return 'الوحدة ' + t.unite + ' · الحصة ' + t.seance;
    return '';
  }
  function features(){
    return ['جميع الوحدات (9 وحدات 2AS + 10 وحدات 3AS)',
            'جميع الدروس والحصص وصفحات الكتاب',
            'التمارين التفاعلية والتصحيح الفوري',
            'الفروض والاختبارات وحوليات البكالوريا',
            'التصحيح الكامل وسلالم التنقيط الرسمية',
            'متابعة التقدم وذاكرة المراجعة الذكية',
            'المحتوى التعليمي الكامل بدون حدود'];
  }
  function closePaywall(){ if(OV){ try{ OV.remove(); }catch(e){} OV = null; } }
  function openPaywall(target){
    closePaywall();
    cfgPaiement().then(async function(pai){
      var r = role();
      var ent = (window.ACCESS && ACCESS.entitlement) ? ACCESS.entitlement() : null;
      var ret = (window.ACCESS && ACCESS.getReturn) ? ACCESS.getReturn() : null;
      var cibles = cibleTxt(target) || (ret ? cibleTxt({ type:'seance', unite: ret.unite, seance: ret.seance }) : '');
      var trial = (window.ACCESS && ACCESS.trialFinished) ? ACCESS.trialFinished() : false;
      var h = '<div class="pw-card">'
        + '<button class="close-x" id="pwClose">✕</button>'
        + '<div class="pw-emo">🔒</div>'
        + '<h2>هذا المحتوى متاح للمشتركين فقط</h2>'
        + '<p class="pw-sub">' + (trial
            ? 'لقد أكملت المسار التجريبي المجاني. يمكنك الآن فتح البرنامج الكامل ومتابعة تعلم الألمانية بكل الوحدات والدروس والتمارين والاختبارات.'
            : 'لقد استفدت من الدروس المجانية (الوحدة 1 · الحصتان 1 و 2). اشترك الآن للوصول إلى البرنامج الكامل.') + '</p>'
        + (cibles ? '<p class="pw-cible">كنت تحاول فتح : <b>' + cibles + '</b></p>' : '')
        + '<ul class="pw-feats">' + features().map(function(f){ return '<li>✓ ' + f + '</li>'; }).join('') + '</ul>';
      var pls = [];
      try{ if(window.BILLING_PLANS) pls = await window.BILLING_PLANS(r, pai); }catch(e){ pls = []; }
      if(!pls.length && r === 'eleve' && pai && pai.plans) pls = pai.plans;
      if(pls.length){
        h += '<div class="pw-plans">' + pls.map(function(p){
          return '<button type="button" class="pw-plan" data-plan="' + p.id + '">'
            + '<span class="pw-lb">' + p.label + (p.label_ar ? ' — ' + p.label_ar : '') + '</span>'
            + '<span class="pw-pr">' + p.prix + ' دج</span>'
            + '<span class="pw-pm">' + p.par_mois + ' دج/شهريا' + (p.eco ? ' · ' + p.eco : '') + '</span>'
            + '</button>';
        }).join('') + '</div>'
        + '<button class="btn btn-g btn-block" id="pwGo">فتح البرنامج الكامل</button>'
        + '<div class="pw-pay">💳 وسائل الدفع : CCP · BaridiMob — الحساب : <b>' + (pai.titulaire || '') + '</b><br>'
        + 'CCP : ' + (pai.ccp || '') + ' · BaridiMob : ' + (pai.baridimob || '') + '<br>'
        + 'حوّل المبلغ مع مرجع الاشتراك DZ-… ثم أرسل الوصل من صفحة الاشتراك 💳.</div>';
      } else {
        h += '<div class="pw-pay">خطط الأساتذة والأولياء تُحدد لاحقًا من الإدارة.<br>💬 تواصل واتساب : 0555 57 79 31</div>'
          + '<button class="btn btn-g btn-block" id="pwGo">متابعة إلى صفحة الاشتراك</button>';
      }
      h += '<div class="pw-sec">🔐 لا تُخزَّن أي بطاقة مصرفية · تفعيل يدوي خلال 24 ساعة بعد التحقق · بدون تجديد تلقائي</div>'
        + '<div class="pw-st">حالتك الحالية : ' + (ent && ent.ok ? ('مشترك' + (ent.until ? ' حتى ' + String(ent.until).slice(0, 10) : '')) : 'مجاني (المسار التجريبي)') + '</div>'
        + (ret && ret.seance ? '<div class="pw-ret">↩ بعد التفعيل ستعود تلقائيًا إلى : الوحدة ' + (ret.unite || '') + ' · الحصة ' + ret.seance + '</div>' : '')
        + '<button class="btn btn-o btn-block" id="pwLater">لاحقًا</button>'
        + '</div>';
      OV = document.createElement('div');
      OV.id = 'paywallOv'; OV.className = 'paywall';
      OV.innerHTML = h;
      document.body.appendChild(OV);
      var sel = null;
      var plans = OV.querySelectorAll('.pw-plan');
      for(var i = 0; i < plans.length; i++){
        (function(bt){
          bt.addEventListener('click', function(){
            sel = bt.getAttribute('data-plan');
            for(var j = 0; j < plans.length; j++) plans[j].classList.remove('on');
            bt.classList.add('on');
          });
        })(plans[i]);
      }
      if(plans.length){
        var dflt = plans[Math.min(1, plans.length - 1)];
        dflt.classList.add('on'); sel = dflt.getAttribute('data-plan');
      }
      var g = el('pwGo');
      if(g) g.addEventListener('click', function(){
        try{ if(sel) sessionStorage.setItem('dz_paywall_plan', sel); }catch(e){}
        closePaywall();
        try{ if(typeof go === 'function') go('abonne'); }catch(e){}
      });
      var l = el('pwLater'); if(l) l.addEventListener('click', closePaywall);
      var x = el('pwClose'); if(x) x.addEventListener('click', closePaywall);
    });
  }
  document.addEventListener('dz:paywall', function(ev){ openPaywall((ev && ev.detail) || {}); });
  window.PAYWALL = { open: openPaywall, close: closePaywall };
})();
