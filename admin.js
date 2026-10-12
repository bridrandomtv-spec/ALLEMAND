/* admin.js — tableau de bord ADMIN réel (profils + notes via Supabase, RLS admin) */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function csv(rows){
    if(!rows || !rows.length) return '';
    const cols = Object.keys(rows[0]);
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    return [cols.join(',')].concat(rows.map(r => cols.map(c => q(r[c])).join(','))).join('\n');
  }
  function telecharger(nom, texte){
    const b = new Blob([texte], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = nom; a.click();
  }

  async function render(){
    const box = $('#adminBody'); if(!box) return;
    if(!window.SB){ box.innerHTML = '<div class="ad-load">⏳ client cloud…</div>';
      document.addEventListener('dz:sbready', () => render(), { once:true }); return; }
    const u = await window.SB.me();
    const p = u ? await window.SB.myProfile() : null;
    if(!u || !p || p.role !== 'admin'){
      box.innerHTML = '<div class="card ad-deny"><b>🔒 accès réservé au rôle admin</b>'
        + '<p>Connecte-toi d’abord dans ☁️ Cloud, puis exécute une fois dans SQL Editor :</p>'
        + '<pre>update public.profiles set role = \'admin\'\n'
        + '  where id = (select id from auth.users\n'
        + '              where email = \'TON_EMAIL\');</pre></div>';
      return;
    }
    const [pr, nt] = await Promise.all([window.SB.listProfiles(), window.SB.listNotes()]);
    const profs = pr.ok ? pr.rows : [], notes = nt.ok ? nt.rows : [];
    const eleves = profs.filter(x => x.role === 'eleve');
    const moy = notes.length
      ? (notes.reduce((s, n) => s + Number(n.valeur || 0), 0) / notes.length).toFixed(2) : '—';
    box.innerHTML =
        '<div class="ad-hero"><span class="ad-crest">🛡️</span><div>'
      + '<h2>Administration réelle</h2><p class="ad-sub">connecté : ' + esc(u.email)
      + ' · rôle admin · données live Supabase</p></div></div>'
      + '<div class="ad-stats">'
      + stat(profs.length, 'comptes') + stat(eleves.length, 'élèves')
      + stat(profs.filter(x => x.role === 'prof').length, 'profs')
      + stat(notes.length, 'notes') + stat(moy, 'moyenne /20') + '</div>'
      + '<div class="ad-grid">'
      + '<div class="card"><b>👥 Konten (' + profs.length + ')</b>'
      + '<button class="btn btn-o btn-sm" id="adCsvP">⬇️ CSV</button>'
      + '<table class="ad-tab"><tr><th>pseudo</th><th>rôle</th><th>niveau</th><th>wilaya</th><th></th></tr>'
      + profs.map(x => '<tr><td>' + esc(x.pseudo || x.id.slice(0, 8)) + '</td>'
          + '<td><select class="ad-role" data-id="' + x.id + '">'
          + ['eleve','prof','parent','admin'].map(r =>
              '<option' + (r === x.role ? ' selected' : '') + '>' + r + '</option>').join('')
          + '</select></td><td>' + esc(x.niveau || '') + '</td><td>' + esc(x.wilaya || '')
          + '</td><td>' + esc((x.created_at || '').slice(0, 10)) + '</td></tr>').join('')
      + '</table></div>'
      + '<div class="card"><b>📝 Noten (' + notes.length + ')</b>'
      + '<button class="btn btn-o btn-sm" id="adCsvN">⬇️ CSV</button>'
      + '<table class="ad-tab"><tr><th>élève</th><th>trim.</th><th>/20</th><th>appréciation</th></tr>'
      + notes.map(n => {
          const el = profs.filter(x => x.id === n.eleve_id)[0];
          return '<tr><td>' + esc(el ? (el.pseudo || el.id.slice(0, 8)) : n.eleve_id.slice(0, 8))
            + '</td><td>' + esc(n.trimestre || '') + '</td><td><b>' + esc(n.valeur)
            + '</b></td><td>' + esc(n.appreciation || '') + '</td></tr>';
        }).join('') + '</table></div></div>';
  box.insertAdjacentHTML('beforeend',
    '<div class="card ad-box"><h3>💳 خطط الاشتراك — قابلة للإدارة (المرحلة 5)</h3>'
    + '<p class="ad-sub">الأسعار بالدج · حقل فارغ = « يُحدد لاحقًا » (القرار B) · '
    + 'المصدر : جدول public.plans (supabase/plans.sql)</p>'
    + '<div id="plansAdminBody"><div class="ad-load">⏳</div></div></div>');
  chargerPlansAdmin();
    $('#adCsvP').addEventListener('click', () => telecharger('comptes.csv', csv(profs)));
    $('#adCsvN').addEventListener('click', () => telecharger('notes.csv', csv(notes)));
    box.querySelectorAll('.ad-role').forEach(s => s.addEventListener('change', async () => {
      const r = await window.SB.setRole(s.dataset.id, s.value);
      s.style.borderColor = r.ok ? 'var(--g)' : 'var(--r)';
      if(r.ok) setTimeout(render, 400);
    }));
    const mono = document.createElement('div');
    mono.className = 'ad-mono'; box.appendChild(mono); renderMono(mono);
  }
  async function renderMono(mono){
    const [rb, rb2, rb3] = await Promise.all([
      window.SB.listSubs(), window.SB.listSponsors(), window.SB.activeAds()]);
    const subs = rb.ok ? rb.rows : [], sps = rb2.ok ? rb2.rows : [], ads = rb3.ok ? rb3.rows : [];
    const CA = subs.filter(s => s.statut === 'actif').reduce((t, s) => t + s.montant, 0);
    mono.innerHTML =
      '<div class="ad-grid" style="margin-top:12px">'
      + '<div class="card"><b>💳 Abonnements (' + subs.length + ' · '
      + CA.toLocaleString('fr-FR') + ' DA aktiv)</b>'
      + '<table class="ad-tab"><tr><th>user</th><th>plan</th><th>DA</th><th>statut</th><th></th></tr>'
      + subs.map(s => '<tr><td>' + esc(s.user_id.slice(0, 8)) + '</td><td>' + esc(s.plan)
        + '</td><td>' + s.montant + '</td><td>' + esc(s.statut) + '</td><td>'
        + ((s.statut === 'preuve' || s.statut === 'en_attente')
            ? '<button class="btn btn-p btn-sm" data-subok="' + s.id + '" data-plan="' + s.plan
              + '">✅</button> <button class="btn btn-o btn-sm" data-subko="' + s.id + '">❌</button>'
              + (s.preuve ? '<div class="ad-prev">Beleg: ' + esc(s.preuve) + '</div>' : '')
            : '') + '</td></tr>').join('') + '</table></div>'
      + '<div class="card"><b>📢 Sponsoren (' + sps.length + ' · ' + ads.length + ' aktive Werbungen)</b>'
      + '<table class="ad-tab"><tr><th>nom</th><th>type</th><th>slot</th><th>statut</th><th></th></tr>'
      + sps.map(s => '<tr><td>' + esc(s.nom) + '</td><td>' + esc(s.type) + '</td><td>'
        + esc(s.slot) + '</td><td>' + esc(s.statut) + '</td><td>'
        + (s.statut === 'en_attente'
            ? '<button class="btn btn-p btn-sm" data-spok="' + s.id + '">✅</button> '
              + '<button class="btn btn-o btn-sm" data-spko="' + s.id + '">❌</button>' : '')
        + '</td></tr>').join('') + '</table>'
      + '<b style="margin-top:12px">🆕 Werbung veröffentlichen</b>'
      + '<input id="adTitre" placeholder="Titel"><input id="adTexte" placeholder="Text">'
      + '<input id="adUrl" placeholder="URL (optional)">'
      + '<select id="adSlot"><option value="accueil">accueil</option>'
      + '<option value="unites">unités</option><option value="email">email</option></select>'
      + '<button class="btn btn-p btn-sm" id="adCreate">veröffentlichen</button></div></div>';
    /* phase 6 : la décision tranche subscription ET payment ensemble ;
       le refus remet la subscription en 'en_attente' (l'élève peut retenter)
       et marque le payment 'refuse' avec la note arabe. */
    mono.querySelectorAll('[data-subok]').forEach(b => b.addEventListener('click', async () => {
      const mois = { m1: 1, m6: 6, m12: 12 }[b.dataset.plan] || 1;
      await window.SB.deciderSub(+b.dataset.subok, true, mois, ''); render();
    }));
    mono.querySelectorAll('[data-subko]').forEach(b => b.addEventListener('click', async () => {
      await window.SB.deciderSub(+b.dataset.subko, false, 0,
        'لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى.'); render();
    }));
    /* phase 6 : tableau des payments (lié aux subscriptions par sub_id) */
    try{
      const pa = await window.SB.adminPayments();
      const rowsP = (pa && pa.rows) || [];
      const wrap = document.createElement('div');
      wrap.className = 'card';
      wrap.innerHTML = '<b>🧾 سجل العمليات (المرحلة 6 — منفصل عن الاشتراكات)</b>' + (rowsP.length
        ? '<table style="width:100%;font-size:12px;margin-top:8px"><tr><th>الاشتراك</th><th>الطريقة</th>'
          + '<th>دج</th><th>مرجع البنك</th><th>الحالة</th><th>ملاحظة</th></tr>'
          + rowsP.slice(0, 30).map(p => '<tr><td>' + p.sub_id + '</td><td>' + esc(p.methode) + '</td><td>'
            + Number(p.montant || 0) + '</td><td>' + esc(p.ref_banque || '') + '</td><td>' + esc(p.statut)
            + '</td><td>' + esc(p.note_admin || '') + '</td></tr>').join('') + '</table>'
        : '<p style="opacity:.7">لا توجد عمليات مسجلة</p>');
      mono.appendChild(wrap);
    }catch(e){}
    mono.querySelectorAll('[data-spok]').forEach(b => b.addEventListener('click', async () => {
      await window.SB.setSponsorStatut(+b.dataset.spok, 'approuve'); render();
    }));
    mono.querySelectorAll('[data-spko]').forEach(b => b.addEventListener('click', async () => {
      await window.SB.setSponsorStatut(+b.dataset.spko, 'refuse'); render();
    }));
    const ac = $('#adCreate', mono);
    if(ac) ac.addEventListener('click', async () => {
      await window.SB.createAd({ titre: $('#adTitre', mono).value, texte: $('#adTexte', mono).value,
        url: $('#adUrl', mono).value, slot: $('#adSlot', mono).value, actif: true });
      render();
    });
  }
  function stat(v, l){ return '<div class="ad-s"><b>' + esc(v) + '</b><span>' + l + '</span></div>'; }
  window.renderAdmin = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'admin') render(); });
})();

