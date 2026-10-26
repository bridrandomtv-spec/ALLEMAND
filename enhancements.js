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
  function localDate(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day;}
  function ensureStyles(){
    if($('#lv-enhancements-style')||$('link[href*="enhancements.css"]')) return;
    const l=document.createElement('link'); l.id='lv-enhancements-style'; l.rel='stylesheet'; l.href='enhancements.css?v=1'; document.head.appendChild(l);
  }
  let searchReturnFocus=null;
  function ensureSearch(){
    if($('#lvSearchDialog')) return;
    const d=document.createElement('div'); d.id='lvSearchDialog'; d.className='lv-search-backdrop'; d.hidden=true;
    d.innerHTML='<section class="lv-search" role="dialog" aria-modal="true" aria-label="البحث الشامل" tabindex="-1"><header><b>🔎 البحث في المنصة</b><button type="button" data-lv-close aria-label="إغلاق">✕</button></header><input id="lvSearchInput" type="search" aria-controls="lvSearchResults" aria-label="البحث في أقسام المنصة" placeholder="ابحث عن درس أو قسم أو مادة…" autocomplete="off"><small>اختصار لوحة المفاتيح: Ctrl + K أو /</small><div id="lvSearchResults" aria-live="polite" aria-relevant="additions text"></div></section>';
    document.body.appendChild(d);
    d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-lv-close]')) closeSearch();});
    $('#lvSearchInput').addEventListener('input',renderResults);
    $('#lvSearchResults').addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(!b)return; const v=b.dataset.go; closeSearch(false); if(window.DZ && typeof window.DZ.go==='function'){window.DZ.go(v);return;} if(typeof window.showPage==='function'){window.showPage(v);return;} const nav=Array.from(document.querySelectorAll('[data-go]')).find(el=>!el.closest('#lvSearchDialog')&&!el.closest('[hidden]')&&el.getAttribute('aria-hidden')!=='true'&&el.style.display!=='none'&&el.getAttribute('data-go')===v&&el.getClientRects().length>0); if(nav){nav.click();return;} const synthetic=document.createElement('button'); synthetic.type='button'; synthetic.setAttribute('data-go',v); synthetic.style.display='none'; document.body.appendChild(synthetic); synthetic.click(); synthetic.remove(); });
  }
  function searchItems(q){
    const items=[];
    document.querySelectorAll('.tabs [data-go], .home-main [data-go]').forEach(el=>{
      const inNavigation=!!el.closest('.tabs');
      /* Les rubriques du menu restent indexables même si le tiroir ou
         l'accordéon est fermé. Pour le contenu du tableau de bord, garder
         seulement les actions réellement visibles. */
      if(el.closest('#lvSearchDialog') || el.getAttribute('aria-hidden')==='true') return;
      if(!inNavigation && (el.closest('[hidden]') || el.style.display==='none' || el.getClientRects().length===0)) return;
      const label=(el.innerText||'').trim() || (el.textContent||el.getAttribute('aria-label')||el.title||'').replace(/\s+/g,' ').trim();
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
  function openSearch(){ensureSearch();const d=$('#lvSearchDialog');if(d.hidden)searchReturnFocus=document.activeElement;d.hidden=false;$('#lvSearchInput').value='';renderResults();setTimeout(()=>$('#lvSearchInput').focus(),0);}
  function closeSearch(restoreFocus=true){const d=$('#lvSearchDialog');if(d&&!d.hidden)d.hidden=true;if(restoreFocus&&searchReturnFocus&&searchReturnFocus.isConnected&&typeof searchReturnFocus.focus==='function'){try{searchReturnFocus.focus({preventScroll:true});}catch(_){searchReturnFocus.focus();}}searchReturnFocus=null;}
  function mountDashboard(){
    const host=$('.home-main')||$('#accueilMemo'); if(!host||$('#lvStudentHub'))return;
    const s=read(), xp=Math.max(0,Number(s.xp)||0), lv=level(xp), pct=xp%100;
    const completed=Array.isArray(s.completed)?s.completed.length:0;
    const unread=(Array.isArray(s.notifications)?s.notifications:[]).filter(n=>!n.read).length;
    const card=document.createElement('section'); card.id='lvStudentHub';card.className='lv-hub card';
    card.innerHTML='<div class="lv-hub-head"><div><small>نموذج تجريبي · بيانات محفوظة على هذا الجهاز فقط</small><h2>🎯 لوحة التقدّم التجريبية</h2></div><button type="button" id="lvOpenSearch" class="btn btn-o btn-sm">🔎 بحث شامل <kbd>Ctrl K</kbd></button></div>'+
      '<div class="lv-kpis"><div><span>⭐</span><b>'+xp+'</b><small>نقاط XP</small></div><div><span>🏅</span><b>'+lv+'</b><small>المستوى</small></div><div><span>📚</span><b>'+completed+'</b><small>أنشطة معلّمة كمكتملة</small></div><div><span>🔔</span><b>'+unread+'</b><small>إشعارات محلية</small></div></div>'+
      '<div class="lv-level"><div><b>المستوى '+lv+'</b><span>'+pct+' / 100 XP</span></div><div class="lv-track"><i style="width:'+pct+'%"></i></div><small>هذه نقاط تجريبية تُضاف يدويًا، ولا تثبت متابعة درس أو إنجاز نشاط فعلي، وليست تقييمًا رسميًا.</small></div>'+
      '<div class="lv-actions"><button type="button" class="btn btn-p btn-sm" id="lvMarkStudy">➕ تسجيل نشاط تجريبي يدويًا (+10 XP)</button><button type="button" class="btn btn-o btn-sm" id="lvNotifications">🔔 Notifications</button><button type="button" class="btn btn-o btn-sm" id="lvThemeToggle">🌓 Thème clair / sombre</button></div>'+
      '<div id="lvNoticePanel" hidden></div>';
    host.prepend(card);
    $('#lvOpenSearch').addEventListener('click',openSearch);
    $('#lvMarkStudy').addEventListener('click',()=>{
      const current=read(), today=localDate();
      if(current.lastStudy===today){toast('تم تسجيل النشاط التجريبي اليوم بالفعل؛ لا تُمنح نقاط إضافية.');return;}
      current.lastStudy=today;current.xp=(Number(current.xp)||0)+10;
      current.completed=Array.isArray(current.completed)?current.completed:[];current.completed.push({date:today,at:new Date().toISOString(),type:'manual-study'});
      current.notifications=Array.isArray(current.notifications)?current.notifications:[];
      current.notifications.unshift({id:'study-'+today,title:'تم تسجيل نشاط تجريبي يدويًا',date:today,read:false});
      save(current);card.remove();mountDashboard();toast('تم حفظ نشاط تجريبي محلياً (+10 XP). هذا لا يثبت متابعة درس.');
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
      /* Réutiliser le contrôleur de thème déjà installé par app.js :
         une seule source de vérité pour l'attribut et la persistance. */
      const existing=$('#dzThemeBtn');
      if(existing){existing.click();return;}
      const root=document.documentElement, next=root.getAttribute('data-theme')==='dark'?'light':'dark';
      root.setAttribute('data-theme',next);
      /* D14 anti-flash applique directement la valeur mémorisée. */
      try{localStorage.setItem('dz_theme_v1',next);}catch(_){}
      const st=read();st.theme=next;save(st);
      toast(next==='dark'?'تم تفعيل المظهر الداكن':'تم تفعيل المظهر الفاتح');
    });
  }
  document.addEventListener('keydown',e=>{
    const dialog=$('#lvSearchDialog');
    if(dialog&&!dialog.hidden){
      if(e.key==='Escape'){e.preventDefault();closeSearch();return;}
      if(e.key==='Tab'){
        const focusables=Array.from(dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),[href],select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);
        if(!focusables.length){e.preventDefault();dialog.querySelector('.lv-search').focus();return;}
        const first=focusables[0],last=focusables[focusables.length-1],active=document.activeElement;
        if(e.shiftKey&&(active===first||!dialog.contains(active))){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&(active===last||!dialog.contains(active))){e.preventDefault();first.focus();}
      }
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#lvSearchInput').focus();}
      return;
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
    if(e.key==='/'&&document.activeElement&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();openSearch();}
  });
  document.addEventListener('dz:view',e=>{if(e.detail==='accueil')setTimeout(mountDashboard,0);});
  function boot(){ensureStyles();ensureSearch();mountDashboard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.LVEnhancements={openSearch,refresh:mountDashboard,version:2};
})();