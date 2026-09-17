/* ══════════════════════════════════════════════════════════════
   برنامج الأصل — DEUTSCH-DZ-APP · app.js
   Prof. Kharif Ahmed · moteur principal
   Navigation · Séances 1-8 · Devoir /20 · IA du professeur · PWA
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* ─────────────── CONSTANTES GLOBALES ─────────────── */
const WA_NUMBER = '213555577931';
const LS = {
  seances : 'dz_de_seances_v1',
  devoir  : 'dz_de_devoir_v1',
  sim     : 'dz_de_sim_v1',
  sound   : 'dz_de_sound_v1',
  chat    : 'dz_de_chat_v1',
  parent  : 'dz_de_parent_v1'
};

/* ─────────────── UNITÉ 1 : Sich vorstellen (8 séances) ─────────────── */
const SEANCES_U1 = [
  { n:1, de:'Begrüßung und sich vorstellen', ar:'التحية والتعارف', dur:60,
    obj:['التحية بالألمانية','التعريف بالاسم','الوداع'],
    lex:[['Guten Morgen','صباح الخير'],['Guten Tag','نهارك سعيد'],['Guten Abend','مساء الخير'],
         ['Gute Nacht','تصبح على خير'],['Hallo','مرحبا'],['Tschüs','مع السلامة (غير رسمي)'],
         ['Auf Wiedersehen','إلى اللقاء (رسمي)'],['Wie heißt du?','ما اسمك؟'],['Ich heiße…','أنا اسمي…']],
    gram:{t:'W-Fragen : Wie heißt du?',
      b:['<b>Wie</b> = كيف','<b>Woher</b> = من أين','<b>Wo</b> = أين','<b>Wer</b> = من'],
      ex:'<b class="de-in">Wie heißt du?</b> — <span class="de-in">Ich heiße Amine.</span>'},
    exos:[{q:'Comment dit-on «صباح الخير» ?',opts:['Guten Abend','Guten Morgen','Gute Nacht','Tschüs'],a:1,
           why:'<span class="de-in">Guten Morgen</span> = صباح الخير. <span class="de-in">Guten Abend</span> = مساء الخير.'},
          {q:'Quelle formule est OFFICIELLE pour dire au revoir ?',
           opts:['Tschüs','Hallo','Auf Wiedersehen','Gute Nacht'],a:2,
           why:'<span class="de-in">Auf Wiedersehen</span> est formel ; <span class="de-in">Tschüs</span> est familier.'}]},

  { n:2, de:'Persönliche Informationen', ar:'المعلومات الشخصية', dur:60,
    obj:['العمر','البلد والمدينة','العائلة'],
    lex:[['Ich bin … Jahre alt','عمري … سنة'],['Ich komme aus Algerien','أنا من الجزائر'],
         ['Ich wohne in Bouira','أسكن في البويرة'],['die Familie','العائلة'],
         ['der Vater','الأب'],['die Mutter','الأم'],['die Schwester','الأخت'],['der Bruder','الأخ'],
         ['Ich habe zwei Schwestern','لديّ أختان']],
    gram:{t:'Les nombres de 1 à 20',
      b:['eins · zwei · drei · vier · fünf','sechs · sieben · acht · neun · zehn',
         'elf · zwölf · dreizehn · vierzehn · fünfzehn','sechzehn · siebzehn · achtzehn · neunzehn · zwanzig'],
      ex:'<span class="de-in">Ich bin <b>sechzehn</b> Jahre alt.</span> = عمري 16 سنة.'},
    exos:[{q:'Complète : «Ich ___ 16 Jahre alt.»',opts:['habe','bin','komme','heiße'],a:1,
           why:'On utilise <b>sein</b> pour l’âge : <span class="de-in">ich <b>bin</b> 16 Jahre alt</span>.'},
          {q:'«Woher kommst du?» — Réponse correcte :',
           opts:['Ich wohne in Bouira.','Ich komme aus Algerien.','Ich bin 16.','Ich heiße Amine.'],a:1,
           why:'<b>Woher</b> (من أين) appelle une origine : <span class="de-in">Ich komme aus …</span>'}]},

  { n:3, de:'Das Verb «sein»', ar:'الفعل sein', dur:60,
    obj:['تصريف sein في الحاضر','الاستعمال مع الصفة','الجنسية'],
    lex:[['sein','يكون'],['ich bin','أنا أكون'],['du bist','أنت تكون'],['er/sie/es ist','هو/هي يكون'],
         ['wir sind','نحن نكون'],['ihr seid','أنتم تكونون'],['sie/Sie sind','هم يكونون / حضرتكم'],
         ['algerisch','جزائري'],['deutsch','ألماني']],
    gram:{t:'Conjugaison — sein (Präsens)',
      tbl:[['ich','bin'],['du','bist'],['er / sie / es','ist'],['wir','sind'],['ihr','seid'],['sie / Sie','sind']],
      ex:'<span class="de-in">Ich <b>bin</b> algerisch.</span> · <span class="de-in">Sie <b>ist</b> deutsch.</span>'},
    exos:[{q:'«Du ___ mein Freund.»',opts:['bin','ist','bist','sind'],a:2,why:'<span class="de-in">du</span> → <b>bist</b>.'},
          {q:'«Wir ___ aus Algerien.»',opts:['sind','seid','ist','bin'],a:0,why:'<span class="de-in">wir</span> → <b>sind</b>.'},
          {q:'«___ Sie Herr Kharif?»',opts:['Bist','Sind','Ist','Seid'],a:1,
           why:'<span class="de-in">Sie</span> (vouvoiement) → <b>sind</b>.'}]},

  { n:4, de:'Das Verb «haben»', ar:'الفعل haben', dur:60,
    obj:['تصريف haben','التعبير عن الملكية','الأرقام مع haben'],
    lex:[['haben','يملك / لديه'],['ich habe','أنا أملك'],['du hast','أنت تملك'],['er/sie/es hat','هو/هي يملك'],
         ['wir haben','نحن نملك'],['ihr habt','أنتم تملكون'],['sie/Sie haben','هم يملكون'],
         ['ein Buch','كتاب'],['eine Schwester','أخت']],
    gram:{t:'Conjugaison — haben (Präsens)',
      tbl:[['ich','habe'],['du','hast'],['er / sie / es','hat'],['wir','haben'],['ihr','habt'],['sie / Sie','haben']],
      ex:'<span class="de-in">Ich <b>habe</b> zwei Schwestern.</span> = لديّ أختان.'},
    exos:[{q:'«___ du Geschwister?»',opts:['Haben','Hast','Hat','Bist'],a:1,why:'<span class="de-in">du</span> → <b>hast</b>.'},
          {q:'«Lena ___ zwei Schwestern.»',opts:['habe','hast','hat','haben'],a:2,
           why:'Lena = <span class="de-in">sie</span> (3e pers. sg.) → <b>hat</b>.'}]},

  { n:5, de:'Textverständnis : Lena Fischer', ar:'فهم نص تقديمي', dur:60,
    obj:['قراءة نص ألماني','استخراج المعلومات','الإجابة بجمل كاملة'],
    texte:'<div class="reading"><p><b>Lena Fischer</b></p>'
        + '<p>Hallo! Ich heiße Lena Fischer. Ich bin 16 Jahre alt und ich komme aus Deutschland. '
        + 'Ich wohne in München mit meiner Familie.</p>'
        + '<p>Mein Vater heißt Thomas und meine Mutter heißt Anna. Ich habe zwei Schwestern. '
        + 'Sie heißen Marie und Sophie.</p>'
        + '<p>In der Schule lerne ich Englisch und Französisch. Meine Hobbys sind Musik und Sport. '
        + 'Am Morgen sage ich immer: «Guten Morgen, Mama!»</p></div>',
    exos:[{q:'Richtig oder Falsch : Lena vient d’Autriche.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:1,
           why:'Elle vient d’<b>Allemagne</b> — <span class="de-in">Ich komme aus Deutschland.</span>'},
          {q:'Richtig oder Falsch : Lena a deux sœurs.',opts:['Richtig (صحيح)','Falsch (خطأ)'],a:0,
           why:'<span class="de-in">Ich habe zwei Schwestern.</span> → صحيح.'},
          {q:'Quel âge a Lena ?',opts:['15','16','17','18'],a:1,
           why:'<span class="de-in">Ich bin 16 Jahre alt.</span>'},
          {q:'Où habite-t-elle ?',opts:['Berlin','München','Wien','Hamburg'],a:1,
           why:'<span class="de-in">Ich wohne in München.</span>'}]},

  { n:6, de:'Textproduktion (Aufgabe)', ar:'إنتاج كتابي ✍️ — المهمة النهائية', dur:60,
    obj:['كتابة فقرة تقديمية','ترتيب الأفكار','استعمال sein/haben'],
    consigne:'<div class="exo"><div class="q-t"><b>📌 المهمة :</b> اكتب فقرة من <b>5 à 8 أسطر</b> '
           + 'تعرّف فيها بنفسك مستعملاً :<ul style="margin:8px 20px 0;color:var(--m);font-size:13px">'
           + '<li>التحية + الاسم</li><li>العمر + البلد + المدينة</li><li>العائلة (haben)</li>'
           + '<li>الهوايات</li><li>الوداع</li></ul></div></div>',
    modele:'<div class="corrige"><h3>✅ نموذج الإجابة — Modellösung</h3><div class="reading">'
         + '<p>Hallo! Ich heiße Amine Benali. Ich bin 16 Jahre alt. Ich komme aus Algerien '
         + 'und ich wohne in Bouira.</p>'
         + '<p>Meine Familie ist klein. Ich habe einen Bruder und eine Schwester. Mein Vater '
         + 'heißt Karim und meine Mutter heißt Fatima.</p>'
         + '<p>In der Schule lerne ich Deutsch und Englisch. Meine Hobbys sind Fußball und Musik. '
         + 'Am Abend sage ich: «Gute Nacht!»</p><p>Tschüs!</p></div></div>',
    exos:[{type:'texte',q:'✍️ اكتب فقرتك هنا (سيصححها الأستاذ الافتراضي):',ph:'Hallo! Ich heiße …'}]},

  { n:7, de:'Konsolidierung + Selbstevaluation', ar:'تثبيت وتقويم ذاتي', dur:60,
    obj:['مراجعة شاملة','التقويم الذاتي','التصحيح الجماعي'],
    exos:[{q:'«Wie ___ du?» — «Ich heiße Sara.»',opts:['heißt','heiße','heißen','bist'],a:0,
           why:'<span class="de-in">du</span> → <b>heißt</b>.'},
          {q:'Choisis la traduction de «أنا من الجزائر» :',
           opts:['Ich wohne in Algerien.','Ich bin aus Algerien.','Ich habe Algerien.','Ich komme Algerien.'],a:1,
           why:'<span class="de-in">Ich bin aus …</span> / <span class="de-in">Ich komme <b>aus</b> …</span> — الـ aus إجبارية.'},
          {q:'«Guten Morgen!» se dit :',opts:['مساء الخير','صباح الخير','تصبح على خير','إلى اللقاء'],a:1,
           why:'<span class="de-in">Guten Morgen</span> = صباح الخير.'},
          {q:'«ihr ___» (haben)',opts:['habe','hast','hat','habt'],a:3,why:'<span class="de-in">ihr</span> → <b>habt</b>.'},
          {q:'Complète : «Das ___ meine Mutter.»',opts:['bin','ist','sind','hast'],a:1,
           why:'<span class="de-in">das</span> (3e pers. sg.) → <b>ist</b>.'}]},

  { n:8, de:'Évaluation de l’unité 📝', ar:'فرض الوحدة', dur:45,
    obj:['اختبار كتابي /20','45 دقيقة','تصحيح نموذجي'], ex:'devoir'}
];

