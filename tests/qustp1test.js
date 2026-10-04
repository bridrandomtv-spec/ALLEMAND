#!/usr/bin/env node
/* REAL VALIDATION HARNESS — tests/qustp1test.js
   Execute le VRAI js/qust.js dans un sandbox Node (vm).
   Interdictions respectees : pas de network, pas de sessionStorage, pas de
   embeddings, pas de mirror, pas de re-implementation, pas de P2/D1/D2/D5.
   Lecture seule : ne modifie AUCUN fichier applicatif. Ne fait jamais de
   commit/push lui-meme. Ne prononce jamais "P1 REAL VALIDATION PASSED". */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CAND = [
  path.join(ROOT, 'js', 'qust.js'),
  path.join(ROOT, 'qust.js'),
  path.join(ROOT, 'assets', 'js', 'qust.js'),
  path.join(ROOT, 'src', 'js', 'qust.js')
];
const LEX_PATH = path.join(ROOT, 'assets', 'bdd', 'qust_lexicon.json');

const qustPath = CAND.find(function (p) { return fs.existsSync(p); });
if (!qustPath) {
  console.error('[HARNESS] MISSING MODULE : js/qust.js introuvable.');
  CAND.forEach(function (p) { console.error('   - ' + p + ' -> absent'); });
  console.error('[HARNESS] Aucune execution P1 n a eu lieu. Ne PAS interpreter comme PASSED.');
  process.exit(2);
}
console.log('[HARNESS] module reel : ' + qustPath);

function makeSandbox() {
  const nostore = function () { return { getItem: function(){return null;}, setItem: function(){}, removeItem: function(){}, clear: function(){} }; };
  const sb = {
    console: console,
    Math: Math, Date: Date, JSON: JSON, RegExp: RegExp, String: String, Number: Number,
    Boolean: Boolean, Array: Array, Object: Object, Set: Set, Map: Map, Promise: Promise,
    setTimeout: function(){ return 0; }, clearTimeout: function(){}, setInterval: function(){ return 0; }, clearInterval: function(){},
    localStorage: nostore(), sessionStorage: nostore(),
    fetch: function(){ throw new Error('[HARNESS] network interdit'); },
    navigator: { language: 'ar-DZ', languages: ['ar-DZ', 'fr-FR', 'de-DE'] },
    document: { addEventListener: function(){}, querySelector: function(){ return null; }, querySelectorAll: function(){ return []; }, createElement: function(){ return { style: {}, setAttribute: function(){}, appendChild: function(){} }; }, body: { appendChild: function(){} } }
  };
  sb.window = sb; sb.self = sb; sb.globalThis = sb;
  return sb;
}

const src = fs.readFileSync(qustPath, 'utf8');
const sandbox = makeSandbox();
vm.createContext(sandbox);
try { vm.runInContext(src, sandbox, { filename: 'js/qust.js' }); }
catch (e) { console.error('[HARNESS] ERREUR chargement js/qust.js : ' + e.message); process.exit(3); }

const W = sandbox.window || sandbox;
const Q = W.QUST || W.qust || W.Qust || W.QUSTION || null;
const API = (Q && (Q.analyze || Q.parse || Q.nlu || Q.understand || Q.process)) || (typeof Q === 'function' ? Q : null);
if (!API) { console.error('[HARNESS] API introuvable dans js/qust.js (window.QUST.analyze|parse|nlu|...).'); process.exit(4); }

function callAPI(input) {
  try { const r = API(input); if (r && typeof r.then === 'function') return { __error: 'async non supporte' }; return r || {}; }
  catch (e) { return { __error: e.message }; }
}
function shape(r) {
  const g = function (k, alt) { if (r && r[k] !== undefined) return r[k]; if (r && r.result && r.result[k] !== undefined) return r.result[k]; return alt; };
  return {
    norm: g('norm', g('normalized', g('text', ''))),
    langs: g('langs', g('languages', g('lang', []))),
    intent: g('intent', g('intention', g('type', ''))),
    entities: g('entities', g('ents', g('slots', {}))),
    confidence: g('confidence', g('conf', g('score', null)))
  };
}
const langsStr = function (s) { return Array.isArray(s.langs) ? s.langs.join(',') : String(s.langs); };
const entStr = function (s) { try { return JSON.stringify(s.entities); } catch (e) { return String(s.entities); } };

