/* ══ subject.js — Registre de matières (Phase P2 / P2-A.1) ══
   Module AUTONOME : charge assets/bdd/subjects.json et expose window.SUBJECT.
   · AUCUN effet de bord UI. · AUCUNE modification de l'application.
   · language ≠ subject : ce module ne gère QUE la matière.

   P2-A.1 — active() s'appuie sur window.VT (contexte transversal)
   lorsqu'il est disponible :
       VT.ctx().subject === "allemand" → SUBJECT.active().id === "allemand"
       VT.ctx().subject === "anglais"  → SUBJECT.active().id === "anglais"
   Si VT n'est pas encore chargé (subject.js est servi AVANT app.js),
   ou si le sujet VT est inconnu du registre, on retombe sur « allemand »
   (fallback rétrocompatible — l'ancien code supposait l'allemand).

   get(), list() et ready() restent STRICTEMENT inchangés. */
(function(){
  'use strict';
  var REG = null;
  var DEFAULT_SUBJECT = 'allemand'; /* fallback rétrocompatible documenté */

  function load(){
    if(REG) return Promise.resolve(REG);
    return fetch('assets/bdd/subjects.json', { cache:'no-store' })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(j){ REG = (j && j.length) ? j : []; return REG; })
      .catch(function(){ REG = []; return REG; });
  }
  /* Liste des matières du registre (implemented / partial / planned). */
  function list(){ return (REG || []).slice(); }
  /* Une matière par id ou slug ; null si absente. */
  function get(id){
    return (REG || []).filter(function(s){ return s.id === id || s.slug === id; })[0] || null;
  }
  /* Matière active — P2-A.1 :
     1) si window.VT existe et expose ctx().subject, on tente de résoudre
        ce sujet dans le registre ;
     2) sinon (VT pas encore chargé, sujet inconnu, exception), on retombe
        sur « allemand » pour préserver le comportement historique.
     Ne modifie jamais VT, ne crée aucune nouvelle source de vérité. */
  function active(){
    var id = DEFAULT_SUBJECT;
    try {
      if (window.VT && typeof window.VT.ctx === 'function') {
        var ctx = window.VT.ctx();
        if (ctx && typeof ctx.subject === 'string' && ctx.subject.length > 0) {
          /* Vérification défensive : le sujet VT doit exister dans le registre */
          var known = get(ctx.subject);
          if (known) id = ctx.subject;
        }
      }
    } catch (e) { /* VT défaillant → fallback silencieux sur allemand */ }
    return get(id);
  }
  load(); /* préchargement silencieux, sans bloquer l'application */
  window.SUBJECT = { list: list, get: get, active: active, ready: load };
})();