/* ── phase 5 : éditeur de plans (admin) — prix NULL autorisés (décision B) ── */
async function chargerPlansAdmin(){
  const box = document.getElementById('plansAdminBody'); if(!box) return;
  if(!window.SB || !window.SB.sb){ box.innerHTML = '<div class="ad-load">☁️ لا يوجد اتصال سحابي</div>'; return; }
  try{
    const sb = await window.SB.sb();
    const r = await sb.from('plans').select('id,role,duree_jours,prix_da,label_ar,actif').order('role').order('duree_jours');
    const rows = (r && r.data) || [];
    if(!rows.length){ box.innerHTML = '<div class="ad-deny">⚠️ جدول الخطط فارغ — نفّذ supabase/plans.sql (محرر SQL)</div>'; return; }
    box.innerHTML = rows.map(p =>
      '<div class="pl-row" data-plan="' + p.id + '" style="display:flex;gap:8px;align-items:center;margin:6px 0">'
      + '<span style="flex:1">' + p.role + ' · ' + p.duree_jours + ' j · ' + (p.label_ar || '') + '</span>'
      + '<input data-f="prix" type="number" min="0" step="50" style="width:110px" value="' + (p.prix_da == null ? '' : p.prix_da) + '" placeholder="NULL">'
      + '<label style="display:flex;gap:4px;align-items:center"><input data-f="actif" type="checkbox"' + (p.actif ? ' checked' : '') + '> actif</label>'
      + '<button class="btn btn-o btn-sm" data-plsave="' + p.id + '">💾</button></div>').join('');
  }catch(e){ box.innerHTML = '<div class="ad-deny">⚠️ ' + String((e && e.message) || e) + '</div>'; }
}
document.addEventListener('click', ev => {
  const b = ev.target.closest ? ev.target.closest('[data-plsave]') : null; if(!b) return;
  const row = b.closest('.pl-row'); if(!row) return;
  const prix = row.querySelector('[data-f="prix"]').value;
  const actif = row.querySelector('[data-f="actif"]').checked;
  (async () => {
    try{
      const sb = await window.SB.sb();
      const r = await sb.from('plans').update({ prix_da: prix === '' ? null : parseInt(prix, 10), actif: actif })
        .eq('id', b.getAttribute('data-plsave'));
      if(r && r.error) throw r.error;
      toast('✅ تم حفظ الخطة', 'ok');
    }catch(e){ toast('⚠️ ' + String((e && e.message) || e), 'ko'); }
  })();
});

