/* billing.js — 💳 abonnements (1800/9000/15000 DA) + 📢 sponsoring + bannières pubs */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const FALLBACK = { titulaire:'KHARIF AHMED', ccp:'0000000000 CLE 00',
    baridimob:'0000000000000000',
    plans:[{id:'m1',label:'1 mois',prix:1800,par_mois:1800},
           {id:'m6',label:'6 mois',prix:9000,par_mois:1500,eco:'-17%'},
           {id:'m12',label:'1 an',prix:15000,par_mois:1250,eco:'-30%'}] };
  let CFG = null;
  async function cfg(){
    if(CFG) return CFG;
    try{ const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
         CFG = (r.ok ? await r.json() : {}).paiement || FALLBACK; }catch(e){ CFG = FALLBACK; }
    return CFG;
  }
  const MOIS = { m1:1, m6:6, m12:12 };

  async function renderAbonne(){
    const box = $('#abonneBody'); if(!box) return;
    if(!window.SB){ box.innerHTML = '<div class="bl-load">⏳ client cloud…</div>';
      document.addEventListener('dz:sbready', () => renderAbonne(), { once:true }); return; }
    const u = await window.SB.me();
    const c = await cfg();
    const notice = u ? '' :
        '<div class="card bl-wait"><b>☁️ connexion cloud requise pour ENREGISTRER ta demande</b>'
      + '<p>Les offres et coordonnées bancaires ci-dessous sont consultables librement. '
      + 'Pour générer ta référence DZ-… et suivre ton reçu, connecte-toi d’abord dans ☁️ Cloud.</p>'
      + '<button class="btn btn-p btn-sm" data-go="cloud">☁️ ouvrir Cloud</button></div>';
    const subs = await window.SB.mySubs();
    const act = (subs.rows || []).filter(s => s.statut === 'actif')[0];
    const att = (subs.rows || []).filter(s => s.statut === 'en_attente' || s.statut === 'preuve')[0];
    let h = notice + '<div class="bl-hero"><span class="bl-crest">💳</span><div>'
      + '<h2>Abonnement Premium</h2><p class="bl-sub">soutiens la plateforme et débloque '
      + 'le suivi complet · paiement CCP / BaridiMob · validation par l’administrateur</p></div></div>';
    if(act){
      h += '<div class="card bl-ok">⭐ <b>abonniert</b> — Plan ' + esc(act.plan)
        + ' · läuft ab am ' + esc((act.fin || '').slice(0, 10)) + '</div>';
    }
    if(att){
      h += '<div class="card bl-wait"><b>⏳ laufende Anfrage</b> — Ref. ' + esc(att.ref)
        + ' · Status ' + esc(att.statut) + '<br>'
        + (att.statut === 'en_attente'
            ? 'Zahle per CCP/BaridiMob (Verwendungszweck = ' + esc(att.ref) + ') und füge die Belegnummer ein:'
              + '<div class="bl-row"><input id="blPreuve" placeholder="Belegnummer / Foto">'
              + '<button class="btn btn-p btn-sm" id="blSendP">senden</button></div>'
            : 'Beleg erhalten — Freischaltung durch den Administrator innerhalb von 24 h.')
        + '</div>';
    }
    h += '<div class="bl-plans">' + c.plans.map(p =>
        '<div class="card bl-p' + (p.id === 'm6' ? ' bl-hot' : '') + '">'
      + (p.eco ? '<span class="bl-eco">' + esc(p.eco) + '</span>' : '')
      + '<b>' + esc(p.label) + '</b><div class="bl-prix">' + p.prix.toLocaleString('fr-FR') + ' DA</div>'
      + '<i>' + p.par_mois.toLocaleString('fr-FR') + ' DA / mois</i>'
      + '<button class="btn btn-p btn-block" data-plan="' + p.id + '" data-prix="' + p.prix
      + '">wählen</button></div>').join('') + '</div>'
      + '<div class="card bl-pay"><b>🏦 Zahlungsdaten</b>'
      + '<div class="bl-row"><span>Kontoinhaber</span><b>' + esc(c.titulaire) + '</b></div>'
      + '<div class="bl-row"><span>CCP</span><b>' + esc(c.ccp) + '</b></div>'
      + '<div class="bl-row"><span>BaridiMob</span><b>' + esc(c.baridimob) + '</b></div>'
      + '<p class="bl-note">Mets la référence DZ-… en libellé du versement, puis envoie le reçu '
      + 'ci-dessus. Activation manuelle sous 24 h.</p></div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-plan]').forEach(b => b.addEventListener('click', async () => {
      const r = await window.SB.createSub(b.dataset.plan, +b.dataset.prix);
      if(r.ok) renderAbonne();
      else if(String(r.err).indexOf('non connect') !== -1){
        const g = document.querySelector('[data-go="cloud"]');
        if(g) g.click();
      }
    }));
    const sp = $('#blSendP');
    if(sp) sp.addEventListener('click', async () => {
      const v = ($('#blPreuve').value || '').trim();
      if(!v || !att) return;
      await window.SB.setPreuve(att.id, v);
      renderAbonne();
    });
  }

  async function renderSponsor(){
    const box = $('#sponsorBody'); if(!box) return;
    box.innerHTML =
        '<div class="bl-hero"><span class="bl-crest">📢</span><div>'
      + '<h2>Sponsoring & Werbung</h2><p class="bl-sub">écoles · académies · sociétés : '
      + 'touchez des milliers d’élèves et de parents algériens</p></div></div>'
      + '<div class="bl-slots">'
      + slot('accueil', '🏠 Startbanner', 'gesehen von jedem Besucher beim Start')
      + slot('unites', '📚 Unité-Banner', 'angezeigt während der Wiederholungen')
      + slot('email', '✉️ Wochen-E-Mail', 'im Elternbericht')
      + '</div>'
      + '<div class="card"><form id="spForm">'
      + '<input id="spNom" placeholder="Name der Einrichtung / Firma" required>'
      + '<select id="spType"><option value="ecole">Schule</option>'
      + '<option value="academie">Akademie</option><option value="societe">Firma</option></select>'
      + '<select id="spSlot"><option value="accueil">Startbanner</option>'
      + '<option value="unites">Unité-Banner</option><option value="email">Wochen-E-Mail</option></select>'
      + '<input id="spContact" placeholder="E-Mail / Telefon" required>'
      + '<input id="spBudget" placeholder="geplantes Budget (DA)">'
      + '<textarea id="spMsg" placeholder="Nachricht / Ziel der Kampagne"></textarea>'
      + '<a class="btn btn-o btn-block" style="display:block;margin-bottom:10px" '
      + 'target="_blank" rel="noopener" href="sponsor-kit.html">📄 kit sponsor '
      + '(document commercial imprimable)</a>'
      + '<button class="btn btn-p btn-block" type="submit">📨 Anfrage senden</button>'
      + '<div id="spOk" class="bl-ok" hidden>✅ Anfrage gespeichert — wir kontaktieren Sie innerhalb von 48 h</div>'
      + '</form></div>';
    $('#spForm').addEventListener('submit', async ev => {
      ev.preventDefault();
      const r = await window.SB.addSponsor({ nom: $('#spNom').value, type: $('#spType').value,
        contact: $('#spContact').value, slot: $('#spSlot').value, budget: $('#spBudget').value,
        message: $('#spMsg').value });
      if(r.ok) $('#spOk').hidden = false;
    });
  }
  function slot(id, t, s){ return '<div class="card bl-s"><b>' + t + '</b><i>' + s + '</i></div>'; }

  /* bannière pub injectée sur مسارك */
  async function banniere(){
    if(!window.SB) return;
    const r = await window.SB.activeAds('accueil');
    const host = $('#masarBody'); if(!host || !r.ok || !(r.rows || []).length) return;
    if(host.querySelector('.bl-ad')) return;
    const a = r.rows[0];
    const d = document.createElement('div');
    d.className = 'bl-ad';
    d.innerHTML = '<span class="bl-ad-l">sponsor</span><b>' + esc(a.titre) + '</b> '
      + esc(a.texte) + (a.url ? ' <a target="_blank" rel="noopener" href="' + esc(a.url)
      + '">voir →</a>' : '');
    host.prepend(d);
  }

  window.renderAbonne = renderAbonne;
  window.renderSponsor = renderSponsor;
  window.renderAds = banniere;
  document.addEventListener('dz:view', e => {
    if(e.detail === 'abonne') renderAbonne();
    if(e.detail === 'sponsor') renderSponsor();
    if(e.detail === 'masar') setTimeout(banniere, 300);
  });
})();
