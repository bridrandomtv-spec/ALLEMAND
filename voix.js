/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — voix.js  (v3 : voix masculine PRO)
   · 🔊 = lecture SEGMENTÉE : chaque passage arabe lu en ar-DZ, chaque passage
     allemand lu en de-DE → plus de mélange des langues dans une même phrase.
   · Voix MASCULINE choisie automatiquement (listes de voix mâles connues),
     réglable manuellement via le sélecteur 🎛 (mémorisé).
   · pitch 0.85 / rate 0.92 → timbre posé, professionnel.
   · 🎤 /  = dictée (de-DE / ar-DZ) sur 🔎 RAG et 🤖 chat.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $ = (s,c) => (c||document).querySelector(s);

  /* noms de voix FÉMININES à éviter */
  const FEM = /anna|petra|katja|marlene|hedda|yelda|vicki|nina|lena|marie|claire|amelie|zira|hazel|susan|samantha|karen|moira|tessa|fiona|veena|lekha|katya|milena|irina|elena|laura|paulina|monica|carmit|salli|joanna|kendra|kimberly|ivy|emma|amy|laila|leila|hoda|maryam|sara|salma|amira|naira|zeina|rania|fatima|aisha|hala|nour|yasmin|rim/i;
  /* noms de voix MASCULINES préférées */
  const MALE = {
    de: ['markus','stefan','christoph','jörg','jorg','hans','klaus','dieter','thomas','david',
         'felix','jonas','conrad','bernd','google deutsch','microsoft stefan','android de'],
    ar: ['maged','majed','tarik','abdulrahman','hamza','naayf','faisal','saud','hamed','karim',
         'omar','youssef','google بالعربية','microsoft naayf','android ar','algeria','dz']
  };
  let CHOSEN = '';
  try{ CHOSEN = localStorage.getItem('dz_voice') || ''; }catch(e){}

  function toutesVoix(){
    return ('speechSynthesis' in window) ? (window.speechSynthesis.getVoices() || []) : [];
  }
  function voixPour(lang){
    const vs = toutesVoix();
    if(!vs.length) return null;
    const code = String(lang || '').slice(0, 2).toLowerCase();
    const cand = vs.filter(v => (v.lang || '').toLowerCase().indexOf(code) === 0);
    if(CHOSEN){
      const c = cand.find(v => v.name === CHOSEN) || vs.find(v => v.name === CHOSEN);
      if(c) return c;
    }
    const pref = MALE[code] || [];
    for(const p of pref){
      const f = cand.find(v => (v.name || '').toLowerCase().indexOf(p) !== -1);
      if(f) return f;
    }
    const nf = cand.find(v => !FEM.test(v.name || ''));
    if(nf) return nf;
    for(const p of pref){
      const f = vs.find(v => (v.name || '').toLowerCase().indexOf(p) !== -1);
      if(f) return f;
    }
    return cand[0] || vs[0] || null;
  }

  /* découpe le texte en segments arabe / latin */
  function segments(t){
    const out = [];
    let cur = '', type = null;
    const AR = /[\u0600-\u06FF]/, LA = /[A-Za-zÀ-ÿ]/;
    for(const ch of String(t || '')){
      let ty = AR.test(ch) ? 'ar' : (LA.test(ch) ? 'la' : type);
      if(type === null){ type = ty || 'ar'; cur = ch; continue; }
      if(ty === type){ cur += ch; }
      else { if(cur.trim()) out.push({ type: type, txt: cur }); cur = ch; type = ty; }
    }
    if(cur.trim()) out.push({ type: type, txt: cur });
    return out;
  }

  /* lecture segmentée, voix masculine, enchaînée */
  function parler(texte, lang){
    if(!('speechSynthesis' in window)) return false;
    try{
      window.speechSynthesis.cancel();
      const segs = segments(texte);
      let i = 0;
      const next = () => {
        if(i >= segs.length) return;
        const s = segs[i++];
        const u = new SpeechSynthesisUtterance(s.txt);
        u.lang = (lang && segs.length === 1) ? lang : (s.type === 'ar' ? 'ar-DZ' : 'de-DE');
        const v = voixPour(u.lang);
        if(v) u.voice = v;
        u.rate = 0.92; u.pitch = 0.85;
        u.onend = next; u.onerror = next;
        window.speechSynthesis.speak(u);
      };
      next();
      return true;
    }catch(e){ return false; }
  }

  function SR(){ return window.SpeechRecognition || window.webkitSpeechRecognition || null; }
  function ecouter(lang, onTexte, onErr){
    const C = SR();
    if(!C){ if(onErr) onErr('non supporté'); return null; }
    try{
      const r = new C();
      r.lang = lang; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = ev => { const t = ev.results[0][0].transcript; if(onTexte) onTexte(t); };
      r.onerror = ev => { if(onErr) onErr(ev.error); };
      r.start();
      return r;
    }catch(e){ if(onErr) onErr('start'); return null; }
  }

  /* sélecteur de voix 🎛 (mâles en premier) */
  function greffeChoix(form){
    if(!form || form.dataset.vozc === '1') return;
    form.dataset.vozc = '1';
    const sel = document.createElement('select');
    sel.className = 'voz-choix'; sel.title = 'choix de la voix';
    const maj = () => {
      const vs = toutesVoix();
      const tri = vs.slice().sort((a, b) => {
        const am = !FEM.test(a.name || '') ? 0 : 1, bm = !FEM.test(b.name || '') ? 0 : 1;
        return am - bm || (a.lang || '').localeCompare(b.lang || '');
      });
      sel.innerHTML = '<option value="">🎛 voix auto (masculine)</option>' +
        tri.map(v => '<option value="' + v.name + '"' + (v.name === CHOSEN ? ' selected' : '') + '>'
          + (!FEM.test(v.name || '') ? '👨 ' : '👩 ') + v.name + ' (' + v.lang + ')</option>').join('');
    };
    maj();
    if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = maj;
    sel.addEventListener('change', () => {
      CHOSEN = sel.value;
      try{ localStorage.setItem('dz_voice', CHOSEN); }catch(e){}
    });
    form.insertBefore(sel, form.firstChild);
  }

  function greffeMicros(form, inputSel){
    if(!form || form.dataset.voz === '1') return;
    form.dataset.voz = '1';
    const wrap = document.createElement('span');
    wrap.className = 'voz-mics';
    wrap.innerHTML =
        '<button type="button" class="voz-btn" data-l="de-DE" title="أمْلِ بالألمانية">🎤</button>'
      + '<button type="button" class="voz-btn" data-l="ar-DZ" title="أمْلِ بالعربية">🗣</button>';
    form.insertBefore(wrap, form.firstChild);
    wrap.querySelectorAll('.voz-btn').forEach(b => {
      b.addEventListener('click', () => {
        const inp = $(inputSel, form) || $(inputSel);
        if(!inp) return;
        b.classList.add('on');
        ecouter(b.dataset.l,
          t => { b.classList.remove('on'); inp.value = t;
                 if(form.requestSubmit) form.requestSubmit();
                 else form.dispatchEvent(new Event('submit', { cancelable: true })); },
          () => b.classList.remove('on'));
      });
    });
  }

  function greffeHautParleur(host){
    if(!host || host.dataset.vozs === '1') return;
    host.dataset.vozs = '1';
    host.addEventListener('click', ev => {
      const btn = ev.target.closest('.voz-speak');
      if(!btn) return;
      const zone = btn.closest('.rg-ok, .msg.bot') || host;
      const src = zone.querySelector('.rag-x') || zone;
      parler(src.textContent, btn.dataset.lang || null);
    });
  }

  function observeReponses(conteneur, selecteurReponse){
    if(!conteneur || conteneur.dataset.vozo === '1') return;
    conteneur.dataset.vozo = '1';
    const mo = new MutationObserver(() => {
      conteneur.querySelectorAll(selecteurReponse).forEach(r => {
        if(r.querySelector('.voz-speak')) return;
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'voz-speak'; b.textContent = '🔊';
        b.title = 'انطق الجواب بصوت رجل';
        r.appendChild(b);
      });
    });
    mo.observe(conteneur, { childList: true, subtree: true });
  }

  function branche(){
    const rf = $('#ragForm');
    if(rf){
      greffeMicros(rf, '#ragQ'); greffeChoix(rf);
      const out = $('#ragOut');
      if(out){ observeReponses(out, '.rg-ok'); greffeHautParleur(out); }
    }
    const cf = $('#chatForm');
    if(cf){
      greffeMicros(cf, '#chatInput'); greffeChoix(cf);
      const log = $('#chatLog');
      if(log){ observeReponses(log, '.msg.bot'); greffeHautParleur(log); }
    }
  }

  window.VOIX = { parler: parler, ecouter: ecouter, voixPour: voixPour,
                  dispo: () => !!SR(), tts: () => ('speechSynthesis' in window) };
  document.addEventListener('dz:view', () => setTimeout(branche, 120));
  document.addEventListener('DOMContentLoaded', () => setTimeout(branche, 300));
})();
