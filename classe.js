/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — classe.js
   القاعة الافتراضية : الحصة القادمة · emploi du temps · leçons ·
   présence · notes · messages · أساتذة
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const K_MSG = 'dz_de_msg_lus_v1';
  let D = null;
  let onglet = 'apercu';

  async function boot(){
    const box = $('#classeBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل بيانات القسم…</div>';
      try{
        const r = await fetch('assets/bdd/classe.json', { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر تحميل القسم : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
  }

  function section(){
    const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
    const id = s ? s.classe : '2AS-3';
    return (D.sections || []).filter(x => x.id === id)[0] || D.sections[2] || D.sections[0];
  }

  function render(){
    const box = $('#classeBody'); if(!box) return;
    const sec = section();
    box.innerHTML =
      header(sec) +
      '<div class="onglets" id="clOng">' +
        ong('apercu','📋 نظرة عامة') + ong('emploi','📅 الرزنامة') +
        ong('lecons','📖 الدروس') + ong('presence','✅ الحضور') +
        ong('notes','📊 النقاط') + ong('messages','💬 الرسائل') +
        ong('profs','👨‍🏫 الأساتذة') +
      '</div>' +
      '<div id="clContenu"></div>';
    paint();
  }

  function ong(id, lbl){
    return '<button class="ong' + (onglet === id ? ' on' : '') + '" data-ong="' + id + '">' + lbl + '</button>';
  }

  function header(sec){
    const p = D.prochaine || {};
    return '<div class="card classe-hero">' +
      '<div class="ch-l">' +
        '<div class="ch-badge">🇩🇿 ' + esc(D._meta.etablissement) + ' · ' + esc(D._meta.annee_scolaire) + '</div>' +
        '<h2>قسم ' + esc(sec.ar) + ' <span class="pill">' + sec.eleves + ' تلميذ</span></h2>' +
        '<div class="ch-sub">' + esc(sec.filiere) + ' · ' + esc(sec.niveau) +
          ' · ' + esc(sec.salle) + ' · الأستاذ الرئيسي : <b>' + esc(sec.prof_principal) + '</b></div>' +
      '</div>' +
      '<div class="ch-r">' +
        '<div class="ch-next">' +
          '<div class="ch-k">🕐 الحصة القادمة</div>' +
          '<div class="ch-v de-display">' + esc(p.lecon || '—') + '</div>' +
          '<div class="ch-m">' + esc(p.date || '') + ' · ' + esc(p.heure || '') +
            ' · ' + (p.duree || 0) + ' د · ' + esc(p.salle || '') + '</div>' +
          '<span class="live-pill' + (p.statut === 'en_cours' ? ' on' : '') + '">' +
            '<i></i> ' + (p.statut === 'en_cours' ? 'جارية الآن' : 'مجدولة') + '</span>' +
        '</div>' +
        '<button class="btn btn-p" data-go="live">📹 انضم إلى القاعة المباشرة</button>' +
        '<button class="btn btn-o" id="btnRejoindre">🖥️ معاينة القاعة</button>' +
      '</div></div>';
  }

  function paint(){
    const c = $('#clContenu'); if(!c) return;
    if(onglet === 'apercu')   c.innerHTML = vueApercu();
    if(onglet === 'emploi')   c.innerHTML = vueEmploi();
    if(onglet === 'lecons')   c.innerHTML = vueLecons();
    if(onglet === 'presence') c.innerHTML = vuePresence();
    if(onglet === 'notes')    c.innerHTML = vueNotes();
    if(onglet === 'messages') c.innerHTML = vueMessages();
    if(onglet === 'profs')    c.innerHTML = vueProfs();
    if(onglet === 'messages') bindMessages();
  }

  function vueApercu(){
    const sec = section();
    const emp = (D.emploi && D.emploi[sec.id]) || [];
    const p = D.prochaine || {};
    const nonLus = (D.messages || []).filter(m => !m.lu).length;
    const moy = moyenne();
    return '' +
    '<div class="grid3">' +
      stat('📖', D.lecons.length, 'درس في البرنامج') +
      stat('✅', tauxPresence() + '%', 'نسبة الحضور') +
      stat('📊', moy + '/20', 'المعدّل الفصلي') +
      stat('💬', nonLus, 'رسالة غير مقروءة') +
      stat('👥', sec.eleves, 'تلميذ في القسم') +
      stat('👨‍🏫', D.profs.length, 'أستاذ متاح') +
    '</div>' +
    '<div class="card"><h2>🕐 الحصة القادمة — <span class="de-display">' + esc(p.lecon || '') + '</span></h2>' +
      '<div class="info-grid">' +
        info('📅 التاريخ', p.date) + info('⏰ الساعة', p.heure) +
        info('⏱️ المدة', (p.duree || 0) + ' دقيقة') + info('🏫 القاعة', p.salle) +
        info('👨‍🏫 الأستاذ', p.prof) + info('🧩 الموضوع', p.theme) +
      '</div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<button class="btn btn-p" id="btnRejoindre2">📹 انضم الآن</button>' +
        '<button class="btn btn-o" data-go="seances">📚 راجع الحصص</button>' +
        '<button class="btn btn-o" data-go="grammaire">📘 القواعد</button>' +
      '</div></div>' +
    '<div class="card"><h2>📅 رزنامة الأسبوع</h2>' + emp.slice(0,4).map(c => creneau(c)).join('') +
      '<button class="btn btn-o btn-block" data-ong="emploi">📅 الرزنامة الكاملة</button></div>' +
    '<div class="card"><h2>📊 آخر النقاط</h2>' + (D.notes || []).slice(0,3).map(noteRow).join('') +
      '<button class="btn btn-o btn-block" data-ong="notes">📊 كل النقاط</button></div>';
    function stat(i, n, l){
      return '<div class="stat"><div class="mini-i">' + i + '</div>' +
             '<div class="stat-n">' + n + '</div><div class="stat-l">' + l + '</div></div>';
    }
  }

  function creneau(c){
    const j = D.jours[c.jour], jd = D.jours_de[c.jour];
    const all = c.matiere.indexOf('الألمانية') !== -1;
    return '<div class="cren' + (all ? ' all' : '') + '">' +
      '<div class="cren-j"><b>' + esc(j) + '</b><span class="de-display">' + esc(jd) + '</span></div>' +
      '<div class="cren-h">' + esc(c.debut) + ' → ' + esc(c.fin) + '</div>' +
      '<div class="cren-b"><b>' + esc(c.matiere) + '</b>' +
        '<div class="cren-l de-display">' + esc(c.lecon) + '</div>' +
        '<div class="cren-p">' + esc(c.prof) + ' · ' + esc(c.salle) +
        ' · <span class="chip' + (c.type === 'فرض' ? ' ex' : '') + '">' + esc(c.type) + '</span></div></div></div>';
  }

  function vueEmploi(){
    const sec = section();
    const emp = (D.emploi && D.emploi[sec.id]) || [];
    let h = '<div class="card"><h2>📅 الرزنامة الأسبوعية — قسم ' + esc(sec.ar) + '</h2>';
    for(let j = 0; j < 5; j++){
      const jour = emp.filter(c => c.jour === j);
      h += '<div class="jour-lbl"><b>' + esc(D.jours[j]) + '</b>' +
           '<span class="de-display">' + esc(D.jours_de[j]) + '</span></div>';
      h += jour.length ? jour.map(creneau).join('')
                       : '<div class="cren vide">— لا توجد حصص —</div>';
    }
    h += '</div>';
    return h;
  }

  function vueLecons(){
    let h = '<div class="card"><h2>📖 الدروس — Lektionen</h2>';
    h += (D.lecons || []).map(l => {
      const st = l.statut;
      const lbl = st === 'termine' ? ['✅ مكتمل','ok'] : st === 'en_cours' ? ['🔴 جاري','ex'] : ['🔒 قادم',''];
      return '<div class="lecon" data-lecon="' + l.n + '">' +
        '<div class="l-num' + (st === 'termine' ? ' done' : '') + '">' + l.n + '</div>' +
        '<div class="l-b"><div class="l-t de-display">Lektion ' + l.n + ' — ' + esc(l.de) + '</div>' +
        '<div class="l-ar">' + esc(l.ar) + ' · ⏱️ ' + l.duree + ' د · ' + esc(l.date) +
          (l.heure ? ' · ' + esc(l.heure) : '') + '</div>' +
        '<div class="l-p">' + esc(l.prof) + '</div>' +
        '<div class="chips" style="margin-top:7px">' +
          (l.grammaire || []).map(g => '<span class="fchip on">' + esc(g) + '</span>').join('') +
        '</div></div>' +
        '<span class="chip ' + lbl[1] + '">' + lbl[0] + '</span></div>';
    }).join('');
    h += '</div>';
    return h;
  }

  function vuePresence(){
    const t = tauxPresence();
    let h = '<div class="card"><h2>✅ سجلّ الحضور</h2>' +
      '<div class="progress-wrap"><div class="progress" style="width:' + t + '%"></div></div>' +
      '<div class="progress-lbl">نسبة الحضور : <b>' + t + '%</b> — ' +
        (D.presence || []).filter(p => p.statut === 'present').length + '/' +
        (D.presence || []).length + ' حصص</div></div>';
    h += '<div class="card">' + (D.presence || []).map(p => {
      const ic = p.statut === 'present' ? '✅' : (p.statut === 'absent_justifie' ? '🟡' : '❌');
      const tx = p.statut === 'present' ? 'حاضر' : (p.statut === 'absent_justifie' ? 'غائب مبرَّر' : 'غائب');
      return '<div class="rep-row"><div><b>' + ic + ' ' + esc(p.lecon) + '</b>' +
        '<div style="font-size:11.5px;color:var(--m)">' + esc(p.jour) + ' ' + esc(p.date) +
        (p.note ? ' · ' + esc(p.note) : '') + '</div></div>' +
        '<div style="text-align:left"><div class="rep-v ' +
        (p.statut === 'present' ? 'ok' : 'ko') + '">' + tx + '</div>' +
        '<div style="font-size:11px;color:var(--m)" class="de-in">' + esc(p.heure) + '</div></div></div>';
    }).join('') + '</div>';
    return h;
  }

  function vueNotes(){
    const m = moyenne();
    let h = '<div class="card"><h2>📊 كشف النقاط</h2>' +
      '<div class="result" style="padding:14px"><div class="result-n ' +
        (m >= 14 ? 'ok' : m >= 10 ? 'md' : 'ko') + '">' + m + '</div>' +
      '<div class="result-l">المعدّل الفصلي العام /20</div></div></div>';
    h += '<div class="card"><table class="bareme"><tr><th>المادة / النوع</th><th>التاريخ</th>' +
      '<th>النقطة</th><th>المعامل</th></tr>' +
      (D.notes || []).map(n => '<tr><td style="text-align:right"><b>' + esc(n.matiere) + '</b><br>' +
        '<span style="font-size:11.5px;color:var(--m)">' + esc(n.type) + '</span></td>' +
        '<td>' + esc(n.date) + '</td><td class="' +
        (n.note >= 10 ? 'rep-v ok' : 'rep-v ko') + '">' + n.note + '/' + n.bareme + '</td>' +
        '<td>×' + n.coef + '</td></tr>').join('') + '</table></div>';
    h += '<div class="card"><h2>💬 ملاحظات الأساتذة</h2>' +
      (D.notes || []).filter(n => n.appreciation).map(n =>
        '<div class="rep-row"><div><b>' + esc(n.type) + '</b>' +
        '<div style="font-size:12px;color:var(--m)">' + esc(n.appreciation) + '</div></div>' +
        '<span class="rep-v ' + (n.note >= 10 ? 'ok' : 'ko') + '">' + n.note + '/20</span></div>').join('') +
      '</div>';
    return h;
  }

  function vueMessages(){
    const lus = lusSet();
    return '<div class="card"><h2>💬 رسائل الأساتذة والإدارة</h2>' +
      (D.messages || []).map((m, i) =>
        '<div class="msgrow' + (lus[i] ? ' lu' : '') + '" data-msg="' + i + '">' +
        '<div class="msg-av">' + esc(m.init) + '</div>' +
        '<div class="msg-b"><div class="msg-h"><b>' + esc(m.de) + '</b>' +
          (m.urgent ? '<span class="chip ex">عاجل</span>' : '') +
          '<span class="msg-d">' + esc(m.date) + '</span></div>' +
        '<div class="msg-t">' + esc(m.texte) + '</div></div>' +
        (lus[i] ? '' : '<span class="dot-new"></span>') + '</div>').join('') +
      '<a class="btn btn-w btn-block" target="_blank" rel="noopener" href="' +
        'https://wa.me/213555577931?text=' +
        encodeURIComponent('السلام عليكم أستاذ خريف، لدي سؤال حول الدرس.') +
      '">💬 راسل الأستاذ عبر واتساب</a></div>';
  }

  function vueProfs(){
    let h = '<div class="card"><h2>👨‍🏫 أساتذة المنصّة</h2>' +
      '<p style="color:var(--m);font-size:13px;margin-bottom:14px">' +
      'احجز حصّة خاصة مع أحد أساتذتنا — الأسعار بالدينار الجزائري للساعة الواحدة.</p>';
    h += '<div class="profs">' + (D.profs || []).map(p =>
      '<div class="profc' + (p.featured ? ' feat' : '') + '">' +
      '<div class="pc-av">' + esc(p.init) + '</div>' +
      '<div class="pc-b"><div class="pc-t">' + esc(p.nom) +
        (p.featured ? ' <span class="chip ok">⭐ المؤسس</span>' : '') + '</div>' +
      '<div class="pc-m">🇩🇿 ' + esc(p.ville) + ' · ' + p.exp + ' سنة خبرة · ' +
        '★ ' + p.note.toFixed(1) + ' (' + p.avis + ' رأي)</div>' +
      '<div class="pc-d">' + esc(p.desc) + '</div>' +
      '<div class="chips" style="margin:8px 0">' +
        p.specialites.map(s => '<span class="fchip on">' + esc(s) + '</span>').join('') + '</div>' +
      '<div class="pc-f"><div class="pc-p"><b>' + p.prix.toLocaleString('fr-FR') + '</b> د.ج / ساعة</div>' +
      '<a class="btn btn-' + (p.dispo ? 'g' : 'o') + ' btn-sm" target="_blank" rel="noopener" href="' +
        'https://wa.me/213555577931?text=' +
        encodeURIComponent('السلام عليكم، أريد حجز حصّة مع ' + p.nom) + '">' +
        (p.dispo ? '📅 احجز' : '⏳ غير متاح') + '</a></div></div></div>').join('') + '</div></div>';
    return h;
  }

  function bindMessages(){
    $$('[data-msg]').forEach(el => el.addEventListener('click', () => {
      const i = el.dataset.msg, s = lusSet(); s[i] = true;
      try{ localStorage.setItem(K_MSG, JSON.stringify(s)); }catch(e){}
      el.classList.add('lu');
      const d = el.querySelector('.dot-new'); if(d) d.remove();
    }));
  }
  function lusSet(){
    try{ return JSON.parse(localStorage.getItem(K_MSG) || '{}'); }catch(e){ return {}; }
  }

  function tauxPresence(){
    const p = D.presence || [];
    if(!p.length) return 0;
    return Math.round(p.filter(x => x.statut === 'present').length / p.length * 100);
  }
  function moyenne(){
    const n = D.notes || [];
    if(!n.length) return '—';
    let s = 0, c = 0;
    n.forEach(x => { s += (x.note / x.bareme) * 20 * x.coef; c += x.coef; });
    return Math.round(s / c * 10) / 10;
  }
  function info(k, v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                             '<div class="info-v">' + esc(v == null ? '—' : v) + '</div></div>'; }
  function noteRow(n){
    return '<div class="rep-row"><div><b>' + esc(n.type) + '</b>' +
      '<div style="font-size:11.5px;color:var(--m)">' + esc(n.date) + '</div></div>' +
      '<span class="rep-v ' + (n.note >= 10 ? 'ok' : 'ko') + '">' + n.note + '/20</span></div>';
  }

  function rejoindre(){
    const p = D.prochaine || {};
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div><h2 style="margin:0;font-family:var(--ff-ar-display)">' +
      '📹 القاعة الافتراضية</h2><div class="fiche-de">' + esc(p.lecon || '') + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' +
        '<div class="salle">' +
          '<div class="salle-vid"><div class="salle-av">👨‍🏫</div>' +
          '<div class="salle-nom">' + esc(p.prof || 'الأستاذ خريف أحمد') + '</div>' +
          '<span class="live-pill on"><i></i> مباشر</span></div>' +
          '<div class="salle-moi"><div class="salle-av sm">🧑‍🎓</div>' +
          '<div class="salle-nom">أنت</div></div>' +
        '</div>' +
        '<div class="info-grid" style="margin-top:15px">' +
          info('📅 التاريخ', p.date) + info('⏰ الساعة', p.heure) +
          info('⏱️ المدة', (p.duree || 0) + ' د') + info('🏫 القاعة', p.salle) +
          info('👥 الحاضرون', (p.eleves || 0) + ' تلميذ') + info('🧩 الموضوع', p.theme) +
        '</div>' +
        '<div class="privacy">🎥 القاعة الافتراضية تعمل داخل القسم بإشراف الأستاذ. ' +
          'لا يُسجَّل أي فيديو ولا يُخزَّن على أي خادم.</div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
          '<button class="btn btn-p btn-block" id="btnCam">🎤🎥 تشغيل الميكرو والكاميرا</button>' +
          '<a class="btn btn-w btn-block" target="_blank" rel="noopener" href="' +
            'https://wa.me/213555577931?text=' +
            encodeURIComponent('السلام عليكم، أريد الانضمام إلى الحصة الافتراضية : ' + (p.lecon || '')) +
          '">💬 طلب رابط الحصة عبر واتساب</a>' +
        '</div></div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    const bc = $('#btnCam');
    if(bc) bc.addEventListener('click', () => {
      bc.textContent = '✅ الميكرو والكاميرا يعملان';
      bc.disabled = true; bc.className = 'btn btn-g btn-block';
    });
  }

  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-ong]');
    if(o){ onglet = o.dataset.ong;
      $$('.ong').forEach(x => x.classList.toggle('on', x.dataset.ong === onglet));
      paint(); return; }
    const r = ev.target.closest('#btnRejoindre, #btnRejoindre2');
    if(r){ rejoindre(); return; }
    const l = ev.target.closest('[data-lecon]');
    if(l && window.DZ_BDD_UI && window.DZ) {
      const n = +l.dataset.lecon;
      const lec = (D.lecons || []).filter(x => x.n === n)[0];
      if(lec) ficheLecon(lec);
      return;
    }
  });

  function ficheLecon(l){
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div><span class="badge composition">Lektion ' + l.n + '</span>' +
      '<h2 style="margin:9px 0 3px;font-family:var(--ff-de-display);direction:ltr;text-align:right">' +
      esc(l.de) + '</h2><div class="fiche-t">' + esc(l.ar) + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b">' +
        '<div class="info-grid">' +
          info('👨‍🏫 الأستاذ', l.prof) + info('📅 التاريخ', l.date) +
          info('⏱️ المدة', l.duree + ' دقيقة') + info('⏰ الساعة', l.heure || '—') +
          info('📈 الحالة', l.statut === 'termine' ? '✅ مكتمل' :
                (l.statut === 'en_cours' ? '🔴 جاري' : '🔒 قادم')) +
        '</div>' +
        '<div style="margin-bottom:13px"><b>🎯 الأهداف</b>' +
          '<ul style="margin:8px 22px;font-size:13.5px;color:var(--m)">' +
          (l.objectifs || []).map(o => '<li>' + esc(o) + '</li>').join('') + '</ul></div>' +
        '<div style="margin-bottom:13px"><b>🔑 المفردات — Wortschatz</b><div class="lex" style="margin-top:9px">' +
          (l.vocabulaire || []).map(v => '<div class="lex-i"><div><div class="lex-de">' + esc(v[0]) +
            '</div><div class="lex-ar">' + esc(v[1]) + '</div></div>' +
            '<button class="speak" data-speak="' + esc(v[0]) + '">🔊</button></div>').join('') + '</div></div>' +
        '<div><b>📘 القواعد المرتبطة</b><div class="chips" style="margin-top:8px">' +
          (l.grammaire || []).map(g => '<span class="fchip on">' + esc(g) + '</span>').join('') + '</div></div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:16px">' +
          '<button class="btn btn-o btn-block" data-go="grammaire">📘 افتح مكتبة القواعد</button>' +
          '<button class="btn btn-g btn-block" data-go="seances">📚 الحصص التفاعلية</button>' +
        '</div></div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
  }

  document.addEventListener('dz:view', e => { if(e.detail === 'classe') boot(); });
  window.renderClasse = boot;
  window.DZ_CLASSE = { boot:boot, render:render, moyenne:moyenne, tauxPresence:tauxPresence };
})();
