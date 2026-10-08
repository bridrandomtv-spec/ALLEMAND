/* ══ context.js — P2-C : façade de lecture du contexte pédagogique unifié ══
   ------------------------------------------------------------------------
   RÔLE UNIQUE : exposer UNE représentation publique et déterministe du
   contexte courant, calculée à partir des systèmes DÉJÀ existants.

       window.CONTEXT.ctx()  →  { subject, level, track }

   Ce module est une VUE, pas une nouvelle base de données :
     · subject ← window.SUBJECT.active().id   (déjà aligné sur VT par P2-A.1)
     · level   ← priorité P2-A.2 : CLOUD > VT > LEGACY > DEFAULT
     · track   ← window.VT.ctx().track        (aucun mapping, aucune déduction)

   GARANTIES (conformes au cahier des charges P2-C) :
     · lecture pure : aucun effet de bord (zéro écriture de stockage, zéro
       appel réseau, zéro appel aux mutateurs existants)
     · aucune nouvelle source de vérité, aucune nouvelle persistance
     · immuable : chaque appel retourne un objet NEUF et FIGÉ — l'appelant
       ne peut pas corrompre l'état interne
     · ne modifie ni le contexte historique antérieur, ni VT, ni SUBJECT,
       ni le pont de niveau
     · rétrocompatible : visiteur → niveau historique conservé
     · filière absente → null (jamais inventée, aucune déduction de niveau)
   ------------------------------------------------------------------------ */
(function () {
  'use strict';

  /* Idempotence : un double chargement ne doit rien casser. */
  if (window.CONTEXT && window.CONTEXT.__P2C__) return;

  /* Valeurs strictement identiques à celles validées par le pont P2-A.2. */
  var LEGACY_VALIDES  = ['tous', '2AS', '3AS'];
  var DEFAULT_SUBJECT = 'allemand';   /* fallback rétrocompatible P2-A.1 */
  var DEFAULT_LEVEL   = 'tous';       /* comportement visiteur historique */

  /* ──────────────────────────────────────────────────────────────
     SUBJECT — délègue à SUBJECT.active() (source unique, P2-A.1).
     Ne recrée AUCUNE logique de matière, ne duplique AUCUN registre.
     ────────────────────────────────────────────────────────────── */
  function readSubject() {
    try {
      if (window.SUBJECT && typeof window.SUBJECT.active === 'function') {
        var s = window.SUBJECT.active();
        if (s && typeof s.id === 'string' && s.id.length > 0) return s.id;
        if (typeof s === 'string' && s.length > 0) return s;
      }
    } catch (e) { /* registre non chargé → fallback documenté */ }
    return DEFAULT_SUBJECT;
  }

  /* ──────────────────────────────────────────────────────────────
     LEVEL — reproduction EXACTE de la priorité P2-A.2, en LECTURE
     SEULE (le pont reste le seul acteur autorisé à écrire).
       1. CLOUD   (verrou de compte, puis session cloud persistée)
       2. VT      (uniquement si matière allemande et niveau 2AS/3AS)
       3. LEGACY  (accesseur public existant, puis clé historique)
       4. DEFAULT (visiteur — comportement historique préservé)
     ────────────────────────────────────────────────────────────── */
  function niveauCloud() {
    /* 1a. Verrou P0.5 — élève cloud connecté (niveau imposé par le compte). */
    try {
      if (typeof niveauVerrou !== 'undefined' && niveauVerrou &&
          LEGACY_VALIDES.indexOf(niveauVerrou) !== -1) return niveauVerrou;
    } catch (e) {}
    /* 1b. Session cloud persistée par cloudAuthority(). */
    try {
      var raw = (window.localStorage && localStorage.getItem('dz_de_session_v1'));
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.uid && s.niveau && LEGACY_VALIDES.indexOf(s.niveau) !== -1)
          return s.niveau;
      }
    } catch (e) {}
    return null;
  }

  function niveauVT() {
    try {
      if (!window.VT || typeof window.VT.ctx !== 'function') return null;
      var c = window.VT.ctx();
      if (!c || typeof c.level !== 'string') return null;
      /* Anti-contamination (règle P2-A.2) : le niveau legacy allemand ne
         peut pas recevoir un niveau issu d'un contexte non-allemand. */
      if (c.subject && c.subject !== 'allemand') return null;
      if (c.level !== '2AS' && c.level !== '3AS') return null;
      return c.level;
    } catch (e) { return null; }
  }

  function niveauLegacy() {
    /* 3a. Accesseur public existant — jamais remplacé. */
    try {
      if (typeof window.getNiveauActif === 'function') {
        var n = window.getNiveauActif();
        if (typeof n === 'string' && n.length > 0) return n;
      }
    } catch (e) {}
    /* 3b. Clé historique (lecture seule, aucune écriture). */
    try {
      var raw = (window.localStorage && localStorage.getItem('dz_de_niveau_v1'));
      if (raw && LEGACY_VALIDES.indexOf(raw) !== -1) return raw;
    } catch (e) {}
    /* 4. Défaut visiteur — comportement historique préservé. */
    return DEFAULT_LEVEL;
  }

  function readLevel() {
    var c = niveauCloud();  if (c) return c;
    var v = niveauVT();     if (v) return v;
    return niveauLegacy();
  }

  /* ──────────────────────────────────────────────────────────────
     TRACK — uniquement la valeur réellement fournie par VT.
     AUCUN mapping. AUCUNE déduction depuis le niveau. AUCUNE invention.
     Source absente → null.
     ────────────────────────────────────────────────────────────── */
  function readTrack() {
    try {
      if (!window.VT || typeof window.VT.ctx !== 'function') return null;
      var c = window.VT.ctx();
      if (c && typeof c.track === 'string' && c.track.length > 0) return c.track;
    } catch (e) {}
    return null;
  }

  /* ──────────────────────────────────────────────────────────────
     API PUBLIQUE — lecture pure.
     Chaque appel construit un objet NEUF, puis le FIGE : l'appelant
     peut tenter de le modifier sans jamais atteindre l'état interne.
     ────────────────────────────────────────────────────────────── */
  var CONTEXT = {
    __P2C__: true,

    /** Retourne { subject, level, track } — snapshot immuable du contexte. */
    ctx: function () {
      return Object.freeze({
        subject: readSubject(),
        level:   readLevel(),
        track:   readTrack()
      });
    }
  };

  try { Object.freeze(CONTEXT); } catch (e) {}
  window.CONTEXT = CONTEXT;
})();
