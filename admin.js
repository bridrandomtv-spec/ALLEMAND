/* admin.js — tableau de bord ADMIN réel (profils + notes via Supabase, RLS admin) */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&','<':'<','>':'>','"':'"',"'":'''}[c]));

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
    if(!window.SB){ box.innerHTML = '
⏳ client cloud…
';
      document.addEventListener('dz:sbready', () => render(), { once:true }); return; }
    const u = await window.SB.me();
    const p = u ? await window.SB.myProfile() : null;
    if(!u || !p || p.role !== 'admin'){
      box.innerHTML = '
🔒 accès réservé au rôle admin'
        + '
Connecte-toi d’abord dans ☁️ Cloud, puis exécute une fois dans SQL Editor :

'
        + '
update public.profiles set role = \'admin\'\n'
        + '  where id = (select id from auth.users\n'
        + '              where email = \'TON_EMAIL\');
';
      return;
    }
    const [pr, nt] = await Promise.all([window.SB.listProfiles(), window.SB.listNotes()]);
    const profs = pr.ok ? pr.rows : [], notes = nt.ok ? nt.rows : [];
    const eleves = profs.filter(x => x.role === 'eleve');
    const moy = notes.length
      ? (notes.reduce((s, n) => s + Number(n.valeur || 0), 0) / notes.length).toFixed(2) : '—';
    box.innerHTML =
        '
🛡️
'
      + '
الإدارة الفعلية · Real administration
متصل · connected : ' + esc(u.email)
      + ' · دور مدير · بيانات Supabase حية · admin role · live Supabase data

'
      + '
'
      + stat(profs.length, 'comptes') + stat(eleves.length, 'élèves')
      + stat(profs.filter(x => x.role === 'prof').length, 'profs')
      + stat(notes.length, 'notes') + stat(moy, 'moyenne /20') + '
'
      + '
'
      + '
👥 Konten (' + profs.length + ')'
      + '⬇️ CSV'
      + ''
      + profs.map(x => ''
          + '').join('')
      + '
pseudo	rôle	niveau	wilaya	
' + esc(x.pseudo || x.id.slice(0, 8)) + '	
' + esc(x.niveau || '') + '	' + esc(x.wilaya || '')
          + '	' + esc((x.created_at || '').slice(0, 10)) + '
'
      + '
📝 Noten (' + notes.length + ')'
      + '⬇️ CSV'
      + ''
      + notes.map(n => {
          const el = profs.filter(x => x.id === n.eleve_id)[0];
          return '';
        }).join('') + '
élève	trim.	/20	appréciation
' + esc(el ? (el.pseudo || el.id.slice(0, 8)) : n.eleve_id.slice(0, 8))
            + '	' + esc(n.trimestre || '') + '	' + esc(n.valeur)
            + '	' + esc(n.appreciation || '') + '
';
  box.insertAdjacentHTML('beforeend',
    '
💳 خطط الاشتراك — قابلة للإدارة (المرحلة 5)
'
    + '
الأسعار بالدج · حقل فارغ = « يُحدد لاحقًا » (القرار B) · '
    + 'المصدر : جدول public.plans (supabase/plans.sql)

'
    + '
⏳
');
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
      '
'
      + '
💳 Abonnements (' + subs.length + ' · '
      + CA.toLocaleString('fr-FR') + ' DA aktiv)'
      + ''
      + subs.map(s => '').join('') + '
user	plan	DA	statut	
' + esc(s.user_id.slice(0, 8)) + '	' + esc(s.plan)
        + '	' + s.montant + '	' + esc(s.statut) + '	'
        + ((s.statut === 'preuve' || s.statut === 'en_attente')
            ? '✅ ❌'
              + (s.preuve ? '
Beleg: ' + esc(s.preuve) + '
' : '')
            : '') + '
'
      + '
📢 Sponsoren (' + sps.length + ' · ' + ads.length + ' aktive Werbungen)'
      + ''
      + sps.map(s => '').join('') + '
nom	type	slot	statut	
' + esc(s.nom) + '	' + esc(s.type) + '	'
        + esc(s.slot) + '	' + esc(s.statut) + '	'
        + (s.statut === 'en_attente'
            ? '✅ '
              + '❌' : '')
        + '
'
      + '🆕 Werbung veröffentlichen'
      + '
Titel
Text
'
      + '
URL (optional)
'
      + '
accueil
'
      + 'veröffentlichen
';
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
      wrap.innerHTML = '🧾 سجل العمليات (المرحلة 6 — منفصل عن الاشتراكات)' + (rowsP.length
        ? ''
          + ''
          + rowsP.slice(0, 30).map(p => '').join('') + '
الاشتراك	الطريقة	دج	مرجع البنك	الحالة	ملاحظة
' + p.sub_id + '	' + esc(p.methode) + '	'
            + Number(p.montant || 0) + '	' + esc(p.ref_banque || '') + '	' + esc(p.statut)
            + '	' + esc(p.note_admin || '') + '
'
        : '
لا توجد عمليات مسجلة

');
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
  function stat(v, l){ return '
' + esc(v) + '' + l + '
'; }
  window.renderAdmin = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'admin') render(); });
})();

