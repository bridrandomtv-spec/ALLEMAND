/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite11.js
   الوحدة 11 : Wirtschaft und Arbeit — الاقتصاد والعمل
   6 حصص + فرض /20 (I/8 · II/8 · III/4) + تصحيح + 8 أخطاء شائعة
   Programme officiel MEN · 3AS · الفصل الثاني · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE11_META = {
  n: 11, de: 'Wirtschaft und Arbeit', ar: 'الاقتصاد والعمل',
  niveau: '3AS', trimestre: 2, periode: 'ديسمبر — فيفري', duree_totale: 360, cecrl: 'B2',
  icon: '💼',
  objectifs: ['التحدث عن عالم الشغل','Konjunktiv II للطلب المهذّب','الجمل الشرطية غير الحقيقية',
              'فهم نص اقتصادي','كتابة رسالة تحفيزية رسمية'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Wirtschaft','der Beruf','die Bewerbung','das Gehalt',
                    'die Arbeitslosigkeit','der Arbeitsmarkt'],
  grammaire_cle: ['Konjunktiv II (höfliche Bitten)','Irreale Bedingungssätze',
                  'Wortfeld «Arbeit»','Briefaufbau (Bewerbung)']
};

const SEANCES_U11 = [
  { n:1, de:'Wortschatz: Wirtschaft und Arbeitswelt', ar:'مفردات الاقتصاد وعالم الشغل', dur:60,
    obj:['تسمية المهن والقطاعات','مفردات التوظيف','الأجر والبطالة'],
    lex:[['die Wirtschaft','الاقتصاد'],['wirtschaftlich','اقتصادي'],['die Firma','الشركة'],
         ['das Unternehmen','المؤسسة'],['der Beruf','المهنة'],['beruflich','مهني'],
         ['die Arbeit','العمل'],['der Arbeiter','العامل'],['der Angestellte','الموظّف'],
         ['der Arbeitgeber','صاحب العمل'],['der Arbeitnehmer','الأجير'],
         ['die Bewerbung','طلب التوظيف'],['sich bewerben','يقدّم طلب توظيف'],
         ['der Lebenslauf','السيرة الذاتية'],['das Vorstellungsgespräch','مقابلة التوظيف'],
         ['die Stelle','المنصب'],['das Gehalt','الأجر'],['verdienen','يكسب'],
         ['kündigen','يفصل / يستقيل'],['die Arbeitslosigkeit','البطالة'],
         ['arbeitslos','عاطل عن العمل'],['der Arbeitsmarkt','سوق الشغل'],
         ['die Ausbildung','التكوين'],['die Erfahrung','الخبرة'],['erfahren','متمرس'],
         ['die Fähigkeit','المهارة'],['verantwortlich','مسؤول'],['die Verantwortung',
         'المسؤولية']],
    gram:{t:'Wortfeld «Arbeit» — عائلة كلمة واحدة',
      b:['<span class="de-in">arbeiten</span> (v.) → <span class="de-in">die Arbeit</span> (n.) '
       + '→ <span class="de-in">der Arbeiter</span> (agent) → <span class="de-in">arbeitslos</span> '
       + '(adj.) → <span class="de-in">die Arbeitslosigkeit</span> (n.)',
         'Genre d’un composé = genre du <b>dernier</b> élément : '
       + '<span class="de-in">die Arbeit + der Markt → <b>der</b> Arbeitsmarkt</span>',
         'Personnes : <b>-er</b> (m.) / <b>-in</b> (f.) → '
       + '<span class="de-in">der Arbeitgeber / die Arbeitgeber<b>in</b></span>',
         'Régime : <span class="de-in">sich bewerben <b>um</b> + Akkusativ</span> · '
       + '<span class="de-in">arbeiten <b>bei</b> + Datif</span> · '
       + '<span class="de-in">verantwortlich <b>für</b> + Akkusativ</span>'],
      tbl:[['arbeiten','die Arbeit','le travail'],
           ['sich bewerben','die Bewerbung','la candidature'],
           ['ausbilden','die Ausbildung','la formation'],
           ['verdienen','das Gehalt','le salaire'],
           ['kündigen','die Kündigung','le licenciement']],
      ex:'<span class="de-in">Auf dem <b>Arbeitsmarkt</b> sind <b>Erfahrung</b> und '
       + '<b>Fähigkeiten</b> wichtiger als je zuvor.</span>'},
    exos:[{q:'«عاطل عن العمل» (adjectif) =',opts:['arbeitslos','arbeitlos','arbeitsfrei',
            'ohne Arbeit'],a:0,why:'<span class="de-in"><b>arbeitslos</b></span> · nom : '
           + '<span class="de-in">die Arbeitslosigkeit</span>.'},
          {q:'Le genre de «der Arbeitsmarkt» vient de :',opts:['Arbeit','Markt','les deux',
            'aucun'],a:1,why:'Le dernier élément donne le genre : <b>der</b> Markt.'},
          {q:'Féminin de «der Arbeitgeber» :',opts:['die Arbeitgeberin','die Arbeitgeber',
            'das Arbeitgeber','die Arbeitgebin'],a:0,why:'<b>-in</b> au féminin.'},
          {q:'«sich bewerben ___ eine Stelle» :',opts:['um','für','auf','an'],a:0,
           why:'Régime figé : <span class="de-in">sich bewerben <b>um</b> + Akkusativ</span>.'},
          {q:'«das Gehalt» signifie :',opts:['le diplôme','le salaire','le contrat',
            'l’entretien'],a:1,why:'<span class="de-in">das Gehalt</span> = الأجر (mensuel).'}]},

  { n:2, de:'Konjunktiv II — höfliche Bitten', ar:'صيغة الافتراض — الطلب المهذّب', dur:60,
    obj:['الطلب بأدب في سياق مهني','wäre/hätte/könnte','würde + Infinitiv','الرد على عرض عمل'],
    lex:[['Könnten Sie mir bitte helfen?','هل يمكنك مساعدتي من فضلك؟'],
         ['Ich hätte gern weitere Informationen.','أرغب في معلومات إضافية.'],
         ['Würden Sie das bitte wiederholen?','هل تكرّر ذلك من فضلك؟'],
         ['Wäre es möglich, …?','هل من الممكن…؟'],
         ['Ich wäre Ihnen sehr dankbar.','سأكون ممتناً لك كثيراً.'],
         ['An Ihrer Stelle würde ich …','مكانك سأ…'],['Wenn ich Sie wäre, …','لو كنت مكانك…'],
         ['Ich würde mich freuen, wenn …','سيسعدني أن…']],
    gram:{t:'Konjunktiv II — 4 usages attendus au BAC',
      tbl:[['Politesse','Könnten / Würden Sie …?','Könnten Sie mir helfen?'],
           ['Souhait','Ich hätte gern …','Ich hätte gern einen Termin.'],
           ['Irréel','wäre / hätte / könnte','Wenn ich reich wäre, …'],
           ['Conseil','An deiner Stelle würde ich …','An deiner Stelle würde ich fragen.']],
      b:['Formes propres à mémoriser : <b>wäre</b> · <b>hätte</b> · <b>könnte</b> · '
       + '<b>müsste</b> · <b>dürfte</b> · <b>sollte</b>.',
         'Tous les autres verbes : <b>würde</b> + Infinitif '
       + '(<span class="de-in">Ich würde gern reisen</span>).',
         '⚠️ Jamais <span class="de-in">~~würde sein~~ / ~~würde haben~~</span> → '
       + '<b>wäre</b> / <b>hätte</b>.',
         'Formules de lettre : <span class="de-in">Ich <b>würde</b> mich freuen, wenn Sie '
       + 'mir eine Rückmeldung <b>geben</b> würden.</span> · '
       + '<span class="de-in">Ich <b>wäre</b> Ihnen sehr dankbar.</span>'],
      ex:'<span class="de-in"><b>Wäre</b> es möglich, das Vorstellungsgespräch auf Montag zu '
       + 'verschieben? Ich <b>wäre</b> Ihnen sehr dankbar.</span>'},
    exos:[{q:'Formule la PLUS polie pour demander un rendez-vous :',
            opts:['Ich will einen Termin.','Gib mir einen Termin.',
                  'Ich hätte gern einen Termin.','Ich brauche einen Termin.'],a:2,
           why:'<span class="de-in">Ich <b>hätte gern</b>…</span> = Konjunktiv II de haben.'},
          {q:'«___ Sie mir bitte die Stelle beschreiben?»',opts:['Könnten','Können','Konnten',
            'Kannst'],a:0,why:'Demande polie → <b>Könnten</b> (Konjunktiv II).'},
          {q:'«Wenn ich mehr Erfahrung ___, bekäme ich die Stelle.»',
            opts:['hätte','würde haben','haben','habe'],a:0,
           why:'<span class="de-in"><b>hätte</b></span> — jamais <b>würde haben</b>.'},
          {q:'«An deiner Stelle ___ ich die Bewerbung abschicken.»',
            opts:['würde','werde','will','soll'],a:0,
           why:'Conseil irréel → <span class="de-in"><b>würde</b> + Infinitif</span>.'},
          {q:'Réponse polie à «Könnten Sie später anrufen?» :',
            opts:['Nein!','Ja klar, kein Problem.','Muss ich nicht.','Ich nicht.'],a:1,
           why:'Registre professionnel : <span class="de-in">Ja klar, kein Problem.</span>'}]},

  { n:3, de:'Irreale Bedingungssätze', ar:'الجمل الشرطية غير الحقيقية', dur:60,
    obj:['irréel du présent','irréel du passé','ohne / sonst','le regret'],
    lex:[['Wenn ich Zeit hätte, …','لو كان لديّ وقت…'],['Hätte ich das gewusst, …',
         'لو علمت ذلك…'],['Ohne dich wäre ich verloren.','بدونك لكنت ضائعاً.'],
         ['Sonst hätte ich es geschafft.','وإلا لكنت نجحت.'],
         ['Ich wünschte, ich hätte mehr gelernt.','أتمنى لو درست أكثر.']],
    gram:{t:'Irréel présent vs irréel passé',
      tbl:[['Présent irréel','Wenn ich Zeit <b>hätte</b>, <b>würde</b> ich reisen.'],
           ['Passé irréel','Wenn ich Zeit <b>gehabt hätte</b>, <b>wäre</b> ich gereist.'],
           ['Sans wenn','<b>Hätte</b> ich Zeit, <b>würde</b> ich reisen. (inversion)'],
           ['ohne + Akk','<b>Ohne</b> dich <b>wäre</b> ich verloren.'],
           ['sonst','Ich hatte keine Zeit, <b>sonst wäre</b> ich gekommen.']],
      b:['Les <b>deux</b> propositions doivent être au Konjunktiv II — jamais de mélange '
       + 'avec l’indicatif.',
         'Passé irréel : <b>hätte/wäre + Partizip II</b> des deux côtés.',
         'Sans <span class="de-in">wenn</span>, le verbe passe en tête : '
       + '<span class="de-in"><b>Hätte</b> ich das gewusst, wäre ich geblieben.</span>',
         '<span class="de-in">ohne + Akkusativ</span> et <span class="de-in">sonst</span> '
       + 'remplacent élégamment la condition.'],
      ex:'<span class="de-in"><b>Wenn</b> ich besser Deutsch gelernt <b>hätte</b>, '
       + '<b>hätte</b> ich das Stipendium <b>bekommen</b>.</span>'},
    exos:[{q:'«Wenn ich reich ___, ___ ich um die Welt reisen.»',
            opts:['wäre … würde','bin … werde','war … wurde','würde … wäre'],a:0,
           why:'Irréel présent : <b>wäre</b> + <b>würde</b> + Infinitif.'},
          {q:'«Wenn du früher gekommen ___, ___ du ihn gesehen.»',
            opts:['wärst … hättest','bist … hast','warst … hattest','würdest … hättest'],a:0,
           why:'Irréel passé : <b>wärst</b> (sein) + <b>hättest</b> + Partizip II.'},
          {q:'Sans «wenn» : «___ ich das gewusst, wäre ich geblieben.»',
            opts:['Hätte','Habe','Würde','Wenn'],a:0,
           why:'Inversion : le verbe passe en tête → <b>Hätte</b> ich das gewusst, …'},
          {q:'«___ dich wäre ich verloren.»',opts:['Ohne','Wenn','Sonst','Weil'],a:0,
           why:'<span class="de-in"><b>Ohne</b> + Akkusativ</span> remplace la condition.'},
          {q:'«Ich hatte keine Zeit, ___ wäre ich gekommen.»',opts:['sonst','obwohl','weil',
            'damit'],a:0,why:'<span class="de-in"><b>sonst</b></span> = وإلا.'}]},

  { n:4, de:'Textverständnis : «Jugendarbeitslosigkeit in Algerien»',
    ar:'فهم نص — بطالة الشباب في الجزائر', dur:60,
    obj:['texte économique argumentatif','extraire chiffres et causes','repérer Konjunktiv II',
         'répondre en phrases complètes'],
    texte:'<div class="reading"><p><b>Jugendarbeitslosigkeit in Algerien</b></p>'
        + '<p>Die Arbeitslosigkeit junger Menschen ist eines der größten Probleme Algeriens. '
        + 'Nach offiziellen Angaben sind etwa 30 Prozent der Arbeitslosen zwischen 16 und 29 '
        + 'Jahre alt. Besonders betroffen sind Absolventen ohne praktische Erfahrung.</p>'
        + '<p>Es gibt mehrere Gründe dafür. Erstens entspricht die Ausbildung an den '
        + 'Universitäten nicht immer den Bedürfnissen des Arbeitsmarktes. Zweitens werden in '
        + 'vielen Betrieben keine neuen Stellen geschaffen, weil die Wirtschaft zu stark vom '
        + 'Erdöl abhängt. Drittens fehlen Informationen über freie Stellen.</p>'
        + '<p>Trotzdem gibt es Hoffnung. In den letzten Jahren wurden viele Start-ups '
        + 'gegründet, vor allem in Algier, Oran und Constantine. Junge Leute entwickeln Apps, '
        + 'liefern Waren oder bieten Dienstleistungen im Internet an. Außerdem wird die '
        + 'Berufsausbildung gefördert, damit Jugendliche ein konkretes Handwerk lernen '
        + 'können.</p>'
        + '<p>Wenn der Staat die kleinen Unternehmen stärker unterstützen würde, könnten '
        + 'tausende neue Arbeitsplätze geschaffen werden. Wichtig wäre auch, dass '
        + 'Fremdsprachen wie Deutsch besser unterrichtet würden — denn deutsche Firmen suchen '
        + 'in Algerien ständig qualifizierte Mitarbeiter.</p></div>',
    exos:[{q:'Richtig oder Falsch : Etwa 30 % der Arbeitslosen sind zwischen 16 und 29.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… etwa 30 Prozent … zwischen 16 und 29 Jahre alt.</span>'},
          {q:'Richtig oder Falsch : Die Wirtschaft hängt nur wenig vom Erdöl ab.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… weil die Wirtschaft <b>zu stark</b> vom Erdöl abhängt.'
             + '</span>'},
          {q:'Richtig oder Falsch : Start-ups wurden vor allem in Algier, Oran und Constantine '
            + 'gegründet.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… vor allem in Algier, Oran und Constantine.</span>'},
          {q:'Richtig oder Falsch : Deutsche Firmen suchen in Algerien keine Mitarbeiter.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… suchen … <b>ständig qualifizierte Mitarbeiter</b>.'
             + '</span>'},
          {q:'Nennen Sie drei Ursachen der Jugendarbeitslosigkeit.',type:'txt',
           why:'Ausbildung ≠ besoins du marché · keine neuen Stellen (Erdöl-Abhängigkeit) · '
             + 'fehlende Informationen über freie Stellen.'},
          {q:'Welche Bedingung nennt der Autor im letzten Absatz?',type:'txt',
           why:'<span class="de-in"><b>Wenn</b> der Staat die kleinen Unternehmen stärker '
             + 'unterstützen <b>würde</b>, <b>könnten</b> tausende Arbeitsplätze geschaffen '
             + 'werden.</span>'},
          {q:'Relevez deux verbes au Passiv.',type:'txt',
           why:'<span class="de-in">werden … geschaffen · wurden gegründet · wird gefördert · '
             + 'könnten geschaffen werden</span>.'}]},

  { n:5, de:'Textproduktion — «Meine Bewerbung»', ar:'إنتاج كتابي ✍️ طلب التوظيف', dur:60,
    obj:['lettre de motivation 12-15 lignes','Konjunktiv II de politesse',
         'structure officielle','compétences + expérience'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب <b>رسالة تحفيزية</b> '
           + 'من 12 إلى 15 سطراً للترشّح إلى تدريب (Praktikum) في شركة ألمانية بالجزائر، '
           + 'باحترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li>بنية الرسالة : Ort/Datum · Betreff · Anrede · Einleitung · Hauptteil · '
           + 'Schluss · Grußformel</li>'
           + '<li><b>3 صيغ Konjunktiv II</b> مهذّبة (Ich hätte gern… · Würden Sie…? · '
           + 'Ich wäre Ihnen dankbar)</li>'
           + '<li><b>1 جملة شرطية</b> (Wenn ich die Stelle bekäme, …)</li>'
           + '<li><b>3 مهارات</b> و<b>1 خبرة</b> مذكورة بدقة</li>'
           + '<li>الختام بـ <span class="de-in">Mit freundlichen Grüßen</span></li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Bouira, den 12. März 2027<br><b>Betreff: Bewerbung um ein Praktikum im '
         + 'Bereich Marketing</b></p>'
         + '<p>Sehr geehrte Damen und Herren,</p>'
         + '<p>mit großem Interesse habe ich Ihre Anzeige gelesen. Deshalb möchte ich mich '
         + 'um ein dreimonatiges Praktikum in Ihrer Firma bewerben.</p>'
         + '<p>Zurzeit besuche ich die dritte Klasse des Lycée Emir Abdelkader in Bouira, wo '
         + 'ich Deutsch als zweite Fremdsprache lerne. In den letzten zwei Jahren habe ich '
         + 'bereits Erfahrung gesammelt: Ich habe die Schulzeitung mitgestaltet und einen '
         + 'Kurs für soziale Medien besucht. Meine Stärken sind Zuverlässigkeit, '
         + 'Teamfähigkeit und gute Deutschkenntnisse (Niveau B1).</p>'
         + '<p>Wenn ich die Stelle bekäme, würde ich mich sehr freuen, praktische Erfahrung '
         + 'in einem internationalen Umfeld zu sammeln. Selbstverständlich stehe ich Ihnen '
         + 'auch für ein Vorstellungsgespräch jederzeit zur Verfügung.</p>'
         + '<p>Ich wäre Ihnen sehr dankbar, wenn Sie mir eine Rückmeldung geben würden.</p>'
         + '<p>Mit freundlichen Grüßen<br>Amine Brahimi</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب رسالتك التحفيزية هنا (سيصححها الأستاذ الافتراضي):',
           ph:'Sehr geehrte Damen und Herren, …'}]},

  { n:6, de:'Konsolidierung + Évaluation 📝', ar:'تثبيت وتقويم — فرض الوحدة 11', dur:60,
    obj:['مراجعة شاملة','التقويم الذاتي','التصحيح الجماعي','التحضير للبكالوريا'],
    ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 11 (/20) ══════════ */
const DEVOIR_U11 = {
  titre:'Évaluation — Einheit 11 : Wirtschaft und Arbeit',
  unite:11, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Jugendarbeitslosigkeit in Algerien</b></p>'
        + '<p>Die Arbeitslosigkeit junger Menschen ist eines der größten Probleme Algeriens. '
        + 'Nach offiziellen Angaben sind etwa 30 Prozent der Arbeitslosen zwischen 16 und 29 '
        + 'Jahre alt. Besonders betroffen sind Absolventen ohne praktische Erfahrung.</p>'
        + '<p>Es gibt mehrere Gründe dafür. Erstens entspricht die Ausbildung an den '
        + 'Universitäten nicht immer den Bedürfnissen des Arbeitsmarktes. Zweitens werden in '
        + 'vielen Betrieben keine neuen Stellen geschaffen, weil die Wirtschaft zu stark vom '
        + 'Erdöl abhängt. Drittens fehlen Informationen über freie Stellen.</p>'
        + '<p>Trotzdem gibt es Hoffnung. In den letzten Jahren wurden viele Start-ups '
        + 'gegründet, vor allem in Algier, Oran und Constantine. Außerdem wird die '
        + 'Berufsausbildung gefördert, damit Jugendliche ein konkretes Handwerk lernen '
        + 'können.</p>'
        + '<p>Wenn der Staat die kleinen Unternehmen stärker unterstützen würde, könnten '
        + 'tausende neue Arbeitsplätze geschaffen werden. Wichtig wäre auch, dass '
        + 'Fremdsprachen wie Deutsch besser unterrichtet würden — denn deutsche Firmen suchen '
        + 'in Algerien ständig qualifizierte Mitarbeiter.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Etwa 30 % der Arbeitslosen sind zwischen 16 und 29 Jahre alt.',
         pts:1,rep:'Richtig',just:'<span class="de-in">… etwa 30 Prozent … zwischen 16 und 29 '
           + 'Jahre alt.</span>'},
        {id:'I.2',type:'vf',t:'Die algerische Wirtschaft hängt nur wenig vom Erdöl ab.',pts:1,
         rep:'Falsch',just:'<span class="de-in">… weil die Wirtschaft <b>zu stark</b> vom '
           + 'Erdöl abhängt.</span>'},
        {id:'I.3',type:'vf',t:'Viele Start-ups wurden in Algier, Oran und Constantine gegründet.',
         pts:1,rep:'Richtig',just:'<span class="de-in">… vor allem in Algier, Oran und '
           + 'Constantine.</span>'},
        {id:'I.4',type:'vf',t:'Deutsche Firmen suchen in Algerien keine Mitarbeiter.',pts:1,
         rep:'Falsch',just:'<span class="de-in">… suchen … <b>ständig qualifizierte '
           + 'Mitarbeiter</b>.</span>'},
        {id:'I.5',type:'txt',t:'Nennen Sie drei Ursachen der Jugendarbeitslosigkeit.',pts:2,
         rep:'Die Ausbildung entspricht nicht dem Arbeitsmarkt; es werden keine neuen Stellen '
           + 'geschaffen; Informationen über freie Stellen fehlen.',
         key:['ausbildung','stellen','informationen','erdöl'],just:'2ᵉ paragraphe : '
           + 'erstens / zweitens / drittens.'},
        {id:'I.6',type:'txt',t:'Was wünscht sich der Autor im letzten Absatz?',pts:2,
         rep:'Dass der Staat kleine Unternehmen stärker unterstützt und Fremdsprachen wie '
           + 'Deutsch besser unterrichtet werden.',
         key:['staat','unternehmen','deutsch','unterstütz'],just:'Dernier paragraphe, '
           + 'au Konjunktiv II.'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«___ Sie mir bitte die Stelle beschreiben?»',
         opts:['Könnten','Können','Konnten','Kannst'],a:0,pts:1,
         why:'Demande polie → Konjunktiv II <b>Könnten</b>.'},
        {id:'II.2',type:'qcm',t:'«Wenn ich mehr Erfahrung ___, bekäme ich die Stelle.»',
         opts:['hätte','würde haben','haben','habe'],a:0,pts:1,
         why:'Jamais <b>würde haben</b> → forme propre <b>hätte</b>.'},
        {id:'II.3',type:'qcm',t:'«___ ich das gewusst, wäre ich geblieben.»',
         opts:['Hätte','Wenn','Würde','Habe'],a:0,pts:1,
         why:'Sans <b>wenn</b>, inversion : le verbe passe en tête.'},
        {id:'II.4',type:'qcm',t:'«___ dich wäre ich verloren.»',
         opts:['Ohne','Wenn','Sonst','Weil'],a:0,pts:1,
         why:'<span class="de-in"><b>ohne</b> + Akkusativ</span> remplace la condition.'},
        {id:'II.5',type:'txt',t:'Féminin de «der Arbeitgeber» :',pts:1,rep:'die Arbeitgeberin',
         key:['arbeitgeberin'],just:'<b>-in</b> pour la forme féminine.'},
        {id:'II.6',type:'txt',t:'«عاطل عن العمل» (adjectif) :',pts:1,rep:'arbeitslos',
         key:['arbeitslos'],just:'<span class="de-in">arbeitslos</span> · nom : '
           + 'die Arbeitslosigkeit.'},
        {id:'II.7',type:'txt',t:'Traduisez poliment : «أرغب في موعد»',pts:1,
         rep:'Ich hätte gern einen Termin.',key:['hätte gern','termin'],
         just:'Konjunktiv II de haben + Akkusativ masculin (einen Termin).'},
        {id:'II.8',type:'txt',t:'Complétez la formule de fin de lettre : «Mit freundlichen '
           + '___»',pts:1,rep:'Grüßen',key:['grüßen','grussen'],
         just:'Formule figée au Datif pluriel : <span class="de-in">Mit freundlichen '
           + '<b>Grüßen</b></span>.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب رسالة تحفيزية (12 سطراً) للترشّح إلى تدريب في شركة ألمانية : '
           + 'البنية الرسمية، 3 صيغ Konjunktiv II مهذّبة، جملة شرطية واحدة، '
           + 'و3 مهارات مع خبرة.',
         grille:[['بنية الرسالة (Ort/Datum · Betreff · Anrede · Schluss · Grußformel)','0.5'],
                 ['3 صيغ Konjunktiv II مهذّبة','1.0'],
                 ['1 جملة شرطية (Wenn … bekäme, würde …)','0.5'],
                 ['3 مهارات + خبرة محددة','0.5'],['3 مفردات الوحدة 11','0.5'],
                 ['إملاء + Majuscules + ترقيم','0.5'],['وضوح الأسلوب','0.5']],
         modele:'<div class="reading"><p>Bouira, den 12. März 2027<br>'
           + '<b>Betreff: Bewerbung um ein Praktikum</b></p>'
           + '<p>Sehr geehrte Damen und Herren, mit großem Interesse habe ich Ihre Anzeige '
           + 'gelesen. Zurzeit besuche ich die dritte Klasse des Lycée in Bouira. Ich habe '
           + 'bereits Erfahrung gesammelt und stehe Ihnen jederzeit zur Verfügung.</p>'
           + '<p>Wenn ich die Stelle bekäme, würde ich mich sehr freuen. Ich wäre Ihnen sehr '
           + 'dankbar, wenn Sie mir eine Rückmeldung geben würden.</p>'
           + '<p>Mit freundlichen Grüßen</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U11 = {
  unite: 11,
  titre: 'التصحيح النموذجي — الوحدة 11 : Wirtschaft und Arbeit',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'… etwa 30 Prozent … zwischen 16 und 29 Jahre alt.' },
    { id:'I.2', reponse:'Falsch', justification:'Die Wirtschaft hängt ZU STARK vom Erdöl ab.' },
    { id:'I.3', reponse:'Richtig', justification:'… vor allem in Algier, Oran und Constantine.' },
    { id:'I.4', reponse:'Falsch', justification:'Deutsche Firmen suchen STÄNDIG qualifizierte Mitarbeiter.' },
    { id:'I.5', reponse:'Ausbildung ≠ Arbeitsmarkt · keine neuen Stellen (Erdöl) · fehlende Informationen.', justification:'2ᵉ paragraphe : erstens/zweitens/drittens.' },
    { id:'I.6', reponse:'Mehr Unterstützung für kleine Unternehmen + besserer Fremdsprachenunterricht (Deutsch).', justification:'Dernier paragraphe, Konjunktiv II.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'Könnten', regle:'Konjunktiv II = politesse' },
    { id:'II.2', reponse:'hätte', regle:'jamais « würde haben »' },
    { id:'II.3', reponse:'Hätte', regle:'sans wenn → inversion' },
    { id:'II.4', reponse:'Ohne', regle:'ohne + Akkusativ remplace la condition' },
    { id:'II.5', reponse:'die Arbeitgeberin', regle:'-in au féminin' },
    { id:'II.6', reponse:'arbeitslos', regle:'adjectif figé ; nom = die Arbeitslosigkeit' },
    { id:'II.7', reponse:'Ich hätte gern einen Termin.', regle:'Konjunktiv II + Akkusativ masculin' },
    { id:'II.8', reponse:'Grüßen', regle:'Mit freundlichen Grüßen (Datif pluriel)' }
  ],
  partie_III: {
    bareme: [['structure lettre','0.5'],['3 Konjunktiv II','1.0'],['1 conditionnelle','0.5'],
             ['3 compétences + 1 expérience','0.5'],['3 mots U11','0.5'],
             ['orthographe + Majuscules','0.5'],['clarté du style','0.5']],
    modele: 'Bouira, den 12. März 2027. Betreff: Bewerbung um ein Praktikum im Bereich '
          + 'Marketing. Sehr geehrte Damen und Herren, mit großem Interesse habe ich Ihre '
          + 'Anzeige gelesen. Zurzeit besuche ich die dritte Klasse des Lycée in Bouira. '
          + 'Ich habe bereits Erfahrung gesammelt und stehe Ihnen jederzeit zur Verfügung. '
          + 'Wenn ich die Stelle bekäme, würde ich mich sehr freuen. Ich wäre Ihnen sehr '
          + 'dankbar, wenn Sie mir eine Rückmeldung geben würden. Mit freundlichen Grüßen.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 11 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich würde haben mehr Erfahrung~~ → <b>hätte</b> : Ich <b>hätte</b> mehr Erfahrung.',
    '~~Ich würde sein glücklich~~ → <b>wäre</b> : Ich <b>wäre</b> glücklich.',
    '~~Wenn ich hätte Zeit~~ → verbe à la fin : Wenn ich Zeit <b>hätte</b>.',
    '~~der Arbeitgeberin~~ → féminin = <b>die</b> Arbeitgeberin.',
    '~~die Arbeitslosung~~ → <b>die Arbeitslosigkeit</b> (-igkeit après adjectif en -los).',
    '~~Mit freundliche Grüße~~ → formule figée au Datif : Mit freundlich<b>en</b> Grüße<b>n</b>.',
    '~~Ich bewerbe mich für ein Praktikum~~ (registre) → <b>um</b> ein Praktikum '
    + '(sich bewerben um + Akk).',
    '~~zur Verfügung stellen mich~~ → <span class="de-in">Ich <b>stehe</b> Ihnen zur '
    + 'Verfügung</span> (je suis à votre disposition).'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE11 = { meta: UNITE11_META, seances: SEANCES_U11, devoir: DEVOIR_U11,
                   corrige: CORRIGE_U11 };
