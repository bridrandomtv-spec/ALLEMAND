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

/* ─────────────── UNITÉ 1 : Sich vorstellen (8 séances) ─────────────── */
const SEANCES_U1 = [
  { n:1, de:'Begrüßung und sich vorstellen', ar:'التحية والتعارف', dur:60,
    obj:['التحية بالألمانية','التعريف بالاسم','الوداع'],
    lex:[['Guten Morgen','صباح الخير'],['Guten Tag','نهارك سعيد'],['Guten Abend','مساء الخير'],
         ['Gute Nacht','تصبح على خير'],['Hallo','مرحبا'],['Tschüs','مع السلامة (غير رسمي)'],
         ['Auf Wiedersehen','إلى اللقاء (رسمي)'],['Wie heißt du?','ما اسمك؟'],['Ich heiße…','أنا اسمي…']],
    gram:{t:'W-Fragen : Wie heißt du?',
      b:['<b>Wie</b> = كيف','<b>Woher</b> = من أين','<b>Wo</b> = أين','<b>Wer</b> = من'],
      ex:'<b class="de-in">Wie heißt du?</b> — <span class="de-in">Ich heiße Amine.</span>'},
    exos:[{q:'Comment dit-on «صباح الخير» ?',opts:['Guten Abend','Guten Morgen','Gute Nacht','Tschüs'],a:1,
           why:'<span class="de-in">Guten Morgen</span> = صباح الخير. <span class="de-in">Guten Abend</span> = مساء الخير.'},
          {q:'Quelle formule est OFFICIELLE pour dire au revoir ?',
           opts:['Tschüs','Hallo','Auf Wiedersehen','Gute Nacht'],a:2,
           why:'<span class="de-in">Auf Wiedersehen</span> est formel ; <span class="de-in">Tschüs</span> est familier.'}]},

  { n:2, de:'Persönliche Informationen', ar:'المعلومات الشخصية', dur:60,
    obj:['العمر','البلد والمدينة','العائلة'],
    lex:[['Ich bin … Jahre alt','عمري … سنة'],['Ich komme aus Algerien','أنا من الجزائر'],
         ['Ich wohne in Bouira','أسكن في البويرة'],['die Familie','العائلة'],
         ['der Vater','الأب'],['die Mutter','الأم'],['die Schwester','الأخت'],['der Bruder','الأخ'],
         ['Ich habe zwei Schwestern','لديّ أختان']],
    gram:{t:'Les nombres de 1 à 20',
      b:['eins · zwei · drei · vier · fünf','sechs · sieben · acht · neun · zehn',
         'elf · zwölf · dreizehn · vierzehn · fünfzehn','sechzehn · siebzehn · achtzehn · neunzehn · zwanzig'],
      ex:'<span class="de-in">Ich bin <b>sechzehn</b> Jahre alt.</span> = عمري 16 سنة.'},
    exos:[{q:'Complète : «Ich ___ 16 Jahre alt.»',opts:['habe','bin','komme','heiße'],a:1,
           why:'On utilise <b>sein</b> pour l’âge : <span class="de-in">ich <b>bin</b> 16 Jahre alt</span>.'},
          {q:'«Woher kommst du?» — Réponse correcte :',
           opts:['Ich wohne in Bouira.','Ich komme aus Algerien.','Ich bin 16.','Ich heiße Amine.'],a:1,
           why:'<b>Woher</b> (من أين) appelle une origine : <span class="de-in">Ich komme aus …</span>'}]},

  { n:3, de:'Das Verb «sein»', ar:'الفعل sein', dur:60,
    obj:['تصريف sein في الحاضر','الاستعمال مع الصفة','الجنسية'],
    lex:[['sein','يكون'],['ich bin','أنا أكون'],['du bist','أنت تكون'],['er/sie/es ist','هو/هي يكون'],
         ['wir sind','نحن نكون'],['ihr seid','أنتم تكونون'],['sie/Sie sind','هم يكونون / حضرتكم'],
         ['algerisch','جزائري'],['deutsch','ألماني']],
    gram:{t:'Conjugaison — sein (Präsens)',
      tbl:[['ich','bin'],['du','bist'],['er / sie / es','ist'],['wir','sind'],['ihr','seid'],['sie / Sie','sind']],
      ex:'<span class="de-in">Ich <b>bin</b> algerisch.</span> · <span class="de-in">Sie <b>ist</b> deutsch.</span>'},
    exos:[{q:'«Du ___ mein Freund.»',opts:['bin','ist','bist','sind'],a:2,why:'<span class="de-in">du</span> → <b>bist</b>.'},
          {q:'«Wir ___ aus Algerien.»',opts:['sind','seid','ist','bin'],a:0,why:'<span class="de-in">wir</span> → <b>sind</b>.'},
          {q:'«___ Sie Herr Kharif?»',opts:['Bist','Sind','Ist','Seid'],a:1,
           why:'<span class="de-in">Sie</span> (vouvoiement) → <b>sind</b>.'}]},

  { n:4, de:'Das Verb «haben»', ar:'الفعل haben', dur:60,
    obj:['تصريف haben','التعبير عن الملكية','الأرقام مع haben'],
    lex:[['haben','يملك / لديه'],['ich habe','أنا أملك'],['du hast','أنت تملك'],['er/sie/es hat','هو/هي يملك'],
         ['wir haben','نحن نملك'],['ihr habt','أنتم تملكون'],['sie/Sie haben','هم يملكون'],
         ['ein Buch','كتاب'],['eine Schwester','أخت']],
    gram:{t:'Conjugaison — haben (Präsens)',
      tbl:[['ich','habe'],['du','hast'],['er / sie / es','hat'],['wir','haben'],['ihr','habt'],['sie / Sie','haben']],
      ex:'<span class="de-in">Ich <b>habe</b> zwei Schwestern.</span> = لديّ أختان.'},
    exos:[{q:'«___ du Geschwister?»',opts:['Haben','Hast','Hat','Bist'],a:1,why:'<span class="de-in">du</span> → <b>hast</b>.'},
          {q:'«Lena ___ zwei Schwestern.»',opts:['habe','hast','hat','haben'],a:2,
           why:'Lena = <span class="de-in">sie</span> (3e pers. sg.) → <b>hat</b>.'}]},

  { n:5, de:'Textverständnis : Lena Fischer', ar:'فهم نص تقديمي', dur:60,
    obj:['قراءة نص ألماني','استخراج المعلومات','الإجابة بجمل كاملة'],
    texte:'<div class="reading"><p><b>Lena Fischer</b></p>'
        + '<p>Hallo! Ich heiße Lena Fischer. Ich bin 17 Jahre alt und komme aus Deutschland. '
        + 'Ich wohne in München. Ich habe eine große Familie: einen Bruder und zwei Schwestern. '
        + 'Mein Bruder ist 20 und heißt Tim. Meine Schwester Anna ist 15. '
        + 'Am Morgen sage ich immer: «Guten Morgen, Mama!» Und am Abend: «Gute Nacht!»</p></div>',
    exos:[{q:'Richtig oder Falsch : Lena kommt aus Algerien.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Ich komme aus <b>Deutschland</b>.</span>'},
          {q:'Richtig oder Falsch : Lena ist 17 Jahre alt.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Ich bin <b>17</b> Jahre alt.</span>'},
          {q:'Richtig oder Falsch : Tim ist 20 Jahre alt.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Mein Bruder ist <b>20</b> und heißt Tim.</span>'},
          {q:'Richtig oder Falsch : Lena wohnt in Berlin.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Ich wohne in <b>München</b>.</span>'},
          {q:'Wie viele Schwestern hat Lena?',opts:['eine','zwei','drei','keine'],a:1,
           why:'<span class="de-in">Ich habe … <b>zwei</b> Schwestern</span> (Anna, 15) '
             + '+ einen Bruder (Tim, 20).'},
          {q:'Was sagt Lena am Abend?',
           opts:['Guten Morgen, Mama!','Gute Nacht!','Auf Wiedersehen!','Tschüs!'],a:1,
           why:'<span class="de-in">Und am Abend: <b>Gute Nacht!</b></span>'}]},

  { n:6, de:'Textproduktion (Aufgabe)', ar:'إنتاج كتابي ✍️ — المهمة النهائية', dur:60,
    obj:['كتابة فقرة تقديمية','ترتيب الأفكار','استعمال sein/haben'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب فقرة من <b>5 à 8 أسطر</b> '
           + 'تعرّف فيها بنفسك مستعملاً :<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li>التحية + الاسم</li><li>العمر + البلد + المدينة</li><li>العائلة (haben)</li>'
           + '<li>الهوايات</li><li>الوداع</li></ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Hallo! Ich heiße Amine Benali. Ich bin 16 Jahre alt. Ich komme aus Algerien '
         + 'und ich wohne in Bouira.</p>'
         + '<p>Meine Familie ist klein. Ich habe einen Bruder und eine Schwester. Mein Vater '
         + 'heißt Karim und meine Mutter heißt Fatima.</p>'
         + '<p>In der Schule lerne ich Deutsch und Englisch. Meine Hobbys sind Fußball und Musik. '
         + 'Am Abend sage ich: «Gute Nacht!»</p><p>Tschüs!</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب فقرتك هنا (سيصححها الأستاذ الافتراضي):',ph:'Hallo! Ich heiße …'}]},

    { n:7, de:'Hôpital des erreurs', ar:'مستشفى الأخطاء 🏥 — شخّص وصحّح', dur:60,
    obj:['تشخيص الأخطاء الشائعة في الوحدة 1','تصحيحها مع التعليل بالقاعدة',
         'التقويم الذاتي قبل فرض الوحدة'],
    consigne:'<div class="exo"><div class="q-t"><b>🏥 مستشفى الأخطاء :</b> كل جملة下面 مريضة. '
           + 'شخّص المرض ثم اكتب الجملة الصحيحة. <b>10 مرضى</b> — النجاح من 8 فما فوق.</div></div>',
    exos:[{q:'🏥 «Ich bist 16 Jahre alt.» — quel est le mal ?',
           opts:['bist → bin','Ich → ich','16 → sechzehn','alt → alte'],a:0,
           why:'<span class="de-in">ich <b>bin</b></span> — sein est irrégulier à la 1ʳᵉ personne.'},
          {q:'🏥 «Ich habe 16 Jahre alt.» — quel est le mal ?',
           opts:['habe → bin','16 → sechzehn','Jahre → Jahr','alt → alten'],a:0,
           why:'L’âge se dit avec <b>sein</b>, jamais avec haben : '
             + '<span class="de-in">Ich <b>bin</b> 16 Jahre alt.</span>'},
          {q:'🏥 «Ich komme Algerien.» — que manque-t-il ?',
           opts:['aus','in','von','zu'],a:0,
           why:'<span class="de-in">kommen <b>aus</b> + pays</span> — la préposition est obligatoire.'},
          {q:'🏥 «Wo wohnst du?» → «Ich wohne München.» — quel est le mal ?',
           opts:['il manque « in »','München → Munchen','wohne → wohnst','du → Sie'],a:0,
           why:'Avec une ville : <span class="de-in">Ich wohne <b>in</b> München.</span>'},
          {q:'🏥 «Wie alt bist du?» → «Ich bin sechzehn Jahre.» — que manque-t-il ?',
           opts:['alt','alt sein','Jahre alt','sehr'],a:2,
           why:'L’expression complète est <span class="de-in">Jahre <b>alt</b></span>.'},
          {q:'🏥 «du hast» conjugué à «ihr» :',opts:['habt','hast','hat','habe'],a:0,
           why:'<span class="de-in">ihr <b>habt</b></span> — le b disparaît à la 2ᵉ du singulier '
             + '(<b>hast</b>) et à la 3ᵉ (<b>hat</b>), pas au pluriel.'},
          {q:'🏥 «Guten Morgen!» s’emploie :',
           opts:['le matin, jusqu’à 10 h','l’après-midi','le soir','avant de dormir'],a:0,
           why:'<span class="de-in">Guten Morgen</span> le matin · <b>Guten Tag</b> la journée · '
             + '<b>Guten Abend</b> le soir · <b>Gute Nacht</b> avant de dormir.'},
          {q:'🏥 «Auf Wiedersehen!» est :',
           opts:['formel','familier','une salutation du matin','une question'],a:0,
           why:'<span class="de-in">Auf Wiedersehen</span> = formel · <b>Tschüs</b> = familier.'},
          {q:'🏥 «Woher kommst du?» demande :',
           opts:['l’origine','la ville actuelle','l’âge','le nom'],a:0,
           why:'<b>Woher</b> = d’où (origine). <b>Wo</b> = où (position). <b>Wohin</b> = vers où.'},
          {q:'🏥 «Ich heiße Sara.» — la question correspondante est :',
           opts:['Wie heißt du?','Wo wohnst du?','Wie alt bist du?','Woher kommst du?'],a:0,
           why:'<span class="de-in"><b>Wie heißt du?</b></span> appelle <b>Ich heiße …</b>'}]},

