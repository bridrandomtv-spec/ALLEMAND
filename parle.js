/* parle.js — 🗣️ تحدث مع المنصة الذكية : mode conversation vocale MULTILINGUE
   (ar · de · en · fr · es · it · ru · zh · tr) + compréhension DARIJA.
   La plateforme est en ATTENTE : elle ne parle que si le bouton est activé,
   et se tait immédiatement à la désactivation. Elle salue par le VRAI nom
   (élève / parent / prof) lu dans la session. */
'use strict';
(function(){
  const LANGS = [
    ['ar','🇩 العربية','ar-DZ'], ['de','🇩🇪 Deutsch','de-DE'],
    ['en','🇬🇧 English','en-US'], ['fr','🇫🇷 Français','fr-FR'],
    ['es','🇪🇸 Español','es-ES'], ['it','🇮🇹 Italiano','it-IT'],
    ['ru','🇷🇺 Русский','ru-RU'], ['zh','🇨🇳 中文','zh-CN'],
    ['tr','🇹🇷 Türkçe','tr-TR']
  ];
  const ROLE = {
    ar: { eleve:'طالب(ة)', parent:'وليّ أمر', prof:'أستاذ', admin:'مدير', inconnu:'صديقنا' },
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
  let ON = false, rec = null, lang = 'ar', speaking = false;

  /* ── routeur d'intentions multilingue → requête canonique ── */
  function canon(q){
    let m;
    if((m = q.match(/(?:conjugate|conjuguer|conjuga|coniuga|konjugier|спря|çekimle|变位|صرف|صرف|كيفاش\s*نصرف|كونجيغي)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'صرف ' + m[1];
    if((m = q.match(/(?:article|artikel|articulo|articolo|артикль|冠词|الأداة|اداة|شنو\s*الاداة|واش\s*الاداة)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'Artikel ' + m[1];
    if((m = q.match(/(?:plural|pluriel|plurale|множествен|复数|جمع|الجمع|كيفاش\s*نجمع)[^\w]*([a-zäöüß]+)\s*$/i)))
      return 'Plural ' + m[1];
    if((m = q.match(/(?:what does|was bedeutet|que signifie|cosa significa|qué significa|что значит|什么意思|شنو\s*يعني|واش\s*يعني|ماذا\s*يعني)\s+(.+)/i)))
      return 'معنى ' + m[1];
    if(/(w-fragen|fragewörter|interrogativ|question words|вопросительн|疑问词|أدوات\s*الاستفهام|ادوات\s*الاستفهام|شنو\s*هي\s*أدوات)/i.test(q))
      return 'W-Fragen';
    if(/(zahl|number|numéro|numero|число|数字|رقم|عدد|الأرقام|الارقام)/i.test(q))
      return 'Zahlen';
    return q;
  }

  function ttsLang(texte){
    return /[\u0600-\u06FF]/.test(texte) ? (lang === 'ar' ? 'ar-DZ' : 'ar-SA') : 'de-DE';
  }
  function speak(texte, lc){
    speaking = true;
    try{
      if(lc && (lc === 'de-DE') && window.VOIX && VOIX.parler){ VOIX.parler(texte, 'de-DE'); }
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = lc || ttsLang(texte); u.rate = 0.95;
      u.onend = () => { speaking = false; if(ON) setTimeout(listen, 300); };
      u.onerror = () => { speaking = false; if(ON) setTimeout(listen, 300); };
      speechSynthesis.speak(u);
    }catch(e){ speaking = false; if(ON) setTimeout(listen, 300); }
  }
  function listen(){
    if(!ON) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ setStatus('⚠️ navigateur sans écoute'); return; }
    try{ if(rec) rec.stop(); }catch(e){}
    rec = new SR();
    rec.lang = (LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2];
    rec.interimResults = false;
    rec.onresult = async ev => {
      const q = ev.results[0][0].transcript;
      setStatus('⏳ ' + q.slice(0, 40));
      const fn = window.reponsePedagogique || (window.RAG && RAG.reponsePedagogique);
      let rep = '';
      if(typeof fn === 'function'){ try{ rep = await fn(canon(q)); }catch(e){} }
      if(rep && typeof rep === 'object') rep = rep.texte || rep.reponse || '';
      rep = String(rep || '');
      if(!rep || rep.indexOf('لا أعرف') !== -1)
        rep = lang === 'ar' ? 'لم أفهم تمامًا. اسألني عن تصريف فعل، أداة، جمع، رقم، أو معنى كلمة.'
            : 'Ich habe das nicht verstanden. Frag mich nach Konjugation, Artikel, Plural, Zahlen oder Bedeutung.';
      setStatus('🗣️ …');
      speak(rep.slice(0, 700));
    };
    rec.onerror = () => { if(ON) setTimeout(listen, 1200); };
    rec.onend = () => { if(ON && !speaking) setTimeout(listen, 800); };
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
    const hello = id ? HELLO[lang]({ n: id.n, r: id.r })
      : (lang === 'ar' ? 'مرحبًا بك ! سجّل الدخول في ☁️ Cloud لأناديك باسمك الحقيقي. اسألني بالألمانية أو العربية أو بالدارجة.'
        : HELLO[lang]({ n: (ROLE[lang] || ROLE.ar).inconnu, r: (ROLE[lang] || ROLE.ar).inconnu }));
    setStatus('🟢 تتحدث وتسمع');
    speak(hello, (LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2]);
  }
  function off(){
    ON = false;
    try{ if(rec) rec.stop(); }catch(e){}
    try{ speechSynthesis.cancel(); }catch(e){}
    speaking = false;
    const b = document.getElementById('parleBtn');
    b.classList.remove('on'); b.textContent = '🗣️ تحدث مع المنصة الذكية';
    setStatus('⚪ في وضع الانتظار');
  }
  function bar(){
    if(document.getElementById('parleBar')) return;
    const d = document.createElement('div');
    d.id = 'parleBar';
    d.innerHTML = '<button id="parleBtn" class="pl-btn">🗣️ تحدث مع المنصة الذكية</button>'
      + '<select id="parleLang" class="pl-sel">' + LANGS.map(l =>
          '<option value="' + l[0] + '">' + l[1] + '</option>').join('') + '</select>'
      + '<span id="parleSt" class="pl-st">⚪ في وضع الانتظار</span>';
    document.body.prepend(d);
    d.querySelector('#parleBtn').addEventListener('click', () => ON ? off() : on());
    d.querySelector('#parleLang').addEventListener('change', e => {
      lang = e.target.value;
      if(ON){ off(); setTimeout(on, 200); }
    });
  }
  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', bar);
  else bar();
})();
