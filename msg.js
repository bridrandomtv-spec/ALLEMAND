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
    if(!u){
      var L = '<div class="msg-land"><h2>💬 الرسائل — la messagerie nationale des élèves 🇩🇿</h2>'
        + '<p>Un espace d\'échange scolaire organisé par wilaya, niveau et filière : cours, devoirs, compositions, annales du BAC et résumés — dans un cadre protégé, modéré par tes professeurs.</p>'
        + '<div class="msg-cta"><button class="in" data-act="msg-login" type="button">🔐 تسجيل الدخول — Se connecter</button>'
        + '<button class="up" data-act="msg-signup" type="button">📝 حساب جديد — Créer un compte</button></div></div>'
        + '<div class="msg-bene">'
        + '<div class="b"><span class="i">🕌</span><b>Groupes officiels</b><span>Ton groupe par wilaya · niveau · filière, sans inscription manuelle : ton profil scolaire t\'y place automatiquement.</span></div>'
        + '<div class="b"><span class="i">📝</span><b>Devoirs & compos</b><span>Partage et reçois devoirs, compositions, annales BAC et résumés en pièces jointes (pdf · png · jpeg · webp, 5 Mo max).</span></div>'
        + '<div class="b"><span class="i">⚡</span><b>Temps réel</b><span>Les messages arrivent instantanément, avec présence « en ligne » et pseudos des camarades de ta conversation.</span></div>'
        + '<div class="b"><span class="i">🛡</span><b>Cadre protégé</b><span>Signalement 🚩, blocage, modération prof/admin et journal immuable : chaque action laisse une trace.</span></div>'
        + '<div class="b"><span class="i">🪪</span><b>Identité vérifiée</b><span>Les messages privés n\'existent qu\'entre élèves vérifiés par un professeur du même groupe scolaire.</span></div>'
        + '<div class="b"><span class="i">📚</span><b>Qualité des cours</b><span>Enrichis tes cours par les échanges nationaux : méthodes, corrections commentées, expériences de chaque wilaya.</span></div>'
        + '</div>'
        + '<div class="msg-sec">🧭 Comment ça marche</div><div class="msg-steps4">'
        + '<div class="s"><span class="n">1</span><b>Crée ton compte</b>niveau · filière · wilaya à l\'inscription : ce sont eux qui ouvrent tes groupes.</div>'
        + '<div class="s"><span class="n">2</span><b>Ouvre « 💬 الرسائل »</b>tes groupes officiels t\'attendent, déjà rejoints par ton profil.</div>'
        + '<div class="s"><span class="n">3</span><b>Vérifie ton identité</b>matricule + section → validation prof/admin → messages privés autorisés.</div>'
        + '<div class="s"><span class="n">4</span><b>Échange et progresse</b>messages, pièces jointes, signalement si besoin — tout reste dans ton groupe scolaire.</div>'
        + '</div>'
        + '<div class="msg-empty" style="margin-top:12px">🧑🏫 <b>Professeurs & admins</b> : la section 🛡 Modération (signalements, vérifications d\'identité, création de groupes officiels, journal) apparaît automatiquement dans cette vue après connexion.</div>';
      box.innerHTML = L; return;
    }
    var g = await window.SB.msgGroups();
    var c = await window.SB.msgConvs();
    var vf = await window.SB.msgMyVerification();
    var h = '<div class="msg-head"><h3>💬 Ressources</h3>'.replace('Ressources','Messages')+'<button class="msg-refresh" data-act="refresh" type="button">⟳ rafraîchir</button></div>';
    var isMod0 = u && (u.role==='prof' || u.role==='admin');
    if(!isMod0 && vf.ok && vf.statut!=='verifie'){
      h += '<div class="msg-verif">' + (vf.statut==='en_attente'
        ? '⏳ <b>Vérification d\'identité en cours</b> — un professeur ou un admin contrôle ton matricule et ta section. Les groupes officiels restent ouverts ; les messages privés s\'ouvriront après validation.'
        : (vf.statut==='rejete' ? '⛔ <b>Demande rejetée</b> — corrige ton matricule / ta section puis renvoie. ' : '🪪 <b>Vérification d\'identité scolaire</b> — requise avant d\'ouvrir un message privé. ') +
          '<div class="msg-vform"><input id="vfMat" placeholder="matricule scolaire" maxlength="40" value="'+esc(vf.matricule||'')+'"><input id="vfSec" placeholder="section / classe (ex. 2AS-1)" maxlength="40" value="'+esc(vf.section||'')+'"><button class="msg-send" data-act="verif-req" type="button">Envoyer la demande</button></div>')
        + '</div>';
    }
    if(!isMod0 && vf.ok && vf.statut==='verifie'){ h += '<div class="msg-verif ok">✔ Identité scolaire vérifiée — messages privés autorisés (groupe scolaire commun).</div>'; }
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
    var isMod = u && (u.role==='prof' || u.role==='admin');
    if(isMod){
      var rep0 = await window.SB.msgReportsOpen();
      var lg0 = await window.SB.msgLogLast();
      h += '<div class="msg-sec">🛡 Modération (prof / admin)</div><div class="msg-mod">';
      h += '<div class="msg-modrow"><b>Signalements ouverts :</b> ' + (rep0.ok ? rep0.reports.length : '⛔ ' + esc(rep0.err)) + '</div>';
      if(rep0.ok && rep0.reports.length){
        h += rep0.reports.map(function(r){
          var m = r.msg_messages || {};
          return '<div class="msg-modcard"><div class="msg-meta"><b>🚩 ' + esc(r.motif || 'signalement') + '</b><span>' + stamp(r.created_at) + '</span></div>' +
            '<div class="msg-body">' + esc(m.deleted_at ? '(message déjà supprimé)' : (m.body || '')) + '</div>' +
            '<div class="msg-modbtns">' +
            '<button class="msg-modbtn" data-mod="traite" data-rid="' + r.id + '" type="button">✅ traiter</button>' +
            '<button class="msg-modbtn" data-mod="rejete" data-rid="' + r.id + '" type="button">❌ rejeter</button>' +
            '<button class="msg-modbtn" data-mod="delmsg" data-rid="' + r.id + '" type="button">🚫 retirer le message</button>' +
            '<button class="msg-modbtn" data-mod="retireatt" data-rid="' + r.id + '" type="button">📎 retirer la PJ</button>' +
            '</div></div>';
        }).join('');
      }
      var vq = await window.SB.msgVerificationQueue();
      h += '<div class="msg-modrow"><b>Vérifications d\'identité en attente :</b> ' + (vq.ok ? vq.queue.length : '⛔') + '</div>';
      if(vq.ok && vq.queue.length){
        h += vq.queue.map(function(q){
          return '<div class="msg-modcard"><div class="msg-meta"><b>🪪 ' + esc(q.pseudo||'?') + '</b><span>' + esc((q.wilaya||'?')+' · '+(q.niveau||'?')+' · '+(q.filiere||'?')) + '</span></div>' +
            '<div class="msg-body">matricule : ' + esc(q.matricule||'—') + ' · section : ' + esc(q.section||'—') + '</div>' +
            '<div class="msg-modbtns"><button class="msg-modbtn" data-mod="verif-ok" data-uid="' + q.id + '" type="button">✔ vérifier</button>' +
            '<button class="msg-modbtn" data-mod="verif-no" data-uid="' + q.id + '" type="button">⛔ rejeter</button></div></div>';
        }).join('');
      }
      h += '<div class="msg-modrow"><b>Créer un groupe officiel</b> (wilaya · niveau · filière) :</div>' +
           '<div class="msg-modform"><input id="mgWil" placeholder="wilaya (ex. 16)" maxlength="2"><select id="mgNiv"><option value="1AS">1AS</option><option value="2AS">2AS</option><option value="3AS">3AS</option></select><input id="mgFil" placeholder="filière (ex. sciences)"><button class="msg-modbtn" data-mod="creategroup" type="button">➕ créer</button></div>';
      h += '<div class="msg-modrow"><b>Journal (20 dernières actions) :</b></div><div class="msg-log">';
      h += (lg0.ok ? (lg0.log.slice(0,20).map(function(l){ return '<div>' + stamp(l.at) + ' · ' + esc(l.action) + ' · ' + esc(l.cible_type) + ' #' + esc(l.cible_id) + '</div>'; }).join('') || '<div>journal vide</div>') : '<div>⛔ ' + esc(lg0.err) + '</div>');
      h += '</div></div>';
    }
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
    if(act==='msg-login' || act==='msg-signup'){
      /* Le mode essai vit en localStorage : une navigation ne suffit pas.
         On ouvre le portail existant (#gate) en overlay, comme le fait le
         bandeau d'essai, et on présélectionne l'onglet voulu. */
      try{
        var g = document.getElementById('gate');
        if(g){
          g.hidden = false;
          var tabs = g.querySelectorAll('.gtab');
          var pick = tabs[0];
          for(var i=0;i<tabs.length;i++){
            var tx = tabs[i].textContent || '';
            if(act==='msg-signup' && /\u062c\u062f\u064a\u062f|compte|inscription|signup/i.test(tx)){ pick = tabs[i]; break; }
            if(act==='msg-login' && /\u0627\u0644\u062f\u062e\u0648\u0644|connect|login/i.test(tx)){ pick = tabs[i]; break; }
          }
          if(pick) pick.click();
          setTimeout(function(){ try{ var f = g.querySelector('input'); if(f) f.focus(); }catch(e){} }, 150);
        } else {
          location.hash = '#accueil'; location.reload();
        }
      }catch(e){}
      return;
    }
    if(act==='verif-req'){
      var mv = (el('vfMat')||{}).value || '', sv = (el('vfSec')||{}).value || '';
      window.SB.msgRequestVerification(mv, sv).then(function(r4){ if(r4.ok){ renderList(); } else { window.alert('⛔ '+r4.err); } });
      return;
    }
    var mod = t.getAttribute('data-mod');
    if(mod){
      if(mod==='creategroup'){
        var w = (el('mgWil')||{}).value || '', n = (el('mgNiv')||{}).value || '', f = (el('mgFil')||{}).value || '';
        window.SB.msgCreateGroup(w, n, f, '').then(function(r2){ if(r2.ok){ renderList(); } else { window.alert('⛔ ' + r2.err); } });
        return;
      }
      if(mod==='verif-ok' || mod==='verif-no'){
        var uidv = t.getAttribute('data-uid');
        window.SB.msgSetVerification(uidv, mod==='verif-ok'?'verifie':'rejete').then(function(r3){ if(r3.ok){ renderList(); } else { window.alert('⛔ '+r3.err); } });
        return;
      }
      var rid = +t.getAttribute('data-rid');
      var opts = { retireAtt: mod==='retireatt', deleteMsg: mod==='delmsg' };
      var dec = (mod==='rejete') ? 'rejete' : 'traite';
      window.SB.msgHandle(rid, dec, opts).then(function(r2){ if(r2.ok){ renderList(); } else { window.alert('⛔ ' + r2.err); } });
      return;
    }
    var rep = t.getAttribute('data-report');
    if(rep){ window.SB.msgReport(+rep,'signalé depuis la vue messages').then(function(){ t.disabled=true; t.textContent='🚩✓'; }); }
  });

  /* ── MSG-7 : l'entrée « 💬 الرسائل » doit apparaître même si la sidebar a été
     rendue AVANT l'auto-enregistrement du module (ordre de boot / login).
     On re-rend les onglets puis on rejoue le pipeline de navigation une fois,
     et à chaque changement de session. Idempotent, sans effet de bord visible
     (le render de la vue courante est simplement rejoué). ── */
  function refreshNav(){
    try{
      if(typeof renderTabs === 'function') renderTabs();
      var cur = (location.hash || '').replace('#','') || 'accueil';
      document.dispatchEvent(new CustomEvent('dz:view', { detail: cur }));
    }catch(e){}
  }
  setTimeout(refreshNav, 400);
  document.addEventListener('dz:auth', function(){ setTimeout(refreshNav, 200); });
  document.addEventListener('change', function(e){
    if(!e.target || e.target.id!=='msgFile' || !state.conv) return;
    var f = e.target.files && e.target.files[0]; if(!f) return;
    window.SB.msgSend(state.conv, '📎 ' + f.name).then(function(s){
      if(s.ok) return window.SB.msgUpload(state.conv, s.msg.id, f).then(function(){ renderThread(state.conv); });
    });
  });
})();
