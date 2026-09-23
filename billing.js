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
      h += '<div class="card bl-ok">⭐ <b>abonné</b> — plan ' + esc(act.plan)
        + ' · expire le ' + esc((act.fin || '').slice(0, 10)) + '</div>';
    }
    if(att){
      h += '<div class="card bl-wait"><b>⏳ demande en cours</b> — réf ' + esc(att.ref)
        + ' · statut ' + esc(att.statut) + '<br>'
        + (att.statut === 'en_attente'
            ? 'Paie par CCP/BaridiMob (libellé = ' + esc(att.ref) + ') puis colle le n° de reçu :'
              + '<div class="bl-row"><input id="blPreuve" placeholder="n° de reçu / capture">'
              + '<button class="btn btn-p btn-sm" id="blSendP">envoyer</button></div>'
            : 'Preuve reçue — validation par l’administrateur sous 24 h.')
        + '</div>';
    }
    h += '<div class="bl-plans">' + c.plans.map(p =>
        '<div class="card bl-p' + (p.id === 'm6' ? hot : '') + '">'
      + (p.eco ? '<span class="bl-eco">' + esc(p.eco) + '</span>' : '')
      + '<b>' + esc(p.label) + '</b><div class="bl-prix">' + p.prix.toLocaleString('fr-FR') + ' DA</div>'
      + '<i>' + p.par_mois.toLocaleString('fr-FR') + ' DA / mois</i>'
      + '<button class="btn btn-p btn-block" data-plan="' + p.id + '" data-prix="' + p.prix
      + '">choisir</button></div>').join('') + '</div>'
      + '<div class="card bl-pay"><b>🏦 Coordonnées de paiement</b>'
      + '<div class="bl-row"><span>Titulaire</span><b>' + esc(c.titulaire) + '</b></div>'
      + '<div class="bl-row"><span>CCP</span><b>' + esc(c.ccp) + '</b></div>'
      + '<div class="bl-row"><span>BaridiMob</span><b>' + esc(c.baridimob) + '</b></div>'
      + '<p class="bl-note">Mets la référence DZ-… en libellé du versement, puis envoie le reçu '
      + 'ci-dessus. Activation manuelle sous 24 h.</p></div>';
    box.innerHTML = h;
    const hot = '';
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
      + '<h2>Sponsoring & publicité</h2><p class="bl-sub">écoles · académies · sociétés : '
      + 'touchez des milliers d’élèves et de parents algériens</p></div></div>'
      + '<div class="bl-slots">'
      + slot('accueil', '🏠 Bannière accueil', 'vue par chaque visiteur à l’ouverture')
      + slot('unites', '📚 Bandeau unités', 'affiché pendant les révisions')
      + slot('email', '✉️ Encart email hebdo', 'dans le rapport des parents')
      + '</div>'
      + '<div class="card"><form id="spForm">'
      + '<input id="spNom" placeholder="nom de l’établissement / société" required>'
      + '<select id="spType"><option value="ecole">école</option>'
      + '<option value="academie">académie</option><option value="societe">société</option></select>'
      + '<select id="spSlot"><option value="accueil">bannière accueil</option>'
      + '<option value="unites">bandeau unités</option><option value="email">encart email</option></select>'
      + '<input id="spContact" placeholder="email / téléphone de contact" required>'
      + '<input id="spBudget" placeholder="budget envisagé (DA)">'
      + '<textarea id="spMsg" placeholder="message / objectif de la campagne"></textarea>'
      + '<button class="btn btn-p btn-block" type="submit">📨 envoyer la demande</button>'
      + '<div id="spOk" class="bl-ok" hidden>✅ demande enregistrée — nous vous contactons sous 48 h</div>'
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