/* ─────────────── DEVOIR OFFICIEL — الوحدة 1 (/20) ─────────────── */
const DEVOIR_U1 = {
  titre:'Évaluation — Einheit 1 : Sich vorstellen', duree:45, total:20,
  parties:[
    { id:'I', t:'📖 Compréhension de l’écrit — Leseverstehen', pts:8,
      texte:'<div class="reading"><p><b>Lena Fischer</b></p>'
          + '<p>Hallo! Ich heiße Lena Fischer. Ich bin 16 Jahre alt und ich komme aus Deutschland. '
          + 'Ich wohne in München mit meiner Familie. Mein Vater heißt Thomas und meine Mutter heißt Anna. '
          + 'Ich habe zwei Schwestern. Sie heißen Marie und Sophie. In der Schule lerne ich Englisch und '
          + 'Französisch. Meine Hobbys sind Musik und Sport. Am Morgen sage ich immer: «Guten Morgen, Mama!»</p></div>',
      questions:[
        {id:'I.1',type:'vf',t:'Lena kommt aus Österreich.',pts:1,rep:'Falsch',
         just:'<span class="de-in">Ich komme aus Deutschland.</span>'},
        {id:'I.2',type:'vf',t:'Lena ist 16 Jahre alt.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Ich bin 16 Jahre alt.</span>'},
        {id:'I.3',type:'vf',t:'Lena hat zwei Schwestern.',pts:1,rep:'Richtig',
         just:'<span class="de-in">Ich habe zwei Schwestern.</span>'},
        {id:'I.4',type:'vf',t:'Lena lernt Spanisch in der Schule.',pts:1,rep:'Falsch',
         just:'Elle apprend l’anglais et le français.'},
        {id:'I.5',type:'txt',t:'Wie heißt Lenas Mutter?',pts:2,rep:'Sie heißt Anna.',
         just:'<span class="de-in">…meine Mutter heißt Anna.</span>',key:['anna']},
        {id:'I.6',type:'txt',t:'Wo wohnt Lena?',pts:2,rep:'Sie wohnt in München.',
         just:'<span class="de-in">Ich wohne in München.</span>',key:['münchen','munchen','munich']}
      ]},
    { id:'II', t:'🔤 Langue — Sprachbausteine', pts:8,
      questions:[
        {id:'II.1',type:'qcm',t:'«Ich ___ 16 Jahre alt.»',opts:['habe','bin','komme','heiße'],a:1,pts:1,why:'<b>sein</b> pour l’âge.'},
        {id:'II.2',type:'qcm',t:'«___ du Geschwister?»',opts:['Haben','Hast','Hat','Bist'],a:1,pts:1,why:'<span class="de-in">du</span> → <b>hast</b>.'},
        {id:'II.3',type:'qcm',t:'«Wir ___ aus Algerien.»',opts:['sind','seid','ist','bin'],a:0,pts:1,why:'<span class="de-in">wir</span> → <b>sind</b>.'},
        {id:'II.4',type:'qcm',t:'«Lena ___ zwei Schwestern.»',opts:['habe','hast','hat','haben'],a:2,pts:1,why:'<span class="de-in">sie</span> → <b>hat</b>.'},
        {id:'II.5',type:'txt',t:'«___ kommst du?» → من أين أنت؟',pts:1,rep:'Woher',key:['woher'],just:'<span class="de-in">Woher</span> = من أين.'},
        {id:'II.6',type:'txt',t:'«___ heißt du?» → ما اسمك؟',pts:1,rep:'Wie',key:['wie'],just:'<span class="de-in">Wie</span> = كيف.'},
        {id:'II.7',type:'txt',t:'Traduis : «عمري 16 سنة»',pts:1,rep:'Ich bin 16 Jahre alt.',
         key:['ich bin 16','ich bin sechzehn'],just:'<b>sein</b> + âge.'},
        {id:'II.8',type:'txt',t:'Traduis : «أنا من الجزائر»',pts:1,rep:'Ich komme aus Algerien.',
         key:['aus algerien'],just:'<span class="de-in">kommen <b>aus</b></span> + pays.'}
      ]},
    { id:'III', t:'✍️ Production écrite — Schreiben', pts:4,
      questions:[
        {id:'III.1',type:'redac',pts:4,
         t:'اكتب فقرة من 5 أسطر تعرّف فيها بنفسك (الاسم، العمر، البلد، العائلة، الهوايات).',
         grille:[['استعمال صحيح لـ sein / haben','1.5'],['مفردات الوحدة 1 (5 كلمات على الأقل)','1.0'],
                 ['ترتيب الأفكار والتماسك','1.0'],['الإملاء وعلامات الترقيم','0.5']],
         modele:'<div class="reading"><p>Hallo! Ich heiße Amine Benali. Ich bin 16 Jahre alt. '
              + 'Ich komme aus Algerien und ich wohne in Bouira. Ich habe einen Bruder und eine '
              + 'Schwester. Meine Hobbys sind Fußball und Musik. Tschüs!</p></div>'}
      ]}
  ]
};

/* ─────────────── REGISTRE DES UNITÉS ─────────────── */
let currentUnite = 1;

const UNITES = [
  { n:1, de:'Sich vorstellen',        ar:'التعريف بالنفس',    icon:'👋', cecrl:'A1',
    seances:SEANCES_U1, devoir:DEVOIR_U1, duree:465 },
  { n:2, de:'Familie und Freunde',    ar:'العائلة والأصدقاء', icon:'👨‍👩‍👧', cecrl:'A1→A2',
    seances:(window.UNITE2 ? UNITE2.seances : []),
    devoir: (window.UNITE2 ? UNITE2.devoir  : null),
    duree:  (window.UNITE2 && UNITE2.meta ? UNITE2.meta.duree_totale : 465) },
  { n:3, de:'Schule und Ausbildung',  ar:'المدرسة والتكوين',  icon:'🏫', cecrl:'A2',
    seances:(window.UNITE3 ? UNITE3.seances : []),
    devoir: (window.UNITE3 ? UNITE3.devoir  : null),
    duree:  (window.UNITE3 && UNITE3.meta ? UNITE3.meta.duree_totale : 465) },
  { n:4, de:'Alltag und Freizeit',    ar:'الحياة اليومية وأوقات الفراغ', icon:'⚽', cecrl:'A2',
    seances:(window.UNITE4 ? UNITE4.seances : []),
    devoir: (window.UNITE4 ? UNITE4.devoir  : null),
    duree:  (window.UNITE4 && UNITE4.meta ? UNITE4.meta.duree_totale : 465) },
  { n:5, de:'Essen und Trinken',      ar:'المأكل والمشرب',      icon:'🍽️', cecrl:'A2',
    seances:(window.UNITE5 ? UNITE5.seances : []),
    devoir: (window.UNITE5 ? UNITE5.devoir  : null),
    duree:  (window.UNITE5 && UNITE5.meta ? UNITE5.meta.duree_totale : 465) }
];

