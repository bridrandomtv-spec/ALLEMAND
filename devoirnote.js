
  /* ──  écoute : lecture allemande (de-DE) des textes de devoirs ── */
  function stopEc(){ try{ if('speechSynthesis' in window) speechSynthesis.cancel(); }catch(e){} }
  function lignesDE(t){
    return String(t||'').split('\n').map(s=>s.trim()).filter(l=>{
      if(!l) return false;
      const ar=(l.match(/[\u0600-\u06FF]/g)||[]).length;
      const la=(l.match(/[A-Za-zÄÖÜäöüß]/g)||[]).length;
      return la>ar && la>3;
    }).join(' ');
  }
    /* lecture bilingue du corrigé : chaque segment lu avec la voix de sa langue
     (arabe → ar-DZ, allemand → de-DE) au lieu d'une seule voix */
  function ecouterMixte(t){
    try{
      if(!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const txt = String(t || '').replace(/«/g, '\n«').replace(/»/g, '»\n');
      txt.split(/[\n·;]+/).forEach(s => {
        const ch = s.trim();
        if(!ch) return;
        const ar = (ch.match(/[\u0600-\u06FF]/g) || []).length;
        const la = (ch.match(/[A-Za-zÄÖÜäöüß]/g) || []).length;
        if(!ar && !la) return;
        const u = new SpeechSynthesisUtterance(ch);
        u.lang = ar >= la ? 'ar-DZ' : 'de-DE';
        u.rate = 0.95;
        speechSynthesis.speak(u);
      });
    }catch(e){}
  }
function ecouterDE(t, lang){
    try{
      const txt = (lang && lang!=='de-DE') ? String(t||'') : lignesDE(t);
      if(!txt) return;
      if(window.VOIX && VOIX.parler){ VOIX.parler(txt, lang||'de-DE'); return; }
      if('speechSynthesis' in window){
        speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(txt); u.lang=lang||'de-DE'; speechSynthesis.speak(u);
      }
    }catch(e){}
  }
/* devoirnote.js — 📝 Devoirs notés : questions EN ALLEMAND, barème officiel I/8 II/8 III/4
   · onglet A : devoirs générés & corrigés auto (16 unités × 3 variantes = 48)
   · onglet B : les 312 devoirs RÉELS envoyés (filtres + mode composition + corrigé)   */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let MAL = null, BAN = null, DV = null;
  async function cj(u){ try{ const r = await fetch(u, { cache:'no-store' });
      return r.ok ? await r.json() : null; }catch(e){ return null; } }
  async function data(){
    if(MAL === null) MAL = await cj('assets/bdd/malakhiss.json');
    if(BAN === null) BAN = await cj('assets/bdd/contenu_original.json');
    if(DV === null) DV = await cj('assets/bdd/devoirs.json');
    return { mal: MAL || {}, ban: BAN || {}, dv: (DV && DV.items) || [] };
  }
  /* faits grammaticaux vérifiés (pour Vrai/Faux en allemand) */
  const KONJ = {
    sein: ['bin','bist','ist','sind','seid','sind'],
    haben: ['habe','hast','hat','haben','habt','haben']
  };
  const PERS = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const WFR = ['wie','wo','woher','wie alt','was','wer','wann','warum'];

  function rng(seed){ let s = seed; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; }

  /* ── Banque de textes réels par unité : le devoir généré devient une vraie
     copie de classe (texte + compréhension + langue + production). ── */
const BANK = {
 1:{t:'Sich vorstellen',text:'Hallo! Ich heiße Amel. Ich bin 16 Jahre alt und wohne in Algier. Ich lerne Deutsch, weil ich die Sprache sehr mag.',rf:[{q:'Amel wohnt in Oran.',a:false},{q:'Amel ist 16 Jahre alt.',a:true},{q:'Amel lernt Französisch.',a:false},{q:'Amel mag Deutsch.',a:true}],open:[{q:'Wie heißt sie?',a:'Sie heißt Amel.'},{q:'Wo wohnt sie?',a:'Sie wohnt in Algier.'}]},
 2:{t:'Haus und Familie',text:'Ich wohne mit meiner Familie in einem Haus. Mein Vater ist Arzt und meine Mutter ist Lehrerin. Ich habe einen Bruder und eine Schwester.',rf:[{q:'Die Familie wohnt in einer Wohnung.',a:false},{q:'Der Vater ist Arzt.',a:true},{q:'Die Mutter ist Ärztin.',a:false},{q:'Der Schreiber hat zwei Geschwister.',a:true}],open:[{q:'Wo wohnt die Familie?',a:'Die Familie wohnt in einem Haus.'},{q:'Was ist der Vater von Beruf?',a:'Der Vater ist Arzt.'}]},
 3:{t:'Schule und Unterricht',text:'Meine Schule beginnt um 8 Uhr. Mein Lieblingsfach ist Deutsch, weil es interessant ist. Ich habe jeden Tag sechs Stunden.',rf:[{q:'Die Schule beginnt um 9 Uhr.',a:false},{q:'Das Lieblingsfach ist Deutsch.',a:true},{q:'Der Schüler hat sechs Stunden.',a:true},{q:'Deutsch ist langweilig.',a:false}],open:[{q:'Wann beginnt die Schule?',a:'Die Schule beginnt um 8 Uhr.'},{q:'Warum mag er Deutsch?',a:'Weil es interessant ist.'}]},
 4:{t:'Zeit und Wetter',text:'Im Sommer ist es heiß und die Sonne scheint. Im Winter regnet es oft und es ist kalt. Mein Lieblingsmonat ist Mai, weil das Wetter angenehm ist.',rf:[{q:'Im Sommer ist es kalt.',a:false},{q:'Im Winter regnet es oft.',a:true},{q:'Der Lieblingsmonat ist Januar.',a:false},{q:'Im Mai ist das Wetter angenehm.',a:true}],open:[{q:'Wie ist es im Sommer?',a:'Im Sommer ist es heiß und die Sonne scheint.'},{q:'Warum mag er den Mai?',a:'Weil das Wetter angenehm ist.'}]},
 5:{t:'Freizeit',text:'Am Wochenende spiele ich Fußball mit meinen Freunden. Am Abend sehe ich fern oder lese ein Buch. Meine Lieblingshobbys sind Fußball und Musik.',rf:[{q:'Er spielt am Wochenende Basketball.',a:false},{q:'Am Abend liest er manchmal ein Buch.',a:true},{q:'Seine Lieblingshobbys sind Fußball und Musik.',a:true},{q:'Er sieht nie fern.',a:false}],open:[{q:'Was spielt er am Wochenende?',a:'Er spielt Fußball mit seinen Freunden.'},{q:'Was sind seine Lieblingshobbys?',a:'Fußball und Musik.'}]},
 6:{t:'Mensch und Gesundheit',text:'Gestern war ich beim Arzt, weil ich Kopfschmerzen hatte. Der Arzt sagt: « Du musst im Bett bleiben und viel Tee trinken. » Heute geht es mir besser.',rf:[{q:'Er war beim Arzt.',a:true},{q:'Er muss viel arbeiten.',a:false},{q:'Er soll viel Tee trinken.',a:true},{q:'Heute geht es ihm schlechter.',a:false}],open:[{q:'Warum war er beim Arzt?',a:'Weil er Kopfschmerzen hatte.'},{q:'Was muss er tun?',a:'Er muss im Bett bleiben und viel Tee trinken.'}]},
 7:{t:'Essen und Trinken',text:'Zum Frühstück esse ich Brot mit Honig und trinke Milch. Zum Mittagessen gibt es oft Couscous. Ich mag Obst, aber ich mag kein Fastfood.',rf:[{q:'Zum Frühstück gibt es Couscous.',a:false},{q:'Er mag Obst.',a:true},{q:'Er mag Fastfood.',a:false},{q:'Zum Mittagessen gibt es oft Couscous.',a:true}],open:[{q:'Was isst er zum Frühstück?',a:'Brot mit Honig, und er trinkt Milch.'},{q:'Was mag er nicht?',a:'Er mag kein Fastfood.'}]},
 8:{t:'Aussehen und Charakter',text:'Meine beste Freundin heißt Yasmin. Sie ist groß und hat lange schwarze Haare. Sie ist freundlich und hilfsbereit.',rf:[{q:'Yasmin ist klein.',a:false},{q:'Sie hat blonde Haare.',a:false},{q:'Sie ist hilfsbereit.',a:true},{q:'Yasmin ist freundlich.',a:true}],open:[{q:'Wie sieht Yasmin aus?',a:'Sie ist groß und hat lange schwarze Haare.'},{q:'Wie ist ihr Charakter?',a:'Sie ist freundlich und hilfsbereit.'}]},
 9:{t:'Stadtleben – Landleben',text:'Ich wohne in der Stadt, weil es dort viele Schulen und Geschäfte gibt. Auf dem Land ist es ruhig und die Luft ist sauber. Trotzdem fahre ich jeden Sommer aufs Land.',rf:[{q:'Die Stadt hat viele Geschäfte.',a:true},{q:'Auf dem Land ist es laut.',a:false},{q:'Die Luft auf dem Land ist sauber.',a:true},{q:'Er fährt nie aufs Land.',a:false}],open:[{q:'Warum wohnt er in der Stadt?',a:'Weil es dort viele Schulen und Geschäfte gibt.'},{q:'Wie ist es auf dem Land?',a:'Es ist ruhig und die Luft ist sauber.'}]},
 10:{t:'Persönlichkeit und Identität',text:'Jeder Mensch hat eine eigene Persönlichkeit. Manche sind ruhig, andere laut. Wer seine Stärken kennt, ist stark.',rf:[{q:'Alle Menschen sind gleich.',a:false},{q:'Manche Menschen sind ruhig.',a:true},{q:'Wer seine Stärken kennt, ist stark.',a:true},{q:'Die Persönlichkeit ist unwichtig.',a:false}],open:[{q:'Wie sind die Menschen verschieden?',a:'Manche sind ruhig, andere laut.'},{q:'Wer ist stark?',a:'Wer seine Stärken kennt.'}]},
 11:{t:'Staatsbürgerschaft',text:'Ein guter Bürger kennt seine Rechte und Pflichten. Er respektiert die Gesetze und hilft seinen Mitmenschen. Wer seine Stadt sauber hält, liebt sein Land.',rf:[{q:'Ein Bürger kennt nur Rechte.',a:false},{q:'Er respektiert die Gesetze.',a:true},{q:'Er hilft niemandem.',a:false},{q:'Wer die Stadt sauber hält, liebt sein Land.',a:true}],open:[{q:'Was kennt ein guter Bürger?',a:'Seine Rechte und Pflichten.'},{q:'Was macht er für die Stadt?',a:'Er hält sie sauber.'}]},
 12:{t:'Leben in der Gesellschaft',text:'In einer Gesellschaft lebt man zusammen und hilft einander. Die Nachbarn besuchen sich und teilen ihr Essen. Eine gute Gesellschaft ist wie ein Körper.',rf:[{q:'Man hilft einander.',a:true},{q:'Die Nachbarn besuchen sich nie.',a:false},{q:'Eine gute Gesellschaft ist wie ein Körper.',a:true},{q:'Jeder lebt allein.',a:false}],open:[{q:'Was machen die Nachbarn?',a:'Sie besuchen sich und teilen ihr Essen.'},{q:'Womit wird die Gesellschaft verglichen?',a:'Mit einem Körper.'}]},
 13:{t:'Wissenschaft und Technik',text:'Die Wissenschaft verändert unser Leben. Das Internet macht die Kommunikation schneller. Aber manche Menschen vergessen die reale Welt.',rf:[{q:'Die Wissenschaft verändert das Leben.',a:true},{q:'Das Internet macht alles langsamer.',a:false},{q:'Manche Menschen vergessen die reale Welt.',a:true},{q:'Die Technik hat keine Nachteile.',a:false}],open:[{q:'Was macht das Internet?',a:'Es macht die Kommunikation schneller.'},{q:'Was vergessen manche Menschen?',a:'Die reale Welt.'}]},
 14:{t:'Wirtschaft und Arbeit',text:'Die Wirtschaft eines Landes hängt von der Arbeit seiner Menschen ab. Algerien möchte die Wirtschaft modernisieren. Junge Unternehmer schaffen Arbeitsplätze.',rf:[{q:'Die Wirtschaft hängt von der Arbeit ab.',a:true},{q:'Algerien will nichts ändern.',a:false},{q:'Junge Unternehmer schaffen Arbeitsplätze.',a:true},{q:'Die Wirtschaft ist unwichtig.',a:false}],open:[{q:'Wovon hängt die Wirtschaft ab?',a:'Von der Arbeit seiner Menschen.'},{q:'Wer schafft Arbeitsplätze?',a:'Junge Unternehmer.'}]},
 15:{t:'Umweltprobleme',text:'Die Umwelt ist in Gefahr: Die Luft ist verschmutzt und die Wälder werden kleiner. Jeder kann helfen: Müll trennen und Bäume pflanzen. Wenn wir die Natur schützen, schützt sie uns.',rf:[{q:'Die Luft ist sauber.',a:false},{q:'Die Wälder werden kleiner.',a:true},{q:'Jeder kann helfen.',a:true},{q:'Wir müssen nichts tun.',a:false}],open:[{q:'Wie kann man helfen?',a:'Müll trennen und Bäume pflanzen.'},{q:'Was passiert, wenn wir die Natur schützen?',a:'Sie schützt uns.'}]},
 16:{t:'Medienwelt',text:'Die Medien haben unseren Alltag verändert. Mit dem Smartphone kann man jederzeit Nachrichten lesen. Aber es gibt auch Fake News. Deshalb muss man die Quellen prüfen.',rf:[{q:'Die Medien haben den Alltag verändert.',a:true},{q:'Es gibt keine Fake News.',a:false},{q:'Man kann jederzeit Nachrichten lesen.',a:true},{q:'Man muss die Quellen nicht prüfen.',a:false}],open:[{q:'Was kann man mit dem Smartphone machen?',a:'Man kann jederzeit Nachrichten lesen.'},{q:'Was muss man prüfen?',a:'Die Quellen.'}]}
};

Object.assign(BANK, {
 17:{t:'Globalisierung',text:'Die Welt ist heute ein Dorf geworden. Waren, Geld und Ideen bewegen sich schneller als je zuvor. Ein T-Shirt, das in Bangladesch genäht wurde, wird in Berlin gekauft und in Algier getragen. Die Globalisierung hat Vorteile wie billigere Preise und neue Jobs, aber auch Nachteile wie die Belastung kleiner Fabriken. Deshalb brauchen wir faire Regeln, damit alle gewinnen.',rf:[{q:'Die Welt ist heute ein Dorf geworden.',a:true},{q:'Waren bewegen sich langsamer als früher.',a:false},{q:'Die Globalisierung hat nur Vorteile.',a:false},{q:'Wir brauchen faire Regeln.',a:true}],open:[{q:'Wo wurde das T-Shirt genäht?',a:'In Bangladesch.'},{q:'Was brauchen wir, damit alle gewinnen?',a:'Faire Regeln.'}]},
 18:{t:'Medienwelt',text:'Früher lasen die Menschen Zeitung und hörten Radio. Heute benutzen sie das Internet, Smartphones und soziale Netzwerke. Mit einem Klick wissen wir, was in der Welt passiert. Aber es gibt auch Gefahren wie Fake News und zu viel Zeit online. Deshalb ist Medienkompetenz sehr wichtig.',rf:[{q:'Früher lasen die Menschen Zeitung.',a:true},{q:'Heute benutzen nur wenige das Internet.',a:false},{q:'Fake News sind eine Gefahr.',a:true},{q:'Medienkompetenz ist unwichtig.',a:false}],open:[{q:'Was benutzen die Menschen heute?',a:'Das Internet, Smartphones und soziale Netzwerke.'},{q:'Was ist sehr wichtig?',a:'Medienkompetenz.'}]},
 19:{t:'Kultureller Dialog',text:'Der kulturelle Dialog verbindet Menschen aus verschiedenen Ländern. Ein Algerier teilt Couscous mit einem Deutschen, und ein Deutscher probiert Baklava. Wenn wir die Feste und Traditionen des anderen respektieren, entsteht Freundschaft. Sprachen sind die Brücken zwischen den Kulturen.',rf:[{q:'Der Dialog verbindet Menschen.',a:true},{q:'Wer die Traditionen respektiert, bekommt Feindschaft.',a:false},{q:'Sprachen sind Brücken zwischen den Kulturen.',a:true},{q:'Der Dialog macht uns ärmer.',a:false}],open:[{q:'Was teilt der Algerier?',a:'Couscous.'},{q:'Was sind die Brücken zwischen den Kulturen?',a:'Die Sprachen.'}]}
});

function genere(u, variante, d){
    const un = ((d.mal.malakhiss || []).filter(m => m.unite === u)[0]) || {};
    const r = rng(u * 97 + variante * 13 + 5);
    const vocab = un.vocabulaire || [];
    const B = BANK[u] || BANK[1];
    const Q = [];
    /* I. Leseverstehen : texte réel + compréhension */
    B.rf.forEach(x => Q.push({ type:'vf', partie:'I', pts:1, q:x.q, a:x.a }));
    B.open.forEach(x => Q.push({ type:'phrase', partie:'I', pts:2, q:x.q, a:x.a }));
    /* II. Sprachbausteine : MCQ */
    const comps = [];
    const g = (un.grammaire || []).join(' ').toLowerCase();
    if(/w-fragen|frage/.test(g)) comps.push('w-fragen');
    if(/akkusativ/.test(g)) comps.push('akkusativ');
    if(/dativ/.test(g)) comps.push('dativ');
    if(/perfekt/.test(g)) comps.push('perfekt');
    if(/sein|haben|präsens|konjug/.test(g)) comps.push('conjugaison');
    if(!comps.length) comps.push('conjugaison');
    const niv = u <= 9 ? '2AS' : '3AS';
    const pool = ((d.ban.B_exercices || []).filter(x => comps.indexOf(x.comp) !== -1 && x.niveau === niv));
    const pick = [];
    const __sh = pool.slice(); while(pick.length < 3 && __sh.length){ pick.push(__sh.splice(Math.floor(r()*__sh.length),1)[0]); }
    pick.forEach(x => Q.push({ type:'mcq', partie:'II', pts:2, q:x.q, opts:x.opts, a:x.a, why:x.why }));
    Q.push({ type:'prod', partie:'III', pts:4, q:'Schreibe mindestens 5 Sätze zum Thema « ' + (un.titre_de || B.t) + ' ». Benutze: 1 W-Frage, 1 × weil.', checklist:['5 Sätze oder mehr','Verb an 2. Position','1 × weil','1 W-Frage','Nomen großgeschrieben'] });
    return { un: un, Q: Q, texte: B.text };
  }
  function corrige(Q, host, meta){
    let note = 0, total = 0;
    Q.forEach((x, i) => {
      total += x.pts;
      let ok = null;
      if(x.type === 'vf'){
        const sel = host.querySelector('input[name="vf' + i + '"]:checked');
        ok = sel && ((sel.value === 'true') === x.a);
      }else if(x.type === 'mcq'){
        const sel = host.querySelector('input[name="mcq' + i + '"]:checked');
        ok = sel && (+sel.value === x.a);
      }else if(x.type === 'prod'){
        const n = +((host.querySelector('#prod' + i) || {}).value || 0);
        note += Math.min(x.pts, Math.max(0, n));
        return;
      }else{ /* phrase : auto-évaluation */
        const n = +((host.querySelector('#ph' + i) || {}).value || 0);
        note += Math.min(x.pts, Math.max(0, n));
        return;
      }
      if(ok) note += x.pts;
      else if(window.MEMOIRE){
        try{ window.MEMOIRE.record({ q: x.q, bad: 'à revoir', good: x.why || x.a || '',
          comp: meta.unite + '', unite: meta.unite, src: 'devoir-note' }); }catch(e){}
      }
    });
    return { note: note, total: total };
  }

  async function render(){
    const box = $('#devoirsBody'); if(!box) return;
    const d = await data();
    box.innerHTML =
        '<div class="dn-hero"><span class="dn-crest">📝</span><div>'
      + '<h2>📝 فروض مُنقّطة — Devoirs notés auf Deutsch</h2><p class="dn-sub">48 devoirs générés corrigés '
      + 'automatiquement + ' + d.dv.length + ' echte Klausuren aus den Wilayas · offizieller Schlüssel '
      + 'I/8 · II/8 · III/4</p></div></div>'
      + '<div class="dn-tabs"><button class="btn btn-p btn-sm" id="dnA">📝 مولَّدة (تصحيح فوري)</button> '
      + '<button class="btn btn-o btn-sm" id="dnB">📄 حقيقية من الثانويات (' + d.dv.length + ')</button></div>'+ '<div class="card" style="margin-top:10px"><b>🆘 دليل المبتدئ — كيف أعمل هنا ؟</b><p style="margin:6px 0 0;line-height:1.9">هذه صفحة <b>فروض مُنقّطة بالألمانية</b> مثل فروض القسم تمامًا :<br>· <b>I. فهم النص (8ن)</b> : اقرأ السؤال وأجب — richtig = صحيح · falsch = خطأ.<br>· <b>II. اللغة (8ن)</b> : اختر الإجابة الصحيحة من القائمة.<br>· <b>III. التعبير الكتابي (4ن)</b> : اكتب 5 جمل بالألمانية ثم قيّم نفسك بصدق.<br>لا تقلق إن أخطأت : كل خطأ يتحوّل تلقائيًا إلى بطاقة 🧠 للمراجعة، والكلمات الصعبة تجدها في 📑 الملخصات. ولا يوجد وقت محدد — الأهم أن تفهم !</p></div>'
      + '<div id="dnZone"></div>';
    $('#dnA').addEventListener('click', () => zoneA(d));
    $('#dnB').addEventListener('click', () => zoneB(d));
    zoneA(d);
  }

  function zoneA(d){
    const z = $('#dnZone');
    let h = '<div class="card"><b>اختر الوحدة ثم رقم الفرض — Wähle Unité + Variante :</b><div class="dn-pick">';
    for(let u = 1; u <= 16; u++){
      h += '<span class="dn-g">U' + u + ' ' + esc((((d.mal.malakhiss||[]).filter(m=>m.unite===u)[0])||{}).titre_ar || '') + ' ' + [1,2,3].map(v =>
        '<button class="dn-v" data-u="' + u + '" data-v="' + v + '">' + v + '</button>').join('')
        + '</span>';
    }
    h += '</div><div id="dnSujet"></div></div>';
    z.innerHTML = h;
    z.querySelectorAll('.dn-v').forEach(b => b.addEventListener('click', () => {
      const u = +b.dataset.u, v = +b.dataset.v;
      const g = genere(u, v, d);
      const s = $('#dnSujet');
      s.innerHTML = '<div class="dn-suj"><div class="dn-head"><b>📝 Kontrollarbeit Nr.' + v + ' — '
        + esc(g.un.titre_de || ('Unité ' + u)) + '</b><span>/20 · 45 min · تصحيح فوري</span></div>' + (g.texte ? '<div class="sujet-box" dir="ltr" style="text-align:left;margin:10px 0">' + esc(g.texte) + '</div>' : '') + '<div style="margin:6px 0"><button class="btn btn-o btn-sm" id="dnEc">🔊 écouter</button> <button class="btn btn-o btn-sm" id="dnSt">⏹ stop</button></div>' 
        + '<div class="dn-p"><b>I. Leseverstehen — فهم النص (8 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'I').map((x, i) => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><div class="dn-p"><b>II. Sprachbausteine — اللغة (8 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'II').map(x => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><div class="dn-p"><b>III. Textproduktion — التعبير الكتابي (4 Pkt.)</b>'
        + g.Q.filter(x => x.partie === 'III').map(x => qHtml(x, g.Q.indexOf(x))).join('')
        + '</div><button class="btn btn-p btn-block" id="dnCorr">✅ corriger ma copie</button>'
        + '<div id="dnNote"></div></div>';
      const __ec=$('#dnEc'); if(__ec) __ec.addEventListener('click',()=>ecouterDE(g.texte||''));
      const __st=$('#dnSt'); if(__st) __st.addEventListener('click',stopEc);
      $('#dnCorr').addEventListener('click', () => {
        const res = corrige(g.Q, s, { unite: u });
        $('#dnNote').innerHTML = '<div class="dn-res">Note : <b>' + res.note.toFixed(1)
          + ' / 20</b>  ·  mention ' + mention(res.note)
          + '<br><span>كل خطأ أصبح بطاقة 🧠 للمراجعة تلقائيًا — واصل بلا قلق، فالوقت ليس مهمًا !</span></div>';
      });
    }));
  }
  function mention(n){
    return n >= 16 ? 'Très bien 👏' : n >= 14 ? 'Bien 👍' : n >= 10 ? 'Passable ✔'
         : n >= 8 ? 'Insuffisant — revois les cartes 🧠' : 'À reprendre avec l’unité 📗';
  }
  function qHtml(x, i){
    if(x.type === 'vf') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q)
      + '</span><div class="dn-help" style="font-size:12px;color:var(--m);margin:4px 0">❓ صح أم خطأ ؟ richtig = صحيح · falsch = خطأ</div><label><input type="radio" name="vf' + i + '" value="true"> richtig</label>'
      + '<label><input type="radio" name="vf' + i + '" value="false"> falsch</label></div>';
    if(x.type === 'mcq') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q) + '</span>'
      + '<div class="dn-help" style="font-size:12px;color:var(--m);margin:4px 0">❓ اختر الإجابة الصحيحة</div>' + (x.opts || []).map((o, k) => '<label><input type="radio" name="mcq' + i + '" value="' + k
          + '"> ' + esc(o) + '</label>').join('') + '</div>';
    if(x.type === 'phrase') return '<div class="dn-q"><span class="dn-qt">' + esc(x.q)
      + '</span><div class="dn-help" style="font-size:12px;color:var(--m);margin:4px 0">✍️ أجب بجملة كاملة بالألمانية ثم قيّم نفسك بصدق</div><textarea rows="2" placeholder="deine Antwort (ganzer Satz)"></textarea>'
      + '<div class="dn-self">auto-note : <select id="ph' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option></select> / ' + x.pts + '</div></div>';
    return '<div class="dn-q"><span class="dn-qt">' + esc(x.q) + '</span>'
      + '<div class="dn-help" style="font-size:12px;color:var(--m);margin:4px 0">✍️ اكتب 5 جمل بالألمانية (بداية جميلة + weil + سؤال) ثم قيّم نفسك بصدق</div><textarea rows="5" placeholder="Schreibe hier deine 5 Sätze…"></textarea>'
      + '<div class="dn-check">' + x.checklist.map(c => '<span>☐ ' + c + '</span>').join('')
      + '</div><div class="dn-self">auto-note : <select id="prod' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option><option value="3">3</option>'
      + '<option value="4">4</option></select> / ' + x.pts + '</div></div>';
  }

  function clean(t, x){
    let s = String(t || '');
    const bad = [x && x.lycee, x && x.ville, x && x.wilaya].filter(v => v && String(v).trim() !== '—' && String(v).trim() !== '-');
    s = s.split('\n').filter(l => {
      const L = l.toLowerCase();
      if(/www\.|http|facebook|youtube|\.com|\.fr|\.dz/.test(L)) return false;
      for(const b of bad){ if(b && L.indexOf(String(b).toLowerCase()) !== -1) return false; }
      return true;
    }).join('\n');
    const first = (s.split('\n')[0] || '');
    if(/lycée|lycee|site|www|http/i.test(first)) s = s.split('\n').slice(1).join('\n');
    return s;
  }
    /* ── Si le sujet réel est générique, on affiche un VRAI examen (texte+questions+solution)
     depuis la BANK par unité, et la voix lit le TEXTE. ── */
  const reelCache = {};
  function reel(x){
    if(reelCache[x.id]) return reelCache[x.id];
    const gen = /نص حول الموضوع/.test(x.sujet || '');
    const B = BANK[x.unite] || BANK[((+x.unite - 1) % 16) + 1];
    let o;
    if(gen && B){
      const body = 'TEXT — ' + B.text +
        '\n\nI. Richtig oder falsch ?\n' + B.rf.map((r,i)=>String.fromCharCode(97+i)+') '+r.q).join('\n') +
        '\n\nII. Antworte in ganzen Sätzen :\n' + B.open.map((r,i)=>String.fromCharCode(101+i)+') '+r.q).join('\n');
      const sol = 'I. ' + B.rf.map(r=> r.a ? 'Richtig' : 'Falsch').join(' · ') +
        '\nII. ' + B.open.map(r=> r.a).join(' · ');
      o = { body: body, sol: sol, audio: B.text };
    } else {
      o = { body: clean(x.sujet, x), sol: (x.corrige || '(Lösung enthalten: ' + (x.corrige_inclus?'oui':'non') + ')'), audio: lignesDE(x.sujet) };
    }
    reelCache[x.id] = o; return o;
  }