{ n:8, de:'Évaluation de l’unité 📝', ar:'فرض الوحدة', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي'], ex:'devoir'}
];

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

const UNITES = [
  { n:1, de:'Sich vorstellen',        ar:'التعريف بالنفس',    icon:'👋', cecrl:'A1', niveau:'2AS',
    seances:SEANCES_U1, devoir:DEVOIR_U1, duree:465 },
  { n:2, de:'Familie und Freunde',    ar:'العائلة والأصدقاء', icon:'👨‍👩‍👧', cecrl:'A1→A2', niveau:'2AS',
    seances:(window.UNITE2 ? UNITE2.seances : []),
    devoir: (window.UNITE2 ? UNITE2.devoir  : null),
    duree:  (window.UNITE2 && UNITE2.meta ? UNITE2.meta.duree_totale : 465) },
  { n:3, de:'Schule und Ausbildung',  ar:'المدرسة والتكوين',  icon:'🏫', cecrl:'A2', niveau:'2AS',
    seances:(window.UNITE3 ? UNITE3.seances : []),
    devoir: (window.UNITE3 ? UNITE3.devoir  : null),
    duree:  (window.UNITE3 && UNITE3.meta ? UNITE3.meta.duree_totale : 465) },
  { n:4, de:'Alltag und Freizeit',    ar:'الحياة اليومية وأوقات الفراغ', icon:'⚽', cecrl:'A2', niveau:'2AS',
    seances:(window.UNITE4 ? UNITE4.seances : []),
    devoir: (window.UNITE4 ? UNITE4.devoir  : null),
    duree:  (window.UNITE4 && UNITE4.meta ? UNITE4.meta.duree_totale : 465) },
  { n:5, de:'Essen und Trinken',      ar:'المأكل والمشرب',      icon:'🍽️', cecrl:'A2', niveau:'2AS',
    seances:(window.UNITE5 ? UNITE5.seances : []),
    devoir: (window.UNITE5 ? UNITE5.devoir  : null),
    duree:  (window.UNITE5 && UNITE5.meta ? UNITE5.meta.duree_totale : 465) },
  { n:6, de:'Reisen und Verkehr',     ar:'السفر والنقل',       icon:'🚌', cecrl:'A2', niveau:'2AS',
    seances:(window.UNITE6 ? UNITE6.seances : []),
    devoir: (window.UNITE6 ? UNITE6.devoir  : null),
    duree:  (window.UNITE6 && UNITE6.meta ? UNITE6.meta.duree_totale : 465) },
  { n:7, de:'Persönlichkeit und Identität', ar:'الشخصية والهوية', icon:'🪞', cecrl:'B1',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[0].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[0].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[0].duree_totale : 360) },
  { n:8, de:'Staatsbürgerschaft',           ar:'المواطنة',       icon:'🏛️', cecrl:'B1',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[1].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[1].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[1].duree_totale : 360) },
  { n:9, de:'Leben in der Gesellschaft',    ar:'الحياة في المجتمع', icon:'🤝', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITES_3AS_A ? UNITES_3AS_A[2].seances : []),
    devoir: (window.UNITES_3AS_A ? UNITES_3AS_A[2].devoir  : null),
    duree:  (window.UNITES_3AS_A ? UNITES_3AS_A[2].duree_totale : 360) },
  { n:10, de:'Wissenschaft und Technologie', ar:'العلوم والتكنولوجيا', icon:'🔬', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE10 ? UNITE10.seances : []),
    devoir: (window.UNITE10 ? UNITE10.devoir  : null),
    duree:  (window.UNITE10 && UNITE10.meta ? UNITE10.meta.duree_totale : 360) },
  { n:11, de:'Wirtschaft und Arbeit',        ar:'الاقتصاد والعمل', icon:'💼', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE11 ? UNITE11.seances : []),
    devoir: (window.UNITE11 ? UNITE11.devoir  : null),
    duree:  (window.UNITE11 && UNITE11.meta ? UNITE11.meta.duree_totale : 360) },
  { n:12, de:'Umweltprobleme',               ar:'مشاكل البيئة', icon:'🌍', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE12 ? UNITE12.seances : []),
    devoir: (window.UNITE12 ? UNITE12.devoir  : null),
    duree:  (window.UNITE12 && UNITE12.meta ? UNITE12.meta.duree_totale : 360) },
  { n:13, de:'Gesundheit und Lebensweise',    ar:'الصحة ونمط الحياة',     icon:'🏥', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE13 ? UNITE13.seances : []),
    devoir: (window.UNITE13 ? UNITE13.devoir  : null),
    duree:  (window.UNITE13 && UNITE13.meta ? UNITE13.meta.duree_totale : 360) },
  { n:14, de:'Globalisierung',                ar:'العولمة',               icon:'🌐', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE14 ? UNITE14.seances : []),
    devoir: (window.UNITE14 ? UNITE14.devoir  : null),
    duree:  (window.UNITE14 && UNITE14.meta ? UNITE14.meta.duree_totale : 360) },
  { n:15, de:'Medienwelt',                    ar:'عالم الإعلام',          icon:'📰', cecrl:'B2',
    niveau:'3AS', seances:(window.UNITE15 ? UNITE15.seances : []),
    devoir: (window.UNITE15 ? UNITE15.devoir  : null),
    duree:  (window.UNITE15 && UNITE15.meta ? UNITE15.meta.duree_totale : 360) },
  { n:16, de:'Kultureller Dialog',            ar:'الحوار الثقافي',        icon:'🤝', cecrl:'B2',
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
        '<span class="chip">⏱️ ' + Math.round(u.duree / 60) + ' س</span></div></button>';
  }).join('') + '</div>';
}