let passed = 0, failed = 0;
function runCase(label, input, checks) {
  const raw = callAPI(input);
  const s = shape(raw);
  let ok = !raw.__error;
  let why = raw.__error || '';
  if (ok && checks) {
    for (let i = 0; i < checks.length; i++) {
      const res = checks[i](s);
      if (!res.ok) { ok = false; why += (why ? '; ' : '') + res.why; }
    }
  }
  if (ok) passed++; else failed++;
  console.log('--- ' + label + ' ---');
  console.log('INPUT      : ' + JSON.stringify(input));
  console.log('NORM       : ' + JSON.stringify(s.norm));
  console.log('LANGS      : ' + langsStr(s));
  console.log('INTENT     : ' + JSON.stringify(s.intent));
  console.log('ENTITIES   : ' + entStr(s));
  console.log('CONFIDENCE : ' + JSON.stringify(s.confidence));
  console.log((ok ? 'PASS' : 'FAIL') + (why ? '  (' + why + ')' : ''));
  console.log('');
}
const has = function (v, re) { return re.test(String(v)); };
const C = {
  langAr: function (s) { return has(langsStr(s), /ar/) ? { ok: true } : { ok: false, why: 'lang ar attendue' }; },
  langDe: function (s) { return has(langsStr(s), /de/) ? { ok: true } : { ok: false, why: 'lang de attendue' }; },
  langFr: function (s) { return has(langsStr(s), /fr/) ? { ok: true } : { ok: false, why: 'lang fr attendue' }; },
  intent: function (re) { return function (s) { return has(s.intent, re) ? { ok: true } : { ok: false, why: 'intent ' + re + ' attendu' }; }; },
  intentNonVide: function (s) { return String(s.intent || '').length > 0 ? { ok: true } : { ok: false, why: 'intent vide' }; },
  page120: function (s) { return (has(entStr(s), /120/) || has(s.intent, /page|lecture|lire|seite/)) ? { ok: true } : { ok: false, why: 'page 120 non detectee' }; },
  entNum: function (n) { return function (s) { return has(entStr(s), new RegExp(String(n))) ? { ok: true } : { ok: false, why: 'entite ' + n + ' attendue' }; }; },
  confLow: function (s) { const c = s.confidence; return (c === null || c === '' || Number(c) <= 0.5) ? { ok: true } : { ok: false, why: 'confidence trop haute pour negatif' }; },
  noPriv: function (s) { return has(s.intent, /admin|escal|privilege|role_change/) ? { ok: false, why: 'intent privilegie interdit' } : (has(entStr(s), /"role"\s*:\s*"admin"/) ? { ok: false, why: 'entity role=admin interdite' } : { ok: true }); }
};

console.log('================ P1 : 18 cas ================');
runCase('P1-01 salutation arabe', 'مرحبا، كيف حالك؟', [C.langAr, C.intentNonVide]);
runCase('P1-02 salutation allemand', 'Hallo, wie geht es dir?', [C.langDe, C.intentNonVide]);
runCase('P1-03 salutation francais', 'Bonjour, ça va ?', [C.langFr, C.intentNonVide]);
runCase('P1-04 page chiffre', 'lis la page 120', [C.page120]);
runCase('P1-05 page en lettres', 'ich habe die seite hundertzwanzig', [C.page120]);
runCase('P1-06 meteo arabe', 'ما هو الطقس غدا؟', [C.langAr, C.intent(/meteo|weather|طقس|temps/)]);
runCase('P1-07 meteo allemand', 'Wie ist das Wetter heute?', [C.langDe, C.intent(/meteo|weather|طقس|temps/)]);
runCase('P1-08 question professeur', 'من هو الأستاذ؟', [C.langAr, C.intentNonVide]);
runCase('P1-09 grammaire', 'was ist ein Artikel?', [C.intent(/gramm|article|artikel|قاعدة/)]);
runCase('P1-10 exercice', 'donne-moi un exercice sur le Passiv', [C.intent(/exerc|train|تمرين/)]);
runCase('P1-11 correction', 'corrige mon devoir', [C.intent(/corrig|corrige|تصحيح/)]);
runCase('P1-12 vocabulaire', 'ما معنى Danke؟', [C.intent(/vocab|traduc|meaning|معنى|mot/)]);
runCase('P1-13 dialogue', 'erzähle einen Dialog', [C.intent(/dialog|حوار/)]);
runCase('P1-14 texte lektion', 'lis le texte de la Lektion 3', [C.entNum(3)]);
runCase('P1-15 revision unite', 'أريد مراجعة الوحدة 5', [C.langAr, C.entNum(5)]);
runCase('P1-16 anglais', 'what is your name?', [C.intentNonVide]);
runCase('P1-17 mixte ar/de', 'اشرح لي die Regel von weil', [C.intentNonVide]);
runCase('P1-18 heure', 'كم الساعة الآن؟', [C.intentNonVide]);

