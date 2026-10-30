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
      $('#cdUp').addEventListener('click', () => {
  const e = $('#cdErr');

  e.hidden = false;
  e.textContent =
    'أنشئ حسابك من استمارة التسجيل الرئيسية لإدخال الولاية والمستوى والشعبة.';
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
      if(!p) return;
      if(p.role === 'parent'){
        box.insertAdjacentHTML('beforeend',
          '<div class="card cd-box"><h3>👨‍👩‍👧 ربط حساب الطفل</h3>'
          + '<p class="cd-sub">أرسل طلب الربط إلى حساب التلميذ. لن يُفعّل الرابط إلا بعد موافقة التلميذ.</p>'
          + '<div style="display:flex;gap:8px"><input id="lienEnfantMail" type="email" placeholder="البريد الإلكتروني لحساب الطفل" style="flex:1">'
          + '<button class="btn btn-g btn-sm" id="lienEnfantBtn">إرسال الطلب</button></div>'
          + '<div id="liensEnfantsBody" style="margin-top:8px"><div class="cd-load">⏳</div></div></div>');
        $('#lienEnfantBtn').addEventListener('click', async () => {
          const mail = ($('#lienEnfantMail').value || '').trim();
          if(!mail) return;
          const btn=$('#lienEnfantBtn'); btn.disabled=true;
          try{
            const r=await window.SB.requestChildLink(mail);
            if(!r.ok) throw new Error(r.err || 'تعذر إرسال الطلب');
            toast('📨 تم تسجيل الطلب. ينتظر موافقة التلميذ.', 'ok');
            $('#lienEnfantMail').value='';
            await chargerLiensEnfants();
          }catch(e){ toast('⚠️ '+String(e.message||e), 'ko'); }
          finally{ btn.disabled=false; }
        });
        await chargerLiensEnfants();
      } else if(p.role === 'eleve'){
        box.insertAdjacentHTML('beforeend',
          '<div class="card cd-box"><h3>👨‍👩‍👧 طلبات ربط وليّ الأمر</h3>'
          + '<p class="cd-sub">راجع هوية وليّ الأمر قبل قبول الطلب. قبولك هو الذي يفعّل الربط.</p>'
          + '<div id="demandesParentsBody"><div class="cd-load">⏳</div></div></div>');
        await chargerDemandesParents();
      }
    }catch(e){ console.warn('[parent-link-ui]',e); }
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


/* ── PARENT-1 : affichage des liens confirmés et des demandes ── */
const escParentLink = s => String(s==null?'':s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
async function chargerLiensEnfants(){
  const box=document.getElementById('liensEnfantsBody'); if(!box) return;
  try{
    const [links,requests]=await Promise.all([
      window.SB.my_linked_children(),
      window.SB.myChildLinkRequests()
    ]);
    const rows=(links && links.data)||[];
    const req=(requests && requests.rows)||[];
    const linked=rows.length ? rows.map(c =>
      '<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:1">👧 '
      + (escParentLink(c.pseudo||String(c.child_id).slice(0,8))) + '</span>'
      + '<button class="btn btn-o btn-sm" data-unlink="' + escParentLink(c.child_id) + '">فك الربط</button></div>'
    ).join('') : '<div class="cd-sub">لا توجد روابط مؤكدة بعد.</div>';
    const pending=req.filter(x=>x.status==='pending').map(x =>
      '<div style="display:flex;gap:8px;align-items:center;margin:4px 0"><span style="flex:1">⏳ '
      + escParentLink(x.child_pseudo||String(x.child_id).slice(0,8)) + ' — في انتظار الموافقة</span>'
      + '<button class="btn btn-o btn-sm" data-cancel-request="' + escParentLink(x.request_id) + '">إلغاء</button></div>'
    ).join('');
    box.innerHTML='<b>الحسابات المرتبطة</b>'+linked
      +'<div style="margin-top:10px"><b>طلبات الربط</b></div>'
      +(pending||'<div class="cd-sub">لا توجد طلبات معلّقة.</div>');
  }catch(e){ box.textContent='⚠️ '+String(e.message||e); }
}
async function chargerDemandesParents(){
  const box=document.getElementById('demandesParentsBody'); if(!box) return;
  try{
    const r=await window.SB.myParentLinkRequests();
    if(!r.ok) throw new Error(r.err||'تعذر تحميل الطلبات');
    box.innerHTML=(r.rows||[]).map(x =>
      '<div class="cd-f" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'
      +'<span style="flex:1">👤 '+escParentLink(x.parent_pseudo||String(x.parent_id).slice(0,8))
      +' — <small>'+new Date(x.created_at).toLocaleDateString()+'</small></span>'
      +'<button class="btn btn-g btn-sm" data-parent-request="'+escParentLink(x.request_id)+'" data-accept="1">قبول</button>'
      +'<button class="btn btn-o btn-sm" data-parent-request="'+escParentLink(x.request_id)+'" data-accept="0">رفض</button>'
      +'</div>'
    ).join('')||'<div class="cd-sub">لا توجد طلبات معلّقة.</div>';
  }catch(e){ box.textContent='⚠️ '+String(e.message||e); }
}
document.addEventListener('click',ev=>{
  const unlink=ev.target.closest&&ev.target.closest('[data-unlink]');
  const cancel=ev.target.closest&&ev.target.closest('[data-cancel-request]');
  const respond=ev.target.closest&&ev.target.closest('[data-parent-request]');
  if(!unlink&&!cancel&&!respond) return;
  (async()=>{
    try{
      if(unlink){
        const r=await window.SB.unlinkChild(unlink.getAttribute('data-unlink'));
        if(!r.ok) throw new Error(r.err);
        toast('تم فك الرابط','ok'); await chargerLiensEnfants();
      } else if(cancel){
        const r=await window.SB.cancelParentLinkRequest(Number(cancel.getAttribute('data-cancel-request')));
        if(!r.ok) throw new Error(r.err);
        toast('تم إلغاء الطلب','ok'); await chargerLiensEnfants();
      } else if(respond){
        const id=Number(respond.getAttribute('data-parent-request'));
        const accept=respond.getAttribute('data-accept')==='1';
        const r=await window.SB.respondParentLinkRequest(id,accept);
        if(!r.ok) throw new Error(r.err);
        toast(accept?'تم تأكيد الربط':'تم رفض الطلب','ok'); await chargerDemandesParents();
      }
    }catch(e){ toast('⚠️ '+String(e.message||e),'ko'); }
  })();
});
