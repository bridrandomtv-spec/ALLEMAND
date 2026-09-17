/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unites3as_a.js
   السنة الثالثة ثانوي · 3AS — Lot A : unités 1 → 5
   1. Persönlichkeit und Identität      4. Wissenschaft und Technologie
   2. Staatsbürgerschaft                5. Wirtschaft und Arbeit
   3. Leben in der Gesellschaft
   Chaque unité : 4 séances + devoir officiel /20 (I/8 · II/8 · III/4)
   + corrigé détaillé + erreurs fréquentes · CEFR B1 → B2
   Programme officiel MEN · préparation au Baccalauréat
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* ══════════ UNITÉ 1 — Persönlichkeit und Identität ══════════ */
const U3AS_1 = {
  meta: { n:1, niveau:'3AS', de:'Persönlichkeit und Identität', ar:'الشخصية والهوية',
    trimestre:1, periode:'سبتمبر — أكتوبر', duree_totale:240, cecrl:'B1',
    icon:'🪞',
    objectifs:['وصف الشخصية والصفات','استعمال الجمل الموصولة في كل الحالات',
               'فهم نص حول الهوية المزدوجة','إنتاج نص وصفي-تحليلي من 12 سطراً'],
    competences:['Leseverstehen','Schreiben','Sprechen','Hörverstehen'],
    vocabulaire_cle:['die Persönlichkeit','die Identität','der Charakter','die Eigenschaft',
                     'selbstbewusst','zuverlässig'],
    grammaire_cle:['Relativsätze (4 cas)','Adjektivdeklination','Partizip I/II',
                   'Komparativ/Superlativ'] },

  seances: [
    { n:1, de:'Charaktereigenschaften', ar:'صفات الشخصية', dur:60,
      obj:['12 صفة شخصية','تصريف الصفة بعد der/die/das و ein/eine','المقارنة والتفضيل'],
      lex:[['die Persönlichkeit','الشخصية'],['die Identität','الهوية'],
           ['der Charakter','الطبع'],['die Eigenschaft','الصفة'],
           ['selbstbewusst','واثق من نفسه'],['zuverlässig','موثوق'],
           ['hilfsbereit','محبّ للمساعدة'],['ehrgeizig','طموح'],
           ['geduldig','صبور'],['humorvoll','مرح'],['schüchtern','خجول'],
           ['stur','عنيد'],['offen','منفتح'],['ordentlich','منظّم']],
      gram:{t:'Adjektivdeklination + Komparativ/Superlativ',
        b:['Après <b>der/die/das</b> : terminaison faible <b>-e</b> (Nominativ sg) ou <b>-en</b>.',
           'Après <b>ein/eine</b> : terminaison forte au Nominativ masculin/neutre (<b>-er</b>, <b>-es</b>).',
           'Comparatif : <span class="de-in">ehrgeizig → ehrgeizig<b>er</b> … <b>als</b></span>',
           'Superlatif : <span class="de-in">am ehrgeizig<b>sten</b></span> · '
         + '<span class="de-in">der ehrgeizig<b>ste</b> Schüler</span>',
           '⚠️ Irréguliers : gut → <b>besser</b> → am <b>besten</b> · viel → <b>mehr</b> → am <b>meisten</b> '
         + '· gern → <b>lieber</b> → am <b>liebsten</b>'],
        tbl:[['Nominativ m.','der gute / ein guter Mann'],
             ['Nominativ f.','die gute / eine gute Frau'],
             ['Nominativ n.','das gute / ein gutes Kind'],
             ['Akkusativ m.','den guten / einen guten Mann'],
             ['Dativ m.','dem guten / einem guten Mann'],
             ['Plural','die guten / gute Kinder']],
        ex:'<span class="de-in">Er ist <b>zuverlässiger als</b> sein Bruder und '
         + '<b>am ehrgeizigsten</b> von allen.</span>'},
      exos:[{q:'«Das ist ___ nette Kollegin.» (eine)',
             opts:['eine nette','ein nette','eine netten','einen nette'],a:0,
             why:'Nominativ féminin après eine → <b>-e</b>.'},
            {q:'«Er ist ___ (ehrgeizig) als ich.»',opts:['ehrgeiziger','ehrgeizigster',
                                                        'mehr ehrgeizig','am ehrgeizigsten'],a:0,
             why:'Comparatif = adjectif + <b>-er</b> + <b>als</b>.'},
            {q:'Superlatif de «gut» :',opts:['guter','am besten','am gutsten','bester'],a:1,
             why:'Irrégulier : gut → besser → <b>am besten</b>.'},
            {q:'«mit ___ fleißigen Schülern» (Dativ pluriel)',
             opts:['den','dem','der','die'],a:0,
             why:'Datif pluriel après article défini → <b>den</b> (+ -n au nom).'},
            {q:'«Sie ist ___ (schüchtern) von allen.»',
             opts:['schüchternste','am schüchternsten','schüchterner','die schüchternste'],a:1,
             why:'Superlatif attributif → <b>am … -sten</b>.'}]},

    { n:2, de:'Relativsätze in allen Kasus', ar:'الجمل الموصولة في كل الحالات', dur:60,
      obj:['بناء جملة موصولة في 4 حالات','الضمائر الموصولة avec préposition','dessen/deren'],
      lex:[['der, die, das, die','الذي، التي، اللذان…'],['dessen','الذي له (م/ن)'],
           ['deren','التي لها / الذين لهم'],['wo(r)-+ préposition','للأشياء'],
           ['derjenige, diejenige','ذلك الذي'],['was','ما (بعد das/alles)']],
      gram:{t:'Le pronom relatif : genre et nombre ← antécédent · cas ← fonction dans la relative',
        tbl:[['','maskulin','feminin','neutrum','Plural'],
             ['Nominativ','der','die','das','die'],
             ['Akkusativ','den','die','das','die'],
             ['Dativ','dem','der','dem','denen'],
             ['Genitiv','dessen','deren','dessen','deren']],
        b:['La relative est une <b>subordonnée</b> : le verbe conjugué va <b>à la fin</b>.',
           'Avec préposition, celle-ci se place <b>devant</b> le relatif : '
         + '<span class="de-in">der Mann, <b>mit dem</b> ich arbeite</span>',
           'Pour les choses, on peut employer <b>wo(r)-</b> : '
         + '<span class="de-in">die Stadt, <b>in der</b> / <b>wo</b> ich wohne</span>',
           'Après <span class="de-in">das / alles / nichts / etwas</span> → relatif <b>was</b>.'],
        ex:'<span class="de-in">Die Schüler<b>in</b>, <b>deren</b> Essay am besten war, '
         + 'hat ein Stipendium bekommen.</span>'},
      exos:[{q:'«Der Mann, ___ ich gestern getroffen habe, ist mein Lehrer.»',
             opts:['den','der','dem','dessen'],a:0,
             why:'« que » = COD dans la relative → <b>Akkusativ</b> masculin → <b>den</b>.'},
            {q:'«Die Frau, ___ Auto kaputt ist, ruft den Pannendienst.»',
             opts:['deren','dessen','der','dem'],a:0,
             why:'Génitif féminin → <b>deren</b> (invariable).'},
            {q:'«Das ist der Stift, ___ ich schreibe.»',
             opts:['mit dem','mit den','mit der','mit das'],a:0,
             why:'Préposition + Datif masculin → <b>mit dem</b>.'},
            {q:'«Alles, ___ er sagt, ist falsch.»',opts:['was','das','dass','welches'],a:0,
             why:'Après <b>alles</b> → relatif <b>was</b>.'},
            {q:'«Die Kinder, ___ ich danke, sind sehr nett.»',
             opts:['denen','deren','den','dem'],a:0,
             why:'Datif pluriel → <b>denen</b>.'},
            {q:'Quelle phrase est correcte ?',
             opts:['Das Buch, das ich habe gelesen, ist gut.',
                   'Das Buch, das ich gelesen habe, ist gut.',
                   'Das Buch, ich das gelesen habe, ist gut.',
                   'Das Buch, das habe ich gelesen, ist gut.'],a:1,
             why:'Dans la relative, le verbe conjugué est <b>à la fin</b>.'}]},

    { n:3, de:'Textverständnis : «Identität in zwei Kulturen»', ar:'فهم نص — الهوية في ثقافتين', dur:60,
      obj:['قراءة نص تحليلي','استخراج الحجج والأمثلة','repérage des connecteurs','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Identität in zwei Kulturen</b></p>'
          + '<p>Yacine ist 18 Jahre alt und lebt seit sechs Jahren in Köln. Geboren wurde er '
          + 'in Béjaïa, wo seine Großeltern noch heute wohnen. Zu Hause spricht die Familie '
          + 'Kabylisch und Arabisch, in der Schule und mit seinen Freunden ausschließlich Deutsch.</p>'
          + '<p>«Am Anfang war es schwer», erzählt er. «Ich habe mich weder ganz deutsch noch '
          + 'ganz algerisch gefühlt.» Inzwischen sieht er das anders: Für ihn ist die doppelte '
          + 'Zugehörigkeit kein Problem, sondern ein Vorteil. «Ich kann zwischen zwei Welten '
          + 'vermitteln», sagt er stolz.</p>'
          + '<p>Seine Lehrerin bestätigt, dass zweisprachige Schüler oft flexibler denken. '
          + 'Studien zeigen außerdem, dass Menschen mit Migrationshintergrund im Berufsleben '
          + 'zunehmend gefragt sind — gerade im Handel mit Nordafrika und im Gesundheitswesen.</p>'
          + '<p>Trotzdem räumt Yacine ein, dass er manchmal Vorurteile erlebt. «Wenn jemand '
          + 'hört, woher ich komme, ändert sich oft sein Ton.» Er wünscht sich, dass man ihn '
          + 'zuerst als Person wahrnimmt und nicht als Herkunft.»</p></div>',
      exos:[{q:'Richtig oder Falsch : Yacine ist in Köln geboren.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">Geboren wurde er in <b>Béjaïa</b>.</span>'},
            {q:'Richtig oder Falsch : Zu Hause spricht die Familie nur Deutsch.',
             opts:['Richtig','Falsch'],a:1,
             why:'Zu Hause : Kabylisch und Arabisch. Deutsch nur in der Schule und mit Freunden.'},
            {q:'Richtig oder Falsch : Yacine sieht die doppelte Zugehörigkeit heute als Vorteil.',
             opts:['Richtig','Falsch'],a:0,
             why:'<span class="de-in">Für ihn ist die doppelte Zugehörigkeit kein Problem, '
               + 'sondern ein Vorteil.</span>'},
            {q:'Was bestätigt seine Lehrerin?',
             opts:['Dass zweisprachige Schüler oft flexibler denken.',
                   'Dass Yacine die beste Note hat.',
                   'Dass er bald nach Algerien zurückkehrt.',
                   'Dass Deutsch zu schwer ist.'],a:0,
             why:'<span class="de-in">Seine Lehrerin bestätigt, dass zweisprachige Schüler '
               + 'oft flexibler denken.</span>'},
            {q:'Welcher Konnektor drückt einen Gegensatz aus?',
             opts:['Trotzdem','Außerdem','Zuerst','Inzwischen'],a:0,
             why:'<span class="de-in"><b>Trotzdem</b></span> = رغم ذلك (position 1, verbe en 2).'},
            {q:'Was wünscht sich Yacine?',
             opts:['Dass man ihn zuerst als Person wahrnimmt.',
                   'Dass er nach Béjaïa umzieht.',
                   'Dass alle Kabylisch lernen.',
                   'Dass er nicht mehr arbeiten muss.'],a:0,
             why:'<span class="de-in">Er wünscht sich, dass man ihn zuerst als Person '
               + 'wahrnimmt und nicht als Herkunft.</span>'}]},

    { n:4, de:'Textproduktion — «Wer bin ich?»', ar:'إنتاج كتابي ✍️ من أكون؟', dur:60,
      obj:['كتابة نص وصفي-تحليلي 12 سطراً','3 جمل موصولة','comparatif + superlatif','connecteurs logiques'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً من '
          + '<b>10 إلى 12 سطراً</b> تصف فيه شخصيتك وهويتك، مع احترام الشروط :'
          + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
          + '<li><b>6 صفات شخصية</b> مصرّفة بشكل صحيح (Adjektivdeklination)</li>'
          + '<li><b>3 جمل موصولة</b> في حالات مختلفة (Nominativ · Akkusativ · Dativ)</li>'
          + '<li><b>1 مقارنة</b> (… als) و <b>1 تفضيل</b> (am … -sten)</li>'
          + '<li><b>3 روابط منطقية</b> : weil · obwohl · trotzdem · deshalb</li>'
          + '<li>خاتمة تعبّر عن أمنيتك للمستقبل (Konjunktiv II : Ich würde gern …)</li>'
          + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
           + '<p>Ich heiße Yacine und bin 18 Jahre alt. Wenn ich mich beschreiben müsste, '
           + 'würde ich sagen, dass ich ein zuverlässiger und ehrgeiziger Schüler bin. '
           + 'Meine Freunde halten mich für einen humorvollen Menschen, der immer eine '
           + 'gute Idee hat.</p>'
           + '<p>Manchmal bin ich allerdings auch ein bisschen stur, weil ich meine Meinung '
           + 'gern verteidige. Trotzdem versuche ich, offen für andere zu bleiben. '
           + 'Die Eigenschaft, auf die ich am stolzesten bin, ist meine Geduld: '
           + 'Ich kann stundenlang an einer schwierigen Aufgabe arbeiten.</p>'
           + '<p>Was meine Identität betrifft, fühle ich mich als Algerier, der in zwei '
           + 'Kulturen zu Hause ist. Obwohl ich in Béjaïa geboren wurde, spreche ich heute '
           + 'Deutsch fast so fließend wie Arabisch. Deshalb glaube ich, dass ich später '
           + 'zwischen beiden Welten vermitteln kann.</p>'
           + '<p>Der Mensch, der mich am meisten geprägt hat, ist mein Großvater, '
           + 'mit dem ich jeden Sommer die Oliven geerntet habe. Wenn ich die Wahl hätte, '
           + 'würde ich gern Dolmetscher werden, denn Sprachen sind die Brücke, '
           + 'die Menschen verbindet.</p></div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك هنا (سيصححه الأستاذ الافتراضي):',
             ph:'Ich heiße … Wenn ich mich beschreiben müsste, würde ich sagen, dass …'}]}
  ],

  devoir: {
    titre:'Évaluation — 3AS Einheit 1 : Persönlichkeit und Identität',
    unite:1, niveau:'3AS', duree:60, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
        texte:'<div class="reading"><p><b>Identität in zwei Kulturen</b></p>'
            + '<p>Yacine ist 18 Jahre alt und lebt seit sechs Jahren in Köln. Geboren wurde er '
            + 'in Béjaïa, wo seine Großeltern noch heute wohnen. Zu Hause spricht die Familie '
            + 'Kabylisch und Arabisch, in der Schule und mit seinen Freunden ausschließlich Deutsch.</p>'
            + '<p>«Am Anfang war es schwer», erzählt er. «Ich habe mich weder ganz deutsch noch '
            + 'ganz algerisch gefühlt.» Inzwischen sieht er das anders: Für ihn ist die doppelte '
            + 'Zugehörigkeit kein Problem, sondern ein Vorteil. «Ich kann zwischen zwei Welten '
            + 'vermitteln», sagt er stolz.</p>'
            + '<p>Seine Lehrerin bestätigt, dass zweisprachige Schüler oft flexibler denken. '
            + 'Studien zeigen außerdem, dass Menschen mit Migrationshintergrund im Berufsleben '
            + 'zunehmend gefragt sind — gerade im Handel mit Nordafrika und im Gesundheitswesen.</p>'
            + '<p>Trotzdem räumt Yacine ein, dass er manchmal Vorurteile erlebt. Er wünscht sich, '
            + 'dass man ihn zuerst als Person wahrnimmt und nicht als Herkunft.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Yacine ist in Köln geboren.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Geboren wurde er in <b>Béjaïa</b>.</span>'},
          {id:'I.2',type:'vf',t:'Zu Hause spricht die Familie nur Deutsch.',pts:1,rep:'Falsch',
           just:'Zu Hause : Kabylisch und Arabisch — Deutsch nur in der Schule.'},
          {id:'I.3',type:'vf',t:'Yacine betrachtet die doppelte Zugehörigkeit als Vorteil.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… kein Problem, sondern ein Vorteil.</span>'},
          {id:'I.4',type:'vf',t:'Laut Studien sind zweisprachige Menschen im Berufsleben gefragt.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Studien zeigen außerdem, dass Menschen mit '
             + 'Migrationshintergrund im Berufsleben zunehmend gefragt sind.</span>'},
          {id:'I.5',type:'txt',t:'Was bestätigt Yacines Lehrerin?',pts:2,
           rep:'Sie bestätigt, dass zweisprachige Schüler oft flexibler denken.',
           key:['flexibler','zweisprachig'],
           just:'<span class="de-in">… dass zweisprachige Schüler oft flexibler denken.</span>'},
          {id:'I.6',type:'txt',t:'Was wünscht sich Yacine am Ende des Textes?',pts:2,
           rep:'Er wünscht sich, dass man ihn zuerst als Person wahrnimmt und nicht als Herkunft.',
           key:['person','herkunft'],
           just:'Dernière phrase du texte.'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Der Mann, ___ ich gestern getroffen habe, ist mein Lehrer.»',
           opts:['den','der','dem','dessen'],a:0,pts:1,
           why:'COD dans la relative → Akkusativ masculin → <b>den</b>.'},
          {id:'II.2',type:'qcm',t:'«Die Frau, ___ Auto kaputt ist, ruft den Pannendienst.»',
           opts:['deren','dessen','der','dem'],a:0,pts:1,
           why:'Génitif féminin → <b>deren</b>.'},
          {id:'II.3',type:'qcm',t:'«Das ist der Stift, ___ ich schreibe.»',
           opts:['mit dem','mit den','mit der','mit das'],a:0,pts:1,
           why:'Préposition + Datif masculin → <b>mit dem</b>.'},
          {id:'II.4',type:'qcm',t:'«Er ist ___ (ehrgeizig) als sein Bruder.»',
           opts:['ehrgeiziger','ehrgeizigster','mehr ehrgeizig','am ehrgeizigsten'],a:0,pts:1,
           why:'Comparatif = -er + <b>als</b>.'},
          {id:'II.5',type:'txt',t:'Complète : «Alles, ___ er sagt, ist falsch.»',pts:1,rep:'was',
           key:['was'],just:'Après <b>alles</b> → relatif <b>was</b>.'},
          {id:'II.6',type:'txt',t:'Superlatif de «gut» (attribut) :',pts:1,rep:'am besten',
           key:['am besten'],just:'Irrégulier : gut → besser → <b>am besten</b>.'},
          {id:'II.7',type:'txt',t:'Traduis : «التلميذة التي مقالها هو الأفضل»',pts:1,
           rep:'Die Schülerin, deren Essay am besten ist.',key:['deren','essay'],
           just:'Génitif féminin → <b>deren</b> · superlatif <b>am besten</b>.'},
          {id:'II.8',type:'txt',t:'Relie avec «obwohl» : «Er ist müde. Er lernt weiter.»',pts:1,
           rep:'Obwohl er müde ist, lernt er weiter.',key:['obwohl'],
           just:'<b>obwohl</b> + subordonnée (verbe final), puis verbe en 2ᵉ position.'}
        ]},
      { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً من 10 أسطر تصف فيه شخصيتك : 6 صفات مصرّفة، 3 جمل موصولة، '
             + 'مقارنة وتفضيل، رابطان منطقيان، وخاتمة بأمنية (Ich würde gern …).',
           grille:[['6 صفات شخصية مصرّفة صحياً (Adjektivdeklination)','0.5'],
                   ['3 جمل موصولة في حالات مختلفة','1.0'],
                   ['1 مقارنة (… als) + 1 تفضيل (am … -sten)','0.5'],
                   ['2 رابط منطقي (weil / obwohl / trotzdem / deshalb)','0.5'],
                   ['خاتمة بـ Konjunktiv II (Ich würde gern …)','0.5'],
                   ['مفردات الوحدة (8 كلمات على الأقل)','0.5'],
                   ['الإملاء، المajuscules، علامات الترقيم','0.5']],
           modele:'<div class="reading"><p>Ich heiße Yacine und bin 18 Jahre alt. '
                + 'Wenn ich mich beschreiben müsste, würde ich sagen, dass ich ein '
                + 'zuverlässiger und ehrgeiziger Schüler bin. Meine Freunde halten mich '
                + 'für einen humorvollen Menschen, der immer eine gute Idee hat.</p>'
                + '<p>Manchmal bin ich allerdings auch ein bisschen stur, weil ich meine '
                + 'Meinung gern verteidige. Trotzdem versuche ich, offen für andere zu '
                + 'bleiben. Die Eigenschaft, auf die ich am stolzesten bin, ist meine Geduld.</p>'
                + '<p>Obwohl ich in Béjaïa geboren wurde, spreche ich heute Deutsch fast so '
                + 'fließend wie Arabisch. Der Mensch, der mich am meisten geprägt hat, ist '
                + 'mein Großvater, mit dem ich jeden Sommer die Oliven geerntet habe. '
                + 'Wenn ich die Wahl hätte, würde ich gern Dolmetscher werden.</p></div>'}
        ]}
    ]
  },

  corrige: {
    unite:1, niveau:'3AS',
    titre:'التصحيح النموذجي — 3AS الوحدة 1 : Persönlichkeit und Identität',
    bareme:{ I:8, II:8, III:4, total:20 },
    partie_I:[
      {id:'I.1',reponse:'Falsch',justification:'Geboren wurde er in Béjaïa.'},
      {id:'I.2',reponse:'Falsch',justification:'Zu Hause : Kabylisch und Arabisch.'},
      {id:'I.3',reponse:'Richtig',justification:'… kein Problem, sondern ein Vorteil.'},
      {id:'I.4',reponse:'Richtig',justification:'Studien zeigen … zunehmend gefragt.'},
      {id:'I.5',reponse:'Dass zweisprachige Schüler oft flexibler denken.',justification:'3ᵉ paragraphe.'},
      {id:'I.6',reponse:'Dass man ihn zuerst als Person wahrnimmt und nicht als Herkunft.',justification:'Dernière phrase.'}
    ],
    partie_II:[
      {id:'II.1',reponse:'den',regle:'Akkusativ masculin dans la relative'},
      {id:'II.2',reponse:'deren',regle:'Génitif féminin, invariable'},
      {id:'II.3',reponse:'mit dem',regle:'Préposition + Datif masculin'},
      {id:'II.4',reponse:'ehrgeiziger',regle:'Comparatif = -er + als'},
      {id:'II.5',reponse:'was',regle:'Après alles → was'},
      {id:'II.6',reponse:'am besten',regle:'Irrégulier : gut → besser → am besten'},
      {id:'II.7',reponse:'Die Schülerin, deren Essay am besten ist.',regle:'Génitif féminin + superlatif'},
      {id:'II.8',reponse:'Obwohl er müde ist, lernt er weiter.',regle:'obwohl + verbe final'}
    ],
    partie_III:{
      bareme:[['6 صفات مصرّفة','0.5'],['3 جمل موصولة','1.0'],['comparatif + superlatif','0.5'],
              ['2 رابط منطقي','0.5'],['خاتمة Konjunktiv II','0.5'],['مفردات الوحدة','0.5'],
              ['إملاء + Mmajuscules','0.5']],
      modele:'Ich heiße Yacine und bin 18 Jahre alt. Ich bin ein zuverlässiger und ehrgeiziger '
           + 'Schüler. Meine Freunde halten mich für einen humorvollen Menschen, der immer eine '
           + 'gute Idee hat. Obwohl ich manchmal stur bin, versuche ich, offen zu bleiben. '
           + 'Die Eigenschaft, auf die ich am stolzesten bin, ist meine Geduld. Der Mensch, '
           + 'der mich am meisten geprägt hat, ist mein Großvater. Wenn ich die Wahl hätte, '
           + 'würde ich gern Dolmetscher werden.',
      seuils:{'16-20':'ممتاز — Sehr gut 🏆','14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖','0-9.9':'يحتاج مراجعة الوحدة 🔁'}
    },
    erreurs_frequentes:[
      '~~Der Mann, der ich getroffen habe~~ → COD dans la relative → <b>den</b> ich getroffen habe.',
      '~~dem sein Auto~~ (oral incorrect) → génitif : <b>dessen</b> Auto (m/n) · <b>deren</b> Auto (f/pl).',
      '~~ehrgeiziger als mein Bruder ist~~ → pas de verbe après <b>als</b> dans une comparaison simple.',
      '~~am gutsten / guter~~ → irrégulier : gut → <b>besser</b> → <b>am besten</b>.',
      '~~ein gute Idee~~ → Nominativ féminin après ein → ein<b>e</b> gut<b>e</b> Idee.',
      '~~das Buch, das ich habe gelesen~~ → dans la relative, TOUT le bloc verbal va à la fin.',
      '~~Alles, das er sagt~~ → après <b>alles / nichts / etwas</b> → relatif <b>was</b>.',
      '~~Obwohl er ist müde~~ → subordonnée : verbe <b>à la fin</b> → Obwohl er müde <b>ist</b>.'
    ]
  }
};

