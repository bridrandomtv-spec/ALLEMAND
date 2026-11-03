/* Public academic navigator — prototypes 69–71
   Reads the published catalogues; it does not grant access or create accounts.
   Authentication remains entirely in the existing gate/auth.js flow. */
(function(){
  'use strict';
  const $ = (s, root) => (root || document).querySelector(s);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const branchNames = {
    'tc-lettres':'جذع مشترك آداب',
    'tc-sciences':'جذع مشترك علوم وتكنولوجيا',
    sciences:'علوم تجريبية', math:'رياضيات', tech:'تقني رياضي',
    gestion:'تسيير واقتصاد', philo:'آداب وفلسفة', langues:'لغات أجنبية'
  };
  const languageCards = [
    {id:'francais',ar:'الفرنسية',latin:'Français',code:'FR',icon:'🇫🇷'},
    {id:'anglais',ar:'الإنجليزية',latin:'English',code:'GB',icon:'🇬🇧'},
    {id:'allemand',ar:'الألمانية',latin:'Deutsch',code:'DE',icon:'🇩🇪'},
    {id:'espanol',ar:'الإسبانية',latin:'Español',code:'ES',icon:'🇪🇸'},
    {id:'italien',ar:'الإيطالية',latin:'Italiano',code:'IT',icon:'🇮🇹'},
    {id:'arabe',ar:'العربية',latin:'العربية',code:'SA',icon:'🇩🇿'}
  ];
  const state = {catalog:null, subject:null, level:null, branch:null, screen:'home'};
  const root = () => $('#publicExplorer');
  const content = () => $('#publicExplorerContent');
  const landing = () => $('.public-landing');
  const gateCard = () => $('.gate-card');

  async function loadCatalog(){
    if(state.catalog) return state.catalog;
    const [m, s] = await Promise.all([
      fetch('assets/bdd/matieres.json', {cache:'no-store'}).then(r => {if(!r.ok) throw new Error('matieres.json HTTP '+r.status); return r.json();}),
      fetch('assets/bdd/subjects.json', {cache:'no-store'}).then(r => {if(!r.ok) throw new Error('subjects.json HTTP '+r.status); return r.json();}).catch(() => [])
    ]);
    const subjectStatus = {};
    (Array.isArray(s) ? s : []).forEach(x => { subjectStatus[x.id] = x.status; });
    state.catalog = {data:m, subjectStatus};
    return state.catalog;
  }
  function statusFor(id, item){
    if(id === 'allemand') return 'implemented';
    if(state.catalog && state.catalog.subjectStatus[id]) return state.catalog.subjectStatus[id];
    if(item && item.statut === 'partiel') return 'partial';
    return item && item.statut === 'actif' ? 'implemented' : 'planned';
  }
  function statusLabel(status){
    if(status === 'implemented') return '<span class="pub-status active">🟢 متاحة الآن</span>';
    if(status === 'partial') return '<span class="pub-status partial">🟠 متاحة جزئيًا</span>';
    return '<span class="pub-status planned">🗓️ قيد البرمجة</span>';
  }
  function subjectById(id){
    const list = state.catalog.data.matieres || [];
    return list.find(x => x.id === id) || null;
  }
  function show(screen){
    state.screen = screen;
    const r = root(), l = landing(), card = gateCard();
    if(!r || !l) return;
    if(card) card.hidden = true;
    const nav = document.querySelectorAll('[data-public-view]');
    nav.forEach(b => {
      const active = b.dataset.publicView === screen || ((screen === 'branches' || screen === 'branch') && b.dataset.publicView === 'levels');
      b.classList.toggle('active', active);
      if(active) b.setAttribute('aria-current','page');
      else b.removeAttribute('aria-current');
    });
    if(screen === 'home'){
      r.hidden = true; l.hidden = false;
      return;
    }
    l.hidden = true; r.hidden = false;
    window.scrollTo({top:0, behavior:'auto'});
  }
  function shell(title, subtitle, body, back){
    return '<div class="pub-explorer-top">'
      + '<div><span class="pub-eyebrow">الثانوية الافتراضية الجزائرية · 2026/2027</span>'
      + '<h2>'+title+'</h2><p>'+subtitle+'</p></div>'
      + (back ? '<button class="pub-back" type="button" data-public-action="back">→ رجوع</button>' : '')
      + '</div>' + body;
  }
  async function renderSubjects(){
    show('subjects');
    const c = content(); if(!c) return;
    c.innerHTML = '<div class="pub-loading">⏳ جارٍ تحميل سجل المواد…</div>';
    try{
      await loadCatalog();
      const langs = languageCards.map(x => {
        const st = statusFor(x.id, subjectById(x.id));
        const disabled = st === 'planned';
        return '<article class="pub-subject-card lang '+(st === 'implemented' ? 'ready' : '')+'">'
          + '<div class="pub-card-icon">'+x.icon+'</div><div class="pub-card-copy"><b>'+x.ar+'</b><small>'+x.latin+'</small></div>'
          + statusLabel(st)
          + (disabled ? '<span class="pub-card-note">سيتم فتحها لاحقًا</span>' :
             '<button type="button" class="pub-card-link" data-public-action="subject" data-subject="'+x.id+'">'+(st === 'implemented' ? 'استكشف المادة ←' : 'تفاصيل التوفر ←')+'</button>')
          + '</article>';
      }).join('');
      const academic = (state.catalog.data.matieres || []).filter(x => !['allemand','francais','anglais','arabe','espanol','italien'].includes(x.id)).map(x => {
        const st = statusFor(x.id, x);
        return '<article class="pub-subject-card">'
          + '<div class="pub-card-icon">'+esc(x.icon || '📘')+'</div><div class="pub-card-copy"><b>'+esc(x.ar)+'</b><small>'+esc(x.desc || '')+'</small></div>'
          + statusLabel(st) + '<span class="pub-card-note">المحتوى التفصيلي قيد الإعداد</span></article>';
      }).join('');
      c.innerHTML = shell('اختر المادة التي تريد استكشافها','حالة الإتاحة موضحة لكل مادة؛ لا نعرض المحتوى المبرمج على أنه جاهز.', 
        '<h3 class="pub-section-title">🌐 اللغات</h3><div class="pub-catalog-grid languages">'+langs+'</div>'
        + '<h3 class="pub-section-title">📚 المواد العلمية والأدبية</h3><div class="pub-catalog-grid">'+academic+'</div>', false);
    }catch(err){
      c.innerHTML = shell('تعذر تحميل سجل المواد','يمكنك العودة لاحقًا؛ لم يتم تغيير أي بيانات.', '<p class="pub-error">'+esc(err.message)+'</p>', false);
    }
  }
  async function renderLevels(){
    show('levels');
    const c = content(); if(!c) return;
    c.innerHTML = '<div class="pub-loading">⏳ جارٍ تحميل المستويات…</div>';
    try{
      await loadCatalog();
      const levels = [
        {id:'1AS',title:'السنة الأولى ثانوي',sub:'الجذع المشترك',tag:'مرحلة التوجيه',icon:'1'},
        {id:'2AS',title:'السنة الثانية ثانوي',sub:'جميع الشعب والتخصصات',tag:'التخصص',icon:'2'},
        {id:'3AS',title:'السنة الثالثة ثانوي',sub:'التحضير الشامل للبكالوريا',tag:'بكالوريا',icon:'3'}
      ];
      const cards = levels.map(x => {
        const branches = Object.keys(state.catalog.data.par_niveau[x.id] || {});
        return '<button type="button" class="pub-level-card level-'+x.id+'" data-public-action="level" data-level="'+x.id+'">'
          + '<span class="pub-level-number">'+x.icon+'</span><span class="pub-level-tag">'+x.tag+'</span>'
          + '<b>'+x.title+'</b><small>'+x.sub+'</small><span class="pub-level-count">'+branches.length+' مسارات دراسية</span>'
          + '<span class="pub-level-open">استكشف المستوى ←</span></button>';
      }).join('');
      c.innerHTML = shell('كل السنوات وكل الشعب','اختر السنة الدراسية لعرض الشعب المعتمدة والمواد المسجلة فيها.',
        '<div class="pub-level-grid">'+cards+'</div>'
        + '<p class="pub-note">تنبيه: وجود مادة في السجل لا يعني أن محتواها التعليمي منشور؛ حالة كل مادة تظهر بوضوح في الخطوة التالية.</p>', false);
    }catch(err){
      c.innerHTML = shell('تعذر تحميل المستويات','حاول مجددًا لاحقًا.','<p class="pub-error">'+esc(err.message)+'</p>',false);
    }
  }
  function renderBranches(){
    show('branches');
    const c = content(); if(!c || !state.catalog || !state.level) return;
    const data = state.catalog.data;
    const branches = data.par_niveau[state.level] || {};
    const cards = Object.keys(branches).map(id => {
      const ids = branches[id] || [];
      const subjects = ids.map(subjectById).filter(Boolean);
      const full = subjects.filter(x => statusFor(x.id,x) === 'implemented').length;
      const partial = subjects.filter(x => statusFor(x.id,x) === 'partial').length;
      const chips = subjects.slice(0,5).map(x => '<span>'+esc(x.ar)+'</span>').join('');
      const availability = full || partial
        ? '<span class="pub-branch-availability"><b>'+full+'</b> مكتملة'
          + (partial ? ' · <b>'+partial+'</b> جزئيًا' : '')+'</span>'
        : '<span class="pub-branch-availability">المحتوى قيد الإعداد</span>';
      return '<article class="pub-branch-card">'
        + '<div class="pub-branch-meta"><span class="pub-branch-number">'+esc(state.level)+'</span>'
        + '<span class="pub-branch-count">'+ids.length+' مواد مسجلة</span></div>'
        + '<h3>'+esc(branchNames[id] || id)+'</h3>'
        + '<div class="pub-branch-subjects">'+chips+'</div>'
        + '<div class="pub-branch-foot">'+availability
        + '<button type="button" data-public-action="branch" data-branch="'+esc(id)+'">عرض الشعبة ←</button></div>'
        + '</article>';
    }).join('');
    c.innerHTML = shell('الشعب الدراسية · '+esc(state.level),'اختر شعبتك للاطلاع على المواد المسجلة وحالة توفر محتواها.',
      '<div class="pub-branch-grid">'+cards+'</div>', true);
  }
  function renderBranch(){
    show('branch');
    const c = content(); if(!c || !state.catalog || !state.level || !state.branch) return;
    const ids = (state.catalog.data.par_niveau[state.level] || {})[state.branch] || [];
    const items = ids.map(id => {
      const m = subjectById(id); if(!m) return '';
      const st = statusFor(id,m);
      return '<article class="pub-detail-subject">'
        + '<span class="pub-detail-icon">'+esc(m.icon || '📘')+'</span>'
        + '<div class="pub-detail-main"><b>'+esc(m.ar)+'</b><small>'+esc(m.desc || 'ضمن البرنامج الدراسي')+'</small></div>'
        + statusLabel(st) + '</article>';
    }).join('');
    const hasGerman = ids.indexOf('allemand') !== -1;
    const readyText = hasGerman
      ? '<div class="pub-ready-callout"><b>🇩🇪 اللغة الألمانية متاحة في هذا المسار</b><p>يمكنك إنشاء حساب ومتابعة محتوى الألمانية المنشور لهذه السنة.</p><button type="button" class="pub-cta" data-public-action="signup">إنشاء حساب ومتابعة الألمانية</button></div>'
      : '<div class="pub-note">لا يوجد حاليًا محتوى ألماني منشور لهذا المستوى في سجل المواد.</div>';
    c.innerHTML = shell(esc(branchNames[state.branch] || state.branch)+' · '+esc(state.level),
      'قائمة المواد المسجلة في هذا المسار، مع بيان حالة كل مادة.',
      '<div class="pub-detail-grid">'+items+'</div>'+readyText, true);
  }
  function showSubject(id){
    const item = languageCards.find(x => x.id === id);
    const st = statusFor(id, subjectById(id));
    state.subject = id;
    if(st === 'implemented'){ renderLevels(); return; }
    show('subject-info');
    const c = content();
    c.innerHTML = shell(item ? item.ar : 'حالة المادة',
      item && item.latin ? item.latin : '',
      '<div class="pub-status-panel">'+statusLabel(st)
      + '<h3>'+(st === 'partial' ? 'هذه المادة متاحة جزئيًا' : 'هذه المادة قيد البرمجة')+'</h3>'
      + '<p>'+(st === 'partial' ? 'بعض الوظائف أو الموارد فقط متاحة حاليًا؛ لن نعرضها كمادة مكتملة.' : 'لم يُنشر محتوى تعليمي قابل للاستخدام لهذه المادة بعد.')+'</p>'
      + '<button type="button" class="pub-back" data-public-action="back-subjects">العودة إلى المواد</button></div>', true);
  }
  function chooseSignup(){
    if(!state.level || !state.branch) return;
    const n = $('#suNiveau'), f = $('#suFiliere');
    if(n){ n.value = state.level; n.dispatchEvent(new Event('change', {bubbles:true})); }
    if(f){ f.value = state.branch; f.dispatchEvent(new Event('change', {bubbles:true})); }
    const b = $('[data-gate-open="signup"]');
    if(b) b.click();
    const card = gateCard();
    if(card) card.scrollIntoView({behavior:'smooth', block:'center'});
  }
  document.addEventListener('click', ev => {
    const gateTrigger = ev.target.closest('[data-gate-open]');
    if(gateTrigger){
      const card = gateCard();
      if(card){
        card.hidden = false;
        window.requestAnimationFrame(() => {
          card.scrollIntoView({behavior:'smooth', block:'center'});
        });
      }
    }
    const nav = ev.target.closest('[data-public-view]');
    if(nav){
      const v = nav.dataset.publicView;
      if(v === 'home'){ show('home'); return; }
      if(v === 'subjects'){ renderSubjects(); return; }
      if(v === 'levels'){ renderLevels(); return; }
    }
    const action = ev.target.closest('[data-public-action]');
    if(!action) return;
    switch(action.dataset.publicAction){
      case 'subject': showSubject(action.dataset.subject); break;
      case 'level': state.level = action.dataset.level; state.branch = null; renderBranches(); break;
      case 'branch': state.branch = action.dataset.branch; renderBranch(); break;
      case 'back': renderLevels(); break;
      case 'back-subjects': renderSubjects(); break;
      case 'signup': chooseSignup(); break;
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const r = root(), card = gateCard();
    if(r) r.hidden = true;
    if(card) card.hidden = true;
  });
})();
