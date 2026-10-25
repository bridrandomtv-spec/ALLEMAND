/* Lycée virtuel — enhancements additifs, sans remplacement des modules existants. */
(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const KEY = 'lv_enhancements_v1';
  const defaults = {xp:0, completed:[], notifications:[], lastStudy:null, streak:0, theme:null};
  function read(){ try{return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){return Object.assign({},defaults);} }
  function save(s){ try{localStorage.setItem(KEY,JSON.stringify(s));}catch(_){} }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function toast(msg){ if(window.DZ&&typeof DZ.toast==='function') DZ.toast(msg); else {const t=$('#toast'); if(t){t.textContent=msg;t.hidden=false;setTimeout(()=>t.hidden=true,2600);} } }
  function level(xp){return Math.floor(Math.max(0,xp)/100)+1;}
  function ensureStyles(){
    if($('#lv-enhancements-style')) return;
    const l=document.createElement('link'); l.id='lv-enhancements-style'; l.rel='stylesheet'; l.href='enhancements.css?v=1'; document.head.appendChild(l);
  }
  function ensureSearch(){
    if($('#lvSearchDialog')) return;
    const d=document.createElement('div'); d.id='lvSearchDialog'; d.className='lv-search-backdrop'; d.hidden=true;
    d.innerHTML='<section class="lv-search" role="dialog" aria-modal="true" aria-label="البحث الشامل"><header><b>🔎 البحث في المنصة</b><button type="button" data-lv-close aria-label="إغلاق">✕</button></header><input id="lvSearchInput" type="search" placeholder="ابحث عن درس أو قسم أو مادة…" autocomplete="off"><small>اختصار لوحة المفاتيح: Ctrl + K أو /</small><div id="lvSearchResults" role="listbox"></div></section>';
    document.body.appendChild(d);
    d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-lv-close]')) closeSearch();});
    $('#lvSearchInput').addEventListener('input',renderResults);
    $('#lvSearchResults').addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(!b)return; const v=b.dataset.go; closeSearch(); if(typeof window.showPage==='function') window.showPage(v); else {const nav=$('[data-go="'+CSS.escape(v)+'"]'); if(nav) nav.click();} });
  }
  function searchItems(q){
    const items=[];
    document.querySelectorAll('[data-go]').forEach(el=>{
      const label=(el.innerText||el.getAttribute('aria-label')||el.title||'').replace(/\s+/g,' ').trim();
      const view=el.getAttribute('data-go');
      if(label&&view&&label.length<180) items.push({label:label.slice(0,110),view,el});
    });
    const unique=new Map(); items.forEach(x=>{const k=x.view+'|'+x.label;if(!unique.has(k))unique.set(k,x);});
    const query=q.trim().toLocaleLowerCase();
    return Array.from(unique.values()).filter(x=>!query||x.label.toLocaleLowerCase().includes(query)).slice(0,12);
  }
  function renderResults(){
    const q=$('#lvSearchInput').value, box=$('#lvSearchResults'); if(!box)return;
    const arr=searchItems(q);
    box.innerHTML=arr.length?arr.map(x=>'<button type="button" data-go="'+esc(x.view)+'"><span>📘</span><span>'+esc(x.label)+'</span><small>فتح القسم</small></button>').join(''):'<p class="lv-empty">لا توجد نتائج مطابقة في الأقسام المعروضة.</p>';
  }
  function openSearch(){ensureSearch();const d=$('#lvSearchDialog');d.hidden=false;$('#lvSearchInput').value='';renderResults();setTimeout(()=>$('#lvSearchInput').focus(),0);}
  function closeSearch(){const d=$('#lvSearchDialog');if(d)d.hidden=true;}
  function mountDashboard(){
    const host=$('#accueilMemo')||$('.home-main'); if(!host||$('#lvStudentHub'))return;
    const s=read(), xp=Math.max(0,Number(s.xp)||0), lv=level(xp), pct=xp%100;
    const completed=Array.isArray(s.completed)?s.completed.length:0;
    const unread=(Array.isArray(s.notifications)?s.notifications:[]).filter(n=>!n.read).length;
    const card=document.createElement('section'); card.id='lvStudentHub';card.className='lv-hub card';
    card.innerHTML='<div class="lv-hub-head"><div><small>مساحة التلميذ · تقدم محفوظ محلياً</small><h2>🎯 تقدّمك الدراسي</h2></div><button type="button" id="lvOpenSearch" class="btn btn-o btn-sm">🔎 بحث شامل <kbd>Ctrl K</kbd></button></div>'+
      '<div class="lv-kpis"><div><span>⭐</span><b>'+xp+'</b><small>نقاط XP</small></div><div><span>🏅</span><b>'+lv+'</b><small>المستوى</small></div><div><span>📚</span><b>'+completed+'</b><small>أنشطة معلّمة كمكتملة</small></div><div><span>🔔</span><b>'+unread+'</b><small>إشعارات محلية</small></div></div>'+
      '<div class="lv-level"><div><b>المستوى '+lv+'</b><span>'+pct+' / 100 XP</span></div><div class="lv-track"><i style="width:'+pct+'%"></i></div><small>تُحتسب النقاط هنا فقط pour les activités explicitement marquées comme terminées; elles ne remplacent pas les notes officielles.</small></div>'+
      '<div class="lv-actions"><button type="button" class="btn btn-p btn-sm" id="lvMarkStudy">✅ Marquer une séance comme étudiée</button><button type="button" class="btn btn-o btn-sm" id="lvNotifications">🔔 Notifications</button><button type="button" class="btn btn-o btn-sm" id="lvThemeToggle">🌓 Thème clair / sombre</button></div>'+
      '<div id="lvNoticePanel" hidden></div>';
    host.prepend(card);
    $('#lvOpenSearch').addEventListener('click',openSearch);
    $('#lvMarkStudy').addEventListener('click',()=>{
      const current=read(), today=new Date().toISOString().slice(0,10);
      if(current.lastStudy===today){toast('تم تسجيل نشاط اليوم بالفعل؛ لا تُمنح نقاط إضافية.');return;}
      current.lastStudy=today;current.xp=(Number(current.xp)||0)+10;
      current.completed=Array.isArray(current.completed)?current.completed:[];current.completed.push({date:today,at:new Date().toISOString(),type:'manual-study'});
      current.notifications=Array.isArray(current.notifications)?current.notifications:[];
      current.notifications.unshift({id:'study-'+today,title:'تم تسجيل نشاط تعلّم اليوم',date:today,read:false});
      save(current);card.remove();mountDashboard();toast('تم حفظ نشاط اليوم محلياً (+10 XP).');
    });
    $('#lvNotifications').addEventListener('click',()=>{
      const current=read(); current.notifications=Array.isArray(current.notifications)?current.notifications:[];
      const p=$('#lvNoticePanel'); p.hidden=!p.hidden;
      if(!p.hidden){p.innerHTML='<div class="lv-notice-head"><b>🔔 الإشعارات</b><button type="button" id="lvMarkRead">تحديد الكل كمقروء</button></div>'+
        (current.notifications.length?current.notifications.slice(0,20).map(n=>'<div class="lv-notice '+(n.read?'':'unread')+'"><b>'+esc(n.title||'إشعار')+'</b><small>'+esc(n.date||'')+'</small></div>').join(''):'<p class="lv-empty">لا توجد إشعارات محفوظة بعد.</p>'); 
        const m=$('#lvMarkRead');if(m)m.onclick=()=>{current.notifications=current.notifications.map(n=>Object.assign({},n,{read:true}));save(current);card.remove();mountDashboard();$('#lvNotifications').click();};
      }
    });
    $('#lvThemeToggle').addEventListener('click',()=>{
      const root=document.documentElement, next=root.getAttribute('data-theme')==='light'?'dark':'light';
      root.setAttribute('data-theme',next);try{localStorage.setItem('dz_theme_v1',next==='dark'?'light':'dark');}catch(_){}
      const st=read();st.theme=next;save(st);toast(next==='dark'?'تم تفعيل المظهر الداكن':'تم تفعيل المظهر الفاتح');
    });
  }
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
    if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();openSearch();}
    if(e.key==='Escape')closeSearch();
  });
  document.addEventListener('dz:view',e=>{if(e.detail==='accueil')setTimeout(mountDashboard,0);});
  document.addEventListener('click',e=>{const b=e.target.closest('#tbSearch');if(b){openSearch();}});
  function boot(){ensureStyles();ensureSearch();mountDashboard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.LVEnhancements={openSearch,refresh:mountDashboard,version:1};
})();