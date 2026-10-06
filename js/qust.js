/* ══ qust.js — Question Understanding (Phase P3-A, Shadow Mode) ══
   Couche MINIMALE, indépendante, déterministe : normalisation + langues +
   intention + entités + confiance. NE répond PAS à l'élève, NE touche PAS au
   RAG, NE fait AUCUN réseau, AUCUNE dépendance. language ≠ subject.
   Le subject est fourni par le contexte (ou SUBJECT.active() en repli). */
(function(){
  'use strict';
  var AR = /[؀-ۿ]/;
  var DZ = ["wach","chno","kifach","klach","had","hadi","ma3na","fehmt","fhemt","tini","tamrin","wash","shno","3lach"];
  var DZ_AR = ["واش","شنو","كيفاش","علاش","هاد","ما فهمتش","عطيني","فهمتش","معناها"];
  var FR = ["explique","donne","pourquoi","comment","traduis","rsume","resume","exercice","leon","lecon","page","quest","difference","franc"];
  var DE = ["der","die","das","den","dem","weil","dass","ich","du","ist","und","nicht","bedeutet","heisst","heit","lektion","seite","akkusativ","dativ","nominativ","genitiv"];
  function norm(s){
    s = String(s==null?'':s).toLowerCase();
    s = s.replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
    s = s.replace(/[ً-ٰٟ]/g,'');
    return s.replace(/\s+/g,' ').trim();
  }
  function toks(s){ return s.split(/[^0-9A-Za-z_؀-ۿ]+/).filter(function(w){return w.length>1;}); }
  function langs(raw, nq){
    var out = [];
    if(AR.test(raw)) out.push("ar");
    if(/[a-z]/.test(nq) && /[3759]/.test(nq) && !AR.test(raw)) out.push("arabizi");
    var t = toks(nq);
    if(t.some(function(w){return DZ.indexOf(w)!==-1;}) || t.some(function(w){return DZ_AR.indexOf(w)!==-1;})) out.push("darija");
    if(t.some(function(w){return FR.indexOf(w)!==-1;})) out.push("fr");
    if(t.some(function(w){return DE.indexOf(w)!==-1;}) || /[äöüß]/.test(nq)) out.push("de");
    return out;
  }
  function intent(nq){
    function has(a){ return a.some(function(k){ return nq.indexOf(k)!==-1; }); }
    if(has(["فرق","difference","compare","قارن"]) && has(["بين","و"])) return ["compare",0.8];
    if(has(["لخص","ملخص","rsume","resume","summarize"])) return ["summarize",0.85];
    if(has(["صحح","corrige","correct","صلح"])) return ["correct_exercise",0.85];
    if(has(["ترجم","traduis","translate","comment on dit","كيفاش نقول"])) return ["translate",0.85];
    if(has(["تمرين","exercice","exercise","quiz","فرض","اختبار","tamrin"])) return ["practice_exercise",0.85];
    if(has(["قاعدة","قواعد","regel","akkusativ","dativ","nominativ","genitiv","صرف","conjug"])) return ["explain_rule",0.85];
    if(has(["معنى","معناها","ma3na","signification","bedeutet","واش معنى"])) return ["explain_word",0.9];
    if(has(["وين نلقى","صفحة","page","seite","trouve","oت"])) return ["find_page",0.7];
    if(has(["درس","leon","lecon","lesson","شرحلي","explique","فهمني"])) return ["explain_lesson",0.8];
    return [null,0.1];
  }
  function entities(raw, nq, ctx){
    var e = {};
    e.subject = (ctx && ctx.subject) ? ctx.subject
      : (typeof window!=='undefined' && window.SUBJECT && window.SUBJECT.active && window.SUBJECT.active()) ? window.SUBJECT.active().id
      : null;
    var m;
    if((m = nq.match(/\b(2as|3as|1as)\b/))) e.level = m[1].toUpperCase();
    if((m = nq.match(/(?:\bl\s*([1-8])\b|(?:lektion|lecon|leçon|درس)\s*([1-8]))/))) e.lektion = "L"+(m[1]||m[2]);
    if((m = nq.match(/(?:\bu\s*(1[0-9]|[1-9])\b|(?:unite|unité|وحده|وحدة)\s*(1[0-9]|[1-9]))/))) e.unit = "U"+(m[1]||m[2]);
    if((m = nq.match(/(?:page|seite|صفحه|صفحة)\s*(\d{1,3})/))) e.page = +m[1];
    var g = ["akkusativ","dativ","nominativ","genitiv"].filter(function(x){return nq.indexOf(x)!==-1;});
    if(g.length) e.grammar = g;
    var art = ["der","die","das","den","dem"].filter(function(x){return toks(nq).indexOf(x)!==-1;});
    if(art.length) e.articles = art;
    var conj = ["weil","dass"].filter(function(x){return toks(nq).indexOf(x)!==-1;});
    if(conj.length) e.conjunctions = conj;
    if((m = raw.match(/\b([A-ZÄÖÜ][a-zäöüß]+)\b/)) && DE.indexOf(m[1].toLowerCase())===-1) e.germanWord = m[1];
    return e;
  }
  function understand(question, context){
    var raw = String(question==null?'':question);
    var nq = norm(raw);
    var it = intent(nq);
    return { norm: nq, langs: langs(raw, nq), intent: it[0], entities: entities(raw, nq, context||{}), confidence: it[1] };
  }
  if(typeof window!=='undefined') window.QUST = { understand: understand };
  if(typeof module!=='undefined' && module.exports) module.exports = { understand: understand };
})();