/* ── phase 6 (ADM-1) : onglet « Agents & wilayas » (admin_general) ── */
(function(){
  function esq(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function host(){ return document.querySelector('section[data-view="admin"]'); }
  async function renderAgents(){
    var h = host(); if(!h) return;
    var box = document.getElementById('admAgentsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admAgentsCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>🧑‍ Agents & wilayas</h2><p>☁️ client cloud indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agents.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var ag = await SB.admListAgents();
    var pf = await SB.admListProfiles();
    var html = '<h2>🧑‍ Agents & wilayas (ADM-1)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">Périmètres appliqués par la base (RLS) : un agent ne lit que ses wilayas ; révocation = effet immédiat.</p>';
    html += (ag.ok && ag.agents.length) ? ag.agents.map(function(a){
      var pr = a.profiles || {};
      return '<div class="rep-row"><span>' + esq(pr.pseudo || a.user_id.slice(0,8)) + ' · ' + esq(a.role_cle) + ' · wilaya ' + esq(a.code_wilaya) + '</span>'
        + '<button class="btn btn-sm btn-r" data-adm-rev="' + a.user_id + '" type="button">révoquer</button></div>';
    }).join('') : '<p>Aucun agent affecté pour l\'instant.</p>';
    html += '<div class="fld" style="margin-top:12px"><span>Affecter un agent</span>'
      + '<select id="admSelProf">' + (pf.ok ? pf.profiles.map(function(p){ return '<option value="' + p.id + '">' + esq(p.pseudo || p.id.slice(0,8)) + ' (' + esq(p.wilaya || '?') + ')</option>'; }).join('') : '<option value="">profils indisponibles</option>') + '</select>'
      + '<select id="admSelRole"><option value="responsable_regional">responsable_regional</option><option value="agent_paiement">agent_paiement</option><option value="responsable_pedagogique">responsable_pedagogique</option><option value="agent_support">agent_support</option></select>'
      + '<input id="admWil" placeholder="codes wilaya, ex : 16,31 (vide = wilaya du profil)">'
      + '<button class="btn btn-p btn-sm" data-adm-assign="1" type="button">affecter</button></div>';
    box.innerHTML = html;
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm-rev],[data-adm-assign]') : null;
    if(!t) return;
    var rev = t.getAttribute('data-adm-rev');
    if(rev){ SB.admRevoke(rev).then(function(r){ if(r.ok) renderAgents(); else window.alert('⛔ ' + r.err); }); return; }
    if(t.getAttribute('data-adm-assign')){
      var uid = (document.getElementById('admSelProf')||{}).value;
      var role = (document.getElementById('admSelRole')||{}).value;
      var wraw = ((document.getElementById('admWil')||{}).value || '').split(',').map(function(x){ return x.trim(); }).filter(function(x){ return x; });
      if(!uid){ window.alert('⛔ profil manquant'); return; }
      if(!wraw.length){
        SB.admListProfiles().then(function(pf){
          var p = (pf.ok ? pf.profiles : []).filter(function(x){ return x.id === uid; })[0];
          SB.admAssign(uid, role, (p && p.wilaya) ? [p.wilaya] : []).then(function(r){ if(r.ok) renderAgents(); else window.alert('⛔ ' + r.err); });
        });
        return;
      }
      SB.admAssign(uid, role, wraw).then(function(r){ if(r.ok) renderAgents(); else window.alert('⛔ ' + r.err); });
    }
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('admin')>=0) renderAgents();
  });
  if((location.hash||'').replace('#','') === 'admin') renderAgents();
})();

