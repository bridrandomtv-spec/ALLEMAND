/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — live.js
   📹 القاعة الافتراضية المباشرة · Virtuelles Klassenzimmer (Live)
   Flux vidéo · chat de classe · tableau blanc · présence · agenda
   Compte à rebours · réactions · narration allemande · IA de réponse
   Aucun flux n'est enregistré — chat strictement local (localStorage)
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = m => { if(window.DZ && DZ.toast) DZ.toast(m); };

  const SRC = 'assets/bdd/live.json';
  const K_CHAT = 'dz_de_live_chat_v1';
  const K_ETAT = 'dz_de_live_etat_v1';

  let D = null;
  let panneau = 'chat';
  let planche = 0;
  let tradOn = false;
  let triPresence = 'statut';
  let reste = 0, tReste = null, tVie = null;
  let mic = false, cam = false, main = false;

  /* ── Chargement ── */
  async function boot(){
    const box = $('#liveBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ الاتصال بالقاعة الافتراضية…</div>';
      try{
        const r = await fetch(SRC, { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
        reste = (D.session.restant_minutes || 0) * 60;
        const et = etat();
        mic = !!et.mic; cam = !!et.cam; main = !!et.main;
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر الاتصال بالقاعة : ' +
                        esc(e.message) + '</div>';
        return;
      }
    }
    render();
    demarrerMinuteur();
    demarrerVie();
  }

  function etat(){
    try{ return JSON.parse(localStorage.getItem(K_ETAT) || '{}'); }catch(e){ return {}; }
  }
  function memEtat(){
    try{ localStorage.setItem(K_ETAT, JSON.stringify({mic:mic, cam:cam, main:main})); }catch(e){}
  }
  function chatLocal(){
    try{ return JSON.parse(localStorage.getItem(K_CHAT) || '[]'); }catch(e){ return []; }
  }
  function chatComplet(){ return (D.chat || []).concat(chatLocal()); }
  function pushChat(m){
    const l = chatLocal(); l.push(m);
    try{ localStorage.setItem(K_CHAT, JSON.stringify(l.slice(-120))); }catch(e){}
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#liveBody'); if(!box) return;
    const s = D.session;
    box.innerHTML =
      entete(s) +
      '<div class="live-grid">' +
        '<div class="live-main">' +
          grilleVideo(s) +
          controles() +
          '<div class="card citation">' +
            '<div class="cit-i">💡</div><div><div class="cit-t">« ' + esc(s.citation) + ' »</div>' +
            '<div class="cit-a">— ' + esc(s.citation_auteur) + '</div>' +
            '<div class="cit-de de-display">' + esc(s.citation_de) + '</div></div>' +
          '</div>' +
        '</div>' +
        '<aside class="live-side">' +
          '<div class="onglets side-ong">' +
            ong('chat','💬 المحادثة') + ong('tableau','📽️ اللوح') +
            ong('presence','👥 الحضور') + ong('agenda','📋 البرنامج') +
          '</div>' +
          '<div id="panChat" class="pan'    + (panneau==='chat'?'':' hid')    + '">' + panChat()    + '</div>' +
          '<div id="panTableau" class="pan' + (panneau==='tableau'?'':' hid') + '">' + panTableau() + '</div>' +
          '<div id="panPresence" class="pan'+ (panneau==='presence'?'':' hid')+ '">' + panPresence()+ '</div>' +
          '<div id="panAgenda" class="pan'  + (panneau==='agenda'?'':' hid')  + '">' + panAgenda()  + '</div>' +
        '</aside>' +
      '</div>';
    if(panneau === 'chat') scrollChat();
    function ong(id,lbl){
      return '<button class="ong' + (panneau===id?' on':'') + '" data-pan="' + id + '">' + lbl + '</button>';
    }
  }

  function entete(s){
    return '<div class="card live-head">' +
      '<div class="lh-l">' +
        '<span class="live-badge"><i></i> مباشر الآن</span>' +
        '<h2><span class="de-display">' + esc(s.lecon_de) + '</span></h2>' +
        '<div class="lh-sub">' + esc(s.lecon_ar) + ' · ' + esc(s.theme) + '</div>' +
        '<div class="chips" style="margin-top:9px">' +
          '<span class="sec-pill">🏫 ' + esc(s.section_ar) + ' · ' + esc(s.salle) + '</span>' +
          '<span class="sec-pill or">🕐 ' + esc(s.jour) + ' ' + esc(s.debut) + ' → ' + esc(s.fin) + '</span>' +
          '<span class="sec-pill rg">👥 ' + s.presents + '/' + s.effectif + ' حاضر</span>' +
          (s.mains_levees ? '<span class="sec-pill">🙋 ' + s.mains_levees + ' يد مرفوعة</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="lh-r">' +
        '<div class="lh-prof"><div class="pc-av">' + esc(s.prof.init) + '</div>' +
          '<div><div class="lh-pn">' + esc(s.prof.nom) + '</div>' +
          '<div class="lh-ps">' + esc(s.prof.specialite) + '</div>' +
          '<span class="live-on"><i></i> متصل الآن · ' + esc(s.prof.langue) + '</span></div></div>' +
        '<div class="lh-clock"><div class="lh-ck" id="resteClock">' + fmt(reste) + '</div>' +
          '<div class="lh-cl">الوقت المتبقّي</div></div>' +
      '</div></div>';
  }

  function grilleVideo(s){
    const presents = (D.eleves || []).filter(e => e.statut === 'present' || e.statut === 'retard');
    const t = s.prof;
    let h = '<div class="video-zone">';
    h += '<div class="vid big">' +
      '<div class="vid-av prof">👨‍🏫</div>' +
      '<div class="vid-nom"><b>' + esc(t.nom) + '</b><span class="de-display"> · spricht</span></div>' +
      '<span class="live-on sm"><i></i> يتحدث الآن</span>' +
      '<div class="vid-tools"><span title="ميكروفون">🎙️</span><span title="كاميرا">📷</span>' +
      '<span title="مشاركة الشاشة">🖥️</span></div>' +
      '<div class="vid-wave"><i></i><i></i><i></i><i></i><i></i></div></div>';
    h += '<div class="vid-grid">';
    const moi = { init:'أم', nom:'أنت', mic:mic, cam:cam, main:main, connexion:'excellente' };
    h += vignette(moi, true);
    presents.slice(0, 11).forEach(e => { h += vignette(e, false); });
    const resteN = presents.length - 11;
    if(resteN > 0) h += '<div class="vid more">+' + resteN + '<span>تلميذ آخر</span></div>';
    h += '</div></div>';
    return h;
    function vignette(e, moiFlag){
      const cls = 'vid sm' + (moiFlag ? ' moi' : '') + (e.cam ? '' : ' nocam');
      return '<div class="' + cls + '">' +
        '<div class="vid-av">' + (e.cam ? (moiFlag ? '🧑‍🎓' : '🎥') : esc(e.init || e.initiales)) + '</div>' +
        '<div class="vid-nom sm">' + esc(e.nom || e.nom_complet) +
          (e.main || e.main_levee ? ' 🙋' : '') + '</div>' +
        '<div class="vid-ic">' +
          '<span class="' + (e.micro || e.mic ? 'on' : 'off') + '">🎙️</span>' +
          '<span class="' + (e.cam ? 'on' : 'off') + '">📷</span>' +
          '<span class="q ' + esc(e.connexion || 'bonne') + '" title="' + esc(e.connexion || '') + '"></span>' +
        '</div></div>';
    }
  }

  function controles(){
    return '<div class="ctrl-bar">' +
      '<button class="ctrl' + (mic?' on':'') + '" id="btnMicro" title="الميكروفون">🎙️<span>' +
        (mic?'مفتوح':'مغلق') + '</span></button>' +
      '<button class="ctrl' + (cam?' on':'') + '" id="btnCam" title="الكاميرا">📷<span>' +
        (cam?'مفتوحة':'مغلقة') + '</span></button>' +
      '<button class="ctrl' + (main?' on':'') + '" id="btnMain" title="رفع اليد">🙋<span>' +
        (main?'يد مرفوعة':'رفع اليد') + '</span></button>' +
      '<div class="ctrl-react">' + (D.reactions || []).map(r =>
        '<button class="rct" data-react="' + esc(r) + '">' + r + '</button>').join('') + '</div>' +
      '<button class="ctrl" id="btnPlein" title="ملء الشاشة">⛶<span>ملء الشاشة</span></button>' +
      '<button class="ctrl danger" id="btnQuitter" title="مغادرة">📵<span>مغادرة</span></button>' +
    '</div>';
  }

  /* ── Panneau CHAT ── */
  function panChat(){
    const msgs = chatComplet();
    const epingles = msgs.filter(m => m.epingle);
    return '<div class="chat-tools">' +
        '<button class="btn btn-o btn-sm' + (tradOn?' on':'') + '" id="btnTrad">🌐 الترجمة العربية</button>' +
        '<span class="ct-n">' + msgs.length + ' رسالة</span>' +
      '</div>' +
      (epingles.length ? '<div class="pinned">' + epingles.slice(-2).map(m =>
        '<div class="pin"><span class="pin-i">📌</span><div><b>' + esc(m.de) + '</b>' +
        '<div>' + fmtTexte(m.texte) + '</div></div></div>').join('') + '</div>' : '') +
      '<div class="live-chat" id="liveChat">' + msgs.map(bulle).join('') + '</div>' +
      '<form class="live-in" id="liveForm">' +
        '<input type="text" id="liveInput" autocomplete="off" ' +
          'placeholder="اكتب بالألمانية أو بالعربية… (Enter للإرسال)">' +
        '<button type="submit" class="btn btn-p btn-sm">➤</button>' +
      '</form>' +
      '<div class="chat-hint">💡 اكتب جملة ألمانية وسيصحّحها الأستاذ فوراً</div>';
  }

  function bulle(m){
    const moi = m.role === 'moi';
    const cls = 'lmsg ' + (moi ? 'me' : (m.role === 'prof' ? 'prof' :
                 (m.role === 'admin' ? 'admin' : 'eleve')));
    let t = '<div class="' + cls + '">' +
      (moi ? '' : '<div class="lm-av ' + m.role + '">' + esc(m.init) + '</div>') +
      '<div class="lm-b"><div class="lm-h"><b>' + esc(m.de) + '</b>' +
        (m.epingle ? ' <span class="pin-t">📌</span>' : '') +
        '<span class="lm-t">' + esc(m.temps) + '</span></div>' +
      '<div class="lm-x">' + fmtTexte(m.texte) + '</div>' +
      (m.trad ? '<div class="lm-tr' + (tradOn ? '' : ' hid') + '">🇩🇿 ' + esc(m.trad) + '</div>' : '') +
      '</div></div>';
    return t;
  }

  function fmtTexte(s){
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                 .replace(/&lt;span class='de-in'&gt;([\s\S]*?)&lt;\/span&gt;/g,
                          '<span class="de-in">$1</span>')
                 .replace(/&lt;b&gt;([\s\S]*?)&lt;\/b&gt;/g, '<b>$1</b>');
  }

  function scrollChat(){
    const c = $('#liveChat'); if(c) c.scrollTop = c.scrollHeight;
  }

  function envoyer(txt){
    const v = String(txt || '').trim(); if(!v) return;
    const s = D.session;
    const moi = (window.AUTH && AUTH.session) ? AUTH.session() : { nom:'أنت' };
    const init = String(moi.nom || 'أ').trim().slice(0, 2);
    const now = new Date();
    const m = { de: moi.nom || 'أنت', init: init, role: 'moi',
                temps: ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2),
                texte: v, trad: '', lang: /[a-zA-Zäöüß]/.test(v) ? 'de' : 'ar', epingle: false };
    pushChat(m);
    rafraichirChat();
    setTimeout(() => repondre(v, s.prof), 500 + Math.random() * 700);
  }

  function repondre(v, prof){
    const n = String(v).toLowerCase();
    let rep = null;
    (D.reponses_auto || []).forEach(r => {
      if(rep) return;
      if(r.k.some(k => n.indexOf(k.toLowerCase()) !== -1)) rep = r.r;
    });
    if(!rep && window.DZ && DZ.PROF && DZ.PROF.corriger){
      const c = DZ.PROF.corriger(v);
      if(c) rep = c.msg;
    }
    if(!rep) rep = (D.reponse_defaut || ['…'])[Math.floor(Math.random() * (D.reponse_defaut || []).length)];
    const now = new Date();
    pushChat({ de: prof.nom, init: prof.init, role: 'prof',
               temps: ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2),
               texte: rep, trad: '', lang: 'mixte', epingle: false });
    rafraichirChat();
    if(window.DZ && DZ.speak){
      const m = String(rep).match(/<span class=["']de-in["']>([^<]+)<\/span>/);
      if(m) DZ.speak(m[1]);
    }
  }

  function rafraichirChat(){
    const pan = $('#panChat'); if(!pan) return;
    pan.innerHTML = panChat();
    const f = $('#liveForm');
    if(f) f.addEventListener('submit', ev => { ev.preventDefault(); soumettre(); });
    scrollChat();
    lierChat();
  }

  function lierChat(){
    const bt = $('#btnTrad');
    if(bt) bt.addEventListener('click', basculerTrad);
  }

  function soumettre(){
    const i = $('#liveInput'); if(!i) return;
    const v = i.value; envoyer(v); i.value = ''; i.focus();
  }

  function basculerTrad(){
    tradOn = !tradOn;
    $$('.lm-tr').forEach(e => e.classList.toggle('hid', !tradOn));
    const b = $('#btnTrad'); if(b) b.classList.toggle('on', tradOn);
    toast(tradOn ? '🌐 الترجمة العربية مُظهَّرة' : '🌐 الترجمة مخفيّة');
  }

  /* ── Panneau TABLEAU BLANC ── */
  function panTableau(){
    const p = (D.planches || [])[planche] || (D.planches || [])[0];
    if(!p) return '<div class="empty">لا توجد لوحات.</div>';
    const ex = (p.exemples || []).map(e => Array.isArray(e)
      ? '<div class="tb-ex"><span class="de-in">' + esc(e[0]) + '</span>' +
        '<button class="speak" data-speak="' + esc(e[0]) + '">🔊</button>' +
        (e[1] ? '<span class="tb-ar">' + esc(e[1]) + '</span>' : '') + '</div>'
      : '<div class="tb-ex"><span class="de-in">' + esc(e) + '</span></div>').join('');
    return '<div class="tb-nav">' +
        '<button class="pg" id="tbPrev"' + (planche===0?' disabled':'') + '>›</button>' +
        '<span class="tb-n">لوحة ' + p.n + ' / ' + (D.planches||[]).length + '</span>' +
        '<button class="pg" id="tbNext"' + (planche >= (D.planches||[]).length-1?' disabled':'') + '>‹</button>' +
      '</div>' +
      '<div class="tb-board">' +
        '<div class="tb-h"><span class="de-display">' + esc(p.titre_de) + '</span>' +
        '<span class="tb-ar">' + esc(p.titre_ar) + '</span></div>' +
        '<div class="tb-c">' + fmtTexte(p.contenu) + '</div>' +
        '<div class="tb-exs">' + ex + '</div>' +
        (p.regle ? '<div class="tb-regle">📌 ' + fmtTexte(p.regle) + '</div>' : '') +
      '</div>' +
      '<div class="tb-dots">' + (D.planches||[]).map((x,i) =>
        '<button class="dot' + (i===planche?' on':'') + '" data-planche="' + i + '"></button>').join('') +
      '</div>' +
      '<div class="tb-act">' +
        '<button class="btn btn-o btn-sm" id="tbLire">🔊 اقرأ اللوحة</button>' +
        '<button class="btn btn-o btn-sm" id="tbPlein">⛶ توسيع</button>' +
      '</div>';
  }

  function peindrePlanche(i){
    const n = (D.planches || []).length;
    if(!n) return;
    planche = ((i % n) + n) % n;
    const pan = $('#panTableau'); if(!pan) return;
    pan.innerHTML = panTableau();
  }

  /* ── Panneau PRÉSENCE ── */
  function panPresence(){
    const s = D.session;
    const l = (D.eleves || []).slice().sort(cmp);
    return '<div class="pr-kpi">' +
        kpi('👥', s.effectif, 'مسجّل') + kpi('✅', s.presents, 'حاضر') +
        kpi('⏰', s.retards, 'متأخّر') + kpi('❌', s.absents, 'غائب') +
        kpi('🙋', l.filter(e=>e.main_levee).length, 'يد مرفوعة') +
        kpi('🎙️', l.filter(e=>e.micro).length, 'ميكروفون') +
      '</div>' +
      '<div class="pr-filtres"><span class="pr-l">الترتيب :</span>' +
        ['statut','nom','participation','connexion'].map(k =>
          '<button class="fchip' + (triPresence===k?' on':'') + '" data-tri="' + k + '">' +
          ({statut:'الحالة',nom:'الاسم',participation:'المشاركة',connexion:'جودة الاتصال'}[k]) +
          '</button>').join('') + '</div>' +
      '<div class="pr-list">' + l.map(e => {
        const st = { present:['✅ حاضر','ok'], retard:['⏰ متأخّر','mid'],
                     absent:['❌ غائب','ko'], absent_justifie:['🟡 غائب مبرَّر','mid'] }[e.statut]
                   || ['—',''];
        const q = { excellente:'q4', bonne:'q3', moyenne:'q2', faible:'q1' }[e.connexion] || 'q3';
        return '<div class="pr-i" data-eleve="' + esc(e.id) + '">' +
          '<div class="pr-av">' + esc(e.initiales) + (e.main_levee ? '<span class="pr-hand">🙋</span>' : '') + '</div>' +
          '<div class="pr-b"><div class="pr-n">' + esc(e.nom_complet) + '</div>' +
          '<div class="pr-s">' + esc(e.matricule) + ' · ' + esc(e.ville) + '</div></div>' +
          '<div class="pr-r">' +
            '<span class="pr-st ' + st[1] + '">' + st[0] + '</span>' +
            '<span class="pr-ic">' +
              '<i class="' + (e.micro?'on':'off') + '">🎙️</i>' +
              '<i class="' + (e.cam?'on':'off') + '">📷</i>' +
              '<i class="q ' + q + '" title="' + esc(e.connexion) + ' · ' + e.ping_ms + ' ms"></i>' +
            '</span>' +
            '<span class="pr-p" title="المشاركة">💬 ' + e.participation + '</span>' +
          '</div></div>';
      }).join('') + '</div>';
  }
  function kpi(i,n,l){ return '<div class="pk"><div class="pk-n">' + n + '</div>' +
    '<div class="pk-l">' + l + '</div><div class="pk-i">' + i + '</div></div>'; }
  function cmp(a,b){
    if(triPresence === 'nom') return a.nom_complet.localeCompare(b.nom_complet, 'fr');
    if(triPresence === 'participation') return (b.participation||0) - (a.participation||0);
    if(triPresence === 'connexion'){
      const o = { excellente:4, bonne:3, moyenne:2, faible:1 };
      return (o[b.connexion]||0) - (o[a.connexion]||0);
    }
    const o = { present:0, main_levee:0, retard:1, absent_justifie:2, absent:3 };
    return (o[a.statut]||9) - (o[b.statut]||9) || a.nom_complet.localeCompare(b.nom_complet, 'fr');
  }

  /* ── Panneau AGENDA ── */
  function panAgenda(){
    const s = D.session;
    const fait = s.agenda.filter(a => a.fait).length;
    return '<div class="ag-prog"><div class="progress-wrap"><div class="progress" style="width:' +
        Math.round(fait/s.agenda.length*100) + '%"></div></div>' +
      '<div class="progress-lbl">' + fait + ' / ' + s.agenda.length + ' مراحل · ' +
        Math.round(fait/s.agenda.length*100) + '%</div></div>' +
      '<div class="ag-list">' + s.agenda.map((a,i) =>
        '<div class="ag-i' + (a.fait?' fait':'') + (i===fait?' now':'') + '">' +
        '<div class="ag-h de-in">' + esc(a.h) + '</div>' +
        '<div class="ag-b"><div class="ag-t">' + (a.fait?'✅ ': i===fait ?'🔴 ':'⏳ ') +
          esc(a.t) + '</div><div class="ag-d">' + a.duree + ' دقيقة</div></div>' +
        '<div class="ag-dot"></div></div>').join('') + '</div>' +
      '<div class="card" style="margin-top:14px;padding:15px"><h3>🎯 أهداف الحصة</h3>' +
      '<ul style="margin:8px 20px;font-size:13px;color:var(--m)">' +
        s.objectifs.map(o => '<li>' + esc(o) + '</li>').join('') + '</ul></div>' +
      '<div class="privacy" style="margin-top:12px">🔒 ' + esc(D._meta.confidentialite) + '</div>';
  }

  /* ── Minuteur de séance ── */
  function fmt(sec){
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec/60), s = sec%60;
    return (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
  }
  function demarrerMinuteur(){
    clearInterval(tReste);
    tReste = setInterval(tickRestant, 1000);
    tickRestant();
  }
  function tickRestant(){
    if(reste > 0) reste--;
    const c = $('#resteClock');
    if(c){
      c.textContent = fmt(reste);
      c.className = 'lh-ck' + (reste <= 300 ? ' dang' : (reste <= 900 ? ' warn' : ''));
    }
    if(reste === 0){
      clearInterval(tReste);
      toast('🔔 انتهت الحصة — شكراً لمشاركتك!', 'ok');
    }
  }

  /* ── Vie de la classe (simulation légère) ── */
  function demarrerVie(){
    clearInterval(tVie);
    tVie = setInterval(() => {
      if(Math.random() < 0.35) reactionAleatoire();
      if(Math.random() < 0.12) messageAleatoire();
    }, 9000);
  }
  function reactionAleatoire(){
    const rs = D.reactions || [];
    if(!rs.length) return;
    const z = document.createElement('div');
    z.className = 'float-react';
    z.textContent = rs[Math.floor(Math.random() * rs.length)];
    z.style.left = (12 + Math.random() * 76) + '%';
    const v = $('.video-zone');
    if(!v) return;
    v.appendChild(z);
    setTimeout(() => z.remove(), 2600);
  }
  function messageAleatoire(){
    const el = (D.eleves || []).filter(e => e.statut === 'present');
    if(!el.length) return;
    const e = el[Math.floor(Math.random() * el.length)];
    const bank = [
      ['Herr, ich habe eine Frage!','أستاذ، لدي سؤال!'],
      ['Ich verstehe nicht «aufgestanden».','لا أفهم aufgestanden.'],
      ['Können Sie das wiederholen, bitte?','هل يمكنك الإعادة من فضلك؟'],
      ['Ich bin bereit! ✍️','أنا مستعد!'],
      ['Das ist klar, danke!','واضح، شكراً!'],
      ['Um wie viel Uhr ist die Pause?','في أي ساعة الاستراحة؟']
    ];
    const b = bank[Math.floor(Math.random() * bank.length)];
    const now = new Date();
    pushChat({ de: e.nom_complet, init: e.initiales, role: 'eleve',
               temps: ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2),
               texte: b[0], trad: b[1], lang: 'de', epingle: false });
    if(panneau === 'chat') rafraichirChat();
  }

  /* ── Événements ── */
  document.addEventListener('click', ev => {
    const p = ev.target.closest('[data-pan]');
    if(p){ panneau = p.dataset.pan;
      $$('.side-ong .ong').forEach(x => x.classList.toggle('on', x.dataset.pan === panneau));
      $$('.pan').forEach(x => x.classList.add('hid'));
      const t = $('#pan' + panneau.charAt(0).toUpperCase() + panneau.slice(1));
      if(t) t.classList.remove('hid');
      if(panneau === 'chat') scrollChat();
      return; }

    const pl = ev.target.closest('[data-planche]');
    if(pl){ peindrePlanche(+pl.dataset.planche); return; }
    if(ev.target.closest('#tbPrev')){ peindrePlanche(planche - 1); return; }
    if(ev.target.closest('#tbNext')){ peindrePlanche(planche + 1); return; }
    if(ev.target.closest('#tbLire')){
      const p = (D.planches || [])[planche]; if(!p) return;
      const txt = p.titre_de + '. ' + String(p.contenu).replace(/\*\*/g,'') + '. ' +
        (p.exemples||[]).map(e => Array.isArray(e) ? e[0] : e).join('. ');
      if(window.DZ && DZ.speak) DZ.speak(txt);
      toast('🔊 قراءة اللوحة ' + p.n, 'ok'); return;
    }
    if(ev.target.closest('#tbPlein')){
      const b = $('.tb-board'); if(b) b.classList.toggle('plein'); return; }

    const tr = ev.target.closest('[data-tri]');
    if(tr){ triPresence = tr.dataset.tri;
      const pan = $('#panPresence'); if(pan) pan.innerHTML = panPresence(); return; }

    const sp = ev.target.closest('[data-speak]');
    if(sp && window.DZ && DZ.speak){ DZ.speak(sp.dataset.speak);
      sp.classList.add('talk'); setTimeout(() => sp.classList.remove('talk'), 900); return; }

    const rc = ev.target.closest('[data-react]');
    if(rc){ envoyerReaction(rc.dataset.react); return; }

    if(ev.target.closest('#btnMicro')){
      mic = !mic; memEtat(); const b = $('#btnMicro');
      b.classList.toggle('on', mic); b.querySelector('span').textContent = mic ? 'مفتوح' : 'مغلق';
      toast(mic ? '🎙️ الميكروفون مفتوح' : '🔇 الميكروفون مغلق', mic ? 'ok' : ''); return; }
    if(ev.target.closest('#btnCam')){
      cam = !cam; memEtat(); const b = $('#btnCam');
      b.classList.toggle('on', cam); b.querySelector('span').textContent = cam ? 'مفتوحة' : 'مغلقة';
      toast(cam ? '📷 الكاميرا مفتوحة' : '📵 الكاميرا مغلقة', cam ? 'ok' : ''); return; }
    if(ev.target.closest('#btnMain')){
      main = !main; memEtat(); const b = $('#btnMain');
      b.classList.toggle('on', main);
      b.querySelector('span').textContent = main ? 'يد مرفوعة' : 'رفع اليد';
      toast(main ? '🙋 رفعت يدك — الأستاذ سيرى طلبك' : '✋ أنزلت يدك', main ? 'ok' : '');
      if(main) pushChat({ de:'النظام', init:'🙋', role:'admin',
        temps:new Date().toTimeString().slice(0,5),
        texte:'🙋 ' + ((window.AUTH && AUTH.session) ? AUTH.session().nom : 'تلميذ') +
              ' رفع(ت) يده — في انتظار دور الكلام.', trad:'', lang:'ar', epingle:false });
      if(panneau === 'chat') rafraichirChat();
      return; }
    if(ev.target.closest('#btnPlein')){
      const z = $('.live-grid');
      if(!z) return;
      if(!document.fullscreenElement){ if(z.requestFullscreen) z.requestFullscreen().catch(()=>{}); }
      else if(document.exitFullscreen) document.exitFullscreen();
      return; }
    if(ev.target.closest('#btnQuitter')){
      if(!confirm('مغادرة القاعة الافتراضية؟')) return;
      clearInterval(tReste); clearInterval(tVie);
      if(window.DZ && DZ.go) DZ.go('classe');
      toast('👋 غادرت القاعة — إلى اللقاء', ''); return; }

    const e = ev.target.closest('[data-eleve]');
    if(e && panneau === 'presence'){
      const el = (D.eleves || []).filter(x => x.id === e.dataset.eleve)[0];
      if(el) ficheEleve(el);
      return; }
  });

  function envoyerReaction(r){
    const z = document.createElement('div');
    z.className = 'float-react big'; z.textContent = r;
    z.style.left = '50%';
    const v = $('.video-zone');
    if(v){ v.appendChild(z); setTimeout(() => z.remove(), 2600); }
    toast('💬 أرسلت ' + r + ' إلى القاعة', 'ok');
  }

  function ficheEleve(e){
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    const st = { present:['✅ حاضر','ok'], retard:['⏰ متأخّر','mid'],
                 absent:['❌ غائب','ko'], absent_justifie:['🟡 غائب مبرَّر','mid'] }[e.statut] || ['—',''];
    c.innerHTML = '<div class="modal-h"><div><div class="pc-av" style="width:52px;height:52px">' +
      esc(e.initiales) + '</div>' +
      '<h2 style="margin:9px 0 3px;font-family:var(--ff-ar-display)">' + esc(e.nom_complet) + '</h2>' +
      '<div class="fiche-de de-in">' + esc(e.matricule) + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b"><div class="info-grid">' +
      info('👥 القسم', D.session.section_ar) + info('📍 المدينة', e.ville) +
      info('🚦 الحالة', st[0]) + info('🎙️ الميكروفون', e.micro ? 'مفتوح' : 'مغلق') +
      info('📷 الكاميرا', e.cam ? 'مفتوحة' : 'مغلقة') + info('🙋 اليد', e.main_levee ? 'مرفوعة' : '—') +
      info('📶 الاتصال', e.connexion + ' · ' + e.ping_ms + ' ms') +
      info('💬 المشاركة', String(e.participation)) +
      info('🏆 النقاط', String(e.points)) +
      info('🕐 آخر مداخلة', e.derniere_prise || '—') +
      '</div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px">' +
      '<button class="btn btn-o btn-sm" id="lvMsg">💬 مراسلة</button>' +
      '<button class="btn btn-o btn-sm" id="lvNommer">🎤 إعطاء الكلمة</button>' +
      '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" href="https://wa.me/213555577931?text=' +
      encodeURIComponent('بخصوص التلميذ ' + e.nom_complet + ' (' + e.matricule + ')') +
      '">📱 واتساب الولي</a></div></div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    const nm = $('#lvNommer');
    if(nm) nm.addEventListener('click', () => {
      pushChat({ de:'النظام', init:'🎤', role:'admin',
        temps:new Date().toTimeString().slice(0,5),
        texte:'🎤 الكلمة الآن للتلميذ(ة) ' + e.nom_complet + '. Bitte, sprich!',
        trad:'', lang:'mixte', epingle:false });
      m.hidden = true; document.body.style.overflow = '';
      if(panneau !== 'chat'){ panneau = 'chat'; render(); } else rafraichirChat();
      toast('🎤 أُعطيت الكلمة لـ ' + e.nom_complet, 'ok');
    });
    const ms = $('#lvMsg');
    if(ms) ms.addEventListener('click', () => {
      m.hidden = true; document.body.style.overflow = '';
      panneau = 'chat'; render();
      const i = $('#liveInput'); if(i){ i.value = '@' + e.nom_complet + ' '; i.focus(); }
    });
    function info(k,v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                               '<div class="info-v">' + esc(v == null ? '—' : v) + '</div></div>'; }
  }

  document.addEventListener('submit', ev => {
    if(ev.target.id === 'liveForm'){ ev.preventDefault(); soumettre(); }
  });
  document.addEventListener('input', ev => {
    const i = ev.target.closest('#liveInput');
    if(!i) return;
    /* Enter géré par submit ; ici on garde le focus */
  });
  document.addEventListener('keydown', ev => {
    if(ev.key === 'Enter' && ev.target.id === 'liveInput'){ ev.preventDefault(); soumettre(); }
    if(panneau === 'tableau'){
      if(ev.key === 'ArrowLeft')  peindrePlanche(planche + 1);
      if(ev.key === 'ArrowRight') peindrePlanche(planche - 1);
    }
  });

  /* ── Nettoyage quand on quitte la vue ── */
  document.addEventListener('dz:view', e => {
    if(e.detail === 'live') boot();
    else { clearInterval(tReste); clearInterval(tVie); }
  });
  window.addEventListener('beforeunload', () => { clearInterval(tReste); clearInterval(tVie); });

  window.renderLive = boot;
  window.DZ_LIVE = { boot:boot, render:render, envoyer:envoyer,
                     peindrePlanche:peindrePlanche, basculerTrad:basculerTrad };
})();