function zoneB(d){
    const z = $('#dnZone');
    const nivs = [...new Set(d.dv.map(x => x.niveau))];
    z.innerHTML = '<div class="card"><div class="dn-filt">'
      + '<select id="fNiv"><option value="">كل المستويات — alle Niveaus</option>'
      + nivs.map(n => '<option>' + esc(n) + '</option>').join('') + '</select>'
      + '<select id="fTri"><option value="1">Trimester 1</option><option value="2">T2</option>'
      + '<option value="3">T3</option><option value="">alle</option></select>'
      + '<input id="fQ" placeholder="ابحث : العنوان، الوحدة…">'
      + '</div><div id="fList"></div></div>';
    const maj = () => {
      const q = ($('#fQ').value || '').toLowerCase();
      const rows = d.dv.filter(x =>
        (!$('#fNiv').value || x.niveau === $('#fNiv').value)
        && (!$('#fTri').value || String(x.trimestre) === $('#fTri').value)
        && (!q || (x.titre + x.unite_de).toLowerCase().indexOf(q) !== -1))
        .slice(0, 40);
      $('#fList').innerHTML = '<p class="dn-sub">' + rows.length + ' angezeigt / ' + d.dv.length
        + '</p>' + rows.map((x, i) => '<div class="dn-r"><b>' + esc(x.titre_de || x.titre)
        + '</b><span>' + esc(x.niveau) + ' · ' + esc(x.wilaya) + ' · ' + (x.annee_scolaire || '')
        + ' · /' + x.bareme + ' · ' + x.duree_minutes + ' min</span>'
        + '<button class="btn btn-o btn-sm" data-i="' + i + '">📄 الموضوع + ✅ الحل</button>'
        + '<div class="dn-zone" id="dz' + i + '"></div></div>').join('');
      $('#fList').querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
        const x = rows[+b.dataset.i];
        $('#dz' + b.dataset.i).innerHTML = '<div class="dn-suj"><b>📄 الموضوع — Aufgabe</b>'
          + '<pre class="dn-pre" dir="auto">' + esc(reel(x).body) + '</pre>'
          + '<b>✅ الحل — Lösung</b><pre class="dn-pre" dir="auto">' + esc(x.corrige || '(Lösung enthalten: '
          + (x.corrige_inclus ? 'oui' : 'non') + ')') + '</pre>' + '<div style="margin:6px 0"><button class="btn btn-o btn-sm" data-ec="s">🔊 écouter le sujet</button> ' + '<button class="btn btn-o btn-sm" data-ec="c">🔊 solution</button> ' + '<button class="btn btn-o btn-sm" data-ec="x">⏹</button></div></div>';
        const __zb=$('#dz'+b.dataset.i);
        const __e1=__zb && __zb.querySelector('[data-ec="s"]'); if(__e1)__e1.addEventListener('click',()=>ecouterDE(reel(x).audio));
        const __e2=__zb && __zb.querySelector('[data-ec="c"]'); if(__e2)__e2.addEventListener('click',()=>ecouterMixte(reel(x).sol));
        const __e3=__zb && __zb.querySelector('[data-ec="x"]'); if(__e3)__e3.addEventListener('click',stopEc);
      }));
    };
    $('#fNiv').addEventListener('change', maj);
    $('#fTri').addEventListener('change', maj);
    $('#fQ').addEventListener('input', maj);
    maj();
  }

  window.renderDevoirs = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'devoirs') render(); });
})();
