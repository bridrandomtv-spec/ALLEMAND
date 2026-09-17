/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite3.js
   الوحدة 3 : Schule und Ausbildung — المدرسة والتكوين
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثاني
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE3_META = {
  n: 3,
  de: 'Schule und Ausbildung',
  ar: 'المدرسة والتكوين',
  niveau: '2AS',
  trimestre: 2,
  periode: 'جانفي — مارس',
  duree_totale: 465,
  cecrl: 'A2',
  objectifs: [
    'تسمية المواد الدراسية بالألمانية',
    'وصف المؤسسة ومرافقها',
    'التعبير عن التوقيت والجدول الدراسي',
    'استعمال الأفعال الناقلة Modalverben',
    'فهم نص حول الحياة المدرسية',
    'إنتاج فقرة وصفية من 8 إلى 10 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['die Schule', 'das Fach', 'der Stundenplan', 'die Pause',
                    'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
  grammaire_cle: ['Modalverben', 'Uhrzeit', 'Präpositionen (in/an/auf)',
                  'Satzstellung mit Modalverb', 'Perfekt der Modalverben']
};

const SEANCES_U3 = [
  { n:1, de:'Die Schulfächer', ar:'المواد الدراسية', dur:60,
    obj:['تسمية المواد الدراسية','الفعل mögen','التعبير عن التفضيل'],
    lex:[['die Schule','المدرسة'],['das Fach','المادة'],['die Fächer','المواد'],
         ['Deutsch','الألمانية'],['Englisch','الإنجليزية'],['Französisch','الفرنسية'],
         ['Arabisch','العربية'],['Mathematik','الرياضيات'],['Physik','الفيزياء'],
         ['Chemie','الكيمياء'],['Biologie','علوم الطبيعة'],['Geschichte','التاريخ'],
         ['Geografie','الجغرافيا'],['Informatik','الإعلام الآلي'],
         ['Sport','التربية البدنية'],['Musik','الموسيقى'],['Kunst','الرسم'],
         ['Philosophie','الفلسفة'],['Religion','التربية الإسلامية']],
    gram:{t:'mögen · lieber · am liebsten',
      b:['<b>mögen</b> = يحبّ (suivi d’un nom) : <span class="de-in">Ich mag Deutsch.</span>',
         '<b>gern</b> = بسرور (suivi d’un verbe) : <span class="de-in">Ich lerne gern Deutsch.</span>',
         '<b>lieber</b> = plutôt : <span class="de-in">Ich lerne <u>lieber</u> Englisch.</span>',
         '<b>am liebsten</b> = le plus : <span class="de-in">Ich lerne <u>am liebsten</u> Informatik.</span>'],
      tbl:[['ich','mag'],['du','magst'],['er/sie/es','mag'],
           ['wir','mögen'],['ihr','mögt'],['sie/Sie','mögen']],
      ex:'<span class="de-in">Mein Lieblingsfach ist <b>Deutsch</b>.</span> = مادتي المفضّلة هي الألمانية.'},
    exos:[{q:'«Ich ___ Mathematik.» (j’aime)',opts:['mag','magst','mögen','möchte'],a:0,
           why:'<span class="de-in">ich</span> → <b>mag</b>.'},
          {q:'Comment dit-on « المفضّل عندي » ?',
           opts:['am liebsten','lieber','gern','möchten'],a:0,
           why:'<span class="de-in">am liebsten</span> = superlatif de <span class="de-in">gern</span>.'},
          {q:'Traduis : «المادة» au pluriel',opts:['die Faches','die Fächer','die Fächers','das Fächer'],a:1,
           why:'<span class="de-in">das Fach → die Fächer</span> (umlaut au pluriel).'},
          {q:'«Was ist dein Lieblingsfach?» — Réponse correcte :',
           opts:['Ich mag Deutsch lernen.','Deutsch ist mein Lieblingsfach.',
                 'Ich habe Deutsch.','Deutsch gefällt mich.'],a:1,
           why:'La question porte sur <b>la matière préférée</b>, pas sur ce qu’on aime faire.'}]},

  { n:2, de:'Die Schule und die Gebäude', ar:'المؤسسة ومرافقها', dur:60,
    obj:['مرافق المدرسة','الظرفية المكانية (in/an/auf)','الوصف بموجود/غير موجود'],
    lex:[['das Klassenzimmer','القسم'],['der Schulhof','ساحة المدرسة'],
         ['die Bibliothek','المكتبة'],['das Labor','المخبر'],['die Turnhalle','القاعة الرياضية'],
         ['die Mensa','المطعم المدرسي'],['das Sekretariat','الأمانة'],
         ['das Direktorzimmer','مكتب المدير'],['der Computerraum','قاعة الإعلام الآلي'],
         ['die Tafel','السبورة'],['der Tisch','الطاولة'],['der Stuhl','الكرسي'],
         ['das Heft','الكرّاس'],['das Buch','الكتاب'],['der Bleistift','القلم الرصاص'],
         ['die Schultasche','المحفظة']],
    gram:{t:'Prépositions de lieu : in · an · auf (+ Datif = position / + Akkusativ = mouvement)',
      b:['<b>Position</b> (Où ? — <span class="de-in">Wo?</span>) → <b>Datif</b>',
         '<span class="de-in">Das Buch liegt <u>auf dem</u> Tisch.</span> = الكتاب على الطاولة.',
         '<b>Mouvement</b> (Où va-t-on ? — <span class="de-in">Wohin?</span>) → <b>Akkusativ</b>',
         '<span class="de-in">Ich lege das Buch <u>auf den</u> Tisch.</span> = أضع الكتاب على الطاولة.',
         '<span class="de-in">in der Schule</span> (datif) · <span class="de-in">in die Schule</span> (accusatif)'],
      tbl:[['Wo? (position)','Dativ','in der / an der / auf der Schule'],
           ['Wohin? (mouvement)','Akkusativ','in die / an die / auf die Schule']],
      ex:'<span class="de-in">Es gibt <b>eine</b> Bibliothek und <b>zwei</b> Labore.</span> = توجد مكتبة ومخبران.'},
    exos:[{q:'«Das Heft liegt ___ dem Tisch.» (sur)',opts:['auf','in','an','unter'],a:0,
           why:'<span class="de-in">auf + Datif</span> pour la position « sur ».'},
          {q:'«Ich gehe ___ die Schule.» (à l’école, mouvement)',opts:['in','in der','an der','auf'],a:0,
           why:'Mouvement → <span class="de-in">in + Akkusativ</span> : <b>in die Schule</b>.'},
          {q:'«Wo bist du?» — «Ich bin ___ der Bibliothek.»',opts:['in','ins','in die','zu'],a:0,
           why:'Position → <b>Datif</b> : <span class="de-in">in der Bibliothek</span>.'},
          {q:'Traduis : «القاعة الرياضية»',opts:['die Mensa','die Turnhalle','das Labor','der Schulhof'],a:1,
           why:'<span class="de-in">die Turnhalle</span> = القاعة الرياضية.'}]},

  { n:3, de:'Uhrzeit und Stundenplan', ar:'التوقيت والجدول الدراسي', dur:60,
    obj:['قراءة الساعة','الجدول الأسبوعي','التعبير عن التكرار'],
    lex:[['die Uhr','الساعة'],['die Stunde','الحصّة / الساعة'],['die Minute','الدقيقة'],
         ['der Stundenplan','الجدول الدراسي'],['die Pause','الاستراحة'],
         ['Montag','الاثنين'],['Dienstag','الثلاثاء'],['Mittwoch','الأربعاء'],
         ['Donnerstag','الخميس'],['Freitag','الجمعة'],['Samstag','السبت'],['Sonntag','الأحد'],
         ['am Montag','يوم الاثنين'],['jede Woche','كل أسبوع'],['täglich','يومياً'],
         ['von 8 bis 12','من 8 إلى 12']],
    gram:{t:'Lire l’heure + prépositions temporelles',
      b:['<span class="de-in">Wie viel Uhr ist es?</span> = كم الساعة؟',
         '<b>um</b> + heure : <span class="de-in">Der Unterricht beginnt <u>um</u> 8 Uhr.</span>',
         '<b>am</b> + jour : <span class="de-in"><u>Am</u> Montag habe ich Deutsch.</span>',
         '<b>von … bis</b> : <span class="de-in"><u>Von</u> 8 <u>bis</u> 12 Uhr bin ich in der Schule.</span>',
         '⚠️ <span class="de-in">halb neun</span> = <b>8:30</b> (pas 9:30 !)'],
      tbl:[['8:00','acht Uhr / um acht'],['8:15','Viertel nach acht'],
           ['8:30','halb neun'],['8:45','Viertel vor neun'],['9:00','neun Uhr']],
      ex:'<span class="de-in">Am Dienstag habe ich <b>von</b> 8 <b>bis</b> 12 Uhr Unterricht.</span>'},
    exos:[{q:'9:30 se dit :',opts:['halb neun','halb zehn','neun Uhr dreißig nur','Viertel vor zehn'],a:1,
           why:'<span class="de-in">halb zehn</span> = 9:30 (« la moitié du chemin vers 10 »).'},
          {q:'«___ Montag habe ich Deutsch.»',opts:['Am','In','Um','An'],a:0,
           why:'Jour de la semaine → <b>am</b>.'},
          {q:'«Der Unterricht beginnt ___ 8 Uhr.»',opts:['am','um','in','von'],a:1,
           why:'Heure précise → <b>um</b>.'},
          {q:'8:45 se dit :',opts:['Viertel nach neun','Viertel vor neun','halb neun','drei viertel neun'],a:1,
           why:'<span class="de-in">Viertel <b>vor</b> neun</span> = 8:45 (le quart avant 9).'},
          {q:'Quel jour vient après «Mittwoch» ?',opts:['Dienstag','Donnerstag','Freitag','Montag'],a:1,
           why:'Ordre : Montag · Dienstag · Mittwoch · <b>Donnerstag</b> · Freitag.'}]},

  { n:4, de:'Die Modalverben', ar:'الأفعال الناقلة', dur:60,
    obj:['6 أفعال ناقلة','بنية الجملة مع فعل ناقص','التعبير عن القدرة والوجوب والإذن'],
    lex:[['können','يستطيع (قدرة)'],['müssen','يجب (إلزام)'],['wollen','يريد (إرادة قوية)'],
         ['dürfen','يُسمح له (إذن)'],['sollen','ينبغي (نصيحة/أمر منقول)'],
         ['mögen','يحبّ'],['möchten','يريد (مهذّب)'],
         ['Ich kann schwimmen.','أستطيع السباحة.'],
         ['Du musst lernen.','يجب أن تدرس.'],
         ['Darf ich hinausgehen?','هل يُسمح لي بالخروج؟'],
         ['Ich möchte einen Tee.','أريد شاياً (بتهذّب).']],
    gram:{t:'Les 6 Modalverben au Präsens — le radical change à la 1ʳᵉ/3ᵉ personne (sans -e/-t !)',
      tbl:[['ich','kann','muss','will','darf','soll','mag'],
           ['du','kannst','musst','willst','darfst','sollst','magst'],
           ['er/sie/es','kann','muss','will','darf','soll','mag'],
           ['wir','können','müssen','wollen','dürfen','sollen','mögen'],
           ['ihr','könnt','müsst','wollt','dürft','sollt','mögt'],
           ['sie/Sie','können','müssen','wollen','dürfen','sollen','mögen']],
      b:['🔑 <b>Règle d’or</b> : le verbe modal est en <b>position 2</b>, '
       + 'le verbe principal reste à l’<b>infinitif</b> et va <b>à la fin</b>.',
       '<span class="de-in">Ich <b>kann</b> gut Deutsch <b>sprechen</b>.</span>',
       '<span class="de-in"><b>Musst</b> du heute <b>lernen</b>?</span>',
       '⚠️ <span class="de-in">ich <b>will</b></span> = je veux (fort) · '
       + '<span class="de-in">ich <b>möchte</b></span> = je voudrais (poli)'],
      ex:'<span class="de-in">In der Bibliothek <b>darf</b> man nicht laut <b>sprechen</b>.</span>'},
    exos:[{q:'«Ich ___ gut schwimmen.» (je peux)',opts:['kann','könnt','können','kannst'],a:0,
           why:'<span class="de-in">ich</span> → <b>kann</b> (sans -e !).'},
          {q:'«___ du heute lernen?» (dois-tu)',opts:['Muss','Musst','Müssen','Musst du'],a:1,
           why:'<span class="de-in">du</span> → <b>musst</b>.'},
          {q:'«In der Schule ___ man nicht rauchen.» (interdiction)',
           opts:['kann','muss','darf','soll'],a:2,
           why:'L’interdiction s’exprime avec <span class="de-in"><b>dürfen</b> + nicht</span>.'},
          {q:'Quelle phrase est correcte ?',
           opts:['Ich kann Deutsch sprechen gut.','Ich kann gut Deutsch sprechen.',
                 'Ich gut kann Deutsch sprechen.','Ich sprechen kann gut Deutsch.'],a:1,
           why:'Modal en position 2, infinitif **à la fin** : <span class="de-in">Ich kann … sprechen.</span>'},
          {q:'Formule la plus POLIE pour commander :',
           opts:['Ich will einen Kaffee.','Ich möchte einen Kaffee.',
                 'Ich muss einen Kaffee.','Ich kann einen Kaffee.'],a:1,
           why:'<span class="de-in">möchten</span> (Konjunktiv II de mögen) = la forme polie.'},
          {q:'«Wir ___ zur Schule gehen.» (nous devons)',opts:['muss','musst','müssen','müsst'],a:2,
           why:'<span class="de-in">wir</span> → <b>müssen</b>.'}]},

  { n:5, de:'Textverständnis : «Ein Tag in der Schule»', ar:'فهم نص — يوم في المدرسة', dur:60,
    obj:['قراءة نص سردي','استخراج المعلومات الزمنية','الإجابة بجمل كاملة','repérage des Modalverben'],
    texte:'<div class="reading"><p><b>Ein Tag in der Schule</b></p>'
        + '<p>Hallo! Ich heiße Nadia und ich bin 16 Jahre alt. Ich gehe in die '
        + 'Lycée Emir Abdelkader in Bouira. Mein Schultag beginnt um sieben Uhr morgens.</p>'
        + '<p>Ich stehe um halb sechs auf und frühstücke mit meiner Familie. '
        + 'Dann fahre ich mit dem Bus zur Schule. Der Unterricht beginnt um acht Uhr.</p>'
        + '<p>Am Montag haben wir Deutsch, Mathematik und Sport. Deutsch ist mein '
        + 'Lieblingsfach, weil unsere Lehrerin sehr nett ist. In der Pause gehe ich '
        + 'mit meinen Freundinnen in die Bibliothek.</p>'
        + '<p>Nach der Schule muss ich meine Hausaufgaben machen. Am Abend darf ich '
        + 'eine Stunde fernsehen. Ich möchte später Ärztin werden, deshalb lerne ich '
        + 'auch Biologie sehr gern.</p></div>',
    exos:[{q:'Richtig oder Falsch : Nadia habite à Alger.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Elle habite à <b>Bouira</b> — <span class="de-in">Lycée Emir Abdelkader in Bouira</span>.'},
          {q:'Richtig oder Falsch : Nadia se lève à 6h30.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Ich stehe um <b>halb sechs</b> auf</span> = <b>5:30</b>, pas 6:30 !'},
          {q:'Richtig oder Falsch : Le Deutsch est sa matière préférée.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Deutsch ist mein Lieblingsfach.</span>'},
          {q:'Richtig oder Falsch : Nadia veut devenir professeur.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Ich möchte später <b>Ärztin</b> werden.</span> — médecin, pas professeure.'},
          {q:'À quelle heure commence le cours ?',opts:['7:00','7:30','8:00','8:30'],a:2,
           why:'<span class="de-in">Der Unterricht beginnt um <b>acht Uhr</b>.</span>'},
          {q:'Que fait Nadia pendant la pause ?',
           opts:['Elle mange à la Mensa','Elle va à la bibliothèque',
                 'Elle joue au football','Elle rentre chez elle'],a:1,
           why:'<span class="de-in">In der Pause gehe ich … in die <b>Bibliothek</b>.</span>'},
          {q:'Quels verbes modaux apparaissent dans le texte ?',
           opts:['können · wollen · sollen','müssen · dürfen · möchten',
                 'mögen · können · müssen','wollen · dürfen · können'],a:1,
           why:'<span class="de-in"><b>muss</b> … <b>darf</b> … <b>möchte</b></span> — les trois sont dans le texte.'}]},

  { n:6, de:'Textproduktion — «Meine Schule»', ar:'إنتاج كتابي ✍️ مدرستي', dur:60,
    obj:['كتابة فقرة وصفية 8-10 أسطر','استعمال 3 Modalverben','الظرفية الزمنية والمكانية','الرابط weil'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب فقرة من <b>8 إلى 10 أسطر</b> '
           + 'تصف فيها مدرستك ويومك الدراسي، مع احترام الشروط التالية :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li>التوقيت : <span class="de-in">um / von … bis / am</span> (3 تعابير على الأقل)</li>'
           + '<li>المرافق : <span class="de-in">Es gibt …</span> (3 مرافق)</li>'
           + '<li><b>3 أفعال ناقلة مختلفة</b> : können · müssen · dürfen · möchten</li>'
           + '<li>مادتك المفضّلة + السبب بـ <span class="de-in">weil</span></li>'
           + '<li>ترتيب الجملة : الفعل في المركز الثاني، والمصدر في الآخر</li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Ich gehe in die Lycée Emir Abdelkader in Bouira. Meine Schule ist groß '
         + 'und modern. Es gibt eine Bibliothek, zwei Labore und eine Turnhalle.</p>'
         + '<p>Mein Schultag beginnt um acht Uhr. Am Montag habe ich Deutsch, Mathematik '
         + 'und Sport. Von acht bis zwölf Uhr bin ich in der Schule. In der Pause gehe ich '
         + 'mit meinen Freunden in die Bibliothek.</p>'
         + '<p>Deutsch ist mein Lieblingsfach, weil unsere Lehrerin sehr nett ist. '
         + 'Ich kann schon gut Deutsch sprechen. Nach der Schule muss ich meine '
         + 'Hausaufgaben machen. In der Bibliothek darf man nicht laut sprechen.</p>'
         + '<p>Ich möchte später Ärztin werden, deshalb lerne ich Biologie sehr gern. '
         + 'Meine Schule gefällt mir wirklich gut.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب فقرتك هنا (سيصححها الأستاذ الافتراضي):',
           ph:'Ich gehe in die Schule … Es gibt … Am Montag …'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي', dur:60,
    obj:['مراجعة شاملة للوحدة 3','التقويم الذاتي','التصحيح الجماعي','التحضير للفرض'],
    exos:[{q:'«du ___ (können)»',opts:['kann','kannst','könnt','können'],a:1,
           why:'<span class="de-in">du</span> → <b>kannst</b>.'},
          {q:'«er ___ (müssen)»',opts:['muss','musst','müssen','müsst'],a:0,
           why:'3ᵉ personne du singulier → <b>muss</b> (sans -t !).'},
          {q:'«ihr ___ (dürfen)»',opts:['darf','darfst','dürft','dürfen'],a:2,
           why:'<span class="de-in">ihr</span> → <b>dürft</b>.'},
          {q:'Complète : «Das Buch liegt ___ dem Tisch.» (sur)',opts:['auf','in','an','zu'],a:0,
           why:'Position « sur » → <span class="de-in"><b>auf</b> + Datif</span>.'},
          {q:'«___ Montag habe ich Sport.»',opts:['Am','Um','In','Von'],a:0,
           why:'Jour → <b>am</b>.'},
          {q:'«halb sieben» =',opts:['7:30','6:30','7:00','6:00'],a:1,
           why:'<span class="de-in">halb sieben</span> = <b>6:30</b> (moitié du chemin vers 7).'},
          {q:'Traduis : «المكتبة»',opts:['die Mensa','die Bibliothek','die Turnhalle','das Labor'],a:1,
           why:'<span class="de-in">die Bibliothek</span> = المكتبة.'},
          {q:'Quelle phrase respecte l’ordre des mots ?',
           opts:['Ich muss heute lernen viel.','Ich muss heute viel lernen.',
                 'Ich heute muss viel lernen.','Muss ich heute viel lernen.'],a:1,
           why:'Modal en 2ᵉ position, infinitif **à la fin**.'},
          {q:'«Wir ___ in der Klasse nicht essen.» (interdiction)',
           opts:['können','müssen','dürfen','sollen'],a:2,
           why:'Interdiction → <span class="de-in"><b>dürfen</b> nicht</span>.'},
          {q:'«Mein Lieblingsfach ___ Deutsch.»',opts:['bin','ist','sind','hat'],a:1,
           why:'<span class="de-in">das Fach</span> (3ᵉ pers. sg.) → <b>ist</b>.'}]},

  { n:8, de:'Évaluation de l’unité 3 📝', ar:'فرض الوحدة 3', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي + سلّم التنقيط'], ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 3 (/20) ══════════ */
const DEVOIR_U3 = {
  titre:'Évaluation — Einheit 3 : Schule und Ausbildung',
  unite:3, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Ein Tag in der Schule</b></p>'
          + '<p>Hallo! Ich heiße Nadia und ich bin 16 Jahre alt. Ich gehe in die '
          + 'Lycée Emir Abdelkader in Bouira. Mein Schultag beginnt um sieben Uhr morgens. '
          + 'Ich stehe um halb sechs auf und frühstücke mit meiner Familie. Dann fahre ich '
          + 'mit dem Bus zur Schule. Der Unterricht beginnt um acht Uhr.</p>'
          + '<p>Am Montag haben wir Deutsch, Mathematik und Sport. Deutsch ist mein '
          + 'Lieblingsfach, weil unsere Lehrerin sehr nett ist. In der Pause gehe ich mit '
          + 'meinen Freundinnen in die Bibliothek.</p>'
          + '<p>Nach der Schule muss ich meine Hausaufgaben machen. Am Abend darf ich eine '
          + 'Stunde fernsehen. Ich möchte später Ärztin werden, deshalb lerne ich auch '
          + 'Biologie sehr gern.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Nadia wohnt in Algerien.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Lycée Emir Abdelkader in Bouira</span> — Bouira est en Algérie.'},
        {id:'I.2',type:'vf',t:'Nadia steht um sechs Uhr auf.',pts:1,rep:'Falsch',
         just:'<span class="de-in">halb sechs</span> = <b>5:30</b>, pas 6:00.'},
        {id:'I.3',type:'vf',t:'Der Unterricht beginnt um acht Uhr.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Der Unterricht beginnt um acht Uhr.</span>'},
        {id:'I.4',type:'vf',t:'Nadia fährt mit dem Auto zur Schule.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich fahre <b>mit dem Bus</b> zur Schule.</span>'},
        {id:'I.5',type:'txt',t:'Warum ist Deutsch ihr Lieblingsfach?',pts:2,
         rep:'Weil ihre Lehrerin sehr nett ist.',key:['lehrerin','nett'],
         just:'<span class="de-in">… weil unsere Lehrerin sehr nett ist.</span>'},
        {id:'I.6',type:'txt',t:'Was möchte Nadia später werden?',pts:2,
         rep:'Sie möchte Ärztin werden.',key:['ärztin','arztin'],
         just:'<span class="de-in">Ich möchte später Ärztin werden.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ gut Deutsch sprechen.» (pouvoir)',
         opts:['kann','könnt','können','kannst'],a:0,pts:1,
         why:'<span class="de-in">ich</span> → <b>kann</b> (radical modifié, sans -e).'},
        {id:'II.2',type:'qcm',t:'«___ du heute lernen?» (devoir)',
         opts:['Muss','Musst','Müssen','Müsst'],a:1,pts:1,
         why:'<span class="de-in">du</span> → <b>musst</b>.'},
        {id:'II.3',type:'qcm',t:'«In der Bibliothek ___ man nicht laut sprechen.» (interdiction)',
         opts:['kann','muss','darf','soll'],a:2,pts:1,
         why:'Interdiction → <span class="de-in"><b>darf</b> nicht</span>.'},
        {id:'II.4',type:'qcm',t:'«Das Heft liegt ___ dem Tisch.» (sur, position)',
         opts:['auf','in','an','zu'],a:0,pts:1,
         why:'Position « sur » → <span class="de-in"><b>auf</b> + Datif</span>.'},
        {id:'II.5',type:'txt',t:'Complète : «___ Montag habe ich Sport.»',pts:1,
         rep:'Am',key:['am'],just:'Jour de la semaine → <b>am</b>.'},
        {id:'II.6',type:'txt',t:'Quelle heure : 9:30 ?',pts:1,rep:'halb zehn',
         key:['halb zehn'],just:'<span class="de-in">halb zehn</span> = 9:30.'},
        {id:'II.7',type:'txt',t:'Traduis : «يجب أن أعمل واجباتي»',pts:1,
         rep:'Ich muss meine Hausaufgaben machen.',key:['muss','hausaufgaben'],
         just:'<span class="de-in">müssen</span> + infinitif à la fin.'},
        {id:'II.8',type:'txt',t:'Mets dans l’ordre : lernen / ich / möchte / Deutsch',pts:1,
         rep:'Ich möchte Deutsch lernen.',key:['ich möchte deutsch lernen'],
         just:'Sujet + modal + complément + **infinitif à la fin**.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 8 أسطر تصف فيها مدرستك ويومك الدراسي : التوقيت، المرافق، '
           + 'مادتك المفضّلة مع السبب (weil)، وثلاثة أفعال ناقلة مختلفة.',
         grille:[['3 تعابير زمنية صحيحة (um / von…bis / am)','0.5'],
                 ['3 مرافق مدرسية بمفردات صحيحة','0.5'],
                 ['3 أفعال ناقلة مختلفة مصرّفة صحياً','1.0'],
                 ['جملة بـ weil مع الفعل في الآخر','0.5'],
                 ['ترتيب الجملة : الفعل في المركز الثاني','0.5'],
                 ['مفردات الوحدة 3 (8 كلمات على الأقل)','0.5'],
                 ['الإملاء، المajuscules، علامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Ich gehe in die Lycée Emir Abdelkader in Bouira. '
              + 'Meine Schule ist groß und modern. Es gibt eine Bibliothek, zwei Labore und '
              + 'eine Turnhalle. Mein Schultag beginnt um acht Uhr. Am Montag habe ich '
              + 'Deutsch, Mathematik und Sport. Von acht bis zwölf Uhr bin ich in der Schule.</p>'
              + '<p>Deutsch ist mein Lieblingsfach, weil unsere Lehrerin sehr nett ist. '
              + 'Ich kann schon gut Deutsch sprechen. Nach der Schule muss ich meine '
              + 'Hausaufgaben machen. In der Bibliothek darf man nicht laut sprechen. '
              + 'Ich möchte später Ärztin werden, deshalb lerne ich Biologie sehr gern.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U3 = {
  unite: 3,
  titre: 'التصحيح النموذجي — الوحدة 3 : Schule und Ausbildung',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Lycée Emir Abdelkader in Bouira — Bouira est en Algérie.' },
    { id:'I.2', reponse:'Falsch', justification:'halb sechs = 5:30, pas 6:00.' },
    { id:'I.3', reponse:'Richtig', justification:'Der Unterricht beginnt um acht Uhr.' },
    { id:'I.4', reponse:'Falsch', justification:'Sie fährt mit dem Bus, nicht mit dem Auto.' },
    { id:'I.5', reponse:'Weil ihre Lehrerin sehr nett ist.', justification:'… weil unsere Lehrerin sehr nett ist.' },
    { id:'I.6', reponse:'Sie möchte Ärztin werden.', justification:'Ich möchte später Ärztin werden.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'kann', regle:'ich → kann (radical modifié, sans -e)' },
    { id:'II.2', reponse:'Musst', regle:'du → musst' },
    { id:'II.3', reponse:'darf', regle:'interdiction → dürfen + nicht' },
    { id:'II.4', reponse:'auf', regle:'position « sur » → auf + Datif' },
    { id:'II.5', reponse:'Am', regle:'jour de la semaine → am' },
    { id:'II.6', reponse:'halb zehn', regle:'halb X = (X-1):30' },
    { id:'II.7', reponse:'Ich muss meine Hausaufgaben machen.', regle:'modal en 2 + infinitif final' },
    { id:'II.8', reponse:'Ich möchte Deutsch lernen.', regle:'sujet + modal + complément + infinitif final' }
  ],
  partie_III: {
    bareme: [['3 تعابير زمنية صحيحة','0.5'],['3 مرافق مدرسية','0.5'],
             ['3 أفعال ناقلة مختلفة','1.0'],['جملة بـ weil','0.5'],
             ['ترتيب الجملة (الفعل في المركز 2)','0.5'],['مفردات الوحدة 3','0.5'],
             ['الإملاء والترقيم','0.5']],
    modele: 'Ich gehe in die Lycée Emir Abdelkader in Bouira. Meine Schule ist groß und modern. '
          + 'Es gibt eine Bibliothek, zwei Labore und eine Turnhalle. Mein Schultag beginnt um '
          + 'acht Uhr. Am Montag habe ich Deutsch, Mathematik und Sport. Deutsch ist mein '
          + 'Lieblingsfach, weil unsere Lehrerin sehr nett ist. Ich kann schon gut Deutsch '
          + 'sprechen. Nach der Schule muss ich meine Hausaufgaben machen. In der Bibliothek '
          + 'darf man nicht laut sprechen. Ich möchte später Ärztin werden.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 3 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich kann gut Deutsch sprechen**en**~~ → le modal se conjugue, '
    + 'l’infinitif reste **inchangé** à la fin : Ich kann gut Deutsch <b>sprechen</b>.',
    '~~Ich muss lernen heute~~ → l’infinitif va **à la fin** : Ich muss heute <b>lernen</b>.',
    '~~er musst~~ → <b>er muss</b> (3ᵉ personne du singulier sans -t).',
    '~~halb neun = 9:30~~ → <b>halb neun = 8:30</b> ! Erreur n°1 des candidats algériens.',
    '~~Ich gehe in der Schule~~ (mouvement) → <b>in die Schule</b> (Akkusativ).',
    '~~am Montag habe ich Deutsch in Montag~~ → une seule préposition : <b>am Montag</b>.',
    '~~das Faches~~ → pluriel avec umlaut : <b>die Fächer</b>.',
    '~~Am Montag ich habe Deutsch~~ → le verbe reste en position 2 : <span class="de-in">Am Montag <b>habe ich</b> Deutsch</span> (inversion !)',
    '~~Ich habe keine Zeit nicht~~ → double négation interdite : <span class="de-in">Ich habe <b>keine</b> Zeit</span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE3 = { meta: UNITE3_META, seances: SEANCES_U3, devoir: DEVOIR_U3, corrige: CORRIGE_U3 };
