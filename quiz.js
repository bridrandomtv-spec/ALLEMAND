/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — quiz.js
   🎯 تمارين تفاعلية · Quiz interactif
   45 questions équilibrées · 5 par unité (L1→L9 du manuel officiel)
   + banque étendue aux 9 Unités (L1→L9) · 45 questions (5 par unité)
   Barème : 1 point par question · feedback immédiat + explication
   Meilleur score conservé localement (localStorage)
   ══════════════════════════════════════════════════════════════ */
'use strict';

/* ═══ Banque de questions — 9 unités (= 9 Lektionen du livre) · 46 questions ═══
   Format : q = énoncé · o = 4 options · c = index de la bonne réponse
            e = explication (affichée après la réponse) · u = unité   */
const QUIZ_BANK = [
  /* ── الوحدة 1 · التعريف بالنفس — Sich vorstellen ── */
  { u:1, q:'Wie sagt man «أنا أسمي...» بالألمانية؟',
    o:['Ich komme aus...', 'Ich heiße...', 'Ich wohne in...', 'Ich bin ... Jahre alt'], c:1,
    e:'<span class=\'de-in\'>Ich <b>heiße</b>…</span> = أنا أسمي… (من الفعل <b>heißen</b>).' },
  { u:1, q:'تصريف الفعل sein مع «ich» ؟',
    o:['bist', 'ist', 'bin', 'sind'], c:2,
    e:'<span class=\'de-in\'>ich <b>bin</b></span> — فعل شاذ! · du bist · er ist · wir sind.' },
  { u:1, q:'أداة الاستفهام بمعنى «من أين» ؟',
    o:['Wie', 'Woher', 'Wo', 'Was'], c:1,
    e:'<span class=\'de-in\'><b>Woher</b></span> = من أين (Wo + her) · <span class=\'de-in\'>Wohin</span> = إلى أين.' },
  { u:1, q:'Wie heißt die formelle Begrüßung am Morgen؟',
    o:['Guten Morgen', 'Guten Tag', 'Guten Abend', 'Gute Nacht'], c:0,
    e:'<span class=\'de-in\'>Guten Morgen</span> = صباح الخير · <span class=\'de-in\'>Guten Tag</span> = bonjour (journée).' },
  { u:1, q:'« Ich komme ... Algerien » — welche Präposition؟',
    o:['aus', 'in', 'nach', 'zu'], c:0,
    e:'<span class=\'de-in\'>kommen <b>AUS</b> + pays</span> = venir de · <span class=\'de-in\'>Ich komme aus Algerien</span>.' },

  /* ── الوحدة 2 · البيت والعائلة — Haus und Familie ── */
  { u:2, q:'« Ma mère » se dit en allemand :',
    o:['meine Mutter', 'mein Mutter', 'meiner Mutter', 'meinem Mutter'], c:0,
    e:'<span class=\'de-in\'>die Mutter</span> (féminin) → possessif <span class=\'de-in\'><b>meine</b></span>.' },
  { u:2, q:'« Ton frère » se dit :',
    o:['dein Bruder', 'deine Bruder', 'deiner Bruder', 'deinem Bruder'], c:0,
    e:'<span class=\'de-in\'>der Bruder</span> (masculin, Nominativ) → <span class=\'de-in\'><b>dein</b></span>.' },
  { u:2, q:'Quel est le pluriel de « das Kind » (enfant)؟',
    o:['die Kinder', 'die Kinds', 'die Kindern', 'die Kindes'], c:0,
    e:'<span class=\'de-in\'>das Kind → die Kinder</span> (pluriel en -er, sans umlaut).' },
  { u:2, q:'« Die Geschwister » signifie :',
    o:['les frères et sœurs', 'les grands-parents', 'les cousins', 'les enfants'], c:0,
    e:'<span class=\'de-in\'>die Geschwister</span> (toujours pluriel) = les frères et sœurs.' },
  { u:9, q:'« ... Vater ist Arzt » — quel possessif pour « son » (à lui)؟',
    o:['Sein', 'Ihr', 'Mein', 'Dein'], c:0,
    e:'<span class=\'de-in\'>sein</span> = à lui (er) · <span class=\'de-in\'>ihr</span> = à elle (sie) · accord avec le possesseur.' },

  /* ── الوحدة 3 · المدرسة والدرس — Schule und Unterricht ── */
  { u:3, q:'« Schultüte » est un Kompositum formé de :',
    o:['die Schule + die Tüte', 'das Schul + der Tüte', 'die Schul + die Tüte', 'aucune de ces réponses'], c:0,
    e:'Kompositum : <span class=\'de-in\'>die Schule</span> + <span class=\'de-in\'>die Tüte</span> · article = celui du <b>dernier</b> mot.' },
  { u:3, q:'« Ich helfe ... Lehrer » — quel article؟',
    o:['dem (Dativ)', 'den (Akkusativ)', 'der (Genitiv)', 'das (Nominativ)'], c:0,
    e:'<span class=\'de-in\'>helfen + DATIV</span> : <span class=\'de-in\'>Ich helfe <b>dem</b> Lehrer</span>.' },
  { u:2, q:'« das Klassenzimmer » — article vient du :',
    o:['dernier mot (Zimmer)', 'premier mot (Klasse)', 'les deux', 'aucun'], c:0,
    e:'Dans un Kompositum, article = celui du <b>dernier</b> mot : <span class=\'de-in\'>das Zimmer</span> → <span class=\'de-in\'>das Klassenzimmer</span>.' },
  { u:3, q:'« Welche Fächer magst du؟ » demande :',
    o:['les matières que tu aimes', 'tes notes', 'tes professeurs', 'ton école'], c:0,
    e:'<span class=\'de-in\'>die Fächer</span> = les matières scolaires · <span class=\'de-in\'>mögen</span> = aimer.' },
  { u:2, q:'« Die Hausaufgaben » signifie :',
    o:['les devoirs (à la maison)', 'la maison', 'les tâches ménagères', 'les cours'], c:0,
    e:'<span class=\'de-in\'>die Hausaufgaben</span> (pluriel) = les devoirs à faire à la maison.' },

  /* ── الوحدة 4 · الوقت والطقس — Zeit und Wetter ── */
  { u:7, q:'« halb drei » signifie :',
    o:['2h30', '3h30', '2h45', '3h15'], c:0,
    e:'<span class=\'de-in\'>halb drei</span> = <b>2h30</b> (demie AVANT 3, pas après!) · piège n°1 des candidats.' },
  { u:5, q:'« Wie ist das Wetter heute؟ » — réponse correcte :',
    o:['Es ist sonnig.', 'Es ist die Sonne.', 'Die Sonne ist.', 'Sonnig ist es.'], c:0,
    e:'<span class=\'de-in\'>Es ist sonnig / kalt / warm / windig</span> — adjectif météo après <span class=\'de-in\'>sein</span>.' },
  { u:7, q:'Ordre des saisons en allemand :',
    o:['Frühling-Sommer-Herbst-Winter', 'Sommer-Frühling-Herbst-Winter', 'Winter-Frühling-Sommer-Herbst', 'Frühling-Herbst-Sommer-Winter'], c:0,
    e:'<span class=\'de-in\'>der Frühling → der Sommer → der Herbst → der Winter</span>.' },
  { u:5, q:'« der Monat » au pluriel :',
    o:['die Monate', 'die Monaten', 'die Möner', 'die Monates'], c:0,
    e:'<span class=\'de-in\'>der Monat → die Monate</span> (sans umlaut, avec -e).' },
  { u:7, q:'« Am 1. Mai » signifie :',
    o:['le 1er mai', 'au mois de mai', 'en mai prochain', 'le premier jour'], c:0,
    e:'<span class=\'de-in\'>am + Dativ</span> pour les dates : <span class=\'de-in\'>am 1. Mai</span> = le 1er mai.' },

  /* ── الوحدة 5 · أوقات الفراغ — Freizeit ── */
  { u:7, q:'« das Hobby » au pluriel :',
    o:['die Hobbys', 'die Hobbies', 'die Hobbye', 'die Hobbits'], c:0,
    e:'<span class=\'de-in\'>das Hobby → die Hobbys</span> (pluriel en -s comme en anglais).' },
  { u:7, q:'« Ich interessiere mich ... Musik » — préposition :',
    o:['für (Akkusativ)', 'an (Dativ)', 'mit (Dativ)', 'über (Akkusativ)'], c:0,
    e:'<span class=\'de-in\'>sich interessieren FÜR + Akkusativ</span> = intéresser à.' },
  { u:7, q:'« Am Wochenende » — « am » = contraction de :',
    o:['an dem (Dativ)', 'an den', 'an der', 'an das'], c:0,
    e:'<span class=\'de-in\'>am = an dem</span> (Dativ) · <span class=\'de-in\'>am Wochenende / am Montag / am Morgen</span>.' },
  { u:7, q:'« Ich gehe ins Kino » — « ins » = contraction de :',
    o:['in das (Akkusativ)', 'in den', 'in der', 'in dem'], c:0,
    e:'<span class=\'de-in\'>ins = in das</span> (Akkusativ, neutre) · direction.' },
  { u:7, q:'Quel verbe signifie « pratiquer un sport »؟',
    o:['Sport treiben', 'Sport machen', 'Sport spielen', 'Sport haben'], c:0,
    e:'<span class=\'de-in\'>Sport treiben</span> = pratiquer un sport (expression idiomatique).' },

  /* ── الوحدة 6 · الإنسان والصحة — Mensch und Gesundheit ── */
  { u:9, q:'« Ich habe Kopfschmerzen » signifie :',
    o:['mal à la tête', 'tête malade', 'tête qui tourne', 'cheveux'], c:0,
    e:'<span class=\'de-in\'>Kopfschmerzen haben</span> = avoir mal à la tête (Kompositum : Kopf + Schmerzen).' },
  { u:9, q:'« Der Arzt » au pluriel :',
    o:['die Ärzte', 'die Arzt', 'die Arzte', 'die Ärzten'], c:0,
    e:'<span class=\'de-in\'>der Arzt → die Ärzte</span> (avec umlaut, féminin = die Ärztin).' },
  { u:9, q:'« Mir ist schlecht » signifie :',
    o:['Je me sens mal', 'Je suis méchant', 'mauvais', 'mal'], c:0,
    e:'<span class=\'de-in\'>Mir ist schlecht</span> = Je me sens mal (datif impersonnel, pas nominatif!).' },
  { u:9, q:'« zum Arzt gehen » — « zum » = contraction de :',
    o:['zu dem (Dativ)', 'zu der', 'zu den', 'zu das'], c:0,
    e:'<span class=\'de-in\'>zum = zu dem</span> (Dativ) · <span class=\'de-in\'>zum Arzt / zur Schule / zum Bahnhof</span>.' },
  { u:9, q:'Quel Modalverb pour « Tu dois prendre tes médicaments »؟',
    o:['müssen', 'können', 'wollen', 'dürfen'], c:0,
    e:'<span class=\'de-in\'>müssen</span> = devoir (obligation) · <span class=\'de-in\'>Du musst die Medikamente nehmen</span>.' },

  /* ── الوحدة 7 · المأكل والمشرب — Essen und Trinken ── */
  { u:7, q:'« Ich möchte einen Kaffee » — « einen » car :',
    o:['Akkusativ masculin', 'Nominativ masculin', 'Dativ masculin', 'Génitif masculin'], c:0,
    e:'<span class=\'de-in\'>der Kaffee</span> (masc.) → <span class=\'de-in\'>einen Kaffee</span> (Akkusativ après möchten).' },
  { u:7, q:'« Was möchten Sie bestellen؟ » se dit :',
    o:['au restaurant', 'à la poste', 'à la banque', 'école'], c:0,
    e:'<span class=\'de-in\'>bestellen</span> = commander · expression typique au restaurant.' },
  { u:7, q:'« das Frühstück » signifie :',
    o:['petit-déjeuner', 'déjeuner', 'dîner', 'goûter'], c:0,
    e:'<span class=\'de-in\'>das Frühstück</span> = petit-déjeuner · <span class=\'de-in\'>das Mittagessen</span> = déjeuner · <span class=\'de-in\'>das Abendessen</span> = dîner.' },
  { u:7, q:'« ein Kilo Tomaten » — « das Kilo » au pluriel :',
    o:['die Kilo', 'die Kilos', 'die Kilos', 'die Kilogramm'], c:0,
    e:'<span class=\'de-in\'>das Kilo → die Kilo</span> (invariable pour les unités de mesure).' },
  { u:7, q:'« Guten Appetit!» se dit :',
    o:['AVANT de manger', 'APRÈS le repas', 'en partant', 'en arrivant'], c:0,
    e:'<span class=\'de-in\'>Guten Appetit!</span> = Bon appétit! (AVANT) · <span class=\'de-in\'>Es hat gut geschmeckt</span> = bon (APRÈS).' },

  /* ── الوحدة 8 · المظهر والشخصية — Aussehen und Charakter ── */
  { u:8, q:'« Er hat blonde Haare » — « blonde » car :',
    o:['adjectif attribut invariable', 'Nominativ masculin', 'Akkusativ masculin', 'Dativ masculin'], c:0,
    e:'Après <span class=\'de-in\'>haben</span>, adjectif <b>invariable</b> : <span class=\'de-in\'>blonde Haare</span>.' },
  { u:8, q:'« ein netter Mann » — la terminaison -er car :',
    o:['Nominativ masculin après ein', 'Akkusativ masculin', 'Dativ masculin', 'Nominativ féminin'], c:0,
    e:'<span class=\'de-in\'>ein + Adjectif + Mann</span> (Nominativ) → <span class=\'de-in\'>ein nett<b>ER</b> Mann</span>.' },
  { u:8, q:'Quel est le comparatif de « groß »؟',
    o:['größer', 'größerer', 'mehr groß', 'großer'], c:0,
    e:'<span class=\'de-in\'>groß → größer</span> (avec umlaut) · <span class=\'de-in\'>am größten</span> (superlatif).' },
  { u:8, q:'« Sie ist älter ALS ich » — « als » sert à :',
    o:['comparer (différent)', 'comparer (égal)', 'introduire une raison', 'introduire un temps'], c:0,
    e:'<span class=\'de-in\'>als</span> = que (différence) · <span class=\'de-in\'>so ... wie</span> = aussi ... que (égalité).' },
  { u:8, q:'« Er trägt eine Brille » signifie :',
    o:['Il porte des lunettes', 'Il a des lunettes', 'Il regarde avec des lunettes', 'Il vend des lunettes'], c:0,
    e:'<span class=\'de-in\'>eine Brille tragen</span> = porter des lunettes (verbe <span class=\'de-in\'>tragen</span>).' },

  /* ── الوحدة 9 · حياة المدينة والريف — Stadtleben – Landleben ── */
  { u:9, q:'« die Hauptstadt von Deutschland » est :',
    o:['Berlin', 'München', 'Hamburg', 'Frankfurt'], c:0,
    e:'<span class=\'de-in\'>Berlin</span> = capitale de Allemagne depuis 1990 (réunification).' },
  { u:9, q:'« in der Stadt » signifie :',
    o:['dans la ville (position)', 'vers la ville (direction)', 'de la ville', 'avec la ville'], c:0,
    e:'<span class=\'de-in\'>in + Dativ</span> = position (wo?) · <span class=\'de-in\'>in + Akkusativ</span> = direction (wohin?).' },
  { u:9, q:'« Ich gehe IN DEN Supermarkt » — « in den » car :',
    o:['direction (Akkusativ)', 'position (Dativ)', 'Nominativ', 'Génitif'], c:0,
    e:'<span class=\'de-in\'>in + Akkusativ</span> = direction · <span class=\'de-in\'>in den Supermarkt gehen</span>.' },
  { u:9, q:'« Das Tor wurde 1791 gebaut » — « wurde gebaut » est :',
    o:['Passiv Präteritum', 'Passiv Präsens', 'Aktiv Präteritum', 'Perfekt Aktiv'], c:0,
    e:'<span class=\'de-in\'>wurde + Partizip II</span> = Passiv Präteritum (passé du passif).' },
  { u:9, q:'« auf dem Land » signifie :',
    o:['à la campagne', 'sur le pays', 'dans la terre', 'vers la campagne'], c:0,
    e:'<span class=\'de-in\'>auf dem Land</span> (Dativ) = à la campagne · <span class=\'de-in\'>in der Stadt</span> = en ville.' }
];

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const K_BEST = 'dz_de_quiz_best_v1';
  const K_HIST = 'dz_de_quiz_hist_v1';
  const LETTRES = ['A','B','C','D'];
  const PAR_SERIE = 5;                       /* 5 أسئلة في كل سلسلة (comme la maquette) */

  let filtre = 0;          /* 0 = كل الوحدات · 1..6 = وحدة */
  let melange = true;      /* خلط الأسئلة والسلاسل */
  let serie = [];          /* questions de la série courante */
  let idx = 0, score = 0, repondu = false;
  let vue = 'accueil';     /* accueil | jeu | resultat */

  /* ── Persistance ── */
  function best(){ try{ return JSON.parse(localStorage.getItem(K_BEST) || '{}'); }catch(e){ return {}; } }
  function setBest(cle, v){
    const b = best();
    if(!b[cle] || v > b[cle].score) b[cle] = { score:v, total:PAR_SERIE, at:Date.now() };
    try{ localStorage.setItem(K_BEST, JSON.stringify(b)); }catch(e){}
  }
  function hist(){ try{ return JSON.parse(localStorage.getItem(K_HIST) || '[]'); }catch(e){ return []; } }
  function pushHist(o){
    const h = hist(); h.push(o);
    try{ localStorage.setItem(K_HIST, JSON.stringify(h.slice(-40))); }catch(e){}
  }

  /* ── Sélection des questions ── */
  function pool(){
    return filtre ? QUIZ_BANK.filter(q => q.u === filtre) : QUIZ_BANK.slice();
  }
  function melanger(t){
    const a = t.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function nouvelleSerie(){
    let p = pool();
    if(!p.length){ toast('⚠️ لا أسئلة متوفرة لهذه الوحدة — اختر « الكل »', ''); return false; }
    if(melange) p = melanger(p);
    serie = p.slice(0, PAR_SERIE);
    /* mélange aussi l'ordre des options, en suivant la bonne réponse */
    if(melange){
      serie = serie.map(q => {
        const idxs = melanger([0,1,2,3]);
        return { u:q.u, q:q.q, e:q.e,
                 o: idxs.map(i => q.o[i]),
                 c: idxs.indexOf(q.c) };
      });
    }
    idx = 0; score = 0; repondu = false;
  }

  /* ── liaison DIRECTE des boutons après chaque render (immune à toute
     interception/exception silencieuse) + erreur visible si ça casse ── */
  function brancher(box){
    const st = box.querySelector('#qzStart');
    if(st) st.addEventListener('click', () => {
      try{
        if(nouvelleSerie() === false) return;
        vue = 'jeu'; render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }catch(e){ toast('⚠️ ' + ((e && e.message) || e), ''); }
    });
    box.querySelectorAll('[data-unite]').forEach(b =>
      b.addEventListener('click', () => { filtre = +b.dataset.unite; render(); }));
    const qt = box.querySelector('#qzQuit');
    if(qt) qt.addEventListener('click', () => { vue = 'accueil'; render(); });
    box.querySelectorAll('.qz-o').forEach(o =>
      o.addEventListener('click', () => { if(!o.disabled) repondre(+o.dataset.i); }));
    const nx = box.querySelector('#qzNext');
    if(nx) nx.addEventListener('click', () => suivant());
    const ag = box.querySelector('#qzAgain');
    if(ag) ag.addEventListener('click', () => {
      try{
        if(nouvelleSerie() === false) return;
        vue = 'jeu'; render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }catch(e){ toast('⚠️ ' + ((e && e.message) || e), ''); }
    });
    const hm = box.querySelector('#qzHome');
    if(hm) hm.addEventListener('click', () => { vue = 'accueil'; render(); });
  }
  /* ── Rendu ── */
  var render = function(){
    const box = $('#quizBody'); if(!box) return;
    if(vue === 'accueil')  box.innerHTML = vueAccueil();
    if(vue === 'jeu')      box.innerHTML = vueJeu();
    if(vue === 'resultat') box.innerHTML = vueResultat();
  }

  function vueAccueil(){
    const b = best();
    const h = hist();
    const parU = {};
    QUIZ_BANK.forEach(q => { parU[q.u] = (parU[q.u] || 0) + 1; });
    const totalQ = QUIZ_BANK.length;
    const moy = h.length ? (h.reduce((a,x) => a + x.score, 0) / h.length) : null;

    return '<div class="card qz-hero">' +
      '<div><div class="ch-badge">🎯 تمارين تفاعلية — تصحيح فوري</div>' +
      '<h2>اختبر معلوماتك</h2>' +
      '<div class="ch-sub">' + totalQ + ' سؤالاً · ' + Object.keys(parU).length +
        ' وحدات · ' + PAR_SERIE + ' أسئلة في كل سلسلة · نقطة واحدة لكل سؤال</div>' +
      '<div class="chips" style="margin-top:10px">' +
        '<span class="sec-pill">🏆 أفضل نتيجة : ' + (b['u' + filtre] ? b['u' + filtre].score + '/' + PAR_SERIE : '—') + '</span>' +
        '<span class="sec-pill or">📝 محاولاتك : ' + h.length + '</span>' +
        '<span class="sec-pill rg">📊 معدّلك : ' + (moy === null ? '—' : moy.toFixed(1) + '/' + PAR_SERIE) + '</span>' +
      '</div></div>' +
      '<button class="btn btn-p qz-start" id="qzStart">🚀 ابدأ التمارين</button>' +
      '</div>' +

      '<div class="card"><h2>📚 اختر الوحدة</h2>' +
      '<div class="qz-unites">' +
        '<button class="qz-u' + (filtre===0?' on':'') + '" data-unite="0">' +
          '<b>🎲 الكل</b><i>' + totalQ + ' سؤالاً · سحب عشوائي</i></button>' +
        [1,2,3,4,5,6,7,8,9].map(u => {
          const n = parU[u] || 0;
          const bt = b['u' + u];
          const nm = ({1:'التعريف بالنفس',2:'البيت والعائلة',3:'المدرسة والدرس',4:'الوقت والطقس',
                       5:'أوقات الفراغ',6:'الإنسان والصحة',7:'المأكل والمشرب',
                       8:'المظهر والشخصية',9:'المدينة والريف'})[u];
          return '<button class="qz-u' + (filtre===u?' on':'') + '" data-unite="' + u + '">' +
            '<b>الوحدة ' + u + '</b><i>' + nm + ' · ' + n + ' أسئلة</i>' +
            (bt ? '<span class="qz-b">🏆 ' + bt.score + '/' + PAR_SERIE + '</span>' : '') +
            '</button>';
        }).join('') +
      '</div>' +
      '<label class="qz-opt"><input type="checkbox" id="qzMelange"' + (melange?' checked':'') + '>' +
      ' 🔀 خلط الأسئلة و ترتيب الخيارات</label></div>' +

      '<div class="grid2">' +
        '<div class="card"><h2>📈 آخر محاولاتك</h2>' + dernieresTentatives(h) + '</div>' +
        '<div class="card"><h2>🧭 كيف تعمل التمارين؟</h2>' +
          '<ol class="qz-regles">' +
          '<li>تُسحب <b>' + PAR_SERIE + ' أسئلة</b> من الوحدة المختارة.</li>' +
          '<li>4 خيارات (A · B · C · D) — <b>واحد فقط</b> صحيح.</li>' +
          '<li>التصحيح <b>فوري</b> مع شرح القاعدة بالعربية والألمانية.</li>' +
          '<li>النتيجة النهائية <b>/5</b> + أفضل نتيجة محفوظة على جهازك.</li>' +
          '<li>🔒 نتيجتك <b>سرّية</b> — لا تُرسل لأي خادم (منهج الحصة 7).</li>' +
          '</ol>' +
          '<button class="btn btn-o btn-block" data-go="seances">📚 راجع الحصص أولاً</button>' +
        '</div>' +
      '</div>';
  }

  function dernieresTentatives(h){
    if(!h.length) return '<p style="color:var(--m);font-size:13px">لا توجد محاولات بعد — اضغط «ابدأ التمارين».</p>';
    return '<div class="qz-hist">' + h.slice(-8).reverse().map(x => {
      const pct = Math.round(x.score / PAR_SERIE * 100);
      const cls = pct >= 80 ? 'ok' : (pct >= 60 ? 'mid' : 'ko');
      return '<div class="qh"><div><b>' + (x.unite ? 'الوحدة ' + x.unite : '🎲 الكل') + '</b>' +
        '<i>' + esc(x.date) + '</i></div>' +
        '<span class="qh-n ' + cls + '">' + x.score + '/' + PAR_SERIE + '</span></div>';
    }).join('') + '</div>';
  }

  function vueJeu(){
    if(!serie.length) nouvelleSerie();
    const q = serie[idx];
    const pct = Math.round(idx / serie.length * 100);
    return '<div class="card qz-play">' +
      '<div class="qz-top">' +
        '<button class="btn btn-o btn-sm" id="qzQuit">↩️ خروج</button>' +
        '<div class="qz-prog-t">السؤال <b>' + (idx + 1) + '</b> من ' + serie.length + '</div>' +
        '<div class="qz-score-t">النقاط : <b>' + score + '/' + serie.length + '</b></div>' +
      '</div>' +
      '<div class="progress-wrap"><div class="progress" style="width:' + pct + '%"></div></div>' +
      '<div class="qz-q"><span class="qz-badge">الوحدة ' + q.u + '</span>' + esc(q.q) + '</div>' +
      '<div class="qz-opts" id="qzOpts">' +
        q.o.map((o, i) => '<button class="qz-o" data-i="' + i + '">' +
          '<span class="qz-l">' + LETTRES[i] + '</span><span>' + esc(o) + '</span></button>').join('') +
      '</div>' +
      '<div id="qzFb"></div>' +
      '<div class="qz-nav"><button class="btn btn-p" id="qzNext" hidden>' +
        (idx === serie.length - 1 ? '🏁 النتيجة النهائية' : 'السؤال التالي ←') +
      '</button></div>' +
      '</div>';
  }

  function vueResultat(){
    const pct = Math.round(score / serie.length * 100);
    const cls = pct >= 80 ? 'ok' : (pct >= 60 ? 'md' : 'ko');
    const msg = pct === 100 ? '🏆 ممتاز — علامة كاملة! Sehr gut!' :
                pct >= 80  ? '👏 جيد جداً — Gut gemacht!' :
                pct >= 60  ? '📖 حسن — راجع الأخطاء ثم أعد المحاولة.' :
                             '🔁 تحتاج مراجعة الحصص — لا تستسلم!';
    const conseil = pct >= 80 ? 'انتقل إلى الوحدة الموالية أو جرّب 🎓 محاكاة بظروف حقيقية.'
                              : 'عُد إلى 📚 الحصص و 📘 مكتبة القواعد، ثم أعد السلسلة.';
    return '<div class="card result"><div class="mini-i">🎯</div>' +
      '<div class="result-n ' + cls + '">' + score + '<span style="font-size:22px;color:var(--m)">/' +
        serie.length + '</span></div>' +
      '<div class="result-l">' + msg + '</div>' +
      '<div style="font-size:12.5px;color:var(--m);margin-top:7px">' +
        (filtre ? 'الوحدة ' + filtre : 'كل الوحدات') + ' · ' + pct + '% إجابات صحيحة</div>' +
      '<div class="secret">🔒 نتيجتك سرّية — محفوظة على جهازك فقط</div>' +
      '<div style="margin-top:14px;font-size:13px;color:var(--m)">' + conseil + '</div>' +
      '</div>' +
      '<div class="card"><h2>📝 مراجعة الأسئلة</h2>' +
        serie.map((q, i) => {
          const rep = q._rep;
          const bon = rep === q.c;
          return '<div class="qz-rev ' + (bon ? 'ok' : 'ko') + '">' +
            '<div class="qr-h"><span class="qr-n">' + (i + 1) + '</span>' + esc(q.q) + '</div>' +
            '<div class="qr-b">' + (bon ? '✅ ' : '❌ ') + 'إجابتك : <b>' +
              (rep === null || rep === undefined ? '—' : esc(q.o[rep])) + '</b>' +
              (bon ? '' : '<br>✔️ الصحيح : <b>' + esc(q.o[q.c]) + '</b>') + '</div>' +
            '<div class="qr-e">💡 ' + q.e + '</div></div>';
        }).join('') +
      '</div>' +
      '<div style="display:flex;gap:11px;flex-wrap:wrap">' +
        '<button class="btn btn-p" id="qzAgain">🔄 إعادة التمارين</button>' +
        '<button class="btn btn-o" id="qzHome">🎯 سلسلة أخرى</button>' +
        '<button class="btn btn-g" data-go="seances">📚 الحصص</button>' +
        '<button class="btn btn-o" data-go="simulation">🎓 محاكاة /20</button>' +
      '</div>';
  }

  /* ── Interaction ── */
  function repondre(i){
    if(repondu) return;
    repondu = true;
    const q = serie[idx];
    q._rep = i;
    const bon = i === q.c;
    if(bon) score++;
    /* 🧠 mémoire : chaque erreur devient une carte de révision espacée. */
    if(!bon && window.MEMOIRE && window.MEMOIRE.record){
      try{
        const opts = (q.o || q.opts || []);
        window.MEMOIRE.record({ q: q.q, bad: opts[i], good: opts[q.c],
          comp: q.comp || ('unité ' + (q.u || filtre)),
          unite: q.u || filtre, src: 'quiz' });
      }catch(e){}
    }

    $$('#qzOpts .qz-o').forEach((b, k) => {
      b.disabled = true;
      if(k === q.c) b.classList.add('correct');
      else if(k === i) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    const st = $('.qz-score-t b'); if(st) st.textContent = score + '/' + serie.length;

    const fb = $('#qzFb');
    if(fb) fb.innerHTML = '<div class="qz-fb ' + (bon ? 'ok' : 'ko') + '">' +
      '<b>' + (bon ? '✅ إجابة صحيحة! +1 نقطة' : '❌ إجابة خاطئة') + '</b>' +
      '<div class="qz-ex">💡 ' + q.e + '</div></div>';
    const nx = $('#qzNext'); if(nx) nx.hidden = false;
  }

  function suivant(){
    if(idx < serie.length - 1){
      idx++; repondu = false; render();
      const t = $('.qz-play'); if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
    } else {
      terminer();
    }
  }

  function terminer(){
    setBest('u' + filtre, score);
    pushHist({ unite: filtre, score: score, total: PAR_SERIE,
               pct: Math.round(score / PAR_SERIE * 100),
               date: new Date().toLocaleString('fr-DZ'), at: Date.now() });
    vue = 'resultat'; render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(window.DZ && DZ.speak && score === serie.length) DZ.speak('Sehr gut! Perfekt!');
    toast('🎯 نتيجتك : ' + score + '/' + serie.length, score >= serie.length * 0.6 ? 'ok' : '');
  }

  /* ── Événements ── */
  document.addEventListener('click', ev => {
    if(ev.target.closest && ev.target.closest('#quizBody')) return;
    const u = ev.target.closest('[data-unite]');
    if(u){ filtre = +u.dataset.unite; render(); return; }

    if(ev.target.closest('#qzStart')){
      nouvelleSerie(); vue = 'jeu'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if(ev.target.closest('#qzQuit')){ vue = 'accueil'; render(); return; }
    if(ev.target.closest('#qzAgain')){
      nouvelleSerie(); vue = 'jeu'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if(ev.target.closest('#qzHome')){ vue = 'accueil'; render();
      window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    const o = ev.target.closest('.qz-o');
    if(o && !o.disabled){ repondre(+o.dataset.i); return; }
    if(ev.target.closest('#qzNext')){ suivant(); return; }
  });

  document.addEventListener('change', ev => {
    const m = ev.target.closest('#qzMelange');
    if(m){ melange = m.checked;
      toast(melange ? '🔀 الخلط مُفعَّل' : '📋 الترتيب الأصلي', ''); return; }
  });

  /* raccourcis clavier A/B/C/D ou 1-4 pendant le jeu */
  document.addEventListener('keydown', ev => {
    if(vue !== 'jeu' || repondu) return;
    const k = ev.key.toLowerCase();
    const map = { a:0, b:1, c:2, d:3, '&':0, 'é':1, '"':2, "'":3, '1':0, '2':1, '3':2, '4':3 };
    if(k in map){ ev.preventDefault(); repondre(map[k]); }
    if(k === 'enter' && $('#qzNext') && !$('#qzNext').hidden) suivant();
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'quiz') render(); });
  const _render0 = render;
  render = function(){ _render0(); const bx = document.getElementById('quizBody'); if(bx) brancher(bx); };
  window.renderQuiz = render;
  window.DZ_QUIZ = { render:render, bank:QUIZ_BANK, nouvelleSerie:nouvelleSerie,
                     PAR_SERIE:PAR_SERIE, best:best, hist:hist };
})();
