/* ══════════════════════════════════════════════════════════════
   برنامج الأصل — DEUTSCH-DZ-APP · app.js
   Prof. Kharif Ahmed · moteur principal
   Navigation · Séances 1-8 · Devoir /20 · IA du professeur · PWA
   ══════════════════════════════════════════════════════════════ */
'use strict';


/* ══════════════════════════════════════════════════════════════════════
   AUTO-GUÉRISON : un ancien Service Worker (cache-first) peut servir un
   app.js périmé après un correctif → ReferenceError au démarrage.
   Première erreur de boot = on désenregistre le SW, vide les caches et
   recharge UNE fois (garde sessionStorage pour ne pas boucler).
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  let deja = false;
  window.addEventListener('error', function(){
    if(deja) return;
    try{
      if(sessionStorage.getItem('dz_selfheal') === '1') return;
      sessionStorage.setItem('dz_selfheal', '1');
      deja = true;
      if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistrations().then(function(rs){
          rs.forEach(function(r){ try{ r.unregister(); }catch(e){} });
        }).catch(function(){});
      }
      if('caches' in window){
        caches.keys().then(function(ks){ ks.forEach(function(k){ caches.delete(k); }); })
          .catch(function(){});
      }
      setTimeout(function(){ location.reload(); }, 350);
    }catch(e){}
  }, true);
  window.addEventListener('load', function(){
    try{ sessionStorage.removeItem('dz_selfheal'); }catch(e){}
  });
})();

/* ─────────────── CONSTANTES GLOBALES ─────────────── */
const WA_NUMBER = '213555577931';
const LS = {
  seances : 'dz_de_seances_v1',
  devoir  : 'dz_de_devoir_v1',
  sim     : 'dz_de_sim_v1',
  sound   : 'dz_de_sound_v1',
  chat    : 'dz_de_chat_v1',
  parent  : 'dz_de_parent_v1'
};


/* ─────────────── DEVOIR OFFICIEL — الوحدة 1 (/20) ─────────────── */
const DEVOIR_U1 = {
  titre:'Évaluation — Einheit 1 : Sich vorstellen', duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Lena Fischer</b></p>'
          + '<p>Hallo! Ich heiße Lena Fischer. Ich bin 17 Jahre alt und komme aus Deutschland. '
          + 'Ich wohne in München. Ich habe eine große Familie: einen Bruder und zwei Schwestern. '
          + 'Mein Bruder ist 20 und heißt Tim. Meine Schwester Anna ist 15. '
          + 'Am Morgen sage ich immer: «Guten Morgen, Mama!» Und am Abend: «Gute Nacht!»</p></div>',
      questions:[
        {id:'I.1.a',type:'vf',t:'Lena kommt aus Algerien.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich komme aus Deutschland.</span> — nicht Algerien.'},
        {id:'I.1.b',type:'vf',t:'Lena ist 17.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Ich bin 17 Jahre alt.</span>'},
        {id:'I.1.c',type:'vf',t:'Tim ist 20 Jahre alt.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Mein Bruder ist 20 und heißt Tim.</span>'},
        {id:'I.1.d',type:'vf',t:'Lena wohnt in Berlin.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich wohne in München.</span> — nicht Berlin.'},
        {id:'I.2.a',type:'txt',t:'Wie heißt Lena mit Nachnamen?',pts:1,rep:'Sie heißt Fischer.',
         just:'<span class="de-in">Ich heiße Lena Fischer.</span>',key:['fischer']},
        {id:'I.2.b',type:'txt',t:'Wo wohnt Lena?',pts:1,rep:'Sie wohnt in München.',
         just:'<span class="de-in">Ich wohne in München.</span>',key:['münchen','munchen','muenchen']},
        {id:'I.2.c',type:'txt',t:'Wie viele Schwestern hat Lena?',pts:1,rep:'Sie hat zwei Schwestern.',
         just:'<span class="de-in">Ich habe … zwei Schwestern.</span>',key:['zwei','2']},
        {id:'I.2.d',type:'txt',t:'Was sagt Lena am Morgen?',pts:1,
         rep:'Sie sagt: «Guten Morgen, Mama!»',
         just:'<span class="de-in">Am Morgen sage ich immer: Guten Morgen, Mama!</span>',
         key:['guten morgen']}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ 16 Jahre alt.»',opts:['habe','bin','komme','heiße'],a:1,pts:1,why:'<b>sein</b> pour l’âge.'},
        {id:'II.2',type:'qcm',t:'«___ du Geschwister?»',opts:['Haben','Hast','Hat','Bist'],a:1,pts:1,why:'<span class="de-in">du</span> → <b>hast</b>.'},
        {id:'II.3',type:'qcm',t:'«Wir ___ aus Algerien.»',opts:['sind','seid','ist','bin'],a:0,pts:1,why:'<span class="de-in">wir</span> → <b>sind</b>.'},
        {id:'II.4',type:'qcm',t:'«Lena ___ zwei Schwestern.»',opts:['habe','hast','hat','haben'],a:2,pts:1,why:'<span class="de-in">sie</span> → <b>hat</b>.'},
        {id:'II.5',type:'txt',t:'«___ kommst du?» → من أين أنت؟',pts:1,rep:'Woher',key:['woher'],just:'<span class="de-in">Woher</span> = من أين.'},
        {id:'II.6',type:'txt',t:'«___ heißt du?» → ما اسمك؟',pts:1,rep:'Wie',key:['wie'],just:'<span class="de-in">Wie</span> = كيف.'},
        {id:'II.7',type:'txt',t:'Traduis : «عمري 16 سنة»',pts:1,rep:'Ich bin 16 Jahre alt.',
         key:['ich bin 16','ich bin sechzehn'],just:'<b>sein</b> + âge.'},
        {id:'II.8',type:'txt',t:'Traduis : «أنا من الجزائر»',pts:1,rep:'Ich komme aus Algerien.',
         key:['aus algerien'],just:'<span class="de-in">kommen <b>aus</b></span> + pays.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 5 أسطر تعرّف فيها بنفسك (الاسم، العمر، البلد، العائلة، الهوايات).',
         grille:[['استعمال صحيح لـ sein / haben','1.5'],['مفردات الوحدة 1 (5 كلمات على الأقل)','1.0'],
                 ['ترتيب الأفكار والتماسك','1.0'],['الإملاء وعلامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Hallo! Ich heiße Amine Benali. Ich bin 16 Jahre alt. '
              + 'Ich komme aus Algerien und ich wohne in Bouira. Ich habe einen Bruder und eine '
              + 'Schwester. Meine Hobbys sind Fußball und Musik. Tschüs!</p></div>'}
      ]}
  ]
};

/* ─────────────── REGISTRE DES UNITÉS ─────────────── */
let currentUnite = 1;
let niveauActif = load('dz_de_niveau_v1', 'tous');



