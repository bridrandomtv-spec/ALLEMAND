/* ── MSG-3 · vue « الرسائل » (messagerie EduDZ) — module additif ──
   Aucune autorité côté client : tout passe par les politiques RLS du Lot 1.
   Pas de création de DM ici (décision propriétaire : vérification d'identité d'abord, Lot 6).
   Pas de realtime ici (Lot 4) : bouton « rafraîchir » manuel.
   Auto-enregistrement dans la navigation existante (tableaux globaux mutables). */
(function(){
  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  try{ if(typeof VIEWS!=='undefined' && VIEWS.indexOf('msg')===-1) VIEWS.push('msg'); }catch(e){}
  try{ if(typeof NAVSOLO_TOP!=='undefined' && NAVSOLO_TOP.indexOf('msg')===-1) NAVSOLO_TOP.push('msg'); }catch(e){}
  var state = { conv:null };
  async function session(){ try{ return (window.SB && window.SB.me) ? await window.SB.me() : null; }catch(e){ return null; } }
  function stamp(x){ return String(x||'').slice(0,16).replace('T',' '); }
  function card(t,s,btn){ return '<div class="msg-card"><div class="msg-ct"><b>'+esc(t)+'</b><span>'+esc(s)+'</span></div>'+(btn||'')+'</div>'; }
  async function renderList(){
    var box = el('msgBody'); if(!box) return;
    var u = await session();
    if(!u){ box.innerHTML = '<div class="msg-empty">💬 <b>Messagerie nationale</b> — connecte-toi pour retrouver tes groupes officiels (wilaya · niveau · filière).</div>'; return; }
    var g = await window.SB.msgGroups();
    var c = await window.SB.msgConvs();
    var h = '<div class="msg-head"><h3>💬 الرسائل</h3><button class="msg-refresh" data-act="refresh" type="button">⟳ rafraîchir</button></div>';
    h += '<div class="msg-sec">🕌 Groupes officiels (wilaya · niveau · filière)</div><div class="msg-grid">';
    if(g.ok && g.groups.length){
      h += g.groups.map(function(x){
        return card(x.titre || ('Groupe '+(x.wilaya||'')+' '+(x.niveau||'')+' '+(x.filiere||'')),
                    'dernière activité : '+stamp(x.last_activity),
                    '<button class="msg-open" data-conv="'+x.id+'" type="button">Ouvrir</button>');
      }).join('');
    } else {
      h += '<div class="msg-empty">Aucun groupe officiel ouvert pour ton profil pour l\'instant — création par l\'équipe pédagogique (modération, Lot 5).</div>';
    }
    h += '</div><div class="msg-sec">✉️ Conversations directes (groupe scolaire commun)</div><div class="msg-grid">';
    var directs = (c.ok ? c.convs : []).filter(function(x){ return x.type==='direct'; });
    if(directs.length){
      h += directs.map(function(x){
        return card('Conversation directe #'+x.id, 'dernière activité : '+stamp(x.last_activity),
                    '<button class="msg-open" data-conv="'+x.id+'" type="button">Ouvrir</button>');
      }).join('');
    } else {
      h += '<div class="msg-empty">Aucune conversation directe — l\'ouverture de nouveaux DMs arrivera avec la vérification d\'identité (Lot 6).</div>';
    }
    h += '</div>';
    box.innerHTML = h; state.conv = null;
  }
  async function renderThread(id){
    var box = el('msgBody'); if(!box) return;
    var u = await session();
    var r = await window.SB.msgMessages(id, null, 50);
    if(!r.ok){ box.innerHTML = '<div class="msg-empty">⛔ '+esc(r.err)+'</div><button class="msg-back" data-act="back" type="button">← retour</button>'; return; }
    var h = '<button class="msg-back" data-act="back" type="button">← retour à la liste</button><div class="msg-thread">';
    h += r.msgs.map(function(m){
      var mine = u && m.sender_id===u.id;
      return '<div class="msg-row '+(mine?'me':'')+'"><div class="msg-meta"><b>'+esc(mine?'moi':('membre '+String(m.sender_id).slice(0,4)))+'</b><span>'+String(m.created_at||'').slice(11,16)+' UTC</span>'+
        (mine?'':'<button class="msg-report" data-report="'+m.id+'" type="button" title="signaler">🚩</button>')+'</div>'+
        '<div class="msg-body">'+esc(m.body)+(m.flagged?' <em class="msg-flag">· signalé</em>':'')+'</div></div>';
    }).join('') || '<div class="msg-empty">Aucun message pour l\'instant.</div>';
    h += '</div><div class="msg-input"><textarea id="msgText" rows="2" maxlength="2000" placeholder="اكتب رسالتك… / ton message…"></textarea>'+
         '<label class="msg-pj" title="joindre un fichier (png/jpeg/webp/pdf, 5 Mo max)">📎<input type="file" id="msgFile" accept="image/png,image/jpeg,image/webp,application/pdf" hidden></label>'+
         '<button class="msg-send" data-act="send" type="button">Envoyer ➤</button></div><div class="msg-err" id="msgErr" hidden></div>';
    box.innerHTML = h; state.conv = id;
  }
  async function send(){
    var t = el('msgText'), err = el('msgErr');
    if(!t || !state.conv) return;
    var r = await window.SB.msgSend(state.conv, t.value);
    if(!r.ok){ if(err){ err.hidden=false; err.textContent='⛔ '+r.err; } return; }
    t.value=''; if(err) err.hidden=true;
    renderThread(state.conv);
  }
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('msg')>=0){ state.conv=null; renderList(); }
  });
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-conv],[data-act],[data-report]') : null;
    if(!t) return;
    if(t.getAttribute('data-conv')){ renderThread(+t.getAttribute('data-conv')); return; }
    var act = t.getAttribute('data-act');
    if(act==='refresh'){ renderList(); return; }
    if(act==='back'){ state.conv=null; renderList(); return; }
    if(act==='send'){ send(); return; }
    var rep = t.getAttribute('data-report');
    if(rep){ window.SB.msgReport(+rep,'signalé depuis la vue messages').then(function(){ t.disabled=true; t.textContent='🚩✓'; }); }
  });
  document.addEventListener('change', function(e){
    if(!e.target || e.target.id!=='msgFile' || !state.conv) return;
    var f = e.target.files && e.target.files[0]; if(!f) return;
    window.SB.msgSend(state.conv, '📎 ' + f.name).then(function(s){
      if(s.ok) return window.SB.msgUpload(state.conv, s.msg.id, f).then(function(){ renderThread(state.conv); });
    });
  });
})();
