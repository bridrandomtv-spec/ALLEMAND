/* prof_core.js — noyau PUR du moteur PROF (extrait de app.js sans aucune modification
   de logique : base de connaissances + trouver() + estCopie() + corriger() + repondre()).
   Chargé AVANT app.js ; app.js consomme le même objet (const PROF global + window.PROF).
   Extraction additive : permet de tester le moteur PROF sans DOM (tests/regression_prof.mjs). */
'use strict';
const PROF = {
  nom:'Prof. Kharif Ahmed',
  base:[
    {t:'default', k:['salut','bonjour','salam','السلام','مرحبا','hi','hallo','hey','bonsoir','صباح'],
     r:['وعليكم السلام يا ولدي 🇩🇿 <span class="de-in">Hallo! Wie geht es dir?</span>',
        'أهلاً بك! <span class="de-in">Guten Tag!</span> كيف حالك اليوم؟']},
    {t:'default', k:['wie geht','كيف حالك','ça va','labas','لاباس','بخير'],
     r:['<span class="de-in">Mir geht es gut, danke! Und dir?</span> — بخير الحمد لله، و أنت؟',
        'الحمد لله. تذكّر: <span class="de-in">Wie geht es dir?</span> = كيف حالك؟ (غير رسمي)']},
    {t:'salutations', k:['تحية','التحيات','تحيات','salutation','begrüßung','grüße','guten morgen',
                         'guten abend','guten tag','gute nacht','صباح الخير','مساء الخير'],
     r:['🌅 <b>التحيات بالألمانية</b> — <span class="de-in">Guten Morgen</span> (صباحاً، قبل 10 سا) · '
      + '<span class="de-in">Guten Tag</span> (نهاراً) · <span class="de-in">Guten Abend</span> (مساءً) · '
      + '<span class="de-in">Gute Nacht</span> (قبل النوم).',
       '👋 <b>الوداع</b> — رسمي: <span class="de-in">Auf Wiedersehen!</span> · '
      + 'غير رسمي: <span class="de-in">Tschüs!</span> · <span class="de-in">Bis bald!</span> (إلى اللقاء قريباً).',
       '⚠️ الانتباه: <span class="de-in">Gut<b>en</b> Morgen</span> (Akkusativ مذكر) لكن '
      + '<span class="de-in">Gut<b>e</b> Nacht</span> (مؤنث).']},
    {t:'wfragen', k:['استفهام','أدوات الاستفهام','w-fragen','wfragen','w fragen','fragen-wort',
                     'woher','wohin','warum','wann','wie viel','questions en w'],
     r:['❓ <b>أدوات الاستفهام W-Fragen</b> — كلها تبدأ بحرف W، و<b>تأتي في أول الجملة</b>، '
      + 'يليها الفعل مباشرة:<br>'
      + '<span class="de-in"><b>Wie</b> heißt du?</span> = ما اسمك؟<br>'
      + '<span class="de-in"><b>Woher</b> kommst du?</span> = من أين أنت؟<br>'
      + '<span class="de-in"><b>Wo</b> wohnst du?</span> = أين تسكن؟<br>'
      + '<span class="de-in"><b>Wie alt</b> bist du?</span> = كم عمرك؟<br>'
      + '<span class="de-in"><b>Wann</b> beginnt der Unterricht?</span> = متى يبدأ الدرس؟<br>'
      + '<span class="de-in"><b>Warum</b> lernst du Deutsch?</span> = لماذا تتعلّم الألمانية؟',
       '🔑 القاعدة الذهبية: <b>W-Wort + verbe + sujet</b>. لا تضع الفاعل قبل الفعل!<br>'
      + '~~Wie du heißt?~~ ❌ → <span class="de-in">Wie <b>heißt du</b>?</span> ✅']},
    {t:'artikel', k:['أدوات التعريف','ادوات التعريف','أداة التعريف','der die das','artikel',
                     'bestimmter','unbestimmter','ein eine'],
     r:['🔤 <b>أدوات التعريف</b> — الألمانية لها <b>3 أجناس</b>:<br>'
      + '<span class="de-in"><b>der</b></span> مذكر: <span class="de-in">der Vater · der Tisch</span><br>'
      + '<span class="de-in"><b>die</b></span> مؤنث: <span class="de-in">die Mutter · die Lampe</span><br>'
      + '<span class="de-in"><b>das</b></span> محايد: <span class="de-in">das Kind · das Buch</span><br>'
      + '<span class="de-in"><b>die</b></span> الجمع (دائماً): <span class="de-in">die Eltern · die Kinder</span>',
       '📝 <b>أداة التنكير</b>: <span class="de-in">ein</span> (مذكر/محايد) · '
      + '<span class="de-in">eine</span> (مؤنث) — ولا توجد في الجمع.<br>'
      + '⚠️ <span class="de-in"><b>das</b> Mädchen</span> (البنت) محايد! الجنس لا يتبع المعنى دائماً.']},
    {t:'sein', k:['sein','يكون','تصريف sein','الفعل sein','verbe sein','conjugue sein'],
     r:['تصريف <b>sein</b>: <span class="de-in">ich bin · du bist · er/sie/es ist · wir sind · '
      + 'ihr seid · sie/Sie sind</span><br>'
      + 'مثال: <span class="de-in">Ich <b>bin</b> algerisch.</span> = أنا جزائري.',
       '⚠️ <b>sein</b> يستعمل أيضاً للعمر: <span class="de-in">Ich <b>bin</b> 16 Jahre alt.</span> '
      + '— وليس <b>haben</b> كما في العربية والفرنسية!']},
    {t:'haben', k:['haben','يملك','تصريف haben','الفعل haben','verbe haben','conjugue haben'],
     r:['تصريف <b>haben</b>: <span class="de-in">ich habe · du hast · er/sie/es hat · wir haben · '
      + 'ihr habt · sie/Sie haben</span><br>'
      + 'مثال: <span class="de-in">Ich <b>habe</b> zwei Schwestern.</span> = لديّ أختان.',
       '⚠️ احفظ الشذوذين: <span class="de-in">du <b>hast</b></span> و '
      + '<span class="de-in">er <b>hat</b></span> — حرف b يختفي!']},
    {t:'nom', k:['wie heißt','ما اسمك','اسمي','mon nom','name ist','heiße'],
     r:['<span class="de-in">Ich heiße Kharif Ahmed.</span> — و أنت؟ '
      + '<span class="de-in">Wie heißt du?</span>',
        'للتعريف بالاسم: <span class="de-in">Ich heiße …</span> أو '
      + '<span class="de-in">Mein Name ist …</span>']},
    {t:'alter', k:['wie alt','كم عمري','العمر','âge','jahre alt','alter'],
     r:['<span class="de-in">Ich bin 16 Jahre alt.</span> — نستعمل <b>sein</b> وليس <b>haben</b> '
      + 'للحديث عن العمر!',
        'قاعدة ذهبية: <span class="de-in">Ich <b>bin</b> … Jahre alt.</span>']},
    {t:'herkunft', k:['woher','من أين','origine','herkunft','d’où','dou','komme aus'],
     r:['<span class="de-in">Woher kommst du?</span> — <span class="de-in">Ich komme aus Algerien.</span>',
        'انتبه: <b>aus</b> إجبارية مع البلد. أما البلدان المؤنثة/الجمع فتأخذ أداة: '
      + '<span class="de-in">in <b>der</b> Schweiz · in <b>den</b> USA</span>.']},
    {t:'wohnen', k:['wo wohn','أين تسكن','wohnst','مدينة','ville','wohne'],
     r:['<span class="de-in">Wo wohnst du?</span> — <span class="de-in">Ich wohne in Bouira.</span>',
        'مع المدينة نستعمل <b>in</b>: <span class="de-in">Ich wohne <b>in</b> München.</span>']},
    {t:'familie', k:['familie','famille','عائلة','أخت','أخ','schwester','bruder','vater','mutter'],
     r:['العائلة: <span class="de-in">der Vater · die Mutter · die Schwester · der Bruder · '
      + 'die Eltern · die Geschwister</span>',
        '<span class="de-in">Ich habe eine Schwester und zwei Brüder.</span> = لديّ أخت و أخوان.']},
    {t:'lena', k:['lena','fischer','نص','texte','فهم','leseverstehen','lesetext'],
     r:['📖 <b>نص Lena Fischer</b> (النص الرسمي للفرض):<br>'
      + '<span class="de-in">«Hallo! Ich heiße Lena Fischer. Ich bin <b>17</b> Jahre alt und komme '
      + 'aus Deutschland. Ich wohne in <b>München</b>. Ich habe eine große Familie: '
      + '<b>einen Bruder</b> und <b>zwei Schwestern</b>. Mein Bruder ist <b>20</b> und heißt '
      + '<b>Tim</b>. Meine Schwester <b>Anna</b> ist <b>15</b>. Am Morgen sage ich immer: '
      + '«Guten Morgen, Mama!» Und am Abend: «Gute Nacht!»»</span>',
       '🎯 <b>ما يجب حفظه عن Lena</b>: 17 سنة · من ألمانيا (ليست من الجزائر) · تسكن في ميونيخ '
      + '(ليست برلين) · أخ واحد Tim (20) · أختان إحداهما Anna (15) · تحيّ أمها صباحاً وتقول '
      + 'Gute Nacht مساءً.',
       '💡 في فهم النص: أجب <b>بجملة كاملة</b> مأخوذة من النص — هذا ما يمنحك النقطة كاملة. '
      + 'و احذر الفخاخ: الأسئلة تغيّر رقماً أو مكاناً واحداً فقط.']},
    {t:'hobby', k:['hobby','loisir','هواية','sport','musik','fußball'],
     r:['<span class="de-in">Meine Hobbys sind Fußball und Musik.</span>',
        'الهوايات: <span class="de-in">Fußball · Musik · Lesen · Schwimmen · Reisen</span>']},
    {t:'tschüs', k:['tschüs','au revoir','مع السلامة','wiedersehen','à bientôt'],
     r:['<span class="de-in">Auf Wiedersehen!</span> (رسمي) أو <span class="de-in">Tschüs!</span> '
      + '(غير رسمي)',
        'و إلى اللقاء يا ولدي — <span class="de-in">Bis bald!</span>']},
    {t:'danke', k:['danke','شكرا','merci'],
     r:['<span class="de-in">Bitte schön!</span> — العفو 🇩🇿',
        '<span class="de-in">Gern geschehen!</span> — على الرحب و السعة']},
    {t:'exam', k:['تحضير','أحضر','احضر','استعد','فرض','اختبار','امتحان','examen','devoir',
                  'prüfung','vorbereiten','كيف أحضر'],
     r:['📝 <b>كيف تحضّر للفرض؟</b> منهجي المجرَّب في 5 خطوات:<br>'
      + '1️⃣ اقرأ <b>نص Lena Fischer</b> مرتين و استخرج الأرقام و الأسماء.<br>'
      + '2️⃣ أتقن <b>sein</b> و <b>haben</b> — وحدهما يساويان نقطتين في <span class="de-in">'
      + 'صرّف الأفعال</span>.<br>'
      + '3️⃣ احفظ <b>W-Fragen</b>: Wie · Woher · Wo · Wie alt · Wann · Warum.<br>'
      + '4️⃣ تدرّب على <b>ترتيب الجملة</b>: الفاعل + الفعل في المركز الثاني.<br>'
      + '5️⃣ احفظ <b>التحيات الأربع</b> + الوداع الرسمي و غير الرسمي.',
       '⏱️ <b>إدارة الوقت (45 دقيقة)</b>: فهم المكتوب 15 د · قسم اللغة 15 د · '
      + 'الإنتاج الكتابي 10 د · المراجعة 5 د.<br>'
      + '🧮 السلّم: 📖 8 ن + 🔤 8 ن + ✍️ 4 ن = <b>20</b>.',
       '🎯 جرّب الآن <b>⏱️ المحاكاة</b> بظروف حقيقية (45 دقيقة أو 10 دقائق) — '
      + 'التصحيح آلي و النتيجة سرّية على جهازك.']},
    {t:'bac', k:['bac','baccalauréat','بكالوريا','نجاح','réussir'],
     r:['السرّ في النجاح: <b>20 دقيقة يومياً</b> + مراجعة المفردات بصوت عالٍ. '
      + 'هذه هي الطريقة التي أنصح بها كل تلاميذي.',
        'نصيحتي: أتقن <b>sein</b> و <b>haben</b> أولاً، ثم الباقي يأتي بسهولة.']},
    {t:'corrige', k:['corrige','صحح','تصحيح','note','نقطة','bareme','barème','سلّم'],
     r:['التصحيح النموذجي في قسم <b>📝 الفرض</b> — اضغط «إظهار التصحيح» بعد محاولة الحل.',
        'في المحاكاة، التصحيح آلي وفوري والنتيجة تبقى <b>سرّية</b> على جهازك.']},
    {t:'inscription', k:['inscription','تسجيل','حجز','prix','ثمن','واتساب','whatsapp','gratuit'],
     r:['للتسجيل: واتساب <b>0555 57 79 31</b> — ابعث اسمك + «حصّة ألماني مجانية». '
      + '🎁 الحصّة الأولى مجانية حتى 30 سبتمبر 2026.',
        'الأماكن محدودة يا ولدي — الأولوية للتسجيل.']}
  ],
  fallback:[
    'سؤال جيد! اشرح لي أكثر، أو اسألني عن: <span class="de-in">sein</span>، '
    + '<span class="de-in">haben</span>، أدوات الاستفهام، التحيات، العائلة، أو نص Lena Fischer.',
    'لم أفهم تماماً — تذكّر أسئلة الوحدة 1: <span class="de-in">Wie heißt du? '
    + 'Woher kommst du? Wie alt bist du?</span>',
    '«الرجوع إلى الأصل فضيلة» — عُد إلى الحصة المناسبة في قسم 📚 الحصص ثم اسألني مجدداً.',
    'جرّب أن تكتب جملتك بالألمانية وسأصحّحها فوراً. مثال: '
    + '<span class="de-in">Ich bin 16 Jahre alt.</span>'
  ],
  /* Correction automatique d'une phrase allemande (règles de l'وحدة 1) */
  corriger(txt){
    const s = String(txt || '').trim();
    if(!s || !/[a-zA-ZäöüßÄÖÜ]/.test(s)) return null;
    const low = ' ' + s.toLowerCase().replace(/\s+/g,' ') + ' ';
    const errs = [];
    if(/\bich (bist|ist|seid)\b/.test(low))       errs.push('<span class="de-in">ich</span> → <b>bin</b>.');
    if(/\bich (hast|hat|habt|haben)\b/.test(low)) errs.push('<span class="de-in">ich</span> → <b>habe</b>.');
    if(/\bdu (bin|ist|sind|seid)\b/.test(low))    errs.push('<span class="de-in">du</span> → <b>bist</b>.');
    if(/\bdu (habe|hat|habt|haben)\b/.test(low))  errs.push('<span class="de-in">du</span> → <b>hast</b>.');
    if(/\b(er|sie|es) (bin|bist|sind|seid)\b/.test(low)) errs.push('<span class="de-in">er/sie/es</span> → <b>ist</b>.');
    if(/\b(er|sie|es) (habe|hast|habt|haben)\b/.test(low)) errs.push('<span class="de-in">er/sie/es</span> → <b>hat</b>.');
    if(/\bwir (bin|bist|ist|seid)\b/.test(low))   errs.push('<span class="de-in">wir</span> → <b>sind</b>.');
    if(/\bihr (bin|bist|ist|sind)\b/.test(low))   errs.push('<span class="de-in">ihr</span> → <b>seid</b>.');
    if(/\bihr (habe|hast|hat|haben)\b/.test(low)) errs.push('<span class="de-in">ihr</span> → <b>habt</b>.');
    if(/^\s*ich\b/.test(s)===false && /\sich\s/.test(low))
      errs.push('«ich» s’écrit en <b>minuscule</b> au milieu de la phrase, et <b>Ich</b> en début de phrase.');
    if(/\b\d+\s*jahre\b/.test(low) && /\bhabe\b/.test(low))
      errs.push('L’âge se dit avec <b>sein</b> : <span class="de-in">Ich <b>bin</b> 16 Jahre alt.</span>');
    if(/\bkomme?\s+(?!aus\b|von\b)[a-zäöü]/.test(low))
      errs.push('Après <span class="de-in">kommen</span> il faut <b>aus</b> : <span class="de-in">Ich komme <b>aus</b> Algerien.</span>');
    if(/\bwohne?\s+(?!in\b|bei\b|am\b)[a-zäöü]/.test(low))
      errs.push('Après <span class="de-in">wohnen</span> il faut <b>in</b> : <span class="de-in">Ich wohne <b>in</b> Bouira.</span>');
    if(/\bjahre\b/.test(low) && !/\balt\b/.test(low)) errs.push('N’oublie pas <b>alt</b> : <span class="de-in">Jahre alt</span>.');
    if(!/[.!?]$/.test(s)) errs.push('Termine ta phrase par un point <b>.</b> — c’est noté en «Écriture».');
    if(!errs.length) return {ok:true, msg:'✅ <b>Sehr gut!</b> الجملة صحيحة 100% — واصل هكذا يا ولدي 🇩🇪'};
    return {ok:false, msg:'🔍 <b>تصحيح الأستاذ :</b><br>• ' + errs.slice(0,4).join('<br>• ')};
  },

  /* Trouve le sujet de cours demandé (identifiant `t`) — moteur find_topic_v2.
     Retourne l'entrée correspondante, ou null si aucune ne matche. */
  trouver(txt){
    const s = String(txt || '').toLowerCase();
    if(!s) return null;
    for(const it of PROF.base){
      if(it.k.some(k => s.indexOf(String(k).toLowerCase()) !== -1)) return it;
    }
    return null;
  },

  /* Une phrase allemande DÉCLARATIVE (sujet + verbe, pas de point d'interrogation)
     est une copie à corriger — pas une demande de leçon. Sans cette règle,
     « Ich bist 16 Jahre alt. » tombait sur la leçon d'âge (mot-clé « jahre alt »)
     au lieu d'être corrigée. */
  estCopie(s){
    const t = String(s || '').trim();
    if(/[\u0600-\u06FF]/.test(t)) return false;              /* contient de l'arabe */
    if(/[?؟]\s*$/.test(t)) return false;                     /* question */
    return /^(ich|du|er|sie|es|wir|ihr|man|mein|meine|mein|der|die|das|am|um|heute|morgen)\b/i.test(t);
  },

  /* Ordre de résolution — corrige l'ancien bug où corriger() court-circuitait
     TOUTE la base de connaissances dès qu'un caractère latin apparaissait. */
  repondre(txt){
    const s = String(txt || '');

    /* 1) Demande explicite de correction : «صحّح : …» / «corrige …» */
    if(/^\s*(صحّ?ح(ي|لي)?|corrige[rz]?\b|verifie[rz]?\b)/i.test(s)){
      const phrase = s.replace(/^\s*(صحّ?ح(ي|لي)?|corrige[rz]?|verifie[rz]?)\s*[:\-–]?\s*/i, '');
      const c = PROF.corriger(phrase || s);
      if(c) return c.msg;
    }

    /* 2) Copie allemande déclarative → correction prioritaire */
    if(PROF.estCopie(s)){
      const c = PROF.corriger(s);
      if(c) return c.msg;
    }

    /* 3) Sujet de cours demandé (explication, règle, texte, méthode…) */
    const it = PROF.trouver(s);
    if(it) return it.r[Math.floor(Math.random() * it.r.length)];

    /* 4) Latin pur sans sujet déclaré → on tente quand même la correction */
    if(!/[\u0600-\u06FF]/.test(s)){
      const c = PROF.corriger(s);
      if(c) return c.msg;
    }

    /* 5) Repli */
    return PROF.fallback[Math.floor(Math.random() * PROF.fallback.length)];
  }
};
window.PROF = PROF;
