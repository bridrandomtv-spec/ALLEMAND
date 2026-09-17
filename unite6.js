/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite6.js
   الوحدة 6 : Reisen und Verkehr — السفر والنقل
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثالث (clôture)
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE6_META = {
  n: 6,
  de: 'Reisen und Verkehr',
  ar: 'السفر والنقل',
  niveau: '2AS',
  trimestre: 3,
  periode: 'أفريل — جوان',
  duree_totale: 465,
  cecrl: 'A2',
  cloture_annee: true,
  objectifs: [
    'تسمية وسائل النقل واستعمالها مع mit + Datif',
    'شراء تذكرة والسؤال عن المواعيد والأسعار',
    'السؤال عن الطريق والإرشاد (Wohin? / Woher? / Wie komme ich…?)',
    'سرد رحلة في الماضي (Perfekt avec sein)',
    'فهم نص سردي حول رحلة',
    'إنتاج نص سردي من 10 à 12 سطراً'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['das Verkehrsmittel', 'die Fahrkarte', 'der Bahnhof', 'das Gleis',
                    'die Verspätung', 'umsteigen', 'abfahren', 'ankommen', 'die Reise'],
  grammaire_cle: ['Präpositionen mit Dativ (mit/nach/zu)', 'Wechselpräpositionen',
                  'Perfekt mit sein', 'Fragesätze (Wohin/Woher/Wie)', 'Komparativ der Adjektive']
};

const SEANCES_U6 = [
  { n:1, de:'Verkehrsmittel', ar:'وسائل النقل', dur:60,
    obj:['تسمية وسائل النقل','mit + Datif','التعبير عن وسيلة التنقل'],
    lex:[['das Verkehrsmittel','وسيلة النقل'],['der Zug','القطار'],['die Bahn','السكّة الحديدية'],
         ['der Bus','الحافلة'],['die Straßenbahn','الترامواي'],['die U-Bahn','المترو'],
         ['das Flugzeug','الطائرة'],['das Schiff','السفينة'],['das Auto','السيارة'],
         ['das Fahrrad / das Rad','الدراجة'],['das Motorrad','الدراجة النارية'],['das Taxi','سيارة أجرة'],
         ['zu Fuß','على الأقدام'],['mit dem Zug','بالقطار'],['mit dem Bus','بالحافلة'],
         ['mit dem Flugzeug','بالطائرة'],['per Anhalter fahren','التنقل بالإيقاف (أوتوستوب)']],
    gram:{t:'Moyen de transport — mit + Dativ (ou zu Fuß)',
      b:['<b>mit</b> + Datif pour tous les véhicules : <span class="de-in">mit <u>dem</u> Zug</span> · '
       + '<span class="de-in">mit <u>der</u> Straßenbahn</span> · <span class="de-in">mit <u>den</u> '
       + 'öffentlichen Verkehrsmitteln</span>',
         '⚠️ « à pied » ne prend pas mit : <span class="de-in"><b>zu Fuß</b> gehen</span>',
         '⚠️ Avec les noms propres de véhicules sans article, on peut dire '
       + '<span class="de-in">Ich fahre <b>Bus</b> / <b>Fahrrad</b> / <b>Auto</b>.</span>',
         'Le verbe de déplacement : <span class="de-in">fahren</span> (véhicule) · '
       + '<span class="de-in">fliegen</span> (avion) · <span class="de-in">gehen</span> (à pied)'],
      tbl:[['der Zug','mit dem Zug','Ich fahre mit dem Zug.'],
           ['die U-Bahn','mit der U-Bahn','Er fährt mit der U-Bahn.'],
           ['das Auto','mit dem Auto','Wir fahren mit dem Auto.'],
           ['die Busse','mit den Bussen','Sie fahren mit den Bussen.'],
           ['—','zu Fuß','Ich gehe zu Fuß zur Schule.']],
      ex:'<span class="de-in">Wie kommst du zur Schule? — Ich fahre <b>mit dem Bus</b> '
       + 'oder ich gehe <b>zu Fuß</b>.</span>'},
    exos:[{q:'«Ich fahre ___ Zug nach Oran.»',opts:['mit dem','mit der','mit den','mit das'],a:0,
           why:'<span class="de-in">der Zug</span> → Datif → <b>mit dem Zug</b>.'},
          {q:'Comment dit-on «على الأقدام» ?',opts:['mit Fuß','zu Fuß','per Fuß','auf Fuß'],a:1,
           why:'Expression figée : <span class="de-in"><b>zu Fuß</b> gehen</span> — jamais « mit Fuß ».'},
          {q:'«Sie fährt ___ der Straßenbahn.»',opts:['mit','nach','zu','in'],a:0,
           why:'Moyen de transport → <b>mit</b> + Datif.'},
          {q:'Quel verbe pour un voyage en avion ?',opts:['fahren','fliegen','gehen','reisen mit'],a:1,
           why:'<span class="de-in"><b>fliegen</b></span> = voyager en avion.'},
          {q:'«mit ___ öffentlichen Verkehrsmitteln» (pluriel)',opts:['den','dem','der','das'],a:0,
           why:'Datif pluriel → <b>den</b> (+ -n au nom : Verkehrsmitte<b>l</b>n).'}]},

  { n:2, de:'Fahrkarten kaufen', ar:'شراء التذاكر', dur:60,
    obj:['dialogue au guichet','types de billets','prix et horaires','politesse'],
    lex:[['die Fahrkarte / das Ticket','التذكرة'],['der Fahrkartenschalter','الشباك'],
         ['der Automat','الموزّع الآلي'],['eine einfache Fahrt','ذهاب فقط'],
         ['eine Hin- und Rückfahrkarte','ذهاب وإياب'],['die Ermäßigung','التخفيض'],
         ['der Schüler / die Schülerin','التلميذ / التلميذة'],['erste Klasse','الدرجة الأولى'],
         ['zweite Klasse','الدرجة الثانية'],['der Platz','المقعد'],['reservieren','يحجز'],
         ['der Bahnsteig','الرصيف'],['das Gleis','السكة / الرصيف الرقم'],
         ['die Abfahrt','المغادرة'],['die Ankunft','الوصول'],['die Verspätung','التأخير'],
         ['umsteigen','يغيّر القطار'],['Was kostet das?','بكم هذا؟'],
         ['Ich hätte gern eine Fahrkarte nach…','أرغب في تذكرة إلى…']],
    gram:{t:'Dialogue type au guichet + prix et heures',
      b:['<b>Ich hätte gern</b> eine Fahrkarte nach Berlin. — demande polie (Konjunktiv II)',
         '<b>Eine einfache Fahrt oder hin und zurück?</b> — سؤال الشباك',
         '<b>Die zweite Klasse, bitte.</b> — الدرجة الثانية',
         'Prix : <span class="de-in">Das macht <b>32,50 Euro</b>.</span> (virgule, pas de point !)',
         'Horaires : <span class="de-in">Der Zug fährt <b>um 14:23 Uhr</b> von Gleis 7 <b>ab</b>.</span>',
         '<span class="de-in">abfahren</span> (verbe séparable !) · '
       + '<span class="de-in">ankommen</span> · <span class="de-in">umsteigen</span>'],
      tbl:[['— Guten Tag! Ich hätte gern eine Fahrkarte nach Constantine.',
            'صباح الخير! أرغب في تذكرة إلى قسنطينة.'],
           ['— Eine einfache Fahrt oder hin und zurück?', 'ذهاب فقط أم ذهاب وإياب؟'],
           ['— Hin und zurück, bitte. Was kostet das?', 'ذهاب وإياب من فضلك. بكم؟'],
           ['— Das macht 1 200 Dinar. Der Zug fährt um 9:15 von Gleis 3 ab.',
            'المبلغ 1200 دج. القطار ينطلق على 9:15 من السكة 3.'],
           ['— Muss ich umsteigen? — Ja, in Algier, Gleis 7.',
            'هل يجب أن أغيّر القطار؟ نعم في الجزائر، السكة 7.']],
      ex:'<span class="de-in">Entschuldigung, <b>wann fährt</b> der nächste Zug nach Oran '
       + '<b>ab</b>?</span>'},
    exos:[{q:'«Eine ___ Fahrt, bitte.» (aller simple)',opts:['einfache','einzelne','leichte','eine'],a:0,
           why:'Expression figée : <span class="de-in">eine <b>einfache</b> Fahrt</span>.'},
          {q:'«Der Zug fährt um 9 Uhr ___ .» (part)',opts:['ab','aus','an','weg'],a:0,
           why:'<span class="de-in"><b>abfahren</b></span> → préfixe <b>ab</b> en fin de phrase.'},
          {q:'«Muss ich ___ ?» (changer de train)',opts:['umsteigen','einsteigen','aussteigen','aufsteigen'],a:0,
           why:'<span class="de-in"><b>umsteigen</b></span> = changer de correspondance.'},
          {q:'Comment écrit-on 32,50 € en allemand ?',opts:['32.50 Euro','32,50 Euro',
                                                            'Euro 32,50','32-50 Euro'],a:1,
           why:'L’allemand utilise la **virgule** décimale et le point pour les milliers : <b>1 200,50</b>.'},
          {q:'«Das ___ 15 Euro.» (le montant s’élève à)',opts:['macht','ist','gibt','kostet sich'],a:0,
           why:'Formule du vendeur : <span class="de-in">Das <b>macht</b> 15 Euro.</span>'},
          {q:'«Der Zug hat 10 Minuten ___ .» (retard)',opts:['Verspätung','Verzögerung','Verspatung','Retard'],a:0,
           why:'<span class="de-in">die <b>Verspätung</b></span> = التأخير.'}]},

  { n:3, de:'Nach dem Weg fragen', ar:'السؤال عن الطريق', dur:60,
    obj:['demander et indiquer un chemin','Wohin / Woher / Wo','prépositions de lieu','impératif poli'],
    lex:[['der Weg','الطريق'],['die Straße','الشارع'],['die Kreuzung','التقاطع'],
         ['die Ampel','إشارة المرور'],['die Brücke','الجسر'],['die Ecke','الزاوية'],
         ['geradeaus','مستقيماً'],['nach links','إلى اليسار'],['nach rechts','إلى اليمين'],
         ['neben','بجانب'],['gegenüber','مقابل'],['hinter','خلف'],['vor','أمام'],
         ['zwischen','بين'],['an … vorbei','مروراً بـ'],['bis zu','حتى'],
         ['Wie komme ich zum Bahnhof?','كيف أصل إلى المحطة؟'],
         ['Wo ist die Bushaltestelle?','أين موقف الحافلة؟'],
         ['Ist es weit von hier?','هل هو بعيد من هنا؟']],
    gram:{t:'Wo? (position, Datif) · Wohin? (direction, Akkusativ) · Woher? (origine, Datif)',
      tbl:[['Wo bist du?','أين أنت؟','Ich bin <b>am</b> Bahnhof. (Datif)'],
           ['Wohin gehst du?','إلى أين تذهب؟','Ich gehe <b>in die</b> Stadt. (Akkusativ)'],
           ['Woher kommst du?','من أين تأتي؟','Ich komme <b>aus dem</b> Zentrum. (Datif)'],
           ['Wie komme ich zum…?','كيف أصل إلى…؟','Gehen Sie geradeaus, dann nach links.']],
      b:['Contractions obligatoires : <b>zum</b> (zu dem) · <b>zur</b> (zu der) · '
       + '<b>am</b> (an dem) · <b>im</b> (in dem) · <b>ans</b> (an das)',
         'Indiquer un chemin à l’impératif de politesse : '
       + '<span class="de-in"><b>Gehen Sie</b> geradeaus <b>bis zur</b> Ampel.</span>',
         'Distance : <span class="de-in">Es ist <b>nicht weit</b>, etwa fünf Minuten '
       + '<b>zu Fuß</b>.</span>'],
      ex:'<span class="de-in">— Entschuldigung, wie komme ich <b>zum</b> Bahnhof? '
       + '— Gehen Sie geradeaus, dann <b>nach links</b>. Der Bahnhof ist '
       + '<b>gegenüber dem</b> Supermarkt.</span>'},
    exos:[{q:'«___ komme ich zum Bahnhof?»',opts:['Wie','Was','Wo','Wer'],a:0,
           why:'« Comment » → <b>Wie</b>. (<span class="de-in">Wo</span> = où.)'},
          {q:'«___ gehst du?» — «In die Stadt.»',opts:['Wo','Wohin','Woher','Was'],a:1,
           why:'Direction → <b>Wohin</b> + Akkusativ.'},
          {q:'«Der Bahnhof ist ___ dem Supermarkt.» (en face de)',opts:['gegenüber','zwischen',
                                                                         'durch','um'],a:0,
           why:'<span class="de-in"><b>gegenüber</b></span> + Datif = مقابل.'},
          {q:'«Gehen Sie geradeaus ___ zur Ampel.»',opts:['bis','für','über','seit'],a:0,
           why:'<span class="de-in"><b>bis zu</b></span> = حتى (contracté : <b>bis zur</b> Ampel).'},
          {q:'«Wie komme ich ___ Bahnhof?»',opts:['zum','zur','in den','an dem'],a:0,
           why:'<span class="de-in">der Bahnhof</span> → zu + dem = <b>zum</b>.'},
          {q:'«Ist es weit ___ hier?»',opts:['von','aus','nach','mit'],a:0,
           why:'<span class="de-in">weit <b>von</b> hier</span> (von + Datif).'}]},

  { n:4, de:'Eine Reise erzählen — Perfekt mit sein', ar:'سرد رحلة — الماضي مع sein', dur:60,
    obj:['سرد رحلة في الماضي','Perfekt avec sein','marqueurs temporels du récit','comparatif'],
    lex:[['die Reise','الرحلة'],['reisen','يسافر'],['verreisen','يغادر في رحلة'],
         ['ankommen','يصل'],['abfahren','ينطلق'],['losfahren','ينطلق'],
         ['einsteigen','يصعد'],['aussteigen','ينزل'],['umsteigen','يغيّر القطار'],
         ['besichtigen','يزور (معلماً)'],['übernachten','يبيت'],['buchen','يحجز'],
         ['packen','يحزم'],['der Koffer','الحقيبة'],['der Urlaub','العطلة'],
         ['die Sehenswürdigkeit','المعلم السياحي'],['letzte Woche','الأسبوع الماضي'],
         ['im letzten Sommer','في الصيف الماضي'],['zuerst','أولاً'],['dann','ثم'],
         ['schließlich','أخيراً']],
    gram:{t:'Raconter au passé — Perfekt avec sein pour tout déplacement',
      b:['Tous les verbes de <b>déplacement</b> et de <b>changement d’état</b> prennent '
       + '<b>sein</b> : fahren · fliegen · gehen · kommen · reisen · ankommen · abfahren · '
       + 'einsteigen · aussteigen · umsteigen · aufstehen · einschlafen · werden · bleiben',
         'Les autres prennent <b>haben</b> : buchen · packen · besichtigen · fotografieren · essen',
         'Participe des verbes séparables : préfixe + <b>ge</b> + radical → '
       + '<span class="de-in">an<b>ge</b>kommen · ab<b>ge</b>fahren · ein<b>ge</b>stiegen</span>',
         'Comparatif : <span class="de-in">schnell → schnell<b>er</b></span> · '
       + '<span class="de-in">gut → bess<b>er</b></span> · '
       + '<span class="de-in">viel → mehr</span> · <span class="de-in">gern → lieber</span>'],
      tbl:[['fahren','sein','gefahren','Ich bin nach Berlin gefahren.'],
           ['ankommen','sein','angekommen','Wir sind um 10 Uhr angekommen.'],
           ['umsteigen','sein','umgestiegen','Ich bin in München umgestiegen.'],
           ['besichtigen','haben','besichtigt','Wir haben das Museum besichtigt.'],
           ['buchen','haben','gebucht','Ich habe das Hotel gebucht.'],
           ['fliegen','sein','geflogen','Sie ist nach Frankfurt geflogen.']],
      ex:'<span class="de-in">Letzten Sommer <b>bin</b> ich mit meiner Familie nach Berlin '
       + '<b>gereist</b>. Wir <b>sind</b> mit dem Flugzeug <b>geflogen</b> und <b>haben</b> '
       + 'das Brandenburger Tor <b>besichtigt</b>.</span>'},
    exos:[{q:'«Wir ___ mit dem Zug nach Oran gefahren.»',opts:['sind','haben','werden','waren'],a:0,
           why:'<span class="de-in">fahren</span> = déplacement → auxiliaire <b>sein</b>.'},
          {q:'Participe II de «ankommen» :',opts:['angekommen','geankommt','ankommt','kommen an'],a:0,
           why:'Verbe séparable : <span class="de-in">an + <b>ge</b> + kommen</span>.'},
          {q:'«Ich ___ das Hotel online gebucht.»',opts:['habe','bin','war','werde'],a:0,
           why:'<span class="de-in">buchen</span> n’est pas un déplacement → <b>haben</b>.'},
          {q:'Comparatif de «gut» :',opts:['guter','besser','mehr gut','guterer'],a:1,
           why:'Irrégulier : gut → <b>besser</b> · viel → <b>mehr</b> · gern → <b>lieber</b>.'},
          {q:'«___ Sommer bin ich gereist.» (l’été dernier)',opts:['Letzter','Letzten','Letzte','Letztes'],a:1,
           why:'<span class="de-in"><b>im letzten</b> Sommer</span> ou '
           + '<span class="de-in"><b>letzten</b> Sommer</span> (Akkusatif de durée).'},
          {q:'«Der Zug ist pünktlich ___ .» (parti)',opts:['abgefahren','abfahren','geabfahren','abgefarht'],a:0,
           why:'<span class="de-in">abfahren → ab<b>ge</b>fahren</span> (verbe fort + séparable).'}]},

  { n:5, de:'Textverständnis : «Eine Reise nach Berlin»', ar:'فهم نص — رحلة إلى برلين', dur:60,
    obj:['قراءة نص سردي بالماضي','استخراج المعلومات الزمنية والمكانية','repérer sein/haben','الإجابة بجمل كاملة'],
    texte:'<div class="reading"><p><b>Eine Reise nach Berlin</b></p>'
        + '<p>Letzten Sommer bin ich mit meiner Familie nach Berlin gereist. '
        + 'Wir sind am 15. Juli mit dem Flugzeug von Algier über Istanbul geflogen. '
        + 'Der Flug hat etwa sechs Stunden gedauert und war sehr angenehm.</p>'
        + '<p>Wir sind um 18 Uhr am Flughafen Berlin-Brandenburg angekommen. '
        + 'Von dort sind wir mit dem Zug zum Hotel gefahren, denn das Hotel lag '
        + 'im Zentrum, in der Nähe des Alexanderplatzes.</p>'
        + '<p>Am nächsten Tag haben wir das Brandenburger Tor besichtigt und sind '
        + 'den Kudamm entlanggegangen. Mein Vater hat viele Fotos gemacht, während '
        + 'meine Schwester eine Postkarte an ihre Freundin geschrieben hat.</p>'
        + '<p>Am Mittwoch sind wir mit der U-Bahn zum Museum Pergamon gefahren. '
        + 'Dort musste man eine Stunde warten, weil so viele Touristen da waren. '
        + 'Trotzdem hat es sich gelohnt: die Ausstellung war wirklich beeindruckend.</p>'
        + '<p>Nach fünf Tagen sind wir wieder nach Hause geflogen. Ich habe die Reise '
        + 'sehr genossen und möchte nächstes Jahr unbedingt nach München fahren.</p></div>',
    exos:[{q:'Richtig oder Falsch : Ils ont voyagé en train.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Wir sind … <b>mit dem Flugzeug</b> … geflogen.</span>'},
          {q:'Richtig oder Falsch : Le vol a duré environ six heures.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Der Flug hat etwa <b>sechs Stunden</b> gedauert.</span>'},
          {q:'Richtig oder Falsch : L’hôtel se trouvait près de l’Alexanderplatz.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">… in der Nähe des <b>Alexanderplatzes</b>.</span> (génitif !)'},
          {q:'Richtig oder Falsch : Ils n’ont pas attendu au musée Pergame.',
           opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'<span class="de-in">Dort <b>musste man eine Stunde warten</b>.</span>'},
          {q:'Quel auxiliaire est utilisé avec «reisen», «fliegen» et «ankommen» ?',
           opts:['haben','sein','werden','—'],a:1,
           why:'Verbes de déplacement → <b>sein</b> : <span class="de-in">bin gereist · sind geflogen · '
           + 'sind angekommen</span>.'},
          {q:'Combien de temps a duré le séjour ?',opts:['3 jours','4 jours','5 jours','7 jours'],a:2,
           why:'<span class="de-in"><b>Nach fünf Tagen</b> sind wir wieder nach Hause geflogen.</span>'},
          {q:'Que veut faire l’auteur l’année prochaine ?',
           opts:['Retourner à Berlin','Aller à Munich','Visiter Istanbul','Rester en Algérie'],a:1,
           why:'<span class="de-in">… möchte nächstes Jahr unbedingt nach <b>München</b> fahren.</span>'}]},

  { n:6, de:'Textproduktion — «Meine letzte Reise»', ar:'إنتاج كتابي ✍️ رحلتي الأخيرة', dur:60,
    obj:['كتابة نص سردي 10-12 سطراً','Perfekt avec sein/haben','connecteurs temporels','comparatif'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب نصاً سردياً من '
           + '<b>10 إلى 12 سطراً</b> تروي فيه رحلة قمت بها (أو رحلة تحلم بها)، مع احترام الشروط :'
           + '<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li><b>4 verbes au Perfekt avec sein</b> (reisen, fahren, fliegen, ankommen, umsteigen…)</li>'
           + '<li><b>2 verbes au Perfekt avec haben</b> (besichtigen, buchen, fotografieren…)</li>'
           + '<li><b>4 marqueurs temporels</b> : zuerst · dann · danach · am nächsten Tag · schließlich</li>'
           + '<li><b>1 moyen de transport avec mit + Datif</b> et <b>1 indication de lieu</b> '
           + '(neben / gegenüber / in der Nähe von)</li>'
           + '<li><b>1 comparatif</b> (schneller · besser · interessanter als…)</li>'
           + '</ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Letzten Sommer bin ich mit meiner Familie nach Béjaïa gereist. Zuerst sind wir '
         + 'mit dem Bus von Bouira abgefahren, denn wir haben kein Auto. Die Fahrt hat etwa '
         + 'drei Stunden gedauert, aber sie war viel angenehmer als im letzten Jahr, weil die '
         + 'Straße besser geworden ist.</p>'
         + '<p>Dann sind wir am Nachmittag angekommen und sind mit einem Taxi zum Hotel gefahren. '
         + 'Das Hotel lag direkt neben dem Strand, gegenüber einem kleinen Café. Am Abend haben '
         + 'wir in einem Restaurant zu Abend gegessen und ich habe Fisch mit Reis bestellt.</p>'
         + '<p>Am nächsten Tag haben wir den Cap Carbon besichtigt. Die Landschaft war schöner '
         + 'als auf den Fotos! Danach sind wir zum Hafen gegangen und mein Bruder hat viele '
         + 'Fotos gemacht. Schließlich sind wir am Sonntag wieder nach Hause gefahren.</p>'
         + '<p>Ich habe diese Reise sehr genossen. Nächstes Jahr möchte ich länger bleiben, '
         + 'denn fünf Tage sind einfach zu kurz.</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب نصّك السردي هنا (سيصححه الأستاذ الافتراضي):',
           ph:'Letzten Sommer bin ich … gereist. Zuerst …'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي — مراجعة السنة', dur:60,
    obj:['مراجعة شاملة للوحدة 6','مراجعة عرضية للوحدات 1→5','التقويم الذاتي','التحضير للفرض والبكالوريا'],
    exos:[{q:'«Wir sind ___ Berlin gefahren.»',opts:['nach','zu','in','an'],a:0,
           why:'Ville sans article → <b>nach</b>. (<span class="de-in"><b>in die</b> Schweiz</span> '
           + 'pour les pays à article.)'},
          {q:'«Ich fahre ___ dem Bus.»',opts:['mit','nach','zu','bei'],a:0,
           why:'Moyen de transport → <b>mit</b> + Datif.'},
          {q:'«___ komme ich zur Post?»',opts:['Wie','Wohin','Woher','Was'],a:0,
           why:'« Comment » → <b>Wie</b>.'},
          {q:'Participe II de «umsteigen» :',opts:['umgestiegen','geumstiegen','umsteigt','gestiegen um'],a:0,
           why:'Séparable + fort : <span class="de-in">um + <b>ge</b> + stiegen</span>.'},
          {q:'«Der Zug fährt um 8 Uhr ___ .»',opts:['ab','aus','an','ein'],a:0,
           why:'<span class="de-in"><b>abfahren</b></span> → préfixe <b>ab</b> en fin de phrase.'},
          {q:'«Gehen Sie geradeaus ___ zur Ampel.»',opts:['bis','über','durch','für'],a:0,
           why:'<span class="de-in"><b>bis zu</b></span> = jusqu’à.'},
          {q:'Comparatif de «viel» :',opts:['vieler','mehr','meist','viele'],a:1,
           why:'Irrégulier : viel → <b>mehr</b> · gut → <b>besser</b> · gern → <b>lieber</b>.'},
          {q:'«Das Hotel liegt ___ dem Bahnhof.» (à côté de)',opts:['neben','zwischen',
                                                                     'gegenüber','durch'],a:0,
           why:'<span class="de-in"><b>neben</b> + Datif</span> = à côté de.'},
          {q:'«Eine ___ Fahrt, bitte.» (aller-retour)',opts:['Hin- und Rückfahrkarte',
                                                            'einfache Karte','Rückkarte','Doppelkarte'],a:0,
           why:'<span class="de-in">eine <b>Hin- und Rückfahrkarte</b></span>.'},
          {q:'«___ ist die Bushaltestelle?» (où se trouve)',opts:['Wo','Wohin','Woher','Wann'],a:0,
           why:'Position → <b>Wo</b> + Datif.'},
          {q:'Rappel U1 : «Ich ___ 16 Jahre alt.»',opts:['bin','habe','ist','werde'],a:0,
           why:'L’âge se dit avec <b>sein</b>.'},
          {q:'Rappel U5 : «Ich hätte gern ___ Salat.»',opts:['ein','einen','eine','einem'],a:1,
           why:'<span class="de-in">der Salat</span> → Akkusativ → <b>einen</b>.'}]},

  { n:8, de:'Évaluation de l’unité 6 📝', ar:'فرض الوحدة 6 — ختام السنة', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي + سلّم التنقيط'], ex:'devoir'}
];

/* ══════════ DEVOIR OFFICIEL — الوحدة 6 (/20) ══════════ */
const DEVOIR_U6 = {
  titre:'Évaluation — Einheit 6 : Reisen und Verkehr',
  unite:6, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Eine Reise nach Berlin</b></p>'
          + '<p>Letzten Sommer bin ich mit meiner Familie nach Berlin gereist. Wir sind am '
          + '15. Juli mit dem Flugzeug von Algier über Istanbul geflogen. Der Flug hat etwa '
          + 'sechs Stunden gedauert und war sehr angenehm.</p>'
          + '<p>Wir sind um 18 Uhr am Flughafen Berlin-Brandenburg angekommen. Von dort sind '
          + 'wir mit dem Zug zum Hotel gefahren, denn das Hotel lag im Zentrum, in der Nähe '
          + 'des Alexanderplatzes.</p>'
          + '<p>Am nächsten Tag haben wir das Brandenburger Tor besichtigt und sind den Kudamm '
          + 'entlanggegangen. Mein Vater hat viele Fotos gemacht, während meine Schwester eine '
          + 'Postkarte an ihre Freundin geschrieben hat.</p>'
          + '<p>Am Mittwoch sind wir mit der U-Bahn zum Museum Pergamon gefahren. Dort musste '
          + 'man eine Stunde warten, weil so viele Touristen da waren. Trotzdem hat es sich '
          + 'gelohnt: die Ausstellung war wirklich beeindruckend.</p>'
          + '<p>Nach fünf Tagen sind wir wieder nach Hause geflogen. Ich habe die Reise sehr '
          + 'genossen und möchte nächstes Jahr unbedingt nach München fahren.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Die Familie ist mit dem Zug nach Berlin gereist.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Wir sind … <b>mit dem Flugzeug</b> … geflogen.</span>'},
        {id:'I.2',type:'vf',t:'Der Flug hat etwa sechs Stunden gedauert.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Der Flug hat etwa sechs Stunden gedauert.</span>'},
        {id:'I.3',type:'vf',t:'Das Hotel lag in der Nähe des Alexanderplatzes.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… in der Nähe des Alexanderplatzes.</span>'},
        {id:'I.4',type:'vf',t:'Am Museum Pergamon gab es keine Wartezeit.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Dort musste man <b>eine Stunde warten</b>.</span>'},
        {id:'I.5',type:'txt',t:'Wie sind sie vom Flughafen zum Hotel gekommen?',pts:2,
         rep:'Sie sind mit dem Zug zum Hotel gefahren.',key:['zug','mit dem zug'],
         just:'<span class="de-in">Von dort sind wir <b>mit dem Zug</b> zum Hotel gefahren.</span>'},
        {id:'I.6',type:'txt',t:'Wohin möchte der Erzähler nächstes Jahr fahren?',pts:2,
         rep:'Er möchte nach München fahren.',key:['münchen','munchen'],
         just:'<span class="de-in">… möchte nächstes Jahr unbedingt nach München fahren.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich fahre ___ Zug nach Oran.»',
         opts:['mit dem','mit der','mit den','mit das'],a:0,pts:1,
         why:'<span class="de-in">der Zug</span> → Datif → <b>mit dem Zug</b>.'},
        {id:'II.2',type:'qcm',t:'«Wir ___ mit dem Flugzeug geflogen.»',
         opts:['sind','haben','werden','waren'],a:0,pts:1,
         why:'Déplacement → auxiliaire <b>sein</b>.'},
        {id:'II.3',type:'qcm',t:'«Der Zug fährt um 9 Uhr ___ .»',
         opts:['ab','aus','an','weg'],a:0,pts:1,
         why:'<span class="de-in"><b>abfahren</b></span> → préfixe <b>ab</b> en fin de phrase.'},
        {id:'II.4',type:'qcm',t:'«___ komme ich zum Bahnhof?»',
         opts:['Wie','Wo','Wohin','Was'],a:0,pts:1,
         why:'« Comment » → <b>Wie</b>.'},
        {id:'II.5',type:'txt',t:'Complète : «Ich gehe ___ Fuß.» (à pied)',pts:1,rep:'zu',
         key:['zu'],just:'Expression figée : <span class="de-in"><b>zu Fuß</b></span>.'},
        {id:'II.6',type:'txt',t:'Participe II de «ankommen» :',pts:1,rep:'angekommen',
         key:['angekommen'],just:'Séparable + fort : an + ge + kommen.'},
        {id:'II.7',type:'txt',t:'Traduis : «القطار ينطلق على الثامنة»',pts:1,
         rep:'Der Zug fährt um acht Uhr ab.',key:['fährt','ab'],
         just:'<span class="de-in">abfahren</span> séparable + <b>um</b> + heure.'},
        {id:'II.8',type:'txt',t:'Comparatif : «Berlin ist ___ (groß) als Oran.»',pts:1,
         rep:'größer',key:['größer','grosser'],
         just:'Comparatif de <span class="de-in">groß</span> → <b>größer</b> (umlaut).'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب نصاً سردياً من 10 أسطر تروي فيه رحلة قمت بها : الوسيلة (mit + Datif)، '
           + 'الوصول والمغادرة (Perfekt مع sein)، نشاطان (Perfekt مع haben)، '
           + '4 روابط زمنية، ومقارنة واحدة (… als).',
         grille:[['4 verbes au Perfekt avec sein (reisen/fahren/fliegen/ankommen/umsteigen)','1.0'],
                 ['2 verbes au Perfekt avec haben (besichtigen/buchen/fotografieren)','0.5'],
                 ['4 marqueurs temporels (zuerst · dann · danach · schließlich · am nächsten Tag)','0.5'],
                 ['1 moyen de transport avec mit + Datif','0.5'],
                 ['1 indication de lieu (neben / gegenüber / in der Nähe von)','0.5'],
                 ['1 comparatif correct (… als)','0.5'],
                 ['orthographe, majuscules des noms, ponctuation','0.5']],
         modele:'<div class="reading"><p>Letzten Sommer bin ich mit meiner Familie nach Béjaïa '
              + 'gereist. Zuerst sind wir mit dem Bus von Bouira abgefahren. Die Fahrt hat etwa '
              + 'drei Stunden gedauert, aber sie war angenehmer als im letzten Jahr.</p>'
              + '<p>Dann sind wir am Nachmittag angekommen und sind mit einem Taxi zum Hotel '
              + 'gefahren. Das Hotel lag direkt neben dem Strand, gegenüber einem kleinen Café. '
              + 'Am Abend haben wir in einem Restaurant zu Abend gegessen.</p>'
              + '<p>Am nächsten Tag haben wir den Cap Carbon besichtigt. Die Landschaft war '
              + 'schöner als auf den Fotos! Danach sind wir zum Hafen gegangen und mein Bruder '
              + 'hat viele Fotos gemacht. Schließlich sind wir am Sonntag wieder nach Hause '
              + 'geflogen. Ich habe diese Reise sehr genossen.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U6 = {
  unite: 6,
  titre: 'التصحيح النموذجي — الوحدة 6 : Reisen und Verkehr',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Ils ont voyagé en avion (mit dem Flugzeug geflogen).' },
    { id:'I.2', reponse:'Richtig', justification:'Der Flug hat etwa sechs Stunden gedauert.' },
    { id:'I.3', reponse:'Richtig', justification:'… in der Nähe des Alexanderplatzes (génitif).' },
    { id:'I.4', reponse:'Falsch', justification:'Dort musste man eine Stunde warten.' },
    { id:'I.5', reponse:'Sie sind mit dem Zug zum Hotel gefahren.', justification:'Von dort sind wir mit dem Zug zum Hotel gefahren.' },
    { id:'I.6', reponse:'Er möchte nach München fahren.', justification:'… möchte nächstes Jahr unbedingt nach München fahren.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'mit dem', regle:'mit + Datif : der Zug → dem Zug' },
    { id:'II.2', reponse:'sind', regle:'fliegen = déplacement → sein' },
    { id:'II.3', reponse:'ab', regle:'abfahren séparable → ab en fin de phrase' },
    { id:'II.4', reponse:'Wie', regle:'Wie = comment ; Wo = où ; Wohin = vers où' },
    { id:'II.5', reponse:'zu', regle:'expression figée zu Fuß' },
    { id:'II.6', reponse:'angekommen', regle:'an + ge + kommen (séparable + fort)' },
    { id:'II.7', reponse:'Der Zug fährt um acht Uhr ab.', regle:'um + heure · verbe en position 2 · ab en fin' },
    { id:'II.8', reponse:'größer', regle:'comparatif avec umlaut : groß → größer … als' }
  ],
  partie_III: {
    bareme: [['4 Perfekt avec sein','1.0'],['2 Perfekt avec haben','0.5'],
             ['4 marqueurs temporels','0.5'],['mit + Datif','0.5'],
             ['indication de lieu','0.5'],['comparatif … als','0.5'],
             ['orthographe + majuscules','0.5']],
    modele: 'Letzten Sommer bin ich mit meiner Familie nach Béjaïa gereist. Zuerst sind wir mit '
          + 'dem Bus von Bouira abgefahren. Dann sind wir am Nachmittag angekommen und sind mit '
          + 'einem Taxi zum Hotel gefahren. Das Hotel lag direkt neben dem Strand, gegenüber '
          + 'einem kleinen Café. Am nächsten Tag haben wir den Cap Carbon besichtigt. Die '
          + 'Landschaft war schöner als auf den Fotos! Danach sind wir zum Hafen gegangen. '
          + 'Schließlich sind wir am Sonntag wieder nach Hause geflogen. Ich habe diese Reise '
          + 'sehr genossen.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 6 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich fahre mit Fuß~~ → expression figée : <b>zu Fuß</b> gehen.',
    '~~Ich habe nach Berlin gefahren~~ → déplacement = <b>sein</b> : Ich <b>bin</b> nach Berlin gefahren.',
    '~~geankommen / geumstiegen~~ → verbe séparable : an<b>ge</b>kommen · um<b>ge</b>stiegen.',
    '~~Ich fahre zu Berlin~~ → ville sans article → <b>nach</b> Berlin '
    + '(mais <b>in die</b> Schweiz / <b>in die</b> Türkei).',
    '~~Wohin ist die Bank?~~ → position = <b>Wo</b> ist die Bank? · direction = <b>Wohin</b> gehst du?',
    '~~32.50 Euro~~ → l’allemand utilise la **virgule** : <b>32,50 Euro</b> (et le point pour les milliers).',
    '~~Der Zug fahrt ab um 8 Uhr~~ → préfixe en fin : Der Zug <b>fährt</b> um 8 Uhr <b>ab</b>.',
    '~~größer als Oran ist~~ → ordre : Berlin ist größer <b>als</b> Oran (pas de verbe après als).',
    '~~Ich bin das Hotel gebucht~~ → <b>haben</b> pour buchen : Ich <b>habe</b> das Hotel gebucht.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE6 = { meta: UNITE6_META, seances: SEANCES_U6, devoir: DEVOIR_U6, corrige: CORRIGE_U6 };