let SEANCES = UNITES[0].seances;
let DEVOIR   = UNITES[0].devoir;

function uniteActive(){ return UNITES.filter(u => u.n === currentUnite)[0] || UNITES[0]; }

function selectUnite(n){
  const u = UNITES.filter(x => x.n === n)[0];
  if(!u){ toast('⚠️ الوحدة غير متوفرة','ko'); return; }
  if(!u.seances || !u.seances.length){ toast('🔒 محتوى الوحدة ' + n + ' غير جاهز','ko'); return; }
  currentUnite = n;
  SEANCES = u.seances;
  DEVOIR   = u.devoir || DEVOIR_U1;
  const d = $('#seanceDetail'); if(d) d.innerHTML = '';
  renderSeances(); paintUniteHead(); renderStats();
  toast('📚 الوحدة ' + n + ' : ' + u.de + ' — ' + u.ar, 'ok');
}

function uniteSelector(){
  return '<div class="unite-sel">' + UNITES.map(u => {
    const dispo = !!(u.seances && u.seances.length);
    const st = loadSeancesFor(u.n);
    const done = (st.done || []).length;
    return '<button class="ucard' + (u.n === currentUnite ? ' on' : '') + (dispo ? '' : ' off') + '"' +
      (dispo ? ' data-unite="' + u.n + '"' : ' disabled') + '>' +
      '<div class="ucard-n">الوحدة ' + u.n + '</div>' +
      '<div class="ucard-de de-display">' + esc(u.de) + '</div>' +
      '<div class="ucard-ar">' + u.icon + ' ' + esc(u.ar) + '</div>' +
      '<div class="ucard-m"><span class="chip' + (dispo ? ' ok' : '') + '">' +
        (dispo ? done + '/' + u.seances.length + ' حصص' : '🔒 قريباً') + '</span>' +
        '<span class="chip">' + esc(u.cecrl) + '</span>' +
        '<span class="chip">⏱️ ' + Math.round(u.duree / 60) + ' س</span></div></button>';
  }).join('') + '</div>';
}

function paintUniteHead(){
  const u = uniteActive();
  const hd = $('#seancesHead');
  if(hd) hd.innerHTML = '<h1>📚 الوحدة ' + u.n + ' : <span class="de-display">' + esc(u.de) + '</span></h1>' +
    '<p>' + esc(u.ar) + ' — ' + u.seances.length + ' حصص · ' + Math.round(u.duree / 60) +
    ' ساعة · المستوى ' + esc(u.cecrl) + ' · البرنامج الرسمي MEN</p>' +
    '<div class="progress-wrap"><div class="progress" id="progSeances"></div></div>' +
    '<div class="progress-lbl" id="progLbl"></div>';
  const dt = $('#devoirTitle');
  if(dt) dt.innerHTML = '📝 فرض الوحدة ' + u.n + ' <span class="pill">/20</span>';
  const ds = $('#devoirSub');
  if(ds) ds.textContent = 'Évaluation — ' + u.de + ' · المدة : ' + u.duree +
                          ' دقيقة · التصحيح النموذجي + سلّم التنقيط';
  const p = $('#progSeances');
  if(p){
    const st = loadSeances();
    const pct = Math.round((st.done || []).length / u.seances.length * 100);
    p.style.width = pct + '%';
    const l = $('#progLbl');
    if(l) l.textContent = (st.done || []).length + ' / ' + u.seances.length + ' حصص · ' + pct + '%';
  }
}

/* ── Stockage isolé par unité ── */
function uniteKey(n){ return LS.seances + ':u' + (n || currentUnite); }
function loadSeancesFor(n){ return load(uniteKey(n), {done:[], exo:{}}); }
function loadSeances(){ return load(uniteKey(), {done:[], exo:{}}); }
function saveSeances(v){ store(uniteKey(), v); }


