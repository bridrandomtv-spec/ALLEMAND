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