/* ─────────────── UNITÉ 2 : Haus und Familie (المنزل والعائلة) — pages 31→55 ─────────────── */
window.SEANCES_U2 = [{"n": 1, "de": "Lektion 2 — Seite 31", "ar": "الدرس 2 · التحيّة والتعارف (الصفحة 31)", "intro": "افتح الصفحة 31 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 31, "duree": 45}, {"n": 2, "de": "Lektion 2 — Seite 35", "ar": "الدرس 2 · القراءة والفهم (الصفحة 35)", "intro": "افتح الصفحة 35 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 35, "duree": 45}, {"n": 3, "de": "Lektion 2 — Seite 39", "ar": "الدرس 2 · القواعد (الصفحة 39)", "intro": "افتح الصفحة 39 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 39, "duree": 45}, {"n": 4, "de": "Lektion 2 — Seite 43", "ar": "الدرس 2 · المحادثة (الصفحة 43)", "intro": "افتح الصفحة 43 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 43, "duree": 45}, {"n": 5, "de": "Lektion 2 — Seite 47", "ar": "الدرس 2 · القراءة المتقدمة (الصفحة 47)", "intro": "افتح الصفحة 47 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 47, "duree": 45}, {"n": 6, "de": "Lektion 2 — Seite 55", "ar": "الدرس 2 · التطبيق (الصفحة 55)", "intro": "افتح الصفحة 55 من الدرس 2 (Haus und Familie) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 55, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 2", "ar": "مراجعة الدرس 2", "intro": "مراجعة شاملة للدرس 2 (Haus und Familie) : المفردات، القواعد، والنصوص من الصفحات 31 إلى 55.", "page": 31, "duree": 45}, {"n": 8, "de": "Test Lektion 2", "ar": "تقييم الدرس 2", "intro": "اختبار قصير في الدرس 2 (Haus und Familie) — يُحفظ محلياً على جهازك فقط.", "page": 31, "duree": 45}];

/* ─────────────── UNITÉ 3 : Schule und Unterricht (المدرسة والدرس) — pages 57→76 ─────────────── */
window.SEANCES_U3 = [{"n": 1, "de": "Lektion 3 — Seite 57", "ar": "الدرس 3 · التحيّة والتعارف (الصفحة 57)", "intro": "افتح الصفحة 57 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 57, "duree": 45}, {"n": 2, "de": "Lektion 3 — Seite 60", "ar": "الدرس 3 · القراءة والفهم (الصفحة 60)", "intro": "افتح الصفحة 60 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 60, "duree": 45}, {"n": 3, "de": "Lektion 3 — Seite 63", "ar": "الدرس 3 · القواعد (الصفحة 63)", "intro": "افتح الصفحة 63 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 63, "duree": 45}, {"n": 4, "de": "Lektion 3 — Seite 66", "ar": "الدرس 3 · المحادثة (الصفحة 66)", "intro": "افتح الصفحة 66 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 66, "duree": 45}, {"n": 5, "de": "Lektion 3 — Seite 69", "ar": "الدرس 3 · القراءة المتقدمة (الصفحة 69)", "intro": "افتح الصفحة 69 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 69, "duree": 45}, {"n": 6, "de": "Lektion 3 — Seite 76", "ar": "الدرس 3 · التطبيق (الصفحة 76)", "intro": "افتح الصفحة 76 من الدرس 3 (Schule und Unterricht) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 76, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 3", "ar": "مراجعة الدرس 3", "intro": "مراجعة شاملة للدرس 3 (Schule und Unterricht) : المفردات، القواعد، والنصوص من الصفحات 57 إلى 76.", "page": 57, "duree": 45}, {"n": 8, "de": "Test Lektion 3", "ar": "تقييم الدرس 3", "intro": "اختبار قصير في الدرس 3 (Schule und Unterricht) — يُحفظ محلياً على جهازك فقط.", "page": 57, "duree": 45}];

/* ─────────────── UNITÉ 4 : Zeit und Wetter (الوقت والطقس) — pages 77→101 ─────────────── */
window.SEANCES_U4 = [{"n": 1, "de": "Lektion 4 — Seite 77", "ar": "الدرس 4 · التحيّة والتعارف (الصفحة 77)", "intro": "افتح الصفحة 77 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 77, "duree": 45}, {"n": 2, "de": "Lektion 4 — Seite 81", "ar": "الدرس 4 · القراءة والفهم (الصفحة 81)", "intro": "افتح الصفحة 81 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 81, "duree": 45}, {"n": 3, "de": "Lektion 4 — Seite 85", "ar": "الدرس 4 · القواعد (الصفحة 85)", "intro": "افتح الصفحة 85 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 85, "duree": 45}, {"n": 4, "de": "Lektion 4 — Seite 89", "ar": "الدرس 4 · المحادثة (الصفحة 89)", "intro": "افتح الصفحة 89 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 89, "duree": 45}, {"n": 5, "de": "Lektion 4 — Seite 93", "ar": "الدرس 4 · القراءة المتقدمة (الصفحة 93)", "intro": "افتح الصفحة 93 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 93, "duree": 45}, {"n": 6, "de": "Lektion 4 — Seite 101", "ar": "الدرس 4 · التطبيق (الصفحة 101)", "intro": "افتح الصفحة 101 من الدرس 4 (Zeit und Wetter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 101, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 4", "ar": "مراجعة الدرس 4", "intro": "مراجعة شاملة للدرس 4 (Zeit und Wetter) : المفردات، القواعد، والنصوص من الصفحات 77 إلى 101.", "page": 77, "duree": 45}, {"n": 8, "de": "Test Lektion 4", "ar": "تقييم الدرس 4", "intro": "اختبار قصير في الدرس 4 (Zeit und Wetter) — يُحفظ محلياً على جهازك فقط.", "page": 77, "duree": 45}];

/* ─────────────── UNITÉ 5 : Freizeit (أوقات الفراغ) — pages 103→127 ─────────────── */
window.SEANCES_U5 = [{"n": 1, "de": "Lektion 5 — Seite 103", "ar": "الدرس 5 · التحيّة والتعارف (الصفحة 103)", "intro": "افتح الصفحة 103 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 103, "duree": 45}, {"n": 2, "de": "Lektion 5 — Seite 107", "ar": "الدرس 5 · القراءة والفهم (الصفحة 107)", "intro": "افتح الصفحة 107 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 107, "duree": 45}, {"n": 3, "de": "Lektion 5 — Seite 111", "ar": "الدرس 5 · القواعد (الصفحة 111)", "intro": "افتح الصفحة 111 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 111, "duree": 45}, {"n": 4, "de": "Lektion 5 — Seite 115", "ar": "الدرس 5 · المحادثة (الصفحة 115)", "intro": "افتح الصفحة 115 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 115, "duree": 45}, {"n": 5, "de": "Lektion 5 — Seite 119", "ar": "الدرس 5 · القراءة المتقدمة (الصفحة 119)", "intro": "افتح الصفحة 119 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 119, "duree": 45}, {"n": 6, "de": "Lektion 5 — Seite 127", "ar": "الدرس 5 · التطبيق (الصفحة 127)", "intro": "افتح الصفحة 127 من الدرس 5 (Freizeit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 127, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 5", "ar": "مراجعة الدرس 5", "intro": "مراجعة شاملة للدرس 5 (Freizeit) : المفردات، القواعد، والنصوص من الصفحات 103 إلى 127.", "page": 103, "duree": 45}, {"n": 8, "de": "Test Lektion 5", "ar": "تقييم الدرس 5", "intro": "اختبار قصير في الدرس 5 (Freizeit) — يُحفظ محلياً على جهازك فقط.", "page": 103, "duree": 45}];

/* ─────────────── UNITÉ 6 : Mensch und Gesundheit (الإنسان والصحة) — pages 129→149 ─────────────── */
window.SEANCES_U6 = [{"n": 1, "de": "Lektion 6 — Seite 129", "ar": "الدرس 6 · التحيّة والتعارف (الصفحة 129)", "intro": "افتح الصفحة 129 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 129, "duree": 45}, {"n": 2, "de": "Lektion 6 — Seite 132", "ar": "الدرس 6 · القراءة والفهم (الصفحة 132)", "intro": "افتح الصفحة 132 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 132, "duree": 45}, {"n": 3, "de": "Lektion 6 — Seite 135", "ar": "الدرس 6 · القواعد (الصفحة 135)", "intro": "افتح الصفحة 135 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 135, "duree": 45}, {"n": 4, "de": "Lektion 6 — Seite 138", "ar": "الدرس 6 · المحادثة (الصفحة 138)", "intro": "افتح الصفحة 138 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 138, "duree": 45}, {"n": 5, "de": "Lektion 6 — Seite 141", "ar": "الدرس 6 · القراءة المتقدمة (الصفحة 141)", "intro": "افتح الصفحة 141 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 141, "duree": 45}, {"n": 6, "de": "Lektion 6 — Seite 149", "ar": "الدرس 6 · التطبيق (الصفحة 149)", "intro": "افتح الصفحة 149 من الدرس 6 (Mensch und Gesundheit) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 149, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 6", "ar": "مراجعة الدرس 6", "intro": "مراجعة شاملة للدرس 6 (Mensch und Gesundheit) : المفردات، القواعد، والنصوص من الصفحات 129 إلى 149.", "page": 129, "duree": 45}, {"n": 8, "de": "Test Lektion 6", "ar": "تقييم الدرس 6", "intro": "اختبار قصير في الدرس 6 (Mensch und Gesundheit) — يُحفظ محلياً على جهازك فقط.", "page": 129, "duree": 45}];

/* ─────────────── UNITÉ 7 : Essen und Trinken (الأكل والشرب) — pages 151→180 ─────────────── */
window.SEANCES_U7 = [{"n": 1, "de": "Lektion 7 — Seite 151", "ar": "الدرس 7 · التحيّة والتعارف (الصفحة 151)", "intro": "افتح الصفحة 151 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 151, "duree": 45}, {"n": 2, "de": "Lektion 7 — Seite 156", "ar": "الدرس 7 · القراءة والفهم (الصفحة 156)", "intro": "افتح الصفحة 156 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 156, "duree": 45}, {"n": 3, "de": "Lektion 7 — Seite 161", "ar": "الدرس 7 · القواعد (الصفحة 161)", "intro": "افتح الصفحة 161 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 161, "duree": 45}, {"n": 4, "de": "Lektion 7 — Seite 166", "ar": "الدرس 7 · المحادثة (الصفحة 166)", "intro": "افتح الصفحة 166 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 166, "duree": 45}, {"n": 5, "de": "Lektion 7 — Seite 171", "ar": "الدرس 7 · القراءة المتقدمة (الصفحة 171)", "intro": "افتح الصفحة 171 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 171, "duree": 45}, {"n": 6, "de": "Lektion 7 — Seite 180", "ar": "الدرس 7 · التطبيق (الصفحة 180)", "intro": "افتح الصفحة 180 من الدرس 7 (Essen und Trinken) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 180, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 7", "ar": "مراجعة الدرس 7", "intro": "مراجعة شاملة للدرس 7 (Essen und Trinken) : المفردات، القواعد، والنصوص من الصفحات 151 إلى 180.", "page": 151, "duree": 45}, {"n": 8, "de": "Test Lektion 7", "ar": "تقييم الدرس 7", "intro": "اختبار قصير في الدرس 7 (Essen und Trinken) — يُحفظ محلياً على جهازك فقط.", "page": 151, "duree": 45}];

/* ─────────────── UNITÉ 8 : Aussehen und Charakter (المظهر والشخصية) — pages 181→205 ─────────────── */
window.SEANCES_U8 = [{"n": 1, "de": "Lektion 8 — Seite 181", "ar": "الدرس 8 · التحيّة والتعارف (الصفحة 181)", "intro": "افتح الصفحة 181 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 181, "duree": 45}, {"n": 2, "de": "Lektion 8 — Seite 185", "ar": "الدرس 8 · القراءة والفهم (الصفحة 185)", "intro": "افتح الصفحة 185 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 185, "duree": 45}, {"n": 3, "de": "Lektion 8 — Seite 189", "ar": "الدرس 8 · القواعد (الصفحة 189)", "intro": "افتح الصفحة 189 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 189, "duree": 45}, {"n": 4, "de": "Lektion 8 — Seite 193", "ar": "الدرس 8 · المحادثة (الصفحة 193)", "intro": "افتح الصفحة 193 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 193, "duree": 45}, {"n": 5, "de": "Lektion 8 — Seite 197", "ar": "الدرس 8 · القراءة المتقدمة (الصفحة 197)", "intro": "افتح الصفحة 197 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 197, "duree": 45}, {"n": 6, "de": "Lektion 8 — Seite 205", "ar": "الدرس 8 · التطبيق (الصفحة 205)", "intro": "افتح الصفحة 205 من الدرس 8 (Aussehen und Charakter) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 205, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 8", "ar": "مراجعة الدرس 8", "intro": "مراجعة شاملة للدرس 8 (Aussehen und Charakter) : المفردات، القواعد، والنصوص من الصفحات 181 إلى 205.", "page": 181, "duree": 45}, {"n": 8, "de": "Test Lektion 8", "ar": "تقييم الدرس 8", "intro": "اختبار قصير في الدرس 8 (Aussehen und Charakter) — يُحفظ محلياً على جهازك فقط.", "page": 181, "duree": 45}];

/* ─────────────── UNITÉ 9 : Stadtleben – Landleben (حياة المدينة والريف) — pages 207→223 ─────────────── */
window.SEANCES_U9 = [{"n": 1, "de": "Lektion 9 — Seite 207", "ar": "الدرس 9 · التحيّة والتعارف (الصفحة 207)", "intro": "افتح الصفحة 207 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 207, "duree": 45}, {"n": 2, "de": "Lektion 9 — Seite 209", "ar": "الدرس 9 · القراءة والفهم (الصفحة 209)", "intro": "افتح الصفحة 209 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 209, "duree": 45}, {"n": 3, "de": "Lektion 9 — Seite 211", "ar": "الدرس 9 · القواعد (الصفحة 211)", "intro": "افتح الصفحة 211 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 211, "duree": 45}, {"n": 4, "de": "Lektion 9 — Seite 213", "ar": "الدرس 9 · المحادثة (الصفحة 213)", "intro": "افتح الصفحة 213 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 213, "duree": 45}, {"n": 5, "de": "Lektion 9 — Seite 215", "ar": "الدرس 9 · القراءة المتقدمة (الصفحة 215)", "intro": "افتح الصفحة 215 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 215, "duree": 45}, {"n": 6, "de": "Lektion 9 — Seite 223", "ar": "الدرس 9 · التطبيق (الصفحة 223)", "intro": "افتح الصفحة 223 من الدرس 9 (Stadtleben – Landleben) واقرأها — النص مأخوذ حرفياً من الكتاب.", "page": 223, "duree": 45}, {"n": 7, "de": "Wiederholung Lektion 9", "ar": "مراجعة الدرس 9", "intro": "مراجعة شاملة للدرس 9 (Stadtleben – Landleben) : المفردات، القواعد، والنصوص من الصفحات 207 إلى 223.", "page": 207, "duree": 45}, {"n": 8, "de": "Test Lektion 9", "ar": "تقييم الدرس 9", "intro": "اختبار قصير في الدرس 9 (Stadtleben – Landleben) — يُحفظ محلياً على جهازك فقط.", "page": 207, "duree": 45}];


/* ── UNITÉ 1 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U1 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 1 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 5, 6)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 5, 6.", "pages": [5, 6], "page": 5, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 1 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 7, 10, 25)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 7, 10, 25.", "pages": [7, 10, 25], "page": 7, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 1 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 8, 13)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 8, 13.", "pages": [8, 13], "page": 8, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 1 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 11, 14, 15)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 11, 14, 15.", "pages": [11, 14, 15], "page": 11, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 1 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 9, 12, 16)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 9, 12, 16.", "pages": [9, 12, 16], "page": 9, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 1 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 17, 18, 19, 20, 21)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 17, 18, 19, 20, 21.", "pages": [17, 18, 19, 20, 21], "page": 17, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 1 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 22, 26)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 22, 26.", "pages": [22, 26], "page": 22, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 1 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 24)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 24.", "pages": [24], "page": 24, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 1 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 27)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 27.", "pages": [27], "page": 27, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 1 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 28, 29)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 28, 29.", "pages": [28, 29], "page": 28, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 1 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص (الصفحات 23)", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. الصفحات : 23.", "pages": [23], "page": 23, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 1 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 13, "phase": "Hôpital des erreurs", "de": "Hôpital des erreurs", "ar": "الحصة 13 — مستشفى الأخطاء 🏥 : شخّص وصحّح", "intro": "مستشفى الأخطاء : عشر جمل مريضة تدخل وتخرج سليمة. 🏥 « Ich bist 16 Jahre alt. » · 🏥 « Ich habe 16 Jahre alt. » · 🏥 « Ich komme Algerien. » · 🏥 « Ich wohne München. » · 🏥 « Ich bin sechzehn Jahre. » · 🏥 « Ihr hast eine Schwester. » · 🏥 « Guten Morgen ! (le soir) » · 🏥 « Tschüs, Herr Lehrer ! » · 🏥 « Woher kommst du ? — Ich wohne in Blida. » · 🏥 « Mein Name heiße Ahmed. » — صحّح كل جملة ثم افتح الصفحات 21-22 للمراجعة.", "pages": [21, 22], "page": 21, "mastery": true, "duree": 45, "patients": [["Ich bist 16 Jahre alt.", "bist → bin", "sein irrégulier à la 1ʳ personne"], ["Ich habe 16 Jahre alt.", "habe → bin", "l'âge se dit avec sein, jamais haben"], ["Ich komme Algerien.", "komme aus Algerien", "kommen + aus"], ["Ich wohne München.", "wohne in München", "wohnen + in"], ["Ich bin sechzehn Jahre.", "sechzehn Jahre alt", "Jahre alt obligatoire"], ["Ihr hast eine Schwester.", "hast → habt", "ihr → habt"], ["Guten Morgen ! (le soir)", "Guten Abend", "salutation selon l'heure"], ["Tschüs, Herr Lehrer !", "Auf Wiedersehen", "registre formel"], ["Woher kommst du ? — Ich wohne in Blida.", "Wo wohnst du ?", "woher = origine, wo = lieu"], ["Mein Name heiße Ahmed.", "Ich heiße Ahmed", "Name + heißen"]], "exos": []}];

/* ── UNITÉ 2 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U2 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 2 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 31, 42)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 31, 42.", "pages": [31, 42], "page": 31, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 2 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 32, 52)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 32, 52.", "pages": [32, 52], "page": 32, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 2 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 43, 38)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 43, 38.", "pages": [43, 38], "page": 43, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 2 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 33, 35, 45, 46)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 33, 35, 45, 46.", "pages": [33, 35, 45, 46], "page": 33, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 2 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 34, 36, 37, 39)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 34, 36, 37, 39.", "pages": [34, 36, 37, 39], "page": 34, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 2 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 40, 41, 44, 47, 48, 49)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 40, 41, 44, 47, 48, 49.", "pages": [40, 41, 44, 47, 48, 49], "page": 40, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 2 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 50, 53)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 50, 53.", "pages": [50, 53], "page": 50, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 2 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 51)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 51.", "pages": [51], "page": 51, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 2 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 54)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 54.", "pages": [54], "page": 54, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 2 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 55)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 55.", "pages": [55], "page": 55, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 2 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 2 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 3 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U3 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 3 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 57, 58)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 57, 58.", "pages": [57, 58], "page": 57, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 3 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 66, 73)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 66, 73.", "pages": [66, 73], "page": 66, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 3 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 59, 67)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 59, 67.", "pages": [59, 67], "page": 59, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 3 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 60, 61, 62, 65)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 60, 61, 62, 65.", "pages": [60, 61, 62, 65], "page": 60, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 3 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 63, 64, 68)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 63, 64, 68.", "pages": [63, 64, 68], "page": 63, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 3 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 69, 70)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 69, 70.", "pages": [69, 70], "page": 69, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 3 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 71, 74)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 71, 74.", "pages": [71, 74], "page": 71, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 3 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 72)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 72.", "pages": [72], "page": 72, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 3 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 75)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 75.", "pages": [75], "page": 75, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 3 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 76)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 76.", "pages": [76], "page": 76, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 3 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 3 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 4 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U4 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 4 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 77, 78)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 77, 78.", "pages": [77, 78], "page": 77, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 4 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 81, 98)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 81, 98.", "pages": [81, 98], "page": 81, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 4 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 87, 89)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 87, 89.", "pages": [87, 89], "page": 87, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 4 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 79, 80, 83, 85, 86)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 79, 80, 83, 85, 86.", "pages": [79, 80, 83, 85, 86], "page": 79, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 4 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 82, 84, 88)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 82, 84, 88.", "pages": [82, 84, 88], "page": 82, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 4 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 91, 93, 94, 95)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 91, 93, 94, 95.", "pages": [91, 93, 94, 95], "page": 91, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 4 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 96, 99)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 96, 99.", "pages": [96, 99], "page": 96, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 4 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 97)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 97.", "pages": [97], "page": 97, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 4 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 100)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 100.", "pages": [100], "page": 100, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 4 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 101)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 101.", "pages": [101], "page": 101, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 4 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 4 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 5 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U5 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 5 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 103, 104)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 103, 104.", "pages": [103, 104], "page": 103, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 5 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 122, 124)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 122, 124.", "pages": [122, 124], "page": 122, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 5 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 114, 106)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 114, 106.", "pages": [114, 106], "page": 114, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 5 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 108, 109, 110, 117, 118)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 108, 109, 110, 117, 118.", "pages": [108, 109, 110, 117, 118], "page": 108, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 5 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 105, 111, 116)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 105, 111, 116.", "pages": [105, 111, 116], "page": 105, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 5 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 112, 113, 115, 119)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 112, 113, 115, 119.", "pages": [112, 113, 115, 119], "page": 112, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 5 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 120, 125)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 120, 125.", "pages": [120, 125], "page": 120, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 5 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 121)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 121.", "pages": [121], "page": 121, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 5 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 126)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 126.", "pages": [126], "page": 126, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 5 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 127)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 127.", "pages": [127], "page": 127, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 5 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 5 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 6 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U6 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 6 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 129, 130)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 129, 130.", "pages": [129, 130], "page": 129, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 6 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 134, 146)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 134, 146.", "pages": [134, 146], "page": 134, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 6 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 131, 132)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 131, 132.", "pages": [131, 132], "page": 131, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 6 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 135, 137, 138, 141, 142, 143)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 135, 137, 138, 141, 142, 143.", "pages": [135, 137, 138, 141, 142, 143], "page": 135, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 6 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 133, 136, 139)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 133, 136, 139.", "pages": [133, 136, 139], "page": 133, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 6 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 140)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 140.", "pages": [140], "page": 140, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 6 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 144, 147)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 144, 147.", "pages": [144, 147], "page": 144, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 6 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 145)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 145.", "pages": [145], "page": 145, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 6 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 148)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 148.", "pages": [148], "page": 148, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 6 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 149)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 149.", "pages": [149], "page": 149, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 6 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 6 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 7 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U7 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 7 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 151, 152)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 151, 152.", "pages": [151, 152], "page": 151, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 7 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 154, 176)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 154, 176.", "pages": [154, 176], "page": 154, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 7 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 153, 163)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 153, 163.", "pages": [153, 163], "page": 153, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 7 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 155, 157, 158, 164, 165)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 155, 157, 158, 164, 165.", "pages": [155, 157, 158, 164, 165], "page": 155, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 7 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 156, 159, 168)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 156, 159, 168.", "pages": [156, 159, 168], "page": 156, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 7 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 166, 167, 169, 170, 171, 172, 175)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 166, 167, 169, 170, 171, 172, 175.", "pages": [166, 167, 169, 170, 171, 172, 175], "page": 166, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 7 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 173, 177, 178)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 173, 177, 178.", "pages": [173, 177, 178], "page": 173, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 7 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 174)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 174.", "pages": [174], "page": 174, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 7 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 179)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 179.", "pages": [179], "page": 179, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 7 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 180)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 180.", "pages": [180], "page": 180, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 7 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 7 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 8 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U8 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 8 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 181, 182)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 181, 182.", "pages": [181, 182], "page": 181, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 8 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 201, 202)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 201, 202.", "pages": [201, 202], "page": 201, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 8 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 183, 184, 192)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 183, 184, 192.", "pages": [183, 184, 192], "page": 183, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 8 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 185, 188, 190, 196, 197)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 185, 188, 190, 196, 197.", "pages": [185, 188, 190, 196, 197], "page": 185, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 8 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 186, 187, 191)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 186, 187, 191.", "pages": [186, 187, 191], "page": 186, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 8 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 189, 193, 195, 198)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 189, 193, 195, 198.", "pages": [189, 193, 195, 198], "page": 189, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 8 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 199, 203)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 199, 203.", "pages": [199, 203], "page": 199, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 8 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 200)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 200.", "pages": [200], "page": 200, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 8 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 204)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 204.", "pages": [204], "page": 204, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 8 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 205)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 205.", "pages": [205], "page": 205, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 8 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 8 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

/* ── UNITÉ 9 : 12 حصص بيداغوجية (افهم→لخّص→تمرّن→اسمع→تكلّم→اكتب→راجع→استعد) ── */
const SEANCES_U9 = [{"n": 1, "phase": "Entdecken", "de": "Lektion 9 · Entdecken", "ar": "الحصة 1 — الاكتشاف والاستماع الأول (الصفحات 207)", "intro": "شاهد واستمع أولاً : افتح صفحات الافتتاح واسمعها دون توقف عند المجهول — الفهم العام قبل التفاصيل (input قبل output). الصفحات : 207.", "pages": [207], "page": 207, "mastery": true, "duree": 45, "exos": []}, {"n": 2, "phase": "Lesen & Verstehen", "de": "Lektion 9 · Lesen & Verstehen", "ar": "الحصة 2 — القراءة والفهم (الصفحات 208, 212, 220)", "intro": "اقرأ نصوص وحوارات هذه الصفحات قراءة كاملة، ثم أجب شفهياً : من؟ ماذا؟ أين؟ لماذا؟ — لا تترجم كلمة كلمة، افهم المعنى. الصفحات : 208, 212, 220.", "pages": [208, 212, 220], "page": 208, "mastery": true, "duree": 45, "exos": []}, {"n": 3, "phase": "Wortschatz", "de": "Lektion 9 · Wortschatz", "ar": "الحصة 3 — المفردات وتلخيصها (الصفحات 210)", "intro": "استخرج مفردات الصفحات بـ Artikelها، اكتبها عربي/ألماني في بطاقتك، وراجعها بالتكرار المتباعد (يوم+1، +3، +7، +21). الصفحات : 210.", "pages": [210], "page": 210, "mastery": true, "duree": 45, "exos": []}, {"n": 4, "phase": "Grammatik", "de": "Lektion 9 · Grammatik", "ar": "الحصة 4 — القاعدة : فهم وتلخيص (الصفحات 209, 211, 213, 216)", "intro": "افهم القاعدة من صفحاتها، ثم لخّصها بالعربية في سطرين + مثال ألماني واحد لكل قاعدة — التلخيص دليل الفهم. الصفحات : 209, 211, 213, 216.", "pages": [209, 211, 213, 216], "page": 209, "mastery": true, "duree": 45, "exos": []}, {"n": 5, "phase": "Üben I", "de": "Lektion 9 · Üben I", "ar": "الحصة 5 — التطبيق الموجّه (الصفحات 215, 217)", "intro": "حلّ تمارين هذه الصفحات تطبيقاً مباشراً على القاعدة — صحّح فوراً وافهم سبب كل خطأ (ذاكرة الأخطاء تعيده لك لاحقاً). الصفحات : 215, 217.", "pages": [215, 217], "page": 215, "mastery": true, "duree": 45, "exos": []}, {"n": 6, "phase": "Üben II", "de": "Lektion 9 · Üben II", "ar": "الحصة 6 — التدريب المركّب (الصفحات 214)", "intro": "تدريب أعمق : تمارين مركّبة تجمع قواعد الوحدة — الهدف أن يصبح الاستعمال تلقائياً (Automatismus). الصفحات : 214.", "pages": [214], "page": 214, "mastery": true, "duree": 45, "exos": []}, {"n": 7, "phase": "Hören & Phonetik", "de": "Lektion 9 · Hören & Phonetik", "ar": "الحصة 7 — السمع والفونيتيك والنطق (الصفحات 218, 221)", "intro": "استمع وصفحات الفونيتيك : طبّق الـ Shadowing — كرّر خلف الصوت بنفس الإيقاع والنبرة حتى تستقيم مخارجك. الصفحات : 218, 221.", "pages": [218, 221], "page": 218, "mastery": true, "duree": 45, "exos": []}, {"n": 8, "phase": "Sprechen", "de": "Lektion 9 · Sprechen", "ar": "الحصة 8 — المحادثة والطلاقة (الصفحات 219)", "intro": "تكلّم : أدِّ الحوارات بصوت مرتفع ثم أعد صياغتها عن نفسك دون النظر — الطلاقة قبل الدقة. الصفحات : 219.", "pages": [219], "page": 219, "mastery": true, "duree": 45, "exos": []}, {"n": 9, "phase": "Schreiben", "de": "Lektion 9 · Schreiben", "ar": "الحصة 9 — التحرير والكتابة (الصفحات 222)", "intro": "اكتب : أنشئ نصك الخاص بنفس بنية نموذج الصفحة، ثم قارنه وصحّح أخطاءك بنفسك. الصفحات : 222.", "pages": [222], "page": 222, "mastery": true, "duree": 45, "exos": []}, {"n": 10, "phase": "Information", "de": "Lektion 9 · Information", "ar": "الحصة 10 — الثقافة والسياق (الصفحات 223)", "intro": "اقرأ صفحة المعلومات : سياق اللغة ومصدر أسئلة الفروض والاختبارات. الصفحات : 223.", "pages": [223], "page": 223, "mastery": true, "duree": 45, "exos": []}, {"n": 11, "phase": "Wiederholung", "de": "Lektion 9 · Wiederholung", "ar": "الحصة 11 — المراجعة الشاملة والتلخيص", "intro": "لخّص الوحدة كاملة في صفحة واحدة من ذاكرتك (مفردات + قواعد + بنى) ثم قارن بالكتاب. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}, {"n": 12, "phase": "Frost- & Testtraining", "de": "Lektion 9 · Frost- & Testtraining", "ar": "الحصة 12 — الجاهزية للفروض والاختبارات", "intro": "بلا ضغط وقت : افتح 🗂️ المكتبة → وثائق هذه الوحدة (فروض واختبارات رسمية) وحلّها حتى الإتقان — المعيار جاهزيتك يوم الفرض، لا سرعة إنهائك. بدون صفحات جديدة — اعتماد على المكتبة والتلخيص.", "pages": [], "page": null, "mastery": true, "duree": 45, "exos": []}];

const UNITES = [
  { n:1, de:'Sich vorstellen',        ar:'التعريف بالنفس',         icon:'👋', cecrl:'A1', niveau:'2AS',
    lektion:1, pages:[5,29],
    seances:SEANCES_U1, devoir:(typeof DEVOIR_U1!=='undefined'?DEVOIR_U1:null), duree:465 },
  { n:2, de:'Haus und Familie',       ar:'البيت والعائلة',         icon:'🏠', cecrl:'A1→A2', niveau:'2AS',
    lektion:2, pages:[31,55],
    seances:(window.SEANCES_U2||[]), devoir:null, duree:465 },
  { n:3, de:'Schule und Unterricht',  ar:'المدرسة والدرس',         icon:'🏫', cecrl:'A2', niveau:'2AS',
    lektion:3, pages:[57,76],
    seances:(window.SEANCES_U3||[]), devoir:null, duree:465 },
  { n:4, de:'Zeit und Wetter',        ar:'الوقت والطقس',           icon:'⏰', cecrl:'A2', niveau:'2AS',
    lektion:4, pages:[77,101],
    seances:(window.SEANCES_U4||[]), devoir:null, duree:465 },
  { n:5, de:'Freizeit',               ar:'أوقات الفراغ',           icon:'⚽', cecrl:'A2', niveau:'2AS',
    lektion:5, pages:[103,127],
    seances:(window.SEANCES_U5||[]), devoir:null, duree:465 },
  { n:6, de:'Mensch und Gesundheit',  ar:'الإنسان والصحة',         icon:'🏥', cecrl:'A2', niveau:'2AS',
    lektion:6, pages:[129,149],
    seances:(window.SEANCES_U6||[]), devoir:null, duree:465 },
  { n:7, de:'Essen und Trinken', ar:'المأكل والمشرب', icon:'🍽️', cecrl:'A2', niveau:'2AS', lektion:7, pages:[151,180],
    seances:(window.SEANCES_U7||[]), devoir:null, duree:465 },
  { n:8, de:'Aussehen und Charakter', ar:'المظهر والشخصية', icon:'🪞', cecrl:'A2→B1', niveau:'2AS', lektion:8, pages:[181,205],
    seances:(window.SEANCES_U8||[]), devoir:null, duree:465 },
  { n:9, de:'Stadtleben – Landleben', ar:'حياة المدينة والريف', icon:'🏙️', cecrl:'B1', niveau:'2AS', lektion:9, pages:[207,223],
    seances:(window.SEANCES_U9||[]), devoir:null, duree:465 },
  { n:10, de:'Persönlichkeit und Identität', ar:'الشخصية والهوية', icon:'🪞', cecrl:'B1',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[0].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[0].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[0].duree_totale : 360) },
  { n:11, de:'Staatsbürgerschaft',           ar:'المواطنة',       icon:'🏛️', cecrl:'B1',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[1].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[1].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[1].duree_totale : 360) },
  { n:12, de:'Leben in der Gesellschaft',    ar:'الحياة في المجتمع', icon:'🤝', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[2].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[2].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[2].duree_totale : 360) },
  { n:13, de:'Wissenschaft und Technologie', ar:'العلوم والتكنولوجيا', icon:'🔬', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE10 ? UNITE10.seances : []),
    devoir: (window.UNITE10 ? UNITE10.devoir  : null),
    duree:  (window.UNITE10 && UNITE10.meta ? UNITE10.meta.duree_totale : 360) },
  { n:14, de:'Wirtschaft und Arbeit',        ar:'الاقتصاد والعمل', icon:'💼', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE11 ? UNITE11.seances : []),
    devoir: (window.UNITE11 ? UNITE11.devoir  : null),
    duree:  (window.UNITE11 && UNITE11.meta ? UNITE11.meta.duree_totale : 360) },
  { n:15, de:'Umweltprobleme',               ar:'مشاكل البيئة', icon:'🌍', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE12 ? UNITE12.seances : []),
    devoir: (window.UNITE12 ? UNITE12.devoir  : null),
    duree:  (window.UNITE12 && UNITE12.meta ? UNITE12.meta.duree_totale : 360) },
  { n:16, de:'Gesundheit und Lebensweise',    ar:'الصحة ونمط الحياة',     icon:'🏥', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE13 ? UNITE13.seances : []),
    devoir: (window.UNITE13 ? UNITE13.devoir  : null),
    duree:  (window.UNITE13 && UNITE13.meta ? UNITE13.meta.duree_totale : 360) },
  { n:17, de:'Globalisierung',                ar:'العولمة',               icon:'🌐', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE14 ? UNITE14.seances : []),
    devoir: (window.UNITE14 ? UNITE14.devoir  : null),
    duree:  (window.UNITE14 && UNITE14.meta ? UNITE14.meta.duree_totale : 360) },
  { n:18, de:'Medienwelt',                    ar:'عالم الإعلام',          icon:'📰', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE15 ? UNITE15.seances : []),
    devoir: (window.UNITE15 ? UNITE15.devoir  : null),
    duree:  (window.UNITE15 && UNITE15.meta ? UNITE15.meta.duree_totale : 360) },
  { n:19, de:'Kultureller Dialog',            ar:'الحوار الثقافي',        icon:'🤝', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE16 ? UNITE16.seances : []),
    devoir: (window.UNITE16 ? UNITE16.devoir  : null),
    duree:  (window.UNITE16 && UNITE16.meta ? UNITE16.meta.duree_totale : 360) }

];


let SEANCES = UNITES[0].seances;
let DEVOIR   = UNITES[0].devoir;

function uniteActive(){ return UNITES.filter(u => u.n === currentUnite)[0] || UNITES[0]; }

function selectUnite(n){
  const u = UNITES.filter(x => x.n === n)[0];
  if(!u){ toast('⚠️ الوحدة غير متوفرة','ko'); return; }
  if(!u.seances || !u.seances.length){ toast('🔒 محتوى الوحدة ' + n + ' غير جاهز','ko'); return; }
  currentUnite = n;
  SEANCES = u.seances;
  DEVOIR   = u.devoir || DEVOIR_U1;
  const d = $('#seanceDetail'); if(d) d.innerHTML = '';
  renderSeances(); paintUniteHead(); renderStats();
  /* ── Événement dz:unite : notifie les modules (DEVOIRS_UNITE, etc.) ── */
  try{
    document.dispatchEvent(new CustomEvent('dz:unite', { detail: { n: n, unite: u } }));
  }catch(e){}
  /* ── Rendu automatique : si l'unité n'a pas de devoir codé en dur,
         afficher les documents de la bibliothèque filtrés par unité ── */
  if(!u.devoir && window.DEVOIRS_UNITE){
    try{
      const body = $('#devoirBody');
      if(body){
        DEVOIRS_UNITE.charger().then(function(){
          DEVOIRS_UNITE.rendre(n, body);
          const meta = DEVOIRS_UNITE.meta[n];
          const docs = DEVOIRS_UNITE.parUnite(n);
          const dt = $('#devoirTitle');
          if(dt && meta){
            dt.innerHTML = '📝 وثائق الوحدة ' + n + ' <span class="pill">' + meta.ar + '</span>';
          }
          const ds = $('#devoirSub');
          if(ds && meta){
            ds.textContent = '📚 ' + docs.length + ' وثيقة (فروض + اختبارات + حوليات) · ' +
              (meta.pages ? 'الكتاب ص ' + meta.pages[0] + '-' + meta.pages[1] : 'مستوى 3AS');
          }
        });
      }
    }catch(e){ console.warn('[selectUnite] DEVOIRS_UNITE', e); }
  }
  toast('📚 الوحدة ' + n + ' : ' + u.de + ' — ' + u.ar, 'ok');
}

function uniteSelector(){
  const niv = niveauActif || 'tous';
  const list = niv === 'tous' ? UNITES : UNITES.filter(u => (u.niveau || '2AS') === niv);
  const NIV = [['tous','🎓 الكل'],['2AS','2️⃣ ثانية ثانوي'],['3AS','3️⃣ ثالثة ثانوي · BAC']];
  return '<div class="niv-sel">' + NIV.map(n =>
      '<button class="niv' + (niv === n[0] ? ' on' : '') + '" data-niveau="' + n[0] + '">' +
      n[1] + '</button>').join('') + '</div>' +
    '<div class="unite-sel">' + list.map(u => {
    const dispo = !!(u.seances && u.seances.length);
    const st = loadSeancesFor(u.n);
    const done = (st.done || []).length;
    const tot = (u.seances || []).length || 8;
    const pct = Math.round(done / tot * 100);
    return '<button class="ucard' + (u.n === currentUnite ? ' on' : '') + (dispo ? '' : ' off') + '"' +
      (dispo ? ' data-unite="' + u.n + '"' : ' disabled') + '>' +
      '<div class="ucard-top"><span class="ucard-n">الوحدة ' + u.n + '</span>' +
        '<span class="ucard-lv' + (u.niveau === '3AS' ? ' bac' : '') + '">' +
        esc(u.niveau || '2AS') + '</span></div>' +
      '<div class="ucard-de de-display">' + u.icon + ' ' + esc(u.de) + '</div>' +
      '<div class="ucard-ar">' + esc(u.ar) + '</div>' +
      '<div class="ucard-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="ucard-m"><span class="chip' + (dispo ? ' ok' : '') + '">' +
        (dispo ? done + '/' + tot + ' حصص · ' + pct + '%' : '🔒 قريباً') + '</span>' +
        '<span class="chip">' + esc(u.cecrl) + '</span>' +
        '<span class="chip">⏱️ ' + Math.round((u.duree||60) / 60) + ' س</span></div></button>';
  }).join('') + '</div>';
}

function paintUniteHead(){
  const u = uniteActive();
  const hd = $('#seancesHead');
  if(hd) hd.innerHTML = '<h1>📚 الوحدة ' + u.n + ' : <span class="de-display">' + esc(u.de) + '</span></h1>' +
    '<p>' + esc(u.ar) + ' — ' + u.seances.length + ' حصص · ' + Math.round((u.duree||60) / 60) +
    ' ساعة · المستوى ' + esc(u.cecrl) + ' · البرنامج الرسمي MEN</p>' +
    '<div class="progress-wrap"><div class="progress" id="progSeances"></div></div>' +
    '<div class="progress-lbl" id="progLbl"></div>';
  const dt = $('#devoirTitle');
  if(dt) dt.innerHTML = '📝 فرض الوحدة ' + u.n + ' <span class="pill">/20</span>';
  const ds = $('#devoirSub');
  if(ds) ds.textContent = 'Évaluation — ' + u.de + ' · المدة : ' + (u.duree||60) +
                          ' دقيقة · التصحيح النموذجي + سلّم التنقيط';
  const p = $('#progSeances');
  if(p){
    const st = loadSeances();
    const pct = Math.round((st.done || []).length / u.seances.length * 100);
    p.style.width = pct + '%';
    const l = $('#progLbl');
    if(l) l.textContent = (st.done || []).length + ' / ' + u.seances.length + ' حصص · ' + pct + '%';
  }
}

/* ── Stockage isolé par وحدة ── */
function uniteKey(n){ return LS.seances + ':u' + (n || currentUnite); }
function loadSeancesFor(n){ return load(uniteKey(n), {done:[], exo:{}}); }
function loadSeances(){ return load(uniteKey(), {done:[], exo:{}}); }
function saveSeances(v){ store(uniteKey(), v); }


/* ─────────────── IA DU PROFESSEUR VIRTUEL ─────────────── */
/* PROF : noyau extrait vers prof_core.js (chargé avant app.js) — même logique, même API. */

/* ─────────────── UTILITAIRES ─────────────── */
const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

function store(k, v){
  try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch(e){}
}
function load(k, d){
  try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; }
}
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let toastTimer = null;
function toast(msg, type){
  const el = $('#toast'); if(!el) return;
  el.className = 'toast on ' + (type || ''); el.innerHTML = msg; el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.hidden = true, 320); }, 3200);
}

/* ─────────────── SYNTHÈSE VOCALE ALLEMANDE ─────────────── */
let voicesDE = [];
function loadVoices(){
  if(!('speechSynthesis' in window)) return;
  voicesDE = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang));
}
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
let soundOn = load(LS.sound, true);

function speak(text){
  if(!('speechSynthesis' in window)){ toast('🔇 النطق غير مدعوم في هذا المتصفح','ko'); return; }
  if(!soundOn){ toast('🔇 النطق الصوتي مُعطَّل','ko'); return; }
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,''));
    u.lang = 'de-DE'; u.rate = 0.86; u.pitch = 1;
    if(voicesDE.length) u.voice = voicesDE[0];
    speechSynthesis.speak(u);
  }catch(e){ toast('⚠️ تعذّر النطق','ko'); }
}

/* ─────────────── NAVIGATION ─────────────── */
const VIEWS = ['masar', 'accueil','seances','live','classe','grammaire','biblio','stats','quiz','officiels','examen','devoir','simulation','prof','parents','reservation','projet','profboard','matieres', 'guide', 'revision', 'corpus', 'rag', 'banque', 'malakhiss', 'cloud', 'methode', 'devoirs', 'buch', 'legal', 'abonne', 'sponsor', 'admin', 'compte'];
const TABS  = [['masar','🧭 مسارك'], ['accueil','🏠 الرئيسية'],['seances','📚 الحصص'],
               ['live','📹 القاعة المباشرة'],
               ['classe','🏫 القسم'],['grammaire','📘 القواعد'],['biblio','🗂️ المكتبة'],
               ['stats','🗺️ الإحصائيات'],['quiz','🎯 تمارين'],
               ['officiels','📄 الفروض'],['examen','🎓 البكالوريا'],
               ['devoir','📝 الفرض'],['simulation','⏱️ المحاكاة'],
               ['prof','🤖 الأستاذ'],['parents','👨‍👩‍👧 الأولياء'],
               ['reservation','🗓️ احجز حصّة'],['projet','📋 Plan de projet'],['matieres','📚 المواد'], ['guide','📖 الدليل'], ['revision','🧠 révision'], ['corpus','📚 Corpus'], ['rag','🔎 اسأل'], ['banque','✍️ Banque'], ['malakhiss','📑 ملخصات'], ['cloud','☁️ Cloud'], ['methode','🎯 Methode'], ['devoirs','📝 Klausuren'], ['buch','📗 Buch'], ['abonne','💳 Abonnement'], ['sponsor','📢 Sponsoring'], ['admin','🛡️ Admin'], ['legal','⚖️ قانوني'], ['compte','⚙️ حسابي']];

/* Onglet réservé au rôle « prof » — inséré avant « حسابي » */
function allTabs(){
  const t = TABS.slice();
  if(window.AUTH && AUTH.session){
    const s = AUTH.session();
    if(s && s.role === 'prof') t.splice(t.length - 1, 0, ['profboard','🧑‍🏫 لوحة الأستاذ']);
  }
  return t;
}
function isProf(){
  try{ const s = window.AUTH && AUTH.session ? AUTH.session() : null; return !!(s && s.role === 'prof'); }
  catch(e){ return false; }
}
let currentView = 'accueil';

const NAVCATS = [
  ['etudes', '🎓', 'الدراسة', ['seances', 'classe', 'grammaire', 'matieres', 'guide']],
  ['entrain', '📝', 'التدريب والاختبارات', ['revision', 'malakhiss', 'quiz', 'officiels', 'devoir', 'simulation', 'examen']],
  ['ress', '📚', 'الموارد', ['biblio', 'corpus', 'banque', 'methode', 'devoirs', 'buch']],
  ['inter', '💬', 'التفاعل', ['live', 'rag']],
  ['profcat', '👨', 'الأستاذ', ['prof', 'profboard']],
  ['parentscat', '👨‍👩‍👧', 'الأولياء', ['parents']],
  ['suivi', '📊', 'المتابعة', ['stats']],
  ['services', '🗓️', 'الخدمات', ['reservation']]
];
const NAVSOLO_TOP = ['accueil', 'masar'];
const NAVSOLO_BOT = ['cloud', 'abonne', 'sponsor', 'projet', 'admin', 'compte', 'legal'];
function renderTabs(){
  const c = $('#tabs'); if(!c) return;
  const tabs = allTabs();
  const byId = {};
  for(const t of tabs) byId[t[0]] = t;
  const used = {};
  const btn = (id, cls) => {
    const t = byId[id]; if(!t) return '';
    used[id] = 1;
    return '<button class="tab ' + (cls || '') + (id === currentView ? ' on' : '')
      + '" data-go="' + id + '">' + t[1] + '</button>';
  };
  /* Navigation compacte : catégories accordéon (fermées par défaut,
     une seule ouverte à la fois ; celle de la vue courante s'ouvre seule). */
  let h = '';
  for(const id of NAVSOLO_TOP) h += btn(id, 'solo');
  for(const g of NAVCATS){
    const items = g[3].filter(v => byId[v]);
    if(!items.length) continue;
    const open = items.indexOf(currentView) !== -1;
    h += '<button class="cat-head' + (open ? ' open' : '') + '" data-cat="' + g[0]
      + '" aria-expanded="' + (open ? 'true' : 'false') + '"><span>' + g[1] + ' ' + g[2]
      + '</span><span class="cat-arrow">▾</span></button>';
    h += '<div class="cat-body"' + (open ? '' : ' hidden') + '>'
      + items.map(v => btn(v, 'sub')).join('') + '</div>';
  }
  for(const id of NAVSOLO_BOT) h += btn(id, 'solo');
  /* filet de sécurité : aucun onglet autorisé à disparaître */
  const rest = tabs.filter(t => !used[t[0]]);
  if(rest.length){
    const open = rest.some(t => t[0] === currentView);
    h += '<button class="cat-head' + (open ? ' open' : '') + '" data-cat="autres" aria-expanded="'
      + (open ? 'true' : 'false') + '"><span>➕ أخرى</span><span class="cat-arrow">▾</span></button>'
      + '<div class="cat-body"' + (open ? '' : ' hidden') + '>'
      + rest.map(t => { used[t[0]] = 1; return btn(t[0], 'sub'); }).join('') + '</div>';
  }
  c.innerHTML = h;
}

/* 🧭 prochaine حصة non faite du niveau actif (pour masar.js). */
function prochaineSeance(){
  const st = loadSeances();
  const done = st.done || [];
  for(const u of UNITES){
    const niv = u.niveau || '2AS';
    if(niveauActif !== 'tous' && niv !== niveauActif) continue;
    const ses = u.seances || [];
    const faites = ses.filter(s => done.indexOf(s.n) !== -1).length;
    if(faites < ses.length){
      const suivante = ses.filter(s => done.indexOf(s.n) === -1)[0] || null;
      return { unite: u.n, titre: u.de, ar: u.ar, faites: faites,
               total: ses.length, prochaine: suivante };
    }
  }
  return null;
}
window.prochaineSeance = prochaineSeance;
window.getNiveauActif = function(){ return niveauActif; };

function go(view){
  if(VIEWS.indexOf(view) === -1) view = 'accueil';
  /* ── Porte 3.2 : vues entièrement payantes (config.paid_views, vide par défaut) ── */
  if(window.ACCESS && !ACCESS.canAccessView(view)){
    ACCESS.setReturn({ view: view });
    ACCESS.paywall({ type:'view', view: view });
    toast('🔒 هذا الفضاء ضمن الاشتراك', 'ko');
    return;
  }
  currentView = view;
  /* Une seule vue visible, garantie : hidden + display inline (aucune règle CSS
     ne peut forcer l'affichage d'une vue inactive, cf bug [hidden] écrasé). */
  $$('.view').forEach(s => {
    const actif = s.dataset.view === view;
    s.hidden = !actif;
    s.style.display = actif ? '' : 'none';
  });
  renderTabs();
  /* Ferme TOUT tiroir de navigation mobile (plusieurs sélecteurs possibles). */
  $$('#tabs, .tabs, .drawer, #navDrawer').forEach(t => t.classList.remove('open'));
  const bg = $('#tabsBg') || $('#drawerBg') || $('.drawer-bg');
  if(bg) bg.hidden = true;
  /* Remonte en haut IMMÉDIATEMENT : sur mobile un scroll 'smooth' donne l'impression
     que rien n'a changé et que le contenu s'est ajouté sous la page d'accueil. */
  window.scrollTo(0, 0);
  /* ── 3.2 : rafraîchit l'entitlement (Backend) + rejoue le chemin de retour
     sauvegardé dès que l'abonnement devient actif ── */
  if(window.ACCESS && ACCESS.refresh){
    ACCESS.refresh().then(function(){
      if(view === 'seances'){ try{ renderSeances(); }catch(e){} }
      var ent = ACCESS.entitlement();
      if(ent && ent.ok){
        var r = ACCESS.getReturn();
        if(r){
          ACCESS.clearReturn();
          if(r.seance && view === 'seances'){ try{ openSeance(r.seance); }catch(e){} }
          else if(r.view && r.view !== view){ try{ go(r.view); }catch(e){} }
        }
      }
    }).catch(function(){});
  }
  document.dispatchEvent(new CustomEvent('dz:view', { detail: view }));
  if(view === 'seances'){ renderSeances(); paintUniteHead(); }
  if(view === 'biblio' && window.renderBiblio) window.renderBiblio();
  if(view === 'stats' && window.renderStats2) window.renderStats2();
  if(view === 'quiz' && window.renderQuiz) window.renderQuiz();
  if(view === 'officiels' && window.renderOfficiels) window.renderOfficiels();
  if(view === 'examen' && window.renderExamen) window.renderExamen();
  if(view === 'live' && window.renderLive) window.renderLive();
  if(view === 'classe' && window.renderClasse) window.renderClasse();
  if(view === 'grammaire' && window.renderGrammaire) window.renderGrammaire();
  if(view === 'devoir')     renderDevoir();
  if(view === 'simulation') renderSim();
  if(view === 'parents')    renderParents();
  if(view === 'compte')     renderCompte();
  if(view === 'reservation' && window.renderReservation) window.renderReservation();
  if(view === 'matieres' && window.renderMatieres) window.renderMatieres();
  if(view === 'guide' && window.renderGuide) window.renderGuide();
  if(view === 'revision' && window.renderMemoire) window.renderMemoire();
  if(view === 'masar' && window.renderMasar) window.renderMasar();
  if(view === 'corpus' && window.renderCorpus) window.renderCorpus();
  if(view === 'rag' && window.renderRag) window.renderRag();
  if(view === 'banque' && window.renderBanque) window.renderBanque();
  if(view === 'malakhiss' && window.renderMalakhiss) window.renderMalakhiss();
  if(view === 'cloud' && window.renderCloud) window.renderCloud();
  if(view === 'admin' && window.renderAdmin) window.renderAdmin();
  if(view === 'abonne' && window.renderAbonne) window.renderAbonne();
  if(view === 'methode' && window.renderMethode) window.renderMethode();
  if(view === 'devoirs' && window.renderDevoirs) window.renderDevoirs();
  if(view === 'buch' && window.renderBuch) window.renderBuch();
  if(view === 'legal' && window.renderLegal) window.renderLegal();
  if(view === 'sponsor' && window.renderSponsor) window.renderSponsor();
  if(view === 'projet' && window.renderProjet) window.renderProjet();
  if(view === 'profboard' && window.renderProfBoard) window.renderProfBoard();
  const mp = $('#miniProf'); if(mp) mp.hidden = !isProf();
  if(view === 'prof'){ const l = $('#chatLog'); if(l && l.children.length === 0) initChat(); }
  if(view === 'accueil')    renderStats();
  if(window.MEMOIRE && window.MEMOIRE.carteAccueil) window.MEMOIRE.carteAccueil();
}

/* ─────────────── ACCUEIL : STATISTIQUES ─────────────── */
function renderStats(){
  const st   = loadSeances();
  const done = (st.done || []).length;
  const sim  = load(LS.sim, {});
  const best = (sim.best !== undefined && sim.best !== null) ? sim.best + '/20' : '—';
  const el = $('#statsHome'); if(!el) return;
  el.innerHTML = [[done + '/8','حصص مكتملة'],[DEVOIR.total,'نقطة في الفرض'],
                  [best,'أفضل نتيجة'],['0555…7931','واتساب']]
    .map(s => '<div class="stat"><div class="stat-n">' + s[0] + '</div><div class="stat-l">' + s[1] + '</div></div>')
    .join('');
}

/* ─────────────── SÉANCES ─────────────── */
function renderSeances(){
  const st   = loadSeances();
  const done = st.done || [];
  const g = $('#seancesGrid'); if(!g) return;

  g.innerHTML = uniteSelector() +
    '<h2>📖 الوحدة ' + uniteActive().n + ' : <span class="de-display">' +
    esc(uniteActive().de) + '</span> — ' + esc(uniteActive().ar) + '</h2>' +
    SEANCES.map(s => {
    const isDone = done.indexOf(s.n) !== -1;
    const locked = s.n > 1 && done.indexOf(s.n - 1) === -1 && !isDone;
    const paid = window.ACCESS ? !ACCESS.canAccessLesson(uniteActive().n, s.n) : false;
    const meta = s.ex === 'devoir'
      ? '<span class="chip ex">📝 اختبار /20</span>'
      : '<span class="chip">' + (((s.exos||[]).length) ? ((s.exos||[]).length + ' تمرين') : '📖 درس من الكتاب') + '</span>';
    return '<div class="seance' + (isDone ? ' done' : '') + (locked ? ' lock' : '') + '" data-seance="' + s.n + '">'
      + '<div class="s-num">' + (isDone ? '✓' : s.n) + '</div><div class="s-body">'
      + '<div class="s-t">' + ((locked || paid) ? '🔒 ' : '') + 'الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</div>'
      + '<div class="s-d">' + esc(s.de) + '</div>'
      + '<div class="s-meta"><span class="chip">⏱️ ' + (s.dur||s.duree||45) + ' د</span>' + meta + (paid ? '<span class="chip lk">🔒 مشتركون</span>' : '')
      + (isDone ? '<span class="chip ok">✅ مكتملة</span>' : '') + '</div></div></div>';
  }).join('');

  const pct = Math.round(done.length / SEANCES.length * 100);
  const p = $('#progSeances'); if(p) p.style.width = pct + '%';
  const l = $('#progLbl'); if(l) l.textContent = done.length + ' / ' + SEANCES.length + ' حصص · ' + pct + '%';
}

/* ══════════════════════════════════════════════════════════════════════
   RYTHME OFFICIEL D'UNE SÉANCE — maquette du professeur
   5 étapes chronométrées : [5, 15, 15, 15, 10] = 60 minutes
   Validé par le test T5 : « Séances 60' + grille /5 + devoir /20 »
   ══════════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════════════
   RYTHMES OFFICIELS DES SÉANCES — test T5 de la maquette du professeur
     sum([5, 15, 15, 15, 10])     == 60   · 5 étapes · حصة type
     sum([5, 5, 10, 15, 10, 10, 5]) == 60 · 7 étapes · compréhension de texte
     sum([5, 10, 20, 10, 10, 5])  == 60   · 6 étapes · production écrite
   Le rythme est choisi par TYPE de حصة, puis mis à l'échelle si la
   durée réelle diffère de 60 minutes (45 min, 90 min…).
   ══════════════════════════════════════════════════════════════════════ */
const ETAPES_PAR_TYPE = {
  /* Rythme par défaut — vocabulaire + grammaire + application */
  defaut: [
    { m:5,  ar:'إحماء وتذكير',       de:'Wiedereinstieg',                i:'🔔' },
    { m:15, ar:'المفردات',           de:'Wortschatz',                    i:'🔑' },
    { m:15, ar:'القواعد',            de:'Grammatik',                     i:'📘' },
    { m:15, ar:'التطبيق والتمارين',   de:'Anwendung und Übung',           i:'✏️' },
    { m:10, ar:'خلاصة وواجب منزلي',  de:'Zusammenfassung + Hausaufgabe', i:'🏁' }
  ],
  /* Rythme compréhension de texte — double lecture guidée (7 étapes) */
  lecture: [
    { m:5,  ar:'إحماء ومقدمة للنص',        de:'Wiedereinstieg + Einstieg ins Thema', i:'🔔' },
    { m:5,  ar:'المفردات الصعبة',          de:'Schlüsselwörter',                     i:'🔑' },
    { m:10, ar:'القراءة الأولى (صامتة)',    de:'Erstes Lesen (still)',                i:'📖' },
    { m:15, ar:'القراءة الثانية + الأسئلة', de:'Zweites Lesen + Fragen',              i:'📖' },
    { m:10, ar:'صحيح / خطأ',               de:'Richtig oder Falsch',                 i:'✏️' },
    { m:10, ar:'التصحيح المعلَّل',          de:'Begründete Korrektur',                i:'✅' },
    { m:5,  ar:'خلاصة',                    de:'Zusammenfassung',                     i:'🏁' }
  ],
  /* Rythme production écrite — 20 minutes de rédaction (6 étapes) */
  ecriture: [
    { m:5,  ar:'إحماء + تذكير بالنموذج',   de:'Wiedereinstieg + Modell',             i:'🔔' },
    { m:10, ar:'تحليل المطلوب',            de:'Aufgabenanalyse',                     i:'📋' },
    { m:20, ar:'الكتابة',                  de:'Schreiben',                           i:'✍️' },
    { m:10, ar:'مراجعة متبادلة',           de:'Gegenseitige Korrektur',              i:'🔍' },
    { m:10, ar:'التنقيط بالشبكة /5',       de:'Bewertung mit dem Raster (/5)',       i:'📊' },
    { m:5,  ar:'النموذج الرسمي + خلاصة',   de:'Modellösung + Zusammenfassung',       i:'🏁' }
  ]
};

/* Compatibilité : ETAPES_SEANCE désigne le rythme par défaut. */
const ETAPES_SEANCE = ETAPES_PAR_TYPE.defaut;
const ETAPES_TOTAL = ETAPES_SEANCE.reduce(function(a, e){ return a + e.m; }, 0);   /* 60 */

/* Détermine le rythme d'après le type de la حصة (surchargeable via s.rythme). */
function typeSeance(s){
  if(!s) return 'defaut';
  if(s.rythme && ETAPES_PAR_TYPE[s.rythme]) return s.rythme;
  const t = String(s.de || '') + ' ' + String(s.ar || '');
  if(/Textproduktion|إنتاج كتابي|Schreiben|expression écrite/i.test(t)) return 'ecriture';
  if(/Textverständnis|فهم نص|Leseverstehen|Lecture|قراءة/i.test(t)) return 'lecture';
  return 'defaut';
}

/* Barème proportionnel pour les حصص qui ne durent pas 60 minutes.
   Accepte soit l'objet حصة, soit une durée brute (rétro-compatibilité). */
function etapesPour(s){
  const seance = (s && typeof s === 'object') ? s : { dur: s };
  const cle = typeSeance(seance);
  const base = ETAPES_PAR_TYPE[cle] || ETAPES_PAR_TYPE.defaut;
  const total = base.reduce(function(a, e){ return a + e.m; }, 0);
  const d = Number((seance.dur||seance.duree||45)) || total;
  if(d === total) return base;
  return base.map(function(e){
    return { m: Math.max(3, Math.round(e.m * d / total)),
             ar: e.ar, de: e.de, i: e.i };
  });
}

/* ══════════════════════════════════════════════════════════════════════
   GRILLE DE CRITÈRES — production écrite de حصة, notée sur 5
   Maquette : {"5 informations": 2, "conjugaison + alt": 1,
               "place du verbe": 1, "lisibilité": 1}  →  total 5
   ══════════════════════════════════════════════════════════════════════ */
const GRILLE_S5 = [
  ['5 informations',      2, 'الاسم · العمر · البلد · المدينة · ما تتعلّمه (0,4 / معلومة)'],
  ['conjugaison + alt',   1, 'sein/haben/kommen/wohnen/lernen correctement conjugués + « Jahre alt »'],
  ['place du verbe',      1, 'le verbe conjugué en 2ᵉ position dans chaque phrase'],
  ['lisibilité',          1, 'majuscules aux noms, ponctuation, orthographe']
];
const GRILLE_S5_TOTAL = GRILLE_S5.reduce(function(a, g){ return a + g[1]; }, 0);   /* 5 */

/* Une حصة de production écrite se note sur 5, sauf grille explicite. */
function estTextproduktion(s){
  if(!s) return false;
  const t = String(s.de || '') + ' ' + String(s.ar || '');
  return /Textproduktion|إنتاج كتابي|Schreiben/i.test(t);
}
function grillePour(s){
  if(!s) return null;
  if(Array.isArray(s.grille) && s.grille.length) return s.grille;
  return estTextproduktion(s) ? GRILLE_S5 : null;
}

/* Ligne de temps des 5 étapes, insérée en tête de chaque حصة. */
function renderEtapes(s){
  const et = (window.__CYCLE || etapesPour)(s);
  const tyc = typeSeance(s);
  const LIB = { defaut:'rythme standard', lecture:'rythme lecture guidée',
                ecriture:'rythme production écrite' };
  const tot = et.reduce(function(a, e){ return a + e.m; }, 0);
  let cum = 0;
  return '<div class="etapes">'
    + '<div class="et-h"><b>⏱️ déroulé de la حصة</b>'
    + '<span>' + et.length + ' étapes · ' + tot + ' min · '
      + esc(LIB[tyc] || tyc) + '</span></div>'
    + '<div class="et-bar">' + et.map(function(e){
        cum += e.m;
        return '<i style="flex:' + e.m + '" title="' + esc(e.de) + ' — ' + e.m + ' min"></i>';
      }).join('') + '</div>'
    + '<div class="et-l">' + et.map(function(e, k){
        const debut = et.slice(0, k).reduce(function(a, x){ return a + x.m; }, 0);
        return '<div class="et-i"><span class="et-n">' + e.i + '</span>'
          + '<b>' + esc(e.ar) + '</b>'
          + '<i class="de-display">' + esc(e.de) + '</i>'
          + '<span class="et-m">' + e.m + ' د</span>'
          + '<span class="et-t">' + debut + '′ → ' + (debut + e.m) + '′</span></div>';
      }).join('') + '</div></div>';
}

/* Grille de notation /5 pour la production écrite. */
function renderGrille(g){
  if(!g || !g.length) return '';
  const tot = g.reduce(function(a, x){ return a + (Number(x[1]) || 0); }, 0);
  return '<div class="grille5"><div class="g5-h"><b>📊 السلّم — grille de notation</b>'
    + '<span class="g5-t">/ ' + tot + '</span></div>'
    + '<table class="bareme g5-tab"><tr><th>المعيار</th><th>التفصيل</th><th>النقطة</th></tr>'
    + g.map(function(x){
        return '<tr><td><b>' + esc(x[0]) + '</b></td>'
          + '<td style="text-align:right;color:var(--m);font-size:12px">' + esc(x[2] || '') + '</td>'
          + '<td class="g5-p">' + x[1] + '</td></tr>';
      }).join('')
    + '<tr class="g5-tot"><td colspan="2">المجموع</td><td class="g5-p">' + tot + '</td></tr>'
    + '</table></div>';
}

/* ── Livre officiel chargé une fois : window.__BOOK__[page] = {titre, lignes} ── */
window.__BOOK__ = window.__BOOK__ || {};
try {
  fetch('assets/bdd/buch_pages.json', {cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(B){
    if(B){ window.__BOOK__ = B; window.dispatchEvent(new Event('book-ready')); }
  }).catch(function(){});
} catch(e) {}
function leconLivre(s){
  var ps = (s.pages && s.pages.length) ? s.pages : (s.page ? [s.page] : []);
  if(!ps.length) return '';
  var out = '';
  var manque = false;
  ps.forEach(function(p){
    var e = (window.__BOOK__ || {})[String(p)];
    /* phase 7 : page payante = métadonnées SEULES (le corps vit dans lesson_content) */
    if(e && e.locked){
      out += '<div class="card" style="margin-top:12px">'
          + '<h3 style="margin:0 0 8px">📖 الصفحة ' + p + ' — ' + esc(e.titre ? e.titre : 'Lektion') + '</h3>'
          + '<p style="margin:0 0 10px">🔒 هذه الصفحة ضمن محتوى المشتركين — جسم الصفحة لا يُحمَّل قبل الاشتراك.</p>'
          + '<button class="btn btn-g" data-paypage="' + p + '">فتح البرنامج الكامل</button></div>';
      return;
    }
    var lignes = (e && e.lignes) ? e.lignes : [];
    if(!lignes.length) manque = true;
    out += '<div class="card" style="margin-top:12px">'
        + '<h3 style="margin:0 0 8px">📖 الصفحة ' + p + ' — ' + esc(e && e.titre ? e.titre : 'Lektion') + '</h3>'
        + (lignes.length ? lignes.map(function(l){ return '<p dir="ltr" lang="de" style="margin:0 0 10px;line-height:1.75;text-align:left">' + esc(l) + '</p>'; }).join('')
                         : '<p style="margin:0">… chargement du livre …</p>')
        + '<button class="btn btn-g" data-lire="' + p + '">🔊 écouter cette page</button></div>';
  });
  if(manque){
    window.addEventListener('book-ready', function(){
      var cur = document.querySelector('#seanceDetail .card.detail');
      if(cur && cur.getAttribute('data-n') == s.n) openSeance(s.n);
    }, {once:true});
  }
  return out;
}

function openSeance(n){
  const s = SEANCES.filter(x => x.n === n)[0]; if(!s) return;
  /* ── Porte 3.2 : le contenu payant passe par window.ACCESS (source unique de
     décision, config access_config.json). Aucun corps de leçon payante n'est
     construit ni affiché ci-dessous quand l'accès est refusé. ── */
  if(window.ACCESS && !ACCESS.canAccessLesson(uniteActive().n, n)){
    ACCESS.setReturn({ view:'seances', unite: uniteActive().n, seance: n });
    ACCESS.paywall({ type:'seance', unite: uniteActive().n, seance: n });
    toast('🔒 هذه الحصة ضمن الاشتراك — أكمل المسار المجاني أو اشترك', 'ko');
    return;
  }
  const st = loadSeances();
  st.done = st.done || []; st.exo = st.exo || {};
  const box = $('#seanceDetail'); if(!box) return;

  let h = '<div class="card detail" data-n="' + s.n + '">'
    + '<div class="detail-h"><div><h2 style="margin:0">الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</h2>'
    + '<div class="s-d" style="margin-top:3px">' + esc(s.de) + ' · ⏱️ ' + (s.dur||s.duree||45) + ' د</div></div>'
    + '<button class="close-x" id="closeDetail">✕</button></div>';

  if(s.ex === 'devoir'){
    h += '<p style="color:var(--m);font-size:13.5px;margin-bottom:13px">هذه الحصة هي الفرض الكتابي — الوحدة 1 (/20).</p>'
       + '<button class="btn btn-g btn-block" data-go="devoir">📝 الانتقال إلى الفرض</button></div>';
    box.innerHTML = h; box.scrollIntoView({behavior:'smooth', block:'start'}); return;
  }

  h += renderEtapes(s);
  h += leconLivre(s) + blocsPedago(s);

  if(s.obj) h += '<div class="gram"><h4>🎯 أهداف الحصة</h4><ul style="margin:0 20px;font-size:13px;color:var(--m)">'
    + s.obj.map(o => '<li>' + esc(o) + '</li>').join('') + '</ul></div>';
  if(s.texte) h += s.texte;
  if(s.consigne) h += s.consigne;
  h += renderGrille(grillePour(s));

  if(s.lex) h += '<h3 style="margin:17px 0 10px">🔑 المفردات — Wortschatz '
    + '<button class="btn btn-o btn-sm" id="speakAll" style="margin-right:8px">🔊 استمع للكل</button></h3>'
    + '<div class="lex">' + s.lex.map(p =>
        '<div class="lex-i"><div><div class="lex-de">' + esc(p[0]) + '</div>'
      + '<div class="lex-ar">' + esc(p[1]) + '</div></div>'
      + '<button class="speak" data-speak="' + esc(p[0]) + '">🔊</button></div>').join('') + '</div>';

  if(s.gram){
    h += '<div class="gram" style="margin-top:17px"><h4>📘 القاعدة — Grammatik : ' + esc(s.gram.t) + '</h4>';
    if(s.gram.b) h += '<ul style="margin:0 20px;font-size:13px;color:var(--m)">'
      + s.gram.b.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    if(s.gram.tbl) h += '<table class="conj"><tr><th>Pronom</th><th>Forme</th></tr>'
      + s.gram.tbl.map(r => '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td></tr>').join('') + '</table>';
    if(s.gram.ex) h += '<div style="margin-top:11px;font-size:13.5px;color:var(--g)">' + s.gram.ex + '</div>';
    h += '</div>';
  }
  if(s.modele) h += s.modele;

  if(s.exos && s.exos.length){
    h += '<h3 style="margin:19px 0 11px">✏️ تمارين — Übungen</h3>';
    s.exos.forEach((e, i) => {
      const key = 's' + s.n + '_e' + i, saved = st.exo[key];
      if(e.type === 'texte'){
        h += '<div class="exo" data-exo="' + key + '"><div class="q-t">' + e.q + '</div>'
           + '<textarea class="txt-in" id="in_' + key + '" placeholder="' + esc(e.ph || '') + '">'
           + esc((saved && saved.val) || '') + '</textarea>'
           + '<button class="btn btn-o btn-sm" data-check="' + key + '" style="margin-top:9px">🤖 صحّح مع الأستاذ</button>'
           + '<div class="fbk" id="fb_' + key + '"></div></div>';
      } else {
        h += '<div class="exo" data-exo="' + key + '"><div class="q-t"><span class="q-n">' + (i+1) + '</span>' + e.q + '</div>'
           + '<div class="opts">' + e.opts.map((o, oi) =>
               '<button class="opt' + (saved && saved.a === oi ? (oi === e.a ? ' ok' : ' ko') : '') + '" data-opt="' + oi + '"'
             + (saved ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') + '</div>'
           + '<div class="fbk' + (saved ? ' show ' + (saved.a === e.a ? 'ok' : 'ko') : '') + '" id="fb_' + key + '">'
           + (saved ? (saved.a === e.a ? '✅ ' : '❌ ') + e.why : '') + '</div></div>';
      }
    });
  }

  const fini = st.done.indexOf(s.n) !== -1;
  h += '<button class="btn btn-g btn-block" id="markDone"' + (fini ? ' disabled' : '') + '>'
     + (fini ? '✅ الحصة مكتملة' : '✔️ إنهاء الحصة') + '</button></div>';

  box.innerHTML = h;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}

function currentSeanceNum(){
  const d = $('#seanceDetail .detail'); return d ? +d.dataset.n : null;
}

/* ─────────────── EXERCICES ─────────────── */
function handleOpt(btn){
  const box = btn.closest('[data-exo]'); if(!box) return;
  const key = box.dataset.exo, m = key.match(/^s(\d+)_e(\d+)$/); if(!m) return;
  const s = SEANCES.filter(x => x.n === +m[1])[0]; if(!s) return;
  const e = s.exos[+m[2]]; if(!e) return;
  const chosen = +btn.dataset.opt;

  $$('.opt', box).forEach(o => {
    o.disabled = true;
    if(+o.dataset.opt === e.a) o.classList.add('ok');
    else if(+o.dataset.opt === chosen) o.classList.add('ko');
  });
  const fb = $('#fb_' + key, box);
  if(fb){ fb.className = 'fbk show ' + (chosen === e.a ? 'ok' : 'ko');
          fb.innerHTML = (chosen === e.a ? '✅ إجابة صحيحة! ' : '❌ إجابة خاطئة. ') + e.why; }

  const st = loadSeances(); st.exo = st.exo || {};
  st.exo[key] = {a:chosen, ok:chosen === e.a}; saveSeances(st);
  renderStats();
}

function handleTextCheck(key){
  const ta = $('#in_' + key); if(!ta) return;
  const val = ta.value.trim(), fb = $('#fb_' + key);
  if(!val){ if(fb){ fb.className = 'fbk show ko'; fb.innerHTML = '✍️ اكتب شيئاً أولاً!'; } return; }
  const rep = PROF.repondre(val), ok = rep.indexOf('✅') === 0;
  if(fb){ fb.className = 'fbk show ' + (ok ? 'ok' : 'ko'); fb.innerHTML = rep; }
  const st = loadSeances(); st.exo = st.exo || {};
  st.exo[key] = {val:val, ok:ok}; saveSeances(st);
  renderStats();
}

function markSeanceDone(){
  const n = currentSeanceNum(); if(!n) return;
  const st = loadSeances(); st.done = st.done || [];
  var wasTrial = window.ACCESS ? ACCESS.trialFinished() : false;
  if(st.done.indexOf(n) === -1){
    st.done.push(n); saveSeances(st);
    toast('🎉 أحسنت! تم إنهاء الحصة ' + n + '/8', 'ok');
  }
  var nowTrial = window.ACCESS ? ACCESS.trialFinished() : false;
  if(!wasTrial && nowTrial) showTrialDone();
  renderSeances(); renderStats(); openSeance(n);
  const nxt = SEANCES.filter(x => x.n === n + 1)[0];
  if(nxt) setTimeout(() => toast('👈 التالي : الحصة ' + nxt.n + ' — ' + nxt.ar), 1500);
  else setTimeout(() => toast('🏆 أكملت الوحدة 1 بالكامل!'), 1500);
}

/* ── 3.2 : écran de fin du parcours gratuit — affiché UNIQUEMENT quand le
   dernier élément gratuit défini par access_config.json vient d'être complété.
   Aucun numéro de leçon codé en dur : tout vient de ACCESS.trialFinished(). ── */
function showTrialDone(){
  if(document.getElementById('trialDoneOv')) return;
  var ov = document.createElement('div');
  ov.id = 'trialDoneOv'; ov.className = 'trialdone';
  ov.innerHTML =
    '<div class="td-card">'
    + '<div class="td-emo">🎉</div>'
    + '<h2>أحسنت! لقد أكملت المسار التجريبي المجاني.</h2>'
    + '<p>يمكنك الآن متابعة تعلم اللغة الألمانية والوصول إلى جميع الوحدات والدروس والتمارين والاختبارات.</p>'
    + '<p class="td-lock">🔒 هذا المحتوى متاح للمشتركين فقط.</p>'
    + '<button class="btn btn-g btn-block" id="tdGo">متابعة التعلم وفتح المحتوى الكامل</button>'
    + '<button class="btn btn-o btn-block" id="tdClose">لاحقًا</button>'
    + '</div>';
  document.body.appendChild(ov);
  var b1 = document.getElementById('tdGo'), b2 = document.getElementById('tdClose');
  if(b2) b2.addEventListener('click', function(){ try{ ov.remove(); }catch(e){} });
  if(b1) b1.addEventListener('click', function(){
    try{ ov.remove(); }catch(e){}
    try{
      var num = currentSeanceNum();
      ACCESS.setReturn({ view:'seances', unite: uniteActive().n, seance: num || null });
      ACCESS.paywall({ type:'trial_complete', unite: uniteActive().n });
      toast('🔒 اختر خطة الاشتراك المناسبة لك', 'ko');
    }catch(e){}
  });
}

/* ─────────────── DEVOIR /20 ─────────────── */
function renderDevoir(){
  const box = $('#devoirBody'); if(!box) return;
  const st = load(LS.devoir, {showCorr:false, ans:{}});

  let h = '<div class="privacy">📋 <b>' + DEVOIR.titre + '</b> — المدة ' + (DEVOIR.duree||60)
        + ' دقيقة · المجموع <b>' + DEVOIR.total + '/20</b> · الوحدة 1 : Sich vorstellen</div>';

  DEVOIR.parties.forEach(p => {
    h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + p.t + '</b>'
       + '<span class="note">' + p.pts + ' pts</span></div><div class="part-b">';
    if(p.texte) h += p.texte;
    p.questions.forEach(q => {
      h += '<div class="q" data-q="' + q.id + '"><div class="q-t"><span class="q-n">' + q.id + '</span>'
         + q.t + ' <span class="note" style="font-size:11px">' + q.pts + ' pt' + (q.pts > 1 ? 's' : '') + '</span></div>';
      if(q.type === 'vf'){
        h += '<div class="opts">' + ['Richtig (صحيح)','Falsch (خطأ)'].map((o, i) =>
             '<button class="opt" data-vf="' + i + '">' + o + '</button>').join('') + '</div>';
      } else if(q.type === 'qcm'){
        h += '<div class="opts">' + q.opts.map((o, i) =>
             '<button class="opt" data-qcm="' + i + '">' + esc(o) + '</button>').join('') + '</div>';
      } else if(q.type === 'txt'){
        h += '<input class="txt-in" style="min-height:44px" data-txt="' + q.id + '" placeholder="…">';
      } else if(q.type === 'redac'){
        h += '<textarea class="txt-in" data-redac="' + q.id + '" placeholder="Hallo! Ich heiße …"></textarea>';
        if(q.grille) h += '<table class="bareme"><tr><th>معيار التصحيح</th><th>النقطة</th></tr>'
          + q.grille.map(g => '<tr><td>' + g[0] + '</td><td>' + g[1] + '</td></tr>').join('') + '</table>';
      }
      h += '<div class="fbk" id="dfb_' + q.id + '"></div></div>';
    });
    h += '</div></div>';
  });

  h += '<div style="display:flex;gap:11px;flex-wrap:wrap">'
     + '<button class="btn btn-p" id="btnCorrDevoir">✅ إظهار التصحيح النموذجي</button>'
     + '<button class="btn btn-o" id="btnSimFromDevoir">⏱️ اجتازه كمحاكاة مُوقَّتة</button></div>'
     + '<div id="corrigeDevoir"></div>';

  box.innerHTML = h;
  if(st.showCorr) showCorrigeDevoir();
}

function showCorrigeDevoir(){
  const c = $('#corrigeDevoir'); if(!c || c.innerHTML) return;
  let h = '<div class="corrige"><h3>✅ التصحيح النموذجي — Corrigé type + سلّم التنقيط</h3>';
  DEVOIR.parties.forEach(p => {
    h += '<div style="margin-bottom:15px"><b style="color:var(--a2)">' + p.id + '. ' + p.t
       + ' <span class="note">' + p.pts + ' pts</span></b>';
    p.questions.forEach(q => {
      let rep = '';
      if(q.type === 'vf')  rep = q.rep;
      if(q.type === 'qcm') rep = q.opts[q.a] + '  —  ' + q.why;
      if(q.type === 'txt') rep = q.rep;
      if(q.type === 'redac') rep = (q.modele || '');
      h += '<div style="padding:8px 0;border-bottom:1px dashed var(--b);font-size:13px">'
         + '<b class="de-in">' + q.id + '</b> ' + (q.type === 'redac' ? '' : esc(q.t)) + '<br>'
         + '<span style="color:var(--g)">' + rep + '</span>'
         + (q.just ? '<br><span style="color:var(--m);font-size:12px">📌 ' + q.just + '</span>' : '') + '</div>';
    });
    h += '</div>';
  });
  h += '<table class="bareme"><tr><th>الجزء</th><th>المحتوى</th><th>النقاط</th></tr>'
     + DEVOIR.parties.map(p => '<tr><td><b>' + p.id + '</b></td><td>' + p.t + '</td><td>' + p.pts + '</td></tr>').join('')
     + '<tr style="background:rgba(61,220,132,.1)"><td colspan="2"><b>المجموع</b></td><td><b>' + DEVOIR.total + '</b></td></tr></table>'
     + '</div>';
  c.innerHTML = h;
  const st = load(LS.devoir, {}); st.showCorr = true; store(LS.devoir, st);
  c.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ─────────────── CHAT — PROFESSEUR VIRTUEL ─────────────── */
/* 4 pastilles de la maquette + 6 thèmes rapides du professeur */
const SUGS = ['🔤 أدوات التعريف','✏️ تمارين','💬 محادثة','❓ سؤال'];
const TOPICS = ['الفعل sein','الفعل haben','W-Fragen','نص Lena','تحضير الفرض','التحيات'];

function initChat(){
  const log = $('#chatLog'); if(!log) return;
  const hist = load(LS.chat, []);
  if(hist.length){
    hist.slice(-30).forEach(m => addMsg(m.who, m.txt, true));
  } else {
    addMsg('bot', 'السلام عليكم يا ولدي 🇩🇿 أنا <b>الأستاذ خريف أحمد</b> الافتراضي.<br>'
      + 'اسألني بالألمانية أو بالعربية عن الوحدة 1 : <span class="de-in">sein</span>، '
      + '<span class="de-in">haben</span>، العائلة، أو اكتب جملة وسأصحّحها لك.<br>'
      + '<span class="de-in">Also — wie geht es dir?</span>');
  }
  const sg = $('#chatSug');
  if(sg) sg.innerHTML =
    SUGS.map(s => '<button class="sug" data-sug="' + esc(s) + '">' + esc(s) + '</button>').join('') +
    '<div class="sug-sep"></div>' +
    TOPICS.map(t => '<button class="sug topic" data-sug="اشرح لي ' + esc(t) + '">'
      + esc(t) + '</button>').join('');
  const f = $('#chatForm');
  if(f && !f.dataset.bound){
    f.dataset.bound = '1';
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      const i = $('#chatInput'); const v = (i.value || '').trim(); if(!v) return;
      i.value = ''; sendChat(v);
    });
  }
}

function addMsg(who, txt, noSave){
  const log = $('#chatLog'); if(!log) return;
  const d = document.createElement('div');
  d.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  d.innerHTML = '<div class="who">' + (who === 'me' ? '🧑‍🎓 أنت' : '👨‍🏫 ' + PROF.nom) + '</div>' + txt;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
  if(!noSave){
    const h = load(LS.chat, []); h.push({who:who, txt:txt});
    store(LS.chat, h.slice(-60));
  }
  return d;
}

async function sendChat(v){
  /* 🔎 RAG gardé : si le corpus répond avec confiance, on sert l'extrait verbatim
     AVANT le tuteur à règles ; jamais de texte inventé. */
  if(window.RAG && window.RAG.cherche){
    try{
      const rr = await window.RAG.cherche(v);
      const ff = window.RAG.formule(rr);
      if(ff){ addMsg('bot', ff); return; }
    }catch(e){}
  }
  addMsg('me', esc(v));
  const log = $('#chatLog');
  const tp = document.createElement('div');
  tp.className = 'msg bot typing'; tp.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(tp); log.scrollTop = log.scrollHeight;
  setTimeout(() => {
    tp.remove();
    const rep = PROF.repondre(v);
    addMsg('bot', rep);
    if(soundOn && /de-in/.test(rep)){
      const m = rep.match(/<span class="de-in">([^<]+)<\/span>/);
      if(m) speak(m[1].replace(/<[^>]+>/g,''));
    }
  }, 480 + Math.random() * 420);
}

/* ══════════════════════════════════════════════════════════════════════
   FILET DE SÉCURITÉ AU DÉMARRAGE — la page ne doit JAMAIS rester vide
   Symptôme traité : « l'application ne s'ouvre pas mais il y a un message
   en bas » → #gate et #shell tous deux `hidden`, seul le toast perce.
   Leçon retenue du projet CABBA : « le message d'erreur existait mais
   n'était pas visible ». Ici l'erreur devient visible ET actionnable.
   ══════════════════════════════════════════════════════════════════════ */
function forceGate(){
  try{
    const g = document.querySelector('#gate'), sh = document.querySelector('#shell');
    if(sh) sh.hidden = true;
    if(g) g.hidden = false;
    const sp = document.querySelector('#splash');
    if(sp) sp.classList.add('off');
  }catch(e){}
}

function panneauPanne(err, origine){
  forceGate();
  if(document.getElementById('bootFail')) return;
  const msg = (err && (err.message || String(err))) || 'erreur inconnue';
  const pile = (err && err.stack) ? String(err.stack).split('\n').slice(0, 4).join('\n') : '';
  const box = document.createElement('div');
  box.id = 'bootFail';
  box.setAttribute('dir', 'rtl');
  box.style.cssText = 'position:fixed;z-index:9999;left:12px;right:12px;bottom:12px;'
    + 'max-width:640px;margin:0 auto;background:#2a0d12;border:2px solid #ff6b7d;'
    + 'border-radius:16px;padding:15px 17px;color:#ffd9de;font:13px/1.75 system-ui,'
    + 'sans-serif;box-shadow:0 18px 44px rgba(0,0,0,.6);text-align:right';
  box.innerHTML =
      '<div style="font-weight:800;font-size:15px;margin-bottom:7px">'
    + '⚠️ démarrage incomplet <span style="opacity:.7;font-weight:400">('
    + String(origine || 'boot') + ')</span></div>'
    + '<div style="opacity:.85;margin-bottom:9px">المنصة لم تُحمَّل بالكامل. '
    + 'السبب التقني ظاهر أدناه — جرّب « إعادة الضبط » أولاً.</div>'
    + '<code style="display:block;background:#170609;border:1px solid #6b2230;'
    + 'border-radius:10px;padding:9px 11px;font:11.5px/1.6 ui-monospace,Menlo,Consolas,'
    + 'monospace;direction:ltr;text-align:left;color:#ff9aa6;white-space:pre-wrap;'
    + 'word-break:break-word;max-height:132px;overflow:auto">'
    + String(msg).replace(/[&<>]/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; })
    + (pile ? '\n' + pile.replace(/[&<>]/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }) : '')
    + '</code>'
    + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:12px">'
    + '<button id="bfReset" style="flex:1;min-width:150px;background:#ff6b7d;color:#2a0d12;'
    + 'border:none;border-radius:11px;padding:11px 14px;font:700 13px system-ui;cursor:pointer">'
    + '🔄 إعادة الضبط (vider le cache)</button>'
    + '<button id="bfReload" style="flex:1;min-width:120px;background:transparent;'
    + 'color:#ffd9de;border:1px solid #ff6b7d;border-radius:11px;padding:11px 14px;'
    + 'font:700 13px system-ui;cursor:pointer">↻ إعادة التحميل</button>'
    + '<button id="bfClose" style="background:transparent;color:#ffd9de;border:1px solid #6b2230;'
    + 'border-radius:11px;padding:11px 14px;font:700 13px system-ui;cursor:pointer">✕</button>'
    + '</div>';
  (document.body || document.documentElement).appendChild(box);
  const rst = document.getElementById('bfReset');
  if(rst) rst.addEventListener('click', function(){
    try{
      /* 1) Service Workers : désenregistrement + purge de TOUS les caches */
      if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistrations().then(function(regs){
          regs.forEach(function(r){ try{ r.unregister(); }catch(e){} });
        }).catch(function(){});
      }
      if('caches' in window){
        caches.keys().then(function(ks){
          ks.forEach(function(k){ caches.delete(k); });
        }).catch(function(){});
      }
      /* 2) stockage local (session, progression, réservations) */
      try{ localStorage.clear(); }catch(e){}
      try{ sessionStorage.clear(); }catch(e){}
      /* 3) rechargement forcé, hors cache */
      setTimeout(function(){ window.location.reload(); }, 450);
    }catch(e){ window.location.reload(); }
  });
  const rl = document.getElementById('bfReload');
  if(rl) rl.addEventListener('click', function(){ window.location.reload(); });
  const cl = document.getElementById('bfClose');
  if(cl) cl.addEventListener('click', function(){ box.remove(); });
}