/* ─────────────── IA DU PROFESSEUR VIRTUEL ─────────────── */
const PROF = {
  nom:'Prof. Kharif Ahmed',
  base:[
    {k:['salut','bonjour','salam','السلام','مرحبا','hi','hallo','hey','bonsoir','صباح'],
     r:['وعليكم السلام يا ولدي 🇩🇿 <span class="de-in">Hallo! Wie geht es dir?</span>',
        'أهلاً بك! <span class="de-in">Guten Tag!</span> كيف حالك اليوم؟']},
    {k:['wie geht','كيف حالك','ça va','labas','لاباس','بخير'],
     r:['<span class="de-in">Mir geht es gut, danke! Und dir?</span> — بخير الحمد لله، و أنت؟',
        'الحمد لله. تذكّر: <span class="de-in">Wie geht es dir?</span> = كيف حالك؟ (غير رسمي)']},
    {k:['wie heißt','ما اسمك','اسمي','mon nom','name ist'],
     r:['<span class="de-in">Ich heiße Kharif Ahmed.</span> — و أنت؟ <span class="de-in">Wie heißt du?</span>',
        'للتعريف بالاسم: <span class="de-in">Ich heiße …</span> أو <span class="de-in">Mein Name ist …</span>']},
    {k:['wie alt','كم عمري','العمر','âge','jahre alt'],
     r:['<span class="de-in">Ich bin 16 Jahre alt.</span> — نستعمل <b>sein</b> وليس <b>haben</b> للحديث عن العمر!',
        'قاعدة ذهبية: <span class="de-in">Ich <b>bin</b> … Jahre alt.</span>']},
    {k:['sein','يكون','تصريف sein'],
     r:['تصريف <b>sein</b>: <span class="de-in">ich bin · du bist · er/sie/es ist · wir sind · ihr seid · sie/Sie sind</span>',
        'مثال: <span class="de-in">Ich <b>bin</b> algerisch.</span> = أنا جزائري.']},
    {k:['haben','يملك','تصريف haben'],
     r:['تصريف <b>haben</b>: <span class="de-in">ich habe · du hast · er/sie/es hat · wir haben · ihr habt · sie/Sie haben</span>',
        'مثال: <span class="de-in">Ich <b>habe</b> zwei Schwestern.</span> = لديّ أختان.']},
    {k:['woher','من أين','origine','herkunft','d’où','dou'],
     r:['<span class="de-in">Woher kommst du?</span> — <span class="de-in">Ich komme aus Algerien.</span>',
        'انتبه: <b>aus</b> إجبارية مع البلد.']},
    {k:['wo wohn','أين تسكن','wohnst','مدينة','ville'],
     r:['<span class="de-in">Wo wohnst du?</span> — <span class="de-in">Ich wohne in Bouira.</span>',
        'مع المدينة نستعمل <b>in</b>: <span class="de-in">Ich wohne <b>in</b> München.</span>']},
    {k:['familie','famille','عائلة','أخت','أخ','schwester','bruder','vater','mutter'],
     r:['العائلة: <span class="de-in">der Vater · die Mutter · die Schwester · der Bruder · die Eltern</span>',
        '<span class="de-in">Ich habe eine Schwester und zwei Brüder.</span> = لديّ أخت و أخوان.']},
    {k:['hobby','loisir','هواية','sport','musik','fußball'],
     r:['<span class="de-in">Meine Hobbys sind Fußball und Musik.</span>',
        'الهوايات: <span class="de-in">Fußball · Musik · Lesen · Schwimmen · Reisen</span>']},
    {k:['lena','texte','نص','فهم','leseverstehen'],
     r:['نص <b>Lena Fischer</b>: عمرها 16، من ألمانيا، تسكن في ميونيخ، لها أختان (Marie و Sophie).',
        'في فهم النص: أجب <b>بجملة كاملة</b> من النص — هذا ما يمنحك النقاط كاملة.']},
    {k:['tschüs','au revoir','مع السلامة','wiedersehen','à bientôt'],
     r:['<span class="de-in">Auf Wiedersehen!</span> (رسمي) أو <span class="de-in">Tschüs!</span> (غير رسمي)',
        'و إلى اللقاء يا ولدي — <span class="de-in">Bis bald!</span>']},
    {k:['danke','شكرا','merci'],
     r:['<span class="de-in">Bitte schön!</span> — العفو 🇩🇿','<span class="de-in">Gern geschehen!</span> — على الرحب و السعة.']},
    {k:['bac','baccalauréat','بكالوريا','نجاح','réussir'],
     r:['السرّ في النجاح: <b>20 دقيقة يومياً</b> + مراجعة المفردات بصوت عالٍ. 98% من تلاميذي نجحوا بهذه الطريقة.',
        'نصيحتي: أتقن <b>sein</b> و <b>haben</b> أولاً، ثم الباقي يأتي بسهولة.']},
    {k:['corrige','صحح','تصحيح','note','نقطة','bareme','barème'],
     r:['التصحيح النموذجي في قسم <b>📝 الفرض</b> — اضغط «إظهار التصحيح» بعد محاولة الحل.',
        'في المحاكاة، التصحيح آلي وفوري والنتيجة تبقى <b>سرّية</b> على جهازك.']},
    {k:['inscription','تسجيل','حجز','prix','ثمن','واتساب','whatsapp','gratuit'],
     r:['للتسجيل: واتساب <b>0555 57 79 31</b> — ابعث اسمك + «حصّة ألماني مجانية». 🎁 الحصّة الأولى مجانية حتى 30 سبتمبر 2026.',
        'الأماكن محدودة يا ولدي — الأولوية للتسجيل.']}
  ],
  fallback:[
    'سؤال جيد! اشرح لي أكثر، أو اسألني عن: <span class="de-in">sein</span>، <span class="de-in">haben</span>، العائلة، أو نص Lena Fischer.',
    'لم أفهم تماماً — تذكّر أسئلة الوحدة 1: <span class="de-in">Wie heißt du? Woher kommst du? Wie alt bist du?</span>',
    '«الرجوع إلى الأصل فضيلة» — عُد إلى الحصة المناسبة في قسم 📚 الحصص ثم اسألني مجدداً.',
    'جرّب أن تكتب جملتك بالألمانية وسأصحّحها فوراً. مثال: <span class="de-in">Ich bin 16 Jahre alt.</span>'
  ],

  /* Correction automatique d'une phrase allemande (règles de l'unité 1) */
  corriger(txt){
    const s = String(txt || '').trim();
    if(!s || !/[a-zA-ZäöüßÄÖÜ]/.test(s)) return null;
    const low = ' ' + s.toLowerCase().replace(/\s+/g,' ') + ' ';
    const errs = [];
    if(/\bich (bist|ist|seid)\b/.test(low))       errs.push('<span class="de-in">ich</span> → <b>bin</b>.');
    if(/\bich (hast|hat|habt|haben)\b/.test(low)) errs.push('<span class="de-in">ich</span> → <b>habe</b>.');
    if(/\bdu (bin|ist|sind|seid)\b/.test(low))    errs.push('<span class="de-in">du</span> → <b>bist</b>.');
    if(/\bdu (habe|hat|habt|haben)\b/.test(low))  errs.push('<span class="de-in">du</span> → <b>hast</b>.');
    if(/\b(er|sie|es) (bin|bist|sind|seid)\b/.test(low)) errs.push('<span class="de-in">er/sie/es</span> → <b>ist</b>.');
    if(/\b(er|sie|es) (habe|hast|habt|haben)\b/.test(low)) errs.push('<span class="de-in">er/sie/es</span> → <b>hat</b>.');
    if(/\bwir (bin|bist|ist|seid)\b/.test(low))   errs.push('<span class="de-in">wir</span> → <b>sind</b>.');
    if(/\bihr (bin|bist|ist|sind)\b/.test(low))   errs.push('<span class="de-in">ihr</span> → <b>seid</b>.');
    if(/\bihr (habe|hast|hat|haben)\b/.test(low)) errs.push('<span class="de-in">ihr</span> → <b>habt</b>.');
    if(/^\s*ich\b/.test(s)===false && /\sich\s/.test(low))
      errs.push('«ich» s’écrit en <b>minuscule</b> au milieu de la phrase, et <b>Ich</b> en début de phrase.');
    if(/\b\d+\s*jahre\b/.test(low) && /\bhabe\b/.test(low))
      errs.push('L’âge se dit avec <b>sein</b> : <span class="de-in">Ich <b>bin</b> 16 Jahre alt.</span>');
    if(/\bkomme?\s+(?!aus\b|von\b)[a-zäöü]/.test(low))
      errs.push('Après <span class="de-in">kommen</span> il faut <b>aus</b> : <span class="de-in">Ich komme <b>aus</b> Algerien.</span>');
    if(/\bwohne?\s+(?!in\b|bei\b|am\b)[a-zäöü]/.test(low))
      errs.push('Après <span class="de-in">wohnen</span> il faut <b>in</b> : <span class="de-in">Ich wohne <b>in</b> Bouira.</span>');
    if(/\bjahre\b/.test(low) && !/\balt\b/.test(low)) errs.push('N’oublie pas <b>alt</b> : <span class="de-in">Jahre alt</span>.');
    if(!/[.!?]$/.test(s)) errs.push('Termine ta phrase par un point <b>.</b> — c’est noté en «Écriture».');
    if(!errs.length) return {ok:true, msg:'✅ <b>Sehr gut!</b> الجملة صحيحة 100% — واصل هكذا يا ولدي 🇩🇪'};
    return {ok:false, msg:'🔍 <b>تصحيح الأستاذ :</b><br>• ' + errs.slice(0,4).join('<br>• ')};
  },

  repondre(txt){
    const s = String(txt || '').toLowerCase();
    const c = PROF.corriger(txt);
    if(c) return c.msg;
    for(const it of PROF.base){
      if(it.k.some(k => s.indexOf(k.toLowerCase()) !== -1))
        return it.r[Math.floor(Math.random() * it.r.length)];
    }
    return PROF.fallback[Math.floor(Math.random() * PROF.fallback.length)];
  }
};

/* ─────────────── UTILITAIRES ─────────────── */
const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

function store(k, v){
  try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch(e){}
}
function load(k, d){
  try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch(e){ return d; }
}
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

let toastTimer = null;
function toast(msg, type){
  const el = $('#toast'); if(!el) return;
  el.className = 'toast on ' + (type || ''); el.innerHTML = msg; el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.hidden = true, 320); }, 3200);
}

/* ─────────────── SYNTHÈSE VOCALE ALLEMANDE ─────────────── */
let voicesDE = [];
function loadVoices(){
  if(!('speechSynthesis' in window)) return;
  voicesDE = speechSynthesis.getVoices().filter(v => /^de/i.test(v.lang));
}
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
let soundOn = load(LS.sound, true);

function speak(text){
  if(!('speechSynthesis' in window)){ toast('🔇 النطق غير مدعوم في هذا المتصفح','ko'); return; }
  if(!soundOn){ toast('🔇 النطق الصوتي مُعطَّل','ko'); return; }
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,''));
    u.lang = 'de-DE'; u.rate = 0.86; u.pitch = 1;
    if(voicesDE.length) u.voice = voicesDE[0];
    speechSynthesis.speak(u);
  }catch(e){ toast('⚠️ تعذّر النطق','ko'); }
}

/* ─────────────── NAVIGATION ─────────────── */
const VIEWS = ['accueil','seances','live','classe','grammaire','biblio','examen','devoir','simulation','prof','parents','profboard','compte'];
const TABS  = [['accueil','🏠 الرئيسية'],['seances','📚 الحصص'],
               ['live','📹 القاعة المباشرة'],
               ['classe','🏫 القسم'],['grammaire','📘 القواعد'],['biblio','🗂️ المكتبة'],
               ['examen','🎓 البكالوريا'],
               ['devoir','📝 الفرض'],['simulation','⏱️ المحاكاة'],
               ['prof','🤖 الأستاذ'],['parents','👨‍👩‍👧 الأولياء'],['compte','⚙️ حسابي']];

/* Onglet réservé au rôle « prof » — inséré avant « حسابي » */
function allTabs(){
  const t = TABS.slice();
  if(window.AUTH && AUTH.session){
    const s = AUTH.session();
    if(s && s.role === 'prof') t.splice(t.length - 1, 0, ['profboard','🧑‍🏫 لوحة الأستاذ']);
  }
  return t;
}
function isProf(){
  try{ const s = window.AUTH && AUTH.session ? AUTH.session() : null; return !!(s && s.role === 'prof'); }
  catch(e){ return false; }
}
let currentView = 'accueil';

function renderTabs(){
  const c = $('#tabs'); if(!c) return;
  c.innerHTML = allTabs().map(t =>
    '<button class="tab' + (t[0] === currentView ? ' on' : '') + '" data-go="' + t[0] + '">' + t[1] + '</button>'
  ).join('');
}

function go(view){
  if(VIEWS.indexOf(view) === -1) view = 'accueil';
  currentView = view;
  $$('.view').forEach(s => { s.hidden = s.dataset.view !== view; });
  renderTabs();
  const tb = $('#tabs'); if(tb) tb.classList.remove('open');
  window.scrollTo({top:0, behavior:'smooth'});
  document.dispatchEvent(new CustomEvent('dz:view', { detail: view }));
  if(view === 'seances'){ renderSeances(); paintUniteHead(); }
  if(view === 'biblio' && window.renderBiblio) window.renderBiblio();
  if(view === 'examen' && window.renderExamen) window.renderExamen();
  if(view === 'live' && window.renderLive) window.renderLive();
  if(view === 'classe' && window.renderClasse) window.renderClasse();
  if(view === 'grammaire' && window.renderGrammaire) window.renderGrammaire();
  if(view === 'devoir')     renderDevoir();
  if(view === 'simulation') renderSim();
  if(view === 'parents')    renderParents();
  if(view === 'compte')     renderCompte();
  if(view === 'profboard' && window.renderProfBoard) window.renderProfBoard();
  const mp = $('#miniProf'); if(mp) mp.hidden = !isProf();
  if(view === 'prof'){ const l = $('#chatLog'); if(l && l.children.length === 0) initChat(); }
  if(view === 'accueil')    renderStats();
}

