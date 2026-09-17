/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite14.js
   3AS · الوحدة 14 : Globalisierung — العولمة
   6 حصص + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · 3AS · الفصل الثالث · CEFR B2
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE14_META = {
  n: 14, de: 'Globalisierung', ar: 'العولمة',
  niveau: '3AS', trimestre: 3, periode: 'مارس — أفريل', duree_totale: 360, cecrl: 'B2',
  icon: '🌐', cloture_trimestre: false,
  objectifs: ['تعريف العولمة ووصف مظاهرها','بناء حجج مؤيدة ومعارضة (Erörterung)',
              'استعمال أدوات الربط الثنائية','المبني للمجهول وبدائله في لغة الاقتصاد',
              'فهم نص حجاجي حول العولمة','إنتاج Erörterung من 15 سطراً'],
  competences: ['Hörverstehen','Leseverstehen','Sprechen','Schreiben'],
  vocabulaire_cle: ['die Globalisierung','der Welthandel','das Unternehmen','die Arbeitslosigkeit',
                    'der Lebensstandard','die Vielfalt'],
  grammaire_cle: ['Zweiteilige Konnektoren (zwar…aber · einerseits…andererseits · je…desto)',
                  'Passiv und Passiversatzformen','Nominalisierung / Verbalisierung',
                  'Relativsätze mit Präpositionen']
};

