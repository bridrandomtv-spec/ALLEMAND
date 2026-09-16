/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite2.js
   الوحدة 2 : Familie und Freunde — العائلة والأصدقاء
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي
   Programme officiel MEN · السنة الثانية ثانوي
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE2_META = {
  n: 2,
  de: 'Familie und Freunde',
  ar: 'العائلة والأصدقاء',
  niveau: '2AS',
  duree_totale: 465,
  cecrl: 'A1 → A2',
  objectifs: [
    'تسمية أفراد العائلة بالألمانية',
    'استعمال أدوات الملكية Possessivartikel',
    'وصف الأشخاص بالصفات (Adjektive)',
    'التحدث عن الأصدقاء والصداقة',
    'فهم نص وصفي حول العائلة',
    'إنتاج فقرة وصفية من 6 إلى 8 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['die Familie', 'der Vater', 'die Mutter', 'mein', 'dein', 'sein', 'ihr',
                    'groß', 'klein', 'nett', 'der Freund', 'die Freundin'],
  grammaire_cle: ['Possessivartikel', 'Adjektive (prédicat)', 'Akkusativ', 'Nebensatz mit und/aber']
};

const SEANCES_U2 = [
  { n:1, de:'Die Familienmitglieder', ar:'أفراد العائلة', dur:60,
    obj:['تسمية أفراد العائلة','أدوات التعريف der/die/das','الجمع Plural'],
    lex:[['die Familie','العائلة'],['der Vater','الأب'],['die Mutter','الأم'],
         ['das Kind','الطفل'],['die Kinder','الأطفال'],['der Sohn','الابن'],
         ['die Tochter','البنت'],['der Bruder','الأخ'],['die Schwester','الأخت'],
         ['die Geschwister','الإخوة'],['der Großvater','الجد'],['die Großmutter','الجدة'],
         ['der Onkel','العم / الخال'],['die Tante','العمّة / الخالة'],
         ['der Cousin','ابن العم'],['die Cousine','بنت العم'],['die Eltern','الوالدان']],
    gram:{t:'der · die · das — l’article défini',
      tbl:[['der','masculin','der Vater · der Bruder · der Sohn'],
           ['die','féminin','die Mutter · die Schwester · die Tochter'],
           ['das','neutre','das Kind · das Mädchen'],
           ['die','pluriel (toujours)','die Kinder · die Eltern']],
      ex:'<span class="de-in">Das ist <b>der</b> Vater und das ist <b>die</b> Mutter.</span>'},
    exos:[{q:'Quel article pour «المدرسة» ? … äh — pour «die Mutter» ?',
           opts:['der','die','das','den'],a:1,why:'<b>Mutter</b> est féminin → <span class="de-in">die</span>.'},
          {q:'«das Kind» au pluriel :',opts:['die Kinds','die Kinder','der Kinder','das Kinder'],a:1,
           why:'<span class="de-in">das Kind → die Kinder</span>.'},
          {q:'Traduis : «الإخوة»',opts:['die Schwester','die Eltern','die Geschwister','die Kinder'],a:2,
           why:'<span class="de-in">die Geschwister</span> = الإخوة والأخوات معاً.'},
          {q:'«die Großmutter» signifie :',opts:['العمّة','الجدة','الخالة','الأم'],a:1,
           why:'<span class="de-in">Groß + Mutter = die Großmutter</span> = الجدة.'}]},

  { n:2, de:'Possessivartikel — mein, dein, sein, ihr', ar:'أدوات الملكية', dur:60,
    obj:['أدوات الملكية','التوافق في الجنس والعدد','حالة Akkusativ'],
    lex:[['mein','ـي'],['dein','ـكَ / ـكِ'],['sein','ـه (مذكر/محايد)'],['ihr','ـها / ـهم'],
         ['unser','ـنا'],['euer','ـكم'],['Ihr','ـكم (احترام)'],
         ['mein Vater','أبي'],['deine Mutter','أمّك'],['sein Bruder','أخوه'],
         ['ihre Schwester','أختها'],['unser Haus','بيتنا']],
    gram:{t:'Possessivartikel — tableau complet',
      b:['ich → <b>mein</b> · du → <b>dein</b> · er/es → <b>sein</b> · sie → <b>ihr</b>',
         'wir → <b>unser</b> · ihr → <b>euer</b> · sie/Sie → <b>ihr / Ihr</b>',
         'Puis on accorde comme <b>ein</b> : ein / eine / ein · eines / einer / einen'],
      tbl:[['','maskulin','feminin','neutrum','Plural'],
           ['Nominativ','mein','meine','mein','meine'],
           ['Akkusativ','mein<b>en</b>','meine','mein','meine']],
      ex:'<span class="de-in">Das ist <b>mein</b> Bruder.</span> · <span class="de-in">Ich sehe <b>meinen</b> Bruder.</span>'},
    exos:[{q:'«Das ist ___ Mutter.» (ma)',opts:['mein','meine','meinen','meiner'],a:1,
           why:'<span class="de-in">Mutter</span> est féminin → <b>meine</b>.'},
          {q:'«Ich habe ___ Bruder.» (mon, Akkusativ)',opts:['mein','meine','meinen','meiner'],a:2,
           why:'Akkusativ masculin → <b>meinen</b>.'},
          {q:'«___ Schwester ist nett.» (sa, à elle)',opts:['Sein','Ihre','Ihr','Seine'],a:1,
           why:'sie (elle) → <b>ihr</b> ; féminin → <b>ihre</b>.'},
          {q:'«Das ist ___ Haus.» (notre)',opts:['euer','unser','ihr','mein'],a:1,
           why:'wir → <b>unser</b>.'},
          {q:'«Wie heißt ___ Katze?» (ta)',opts:['dein','deine','deinen','deiner'],a:1,
           why:'<span class="de-in">Katze</span> féminin → <b>deine</b>.'}]},

  { n:3, de:'Personen beschreiben — Adjektive', ar:'وصف الأشخاص بالصفات', dur:60,
    obj:['الصفات الشائعة','الصفة بعد sein','الصفة قبل le nom (initiation)','النفي kein/nicht'],
    lex:[['groß','طويل / كبير'],['klein','قصير / صغير'],['jung','شاب'],['alt','مسنّ / قديم'],
         ['nett','لطيف'],['freundlich','ودود'],['lustig','مرح'],['ernst','جادّ'],
         ['fleißig','مجتهد'],['faul','كسول'],['schön','جميل'],['hübsch','حلو'],
         ['stark','قوي'],['schwach','ضعيف'],['ruhig','هادئ'],['laut','صاخب'],
         ['blond','أشقر'],['brünett','أسمر الشعر']],
    gram:{t:'L’adjectif attribut — toujours INVARIABLE',
      b:['Après <b>sein / werden / bleiben</b>, l’adjectif ne prend <u>aucune</u> terminaison :',
         '<span class="de-in">Mein Vater ist groß.</span> — <span class="de-in">Meine Mutter ist nett.</span>',
         'Contrairement au français : pas d’accord en genre ni en nombre !',
         'Négation : <span class="de-in">Mein Bruder ist <b>nicht</b> faul.</span> / <span class="de-in">Das ist <b>kein</b> Problem.</span>'],
      ex:'<span class="de-in">Meine Schwester ist <b>jung</b> und <b>lustig</b>.</span> = أختي شابة ومرحة.'},
    exos:[{q:'Complète : «Meine Oma ist ___ (مسنة).»',opts:['alte','alt','alten','altes'],a:1,
           why:'Après <b>sein</b>, l’adjectif est <b>invariable</b> → <span class="de-in">alt</span>.'},
          {q:'«Mein Vater ist ___ (لطيف).»',opts:['netter','nette','nett','nettes'],a:2,
           why:'Adjectif attribut invariable → <b>nett</b>.'},
          {q:'Quel est le contraire de «fleißig» ?',opts:['lustig','faul','ruhig','klein'],a:1,
           why:'<span class="de-in">fleißig</span> (مجتهد) ↔ <span class="de-in">faul</span> (كسول).'},
          {q:'Négation correcte : «Das ist ___ Problem.»',opts:['nicht','kein','nein','keine'],a:1,
           why:'<span class="de-in">Problem</span> est neutre → <b>kein</b>.'}]},

  { n:4, de:'Freunde und Freundschaft', ar:'الأصدقاء والصداقة', dur:60,
    obj:['مفردات الصداقة','الفعل gefallen','الأفعال مع الأصدقاء','الرأي äußern'],
    lex:[['der Freund','الصديق'],['die Freundin','الصديقة'],['die Freunde','الأصدقاء'],
         ['der Beste / die Beste','الأفضل'],['zusammen','معاً'],['gemeinsam','مشترك'],
         ['vertrauen','يثق بـ'],['helfen','يساعد (＋ Datif)'],['teilen','يتقاسم'],
         ['lachen','يضحك'],['spielen','يلعب'],['besuchen','يزور'],['anrufen','يتّصل بـ'],
         ['Das gefällt mir.','يعجبني هذا.'],['Ich mag dich.','أنا أحبّك (ودّياً).'],
         ['Mein bester Freund heißt Karim.','أفضل أصدقائي اسمه كريم.']],
    gram:{t:'gefallen + Datif · mögen + Akkusativ',
      b:['<span class="de-in">Das <b>gefällt mir</b>.</span> — يعجبني (mir = Datif)',
         '<span class="de-in">Ich <b>mag</b> dich.</span> — أحبّك (dich = Akkusativ)',
         '<span class="de-in">Ich <b>helfe meinem</b> Freund.</span> — helfen prend le <b>Datif</b>',
         'Pronoms Datif : mir · dir · ihm · ihr · uns · euch · ihnen · Ihnen'],
      tbl:[['Nominativ','ich','du','er','sie','wir','ihr','sie'],
           ['Akkusativ','mich','dich','ihn','sie','uns','euch','sie'],
           ['Dativ','mir','dir','ihm','ihr','uns','euch','ihnen']],
      ex:'<span class="de-in">Mein Freund hilft <b>mir</b>.</span> · <span class="de-in">Ich helfe <b>meinem</b> Freund.</span>'},
    exos:[{q:'«Das gefällt ___ .» (moi)',opts:['ich','mich','mir','mein'],a:2,
           why:'<span class="de-in">gefallen</span> régit le <b>Datif</b> → <b>mir</b>.'},
          {q:'«Ich helfe ___ Freund.»',opts:['mein','meine','meinem','meinen'],a:2,
           why:'<span class="de-in">helfen</span> + Datif masculin → <b>meinem</b>.'},
          {q:'«Ich mag ___ .» (toi)',opts:['du','dich','dir','dein'],a:1,
           why:'<span class="de-in">mögen</span> + Akkusativ → <b>dich</b>.'},
          {q:'Traduis : «أصدقائي يلعبون معي»',
           opts:['Meine Freunde spielen mit mir.','Meine Freunde spielt mit ich.',
                 'Mein Freunde spielen mit mich.','Meine Freund spielen mit mir.'],a:0,
           why:'Pluriel <span class="de-in">meine Freunde</span> + <span class="de-in">spielen</span> + Datif <span class="de-in">mit mir</span>.'}]},

  { n:5, de:'Textverständnis : «Die Familie Sommer»', ar:'فهم نص وصفي', dur:60,
    obj:['قراءة نص وصفي','استخراج المعلومات','الإجابة بجمل كاملة','الربط بين الألمانية والعربية'],
    texte:'<div class="reading"><p><b>Die Familie Sommer</b></p>'
        + '<p>Hallo! Ich heiße Julia Sommer. Ich bin 16 Jahre alt und ich komme aus Berlin. '
        + 'Ich wohne mit meiner Familie in einem Haus mit Garten.</p>'
        + '<p>Meine Familie ist nicht sehr groß. Mein Vater heißt Markus und ist 45 Jahre alt. '
        + 'Er ist Lehrer von Beruf. Meine Mutter heißt Sabine und ist 43 Jahre alt. Sie ist Ärztin.</p>'
        + '<p>Ich habe einen Bruder. Er heißt Tim und ist 12 Jahre alt. Tim ist sehr lustig, '
        + 'aber manchmal auch laut. Ich habe keine Schwester.</p>'
        + '<p>Meine Großeltern wohnen in München. Jeden Sommer besuchen wir sie. '
        + 'Meine beste Freundin heißt Lena. Wir gehen zusammen ins Kino und spielen Musik.</p></div>',
    exos:[{q:'Richtig oder Falsch : Julia habite à Munich.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Elle habite à <b>Berlin</b>. Munich = la ville de ses grands-parents.'},
          {q:'Richtig oder Falsch : Le père de Julia est médecin.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Son père est <span class="de-in">Lehrer</span> (أستاذ). C’est sa mère qui est <span class="de-in">Ärztin</span>.'},
          {q:'Richtig oder Falsch : Tim est le frère de Julia.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Ich habe einen Bruder. Er heißt Tim.</span>'},
          {q:'Richtig oder Falsch : Julia a une sœur.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Ich habe <b>keine</b> Schwester.</span>'},
          {q:'Quel âge a Tim ?',opts:['10','11','12','13'],a:2,
           why:'<span class="de-in">Er heißt Tim und ist 12 Jahre alt.</span>'},
          {q:'Qui est Lena ?',opts:['La sœur de Julia','La meilleure amie','La tante','La grand-mère'],a:1,
           why:'<span class="de-in">Meine beste Freundin heißt Lena.</span>'}]},

  { n:6, de:'Textproduktion — «Meine Familie und meine Freunde»', ar:'إنتاج كتابي ✍️ المهمة النهائية', dur:60,
    obj:['كتابة فقرة وصفية 6-8 أسطر','ترتيب الأفكار','استعمال Possessivartikel + Adjectifs','الربط und/aber'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب فقرة من <b>6 إلى 8 أسطر</b> '
           + 'تصف فيها عائلتك وأصدقاءك، مستعملاً :<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li>التعريف بنفسك (الاسم، العمر، المدينة)</li>'
           + '<li>عدد أفراد العائلة + أسماؤهم وأعمارهم</li>'
           + '<li>صفة واحدة على الأقل لكل شخص</li>'
           + '<li>صديقك المقرّب ونشاطاتكما معاً</li>'
           + '<li>الرابطان <span class="de-in">und</span> و <span class="de-in">aber</span></li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Hallo! Ich heiße Yacine und ich bin 16 Jahre alt. Ich komme aus Algerien '
         + 'und ich wohne in Bouira.</p>'
         + '<p>Meine Familie ist klein. Mein Vater heißt Karim und ist 48 Jahre alt. Er ist '
         + 'lehrer und sehr fleißig. Meine Mutter heißt Fatima. Sie ist nett und kocht gern.</p>'
         + '<p>Ich habe einen Bruder und eine Schwester. Mein Bruder Amin ist 12 Jahre alt. '
         + 'Er ist lustig, aber manchmal laut. Meine Schwester Sara ist 9 Jahre alt und sehr ruhig.</p>'
         + '<p>Mein bester Freund heißt Sofiane. Wir spielen zusammen Fußball und wir lernen '
         + 'Deutsch. Ich mag meine Familie und meine Freunde sehr.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب فقرتك هنا (سيصححها الأستاذ الافتراضي):',ph:'Hallo! Ich heiße … Meine Familie …'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي', dur:60,
    obj:['مراجعة شاملة للوحدة 2','التقويم الذاتي','التصحيح الجماعي','التحضير للفرض'],
    exos:[{q:'«Das ist ___ Vater.» (mon)',opts:['meine','mein','meinen','meiner'],a:1,
           why:'Nominatif masculin → <b>mein</b>.'},
          {q:'«Ich sehe ___ Schwester.» (ma, Akk.)',opts:['mein','meine','meinen','meinem'],a:1,
           why:'Féminin : identique au nominatif → <b>meine</b>.'},
          {q:'«___ Großeltern wohnen in Oran.» (mes)',opts:['Mein','Meine','Meinen','Meiner'],a:1,
           why:'Pluriel → <b>meine</b>.'},
          {q:'L’adjectif après «sein» :',
           opts:['prend -e au féminin','prend -en à l’Akkusativ','reste invariable','prend -s au pluriel'],a:2,
           why:'Adjectif <b>attribut</b> = toujours invariable en allemand.'},
          {q:'«Das gefällt ___ .» (à nous)',opts:['wir','uns','unser','unsere'],a:1,
           why:'Datif pluriel → <b>uns</b>.'},
          {q:'Contraire de «groß» :',opts:['nett','klein','alt','jung'],a:1,
           why:'<span class="de-in">groß ↔ klein</span>.'},
          {q:'«die Geschwister» =',opts:['الأجداد','الوالدان','الإخوة','الأعمام'],a:2,
           why:'<span class="de-in">die Geschwister</span> = الإخوة والأخوات.'},
          {q:'Complète : «Meine Oma ist ___ (طويلة).»',opts:['große','groß','großen','großes'],a:1,
           why:'Attribut → invariable : <b>groß</b>.'}]},

  { n:8, de:'Évaluation de l’unité 2 📝', ar:'فرض الوحدة 2', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي + سلّم التنقيط'], ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 2 (/20) ══════════ */
const DEVOIR_U2 = {
  titre:'Évaluation — Einheit 2 : Familie und Freunde',
  unite:2, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Die Familie Sommer</b></p>'
          + '<p>Hallo! Ich heiße Julia Sommer. Ich bin 16 Jahre alt und ich komme aus Berlin. '
          + 'Ich wohne mit meiner Familie in einem Haus mit Garten. Meine Familie ist nicht sehr groß. '
          + 'Mein Vater heißt Markus und ist 45 Jahre alt. Er ist Lehrer von Beruf. '
          + 'Meine Mutter heißt Sabine und ist 43 Jahre alt. Sie ist Ärztin. '
          + 'Ich habe einen Bruder. Er heißt Tim und ist 12 Jahre alt. Tim ist sehr lustig, '
          + 'aber manchmal auch laut. Ich habe keine Schwester. Meine Großeltern wohnen in München. '
          + 'Jeden Sommer besuchen wir sie. Meine beste Freundin heißt Lena. '
          + 'Wir gehen zusammen ins Kino und spielen Musik.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Julia wohnt in München.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich komme aus Berlin.</span> Ses grands-parents habitent Munich.'},
        {id:'I.2',type:'vf',t:'Julias Vater ist Lehrer.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Er ist Lehrer von Beruf.</span>'},
        {id:'I.3',type:'vf',t:'Julia hat zwei Brüder.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich habe <b>einen</b> Bruder.</span> — أخ واحد فقط.'},
        {id:'I.4',type:'vf',t:'Tim ist lustig, aber manchmal laut.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Tim ist sehr lustig, aber manchmal auch laut.</span>'},
        {id:'I.5',type:'txt',t:'Wie heißt Julias Mutter?',pts:2,rep:'Sie heißt Sabine.',
         just:'<span class="de-in">Meine Mutter heißt Sabine.</span>',key:['sabine']},
        {id:'I.6',type:'txt',t:'Was macht Julia mit Lena?',pts:2,
         rep:'Sie gehen ins Kino und spielen Musik.',
         just:'<span class="de-in">Wir gehen zusammen ins Kino und spielen Musik.</span>',
         key:['kino','musik']}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Das ist ___ Mutter.» (ma)',
         opts:['mein','meine','meinen','meiner'],a:1,pts:1,
         why:'<span class="de-in">Mutter</span> féminin → <b>meine</b>.'},
        {id:'II.2',type:'qcm',t:'«Ich habe ___ Bruder.» (mon, Akkusativ)',
         opts:['mein','meine','meinen','meinem'],a:2,pts:1,
         why:'Akkusativ masculin → <b>meinen</b>.'},
        {id:'II.3',type:'qcm',t:'«___ Schwester ist sehr nett.» (sa, à elle)',
         opts:['Sein','Seine','Ihr','Ihre'],a:3,pts:1,
         why:'sie (elle) → ihr ; féminin → <b>Ihre</b>.'},
        {id:'II.4',type:'qcm',t:'«Das gefällt ___ .» (moi)',
         opts:['ich','mich','mir','mein'],a:2,pts:1,
         why:'<span class="de-in">gefallen</span> + <b>Datif</b> → <b>mir</b>.'},
        {id:'II.5',type:'txt',t:'Complète : «___ Vater ist Lehrer.» (notre)',pts:1,
         rep:'Unser',key:['unser'],just:'wir → <b>unser</b>.'},
        {id:'II.6',type:'txt',t:'Contraire de «groß» :',pts:1,rep:'klein',
         key:['klein'],just:'<span class="de-in">groß ↔ klein</span>.'},
        {id:'II.7',type:'txt',t:'Traduis : «أختي صغيرة ولطيفة»',pts:1,
         rep:'Meine Schwester ist klein und nett.',key:['schwester ist klein'],
         just:'Adjectif attribut <b>invariable</b> après sein.'},
        {id:'II.8',type:'txt',t:'Traduis : «ليس لديّ إخوة»',pts:1,
         rep:'Ich habe keine Geschwister.',key:['keine geschwister','keine bruder'],
         just:'Négation du nom sans article → <b>kein/keine</b>.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 6 أسطر تصف فيها عائلتك وصديقك المقرّب '
           + '(الأسماء، الأعمار، صفة لكل شخص، نشاط مشترك).',
         grille:[['استعمال صحيح لأدوات الملكية (mein/dein/sein/ihr)','1.0'],
                 ['صفتان على الأقل بعد sein (invariables)','1.0'],
                 ['مفردات العائلة (5 كلمات على الأقل)','0.5'],
                 ['الرابطان und / aber','0.5'],
                 ['الإملاء، علامات الترقيم، المajuscule','1.0']],
         modele:'<div class="reading"><p>Ich heiße Yacine und ich bin 16 Jahre alt. '
              + 'Meine Familie ist klein. Mein Vater heißt Karim und ist 48 Jahre alt. '
              + 'Er ist sehr fleißig. Meine Mutter heißt Fatima. Sie ist nett und kocht gern. '
              + 'Ich habe einen Bruder und eine Schwester. Mein Bruder ist lustig, aber manchmal laut. '
              + 'Mein bester Freund heißt Sofiane. Wir spielen zusammen Fußball und wir lernen Deutsch. '
              + 'Ich mag meine Familie sehr.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET (pour assets/bdd + export) ══════════ */
const CORRIGE_U2 = {
  unite: 2,
  titre: 'التصحيح النموذجي — الوحدة 2 : Familie und Freunde',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Julia kommt aus Berlin — leurs grands-parents habitent München.' },
    { id:'I.2', reponse:'Richtig', justification:'Er ist Lehrer von Beruf.' },
    { id:'I.3', reponse:'Falsch', justification:'Ich habe einen Bruder (un seul).' },
    { id:'I.4', reponse:'Richtig', justification:'Tim ist sehr lustig, aber manchmal auch laut.' },
    { id:'I.5', reponse:'Sie heißt Sabine.', justification:'Meine Mutter heißt Sabine.' },
    { id:'I.6', reponse:'Sie gehen ins Kino und spielen Musik.', justification:'Wir gehen zusammen ins Kino und spielen Musik.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'meine', regle:'Mutter = féminin → meine' },
    { id:'II.2', reponse:'meinen', regle:'Akkusativ masculin → meinen' },
    { id:'II.3', reponse:'Ihre', regle:'sie (elle) → ihr ; Schwester féminin → Ihre' },
    { id:'II.4', reponse:'mir', regle:'gefallen + Datif' },
    { id:'II.5', reponse:'Unser', regle:'wir → unser' },
    { id:'II.6', reponse:'klein', regle:'antonymes : groß ↔ klein' },
    { id:'II.7', reponse:'Meine Schwester ist klein und nett.', regle:'adjectif attribut invariable' },
    { id:'II.8', reponse:'Ich habe keine Geschwister.', regle:'négation du nom → kein/keine' }
  ],
  partie_III: {
    bareme: [['Possessivartikel corrects','1.0'],['2 adjectifs attributs invariables','1.0'],
             ['5 mots du vocabulaire famille','0.5'],['Connecteurs und / aber','0.5'],
             ['Orthographe + majuscules + ponctuation','1.0']],
    modele: 'Ich heiße Yacine und ich bin 16 Jahre alt. Meine Familie ist klein. '
          + 'Mein Vater heißt Karim und ist 48 Jahre alt. Er ist sehr fleißig. '
          + 'Meine Mutter heißt Fatima. Sie ist nett und kocht gern. Ich habe einen Bruder '
          + 'und eine Schwester. Mein Bruder ist lustig, aber manchmal laut. Mein bester Freund '
          + 'heißt Sofiane. Wir spielen zusammen Fußball und wir lernen Deutsch. '
          + 'Ich mag meine Familie sehr.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 2 🔁' }
  },
  erreurs_frequentes: [
    '~~Meine Mutter ist nette~~ → <b>nett</b> (adjectif attribut invariable)',
    '~~Ich habe ein Bruder~~ → <b>einen</b> Bruder (Akkusativ masculin)',
    '~~Das gefällt mich~~ → Das gefällt <b>mir</b> (Datif)',
    '~~Ich habe nicht Schwester~~ → Ich habe <b>keine</b> Schwester',
    '~~Sein Schwester~~ → <b>Seine</b> Schwester (accord en genre)'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE2 = { meta: UNITE2_META, seances: SEANCES_U2, devoir: DEVOIR_U2, corrige: CORRIGE_U2 };
