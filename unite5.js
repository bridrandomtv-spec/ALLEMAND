/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite5.js
   الوحدة 5 : Essen und Trinken — المأكل والمشرب
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثالث (ouverture)
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE5_META = {
  n: 5,
  de: 'Essen und Trinken',
  ar: 'المأكل والمشرب',
  niveau: '2AS',
  trimestre: 3,
  periode: 'أفريل — جوان',
  duree_totale: 465,
  cecrl: 'A2',
  objectifs: [
    'تسمية الأطعمة والمشروبات مع أدوات التعريف والجمع',
    'استعمال حالة المفعول به Akkusativ بعد essen/trinken/möchten',
    'كتابة وصفة طبخ بصيغة الأمر Imperativ',
    'طلب في المطعم والتسوّق بأدب (Höflichkeitsformeln)',
    'فهم نص حول التغذية الصحية',
    'إنتاج نص وصفي-توجيهي من 8 إلى 10 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['das Lebensmittel', 'das Obst', 'das Gemüse', 'das Gericht',
                    'bestellen', 'bezahlen', 'schmecken', 'das Rezept'],
  grammaire_cle: ['Akkusativ', 'Plural der Nomen', 'Imperativ (Rezepte)',
                  'Höflichkeitsformeln', 'Partitiv: etwas / viel / wenig']
};

