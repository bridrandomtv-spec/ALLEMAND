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
  (async () => {
    try{
      const p = await window.SB.myProfile();
      if(!p || p.role !== 'parent') return;
      box.insertAdjacentHTML('beforeend',
        '<div class="card cd-box"><h3>👨‍👩‍ ربط حساب الطفل (القرار C)</h3>'
        + '<p class="cd-sub">اربط حساب طفلك : ما دام اشتراكه هو نشطًا، ترى '
        + 'تقريره الأساسي من 👨‍👩‍👧 ؛ أما أدواتك المتقدمة فتبقى مرتبطة باشتراكك أنت.</p>'
        + '<div style="display:flex;gap:8px"><input id="lienEnfantMail" type="email" placeholder="البريد الإلكتروني لحساب الطفل" style="flex:1">'
        + '<button class="btn btn-g btn-sm" id="lienEnfantBtn">🔗 ربط</button></div>'
        + '<div id="liensEnfantsBody" style="margin-top:8px"><div class="cd-load">⏳</div></div></div>');
      $('#lienEnfantBtn').addEventListener('click', async () => {
        const mail = ($('#lienEnfantMail').value || '').trim();
        if(!mail) return;
        try{
          const sb = await window.SB.sb();
          const r = await sb.rpc('link_child', { p_email: mail });
          if(r && r.error) throw r.error;
          toast('✅ تم ربط حساب الطفل', 'ok'); chargerLiensEnfants();
        }catch(e){ toast('⚠️ ' + String((e && e.message) || e), 'ko'); }
      });
      chargerLiensEnfants();
    }catch(e){}
  })();
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

/* ── phase 5 : liens parent-enfant (décision C) ── */
async function chargerLiensEnfants(){
  const box = document.getElementById('liensEnfantsBody'); if(!box) return;
  try{
    const sb = await window.SB.sb();
    const r = await sb.rpc('my_linked_children');
    const rows = (r && r.data) || [];
    box.innerHTML = rows.length ? rows.map(c =>
      '<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:1">👧 '
      + (c.pseudo || String(c.child_id).slice(0, 8)) + '</span>'
      + '<button class="btn btn-o btn-sm" data-unlink="' + c.child_id + '">❌</button></div>').join('')
      : '<div class="cd-sub">aucun compte enfant lié</div>';
  }catch(e){ box.innerHTML = '<div class="cd-sub">⚠️ ' + String((e && e.message) || e) + ' (هل نفّذت plans.sql؟)</div>'; }
}
document.addEventListener('click', ev => {
  const b = ev.target.closest ? ev.target.closest('[data-unlink]') : null; if(!b) return;
  (async () => {
    try{
      const u = await window.SB.me(); const sb = await window.SB.sb();
      const r = await sb.from('child_links').delete().eq('parent_id', u.id).eq('child_id', b.getAttribute('data-unlink'));
      if(r && r.error) throw r.error;
      toast('✅ تم فك الرابط', 'ok'); chargerLiensEnfants();
    }catch(e){ toast('⚠️ ' + String((e && e.message) || e), 'ko'); }
  })();
});