/* Erreurs non rattrapées n'importe où → panneau visible (plus de page blanche muette). */
window.addEventListener('error', function(ev){
  if(ev && ev.target && (ev.target.src || ev.target.href)){
    /* échec de chargement d'une ressource : on le journalise sans bloquer */
    try{ console.warn('[ressource]', ev.target.src || ev.target.href); }catch(e){}
    return;
  }
  panneauPanne(ev && ev.error ? ev.error : new Error(ev && ev.message), 'erreur globale');
});
window.addEventListener('unhandledrejection', function(ev){
  panneauPanne(ev && ev.reason, 'promesse rejetée');
});

/* ══════════════════════════════════════════════════════════════════════
   AUTO-DIAGNOSTIC DE DÉMARRAGE — écrit dans la console ET dans un bloc
   visible copiable. Aucune erreur JS n'étant remontée, il faut pouvoir
   LIRE l'état réel du DOM pour savoir ce qui est masqué.
   ══════════════════════════════════════════════════════════════════════ */
function etatDemarrage(){
  const q = s => document.querySelector(s);
  const qa = s => Array.prototype.slice.call(document.querySelectorAll(s));
  const g = q('#gate'), sh = q('#shell'), sp = q('#splash');
  const vues = qa('.view');
  /* Une vue dont l'ancêtre #shell est `hidden` n'est PAS réellement visible à l'écran,
     même si son propre attribut hidden vaut false. Mesurer `!v.hidden` seul donnait
     « vuesVisibles : 1 · vueActive : accueil » sur le portail de connexion — un chiffre
     faux qui masquait l'état réel. On mesure la visibilité EFFECTIVE (offsetParent). */
  const reellementVisible = el => {
    if(!el) return false;
    let n = el;
    while(n && n !== document.body){
      if(n.hidden) return false;
      const cs = getComputedStyle(n);
      if(cs.display === 'none' || cs.visibility === 'hidden') return false;
      n = n.parentElement;
    }
    return Boolean(el.offsetParent) || getComputedStyle(el).position === 'fixed';
  };
  const visibles = vues.filter(reellementVisible);
  const et = {
    gate:        g  ? (g.hidden ? 'hidden' : 'VISIBLE') : 'ABSENT',
    shell:       sh ? (sh.hidden ? 'hidden' : 'VISIBLE') : 'ABSENT',
    splash:      sp ? (sp.classList.contains('off') ? 'off (masqué)' : 'ACTIF (couvre tout)')
                    : 'ABSENT',
    bootFail:    q('#bootFail') ? 'AFFICHÉ' : 'non',
    vues:        vues.length,
    vuesVisibles: visibles.length,
    vueActive:   visibles.length ? visibles.map(v => v.dataset.view).join(',') : 'AUCUNE',
    tabs:        qa('#tabs .tab').length,
    tabActive:   (q('#tabs .tab.on') || {}).textContent || '—',
    contenuShell: sh ? sh.innerHTML.length : 0,
    contenuGate:  g  ? g.innerHTML.length  : 0,
    champsGate:   g  ? g.querySelectorAll('input,select,button').length : 0,
    sectionsGate: (q('#loginClasse') || {}).length || 0,
    wilayasGate:  (q('#suWilaya')    || {}).length || 0,
    gateReel:     reellementVisible(g),
    shellReel:    reellementVisible(sh),
    contenuAccueil: (q('[data-view="accueil"]') || {}).innerHTML
                      ? q('[data-view="accueil"]').innerHTML.length : 0,
    bodyChildren: document.body ? document.body.children.length : 0,
    cssApplique:  getComputedStyle(document.body).backgroundColor,
    policeBody:   getComputedStyle(document.body).fontFamily.slice(0, 40),
    session:      (window.AUTH && AUTH.session) ? (AUTH.session() ? 'présente' : 'aucune')
                                                : 'AUTH absent',
    uniteActive:  (typeof uniteActive === 'function' && uniteActive())
                    ? (uniteActive().n + ' — ' + uniteActive().de) : '—',
    seances:      (typeof SEANCES !== 'undefined' && SEANCES) ? SEANCES.length : 0,
    unites:       (typeof UNITES !== 'undefined' && UNITES) ? UNITES.length : 0
  };
  return et;
}

