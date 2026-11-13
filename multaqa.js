/* Lot 444 — client du fil communautaire.
   Les RPC restent la seule frontière de sécurité ; ce module ne lit jamais profiles en REST.
   Tant que la migration n'est pas appliquée, le fil affiche un état d'indisponibilité explicite. */
(function(){
  'use strict';
  var rootId='mtqApp';
  var state={posts:[],comments:{},expanded:{},busy:false,profile:null,user:null,hasMore:false};
  function el(id){return document.getElementById(id);}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function stamp(v){try{return new Date(v).toLocaleString('ar-DZ',{dateStyle:'medium',timeStyle:'short'});}catch(e){return String(v||'');}}
  function box(){return el(rootId);}
  function stateCard(icon,title,body,tag){
    return '<section class="mtq-feed-state"><div class="mtq-state-icon">'+icon+'</div><span class="mtq-state-tag">'+esc(tag||'ملتقى الطلاب')+'</span><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p></section>';
  }
  function unavailable(err){
    var b=box();if(!b)return;
    b.innerHTML=stateCard('🛠️','الخدمة المجتمعية لم تُفعّل بعد','واجهة الملتقى جاهزة للاتصال، لكن خدمة المنشورات غير متاحة على الخادم حالياً. لن نعرض بيانات تجريبية أو ننشئ محتوى محلياً.','الربط بالخادم قيد الاستكمال');
    if(err) console.warn('[ملتقى الطلاب] backend:',err);
  }
  function accessCard(){
    var p=state.profile||{};
    var msg=p.verif_statut==='en_attente'
      ? 'طلب التحقق من هويتك المدرسية قيد المراجعة. ستتمكن من مشاهدة المنشورات الشخصية والمشاركة بعد اعتماد التحقق.'
      : 'المشاركة في المحتوى الشخصي متاحة للتلاميذ الذين تم التحقق من هويتهم المدرسية. الاشتراك المدفوع غير مطلوب.';
    return stateCard('🪪','يلزم التحقق من الهوية المدرسية',msg,'حماية المجتمع');
  }
  function postHtml(p){
    var mine=!!p.my_post;
    var comments=Number(p.comments_count)||0, reactions=Number(p.reactions_count)||0;
    return '<article class="mtq-post mtq-live-post" data-post="'+esc(p.post_id)+'">'+
      '<header class="mtq-post-head"><div class="mtq-avatar">🎓</div><div><strong>'+esc(p.author_pseudo||'تلميذ')+'</strong><small>'+esc(stamp(p.created_at))+'</small></div><span class="mtq-privacy">تلميذ موثّق</span></header>'+
      '<p class="mtq-live-body">'+esc(p.body)+'</p>'+
      '<footer class="mtq-post-foot"><button type="button" data-mtq-action="react" data-id="'+esc(p.post_id)+'" aria-pressed="'+(p.my_reaction?'true':'false')+'">'+(p.my_reaction?'💚 أعجبني':'🤍 إعجاب')+' · '+reactions+'</button>'+
      '<button type="button" data-mtq-action="comments" data-id="'+esc(p.post_id)+'">💬 التعليقات · '+comments+'</button>'+
      (mine?'':'<button type="button" data-mtq-action="report" data-id="'+esc(p.post_id)+'">🚩 إبلاغ</button>')+
      '</footer>'+(state.expanded[p.post_id]?commentsHtml(p.post_id):'')+'</article>';
  }
  function commentsHtml(id){
    var rows=state.comments[id]||[];
    return '<div class="mtq-live-comments"><div class="mtq-live-comment-list">'+(rows.length?rows.map(function(c){
      return '<div class="mtq-live-comment"><b>'+esc(c.author_pseudo||'تلميذ')+'</b><small>'+esc(stamp(c.created_at))+'</small><p>'+esc(c.body)+'</p></div>';
    }).join(''):'<p class="mtq-live-muted">لا توجد تعليقات بعد. كن أول من يشارك.</p>')+'</div>'+
    '<form class="mtq-live-comment-form" data-mtq-form="comment" data-post="'+esc(id)+'"><input name="body" maxlength="2000" required placeholder="اكتب تعليقاً مفيداً..." aria-label="التعليق"><button type="submit">إرسال</button></form></div>';
  }
  function render(){
    var b=box();if(!b)return;
    var top='<div class="mtq-live-toolbar"><b>📰 أحدث المنشورات</b><button type="button" data-mtq-action="refresh">⟳ تحديث</button></div>';
    var composer='<form class="mtq-compose-card mtq-live-compose" data-mtq-form="post"><label for="mtqPostBody">ما الذي تريد مشاركته مع زملائك؟</label><textarea id="mtqPostBody" name="body" maxlength="3000" required placeholder="اكتب سؤالاً دراسياً أو فكرة أو مبادرة مراجعة..."></textarea><div><small>حتى 3000 حرف · تجنّب نشر بياناتك الشخصية</small><button type="submit">نشر المنشور</button></div></form>';
    var posts=state.posts.length?state.posts.map(postHtml).join(''):stateCard('🌱','ابدأ أول نقاش دراسي','لا توجد منشورات منشورة حالياً. يمكنك أن تكون أول من يطرح سؤالاً أو يشارك فكرة نافعة.','بداية المجتمع');
    b.innerHTML=top+composer+'<div class="mtq-live-list">'+posts+'</div>'+(state.hasMore?'<button class="mtq-live-more" data-mtq-action="more" type="button">تحميل منشورات أقدم</button>':'');
  }
  function waitForSupabase(){
    if(window.SB&&window.SB.sb&&window.SB.me&&window.SB.myProfile)return Promise.resolve(true);
    return new Promise(function(resolve){
      var settled=false;
      var timer=setTimeout(function(){finish(false);},12000);
      function finish(ok){if(settled)return;settled=true;clearTimeout(timer);resolve(ok);}
      document.addEventListener('dz:sbready',function(){finish(!!(window.SB&&window.SB.sb&&window.SB.me&&window.SB.myProfile));},{once:true});
    });
  }
  async function client(){
    if(!await waitForSupabase())throw new Error('cloud_client_unavailable');
    var c=await window.SB.sb();if(!c)throw new Error('cloud_client_unavailable');return c;
  }
  async function load(reset){
    if(state.busy)return;state.busy=true;
    try{
      var c=await client();
      var r=await c.rpc('multaqa_feed',{p_limit:20,p_before:reset?null:(state.posts.length?state.posts[state.posts.length-1].post_id:null)});
      if(r.error)throw r.error;
      var rows=Array.isArray(r.data)?r.data:[];
      state.posts=reset?rows:state.posts.concat(rows);
      state.hasMore=rows.length===20;
      render();
    }catch(e){unavailable(e&&e.message||e);}
    finally{state.busy=false;}
  }
  async function enter(){
    var b=box();if(!b)return;
    b.innerHTML=stateCard('⏳','جارٍ الاتصال بالملتقى','يتم التحقق من جلسة الحساب وصلاحية الوصول إلى المجتمع.','لحظة من فضلك');
    try{
      if(!await waitForSupabase()){unavailable('cloud_client_unavailable');return;}
      state.user=await window.SB.me();
      if(!state.user){b.innerHTML=stateCard('🔐','سجّل الدخول للمتابعة','تحتاج إلى حساب على المنصة قبل الدخول إلى ملتقى الطلاب.','حساب المنصة');return;}
      state.profile=await window.SB.myProfile();
      if(state.profile&&state.profile.ok===false)throw new Error(state.profile.err||'profile_lookup_failed');
      if(!state.profile||state.profile.role!=='eleve'){b.innerHTML=stateCard('🎓','هذا الفضاء مخصص للتلاميذ','الملتقى الشخصي مخصص لحسابات التلاميذ.','صلاحية الحساب');return;}
      if(state.profile.verif_statut!=='verifie'){b.innerHTML=accessCard();return;}
      state.posts=[];state.comments={};state.expanded={};state.hasMore=false;
      await load(true);
    }catch(e){unavailable(e&&e.message||e);}
  }
  async function comments(id){
    try{
      var c=await client(),r=await c.rpc('multaqa_comments',{p_post_id:Number(id),p_limit:50,p_before:null});
      if(r.error)throw r.error;
      state.comments[id]=Array.isArray(r.data)?r.data:[];
      state.expanded[id]=true;render();
    }catch(e){if(window.toast)toast('تعذّر تحميل التعليقات حالياً','ko');console.warn('[ملتقى الطلاب] comments',e);}
  }
  async function act(action,id){
    if(action==='refresh'){await enter();return;}
    if(action==='more'){await load(false);return;}
    if(action==='comments'){if(state.expanded[id]){state.expanded[id]=false;render();}else await comments(id);return;}
    try{
      var c=await client(),r;
      if(action==='react')r=await c.rpc('multaqa_toggle_reaction',{p_post_id:Number(id),p_reaction:'like'});
      else if(action==='report')r=await c.rpc('multaqa_report',{p_target_kind:'post',p_target_id:Number(id),p_reason:'other',p_details:null});
      if(r&&r.error)throw r.error;
      if(action==='report'){if(window.toast)toast('تم إرسال البلاغ للمراجعة','ok');}
      await load(true);
    }catch(e){if(window.toast)toast('تعذّر تنفيذ الإجراء. تحقّق من اتصال الخدمة.','ko');console.warn('[ملتقى الطلاب] action',e);}
  }
  document.addEventListener('dz:view',function(ev){if(ev&&ev.detail==='multaqa')enter();});
  document.addEventListener('click',function(ev){
    var btn=ev.target&&ev.target.closest?ev.target.closest('[data-mtq-action]'):null;
    if(btn){ev.preventDefault();act(btn.getAttribute('data-mtq-action'),btn.getAttribute('data-id')); }
  });
  document.addEventListener('submit',async function(ev){
    var form=ev.target;if(!form||!form.matches||!form.matches('[data-mtq-form]'))return;
    ev.preventDefault();if(state.busy)return;
    var kind=form.getAttribute('data-mtq-form'),data=new FormData(form),body=String(data.get('body')||'').trim();
    if(!body)return;
    state.busy=true;
    try{
      var c=await client(),r;
      if(kind==='post')r=await c.rpc('multaqa_create_post',{p_body:body});
      else r=await c.rpc('multaqa_create_comment',{p_post_id:Number(form.getAttribute('data-post')),p_body:body,p_parent_id:null});
      if(r.error)throw r.error;
      form.reset();
      state.busy=false;
      if(kind==='comment')await comments(form.getAttribute('data-post'));
      else await load(true);
      if(window.toast)toast(kind==='post'?'تم نشر المنشور':'تم إرسال التعليق','ok');
    }catch(e){if(window.toast)toast('تعذّر الإرسال. قد تكون خدمة الملتقى لم تُفعّل بعد.','ko');console.warn('[ملتقى الطلاب] submit',e);}
    finally{state.busy=false;}
  });
  window.renderMultaqa=enter;
  if(document.querySelector('[data-view="multaqa"]:not([hidden])'))enter();
})();
