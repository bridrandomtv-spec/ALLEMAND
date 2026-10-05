/* ══ subject.js — Registre de matières (Phase P2) ══
   Module AUTONOME : charge assets/bdd/subjects.json et expose window.SUBJECT.
   · AUCUN effet de bord UI. · AUCUNE modification de l'application.
   · language ≠ subject : ce module ne gère QUE la matière.
   Fallback « allemand » : compatibilité rétrocompatible avec l'ancien
   comportement (la plateforme supposait historiquement l'allemand comme
   matière unique). Utilisé UNIQUEMENT comme valeur par défaut de active(). */
(function(){
  'use strict';
  var REG = null;
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
  /* Matière active. Rétrocompatibilité : l'ancien code supposait l'allemand,
     donc active() renvoie la matière « allemand » tant qu'aucune sélection
     multi-matières n'existe (ce sera le rôle de P3+). Renvoie l'objet matière
     ou null si le registre n'a pas pu être chargé. */
  function active(){ return get('allemand'); }
  load(); /* préchargement silencieux, sans bloquer l'application */
  window.SUBJECT = { list: list, get: get, active: active, ready: load };
})();
