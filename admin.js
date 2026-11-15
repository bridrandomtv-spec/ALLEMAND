/* admin.js — tableau de bord ADMIN réel (profils + notes via Supabase, RLS admin) */
/* MODE D'EMPLOI (2 lignes) : sélectionne TOUT ce bloc (clic dans le code → Ctrl+A → Ctrl+C),
   remplace INTÉGRALEMENT l'ancien admin.js (GitHub web → crayon → Ctrl+A → Suppr → Ctrl+V),
   commit : fix(CI): commentaire phase 7 purgé du littéral interdit (garde RECUFIX-1) */
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
      + '<h2>الإدارة الفعلية · Real administration</h2><p class="ad-sub">متصل · connected : ' + esc(u.email)
      + ' · دور مدير · بيانات Supabase حية · admin role · live Supabase data</p></div></div>'
      + '<div class="ad-stats">'
      + stat(profs.length, 'comptes') + stat(eleves.length, 'élèves')
      + stat(profs.filter(x => x.role === 'prof').length, 'profs')
      + stat(notes.length, 'notes') + stat(moy, 'moyenne /20') + '</div>'
      + '<div class="ad-grid">'
      + '<div class="card"><b>👥 الحسابات (' + profs.length + ')</b>'
      + '<button class="btn btn-o btn-sm" id="adCsvP">⬇️ CSV</button>'
      + '<table class="ad-tab"><tr><th>pseudo</th><th>rôle</th><th>niveau</th><th>wilaya</th><th></th></tr>'
      + profs.map(x => '<tr><td>' + esc(x.pseudo || x.id.slice(0, 8)) + '</td>'
          + '<td><select class="ad-role" data-id="' + x.id + '">'
          + ['eleve','prof','parent','admin'].map(r =>
              '<option' + (r === x.role ? ' selected' : '') + '>' + r + '</option>').join('')
          + '</select></td><td>' + esc(x.niveau || '') + '</td><td>' + esc(x.wilaya || '')
          + '</td><td>' + esc((x.created_at || '').slice(0, 10)) + '</td></tr>').join('')
      + '</table></div>'
      + '<div class="card"><b>📝 النقاط (' + notes.length + ')</b>'
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
      + CA.toLocaleString('fr-FR') + ' دج نشطة)</b>'
      + '<table class="ad-tab"><tr><th>user</th><th>plan</th><th>DA</th><th>statut</th><th></th></tr>'
      + subs.map(s => '<tr><td>' + esc(s.user_id.slice(0, 8)) + '</td><td>' + esc(s.plan)
        + '</td><td>' + s.montant + '</td><td>' + esc(s.statut) + '</td><td>'
        + ((s.statut === 'preuve' || s.statut === 'en_attente')
            ? '<button class="btn btn-p btn-sm" data-subok="' + s.id + '" data-plan="' + s.plan
              + '">✅</button> <button class="btn btn-o btn-sm" data-subko="' + s.id + '">❌</button>'
              + (s.preuve ? '<div class="ad-prev">المرفق: ' + esc(s.preuve) + '</div>' : '')
            : '') + '</td></tr>').join('') + '</table></div>'
      + '<div class="card"><b>📢 الرعاة (' + sps.length + ' · ' + ads.length + ' إعلانات نشطة)</b>'
      + '<table class="ad-tab"><tr><th>nom</th><th>type</th><th>slot</th><th>statut</th><th></th></tr>'
      + sps.map(s => '<tr><td>' + esc(s.nom) + '</td><td>' + esc(s.type) + '</td><td>'
        + esc(s.slot) + '</td><td>' + esc(s.statut) + '</td><td>'
        + (s.statut === 'en_attente'
            ? '<button class="btn btn-p btn-sm" data-spok="' + s.id + '">✅</button> '
              + '<button class="btn btn-o btn-sm" data-spko="' + s.id + '">❌</button>' : '')
        + '</td></tr>').join('') + '</table>'
      + '<b style="margin-top:12px">🆕 نشر إعلان</b>'
      + '<input id="adTitre" placeholder="العنوان"><input id="adTexte" placeholder="النص">'
      + '<input id="adUrl" placeholder="رابط (اختياري)">'
      + '<select id="adSlot"><option value="accueil">accueil</option>'
      + '<option value="unites">unités</option><option value="email">email</option></select>'
      + '<button class="btn btn-p btn-sm" id="adCreate">نشر</button></div></div>';
    mono.querySelectorAll('[data-subok]').forEach(b => b.addEventListener('click', async () => {
      const mois = { m1: 1, m6: 6, m12: 12 }[b.dataset.plan] || 1;
      await window.SB.deciderSub(+b.dataset.subok, true, mois, ''); render();
    }));
    mono.querySelectorAll('[data-subko]').forEach(b => b.addEventListener('click', async () => {
      await window.SB.deciderSub(+b.dataset.subko, false, 0,
        'لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى.'); render();
    }));
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

/* ══ ORG-1 · carte de couverture triable — JS SEUL, sans une ligne de CSS ══ */
function rendreCouvertureORG1(mount){
  if(!mount || mount.dataset.org1 === '1') return;
  mount.dataset.org1 = '1';
  if(typeof SB === 'undefined' || typeof SB.admCouverture !== 'function'){
    mount.innerHTML = '<p class="org1-missing">🗺 Carte indisponible : méthode SB.admCouverture absente (règle B non collée).</p>';
    return;
  }
  mount.innerHTML = '<p>Chargement de la carte…</p>';
  SB.admCouverture().then(function(r){
    var rows = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
    var orph = rows.filter(function(x){ return x.statut === 'orphelin'; });
    var sans = orph.reduce(function(s,x){ return s + Number(x.nb_eleves||0); }, 0);
    function tbody(){
      return rows.map(function(x){
        return '<tr><td>' + x.wilaya + '</td><td>' + x.nb_eleves + '</td><td>' + x.nb_agents_actifs + '</td>'
          + '<td><span class="org1-badge ' + x.statut + '">' + x.statut + '</span></td></tr>';
      }).join('');
    }
    mount.innerHTML = '<p class="org1-sum"><b>' + rows.length + '</b> wilayas · <b>' + orph.length + '</b> orphelines · <b>' + sans + '</b> élèves sans agent</p>'
      + '<table class="org1"><thead><tr>'
      + '<th data-k="wilaya">Wilaya ⇅</th><th data-k="nb_eleves">Élèves ⇅</th>'
      + '<th data-k="nb_agents_actifs">Agents ⇅</th><th>Statut</th></tr></thead>'
      + '<tbody>' + tbody() + '</tbody></table>';
    mount.querySelectorAll('th[data-k]').forEach(function(th){
      th.style.cursor = 'pointer';
      th.addEventListener('click', function(){
        var k = th.getAttribute('data-k');
        rows.sort(function(a,b){ return (Number(a[k])||0) - (Number(b[k])||0); });
        mount.querySelector('tbody').innerHTML = tbody();
      });
    });
  }).catch(function(err){
    mount.innerHTML = '<p class="org1-err">⛔ ' + String((err && err.message) || err) + '</p>';
  });
}

