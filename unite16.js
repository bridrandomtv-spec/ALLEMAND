/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite16.js
   3AS · الوحدة 16 : Kultureller Dialog — الحوار الثقافي
   6 حصص + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · 3AS · الفصل الثالث (clôture de l'année) · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE16_META = {
  n: 16, de: 'Kultureller Dialog', ar: 'الحوار الثقافي',
  niveau: '3AS', trimestre: 3, periode: 'ماي — جوان', duree_totale: 360, cecrl: 'B2',
  icon: '🤝', cloture_trimestre: true, cloture_annee: true,
  objectifs: ['تعيين مفاهيم الثقافة والهوية','المقارنة المتقدّمة (Komparativ/Superlativ)',
              'الجمل التنازلية وافتراض العكس','الأفعال الناقصة بمعناها الذاتي (الاحتمال)',
              'فهم نص حول الحوار بين الثقافات','إنتاج نص حجاجي ختامي من 15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Kultur','die Identität','der Dialog','das Vorurteil','die Toleranz',
                    'die Vielfalt','das Erbe'],
  grammaire_cle: ['Komparativ und Superlativ (avancé)','Konzessivsätze (obwohl · trotzdem · selbst wenn)',
                  'Irrealis des Gegenteils','Subjektive Modalverben (Vermutung)']
};

