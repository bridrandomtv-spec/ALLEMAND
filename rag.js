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

  async function reponsePedagogique(q){
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

  window.RAG = { cherche: cherche, formule: formule, SEUIL: SEUIL, render: render };
  window.renderRag = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'rag') render(); });
})();
