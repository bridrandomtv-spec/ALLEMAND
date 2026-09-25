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
    const weak = !local || local.indexOf('لا أعرف') !== -1 || local.length < 25;
    if(!weak) return local;
    try{
      const k = 'dz_ia_' + new Date().toDateString();
      const n = +(localStorage.getItem(k) || 0);
      if(n >= 150){ try{ console.warn('🧠 quota journalier atteint (150)'); }catch(_){} return local; }
      localStorage.setItem(k, String(n + 1));
    }catch(e){}
    let proxy = '';
    try{
      const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
      if(r.ok){ const c = await r.json(); proxy = String(c.ia_proxy || '').replace(/\/+$/, ''); }
    }catch(e){}
    if(!proxy) return local;
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
        return local;
      }
      const j = await r.json();
      if(!j.ok){ window.__IA_ERR = j.err || 'http';
        try{ console.warn('🧠 ia-ask :', j.err); }catch(_){}
        return local; }
      window.__IA_ERR = '';
      if(j.rep && j.rep.length > 10) return j.rep;
    }catch(e){}
    return local;
  };
})();