function journalDemarrage(origine){
  let et;
  try{ et = etatDemarrage(); }
  catch(e){ et = { erreur: String(e && e.message || e) }; }
  const lignes = Object.keys(et).map(k => '  ' + k + ' : ' + et[k]);
  const txt = '[DZ démarrage' + (origine ? ' · ' + origine : '') + ']\n' + lignes.join('\n');
  try{ console.info(txt); }catch(e){}
  return txt;
}

/* Bloc visible et copiable — utile quand la console n'est pas accessible (mobile). */
function boutonDiagnostic(){
  if(document.getElementById('dzDiagBtn')) return;
  const b = document.createElement('button');
  b.id = 'dzDiagBtn';
  b.textContent = '🩺 diagnostic';
  b.setAttribute('title', 'Afficher l’état réel du démarrage (copiable)');
  b.style.cssText = 'position:fixed;z-index:9998;left:10px;bottom:10px;background:#12351f;'
    + 'color:#9fe8bd;border:1px solid #2f6b45;border-radius:999px;padding:8px 13px;'
    + 'font:600 11.5px system-ui,sans-serif;cursor:pointer;opacity:.72';
  b.addEventListener('mouseenter', () => { b.style.opacity = '1'; });
  b.addEventListener('mouseleave', () => { b.style.opacity = '.72'; });
  b.addEventListener('click', () => {
    const txt = journalDemarrage('manuel');
    if(document.getElementById('dzDiagOut')){
      document.getElementById('dzDiagOut').remove();
      return;
    }
    const pre = document.createElement('pre');
    pre.id = 'dzDiagOut';
    pre.setAttribute('dir', 'ltr');
    pre.style.cssText = 'position:fixed;z-index:9998;left:10px;right:10px;bottom:52px;'
      + 'max-height:52vh;overflow:auto;margin:0;background:#08130c;color:#9fe8bd;'
      + 'border:1px solid #2f6b45;border-radius:13px;padding:12px 14px;'
      + 'font:11px/1.6 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;'
      + 'word-break:break-word;text-align:left;direction:ltr';
    pre.textContent = txt;
    document.body.appendChild(pre);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).catch(() => {});
    }
  });
  document.body.appendChild(b);
}

