/* Normalisation commune du texte élève — Lot 623. */
(function(root){
  'use strict';
  var WORDS={wach:'واش',wesh:'واش',wash:'واش',wech:'واش',chno:'شنو',shno:'شنو',chnou:'شنو',kifach:'كيفاش',kifech:'كيفاش',kifesh:'كيفاش','3lach':'علاش','3tini':'عطيني',ma3na:'معنى',m3na:'معنى',fhemt:'فهمت',fhamt:'فهمت',fhemtch:'فهمتش',mafhemtch:'مافهمتش',nheb:'نحب',n7eb:'نحب',hab:'حاب',rani:'راني',bezaf:'بزاف',bzaaf:'بزاف',dorka:'درك',dork:'درك',kayn:'كاين',makanch:'ماكانش',win:'وين',wina:'وين','3la':'على',byn:'بين',bin:'بين',nsta3mel:'نستعمل',nst3ml:'نستعمل','3andi':'عندي',had:'هاد',hadi:'هادي',saha:'صحا',s7a:'صحا'};
  function normalize(v){return String(v==null?'':v).normalize('NFKC').toLowerCase().replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/[،؛؟۔٪٫٬]/g,' ').replace(/[^a-z0-9\u00C0-\u024F\u0621-\u064A\u066E-\u06D3\u06FA-\u06FC\u0750-\u077F\u08A0-\u08FF]+/gi,' ').replace(/\s+/g,' ').trim();}
  function tokens(v){return normalize(v).split(' ').filter(Boolean);}
  function arabiziToArabic(v){return tokens(v).map(function(t){if(WORDS[t])return WORDS[t];if(!/[a-z]/i.test(t)||!/[3579]/.test(t))return t;return t.replace(/3/g,'ع').replace(/7/g,'ح').replace(/5/g,'خ').replace(/9/g,'ق').replace(/2/g,'ء');}).join(' ');}
  function withArabizi(v){return normalize(normalize(v)+' '+arabiziToArabic(v));}
  function isArabizi(v){return /[a-z]/i.test(String(v||''))&&/[3579]/.test(String(v||''));}
  root.DZ_TEXT=Object.freeze({normalize:normalize,tokens:tokens,arabiziToArabic:arabiziToArabic,withArabizi:withArabizi,isArabizi:isArabizi});
  if(typeof module!=='undefined'&&module.exports)module.exports=root.DZ_TEXT;
})(typeof window!=='undefined'?window:globalThis);