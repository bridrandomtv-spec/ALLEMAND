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
window.UNITE6 = { meta: UNITE6_META, seances: window.SEANCES_U6, devoir: DEVOIR_U6, corrige: CORRIGE_U6 };
