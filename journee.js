/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — journee.js
   📅 حصص اليوم · الجدول الأسبوعي · السيرة الذاتية en 4 blocs
   Source : assets/bdd/journee.json (maquette officielle du professeur)
   Rendu dans #todayBody (accueil), #cvBody (accueil) et #semaineBody (القسم)
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const SRC = 'assets/bdd/journee.json';
  const K_LUS = 'dz_de_journee_lus_v1';
  let D = null;

  async function charger(){
    if(D) return D;
    const r = await fetch(SRC, { cache:'no-store' });
    if(!r.ok) throw new Error('HTTP ' + r.status);
    D = await r.json();
    return D;
  }

  /* ── Helpers ── */
  function statutChip(s){
    const map = { en_cours:['🔴 جارية الآن','live'], termine:['✅ منتهية','done'],
                  a_venir:['⏳ قادمة','soon'] };
    const v = map[s] || ['—',''];
    return '<span class="jd-st ' + v[1] + '">' + v[0] + '</span>';
  }
  function dansCombien(iso){
    const t = Date.parse(iso);
    if(isNaN(t)) return '';
    const d = t - Date.now();
    if(d <= 0) return '🔴 الآن';
    const h = Math.floor(d / 36e5), m = Math.floor(d % 36e5 / 6e4);
    return h > 0 ? '⏳ بعد ' + h + ' س ' + m + ' د' : '⏳ بعد ' + m + ' د';
  }

  /* ══════ 📅 حصص اليوم ══════ */
  async function renderToday(){
    const box = $('#todayBody'); if(!box) return;
    try{ await charger(); }
    catch(e){ box.innerHTML = '<div class="bdd-status err">❌ ' + esc(e.message) + '</div>'; return; }

    const list = D.aujourdhui || [];
    box.innerHTML =
      '<div class="card jd-hero">' +
        '<div class="jd-h"><div><h2>📅 حصص اليوم</h2>' +
          '<div class="jd-d">' + esc(D._meta.jour_reference) + ' ' +
          esc(fmtDate(D._meta.date_reference)) + ' · ' + esc(D._meta.annee_scolaire) + '</div></div>' +
        '<button class="btn btn-o btn-sm" id="jdSemaine">🗓️ الجدول الكامل</button></div>' +
        '<div class="jd-list">' + list.map(coursCard).join('') + '</div>' +
        '<div class="jd-foot">🇩🇪 <b>' + list.filter(c => c.matiere_principale).length +
          '</b> حصة ألمانية · 📚 <b>' + list.length + '</b> حصص اليوم · ' +
          '⏱️ <b>' + list.reduce((a,c) => a + (c.duree||0), 0) + '</b> دقيقة</div>' +
      '</div>' +
      accesRapide();
  }

  function coursCard(c){
    const principal = c.matiere_principale;
    return '<div class="jd-c' + (principal ? ' principal' : '') + ' ' + esc(c.couleur || '') + '">' +
      '<div class="jd-hr"><span class="jd-hh de-in">' + esc(c.heure) + '</span>' +
      '<span class="jd-ic">' + esc(c.icone) + '</span></div>' +
      '<div class="jd-b">' +
        '<div class="jd-m">' + esc(c.matiere) + (principal ? ' <span class="jd-tag">مادتك</span>' : '') + '</div>' +
        '<div class="jd-l">' + esc(c.lecon) + '</div>' +
        '<div class="jd-meta">🕐 ' + c.duree + ' دقيقة · 🏫 ' + esc(c.salle) +
          ' · 👥 ' + esc(c.section) + '</div>' +
        '<div class="jd-p"><span class="jd-av">' + esc(c.init) + '</span>' + esc(c.prof) + '</div>' +
      '</div>' +
      '<div class="jd-r">' + statutChip(c.statut) +
        (c.statut === 'en_cours' ? '<div class="jd-cd">' + dansCombien(c.heure_iso) + '</div>' : '') +
        '<button class="btn btn-sm ' + (c.statut === 'en_cours' ? 'btn-p' : 'btn-o') +
          '" data-go="' + esc(c.vue) + '">' + esc(c.cta) + '</button>' +
      '</div></div>';
  }

  function accesRapide(){
    const c = D.acces_rapide || [];
    if(!c.length) return '';
    return '<div class="jd-quick">' + c.map(x =>
      '<button class="jd-q ' + esc(x.couleur || '') + '" data-go="' + esc(x.vue) + '">' +
      '<span class="jd-qi">' + esc(x.icone) + '</span>' +
      '<b>' + esc(x.titre) + '</b><i>' + esc(x.sous) + '</i></button>').join('') + '</div>';
  }

  function fmtDate(iso){
    try{
      const d = new Date(iso + 'T12:00:00');
      return d.toLocaleDateString('fr-DZ', { day:'2-digit', month:'long', year:'numeric' });
    }catch(e){ return iso; }
  }

  /* ══════ 🗓️ الجدول الأسبوعي (modale) ══════ */
  function ouvrirSemaine(){
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c || !D) return;
    const sem = D.semaine || [];
    c.innerHTML = '<div class="modal-h"><div>' +
      '<h2 style="margin:0;font-family:var(--ff-ar-display);font-size:20px">🗓️ الجدول الأسبوعي</h2>' +
      '<div class="fiche-de">' + esc(D._meta.annee_scolaire) + ' · قسم ٢AS-٣ · ' +
      sem.length + ' أيام</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' + sem.map(j =>
        '<div class="jd-jour"><div class="jd-jh"><b>' + esc(j.jour) + '</b>' +
          '<span class="de-display">' + esc(j.jour_de) + '</span>' +
          '<span class="jd-jn">' + j.cours.length + ' حصص</span></div>' +
        '<div class="jd-jc">' + j.cours.map(x =>
          '<div class="jd-jr' + (x.examen ? ' examen' : '') + '">' +
          '<span class="jd-jt de-in">' + esc(x.heure) + '</span>' +
          '<span class="jd-ji">' + esc(x.icone) + '</span>' +
          '<span class="jd-jb"><b>' + esc(x.matiere) + '</b><i>' + esc(x.lecon) + '</i>' +
          '<i class="jd-jm">⏱️ ' + x.duree + ' د · 🏫 ' + esc(x.salle) + '</i></span>' +
          (x.examen ? '<span class="chip ex">📝 فرض</span>' : statutChip(x.statut)) +
          '</div>').join('') + '</div></div>').join('') +
      '<div class="privacy" style="margin-top:14px">🔒 ' + esc(D._meta.confidentialite) + '</div>' +
      '</div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
  }

  /* ══════ 📋 السيرة الذاتية en 4 blocs ══════ */
  async function renderCV(){
    const box = $('#cvBody'); if(!box) return;
    try{ await charger(); }
    catch(e){ box.innerHTML = '<div class="bdd-status err">❌ ' + esc(e.message) + '</div>'; return; }
    const cv = D.cv || {};

    box.innerHTML =
      '<div class="card cv-card">' +
        '<div class="cv-head">' +
          '<div class="cv-av">👨‍🏫</div>' +
          '<div class="cv-id"><div class="cv-role">' + esc(cv.bloc_candidature.titre) + '</div>' +
            '<h2>' + esc(cv.nom) + '</h2>' +
            '<div class="cv-de de-display">' + esc(cv.nom_de) + '</div>' +
            '<div class="cv-t">' + esc(cv.titre) + '</div>' +
            '<div class="cv-quote">« ' + esc(cv.devise) + ' »</div>' +
            '<div class="chips" style="margin-top:11px">' +
              (cv.badges || []).map(b => '<span class="sec-pill">' + esc(b) + '</span>').join('') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="cv-blocs">' + (cv.blocs || []).map(b =>
          '<div class="cv-bl"><div class="cv-bi">' + esc(b.icone) + '</div>' +
          '<div><b>' + esc(b.titre) + '</b><ul>' +
          b.lignes.map(l => '<li>' + esc(l) + '</li>').join('') + '</ul></div></div>').join('') +
        '</div>' +
        '<div class="chips cv-tags">' + (cv.tags || []).map(t =>
          '<span class="fchip on">' + esc(t) + '</span>').join('') + '</div>' +
        '<a class="btn btn-w btn-block" target="_blank" rel="noopener" href="' +
          'https://wa.me/213555577931?text=' +
          encodeURIComponent('السلام عليكم أستاذ خريف، أريد الاستفسار عن حصص الألمانية.') + '">' +
          '📱 واتساب: ' + esc(cv.bloc_candidature.whatsapp) + '</a>' +
      '</div>' +

      '<div class="card ia-card">' +
        '<div class="ia-h"><span class="ia-i">' + esc(cv.ia.icone) + '</span>' +
        '<div><b>' + esc(cv.ia.titre) + '</b><i>' + esc(cv.ia.sous) + '</i></div></div>' +
        '<p class="ia-d">' + esc(cv.ia.detail) + '</p>' +
        '<div class="ia-or">' + esc(cv.ia.regle_or) + '</div>' +
        '<button class="btn btn-p btn-block" data-go="prof">💬 ابدأ المحادثة</button>' +
      '</div>' +

      '<div class="card meth">' +
        '<h3>💡 منهجية الأستاذ خريف أحمد في التدريس</h3>' +
        '<div class="meth-g">' + (cv.methodologie || []).map(m =>
          '<div class="meth-i"><span class="mh-n">' + esc(m.n) + '</span>' +
          '<div><b>' + esc(m.titre) + '</b><p>' + esc(m.detail) + '</p></div></div>').join('') +
        '</div>' +
      '</div>' +

      '<div class="card pret">' +
        '<h3>' + esc(cv.pret_a_apprendre.titre) + '</h3>' +
        '<p>' + esc(cv.pret_a_apprendre.sous) + '</p>' +
        '<div class="pret-b">' + (cv.pret_a_apprendre.boutons || []).map(b =>
          '<button class="btn btn-' + esc(b.style) + '" data-go="' + esc(b.vue) + '">' +
          esc(b.label) + '</button>').join('') + '</div>' +
      '</div>' +

      '<div class="card cit-card">' +
        '<div class="cit-ar">« ' + esc(cv.citation_ar) + ' »</div>' +
        '<div class="cit-de de-display">„' + esc(cv.citation_de) + '“</div>' +
        '<div class="cit-tr">' + esc(cv.citation_de_ar) + '</div>' +
        '<div class="cit-ctx">🇩🇪 ' + esc(cv.citation_contexte) + '</div>' +
      '</div>';
  }

  /* ══════ Aperçu de l'unité 1 (accueil) ══════ */
  async function renderApercu(){
    const box = $('#apercuBody'); if(!box) return;
    try{ await charger(); }catch(e){ return; }
    const u = D.unite1_apercu; if(!u) return;
    box.innerHTML = '<div class="card ap-card">' +
      '<div class="ap-h"><div><div class="ap-prog">' + esc(u.programme) + '</div>' +
        '<h2>📘 ' + esc(u.titre) + '</h2>' +
        '<div class="ap-n">' + esc(u.niveau) + '</div></div>' +
      '<div class="ap-stats">' + (u.stats || []).map(s =>
        '<div class="ap-s"><span>' + esc(s.icone) + '</span><b>' + esc(s.v) + '</b>' +
        '<i>' + esc(s.l) + '</i></div>').join('') + '</div></div>' +
      '<div class="ap-grid">' +
        '<div class="ap-b"><h3>🎯 أهداف التعلم</h3><ul class="ap-ul">' +
          (u.objectifs || []).map(o => '<li>✓ ' + esc(o) + '</li>').join('') + '</ul></div>' +
        '<div class="ap-b"><h3>📋 محتوى الفرض</h3><ul class="ap-ul">' +
          (u.contenu_devoir || []).map(o => '<li>' + esc(o) + '</li>').join('') +
          '<li>⏱️ المدة: ' + u.duree_devoir + ' دقيقة</li></ul></div>' +
      '</div>' +
      '<div class="ap-cta">' + (u.cta || []).map(c =>
        '<button class="btn btn-p" data-go="' + esc(c.vue) + '">' + esc(c.label) + '</button>').join('') +
      '</div></div>';
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    if(ev.target.closest('#jdSemaine')){ ouvrirSemaine(); return; }
    const j = ev.target.closest('.jd-jour');
    if(j && ev.target.closest('#mClose')){ /* fermeture gérée par app.js */ }
  });

  document.addEventListener('dz:view', async e => {
    if(e.detail === 'accueil'){ await renderToday(); await renderCV(); await renderApercu(); }
    if(e.detail === 'classe'){ await renderToday(); }
  });

  window.renderJournee = renderToday;
  window.renderCV = renderCV;
  window.renderApercu = renderApercu;
  window.DZ_JOURNEE = { renderToday:renderToday, renderCV:renderCV, renderApercu:renderApercu,
                        ouvrirSemaine:ouvrirSemaine, charger:charger };
})();
