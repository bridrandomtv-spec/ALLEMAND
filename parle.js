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
  let ON = false, rec = null, lang = 'ar', speaking = false, listeningGuard = false, NS = 0, CONT = false, UT = 0, LASTSP = { t: 0, txt: '' }, LASTQ = { q: '', t: 0 }, LASTLANG = '';

  /* ══════════ MOTEUR DE VOIX : FÉMININE NATURELLE prioritaire (mobile + laptop) ══════════ */
  const FEM = /female|femme|woman|frau|weiblich|dame|sara|anna|lena|hedda|katja|vicky|marlene|amelie|clara|zira|hazel|susan|hortense|julie|paulina|monica|lucia|valentina|elsa|petra|gitta|vicki|josephine|amira|nora/i;
  const MALE_AR = /ismael|hamed|shakir|naayf|tarik|maged|abdul|farid|omar|male|homme|man/i;
  const FEM_AR = /salma|layla|leila|maryam|zeina|amina|female|femme|woman|سلمى|ليلى|مريم|أمينة/i;
  function arVoices(){
    try{ return speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().indexOf('ar') === 0); }
    catch(e){ return []; }
  }
  function scoreVoice(v, pref){
    let s = 0;
    const nm = String(v.name || '');
    const lg = String(v.lang || '').toLowerCase();
    /* 1) voix naturelles/neurales/en ligne = les plus belles (surtout mobile) */
    if(/natural|neural|online|premium|enhanced|expressive/i.test(nm)) s += 6;
    if(/google/i.test(nm)) s += 3;
    if(/microsoft/i.test(nm)) s += 2;
    /* 2) priorité FÉMININE pour de/fr/es/it/en ; féminine naturelle pour ar */
    if(pref !== 'ar' && FEM.test(nm)) s += 5;
    if(pref === 'ar' && FEM_AR.test(nm)) s += 4;
    if(pref === 'ar' && MALE_AR.test(nm)) s += 2;
    /* 3) correspondance exacte de la langue cible */
    if(lg.indexOf(pref) === 0) s += 2;
    return s;
  }
  function scoreAr(v){ return scoreVoice(v, 'ar'); }
  function chosenArVoice(list){
    let pref = '';
    try{ pref = localStorage.getItem('dz_voix_ar') || ''; }catch(e){}
    const vs = list || arVoices();
    if(pref){ const f = vs.filter(v => v.name === pref)[0]; if(f) return f; }
    vs.sort((a, b) => scoreAr(b) - scoreAr(a));
    return vs[0] || null;
  }
  function cloudAr(texte, done){
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
    sel.innerHTML = '<option value="">🔊 تلقائي (أفضل صوت — أنثوي طبيعي)</option>'
      + vs.map(v => '<option value="' + v.name.replace(/"/g, '') + '">'
          + (MALE_AR.test(v.name) ? '👨 ' : '👤 ') + v.name + ' (' + v.lang + ')</option>').join('');
    try{ const p = localStorage.getItem('dz_voix_ar') || ''; if(p) sel.value = p; }catch(e){}
  }
  function spoken(t){
    return String(t == null ? '' : t)
      /* ── HTML → texte : rag.js renvoie du HTML riche (<b>, <ul>, <li class=…>) ;
            sans ce nettoyage la voix lisait « b class de-in » ── */
      .replace(/<\s*br\s*\/?\s*>/gi, ' ')
      .replace(/<\s*\/(?:p|div|ul|ol|h[1-6]|tr|li)\s*>/gi, ' ')
      .replace(/<\s*button[^>]*>[\s\S]*?<\s*\/button\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
      .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'")
      /* ── symboles jamais vocalisés ── */
      .replace(/\(ة\)/g, '')
      .replace(/[()]/g, ' ')
      .replace(/\s*\/\s*/g, ' أو ')
      .replace(/[·•]/g, '،')
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ')
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
      .sort((a, b) => scoreVoice(b, pref));
    if(vs.length) return vs[0];
    const d = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf('de') === 0);
    if(d.length) return d[0];
    const e2 = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf('en') === 0);
    if(e2.length) return e2[0];
    return null;
  }
  /* ══════════ parole ══════════ */
  function chunk(t){
    const out = [];
    let cur = '';
    const parts = String(t).match(/[^.!?\n]+[.!?\n]*|./g) || [String(t)];
    for(const p of parts){
      if((cur + p).length > 150 && cur){ out.push(cur.trim()); cur = p; }
      else cur += p;
    }
    if(cur.trim()) out.push(cur.trim());
    return out.length ? out : [String(t)];
  }
  /* ══════════ AGENT 4 (VOIX) : détection de langue + voix native par segment ══════════ */
  const DE_WORDS = /\b(der|die|das|den|dem|und|oder|nicht|kein|ich|du|er|sie|es|wir|ihr|ist|sind|bin|bist|war|habe|hast|hat|haben|wird|werden|wurde|kann|muss|soll|will|darf|mag|ein|eine|einen|mein|dein|deine|sein|mit|ohne|für|von|zu|aus|bei|nach|um|am|im|auf|über|vor|heiße|wohne|wohnt|komme|kommt|mache|macht|gehe|geht|lerne|lernt|schule|deutsch|bitte|danke|gut|sehr|wie|was|wer|wo|woher|wohin|wann|warum|ja|nein|doch|akkusativ|dativ|perfekt|artikel|plural)\b/i;
  const FR_WORDS = /\b(le|la|les|je|tu|il|elle|ne|pas|est|suis|mon|ma|bonjour|merci|pourquoi)\b/i;
  const ES_WORDS = /\b(el|la|los|las|yo|usted|es|son|mi|su|gracias|hola|buenos|porque)\b/i;
  const IT_WORDS = /\b(il|lo|gli|che|di|io|tu|lei|sono|grazie|ciao|perch\u00e9|questa|quello)\b/i;
  const LCODE = { ar:'ar-SA', de:'de-DE', fr:'fr-FR', es:'es-ES', it:'it-IT', en:'en-US' };
  function detectLang(t){
    if(/[\u0600-\u06FF]/.test(t)) return 'ar';
    if(/[\u00e4\u00f6\u00fc\u00df]/i.test(t) || DE_WORDS.test(t)) return 'de';
    if(/[\u00e0\u00e2\u00e7\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u00fb\u00f9]/i.test(t) || FR_WORDS.test(t)) return 'fr';
    if(/[\u00bf\u00a1]/.test(t) || /[\u00e1\u00e9\u00ed\u00f3\u00f1]/i.test(t) || ES_WORDS.test(t)) return 'es';
    if(/[\u00e0\u00e8\u00ec\u00f2\u00f9]/i.test(t) || IT_WORDS.test(t)) return 'it';
    return '';
  }
  function langOfBar(){ try{ return (LANGS.filter(l => l[0] === lang)[0] || LANGS[0])[2]; }catch(e){ return 'de-DE'; } }
  /* ═══ AGENT VOIX v4 — classification de langue PAR SPAN ═══
     Règle absolue : un span latin n'est JAMAIS classé 'ar'.
     AVANT : chaque mot allemand non reconnu héritait de la langue de la barre
     (arabe) → la voix arabe lisait l'allemand = prononciation catastrophique.
     APRÈS : le span latin entier est classé par vote (umlauts ×3 + mots-outils ×2)
     et sans indice → 'de' (langue cible de la plateforme). */
  const DE_VOTE = /\b(ich|du|er|sie|es|wir|ihr|der|die|das|den|dem|des|ein|eine|einen|einem|einer|und|oder|aber|nicht|kein|keine|ist|sind|bin|bist|war|waren|wird|werden|wurde|wurden|habe|hast|hat|haben|hatte|kann|kannst|konnte|muss|musst|musste|soll|sollte|will|wollte|darf|mag|mochte|mit|ohne|fuer|von|zu|zum|zur|aus|bei|nach|seit|um|am|im|an|auf|unter|ueber|vor|hinter|neben|zwischen|mein|meine|dein|deine|sein|seine|ihre|unser|bitte|danke|gut|gute|guten|sehr|auch|schon|noch|nur|hier|dort|heute|morgen|gestern|zeit|tag|jahr|jahre|alt|woche|stunde|mann|frau|kind|haus|schule|buch|freund|familie|deutsch|deutschland|wie|was|wer|wo|woher|wohin|wann|warum|ja|nein|doch|tschues|heisse|wohne|wohnt|komme|kommt|lerne|lernt|spreche|spricht|mache|macht|gehe|geht|spiele|spielt|esse|trinke|akkusativ|akusativ|dativ|nominativ|genitiv|artikel|plural|singular|verb|adjektiv|praeposition|nebensatz|hauptsatz|perfekt|praeteritum|konjunktiv|imperativ|komparativ|superlativ|beispiel|beispiele|regel|regeln|uebung|aufgabe|antwort|frage|fragen|richtig|falsch|genau|zuerst|dann|danach|vormittag|nachmittag|abend|nacht)\b/gi;
  const FR_VOTE = /\b(je|tu|nous|vous|ils|elles|le|la|les|un|une|des|ne|pas|est|suis|sont|mon|ma|mes|ton|ta|son|sa|bonjour|merci|pourquoi|comment|avec|sans|pour|dans|chez|etre|avoir|faire|aller|tres|aussi|comme|mais|donc|parce|cette|ces|mot|mots|phrase|verbe|verbes|exemple|exemples)\b/gi;
  const ES_VOTE = /\b(yo|usted|ustedes|el|los|las|uno|una|unos|unas|somos|son|mi|su|gracias|hola|buenos|buenas|porque|como|esta|este|estos|tengo|quiero|puedo|muy|tambien|pero|para|con|sin|palabra|frase|verbo|ejemplo)\b/gi;
  const IT_VOTE = /\b(io|lui|lei|noi|voi|loro|il|lo|gli|un|uno|una|che|di|sono|grazie|ciao|questa|questo|quello|molto|anche|per|con|senza|essere|avere|fare|parola|frase|verbo|esempio)\b/gi;
  function voteLang(span){
    const t = String(span || '');
    let de = 0, fr = 0, es = 0, it = 0;
    const um = t.match(/[äöüßÄÖÜ]/g);
    if(um) de += um.length * 3;
    const dM = t.match(DE_VOTE); if(dM) de += dM.length * 2;
    const fM = t.match(FR_VOTE); if(fM) fr += fM.length * 2;
    const eM = t.match(ES_VOTE); if(eM) es += eM.length * 2;
    const iM = t.match(IT_VOTE); if(iM) it += iM.length * 2;
    const best = Math.max(de, fr, es, it);
    if(best === 0 || de >= best) return 'de';
    if(fr >= best) return 'fr';
    if(es >= best) return 'es';
    return 'it';
  }
  function splitByScript(t){
    /* 1) tokens : arabe | latin | autre (espace/ponctuation suivent le span courant) */
    const toks = String(t).match(/[\u0600-\u06FF][\u0600-\u06FF'’\-]*|[A-Za-z\u00c4\u00d6\u00dc\u00e4\u00f6\u00fc\u00df\u00c0-\u00ff\u00bf\u00a1'’]+|[^\sA-Za-z\u0600-\u06FF]+|\s+/g) || [String(t)];
    const spans = [];
    let cs = null;
    for(const tk of toks){
      let kind;
      if(/^[\u0600-\u06FF]/.test(tk)) kind = 'ar';
      else if(/[A-Za-z\u00c4\u00d6\u00dc\u00e4\u00f6\u00fc\u00df\u00c0-\u00ff]/.test(tk)) kind = 'lat';
      else kind = cs ? cs.kind : 'lat';
      if(cs && cs.kind === kind) cs.text += tk;
      else { cs = { kind: kind, text: tk }; spans.push(cs); }
    }
    /* 2) classification : 'ar' seulement si caractères arabes ; latin → vote du span ENTIER */
    const segs = [];
    for(const sp of spans){
      if(!sp.text.trim()){ if(segs.length) segs[segs.length - 1].text += sp.text; continue; }
      const hasL = /[A-Za-z\u00c4\u00d6\u00dc\u00e4\u00f6\u00fc\u00df\u00c0-\u00ff\u0600-\u06FF]/.test(sp.text);
      if(!hasL && segs.length){ segs[segs.length - 1].text += sp.text; continue; }
      const lg = sp.kind === 'ar' ? 'ar' : voteLang(sp.text);
      if(segs.length && segs[segs.length - 1].lang === lg) segs[segs.length - 1].text += sp.text;
      else segs.push({ lang: lg, text: sp.text });
    }
    /* 3) micro-segments (≤ 2 car.) absorbés par le précédent */
    const out = [];
    for(const s of segs.filter(x => x.text.trim())){
      if(out.length && s.text.trim().length <= 2) out[out.length - 1].text += s.text;
      else out.push({ lang: s.lang, text: s.text });
    }
    return out.length ? out : [{ lang: 'de', text: String(t || '') }];
  }
  function pickVoiceFor(all, lg){
    if(lg === 'ar') return chosenArVoice(all);
    const code = LCODE[lg] || (lg + '-' + String(lg).toUpperCase());
    const pref = code.slice(0, 2);
    const vs = (all || []).filter(x => (x.lang || '').toLowerCase().indexOf(pref) === 0)
      .sort((a, b) => scoreVoice(b, pref) - scoreVoice(a, pref));
    /* Aucune voix de CETTE langue sur l'appareil → null : u.lang (de-DE) pilotera
       le moteur natif du navigateur. JAMAIS de voix anglaise/arabe sur de
       l'allemand : une voix d'une autre langue écorche la prononciation. */
    return vs.length ? vs[0] : null;
  }
  async function speak(texte, lc){
    texte = spoken(texte);
    texte = spoken(texte);
    const nowMs = Date.now();
    if(texte && texte === LASTSP.txt && nowMs - LASTSP.t < 2500) return;
    LASTSP = { t: nowMs, txt: texte };
    try{ speechSynthesis.cancel(); }catch(e){}
    const my = ++UT;
    let ping = 0;
    speaking = true;
    const done = () => { if(my !== UT) return;
      try{ clearInterval(ping); }catch(e){} speaking = false;
      if(ON && CONT) setTimeout(listen, 400); else if(ON) setStatus('🎙 appuie pour parler'); };
    const ALLV = await voicesReady();
    const rate = +(localStorage.getItem('dz_voix_rate') || 0.95);
    const pitch = +(localStorage.getItem('dz_voix_pitch') || 1);
    let segs = splitByScript(String(texte).slice(0, 2200));
    if(lc && segs.length === 1 && !detectLang(segs[0].text)) segs[0].lang = lc.slice(0, 2);
    const queue = [];
    for(const s of segs){
      const voc = pickVoiceFor(ALLV, s.lang);
      const code = LCODE[s.lang] || s.lang;
      for(const c of chunk(s.text)) queue.push({ c: c, voc: voc, code: code });
    }
    const us = queue.map(it => {
      const u = new SpeechSynthesisUtterance(it.c);
      u.lang = it.code;
      if(it.voc) u.voice = it.voc;
      u.rate = rate; u.pitch = pitch;
      return u;
    });
    if(!us.length){ done(); return; }
    us.forEach((u, k) => {
      if(k === us.length - 1){ u.onend = done; u.onerror = done; }
      speechSynthesis.speak(u);
    });
    ping = setInterval(() => {
      try{
        if(my !== UT || !speaking){ clearInterval(ping); return; }
        speechSynthesis.resume();
      }catch(e){ clearInterval(ping); }
    }, 8000);
    setTimeout(() => { if(ON && my === UT){ speaking = false;
      if(CONT) listen(); else setStatus('🎙 appuie pour parler'); } }, 90000);
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
      if(q === LASTQ.q && Date.now() - LASTQ.t < 3000) return;
      LASTQ = { q: q, t: Date.now() };
      LASTLANG = detectLang(q) || LASTLANG;
      setStatus('⏳ ' + q.slice(0, 40));
      const fn = window.reponseIA || window.reponsePedagogique || (window.RAG && RAG.reponsePedagogique);
      let rep = '';
      /* compteur vivant : l'utilisateur VOIT que la plateforme réfléchit
         (le cerveau cloud peut mettre 5-25 s au démarrage à froid) */
      const t0 = Date.now();
      const compteur = setInterval(function(){
        const s = Math.round((Date.now() - t0) / 1000);
        const st = window.__IA_STATUT || '';
        if(s >= 2) setStatus((st || '🧠 réflexion') + ' · ' + s + 's');
      }, 1000);
      if(typeof fn === 'function'){
        try{ rep = await fn(canon(q)); }
        catch(e){ try{ console.warn('[parle] reponseIA :', e); }catch(_){}} 
      }
      clearInterval(compteur);
      if(rep && typeof rep === 'object') rep = rep.texte || rep.reponse || '';
      rep = String(rep || '');
      if(!rep || rep.indexOf('لا أعرف') !== -1){
        const er = window.__IA_ERR || '';
        if(er) setStatus('🧠 ' + String(er).slice(0, 40));
        /* distinguer : cerveau cloud injoignable vs question hors couverture */
        const cloudMort = (er === 'timeout-25s' || er.indexOf('timeout') !== -1 || er === 'Failed to fetch');
        if(lang === 'ar'){
          rep = cloudMort
            ? '🧠 الدماغ السحابي لا يستجيب (انتهت المهلة ٢٥ ثانية). تحقّق من العامل ia-ask على Cloudflare — أو أعد المحاولة. محرك الطوارئ المحلي جاهز للتصريف والصفحات.'
            : 'لم أفهم تمامًا. اسألني عن تصريف فعل، أداة، جمع، رقم، أو معنى كلمة — أو قل « الصفحة ١١ » لأقرأها لك.';
        }else{
          rep = cloudMort
            ? '🧠 Die Cloud-KI antwortet nicht (Timeout 25 s). Prüfe den Worker ia-ask auf Cloudflare — oder versuche es erneut. Der lokale Motor kann Konjugation und Seiten lesen.'
            : 'Ich habe das nicht verstanden. Frag mich nach Konjugation, Artikel, Plural, Zahlen oder Bedeutung — oder sag « Seite 11 ».';
        }
      }
      /* ── nettoyage HTML obligatoire : rag.js renvoie { html: … } ── */
      rep = spoken(rep);
      /* ── intent 🔊/🔤 : un mot allemand précis était demandé → on le prononce ── */
      const mot = String(window.__IA_WORD || '');
      window.__IA_WORD = '';
      if(mot && rep.length < 60) rep = mot + '. ' + rep;
      const RL = /[\u0600-\u06FF]/.test(rep) ? 'ar' : (/[\u00e4\u00f6\u00fc\u00df]/i.test(rep) ? 'de' : '');
      setStatus('🌐 ' + (RL === 'ar' ? 'رد بالعربية' : RL === 'de' ? 'Antwort auf Deutsch' : 'réponse'));
      speak(rep.slice(0, 2200));
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
    b.classList.add('on'); b.textContent = '🔴 إيقاف';
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
    b.classList.remove('on'); b.textContent = '🗣️ تحدث';
    setStatus('⚪ في وضع الانتظار');
  }
  function bar(){
    if(document.getElementById('parleBar')) return;
    const d = document.createElement('div');
    d.id = 'parleBar';
    d.innerHTML = '<div class="pl-row">'
      + '<button id="parleBtn" class="pl-btn" title="تحدث مع المنصة الذكية">🗣️ تحدث</button>'
      + '<select id="parleLang" class="pl-sel" title="اللغة">' + LANGS.map(l =>
          '<option value="' + l[0] + '">' + l[1] + '</option>').join('') + '</select>'
      + '<button id="parleMic" class="pl-cfg" title="تحدث الآن">🎙</button>'
      + '<button id="parleCfg" class="pl-cfg" title="إعدادات الصوت">⚙️</button>'
      + '</div><div id="parleSt" class="pl-st">⚪ في وضع الانتظار</div>';
    document.body.prepend(d);
    try{ CONT = localStorage.getItem('dz_voix_cont') === '1'; }catch(e){}
    const eb = document.getElementById('ecouteBtn');
    if(eb) eb.remove();
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
        + '<label><input type="checkbox" id="plCont"' + (CONT ? ' checked' : '')
          + '> 🔁 conversation continue (réécoute auto)</label>'
        + '<button class="btn btn-o btn-sm" id="plTest">🔊 اختبار</button>';
      document.body.appendChild(p);
      fillVoixSel();
      p.querySelector('#plVoix').addEventListener('change', e => {
        try{ localStorage.setItem('dz_voix_ar', e.target.value); }catch(err){}
        try{ speechSynthesis.cancel(); }catch(err){}
        speak('مرحبًا ! هذه هي الصوت التي اخترتها.', null);
      });
      p.querySelector('#plCont').addEventListener('change', e => {
        CONT = e.target.checked;
        try{ localStorage.setItem('dz_voix_cont', CONT ? '1' : '0'); }catch(err){}
        if(CONT && ON && !speaking) listen();
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
