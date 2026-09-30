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
        : '<p style="opacity:.7">aucun payment enregistré</p>');
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
