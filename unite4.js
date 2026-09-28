/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite4.js
   الوحدة 4 : Alltag und Freizeit — الحياة اليومية وأوقات الفراغ
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي + الأخطاء الشائعة
   Programme officiel MEN · السنة الثانية ثانوي · الفصل الثاني (clôture)
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE4_META = {
  n: 4,
  de: 'Alltag und Freizeit',
  ar: 'الحياة اليومية وأوقات الفراغ',
  niveau: '2AS',
  trimestre: 2,
  periode: 'جانفي — مارس',
  duree_totale: 465,
  cecrl: 'A2',
  objectifs: [
    'وصف الروتين اليومي بالأفعال الانفصالية',
    'الحديث عن الهوايات وأوقات الفراغ',
    'استعمال ظرف المكان والزمان (Dativ après mit/nach/zu)',
    'اقتراح موعد وقبوله أو رفضه بأدب',
    'فهم نص سردي حول يوم في الحياة',
    'إنتاج فقرة سردية من 8 إلى 10 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['der Tagesablauf', 'die Freizeit', 'das Hobby', 'sich treffen',
                    'verabredet sein', 'Zeit haben', 'Lust haben'],
  grammaire_cle: ['Trennbare Verben im Perfekt', 'Präpositionen mit Dativ',
                  'Vorschläge machen', 'Zeitadverbien', 'Satzklammer']
};

