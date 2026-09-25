/* ia.js — couche « cerveau » : réponse locale d'abord (hors-ligne), puis LLM grounded
   (Workers AI gratuit) si la réponse locale est faible. Quota client : 40 appels/jour. */
'use strict';
(function(){
  window.reponseIA = async function(q){
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
      if(n >= 40) return local;
      localStorage.setItem(k, String(n + 1));
    }catch(e){}
    let proxy = '';
    try{
      const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
      if(r.ok){ const c = await r.json(); proxy = String(c.ia_proxy || '').replace(/\/+$/, ''); }
    }catch(e){}
    if(!proxy) return local;
    try{
      const r = await fetch(proxy + '/ask', { method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ q: q, ctx: (local && local !== 'لا أعرف') ? local : '' }) });
      const j = await r.json();
      if(j.ok && j.rep && j.rep.length > 10) return j.rep;
    }catch(e){}
    return local;
  };
})();
