/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — unite2.js
   الوحدة 2 : Familie und Freunde — العائلة والأصدقاء
   8 حصص تفاعلية + فرض /20 + التصحيح النموذجي
   Programme officiel MEN · السنة الثانية ثانوي
   ══════════════════════════════════════════════════════════════ */
'use strict';

const UNITE2_META = {
  n: 2,
  de: 'Familie und Freunde',
  ar: 'العائلة والأصدقاء',
  niveau: '2AS',
  duree_totale: 465,
  cecrl: 'A1 → A2',
  objectifs: [
    'تسمية أفراد العائلة بالألمانية',
    'استعمال أدوات الملكية Possessivartikel',
    'وصف الأشخاص بالصفات (Adjektive)',
    'التحدث عن الأصدقاء والصداقة',
    'فهم نص وصفي حول العائلة',
    'إنتاج فقرة وصفية من 6 إلى 8 أسطر'
  ],
  competences: ['Hörverstehen', 'Leseverstehen', 'Sprechen', 'Schreiben'],
  vocabulaire_cle: ['die Familie', 'der Vater', 'die Mutter', 'mein', 'dein', 'sein', 'ihr',
                    'groß', 'klein', 'nett', 'der Freund', 'die Freundin'],
  grammaire_cle: ['Possessivartikel', 'Adjektive (prédicat)', 'Akkusativ', 'Nebensatz mit und/aber']
};

