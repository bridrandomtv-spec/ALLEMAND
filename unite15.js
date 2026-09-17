/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite15.js
   3AS · الوحدة 15 : Medienwelt — عالم الإعلام
   6 حصص + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · 3AS · الفصل الثالث · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE15_META = {
  n: 15, de: 'Medienwelt', ar: 'عالم الإعلام',
  niveau: '3AS', trimestre: 3, periode: 'أفريل — ماي', duree_totale: 360, cecrl: 'B2',
  icon: '📰', cloture_trimestre: false,
  objectifs: ['تسمية وسائل الإعلام وأنواعها','نقل الخبر بالكلام غير المباشر (Konjunktiv I)',
              'الجمل الموصولة مع حروف الجر','اسم الفاعل واسم المفعول كصفات',
              'فهم مقال صحفي حول وسائل التواصل','إنتاج مقال حجاجي من 15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Medien','die Zeitung','die Nachricht','die Schlagzeile',
                    'die sozialen Netzwerke','die Fake News','die Quelle'],
  grammaire_cle: ['Konjunktiv I (indirekte Rede)','Relativsätze mit Präpositionen',
                  'Partizip I und II als Adjektiv','Komposita der Mediensprache']
};

const SEANCES_U15 = [
  { n:1, de:'Die Medienlandschaft', ar:'المشهد الإعلامي', dur:60,
    obj:['تصنيف وسائل الإعلام','الكلمات المركّبة الإعلامية','التعبير عن العادات الإعلامية'],
    lex:[['die Medien (Pl.)','وسائل الإعلام'],['das Medium','الوسيلة'],
         ['die Zeitung / die Zeitschrift','الجريدة / المجلّة'],['das Fernsehen','التلفزيون'],
         ['der Rundfunk / das Radio','الإذاعة'],['das Internet','الإنترنت'],
         ['die sozialen Netzwerke','شبكات التواصل'],['die Nachricht','الخبر'],
         ['die Schlagzeile','العنوان الرئيسي'],['die Sendung','البرنامج / البث'],
         ['der Bericht','التقرير'],['die Berichterstattung','التغطية الإعلامية'],
         ['die Quelle','المصدر'],['der Artikel','المقال'],['die Werbung','الإشهار'],
         ['das Gerücht','الإشاعة'],['die Fake News (Pl.)','الأخبار الزائفة'],
         ['sich informieren','يستقي المعلومات'],['veröffentlichen','ينشر'],
         ['die Glaubwürdigkeit','المصداقية'],['die Pressefreiheit','حرية الصحافة']],
    gram:{t:'Komposita — la langue des médias fabrique des mots composés',
      b:['Règle : le genre du composé = genre du <b>dernier</b> élément.',
         '<span class="de-in">die Zeitung + der Artikel → <b>der</b> Zeitungsartikel</span>',
         '<span class="de-in">die Nachrichten + die Agentur → <b>die</b> Nachrichtenagentur</span>',
         'Élément de liaison fréquent : <b>-s-</b> ou <b>-n-</b> '
       + '(<span class="de-in">Zeitung<b>s</b>artikel · Nachricht<b>en</b>agentur</span>).',
         'Toujours écrire en <b>un seul mot</b> : ~~die Nachrichten Agentur~~ → '
       + '<span class="de-in">die Nachrichtenagentur</span>.'],
      tbl:[['die Pressefreiheit','حرية الصحافة','die Freiheit'],
           ['der Nachrichtensprecher','مقدّم الأخبار','der Sprecher'],
           ['die Berichterstattung','التغطية الإعلامية','die Bericht-erstattung'],
           ['das Fernsehprogramm','البرنامج التلفزيوني','das Programm'],
           ['die Medienkompetenz','الكفاءة الإعلامية','die Kompetenz']],
      ex:'<span class="de-in">Die <b>Pressefreiheit</b> ist ein Grundrecht: Sie schützt '
       + 'die <b>Glaubwürdigkeit</b> der <b>Berichterstattung</b>.</span>'},
    exos:[{q:'Genre de «der Artikel» + «die Zeitung» = Zeitungs…',
           opts:['die Zeitungsartikel','der Zeitungsartikel','das Zeitungsartikel','die Zeitungsartikeln'],a:1,
           why:'Le genre vient du <b>dernier</b> élément : <b>der</b> Artikel → '
           + '<span class="de-in">der Zeitungsartikel</span>.'},
          {q:'Comment écrit-on « agence de presse » ?',
           opts:['die Nachrichten Agentur','die Nachrichtenagentur','die Nachricht Agentur','Nachrichtenagentur die'],a:1,
           why:'Les composés allemands s’écrivent <b>en un seul mot</b>.'},
          {q:'«die Glaubwürdigkeit» signifie :',opts:['حرية الصحافة','المصداقية','الإشاعة','الإشهار'],a:1,
           why:'<span class="de-in">glaubwürdig</span> = جدير بالتصديق → <b>die Glaubwürdigkeit</b>.'},
          {q:'Pluriel de «das Medium» :',opts:['die Mediums','die Medien','die Medias','das Medien'],a:1,
           why:'<span class="de-in">das Medium → die <b>Medien</b></span> (latin).'},
          {q:'«Fake News» est en allemand :',opts:['un nom singulier','toujours au pluriel, féminin',
                                                   'neutre singulier','masculin pluriel'],a:1,
           why:'<span class="de-in"><b>die</b> Fake News</span> — pluriel féminin, comme en anglais.'},
          {q:'«sich informieren» se construit avec :',opts:['über + Akk.','auf + Dat.','für + Akk.','an + Dat.'],a:0,
           why:'<span class="de-in">sich informieren <b>über</b> etwas (Akk.)</span>.'}]},

  { n:2, de:'Indirekte Rede — Konjunktiv I', ar:'الكلام غير المباشر — Konjunktiv I', dur:60,
    obj:['rapporter un propos de presse','former le Konjunktiv I','bascule vers le Konjunktiv II','choisir la conjonction'],
    lex:[['Der Journalist berichtet, dass…','يروي الصحفي أن…'],
         ['Laut der Zeitung …','حسب الجريدة…'],
         ['Er sagte, er sei müde.','قال إنه متعب.'],
         ['Sie behauptet, sie habe Beweise.','تدّعي أن لديها أدلة.'],
         ['Es wird berichtet, dass…','يُروى أن…'],
         ['angeblich','مزعوماً'],['laut','حسب'],['zufolge','وفقاً لـ']],
    gram:{t:'Konjunktiv I — radical du présent + -e/-est/-e/-en/-et/-en',
      tbl:[['sein','er <b>sei</b>','forme propre, toujours employée'],
           ['haben','er <b>habe</b>','forme propre'],
           ['kommen','er <b>komme</b>','radical + e'],
           ['wissen','er <b>wisse</b>','radical + e'],
           ['können','er <b>könne</b>','radical avec umlaut'],
           ['⚠️ wir/sie (identique à l’indicatif)','→ bascule en <b>Konjunktiv II</b>',
            'sie <b>kämen</b> (et non ~~kommen~~)']],
      b:['Le Konjunktiv I marque la <b>distance</b> : on rapporte sans prendre position.',
         'Trois constructions possibles :',
         '1) <span class="de-in">Er sagt, <b>dass</b> er krank <b>sei</b>.</span> (verbe final)',
         '2) <span class="de-in">Er sagt, er <b>sei</b> krank.</span> (sans dass, verbe en 2)',
         '3) <span class="de-in"><b>Laut</b> der Zeitung <b>ist</b> er krank.</span> '
       + '(préposition + indicatif admis)',
         '⚠️ Quand le Konjunktiv I est identique à l’indicatif (wir/sie), on emploie le '
       + '<b>Konjunktiv II</b> ou <b>würde</b> + infinitif.'],
      ex:'<span class="de-in">Der Minister erklärte, die Arbeitslosigkeit <b>sei</b> gesunken '
       + 'und die Wirtschaft <b>werde</b> weiter wachsen.</span>'},
    exos:[{q:'«Er sagt, er ___ krank.» (sein)',opts:['ist','sei','wäre','sein'],a:1,
           why:'Konjunktiv I de sein : <b>sei</b> (forme propre, jamais ~~ist~~).'},
          {q:'«Sie behauptet, sie ___ Beweise.» (haben)',opts:['hat','habe','hätte','haben'],a:1,
           why:'Konjunktiv I de haben : <b>habe</b>.'},
          {q:'«Der Reporter schreibt, die Preise ___ gestiegen.»',opts:['seien','sind','wären','waren'],a:0,
           why:'Pluriel de sein au Konjunktiv I : <b>seien</b> (ici distinct de l’indicatif).'},
          {q:'«Er sagt, dass er morgen ___ .» (kommen)',opts:['komme','kommt','käme','kam'],a:0,
           why:'Radical + e : <b>komme</b>.'},
          {q:'Quand le Konjunktiv I est identique à l’indicatif, on emploie :',
           opts:['le Konjunktiv II ou würde','le Präteritum','le Perfekt','l’impératif'],a:0,
           why:'Ex. : <span class="de-in">sie <b>kämen</b></span> (et non ~~sie kommen~~, '
           + 'ambigu avec l’indicatif).'},
          {q:'«___ der Zeitung ist er krank.»',opts:['Laut','Nach dem','Wegen dem','Trotz'],a:0,
           why:'<span class="de-in"><b>Laut</b> + Génitif/Datif</span> = حسب.'}]},

  { n:3, de:'Relativsätze mit Präpositionen', ar:'الجمل الموصولة مع حروف الجر', dur:60,
    obj:['relative avec préposition','accorder le pronom relatif','wo(r)- + préposition pour les choses','virgule obligatoire'],
    lex:[['der Artikel, über den man spricht','المقال الذي يُتحدث عنه'],
         ['die Zeitung, in der es steht','الجريدة التي ورد فيها'],
         ['das Internet, durch das wir lernen','الإنترنت الذي نتعلم عبره'],
         ['die Quelle, aus der die Nachricht stammt','المصدر الذي ورد منه الخبر'],
         ['der Journalist, für den ich arbeite','الصحفي الذي أعمل لأجله'],
         ['worüber · worauf · womit · wofür · woran','عمّا / على ماذا / بما / لأجل ماذا / في ماذا']],
    gram:{t:'La préposition précède TOUJOURS le pronom relatif',
      tbl:[['über + Akk.','der Artikel, <b>über den</b> man spricht'],
           ['in + Dat.','die Zeitung, <b>in der</b> es steht'],
           ['aus + Dat.','die Quelle, <b>aus der</b> die Nachricht stammt'],
           ['für + Akk.','der Journalist, <b>für den</b> ich arbeite'],
           ['mit + Dat.','das Handy, <b>mit dem</b> ich filme']],
      b:['Le pronom relatif prend le <b>genre</b> et le <b>nombre</b> de l’antécédent, '
       + 'mais son <b>cas</b> dépend de la préposition.',
         'Pour une <b>chose</b>, on peut remplacer prép. + das par <b>wo(r)-</b> + préposition : '
       + '<span class="de-in">das Thema, <b>über das</b> … = das Thema, <b>worüber</b> …</span>',
         '⚠️ <b>wo(r)-</b> ne s’emploie jamais pour une personne.',
         'La virgule est <b>obligatoire</b> devant la relative — faute comptabilisée au BAC.'],
      ex:'<span class="de-in">Die sozialen Netzwerke, <b>über die</b> so viel diskutiert wird, '
       + 'verändern unsere Kommunikation, <b>worüber</b> sich viele Eltern Sorgen machen.</span>'},
    exos:[{q:'«Das ist der Artikel, ___ ich gesprochen habe.»',opts:['über den','über dem','über das','über der'],a:0,
           why:'<span class="de-in">sprechen <b>über</b> + Akkusativ</span> → <b>über den</b>.'},
          {q:'«Die Zeitung, ___ es steht, ist alt.»',opts:['in der','in dem','in die','auf der'],a:0,
           why:'Position → <span class="de-in"><b>in</b> + Datif</span> → <b>in der</b> (die Zeitung).'},
          {q:'«Die Quelle, ___ die Nachricht stammt.»',opts:['aus der','aus dem','von der','mit der'],a:0,
           why:'<span class="de-in"><b>stammen aus</b> + Datif</span> → <b>aus der</b>.'},
          {q:'Pour une CHOSE, « über das » peut devenir :',opts:['worüber','woüber','überwo','dasüber'],a:0,
           why:'<span class="de-in">wo(r)-</span> + préposition : <b>worüber</b>.'},
          {q:'«Der Mann, ___ ich warte, ist Journalist.»',opts:['auf den','auf dem','auf der','auf das'],a:0,
           why:'<span class="de-in"><b>warten auf</b> + Akkusativ</span> → <b>auf den</b>.'},
          {q:'La virgule devant la relative est :',opts:['facultative','obligatoire','interdite','selon le registre'],a:1,
           why:'En allemand, la virgule est <b>toujours</b> obligatoire devant une relative.'}]},

  { n:4, de:'Partizip I und II als Adjektiv', ar:'اسم الفاعل واسم المفعول كصفات', dur:60,
    obj:['Partizip I (action en cours) vs Partizip II (action accomplie)','déclinaison de l’adjectif participe','style journalistique condensé'],
    lex:[['die steigenden Preise','الأسعار المرتفعة'],
         ['die veröffentlichte Studie','الدراسة المنشورة'],
         ['der lachende Zuschauer','المتفرّج الضاحك'],
         ['die gelesene Nachricht','الخبر المقروء'],
         ['das wachsende Misstrauen','انعدام الثقة المتزايد'],
         ['die gut informierten Bürger','المواطنون المطّلعون']],
    gram:{t:'Deux participes, deux sens — ne jamais les confondre',
      tbl:[['Partizip I (Infinitif + d)','<b>aktiv</b>, en cours','die <b>steigenden</b> Preise'],
           ['Partizip II (ge…t/en)','<b>passif</b>, accompli','die <b>gestiegenen</b> Preise'],
           ['Partizip I','un verbe qui agit','der <b>lachende</b> Zuschauer'],
           ['Partizip II','un verbe subi','das <b>gezeigte</b> Video']],
      b:['<span class="de-in">die <b>wachsende</b> Wirtschaft</span> = l’économie qui croît '
       + '(action en cours) vs <span class="de-in">die <b>gewachsene</b> Wirtschaft</span> '
       + '= l’économie qui a crû (résultat).',
         'Ces participes se déclinent comme des <b>adjectifs</b> : ils prennent -e/-en/-es/-er '
       + 'selon le cas et l’article.',
         'Le style journalistique adore cette compression : '
       + '<span class="de-in">Die gestern <b>veröffentlichte</b> Studie zeigt…</span> '
       + '(au lieu d’une relative).',
         '⚠️ Pas de participe I avec les verbes d’état : ~~das seiende Problem~~.'],
      ex:'<span class="de-in">Die <b>steigenden</b> Abonnentenzahlen zeigen, dass die '
       + '<b>digitalisierten</b> Zeitungen immer noch <b>gelesen</b> werden.</span>'},
    exos:[{q:'«die ___ Preise» (les prix qui montent)',opts:['steigenden','gestiegenen','gesteigerten','steigender'],a:0,
           why:'Action en cours → <b>Partizip I</b> : steigend + -en.'},
          {q:'«die ___ Preise» (les prix qui ont monté)',opts:['steigenden','gestiegenen','steigende','gestiegene'],a:1,
           why:'Résultat accompli → <b>Partizip II</b> : gestiegen + -en.'},
          {q:'Partizip I de «wachsen» :',opts:['wachsend','gewachsen','wachs','gewachsend'],a:0,
           why:'Infinitif + <b>-d</b> : wachsen → wachs<b>end</b>.'},
          {q:'«Das gestern ___ Video wurde millionenfach angesehen.»',
           opts:['veröffentlichte','veröffentlichende','veröffentlichen','veröffentlichend'],a:0,
           why:'Action subie et accomplie → <b>Partizip II</b> décliné : veröffentlicht<b>e</b>.'},
          {q:'«der ___ Zuschauer» (qui rit)',opts:['lachende','gelachte','lachend','gelacht'],a:0,
           why:'Après l’article défini, Partizip I prend <b>-e</b> au nominatif masculin.'},
          {q:'Le participe I traduit :',opts:['une action en cours (actif)','une action accomplie (passif)',
                                             'le futur','le conditionnel'],a:0,
           why:'Partizip I = <b>actif + en cours</b> ; Partizip II = <b>passif + accompli</b>.'}]},

  { n:5, de:'Textverständnis : «Soziale Medien und Jugendliche»', ar:'فهم نص — وسائل التواصل والشباب', dur:60,
    obj:['lire un article de presse','repérer Konjunktiv I et relatives','distinguer fait, citation et opinion','répondre par phrase complète'],
    texte:'<div class="reading"><p><b>Soziale Medien und Jugendliche</b></p>'
        + '<p>Eine gestern veröffentlichte Studie der Universität Algier zeigt, dass '
        + 'algerische Jugendliche durchschnittlich vier Stunden täglich in sozialen '
        + 'Netzwerken verbringen. Die Forscher betonen, dass diese Zahl in den letzten '
        + 'fünf Jahren um sechzig Prozent gestiegen sei.</p>'
        + '<p>Dabei ist das Bild ambivalent. Einerseits informieren sich viele Jugendliche '
        + 'heute schneller als je zuvor: Die Nachrichten, über die früher nur die Zeitung '
        + 'berichtete, erreichen sie in Sekunden. Andererseits warnen Pädagogen, dass '
        + 'die Glaubwürdigkeit der Quellen selten geprüft werde. Laut der Studie glaubt '
        + 'jeder dritte Jugendliche eine Nachricht, ohne ihre Herkunft zu kontrollieren.</p>'
        + '<p>Experten fordern deshalb mehr Medienkompetenz in der Schule. Man müsse lernen, '
        + 'eine Quelle zu bewerten, bevor man einen Artikel teilt. Die wachsende Zahl der '
        + 'Fake News mache diese Fähigkeit überlebenswichtig, erklärte der Leiter der Studie '
        + 'in einem Interview.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass die sozialen Netzwerke weder gut noch '
        + 'schlecht sind — entscheidend ist, wie man sie nutzt. Wer kritisch liest, gewinnt; '
        + 'wer alles glaubt, verliert.</p></div>',
    exos:[{q:'Richtig oder Falsch : Les jeunes passent en moyenne 4 heures par jour sur les réseaux.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… durchschnittlich <b>vier Stunden täglich</b>.</span>'},
          {q:'Richtig oder Falsch : ce chiffre a baissé de 60 % en cinq ans.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Il a <b>augmenté</b> : <span class="de-in">um sechzig Prozent <b>gestiegen</b></span>.'},
          {q:'Richtig oder Falsch : un jeune sur trois croit une information sans la vérifier.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… glaubt <b>jeder dritte</b> Jugendliche eine Nachricht, '
           + 'ohne ihre Herkunft zu kontrollieren.</span>'},
          {q:'Richtig oder Falsch : l’auteur conclut que les réseaux sont mauvais en soi.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… <b>weder gut noch schlecht</b> sind</span>.'},
          {q:'Quelle forme signale le discours rapporté ?',
           opts:['Präteritum','Konjunktiv I (sei · werde · müsse)','Passiv','Imperativ'],a:1,
           why:'<span class="de-in">gestiegen <b>sei</b> · geprüft <b>werde</b> · Man <b>müsse</b> '
           + 'lernen</span> — tous au Konjunktiv I.'},
          {q:'«die Nachrichten, über die früher nur die Zeitung berichtete» contient :',
           opts:['une relative avec préposition','une subordonnée causale','un impératif',
                 'un comparatif'],a:0,
           why:'<span class="de-in"><b>über die</b></span> = relative introduite par '
           + 'la préposition <b>über</b>.'},
          {q:'Quel participe I trouve-t-on dans le texte ?',
           opts:['die wachsende Zahl','die veröffentlichte Studie','gestiegen sei','berichtet wurde'],a:0,
           why:'<span class="de-in">die <b>wachsende</b> Zahl</span> = Partizip I '
           + '(action en cours). « veröffentlichte » est un Partizip II.'},
          {q:'Que réclament les experts ?',opts:['plus de temps d’écran',
                                                 'plus de compétence médiatique à l’école',
                                                 'l’interdiction des réseaux','plus de journaux papier'],a:1,
           why:'<span class="de-in">Experten fordern deshalb <b>mehr Medienkompetenz</b> '
           + 'in der Schule.</span>'}]},

  { n:6, de:'Textproduktion und Konsolidierung', ar:'إنتاج كتابي وتثبيت — وسائل الإعلام نعمة أم نقمة؟', dur:60,
    obj:['rédiger un article argumentatif de presse','Konjunktiv I pour citer une source','relative avec préposition','participes adjectivaux','révision transversale U15'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب مقالاً صحفياً من '
           + '<b>15 سطراً</b> بعنوان : <span class="de-in"><b>«Medien — Fluch oder Segen?»</b></span>'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>Schlagzeile</b> accrocheuse + <b>Einleitung</b> avec un fait chiffré</li>'
           + '<li><b>1 citation rapportée au Konjunktiv I</b> : '
           + '<span class="de-in">Der Experte erklärte, dass …</span></li>'
           + '<li><b>1 relative avec préposition</b> : '
           + '<span class="de-in">die Nachrichten, über die …</span></li>'
           + '<li><b>2 participes adjectivaux</b> (1 Partizip I + 1 Partizip II)</li>'
           + '<li><b>2 arguments</b> (pour/contre) avec jeweils un exemple</li>'
           + '<li><b>Schluss</b> : <span class="de-in">Zusammenfassend lässt sich sagen, dass…</span> '
           + '+ ton opinion</li></ul></div></div>',
    texte:'<div class="corrige"><h3>✅ Modellösung — نموذج الإجابة</h3><div class="reading">'
        + '<p><b>Medien — Fluch oder Segen?</b></p>'
        + '<p>Eine gestern veröffentlichte Studie zeigt, dass algerische Jugendliche vier '
        + 'Stunden täglich in sozialen Netzwerken verbringen. Der Leiter der Studie erklärte, '
        + 'dass diese Zahl in fünf Jahren um sechzig Prozent gestiegen sei.</p>'
        + '<p>Dafür spricht, dass die Informationen heute schneller fließen als je zuvor. '
        + 'Die Nachrichten, über die früher nur die Zeitung berichtete, erreichen uns in '
        + 'Sekunden. Die wachsende Zahl der Nutzer beweist, wie wichtig diese Kanäle '
        + 'geworden sind.</p>'
        + '<p>Dagegen spricht allerdings, dass die Glaubwürdigkeit der Quellen selten '
        + 'geprüft werde. Laut der Studie glaubt jeder dritte Jugendliche eine Nachricht, '
        + 'ohne ihre Herkunft zu kontrollieren. Man müsse lernen, eine Quelle zu bewerten, '
        + 'bevor man einen Artikel teilt.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass die Medien weder gut noch schlecht '
        + 'sind. Meiner Meinung nach entscheidet die Medienkompetenz: Wer kritisch liest, '
        + 'gewinnt — wer alles glaubt, verliert.</p></div></div>',
    exos:[{q:'Révision : «Der Experte sagte, er ___ krank.»',opts:['sei','ist','wäre','war'],a:0,
           why:'Konjunktiv I de sein : <b>sei</b>.'},
          {q:'Révision : «Die Quelle, ___ die Nachricht stammt.»',opts:['aus der','aus dem','von der','mit der'],a:0,
           why:'<span class="de-in"><b>stammen aus</b> + Datif</span>.'},
          {q:'Révision : «die ___ Zahlen» (qui augmentent)',opts:['steigenden','gestiegenen','gesteigerten','steigende'],a:0,
           why:'Action en cours → <b>Partizip I</b> décliné.'},
          {q:'Révision : genre de «die Nachrichtenagentur» vient de :',
           opts:['Nachrichten','Agentur','les deux','aucun'],a:1,
           why:'Le genre d’un composé = genre du <b>dernier</b> élément : <b>die</b> Agentur.'},
          {type:'texte',q:'✍️ Rédige ton article ici (correction automatique) :',
           ph:'Eine gestern veröffentlichte Studie zeigt, dass…'}]},
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 15 (/20) ══════════ */
const DEVOIR_U15 = {
  titre:'Évaluation — Einheit 15 : Medienwelt',
  unite:15, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Soziale Medien und Jugendliche</b></p>'
          + '<p>Eine gestern veröffentlichte Studie der Universität Algier zeigt, dass '
          + 'algerische Jugendliche durchschnittlich vier Stunden täglich in sozialen '
          + 'Netzwerken verbringen. Die Forscher betonen, dass diese Zahl in den letzten '
          + 'fünf Jahren um sechzig Prozent gestiegen sei.</p>'
          + '<p>Dabei ist das Bild ambivalent. Einerseits informieren sich viele Jugendliche '
          + 'heute schneller als je zuvor: Die Nachrichten, über die früher nur die Zeitung '
          + 'berichtete, erreichen sie in Sekunden. Andererseits warnen Pädagogen, dass die '
          + 'Glaubwürdigkeit der Quellen selten geprüft werde. Laut der Studie glaubt jeder '
          + 'dritte Jugendliche eine Nachricht, ohne ihre Herkunft zu kontrollieren.</p>'
          + '<p>Experten fordern deshalb mehr Medienkompetenz in der Schule. Man müsse lernen, '
          + 'eine Quelle zu bewerten, bevor man einen Artikel teilt. Die wachsende Zahl der '
          + 'Fake News mache diese Fähigkeit überlebenswichtig, erklärte der Leiter der Studie '
          + 'in einem Interview.</p>'
          + '<p>Zusammenfassend lässt sich sagen, dass die sozialen Netzwerke weder gut noch '
          + 'schlecht sind — entscheidend ist, wie man sie nutzt.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Jugendliche verbringen durchschnittlich vier Stunden täglich in sozialen Netzwerken.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… durchschnittlich vier Stunden täglich.</span>'},
        {id:'I.2',type:'vf',t:'Diese Zahl ist in fünf Jahren gesunken.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… um sechzig Prozent <b>gestiegen</b> sei.</span>'},
        {id:'I.3',type:'vf',t:'Jeder dritte Jugendliche prüft die Quelle nicht.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… glaubt jeder dritte Jugendliche eine Nachricht, ohne ihre '
              + 'Herkunft zu kontrollieren.</span>'},
        {id:'I.4',type:'vf',t:'Die sozialen Netzwerke sind laut Autor grundsätzlich schlecht.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… weder gut noch schlecht sind.</span>'},
        {id:'I.5',type:'txt',t:'Was fordern die Experten?',pts:2,
         rep:'Sie fordern mehr Medienkompetenz in der Schule.',
         key:['medienkompetenz','schule'],
         just:'<span class="de-in">Experten fordern deshalb mehr Medienkompetenz in der Schule.</span>'},
        {id:'I.6',type:'txt',t:'Relevez une forme de Konjunktiv I du texte et expliquez sa fonction.',pts:2,
         rep:'« gestiegen sei » — elle signale un discours rapporté (distance journalistique).',
         key:['sei','werde','müsse','indirekte rede','rapporté'],
         just:'<span class="de-in">gestiegen <b>sei</b> · geprüft <b>werde</b> · Man <b>müsse</b> '
              + 'lernen</span> = Konjunktiv I de l’indirekte Rede.'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Er sagt, er ___ krank.»',
         opts:['sei','ist','wäre','war'],a:0,pts:1,
         why:'Konjunktiv I de sein → <b>sei</b>.'},
        {id:'II.2',type:'qcm',t:'«Das ist der Artikel, ___ ich gesprochen habe.»',
         opts:['über den','über dem','über das','über der'],a:0,pts:1,
         why:'<span class="de-in">sprechen über + Akkusativ</span> → <b>über den</b>.'},
        {id:'II.3',type:'qcm',t:'«die ___ Preise» (qui montent, action en cours)',
         opts:['steigenden','gestiegenen','gesteigerten','steigend'],a:0,pts:1,
         why:'Partizip I décliné : steigend + -en.'},
        {id:'II.4',type:'qcm',t:'Genre de «die Nachrichtenagentur» :',
         opts:['der','die','das','—'],a:1,pts:1,
         why:'Le genre vient du dernier élément : <b>die</b> Agentur.'},
        {id:'II.5',type:'txt',t:'Complète : «Die Quelle, ___ die Nachricht stammt.»',pts:1,rep:'aus der',
         key:['aus der'],just:'<span class="de-in">stammen <b>aus</b> + Datif</span>.'},
        {id:'II.6',type:'txt',t:'Konjunktiv I de «haben» (3ᵉ personne) :',pts:1,rep:'habe',
         key:['habe'],just:'Radical hab- + e.'},
        {id:'II.7',type:'txt',t:'Partizip I de «wachsen» :',pts:1,rep:'wachsend',
         key:['wachsend'],just:'Infinitif + <b>-d</b>.'},
        {id:'II.8',type:'txt',t:'Traduis : «حسب الجريدة، الوضع خطير»',pts:1,
         rep:'Laut der Zeitung ist die Lage ernst.',key:['laut','zeitung'],
         just:'<span class="de-in"><b>Laut</b> + Génitif/Datif</span>, indicatif admis.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب مقالاً صحفياً من 15 سطراً بعنوان «Medien — Fluch oder Segen?» : '
           + 'عنوان + مقدمة بحقيقة رقمية · اقتباس منقول بـ Konjunktiv I · '
           + 'جملة موصولة مع حرف جر · مشاركان وصفيان (Partizip I + II) · '
           + 'حجتان مع مثالين · خاتمة (Zusammenfassend + رأيك).',
         grille:[['Schlagzeile + Einleitung avec un fait chiffré','0.5'],
                 ['1 citation au Konjunktiv I (sei/habe/werde/müsse)','0.5'],
                 ['1 relative avec préposition (über die / aus der / in der)','0.5'],
                 ['1 Partizip I + 1 Partizip II employés comme adjectifs','0.5'],
                 ['2 arguments avec exemples','0.5'],
                 ['Schluss : Zusammenfassend + Meiner Meinung nach','0.5'],
                 ['lexique des médias (8 mots) + orthographe et majuscules','1.0']],
         texte:'<div class="reading"><p><b>Medien — Fluch oder Segen?</b></p>'
              + '<p>Eine gestern veröffentlichte Studie zeigt, dass algerische Jugendliche '
              + 'vier Stunden täglich in sozialen Netzwerken verbringen. Der Leiter der Studie '
              + 'erklärte, dass diese Zahl in fünf Jahren um sechzig Prozent gestiegen sei.</p>'
              + '<p>Dafür spricht, dass die Informationen heute schneller fließen als je zuvor. '
              + 'Die Nachrichten, über die früher nur die Zeitung berichtete, erreichen uns in '
              + 'Sekunden. Die wachsende Zahl der Nutzer beweist, wie wichtig diese Kanäle '
              + 'geworden sind.</p>'
              + '<p>Dagegen spricht allerdings, dass die Glaubwürdigkeit der Quellen selten '
              + 'geprüft werde. Laut der Studie glaubt jeder dritte Jugendliche eine Nachricht, '
              + 'ohne ihre Herkunft zu kontrollieren. Man müsse lernen, eine Quelle zu '
              + 'bewerten, bevor man einen Artikel teilt.</p>'
              + '<p>Zusammenfassend lässt sich sagen, dass die Medien weder gut noch schlecht '
              + 'sind. Meiner Meinung nach entscheidet die Medienkompetenz: Wer kritisch liest, '
              + 'gewinnt — wer alles glaubt, verliert.</p></div>',
         modell:'Modellösung'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U15 = {
  unite: 15,
  titre: 'التصحيح النموذجي — الوحدة 15 : Medienwelt',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'… durchschnittlich vier Stunden täglich.' },
    { id:'I.2', reponse:'Falsch', justification:'Die Zahl ist um 60 % gestiegen, nicht gesunken.' },
    { id:'I.3', reponse:'Richtig', justification:'Jeder dritte glaubt eine Nachricht ohne Kontrolle.' },
    { id:'I.4', reponse:'Falsch', justification:'Die Netzwerke sind weder gut noch schlecht.' },
    { id:'I.5', reponse:'Mehr Medienkompetenz in der Schule.', justification:'Experten fordern deshalb mehr Medienkompetenz in der Schule.' },
    { id:'I.6', reponse:'« gestiegen sei » — discours rapporté (indirekte Rede), distance journalistique.', justification:'Le Konjunktiv I signale qu’on rapporte sans prendre position.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'sei', regle:'Konjunktiv I de sein (forme propre)' },
    { id:'II.2', reponse:'über den', regle:'sprechen über + Akkusativ' },
    { id:'II.3', reponse:'steigenden', regle:'Partizip I décliné = action en cours' },
    { id:'II.4', reponse:'die', regle:'genre du composé = genre du dernier élément' },
    { id:'II.5', reponse:'aus der', regle:'stammen aus + Datif' },
    { id:'II.6', reponse:'habe', regle:'radical hab- + e' },
    { id:'II.7', reponse:'wachsend', regle:'Infinitif + -d' },
    { id:'II.8', reponse:'Laut der Zeitung ist die Lage ernst.', regle:'laut + Génitif/Datif, indicatif admis' }
  ],
  partie_III: {
    bareme: [['Schlagzeile + Einleitung chiffrée','0.5'],['1 Konjunktiv I','0.5'],
             ['1 relative avec préposition','0.5'],['Partizip I + II','0.5'],
             ['2 arguments avec exemples','0.5'],['Schluss Zusammenfassend + opinion','0.5'],
             ['lexique médias + orthographe','1.0']],
    Modellösung: 'Medien — Fluch oder Segen? Eine gestern veröffentlichte Studie zeigt, dass '
      + 'Jugendliche vier Stunden täglich online sind. Der Leiter erklärte, die Zahl sei um '
      + '60 % gestiegen. Die Nachrichten, über die früher nur die Zeitung berichtete, erreichen '
      + 'uns in Sekunden. Dagegen wird die Glaubwürdigkeit der Quellen selten geprüft. Man '
      + 'müsse lernen, eine Quelle zu bewerten. Zusammenfassend lässt sich sagen, dass die '
      + 'Medien weder gut noch schlecht sind. Meiner Meinung nach entscheidet die '
      + 'Medienkompetenz.',
    modele: 'Medien — Fluch oder Segen? Eine gestern veröffentlichte Studie zeigt, dass '
      + 'Jugendliche vier Stunden täglich online sind. Der Leiter erklärte, die Zahl sei um '
      + '60 % gestiegen. Die Nachrichten, über die früher nur die Zeitung berichtete, erreichen '
      + 'uns in Sekunden. Dagegen wird die Glaubwürdigkeit der Quellen selten geprüft. Man '
      + 'müsse lernen, eine Quelle zu bewerten. Zusammenfassend lässt sich sagen, dass die '
      + 'Medien weder gut noch schlecht sind. Meiner Meinung nach entscheidet die '
      + 'Medienkompetenz.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 15 🔁' }
  },
  erreurs_frequentes: [
    '~~Er sagt, dass er ist krank~~ → Konjunktiv I : <span class="de-in">dass er krank '
    + '<b>sei</b></span>.',
    '~~die Nachrichten Agentur~~ → les composés s’écrivent en <b>un seul mot</b> : '
    + '<b>die Nachrichtenagentur</b>.',
    '~~der Zeitungsartikel~~ attendu comme féminin → le genre vient du <b>dernier</b> élément : '
    + '<span class="de-in"><b>der</b> Artikel → der Zeitungsartikel</span>.',
    '~~das Thema, über das → woüber~~ → la forme correcte est <b>worüber</b> (avec r après wo).',
    '~~der Mann, wo ich warte~~ → préposition obligatoire : <span class="de-in">der Mann, '
    + '<b>auf den</b> ich warte</span>.',
    '~~die gestiegenen Preise~~ pour « les prix qui montent » → action en cours = Partizip I : '
    + '<span class="de-in">die <b>steigenden</b> Preise</span>.',
    '~~das seiende Problem~~ → pas de Partizip I avec les verbes d’état.',
    '~~Wir kommen, sagte er~~ (ambigu) → quand le Konjunktiv I ressemble à l’indicatif, '
    + 'on bascule au Konjunktiv II : <span class="de-in">sie <b>kämen</b></span>.',
    '~~Die Studie zeigt dass…~~ → la virgule est <b>obligatoire</b> avant dass et devant '
    + 'toute relative.',
    '~~sich informieren auf~~ → <span class="de-in">sich informieren <b>über</b> + Akkusativ</span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE15 = { meta: UNITE15_META, seances: SEANCES_U15, devoir: DEVOIR_U15,
                   corrige: CORRIGE_U15 };