const SEANCES_U14 = [
  { n:1, de:'Was ist Globalisierung?', ar:'ما هي العولمة؟', dur:60,
    obj:['تعريف العولمة','مظاهرها الاقتصادية والثقافية','تحويل الأفعال إلى أسماء (Nominalisierung)'],
    lex:[['die Globalisierung','العولمة'],['der Welthandel','التجارة العالمية'],
         ['das Unternehmen','المؤسسة'],['die Firma','الشركة'],['der Konzern','المجمع الصناعي'],
         ['die Exporte / die Importe','الصادرات / الواردات'],['der Arbeitsmarkt','سوق العمل'],
         ['die Arbeitslosigkeit','البطالة'],['der Lebensstandard','مستوى المعيشة'],
         ['die Waren','السلع'],['die Dienstleistung','الخدمة'],['das Internet','الإنترنت'],
         ['die Kommunikation','التواصل'],['die Vielfalt','التنوع'],
         ['die Kluft zwischen Arm und Reich','الفجوة بين الأغنياء والفقراء'],
         ['weltweit','عالميّاً'],['grenzüberschreitend','عابر للحدود'],
         ['sich vernetzen','يترابط']],
    gram:{t:'Nominalisierung — parler de phénomènes avec des noms',
      b:['Les textes argumentatifs allemands préfèrent les <b>noms</b> aux verbes.',
         '<span class="de-in">Die Wirtschaft <b>wächst</b></span> → '
       + '<span class="de-in">das <b>Wachstum</b> der Wirtschaft</span>',
         '<span class="de-in">Die Länder <b>handeln</b> miteinander</span> → '
       + '<span class="de-in">der <b>Handel</b> zwischen den Ländern</span>',
         '<span class="de-in">weil die Welt zusammenwächst</span> → '
       + '<span class="de-in">wegen des <b>Zusammenwachsens</b> der Welt</span>',
         '⚠️ Tous les noms dérivés d’un infinitif sont <b>neutres</b> : '
       + '<span class="de-in"><b>das</b> Lernen · <b>das</b> Wachstum · <b>das</b> Zusammenwachsen</span>'],
      tbl:[['wachsen','das Wachstum'],['handeln','der Handel'],
           ['sich vernetzen','die Vernetzung'],['exportieren','der Export'],
           ['arbeiten','die Arbeit'],['zusammenarbeiten','die Zusammenarbeit']],
      ex:'<span class="de-in">Die <b>Globalisierung</b> bedeutet die zunehmende '
       + '<b>Vernetzung</b> der Wirtschaft und der Kulturen.</span>'},
    exos:[{q:'Nom correspondant à «zusammenarbeiten» :',
           opts:['die Zusammenarbeite','die Zusammenarbeit','das Zusammenarbeiten nur','der Zusammenarbeit'],a:1,
           why:'<span class="de-in">die <b>Zusammenarbeit</b></span> (féminin, sans -en).'},
          {q:'«Die Wirtschaft wächst.» → nominalisation :',
           opts:['das Wachsen der Wirtschaft','das Wachstum der Wirtschaft',
                 'die Wachstum der Wirtschaft','der Wachsen der Wirtschaft'],a:1,
           why:'Nom consacré : <span class="de-in">das <b>Wachstum</b></span> (neutre).'},
          {q:'Genre des noms dérivés d’un infinitif :',opts:['masculin','féminin','neutre','variable'],a:2,
           why:'<span class="de-in"><b>das</b> Lernen · <b>das</b> Lesen · <b>das</b> Leben</span> — toujours neutres.'},
          {q:'«grenzüberschreitend» signifie :',opts:['عابر للحدود','محلي','مغلق','مرتفع'],a:0,
           why:'<span class="de-in">die Grenze</span> (الحد) + <span class="de-in">überschreiten</span> (يتجاوز).'},
          {q:'«die Kluft zwischen Arm und Reich» =',
           opts:['التعاون بين الأغنياء والفقراء','الفجوة بين الأغنياء والفقراء',
                 'الطبقة الوسطى','النمو الاقتصادي'],a:1,
           why:'<span class="de-in">die Kluft</span> = الهوّة / الفجوة.'}]},

  { n:2, de:'Vor- und Nachteile — die Erörterung', ar:'المزايا والعيوب — المقال الحجاجي', dur:60,
    obj:['structure de l’Erörterung','formuler une thèse et un argument','illustrer par un exemple','Redemittel de l’argumentation'],
    lex:[['der Vorteil / der Nachteil','الميزة / العيب'],['das Argument','الحجة'],
         ['die These','الأطروحة'],['das Beispiel','المثال'],['der Beleg','الدليل'],
         ['befürworten','يؤيّد'],['ablehnen','يرفض'],['die Maßnahme','الإجراء'],
         ['Für die Globalisierung spricht, dass…','مما يؤيد العولمة أن…'],
         ['Gegen die Globalisierung spricht, dass…','مما يعارض العولمة أن…'],
         ['Ein wichtiges Argument ist…','حجة مهمة هي…'],
         ['Dies lässt sich am Beispiel … zeigen.','يمكن توضيح ذلك بمثال…']],
    gram:{t:'Architecture de l’Erörterung — These → Argument → Beispiel → Schluss',
      tbl:[['Einleitung','thème + problématique','Heutzutage wird viel über die Globalisierung diskutiert.'],
           ['Hauptteil (pro)','2-3 arguments développés','Dafür spricht, dass … Zum Beispiel …'],
           ['Hauptteil (contra)','2-3 arguments développés','Dagegen spricht, dass … Etwa …'],
           ['Schluss','bilan + opinion personnelle','Zusammenfassend lässt sich sagen, dass …']],
      b:['Chaque argument suit : <b>These</b> (idée) → <b>Begründung</b> (raison avec '
       + '<span class="de-in">weil/da</span>) → <b>Beispiel</b> (exemple concret).',
         'Ne jamais donner son avis dans l’introduction : il vient dans la <b>conclusion</b>.',
         'Trois arguments bien développés valent mieux que six arguments survolés.',
         'Sauter une ligne entre Einleitung, Hauptteil et Schluss (critère noté).'],
      ex:'<span class="de-in"><b>Dafür spricht</b>, dass der Welthandel Arbeitsplätze schafft. '
       + '<b>Das zeigt sich zum Beispiel</b> daran, dass viele algerische Firmen heute '
       + 'exportieren.</span>'},
    exos:[{q:'Où place-t-on son opinion personnelle dans une Erörterung ?',
           opts:['dans l’introduction','dans la conclusion','après chaque argument','nulle part'],a:1,
           why:'L’introduction pose le thème ; l’opinion arrive dans le <b>Schluss</b>.'},
          {q:'Formule pour introduire un argument favorable :',
           opts:['Gegen … spricht, dass','Dafür spricht, dass','Trotz …','Obwohl …'],a:1,
           why:'<span class="de-in"><b>Dafür spricht</b>, dass…</span> = مما يؤيد…'},
          {q:'Ordre correct d’un argument développé :',
           opts:['Exemple → Thèse → Raison','Thèse → Raison → Exemple',
                 'Raison → Exemple → Thèse','Exemple → Raison → Thèse'],a:1,
           why:'<b>These → Begründung (weil/da) → Beispiel/Beleg</b>.'},
          {q:'«Dies lässt sich am Beispiel Algeriens ___ .»',opts:['zeigen','sagen','machen','geben'],a:0,
           why:'Expression figée : <span class="de-in">am Beispiel <b>zeigen</b></span>.'},
          {q:'«befürworten» signifie :',opts:['يرفض','يؤيّد','يتجاهل','يؤجّل'],a:1,
           why:'<span class="de-in">befürworten</span> = يؤيّد · <span class="de-in">ablehnen</span> = يرفض.'},
          {q:'Connecteur de conclusion :',opts:['Einerseits','Zwar','Zusammenfassend','Je'],a:2,
           why:'<span class="de-in"><b>Zusammenfassend</b> lässt sich sagen, dass…</span>'}]},

  { n:3, de:'Zweiteilige Konnektoren', ar:'أدوات الربط الثنائية', dur:60,
    obj:['6 connecteurs bipartites','placement du verbe après chaque moitié','nuancer l’argumentation'],
    lex:[['zwar …, aber …','صحيح أن… لكن…'],['einerseits …, andererseits …','من جهة… ومن جهة أخرى…'],
         ['nicht nur …, sondern auch …','ليس فقط… بل أيضاً…'],['weder … noch …','لا… ولا…'],
         ['je …, desto/umso …','كلما… كلما…'],['entweder … oder …','إما… أو…'],
         ['sowohl … als auch …','كل من… و…']],
    gram:{t:'Placement du verbe — la différence décisive',
      tbl:[['zwar … aber','position 0','Zwar wächst der Handel, <b>aber</b> die Kluft <b>bleibt</b>.'],
           ['einerseits … andererseits','position 0','Einerseits schafft sie Jobs, andererseits '
            + '<b>zerstört</b> sie Traditionen.'],
           ['nicht nur … sondern auch','position 0','Sie betrifft nicht nur die Wirtschaft, '
            + 'sondern auch die Kultur.'],
           ['weder … noch','position 1 → inversion','Weder die Regierung noch die Firmen '
            + '<b>haben</b> eine Lösung.'],
           ['je … desto','je = verbe final · desto = verbe 2ᵉ','<b>Je</b> mehr wir handeln, '
            + '<b>desto</b> stärker <b>wird</b> der Wettbewerb.'],
           ['entweder … oder','position 0','Entweder wir öffnen uns, oder wir bleiben zurück.']],
      b:['⚠️ <b>weder … noch</b> et <b>entweder … oder</b> peuvent occuper la position 1 : '
       + 'le verbe reste alors en position 2 mais le <b>sujet passe après</b> (inversion).',
         '⚠️ <b>je … desto</b> : après <span class="de-in">je</span>, le verbe va à la '
       + '<b>fin</b> ; après <span class="de-in">desto</span>, il revient en <b>2ᵉ</b> position.',
         '~~nicht nur … aber auch~~ → la paire correcte est nicht nur … <b>sondern</b> auch.',
         'Accord du verbe avec <b>weder…noch</b> : au pluriel si les deux sujets sont pluriels.'],
      ex:'<span class="de-in"><b>Je</b> schneller die Waren transportiert <b>werden</b>, '
       + '<b>desto</b> günstiger <b>sind</b> sie für den Verbraucher.</span>'},
    exos:[{q:'«___ mehr wir exportieren, ___ stärker wird die Wirtschaft.»',
           opts:['Je … desto','Zwar … aber','Weder … noch','Entweder … oder'],a:0,
           why:'Proportionnalité → <b>je … desto</b>.'},
          {q:'«Die Globalisierung betrifft ___ nur die Wirtschaft, ___ auch die Kultur.»',
           opts:['nicht … sondern','zwar … aber','weder … noch','je … desto'],a:0,
           why:'<span class="de-in"><b>nicht nur … sondern auch</b></span>.'},
          {q:'«___ die Regierung ___ die Firmen haben eine fertige Lösung.» (ni… ni)',
           opts:['Weder … noch','Entweder … oder','Zwar … aber','Je … desto'],a:0,
           why:'<span class="de-in"><b>Weder … noch</b></span> = ni… ni.'},
          {q:'«Zwar wächst der Handel, ___ die Kluft bleibt.»',opts:['aber','sondern','noch','desto'],a:0,
           why:'<span class="de-in"><b>zwar …, aber</b></span> (concession).'},
          {q:'Après « je », le verbe se place :',opts:['en position 2','à la fin','en position 1','librement'],a:1,
           why:'<span class="de-in">je</span> introduit une subordonnée → verbe <b>final</b>.'},
          {q:'«Weder Ali ___ Omar spricht Deutsch.»',opts:['noch','sondern','aber','oder'],a:0,
           why:'La paire est figée : <b>weder … noch</b>.'}]},

  { n:4, de:'Passiv und Passiversatz in der Wirtschaft', ar:'المبني للمجهول وبدائله في لغة الاقتصاد', dur:60,
    obj:['Passiv aux 3 temps','complément d’agent von/durch','4 substituts du Passiv','registre administratif'],
    lex:[['Waren werden exportiert.','تُصدَّر السلع.'],['Arbeitsplätze werden geschaffen.','تُستحدث وظائف.'],
         ['Das Gesetz wurde verabschiedet.','صُوت على القانون.'],['Es wird viel diskutiert.','يُناقَش كثيراً.'],
         ['sich lassen + Infinitiv','يمكن (بدل المبني للمجهول)'],['-bar / -lich','قابل لـ'],
         ['sein + zu + Infinitiv','يجب / يمكن'],['man','المرء / الناس']],
    gram:{t:'Les 4 substituts du Passiv (Passiversatzformen)',
      tbl:[['Passiv','Das Problem kann gelöst werden.','يمكن حلّ المشكلة.'],
           ['sich lassen','Das Problem <b>lässt sich lösen</b>.','المشكلة قابلة للحلّ.'],
           ['-bar / -lich','Das Problem ist <b>lösbar</b>.','المشكلة قابلة للحلّ.'],
           ['sein + zu','Das Problem <b>ist zu lösen</b>.','يجب/يمكن حلّ المشكلة.'],
           ['man','<b>Man</b> kann das Problem lösen.','يمكن للناس حلّ المشكلة.']],
      b:['<b>Complément d’agent</b> : <span class="de-in"><b>von</b> + Datif</span> '
       + '(l’auteur) : <span class="de-in">Das Gesetz wurde <b>vom</b> Parlament '
       + 'verabschiedet.</span>',
         '<span class="de-in"><b>durch</b> + Akkusativ</span> (le moyen/la cause) : '
       + '<span class="de-in">Die Stadt wurde <b>durch</b> das Erdbeben zerstört.</span>',
         '<b>Passiv au Perfekt</b> : <span class="de-in">ist … <b>worden</b></span> '
       + '(et non ~~geworden~~).',
         '<b>sein + zu + Infinitiv</b> exprime tantôt la possibilité, tantôt l’obligation — '
       + 'le contexte tranche.'],
      ex:'<span class="de-in">Viele Waren <b>werden</b> heute online <b>bestellt</b>. '
       + 'Das <b>lässt sich</b> leicht <b>erklären</b>: die Preise <b>sind</b> oft günstiger '
       + 'und die Lieferung <b>ist</b> schnell <b>zu organisieren</b>.</span>'},
    exos:[{q:'«Das Problem lässt ___ lösen.»',opts:['sich','—','werden','zu'],a:0,
           why:'<span class="de-in"><b>sich lassen</b> + Infinitiv</span> = substitut du Passiv.'},
          {q:'«Das Gesetz wurde ___ Parlament verabschiedet.»',opts:['vom','durch das','mit dem','aus dem'],a:0,
           why:'Auteur de l’action → <span class="de-in"><b>von</b> + Datif</span> = <b>vom</b>.'},
          {q:'Passiv au Perfekt : «Das Haus ___ gebaut ___ .»',
           opts:['ist … worden','hat … geworden','wurde … worden','ist … geworden'],a:0,
           why:'<span class="de-in"><b>ist</b> … <b>worden</b></span> (jamais ~~geworden~~ au Passiv).'},
          {q:'«Die Aufgabe ist zu ___ .» (substitut du Passiv)',
           opts:['lösen','gelöst','gelöst werden','löst'],a:0,
           why:'<span class="de-in"><b>sein + zu + Infinitiv</b></span>.'},
          {q:'Adjectif en -bar signifiant « قابل للحلّ » :',opts:['lösbar','lösend','gelöst','löserisch'],a:0,
           why:'<span class="de-in">lös<b>bar</b></span> — suffixe de possibilité.'},
          {q:'«Die Stadt wurde ___ das Erdbeben zerstört.» (cause)',
           opts:['durch','von','mit','bei'],a:0,
           why:'Cause/moyen → <span class="de-in"><b>durch</b> + Akkusativ</span>.'}]},

  { n:5, de:'Textverständnis : «Globalisierung und Algerien»', ar:'فهم نص — العولمة والجزائر', dur:60,
    obj:['lire une Erörterung','repérer thèse/argument/exemple','distinguer connecteurs bipartites','répondre par phrase complète'],
    texte:'<div class="reading"><p><b>Globalisierung und Algerien</b></p>'
        + '<p>Heutzutage wird viel über die Globalisierung diskutiert. Manche betrachten sie '
        + 'als Chance, andere als Gefahr für die nationale Wirtschaft. Was bedeutet sie '
        + 'eigentlich? Darunter versteht man die zunehmende Vernetzung von Wirtschaft, '
        + 'Kultur und Kommunikation über die Grenzen hinweg.</p>'
        + '<p>Dafür spricht, dass der Welthandel Arbeitsplätze schafft. Algerische Unternehmen '
        + 'exportieren heute Datteln, Zement und Erdgas in mehr als hundert Länder. '
        + 'Je mehr exportiert wird, desto mehr Devisen fließen ins Land. Außerdem ermöglicht '
        + 'das Internet algerischen Studenten, an ausländischen Universitäten zu lernen, '
        + 'ohne ihre Heimat zu verlassen.</p>'
        + '<p>Dagegen spricht allerdings, dass kleine Betriebe dem Wettbewerb mit großen '
        + 'Konzernen nicht standhalten können. Zwar sind ausländische Waren oft billiger, '
        + 'aber lokale Produkte verschwinden dadurch vom Markt. Weder die Regierung noch die '
        + 'Unternehmen haben bisher eine vollständige Lösung gefunden. Kritiker befürchten '
        + 'auch, dass kulturelle Vielfalt verloren geht, wenn überall dieselben Marken '
        + 'verkauft werden.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass die Globalisierung weder gut noch '
        + 'schlecht an sich ist — es kommt darauf an, wie man sie gestaltet. Meiner Meinung '
        + 'nach sollte Algerien sich öffnen, aber gleichzeitig die eigene Produktion '
        + 'fördern. Nur so lässt sich die Kluft zwischen Arm und Reich verkleinern.</p></div>',
    exos:[{q:'Richtig oder Falsch : L’auteur considère la mondialisation comme uniquement positive.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… <b>weder gut noch schlecht</b> an sich ist</span> — il pèse '
           + 'le pour et le contre.'},
          {q:'Richtig oder Falsch : l’Algérie exporte dans plus de cent pays.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… in <b>mehr als hundert Länder</b>.</span>'},
          {q:'Richtig oder Falsch : les petites entreprises résistent bien aux grands groupes.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">… dass kleine Betriebe dem Wettbewerb … <b>nicht '
           + 'standhalten können</b>.</span>'},
          {q:'Richtig oder Falsch : le gouvernement a déjà trouvé une solution complète.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Weder die Regierung noch die Unternehmen haben <b>bisher '
           + 'keine vollständige Lösung</b> gefunden.</span>'},
          {q:'Quel connecteur bipartite exprime la proportionnalité ?',
           opts:['zwar … aber','je … desto','weder … noch','nicht nur … sondern auch'],a:1,
           why:'<span class="de-in"><b>Je</b> mehr exportiert wird, <b>desto</b> mehr Devisen '
           + 'fließen ins Land.</span>'},
          {q:'Quelle phrase contient un substitut du Passiv ?',
           opts:['Man diskutiert viel.','Nur so lässt sich die Kluft verkleinern.',
                 'Die Regierung hat keine Lösung.','Algerische Unternehmen exportieren.'],a:1,
           why:'<span class="de-in"><b>lässt sich</b> … verkleinern</span> = '
           + '<span class="de-in">sich lassen</span> + Infinitiv.'},
          {q:'Quels produits algériens sont cités ?',
           opts:['Dattes, ciment, gaz naturel','Blé, lait, huile','Voitures, téléphones, textiles',
                 'Poisson, fruits, légumes'],a:0,
           why:'<span class="de-in">Datteln, Zement und Erdgas</span>.'},
          {q:'L’opinion personnelle de l’auteur apparaît :',
           opts:['dans l’introduction','dans le 2ᵉ paragraphe','dans la conclusion','nulle part'],a:2,
           why:'<span class="de-in"><b>Meiner Meinung nach</b> sollte Algerien sich öffnen…</span> '
           + '— dans le Schluss.'}]},

  { n:6, de:'Textproduktion und Konsolidierung', ar:'إنتاج كتابي وتثبيت — العولمة فرصة أم خطر؟', dur:60,
    obj:['rédiger une Erörterung complète','2 arguments pro + 2 contra + Beispiel','3 connecteurs bipartites','Passiv ou substitut','révision transversale U14'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب مقالاً حجاجياً '
           + '(<b>Erörterung</b>) من <b>15 سطراً</b> حول موضوع : '
           + '<span class="de-in"><b>«Globalisierung — Chance oder Gefahr für Algerien?»</b></span>'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>Einleitung</b> : thème + problématique (sans opinion)</li>'
           + '<li><b>2 arguments POUR</b> : chacun avec These + Begründung (weil/da) + Beispiel</li>'
           + '<li><b>2 arguments CONTRE</b> : idem</li>'
           + '<li><b>3 connecteurs bipartites</b> différents '
           + '(zwar…aber · einerseits…andererseits · je…desto · weder…noch · nicht nur…sondern auch)</li>'
           + '<li><b>1 Passiv ou substitut</b> (sich lassen / -bar / sein+zu / man)</li>'
           + '<li><b>Schluss</b> : <span class="de-in">Zusammenfassend lässt sich sagen, dass…</span> '
           + '+ <span class="de-in">Meiner Meinung nach…</span></li>'
           + '</ul></div></div>',
    texte:'<div class="corrige"><h3>✅ Modellösung — نموذج الإجابة</h3><div class="reading">'
        + '<p>Heutzutage wird viel über die Globalisierung diskutiert. Ist sie für Algerien '
        + 'eine Chance oder eine Gefahr? Diese Frage lässt sich nicht mit einem einfachen '
        + 'Ja oder Nein beantworten.</p>'
        + '<p>Dafür spricht erstens, dass der Welthandel Arbeitsplätze schafft, weil '
        + 'algerische Unternehmen heute Datteln, Zement und Erdgas in mehr als hundert '
        + 'Länder exportieren. Je mehr exportiert wird, desto mehr Devisen fließen ins Land. '
        + 'Zweitens ermöglicht das Internet den Studenten, an ausländischen Universitäten '
        + 'zu lernen, ohne ihre Heimat zu verlassen.</p>'
        + '<p>Dagegen spricht allerdings, dass kleine Betriebe dem Wettbewerb mit großen '
        + 'Konzernen nicht standhalten können. Zwar sind ausländische Waren oft billiger, '
        + 'aber lokale Produkte verschwinden dadurch vom Markt. Außerdem befürchten viele, '
        + 'dass kulturelle Vielfalt verloren geht, wenn überall dieselben Marken verkauft '
        + 'werden.</p>'
        + '<p>Zusammenfassend lässt sich sagen, dass die Globalisierung weder gut noch '
        + 'schlecht an sich ist. Meiner Meinung nach sollte Algerien sich einerseits öffnen, '
        + 'andererseits aber die eigene Produktion fördern. Nur so kann die Kluft zwischen '
        + 'Arm und Reich verkleinert werden.</p></div></div>',
    exos:[{q:'Révision : «___ mehr wir exportieren, ___ mehr Devisen fließen ins Land.»',
           opts:['Je … desto','Zwar … aber','Weder … noch','Nicht nur … sondern'],a:0,
           why:'Proportionnalité → <b>je … desto</b>.'},
          {q:'Révision : «Das Gesetz wurde ___ Parlament verabschiedet.»',
           opts:['vom','durch','mit','aus'],a:0,
           why:'Auteur → <span class="de-in"><b>von</b> + Datif</span> = <b>vom</b>.'},
          {q:'Révision : substitut du Passiv avec «sich lassen» :',
           opts:['Das Problem lässt sich lösen.','Das Problem lässt lösen sich.',
                 'Das Problem wird lassen gelöst.','Sich lassen das Problem lösen.'],a:0,
           why:'<span class="de-in">sich lassen</span> + infinitif <b>final</b>.'},
          {q:'Révision : «Weder die Regierung ___ die Firmen haben eine Lösung.»',
           opts:['noch','sondern','aber','oder'],a:0,
           why:'Paire figée : <b>weder … noch</b>.'},
          {type:'texte',q:'✍️ Rédige ton Erörterung ici (correction automatique) :',
           ph:'Heutzutage wird viel über die Globalisierung diskutiert. Dafür spricht, dass…'}]},
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 14 (/20) ══════════ */
const DEVOIR_U14 = {
  titre:'Évaluation — Einheit 14 : Globalisierung',
  unite:14, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Globalisierung und Algerien</b></p>'
          + '<p>Heutzutage wird viel über die Globalisierung diskutiert. Manche betrachten '
          + 'sie als Chance, andere als Gefahr für die nationale Wirtschaft. Darunter versteht '
          + 'man die zunehmende Vernetzung von Wirtschaft, Kultur und Kommunikation über die '
          + 'Grenzen hinweg.</p>'
          + '<p>Dafür spricht, dass der Welthandel Arbeitsplätze schafft. Algerische '
          + 'Unternehmen exportieren heute Datteln, Zement und Erdgas in mehr als hundert '
          + 'Länder. Je mehr exportiert wird, desto mehr Devisen fließen ins Land. Außerdem '
          + 'ermöglicht das Internet algerischen Studenten, an ausländischen Universitäten '
          + 'zu lernen, ohne ihre Heimat zu verlassen.</p>'
          + '<p>Dagegen spricht allerdings, dass kleine Betriebe dem Wettbewerb mit großen '
          + 'Konzernen nicht standhalten können. Zwar sind ausländische Waren oft billiger, '
          + 'aber lokale Produkte verschwinden dadurch vom Markt. Weder die Regierung noch '
          + 'die Unternehmen haben bisher eine vollständige Lösung gefunden.</p>'
          + '<p>Zusammenfassend lässt sich sagen, dass die Globalisierung weder gut noch '
          + 'schlecht an sich ist — es kommt darauf an, wie man sie gestaltet. Meiner Meinung '
          + 'nach sollte Algerien sich öffnen, aber gleichzeitig die eigene Produktion '
          + 'fördern.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Der Autor hält die Globalisierung für nur positiv.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… weder gut noch schlecht an sich ist.</span>'},
        {id:'I.2',type:'vf',t:'Algerien exportiert in mehr als hundert Länder.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… in mehr als hundert Länder.</span>'},
        {id:'I.3',type:'vf',t:'Kleine Betriebe können dem Wettbewerb standhalten.',pts:1,rep:'Falsch',
         just:'<span class="de-in">… nicht standhalten können.</span>'},
        {id:'I.4',type:'vf',t:'Die Regierung hat schon eine vollständige Lösung.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Weder die Regierung noch die Unternehmen haben bisher eine '
              + 'vollständige Lösung gefunden.</span>'},
        {id:'I.5',type:'txt',t:'Was versteht man unter Globalisierung?',pts:2,
         rep:'Die zunehmende Vernetzung von Wirtschaft, Kultur und Kommunikation über die Grenzen hinweg.',
         key:['vernetzung','wirtschaft','kultur','grenzen'],
         just:'<span class="de-in">Darunter versteht man die zunehmende Vernetzung…</span>'},
        {id:'I.6',type:'txt',t:'Nennen Sie zwei exportierte algerische Produkte.',pts:2,
         rep:'Datteln, Zement und Erdgas.',key:['datteln','zement','erdgas'],
         just:'<span class="de-in">… exportieren heute Datteln, Zement und Erdgas.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«___ mehr wir exportieren, ___ mehr Devisen fließen ins Land.»',
         opts:['Je … desto','Zwar … aber','Weder … noch','Entweder … oder'],a:0,pts:1,
         why:'Proportionnalité → <b>je … desto</b>.'},
        {id:'II.2',type:'qcm',t:'«Das Problem lässt ___ lösen.»',
         opts:['sich','werden','zu','—'],a:0,pts:1,
         why:'Substitut du Passiv : <span class="de-in"><b>sich lassen</b> + Infinitiv</span>.'},
        {id:'II.3',type:'qcm',t:'«Das Gesetz wurde ___ Parlament verabschiedet.»',
         opts:['vom','durch','mit','aus'],a:0,pts:1,
         why:'Auteur de l’action → <span class="de-in"><b>von</b> + Datif</span>.'},
        {id:'II.4',type:'qcm',t:'Nominalisierung de «zusammenarbeiten» :',
         opts:['die Zusammenarbeit','das Zusammenarbeiten','der Zusammenarbeite','die Zusammenarbeite'],a:0,pts:1,
         why:'<span class="de-in">die <b>Zusammenarbeit</b></span>.'},
        {id:'II.5',type:'txt',t:'Complète : «Weder die Regierung ___ die Firmen.»',pts:1,rep:'noch',
         key:['noch'],just:'Paire figée : weder … noch.'},
        {id:'II.6',type:'txt',t:'Passiv au Perfekt : «Das Haus ist gebaut ___ .»',pts:1,rep:'worden',
         key:['worden'],just:'<span class="de-in">ist … <b>worden</b></span> (jamais geworden).'},
        {id:'II.7',type:'txt',t:'Traduis : «يمكن تقليص الفجوة» (substitut du Passiv)',pts:1,
         rep:'Die Kluft lässt sich verkleinern.',key:['lässt sich','verkleinern'],
         just:'<span class="de-in">sich lassen</span> + infinitif final.'},
        {id:'II.8',type:'txt',t:'Complète : «Nicht nur die Wirtschaft, ___ auch die Kultur.»',pts:1,
         rep:'sondern',key:['sondern'],
         just:'Paire figée : nicht nur … sondern auch.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب مقالاً حجاجياً (Erörterung) من 15 سطراً : '
           + '<span class="de-in">«Globalisierung — Chance oder Gefahr für Algerien?»</span> · '
           + 'مقدمة بدون رأي · حجّتان مؤيدتان وحجّتان معارضتان (كل حجة : أطروحة + سبب + مثال) · '
           + '3 أدوات ربط ثنائية · مبني للمجهول أو بديل له · خاتمة بـ Zusammenfassend + Meiner Meinung nach.',
         grille:[['Einleitung : thème + problématique, sans opinion','0.5'],
                 ['2 arguments POUR (These + Begründung + Beispiel)','0.5'],
                 ['2 arguments CONTRE (These + Begründung + Beispiel)','0.5'],
                 ['3 connecteurs bipartites différents','0.5'],
                 ['1 Passiv ou substitut (sich lassen / -bar / sein+zu / man)','0.5'],
                 ['Schluss : Zusammenfassend + Meiner Meinung nach','0.5'],
                 ['lexique de l’unité (8 mots) + orthographe et majuscules des noms','1.0']],
         texte:'<div class="reading"><p>Heutzutage wird viel über die Globalisierung '
              + 'diskutiert. Ist sie für Algerien eine Chance oder eine Gefahr? Diese Frage '
              + 'lässt sich nicht mit einem einfachen Ja oder Nein beantworten.</p>'
              + '<p>Dafür spricht erstens, dass der Welthandel Arbeitsplätze schafft, weil '
              + 'algerische Unternehmen Datteln, Zement und Erdgas in mehr als hundert Länder '
              + 'exportieren. Je mehr exportiert wird, desto mehr Devisen fließen ins Land. '
              + 'Zweitens ermöglicht das Internet den Studenten, im Ausland zu lernen, ohne '
              + 'ihre Heimat zu verlassen.</p>'
              + '<p>Dagegen spricht allerdings, dass kleine Betriebe dem Wettbewerb mit großen '
              + 'Konzernen nicht standhalten können. Zwar sind ausländische Waren oft billiger, '
              + 'aber lokale Produkte verschwinden dadurch vom Markt. Außerdem befürchten viele, '
              + 'dass kulturelle Vielfalt verloren geht.</p>'
              + '<p>Zusammenfassend lässt sich sagen, dass die Globalisierung weder gut noch '
              + 'schlecht an sich ist. Meiner Meinung nach sollte Algerien sich einerseits '
              + 'öffnen, andererseits aber die eigene Produktion fördern.</p></div>',
         modell:'Modellösung'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U14 = {
  unite: 14,
  titre: 'التصحيح النموذجي — الوحدة 14 : Globalisierung',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Die Globalisierung ist weder gut noch schlecht an sich.' },
    { id:'I.2', reponse:'Richtig', justification:'Exporte in mehr als hundert Länder.' },
    { id:'I.3', reponse:'Falsch', justification:'Kleine Betriebe können dem Wettbewerb nicht standhalten.' },
    { id:'I.4', reponse:'Falsch', justification:'Weder Regierung noch Unternehmen haben bisher eine Lösung.' },
    { id:'I.5', reponse:'Die zunehmende Vernetzung von Wirtschaft, Kultur und Kommunikation über die Grenzen hinweg.', justification:'Darunter versteht man …' },
    { id:'I.6', reponse:'Datteln, Zement, Erdgas (deux suffisent).', justification:'… exportieren heute Datteln, Zement und Erdgas.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'Je … desto', regle:'proportionnalité : je + verbe final, desto + verbe en 2' },
    { id:'II.2', reponse:'sich', regle:'sich lassen + Infinitiv = substitut du Passiv' },
    { id:'II.3', reponse:'vom', regle:'auteur de l’action → von + Datif' },
    { id:'II.4', reponse:'die Zusammenarbeit', regle:'nom composé, genre du dernier élément' },
    { id:'II.5', reponse:'noch', regle:'weder … noch (ni … ni)' },
    { id:'II.6', reponse:'worden', regle:'Passiv au Perfekt = sein + Partizip II + worden' },
    { id:'II.7', reponse:'Die Kluft lässt sich verkleinern.', regle:'sich lassen + infinitif final' },
    { id:'II.8', reponse:'sondern', regle:'nicht nur … sondern auch' }
  ],
  partie_III: {
    bareme: [['Einleitung sans opinion','0.5'],['2 arguments POUR','0.5'],['2 arguments CONTRE','0.5'],
             ['3 connecteurs bipartites','0.5'],['1 Passiv ou substitut','0.5'],
             ['Schluss Zusammenfassend + Meiner Meinung nach','0.5'],['lexique + orthographe','1.0']],
    Modellösung: 'Heutzutage wird viel über die Globalisierung diskutiert. Dafür spricht, dass der '
      + 'Welthandel Arbeitsplätze schafft, weil Algerien Datteln und Erdgas exportiert. Je mehr '
      + 'exportiert wird, desto mehr Devisen fließen ins Land. Dagegen spricht, dass kleine '
      + 'Betriebe dem Wettbewerb nicht standhalten können. Zwar sind ausländische Waren billiger, '
      + 'aber lokale Produkte verschwinden. Zusammenfassend lässt sich sagen, dass die '
      + 'Globalisierung weder gut noch schlecht ist. Meiner Meinung nach sollte Algerien sich '
      + 'öffnen, aber die eigene Produktion fördern.',
    modele: 'Heutzutage wird viel über die Globalisierung diskutiert. Dafür spricht, dass der '
      + 'Welthandel Arbeitsplätze schafft, weil Algerien Datteln und Erdgas exportiert. Je mehr '
      + 'exportiert wird, desto mehr Devisen fließen ins Land. Dagegen spricht, dass kleine '
      + 'Betriebe dem Wettbewerb nicht standhalten können. Zwar sind ausländische Waren billiger, '
      + 'aber lokale Produkte verschwinden. Zusammenfassend lässt sich sagen, dass die '
      + 'Globalisierung weder gut noch schlecht ist. Meiner Meinung nach sollte Algerien sich '
      + 'öffnen, aber die eigene Produktion fördern.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 14 🔁' }
  },
  erreurs_frequentes: [
    '~~nicht nur … aber auch~~ → la paire est <b>nicht nur … sondern auch</b>.',
    '~~Je mehr wir exportieren, desto mehr Devisen fließen~~ sans inversion → après <b>je</b>, '
    + 'le verbe va à la <b>fin</b> : <span class="de-in">Je mehr exportiert <b>wird</b>, desto…</span>',
    '~~ist gebaut geworden~~ → Passiv au Perfekt : <span class="de-in">ist gebaut '
    + '<b>worden</b></span>.',
    '~~von dem Erdbeben zerstört~~ (cause) → la cause se dit <b>durch</b> + Akkusativ ; '
    + '<b>von</b> + Datif désigne l’<b>auteur</b>.',
    '~~die Zusammenarbeit von die Länder~~ → <span class="de-in">die Zusammenarbeit '
    + '<b>der</b> Länder</span> (Génitif).',
    '~~Meiner Meinung ist~~ → <span class="de-in">Meiner Meinung <b>nach</b> ist…</span> '
    + '(nach se place <b>après</b>).',
    '~~Ich gebe mein Meinung~~ → donner un avis = <span class="de-in">Ich <b>äußere</b> '
    + 'meine Meinung</span> ou <span class="de-in">Ich <b>bin der Meinung</b>, dass…</span>',
    '~~weder … oder~~ → <b>weder … noch</b> (ni…ni) ; <b>entweder … oder</b> (soit…soit).',
    '~~Das Problem lässt sich lösen werden~~ → un seul équivalent passif à la fois : '
    + '<b>Das Problem lässt sich lösen.</b>',
    '~~Erörterung : je donne mon avis au début~~ → l’opinion personnelle se place dans '
    + 'le <b>Schluss</b>, jamais dans l’Einleitung.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE14 = { meta: UNITE14_META, seances: SEANCES_U14, devoir: DEVOIR_U14,
                   corrige: CORRIGE_U14 };
