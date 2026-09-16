/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — examen.js
   🎓 MODULE BAC : archive officielle 2010 → 2026 (68 sujets)
   Minuteur officiel 180′ · correction automatique I/8 + II/8 + III/4
   Seuils de préparation (Séance 7) : ≥10 prêt · 7–9,9 à consolider · <7 non prêt
   Résultats strictement locaux (localStorage) — aucune transmission
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const SRC   = 'assets/bdd/bac_archive.json';
  const K_HIST = 'dz_de_bac_historique_v1';
  const PRET = 10, CONS = 7;
  const BAR = { I:8, II:8, III:4 };

  let D = null;
  let vue = 'annees';        /* annees | sujets | epreuve | resultat */
  let anneeSel = null, sujetSel = null;
  let q = '', fTheme = 'tous', fFiliere = 'tous', fEtat = 'tous';
  let SIM = { left:0, tick:null, answers:{}, started:false, sujet:null };

  /* ── Chargement ── */
  async function boot(){
    const box = $('#examBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل أرشيف البكالوريا (68 موضوعاً)…</div>';
      try{
        const r = await fetch(SRC, { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
        (D.sujets || []).forEach(s => { s._n = norm(s.titre + ' ' + s.theme_de + ' ' +
          s.theme_ar + ' ' + s.wilaya + ' ' + s.filiere + ' ' + (s.tags||[]).join(' ')); });
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر تحميل الأرشيف : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
  }

  /* ── Normalisation (ä→ae, أإآ→ا, ة→ه) ── */
  function norm(t){
    return String(t||'').toLowerCase()
      .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c))
      .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
      .replace(/[\u064B-\u065F\u0670]/g,'').replace(/[^a-z0-9\u0600-\u06FF ]/g,' ')
      .replace(/\s+/g,' ').trim();
  }

  /* ── Historique local ── */
  function hist(){ try{ return JSON.parse(localStorage.getItem(K_HIST) || '[]'); }catch(e){ return []; } }
  function histAdd(o){
    const h = hist(); h.push(o);
    try{ localStorage.setItem(K_HIST, JSON.stringify(h.slice(-60))); }catch(e){}
  }
  function dejaFait(id){ return hist().some(h => h.id === id); }
  function meilleur(id){
    const v = hist().filter(h => h.id === id).map(h => h.note);
    return v.length ? Math.max.apply(null, v) : null;
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#examBody'); if(!box) return;
    if(vue === 'annees')   box.innerHTML = vueAnnees();
    if(vue === 'sujets')   box.innerHTML = vueSujets();
    if(vue === 'epreuve')  box.innerHTML = vueEpreuve();
    if(vue === 'resultat') box.innerHTML = vueResultat();
    if(vue === 'epreuve' && SIM.started) startClock();
  }

  function bandeau(){
    const m = D._meta;
    const h = hist();
    const notes = h.map(x => x.note);
    const moy = notes.length ? (notes.reduce((a,b)=>a+b,0)/notes.length) : null;
    return '<div class="card exam-hero">' +
      '<div><div class="ch-badge">🎓 أرشيف البكالوريا — ' + esc(m.source) + '</div>' +
        '<h2><span class="de-display">Abitur-Archiv</span> · ' + m.annee_min + ' → ' + m.annee_max + '</h2>' +
        '<div class="ch-sub">' + m.nombre_sujets + ' موضوعاً · 4 مواضيع لكل سنة · ' +
        'المدة الرسمية ' + Math.round(m.duree_officielle/60) + ' ساعات · السلّم /' + m.bareme.total + '</div></div>' +
      '<div class="eh-stats">' +
        st('📚', m.nombre_sujets, 'موضوع') +
        st('🗓️', m.nombre_annees, 'دورة') +
        st('🧩', (D.themes||[]).length, 'محور') +
        st('✍️', h.length, 'محاولة') +
        st('📊', moy === null ? '—' : moy.toFixed(1), 'معدّلك') +
        st('🏆', moy === null ? '—' : readiness(moy).l.replace(/^[^\s]+\s/,''), 'جاهزيتك') +
      '</div></div>' +
      '<div class="onglets">' +
        ong('annees','🗓️ الدورات') + ong('sujets','📄 المواضيع') +
        (sujetSel ? ong('epreuve','✍️ الإجابة') : '') +
      '</div>' +
      '<div class="privacy">🔒 <b>سرّية تامة</b> (منهج الحصة 7) — نتائجك تُحفظ على جهازك فقط. ' +
        'العتبات الرسمية : <b>≥' + PRET + ' جاهز ✅</b> · <b>' + CONS + '–' + (PRET-0.1) +
        ' يحتاج تثبيت ⚠️</b> · <b>&lt;' + CONS + ' غير جاهز ❌</b></div>';
    function st(i,n,l){ return '<div class="eh-st"><div class="eh-n">' + n + '</div>' +
      '<div class="eh-l">' + l + '</div><div>' + i + '</div></div>'; }
    function ong(id,lbl){ return '<button class="ong' + (vue===id?' on':'') + '" data-exong="' + id + '">' + lbl + '</button>'; }
  }

  function readiness(t){
    if(t === null || t === undefined) return { k:'non_note', l:'○ غير منقّط', c:'' };
    if(t >= PRET) return { k:'pret', l:'✅ جاهز', c:'ok' };
    if(t >= CONS) return { k:'a_consolider', l:'⚠️ يحتاج تثبيت', c:'mid' };
    return { k:'non_pret', l:'❌ غير جاهز', c:'ko' };
  }

  /* ══════ VUE 1 : les cycles ══════ */
  function vueAnnees(){
    let h = bandeau();
    const done = {};
    hist().forEach(x => { done[x.id] = Math.max(done[x.id] || 0, x.note); });

    h += '<div class="annees-grid">';
    (D.annees || []).forEach(a => {
      const sj = (D.sujets || []).filter(s => s.annee === a.annee);
      const faits = sj.filter(s => done[s.id] !== undefined);
      const best = faits.length ? Math.max.apply(null, faits.map(s => done[s.id])) : null;
      const r = readiness(best);
      h += '<button class="annee" data-annee="' + a.annee + '">' +
        '<div class="an-y de-display">' + a.annee + '</div>' +
        '<div class="an-l">BAC ' + a.annee + '</div>' +
        '<div class="an-m">' + a.sujets + ' مواضيع · ' + a.candidats.toLocaleString('fr-FR') + ' مترشّح</div>' +
        '<div class="an-s">📊 ' + a.moyenne + '/20 · ✅ ' + a.taux + '%</div>' +
        (faits.length ? '<div class="an-b ' + r.c + '">' + faits.length + '/' + sj.length +
          ' منجزة · أفضل ' + best.toFixed(1) + '</div>'
          : '<div class="an-b nn">لم تُنجز بعد</div>') +
        '</button>';
    });
    h += '</div>';

    h += '<div class="card"><h2>🧩 المحاور الأكثر وروداً في البكالوريا</h2><div class="themes">' +
      (D.themes || []).map(t =>
        '<div class="theme"><span class="th-de de-display">' + esc(t.de) + '</span>' +
        '<span class="th-ar">' + esc(t.ar) + '</span>' +
        '<span class="wbar sm"><i style="width:' + (t.n / (D.themes[0].n||1) * 100) + '%"></i></span>' +
        '<span class="th-n">' + t.n + '</span></div>').join('') + '</div></div>';

    h += '<div class="card"><h2>📜 محاولاتك السابقة</h2>' + tableauHist() + '</div>';
    return h;
  }

  function tableauHist(){
    const h = hist();
    if(!h.length) return '<p style="color:var(--m);font-size:13px">لا توجد محاولات بعد — اختر دورة وابدأ.</p>';
    return '<table class="bareme"><tr><th>#</th><th>الموضوع</th><th>النتيجة</th>' +
      '<th>الجاهزية</th><th>الوقت المستعمل</th><th>التاريخ</th></tr>' +
      h.slice().reverse().map((x,i) => {
        const r = readiness(x.note);
        return '<tr><td class="de-in">' + (h.length - i) + '</td>' +
          '<td style="text-align:right">' + esc(x.titre) + '</td>' +
          '<td class="rep-v ' + r.c + '">' + x.note.toFixed(1) + '/20</td>' +
          '<td>' + r.l + '</td><td class="de-in">' + (x.temps || '—') + '</td>' +
          '<td class="de-in">' + esc(x.date) + '</td></tr>';
      }).join('') + '</table>';
  }

  /* ══════ VUE 2 : les sujets ══════ */
  function vueSujets(){
    let h = bandeau();
    const list = filtrer();
    h += '<div class="filters"><div class="filters-h"><b>🔎 تصفية المواضيع</b>' +
      '<span class="result-n">' + list.length + '</span></div>' +
      '<div class="frow">' +
        fld('🔍 بحث', 'search', '<input id="xQ" type="search" value="' + esc(q) + '" ' +
            'placeholder="2019 · Passiv · المواطنة · Oran…">') +
        fld('🗓️ الدورة', 'annee', sel('annee', [null].concat((D.annees||[]).map(a=>a.annee)),
            anneeSel, a => a === null ? 'كل الدورات' : 'BAC ' + a)) +
      '</div><div class="frow">' +
        fld('🧩 المحور', 'theme', sel('theme', ['tous'].concat((D.themes||[]).map(t=>t.de)), fTheme)) +
        fld('🎓 الشعبة', 'filiere', sel('filiere', ['tous'].concat(D.filieres||[]), fFiliere,
            x => x === 'tous' ? 'كل الشعب' : x)) +
        fld('📝 الحالة', 'etat', sel('etat', ['tous','fait','pas_fait'], fEtat,
            x => ({tous:'الكل', fait:'✅ منجزة', pas_fait:'⏳ لم تُنجز'}[x] || x))) +
      '</div>' +
      '<div class="chips">' + (D.annees||[]).slice(0,8).map(a =>
        '<span class="fchip' + (anneeSel === a.annee ? ' on' : '') + '" data-quick="' + a.annee + '">BAC ' +
        a.annee + '</span>').join('') +
        '<span class="fchip' + (anneeSel === null ? ' on' : '') + '" data-quick="all">كل الدورات</span></div>' +
      '</div>';

    if(!list.length){
      h += '<div class="card empty"><div class="empty-i">🔍</div><h3>لا توجد مواضيع مطابقة</h3>' +
        '<p>جرّب دورة أخرى أو أعد ضبط المرشّحات.</p></div>';
      return h;
    }

    h += '<div class="sujets">';
    list.forEach(s => {
      const m = meilleur(s.id);
      const r = readiness(m);
      h += '<article class="sujet" data-sujet="' + esc(s.id) + '">' +
        '<div class="sj-y de-display">' + s.annee + '</div>' +
        '<div class="sj-b">' +
          '<div class="sj-t">' + esc(s.titre) + (dejaFait(s.id) ? ' <span class="chip ok">✅ منجز</span>' : '') + '</div>' +
          '<div class="sj-de de-display">' + esc(s.titre_de) + '</div>' +
          '<div class="sj-th">🧩 ' + esc(s.theme_de) + ' — ' + esc(s.theme_ar) + '</div>' +
          '<div class="fiche-meta">' +
            mc('🗓️', 'دورة ' + s.annee) + mc('📄', s.session_label) +
            mc('📍', s.code_wilaya + ' · ' + s.wilaya) + mc('🎓', s.filiere) +
            mc('⏱️', Math.round(s.duree_minutes/60) + ' ساعات') +
            mc('🧮', '/' + s.bareme) + mc('⚖️', 'معامل ×' + s.coefficient) +
            mc('🌍', 'CEFR ' + s.niveau_cefr) +
          '</div>' +
          '<div class="chips" style="margin-top:8px">' +
            (s.grammaire||[]).map(g => '<span class="fchip on">' + esc(g) + '</span>').join('') + '</div>' +
        '</div>' +
        '<div class="sj-r">' +
          (m !== null ? '<div class="sj-n ' + r.c + '">' + m.toFixed(1) + '<span>/20</span></div>' +
                        '<div class="rchip ' + r.c + '">' + r.l + '</div>'
                      : '<div class="sj-n nn">—</div><div class="rchip">○ غير منجز</div>') +
          '<button class="btn btn-p btn-sm">✍️ ابدأ الإجابة</button>' +
        '</div></article>';
    });
    h += '</div>';
    function mc(i,v){ return '<span class="mchip">' + i + ' <b>' + esc(v) + '</b></span>'; }
    function fld(lbl, key, inner){ return '<div class="fld2"><span>' + lbl + '</span>' + inner + '</div>'; }
    function sel(key, vals, cur, fmt){
      return '<select data-xsel="' + key + '">' + vals.map(v =>
        '<option value="' + (v === null ? '' : esc(v)) + '"' +
        (String(v) === String(cur) ? ' selected' : '') + '>' +
        esc(fmt ? fmt(v) : v) + '</option>').join('') + '</select>';
    }
    return h;
  }

  function filtrer(){
    const t = norm(q);
    return (D.sujets || []).filter(s => {
      if(anneeSel !== null && s.annee !== anneeSel) return false;
      if(fTheme !== 'tous' && s.theme_de !== fTheme) return false;
      if(fFiliere !== 'tous' && s.filiere !== fFiliere) return false;
      if(fEtat === 'fait' && !dejaFait(s.id)) return false;
      if(fEtat === 'pas_fait' && dejaFait(s.id)) return false;
      if(t && s._n.indexOf(t) === -1) return false;
      return true;
    }).sort((a,b) => (b.annee - a.annee) || (a.session - b.session));
  }

  /* ══════ VUE 3 : l'épreuve ══════ */
  function vueEpreuve(){
    const s = sujetSel;
    let h = '<div class="card exam-head">' +
      '<div><div class="ch-badge">🎓 ' + esc(s.session_label) + ' · دورة ' + s.annee + '</div>' +
      '<h2>' + esc(s.theme_de) + ' <span class="pill">/20</span></h2>' +
      '<div class="ch-sub">' + esc(s.theme_ar) + ' · ' + esc(s.wilaya) + ' · ' +
        esc(s.filiere) + ' · معامل ×' + s.coefficient + ' · CEFR ' + s.niveau_cefr + '</div></div>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<button class="btn btn-o btn-sm" data-exong="sujets">↩️ المواضيع</button>' +
        '<button class="btn btn-g btn-sm" id="xCorrige">✅ التصحيح النموذجي</button>' +
        (SIM.started ? '' : '<button class="btn btn-p btn-sm" id="xStart">⏱️ ابدأ بظروف حقيقية (180 د)</button>') +
      '</div></div>';

    if(SIM.started){
      h += '<div class="timer"><div><b>🎓 ظروف الامتحان الرسمية</b>' +
        '<div style="font-size:11.5px;color:var(--m)">المدة ' + Math.round(s.duree_minutes/60) +
        ' ساعات · لا يمكن الإيقاف المؤقت</div></div>' +
        '<div class="timer-t" id="clock">' + fmt(SIM.left) + '</div>' +
        '<button class="btn btn-g btn-sm" id="xSubmit">📤 سلّم الورقة</button></div>';
    } else {
      h += '<div class="privacy">📖 وضع <b>المطالعة</b> : اقرأ الموضوع بحرية. اضغط ' +
        '« ⏱️ ابدأ بظروف حقيقية » لتشغيل المؤقّت الرسمي (180 دقيقة) والتصحيح الآلي.</div>';
    }

    s.parties.forEach(p => {
      h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + esc(p.titre) + '</b>' +
        '<span class="note">' + p.points + ' pts</span></div><div class="part-b">';
      if(p.texte) h += '<div class="sujet-box">' + esc(p.texte) + '</div>';
      p.questions.forEach(qq => {
        const a = SIM.answers[qq.id];
        h += '<div class="q" data-xq="' + qq.id + '"><div class="q-t">' +
          '<span class="q-n">' + qq.id + '</span>' + esc(qq.q || qq.type) +
          ' <span class="note" style="font-size:11px">' + qq.pts + ' pt' + (qq.pts>1?'s':'') + '</span></div>';
        if(qq.type === 'vf'){
          h += '<div class="opts">' + ['Richtig (صحيح)','Falsch (خطأ)'].map((o,i) =>
            '<button class="opt' + (a !== undefined && +a === i ? ' ok' : '') + '" data-xvf="' + i + '">' +
            o + '</button>').join('') + '</div>';
        } else if(qq.type === 'qcm'){
          h += '<div class="opts">' + qq.opts.map((o,i) =>
            '<button class="opt' + (a !== undefined && +a === i ? ' ok' : '') + '" data-xqcm="' + i + '">' +
            esc(o) + '</button>').join('') + '</div>';
        } else if(qq.type === 'txt'){
          h += '<input class="txt-in" style="min-height:44px" data-xtxt="' + qq.id + '" value="' +
            esc(a || '') + '" placeholder="…">';
        } else if(qq.type === 'redac'){
          h += '<textarea class="txt-in" data-xred="' + qq.id + '" placeholder="In Algerien diskutieren viele Menschen…">' +
            esc(a || '') + '</textarea>';
          if(qq.grille) h += '<table class="bareme"><tr><th>معيار التصحيح الرسمي</th><th>النقطة</th></tr>' +
            qq.grille.map(g => '<tr><td>' + esc(g[0]) + '</td><td>' + g[1] + '</td></tr>').join('') +
            '<tr style="background:rgba(61,220,132,.1)"><td><b>المجموع</b></td><td><b>4</b></td></tr></table>';
        }
        h += '</div>';
      });
      h += '</div></div>';
    });

    h += '<div style="display:flex;gap:11px;flex-wrap:wrap">' +
      (SIM.started ? '<button class="btn btn-g" id="xSubmit2">📤 سلّم الورقة واطلب التصحيح</button>' : '') +
      '<button class="btn btn-o" id="xCorrige2">✅ عرض التصحيح النموذجي</button>' +
      '<button class="btn btn-o" id="xPrint">🖨️ طباعة الموضوع</button></div>';
    return h;
  }

  function fmt(sec){
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
    const p = n => (n<10?'0':'') + n;
    return (h ? p(h) + ':' : '') + p(m) + ':' + p(s);
  }

  function startClock(){
    clearInterval(SIM.tick);
    SIM.tick = setInterval(() => {
      SIM.left--;
      const c = $('#clock');
      if(c){
        c.textContent = fmt(SIM.left);
        c.className = 'timer-t' + (SIM.left <= 300 ? ' dang' : (SIM.left <= 1800 ? ' warn' : ''));
      }
      if(SIM.left <= 0){
        clearInterval(SIM.tick);
        if(window.DZ && DZ.toast) DZ.toast('⏰ انتهى الوقت الرسمي!','ko');
        corriger(true);
      }
    }, 1000);
  }

  function startExam(){
    const s = sujetSel; if(!s) return;
    SIM = { left: s.duree_minutes * 60, tick:null, answers:{}, started:true, sujet:s,
            t0: Date.now() };
    vue = 'epreuve'; render();
    if(window.DZ && DZ.toast) DZ.toast('🎓 بدأت الامتحان — بالتوفيق! (' +
      Math.round(s.duree_minutes/60) + ' ساعات)','ok');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ══════ CORRECTION AUTOMATIQUE ══════ */
  function corriger(auto){
    const s = SIM.sujet || sujetSel; if(!s) return;
    clearInterval(SIM.tick);
    $$('[data-xtxt]').forEach(i => { if(i.value.trim()) SIM.answers[i.dataset.xtxt] = i.value.trim(); });
    $$('[data-xred]').forEach(i => { if(i.value.trim()) SIM.answers[i.dataset.xred] = i.value.trim(); });

    const sc = { I:0, II:0, III:0 };
    const detail = [];
    s.parties.forEach(p => {
      p.questions.forEach(qq => {
        const a = SIM.answers[qq.id];
        let ok = false, got = '';
        if(qq.type === 'vf'){
          ok = a !== undefined && ((+a === 0) === (qq.rep === 'Richtig'));
          got = a === undefined ? '—' : (+a === 0 ? 'Richtig' : 'Falsch');
        } else if(qq.type === 'qcm'){
          ok = a !== undefined && +a === qq.a;
          got = a === undefined ? '—' : qq.opts[+a];
        } else if(qq.type === 'txt'){
          const n = norm(a);
          ok = (qq.key || []).some(k => n.indexOf(norm(k)) !== -1);
          got = a || '—';
        } else if(qq.type === 'redac'){
          /* auto-évaluation guidée sur la grille officielle */
          const txt = String(a || '');
          const mots = txt.trim().split(/\s+/).filter(Boolean).length;
          const rel = /,?\s*(der|die|das)\s+\w+\s*(ist|hat|war|wird|kann|muss)/i.test(txt) ||
                      /,\s*(die|der|das)\b/i.test(txt);
          const k2  = /(hätte|wäre|würde|könnte|müsste)/i.test(txt);
          const pas = /(wird|werden|wurde|worden)\s+\w*(t|en)\b/i.test(txt);
          let v = 0;
          if(mots >= 20) v += 1.0; else if(mots >= 10) v += 0.5;
          if(mots >= 60) v += 0.5;
          if(rel) v += 0.5;
          if(k2)  v += 0.5;
          if(pas) v += 0.5;
          if(mots >= 40 && /[.!?]$/.test(txt.trim())) v += 0.5;
          v = Math.min(4, Math.round(v * 2) / 2);
          sc[p.id] += v;
          detail.push({ id:qq.id, type:'redac', ok:v >= 2.5, got:v.toFixed(1) + '/4',
                        rep:'grille officielle', mots:mots, rel:rel, k2:k2, pas:pas });
          return;
        }
        if(ok) sc[p.id] += qq.pts;
        if(qq.type !== 'redac'){
          detail.push({ id:qq.id, type:qq.type, ok:ok, got:got,
                        rep: qq.type === 'qcm' ? qq.opts[qq.a] : qq.rep,
                        just: qq.just || qq.why || '', pts: qq.pts });
        }
      });
    });

    Object.keys(sc).forEach(k => { sc[k] = Math.round(Math.min(BAR[k], sc[k]) * 10) / 10; });
    const note = Math.round((sc.I + sc.II + sc.III) * 10) / 10;
    const temps = SIM.started ? fmt(Math.max(0, (Date.now() - (SIM.t0||Date.now())) / 1000)) : '—';

    histAdd({ id:s.id, titre:s.titre, annee:s.annee, note:note,
              I:sc.I, II:sc.II, III:sc.III, temps:temps, auto:!!auto,
              date:new Date().toLocaleString('fr-DZ'), at:Date.now() });

    SIM = { left:0, tick:null, answers:{}, started:false, sujet:s,
            last:{ note:note, sc:sc, detail:detail, temps:temps, auto:!!auto } };
    vue = 'resultat'; render();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ══════ VUE 4 : le résultat ══════ */
  function vueResultat(){
    const s = sujetSel, L = SIM.last;
    if(!s || !L) { vue = 'sujets'; return vueSujets(); }
    const r = readiness(L.note);
    const cls = L.note >= 16 ? 'ok' : (L.note >= PRET ? 'ok' : (L.note >= CONS ? 'md' : 'ko'));
    const msg = L.note >= 16 ? 'ممتاز — Sehr gut! 🏆' :
                L.note >= PRET ? 'جاهز للبكالوريا ✅' :
                L.note >= CONS ? 'يحتاج تثبيتاً قبل الامتحان ⚠️' :
                                 'غير جاهز بعد — راجع المحاور ❌';

    let h = '<div class="card result"><div class="mini-i">🎓</div>' +
      '<div class="result-n ' + cls + '">' + L.note.toFixed(1) +
        '<span style="font-size:22px;color:var(--m)">/20</span></div>' +
      '<div class="result-l">' + msg + '</div>' +
      '<div style="font-size:12px;color:var(--m);margin-top:7px">' + esc(s.titre) + ' · ' +
        esc(s.theme_de) + ' · الوقت المستعمل <span class="de-in">' + L.temps + '</span>' +
        (L.auto ? ' · ⏰ تسليم تلقائي' : '') + '</div>' +
      '<div class="secret">🔒 نتيجة سرّية — محفوظة على جهازك فقط، لم تُرسل لأي خادم</div>' +
      '</div>';

    h += '<div class="card"><h2>📊 التفصيل حسب السلّم الرسمي</h2>' +
      '<div class="bareme-strip">' +
        ['I','II','III'].map(k => '<span class="bs' + (k==='III'?' tot':'') + '"><b class="de-in">' + k +
          '</b> ' + ({I:'فهم المكتوب',II:'اللغة',III:'إنتاج كتابي'}[k]) + ' <i>' +
          L.sc[k].toFixed(1) + '/' + BAR[k] + '</i></span>').join('') +
        '<span class="bs tot"><b>= ' + L.note.toFixed(1) + '/20</b></span></div>' +
      '<div class="rbar" style="margin-top:15px">' +
        ['I','II','III'].map(k => '<span class="rseg ' + (L.sc[k]/BAR[k] >= 0.7 ? 'ok' :
          (L.sc[k]/BAR[k] >= 0.45 ? 'mid' : 'ko')) + '" style="width:' +
          (BAR[k]/20*100) + '%">' + L.sc[k].toFixed(1) + '</span>').join('') + '</div>' +
      '<div class="rleg"><span>🟢 ≥70% · 🟡 45–69% · 🔴 &lt;45% — proportionnelle au barème ' +
        '(I/8 · II/8 · III/4)</span></div></div>';

    h += '<div class="card"><h2>📝 التصحيح التفصيلي</h2>' +
      '<table class="bareme"><tr><th>السؤال</th><th>إجابتك</th><th>الجواب الصحيح</th>' +
      '<th>النقطة</th></tr>' +
      L.detail.map(d => '<tr><td class="de-in"><b>' + d.id + '</b></td>' +
        '<td style="color:' + (d.ok ? 'var(--g)' : 'var(--r)') + '">' +
          (d.ok ? '✅ ' : '❌ ') + esc(String(d.got)) + '</td>' +
        '<td style="color:var(--m)">' + esc(String(d.rep)) + '</td>' +
        '<td>' + (d.pts !== undefined ? (d.ok ? d.pts : 0) + '/' + d.pts : d.got) + '</td></tr>').join('') +
      '</table></div>';

    h += '<div class="corrige"><h3>✅ التصحيح النموذجي الرسمي</h3>' +
      '<div class="sujet-box" style="background:transparent;border:none;padding:0">' +
      esc(s.corrige) + '</div></div>';

    const redac = s.parties.filter(p => p.id === 'III')[0];
    if(redac && redac.questions[0] && redac.questions[0].modele){
      h += '<div class="card"><h2>✍️ نموذج الإنتاج الكتابي</h2>' +
        '<div class="reading">' + esc(redac.questions[0].modele) + '</div></div>';
    }

    h += '<div class="card"><h2>🧭 خارطة الطريق حسب نتيجتك</h2>' + planAction(L) + '</div>';

    h += '<div style="display:flex;gap:11px;flex-wrap:wrap">' +
      '<button class="btn btn-p" id="xAgain">🔁 إعادة هذا الموضوع</button>' +
      '<button class="btn btn-o" data-exong="sujets">📄 موضوع آخر</button>' +
      '<button class="btn btn-w" id="xWa">💬 أرسل النتيجة للأستاذ</button>' +
      '<button class="btn btn-o" id="xDl">📥 تصدير النتيجة</button></div>';
    return h;
  }

  function planAction(L){
    const rows = [];
    if(L.sc.I < BAR.I * 0.7)
      rows.push(['📖', 'الفهم المكتوب ضعيف (' + L.sc.I + '/8)',
                 'تدرّب على استخراج المعلومات من نص — الحصص 5 و 7 + مواضيع ' +
                 'Leseverstehen في المكتبة.']);
    if(L.sc.II < BAR.II * 0.7)
      rows.push(['🔤', 'اللغة ضعيفة (' + L.sc.II + '/8)',
                 'راجع مكتبة القواعد : ' + (sujetSel.grammaire||[]).slice(0,3).join(' · ') +
                 ' — ثم أعد تمارين الحصص 2 و 3 و 4.']);
    if(L.sc.III < BAR.III * 0.6)
      rows.push(['✍️', 'الإنتاج الكتابي ضعيف (' + L.sc.III + '/4)',
                 'احفظ بنية : Einleitung → Hauptteil (3 حجج) → Schluss. ' +
                 'استعمل relative + Konjunktiv II + Passiv كما تطلب التعليمة.']);
    if(!rows.length)
      rows.push(['🏆', 'النتيجة ممتازة', 'حافظ على الإيقاع : موضوع واحد كل أسبوع + '
                 + 'مراجعة القواعد 15 دقيقة يومياً.']);
    const rd = L.detail.filter(d => d.type === 'redac')[0];
    if(rd){
      rows.push(['📋', 'تحليل الإنتاج الكتابي',
        (rd.mots || 0) + ' كلمة · relative ' + (rd.rel ? '✅' : '❌') +
        ' · Konjunktiv II ' + (rd.k2 ? '✅' : '❌') + ' · Passiv ' + (rd.pas ? '✅' : '❌')]);
    }
    return '<div class="plan">' + rows.map(r =>
      '<div class="plan-i"><div class="pl-i">' + r[0] + '</div><div><b>' + esc(r[1]) + '</b>' +
      '<div style="font-size:12.5px;color:var(--m);margin-top:3px">' + esc(r[2]) + '</div></div></div>').join('') +
      '</div>';
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    const ong = ev.target.closest('[data-exong]');
    if(ong){
      if(SIM.started && ong.dataset.exong !== 'epreuve'){
        if(!confirm('الامتحان جارٍ — الخروج سيلغي المؤقّت. متابعة؟')) return;
        clearInterval(SIM.tick); SIM.started = false;
      }
      vue = ong.dataset.exong; render();
      window.scrollTo({top:0, behavior:'smooth'}); return;
    }
    const an = ev.target.closest('[data-annee]');
    if(an){ anneeSel = +an.dataset.annee; vue = 'sujets'; render();
      window.scrollTo({top:0, behavior:'smooth'}); return; }
    const qk = ev.target.closest('[data-quick]');
    if(qk){ anneeSel = qk.dataset.quick === 'all' ? null : +qk.dataset.quick; render(); return; }
    const sj = ev.target.closest('[data-sujet]');
    if(sj){
      const s = (D.sujets||[]).filter(x => x.id === sj.dataset.sujet)[0];
      if(s){ sujetSel = s; anneeSel = null; vue = 'epreuve';
        SIM = { left:0, tick:null, answers:{}, started:false, sujet:null };
        render(); window.scrollTo({top:0, behavior:'smooth'}); }
      return;
    }
    if(ev.target.closest('#xStart')){ startExam(); return; }
    if(ev.target.closest('#xSubmit, #xSubmit2')){
      if(!confirm('تسليم الورقة وطلب التصحيح الآلي؟')) return;
      corriger(false); return;
    }
    if(ev.target.closest('#xCorrige, #xCorrige2')){
      const m = $('#modal'), c = $('#modalCard');
      if(!m || !c || !sujetSel) return;
      c.innerHTML = '<div class="modal-h"><div><span class="badge bac">🎓 BAC ' +
        sujetSel.annee + ' · ' + esc(sujetSel.session_label) + '</span>' +
        '<h2 style="margin:9px 0 3px;font-family:var(--ff-ar-display);font-size:19px">' +
        '✅ التصحيح النموذجي الرسمي</h2><div class="fiche-de">' + esc(sujetSel.theme_de) +
        '</div></div><button class="close-x" id="mClose">✕</button></div>' +
        '<div class="modal-b"><div class="sujet-box">' + esc(sujetSel.corrige) + '</div>' +
        '<div class="privacy" style="margin-top:13px">💡 النصيحة : حاول الإجابة بنفسك أولاً، ' +
        'ثم قارن. التعلّم من الخطأ أسرع من الحفظ.</div></div>';
      m.hidden = false; document.body.style.overflow = 'hidden'; return;
    }
    if(ev.target.closest('#xPrint')){ window.print(); return; }
    if(ev.target.closest('#xAgain')){
      SIM = { left:0, tick:null, answers:{}, started:false, sujet:null };
      vue = 'epreuve'; render(); window.scrollTo({top:0, behavior:'smooth'}); return;
    }
    if(ev.target.closest('#xWa')){
      const L = SIM.last || {};
      const txt = encodeURIComponent('السلام عليكم أستاذ خريف، نتيجتي في ' +
        (sujetSel ? sujetSel.titre : 'موضوع بكالوريا') + ' : ' +
        (L.note !== undefined ? L.note.toFixed(1) : '—') + '/20 ' +
        '(I:' + (L.sc?L.sc.I:'—') + ' II:' + (L.sc?L.sc.II:'—') + ' III:' + (L.sc?L.sc.III:'—') + ')');
      window.open('https://wa.me/213555577931?text=' + txt, '_blank'); return;
    }
    if(ev.target.closest('#xDl')){
      const L = SIM.last || {};
      const t = 'أرشيف البكالوريا — اللغة الألمانية\n' +
        'الموضوع : ' + (sujetSel ? sujetSel.titre + ' (' + sujetSel.id + ')' : '—') + '\n' +
        'المحور  : ' + (sujetSel ? sujetSel.theme_de + ' — ' + sujetSel.theme_ar : '—') + '\n' +
        'النتيجة : ' + (L.note !== undefined ? L.note.toFixed(1) : '—') + '/20\n' +
        'التفصيل: I ' + (L.sc?L.sc.I:'—') + '/8 · II ' + (L.sc?L.sc.II:'—') + '/8 · III ' +
          (L.sc?L.sc.III:'—') + '/4\n' +
        'الجاهزية: ' + readiness(L.note).l + '\n' +
        'الوقت   : ' + (L.temps || '—') + '\n' +
        'التاريخ : ' + new Date().toLocaleString('fr-DZ') + '\n' +
        '──────────────\n' +
        (L.detail || []).map(d => (d.ok ? '[OK] ' : '[--] ') + d.id + ' → ' + d.got +
          ' (صواب: ' + d.rep + ')').join('\n');
      try{
        const blob = new Blob(['\uFEFF' + t], { type:'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'bac-' + (sujetSel ? sujetSel.id : 'resultat') + '.txt';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        if(window.DZ && DZ.toast) DZ.toast('📥 تم تنزيل النتيجة','ok');
      }catch(e){ if(window.DZ && DZ.toast) DZ.toast('⚠️ تعذّر التصدير','ko'); }
      return;
    }

    const vf = ev.target.closest('[data-xvf]');
    if(vf){ const qq = vf.closest('[data-xq]');
      if(qq){ $$('[data-xvf]', qq).forEach(o => o.classList.remove('ok'));
        vf.classList.add('ok'); SIM.answers[qq.dataset.xq] = +vf.dataset.xvf; } return; }
    const qc = ev.target.closest('[data-xqcm]');
    if(qc){ const qq = qc.closest('[data-xq]');
      if(qq){ $$('[data-xqcm]', qq).forEach(o => o.classList.remove('ok'));
        qc.classList.add('ok'); SIM.answers[qq.dataset.xq] = +qc.dataset.xqcm; } return; }
  });

  document.addEventListener('input', ev => {
    const t = ev.target.closest('[data-xtxt]');
    if(t){ SIM.answers[t.dataset.xtxt] = t.value.trim(); return; }
    const r = ev.target.closest('[data-xred]');
    if(r){ SIM.answers[r.dataset.xred] = r.value.trim(); return; }
    const s = ev.target.closest('#xQ');
    if(s){ q = s.value; clearTimeout(window._xt);
      window._xt = setTimeout(() => { if(vue === 'sujets') render(); }, 240); return; }
  });

  document.addEventListener('change', ev => {
    const s = ev.target.closest('[data-xsel]');
    if(!s) return;
    const k = s.dataset.xsel, v = s.value;
    if(k === 'annee')   anneeSel = v === '' ? null : +v;
    if(k === 'theme')   fTheme = v;
    if(k === 'filiere') fFiliere = v;
    if(k === 'etat')    fEtat = v;
    render();
  });

  window.addEventListener('beforeunload', ev => {
    if(SIM.started){ ev.preventDefault(); ev.returnValue = ''; }
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'examen') boot(); });
  window.renderExamen = boot;
  window.DZ_EXAM = { boot:boot, render:render, readiness:readiness,
                     PRET:PRET, CONS:CONS, BAR:BAR, hist:hist, corriger:corriger };
})();