/* ─────────────── ACCUEIL : STATISTIQUES ─────────────── */
function renderStats(){
  const st   = loadSeances();
  const done = (st.done || []).length;
  const sim  = load(LS.sim, {});
  const best = (sim.best !== undefined && sim.best !== null) ? sim.best + '/20' : '—';
  const el = $('#statsHome'); if(!el) return;
  el.innerHTML = [[done + '/8','حصص مكتملة'],[DEVOIR.total,'نقطة في الفرض'],
                  [best,'أفضل نتيجة'],['0555…7931','واتساب']]
    .map(s => '<div class="stat"><div class="stat-n">' + s[0] + '</div><div class="stat-l">' + s[1] + '</div></div>')
    .join('');
}

/* ─────────────── SÉANCES ─────────────── */
function renderSeances(){
  const st   = loadSeances();
  const done = st.done || [];
  const g = $('#seancesGrid'); if(!g) return;

  g.innerHTML = uniteSelector() +
    '<h2>📖 الوحدة ' + uniteActive().n + ' : <span class="de-display">' +
    esc(uniteActive().de) + '</span> — ' + esc(uniteActive().ar) + '</h2>' +
    SEANCES.map(s => {
    const isDone = done.indexOf(s.n) !== -1;
    const locked = s.n > 1 && done.indexOf(s.n - 1) === -1 && !isDone;
    const meta = s.ex === 'devoir'
      ? '<span class="chip ex">📝 اختبار /20</span>'
      : '<span class="chip">' + ((s.exos || []).length) + ' تمرين</span>';
    return '<div class="seance' + (isDone ? ' done' : '') + (locked ? ' lock' : '') + '" data-seance="' + s.n + '">'
      + '<div class="s-num">' + (isDone ? '✓' : s.n) + '</div><div class="s-body">'
      + '<div class="s-t">' + (locked ? '🔒 ' : '') + 'الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</div>'
      + '<div class="s-d">' + esc(s.de) + '</div>'
      + '<div class="s-meta"><span class="chip">⏱️ ' + s.dur + ' د</span>' + meta
      + (isDone ? '<span class="chip ok">✅ مكتملة</span>' : '') + '</div></div></div>';
  }).join('');

  const pct = Math.round(done.length / SEANCES.length * 100);
  const p = $('#progSeances'); if(p) p.style.width = pct + '%';
  const l = $('#progLbl'); if(l) l.textContent = done.length + ' / ' + SEANCES.length + ' حصص · ' + pct + '%';
}

