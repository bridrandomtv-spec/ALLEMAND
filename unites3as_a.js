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
const U3AS_4 = {
  meta: { n:4, niveau:'3AS', de:'Wissenschaft und Technologie', ar:'العلوم والتكنولوجيا',
    trimestre:2, periode:'جانفي — فيفري', duree_totale:240, cecrl:'B2',
    icon:'🔬',
    objectifs:['مناقشة إيجابيات وسلبيات التكنولوجيا','استعمال المصدر مع zu','فهم نص علمي',
               'إنتاج نص حجاجي متوازن من 12 سطراً'],
    competences:['Leseverstehen','Schreiben','Sprechen','Hörverstehen'],
    vocabulaire_cle:['die künstliche Intelligenz','die Digitalisierung','die Forschung',
                     'der Fortschritt','die Datensicherheit','automatisieren'],
    grammaire_cle:['Infinitiv mit zu','um/ohne/statt … zu','Nomen-Verb-Verbindungen',
                   'Passiv mit Modalverben'] },

  seances: [
    { n:1, de:'Fortschritt und seine Grenzen', ar:'التقدّم وحدوده', dur:60,
      obj:['معجم علمي وتقني','المصدر مع zu','جمل المصدر الثلاث'],
      lex:[['die Wissenschaft','العلوم'],['die Forschung','البحث العلمي'],
           ['der Fortschritt','التقدّم'],['die Erfindung','الاختراع'],
           ['die künstliche Intelligenz','الذكاء الاصطناعي'],['die Digitalisierung','الرقمنة'],
           ['das Internet der Dinge','إنترنت الأشياء'],['die Datensicherheit','أمن البيانات'],
           ['automatisieren','يؤتمت'],['entwickeln','يطوّر'],
           ['der Roboter','الروبوت'],['die Anwendung','التطبيق'],
           ['die Gefahr','الخطر'],['die Chance','الفرصة']],
      gram:{t:'Infinitiv mit zu + Infinitivsätze',
        b:['Après beaucoup de verbes et d’adjectifs, l’infinitif est introduit par <b>zu</b> '
       + 'et placé <b>à la fin</b>.',
           'Verbe séparable : <b>zu</b> s’insère entre le préfixe et le radical → '
       + '<span class="de-in">an<b>zu</b>fangen</span> · <span class="de-in">mit<b>zu</b>kommen</span>.',
           '<b>Pas de zu</b> après : verbes modaux · sehen · hören · lassen · gehen · kommen · '
       + 'bleiben · helfen (facultatif).',
           '<b>um … zu</b> = le but (لكي) · <b>ohne … zu</b> = sans que (دون أن) · '
       + '<b>statt … zu</b> = au lieu de (بدل أن).',
           '⚠️ Le sujet doit être le même dans les deux propositions ; sinon → subordonnée '
       + 'avec <b>damit</b>.'],
        tbl:[['Ich hoffe, dich wieder<b>zu</b>sehen.','آمل أن أراك مجدداً.'],
             ['Es ist wichtig, viel <b>zu</b> üben.','من المهم التمرّن كثيراً.'],
             ['Er vergisst, mich <b>anzu</b>rufen.','ينسى أن يتصل بي.'],
             ['Ich lerne Deutsch, <b>um</b> in Deutschland <b>zu</b> studieren.','لكي أدرس في ألمانيا'],
             ['Sie ging, <b>ohne</b> ein Wort <b>zu</b> sagen.','غادرت دون أن تقول كلمة'],
             ['<b>Statt zu</b> helfen, spielt er.','بدل أن يساعد، يلعب']],
        ex:'<span class="de-in">Die Technik ist dazu da, <b>um</b> uns das Leben '
         + '<b>zu</b> erleichtern — nicht, <b>um</b> uns <b>zu</b> ersetzen.</span>'},
      exos:[{q:'«Ich habe vor, Deutsch ___ .»',opts:['zu lernen','lernen','lerne','gelernt'],a:0,
             why:'<span class="de-in">vorhaben</span> + <b>zu</b> + Infinitiv.'},
            {q:'«Er vergisst, mich ___ .» (anrufen)',opts:['anzurufen','zu anrufen',
                                                          'anrufen zu','gerufen'],a:0,
             why:'Verbe séparable : <b>zu</b> s’insère → an<b>zu</b>rufen.'},
            {q:'Quel verbe n’exige PAS «zu» ?',opts:['hoffen','vergessen','können','versuchen'],a:2,
             why:'Les <b>verbes modaux</b> ne prennent jamais zu.'},
            {q:'«Ich lerne Deutsch, ___ in Deutschland zu studieren.»',
             opts:['um','ohne','statt','für'],a:0,
             why:'Le but → <b>um … zu</b>.'},
            {q:'«Sie ging, ___ ein Wort zu sagen.» (sans)',opts:['ohne','um','statt','gegen'],a:0,
             why:'<b>ohne … zu</b> = دون أن.'},
            {q:'Quand faut-il employer «damit» au lieu de «um … zu» ?',
             opts:['Quand les deux sujets sont différents.',
                   'Quand la phrase est négative.',
                   'Quand on parle au passé.',
                   'Jamais — ils sont interchangeables.'],a:0,
             why:'<b>um … zu</b> exige le même sujet ; sinon → <b>damit</b> + subordonnée.'}]},

    { n:2, de:'Nominalisierung et Funktionsverbgefüge', ar:'التحويل الاسمي والتراكيب الاسمية-الفعلية', dur:60,
      obj:['التحويل بين الفعل والاسم','Funktionsverbgefüge','الأسلوب العلمي'],
      lex:[['eine Entscheidung treffen','اتخاذ قرار (= entscheiden)',],
           ['in Kauf nehmen','القبول بـ (= akzeptieren)'],
           ['zur Verfügung stellen','وضع تحت التصرّف'],
           ['in Betracht ziehen','أخذ بعين الاعتبار (= erwägen)'],
           ['Kritik üben an','انتقاد (= kritisieren)'],
           ['zum Ausdruck bringen','التعبير عن (= ausdrücken)'],
           ['in Frage kommen','وارد (= möglich sein)'],
           ['zur Folge haben','يترتب عنه (= verursachen)']],
      gram:{t:'Nominalisierung ⇄ Verbalisierung (compétence clé du BAC)',
        tbl:[['weil es regnet','wegen des Regens','weil → wegen + Gen'],
             ['obwohl er krank ist','trotz seiner Krankheit','obwohl → trotz + Gen'],
             ['nachdem sie angekommen war','nach ihrer Ankunft','nachdem → nach + Dat'],
             ['während wir essen','während des Essens','während → während + Gen'],
             ['bevor er geht','vor seinem Weggang','bevor → vor + Dat'],
             ['dass man fleißig lernt','bei fleißigem Lernen','→ bei + Dat']],
        b:['L’infinitif substantivé est toujours au <b>neutre</b> : <b>das</b> Lernen, '
       + '<b>das</b> Lesen, <b>das</b> Essen.',
           'Les <b>Funktionsverbgefüge</b> (nom abstrait + verbe faible) appartiennent au '
       + 'registre soutenu : ils sont très appréciés dans la production écrite du BAC.',
           'Le verbe fixé ne peut pas être remplacé : '
       + '<span class="de-in">eine Entscheidung <b>treffen</b></span> (pas *machen).'],
        ex:'<span class="de-in"><b>Anstelle einer</b> langen Diskussion <b>zog</b> der Minister '
         + 'eine klare Entscheidung <b>in Betracht</b>.</span>'},
      exos:[{q:'Nominalisiere : «Weil es regnet, bleiben wir zu Hause.»',
             opts:['Wegen des Regens bleiben wir zu Hause.',
                   'Trotz des Regens bleiben wir zu Hause.',
                   'Nach dem Regen bleiben wir zu Hause.',
                   'Während des Regens bleiben wir zu Hause.'],a:0,
             why:'<b>weil</b> (cause) → <b>wegen</b> + Genitiv.'},
            {q:'Verbalisiere : «Trotz seiner Krankheit kam er.»',
             opts:['Obwohl er krank war, kam er.','Weil er krank war, kam er.',
                   'Nachdem er krank war, kam er.','Als er krank ist, kam er.'],a:0,
             why:'<b>trotz</b> (concession) → <b>obwohl</b> + subordonnée.'},
            {q:'«eine Entscheidung ___»',opts:['treffen','machen','tun','geben'],a:0,
             why:'Verbe fixé : eine Entscheidung <b>treffen</b>.'},
            {q:'Genre de l’infinitif substantivé «lernen» :',
             opts:['das Lernen','der Lernen','die Lernen','das Lerne'],a:0,
             why:'Toujours <b>neutre</b> : das Lernen.'},
            {q:'«Die Digitalisierung ___ viele Probleme ___ .» (a pour conséquence)',
             opts:['hat … zur Folge','nimmt … in Kauf','zieht … in Betracht',
                   'bringt … zum Ausdruck'],a:0,
             why:'<b>zur Folge haben</b> = يترتب عنه.'}]},

    { n:3, de:'Textverständnis : «Künstliche Intelligenz in der Schule»', ar:'فهم نص — الذكاء الاصطناعي في المدرسة', dur:60,
      obj:['قراءة نص علمي-حجاجي','استخراج الحجج المقابلة','repérage des Funktionsverbgefüge','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Künstliche Intelligenz in der Schule</b></p>'
          + '<p>Seit ChatGPT öffentlich zugänglich ist, hat sich der Unterricht verändert. '
          + 'Schülerinnen und Schüler lassen sich Aufsätze zusammenfassen, Formeln erklären '
          + 'und Vokabeln abfragen — alles in Sekundenschnelle und kostenlos.</p>'
          + '<p>Befürworter betonen, dass die künstliche Intelligenz individuell fördern könne. '
          + 'Ein Programm passe sich dem Tempo jedes Lernenden an, während eine Lehrkraft mit '
          + 'dreißig Schülern kaum auf alle eingehen könne. Außerdem stehe die Hilfe rund um '
          + 'die Uhr zur Verfügung, auch dort, wo es keine Nachhilfelehrer gebe.</p>'
          + '<p>Kritiker wenden jedoch ein, dass die Gefahr bestehe, das eigene Denken '
          + 'auszulagern. Wer nur noch Antworten kopiere, übe weder Formulieren noch '
          + 'Argumentieren. Hinzu komme das Problem der Datensicherheit: Welche Informationen '
          + 'werden gespeichert, und wer hat Zugriff darauf?</p>'
          + '<p>Fachleute schlagen deshalb einen Mittelweg vor. Die Technik solle als Werkzeug '
          + 'begriffen werden, nicht als Ersatz. Entscheidend sei, dass Lehrkräfte den '
          + 'Einsatz begleiten und klare Regeln aufstellen. Zusammenfassend lässt sich sagen: '
          + 'Die künstliche Intelligenz wird bleiben — die Frage ist nicht ob, sondern wie '
          + 'wir sie nutzen.</p></div>',
      exos:[{q:'Richtig oder Falsch : KI-Hilfe kostet in der Regel viel Geld.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">… in Sekundenschnelle und <b>kostenlos</b>.</span>'},
            {q:'Richtig oder Falsch : Eine Lehrkraft kann laut Befürwortern auf 30 Schüler '
               + 'individuell eingehen.',opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">… während eine Lehrkraft mit dreißig Schülern '
               + '<b>kaum</b> auf alle eingehen könne.</span>'},
            {q:'Richtig oder Falsch : Kritiker fürchten, dass das eigene Denken ausgelagert wird.',
             opts:['Richtig','Falsch'],a:0,
             why:'<span class="de-in">… dass die Gefahr bestehe, <b>das eigene Denken '
               + 'auszulagern</b>.</span>'},
            {q:'Welchen Mittelweg schlagen Fachleute vor?',
             opts:['KI als Werkzeug, begleitet von Lehrkräften mit klaren Regeln.',
                   'KI komplett verbieten.',
                   'KI ohne Kontrolle nutzen.',
                   'Nur in der Universität einsetzen.'],a:0,
             why:'<span class="de-in">Die Technik solle als <b>Werkzeug</b> begriffen werden … '
               + 'dass Lehrkräfte den Einsatz <b>begleiten</b> und klare Regeln aufstellen.</span>'},
            {q:'Welcher Konjunktiv steht im Text ?',
             opts:['Konjunktiv I (Rede indirekte) : «fördern könne»',
                   'Konjunktiv II : «fördern könnte»',
                   'Imperativ : «Fördere!»',
                   'Futur I : «wird fördern»'],a:0,
             why:'<span class="de-in">könne · passe … an · stehe · bestehe</span> = '
               + '<b>Konjunktiv I</b> (discours rapporté, typique de la presse).'},
            {q:'Was bedeutet «die Frage ist nicht ob, sondern wie» ?',
             opts:['Die KI kommt — entscheidend ist ihr Einsatz.',
                   'Die KI kommt nicht.',
                   'Niemand weiß, ob die KI kommt.',
                   'Die Frage ist unwichtig.'],a:0,
             why:'Dernière phrase : la question n’est plus <b>si</b> mais <b>comment</b>.'}]},

    { n:4, de:'Textproduktion — «Chance oder Gefahr?»', ar:'إنتاج كتابي ✍️ فرصة أم خطر؟', dur:60,
      obj:['كتابة نص حجاجي متوازن 12 سطراً','4 جمل بالمصدر مع zu','Funktionsverbgefüge','Konjunktiv I للتقرير'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً حجاجياً من '
          + '<b>10 إلى 12 سطراً</b> : « الذكاء الاصطناعي في المدرسة : فرصة أم خطر؟ »'
          + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
          + '<li><b>4 جمل بالمصدر مع zu</b> (dont 1 × um…zu, 1 × ohne…zu)</li>'
          + '<li><b>2 Funktionsverbgefüge</b> (eine Entscheidung treffen · in Betracht ziehen · '
          + 'zur Folge haben · Kritik üben an)</li>'
          + '<li><b>1 nominalisation</b> (wegen / trotz + Genitiv)</li>'
          + '<li>حجتان لكل طرف + رأيك المعلّل</li>'
          + '<li>خاتمة تركيبة (Zusammenfassend lässt sich sagen, dass …)</li>'
          + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
           + '<p>Seit die künstliche Intelligenz öffentlich zugänglich ist, wird intensiv über '
           + 'ihren Einsatz in der Schule diskutiert. Meiner Meinung nach ist sie weder eine '
           + 'reine Chance noch eine reine Gefahr, sondern ein Werkzeug, dessen Wirkung vom '
           + 'Umgang abhängt.</p>'
           + '<p>Für die Technik spricht, dass sie jeden Lernenden individuell zu fördern '
           + 'vermag. Ein Programm ist in der Lage, sich dem Tempo des Schülers anzupassen, '
           + 'ohne ihn vor der Klasse bloßzustellen. Außerdem steht die Hilfe rund um die Uhr '
           + 'zur Verfügung, um auch dort Lernen zu ermöglichen, wo es keine Nachhilfelehrer gibt.</p>'
           + '<p>Gegen einen unkontrollierten Einsatz lässt sich jedoch Kritik üben: Wer nur '
           + 'noch Antworten kopiert, übt weder Formulieren noch Argumentieren. Trotz dieser '
           + 'Bedenken wäre ein Verbot unrealistisch, denn die Technologie ist längst '
           + 'im Alltag angekommen.</p>'
           + '<p>Deshalb sollten Lehrkräfte eine Entscheidung treffen und klare Regeln '
           + 'aufstellen. Zusammenfassend lässt sich sagen, dass die künstliche Intelligenz '
           + 'bleiben wird — entscheidend ist nicht ob, sondern wie wir sie nutzen.</p>'
           + '</div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك الحجاجي هنا:',
             ph:'Seit die künstliche Intelligenz … wird diskutiert. Meiner Meinung nach …'}]}
  ],

  devoir: {
    titre:'Évaluation — 3AS Einheit 4 : Wissenschaft und Technologie',
    unite:4, niveau:'3AS', duree:60, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit', pts:8,
        texte:'<div class="reading"><p><b>Künstliche Intelligenz in der Schule</b></p>'
            + '<p>Seit ChatGPT öffentlich zugänglich ist, hat sich der Unterricht verändert. '
            + 'Schülerinnen und Schüler lassen sich Aufsätze zusammenfassen, Formeln erklären '
            + 'und Vokabeln abfragen — alles in Sekundenschnelle und kostenlos.</p>'
            + '<p>Befürworter betonen, dass die künstliche Intelligenz individuell fördern '
            + 'könne. Ein Programm passe sich dem Tempo jedes Lernenden an, während eine '
            + 'Lehrkraft mit dreißig Schülern kaum auf alle eingehen könne.</p>'
            + '<p>Kritiker wenden jedoch ein, dass die Gefahr bestehe, das eigene Denken '
            + 'auszulagern. Hinzu komme das Problem der Datensicherheit.</p>'
            + '<p>Fachleute schlagen einen Mittelweg vor: Die Technik solle als Werkzeug '
            + 'begriffen werden, nicht als Ersatz. Die Frage ist nicht ob, sondern wie '
            + 'wir sie nutzen.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Die KI-Hilfe ist laut Text meist teuer.',pts:1,rep:'Falsch',
           just:'<span class="de-in">… in Sekundenschnelle und <b>kostenlos</b>.</span>'},
          {id:'I.2',type:'vf',t:'Ein Programm kann sich dem Tempo jedes Lernenden anpassen.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Ein Programm <b>passe sich dem Tempo jedes Lernenden an</b>.</span>'},
          {id:'I.3',type:'vf',t:'Kritiker fürchten das Auslagern des eigenen Denkens.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… dass die Gefahr bestehe, das eigene Denken auszulagern.</span>'},
          {id:'I.4',type:'vf',t:'Fachleute fordern ein vollständiges Verbot.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Fachleute schlagen einen <b>Mittelweg</b> vor.</span>'},
          {id:'I.5',type:'txt',t:'Welches zusätzliche Problem nennen die Kritiker?',pts:2,
           rep:'Das Problem der Datensicherheit.',key:['datensicherheit'],
           just:'<span class="de-in">Hinzu komme das Problem der <b>Datensicherheit</b>.</span>'},
          {id:'I.6',type:'txt',t:'Erkläre den letzten Satz: «Die Frage ist nicht ob, sondern wie.»',pts:2,
           rep:'Die KI wird bleiben; entscheidend ist der richtige Umgang mit ihr.',
           key:['bleiben','umgang','wie'],just:'La question n’est plus <b>si</b> mais <b>comment</b>.'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Ich habe vor, Deutsch ___ .»',
           opts:['zu lernen','lernen','lerne','gelernt'],a:0,pts:1,
           why:'vorhaben + <b>zu</b> + Infinitiv final.'},
          {id:'II.2',type:'qcm',t:'«Er vergisst, mich ___ .» (anrufen)',
           opts:['anzurufen','zu anrufen','anrufen zu','gerufen'],a:0,pts:1,
           why:'Verbe séparable : zu s’insère → an<b>zu</b>rufen.'},
          {id:'II.3',type:'qcm',t:'«Ich lerne Deutsch, ___ in Deutschland zu studieren.»',
           opts:['um','ohne','statt','für'],a:0,pts:1,
           why:'Le but → <b>um … zu</b>.'},
          {id:'II.4',type:'qcm',t:'«eine Entscheidung ___»',
           opts:['treffen','machen','tun','geben'],a:0,pts:1,
           why:'Funktionsverbgefüge fixé : eine Entscheidung <b>treffen</b>.'},
          {id:'II.5',type:'txt',t:'Nominalisiere : «Weil es regnet, …»',pts:1,
           rep:'Wegen des Regens',key:['wegen des regens'],just:'weil → wegen + Genitiv.'},
          {id:'II.6',type:'txt',t:'Verbalisiere : «Trotz seiner Krankheit kam er.»',pts:1,
           rep:'Obwohl er krank war, kam er.',key:['obwohl','krank'],just:'trotz → obwohl + subordonnée.'},
          {id:'II.7',type:'txt',t:'Traduis : «بدون أن يفكّر»',pts:1,
           rep:'ohne zu denken',key:['ohne zu denken'],just:'ohne … zu = دون أن.'},
          {id:'II.8',type:'txt',t:'Passiv + modal : «يجب أن تُحترم القواعد»',pts:1,
           rep:'Die Regeln müssen respektiert werden.',key:['müssen','respektiert werden'],
           just:'Modal + P.II + <b>werden</b>.'}
        ]},
      { id:'III', t:'✍️ Production écrite', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً حجاجياً من 10 أسطر : « الذكاء الاصطناعي في المدرسة : فرصة أم خطر؟ » '
             + '— 4 جمل بالمصدر مع zu (منها um…zu و ohne…zu)، 2 Funktionsverbgefüge، '
             + '1 nominalisation (wegen/trotz)، حجتان لكل طرف، وخاتمة تركيبة.',
           grille:[['4 جمل بالمصدر مع zu (dont um…zu et ohne…zu)','1.0'],
                   ['2 Funktionsverbgefüge correctement employés','1.0'],
                   ['1 nominalisation (wegen/trotz + Genitiv)','0.5'],
                   ['حجتان لكل طرف + رأي معلّل','0.5'],
                   ['خاتمة تركيبة (Zusammenfassend …)','0.5'],
                   ['مفردات الوحدة (8 كلمات)','0.5'],
                   ['الإملاء، المajuscules، الترقيم','0.5']],
           modele:'<div class="reading"><p>Seit die künstliche Intelligenz öffentlich '
                + 'zugänglich ist, wird intensiv über ihren Einsatz diskutiert. Meiner Meinung '
                + 'nach ist sie weder eine reine Chance noch eine reine Gefahr, sondern ein '
                + 'Werkzeug.</p><p>Für die Technik spricht, dass sie jeden Lernenden '
                + 'individuell zu fördern vermag. Ein Programm ist in der Lage, sich dem Tempo '
                + 'des Schülers anzupassen, ohne ihn bloßzustellen. Außerdem steht die Hilfe '
                + 'rund um die Uhr zur Verfügung, um Lernen überall zu ermöglichen.</p>'
                + '<p>Gegen einen unkontrollierten Einsatz lässt sich Kritik üben: Wer nur '
                + 'Antworten kopiert, übt weder Formulieren noch Argumentieren. Trotz dieser '
                + 'Bedenken wäre ein Verbot unrealistisch. Deshalb sollten Lehrkräfte eine '
                + 'Entscheidung treffen und klare Regeln aufstellen. Zusammenfassend lässt sich '
                + 'sagen, dass entscheidend nicht ob, sondern wie wir die Technik nutzen.</p></div>'}
        ]}
    ]
  },

  corrige: {
    unite:4, niveau:'3AS',
    titre:'التصحيح النموذجي — 3AS الوحدة 4 : Wissenschaft und Technologie',
    bareme:{ I:8, II:8, III:4, total:20 },
    partie_I:[
      {id:'I.1',reponse:'Falsch',justification:'Alles in Sekundenschnelle und kostenlos.'},
      {id:'I.2',reponse:'Richtig',justification:'Ein Programm passe sich dem Tempo an.'},
      {id:'I.3',reponse:'Richtig',justification:'Die Gefahr bestehe, das eigene Denken auszulagern.'},
      {id:'I.4',reponse:'Falsch',justification:'Fachleute schlagen einen Mittelweg vor.'},
      {id:'I.5',reponse:'Das Problem der Datensicherheit.',justification:'Hinzu komme…'},
      {id:'I.6',reponse:'Die KI wird bleiben; entscheidend ist der Umgang mit ihr.',justification:'nicht ob, sondern wie.'}
    ],
    partie_II:[
      {id:'II.1',reponse:'zu lernen',regle:'vorhaben + zu + Infinitiv'},
      {id:'II.2',reponse:'anzurufen',regle:'zu s’insère dans les verbes séparables'},
      {id:'II.3',reponse:'um',regle:'um … zu = le but'},
      {id:'II.4',reponse:'treffen',regle:'Funktionsverbgefüge fixé'},
      {id:'II.5',reponse:'Wegen des Regens',regle:'weil → wegen + Genitiv'},
      {id:'II.6',reponse:'Obwohl er krank war, kam er.',regle:'trotz → obwohl + subordonnée'},
      {id:'II.7',reponse:'ohne zu denken',regle:'ohne … zu = sans …'},
      {id:'II.8',reponse:'Die Regeln müssen respektiert werden.',regle:'Modal + P.II + werden'}
    ],
    partie_III:{
      bareme:[['4 infinitifs avec zu','1.0'],['2 Funktionsverbgefüge','1.0'],
              ['1 nominalisation','0.5'],['2 arguments par camp','0.5'],
              ['conclusion synthétique','0.5'],['vocabulaire','0.5'],['orthographe','0.5']],
      modele:'Seit die künstliche Intelligenz zugänglich ist, wird über ihren Einsatz diskutiert. '
           + 'Sie vermag jeden Lernenden individuell zu fördern, ohne ihn bloßzustellen. '
           + 'Außerdem steht die Hilfe rund um die Uhr zur Verfügung, um Lernen überall zu '
           + 'ermöglichen. Gegen einen unkontrollierten Einsatz lässt sich Kritik üben. '
           + 'Trotz dieser Bedenken wäre ein Verbot unrealistisch. Deshalb sollten Lehrkräfte '
           + 'eine Entscheidung treffen. Zusammenfassend lässt sich sagen, dass entscheidend '
           + 'nicht ob, sondern wie wir die Technik nutzen.',
      seuils:{'16-20':'ممتاز — Sehr gut 🏆','14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖','0-9.9':'يحتاج مراجعة الوحدة 🔁'}
    },
    erreurs_frequentes:[
      '~~Ich habe vor Deutsch lernen~~ → <b>zu</b> obligatoire : vorhaben, Deutsch <b>zu</b> lernen.',
      '~~zu anrufen~~ → verbe séparable : <b>an</b>zu<b>rufen</b> (zu au milieu).',
      '~~Ich kann zu kommen~~ → après un <b>modal</b>, jamais de zu : Ich kann kommen.',
      '~~Ich lerne, um ich reise~~ → même sujet exigé ; sinon <b>damit</b> : … damit ich reise.',
      '~~eine Entscheidung machen~~ → Funktionsverbgefüge fixé : eine Entscheidung <b>treffen</b>.',
      '~~der Lernen~~ → infinitif substantivé = <b>neutre</b> : <b>das</b> Lernen.',
      '~~Weil des Regens~~ → <b>wegen</b> des Regens (weil est une conjonction, pas une préposition).',
      '~~ohne zu denken nicht~~ → double négation interdite : <b>ohne zu denken</b>.'
    ]
  }
};

