/* ── MSG-4 · vue « الرسائل » — temps réel + pseudos + présence bornée ──
   Lot 4 : canal Realtime par conversation (INSERT = ajout live, UPDATE = refresh),
   pseudos des co-membres via la politique « profils visibles entre membres » (Lot 3b),
   présence « N en ligne » trackée seulement pendant qu'un fil est ouvert.
   Aucune autorité côté client : le payload postgres_changes reste filtré par le RLS.
   Lot 1-3 inchangés dans leurs garanties : pas de DM créé ici, pas de modération UI. */
(function(){
  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  try{ if(typeof VIEWS!=='undefined' && VIEWS.indexOf('msg')===-1) VIEWS.push('msg'); }catch(e){}
  try{ if(typeof NAVSOLO_TOP!=='undefined' && NAVSOLO_TOP.indexOf('msg')===-1) NAVSOLO_TOP.push('msg'); }catch(e){}
  var state = { conv:null, me:null, ch:null, names:{} };
  async function session(){ try{ return (window.SB && window.SB.me) ? await window.SB.me() : null; }catch(e){ return null; } }
  function stamp(x){ return String(x||'').slice(0,16).replace('T',' '); }
  function card(t,s,btn){ return '<div class="msg-card"><div class="msg-ct"><b>'+esc(t)+'</b><span>'+esc(s)+'</span></div>'+(btn||'')+'</div>'; }
  async function fetchNames(ids){
    var out = {};
    try{
      var miss = ids.filter(function(i){ return i && !state.names[i]; });
      if(!miss.length || !window.SB || !window.SB.sb) { ids.forEach(function(i){ out[i]=state.names[i]; }); return out; }
      var c = await window.SB.sb(); if(!c){ ids.forEach(function(i){ out[i]=state.names[i]; }); return out; }
      var r = await c.from('profiles').select('id,pseudo,role,niveau').in('id', miss);
      (r.data||[]).forEach(function(p){ state.names[p.id] = (p.pseudo||'') + (p.niveau?' · '+p.niveau:''); });
      ids.forEach(function(i){ out[i] = state.names[i] || ('membre '+String(i).slice(0,4)); });
    }catch(e){ ids.forEach(function(i){ out[i]=state.names[i]||('membre '+String(i).slice(0,4)); }); }
    return out;
  }
  function nameOf(id){ return state.names[id] || ('membre '+String(id).slice(0,4)); }
  function rowHtml(m, live){
    var mine = state.me && m.sender_id===state.me;
    return '<div class="msg-row '+(mine?'me':'')+(live?' live':'')+'" data-mid="'+m.id+'">'+
      '<div class="msg-meta"><b class="msg-name">'+esc(mine?'moi':nameOf(m.sender_id))+'</b>'+
      '<span>'+String(m.created_at||'').slice(11,16)+' UTC</span>'+
      (mine?'':'<button class="msg-report" data-report="'+m.id+'" type="button" title="signaler">🚩</button>')+'</div>'+
      '<div class="msg-body">'+esc(m.body)+(m.flagged?' <em class="msg-flag">· signalé</em>':'')+'</div></div>';
  }
  function closeChannel(){
    if(state.ch){ try{ state.ch.unsubscribe(); }catch(e){} state.ch = null; }
  }
  async function startChannel(id){
    closeChannel();
    try{
      if(!window.SB || !window.SB.sb) return;
      var c = await window.SB.sb(); if(!c || !c.channel) return;
      var ch = c.channel('msg4-'+id)
        .on('postgres_changes', { event:'INSERT', schema:'public', table:'msg_messages', filter:'conversation_id=eq.'+id }, function(p){
          var m = p && p.new; if(!m || state.conv!==id || m.deleted_at) return;
          if(state.me && m.sender_id===state.me) return;
          var th = el('msgBody') && el('msgBody').querySelector('.msg-thread');
          if(!th || th.querySelector('[data-mid="'+m.id+'"]')) return;
          fetchNames([m.sender_id]).then(function(){ th.insertAdjacentHTML('beforeend', rowHtml(m, true)); });
        })
        .on('postgres_changes', { event:'UPDATE', schema:'public', table:'msg_messages', filter:'conversation_id=eq.'+id }, function(){
          if(state.conv===id) renderThread(id);
        })
        .on('presence', { event:'sync' }, function(){
          try{
            var ps = ch.presenceState(); var n = Object.keys(ps||{}).length;
            var pe = el('msgPres'); if(pe) pe.textContent = n>0 ? ('● '+n+' en ligne') : '';
          }catch(e){}
        });
      ch.subscribe(function(st2){
        if(st2==='SUBSCRIBED'){
          try{ ch.track({ p: (state.meName||'moi') }); }catch(e){}
        }
      });
      state.ch = ch;
    }catch(e){ state.ch = null; }
  }
  async function renderList(){
    closeChannel();
    var box = el('msgBody'); if(!box) return;
    var u = await session(); state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'moi';
    if(!u){ box.innerHTML = '<div class="msg-empty">💬 <b>Messagerie nationale</b> — connecte-toi pour retrouver tes groupes officiels (wilaya · niveau · filière).</div>'; return; }
    var g = await window.SB.msgGroups();
    var c = await window.SB.msgConvs();
    var h = '<div class="msg-head"><h3>💬 Ressources</h3>'.replace('Ressources','Messages')+'<button class="msg-refresh" data-act="refresh" type="button">⟳ rafraîchir</button></div>';
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
      h += directs.map(function(x){ return card('Conversation directe #'+x.id, 'dernière activité : '+stamp(x.last_activity), '<button class="msg-open" data-conv="'+x.id+'" type="button">Ouvrir</button>'); }).join('');
    } else {
      h += '<div class="msg-empty">Aucune conversation directe — l\'ouverture de nouveaux DMs arrivera avec la vérification d\'identité (Lot 6).</div>';
    }
    h += '</div>';
    box.innerHTML = h; state.conv = null;
  }
  async function renderThread(id){
    var box = el('msgBody'); if(!box) return;
    var u = await session(); state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'moi';
    var r = await window.SB.msgMessages(id, null, 50);
    if(!r.ok){ closeChannel(); box.innerHTML = '<div class="msg-empty">⛔ '+esc(r.err)+'</div><button class="msg-back" data-act="back" type="button">← retour</button>'; return; }
    var others = [];
    r.msgs.forEach(function(m){ if(m.sender_id!==state.me && others.indexOf(m.sender_id)===-1) others.push(m.sender_id); });
    await fetchNames(others);
    var h = '<button class="msg-back" data-act="back" type="button">← retour à la liste</button>'+
            '<div class="msg-head"><h3>💬 Fil #'+id+'</h3><span class="msg-pres" id="msgPres"></span></div>'+
            '<div class="msg-thread">';
    h += r.msgs.map(function(m){ return rowHtml(m, false); }).join('') || '<div class="msg-empty">Aucun message pour l\'instant.</div>';
    h += '</div><div class="msg-input"><textarea id="msgText" rows="2" maxlength="2000" placeholder="اكتب رسالتك… / ton message…"></textarea>'+
         '<label class="msg-pj" title="joindre un fichier (png/jpeg/webp/pdf, 5 Mo max)">📎<input type="file" id="msgFile" accept="image/png,image/jpeg,image/webp,application/pdf" hidden></label>'+
         '<button class="msg-send" data-act="send" type="button">Envoyer ➤</button></div><div class="msg-err" id="msgErr" hidden></div>';
    box.innerHTML = h; state.conv = id;
    startChannel(id);
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
    if(String(v).indexOf('msg')>=0){ closeChannel(); state.conv=null; renderList(); }
    else { closeChannel(); }
  });
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-conv],[data-act],[data-report]') : null;
    if(!t) return;
    if(t.getAttribute('data-conv')){ renderThread(+t.getAttribute('data-conv')); return; }
    var act = t.getAttribute('data-act');
    if(act==='refresh'){ if(state.conv) renderThread(state.conv); else renderList(); return; }
    if(act==='back'){ closeChannel(); state.conv=null; renderList(); return; }
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