function paintUniteHead(){
  const u = uniteActive();
  const hd = $('#seancesHead');
  if(hd) hd.innerHTML = '<h1>📚 الوحدة ' + u.n + ' : <span class="de-display">' + esc(u.de) + '</span></h1>' +
    '<p>' + esc(u.ar) + ' — ' + u.seances.length + ' حصص · ' + Math.round(u.duree / 60) +
    ' ساعة · المستوى ' + esc(u.cecrl) + ' · البرنامج الرسمي MEN</p>' +
    '<div class="progress-wrap"><div class="progress" id="progSeances"></div></div>' +
    '<div class="progress-lbl" id="progLbl"></div>';
  const dt = $('#devoirTitle');
  if(dt) dt.innerHTML = '📝 فرض الوحدة ' + u.n + ' <span class="pill">/20</span>';
  const ds = $('#devoirSub');
  if(ds) ds.textContent = 'Évaluation — ' + u.de + ' · المدة : ' + u.duree +
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

/* ── Stockage isolé par unité ── */
function uniteKey(n){ return LS.seances + ':u' + (n || currentUnite); }
function loadSeancesFor(n){ return load(uniteKey(n), {done:[], exo:{}}); }
function loadSeances(){ return load(uniteKey(), {done:[], exo:{}}); }
function saveSeances(v){ store(uniteKey(), v); }


/* ─────────────── IA DU PROFESSEUR VIRTUEL ─────────────── */
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
      + '98% من تلاميذي نجحوا بهذه الطريقة.',
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
  /* Correction automatique d'une phrase allemande (règles de l'unité 1) */
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
const VIEWS = ['masar', 'accueil','seances','live','classe','grammaire','biblio','stats','quiz','officiels','examen','devoir','simulation','prof','parents','reservation','projet','profboard','matieres', 'guide', 'revision', 'compte'];
const TABS  = [['masar','🧭 مسارك'], ['accueil','🏠 الرئيسية'],['seances','📚 الحصص'],
               ['live','📹 القاعة المباشرة'],
               ['classe','🏫 القسم'],['grammaire','📘 القواعد'],['biblio','🗂️ المكتبة'],
               ['stats','🗺️ الإحصائيات'],['quiz','🎯 تمارين'],
               ['officiels','📄 الفروض'],['examen','🎓 البكالوريا'],
               ['devoir','📝 الفرض'],['simulation','⏱️ المحاكاة'],
               ['prof','🤖 الأستاذ'],['parents','👨‍👩‍👧 الأولياء'],
               ['reservation','🗓️ احجز حصّة'],['projet','📋 Plan de projet'],['matieres','📚 المواد'], ['guide','📖 الدليل'], ['revision','🧠 révision'], ['compte','⚙️ حسابي']];

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

function renderTabs(){
  const c = $('#tabs'); if(!c) return;
  c.innerHTML = allTabs().map(t =>
    '<button class="tab' + (t[0] === currentView ? ' on' : '') + '" data-go="' + t[0] + '">' + t[1] + '</button>'
  ).join('');
}

/* 🧭 prochaine séance non faite du niveau actif (pour masar.js). */
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

function go(view){
  if(VIEWS.indexOf(view) === -1) view = 'accueil';
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
    const meta = s.ex === 'devoir'
      ? '<span class="chip ex">📝 اختبار /20</span>'
      : '<span class="chip">' + ((s.exos || []).length) + ' تمرين</span>';
    return '<div class="seance' + (isDone ? ' done' : '') + (locked ? ' lock' : '') + '" data-seance="' + s.n + '">'
      + '<div class="s-num">' + (isDone ? '✓' : s.n) + '</div><div class="s-body">'
      + '<div class="s-t">' + (locked ? '🔒 ' : '') + 'الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</div>'
      + '<div class="s-d">' + esc(s.de) + '</div>'
      + '<div class="s-meta"><span class="chip">⏱️ ' + s.dur + ' د</span>' + meta
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
     sum([5, 15, 15, 15, 10])     == 60   · 5 étapes · séance type
     sum([5, 5, 10, 15, 10, 10, 5]) == 60 · 7 étapes · compréhension de texte
     sum([5, 10, 20, 10, 10, 5])  == 60   · 6 étapes · production écrite
   Le rythme est choisi par TYPE de séance, puis mis à l'échelle si la
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

/* Détermine le rythme d'après le type de la séance (surchargeable via s.rythme). */
function typeSeance(s){
  if(!s) return 'defaut';
  if(s.rythme && ETAPES_PAR_TYPE[s.rythme]) return s.rythme;
  const t = String(s.de || '') + ' ' + String(s.ar || '');
  if(/Textproduktion|إنتاج كتابي|Schreiben|expression écrite/i.test(t)) return 'ecriture';
  if(/Textverständnis|فهم نص|Leseverstehen|Lecture|قراءة/i.test(t)) return 'lecture';
  return 'defaut';
}

/* Barème proportionnel pour les séances qui ne durent pas 60 minutes.
   Accepte soit l'objet séance, soit une durée brute (rétro-compatibilité). */
function etapesPour(s){
  const seance = (s && typeof s === 'object') ? s : { dur: s };
  const cle = typeSeance(seance);
  const base = ETAPES_PAR_TYPE[cle] || ETAPES_PAR_TYPE.defaut;
  const total = base.reduce(function(a, e){ return a + e.m; }, 0);
  const d = Number(seance.dur) || total;
  if(d === total) return base;
  return base.map(function(e){
    return { m: Math.max(3, Math.round(e.m * d / total)),
             ar: e.ar, de: e.de, i: e.i };
  });
}

/* ══════════════════════════════════════════════════════════════════════
   GRILLE DE CRITÈRES — production écrite de séance, notée sur 5
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

/* Une séance de production écrite se note sur 5, sauf grille explicite. */
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

/* Ligne de temps des 5 étapes, insérée en tête de chaque séance. */
function renderEtapes(s){
  const et = etapesPour(s);
  const tyc = typeSeance(s);
  const LIB = { defaut:'rythme standard', lecture:'rythme lecture guidée',
                ecriture:'rythme production écrite' };
  const tot = et.reduce(function(a, e){ return a + e.m; }, 0);
  let cum = 0;
  return '<div class="etapes">'
    + '<div class="et-h"><b>⏱️ déroulé de la séance</b>'
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

function openSeance(n){
  const s = SEANCES.filter(x => x.n === n)[0]; if(!s) return;
  const st = loadSeances();
  st.done = st.done || []; st.exo = st.exo || {};
  const box = $('#seanceDetail'); if(!box) return;

  let h = '<div class="card detail" data-n="' + s.n + '">'
    + '<div class="detail-h"><div><h2 style="margin:0">الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</h2>'
    + '<div class="s-d" style="margin-top:3px">' + esc(s.de) + ' · ⏱️ ' + s.dur + ' د</div></div>'
    + '<button class="close-x" id="closeDetail">✕</button></div>';

  if(s.ex === 'devoir'){
    h += '<p style="color:var(--m);font-size:13.5px;margin-bottom:13px">هذه الحصة هي الفرض الكتابي — الوحدة 1 (/20).</p>'
       + '<button class="btn btn-g btn-block" data-go="devoir">📝 الانتقال إلى الفرض</button></div>';
    box.innerHTML = h; box.scrollIntoView({behavior:'smooth', block:'start'}); return;
  }

  h += renderEtapes(s);

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
  if(st.done.indexOf(n) === -1){
    st.done.push(n); saveSeances(st);
    toast('🎉 أحسنت! تم إنهاء الحصة ' + n + '/8', 'ok');
  }
  renderSeances(); renderStats(); openSeance(n);
  const nxt = SEANCES.filter(x => x.n === n + 1)[0];
  if(nxt) setTimeout(() => toast('👈 التالي : الحصة ' + nxt.n + ' — ' + nxt.ar), 1500);
  else setTimeout(() => toast('🏆 أكملت الوحدة 1 بالكامل!'), 1500);
}

/* ─────────────── DEVOIR /20 ─────────────── */
function renderDevoir(){
  const box = $('#devoirBody'); if(!box) return;
  const st = load(LS.devoir, {showCorr:false, ans:{}});

  let h = '<div class="privacy">📋 <b>' + DEVOIR.titre + '</b> — المدة ' + DEVOIR.duree
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

function sendChat(v){
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
    if(ev.target.closest('#markDone')){ markSeanceDone(); return; }
    if(ev.target.closest('#btnCorrDevoir')){ showCorrigeDevoir(); return; }
    if(ev.target.closest('#btnSimFromDevoir')){ go('simulation'); return; }
  });

  const b = $('#btnBurger');
  if(b) b.addEventListener('click', () => { const t = $('#tabs'); if(t) t.classList.toggle('open'); });

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
    '<p>مرحباً بك في قسمك الافتراضي <b>' + esc(s.classe_ar) + '</b> — ' +
      'الثانوية الافتراضية الجزائرية · شعبة <b>' + esc(s.filiere) + '</b>.<br>' +
      '<span class="de-display">' + esc(de) + '! Willkommen in deiner virtuellen Klasse.</span></p>' +
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


/* ── API publique pour modules.js ── */
window.DZ = {
  $:$, $$:$$, load:load, store:store, esc:esc, toast:toast, speak:speak, go:go,
  PROF:PROF, LS:LS, WA_NUMBER:WA_NUMBER,
  /* SEANCES et DEVOIR sont commutables (multi-unités) → exposés en getters */
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