const SEANCES_U16 = [
  { n:1, de:'Kultur und Identität', ar:'الثقافة والهوية', dur:60,
    obj:['définir culture et identité','lexique du patrimoine','Komposita culturels'],
    lex:[['die Kultur','الثقافة'],['die Identität','الهوية'],['das Kulturerbe','التراث الثقافي'],
         ['die Tradition','التقليد'],['der Brauch / die Bräuche','العادة / العادات'],
         ['die Vielfalt','التنوع'],['die Toleranz','التسامح'],['das Vorurteil','الحكم المسبق'],
         ['der Dialog','الحوار'],['die Begegnung','اللقاء'],['der Austausch','التبادل'],
         ['die Sprache','اللغة'],['die Religion','الدين'],['die Werte (Pl.)','القيم'],
         ['das Brauchtum','التراث الشعبي'],['die Gastfreundschaft','كرم الضيافة'],
         ['sich integrieren','يندمج'],['die Heimat','الوطن / مسقط الرأس'],
         ['das Handwerk','الحِرف اليدوية'],['die Musikrichtung','اللون الموسيقي']],
    gram:{t:'Définir un concept — les tournures attendues au BAC',
      tbl:[['Unter … versteht man','Unter Kultur versteht man …','يُقصد بـ'],
           ['Damit ist gemeint, dass …','Damit ist gemeint, dass Kultur mehr ist als Kunst.',
            'المقصود هو أن…'],
           ['Man bezeichnet … als …','Man bezeichnet Casbah als Kulturerbe.','يُسمّى… بـ'],
           ['… gilt als …','Die Gastfreundschaft gilt als algerische Tugend.','يُعتبر…']],
      b:['Le mot <b>die Kultur</b> est féminin ; <b>das Kulturerbe</b> est neutre '
       + '(le genre vient du dernier élément).',
         '<span class="de-in">die Werte</span> n’existe qu’au <b>pluriel</b> dans ce sens.',
         'Définir sans copier le dictionnaire : <b>Unter X versteht man …</b> '
       + 'est la formule la mieux notée.',
         '⚠️ <span class="de-in">die Heimat</span> ≠ <span class="de-in">das Vaterland</span> : '
       + 'Heimat est affectif, Vaterland politique.'],
      ex:'<span class="de-in"><b>Unter</b> kulturellem Dialog <b>versteht man</b> den Austausch '
       + 'zwischen Menschen verschiedener Herkunft, <b>ohne dass</b> einer seine Identität '
       + 'aufgeben muss.</span>'},
    exos:[{q:'Formule la plus valorisée pour définir un concept :',
           opts:['Kultur ist …','Unter Kultur versteht man …','Ich denke Kultur …','Kultur heißt …'],a:1,
           why:'<span class="de-in"><b>Unter … versteht man</b></span> = la tournure académique.'},
          {q:'Genre de «das Kulturerbe» vient de :',opts:['Kultur','Erbe','les deux','aucun'],a:1,
           why:'Le genre d’un composé = genre du <b>dernier</b> élément : <b>das</b> Erbe.'},
          {q:'«die Werte» (les valeurs) s’emploie :',opts:['au singulier','au pluriel seulement',
                                                            'aux deux','au neutre'],a:1,
           why:'Dans ce sens, <span class="de-in">die <b>Werte</b></span> est toujours pluriel.'},
          {q:'«das Vorurteil» signifie :',opts:['التسامح','الحكم المسبق','الحوار','التراث'],a:1,
           why:'<span class="de-in">vor</span> (قبل) + <span class="de-in">Urteil</span> (حكم) '
           + '= حكم مسبق.'},
          {q:'«Die Gastfreundschaft ___ als algerische Tugend.»',opts:['gilt','ist geltend',
                                                                        'gelten','galtet'],a:0,
           why:'<span class="de-in"><b>gelten als</b></span> = يُعتبر.'},
          {q:'Différence entre Heimat et Vaterland :',
           opts:['aucune','Heimat est affectif, Vaterland politique',
                 'Vaterland est affectif, Heimat politique','Heimat est neutre, Vaterland féminin'],a:1,
           why:'<span class="de-in">die <b>Heimat</b></span> renvoie à l’attachement personnel ; '
           + '<span class="de-in">das <b>Vaterland</b></span> au registre politique.'}]},

  { n:2, de:'Vergleichen — Komparativ und Superlativ', ar:'المقارنة — أفعل التفضيل', dur:60,
    obj:['comparer deux cultures','Komparativ avec umlaut','Superlatif absolu et relatif','expressions de proportion'],
    lex:[['älter / am ältesten','أكبر سناً'],['größer / am größten','أكبر'],
         ['lieber / am liebsten','أفضل / الأكثر تفضيلاً'],['besser / am besten','أحسن'],
         ['stärker / am stärksten','أقوى'],['ebenso … wie','تماماً مثل'],
         ['genauso … wie','مثل تماماً'],['nicht so … wie','ليس مثل'],
         ['doppelt so groß wie','ضعف حجم'],['dreimal schneller als','ثلاث مرات أسرع'],
         ['immer + Komparativ','أكثر فأكثر'],['je …, desto …','كلما… كلما…']],
    gram:{t:'als (différence) · wie (égalité) — la distinction la plus sanctionnée',
      tbl:[['différence','Komparativ + <b>als</b>','Algier ist <b>größer als</b> Oran.'],
           ['égalité','(eben)so / genauso + <b>wie</b>','Mein Deutsch ist <b>so gut wie</b> deins.'],
           ['négation','nicht so + <b>wie</b>','Er ist <b>nicht so groß wie</b> sein Bruder.'],
           ['multiples','doppelt/dreimal so … wie','Das Buch ist <b>doppelt so dick wie</b> jenes.'],
           ['superlatif relatif','am + -sten','Dies ist <b>am schwierigsten</b>.'],
           ['superlatif absolu','auf das / aufs + -ste','Er hat <b>auf das Herzlichste</b> gedankt.']],
      b:['⚠️ ~~größer wie~~ → toujours <span class="de-in">größer <b>als</b></span>. '
       + 'C’est l’erreur la plus fréquente du BAC.',
         'Umlaut au Komparativ pour les monosyllabes en a/o/u : '
       + '<span class="de-in">alt → <b>ä</b>lter · groß → gr<b>ö</b>ßer · jung → j<b>ü</b>nger</span>',
         'Irréguliers : <b>gut → besser → am besten</b> · <b>viel → mehr → am meisten</b> · '
       + '<b>gern → lieber → am liebsten</b>',
         '<b>immer + Komparativ</b> = progression : '
       + '<span class="de-in">Der Austausch wird <b>immer intensiver</b>.</span>'],
      ex:'<span class="de-in">Die algerische Gastfreundschaft ist <b>genauso</b> berühmt '
       + '<b>wie</b> die deutsche Pünktlichkeit — <b>je</b> mehr man reist, <b>desto</b> '
       + 'deutlicher sieht man diese Unterschiede.</span>'},
    exos:[{q:'«Berlin ist ___ Oran.» (plus grand)',opts:['größer als','größer wie','so groß als','mehr groß als'],a:0,
           why:'Différence → Komparativ + <b>als</b>. Jamais ~~größer wie~~.'},
          {q:'«Mein Deutsch ist ___ deins.» (aussi bon que)',opts:['so gut wie','so gut als',
                                                                  'gut wie','als gut wie'],a:0,
           why:'Égalité → <span class="de-in"><b>so</b> + adjectif + <b>wie</b></span>.'},
          {q:'Superlatif de «viel» :',opts:['vieler','am meisten','am vielsten','mehr'],a:1,
           why:'Irrégulier : viel → mehr → <b>am meisten</b>.'},
          {q:'Komparativ de «jung» :',opts:['junger','jünger','jungster','mehr jung'],a:1,
           why:'Monosyllabe en u → umlaut : <b>jünger</b>.'},
          {q:'«Dieses Buch ist ___ dick wie jenes.» (deux fois)',opts:['doppelt so','zweimal als',
                                                                       'doppelt als','zwei so'],a:0,
           why:'Multiple → <span class="de-in"><b>doppelt so</b> … wie</span>.'},
          {q:'«Der Dialog wird ___ intensiver.» (de plus en plus)',opts:['immer','je','desto','mehr'],a:0,
           why:'Progression → <span class="de-in"><b>immer</b> + Komparativ</span>.'}]},

  { n:3, de:'Konzessivsätze und Irrealis', ar:'الجمل التنازلية وافتراض العكس', dur:60,
    obj:['concession : obwohl / trotzdem / trotz','irréel du contraire : selbst wenn','nuancer un argument'],
    lex:[['obwohl','رغم أن'],['trotzdem','مع ذلك'],['trotz + Genitiv','رغم (حرف جر)'],
         ['obgleich / obschon','رغم أن (registre soutenu)'],['zwar …, aber …','صحيح أن… لكن…'],
         ['selbst wenn / auch wenn','حتى لو'],['dennoch','مع ذلك (soutenu)',],
         ['nichtsdestotrotz','مع ذلك (soutenu)'],['einräumen, dass','يُقرّ بأن']],
    gram:{t:'Concession — 3 constructions, 3 places du verbe',
      tbl:[['obwohl (conjonction)','verbe FINAL','<b>Obwohl</b> wir verschiedene Kulturen '
            + '<b>haben</b>, verstehen wir uns.'],
           ['trotzdem (adverbe)','verbe en 2','Wir sind verschieden, <b>trotzdem</b> '
            + '<b>verstehen</b> wir uns.'],
           ['trotz (préposition + Gén.)','—','<b>Trotz</b> der Unterschiede verstehen wir uns.'],
           ['selbst wenn / auch wenn','verbe FINAL','<b>Selbst wenn</b> wir uns streiten, '
            + '<b>bleiben</b> wir Freunde.']],
      b:['⚠️ ~~obwohl + verbe en 2~~ → dans une subordonnée introduite par <b>obwohl</b>, '
       + 'le verbe va à la <b>fin</b>.',
         'Si la subordonnée concessive vient en premier, la principale commence '
       + '<b>directement par son verbe</b> : '
       + '<span class="de-in">Obwohl es regnet, <b>gehen</b> wir spazieren.</span>',
         '<b>Irrealis des Gegenteils</b> : <span class="de-in"><b>Selbst wenn</b> ich '
       + 'Zeit <b>hätte</b>, <b>würde</b> ich nicht kommen.</span> (double Konjunktiv II).',
         'Registre soutenu : <b>obgleich · obschon · nichtsdestotrotz · dennoch</b>.'],
      ex:'<span class="de-in"><b>Obwohl</b> die beiden Kulturen sehr verschieden sind, '
       + '<b>gibt es</b> viele Gemeinsamkeiten. <b>Trotz</b> aller Vorurteile '
       + '<b>lässt sich</b> ein echter Dialog führen.</span>'},
    exos:[{q:'«___ es regnet, gehen wir spazieren.»',opts:['Obwohl','Trotz','Wegen','Trotzdem'],a:0,
           why:'Conjonction → <b>obwohl</b> + verbe final. <b>Trotz</b> est une préposition '
           + '(+ Nom).'},
          {q:'«Wir sind verschieden, ___ verstehen wir uns gut.»',opts:['obwohl','trotzdem',
                                                                         'trotz','weil'],a:1,
           why:'Adverbe de liaison → <b>trotzdem</b> + verbe en 2ᵉ position.'},
          {q:'«Trotz ___ Unterschiede verstehen wir uns.»',opts:['der','die','den','dem'],a:0,
           why:'<span class="de-in"><b>trotz</b> + Génitif</span> → <b>der</b> Unterschiede.'},
          {q:'«___ ich Zeit hätte, würde ich nicht kommen.» (même si)',
           opts:['Selbst wenn','Obwohl','Trotzdem','Weil'],a:0,
           why:'Irréel du contraire → <b>selbst wenn</b> / <b>auch wenn</b> + Konjunktiv II.'},
          {q:'Après une subordonnée concessive en tête, la principale commence par :',
           opts:['le sujet','le verbe','une conjonction','rien'],a:1,
           why:'Inversion : <span class="de-in">Obwohl es regnet, <b>gehen</b> wir…</span>'},
          {q:'Registre soutenu pour « dennoch » :',opts:['nichtsdestotrotz','trotzdem','aber','doch'],a:0,
           why:'<span class="de-in"><b>nichtsdestotrotz</b></span> = formule académique.'}]},

  { n:4, de:'Subjektive Modalverben — Vermutung', ar:'الأفعال الناقصة الذاتية — التعبير عن الاحتمال', dur:60,
    obj:['exprimer un degré de certitude','müssen/können/dürfen/mögen subjectifs','double infinitif au passé','nuancer un propos journalistique'],
    lex:[['Das muss stimmen.','لا بدّ أن هذا صحيح. (certitude ~95%)'],
         ['Das dürfte stimmen.','من المرجّح أن هذا صحيح. (~75%)'],
         ['Das kann stimmen.','قد يكون هذا صحيحاً. (~50%)'],
         ['Das könnte stimmen.','ربما يكون هذا صحيحاً. (~40%)'],
         ['Das mag stimmen.','قد يكون صحيحاً (concession). (~35%)'],
         ['Er soll reich sein.','يُقال إنه غني. (on-dit)'],
         ['Er will es nicht gewusst haben.','يدّعي أنه لم يكن يعلم.']],
    gram:{t:'Échelle de certitude — du certain au douteux',
      tbl:[['müssen','~95 %','Das <b>muss</b> ein Missverständnis sein.'],
           ['dürften','~75 %','Er <b>dürfte</b> bald ankommen.'],
           ['können / könnten','~50 / 40 %','Das <b>kann</b> stimmen. / Das <b>könnte</b> stimmen.'],
           ['mögen','~35 % (concessif)','Er <b>mag</b> recht haben, aber…'],
           ['sollen','on-dit / rumeur','Sie <b>soll</b> drei Sprachen sprechen.'],
           ['wollen','prétention du sujet','Er <b>will</b> nichts gesehen haben.']],
      b:['Au <b>passé</b>, on emploie le <b>double infinitif</b> en fin de phrase : '
       + '<span class="de-in">Das <b>muss</b> ein Irrtum <b>gewesen sein</b>.</span>',
         '⚠️ Ne confonds pas le modal <b>objectif</b> (obligation) et <b>subjectif</b> '
       + '(hypothèse) : <span class="de-in">Er muss lernen</span> (il doit) vs '
       + '<span class="de-in">Er muss krank sein</span> (il doit être malade = je suppose).',
         '<b>nicht können</b> = impossibilité logique : '
       + '<span class="de-in">Das <b>kann nicht</b> stimmen.</span> (ce ne peut pas être vrai).',
         'Très fréquent dans la presse : c’est le registre attendu au BAC.'],
      ex:'<span class="de-in">Der Minister <b>dürfte</b> die Kritik gelesen <b>haben</b>; '
       + 'das <b>muss</b> ein Schock <b>gewesen sein</b>. Es <b>kann</b> allerdings nicht '
       + 'stimmen, dass er zurückgetreten <b>ist</b>.</span>'},
    exos:[{q:'«Das ___ stimmen.» (certitude presque totale)',opts:['muss','kann','mag','dürfte'],a:0,
           why:'<b>müssen</b> subjectif = degré maximal de certitude (~95 %).'},
          {q:'«Er ___ reich sein.» (on le dit — rumeur)',opts:['soll','muss','kann','will'],a:0,
           why:'<b>sollen</b> subjectif = on-dit, information rapportée.'},
          {q:'Passé : «Das ___ ein Irrtum ___ .»',opts:['muss … gewesen sein','muss … sein gewesen',
                                                         'musste … gewesen sein','muss … gewesen'],a:0,
           why:'Double infinitif en fin : <b>muss</b> … <b>gewesen sein</b>.'},
          {q:'«Das kann ___ stimmen.» (impossibilité logique)',opts:['nicht','nie nichts','kein','—'],a:0,
           why:'<span class="de-in">Das <b>kann nicht</b> stimmen.</span> = ce ne peut pas être vrai.'},
          {q:'«Er ___ nichts gesehen haben.» (il prétend)',opts:['will','soll','muss','kann'],a:0,
           why:'<b>wollen</b> subjectif = prétention du sujet lui-même.'},
          {q:'Quelle nuance apporte «mögen» ?',opts:['certitude','concession (il a peut-être raison, mais…)',
                                                     'obligation','interdiction'],a:1,
           why:'<span class="de-in">Er <b>mag</b> recht haben, aber…</span> = concession polie.'}]},

  { n:5, de:'Textverständnis : «Dialog der Kulturen»', ar:'فهم نص — حوار الثقافات', dur:60,
    obj:['lire un essai culturel','repérer comparaison, concession et hypothèse','distinguer fait/opinion/rumeur','répondre par phrase complète'],
    texte:'<div class="reading"><p><b>Dialog der Kulturen — Algerien und Deutschland</b></p>'
        + '<p>Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
        + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. Zwischen '
        + 'Algerien und Deutschland gibt es diesen Austausch seit Jahrzehnten — durch '
        + 'Studenten, Gastarbeiter, Künstler und heute vor allem durch das Internet.</p>'
        + '<p>Auf den ersten Blick scheinen die beiden Kulturen sehr verschieden zu sein. '
        + 'Die algerische Gastfreundschaft ist genauso berühmt wie die deutsche '
        + 'Pünktlichkeit. Während man in Algier einen Gast spontan zum Essen einlädt, '
        + 'vereinbart man in Berlin einen Termin drei Wochen im Voraus. Trotzdem gibt es '
        + 'mehr Gemeinsamkeiten, als viele glauben: Beide Gesellschaften legen großen Wert '
        + 'auf Familie, Respekt vor dem Alter und gutes Essen.</p>'
        + '<p>Der Germanist Karim Benzid erklärte in einem Interview, die Zahl der '
        + 'Deutschlernenden in Algerien habe sich in zehn Jahren verdoppelt. Das dürfte '
        + 'vor allem an den beruflichen Perspektiven liegen: Deutsche Unternehmen suchen '
        + 'Fachkräfte, und algerische Absolventen gelten als besonders motiviert. '
        + 'Selbst wenn es Vorurteile auf beiden Seiten gäbe, ließen sie sich durch '
        + 'Begegnung abbauen.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass kultureller Dialog kein Verzicht auf '
        + 'die eigene Identität ist, sondern eine Bereicherung. Je mehr junge Menschen '
        + 'einander kennenlernen, desto weniger Raum bleibt für Vorurteile. Wer eine '
        + 'fremde Sprache lernt, öffnet nicht nur ein Buch, sondern eine Tür.</p></div>',
    exos:[{q:'Richtig oder Falsch : Le dialogue culturel exige d’abandonner son identité.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… <b>ohne dass</b> einer seine Identität <b>aufgeben '
           + 'muss</b>.</span>'},
          {q:'Richtig oder Falsch : le nombre d’apprenants d’allemand a doublé en dix ans.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… habe sich in zehn Jahren <b>verdoppelt</b>.</span> '
           + '(Konjunktiv I, discours rapporté).'},
          {q:'Richtig oder Falsch : les deux sociétés accordent peu d’importance à la famille.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Beide Gesellschaften legen <b>großen Wert auf Familie</b>.</span>'},
          {q:'Richtig oder Falsch : l’auteur conclut que le dialogue appauvrit l’identité.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… <b>kein Verzicht</b> …, sondern eine <b>Bereicherung</b>.</span>'},
          {q:'Quelle structure exprime l’égalité dans le texte ?',
           opts:['genauso … wie','größer als','je … desto','nicht so … wie'],a:0,
           why:'<span class="de-in">Die algerische Gastfreundschaft ist <b>genauso</b> berühmt '
           + '<b>wie</b> die deutsche Pünktlichkeit.</span>'},
          {q:'« Das dürfte vor allem an den beruflichen Perspektiven liegen » exprime :',
           opts:['une certitude absolue','une hypothèse probable (~75 %)','une obligation',
                 'une rumeur invérifiable'],a:1,
           why:'<b>dürften</b> subjectif = probabilité forte mais non vérifiée.'},
          {q:'« Selbst wenn es Vorurteile … gäbe, ließen sie sich … abbauen » est :',
           opts:['un Irrealis des Gegenteils','un Passiv','une relative','un comparatif'],a:0,
           why:'<span class="de-in"><b>Selbst wenn</b> + Konjunktiv II</span> = irréel du contraire.'},
          {q:'Qui est Karim Benzid ?',opts:['le ministre de l’Éducation','un germaniste interrogé',
                                            'un chef d’entreprise','l’auteur anonyme'],a:1,
           why:'<span class="de-in">Der <b>Germanist</b> Karim Benzid erklärte in einem '
           + 'Interview…</span>'}]},

  { n:6, de:'Textproduktion und Konsolidierung', ar:'إنتاج كتابي وتثبيت — بناء جسور بين الثقافات', dur:60,
    obj:['rédiger un essai culturel de clôture','définir un concept (Unter … versteht man)','comparer + concéder + émettre une hypothèse','révision transversale U13→U16'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب مقالاً من '
           + '<b>15 سطراً</b> بعنوان : <span class="de-in"><b>«Brücken bauen — warum '
           + 'kultureller Dialog wichtig ist»</b></span>'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>Einleitung</b> : définition par <span class="de-in">Unter … versteht man…</span></li>'
           + '<li><b>1 comparaison</b> : <span class="de-in">genauso … wie</span> ou '
           + '<span class="de-in">größer als</span></li>'
           + '<li><b>1 concession</b> : <span class="de-in">obwohl</span> ou '
           + '<span class="de-in">trotz + Génitif</span></li>'
           + '<li><b>1 hypothèse</b> avec un modal subjectif : '
           + '<span class="de-in">dürfte · muss · soll</span></li>'
           + '<li><b>1 Irrealis</b> : <span class="de-in">Selbst wenn …</span></li>'
           + '<li><b>Schluss</b> : <span class="de-in">Zusammenfassend lässt sich sagen, dass…</span> '
           + '+ <span class="de-in">Meiner Meinung nach…</span></li>'
           + '</ul></div></div>',
    texte:'<div class="corrige"><h3>✅ Modellösung — نموذج الإجابة</h3><div class="reading">'
        + '<p><b>Brücken bauen — warum kultureller Dialog wichtig ist</b></p>'
        + '<p>Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
        + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. In einer '
        + 'Welt, die immer stärker vernetzt ist, dürfte dieser Austausch wichtiger sein '
        + 'als je zuvor.</p>'
        + '<p>Die algerische Gastfreundschaft ist genauso berühmt wie die deutsche '
        + 'Pünktlichkeit, und beide Kulturen legen großen Wert auf Familie und Respekt. '
        + 'Obwohl es auf den ersten Blick große Unterschiede gibt, sind die Gemeinsamkeiten '
        + 'zahlreicher, als viele glauben. Trotz aller Vorurteile lässt sich ein echter '
        + 'Dialog führen, wenn beide Seiten zuhören wollen.</p>'
        + '<p>Der Germanist Karim Benzid erklärte, die Zahl der Deutschlernenden habe sich '
        + 'in zehn Jahren verdoppelt. Das muss eine große Chance für algerische Absolventen '
        + 'sein. Selbst wenn es Hindernisse gäbe, ließen sie sich durch Begegnung und '
        + 'Austausch abbauen.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass kultureller Dialog kein Verzicht, '
        + 'sondern eine Bereicherung ist. Je mehr junge Menschen einander kennenlernen, '
        + 'desto weniger Raum bleibt für Vorurteile. Meiner Meinung nach öffnet jeder, '
        + 'der eine fremde Sprache lernt, nicht nur ein Buch, sondern eine Tür.</p>'
        + '</div></div>',
    exos:[{q:'Révision U13 : «Du ___ dich gesünder ernähren.» (conseil)',
           opts:['solltest','musst','darfst','kannst'],a:0,
           why:'Conseil → Konjunktiv II de sollen : <b>solltest</b>.'},
          {q:'Révision U14 : «___ mehr wir exportieren, ___ stärker wird die Wirtschaft.»',
           opts:['Je … desto','Zwar … aber','Weder … noch','Obwohl … aber'],a:0,
           why:'Proportionnalité → <b>je … desto</b>.'},
          {q:'Révision U15 : «Der Professor sagte, die Zahl ___ gestiegen.»',
           opts:['sei','ist','war','wird'],a:0,
           why:'Konjunktiv I de sein : <b>sei</b> (discours rapporté).'},
          {q:'Révision U15 : «Die Quelle, ___ die Nachricht stammt.»',
           opts:['aus der','aus dem','von der','mit der'],a:0,
           why:'<span class="de-in"><b>stammen aus</b> + Datif</span>.'},
          {q:'Révision U12 : «Umweltprobleme lassen ___ lösen.»',opts:['sich','werden','zu','—'],a:0,
           why:'Substitut du Passiv : <span class="de-in"><b>sich lassen</b> + Infinitiv</span>.'},
          {type:'texte',q:'✍️ Rédige ton essai de clôture ici (correction automatique) :',
           ph:'Unter kulturellem Dialog versteht man…'}]},
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 16 (/20) ══════════ */
const DEVOIR_U16 = {
  titre:'Évaluation — Einheit 16 : Kultureller Dialog (clôture de l’année 3AS)',
  unite:16, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Dialog der Kulturen — Algerien und Deutschland</b></p>'
          + '<p>Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
          + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. Zwischen '
          + 'Algerien und Deutschland gibt es diesen Austausch seit Jahrzehnten — durch '
          + 'Studenten, Künstler und heute vor allem durch das Internet.</p>'
          + '<p>Auf den ersten Blick scheinen die beiden Kulturen sehr verschieden zu sein. '
          + 'Die algerische Gastfreundschaft ist genauso berühmt wie die deutsche '
          + 'Pünktlichkeit. Während man in Algier einen Gast spontan zum Essen einlädt, '
          + 'vereinbart man in Berlin einen Termin drei Wochen im Voraus. Trotzdem gibt es '
          + 'mehr Gemeinsamkeiten, als viele glauben: Beide Gesellschaften legen großen Wert '
          + 'auf Familie, Respekt vor dem Alter und gutes Essen.</p>'
          + '<p>Der Germanist Karim Benzid erklärte in einem Interview, die Zahl der '
          + 'Deutschlernenden in Algerien habe sich in zehn Jahren verdoppelt. Das dürfte '
          + 'vor allem an den beruflichen Perspektiven liegen. Selbst wenn es Vorurteile '
          + 'auf beiden Seiten gäbe, ließen sie sich durch Begegnung abbauen.</p>'
          + '<p>Zusammenfassend lässt sich sagen, dass kultureller Dialog kein Verzicht auf '
          + 'die eigene Identität ist, sondern eine Bereicherung. Je mehr junge Menschen '
          + 'einander kennenlernen, desto weniger Raum bleibt für Vorurteile.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Kultureller Dialog verlangt, die eigene Identität aufzugeben.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… ohne dass einer seine Identität aufgeben muss.</span>'},
        {id:'I.2',type:'vf',t:'Die Zahl der Deutschlernenden hat sich in zehn Jahren verdoppelt.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… habe sich in zehn Jahren verdoppelt.</span>'},
        {id:'I.3',type:'vf',t:'Beide Gesellschaften legen wenig Wert auf Familie.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Beide Gesellschaften legen großen Wert auf Familie.</span>'},
        {id:'I.4',type:'vf',t:'Der Dialog ist laut Autor eine Bereicherung.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… kein Verzicht …, sondern eine Bereicherung.</span>'},
        {id:'I.5',type:'txt',t:'Nennen Sie zwei Gemeinsamkeiten der beiden Kulturen.',pts:2,
         rep:'Familie, Respekt vor dem Alter, gutes Essen (deux suffisent).',
         key:['familie','respekt','alter','essen'],
         just:'<span class="de-in">Beide Gesellschaften legen großen Wert auf Familie, '
              + 'Respekt vor dem Alter und gutes Essen.</span>'},
        {id:'I.6',type:'txt',t:'Was drückt « dürfte » in « Das dürfte an den beruflichen Perspektiven liegen » aus?',pts:2,
         rep:'Eine wahrscheinliche Vermutung (ca. 75 %), keine Gewissheit.',
         key:['vermutung','wahrscheinlich','hypothèse','probable','dürften'],
         just:'Modalverbe subjectif : <b>dürften</b> = hypothèse probable, non vérifiée.'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Berlin ist ___ Oran.»',
         opts:['größer als','größer wie','so groß als','mehr groß als'],a:0,pts:1,
         why:'Différence → Komparativ + <b>als</b>.'},
        {id:'II.2',type:'qcm',t:'«___ es regnet, gehen wir spazieren.»',
         opts:['Obwohl','Trotz','Wegen','Trotzdem'],a:0,pts:1,
         why:'Conjonction → <b>obwohl</b> + verbe final.'},
        {id:'II.3',type:'qcm',t:'«Das ___ stimmen.» (certitude ~95 %)',
         opts:['muss','kann','mag','dürfte'],a:0,pts:1,
         why:'<b>müssen</b> subjectif = degré maximal.'},
        {id:'II.4',type:'qcm',t:'«Die Gastfreundschaft ist ___ berühmt ___ die Pünktlichkeit.»',
         opts:['genauso … wie','so … als','mehr … wie','gleich … als'],a:0,pts:1,
         why:'Égalité → <span class="de-in"><b>genauso</b> … <b>wie</b></span>.'},
        {id:'II.5',type:'txt',t:'Complète : «Trotz ___ Unterschiede verstehen wir uns.»',pts:1,rep:'der',
         key:['der'],just:'<span class="de-in"><b>trotz</b> + Génitif</span>.'},
        {id:'II.6',type:'txt',t:'Superlatif de «gut» :',pts:1,rep:'am besten',
         key:['am besten'],just:'Irrégulier : gut → besser → am besten.'},
        {id:'II.7',type:'txt',t:'Passé du modal subjectif : «Das muss ein Irrtum ___ ___ .»',pts:1,
         rep:'gewesen sein',key:['gewesen sein'],
         just:'Double infinitif en fin : <b>muss … gewesen sein</b>.'},
        {id:'II.8',type:'txt',t:'Définis : « Was versteht man unter kulturellem Dialog? »',pts:1,
         rep:'Unter kulturellem Dialog versteht man den Austausch zwischen Menschen verschiedener Herkunft.',
         key:['unter','versteht man','austausch'],
         just:'Tournure académique : <span class="de-in"><b>Unter … versteht man …</b></span>'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب مقالاً من 15 سطراً بعنوان «Brücken bauen — warum kultureller Dialog wichtig '
           + 'ist» : تعريف بـ Unter … versteht man · مقارنة (genauso … wie) · تنازل (obwohl '
           + 'أو trotz + Génitif) · احتمال بفعل ناقص ذاتي (dürfte/muss/soll) · افتراض '
           + '(Selbst wenn …) · خاتمة (Zusammenfassend + Meiner Meinung nach).',
         grille:[['Einleitung avec « Unter … versteht man … »','0.5'],
                 ['1 comparaison (genauso … wie / Komparativ + als)','0.5'],
                 ['1 concession (obwohl / trotzdem / trotz + Gén.)','0.5'],
                 ['1 hypothèse avec modal subjectif (dürfte/muss/soll/könnte)','0.5'],
                 ['1 Irrealis (Selbst wenn / auch wenn + Konjunktiv II)','0.5'],
                 ['Schluss : Zusammenfassend + Meiner Meinung nach','0.5'],
                 ['lexique du dialogue culturel (8 mots) + orthographe et majuscules','1.0']],
         texte:'<div class="reading"><p><b>Brücken bauen — warum kultureller Dialog wichtig ist</b></p>'
              + '<p>Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
              + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. '
              + 'In einer Welt, die immer stärker vernetzt ist, dürfte dieser Austausch '
              + 'wichtiger sein als je zuvor.</p>'
              + '<p>Die algerische Gastfreundschaft ist genauso berühmt wie die deutsche '
              + 'Pünktlichkeit, und beide Kulturen legen großen Wert auf Familie und Respekt. '
              + 'Obwohl es auf den ersten Blick große Unterschiede gibt, sind die '
              + 'Gemeinsamkeiten zahlreicher, als viele glauben. Trotz aller Vorurteile '
              + 'lässt sich ein echter Dialog führen, wenn beide Seiten zuhören wollen.</p>'
              + '<p>Der Germanist Karim Benzid erklärte, die Zahl der Deutschlernenden habe '
              + 'sich in zehn Jahren verdoppelt. Das muss eine große Chance für algerische '
              + 'Absolventen sein. Selbst wenn es Hindernisse gäbe, ließen sie sich durch '
              + 'Begegnung abbauen.</p>'
              + '<p>Zusammenfassend lässt sich sagen, dass kultureller Dialog kein Verzicht, '
              + 'sondern eine Bereicherung ist. Je mehr junge Menschen einander kennenlernen, '
              + 'desto weniger Raum bleibt für Vorurteile. Meiner Meinung nach öffnet jeder, '
              + 'der eine fremde Sprache lernt, nicht nur ein Buch, sondern eine Tür.</p>'
              + '</div>',
         modell:'Modellösung'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U16 = {
  unite: 16,
  titre: 'التصحيح النموذجي — الوحدة 16 : Kultureller Dialog (ختام السنة الثالثة)',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Dialog ohne Identitätsverlust — « ohne dass einer seine Identität aufgeben muss ».' },
    { id:'I.2', reponse:'Richtig', justification:'Die Zahl habe sich in zehn Jahren verdoppelt (Konjunktiv I).' },
    { id:'I.3', reponse:'Falsch', justification:'Beide Gesellschaften legen großen Wert auf Familie.' },
    { id:'I.4', reponse:'Richtig', justification:'Kein Verzicht, sondern eine Bereicherung.' },
    { id:'I.5', reponse:'Familie · Respekt vor dem Alter · gutes Essen.', justification:'… legen großen Wert auf Familie, Respekt vor dem Alter und gutes Essen.' },
    { id:'I.6', reponse:'Une hypothèse probable (~75 %), non une certitude.', justification:'Modal subjectif dürfte = Vermutung.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'größer als', regle:'différence → Komparativ + als (jamais wie)' },
    { id:'II.2', reponse:'Obwohl', regle:'conjonction concessive → verbe final' },
    { id:'II.3', reponse:'muss', regle:'modal subjectif : müssen ≈ 95 % de certitude' },
    { id:'II.4', reponse:'genauso … wie', regle:'égalité → so/genauso/ebenso + wie' },
    { id:'II.5', reponse:'der', regle:'trotz + Génitif' },
    { id:'II.6', reponse:'am besten', regle:'irrégulier : gut → besser → am besten' },
    { id:'II.7', reponse:'gewesen sein', regle:'passé du modal subjectif = double infinitif final' },
    { id:'II.8', reponse:'Unter kulturellem Dialog versteht man den Austausch zwischen Menschen verschiedener Herkunft.', regle:'tournure académique de définition' }
  ],
  partie_III: {
    bareme: [['Einleitung « Unter … versteht man »','0.5'],['1 comparaison','0.5'],
             ['1 concession','0.5'],['1 modal subjectif','0.5'],['1 Irrealis','0.5'],
             ['Schluss Zusammenfassend + opinion','0.5'],['lexique + orthographe','1.0']],
    Modellösung: 'Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
      + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. Die algerische '
      + 'Gastfreundschaft ist genauso berühmt wie die deutsche Pünktlichkeit. Obwohl es '
      + 'Unterschiede gibt, sind die Gemeinsamkeiten zahlreicher. Trotz aller Vorurteile lässt '
      + 'sich ein Dialog führen. Die Zahl der Deutschlernenden dürfte sich verdoppelt haben. '
      + 'Selbst wenn es Hindernisse gäbe, ließen sie sich abbauen. Zusammenfassend lässt sich '
      + 'sagen, dass der Dialog eine Bereicherung ist. Meiner Meinung nach öffnet jeder, der '
      + 'eine Sprache lernt, eine Tür.',
    modele: 'Unter kulturellem Dialog versteht man den Austausch zwischen Menschen '
      + 'verschiedener Herkunft, ohne dass einer seine Identität aufgeben muss. Die algerische '
      + 'Gastfreundschaft ist genauso berühmt wie die deutsche Pünktlichkeit. Obwohl es '
      + 'Unterschiede gibt, sind die Gemeinsamkeiten zahlreicher. Trotz aller Vorurteile lässt '
      + 'sich ein Dialog führen. Die Zahl der Deutschlernenden dürfte sich verdoppelt haben. '
      + 'Selbst wenn es Hindernisse gäbe, ließen sie sich abbauen. Zusammenfassend lässt sich '
      + 'sagen, dass der Dialog eine Bereicherung ist. Meiner Meinung nach öffnet jeder, der '
      + 'eine Sprache lernt, eine Tür.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 16 🔁' }
  },
  erreurs_frequentes: [
    '~~größer wie~~ → la différence exige <b>als</b> : <span class="de-in">größer '
    + '<b>als</b></span>. Erreur n°1 du BAC.',
    '~~so gut als~~ → l’égalité exige <b>wie</b> : <span class="de-in"><b>so</b> gut '
    + '<b>wie</b></span>.',
    '~~Obwohl es regnet, wir gehen spazieren~~ → la principale commence par le <b>verbe</b> : '
    + '<span class="de-in">Obwohl es regnet, <b>gehen wir</b> spazieren.</span>',
    '~~Trotz der Unterschied~~ → <span class="de-in">trotz</span> + Génitif : '
    + '<b>trotz der Unterschiede</b>.',
    '~~Das muss gewesen ein Irrtum~~ → double infinitif <b>en fin</b> : '
    + '<span class="de-in">Das <b>muss</b> ein Irrtum <b>gewesen sein</b>.</span>',
    '~~Er ist größer wie sein Bruder~~ → <span class="de-in">größer <b>als</b></span>.',
    '~~die Kultur ist …~~ sans définir → au BAC, on attend '
    + '<span class="de-in"><b>Unter</b> Kultur <b>versteht man</b> …</span>',
    '~~das Vaterland~~ pour parler d’attachement personnel → <b>die Heimat</b> (affectif) '
    + 'vs <b>das Vaterland</b> (politique).',
    '~~die Werte~~ au singulier → dans ce sens, le mot n’existe qu’au <b>pluriel</b>.',
    '~~immer mehr groß~~ → la progression se dit <b>immer + Komparativ</b> : '
    + '<span class="de-in">immer <b>größer</b></span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE16 = { meta: UNITE16_META, seances: SEANCES_U16, devoir: DEVOIR_U16,
                   corrige: CORRIGE_U16 };