/* ── phase 7 (ADM-2) : file de validation par wilaya + reçus + journal d'audit ── */
(function(){
  function esq2(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function host2(){ return document.querySelector('section[data-view="admin"]'); }
  async function renderQueue(){
    var h = host2(); if(!h) return;
    var box = document.getElementById('admQueueCard');
    if(!box){ box = document.createElement('div'); box.id = 'admQueueCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>💳 Validations & reçus</h2><p>☁️ client cloud indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('payments.validate') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var q = await SB.admQueue();
    var html = '<h2>💳 File de validation & reçus (ADM-2)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">Seuls les dossiers de ton périmètre (wilaya) apparaissent : le filtre vit dans la base. Confirmer → reçu possible ; rejeter = motif obligatoire ; tout laisse une trace au journal.</p>';
    html += q.ok && q.rows.length ? q.rows.map(function(r){
      var pr = r.profiles || {};
      return '<div class="rep-row"><span>#' + r.id + ' · ' + esq2(pr.pseudo || '?') + ' · ' + esq2(pr.wilaya || '?') + ' · ' + r.montant + ' ' + esq2(r.devise) + ' · ' + esq2(r.statut) + '</span>'
        + '<span style="display:flex;gap:6px;flex-wrap:wrap">'
        + '<button class="btn btn-sm btn-p" data-adm2-conf="' + r.id + '" type="button">confirmer</button>'
        + '<button class="btn btn-sm btn-r" data-adm2-rej="' + r.id + '" type="button">rejeter</button>'
        + '</span></div>';
    }).join('') : '<p>Aucun dossier en attente dans ton périmètre.</p>';
    html += '<div style="margin-top:12px"><b style="font-size:12.5px">🧾 Émettre un reçu (paiement confirmé)</b> '
      + '<input id="admRecPid" placeholder="id du paiement" style="width:110px;border:1px solid var(--b);border-radius:10px;padding:6px 9px;background:var(--p2);color:var(--t)">'
      + '<button class="btn btn-sm btn-g" data-adm2-rec="1" type="button">émettre</button> <span id="admRecOut" style="font-size:12px"></span></div>';
    if((meP.perms||[]).indexOf('reports.read') !== -1){
      var au = await SB.admAuditLast(12);
      html += '<div style="margin-top:14px"><b style="font-size:12.5px">📜 Journal d’audit (12 dernières)</b></div>'
        + (au.ok ? au.rows.map(function(l){ return '<div class="rep-row"><span>' + String(l.at||'').slice(0,16).replace('T',' ') + ' · ' + esq2(l.action) + ' · ' + esq2(l.cible_type) + ' #' + esq2(l.cible_id) + (l.wilaya ? ' · w' + esq2(l.wilaya) : '') + '</span><span style="font-size:11px;color:var(--m)">' + esq2(JSON.stringify(l.apres||{}).slice(0,60)) + '</span></div>'; }).join('') || '<p>journal vide</p>' : '<p>⛔ ' + esq2(au.err) + '</p>');
    }
    box.innerHTML = html;
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm2-conf],[data-adm2-rej],[data-adm2-rec]') : null;
    if(!t) return;
    var conf = t.getAttribute('data-adm2-conf'), rej = t.getAttribute('data-adm2-rej');
    if(conf){ SB.admSetPaymentStatut(+conf, 'confirme', '').then(function(r){ if(r.ok) renderQueue(); else window.alert('⛔ ' + r.err); }); return; }
    if(rej){ var motif = window.prompt('Motif du rejet :'); if(motif === null) return; SB.admSetPaymentStatut(+rej, 'rejete', motif).then(function(r){ if(r.ok) renderQueue(); else window.alert('⛔ ' + r.err); }); return; }
    if(t.getAttribute('data-adm2-rec')){
      var pid = +((document.getElementById('admRecPid')||{}).value || 0);
      if(!pid){ window.alert('⛔ id manquant'); return; }
      SB.admIssueReceipt(pid).then(function(r){
        var out = document.getElementById('admRecOut');
        if(out) out.textContent = r.ok ? ('✅ ' + r.numero) : ('⛔ ' + r.err);
        if(r.ok) renderQueue();
      });
    }
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('admin')>=0) renderQueue();
  });
  if((location.hash||'').replace('#','') === 'admin') renderQueue();
})();

