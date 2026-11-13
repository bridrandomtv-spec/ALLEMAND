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
      ids.forEach(function(i){ out[i] = state.names[i] || ('عضو '+String(i).slice(0,4)); });
    }catch(e){ ids.forEach(function(i){ out[i]=state.names[i]||('عضو '+String(i).slice(0,4)); }); }
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
      (mine?'':'<button class="msg-report" data-report="'+m.id+'" type="button" title="إبلاغ">🚩</button>')+'</div>'+
      '<div class="msg-body">'+esc(m.body)+(m.flagged?' <em class="msg-flag">· تم الإبلاغ عنه</em>':'')+'</div>'+att+'</div>';
  }
  async function attachmentsFor(messageIds){
    try{ return await window.SB.msgAttachmentInfos(messageIds); }
    catch(e){ return {}; }
  }
  function sizeLabel(n){
    n=Number(n)||0; return n>=1048576?(n/1048576).toFixed(1)+' ميغابايت':Math.max(1,Math.round(n/1024))+' كيلوبايت';
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
          Promise.all([fetchNames([m.sender_id]), attachmentsFor([m.id])]).then(function(parts){
            var a=parts[1] && parts[1][m.id];
            if(a && a.ok) a.sizeLabel=sizeLabel(a.octets);
            th.insertAdjacentHTML('beforeend', rowHtml(m, true, a && a.found ? a : null));
          });
        })
        .on('postgres_changes', { event:'UPDATE', schema:'public', table:'msg_messages', filter:'conversation_id=eq.'+id }, function(){
          if(state.conv===id) renderThread(id);
        })
        .on('presence', { event:'sync' }, function(){
          try{
            var ps = ch.presenceState(); var n = Object.keys(ps||{}).length;
            var pe = el('msgPres'); if(pe) pe.textContent = n>0 ? ('● '+n+' متصل الآن') : '';
          }catch(e){}
        });
      ch.subscribe(function(st2){
        if(st2==='SUBSCRIBED'){
          try{ ch.track({ p: (state.meName||'أنا') }); }catch(e){}
        }
      });
      state.ch = ch;
    }catch(e){ state.ch = null; }
  }
  async function renderList(){
    closeChannel();
    var box = el('msgBody'); if(!box) return;
    var u = await session(); state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'أنا';
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
    var c = await window.SB.msgConvs();
    var vf = await window.SB.msgMyVerification();
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
        : (vf.statut==='rejete' ? '⛔ <b>تم رفض الطلب</b> — صحّح رقم التسجيل المدرسي أو الشعبة ثم أعد إرسال الطلب. ' : '🪪 <b>التحقق من الهوية المدرسية</b> — مطلوب قبل بدء محادثة خاصة. ') +
          '<div class="msg-vhint">التحقق المدرسي مجاني ولا يتطلب اشتراكاً مدفوعاً. أدخل رقم تسجيلك المدرسي والشعبة لإرسال الطلب إلى فريق الإشراف.</div><div class="msg-vform"><input id="vfMat" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="رقم التسجيل المدرسي (مجاني)" maxlength="20"><input id="vfSec" placeholder="الشعبة / القسم (مثال: 2AS-1)" maxlength="40" value="'+esc(vf.section||'')+'"><button class="msg-send" data-act="verif-req" type="button">إرسال طلب التحقق</button></div>')
        + '</div>';
    }
    if(!isMod0 && vf.ok && vf.statut==='verifie'){ h += '<div class="msg-verif ok">✔ تم التحقق من الهوية المدرسية — الرسائل الخاصة متاحة ضمن المجموعة الدراسية المشتركة.</div>'; }
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
    h += '<div class="msg-sec">📨 طلبات المحادثة الخاصة</div><div class="msg-invite-note">قبول الطلب يفتح المحادثة الخاصة فقط؛ ولا ينشئ زمالة تلقائياً. يمكنك رفض الطلب أو إلغاء دعوتك الصادرة.</div>';
    var inv = await window.SB.msgInvites();
    if(!inv.ok){
      h += '<div class="msg-empty">تعذّر تحميل مركز الدعوات حالياً. تأكد من اتصال الخدمة وتفعيل تحديث الدعوات على الخادم. لم يتم إنشاء أي محادثة.</div>';
    } else {
      var incoming = inv.incoming || [], outgoing = inv.outgoing || [];
      var statusLabel = function(s){
        return ({pending:'قيد الانتظار',accepted:'مقبول',declined:'مرفوض',cancelled:'ملغى',expired:'منتهي الصلاحية'})[s] || 'غير معروف';
      };
      h += '<div class="msg-invite-grid">';
      h += '<section class="msg-invite-panel"><h3>📥 الدعوات الواردة</h3>';
      if(incoming.length){
        h += incoming.map(function(x){
          var actions = x.status==='pending'
            ? '<div class="msg-modbtns"><button class="msg-modbtn" data-invite-act="accept" data-invite-id="'+esc(x.id)+'" type="button">✔ قبول وفتح المحادثة</button><button class="msg-modbtn" data-invite-act="decline" data-invite-id="'+esc(x.id)+'" type="button">رفض الدعوة</button></div>'
            : (x.status==='accepted' && x.conversation_id ? '<div class="msg-modbtns"><button class="msg-modbtn" data-conv="'+esc(x.conversation_id)+'" type="button">فتح المحادثة</button></div>' : '');
          return '<article class="msg-modcard"><div class="msg-meta"><b>طلب محادثة خاصة من طالب</b><span>'+stamp(x.created_at)+'</span></div><div class="msg-body">الحالة: '+statusLabel(x.status)+'</div>'+actions+'</article>';
        }).join('');
      } else h += '<div class="msg-empty">لا توجد دعوات واردة.</div>';
      h += '</section><section class="msg-invite-panel"><h3>📤 الدعوات الصادرة</h3>';
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
    var isMod = u && (u.role==='prof' || u.role==='admin');
    if(isMod){
      var rep0 = await window.SB.msgReportsOpen();
      var lg0 = await window.SB.msgLogLast();
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
      var vq = await window.SB.msgVerificationQueue();
      h += '<div class="msg-modrow"><b>طلبات التحقق من الهوية قيد الانتظار:</b> ' + (vq.ok ? vq.queue.length : '⛔') + '</div>';
      if(vq.ok && vq.queue.length){
        h += vq.queue.map(function(q){
          return '<div class="msg-modcard"><div class="msg-meta"><b>🪪 ' + esc(q.pseudo||'?') + '</b><span>' + esc((q.wilaya||'?')+' · '+(q.niveau||'?')+' · '+(q.filiere||'?')) + '</span></div>' +
            '<div class="msg-body">رقم التسجيل المدرسي: ' + esc(q.matricule||'—') + ' · الشعبة: ' + esc(q.section||'—') + '</div>' +
            '<div class="msg-modbtns"><button class="msg-modbtn" data-mod="verif-ok" data-uid="' + q.id + '" type="button">✔ تأكيد</button>' +
            '<button class="msg-modbtn" data-mod="verif-no" data-uid="' + q.id + '" type="button">⛔ رفض</button></div></div>';
        }).join('');
      }
      h += '<div class="msg-modrow"><b>إنشاء مجموعة رسمية</b> (الولاية · المستوى · الشعبة): </div>' +
           '<div class="msg-modform"><input id="mgWil" placeholder="رقم الولاية (مثال: 16)" maxlength="2"><select id="mgNiv"><option value="1AS">1AS</option><option value="2AS">2AS</option><option value="3AS">3AS</option></select><input id="mgFil" placeholder="الشعبة (مثال: علوم)"><button class="msg-modbtn" data-mod="creategroup" type="button">➕ إنشاء</button></div>';
      h += '<div class="msg-modrow"><b>السجل (آخر 20 إجراء): </b></div><div class="msg-log">';
      h += (lg0.ok ? (lg0.log.slice(0,20).map(function(l){ return '<div>' + stamp(l.at) + ' · ' + esc(l.action) + ' · ' + esc(l.cible_type) + ' #' + esc(l.cible_id) + '</div>'; }).join('') || '<div>السجل فارغ</div>') : '<div>⛔ ' + esc(lg0.err) + '</div>');
      h += '</div></div>';
    }
    box.innerHTML = h; state.conv = null;
  }
  async function renderThread(id){
    var box = el('msgBody'); if(!box) return;
    var u = await session(); state.me = u ? u.id : null; state.meName = (u && (u.nom||u.pseudo)) || 'أنا';
    var r = await window.SB.msgMessages(id, null, 50);
    if(!r.ok){ closeChannel(); box.innerHTML = '<div class="msg-empty">⛔ '+esc(r.err)+'</div><button class="msg-back" data-act="back" type="button">العودة ←</button>'; return; }
    var others = [];
    r.msgs.forEach(function(m){ if(m.sender_id!==state.me && others.indexOf(m.sender_id)===-1) others.push(m.sender_id); });
    await fetchNames(others);
    var h = '<div class="msg-thread-nav"><button class="msg-back" data-act="back" type="button">← العودة إلى مساحات التواصل</button><span class="msg-thread-nav-label">الرسائل · فضاء تعليمي آمن</span></div>'+
            '<section class="msg-conversation-panel" aria-label="محادثة دراسية">'+
            '<div class="msg-thread-topbar"><div class="msg-thread-avatar" aria-hidden="true">💬</div><div class="msg-thread-heading"><b>مساحة الحوار الدراسي</b><small>تبادل المعرفة باحترام · رسائل الأعضاء المخوّلين فقط</small></div><span class="msg-pres" id="msgPres"></span></div>'+
            '<div class="msg-thread">';
    var attachmentMap = await attachmentsFor(r.msgs.map(function(m){ return m.id; }));
    var renderedRows = r.msgs.map(function(m){
      var a=attachmentMap && attachmentMap[m.id];
      if(a && a.ok) a.sizeLabel=sizeLabel(a.octets);
      return rowHtml(m, false, a && a.found ? a : null);
    });
    h += renderedRows.join('') || '<div class="msg-empty">لا توجد رسائل حالياً.</div>';
    h += '</div><div class="msg-input"><span class="msg-composer-mark" aria-hidden="true">✍️</span><textarea id="msgText" rows="2" maxlength="2000" placeholder="اكتب رسالة مفيدة ومحترمة…"></textarea>'+
         '<label class="msg-pj" title="إرفاق ملف (PNG/JPEG/WebP/PDF، حتى 5 ميغابايت)">📎<input type="file" id="msgFile" accept="image/png,image/jpeg,image/webp,application/pdf" hidden></label>'+
         '<button class="msg-send" data-act="send" type="button">إرسال ➤</button></div><div class="msg-err" id="msgErr" hidden></div></section>';
    box.innerHTML = h; state.conv = id;
    startChannel(id);
  }
  async function send(){
    var t = el('msgText'), err = el('msgErr'), b = document.querySelector('#msgBody [data-act="send"]');
    if(!t || !state.conv || !t.value.trim()) return;
    var conv = state.conv, body = t.value;
    if(b) b.disabled=true;
    var r = await window.SB.msgSend(conv, body);
    if(!r.ok){ if(err){ err.hidden=false; err.textContent='⛔ '+r.err; } if(b) b.disabled=false; return; }
    t.value=''; if(err) err.hidden=true;
    await renderThread(conv);
  }
  document.addEventListener('dz:view', function(e){
    var v = (e && e.detail && (e.detail.view||e.detail)) || '';
    if(String(v).indexOf('msg')>=0){ closeChannel(); state.conv=null; renderList(); }
    else { closeChannel(); }
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
    var t = e.target && e.target.closest ? e.target.closest('[data-conv],[data-act],[data-report],[data-msg-filter],[data-invite-act]') : null;
    if(!t) return;
    var inviteAct = t.getAttribute('data-invite-act');
    if(inviteAct){
      var inviteId = t.getAttribute('data-invite-id');
      var inviteMethod = inviteAct==='accept' ? 'msgInviteAccept' : (inviteAct==='decline' ? 'msgInviteDecline' : 'msgInviteCancel');
      t.disabled = true;
      window.SB[inviteMethod](inviteId).then(function(result){
        if(!result || !result.ok){ window.alert('⛔ '+((result && result.err)||'تعذّر تنفيذ الطلب')); renderList(); return; }
        if(inviteAct==='accept' && result.convId){ renderThread(+result.convId); }
        else renderList();
      }).catch(function(error){ window.alert('⛔ '+String(error && error.message || error)); renderList(); });
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
    if(rep){ window.SB.msgReport(+rep,'تم الإبلاغ عنه من واجهة الرسائل').then(function(){ t.disabled=true; t.textContent='🚩✓'; }); }
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
    var err=el('msgErr'), conv=state.conv;
    var allowed=['image/png','image/jpeg','image/webp','application/pdf'];
    if(allowed.indexOf(f.type)===-1 || !f.size || f.size>5242880){
      if(err){ err.hidden=false; err.textContent='⛔ الصيغ المقبولة: PNG أو JPEG أو WebP أو PDF، بحد أقصى 5 ميغابايت.'; }
      input.value=''; return;
    }
    var sendButton=document.querySelector('#msgBody [data-act="send"]');
    if(sendButton) sendButton.disabled=true;
    if(err){ err.hidden=false; err.textContent='⏳ جارٍ رفع الملف '+f.name+'…'; }
    var sent=await window.SB.msgSend(conv, '📎 '+f.name);
    if(!sent.ok){
      if(err){ err.hidden=false; err.textContent='⛔ '+sent.err; }
      if(sendButton) sendButton.disabled=false;
      input.value=''; return;
    }
    var uploaded=await window.SB.msgUpload(conv, sent.msg.id, f);
    if(!uploaded.ok){
      if(err){ err.hidden=false; err.textContent='⛔ تعذّر إرفاق الملف: '+uploaded.err; }
      if(sendButton) sendButton.disabled=false;
      input.value=''; await renderThread(conv); return;
    }
    input.value='';
    await renderThread(conv);
    var successErr=el('msgErr');
    if(successErr){ successErr.hidden=false; successErr.textContent='✔ تم إرسال الملف.'; }
  });
  document.addEventListener('keydown', function(e){
    if(e.target && e.target.id==='msgText' && e.key==='Enter' && !e.shiftKey){
      e.preventDefault(); send();
    }
  });
})();
