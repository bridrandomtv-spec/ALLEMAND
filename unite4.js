/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite4.js
   الوحدة 4 : Alltag und Freizeit — الحياة اليومية وأوقات الفراغ
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثاني (clôture)
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE4_META = {
  n: 4,
  de: 'Alltag und Freizeit',
  ar: 'الحياة اليومية وأوقات الفراغ',
  niveau: '2AS',
  trimestre: 2,
  periode: 'جانفي — مارس',
  duree_totale: 465,
  cecrl: 'A2',
  objectifs: [
    'وصف الروتين اليومي بالأفعال الانفصالية',
    'الحديث عن الهوايات وأوقات الفراغ',
    'استعمال ظرف المكان والزمان (Dativ après mit/nach/zu)',
    'اقتراح موعد وقبوله أو رفضه بأدب',
    'فهم نص سردي حول يوم في الحياة',
    'إنتاج فقرة سردية من 8 إلى 10 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['der Tagesablauf', 'die Freizeit', 'das Hobby', 'sich treffen',
                    'verabredet sein', 'Zeit haben', 'Lust haben'],
  grammaire_cle: ['Trennbare Verben im Perfekt', 'Präpositionen mit Dativ',
                  'Vorschläge machen', 'Zeitadverbien', 'Satzklammer']
};