/* ── phase 5 : éditeur de plans (admin) — prix NULL autorisés (décision B) ── */
async function chargerPlansAdmin(){
  const box = document.getElementById('plansAdminBody'); if(!box) return;
  if(!window.SB || !window.SB.sb){ box.innerHTML = '
☁️ لا يوجد اتصال سحابي
'; return; }
  try{
    const sb = await window.SB.sb();
    const r = await sb.from('plans').select('id,role,duree_jours,prix_da,label_ar,actif').order('role').order('duree_jours');
    const rows = (r && r.data) || [];
    if(!rows.length){ box.innerHTML = '
⚠️ جدول الخطط فارغ — نفّذ supabase/plans.sql (محرر SQL)
'; return; }
    box.innerHTML = rows.map(p =>
      '
'
      + '
' + p.role + ' · ' + p.duree_jours + ' j · ' + (p.label_ar || '') + '
'
      + '
NULL
'
      + '
 actif
'
      + '💾
').join('');
  }catch(e){ box.innerHTML = '
⚠️ ' + String((e && e.message) || e) + '
'; }
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
    mount.innerHTML = '
🗺 Carte indisponible : méthode SB.admCouverture absente (règle B non collée).

';
    return;
  }
  mount.innerHTML = '
Chargement de la carte…

';
  SB.admCouverture().then(function(r){
    var rows = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
    var orph = rows.filter(function(x){ return x.statut === 'orphelin'; });
    var sans = orph.reduce(function(s,x){ return s + Number(x.nb_eleves||0); }, 0);
    function tbody(){
      return rows.map(function(x){
        return '' + x.wilaya + '' + x.nb_eleves + '' + x.nb_agents_actifs + ''
          + '' + x.statut + '';
      }).join('');
    }
    mount.innerHTML = '
' + rows.length + ' wilayas · ' + orph.length + ' orphelines · ' + sans + ' élèves sans agent

'
      + ''
      + ''
      + ''
      + '' + tbody() + '
Wilaya ⇅	Élèves ⇅	Agents ⇅	Statut
';
    mount.querySelectorAll('th[data-k]').forEach(function(th){
      th.style.cursor = 'pointer';
      th.addEventListener('click', function(){
        var k = th.getAttribute('data-k');
        rows.sort(function(a,b){ return (Number(a[k])||0) - (Number(b[k])||0); });
        mount.querySelector('tbody').innerHTML = tbody();
      });
    });
  }).catch(function(err){
    mount.innerHTML = '
⛔ ' + String((err && err.message) || err) + '

';
  });
}

/* ── phase 6 (ADM-1) : onglet « الوكلاء والولايات · Agents & Wilayas » (admin_general) ── */
(function(){
  function esq(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[c];}); }
  function host(){ return document.querySelector('section[data-view="admin"]'); }
  async function renderAgents(){
    var h = host(); if(!h) return;
    var box = document.getElementById('admAgentsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admAgentsCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '
🧑‍ الوكلاء والولايات · Agents & Wilayas
☁️ client cloud indisponible

'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agents.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var ag = await SB.admListAgents();
    var pf = await SB.admListProfiles();
    var html = '
🧑‍ الوكلاء والولايات · Agents & Wilayas (ADM-1)
'
      + '
Périmètres appliqués par la base (RLS) : un agent ne lit que ses wilayas ; révocation = effet immédiat.

';
    html += (ag.ok && ag.agents.length) ? ag.agents.map(function(a){
      var pr = a.profiles || {};
      return '
' + esq(pr.pseudo || a.user_id.slice(0,8)) + ' · ' + esq(a.role_cle) + ' · wilaya ' + esq(a.code_wilaya) + ''
        + '' + (a.active === false ? ' suspendu' : '✅ actif') + ''
        + '' + (a.active === false ? 'réactiver' : 'suspendre') + ''
        + 'révoquer
';
    }).join('') : '
Aucun agent affecté pour l\'instant.

';
    html += '
Affecter un agent'
      + '
' + esq(p.pseudo || p.id.slice(0,8)) + ' (' + esq(p.wilaya || '?') + ')
'
      + '
responsable_regional
'
      + '
codes wilaya, ex : 16,31 (vide = wilaya du profil)
'
      + 'affecter
';
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

/* ── phase 7 (ADM-2) : file de validation par wilaya + reçus + journal d'audit ── */
(function(){
  function esq2(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[c];}); }
  function host2(){ return document.querySelector('section[data-view="admin"]'); }
  async function renderQueue(){
    var h = host2(); if(!h) return;
    var box = document.getElementById('admQueueCard');
    if(!box){ box = document.createElement('div'); box.id = 'admQueueCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '
💳 Validations & reçus
☁️ client cloud indisponible

'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('payments.validate') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var q = await SB.admQueue();
    var html = '
💳 File de validation & reçus (ADM-2)
'
      + '
Seuls les dossiers de ton périmètre (wilaya) apparaissent : le filtre vit dans la base. Confirmer → reçu possible ; rejeter = motif obligatoire ; tout laisse une trace au journal.

';
    html += q.ok && q.rows.length ? q.rows.map(function(r){
      var pr = r.profiles || {};
      return '
#' + r.id + ' · ' + esq2(pr.pseudo || '?') + ' · ' + esq2(pr.wilaya || '?') + ' · ' + r.montant + ' ' + esq2(r.devise) + ' · ' + esq2(r.statut) + (r.preuve ? (String(r.preuve).indexOf('data:') === 0
          ? ' 📎 reçu'
          : ' · preuve : ' + esq2(String(r.preuve).slice(0, 24))) : '') + ''
        + '
'
        + 'confirmer'
        + 'rejeter'
        + '
';
    }).join('') : '
Aucun dossier en attente dans ton périmètre.

';
    html += '
🧾 Émettre un reçu (paiement confirmé) '
      + '
id du paiement
'
      + 'émettre 
';
    if((meP.perms||[]).indexOf('reports.read') !== -1){
      var au = await SB.admAuditLast(12);
      html += '
📜 Journal d’audit (12 dernières)
'
        + (au.ok ? au.rows.map(function(l){ return '
' + String(l.at||'').slice(0,16).replace('T',' ') + ' · ' + esq2(l.action) + ' · ' + esq2(l.cible_type) + ' #' + esq2(l.cible_id) + (l.wilaya ? ' · w' + esq2(l.wilaya) : '') + '' + esq2(JSON.stringify(l.apres||{}).slice(0,60)) + '
'; }).join('') || '
journal vide

' : '
⛔ ' + esq2(au.err) + '

');
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
  function esq4(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[c];}); }
  async function renderAccordsAdmin(){
    var h = document.querySelector('section[data-view="admin"]'); if(!h) return;
    var box = document.getElementById('admAccordsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admAccordsCard'; box.className = 'card'; h.appendChild(box); }
    if(!window.SB || !SB.admMyPerms){ box.innerHTML = '
📜 الاتفاقيات والإصدارات · Accords
☁️ indisponible

'; return; }
    var meP = await SB.admMyPerms();
    if(!meP.ok || (meP.perms||[]).indexOf('agreements.manage') === -1){ box.hidden = true; return; }
    box.hidden = false;
    var r = await SB.admAgreements();
    var html = '
📜 الاتفاقيات والإصدارات · Accords (ADM-3)
'
      + '
نشر نسخة جديدة يعطّل السابقة : القبولات الماضية تبقى غير قابلة للتعديل وتصبح « نسخة يلزم إعادة قبولها » · Publishing a new version disables the previous one : past acceptations stay immutable and become « to re-accept ».

'
      + (r.ok ? r.rows.map(function(a){ return '
' + esq4(a.cle) + ' · v' + a.version + (a.actif ? ' · active' : ' · مؤرشفة · archived') + ' · ' + esq4(a.titre) + '' + String(a.cree_at||'').slice(0,10) + '
'; }).join('') || '
Aucun accord.

' : '
⛔ ' + esq4(r.err) + '

')
      + '
Publier une nouvelle version'
      + '
conditions_utilisation
'
      + '
titre de la version
'
      + '
corps complet de la nouvelle version

'
      + 'نشر النسخة · Publish version 
';
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
  function esq5(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[c];}); }
  var TABS = [
    { id:'dash', label:'📊 لوحة القيادة · Dashboard', cards:['admDashCard'], perm:'reports.read' },
    { id:'students', label:'👥 التلاميذ والأولياء · Students & Parents', cards:['admStudentsCard'], perm:'students.read' },
    { id:'ops', label:'🧰 العمليات · Operations', cards:['admAgentsCard','admQueueCard','admAccordsCard','__legacy__'], perm:null },
    { id:'settings', label:'⚙️ الإعدادات · Settings', cards:['admSettingsCard'], perm:'settings.manage' }
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
      .map(function(t){ return '' + t.label + ''; }).join('');
    applyTab(state4.tab);
  }
  async function renderDash(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admDashCard');
    if(!box){ box = document.createElement('div'); box.id = 'admDashCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('reports.read') === -1){ box.hidden = true; return; }
    var r = await SB.admDashboard();
    if(!r.ok){ box.innerHTML = '
📊 لوحة القيادة · Dashboard
⛔ ' + esq5(r.err) + '

'; return; }
    var d = r.dash || {};
    box.innerHTML = '
📊 لوحة القيادة · Dashboard (النطاق · scope : ' + esq5(d.perimetre) + ')
'
      + '
'
      + '
🎓
' + (d.eleves||0) + '
تلاميذ النطاق · students in scope

'
      + '
⏳
' + (d.paiements_attente||0) + '
paiements à traiter

'
      + '
💰
' + (d.recettes_confirmees_da||0) + ' DA
recettes confirmées

'
      + '
↩️
' + (d.remboursements||0) + '
remboursements tracés

'
      + '
🪪
' + (d.verifications_attente||0) + '
vérifications d’identité

'
      + '
🚩
' + (d.signalements_ouverts||0) + '
signalements ouverts

'
      + '
Chiffres calculés côté base, filtrés par wilaya : un agent régional ne voit jamais le national.

';
  }
  async function renderStudents(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admStudentsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admStudentsCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('students.read') === -1){ box.hidden = true; return; }
    box.innerHTML = '
👥 Élèves & parents
'
      + '
Rechercher un élève (pseudo)
ex : amin
'
      + 'chercher
'
      + '
';
  }
  async function renderSettings(){
    var h = section(); if(!h) return;
    var box = document.getElementById('admSettingsCard');
    if(!box){ box = document.createElement('div'); box.id = 'admSettingsCard'; box.className = 'card'; h.appendChild(box); }
    if(state4.perms.indexOf('settings.manage') === -1){ box.hidden = true; return; }
    var r = await SB.admSettings();
    box.innerHTML = '
⚙️ إعدادات المنصة · Platform settings
'
      + (r.ok ? r.rows.map(function(s){ return '
' + esq5(s.cle) + ' (maj ' + String(s.maj_at||'').slice(0,10) + ')'
          + '
' + esq5(JSON.stringify(s.valeur)) + '
'
          + 'enregistrer
'; }).join('') : '
⛔ ' + esq5(r.err) + '

')
      + '
Valeurs JSON ; chaque enregistrement passe par setting_set (permission settings.manage) et laisse une ligne au journal d’audit.

';
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
        list.innerHTML = r.ok ? (r.rows.map(function(p){ return '
' + esq5(p.pseudo) + ' · ' + esq5(p.niveau||'?') + ' · ' + esq5(p.wilaya||'?') + ' · ' + esq5(p.verif_statut||'') + 'fiche
'; }).join('') || '
aucun résultat

') : '
⛔ ' + esq5(r.err) + '

';
      });
      return;
    }
    var stu = t.getAttribute('data-adm4-stu');
    if(stu){
      SB.admStudent(stu).then(function(r){
        var f = document.getElementById('admStuFiche'); if(!f) return;
        f.innerHTML = r.ok ? '
' + esq5(JSON.stringify(r.fiche, null, 1)) + '
' : '
⛔ ' + esq5(r.err) + '

';
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

/* ── phase 10 (ADM-5) : onglets 💰 Comptabilité & rapports + 🎫 الدعم · Support ─ */
(function(){
  function esq6(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[c];}); }
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
    var html = '
💰 المحاسبة والتقارير · Accounting & Reports (ADM-5)
'
      + '
Périmètre : ' + esq6(r.perimetre || '?') + ' · recettes ' + (r.recettes_da||0) + ' DA · remboursements ' + (r.remboursements_da||0) + ' · dépenses ' + (r.depenses_da||0) + ' · solde ' + ((r.recettes_da||0)-(r.remboursements_da||0)-(r.depenses_da||0)) + ' DA

';
    html += e.ok && e.rows.length ? e.rows.slice(0,40).map(function(x){
      return '
' + String(x.at||'').slice(0,10) + ' · ' + esq6(x.sens) + ' · ' + esq6(x.categorie) + ' · ' + x.montant + ' ' + esq6(x.devise) + (x.wilaya ? ' · w' + esq6(x.wilaya) : '') + '' + esq6(x.ref_type) + ' #' + esq6(x.ref_id) + (x.rapproche ? ' · ✅ مُطابق · matched' : '') + ''
        + (x.rapproche ? '' : 'pointer') + '
';
    }).join('') : '
aucune écriture pour l’instant

';
    html += '
Rapport par période'
      + '
jj/mm/aaaa
 
jj/mm/aaaa
'
      + 'calculer'
      + 'export CSV
'
      + '
';
    if(perms5.indexOf('accounting.manage') !== -1){
      html += '
Dépense manuelle'
        + '
montant DA
 
catégorie
'
        + 'enregistrer
'
      + '
Clôture mensuelle (période YYYY-MM)'
      + '
ex : 2026-09
 '
      + 'clôturer 
';
    SB.admClosures().then(function(cl){
      var list = cl.ok && cl.rows.length ? cl.rows.map(function(c){ return '
clôture ' + esq6(c.periode) + ' · ' + String(c.closed_at||'').slice(0,10) + 'solde ' + (((c.snapshot||{}).recettes_da||0) - ((c.snapshot||{}).remboursements_da||0) - ((c.snapshot||{}).depenses_da||0)) + ' DA
'; }).join('') : '';
      setTimeout(function(){ var b = document.getElementById('admComptaCard'); if(b && list) b.insertAdjacentHTML('beforeend', '
🔒 Clôtures' + list + '
'); }, 0);
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
    box.innerHTML = '
🎫 الدعم · Support (dossiers de ton périmètre)
'
      + (t.ok && t.rows.length ? t.rows.map(function(x){ var p = x.profiles || {};
          return '
#' + x.id + ' · ' + esq6(p.pseudo||'?') + ' · ' + esq6(p.wilaya||'?') + ' · ' + esq6(x.sujet) + ' · ' + esq6(x.statut) + ''
            + '
'
            + 'prendre'
            + 'résoudre
';
        }).join('') : '
aucun ticket ouvert dans ton périmètre

');
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
      bar.insertAdjacentHTML('beforeend', '💰 المحاسبة والتقارير · Accounting & Reports');
    }
    if(!bar.querySelector('[data-adm5-tab="support"]') && perms5.indexOf('tickets.handle') !== -1){
      bar.insertAdjacentHTML('beforeend', '🎫 الدعم · Support');
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
              w.document.write('');
            } else {
              w.document.write('');
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
