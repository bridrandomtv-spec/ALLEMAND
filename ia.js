/* ia.js — couche « cerveau » : réponse locale d'abord (hors-ligne), puis LLM grounded
   (Workers AI gratuit) si la réponse locale est faible. Quota client : 40 appels/jour. */
'use strict';
(function(){
  window.reponseIA = async function(q){
    q = String(q == null ? '' : q).trim();
    if(!q) return '';
    const fn = window.reponsePedagogique;
    let local = '';
    if(typeof fn === 'function'){ try{ local = await fn(q); }catch(e){} }
    if(local && typeof local === 'object') local = local.texte || local.reponse || '';
    local = String(local || '');
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
    const fixLang = s => (QL && QL !== 'ar' && /[\u0600-\u06FF]/.test(String(s || ''))) ? (FB[QL] || s) : s;
    const weak = !local || local.indexOf('لا أعرف') !== -1 || local.length < 25 ||
      (QL && QL !== 'ar' && /[\u0600-\u06FF]/.test(local));
    if(!weak) return fixLang(local);
    try{
      const k = 'dz_ia_' + new Date().toDateString();
      const n = +(localStorage.getItem(k) || 0);
      if(n >= 150){ try{ console.warn('🧠 quota journalier atteint (150)'); }catch(_){} return fixLang(local); }
      localStorage.setItem(k, String(n + 1));
    }catch(e){}
    let proxy = '';
    try{
      const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
      if(r.ok){ const c = await r.json(); proxy = String(c.ia_proxy || '').replace(/\/+$/, ''); }
    }catch(e){}
    if(!proxy) return fixLang(local);
    try{
      const ctx = (local && local.indexOf('لا أعرف') === -1) ? local.slice(0, 2500) : '';
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
        return fixLang(local); }
      window.__IA_ERR = '';
      if(j.rep && j.rep.length > 10) return j.rep;
    }catch(e){}
    return fixLang(local);
  };
})();