/* ── phase 6 (ADM-1) : onglet « الوكلاء والولايات · Agents & Wilayas » (admin_general) ── */
(function(){
  function esq(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function host(){ return document.querySelector('section[data-view="admin"]'); }
  async function renderAgents(){
    var h = host(); if(!h) return;
    var box = document.getElementById('admAgentsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admAgentsCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>🧑 الوكلاء والولايات · Agents & Wilayas</h2><p>☁️ client cloud indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agents.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var ag = await SB.admListAgents();
    var pf = await SB.admListProfiles();
    var html = '<h2>🧑 الوكلاء والولايات · Agents & Wilayas (ADM-1)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">Périmètres appliqués par la base (RLS) : un agent ne lit que ses wilayas ; révocation = effet immédiat.</p>';
    html += (ag.ok && ag.agents.length) ? ag.agents.map(function(a){
      var pr = a.profiles || {};
      return '<div class="rep-row"><span>' + esq(pr.pseudo || a.user_id.slice(0,8)) + ' · ' + esq(a.role_cle) + ' · wilaya ' + esq(a.code_wilaya) + '</span>'
        + '<span style="font-size:11px;color:var(--m);margin-left:6px">' + (a.active === false ? ' suspendu' : '✅ actif') + '</span>'
        + '<button class="btn btn-sm btn-o" data-adm-susp="' + a.user_id + '|' + (a.active === false ? '1' : '0') + '" type="button">' + (a.active === false ? 'réactiver' : 'suspendre') + '</button>'
        + '<button class="btn btn-sm btn-r" data-adm-rev="' + a.user_id + '" type="button">révoquer</button></div>';
    }).join('') : '<p>Aucun agent affecté pour l\'instant.</p>';
    html += '<div class="fld" style="margin-top:12px"><span>Affecter un agent</span>'
      + '<select id="admSelProf">' + (pf.ok ? pf.profiles.map(function(p){ return '<option value="' + p.id + '">' + esq(p.pseudo || p.id.slice(0,8)) + ' (' + esq(p.wilaya || '?') + ')</option>'; }).join('') : '<option value="">profils indisponibles</option>') + '</select>'
      + '<select id="admSelRole"><option value="responsable_regional">responsable_regional</option><option value="agent_paiement">agent_paiement</option><option value="responsable_pedagogique">responsable_pedagogique</option><option value="agent_support">agent_support</option></select>'
      + '<input id="admWil" placeholder="codes wilaya, ex : 16,31 (vide = wilaya du profil)">'
      + '<button class="btn btn-p btn-sm" data-adm-assign="1" type="button">affecter</button></div>';
    box.innerHTML = html;
    /* ORG-1 : montage de la carte de couverture (idempotent) */
    var mount = box.querySelector('.org1-mount');
    if(!mount){ mount = document.createElement('div'); mount.className = 'org1-mount'; box.appendChild(mount); }
    rendreCouvertureORG1(mount);
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm-rev],[data-adm-assign],[data-adm-susp]') : null;
    if(!t) return;
    var susp = t.getAttribute('data-adm-susp');
    if(susp){ var sp = susp.split('|'); SB.admSetAgentActive(sp[0], sp[1] === '1').then(function(r){ if(r.ok) renderAgents(); else window.alert('⛔ ' + r.err); }); return; }
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

/* ── phase 7 (ADM-2) : file de validation par wilaya + reçus + journal d'audit ──
   RECUFIX-1 : le reçu ne passe plus JAMAIS en navigation data: (page blanche) ni en
   URL publique d'objet (403 sur bucket prive). Trois formes reconnues :
   data: → blob objet URL · chemin nu (uid/fichier) → URL signée 1 h · http → chemin
   extrait puis signé. Téléchargement = fetch + contrôle res.ok + blob typé. */
(function(){
  function esq2(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function host2(){ return document.querySelector('section[data-view="admin"]'); }
  var lastQueueRows = [];
  function dataUrlToBlob(d){
    var i = d.indexOf(',');
    var mime = (String(d).match(/^data:([^;,]+)[;,]/) || [null,'application/octet-stream'])[1];
    var bin = atob(d.slice(i + 1).replace(/\s+/g,''));
    var arr = new Uint8Array(bin.length);
    for(var k = 0; k < bin.length; k++) arr[k] = bin.charCodeAt(k);
    return new Blob([arr], { type: mime });
  }
  function cheminDepuisUrl(u){
    var i = u.indexOf('/object/');
    if(i < 0) return null;
    var rest = u.slice(i + 8).replace(/^(public|sign|authenticated)\//,'').split('?')[0];
    try{ rest = decodeURIComponent(rest); }catch(e){}
    return rest.replace(/^prive\//,'');
  }
  function ouvrirRecu(pv, mode){
    pv = String(pv || '');
    if(!pv){ window.alert('⛔ لا يوجد مرفق لهذا الدفع'); return; }
    if(pv.indexOf('data:') === 0){
      var b = dataUrlToBlob(pv);
      var u = URL.createObjectURL(b);
      if(mode === 'dl'){
        var a = document.createElement('a');
        a.href = u; a.download = 'recu-' + Date.now() + (b.type.indexOf('pdf') !== -1 ? '.pdf' : '.jpg');
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(u); }, 4000);
      }else{
        window.open(u, '_blank');
        setTimeout(function(){ URL.revokeObjectURL(u); }, 60000);
      }
      return;
    }
    var path = pv;
    if(path.indexOf('http') === 0){ var p2 = cheminDepuisUrl(path); if(p2) path = p2; }
    path = path.replace(/^prive\//,'');
    SB.fileUrl(path).then(function(url){
      if(!url){ window.alert('⛔ تعذّر إنشاء رابط مؤقت للمرفق'); return; }
      if(mode === 'dl'){
        fetch(url).then(function(res){
          if(!res.ok) throw new Error('http ' + res.status);
          return res.blob();
        }).then(function(bl){
          var u2 = URL.createObjectURL(bl);
          var a = document.createElement('a');
          a.href = u2; a.download = path.split('/').pop() || 'recu';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function(){ URL.revokeObjectURL(u2); }, 4000);
        }).catch(function(e){ window.alert('⛔ ' + String((e && e.message) || e)); });
      }else{
        window.open(url, '_blank');
      }
    });
  }
  async function renderQueue(){
    var h = host2(); if(!h) return;
    var box = document.getElementById('admQueueCard');
    if(!box){ box = document.createElement('div'); box.id = 'admQueueCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>💳 Validations & reçus</h2><p>☁️ client cloud indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('payments.validate') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var q = await SB.admQueue();
    lastQueueRows = q.ok ? (q.rows || []) : [];
    var html = '<h2>💳 File de validation & reçus (ADM-2)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">Seuls les dossiers de ton périmètre (wilaya) apparaissent : le filtre vit dans la base. Confirmer → reçu possible ; rejeter = motif obligatoire ; tout laisse une trace au journal.</p>';
    html += q.ok && lastQueueRows.length ? lastQueueRows.map(function(r, i){
      var pr = r.profiles || {};
      return '<div class="rep-row"><span>#' + r.id + ' · ' + esq2(pr.pseudo || '?') + ' · ' + esq2(pr.wilaya || '?') + ' · ' + r.montant + ' ' + esq2(r.devise) + ' · ' + esq2(r.statut) + (r.preuve ? ' · 📎 مرفق' : '') + '</span>'
        + '<span style="display:flex;gap:6px;flex-wrap:wrap">'
        + (r.preuve ? '<button class="btn btn-sm btn-o" data-rec-q="' + i + '" type="button">📎 reçu</button>'
            + '<button class="btn btn-sm btn-g" data-rec-dl="' + i + '" type="button">⬇ télécharger</button>' : '')
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
    var t = e.target && e.target.closest ? e.target.closest('[data-adm2-conf],[data-adm2-rej],[data-adm2-rec],[data-rec-q],[data-rec-dl]') : null;
    if(!t) return;
    var rq = t.getAttribute('data-rec-q'), rd = t.getAttribute('data-rec-dl');
    if(rq !== null){ ouvrirRecu(lastQueueRows[+rq] && lastQueueRows[+rq].preuve, 'open'); return; }
    if(rd !== null){ ouvrirRecu(lastQueueRows[+rd] && lastQueueRows[+rd].preuve, 'dl'); return; }
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
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '<h2>📜 الاتفاقيات والإصدارات · Accords</h2><p>☁️ indisponible</p>'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agreements.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var r = await SB.admAgreements();
    var html = '<h2>📜 الاتفاقيات والإصدارات · Accords (ADM-3)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:10px">نشر نسخة جديدة يعطّل السابقة : القبولات الماضية تبقى غير قابلة للتعديل وتصبح « نسخة يلزم إعادة قبولها » · Publishing a new version disables the previous one : past acceptations stay immutable and become « to re-accept ».</p>'
      + (r.ok ? r.rows.map(function(a){ return '<div class="rep-row"><span>' + esq4(a.cle) + ' · v' + a.version + (a.actif ? ' · <b>active</b>' : ' · مؤرشفة · archived') + ' · ' + esq4(a.titre) + '</span><span style="font-size:11px;color:var(--m)">' + String(a.cree_at||'').slice(0,10) + '</span></div>'; }).join('') || '<p>Aucun accord.</p>' : '<p>⛔ ' + esq4(r.err) + '</p>')
      + '<div class="fld" style="margin-top:12px"><span>Publier une nouvelle version</span>'
      + '<input id="adm3Cle" placeholder="cle (ex : conditions_utilisation)" value="conditions_utilisation">'
      + '<input id="adm3Titre" placeholder="titre de la version">'
      + '<textarea id="adm3Corps" rows="4" placeholder="corps complet de la nouvelle version"></textarea>'
      + '<button class="btn btn-p btn-sm" data-adm3-pub="1" type="button">نشر النسخة · Publish version</button> <span id="adm3Out" style="font-size:12px"></span></div>';
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
    { id:'dash', label:'📊 لوحة القيادة · Dashboard', cards:['admDashCard'], perm:'reports.read' },
    { id:'classes', label:'🏫 الأقسام · Classes', cards:['admClassesCard'], perm:'reports.read' },
    { id:'wilayas', label:'🗺️ الولايات · Wilayas', cards:['admWilayasCard'], perm:'reports.read' },
    { id:'security', label:'🛡️ الوصول والتدقيق · Access & Audit', cards:['admSecurityCard'], perm:'reports.read' },
    { id:'system', label:'🖥️ النظام والبنية التقنية · System', cards:['admSystemCard'], perm:'reports.read' },
    { id:'students', label:'👥 التلاميذ والأولياء · Students & Parents', cards:['admStudentsCard','admVerificationCard'], perm:'students.read', altPerm:'students.verify' },
    { id:'ops', label:'🧰 العمليات · Operations', cards:['admAgentsCard','admQueueCard','admAccordsCard','__legacy__'], perm:null },
    { id:'settings', label:'⚙️ الإعدادات · Settings', cards:['admSettingsCard'], perm:'settings.manage' }
  ];
  var KNOWN = ['admDashCard','admClassesCard','admWilayasCard','admSecurityCard','admSystemCard','admStudentsCard','admVerificationCard','admSettingsCard','admAgentsCard','admQueueCard','admAccordsCard'];
  var state4 = { perms:[], tab:'dash', role:'', wilayas:[] };
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
    var legacyBody = document.getElementById('adminBody');
    if(legacyBody) legacyBody.hidden = (id !== 'ops');
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
    state4.role = meP.ok ? (meP.role||'') : '';
    state4.wilayas = meP.ok && Array.isArray(meP.wilayas) ? meP.wilayas : [];
    var bar = document.getElementById('admTabs');
    if(!bar){ bar = document.createElement('div'); bar.id = 'admTabs'; bar.className = 'tabs'; bar.style.position = 'static'; bar.style.height = 'auto'; bar.style.width = 'auto'; h.insertBefore(bar, h.firstChild); }
    bar.innerHTML = TABS.filter(function(t){ return !t.perm || state4.perms.indexOf(t.perm) !== -1 || (t.altPerm && state4.perms.indexOf(t.altPerm) !== -1) || (t.id==='students' && state4.role==='admin'); })
      .map(function(t){ return '<button class="tab" data-adm-tab="' + t.id + '" type="button">' + t.label + '</button>'; }).join('');
    applyTab(state4.tab);
  }
  async function renderDash(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admDashCard');
    if(!box){ box = document.createElement('div'); box.id = 'admDashCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="ad-load">⏳ تحميل مؤشرات النطاق وسجل التدقيق…</div>';
    var r = await SB.admDashboard();
    if(!r.ok){ box.innerHTML = '<h2>📊 لوحة القيادة</h2><p>⛔ ' + esq5(r.err) + '</p>'; return; }
    var d = r.dash || {};
    var au = await SB.admAuditLast(8);
    var scope = d.perimetre === 'national' ? 'وطني' : (d.perimetre || 'غير محدد');
    var scopeCount = d.perimetre === 'national' ? 'وطني' : (state4.wilayas.length ? String(state4.wilayas.length) : '—');
    function metric(value, label, icon){
      return '<div class="card mini"><div class="mini-i">' + icon + '</div><b>' + esq5(value) + '</b><p>' + label + '</p></div>';
    }
    var auditRows = au.ok ? (au.rows||[]).map(function(l){
      var actor = String(l.acteur||'');
      return '<div class="rep-row"><span>' + esq5(String(l.at||'').slice(0,16).replace('T',' '))
        + ' · ' + esq5(l.action) + ' · ' + esq5(l.cible_type) + ' #' + esq5(l.cible_id)
        + (l.wilaya ? ' · ' + esq5(l.wilaya) : '') + '</span><span style="font-size:11px;color:var(--m)">'
        + (actor ? 'منفّذ ' + esq5(actor.slice(0,8)) : 'منفّذ غير محدد') + '</span></div>';
    }).join('') : '<p>تعذر تحميل سجل التدقيق: ' + esq5(au.err||'غير متاح') + '</p>';
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">📊</span><div>'
      + '<h2>لوحة القيادة · نظرة عامة</h2><p class="ad-sub">مؤشرات حقيقية من قاعدة البيانات · نطاق الصلاحية: '
      + esq5(scope) + ' · الدور: ' + esq5(state4.role||'—') + '</p></div></div>'
      + '<div class="grid3" style="margin-top:12px">'
      + metric(d.eleves||0, 'التلاميذ ضمن نطاق الصلاحية', '🎓')
      + metric(d.verifications_attente||0, 'طلبات التحقق قيد الانتظار', '🪪')
      + metric(d.signalements_ouverts||0, 'التبليغات المفتوحة', '🚩')
      + metric(scopeCount, 'نطاق الولايات (وطني أو عدد الولايات المعيّنة)', '🗺️')
      + '</div>'
      + ((state4.perms.indexOf('students.verify') !== -1 || state4.role === 'admin') ? '<div style="margin-top:12px"><button class="btn btn-p btn-sm" data-adm-tab="students" type="button">🪪 فتح طلبات تفعيل التلاميذ</button></div>' : '')
      + '<div class="card" style="margin-top:14px"><b>📜 آخر إجراءات سجل التدقيق</b>'
      + (au.ok && au.rows && au.rows.length ? auditRows : (au.ok ? '<p>لا توجد إجراءات مسجلة بعد.</p>' : auditRows))
      + '</div>'
      + '<p style="font-size:11.5px;color:var(--m);margin-top:8px">المصدر: RPC admin_dashboard وسجل audit_logs. الأرقام محصورة في صلاحياتك ونطاق ولاياتك؛ لا تعرض هذه الصفحة أرقاماً تقديرية أو مؤشرات مالية.</p>';
  }
  async function loadAdminReference(path){
    try{
      var response = await fetch('/' + path);
      if(!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    }catch(e){
      return { _error: String(e && e.message || e) };
    }
  }
  async function renderClasses(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admClassesCard');
    if(!box){ box = document.createElement('div'); box.id = 'admClassesCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="ad-load">⏳ تحميل مرجع الأقسام…</div>';
    var data = await loadAdminReference('assets/bdd/classe.json?v=3511');
    if(data._error || !Array.isArray(data.sections)){
      box.innerHTML = '<h2>🏫 مرجع الأقسام</h2><p>تعذر تحميل المرجع من GitHub: ' + esq5(data._error||'بنية غير صالحة') + '</p>';
      return;
    }
    var rows = data.sections;
    var total = rows.reduce(function(sum, row){ return sum + (Number(row.eleves)||0); }, 0);
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">🏫</span><div><h2>مرجع الأقسام الدراسية</h2>'
      + '<p class="ad-sub">كتالوج ثابت من ملفات GitHub · سنة ' + esq5(data._meta && data._meta.annee_scolaire || '—') + '</p></div></div>'
      + '<div class="card" style="margin:12px 0;padding:12px;border-inline-start:4px solid var(--p)">'
      + '<b>تنبيه حول مصدر البيانات</b><p style="margin:5px 0 0">هذه بيانات مرجعية واردة في ملف maquette pédagogique. الأعداد المعروضة تقديرية/توضيحية ضمن النموذج، وليست عدد الحسابات المسجلة أو الحضور الفعلي في Supabase.</p></div>'
      + '<div class="grid3" style="margin-top:12px">'
      + '<div class="card mini"><b>' + rows.length + '</b><p>أقسام في المرجع</p></div>'
      + '<div class="card mini"><b>' + total + '</b><p>مجموع الأعداد المذكورة في النموذج فقط</p></div>'
      + '<div class="card mini"><b>' + esq5(data._meta && data._meta.annee_scolaire || '—') + '</b><p>السنة المرجعية</p></div></div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px">'
      + rows.map(function(row){
          return '<article class="card" style="padding:14px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center">'
            + '<b style="font-size:18px">' + esq5(row.ar||row.id) + '</b><span class="badge">' + esq5(row.niveau||'') + '</span></div>'
            + '<p style="margin:8px 0 4px">' + esq5(row.filiere||'') + '</p>'
            + '<p style="font-size:12px;color:var(--m)">📍 ' + esq5(row.salle||'—') + '</p>'
            + '<p style="font-size:12px;color:var(--m)">عدد التلاميذ في النموذج: ' + esq5(row.eleves) + '</p></article>';
        }).join('') + '</div>'
      + '<p style="font-size:11px;color:var(--m);margin-top:12px">المصدر: assets/bdd/classe.json · لا تُستخدم هذه البيانات لإثبات التسجيلات أو لتحديد صلاحيات الوصول.</p>';
  }
  async function renderWilayas(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admWilayasCard');
    if(!box){ box = document.createElement('div'); box.id = 'admWilayasCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="ad-load">⏳ تحميل قائمة الولايات…</div>';
    var data = await loadAdminReference('assets/bdd/wilaya.json?v=3511');
    if(data._error || !Array.isArray(data.wilayas)){
      box.innerHTML = '<h2>🗺️ مرجع الولايات</h2><p>تعذر تحميل المرجع من GitHub: ' + esq5(data._error||'بنية غير صالحة') + '</p>';
      return;
    }
    var regions = {};
    data.wilayas.forEach(function(w){ (regions[w.region||'غير مصنف']||(regions[w.region||'غير مصنف']=[])).push(w); });
    var regionNames = Object.keys(regions).sort();
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">🗺️</span><div><h2>المرجع الجغرافي للولايات</h2>'
      + '<p class="ad-sub">قائمة GitHub المرجعية · ' + data.wilayas.length + ' ولاية · ليست إحصاءات تسجيلات</p></div></div>'
      + '<div class="fld" style="margin:12px 0"><span>ابحث عن ولاية بالاسم أو الرمز</span><input id="admWilayaSearch" type="search" placeholder="مثال: برج بوعريريج أو 34" autocomplete="off"></div>'
      + '<div id="admWilayaResults">'
      + regionNames.map(function(region){
          return '<section style="margin:12px 0"><h3>' + esq5(region) + ' · ' + regions[region].length + '</h3>'
            + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px">'
            + regions[region].map(function(w){
                return '<div class="rep-row" data-wilaya-search="' + esq5([w.code,w.ar,w.fr,w.region].join(' ').toLowerCase()) + '">'
                  + '<b>' + esq5(w.code) + ' · ' + esq5(w.ar) + '</b><span>' + esq5(w.fr) + '</span></div>';
              }).join('') + '</div></section>';
        }).join('') + '</div>'
      + '<p style="font-size:11px;color:var(--m);margin-top:12px">المصدر: assets/bdd/wilaya.json · القائمة officielle de 58 wilayas. Les affectations et autorisations de chaque administrateur sont déterminées séparément par Supabase (admin_sees_wilaya / RLS).</p>';
  }
  async function renderSecurity(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admSecurityCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSecurityCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="ad-load">⏳ تحميل صلاحيات الحساب وسجل التدقيق…</div>';
    var audit = (window.SB && SB.admAuditLast) ? await SB.admAuditLast(20) : {ok:false,err:'سجل التدقيق غير متاح'};
    var permissions = state4.perms.length
      ? state4.perms.map(function(p){ return '<span class="badge" style="display:inline-block;margin:3px">' + esq5(p) + '</span>'; }).join('')
      : '<p>لا توجد صلاحيات إدارية معادة لهذا الحساب.</p>';
    var wilayas = state4.wilayas.length
      ? state4.wilayas.map(function(w){ return '<span class="badge" style="display:inline-block;margin:3px">' + esq5(w) + '</span>'; }).join('')
      : '<p>لم تُرجع خدمة الصلاحيات أي ولاية مخصصة لهذا الحساب.</p>';
    var rows = audit.ok ? (audit.rows||[]).map(function(l){
      var actor = String(l.acteur||'');
      return '<div class="rep-row"><span>' + esq5(String(l.at||'').slice(0,16).replace('T',' '))
        + ' · ' + esq5(l.action) + ' · ' + esq5(l.cible_type) + ' #' + esq5(l.cible_id)
        + (l.wilaya ? ' · ' + esq5(l.wilaya) : '') + '</span><span style="font-size:11px;color:var(--m)">'
        + (actor ? esq5(actor.slice(0,8)) : 'غير محدد') + '</span></div>';
    }).join('') : '<p>تعذر قراءة سجل التدقيق: ' + esq5(audit.err||'غير متاح') + '</p>';
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">🛡️</span><div><h2>الوصول الإداري وسجل التدقيق</h2>'
      + '<p class="ad-sub">معلومات الحساب الحالي كما أعادتها خدمة الصلاحيات في Supabase</p></div></div>'
      + '<div class="grid3" style="margin-top:12px">'
      + '<div class="card mini"><b>' + esq5(state4.role||'—') + '</b><p>الدور الإداري الحالي</p></div>'
      + '<div class="card mini"><b>' + state4.perms.length + '</b><p>مفاتيح الصلاحيات المعادة</p></div>'
      + '<div class="card mini"><b>' + state4.wilayas.length + '</b><p>الولايات المخصصة للحساب</p></div></div>'
      + '<div class="card" style="margin-top:12px"><b>🔑 الصلاحيات الفعلية المعادة</b><div style="margin-top:8px">' + permissions + '</div></div>'
      + '<div class="card" style="margin-top:12px"><b>🗺️ رموز الولايات المخصصة</b><div style="margin-top:8px">' + wilayas + '</div></div>'
      + '<div class="card" style="margin-top:12px"><b>📜 آخر 20 عملية في سجل التدقيق</b>'
      + (audit.ok && audit.rows && audit.rows.length ? rows : (audit.ok ? '<p>لا توجد عمليات مسجلة في النتيجة المعادة.</p>' : rows))
      + '</div><p style="font-size:11px;color:var(--m);margin-top:10px">هذه الصفحة تعرض صلاحيات الحساب وسجل العمليات المتاح وفق RLS. وهي ليست نظام كشف تهديدات أو مراقبة جلسات مباشرة؛ لا تعرض أحداثاً لم توفرها المصادر الحالية.</p>';
  }
  function renderSystem(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admSystemCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSystemCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">🖥️</span><div><h2>النظام والبنية التقنية</h2>'
      + '<p class="ad-sub">جرد ثابت مستخرج من ملفات إعداد المشروع — لا يمثل فحصاً مباشراً للخوادم</p></div></div>'
      + '<div class="grid3" style="margin-top:12px">'
      + '<div class="card mini"><b>Cloudflare Worker</b><p>نقطة الدخول المعرّفة في wrangler.toml</p></div>'
      + '<div class="card mini"><b>ASSETS</b><p>ربط الملفات الثابتة من مجلد المشروع</p></div>'
      + '<div class="card mini"><b>غير مقاس</b><p>زمن الاستجابة والتوافر الفعلي</p></div></div>'
      + '<div class="card" style="margin-top:12px"><b>⚙️ إعدادات المصدر</b>'
      + '<div class="rep-row"><span>ملف إعداد النشر</span><code>wrangler.toml</code></div>'
      + '<div class="rep-row"><span>مدخل Worker</span><code>src/site-worker.js</code></div>'
      + '<div class="rep-row"><span>تاريخ التوافق المعلن</span><code>2024-09-01</code></div>'
      + '<div class="rep-row"><span>مجلد الأصول الثابتة</span><code>./</code></div>'
      + '<div class="rep-row"><span>اسم الربط</span><code>ASSETS</code></div></div>'
      + '<div class="card" style="margin-top:12px"><b>🔐 حارس المحتوى</b>'
      + '<p>يحتوي Worker على تحقق خادمي لمسارات محتوى محددة باستخدام رمز Bearer، ويستعلم عن جدول <code>lesson_content</code> عبر Supabase REST وسياسات الوصول الموجودة.</p>'
      + '<p>أسماء متغيرات البيئة المطلوبة في المصدر: <code>SUPABASE_URL</code> و<code>SUPABASE_ANON_KEY</code>. لا تُعرض قيم الأسرار في هذه الواجهة.</p>'
      + '<p>عند غياب المتغيرات، يعيد المسار المحمي خطأ إعداد HTTP 503؛ وغياب الرمز أو فشل التحقق يمنع تسليم المحتوى المحمي.</p></div>'
      + '<div class="card" style="margin-top:12px"><b>📡 حدود المراقبة الحالية</b>'
      + '<div class="rep-row"><span>مسار /health أو /metrics في Worker</span><b>غير موجود في المصدر المفحوص</b></div>'
      + '<div class="rep-row"><span>معالج مجدول أو Cron في Worker</span><b>غير موجود في المصدر المفحوص</b></div>'
      + '<div class="rep-row"><span>قياس uptime / CPU / mémoire / latence</span><b>غير متاح من هذه الملفات</b></div>'
      + '<div class="rep-row"><span>حالة النشر الفعلية أو صحة Supabase</span><b>غير متحققة هنا</b></div>'
      + '<p style="font-size:11.5px;color:var(--m);margin-top:8px">هذا جرد تكويني للشفرة فقط. لا يرسل طلبات فحص، ولا يقرأ الأسرار، ولا يدّعي أن الخدمة متاحة الآن. يلزم مصدر مراقبة خادمي مستقل قبل عرض مؤشرات تشغيلية حية.</p></div>'
      + '<p style="font-size:11px;color:var(--m);margin-top:10px">المصادر: wrangler.toml وsrc/site-worker.js · صلاحية العرض: reports.read.</p>';
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
  async function renderVerificationQueue(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admVerificationCard');
    if(!box){ box = document.createElement('div'); box.id = 'admVerificationCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('students.verify') === -1 && state4.role !== 'admin'){ box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<h2>🪪 طلبات تفعيل التلاميذ · School verification</h2><p class="ad-load">⏳ تحميل الطلبات المعلّقة…</p>';
    if(!window.SB || typeof SB.msgVerificationQueue !== 'function'){
      box.innerHTML = '<h2>🪪 طلبات تفعيل التلاميذ</h2><p>⛔ خدمة التحقق غير متاحة في هذا الإصدار.</p>'; return;
    }
    var q = await SB.msgVerificationQueue();
    if(!q || !q.ok){
      box.innerHTML = '<h2>🪪 طلبات تفعيل التلاميذ</h2><p>⛔ تعذر تحميل الطلبات: ' + esq5(q && q.err || 'خطأ غير محدد') + '</p><p style="font-size:12px;color:var(--m)">تأكد من صلاحية messaging.moderate ومن سياسات Supabase. لم يتم تغيير أي حالة.</p>'; return;
    }
    var rows = Array.isArray(q.queue) ? q.queue : [];
    box.innerHTML = '<div class="ad-hero"><span class="ad-crest">🪪</span><div><h2>طلبات تفعيل التلاميذ</h2><p class="ad-sub">طلبات الهوية المدرسية المعلّقة · الصلاحية المطلوبة: students.verify · ' + rows.length + ' طلب</p></div></div>'
      + (rows.length ? rows.map(function(x){
          return '<article class="card" style="margin:10px 0;padding:12px">'
            + '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>👤 ' + esq5(x.pseudo||'تلميذ') + '</b><span class="badge">قيد المراجعة</span></div>'
            + '<div class="rep-row"><span>المستوى: ' + esq5(x.niveau||'—') + ' · الولاية: ' + esq5(x.wilaya||'—') + ' · الشعبة: ' + esq5(x.filiere||'—') + '</span></div>'
            + '<div class="rep-row"><span>رقم التسجيل: ' + esq5(x.matricule||'—') + ' · القسم المصرّح به: ' + esq5(x.section||'—') + '</span></div>'
            + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
            + '<button class="btn btn-sm btn-g" data-adm-verif="' + esq5(x.id) + '" data-status="verifie" type="button">✔ تأكيد التفعيل</button>'
            + '<button class="btn btn-sm btn-r" data-adm-verif="' + esq5(x.id) + '" data-status="rejete" type="button">رفض الطلب</button></div></article>';
        }).join('') : '<div class="card" style="margin-top:10px"><p>لا توجد طلبات تفعيل معلّقة حالياً.</p></div>')
      + '<p style="font-size:11.5px;color:var(--m);margin-top:8px">لا يؤدي ظهور الطلب إلى تفعيل تلقائي. القرار يتطلب مراجعة بشرية، وتتحقق قاعدة البيانات من صلاحية المشرف عند تنفيذ الإجراء.</p>';
  }
  async function renderSettings(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admSettingsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSettingsCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('settings.manage') === -1){ box.hidden = true; return; }
    var r = await SB.admSettings();
    box.innerHTML = '<h2>⚙️ إعدادات المنصة · Platform settings</h2>'
      + (r.ok ? r.rows.map(function(s){ return '<div class="fld" style="margin-top:8px"><span>' + esq5(s.cle) + ' (maj ' + String(s.maj_at||'').slice(0,10) + ')</span>'
          + '<textarea id="admSet_' + esq5(s.cle) + '" rows="3">' + esq5(JSON.stringify(s.valeur)) + '</textarea>'
          + '<button class="btn btn-p btn-sm" data-adm4-save="' + esq5(s.cle) + '" type="button">enregistrer</button></div>'; }).join('') : '<p>⛔ ' + esq5(r.err) + '</p>')
      + '<p style="font-size:11.5px;color:var(--m);margin-top:8px">Valeurs JSON ; chaque enregistrement passe par setting_set (permission settings.manage) et laisse une ligne au journal d’audit.</p>';
  }
  document.addEventListener('input', function(e){
    if(!e.target || e.target.id !== 'admWilayaSearch') return;
    var q = String(e.target.value||'').trim().toLowerCase();
    var rows = document.querySelectorAll('#admWilayaResults [data-wilaya-search]');
    Array.prototype.forEach.call(rows, function(row){ row.hidden = q !== '' && row.getAttribute('data-wilaya-search').indexOf(q) === -1; });
  });
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm-tab],[data-adm4-search],[data-adm4-save],[data-adm4-stu],[data-adm-verif]') : null;
    if(!t) return;
    var verifyId = t.getAttribute('data-adm-verif');
    if(verifyId){
      var nextStatus = t.getAttribute('data-status');
      if(nextStatus !== 'verifie' && nextStatus !== 'rejete') return;
      if(!window.SB || typeof SB.msgSetVerification !== 'function'){ window.alert('⛔ خدمة التحقق غير متاحة'); return; }
      if(nextStatus === 'rejete' && !window.confirm('تأكيد رفض طلب التحقق؟')) return;
      t.disabled = true;
      SB.msgSetVerification(verifyId, nextStatus).then(function(r){
        if(r && r.ok){ renderVerificationQueue(); }
        else { t.disabled = false; window.alert('⛔ ' + esq5(r && r.err || 'تعذّر تحديث الطلب')); }
      }).catch(function(err){ t.disabled = false; window.alert('⛔ ' + esq5(err && err.message || err)); });
      return;
    }
    var tab = t.getAttribute('data-adm-tab');
    if(tab){ applyTab(tab); if(tab==='dash') renderDash(); if(tab==='classes') renderClasses(); if(tab==='wilayas') renderWilayas(); if(tab==='security') renderSecurity(); if(tab==='system') renderSystem(); if(tab==='students'){ renderStudents(); renderVerificationQueue(); } if(tab==='settings') renderSettings(); return; }
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
    if(String(v).indexOf('admin')>=0){ renderTabs().then(function(){ if(state4.tab==='dash') renderDash(); if(state4.tab==='students'){ renderStudents(); renderVerificationQueue(); } if(state4.tab==='settings') renderSettings(); }); }
  });
  if((location.hash||'').replace('#','') === 'admin') renderTabs().then(function(){ if(state4.tab==='dash') renderDash(); });
})();

/* ── phase 10 (ADM-5) : onglets 💰 Comptabilité & rapports + 🎫 الدعم · Support ─ */
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
    var html = '<h2>💰 المحاسبة والتقارير · Accounting & Reports (ADM-5)</h2>'
      + '<p style="font-size:12px;color:var(--m);margin-bottom:8px">Périmètre : ' + esq6(r.perimetre || '?') + ' · recettes ' + (r.recettes_da||0) + ' DA · remboursements ' + (r.remboursements_da||0) + ' · dépenses ' + (r.depenses_da||0) + ' · solde ' + ((r.recettes_da||0)-(r.remboursements_da||0)-(r.depenses_da||0)) + ' DA</p>';
    html += e.ok && e.rows.length ? e.rows.slice(0,40).map(function(x){
      return '<div class="rep-row"><span>' + String(x.at||'').slice(0,10) + ' · ' + esq6(x.sens) + ' · ' + esq6(x.categorie) + ' · ' + x.montant + ' ' + esq6(x.devise) + (x.wilaya ? ' · w' + esq6(x.wilaya) : '') + '</span><span style="font-size:11px;color:var(--m)">' + esq6(x.ref_type) + ' #' + esq6(x.ref_id) + (x.rapproche ? ' · ✅ مُطابق · matched' : '') + '</span>'
        + (x.rapproche ? '' : '<button class="btn btn-sm btn-o" data-adm5-rap="' + x.id + '" type="button">pointer</button>') + '</div>';
    }).join('') : '<p>aucune écriture pour l’instant</p>';
    html += '<div class="fld" style="margin-top:10px"><span>Rapport par période</span>'
      + '<input id="adm5Debut" type="date"> <input id="adm5Fin" type="date">'
      + '<button class="btn btn-sm btn-o" data-adm5-report="1" type="button">calculer</button>'
      + '<button class="btn btn-sm btn-g" data-adm5-csv="1" type="button">export CSV</button></div>'
      + '<pre id="adm5RepOut" style="background:var(--p2);border:1px solid var(--b);border-radius:10px;padding:8px;font-size:11px;max-height:160px;overflow:auto"></pre>';
    if(perms5.indexOf('accounting.manage') !== -1){
      html += '<div class="fld" style="margin-top:8px"><span>Dépense manuelle</span>'
        + '<input id="adm5Mont" type="number" placeholder="montant DA"> <input id="adm5Cat" placeholder="catégorie">'
        + '<button class="btn btn-sm btn-p" data-adm5-dep="1" type="button">enregistrer</button></div>'
      + '<div class="fld" style="margin-top:8px"><span>Clôture mensuelle (période YYYY-MM)</span>'
      + '<input id="adm5Per" placeholder="ex : 2026-09"> '
      + '<button class="btn btn-sm btn-g" data-adm5-close="1" type="button">clôturer</button> <span id="adm5CloseOut" style="font-size:12px"></span></div>';
    SB.admClosures().then(function(cl){
      var list = cl.ok && cl.rows.length ? cl.rows.map(function(c){ return '<div class="rep-row"><span>clôture ' + esq6(c.periode) + ' · ' + String(c.closed_at||'').slice(0,10) + '</span><span style="font-size:11px;color:var(--m)">solde ' + (((c.snapshot||{}).recettes_da||0) - ((c.snapshot||{}).remboursements_da||0) - ((c.snapshot||{}).depenses_da||0)) + ' DA</span></div>'; }).join('') : '';
      setTimeout(function(){ var b = document.getElementById('admComptaCard'); if(b && list) b.insertAdjacentHTML('beforeend', '<div style="margin-top:8px"><b style="font-size:12.5px">🔒 Clôtures</b>' + list + '</div>'); }, 0);
    });
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
    box.innerHTML = '<h2>🎫 الدعم · Support (dossiers de ton périmètre)</h2>'
      + (t.ok && t.rows.length ? t.rows.map(function(x){ var p = x.profiles || {};
          return '<div class="rep-row"><span>#' + x.id + ' · ' + esq6(p.pseudo||'?') + ' · ' + esq6(p.wilaya||'?') + ' · ' + esq6(x.sujet) + ' · ' + esq6(x.statut) + '</span>'
            + '<span style="display:flex;gap:6px">'
            + '<button class="btn btn-sm btn-o" data-adm5-tk="' + x.id + '|en_cours" type="button">prendre</button>'
            + '<button class="btn btn-sm btn-p" data-adm5-tk="' + x.id + '|resolu" type="button">résoudre</button></span></div>';
        }).join('') : '<p>aucun ticket ouvert dans ton périmètre</p>');
  }
  function showOnly(ids){
    var h = section5(); if(!h) return;
    var legacyBody = document.getElementById('adminBody');
    if(legacyBody) legacyBody.hidden = true;
    Array.prototype.slice.call(h.querySelectorAll('.card')).forEach(function(c){ c.hidden = ids.indexOf(c.id) === -1; });
    Array.prototype.slice.call(h.querySelectorAll('[data-adm-tab],[data-adm5-tab]')).forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-adm5-tab') && ids.indexOf(b.getAttribute('data-adm5-tab') === -1 ? '' : b.getAttribute('data-adm5-tab')) !== -1); });
  }
  async function mountTabs(){
    var h = section5(); if(!h) return;
    var bar = document.getElementById('admTabs'); if(!bar) return;
    if(!window.SB || !SB.admMyPerms){ return; }
    var meP = await SB.admMyPerms(); perms5 = meP.ok ? (meP.perms||[]) : [];
    if(!bar.querySelector('[data-adm5-tab="compta"]') && perms5.indexOf('reports.read') !== -1){
      bar.insertAdjacentHTML('beforeend', '<button class="tab" data-adm5-tab="compta" type="button">💰 المحاسبة والتقارير · Accounting & Reports</button>');
    }
    if(!bar.querySelector('[data-adm5-tab="support"]') && perms5.indexOf('tickets.handle') !== -1){
      bar.insertAdjacentHTML('beforeend', '<button class="tab" data-adm5-tab="support" type="button">🎫 الدعم · Support</button>');
    }
  }
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-adm5-tab],[data-adm5-report],[data-adm5-csv],[data-adm5-dep],[data-adm5-tk],[data-adm5-rap],[data-adm5-close],[data-adm-tab]') : null;
    if(!t) return;
    var tab5 = t.getAttribute('data-adm5-tab');
    if(tab5){
      var h = section5();
      Array.prototype.slice.call(h.querySelectorAll('[data-adm-tab],[data-adm5-tab]')).forEach(function(b){ b.classList.toggle('on', b === t); });
      if(tab5 === 'compta'){ showOnly(['admComptaCard']); renderCompta(); }
      if(tab5 === 'support'){ showOnly(['admSupportCard']); renderSupport(); }
      return;
    }
    /* UI-2 : un clic sur un onglet de la phase 9 ne masque QUE les cartes de la phase 10, pas toute la section */
    if(t.getAttribute('data-adm-tab')){ ['admComptaCard','admSupportCard'].forEach(function(id){ var c = document.getElementById(id); if(c) c.hidden = true; }); return; }
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
    var rap = t.getAttribute('data-adm5-rap');
    if(rap){ SB.admMarkRapproche(+rap, true).then(function(r){ if(r.ok) renderCompta(); else window.alert('⛔ ' + r.err); }); return; }
    if(t.getAttribute('data-adm5-close')){
      var per = (document.getElementById('adm5Per')||{}).value || '';
      if(!/^[0-9]{4}-[0-9]{2}$/.test(per)){ window.alert('⛔ période YYYY-MM attendue'); return; }
      SB.admCloseMonth(per).then(function(r){
        var o = document.getElementById('adm5CloseOut'); if(o) o.textContent = r.ok ? ('✅ ' + r.periode) : ('⛔ ' + r.err);
        if(r.ok) renderCompta();
      });
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

/* ══ PATCH-REC-1 · reçu visible dans #admin — pansement additif, réversible, marqueur __rec1 ══ */
(function () {
  try {
    if (window.__rec1) { return; }
    window.__rec1 = true;
    var RE_DATA = /data:(image\/[a-z0-9.+-]+|application\/pdf);base64,/i;
    function mkBtn(label, fn) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = label;
      b.style.cssText = 'margin:2px;cursor:pointer;';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        try { fn(); } catch (err) { /* jamais bloquer l'admin */ }
      });
      return b;
    }
    function fix(root) {
      var nodes = (root || document).querySelectorAll('td,div,span,p,li');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.children.length || el.getAttribute('data-rec1')) { continue; }
        var t = (el.textContent || '').trim();
        if (t.length < 120) { continue; }
        var m = t.match(RE_DATA);
        if (m) {
          var data = t.slice(t.indexOf(m[0])).replace(/\s+/g, '');
          el.setAttribute('data-rec1', '1');
          el.textContent = '';
          el.appendChild(mkBtn('📎 voir le reçu', function (d) { return function () {
            var w = window.open('', '_blank'); if (!w) { return; }
            if (d.indexOf('data:application/pdf') === 0) {
              w.document.write('<iframe src="' + d + '" style="width:100%;height:100%;border:0"></iframe>');
            } else {
              w.document.write('<img src="' + d + '" style="max-width:100%">');
            }
          }; }(data)));
          el.appendChild(mkBtn('⬇ télécharger', function (d) { return function () {
            var a = document.createElement('a');
            a.href = d;
            a.download = 'recu-' + Date.now() + (d.indexOf('data:application/pdf') === 0 ? '.pdf' : '.jpg');
            document.body.appendChild(a); a.click(); a.remove();
          }; }(data)));
        } else if (/^[A-Za-z0-9+\/=\s]+$/.test(t) && t.replace(/\s+/g, '').length > 300) {
          var raw = t.replace(/\s+/g, '');
          el.setAttribute('data-rec1', '1');
          el.textContent = '';
          el.appendChild(document.createTextNode('🧾 pièce jointe base64 (' + raw.length + ' car.) '));
          el.appendChild(mkBtn('⬇ télécharger .b64', function (r) { return function () {
            var blob = new Blob([r], { type: 'text/plain' });
            var u = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = u; a.download = 'piece-' + Date.now() + '.b64';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
          }; }(raw)));
        }
      }
    }
    var pending = false;
    function sched() {
      if (pending) { return; }
      pending = true;
      requestAnimationFrame(function () { pending = false; try { fix(document); } catch (e) {} });
    }
    sched();
    if (window.MutationObserver) {
      new MutationObserver(sched).observe(document.documentElement, { childList: true, subtree: true });
    }
    window.__rec1Fix = fix;
  } catch (e) { /* l'admin doit rester vivant quoi qu'il arrive */ }
})();
