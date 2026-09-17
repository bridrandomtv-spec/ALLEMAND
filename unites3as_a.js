/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unites3as_a.js
   السنة الثالثة ثانوي (3AS) — برنامج البكالوريا · الوحدات 7 → 9
   U7  Persönlichkeit und Identität   · الشخصية والهوية
   U8  Staatsbürgerschaft             · المواطنة
   U9  Leben in der Gesellschaft      · الحياة في المجتمع
   6 حصص لكل وحدة + فرض /20 (I/8 · II/8 · III/4) + تصحيح + أخطاء شائعة
   Programme officiel MEN · CEFR B1 → B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITES_3AS_A = [

/* ══════════════════ UNITÉ 7 — Persönlichkeit und Identität ══════════════════ */
{
  n: 7, de: 'Persönlichkeit und Identität', ar: 'الشخصية والهوية',
  niveau: '3AS', trimestre: 1, periode: 'سبتمبر — نوفمبر', duree_totale: 360, cecrl: 'B1',
  icon: '🪞',
  objectifs: ['وصف الشخصية والصفات','استعمال تصريف الصفة بعد الأدوات','بناء الجمل الموصولة',
              'فهم نص حول الهوية','إنتاج نص وصفي-تحليلي من 10 إلى 12 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Persönlichkeit','die Identität','der Charakter','die Eigenschaft',
                    'selbstbewusst','zuverlässig'],
  grammaire_cle: ['Adjektivdeklination','Relativsätze','Charaktereigenschaften',
                  'Komparativ und Superlativ'],
  seances: [
    { n:1, de:'Charaktereigenschaften', ar:'صفات الشخصية', dur:60,
      obj:['تسمية الصفات الإيجابية والسلبية','التمييز بين الصفة والاسم','وصف شخص'],
      lex:[['freundlich','لطيف'],['zuverlässig','موثوق'],['selbstbewusst','واثق من نفسه'],
           ['fleißig','مجتهد'],['ehrlich','صادق'],['humorvoll','فكاهي'],
           ['geduldig','صبور'],['mutig','شجاع'],['höflich','مهذّب'],['offen','منفتح'],
           ['faul','كسول'],['egoistisch','أناني'],['stur','عنيد'],['ungeduldig','نفاد الصبر'],
           ['schüchtern','خجول'],['eifersüchtig','غيور'],['nachdenklich','متأمّل'],
           ['gesellig','اجتماعي']],
      gram:{t:'Adjectif attribut vs adjectif épithète',
        b:['<b>Attribut</b> (après sein/werden/bleiben) : <b>invariable</b> — '
         + '<span class="de-in">Er ist freund<b>lich</b>.</span>',
           '<b>Épithète</b> (avant le nom) : il se <b>décline</b> — '
         + '<span class="de-in">ein freund<b>licher</b> Mann</span>',
           'Intensité : <span class="de-in">sehr · ziemlich · ziemlich · ein bisschen · überhaupt nicht</span>',
           'Comparatif : <span class="de-in">freundlich<b>er</b> als</span> · '
         + 'Superlatif : <span class="de-in">am freundlich<b>sten</b></span>'],
        tbl:[['positiv','freundlich, zuverlässig, fleißig, ehrlich, mutig'],
             ['negativ','faul, egoistisch, stur, ungeduldig, eifersüchtig'],
             ['neutral','offen, ruhig, nachdenklich, gesellig, schüchtern']],
        ex:'<span class="de-in">Mein bester Freund ist <b>zuverlässiger als</b> ich, '
         + 'aber ich bin <b>geduldiger</b>.</span>'},
      exos:[{q:'«Er ist sehr ___ .» (لطيف)',opts:['freundlich','freundliche','freundlicher','freundliches'],a:0,
             why:'Adjectif <b>attribut</b> après sein → <b>invariable</b>.'},
            {q:'«ein ___ Mann» (لطيف)',opts:['freundlich','freundliche','freundlicher','freundliches'],a:2,
             why:'Épithète après <b>ein</b> (masc. Nominativ) → <b>-er</b>.'},
            {q:'Comparatif de «gut» :',opts:['guter','besser','mehr gut','am gut'],a:1,
             why:'Irrégulier : gut → <b>besser</b> → am besten.'},
            {q:'«Sie ist ___ als ihr Bruder.» (plus sérieuse)',opts:['ernst','ernster','am ernstesten','ernsteste'],a:1,
             why:'Comparatif = adjectif + <b>-er</b> + <b>als</b>.'},
            {q:'Quel mot est NÉGATIF ?',opts:['zuverlässig','geduldig','egoistisch','höflich'],a:2,
             why:'<span class="de-in">egoistisch</span> = أناني.'}]},

    { n:2, de:'Adjektivdeklination', ar:'تصريف الصفة', dur:60,
      obj:['تصريف الصفة بعد أداة التعريف','تصريف الصفة بعد أداة التنكير','الصفة بدون أداة','الجمع'],
      lex:[['der nette Lehrer','الأستاذ اللطيف'],['die kluge Schülerin','التلميذة الذكية'],
           ['das kleine Kind','الطفل الصغير'],['ein guter Freund','صديق جيد'],
           ['eine starke Persönlichkeit','شخصية قوية'],['mit freundlichen Grüßen','مع أطيب التحيات'],
           ['die fleißigen Schüler','التلاميذ المجتهدون']],
      gram:{t:'Les 3 déclinaisons de l’adjectif épithète',
        b:['<b>Après der/die/das</b> (déclinaison faible) : <b>-e</b> au Nominativ singulier, '
         + '<b>-en</b> partout ailleurs.',
           '<b>Après ein/kein/possessif</b> (déclinaison mixte) : le masculin et le neutre '
         + 'prennent <b>-er / -es</b> au Nominativ.',
           '<b>Sans article</b> (déclinaison forte) : l’adjectif porte toutes les marques '
         + '(gut<b>er</b> Wein, kalt<b>es</b> Wasser).',
           'Au <b>pluriel</b> après un possessif : toujours <b>-en</b> '
         + '(<span class="de-in">meine nett<b>en</b> Kollegen</span>).'],
        tbl:[['','maskulin','feminin','neutrum','Plural'],
             ['NOM. (der)','der gute Mann','die gute Frau','das gute Kind','die guten Kinder'],
             ['AKK. (den)','den guten Mann','die gute Frau','das gute Kind','die guten Kinder'],
             ['DAT. (dem)','dem guten Mann','der guten Frau','dem guten Kind','den guten Kindern'],
             ['NOM. (ein)','ein guter Mann','eine gute Frau','ein gutes Kind','gute Kinder']],
        ex:'<span class="de-in">Ich helfe <b>dem</b> nett<b>en</b> Lehrer</span> (Datif) · '
         + '<span class="de-in">Ich sehe <b>den</b> nett<b>en</b> Lehrer</span> (Akkusativ).'},
      exos:[{q:'«Das ist ___ gute Idee.»',opts:['ein','eine','einen','einem'],a:1,
             why:'<span class="de-in">die Idee</span> féminin → <b>eine</b>.'},
            {q:'«Ich kenne ___ netten Lehrer.»',opts:['der','den','dem','des'],a:1,
             why:'COD masculin → Akkusativ : <b>den</b> netten Lehrer.'},
            {q:'«mit ___ fleißigen Schülern»',opts:['der','den','dem','die'],a:1,
             why:'<span class="de-in">mit</span> + Datif pluriel → <b>den</b> (+ -n au nom).'},
            {q:'«___ kaltes Wasser» (sans article)',opts:['Ein','Eine','—','Den'],a:2,
             why:'Sans article, l’adjectif porte la marque forte : <b>kalt<b>es</b> Wasser</b> '
             + '(pas d’article du tout).'},
            {q:'«ein ___ Kind» (صغير)',opts:['klein','kleine','kleines','kleiner'],a:2,
             why:'Neutre après ein → <b>-es</b> : ein klein<b>es</b> Kind.'}]},

    { n:3, de:'Relativsätze', ar:'الجمل الموصولة', dur:60,
      obj:['بناء جملة موصولة','اختيار الضمير الموصولي الصحيح','الجملة الموصولة مع حرف جر'],
      lex:[['der Mann, der…','الرجل الذي…'],['die Frau, die…','المرأة التي…'],
           ['das Buch, das…','الكتاب الذي…'],['die Schüler, die…','التلاميذ الذين…'],
           ['der Freund, mit dem ich…','الصديق الذي معه…'],
           ['die Stadt, in der ich…','المدينة التي فيها…'],
           ['der Lehrer, dessen Auto…','الأستاذ الذي سيارته…']],
      gram:{t:'Le pronom relatif : genre = antécédent, cas = fonction dans la relative',
        b:['Le pronom prend le <b>genre</b> et le <b>nombre</b> de l’antécédent.',
           'Son <b>cas</b> dépend de sa fonction <b>dans la relative</b>, pas dans la principale.',
           'Le verbe de la relative va <b>à la fin</b>.',
           'Avec une préposition, celle-ci se place <b>devant</b> le relatif : '
         + '<span class="de-in">das Haus, <b>in dem</b> ich wohne</span>.',
           'Génitif relatif : <b>dessen</b> (m/n) · <b>deren</b> (f/pl) — invariable.'],
        tbl:[['','maskulin','feminin','neutrum','Plural'],
             ['Nominativ','der','die','das','die'],
             ['Akkusativ','den','die','das','die'],
             ['Dativ','dem','der','dem','denen'],
             ['Genitiv','dessen','deren','dessen','deren']],
        ex:'<span class="de-in">Das ist der Mann, <b>dessen</b> Auto kaputt ist.</span> · '
         + '<span class="de-in">Die Frau, <b>mit der</b> ich spreche, ist meine Tante.</span>'},
      exos:[{q:'«Der Mann, ___ dort steht, ist mein Lehrer.»',opts:['der','den','dem','des'],a:0,
             why:'Sujet de la relative → <b>Nominativ</b> : der.'},
            {q:'«Die Frau, ___ ich kenne, kommt aus Oran.»',opts:['der','die','den','dem'],a:2,
             why:'COD dans la relative → <b>Akkusativ</b> : den.'},
            {q:'«Das Haus, in ___ ich wohne, ist alt.»',opts:['das','dem','den','der'],a:1,
             why:'<span class="de-in">in</span> + position → Datif neutre : <b>dem</b>.'},
            {q:'«Der Schüler, ___ Vater Arzt ist, lernt gut.»',opts:['dessen','deren','dem','der'],a:0,
             why:'Génitif masculin → <b>dessen</b>.'},
            {q:'«Die Freunde, mit ___ ich spiele, sind nett.»',opts:['denen','deren','die','der'],a:0,
             why:'Datif pluriel du relatif → <b>denen</b>.'}]},

    { n:4, de:'Textverständnis : «Wer bin ich?»', ar:'فهم نص — من أنا؟', dur:60,
      obj:['قراءة نص تحليلي حول الهوية','استخراج الحجج','repérage des relatives et des adjectifs','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Wer bin ich?</b></p>'
        + '<p>Die Frage nach der eigenen Identität beschäftigt viele Jugendliche. '
        + 'In Algerien kommt dazu eine besondere Situation: Wir wachsen mit mehreren '
        + 'Sprachen und Kulturen auf — Arabisch, Tamazight, Französisch und immer öfter '
        + 'auch Deutsch oder Englisch.</p>'
        + '<p>Manche sagen, dass diese Vielfalt eine Chance ist. Ein junger Algerier, '
        + 'der drei Sprachen spricht, ist offener und flexibler als jemand, der nur eine '
        + 'Sprache kennt. Andere glauben, dass man sich zwischen den Kulturen verlieren kann.</p>'
        + '<p>Meiner Meinung nach ist die Identität nichts Festes. Sie verändert sich '
        + 'mit den Erfahrungen, die wir machen. Wichtig ist, dass man seine Wurzeln kennt '
        + 'und trotzdem neugierig auf die Welt bleibt. Der Mensch, der nur eine Kultur '
        + 'akzeptiert, verpasst die Hälfte des Lebens.</p></div>',
      exos:[{q:'Richtig oder Falsch : En Algérie on grandit avec une seule langue.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in">Wir wachsen mit <b>mehreren</b> Sprachen und Kulturen auf.</span>'},
            {q:'Richtig oder Falsch : Selon le texte, parler 3 langues rend plus ouvert.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
             why:'<span class="de-in">… ist <b>offener und flexibler</b> als jemand, '
             + 'der nur eine Sprache kennt.</span>'},
            {q:'Richtig oder Falsch : L’auteur pense que l’identité est fixe.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in">die Identität ist <b>nichts Festes</b>. '
             + 'Sie verändert sich…</span>'},
            {q:'Quelles langues sont citées ?',
             opts:['Arabe, tamazight, français, allemand/anglais',
                   'Arabe et français seulement','Allemand et anglais seulement',
                   'Arabe, espagnol, italien'],a:0,
             why:'<span class="de-in">Arabisch, Tamazight, Französisch und immer öfter '
             + 'auch Deutsch oder Englisch.</span>'},
            {q:'Relevez une phrase relative du 3ᵉ paragraphe.',
             opts:['«Sie verändert sich mit den Erfahrungen.»',
                   '«Der Mensch, der nur eine Kultur akzeptiert, verpasst die Hälfte des Lebens.»',
                   '«Wichtig ist, dass man seine Wurzeln kennt.»',
                   '«Meiner Meinung nach ist die Identität nichts Festes.»'],a:1,
             why:'<span class="de-in">…, <b>der</b> nur eine Kultur akzeptiert, …</span> '
             + '= relative au nominatif.'},
            {q:'Quel est l’avis de l’auteur ?',
             opts:['Il faut choisir une seule culture','Connaître ses racines ET rester curieux',
                   'Les langues divisent les jeunes','L’identité ne change jamais'],a:1,
             why:'<span class="de-in">Wichtig ist, dass man seine Wurzeln kennt und trotzdem '
             + 'neugierig auf die Welt bleibt.</span>'}]},

    { n:5, de:'Textproduktion — «Meine Persönlichkeit»', ar:'إنتاج كتابي ✍️ شخصيتي', dur:60,
      obj:['كتابة نص وصفي-تحليلي 10-12 سطراً','تصريف الصفات','2 جمل موصولية','comparatif'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً من '
        + '<b>10 إلى 12 سطراً</b> تصف فيه شخصيتك وهويتك، مع احترام الشروط :'
        + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
        + '<li><b>5 صفات</b> مصرّفة بشكل صحيح (épithète + attribut)</li>'
        + '<li><b>2 جمل موصولية</b> (der/die/das · dem/deren…)</li>'
        + '<li><b>1 مقارنة</b> (… als) و <b>1 تفضيل</b> (am …sten)</li>'
        + '<li><b>1 رأي</b> مقدّم بـ <span class="de-in">Meiner Meinung nach…</span></li>'
        + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
        + '<p>Wer bin ich? Das ist keine einfache Frage. Ich heiße Yasmine, ich bin 17 Jahre '
        + 'alt und ich komme aus Bouira. Meine Freunde sagen, dass ich ein offener und '
        + 'zuverlässiger Mensch bin.</p>'
        + '<p>Ich bin ein Mädchen, <b>das</b> gern liest und viel über die Welt nachdenkt. '
        + 'Meine stärkste Eigenschaft ist die Geduld: Ich kann stundenlang an einer '
        + 'schwierigen Aufgabe arbeiten. Manchmal bin ich aber auch ein bisschen '
        + 'schüchterner als meine Schwester, <b>die</b> sehr gesellig ist.</p>'
        + '<p>In meiner Familie bin ich die fleißigste Person. Meiner Meinung nach ist '
        + 'Charakter wichtiger als Aussehen, denn ein ehrlicher Freund bleibt ein Leben '
        + 'lang. Was mich besonders macht, ist meine Neugier: Ich lerne Deutsch, weil ich '
        + 'später in Deutschland studieren möchte. Ich glaube, dass meine Identität sich '
        + 'noch verändert — und das ist gut so.</p></div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك هنا (سيصححه الأستاذ الافتراضي):',
             ph:'Wer bin ich? Das ist keine einfache Frage…'}]},

    { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — فرض الوحدة 7', dur:60,
      obj:['مراجعة شاملة للوحدة 7','تصحيح جماعي','التحضير للوحدة 8'], ex:'devoir'}
  ],
  devoir: {
    titre:'Évaluation — Einheit 7 : Persönlichkeit und Identität',
    unite:7, duree:45, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
        texte:'<div class="reading"><p><b>Wer bin ich?</b></p>'
          + '<p>Die Frage nach der eigenen Identität beschäftigt viele Jugendliche. In '
          + 'Algerien kommt dazu eine besondere Situation: Wir wachsen mit mehreren Sprachen '
          + 'und Kulturen auf — Arabisch, Tamazight, Französisch und immer öfter auch Deutsch '
          + 'oder Englisch.</p>'
          + '<p>Manche sagen, dass diese Vielfalt eine Chance ist. Ein junger Algerier, der '
          + 'drei Sprachen spricht, ist offener und flexibler als jemand, der nur eine Sprache '
          + 'kennt. Andere glauben, dass man sich zwischen den Kulturen verlieren kann.</p>'
          + '<p>Meiner Meinung nach ist die Identität nichts Festes. Sie verändert sich mit '
          + 'den Erfahrungen, die wir machen. Wichtig ist, dass man seine Wurzeln kennt und '
          + 'trotzdem neugierig auf die Welt bleibt.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'In Algerien wächst man mit mehreren Sprachen auf.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Wir wachsen mit mehreren Sprachen und Kulturen auf.</span>'},
          {id:'I.2',type:'vf',t:'Wer drei Sprachen spricht, ist laut Text weniger flexibel.',pts:1,rep:'Falsch',
           just:'Er ist <b>offener und flexibler</b> als jemand, der nur eine Sprache kennt.'},
          {id:'I.3',type:'vf',t:'Die Identität ist laut Autor etwas Festes.',pts:1,rep:'Falsch',
           just:'<span class="de-in">die Identität ist <b>nichts Festes</b></span>.'},
          {id:'I.4',type:'vf',t:'Man soll seine Wurzeln kennen und neugierig bleiben.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Wichtig ist, dass man seine Wurzeln kennt und trotzdem '
                + 'neugierig auf die Welt bleibt.</span>'},
          {id:'I.5',type:'txt',t:'Welche vier Sprachen nennt der Text?',pts:2,
           rep:'Arabisch, Tamazight, Französisch und Deutsch oder Englisch.',
           key:['arabisch','tamazight','französisch','franzosisch'],
           just:'<span class="de-in">Arabisch, Tamazight, Französisch und immer öfter auch '
                + 'Deutsch oder Englisch.</span>'},
          {id:'I.6',type:'txt',t:'Warum verändert sich die Identität?',pts:2,
           rep:'Sie verändert sich mit den Erfahrungen, die wir machen.',
           key:['erfahrungen'],
           just:'<span class="de-in">Sie verändert sich mit den <b>Erfahrungen</b>, '
                + 'die wir machen.</span>'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Das ist ___ gute Idee.»',opts:['ein','eine','einen','einem'],a:1,pts:1,
           why:'<span class="de-in">die Idee</span> féminin → <b>eine</b>.'},
          {id:'II.2',type:'qcm',t:'«Der Mann, ___ dort steht, ist mein Lehrer.»',
           opts:['der','den','dem','dessen'],a:0,pts:1,
           why:'Sujet de la relative → <b>Nominativ</b>.'},
          {id:'II.3',type:'qcm',t:'«Ich helfe ___ netten Lehrer.» (datif)',
           opts:['der','den','dem','des'],a:2,pts:1,
           why:'<span class="de-in">helfen</span> + Datif masculin → <b>dem</b>.'},
          {id:'II.4',type:'qcm',t:'«Er ist ___ als sein Bruder.» (plus sérieux)',
           opts:['ernst','ernster','am ernstesten','ernsteste'],a:1,pts:1,
           why:'Comparatif = adjectif + <b>-er</b> + <b>als</b>.'},
          {id:'II.5',type:'txt',t:'Déclinaison : «ein ___ (klein) Kind»',pts:1,rep:'kleines',
           key:['kleines'],just:'Neutre après ein → <b>-es</b>.'},
          {id:'II.6',type:'txt',t:'Relatif au génitif masculin :',pts:1,rep:'dessen',
           key:['dessen'],just:'dessen (m/n) · deren (f/pl) — invariable.'},
          {id:'II.7',type:'txt',t:'Traduis : «هذا رجل صادق»',pts:1,
           rep:'Das ist ein ehrlicher Mann.',key:['ehrlicher','mann'],
           just:'Masculin Nominativ après ein → adjectif + <b>-er</b>.'},
          {id:'II.8',type:'txt',t:'Superlatif de «gut» : «am ___»',pts:1,rep:'besten',
           key:['besten'],just:'Irrégulier : gut → besser → am <b>besten</b>.'}
        ]},
      { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً من 10 أسطر تصف فيه شخصيتك : 5 صفات مصرّفة، جملتان موصوليتان، '
             + 'مقارنة واحدة بـ als، ورأي بـ «Meiner Meinung nach».',
           grille:[['5 صفات مصرّفة بشكل صحيح (épithète/attribut)','1.0'],
                   ['2 جمل موصولية (pronom relatif correct)','1.0'],
                   ['1 مقارنة + 1 تفضيل (als / am …sten)','0.5'],
                   ['1 رأي مقدّم بـ Meiner Meinung nach','0.5'],
                   ['مفردات الوحدة 7 (8 كلمات على الأقل)','0.5'],
                   ['بنية النص (مقدمة / عرض / خاتمة)','0.25'],
                   ['الإملاء، المajuscules، علامات الترقيم','0.25']],
           modele:'<div class="reading"><p>Wer bin ich? Das ist keine einfache Frage. '
             + 'Meine Freunde sagen, dass ich ein offener und zuverlässiger Mensch bin. '
             + 'Ich bin ein Mädchen, das gern liest und viel über die Welt nachdenkt.</p>'
             + '<p>Meine stärkste Eigenschaft ist die Geduld. Manchmal bin ich aber auch '
             + 'ein bisschen schüchterner als meine Schwester, die sehr gesellig ist. '
             + 'In meiner Familie bin ich die fleißigste Person.</p>'
             + '<p>Meiner Meinung nach ist Charakter wichtiger als Aussehen, denn ein '
             + 'ehrlicher Freund bleibt ein Leben lang. Ich glaube, dass meine Identität '
             + 'sich noch verändert — und das ist gut so.</p></div>'}
        ]}
    ]
  },
  corrige: {
    unite: 7,
    titre: 'التصحيح النموذجي — الوحدة 7 : Persönlichkeit und Identität',
    bareme: { I: 8, II: 8, III: 4, total: 20 },
    partie_I: [
      { id:'I.1', reponse:'Richtig', justification:'Wir wachsen mit mehreren Sprachen auf.' },
      { id:'I.2', reponse:'Falsch', justification:'Er ist offener und flexibler.' },
      { id:'I.3', reponse:'Falsch', justification:'Die Identität ist nichts Festes.' },
      { id:'I.4', reponse:'Richtig', justification:'Wurzeln kennen + neugierig bleiben.' },
      { id:'I.5', reponse:'Arabisch, Tamazight, Französisch, Deutsch/Englisch', justification:'Liste du 1ᵉʳ paragraphe.' },
      { id:'I.6', reponse:'Sie verändert sich mit den Erfahrungen.', justification:'3ᵉ paragraphe.' }
    ],
    partie_II: [
      { id:'II.1', reponse:'eine', regle:'die Idee (f) → eine' },
      { id:'II.2', reponse:'der', regle:'relatif sujet → Nominativ' },
      { id:'II.3', reponse:'dem', regle:'helfen + Datif' },
      { id:'II.4', reponse:'ernster', regle:'comparatif -er + als' },
      { id:'II.5', reponse:'kleines', regle:'neutre après ein → -es' },
      { id:'II.6', reponse:'dessen', regle:'génitif m/n = dessen' },
      { id:'II.7', reponse:'Das ist ein ehrlicher Mann.', regle:'masc. Nom. après ein → -er' },
      { id:'II.8', reponse:'besten', regle:'gut → besser → am besten' }
    ],
    partie_III: {
      bareme: [['5 صفات مصرّفة','1.0'],['2 جمل موصولية','1.0'],['comparatif + superlatif','0.5'],
               ['Meiner Meinung nach','0.5'],['vocabulaire U7','0.5'],['structure','0.25'],
               ['orthographe','0.25']],
      modele: 'Wer bin ich? Meine Freunde sagen, dass ich ein offener und zuverlässiger Mensch '
            + 'bin. Ich bin ein Mädchen, das gern liest. Meine stärkste Eigenschaft ist die '
            + 'Geduld. Manchmal bin ich schüchterner als meine Schwester, die sehr gesellig '
            + 'ist. Meiner Meinung nach ist Charakter wichtiger als Aussehen.',
      seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
                '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 7 🔁' }
    },
    erreurs_frequentes: [
      '~~Er ist freundlicher~~ (attribut) → après <b>sein</b>, l’adjectif est '
      + '<b>invariable</b> : Er ist freundlich.',
      '~~ein guter Idee~~ → <span class="de-in">die Idee</span> est féminin : '
      + 'ein<b>e</b> gut<b>e</b> Idee.',
      '~~mit meine Freunde~~ → Datif pluriel : mit mein<b>en</b> Freund<b>en</b>.',
      '~~Der Mann, den dort steht~~ → dans la relative, « der » est <b>sujet</b> → '
      + 'Nominativ : der Mann, <b>der</b> dort steht.',
      '~~dem sein Auto~~ → génitif correct : <b>dessen</b> Auto.',
      '~~größer wie~~ → la comparaison se fait avec <b>als</b> : größer <b>als</b>.',
      '~~am gutesten~~ → irrégulier : gut → besser → am <b>besten</b>.',
      '~~Ich bin 17 Jahre alt habe~~ → l’âge se dit avec <b>sein</b> : Ich <b>bin</b> 17 '
      + 'Jahre alt.'
    ]
  }
},

