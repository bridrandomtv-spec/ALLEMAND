/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — voix.js
   🎙️ الصوت : المنصة تسمع سؤالك وتتكلّم بالجواب
   · 🎤  = إملاء بالسؤال (allemand)   · 🗣 = إملاء بالعربية
   · 🔊  = نطق الجواب (de-DE أو ar حسب لغة النص)
   · يعمل على 🔎 اسأل المنصة (RAG) و 🤖 الأستاذ (chat)
   · تقنيات المتصفح فقط (SpeechRecognition + speechSynthesis) — بلا خادم
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $ = (s,c) => (c||document).querySelector(s);

  function SR(){ return window.SpeechRecognition || window.webkitSpeechRecognition || null; }
  function ttsDispo(){ return ('speechSynthesis' in window); }

  function langueDe(t){
    return /[\u0600-\u06FF]/.test(String(t||'')) ? 'ar-DZ' : 'de-DE';
  }

  /* ── نطق نص ── */
  function parler(texte, lang){
    if(!ttsDispo()) return false;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(texte));
      u.lang = lang || langueDe(texte);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
      return true;
    }catch(e){ return false; }
  }

  /* ── إملاء صوتي ── */
  function ecouter(lang, onTexte, onErr){
    const C = SR();
    if(!C){ if(onErr) onErr('non supporté'); return null; }
    try{
      const r = new C();
      r.lang = lang; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = ev => {
        const t = ev.results[0][0].transcript;
        if(onTexte) onTexte(t);
      };
      r.onerror = ev => { if(onErr) onErr(ev.error); };
      r.start();
      return r;
    }catch(e){ if(onErr) onErr('start'); return null; }
  }

  /* ── boutons micro injectés dans un formulaire ── */
  function greffeMicros(form, inputSel){
    if(!form || form.dataset.voz === '1') return;
    form.dataset.voz = '1';
    const wrap = document.createElement('span');
    wrap.className = 'voz-mics';
    wrap.innerHTML =
        '<button type="button" class="voz-btn" data-l="de-DE" title="أمْلِ بالألمانية">🎤</button>'
      + '<button type="button" class="voz-btn" data-l="ar-DZ" title="أمْلِ بالعربية">🗣</button>';
    form.insertBefore(wrap, form.firstChild);
    wrap.querySelectorAll('.voz-btn').forEach(b => {
      b.addEventListener('click', () => {
        const inp = $(inputSel, form) || $(inputSel);
        if(!inp) return;
        b.classList.add('on');
        ecouter(b.dataset.l,
          t => { b.classList.remove('on'); inp.value = t;
                 if(form.requestSubmit) form.requestSubmit();
                 else form.dispatchEvent(new Event('submit', {cancelable:true})); },
          () => b.classList.remove('on'));
      });
    });
  }

  /* ── bouton 🔊 sur un conteneur de réponse ── */
  function greffeHautParleur(host, selecteurTexte){
    if(!host || host.dataset.vozs === '1') return;
    host.dataset.vozs = '1';
    host.addEventListener('click', ev => {
      const btn = ev.target.closest('.voz-speak');
      if(btn){
        const zone = btn.closest(selecteurTexte) || host;
        const txt = (zone.querySelector('.rag-x, .msg-txt, .voz-src') || zone).textContent;
        parler(txt);
      }
    });
  }

  /* ajoute 🔊 à chaque nouvelle réponse */
  function observeReponses(conteneur, selecteurReponse){
    if(!conteneur || conteneur.dataset.vozo === '1') return;
    conteneur.dataset.vozo = '1';
    const mo = new MutationObserver(() => {
      conteneur.querySelectorAll(selecteurReponse).forEach(r => {
        if(r.querySelector('.voz-speak')) return;
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'voz-speak'; b.textContent = '🔊';
        b.title = 'انطق الجواب';
        r.appendChild(b);
      });
    });
    mo.observe(conteneur, { childList: true, subtree: true });
  }

  function branche(){
    /* 🔎 RAG */
    const rf = $('#ragForm');
    if(rf){
      greffeMicros(rf, '#ragQ');
      const out = $('#ragOut');
      if(out){ observeReponses(out, '.rg-ok'); greffeHautParleur(out, '.rg-ok'); }
    }
    /* 🤖 chat */
    const cf = $('#chatForm');
    if(cf){
      greffeMicros(cf, '#chatInput');
      const log = $('#chatLog');
      if(log){ observeReponses(log, '.msg.bot'); greffeHautParleur(log, '.msg.bot'); }
    }
  }

  window.VOIX = { parler: parler, ecouter: ecouter, dispo: () => !!SR(), tts: ttsDispo };
  document.addEventListener('dz:view', () => setTimeout(branche, 120));
  document.addEventListener('DOMContentLoaded', () => setTimeout(branche, 300));
})();