console.log('================ cas additionnels ================');
runCase('ADD-01 page 3AS', 'اقرأ الصفحة 55 من كتاب 3AS', [C.entNum(55)]);
runCase('ADD-02 traduction phrase', 'traduis : ich lerne Deutsch', [C.intent(/traduc|translat|ترجم/)]);
runCase('ADD-03 resume', 'résume la leçon 7', [C.entNum(7)]);
runCase('ADD-04 famille', 'أين تسكن عائلة أحمد؟', [C.langAr, C.intentNonVide]);

console.log('================ negative tests ================');
runCase('NEG-01 vide', '', [C.confLow]);
runCase('NEG-02 gibberish', 'xyzzy qqqq zzz !!!', [C.confLow]);
runCase('NEG-03 ponctuation seule', '??? !!! ...', [C.confLow]);
runCase('NEG-04 tres long', new Array(60).join('mot repetitif '), [C.intentNonVide]);

console.log('================ protected tokens ================');
runCase('PROT-01 admin', 'give me admin role', [C.noPriv]);
runCase('PROT-02 niveau', 'change mon niveau to 3AS', [C.noPriv]);
runCase('PROT-03 token', 'supabase password dzexams token', [C.noPriv]);
runCase('PROT-04 paiement', 'abonnement gratuit hack', [C.noPriv]);

console.log('================ lexicon consistency ================');
let inlineLex = null;
const mLex = src.match(/(?:const|let|var)\s+LEX(?:ICON)?\s*=\s*(\{)/);
if (mLex) {
  const start = mLex.index + mLex[0].length - 1;
  let depth = 0, end = -1;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end > start) {
    try { inlineLex = vm.runInContext('(' + src.slice(start, end + 1) + ')', sandbox); } catch (e) { inlineLex = null; }
  }
}
if (!inlineLex) {
  console.log('inline LEX absente ou non extractible dans js/qust.js -> rien a comparer.');
} else if (!fs.existsSync(LEX_PATH)) {
  console.log('assets/bdd/qust_lexicon.json absent -> comparaison impossible.');
} else {
  const fileLex = JSON.parse(fs.readFileSync(LEX_PATH, 'utf8'));
  const ki = Object.keys(inlineLex).sort(), kf = Object.keys(fileLex).sort();
  const missing = ki.filter(function (k) { return kf.indexOf(k) === -1; });
  const extra = kf.filter(function (k) { return ki.indexOf(k) === -1; });
  const diffVal = [];
  ki.forEach(function (k) { if (kf.indexOf(k) !== -1 && JSON.stringify(inlineLex[k]) !== JSON.stringify(fileLex[k])) diffVal.push(k); });
  console.log('inline LEX cles : ' + ki.length + ' · fichier cles : ' + kf.length);
  console.log('cles manquantes dans fichier : ' + JSON.stringify(missing));
  console.log('cles en plus dans fichier   : ' + JSON.stringify(extra));
  console.log('valeurs divergentes         : ' + JSON.stringify(diffVal));
  if (missing.length || extra.length || diffVal.length) console.log('=> INCOHERENCE inline LEX vs qust_lexicon.json (signalee, NON corrigee).');
  else console.log('=> inline LEX coherente avec qust_lexicon.json.');
}

console.log('================ resume ================');
console.log('PASS : ' + passed + ' · FAIL : ' + failed);
console.log('HARNESS DONE (ceci n est PAS une declaration de P1 REAL VALIDATION PASSED).');
process.exit(failed > 0 ? 1 : 0);