/* ══════════ UNITÉ 5 — Wirtschaft und Arbeit ══════════ */
const U3AS_5 = {
  meta: { n:5, niveau:'3AS', de:'Wirtschaft und Arbeit', ar:'الاقتصاد والعمل',
    trimestre:2, periode:'فيفري — مارس', duree_totale:240, cecrl:'B2',
    icon:'💼',
    objectifs:['الحديث عن عالم الشغل','استعمال الكلام المنقول (Konjunktiv I)','فهم نص اقتصادي',
               'إنتاج نص حجاجي حول البطالة'],
    competences:['Leseverstehen','Schreiben','Sprechen','Hörverstehen'],
    vocabulaire_cle:['die Wirtschaft','die Arbeitslosigkeit','das Unternehmen','der Arbeitgeber',
                     'die Bewerbung','das Vorstellungsgespräch'],
    grammaire_cle:['Konjunktiv I (indirekte Rede)','indirekte Fragen mit ob',
                   'Passiversatzformen','Konnektoren (obwohl · trotzdem · daher)'] },

  seances: [
    { n:1, de:'Arbeitswelt und Bewerbung', ar:'عالم الشغل والتوظيف', dur:60,
      obj:['معجم الشغل','خطاب التغطية','المقابلة الشفوية'],
      lex:[['die Wirtschaft','الاقتصاد'],['die Arbeitslosigkeit','البطالة'],
           ['das Unternehmen','المؤسسة'],['der Arbeitgeber','ربّ العمل'],
           ['der Arbeitnehmer','الأجير'],['die Bewerbung','ملف الترشّح'],
           ['das Vorstellungsgespräch','مقابلة التوظيف'],['der Lebenslauf','السيرة الذاتية'],
           ['das Zeugnis','الشهادة'],['die Stelle','المنصب'],
           ['das Gehalt','الأجر'],['die Ausbildung','التكوين المهني'],
           ['das Praktikum','ال التربص'],['kündigen','يفسخ العقد'],
           ['befristet','محدّد المدة'],['unbefristet','غير محدّد المدة']],
      gram:{t:'Konjunktiv I — discours rapporté (presse, rapports, comptes rendus)',
        b:['Formation : radical du présent + <b>-e / -est / -e / -en / -et / -en</b>.',
           '<span class="de-in">er <b>sei</b> · er <b>habe</b> · er <b>komme</b> · er <b>könne</b></span>',
           'Si le Konjunktiv I est identique à l’indicatif (wir/sie), on bascule sur le '
       + '<b>Konjunktiv II</b>.',
           'Question indirecte : <b>ob</b> (oui/non) ou le <b>W-Wort</b> (question ouverte) '
       + '+ verbe à la fin.'],
        tbl:[['sein','ich sei','du seiest','er sei','wir seien','ihr seiet','sie seien'],
             ['haben','ich habe','du habest','er habe','wir hätten','ihr hättet','sie hätten'],
             ['kommen','er komme','—','—','sie kämen','—','—']],
        ex:'<span class="de-in">Der Minister erklärte, die Lage <b>sei</b> stabil und man '
         + '<b>habe</b> bereits Maßnahmen ergriffen.</span>'},
      exos:[{q:'Rapporte : «Ich bin krank.» → Er sagt, er ___ krank.',
             opts:['sei','ist','war','wäre'],a:0,
             why:'Konjunktiv I de sein → <b>sei</b>.'},
            {q:'Rapporte : «Wir haben keine Zeit.» → Sie sagen, sie ___ keine Zeit.',
             opts:['hätten','haben','hätten','habe'],a:0,
             why:'À la 3ᵉ personne du pluriel, K-I = indicatif → bascule sur <b>Konjunktiv II</b>.'},
            {q:'Question indirecte oui/non : «Kommst du?» → Er fragt, ___ ich komme.',
             opts:['ob','dass','wenn','was'],a:0,
             why:'Question fermée → <b>ob</b>.'},
            {q:'«Er fragte, wann der Zug ___ .»',opts:['abfahre','abfährt','abfuhr',
                                                      'würde abfahren'],a:0,
             why:'Question ouverte en W → W-Wort + sujet + verbe <b>à la fin</b> au K-I.'},
            {q:'«die Stelle ist ___» (محدّدة المدة)',opts:['befristet','unbefristet',
                                                          'gekündigt','beworben'],a:0,
             why:'<span class="de-in"><b>befristet</b></span> = محدّدة المدة.'}]},

    { n:2, de:'Passiversatzformen', ar:'بدائل المبني للمجهول', dur:60,
      obj:['4 بدائل للمبني للمجهول','التفريق بين الإمكان والضرورة','الأسلوب الإداري'],
      lex:[['man kann …','يمكن (= kann + Passiv)'],
           ['sich lassen + Inf.','يمكن (= lässt sich)'],
           ['-bar / -lich','قابل لـ (= kann … werden)'],
           ['sein + zu + Inf.','يجب / يمكن (= muss/kann … werden)'],
           ['zu prüfen','يجب فحصه'],['nicht lösbar','غير قابل للحل']],
      gram:{t:'Les quatre substituts du Passiv — incontournables au BAC',
        tbl:[['man kann das Problem lösen','das Problem kann gelöst werden'],
             ['das Problem lässt sich lösen','das Problem kann gelöst werden'],
             ['das Problem ist lösbar','das Problem kann gelöst werden'],
             ['das Problem ist zu lösen','das Problem muss gelöst werden']],
        b:['<b>sich lassen</b> + Infinitiv = possibilité passive.',
           'Adjectifs en <b>-bar</b> / <b>-lich</b> = possibilité : lös<b>bar</b>, '
       + 'mach<b>bar</b>, verständ<b>lich</b>.',
           '<b>sein + zu + Infinitiv</b> = <b>obligation</b> (müssen) ou '
       + '<b>possibilité</b> (können) selon le contexte ; la négation <b>nicht</b> '
       + 'donne presque toujours l’obligation.',
           '⚠️ Ces formes sont <b>actives</b> en apparence mais <b>passives</b> en sens.'],
        ex:'<span class="de-in">Die Aufgabe <b>ist bis Freitag zu erledigen</b>.</span> '
         + '= doit être accomplie avant vendredi.'},
      exos:[{q:'«Das Problem ___ sich leicht lösen.» (= peut être résolu)',
             opts:['lässt','macht','gibt','stellt'],a:0,
             why:'<span class="de-in"><b>sich lassen</b> + Infinitiv</span> = passif de possibilité.'},
            {q:'«Die Regel ___ zu beachten.» (= doit être respectée)',
             opts:['ist','wird','hat','kann'],a:0,
             why:'<b>sein + zu + Infinitiv</b> = obligation passive.'},
            {q:'Adjectif signifiant «قابل للحل» :',opts:['lösbar','lösend','gelöst','löslich nicht'],a:0,
             why:'Suffixe <b>-bar</b> = possibilité passive.'},
            {q:'«man kann das Ergebnis überprüfen» → forme passive :',
             opts:['Das Ergebnis kann überprüft werden.',
                   'Das Ergebnis kann überprüfen.',
                   'Das Ergebnis ist zu überprüfen können.',
                   'Das Ergebnis lässt überprüft.'],a:0,
             why:'Modal + Partizip II + <b>werden</b>.'},
            {q:'«Die Tür ist nicht zu öffnen.» signifie :',
             opts:['La porte ne peut pas être ouverte.','La porte doit être ouverte.',
                   'La porte est ouverte.','La porte ne doit pas être fermée.'],a:0,
             why:'<b>nicht + sein + zu</b> = impossibilité passive.'}]},

    { n:3, de:'Textverständnis : «Jugendarbeitslosigkeit in Algerien»', ar:'فهم نص — بطالة الشباب في الجزائر', dur:60,
      obj:['قراءة نص اقتصادي','استخراج الأرقام والمصادر','repérage du Konjunktiv I','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Jugendarbeitslosigkeit in Algerien</b></p>'
          + '<p>Nach Angaben des nationalen Statistikamts ist fast jeder dritte Arbeitslose '
          + 'jünger als dreißig Jahre. Betroffen sind besonders Hochschulabsolventen: '
          + 'Jährlich verlassen rund 250 000 junge Menschen die Universitäten, während die '
          + 'Wirtschaft nicht genügend qualifizierte Stellen schafft.</p>'
          + '<p>Ökonomen weisen darauf hin, dass das Problem strukturell sei. Die Ausbildung '
          + 'entspreche oft nicht den Bedürfnissen der Unternehmen. Ein Ingenieur könne '
          + 'theoretisch hervorragend ausgebildet sein, ohne die Software zu kennen, '
          + 'die in der Praxis verwendet werde.</p>'
          + '<p>Die Regierung hat deshalb mehrere Programme aufgelegt. Gefördert werden '
          + 'insbesondere Start-ups, Praktika in Betrieben und Umschulungen im Bereich der '
          + 'erneuerbaren Energien. Kritiker bezweifeln jedoch, dass diese Maßnahmen ausreichen. '
          + 'Sie fordern eine tiefgreifende Reform des Bildungssystems.</p>'
          + '<p>Trotz aller Schwierigkeiten gibt es ermutigende Beispiele: In Sétif haben '
          + 'zehn ehemalige Studierende ein Unternehmen gegründet, das Solaranlagen wartet '
          + 'und inzwischen dreißig Mitarbeiter beschäftigt. Ihr Rat an die Jugend lautet: '
          + '«Nicht auf den Staat warten, sondern selbst anfangen.»</p></div>',
      exos:[{q:'Richtig oder Falsch : Fast jeder dritte Arbeitslose ist unter 30.',
             opts:['Richtig','Falsch'],a:0,
             why:'<span class="de-in">… ist <b>fast jeder dritte</b> Arbeitslose jünger als '
               + 'dreißig Jahre.</span>'},
            {q:'Richtig oder Falsch : Die Wirtschaft schafft genügend qualifizierte Stellen.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">… während die Wirtschaft <b>nicht genügend</b> qualifizierte '
               + 'Stellen schafft.</span>'},
            {q:'Richtig oder Falsch : Kritiker halten die Maßnahmen für ausreichend.',
             opts:['Richtig','Falsch'],a:1,
             why:'<span class="de-in">Kritiker <b>bezweifeln</b>, dass diese Maßnahmen '
               + 'ausreichen.</span>'},
            {q:'Wie viele Absolventen verlassen jährlich die Universitäten?',
             opts:['150 000','250 000','300 000','30 000'],a:1,
             why:'<span class="de-in">Jährlich verlassen rund <b>250 000</b> junge Menschen '
               + 'die Universitäten.</span>'},
            {q:'Warum ist das Problem laut den Ökonomen strukturell?',
             opts:['Weil die Ausbildung nicht den Bedürfnissen der Unternehmen entspricht.',
                   'Weil es zu wenige Studierende gibt.',
                   'Weil die Löhne zu hoch sind.',
                   'Weil niemand arbeiten will.'],a:0,
             why:'<span class="de-in">Die Ausbildung <b>entspreche</b> oft nicht den Bedürfnissen '
               + 'der Unternehmen.</span>'},
            {q:'Wie lautet der Rat der Gründer von Sétif?',
             opts:['«Nicht auf den Staat warten, sondern selbst anfangen.»',
                   '«Auf den Staat warten.»',
                   '«Ins Ausland gehen.»',
                   '«Weiter studieren.»'],a:0,
             why:'Dernière phrase du texte.'}]},

    { n:4, de:'Textproduktion — «Was tun gegen Jugendarbeitslosigkeit?»', ar:'إنتاج كتابي ✍️ ماذا نفعل ضد بطالة الشباب؟', dur:60,
      obj:['كتابة نص حجاجي 12 سطراً','Konjunktiv I للتقرير','4 بدائل للمبني للمجهول','chiffres + sources'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً حجاجياً من '
          + '<b>10 إلى 12 سطراً</b> حول بطالة الشباب في الجزائر :'
          + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
          + '<li><b>2 جمل بالكلام المنقول</b> (Konjunktiv I : sei · habe · könne)</li>'
          + '<li><b>2 بديل للمبني للمجهول</b> (sich lassen · sein + zu · -bar)</li>'
          + '<li><b>1 رقم</b> و <b>1 مصدر</b> (Nach Angaben … / Laut Statistik …)</li>'
          + '<li>عرض المشكل → الأسباب → 3 حلول → رأيك</li>'
          + '<li>خاتمة تركيبة</li>'
          + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
           + '<p>Nach Angaben des nationalen Statistikamts ist fast jeder dritte Arbeitslose '
           + 'jünger als dreißig Jahre. Ökonomen weisen darauf hin, dass das Problem '
           + 'strukturell sei: Die Ausbildung entspreche oft nicht den Bedürfnissen der '
           + 'Unternehmen.</p>'
           + '<p>Diese Situation lässt sich nicht mit einzelnen Maßnahmen beheben. Erstens '
           + 'sollte die Ausbildung praxisnäher gestaltet werden, damit Absolventen die '
           + 'Software beherrschen, die in Betrieben tatsächlich verwendet wird. Zweitens '
           + 'sind Praktika verpflichtend in den Studiengang einzubauen — eine Aufgabe, '
           + 'die nicht aufgeschoben werden kann.</p>'
           + '<p>Drittens sollten Start-ups stärker gefördert werden. In Sétif haben zehn '
           + 'ehemalige Studierende ein Unternehmen gegründet, das Solaranlagen wartet und '
           + 'inzwischen dreißig Mitarbeiter beschäftigt. Ihr Beispiel zeigt, dass sich '
           + 'Arbeitsplätze auch selbst schaffen lassen.</p>'
           + '<p>Meiner Meinung nach darf man nicht nur auf den Staat warten. '
           + 'Zusammenfassend lässt sich sagen, dass das Problem zwar ernst, aber lösbar ist — '
           + 'vorausgesetzt, Bildung, Wirtschaft und Jugend ziehen an einem Strang.</p>'
           + '</div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك الحجاجي هنا:',
             ph:'Nach Angaben des nationalen Statistikamts ist …'}]}
  ],

  devoir: {
    titre:'Évaluation — 3AS Einheit 5 : Wirtschaft und Arbeit',
    unite:5, niveau:'3AS', duree:60, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit', pts:8,
        texte:'<div class="reading"><p><b>Jugendarbeitslosigkeit in Algerien</b></p>'
            + '<p>Nach Angaben des nationalen Statistikamts ist fast jeder dritte Arbeitslose '
            + 'jünger als dreißig Jahre. Betroffen sind besonders Hochschulabsolventen: '
            + 'Jährlich verlassen rund 250 000 junge Menschen die Universitäten, während die '
            + 'Wirtschaft nicht genügend qualifizierte Stellen schafft.</p>'
            + '<p>Ökonomen weisen darauf hin, dass das Problem strukturell sei. Die Ausbildung '
            + 'entspreche oft nicht den Bedürfnissen der Unternehmen.</p>'
            + '<p>Die Regierung hat mehrere Programme aufgelegt; gefördert werden Start-ups, '
            + 'Praktika und Umschulungen. Kritiker bezweifeln jedoch, dass diese Maßnahmen '
            + 'ausreichen. Trotz aller Schwierigkeiten haben in Sétif zehn ehemalige Studierende '
            + 'ein Unternehmen gegründet, das inzwischen dreißig Mitarbeiter beschäftigt. '
            + 'Ihr Rat lautet: «Nicht auf den Staat warten, sondern selbst anfangen.»</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Fast jeder dritte Arbeitslose ist unter 30 Jahre alt.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… fast jeder dritte Arbeitslose jünger als dreißig Jahre.</span>'},
          {id:'I.2',type:'vf',t:'Die Wirtschaft schafft genügend qualifizierte Stellen.',pts:1,rep:'Falsch',
           just:'<span class="de-in">… <b>nicht genügend</b> qualifizierte Stellen schafft.</span>'},
          {id:'I.3',type:'vf',t:'Kritiker halten die Maßnahmen für ausreichend.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Kritiker <b>bezweifeln</b>, dass diese Maßnahmen ausreichen.</span>'},
          {id:'I.4',type:'vf',t:'Das Unternehmen in Sétif beschäftigt dreißig Mitarbeiter.',pts:1,rep:'Richtig',
           just:'<span class="de-in">… inzwischen <b>dreißig Mitarbeiter</b> beschäftigt.</span>'},
          {id:'I.5',type:'txt',t:'Warum ist das Problem laut den Ökonomen strukturell?',pts:2,
           rep:'Weil die Ausbildung oft nicht den Bedürfnissen der Unternehmen entspricht.',
           key:['ausbildung','bedürfnissen'],just:'2ᵉ paragraphe (Konjunktiv I : entspreche).'},
          {id:'I.6',type:'txt',t:'Wie lautet der Rat der Gründer?',pts:2,
           rep:'Nicht auf den Staat warten, sondern selbst anfangen.',
           key:['staat','selbst anfangen'],just:'Dernière phrase.'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'Er sagt : «Ich bin krank.» → Er sagt, er ___ krank.',
           opts:['sei','ist','war','wäre'],a:0,pts:1,
           why:'Konjunktiv I de sein → <b>sei</b>.'},
          {id:'II.2',type:'qcm',t:'«Das Problem ___ sich leicht lösen.»',
           opts:['lässt','macht','gibt','stellt'],a:0,pts:1,
           why:'<b>sich lassen</b> + Infinitiv = passif de possibilité.'},
          {id:'II.3',type:'qcm',t:'«Die Regel ___ zu beachten.» (obligation passive)',
           opts:['ist','wird','hat','kann'],a:0,pts:1,
           why:'<b>sein + zu + Infinitiv</b> = obligation.'},
          {id:'II.4',type:'qcm',t:'Question indirecte fermée : Er fragt, ___ ich komme.',
           opts:['ob','dass','wenn','was'],a:0,pts:1,
           why:'Question oui/non → <b>ob</b>.'},
          {id:'II.5',type:'txt',t:'Adjectif «قابل للحل» :',pts:1,rep:'lösbar',
           key:['lösbar'],just:'Suffixe <b>-bar</b> = possibilité passive.'},
          {id:'II.6',type:'txt',t:'Rapporte : «Wir haben keine Zeit.» → Sie sagen, sie ___ keine Zeit.',pts:1,
           rep:'hätten',key:['hätten'],
           just:'K-I identique à l’indicatif au pluriel → bascule sur Konjunktiv II.'},
          {id:'II.7',type:'txt',t:'Traduis : «يجب فحص النتائج»',pts:1,
           rep:'Die Ergebnisse sind zu prüfen.',key:['sind zu prüfen'],
           just:'<b>sein + zu + Infinitiv</b> = obligation passive.'},
          {id:'II.8',type:'txt',t:'Complète : «Nach ___ des Statistikamts» (حسب)',pts:1,
           rep:'Angaben',key:['angaben'],just:'Expression figée : <b>Nach Angaben</b> + Genitiv.'}
        ]},
      { id:'III', t:'✍️ Production écrite', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً حجاجياً من 10 أسطر حول بطالة الشباب : 2 جمل بالكلام المنقول '
             + '(Konjunktiv I)، 2 بديل للمبني للمجهول، 1 رقم + 1 مصدر، '
             + 'المشكل ← الأسباب ← 3 حلول ← رأيك، وخاتمة تركيبة.',
           grille:[['2 جمل بـ Konjunktiv I (sei · habe · entspreche)','1.0'],
                   ['2 بدائل للمبني للمجهول (sich lassen · sein zu · -bar)','1.0'],
                   ['1 رقم + 1 مصدر (Nach Angaben …)','0.5'],
                   ['بنية : مشكل ← أسباب ← 3 حلول ← رأي','0.5'],
                   ['خاتمة تركيبة','0.5'],
                   ['مفردات الوحدة (8 كلمات)','0.5'],
                   ['الإملاء، المajuscules، الترقيم','0.5']],
           modele:'<div class="reading"><p>Nach Angaben des nationalen Statistikamts ist fast '
                + 'jeder dritte Arbeitslose jünger als dreißig Jahre. Ökonomen weisen darauf '
                + 'hin, dass das Problem strukturell sei: Die Ausbildung entspreche oft nicht '
                + 'den Bedürfnissen der Unternehmen.</p><p>Diese Situation lässt sich nicht mit '
                + 'einzelnen Maßnahmen beheben. Erstens sollte die Ausbildung praxisnäher '
                + 'gestaltet werden. Zweitens sind Praktika verpflichtend in den Studiengang '
                + 'einzubauen — eine Aufgabe, die nicht aufgeschoben werden kann.</p>'
                + '<p>Drittens sollten Start-ups stärker gefördert werden. In Sétif haben zehn '
                + 'ehemalige Studierende ein Unternehmen gegründet, das dreißig Mitarbeiter '
                + 'beschäftigt. Zusammenfassend lässt sich sagen, dass das Problem zwar ernst, '
                + 'aber lösbar ist.</p></div>'}
        ]}
    ]
  },

  corrige: {
    unite:5, niveau:'3AS',
    titre:'التصحيح النموذجي — 3AS الوحدة 5 : Wirtschaft und Arbeit',
    bareme:{ I:8, II:8, III:4, total:20 },
    partie_I:[
      {id:'I.1',reponse:'Richtig',justification:'Fast jeder dritte Arbeitslose ist unter 30.'},
      {id:'I.2',reponse:'Falsch',justification:'Die Wirtschaft schafft nicht genügend Stellen.'},
      {id:'I.3',reponse:'Falsch',justification:'Kritiker bezweifeln, dass die Maßnahmen ausreichen.'},
      {id:'I.4',reponse:'Richtig',justification:'… dreißig Mitarbeiter beschäftigt.'},
      {id:'I.5',reponse:'Weil die Ausbildung nicht den Bedürfnissen der Unternehmen entspricht.',justification:'Konjunktiv I : entspreche.'},
      {id:'I.6',reponse:'Nicht auf den Staat warten, sondern selbst anfangen.',justification:'Dernière phrase.'}
    ],
    partie_II:[
      {id:'II.1',reponse:'sei',regle:'Konjunktiv I de sein'},
      {id:'II.2',reponse:'lässt',regle:'sich lassen + Infinitiv'},
      {id:'II.3',reponse:'ist',regle:'sein + zu + Infinitiv = obligation'},
      {id:'II.4',reponse:'ob',regle:'question fermée → ob'},
      {id:'II.5',reponse:'lösbar',regle:'suffixe -bar = possibilité passive'},
      {id:'II.6',reponse:'hätten',regle:'K-I = indicatif au pluriel → K-II'},
      {id:'II.7',reponse:'Die Ergebnisse sind zu prüfen.',regle:'sein + zu = obligation passive'},
      {id:'II.8',reponse:'Angaben',regle:'Nach Angaben + Genitiv'}
    ],
    partie_III:{
      bareme:[['2 Konjunktiv I','1.0'],['2 Passiversatzformen','1.0'],['chiffre + source','0.5'],
              ['structure problème→solutions','0.5'],['conclusion','0.5'],
              ['vocabulaire','0.5'],['orthographe','0.5']],
      modele:'Nach Angaben des Statistikamts ist fast jeder dritte Arbeitslose unter dreißig. '
           + 'Ökonomen weisen darauf hin, dass das Problem strukturell sei. Diese Situation '
           + 'lässt sich nicht mit einzelnen Maßnahmen beheben. Praktika sind verpflichtend '
           + 'einzubauen. Drittens sollten Start-ups gefördert werden. Zusammenfassend lässt '
           + 'sich sagen, dass das Problem ernst, aber lösbar ist.',
      seuils:{'16-20':'ممتاز — Sehr gut 🏆','14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖','0-9.9':'يحتاج مراجعة الوحدة 🔁'}
    },
    erreurs_frequentes:[
      '~~Er sagt, er ist krank~~ → discours rapporté : Konjunktiv I → er <b>sei</b> krank.',
      '~~Sie sagen, sie haben~~ → K-I identique à l’indicatif → bascule sur K-II : sie <b>hätten</b>.',
      '~~Er fragt, dass ich komme~~ → question fermée → <b>ob</b> ich komme.',
      '~~Das Problem lässt sich lösen können~~ → une seule marque de possibilité : '
      + '<b>lässt sich lösen</b> OU <b>kann gelöst werden</b>.',
      '~~Die Regel ist beachten~~ → <b>sein + zu + Infinitiv</b> : ist <b>zu</b> beachten.',
      '~~löslichbar~~ → un seul suffixe : lös<b>bar</b> OU lös<b>lich</b>.',
      '~~Nach dem Statistikamt~~ → expression figée : <b>Nach Angaben</b> des Statistikamts.',
      '~~trotz dem Problem~~ → <b>trotz + Genitiv</b> : trotz <b>des</b> Problems.'
    ]
  }
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.U3AS_A = [U3AS_1, U3AS_2, U3AS_3, U3AS_4, U3AS_5];


/* ══════════════════════════════════════════════════════════════════════
   ADAPTATEUR — contrat du registre UNITES d'app.js
   app.js (lignes 217-228) lit, pour U7/U8/U9 :
       UNITES_3AS_A[i].seances · UNITES_3AS_A[i].devoir · UNITES_3AS_A[i].duree_totale
   Le lot A expose { meta:{ duree_totale }, seances, devoir, corrige }.
   On projette donc les 3 premières unités (U7 · U8 · U9) dans la forme attendue,
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

/* Les unités 4 et 5 du lot A (Fortschritt und seine Grenzen · Arbeitswelt und Bewerbung)
   restent disponibles pour un branchement ultérieur (U13/U14). */
window.U3AS_SUPPLEMENT = (window.U3AS_A || []).slice(3);