const SEANCES_U4 = [
  { n:1, de:'Der Tagesablauf — trennbare Verben', ar:'روتين اليوم — الأفعال الانفصالية', dur:60,
    obj:['وصف اليوم بالترتيب','الأفعال الانفصالية في الحاضر','الجملة ذات القوسين (Satzklammer)'],
    lex:[['aufstehen','يستيقظ'],['frühstücken','يتناول الفطور'],['sich waschen','يغتسل'],
         ['sich anziehen','يرتدي ملابسه'],['zur Schule gehen','يذهب إلى المدرسة'],
         ['zu Mittag essen','يتناول الغداء'],['Hausaufgaben machen','ينجز الواجبات'],
         ['fernsehen','يشاهد التلفاز'],['zu Abend essen','يتناول العشاء'],
         ['schlafen gehen','يذهب للنوم'],['aufräumen','يرتّب'],['einkaufen','يتسوّق'],
         ['anrufen','يتّصل بـ'],['einladen','يدعو'],['mitkommen','يرافق']],
    gram:{t:'La Satzklammer — le « cadre » de la phrase allemande',
      b:['Le verbe conjugué est en <b>position 2</b>, le préfixe (ou l’infinitif) ferme la phrase <b>à la fin</b>.',
         '<span class="de-in">Ich <b>stehe</b> um 6 Uhr <b>auf</b>.</span>',
         '<span class="de-in">Er <b>macht</b> seine Hausaufgaben <b>nach dem Essen</b>.</span>',
         'Tout ce qui n’est pas le verbe se place <b>à l’intérieur</b> du cadre.'],
      tbl:[['Position 1','Ich / Am Montag / Dann'],
           ['Position 2 (verbe)','stehe / habe / gehe'],
           ['Milieu','um 6 Uhr / meine Hausaufgaben / mit dem Bus'],
           ['Fin (préfixe / infinitif)','auf / machen / zur Schule']],
      ex:'<span class="de-in">Am Wochenende <b>stehe</b> ich spät <b>auf</b> und <b>sehe</b> fern.</span>'},
    exos:[{q:'Remets dans l’ordre : auf / ich / um 6 Uhr / stehe',
           opts:['Ich stehe um 6 Uhr auf.','Ich um 6 Uhr stehe auf.',
                 'Ich stehe auf um 6 Uhr.','Um 6 Uhr ich stehe auf.'],a:0,
           why:'Sujet + verbe (pos. 2) + complément + <b>préfixe à la fin</b>.'},
          {q:'«Er ___ jeden Abend ___ .» (il regarde la télé)',
           opts:['sieht … fern','fern … sieht','schaut … fern','sieht fern …'],a:0,
           why:'<span class="de-in">fernsehen</span> → <b>sieht … fern</b> (verbe fort, e → ie).'},
          {q:'«Nach der Schule ___ ich meine Hausaufgaben.»',
           opts:['mache','mache … auf','aufmache','machen'],a:0,
           why:'<span class="de-in">machen</span> n’est pas séparable ici.'},
          {q:'Traduis : «أتناول الغداء»',
           opts:['Ich esse Mittag zu.','Ich esse zu Mittag.',
                 'Ich zu Mittag esse.','Ich mittag esse zu.'],a:1,
           why:'<span class="de-in">zu Mittag essen</span> — préfixe <b>zu</b> en fin de phrase.'},
          {q:'«Am Montag ___ ich mit dem Bus ___ .» (j’accompagne)',
           opts:['komme … mit','mit … komme','komme mit …','mitkomme …'],a:0,
           why:'<span class="de-in">mitkommen</span> → <b>komme … mit</b>.'}]},

  { n:2, de:'Perfekt der trennbaren Verben', ar:'الماضي مع الأفعال الانفصالية', dur:60,
    obj:['بناء الماضي المركّب','ge- entre le préfixe et le radical','choix sein/haben'],
    lex:[['aufgestanden','استيقظ'],['angefangen','بدأ'],['aufgehört','توقّف'],
         ['angerufen','اتّصل'],['eingeladen','دعا'],['mitgekommen','رافق'],
         ['ferngesehen','شاهد التلفاز'],['eingekauft','تسوّق'],['aufgeräumt','رتّب'],
         ['zugegemacht','أغلق'],['spazieren gegangen','تنزّه']],
    gram:{t:'Perfekt = haben/sein + … ge … t/en',
      b:['Verbe <b>séparable</b> : le <b>ge-</b> s’insère entre le préfixe et le radical.',
         '<span class="de-in">auf + stehen → auf<b>ge</b>standen</span>',
         '<span class="de-in">an + rufen → an<b>ge</b>rufen</span>',
         'Auxiliaire <b>sein</b> : mouvement ou changement d’état '
       + '(aufstehen, gehen, fahren, kommen, einschlafen, aufwachen, werden).',
         'Auxiliaire <b>haben</b> : tous les autres (machen, sehen, essen, fernsehen, anrufen).'],
      tbl:[['aufstehen','sein','aufgestanden'],
           ['fernsehen','haben','ferngesehen'],
           ['anrufen','haben','angerufen'],
           ['mitkommen','sein','mitgekommen'],
           ['einkaufen','haben','eingekauft'],
           ['spazieren gehen','sein','spazieren gegangen']],
      ex:'<span class="de-in">Ich <b>bin</b> um 6 Uhr auf<b>ge</b>standen.</span> · '
       + '<span class="de-in">Wir <b>haben</b> fern<b>ge</b>sehen.</span>'},
    exos:[{q:'«Gestern ___ ich um 7 Uhr aufgestanden.»',opts:['bin','habe','war','hatte'],a:0,
           why:'<span class="de-in">aufstehen</span> = changement d’état → auxiliaire <b>sein</b>.'},
          {q:'Participe II de «anrufen» :',
           opts:['angerufen','geanruft','angeruft','gerufen an'],a:0,
           why:'Préfixe + <b>ge</b> + radical + <b>en</b> → <span class="de-in">an<b>ge</b>rufen</span>.'},
          {q:'«Wir ___ gestern ferngesehen.»',opts:['haben','sind','werden','war'],a:0,
           why:'<span class="de-in">fernsehen</span> = pas de mouvement → <b>haben</b>.'},
          {q:'«Ich ___ mit dem Bus zur Schule gefahren.»',opts:['bin','habe','war','hat'],a:0,
           why:'<span class="de-in">fahren</span> = déplacement → <b>sein</b>.'},
          {q:'Participe II de «einkaufen» :',
           opts:['eingekauft','gekauft ein','einkauft','gekauft'],a:0,
           why:'<span class="de-in">ein<b>ge</b>kauft</span>.'}]},

  { n:3, de:'Präpositionen mit Dativ', ar:'حروف الجر مع حالة الداتيف', dur:60,
    obj:['mit · nach · zu · aus · von · bei','الاسم بعد حرف الجر','أوقات اليوم وأيام الأسبوع'],
    lex:[['mit dem Bus','بالحافلة'],['mit meinen Freunden','مع أصدقائي'],
         ['nach der Schule','بعد المدرسة'],['nach Hause','إلى البيت'],
         ['zu Hause','في البيت'],['zum (zu dem) Sport','إلى الرياضة'],
         ['zur (zu der) Schule','إلى المدرسة'],['aus Algerien','من الجزائر'],
         ['von 8 bis 12','من 8 إلى 12'],['bei meiner Oma','عند جدّتي'],
         ['am Nachmittag','بعد الظهر'],['am Wochenende','في نهاية الأسبوع'],
         ['im Sommer','في الصيف'],['in der Nacht','في الليل']],
    gram:{t:'Dativ obligatoire après : mit · nach · aus · zu · von · bei · seit · außer · gegenüber',
      b:['Les articles au Datif : <b>dem</b> (m/n) · <b>der</b> (f) · <b>den + n</b> (pluriel)',
         '<span class="de-in">Ich fahre <u>mit dem</u> Bus.</span>',
         '<span class="de-in">Ich gehe <u>mit meinen</u> Freunden.</span> ← pluriel : <b>den Freunden</b>',
         '<b>zu</b> + die → <b>zur</b> ; <b>zu</b> + der/dem → <b>zum</b>',
         '<b>am</b> = an dem (jours, parties du jour) · <b>im</b> = in dem (mois, saisons)'],
      tbl:[['Nominativ','der / ein','die / eine','das / ein','die / —'],
           ['Dativ','dem / einem','der / einer','dem / einem','den + n / —']],
      ex:'<span class="de-in">Nach der Schule gehe ich <b>mit meinen</b> Freunden '
       + '<b>zum</b> Sport.</span>'},
    exos:[{q:'«Ich fahre ___ dem Bus.»',opts:['mit','nach','zu','aus'],a:0,
           why:'Moyen de transport → <span class="de-in"><b>mit</b> + Datif</span>.'},
          {q:'«Nach ___ Schule mache ich Sport.»',opts:['der','die','den','das'],a:0,
           why:'<span class="de-in">nach</span> + Datif → <span class="de-in">der Schule</span> (féminin).'},
          {q:'«Ich gehe ___ Freunden ins Kino.» (avec mes)',
           opts:['mit meinen','mit meine','mit meinem','mit meiner'],a:0,
           why:'Datif pluriel → <b>meinen Freunden</b> (+ n final au pluriel).'},
          {q:'«___ Montag spiele ich Fußball.»',opts:['Am','Im','Um','In'],a:0,
           why:'Jour de la semaine → <b>am</b> (= an dem).'},
          {q:'«Ich komme ___ Algerien.»',opts:['aus','von','nach','mit'],a:0,
           why:'Origine / pays → <span class="de-in"><b>aus</b></span>.'},
          {q:'«Ich bin ___ Hause.» (à la maison)',opts:['zu','nach','in','an'],a:0,
           why:'Position : <span class="de-in"><b>zu</b> Hause</span> · '
           + 'mouvement : <span class="de-in"><b>nach</b> Hause</span>.'}]},

  { n:4, de:'Verabredungen — Vorschläge machen', ar:'المواعيد — الاقتراح والقبول والرفض', dur:60,
    obj:['اقتراح نشاط','قبول أو رفض بأدب','تحديد الزمان والمكان','المفردات الهاتفية'],
    lex:[['Hast du Zeit?','هل لديك وقت؟'],['Hast du Lust?','هل ترغب؟'],
         ['Wollen wir …?','هل تريد أن…؟'],['Lass uns … !','هيا بنا…!'],
         ['Wie wäre es mit …?','ما رأيك بـ…؟'],['Treffen wir uns um …','نلتقي على الساعة…'],
         ['Wo?','أين؟'],['Wann?','متى؟'],['Ja, gern!','نعم، بسرور!'],
         ['Leider nicht.','للأسف لا.'],['Ich habe keine Zeit.','ليس لديّ وقت.'],
         ['Das passt mir nicht.','هذا لا يناسبني.'],['Vielleicht ein anderes Mal.','ربما في مرة أخرى.'],
         ['Abgemacht!','اتفقنا!'],['Ich rufe dich an.','سأتّصل بك.']],
    gram:{t:'Faire une proposition — 4 structures',
      b:['<b>Wollen wir</b> + infinitif ? → <span class="de-in">Wollen wir ins Kino gehen?</span>',
         '<b>Lass uns</b> + infinitif ! → <span class="de-in">Lass uns Fußball spielen!</span>',
         '<b>Wie wäre es mit</b> + Datif ? → <span class="de-in">Wie wäre es mit einem Kaffee?</span>',
         '<b>Hast du Lust,</b> … zu + infinitif ? → <span class="de-in">Hast du Lust, '
       + 'mitzukommen?</span>'],
      tbl:[['Question','Réponse positive','Réponse négative polie'],
           ['Wollen wir …?','Ja, gern!','Leider nicht, ich muss lernen.'],
           ['Hast du Zeit?','Ja, klar!','Tut mir leid, ich habe keine Zeit.'],
           ['Wie wäre es mit …?','Gute Idee!','Das passt mir nicht.']],
      ex:'<span class="de-in">— Wollen wir am Freitag ins Kino gehen? '
       + '— Ja, gern! Treffen wir uns um 17 Uhr vor dem Kino.</span>'},
    exos:[{q:'Quelle phrase PROPOSE une activité ?',
           opts:['Wollen wir ins Kino gehen?','Ich gehe ins Kino.',
                 'Gehst du ins Kino?','Ich bin ins Kino gegangen.'],a:0,
           why:'<span class="de-in">Wollen wir … ?</span> est la formule de proposition.'},
          {q:'«Wie wäre es ___ einem Kaffee?»',opts:['mit','nach','zu','für'],a:0,
           why:'<span class="de-in">Wie wäre es <b>mit</b> + Datif</span>.'},
          {q:'Refus poli correct :',
           opts:['Nein!','Leider nicht, ich muss lernen.','Ich will nicht.','Geh weg.'],a:1,
           why:'<b>Leider</b> + justification = le refus poli attendu au BAC.'},
          {q:'«Treffen wir uns ___ 17 Uhr.»',opts:['um','am','in','zu'],a:0,
           why:'Heure précise → <b>um</b>.'},
          {q:'«Abgemacht!» signifie :',opts:['اتفقنا!','ربما!','لا أعرف!','إلى الغد!'],a:0,
           why:'<span class="de-in">Abgemacht!</span> = اتفاق نهائي.'},
          {q:'«Hast du Lust, ___ ?»',
           opts:['mitzukommen','kommst mit','mitkommen','mit zu kommen'],a:0,
           why:'<span class="de-in">zu</span> s’insère <b>entre</b> le préfixe et le verbe : '
           + '<b>mit<b>zu</b>kommen</b>.'}]},

  { n:5, de:'Textverständnis : «Ein Tag aus meinem Leben»', ar:'فهم نص — يوم من حياتي', dur:60,
    obj:['قراءة نص سردي بالماضي والحاضر','استخراج المعلومات الزمنية','الإجابة بجمل كاملة','repérage des séparables'],
    texte:'<div class="reading"><p><b>Ein Tag aus meinem Leben</b></p>'
        + '<p>Ich heiße Sofiane und ich bin 16 Jahre alt. Ich wohne mit meiner Familie '
        + 'in Sétif. Mein Tag beginnt sehr früh: Ich stehe um halb sechs auf, weil ich '
        + 'mit dem Bus zur Schule fahren muss.</p>'
        + '<p>Nach dem Frühstück gehe ich mit meinem Bruder zur Bushaltestelle. '
        + 'Der Unterricht beginnt um acht Uhr. Am Dienstag haben wir Deutsch, Sport und '
        + 'Informatik. Deutsch ist mein Lieblingsfach, weil ich später in Deutschland '
        + 'studieren möchte.</p>'
        + '<p>Um zwölf Uhr ist die Schule aus. Zu Hause esse ich mit meiner Mutter zu '
        + 'Mittag, dann mache ich meine Hausaufgaben. Am Nachmittag treffe ich mich mit '
        + 'meinen Freunden im Jugendclub. Wir spielen Fußball oder wir hören Musik.</p>'
        + '<p>Am Abend sehe ich eine Stunde fern, dann gehe ich um halb elf schlafen. '
        + 'Am Wochenende schlafe ich lange und am Samstagabend gehe ich mit meinen '
        + 'Freunden ins Kino. Gestern bin ich erst um Mitternacht nach Hause gekommen.</p></div>',
    exos:[{q:'Richtig oder Falsch : Sofiane habite à Alger.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Il habite à <b>Sétif</b> — <span class="de-in">Ich wohne … in Sétif.</span>'},
          {q:'Richtig oder Falsch : Il se lève à 5h30.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Ich stehe um <b>halb sechs</b> auf</span> = <b>5:30</b>. '
           + 'Attention au piège classique !'},
          {q:'Richtig oder Falsch : Sofiane va à l’école à pied.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… weil ich <b>mit dem Bus</b> zur Schule fahren muss.</span>'},
          {q:'Richtig oder Falsch : Il veut étudier en Allemagne plus tard.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… weil ich später in Deutschland studieren möchte.</span>'},
          {q:'Que fait Sofiane l’après-midi ?',
           opts:['Il regarde la télé','Il rencontre ses amis au club de jeunes',
                 'Il fait ses devoirs','Il dort'],a:1,
           why:'<span class="de-in">Am Nachmittag treffe ich mich mit meinen Freunden '
           + 'im Jugendclub.</span>'},
          {q:'À quelle heure va-t-il dormir en semaine ?',opts:['22:30','23:00','23:30','00:00'],a:2,
           why:'<span class="de-in">… dann gehe ich um <b>halb elf</b> schlafen</span> = <b>22:30</b>. '
           + '⚠️ Piège : <b>halb elf = 22:30</b>, donc la bonne réponse est <b>22:30</b>.'},
          {q:'Relevez deux verbes séparables du texte.',
           opts:['aufstehen · fernsehen','essen · trinken','wohnen · heißen','spielen · hören'],a:0,
           why:'<span class="de-in">auf<b>stehen</b></span> et <span class="de-in">fern<b>sehen</b></span> '
           + '— les deux se séparent : <span class="de-in">ich stehe … auf · ich sehe … fern</span>.'}]},

  { n:6, de:'Textproduktion — «Mein perfekter Tag»', ar:'إنتاج كتابي ✍️ يومي المثالي', dur:60,
    obj:['كتابة نص سردي 8-10 أسطر','3 أفعال انفصالية au Perfekt','Dativ après mit/nach/zu','proposition + refus poli'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب فقرة من <b>8 إلى 10 أسطر</b> '
           + 'تصف فيها يومك المثالي، مع احترام الشروط التالية :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>3 أفعال انفصالية على الأقل</b> (aufstehen · fernsehen · mitkommen …)</li>'
           + '<li><b>2 verbes au Perfekt</b> avec le bon auxiliaire (sein / haben)</li>'
           + '<li><b>3 expressions de temps</b> (um … · am … · nach … · von … bis …)</li>'
           + '<li>une préposition au <b>Dativ</b> (mit / nach / zu / bei)</li>'
           + '<li>une <b>proposition</b> (Wollen wir …? / Lass uns …!) + une réponse</li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Mein perfekter Tag beginnt spät. Am Samstag stehe ich erst um neun Uhr auf, '
         + 'weil ich am Freitag lange ferngesehen habe. Nach dem Frühstück räume ich mein '
         + 'Zimmer auf und helfe meiner Mutter beim Einkaufen.</p>'
         + '<p>Um elf Uhr treffe ich mich mit meinen Freunden im Jugendclub. '
         + '— Wollen wir Fußball spielen? — Ja, gern! Wir spielen von elf bis dreizehn Uhr. '
         + 'Danach gehe ich mit meinem Bruder nach Hause und wir essen zusammen zu Mittag.</p>'
         + '<p>Am Nachmittag bin ich mit meinen Cousins ins Schwimmbad gegangen. '
         + 'Es hat mir sehr gut gefallen. Am Abend hat mein Freund gesagt: '
         + '«Lass uns ins Kino gehen!» Ich habe geantwortet: «Gute Idee, aber leider habe '
         + 'ich keine Zeit, ich muss lernen.» Er hat gesagt: «Vielleicht ein anderes Mal. '
         + 'Abgemacht!»</p>'
         + '<p>Um halb elf gehe ich schlafen. Das ist mein perfekter Tag.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب فقرتك هنا (سيصححها الأستاذ الافتراضي):',
           ph:'Mein perfekter Tag beginnt … Am Samstag stehe ich … auf.'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي', dur:60,
    obj:['مراجعة شاملة للوحدة 4','التقويم الذاتي','التصحيح الجماعي','التحضير للفرض + للوحدة 5'],
    exos:[{q:'«Ich ___ um 6 Uhr ___ .» (je me lève)',opts:['stehe … auf','auf … stehe','stehe auf …','aufstehe …'],a:0,
           why:'Verbe en position 2, préfixe <b>à la fin</b>.'},
          {q:'«Gestern ___ ich früh aufgestanden.»',opts:['bin','habe','war','werde'],a:0,
           why:'Mouvement / changement d’état → <b>sein</b>.'},
          {q:'Participe II de «fernsehen» :',opts:['ferngesehen','gesehen fern','gefernsehen','fernseht'],a:0,
           why:'<span class="de-in">fern + <b>ge</b> + sehen</span>.'},
          {q:'«Ich fahre ___ dem Bus ___ Schule.»',opts:['mit … zur','nach … zur','zu … zur','mit … nach'],a:0,
           why:'<span class="de-in"><b>mit</b> + Datif</span> (moyen) et <span class="de-in"><b>zur</b> Schule</span> (zu + der).'},
          {q:'«___ Samstag treffe ich mich ___ meinen Freunden.»',
           opts:['Am … mit','Im … mit','Um … nach','Am … nach'],a:0,
           why:'Jour → <b>am</b> ; « avec » → <b>mit</b> + Datif pluriel <b>meinen Freunden</b>.'},
          {q:'Proposition correcte :',opts:['Lass uns ins Kino gehen!','Lass uns gehen ins Kino!',
                                            'Gehen wir ins Kino lass!','Uns lass ins Kino gehen!'],a:0,
           why:'<span class="de-in">Lass uns</span> + infinitif <b>à la fin</b>.'},
          {q:'Refus poli :',opts:['Nein.','Leider nicht, ich muss lernen.','Ich will nicht!','Nie!'],a:1,
           why:'<b>Leider</b> + justification = la forme attendue.'},
          {q:'«halb elf» =',opts:['10:30','11:30','11:00','10:00'],a:0,
           why:'<span class="de-in">halb elf</span> = <b>10:30</b> (moitié du chemin vers 11).'},
          {q:'«zu Hause» signifie :',opts:['إلى البيت','في البيت','من البيت','بدون بيت'],a:1,
           why:'<span class="de-in"><b>zu</b> Hause</span> = position (في البيت) · '
           + '<span class="de-in"><b>nach</b> Hause</span> = mouvement (إلى البيت).'},
          {q:'«Ich gehe ___ der Schule nach Hause.» (après)',opts:['nach','von','zu','mit'],a:0,
           why:'« après » → <span class="de-in"><b>nach</b> der Schule</span> (Datif).'},
          {q:'Quelle phrase respecte la Satzklammer ?',
           opts:['Ich habe gestern ferngesehen.','Ich habe ferngesehen gestern.',
                 'Ich gestern habe ferngesehen.','Habe ich gestern ferngesehen.'],a:0,
           why:'Auxiliaire en 2ᵉ position, participe <b>à la fin</b>, complément au milieu.'},
          {q:'«Wie wäre es ___ einem Spaziergang?»',opts:['mit','nach','zu','von'],a:0,
           why:'<span class="de-in">Wie wäre es <b>mit</b> + Datif</span>.'}]},

  { n:8, de:'Évaluation de l’unité 4 📝', ar:'فرض الوحدة 4', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي + سلّم التنقيط'], ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 4 (/20) ══════════ */
const DEVOIR_U4 = {
  titre:'Évaluation — Einheit 4 : Alltag und Freizeit',
  unite:4, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Ein Tag aus meinem Leben</b></p>'
          + '<p>Ich heiße Sofiane und ich bin 16 Jahre alt. Ich wohne mit meiner Familie in '
          + 'Sétif. Mein Tag beginnt sehr früh: Ich stehe um halb sechs auf, weil ich mit dem '
          + 'Bus zur Schule fahren muss. Nach dem Frühstück gehe ich mit meinem Bruder zur '
          + 'Bushaltestelle. Der Unterricht beginnt um acht Uhr.</p>'
          + '<p>Am Dienstag haben wir Deutsch, Sport und Informatik. Deutsch ist mein '
          + 'Lieblingsfach, weil ich später in Deutschland studieren möchte. Um zwölf Uhr ist '
          + 'die Schule aus. Zu Hause esse ich mit meiner Mutter zu Mittag, dann mache ich '
          + 'meine Hausaufgaben.</p>'
          + '<p>Am Nachmittag treffe ich mich mit meinen Freunden im Jugendclub. Wir spielen '
          + 'Fußball oder wir hören Musik. Am Abend sehe ich eine Stunde fern, dann gehe ich '
          + 'um halb elf schlafen. Am Wochenende schlafe ich lange und am Samstagabend gehe '
          + 'ich mit meinen Freunden ins Kino.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Sofiane wohnt in Algerien.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Ich wohne … in Sétif.</span> — Sétif est en Algérie.'},
        {id:'I.2',type:'vf',t:'Er steht um sechs Uhr auf.',pts:1,rep:'Falsch',
         just:'<span class="de-in">halb sechs</span> = <b>5:30</b>, pas 6:00.'},
        {id:'I.3',type:'vf',t:'Er fährt mit dem Bus zur Schule.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… weil ich mit dem Bus zur Schule fahren muss.</span>'},
        {id:'I.4',type:'vf',t:'Am Nachmittag macht er seine Hausaufgaben.',pts:1,rep:'Falsch',
         just:'Les devoirs sont faits <b>après le repas de midi</b> ; l’après-midi il retrouve ses amis.'},
        {id:'I.5',type:'txt',t:'Warum ist Deutsch sein Lieblingsfach?',pts:2,
         rep:'Weil er später in Deutschland studieren möchte.',
         key:['deutschland','studieren'],
         just:'<span class="de-in">… weil ich später in Deutschland studieren möchte.</span>'},
        {id:'I.6',type:'txt',t:'Was macht Sofiane am Samstagabend?',pts:2,
         rep:'Er geht mit seinen Freunden ins Kino.',key:['kino','freunden'],
         just:'<span class="de-in">Am Samstagabend gehe ich mit meinen Freunden ins Kino.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ um 6 Uhr ___ .» (aufstehen)',
         opts:['stehe … auf','auf … stehe','stehe auf …','aufstehe …'],a:0,pts:1,
         why:'Verbe en position 2, préfixe **à la fin** (Satzklammer).'},
        {id:'II.2',type:'qcm',t:'«Gestern ___ ich früh aufgestanden.»',
         opts:['bin','habe','war','werde'],a:0,pts:1,
         why:'Changement d’état → auxiliaire <b>sein</b>.'},
        {id:'II.3',type:'qcm',t:'«Ich fahre ___ dem Bus ___ Schule.»',
         opts:['mit … zur','nach … zur','zu … nach','mit … nach'],a:0,pts:1,
         why:'<span class="de-in"><b>mit</b> + Datif</span> · <span class="de-in">zu + der = <b>zur</b></span>.'},
        {id:'II.4',type:'qcm',t:'«___ Samstag treffe ich mich ___ meinen Freunden.»',
         opts:['Am … mit','Im … mit','Um … nach','Am … nach'],a:0,pts:1,
         why:'Jour → <b>am</b> ; « avec » → <b>mit</b> + Datif pluriel.'},
        {id:'II.5',type:'txt',t:'Participe II de «anrufen» :',pts:1,rep:'angerufen',
         key:['angerufen'],just:'Préfixe + <b>ge</b> + radical + <b>en</b>.'},
        {id:'II.6',type:'txt',t:'Quelle heure : 10:30 ?',pts:1,rep:'halb elf',
         key:['halb elf'],just:'<span class="de-in">halb elf</span> = 10:30.'},
        {id:'II.7',type:'txt',t:'Traduis : «هل تريد أن نذهب إلى السينما؟»',pts:1,
         rep:'Wollen wir ins Kino gehen?',key:['wollen wir','kino'],
         just:'<span class="de-in">Wollen wir</span> + infinitif à la fin.'},
        {id:'II.8',type:'txt',t:'Réponds poliment par la négative : «Leider …» (je dois étudier)',pts:1,
         rep:'Leider nicht, ich muss lernen.',key:['leider','muss lernen'],
         just:'<b>Leider</b> + justification = refus poli.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 8 أسطر تصف فيها يومك المثالي : 3 أفعال انفصالية، '
           + 'فعلان في الماضي (Perfekt) مع المساعد الصحيح، 3 تعابير زمنية، '
           + 'حرف جر مع الداتيف، واقتراح (Wollen wir…? / Lass uns…!) مع جوابه.',
         grille:[['3 أفعال انفصالية مبنية بشكل صحيح (Satzklammer)','0.5'],
                 ['2 verbes au Perfekt avec sein/haben corrects','1.0'],
                 ['3 تعابير زمنية (um / am / nach / von…bis)','0.5'],
                 ['préposition + Datif correcte (mit/nach/zu/bei)','0.5'],
                 ['proposition + réponse (acceptation ou refus poli)','0.5'],
                 ['مفردات الوحدة 4 (8 كلمات على الأقل)','0.5'],
                 ['الإملاء، المajuscules، علامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Mein perfekter Tag beginnt spät. Am Samstag stehe ich '
              + 'erst um neun Uhr auf, weil ich am Freitag lange ferngesehen habe. Nach dem '
              + 'Frühstück räume ich mein Zimmer auf und helfe meiner Mutter beim Einkaufen.</p>'
              + '<p>Um elf Uhr treffe ich mich mit meinen Freunden im Jugendclub. '
              + '— Wollen wir Fußball spielen? — Ja, gern! Wir spielen von elf bis dreizehn Uhr. '
              + 'Danach gehe ich mit meinem Bruder nach Hause und wir essen zusammen zu Mittag.</p>'
              + '<p>Am Nachmittag bin ich mit meinen Cousins ins Schwimmbad gegangen. Am Abend '
              + 'hat mein Freund gesagt: «Lass uns ins Kino gehen!» Ich habe geantwortet: '
              + '«Gute Idee, aber leider habe ich keine Zeit, ich muss lernen.» Um halb elf '
              + 'gehe ich schlafen. Das ist mein perfekter Tag.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U4 = {
  unite: 4,
  titre: 'التصحيح النموذجي — الوحدة 4 : Alltag und Freizeit',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Sétif est une ville algérienne.' },
    { id:'I.2', reponse:'Falsch', justification:'halb sechs = 5:30, pas 6:00.' },
    { id:'I.3', reponse:'Richtig', justification:'… weil ich mit dem Bus zur Schule fahren muss.' },
    { id:'I.4', reponse:'Falsch', justification:'Les devoirs sont faits après le déjeuner, pas l’après-midi.' },
    { id:'I.5', reponse:'Weil er später in Deutschland studieren möchte.', justification:'… weil ich später in Deutschland studieren möchte.' },
    { id:'I.6', reponse:'Er geht mit seinen Freunden ins Kino.', justification:'Am Samstagabend gehe ich mit meinen Freunden ins Kino.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'stehe … auf', regle:'Satzklammer : verbe en 2, préfixe à la fin' },
    { id:'II.2', reponse:'bin', regle:'aufstehen = changement d’état → sein' },
    { id:'II.3', reponse:'mit … zur', regle:'mit + Datif ; zu + der = zur' },
    { id:'II.4', reponse:'Am … mit', regle:'jour → am ; avec → mit + Datif pluriel' },
    { id:'II.5', reponse:'angerufen', regle:'préfixe + ge + radical + en' },
    { id:'II.6', reponse:'halb elf', regle:'halb X = (X-1):30' },
    { id:'II.7', reponse:'Wollen wir ins Kino gehen?', regle:'Wollen wir + infinitif final' },
    { id:'II.8', reponse:'Leider nicht, ich muss lernen.', regle:'refus poli = leider + justification' }
  ],
  partie_III: {
    bareme: [['3 verbes séparables (Satzklammer)','0.5'],['2 Perfekt avec sein/haben','1.0'],
             ['3 expressions de temps','0.5'],['préposition + Datif','0.5'],
             ['proposition + réponse','0.5'],['vocabulaire unité 4','0.5'],
             ['orthographe + majuscules','0.5']],
    modele: 'Mein perfekter Tag beginnt spät. Am Samstag stehe ich erst um neun Uhr auf, weil ich '
          + 'am Freitag lange ferngesehen habe. Nach dem Frühstück räume ich mein Zimmer auf. '
          + 'Um elf Uhr treffe ich mich mit meinen Freunden im Jugendclub. — Wollen wir Fußball '
          + 'spielen? — Ja, gern! Danach gehe ich mit meinem Bruder nach Hause. Am Nachmittag '
          + 'bin ich mit meinen Cousins ins Schwimmbad gegangen. Am Abend hat mein Freund gesagt: '
          + '«Lass uns ins Kino gehen!» — «Gute Idee, aber leider habe ich keine Zeit.» '
          + 'Um halb elf gehe ich schlafen.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 4 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich aufstehe um 6 Uhr~~ → le préfixe va **à la fin** : Ich <b>stehe</b> um 6 Uhr <b>auf</b>.',
    '~~Ich habe aufgestanden~~ → <b>sein</b> : Ich <b>bin</b> aufgestanden.',
    '~~geaufstanden~~ → le ge- s’insère **après** le préfixe : auf<b>ge</b>standen.',
    '~~mit meine Freunde~~ → Datif pluriel + n : mit meine<b>n</b> Freunde<b>n</b>.',
    '~~zu der Schule~~ (contracté) → <b>zur</b> Schule · ~~zu dem Sport~~ → <b>zum</b> Sport.',
    '~~halb elf = 11:30~~ → <b>halb elf = 10:30</b>. Erreur n°1 des candidats algériens.',
    '~~Ich bin zu Hause gegangen~~ → mouvement : Ich bin <b>nach</b> Hause gegangen.',
    '~~Hast du Lust mitkommen?~~ → <b>zu</b> entre le préfixe et le verbe : Hast du Lust, '
    + 'mit<b>zu</b>kommen?'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE4 = { meta: UNITE4_META, seances: SEANCES_U4, devoir: DEVOIR_U4, corrige: CORRIGE_U4 };
