/* access.js — PORTE D'ACCÈS CENTRALE (essai gratuit + entitlement Backend)
   Règles absolues (décisions du propriétaire) :
   · le contenu GRATUIT défini dans access_config.json fonctionne hors-ligne ;
   · le contenu PAYANT exige une vérification Backend (RLS Supabase) à chaque décision :
     le cache local n'est JAMAIS une source d'autorisation (ui_only) ;
   · Backend injoignable ou hors-ligne → le payant reste VERROUILLÉ. */
'use strict';
(function(){
  var CFG_URL = 'assets/bdd/access_config.json';
  var DEF_FREE = { units: { '1': [1, 2] }, quizzes: ['u1'], devoirs: [],
    features: ['banque', 'memoire', 'masar', 'malakhiss', 'resume'] };
  var DEF_ROLES = {
    prof:   { free_features: ['demo_lecon', 'demo_exercice', 'demo_test', 'demo_classe',
                              'demo_dashboard', 'demo_gestion_eleves'] },
    parent: { free_features: ['demo_dashboard', 'demo_progression', 'demo_resultats',
                              'demo_stats', 'guide_suivi'] } };
  var cfg = null, cfgP = null;
  var ENT = { ok: false, until: null, ts: 0, src: 'none' };   /* mémoire vive UNIQUEMENT */
  var TTL = 60000;

  function loadCfg(){
    if(cfg) return Promise.resolve(cfg);
    if(cfgP) return cfgP;
    cfgP = fetch(CFG_URL, { cache: 'no-store' }).then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){ cfg = (j && j.free) ? j : null; return cfg; })
      .catch(function(){ cfg = null; return null; });
    return cfgP;
  }
  function freeCfg(){
    var f = (cfg && cfg.free) ? cfg.free : DEF_FREE;
    return { units: f.units || DEF_FREE.units, quizzes: f.quizzes || [], devoirs: f.devoirs || [], features: f.features || [] };
  }
  function online(){ try{ return navigator.onLine !== false; }catch(e){ return true; } }

  function isFreeLesson(u, n){ var l = freeCfg().units[String(u)]; return !!(l && l.indexOf(n) !== -1); }
  function isFreeQuiz(u){ return freeCfg().quizzes.indexOf('u' + u) !== -1; }
  function isFreeDevoir(id){ return freeCfg().devoirs.indexOf(id) !== -1; }
  function isFreeFeature(role, feat){
    var r = (cfg && cfg.roles && cfg.roles[role]) || (DEF_ROLES[role] || {});
    return (r.free_features || []).indexOf(feat) !== -1;
  }

  /* ── Entitlement : UNIQUE source de vérité = Backend (window.SB → RLS Supabase) ── */
  async function refresh(){
    if(!online()){ ENT.ok = false; ENT.src = 'offline-locked'; return ENT; }
    if(ENT.ok && ENT.src === 'backend' && Date.now() - ENT.ts < TTL) return ENT;
    try{
      if(!window.SB || !window.SB.me || !window.SB.mySubs){ ENT.ok = false; ENT.src = 'no-backend'; return ENT; }
      var u = await window.SB.me();
      if(!u){ ENT.ok = false; ENT.src = 'no-session'; return ENT; }
      var res = await window.SB.mySubs();
      var list = Array.isArray(res) ? res : ((res && res.data) || []);
      var now = Date.now();
      var act = false, fin = null;
      for(var i = 0; i < list.length; i++){
        var r = list[i];
        if(r && r.statut === 'actif' && (!r.fin || new Date(r.fin).getTime() > now)){
          act = true;
          if(r.fin && (!fin || r.fin > fin)) fin = r.fin;
        }
      }
      ENT.ok = act; ENT.until = fin; ENT.ts = now; ENT.src = 'backend';
    }catch(e){ ENT.ok = false; ENT.src = 'backend-error'; }
    return ENT;
  }
  function entActive(){
    /* aucune lecture de cache local ici : backend + réseau obligatoires */
    return ENT.ok === true && ENT.src === 'backend' && online() && (Date.now() - ENT.ts < TTL);
  }
  function role(){
    try{ if(window.AUTH && AUTH.session){ var s = AUTH.session(); if(s && s.role) return s.role; } }catch(e){}
    return 'eleve';
  }

  /* Décision C : rapport de BASE d'un enfant = enfant ACTIF ou parent ACTIF.
     La preuve « enfant actif » vient du serveur (RPC child_active_entitlement, phase 5) ;
     en attendant ce RPC, seul l'entitlement du parent ouvre (le reste = verrouillé). */
  async function canAccessParentChild(childId){
    if(entActive()) return true;
    if(!online()) return false;
    try{
      if(!window.SB || !window.SB.sb || !window.SB.me) return false;
      var c = await window.SB.sb(); if(!c) return false;
      var me = await window.SB.me(); if(!me) return false;
      var r = await c.rpc('child_active_entitlement', { parent_id: me.id, child_id: childId });
      return !!(r && r.data);
    }catch(e){ return false; }
  }

  var ACCESS = {
    refresh: refresh,
    entitlement: function(){ return { ok: ENT.ok, src: ENT.src, until: ENT.until }; },
    role: role,
    isFreeLesson: isFreeLesson,
    canAccessLesson: function(u, n){ if(isFreeLesson(u, n)) return true; return entActive(); },
    canAccessUnit: function(u){ if(freeCfg().units[String(u)]) return true; return entActive(); },
    canAccessQuiz: function(u){ if(isFreeQuiz(u)) return true; return entActive(); },
    canAccessDevoir: function(id){ if(isFreeDevoir(id)) return true; return entActive(); },
    canAccessCorrection: function(){ return entActive(); },
    canAccessBac: function(){ return entActive(); },
    canAccessFeature: function(f){ return freeCfg().features.indexOf(f) !== -1 || entActive(); },
    canAccessProf: function(f){ if(isFreeFeature('prof', f)) return true; return entActive() && role() === 'prof'; },
    canAccessParent: function(f){ if(isFreeFeature('parent', f)) return true; return entActive() && role() === 'parent'; },
    canAccessParentChild: canAccessParentChild,
    trialDone: function(u, limit){
      var lim = limit || ((cfg && cfg.FREE_LESSONS_LIMIT) || 2);
      try{
        var st = JSON.parse(localStorage.getItem('dz_de_seances_v1:u' + u) || '{}');
        var done = (st && st.done) ? st.done.length : 0;
        return done >= lim;
      }catch(e){ return false; }
    },
    paywall: function(target){
      try{ document.dispatchEvent(new CustomEvent('dz:paywall', { detail: target || {} })); }catch(e){}
    }
  };
  window.ACCESS = ACCESS;
  loadCfg();
})();
