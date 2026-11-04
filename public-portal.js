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
  function renderHomeCatalog(){
    const target = $('.public-mini-catalog');
    if(!target) return;
    target.setAttribute('aria-live', 'polite');
    target.setAttribute('aria-busy', 'true');
    loadCatalog().then(({data}) => {
      const items = Array.isArray(data.matieres) ? data.matieres : [];
      const languageIds = new Set(['allemand','francais','anglais','arabe','espanol','italien']);
      const iconFallback = {physique:'⚛️', math:'📐', svt:'🧬', histgeo:'🗺️', philo:'📖', eco:'📊', info:'💻', islam:'🕌'};
      const labelFor = status => status === 'implemented' ? 'متاحة الآن'
        : status === 'partial' ? 'متاحة جزئيًا' : 'قيد البرمجة';
      const card = item => {
        const status = statusFor(item.id, item);
        const statusClass = status === 'implemented' ? 'active'
          : status === 'partial' ? 'partial' : 'planned';
        const secondary = item.de || item.es || item.it || item.desc || '';
        return '<article class="public-mini-card '+(languageIds.has(item.id) ? 'language' : 'academic')+'" data-subject-status="'+statusClass+'">'
          + '<span aria-hidden="true">'+esc(item.icon || iconFallback[item.id] || '📘')+'</span>'
          + '<b>'+esc(item.ar || item.name || item.id)+'</b>'
          + '<small>'+esc(secondary)+'</small>'
          + '<span class="pub-home-status '+statusClass+'">'+labelFor(status)+'</span>'
          + '</article>';
      };
      const ordered = items.filter(x => languageIds.has(x.id)).concat(items.filter(x => !languageIds.has(x.id)));
      if(ordered.length) target.innerHTML = ordered.map(card).join('');
      target.setAttribute('aria-busy', 'false');
    }).catch(() => {
      /* Keep fallback cards, but never imply that their availability was verified. */
      target.setAttribute('aria-busy', 'false');
      target.querySelectorAll('.public-mini-card').forEach(item => {
        if(item.querySelector('.pub-home-status')) return;
        const status = document.createElement('span');
        status.className = 'pub-home-status unavailable';
        status.setAttribute('role', 'status');
        status.textContent = 'حالة التوفر غير متاحة';
        item.appendChild(status);
      });
    });
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
  function setAuthPage(target, syncHash){
    const gate = $('#gate'), card = gateCard();
    if(!gate || !card) return;
    const mode = target === 'signup' ? 'signup' : 'login';
    gate.classList.add('public-auth-page');
    card.hidden = false;
    const tab = $('.gtab[data-gate="' + mode + '"]');
    if(tab && !tab.classList.contains('on')) tab.click();
    if(syncHash !== false){
      const hash = mode === 'signup' ? '#inscription' : '#connexion';
      if(location.hash !== hash) location.hash = hash;
    }
    const focus = mode === 'signup' ? $('#suName') : $('#loginUser');
    if(focus) window.requestAnimationFrame(() => focus.focus({preventScroll:true}));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function closeAuthPage(syncHash){
    const gate = $('#gate'), card = gateCard();
    if(gate) gate.classList.remove('public-auth-page');
    if(card) card.hidden = true;
    if(syncHash !== false && (location.hash === '#connexion' || location.hash === '#inscription')){
      history.replaceState(null,'',location.pathname + location.search);
    }
    show('home');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  document.addEventListener('click', ev => {
    const back = ev.target.closest('[data-public-auth-back]');
    if(back){ closeAuthPage(true); return; }
    const gateTrigger = ev.target.closest('[data-gate-open]');
    if(gateTrigger){
      setAuthPage(gateTrigger.dataset.gateOpen === 'signup' ? 'signup' : 'login', true);
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
  window.addEventListener('hashchange', () => {
    if(location.hash === '#connexion') setAuthPage('login', false);
    else if(location.hash === '#inscription') setAuthPage('signup', false);
    else if($('#gate') && $('#gate').classList.contains('public-auth-page')) closeAuthPage(false);
  });
  document.addEventListener('DOMContentLoaded', () => {
    renderHomeCatalog();
    const r = root(), card = gateCard();
    if(r) r.hidden = true;
    if(card) card.hidden = true;
    if(location.hash === '#connexion') setAuthPage('login', false);
    else if(location.hash === '#inscription') setAuthPage('signup', false);
  });
})();


/* Lot 64 — démonstration pédagogique du professeur IA dans le portail public.
   Le contenu est illustratif : aucun micro ni moteur vocal n'est déclenché ici. */
(function(){
  'use strict';
  function alignPublicHero(){
    const gate=document.getElementById('gate');
    const card=gate&&gate.querySelector('.public-ai-card');
    const copy=gate&&gate.querySelector('.public-copy');
    if(!card||!copy||card.dataset.tutorDemoReady==='1')return;
    const demo=card.querySelector('.public-ai-demo');
    const head=card.querySelector('.public-ai-head');
    if(!demo||!head)return;
    const icon=head.querySelector('.public-ai-icon');
    const title=head.querySelector('b');
    const subtitle=head.querySelector('small');
    const status=head.querySelector('.public-ai-live');
    if(icon){icon.textContent='🎙️';icon.setAttribute('aria-hidden','true');}
    if(title)title.textContent='الأستاذ الذكي';
    if(subtitle)subtitle.textContent='مرافقة تعليمية بالشرح والحوار';
    if(status)status.textContent='مساعد تعليمي';
    demo.className='public-ai-tutor-demo';
    demo.setAttribute('aria-label','مثال توضيحي لحوار تعليمي في اللغة الألمانية');
    demo.innerHTML='<div class="public-ai-tutor-top"><span class="public-ai-tutor-label"><i></i> مثال توضيحي</span><span class="public-ai-tutor-subject">Deutsch · قواعد اللغة</span></div><div class="public-ai-voice-stage" aria-hidden="true"><span class="public-ai-mic">🎙</span><div class="public-ai-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="public-ai-voice-caption">التعلّم بالحوار والشرح</span></div><article class="public-ai-dialog public-ai-question"><span class="public-ai-speaker">سؤال التلميذ</span><p>ما الفرق بين <bdi lang="de" dir="ltr">Nominativ</bdi> و <bdi lang="de" dir="ltr">Akkusativ</bdi>؟</p></article><article class="public-ai-dialog public-ai-answer"><span class="public-ai-speaker">شرح الأستاذ</span><p><bdi lang="de" dir="ltr">Nominativ</bdi> يحدد الفاعل، أمّا <bdi lang="de" dir="ltr">Akkusativ</bdi> فيحدد المفعول به المباشر.</p><div class="public-ai-example"><bdi lang="de" dir="ltr">Der Schüler liest den Text.</bdi><small>Der Schüler: الفاعل · den Text: المفعول به</small></div></article>';
    const cta=card.querySelector('.public-ai-cta');
    if(cta)cta.textContent='اكتشف المواد وموارد التعلّم ←';
    const note=card.querySelector('.public-ai-note');
    if(note)note.textContent='هذا الحوار نموذج توضيحي لطريقة الشرح، وليس محادثة مباشرة أو جلسة صوتية نشطة.';
    const stats=copy.querySelector('.public-stats');
    const trust=copy.querySelector('.public-trust');
    const actions=copy.querySelector('.public-actions');
    if(stats)copy.appendChild(stats);
    if(trust)copy.appendChild(trust);
    if(actions)copy.appendChild(actions);
    card.dataset.tutorDemoReady='1';
    if(!document.getElementById('public-ai-tutor-style')){
      const style=document.createElement('style');
      style.id='public-ai-tutor-style';
      style.textContent='#gate .public-ai-tutor-demo{display:grid;gap:13px;min-width:0;overflow:hidden;padding:17px;border:1px solid #d5e7da;border-radius:19px;background:linear-gradient(150deg,#f2f8f4,#fff 62%,#fff8f7);color:#173b29;box-shadow:inset 0 1px 0 #fff}#gate .public-ai-tutor-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}#gate .public-ai-tutor-label{display:inline-flex;align-items:center;gap:7px;color:#006233;font-size:12px;font-weight:900}#gate .public-ai-tutor-label i{width:8px;height:8px;border-radius:50%;background:#d21034;box-shadow:0 0 0 4px rgba(210,16,52,.1)}#gate .public-ai-tutor-subject{color:#657a6b;font-size:11px;font-weight:800}#gate .public-ai-voice-stage{display:grid;grid-template-columns:48px minmax(0,1fr);align-items:center;gap:12px;padding:15px;border-radius:15px;background:linear-gradient(115deg,#004d28,#006f39 70%,#087b45);color:#fff}#gate .public-ai-mic{display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(255,255,255,.25);border-radius:14px;background:rgba(255,255,255,.13);font-size:23px}#gate .public-ai-wave{height:38px;display:flex;align-items:center;justify-content:center;gap:4px;direction:ltr}#gate .public-ai-wave i{display:block;width:4px;height:12px;border-radius:8px;background:#fff;opacity:.9}#gate .public-ai-wave i:nth-child(3n){height:25px}#gate .public-ai-wave i:nth-child(4n){height:32px}#gate .public-ai-wave i:nth-child(5n){height:18px}#gate .public-ai-voice-caption{grid-column:1/-1;color:#e2f3e8;font-size:11px;font-weight:800;text-align:center}#gate .public-ai-dialog{padding:12px 14px;border-radius:14px;min-width:0}#gate .public-ai-question{margin-inline-start:12%;border:1px solid #e2e9e4;background:#fff}#gate .public-ai-answer{margin-inline-end:5%;border:1px solid #cfe5d5;background:#eaf5ed}#gate .public-ai-speaker{display:block;margin-bottom:6px;color:#006233;font-size:11px;font-weight:900}#gate .public-ai-dialog p{margin:0;color:#263c2e;font-size:13px;line-height:1.85;font-weight:650}#gate .public-ai-example{display:grid;gap:4px;margin-top:9px;padding:9px 11px;border-inline-start:3px solid #d21034;border-radius:8px;background:#fff}#gate .public-ai-example bdi{color:#075b35;font-size:14px;font-weight:900}#gate .public-ai-example small{color:#68796d;font-size:10px;line-height:1.6}#gate .public-ai-card .public-ai-note{font-size:11px!important;line-height:1.75!important;color:#68796d!important}@media(min-width:1000px){#gate .public-ai-card{padding:24px!important}#gate .public-ai-tutor-demo{gap:15px;padding:20px}#gate .public-ai-dialog p{font-size:14px}}@media(max-width:700px){#gate .public-ai-tutor-demo{gap:10px;padding:12px}#gate .public-ai-voice-stage{padding:12px;grid-template-columns:42px minmax(0,1fr);gap:9px}#gate .public-ai-mic{width:41px;height:41px}#gate .public-ai-wave{gap:3px}#gate .public-ai-wave i{width:3px}#gate .public-ai-question{margin-inline-start:5%}#gate .public-ai-answer{margin-inline-end:2%}#gate .public-ai-dialog p{font-size:12px}#gate .public-ai-example small{font-size:10px}}@media(prefers-reduced-motion:reduce){#gate .public-ai-wave i{animation:none!important}}html[data-theme="dark"] #gate .public-ai-tutor-demo{border-color:#315b40;background:linear-gradient(150deg,#172b20,#1b2921 65%,#302022);color:#e7f5eb}html[data-theme="dark"] #gate .public-ai-tutor-subject,html[data-theme="dark"] #gate .public-ai-card .public-ai-note{color:#b6c9bb!important}html[data-theme="dark"] #gate .public-ai-question{border-color:#3a5142;background:#202d24}html[data-theme="dark"] #gate .public-ai-answer{border-color:#426b4d;background:#203b2a}html[data-theme="dark"] #gate .public-ai-dialog p{color:#e4f0e7}html[data-theme="dark"] #gate .public-ai-speaker{color:#a5e0b8}html[data-theme="dark"] #gate .public-ai-example{background:#17251c}html[data-theme="dark"] #gate .public-ai-example bdi{color:#b4e7c2}html[data-theme="dark"] #gate .public-ai-example small{color:#b8c8bc}';
      document.head.appendChild(style);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alignPublicHero,{once:true});
  else alignPublicHero();
})();
