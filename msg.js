/* ── MSG-4 · vue « الرسائل » — temps réel + pseudos + présence bornée ──
   Lot 4 : canal Realtime par conversation (INSERT = ajout live, UPDATE = refresh),
   pseudos des co-membres via la politique « profils visibles entre membres » (Lot 3b),
   présence « N متصل الآن » trackée seulement pendant qu'un fil est ouvert.
   Aucune autorité côté client : le payload postgres_changes reste filtré par le RLS.
   Lot 1-3 inchangés dans leurs garanties : pas de DM créé ici, pas de modération UI. */
(function(){
  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  try{ if(typeof VIEWS!=='undefined' && VIEWS.indexOf('msg')===-1) VIEWS.push('msg'); }catch(e){}
  try{ if(typeof NAVSOLO_TOP!=='undefined' && NAVSOLO_TOP.indexOf('msg')===-1) NAVSOLO_TOP.push('msg'); }catch(e){}
  var state = { conv:null, me:null, authEpoch:0, ch:null, channelEpoch:0, renderEpoch:0, recoveryTimer:null, recoveryAttempts:0, updateRefreshTimer:null, inviteCh:null, inviteEpoch:0, inviteRecoveryTimer:null, inviteRecoveryAttempts:0, inviteNeedsRecovery:false, inviteViewActive:false, verificationPage:0, names:{}, peers:{} };
  var authClient = null, authSubscription = null;
  function bindAuthLifecycle(client){
    if(!client || !client.auth || typeof client.auth.onAuthStateChange!=='function' || authClient===client) return;
    if(authSubscription && typeof authSubscription.unsubscribe==='function'){
      try{ authSubscription.unsubscribe(); }catch(e){}
    }
    authClient = client;
    var registration = client.auth.onAuthStateChange(function(event){
      /* Supabase JS 2.x propage lui-même le JWT vers Realtime sur TOKEN_REFRESHED,
         SIGNED_IN et INITIAL_SESSION. Ne pas appeler setAuth() ici : cela ferait
         double emploi avec le client. On ne réconcilie que les changements d'identité. */
      if(event!=='SIGNED_IN' && event!=='SIGNED_OUT') return;
      /* Invalider immédiatement les continuations asynchrones : reporter même
         l'incrément des epochs dans setTimeout laissait une fenêtre où un rendu
         de l'ancienne identité pouvait encore passer ses gardes. Aucune requête
         Supabase n'est lancée dans le callback Auth. */
      var transitionEpoch = ++state.authEpoch;
      var activeConv = event==='SIGNED_IN' ? state.conv : null;
      state.renderEpoch++;
      closeChannel();
      closeInviteChannel();
      state.me = null;
      state.meName = 'أنا';
      state.peers = {};
      state.names = {};
      if(event==='SIGNED_OUT') state.conv = null;
      setTimeout(function(){
        if(authClient!==client || state.authEpoch!==transitionEpoch) return;
        if(event==='SIGNED_OUT'){
          if(state.inviteViewActive) renderList();
          return;
        }
        if(!state.inviteViewActive) return;
        if(activeConv) renderThread(activeConv);
        else renderList();
      }, 0);
    });
    authSubscription = registration && registration.data ? registration.data.subscription : null;
  }
  async function session(){
    try{
      if(!window.SB || !window.SB.me) return null;
      if(typeof window.SB.sb==='function'){
        var client = await window.SB.sb();
        if(client) bindAuthLifecycle(client);
      }
      return await window.SB.me();
    }catch(e){ return null; }
  }
  function stamp(x){ return String(x||'').slice(0,16).replace('T',' '); }
  function card(t,s,btn){ return '<div class="msg-card"><div class="msg-ct"><b>'+esc(t)+'</b><span>'+esc(s)+'</span></div>'+(btn||'')+'</div>'; }
  async function fetchNames(ids){
    var out = {}, identityEpoch = state.authEpoch;
    try{
      var miss = ids.filter(function(i){ return i && !state.names[i]; });
      if(!miss.length || !window.SB || !window.SB.sb) {
        ids.forEach(function(i){ out[i]=state.names[i]; });
        return out;
      }
      var c = await window.SB.sb();
      if(identityEpoch!==state.authEpoch) return out;
      if(!c){ ids.forEach(function(i){ out[i]=state.names[i]; }); return out; }
      var r = await c.from('profiles').select('id,pseudo,role,niveau').in('id', miss);
      /* Une lecture démarrée sous le compte précédent ne doit jamais alimenter
         le cache partagé après SIGNED_IN/SIGNED_OUT. */
      if(identityEpoch!==state.authEpoch) return out;
      (r.data||[]).forEach(function(p){
        state.names[p.id] = (p.pseudo||'') + (p.niveau?' · '+p.niveau:'');
      });
      ids.forEach(function(i){ out[i] = state.names[i] || ('عضو '+String(i).slice(0,4)); });
    }catch(e){
      if(identityEpoch!==state.authEpoch) return out;
      ids.forEach(function(i){ out[i]=state.names[i]||('عضو '+String(i).slice(0,4)); });
    }
    return out;
  }
  function nameOf(id){ return state.names[id] || ('عضو '+String(id).slice(0,4)); }
  function rowHtml(m, live, attachment){
    var mine = state.me && m.sender_id===state.me;
    var att = '';
    if(attachment && attachment.ok && attachment.url){
      var isImage = String(attachment.mime||'').indexOf('image/')===0;
      att = '<div class="msg-attachment">'+(isImage
        ? '<a href="'+esc(attachment.url)+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(attachment.url)+'" alt="صورة مرفقة" loading="lazy"></a>'
        : '<a href="'+esc(attachment.url)+'" target="_blank" rel="noopener noreferrer">📄 فتح الملف المرفق</a>')+
        '<small>'+esc(attachment.name||'ملف مرفق')+' · '+esc(attachment.sizeLabel||'')+'</small></div>';
    } else if(attachment && !attachment.ok){
      att = '<div class="msg-attachment msg-attachment-error">📎 تعذّر الوصول إلى الملف المرفق من هذا الحساب.</div>';
    }
    return '<div class="msg-row '+(mine?'me':'')+(live?' live':'')+'" data-mid="'+m.id+'">'+
      '<div class="msg-meta"><b class="msg-name">'+esc(mine?'أنا':nameOf(m.sender_id))+'</b>'+
      '<span>'+String(m.created_at||'').slice(11,16)+' UTC</span>'+
      (mine?'<span class="msg-own-actions"><button class="msg-report" data-msg-act="edit" data-mid="'+m.id+'" type="button" title="تعديل الرسالة">✏️</button><button class="msg-report" data-msg-act="delete" data-mid="'+m.id+'" type="button" title="حذف الرسالة">🗑️</button></span>':'<button class="msg-report" data-report="'+m.id+'" type="button" title="إبلاغ">🚩</button>')+'</div>'+
      '<div class="msg-body">'+esc(m.body)+(m.edited_at?' <em class="msg-flag">· عُدّلت</em>':'')+(m.flagged?' <em class="msg-flag">· تم الإبلاغ عنها</em>':'')+'</div>'+att+'</div>';
  }
  async function attachmentsFor(messageIds){
    try{ return await window.SB.msgAttachmentInfos(messageIds); }
    catch(e){ return {}; }
  }
  function verificationMissing(q){
    var missing = [];
    if(!q || !String(q.pseudo||'').trim()) missing.push('اسم الحساب');
    if(!q || !/^[0-9]{1,20}$/.test(String(q.matricule||'').trim())) missing.push('رقم التسجيل');
    if(!q || !String(q.niveau||'').trim()) missing.push('المستوى');
    if(!q || !String(q.wilaya||'').trim()) missing.push('الولاية');
    if(!q || !String(q.filiere||'').trim()) missing.push('الشعبة');
    if(!q || !String(q.section||'').trim()) missing.push('القسم');
    if(!q || !q.id || !String(q.carte_scolaire_path||'').startsWith(String(q.id)+'/')) missing.push('البطاقة المدرسية');
    return missing;
  }
  function sizeLabel(n){
    n=Number(n)||0; return n>=1048576?(n/1048576).toFixed(1)+' ميغابايت':Math.max(1,Math.round(n/1024))+' كيلوبايت';
  }
  function closeChannel(){
    state.channelEpoch++;
    if(state.recoveryTimer){ clearTimeout(state.recoveryTimer); state.recoveryTimer=null; }
    if(state.updateRefreshTimer){ clearTimeout(state.updateRefreshTimer); state.updateRefreshTimer=null; }
    if(state.ch){ try{ state.ch.unsubscribe(); }catch(e){} state.ch = null; }
  }
  function closeInviteChannel(){
    state.inviteEpoch++;
    if(state.inviteRecoveryTimer){ clearTimeout(state.inviteRecoveryTimer); state.inviteRecoveryTimer=null; }
    state.inviteNeedsRecovery = false;
    if(state.inviteCh){ try{ state.inviteCh.unsubscribe(); }catch(e){} state.inviteCh = null; }
  }
  function scheduleInviteRecovery(){
    var userId = state.me, epoch = state.inviteEpoch;
    if(!state.inviteNeedsRecovery || !state.inviteViewActive || !userId || state.conv!==null ||
       (document.visibilityState && document.visibilityState==='hidden') || state.inviteRecoveryTimer) return;
    var attempt = Math.min(state.inviteRecoveryAttempts || 0, 7);
    var delay = Math.min(32000, 500 * Math.pow(2, attempt));
    state.inviteRecoveryTimer = setTimeout(function(){
      state.inviteRecoveryTimer = null;
      if(!state.inviteNeedsRecovery || !state.inviteViewActive || state.me!==userId ||
         state.conv!==null || (document.visibilityState && document.visibilityState==='hidden')) return;
      state.inviteRecoveryAttempts = Math.min((state.inviteRecoveryAttempts || 0) + 1, 7);
      renderList().catch(function(){});
    }, delay);
  }
  async function startInviteChannel(){
    closeInviteChannel();
    var epoch = state.inviteEpoch;
    var userId = state.me;
    try{
      if(!state.inviteViewActive || !userId || !window.SB || !window.SB.sb) return;
      var c = await window.SB.sb();
      if(!c || !c.channel || epoch!==state.inviteEpoch || !state.inviteViewActive ||
         state.me!==userId || state.conv!==null) return;
      var ch = c.channel('msg-invites-'+userId)
        .on('postgres_changes', { event:'*', schema:'public', table:'msg_invites' }, function(){
          if(epoch!==state.inviteEpoch || !state.inviteViewActive ||
             state.me!==userId || state.conv!==null) return;
          var box = el('msgBody');
          if(!box || !box.isConnected) return;
          renderList();
        });
      state.inviteCh = ch;
      ch.subscribe(function(status, err){
        if(epoch!==state.inviteEpoch || state.inviteCh!==ch || state.me!==userId) return;
        if(status==='SUBSCRIBED'){
          state.inviteNeedsRecovery = false;
          state.inviteRecoveryAttempts = 0;
          if(state.inviteRecoveryTimer){ clearTimeout(state.inviteRecoveryTimer); state.inviteRecoveryTimer=null; }
        } else if(status==='CHANNEL_ERROR' || status==='TIMED_OUT' || status==='CLOSED'){
          state.inviteNeedsRecovery = true;
          if(window.console && typeof window.console.warn==='function'){
            window.console.warn('[Messenger invitations Realtime]', status, err || null);
          }
          /* CHANNEL_ERROR reste géré par le retry interne du SDK; timeout/fermeture
             déclenchent une reprise bornée du canal d'invitations. */
          if(status==='TIMED_OUT' || status==='CLOSED') scheduleInviteRecovery();
        }
      });
    }catch(e){
      if(epoch===state.inviteEpoch) state.inviteCh = null;
    }
  }
  function scheduleUpdateRefresh(id, epoch){
    /* Regroupe les UPDATE rapprochés (édition, suppression logique, pièce jointe)
       en une seule lecture cohérente du fil après la fin de la rafale CDC. */
    if(state.updateRefreshTimer){ clearTimeout(state.updateRefreshTimer); state.updateRefreshTimer=null; }
    state.updateRefreshTimer = setTimeout(function(){
      state.updateRefreshTimer = null;
      if(epoch!==state.channelEpoch || state.conv!==id) return;
      renderThread(id, true).catch(function(){});
    }, 90);
  }
  async function startChannel(id){
    closeChannel();
    var epoch = state.channelEpoch;
    try{
      if(!window.SB || !window.SB.sb) return;
      var c = await window.SB.sb();
      if(!c || !c.channel || epoch!==state.channelEpoch || state.conv!==id) return;
      var ch = c.channel('msg4-'+id)
        .on('postgres_changes', { event:'INSERT', schema:'public', table:'msg_messages', filter:'conversation_id=eq.'+id }, function(p){
          var m = p && p.new; if(epoch!==state.channelEpoch || !m || state.conv!==id || m.deleted_at) return;
          if(state.me && m.sender_id===state.me) return;
          var th = el('msgBody') && el('msgBody').querySelector('.msg-thread');
          if(!th || th.querySelector('[data-mid="'+m.id+'"]')) return;
          var eventRenderEpoch = state.renderEpoch;
          Promise.all([fetchNames([m.sender_id]), attachmentsFor([m.id])]).then(function(parts){
            if(epoch!==state.channelEpoch || state.conv!==id || eventRenderEpoch!==state.renderEpoch) return;
            var currentThread = el('msgBody') && el('msgBody').querySelector('.msg-thread');
            if(!currentThread || !currentThread.isConnected ||
               currentThread.querySelector('[data-mid="'+m.id+'"]')) return;
            var a=parts[1] && parts[1][m.id];
            if(a && a.ok) a.sizeLabel=sizeLabel(a.octets);
            currentThread.insertAdjacentHTML('beforeend', rowHtml(m, true, a && a.found ? a : null));
          });
        })
        .on('postgres_changes', { event:'UPDATE', schema:'public', table:'msg_messages', filter:'conversation_id=eq.'+id }, function(){
          if(epoch===state.channelEpoch && state.conv===id) scheduleUpdateRefresh(id, epoch);
        })
        .on('presence', { event:'sync' }, function(){
          try{
            if(epoch!==state.channelEpoch || state.conv!==id) return;
            var ps = ch.presenceState(); var n = Object.keys(ps||{}).length;
            var pe = el('msgPres'); if(pe) pe.textContent = n>0 ? ('● '+n+' متصل الآن') : '';
          }catch(e){}
        });
      ch.subscribe(function(st2, err){
        if(epoch!==state.channelEpoch || state.conv!==id || state.ch!==ch) return;
        if(st2==='SUBSCRIBED'){
          if(state.recoveryTimer){ clearTimeout(state.recoveryTimer); state.recoveryTimer=null; }
          state.recoveryAttempts=0;
          try{ ch.track({ p: (state.meName||'أنا') }); }catch(e){}
          /* SUBSCRIBED confirme le retour du canal : réconcilier le fil sans
             remplacer l'abonnement qui vient de redevenir actif. */
          renderThread(id, true).catch(function(){});
        } else if(st2==='CHANNEL_ERROR' || st2==='TIMED_OUT' || st2==='CLOSED'){
          var pe=el('msgPres'); if(pe) pe.textContent='اتصال مباشر غير مستقر · جارٍ إعادة الاتصال';
          if(window.console && typeof window.console.warn==='function'){
            window.console.warn('[Messenger Realtime]', st2, err || null);
          }
          /* CHANNEL_ERROR est repris par le retry interne du client Supabase.
             TIMED_OUT/CLOSED : programmer un remplacement borné du canal;
             SUBSCRIBED annulera ce timer si le client se rétablit entre-temps. */
          if(st2==='TIMED_OUT' || st2==='CLOSED') scheduleThreadRecovery();
        }
      });
      state.ch = ch;
    }catch(e){ state.ch = null; }
  }
  async function renderList(verificationPage){
    if(Number.isFinite(Number(verificationPage))) state.verificationPage = Math.max(0,Math.floor(Number(verificationPage)));
    var renderEpoch = ++state.renderEpoch;
    closeChannel();
    closeInviteChannel();
    var box = el('msgBody'); if(!box) return;
    var u = await session();
    if(renderEpoch!==state.renderEpoch) return;
    state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'أنا';
    if(!u){
      var localSess = false;
      try{ localSess = !!localStorage.getItem('dz_de_session_v1'); }catch(e){}
      var ucN = document.querySelector('#userChip .uc-n');
      var appSess = localSess || !!(ucN && ucN.textContent && ucN.textContent.trim());
      var cloudUp = !!(window.SB && window.SB.sb);
      if(appSess){
        box.innerHTML = '<div class="msg-land"><h2>💬 الرسائل — يلزم حساب سحابي</h2>'
          + '<p>أنت متصل بالمنصة، لكن جلستك الحالية ' + (cloudUp ? 'محلية أو دون اتصال' : 'محلية، وتعذر تحميل خدمة الاتصال السحابي (الشبكة أو CDN)') + '. تعتمد خدمة المراسلة الوطنية (المجموعات الرسمية والمراسلة الفورية والإشراف والتحقق من الهوية) على حسابك السحابي المحمي؛ سجّل الدخول أو أنشئ حساباً لتفعيلها هنا.</p>'
          + '<div class="msg-cta"><button class="in" data-act="msg-login" type="button">🔐 ربط حسابي السحابي</button>'
          + '<button class="up" data-act="msg-signup" type="button">📝 إنشاء حساب سحابي</button></div></div>';
        return;
      }
      var L = '<div class="msg-land"><h2>💬 الرسائل — منصة المراسلة الوطنية للتلاميذ 🇩🇿</h2>'
        + '<p>فضاء للتواصل الدراسي منظّم حسب الولاية والمستوى والشعبة، لتبادل الدروس والواجبات والاختبارات ومواضيع البكالوريا والملخصات، ضمن بيئة محمية وتحت إشراف الأساتذة.</p>'
        + '<div class="msg-cta"><button class="in" data-act="msg-login" type="button">🔐 تسجيل الدخول</button>'
        + '<button class="up" data-act="msg-signup" type="button">📝 حساب جديد</button></div></div>'
        + '<div class="msg-bene">'
        + '<div class="b"><span class="i">🕌</span><b>المجموعات الرسمية</b><span>مجموعتك حسب الولاية والمستوى والشعبة؛ يحدد ملفك الدراسي المجموعة المناسبة تلقائياً.</span></div>'
        + '<div class="b"><span class="i">📝</span><b>الواجبات والاختبارات</b><span>تبادل الواجبات والاختبارات ومواضيع البكالوريا والملخصات كمرفقات (PDF وPNG وJPEG وWebP، حتى 5 ميغابايت).</span></div>'
        + '<div class="b"><span class="i">⚡</span><b>مراسلة فورية</b><span>تصلك الرسائل فورياً، مع إظهار حالة الاتصال وأسماء زملائك في المحادثة.</span></div>'
        + '<div class="b"><span class="i">🛡</span><b>بيئة آمنة</b><span>الإبلاغ 🚩 والحظر وإشراف الأساتذة والإدارة وسجلّ موثّق لكل إجراء.</span></div>'
        + '<div class="b"><span class="i">🪪</span><b>الهوية المدرسية</b><span>تُتاح الرسائل الخاصة بين التلاميذ بعد التحقق من هويتهم المدرسية.</span></div>'
        + '<div class="b"><span class="i">📚</span><b>تطوير التعلّم</b><span>طوّر تعلّمك عبر تبادل المنهجيات والتصحيحات المشروحة والخبرات من مختلف الولايات.</span></div>'
        + '</div>'
        + '<div class="msg-sec">🧭 كيف تعمل المراسلة؟</div><div class="msg-steps4">'
        + '<div class="s"><span class="n">1</span><b>أنشئ حسابك</b>المستوى · الشعبة · الولاية؛ وهي معلومات تساعد على تحديد مجموعاتك.</div>'
        + '<div class="s"><span class="n">2</span><b>افتح « 💬 الرسائل »</b>ستجد مجموعاتك الدراسية المرتبطة بملفك.</div>'
        + '<div class="s"><span class="n">3</span><b>تحقّق من هويتك</b>رقم التسجيل المدرسي والشعبة ← مراجعة الأستاذ أو الإدارة ← إتاحة الرسائل الخاصة.</div>'
        + '<div class="s"><span class="n">4</span><b>تواصل وتقدّم</b>تبادل الرسائل والملفات، وأبلغ عن أي مخالفة عند الحاجة.</div>'
        + '</div>'
        + '<div class="msg-empty" style="margin-top:12px">🧑🏫 <b>الأساتذة والإدارة</b> : يظهر قسم 🛡 الإشراف (البلاغات والتحقق من الهوية وإنشاء المجموعات الرسمية والسجل) تلقائياً بعد تسجيل الدخول.</div>';
      box.innerHTML = L; return;
    }
    var g = await window.SB.msgGroups();
    if(renderEpoch!==state.renderEpoch) return;
    var c = await window.SB.msgConvs();
    if(renderEpoch!==state.renderEpoch) return;
    var vf = await window.SB.msgMyVerification();
    if(renderEpoch!==state.renderEpoch) return;
    var directCount = c.ok ? c.convs.filter(function(x){ return x.type==='direct'; }).length : 0;
    var groupCount = g.ok ? g.groups.length : 0;
    var h = '<div class="msg-pro-hero"><div class="msg-pro-hero-copy"><span class="msg-pro-eyebrow">الثانوية الافتراضية الجزائرية · فضاء التعلّم التعاوني</span><h2>💬 تواصل، تعاون، وتقدّم مع زملائك</h2><p>مساحات دراسية منظّمة حسب الولاية والمستوى والشعبة، ومحادثاتك الخاصة وفق ضوابط الهوية المدرسية.</p></div><div class="msg-pro-hero-mark" aria-hidden="true">✉️</div></div>' +
      '<div class="msg-pro-toolbar"><div class="msg-pro-heading"><b>مساحات التواصل</b><span>إدارة مجموعاتك ومحادثاتك من مكان واحد</span></div><button class="msg-refresh" data-act="refresh" type="button">⟳ تحديث</button></div>' +
      '<div class="msg-pro-stats"><div><span>🏫</span><b>'+groupCount+'</b><small>مجموعات دراسية</small></div><div><span>🔒</span><b>'+directCount+'</b><small>محادثات خاصة</small></div><div><span>🛡️</span><b>آمن</b><small>وصول وفق الصلاحيات</small></div></div>' +
      '<div class="msg-searchbar"><span aria-hidden="true">⌕</span><input id="msgListSearch" type="search" placeholder="ابحث باسم المجموعة أو الولاية أو المستوى…" autocomplete="off" aria-label="ابحث في محادثاتي ومجموعاتي أو باسم المجموعة والولاية والمستوى"></div>' +
      '<div class="msg-filters" role="group" aria-label="تصفية مساحات التواصل"><button type="button" class="active" data-msg-filter="all">الكل</button><button type="button" data-msg-filter="group">🏫 المجموعات</button><button type="button" data-msg-filter="direct">🔒 الخاصة</button></div>' +
      '<div class="msg-learning-note"><span>📘</span><div><b>اجعل التواصل امتداداً لتعلّمك</b><p>استخدم المجموعات لتبادل الأسئلة والملخصات والموارد الدراسية، واحرص على احترام زملائك وعدم مشاركة بياناتك الشخصية.</p></div></div>';
    var isMod0 = u && (u.role==='prof' || u.role==='admin');
    if(!isMod0 && vf.ok && vf.statut!=='verifie'){
      h += '<div class="msg-verif">' + (vf.statut==='en_attente'
        ? '⏳ <b>التحقق من الهوية جارٍ</b> — يراجع أستاذ أو مسؤول رقم تسجيلك وشعبتك. تبقى المجموعات الرسمية متاحة، وتُفعّل الرسائل الخاصة بعد المصادقة.'
        : (vf.statut==='rejete' ? '⛔ <b>تم رفض الطلب</b> — صحّح بياناتك وأرفق بطاقة مدرسية جديدة لإعادة الطلب. ' : '🪪 <b>التحقق من الهوية المدرسية</b> — مطلوب قبل بدء محادثة خاصة. ') +
          '<div class="msg-vhint">التحقق المدرسي مجاني. أدخل رقم تسجيلك والشعبة، ثم أرفق صورة واضحة لبطاقتك المدرسية (JPEG أو PNG أو WebP أو PDF، بحد أقصى 5 ميغابايت). لن يطّلع عليها إلا فريق التحقق المخوّل.</div><div class="msg-vform"><input id="vfMat" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="رقم التسجيل المدرسي" maxlength="20"><input id="vfSec" placeholder="الشعبة / القسم (مثال: 2AS-1)" maxlength="40" value="'+esc(vf.section||'')+'"><label class="msg-vhint" for="vfCard">🪪 صورة البطاقة المدرسية أو PDF</label><input id="vfCard" type="file" accept="image/jpeg,image/png,image/webp,application/pdf"><button class="msg-send" data-act="verif-req" type="button">إرسال طلب التحقق</button></div>')
        + '</div>';
    }
    if(!isMod0 && vf.ok && vf.statut==='verifie'){ h += '<div class="msg-verif ok">✔ تم التحقق من الهوية المدرسية — الرسائل الخاصة متاحة ضمن المجموعة الدراسية المشتركة.</div>'; }
    var inv = await window.SB.msgInvites();
    if(renderEpoch!==state.renderEpoch) return;
    state.peers = {};
    if(!isMod0 && vf.ok && vf.statut==='verifie' && inv.ok){
      h += '<div class="msg-sec">🔎 ابحث عن زميل لطلب محادثة خاصة</div>'+
        '<div class="msg-card"><p>ابحث بالاسم المستعار فقط. تظهر حسابات التلاميذ الذين تم التحقق من هويتهم وفي نفس الولاية والمستوى والشعبة. لا تُرسل الدعوة إلا بعد اختيارك.</p>'+
        '<div class="msg-modform"><input id="msgStudentSearchQuery" type="search" maxlength="40" minlength="3" autocomplete="off" placeholder="اكتب الاسم المستعار (3 أحرف على الأقل)">'+
        '<button class="msg-modbtn" data-act="search-students" type="button">بحث عن زملاء</button></div><div id="msgStudentResults" aria-live="polite"></div></div>';
    }
    h += '<div class="msg-sec">🕌 المجموعات الرسمية (الولاية · المستوى · الشعبة)</div><div class="msg-grid">';
    if(g.ok && g.groups.length){
      h += g.groups.map(function(x){
        var title = x.titre || ('مجموعة '+(x.wilaya||'')+' · '+(x.niveau||'')+' · '+(x.filiere||''));
        return '<div class="msg-item" data-msg-kind="group" data-msg-search="'+esc((title+' '+(x.wilaya||'')+' '+(x.niveau||'')+' '+(x.filiere||'')).toLowerCase())+'">'+
          card(title, '🏷️ '+(x.wilaya||'ولاية غير محددة')+' · '+(x.niveau||'مستوى غير محدد')+' · '+(x.filiere||'شعبة غير محددة')+' · آخر نشاط '+stamp(x.last_activity),
          '<button class="msg-open" data-conv="'+x.id+'" type="button">فتح المحادثة</button>')+'</div>';
      }).join('');
    } else {
      h += '<div class="msg-empty">لا توجد مجموعة رسمية متاحة لملفك حالياً؛ يتولى الفريق التربوي إنشاء المجموعات والإشراف عليها.</div>';
    }
    h += '</div><div class="msg-sec">✉️ المحادثات الخاصة</div><div class="msg-grid msg-direct-grid">';
    var directs = (c.ok ? c.convs : []).filter(function(x){ return x.type==='direct'; });
    if(directs.length){
      h += directs.map(function(x){ var title='محادثة خاصة'; return '<div class="msg-item" data-msg-kind="direct" data-msg-search="'+esc((title+' '+stamp(x.last_activity)).toLowerCase())+'">'+card(title, '🔒 محادثة بين أعضاء مخوّلين · آخر نشاط '+stamp(x.last_activity), '<button class="msg-open" data-conv="'+x.id+'" type="button">فتح المحادثة</button>')+'</div>'; }).join('');
    } else {
      h += '<div class="msg-empty">لا توجد محادثات خاصة بعد. لا تُفتح أي محادثة جديدة إلا بعد قبول دعوة صريحة من الطرف الآخر.</div>';
    }
    h += '</div>';
    h += '<div class="msg-sec">📨 طلبات المحادثة الخاصة</div><div class="msg-modrow">قبول الطلب يفتح المحادثة الخاصة فقط؛ ولا ينشئ زمالة تلقائياً. يمكنك رفض الطلب أو إلغاء دعوتك الصادرة.</div>';
    if(!inv.ok){
      h += '<div class="msg-empty">مركز الدعوات غير متاح لأن واجهة الموافقة الصريحة غير مفعّلة على الخادم. لم يتم إنشاء أي محادثة.</div>';
    } else {
      var incoming = inv.incoming || [], outgoing = inv.outgoing || [];
      var statusLabel = function(s){
        return ({pending:'قيد الانتظار',accepted:'مقبول',declined:'مرفوض',cancelled:'ملغى',expired:'منتهي الصلاحية'})[s] || 'غير معروف';
      };
      h += '<div class="msg-grid">';
      h += '<section class="msg-card"><h3>📥 الدعوات الواردة</h3>';
      if(incoming.length){
        h += incoming.map(function(x){
          var actions = x.status==='pending'
            ? '<div class="msg-modbtns"><button class="msg-modbtn" data-invite-act="accept" data-invite-id="'+esc(x.id)+'" type="button">✔ قبول وفتح المحادثة</button><button class="msg-modbtn" data-invite-act="decline" data-invite-id="'+esc(x.id)+'" type="button">رفض الدعوة</button></div>'
            : (x.status==='accepted' && x.conversation_id ? '<div class="msg-modbtns"><button class="msg-modbtn" data-conv="'+esc(x.conversation_id)+'" type="button">فتح المحادثة</button></div>' : '');
          return '<article class="msg-modcard"><div class="msg-meta"><b>طلب محادثة خاصة من طالب</b><span>'+stamp(x.created_at)+'</span></div><div class="msg-body">الحالة: '+statusLabel(x.status)+'</div>'+actions+'</article>';
        }).join('');
      } else h += '<div class="msg-empty">لا توجد دعوات واردة.</div>';
      h += '</section><section class="msg-card"><h3>📤 الدعوات الصادرة</h3>';
      if(outgoing.length){
        h += outgoing.map(function(x){
          var actions = x.status==='pending'
            ? '<div class="msg-modbtns"><button class="msg-modbtn" data-invite-act="cancel" data-invite-id="'+esc(x.id)+'" type="button">إلغاء الدعوة</button></div>'
            : (x.status==='accepted' && x.conversation_id ? '<div class="msg-modbtns"><button class="msg-modbtn" data-conv="'+esc(x.conversation_id)+'" type="button">فتح المحادثة</button></div>' : '');
          return '<article class="msg-modcard"><div class="msg-meta"><b>دعوة أرسلتها</b><span>'+stamp(x.created_at)+'</span></div><div class="msg-body">الحالة: '+statusLabel(x.status)+'</div>'+actions+'</article>';
        }).join('');
      } else h += '<div class="msg-empty">لم ترسل أي دعوة بعد.</div>';
      h += '</section></div>';
    }
    var isMod = !!(u && u.role==='admin');
    if(u && u.role==='prof' && window.SB && typeof window.SB.admMyPerms==='function'){
      var moderationAccess = await window.SB.admMyPerms();
      if(renderEpoch!==state.renderEpoch) return;
      isMod = !!(moderationAccess && moderationAccess.ok &&
        Array.isArray(moderationAccess.perms) &&
        moderationAccess.perms.indexOf('messaging.moderate')!==-1);
    }
    if(isMod){
      var rep0 = await window.SB.msgReportsOpen();
      if(renderEpoch!==state.renderEpoch) return;
      var lg0 = await window.SB.msgLogLast();
      if(renderEpoch!==state.renderEpoch) return;
      h += '<div class="msg-sec">🛡 الإشراف (الأستاذ / الإدارة)</div><div class="msg-mod">';
      h += '<div class="msg-modrow"><b>البلاغات المفتوحة:</b> ' + (rep0.ok ? rep0.reports.length : '⛔ ' + esc(rep0.err)) + '</div>';
      if(rep0.ok && rep0.reports.length){
        h += rep0.reports.map(function(r){
          var m = r.msg_messages || {};
          return '<div class="msg-modcard"><div class="msg-meta"><b>🚩 ' + esc(r.motif || 'بلاغ') + '</b><span>' + stamp(r.created_at) + '</span></div>' +
            '<div class="msg-body">' + esc(m.deleted_at ? '(تم حذف الرسالة سابقاً)' : (m.body || '')) + '</div>' +
            '<div class="msg-modbtns">' +
            '<button class="msg-modbtn" data-mod="traite" data-rid="' + r.id + '" type="button">✅ معالجة</button>' +
            '<button class="msg-modbtn" data-mod="rejete" data-rid="' + r.id + '" type="button">❌ رفض</button>' +
            '<button class="msg-modbtn" data-mod="delmsg" data-rid="' + r.id + '" type="button">🚫 حذف الرسالة</button>' +
            '<button class="msg-modbtn" data-mod="retireatt" data-rid="' + r.id + '" type="button">📎 حذف المرفق</button>' +
            '</div></div>';
        }).join('');
      }
      var vq = await window.SB.msgVerificationQueue(state.verificationPage,50);
      if(renderEpoch!==state.renderEpoch) return;
      var verificationTotal = vq && vq.ok ? Math.max(0,Number(vq.total)||0) : 0;
      var verificationPages = Math.max(1,Math.ceil(verificationTotal/50));
      if(vq && vq.ok && state.verificationPage>=verificationPages && state.verificationPage>0){
        state.verificationPage=verificationPages-1;
        return renderList();
      }
      window.__msgVerificationRows = vq && vq.ok && Array.isArray(vq.queue) ? vq.queue : [];
      var verificationFirst = verificationTotal ? state.verificationPage*50+1 : 0;
      var verificationLast = Math.min((state.verificationPage+1)*50,verificationTotal);
      h += '<div class="msg-modrow"><b>طلبات التحقق من الهوية قيد الانتظار:</b> ' + (vq.ok ? verificationTotal+' · عرض '+verificationFirst+'–'+verificationLast+' · الصفحة '+(state.verificationPage+1)+'/'+verificationPages : '⛔ '+esc(vq.err||'تعذّر تحميل الطلبات')) + '</div>';
      if(vq.ok && vq.queue.length){
        h += vq.queue.map(function(q){
          var missingVerification = verificationMissing(q);
          var canVerify = missingVerification.length === 0;
          return '<div class="msg-modcard"><div class="msg-meta"><b>🪪 ' + esc(q.pseudo||'?') + '</b><span>' + esc((q.wilaya||'?')+' · '+(q.niveau||'?')+' · '+(q.filiere||'?')) + '</span></div>' +
            '<div class="msg-body">رقم التسجيل المدرسي: ' + esc(q.matricule||'—') + ' · الشعبة: ' + esc(q.section||'—') + '</div>' +
            (canVerify ? '' : '<div class="msg-empty" role="alert">⛔ لا يمكن التفعيل: معلومات ناقصة أو غير صالحة — '+esc(missingVerification.join('، '))+'</div>') +
            '<div class="msg-modbtns">' +
            (q.carte_scolaire_path ? '<button class="msg-modbtn" data-mod="verif-doc" data-uid="' + q.id + '" type="button">🪪 فتح البطاقة المدرسية</button>' : '<span class="msg-empty">⛔ لا توجد بطاقة مدرسية مرفقة</span>') +
            '<button class="msg-modbtn" data-mod="verif-ok" data-uid="' + q.id + '" type="button"' + (canVerify ? '' : ' disabled title="أكمل معلومات الهوية المدرسية أولاً"') + '>✔ تأكيد</button>' +
            '<button class="msg-modbtn" data-mod="verif-no" data-uid="' + q.id + '" type="button">⛔ رفض</button></div></div>';
        }).join('');
      }
      if(vq && vq.ok){
        h += '<div class="msg-modbtns"><button class="msg-modbtn" data-verif-page="'+Math.max(0,state.verificationPage-1)+'" type="button"'+(state.verificationPage===0?' disabled':'')+'>السابق</button><span>صفحة '+(state.verificationPage+1)+' من '+verificationPages+'</span><button class="msg-modbtn" data-verif-page="'+(state.verificationPage+1)+'" type="button"'+(state.verificationPage+1>=verificationPages?' disabled':'')+'>التالي</button></div>';
      }
      h += '<div class="msg-modrow"><b>إنشاء مجموعة رسمية</b> (الولاية · المستوى · الشعبة): </div>' +
           '<div class="msg-modform"><input id="mgWil" placeholder="رقم الولاية (مثال: 16)" maxlength="2"><select id="mgNiv"><option value="1AS">1AS</option><option value="2AS">2AS</option><option value="3AS">3AS</option></select><input id="mgFil" placeholder="الشعبة (مثال: علوم)"><button class="msg-modbtn" data-mod="creategroup" type="button">➕ إنشاء</button></div>';
      h += '<div class="msg-modrow"><b>السجل (آخر 20 إجراء): </b></div><div class="msg-log">';
      h += (lg0.ok ? (lg0.log.slice(0,20).map(function(l){ return '<div>' + stamp(l.at) + ' · ' + esc(l.action) + ' · ' + esc(l.cible_type) + ' #' + esc(l.cible_id) + '</div>'; }).join('') || '<div>السجل فارغ</div>') : '<div>⛔ ' + esc(lg0.err) + '</div>');
      h += '</div></div>';
    }
    box.innerHTML = h; state.conv = null;
    startInviteChannel();
  }
  async function renderThread(id, keepChannel){
    var renderEpoch = ++state.renderEpoch;
    state.conv = id;
    closeInviteChannel();
    var box = el('msgBody'); if(!box) return;
    var u = await session();
    if(renderEpoch!==state.renderEpoch || state.conv!==id) return;
    state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'أنا';
    var r = await window.SB.msgMessages(id, null, 50);
    if(renderEpoch!==state.renderEpoch || state.conv!==id) return;
    if(!r.ok){ closeChannel(); box.innerHTML = '<div class="msg-empty">⛔ '+esc(r.err)+'</div><button class="msg-back" data-act="back" type="button">العودة ←</button>'; return; }
    var others = [];
    r.msgs.forEach(function(m){ if(m.sender_id!==state.me && others.indexOf(m.sender_id)===-1) others.push(m.sender_id); });
    await fetchNames(others);
    if(renderEpoch!==state.renderEpoch || state.conv!==id) return;
    var h = '<div class="msg-thread-nav"><button class="msg-back" data-act="back" type="button">← العودة إلى مساحات التواصل</button><span class="msg-thread-nav-label">الرسائل · فضاء تعليمي آمن</span></div>'+
            '<section class="msg-conversation-panel" aria-label="محادثة دراسية">'+
            '<div class="msg-thread-topbar"><div class="msg-thread-avatar" aria-hidden="true">💬</div><div class="msg-thread-heading"><b>مساحة الحوار الدراسي</b><small>تبادل المعرفة باحترام · رسائل الأعضاء المخوّلين فقط</small></div><span class="msg-pres" id="msgPres"></span></div>'+
            '<div class="msg-thread">';
    var attachmentMap = await attachmentsFor(r.msgs.map(function(m){ return m.id; }));
    if(renderEpoch!==state.renderEpoch || state.conv!==id) return;
    var renderedRows = r.msgs.map(function(m){
      var a=attachmentMap && attachmentMap[m.id];
      if(a && a.ok) a.sizeLabel=sizeLabel(a.octets);
      return rowHtml(m, false, a && a.found ? a : null);
    });
    h += renderedRows.join('') || '<div class="msg-empty">لا توجد رسائل حالياً.</div>';
    h += '</div><div class="msg-input"><span class="msg-composer-mark" aria-hidden="true">✍️</span><textarea id="msgText" rows="2" maxlength="2000" placeholder="اكتب رسالة مفيدة ومحترمة…"></textarea>'+
         '<label class="msg-pj" title="إرفاق ملف (PNG/JPEG/WebP/PDF، حتى 5 ميغابايت)">📎<input type="file" id="msgFile" accept="image/png,image/jpeg,image/webp,application/pdf" hidden></label>'+
         '<button class="msg-send" data-act="send" type="button">إرسال ➤</button></div><div class="msg-err" id="msgErr" hidden></div></section>';
    box.innerHTML = h;
    if(!keepChannel) startChannel(id);
  }
  async function send(){
    var t = el('msgText'), err = el('msgErr'), b = document.querySelector('#msgBody [data-act="send"]');
    if(!t || !state.conv || !t.value.trim()) return;
    var conv = state.conv, body = t.value, identityEpoch = state.authEpoch;
    if(b) b.disabled=true;
    var r;
    try{
      r = await window.SB.msgSend(conv, body);
    }catch(error){
      /* Une réponse réseau tardive ne doit pas réécrire une autre conversation. */
      if(state.conv!==conv || state.authEpoch!==identityEpoch) return;
      var currentErr=el('msgErr'), currentButton=document.querySelector('#msgBody [data-act="send"]');
      if(currentErr){ currentErr.hidden=false; currentErr.textContent='⛔ '+String(error && error.message || error); }
      if(currentButton) currentButton.disabled=false;
      return;
    }
    /* L'utilisateur peut avoir changé de conversation pendant l'INSERT. */
    if(state.conv!==conv || state.authEpoch!==identityEpoch) return;
    if(!r || !r.ok){
      var currentErr=el('msgErr'), currentButton=document.querySelector('#msgBody [data-act="send"]');
      if(currentErr){ currentErr.hidden=false; currentErr.textContent='⛔ '+((r&&r.err)||'تعذّر إرسال الرسالة'); }
      if(currentButton) currentButton.disabled=false;
      return;
    }
    var currentComposer=el('msgText');
    if(currentComposer===t) currentComposer.value='';
    var currentErr=el('msgErr'); if(currentErr) currentErr.hidden=true;
    await renderThread(conv);
  }
  function scheduleThreadRecovery(){
    var id = state.conv;
    if(!id || (document.visibilityState && document.visibilityState==='hidden')) return;
    /* Ne pas repousser une reprise déjà planifiée à chaque notification d'erreur.
       Le délai augmente jusqu'à 32 s si le canal échoue de façon répétée. */
    if(state.recoveryTimer) return;
    var attempt = Math.min(state.recoveryAttempts || 0, 7);
    var delay = Math.min(32000, 250 * Math.pow(2, attempt));
    state.recoveryTimer = setTimeout(function(){
      state.recoveryTimer = null;
      if(!state.conv || state.conv!==id || (document.visibilityState && document.visibilityState==='hidden')) return;
      state.recoveryAttempts = Math.min((state.recoveryAttempts || 0) + 1, 7);
      /* Réconciliation HTTP + nouveau canal après TIMED_OUT/CLOSED inattendu.
         renderEpoch neutralise les réponses anciennes; SUBSCRIBED remet le backoff à zéro. */
      renderThread(id).catch(function(){});
    }, delay);
  }
  window.addEventListener('online', function(){
    scheduleThreadRecovery();
    scheduleInviteRecovery();
  });
  window.addEventListener('pageshow', function(){
    scheduleThreadRecovery();
    scheduleInviteRecovery();
  });
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState==='visible'){
      scheduleThreadRecovery();
      scheduleInviteRecovery();
    }
  });
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    state.inviteViewActive = String(v).indexOf('msg')>=0;
    if(!state.inviteViewActive) state.conv = null;
    closeChannel();
    closeInviteChannel();
    if(state.inviteViewActive){ state.conv=null; renderList(); }
  });
  document.addEventListener('input', function(e){
    if(!e.target || e.target.id!=='msgListSearch') return;
    var q=String(e.target.value||'').trim().toLowerCase();
    document.querySelectorAll('#msgBody .msg-item').forEach(function(item){
      var hay=String(item.getAttribute('data-msg-search')||'');
      item.hidden=!!q && hay.indexOf(q)===-1;
    });
  });
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-conv],[data-act],[data-report],[data-msg-filter],[data-invite-act],[data-peer-key],[data-msg-act],[data-verif-page],[data-mod]') : null;
    if(!t) return;
    var msgAct = t.getAttribute('data-msg-act');
    if(msgAct){
      var messageId = t.getAttribute('data-mid');
      var row = t.closest('.msg-row');
      if(!messageId || !row || !row.classList.contains('me') || !state.me){ return; }
      var actionConv = state.conv, actionIdentityEpoch = state.authEpoch;
      if(msgAct==='edit'){
        var bodyNode = row.querySelector('.msg-body');
        var currentText = bodyNode ? bodyNode.textContent.replace(/\s*·\s*(عُدّلت|تم الإبلاغ عنها).*$/,'').trim() : '';
        var revised = window.prompt('تعديل رسالتك :', currentText);
        if(revised===null) return;
        if(!revised.trim() || revised.length>2000){ window.alert('اكتب رسالة بين 1 و2000 حرف.'); return; }
        t.disabled=true;
        window.SB.msgEdit(messageId,revised).then(function(result){
          if(!result || !result.ok){ window.alert('⛔ '+((result&&result.err)||'تعذّر تعديل الرسالة')); }
          if(state.conv===actionConv && state.authEpoch===actionIdentityEpoch) renderThread(actionConv, true);
        }).catch(function(error){ window.alert('⛔ '+String(error&&error.message||error)); if(state.conv===actionConv && state.authEpoch===actionIdentityEpoch) renderThread(actionConv, true); });
        return;
      }
      if(msgAct==='delete'){
        if(!window.confirm('هل تريد حذف هذه الرسالة؟ لن تظهر بعد ذلك في المحادثة.')) return;
        t.disabled=true;
        window.SB.msgDelete(messageId).then(function(result){
          if(!result || !result.ok){ window.alert('⛔ '+((result&&result.err)||'تعذّر حذف الرسالة')); }
          if(state.conv===actionConv && state.authEpoch===actionIdentityEpoch) renderThread(actionConv, true);
        }).catch(function(error){ window.alert('⛔ '+String(error&&error.message||error)); if(state.conv===actionConv && state.authEpoch===actionIdentityEpoch) renderThread(actionConv, true); });
        return;
      }
    }
    var peerKey = t.getAttribute('data-peer-key');
    if(peerKey){
      var recipientKey = state.peers[peerKey], inviteIdentityEpoch = state.authEpoch;
      if(!recipientKey){ window.alert('⛔ انتهت صلاحية نتيجة البحث. أعد البحث من فضلك.'); return; }
      t.disabled = true;
      window.SB.msgInviteSend(recipientKey).then(function(result){
        if(state.authEpoch!==inviteIdentityEpoch) return;
        if(!result || !result.ok){ window.alert('⛔ '+((result && result.err)||'تعذّر إرسال الدعوة')); renderList(); return; }
        window.alert('تم إرسال طلب المحادثة. ستُفتح المحادثة فقط بعد موافقة الطرف الآخر.');
        renderList();
      }).catch(function(error){ if(state.authEpoch!==inviteIdentityEpoch) return; window.alert('⛔ '+String(error && error.message || error)); renderList(); });
      return;
    }
    var inviteAct = t.getAttribute('data-invite-act');
    if(inviteAct){
      var inviteId = t.getAttribute('data-invite-id'), inviteActionIdentityEpoch = state.authEpoch;
      var inviteMethod = inviteAct==='accept' ? 'msgInviteAccept' : (inviteAct==='decline' ? 'msgInviteDecline' : 'msgInviteCancel');
      t.disabled = true;
      window.SB[inviteMethod](inviteId).then(function(result){
        if(state.authEpoch!==inviteActionIdentityEpoch) return;
        if(!result || !result.ok){ window.alert('⛔ '+((result && result.err)||'تعذّر تنفيذ الطلب')); renderList(); return; }
        if(inviteAct==='accept' && result.convId){ renderThread(+result.convId); }
        else renderList();
      }).catch(function(error){ if(state.authEpoch!==inviteActionIdentityEpoch) return; window.alert('⛔ '+String(error && error.message || error)); renderList(); });
      return;
    }
    if(t.getAttribute('data-conv')){ renderThread(+t.getAttribute('data-conv')); return; }
    var filter = t.getAttribute('data-msg-filter');
    if(filter){
      var items=document.querySelectorAll('#msgBody .msg-item');
      items.forEach(function(item){ item.hidden=filter!=='all' && item.getAttribute('data-msg-kind')!==filter; });
      document.querySelectorAll('#msgBody [data-msg-filter]').forEach(function(b){ b.classList.toggle('active',b===t); });
      return;
    }
    var act = t.getAttribute('data-act');
    if(act==='search-students'){
      var query = (el('msgStudentSearchQuery')||{}).value || '', searchIdentityEpoch = state.authEpoch;
      var resultsBox = el('msgStudentResults');
      if(query.trim().length<3){ if(resultsBox) resultsBox.textContent='اكتب ثلاثة أحرف على الأقل للبحث.'; return; }
      if(!window.SB || typeof window.SB.msgStudentSearch!=='function'){ if(resultsBox) resultsBox.textContent='خدمة البحث غير مفعّلة بعد على الخادم.'; return; }
      t.disabled=true;
      if(resultsBox) resultsBox.textContent='جارٍ البحث عن زملاء مطابقين لملفك الدراسي…';
      window.SB.msgStudentSearch(query,12).then(function(result){
        if(state.authEpoch!==searchIdentityEpoch) return;
        t.disabled=false;
        if(!result || !result.ok){ if(resultsBox) resultsBox.textContent='تعذّر البحث حالياً. قد تحتاج قاعدة البيانات إلى تفعيل تحديث البحث الآمن.'; return; }
        state.peers={};
        var students=result.students||[];
        if(!students.length){ if(resultsBox) resultsBox.textContent='لم نعثر على زملاء مطابقين. تحقق من الاسم المستعار وحاول لاحقاً.'; return; }
        var html='<div class="msg-grid">';
        students.forEach(function(p,i){
          var key='peer'+i; state.peers[key]=p.student_key;
          html+='<article class="msg-modcard"><div class="msg-meta"><b>'+esc(p.pseudo||'طالب')+'</b><span>'+esc(p.niveau||'')+'</span></div>'+
            '<div class="msg-body">'+esc(p.filiere||'')+' · ولاية '+esc(p.wilaya||'')+'</div>'+
            '<div class="msg-modbtns"><button class="msg-modbtn" data-peer-key="'+key+'" type="button">📨 إرسال طلب محادثة</button></div></article>';
        });
        html+='</div>';
        if(resultsBox) resultsBox.innerHTML=html;
      }).catch(function(error){ if(state.authEpoch!==searchIdentityEpoch) return; t.disabled=false; if(resultsBox && resultsBox.isConnected) resultsBox.textContent='تعذّر البحث: '+String(error && error.message || error); });
      return;
    }
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
      var cardInput = el('vfCard'), cardFile = cardInput && cardInput.files && cardInput.files[0];
      var verificationIdentityEpoch = state.authEpoch;
      if(!cardFile){ window.alert('⛔ أرفق صورة البطاقة المدرسية أو ملف PDF أولاً.'); return; }
      t.disabled = true;
      window.SB.msgUploadSchoolCard(cardFile).then(function(uploaded){
        if(state.authEpoch!==verificationIdentityEpoch) return;
        if(!uploaded || !uploaded.ok) throw new Error((uploaded&&uploaded.err)||'تعذّر رفع البطاقة');
        return window.SB.msgRequestVerification(mv,sv,uploaded.path);
      }).then(function(r4){
        if(state.authEpoch!==verificationIdentityEpoch) return;
        if(r4 && r4.ok){ renderList(); if(r4.cleanupWarning) window.alert('⚠️ '+r4.cleanupWarning); }
        else { t.disabled=false; window.alert('⛔ '+((r4&&r4.err)||'تعذّر إرسال طلب التحقق')); }
      }).catch(function(error){ if(state.authEpoch!==verificationIdentityEpoch) return; t.disabled=false; window.alert('⛔ '+String(error && error.message || error)); });
      return;
    }
    var verificationPage = t.getAttribute('data-verif-page');
    if(verificationPage !== null){ renderList(Number(verificationPage)); return; }
    var mod = t.getAttribute('data-mod');
    if(mod){
      if(mod==='verif-doc'){
        var docUid = t.getAttribute('data-uid');
        var docRow = (window.__msgVerificationRows||[]).find(function(row){ return row.id===docUid; });
        var docPath = docRow && docRow.carte_scolaire_path;
        if(!docRow || !docPath || !String(docPath).startsWith(String(docUid)+'/') ||
           !window.SB || typeof window.SB.msgSchoolCardUrl!=='function'){
          window.alert('⛔ مستند الهوية غير متاح أو مساره غير صالح');
          return;
        }
        var docWindow = window.open('about:blank','_blank');
        if(!docWindow){ window.alert('⛔ اسمح بفتح نافذة جديدة لعرض البطاقة المدرسية.'); return; }
        try{ docWindow.opener = null; }catch(ignore){}
        t.disabled = true;
        var docIdentityEpoch = state.authEpoch;
        window.SB.msgSchoolCardUrl(docPath).then(function(result){
          if(state.authEpoch!==docIdentityEpoch){ try{ docWindow.close(); }catch(ignore){} return; }
          t.disabled = false;
          if(result && result.ok && result.url){ docWindow.location.replace(result.url); }
          else { try{ docWindow.close(); }catch(ignore){} window.alert('⛔ '+((result&&result.err)||'تعذّر فتح البطاقة')); }
        }).catch(function(error){
          if(state.authEpoch!==docIdentityEpoch){ try{ docWindow.close(); }catch(ignore){} return; }
          t.disabled = false;
          try{ docWindow.close(); }catch(ignore){}
          window.alert('⛔ '+String(error&&error.message||error));
        });
        return;
      }
      if(mod==='creategroup'){
        var w = (el('mgWil')||{}).value || '', n = (el('mgNiv')||{}).value || '', f = (el('mgFil')||{}).value || '';
        var groupIdentityEpoch = state.authEpoch;
        window.SB.msgCreateGroup(w, n, f, '').then(function(r2){
          if(state.authEpoch!==groupIdentityEpoch) return;
          if(r2 && r2.ok){ renderList(); } else { window.alert('⛔ ' + ((r2&&r2.err)||'تعذّر إنشاء المجموعة')); }
        }).catch(function(error){ if(state.authEpoch!==groupIdentityEpoch) return; window.alert('⛔ '+String(error && error.message || error)); });
        return;
      }
      if(mod==='verif-ok' || mod==='verif-no'){
        var uidv = t.getAttribute('data-uid');
        if(mod==='verif-ok'){
          var verificationRow = (window.__msgVerificationRows||[]).find(function(row){ return row.id===uidv; });
          var missingForApproval = verificationMissing(verificationRow);
          if(missingForApproval.length){
            window.alert('⛔ لا يمكن تأكيد الطلب قبل استكمال والتحقق من: '+missingForApproval.join('، '));
            return;
          }
        }
        var moderationIdentityEpoch = state.authEpoch;
        window.SB.msgSetVerification(uidv, mod==='verif-ok'?'verifie':'rejete').then(function(r3){
          if(state.authEpoch!==moderationIdentityEpoch) return;
          if(r3 && r3.ok){ renderList(); } else { window.alert('⛔ '+((r3&&r3.err)||'تعذّر تحديث التحقق')); }
        }).catch(function(error){ if(state.authEpoch!==moderationIdentityEpoch) return; window.alert('⛔ '+String(error && error.message || error)); });
        return;
      }
      var rid = +t.getAttribute('data-rid');
      var opts = { retireAtt: mod==='retireatt', deleteMsg: mod==='delmsg' };
      var dec = (mod==='rejete') ? 'rejete' : 'traite';
      var reportActionIdentityEpoch = state.authEpoch;
      window.SB.msgHandle(rid, dec, opts).then(function(r2){
        if(state.authEpoch!==reportActionIdentityEpoch) return;
        if(r2 && r2.ok){ renderList(); } else { window.alert('⛔ ' + ((r2&&r2.err)||'تعذّر معالجة البلاغ')); }
      }).catch(function(error){ if(state.authEpoch!==reportActionIdentityEpoch) return; window.alert('⛔ '+String(error && error.message || error)); });
      return;
    }
    var rep = t.getAttribute('data-report');
    if(rep){
      var reportIdentityEpoch = state.authEpoch;
      window.SB.msgReport(+rep,'تم الإبلاغ عنه من واجهة الرسائل').then(function(result){
        if(state.authEpoch!==reportIdentityEpoch || !t.isConnected) return;
        if(result && result.ok){ t.disabled=true; t.textContent='🚩✓'; }
        else window.alert('⛔ '+((result&&result.err)||'تعذّر إرسال البلاغ'));
      }).catch(function(error){
        if(state.authEpoch!==reportIdentityEpoch || !t.isConnected) return;
        window.alert('⛔ '+String(error && error.message || error));
      });
    }
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
  document.addEventListener('change', async function(e){
    if(!e.target || e.target.id!=='msgFile' || !state.conv) return;
    var input=e.target, f=input.files && input.files[0]; if(!f) return;
    var err=el('msgErr'), conv=state.conv, uploadIdentityEpoch=state.authEpoch;
    function uploadContextCurrent(){
      return state.authEpoch===uploadIdentityEpoch && state.conv===conv;
    }
    function uploadUi(){
      return uploadContextCurrent() && input.isConnected && el('msgErr');
    }
    var allowed=['image/png','image/jpeg','image/webp','application/pdf'];
    if(allowed.indexOf(f.type)===-1 || !f.size || f.size>5242880){
      if(err){ err.hidden=false; err.textContent='⛔ الصيغ المقبولة: PNG أو JPEG أو WebP أو PDF، بحد أقصى 5 ميغابايت.'; }
      input.value=''; return;
    }
    var sendButton=document.querySelector('#msgBody [data-act="send"]');
    if(sendButton) sendButton.disabled=true;
    if(err){ err.hidden=false; err.textContent='⏳ جارٍ رفع الملف '+f.name+'…'; }
    try{
      var sent=await window.SB.msgSend(conv, '📎 '+f.name);
      if(!uploadContextCurrent()) return;
      if(!sent || !sent.ok){
        if(uploadUi()){ err.hidden=false; err.textContent='⛔ '+((sent&&sent.err)||'تعذّر إرسال الملف.'); }
        if(sendButton && sendButton.isConnected) sendButton.disabled=false;
        if(input.isConnected) input.value='';
        return;
      }
      /* Ne pas lancer l'upload Storage si l'identité a changé après l'envoi du message. */
      if(!uploadContextCurrent()) return;
      var uploaded=await window.SB.msgUpload(conv, sent.msg.id, f);
      if(!uploadContextCurrent()) return;
      if(!uploaded || !uploaded.ok){
        if(uploadUi()){ err.hidden=false; err.textContent='⛔ تعذّر إرفاق الملف: '+((uploaded&&uploaded.err)||'خطأ غير معروف'); }
        if(sendButton && sendButton.isConnected) sendButton.disabled=false;
        if(input.isConnected) input.value='';
        await renderThread(conv);
        return;
      }
      if(input.isConnected) input.value='';
      await renderThread(conv);
      if(uploadContextCurrent()){
        var successErr=el('msgErr');
        if(successErr){ successErr.hidden=false; successErr.textContent='✔ تم إرسال الملف.'; }
      }
    }catch(error){
      if(!uploadContextCurrent()) return;
      if(uploadUi()){ err.hidden=false; err.textContent='⛔ تعذّر رفع الملف: '+String(error && error.message || error); }
      if(sendButton && sendButton.isConnected) sendButton.disabled=false;
      if(input.isConnected) input.value='';
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.target && e.target.id==='msgText' && e.key==='Enter' && !e.shiftKey){
      e.preventDefault(); send();
    }
  });
})();
