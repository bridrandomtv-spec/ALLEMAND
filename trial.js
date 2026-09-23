/* trial.js — 🎮 الدخول التجريبي المbridé : entonnoir vers l'abonnement
   · 3 séances · 10 exercices · 1 فرض مصغّر  puis soft-lock + CTA compte
   · bandeau permanent « وضع تجريبي » + compteurs
   · ☁️ sync et 🛡️ admin masqués en trial · données isolées dz_trial_*
   · effacé automatiquement à la première vraie connexion */
'use strict';
(function(){
  const K = 'dz_trial_v1';
  const MAX = { seances: 3, exos: 10, fard: 1 };
  const $ = (s,c) => (c||document).querySelector(s);

  function lit(){ try{ return JSON.parse(localStorage.getItem(K) || 'null'); }catch(e){ return null; } }
  function sauve(o){ try{ localStorage.setItem(K, JSON.stringify(o)); }catch(e){} }
  function on(){ const t = lit(); return !!(t && t.on); }
  function reste(){
    const t = lit() || { seances:0, exos:0, fard:0 };
    return { s: Math.max(0, MAX.seances - (t.seances || 0)),
             e: Math.max(0, MAX.exos  - (t.exos  || 0)),
             f: Math.max(0, MAX.fard  - (t.fard  || 0)) };
  }
  function verrouille(){
    const r = reste();
    return r.s === 0 || r.e === 0 || r.f === 0 && false ? (r.s === 0 || r.e === 0) : false;
  }

  /* bandeau + compteurs */
  function bandeau(){
    let b = $('#trialBar');
    if(!on()){ if(b) b.remove(); document.body.classList.remove('trial'); return; }
    document.body.classList.add('trial');
    if(!b){ b = document.createElement('div'); b.id = 'trialBar'; document.body.appendChild(b); }
    const r = reste();
    b.innerHTML = '🎮 وضع تجريبي · متبقي <b>' + r.s + '</b> حصة · <b>' + r.e + '</b> تمرين · <b>'
      + r.f + '</b> فرض  <button id="trialCta" type="button">أنشئ حسابك للاستمرار ←</button>';
    const c = $('#trialCta');
    if(c) c.addEventListener('click', () => {
      localStorage.removeItem(K);
      location.hash = ''; location.reload();
    });
  }

  /* soft-lock plein écran */
  function lock(){
    if($('#trialLock')) return;
    const d = document.createElement('div'); d.id = 'trialLock';
    d.innerHTML = '<div class="tl-box"><span class="tl-ic">🔒</span>'
      + '<b>انتهت حدود النسخة التجريبية</b>'
      + '<p>استمتعت بـ 3 حصص و10 تمارين وفرض مصغّر.<br>أنشئ حسابك المجاني الآن للاستمرار '
      + 'وحفظ تقدمك على كل أجهزتك.</p>'
      + '<button id="tlGo" class="btn btn-p btn-block">✨ إنشاء حساب / connexion</button>'
      + '<button id="tlPay" class="btn btn-g btn-block">💳 عرض عروض الاشتراك</button></div>';
    document.body.appendChild(d);
    $('#tlGo').addEventListener('click', () => { localStorage.removeItem(K); location.reload(); });
    $('#tlPay').addEventListener('click', () => { localStorage.removeItem(K); location.reload(); });
  }

  function compte(type, n){
    if(!on()) return;
    const t = lit() || { on:true, seances:0, exos:0, fard:0 };
    t[type] = (t[type] || 0) + (n || 1);
    sauve(t);
    bandeau();
    const r = reste();
    if(r.s === 0 || r.e === 0) setTimeout(lock, 400);
  }

  /* activation uniquement via le bouton démo */
  document.addEventListener('click', ev => {
    if(ev.target.closest('#btnDemo')){
      sauve({ on:true, seances:0, exos:0, fard:0, start: Date.now() });
    }
    /* toute vraie connexion efface le trial */
    if(ev.target.closest('#loginForm button[type="submit"]') ||
       ev.target.closest('#signupForm button[type="submit"]')){
      localStorage.removeItem(K);
    }
    /* compteur d'exercices : clics sur réponses MCQ */
    if(on() && ev.target.closest('.rq-o, .qz-opt, [data-opt]')) compte('exos');
  }, true);

  /* compteurs de séances / فرض à chaque changement de vue */
  let dern = '';
  document.addEventListener('dz:view', ev => {
    const v = ev.detail;
    if(!on()){ bandeau(); return; }
    if((v === 'seances' || v === 'classe') && dern !== v) compte('seances');
    if((v === 'examen' || v === 'devoir') && dern !== v) compte('fard');
    dern = v;
    bandeau();
    const r = reste();
    if(r.s === 0 || r.e === 0) lock();
  });

  document.addEventListener('DOMContentLoaded', () => setTimeout(bandeau, 400));
  window.TRIAL = { on: on, reste: reste, max: MAX };
})();