/* ══════════ DEVOIR OFFICIEL — الوحدة 4 (/20) ══════════ */
const DEVOIR_U4 = {
  titre:'Évaluation — Einheit 4 : Alltag und Freizeit',
  unite:4, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Ein Tag aus meinem Leben</b></p>'
          + '<p>Ich heiße Sofiane und ich bin 16 Jahre alt. Ich wohne mit meiner Familie in '
          + 'Sétif. Mein Tag beginnt sehr früh: Ich stehe um halb sechs auf, weil ich mit dem '
          + 'Bus zur Schule fahren muss. Nach dem Frühstück gehe ich mit meinem Bruder zur '
          + 'Bushaltestelle. Der Unterricht beginnt um acht Uhr.</p>'
          + '<p>Am Dienstag haben wir Deutsch, Sport und Informatik. Deutsch ist mein '
          + 'Lieblingsfach, weil ich später in Deutschland studieren möchte. Um zwölf Uhr ist '
          + 'die Schule aus. Zu Hause esse ich mit meiner Mutter zu Mittag, dann mache ich '
          + 'meine Hausaufgaben.</p>'
          + '<p>Am Nachmittag treffe ich mich mit meinen Freunden im Jugendclub. Wir spielen '
          + 'Fußball oder wir hören Musik. Am Abend sehe ich eine Stunde fern, dann gehe ich '
          + 'um halb elf schlafen. Am Wochenende schlafe ich lange und am Samstagabend gehe '
          + 'ich mit meinen Freunden ins Kino.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Sofiane wohnt in Algerien.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Ich wohne … in Sétif.</span> — Sétif est en Algérie.'},
        {id:'I.2',type:'vf',t:'Er steht um sechs Uhr auf.',pts:1,rep:'Falsch',
         just:'<span class="de-in">halb sechs</span> = <b>5:30</b>, pas 6:00.'},
        {id:'I.3',type:'vf',t:'Er fährt mit dem Bus zur Schule.',pts:1,rep:'Richtig',
         just:'<span class="de-in">… weil ich mit dem Bus zur Schule fahren muss.</span>'},
        {id:'I.4',type:'vf',t:'Am Nachmittag macht er seine Hausaufgaben.',pts:1,rep:'Falsch',
         just:'Les devoirs sont faits <b>après le repas de midi</b> ; l’après-midi il retrouve ses amis.'},
        {id:'I.5',type:'txt',t:'Warum ist Deutsch sein Lieblingsfach?',pts:2,
         rep:'Weil er später in Deutschland studieren möchte.',
         key:['deutschland','studieren'],
         just:'<span class="de-in">… weil ich später in Deutschland studieren möchte.</span>'},
        {id:'I.6',type:'txt',t:'Was macht Sofiane am Samstagabend?',pts:2,
         rep:'Er geht mit seinen Freunden ins Kino.',key:['kino','freunden'],
         just:'<span class="de-in">Am Samstagabend gehe ich mit meinen Freunden ins Kino.</span>'}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ um 6 Uhr ___ .» (aufstehen)',
         opts:['stehe … auf','auf … stehe','stehe auf …','aufstehe …'],a:0,pts:1,
         why:'Verbe en position 2, préfixe **à la fin** (Satzklammer).'},
        {id:'II.2',type:'qcm',t:'«Gestern ___ ich früh aufgestanden.»',
         opts:['bin','habe','war','werde'],a:0,pts:1,
         why:'Changement d’état → auxiliaire <b>sein</b>.'},
        {id:'II.3',type:'qcm',t:'«Ich fahre ___ dem Bus ___ Schule.»',
         opts:['mit … zur','nach … zur','zu … nach','mit … nach'],a:0,pts:1,
         why:'<span class="de-in"><b>mit</b> + Datif</span> · <span class="de-in">zu + der = <b>zur</b></span>.'},
        {id:'II.4',type:'qcm',t:'«___ Samstag treffe ich mich ___ meinen Freunden.»',
         opts:['Am … mit','Im … mit','Um … nach','Am … nach'],a:0,pts:1,
         why:'Jour → <b>am</b> ; « avec » → <b>mit</b> + Datif pluriel.'},
        {id:'II.5',type:'txt',t:'Participe II de «anrufen» :',pts:1,rep:'angerufen',
         key:['angerufen'],just:'Préfixe + <b>ge</b> + radical + <b>en</b>.'},
        {id:'II.6',type:'txt',t:'Quelle heure : 10:30 ?',pts:1,rep:'halb elf',
         key:['halb elf'],just:'<span class="de-in">halb elf</span> = 10:30.'},
        {id:'II.7',type:'txt',t:'Traduis : «هل تريد أن نذهب إلى السينما؟»',pts:1,
         rep:'Wollen wir ins Kino gehen?',key:['wollen wir','kino'],
         just:'<span class="de-in">Wollen wir</span> + infinitif à la fin.'},
        {id:'II.8',type:'txt',t:'Réponds poliment par la négative : «Leider …» (je dois étudier)',pts:1,
         rep:'Leider nicht, ich muss lernen.',key:['leider','muss lernen'],
         just:'<b>Leider</b> + justification = refus poli.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 8 أسطر تصف فيها يومك المثالي : 3 أفعال انفصالية، '
           + 'فعلان في الماضي (Perfekt) مع المساعد الصحيح، 3 تعابير زمنية، '
           + 'حرف جر مع الداتيف، واقتراح (Wollen wir…? / Lass uns…!) مع جوابه.',
         grille:[['3 أفعال انفصالية مبنية بشكل صحيح (Satzklammer)','0.5'],
                 ['2 verbes au Perfekt avec sein/haben corrects','1.0'],
                 ['3 تعابير زمنية (um / am / nach / von…bis)','0.5'],
                 ['préposition + Datif correcte (mit/nach/zu/bei)','0.5'],
                 ['proposition + réponse (acceptation ou refus poli)','0.5'],
                 ['مفردات الوحدة 4 (8 كلمات على الأقل)','0.5'],
                 ['الإملاء، المajuscules، علامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Mein perfekter Tag beginnt spät. Am Samstag stehe ich '
              + 'erst um neun Uhr auf, weil ich am Freitag lange ferngesehen habe. Nach dem '
              + 'Frühstück räume ich mein Zimmer auf und helfe meiner Mutter beim Einkaufen.</p>'
              + '<p>Um elf Uhr treffe ich mich mit meinen Freunden im Jugendclub. '
              + '— Wollen wir Fußball spielen? — Ja, gern! Wir spielen von elf bis dreizehn Uhr. '
              + 'Danach gehe ich mit meinem Bruder nach Hause und wir essen zusammen zu Mittag.</p>'
              + '<p>Am Nachmittag bin ich mit meinen Cousins ins Schwimmbad gegangen. Am Abend '
              + 'hat mein Freund gesagt: «Lass uns ins Kino gehen!» Ich habe geantwortet: '
              + '«Gute Idee, aber leider habe ich keine Zeit, ich muss lernen.» Um halb elf '
              + 'gehe ich schlafen. Das ist mein perfekter Tag.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET ══════════ */
const CORRIGE_U4 = {
  unite: 4,
  titre: 'التصحيح النموذجي — الوحدة 4 : Alltag und Freizeit',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Richtig', justification:'Sétif est une ville algérienne.' },
    { id:'I.2', reponse:'Falsch', justification:'halb sechs = 5:30, pas 6:00.' },
    { id:'I.3', reponse:'Richtig', justification:'… weil ich mit dem Bus zur Schule fahren muss.' },
    { id:'I.4', reponse:'Falsch', justification:'Les devoirs sont faits après le déjeuner, pas l’après-midi.' },
    { id:'I.5', reponse:'Weil er später in Deutschland studieren möchte.', justification:'… weil ich später in Deutschland studieren möchte.' },
    { id:'I.6', reponse:'Er geht mit seinen Freunden ins Kino.', justification:'Am Samstagabend gehe ich mit meinen Freunden ins Kino.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'stehe … auf', regle:'Satzklammer : verbe en 2, préfixe à la fin' },
    { id:'II.2', reponse:'bin', regle:'aufstehen = changement d’état → sein' },
    { id:'II.3', reponse:'mit … zur', regle:'mit + Datif ; zu + der = zur' },
    { id:'II.4', reponse:'Am … mit', regle:'jour → am ; avec → mit + Datif pluriel' },
    { id:'II.5', reponse:'angerufen', regle:'préfixe + ge + radical + en' },
    { id:'II.6', reponse:'halb elf', regle:'halb X = (X-1):30' },
    { id:'II.7', reponse:'Wollen wir ins Kino gehen?', regle:'Wollen wir + infinitif final' },
    { id:'II.8', reponse:'Leider nicht, ich muss lernen.', regle:'refus poli = leider + justification' }
  ],
  partie_III: {
    bareme: [['3 verbes séparables (Satzklammer)','0.5'],['2 Perfekt avec sein/haben','1.0'],
             ['3 expressions de temps','0.5'],['préposition + Datif','0.5'],
             ['proposition + réponse','0.5'],['vocabulaire unité 4','0.5'],
             ['orthographe + majuscules','0.5']],
    modele: 'Mein perfekter Tag beginnt spät. Am Samstag stehe ich erst um neun Uhr auf, weil ich '
          + 'am Freitag lange ferngesehen habe. Nach dem Frühstück räume ich mein Zimmer auf. '
          + 'Um elf Uhr treffe ich mich mit meinen Freunden im Jugendclub. — Wollen wir Fußball '
          + 'spielen? — Ja, gern! Danach gehe ich mit meinem Bruder nach Hause. Am Nachmittag '
          + 'bin ich mit meinen Cousins ins Schwimmbad gegangen. Am Abend hat mein Freund gesagt: '
          + '«Lass uns ins Kino gehen!» — «Gute Idee, aber leider habe ich keine Zeit.» '
          + 'Um halb elf gehe ich schlafen.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 4 🔁' }
  },
  erreurs_frequentes: [
    '~~Ich aufstehe um 6 Uhr~~ → le préfixe va **à la fin** : Ich <b>stehe</b> um 6 Uhr <b>auf</b>.',
    '~~Ich habe aufgestanden~~ → <b>sein</b> : Ich <b>bin</b> aufgestanden.',
    '~~geaufstanden~~ → le ge- s’insère **après** le préfixe : auf<b>ge</b>standen.',
    '~~mit meine Freunde~~ → Datif pluriel + n : mit meine<b>n</b> Freunde<b>n</b>.',
    '~~zu der Schule~~ (contracté) → <b>zur</b> Schule · ~~zu dem Sport~~ → <b>zum</b> Sport.',
    '~~halb elf = 11:30~~ → <b>halb elf = 10:30</b>. Erreur n°1 des candidats algériens.',
    '~~Ich bin zu Hause gegangen~~ → mouvement : Ich bin <b>nach</b> Hause gegangen.',
    '~~Hast du Lust mitkommen?~~ → <b>zu</b> entre le préfixe et le verbe : Hast du Lust, '
    + 'mit<b>zu</b>kommen?'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE4 = { meta: UNITE4_META, seances: window.SEANCES_U4, devoir: DEVOIR_U4, corrige: CORRIGE_U4 };