/* ══════════════════ UNITÉ 8 — Staatsbürgerschaft ══════════════════ */
{
  n: 8, de: 'Staatsbürgerschaft', ar: 'المواطنة',
  niveau: '3AS', trimestre: 1, periode: 'نوفمبر — ديسمبر', duree_totale: 360, cecrl: 'B1',
  icon: '🏛️',
  objectifs: ['تسمية الحقوق والواجبات','بناء المبني للمجهول','المبني للمجهول مع الأفعال الناقصة',
              'فهم نص مدني','إنتاج نص حجاجي'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['der Staat','der Bürger','die Pflicht','das Recht','wählen','die Stimme'],
  grammaire_cle: ['Passiv (Präsens/Präteritum)','Passiv mit Modalverben',
                  'Nebensätze mit dass/weil/damit','Zustandspassiv'],
  seances: [
    { n:1, de:'Rechte und Pflichten', ar:'الحقوق والواجبات', dur:60,
      obj:['تسمية الحقوق والواجبات','المفردات المدنية','التعبير عن الإلزام'],
      lex:[['der Staat','الدولة'],['der Bürger / die Bürgerin','المواطن / المواطنة'],
           ['die Staatsbürgerschaft','الجنسية'],['das Recht','الحق'],['die Pflicht','الواجب'],
           ['die Verfassung','الدستور'],['wählen','ينتخب'],['die Wahl','الانتخاب'],
           ['die Stimme','الصوت'],['das Gesetz','القانون'],['die Freiheit','الحرية'],
           ['die Gleichberechtigung','المساواة في الحقوق'],['die Verantwortung','المسؤولية'],
           ['die Meinungsfreiheit','حرية الرأي'],['das Ehrenamt','العمل التطوعي'],
           ['Steuern zahlen','يدفع الضرائب'],['die Umwelt schützen','يحمي البيئة']],
      gram:{t:'Exprimer l’obligation et l’autorisation',
        b:['<b>müssen</b> = obligation (قانونية/داخلية) : '
         + '<span class="de-in">Jeder Bürger <b>muss</b> Steuern zahlen.</span>',
           '<b>sollen</b> = consigne reçue d’un tiers : '
         + '<span class="de-in">Du <b>sollst</b> dich an die Gesetze halten.</span>',
           '<b>dürfen</b> = autorisation ; <b>dürfen nicht</b> = interdiction',
           '<b>nicht brauchen zu</b> = ce n’est pas nécessaire : '
         + '<span class="de-in">Du <b>brauchst nicht zu</b> arbeiten.</span>',
           'Nom abstrait + verbe faible (Funktionsverbgefüge) : '
         + '<span class="de-in">Kritik <b>üben an</b> = kritisieren</span>'],
        tbl:[['Rechte (حقوق)','Pflichten (واجبات)'],
             ['Meinungsfreiheit','Steuern zahlen'],
             ['Recht auf Bildung','Gesetze beachten'],
             ['Wahlrecht ab 18','die Umwelt schützen'],
             ['Recht auf Arbeit','an Wahlen teilnehmen']],
        ex:'<span class="de-in">Als Bürger <b>habe ich</b> Rechte, aber auch Pflichten.</span>'},
      exos:[{q:'«Jeder Bürger ___ Steuern zahlen.» (obligation)',opts:['muss','darf','kann','sollte nicht'],a:0,
             why:'Obligation légale → <b>müssen</b>.'},
            {q:'«Hier ___ man nicht fotografieren.» (interdiction)',opts:['muss','darf','kann','soll'],a:1,
             why:'Interdiction → <span class="de-in"><b>darf</b> nicht</span>.'},
            {q:'«das Recht ___ Bildung»',opts:['für','auf','an','mit'],a:1,
             why:'<span class="de-in">das Recht <b>auf</b> + Akkusativ</span>.'},
            {q:'«die Gleichberechtigung» تعني :',opts:['المساواة في الحقوق','الحرية','المسؤولية','الواجب'],a:0,
             why:'<span class="de-in">gleich</span> (متساوٍ) + <span class="de-in">Berechtigung</span> (الحق).'},
            {q:'«Du ___ nicht zu kommen.» (ce n’est pas nécessaire)',
             opts:['musst','brauchst','darfst','sollst'],a:1,
             why:'<span class="de-in"><b>nicht brauchen zu</b></span> = ne pas être obligé.'}]},

    { n:2, de:'Das Passiv', ar:'المبني للمجهول', dur:60,
      obj:['بناء المبني للمجهول في الحاضر والماضي','التفريق بين Vorgangs- و Zustandspassiv','complément d’agent'],
      lex:[['Das Gesetz wird verabschiedet.','يُصوَّت على القانون.'],
           ['Die Steuern wurden erhöht.','رُفعت الضرائب.'],
           ['Die Wahl ist organisiert.','الانتخابات منظَّمة (حالة).'],
           ['von der Regierung','من طرف الحكومة'],
           ['durch ein Gesetz','بموجب قانون'],
           ['man sagt, dass…','يُقال إن…']],
      gram:{t:'Vorgangspassiv (werden) vs Zustandspassiv (sein)',
        b:['<b>Vorgangspassiv</b> : <span class="de-in">werden</span> + Partizip II = '
         + 'l’action en cours.<br><span class="de-in">Das Gesetz <b>wird</b> verabschiedet.</span>',
           '<b>Zustandspassiv</b> : <span class="de-in">sein</span> + Partizip II = '
         + 'l’état résultant.<br><span class="de-in">Das Gesetz <b>ist</b> verabschiedet.</span>',
           'Präteritum : <b>wurde</b> + Partizip II · Perfekt : <b>ist</b> + Partizip II + <b>worden</b>',
           'Complément d’agent : <b>von</b> + Datif (personne) · <b>durch</b> + Akkusativ (moyen/cause)',
           'Sujet impersonnel : <span class="de-in">Hier <b>wird</b> Deutsch gesprochen.</span>'],
        tbl:[['Präsens','Das Gesetz wird verabschiedet.'],
             ['Präteritum','Das Gesetz wurde verabschiedet.'],
             ['Perfekt','Das Gesetz ist verabschiedet worden.'],
             ['Zustand','Das Gesetz ist verabschiedet.'],
             ['Agent','Es wurde <b>von</b> der Regierung beschlossen.']],
        ex:'<span class="de-in">In Algerien <b>wird</b> am 1. November <b>gewählt</b>.</span>'},
      exos:[{q:'«Die Steuern ___ letztes Jahr erhöht.»',opts:['werden','wurden','sind','werden sein'],a:1,
             why:'Präteritum Passiv → <b>wurden</b>.'},
            {q:'«Das Gesetz ___ verabschiedet worden.» (Perfekt)',opts:['wird','wurde','ist','hat'],a:2,
             why:'Perfekt Passiv = <b>ist</b> + Partizip II + <b>worden</b>.'},
            {q:'«Die Tür ___ geöffnet.» (état, pas action)',opts:['wird','ist','war worden','wurde'],a:1,
             why:'Zustandspassiv → <b>sein</b> + Partizip II.'},
            {q:'Complément d’agent (personne) :',opts:['durch + Akk','von + Dat','mit + Dat','für + Akk'],a:1,
             why:'<b>von</b> + Datif pour une personne · <b>durch</b> + Akkusativ pour un moyen.'},
            {q:'«Hier ___ Deutsch gesprochen.»',opts:['man','wird','ist','hat'],a:1,
             why:'Passif impersonnel : <b>wird</b> + Partizip II.'}]},

    { n:3, de:'Passiv mit Modalverben + Nebensätze', ar:'المبني للمجهول مع الأفعال الناقصة والجمل التابعة', dur:60,
      obj:['المبني للمجهول مع فعل ناقص','الجمل التابعة بـ dass/weil/damit','ترتيب الجملة'],
      lex:[['Das muss gemacht werden.','يجب أن يُنجز هذا.'],
           ['Die Gesetze sollen beachtet werden.','يجب احترام القوانين.'],
           ['Hier darf nicht geraucht werden.','يُمنع التدخين هنا.'],
           ['Damit alle wählen können,…','لكي يستطيع الجميع الانتخاب…'],
           ['Weil die Umwelt wichtig ist,…','لأن البيئة مهمة…']],
      gram:{t:'Passif + modal et subordonnées',
        b:['Formule : <b>Sujet + modal conjugué + … + Partizip II + werden</b>',
           '<span class="de-in">Das <b>muss</b> sofort <b>gemacht werden</b>.</span>',
           '<span class="de-in">Die Umwelt <b>soll</b> besser <b>geschützt werden</b>.</span>',
           'Subordonnées (<b>dass · weil · damit · obwohl · wenn</b>) : verbe conjugué '
         + '<b>à la fin</b>.',
           'Si la subordonnée ouvre la phrase, la principale commence directement par son verbe.'],
        tbl:[['müssen','Das muss gemacht werden.','obligation'],
             ['sollen','Die Gesetze sollen beachtet werden.','consigne'],
             ['dürfen','Hier darf nicht geraucht werden.','interdiction'],
             ['können','Das Problem kann gelöst werden.','possibilité']],
        ex:'<span class="de-in">Weil die Umwelt bedroht ist, <b>müssen</b> neue Gesetze '
         + '<b>erlassen werden</b>.</span>'},
      exos:[{q:'«Die Hausaufgaben ___ heute gemacht ___ .»',opts:['müssen … werden','muss … werden',
                                                                   'müssen … wird','muß … werden'],a:0,
             why:'Pluriel → <b>müssen</b> · infinitif passif = <b>werden</b> en fin.'},
            {q:'«Hier ___ nicht laut gesprochen werden.»',opts:['darf','muss','kann','soll'],a:0,
             why:'Interdiction → <b>darf nicht</b>.'},
            {q:'«Ich lerne Deutsch, ___ ich in Berlin studieren will.»',opts:['weil','denn','damit','obwohl'],a:0,
             why:'Cause + verbe à la fin → <b>weil</b> (<b>denn</b> garde le verbe en 2).'},
            {q:'«Wir schützen die Umwelt, ___ die Kinder gesund leben können.»',
             opts:['weil','damit','obwohl','wenn'],a:1,
             why:'But → <b>damit</b> (+ verbe à la fin).'},
            {q:'«___ es regnet, gehen wir wählen.» (malgré)',opts:['Weil','Obwohl','Damit','Wenn'],a:1,
             why:'Concession → <b>obwohl</b>.'}]},

    { n:4, de:'Textverständnis : «Was ist ein guter Bürger?»', ar:'فهم نص — ما هو المواطن الصالح؟', dur:60,
      obj:['قراءة نص حجاجي','استخراج الحجج والأمثلة','repérage du Passiv','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Was ist ein guter Bürger?</b></p>'
        + '<p>Ein Staat funktioniert nur, wenn seine Bürger ihre Pflichten ernst nehmen. '
        + 'Zuerst muss jeder die Gesetze beachten. Ohne Gesetze gäbe es Chaos. '
        + 'Deshalb werden in der Schule schon die wichtigsten Regeln gelernt.</p>'
        + '<p>Zweitens soll jeder Bürger Steuern zahlen. Mit diesem Geld werden Schulen '
        + 'gebaut, Straßen repariert und Krankenhäuser finanziert. Wer keine Steuern zahlt, '
        + 'nimmt den anderen etwas weg.</p>'
        + '<p>Drittens ist die Teilnahme an Wahlen wichtig. In Algerien darf man ab 18 '
        + 'Jahren wählen. Leider gehen viele junge Leute nicht zur Wahl, weil sie glauben, '
        + 'dass ihre Stimme nichts ändert. Dabei wird die Zukunft eines Landes gerade '
        + 'durch die Wahl entschieden.</p>'
        + '<p>Schließlich gehört zum guten Bürger auch das Engagement für die Gemeinschaft: '
        + 'die Umwelt schützen, älteren Menschen helfen, sich ehrenamtlich beteiligen. '
        + 'Ein Bürger, der nur an sich selbst denkt, ist kein guter Bürger.</p></div>',
      exos:[{q:'Richtig oder Falsch : Selon le texte, les lois sont inutiles.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in">Ohne Gesetze gäbe es <b>Chaos</b>.</span>'},
            {q:'Richtig oder Falsch : Les impôts financent écoles, routes et hôpitaux.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
             why:'<span class="de-in">werden Schulen gebaut, Straßen repariert und '
             + 'Krankenhäuser finanziert.</span>'},
            {q:'Richtig oder Falsch : En Algérie on peut voter dès 16 ans.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in">In Algerien darf man <b>ab 18</b> Jahren wählen.</span>'},
            {q:'Richtig oder Falsch : Beaucoup de jeunes vont voter.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in">Leider gehen <b>viele junge Leute nicht</b> zur Wahl.</span>'},
            {q:'Combien de devoirs du citoyen le texte énumère-t-il ?',opts:['2','3','4','5'],a:2,
             why:'Zuerst (lois) · Zweitens (impôts) · Drittens (élections) · '
             + 'Schließlich (engagement) = <b>4</b>.'},
            {q:'Relevez une phrase au Passiv.',
             opts:['«Ein Staat funktioniert nur…»','«Mit diesem Geld werden Schulen gebaut.»',
                   '«Wer keine Steuern zahlt…»','«Ein Bürger, der nur an sich selbst denkt…»'],a:1,
             why:'<span class="de-in"><b>werden</b> + Partizip II</span> = Vorgangspassiv.'},
            {q:'Quelle est la conclusion de l’auteur ?',
             opts:['Le citoyen doit penser à lui-même','L’engagement pour la communauté est essentiel',
                   'Les élections ne servent à rien','Les lois sont trop nombreuses'],a:1,
             why:'<span class="de-in">Ein Bürger, der nur an sich selbst denkt, ist '
             + '<b>kein guter Bürger</b>.</span>'}]},

    { n:5, de:'Textproduktion — «Meine Pflichten als Bürger»', ar:'إنتاج كتابي ✍️ واجباتي كمواطن', dur:60,
      obj:['كتابة نص حجاجي 10-12 سطراً','3 phrases au Passiv','connecteurs logiques','opinion argumentée'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً حجاجياً من '
        + '<b>10 إلى 12 سطراً</b> حول واجبات المواطن، مع احترام الشروط :'
        + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
        + '<li><b>3 phrases au Passiv</b> (dont 1 avec un verbe modal)</li>'
        + '<li><b>4 connecteurs</b> : zuerst · zweitens · deshalb · schließlich · damit · obwohl</li>'
        + '<li><b>1 opinion</b> avec <span class="de-in">Meiner Meinung nach</span> ou '
        + '<span class="de-in">Ich bin der Ansicht, dass…</span></li>'
        + '<li>Une structure claire : Einleitung → 3 arguments → Schluss</li>'
        + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
        + '<p>Was bedeutet es, ein guter Bürger zu sein? Meiner Meinung nach hat jeder '
        + 'Mensch nicht nur Rechte, sondern auch Pflichten gegenüber seinem Land.</p>'
        + '<p><b>Zuerst</b> müssen die Gesetze von allen Bürgern beachtet werden, denn '
        + 'ohne Ordnung kann kein Staat funktionieren. <b>Zweitens</b> sollen Steuern '
        + 'gezahlt werden: Mit diesem Geld werden Schulen gebaut und Krankenhäuser '
        + 'finanziert. <b>Drittens</b> ist die Teilnahme an Wahlen wichtig, damit die '
        + 'Zukunft des Landes von allen mitbestimmt wird.</p>'
        + '<p><b>Schließlich</b> gehört auch das Engagement für die Gemeinschaft dazu. '
        + 'Die Umwelt muss geschützt werden, und ältere Menschen sollten unterstützt '
        + 'werden. <b>Obwohl</b> viele junge Leute glauben, dass eine einzelne Stimme '
        + 'nichts ändert, wird die Zukunft gerade durch kleine Entscheidungen bestimmt. '
        + '<b>Zusammenfassend</b> lässt sich sagen: Ein guter Bürger denkt nicht nur an '
        + 'sich selbst.</p></div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك الحجاجي هنا (سيصححه الأستاذ الافتراضي):',
             ph:'Was bedeutet es, ein guter Bürger zu sein? Meiner Meinung nach…'}]},

    { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — فرض الوحدة 8', dur:60,
      obj:['مراجعة شاملة للوحدة 8','تصحيح جماعي','التحضير للوحدة 9'], ex:'devoir'}
  ],
  devoir: {
    titre:'Évaluation — Einheit 8 : Staatsbürgerschaft',
    unite:8, duree:45, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
        texte:'<div class="reading"><p><b>Was ist ein guter Bürger?</b></p>'
          + '<p>Ein Staat funktioniert nur, wenn seine Bürger ihre Pflichten ernst nehmen. '
          + 'Zuerst muss jeder die Gesetze beachten. Ohne Gesetze gäbe es Chaos.</p>'
          + '<p>Zweitens soll jeder Bürger Steuern zahlen. Mit diesem Geld werden Schulen '
          + 'gebaut, Straßen repariert und Krankenhäuser finanziert.</p>'
          + '<p>Drittens ist die Teilnahme an Wahlen wichtig. In Algerien darf man ab 18 '
          + 'Jahren wählen. Leider gehen viele junge Leute nicht zur Wahl.</p>'
          + '<p>Schließlich gehört zum guten Bürger auch das Engagement für die Gemeinschaft: '
          + 'die Umwelt schützen, älteren Menschen helfen, sich ehrenamtlich beteiligen.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Ohne Gesetze gäbe es Chaos.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Ohne Gesetze gäbe es Chaos.</span>'},
          {id:'I.2',type:'vf',t:'Die Steuern finanzieren nur die Armee.',pts:1,rep:'Falsch',
           just:'Elles financent écoles, routes et hôpitaux.'},
          {id:'I.3',type:'vf',t:'In Algerien darf man ab 18 Jahren wählen.',pts:1,rep:'Richtig',
           just:'<span class="de-in">In Algerien darf man ab 18 Jahren wählen.</span>'},
          {id:'I.4',type:'vf',t:'Die meisten jungen Leute gehen zur Wahl.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Leider gehen viele junge Leute <b>nicht</b> zur Wahl.</span>'},
          {id:'I.5',type:'txt',t:'Wofür wird das Steuergeld benutzt? (2 exemples)',pts:2,
           rep:'Damit werden Schulen gebaut und Krankenhäuser finanziert.',
           key:['schulen','krankenhäuser','krankenhauser','straßen','strassen'],
           just:'<span class="de-in">werden Schulen gebaut, Straßen repariert und '
                + 'Krankenhäuser finanziert</span>'},
          {id:'I.6',type:'txt',t:'Nennen Sie zwei Formen des Engagements für die Gemeinschaft.',pts:2,
           rep:'Die Umwelt schützen und älteren Menschen helfen.',
           key:['umwelt','älteren','alteren','ehrenamtlich'],
           just:'<span class="de-in">die Umwelt schützen, älteren Menschen helfen, '
                + 'sich ehrenamtlich beteiligen</span>'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Die Steuern ___ letztes Jahr erhöht.»',
           opts:['werden','wurden','sind','haben'],a:1,pts:1,
           why:'Präteritum Passiv → <b>wurden</b>.'},
          {id:'II.2',type:'qcm',t:'«Das Gesetz ___ verabschiedet worden.»',
           opts:['wird','wurde','ist','hat'],a:2,pts:1,
           why:'Perfekt Passiv = <b>ist</b> + Partizip II + <b>worden</b>.'},
          {id:'II.3',type:'qcm',t:'«Hier ___ nicht geraucht werden.» (interdiction)',
           opts:['muss','darf','kann','soll'],a:1,pts:1,
           why:'Interdiction → <b>darf nicht</b>.'},
          {id:'II.4',type:'qcm',t:'«Ich lerne Deutsch, ___ ich in Berlin studieren will.»',
           opts:['weil','denn','damit','obwohl'],a:0,pts:1,
           why:'Cause + verbe final → <b>weil</b>.'},
          {id:'II.5',type:'txt',t:'Passif : «Man baut Schulen.» → «Schulen ___ ___ .»',pts:1,
           rep:'werden gebaut',key:['werden gebaut'],just:'werden + Partizip II.'},
          {id:'II.6',type:'txt',t:'Complément d’agent (personne) : «___ der Regierung»',pts:1,
           rep:'von',key:['von'],just:'von + Datif (personne) · durch + Akk (moyen).'},
          {id:'II.7',type:'txt',t:'Traduis : «يجب احترام القوانين»',pts:1,
           rep:'Die Gesetze müssen beachtet werden.',key:['müssen','beachtet','werden'],
           just:'Modal + Partizip II + <b>werden</b> en fin de phrase.'},
          {id:'II.8',type:'txt',t:'But : «Wir schützen die Umwelt, ___ die Kinder gesund leben.»',
           pts:1,rep:'damit',key:['damit'],just:'damit + subordonnée (verbe à la fin).'}
        ]},
      { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً حجاجياً من 10 أسطر حول واجبات المواطن : 3 جمل بالمبني للمجهول '
             + '(واحدة مع فعل ناقص)، 4 روابط منطقية، ورأيك الشخصي.',
           grille:[['3 phrases au Passiv (dont 1 avec modal)','1.0'],
                   ['4 connecteurs logiques (zuerst/zweitens/deshalb/damit/obwohl)','1.0'],
                   ['1 opinion (Meiner Meinung nach / Ich bin der Ansicht, dass)','0.5'],
                   ['structure Einleitung → arguments → Schluss','0.5'],
                   ['vocabulaire de l’unité (8 mots minimum)','0.5'],
                   ['ordre des mots (verbe en 2, infinitif/participe en fin)','0.25'],
                   ['orthographe, majuscules des noms, ponctuation','0.25']],
           modele:'<div class="reading"><p>Meiner Meinung nach hat jeder Mensch nicht nur '
             + 'Rechte, sondern auch Pflichten. Zuerst müssen die Gesetze von allen Bürgern '
             + 'beachtet werden. Zweitens sollen Steuern gezahlt werden: Mit diesem Geld '
             + 'werden Schulen gebaut. Drittens ist die Teilnahme an Wahlen wichtig, damit '
             + 'die Zukunft mitbestimmt wird. Schließlich muss die Umwelt geschützt werden. '
             + 'Zusammenfassend: Ein guter Bürger denkt nicht nur an sich selbst.</p></div>'}
        ]}
    ]
  },
  corrige: {
    unite: 8,
    titre: 'التصحيح النموذجي — الوحدة 8 : Staatsbürgerschaft',
    bareme: { I: 8, II: 8, III: 4, total: 20 },
    partie_I: [
      { id:'I.1', reponse:'Richtig', justification:'Ohne Gesetze gäbe es Chaos.' },
      { id:'I.2', reponse:'Falsch', justification:'Schulen, Straßen, Krankenhäuser.' },
      { id:'I.3', reponse:'Richtig', justification:'Ab 18 Jahren.' },
      { id:'I.4', reponse:'Falsch', justification:'Viele junge Leute gehen NICHT zur Wahl.' },
      { id:'I.5', reponse:'Schulen werden gebaut, Krankenhäuser finanziert.', justification:'2ᵉ paragraphe.' },
      { id:'I.6', reponse:'Umwelt schützen · älteren Menschen helfen · Ehrenamt.', justification:'4ᵉ paragraphe.' }
    ],
    partie_II: [
      { id:'II.1', reponse:'wurden', regle:'Präteritum Passiv' },
      { id:'II.2', reponse:'ist', regle:'Perfekt Passiv : ist + P.II + worden' },
      { id:'II.3', reponse:'darf', regle:'interdiction : darf nicht' },
      { id:'II.4', reponse:'weil', regle:'cause + verbe final' },
      { id:'II.5', reponse:'werden gebaut', regle:'werden + Partizip II' },
      { id:'II.6', reponse:'von', regle:'von + Dat (personne) · durch + Akk (moyen)' },
      { id:'II.7', reponse:'Die Gesetze müssen beachtet werden.', regle:'modal + P.II + werden' },
      { id:'II.8', reponse:'damit', regle:'but + verbe final' }
    ],
    partie_III: {
      bareme: [['3 Passiv dont 1 modal','1.0'],['4 connecteurs','1.0'],['1 opinion','0.5'],
               ['structure','0.5'],['vocabulaire U8','0.5'],['ordre des mots','0.25'],
               ['orthographe','0.25']],
      modele: 'Meiner Meinung nach hat jeder Mensch Rechte und Pflichten. Zuerst müssen die '
            + 'Gesetze beachtet werden. Zweitens sollen Steuern gezahlt werden, damit Schulen '
            + 'gebaut werden. Schließlich muss die Umwelt geschützt werden. Zusammenfassend: '
            + 'Ein guter Bürger denkt nicht nur an sich selbst.',
      seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
                '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 8 🔁' }
    },
    erreurs_frequentes: [
      '~~Das Gesetz ist verabschiedet worden worden~~ → Perfekt Passiv = '
      + '<b>ist</b> + Partizip II + <b>worden</b> (une seule fois).',
      '~~Das Buch wird gelest~~ → participe de lesen = <b>gelesen</b> (verbe fort).',
      '~~Die Tür wird geöffnet~~ pour « la porte est ouverte » (état) → '
      + '<b>Die Tür ist geöffnet</b> (Zustandspassiv).',
      '~~durch der Regierung~~ → personne = <b>von</b> + Datif : <b>von der</b> Regierung.',
      '~~weil ich bin krank~~ → verbe à la fin : weil ich krank <b>bin</b>.',
      '~~damit + verbe en 2~~ → <b>damit</b> est une conjonction : verbe à la fin.',
      '~~Hier darf man rauchen~~ pour une interdiction → <span class="de-in">Hier darf man '
      + '<b>nicht</b> rauchen</span>.',
      '~~Gesetze müssen beachtet~~ → au passif, il faut <b>werden</b> en fin : '
      + 'Gesetze müssen beachtet <b>werden</b>.'
    ]
  }
},