/* ══════════ DEVOIR OFFICIEL — الوحدة 5 (/20) ══════════ */
const DEVOIR_U5 = {
  titre:'Évaluation — Einheit 5 : Essen und Trinken',
  unite:5, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Gesund essen in Algerien</b></p>'
          + '<p>Die algerische Küche ist sehr reich und gesund. Traditionell isst man viel '
          + 'Gemüse, Olivenöl, Hülsenfrüchte und frisches Brot. Couscous ist das '
          + 'Nationalgericht: Man isst ihn mit Lammfleisch, Kichererbsen und gedämpftem Gemüse.</p>'
          + '<p>Leider essen viele Jugendliche heute zu viel Fast Food. Sie trinken süße '
          + 'Limonade statt Wasser und kaufen Snacks vor der Schule. Deshalb gibt es immer '
          + 'mehr Übergewicht bei Kindern. Ärzte empfehlen, mindestens fünf Portionen Obst '
          + 'und Gemüse pro Tag zu essen und mindestens anderthalb Liter Wasser zu trinken.</p>'
          + '<p>Ein gesundes Frühstück ist sehr wichtig. Wer ohne Frühstück zur Schule geht, '
          + 'kann sich schlecht konzentrieren. Ein gutes Frühstück besteht aus Brot mit Käse '
          + 'oder Ei, einem Glas Milch und einer Frucht.</p>'
          + '<p>Zusammenfassend kann man sagen: Die traditionelle algerische Küche ist bereits '
          + 'sehr gesund. Das Problem ist nicht das Essen selbst, sondern die neue Lebensweise '
          + 'der jungen Generation.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Couscous ist das algerische Nationalgericht.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Couscous ist das Nationalgericht.</span>'},
        {id:'I.2',type:'vf',t:'Ärzte empfehlen drei Portionen Obst pro Tag.',pts:1,rep:'Falsch',
         just:'<span class="de-in">mindestens <b>fünf</b> Portionen</span> — cinq, pas trois.'},
        {id:'I.3',type:'vf',t:'Jugendliche trinken oft Limonade statt Wasser.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Sie trinken süße Limonade statt Wasser.</span>'},
        {id:'I.4',type:'vf',t:'Das Problem ist die traditionelle algerische Küche.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Das Problem ist <b>nicht</b> das Essen selbst, sondern die neue '
              + 'Lebensweise.</span>'},
        {id:'I.5',type:'txt',t:'Warum ist ein Frühstück wichtig?',pts:2,
         rep:'Weil man sich ohne Frühstück schlecht konzentrieren kann.',
         key:['konzentrieren','frühstück'],
         just:'<span class="de-in">Wer ohne Frühstück zur Schule geht, kann sich schlecht '
              + 'konzentrieren.</span>'},
        {id:'I.6',type:'txt',t:'Wie viel Wasser soll man täglich trinken?',pts:2,
         rep:'Mindestens anderthalb Liter.',key:['anderthalb','1,5','eineinhalb'],
         just:'<span class="de-in">mindestens anderthalb Liter Wasser</span> = 1,5 litre.'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich esse ___ Apfel.»',
         opts:['ein','einen','eine','einem'],a:1,pts:1,
         why:'<span class="de-in">der Apfel</span> → Akkusativ masculin → <b>einen</b>.'},
        {id:'II.2',type:'qcm',t:'«Ich trinke ___ Milch.»',
         opts:['ein','einen','eine','einem'],a:2,pts:1,
         why:'<span class="de-in">die Milch</span> féminin → <b>eine</b> (inchangé).'},
        {id:'II.3',type:'qcm',t:'Pluriel von «der Apfel» :',
         opts:['die Apfels','die Äpfel','die Apfel','die Äpfeln'],a:1,pts:1,
         why:'<span class="de-in">der Apfel → die Äpf<b>el</b></span> (avec umlaut).'},
        {id:'II.4',type:'qcm',t:'Impératif (du) de «nehmen» :',
         opts:['Nehme!','Nimm!','Nehmt!','Nehmen!'],a:1,pts:1,
         why:'Verbe fort : <span class="de-in">du nimmst</span> → <b>Nimm!</b>'},
        {id:'II.5',type:'txt',t:'Écris la formule polie : «أرغب في سلطة، من فضلك»',pts:1,
         rep:'Ich hätte gern einen Salat, bitte.',key:['hätte gern','salat'],
         just:'Konjunktiv II de <span class="de-in">haben</span> + Akkusativ masculin.'},
        {id:'II.6',type:'txt',t:'Quel connecteur = «ثم» ?',pts:1,rep:'dann',
         key:['dann'],just:'<span class="de-in">zuerst · dann · danach · schließlich</span>.'},
        {id:'II.7',type:'txt',t:'Traduis : «يجب أن نشرب ماءً كثيراً»',pts:1,
         rep:'Wir sollten viel Wasser trinken.',key:['sollten','wasser','trinken'],
         just:'<span class="de-in">sollen</span> au Konjunktiv → <b>sollten</b> (conseil).'},
        {id:'II.8',type:'txt',t:'Mets à l’impératif (Sie) : «Sie schneiden das Gemüse.»',pts:1,
         rep:'Schneiden Sie das Gemüse!',key:['schneiden sie'],
         just:'Infinitif + <b>Sie</b> + point d’exclamation.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب نصاً من 8 أسطر : قدّم وصفتك الجزائرية المفضّلة (3 أفعال بالأمر، '
           + '3 روابط ترتيب، 4 أطعمة في حالة المفعول به)، أو انصح زميلك بالتغذية الصحية '
           + '(sollte + Es ist wichtig … zu + formule polie).',
         grille:[['3 impératifs (Sie) correctement formés','0.5'],
                 ['3 connecteurs de séquence (zuerst/dann/danach/schließlich)','0.5'],
                 ['4 aliments au Akkusativ avec article correct','1.0'],
                 ['1 formule de politesse (Ich hätte gern… / Könnten Sie…?)','0.5'],
                 ['1 conseil de santé (sollte / Es ist wichtig … zu)','0.5'],
                 ['vocabulaire de l’unité (8 mots minimum)','0.5'],
                 ['orthographe, majuscules des noms, ponctuation','0.5']],
         modele:'<div class="reading"><p>Mein Lieblingsgericht ist Couscous, das '
              + 'Nationalgericht Algeriens. Ich koche es jeden Freitag mit meiner Mutter.</p>'
              + '<p>Zuerst waschen Sie das Gemüse: zwei Karotten, eine Zucchini und eine '
              + 'Zwiebel. Dann schneiden Sie alles klein. Danach geben Sie Öl in einen großen '
              + 'Topf und braten Sie das Fleisch an. Anschließend fügen Sie eine Prise Salz, '
              + 'Tomaten und Wasser hinzu. Kochen Sie alles 40 Minuten. Schließlich dämpfen '
              + 'Sie den Couscous und servieren Sie ihn mit dem Gemüse.</p>'
              + '<p>Ich hätte gern jeden Tag Couscous, aber das ist zu viel! Es ist wichtig, '
              + 'jeden Tag fünf Portionen Obst und Gemüse zu essen. Man sollte nicht zu viel '
              + 'Fast Food essen, denn das ist ungesund. Guten Appetit!</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U5 = {
  unite: 5,
  titre: 'التصحيح النموذجي — الوحدة 5 : Essen und Trinken',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Couscous ist das Nationalgericht.' },
    { id:'I.2', reponse:'Falsch', justification:'Ärzte empfehlen mindestens fünf Portionen, nicht drei.' },
    { id:'I.3', reponse:'Richtig', justification:'Sie trinken süße Limonade statt Wasser.' },
    { id:'I.4', reponse:'Falsch', justification:'Das Problem ist die neue Lebensweise, nicht die traditionelle Küche.' },
    { id:'I.5', reponse:'Weil man sich ohne Frühstück schlecht konzentrieren kann.', justification:'Wer ohne Frühstück zur Schule geht, kann sich schlecht konzentrieren.' },
    { id:'I.6', reponse:'Mindestens anderthalb Liter (1,5 L).', justification:'… mindestens anderthalb Liter Wasser zu trinken.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'einen', regle:'Akkusativ masculin : der → den, ein → einen' },
    { id:'II.2', reponse:'eine', regle:'Akkusativ féminin : inchangé' },
    { id:'II.3', reponse:'die Äpfel', regle:'pluriel en -el avec umlaut' },
    { id:'II.4', reponse:'Nimm!', regle:'impératif du verbe fort : du nimmst → Nimm!' },
    { id:'II.5', reponse:'Ich hätte gern einen Salat, bitte.', regle:'Konjunktiv II de haben + Akkusativ' },
    { id:'II.6', reponse:'dann', regle:'zuerst · dann · danach · schließlich' },
    { id:'II.7', reponse:'Wir sollten viel Wasser trinken.', regle:'sollen → sollten (conseil), infinitif final' },
    { id:'II.8', reponse:'Schneiden Sie das Gemüse!', regle:'impératif Sie = infinitif + Sie' }
  ],
  partie_III: {
    bareme: [['3 impératifs (Sie)','0.5'],['3 connecteurs de séquence','0.5'],
             ['4 aliments au Akkusativ','1.0'],['1 formule de politesse','0.5'],
             ['1 conseil de santé','0.5'],['vocabulaire unité 5','0.5'],
             ['orthographe + majuscules des noms','0.5']],
    modele: 'Mein Lieblingsgericht ist Couscous, das Nationalgericht Algeriens. Zuerst waschen '
          + 'Sie das Gemüse. Dann schneiden Sie alles klein. Danach geben Sie Öl in einen Topf. '
          + 'Kochen Sie alles 40 Minuten. Schließlich servieren Sie den Couscous mit dem Gemüse. '
          + 'Ich hätte gern jeden Tag Couscous! Es ist wichtig, fünf Portionen Obst und Gemüse '
          + 'zu essen. Man sollte nicht zu viel Fast Food essen. Guten Appetit!',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 5 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich esse ein Apfel~~ → Akkusativ masculin : Ich esse <b>einen</b> Apfel.',
    '~~Ich habe Hunger bin~~ → <b>Ich habe Hunger</b> OU <b>Ich bin hungrig</b>, jamais les deux.',
    '~~die Apfels~~ → <b>die Äpfel</b> (pluriel allemand, pas de -s ici).',
    '~~die Obst~~ → <span class="de-in">das Obst</span> est **neutre** et **sans pluriel**.',
    '~~Nehme!~~ (du) → verbe fort : <b>Nimm!</b> · <b>Iss!</b> · <b>Sprich!</b>',
    '~~Ich will einen Kaffee~~ (au restaurant) → forme impolie ; préfère '
    + '<b>Ich hätte gern einen Kaffee</b>.',
    '~~zu der Schule~~ / ~~zu dem Sport~~ → contractions obligatoires : <b>zur Schule</b> · <b>zum Sport</b>.',
    '~~Es ist wichtig viel Wasser trinken~~ → il faut <b>zu</b> : Es ist wichtig, viel Wasser '
    + '<b>zu</b> trinken.',
    '~~Guten Appetit~~ après le repas → se dit **avant** de manger ; après : '
    + '<span class="de-in">Es hat gut geschmeckt</span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE5 = { meta: UNITE5_META, seances: window.SEANCES_U5, devoir: DEVOIR_U5, corrige: CORRIGE_U5 };
