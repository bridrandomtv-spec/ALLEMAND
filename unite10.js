/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite10.js
   الوحدة 10 : Wissenschaft und Technologie — العلوم والتكنولوجيا
   6 حصص + فرض /20 (I/8 · II/8 · III/4) + تصحيح + 8 أخطاء شائعة
   Programme officiel MEN · 3AS · الفصل الثاني · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE10_META = {
  n: 10, de: 'Wissenschaft und Technologie', ar: 'العلوم والتكنولوجيا',
  niveau: '3AS', trimestre: 2, periode: 'ديسمبر — فيفري', duree_totale: 360, cecrl: 'B2',
  icon: '🔬',
  objectifs: ['التعبير عن التقدم العلمي وأثره','المبني للمجهول مع الأفعال الناقصة',
              'الجمل السببية والغائية','فهم نص وثائقي علمي','نص حجاجي 12-15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Wissenschaft','die Forschung','die Technologie','die Erfindung',
                    'die künstliche Intelligenz','der Fortschritt'],
  grammaire_cle: ['Passiv mit Modalverben','Kausal- und Finalsätze','Nominalisierung',
                  'Wortbildung (-ung, -schaft, -heit/-keit)']
};

const SEANCES_U10 = [
  { n:1, de:'Wortschatz: Wissenschaft und Technik', ar:'مفردات العلوم والتقنية', dur:60,
    obj:['تسمية مجالات العلم','من الفعل إلى الاسم','بناء الأسماء المركّبة'],
    lex:[['die Wissenschaft','العلم'],['der Wissenschaftler','العالم'],['die Forschung','البحث'],
         ['forschen','يبحث'],['die Erfindung','الاختراع'],['erfinden','يخترع'],
         ['die Technologie','التكنولوجيا'],['technisch','تقني'],['wissenschaftlich','علمي'],
         ['der Fortschritt','التقدّم'],['die künstliche Intelligenz','الذكاء الاصطناعي'],
         ['die Digitalisierung','الرقمنة'],['das Labor','المخبر'],['das Experiment','التجربة'],
         ['entdecken','يكتشف'],['die Entdeckung','الاكتشاف'],['entwickeln','يطوّر'],
         ['die Entwicklung','التطوير'],['die Energie','الطاقة'],['erneuerbar','متجدّد'],
         ['das Netzwerk','الشبكة'],['die Daten','البيانات']],
    gram:{t:'Nominalisierung — من الفعل إلى الاسم',
      b:['<b>-ung</b> : <span class="de-in">entwickeln → die Entwickl<b>ung</b></span> (toujours féminin)',
         '<b>-schaft</b> : <span class="de-in">die Wissen<b>schaft</b> · die Gesell<b>schaft</b></span>',
         '<b>-er</b> (agent) : <span class="de-in">forsch<b>en</b> → der Forsch<b>er</b></span>',
         '<b>-heit / -keit</b> : <span class="de-in">möglich → die Möglich<b>keit</b></span>',
         '⚠️ Genre d’un composé = genre du <b>dernier</b> élément : '
       + '<span class="de-in">das Labor + die Technik → <b>die</b> Labortechnik</span>'],
      tbl:[['entwickeln','die Entwicklung','le développement'],
           ['erfinden','die Erfindung','l’invention'],
           ['entdecken','die Entdeckung','la découverte'],
           ['forschen','die Forschung','la recherche'],
           ['möglich','die Möglichkeit','la possibilité']],
      ex:'<span class="de-in">Die <b>Entwicklung</b> der künstlichen Intelligenz ist eine '
       + 'große Herausforderung für die <b>Wissenschaft</b>.</span>'},
    exos:[{q:'Nom dérivé de «entwickeln» :',opts:['die Entwickelung','die Entwicklung',
            'das Entwickeln','der Entwickler'],a:1,
           why:'<span class="de-in">entwickeln → die Entwickl<b>ung</b></span> (féminin).'},
          {q:'Le genre de «die Labortechnik» vient de :',opts:['Labor','Technik','les deux',
            'aucun'],a:1,why:'Genre d’un composé = genre du <b>dernier</b> élément.'},
          {q:'«die Möglichkeit» est dérivé de :',opts:['möglich','mögen','macht','melden'],a:0,
           why:'<span class="de-in">möglich + <b>-keit</b></span>.'},
          {q:'«der Forscher» désigne :',opts:['la recherche','le chercheur','le laboratoire',
            'l’expérience'],a:1,why:'<b>-er</b> = agent : forschen → der Forscher.'}]},

  { n:2, de:'Passiv mit Modalverben', ar:'المبني للمجهول مع الأفعال الناقصة', dur:60,
    obj:['Passiv + modal','Vorgangs- vs Zustandspassiv',' omission de l’agent'],
    lex:[['Es muss geforscht werden.','يجب أن يُبحث.'],['Das kann gelöst werden.','يمكن حلّ ذلك.'],
         ['Hier darf nicht geraucht werden.','يُمنع التدخين هنا.'],
         ['Die Daten sollen geschützt werden.','يجب حماية البيانات.'],
         ['Das Problem ist gelöst.','المشكلة محلولة (حالة).'],
         ['Das Experiment wird durchgeführt.','تُجرى التجربة (عملية).']],
    gram:{t:'Passiv + Modal = Modal + Partizip II + werden',
      tbl:[['Präsens','Das muss gemacht werden.','يجب أن يُنجز'],
           ['Präteritum','Das musste gemacht werden.','كان يجب أن يُنجز'],
           ['Perfekt','Das hat gemacht werden müssen.','كان يجب إنجازه'],
           ['Zustandspassiv','Das ist gemacht.','إنه مُنجَز (حالة)']],
      b:['Le bloc <b>Partizip II + werden</b> va <b>toujours à la fin</b>.',
         '<span class="de-in">Vorgangspassiv</span> (werden) = action en cours · '
       + '<span class="de-in">Zustandspassiv</span> (sein) = état résultant.',
         'On omet l’agent quand il est inconnu : <span class="de-in">Hier <b>wurde</b> viel '
       + '<b>diskutiert</b>.</span>'],
      ex:'<span class="de-in">Die persönlichen Daten <b>müssen</b> unbedingt '
       + '<b>geschützt werden</b>.</span>'},
    exos:[{q:'«Das Problem ___ sofort gelöst ___ .»',opts:['muss … werden','muss … sein',
            'kann … sein','soll … worden'],a:0,
           why:'Modal + Partizip II + <b>werden</b> en fin de phrase.'},
          {q:'«Die Tür ist geöffnet.» signifie :',opts:['on ouvre la porte maintenant',
            'la porte est ouverte (état)','la porte fut ouverte hier','il faut ouvrir'],a:1,
           why:'<span class="de-in">sein + Partizip II</span> = <b>Zustandspassiv</b>.'},
          {q:'«Hier ___ nicht laut gesprochen ___ .» (interdiction)',
            opts:['darf … werden','kann … sein','muss … werden','soll … worden'],a:0,
           why:'Interdiction → <span class="de-in"><b>darf</b> nicht … <b>werden</b></span>.'},
          {q:'Passif de «Man entwickelt neue Software.» :',
            opts:['Neue Software wird entwickelt.','Neue Software entwickelt wird.',
                  'Wird neue Software entwickelt.','Neue Software ist entwickeln.'],a:0,
           why:'Sujet + werden (conjugué) + Partizip II à la fin.'}]},

  { n:3, de:'Kausal- und Finalsätze', ar:'الجمل السببية والغائية', dur:60,
    obj:['3 façons d’exprimer la cause','le but (damit / um…zu)','Nominalisierung'],
    lex:[['weil','لأن'],['da','بما أن'],['deshalb','لذلك'],['nämlich','أي'],['wegen','بسبب'],
         ['aufgrund','بناءً على'],['damit','لكي'],['um … zu','لكي'],['zwecks','بغرض'],
         ['infolge','نتيجة'],['aus diesem Grund','لهذا السبب']],
    gram:{t:'Cause et but — 5 structures',
      tbl:[['Cause (subordonnée)','weil / da','… weil ich krank bin.'],
           ['Cause (adverbe)','deshalb','Ich bin krank, deshalb bleibe ich.'],
           ['Cause (prép. + Gen.)','wegen / aufgrund','Wegen des Regens …'],
           ['But (subordonnée)','damit','… damit er gesund bleibt.'],
           ['But (infinitif)','um … zu','… um gesund zu bleiben.']],
      b:['<b>weil</b> et <b>damit</b> rejettent le verbe à la <b>fin</b>.',
         '<b>deshalb</b> en position 1 → verbe en 2 (inversion).',
         '<b>um … zu</b> exige le <b>même sujet</b> ; sinon → <b>damit</b>.',
         '<span class="de-in">Ich lerne Deutsch, <b>um</b> in Deutschland <b>zu</b> studieren.'
       + '</span> · <span class="de-in">Ich erkläre es, <b>damit</b> du es verstehst.</span>'],
      ex:'<span class="de-in"><b>Wegen</b> der Digitalisierung <b>müssen</b> viele Berufe '
       + 'neu gelernt <b>werden</b>.</span>'},
    exos:[{q:'«Ich lerne Deutsch, ___ ich in Berlin studieren möchte.»',
            opts:['weil','deshalb','um','wegen'],a:0,
           why:'Cause en subordonnée → <b>weil</b> (verbe à la fin).'},
          {q:'«Es regnet, ___ bleiben wir zu Hause.»',opts:['weil','deshalb','damit','um'],a:1,
           why:'<b>deshalb</b> en position 1 → inversion <span class="de-in">bleiben wir</span>.'},
          {q:'«___ des Wetters fiel das Experiment aus.»',opts:['Wegen','Weil','Damit',
            'Deshalb'],a:0,why:'<span class="de-in"><b>wegen</b> + Genitiv</span>.'},
          {q:'«Er arbeitet hart, ___ seine Familie zu ernähren.»',opts:['damit','um','weil',
            'dass'],a:1,why:'Même sujet → <span class="de-in"><b>um</b> … <b>zu</b></span>.'},
          {q:'Phrase correcte :',opts:['Ich lerne, um du mich verstehst.',
            'Ich lerne, damit du mich verstehst.','Ich lerne, um dass du mich verstehst.',
            'Ich lerne, weil du mich verstehst.'],a:1,
           why:'Sujets différents → <b>damit</b> (jamais <span class="de-in">um … dass</span>).'}]},

  { n:4, de:'Textverständnis : «Künstliche Intelligenz in der Schule»',
    ar:'فهم نص — الذكاء الاصطناعي في المدرسة', dur:60,
    obj:['texte documentaire argumentatif','thèse + arguments','repérer Passiv et connecteurs'],
    texte:'<div class="reading"><p><b>Künstliche Intelligenz in der Schule</b></p>'
        + '<p>In den letzten Jahren hat die künstliche Intelligenz (KI) fast alle Bereiche '
        + 'unseres Lebens verändert. Auch in der algerischen Schule wird inzwischen darüber '
        + 'diskutiert, ob KI den Unterricht verbessern kann.</p>'
        + '<p>Befürworter argumentieren, dass jeder Schüler individuell gefördert werden '
        + 'könne. Ein Programm erkennt sofort, welche Regeln ein Schüler nicht verstanden hat, '
        + 'und schlägt passende Übungen vor. Außerdem könnten Lehrer von routinehaften '
        + 'Aufgaben entlastet werden, weil Tests automatisch korrigiert werden können.</p>'
        + '<p>Kritiker warnen jedoch davor, dass der persönliche Kontakt zwischen Lehrer und '
        + 'Schüler verloren gehen könnte. Eine Maschine könne zwar Fehler finden, aber sie '
        + 'verstehe nicht, warum ein Schüler Schwierigkeiten hat. Zudem bestehe die Gefahr, '
        + 'dass persönliche Daten missbraucht werden.</p>'
        + '<p>Meiner Meinung nach ist die KI ein Werkzeug, kein Ersatz. Sie sollte dort '
        + 'eingesetzt werden, wo sie Zeit spart, aber die pädagogische Entscheidung muss beim '
        + 'Menschen bleiben. Wichtig ist, dass die Daten geschützt werden und dass alle '
        + 'Schüler Zugang zu dieser Technik haben — auch in den wilayas éloignées.</p></div>',
    exos:[{q:'Richtig oder Falsch : Die KI hat fast alle Lebensbereiche verändert.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… hat die KI fast alle Bereiche unseres Lebens '
             + 'verändert.</span>'},
          {q:'Richtig oder Falsch : Laut Befürwortern kann jeder Schüler individuell '
            + 'gefördert werden.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Befürworter argumentieren, dass jeder Schüler individuell '
             + 'gefördert werden könne.</span>'},
          {q:'Richtig oder Falsch : Eine Maschine versteht, warum ein Schüler Schwierigkeiten '
            + 'hat.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… sie <b>verstehe nicht</b>, warum ein Schüler '
             + 'Schwierigkeiten hat.</span>'},
          {q:'Richtig oder Falsch : Für den Autor ist die KI ein Ersatz für den Lehrer.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… ist die KI ein Werkzeug, <b>kein Ersatz</b>.</span>'},
          {q:'Nennen Sie zwei Vorteile der KI im Unterricht.',type:'txt',
           why:'Individuelle Förderung + Entlastung der Lehrer (automatische Korrektur).'},
          {q:'Welche Bedingung nennt der Autor für die wilayas éloignées?',type:'txt',
           why:'<span class="de-in">… dass <b>alle</b> Schüler Zugang zu dieser Technik haben.'
             + '</span>'},
          {q:'Relevez deux verbes au Passiv dans le texte.',type:'txt',
           why:'<span class="de-in">wird … diskutiert · können korrigiert werden · sollte '
             + 'eingesetzt werden · müssen geschützt werden</span>.'}]},

  { n:5, de:'Textproduktion — «Fortschritt: Chance oder Gefahr?»',
    ar:'إنتاج كتابي ✍️ التقدّم : فرصة أم خطر؟', dur:60,
    obj:['texte argumentatif 12-15 lignes','Passiv + Modal','weil/damit/um…zu','Redemittel'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> « التقدّم التكنولوجي : فرصة '
           + 'أم خطر؟ » اكتب نصاً حجاجياً من <b>12 إلى 15 سطراً</b> باحترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>3 جمل بالمبني للمجهول</b> مع فعل ناقص (muss/kann/soll … werden)</li>'
           + '<li><b>2 سبب</b> (weil / wegen + Genitiv) و<b>1 غاية</b> (damit / um … zu)</li>'
           + '<li>حجتان <b>مع</b> وحجتان <b>ضد</b> + رأيك الشخصي (Meiner Meinung nach…)</li>'
           + '<li><b>3 تراكيب اسمية-فعلية</b> (eine Entscheidung treffen · in Betracht ziehen '
           + '· zum Ausdruck bringen)</li>'
           + '<li>بنية واضحة : Einleitung → Hauptteil → Schluss</li></ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>In den letzten Jahren wird überall über den technologischen Fortschritt '
         + 'diskutiert. Manche halten ihn für eine große Chance, andere sehen darin eine '
         + 'ernste Gefahr.</p>'
         + '<p>Einerseits bringt der Fortschritt viele Vorteile. Krankheiten können heute '
         + 'früher erkannt werden, weil moderne Geräte genauer arbeiten. In der Schule können '
         + 'Schüler individuell gefördert werden, damit niemand zurückbleibt. Außerdem muss '
         + 'weniger schwere körperliche Arbeit geleistet werden.</p>'
         + '<p>Andererseits gibt es Risiken. Persönliche Daten müssen unbedingt geschützt '
         + 'werden, sonst könnten sie missbraucht werden. Viele Menschen verlieren ihre '
         + 'Arbeit, weil Maschinen sie ersetzen. In Algerien kommt dazu, dass nicht alle '
         + 'Regionen über eine gute Internetverbindung verfügen.</p>'
         + '<p>Meiner Meinung nach ist der Fortschritt weder gut noch schlecht an sich. '
         + 'Die Politik muss klare Regeln aufstellen, damit die Technik dem Menschen dient — '
         + 'und nicht umgekehrt.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب نصّك الحجاجي هنا (سيصححه الأستاذ الافتراضي):',
           ph:'In den letzten Jahren wird über … diskutiert. Einerseits … Andererseits …'}]},

  { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — فرض الوحدة 10', dur:60,
    obj:['مراجعة شاملة','التقويم الذاتي','التصحيح الجماعي','التحضير للبكالوريا'],
    ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 10 (/20) ══════════ */
const DEVOIR_U10 = {
  titre:'Évaluation — Einheit 10 : Wissenschaft und Technologie',
  unite:10, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Künstliche Intelligenz in der Schule</b></p>'
        + '<p>In den letzten Jahren hat die künstliche Intelligenz (KI) fast alle Bereiche '
        + 'unseres Lebens verändert. Auch in der algerischen Schule wird inzwischen darüber '
        + 'diskutiert, ob KI den Unterricht verbessern kann.</p>'
        + '<p>Befürworter argumentieren, dass jeder Schüler individuell gefördert werden '
        + 'könne. Ein Programm erkennt sofort, welche Regeln ein Schüler nicht verstanden hat, '
        + 'und schlägt passende Übungen vor. Außerdem könnten Lehrer von routinehaften '
        + 'Aufgaben entlastet werden, weil Tests automatisch korrigiert werden können.</p>'
        + '<p>Kritiker warnen jedoch davor, dass der persönliche Kontakt verloren gehen '
        + 'könnte. Eine Maschine könne zwar Fehler finden, aber sie verstehe nicht, warum ein '
        + 'Schüler Schwierigkeiten hat. Zudem bestehe die Gefahr, dass persönliche Daten '
        + 'missbraucht werden.</p>'
        + '<p>Meiner Meinung nach ist die KI ein Werkzeug, kein Ersatz. Sie sollte dort '
        + 'eingesetzt werden, wo sie Zeit spart, aber die pädagogische Entscheidung muss beim '
        + 'Menschen bleiben. Wichtig ist, dass alle Schüler Zugang zu dieser Technik haben — '
        + 'auch in den wilayas éloignées.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Die KI hat fast alle Bereiche unseres Lebens verändert.',pts:1,
         rep:'Richtig',just:'<span class="de-in">… hat die KI fast alle Bereiche … verändert.'
           + '</span>'},
        {id:'I.2',type:'vf',t:'Laut Befürwortern können Lehrer entlastet werden.',pts:1,
         rep:'Richtig',just:'<span class="de-in">… könnten Lehrer … entlastet werden.</span>'},
        {id:'I.3',type:'vf',t:'Eine Maschine versteht, warum ein Schüler Schwierigkeiten hat.',
         pts:1,rep:'Falsch',just:'<span class="de-in">… sie <b>verstehe nicht</b>, warum …'
           + '</span>'},
        {id:'I.4',type:'vf',t:'Für den Autor ist die KI ein Ersatz für den Lehrer.',pts:1,
         rep:'Falsch',just:'<span class="de-in">… ein Werkzeug, <b>kein Ersatz</b>.</span>'},
        {id:'I.5',type:'txt',t:'Nennen Sie zwei Vorteile der KI im Unterricht.',pts:2,
         rep:'Individuelle Förderung und Entlastung der Lehrer durch automatische Korrektur.',
         key:['förderung','entlast','korrigiert','individuell'],just:'2ᵉ paragraphe.'},
        {id:'I.6',type:'txt',t:'Welche Bedingung nennt der Autor am Schluss?',pts:2,
         rep:'Alle Schüler müssen Zugang zu dieser Technik haben, auch in den wilayas éloignées.',
         key:['zugang','wilayas','alle schüler'],just:'Dernier paragraphe.'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Die Daten ___ geschützt ___ .» (doivent être)',
         opts:['müssen … werden','müssen … sein','können … worden','sollen … sein'],a:0,pts:1,
         why:'Passiv + Modal : müssen + Partizip II + <b>werden</b> à la fin.'},
        {id:'II.2',type:'qcm',t:'«Ich lerne Deutsch, ___ ich in Berlin studieren möchte.»',
         opts:['weil','deshalb','um','wegen'],a:0,pts:1,why:'Cause en subordonnée → <b>weil</b>.'},
        {id:'II.3',type:'qcm',t:'«___ des Wetters fiel das Experiment aus.»',
         opts:['Wegen','Weil','Damit','Deshalb'],a:0,pts:1,
         why:'<span class="de-in"><b>wegen</b> + Genitiv</span>.'},
        {id:'II.4',type:'qcm',t:'«Er arbeitet hart, ___ seine Familie zu ernähren.»',
         opts:['damit','um','weil','dass'],a:1,pts:1,why:'Même sujet → <b>um … zu</b>.'},
        {id:'II.5',type:'txt',t:'Nominalisez : «Weil es regnet, …» → «___ des Regens, …»',
         pts:1,rep:'Wegen',key:['wegen'],just:'weil + subordonnée → <b>wegen</b> + Genitiv.'},
        {id:'II.6',type:'txt',t:'Nom dérivé de «entwickeln» :',pts:1,rep:'die Entwicklung',
         key:['entwicklung'],just:'<b>-ung</b>, toujours féminin.'},
        {id:'II.7',type:'txt',t:'Mettez au Passiv : «Man korrigiert die Tests automatisch.»',
         pts:1,rep:'Die Tests werden automatisch korrigiert.',key:['werden','korrigiert'],
         just:'Sujet + werden + complément + Partizip II à la fin.'},
        {id:'II.8',type:'txt',t:'Traduisez : «يجب حماية البيانات»',pts:1,
         rep:'Die Daten müssen geschützt werden.',key:['müssen','geschützt','werden'],
         just:'Passiv + Modal : müssen + Partizip II + werden.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'« التقدّم التكنولوجي : فرصة أم خطر؟ » اكتب نصاً حجاجياً من 12 سطراً : '
           + '3 جمل بالمبني للمجهول مع فعل ناقص، سببان (weil/wegen)، غاية (damit أو um…zu)، '
           + 'حجتان مع وحجتان ضد، ورأيك الشخصي.',
         grille:[['3 جمل Passiv + Modalverben','1.0'],['2 سبب + 1 غاية','0.5'],
                 ['حجتان مع + حجتان ضد','1.0'],['Meiner Meinung nach + رأي مبرَّر','0.5'],
                 ['3 تراكيب اسمية-فعلية أو مفردات الوحدة','0.5'],['بنية + ترقيم','0.25'],
                 ['إملاء و Majuscules','0.25']],
         modele:'<div class="reading"><p>In den letzten Jahren wird überall über den '
           + 'technologischen Fortschritt diskutiert. Einerseits können Krankheiten früher '
           + 'erkannt werden, weil moderne Geräte genauer arbeiten. Schüler können individuell '
           + 'gefördert werden, damit niemand zurückbleibt.</p><p>Andererseits müssen '
           + 'persönliche Daten geschützt werden, sonst könnten sie missbraucht werden. Viele '
           + 'Menschen verlieren ihre Arbeit, weil Maschinen sie ersetzen.</p><p>Meiner '
           + 'Meinung nach ist der Fortschritt weder gut noch schlecht an sich. Die Politik '
           + 'muss klare Regeln aufstellen, damit die Technik dem Menschen dient.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U10 = {
  unite: 10,
  titre: 'التصحيح النموذجي — الوحدة 10 : Wissenschaft und Technologie',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'… hat die KI fast alle Bereiche verändert.' },
    { id:'I.2', reponse:'Richtig', justification:'… könnten Lehrer entlastet werden.' },
    { id:'I.3', reponse:'Falsch', justification:'… sie verstehe NICHT, warum ein Schüler Schwierigkeiten hat.' },
    { id:'I.4', reponse:'Falsch', justification:'… ist die KI ein Werkzeug, kein Ersatz.' },
    { id:'I.5', reponse:'Individuelle Förderung + Entlastung der Lehrer (automatische Korrektur).', justification:'2ᵉ paragraphe.' },
    { id:'I.6', reponse:'Alle Schüler müssen Zugang haben, auch in den wilayas éloignées.', justification:'Dernier paragraphe.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'müssen … werden', regle:'Passiv + Modal : werden à la fin' },
    { id:'II.2', reponse:'weil', regle:'cause en subordonnée → verbe à la fin' },
    { id:'II.3', reponse:'Wegen', regle:'wegen + Genitiv' },
    { id:'II.4', reponse:'um', regle:'même sujet → um … zu' },
    { id:'II.5', reponse:'Wegen', regle:'weil → wegen + Genitiv (Nominalisierung)' },
    { id:'II.6', reponse:'die Entwicklung', regle:'-ung, toujours féminin' },
    { id:'II.7', reponse:'Die Tests werden automatisch korrigiert.', regle:'Passiv Präsens' },
    { id:'II.8', reponse:'Die Daten müssen geschützt werden.', regle:'Passiv + müssen' }
  ],
  partie_III: {
    bareme: [['3 Passiv + Modal','1.0'],['2 causes + 1 but','0.5'],['2 pour + 2 contre','1.0'],
             ['opinion justifiée','0.5'],['3 FVG / vocabulaire U10','0.5'],
             ['structure + ponctuation','0.25'],['orthographe','0.25']],
    modele: 'In den letzten Jahren wird überall über den technologischen Fortschritt diskutiert. '
          + 'Einerseits können Krankheiten früher erkannt werden, weil moderne Geräte genauer '
          + 'arbeiten. Schüler können individuell gefördert werden, damit niemand zurückbleibt. '
          + 'Andererseits müssen persönliche Daten geschützt werden, sonst könnten sie '
          + 'missbraucht werden. Meiner Meinung nach ist der Fortschritt weder gut noch '
          + 'schlecht an sich. Die Politik muss klare Regeln aufstellen, damit die Technik '
          + 'dem Menschen dient.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 10 🔁' }
  },
  erreurs_frequentes: [
    '~~Die Daten müssen geschützt~~ → Passiv + Modal exige <b>werden</b> : '
    + 'Die Daten müssen geschützt <b>werden</b>.',
    '~~weil ich bin krank~~ → le verbe va à la fin : weil ich krank <b>bin</b>.',
    '~~wegen dem Wetter~~ (registre soutenu) → <b>wegen des Wetters</b> (Genitiv).',
    '~~Ich lerne, um du mich verstehst~~ → sujets différents → <b>damit</b> du mich verstehst.',
    '~~um … dass~~ → cette combinaison n’existe pas : <b>um … zu</b> OU <b>damit</b>.',
    '~~die Entwicklung des Forschung~~ → génitif : die Entwicklung <b>der Forschung</b>.',
    '~~Man muss die Daten zu schützen~~ → après un modal, infinitif simple : die Daten '
    + '<b>schützen</b>.',
    '~~Das Tür ist geöffnet worden~~ → genre : <b>Die</b> Tür ist geöffnet worden.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE10 = { meta: UNITE10_META, seances: SEANCES_U10, devoir: DEVOIR_U10,
                   corrige: CORRIGE_U10 };
