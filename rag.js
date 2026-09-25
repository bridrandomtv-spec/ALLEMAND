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
      const r = await fetch('assets/bdd/corpus_index.json', { cache:'force-cache' });
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
          const r = await fetch('assets/bdd/shards/' + sh.file, { cache:'force-cache' });
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
  async function cj(url){ try{ const r = await fetch(url, { cache:'force-cache' });
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
  async function intentLecture(q){
    const pg = q.match(/(?:seite|page|صفحة|ص)\s*(\d{1,3})/i);
    if(pg){
      const P = await loadPages();
      const e = P[pg[1]];
      if(e && (e.lignes || e.texte)){
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
      return 'Je n’ai pas encore la page ' + pg[1] + ' du manuel en mémoire indexée. '
        + 'Essaie : « lis le texte de la Lektion 1 », « lies den Dialog Lektion 2 », '
        + '« vocabulaire Lektion 3 » — ou demande au professeur d’indexer cette page.';
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

  async function reponsePedagogique(q){
    q = darja(q);
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
