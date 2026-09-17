/* ══════════════════════════════════════════════════════════════
   LinguaConnect — projet.js
   📋 Plan de projet · Dossier de présentation officiel
   13 sections numérotées · navigation collante · graphiques de revenus
   comparaison concurrentielle · obstacles/solutions · roadmap 30 jours
   Impression PDF optimisée (@media print) · export WhatsApp
   Source : assets/bdd/plan_projet.json
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const SRC = 'assets/bdd/plan_projet.json';
  const WA  = '213555577931';
  const MOIS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];

  let D = null;
  let actif = 'contexte';

  async function boot(){
    const box = $('#projetBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل plan de projet…</div>';
      try{
        const r = await fetch(SRC, { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر التحميل : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
    observer();
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#projetBody'); if(!box) return;
    const m = D._meta;
    box.innerHTML =
      hero(m) + nav() +
      '<div class="pj-doc" id="pjDoc">' +
        secContexte() + secProbleme() + secSolution() + secPublic() +
        secProgramme() + secFonctionnalites() + secObstacles() + secTarifs() +
        secMarche() + secConcurrence() + secRevenus() + secEquipe() + secRoadmap() +
      '</div>' +
      pied();
  }

  function hero(m){
    return '<div class="card pj-hero">' +
      '<div class="pj-badges">' + (m.badges||[]).map(b =>
        '<span class="pj-badge">' + esc(b.icon) + ' ' + esc(b.label) + '</span>').join('') + '</div>' +
      '<div class="pj-logo">D</div>' +
      '<h1>' + esc(m.titre.split(' — ')[0]) + '</h1>' +
      '<div class="pj-st de-display">' + esc(m.sous_titre) + '</div>' +
      '<div class="pj-sub">' + esc(m.date) + ' · ' + esc(m.statut) + '</div>' +
      '<div class="pj-cta">' +
        '<button class="btn btn-p" id="pjPrint">📄 Télécharger le PDF</button>' +
        '<a class="btn btn-w" target="_blank" rel="noopener" href="' + waLink(
          'السلام عليكم أستاذ خريف، اطلعت على plan de projet LinguaConnect وأريد مناقشته.') +
        '">💬 Discuter du projet</a>' +
        '<a class="btn btn-o" target="_blank" rel="noopener" href="' + esc(m.contact.site) +
        '">🌐 Voir la plateforme</a>' +
      '</div>' +
      '<div class="pj-conf">🔒 ' + esc(m.confidentialite) + '</div>' +
      '</div>';
  }

  function nav(){
    const secs = [
      ['contexte','Contexte'],['probleme','Problème'],['solution','Solution'],
      ['public','Public cible'],['programme','Programme'],['fonctionnalites','Fonctionnalités'],
      ['obstacles','Obstacles'],['tarifs','Tarifs'],['marche','Marché'],
      ['concurrence','Concurrence'],['revenus','Revenus'],['equipe','Équipe'],['roadmap','Roadmap']
    ];
    return '<nav class="pj-nav" id="pjNav">' + secs.map(s =>
      '<a class="pj-n' + (actif===s[0]?' on':'') + '" href="#sec-' + s[0] + '" data-sec="' + s[0] + '">' +
      esc(s[1]) + '</a>').join('') +
      '<button class="pj-n pj-print" id="pjPrint2">🖨️ Imprimer</button></nav>';
  }

  function ent(s, extra){
    return '<section class="pj-sec" id="sec-' + s.id + '">' +
      '<div class="pj-h"><span class="pj-num">' + esc(s.num) + '</span>' +
      '<div><h2>' + esc(s.icon) + ' ' + esc(s.titre) + '</h2>' +
      (s.sous_titre ? '<div class="pj-hs">' + esc(s.sous_titre) + '</div>' : '') +
      '</div>' + (extra || '') + '</div>';
  }
  function fin(){ return '</section>'; }

  function secContexte(){
    const s = D.contexte;
    return ent(s) + '<p class="pj-p">' + esc(s.texte) + '</p>' +
      '<div class="pj-chiffres">' + s.chiffres.map(c =>
        '<div class="pj-c"><div class="pj-ci">' + esc(c.i) + '</div>' +
        '<div class="pj-cv">' + esc(c.v) + '</div><div class="pj-cl">' + esc(c.l) + '</div></div>').join('') +
      '</div>' + fin();
  }

  function secProbleme(){
    const s = D.probleme;
    return ent(s) + '<p class="pj-p">' + esc(s.texte) + '</p>' +
      '<ul class="pj-list ko">' + s.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
      fin();
  }

  function secSolution(){
    const s = D.solution;
    return ent(s) + '<p class="pj-p">' + esc(s.texte) + '</p>' +
      '<div class="pj-piliers">' + s.piliers.map(p =>
        '<div class="pj-pil"><div class="pj-pi">' + esc(p.icon) + '</div>' +
        '<div><b>' + esc(p.t) + '</b><p>' + esc(p.d) + '</p></div></div>').join('') + '</div>' + fin();
  }

  function secPublic(){
    const s = D.public;
    return ent(s) + '<div class="pj-seg">' + s.segments.map(g =>
      '<div class="pj-sg"><div class="pj-sgi">' + esc(g.icon) + '</div>' +
      '<div class="pj-sgb"><b>' + esc(g.t) + '</b><span class="pj-sgn">' + esc(g.n) + '</span>' +
      '<p>' + esc(g.d) + '</p></div></div>').join('') + '</div>' + fin();
  }

  function secProgramme(){
    const s = D.programme;
    return ent(s) + '<div class="pj-annees">' + s.annees.map(a =>
      '<div class="pj-an' + (a.statut.indexOf('✅') === 0 ? ' ok' : '') + '">' +
      '<div class="pj-anh"><b>' + esc(a.niveau) + '</b><span class="chip ' +
        (a.statut.indexOf('✅') === 0 ? 'ok' : '') + '">' + esc(a.statut) + '</span></div>' +
      '<div class="pj-ank">' +
        '<span>📖 ' + a.unites + ' unités</span><span>📚 ' + a.seances + ' séances</span>' +
        '<span>📝 ' + a.devoirs + ' devoirs</span></div>' +
      '<div class="pj-and">' + esc(a.detail) + '</div></div>').join('') + '</div>' +
      '<h3>📦 Ressources livrées</h3>' +
      '<div class="pj-res">' + s.ressources.map(r =>
        '<div class="pj-r"><span class="pj-ri">' + esc(r.i) + '</span>' +
        '<b>' + esc(r.v) + '</b><i>' + esc(r.l) + '</i></div>').join('') + '</div>' + fin();
  }

  function secFonctionnalites(){
    const s = D.fonctionnalites;
    return ent(s, '<div class="pj-tags">' +
        '<span class="sec-pill">🖥️ ' + s.vues + ' vues</span>' +
        '<span class="sec-pill or">🔖 ' + s.onglets + ' onglets</span>' +
        '<span class="sec-pill rg">📜 ' + s.scripts + ' scripts</span>' +
        '<span class="sec-pill">📁 ' + s.fichiers + ' fichiers</span>' +
        '<span class="sec-pill or">💾 ' + s.taille_mo + ' Mo</span></div>') +
      '<div class="pj-vues">' + s.liste.map(v =>
        '<div class="pj-vue"><span class="pj-vi">' + esc(v.v) + '</span>' +
        '<div><b>' + esc(v.t) + '</b><p>' + esc(v.d) + '</p></div></div>').join('') + '</div>' + fin();
  }

  function secObstacles(){
    const s = D.obstacles;
    return ent(s) + '<div class="pj-obs">' + s.items.map(o =>
      '<div class="pj-ob"><div class="pj-obh"><span class="pj-obi">' + esc(o.icon) + '</span>' +
      '<b>' + esc(o.t) + '</b></div>' +
      '<p class="pj-obd">' + esc(o.d) + '</p>' +
      '<div class="pj-sol"><span class="pj-solt">✅ Solution</span><ul>' +
        o.sol.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>').join('') + '</div>' + fin();
  }

  function secTarifs(){
    const s = D.tarifs;
    return ent(s) + '<div class="pj-tarifs">' + s.offres.map(o =>
      '<div class="pj-tar' + (o.populaire ? ' pop' : '') + '">' +
      (o.populaire ? '<span class="pj-tarb">⭐ Le plus choisi</span>' : '') +
      '<div class="pj-tart">' + esc(o.t) + '</div>' +
      '<div class="pj-tarp">' + esc(o.prix) + '</div>' +
      '<div class="pj-tard">' + esc(o.duree) + '</div>' +
      '<ul class="pj-taru">' + o.inclus.map(x => '<li>✓ ' + esc(x) + '</li>').join('') + '</ul>' +
      '<a class="btn ' + (o.populaire ? 'btn-g' : 'btn-o') + ' btn-block" target="_blank" ' +
      'rel="noopener" href="' + waLink('السلام عليكم، أريد الاشتراك في عرض : ' + o.t) +
      '">📲 اشترك</a></div>').join('') + '</div>' +
      '<div class="pj-cmp"><div class="pj-cmpi"><b>💸 السوق الحالي</b><span>' +
        esc(s.comparaison.marche) + '</span></div>' +
      '<div class="pj-cmpi ok"><b>🇩🇿 LinguaConnect</b><span>' + esc(s.comparaison.nous) +
        '</span></div><div class="pj-cmpi hi"><b>📉 الاقتصاد</b><span>' +
        esc(s.comparaison.economie) + '</span></div></div>' +
      '<div class="pj-pay">💳 وسائل الدفع : ' + s.paiement.map(p =>
        '<span class="chip">' + esc(p) + '</span>').join(' ') + '</div>' + fin();
  }

  function secMarche(){
    const s = D.marche;
    return ent(s) + '<div class="pj-opp">' + s.items.map(o =>
      '<div class="pj-op"><span class="pj-oi">' + esc(o.icon) + '</span>' +
      '<b>' + esc(o.t) + '</b><p>' + esc(o.d) + '</p></div>').join('') + '</div>' +
      '<h3>🇩🇿 🇩🇪 Un projet à fort impact</h3>' +
      '<div class="pj-imp">' + s.impact.map(i =>
        '<div class="pj-im"><span>' + esc(i.icon) + '</span><b>' + esc(i.t) + '</b>' +
        '<p>' + esc(i.d) + '</p></div>').join('') + '</div>' + fin();
  }

  function secConcurrence(){
    const s = D.concurrence;
    return ent(s) + '<table class="bareme pj-tab"><tr><th>Plateforme</th><th>Pays</th>' +
      '<th>Modèle</th></tr>' + s.table.map(c =>
        '<tr><td><b>' + esc(c.nom) + '</b></td><td>' + esc(c.pays) + '</td>' +
        '<td>' + esc(c.modele) + '</td></tr>').join('') + '</table>' +
      '<h3>📊 Comparaison détaillée</h3>' +
      '<div class="pj-wrap"><table class="bareme pj-cmp2"><tr><th>Critère</th>' +
        s.comparaison.colonnes.map((c,i) => '<th' + (i===2?' class="nous"':'') + '>' +
          esc(c) + '</th>').join('') + '</tr>' +
        s.comparaison.lignes.map(l => '<tr><td style="text-align:right">' + esc(l.critere) + '</td>' +
          l.v.map((v,i) => '<td' + (i===2?' class="nous"':'') + '>' + esc(v) + '</td>').join('') +
          '</tr>').join('') + '</table></div>' +
      '<div class="pj-av">💡 ' + esc(s.avantage) + '</div>' + fin();
  }

  function secRevenus(){
    const s = D.revenus;
    const maxCa = 540;
    const maxM = Math.max.apply(null, s.mensuel_annee1);
    return ent(s) + '<div class="pj-rev">' + s.annees.map(a =>
      '<div class="pj-rv"><div class="pj-rva">' + esc(a.a) + '</div>' +
      '<div class="pj-rvn">' + a.eleves.toLocaleString('fr-FR') + '</div>' +
      '<div class="pj-rvl">élèves</div>' +
      '<div class="pj-rvc">' + esc(a.ca_da) + '</div>' +
      '<div class="pj-rvu">' + esc(a.ca_usd) + '</div></div>').join('') + '</div>' +
      '<h3>📊 Évolution mensuelle du CA (Année 1, en M DA)</h3>' +
      '<div class="pj-chart">' + s.mensuel_annee1.map((v,i) =>
        '<div class="pjc"><span class="pjc-v">' + v.toFixed(1) + '</span>' +
        '<span class="pjc-b"><i style="height:' + Math.round(v/maxM*100) + '%"></i></span>' +
        '<span class="pjc-l">' + MOIS[i] + '</span></div>').join('') + '</div>' +
      '<div class="pj-hyp">🧮 ' + esc(s.hypothese) + '</div>' + fin();
  }

  function secEquipe(){
    const s = D.equipe;
    return ent(s) + '<div class="pj-eq">' + s.membres.map(mb =>
      '<div class="pj-em"><span class="pj-emi">' + esc(mb.icon) + '</span>' +
      '<div><b>' + esc(mb.t) + '</b><span class="pj-emn">' + esc(mb.n) + '</span>' +
      '<p>' + esc(mb.d) + '</p></div></div>').join('') + '</div>' + fin();
  }

  function secRoadmap(){
    const s = D.roadmap;
    return ent(s) + '<div class="pj-rm">' + s.etapes.map(e =>
      '<div class="pj-rmi"><span class="pj-rmn">' + e.n + '</span>' +
      '<div><div class="pj-rmq">' + esc(e.q) + '</div><b>' + esc(e.t) + '</b>' +
      '<p>' + esc(e.d) + '</p></div></div>').join('') + '</div>' +
      '<h3>🔎 Vérifications avant d’utiliser le nom « LinguaConnect »</h3>' +
      '<div class="pj-ver">' + s.verifications.map(v =>
        '<div class="pj-ve"><b>' + esc(v.t) + '</b><p>' + esc(v.d) + '</p></div>').join('') +
      '</div>' + fin();
  }

  function pied(){
    const m = D._meta;
    return '<div class="card pj-pied">' +
      '<div class="pj-pl">D</div>' +
      '<div><b>' + esc(m.titre.split(' — ')[0]) + '</b>' +
      '<div class="pj-ps">Plan de projet — ' + esc(m.date) + '</div>' +
      '<div class="pj-ps">' + esc(m.confidentialite) + '</div></div>' +
      '<div class="pj-pr"><div>📱 ' + esc(m.contact.whatsapp_affiche) + '</div>' +
      '<div>✉️ ' + esc(m.contact.email) + '</div>' +
      '<div>🌐 ' + esc(m.contact.site.replace('https://','')) + '</div></div>' +
      '</div>';
  }

  function waLink(txt){
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
  }

  /* ── Navigation collante : surlignage de la section visible ── */
  let obs = null;
  function observer(){
    if(obs) obs.disconnect();
    if(!('IntersectionObserver' in window)) return;
    obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if(e.isIntersecting){
          const id = e.target.id.replace('sec-', '');
          if(id === actif) return;
          actif = id;
          $$('.pj-n[data-sec]').forEach(a => a.classList.toggle('on', a.dataset.sec === id));
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    $$('[id^="sec-"]').forEach(s => obs.observe(s));
  }

  /* ── Événements ── */
  document.addEventListener('click', ev => {
    if(ev.target.closest('#pjPrint, #pjPrint2')){ window.print(); return; }
    const a = ev.target.closest('.pj-n[data-sec]');
    if(a){
      actif = a.dataset.sec;
      $$('.pj-n[data-sec]').forEach(x => x.classList.toggle('on', x === a));
      const t = document.getElementById('sec-' + a.dataset.sec);
      if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
      ev.preventDefault();
      return;
    }
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'projet') boot(); });
  window.renderProjet = boot;
  window.DZ_PROJET = { boot:boot, render:render };
})();