/* ── phase 8b (ADM-3) : publication des accords (admin_general) ── */
(function(){
  function esq4(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  async function renderAccordsAdmin(){
    var h = document.querySelector('section[data-view="admin"]'); if(!h) return;
    var box = document.getElementById('admAccordsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admAccordsCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>📜 Accords & versions</h2><p>☁️ indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agreements.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var r = await SB.admAgreements();
    var html = '<h2>📜 Accords & versions (ADM-3)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">Publier une nouvelle version désactive l\'ancienne : les acceptations passées restent immuables et passent en « version à ré-accepter ».</p>'
      + (r.ok ? r.rows.map(function(a){ return '<div class="rep-row"><span>' + esq4(a.cle) + ' · v' + a.version + (a.actif ? ' · <b>active</b>' : ' · archivée') + ' · ' + esq4(a.titre) + '</span><span style="font-size:11px;color:var(--m)">' + String(a.cree_at||'').slice(0,10) + '</span></div>'; }).join('') || '<p>Aucun accord.</p>' : '<p>⛔ ' + esq4(r.err) + '</p>')
      + '<div class="fld" style="margin-top:12px"><span>Publier une nouvelle version</span>'
      + '<input id="adm3Cle" placeholder="cle (ex : conditions_utilisation)" value="conditions_utilisation">'
      + '<input id="adm3Titre" placeholder="titre de la version">'
      + '<textarea id="adm3Corps" rows="4" placeholder="corps complet de la nouvelle version"></textarea>'
      + '<button class="btn btn-p btn-sm" data-adm3-pub="1" type="button">publier la version</button> <span id="adm3Out" style="font-size:12px"></span></div>';
    box.innerHTML = html;
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm3-pub]') : null;
    if(!t) return;
    var cle = (document.getElementById('adm3Cle')||{}).value || '';
    var titre = (document.getElementById('adm3Titre')||{}).value || '';
    var corps = (document.getElementById('adm3Corps')||{}).value || '';
    if(!cle || !titre || !corps){ window.alert('⛔ cle, titre et corps requis'); return; }
    SB.admPublishAgreement(cle, titre, corps).then(function(r){
      var out = document.getElementById('adm3Out');
      if(out) out.textContent = r.ok ? ('✅ v' + r.version) : ('⛔ ' + r.err);
      if(r.ok) renderAccordsAdmin();
    });
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('admin')>=0) renderAccordsAdmin();
  });
  if((location.hash||'').replace('#','') === 'admin') renderAccordsAdmin();
})();

