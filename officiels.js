/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — officiels.js
   📄 الفروض الرسمية · Offizielle Kontrollarbeiten
   Archive fidèle : ثانوية الأمير (وهران) · ثانوية منصور (قسنطينة) · + 8 lycées
   Onglets 📄 الفرض / ✅ الحل · saisie interactive · notation I/8 + II/8 + III/4 = /20
   Grille officielle : مضمون 2ن (5 معلومات = 0,4/معلومة) · لغة 2ن
   Réponses strictement locales (localStorage)
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const SRC  = 'assets/bdd/devoirs_officiels.json';
  const K_REP = 'dz_de_officiels_rep_v1';
  const PRET = 10, CONS = 7;
  const WA = '213555577931';

  let D = null;
  let ouvert = null;        /* devoir actuellement ouvert */
  let onglet = 'sujet';     /* sujet | corrige */
  let fTrim = 'tous', fUnite = 'tous', fWilaya = 'tous', fLycee = 'tous', fq = '';

  /* ── Chargement ── */
  async function boot(){
    const box = $('#officielsBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل الفروض الرسمية…</div>';
      try{
        const r = await fetch(SRC, { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر التحميل : ' + esc(e.message) + '</div>';
        return;
      }
    }
    render();
  }

  /* ── Persistance ── */
  function reps(){ try{ return JSON.parse(localStorage.getItem(K_REP) || '{}'); }catch(e){ return {}; } }
  function repsDevoir(id){ return reps()[id] || {}; }
  function saveRep(id, cle, val){
    const all = reps(); all[id] = all[id] || {}; all[id][cle] = val;
    try{ localStorage.setItem(K_REP, JSON.stringify(all)); }catch(e){}
  }

  /* ── Normalisation pour la correction ── */
  function norm(t){
    return String(t||'').toLowerCase().trim()
      .replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c] || c))
      .replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
      .replace(/[\u064B-\u065F\u0670]/g,'')
      .replace(/[.!?,;:«»„“"'\u2019()\[\]]/g,'')
      .replace(/\s+/g,' ').trim();
  }

  /* ── Rendu principal ── */
  function render(){
    const box = $('#officielsBody'); if(!box) return;
    if(ouvert){ box.innerHTML = vueDevoir(); return; }
    box.innerHTML = entete() + filtres() + liste();
  }

  function entete(){
    const ds = D.devoirs || [];
    const moy = ds.reduce((a,d) => a + (d.stats.reussite_pct || 0), 0) / (ds.length || 1);
    return '<div class="card off-hero">' +
      '<div><div class="ch-badge">📄 الفروض الرسمية — ' + esc(D._meta.annee_scolaire) + '</div>' +
      '<h2>فروض واختبارات ثانويات الوطن</h2>' +
      '<div class="ch-sub">' + esc(D._meta.titre_de) + ' · تجميع الأستاذ خريف أحمد</div>' +
      '<div class="chips" style="margin-top:10px">' +
        '<span class="sec-pill">📄 ' + ds.length + ' فرض</span>' +
        '<span class="sec-pill or">🏫 ' + (D.lycees||[]).length + ' ثانوية</span>' +
        '<span class="sec-pill rg">📍 ' + new Set(ds.map(d => d.code_wilaya)).size + ' ولاية</span>' +
        '<span class="sec-pill">🧮 السلّم /' + D._meta.bareme_officiel.total + '</span>' +
        '<span class="sec-pill">📊 نسبة النجاح ' + moy.toFixed(1) + '%</span>' +
      '</div></div>' +
      '<div class="oh-bar">' +
        '<div class="oh-b"><b>I</b><span>فهم المكتوب</span><i>/8</i></div>' +
        '<div class="oh-b"><b>II</b><span>قسم اللغة</span><i>/8</i></div>' +
        '<div class="oh-b"><b>III</b><span>إنتاج كتابي</span><i>/4</i></div>' +
      '</div></div>' +
      '<div class="privacy">🧮 <b>السلّم الرسمي</b> : ' +
        esc(D._meta.structure_langue.join(' · ')) +
        '<br>✍️ <b>إنتاج كتابي /4</b> : مضمون 2ن (5 معلومات = 0,4/معلومة) · ' +
        'لغة 2ن (قواعد / ترتيب الكلمات / إملاء)' +
        '<br>🔒 ' + esc(D._meta.confidentialite) + '</div>';
  }

  function filtres(){
    const opt = (v,l,sel) => '<option value="' + esc(v) + '"' + (sel===v?' selected':'') + '>' +
      esc(l) + '</option>';
    return '<div class="filters"><div class="filters-h"><b>🔎 تصفية الفروض</b>' +
      '<button class="btn btn-o btn-sm" id="offReset">↺ إعادة الضبط</button></div>' +
      '<div class="frow"><div class="fld2 search-bar"><span>🔍 بحث</span>' +
        '<input id="offQ" type="search" value="' + esc(fq) + '" ' +
        'placeholder="وهران · ثانوية الأمير · الوحدة 3 · ف2…"><span class="s-ico">🔍</span></div>' +
      '<div class="fld2"><span>📅 الفصل</span><select data-filtre="trim">' +
        opt('tous','كل الفصول',fTrim) + (D.trimestres||[]).map(t =>
          opt(String(t.valeur), t.num + ' — ' + t.label, fTrim)).join('') + '</select></div>' +
      '<div class="fld2"><span>📖 الوحدة</span><select data-filtre="unite">' +
        opt('tous','كل الوحدات',fUnite) + (D.unites||[]).map(u =>
          opt(String(u.n), 'الوحدة ' + u.n + ' — ' + u.ar, fUnite)).join('') + '</select></div></div>' +
      '<div class="frow">' +
      '<div class="fld2"><span>📍 الولاية</span><select data-filtre="wilaya">' +
        opt('tous','كل الولايات',fWilaya) + (D.lycees||[]).map(l =>
          opt(l.code_wilaya, l.code_wilaya + ' — ' + l.wilaya, fWilaya)).join('') + '</select></div>' +
      '<div class="fld2"><span>🏫 الثانوية</span><select data-filtre="lycee">' +
        opt('tous','كل الثانويات',fLycee) + (D.lycees||[]).map(l =>
          opt(l.nom, l.nom + ' — ' + l.wilaya, fLycee)).join('') + '</select></div></div></div>';
  }

  function filtrer(){
    const t = norm(fq);
    return (D.devoirs || []).filter(d => {
      if(fTrim !== 'tous' && String(d.trimestre) !== fTrim) return false;
      if(fUnite !== 'tous' && String(d.unite) !== fUnite) return false;
      if(fWilaya !== 'tous' && d.code_wilaya !== fWilaya) return false;
      if(fLycee !== 'tous' && d.lycee !== fLycee) return false;
      if(t){
        const hay = norm([d.titre, d.lycee, d.wilaya, d.unite_ar, d.unite_de,
                          d.numero, d.trimestre_label, d.grammaire_ar || ''].join(' '));
        if(hay.indexOf(t) === -1) return false;
      }
      return true;
    });
  }

  function liste(){
    const ds = filtrer();
    if(!ds.length){
      return '<div class="card empty"><div class="empty-i">🔍</div><h3>لا توجد فروض مطابقة</h3>' +
        '<p>جرّب توسيع البحث أو أعد ضبط المرشّحات.</p></div>';
    }
    return '<div class="result-bar"><div>النتائج : <span class="result-n">' + ds.length +
      '</span></div><div>' + ds.length + ' / ' + (D.devoirs||[]).length + ' فرض</div></div>' +
      '<div class="off-grid">' + ds.map(carteDevoir).join('') + '</div>';
  }

  function carteDevoir(d){
    const r = repsDevoir(d.id);
    const n = Object.keys(r).length;
    const note = n ? noter(d).total : null;
    return '<article class="off-card" data-devoir="' + esc(d.id) + '">' +
      '<div class="oc-h"><span class="oc-badge">' + esc(d.numero) + '</span>' +
        '<div class="oc-t"><b>' + esc(d.titre) + '</b>' +
        '<i>' + esc(d.lycee) + ' - ' + esc(d.wilaya) + ' • ' + esc(d.niveau) + '</i></div></div>' +
      '<div class="oc-m">' +
        '<span class="mchip">📖 الوحدة ' + d.unite + ' · ' + esc(d.unite_ar) + '</span>' +
        '<span class="mchip">⏱️ ' + d.duree_minutes + ' د</span>' +
        '<span class="mchip">🧮 /' + d.bareme + '</span>' +
        (d.grammaire_ar ? '<span class="mchip">📘 ' + esc(d.grammaire_ar) + '</span>' : '') +
      '</div>' +
      '<div class="oc-f">' +
        '<span class="oc-s">👁️ ' + d.stats.vues + ' · 📥 ' + d.stats.telechargements +
          ' · 📊 ' + d.stats.reussite_pct + '%</span>' +
        (note !== null ? '<span class="oc-n ' + (note >= PRET ? 'ok' : note >= CONS ? 'mid' : 'ko') + '">' +
          note.toFixed(1) + '/20</span>'
          : (n ? '<span class="oc-n mid">' + n + ' إجابة</span>' : '')) +
      '</div>' +
      '<div class="oc-tabs">' +
        '<button class="oc-tab" data-ouvrir="' + esc(d.id) + '" data-o="sujet">📄 الفرض</button>' +
        '<button class="oc-tab sol" data-ouvrir="' + esc(d.id) + '" data-o="corrige">✅ الحل</button>' +
      '</div></article>';
  }

  /* ══════ Vue d'un devoir ══════ */
  function vueDevoir(){
    const d = ouvert;
    const n = noter(d);
    return '<div class="card off-head">' +
      '<button class="btn btn-o btn-sm" id="offBack">↩️ كل الفروض</button>' +
      '<div class="oh-t"><span class="oc-badge">' + esc(d.numero) + '</span>' +
        '<div><h2>' + esc(d.titre) + '</h2>' +
        '<div class="ch-sub">' + esc(d.lycee) + ' - ' + esc(d.wilaya) + ' • ' + esc(d.niveau) +
        ' • ' + esc(d.annee_scolaire) + ' • ⏱️ ' + d.duree_minutes + ' دقيقة</div></div></div>' +
      '<div class="oh-note"><div class="ohn-n ' + (n.total >= PRET ? 'ok' : n.total >= CONS ? 'mid' : 'ko') + '">' +
        n.total.toFixed(1) + '</div><div class="ohn-l">/20 · تصحيح آلي</div></div>' +
      '</div>' +
      '<div class="onglets">' +
        '<button class="ong' + (onglet==='sujet'?' on':'') + '" data-onglet="sujet">📄 الفرض</button>' +
        '<button class="ong' + (onglet==='corrige'?' on':'') + '" data-onglet="corrige">✅ الحل</button>' +
      '</div>' +
      (onglet === 'sujet' ? rendreSujet(d) : rendreCorrige(d));
  }

  function rendreSujet(d){
    let h = '';
    d.parties.forEach(p => {
      h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + esc(p.titre) +
        ' <span class="de-display" style="font-size:13px;opacity:.7">' + esc(p.titre_de) + '</span></b>' +
        '<span class="note">/8 نقاط</span></div><div class="part-b">';

      if(p.id === 'I'){
        h += '<div class="reading">' + esc(p.texte).replace(/\n/g, '<br>') + '</div>';
        p.questions.forEach(q => {
          h += '<div class="exo-g"><div class="q-t"><span class="q-n">' + q.n + '</span>' +
            (q.type === 'vf' ? 'أجب بـ <b>Richtig</b> أو <b>Falsch</b>' : 'أجب بجمل كاملة') +
            ' <span class="note" style="font-size:11px">' + esc(q.bareme) + '</span></div>';
          q.items.forEach((it, i) => {
            const cle = 'I' + q.n + '_' + i;
            const v = repsDevoir(d.id)[cle] || '';
            if(q.type === 'vf'){
              h += '<div class="vf-row"><span class="vf-q de-in">' + esc(it.q) + '</span>' +
                '<span class="vf-b">' + ['Richtig','Falsch'].map(o =>
                  '<button class="vfb' + (v === o ? ' on' : '') + '" data-rep="' + cle +
                  '" data-val="' + o + '" data-devoir="' + esc(d.id) + '">' + o + '</button>').join('') +
                '</span></div>';
            } else {
              h += '<label class="qrow"><span class="qr-q de-in">' + esc(it.q) + '</span>' +
                '<input class="qr-i" data-rep="' + cle + '" data-devoir="' + esc(d.id) +
                '" value="' + esc(v) + '" placeholder="…"></label>';
            }
          });
          h += '</div>';
        });
      }

      if(p.id === 'II'){
        p.exercises.forEach(ex => {
          h += '<div class="exo-g"><div class="q-t"><span class="q-n">' + ex.n + '</span>' +
            esc(ex.titre) + ' <span class="note" style="font-size:11px">(' + esc(ex.bareme) + ')</span></div>';
          ex.items.forEach((it, i) => {
            const cle = 'II' + ex.n + '_' + i;
            const v = repsDevoir(d.id)[cle] || '';
            if(ex.type === 'order' && it.mots){
              h += '<div class="ord-row"><span class="ord-q de-in">' + esc(it.q) + '</span>' +
                '<input class="qr-i wide" data-rep="' + cle + '" data-devoir="' + esc(d.id) +
                '" value="' + esc(v) + '" placeholder="اكتب الجملة مرتّبة…"></div>';
            } else {
              h += '<label class="qrow"><span class="qr-q de-in">' + esc(it.q) + '</span>' +
                '<input class="qr-i" data-rep="' + cle + '" data-devoir="' + esc(d.id) +
                '" value="' + esc(v) + '" placeholder="…"></label>';
            }
          });
          h += '</div>';
        });
      }

      if(p.id === 'III'){
        const cle = 'III';
        const v = repsDevoir(d.id)[cle] || '';
        h += '<div class="exo-g"><div class="q-t"><span class="q-n">✍️</span>' +
          esc(p.consigne) + ' <span class="note" style="font-size:11px">(4 نقاط)</span></div>' +
          '<textarea class="txt-in" style="min-height:150px" data-rep="' + cle +
          '" data-devoir="' + esc(d.id) + '" placeholder="Ich heiße …">' + esc(v) + '</textarea>' +
          '<div class="grille-box"><b>📊 السلّم</b>' +
          '<div class="gr">' + Object.keys(p.grille).map(k =>
            '<span class="gr-i"><b>' + esc(k) + ' ' + p.grille[k].points + 'ن</b>' +
            '<i>' + esc(p.grille[k].detail) + '</i></span>').join('') + '</div>' +
          '<div class="gr-infos">المعلومات المطلوبة (0,4 / معلومة) : ' +
            (p.grille['مضمون'].infos || []).map(x => '<span class="chip">' + esc(x) + '</span>').join(' ') +
          '</div></div></div>';
      }
      h += '</div></div>';
    });

    h += '<div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn btn-p" id="offNoter">🧮 صحّح ورقتي</button>' +
      '<button class="btn btn-o" id="offVider">🗑️ مسح إجاباتي</button>' +
      '<button class="btn btn-g" id="offVoir">✅ عرض الحل</button>' +
      '<button class="btn btn-o" id="offDl">📥 تصدير النتيجة</button>' +
      '<button class="btn btn-o" id="offPrint">🖨️ طباعة</button>' +
      '<a class="btn btn-w" id="offWa" target="_blank" rel="noopener" href="#">💬 أرسل للأستاذ</a>' +
      '</div><div id="offMsg"></div></div>';
    return h;
  }

  function rendreCorrige(d){
    let h = '';
    d.parties.forEach(p => {
      h += '<div class="part"><div class="part-h"><b>' + p.id + '. ' + esc(p.titre) +
        ' — ✅ التصحيح النموذجي</b><span class="note">/' + p.points + ' نقاط</span></div><div class="part-b">';
      if(p.id === 'I'){
        h += '<div class="reading">' + esc(p.texte).replace(/\n/g, '<br>') + '</div>';
        p.questions.forEach(q => {
          h += '<div class="corr-g"><div class="q-t"><span class="q-n">' + q.n + '</span>' +
            esc(q.bareme) + '</div>';
          q.items.forEach(it => {
            h += '<div class="corr-i"><span class="de-in">' + esc(it.q) + '</span>' +
              '<span class="corr-r">' + esc(it.rep) + '</span>' +
              (it.alt ? '<span class="corr-a">مقبول أيضاً : ' + esc(it.alt) + '</span>' : '') +
              (it.just ? '<span class="corr-j">📌 ' + esc(it.just) + '</span>' : '') + '</div>';
          });
          h += '</div>';
        });
      }
      if(p.id === 'II'){
        p.exercises.forEach(ex => {
          h += '<div class="corr-g"><div class="q-t"><span class="q-n">' + ex.n + '</span>' +
            esc(ex.titre) + ' <span class="note" style="font-size:11px">(' + esc(ex.bareme) + ')</span></div>';
          ex.items.forEach(it => {
            h += '<div class="corr-i"><span class="de-in">' + esc(it.q) + '</span>' +
              '<span class="corr-r">' + esc(it.rep) + '</span>' +
              '<span class="corr-j">📘 ' + esc(it.regle) + '</span></div>';
          });
          h += '</div>';
        });
      }
      if(p.id === 'III'){
        h += '<div class="corr-g"><div class="q-t"><span class="q-n">✍️</span>' + esc(p.consigne) + '</div>' +
          '<div class="grille-box"><b>📊 السلّم</b><div class="gr">' +
          Object.keys(p.grille).map(k => '<span class="gr-i"><b>' + esc(k) + ' ' +
            p.grille[k].points + 'ن</b><i>' + esc(p.grille[k].detail) + '</i></span>').join('') +
          '</div></div>' +
          '<div class="corrige" style="margin-top:13px"><h3>🏆 نموذج الإجابة</h3>' +
          '<div class="reading">' + esc(p.modele).split('. ').map(s =>
            s.trim() ? (s.endsWith('.') ? s : s + '.') : '').filter(Boolean).join(' ') + '</div></div>' +
          '<div class="privacy" style="margin-top:11px">🧮 التفصيل : مضمون 2ن ' +
          '(5 معلومات × 0,4) + لغة 2ن (تصريف صحيح 1ن + ترتيب الجملة والمajuscules والإملاء 1ن)</div></div>';
      }
      h += '</div></div>';
    });
    h += '<div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button class="btn btn-o" id="offBack2">↩️ كل الفروض</button>' +
      '<button class="btn btn-p" id="offSujet">📄 العودة إلى الموضوع</button>' +
      '<button class="btn btn-o" id="offPrint2">🖨️ طباعة الحل</button></div></div>';
    return h;
  }

  /* ══════ Notation automatique ══════ */
  function noter(d){
    const r = repsDevoir(d.id);
    const sc = { I:0, II:0, III:0 };
    const detail = [];

    const pI = d.parties.filter(p => p.id === 'I')[0];
    pI.questions.forEach(q => {
      const par = q.points / q.items.length;
      q.items.forEach((it, i) => {
        const cle = 'I' + q.n + '_' + i;
        const v = norm(r[cle]);
        let ok = false;
        if(q.type === 'vf') ok = v === norm(it.rep);
        else ok = (it.key || []).some(k => v.indexOf(norm(k)) !== -1);
        if(ok) sc.I += par;
        detail.push({ id:cle, q:it.q, rep:r[cle] || '—', sol:it.rep, ok:ok, pts:par });
      });
    });

    const pII = d.parties.filter(p => p.id === 'II')[0];
    pII.exercises.forEach(ex => {
      const par = 2 / ex.items.length;
      ex.items.forEach((it, i) => {
        const cle = 'II' + ex.n + '_' + i;
        const v = norm(r[cle]);
        const ok = (it.key || []).some(k => v.indexOf(norm(k)) !== -1);
        if(ok) sc.II += par;
        detail.push({ id:cle, q:it.q, rep:r[cle] || '—', sol:it.rep, ok:ok, pts:par,
                      regle: it.regle });
      });
    });

    const pIII = d.parties.filter(p => p.id === 'III')[0];
    const txt = String(r['III'] || '');
    const phrases = txt.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 2);
    const infos = (pIII.grille['مضمون'].infos || []).length;
    const trouvees = Math.min(infos, phrases.length);
    const contenu = Math.round(0.4 * trouvees * 10) / 10;
    const verbes = ['bin','habe','heiße','komme','wohne','lerne','ist','hat','mache','gehe'];
    const conj = verbes.filter(v => new RegExp('\\b' + v + '\\b', 'i').test(txt)).length;
    const maj = phrases.filter(s => /^[A-ZÄÖÜ]/.test(s)).length;
    const langue = (conj >= 3 ? 1 : (conj >= 1 ? 0.5 : 0)) + (maj >= 4 ? 1 : (maj >= 2 ? 0.5 : 0));
    sc.III = Math.min(4, Math.round((Math.min(2, contenu) + Math.min(2, langue)) * 10) / 10);
    detail.push({ id:'III', q:'إنتاج كتابي', rep: trouvees + ' جملة · ' + conj + ' تصريف · ' +
                  maj + ' majuscule', sol:pIII.modele.slice(0, 60) + '…', ok: sc.III >= 2,
                  pts:4, regle:'مضمون ' + Math.min(2, contenu) + '/2 (0,4 × ' + trouvees +
                  ') · لغة ' + Math.min(2, langue) + '/2' });

    Object.keys(sc).forEach(k => { sc[k] = Math.round(sc[k] * 10) / 10; });
    const total = Math.round((sc.I + sc.II + sc.III) * 10) / 10;
    return { sc:sc, total:total, detail:detail,
             ready: total >= PRET ? 'prêt ✅' : (total >= CONS ? 'à consolider ⚠️' : 'non prêt ❌') };
  }

  function afficherNote(){
    const n = noter(ouvert);
    const box = $('#offMsg'); if(!box) return;
    box.innerHTML = '<div class="fbk show ' + (n.total >= PRET ? 'ok' : n.total >= CONS ? '' : 'ko') +
      '" style="margin-top:14px"><b>🧮 نتيجتك : ' + n.total.toFixed(1) + ' / 20</b> — ' + n.ready +
      '<div style="margin-top:9px">📖 فهم المكتوب : <b>' + n.sc.I + '/8</b> · ' +
      '🔤 قسم اللغة : <b>' + n.sc.II + '/8</b> · ✍️ إنتاج كتابي : <b>' + n.sc.III + '/4</b></div>' +
      '<table class="bareme" style="margin-top:11px"><tr><th>السؤال</th><th>إجابتك</th>' +
      '<th>الصواب</th><th>النقطة</th></tr>' +
      n.detail.map(x => '<tr><td class="de-in">' + esc(x.id) + '</td>' +
        '<td style="color:' + (x.ok ? 'var(--g)' : 'var(--r)') + '">' +
        (x.ok ? '✅ ' : '❌ ') + esc(String(x.rep).slice(0, 70)) + '</td>' +
        '<td style="color:var(--m)">' + esc(String(x.sol).slice(0, 70)) + '</td>' +
        '<td>' + (x.ok ? x.pts : 0) + '/' + x.pts + '</td></tr>').join('') + '</table>' +
      '<div class="privacy" style="margin-top:11px">🔒 نتيجتك سرّية — محفوظة على جهازك فقط ' +
      '(منهج الحصة 7).</div></div>';
    const t = $('.ohn-n');
    if(t){ t.textContent = n.total.toFixed(1);
      t.className = 'ohn-n ' + (n.total >= PRET ? 'ok' : n.total >= CONS ? 'mid' : 'ko'); }
    toast('🧮 ' + n.total.toFixed(1) + '/20 — ' + n.ready, n.total >= PRET ? 'ok' : '');
  }

  function exporter(){
    const d = ouvert, n = noter(d);
    const L = [];
    L.push('═══════════════════════════════════════════');
    L.push('  ' + d.titre);
    L.push('  ' + d.lycee + ' - ' + d.wilaya + ' • ' + d.niveau + ' • ' + d.annee_scolaire);
    L.push('═══════════════════════════════════════════');
    L.push('');
    L.push('النتيجة : ' + n.total.toFixed(1) + ' / 20   —   ' + n.ready);
    L.push('  📖 فهم المكتوب  : ' + n.sc.I + ' / 8');
    L.push('  🔤 قسم اللغة     : ' + n.sc.II + ' / 8');
    L.push('  ✍️ إنتاج كتابي   : ' + n.sc.III + ' / 4');
    L.push('');
    L.push('── التفصيل ──');
    n.detail.forEach(x => {
      L.push('  ' + (x.ok ? '[OK] ' : '[--] ') + x.id + ' : ' + x.q);
      L.push('        جوابك : ' + x.rep);
      L.push('        الصواب : ' + x.sol);
      if(x.regle) L.push('        القاعدة : ' + x.regle);
    });
    L.push('');
    L.push('───────────────────────────────────────────');
    L.push('  الأستاذ خريف أحمد · 📱 0555 57 79 31');
    L.push('  « الرجوع إلى الأصل فضيلة »');
    return L.join('\n');
  }

  /* ══════ Téléchargement du résultat (BOM UTF-8 → lisible sous Excel) ══════ */
  function telecharger(){
    if(!ouvert) return;
    const n = noter(ouvert);
    const nom = 'resultat-' + ouvert.id + '-' + Date.now() + '.txt';
    try{
      const blob = new Blob(['\uFEFF' + exporter()], { type:'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nom;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast('📥 تم تنزيل النتيجة (' + n.total.toFixed(1) + '/20)', 'ok');
    }catch(e){
      toast('⚠️ تعذّر التنزيل — المتصفح لا يدعم Blob', 'ko');
    }
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-ouvrir]');
    if(o){
      const d = (D.devoirs||[]).filter(x => x.id === o.dataset.ouvrir)[0];
      if(d){ ouvert = d; onglet = o.dataset.o || 'sujet'; render();
        window.scrollTo({top:0, behavior:'smooth'}); }
      return;
    }
    const on = ev.target.closest('[data-onglet]');
    if(on){ onglet = on.dataset.onglet; render(); return; }
    if(ev.target.closest('#offBack, #offBack2')){
      ouvert = null; onglet = 'sujet'; render();
      window.scrollTo({top:0, behavior:'smooth'}); return; }
    if(ev.target.closest('#offVoir')){ onglet = 'corrige'; render(); return; }
    if(ev.target.closest('#offSujet')){ onglet = 'sujet'; render(); return; }
    if(ev.target.closest('#offNoter')){ afficherNote(); return; }
    if(ev.target.closest('#offPrint, #offPrint2')){ window.print(); return; }
    if(ev.target.closest('#offVider')){
      if(!confirm('مسح كل إجاباتك على هذا الفرض؟')) return;
      const all = reps(); delete all[ouvert.id];
      try{ localStorage.setItem(K_REP, JSON.stringify(all)); }catch(e){}
      render(); toast('🗑️ تم مسح الإجابات','ok'); return; }
    if(ev.target.closest('#offReset')){
      fTrim = fUnite = fWilaya = fLycee = 'tous'; fq = '';
      render(); return; }
    if(ev.target.closest('#offDl')){ telecharger(); return; }
    if(ev.target.closest('#offWa')){
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(exporter().slice(0, 1800)), '_blank');
      return; }

    const vf = ev.target.closest('.vfb');
    if(vf){
      const par = vf.parentElement;
      $$('.vfb', par).forEach(b => b.classList.remove('on'));
      vf.classList.add('on');
      saveRep(vf.dataset.devoir, vf.dataset.rep, vf.dataset.val);
      if(ouvert) { const t = $('.ohn-n'); if(t){ const n = noter(ouvert);
        t.textContent = n.total.toFixed(1);
        t.className = 'ohn-n ' + (n.total >= PRET ? 'ok' : n.total >= CONS ? 'mid' : 'ko'); } }
      return;
    }
  });

  document.addEventListener('input', ev => {
    const i = ev.target.closest('[data-rep]');
    if(!i || i.classList.contains('vfb')) return;
    saveRep(i.dataset.devoir, i.dataset.rep, i.value);
  });
  document.addEventListener('change', ev => {
    const s = ev.target.closest('[data-filtre]');
    if(!s) return;
    const k = s.dataset.filtre, v = s.value;
    if(k === 'trim') fTrim = v;
    if(k === 'unite') fUnite = v;
    if(k === 'wilaya') fWilaya = v;
    if(k === 'lycee') fLycee = v;
    render();
  });
  document.addEventListener('input', ev => {
    const q = ev.target.closest('#offQ');
    if(!q) return;
    fq = q.value;
    clearTimeout(window._offT);
    window._offT = setTimeout(() => {
      const l = $('.off-grid, .empty');
      if(l){ const ds = filtrer();
        const bar = $('.result-bar');
        if(bar) bar.querySelector('.result-n').textContent = ds.length;
        const grid = $('.off-grid');
        if(grid && ds.length) grid.innerHTML = ds.map(carteDevoir).join('');
        else if(!ds.length && grid) grid.outerHTML =
          '<div class="card empty"><div class="empty-i">🔍</div><h3>لا توجد فروض مطابقة</h3></div>';
      }
    }, 240);
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'officiels') boot(); });
  window.renderOfficiels = boot;
  window.DZ_OFFICIELS = { boot:boot, render:render, noter:noter, exporter:exporter,
                          telecharger:telecharger,
                          PRET:PRET, CONS:CONS };
})();
