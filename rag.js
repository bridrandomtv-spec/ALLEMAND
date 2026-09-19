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
  function parler(t){ try{ if('speechSynthesis' in window){
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t);
    u.lang = /[\u0600-\u06FF]/.test(t) ? 'ar-DZ' : 'de-DE'; speechSynthesis.speak(u); } }catch(e){} }
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
     Routeur pédagogique : « لم أفهم الدرس/الوحدة N » n'est PAS une question
     de retrieval → on explique le cours depuis les ملخصات, pas « je ne sais pas ».
     ══════════════════════════════════════════════════════════════════════ */
  let MAL = null;
  async function chargeMalakhiss(){
    if(MAL !== null) return MAL;
    try{
      const r = await fetch('assets/bdd/malakhiss.json', { cache:'force-cache' });
      MAL = r.ok ? await r.json() : null;
    }catch(e){ MAL = null; }
    return MAL;
  }
  const ORD = { 'الاول':1,'الأول':1,'الثاني':2,'الثالث':3,'الرابع':4,'الخامس':5,'السادس':6,
                'السابع':7,'الثامن':8,'التاسع':9,'العاشر':10,'الحادي':11,'الثاني عشر':12,
                'عشر':10,'واحد':1,'اثنان':2,'ثلاثة':3,'اربعة':4,'خمسة':5,'ستة':6 };
  function numeroUnite(q){
    const s = String(q || '');
    let m = s.match(/(?:الوحدة|وحدة|u)\s*[:\-]?\s*(\d{1,2})/i);
    if(m) return +m[1];
    m = s.match(/(\d{1,2})\s*(?:ة|ـ)?\s*(?:وحدة)/);
    if(m) return +m[1];
    for(const k in ORD){
      if(s.indexOf(k) !== -1) return ORD[k];
    }
    m = s.match(/(?:الدرس|درس)\s*[:\-]?\s*(\d{1,2})/);
    if(m) return +m[1];
    return null;
  }
  const INTENT = /(لم افهم|لم أفهم|ما فهمت|ما فهمتش|لم افهمها|اشرح|شرح|لخص|لخّص|وضح|وضّح|ما هو|ماهي|ما هي|ماذا يعني|يعني ايه|مش فاهم|مش فاهمة|je ne comprends|explique)/;

  async function reponsePedagogique(q){
    if(!INTENT.test(String(q || ''))) return null;
    const n = numeroUnite(q);
    if(!n) return null;
    const mal = await chargeMalakhiss();
    if(!mal) return null;
    const u = (mal.malakhiss || []).filter(m => m.unite === n)[0];
    if(!u) return null;
    const lecons = (mal.dourous || []).filter(d => d.unite === n);
    let h = '<b>📘 الوحدة ' + n + ' — ' + esc(u.titre_ar) + ' · ' + esc(u.titre_de) + '</b>'
      + '<br><span class="rag-src">شرح مبسّط من ملخصاتك — لا اختلاق</span>'
      + '<div class="rag-x">💡 ' + esc(u.idee) + '</div>'
      + '<div class="rg-sec"><b>🔑 مفردات مفتاحية</b><div class="mk-chips">'
      + (u.vocabulaire || []).slice(0, 6).map(v => '<span class="mk-ch de-in">' + esc(v) + '</span>').join('')
      + '</div></div>'
      + '<div class="rg-sec"><b>📘 القاعدة</b><ul>'
      + (u.grammaire || []).slice(0, 3).map(g => '<li class="de-in">' + esc(g) + '</li>').join('')
      + '</ul></div>'
      + '<div class="rg-sec"><b>🗣️ مثال</b><ul>'
      + (u.structures || []).slice(0, 2).map(s => '<li class="de-in">' + esc(s) + '</li>').join('')
      + '</ul></div>'
      + '<div class="rg-sec mk-tip"><b>⚠️ انتبه</b><ul>'
      + (u.conseils || []).slice(0, 2).map(c => '<li>' + esc(c) + '</li>').join('')
      + '</ul></div>';
    if(lecons.length){
      h += '<div class="rg-sec"><b>📖 دروس الوحدة (' + lecons.length + ')</b><ul>'
        + lecons.slice(0, 8).map(l => '<li>د' + l.n + ' · ' + esc(l.titre_ar) + '</li>').join('')
        + '</ul></div>';
    }
    h += '<div class="rg-sec"><button type="button" class="voz-speak" data-ped="1">🔊</button> '
      + 'اضغط للاستماع إلى الشرح</div>';
    return h;
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
        out.innerHTML = '<div class="rg-ok rg-ped">' + ped + '</div>';
        const b = out.querySelector('.voz-speak');
        if(b) b.addEventListener('click', () => {
          parler((out.querySelector('.rag-x') || out).textContent);
        });
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