/* ── phase 9 (ADM-4) : barre d'onglets #admin + tableau de bord scopé + fiches élèves + paramètres ── */
(function(){
  function esq5(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  var TABS = [
    { id:'dash', label:'📊 Tableau de bord', cards:['admDashCard'], perm:'reports.read' },
    { id:'students', label:'👥 Élèves & parents', cards:['admStudentsCard'], perm:'students.read' },
    { id:'ops', label:'🧰 Opérations', cards:['admAgentsCard','admQueueCard','admAccordsCard','__legacy__'], perm:null },
    { id:'settings', label:'⚙️ Paramètres', cards:['admSettingsCard'], perm:'settings.manage' }
  ];
  var KNOWN = ['admDashCard','admStudentsCard','admSettingsCard','admAgentsCard','admQueueCard','admAccordsCard'];
  var state4 = { perms:[], tab:'ops' };
  function section(){ return document.querySelector('section[data-view="admin"]'); }
  function cardsOf(tab){
    var h = section(); if(!h) return [];
    return Array.prototype.slice.call(h.querySelectorAll('.card')).filter(function(c){
      var inList = tab.cards.indexOf(c.id) !== -1;
      var legacy = tab.cards.indexOf('__legacy__') !== -1 && KNOWN.indexOf(c.id) === -1 && c.id !== 'admTabs';
      return inList || legacy;
    });
  }
  function applyTab(id){
    state4.tab = id;
    TABS.forEach(function(t){
      cardsOf(t).forEach(function(c){ c.hidden = (t.id !== id); });
      var b = document.querySelector('[data-adm-tab="' + t.id + '"]');
      if(b) b.classList.toggle('on', t.id === id);
    });
  }
  async function renderTabs(){
    var h = section(); if(!h) return;
    var meP = (window.SB && SB.admMyPerms) ? await SB.admMyPerms() : { ok:false, perms:[] };
    state4.perms = meP.ok ? (meP.perms||[]) : [];
    var bar = document.getElementById('admTabs');
    if(!bar){ bar = document.createElement('div'); bar.id = 'admTabs'; bar.className = 'tabs'; bar.style.position = 'static'; bar.style.height = 'auto'; bar.style.width = 'auto'; h.insertBefore(bar, h.firstChild); }
    bar.innerHTML = TABS.filter(function(t){ return !t.perm || state4.perms.indexOf(t.perm) !== -1; })
      .map(function(t){ return '<button class="tab" data-adm-tab="' + t.id + '" type="button">' + t.label + '</button>'; }).join('');
    applyTab(state4.tab);
  }
  async function renderDash(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admDashCard');
    if(!box){ box = document.createElement('div'); box.id = 'admDashCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    var r = await SB.admDashboard();
    if(!r.ok){ box.innerHTML = '<h2>📊 Tableau de bord</h2><p>⛔ ' + esq5(r.err) + '</p>'; return; }
    var d = r.dash || {};
    box.innerHTML = '<h2>📊 Tableau de bord (périmètre : ' + esq5(d.perimetre) + ')</h2>'
      + '<div class="grid3" style="margin-top:10px">'
      + '<div class="card mini"><div class="mini-i">🎓</div><b>' + (d.eleves||0) + '</b><p>élèves du périmètre</p></div>'
      + '<div class="card mini"><div class="mini-i">⏳</div><b>' + (d.paiements_attente||0) + '</b><p>paiements à traiter</p></div>'
      + '<div class="card mini"><div class="mini-i">💰</div><b>' + (d.recettes_confirmees_da||0) + ' DA</b><p>recettes confirmées</p></div>'
      + '<div class="card mini"><div class="mini-i">↩️</div><b>' + (d.remboursements||0) + '</b><p>remboursements tracés</p></div>'
      + '<div class="card mini"><div class="mini-i">🪪</div><b>' + (d.verifications_attente||0) + '</b><p>vérifications d’identité</p></div>'
      + '<div class="card mini"><div class="mini-i">🚩</div><b>' + (d.signalements_ouverts||0) + '</b><p>signalements ouverts</p></div>'
      + '</div><p style="font-size:11.5px;color:var(--m);margin-top:8px">Chiffres calculés côté base, filtrés par wilaya : un agent régional ne voit jamais le national.</p>';
  }
  async function renderStudents(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admStudentsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admStudentsCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('students.read') === -1){ box.hidden = true; return; }
    box.innerHTML = '<h2>👥 Élèves & parents</h2>'
      + '<div class="fld"><span>Rechercher un élève (pseudo)</span><input id="admStuQ" placeholder="ex : amin">'
      + '<button class="btn btn-p btn-sm" data-adm4-search="1" type="button">chercher</button></div>'
      + '<div id="admStuList" style="margin-top:10px"></div><div id="admStuFiche" style="margin-top:10px"></div>';
  }
  async function renderSettings(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admSettingsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSettingsCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('settings.manage') === -1){ box.hidden = true; return; }
    var r = await SB.admSettings();
    box.innerHTML = '<h2>⚙️ Paramètres plateforme</h2>'
      + (r.ok ? r.rows.map(function(s){ return '<div class="fld" style="margin-top:8px"><span>' + esq5(s.cle) + ' (maj ' + String(s.maj_at||'').slice(0,10) + ')</span>'
          + '<textarea id="admSet_' + esq5(s.cle) + '" rows="3">' + esq5(JSON.stringify(s.valeur)) + '</textarea>'
          + '<button class="btn btn-p btn-sm" data-adm4-save="' + esq5(s.cle) + '" type="button">enregistrer</button></div>'; }).join('') : '<p>⛔ ' + esq5(r.err) + '</p>')
      + '<p style="font-size:11.5px;color:var(--m);margin-top:8px">Valeurs JSON ; chaque enregistrement passe par setting_set (permission settings.manage) et laisse une ligne au journal d’audit.</p>';
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm-tab],[data-adm4-search],[data-adm4-save],[data-adm4-stu]') : null;
    if(!t) return;
    var tab = t.getAttribute('data-adm-tab');
    if(tab){ applyTab(tab); if(tab==='dash') renderDash(); if(tab==='students') renderStudents(); if(tab==='settings') renderSettings(); return; }
    if(t.getAttribute('data-adm4-search')){
      var q = ((document.getElementById('admStuQ')||{}).value || '');
      SB.admSearchStudents(q).then(function(r){
        var list = document.getElementById('admStuList'); if(!list) return;
        list.innerHTML = r.ok ? (r.rows.map(function(p){ return '<div class="rep-row"><span>' + esq5(p.pseudo) + ' · ' + esq5(p.niveau||'?') + ' · ' + esq5(p.wilaya||'?') + ' · ' + esq5(p.verif_statut||'') + '</span><button class="btn btn-sm btn-o" data-adm4-stu="' + p.id + '" type="button">fiche</button></div>'; }).join('') || '<p>aucun résultat</p>') : '<p>⛔ ' + esq5(r.err) + '</p>';
      });
      return;
    }
    var stu = t.getAttribute('data-adm4-stu');
    if(stu){
      SB.admStudent(stu).then(function(r){
        var f = document.getElementById('admStuFiche'); if(!f) return;
        f.innerHTML = r.ok ? '<pre style="background:var(--p2);border:1px solid var(--b);border-radius:10px;padding:10px;font-size:11px;overflow:auto">' + esq5(JSON.stringify(r.fiche, null, 1)) + '</pre>' : '<p>⛔ ' + esq5(r.err) + '</p>';
      });
      return;
    }
    var save = t.getAttribute('data-adm4-save');
    if(save){
      var ta = document.getElementById('admSet_' + save); if(!ta) return;
      var val = null; try{ val = JSON.parse(ta.value); }catch(err){ window.alert('⛔ JSON invalide'); return; }
      SB.admSetSetting(save, val).then(function(r){ if(r.ok) renderSettings(); else window.alert('⛔ ' + r.err); });
    }
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('admin')>=0){ renderTabs().then(function(){ if(state4.tab==='dash') renderDash(); if(state4.tab==='students') renderStudents(); if(state4.tab==='settings') renderSettings(); }); }
  });
  if((location.hash||'').replace('#','') === 'admin') renderTabs();
})();

