/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — rag.js  (v2 : index shardé)
   🔎 RAG GARDÉ : la réponse est TOUJOURS un extrait verbatim d'un chunk du
   corpus + sa source. Jamais inventé.
   · Si shards_manifest.json existe : recherche shard par shard (mémoire
     bornée à 1 shard, chargement progressif, arrêt précoce si match fort).
   · Sinon : repli sur l'index unique corpus_index.json.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SEUIL = 2;
  function parler(t, lang){ try{ if('speechSynthesis' in window){
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t);
    u.lang = lang || (/[\u0600-\u06FF]/.test(t) ? 'ar-DZ' : 'de-DE'); speechSynthesis.speak(u); } }catch(e){} }
  let MAN = null, LEGACY = null;

  async function chargeManifest(){
    if(MAN !== null) return MAN;
    try{
      const r = await fetch('assets/bdd/shards_manifest.json', { cache:'no-store' });
      MAN = r.ok ? await r.json() : null;
    }catch(e){ MAN = null; }
    return MAN;
  }
  async function chargeLegacy(){
    if(LEGACY !== null) return LEGACY;
    try{
      const r = await fetch('assets/bdd/corpus_index.json', { cache:'no-store' });
      LEGACY = r.ok ? await r.json() : null;
    }catch(e){ LEGACY = null; }
    return LEGACY;
  }
  function termes(q){
    return Array.from(new Set(
      String(q || '').toLowerCase().match(/[a-zà-ÿ\u0600-\u06ff]{3,}/g) || []));
  }

  /* recherche shard par shard : un seul shard en mémoire à la fois */
  async function cherche(q){
    const ts = termes(q);
    if(!ts.length) return null;
    const man = await chargeManifest();
    if(man && man.shards && man.shards.length){
      let best = null;
      for(const sh of man.shards){
        let data = null;
        try{
          const r = await fetch('assets/bdd/shards/' + sh.file, { cache:'no-store' });
          if(r.ok) data = await r.json();
        }catch(e){}
        if(!data) continue;
        const scores = {};
        ts.forEach(t => { (data.termes[t] || []).forEach(cid => {
          scores[cid] = (scores[cid] || 0) + 1; }); });
        for(const cid in scores){
          const sc = scores[cid];
          if(sc >= SEUIL && (!best || sc > best.score)){
            const chunk = (data.chunks || []).filter(c => c.n === +cid)[0];
            if(chunk) best = { score: sc, texte: chunk.texte, doc: chunk.doc };
          }
        }
        if(best && best.score >= SEUIL + 3) break;   /* match fort : arrêt précoce */
      }
      return best;
    }
    const idx = await chargeLegacy();
    if(!idx) return null;
    const scores = {};
    ts.forEach(t => { (idx.termes[t] || []).forEach(cid => {
      scores[cid] = (scores[cid] || 0) + 1; }); });
    let best = null;
    for(const cid in scores){
      const sc = scores[cid];
      if(sc >= SEUIL && (!best || sc > best.score)){
        const ch = idx.chunks[+cid];
        if(ch) best = { score: sc, texte: ch.texte, doc: ch.doc };
      }
    }
    return best;
  }


  /* ══════════════════════════════════════════════════════════════════════
     Routeur pédagogique v3 — مكتبة أسئلة الطالب الجزائري
     10 أنواع : شرح / تمارين / فرض / باك / قاعدة / مفردات / نطق / مراجعة /
     توجيه / تصحيح  · 134 صيغة (عر + جزائرية + فر + ألم)
     ══════════════════════════════════════════════════════════════════════ */
  let MAL = null, BAN = null, VOC = null, QUEST = null, CORP = null;
  async function cj(url){ try{ const r = await fetch(url, { cache:'no-store' });
      return r.ok ? await r.json() : null; }catch(e){ return null; } }
  async function chargeMalakhiss(){ if(MAL === null) MAL = await cj('assets/bdd/malakhiss.json'); return MAL; }
  async function chargeBanque(){ if(BAN === null) BAN = await cj('assets/bdd/contenu_original.json'); return BAN; }
  async function chargeVoc(){ if(VOC === null) VOC = await cj('assets/bdd/vocabulaire_eleve.json'); return VOC; }
  async function chargeQuest(){ if(QUEST === null) QUEST = await cj('assets/bdd/questions_eleve.json'); return QUEST; }
  async function chargeCorp(){ if(CORP === null) CORP = await cj('assets/bdd/corpus.json'); return CORP; }

  const ORD = { 'الاول':1,'الأول':1,'الثاني':2,'الثالث':3,'الرابع':4,'الخامس':5,'السادس':6,
                'السابع':7,'الثامن':8,'التاسع':9,'العاشر':10,'الحادي':11,'الثاني عشر':12,
                'واحد':1,'اثنان':2,'ثلاثة':3,'اربعة':4,'خمسة':5,'ستة':6 };
  function numeroUnite(q){
    const s = String(q || '');
    let m = s.match(/(?:الوحدة|وحدة|u)\s*[:\-]?\s*(\d{1,2})/i);
    if(m) return +m[1];
    for(const k in ORD){ if(s.indexOf(k) !== -1) return ORD[k]; }
    m = s.match(/(?:الدرس|درس)\s*[:\-]?\s*(\d{1,2})/);
    if(m) return +m[1];
    return null;
  }
  async function matchType(q){
    const Q = await chargeQuest();
    if(!Q) return null;
    const s = String(q || '').toLowerCase();
    for(const t of (Q.types || [])){
      for(const m of (t.motifs || [])){
        if(s.indexOf(m.toLowerCase()) !== -1) return t;
      }
    }
    return null;
  }
  const REGLES = [
    { k: ['sein'], l: 'sein' }, { k: ['haben'], l: 'haben' },
    { k: ['perfekt'], l: 'Perfekt' }, { k: ['akkusativ'], l: 'Akkusativ' },
    { k: ['dativ'], l: 'Dativ' }, { k: ['komparativ','comparatif'], l: 'Komparativ' },
    { k: ['konjunktiv'], l: 'Konjunktiv' }, { k: ['passiv'], l: 'Passiv' },
    { k: ['futur'], l: 'Futur' }, { k: ['w-fragen','w fragen'], l: 'W-Fragen' },
    { k: ['weil'], l: 'weil' }, { k: ['obwohl'], l: 'obwohl' },
    { k: ['sowohl'], l: 'sowohl…als auch' }, { k: ['um zu','um…zu'], l: 'um…zu' },
    { k: ['beim'], l: 'beim + Infinitiv' }, { k: ['präsens','present'], l: 'Präsens' }
  ];
  function trouveRegle(q){
    const s = String(q || '').toLowerCase();
    for(const r of REGLES){ for(const k of r.k){ if(s.indexOf(k) !== -1) return r.l; } }
    return null;
  }
  function uniteDeRegle(mal, label){
    const low = label.toLowerCase();
    return (mal.malakhiss || []).filter(u =>
      (u.grammaire || []).join(' ').toLowerCase().indexOf(low) !== -1)[0] || null;
  }
  function chipsUnites(q){
    let h = '<b>🤔 حدد الوحدة أولًا</b><br><span class="rag-src">اضغط على وحدتك :</span>'
      + '<div class="rq-chips">';
    for(let n = 1; n <= 16; n++){
      h += '<button type="button" class="rq-u" data-u="' + n + '">الوحدة ' + n + '</button>';
    }
    return h + '</div>';
  }
  function resumeUnite(u, n, enDe){
    const lecons = (MAL.dourous || []).filter(d => d.unite === n);
    let h = '<b>📘 الوحدة ' + n + ' — ' + esc(enDe ? u.titre_de : u.titre_ar)
      + (enDe ? '' : ' · ' + esc(u.titre_de)) + '</b>'
      + '<br><span class="rag-src">' + (enDe ? 'Erklärung auf Deutsch' : 'شرح من ملخصاتك — لا اختلاق')
      + '</span>'
      + '<div class="rag-x">' + (enDe ? '📘 ' : '💡 ') + esc(enDe ? u.titre_de : u.idee) + '</div>'
      + '<div class="rg-sec"><b>🔑 ' + (enDe ? 'Wortschatz' : 'مفردات') + '</b><div class="mk-chips">'
      + (u.vocabulaire || []).slice(0, 6).map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('')
      + '</div></div>'
      + '<div class="rg-sec"><b>📘 ' + (enDe ? 'Grammatik' : 'القاعدة') + '</b><ul>'
      + (u.grammaire || []).slice(0, 3).map(g => '<li class="de-in">' + esc(g) + '</li>').join('')
      + '</ul></div>'
      + '<div class="rg-sec"><b>🗣️ ' + (enDe ? 'Beispiele' : 'أمثلة') + '</b><ul>'
      + (u.structures || []).slice(0, 3).map(s => '<li class="de-in">' + esc(s) + '</li>').join('')
      + '</ul></div>';
    if(!enDe){
      h += '<div class="rg-sec mk-tip"><b>⚠️ انتبه</b><ul>'
        + (u.conseils || []).slice(0, 2).map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>'
        + '<div class="rg-sec"><b>📖 دروس الوحدة (' + lecons.length + ')</b><ul>'
        + lecons.slice(0, 8).map(l => '<li>د' + l.n + ' · ' + esc(l.titre_ar) + '</li>').join('')
        + '</ul></div>';
    }
    h += '<div class="rg-sec"><button type="button" class="voz-speak"'
      + (enDe ? ' data-lang="de-DE"' : '') + '>🔊</button> '
      + (enDe ? 'Anhören' : 'استمع للشرح') + '</div>';
    return h;
  }
  function mapComps(u){
    const g = (u.grammaire || []).join(' ').toLowerCase();
    const cs = [];
    if(/w-fragen|frage/.test(g)) cs.push('w-fragen');
    if(/akkusativ/.test(g)) cs.push('akkusativ');
    if(/dativ/.test(g)) cs.push('dativ');
    if(/perfekt/.test(g)) cs.push('perfekt');
    if(/sein|haben|präsens|konjug/.test(g)) cs.push('conjugaison');
    if(!cs.length) cs.push('vocabulaire');
    return cs;
  }
  function bindExos(out, exos, modeFard){
    let ok = 0, done = 0;
    out.querySelectorAll('.rq-c').forEach(card => {
      const x = exos[+card.dataset.i]; if(!x) return;
      card.querySelectorAll('.rq-o').forEach(b => b.addEventListener('click', () => {
        if(b.disabled) return;
        const k = +b.dataset.k;
        card.querySelectorAll('.rq-o').forEach((bb, kk) => {
          bb.disabled = true; bb.classList.remove('ok', 'ko');
          if(kk === x.a) bb.classList.add('ok');
          else if(kk === k) bb.classList.add('ko');
        });
        done++; if(k === x.a) ok++;
        const fb = card.querySelector('.rq-fb');
        if(fb){ fb.hidden = false; fb.className = 'rq-fb ' + (k === x.a ? 'ok' : 'ko');
          fb.innerHTML = (k === x.a ? '✅ صحيح! ' : '❌ خطأ. ') + '💡 ' + esc(x.why); }
        if(window.MEMOIRE && k !== x.a){
          try{ window.MEMOIRE.record({ q: x.q, bad: x.opts[k], good: x.opts[x.a],
                                       comp: x.comp, unite: null, src: 'rag-exo' }); }catch(e){}
        }
        if(modeFard && done === exos.length){
          const sc = out.querySelector('.rq-score');
          if(sc){ sc.hidden = false;
            sc.innerHTML = '📊 نتيجتك : <b>' + ok + ' / ' + exos.length + '</b> · '
              + Math.round(ok / exos.length * 20) + '/20'; }
        }
      }));
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     محرك تصريف محلي (20 فعلًا : Präsens / Präteritum / Perfekt)
     جواب فوري موثوق لـ « كيف أصرف/اتصرف X؟ » — بدون استرجاع ولا اختلاق.
     ══════════════════════════════════════════════════════════════════════ */
  const PERS = ['ich','du','er / sie / es','wir','ihr','sie / Sie'];
  const CONJ = {
    'sein':      { p:['bin','bist','ist','sind','seid','sind'],
                   t:['war','warst','war','waren','wart','waren'], p2:'ist gewesen' },
    'haben':     { p:['habe','hast','hat','haben','habt','haben'],
                   t:['hatte','hattest','hatte','hatten','hattet','hatten'], p2:'hat gehabt' },
    'werden':    { p:['werde','wirst','wird','werden','werdet','werden'],
                   t:['wurde','wurdest','wurde','wurden','wurdet','wurden'], p2:'ist geworden' },
    'gehen':     { p:['gehe','gehst','geht','gehen','geht','gehen'],
                   t:['ging','gingst','ging','gingen','gingt','gingen'], p2:'ist gegangen' },
    'kommen':    { p:['komme','kommst','kommt','kommen','kommt','kommen'],
                   t:['kam','kamst','kam','kamen','kamt','kamen'], p2:'ist gekommen' },
    'machen':    { p:['mache','machst','macht','machen','macht','machen'],
                   t:['machte','machtest','machte','machten','machtet','machten'], p2:'hat gemacht' },
    'lernen':    { p:['lerne','lernst','lernt','lernen','lernt','lernen'],
                   t:['lernte','lerntest','lernte','lernten','lerntet','lernten'], p2:'hat gelernt' },
    'spielen':   { p:['spiele','spielst','spielt','spielen','spielt','spielen'],
                   t:['spielte','spieltest','spielte','spielten','spieltet','spielten'], p2:'hat gespielt' },
    'lesen':     { p:['lese','liest','liest','lesen','lest','lesen'],
                   t:['las','last','las','lasen','last','lasen'], p2:'hat gelesen' },
    'schreiben': { p:['schreibe','schreibst','schreibt','schreiben','schreibt','schreiben'],
                   t:['schrieb','schriebst','schrieb','schrieben','schriebt','schrieben'], p2:'hat geschrieben' },
    'fahren':    { p:['fahre','fährst','fährt','fahren','fahrt','fahren'],
                   t:['fuhr','fuhrst','fuhr','fuhren','fuhrt','fuhren'], p2:'ist gefahren' },
    'schlafen':  { p:['schlafe','schläfst','schläft','schlafen','schlaft','schlafen'],
                   t:['schlief','schliefst','schlief','schliefen','schlieft','schliefen'], p2:'hat geschlafen' },
    'essen':     { p:['esse','isst','isst','essen','esst','essen'],
                   t:['aß','aßt','aß','aßen','aßt','aßen'], p2:'hat gegessen' },
    'trinken':   { p:['trinke','trinkst','trinkt','trinken','trinkt','trinken'],
                   t:['trank','trankst','trank','tranken','trankt','tranken'], p2:'hat getrunken' },
    'nehmen':    { p:['nehme','nimmst','nimmt','nehmen','nehmt','nehmen'],
                   t:['nahm','nahmst','nahm','nahmen','nahmt','nahmen'], p2:'hat genommen' },
    'geben':     { p:['gebe','gibst','gibt','geben','gebt','geben'],
                   t:['gab','gabst','gab','gaben','gabt','gaben'], p2:'hat gegeben' },
    'helfen':    { p:['helfe','hilfst','hilft','helfen','helft','helfen'],
                   t:['half','halfst','half','halfen','halft','halfen'], p2:'hat geholfen' },
    'wissen':    { p:['weiß','weißt','weiß','wissen','wisst','wissen'],
                   t:['wusste','wusstest','wusste','wussten','wusstet','wussten'], p2:'hat gewusst' },
    'können':    { p:['kann','kannst','kann','können','könnt','können'],
                   t:['konnte','konntest','konnte','konnten','konntet','konnten'], p2:'hat gekonnt' },
    'müssen':    { p:['muss','musst','muss','müssen','müsst','müssen'],
                   t:['musste','musstest','musste','mussten','musstet','mussten'], p2:'hat gemusst' },
    'wollen':    { p:['will','willst','will','wollen','wollt','wollen'],
                   t:['wollte','wolltest','wollte','wollten','wolltet','wollten'], p2:'hat gewollt' },
    'dürfen':    { p:['darf','darfst','darf','dürfen','dürft','dürfen'],
                   t:['durfte','durftest','durfte','durften','durftet','durften'], p2:'hat gedurft' },
    'mögen':     { p:['mag','magst','mag','mögen','mögt','mögen'],
                   t:['mochte','mochtest','mochte','mochten','mochtet','mochten'], p2:'hat gemocht' }
  };
  const CONJ_INTENT = /(صرف|تصرف|اتصرف|أتصرف|صرفلي|صرف لي|conjug|konjug|forme|كيف ا|كيف أ|كيف ن)/;
  function trouveVerbe(q){
    const s = (' ' + String(q || '').toLowerCase() + ' ');
    for(const v in CONJ){
      if(s.indexOf(' ' + v + ' ') !== -1 || s.indexOf(' ' + v + '؟') !== -1
         || s.indexOf(' ' + v + '?') !== -1) return v;
    }
    return null;
  }
  function tableauConj(v){
    const c = CONJ[v];
    let h = '<b>📘 تصريف « ' + esc(v) + ' »</b>'
      + '<br><span class="rag-src">Präsens · Präteritum · Perfekt — جدول موثوق، لا استرجاع</span>'
      + '<table class="cj-tab"><tr><th></th><th>Präsens</th><th>Präteritum</th></tr>';
    for(let i = 0; i < 6; i++){
      h += '<tr><td class="cj-p">' + PERS[i] + '</td>'
        + '<td class="de-in">' + esc(c.p[i]) + '</td>'
        + '<td class="de-in">' + esc(c.t[i]) + '</td></tr>';
    }
    h += '</table><div class="rg-sec"><b>Perfekt</b> <span class="de-in">' + esc(c.p2)
      + '</span></div>'
      + '<div class="rg-sec"><button type="button" class="voz-speak" data-lang="de-DE">🔊</button> '
      + 'استمع للتصريف</div>';
    return h;
  }
  function parleConj(v){
    const c = CONJ[v];
    return PERS.map((p, i) => p + ' ' + c.p[i]).join('. ') + '. Perfekt: ' + c.p2 + '.';
  }
  /* ── normalisation DARIJA → arabe standard / mots-clés routables ── */
  const DAR = [
    [/كيفاش/g, 'كيف'], [/شنو|اش(?=\s)/g, 'ما'], [/واش/g, 'ما'], [/وين|فين/g, 'أين'],
    [/باش(?=\s)/g, 'كيف'], [/علاش/g, 'لماذا'], [/بزاف|بيزاف/g, 'كثير'], [/شوية/g, 'قليل'],
    [/ما\s*فهمت|mafhemt|n'?fhem/g, 'اشرح'], [/عطيني|اعطيني/g, 'أعطني'],
    [/هاد/g, 'هذا'], [/هادي/g, 'هذه'], [/ديال|نتاع|تاع/g, 'ل'], [/صعف/g, 'صعب'],
    [/نصرف/g, 'صرف'], [/يصرفو|يصرف/g, 'صرف'], [/الالماني/g, 'الألماني'],
    [/فرض|الفرض/g, 'الفرض'], [/تمارين/g, 'تمارين'], [/درس|الدرس/g, 'الدرس'],
    [/قواعد|القواعد/g, 'القواعد'], [/ملخص|الملخص/g, 'الملخص'], [/باكالوريا|الباك/g, 'البكالوريا'],
    [/examen|exo/gi, 'تمارين'], [/comment|comment on/gi, 'كيف'], [/pourquoi/gi, 'لماذا']
  ];
  function darja(q){
    let s = String(q || '');
    for(const p of DAR) s = s.replace(p[0], p[1]);
    return s;
  }


  /* ── lecture par PAGE du manuel ou par SECTION de Lektion ── */
  let _PAGES = null; const _BUCH = {};
  async function loadPages(){
    if(_PAGES) return _PAGES;
    try{
      const r = await fetch('assets/bdd/buch_pages.json', { cache:'no-store' });
      _PAGES = r.ok ? await r.json() : {};
    }catch(e){ _PAGES = {}; }
    return _PAGES;
  }
  let _PAGES3 = null;
  async function loadPages3as(){
    if(_PAGES3) return _PAGES3;
    try{
      const r3 = await fetch('assets/bdd/buch3as_pages.json', { cache:'no-store' });
      _PAGES3 = r3.ok ? await r3.json() : {};
    }catch(e){ _PAGES3 = {}; }
    return _PAGES3;
  }
  function linesOf(b){
    if(!b) return '';
    if(typeof b === 'string') return b;
    const a = Array.isArray(b) ? b : (b.lignes || b.lines || b.text || []);
    if(typeof a === 'string') return a;
    return (Array.isArray(a) ? a : []).map(x =>
      typeof x === 'string' ? x : (x.de || x.texte || x.text || '')).filter(Boolean).join('\n');
  }
  async function loadBuch(n){
    if(_BUCH[n]) return _BUCH[n];
    const f = n === 1 ? 'assets/bdd/buch_2as.json' : ('assets/bdd/buch_l' + n + '.json');
    try{
      const r = await fetch(f, { cache:'no-store' });
      if(r.ok){ const j = await r.json(); _BUCH[n] = (j.lektionen && j.lektionen[0]) || j; }
    }catch(e){}
    return _BUCH[n] || null;
  }
  function pickBlock(L, want){
    if(!L) return null;
    const k = Object.keys(L).filter(x => new RegExp(want, 'i').test(x))[0];
    return k ? L[k] : null;
  }
  function deNombre(q){
    const m = String(q).match(/\d{1,3}/); if(m) return +m[0];
    let s = String(q).toLowerCase().replace(/ü/g,'ue').replace(/ö/g,'oe').replace(/ä/g,'ae').replace(/ß/g,'ss');
    const tens = [['zwanzig',20],['dreissig',30],['vierzig',40],['fuenfzig',50],['sechzig',60],['siebzig',70],['achtzig',80],['neunzig',90]];
    const units = [['zwoelf',12],['elf',11],['zehn',10],['eins',1],['ein',1],['zwei',2],['drei',3],['vier',4],['fuenf',5],['sechs',6],['sieben',7],['acht',8],['neun',9]];
    const cent = /hundert|hudert|hondert/.test(s);
    let n = 0;
    if(cent){ n = 100; s = s.replace(/.*?(hundert|hudert|hondert)/, ''); }
    for(const t of tens){ if(s.indexOf(t[0]) !== -1){ n += t[1]; s = s.replace(t[0], ''); break; } }
    for(const u of units){ if(s.indexOf(u[0]) !== -1){ n += u[1]; break; } }
    return n || null;
  }
  async function intentLecture(q){
    const __kw = /(?:seite|page|صفحة|ص)/i.test(q); const __num = deNombre(q); const pg = (__kw && __num) ? [null, String(__num)] : null;
    if(pg){
      const lvl3 = /3as|الثالثة|troisi[eè]me|3[eè]me/i.test(q);
      const lvl2 = /2as|الثانية|deuxi[eè]me|2[eè]me/i.test(q);
      const niv0 = (window.getNiveauActif && window.getNiveauActif()) || '';
      const is3 = lvl3 || (!lvl2 && niv0 === '3AS');
      const P0 = is3 ? await loadPages3as() : await loadPages();
      const P = (P0 && P0.pages) ? P0.pages : (P0 || {});
      const e = P[pg[1]];
      if(e && e.locked && (e.lignes || e.texte)){
        let okEnt = false;
        try{ okEnt = !!(window.ACCESS && ACCESS.entitlement && ACCESS.entitlement().ok); }catch(err){}
        if(okEnt){
          let ls = Array.isArray(e.lignes) ? e.lignes : [e.texte || ''];
          const clean = ls.map(l => String(l).replace(/\((?:page|p\.)\s*\d+\)/gi,'').replace(/\s*·\s*/g,'. ').replace(/\s*→\s*/g,' ')).filter(x => x.trim());
          const tit = String(e.titre || '').replace(/\((?:page|p\.)\s*\d+\)/gi,'').trim();
          return ('Seite ' + pg[1] + '. ' + tit + '. ' + clean.join('. ')).slice(0, 2200);
        }
      }
      if(e && (e.lignes || e.texte) && !e.locked){
        let ls = Array.isArray(e.lignes) ? e.lignes : [e.texte || ''];
        const clean = ls.map(l => String(l)
          .replace(/\((?:page|p\.)\s*\d+\)/gi, '')
          .replace(/([A-ZÄÖÜa-zäöü])\s*=\s*/g, '$1 wie ')
          .replace(/\s*·\s*/g, '. ')
          .replace(/\s*→\s*/g, ' '))
          .filter(x => x.trim());
        const tit = String(e.titre || '').replace(/\((?:page|p\.)\s*\d+\)/gi, '').trim();
        return ('Seite ' + pg[1] + '. ' + tit + '. ' + clean.join('. ')).slice(0, 2200);
      }
      /* ── Phase 7 : page payante → corps depuis public.lesson_content.
         Le RLS SERVEUR décide (free OR active_entitlement) : sans abonnement
         actif la requête ne renvoie RIEN → paywall ; aucun corps ne fuite. ── */
      if(e && e.locked){
        try{
          if(window.SB && window.SB.sb){
            const sb = await window.SB.sb();
            if(sb){
              const r = await sb.from('lesson_content').select('body,titre').eq('page', +pg[1]).eq('level', is3 ? '3AS' : '2AS').maybeSingle();
              const row = r && r.data;
              if(row && row.body){
                const clean = String(row.body).split('\n').map(l => String(l)
                  .replace(/\((?:page|p\.)\s*\d+\)/gi, '')
                  .replace(/([A-ZÄÖÜa-zäöü])\s*=\s*/g, '$1 wie ')
                  .replace(/\s*·\s*/g, '. ')
                  .replace(/\s*→\s*/g, ' '))
                  .filter(x => x.trim());
                return ('Seite ' + pg[1] + '. ' + (row.titre || e.titre || '') + '. ' + clean.join('. ')).slice(0, 2200);
              }
            }
          }
        }catch(err){}
        try{ if(window.ACCESS && ACCESS.paywall) ACCESS.paywall({ type:'page', page:+pg[1] }); }catch(err){}
        return '🔒 الصفحة ' + pg[1] + ' من الكتاب ضمن محتوى المشتركين — أكمل المسار المجاني أو اشترك لفتح كل الصفحات.';
      }
      try{
          const O0 = is3 ? await loadPages() : await loadPages3as();
          const O = (O0 && O0.pages) ? O0.pages : (O0 || {});
          const e2 = O[pg[1]];
          if(e2 && (e2.lignes || e2.texte)){
            let ls2 = Array.isArray(e2.lignes) ? e2.lignes : [e2.texte || ''];
            const cl2 = ls2.map(l => String(l).replace(/\((?:page|p\.)\s*\d+\)/gi,'').replace(/\s*·\s*/g,'. ').replace(/\s*→\s*/g,' ')).filter(x => x.trim());
            const ti2 = String(e2.titre || '').replace(/\((?:page|p\.)\s*\d+\)/gi,'').trim();
            return '📚 هذه الصفحة من كتاب ' + (is3 ? '2AS' : '3AS') + ' — Seite ' + pg[1] + '. ' + ti2 + '. ' + cl2.join('. ').slice(0, 2200);
          }
        }catch(err){}
        return '📖 الصفحة ' + pg[1] + ' غير موجودة بعد في فهرس هذا المستوى — Seite ' + pg[1] + ' ist für dieses Niveau noch nicht indexiert. ' + 'Essaie : « lis le texte de la Lektion 1 », « lies den Dialog Lektion 2 », « vocabulaire Lektion 3 ».';
    }
    const lec = q.match(/(?:lis|lire|lies|lese|read|vorlesen|قرأ|اقرأ)\s+(?:le\s+|den\s+|das\s+|the\s+)?(texte|text|dialog|dialogue|vocabulaire|wortschatz|النص|الحوار|المفردات)[^\d]*(\d)?/i);
    if(lec){
      const nn = +(lec[2] || 1);
      const L = await loadBuch(nn);
      const wantD = /dialog|الحوار/i.test(lec[1]);
      const wantV = /vocab|wortschatz|المفردات/i.test(lec[1]);
      const blk = wantV ? pickBlock(L, 'wortschatz|vocab')
                : wantD ? pickBlock(L, 'dialog')
                : pickBlock(L, 'text');
      const txt = linesOf(blk);
      if(txt) return ('Lektion ' + nn + ' — ' + (wantV ? 'Wortschatz' : wantD ? 'Dialog' : 'Text')
        + ' :\n' + txt).slice(0, 900);
      return 'Je n’ai pas de ' + (wantV ? 'vocabulaire' : wantD ? 'dialogue' : 'texte')
        + ' pour la Lektion ' + nn + ' en mémoire.';
    }
    return null;
  }

  /* ── AGENT CONVERSATION : petites questions en allemand → réponse en allemand ── */
  function intentConversation(q){
    const isAr = /[\u0600-\u06FF]/.test(q);
    const isDe = !isAr && (/[\u00e4\u00f6\u00fc\u00df]/i.test(q) ||
      /\b(der|die|das|und|nicht|ich|du|ist|ein|eine|wo|wie|was|wer|bist|geht|hallo|guten)\b/i.test(q));
    if(!isDe) return null;
    if(/wo\s+bist\s+du/i.test(q))
      return 'Ich bin immer hier — auf deiner Plattform, bereit zum Üben! Und wo bist du? In Algier? In Oran? In Constantine?';
    if(/wie\s+geht\s+(es\s+)?(dir|ihnen|s)/i.test(q))
      return 'Danke, gut! Und dir? Wie geht es dir heute?';
    if(/(wer|was)\s+bist\s+du/i.test(q))
      return 'Ich bin deine intelligente Deutsch-Plattform aus Algerien — ich lese, erkläre und übe mit dir!';
    if(/wie\s+alt\s+bist\s+du/i.test(q))
      return 'Ich bin noch ganz jung — aber ich lerne jeden Tag dazu, genau wie du!';
    if(/^(hallo|hi|hey)\b/i.test(q) || /guten\s+(tag|morgen|abend)/i.test(q))
      return 'Hallo! Schön, dass du da bist! Frag mich etwas auf Deutsch oder Arabisch — oder sag « Seite 11 », ich lese sie dir vor.';
    if(/woher\s+kommst\s+du/i.test(q))
      return 'Ich komme aus deiner Plattform — aus Algerien, für alle Deutschlernenden! Und woher kommst du?';
    return null;
  }

  /* ── AGENT CONVERSATION ARABE : question arabe → réponse arabe garantie ── */
  /* ══════════════════════════════════════════════════════════════
     AGENT ARTIKEL/PLURAL LOCAL — filet de sécurité hors-cloud.
     Base extraite du manuel officiel 2AS « Vorwärts mit Deutsch »
     (L1-L9) + vocabulaire élève. Format : mot → [art, pluriel, ar, page]
     ══════════════════════════════════════════════════════════════ */
  const ARTIKEL_BASE = {
    /* ── L1 Sich vorstellen (p5-29) ── */
    'name':['der','die Namen','اسم',7],'alphabet':['das','die Alphabete','أبجدية',11],
    'buchstabiertafel':['die','—','جدول التهجئة',11],'sprache':['die','die Sprachen','لغة',11],
    'land':['das','die Länder','بلد',10],'stadt':['die','die Städte','مدينة',10],
    'freund':['der','die Freunde','صديق',15],'freundin':['die','die Freundinnen','صديقة',15],
    'brief':['der','die Briefe','رسالة',15],'briefmarke':['die','die Briefmarken','طابع بريدي',112],
    'deutschland':['—','—','ألمانيا',28],'europa':['—','—','أوروبا',28],
    'bundesland':['das','die Bundesländer','ولاية ألمانية',28],'hauptstadt':['die','die Hauptstädte','عاصمة',29],
    /* ── L2 Haus und Familie (p31-55) ── */
    'haus':['das','die Häuser','بيت',42],'familie':['die','die Familien','عائلة',31],
    'vater':['der','die Väter','أب',32],'mutter':['die','die Mütter','أم',32],
    'bruder':['der','die Brüder','أخ',32],'schwester':['die','die Schwestern','أخت',32],
    'kind':['das','die Kinder','طفل',32],'sohn':['der','die Söhne','ابن',35],
    'tochter':['die','die Töchter','ابنة',35],'eltern':['die','—','والدان',32],
    'großeltern':['die','—','أجداد',54],'onkel':['der','die Onkel','عم/خال',36],
    'tante':['die','die Tanten','عمة/خالة',36],'geschwister':['die','—','إخوة',32],
    'zimmer':['das','die Zimmer','غرفة',42],'wohnung':['die','die Wohnungen','شقة',42],
    'küche':['die','die Küchen','مطبخ',43],'badezimmer':['das','die Badezimmer','حمّام',43],
    'wohnzimmer':['das','die Wohnzimmer','غرفة المعيشة',43],'schlafzimmer':['das','die Schlafzimmer','غرفة النوم',44],
    'kinderzimmer':['das','die Kinderzimmer','غرفة الأطفال',44],'arbeitszimmer':['das','die Arbeitszimmer','غرفة العمل',44],
    'garten':['der','die Gärten','حديقة',43],'garage':['die','die Garagen','مرآب',45],
    'stuhl':['der','die Stühle','كرسي',43],'sessel':['der','die Sessel','كرسي وثيب',43],
    'sofa':['das','die Sofas','أريكة',43],'tisch':['der','die Tische','طاولة',43],
    'bett':['das','die Betten','سرير',43],'schrank':['der','die Schränke','خزانة',44],
    'kleiderschrank':['der','die Kleiderschränke','خزانة ملابس',44],
    'bücherschrank':['der','die Bücherschränke','خزانة كتب',43],
    'bücherregal':['das','die Bücherregale','رف كتب',43],'regal':['das','die Regale','رف',44],
    'kommode':['die','die Kommoden','خزانة أدراج',43],'lampe':['die','die Lampen','مصباح',44],
    'schreibtisch':['der','die Schreibtische','مكتب',44],'computer':['der','die Computer','حاسوب',44],
    'fernseher':['der','die Fernseher','تلفاز',44],'kühlschrank':['der','die Kühlschränke','ثلاجة',44],
    'waschmaschine':['die','die Waschmaschinen','غسالة',44],'gasherd':['der','die Gasherde','موقد غاز',44],
    'telefon':['das','die Telefone','هاتف',40],'handy':['das','die Handys','جوال',40],
    'fotoalbum':['das','die Fotoalben','ألبوم صور',48],'foto':['das','die Fotos','صورة',48],
    'mann':['der','die Männer','رجل',45],'frau':['die','die Frauen','امرأة',45],
    'junge':['der','die Jungen','صبي',46],'mädchen':['das','die Mädchen','بنت',46],
    'baum':['der','die Bäume','شجرة',44],'einzelkind':['das','die Einzelkinder','طفل وحيد',37],
    'beruf':['der','die Berufe','مهنة',33],'journalist':['der','die Journalisten','صحفي',34],
    'lehrer':['der','die Lehrer','أستاذ',34],'lehrerin':['die','die Lehrerinnen','أستاذة',34],
    /* ── L3 Schule (p57-76) ── */
    'schule':['die','die Schulen','مدرسة',57],'gymnasium':['das','die Gymnasien','ثانوية',58],
    'klasse':['die','die Klassen','قسم',58],'klassenzimmer':['das','die Klassenzimmer','قاعة درس',60],
    'schulhof':['der','die Schulhöfe','ساحة المدرسة',59],'schultasche':['die','die Schultaschen','محفظة',59],
    'bleistift':['der','die Bleistifte','قلم رصاص',59],'kugelschreiber':['der','die Kugelschreiber','قلم حبر',59],
    'füller':['der','die Füller','قلم حبر سائل',59],'spitzer':['der','die Spitzer','مبراة',59],
    'radiergummi':['der','die Radiergummis','ممحاة',59],'schere':['die','die Scheren','مقص',59],
    'lineal':['das','die Lineale','مسطرة',59],'heft':['das','die Hefte','كرّاس',59],
    'buch':['das','die Bücher','كتاب',59],'mappe':['die','die Mappen','ملف',59],
    'mäppchen':['das','die Mäppchen','مقلمة',59],'kreide':['die','—','طباشير',59],
    'tafel':['die','die Tafeln','سبورة',59],'stundenplan':['der','die Stundenpläne','جدول الحصص',66],
    'fach':['das','die Fächer','مادة',63],'fächer':['die','—','مواد',63],
    'mathe':['—','—','رياضيات',63],'mathematik':['die','—','رياضيات',63],
    'deutsch':['—','—','ألمانية',63],'englisch':['—','—','إنجليزية',63],
    'französisch':['—','—','فرنسية',63],'sport':['der','—','رياضة بدنية',63],
    'geschichte':['die','—','تاريخ',63],'geografie':['die','—','جغرافيا',63],
    'erdkunde':['die','—','جغرافيا',63],'biologie':['die','—','علوم طبيعية',63],
    'chemie':['die','—','كيمياء',63],'physik':['die','—','فيزياء',63],
    'musik':['die','—','موسيقى',63],'kunst':['die','—','فن',63],
    'informatik':['die','—','إعلام آلي',63],'religion':['die','—','تربية دينية',63],
    'philosophie':['die','—','فلسفة',63],'lehrerzimmer':['das','die Lehrerzimmer','قاعة الأساتذة',60],
    'wörterbuch':['das','die Wörterbücher','قاموس',60],'landkarte':['die','die Landkarten','خريطة',60],
    'note':['die','die Noten','نقطة/علامة',66],'zeugnis':['das','die Zeugnisse','شهادة',76],
    'schüler':['der','die Schüler','تلميذ',59],'schülerin':['die','die Schülerinnen','تلميذة',59],
    'hausaufgabe':['die','die Hausaufgaben','واجب منزلي',60],
    'pause':['die','die Pausen','استراحة',59],'unterricht':['der','—','درس',57],
    /* ── L4 Zeit und Wetter (p77-101) ── */
    'uhr':['die','die Uhren','ساعة',89],'zeit':['die','die Zeiten','وقت',77],
    'tag':['der','die Tage','يوم',78],'nacht':['die','die Nächte','ليل',78],
    'woche':['die','die Wochen','أسبوع',78],'monat':['der','die Monate','شهر',78],
    'jahr':['das','die Jahre','سنة',78],'morgen':['der','—','صباح',82],
    'vormittag':['der','die Vormittage','قبل الظهر',82],'mittag':['der','—','ظهر',82],
    'nachmittag':['der','die Nachmittage','بعد الظهر',82],'abend':['der','die Abende','مساء',82],
    'wetter':['das','—','طقس',77],'klima':['das','die Klimate','مناخ',98],
    'frühling':['der','—','ربيع',77],'sommer':['der','—','صيف',77],
    'herbst':['der','—','خريف',77],'winter':['der','—','شتاء',77],
    'jahreszeit':['die','die Jahreszeiten','فصل',77],'temperatur':['die','die Temperaturen','حرارة',100],
    'sonne':['die','—','شمس',77],'regen':['der','—','مطر',77],'schnee':['der','—','ثلج',77],
    'wind':['der','—','رياح',77],'wolke':['die','die Wolken','سحابة',86],
    'wetterbericht':['der','die Wetterberichte','نشرة الطقس',87],'geburtstag':['der','die Geburtstage','عيد ميلاد',84],
    'zug':['der','die Züge','قطار',94],'bahnhof':['der','die Bahnhöfe','محطة قطار',94],
    'gleis':['das','die Gleise','رصيف',94],'flugzeug':['das','die Flugzeuge','طائرة',95],
    'flug':['der','die Flüge','رحلة جوية',95],'gate':['das','die Gates','بوابة',95],
    'abfahrt':['die','die Abfahrten','انطلاق',94],'ankunft':['die','die Ankünfte','وصول',94],
    /* ── L5 Freizeit (p103-127) ── */
    'freizeit':['die','—','وقت فراغ',103],'hobby':['das','die Hobbys','هواية',104],
    'sport':['der','—','رياضة',103],'fußball':['der','—','كرة قدم',103],
    'handball':['der','—','كرة يد',105],'volleyball':['der','—','كرة طائرة',105],
    'basketball':['der','—','كرة سلة',105],'schwimmbad':['das','die Schwimmbäder','مسبح',104],
    'kino':['das','die Kinos','سينما',116],'theater':['das','die Theater','مسرح',106],
    'museum':['das','die Museen','متحف',119],'stadion':['das','die Stadien','ملعب',106],
    'eintrittskarte':['die','die Eintrittskarten','تذكرة دخول',106],'bühne':['die','die Bühnen','خشبة المسرح',107],
    'stück':['das','die Stücke','مسرحية',106],'film':['der','die Filme','فيلم',106],
    'musik hören':['—','—','استماع للموسيقى',105],'computer spiel':['das','die Computerspiele','لعبة حاسوب',103],
    'internet':['das','—','إنترنت',104],'ausflug':['der','die Ausflüge','نزهة',105],
    'reise':['die','die Reisen','رحلة',105],'verein':['der','die Vereine','نادي',124],
    /* ── L6 Mensch und Gesundheit (p129-149) ── */
    'körper':['der','die Körper','جسم',130],'kopf':['der','die Köpfe','رأس',131],
    'auge':['das','die Augen','عين',131],'ohr':['das','die Ohren','أذن',131],
    'nase':['die','die Nasen','أنف',131],'mund':['der','—','فم',131],
    'zahn':['der','die Zähne','سن',131],'hals':['der','—','حلق/عنق',131],
    'hand':['die','die Hände','يد',131],'finger':['der','die Finger','إصبع',131],
    'arm':['der','die Arme','ذراع',131],'bein':['das','die Beine','ساق',131],
    'fuß':['der','die Füße','قدم',131],'herz':['das','die Herzen','قلب',131],
    'arzt':['der','die Ärzte','طبيب',133],'ärztin':['die','die Ärztinnen','طبيبة',133],
    'zahnarzt':['der','die Zahnärzte','طبيب أسنان',129],'krankenhaus':['das','die Krankenhäuser','مستشفى',138],
    'apotheke':['die','die Apotheken','صيدلية',137],'medikament':['das','die Medikamente','دواء',136],
    'tablette':['die','die Tabletten','حبّة دواء',136],'fieber':['das','—','حمّى',135],
    'husten':['der','—','سعال',135],'grippe':['die','—','إنفلونزا',148],
    'erkältung':['die','die Erkältungen','زكام',135],'schmerzen':['die','—','آلام',131],
    'kopfschmerzen':['die','—','صداع',132],'bauchschmerzen':['die','—','ألم بطن',132],
    'halsschmerzen':['die','—','ألم حلق',132],'rückenschmerzen':['die','—','ألم ظهر',132],
    'ohrenschmerzen':['die','—','ألم أذن',132],'unfall':['der','die Unfälle','حادث',138],
    'krankenwagen':['der','die Krankenwagen','سيارة إسعاف',138],'krankenschwester':['die','die Krankenschwestern','ممرضة',138],
    'patient':['der','die Patienten','مريض',136],'operation':['die','die Operationen','عملية جراحية',141],
    'versicherung':['die','die Versicherungen','تأمين',149],'krankenversicherung':['die','die Krankenversicherungen','تأمين صحي',149],
    /* ── L7 Essen und Trinken (p151-180) ── */
    'essen':['das','—','أكل',151],'trinken':['das','—','شرب',151],
    'brot':['das','die Brote','خبز',152],'brötchen':['das','die Brötchen','خبز صغير',152],
    'wasser':['das','—','ماء',153],'milch':['die','—','حليب',153],
    'tee':['der','die Tees','شاي',153],'kaffee':['der','—','قهوة',153],
    'saft':['der','die Säfte','عصير',153],'cola':['die','die Colas','كولا',153],
    'limonade':['die','die Limonaden','ليمونادا',152],'apfel':['der','die Äpfel','تفاحة',152],
    'banane':['die','die Bananen','موزة',152],'birne':['die','die Birnen','إجاصة',153],
    'traube':['die','die Trauben','عنبة',153],'zitrone':['die','die Zitronen','ليمونة',153],
    'tomate':['die','die Tomaten','طماطم',153],'gurke':['die','die Gurken','خيار',153],
    'kartoffel':['die','die Kartoffeln','بطاطا',153],'gemüse':['das','—','خضروات',153],
    'obst':['das','—','فواكه',153],'fleisch':['das','—','لحم',153],
    'wurst':['die','die Würste','نقانق',153],'käse':['der','—','جبن',153],
    'butter':['die','—','زبدة',153],'ei':['das','die Eier','بيضة',152],
    'kuchen':['der','die Kuchen','كعكة',153],'keks':['der','die Kekse','بسكويت',153],
    'eis':['das','—','مثلجات',153],'pizza':['die','die Pizzas','بيتزا',153],
    'hähnchen':['das','die Hähnchen','دجاج',153],'fisch':['der','die Fische','سمك',153],
    'suppe':['die','die Suppen','شوربة',160],'salz':['das','—','ملح',163],
    'zucker':['der','—','سكر',163],'öl':['das','die Öle','زيت',153],
    'restaurant':['das','die Restaurants','مطعم',160],'speisekarte':['die','die Speisekarten','قائمة الطعام',160],
    'kellner':['der','die Kellner','نادل',160],'kellnerin':['die','die Kellnerinnen','نادلة',160],
    'teller':['der','die Teller','طبق',152],'gabel':['die','die Gabeln','شوكة',152],
    'messer':['das','die Messer','سكين',152],'löffel':['der','die Löffel','ملعقة',152],
    'tasse':['die','die Tassen','فنجان',153],'flasche':['die','die Flaschen','زجاجة',153],
    'rezept':['das','die Rezepte','وصفة',169],'supermarkt':['der','die Supermärkte','سوبرماركت',164],
    'bäckerei':['die','die Bäckereien','مخبزة',158],'metzgerei':['die','die Metzgereien','ملحمة',158],
    'markt':['der','die Märkte','سوق',158],'preis':['der','die Preise','سعر',168],
    'trinkgeld':['das','—','بقشيش',161],'rechnung':['die','die Rechnungen','فاتورة',161],
    /* ── L8 Aussehen und Charakter (p181-205) ── */
    'gesicht':['das','die Gesichter','وجه',182],'haar':['das','die Haare','شعر',182],
    'haare':['die','—','شعر',182],'auge':['das','die Augen','عين',182],
    'pullover':['der','die Pullover','سترة صوفية',192],'hemd':['das','die Hemden','قميص',192],
    'hose':['die','die Hosen','بنطلون',192],'rock':['der','die Röcke','تنورة',192],
    'kleid':['das','die Kleider','فستان',192],'jacke':['die','die Jacken','جاكيت',192],
    'schuh':['der','die Schuhe','حذاء',192],'mütze':['die','die Mützen','قبعة',192],
    'schal':['der','die Schals','وشاح',192],'handschuh':['der','die Handschuhe','قفاز',192],
    'anzug':['der','die Anzüge','بذلة',192],'gürtel':['der','die Gürtel','حزام',192],
    'farbe':['die','die Farben','لون',192],'charakter':['der','—','شخصية',181],
    /* ── L9 Stadt und Land (p207-223) ── */
    'stadt':['die','die Städte','مدينة',207],'dorf':['das','die Dörfer','قرية',207],
    'straße':['die','die Straßen','شارع',209],'platz':['der','die Plätze','ساحة',208],
    'mauer':['die','die Mauern','جدار',208],'tor':['das','die Tore','بوابة',209],
    'brücke':['die','die Brücken','جسر',208],'turm':['der','die Türme','برج',208],
    'kirche':['die','die Kirchen','كنيسة',208],'moschee':['die','die Moscheen','مسجد',208],
    'schloss':['das','die Schlösser','قصر',208],'park':['der','die Parks','حديقة عامة',208],
    'bus':['der','die Busse','حافلة',114],'taxi':['das','die Taxis','سيارة أجرة',114],
    'auto':['das','die Autos','سيارة',114],'fahrrad':['das','die Fahrräder','دراجة',114],
    'u-bahn':['die','die U-Bahnen','مترو',113],'s-bahn':['die','die S-Bahnen','قطار ضواحٍ',113],
    'straße bahn':['die','die Straßenbahnen','ترامواي',114],'fußgängerzone':['die','die Fußgängerzonen','منطقة مشاة',220],
    'hauptstadt':['die','die Hauptstädte','عاصمة',208],'einwohner':['der','die Einwohner','ساكن',223],
    'land':['das','die Länder','ريف/بلد',207],'natur':['die','—','طبيعة',219],
    'wald':['der','die Wälder','غابة',219],'berg':['der','die Berge','جبل',219],
    'fluss':['der','die Flüsse','نهر',219],'meer':['das','die Meere','بحر',219],
    'strand':['der','die Strände','شاطئ',219],'insel':['die','die Inseln','جزيرة',219]
  };

  /* ── intent ARTIKEL : « ما هي أداة Mädchen » / « article de Mädchen » /
     « Artikel von Mädchen » / « der die das Mädchen » ── */
  function intentArtikel(q){
    const s = String(q || '').toLowerCase();
    const isAsk = /artikel|article|articulo|articolo|الأداة|اداة|أداة|冠词|артикль/i.test(s)
      || /\b(der|die|das)\s+oder\s+(der|die|das)\b/.test(s)
      || /welcher\s+artikel|quel\s+article/i.test(s);
    if(!isAsk) return null;
    /* extraire le mot allemand (≥3 lettres latines) */
    const mots = s.match(/[a-zäöüß]{3,}/g) || [];
    const stop = ['artikel','article','articulo','articolo','der','die','das','und','oder','quel','quelle','welcher','welche','welches','von','de','the','what','ist','sind','was','que','qui','pour','avec','mit','pourquoi','الاداة','冠词','артикль'];
    let cible = '';
    for(const m of mots){ if(stop.indexOf(m) === -1){ cible = m; break; } }
    if(!cible) return null;
    const e = ARTIKEL_BASE[cible];
    if(!e) return null;
    const isAr = /[\u0600-\u06FF]/.test(q);
    if(isAr){
      return { html: '<b>📘 الأداة : <span class="de-in">' + e[0] + ' ' + cible + '</span></b><br>'
        + '<span class="rag-src">الجمع : <span class="de-in">' + e[1] + '</span> · بالعربية : ' + esc(e[2]) + ' · 📖 الكتاب ص' + e[3] + '</span>' };
    }
    return { html: '<b>📘 Artikel: <span class="de-in">' + e[0] + ' ' + cible + '</span></b><br>'
      + '<span class="rag-src">Plural: <span class="de-in">' + e[1] + '</span> · Buch Seite ' + e[3] + '</span>' };
  }

  /* ── intent PLURAL : « جمع Kind » / « plural von Kind » ── */
  function intentPlural(q){
    const s = String(q || '').toLowerCase();
    const isAsk = /plural|pluriel|جمع|الجمع|复数|множествен/i.test(s);
    if(!isAsk) return null;
    const mots = s.match(/[a-zäöüß]{3,}/g) || [];
    const stop = ['plural','pluriel','von','the','der','die','das','what','ist','quel','quelle','de','du','复数','множествен'];
    let cible = '';
    for(const m of mots){ if(stop.indexOf(m) === -1){ cible = m; break; } }
    if(!cible) return null;
    const e = ARTIKEL_BASE[cible];
    if(!e) return null;
    const isAr = /[\u0600-\u06FF]/.test(q);
    if(isAr){
      return { html: '<b>📘 الجمع : <span class="de-in">' + cible + ' → ' + e[1] + '</span></b><br>'
        + '<span class="rag-src">المفرد : <span class="de-in">' + e[0] + ' ' + cible + '</span> · بالعربية : ' + esc(e[2]) + ' · 📖 ص' + e[3] + '</span>' };
    }
    return { html: '<b>📘 Plural: <span class="de-in">' + cible + ' → ' + e[1] + '</span></b><br>'
      + '<span class="rag-src">Singular: <span class="de-in">' + e[0] + ' ' + cible + '</span> · Buch S.' + e[3] + '</span>' };
  }

  function intentConversationAr(q){
    if(!/[\u0600-\u06FF]/.test(q)) return null;
    if(/\u0645\u0646\s*\u0627\u0646\u062a|\u0645\u0646\s*\u0623\u0646\u062a/i.test(q))
      return 'أنا منصتك الذكية لتعلم الألمانية — أقرأ معك الكتاب صفحة صفحة، وأشرح القواعد، وأتمرن معك!';
    if(/\u0643\u064a\u0641\s*\u062d\u0627\u0644\u0643|\u0643\u064a\u0641\u0627\u0634/i.test(q))
      return 'الحمد لله، بخير! وأنت كيف حالك؟ هل أنت مستعد للتمرن اليوم؟';
    if(/\u0645\u0631\u062d\u0628\u0627|\u0633\u0644\u0627\u0645|\u0627\u0647\u0644\u0627|\u0623\u0647\u0644\u0627/i.test(q))
      return 'مرحبًا بك! اسألني بالعربية أو بالألمانية أو بالدارجة — وأنا أجيبك وأقرأ لك صفحات الكتاب بصوت واضح.';
    if(/\u0648\u064a\u0646|\u0627\u064a\u0646|\u0623\u064a\u0646/i.test(q))
      return 'أنا هنا دائمًا في منصتك، جاهزة للقراءة والشرح والتمرين!';
    return null;
  }

  /* ── AGENT FONDATEUR : « wer ist / qui est / من هو Kharif Ahmed ? » → réponse vérifiée
     dans la langue de la question (5 langues) ── */
  function intentKharif(q){
    if(!/kharif|karif|kharef|kherif|\u062e\u0631\u064a\u0641/i.test(q)) return null;
    const ask = /wer\s+ist|who\s+is|qui\s+est|chi\s+\u00e8|qui\u00e9n\s+es|\u0645\u0646\s+\u0647\u0648|\u0645\u064a\u0646|\u0634\u0646\u0648|\u0648\u0627\u0634/i.test(q)
      || /kharif\s+ahmed|ahmed\s+kharif|\u0627\u0644\u0623\u0633\u062a\u0627\u0630/i.test(q);
    if(!ask) return null;
    const isAr = /[\u0600-\u06FF]/.test(q);
    if(isAr) return 'الأستاذ خريف أحمد هو مؤسس منصتي ومعلّمها — «الثانوية الافتراضية الجزائرية». هو أستاذ اللغة الألمانية من الجزائر، بناني لكي يتعلّم كل التلاميذ الألمانية: قراءة الدروس، شرح القواعد، والتدرّب على الفروض والاختبارات — بالعربية والألمانية والفرنسية والإسبانية والإيطالية.';
    const isDe = /wer\s+ist|deutsch/i.test(q);
    if(isDe) return 'Prof. Kharif Ahmed ist der Gründer und Lehrer meiner Plattform — der «Virtuellen Algerischen Oberschule» (Lycée Virtuel Algérien). Er ist Deutschlehrer aus Algerien und hat mich gebaut, damit alle Schülerinnen und Schüler Deutsch lernen können: Lektionen lesen, Grammatik üben und Prüfungen trainieren — auf Arabisch, Deutsch, Französisch, Spanisch und Italienisch.';
    const isFr = /qui\s+est/i.test(q);
    if(isFr) return 'Le Professeur Kharif Ahmed est le fondateur et l\u2019enseignant de ma plateforme — le « Lycée Virtuel Algérien ». Professeur d\u2019allemand algérien, il m\u2019a créée pour que tous les élèves apprennent l\u2019allemand : lire les leçons, expliquer la grammaire, s\u2019entraîner aux devoirs — en arabe, allemand, français, espagnol et italien.';
    const isEs = /qui\u00e9n\s+es/i.test(q);
    if(isEs) return 'El profesor Kharif Ahmed es el fundador y maestro de mi plataforma — el « Bachillerato Virtual Argelino ». Profesor de alemán argelino, me creó para que todos los alumnos aprendan alemán: leer lecciones, explicar gramática y practicar exámenes — en árabe, alemán, francés, español e italiano.';
    return 'Il professor Kharif Ahmed è il fondatore e insegnante della mia piattaforma — il « Liceo Virtuale Algerino ». Insegnante di tedesco algerino, mi ha creata perché tutti gli studenti imparino il tedesco: leggere le lezioni, spiegare la grammatica e allenarsi ai compiti — in arabo, tedesco, francese, spagnolo e italiano.';
  }

  /* ── AGENT BIBLIOTHÈQUE : « donne-moi un devoir/exercice sur X » + « combien de documents ? » ── */
  async function intentBiblio(q){
    const wantDevoir = /(donne|donnez|apporte|zeige|gib|give|dame|voglio|\u0627\u0639\u0637\u0646\u064a|\u0647\u0627\u062a|\u062c\u064a\u0628|\u0648\u0631\u064a|\u062d\u0637)/i.test(q)
      && /(devoir|exercice|fiche|sujet|corrige|corrigé|aufgabe|übung|examen|\u062a\u0645\u0627\u0631\u064a\u0646|\u0641\u0631\u0636|\u062a\u0645\u0631\u064a\u0646|\u0627\u062e\u062a\u0628\u0627\u0631)/i.test(q);
    const wantStats = /(combien|how many|wie viele|cuántos|quanti|\u0643\u0645|\u0639\u062f\u062f)/i.test(q)
      && /(document|page|devoir|exercice|fiche|leçon|lecon|\u0645\u0633\u062a\u0646\u062f|\u0635\u0641\u062d\u0629|\u0641\u0631\u0636|\u062f\u0631\u0633)/i.test(q);
    if(!wantDevoir && !wantStats) return null;
    if(!window.BIBLIO) return null;
    const isAr = /[\u0600-\u06FF]/.test(q);
    const isDe = !isAr && /\b(der|die|das|und|gib|zeige|wie viele)\b/i.test(q);
    const isFr = !isAr && !isDe && /\b(combien|donne|le|la|les)\b/i.test(q);
    if(wantStats){
      let s = {};
      try{ s = await BIBLIO.stats(); }catch(e){}
      const lv = s.livre || 0, dv = s.devoirs || 0, gr = s.grammaire || 0, cp = s.corpus || 0;
      const tot = lv + dv + gr + cp;
      if(isAr) return '📚 مكتبة المنصة التعليمية : ' + lv + ' صفحة كتاب مفهرسة، ' + dv + ' فرضًا مصححًا، ' + gr + ' قاعدة قواعد، ' + cp + ' بطاقة مفردات — المجموع ' + tot + ' وثيقة. كل إجاباتي مبنية على هذه المكتبة.';
      if(isDe) return '📚 Die Bibliothek der Plattform : ' + lv + ' Buchseiten, ' + dv + ' Arbeiten mit Lösungen, ' + gr + ' Grammatik-Einträge, ' + cp + ' Vokabelkarten — insgesamt ' + tot + ' Dokumente. Meine ganze Intelligenz kommt aus dieser Bibliothek.';
      if(isFr) return '📚 La bibliothèque de la plateforme : ' + lv + ' pages de livre, ' + dv + ' devoirs corrigés, ' + gr + ' entrées de grammaire, ' + cp + ' fiches de vocabulaire — ' + tot + ' documents indexés. Toute mon intelligence vient de cette base.';
      return '📚 La biblioteca de la plataforma : ' + lv + ' páginas, ' + dv + ' deberes corregidos, ' + gr + ' reglas, ' + cp + ' fichas — ' + tot + ' documentos.';
    }
    let hits = [];
    try{ hits = await BIBLIO.search(q, 2); }catch(e){}
    if(!hits.length) return null;
    const h = hits[0];
    const head = (isAr ? '📚 من مكتبة المنصة — ' : isDe ? '📚 Aus der Bibliothek — ' : isFr ? '📚 Depuis la bibliothèque — ' : '📚 De la biblioteca — ')
      + '[' + h.src + ' ' + h.id + '] ' + (h.titre || '') + '\n';
    return head + String(h.texte || '').slice(0, 1100);
  }

  
/* ── خطوة 2 : Intent Ontology (darija/ar/fr/arabizi) → routing RAG ── */
let ONTO = null;
async function chargeOnto(){
  if(ONTO) return ONTO;
  try{ const r = await fetch('assets/bdd/intent_ontology.json', { cache:'no-store' });
    ONTO = r.ok ? await r.json() : { intents: [] };
  }catch(e){ ONTO = { intents: [] }; }
  return ONTO;
}
function normOnto(s){
  s = String(s||'').toLowerCase();
  s = s.replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[\u064B-\u065F\u0670]/g,'');
  if(!/[a-zäöüß]/.test(s))
    s = s.replace(/3/g,'ع').replace(/7/g,'ح').replace(/5/g,'خ').replace(/9/g,'ق').replace(/2/g,'ء');
  s = s.replace(/\s+/g,' ').trim();
  return s;
}
function tokOnto(s){ return s.split(/[^\w\u0600-\u06FF]+/).filter(w => w.length > 1); }
async function matchOnto(q){
  const O = await chargeOnto();
  const nq = normOnto(q);
  let best = null, bestScore = 0;
  for(const it of (O.intents || [])){
    let score = 0;
    const srcs = Object.values(it.patterns || {}).concat(Object.values(it.expansion || {})); for(const arr of srcs){
      for(const p of arr){
        const np = normOnto(p);
        if(nq === np) score = Math.max(score, 100);
        else if(np && (nq.indexOf(np) !== -1 || np.indexOf(nq) !== -1)) score = Math.max(score, 75);
        else {
          const tq = tokOnto(nq), tp = tokOnto(np);
          if(tp.length){ const inter = tp.filter(w => tq.indexOf(w) !== -1).length;
            if(inter / tp.length >= 0.6) score = Math.max(score, 55 + inter); }
        }
      }
    }
    const kw = (it.keywords || []).filter(k => nq.indexOf(normOnto(k)) !== -1).length;
    if(kw) score = Math.max(score, 30 + kw * 10);
    if(score > bestScore){ bestScore = score; best = it; }
  }
  return (best && bestScore >= 65) ? { it: best, score: bestScore } : null;
}
async function ontoRoute(q){
  try{
    const m = await matchOnto(q);
    if(!m) return null;
    const id = m.it.intent;
    const n = numeroUnite(q);
    if(id === 'explain_word' || id === 'translate'){
      const voc = await chargeVoc(); const mots = (voc && voc.mots) || [];
      const mq = String(q).match(/([A-Za-zÄÖÜäöüß]{3,})|([\u0600-\u06FF]{3,})/);
      const mot = mq ? (mq[1] || mq[2] || '') : '';
      const nm = normOnto(mot);
      const f = mots.filter(x => (x.de||'').toLowerCase() === mot.toLowerCase()
        || normOnto(x.ar||'').indexOf(nm) !== -1 || nm.indexOf(normOnto(x.ar||'')) !== -1)[0];
      if(f) return { html: '<b>🔤 المفردة</b><div class="rag-x de-in">' + esc(f.de) + '</div>'
        + '<div class="rg-sec"><b>بالعربية</b> ' + esc(f.ar) + '</div>', speakWord: f.de };
      return null;
    }
    if(id === 'pronounce_word'){
      const mm = String(q).match(/([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\- ]{2,})/);
      const w = mm ? mm[1].trim() : '';
      if(w) return { html: '<b>🔊 النطق</b><div class="rag-x de-in">' + esc(w) + '</div>', speakWord: w };
      return null;
    }
    if(id === 'summarize_lesson' || id === 'important_points' || id === 'explain_lesson'
       || id === 'explain_rule' || id === 'stuck_student' || id === 'usage_question'
       || id === 'explain_with_examples'){
      const mal = await chargeMalakhiss();
      const un = (mal && mal.malakhiss || []).filter(x => x.unite === n)[0];
      if(un){
        const ex = (un.structures || []).slice(0, 3);
        return { html: '<b>📗 الوحدة ' + n + ' — ' + esc(un.titre_de || '') + '</b>'
          + '<div class="rag-x">' + esc(un.titre_ar || '') + '</div>'
          + '<div class="rg-sec"><b>الملخص</b> ' + esc((un.resume_ar || un.resume || '').slice(0, 400)) + '</div>'
          + (ex.length ? '<div class="rg-sec"><b>أمثلة</b><ul>' + ex.map(e2 => '<li class="de-in">' + esc(e2) + '</li>').join('') + '</ul></div>' : '')
          + '<div class="rag-src">للتفاصيل افتح 📑 الملخصات — الوحدة ' + n + '</div>' };
      }
      return null;
    }
    if(id === 'compare_explain'){
      const pairs = [['sein','haben'],['der','das'],['weil','dass'],['akkusativ','dativ'],
        ['müssen','sollen'],['können','dürfen'],['mussen','sollen'],['konnen','durfen']];
      for(const pr of pairs){
        if(String(q).toLowerCase().indexOf(pr[0]) !== -1 && String(q).toLowerCase().indexOf(pr[1]) !== -1){
          if(pr[0]==='sein'||pr[1]==='haben') return { html: '<b>⚖️ sein مقابل haben</b><ul>'
            + '<li class="de-in">sein = يكون (حالة/هوية) : ich bin, du bist, er ist</li>'
            + '<li class="de-in">haben = يملك : ich habe, du hast, er hat</li>'
            + '<li>Perfekt : أفعال الحركة والحالة مع sein، والبقية مع haben</li></ul>' };
          return { html: '<b>⚖️ ' + esc(pr[0]) + ' مقابل ' + esc(pr[1]) + '</b>'
            + '<div class="rg-sec">افتح 📘 القواعد للمقارنة الكاملة مع الأمثلة.</div>' };
        }
      }
      return null;
    }
    if(id === 'quiz_generate' || id === 'generate_exam' || id === 'adaptive_exercise'){
      return { html: '<b>📝 تدريب</b><div class="rg-sec">افتح ✍️ Banque أو 📝 الفروض — الوحدة ' + (n || '')
        + ' : فرض مولَّد بتصحيح فوري + كل خطأ يعود في 🧠 مسارك.</div>' };
    }
    if(id === 'bac_preparation'){
      const corp = await chargeCorp();
      const suj = (corp && corp.documents || []).filter(x => x.type==='sujet'||x.type==='annale').slice(0,8);
      return { html: '<b>🎓 تحضير الباك</b><ul>' + suj.map(s2 => '<li>' + esc(s2.titre) + '</li>').join('')
        + '</ul><div class="rg-sec">افتح 🎓 البكالوريا للتدريب بتوقيت رسمي 180 د.</div>' };
    }
    if(id === 'search_library' || id === 'find_lesson' || id === 'find_page' || id === 'find_exercise'
       || id === 'find_exam' || id === 'find_document' || id === 'source_lookup'){
      const corp = await chargeCorp();
      const kw2 = tokOnto(normOnto(q)).filter(w => w.length > 2).slice(0, 4);
      const res = (corp && corp.documents || []).filter(x => {
        const hay = normOnto((x.titre||'') + ' ' + (x.extrait||''));
        return kw2.some(w => hay.indexOf(w) !== -1);
      }).slice(0, 8);
      if(res.length) return { html: '<b>🔎 نتائج المكتبة</b><ul>' + res.map(x => '<li>' + esc(x.titre)
        + ' <span class="rag-src">[' + esc(x.type) + ']</span></li>').join('') + '</ul>'
        + '<div class="rag-src">المصادر : official_book → lesson_content → official_exam → pedagogical_document</div>' };
      return null;
    }
    if(id === 'conversation_practice') return null; /* يُترك للمعالج الموجود */
    if(id === 'progress_report') return { html: '<b>📈 مستواك</b><div class="rg-sec">افتح 🧭 مسارك : نقاط القوة/الضعف والبطاقات المستحقة.</div>' };
    if(id === 'parent_report') return { html: '<b>👨👩‍👦 تقرير الولي</b><div class="rg-sec">افتح 👨‍👩‍👦 الأولياء لمتابعة النتائج.</div>' };
    if(id === 'teacher_tools') return { html: '<b>👨🏫 فضاء الأستاذ</b><div class="rg-sec">افتح 🧑‍ لوحة الأستاذ : تمارين، فروض، تصحيح.</div>' };
    return null;
  }catch(e){ return null; }
}

async function reponsePedagogique(q){
    q = darja(q);
    const _bib = await intentBiblio(q);
    if(_bib) return _bib;
    const _kh = intentKharif(q);
    if(_kh) return _kh;
    /* ARTIKEL + PLURAL locaux : questions de base toujours répondues, même sans cloud */
    const _art = intentArtikel(q);
    if(_art) return _art;
    const _plu = intentPlural(q);
    if(_plu) return _plu;
    const _cva = intentConversationAr(q);
    if(_cva) return _cva;
    const _cv = intentConversation(q);
    if(_cv) return _cv;
    const _lec = await intentLecture(q);
    if(_lec) return _lec;
    /* conjugaison prioritaire : « كيف اتصرف sein » / « صرف haben » / « sein » seul */
    const vb = trouveVerbe(q);
    if(vb && (CONJ_INTENT.test(String(q)) || String(q).trim().toLowerCase() === vb)){
      return { html: tableauConj(vb), speakWord: null, conj: vb };
    }
    const t = await matchType(q);
    if(!t) return null;
    const n = numeroUnite(q);
    const mal = await chargeMalakhiss();

    /* ── أنواع لا تحتاج وحدة ── */
    if(t.id === 'bac'){
      const corp = await chargeCorp();
      const suj = (corp && corp.documents || []).filter(d =>
        d.type === 'sujet' || d.type === 'annale').slice(0, 10);
      return { html: '<b>🎓 تحضير البكالوريا</b><br><span class="rag-src">'
        + suj.length + ' مواضيع/سنوات متوفرة في corpus</span><ul>'
        + suj.map(s => '<li>' + esc(s.titre) + '</li>').join('')
        + '</ul><div class="rg-sec">افتح onglet 🎓 البكالوريا للتدريب الكامل بتوقيت رسمي.</div>' };
    }
    if(t.id === 'tawjih'){
      return { html: '<b>🧭 خطة مراجعة فعّالة</b><ul>'
        + '<li>٢ دقيقة تركيز +  دقائق راحة (بومودورو)</li>'
        + '<li>ابدأ بـ 🧠 مراجعة البطاقات المستحقة قبل أي جديد</li>'
        + '<li>بعد كل حصة : ٣ تمارين فورية من ✍️ Banque</li>'
        + '<li>كل خطأ يعود تلقائيًا في 🧭 مسارك (J+1/3/7/21)</li>'
        + '<li>قبل الفرض : ملخص الوحدة + فرض تجريبي من 🔎</li>'
        + '<li>نام مبكرًا : التثبيت يحدث أثناء النوم</li></ul>' };
    }
    if(t.id === 'tashih'){
      return { html: '<b>✍️ لتصحيح جملة</b><br>اكتب جملتك في onglet 🤖 الأستاذ '
        + '(يفهم الجملة ويصحّحها مع القاعدة).<br><span class="rag-src">مثال : '
        + '« Ich habe ein Buch gelesen. » → تصحيح + شرح</span>' };
    }
    if(t.id === 'nataq'){
      const m = String(q).match(/([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\- ]{2,})/);
      const w = m ? m[1].trim() : '';
      if(!w) return null;
      return { html: '<b>🔊 النطق</b><div class="rag-x de-in">' + esc(w) + '</div>'
        + '<span class="rag-src">يُنطق الآن بالألمانية…</span>', speakWord: w };
    }
    if(t.id === 'vocab'){
      const voc = await chargeVoc();
      const mots = (voc && voc.mots) || [];
      const mq = String(q).match(/([A-Za-zÄÖÜäöüß]{3,})|([\u0600-\u06FF]{3,})/);
      const mot = mq ? (mq[1] || mq[2] || '').toLowerCase() : '';
      const f = mots.filter(x => (x.de || '').toLowerCase() === mot
                              || (x.ar || '').indexOf(mq ? (mq[2] || mq[1] || '') : '') !== -1)[0];
      if(f){
        return { html: '<b>🔤 المفردة</b><div class="rag-x de-in">' + esc(f.de) + '</div>'
          + '<div class="rg-sec"><b>بالعربية</b> ' + esc(f.ar) + ' · رقم ' + f.n + '</div>'
          + '<div class="rg-sec"><button type="button" class="voz-speak" data-lang="de-DE">🔊</button> استمع</div>',
          speakWord: f.de };
      }
      return null;   /* → repli RAG */
    }
    if(t.id === 'regle'){
      const label = trouveRegle(q);
      if(label && mal){
        const u = uniteDeRegle(mal, label);
        if(u){
          const g = (u.grammaire || []).filter(x =>
            x.toLowerCase().indexOf(label.toLowerCase()) !== -1);
          return { html: '<b>📘 قاعدة ' + esc(label) + '</b> (الوحدة ' + u.unite + ')<ul>'
            + (g.length ? g : (u.grammaire || []).slice(0, 2))
                .map(x => '<li class="de-in">' + esc(x) + '</li>').join('') + '</ul>'
            + '<div class="rg-sec"><b>🗣️ أمثلة</b><ul>'
            + (u.structures || []).slice(0, 2).map(s => '<li class="de-in">' + esc(s) + '</li>').join('')
            + '</ul></div>'
            + '<div class="rg-sec"><button type="button" class="voz-speak">🔊</button> استمع</div>' };
        }
      }
      return null;   /* → repli RAG */
    }

    /* ── أنواع تحتاج وحدة ── */
    if(!n) return { html: chipsUnites(q) };
    const u = (mal && mal.malakhiss || []).filter(m => m.unite === n)[0];
    if(!u) return null;
    const niv = n <= 6 ? '2AS' : '3AS';

    if(t.id === 'sharh' || t.id === 'murajaa'){
      const enDe = /بالألمانية|بالالمانية|auf deutsch|en allemand/.test(String(q));
      return { html: resumeUnite(u, n, enDe), speak: enDe ? 'de' : null };
    }
    if(t.id === 'tamarin' || t.id === 'fard'){
      const ban = await chargeBanque();
      if(!ban) return null;
      const comps = mapComps(u);
      const exos = (ban.B_exercices || []).filter(x =>
          comps.indexOf(x.comp) !== -1 && x.niveau === niv).slice(0, t.id === 'fard' ? 8 : 6);
      if(!exos.length) return null;
      const fard = t.id === 'fard';
      return { html: '<b>' + (fard ? '📝 فرض تجريبي' : '✍️ تمارين') + ' — الوحدة ' + n
        + ' · ' + esc(u.titre_ar) + '</b><br><span class="rag-src">من البنك الأصلي — تصحيح فوري'
        + (fard ? ' · نتيجة /20 في الأخير' : '') + '</span>'
        + (fard ? '<div class="rq-score" hidden></div>' : '')
        + '<div class="rq-list">' + exos.map((x, i) =>
            '<div class="rq-c" data-i="' + i + '"><b class="rq-q">' + esc(x.q) + '</b>'
          + '<div class="rq-opts">' + x.opts.map((o, k) =>
              '<button type="button" class="rq-o" data-k="' + k + '">' + esc(o) + '</button>').join('')
          + '</div><div class="rq-fb" hidden></div></div>').join('') + '</div>',
        exos: exos, fard: fard };
    }
    return null;
  }

  function formule(r){
    if(!r) return null;
    const extrait = String(r.texte || '').split(/\s+/).slice(0, 70).join(' ');
    return '📚 <b>من قاعدة معرفتك</b> — '
      + '<span class="rag-src">score ' + r.score + ' · chunk ' + (r.doc || '') + '</span>'
      + '<br><span class="rag-x">« ' + esc(extrait) + ' … »</span>'
      + '<br><span class="rag-src">réponse extraite de ta base — jamais inventée.</span>';
  }

  async function render(){
    const box = $('#ragBody'); if(!box) return;
    const man = await chargeManifest();
    const info = man
      ? (man.nb_shards + ' shards · ' + man.total_chunks + ' chunks · chargement progressif')
      : 'index unique (repli)';
    box.innerHTML =
        '<div class="rg-hero"><span class="rg-crest">🔎</span><div>'
      + '<h2>اسأل المنصة (RAG gardé)</h2>'
      + '<p class="rg-sub">la réponse vient TOUJOURS d’un extrait de ton corpus — '
      + 'jamais inventée · ' + info + '</p></div></div>'
      + '<div class="card rg-box">'
      + '<form id="ragForm"><input type="search" id="ragQ" '
      + 'placeholder="مثال : Was ist die Meinungsfreiheit ? · Die Kontrolle · Heimat"></form>'
      + '<div id="ragOut" class="rg-out"></div></div>';
    $('#ragForm').addEventListener('submit', async ev => {
      ev.preventDefault();
      const q = ($('#ragQ').value || '').trim();
      const out = $('#ragOut');
      if(!q){ out.innerHTML = ''; return; }
      out.innerHTML = '<div class="rg-load">⏳ analyse de ta demande…</div>';
      const ped = await reponsePedagogique(q);
      if(ped){
        out.innerHTML = '<div class="rg-ok rg-ped">' + ped.html + '</div>';
        bindExos(out, ped.exos || [], !!ped.fard);
        out.querySelectorAll('.rq-u').forEach(b => b.addEventListener('click', () => {
          const inp = $('#ragQ');
          if(inp){ inp.value = q + ' الوحدة ' + b.dataset.u;
            const f = $('#ragForm');
            if(f){ if(f.requestSubmit) f.requestSubmit();
                   else f.dispatchEvent(new Event('submit', { cancelable: true })); } }
        }));
        if(ped.speakWord) parler(ped.speakWord, 'de-DE');
        if(ped.conj){
          const bs = out.querySelector('.voz-speak');
          if(bs) bs.addEventListener('click', () => parler(parleConj(ped.conj), 'de-DE'));
        }
        out.querySelectorAll('.voz-speak').forEach(b => b.addEventListener('click', () => {
          parler((out.querySelector('.rag-x') || out).textContent, b.dataset.lang || null);
        }));
        if(ped.speak === 'de') parler((out.querySelector('.rag-x') || out).textContent, 'de-DE');
        return;
      }
      out.innerHTML = '<div class="rg-load">⏳ recherche dans les shards…</div>';
      const r = await cherche(q);
      const f = formule(r);
      out.innerHTML = f
        ? '<div class="rg-ok">' + f + '</div>'
        : '<div class="rg-non">🤷 <b>لا أعرف / je ne sais pas.</b><br>'
          + 'Aucun extrait du corpus ne répond avec assez de confiance. '
          + 'Je n’invente jamais.</div>';
    });
  }

  window.reponsePedagogique = reponsePedagogique;
  window.RAG = { cherche: cherche, formule: formule, SEUIL: SEUIL, render: render };
  window.renderRag = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'rag') render(); });
})();
