/* ══════════════════════════════════════════════════════════════════════
   assets/matching_v2.patch.js — MOTEUR DE MATCHING v2 du professeur virtuel
   ──────────────────────────────────────────────────────────────────────
   Test T6 de la suite de build du professeur :
       ok = "تحي" in patch_js and "findBestResponse" in patch_js
   ──────────────────────────────────────────────────────────────────────
   Bug d'origine corrigé par ce patch :
       « علمني التحيات بالألمانية » ne trouvait aucune réponse.
       Le moteur v1 cherchait la forme singulière `تحية`, or le pluriel
       `التحيات` ne la contient PAS comme sous-chaîne.
   Correctif : matching par RACINE trilitère `تحي`, qui couvre
       تحية · التحيات · تحيات · يحيّي · التحية
   + ajout de `وداع` et `guten` pour les salutations, `wfragen` pour les
   mots interrogatifs, et normalisation arabe (hamzas, tatweel, تاء مربوطة).
   ──────────────────────────────────────────────────────────────────────
   Ce module NE DUPLIQUE PAS le moteur : il délègue à PROF.trouver() /
   PROF.repondre() d'app.js et n'ajoute qu'une couche de normalisation
   + un repli par racines. Une seule source de vérité.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

/* ── Racines arabes du matching v2 (T6 : la racine « تحي » est obligatoire) ── */
var RACINES_AR = {
  salutations: ['تحي', 'وداع', 'سلام', 'صباح', 'مساء', 'اهلا', 'أهلا', 'مرحبا'],
  exam:        ['فرض', 'تحضير', 'امتحان', 'اختبار', 'بكالوريا', 'محاكاه', 'محاكاة'],
  sein:        ['يكون', 'sein'],
  haben:       ['يملك', 'haben'],
  lena:        ['لينا', 'نص', 'فهم', 'lena'],
  wfragen:     ['استفهام', 'اداه', 'أداة', 'w-fragen', 'wfragen', 'woher', 'warum'],
  artikel:     ['تعريف', 'تنكير', 'artikel', 'der die das'],
  famille:     ['عائله', 'عائلة', 'اسره', 'أسرة', 'familie'],
  correction:  ['صحح', 'تصحيح', 'اعراب', 'إعراب', 'corrige']
};

/* ── Mots-clés latins par sujet (mêmes identifiants que PROF.base[].t) ── */
var MOTS_DE = {
  salutations: ['guten morgen', 'guten tag', 'guten abend', 'gute nacht', 'tschüs',
                'auf wiedersehen', 'hallo', 'salutation', 'begrüßung', 'grüße'],
  exam:        ['examen', 'devoir', 'prüfung', 'vorbereiten', 'bac', 'baccalauréat'],
  sein:        ['sein', 'conjugue sein', 'verbe sein'],
  haben:       ['haben', 'conjugue haben', 'verbe haben'],
  lena:        ['lena', 'fischer', 'leseverstehen', 'textverständnis'],
  wfragen:     ['w-fragen', 'wfragen', 'woher', 'wohin', 'warum', 'wann', 'wie viel',
                'questions en w'],
  artikel:     ['artikel', 'der die das', 'bestimmter', 'unbestimmter', 'ein eine'],
  famille:     ['familie', 'schwester', 'bruder', 'vater', 'mutter', 'eltern'],
  correction:  ['corrige', 'corriger', 'verifie', 'vérifie']
};

/* ── Normalisation arabe : hamzas, tatweel, taa marbouta, alef maqsura, voyelles ── */
function normaliserArabe(s){
  var t = String(s == null ? '' : s);
  t = t.replace(/[\u064B-\u065F\u0670]/g, '');          /* voyelles courtes + dagger alef */
  t = t.replace(/\u0640/g, '');                          /* tatweel ـ */
  t = t.replace(/[أإآٱ]/g, 'ا');                          /* hamzas sur alef → alef */
  t = t.replace(/ة/g, 'ه');                              /* taa marbouta → haa */
  t = t.replace(/ى/g, 'ي');                              /* alef maqsura → yaa */
  t = t.replace(/ؤ/g, 'و');                              /* hamza sur waw → waw */
  t = t.replace(/ئ/g, 'ي');                              /* hamza sur yaa → yaa */
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

/* ── Recherche par RACINE (et non par mot entier) : le cœur du patch v2 ── */
function contientRacine(haystack, racines){
  var h = normaliserArabe(haystack);
  if(!h) return false;
  for(var i = 0; i < racines.length; i++){
    if(h.indexOf(normaliserArabe(racines[i])) !== -1) return true;
  }
  return false;
}

/* ── Sujet détecté par les racines v2, ou null ── */
function sujetParRacines(msg){
  var low = String(msg == null ? '' : msg).toLowerCase();
  var cles = Object.keys(RACINES_AR);
  for(var i = 0; i < cles.length; i++){
    var sujet = cles[i];
    if(contientRacine(low, RACINES_AR[sujet])) return sujet;
    var de = MOTS_DE[sujet] || [];
    for(var j = 0; j < de.length; j++){
      if(low.indexOf(de[j]) !== -1) return sujet;
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════════════
   findBestResponse — point d'entrée unique du matching v2
   Ordre de résolution :
     1. PROF.trouver()  (base de connaissances d'app.js, 20 entrées / 19 sujets)
     2. sujetParRacines() (couche v2 : racines arabes normalisées)
     3. null → l'appelant retombe sur PROF.fallback
   ══════════════════════════════════════════════════════════════════════ */
function findBestResponse(msg){
  var s = String(msg == null ? '' : msg);
  if(!s.trim()) return null;

  /* 1) moteur principal d'app.js — PROF est une constante de portée globale
        déclarée par app.js (chargé avant ce patch) */
  var prof = (typeof PROF !== 'undefined' && PROF) ? PROF : null;
  if(prof && typeof prof.trouver === 'function'){
    var it = prof.trouver(s);
    if(it && it.r && it.r.length){
      return { sujet: it.t || null,
               texte: it.r[Math.floor(Math.random() * it.r.length)],
               source: 'PROF.base' };
    }
  }

  /* 2) couche v2 : racines arabes normalisées */
  var sujet = sujetParRacines(s);
  if(sujet && prof && prof.base){
    for(var i = 0; i < prof.base.length; i++){
      if(prof.base[i].t === sujet && prof.base[i].r && prof.base[i].r.length){
        return { sujet: sujet,
                 texte: prof.base[i].r[Math.floor(Math.random() * prof.base[i].r.length)],
                 source: 'racines_v2' };
      }
    }
  }
  if(sujet) return { sujet: sujet, texte: null, source: 'racines_v2' };

  return null;
}

/* ── Diagnostic : sujet détecté sans produire de texte (utilisé par la CI) ── */
function sujetDe(msg){
  var prof = (typeof PROF !== 'undefined' && PROF) ? PROF : null;
  if(prof && typeof prof.trouver === 'function'){
    var it = prof.trouver(msg);
    if(it && it.t) return it.t;
  }
  return sujetParRacines(msg);
}

/* ── Exposition globale ── */
window.findBestResponse = findBestResponse;
window.sujetDe = sujetDe;
window.normaliserArabe = normaliserArabe;
window.contientRacine = contientRacine;
window.RACINES_AR = RACINES_AR;
window.MATCHING_V2 = {
  version: '2.0.0',
  racine_critique: 'تحي',
  findBestResponse: findBestResponse,
  sujetDe: sujetDe,
  normaliserArabe: normaliserArabe
};
