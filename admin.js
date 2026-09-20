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
      + '<div class="card"><b>👥 Comptes (' + profs.length + ')</b>'
      + '<button class="btn btn-o btn-sm" id="adCsvP">⬇️ CSV</button>'
      + '<table class="ad-tab"><tr><th>pseudo</th><th>rôle</th><th>niveau</th><th>wilaya</th><th></th></tr>'
      + profs.map(x => '<tr><td>' + esc(x.pseudo || x.id.slice(0, 8)) + '</td>'
          + '<td><select class="ad-role" data-id="' + x.id + '">'
          + ['eleve','prof','parent','admin'].map(r =>
              '<option' + (r === x.role ? ' selected' : '') + '>' + r + '</option>').join('')
          + '</select></td><td>' + esc(x.niveau || '') + '</td><td>' + esc(x.wilaya || '')
          + '</td><td>' + esc((x.created_at || '').slice(0, 10)) + '</td></tr>').join('')
      + '</table></div>'
      + '<div class="card"><b>📝 Notes (' + notes.length + ')</b>'
      + '<button class="btn btn-o btn-sm" id="adCsvN">⬇️ CSV</button>'
      + '<table class="ad-tab"><tr><th>élève</th><th>trim.</th><th>/20</th><th>appréciation</th></tr>'
      + notes.map(n => {
          const el = profs.filter(x => x.id === n.eleve_id)[0];
          return '<tr><td>' + esc(el ? (el.pseudo || el.id.slice(0, 8)) : n.eleve_id.slice(0, 8))
            + '</td><td>' + esc(n.trimestre || '') + '</td><td><b>' + esc(n.valeur)
            + '</b></td><td>' + esc(n.appreciation || '') + '</td></tr>';
        }).join('') + '</table></div></div>';
    $('#adCsvP').addEventListener('click', () => telecharger('comptes.csv', csv(profs)));
    $('#adCsvN').addEventListener('click', () => telecharger('notes.csv', csv(notes)));
    box.querySelectorAll('.ad-role').forEach(s => s.addEventListener('change', async () => {
      const r = await window.SB.setRole(s.dataset.id, s.value);
      s.style.borderColor = r.ok ? 'var(--g)' : 'var(--r)';
      if(r.ok) setTimeout(render, 400);
    }));
  }
  function stat(v, l){ return '<div class="ad-s"><b>' + esc(v) + '</b><span>' + l + '</span></div>'; }
  window.renderAdmin = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'admin') render(); });
})();