/* ── phase 10 (ADM-5) : onglets 💰 Comptabilité & rapports + 🎫 Support ─ */
(function(){
  function esq6(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function section5(){ return document.querySelector('section[data-view="admin"]'); }
  var perms5 = [];
  function dlCSV(nom, lignes){
    var csv = lignes.map(function(l){ return l.map(function(v){ return '"' + String(v==null?'':v).replace(/"/g,'""') + '"'; }).join(';'); }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8' }));
    a.download = nom; a.click();
  }
  async function renderCompta(){
    var h = section5(); if(!h) return;
    var box = document.getElementById('admComptaCard');
    if(!box){ box = document.createElement('div'); box.id = 'admComptaCard'; box.className = 'card'; h.appendChild(box); }
    if(perms5.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var e = await SB.admEntries();
    var rp = await SB.admReport(null, null);
    var r = rp.ok ? rp.report : {};
    var html = '<h2>💰 Comptabilité & rapports (ADM-5)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:8px">Périmètre : ' + esq6(r.perimetre || '?') + ' · recettes ' + (r.recettes_da||0) + ' DA · remboursements ' + (r.remboursements_da||0) + ' · dépenses ' + (r.depenses_da||0) + ' · solde ' + ((r.recettes_da||0)-(r.remboursements_da||0)-(r.depenses_da||0)) + ' DA</p>';
    html += e.ok && e.rows.length ? e.rows.slice(0,40).map(function(x){
      return '<div class="rep-row"><span>' + String(x.at||'').slice(0,10) + ' · ' + esq6(x.sens) + ' · ' + esq6(x.categorie) + ' · ' + x.montant + ' ' + esq6(x.devise) + (x.wilaya ? ' · w' + esq6(x.wilaya) : '') + '</span><span style="font-size:11px;color:var(--m)">' + esq6(x.ref_type) + ' #' + esq6(x.ref_id) + '</span></div>';
    }).join('') : '<p>aucune écriture pour l’instant</p>';
    html += '<div class="fld" style="margin-top:10px"><span>Rapport par période</span>'
      + '<input id="adm5Debut" type="date"> <input id="adm5Fin" type="date">'
      + '<button class="btn btn-sm btn-o" data-adm5-report="1" type="button">calculer</button>'
      + '<button class="btn btn-sm btn-g" data-adm5-csv="1" type="button">export CSV</button></div>'
      + '<pre id="adm5RepOut" style="background:var(--p2);border:1px solid var(--b);border-radius:10px;padding:8px;font-size:11px;max-height:160px;overflow:auto"></pre>';
    if(perms5.indexOf('accounting.manage') !== -1){
      html += '<div class="fld" style="margin-top:8px"><span>Dépense manuelle</span>'
        + '<input id="adm5Mont" type="number" placeholder="montant DA"> <input id="adm5Cat" placeholder="catégorie">'
        + '<button class="btn btn-sm btn-p" data-adm5-dep="1" type="button">enregistrer</button></div>';
    }
    box.innerHTML = html;
  }
  async function renderSupport(){
    var h = section5(); if(!h) return;
    var box = document.getElementById('admSupportCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSupportCard'; box.className = 'card'; h.appendChild(box); }
    if(perms5.indexOf('tickets.handle') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var t = await SB.admTickets();
    box.innerHTML = '<h2>🎫 Support (dossiers de ton périmètre)</h2>'
      + (t.ok && t.rows.length ? t.rows.map(function(x){ var p = x.profiles || {};
          return '<div class="rep-row"><span>#' + x.id + ' · ' + esq6(p.pseudo||'?') + ' · ' + esq6(p.wilaya||'?') + ' · ' + esq6(x.sujet) + ' · ' + esq6(x.statut) + '</span>'
            + '<span style="display:flex;gap:6px">'
            + '<button class="btn btn-sm btn-o" data-adm5-tk="' + x.id + '|en_cours" type="button">prendre</button>'
            + '<button class="btn btn-sm btn-p" data-adm5-tk="' + x.id + '|resolu" type="button">résoudre</button></span></div>';
        }).join('') : '<p>aucun ticket ouvert dans ton périmètre</p>');
  }
  function showOnly(ids){
    var h = section5(); if(!h) return;
    Array.prototype.slice.call(h.querySelectorAll('.card')).forEach(function(c){ c.hidden = ids.indexOf(c.id) === -1; });
    Array.prototype.slice.call(h.querySelectorAll('[data-adm-tab],[data-adm5-tab]')).forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-adm5-tab') && ids.indexOf(b.getAttribute('data-adm5-tab') === -1 ? '' : b.getAttribute('data-adm5-tab')) !== -1); });
  }
  async function mountTabs(){
    var h = section5(); if(!h) return;
    var bar = document.getElementById('admTabs'); if(!bar) return;
    if(!window.SB || !SB.admMyPerms){ return; }
    var meP = await SB.admMyPerms(); perms5 = meP.ok ? (meP.perms||[]) : [];
    if(!bar.querySelector('[data-adm5-tab="compta"]') && perms5.indexOf('reports.read') !== -1){
      bar.insertAdjacentHTML('beforeend', '<button class="tab" data-adm5-tab="compta" type="button">💰 Compta & rapports</button>');
    }
    if(!bar.querySelector('[data-adm5-tab="support"]') && perms5.indexOf('tickets.handle') !== -1){
      bar.insertAdjacentHTML('beforeend', '<button class="tab" data-adm5-tab="support" type="button">🎫 Support</button>');
    }
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm5-tab],[data-adm5-report],[data-adm5-csv],[data-adm5-dep],[data-adm5-tk],[data-adm-tab]') : null;
    if(!t) return;
    var tab5 = t.getAttribute('data-adm5-tab');
    if(tab5){
      var h = section5();
      Array.prototype.slice.call(h.querySelectorAll('[data-adm-tab],[data-adm5-tab]')).forEach(function(b){ b.classList.toggle('on', b === t); });
      if(tab5 === 'compta'){ showOnly(['admComptaCard']); renderCompta(); }
      if(tab5 === 'support'){ showOnly(['admSupportCard']); renderSupport(); }
      return;
    }
    if(t.getAttribute('data-adm-tab')){ showOnly([]); setTimeout(function(){ var h = section5(); Array.prototype.slice.call(h.querySelectorAll('.card')).forEach(function(c){ if(c.id === 'admComptaCard' || c.id === 'admSupportCard') c.hidden = true; }); }, 0); return; }
    if(t.getAttribute('data-adm5-report')){
      var d = (document.getElementById('adm5Debut')||{}).value || null;
      var f = (document.getElementById('adm5Fin')||{}).value || null;
      SB.admReport(d, f).then(function(r){ var o = document.getElementById('adm5RepOut'); if(o) o.textContent = r.ok ? JSON.stringify(r.report, null, 1) : ('⛔ ' + r.err); });
      return;
    }
    if(t.getAttribute('data-adm5-csv')){
      SB.admReport(null, null).then(function(r){
        if(!r.ok){ window.alert('⛔ ' + r.err); return; }
        var lignes = [['wilaya','recettes_da']];
        Object.keys(r.report.par_wilaya || {}).forEach(function(k){ lignes.push([k, r.report.par_wilaya[k]]); });
        lignes.push(['mois','recettes_da']);
        Object.keys(r.report.par_mois || {}).forEach(function(k){ lignes.push([k, r.report.par_mois[k]]); });
        dlCSV('rapport_recettes.csv', lignes);
      });
      return;
    }
    if(t.getAttribute('data-adm5-dep')){
      var m = +((document.getElementById('adm5Mont')||{}).value || 0);
      var cat = (document.getElementById('adm5Cat')||{}).value || '';
      if(!m || !cat){ window.alert('⛔ montant et catégorie requis'); return; }
      SB.admDepense(m, cat, {}).then(function(r){ if(r.ok) renderCompta(); else window.alert('⛔ ' + r.err); });
      return;
    }
    var tk = t.getAttribute('data-adm5-tk');
    if(tk){ var pp = tk.split('|'); SB.admTicketSet(+pp[0], pp[1]).then(function(r){ if(r.ok) renderSupport(); else window.alert('⛔ ' + r.err); }); }
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('admin')>=0) mountTabs();
  });
  if((location.hash||'').replace('#','') === 'admin') mountTabs();
  document.addEventListener('dz:sbready', function(){ if((location.hash||'').replace('#','') === 'admin') mountTabs(); });
  document.addEventListener('dz:auth', function(){ if((location.hash||'').replace('#','') === 'admin') mountTabs(); });
})();
