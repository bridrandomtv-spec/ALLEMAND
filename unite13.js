/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite13.js
   3AS · الوحدة 13 : Gesundheit und Lebensweise — الصحة ونمط الحياة
   6 حصص + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · 3AS · الفصل الثالث · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE13_META = {
  n: 13, de: 'Gesundheit und Lebensweise', ar: 'الصحة ونمط الحياة',
  niveau: '3AS', trimestre: 3, periode: 'فيفري — مارس', duree_totale: 360, cecrl: 'B2',
  icon: '🏥', cloture_trimestre: false,
  objectifs: ['تسمية أعضاء الجسم والأمراض والأعراض','وصف الحالة الصحية عند الطبيب',
              'إعطاء نصائح صحية بصيغة الأمر و Konjunktiv II','الأفعال الانعكاسية المتعلقة بالصحة',
              'فهم نص توعوي حول نمط الحياة','إنتاج نص حجاجي-توعوي من 12 إلى 15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Gesundheit','die Krankheit','das Symptom','der Arzt','die Ernährung',
                    'sich erholen','die Vorsorge'],
  grammaire_cle: ['Imperativ (du/ihr/Sie)','Modalverben: sollen · müssen · dürfen',
                  'Konjunktiv II pour le conseil (sollten)','Reflexive Verben',
                  'Adjektive mit Präpositionen']
};

