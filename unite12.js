/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite12.js
   الوحدة 12 : Umweltprobleme — مشاكل البيئة
   6 حصص + فرض /20 (I/8 · II/8 · III/4) + تصحيح + 8 أخطاء شائعة
   Programme officiel MEN · 3AS · الفصل الثاني (clôture) · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE12_META = {
  n: 12, de: 'Umweltprobleme', ar: 'مشاكل البيئة',
  niveau: '3AS', trimestre: 2, periode: 'ديسمبر — فيفري', duree_totale: 360, cecrl: 'B2',
  icon: '🌍', cloture_trimestre: true,
  objectifs: ['وصف المشاكل البيئية واقتراح الحلول','Funktionsverbgefüge',
              'الجمل التنازلية (obwohl/trotz)','بدائل المبني للمجهول','نص توعوي 12-15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Umwelt','der Umweltschutz','der Klimawandel','die Wasserknappheit',
                    'die erneuerbaren Energien','die Nachhaltigkeit'],
  grammaire_cle: ['Funktionsverbgefüge','Konzessivsätze (obwohl/trotzdem/trotz)',
                  'Passiversatzformen (sich lassen / -bar)','Mots composés']
};

const SEANCES_U12 = [
  { n:1, de:'Wortschatz: Umwelt und Klima', ar:'مفردات البيئة والمناخ', dur:60,
    obj:['تسمية المشاكل البيئية','الطاقات المتجددة والحلول','الكلمات المركّبة'],
    lex:[['die Umwelt','البيئة'],['der Umweltschutz','حماية البيئة'],
         ['die Umweltverschmutzung','التلوث البيئي'],['verschmutzen','يلوّث'],
         ['das Klima','المناخ'],['der Klimawandel','التغيّر المناخي'],
         ['die Erderwärmung','الاحتباس الحراري'],['die Wasserknappheit','ندرة المياه'],
         ['die Dürre','الجفاف'],['die Überschwemmung','الفيضان'],['die Wüste','الصحراء'],
         ['die Wüstenbildung','التصحر'],['der Müll','النفايات'],['der Abfall','النفايات'],
         ['Müll trennen','يفرز النفايات'],['recyceln','يعيد التدوير'],
         ['das Recycling','إعادة التدوير'],['die Energie','الطاقة'],
         ['erneuerbare Energien','الطاقات المتجددة'],['die Solarenergie','الطاقة الشمسية'],
         ['die Windkraft','طاقة الرياح'],['sparen','يقتصد'],['nachhaltig','مستدام'],
         ['die Nachhaltigkeit','الاستدامة'],['schützen','يحمي'],['zerstören','يدمّر'],
         ['der Wald','الغابة'],['abholzen','يجتثّ']],
    gram:{t:'Mots composés — le genre vient du DERNIER élément',
      b:['<span class="de-in">die Umwelt + der Schutz → <b>der</b> Umweltschutz</span>',
         '<span class="de-in">das Klima + der Wandel → <b>der</b> Klimawandel</span>',
         '<span class="de-in">das Wasser + die Knappheit → <b>die</b> Wasserknappheit</span>',
         'Soudure sans espace, parfois avec un <b>-s-</b> de liaison : '
       + '<span class="de-in">die Umwelt + verschmutz<b>ung</b> → die Umweltverschmutzung</span>',
         'Adjectifs : <span class="de-in">umwelt<b>freundlich</b> · energie<b>sparend</b> · '
       + 'klima<b>schädlich</b></span>'],
      tbl:[['der Umweltschutz','حماية البيئة'],['die Umweltverschmutzung','التلوث البيئي'],
           ['der Klimawandel','التغيّر المناخي'],['die Wasserknappheit','ندرة المياه'],
           ['die Solarenergie','الطاقة الشمسية'],['die Nachhaltigkeit','الاستدامة']],
      ex:'<span class="de-in">Der <b>Klimawandel</b> und die <b>Wasserknappheit</b> sind die '
       + 'größten Herausforderungen für Algerien.</span>'},
    exos:[{q:'Le genre de «die Wasserknappheit» vient de :',opts:['Wasser','Knappheit',
            'les deux','aucun'],a:1,why:'Le dernier élément donne le genre : <b>die</b> Knappheit.'},
          {q:'«الطاقات المتجددة» =',opts:['die neuen Energien','die erneuerbaren Energien',
            'die frischen Energien','die grünen Energien'],a:1,
           why:'Terme technique figé : <span class="de-in">die <b>erneuerbaren</b> Energien</span>.'},
          {q:'«Müll trennen» signifie :',opts:['يرمي النفايات','يفرز النفايات','يحرق النفايات',
            'يدفن النفايات'],a:1,why:'<span class="de-in">den Müll <b>trennen</b></span> = '
           + 'فرز النفايات لإعادة التدوير.'},
          {q:'«التصحر» =',opts:['die Wüste','die Wüstenbildung','die Trockenheit','der Sand'],
           a:1,why:'<span class="de-in">die Wüsten<b>bildung</b></span> (formation du désert).'},
          {q:'«umweltfreundlich» signifie :',opts:['مضرّ بالبيئة','صديق للبيئة','بعيد عن البيئة',
            'بدون بيئة'],a:1,why:'<span class="de-in">umwelt + <b>freundlich</b></span> = '
           + 'صديق للبيئة.'}]},

  { n:2, de:'Funktionsverbgefüge', ar:'التراكيب الاسمية-الفعلية', dur:60,
    obj:['registre soutenu exigé au BAC','verbe fixé + préposition imposée',
         'équivalence avec le verbe simple'],
    lex:[['Maßnahmen ergreifen','يتّخذ إجراءات'],['Schutz genießen','يتمتّع بحماية'],
         ['in Gefahr sein','في خطر'],['zur Verfügung stehen','تحت التصرّف'],
         ['zur Verfügung stellen','يضع تحت التصرّف'],['in Kauf nehmen','يقبل بـ'],
         ['Kritik üben an','ينتقد'],['zum Ausdruck bringen','يعبّر عن'],
         ['in Betracht ziehen','يأخذ بعين الاعتبار'],['zur Folge haben','يؤدي إلى'],
         ['Beachtung finden','يلقى اهتماماً'],['Verantwortung tragen','يتحمّل المسؤولية'],
         ['einen Beitrag leisten','يسهم'],['Einfluss nehmen auf','يؤثّر في']],
    gram:{t:'FVG = nom abstrait + verbe faible (le nom porte le sens)',
      tbl:[['kritisieren','Kritik üben an + Dat'],
           ['schützen','Schutz gewähren / genießen'],
           ['beeinflussen','Einfluss nehmen auf + Akk'],
           ['beitragen','einen Beitrag leisten zu + Dat'],
           ['verantworten','Verantwortung tragen für'],
           ['folgen','zur Folge haben'],
           ['ausdrücken','zum Ausdruck bringen'],
           ['berücksichtigen','in Betracht ziehen']],
      b:['Le verbe perd son sens plein : c’est le <b>nom</b> qui porte le sens.',
         'La préposition est <b>imposée</b> par la tournure : '
       + '<span class="de-in">Kritik üben <b>an</b> + Datif</span> · '
       + '<span class="de-in">Einfluss nehmen <b>auf</b> + Akkusativ</span> · '
       + '<span class="de-in">einen Beitrag leisten <b>zu</b> + Datif</span>.',
         'Équivalence : <span class="de-in">Man <b>kritisiert</b> die Politik</span> = '
       + '<span class="de-in">Man <b>übt Kritik an</b> der Politik</span>.',
         '⚠️ Le verbe est figé : <span class="de-in">~~eine Entscheidung machen~~</span> → '
       + '<span class="de-in">eine Entscheidung <b>treffen</b></span>.'],
      ex:'<span class="de-in">Der Staat muss <b>Maßnahmen ergreifen</b>, um die Umwelt zu '
       + 'schützen, und dabei die Kosten <b>in Kauf nehmen</b>.</span>'},
    exos:[{q:'«ينتقد السياسة» بتركيبة اسمية-فعلية :',
            opts:['Kritik üben an der Politik','Kritik machen an der Politik',
                  'Kritik geben der Politik','Kritik haben an der Politik'],a:0,
           why:'Verbe fixé = <b>üben</b> + <span class="de-in"><b>an</b> + Datif</span>.'},
          {q:'«يسهم في حماية البيئة» :',
            opts:['einen Beitrag leisten zum Umweltschutz',
                  'einen Beitrag machen für Umweltschutz','beitragen den Umweltschutz',
                  'einen Beitrag geben'],a:0,
           why:'<span class="de-in">einen Beitrag <b>leisten zu</b> + Datif</span>.'},
          {q:'«يأخذ بعين الاعتبار» :',opts:['in Betracht ziehen','in Betracht machen',
            'Betrachtung nehmen','Betracht ziehen'],a:0,
           why:'Tournure figée : <span class="de-in"><b>in Betracht ziehen</b></span>.'},
          {q:'«يتحمّل المسؤولية» :',opts:['Verantwortung tragen','Verantwortung haben',
            'Verantwortung machen','Verantwortung nehmen'],a:0,
           why:'<span class="de-in">Verantwortung <b>tragen für</b></span>.'},
          {q:'«يؤدي إلى» :',opts:['zur Folge haben','zur Folge sein','Folge machen',
            'Folge geben'],a:0,why:'<span class="de-in"><b>zur Folge haben</b></span>.'}]},

  { n:3, de:'Konzessivsätze und Passiversatz', ar:'الجمل التنازلية وبدائل المبني للمجهول', dur:60,
    obj:['obwohl / trotz / trotzdem / zwar…aber','sich lassen + Infinitiv','-bar / -lich',
         'Nominalisierung de la concession'],
    lex:[['obwohl','رغم أن'],['obgleich','مع أن'],['trotz','رغم (+ Genitiv)'],
         ['trotzdem','مع ذلك'],['dennoch','ومع ذلك'],['zwar … aber','صحيح… لكن'],
         ['sich lassen','يمكن (بديل المبني للمجهول)'],['-bar','قابل لـ'],['man','المرء / الناس']],
    gram:{t:'Concession + 3 substituts du Passiv',
      tbl:[['obwohl + subordonnée','Obwohl es regnet, gehen wir raus.'],
           ['trotz + Genitiv','Trotz des Regens gehen wir raus.'],
           ['trotzdem (position 1)','Es regnet, trotzdem gehen wir raus.'],
           ['zwar … aber','Es regnet zwar, aber wir gehen raus.'],
           ['sich lassen + Inf.','Das Problem lässt sich lösen. (= kann gelöst werden)'],
           ['-bar','Das Wasser ist trinkbar. (= kann getrunken werden)'],
           ['man + actif','Man kann das recyceln. (= Das kann recycelt werden)']],
      b:['<b>obwohl</b> → verbe à la fin · <b>trotzdem/dennoch</b> → position 1 + verbe en 2.',
         '<b>trotz</b> est une préposition + <b>Genitiv</b> : '
       + '<span class="de-in">trotz <b>des</b> Klimawandels</span>.',
         '<span class="de-in">sich lassen</span> et <b>-bar</b> remplacent élégamment le '
       + 'Passiv avec können.',
         'Nominalisierung : <span class="de-in">Obwohl es regnet</span> → '
       + '<span class="de-in">Trotz <b>des Regens</b></span>.'],
      ex:'<span class="de-in"><b>Obwohl</b> die Mülltrennung wichtig ist, wird sie selten '
       + 'praktiziert. <b>Trotzdem</b> <b>lässt sich</b> das Problem <b>lösen</b>.</span>'},
    exos:[{q:'«___ des Klimawandels steigt die Temperatur.»',opts:['Trotz','Obwohl','Weil',
            'Wenn'],a:0,why:'<span class="de-in"><b>trotz</b> + Genitiv</span>.'},
          {q:'«___ es regnet, gehen wir spazieren.»',opts:['Trotz','Obwohl','Wegen','Statt'],
           a:1,why:'<b>obwohl</b> + subordonnée (verbe à la fin).'},
          {q:'«Das Wasser ist ___ .» (potable)',opts:['trinkbar','trinklich','trinken',
            'getrunken'],a:0,why:'<b>-bar</b> = « qui peut être … » → substitut du Passiv.'},
          {q:'«Das Problem ___ sich leicht ___ .» (= peut être résolu)',
            opts:['lässt … lösen','lässt … gelöst','wird … lassen','kann … lassen'],a:0,
           why:'<span class="de-in"><b>sich lassen</b> + Infinitif</span> = kann gelöst werden.'},
          {q:'«Es ist kalt, ___ gehen wir schwimmen.»',opts:['trotzdem','obwohl','weil','um'],
           a:0,why:'<b>trotzdem</b> en position 1 → verbe en 2.'}]},

  { n:4, de:'Textverständnis : «Wasserknappheit in Algerien»',
    ar:'فهم نص — ندرة المياه في الجزائر', dur:60,
    obj:['texte documentaire chiffré','extraire les données','repérer FVG et Konzessivsätze',
         'répondre en phrases complètes'],
    texte:'<div class="reading"><p><b>Wasserknappheit in Algerien</b></p>'
        + '<p>Algerien ist eines der trockensten Länder der Welt. Mehr als 80 Prozent der '
        + 'Landesfläche bestehen aus Wüste, und die Niederschläge gehen seit Jahren zurück. '
        + 'Deshalb gilt die Wasserknappheit heute als eine der größten Herausforderungen des '
        + 'Landes.</p>'
        + '<p>Um die Versorgung zu sichern, werden große Investitionen getätigt. In den '
        + 'letzten Jahren wurden zahlreiche Meerwasserentsalzungsanlagen gebaut, vor allem an '
        + 'der Küste. Außerdem muss die Landwirtschaft modernisiert werden, denn sie '
        + 'verbraucht etwa 60 Prozent des verfügbaren Wassers.</p>'
        + '<p>Trotz dieser Maßnahmen bleibt die Situation schwierig. Obwohl viele Haushalte '
        + 'ans Netz angeschlossen sind, wird Wasser in manchen Regionen nur wenige Stunden pro '
        + 'Tag geliefert. Die alten Leitungen sind zudem oft undicht, sodass große Mengen '
        + 'verloren gehen.</p>'
        + '<p>Fachleute betonen, dass Technik allein nicht ausreicht. Es muss auch ein '
        + 'Bewusstsein geschaffen werden. Jeder Bürger kann einen Beitrag leisten, indem er '
        + 'Wasser spart und die Umwelt schützt. Die Verantwortung liegt also nicht nur beim '
        + 'Staat, sondern bei uns allen.</p></div>',
    exos:[{q:'Richtig oder Falsch : Mehr als 80 % der Landesfläche bestehen aus Wüste.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Mehr als 80 Prozent der Landesfläche bestehen aus Wüste.'
             + '</span>'},
          {q:'Richtig oder Falsch : Die Landwirtschaft verbraucht etwa 60 % des Wassers.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… denn sie verbraucht etwa 60 Prozent des verfügbaren '
             + 'Wassers.</span>'},
          {q:'Richtig oder Falsch : In allen Regionen wird Wasser rund um die Uhr geliefert.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… wird Wasser in manchen Regionen <b>nur wenige Stunden '
             + 'pro Tag</b> geliefert.</span>'},
          {q:'Richtig oder Falsch : Die Verantwortung liegt laut Text nur beim Staat.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Die Verantwortung liegt <b>nicht nur</b> beim Staat, '
             + 'sondern bei uns allen.</span>'},
          {q:'Nennen Sie zwei Maßnahmen zur Sicherung der Wasserversorgung.',type:'txt',
           why:'Meerwasserentsalzungsanlagen bauen + Landwirtschaft modernisieren.'},
          {q:'Welches Problem verursachen die alten Leitungen?',type:'txt',
           why:'<span class="de-in">… sind oft <b>undicht</b>, sodass große Mengen verloren '
             + 'gehen.</span>'},
          {q:'Relevez une tournure FVG du texte.',type:'txt',
           why:'<span class="de-in">Investitionen <b>tätigen</b> · einen Beitrag '
             + '<b>leisten</b> · ein Bewusstsein <b>schaffen</b></span>.'}]},

  { n:5, de:'Textproduktion — «Die Umwelt schützen»', ar:'إنتاج كتابي ✍️ حماية البيئة', dur:60,
    obj:['texte de sensibilisation 12-15 lignes','FVG + Konzessivsätze','Passiversatzformen',
         'structure argument + proposition'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً توعوياً من '
           + '<b>12 إلى 15 سطراً</b> بعنوان « كيف نحمي بيئتنا في الجزائر؟ » باحترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>3 تراكيب اسمية-فعلية</b> (Maßnahmen ergreifen · einen Beitrag leisten · '
           + 'Verantwortung tragen)</li>'
           + '<li><b>1 جملة تنازلية</b> بـ obwohl أو trotzdem</li>'
           + '<li><b>1 بديل للمبني للمجهول</b> (sich lassen … / -bar)</li>'
           + '<li><b>3 اقتراحات عملية</b> موجّهة للمواطن (man sollte / Wir müssen)</li>'
           + '<li><b>4 كلمات مركّبة</b> من مجال البيئة</li></ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Die Umweltverschmutzung ist eines der ernstesten Probleme unserer Zeit. Obwohl '
         + 'jeder weiß, wie wichtig die Natur ist, wird sie täglich zerstört. Trotzdem lässt '
         + 'sich die Situation verbessern, wenn alle mitmachen.</p>'
         + '<p>Zuerst muss der Staat Maßnahmen ergreifen. Die erneuerbaren Energien sollten '
         + 'stärker gefördert werden, besonders die Solarenergie, die in Algerien fast '
         + 'unbegrenzt verfügbar ist. Außerdem muss die Mülltrennung eingeführt werden, damit '
         + 'mehr Abfall recycelt werden kann.</p>'
         + '<p>Aber auch jeder Bürger kann einen Beitrag leisten. Wir sollten Wasser sparen, '
         + 'weil die Wasserknappheit trotz der Entsalzungsanlagen groß bleibt. Man sollte '
         + 'weniger Plastiktüten benutzen und öfter mit dem Bus fahren. Schließlich tragen die '
         + 'Schulen eine große Verantwortung: Umweltbildung muss im Unterricht einen festen '
         + 'Platz finden.</p>'
         + '<p>Zusammenfassend lässt sich sagen, dass der Umweltschutz keine Option ist, '
         + 'sondern eine Notwendigkeit. Die Verantwortung liegt bei uns allen — denn es gibt '
         + 'keinen zweiten Planeten.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب نصّك التوعوي هنا (سيصححه الأستاذ الافتراضي):',
           ph:'Die Umweltverschmutzung ist eines der …'}]},

  { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — ختام الفصل الثاني', dur:60,
    obj:['مراجعة شاملة للوحدة 12','مراجعة عرضية U10-U12','التقويم الذاتي','التحضير للبكالوريا'],
    ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 12 (/20) ══════════ */
const DEVOIR_U12 = {
  titre:'Évaluation — Einheit 12 : Umweltprobleme',
  unite:12, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Wasserknappheit in Algerien</b></p>'
        + '<p>Algerien ist eines der trockensten Länder der Welt. Mehr als 80 Prozent der '
        + 'Landesfläche bestehen aus Wüste, und die Niederschläge gehen seit Jahren zurück. '
        + 'Deshalb gilt die Wasserknappheit heute als eine der größten Herausforderungen des '
        + 'Landes.</p>'
        + '<p>Um die Versorgung zu sichern, werden große Investitionen getätigt. In den '
        + 'letzten Jahren wurden zahlreiche Meerwasserentsalzungsanlagen gebaut, vor allem an '
        + 'der Küste. Außerdem muss die Landwirtschaft modernisiert werden, denn sie '
        + 'verbraucht etwa 60 Prozent des verfügbaren Wassers.</p>'
        + '<p>Trotz dieser Maßnahmen bleibt die Situation schwierig. Obwohl viele Haushalte '
        + 'ans Netz angeschlossen sind, wird Wasser in manchen Regionen nur wenige Stunden pro '
        + 'Tag geliefert. Die alten Leitungen sind zudem oft undicht, sodass große Mengen '
        + 'verloren gehen.</p>'
        + '<p>Fachleute betonen, dass Technik allein nicht ausreicht. Es muss auch ein '
        + 'Bewusstsein geschaffen werden. Jeder Bürger kann einen Beitrag leisten, indem er '
        + 'Wasser spart und die Umwelt schützt. Die Verantwortung liegt also nicht nur beim '
        + 'Staat, sondern bei uns allen.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Mehr als 80 % der Landesfläche bestehen aus Wüste.',pts:1,
         rep:'Richtig',just:'<span class="de-in">Mehr als 80 Prozent … bestehen aus Wüste.'
           + '</span>'},
        {id:'I.2',type:'vf',t:'Die Landwirtschaft verbraucht etwa 60 % des Wassers.',pts:1,
         rep:'Richtig',just:'<span class="de-in">… verbraucht etwa 60 Prozent des verfügbaren '
           + 'Wassers.</span>'},
        {id:'I.3',type:'vf',t:'In allen Regionen wird Wasser rund um die Uhr geliefert.',pts:1,
         rep:'Falsch',just:'<span class="de-in">… nur wenige Stunden pro Tag geliefert.</span>'},
        {id:'I.4',type:'vf',t:'Die Verantwortung liegt laut Text nur beim Staat.',pts:1,
         rep:'Falsch',just:'<span class="de-in">… nicht nur beim Staat, sondern bei uns allen.'
           + '</span>'},
        {id:'I.5',type:'txt',t:'Nennen Sie zwei Maßnahmen zur Sicherung der Versorgung.',pts:2,
         rep:'Meerwasserentsalzungsanlagen bauen und die Landwirtschaft modernisieren.',
         key:['entsalzung','landwirtschaft','modernis'],just:'2ᵉ paragraphe.'},
        {id:'I.6',type:'txt',t:'Welches Problem verursachen die alten Leitungen?',pts:2,
         rep:'Sie sind oft undicht, sodass große Mengen Wasser verloren gehen.',
         key:['undicht','verloren'],just:'<span class="de-in">… oft <b>undicht</b>, sodass '
           + 'große Mengen verloren gehen.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«___ des Klimawandels steigt die Temperatur.»',
         opts:['Trotz','Obwohl','Weil','Wenn'],a:0,pts:1,
         why:'<span class="de-in"><b>trotz</b> + Genitiv</span>.'},
        {id:'II.2',type:'qcm',t:'«___ es regnet, gehen wir spazieren.»',
         opts:['Trotz','Obwohl','Wegen','Statt'],a:1,pts:1,
         why:'<b>obwohl</b> + subordonnée (verbe à la fin).'},
        {id:'II.3',type:'qcm',t:'«Das Problem ___ sich leicht ___ .» (peut être résolu)',
         opts:['lässt … lösen','lässt … gelöst','wird … lassen','kann … lassen'],a:0,pts:1,
         why:'<span class="de-in"><b>sich lassen</b> + Infinitif</span> = Passiversatz.'},
        {id:'II.4',type:'qcm',t:'«Kritik ___ der Politik ___ .» (exercer une critique)',
         opts:['üben an …','machen an …','geben der …','haben an …'],a:0,pts:1,
         why:'FVG figé : <span class="de-in">Kritik <b>üben an</b> + Datif</span>.'},
        {id:'II.5',type:'txt',t:'FVG pour «ينتقد» : «___ ___ an der Politik.»',pts:1,
         rep:'Kritik üben',key:['kritik üben','kritik'],
         just:'Le verbe fixé est <b>üben</b>, jamais machen.'},
        {id:'II.6',type:'txt',t:'Le genre de «der Umweltschutz» est masculin car le dernier '
           + 'élément est ___',pts:1,rep:'der Schutz',key:['schutz'],
         just:'Le genre d’un composé vient du dernier élément.'},
        {id:'II.7',type:'txt',t:'Nominalisez : «Obwohl es regnet, …» → «___ des Regens, …»',
         pts:1,rep:'Trotz',key:['trotz'],just:'obwohl + subordonnée → trotz + Genitiv.'},
        {id:'II.8',type:'txt',t:'Traduisez : «يجب على الدولة أن تتّخذ إجراءات»',pts:1,
         rep:'Der Staat muss Maßnahmen ergreifen.',key:['maßnahmen','ergreifen'],
         just:'FVG : <span class="de-in">Maßnahmen <b>ergreifen</b></span> + modal en 2ᵉ '
           + 'position.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'« كيف نحمي بيئتنا في الجزائر؟ » اكتب نصاً توعوياً من 12 سطراً : '
           + '3 تراكيب اسمية-فعلية، جملة تنازلية (obwohl/trotzdem)، بديل واحد للمبني '
           + 'للمجهول (sich lassen / -bar)، 3 اقتراحات عملية، و4 كلمات مركّبة بيئية.',
         grille:[['3 تراكيب اسمية-فعلية صحيحة','1.0'],['1 جملة تنازلية (obwohl/trotzdem)','0.5'],
                 ['1 بديل للمبني للمجهول','0.5'],['3 اقتراحات عملية (man sollte/Wir müssen)','0.5'],
                 ['4 كلمات مركّبة بيئية','0.5'],['بنية + خاتمة','0.5'],
                 ['إملاء + Majuscules + ترقيم','0.5']],
         modele:'<div class="reading"><p>Die Umweltverschmutzung ist eines der ernstesten '
           + 'Probleme unserer Zeit. Obwohl jeder weiß, wie wichtig die Natur ist, wird sie '
           + 'täglich zerstört. Trotzdem lässt sich die Situation verbessern.</p>'
           + '<p>Zuerst muss der Staat Maßnahmen ergreifen und die erneuerbaren Energien '
           + 'fördern. Aber auch jeder Bürger kann einen Beitrag leisten: Wir sollten Wasser '
           + 'sparen, weniger Plastiktüten benutzen und öfter mit dem Bus fahren. Die Schulen '
           + 'tragen eine große Verantwortung.</p>'
           + '<p>Zusammenfassend lässt sich sagen, dass der Umweltschutz keine Option ist, '
           + 'sondern eine Notwendigkeit.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U12 = {
  unite: 12,
  titre: 'التصحيح النموذجي — الوحدة 12 : Umweltprobleme',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Mehr als 80 % der Landesfläche = Wüste.' },
    { id:'I.2', reponse:'Richtig', justification:'Die Landwirtschaft verbraucht etwa 60 %.' },
    { id:'I.3', reponse:'Falsch', justification:'Nur wenige Stunden pro Tag in manchen Regionen.' },
    { id:'I.4', reponse:'Falsch', justification:'Nicht nur beim Staat, sondern bei uns allen.' },
    { id:'I.5', reponse:'Meerwasserentsalzungsanlagen bauen + Landwirtschaft modernisieren.', justification:'2ᵉ paragraphe.' },
    { id:'I.6', reponse:'Sie sind undicht, große Mengen gehen verloren.', justification:'3ᵉ paragraphe.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'Trotz', regle:'trotz + Genitiv' },
    { id:'II.2', reponse:'Obwohl', regle:'obwohl + subordonnée, verbe à la fin' },
    { id:'II.3', reponse:'lässt … lösen', regle:'sich lassen + Infinitiv = Passiversatz' },
    { id:'II.4', reponse:'üben an …', regle:'FVG : Kritik üben an + Datif' },
    { id:'II.5', reponse:'Kritik üben', regle:'verbe fixé = üben' },
    { id:'II.6', reponse:'der Schutz', regle:'genre du composé = genre du dernier élément' },
    { id:'II.7', reponse:'Trotz', regle:'obwohl → trotz + Genitiv (Nominalisierung)' },
    { id:'II.8', reponse:'Der Staat muss Maßnahmen ergreifen.', regle:'FVG + modal en position 2' }
  ],
  partie_III: {
    bareme: [['3 FVG','1.0'],['1 concession','0.5'],['1 Passiversatz','0.5'],
             ['3 propositions','0.5'],['4 mots composés','0.5'],['structure + Schluss','0.5'],
             ['orthographe','0.5']],
    modele: 'Die Umweltverschmutzung ist eines der ernstesten Probleme unserer Zeit. Obwohl '
          + 'jeder weiß, wie wichtig die Natur ist, wird sie täglich zerstört. Trotzdem '
          + 'lässt sich die Situation verbessern. Der Staat muss Maßnahmen ergreifen und '
          + 'die erneuerbaren Energien fördern. Jeder Bürger kann einen Beitrag leisten: '
          + 'Wasser sparen, weniger Plastiktüten benutzen, öfter mit dem Bus fahren. '
          + 'Der Umweltschutz ist keine Option, sondern eine Notwendigkeit.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 12 🔁' }
  },
  erreurs_frequentes: [
    '~~Kritik machen an~~ → le verbe fixé est <b>üben</b> : Kritik <b>üben an</b> + Datif.',
    '~~eine Entscheidung machen~~ → eine Entscheidung <b>treffen</b>.',
    '~~trotz dem Klimawandel~~ → <b>trotz des Klimawandels</b> (Genitiv).',
    '~~obwohl es regnet nicht~~ → la négation reste dans la subordonnée : '
    + '<b>obwohl es nicht regnet</b>.',
    '~~Das lässt sich lösen das Problem~~ → ordre : Das Problem <b>lässt sich</b> lösen.',
    '~~der Umweltschütz~~ → <b>der Umweltschutz</b> (pas d’umlaut au singulier).',
    '~~Verantwortung haben für~~ → FVG correct : Verantwortung <b>tragen</b> für.',
    '~~Ich leiste ein Beitrag~~ → Akkusativ + zu : Ich leiste <b>einen</b> Beitrag '
    + '<b>zu</b> + Datif.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE12 = { meta: UNITE12_META, seances: SEANCES_U12, devoir: DEVOIR_U12,
                   corrige: CORRIGE_U12 };