/* ─────────────── INITIALISATION ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { const sp = $('#splash'); if(sp) sp.classList.add('off'); }, 900);
  try{
    bootGate();
  }catch(errBoot){
    panneauPanne(errBoot, 'bootGate');
  }
  /* État réel du DOM, dans la console ET via le bouton 🩺 en bas à gauche. */
  setTimeout(() => { journalDemarrage('après bootGate'); boutonDiagnostic(); }, 1600);
  /* Filet : si après 3,5 s ni #gate ni #shell n'est visible, on force le portail. */
  setTimeout(() => {
    const g = $('#gate'), sh = $('#shell');
    const rien = (!g || g.hidden) && (!sh || sh.hidden);
    if(rien){
      forceGate();
      panneauPanne(new Error('aucun écran visible apres 3,5 s — '
        + journalDemarrage('watchdog').replace(/\n/g, ' | ')), 'watchdog');
    }
  }, 3500);

  document.addEventListener('click', ev => {
    const nv = ev.target.closest('[data-niveau]');
    if(nv){
      niveauActif = nv.dataset.niveau;
      store('dz_de_niveau_v1', niveauActif);
      const host = $('.niv-sel');
      if(host && host.parentElement){
        const ancien = $('.unite-sel');
        host.outerHTML = uniteSelector().split('</div>')[0] + '</div>';
      }
      const sel = $('.unite-sel');
      if(sel && sel.outerHTML){
        const tmp = document.createElement('div');
        tmp.innerHTML = uniteSelector();
        const nv2 = $('.niv-sel'), us2 = $('.unite-sel');
        if(nv2 && tmp.querySelector('.niv-sel')) nv2.outerHTML = tmp.querySelector('.niv-sel').outerHTML;
        if(us2 && tmp.querySelector('.unite-sel')) us2.outerHTML = tmp.querySelector('.unite-sel').outerHTML;
      }
      const n = UNITES.filter(u => (u.niveau || '2AS') === (niveauActif === 'tous' ? 'x' : niveauActif)).length;
      toast(niveauActif === 'tous' ? '🎓 كل الوحدات'
            : (niveauActif === '3AS' ? '3️⃣ السنة الثالثة ثانوي — برنامج البكالوريا'
                                     : '2️⃣ السنة الثانية ثانوي'), 'ok');
      return;
    }

    const un = ev.target.closest('[data-unite]');
    if(un){ selectUnite(+un.dataset.unite); return; }

    const sug = ev.target.closest('[data-sug]');
    if(sug){ sendChat(sug.dataset.sug); return; }

    const g = ev.target.closest('[data-go]');
    if(g){ ev.preventDefault(); go(g.dataset.go); return; }

    const sc = ev.target.closest('[data-seance]');
    if(sc){
      if(sc.classList.contains('lock')){ toast('🔒 أكمل الحصة السابقة أولاً','ko'); return; }
      openSeance(+sc.dataset.seance); return;
    }
    if(ev.target.closest('#closeDetail')){ const d = $('#seanceDetail'); if(d) d.innerHTML = ''; return; }

    const sp = ev.target.closest('[data-speak]');
    if(sp){ speak(sp.dataset.speak); sp.classList.add('talk');
            setTimeout(() => sp.classList.remove('talk'), 900); return; }

    if(ev.target.closest('#speakAll')){
      const n = currentSeanceNum(); const s = SEANCES.filter(x => x.n === n)[0];
      if(s && s.lex){ let i = 0;
        const t = setInterval(() => { if(i >= s.lex.length){ clearInterval(t); return; }
          speak(s.lex[i][0]); i++; }, 1500); }
      return;
    }

    const op = ev.target.closest('.opt');
    if(op && !op.disabled){
      if(op.dataset.opt !== undefined) handleOpt(op);
      else if(op.dataset.vf  !== undefined) answerVF(op);
      else if(op.dataset.qcm !== undefined) answerQCM(op);
      return;
    }
    const ck = ev.target.closest('[data-check]');
    if(ck){ handleTextCheck(ck.dataset.check); return; }
    const pp = ev.target.closest('[data-paypage]');
    if(pp){
      if(window.ACCESS && ACCESS.paywall){
        ACCESS.paywall({ type:'page', page:+pp.getAttribute('data-paypage') });
      }
      return;
    }
    if(ev.target.closest('#markDone')){ markSeanceDone(); return; }
    if(ev.target.closest('#btnCorrDevoir')){ showCorrigeDevoir(); return; }
    if(ev.target.closest('#btnSimFromDevoir')){ go('simulation'); return; }
  });

  const b = $('#btnBurger');
  if(b) b.addEventListener('click', () => { const t = $('#tabs'); if(t) t.classList.toggle('open'); });
  /* Accordéon : une seule catégorie ouverte à la fois (navigation compacte). */
  if(!window.__catwired){
    window.__catwired = true;
    document.addEventListener('click', ev => {
      const hd = ev.target && ev.target.closest ? ev.target.closest('.cat-head') : null;
      if(!hd || !$('#tabs') || !$('#tabs').contains(hd)) return;
      const body = hd.nextElementSibling;
      const wasOpen = hd.classList.contains('open');
      $$('#tabs .cat-head.open').forEach(x => {
        x.classList.remove('open');
        x.setAttribute('aria-expanded', 'false');
        if(x.nextElementSibling) x.nextElementSibling.hidden = true;
      });
      if(!wasOpen && body){
        hd.classList.add('open');
        hd.setAttribute('aria-expanded', 'true');
        body.hidden = false;
      }
    });
  }

  const bs = $('#btnSound');
  if(bs){
    const sync = () => bs.classList.toggle('muted', !soundOn);
    sync();
    bs.addEventListener('click', () => {
      soundOn = !soundOn; store(LS.sound, soundOn); sync();
      toast(soundOn ? '🔊 النطق مُفعَّل' : '🔇 النطق مُعطَّل', soundOn ? 'ok' : '');
      if(soundOn) speak('Guten Tag!');
    });
  }

  const dot = $('#netDot'), ban = $('#offlineBanner');
  const net = () => { const on = navigator.onLine;
    if(dot) dot.classList.toggle('off', !on); if(ban) ban.hidden = on; };
  window.addEventListener('online',  () => { net(); toast('🟢 عادت الاتصال','ok'); });
  window.addEventListener('offline', () => { net(); toast('📴 وضع عدم الاتصال','ko'); });
  net();

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    deferredPrompt = e;
    const bi = $('#btnInstall');
    /* On ne détourne l'invite que si notre bouton est réellement atteignable.
       Sur le portail de connexion #shell est masqué : sans cette garde, le
       navigateur journalise « Banner not shown: preventDefault() called ». */
    const sh = $('#shell');
    if(bi && sh && !sh.hidden){
      e.preventDefault();
      bi.hidden = false;
    }
  });
  const bi = $('#btnInstall');
  if(bi) bi.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const res = await deferredPrompt.userChoice;
    if(res && res.outcome === 'accepted'){ bi.hidden = true; toast('✅ تم تثبيت التطبيق','ok'); }
    deferredPrompt = null;
  });

  if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => toast('🔄 تحديث جديد قيد التنزيل…'));
      }).catch(() => {});
    });
  }

  try{ renderSeances(); }
  catch(errRs){ panneauPanne(errRs, 'renderSeances'); }
});

