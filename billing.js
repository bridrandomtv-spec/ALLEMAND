/* billing.js — 💳 abonnements (1800/9000/15000 DA) + 📢 sponsoring + bannières pubs */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const FALLBACK = { titulaire:'KHARIF AHMED', ccp:'0000000000 CLE 00',
    baridimob:'0000000000000000',
    plans:[{id:'m1',label:'شهر واحد',prix:1800,par_mois:1800},
           {id:'m6',label:'ستة أشهر',prix:9000,par_mois:1500,eco:'-17%'},
           {id:'m12',label:'سنة كاملة',prix:15000,par_mois:1250,eco:'-30%'}] };
  let CFG = null;
  async function cfg(){
    if(CFG) return CFG;
    try{ const r = await fetch('assets/bdd/config.json', { cache:'no-store' });
         CFG = (r.ok ? await r.json() : {}).paiement || FALLBACK; }catch(e){ CFG = FALLBACK; }
    return CFG;
  }
  const MOIS = { m1:1, m6:6, m12:12 };
  /* phase 4 : le plan cliqué dans le paywall est pré-sélectionné ici (une seule fois) */
  let PREPLAN = null;
  try{ PREPLAN = sessionStorage.getItem('dz_paywall_plan');
       if(PREPLAN) sessionStorage.removeItem('dz_paywall_plan'); }catch(e){}
  /* phase 5 : les plans viennent de la TABLE public.plans (administrable) ;
     repli config.json uniquement pour le rôle élève si la table est vide/absente.
     par_mois et eco sont CALCULÉS depuis prix_da — aucun prix codé ici. */
  async function plansPour(role, cfgFallback){
    try{
      if(window.SB && window.SB.sb){
        const sb = await window.SB.sb();
        if(sb){
          const r = await sb.from('plans').select('id,duree_jours,prix_da,label_ar')
            .eq('role', role).eq('actif', true).order('duree_jours');
          const rows = ((r && r.data) || []).filter(x => x.prix_da != null);
          if(rows.length){
            const base = rows[0].prix_da / (rows[0].duree_jours / 30);
            return rows.map(x => {
              const mois = x.duree_jours / 30;
              const pm = Math.round(x.prix_da / mois);
              const lb = x.duree_jours === 30 ? 'شهر واحد' : (x.duree_jours === 180 ? 'ستة أشهر' : 'سنة كاملة');
              return { id: x.id, label: lb, label_ar: x.label_ar || '', prix: x.prix_da, par_mois: pm,
                       eco: mois > 1 ? '-' + Math.round((1 - pm / base) * 100) + '%' : null };
            });
          }
        }
      }
    }catch(e){}
    if(role === 'eleve' && cfgFallback && cfgFallback.plans){
        const AR = { m1:'شهر واحد', m6:'ستة أشهر', m12:'سنة كاملة' };
        return cfgFallback.plans.map(p => Object.assign({}, p, { label: AR[p.id] || p.label, label_ar: AR[p.id] || p.label_ar || '' }));
      }
      return [];
  }
  window.BILLING_PLANS = plansPour;


  async function renderAbonne(){
    const box = $('#abonneBody'); if(!box) return;
    if(!window.SB){ box.innerHTML = '<div class="bl-load">⏳ client cloud…</div>';
      document.addEventListener('dz:sbready', () => renderAbonne(), { once:true }); return; }
    const u = await window.SB.me();
    const c = await cfg();
    const role0 = (window.AUTH && AUTH.session && AUTH.session()) ? (AUTH.session().role || 'eleve') : 'eleve';
    const pls = await plansPour(role0, c);
    const notice = u ? '' :
        '<div class="card bl-wait"><b>☁️ يلزم الاتصال السحابي لتسجيل طلبك</b>'
      + '<p>العروض وأرقام الحسابات أدناه متاحة للاطلاع الحر. '
      + 'لإنشاء مرجعك DZ-… ومتابعة وصلك، سجّل الدخول أولًا في ☁️ Cloud.</p>'
      + '<button class="btn btn-p btn-sm" data-go="cloud">☁️ ouvrir Cloud</button></div>';
    const subs = await window.SB.mySubs();
    const act = (subs.rows || []).filter(s => s.statut === 'actif')[0];
    const att = (subs.rows || []).filter(s => s.statut === 'en_attente' || s.statut === 'preuve')[0];
    let h = notice + '<div class="bl-hero"><span class="bl-crest">💳</span><div>'
      + '<h2>الاشتراك المميز</h2><p class="bl-sub">ادعم المنصة وافتح '
      + 'المتابعة الكاملة · الدفع عبر CCP / BaridiMob · التفعيل من المدير</p><p class="bl-sub" style="margin-top:6px"><b>⭐ اشتراك واحد = 2AS + 3AS معًا</b> · يشمل الإخوة عند الطلب — عائلة واحدة، حساب واحد.</p></div></div>';
    if(act){
      h += '<div class="card bl-ok">⭐ <b>مشترك</b> — خطة ' + esc(act.plan)
        + ' · تنتهي في ' + esc((act.fin || '').slice(0, 10)) + '</div>';
    }
    if(att){
      h += '<div class="card bl-wait"><b>⏳ طلب جارٍ</b> — المرجع ' + esc(att.ref)
        + ' · الحالة ' + esc(att.statut) + '<br>'
        + (att.statut === 'en_attente'
            ? 'ادفع عبر CCP أو BaridiMob (المرجع = ' + esc(att.ref) + ') ثم أدخل رقم الوصل :'
              + '<div class="bl-row"><select id="blMeth" style="max-width:150px">'
              + '<option value="ccp">CCP</option><option value="baridimob">BaridiMob</option></select>'
              + '<input id="blPreuve" placeholder="رقم الوصل / صورة">'
              + '<button class="btn btn-p btn-sm" id="blSendP">إرسال</button></div>'
            : 'تم استلام الوصل — التفعيل من المدير خلال 24 ساعة.')
        + '</div>';
    }
    /* phase 6 : historique des payments + message arabe d'échec (jamais actif sans admin) */
    try{
      const pays = await window.SB.myPayments();
      const rowsP = (pays && pays.rows) || [];
      if(rowsP.length){
        const lastP = rowsP[0];
        if(lastP.statut === 'refuse'){
          h += '<div class="card bl-wait" style="border-color:rgba(210,16,52,.5)">'
            + '<b>❌ لم تكتمل عملية الدفع.</b> يمكنك المحاولة مرة أخرى.'
            + (lastP.note_admin ? '<br><span style="opacity:.85">' + esc(lastP.note_admin) + '</span>' : '')
            + '<br><span style="opacity:.7;font-size:12px">مرجع المنصة : ' + esc(lastP.ref_plateforme || '') + '</span></div>';
        }
        h += '<div class="card"><b>🧾 سجل العمليات (منفصل عن الاشتراك)</b><div style="margin-top:8px">'
          + rowsP.slice(0, 6).map(p =>
              '<div class="bl-row" style="justify-content:space-between"><span>'
              + esc(String(p.created_at || '').slice(0, 10)) + ' · ' + esc(p.methode) + ' · '
              + Number(p.montant || 0).toLocaleString('fr-FR') + ' DA · ' + esc(p.ref_plateforme || '')
              + '</span><b>' + (p.statut === 'valide' ? '✅ مؤكد' : (p.statut === 'refuse' ? '❌ مرفوض' : '⏳ قيد التحقق')) + '</b></div>'
            ).join('') + '</div></div>';
      }
    }catch(e){}
    h += '<div class="bl-plans">' + (pls.length ? '' : '<div class="bl-wait">⚠️ لا توجد خطة نشطة لدورك — الأسعار قيد التحديد لاحقًا (القرار B)</div>') + pls.map(p =>
        '<div class="card bl-p' + (p.id === PREPLAN || (!PREPLAN && (p.id === 'm6' || p.id === 'eleve-m6')) ? ' bl-hot' : '') + '">'
      + (p.eco ? '<span class="bl-eco">' + esc(p.eco) + '</span>' : '')
      + '<b>' + esc(p.label) + '</b><div class="bl-prix">' + p.prix.toLocaleString('fr-FR') + ' دج</div>'
      + '<i>' + p.par_mois.toLocaleString('fr-FR') + ' دج / شهر</i>'
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
      const meth = ($('#blMeth') || {}).value || 'ccp';
      await window.SB.setPreuve(att.id, v);
      /* phase 6 : trace PAYMENT séparée de la SUBSCRIPTION (échec = repli ancien, jamais bloquant) */
      try{
        const pr = await window.SB.createPayment({ sub_id: att.id, montant: att.montant || 0,
          methode: meth, ref: att.ref || '', ref_banque: v });
        if(pr && pr.ok === false && pr.err) console.warn('🧾 payment :', pr.err);
      }catch(e){ console.warn('🧾 payment :', e); }
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
