/* ecoute.js — 🎙️ mode voix : l'élève appuie, parle ALLEMAND, la plateforme écoute,
   comprend (RAG), répond à l'écran ET à voix haute (voix allemande de-DE) */
'use strict';
(function(){
  let rec = null, on = false;
  function panel(){
    let p = document.getElementById('ecPanel');
    if(!p){
      p = document.createElement('div');
      p.id = 'ecPanel'; p.className = 'ec-panel'; p.hidden = true;
      document.body.appendChild(p);
    }
    return p;
  }
  function speak(txt){
    if(window.VOIX && VOIX.parler){ try{ VOIX.parler(txt, 'de-DE'); return; }catch(e){} }
    try{
      const u = new SpeechSynthesisUtterance(txt);
      u.lang = 'de-DE'; u.rate = 0.95;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function toggle(){
    const p = panel();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ p.hidden = false;
      p.innerHTML = '⚠️ Ton navigateur ne supporte pas l’écoute. Utilise Chrome.'; return; }
    if(on){ on = false; try{ rec.stop(); }catch(e){} p.hidden = true; return; }
    on = true; p.hidden = false;
    p.innerHTML = '🎧 Ich höre zu… sprich Deutsch !';
    rec = new SR();
    rec.lang = 'de-DE'; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = async ev => {
      const q = ev.results[0][0].transcript;
      p.innerHTML = '🗣️ « ' + q + ' »<br>⏳ …';
      let rep = '';
      const fn = window.reponseIA || window.reponsePedagogique || (window.RAG && RAG.reponsePedagogique);
      if(typeof fn === 'function'){ try{ rep = await fn(q); }catch(e){} }
      if(rep && typeof rep === 'object') rep = rep.texte || rep.reponse || '';
      rep = String(rep || 'Das weiss ich leider nicht. Frag es anders.');
      p.innerHTML = '🗣️ « ' + q + ' »<br>🤖 ' + rep.slice(0, 700)
        + '<br><button class="btn btn-o btn-sm" id="ecRe">🔊 noch einmal hören</button>';
      speak(rep);
      const rb = document.getElementById('ecRe');
      if(rb) rb.addEventListener('click', () => speak(rep));
      on = false;
    };
    rec.onerror = () => { on = false;
      p.innerHTML = '⚠️ Ich habe nichts gehört. Noch einmal versuchen.';
      setTimeout(() => { p.hidden = true; }, 2600); };
    rec.onend = () => { on = false; };
    rec.start();
  }
  function btn(){
    if(document.getElementById('ecouteBtn')) return;
    const b = document.createElement('button');
    b.id = 'ecouteBtn'; b.className = 'ec-btn';
    b.title = 'Appuie et parle allemand : la plateforme écoute et répond à voix haute';
    b.innerHTML = '🎙️';
    b.addEventListener('click', toggle);
    document.body.appendChild(b);
  }
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', btn);
  else btn();
})();
