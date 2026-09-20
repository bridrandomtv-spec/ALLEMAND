/* cloud.js — vue ☁️ Cloud : auth Supabase, sync mémoire, documents privés */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function render(){
    const box = $('#cloudBody'); if(!box) return;
    if(!window.SB){ box.innerHTML = '<div class="cd-load">⏳ chargement du client cloud…</div>';
      document.addEventListener('dz:sbready', () => render(), { once:true }); return; }
    const u = await window.SB.me();
    if(!u){
      box.innerHTML =
          '<div class="cd-hero"><span class="cd-crest">☁️</span><div>'
        + '<h2>Espace cloud privé</h2><p class="cd-sub">compte réel Supabase : ta mémoire et tes '
        + 'documents te suivent sur tous tes appareils — chiffrés, privés, à toi.</p></div></div>'
        + '<div class="card cd-box"><form id="cdLogin">'
        + '<input type="email" id="cdMail" placeholder="email" required>'
        + '<input type="password" id="cdPass" placeholder="mot de passe" required>'
        + '<button class="btn btn-p btn-block" type="submit"> se connecter</button>'
        + '<button class="btn btn-o btn-block" type="button" id="cdUp">✨ créer un compte</button>'
        + '<div id="cdErr" class="cd-err" hidden></div></form></div>';
      $('#cdLogin').addEventListener('submit', async ev => {
        ev.preventDefault();
        const r = await window.SB.login($('#cdMail').value, $('#cdPass').value);
        if(r.ok) render(); else { const e = $('#cdErr'); e.hidden = false; e.textContent = r.err; }
      });
      $('#cdUp').addEventListener('click', async () => {
        const r = await window.SB.signup($('#cdMail').value, $('#cdPass').value,
          { pseudo: $('#cdMail').value.split('@')[0], role: 'eleve' });
        const e = $('#cdErr'); e.hidden = false;
        e.textContent = r.ok ? '✅ compte créé — vérifie ton email puis connecte-toi' : r.err;
      });
      return;
    }
    box.innerHTML =
        '<div class="cd-hero"><span class="cd-crest">☁️</span><div>'
      + '<h2>connecté : ' + esc(u.email) + '</h2>'
      + '<p class="cd-sub">sync + documents privés (bucket « prive », RLS owner-only)</p></div>'
      + '<button class="btn btn-o btn-sm" id="cdOut">déconnexion</button></div>'
      + '<div class="cd-grid">'
      + '<div class="card"><b>🧠 Mémoire</b>'
      + '<button class="btn btn-p btn-sm" id="cdPush">⬆️ pousser</button> '
      + '<button class="btn btn-o btn-sm" id="cdPull">⬇️ récupérer</button>'
      + '<div id="cdSync" class="cd-msg"></div></div>'
      + '<div class="card"><b>📂 Documents privés</b>'
      + '<input type="file" id="cdFile" multiple>'
      + '<div id="cdList" class="cd-list"></div></div></div>';
    $('#cdOut').addEventListener('click', async () => { await window.SB.logout(); render(); });
    $('#cdPush').addEventListener('click', async () => {
      const r = await window.SB.pushMemoire();
      $('#cdSync').textContent = r.ok ? ('✅ ' + r.n + ' carte(s) synchronisée(s)') : ('❌ ' + r.err);
    });
    $('#cdPull').addEventListener('click', async () => {
      const r = await window.SB.pullMemoire();
      $('#cdSync').textContent = r.ok ? ('✅ ' + r.n + ' carte(s) récupérée(s)') : ('❌ ' + r.err);
    });
    const liste = async () => {
      const r = await window.SB.listFiles();
      const el = $('#cdList');
      if(!r.ok){ el.textContent = '❌ ' + r.err; return; }
      el.innerHTML = (r.files || []).map(f =>
        '<div class="cd-f"><span>' + esc(f.nom) + '</span>'
        + '<button class="btn btn-o btn-sm" data-c="' + esc(f.chemin) + '">⬇️</button></div>').join('')
        || '<i>aucun document</i>';
      el.querySelectorAll('button').forEach(b => b.addEventListener('click', async () => {
        const url = await window.SB.fileUrl(b.dataset.c);
        if(url) window.open(url, '_blank');
      }));
    };
    liste();
    $('#cdFile').addEventListener('change', async ev => {
      for(const f of ev.target.files){ await window.SB.upload(f); }
      liste();
    });
  }
  window.renderCloud = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'cloud') render(); });
})();