/* ══════════ DEVOIR OFFICIEL — الوحدة 2 (/20) ══════════ */
const DEVOIR_U2 = {
  titre:'Évaluation — Einheit 2 : Familie und Freunde',
  unite:2, duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Die Familie Sommer</b></p>'
          + '<p>Hallo! Ich heiße Julia Sommer. Ich bin 16 Jahre alt und ich komme aus Berlin. '
          + 'Ich wohne mit meiner Familie in einem Haus mit Garten. Meine Familie ist nicht sehr groß. '
          + 'Mein Vater heißt Markus und ist 45 Jahre alt. Er ist Lehrer von Beruf. '
          + 'Meine Mutter heißt Sabine und ist 43 Jahre alt. Sie ist Ärztin. '
          + 'Ich habe einen Bruder. Er heißt Tim und ist 12 Jahre alt. Tim ist sehr lustig, '
          + 'aber manchmal auch laut. Ich habe keine Schwester. Meine Großeltern wohnen in München. '
          + 'Jeden Sommer besuchen wir sie. Meine beste Freundin heißt Lena. '
          + 'Wir gehen zusammen ins Kino und spielen Musik.</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Julia wohnt in München.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich komme aus Berlin.</span> Ses grands-parents habitent Munich.'},
        {id:'I.2',type:'vf',t:'Julias Vater ist Lehrer.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Er ist Lehrer von Beruf.</span>'},
        {id:'I.3',type:'vf',t:'Julia hat zwei Brüder.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich habe <b>einen</b> Bruder.</span> — أخ واحد فقط.'},
        {id:'I.4',type:'vf',t:'Tim ist lustig, aber manchmal laut.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Tim ist sehr lustig, aber manchmal auch laut.</span>'},
        {id:'I.5',type:'txt',t:'Wie heißt Julias Mutter?',pts:2,rep:'Sie heißt Sabine.',
         just:'<span class="de-in">Meine Mutter heißt Sabine.</span>',key:['sabine']},
        {id:'I.6',type:'txt',t:'Was macht Julia mit Lena?',pts:2,
         rep:'Sie gehen ins Kino und spielen Musik.',
         just:'<span class="de-in">Wir gehen zusammen ins Kino und spielen Musik.</span>',
         key:['kino','musik']}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Das ist ___ Mutter.» (ma)',
         opts:['mein','meine','meinen','meiner'],a:1,pts:1,
         why:'<span class="de-in">Mutter</span> féminin → <b>meine</b>.'},
        {id:'II.2',type:'qcm',t:'«Ich habe ___ Bruder.» (mon, Akkusativ)',
         opts:['mein','meine','meinen','meinem'],a:2,pts:1,
         why:'Akkusativ masculin → <b>meinen</b>.'},
        {id:'II.3',type:'qcm',t:'«___ Schwester ist sehr nett.» (sa, à elle)',
         opts:['Sein','Seine','Ihr','Ihre'],a:3,pts:1,
         why:'sie (elle) → ihr ; féminin → <b>Ihre</b>.'},
        {id:'II.4',type:'qcm',t:'«Das gefällt ___ .» (moi)',
         opts:['ich','mich','mir','mein'],a:2,pts:1,
         why:'<span class="de-in">gefallen</span> + <b>Datif</b> → <b>mir</b>.'},
        {id:'II.5',type:'txt',t:'Complète : «___ Vater ist Lehrer.» (notre)',pts:1,
         rep:'Unser',key:['unser'],just:'wir → <b>unser</b>.'},
        {id:'II.6',type:'txt',t:'Contraire de «groß» :',pts:1,rep:'klein',
         key:['klein'],just:'<span class="de-in">groß ↔ klein</span>.'},
        {id:'II.7',type:'txt',t:'Traduis : «أختي صغيرة ولطيفة»',pts:1,
         rep:'Meine Schwester ist klein und nett.',key:['schwester ist klein'],
         just:'Adjectif attribut <b>invariable</b> après sein.'},
        {id:'II.8',type:'txt',t:'Traduis : «ليس لديّ إخوة»',pts:1,
         rep:'Ich habe keine Geschwister.',key:['keine geschwister','keine bruder'],
         just:'Négation du nom sans article → <b>kein/keine</b>.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 6 أسطر تصف فيها عائلتك وصديقك المقرّب '
           + '(الأسماء، الأعمار، صفة لكل شخص، نشاط مشترك).',
         grille:[['استعمال صحيح لأدوات الملكية (mein/dein/sein/ihr)','1.0'],
                 ['صفتان على الأقل بعد sein (invariables)','1.0'],
                 ['مفردات العائلة (5 كلمات على الأقل)','0.5'],
                 ['الرابطان und / aber','0.5'],
                 ['الإملاء، علامات الترقيم، المajuscule','1.0']],
         modele:'<div class="reading"><p>Ich heiße Yacine und ich bin 16 Jahre alt. '
              + 'Meine Familie ist klein. Mein Vater heißt Karim und ist 48 Jahre alt. '
              + 'Er ist sehr fleißig. Meine Mutter heißt Fatima. Sie ist nett und kocht gern. '
              + 'Ich habe einen Bruder und eine Schwester. Mein Bruder ist lustig, aber manchmal laut. '
              + 'Mein bester Freund heißt Sofiane. Wir spielen zusammen Fußball und wir lernen Deutsch. '
              + 'Ich mag meine Familie sehr.</p></div>'}
      ]}
  ]
};