/* ══════════ UNITÉ 2 — Staatsbürgerschaft ══════════ */
const U3AS_2 = {
  meta: { n:2, niveau:'3AS', de:'Staatsbürgerschaft', ar:'المواطنة',
    trimestre:1, periode:'نوفمبر — ديسمبر', duree_totale:240, cecrl:'B1',
    icon:'🏛️',
    objectifs:['التعبير عن الحقوق والواجبات','استعمال المبني للمجهول','فهم نص قانوني مبسّط',
               'إنتاج نص حجاجي من 12 سطراً'],
    competences:['Leseverstehen','Schreiben','Sprechen','Hörverstehen'],
    vocabulaire_cle:['die Staatsbürgerschaft','das Recht','die Pflicht','die Verfassung',
                     'wählen','die Gesellschaft'],
    grammaire_cle:['Passiv (Präsens/Präteritum/Perfekt)','Passiv mit Modalverben',
                   'Zustandspassiv','Nominalisierung'] },

  seances: [
    { n:1, de:'Rechte und Pflichten', ar:'الحقوق والواجبات', dur:60,
      obj:['معجم المواطنة','المبني للمجهول في الحاضر','von + Datif / durch + Akkusativ'],
      lex:[['die Staatsbürgerschaft','المواطنة'],['das Recht / die Rechte','الحق / الحقوق'],
           ['die Pflicht / die Pflichten','الواجب / الواجبات'],['die Verfassung','الدستور'],
           ['das Gesetz / die Gesetze','القانون / القوانين'],['wählen','ينتخب'],
           ['die Wahl / die Wahlen','الانتخاب / الانتخابات'],['die Freiheit','الحرية'],
           ['die Gleichberechtigung','المساواة في الحقوق'],['die Verantwortung','المسؤولية'],
           ['das Ehrenamt','العمل التطوعي'],['die Meinungsfreiheit','حرية الرأي'],
           ['die Steuer / die Steuern','الضريبة / الضرائب'],['der Ausweis','بطاقة الهوية']],
      gram:{t:'Passiv im Präsens — werden + Partizip II',
        b:['On emploie le passif quand <b>l’action</b> compte plus que l’auteur.',
           'Complément d’agent : <b>von</b> + Datif (personne) · <b>durch</b> + Akkusativ (moyen/cause).',
           '<span class="de-in">Aktiv : Die Bürger <b>wählen</b> das Parlament.</span>',
           '<span class="de-in">Passiv : Das Parlament <b>wird</b> von den Bürgern <b>gewählt</b>.</span>',
           'Sujet impersonnel : <span class="de-in">Hier <b>wird</b> Deutsch <b>gesprochen</b>.</span>'],
        tbl:[['ich','werde gewählt'],['du','wirst gewählt'],['er/sie/es','wird gewählt'],
             ['wir','werden gewählt'],['ihr','werdet gewählt'],['sie/Sie','werden gewählt']],
        ex:'<span class="de-in">Die Steuern <b>werden</b> vom Staat <b>erhoben</b>.</span>'},
      exos:[{q:'Mets au passif : «Der Präsident unterzeichnet das Gesetz.»',
             opts:['Das Gesetz wird vom Präsidenten unterzeichnet.',
                   'Das Gesetz wird unterzeichnet vom Präsidenten.',
                   'Das Gesetz unterzeichnet wird.',
                   'Der Präsident wird das Gesetz unterzeichnet.'],a:0,
             why:'Sujet → complément d’agent <b>von + Datif</b> ; participe à la fin.'},
            {q:'«Hier ___ Deutsch gesprochen.»',opts:['wird','werden','ist','hat'],a:0,
             why:'Sujet impersonnel <b>hier</b> → 3ᵉ personne du singulier → <b>wird</b>.'},
            {q:'Complément d’agent avec une PERSONNE :',opts:['von + Datif','durch + Akkusativ',
                                                             'mit + Datif','für + Akkusativ'],a:0,
             why:'<b>von</b> + Datif (personne) · <b>durch</b> + Akkusativ (moyen, cause).'},
            {q:'Participe II de «wählen» :',opts:['gewählt','wählt','ge wählt','gewehlen'],a:0,
             why:'Verbe régulier : ge + radical + t.'},
            {q:'«Die Wahlen ___ alle fünf Jahre ___ .»',
             opts:['werden … organisiert','wird … organisiert','werden … organisieren',
                   'sind … organisiert'],a:0,
             why:'Pluriel → <b>werden</b> + participe à la fin.'}]},

    { n:2, de:'Passiv in der Vergangenheit + Modalverben', ar:'المبني للمجهول في الماضي ومع الأفعال الناقصة', dur:60,
      obj:['الماضي المبني للمجهول','worden vs geworden','الناقص + passif','Zustandspassiv'],
      lex:[['wurde gebaut','بُني'],['ist gebaut worden','تم بناؤه'],
           ['war gebaut','كان مبنيّاً (حالة)'],['muss gemacht werden','يجب أن يُنجز'],
           ['kann verstanden werden','يمكن أن يُفهم'],['darf nicht betreten werden','يُمنع الدخول'],
           ['sollte vermieden werden','ينبغي تفاديه'],['hat vermieden werden können','كان يمكن تفاديه']],
      gram:{t:'Les trois temps du Passiv + le Zustandspassiv',
        tbl:[['Präsens','wird + Partizip II','Das Gesetz wird verabschiedet.'],
             ['Präteritum','wurde + Partizip II','Das Gesetz wurde verabschiedet.'],
             ['Perfekt','ist + Partizip II + <b>worden</b>','Das Gesetz ist verabschiedet worden.'],
             ['Plusquamperfekt','war + P.II + worden','Das Gesetz war verabschiedet worden.'],
             ['Zustandspassiv','ist + Partizip II','Das Gesetz ist verabschiedet. (état)']],
        b:['⚠️ Au Passiv Perfekt on utilise <b>worden</b> et NON <span class="de-in">geworden</span>.',
           'Avec un verbe modal : modal conjugué + Partizip II + <b>werden</b> (infinitif final).',
           '<b>Vorgangspassiv</b> (werden) = l’action en cours · '
         + '<b>Zustandspassiv</b> (sein) = l’état qui en résulte.'],
        ex:'<span class="de-in">Das Problem <b>hätte vermieden werden können</b>.</span> '
         + '(modal au Konjunktiv II + P.II + werden + können)'},
      exos:[{q:'«Das Haus ___ 1990 ___ .» (a été construit)',
             opts:['wurde … gebaut','war … gebaut','ist … gebaut','wird … gebaut'],a:0,
             why:'Präteritum Passiv : <b>wurde</b> + participe.'},
            {q:'«Das Gesetz ___ verabschiedet ___ .» (Perfekt Passiv)',
             opts:['ist … worden','ist … geworden','hat … worden','wurde … worden'],a:0,
             why:'Perfekt Passiv = <b>sein</b> + P.II + <b>worden</b> (jamais geworden).'},
            {q:'«Die Aufgabe ___ heute gelöst ___ .» (doit être résolue)',
             opts:['muss … werden','muss … worden','soll … worden','kann … geworden'],a:0,
             why:'Modal + P.II + <b>werden</b> (infinitif final).'},
            {q:'«Die Tür ___ geöffnet.» = elle est ouverte (état)',
             opts:['ist','wird','war','wurde'],a:0,
             why:'<b>Zustandspassiv</b> : sein + Partizip II.'},
            {q:'Quelle phrase décrit une ACTION en cours ?',
             opts:['Die Tür ist geöffnet.','Die Tür wird geöffnet.',
                   'Die Tür war geöffnet.','Die Tür ist geöffnet worden.'],a:1,
             why:'<b>wird</b> + P.II = Vorgangspassiv (processus en cours).'}]},

    { n:3, de:'Textverständnis : «Was heißt Bürger sein?»', ar:'فهم نص — ما معنى أن تكون مواطناً؟', dur:60,
      obj:['قراءة نص حجاجي','repérage de la thèse et des arguments','connecteurs concessifs','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Was heißt Bürger sein?</b></p>'
          + '<p>Wer an Staatsbürgerschaft denkt, denkt zuerst an einen Ausweis. Doch die '
          + 'Staatsangehörigkeit ist mehr als ein Dokument: Sie ist ein Bündel von Rechten '
          + 'und Pflichten, das den Einzelnen mit der Gemeinschaft verbindet.</p>'
          + '<p>Zu den Rechten gehören die Meinungsfreiheit, das Wahlrecht und der Schutz '
          + 'durch die Gesetze. Diesen Rechten stehen jedoch Pflichten gegenüber: Wer in '
          + 'einem Land lebt, muss sich an seine Gesetze halten, Steuern zahlen und — '
          + 'in vielen Ländern — zur Wahl gehen.</p>'
          + '<p>Kritiker wenden ein, dass formale Rechte allein nicht genügen. Wer zwar '
          + 'wählen darf, aber keine Schule besucht hat, kann seine Stimme kaum informiert '
          + 'abgeben. Deshalb fordern Soziologen eine «aktive Bürgerschaft»: Engagement im '
          + 'Verein, Teilnahme an Debatten, Hilfe für Nachbarn.</p>'
          + '<p>Zusammenfassend lässt sich sagen, dass Staatsbürgerschaft kein Zustand, '
          + 'sondern eine Praxis ist. Sie wird nicht nur verliehen — sie muss täglich '
          + 'gelebt werden.</p></div>',
      exos:[{q:'Richtig oder Falsch : Die Staatsbürgerschaft ist nur ein Dokument.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">Sie ist <b>mehr als</b> ein Dokument.</span>'},
            {q:'Richtig oder Falsch : Zu den Pflichten gehört das Zahlen von Steuern.',
             opts:['Richtig','Falsch'],a:0,
             why:'<span class="de-in">… muss sich an seine Gesetze halten, <b>Steuern zahlen</b>…</span>'},
            {q:'Richtig oder Falsch : Formale Rechte genügen laut den Kritikern.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">Kritiker wenden ein, dass formale Rechte allein '
               + '<b>nicht genügen</b>.</span>'},
            {q:'Was fordern die Soziologen?',
             opts:['Eine «aktive Bürgerschaft».',
                   'Mehr Steuern.',
                   'Die Abschaffung des Wahlrechts.',
                   'Nur formale Rechte.'],a:0,
             why:'<span class="de-in">Deshalb fordern Soziologen eine «aktive Bürgerschaft».</span>'},
            {q:'Welcher Konnektor leitet den Gegensatz ein?',
             opts:['Deshalb','Jedoch','Zusammenfassend','Zwar'],a:1,
             why:'<span class="de-in"><b>jedoch</b></span> = mais / cependant (position libre).'},
            {q:'Was ist die Schlussfolgerung des Textes?',
             opts:['Staatsbürgerschaft ist eine Praxis, kein Zustand.',
                   'Staatsbürgerschaft ist nur ein Ausweis.',
                   'Man braucht keine Schule.',
                   'Wählen ist unnötig.'],a:0,
             why:'<span class="de-in">… dass Staatsbürgerschaft <b>kein Zustand, sondern eine '
               + 'Praxis</b> ist.</span>'}]},

    { n:4, de:'Textproduktion — «Aktive Bürgerschaft»', ar:'إنتاج كتابي ✍️ المواطنة الفاعلة', dur:60,
      obj:['كتابة نص حجاجي 12 سطراً','3 صيغ مبني للمجهول','these/argument/exemple','Concessif + causal'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً حجاجياً من '
          + '<b>10 إلى 12 سطراً</b> حول « المواطنة الفاعلة »، مع احترام الشروط :'
          + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
          + '<li><b>3 جمل بالمبني للمجهول</b> في أزمنة مختلفة (wird · wurde · ist … worden)</li>'
          + '<li><b>1 مبني للمجهول مع فعل ناقص</b> (muss/kann/soll … werden)</li>'
          + '<li>بنية حجاجية : These → Argument → Beispiel</li>'
          + '<li><b>1 تنازل</b> (obwohl / zwar … aber) و <b>1 سبب</b> (weil / da / deshalb)</li>'
          + '<li>خاتمة تركيبة (Zusammenfassend lässt sich sagen, dass …)</li>'
          + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
           + '<p>Heutzutage wird viel über Staatsbürgerschaft diskutiert. Meiner Meinung nach '
           + 'ist sie kein Zustand, sondern eine tägliche Praxis. Zwar besitzt jeder Bürger '
           + 'formale Rechte, aber diese Rechte allein genügen nicht.</p>'
           + '<p>Ein wichtiges Argument dafür ist die Schule: Wer keine Schule besucht hat, '
           + 'kann seine Stimme kaum informiert abgeben. Deshalb sollte allen Kindern der '
           + 'Zugang zur Bildung garantiert werden. Zum Beispiel wurde in Algerien die '
           + 'Schulpflicht 1962 eingeführt, und seitdem sind Millionen von Kindern '
           + 'eingeschult worden.</p>'
           + '<p>Darüber hinaus muss sich jeder Bürger aktiv engagieren. Im Verein wird '
           + 'zusammen gearbeitet, Nachbarn wird geholfen und an Debatten wird teilgenommen. '
           + 'Obwohl diese Tätigkeiten unbezahlt sind, stärken sie die Gesellschaft.</p>'
           + '<p>Zusammenfassend lässt sich sagen, dass Staatsbürgerschaft verliehen wird, '
           + 'aber täglich gelebt werden muss. Wenn ich die Wahl hätte, würde ich mich '
           + 'ehrenamtlich engagieren, denn eine Gesellschaft ist so stark wie ihre Bürger.</p>'
           + '</div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك الحجاجي هنا:',
             ph:'Heutzutage wird viel über … diskutiert. Meiner Meinung nach …'}]}
  ],

  devoir: {
    titre:'Évaluation — 3AS Einheit 2 : Staatsbürgerschaft',
    unite:2, niveau:'3AS', duree:60, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit', pts:8,
        texte:'<div class="reading"><p><b>Was heißt Bürger sein?</b></p>'
            + '<p>Wer an Staatsbürgerschaft denkt, denkt zuerst an einen Ausweis. Doch die '
            + 'Staatsangehörigkeit ist mehr als ein Dokument: Sie ist ein Bündel von Rechten '
            + 'und Pflichten, das den Einzelnen mit der Gemeinschaft verbindet.</p>'
            + '<p>Zu den Rechten gehören die Meinungsfreiheit, das Wahlrecht und der Schutz '
            + 'durch die Gesetze. Diesen Rechten stehen jedoch Pflichten gegenüber: Wer in '
            + 'einem Land lebt, muss sich an seine Gesetze halten, Steuern zahlen und — '
            + 'in vielen Ländern — zur Wahl gehen.</p>'
            + '<p>Kritiker wenden ein, dass formale Rechte allein nicht genügen. Deshalb '
            + 'fordern Soziologen eine «aktive Bürgerschaft»: Engagement im Verein, '
            + 'Teilnahme an Debatten, Hilfe für Nachbarn.</p>'
            + '<p>Zusammenfassend lässt sich sagen, dass Staatsbürgerschaft kein Zustand, '
            + 'sondern eine Praxis ist.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Die Staatsbürgerschaft ist nur ein Dokument.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Sie ist <b>mehr als</b> ein Dokument.</span>'},
          {id:'I.2',type:'vf',t:'Meinungsfreiheit gehört zu den Rechten.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Zu den Rechten gehören die Meinungsfreiheit…</span>'},
          {id:'I.3',type:'vf',t:'Steuern zahlen ist eine Pflicht.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… muss … <b>Steuern zahlen</b>.</span>'},
          {id:'I.4',type:'vf',t:'Formale Rechte genügen laut den Kritikern.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Kritiker wenden ein, dass formale Rechte allein '
             + '<b>nicht genügen</b>.</span>'},
          {id:'I.5',type:'txt',t:'Was fordern die Soziologen?',pts:2,
           rep:'Sie fordern eine «aktive Bürgerschaft».',key:['aktive','bürgerschaft'],
           just:'<span class="de-in">Deshalb fordern Soziologen eine «aktive Bürgerschaft».</span>'},
          {id:'I.6',type:'txt',t:'Wie lautet die Schlussfolgerung?',pts:2,
           rep:'Staatsbürgerschaft ist kein Zustand, sondern eine Praxis.',
           key:['praxis','zustand'],just:'Dernière phrase.'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'Mets au passif : «Die Bürger wählen das Parlament.»',
           opts:['Das Parlament wird von den Bürgern gewählt.',
                 'Das Parlament wird gewählt von den Bürgern.',
                 'Das Parlament ist von den Bürgern gewählt.',
                 'Die Bürger werden das Parlament gewählt.'],a:0,pts:1,
           why:'Passif : sujet → <b>von + Datif</b>, participe à la fin.'},
          {id:'II.2',type:'qcm',t:'«Das Gesetz ___ 2020 verabschiedet ___ .» (Perfekt Passiv)',
           opts:['ist … worden','ist … geworden','hat … worden','wurde … worden'],a:0,pts:1,
           why:'Perfekt Passiv = <b>sein</b> + P.II + <b>worden</b>.'},
          {id:'II.3',type:'qcm',t:'«Die Aufgabe ___ heute gelöst ___ .» (avec modal)',
           opts:['muss … werden','muss … worden','soll … worden','kann … geworden'],a:0,pts:1,
           why:'Modal + P.II + <b>werden</b> (infinitif final).'},
          {id:'II.4',type:'qcm',t:'«Die Tür ___ geöffnet.» — elle est ouverte (état)',
           opts:['ist','wird','wurde','worden'],a:0,pts:1,
           why:'Zustandspassiv = <b>sein</b> + Partizip II.'},
          {id:'II.5',type:'txt',t:'Complément d’agent (personne) = ___ + Datif',pts:1,rep:'von',
           key:['von'],just:'<b>von</b> + Datif (personne) · <b>durch</b> + Akk (moyen).'},
          {id:'II.6',type:'txt',t:'Participe II de «verabschieden» :',pts:1,rep:'verabschiedet',
           key:['verabschiedet'],just:'Préfixe inséparable ver- → <b>pas de ge-</b>.'},
          {id:'II.7',type:'txt',t:'Traduis : «يجب أن تُحترم القوانين»',pts:1,
           rep:'Die Gesetze müssen respektiert werden.',key:['müssen','respektiert werden'],
           why:'',just:'Modal + P.II + <b>werden</b>.'},
          {id:'II.8',type:'txt',t:'Nominalisiere : «Weil man die Steuern erhöhen muss, …»',pts:1,
           rep:'Wegen der Erhöhung der Steuern …',key:['wegen','erhöhung'],
           just:'Nominalisation → <b>wegen</b> + Genitiv.'}
        ]},
      { id:'III', t:'✍️ Production écrite', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً حجاجياً من 10 أسطر حول « المواطنة الفاعلة » : 3 صيغ مبني للمجهول '
             + '(wird/wurde/ist…worden)، مبني للمجهول مع فعل ناقص، بنية These-Argument-Beispiel، '
             + 'تنازل وسبب، وخاتمة تركيبة.',
           grille:[['3 صيغ مبني للمجهول في أزمنة مختلفة','1.0'],
                   ['1 مبني للمجهول مع فعل ناقص','0.5'],
                   ['بنية These → Argument → Beispiel','0.5'],
                   ['تنازل (obwohl / zwar…aber) + سبب (weil / deshalb)','0.5'],
                   ['خاتمة تركيبة (Zusammenfassend …)','0.5'],
                   ['مفردات الوحدة (8 كلمات على الأقل)','0.5'],
                   ['الإملاء، المajuscules، الترقيم','0.5']],
           modele:'<div class="reading"><p>Heutzutage wird viel über Staatsbürgerschaft '
                + 'diskutiert. Meiner Meinung nach ist sie kein Zustand, sondern eine tägliche '
                + 'Praxis. Zwar besitzt jeder Bürger formale Rechte, aber diese allein genügen nicht.</p>'
                + '<p>Ein wichtiges Argument ist die Schule: Wer keine Schule besucht hat, kann '
                + 'seine Stimme kaum informiert abgeben. Deshalb sollte allen Kindern der Zugang '
                + 'zur Bildung garantiert werden. Zum Beispiel wurde in Algerien die Schulpflicht '
                + '1962 eingeführt, und seitdem sind Millionen von Kindern eingeschult worden.</p>'
                + '<p>Darüber hinaus muss sich jeder Bürger aktiv engagieren. Im Verein wird '
                + 'zusammen gearbeitet und Nachbarn wird geholfen. Obwohl diese Tätigkeiten '
                + 'unbezahlt sind, stärken sie die Gesellschaft. Zusammenfassend lässt sich sagen, '
                + 'dass Staatsbürgerschaft verliehen wird, aber täglich gelebt werden muss.</p></div>'}
        ]}
    ]
  },

  corrige: {
    unite:2, niveau:'3AS',
    titre:'التصحيح النموذجي — 3AS الوحدة 2 : Staatsbürgerschaft',
    bareme:{ I:8, II:8, III:4, total:20 },
    partie_I:[
      {id:'I.1',reponse:'Falsch',justification:'Sie ist mehr als ein Dokument.'},
      {id:'I.2',reponse:'Richtig',justification:'Zu den Rechten gehören die Meinungsfreiheit.'},
      {id:'I.3',reponse:'Richtig',justification:'… muss Steuern zahlen.'},
      {id:'I.4',reponse:'Falsch',justification:'Kritiker : formale Rechte allein genügen nicht.'},
      {id:'I.5',reponse:'Sie fordern eine «aktive Bürgerschaft».',justification:'3ᵉ paragraphe.'},
      {id:'I.6',reponse:'Kein Zustand, sondern eine Praxis.',justification:'Dernière phrase.'}
    ],
    partie_II:[
      {id:'II.1',reponse:'Das Parlament wird von den Bürgern gewählt.',regle:'von + Datif, participe final'},
      {id:'II.2',reponse:'ist … worden',regle:'Perfekt Passiv = sein + P.II + worden'},
      {id:'II.3',reponse:'muss … werden',regle:'Modal + P.II + werden'},
      {id:'II.4',reponse:'ist',regle:'Zustandspassiv = sein + P.II'},
      {id:'II.5',reponse:'von',regle:'von + Datif (personne) · durch + Akk (moyen)'},
      {id:'II.6',reponse:'verabschiedet',regle:'ver- inséparable → pas de ge-'},
      {id:'II.7',reponse:'Die Gesetze müssen respektiert werden.',regle:'Modal + P.II + werden'},
      {id:'II.8',reponse:'Wegen der Erhöhung der Steuern …',regle:'Nominalisation + wegen + Genitiv'}
    ],
    partie_III:{
      bareme:[['3 صيغ مبني للمجهول','1.0'],['1 مبني للمجهول + ناقص','0.5'],
              ['These-Argument-Beispiel','0.5'],['تنازل + سبب','0.5'],
              ['خاتمة تركيبة','0.5'],['مفردات الوحدة','0.5'],['إملاء + ترقيم','0.5']],
      modele:'Heutzutage wird viel über Staatsbürgerschaft diskutiert. Meiner Meinung nach ist '
           + 'sie kein Zustand, sondern eine Praxis. Zwar besitzt jeder Bürger formale Rechte, '
           + 'aber diese allein genügen nicht. Zum Beispiel wurde in Algerien die Schulpflicht '
           + '1962 eingeführt, und seitdem sind Millionen von Kindern eingeschult worden. '
           + 'Darüber hinaus muss sich jeder Bürger aktiv engagieren. Zusammenfassend lässt sich '
           + 'sagen, dass Staatsbürgerschaft täglich gelebt werden muss.',
      seuils:{'16-20':'ممتاز — Sehr gut 🏆','14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖','0-9.9':'يحتاج مراجعة الوحدة 🔁'}
    },
    erreurs_frequentes:[
      '~~ist geworden gebaut~~ → Perfekt Passiv = ist gebaut <b>worden</b> (sans ge-).',
      '~~Das Gesetz wird unterzeichnet vom Präsidenten~~ → complément d’agent <b>avant</b> le '
      + 'participe : wird vom Präsidenten <b>unterzeichnet</b>.',
      '~~durch den Lehrer~~ (personne) → <b>von</b> dem Lehrer ; <b>durch</b> = moyen/cause.',
      '~~vergesteuert / geverabschiedet~~ → préfixes inséparables : <b>ver</b>steuert, '
      + '<b>ver</b>abschiedet (pas de ge-).',
      '~~Die Tür wird geöffnet~~ pour décrire un état → <b>ist</b> geöffnet (Zustandspassiv).',
      '~~muss gelöst werden werden~~ → un seul <b>werden</b> : muss gelöst <b>werden</b>.',
      '~~Weil der Erhöhung der Steuern~~ → <b>wegen</b> + Genitiv (nominalisation).',
      '~~obwohl er ist Bürger~~ → subordonnée : verbe à la fin → obwohl er Bürger <b>ist</b>.'
    ]
  }
};

