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
     Routeur pédagogique v2 :
     · « لم أفهم / اشرح / لخص + N »        → شرح الوحدة من الملخصات
     · « تمارين / أعطني تمارين + N »       → تمارين MCQ من البنك، تصحيح فوري
     · « … بالألمانية / auf Deutsch »      → شرح بالألمانية + نطق de-DE تلقائي
     · sinon                               → retrieval RAG shardé
     ══════════════════════════════════════════════════════════════════════ */
  let MAL = null, BAN = null;
  async function chargeMalakhiss(){
    if(MAL !== null) return MAL;
    try{ const r = await fetch('assets/bdd/malakhiss.json', { cache:'force-cache' });
         MAL = r.ok ? await r.json() : null; }catch(e){ MAL = null; }
    return MAL;
  }
  async function chargeBanque(){
    if(BAN !== null) return BAN;
    try{ const r = await fetch('assets/bdd/contenu_original.json', { cache:'force-cache' });
         BAN = r.ok ? await r.json() : null; }catch(e){ BAN = null; }
    return BAN;
  }
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
  const INTENT = /(لم افهم|لم أفهم|ما فهمت|ما فهمتش|اشرح|شرح|لخص|لخّص|وضح|وضّح|ما هو|ماهي|ما هي|ماذا يعني|مش فاهم|مش فاهمة|je ne comprends|explique|تمارين|تمرين|اعطني|أعطني|exercice|übung|أعد|اعد)/;
  const INTENT_EXO = /(تمارين|تمرين|اعطني|أعطني|exercice|übung|train)/;
  const INTENT_DE = /(بالألمانية|بالالمانية|auf deutsch|en allemand)/;

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

  /* correction immédiate des MCQ injectés */
  function bindExos(out, exos){
    out.querySelectorAll('.rq-c').forEach(card => {
      const x = exos[+card.dataset.i]; if(!x) return;
      card.querySelectorAll('.rq-o').forEach(b => b.addEventListener('click', () => {
        const k = +b.dataset.k;
        card.querySelectorAll('.rq-o').forEach((bb, kk) => {
          bb.disabled = true; bb.classList.remove('ok', 'ko');
          if(kk === x.a) bb.classList.add('ok');
          else if(kk === k) bb.classList.add('ko');
        });
        const fb = card.querySelector('.rq-fb');
        if(fb){ fb.hidden = false;
          fb.className = 'rq-fb ' + (k === x.a ? 'ok' : 'ko');
          fb.innerHTML = (k === x.a ? '✅ صحيح! ' : '❌ خطأ. ') + '💡 ' + esc(x.why); }
        if(window.MEMOIRE && k !== x.a){
          try{ window.MEMOIRE.record({ q: x.q, bad: x.opts[k], good: x.opts[x.a],
                                       comp: x.comp, unite: null, src: 'rag-exo' }); }catch(e){}
        }
      }));
    });
  }

  async function reponsePedagogique(q){
    if(!INTENT.test(String(q || ''))) return null;
    const n = numeroUnite(q);
    if(!n) return null;
    const mal = await chargeMalakhiss();
    if(!mal) return null;
    const u = (mal.malakhiss || []).filter(m => m.unite === n)[0];
    if(!u) return null;
    const niv = n <= 6 ? '2AS' : '3AS';

    /* ── branche TAMARIN : MCQ du banque ── */
    if(INTENT_EXO.test(String(q))){
      const ban = await chargeBanque();
      if(ban){
        const comps = mapComps(u);
        const exos = (ban.B_exercices || []).filter(x =>
            comps.indexOf(x.comp) !== -1 && x.niveau === niv).slice(0, 6);
        if(exos.length){
          const h = '<b>✍️ تمارين على الوحدة ' + n + ' — ' + esc(u.titre_ar) + '</b>'
            + '<br><span class="rag-src">من بنك المحتوى الأصلي — تصحيح فوري · '
            + exos.length + ' تمارين</span>'
            + '<div class="rq-list">' + exos.map((x, i) =>
                '<div class="rq-c" data-i="' + i + '"><b class="rq-q">' + esc(x.q) + '</b>'
              + '<div class="rq-opts">' + x.opts.map((o, k) =>
                  '<button type="button" class="rq-o" data-k="' + k + '">' + esc(o)
                + '</button>').join('') + '</div>'
              + '<div class="rq-fb" hidden></div></div>').join('') + '</div>';
          return { html: h, exos: exos };
        }
      }
    }

    /* ── branche SHARH (allemand si demandé) ── */
    const lecons = (mal.dourous || []).filter(d => d.unite === n);
    const enDe = INTENT_DE.test(String(q));
    let h = '<b>📘 الوحدة ' + n + ' — ' + esc(enDe ? u.titre_de : u.titre_ar)
      + (enDe ? '' : ' · ' + esc(u.titre_de)) + '</b>'
      + '<br><span class="rag-src">' + (enDe ? 'Erklärung auf Deutsch — aus deinen Zusammenfassungen'
                                             : 'شرح مبسّط من ملخصاتك — لا اختلاق') + '</span>'
      + '<div class="rag-x">' + (enDe ? '📘 ' : '💡 ') + esc(enDe ? u.titre_de : u.idee) + '</div>'
      + '<div class="rg-sec"><b>🔑 ' + (enDe ? 'Wortschatz' : 'مفردات مفتاحية') + '</b><div class="mk-chips">'
      + (u.vocabulaire || []).slice(0, 6).map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('')
      + '</div></div>'
      + '<div class="rg-sec"><b>📘 ' + (enDe ? 'Grammatik' : 'القاعدة') + '</b><ul>'
      + (u.grammaire || []).slice(0, 3).map(g => '<li class="de-in">' + esc(g) + '</li>').join('')
      + '</ul></div>'
      + '<div class="rg-sec"><b>🗣️ ' + (enDe ? 'Beispiele' : 'مثال') + '</b><ul>'
      + (u.structures || []).slice(0, (enDe ? 3 : 2)).map(s => '<li class="de-in">' + esc(s) + '</li>').join('')
      + '</ul></div>';
    if(!enDe){
      h += '<div class="rg-sec mk-tip"><b>⚠️ انتبه</b><ul>'
        + (u.conseils || []).slice(0, 2).map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>';
    }
    if(lecons.length && !enDe){
      h += '<div class="rg-sec"><b>📖 دروس الوحدة (' + lecons.length + ')</b><ul>'
        + lecons.slice(0, 8).map(l => '<li>د' + l.n + ' · ' + esc(l.titre_ar) + '</li>').join('')
        + '</ul></div>';
    }
    h += '<div class="rg-sec"><button type="button" class="voz-speak"'
      + (enDe ? ' data-lang="de-DE"' : '') + '>🔊</button> '
      + (enDe ? 'Jetzt anhören' : 'اضغط للاستماع إلى الشرح') + '</div>';
    return { html: h, speak: enDe ? 'de' : null };
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
        bindExos(out, ped.exos || []);
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