const SEANCES_U13 = [
  { n:1, de:'Körper und Krankheiten', ar:'الجسم والأمراض', dur:60,
    obj:['تسمية أعضاء الجسم','التعبير عن الألم','الأسماء المركّبة الطبية'],
    lex:[['der Körper','الجسم'],['der Kopf','الرأس'],['der Hals','العنق / الحلق'],
         ['die Schulter','الكتف'],['der Arm / die Hand','الذراع / اليد'],
         ['der Bauch','البطن'],['das Bein / der Fuß','الساق / القدم'],
         ['das Herz','القلب'],['die Lunge','الرئة'],['der Magen','المعدة'],
         ['die Kopfschmerzen','الصداع'],['das Fieber','الحمّى'],['der Husten','السعال'],
         ['die Erkältung','الزكام'],['die Grippe','الإنفلونزا'],['die Allergie','الحساسية'],
         ['die Wunde','الجرح'],['das Medikament','الدواء'],['die Tablette','الحبة'],
         ['die Apotheke','الصيدلية'],['das Krankenhaus','المستشفى'],
         ['die Krankenkasse','صندوق التأمين']],
    gram:{t:'Les noms composés de la douleur : la douleur + le membre, au PLURIEL',
      b:['<span class="de-in">der Kopf + die Schmerzen → <b>die Kopfschmerzen</b></span> (toujours pluriel)',
         '<span class="de-in">der Bauch → <b>die Bauchschmerzen</b></span> · '
       + '<span class="de-in">das Ohr → <b>die Ohrenschmerzen</b></span>',
         'Exprimer la douleur : <span class="de-in">Ich <b>habe</b> Kopfschmerzen.</span> '
       + '(haben, jamais sein)',
         '<span class="de-in">Mein Kopf <b>tut</b> weh.</span> = <b>wehtun</b> (verbe séparable)',
         'Le genre du composé = genre du DERNIER mot : <span class="de-in">die Schmerz<b>en</b></span> '
       + '(pluriel), <span class="de-in">das Fieber</span> (neutre).'],
      tbl:[['der Kopf','die Kopfschmerzen','Ich habe Kopfschmerzen.'],
           ['der Bauch','die Bauchschmerzen','Mein Bauch tut weh.'],
           ['der Hals','die Halsschmerzen','Ich habe Halsschmerzen.'],
           ['das Ohr','die Ohrenschmerzen','Mein Ohr tut weh.'],
           ['—','das Fieber','Ich habe 39 Grad Fieber.']],
      ex:'<span class="de-in">Seit zwei Tagen <b>habe ich</b> starke Kopfschmerzen '
       + 'und mein Hals <b>tut</b> weh.</span>'},
    exos:[{q:'«J’ai mal à la tête.» — traduction correcte :',
           opts:['Ich bin Kopfschmerzen.','Ich habe Kopfschmerzen.',
                 'Mein Kopf ist weh.','Ich habe Kopfschmerz.'],a:1,
           why:'La douleur s’exprime avec <b>haben</b> : <span class="de-in">Ich <b>habe</b> '
           + 'Kopfschmerzen.</span> (toujours au pluriel).'},
          {q:'Pluriel de «der Schmerz» :',opts:['die Schmerze','die Schmerzen','das Schmerze','die Schmerzen'],a:1,
           why:'<span class="de-in">der Schmerz → die Schmerz<b>en</b></span>.'},
          {q:'«Mein Bauch ___ weh.»',opts:['tut','macht','ist','hat'],a:0,
           why:'<span class="de-in"><b>wehtun</b></span> : <span class="de-in">Mein Bauch '
           + '<b>tut</b> weh.</span>'},
          {q:'Genre de «das Krankenhaus» vient de :',
           opts:['Kranken','Haus','les deux','aucun'],a:1,
           why:'Le genre d’un mot composé = genre du <b>dernier</b> élément : <b>das Haus</b>.'},
          {q:'«die Erkältung» signifie :',opts:['الإنفلونزا','الزكام','الحساسية','الحمّى'],a:1,
           why:'<span class="de-in">die Erkältung</span> = الزكام · <span class="de-in">die '
           + 'Grippe</span> = الإنفلونزا.'}]},

  { n:2, de:'Beim Arzt — Symptome beschreiben', ar:'عند الطبيب — وصف الأعراض', dur:60,
    obj:['dialogue médical complet','depuis quand (seit + Datif)','intensité et fréquence','politesse au cabinet'],
    lex:[['der Patient / die Patientin','المريض / المريضة'],['die Sprechstunde','ساعة الاستقبال'],
         ['der Termin','الموعد'],['untersuchen','يفحص'],['verschreiben','يصف (دواءً)'],
         ['blutdruck','ضغط الدم'],['das Rezept','الوصفة الطبية'],['sich krank melden','يُعلن مرضه'],
         ['Mir ist übel.','أشعر بالغثيان.'],['Ich fühle mich schwach.','أشعر بالضعف.'],
         ['Seit wann haben Sie…?','منذ متى لديك…؟'],['Es begann vor drei Tagen.','بدأ قبل ثلاثة أيام.'],
         ['Ich habe Durchfall.','لديّ إسهال.'],['Mir ist schwindlig.','أشعر بالدوخة.']],
    gram:{t:'« seit » + Datif = durée qui continue ; « vor » + Datif = point de départ passé',
      tbl:[['Seit wann sind Sie krank?','منذ متى أنت مريض؟','— Seit Montag.'],
           ['Seit drei Tagen habe ich Fieber.','منذ ثلاثة أيام ولديّ حمّى.','(encore maintenant)'],
           ['Es begann vor drei Tagen.','بدأ قبل ثلاثة أيام.','(point de départ)'],
           ['Wie oft? / Wie stark?','كم مرة؟ / ما شدّته؟','— Zweimal täglich, sehr stark.']],
      b:['<b>seit</b> + Datif → l’action continue : <span class="de-in">Seit zwei Wochen '
       + '<b>husten</b> ich.</span>',
         '<b>vor</b> + Datif → moment du passé : <span class="de-in">Vor einer Woche '
       + '<b>begann</b> es.</span>',
         '⚠️ Ne jamais dire ~~seit drei Tage~~ → <span class="de-in">seit drei Tage<b>n</b></span> '
       + '(Datif pluriel prend -n).',
         'Chez le médecin, vouvoiement <b>Sie</b> obligatoire : '
       + '<span class="de-in">Wie fühlen <b>Sie</b> sich?</span>'],
      ex:'<span class="de-in">— Guten Tag, was fehlt Ihnen? — Ich habe seit zwei Tagen '
       + 'Halsschmerzen und mir ist schwindlig. — Ich untersuche Sie. Öffnen Sie bitte den Mund.</span>'},
    exos:[{q:'«___ drei Tagen habe ich Fieber.»',opts:['Seit','Vor','Nach','Ab'],a:0,
           why:'Durée qui continue → <b>seit</b> + Datif.'},
          {q:'«Es begann ___ einer Woche.»',opts:['seit','vor','für','während'],a:1,
           why:'Point de départ passé → <b>vor</b> + Datif.'},
          {q:'«Ich ___ mich schwach.»',opts:['fühle','bin','habe','werde'],a:0,
           why:'<span class="de-in">sich <b>fühlen</b></span> (verbe réfléchi).'},
          {q:'«Mir ist ___ .» (j’ai la nausée)',opts:['übel','krank','schlecht sein','weh'],a:0,
           why:'Expression figée : <span class="de-in">Mir ist <b>übel</b>.</span> '
           + '(datif de la personne).'},
          {q:'Chez le médecin, on emploie :',opts:['du','ihr','Sie','man'],a:2,
           why:'Vouvoiement <b>Sie</b> obligatoire (professionnel, inconnu).'},
          {q:'«Seit zwei ___» (depuis deux jours)',opts:['Tag','Tage','Tagen','Tags'],a:2,
           why:'<span class="de-in">seit</span> + Datif pluriel → Tage<b>n</b>.'}]},

  { n:3, de:'Gesunde Ernährung', ar:'التغذية الصحية', dur:60,
    obj:['vocabulaire de l’alimentation saine','Impératif (3 formes)','quantités et fréquence','verbes réfléchis de l’hygiène de vie'],
    lex:[['die Ernährung','التغذية'],['ausgewogen','متوازن'],['fettarm','قليل الدسم'],
         ['zuckerhaltig','محتوي على السكر'],['das Vollkornbrot','خبز القمح الكامل'],
         ['das Gemüse / das Obst','الخضروات / الفواكه'],['die Hülsenfrüchte','البقوليات'],
         ['das Olivenöl','زيت الزيتون'],['die Fast-Food-Kette','سلسلة الوجبات السريعة'],
         ['das Übergewicht','الوزن الزائد'],['die Diät','الحمية'],
         ['sich gesund ernähren','يتغذّى صحياً'],['sich ausruhen','يرتاح'],
         ['sich bewegen','يتحرّك / يمارس الرياضة'],['auf etwas verzichten','يتخلى عن شيء'],
         ['fünf Portionen pro Tag','خمس حصص في اليوم']],
    gram:{t:'Impératif — donner un conseil sanitaire, 3 formes',
      tbl:[['du','<b>Iss</b> mehr Gemüse!','radical sans -st ni pronom (verbes forts : umlaut perdu)'],
           ['ihr',''<b>Esst</b> mehr Gemüse!''.replace("''","'), 'forme du présent'],
           ['Sie','<b>Essen Sie</b> mehr Gemüse!','infinitif + Sie']],
      b:['<b>sollen</b> = conseil reçu d’un tiers : <span class="de-in">Der Arzt sagt, ich '
       + '<b>soll</b> mehr trinken.</span>',
         '<b>müssen</b> = obligation : <span class="de-in">Ich <b>muss</b> abnehmen.</span>',
         '<b>dürfen nicht</b> = interdiction : <span class="de-in">Du <b>darfst</b> kein Fast '
       + 'Food <b>essen</b>.</span>',
         '<span class="de-in">auf + Akkusativ <b>verzichten</b></span> : '
       + '<span class="de-in">Ich verzichte <b>auf</b> Süßigkeiten.</span>',
         'Verbes réfléchis de l’hygiène de vie : <span class="de-in">sich gesund <b>ernähren</b> · '
       + 'sich <b>ausruhen</b> · sich viel <b>bewegen</b></span>'],
      ex:'<span class="de-in"><b>Iss</b> fünf Portionen Obst und Gemüse, <b>trink</b> '
       + 'anderthalb Liter Wasser und <b>beweg dich</b> täglich!</span>'},
    exos:[{q:'Impératif (du) de «essen» :',opts:['Esse!','Iss!','Esst!','Essen Sie!'],a:1,
           why:'Verbe fort : <span class="de-in">du <b>isst</b></span> → <b>Iss!</b> '
           + '(l’umlaut disparaît).'},
          {q:'Impératif (Sie) de «trinken» :',opts:['Trink!','Trinkt!','Trinken Sie!','Getrunken!'],a:2,
           why:'Sie → infinitif + <b>Sie</b>.'},
          {q:'«Ich verzichte ___ Süßigkeiten.»',opts:['auf','über','für','mit'],a:0,
           why:'<span class="de-in"><b>verzichten auf</b> + Akkusativ</span>.'},
          {q:'«Du ___ nicht so viel Fast Food essen.» (interdiction du médecin)',
           opts:['musst','sollst','darfst','kannst'],a:2,
           why:'<span class="de-in"><b>dürfen nicht</b></span> = interdiction. '
           + '<b>müssen nicht</b> = « ce n’est pas obligatoire ».'},
          {q:'«Ernähre ___ gesund!» (du)',opts:['dich','dir','du','sich'],a:0,
           why:'<span class="de-in">sich ernähren</span> → au impératif du : <b>dich</b>.'},
          {q:'«ausgewogen» signifie :',opts:['متوازن','قليل الدسم','مقلي','حار'],a:0,
           why:'<span class="de-in">eine <b>ausgewogene</b> Ernährung</span> = تغذية متوازنة.'}]},

  { n:4, de:'Ratschläge geben — Konjunktiv II', ar:'إسداء النصائح — صيغة الافتراض', dur:60,
    obj:['conseiller avec sollten','Konjunktiv II de haben/sein/können','atténuer un reproche','structures impersonnelles'],
    lex:[['Du solltest…','يجب عليك أن…',''],['An deiner Stelle würde ich…','لو كنت مكانك لـ…',''],
         ['Es wäre besser, wenn…','سيكون أفضل لو…',''],['Ich rate dir, … zu','أنصحك بأن…',''],
         ['Du könntest auch…','يمكنك أيضاً…',''],['Wenn ich du wäre, …','لو كنت أنا أنت…',''],
         ['Gesund bleiben','البقاء بصحة جيدة',''],['die Vorsorgeuntersuchung','الفحص الوقائي','']],
    gram:{t:'Konjunktiv II — le conseil poli (et le reproche atténué)',
      tbl:[['sein','wäre','Wenn ich reich wäre, …'],
           ['haben','hätte','Du hättest zum Arzt gehen sollen.'],
           ['können','könnte','Du könntest mehr schlafen.'],
           ['müssen','müsste','Er müsste sich ausruhen.'],
           ['sollen','sollte','<b>Du solltest</b> weniger Zucker essen.'],
           ['werden','würde','An deiner Stelle würde ich Sport treiben.']],
      b:['<b>sollte</b> = la forme canonique du conseil : '
       + '<span class="de-in">Du <b>solltest</b> acht Stunden schlafen.</span>',
         '<b>würde + Infinitiv</b> pour tous les autres verbes : '
       + '<span class="de-in">Ich <b>würde</b> an deiner Stelle <b>verzichten</b>.</span>',
         'Reproche atténué au passé : <span class="de-in">Du <b>hättest</b> zum Arzt '
       + '<b>gehen sollen</b>.</span> (double infinitif en fin)',
         'Structure impersonnelle : <span class="de-in">Es <b>wäre</b> besser, wenn du '
       + 'weniger rauchen <b>würdest</b>.</span>',
         '⚠️ Jamais ~~würde sein~~ / ~~würde haben~~ → <b>wäre</b> / <b>hätte</b>.'],
      ex:'<span class="de-in">Du <b>solltest</b> täglich 30 Minuten spazieren gehen. '
       + 'An deiner Stelle <b>würde</b> ich auch auf Zucker <b>verzichten</b>.</span>'},
    exos:[{q:'«Du ___ weniger Zucker essen.» (conseil)',opts:['solltest','sollst','musst','würdest'],a:0,
           why:'Conseil → Konjunktiv II de sollen : <b>solltest</b>.'},
          {q:'«Wenn ich du ___, würde ich zum Arzt gehen.»',opts:['wäre','würde','bin','hätte'],a:0,
           why:'<span class="de-in">Wenn ich du <b>wäre</b></span> — jamais ~~würde sein~~.'},
          {q:'«Du ___ zum Arzt gehen sollen.» (reproche atténué au passé)',
           opts:['hättest','würdest','bist','habest'],a:0,
           why:'Passé du Konjunktiv II : <b>hättest</b> + double infinitif en fin.'},
          {q:'«An deiner Stelle ___ ich mehr schlafen.»',opts:['würde','wäre','hätte','sollte'],a:0,
           why:'<span class="de-in">würde</span> + infinitif pour les verbes ordinaires.'},
          {q:'«Es ___ besser, wenn du auf Fast Food verzichten würdest.»',
           opts:['wäre','würde','ist','werde'],a:0,
           why:'<span class="de-in">Es <b>wäre</b> besser, wenn…</span> (Konjunktiv II de sein).'},
          {q:'Quelle phrase est la plus POLIE pour conseiller ?',
           opts:['Du musst Sport machen!','Du solltest Sport machen.',
                 'Mach Sport!','Sport ist nötig.'],a:1,
           why:'<b>sollte</b> (Konjunktiv II) atténue ; <b>muss</b> et l’impératif sont directs.'}]},

  { n:5, de:'Textverständnis : «Gesund leben in Algerien»', ar:'فهم نص — العيش بصحة في الجزائر', dur:60,
    obj:['lire un texte argumentatif de santé','repérer thèse/arguments/exemples','distinguer fait et opinion','répondre par phrase complète'],
    texte:'<div class="reading"><p><b>Gesund leben in Algerien</b></p>'
        + '<p>Die algerische Küche ist von Natur aus gesund: viel Gemüse, Olivenöl, '
        + 'Hülsenfrüchte und frisches Brot. Couscous mit Lammfleisch und gedämpftem Gemüse '
        + 'liefert alles, was der Körper braucht. Trotzdem nehmen Übergewicht und Diabetes '
        + 'bei Jugendlichen seit zehn Jahren deutlich zu.</p>'
        + '<p>Ärzte nennen drei Ursachen. Erstens essen viele Schüler Fast Food vor der '
        + 'Schule und trinken süße Limonade statt Wasser. Zweitens bewegen sie sich weniger '
        + 'als früher: Statt auf der Straße Fußball zu spielen, sitzen sie stundenlang vor '
        + 'dem Bildschirm. Drittens schlafen sie zu wenig — im Durchschnitt weniger als '
        + 'sieben Stunden, obwohl Jugendliche acht bis zehn Stunden bräuchten.</p>'
        + '<p>Dabei wäre die Lösung einfach. Man sollte fünf Portionen Obst und Gemüse pro '
        + 'Tag essen, anderthalb Liter Wasser trinken und sich täglich dreißig Minuten '
        + 'bewegen. An deiner Stelle würde ich auch auf zuckerhaltige Getränke verzichten. '
        + 'Die traditionelle Küche muss man dafür gar nicht aufgeben — im Gegenteil: '
        + 'Sie ist bereits die beste Vorsorge.</p>'
        + '<p>Zusammenfassend lässt sich sagen: Das Problem ist nicht unser Essen, sondern '
        + 'unser Lebensstil. Wer wieder kocht, zu Fuß geht und früh schlafen geht, lebt '
        + 'gesünder als mit jeder teuren Diät.</p></div>',
    exos:[{q:'Richtig oder Falsch : La cuisine algérienne est naturellement saine.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Die algerische Küche ist <b>von Natur aus gesund</b>.</span>'},
          {q:'Richtig oder Falsch : Le surpoids recule chez les jeunes depuis dix ans.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… nehmen Übergewicht und Diabetes … <b>deutlich zu</b>.</span> '
           + '(ils augmentent).'},
          {q:'Richtig oder Falsch : les jeunes dorment en moyenne moins de 7 heures.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">im Durchschnitt <b>weniger als sieben Stunden</b></span>.'},
          {q:'Richtig oder Falsch : l’auteur recommande d’abandonner la cuisine traditionnelle.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Die traditionelle Küche muss man dafür <b>gar nicht '
           + 'aufgeben</b></span> — au contraire.'},
          {q:'Combien de causes les médecins citent-ils ?',opts:['deux','trois','quatre','cinq'],a:1,
           why:'<span class="de-in">Ärzte nennen <b>drei</b> Ursachen.</span> '
           + '(Fast Food · sédentarité · manque de sommeil)'},
          {q:'Quelle structure sert à donner un CONSEIL dans le texte ?',
           opts:['Man sollte …','Man muss …','Man kann …','Man darf …'],a:0,
           why:'<span class="de-in">Man <b>sollte</b> fünf Portionen … essen</span> — '
           + 'Konjunktiv II de sollen = conseil.'},
          {q:'Quel connecteur introduit la conclusion ?',
           opts:['Trotzdem','Dabei','Zusammenfassend','Erstens'],a:2,
           why:'<span class="de-in"><b>Zusammenfassend</b> lässt sich sagen…</span>'},
          {q:'«An deiner Stelle würde ich …» est :',
           opts:['un ordre','un conseil atténué','un constat','un reproche'],a:1,
           why:'Konjunktiv II + <span class="de-in">an deiner Stelle</span> = conseil poli.'}]},

  { n:6, de:'Textproduktion und Konsolidierung', ar:'إنتاج كتابي وتثبيت — نمط حياتي صحي', dur:60,
    obj:['rédiger un texte argumentatif de santé','Impératif + sollten + würde','connecteurs (erstens/zweitens/drittens)','révision transversale U13'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً من '
           + '<b>12 إلى 15 سطراً</b> تنصح فيه زميلك باتباع نمط حياة صحي. احترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>Einleitung</b> : constat du problème (Übergewicht, Fast Food)</li>'
           + '<li><b>3 causes</b> introduites par <span class="de-in">erstens · zweitens · '
           + 'drittens</span></li>'
           + '<li><b>3 conseils</b> : un au <b>Impératif</b>, un avec <b>sollte</b>, '
           + 'un avec <b>An deiner Stelle würde ich…</b></li>'
           + '<li><b>1 verbe réfléchi</b> : <span class="de-in">sich gesund ernähren · '
           + 'sich bewegen · sich ausruhen</span></li>'
           + '<li><b>Schluss</b> avec <span class="de-in">Zusammenfassend lässt sich sagen, '
           + 'dass…</span></li>'
           + '</ul></div></div>',
    texte:'<div class="corrige"><h3>✅ Modellösung — نموذج الإجابة</h3><div class="reading">'
        + '<p>Immer mehr algerische Jugendliche leiden unter Übergewicht. Woran liegt das? '
        + 'Erstens essen sie Fast Food vor der Schule und trinken süße Limonade statt Wasser. '
        + 'Zweitens bewegen sie sich kaum noch, weil sie stundenlang vor dem Bildschirm sitzen. '
        + 'Drittens schlafen sie weniger als sieben Stunden, obwohl sie acht bis zehn Stunden '
        + 'bräuchten.</p>'
        + '<p>Was kannst du tun? Iss jeden Tag fünf Portionen Obst und Gemüse! Du solltest '
        + 'anderthalb Liter Wasser trinken und auf zuckerhaltige Getränke verzichten. '
        + 'An deiner Stelle würde ich auch täglich dreißig Minuten spazieren gehen. '
        + 'Außerdem ist es wichtig, sich gesund zu ernähren und sich genug auszuruhen.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass das Problem nicht unsere Küche ist, '
        + 'sondern unser Lebensstil. Die traditionelle algerische Ernährung ist bereits '
        + 'die beste Vorsorge — man muss nur wieder selbst kochen, zu Fuß gehen und früh '
        + 'schlafen gehen. Wer das tut, bleibt fit, ohne teure Diät.</p></div></div>',
    exos:[{q:'Révision : «Du ___ zum Arzt gehen.» (le médecin l’a dit)',
           opts:['sollst','solltest','musst','darfst'],a:0,
           why:'Consigne reçue d’un tiers → <b>sollen</b> à l’indicatif. '
           + '<b>solltest</b> = mon propre conseil.'},
          {q:'Révision : «Seit einer Woche ___ ich Husten.»',opts:['habe','bin','werde','fühle'],a:0,
           why:'<span class="de-in">Husten <b>haben</b></span> (comme Kopfschmerzen).'},
          {q:'Révision : «___ du dich gesund?»',opts:['Ernährst','Ernährst dich','Ernährst du dich','Ernähre'],a:2,
           why:'Question : verbe en 1ʳᵉ position, puis sujet, puis pronom réfléchi : '
           + '<span class="de-in"><b>Ernährst du dich</b> gesund?</span>'},
          {type:'texte',q:'✍️ Rédige ton texte argumentatif ici (correction automatique) :',
           ph:'Immer mehr Jugendliche leiden unter Übergewigt. Erstens …'}]},
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 13 (/20) ══════════ */
const DEVOIR_U13 = {
  titre:'Évaluation — Einheit 13 : Gesundheit und Lebensweise',
  unite:13, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Gesund leben in Algerien</b></p>'
          + '<p>Die algerische Küche ist von Natur aus gesund: viel Gemüse, Olivenöl, '
          + 'Hülsenfrüchte und frisches Brot. Couscous mit Lammfleisch und gedämpftem Gemüse '
          + 'liefert alles, was der Körper braucht. Trotzdem nehmen Übergewicht und Diabetes '
          + 'bei Jugendlichen seit zehn Jahren deutlich zu.</p>'
          + '<p>Ärzte nennen drei Ursachen. Erstens essen viele Schüler Fast Food vor der '
          + 'Schule und trinken süße Limonade statt Wasser. Zweitens bewegen sie sich weniger '
          + 'als früher: Statt auf der Straße Fußball zu spielen, sitzen sie stundenlang vor '
          + 'dem Bildschirm. Drittens schlafen sie zu wenig — im Durchschnitt weniger als '
          + 'sieben Stunden, obwohl Jugendliche acht bis zehn Stunden bräuchten.</p>'
          + '<p>Dabei wäre die Lösung einfach. Man sollte fünf Portionen Obst und Gemüse pro '
          + 'Tag essen, anderthalb Liter Wasser trinken und sich täglich dreißig Minuten '
          + 'bewegen. An deiner Stelle würde ich auch auf zuckerhaltige Getränke verzichten. '
          + 'Die traditionelle Küche muss man dafür gar nicht aufgeben — im Gegenteil: '
          + 'Sie ist bereits die beste Vorsorge.</p>'
          + '<p>Zusammenfassend lässt sich sagen: Das Problem ist nicht unser Essen, sondern '
          + 'unser Lebensstil. Wer wieder kocht, zu Fuß geht und früh schlafen geht, lebt '
          + 'gesünder als mit jeder teuren Diät.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Die algerische Küche ist von Natur aus ungesund.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Die algerische Küche ist <b>von Natur aus gesund</b>.</span>'},
        {id:'I.2',type:'vf',t:'Übergewicht nimmt bei Jugendlichen zu.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… nehmen Übergewicht und Diabetes … deutlich zu.</span>'},
        {id:'I.3',type:'vf',t:'Jugendliche schlafen durchschnittlich mehr als acht Stunden.',pts:1,rep:'Falsch',
         just:'<span class="de-in">weniger als sieben Stunden</span> — alors qu’il en faudrait 8 à 10.'},
        {id:'I.4',type:'vf',t:'Man muss die traditionelle Küche aufgeben.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… muss man dafür <b>gar nicht aufgeben</b> — im Gegenteil.</span>'},
        {id:'I.5',type:'txt',t:'Nennen Sie zwei der drei Ursachen.',pts:2,
         rep:'Fast Food und süße Getränke; zu wenig Bewegung; zu wenig Schlaf.',
         key:['fast food','limonade','bildschirm','schlafen','bewegung'],
         just:'<span class="de-in">Erstens … Fast Food … Zweitens … bewegen sie sich weniger … '
              + 'Drittens schlafen sie zu wenig.</span>'},
        {id:'I.6',type:'txt',t:'Wie viel Wasser sollte man täglich trinken?',pts:2,
         rep:'Anderthalb Liter.',key:['anderthalb','1,5'],
         just:'<span class="de-in">… anderthalb Liter Wasser trinken.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ seit zwei Tagen Kopfschmerzen.»',
         opts:['habe','bin','werde','fühle'],a:0,pts:1,
         why:'La douleur s’exprime avec <b>haben</b>.'},
        {id:'II.2',type:'qcm',t:'«___ drei Wochen huste ich.» (depuis)',
         opts:['Seit','Vor','Nach','Ab'],a:0,pts:1,
         why:'<span class="de-in">seit</span> + Datif = durée qui continue.'},
        {id:'II.3',type:'qcm',t:'Impératif (du) de «essen» :',
         opts:['Esse!','Iss!','Esst!','Essen Sie!'],a:1,pts:1,
         why:'Verbe fort : du isst → <b>Iss!</b>'},
        {id:'II.4',type:'qcm',t:'«Du ___ weniger Zucker essen.» (conseil poli)',
         opts:['solltest','musst','darfst','kannst'],a:0,pts:1,
         why:'Conseil → Konjunktiv II de sollen : <b>solltest</b>.'},
        {id:'II.5',type:'txt',t:'Complète : «Ich verzichte ___ Süßigkeiten.»',pts:1,rep:'auf',
         key:['auf'],just:'<span class="de-in">verzichten <b>auf</b> + Akkusativ</span>.'},
        {id:'II.6',type:'txt',t:'Konjunktiv II de «sein» (1ʳᵉ personne) :',pts:1,rep:'wäre',
         key:['wäre','ware'],just:'<span class="de-in">ich <b>wäre</b></span> — jamais « würde sein ».'},
        {id:'II.7',type:'txt',t:'Traduis : «يجب أن ترتاح» (conseil)',pts:1,
         rep:'Du solltest dich ausruhen.',key:['solltest','ausruhen'],
         just:'<span class="de-in">sich ausruhen</span> + Konjunktiv II du conseil.'},
        {id:'II.8',type:'txt',t:'Mets à l’impératif (Sie) : «Sie trinken viel Wasser.»',pts:1,
         rep:'Trinken Sie viel Wasser!',key:['trinken sie'],
         just:'Impératif Sie = infinitif + Sie.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب نصاً حجاجياً من 12 سطراً تنصح فيه زميلك بنمط حياة صحي : '
           + 'مقدمة (مشكل الوزن الزائد)، 3 أسباب (erstens/zweitens/drittens)، '
           + '3 نصائح (أمر + sollte + An deiner Stelle würde ich)، '
           + 'فعل انعكاسي واحد، وخاتمة بـ Zusammenfassend lässt sich sagen, dass…',
         grille:[['3 causes avec erstens/zweitens/drittens','0.5'],
                 ['1 impératif correctement formé','0.5'],
                 ['1 conseil avec « sollte »','0.5'],
                 ['1 conseil avec « An deiner Stelle würde ich… »','0.5'],
                 ['1 verbe réfléchi (sich ernähren / bewegen / ausruhen)','0.5'],
                 ['conclusion avec « Zusammenfassend lässt sich sagen, dass… »','0.5'],
                 ['lexique de l’unité (8 mots) + orthographe/majuscules','1.0']],
         texte:'<div class="reading"><p>Immer mehr algerische Jugendliche leiden unter '
              + 'Übergewicht. Woran liegt das? Erstens essen sie Fast Food vor der Schule '
              + 'und trinken süße Limonade statt Wasser. Zweitens bewegen sie sich kaum noch, '
              + 'weil sie stundenlang vor dem Bildschirm sitzen. Drittens schlafen sie weniger '
              + 'als sieben Stunden.</p>'
              + '<p>Was kannst du tun? Iss jeden Tag fünf Portionen Obst und Gemüse! '
              + 'Du solltest anderthalb Liter Wasser trinken und auf zuckerhaltige Getränke '
              + 'verzichten. An deiner Stelle würde ich auch täglich dreißig Minuten spazieren '
              + 'gehen. Außerdem ist es wichtig, sich gesund zu ernähren und sich genug '
              + 'auszuruhen.</p>'
              + '<p>Zusammenfassend lässt sich sagen, dass das Problem nicht unsere Küche ist, '
              + 'sondern unser Lebensstil. Wer wieder kocht, zu Fuß geht und früh schlafen geht, '
              + 'bleibt fit — ohne teure Diät.</p></div>',
         modell:'Modellösung'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U13 = {
  unite: 13,
  titre: 'التصحيح النموذجي — الوحدة 13 : Gesundheit und Lebensweise',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Die algerische Küche ist von Natur aus gesund.' },
    { id:'I.2', reponse:'Richtig', justification:'Übergewicht und Diabetes nehmen deutlich zu.' },
    { id:'I.3', reponse:'Falsch', justification:'Im Durchschnitt weniger als sieben Stunden.' },
    { id:'I.4', reponse:'Falsch', justification:'Man muss die traditionelle Küche gar nicht aufgeben.' },
    { id:'I.5', reponse:'Fast Food und süße Getränke; zu wenig Bewegung; zu wenig Schlaf.', justification:'Erstens / Zweitens / Drittens.' },
    { id:'I.6', reponse:'Anderthalb Liter (1,5 L).', justification:'… anderthalb Liter Wasser trinken.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'habe', regle:'Kopfschmerzen haben (haben, jamais sein)' },
    { id:'II.2', reponse:'Seit', regle:'seit + Datif = durée qui continue' },
    { id:'II.3', reponse:'Iss!', regle:'verbe fort : du isst → Iss!' },
    { id:'II.4', reponse:'solltest', regle:'conseil → Konjunktiv II de sollen' },
    { id:'II.5', reponse:'auf', regle:'verzichten auf + Akkusativ' },
    { id:'II.6', reponse:'wäre', regle:'Konjunktiv II propre de sein' },
    { id:'II.7', reponse:'Du solltest dich ausruhen.', regle:'verbe réfléchi + Konjunktiv II' },
    { id:'II.8', reponse:'Trinken Sie viel Wasser!', regle:'impératif Sie = infinitif + Sie' }
  ],
  partie_III: {
    bareme: [['3 causes (erstens/zweitens/drittens)','0.5'],['1 impératif','0.5'],
             ['1 conseil avec sollte','0.5'],['1 conseil avec « An deiner Stelle würde ich »','0.5'],
             ['1 verbe réfléchi','0.5'],['conclusion Zusammenfassend','0.5'],
             ['lexique + orthographe','1.0']],
    Modellösung: 'Immer mehr algerische Jugendliche leiden unter Übergewicht. Erstens essen sie '
      + 'Fast Food und trinken süße Limonade. Zweitens bewegen sie sich kaum noch. Drittens '
      + 'schlafen sie zu wenig. Iss fünf Portionen Obst und Gemüse! Du solltest anderthalb '
      + 'Liter Wasser trinken. An deiner Stelle würde ich täglich spazieren gehen. Außerdem '
      + 'sollte man sich gesund ernähren. Zusammenfassend lässt sich sagen, dass das Problem '
      + 'unser Lebensstil ist, nicht unsere Küche.',
    modele: 'Immer mehr algerische Jugendliche leiden unter Übergewicht. Erstens essen sie '
      + 'Fast Food und trinken süße Limonade. Zweitens bewegen sie sich kaum noch. Drittens '
      + 'schlafen sie zu wenig. Iss fünf Portionen Obst und Gemüse! Du solltest anderthalb '
      + 'Liter Wasser trinken. An deiner Stelle würde ich täglich spazieren gehen. Außerdem '
      + 'sollte man sich gesund ernähren. Zusammenfassend lässt sich sagen, dass das Problem '
      + 'unser Lebensstil ist, nicht unsere Küche.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 13 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich bin Kopfschmerzen~~ → <b>Ich habe</b> Kopfschmerzen (la douleur se « possède »).',
    '~~der Kopfschmerz~~ (au singulier) → toujours au pluriel : <b>die Kopfschmerzen</b>.',
    '~~seit drei Tage~~ → Datif pluriel : <b>seit drei Tagen</b>.',
    '~~vor zwei Wochen habe ich Fieber (depuis)~~ → durée qui continue = <b>seit</b> : '
    + '<span class="de-in">Seit zwei Wochen habe ich Fieber.</span>',
    '~~Nehme du das Medikament!~~ → impératif du sans pronom ni -st : <b>Nimm</b> das Medikament!',
    '~~Du solltest zum Arzt gehen würdest~~ → un seul verbe au Konjunktiv II : '
    + '<b>Du solltest zum Arzt gehen.</b>',
    '~~würde sein / würde haben~~ → formes propres : <b>wäre</b> / <b>hätte</b>.',
    '~~Ich ernähre gesund~~ → verbe réfléchi obligatoire : Ich ernähre <b>mich</b> gesund.',
    '~~Mir ist übel sein~~ → expression figée au datif : <b>Mir ist übel.</b>',
    '~~auf Süßigkeiten verzichte~~ → préposition avant le complément : Ich verzichte '
    + '<b>auf</b> Süßigkeiten.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE13 = { meta: UNITE13_META, seances: SEANCES_U13, devoir: DEVOIR_U13,
                   corrige: CORRIGE_U13 };
