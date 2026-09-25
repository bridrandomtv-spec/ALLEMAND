/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — quiz.js
   🎯 تمارين تفاعلية · Quiz interactif
   Les 5 questions officielles de l'Unité 1 (source : maquette du professeur)
   + banque étendue aux Unités 2 → 6 (30 questions au total)
   Barème : 1 point par question · feedback immédiat + explication
   Meilleur score conservé localement (localStorage)
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* ═══ Banque de questions — 6 unités × 5 questions ═══
   Format : q = énoncé · o = 4 options · c = index de la bonne réponse
            e = explication (affichée après la réponse) · u = unité   */
const QUIZ_BANK = [
  /* ── الوحدة 1 : Sich vorstellen (les 5 officielles) ── */
  { u:1, q:'كيف تقول «أنا أسمي...» بالألمانية؟',
    o:['Ich komme aus...','Ich heiße...','Ich wohne in...','Ich bin ... Jahre alt'], c:1,
    e:'<span class="de-in">Ich <b>heiße</b>…</span> = أنا أسمي… (من الفعل <b>heißen</b>).' },
  { u:1, q:'تصريف الفعل sein مع «ich» ؟',
    o:['bist','ist','bin','sind'], c:2,
    e:'<span class="de-in">ich <b>bin</b></span> — فعل شاذ! · du bist · er ist · wir sind.' },
  { u:1, q:'أداة الاستفهام بمعنى «من أين» ؟',
    o:['Wie','Woher','Wo','Was'], c:1,
    e:'<span class="de-in"><b>Woher</b></span> = من أين (Wo + her) · <span class="de-in">Wohin</span> = إلى أين.' },
  { u:1, q:'كيف تقول «مساء الخير» بالألمانية؟',
    o:['Guten Morgen','Guten Tag','Guten Abend','Gute Nacht'], c:2,
    e:'<span class="de-in">Guten Abend</span> = مساء الخير · <span class="de-in">Gute Nacht</span> = تصبح على خير (قبل النوم).' },
  { u:1, q:'رتّب : alt / ich / 16 / Jahre / bin',
    o:['Ich alt bin 16 Jahre.','Ich bin 16 Jahre alt.','16 Jahre ich bin alt.','Bin ich 16 Jahre alt.'], c:1,
    e:'الفعل في <b>المركز الثاني</b> : <span class="de-in">Ich <b>bin</b> 16 Jahre alt.</span>' },

  /* ── الوحدة 2 : Familie und Freunde ── */
  { u:2, q:'أداة الملكية «ـي» مع كلمة مؤنثة (meine …) : «هذا أختي»',
    o:['Das ist mein Schwester.','Das ist meine Schwester.','Das ist meinen Schwester.','Das ist meiner Schwester.'], c:1,
    e:'<span class="de-in">die Schwester</span> مؤنث → <b>meine</b> Schwester (Nominativ).' },
  { u:2, q:'«لديّ أخ» — اختر الجملة الصحيحة :',
    o:['Ich habe ein Bruder.','Ich habe einen Bruder.','Ich habe eine Bruder.','Ich habe dem Bruder.'], c:1,
    e:'<span class="de-in">der Bruder</span> مذكر + <b>Akkusativ</b> → <b>einen</b> Bruder.' },
  { u:2, q:'جمع «das Kind» هو :',
    o:['die Kinds','die Kinder','das Kinder','die Kindern'], c:1,
    e:'<span class="de-in">das Kind → die <b>Kinder</b></span> (pluriel en -er).' },
  { u:2, q:'«Das gefällt ___ .» (لي)',
    o:['ich','mich','mir','mein'], c:2,
    e:'<span class="de-in">gefallen</span> يأخذ <b>Dativ</b> → Das gefällt <b>mir</b>.' },
  { u:2, q:'«die Geschwister» تعني :',
    o:['الوالدان','الإخوة والأخوات','الأجداد','الأقارب'], c:1,
    e:'<span class="de-in">die Geschwister</span> = الإخوة والأخوات معاً (جمع دائماً).' },

  /* ── الوحدة 3 : Schule und Ausbildung ── */
  { u:3, q:'«Ich ___ gut schwimmen.» (أستطيع)',
    o:['kann','könnt','können','kannst'], c:0,
    e:'<span class="de-in">ich <b>kann</b></span> — بدون -e ! الأفعال الناقصة تغيّر الجذر.' },
  { u:3, q:'رتّب : Deutsch / ich / sprechen / kann',
    o:['Ich kann Deutsch sprechen.','Ich kann sprechen Deutsch.','Kann ich Deutsch sprechen.','Ich Deutsch kann sprechen.'], c:0,
    e:'الفعل الناقص في المركز 2 و<b>المصدر في الآخر</b> (Satzklammer).' },
  { u:3, q:'«___ Montag habe ich Deutsch.»',
    o:['In','Am','Um','An'], c:1,
    e:'أيام الأسبوع → <b>am</b> (= an dem). الساعات → <b>um</b>. الشهور/الفصول → <b>im</b>.' },
  { u:3, q:'«halb neun» تعني :',
    o:['9:30','8:30','9:00','8:00'], c:1,
    e:'⚠️ <span class="de-in">halb neun</span> = <b>8:30</b> («نصف الطريق إلى التاسعة»). الخطأ رقم 1 عند الجزائريين!' },
  { u:3, q:'«In der Bibliothek ___ man nicht laut sprechen.» (يُمنع)',
    o:['kann','muss','darf','soll'], c:2,
    e:'المنع = <span class="de-in"><b>dürfen</b> + nicht</span>. أما <b>müssen nicht</b> = «غير مُلزَم».' },

  /* ── الوحدة 4 : Alltag und Freizeit ── */
  { u:4, q:'«Ich ___ um 6 Uhr ___ .» (أستيقظ)',
    o:['stehe … auf','auf … stehe','stehe auf …','aufstehe …'], c:0,
    e:'فعل انفصالي : الجذر في المركز 2 و<b>البادئة في الآخر</b> → stehe … <b>auf</b>.' },
  { u:4, q:'«Gestern ___ ich früh aufgestanden.»',
    o:['habe','bin','war','werde'], c:1,
    e:'<span class="de-in">aufstehen</span> = تغيّر حالة → المساعد <b>sein</b>.' },
  { u:4, q:'صيغة الأمر (du) من «nehmen» :',
    o:['Nehme!','Nimm!','Nehmt!','Nehmen Sie!'], c:1,
    e:'فعل قوي : <span class="de-in">du n<b>i</b>mmst</span> → <b>Nimm!</b> (بدون -st وبدون ضمير).' },
  { u:4, q:'«Ich fahre ___ dem Bus ___ Schule.»',
    o:['mit … zur','nach … zur','zu … nach','mit … nach'], c:0,
    e:'الوسيلة → <b>mit</b> + Dativ · المدرسة → <b>zu + der = zur</b> Schule.' },
  { u:4, q:'أفضل صيغة للاقتراح على صديق :',
    o:['Wir gehen ins Kino!','Geh ins Kino!','Wollen wir ins Kino gehen?','Ich gehe ins Kino.'], c:2,
    e:'<span class="de-in"><b>Wollen wir</b> … ?</span> أو <span class="de-in"><b>Lass uns</b> … !</span> = اقتراح مهذّب.' },

  /* ── الوحدة 5 : Essen und Trinken ── */
  { u:5, q:'«Ich esse ___ Apfel.»',
    o:['ein','einen','eine','einem'], c:1,
    e:'<span class="de-in">der Apfel</span> مذكر + <b>Akkusativ</b> → <b>einen</b>.' },
  { u:5, q:'الصيغة الأكثر تهذيباً للطلب في مطعم :',
    o:['Ich will einen Kaffee.','Gib mir einen Kaffee.','Ich hätte gern einen Kaffee.','Ich brauche Kaffee.'], c:2,
    e:'<span class="de-in">Ich <b>hätte gern</b>…</span> = Konjunktiv II من haben → الأكثر أدباً.' },
  { u:5, q:'صيغة الأمر (Sie) من «schneiden» :',
    o:['Schneide!','Schneidet!','Schneiden Sie!','Schnitt!'], c:2,
    e:'أمر Sie = <b>المصدر + Sie</b> → <span class="de-in">Schneiden Sie!</span>' },
  { u:5, q:'أي كلمة ليس لها جمع؟',
    o:['das Ei','der Fisch','das Obst','die Tomate'], c:2,
    e:'<span class="de-in">das Obst</span> (الفواكه) اسم جمعي → <b>لا جمع له</b>. وكذلك das Gemüse.' },
  { u:5, q:'«Es ist wichtig, viel Wasser ___ .»',
    o:['trinken','zu trinken','trinkt','getrunken'], c:1,
    e:'بعد <span class="de-in">Es ist wichtig, …</span> نستعمل <b>zu + المصدر</b> في آخر الجملة.' },

  /* ── الوحدة 6 : Reisen und Verkehr ── */
  { u:6, q:'«Wie komme ich ___ Bahnhof?»',
    o:['zum','zur','in den','an dem'], c:0,
    e:'<span class="de-in">der Bahnhof</span> مذكر → <b>zu + dem = zum</b>.' },
  { u:6, q:'«___ gehe ich zum Bahnhof?» (أين)',
    o:['Wohin','Wo','Woher','Wann'], c:1,
    e:'<b>Wo</b> = أين (موقع) · <b>Wohin</b> = إلى أين (اتجاه) · <b>Woher</b> = من أين (أصل).' },
  { u:6, q:'«Wir ___ nach Oran gefahren.»',
    o:['haben','sind','werden','waren'], c:1,
    e:'<span class="de-in">fahren</span> = تنقّل → المساعد <b>sein</b>.' },
  { u:6, q:'«Der Zug fährt um 8 Uhr ___ .» (ينطلق)',
    o:['aus','ab','an','weg'], c:1,
    e:'<span class="de-in"><b>abfahren</b></span> → البادئة <b>ab</b> في آخر الجملة. الوصول = <b>ankommen</b>.' },
  { u:6, q:'«Berlin ist ___ (groß) als Oran.»',
    o:['größer','größter','mehr groß','am größten'], c:0,
    e:'المقارنة : <b>größer als</b> (مع umlaut). التفضيل : <b>am größten</b>.' }
];

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const K_BEST = 'dz_de_quiz_best_v1';
  const K_HIST = 'dz_de_quiz_hist_v1';
  const LETTRES = ['A','B','C','D'];
  const PAR_SERIE = 5;                       /* 5 أسئلة في كل سلسلة (comme la maquette) */

  let filtre = 0;          /* 0 = كل الوحدات · 1..6 = وحدة */
  let melange = true;      /* خلط الأسئلة والسلاسل */
  let serie = [];          /* questions de la série courante */
  let idx = 0, score = 0, repondu = false;
  let vue = 'accueil';     /* accueil | jeu | resultat */

  /* ── Persistance ── */
  function best(){ try{ return JSON.parse(localStorage.getItem(K_BEST) || '{}'); }catch(e){ return {}; } }
  function setBest(cle, v){
    const b = best();
    if(!b[cle] || v > b[cle].score) b[cle] = { score:v, total:PAR_SERIE, at:Date.now() };
    try{ localStorage.setItem(K_BEST, JSON.stringify(b)); }catch(e){}
  }
  function hist(){ try{ return JSON.parse(localStorage.getItem(K_HIST) || '[]'); }catch(e){ return []; } }
  function pushHist(o){
    const h = hist(); h.push(o);
    try{ localStorage.setItem(K_HIST, JSON.stringify(h.slice(-40))); }catch(e){}
  }

  /* ── Sélection des questions ── */
  function pool(){
    return filtre ? QUIZ_BANK.filter(q => q.u === filtre) : QUIZ_BANK.slice();
  }
  function melanger(t){
    const a = t.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function nouvelleSerie(){
    let p = pool();
    if(!p.length){ toast('⚠️ لا أسئلة متوفرة لهذه الوحدة — اختر « الكل »', ''); return false; }
    if(melange) p = melanger(p);
    serie = p.slice(0, PAR_SERIE);
    /* mélange aussi l'ordre des options, en suivant la bonne réponse */
    if(melange){
      serie = serie.map(q => {
        const idxs = melange([0,1,2,3]);
        return { u:q.u, q:q.q, e:q.e,
                 o: idxs.map(i => q.o[i]),
                 c: idxs.indexOf(q.c) };
      });
    }
    idx = 0; score = 0; repondu = false;
  }

  /* ── liaison DIRECTE des boutons après chaque render (immune à toute
     interception/exception silencieuse) + erreur visible si ça casse ── */
  function brancher(box){
    const st = box.querySelector('#qzStart');
    if(st) st.addEventListener('click', () => {
      try{
        if(nouvelleSerie() === false) return;
        vue = 'jeu'; render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }catch(e){ toast('⚠️ ' + ((e && e.message) || e), ''); }
    });
    box.querySelectorAll('[data-unite]').forEach(b =>
      b.addEventListener('click', () => { filtre = +b.dataset.unite; render(); }));
    const qt = box.querySelector('#qzQuit');
    if(qt) qt.addEventListener('click', () => { vue = 'accueil'; render(); });
    box.querySelectorAll('.qz-o').forEach(o =>
      o.addEventListener('click', () => { if(!o.disabled) repondre(+o.dataset.i); }));
    const nx = box.querySelector('#qzNext');
    if(nx) nx.addEventListener('click', () => suivant());
    const ag = box.querySelector('#qzAgain');
    if(ag) ag.addEventListener('click', () => {
      try{
        if(nouvelleSerie() === false) return;
        vue = 'jeu'; render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }catch(e){ toast('⚠️ ' + ((e && e.message) || e), ''); }
    });
    const hm = box.querySelector('#qzHome');
    if(hm) hm.addEventListener('click', () => { vue = 'accueil'; render(); });
  }
  /* ── Rendu ── */
  var render = function(){
    const box = $('#quizBody'); if(!box) return;
    if(vue === 'accueil')  box.innerHTML = vueAccueil();
    if(vue === 'jeu')      box.innerHTML = vueJeu();
    if(vue === 'resultat') box.innerHTML = vueResultat();
  }

  function vueAccueil(){
    const b = best();
    const h = hist();
    const parU = {};
    QUIZ_BANK.forEach(q => { parU[q.u] = (parU[q.u] || 0) + 1; });
    const totalQ = QUIZ_BANK.length;
    const moy = h.length ? (h.reduce((a,x) => a + x.score, 0) / h.length) : null;

    return '<div class="card qz-hero">' +
      '<div><div class="ch-badge">🎯 تمارين تفاعلية — تصحيح فوري</div>' +
      '<h2>اختبر معلوماتك</h2>' +
      '<div class="ch-sub">' + totalQ + ' سؤالاً · ' + Object.keys(parU).length +
        ' وحدات · ' + PAR_SERIE + ' أسئلة في كل سلسلة · نقطة واحدة لكل سؤال</div>' +
      '<div class="chips" style="margin-top:10px">' +
        '<span class="sec-pill">🏆 أفضل نتيجة : ' + (b['u' + filtre] ? b['u' + filtre].score + '/' + PAR_SERIE : '—') + '</span>' +
        '<span class="sec-pill or">📝 محاولاتك : ' + h.length + '</span>' +
        '<span class="sec-pill rg">📊 معدّلك : ' + (moy === null ? '—' : moy.toFixed(1) + '/' + PAR_SERIE) + '</span>' +
      '</div></div>' +
      '<button class="btn btn-p qz-start" id="qzStart">🚀 ابدأ التمارين</button>' +
      '</div>' +

      '<div class="card"><h2>📚 اختر الوحدة</h2>' +
      '<div class="qz-unites">' +
        '<button class="qz-u' + (filtre===0?' on':'') + '" data-unite="0">' +
          '<b>🎲 الكل</b><i>' + totalQ + ' سؤالاً · سحب عشوائي</i></button>' +
        [1,2,3,4,5,6].map(u => {
          const n = parU[u] || 0;
          const bt = b['u' + u];
          const nm = ({1:'التعريف بالنفس',2:'العائلة والأصدقاء',3:'المدرسة والتكوين',
                       4:'الحياة اليومية',5:'المأكل والمشرب',6:'السفر والنقل'})[u];
          return '<button class="qz-u' + (filtre===u?' on':'') + '" data-unite="' + u + '">' +
            '<b>الوحدة ' + u + '</b><i>' + nm + ' · ' + n + ' أسئلة</i>' +
            (bt ? '<span class="qz-b">🏆 ' + bt.score + '/' + PAR_SERIE + '</span>' : '') +
            '</button>';
        }).join('') +
      '</div>' +
      '<label class="qz-opt"><input type="checkbox" id="qzMelange"' + (melange?' checked':'') + '>' +
      ' 🔀 خلط الأسئلة و ترتيب الخيارات</label></div>' +

      '<div class="grid2">' +
        '<div class="card"><h2>📈 آخر محاولاتك</h2>' + dernieresTentatives(h) + '</div>' +
        '<div class="card"><h2>🧭 كيف تعمل التمارين؟</h2>' +
          '<ol class="qz-regles">' +
          '<li>تُسحب <b>' + PAR_SERIE + ' أسئلة</b> من الوحدة المختارة.</li>' +
          '<li>4 خيارات (A · B · C · D) — <b>واحد فقط</b> صحيح.</li>' +
          '<li>التصحيح <b>فوري</b> مع شرح القاعدة بالعربية والألمانية.</li>' +
          '<li>النتيجة النهائية <b>/5</b> + أفضل نتيجة محفوظة على جهازك.</li>' +
          '<li>🔒 نتيجتك <b>سرّية</b> — لا تُرسل لأي خادم (منهج الحصة 7).</li>' +
          '</ol>' +
          '<button class="btn btn-o btn-block" data-go="seances">📚 راجع الحصص أولاً</button>' +
        '</div>' +
      '</div>';
  }

  function dernieresTentatives(h){
    if(!h.length) return '<p style="color:var(--m);font-size:13px">لا توجد محاولات بعد — اضغط «ابدأ التمارين».</p>';
    return '<div class="qz-hist">' + h.slice(-8).reverse().map(x => {
      const pct = Math.round(x.score / PAR_SERIE * 100);
      const cls = pct >= 80 ? 'ok' : (pct >= 60 ? 'mid' : 'ko');
      return '<div class="qh"><div><b>' + (x.unite ? 'الوحدة ' + x.unite : '🎲 الكل') + '</b>' +
        '<i>' + esc(x.date) + '</i></div>' +
        '<span class="qh-n ' + cls + '">' + x.score + '/' + PAR_SERIE + '</span></div>';
    }).join('') + '</div>';
  }

  function vueJeu(){
    if(!serie.length) nouvelleSerie();
    const q = serie[idx];
    const pct = Math.round(idx / serie.length * 100);
    return '<div class="card qz-play">' +
      '<div class="qz-top">' +
        '<button class="btn btn-o btn-sm" id="qzQuit">↩️ خروج</button>' +
        '<div class="qz-prog-t">السؤال <b>' + (idx + 1) + '</b> من ' + serie.length + '</div>' +
        '<div class="qz-score-t">النقاط : <b>' + score + '/' + serie.length + '</b></div>' +
      '</div>' +
      '<div class="progress-wrap"><div class="progress" style="width:' + pct + '%"></div></div>' +
      '<div class="qz-q"><span class="qz-badge">الوحدة ' + q.u + '</span>' + esc(q.q) + '</div>' +
      '<div class="qz-opts" id="qzOpts">' +
        q.o.map((o, i) => '<button class="qz-o" data-i="' + i + '">' +
          '<span class="qz-l">' + LETTRES[i] + '</span><span>' + esc(o) + '</span></button>').join('') +
      '</div>' +
      '<div id="qzFb"></div>' +
      '<div class="qz-nav"><button class="btn btn-p" id="qzNext" hidden>' +
        (idx === serie.length - 1 ? '🏁 النتيجة النهائية' : 'السؤال التالي ←') +
      '</button></div>' +
      '</div>';
  }

  function vueResultat(){
    const pct = Math.round(score / serie.length * 100);
    const cls = pct >= 80 ? 'ok' : (pct >= 60 ? 'md' : 'ko');
    const msg = pct === 100 ? '🏆 ممتاز — علامة كاملة! Sehr gut!' :
                pct >= 80  ? '👏 جيد جداً — Gut gemacht!' :
                pct >= 60  ? '📖 حسن — راجع الأخطاء ثم أعد المحاولة.' :
                             '🔁 تحتاج مراجعة الحصص — لا تستسلم!';
    const conseil = pct >= 80 ? 'انتقل إلى الوحدة الموالية أو جرّب 🎓 محاكاة بظروف حقيقية.'
                              : 'عُد إلى 📚 الحصص و 📘 مكتبة القواعد، ثم أعد السلسلة.';
    return '<div class="card result"><div class="mini-i">🎯</div>' +
      '<div class="result-n ' + cls + '">' + score + '<span style="font-size:22px;color:var(--m)">/' +
        serie.length + '</span></div>' +
      '<div class="result-l">' + msg + '</div>' +
      '<div style="font-size:12.5px;color:var(--m);margin-top:7px">' +
        (filtre ? 'الوحدة ' + filtre : 'كل الوحدات') + ' · ' + pct + '% إجابات صحيحة</div>' +
      '<div class="secret">🔒 نتيجتك سرّية — محفوظة على جهازك فقط</div>' +
      '<div style="margin-top:14px;font-size:13px;color:var(--m)">' + conseil + '</div>' +
      '</div>' +
      '<div class="card"><h2>📝 مراجعة الأسئلة</h2>' +
        serie.map((q, i) => {
          const rep = q._rep;
          const bon = rep === q.c;
          return '<div class="qz-rev ' + (bon ? 'ok' : 'ko') + '">' +
            '<div class="qr-h"><span class="qr-n">' + (i + 1) + '</span>' + esc(q.q) + '</div>' +
            '<div class="qr-b">' + (bon ? '✅ ' : '❌ ') + 'إجابتك : <b>' +
              (rep === null || rep === undefined ? '—' : esc(q.o[rep])) + '</b>' +
              (bon ? '' : '<br>✔️ الصحيح : <b>' + esc(q.o[q.c]) + '</b>') + '</div>' +
            '<div class="qr-e">💡 ' + q.e + '</div></div>';
        }).join('') +
      '</div>' +
      '<div style="display:flex;gap:11px;flex-wrap:wrap">' +
        '<button class="btn btn-p" id="qzAgain">🔄 إعادة التمارين</button>' +
        '<button class="btn btn-o" id="qzHome">🎯 سلسلة أخرى</button>' +
        '<button class="btn btn-g" data-go="seances">📚 الحصص</button>' +
        '<button class="btn btn-o" data-go="simulation">🎓 محاكاة /20</button>' +
      '</div>';
  }

  /* ── Interaction ── */
  function repondre(i){
    if(repondu) return;
    repondu = true;
    const q = serie[idx];
    q._rep = i;
    const bon = i === q.c;
    if(bon) score++;
    /* 🧠 mémoire : chaque erreur devient une carte de révision espacée. */
    if(!bon && window.MEMOIRE && window.MEMOIRE.record){
      try{
        const opts = (q.o || q.opts || []);
        window.MEMOIRE.record({ q: q.q, bad: opts[i], good: opts[q.c],
          comp: q.comp || ('unité ' + (q.u || filtre)),
          unite: q.u || filtre, src: 'quiz' });
      }catch(e){}
    }

    $$('#qzOpts .qz-o').forEach((b, k) => {
      b.disabled = true;
      if(k === q.c) b.classList.add('correct');
      else if(k === i) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    const st = $('.qz-score-t b'); if(st) st.textContent = score + '/' + serie.length;

    const fb = $('#qzFb');
    if(fb) fb.innerHTML = '<div class="qz-fb ' + (bon ? 'ok' : 'ko') + '">' +
      '<b>' + (bon ? '✅ إجابة صحيحة! +1 نقطة' : '❌ إجابة خاطئة') + '</b>' +
      '<div class="qz-ex">💡 ' + q.e + '</div></div>';
    const nx = $('#qzNext'); if(nx) nx.hidden = false;
  }

  function suivant(){
    if(idx < serie.length - 1){
      idx++; repondu = false; render();
      const t = $('.qz-play'); if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
    } else {
      terminer();
    }
  }

  function terminer(){
    setBest('u' + filtre, score);
    pushHist({ unite: filtre, score: score, total: PAR_SERIE,
               pct: Math.round(score / PAR_SERIE * 100),
               date: new Date().toLocaleString('fr-DZ'), at: Date.now() });
    vue = 'resultat'; render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(window.DZ && DZ.speak && score === serie.length) DZ.speak('Sehr gut! Perfekt!');
    toast('🎯 نتيجتك : ' + score + '/' + serie.length, score >= serie.length * 0.6 ? 'ok' : '');
  }

  /* ── Événements ── */
  document.addEventListener('click', ev => {
    if(ev.target.closest && ev.target.closest('#quizBody')) return;
    const u = ev.target.closest('[data-unite]');
    if(u){ filtre = +u.dataset.unite; render(); return; }

    if(ev.target.closest('#qzStart')){
      nouvelleSerie(); vue = 'jeu'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if(ev.target.closest('#qzQuit')){ vue = 'accueil'; render(); return; }
    if(ev.target.closest('#qzAgain')){
      nouvelleSerie(); vue = 'jeu'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if(ev.target.closest('#qzHome')){ vue = 'accueil'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    const o = ev.target.closest('.qz-o');
    if(o && !o.disabled){ repondre(+o.dataset.i); return; }
    if(ev.target.closest('#qzNext')){ suivant(); return; }
  });

  document.addEventListener('change', ev => {
    const m = ev.target.closest('#qzMelange');
    if(m){ melange = m.checked;
      toast(melange ? '🔀 الخلط مُفعَّل' : '📋 الترتيب الأصلي', ''); return; }
  });

  /* raccourcis clavier A/B/C/D ou 1-4 pendant le jeu */
  document.addEventListener('keydown', ev => {
    if(vue !== 'jeu' || repondu) return;
    const k = ev.key.toLowerCase();
    const map = { a:0, b:1, c:2, d:3, '&':0, 'é':1, '"':2, "'":3, '1':0, '2':1, '3':2, '4':3 };
    if(k in map){ ev.preventDefault(); repondre(map[k]); }
    if(k === 'enter' && $('#qzNext') && !$('#qzNext').hidden) suivant();
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'quiz') render(); });
  const _render0 = render;
  render = function(){ _render0(); const bx = document.getElementById('quizBody'); if(bx) brancher(bx); };
  window.renderQuiz = render;
  window.DZ_QUIZ = { render:render, bank:QUIZ_BANK, nouvelleSerie:nouvelleSerie,
                     PAR_SERIE:PAR_SERIE, best:best, hist:hist };
})();
