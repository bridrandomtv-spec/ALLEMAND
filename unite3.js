/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite3.js
   الوحدة 3 : Schule und Ausbildung — المدرسة والتكوين
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثاني
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE3_META = {
  n: 3,
  de: 'Schule und Ausbildung',
  ar: 'المدرسة والتكوين',
  niveau: '2AS',
  trimestre: 2,
  periode: 'جانفي — مارس',
  duree_totale: 465,
  cecrl: 'A2',
  objectifs: [
    'تسمية المواد الدراسية بالألمانية',
    'وصف المؤسسة ومرافقها',
    'التعبير عن التوقيت والجدول الدراسي',
    'استعمال الأفعال الناقلة Modalverben',
    'فهم نص حول الحياة المدرسية',
    'إنتاج فقرة وصفية من 8 إلى 10 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['die Schule', 'das Fach', 'der Stundenplan', 'die Pause',
                    'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
  grammaire_cle: ['Modalverben', 'Uhrzeit', 'Präpositionen (in/an/auf)',
                  'Satzstellung mit Modalverb', 'Perfekt der Modalverben']
};

/* ══════════ DEVOIR OFFICIEL — الوحدة 3 (/20) ══════════ */
const DEVOIR_U3 = {
  titre:'Évaluation — Einheit 3 : Schule und Ausbildung',
  unite:3, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Ein Tag in der Schule</b></p>'
          + '<p>Hallo! Ich heiße Nadia und ich bin 16 Jahre alt. Ich gehe in die '
          + 'Lycée Emir Abdelkader in Bouira. Mein Schultag beginnt um sieben Uhr morgens. '
          + 'Ich stehe um halb sechs auf und frühstücke mit meiner Familie. Dann fahre ich '
          + 'mit dem Bus zur Schule. Der Unterricht beginnt um acht Uhr.</p>'
          + '<p>Am Montag haben wir Deutsch, Mathematik und Sport. Deutsch ist mein '
          + 'Lieblingsfach, weil unsere Lehrerin sehr nett ist. In der Pause gehe ich mit '
          + 'meinen Freundinnen in die Bibliothek.</p>'
          + '<p>Nach der Schule muss ich meine Hausaufgaben machen. Am Abend darf ich eine '
          + 'Stunde fernsehen. Ich möchte später Ärztin werden, deshalb lerne ich auch '
          + 'Biologie sehr gern.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Nadia wohnt in Algerien.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Lycée Emir Abdelkader in Bouira</span> — Bouira est en Algérie.'},
        {id:'I.2',type:'vf',t:'Nadia steht um sechs Uhr auf.',pts:1,rep:'Falsch',
         just:'<span class="de-in">halb sechs</span> = <b>5:30</b>, pas 6:00.'},
        {id:'I.3',type:'vf',t:'Der Unterricht beginnt um acht Uhr.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Der Unterricht beginnt um acht Uhr.</span>'},
        {id:'I.4',type:'vf',t:'Nadia fährt mit dem Auto zur Schule.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich fahre <b>mit dem Bus</b> zur Schule.</span>'},
        {id:'I.5',type:'txt',t:'Warum ist Deutsch ihr Lieblingsfach?',pts:2,
         rep:'Weil ihre Lehrerin sehr nett ist.',key:['lehrerin','nett'],
         just:'<span class="de-in">… weil unsere Lehrerin sehr nett ist.</span>'},
        {id:'I.6',type:'txt',t:'Was möchte Nadia später werden?',pts:2,
         rep:'Sie möchte Ärztin werden.',key:['ärztin','arztin'],
         just:'<span class="de-in">Ich möchte später Ärztin werden.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ gut Deutsch sprechen.» (pouvoir)',
         opts:['kann','könnt','können','kannst'],a:0,pts:1,
         why:'<span class="de-in">ich</span> → <b>kann</b> (radical modifié, sans -e).'},
        {id:'II.2',type:'qcm',t:'«___ du heute lernen?» (devoir)',
         opts:['Muss','Musst','Müssen','Müsst'],a:1,pts:1,
         why:'<span class="de-in">du</span> → <b>musst</b>.'},
        {id:'II.3',type:'qcm',t:'«In der Bibliothek ___ man nicht laut sprechen.» (interdiction)',
         opts:['kann','muss','darf','soll'],a:2,pts:1,
         why:'Interdiction → <span class="de-in"><b>darf</b> nicht</span>.'},
        {id:'II.4',type:'qcm',t:'«Das Heft liegt ___ dem Tisch.» (sur, position)',
         opts:['auf','in','an','zu'],a:0,pts:1,
         why:'Position « sur » → <span class="de-in"><b>auf</b> + Datif</span>.'},
        {id:'II.5',type:'txt',t:'Complète : «___ Montag habe ich Sport.»',pts:1,
         rep:'Am',key:['am'],just:'Jour de la semaine → <b>am</b>.'},
        {id:'II.6',type:'txt',t:'Quelle heure : 9:30 ?',pts:1,rep:'halb zehn',
         key:['halb zehn'],just:'<span class="de-in">halb zehn</span> = 9:30.'},
        {id:'II.7',type:'txt',t:'Traduis : «يجب أن أعمل واجباتي»',pts:1,
         rep:'Ich muss meine Hausaufgaben machen.',key:['muss','hausaufgaben'],
         just:'<span class="de-in">müssen</span> + infinitif à la fin.'},
        {id:'II.8',type:'txt',t:'Mets dans l’ordre : lernen / ich / möchte / Deutsch',pts:1,
         rep:'Ich möchte Deutsch lernen.',key:['ich möchte deutsch lernen'],
         just:'Sujet + modal + complément + **infinitif à la fin**.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 8 أسطر تصف فيها مدرستك ويومك الدراسي : التوقيت، المرافق، '
           + 'مادتك المفضّلة مع السبب (weil)، وثلاثة أفعال ناقلة مختلفة.',
         grille:[['3 تعابير زمنية صحيحة (um / von…bis / am)','0.5'],
                 ['3 مرافق مدرسية بمفردات صحيحة','0.5'],
                 ['3 أفعال ناقلة مختلفة مصرّفة صحياً','1.0'],
                 ['جملة بـ weil مع الفعل في الآخر','0.5'],
                 ['ترتيب الجملة : الفعل في المركز الثاني','0.5'],
                 ['مفردات الوحدة 3 (8 كلمات على الأقل)','0.5'],
                 ['الإملاء، المajuscules، علامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Ich gehe in die Lycée Emir Abdelkader in Bouira. '
              + 'Meine Schule ist groß und modern. Es gibt eine Bibliothek, zwei Labore und '
              + 'eine Turnhalle. Mein Schultag beginnt um acht Uhr. Am Montag habe ich '
              + 'Deutsch, Mathematik und Sport. Von acht bis zwölf Uhr bin ich in der Schule.</p>'
              + '<p>Deutsch ist mein Lieblingsfach, weil unsere Lehrerin sehr nett ist. '
              + 'Ich kann schon gut Deutsch sprechen. Nach der Schule muss ich meine '
              + 'Hausaufgaben machen. In der Bibliothek darf man nicht laut sprechen. '
              + 'Ich möchte später Ärztin werden, deshalb lerne ich Biologie sehr gern.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U3 = {
  unite: 3,
  titre: 'التصحيح النموذجي — الوحدة 3 : Schule und Ausbildung',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Lycée Emir Abdelkader in Bouira — Bouira est en Algérie.' },
    { id:'I.2', reponse:'Falsch', justification:'halb sechs = 5:30, pas 6:00.' },
    { id:'I.3', reponse:'Richtig', justification:'Der Unterricht beginnt um acht Uhr.' },
    { id:'I.4', reponse:'Falsch', justification:'Sie fährt mit dem Bus, nicht mit dem Auto.' },
    { id:'I.5', reponse:'Weil ihre Lehrerin sehr nett ist.', justification:'… weil unsere Lehrerin sehr nett ist.' },
    { id:'I.6', reponse:'Sie möchte Ärztin werden.', justification:'Ich möchte später Ärztin werden.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'kann', regle:'ich → kann (radical modifié, sans -e)' },
    { id:'II.2', reponse:'Musst', regle:'du → musst' },
    { id:'II.3', reponse:'darf', regle:'interdiction → dürfen + nicht' },
    { id:'II.4', reponse:'auf', regle:'position « sur » → auf + Datif' },
    { id:'II.5', reponse:'Am', regle:'jour de la semaine → am' },
    { id:'II.6', reponse:'halb zehn', regle:'halb X = (X-1):30' },
    { id:'II.7', reponse:'Ich muss meine Hausaufgaben machen.', regle:'modal en 2 + infinitif final' },
    { id:'II.8', reponse:'Ich möchte Deutsch lernen.', regle:'sujet + modal + complément + infinitif final' }
  ],
  partie_III: {
    bareme: [['3 تعابير زمنية صحيحة','0.5'],['3 مرافق مدرسية','0.5'],
             ['3 أفعال ناقلة مختلفة','1.0'],['جملة بـ weil','0.5'],
             ['ترتيب الجملة (الفعل في المركز 2)','0.5'],['مفردات الوحدة 3','0.5'],
             ['الإملاء والترقيم','0.5']],
    modele: 'Ich gehe in die Lycée Emir Abdelkader in Bouira. Meine Schule ist groß und modern. '
          + 'Es gibt eine Bibliothek, zwei Labore und eine Turnhalle. Mein Schultag beginnt um '
          + 'acht Uhr. Am Montag habe ich Deutsch, Mathematik und Sport. Deutsch ist mein '
          + 'Lieblingsfach, weil unsere Lehrerin sehr nett ist. Ich kann schon gut Deutsch '
          + 'sprechen. Nach der Schule muss ich meine Hausaufgaben machen. In der Bibliothek '
          + 'darf man nicht laut sprechen. Ich möchte später Ärztin werden.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 3 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich kann gut Deutsch sprechen**en**~~ → le modal se conjugue, '
    + 'l’infinitif reste **inchangé** à la fin : Ich kann gut Deutsch <b>sprechen</b>.',
    '~~Ich muss lernen heute~~ → l’infinitif va **à la fin** : Ich muss heute <b>lernen</b>.',
    '~~er musst~~ → <b>er muss</b> (3ᵉ personne du singulier sans -t).',
    '~~halb neun = 9:30~~ → <b>halb neun = 8:30</b> ! Erreur n°1 des candidats algériens.',
    '~~Ich gehe in der Schule~~ (mouvement) → <b>in die Schule</b> (Akkusativ).',
    '~~am Montag habe ich Deutsch in Montag~~ → une seule préposition : <b>am Montag</b>.',
    '~~das Faches~~ → pluriel avec umlaut : <b>die Fächer</b>.',
    '~~Am Montag ich habe Deutsch~~ → le verbe reste en position 2 : <span class="de-in">Am Montag <b>habe ich</b> Deutsch</span> (inversion !)',
    '~~Ich habe keine Zeit nicht~~ → double négation interdite : <span class="de-in">Ich habe <b>keine</b> Zeit</span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE3 = { meta: UNITE3_META, seances: window.SEANCES_U3, devoir: DEVOIR_U3, corrige: CORRIGE_U3 };