/* ══════════ CORRIGÉ COMPLET (pour assets/bdd + export) ══════════ */
const CORRIGE_U2 = {
  unite: 2,
  titre: 'التصحيح النموذجي — الوحدة 2 : Familie und Freunde',
  bareme: { I: 8, II: 8, III: 4, total: 20 },
  partie_I: [
    { id:'I.1', reponse:'Falsch', justification:'Julia kommt aus Berlin — leurs grands-parents habitent München.' },
    { id:'I.2', reponse:'Richtig', justification:'Er ist Lehrer von Beruf.' },
    { id:'I.3', reponse:'Falsch', justification:'Ich habe einen Bruder (un seul).' },
    { id:'I.4', reponse:'Richtig', justification:'Tim ist sehr lustig, aber manchmal auch laut.' },
    { id:'I.5', reponse:'Sie heißt Sabine.', justification:'Meine Mutter heißt Sabine.' },
    { id:'I.6', reponse:'Sie gehen ins Kino und spielen Musik.', justification:'Wir gehen zusammen ins Kino und spielen Musik.' }
  ],
  partie_II: [
    { id:'II.1', reponse:'meine', regle:'Mutter = féminin → meine' },
    { id:'II.2', reponse:'meinen', regle:'Akkusativ masculin → meinen' },
    { id:'II.3', reponse:'Ihre', regle:'sie (elle) → ihr ; Schwester féminin → Ihre' },
    { id:'II.4', reponse:'mir', regle:'gefallen + Datif' },
    { id:'II.5', reponse:'Unser', regle:'wir → unser' },
    { id:'II.6', reponse:'klein', regle:'antonymes : groß ↔ klein' },
    { id:'II.7', reponse:'Meine Schwester ist klein und nett.', regle:'adjectif attribut invariable' },
    { id:'II.8', reponse:'Ich habe keine Geschwister.', regle:'négation du nom → kein/keine' }
  ],
  partie_III: {
    bareme: [['Possessivartikel corrects','1.0'],['2 adjectifs attributs invariables','1.0'],
             ['5 mots du vocabulaire famille','0.5'],['Connecteurs und / aber','0.5'],
             ['Orthographe + majuscules + ponctuation','1.0']],
    modele: 'Ich heiße Yacine und ich bin 16 Jahre alt. Meine Familie ist klein. '
          + 'Mein Vater heißt Karim und ist 48 Jahre alt. Er ist sehr fleißig. '
          + 'Meine Mutter heißt Fatima. Sie ist nett und kocht gern. Ich habe einen Bruder '
          + 'und eine Schwester. Mein Bruder ist lustig, aber manchmal laut. Mein bester Freund '
          + 'heißt Sofiane. Wir spielen zusammen Fußball und wir lernen Deutsch. '
          + 'Ich mag meine Familie sehr.',
    seuils: { '16-20':'ممتاز — Sehr gut 🏆', '14-15.9':'جيد جداً — Gut 👏',
              '10-13.9':'حسن — Befriedigend 📖', '0-9.9':'يحتاج مراجعة الوحدة 2 🔁' }
  },
  erreurs_frequentes: [
    '~~Meine Mutter ist nette~~ → <b>nett</b> (adjectif attribut invariable)',
    '~~Ich habe ein Bruder~~ → <b>einen</b> Bruder (Akkusativ masculin)',
    '~~Das gefällt mich~~ → Das gefällt <b>mir</b> (Datif)',
    '~~Ich habe nicht Schwester~~ → Ich habe <b>keine</b> Schwester',
    '~~Sein Schwester~~ → <b>Seine</b> Schwester (accord en genre)',
    '~~Ich habe 16 Jahre~~ → l’âge se dit avec <b>sein</b> : Ich <b>bin</b> 16 Jahre alt.',
    '~~die Geschwisters~~ → pluriel sans -s : <b>die Geschwister</b> '
    + '(et c’est déjà un pluriel, jamais «der Geschwister»).',
    '~~Mein Vatter~~ → un seul t : <b>mein Vater</b> ; attention aussi à '
    + '<span class="de-in">die Mutter</span> (deux t) et <span class="de-in">die Tochter</span>.',
    '~~Ich habe nicht Schwester~~ → négation d’un nom sans article : Ich habe '
    + '<b>keine</b> Schwester.',
    '~~Das gefällt mich~~ → <span class="de-in">gefallen</span> régit le '
    + '<b>Datif</b> : Das gefällt <b>mir</b>.',
    '~~die Großeltern ist~~ → pluriel : <span class="de-in">die Großeltern <b>sind</b></span>.'
  ]
};

/* ══════════ EXPOSITION GLOBALE ══════════ */
window.UNITE2 = { meta: UNITE2_META, seances: window.SEANCES_U2, devoir: DEVOIR_U2, corrige: CORRIGE_U2 };