/* ── Réponses du devoir (VF / QCM) — utilisées par modules.js ── */
function answerVF(btn){
  const q = btn.closest('[data-q]'); if(!q) return;
  const id = q.dataset.q, chosen = +btn.dataset.vf;
  let found = null;
  DEVOIR.parties.forEach(p => p.questions.forEach(x => { if(x.id === id) found = x; }));
  if(!found) return;
  const correct = (chosen === 0) === (found.rep === 'Richtig');
  $$('.opt', q).forEach(o => { o.disabled = true; });
  btn.classList.add(correct ? 'ok' : 'ko');
  const fb = $('#dfb_' + id, q);
  if(fb){ fb.className = 'fbk show ' + (correct ? 'ok' : 'ko');
          fb.innerHTML = (correct ? '✅ ' : '❌ ') + 'Réponse : <b>' + found.rep + '</b> — ' + found.just; }
  const st = load(LS.devoir, {ans:{}}); st.ans = st.ans || {};
  st.ans[id] = {v:chosen, ok:correct, pts:correct ? found.pts : 0}; store(LS.devoir, st);
}

function answerQCM(btn){
  const q = btn.closest('[data-q]'); if(!q) return;
  const id = q.dataset.q, chosen = +btn.dataset.qcm;
  let found = null;
  DEVOIR.parties.forEach(p => p.questions.forEach(x => { if(x.id === id) found = x; }));
  if(!found) return;
  const correct = chosen === found.a;
  $$('.opt', q).forEach(o => { o.disabled = true;
    if(+o.dataset.qcm === found.a) o.classList.add('ok'); });
  if(!correct) btn.classList.add('ko');
  const fb = $('#dfb_' + id, q);
  if(fb){ fb.className = 'fbk show ' + (correct ? 'ok' : 'ko');
          fb.innerHTML = (correct ? '✅ ' : '❌ ') + found.why; }
  const st = load(LS.devoir, {ans:{}}); st.ans = st.ans || {};
  st.ans[id] = {v:chosen, ok:correct, pts:correct ? found.pts : 0}; store(LS.devoir, st);
}

