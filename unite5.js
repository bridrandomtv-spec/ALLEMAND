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

const SEANCES_U5 = [
  { n:1, de:'Lebensmittel und Plural', ar:'الأطعمة والجمع', dur:60,
    obj:['تصنيف الأطعمة (Obst / Gemüse / Getränke)','أدوات التعريف der/die/das','قواعد الجمع'],
    lex:[['das Lebensmittel','المواد الغذائية'],['das Obst','الفواكه'],
         ['das Gemüse','الخضروات'],['das Brot','الخبز'],['der Apfel','التفاحة'],
         ['die Banane','الموزة'],['die Orange','البرتقالة'],['die Zitrone','الليمونة'],
         ['die Tomate','الطماطم'],['die Kartoffel','البطاطا'],['die Karotte','الجزر'],
         ['die Zwiebel','البصل'],['das Fleisch','اللحم'],['der Fisch','السمك'],
         ['das Hähnchen','الدجاج'],['das Ei','البيضة'],['der Käse','الجبن'],
         ['die Milch','الحليب'],['das Wasser','الماء'],['der Tee','الشاي'],
         ['der Kaffee','القهوة'],['der Saft','العصير'],['das Öl','الزيت'],
         ['der Zucker','السكر'],['das Salz','الملح'],['der Reis','الأرز']],
    gram:{t:'Le pluriel allemand — 5 terminaisons possibles',
      b:['<b>-e</b> : der Apfel → die Äpf<u>el</u> (souvent avec umlaut)',
         '<b>-er</b> : das Ei → die Ei<u>er</u> · das Kind → die Kinder',
         '<b>-en / -n</b> : die Banane → die Banan<u>en</u> · die Tomate → die Tomaten',
         '<b>-s</b> : der Keks → die Keks<u>e</u> (mots étrangers)',
         '<b>ø</b> (invariable) : der Fisch → die Fisch<u>e</u> · das Mädchen → die Mädchen',
         '⚠️ Certains noms n’ont <b>pas de pluriel</b> : das Obst, das Gemüse, das Fleisch, die Milch'],
      tbl:[['der Apfel','die Äpfel'],['die Banane','die Bananen'],['das Ei','die Eier'],
           ['die Tomate','die Tomaten'],['der Fisch','die Fische'],['das Gemüse','—']],
      ex:'<span class="de-in">Ich kaufe drei <b>Äpfel</b> und zwei <b>Bananen</b>.</span>'},
    exos:[{q:'Pluriel de «der Apfel» :',opts:['die Apfels','die Äpfel','die Apfel','die Äpfeln'],a:1,
           why:'<span class="de-in">der Apfel → die Äpf<b>el</b></span> (avec umlaut).'},
          {q:'Pluriel de «die Banane» :',opts:['die Bananen','die Bananes','die Banäne','die Banana'],a:0,
           why:'Féminins en -e → pluriel <b>-n</b> : <span class="de-in">die Bananen</span>.'},
          {q:'Quel mot n’a PAS de pluriel ?',opts:['das Ei','der Fisch','das Obst','die Tomate'],a:2,
           why:'<span class="de-in">das Obst</span> (الفواكه) est un nom collectif sans pluriel.'},
          {q:'«das Gemüse» signifie :',opts:['الفواكه','الخضروات','اللحوم','المشروبات'],a:1,
           why:'<span class="de-in">das Gemüse</span> = الخضروات · <span class="de-in">das Obst</span> = الفواكه.'},
          {q:'Quel article pour «Milch» ?',opts:['der','die','das','den'],a:1,
           why:'<span class="de-in"><b>die</b> Milch</span> — féminin.'}]},

  { n:2, de:'Der Akkusativ nach essen / trinken / möchten', ar:'المفعول به بعد أفعال الأكل والشرب', dur:60,
    obj:['بناء حالة Akkusativ','تغيّر أداة المذكر فقط','التعبير عن الرغبة'],
    lex:[['Ich esse einen Apfel.','أنا آكل تفاحة.'],
         ['Ich trinke einen Tee.','أشرب شاياً.'],
         ['Ich möchte eine Banane.','أريد موزة.'],
         ['Ich brauche zwei Eier.','أحتاج بيضتين.'],
         ['Ich kaufe den Käse.','أشتري الجبن.'],
         ['Hast du Hunger?','هل أنت جائع؟'],['Hast du Durst?','هل أنت عطشان؟'],
         ['Ich habe großen Hunger.','أنا جائع جداً.']],
    gram:{t:'Akkusativ — seul le MASCULIN change',
      tbl:[['','Nominativ','Akkusativ'],
           ['maskulin','der / ein / mein','<b>den</b> / <b>einen</b> / <b>meinen</b>'],
           ['feminin','die / eine / meine','die / eine / meine (inchangé)'],
           ['neutrum','das / ein / mein','das / ein / mein (inchangé)'],
           ['Plural','die / meine','die / meine (inchangé)']],
      b:['Verbes qui prennent toujours l’Akkusativ : <b>essen · trinken · möchten · haben · '
       + 'brauchen · kaufen · nehmen · sehen</b>',
         '<span class="de-in">Ich esse <u>einen</u> Apfel.</span> (m → <b>en</b>)',
         '<span class="de-in">Ich trinke <u>eine</u> Milch.</span> (f → inchangé)',
         '<span class="de-in">Ich kaufe <u>das</u> Brot.</span> (n → inchangé)',
         '⚠️ Ne confonds pas : <span class="de-in">Ich <b>bin</b> hungrig</span> mais '
       + '<span class="de-in">Ich <b>habe</b> Hunger</span> !'],
      ex:'<span class="de-in">Was möchtest du? — Ich möchte <b>einen</b> Kaffee und '
       + '<b>eine</b> Orange.</span>'},
    exos:[{q:'«Ich esse ___ Apfel.»',opts:['ein','einen','eine','einem'],a:1,
           why:'<span class="de-in">der Apfel</span> → Akkusativ masculin → <b>einen</b>.'},
          {q:'«Ich trinke ___ Milch.»',opts:['ein','einen','eine','einem'],a:2,
           why:'<span class="de-in">die Milch</span> féminin → <b>eine</b> (inchangé).'},
          {q:'«Ich kaufe ___ Brot.»',opts:['ein','einen','eine','das'],a:0,
           why:'<span class="de-in">das Brot</span> neutre → <b>ein</b> (inchangé).'},
          {q:'«Ich habe ___ Hunger.» (grand)',opts:['großer','großen','große','großem'],a:1,
           why:'<span class="de-in">Hunger</span> est masculin → Akkusativ <b>großen</b>.'},
          {q:'Comment dit-on «أنا جائع» ?',
           opts:['Ich bin Hunger.','Ich habe Hunger.','Ich bin hungrig habe.','Ich habe hungrig.'],a:1,
           why:'<span class="de-in">Ich <b>habe</b> Hunger</span> ou <span class="de-in">Ich '
           + '<b>bin</b> hungrig</span> — les deux sont corrects, mais jamais mélangés.'},
          {q:'«Was ___ du?» (veux-tu)',opts:['möchtest','möchte','möchten','möchtet'],a:0,
           why:'<span class="de-in">du</span> → <b>möchtest</b>.'}]},

  { n:3, de:'Rezepte schreiben — der Imperativ', ar:'كتابة الوصفات — صيغة الأمر', dur:60,
    obj:['كتابة وصفة','صيغة الأمر (du/ihr/Sie)','الترتيب الزمني (zuerst, dann, danach)','verbes culinaires'],
    lex:[['kochen','يطبخ'],['braten','يقلي'],['backen','يخبز'],['schneiden','يقطّع'],
         ['mischen','يخلط'],['rühren','يحرّك'],['waschen','يغسل'],['schälen','يقشّر'],
         ['hinzugeben','يضيف'],['servieren','يقدّم'],['probieren','يتذوّق'],
         ['zuerst','أولاً'],['dann','ثم'],['danach','بعد ذلك'],['schließlich','أخيراً'],
         ['5 Minuten kochen','يطبخ 5 دقائق'],['eine Prise Salz','قبضة ملح']],
    gram:{t:'Impératif — 3 formes + les verbes forts',
      tbl:[['du','Nimm die -st : <b>Nimm!</b> · <b>Schneide!</b> · <b>Wasch(e)!</b>'],
           ['ihr','Identique au présent : <b>Nehmt!</b> · <b>Schneidet!</b> · <b>Wascht!</b>'],
           ['Sie','Verbe + Sie : <b>Nehmen Sie!</b> · <b>Schneiden Sie!</b>'],
           ['⚠️ sein','<b>Sei!</b> · <b>Seid!</b> · <b>Seien Sie!</b> (irrégulier)'],
           ['⚠️ verbes en -eln/-ern','<b>Sammle!</b> · <b>Ändere!</b>']],
      b:['Dans une recette, on utilise presque toujours la forme <b>Sie</b> (impersonnelle) '
       + 'ou l’infinitif.',
         'Marqueurs de séquence : <b>zuerst · dann · danach · anschließend · schließlich</b>',
         'Durée : <span class="de-in"><b>10 Minuten</b> kochen</span> · '
       + 'Quantité : <span class="de-in"><b>eine Prise</b> Salz</span>'],
      ex:'<span class="de-in"><b>Zuerst</b> waschen Sie das Gemüse. <b>Dann</b> schneiden Sie '
       + 'es klein. <b>Danach</b> geben Sie Öl in die Pfanne.</span>'},
    exos:[{q:'Impératif (du) de «nehmen» :',opts:['Nehme!','Nimm!','Nehmt!','Nehmen Sie!'],a:1,
           why:'Verbe fort avec changement de voyelle : <span class="de-in">du nimmst</span> → <b>Nimm!</b>'},
          {q:'Impératif (ihr) de «schneiden» :',opts:['Schneide!','Schneidet!','Schneiden!','Schnitt!'],a:1,
           why:'Forme ihr = présent : <span class="de-in">ihr schneidet</span> → <b>Schneidet!</b>'},
          {q:'Impératif (Sie) de «sein» :',opts:['Sei!','Seid!','Seien Sie!','Sind Sie!'],a:2,
           why:'<span class="de-in">sein</span> est irrégulier : <b>Seien Sie!</b>'},
          {q:'Quel connecteur signifie «ثم» ?',opts:['zuerst','dann','schließlich','deshalb'],a:1,
           why:'<span class="de-in">dann</span> = ثم · <span class="de-in">zuerst</span> = أولاً.'},
          {q:'«___ Sie das Gemüse!» (lavez)',opts:['Waschen','Wascht','Wäschst','Gewaschen'],a:0,
           why:'Impératif Sie = infinitif + <b>Sie</b>.'},
          {q:'Dans une recette allemande, on utilise surtout :',
           opts:['la forme du','la forme ihr','la forme Sie ou l’infinitif','le Konjunktiv'],a:2,
           why:'Style impersonnel : <span class="de-in">Schneiden Sie…</span> ou <span class="de-in">'
           + 'Das Gemüse schneiden.</span>'}]},

  { n:4, de:'Im Restaurant und beim Einkaufen', ar:'في المطعم وعند التسوّق', dur:60,
    obj:['dialogue au restaurant','formules de politesse','commander et payer','le menu (Speisekarte)'],
    lex:[['die Speisekarte','قائمة الطعام'],['der Kellner','النادل'],['die Kellnerin','النادلة'],
         ['die Rechnung','الفاتورة'],['bestellen','يطلب (طعاماً)'],['zahlen / bezahlen','يدفع'],
         ['die Vorspeise','المقبّلات'],['das Hauptgericht','الطبق الرئيسي'],
         ['die Nachspeise','الحلوى'],['die Speise','الطبق'],['das Getränk','المشروب'],
         ['Ich hätte gern…','أرغب في…'],['Könnten Sie mir bitte…?','هل يمكنك من فضلك…؟'],
         ['Was möchten Sie bestellen?','ماذا تريد أن تطلب؟'],
         ['Sonst noch etwas?','أي شيء آخر؟'],['Das macht 15 Euro.','المبلغ 15 يورو.'],
         ['Stimmt so.','الباقي لك.'],['Guten Appetit!','بالهناء!'],
         ['Es hat sehr gut geschmeckt.','كان لذيذاً جداً.']],
    gram:{t:'Les formules de politesse — indispensables à l’écrit du BAC',
      tbl:[['Konjunktiv II (le plus poli)','Ich hätte gern einen Salat.'],
           ['Könnten Sie…?','Könnten Sie mir bitte die Rechnung bringen?'],
           ['Würden Sie…?','Würden Sie mir helfen?'],
           ['Ich möchte…','Ich möchte einen Tee, bitte.'],
           ['Haben Sie…?','Haben Sie etwas ohne Fleisch?']],
      b:['<b>Ich hätte gern</b> = Konjunktiv II de <span class="de-in">haben</span> — '
       + 'la forme la plus polie pour commander.',
         '<b>bitte</b> se place librement : en début, au milieu ou en fin de phrase.',
         'Le vouvoiement <b>Sie</b> est obligatoire avec un serveur, un vendeur, un inconnu.',
         'Pour payer : <span class="de-in">Zahlen, bitte!</span> · '
       + '<span class="de-in">Stimmt so.</span> (gardez la monnaie)'],
      ex:'<span class="de-in">— Guten Tag! Was möchten Sie bestellen? '
       + '— Ich hätte gern die Hähnchen mit Reis, bitte. '
       + '— Sonst noch etwas? — Einen Orangensaft. — Guten Appetit!</span>'},
    exos:[{q:'Formule la PLUS polie pour commander :',
           opts:['Ich will einen Kaffee.','Ich hätte gern einen Kaffee.',
                 'Gib mir einen Kaffee.','Ich brauche Kaffee.'],a:1,
           why:'<span class="de-in">Ich <b>hätte</b> gern…</span> (Konjunktiv II) = la forme attendue au BAC.'},
          {q:'«___ Sie mir bitte die Rechnung bringen?»',opts:['Könnten','Können','Konnten','Kannst'],a:0,
           why:'Demande polie → <b>Könnten</b> (Konjunktiv II).'},
          {q:'Le serveur demande «Sonst noch etwas?» — cela signifie :',
           opts:['C’est tout ?','Autre chose ?','Vous payez ?','C’était bon ?'],a:1,
           why:'<span class="de-in">Sonst noch etwas?</span> = أي شيء آخر؟'},
          {q:'Pour dire «الباقي لك» (pourboire) :',opts:['Stimmt so.','Das stimmt.','Bitte sehr.','Danke gleich.'],a:0,
           why:'<span class="de-in"><b>Stimmt so.</b></span> = gardez la monnaie.'},
          {q:'«Guten Appetit!» se dit :',opts:['avant de manger','après le repas','en payant','en partant'],a:0,
           why:'Équivalent de « بالهناء » — avant de commencer le repas.'},
          {q:'Avec un serveur, on utilise :',opts:['du','ihr','Sie','man'],a:2,
           why:'Vouvoiement <b>Sie</b> obligatoire avec un inconnu ou un professionnel.'}]},

  { n:5, de:'Textverständnis : «Gesund essen in Algerien»', ar:'فهم نص — التغذية الصحية في الجزائر', dur:60,
    obj:['cراءة نص وثائقي','استخراج الحجج والمعلومات','repérer les connecteurs logiques','الإجابة بجمل كاملة'],
    texte:'<div class="reading"><p><b>Gesund essen in Algerien</b></p>'
        + '<p>Die algerische Küche ist sehr reich und gesund. Traditionell isst man viel '
        + 'Gemüse, Olivenöl, Hülsenfrüchte und frisches Brot. Couscous ist das Nationalgericht: '
        + 'Man isst ihn mit Lammfleisch, Kichererbsen und gedämpftem Gemüse.</p>'
        + '<p>Leider essen viele Jugendliche heute zu viel Fast Food. Sie trinken süße Limonade '
        + 'statt Wasser und kaufen Snacks vor der Schule. Deshalb gibt es immer mehr Übergewicht '
        + 'bei Kindern. Ärzte empfehlen, mindestens fünf Portionen Obst und Gemüse pro Tag zu '
        + 'essen und mindestens anderthalb Liter Wasser zu trinken.</p>'
        + '<p>Ein gesundes Frühstück ist sehr wichtig. Wer ohne Frühstück zur Schule geht, '
        + 'kann sich schlecht konzentrieren. Ein gutes Frühstück besteht aus Brot mit Käse '
        + 'oder Ei, einem Glas Milch und einer Frucht.</p>'
        + '<p>Zusammenfassend kann man sagen: Die traditionelle algerische Küche ist bereits '
        + 'sehr gesund. Das Problem ist nicht das Essen selbst, sondern die neue Lebensweise '
        + 'der jungen Generation.</p></div>',
    exos:[{q:'Richtig oder Falsch : Le couscous est le plat national algérien.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Couscous ist das Nationalgericht.</span>'},
          {q:'Richtig oder Falsch : Les médecins recommandent 3 portions de fruits par jour.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">mindestens <b>fünf</b> Portionen Obst und Gemüse pro Tag</span>.'},
          {q:'Richtig oder Falsch : Sauter le petit-déjeuner nuit à la concentration.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Wer ohne Frühstück zur Schule geht, kann sich schlecht '
           + 'konzentrieren.</span>'},
          {q:'Richtig oder Falsch : Selon l’auteur, le problème vient de la cuisine algérienne.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Das Problem ist <b>nicht</b> das Essen selbst, sondern die neue '
           + 'Lebensweise.</span>'},
          {q:'Combien d’eau faut-il boire par jour ?',opts:['1 litre','1,5 litre','2 litres','3 litres'],a:1,
           why:'<span class="de-in">mindestens <b>anderthalb</b> Liter Wasser</span> = 1,5 L.'},
          {q:'Que contient un bon petit-déjeuner selon le texte ?',
           opts:['Fast Food et soda','Pain + fromage ou œuf + lait + fruit',
                 'Couscous et viande','Riz et légumes'],a:1,
           why:'<span class="de-in">Brot mit Käse oder Ei, einem Glas Milch und einer Frucht.</span>'},
          {q:'Quel connecteur introduit la conclusion ?',
           opts:['Deshalb','Leider','Zusammenfassend','Wer'],a:2,
           why:'<span class="de-in"><b>Zusammenfassend</b> kann man sagen…</span> = en résumé.'}]},

  { n:6, de:'Textproduktion — «Mein Lieblingsrezept»', ar:'إنتاج كتابي ✍️ وصفتي المفضّلة', dur:60,
    obj:['كتابة وصفة أو نص حجاجي 8-10 أسطر','Impératif + connecteurs de séquence','Akkusativ + quantités','conseils de santé'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً من <b>8 إلى 10 أسطر</b> '
           + 'تعرض فيه وصفتك الجزائرية المفضّلة، أو تنصح زميلك بالتغذية الصحية. احترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>3 verbes à l’impératif (Sie)</b> : Schneiden Sie… · Geben Sie… · Kochen Sie…</li>'
           + '<li><b>3 connecteurs de séquence</b> : zuerst · dann · danach · schließlich</li>'
           + '<li><b>4 aliments au Akkusativ</b> avec article correct (einen/eine/das)</li>'
           + '<li><b>1 formule de politesse</b> : Ich hätte gern… / Könnten Sie…?</li>'
           + '<li><b>1 conseil de santé</b> avec <span class="de-in">sollte</span> ou '
           + '<span class="de-in">Es ist wichtig, … zu</span></li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Mein Lieblingsgericht ist Couscous, das Nationalgericht Algeriens. '
         + 'Ich koche es jeden Freitag mit meiner Mutter. Hier ist das Rezept:</p>'
         + '<p><b>Zuerst</b> waschen Sie das Gemüse: zwei Karotten, eine Zucchini und '
         + 'eine Zwiebel. <b>Dann</b> schneiden Sie alles klein. <b>Danach</b> geben Sie '
         + 'Öl in einen großen Topf und braten Sie das Fleisch an. <b>Anschließend</b> '
         + 'fügen Sie eine Prise Salz, Tomaten und Wasser hinzu. Kochen Sie alles '
         + '40 Minuten. <b>Schließlich</b> dämpfen Sie den Couscous und servieren Sie '
         + 'ihn mit dem Gemüse.</p>'
         + '<p>Ich hätte gern jeden Tag Couscous, aber das ist zu viel! '
         + 'Es ist wichtig, jeden Tag fünf Portionen Obst und Gemüse zu essen und '
         + 'anderthalb Liter Wasser zu trinken. Man sollte nicht zu viel Fast Food '
         + 'essen, denn das ist ungesund. Guten Appetit!</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب وصفتك أو نصيحتك هنا (سيصححها الأستاذ الافتراضي):',
           ph:'Mein Lieblingsgericht ist … Zuerst … Dann …'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي', dur:60,
    obj:['مراجعة شاملة للوحدة 5','التقويم الذاتي','التصحيح الجماعي','التحضير للفرض والوحدة 6'],
    exos:[{q:'«Ich esse ___ Apfel.» (une)',opts:['ein','einen','eine','einem'],a:1,
           why:'Masculin → Akkusativ <b>einen</b>.'},
          {q:'«Ich trinke ___ Wasser.»',opts:['ein','einen','eine','das'],a:3,
           why:'<span class="de-in">das Wasser</span> neutre → article défini <b>das</b> (inchangé).'},
          {q:'Pluriel de «das Ei» :',opts:['die Eier','die Eis','die Eien','das Eier'],a:0,
           why:'Neutres en -er : <span class="de-in">das Ei → die Ei<b>er</b></span>.'},
          {q:'Impératif (du) de «essen» :',opts:['Esse!','Iss!','Esst!','Essen Sie!'],a:1,
           why:'Verbe fort : <span class="de-in">du isst</span> → <b>Iss!</b>'},
          {q:'Formule polie pour commander :',opts:['Ich will das!','Ich hätte gern einen Tee.',
                                                     'Gib mir Tee!','Tee!'],a:1,
           why:'Konjunktiv II : <span class="de-in">Ich <b>hätte gern</b>…</span>'},
          {q:'«zuerst» signifie :',opts:['ثم','أولاً','أخيراً','لذلك'],a:1,
           why:'<span class="de-in">zuerst</span> = أولاً · <span class="de-in">dann</span> = ثم.'},
          {q:'«Hast du ___?» (soif)',opts:['Hunger','Durst','Appetit','Durstig'],a:1,
           why:'<span class="de-in"><b>Durst</b> haben</span> = être assoiffé.'},
          {q:'Quel mot est féminin ?',opts:['das Brot','der Käse','die Milch','das Öl'],a:2,
           why:'<span class="de-in"><b>die</b> Milch</span>.'},
          {q:'«Könnten Sie mir bitte helfen?» est :',
           opts:['un ordre','une demande polie','un constat','un refus'],a:1,
           why:'Konjunktiv II + bitte = demande polie.'},
          {q:'«Zahlen, bitte!» se dit :',opts:['en entrant','en commandant','pour demander l’addition','en partant sans payer'],a:2,
           why:'<span class="de-in">Zahlen, bitte!</span> = الحساب من فضلك.'},
          {q:'Connecteur de conclusion :',opts:['deshalb','zuerst','zusammenfassend','leider'],a:2,
           why:'<span class="de-in"><b>zusammenfassend</b></span> = en résumé.'},
          {q:'«Es ist wichtig, viel Wasser ___ .»',opts:['zu trinken','trinken','trinkt','getrunken'],a:0,
           why:'<span class="de-in">Es ist wichtig, … <b>zu</b> + infinitif</span>.'}]},

  { n:8, de:'Évaluation de l’unité 5 📝', ar:'فرض الوحدة 5', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي + سلّم التنقيط'], ex:'devoir'}
];

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
window.UNITE5 = { meta: UNITE5_META, seances: SEANCES_U5, devoir: DEVOIR_U5, corrige: CORRIGE_U5 };