/* ══════════════════ UNITÉ 9 — Leben in der Gesellschaft ══════════════════ */
{
  n: 9, de: 'Leben in der Gesellschaft', ar: 'الحياة في المجتمع',
  niveau: '3AS', trimestre: 2, periode: 'جانفي — فيفري', duree_totale: 360, cecrl: 'B2',
  icon: '🤝',
  objectifs: ['وصف العلاقات الاجتماعية','استعمال Konjunktiv II','التعبير عن الافتراض والنصيحة',
              'استعمال حالة الملكية Genitiv','فهم نص اجتماعي','إنتاج نص تحليلي'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Gesellschaft','die Generation','der Konflikt','die Solidarität',
                    'die Gemeinschaft','das Zusammenleben'],
  grammaire_cle: ['Konjunktiv II','Genitiv','zweiteilige Konnektoren',
                  'Nominalisierung / Verbalisierung'],
  seances: [
    { n:1, de:'Generationen und Zusammenleben', ar:'الأجيال والعيش المشترك', dur:60,
      obj:['تسمية العلاقات الاجتماعية','المفردات المجتمعية','وصف نزاع وحلّه'],
      lex:[['die Gesellschaft','المجتمع'],['die Generation','الجيل'],['der Generationenkonflikt','صراع الأجيال'],
           ['die Solidarität','التضامن'],['die Gemeinschaft','الجماعة'],['das Zusammenleben','العيش المشترك'],
           ['die Tradition','التقليد'],['der Fortschritt','التقدّم'],['die Einsamkeit','الوحدة'],
           ['die Familie','الأسرة'],['die Nachbarschaft','الجيرة'],['der Respekt','الاحترام'],
           ['die Verantwortung','المسؤولية'],['sich engagieren','يلتزم / يتطوّع'],
           ['helfen (Dat.)','يساعد'],['unterstützen','يدعم'],['achten auf (Akk.)','يحرص على'],
           ['sich kümmern um (Akk.)','يهتمّ بـ']],
      gram:{t:'Verbes à préposition固定 + cas imposé',
        b:['<span class="de-in">helfen</span> + <b>Dativ</b> · '
         + '<span class="de-in">danken</span> + <b>Dativ</b>',
           '<span class="de-in">sich kümmern <b>um</b></span> + <b>Akkusativ</b>',
           '<span class="de-in">achten <b>auf</b></span> + <b>Akkusativ</b>',
           '<span class="de-in">sich interessieren <b>für</b></span> + <b>Akkusativ</b>',
           '<span class="de-in">sich freuen <b>auf</b></span> (à venir) · '
         + '<span class="de-in">sich freuen <b>über</b></span> (présent/passé)',
           'Apprends toujours le verbe <b>avec</b> sa préposition et son cas.'],
        tbl:[['helfen','+ Dativ','Ich helfe <b>meinem</b> Vater.'],
             ['sich kümmern um','+ Akkusativ','Ich kümmere mich um <b>meine</b> Oma.'],
             ['achten auf','+ Akkusativ','Achte auf <b>deine</b> Gesundheit.'],
             ['sich interessieren für','+ Akkusativ','Ich interessiere mich für <b>Geschichte</b>.'],
             ['danken','+ Dativ','Ich danke <b>dir</b>.']],
        ex:'<span class="de-in">In einer guten Gesellschaft <b>kümmern sich</b> die Jungen '
         + '<b>um</b> die Alten.</span>'},
      exos:[{q:'«Ich helfe ___ Vater.»',opts:['mein','meinen','meinem','meiner'],a:2,
             why:'<span class="de-in">helfen</span> + <b>Datif</b> → meinem.'},
            {q:'«Sie kümmert sich ___ ihre Oma.»',opts:['für','um','auf','an'],a:1,
             why:'<span class="de-in">sich kümmern <b>um</b></span> + Akkusativ.'},
            {q:'«Achte ___ deine Gesundheit!»',opts:['für','um','auf','an'],a:2,
             why:'<span class="de-in">achten <b>auf</b></span> + Akkusativ.'},
            {q:'«Ich interessiere mich ___ Geschichte.»',opts:['an','für','auf','um'],a:1,
             why:'<span class="de-in">sich interessieren <b>für</b></span>.'},
            {q:'«sich freuen ___ die Ferien» (à venir)',opts:['über','auf','für','an'],a:1,
             why:'<b>auf</b> + Akk = à venir · <b>über</b> + Akk = présent/passé.'}]},

    { n:2, de:'Der Konjunktiv II', ar:'صيغة الافتراض', dur:60,
      obj:['بناء Konjunktiv II','التعبير عن الأمنية والنصيحة','الشرط غير الحقيقي'],
      lex:[['Wenn ich Zeit hätte, …','لو كان لديّ وقت…'],
           ['An deiner Stelle würde ich…','مكانك كنت سأ…'],
           ['Ich hätte gern…','أرغب في…'],
           ['Könnten Sie mir helfen?','هل يمكنك مساعدتي؟'],
           ['Ohne dich wäre ich verloren.','بدونك لكنت ضائعاً.'],
           ['Hätte ich das gewusst, …','لو علمت ذلك…']],
      gram:{t:'Konjunktiv II — irréel, souhait, conseil, politesse',
        b:['Formes propres : <b>wäre</b> (sein) · <b>hätte</b> (haben) · <b>könnte</b> · '
         + '<b>müsste</b> · <b>dürfte</b> · <b>sollte</b>',
           'Tous les autres verbes : <b>würde</b> + Infinitif',
           'Condition irréelle au présent : <span class="de-in">Wenn ich reich <b>wäre</b>, '
         + '<b>würde</b> ich reisen.</span>',
           'Condition irréelle au passé : <span class="de-in">Wenn du früher <b>gekommen '
         + 'wärst</b>, <b>hättest</b> du ihn <b>gesehen</b>.</span>',
           'Sans <b>wenn</b>, le verbe passe en tête : '
         + '<span class="de-in"><b>Hätte</b> ich das gewusst, …</span>',
           'Conseil : <span class="de-in">An deiner Stelle <b>würde ich</b> fragen.</span>'],
        tbl:[['sein','wäre','Wenn ich reich wäre,…'],
             ['haben','hätte','Ich hätte gern einen Tee.'],
             ['können','könnte','Könnten Sie helfen?'],
             ['müssen','müsste','Du müsstest lernen.'],
             ['andere Verben','würde + Inf.','Ich würde reisen.']],
        ex:'<span class="de-in">Wenn die Jungen den Alten zuhören <b>würden</b>, '
         + '<b>gäbe</b> es weniger Konflikte.</span>'},
      exos:[{q:'«Wenn ich Zeit ___, würde ich lesen.»',opts:['habe','hätte','haben','hatte'],a:1,
             why:'Konjunktiv II de haben → <b>hätte</b>.'},
            {q:'«An deiner Stelle ___ ich fragen.»',opts:['werde','würde','wurde','wäre'],a:1,
             why:'Conseil → <b>würde</b> + Infinitif.'},
            {q:'«___ du früher gekommen wärst, …» (sans wenn)',opts:['Wenn','Hättest','Hast','Wärst'],a:1,
             why:'Sans <b>wenn</b>, l’auxiliaire passe en tête : <b>Hättest</b> du…'},
            {q:'Formule la plus polie pour commander :',
             opts:['Ich will einen Kaffee.','Ich hätte gern einen Kaffee.',
                   'Gib mir einen Kaffee.','Ich brauche Kaffee.'],a:1,
             why:'<span class="de-in">Ich <b>hätte gern</b>…</span> = Konjunktiv II.'},
            {q:'«Ohne dich ___ ich verloren.»',opts:['bin','wäre','war','werde'],a:1,
             why:'Irréel → <b>wäre</b>.'}]},

    { n:3, de:'Genitiv + zweiteilige Konnektoren', ar:'حالة الملكية وأدوات الربط الثنائية', dur:60,
      obj:['استعمال Genitiv','أدوات الربط الثنائية','التحويل الاسمي والفعلي'],
      lex:[['das Auto des Vaters','سيارة الأب'],['die Tasche der Mutter','حقيبة الأم'],
           ['wegen des Wetters','بسبب الطقس'],['trotz der Hitze','رغم الحرارة'],
           ['während des Unterrichts','أثناء الدرس'],['statt des Buses','بدل الحافلة'],
           ['entweder … oder','إما … أو'],['weder … noch','لا … ولا'],
           ['zwar … aber','صحيح … لكن'],['nicht nur … sondern auch','ليس فقط … بل أيضاً'],
           ['je … desto','كلما … كلما'],['sowohl … als auch','كل من … و']],
      gram:{t:'Genitiv et connecteurs en deux parties',
        b:['<b>Genitiv</b> : le nom masculin/neutre prend <b>-s / -es</b>. '
         + 'Articles : <span class="de-in">des / der / des / der</span>',
           'Prépositions + Genitiv : <b>wegen · trotz · während · statt · außerhalb · '
         + 'innerhalb · während</b>',
           '<b>je … desto</b> : après <b>je</b>, verbe à la fin ; après <b>desto</b>, '
         + 'verbe en position 2.',
           '<span class="de-in"><b>Je</b> mehr ich lerne, <b>desto</b> besser <b>werde</b> ich.</span>',
           '<b>Nominalisierung</b> : <span class="de-in">Weil es regnet</span> → '
         + '<span class="de-in"><b>Wegen des Regens</b></span>'],
        tbl:[['entweder … oder','إما … أو','Entweder du lernst, oder du gehst.'],
             ['weder … noch','لا … ولا','Er trinkt weder Kaffee noch Tee.'],
             ['zwar … aber','صحيح … لكن','Er ist zwar jung, aber klug.'],
             ['nicht nur … sondern auch','ليس فقط … بل','Sie spricht nicht nur Arabisch, '
              + 'sondern auch Deutsch.'],
             ['je … desto','كلما … كلما','Je mehr Übung, desto besser das Ergebnis.'],
             ['sowohl … als auch','كل من … و','Sowohl Lehrer als auch Schüler sind wichtig.']],
        ex:'<span class="de-in"><b>Trotz</b> der Schwierigkeiten geben die Jugendlichen '
         + 'nicht auf.</span>'},
      exos:[{q:'«Das ist das Auto ___ Vaters.»',opts:['der','des','dem','den'],a:1,
             why:'Genitiv masculin → <b>des</b> (+ -s au nom).'},
            {q:'«___ des Regens bleiben wir zu Hause.»',opts:['Trotz','Wegen','Während','Statt'],a:1,
             why:'Cause → <span class="de-in"><b>wegen</b> + Genitiv</span>.'},
            {q:'«___ mehr ich übe, ___ besser spreche ich.»',opts:['Je … desto','Entweder … oder',
                                                                    'Zwar … aber','Weder … noch'],a:0,
             why:'Proportion → <b>je … desto</b> (verbe à la fin après <b>je</b>).'},
            {q:'«Er trinkt ___ Kaffee ___ Tee.» (ni…ni)',opts:['entweder … oder','weder … noch',
                                                                'zwar … aber','je … desto'],a:1,
             why:'Double négation → <b>weder … noch</b>.'},
            {q:'Nominalisation de «Weil es regnet» :',
             opts:['Wegen des Regens','Trotz des Regens','Während des Regens','Statt des Regens'],a:0,
             why:'Cause → <span class="de-in"><b>wegen</b> + Genitiv</span>.'}]},

    { n:4, de:'Textverständnis : «Jung und Alt»', ar:'فهم نص — الشباب والكبار', dur:60,
      obj:['قراءة نص اجتماعي','استخراج وجهات النظر المتعارضة','repérage du Konjunktiv II','الإجابة بجمل كاملة'],
      texte:'<div class="reading"><p><b>Jung und Alt — ein schwieriges Verhältnis?</b></p>'
        + '<p>In vielen algerischen Familien leben drei Generationen unter einem Dach: '
        + 'die Großeltern, die Eltern und die Kinder. Früher war das selbstverständlich. '
        + 'Heute ziehen immer mehr junge Leute nach dem Studium in eine andere Stadt, '
        + 'weil sie dort Arbeit finden.</p>'
        + '<p>Die ältere Generation bedauert diese Entwicklung. Viele Großeltern fühlen '
        + 'sich einsam und sagen, dass die Jugend keine Zeit mehr für die Familie habe. '
        + 'Die Jungen dagegen erklären, dass sie ohne diese Veränderung keine Zukunft '
        + 'hätten. Wenn sie in ihrer Heimatstadt blieben, würden sie keine Arbeit finden.</p>'
        + '<p>Trotz dieser Konflikte gibt es auch viel Solidarität. In schwierigen Zeiten '
        + 'helfen die Familien einander: Die Großeltern kümmern sich um die Enkel, '
        + 'während die Eltern arbeiten. Und am Wochenende kommen alle zusammen.</p>'
        + '<p>Meiner Meinung nach wäre die beste Lösung ein Kompromiss: Die Jungen sollten '
        + 'ihre Eltern öfter besuchen, und die Älteren sollten die Entscheidungen ihrer '
        + 'Kinder respektieren. Eine Gesellschaft, in der die Generationen nicht miteinander '
        + 'sprechen, verliert ihre Wurzeln.</p></div>',
      exos:[{q:'Richtig oder Falsch : Autrefois, trois générations vivaient sous le même toit.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
             why:'<span class="de-in"><b>Früher war das selbstverständlich.</b></span>'},
            {q:'Richtig oder Falsch : Les jeunes partent parce qu’ils trouvent du travail ailleurs.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
             why:'<span class="de-in">… weil sie dort Arbeit finden.</span>'},
            {q:'Richtig oder Falsch : Les grands-parents se sentent parfois seuls.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
             why:'<span class="de-in">Viele Großeltern fühlen sich <b>einsam</b>.</span>'},
            {q:'Richtig oder Falsch : Il n’y a aucune solidarité dans les familles.',
             opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
             why:'<span class="de-in"><b>Trotz</b> dieser Konflikte gibt es auch '
             + '<b>viel Solidarität</b>.</span>'},
            {q:'Quelle est la solution proposée par l’auteur ?',
             opts:['Que les jeunes restent chez leurs parents','Un compromis entre les générations',
                   'Que les aînés décident seuls','Vivre séparés'],a:1,
             why:'<span class="de-in">die beste Lösung <b>wäre ein Kompromiss</b></span>.'},
            {q:'Relevez une phrase au Konjunktiv II.',
             opts:['«Früher war das selbstverständlich.»',
                   '«Die Jungen sollten ihre Eltern öfter besuchen.»',
                   '«Am Wochenende kommen alle zusammen.»',
                   '«Die Großeltern kümmern sich um die Enkel.»'],a:1,
             why:'<span class="de-in"><b>sollten</b></span> = Konjunktiv II de sollen (conseil).'},
            {q:'Que font les grands-parents pendant que les parents travaillent ?',
             opts:['Ils travaillent aussi','Ils s’occupent des petits-enfants',
                   'Ils rendent visite aux voisins','Ils voyagent'],a:1,
             why:'<span class="de-in">Die Großeltern <b>kümmern sich um die Enkel</b>, '
             + 'während die Eltern arbeiten.</span>'}]},

    { n:5, de:'Textproduktion — «Die Gesellschaft von morgen»', ar:'إنتاج كتابي ✍️ مجتمع الغد', dur:60,
      obj:['كتابة نص تحليلي 12 سطراً','Konjunktiv II','Genitiv','connecteurs doubles','opinion argumentée'],
      consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً تحليلياً من '
        + '<b>12 سطراً</b> حول «مجتمع الغد»، مع احترام الشروط :'
        + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
        + '<li><b>2 phrases au Konjunktiv II</b> (souhait ou conseil)</li>'
        + '<li><b>2 noms au Genitiv</b> avec leur préposition (wegen / trotz / während)</li>'
        + '<li><b>1 connecteur double</b> (je…desto / nicht nur…sondern auch / weder…noch)</li>'
        + '<li><b>2 points de vue opposés</b> + ton opinion</li>'
        + '</ul></div></div>',
      modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
        + '<p>Wie wird die algerische Gesellschaft in zwanzig Jahren aussehen? Diese Frage '
        + 'ist nicht leicht zu beantworten, denn die Veränderungen geschehen schneller als '
        + 'früher.</p>'
        + '<p>Die einen sagen, dass die Digitalisierung <b>trotz</b> der Risiken eine große '
        + 'Chance sei. <b>Je</b> mehr junge Leute eine Fremdsprache lernen, <b>desto</b> '
        + 'besser sind ihre beruflichen Möglichkeiten. Die anderen befürchten, dass die '
        + 'Traditionen verloren gehen. Sie meinen, dass die Jugendlichen weder Zeit für die '
        + 'Familie noch Interesse an der Geschichte hätten.</p>'
        + '<p>Meiner Meinung nach liegt die Wahrheit in der Mitte. Eine moderne Gesellschaft '
        + 'braucht <b>nicht nur</b> technischen Fortschritt, <b>sondern auch</b> menschliche '
        + 'Werte. <b>Wegen</b> der Arbeitslosigkeit verlassen viele junge Menschen ihre '
        + 'Heimatstadt — das ist ein ernstes Problem. Wenn die Generationen miteinander '
        + 'sprechen <b>würden</b>, gäbe es weniger Konflikte. Die Alten <b>sollten</b> '
        + 'ihre Erfahrungen teilen, und die Jungen sollten zuhören. Denn eine Gesellschaft, '
        + 'die ihre Wurzeln vergisst, verliert ihre Zukunft.</p></div></div>',
      exos:[{type:'texte',q:'✍️ اكتب نصّك التحليلي هنا (سيصححه الأستاذ الافتراضي):',
             ph:'Wie wird die algerische Gesellschaft in zwanzig Jahren aussehen?…'}]},

    { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — فرض الوحدة 9', dur:60,
      obj:['مراجعة شاملة للوحدة 9','تصحيح جماعي','التحضير للوحدة 10'], ex:'devoir'}
  ],
  devoir: {
    titre:'Évaluation — Einheit 9 : Leben in der Gesellschaft',
    unite:9, duree:45, total:20,
    parties:[
      { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
        texte:'<div class="reading"><p><b>Jung und Alt — ein schwieriges Verhältnis?</b></p>'
          + '<p>In vielen algerischen Familien leben drei Generationen unter einem Dach. '
          + 'Früher war das selbstverständlich. Heute ziehen immer mehr junge Leute nach '
          + 'dem Studium in eine andere Stadt, weil sie dort Arbeit finden.</p>'
          + '<p>Die ältere Generation bedauert diese Entwicklung. Viele Großeltern fühlen '
          + 'sich einsam. Die Jungen dagegen erklären, dass sie ohne diese Veränderung '
          + 'keine Zukunft hätten.</p>'
          + '<p>Trotz dieser Konflikte gibt es auch viel Solidarität: Die Großeltern '
          + 'kümmern sich um die Enkel, während die Eltern arbeiten.</p>'
          + '<p>Meiner Meinung nach wäre die beste Lösung ein Kompromiss: Die Jungen '
          + 'sollten ihre Eltern öfter besuchen, und die Älteren sollten die Entscheidungen '
          + 'ihrer Kinder respektieren.</p></div>',
        questions:[
          {id:'I.1',type:'vf',t:'Früher lebten drei Generationen unter einem Dach.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Früher war das selbstverständlich.</span>'},
          {id:'I.2',type:'vf',t:'Die jungen Leute ziehen weg, weil sie keine Familie haben.',pts:1,rep:'Falsch',
           just:'Ils partent <span class="de-in">weil sie dort <b>Arbeit finden</b></span>.'},
          {id:'I.3',type:'vf',t:'Viele Großeltern fühlen sich einsam.',pts:1,rep:'Richtig',
           just:'<span class="de-in">Viele Großeltern fühlen sich einsam.</span>'},
          {id:'I.4',type:'vf',t:'Trotz der Konflikte gibt es keine Solidarität.',pts:1,rep:'Falsch',
           just:'<span class="de-in">Trotz dieser Konflikte gibt es auch <b>viel Solidarität</b>.</span>'},
          {id:'I.5',type:'txt',t:'Was machen die Großeltern, während die Eltern arbeiten?',pts:2,
           rep:'Sie kümmern sich um die Enkel.',key:['enkeln','kümmern','kummern'],
           just:'<span class="de-in">Die Großeltern kümmern sich um die Enkel.</span>'},
          {id:'I.6',type:'txt',t:'Welche Lösung schlägt der Autor vor?',pts:2,
           rep:'Ein Kompromiss zwischen den Generationen.',key:['kompromiss'],
           just:'<span class="de-in">die beste Lösung <b>wäre ein Kompromiss</b></span>'}
        ]},
      { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
        questions:[
          {id:'II.1',type:'qcm',t:'«Wenn ich Zeit ___, würde ich lesen.»',
           opts:['habe','hätte','haben','hatte'],a:1,pts:1,
           why:'Konjunktiv II de haben → <b>hätte</b>.'},
          {id:'II.2',type:'qcm',t:'«Das ist das Auto ___ Vaters.»',
           opts:['der','des','dem','den'],a:1,pts:1,
           why:'Genitiv masculin → <b>des</b> (+ -s).'},
          {id:'II.3',type:'qcm',t:'«___ des Regens bleiben wir zu Hause.»',
           opts:['Trotz','Wegen','Während','Statt'],a:1,pts:1,
           why:'Cause → <b>wegen</b> + Genitiv.'},
          {id:'II.4',type:'qcm',t:'«Sie kümmert sich ___ ihre Oma.»',
           opts:['für','um','auf','an'],a:1,pts:1,
           why:'<span class="de-in">sich kümmern <b>um</b></span> + Akkusativ.'},
          {id:'II.5',type:'txt',t:'Konjunktiv II de «sein» (ich) :',pts:1,rep:'wäre',
           key:['wäre','ware'],just:'être → wäre · avoir → hätte.'},
          {id:'II.6',type:'txt',t:'Connecteur double = «كلما … كلما» :',pts:1,rep:'je … desto',
           key:['je','desto'],just:'après <b>je</b> le verbe va à la fin ; après <b>desto</b> il revient en 2.'},
          {id:'II.7',type:'txt',t:'Traduis : «بدونك لكنت ضائعاً»',pts:1,
           rep:'Ohne dich wäre ich verloren.',key:['ohne','wäre','verloren'],
           just:'Irréel → <b>wäre</b>.'},
          {id:'II.8',type:'txt',t:'Nominalisation : «Weil es regnet» → «___ des Regens»',pts:1,
           rep:'Wegen',key:['wegen'],just:'wegen + Genitiv.'}
        ]},
      { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
        questions:[
          {id:'III.1',type:'redac',pts:4,
           t:'اكتب نصاً تحليلياً من 10 أسطر حول «مجتمع الغد» : جملتان في Konjunktiv II، '
             + 'اسمان في حالة Genitiv مع حرف جرّ، رابط مزدوج واحد، ووجهتا نظر متعارضتان + رأيك.',
           grille:[['2 phrases au Konjunktiv II (souhait / conseil)','1.0'],
                   ['2 noms au Genitiv avec préposition (wegen/trotz/während)','0.75'],
                   ['1 connecteur double (je…desto / nicht nur…sondern auch)','0.5'],
                   ['2 points de vue opposés + opinion personnelle','0.75'],
                   ['vocabulaire de l’unité (8 mots minimum)','0.5'],
                   ['structure (Einleitung · Hauptteil · Schluss)','0.25'],
                   ['orthographe, majuscules des noms, ponctuation','0.25']],
           modele:'<div class="reading"><p>Wie wird unsere Gesellschaft in zwanzig Jahren '
             + 'aussehen? Die einen sagen, dass die Digitalisierung trotz der Risiken eine '
             + 'Chance sei. Je mehr junge Leute eine Fremdsprache lernen, desto besser sind '
             + 'ihre Möglichkeiten. Die anderen befürchten, dass die Traditionen verloren '
             + 'gehen.</p><p>Meiner Meinung nach braucht eine moderne Gesellschaft nicht nur '
             + 'Fortschritt, sondern auch menschliche Werte. Wenn die Generationen '
             + 'miteinander sprechen würden, gäbe es weniger Konflikte. Die Alten sollten '
             + 'ihre Erfahrungen teilen. Denn eine Gesellschaft, die ihre Wurzeln vergisst, '
             + 'verliert ihre Zukunft.</p></div>'}
        ]}
    ]
  },
  corrige: {
    unite: 9,
    titre: 'التصحيح النموذجي — الوحدة 9 : Leben in der Gesellschaft',
    bareme: { I: 8, II: 8, III: 4, total: 20 },
    partie_I: [
      { id:'I.1', reponse:'Richtig', justification:'Früher war das selbstverständlich.' },
      { id:'I.2', reponse:'Falsch', justification:'Ils partent pour trouver du travail.' },
      { id:'I.3', reponse:'Richtig', justification:'Viele Großeltern fühlen sich einsam.' },
      { id:'I.4', reponse:'Falsch', justification:'Trotz der Konflikte gibt es viel Solidarität.' },
      { id:'I.5', reponse:'Sie kümmern sich um die Enkel.', justification:'3ᵉ paragraphe.' },
      { id:'I.6', reponse:'Ein Kompromiss.', justification:'4ᵉ paragraphe.' }
    ],
    partie_II: [
      { id:'II.1', reponse:'hätte', regle:'Konjunktiv II de haben' },
      { id:'II.2', reponse:'des', regle:'Genitiv masculin + -s au nom' },
      { id:'II.3', reponse:'Wegen', regle:'cause + Genitiv' },
      { id:'II.4', reponse:'um', regle:'sich kümmern um + Akkusativ' },
      { id:'II.5', reponse:'wäre', regle:'être → wäre' },
      { id:'II.6', reponse:'je … desto', regle:'proportion, ordre des mots inversé après je' },
      { id:'II.7', reponse:'Ohne dich wäre ich verloren.', regle:'irréel → wäre' },
      { id:'II.8', reponse:'Wegen', regle:'weil → wegen + Genitiv' }
    ],
    partie_III: {
      bareme: [['2 Konjunktiv II','1.0'],['2 Genitiv + préposition','0.75'],
               ['1 connecteur double','0.5'],['2 avis + opinion','0.75'],
               ['vocabulaire U9','0.5'],['structure','0.25'],['orthographe','0.25']],
      modele: 'Wie wird unsere Gesellschaft in zwanzig Jahren aussehen? Je mehr junge Leute '
            + 'eine Fremdsprache lernen, desto besser sind ihre Möglichkeiten. Meiner Meinung '
            + 'nach braucht eine moderne Gesellschaft nicht nur Fortschritt, sondern auch '
            + 'menschliche Werte. Wenn die Generationen miteinander sprechen würden, gäbe es '
            + 'weniger Konflikte.',
      seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
                '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 9 🔁' }
    },
    erreurs_frequentes: [
      '~~Ich helfe meinen Vater~~ → <span class="de-in">helfen</span> + Datif : '
      + 'Ich helfe mein<b>em</b> Vater.',
      '~~Ich kümmere mich für meine Oma~~ → <span class="de-in">sich kümmern <b>um</b></span>.',
      '~~Wenn ich reich bin, würde ich reisen~~ → irréel : Wenn ich reich <b>wäre</b>, '
      + '<b>würde</b> ich reisen.',
      '~~würde sein / würde haben~~ → formes propres obligatoires : <b>wäre</b> · <b>hätte</b>.',
      '~~des Vater~~ → le masculin/neutre prend <b>-s</b> au génitif : des Vater<b>s</b>.',
      '~~je mehr ich lerne, desto besser ich werde~~ → après <b>desto</b>, le verbe revient '
      + 'en position 2 : desto besser <b>werde ich</b>.',
      '~~nicht nur … aber auch~~ → la paire correcte est nicht nur … <b>sondern</b> auch.',
      '~~wegen dem Regen~~ (registre soutenu) → <b>wegen des Regens</b> (Genitiv).'
    ]
  }
}

];

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITES_3AS_A = UNITES_3AS_A;