/* ══════════ PORTAIL DE CONNEXION ══════════ */
function bootGate(){
  const gate = $('#gate'), shell = $('#shell');
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;

  if(window.AUTH){
    try{
      const ref = (window.BDD && BDD.state.ref && BDD.state.ref.items && BDD.state.ref.items[0]) || null;
      AUTH.initSelects(ref ? ref.wilayas : null);
    }catch(e){ AUTH.initSelects(null); }
  }

  if(s){ enterApp(s); return; }

  if(shell) shell.hidden = true;
  if(!gate) return;
  gate.hidden = false;
  /* Le portail doit être INTERACTIF même sans session : sans cet appel, les onglets
     login/signup, la soumission du formulaire et le bouton démo restent morts sur une
     visite fraîche (bindGateEvents n'était posé que dans enterApp, donc qu'avec session).
     Idempotent via bindGateEvents._done. */
  try{ bindGateEvents(); }
  catch(errBind){
    try{ console.error('[bootGate] bindGateEvents :', errBind); }catch(e2){}
    panneauPanne(errBind, 'bootGate → bindGateEvents');
  }
  /* Le portail est démasqué AVANT tout rendu : un échec de paintGateStats ne doit plus
     laisser l'écran vide. */
  try{ paintGateStats(); }
  catch(errStats){
    try{ console.error('[bootGate] paintGateStats :', errStats); }catch(e2){}
    panneauPanne(errStats, 'bootGate → paintGateStats');
  }

  if(window.BDD && !BDD.state.ready && !BDD.state._loading){
    BDD.state._loading = true;
    BDD.load(null).then(() => {
      paintGateStats();
      try{
        const r = BDD.state.ref && BDD.state.ref.items ? BDD.state.ref.items[0] : null;
        AUTH.initSelects(r ? r.wilayas : null);
      }catch(e){}
      const c = $('#cBdd'); if(c && BDD.state.ready) c.textContent = BDD.kpis().total;
    });
  }
}

function paintGateStats(){
  const el = $('#gateStats'); if(!el) return;
  const a = window.AUTH ? AUTH.stats() : { comptes:0, sections:5, eleves:142, wilayas:58 };
  const bdd = (window.BDD && BDD.state.ready) ? BDD.kpis().total : 684;
  el.innerHTML = [[bdd,'وثيقة'],[a.eleves,'تلميذ'],[a.sections,'أقسام'],[a.wilayas,'ولاية']]
    .map(x => '<div class="gstat"><div class="gstat-n">' + x[0] + '</div>' +
              '<div class="gstat-l">' + x[1] + '</div></div>').join('');
}

function enterApp(s){
  /* Version MINIMALE et robuste : aucune variable intermédiaire fragile.
     Le rendu de chaque widget est fait par go() (déjà isolé par vue).
     Atterrissage sur 🧭 مسارك (ou le hash si présent). */
  const gate = $('#gate'), shell = $('#shell');
  if(gate) gate.hidden = true;
  if(shell) shell.hidden = false;
  const hash = String(location.hash || '').replace('#', '');
  go(VIEWS.indexOf(hash) !== -1 ? hash : 'masar');
}


