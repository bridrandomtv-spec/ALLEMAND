/* ia.js — couche « cerveau » : réponse locale d'abord (hors-ligne), puis LLM grounded
   (Workers AI gratuit) si la réponse locale est faible. Quota client : 40 appels/jour. */
'use strict';
(function(){
  window.reponseIA = async function(q){
    q = String(q == null ? '' : q).trim();
    if(!q) return '';
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
    let localObj = null, local = '', speakWord = '';
    if(typeof fn === 'function'){ try{ localObj = await fn(q); }catch(e){} }
    if(localObj && typeof localObj === 'object'){
      local     = html2txt(localObj.html || localObj.texte || localObj.reponse || '');
      speakWord = String(localObj.speakWord || '');
      /* un mot à prononcer (intent 🔊 النطق / 🔤 المفردة) est une réponse valable */
      if((!local || local.length < 25) && speakWord) local = speakWord;
    }else{
      local = String(localObj || '');
    }
    /* ── langue de la question : une question allemande/fr/es/it ne doit JAMAIS
       recevoir une réponse arabe du moteur local ── */
    const QL = (function(s){
      s = String(s || '');
      if(/[\u0600-\u06FF]/.test(s)) return 'ar';
      if(/[\u00e4\u00f6\u00fc\u00df]/i.test(s) || /\b(der|die|das|und|nicht|ich|du|ist|ein|eine|wo|wie|was|wer|bist|geht|hallo)\b/i.test(s)) return 'de';
      if(/\b(le|la|les|je|tu|il|elle|est|suis|pourquoi|bonjour|merci)\b/i.test(s)) return 'fr';
      if(/\b(el|los|las|yo|usted|gracias|hola|buenos)\b/i.test(s)) return 'es';
      if(/\b(gli|che|di|sono|grazie|ciao)\b/i.test(s)) return 'it';
      return '';
    })(q);
    const FB = {
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
    const fixLang = s => (QL && QL !== 'ar' && arR(s) > 0.5) ? (FB[QL] || s) : s;
    /* Une réponse locale est valable dès qu'elle dépasse 25 caractères UTILES,
       ou qu'elle porte un mot à prononcer. On ne la jette plus systématiquement. */
    const weak = !local || local.indexOf('لا أعرف') !== -1 ||
      (local.length < 25 && !speakWord) ||
      (QL && QL !== 'ar' && arR(local) > 0.5);
    if(!weak){ window.__IA_WORD = speakWord; window.__IA_WORD = speakWord; return fixLang(local); }
    try{
      const k = 'dz_ia_' + new Date().toDateString();
      const n = +(localStorage.getItem(k) || 0);
      if(n >= 150){ try{ console.warn('🧠 quota journalier atteint (150)'); }catch(_){} window.__IA_WORD = speakWord; return fixLang(local); }
      localStorage.setItem(k, String(n + 1));
    }catch(e){}
    let proxy = '';
    try{
      const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
      if(r.ok){ const c = await r.json(); proxy = String(c.ia_proxy || '').replace(/\/+$/, ''); }
    }catch(e){}
    if(!proxy) return fixLang(local);
    try{
      let ctx = '';
      try{
        if(window.BIBLIO && BIBLIO.context){
          const bc = await BIBLIO.context(q, 2000);
          if(bc) ctx = 'BIBLIOTHÈQUE OFFICIELLE (extraits vérifiés, cite la source) :\n' + bc + '\n\n';
        }
      }catch(e){}
      if(local && local.indexOf('لا أعرف') === -1) ctx += 'MOTEUR LOCAL (déjà vérifié) :\n' + local.slice(0, 900);
      ctx = ctx.slice(0, 3000);
      const r = await fetch(proxy + '/ask', { method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ q: q, text: q, ctx: ctx }) });
      if(!r.ok){
        let e = {};
        try{ e = await r.json(); }catch(_){}
        try{ console.warn('🧠 ia-ask HTTP ' + r.status + ' : ' + (e.err || '?')); }catch(_){}
        if(r.status === 400 || r.status === 415){
          const r2 = await fetch(proxy + '/ask', { method:'POST',
            headers:{ 'Content-Type':'text/plain' }, body: q });
          if(r2.ok){
            const j2 = await r2.json();
            if(j2 && j2.ok && j2.rep && j2.rep.length > 10) return j2.rep;
          }
        }
        return fixLang(local);
      }
      const j = await r.json();
      if(!j.ok){ window.__IA_ERR = j.err || 'http';
        try{ console.warn('🧠 ia-ask :', j.err); }catch(_){}
        window.__IA_WORD = speakWord; return fixLang(local); }
      window.__IA_ERR = '';
      if(j.rep && j.rep.length > 10){
        /* garde inverse : question arabe → jamais de réponse sans caractères arabes */
        if(QL === 'ar' && !/[\u0600-\u06FF]/.test(j.rep)){
          const loc = String(local || '');
          return (loc && loc.indexOf('لا أعرف') === -1) ? loc :
            'لم أفهم تمامًا. اسألني عن تصريف فعل، أداة، جمع، رقم أو معنى كلمة — أو قل « الصفحة 11 » لأقرأها لك.';
        }
        return j.rep;
      }
    }catch(e){}
    return fixLang(local);
  };
})();
