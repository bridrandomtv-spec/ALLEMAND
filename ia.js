/* ia.js — couche « cerveau » : réponse locale d'abord (hors-ligne), puis LLM grounded
   (Workers AI gratuit) si la réponse locale est faible. Quota client : 40 appels/jour. */
'use strict';
(function(){
  /* ── fetch avec TIMEOUT (AbortController) : le worker LLM peut mettre 30 s
     au démarrage à froid — sans timeout l'utilisateur reste bloqué sur ⏳
     et croit que la plateforme « ne comprend pas ». ── */
  function fetchTimeout(url, opts, ms){
    if(typeof AbortController === 'function'){
      const ctrl = new AbortController();
      const o = Object.assign({}, opts, { signal: ctrl.signal });
      const t = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, ms || 18000);
      return fetch(url, o).finally(function(){ clearTimeout(t); });
    }
    return fetch(url, opts);
  }
  /* statut visible pendant la réflexion (barre 🗣️ + console) */
  function statutIA(txt){
    try{
      window.__IA_STATUT = txt;
      const el = document.getElementById('parleSt');
      if(el && txt) el.textContent = txt;
    }catch(e){}
  }
  const DARJA_AR = /(?:واش|علاش|كيفاش|راني|راك|راكي|بزاف|ما\s*فهمتش|مفهمتش|وش|علاه|نحب|حاب|حابة|تاع|درك|كاين|ماكانش|صح)/i;
  const DARJA_LATIN = /(?:^|[^A-Za-z0-9])(?:wach|wesh|3lach|kifach|kifech|rani|rak|raki|bezaf|mafhamtch|ma\s*fhemtch|nheb|hab|habi|ta3|dorka|kayn|makanch|saha)(?=$|[^A-Za-z0-9])/i;
  /* Mémoire de dialogue éphémère : jamais écrite dans localStorage.
     Elle est isolée par la clé de session AUTH.user et effacée au changement de compte. */
  let DIALOGUE = [], DIALOGUE_OWNER = null;
  function dialogueOwner(){
    try{
      const s = window.AUTH && typeof window.AUTH.session === 'function' ? window.AUTH.session() : null;
      return s && s.user ? String(s.user) : '';
    }catch(e){ return ''; }
  }
  function prepareDialogue(){
    const owner = dialogueOwner();
    if(owner !== DIALOGUE_OWNER){ DIALOGUE = []; DIALOGUE_OWNER = owner; }
    return owner;
  }
  function rememberTurn(owner, question, answer){
    if(!owner || !question || !answer) return;
    /* Une réponse asynchrone arrivée après logout/changement de compte
       ne doit jamais ressusciter l'historique de l'ancienne session. */
    if(owner !== dialogueOwner()){
      DIALOGUE = [];
      DIALOGUE_OWNER = dialogueOwner() || null;
      return;
    }
    if(owner !== DIALOGUE_OWNER){ DIALOGUE = []; DIALOGUE_OWNER = owner; }
    DIALOGUE.push({ role:'user', content:String(question).slice(0, 600) });
    DIALOGUE.push({ role:'assistant', content:String(answer).slice(0, 1000) });
    if(DIALOGUE.length > 8) DIALOGUE = DIALOGUE.slice(-8);
  }
  /* Effacement immédiat au logout et à chaque changement réel de compte.
     Un simple rafraîchissement de profil du même utilisateur ne vide pas le fil. */
  try{
    document.addEventListener('dz:auth', function(ev){
      const next = ev && ev.detail && ev.detail.user ? String(ev.detail.user) : '';
      if(!next || next !== DIALOGUE_OWNER){
        DIALOGUE = [];
        DIALOGUE_OWNER = next || null;
      }
    });
  }catch(e){}
  window.reponseIA = async function(input){
    const req = input && typeof input === 'object' && !Array.isArray(input)
      ? input : { raw_text: input };
    const q = String(req.raw_text == null ? (req.q || '') : req.raw_text).trim();
    const normalized = String(req.normalized_text || q).trim();
    const inputMode = req.input_mode === 'voice' ? 'voice' : 'text';
    const selectedLanguage = String(req.selected_language || 'auto').slice(0, 20);
    const detectedLanguage = String(req.detected_language || '').slice(0, 20);
    const dialect = String(req.dialect || (DARJA_AR.test(q) || DARJA_LATIN.test(q) ? 'darija' : 'unknown')).slice(0, 30);
    let schoolContext = { subject: 'allemand', level: 'tous', track: '' };
    try{
      if(window.CONTEXT && typeof window.CONTEXT.ctx === 'function'){
        const c = window.CONTEXT.ctx();
        if(c && typeof c === 'object') schoolContext = {
          subject: String(c.subject || 'allemand').slice(0, 60),
          level: String(c.level || 'tous').slice(0, 30),
          track: String(c.track || '').slice(0, 60)
        };
      }
    }catch(e){}
    if(!q) return '';
    const dialogueUser = prepareDialogue();
    const fn = window.reponsePedagogique;
    /* ── HTML → texte parlable ─────────────────────────────────────────
       rag.js retourne { html: '<b>📘 قاعدة …</b><ul><li>…' } (10 chemins).
       L'ancien code ne lisait que .texte / .reponse → clés INEXISTANTES
       → local = '' → TOUT le savoir local était jeté → « لم أفهم تمامًا ».
       On lit donc .html en priorité, puis on le convertit en texte propre. */
    function html2txt(h){
      return String(h == null ? '' : h)
        .replace(/<\s*br\s*\/?\s*>/gi, '\n')
        .replace(/<\s*\/(?:p|div|ul|ol|h[1-6]|tr)\s*>/gi, '\n')
        .replace(/<\s*\/(?:td|th)\s*>/gi, ' | ')
        .replace(/<\s*(?:td|th)[^>]*>/gi, '')
        .replace(/<\s*li[^>]*>/gi, ' • ')
        .replace(/<\s*button[^>]*>[\s\S]*?<\s*\/button\s*>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .replace(/•/g, '،')
        .trim();
    }
    let localObj = null, local = '', speakWord = '', reponseCourteValide = false;
    if(typeof fn === 'function'){ try{ localObj = await fn(q); }catch(e){} }
    if(localObj && typeof localObj === 'object'){
      local     = html2txt(localObj.html || localObj.texte || localObj.reponse || '');
      speakWord = String(localObj.speakWord || '');
      /* intents à réponse intentionnellement courte : conjugaison (tableau),
         mot à prononcer (🔊/🔤). Elles sont VALABLES quelle que soit leur longueur. */
      reponseCourteValide = Boolean(localObj.conj) || Boolean(speakWord);
      if((!local || local.length < 25) && speakWord) local = speakWord;
      if(localObj.conj && local.length < 25) local = 'تصريف ' + localObj.conj + '. ' + local;
    }else{
      local = String(localObj || '');
    }
    /* ── langue de la question : une question allemande/fr/es/it ne doit JAMAIS
       recevoir une réponse arabe du moteur local ── */
    const QL = (function(s){
      const declared = String(detectedLanguage || '').toLowerCase();
      if(declared.indexOf('ar') === 0) return 'ar';
      if(declared.indexOf('de') === 0) return 'de';
      if(declared.indexOf('fr') === 0) return 'fr';
      if(declared.indexOf('es') === 0) return 'es';
      if(declared.indexOf('it') === 0) return 'it';
      if(dialect === 'darija') return 'ar';
      s = String(s || '');
      if(/[\u0600-\u06FF]/.test(s)) return 'ar';
      if(/[\u00e4\u00f6\u00fc\u00df]/i.test(s) || /\b(der|die|das|und|nicht|ich|du|ist|ein|eine|wo|wie|was|wer|bist|geht|hallo)\b/i.test(s)) return 'de';
      if(/\b(le|la|les|je|tu|il|elle|est|suis|pourquoi|bonjour|merci)\b/i.test(s)) return 'fr';
      if(/\b(el|los|las|yo|usted|gracias|hola|buenos)\b/i.test(s)) return 'es';
      if(/\b(gli|che|di|sono|grazie|ciao)\b/i.test(s)) return 'it';
      return '';
    })(q);
    /* Langue attendue en sortie : une consigne explicite prime sur la langue
       de la question. Sert au TTS et est transmise au Worker. */
    const explicitOutputLanguage = (function(s){
      if(/(?:بالدارجة|بالدزيرية|بالجزائرية|en darija|darija|derdja)/i.test(s)) return 'ar';
      if(/(?:en français|en francais|بالفرنسية)/i.test(s)) return 'fr';
      if(/(?:auf deutsch|en allemand|بالألمانية)/i.test(s)) return 'de';
      if(/(?:en español|en espagnol|بالإسبانية)/i.test(s)) return 'es';
      if(/(?:in italiano|en italien|بالإيطالية)/i.test(s)) return 'it';
      if(/(?:بالعربية|بالفصحى|en arabe)/i.test(s)) return 'ar';
      return '';
    })(q);
    const selectedPrefix = selectedLanguage.toLowerCase().slice(0, 2);
    const answerLanguage = explicitOutputLanguage ||
      (['ar','de','fr','es','it'].includes(QL) ? QL :
       (['ar','de','fr','es','it'].includes(selectedPrefix) ? selectedPrefix : 'de'));
    window.__IA_LAST_LANGUAGE = answerLanguage;
    const FB = {
      ar: 'لم أفهم سؤالك تمامًا. أعد صياغته أو حدّد ما تريد شرحه.',
      de: 'Ich habe das nicht verstanden. Frag mich nach Konjugation, Artikel, Plural, Zahlen oder Bedeutung — oder sag « Seite 11 », ich lese sie dir vor.',
      fr: 'Je n\u2019ai pas compris. Demande-moi une conjugaison, un article, un pluriel, un nombre ou un sens — ou dis « page 11 ».',
      es: 'No lo he entendido. Pregúntame por conjugación, artículo, plural, número o significado — o di « página 11 ».',
      it: 'Non ho capito. Chiedimi coniugazione, articolo, plurale, numero o significato — o di « pagina 11 ».'
    };
    /* ratio de caractères arabes : une réponse n'est « dans la mauvaise langue »
       que si elle est MAJORITAIREMENT arabe — quelques mots arabes (noms propres,
       citations du manuel) ne doivent plus faire jeter une bonne réponse */
    const arR = s => { const c = String(s || '').replace(/\s/g, ''); if(!c.length) return 0;
      return ((c.match(/[\u0600-\u06FF]/g) || []).length) / c.length; };
    const fixLang = s => (answerLanguage !== 'ar' && arR(s) > 0.5) ? (FB[answerLanguage] || s) : s;
    /* Quand le local est faible ET que le cloud échoue, on ne rend plus un
       « لا أعرف » muet : la cause exacte est nommée dans la langue de sortie
       demandée, avec le geste qui débloque (bouton 🧠). */
    function sortieFaible(local, cause){
      const loc = String(local || '');
      const utile = (loc && loc.indexOf('لا أعرف') === -1 && loc.length > 3 &&
        !(explicitOutputLanguage && explicitOutputLanguage !== QL)) ? loc : '';
      const c = String(cause || '?');
      let msg;
      if(answerLanguage === 'de') msg = '🤔 Ich habe die Frage nicht ganz verstanden. Grund: ' + c + '. Tipp: Konjugation, Artikel, Plural, Zahl, Bedeutung oder « Seite 11 ». Der 🧠-Knopf unten rechts testet das Cloud-Gehirn.';
      else if(answerLanguage === 'fr') msg = '🤔 Je n’ai pas pleinement compris la question. Cause : ' + c + '. Essaie : conjugaison, article, pluriel, nombre, sens d’un mot, ou « page 11 ». Le bouton 🧠 en bas à droite teste le cerveau cloud.';
      else if(answerLanguage === 'es') msg = '🤔 No entendí del todo la pregunta. Causa: ' + c + '. Prueba: conjugación, artículo, plural, número, significado o « página 11 ». El botón 🧠 prueba el cerebro cloud.';
      else if(answerLanguage === 'it') msg = '🤔 Non ho capito bene la domanda. Causa: ' + c + '. Prova: coniugazione, articolo, plurale, numero, significato o « pagina 11 ». Il pulsante 🧠 testa il cervello cloud.';
      else msg = '🤔 لم أفهم سؤالك تمامًا. السبب : ' + c + '. جرّب : تصريف فعل، أداة، جمع، رقم، معنى كلمة، أو « الصفحة 11 ». الزر 🧠 أسفل اليمين يفحص الدماغ السحابي.';
      return utile ? msg + '\n\n📌 ' + utile : msg;
    }
    /* Une réponse locale est valable dès qu'elle dépasse 25 caractères UTILES,
       ou qu'elle porte un mot à prononcer. On ne la jette plus systématiquement. */
    const weak = !local || local.indexOf('لا أعرف') !== -1 ||
      (local.length < 25 && !reponseCourteValide) ||
      (answerLanguage !== 'ar' && arR(local) > 0.5 && !reponseCourteValide) ||
      (explicitOutputLanguage && explicitOutputLanguage !== QL && !reponseCourteValide);
    if(!weak){
      window.__IA_WORD = speakWord;
      const finalLocal = fixLang(local);
      rememberTurn(dialogueUser, q, finalLocal);
      return finalLocal;
    }
    try{
      const k = 'dz_ia_' + new Date().toDateString();
      const n = +(localStorage.getItem(k) || 0);
      if(n >= 150){ try{ console.warn('🧠 quota journalier atteint (150)'); }catch(_){} window.__IA_WORD = speakWord; return sortieFaible(local, 'quota-journalier-150'); }
      localStorage.setItem(k, String(n + 1));
    }catch(e){}
    let proxy = '';
    try{
      const r = await fetchTimeout('assets/bdd/config.json', { cache:'no-store' }, 8000);
      if(r.ok){ const c = await r.json(); proxy = String(c.ia_proxy || '').replace(/\/+$/, ''); }
    }catch(e){}
    window.__IA_PROXY = proxy;
    if(!proxy) return sortieFaible(local, 'proxy-absent (config.json)');
    try{
      let ctx = 'CONTEXTE SCOLAIRE : matière=' + schoolContext.subject
        + ' ; niveau=' + schoolContext.level + ' ; filière=' + (schoolContext.track || 'non précisée') + '.\n';
      try{
        if(window.BIBLIO && BIBLIO.context){
          const bc = await BIBLIO.context(q, 1800);
          if(bc) ctx += 'BIBLIOTHÈQUE (extraits documentaires) :\n' + bc + '\n\n';
        }
      }catch(e){}
      /* Le RAG allemand enrichit le prompt ; il ne remplace pas l'explication du professeur. */
      if(schoolContext.subject === 'allemand' && window.RAG && typeof window.RAG.cherche === 'function'){
        try{
          const hit = await window.RAG.cherche(q);
          if(hit && hit.texte) ctx += 'EXTRAIT RAG — document ' + String(hit.doc || 'non identifié')
            + ' ; score ' + String(hit.score || '') + ' :\n' + String(hit.texte).slice(0, 900) + '\n\n';
        }catch(e){}
      }
      if(local && local.indexOf('لا أعرف') === -1) ctx += 'RÉPONSE LOCALE :\n' + local.slice(0, 700);
      ctx = ctx.slice(0, 3000);
      statutIA('🧠 réflexion… (cerveau cloud)');
      const r = await fetchTimeout(proxy + '/ask', { method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          q: q, text: q, raw_text: q, normalized_text: normalized,
          input_mode: inputMode, selected_language: selectedLanguage,
          detected_language: QL || detectedLanguage || 'unknown',
          output_language: answerLanguage, dialect: dialect,
          subject: schoolContext.subject, level: schoolContext.level,
          track: schoolContext.track, ctx: ctx,
          history: DIALOGUE.slice(-8)
        }) }, 25000);
      if(!r.ok){
        let e = {};
        try{ e = await r.json(); }catch(_){}
        try{ console.warn('🧠 ia-ask HTTP ' + r.status + ' : ' + (e.err || '?')); }catch(_){}
        if(r.status === 400 || r.status === 415){
          const r2 = await fetchTimeout(proxy + '/ask', { method:'POST',
            headers:{ 'Content-Type':'text/plain' }, body: q }, 15000);
          if(r2.ok){
            const j2 = await r2.json();
            if(j2 && j2.ok && j2.rep && j2.rep.length > 10){
              if(['ar','de','fr','es','it'].includes(String(j2.answer_language || '')))
                window.__IA_LAST_LANGUAGE = j2.answer_language;
              rememberTurn(dialogueUser, q, j2.rep);
              return j2.rep;
            }
          }
        }
        return sortieFaible(local, 'http-' + r.status);
      }
      const j = await r.json();
      if(j && ['ar','de','fr','es','it'].includes(String(j.answer_language || '')))
        window.__IA_LAST_LANGUAGE = j.answer_language;
      if(!j.ok){ window.__IA_ERR = j.err || 'http';
        try{ console.warn('🧠 ia-ask :', j.err); }catch(_){}
        window.__IA_WORD = speakWord; return sortieFaible(local, j.err || 'ko'); }
      window.__IA_ERR = ''; statutIA('');
      if(j.rep && j.rep.length > 10){
        /* garde inverse : question arabe → jamais de réponse sans caractères arabes */
        if(answerLanguage === 'ar' && !/[\u0600-\u06FF]/.test(j.rep)){
          const loc = String(local || '');
          return (loc && loc.indexOf('لا أعرف') === -1) ? loc :
            (window.__IA_ERR ? '🧠 تعذّر الوصول إلى الدماغ السحابي (' + String(window.__IA_ERR).slice(0,30) + ') — ' : '') + 'لم أفهم تمامًا. اسألني عن تصريف فعل، أداة، جمع، رقم أو معنى كلمة — أو قل « الصفحة 11 » لأقرأها لك.';
        }
        rememberTurn(dialogueUser, q, j.rep);
        return j.rep;
      }
    }catch(e){
        window.__IA_ERR = (e && e.name === 'AbortError') ? 'timeout-25s' : String((e && e.message) || e);
        try{ console.warn('🧠 ia-ask réseau :', window.__IA_ERR); }catch(_){}
      }
      statutIA('');
      return sortieFaible(local, window.__IA_ERR || 'reseau');
  };

  /* ── Phase diagnostic : bouton 🧠 = test du cerveau cloud, visible par tous ── */
  function panneauTest(lignes){
    try{
      let p = document.getElementById('iaTestPan');
      if(!p){
        p = document.createElement('div'); p.id = 'iaTestPan';
        p.style.cssText = 'position:fixed;bottom:70px;right:14px;z-index:9998;max-width:340px;'
          + 'background:#0b241a;color:#cfe3d8;border:1px solid rgba(232,182,76,.5);border-radius:12px;'
          + 'padding:12px;font:12px/1.6 monospace;white-space:pre-wrap;direction:ltr;text-align:left;'
          + 'box-shadow:0 10px 30px rgba(0,0,0,.5)';
        document.body.appendChild(p);
      }
      p.textContent = lignes.join('\n');
      p.onclick = function(){ p.style.display = 'none'; };
    }catch(e){}
  }
  window.testCerveau = async function(){
    const out = [];
    const proxy = String(window.__IA_PROXY || '').replace(/\/+$/, '');
    out.push('proxy : ' + (proxy || '(pas encore chargé — pose d’abord une question)'));
    if(!proxy){ panneauTest(out); return out.join('\n'); }
    try{
      const h = await fetchTimeout(proxy + '/health', {}, 12000);
      const hb = await h.text();
      out.push('/health : HTTP ' + h.status + ' · ' + hb.slice(0, 90));
      if(h.status === 404) out.push('=> worker ANCIEN : dans Cloudflare → ia-ask → Edit code → colle worker/ia-ask.js du dépôt → Save and Deploy');
      else { try{ const j = JSON.parse(hb); if(j.ai === false) out.push('=> liaison AI absente : ia-ask → Settings → Bindings → Workers AI → nom AI'); }catch(e){} }
    }catch(e){ out.push('/health : ERREUR ' + ((e && e.name === 'AbortError') ? 'timeout-12s' : ((e && e.message) || e))); }
    try{
      const a = await fetchTimeout(proxy + '/ask', { method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ q:'Erkläre den Akkusativ in einem Satz.' }) }, 30000);
      const ab = await a.text();
      out.push('/ask : HTTP ' + a.status + ' · ' + ab.slice(0, 150));
    }catch(e){ out.push('/ask : ERREUR ' + ((e && e.name === 'AbortError') ? 'timeout-30s' : ((e && e.message) || e))); }
    out.push('dernière erreur ia.js : ' + (window.__IA_ERR || 'aucune'));
    panneauTest(out);
    return out.join('\n');
  };
  try{
    const pose = function(){
      if(document.getElementById('iaTestBtn')) return;
      const b = document.createElement('button');
      b.id = 'iaTestBtn'; b.type = 'button'; b.textContent = '🧠';
      b.title = 'فحص الدماغ السحابي / test du cerveau cloud';
      b.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:9997;width:46px;height:46px;'
        + 'border-radius:50%;border:1px solid rgba(232,182,76,.5);background:#0b241a;color:#e8b64c;'
        + 'font-size:20px;cursor:pointer';
      b.addEventListener('click', function(){ window.testCerveau(); });
      document.body.appendChild(b);
    };
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pose); else pose();
  }catch(e){}
})();