function bindGateEvents(){
  if(bindGateEvents._done) return;
  bindGateEvents._done = true;

  $$('.gtab').forEach(b => b.addEventListener('click', () => {
    $$('.gtab').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const isLogin = b.dataset.gate === 'login';
    const lf = $('#loginForm'), sf = $('#signupForm');
    if(lf) lf.hidden = !isLogin;
    if(sf) sf.hidden = isLogin;
  }));

  [['#eye1','#loginPass'],['#eye2','#suPass']].forEach(p => {
    const e = $(p[0]), i = $(p[1]);
    if(e && i) e.addEventListener('click', () => {
      i.type = i.type === 'password' ? 'text' : 'password';
      e.textContent = i.type === 'password' ? '👁️' : '🙈';
    });
  });

  const lf = $('#loginForm');
  if(lf) lf.addEventListener('submit', ev => {
    ev.preventDefault();
    const err = $('#loginErr'); if(err) err.hidden = true;
    const r = AUTH.login($('#loginUser').value, $('#loginPass').value, $('#loginClasse').value);
    if(r.ok){ toast('🎉 أهلاً بك ' + r.session.nom + ' — القسم ' + r.session.classe_ar, 'ok');
              enterApp(r.session); }
    else if(err){ err.hidden = false; err.textContent = r.err; }
  });

  const bd = $('#btnDemo');
  if(bd) bd.addEventListener('click', () => {
    const u = $('#loginUser'), p = $('#loginPass');
    if(u) u.value = 'ahmed'; if(p) p.value = '1234';
    if(lf) lf.dispatchEvent(new Event('submit', { cancelable:true }));
  });

  const sf = $('#signupForm');
  if(sf) sf.addEventListener('submit', ev => {
    ev.preventDefault();
    const err = $('#suErr'); if(err) err.hidden = true;
    const w = String($('#suWilaya').value || '').split('|');
    const niv = $('#suNiveau').value;
    const r = AUTH.signup({
      nom:$('#suName').value, mail:$('#suMail').value, pass:$('#suPass').value,
      niveau:niv, filiere:$('#suFiliere').value,
        filiere_ar: ($('#suFiliere') && $('#suFiliere').selectedOptions[0]) ? $('#suFiliere').selectedOptions[0].textContent : '',
        specialite: ($('#suSpecialite') && !$('#suSpecialite').hidden && $('#suSpecialite').selectedOptions[0]) ? $('#suSpecialite').selectedOptions[0].textContent : '',
      wilaya:w[1] || 'Bouira', code_wilaya:w[0] || '10',
      role:$('#suRole').value, classe:niv + '-1'
    });
    if(r.ok){ toast('✅ تم إنشاء حسابك — أهلاً ' + r.session.nom, 'ok'); enterApp(r.session); }
    else if(err){ err.hidden = false; err.textContent = r.err; }
  });

  const uc = $('#userChip');
  if(uc) uc.addEventListener('click', () => go('compte'));

  document.addEventListener('dz:auth', e => {
    if(!e.detail){
      const sh = $('#shell'), gt = $('#gate');
      if(sh) sh.hidden = true;
      if(gt){ gt.hidden = false; paintGateStats(); }
    } else { renderUserChip(); renderSectionBar(); renderWelcome(); renderStats(); }
  });
}

/* ══════════ BANDEAU DE BIENVENUE ══════════ */
function renderWelcome(){
  const el = $('#welcomeBox'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const h = new Date().getHours();
  const salut = h < 12 ? 'صباح الخير' : 'مساء الخير';
  const de = h < 12 ? 'Guten Morgen' : (h < 18 ? 'Guten Tag' : 'Guten Abend');
  const st = loadSeances();
  const next = SEANCES.filter(x => (st.done || []).indexOf(x.n) === -1)[0];
  let totDone = 0, totSeanc = 0;
  UNITES.forEach(u => {
    if(!u.seances || !u.seances.length) return;
    totSeanc += u.seances.length;
    totDone  += (loadSeancesFor(u.n).done || []).length;
  });
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;

  el.innerHTML =
    '<h1>' + salut + '، ' + esc(s.nom) + ' 👋</h1>' +
    '<p>مرحباً بك في قسمك الافتراضي <b dir="ltr">' + esc(s.classe_ar) + '</b> — ' +
      'الثانوية الافتراضية الجزائرية · شعبة <b>' + esc(s.filiere) + '</b>.<br>' +
      '<span class="de-display" dir="ltr">' + esc(de) + '! Willkommen in deiner virtuellen Klasse.</span></p>' +
    '<div class="welcome-cta">' +
      (next ? '<button class="btn btn-p" data-go="seances">📚 الحصة ' + next.n + ' — ' +
               esc(next.ar) + '</button>'
            : '<button class="btn btn-p" data-go="seances">📚 مراجعة الحصص</button>') +
      '<button class="btn btn-g" data-go="biblio">🗂️ المكتبة' +
        (k ? ' (' + k.total + ')' : '') + '</button>' +
      '<button class="btn btn-o" data-go="devoir">📝 الفرض /20</button>' +
    '</div>' +
    '<div class="welcome-prog"><div class="progress-wrap"><div class="progress" style="width:' +
      (totSeanc ? Math.round(totDone / totSeanc * 100) : 0) + '%"></div></div>' +
      '<div class="progress-lbl">📈 تقدّمك الإجمالي : ' + totDone + ' / ' + totSeanc +
      ' حصص عبر ' + UNITES.filter(u => u.seances && u.seances.length).length +
      ' وحدات — الوحدة الحالية : <b>' + uniteActive().n + '</b></div></div>' +
    '<div class="welcome-meta">' +
      '<span class="sec-pill">🏫 ' + esc(s.classe_ar) + ' · ' + s.eleves + ' تلميذ</span>' +
      '<span class="sec-pill or">📖 المادة : ' + esc(s.matiere || 'اللغة الألمانية') + '</span>' +
      '<span class="sec-pill rg">🎓 ' + esc(s.niveau) + '</span>' +
      '<span class="sec-live"><i></i> ' + esc(s.prof || 'الأستاذ خريف أحمد') + ' · متصل الآن</span>' +
    '</div>';
}

/* ══════════ BARRE DE SECTION ══════════ */
function renderSectionBar(){
  const el = $('#sectionBar'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;
  el.innerHTML =
    '<span class="sec-pill">🇩🇿 جمهورية جزائرية</span>' +
    '<span class="sec-pill or">🏫 قسم ' + esc(s.classe_ar) + ' · ' + s.eleves + ' تلميذ</span>' +
    '<span class="sec-pill">📖 ' + esc(s.matiere || 'اللغة الألمانية') + '</span>' +
    '<span class="sec-pill rg">🎓 ' + esc(s.niveau) + ' — البرنامج الرسمي MEN</span>' +
    (k ? '<span class="sec-pill">🗂️ ' + k.total + ' وثيقة</span>' : '') +
    '<span class="sec-live"><i></i> الأستاذ 🤖 متصل · يتحدث العربية</span>';
}

/* ══════════ PASTILLE UTILISATEUR ══════════ */
function renderUserChip(){
  const el = $('#userChip'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const ini = String(s.nom || '؟').trim().charAt(0);
  el.innerHTML = '<span class="uc-av">' + esc(ini) + '</span>' +
                 '<span class="uc-n">' + esc(s.nom) + '</span>';
}

/* ══════════ VUE COMPTE ══════════ */
function renderCompte(){
  const el = $('#compteBody'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = '<div class="card empty"><div class="empty-i">🔐</div><p>غير متصل</p></div>'; return; }
  const st = loadSeances();
  const sim = load(LS.sim, {best:null, tries:[]});
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;

  function row(a,b){ return '<div class="rep-row"><span>' + a + '</span>' +
                            '<span class="rep-v">' + esc(b) + '</span></div>'; }

  el.innerHTML =
    '<div class="card"><h2>👤 معلوماتي</h2>' +
      row('الاسم الكامل', s.nom) + row('المعرّف', '@' + s.user) +
      row('الدور', (window.AUTH ? (AUTH.ROLES[s.role] || s.role) : s.role)) +
      row('المستوى', s.niveau) + row('الشعبة', s.filiere) +
      row('الولاية', (s.code_wilaya || '') + ' — ' + (s.wilaya || '')) +
      row('القسم', s.classe_ar + ' · ' + s.eleves + ' تلميذ') +
      row('الأستاذ', s.prof || 'الأستاذ خريف أحمد') +
      row('النقاط', (s.points || 0) + ' نقطة') +
      row('آخر دخول', new Date(s.loginAt || Date.now()).toLocaleString('fr-DZ')) +
    '</div>' +
    '<div class="card"><h2>📊 تقدمي</h2>' +
      row('الحصص المكتملة', (st.done || []).length + ' / 8') +
      row('التمارين المنجزة', Object.keys(st.exo || {}).length) +
      row('المحاكيات', (sim.tries || []).length) +
      row('أفضل نتيجة', sim.best !== null && sim.best !== undefined ? sim.best + '/20' : '—') +
      (k ? row('وثائق المكتبة', k.total + ' متاحة') : '') +
    '</div>' +
    '<div class="card"><h2>🔒 الخصوصية</h2><div class="privacy">' +
      'حسابك وبياناتك محفوظة <b>على جهازك فقط</b> (localStorage) — لا تُرسل لأي خادم. ' +
      'نتائج المحاكاة سرّية ولا يطّلع عليها أحد إلا بقرارك.</div></div>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn btn-o" id="btnSound2">🔊 النطق الألماني</button>' +
      '<button class="btn btn-r" id="btnLogout">🚪 تسجيل الخروج</button>' +
    '</div>';

  const lo = $('#btnLogout');
  if(lo) lo.addEventListener('click', () => {
    if(confirm('تسجيل الخروج من القسم؟')){ AUTH.logout(); toast('👋 إلى اللقاء',''); }
  });
  const bs2 = $('#btnSound2');
  if(bs2) bs2.addEventListener('click', () => {
    soundOn = !soundOn; store(LS.sound, soundOn);
    const b = $('#btnSound'); if(b) b.classList.toggle('muted', !soundOn);
    toast(soundOn ? '🔊 النطق مُفعَّل' : '🔇 النطق مُعطَّل', soundOn ? 'ok' : '');
  });
}


  /* ── Bug #71 : handlers délégués (capture) pour logout + chip compte ──
     indépendants des re-rendus et sans window.confirm (bloqué en PWA installée) */
  document.addEventListener('click', ev => {
    if(ev.target.closest('#btnLogout')){
      ev.preventDefault(); ev.stopPropagation();
      try{ AUTH.logout(); }catch(e){}
      try{ localStorage.removeItem('dz_de_session_v1'); }catch(e){}
      try{ localStorage.removeItem('dz_trial_v1'); }catch(e){}
      location.reload();
      return;
    }
    if(ev.target.closest('#userChip')){
      ev.preventDefault();
      try{ go('compte'); }catch(e){}
    }
  }, true);

/* ── API publique pour modules.js ── */
window.DZ = {
  $:$, $$:$$, load:load, store:store, esc:esc, toast:toast, speak:speak, go:go,
  PROF:PROF, LS:LS, WA_NUMBER:WA_NUMBER,
  /* SEANCES et DEVOIR sont commutables (multi-وحدةs) → exposés en getters */
  get SEANCES(){ return SEANCES; },
  get DEVOIR(){ return DEVOIR; },
  renderStats:renderStats, addMsg:addMsg, currentView:() => currentView,
  renderWelcome:renderWelcome, renderSectionBar:renderSectionBar,
  renderUserChip:renderUserChip, renderCompte:renderCompte,
  bootGate:bootGate, enterApp:enterApp,
  loadSeances:loadSeances, saveSeances:saveSeances,
  UNITES:UNITES, uniteActive:uniteActive, selectUnite:selectUnite,
  currentUnite:() => currentUnite,
  get niveauActif(){ return niveauActif; },
  setNiveau:(n) => { niveauActif = n; store('dz_de_niveau_v1', n); }
};

/* ── Bouton « 🔊 écouter cette page » : lit la page du livre avec la voix allemande ── */
document.addEventListener('click', function(e){
  var b = (e.target && e.target.closest) ? e.target.closest('[data-lire]') : null;
  if(!b) return;
  var p = b.getAttribute('data-lire');
  var en = (window.__BOOK__ || {})[String(p)];
  if(!en || !(en.lignes || []).length){
    if(window.toast) toast('⏳ الكتاب يُحمَّل… réessaie dans une seconde', 'ko');
    return;
  }
  var txt = (en.lignes || []).join(' ');
  if(typeof speak === 'function'){ speak(txt); }
  else if('speechSynthesis' in window){
    var u = new SpeechSynthesisUtterance(txt);
    u.lang = 'de-DE'; u.rate = 0.86;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
});

/* ── Cycle pédagogique fondé sur les preuves (TBLT + input compréhensible + shadowing + spaced retrieval) ── */
window.__CYCLE = function(s){
  var t = s && s.type;
  var ec = (t === 'ecoute' || t === 'phon') ? 15 : 5;
  var ex = (t === 'exo') ? 25 : 15;
  var sh = (t === 'phon') ? 20 : 10;
  return [
    { ar:'🎧 استماع أولاً', de:'Zuhören', m:ec },
    { ar:'📖 قراءة وفهم', de:'Lesen + Verstehen', m:10 },
    { ar:'🧠 تلخيص', de:'Zusammenfassen', m:5 },
    { ar:'✍️ تمرين وتدريب', de:'Üben + Trainieren', m:ex },
    { ar:'🎤 نطق وظلال', de:'Shadowing', m:sh },
    { ar:'🎯 استعداد للفرض', de:'Klassenarbeit-Training', m:10 }
  ];
};
window.__lireSat = function(t){ if(typeof speak === 'function'){ speak(t); } };
function blocsPedago(s){
  var p = s.page || (s.pages && s.pages[0]); if(!p) return '';
  var e = (window.__BOOK__ || {})[String(p)] || {};
  var lignes = e.lignes || [];
  var tout = lignes.join(' ');
  var sats = (tout.match(/[^.!?]+[.!?]*/g) || []).map(function(x){ return x.trim(); })
             .filter(function(x){ return x.length > 3 && x.length < 140; }).slice(0, 10);
  var sh = sats.map(function(t){
    var at = t.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    return '<div style="display:flex;gap:8px;align-items:center;margin:6px 0">'
      + '<button class="btn btn-s" onclick="window.__lireSat(\'' + at + '\')">🔊</button>'
      + '<span style="flex:1">' + esc(t) + '</span>'
      + '<label style="font-size:12px;white-space:nowrap"><input type="checkbox"> ردّدتُها جيدًا</label></div>';
  }).join('');
  var nouns = {}; var m; var re = /\b(?:der|die|das)\s+([A-ZÄÖÜß][a-zA-Zäöüß]+)/g;
  while((m = re.exec(tout)) !== null && Object.keys(nouns).length < 12){ nouns[m[1]] = 1; }
  var structures = lignes.filter(function(l){
    return /\+|→|Akkusativ|Dativ|Präteritum|Perfekt|Passiv|Modal|Konjunktion|Relativ|Nebensatz|wenn|bevor|obwohl|dass/.test(l);
  }).slice(0, 4);
  return '<div class="card" style="margin-top:12px"><h3 style="margin:0 0 8px">🎤 الظلال (Shadowing) : اسمع وردّد</h3>'
    + (sh || '<p>—</p>') + '</div>'
    + '<div class="card" style="margin-top:12px"><h3 style="margin:0 0 8px">🧠 بطافة التلخيص</h3>'
    + '<p style="margin:0 0 6px"><b>أسماء الصفحة :</b> ' + (Object.keys(nouns).join(' · ') || '—') + '</p>'
    + (structures.length ? '<p style="margin:0 0 6px"><b>بنى وقواعد :</b> ' + structures.map(esc).join(' · ') + '</p>' : '')
    + '<p style="margin:0;font-size:12.5px">اكتب تلخيصك في سطرين بدفترك ثم قارنه بـ 📑 ملخصات الوحدات.</p></div>'
    + '<div class="card" style="margin-top:12px"><h3 style="margin:0 0 8px">🎯 استعداد للفرض (نموذج رسمي /20)</h3>'
    + '<p style="margin:0 0 6px">I. فهم (7 ن) : أجب عن Wer ? Was ? Warum ? حول الصفحة ' + p + '.</p>'
    + '<p style="margin:0 0 6px">II. لغة (8 ن) : ترجم 5 كلمات من الصفحة و كوّن جملتين باسمين منها.</p>'
    + '<p style="margin:0">III. كتابة (5 ن) : في 4 أسطر استعمل 3 بنى من الصفحة عن حياتك.</p>'
    + '<p style="margin:8px 0 0;font-size:12.5px">ثم : 📝 فرض الوحدة · ⏱️ المحاكاة · 🧠 ذاكرة الأخطاء (J+1/J+3/J+7/J+21).</p></div>';
}

try{ document.addEventListener('DOMContentLoaded', function(){ var s=document.createElement('style'); s.textContent='p[dir="ltr"],.de-ltr{direction:ltr;text-align:left;unicode-bidi:plaintext}'; document.head.appendChild(s); }); }catch(e){}
