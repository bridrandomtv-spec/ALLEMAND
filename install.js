/* install.js — 📲 installation 1-clic de la plateforme comme VRAIE application
   (PWA : icône sur l'écran d'accueil, plein écran, hors-ligne, sans magasin) */
'use strict';
(function(){
  let deferred = null;
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || '');
  function button(){
    if(document.getElementById('instBtn') || isStandalone()) return;
    const b = document.createElement('button');
    b.id = 'instBtn'; b.className = 'inst-btn';
    b.innerHTML = '📲'; b.title = 'Installer l’application';
    b.addEventListener('click', async () => {
      if(deferred){
        deferred.prompt();
        const ch = await deferred.userChoice;
        if(ch.outcome === 'accepted') b.remove();
        deferred = null;
        return;
      }
      const p = document.createElement('div');
      p.className = 'inst-pop';
      p.innerHTML = isIOS()
        ? '<b>iPhone / iPad (Safari)</b><br>1. touche <b>Partager</b> (carré avec flèche)<br>'
          + '2. « Sur l’écran d’accueil »<br>3. « Ajouter » → l’app apparaît comme une vraie app'
        : '<b>Android / PC (Chrome, Edge)</b><br>1. menu ⋮ du navigateur<br>'
          + '2. « Installer l’application » / « Ajouter à l’écran d’accueil »<br>'
          + '3. confirme → icône + plein écran + hors-ligne';
      const x = document.createElement('button');
      x.textContent = '✖';
      x.className = 'inst-x';
      x.addEventListener('click', () => p.remove());
      p.appendChild(x);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 9000);
    });
    document.body.appendChild(b);
  }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    button();
  });
  window.addEventListener('appinstalled', () => {
    const b = document.getElementById('instBtn');
    if(b) b.remove();
  });
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => { if(isIOS()) button(); });
  else if(isIOS()) button();
})();