function openSeance(n){
  const s = SEANCES.filter(x => x.n === n)[0]; if(!s) return;
  const st = loadSeances();
  st.done = st.done || []; st.exo = st.exo || {};
  const box = $('#seanceDetail'); if(!box) return;

  let h = '<div class="card detail" data-n="' + s.n + '">'
    + '<div class="detail-h"><div><h2 style="margin:0">الحصة ' + s.n + '/8 — ' + esc(s.ar) + '</h2>'
    + '<div class="s-d" style="margin-top:3px">' + esc(s.de) + ' · ⏱️ ' + s.dur + ' د</div></div>'
    + '<button class="close-x" id="closeDetail">✕</button></div>';

  if(s.ex === 'devoir'){
    h += '<p style="color:var(--m);font-size:13.5px;margin-bottom:13px">هذه الحصة هي الفرض الكتابي — الوحدة 1 (/20).</p>'
       + '<button class="btn btn-g btn-block" data-go="devoir">📝 الانتقال إلى الفرض</button></div>';
    box.innerHTML = h; box.scrollIntoView({behavior:'smooth', block:'start'}); return;
  }

  if(s.obj) h += '<div class="gram"><h4>🎯 أهداف الحصة</h4><ul style="margin:0 20px;font-size:13px;color:var(--m)">'
    + s.obj.map(o => '<li>' + esc(o) + '</li>').join('') + '</ul></div>';
  if(s.texte) h += s.texte;
  if(s.consigne) h += s.consigne;

  if(s.lex) h += '<h3 style="margin:17px 0 10px">🔑 المفردات — Wortschatz '
    + '<button class="btn btn-o btn-sm" id="speakAll" style="margin-right:8px">🔊 استمع للكل</button></h3>'
    + '<div class="lex">' + s.lex.map(p =>
        '<div class="lex-i"><div><div class="lex-de">' + esc(p[0]) + '</div>'
      + '<div class="lex-ar">' + esc(p[1]) + '</div></div>'
      + '<button class="speak" data-speak="' + esc(p[0]) + '">🔊</button></div>').join('') + '</div>';

  if(s.gram){
    h += '<div class="gram" style="margin-top:17px"><h4>📘 القاعدة — Grammatik : ' + esc(s.gram.t) + '</h4>';
    if(s.gram.b) h += '<ul style="margin:0 20px;font-size:13px;color:var(--m)">'
      + s.gram.b.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    if(s.gram.tbl) h += '<table class="conj"><tr><th>Pronom</th><th>Forme</th></tr>'
      + s.gram.tbl.map(r => '<tr><td>' + r[0] + '</td><td><b>' + r[1] + '</b></td></tr>').join('') + '</table>';
    if(s.gram.ex) h += '<div style="margin-top:11px;font-size:13.5px;color:var(--g)">' + s.gram.ex + '</div>';
    h += '</div>';
  }
  if(s.modele) h += s.modele;

  if(s.exos && s.exos.length){
    h += '<h3 style="margin:19px 0 11px">✏️ تمارين — Übungen</h3>';
    s.exos.forEach((e, i) => {
      const key = 's' + s.n + '_e' + i, saved = st.exo[key];
      if(e.type === 'texte'){
        h += '<div class="exo" data-exo="' + key + '"><div class="q-t">' + e.q + '</div>'
           + '<textarea class="txt-in" id="in_' + key + '" placeholder="' + esc(e.ph || '') + '">'
           + esc((saved && saved.val) || '') + '</textarea>'
           + '<button class="btn btn-o btn-sm" data-check="' + key + '" style="margin-top:9px">🤖 صحّح مع الأستاذ</button>'
           + '<div class="fbk" id="fb_' + key + '"></div></div>';
      } else {
        h += '<div class="exo" data-exo="' + key + '"><div class="q-t"><span class="q-n">' + (i+1) + '</span>' + e.q + '</div>'
           + '<div class="opts">' + e.opts.map((o, oi) =>
               '<button class="opt' + (saved && saved.a === oi ? (oi === e.a ? ' ok' : ' ko') : '') + '" data-opt="' + oi + '"'
             + (saved ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') + '</div>'
           + '<div class="fbk' + (saved ? ' show ' + (saved.a === e.a ? 'ok' : 'ko') : '') + '" id="fb_' + key + '">'
           + (saved ? (saved.a === e.a ? '✅ ' : '❌ ') + e.why : '') + '</div></div>';
      }
    });
  }

  const fini = st.done.indexOf(s.n) !== -1;
  h += '<button class="btn btn-g btn-block" id="markDone"' + (fini ? ' disabled' : '') + '>'
     + (fini ? '✅ الحصة مكتملة' : '✔️ إنهاء الحصة') + '</button></div>';

  box.innerHTML = h;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}

function currentSeanceNum(){
  const d = $('#seanceDetail .detail'); return d ? +d.dataset.n : null;
}

/* ─────────────── EXERCICES ─────────────── */
function handleOpt(btn){
  const box = btn.closest('[data-exo]'); if(!box) return;
  const key = box.dataset.exo, m = key.match(/^s(\d+)_e(\d+)$/); if(!m) return;
  const s = SEANCES.filter(x => x.n === +m[1])[0]; if(!s) return;
  const e = s.exos[+m[2]]; if(!e) return;
  const chosen = +btn.dataset.opt;

  $$('.opt', box).forEach(o => {
    o.disabled = true;
    if(+o.dataset.opt === e.a) o.classList.add('ok');
    else if(+o.dataset.opt === chosen) o.classList.add('ko');
  });
  const fb = $('#fb_' + key, box);
  if(fb){ fb.className = 'fbk show ' + (chosen === e.a ? 'ok' : 'ko');
          fb.innerHTML = (chosen === e.a ? '✅ إجابة صحيحة! ' : '❌ إجابة خاطئة. ') + e.why; }

  const st = loadSeances(); st.exo = st.exo || {};
  st.exo[key] = {a:chosen, ok:chosen === e.a}; saveSeances(st);
  renderStats();
}

function handleTextCheck(key){
  const ta = $('#in_' + key); if(!ta) return;
  const val = ta.value.trim(), fb = $('#fb_' + key);
  if(!val){ if(fb){ fb.className = 'fbk show ko'; fb.innerHTML = '✍️ اكتب شيئاً أولاً!'; } return; }
  const rep = PROF.repondre(val), ok = rep.indexOf('✅') === 0;
  if(fb){ fb.className = 'fbk show ' + (ok ? 'ok' : 'ko'); fb.innerHTML = rep; }
  const st = loadSeances(); st.exo = st.exo || {};
  st.exo[key] = {val:val, ok:ok}; saveSeances(st);
  renderStats();
}

function markSeanceDone(){
  const n = currentSeanceNum(); if(!n) return;
  const st = loadSeances(); st.done = st.done || [];
  if(st.done.indexOf(n) === -1){
    st.done.push(n); saveSeances(st);
    toast('🎉 أحسنت! تم إنهاء الحصة ' + n + '/8', 'ok');
  }
  renderSeances(); renderStats(); openSeance(n);
  const nxt = SEANCES.filter(x => x.n === n + 1)[0];
  if(nxt) setTimeout(() => toast('👈 التالي : الحصة ' + nxt.n + ' — ' + nxt.ar), 1500);
  else setTimeout(() => toast('🏆 أكملت الوحدة 1 بالكامل!'), 1500);
}

/* ─────────────── DEVOIR /20 ─────────────── */
function renderDevoir(){
  const box = $('#devoirBody'); if(!box) return;
  const st = load(LS.devoir, {showCorr:false, ans:{}});

  let h = '<div class="privacy">📋 <b>' + DEVOIR.titre + '</b> — المدة ' + DEVOIR.duree
        + ' دقيقة · المجموع <b>' + DEVOIR.total + '/20</b> · الوحدة 1 : Sich vorstellen</div>';

  DEVOIR.parties.forEach(p => {
    h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + p.t + '</b>'
       + '<span class="note">' + p.pts + ' pts</span></div><div class="part-b">';
    if(p.texte) h += p.texte;
    p.questions.forEach(q => {
      h += '<div class="q" data-q="' + q.id + '"><div class="q-t"><span class="q-n">' + q.id + '</span>'
         + q.t + ' <span class="note" style="font-size:11px">' + q.pts + ' pt' + (q.pts > 1 ? 's' : '') + '</span></div>';
      if(q.type === 'vf'){
        h += '<div class="opts">' + ['Richtig (صحيح)','Falsch (خطأ)'].map((o, i) =>
             '<button class="opt" data-vf="' + i + '">' + o + '</button>').join('') + '</div>';
      } else if(q.type === 'qcm'){
        h += '<div class="opts">' + q.opts.map((o, i) =>
             '<button class="opt" data-qcm="' + i + '">' + esc(o) + '</button>').join('') + '</div>';
      } else if(q.type === 'txt'){
        h += '<input class="txt-in" style="min-height:44px" data-txt="' + q.id + '" placeholder="…">';
      } else if(q.type === 'redac'){
        h += '<textarea class="txt-in" data-redac="' + q.id + '" placeholder="Hallo! Ich heiße …"></textarea>';
        if(q.grille) h += '<table class="bareme"><tr><th>معيار التصحيح</th><th>النقطة</th></tr>'
          + q.grille.map(g => '<tr><td>' + g[0] + '</td><td>' + g[1] + '</td></tr>').join('') + '</table>';
      }
      h += '<div class="fbk" id="dfb_' + q.id + '"></div></div>';
    });
    h += '</div></div>';
  });

  h += '<div style="display:flex;gap:11px;flex-wrap:wrap">'
     + '<button class="btn btn-p" id="btnCorrDevoir">✅ إظهار التصحيح النموذجي</button>'
     + '<button class="btn btn-o" id="btnSimFromDevoir">⏱️ اجتازه كمحاكاة مُوقَّتة</button></div>'
     + '<div id="corrigeDevoir"></div>';

  box.innerHTML = h;
  if(st.showCorr) showCorrigeDevoir();
}

function showCorrigeDevoir(){
  const c = $('#corrigeDevoir'); if(!c || c.innerHTML) return;
  let h = '<div class="corrige"><h3>✅ التصحيح النموذجي — Corrigé type + سلّم التنقيط</h3>';
  DEVOIR.parties.forEach(p => {
    h += '<div style="margin-bottom:15px"><b style="color:var(--a2)">' + p.id + '. ' + p.t
       + ' <span class="note">' + p.pts + ' pts</span></b>';
    p.questions.forEach(q => {
      let rep = '';
      if(q.type === 'vf')  rep = q.rep;
      if(q.type === 'qcm') rep = q.opts[q.a] + '  —  ' + q.why;
      if(q.type === 'txt') rep = q.rep;
      if(q.type === 'redac') rep = (q.modele || '');
      h += '<div style="padding:8px 0;border-bottom:1px dashed var(--b);font-size:13px">'
         + '<b class="de-in">' + q.id + '</b> ' + (q.type === 'redac' ? '' : esc(q.t)) + '<br>'
         + '<span style="color:var(--g)">' + rep + '</span>'
         + (q.just ? '<br><span style="color:var(--m);font-size:12px">📌 ' + q.just + '</span>' : '') + '</div>';
    });
    h += '</div>';
  });
  h += '<table class="bareme"><tr><th>الجزء</th><th>المحتوى</th><th>النقاط</th></tr>'
     + DEVOIR.parties.map(p => '<tr><td><b>' + p.id + '</b></td><td>' + p.t + '</td><td>' + p.pts + '</td></tr>').join('')
     + '<tr style="background:rgba(61,220,132,.1)"><td colspan="2"><b>المجموع</b></td><td><b>' + DEVOIR.total + '</b></td></tr></table>'
     + '</div>';
  c.innerHTML = h;
  const st = load(LS.devoir, {}); st.showCorr = true; store(LS.devoir, st);
  c.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ─────────────── CHAT — PROFESSEUR VIRTUEL ─────────────── */
const SUGS = ['Wie heißt du?','Conjugue sein','Conjugue haben','Woher kommst du?',
              'صحّح : Ich bin 16 Jahre alt','Qui est Lena Fischer?','كيف أسجّل؟'];

function initChat(){
  const log = $('#chatLog'); if(!log) return;
  const hist = load(LS.chat, []);
  if(hist.length){
    hist.slice(-30).forEach(m => addMsg(m.who, m.txt, true));
  } else {
    addMsg('bot', 'السلام عليكم يا ولدي 🇩🇿 أنا <b>الأستاذ خريف أحمد</b> الافتراضي.<br>'
      + 'اسألني بالألمانية أو بالعربية عن الوحدة 1 : <span class="de-in">sein</span>، '
      + '<span class="de-in">haben</span>، العائلة، أو اكتب جملة وسأصحّحها لك.<br>'
      + '<span class="de-in">Also — wie geht es dir?</span>');
  }
  const sg = $('#chatSug');
  if(sg) sg.innerHTML = SUGS.map(s => '<button class="sug" data-sug="' + esc(s) + '">' + esc(s) + '</button>').join('');
  const f = $('#chatForm');
  if(f && !f.dataset.bound){
    f.dataset.bound = '1';
    f.addEventListener('submit', ev => {
      ev.preventDefault();
      const i = $('#chatInput'); const v = (i.value || '').trim(); if(!v) return;
      i.value = ''; sendChat(v);
    });
  }
}

function addMsg(who, txt, noSave){
  const log = $('#chatLog'); if(!log) return;
  const d = document.createElement('div');
  d.className = 'msg ' + (who === 'me' ? 'me' : 'bot');
  d.innerHTML = '<div class="who">' + (who === 'me' ? '🧑‍🎓 أنت' : '👨‍🏫 ' + PROF.nom) + '</div>' + txt;
  log.appendChild(d); log.scrollTop = log.scrollHeight;
  if(!noSave){
    const h = load(LS.chat, []); h.push({who:who, txt:txt});
    store(LS.chat, h.slice(-60));
  }
  return d;
}

function sendChat(v){
  addMsg('me', esc(v));
  const log = $('#chatLog');
  const tp = document.createElement('div');
  tp.className = 'msg bot typing'; tp.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(tp); log.scrollTop = log.scrollHeight;
  setTimeout(() => {
    tp.remove();
    const rep = PROF.repondre(v);
    addMsg('bot', rep);
    if(soundOn && /de-in/.test(rep)){
      const m = rep.match(/<span class="de-in">([^<]+)<\/span>/);
      if(m) speak(m[1].replace(/<[^>]+>/g,''));
    }
  }, 480 + Math.random() * 420);
}

/* ─────────────── INITIALISATION ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { const sp = $('#splash'); if(sp) sp.classList.add('off'); }, 900);
  bootGate();

  document.addEventListener('click', ev => {
    const un = ev.target.closest('[data-unite]');
    if(un){ selectUnite(+un.dataset.unite); return; }

    const sug = ev.target.closest('[data-sug]');
    if(sug){ sendChat(sug.dataset.sug); return; }

    const g = ev.target.closest('[data-go]');
    if(g){ ev.preventDefault(); go(g.dataset.go); return; }

    const sc = ev.target.closest('[data-seance]');
    if(sc){
      if(sc.classList.contains('lock')){ toast('🔒 أكمل الحصة السابقة أولاً','ko'); return; }
      openSeance(+sc.dataset.seance); return;
    }
    if(ev.target.closest('#closeDetail')){ const d = $('#seanceDetail'); if(d) d.innerHTML = ''; return; }

    const sp = ev.target.closest('[data-speak]');
    if(sp){ speak(sp.dataset.speak); sp.classList.add('talk');
            setTimeout(() => sp.classList.remove('talk'), 900); return; }

    if(ev.target.closest('#speakAll')){
      const n = currentSeanceNum(); const s = SEANCES.filter(x => x.n === n)[0];
      if(s && s.lex){ let i = 0;
        const t = setInterval(() => { if(i >= s.lex.length){ clearInterval(t); return; }
          speak(s.lex[i][0]); i++; }, 1500); }
      return;
    }

    const op = ev.target.closest('.opt');
    if(op && !op.disabled){
      if(op.dataset.opt !== undefined) handleOpt(op);
      else if(op.dataset.vf  !== undefined) answerVF(op);
      else if(op.dataset.qcm !== undefined) answerQCM(op);
      return;
    }
    const ck = ev.target.closest('[data-check]');
    if(ck){ handleTextCheck(ck.dataset.check); return; }
    if(ev.target.closest('#markDone')){ markSeanceDone(); return; }
    if(ev.target.closest('#btnCorrDevoir')){ showCorrigeDevoir(); return; }
    if(ev.target.closest('#btnSimFromDevoir')){ go('simulation'); return; }
  });

  const b = $('#btnBurger');
  if(b) b.addEventListener('click', () => { const t = $('#tabs'); if(t) t.classList.toggle('open'); });

  const bs = $('#btnSound');
  if(bs){
    const sync = () => bs.classList.toggle('muted', !soundOn);
    sync();
    bs.addEventListener('click', () => {
      soundOn = !soundOn; store(LS.sound, soundOn); sync();
      toast(soundOn ? '🔊 النطق مُفعَّل' : '🔇 النطق مُعطَّل', soundOn ? 'ok' : '');
      if(soundOn) speak('Guten Tag!');
    });
  }

  const dot = $('#netDot'), ban = $('#offlineBanner');
  const net = () => { const on = navigator.onLine;
    if(dot) dot.classList.toggle('off', !on); if(ban) ban.hidden = on; };
  window.addEventListener('online',  () => { net(); toast('🟢 عادت الاتصال','ok'); });
  window.addEventListener('offline', () => { net(); toast('📴 وضع عدم الاتصال','ko'); });
  net();

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    const bi = $('#btnInstall'); if(bi) bi.hidden = false;
  });
  const bi = $('#btnInstall');
  if(bi) bi.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const res = await deferredPrompt.userChoice;
    if(res && res.outcome === 'accepted'){ bi.hidden = true; toast('✅ تم تثبيت التطبيق','ok'); }
    deferredPrompt = null;
  });

  if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        reg.addEventListener('updatefound', () => toast('🔄 تحديث جديد قيد التنزيل…'));
      }).catch(() => {});
    });
  }

  renderSeances();
});

/* ── Réponses du devoir (VF / QCM) — utilisées par modules.js ── */
function answerVF(btn){
  const q = btn.closest('[data-q]'); if(!q) return;
  const id = q.dataset.q, chosen = +btn.dataset.vf;
  let found = null;
  DEVOIR.parties.forEach(p => p.questions.forEach(x => { if(x.id === id) found = x; }));
  if(!found) return;
  const correct = (chosen === 0) === (found.rep === 'Richtig');
  $$('.opt', q).forEach(o => { o.disabled = true; });
  btn.classList.add(correct ? 'ok' : 'ko');
  const fb = $('#dfb_' + id, q);
  if(fb){ fb.className = 'fbk show ' + (correct ? 'ok' : 'ko');
          fb.innerHTML = (correct ? '✅ ' : '❌ ') + 'Réponse : <b>' + found.rep + '</b> — ' + found.just; }
  const st = load(LS.devoir, {ans:{}}); st.ans = st.ans || {};
  st.ans[id] = {v:chosen, ok:correct, pts:correct ? found.pts : 0}; store(LS.devoir, st);
}

function answerQCM(btn){
  const q = btn.closest('[data-q]'); if(!q) return;
  const id = q.dataset.q, chosen = +btn.dataset.qcm;
  let found = null;
  DEVOIR.parties.forEach(p => p.questions.forEach(x => { if(x.id === id) found = x; }));
  if(!found) return;
  const correct = chosen === found.a;
  $$('.opt', q).forEach(o => { o.disabled = true;
    if(+o.dataset.qcm === found.a) o.classList.add('ok'); });
  if(!correct) btn.classList.add('ko');
  const fb = $('#dfb_' + id, q);
  if(fb){ fb.className = 'fbk show ' + (correct ? 'ok' : 'ko');
          fb.innerHTML = (correct ? '✅ ' : '❌ ') + found.why; }
  const st = load(LS.devoir, {ans:{}}); st.ans = st.ans || {};
  st.ans[id] = {v:chosen, ok:correct, pts:correct ? found.pts : 0}; store(LS.devoir, st);
}

/* ══════════ PORTAIL DE CONNEXION ══════════ */
function bootGate(){
  const gate = $('#gate'), shell = $('#shell');
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;

  if(window.AUTH){
    try{
      const ref = (window.BDD && BDD.state.ref && BDD.state.ref.items && BDD.state.ref.items[0]) || null;
      AUTH.initSelects(ref ? ref.wilayas : null);
    }catch(e){ AUTH.initSelects(null); }
  }

  if(s){ enterApp(s); return; }

  if(shell) shell.hidden = true;
  if(!gate) return;
  gate.hidden = false;
  paintGateStats();

  if(window.BDD && !BDD.state.ready && !BDD.state._loading){
    BDD.state._loading = true;
    BDD.load(null).then(() => {
      paintGateStats();
      try{
        const r = BDD.state.ref && BDD.state.ref.items ? BDD.state.ref.items[0] : null;
        AUTH.initSelects(r ? r.wilayas : null);
      }catch(e){}
      const c = $('#cBdd'); if(c && BDD.state.ready) c.textContent = BDD.kpis().total;
    });
  }
}

function paintGateStats(){
  const el = $('#gateStats'); if(!el) return;
  const a = window.AUTH ? AUTH.stats() : { comptes:0, sections:5, eleves:142, wilayas:58 };
  const bdd = (window.BDD && BDD.state.ready) ? BDD.kpis().total : 684;
  el.innerHTML = [[bdd,'وثيقة'],[a.eleves,'تلميذ'],[a.sections,'أقسام'],[a.wilayas,'ولاية']]
    .map(x => '<div class="gstat"><div class="gstat-n">' + x[0] + '</div>' +
              '<div class="gstat-l">' + x[1] + '</div></div>').join('');
}

function enterApp(s){
  const gate = $('#gate'), shell = $('#shell');
  if(gate) gate.hidden = true;
  if(shell) shell.hidden = false;
  renderTabs(); renderStats(); renderWelcome(); renderSectionBar(); renderUserChip();
  const mp0 = $('#miniProf'); if(mp0) mp0.hidden = !isProf();
  const c = $('#cBdd');
  if(c && window.BDD && BDD.state.ready) c.textContent = BDD.kpis().total;
  bindGateEvents();
  const hash = String(location.hash || '').replace('#','');
  go(VIEWS.indexOf(hash) !== -1 ? hash : 'accueil');
}

function bindGateEvents(){
  if(bindGateEvents._done) return;
  bindGateEvents._done = true;

  $$('.gtab').forEach(b => b.addEventListener('click', () => {
    $$('.gtab').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const isLogin = b.dataset.gate === 'login';
    const lf = $('#loginForm'), sf = $('#signupForm');
    if(lf) lf.hidden = !isLogin;
    if(sf) sf.hidden = isLogin;
  }));

  [['#eye1','#loginPass'],['#eye2','#suPass']].forEach(p => {
    const e = $(p[0]), i = $(p[1]);
    if(e && i) e.addEventListener('click', () => {
      i.type = i.type === 'password' ? 'text' : 'password';
      e.textContent = i.type === 'password' ? '👁️' : '🙈';
    });
  });

  const lf = $('#loginForm');
  if(lf) lf.addEventListener('submit', ev => {
    ev.preventDefault();
    const err = $('#loginErr'); if(err) err.hidden = true;
    const r = AUTH.login($('#loginUser').value, $('#loginPass').value, $('#loginClasse').value);
    if(r.ok){ toast('🎉 أهلاً بك ' + r.session.nom + ' — القسم ' + r.session.classe_ar, 'ok');
              enterApp(r.session); }
    else if(err){ err.hidden = false; err.textContent = r.err; }
  });

  const bd = $('#btnDemo');
  if(bd) bd.addEventListener('click', () => {
    const u = $('#loginUser'), p = $('#loginPass');
    if(u) u.value = 'ahmed'; if(p) p.value = '1234';
    if(lf) lf.dispatchEvent(new Event('submit', { cancelable:true }));
  });

  const sf = $('#signupForm');
  if(sf) sf.addEventListener('submit', ev => {
    ev.preventDefault();
    const err = $('#suErr'); if(err) err.hidden = true;
    const w = String($('#suWilaya').value || '').split('|');
    const niv = $('#suNiveau').value;
    const r = AUTH.signup({
      nom:$('#suName').value, mail:$('#suMail').value, pass:$('#suPass').value,
      niveau:niv, filiere:$('#suFiliere').value,
      wilaya:w[1] || 'Bouira', code_wilaya:w[0] || '10',
      role:$('#suRole').value, classe:niv + '-1'
    });
    if(r.ok){ toast('✅ تم إنشاء حسابك — أهلاً ' + r.session.nom, 'ok'); enterApp(r.session); }
    else if(err){ err.hidden = false; err.textContent = r.err; }
  });

  const uc = $('#userChip');
  if(uc) uc.addEventListener('click', () => go('compte'));

  document.addEventListener('dz:auth', e => {
    if(!e.detail){
      const sh = $('#shell'), gt = $('#gate');
      if(sh) sh.hidden = true;
      if(gt){ gt.hidden = false; paintGateStats(); }
    } else { renderUserChip(); renderSectionBar(); renderWelcome(); renderStats(); }
  });
}

/* ══════════ BANDEAU DE BIENVENUE ══════════ */
function renderWelcome(){
  const el = $('#welcomeBox'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const h = new Date().getHours();
  const salut = h < 12 ? 'صباح الخير' : 'مساء الخير';
  const de = h < 12 ? 'Guten Morgen' : (h < 18 ? 'Guten Tag' : 'Guten Abend');
  const st = loadSeances();
  const next = SEANCES.filter(x => (st.done || []).indexOf(x.n) === -1)[0];
  let totDone = 0, totSeanc = 0;
  UNITES.forEach(u => {
    if(!u.seances || !u.seances.length) return;
    totSeanc += u.seances.length;
    totDone  += (loadSeancesFor(u.n).done || []).length;
  });
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;

  el.innerHTML =
    '<h1>' + salut + '، ' + esc(s.nom) + ' 👋</h1>' +
    '<p>مرحباً بك في قسمك الافتراضي <b>' + esc(s.classe_ar) + '</b> — ' +
      'الثانوية الافتراضية الجزائرية · شعبة <b>' + esc(s.filiere) + '</b>.<br>' +
      '<span class="de-display">' + esc(de) + '! Willkommen in deiner virtuellen Klasse.</span></p>' +
    '<div class="welcome-cta">' +
      (next ? '<button class="btn btn-p" data-go="seances">📚 الحصة ' + next.n + ' — ' +
               esc(next.ar) + '</button>'
            : '<button class="btn btn-p" data-go="seances">📚 مراجعة الحصص</button>') +
      '<button class="btn btn-g" data-go="biblio">🗂️ المكتبة' +
        (k ? ' (' + k.total + ')' : '') + '</button>' +
      '<button class="btn btn-o" data-go="devoir">📝 الفرض /20</button>' +
    '</div>' +
    '<div class="welcome-prog"><div class="progress-wrap"><div class="progress" style="width:' +
      (totSeanc ? Math.round(totDone / totSeanc * 100) : 0) + '%"></div></div>' +
      '<div class="progress-lbl">📈 تقدّمك الإجمالي : ' + totDone + ' / ' + totSeanc +
      ' حصص عبر ' + UNITES.filter(u => u.seances && u.seances.length).length +
      ' وحدات — الوحدة الحالية : <b>' + uniteActive().n + '</b></div></div>' +
    '<div class="welcome-meta">' +
      '<span class="sec-pill">🏫 ' + esc(s.classe_ar) + ' · ' + s.eleves + ' تلميذ</span>' +
      '<span class="sec-pill or">📖 المادة : ' + esc(s.matiere || 'اللغة الألمانية') + '</span>' +
      '<span class="sec-pill rg">🎓 ' + esc(s.niveau) + '</span>' +
      '<span class="sec-live"><i></i> ' + esc(s.prof || 'الأستاذ خريف أحمد') + ' · متصل الآن</span>' +
    '</div>';
}

/* ══════════ BARRE DE SECTION ══════════ */
function renderSectionBar(){
  const el = $('#sectionBar'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;
  el.innerHTML =
    '<span class="sec-pill">🇩🇿 جمهورية جزائرية</span>' +
    '<span class="sec-pill or">🏫 قسم ' + esc(s.classe_ar) + ' · ' + s.eleves + ' تلميذ</span>' +
    '<span class="sec-pill">📖 ' + esc(s.matiere || 'اللغة الألمانية') + '</span>' +
    '<span class="sec-pill rg">🎓 ' + esc(s.niveau) + ' — البرنامج الرسمي MEN</span>' +
    (k ? '<span class="sec-pill">🗂️ ' + k.total + ' وثيقة</span>' : '') +
    '<span class="sec-live"><i></i> الأستاذ 🤖 متصل · يتحدث العربية</span>';
}

/* ══════════ PASTILLE UTILISATEUR ══════════ */
function renderUserChip(){
  const el = $('#userChip'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = ''; return; }
  const ini = String(s.nom || '؟').trim().charAt(0);
  el.innerHTML = '<span class="uc-av">' + esc(ini) + '</span>' +
                 '<span class="uc-n">' + esc(s.nom) + '</span>';
}

/* ══════════ VUE COMPTE ══════════ */
function renderCompte(){
  const el = $('#compteBody'); if(!el) return;
  const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
  if(!s){ el.innerHTML = '<div class="card empty"><div class="empty-i">🔐</div><p>غير متصل</p></div>'; return; }
  const st = loadSeances();
  const sim = load(LS.sim, {best:null, tries:[]});
  const k = (window.BDD && BDD.state.ready) ? BDD.kpis() : null;

  function row(a,b){ return '<div class="rep-row"><span>' + a + '</span>' +
                            '<span class="rep-v">' + esc(b) + '</span></div>'; }

  el.innerHTML =
    '<div class="card"><h2>👤 معلوماتي</h2>' +
      row('الاسم الكامل', s.nom) + row('المعرّف', '@' + s.user) +
      row('الدور', (window.AUTH ? (AUTH.ROLES[s.role] || s.role) : s.role)) +
      row('المستوى', s.niveau) + row('الشعبة', s.filiere) +
      row('الولاية', (s.code_wilaya || '') + ' — ' + (s.wilaya || '')) +
      row('القسم', s.classe_ar + ' · ' + s.eleves + ' تلميذ') +
      row('الأستاذ', s.prof || 'الأستاذ خريف أحمد') +
      row('النقاط', (s.points || 0) + ' نقطة') +
      row('آخر دخول', new Date(s.loginAt || Date.now()).toLocaleString('fr-DZ')) +
    '</div>' +
    '<div class="card"><h2>📊 تقدمي</h2>' +
      row('الحصص المكتملة', (st.done || []).length + ' / 8') +
      row('التمارين المنجزة', Object.keys(st.exo || {}).length) +
      row('المحاكيات', (sim.tries || []).length) +
      row('أفضل نتيجة', sim.best !== null && sim.best !== undefined ? sim.best + '/20' : '—') +
      (k ? row('وثائق المكتبة', k.total + ' متاحة') : '') +
    '</div>' +
    '<div class="card"><h2>🔒 الخصوصية</h2><div class="privacy">' +
      'حسابك وبياناتك محفوظة <b>على جهازك فقط</b> (localStorage) — لا تُرسل لأي خادم. ' +
      'نتائج المحاكاة سرّية ولا يطّلع عليها أحد إلا بقرارك.</div></div>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn btn-o" id="btnSound2">🔊 النطق الألماني</button>' +
      '<button class="btn btn-r" id="btnLogout">🚪 تسجيل الخروج</button>' +
    '</div>';

  const lo = $('#btnLogout');
  if(lo) lo.addEventListener('click', () => {
    if(confirm('تسجيل الخروج من القسم؟')){ AUTH.logout(); toast('👋 إلى اللقاء',''); }
  });
  const bs2 = $('#btnSound2');
  if(bs2) bs2.addEventListener('click', () => {
    soundOn = !soundOn; store(LS.sound, soundOn);
    const b = $('#btnSound'); if(b) b.classList.toggle('muted', !soundOn);
    toast(soundOn ? '🔊 النطق مُفعَّل' : '🔇 النطق مُعطَّل', soundOn ? 'ok' : '');
  });
}


/* ── API publique pour modules.js ── */
window.DZ = {
  $:$, $$:$$, load:load, store:store, esc:esc, toast:toast, speak:speak, go:go,
  PROF:PROF, LS:LS, WA_NUMBER:WA_NUMBER,
  /* SEANCES et DEVOIR sont commutables (multi-unités) → exposés en getters */
  get SEANCES(){ return SEANCES; },
  get DEVOIR(){ return DEVOIR; },
  renderStats:renderStats, addMsg:addMsg, currentView:() => currentView,
  renderWelcome:renderWelcome, renderSectionBar:renderSectionBar,
  renderUserChip:renderUserChip, renderCompte:renderCompte,
  bootGate:bootGate, enterApp:enterApp,
  loadSeances:loadSeances, saveSeances:saveSeances,
  UNITES:UNITES, uniteActive:uniteActive, selectUnite:selectUnite,
  currentUnite:() => currentUnite
};
