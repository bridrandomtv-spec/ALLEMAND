/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — guide.js
   🎉 رسالة ترحيب + 🎯 هدف المنصة + 📖 دليل الاستعمال (mode d'emploi)
   · Affiché UNE seule fois après création de compte / première connexion.
   · Personnalisé par rôle (تلميذ · أستاذ · ولي) et genre (طالب / طالبة).
   · Vue 📖 الدليل accessible à tout moment depuis la navigation.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const K_ONB = 'dz_de_onboarded_v1';

  let D = null;
  let roleActif = 'eleve';

  async function charge(){
    if(D) return D;
    try{
      const r = await fetch('assets/bdd/onboarding.json', { cache:'force-cache' });
      if(!r.ok) throw new Error('HTTP ' + r.status);
      D = await r.json();
    }catch(e){ D = null; }
    return D;
  }

  /* ── Message de bienvenue personnalisé ── */
  function messageBienvenue(s){
    if(!D) return null;
    const b = D.bienvenue || {};
    const genre = (s.genre || s.genre_ar || '');
    const fem = /أنثى|طالبة|f/.test(genre);
    let tpl;
    if(s.role === 'prof')        tpl = b.prof;
    else if(s.role === 'parent') tpl = b.parent;
    else                         tpl = fem ? b.eleve_f : b.eleve_m;
    if(!tpl) return null;
    return tpl.replace(/\{nom\}/g, s.nom || '').replace(/\{classe\}/g, s.classe_ar || s.classe || '');
  }

  /* ── Modale d'onboarding (une seule fois) ── */
  async function montreOnboarding(s, force){
    const d = await charge(); if(!d) return;
    let deja = false;
    try{ deja = localStorage.getItem(K_ONB + ':' + (s.user || s.nom)) === '1'; }catch(e){}
    if(deja && !force) return;

    const msg = messageBienvenue(s) || '';
    const role = (s.role === 'prof') ? 'prof' : (s.role === 'parent') ? 'parent' : 'eleve';
    roleActif = role;

    const box = document.createElement('div');
    box.id = 'onbModal';
    box.className = 'onb';
    box.innerHTML =
        '<div class="onb-card">'
      +   '<button class="onb-x" id="onbClose" aria-label="fermer">✕</button>'
      +   '<div class="onb-welcome">' + esc(msg).replace(/\n/g, '<br>') + '</div>'
      +   '<div class="onb-tabs">'
      +     '<button class="onb-t on" data-onb="objectif">🎯 هدف المنصة</button>'
      +     '<button class="onb-t" data-onb="guide">📖 دليل الاستعمال</button>'
      +     '<button class="onb-t" data-onb="pas">🚀 أول خطوات</button>'
      +   '</div>'
      +   '<div class="onb-body" id="onbBody"></div>'
      +   '<div class="onb-foot">'
      +     '<button class="btn btn-p btn-block" id="onbOk">✅ فهمت، لنبدأ</button>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(box);

    const corps = $('#onbBody', box);
    function peint(ong){
      $$('.onb-t', box).forEach(b => b.classList.toggle('on', b.dataset.onb === ong));
      if(ong === 'objectif'){
        corps.innerHTML = '<p class="onb-ch">' + esc(d.objectif.chapeau) + '</p>'
          + '<div class="onb-pts">' + d.objectif.points.map(p =>
              '<div class="onb-p"><span>' + esc(p.icon) + '</span><div><b>' + esc(p.t) +
              '</b><i>' + esc(p.d) + '</i></div></div>').join('') + '</div>';
      }else if(ong === 'guide'){
        corps.innerHTML = guideHTML(d, role);
      }else{
        corps.innerHTML = '<ol class="onb-steps">' + (d.premiers_pas || []).map(p =>
          '<li>' + esc(p) + '</li>').join('') + '</ol>';
      }
    }
    peint('objectif');
    greffeBoutonMail(box, s);
    $$('.onb-t', box).forEach(b => b.addEventListener('click', () => peint(b.dataset.onb)));

    function ferme(){
      try{ localStorage.setItem(K_ONB + ':' + (s.user || s.nom), '1'); }catch(e){}
      box.remove();
    }
    $('#onbClose', box).addEventListener('click', ferme);
    $('#onbOk', box).addEventListener('click', ferme);
  }

  function guideHTML(d, role){
    const steps = (d.mode_emploi || {})[role] || [];
    return '<div class="onb-steps2">' + steps.map(p =>
        '<div class="onb-g"><span class="onb-gi">' + esc(p.icon) + '</span><div><b>' +
        esc(p.t) + '</b><i>' + esc(p.d) + '</i></div></div>').join('') + '</div>';
  }

  /* ── Vue 📖 الدليل (persistante) ── */
  async function renderGuide(){
    const box = $('#guideBody'); if(!box) return;
    const d = await charge();
    if(!d){ box.innerHTML = '<div class="bdd-status err">❌ تعذّر تحميل الدليل</div>'; return; }
    let s = null;
    try{ s = (window.AUTH && AUTH.session) ? AUTH.session() : null; }catch(e){}
    const role = s ? ((s.role === 'prof') ? 'prof' : (s.role === 'parent') ? 'parent' : 'eleve')
                   : roleActif;

    let h = '<div class="gd-hero"><span class="gd-crest">📖</span><div>'
      + '<h2>دليل الاستعمال — mode d’emploi</h2>'
      + '<p class="gd-sub">كيف تستفيد من المنصة حسب دورك</p></div></div>'
      + '<div class="gd-roles">'
      +   [['eleve','🎓 تلميذ / طالبة'],['prof','🧑‍🏫 أستاذ'],['parent','👨‍👩‍👧 وليّ أمر']]
            .map(r => '<button class="gd-r' + (r[0] === role ? ' on' : '') + '" data-grole="' + r[0] + '">'
              + r[1] + '</button>').join('')
      + '</div>'
      + '<div class="gd-obj"><h3>' + esc(d.objectif.titre) + '</h3>'
      +   '<p>' + esc(d.objectif.chapeau) + '</p>'
      +   '<div class="onb-pts">' + d.objectif.points.map(p =>
              '<div class="onb-p"><span>' + esc(p.icon) + '</span><div><b>' + esc(p.t) +
              '</b><i>' + esc(p.d) + '</i></div></div>').join('') + '</div></div>'
      + '<div id="gdSteps">' + guideHTML(d, role) + '</div>'
      + '<div class="gd-pas"><h3>🚀 أول خطوات لك</h3><ol class="onb-steps">'
      +   (d.premiers_pas || []).map(p => '<li>' + esc(p) + '</li>').join('') + '</ol></div>';
    box.innerHTML = h;
    $$('.gd-r', box).forEach(b => b.addEventListener('click', () => {
      roleActif = b.dataset.grole;
      $$('.gd-r', box).forEach(x => x.classList.toggle('on', x === b));
      $('#gdSteps', box).innerHTML = guideHTML(d, roleActif);
    }));
  }


  /* ══════════════════════════════════════════════════════════════════
     📧 Envoi d'une copie de l'accueil au courrier inscrit.
     IMPORTANT (transparence) : ce site est STATIQUE (GitHub Pages), sans
     serveur. Un navigateur ne peut PAS envoyer un courrier seul. On ouvre
     donc le client mail de l'utilisateur, pré-adressé à SON courrier inscrit
     et pré-rempli avec le message complet : il ne reste qu'à appuyer Envoyer.
     Pour un envoi 100% automatique il faudrait un service externe
     (EmailJS / Formspree / un backend) avec une clé — à brancher ici le jour
     où tu en crées une.
     ══════════════════════════════════════════════════════════════════ */
  function texteAccueil(s){
    if(!D) return '';
    const msg = (messageBienvenue(s) || '').replace(/<br\s*\/?>/g, '\n');
    const role = (s.role === 'prof') ? 'prof' : (s.role === 'parent') ? 'parent' : 'eleve';
    const steps = (D.mode_emploi || {})[role] || [];
    let t = msg + '\n\n' + (D.objectif.titre || '') + '\n' + (D.objectif.chapeau || '') + '\n';
    (D.objectif.points || []).forEach(p => { t += '  ' + p.icon + ' ' + p.t + ' — ' + p.d + '\n'; });
    t += '\n📖 دليل الاستعمال :\n';
    steps.forEach(p => { t += '  ' + p.t + ' : ' + p.d + '\n'; });
    t += '\n🚀 أول خطوات :\n';
    (D.premiers_pas || []).forEach(p => { t += '  • ' + p + '\n'; });
    t += '\n— الثانوية الافتراضية الجزائرية · https://bridrandomtv-spec.github.io/ALLEMAND/\n';
    /* mailto a une limite pratique (~2000 caractères) : on tronque proprement. */
    if(t.length > 1800) t = t.slice(0, 1797) + '…';
    return t;
  }


  /* ══════════════════════════════════════════════════════════════════════
     Envoi RÉEL via Resend, à travers TON Worker (worker/resend-welcome.js).
     La clé Resend vit en secret du Worker, JAMAIS ici (dépôt public).
     config.json → resend_proxy vide = repli mailto.
     ══════════════════════════════════════════════════════════════════════ */
  let CFG = null;
  async function chargeConfig(){
    if(CFG) return CFG;
    try{
      const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
      CFG = r.ok ? await r.json() : { resend_proxy: '' };
    }catch(e){ CFG = { resend_proxy: '' }; }
    return CFG;
  }

  async function envoiResend(s){
    /* Ordre de résolution de la clé / du transport :
       1) clé collée UNE fois par le propriétaire dans ⚙️ حسابي → localStorage
          (dz_resend_key) : appel DIRECT api.resend.com, comme ton ancienne app.
       2) config.json → resend_proxy : ton Worker Cloudflare (clé en secret d'env),
          la seule option sûre pour TOUS les visiteurs d'un dépôt public.
       3) repli mailto pré-rempli. */
    let cle = '';
    try{ cle = localStorage.getItem('dz_resend_key') || ''; }catch(e){}
    if(cle){
      try{
        const r = await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':'Bearer ' + cle, 'Content-Type':'application/json' },
          body: JSON.stringify({
            from: (localStorage.getItem('dz_resend_from') || 'onboarding@resend.dev'),
            to: [s.mail || s.email],
            subject: 'مرحبًا بك في الثانوية الافتراضية الجزائرية — دليل الاستعمال',
            html: htmlAccueil(s)
          })
        });
        const j = await r.json().catch(() => ({}));
        if(r.ok) return { ok:true, id:j.id };
        return { ok:false, raison:(j && j.message) || ('http ' + r.status) };
      }catch(e){
        return { ok:false, raison:String(e && e.message || e) };
      }
    }
    const cfg = await chargeConfig();
    let proxy = (cfg && cfg.resend_proxy) || '';
    try{ proxy = localStorage.getItem('dz_resend_proxy') || proxy; }catch(e){}
    if(!proxy) return { ok:false, raison:'aucune clé locale ni proxy configuré' };
    try{
      const r = await fetch(proxy, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ to: s.mail || s.email, nom: s.nom, role: s.role, genre: s.genre })
      });
      const j = await r.json().catch(() => ({}));
      return { ok: !!j.ok, raison: j.err || ('http ' + r.status), id: j.id };
    }catch(e){
      return { ok:false, raison: String(e && e.message || e) };
    }
  }
  window.envoiResend = envoiResend;


  async function envoyerAccueil(s){
    /* 1) envoi RÉEL via Resend (Worker) si configuré */
    const res = await envoiResend(s);
    if(res.ok){
      try{ toast('📧 أُرسلت نسخة إلى ' + (s.mail || s.email || 'بريدك'), 'ok'); }catch(e){}
      return;
    }
    /* 2) repli : client mail pré-adressé + pré-rempli */
    try{ toast('⚠️ الإرسال الآلي غير مفعّل (' + res.raison + ') — فتح البريد', 'ko'); }catch(e){}
    const to = s.mail || s.email || '';
    const sujet = 'مرحبًا بك في الثانوية الافتراضية الجزائرية — دليل الاستعمال';
    const href = 'mailto:' + encodeURIComponent(to) +
                 '?subject=' + encodeURIComponent(sujet) +
                 '&body=' + encodeURIComponent(texteAccueil(s));
    window.location.href = href;
    try{ console.info('[guide] mailto ouvert vers ' + (to || '(adresse vide)')); }catch(e){}
  }
  window.envoyerAccueil = envoyerAccueil;
  window.texteAccueil = texteAccueil;

  /* Bouton 📧 dans la modale d'onboarding */
  function greffeBoutonMail(box, s){
    const foot = $('.onb-foot', box); if(!foot) return;
    if($('#onbMail', foot)) return;
    const b = document.createElement('button');
    b.id = 'onbMail';
    b.className = 'btn btn-o btn-block';
    b.style.marginTop = '8px';
    b.textContent = '📧 إرسال نسخة إلى بريدي (' + (s.mail || s.email || '—') + ')';
    b.addEventListener('click', () => envoyerAccueil(s));
    foot.appendChild(b);
  }

  /* Carte « إعادة عرض الترحيب » dans ⚙️ حسابي */
  function carteCompte(){
    let s = null;
    try{ s = (window.AUTH && AUTH.session) ? AUTH.session() : null; }catch(e){}
    if(!s) return;
    const host = $('#compteBody'); if(!host) return;
    if($('#onbCard')) return;
    const card = document.createElement('div');
    card.id = 'onbCard';
    card.className = 'card onb-carte';
    card.innerHTML =
        '<h3>📖 الترحيب ودليل الاستعمال</h3>'
      + '<p class="onb-carte-p">أعد عرض رسالة الترحيب وهدف المنصة ودليل الاستعمال، '
      + 'أو أرسل نسخة كاملة إلى بريدك المسجّل.</p>'
      + '<div class="onb-carte-b">'
      +   '<button class="btn btn-p btn-sm" id="btnReonb">📖 إعادة عرض الترحيب</button>'
      +   '<button class="btn btn-o btn-sm" id="btnMailAccueil">📧 إرسال نسخة إلى '
      +     esc(s.mail || s.email || 'بريدي') + '</button>'
      + '</div>';
    host.appendChild(card);
    $('#btnReonb', card).addEventListener('click', () => montreOnboarding(s, true));
    $('#btnMailAccueil', card).addEventListener('click', () => envoyerAccueil(s));
  }
  document.addEventListener('dz:view', e => {
    if(e.detail === 'compte') setTimeout(carteCompte, 60);
  });

  /* HTML du message (partagé appel direct / Worker) */
  function htmlAccueil(s){
    const fem = /أنثى|طالبة|f/.test(s.genre || '');
    const salut = s.role === 'prof' ? ('مرحبًا بك أستاذ ' + (s.nom || ''))
                : s.role === 'parent' ? ('مرحبًا بك وليّ الأمر ' + (s.nom || ''))
                : ('مرحبًا بك يا ' + (s.nom || ''));
    const guide = s.role === 'prof'
      ? ['🧑‍🏫 لوحة الأستاذ : نقاط، CSV، قاعة مباشرة','📝 الفروض الرسمية /20','🤖 مساعد التمارين']
      : s.role === 'parent'
      ? ['📈 تقرير أسبوعي : نقاط وحضور','📅 الحصص والفروض القادمة','💬 مراسلة الأستاذ']
      : ['📚 اتبع الحصص بالترتيب (تصحيح فوري)','📝 حلّ الفرض /20 مع التصحيح','🎓 أرشيف البكالوريا · 🤖 اسأل 24/7'];
    return '<div dir="rtl" style="font-family:Tahoma,Segoe UI,sans-serif;background:#04140c;'
      + 'color:#e8edf8;padding:26px;border-radius:18px">'
      + '<h2 style="color:#3ddc84;margin:0 0 6px">🇩🇿 الثانوية الافتراضية الجزائرية</h2>'
      + '<p style="font-size:17px;line-height:1.9">' + salut + ' 👋</p>'
      + '<p style="color:#9fb3c8;line-height:1.9">« الرجوع إلى الأصل فضيلة » — منصّة مجانية '
      + 'مطابقة لمنهاج وزارة التربية.</p>'
      + '<h3 style="color:#e8b64c">📖 دليل الاستعمال</h3>'
      + '<ul style="line-height:2;color:#9fb3c8">' + guide.map(g => '<li>' + g + '</li>').join('')
      + '</ul>'
      + '<p style="margin-top:16px"><a href="https://bridrandomtv-spec.github.io/ALLEMAND/" '
      + 'style="background:#3ddc84;color:#04140c;padding:11px 20px;border-radius:11px;'
      + 'text-decoration:none;font-weight:700">🚀 فتح المنصة</a></p></div>';
  }
  window.htmlAccueil = htmlAccueil;


  /* Carte « 🔑 مفتاح Resend » dans ⚙️ حسابي — clé stockée UNIQUEMENT dans ce navigateur. */
  function carteCle(){
    let s = null;
    try{ s = (window.AUTH && AUTH.session) ? AUTH.session() : null; }catch(e){}
    if(!s) return;
    const host = $('#compteBody'); if(!host || $('#cleCard')) return;
    const card = document.createElement('div');
    card.id = 'cleCard';
    card.className = 'card onb-carte';
    let cle = '';
    try{ cle = localStorage.getItem('dz_resend_key') || ''; }catch(e){}
    card.innerHTML =
        '<h3>🔑 مفتاح Resend (اختياري)</h3>'
      + '<p class="onb-carte-p">لإرسال البريد <b>مباشرة من المتصفح</b> كما في تطبيقك القديم. '
      + 'المفتاح يُحفظ <b>في هذا المتصفح فقط</b>، ولا يُرفع أبدًا إلى المنصة. '
      + 'اتركه فارغًا لاستعمال البريد العادي (mailto).</p>'
      + '<div class="onb-carte-b">'
      +   '<input type="password" id="cleResend" placeholder="re_…" value="' + cle + '" '
      +     'style="flex:1;min-width:180px;background:var(--nuit3);border:1px solid var(--b);'
      +     'border-radius:10px;padding:9px 12px;color:var(--t);font:12px ui-monospace,monospace">'
      +   '<button class="btn btn-p btn-sm" id="btnCleOk">💾 حفظ</button>'
      +   '<button class="btn btn-o btn-sm" id="btnCleTest">📧 اختبار إرسال</button>'
      + '</div>'
      + '<p class="onb-carte-p" id="cleMsg" style="margin-top:9px"></p>';
    host.appendChild(card);
    $('#btnCleOk', card).addEventListener('click', () => {
      const v = ($('#cleResend', card).value || '').trim();
      try{
        if(v) localStorage.setItem('dz_resend_key', v);
        else localStorage.removeItem('dz_resend_key');
      }catch(e){}
      $('#cleMsg', card).textContent = v ? '✅ محفوظ في هذا المتصفح فقط' : '🗑️ تم الحذف';
    });
    $('#btnCleTest', card).addEventListener('click', async () => {
      const msg = $('#cleMsg', card);
      msg.textContent = '⏳ جارٍ الإرسال…';
      const r = await envoiResend(s);
      msg.textContent = r.ok ? ('✅ أُرسلت إلى ' + (s.mail || s.email))
                             : ('⚠️ ' + (r.raison || 'échec'));
    });
  }
  document.addEventListener('dz:view', e => {
    if(e.detail === 'compte') setTimeout(carteCle, 80);
  });

  window.renderGuide = renderGuide;
  window.montrerOnboarding = montreOnboarding;
  document.addEventListener('dz:view', e => { if(e.detail === 'guide') renderGuide(); });
  /* Après une authentification, proposer l'onboarding si première fois. */
  document.addEventListener('dz:auth', e => { if(e.detail) montreOnboarding(e.detail, false); });
})();
