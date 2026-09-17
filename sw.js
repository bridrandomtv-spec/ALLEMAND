/* ══════════════════════════════════════════════════════════════
   برنامج الأصل — sw.js · Service Worker
   Stratégie : cache d'abord (offline), réseau en secours
   Prof. Kharif Ahmed · v1.0.0
   ══════════════════════════════════════════════════════════════ */
'use strict';

const VERSION = 'dz-de-v3.6.0';
const CACHE_STATIC = VERSION + '-static';
const CACHE_ASSETS = VERSION + '-assets';

/* Fichiers essentiels mis en cache dès l'installation */
const PRECACHE = [
  './',
  './index.html',
  './style.css',
  './auth.js',
  './bdd.js',
  './unite2.js',
  './unite3.js',
  './unite4.js',
  './unite5.js',
  './unite6.js',
  './unites3as_a.js',
  './unite10.js',
  './unite11.js',
  './unite12.js',
  './unite13.js',
  './unite14.js',
  './unite15.js',
  './unite16.js',
  './app.js',
  './modules.js',
  './live.js',
  './classe.js',
  './grammaire.js',
  './stats.js',
  './quiz.js',
  './projet.js',
  './journee.js',
  './library.js',
  './examen.js',
  './officiels.js',
  './prof.js',
  './parents.js',
  './manifest.json',
  './404.html',
  './assets/corriges.json',
  './assets/prof.jpg',
  './assets/logo.png'
];

/* Base de données : 684 fiches, chargées en arrière-plan après l'installation */
const BDD_FILES = [
  './assets/bdd/referentiel.json',
  './assets/bdd/devoirs.json',
  './assets/bdd/compositions.json',
  './assets/bdd/bac.json',
  './assets/bdd/annales.json',
  './assets/bdd/grammaire.json',
  './assets/bdd/classe.json',
  './assets/bdd/eleves.json',
  './assets/bdd/bac_archive.json',
  './assets/bdd/parents.json',
  './assets/bdd/devoirs_officiels.json',
  './assets/bdd/wilayas_geo.json',
  './assets/bdd/plan_projet.json',
  './assets/bdd/journee.json',
  './assets/bdd/live.json'
];

/* Polices CDN (optionnel — échec toléré hors-ligne) */
const CDN = [
  'https://cdn.jsdelivr.net/fontsource/css/cairo@latest/arabic-400-normal.css',
  'https://cdn.jsdelivr.net/fontsource/css/cairo@latest/arabic-700-normal.css',
  'https://cdn.jsdelivr.net/fontsource/css/inter@latest/latin-400-normal.css',
  'https://cdn.jsdelivr.net/fontsource/css/inter@latest/latin-700-normal.css'
];

/* ── INSTALLATION ── */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_STATIC);
    /* On tolère les fichiers manquants (logo.png peut ne pas exister encore) */
    await Promise.all(PRECACHE.map(url =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
    ));
    const cdnCache = await caches.open(CACHE_ASSETS);
    await Promise.all(CDN.map(url =>
      cdnCache.add(new Request(url, { mode: 'no-cors' })).catch(() => null)
    ));
    await self.skipWaiting();
    /* Pré-téléchargement différé de la base de données (684 fiches) */
    setTimeout(() => {
      caches.open(CACHE_ASSETS).then(c => {
        BDD_FILES.forEach(u => c.add(new Request(u, { cache: 'reload' })).catch(() => null));
      });
    }, 4000);
  })());
});

/* ── ACTIVATION : purge des anciennes versions ── */
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.indexOf(VERSION) !== 0)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* ── REQUÊTES ── */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* 1) Navigation (pages HTML) → réseau d'abord, cache en secours */
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_STATIC);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
      } catch (e) {
        const hit = await caches.match('./index.html');
        if (hit) return hit;
        return new Response(
          '<!DOCTYPE html><html lang="ar" dir="rtl"><meta charset="utf-8">' +
          '<title>برنامج الأصل — hors ligne</title>' +
          '<body style="font-family:system-ui;background:#0b1020;color:#e8edf8;' +
          'display:flex;align-items:center;justify-content:center;height:100vh;margin:0;' +
          'text-align:center;padding:24px"><div>' +
          '<div style="font-size:56px">📴</div>' +
          '<h1 style="font-size:20px">وضع عدم الاتصال</h1>' +
          '<p style="color:#8fa0c2;font-size:14px;line-height:1.7">' +
          'المنصة لم تُحمَّل بعد في الذاكرة المحلية.<br>' +
          'اتصل بالأنترنت مرة واحدة ثم ستعمل بدون أنترنت.</p>' +
          '</div></body></html>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }
    })());
    return;
  }

  /* 2) CDN (polices) → cache d'abord */
  if (url.origin !== self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE_ASSETS);
        c.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch (e) {
        return new Response('', { status: 504 });
      }
    })());
    return;
  }

  /* 3) Ressources locales → cache d'abord, mise à jour en arrière-plan */
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const c = caches.open(CACHE_STATIC);
        c.then(cc => cc.put(req, res.clone())).catch(() => {});
      }
      return res;
    }).catch(() => null);

    if (cached) return cached;
    const fresh = await network;
    if (fresh) return fresh;

    /* Image manquante hors-ligne → pixel transparent */
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(url.pathname)) {
      return new Response(
        'data:image/svg+xml;base64,' +
        btoa('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'),
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return new Response('📴 hors ligne', { status: 504, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});

/* ── MESSAGES (mise à jour forcée depuis la page) ── */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});