/* ══════════ UNITÉ 3 — Leben in der Gesellschaft ══════════ */
const U3AS_3 = {
  meta: { n:3, niveau:'3AS', de:'Leben in der Gesellschaft', ar:'الحياة في المجتمع',
    trimestre:1, periode:'ديسمبر — جانفي', duree_totale:240, cecrl:'B1',
    icon:'👥',
    objectifs:['وصف الظواهر الاجتماعية','استعمال الجمل الشرطية الافتراضية','فهم نص سوسيولوجي',
               'إنتاج نص تحليلي من 12 سطراً'],
    competences:['Leseverstehen','Schreiben','Sprechen','Hörverstehen'],
    vocabulaire_cle:['die Gesellschaft','die Generation','der Zusammenhalt','die Armut',
                     'die Urbanisierung','sozial'],
    grammaire_cle:['Konjunktiv II (irreale Bedingungen)','Genitiv','zweiteilige Konnektoren',
                   'Partizip I/II als Adjektiv'] },

  seances: [
    { n:1, de:'Gesellschaft im Wandel', ar:'المجتمع في تحوّل', dur:60,
      obj:['معجم اجتماعي','الجنيتيف','الصفات كاسم فاعل ومفعول'],
      lex:[['die Gesellschaft','المجتمع'],['die Generation','الجيل'],
           ['der Zusammenhalt','التماسك'],['die Armut','الفقر'],
           ['die Ungleichheit','اللامساواة'],['die Urbanisierung','التمدّن'],
           ['die Solidarität','التضامن'],['der Wandel','التحوّل'],
           ['die Großfamilie','الأسرة الممتدة'],['die Kleinfamilie','الأسرة الصغيرة'],
           ['das Ehrenamt','العمل التطوعي'],['die Jugend','الشباب'],
           ['das Alter','الشيخوخة / السن'],['sozial','اجتماعي']],
      gram:{t:'Genitiv + Partizip I/II als Adjektiv',
        b:['Génitif : <b>des</b> Mann<b>es</b> · <b>der</b> Frau · <b>des</b> Kind<b>es</b> · '
       + '<b>der</b> Leute',
           'Prépositions + Genitiv : <b>wegen · trotz · während · statt · innerhalb · '
       + 'außerhalb · aufgrund</b>',
           'Partizip I (Infinitiv + d) = action en cours, voix <b>active</b> : '
       + '<span class="de-in">das lach<b>ende</b> Kind</span> (l’enfant qui rit)',
           'Partizip II = action accomplie, voix <b>passive</b> : '
       + '<span class="de-in">die geles<b>ene</b> Zeitung</span> (le journal qui a été lu)'],
        tbl:[['wegen + Gen.','wegen des Wetters','à cause du temps'],
             ['trotz + Gen.','trotz der Hitze','malgré la chaleur'],
             ['während + Gen.','während der Ferien','pendant les vacances'],
             ['Partizip I','die wachsende Stadt','la ville qui grandit'],
             ['Partizip II','die gebaute Schule','l’école construite']],
        ex:'<span class="de-in"><b>Trotz der</b> wirtschaftlichen Probleme bleibt '
         + '<b>der</b> familiäre Zusammenhalt stark.</span>'},
      exos:[{q:'«___ des Wetters blieben wir zu Hause.»',opts:['Wegen','Trotz','Während','Statt'],a:0,
             why:'« à cause de » → <b>wegen</b> + Genitiv.'},
            {q:'«Trotz ___ Hitze gingen wir spazieren.»',opts:['der','des','dem','die'],a:0,
             why:'<span class="de-in">die Hitze</span> → Genitiv féminin → <b>der</b> Hitze.'},
            {q:'«das ___ Kind» (l’enfant qui rit)',opts:['lachende','gelachte','lachte','lacht'],a:0,
             why:'Partizip I = Infinitiv + <b>-d</b> : lachen → lach<b>end</b>e.'},
            {q:'«die ___ Zeitung» (le journal lu)',opts:['gelesene','lesende','gelesene Zeitung',
                                                         'lasende'],a:0,
             why:'Partizip II = passif / accompli : lesen → ge<b>les</b>en + e.'},
            {q:'«Die Zukunft ___ Gesellschaft liegt in der Bildung.»',
             opts:['der','des','dem','die'],a:0,
             why:'<span class="de-in">die Gesellschaft</span> → Genitiv féminin → <b>der</b>.'}]},

    { n:2, de:'Irreale Bedingungssätze', ar:'الجمل الشرطية الافتراضية', dur:60,
      obj:['Konjunktiv II au présent et au passé','condition irréelle','inversion sans wenn','conseils polis'],
      lex:[['Wenn ich Zeit hätte, …','لو كان لديّ وقت…'],
           ['An deiner Stelle würde ich …','مكانك كنت سأ…'],
           ['Ohne dich wäre ich …','بدونك لكنت…'],
           ['Hätte ich das gewusst, …','لو علمت ذلك…'],
           ['Ich wünschte, ich könnte …','أتمنى لو أستطيع…'],
           ['Es wäre besser, wenn …','من الأفضل لو…']],
      gram:{t:'Konjunktiv II — irréel du présent et du passé',
        tbl:[['Présent irréel','Wenn ich Zeit <b>hätte</b>, <b>würde</b> ich lesen.'],
             ['Passé irréel','Wenn du früher <b>gekommen wärst</b>, <b>hättest</b> du ihn <b>gesehen</b>.'],
             ['Sans wenn','<b>Hätte</b> ich das gewusst, <b>wäre</b> ich geblieben.'],
             ['Conseil','<b>An deiner Stelle würde</b> ich fragen.'],
             ['Wunsch','<b>Ich wünschte</b>, ich <b>könnte</b> helfen.']],
        b:['Présent irréel : <b>wenn</b> + Konjunktiv II → principale au Konjunktiv II '
       + '(würde + Infinitiv ou forme propre).',
           'Passé irréel : <b>wenn</b> + hätte/wäre + Partizip II → hätte/würde + Partizip II.',
           'Sans <b>wenn</b>, le verbe passe en tête de la subordonnée (inversion obligatoire).',
           'Formes propres : <b>wäre · hätte · könnte · müsste · dürfte · sollte</b>. '
       + 'Pour les autres verbes : <b>würde</b> + Infinitiv.'],
        ex:'<span class="de-in"><b>Ohne</b> deine Hilfe <b>wäre</b> ich verloren '
         + '<b>gewesen</b>.</span> (passé irréel sans wenn)'},
      exos:[{q:'«Wenn ich reich ___, ___ ich um die Welt reisen.»',
             opts:['wäre … würde','bin … werde','war … würde','wäre … werde'],a:0,
             why:'Irréel du présent : <b>wäre</b> … <b>würde</b> + Infinitiv.'},
            {q:'«___ ich das gewusst, wäre ich geblieben.»',opts:['Hätte','Wenn','Würde','Wäre'],a:0,
             why:'Sans <b>wenn</b>, l’auxiliaire passe en tête : <b>Hätte</b> ich…'},
            {q:'Conseil poli : «___ deiner Stelle würde ich fragen.»',
             opts:['An','In','Auf','Mit'],a:0,
             why:'Expression figée : <span class="de-in"><b>An</b> deiner Stelle</span>.'},
            {q:'«Wenn du früher gekommen ___, ___ du ihn gesehen.»',
             opts:['wärst … hättest','bist … hast','wärest … würdest','warst … hattest'],a:0,
             why:'Irréel du passé : wäre + P.II → hätte + P.II.'},
            {q:'«Ich wünschte, ich ___ helfen.»',opts:['könnte','kann','konnte','würde'],a:0,
             why:'Souhait irréel → <b>könnte</b> (Konjunktiv II de können).'}]},

    { n:3, de:'Textverständnis : «Generationen unter einem Dach»', ar:'فهم نص — أجيال تحت سقف واحد', dur:60,
      obj:['قراءة نص سوسيولوجي','استخراج الحجج','repérage du Konjunktiv','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Generationen unter einem Dach</b></p>'
          + '<p>Früher lebten in Algerien oft drei Generationen zusammen: Großeltern, Eltern '
          + 'und Kinder teilten sich ein Haus. Heute ist die Großfamilie vor allem in den '
          + 'Städten seltener geworden — die Kleinfamilie dominiert.</p>'
          + '<p>Soziologen bedauern diese Entwicklung. Ihrer Meinung nach geht mit der '
          + 'Großfamilie auch ein soziales Netz verloren: Die Großeltern betreuen die Kinder, '
          + 'die Erwachsenen pflegen die Alten, und niemand bleibt allein. Wäre dieses Netz '
          + 'nicht vorhanden, müsste der Staat deutlich mehr ausgeben.</p>'
          + '<p>Befürworter der Kleinfamilie halten dagegen, dass junge Paare mehr Freiheit '
          + 'bräuchten, um ihr eigenes Leben zu gestalten. Außerdem seien Konflikte zwischen '
          + 'Schwiegermutter und Schwiegertochter nicht selten.</p>'
          + '<p>Interessanterweise zeigen Umfragen, dass sich die meisten Jugendlichen beide '
          + 'Modelle vorstellen können: Sie möchten unabhängig wohnen, aber in der Nähe ihrer '
          + 'Eltern bleiben. Vielleicht ist das die Lösung der Zukunft — getrennte Wohnungen, '
          + 'aber gemeinsame Sonntage.</p></div>',
      exos:[{q:'Richtig oder Falsch : Die Großfamilie ist heute in den Städten häufiger.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">… ist die Großfamilie vor allem in den Städten '
               + '<b>seltener</b> geworden.</span>'},
            {q:'Richtig oder Falsch : Die Großeltern betreuen die Kinder.',
             opts:['Richtig','Falsch'],a:0,
             why:'<span class="de-in">Die Großeltern <b>betreuen die Kinder</b>.</span>'},
            {q:'Richtig oder Falsch : Alle Jugendlichen lehnen die Großfamilie ab.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">… dass sich die <b>meisten</b> Jugendlichen <b>beide Modelle</b> '
               + 'vorstellen können.</span>'},
            {q:'Warum müsste der Staat laut den Soziologen mehr ausgeben?',
             opts:['Wenn das soziale Netz nicht vorhanden wäre.',
                   'Weil die Mieten steigen.',
                   'Wegen der Jugendarbeitslosigkeit.',
                   'Damit alle allein wohnen.'],a:0,
             why:'<span class="de-in"><b>Wäre</b> dieses Netz nicht vorhanden, <b>müsste</b> der '
               + 'Staat deutlich mehr ausgeben.</span> (irréel sans wenn).'},
            {q:'Welche Form steht im Konjunktiv II ?',
             opts:['«Die Großeltern betreuen die Kinder.»',
                   '«… dass junge Paare mehr Freiheit bräuchten.»',
                   '«Die Kleinfamilie dominiert.»',
                   '«Umfragen zeigen, dass …»'],a:1,
             why:'<b>bräuchten</b> = Konjunktiv II de brauchen (discours rapporté + irréel).'},
            {q:'Was ist die «Lösung der Zukunft» laut dem Text?',
             opts:['Getrennte Wohnungen, aber gemeinsame Sonntage.',
                   'Alle leben wieder zusammen.',
                   'Der Staat übernimmt die Pflege.',
                   'Jugendliche ziehen ins Ausland.'],a:0,
             why:'Dernière phrase : <span class="de-in">getrennte Wohnungen, aber gemeinsame '
               + 'Sonntage</span>.'}]},

    { n:4, de:'Textproduktion — «Zusammenleben der Generationen»', ar:'إنتاج كتابي ✍️ تعايش الأجيال', dur:60,
      obj:['كتابة نص تحليلي 12 سطراً','2 جمل افتراضية','Génitif + connecteurs ثنائية','تحليل موضوعي'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً تحليلياً من '
          + '<b>10 إلى 12 سطراً</b> حول « تعايش الأجيال في الجزائر » :'
          + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
          + '<li>عرض الموضوع بشكل موضوعي (لا رأي شخصي في المقدمة)</li>'
          + '<li><b>حجتان مؤيدتان</b> للأسرة الممتدة + <b>حجة واحدة معارضة</b></li>'
          + '<li><b>2 جمل افتراضية</b> بـ Konjunktiv II (wäre / hätte / müsste)</li>'
          + '<li><b>2 جنيتيف</b> (wegen / trotz / während) + <b>1 رابط ثنائي</b> '
          + '(entweder…oder · weder…noch · zwar…aber)</li>'
          + '<li>خاتمة تركيبة + اقتراح حل</li>'
          + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
           + '<p>In Algerien wird seit Jahren über das Zusammenleben der Generationen '
           + 'diskutiert. Früher lebten Großeltern, Eltern und Kinder unter einem Dach; '
           + 'heute dominiert in den Städten die Kleinfamilie.</p>'
           + '<p>Für die Großfamilie sprechen vor allem zwei Argumente. Erstens geht mit ihr '
           + 'ein starkes soziales Netz einher: Die Großeltern betreuen die Kinder, während '
           + 'die Erwachsenen die Alten pflegen. Wäre dieses Netz nicht vorhanden, müsste der '
           + 'Staat deutlich mehr für Pflegeheime ausgeben. Zweitens schützt die Großfamilie '
           + 'ältere Menschen trotz zunehmender Urbanisierung vor der Einsamkeit.</p>'
           + '<p>Gegen die Großfamilie spricht allerdings, dass junge Paare weniger Freiheit '
           + 'hätten, ihr eigenes Leben zu gestalten. Konflikte zwischen den Generationen '
           + 'sind weder selten noch harmlos.</p>'
           + '<p>Zusammenfassend lässt sich sagen, dass beide Modelle Vor- und Nachteile haben. '
           + 'Entweder wohnen die Generationen getrennt, oder sie teilen sich ein Haus — '
           + 'entscheidend ist der regelmäßige Kontakt. Meiner Ansicht nach wäre eine Lösung '
           + 'der Zukunft: getrennte Wohnungen, aber gemeinsame Sonntage.</p></div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك التحليلي هنا:',
             ph:'In Algerien wird seit Jahren über … diskutiert.'}]}
  ],

  devoir: {
    titre:'Évaluation — 3AS Einheit 3 : Leben in der Gesellschaft',
    unite:3, niveau:'3AS', duree:60, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit', pts:8,
        texte:'<div class="reading"><p><b>Generationen unter einem Dach</b></p>'
            + '<p>Früher lebten in Algerien oft drei Generationen zusammen: Großeltern, Eltern '
            + 'und Kinder teilten sich ein Haus. Heute ist die Großfamilie vor allem in den '
            + 'Städten seltener geworden — die Kleinfamilie dominiert.</p>'
            + '<p>Soziologen bedauern diese Entwicklung. Ihrer Meinung nach geht mit der '
            + 'Großfamilie auch ein soziales Netz verloren: Die Großeltern betreuen die Kinder, '
            + 'die Erwachsenen pflegen die Alten, und niemand bleibt allein. Wäre dieses Netz '
            + 'nicht vorhanden, müsste der Staat deutlich mehr ausgeben.</p>'
            + '<p>Befürworter der Kleinfamilie halten dagegen, dass junge Paare mehr Freiheit '
            + 'bräuchten. Interessanterweise zeigen Umfragen, dass sich die meisten Jugendlichen '
            + 'beide Modelle vorstellen können: Sie möchten unabhängig wohnen, aber in der Nähe '
            + 'ihrer Eltern bleiben.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Die Großfamilie ist in den Städten häufiger geworden.',pts:1,rep:'Falsch',
           just:'<span class="de-in">… ist die Großfamilie … <b>seltener</b> geworden.</span>'},
          {id:'I.2',type:'vf',t:'Die Großeltern betreuen die Kinder.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Die Großeltern <b>betreuen die Kinder</b>.</span>'},
          {id:'I.3',type:'vf',t:'Junge Paare bräuchten laut Befürwortern mehr Freiheit.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… dass junge Paare mehr Freiheit <b>bräuchten</b>.</span>'},
          {id:'I.4',type:'vf',t:'Die meisten Jugendlichen lehnen beide Modelle ab.',pts:1,rep:'Falsch',
           just:'<span class="de-in">… dass sich die meisten Jugendlichen <b>beide Modelle '
             + 'vorstellen können</b>.</span>'},
          {id:'I.5',type:'txt',t:'Was müsste der Staat tun, wenn das soziale Netz fehlte?',pts:2,
           rep:'Der Staat müsste deutlich mehr ausgeben.',key:['staat','mehr ausgeben'],
           just:'Irréel sans wenn : <span class="de-in">Wäre dieses Netz nicht vorhanden, '
             + 'müsste der Staat deutlich mehr ausgeben.</span>'},
          {id:'I.6',type:'txt',t:'Was wünschen sich die meisten Jugendlichen?',pts:2,
           rep:'Unabhängig wohnen, aber in der Nähe ihrer Eltern bleiben.',
           key:['unabhängig','nähe'],just:'Dernière phrase.'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Wenn ich Zeit ___, ___ ich mehr lesen.»',
           opts:['hätte … würde','habe … werde','hatte … würde','hätte … werde'],a:0,pts:1,
           why:'Irréel du présent : hätte … würde + Infinitiv.'},
          {id:'II.2',type:'qcm',t:'«___ ich das gewusst, wäre ich geblieben.»',
           opts:['Hätte','Wenn','Würde','Wäre'],a:0,pts:1,
           why:'Sans wenn → inversion : <b>Hätte</b> ich…'},
          {id:'II.3',type:'qcm',t:'«Trotz ___ Hitze gingen wir spazieren.»',
           opts:['der','des','dem','die'],a:0,pts:1,
           why:'trotz + Genitiv féminin → <b>der</b> Hitze.'},
          {id:'II.4',type:'qcm',t:'«das ___ Kind» (l’enfant qui rit)',
           opts:['lachende','gelachte','lachte','gelacht'],a:0,pts:1,
           why:'Partizip I = Infinitiv + d → lach<b>end</b>e.'},
          {id:'II.5',type:'txt',t:'Complète : «___ deiner Stelle würde ich fragen.»',pts:1,rep:'An',
           key:['an'],just:'Expression figée : An deiner Stelle.'},
          {id:'II.6',type:'txt',t:'Connecteur double : «___ selten ___ harmlos» (ni…ni)',pts:1,
           rep:'weder … noch',key:['weder','noch'],just:'weder … noch = ni … ni.'},
          {id:'II.7',type:'txt',t:'Traduis : «بدون مساعدتك لكنت ضائعاً»',pts:1,
           rep:'Ohne deine Hilfe wäre ich verloren.',key:['ohne','wäre','verloren'],
           just:'<b>ohne</b> + Akkusativ + Konjunktiv II.'},
          {id:'II.8',type:'txt',t:'Genitiv : «wegen + der + Problem(e)»',pts:1,
           rep:'wegen der Probleme',key:['wegen der probleme'],
           just:'wegen + Genitiv pluriel → der Probleme.'}
        ]},
      { id:'III', t:'✍️ Production écrite', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً تحليلياً من 10 أسطر حول « تعايش الأجيال » : حجتان مؤيدتان + حجة معارضة، '
             + '2 جمل افتراضية (Konjunktiv II)، 2 جنيتيف، رابط ثنائي واحد، وخاتمة تركيبة مع اقتراح.',
           grille:[['حجتان مؤيدتان + حجة معارضة','1.0'],
                   ['2 جمل افتراضية صحيحة (wäre/hätte/müsste)','1.0'],
                   ['2 جنيتيف (wegen/trotz/während)','0.5'],
                   ['1 رابط ثنائي (entweder…oder · weder…noch · zwar…aber)','0.5'],
                   ['خاتمة تركيبة + اقتراح حل','0.5'],
                   ['مفردات الوحدة (8 كلمات)','0.5'],
                   ['الإملاء، المajuscules، الترقيم','0.5']],
           modele:'<div class="reading"><p>In Algerien wird seit Jahren über das Zusammenleben '
                + 'der Generationen diskutiert. Für die Großfamilie sprechen zwei Argumente: '
                + 'Erstens geht mit ihr ein starkes soziales Netz einher. Wäre dieses Netz '
                + 'nicht vorhanden, müsste der Staat deutlich mehr ausgeben. Zweitens schützt '
                + 'sie ältere Menschen trotz zunehmender Urbanisierung vor der Einsamkeit.</p>'
                + '<p>Gegen die Großfamilie spricht allerdings, dass junge Paare weniger '
                + 'Freiheit hätten. Konflikte zwischen den Generationen sind weder selten '
                + 'noch harmlos. Zusammenfassend lässt sich sagen, dass beide Modelle Vor- '
                + 'und Nachteile haben. Entweder wohnen die Generationen getrennt, oder sie '
                + 'teilen sich ein Haus — entscheidend ist der regelmäßige Kontakt.</p></div>'}
        ]}
    ]
  },

  corrige: {
    unite:3, niveau:'3AS',
    titre:'التصحيح النموذجي — 3AS الوحدة 3 : Leben in der Gesellschaft',
    bareme:{ I:8, II:8, III:4, total:20 },
    partie_I:[
      {id:'I.1',reponse:'Falsch',justification:'Die Großfamilie ist seltener geworden.'},
      {id:'I.2',reponse:'Richtig',justification:'Die Großeltern betreuen die Kinder.'},
      {id:'I.3',reponse:'Richtig',justification:'… dass junge Paare mehr Freiheit bräuchten.'},
      {id:'I.4',reponse:'Falsch',justification:'Sie können sich beide Modelle vorstellen.'},
      {id:'I.5',reponse:'Er müsste deutlich mehr ausgeben.',justification:'Irréel sans wenn.'},
      {id:'I.6',reponse:'Unabhängig wohnen, aber in der Nähe ihrer Eltern bleiben.',justification:'Dernière phrase.'}
    ],
    partie_II:[
      {id:'II.1',reponse:'hätte … würde',regle:'Irréel du présent'},
      {id:'II.2',reponse:'Hätte',regle:'Sans wenn → inversion'},
      {id:'II.3',reponse:'der',regle:'trotz + Genitiv féminin'},
      {id:'II.4',reponse:'lachende',regle:'Partizip I = Infinitiv + d'},
      {id:'II.5',reponse:'An',regle:'An deiner Stelle'},
      {id:'II.6',reponse:'weder … noch',regle:'ni … ni'},
      {id:'II.7',reponse:'Ohne deine Hilfe wäre ich verloren.',regle:'ohne + Akk + Konjunktiv II'},
      {id:'II.8',reponse:'wegen der Probleme',regle:'wegen + Genitiv pluriel'}
    ],
    partie_III:{
      bareme:[['2 arguments + 1 contre','1.0'],['2 irréels','1.0'],['2 génitifs','0.5'],
              ['1 connecteur double','0.5'],['conclusion + solution','0.5'],
              ['vocabulaire','0.5'],['orthographe','0.5']],
      modele:'In Algerien wird über das Zusammenleben der Generationen diskutiert. Für die '
           + 'Großfamilie spricht ein starkes soziales Netz. Wäre dieses Netz nicht vorhanden, '
           + 'müsste der Staat mehr ausgeben. Trotz zunehmender Urbanisierung schützt sie ältere '
           + 'Menschen vor der Einsamkeit. Konflikte sind weder selten noch harmlos. '
           + 'Zusammenfassend lässt sich sagen, dass beide Modelle Vor- und Nachteile haben.',
      seuils:{'16-20':'ممتاز — Sehr gut 🏆','14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖','0-9.9':'يحتاج مراجعة الوحدة 🔁'}
    },
    erreurs_frequentes:[
      '~~wenn ich hätte Zeit~~ → subordonnée : verbe à la fin → wenn ich Zeit <b>hätte</b>.',
      '~~würde sein / würde haben~~ → formes propres obligatoires : <b>wäre</b> · <b>hätte</b>.',
      '~~trotz dem Wetter~~ → <b>trotz + Genitiv</b> : trotz <b>des</b> Wetters.',
      '~~wegen dem Problem~~ (oral) → écrit soutenu : wegen <b>des</b> Problem<b>s</b>.',
      '~~das gelachte Kind~~ → action active en cours = Partizip I : das lach<b>ende</b> Kind.',
      '~~nicht nur … aber auch~~ → paire correcte : nicht nur … <b>sondern</b> auch.',
      '~~Hätte ich das wusste~~ → Partizip II : Hätte ich das <b>gewusst</b>.',
      '~~An dir Stelle~~ → Datif : An dein<b>er</b> Stelle.'
    ]
  }
};

/* ══════════ UNITÉ 4 — Wissenschaft und Technologie ══════════ */
window.U3AS_A = [U3AS_1, U3AS_2, U3AS_3];


/* ══════════════════════════════════════════════════════════════════════
   ADAPTATEUR — contrat du registre UNITES d'app.js (U7 · U8 · U9)
   app.js (lignes 217-228) lit, pour U7/U8/U9 :
       UNITES_3AS_A[i].seances · UNITES_3AS_A[i].devoir · UNITES_3AS_A[i].duree_totale
   Le lot A expose { meta:{ duree_totale }, seances, devoir, corrige }.
   On projette les 3 unités du lot (U7 · U8 · U9) dans la forme attendue,
   en remontant duree_totale au premier niveau. Sans cet adaptateur,
   window.UNITES_3AS_A reste undefined et les 3 unités apparaissent VIDES.
   ══════════════════════════════════════════════════════════════════════ */
window.UNITES_3AS_A = (window.U3AS_A || []).slice(0, 3).map(function (u) {
  return {
    meta:         u.meta || {},
    seances:      u.seances || [],
    devoir:       u.devoir || null,
    corrige:      u.corrige || null,
    duree_totale: (u.meta && u.meta.duree_totale) || 360
  };
});
