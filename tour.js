/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — tour.js
   🎬 جولة مظلَّلة (spotlight) عند أول دخول : 8 محطات، فقاعة شرح،
   التالي / تخطي. تُحفظ في localStorage (مرة واحدة) + قابلة للإعادة من 📖 الدليل.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const KEY = 'dz_tour_done';
  const STEPS = [
    { view:'masar', sel:'.ms-next',
      t:'🧭 مسارك — بوصلتك',
      x:'هنا شيء واحد فقط عليك فعله الآن : مراجعة مستحقة أو الحصة الموالية. المنصة تختار لك.' },
    { view:'masar', sel:'.ms-prog, .ms-weak',
      t:'📈 تقدمك ونقاط ضعفك',
      x:'نسبة إنجاز الوحدة وأضعف كفاءتين — تتحدّثان تلقائيًا من ذاكرة أخطائك.' },
    { view:'seances', sel:'#seancesBody',
      t:'📚 الحصص',
      x:'كل وحدة : مفردات 🔊 + قاعدة + تمارين مصحَّحة فورًا. افتح حصتك وابدأ.' },
    { view:'revision', sel:'#memoBody',
      t:'🧠 ذاكرتك (Leitner)',
      x:'كل خطأ يصبح بطاقة تعود J+1 ثم J+3 ثم J+7 ثم J+21. « كنت أعرف / لم أعرف ».' },
    { view:'rag', sel:'#ragForm',
      t:'🔎 اسأل المنصة',
      x:'اكتب أو 🎤🗣 انطق سؤالك : شرح، تمارين، فرض، قاعدة، ترجمة… والجواب 🔊 بصوت رجل.' },
    { view:'malakhiss', sel:'#malakhissBody',
      t:'📑 الملخصات',
      x:'16 ملخص وحدة + 128 ملخص نص درس — مراجعتك السريعة قبل الفروض.' },
    { view:'banque', sel:'#banqueBody',
      t:'✍️ البنك',
      x:'50 تمرين مصحَّح + 12 fiche + موضوعا BAC. كل خطأ يذهب لذاكرتك.' },
    { view:'compte', sel:'#compteBody',
      t:'⚙️ حسابك',
      x:'ملفك، مفتاح البريد، إعادة الترحيب… ومن 📖 الدليل تُعيد هذه الجولة متى شئت.' }
  ];
  let i = 0, spot = null, bub = null, actif = false;

  function cree(){
    if(spot) return;
    spot = document.createElement('div'); spot.id = 'tourSpot';
    bub = document.createElement('div'); bub.id = 'tourBub';
    document.body.appendChild(spot); document.body.appendChild(bub);
  }
  function cache(){
    if(spot){ spot.remove(); spot = null; }
    if(bub){ bub.remove(); bub = null; }
    actif = false;
  }
  function place(el){
    const r = el.getBoundingClientRect();
    const pad = 8;
    spot.style.top = (r.top - pad) + 'px';
    spot.style.left = (r.left - pad) + 'px';
    spot.style.width = (r.width + pad * 2) + 'px';
    spot.style.height = (r.height + pad * 2) + 'px';
    const bh = 190;
    let top = r.bottom + 14;
    if(top + bh > window.innerHeight) top = Math.max(12, r.top - bh - 14);
    bub.style.top = top + 'px';
    bub.style.left = Math.max(12, Math.min(window.innerWidth - 320, r.left)) + 'px';
  }
  function montre(){
    if(!actif) return;
    const s = STEPS[i];
    if(!s){ finit(true); return; }
    if(s.view && window.go){ try{ window.go(s.view); }catch(e){} }
    let essais = 0;
    const cherche = () => {
      const el = $(s.sel);
      if(el){
        el.scrollIntoView({ block:'center', behavior:'instant' });
        setTimeout(() => {
          place(el);
          bub.innerHTML = '<b>' + s.t + '</b><p>' + s.x + '</p>'
            + '<div class="tb-btns"><button id="tbNext" class="btn btn-p btn-sm">'
            + (i === STEPS.length - 1 ? '✅ إنهاء' : 'التالي ←') + '</button>'
            + '<button id="tbSkip" class="btn btn-o btn-sm">تخطي</button>'
            + '<span class="tb-num">' + (i + 1) + '/' + STEPS.length + '</span></div>';
          $('#tbNext').addEventListener('click', () => { i++; montre(); });
          $('#tbSkip').addEventListener('click', () => finit(true));
        }, 120);
      }else if(++essais < 12){ setTimeout(cherche, 150); }
      else { i++; montre(); }
    };
    cherche();
  }
  function finit(sauvegarde){
    if(sauvegarde){ try{ localStorage.setItem(KEY, '1'); }catch(e){} }
    cache();
  }
  function start(){
    cree();
    i = 0; actif = true;
    spot.style.display = 'block'; bub.style.display = 'block';
    montre();
  }
  function dejaFait(){ try{ return localStorage.getItem(KEY) === '1'; }catch(e){ return true; } }

  document.addEventListener('dz:auth', e => {
    if(e.detail && !dejaFait()) setTimeout(start, 700);
  });
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const s = window.AUTH && AUTH.session && AUTH.session();
      if(s && !dejaFait()) start();
    }, 900);
  });
  window.TOUR = { start: start, steps: STEPS.length };
})();
