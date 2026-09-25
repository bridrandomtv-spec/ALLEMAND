/* parle.js v2 — 🗣️ تحدث مع المنصة الذكية : 9 langues + DARIJA + MOTEUR DE VOIX ARABE
   (classement des voix : naturelles/neurales d'abord, voix masculines arabes préférées,
    choix manuel mémorisé, et repli cloud si aucune voix arabe correcte sur l'appareil) */
'use strict';
(function(){
  const LANGS = [
    ['ar','🇩🇿 العربية','ar-SA'], ['de','🇩🇪 Deutsch','de-DE'],
    ['en','🇬🇧 English','en-US'], ['fr','🇫🇷 Français','fr-FR'],
    ['es','🇪🇸 Español','es-ES'], ['it','🇮🇹 Italiano','it-IT'],
    ['ru','🇷🇺 Русский','ru-RU'], ['zh','🇨🇳 中文','zh-CN'],
    ['tr','🇹🇷 Türkçe','tr-TR']
  ];
  const ROLE = {
    ar: { eleve:'من طلابنا', parent:'من أولياء الأمور', prof:'من أساتذتنا', admin:'من إدارة المنصة', inconnu:'من أسرة المنصة' },
    de: { eleve:'Schüler(in)', parent:'Elternteil', prof:'Lehrkraft', admin:'Admin', inconnu:'Freund' },
    en: { eleve:'student', parent:'parent', prof:'teacher', admin:'admin', inconnu:'friend' },
    fr: { eleve:'élève', parent:'parent', prof:'professeur', admin:'admin', inconnu:'ami' },
    es: { eleve:'estudiante', parent:'madre/padre', prof:'profesor', admin:'admin', inconnu:'amigo' },
    it: { eleve:'studente', parent:'genitore', prof:'insegnante', admin:'admin', inconnu:'amico' },
    ru: { eleve:'ученик', parent:'родитель', prof:'учитель', admin:'админ', inconnu:'друг' },
    zh: { eleve:'学生', parent:'家长', prof:'老师', admin:'管理员', inconnu:'朋友' },
    tr: { eleve:'öğrenci', parent:'veli', prof:'öğretmen', admin:'yönetici', inconnu:'arkadaş' }
  };
  const HELLO = {
    ar: n => 'مرحبًا بك يا ' + n.n + ' ! أنت ' + n.r + '. أنا منصتك الذكية : اسألني بالألمانية أو العربية أو بالدارجة، وسأجيبك بصوتي.',
    de: n => 'Willkommen, ' + n.n + ' ! Du bist ' + n.r + '. Frag mich auf Deutsch, Arabisch oder Darija — ich antworte mit meiner Stimme.',
    en: n => 'Welcome, ' + n.n + ' ! You are a ' + n.r + '. Ask me in German, Arabic or Darija — I answer with my voice.',
    fr: n => 'Bienvenue, ' + n.n + ' ! Tu es ' + n.r + '. Pose-moi tes questions en allemand, arabe ou darija — je réponds avec ma voix.',
    es: n => '¡Bienvenido, ' + n.n + ' ! Eres ' + n.r + '. Pregúntame en alemán, árabe o darija — respondo con mi voz.',
    it: n => 'Benvenuto, ' + n.n + ' ! Sei ' + n.r + '. Chiedimi in tedesco, arabo o darija — rispondo con la mia voce.',
    ru: n => 'Добро пожаловать, ' + n.n + ' ! Ты ' + n.r + '. Спрашивай на немецком, арабском или дарджа — я отвечу голосом.',
    zh: n => '欢迎你，' + n.n + '！你是' + n.r + '。请用德语、阿拉伯语或达尔贾语提问——我会用语音回答。',
    tr: n => 'Hoş geldin, ' + n.n + ' ! Sen bir ' + n.r + '. Almanca, Arapça veya Darica sor — sesimle cevaplarım.'
  };
  let ON = false, rec = null, lang = 'ar', speaking = false, listeningGuard = false, NS = 0;

  /* ══════════ MOTEUR DE VOIX ARABE ══════════ */
  const MALE_AR = /ismael|hamed|shakir|naayf|tarik|maged|abdul|farid|omar|male|homme|man/i;
  function arVoices(){
    try{ return speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().indexOf('ar') === 0); }
    catch(e){ return []; }
  }
  function scoreAr(v){
    let s = 0;
    if(/natural|neural|online|premium|enhanced/i.test(v.name)) s += 4;
    if(MALE_AR.test(v.name)) s += 3;
    if(/google/i.test(v.name)) s += 2;
    if(v.lang.toLowerCase() === 'ar-dz') s += 1;
    if(v.lang.toLowerCase() === 'ar-sa') s += 1;
    return s;
  }
  function scoreDe(x){
    let s = 0;
    if(/natural|neural|online|premium|enhanced/i.test(x.name)) s += 4;
    if(/conrad|stefan|markus|klaus|male|mann/i.test(x.name)) s += 3;
    if(/google/i.test(x.name)) s += 2;
    if(x.lang === 'de-DE') s += 1;
    return s;
  }
  function chosenArVoice(list){
    let pref = '';
    try{ pref = localStorage.getItem('dz_voix_ar') || ''; }catch(e){}
    const vs = list || arVoices();
    if(pref){ const f = vs.filter(v => v.name === pref)[0]; if(f) return f; }
    vs.sort((a, b) => scoreAr(b) - scoreAr(a));
    return vs[0] || null;
  }
  function cloudAr(texte, done){
    /* repli 100 % local (voix système par défaut) — AUCUN service tiers :
       zéro requête externe, zéro stockage tiers, zéro alerte Tracking Prevention */
    try{
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = 'ar-SA'; u.rate = 0.95;
      u.onend = done; u.onerror = () => done();
      speechSynthesis.speak(u);
    }catch(e){ done(); }
  }
  function fillVoixSel(){
    const sel = document.getElementById('plVoix');
    if(!sel) return;
    const vs = arVoices().sort((a, b) => scoreAr(b) - scoreAr(a));
    sel.innerHTML = '<option value="">🔊 تلقائي (أفضل صوت عربي)</option>'
      + vs.map(v => '<option value="' + v.name.replace(/"/g, '') + '">'
          + (MALE_AR.test(v.name) ? '👨 ' : '👤 ') + v.name + ' (' + v.lang + ')</option>').join('');
    try{ const p = localStorage.getItem('dz_voix_ar') || ''; if(p) sel.value = p; }catch(e){}
  }
  function spoken(t){
    return String(t)
      .replace(/\(ة\)/g, '')
      .replace(/[()]/g, ' ')
      .replace(/\s*\/\s*/g, ' أو ')
      .replace(/[·•]/g, '،')
      .replace(/\s+/g, ' ')
      .trim();
  }
  /* ── translittération du nom arabe pour les salutations non-arabes ── */
  const TR = { 'ا':'a','أ':'a','إ':'i','آ':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
    'د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a',
    'غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y','ى':'a',
    'ة':'a','ء':'','َ':'','ِ':'','ُ':'','ً':'','ٍ':'','ٌ':'','ّ':'','ـ':'' };
  function translit(s){
    return String(s || '').split(/\s+/).map(w => {
      let out = '';
      for(const ch of w) out += (ch in TR) ? TR[ch] : (/[a-zA-Z0-9]/.test(ch) ? ch : '');
      return out.charAt(0).toUpperCase() + out.slice(1);
    }).filter(Boolean).join(' ') || 'Freund';
  }
  /* ── attendre que les voix du système soient chargées (sinon voix par défaut = arabe !) ── */
  function voicesReady(){
    return new Promise(res => {
      let v = [];
      try{ v = speechSynthesis.getVoices(); }catch(e){}
      if(v && v.length) return res(v);
      let done = false;
      const fin = () => { if(done) return; done = true;
        let w = []; try{ w = speechSynthesis.getVoices(); }catch(e){}
        res(w || []); };
      try{ speechSynthesis.onvoiceschanged = fin; }catch(e){}
      setTimeout(fin, 1500);
    });
  }
  function pickVoice(all, code){
    const pref = String(code || 'de').slice(0, 2).toLowerCase();
    if(pref === 'ar'){ const p = chosenArVoice(all); if(p) return p; }
    let vs = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf(pref) === 0)
      .sort((a, b) => scoreDe(b) - scoreDe(a));
    if(vs.length) return vs[0];
    const d = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf('de') === 0);
    if(d.length) return d[0];
    const e2 = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf('en') === 0);
    if(e2.length) return e2[0];
    return null;
  }
  /* ══════════ parole ══════════ */
  async function speak(texte, lc){
    texte = spoken(texte);
    speaking = true;
    const ALLV = await voicesReady();
    const done = () => { speaking = false; if(ON) setTimeout(listen, 300); };
    const isAr = /[\u0600-\u06FF]/.test(texte);
    const target = lc || (isAr ? 'ar-SA' : ((LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2]));
    if(isAr){
      const v = chosenArVoice(ALLV);
      if(v){
        const u = new SpeechSynthesisUtterance(texte);
        u.voice = v; u.lang = v.lang;
        u.rate = +(localStorage.getItem('dz_voix_rate') || 0.95);
        u.pitch = +(localStorage.getItem('dz_voix_pitch') || 1);
        u.onend = done; u.onerror = () => cloudAr(texte, done);
        speechSynthesis.speak(u);
      }else cloudAr(texte, done);
      setTimeout(() => { if(ON){ speaking = false; listen(); } }, 45000);
      return;
    }
    const u = new SpeechSynthesisUtterance(texte.slice(0, 400));
    u.lang = target;
    u.rate = +(localStorage.getItem('dz_voix_rate') || 0.95);
    u.pitch = +(localStorage.getItem('dz_voix_pitch') || 1);
    try{
      const pv = pickVoice(ALLV, target);
      if(pv) u.voice = pv;
    }catch(e){}
    u.onend = done; u.onerror = done;
    speechSynthesis.speak(u);
    setTimeout(() => { if(ON){ speaking = false; listen(); } }, 45000);
  }
  /* ══════════ intentions multilingues ══════════ */
  function canon(q){
    let m;
    if((m = q.match(/(?:conjugate|conjuguer|conjuga|coniuga|konjugier|спря|çekimle|变位|صرف|كيفاش\s*نصرف)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'صرف ' + m[1];
    if((m = q.match(/(?:article|artikel|articulo|articolo|артикль|冠词|الأداة|اداة|شنو\s*الاداة|واش\s*الاداة)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'Artikel ' + m[1];
    if((m = q.match(/(?:plural|pluriel|plurale|множествен|复数|جمع|الجمع|كيفاش\s*نجمع)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'Plural ' + m[1];
    if((m = q.match(/(?:what does|was bedeutet|que signifie|cosa significa|qué significa|что значит|什么意思|شنو\s*يعني|واش\s*يعني|ماذا\s*يعني)\s+(.+)/i)))
      return 'معنى ' + m[1];
    if(/(w-fragen|fragewörter|interrogativ|question words|вопросительн|疑问词|أدوات\s*الاستفهام|ادوات\s*الاستفهام)/i.test(q))
      return 'W-Fragen';
    if(/(zahl|number|numéro|numero|число|数字|رقم|عدد|الأرقام|الارقام)/i.test(q))
      return 'Zahlen';
    return q;
  }
  /* ══════════ écoute ══════════ */
  function listen(){
    if(!ON || listeningGuard) return;
    if(speaking){ setTimeout(listen, 600); return; }
    listeningGuard = true;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ setStatus('⚠️ navigateur sans écoute (utilise Chrome/Edge)'); listeningGuard = false; return; }
    try{ if(rec) rec.stop(); }catch(e){}
    rec = new SR();
    rec.lang = (LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2];
    rec.interimResults = false;
    rec.onresult = async ev => {
      const q = String(ev.results[0][0].transcript || '').trim();
      if(!q){ setStatus('🎧 …'); return; }
      NS = 0;
      setStatus('⏳ ' + q.slice(0, 40));
      const fn = window.reponseIA || window.reponsePedagogique || (window.RAG && RAG.reponsePedagogique);
      let rep = '';
      if(typeof fn === 'function'){ try{ rep = await fn(canon(q)); }catch(e){} }
      if(rep && typeof rep === 'object') rep = rep.texte || rep.reponse || '';
      rep = String(rep || '');
      if(!rep || rep.indexOf('لا أعرف') !== -1){
        const er = window.__IA_ERR || '';
        if(er) setStatus('🧠 ' + String(er).slice(0, 40));
        rep = lang === 'ar' ? 'لم أفهم تمامًا. اسألني عن تصريف فعل، أداة، جمع، رقم، أو معنى كلمة.'
            : 'Ich habe das nicht verstanden. Frag mich nach Konjugation, Artikel, Plural, Zahlen oder Bedeutung.'; }
      setStatus('🗣️ …');
      speak(rep.slice(0, 700));
    };
    rec.onerror = e => { listeningGuard = false;
      const er = (e && e.error) || 'erreur';
      if(er === 'no-speech'){
        NS++;
        setStatus(NS >= 3 ? '🎤 appuie sur 🎙 quand tu es prêt à parler' : '🎧 …');
      }else setStatus('⚠️ micro : ' + er);
      if(ON) setTimeout(listen, er === 'no-speech' ? 900 : 1500); };
    rec.onend = () => { listeningGuard = false; if(ON && !speaking) setTimeout(listen, 800); };
    rec.start();
  }
  function setStatus(t){ const s = document.getElementById('parleSt'); if(s) s.textContent = t; }
  function identite(){
    try{
      const s = window.AUTH && AUTH.session ? AUTH.session() : null;
      if(s && s.nom) return { n: s.nom, r: (ROLE[lang] || ROLE.ar)[s.role] || (ROLE[lang] || ROLE.ar).eleve };
    }catch(e){}
    return null;
  }
  function on(){
    ON = true;
    const b = document.getElementById('parleBtn');
    b.classList.add('on'); b.textContent = '🔴 إيقاف الحديث';
    const id = identite();
    const hello = id ? HELLO[lang]({ n: (lang === 'ar' ? id.n : translit(id.n)), r: id.r })
      : HELLO[lang]({ n: (ROLE[lang] || ROLE.ar).inconnu, r: (ROLE[lang] || ROLE.ar).inconnu });
    const v = chosenArVoice();
    setStatus(v && /natural|neural|online/i.test(v.name) ? '🟢 voix naturelle : ' + v.name
      : '🟢 تتحدث وتسمع · 💡 Edge = أفضل صوت عربي رجالي');
    speak(hello, (LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2]);
  }
  function off(){
    ON = false;
    try{ if(rec) rec.stop(); }catch(e){}
    try{ speechSynthesis.cancel(); }catch(e){}
    speaking = false; listeningGuard = false;
    const b = document.getElementById('parleBtn');
    b.classList.remove('on'); b.textContent = '🗣️ تحدث مع المنصة الذكية';
    setStatus('⚪ في وضع الانتظار');
  }
  function bar(){
    if(document.getElementById('parleBar')) return;
    const d = document.createElement('div');
    d.id = 'parleBar';
    d.innerHTML = '<button id="parleBtn" class="pl-btn">🗣️ تحدث مع المنصة الذكية</button>'
      + '<button id="parleMic" class="pl-cfg" title="تحدث الآن">🎙</button>'
      + '<button id="parleCfg" class="pl-cfg" title="إعدادات الصوت">⚙️</button>'
      + '<select id="parleLang" class="pl-sel" title="اللغة">' + LANGS.map(l =>
          '<option value="' + l[0] + '">' + l[1] + '</option>').join('') + '</select>'
      + '<span id="parleSt" class="pl-st">⚪ في وضع الانتظار</span>';
    document.body.prepend(d);
    d.querySelector('#parleBtn').addEventListener('click', () => ON ? off() : on());
    d.querySelector('#parleLang').addEventListener('change', e => {
      lang = e.target.value;
      if(ON){ off(); setTimeout(on, 200); }
    });
    d.querySelector('#parleCfg').addEventListener('click', () => {
      let p = document.getElementById('plCfgPanel');
      if(p){ p.remove(); return; }
      p = document.createElement('div');
      p.id = 'plCfgPanel'; p.className = 'pl-cfgpanel';
      p.innerHTML = '<b>🔊 إعدادات الصوت</b>'
        + '<label>الصوت <select id="plVoix" class="pl-sel"></select></label>'
        + '<label>السرعة <input type="range" id="plRate" min="0.7" max="1.2" step="0.05" value="'
        + (localStorage.getItem('dz_voix_rate') || 0.95) + '"></label>'
        + '<label>طبقة الصوت <input type="range" id="plPitch" min="0.7" max="1.3" step="0.05" value="'
        + (localStorage.getItem('dz_voix_pitch') || 1) + '"></label>'
        + '<button class="btn btn-o btn-sm" id="plTest">🔊 اختبار</button>';
      document.body.appendChild(p);
      fillVoixSel();
      p.querySelector('#plVoix').addEventListener('change', e => {
        try{ localStorage.setItem('dz_voix_ar', e.target.value); }catch(err){}
        try{ speechSynthesis.cancel(); }catch(err){}
        speak('مرحبًا ! هذه هي الصوت التي اخترتها.', null);
      });
      p.querySelector('#plRate').addEventListener('input', e =>
        localStorage.setItem('dz_voix_rate', e.target.value));
      p.querySelector('#plPitch').addEventListener('input', e =>
        localStorage.setItem('dz_voix_pitch', e.target.value));
      p.querySelector('#plTest').addEventListener('click', () =>
        speak('Guten Tag ! Ich bin die Stimme deiner Plattform. Wie klingt es jetzt ?', 'de-DE'));
    });
    d.querySelector('#parleMic').addEventListener('click', () => {
      if(!ON) on();
      try{ speechSynthesis.cancel(); }catch(e){}
      speaking = false; listeningGuard = false; NS = 0;
      setStatus('🎧 je t’écoute… parle maintenant');
      listen();
    });
    fillVoixSel();
    try{
      speechSynthesis.onvoiceschanged = () => fillVoixSel();
    }catch(e){}
  }
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', bar);
  else bar();
})();
