/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — parents.js
   👨‍👩‍👧 فضاء الأولياء · Elternbereich
   Multi-enfants · examens I/II/III · présence datée · حصص القادمة ·
   messages des professeurs · programme officiel MEN · exercices ·
   rapport PDF/TXT · tarifs (CIB · Edahabia · BaridiMob · CCP)
   Données 100% locales — aucune transmission serveur
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const SRC   = 'assets/bdd/parents.json';
  const K_SEL = 'dz_de_parent_enfant_v1';
  const K_MSG = 'dz_de_parent_msg_v1';
  const K_NOT = 'dz_de_parent_notif_v1';
  const PRET = 10, CONS = 7;
  const WA   = '213555577931';

  let D = null, enfant = null, onglet = 'synthese', tReste = null;

  /* ── Chargement ── */
  async function boot(){
    const box = $('#parentsBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل فضاء الأولياء…</div>';
      try{
        const r = await fetch(SRC, { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر التحميل : ' + esc(e.message) + '</div>';
        return;
      }
    }
    const id = lireSel();
    enfant = (D.enfants || []).filter(e => e.id === id)[0] || (D.enfants || [])[0];
    render();
    demarrerCompteRebours();
    verifierNotifications();
  }

  function lireSel(){ try{ return localStorage.getItem(K_SEL) || ''; }catch(e){ return ''; } }
  function ecrireSel(id){ try{ localStorage.setItem(K_SEL, id); }catch(e){} }

  /* ── Moteur de notes ── */
  function moyennePonderee(e){
    const xs = (e.examens || []).filter(x => x.note !== null && x.note !== undefined);
    if(!xs.length) return null;
    let s = 0, c = 0;
    xs.forEach(x => { s += (x.note / x.bareme) * 20 * (x.coef || 1); c += (x.coef || 1); });
    return Math.round(s / c * 100) / 100;
  }
  function moyenneSimple(e){
    const xs = (e.examens || []).filter(x => x.note !== null && x.note !== undefined);
    if(!xs.length) return null;
    return Math.round(xs.reduce((a,x) => a + x.note, 0) / xs.length * 100) / 100;
  }
  function readiness(t){
    if(t === null || t === undefined) return { k:'non_note', l:'○ غير منقّط', c:'' };
    if(t >= PRET) return { k:'pret', l:'✅ جاهز', c:'ok' };
    if(t >= CONS) return { k:'a_consolider', l:'⚠️ يحتاج تثبيت', c:'mid' };
    return { k:'non_pret', l:'❌ غير جاهز', c:'ko' };
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#parentsBody'); if(!box) return;
    box.innerHTML =
      enTete() +
      selecteurEnfants() +
      '<div class="onglets" id="paOng">' +
        ong('synthese','📊 نظرة عامة') + ong('examens','📊 الامتحانات') +
        ong('presence','✅ الحضور') + ong('exercices','🎯 التمارين') +
        ong('programme','📜 البرنامج') + ong('seances','🗓️ الحصص القادمة') +
        ong('messages','💬 الأساتذة') + ong('cours','👨‍🏫 دروس خصوصية') +
      '</div>' +
      '<div id="paContenu"></div>';
    paint();
  }
  function ong(id,lbl){
    return '<button class="ong' + (onglet===id?' on':'') + '" data-paong="' + id + '">' + lbl + '</button>';
  }

  function enTete(){
    const s = (window.AUTH && AUTH.session) ? AUTH.session() : { nom:'ولي التلميذ' };
    return '<div class="card par-hero">' +
      '<div><div class="ch-badge">👨‍👩‍👧 فضاء الأولياء — ' + esc(D._meta.annee_scolaire) + '</div>' +
      '<h2>مرحباً بك، ' + esc(s.nom) + ' 👋</h2>' +
      '<div class="ch-sub">' + esc(D._meta.etablissement) + ' · متابعة شفّافة لنجاح أبنائك</div></div>' +
      '<div class="ph-act">' +
        '<button class="btn btn-g btn-sm" id="pPdf">📄 تقرير PDF</button>' +
        '<button class="btn btn-o btn-sm" id="pTxt">📥 تقرير نصي</button>' +
        '<button class="btn btn-w btn-sm" id="pWa">💬 واتساب</button>' +
        '<button class="btn btn-o btn-sm" id="pNotif">🔔 التنبيهات</button>' +
      '</div></div>';
  }

  function selecteurEnfants(){
    if((D.enfants || []).length <= 1) return '';
    return '<div class="enf-sel">' + (D.enfants || []).map(e => {
      const m = moyennePonderee(e), r = readiness(m);
      return '<button class="enf' + (e.id === enfant.id ? ' on' : '') + '" data-enfant="' + esc(e.id) + '">' +
        '<span class="enf-av">' + esc(e.initiales) + '</span>' +
        '<span class="enf-b"><b>' + esc(e.nom_complet) + '</b>' +
        '<i>' + esc(e.section_ar) + ' · ' + esc(e.filiere) + ' · ' + e.age + ' سنة</i></span>' +
        '<span class="enf-n ' + r.c + '">' + (m === null ? '—' : m.toFixed(2)) + '</span></button>';
    }).join('') + '</div>';
  }

  function paint(){
    const c = $('#paContenu'); if(!c) return;
    if(onglet === 'synthese')  c.innerHTML = vueSynthese();
    if(onglet === 'examens')   c.innerHTML = vueExamens();
    if(onglet === 'presence')  c.innerHTML = vuePresence();
    if(onglet === 'exercices') c.innerHTML = vueExercices();
    if(onglet === 'programme') c.innerHTML = vueProgramme();
    if(onglet === 'seances')   c.innerHTML = vueProchaines();
    if(onglet === 'messages')  c.innerHTML = vueMessages();
    if(onglet === 'cours')     c.innerHTML = vueCours();
  }

  /* ══════ 1. SYNTHÈSE ══════ */
  function vueSynthese(){
    const e = enfant, mp = moyennePonderee(e), ms = moyenneSimple(e), r = readiness(mp);
    const pres = (e.presence || []).filter(p => p.ok).length;
    const tot  = (e.presence || []).length || 1;
    const exoF = (e.exercices || []).filter(x => x.statut === 'termine');
    const nonLus = (D.messages_profs || []).reduce((a,m) => a + (m.non_lus||0), 0);
    return '' +
    '<div class="bdd-kpis">' +
      kpi('📊', mp === null ? '—' : mp.toFixed(2), 'المعدّل العام /20', 'Moyenne pondérée') +
      kpi('📝', ms === null ? '—' : ms.toFixed(2), 'المعدّل البسيط', 'Moyenne simple') +
      kpi('✅', Math.round(pres/tot*100) + '%', 'نسبة الحضور', 'Présence') +
      kpi('🎯', exoF.length + '/' + (e.exercices||[]).length, 'تمارين منجزة', 'Exercices') +
      kpi('🏆', e.meilleure_sim === null || e.meilleure_sim === undefined ? '—' : e.meilleure_sim,
          'أفضل محاكاة /20', 'Meilleure sim.') +
      kpi('💬', nonLus, 'رسالة غير مقروءة', 'Messages') +
      kpi('⭐', e.points, 'نقاط التحفيز', 'Points') +
      kpi('🧭', r.l, 'الجاهزية', 'Readiness') +
    '</div>' +
    '<div class="card"><h2>🧒 ' + esc(e.nom_complet) + ' — ' + esc(e.matricule) + '</h2>' +
      '<div class="info-grid">' +
        info('🏫 القسم', e.section_ar + ' · ' + e.niveau) +
        info('🎓 الشعبة', e.filiere) +
        info('📍 الولاية', e.code_wilaya + ' — ' + e.wilaya) +
        info('🏛️ المدينة', e.ville) +
        info('🎂 السن', e.age + ' سنة') +
        info('📚 الحصص المكتملة', e.seances_terminees + ' / 8') +
        info('⏱️ المحاكيات', String(e.simulations)) +
        info('❌ الغيابات', String(e.absences)) +
        info('⏰ التأخّرات', String(e.retards)) +
      '</div>' +
      '<div class="privacy" style="margin-top:13px">💬 ملاحظة الأستاذ : ' +
        esc(e.appreciation_generale) + '</div></div>' +
    '<div class="grid2">' +
      '<div class="card"><h2>📊 آخر الامتحانات</h2>' +
        (e.examens || []).slice(0,3).map(examenRow).join('') +
        '<button class="btn btn-o btn-block" data-paong="examens">📊 كل الامتحانات</button></div>' +
      '<div class="card"><h2>📋 الامتحان القادم</h2>' + carteExamenAvenir() + '</div>' +
    '</div>' +
    '<div class="grid2">' +
      '<div class="card"><h2>🗓️ الحصص القادمة</h2>' + listeProchaines(3) +
        '<button class="btn btn-o btn-block" data-paong="seances">🗓️ الجدول الكامل</button></div>' +
      '<div class="card"><h2>✅ آخر الحضور</h2>' +
        (e.presence || []).slice(0,3).map(presenceRow).join('') +
        '<button class="btn btn-o btn-block" data-paong="presence">✅ كل السجلّ</button></div>' +
    '</div>';
  }
  function kpi(i,n,l,de){
    return '<div class="kpi"><div class="kpi-i">' + i + '</div><div class="kpi-n">' + n +
      '</div><div class="kpi-l">' + l + '</div><div class="kpi-d">' + esc(de) + '</div></div>';
  }
  function info(k,v){ return '<div class="info-i"><div class="info-k">' + k + '</div>' +
                            '<div class="info-v">' + esc(v == null ? '—' : v) + '</div></div>'; }

  function examenRow(x){
    const r = readiness(x.note);
    return '<div class="rep-row"><div><b>' + esc(x.icon || '📊') + ' ' + esc(x.titre) + '</b>' +
      '<div style="font-size:11.5px;color:var(--m)">' + esc(x.date) + ' · معامل ×' + (x.coef||1) +
      (x.appreciation ? ' · ' + esc(x.appreciation) : '') + '</div></div>' +
      '<span class="rep-v ' + r.c + '">' + formatNote(x.note) + '/' + x.bareme + '</span></div>';
  }
  function formatNote(n){
    if(n === null || n === undefined) return '—';
    return String(n).replace('.', '٫');
  }

  function carteExamenAvenir(){
    const x = enfant.examen_a_venir;
    if(!x) return '<p style="color:var(--m);font-size:13px">لا توجد امتحانات مبرمجة.</p>';
    return '<div class="exam-next"><div class="en-h">' + esc(x.icon) + ' <span class="chip ex">' +
      esc(x.statut) + '</span></div>' +
      '<div class="en-t">' + esc(x.titre) + '</div>' +
      '<div class="en-l">' + esc(x.quand) + '</div>' +
      '<div class="en-l">' + esc(x.duree) + '</div>' +
      '<div class="en-l">' + esc(x.programme) + '</div>' +
      '<div class="en-l">' + esc(x.coef) + '</div>' +
      '<button class="btn btn-p btn-block" data-go="simulation">⏱️ محاكاة بظروف حقيقية</button></div>';
  }

  function presenceRow(p){
    return '<div class="rep-row"><div><b>' + (p.ok ? '✅' : '❌') + ' ' + esc(p.lecon) + '</b>' +
      '<div style="font-size:11.5px;color:var(--m)">' + esc(p.jour) + '</div></div>' +
      '<span class="rep-v ' + (p.ok ? 'ok' : 'ko') + '">' + esc(p.statut) +
      (p.heure ? ' - ' + esc(p.heure) : '') + '</span></div>';
  }

  /* ══════ 2. EXAMENS ══════ */
  function vueExamens(){
    const e = enfant, mp = moyennePonderee(e);
    return '<div class="card"><h2>📊 كشف النقاط — ' + esc(e.nom_complet) + '</h2>' +
      '<div class="result" style="padding:16px"><div class="result-n ' +
        (mp >= PRET ? 'ok' : mp >= CONS ? 'md' : 'ko') + '">' + (mp === null ? '—' : mp.toFixed(2)) +
      '</div><div class="result-l">المعدّل العام المرجّح بالمعاملات /20</div></div>' +
      '<table class="bareme"><tr><th>الامتحان</th><th>التاريخ</th><th>📖 I/8</th>' +
      '<th>🔤 II/8</th><th>✍️ III/4</th><th>المجموع</th><th>المعامل</th><th>الجاهزية</th></tr>' +
      (e.examens || []).map(x => {
        const r = readiness(x.note), d = x.detail || {};
        return '<tr><td style="text-align:right"><b>' + esc(x.titre) + '</b>' +
          '<div style="font-size:11px;color:var(--m)">' + esc(x.type) + '</div></td>' +
          '<td class="de-in">' + esc(x.date) + '</td>' +
          '<td>' + (d.I !== undefined ? d.I : '—') + '</td>' +
          '<td>' + (d.II !== undefined ? d.II : '—') + '</td>' +
          '<td>' + (d.III !== undefined ? d.III : '—') + '</td>' +
          '<td class="rep-v ' + r.c + '">' + formatNote(x.note) + '/' + x.bareme + '</td>' +
          '<td>×' + (x.coef||1) + '</td><td>' + r.l + '</td></tr>';
      }).join('') + '</table></div>' +
      '<div class="card"><h2>📋 الامتحان القادم</h2>' + carteExamenAvenir() + '</div>' +
      '<div class="card"><h2>💬 ملاحظات الأساتذة</h2>' +
        (e.examens || []).filter(x => x.appreciation).map(x =>
          '<div class="rep-row"><div><b>' + esc(x.titre) + '</b>' +
          '<div style="font-size:12px;color:var(--m)">' + esc(x.appreciation) + '</div></div>' +
          '<span class="rep-v ' + readiness(x.note).c + '">' + formatNote(x.note) + '/20</span></div>').join('') +
      '</div>' +
      '<div class="card"><h2>🧮 السلّم الرسمي المعتمد</h2>' +
        '<table class="bareme"><tr><th>الجزء</th><th>المحتوى</th><th>النقاط</th></tr>' +
        '<tr><td><b>I</b></td><td>📖 فهم المكتوب — Leseverstehen</td><td>8</td></tr>' +
        '<tr><td><b>II</b></td><td>🔤 اللغة — Sprachbausteine</td><td>8</td></tr>' +
        '<tr><td><b>III</b></td><td>✍️ إنتاج كتابي — Schreiben</td><td>4</td></tr>' +
        '<tr style="background:rgba(61,220,132,.1)"><td colspan="2"><b>المجموع</b></td><td><b>20</b></td></tr>' +
        '</table><div class="privacy" style="margin-top:11px">🧭 عتبات الجاهزية : ' +
        '<b>≥' + PRET + ' جاهز ✅</b> · <b>' + CONS + '–' + (PRET - 0.1) + ' يحتاج تثبيت ⚠️</b> · ' +
        '<b>&lt;' + CONS + ' غير جاهز ❌</b> (منهج الحصة 7 — تواصل فردي)</div></div>';
  }

  /* ══════ 3. PRÉSENCE ══════ */
  function vuePresence(){
    const e = enfant, p = e.presence || [];
    const ok = p.filter(x => x.ok).length;
    const pct = p.length ? Math.round(ok / p.length * 100) : 0;
    return '<div class="card"><h2>✅ سجلّ حضور الحصص</h2>' +
      '<div class="progress-wrap"><div class="progress" style="width:' + pct + '%"></div></div>' +
      '<div class="progress-lbl">نسبة الحضور <b>' + pct + '%</b> — ' + ok + ' / ' + p.length +
      ' حصص · ' + e.absences + ' غياب · ' + e.retards + ' تأخّر</div></div>' +
      '<div class="card">' + p.map(presenceRow).join('') + '</div>' +
      '<div class="card"><h2>📈 تطور الحضور</h2>' +
      '<div class="histo">' + p.slice().reverse().map(x =>
        '<div class="hcol"><span class="hv' + (x.ok ? ' on' : '') + '">' + (x.ok ? '✅' : '❌') +
        '</span><span class="hb"><i style="height:' + (x.ok ? 100 : 22) + '%"></i></span>' +
        '<span class="hl">' + esc((x.heure || '—')) + '</span></div>').join('') + '</div>' +
      '<div class="hleg">من الأقدم إلى الأحدث — الساعة المذكورة هي ساعة الدخول الفعلية</div></div>';
  }

  /* ══════ 4. EXERCICES ══════ */
  function vueExercices(){
    const ex = enfant.exercices || [];
    const faits = ex.filter(x => x.statut === 'termine');
    const pts = faits.reduce((a,x) => a + (x.score||0), 0);
    const max = faits.reduce((a,x) => a + (x.max||0), 0);
    return '<div class="card"><h2>🎯 التمارين التفاعلية</h2>' +
      (max ? '<div class="progress-wrap"><div class="progress" style="width:' +
        Math.round(pts/max*100) + '%"></div></div>' +
      '<div class="progress-lbl">مجموع النقاط : <b>' + pts + ' / ' + max + '</b> (' +
        Math.round(pts/max*100) + '%) · ' + faits.length + ' / ' + ex.length + ' تمارين منجزة</div>' : '') +
      '</div>' +
      '<div class="exos-list">' + ex.map(x => {
        const st = { termine:['✓','ok','مكتمل'], en_cours:['▶','mid','جاري'],
                     verrouille:['🔒','','مقفل'] }[x.statut] || ['?','',''];
        return '<div class="exo-i ' + st[1] + '" data-exo="' + x.n + '">' +
          '<span class="ex-ic">' + st[0] + '</span>' +
          '<span class="ex-b"><b>' + esc(x.titre) + '</b><i>' + esc(x.consigne) + '</i></span>' +
          '<span class="ex-s">' + (x.score !== null && x.score !== undefined
              ? '<b class="' + (x.score >= x.max*0.8 ? 'ok' : 'mid') + '">' + x.score + '/' + x.max + '</b>'
              : st[2]) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="card" style="margin-top:15px"><h2>📖 الدروس الرسمية المرتبطة</h2>' +
        listeLeconsOfficielles() + '</div>';
  }

  function listeLeconsOfficielles(){
    return '<div class="lecons-off">' + (enfant.lecons_officielles || []).map(l => {
      const st = { termine:['✓ مكتمل','ok'], en_cours:['▶ جاري' +
        (l.progression ? ' - ' + l.progression + '%' : ''),'mid'],
        verrouille:['🔒 مقفل',''] }[l.statut] || ['—',''];
      return '<div class="lo-i ' + st[1] + '">' +
        '<span class="lo-n">' + l.icon + '</span>' +
        '<span class="lo-b"><b>الدرس ' + l.n + ': <span class="de-display">' + esc(l.de) +
          '</span> — ' + esc(l.ar) + '</b>' +
        '<i>المفردات: ' + esc(l.vocabulaire) + ' • القواعد: ' + esc(l.grammaire) +
          ' • النشاط: ' + esc(l.activite) + '</i>' +
        '<i class="lo-m">⏱️ ' + l.duree + ' دقيقة · مع ' + esc(l.prof) + '</i></span>' +
        '<span class="chip ' + st[1] + '">' + st[0] + '</span></div>';
    }).join('') + '</div>';
  }

  /* ══════ 5. PROGRAMME OFFICIEL ══════ */
  function vueProgramme(){
    return '<div class="card"><h2>📜 البرنامج الرسمي لوزارة التربية الوطنية</h2>' +
      '<div class="po-sub">السنة الثانية ثانوي — منهاج ' + esc(D._meta.annee_scolaire) + '</div>' +
      '<div class="po-grid">' + (enfant.programme_officiel || []).map(t => {
        const pct = Math.round(t.complet / t.total * 100);
        return '<div class="po-t"><div class="po-h">' + t.icon + ' ' + esc(t.trimestre) + '</div>' +
          '<div class="po-d">' + esc(t.periode) + '</div>' +
          '<div class="po-u">' + t.lecons + ' دروس</div>' +
          '<div class="progress-wrap"><div class="progress" style="width:' + pct + '%"></div></div>' +
          '<div class="po-lbl">' + (t.complet ? esc(t.label) : esc(t.label)) + '</div>' +
          '<span class="chip ' + (t.statut === 'en_cours' ? 'ok' : '') + '">' +
            (t.statut === 'en_cours' ? '🟢 جاري' : '🔜 قادم') + '</span></div>';
      }).join('') + '</div></div>' +
      '<div class="card"><h2>📖 الدروس الرسمية — ' + (enfant.lecons_officielles||[]).length + ' دروس</h2>' +
        listeLeconsOfficielles() + '</div>' +
      '<div class="card"><h2>🎯 أهداف التعلّم — الوحدة 1</h2>' +
        '<ul style="margin:0 22px;font-size:13.5px;color:var(--m);line-height:2">' +
        ['التعريف بالنفس (الاسم، العمر، الجنسية)','وصف العائلة','التحيات والتوديع',
         'تصريف sein و haben','أدوات الاستفهام W-Fragen']
          .map(o => '<li>✓ ' + o + '</li>').join('') + '</ul></div>';
  }

  /* ══════ 6. PROCHAINES SÉANCES ══════ */
  function vueProchaines(){
    return '<div class="card"><h2>🗓️ الحصص القادمة</h2>' +
      '<div class="chips" style="margin-bottom:14px">' +
        '<span class="sec-pill">📅 ' + (D.prochaines_seances||[]).length + ' حصص مبرمجة</span>' +
        '<span class="sec-pill or">🔔 التنبيهات مُفعَّلة</span></div>' +
      listeProchaines(0) + '</div>' +
      '<div class="card"><h2>📅 الرزنامة الأسبوعية للقسم</h2>' +
      '<div class="privacy">الرزنامة الكاملة متاحة في قسم <b>🏫 القسم</b> — ' +
      '<button class="btn btn-o btn-sm" data-go="classe">فتح القسم</button></div></div>';
  }

  function listeProchaines(lim){
    const list = (D.prochaines_seances || []).slice(0, lim || undefined);
    return '<div class="prx-list">' + list.map(s => {
      const cls = s.type === 'join' ? 'live' : (s.type === 'soon' ? 'soon' : 'later');
      return '<div class="prx ' + cls + '">' +
        '<div class="prx-d"><b>' + esc(s.jour) + '</b><span>' + esc(s.mois) + '</span>' +
          '<i>' + esc(s.heure) + '</i></div>' +
        '<div class="prx-b"><b>' + esc(s.matiere) + '</b>' +
          '<i>مع ' + esc(s.prof) + ' • ' + esc(s.duree) + '</i>' +
          '<i class="prx-m">🏫 ' + esc(s.salle) + ' · قسم ' + esc(s.section) + '</i></div>' +
        (s.type === 'join'
          ? '<button class="btn btn-p btn-sm" data-go="live">📹 ' + esc(s.action) + '</button>'
          : '<span class="prx-t" data-countdown="' + esc(s.heure_iso) + '">' + esc(s.action) + '</span>') +
        '</div>';
    }).join('') + '</div>';
  }

  function demarrerCompteRebours(){
    clearInterval(tReste);
    tReste = setInterval(() => {
      $$('[data-countdown]').forEach(el => {
        const t = Date.parse(el.dataset.countdown);
        if(isNaN(t)) return;
        const diff = t - Date.now();
        if(diff <= 0){ el.textContent = '🔴 جارية الآن'; return; }
        const j = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5),
              m = Math.floor(diff % 36e5 / 6e4);
        el.textContent = j > 0 ? '⏳ بعد ' + j + ' يوم' : (h > 0 ? '⏳ بعد ' + h + ' س ' + m + ' د'
                                                                  : '⏳ بعد ' + m + ' د');
      });
    }, 30000);
  }

  /* ══════ 7. MESSAGES ══════ */
  function vueMessages(){
    const lus = lusSet();
    const nonLus = (D.messages_profs || []).reduce((a,m,i) => a + (lus[i] ? 0 : (m.non_lus||0)), 0);
    return '<div class="card"><h2>💬 تواصل مع أساتذتك' +
      (nonLus ? ' <span class="chip ex">' + nonLus + ' غير مقروءة</span>' : '') + '</h2>' +
      (D.messages_profs || []).map((m,i) =>
        '<div class="msgrow' + (lus[i] ? ' lu' : '') + '" data-pmsg="' + i + '">' +
        '<div class="msg-av">' + esc(m.init) + '</div>' +
        '<div class="msg-b"><div class="msg-h"><b>' + esc(m.nom) + '</b>' +
          (m.urgent ? '<span class="chip ex">عاجل</span>' : '') +
          '<span class="msg-d">' + esc(m.temps) + '</span></div>' +
        '<div class="msg-t">' + esc(m.texte) + '</div></div>' +
        (lus[i] ? '' : '<span class="dot-new"></span>' +
          (m.non_lus ? '<span class="badge-c">' + m.non_lus + '</span>' : '')) + '</div>').join('') +
      '<a class="btn btn-w btn-block" target="_blank" rel="noopener" href="' + waLink(
        'السلام عليكم أستاذ خريف، أنا ولي التلميذ(ة) ' + enfant.nom_complet + ' وأريد الاستفسار.') +
      '">💬 راسل الأستاذ الرئيسي — ' + esc(D.contact.whatsapp_affiche) + '</a></div>' +
      '<div class="card"><h2>👨‍🏫 الأساتذة المتاحون للدروس الخصوصية</h2>' +
      '<div class="chips">' + (D.profs_particuliers||[]).map(p =>
        '<span class="fchip on">' + esc(p.init) + ' ' + esc(p.nom) + ' · ' +
        p.prix.toLocaleString('fr-FR') + ' د.ج/س</span>').join('') + '</div>' +
      '<button class="btn btn-o btn-block" data-paong="cours">👨‍🏫 عرض كل الأساتذة</button></div>';
  }
  function lusSet(){ try{ return JSON.parse(localStorage.getItem(K_MSG) || '{}'); }catch(e){ return {}; } }
  function waLink(txt){ return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt); }

  /* ══════ 8. COURS PARTICULIERS + TARIFS ══════ */
  function vueCours(){
    return '<div class="card"><h2>👨‍🏫 دروس خصوصية مع أساتذتنا</h2>' +
      '<div class="profs">' + (D.profs_particuliers || []).map(p =>
        '<div class="profc"><div class="pc-av">' + esc(p.init) + '</div>' +
        '<div class="pc-b"><div class="pc-t">' + esc(p.nom) + '</div>' +
        '<div class="pc-m">' + esc(p.titre) + '<br>' + esc(p.ville) + ' • ' + esc(p.exp) + '</div>' +
        '<div class="pc-m" style="color:var(--or2)">★★★★★ ' + esc(p.note) +
          ' <span style="color:var(--m)">(' + esc(p.avis) + ' رأي)</span></div>' +
        '<div class="pc-d">' + esc(p.desc) + '</div>' +
        '<div class="chips" style="margin:8px 0">' +
          (p.tags||[]).map(t => '<span class="fchip on">' + esc(t) + '</span>').join('') + '</div>' +
        '<div class="pc-f"><div class="pc-p"><b>' + p.prix.toLocaleString('fr-FR') + '</b> د.ج / ساعة</div>' +
        '<button class="btn btn-g btn-sm" data-go="reservation">احجز</button></div></div></div>').join('') + '</div></div>' +
      '<div class="card"><h2>💳 العروض والأسعار</h2>' +
      '<div class="tarifs">' + (D.tarifs || []).map(t =>
        '<div class="tarif' + (t.populaire ? ' pop' : '') + '">' +
        (t.populaire ? '<span class="tar-badge">⭐ الأكثر طلباً</span>' : '') +
        '<div class="tar-t">' + esc(t.offre) + '</div>' +
        '<div class="tar-p">' + esc(t.prix) + '</div>' +
        '<div class="tar-d">' + esc(t.duree) + '</div>' +
        '<ul class="tar-u">' + (t.inclus||[]).map(x => '<li>✓ ' + esc(x) + '</li>').join('') + '</ul>' +
        '<a class="btn ' + (t.populaire ? 'btn-g' : 'btn-o') + ' btn-block" target="_blank" rel="noopener" ' +
        'href="' + waLink('السلام عليكم، أريد الاشتراك في عرض : ' + t.offre) + '">📲 اشترك</a>' +
        '</div>').join('') + '</div>' +
      '<div class="privacy" style="margin-top:14px">💳 وسائل الدفع المقبولة : ' +
        (D.moyens_paiement||[]).map(m => '<span class="chip">' + esc(m) + '</span>').join(' ') +
      '</div>' +
      '<div class="hero-offer" style="margin-top:12px">🎁 ' + esc(D.contact.offre) +
        ' — ابعث على واتساب : <b>' + esc(D.contact.whatsapp_affiche) + '</b> · ' +
        esc(D.contact.message_type) + '</div></div>';
  }

  /* ══════ RAPPORTS ══════ */
  function texteRapport(){
    const e = enfant, mp = moyennePonderee(e), ms = moyenneSimple(e);
    const p = e.presence || [];
    const ok = p.filter(x => x.ok).length;
    const L = [];
    L.push('════════════════════════════════════════════════');
    L.push('   الثانوية الافتراضية الجزائرية — فضاء الأولياء');
    L.push('   Virtuelle Algerische Schule — Elternbericht');
    L.push('════════════════════════════════════════════════');
    L.push('');
    L.push('التلميذ(ة) : ' + e.nom_complet + '   (' + e.matricule + ')');
    L.push('القسم      : ' + e.section_ar + ' · ' + e.niveau + ' · ' + e.filiere);
    L.push('الولاية    : ' + e.code_wilaya + ' — ' + e.wilaya + ' · ' + e.ville);
    L.push('السنة      : ' + D._meta.annee_scolaire);
    L.push('التاريخ    : ' + new Date().toLocaleString('fr-DZ'));
    L.push('');
    L.push('── 📊 النتائج ──');
    (e.examens || []).forEach(x => {
      const d = x.detail || {};
      L.push('  ' + x.titre + ' (' + x.date + ') — معامل ×' + (x.coef||1));
      L.push('     📖 I : ' + (d.I !== undefined ? d.I : '—') + '/8   ·   ' +
             '🔤 II : ' + (d.II !== undefined ? d.II : '—') + '/8   ·   ' +
             '✍️ III : ' + (d.III !== undefined ? d.III : '—') + '/4');
      L.push('     المجموع : ' + formatNote(x.note) + '/' + x.bareme + '   ·   ' +
             readiness(x.note).l);
      if(x.appreciation) L.push('     ملاحظة : ' + x.appreciation);
    });
    L.push('');
    L.push('  المعدّل العام المرجّح : ' + (mp === null ? '—' : mp.toFixed(2)) + '/20');
    L.push('  المعدّل البسيط        : ' + (ms === null ? '—' : ms.toFixed(2)) + '/20');
    L.push('  الجاهزية              : ' + readiness(mp).l);
    L.push('');
    L.push('── ✅ الحضور ──');
    L.push('  نسبة الحضور : ' + (p.length ? Math.round(ok/p.length*100) : 0) + '%  (' +
           ok + '/' + p.length + ')');
    L.push('  الغيابات : ' + e.absences + '   ·   التأخّرات : ' + e.retards);
    p.forEach(x => {
      L.push('   ' + (x.ok ? '[✅]' : '[❌]') + ' ' + x.jour + ' — ' + x.lecon +
             ' — ' + x.statut + (x.heure ? ' (' + x.heure + ')' : ''));
    });
    L.push('');
    L.push('── 🎯 التمارين ──');
    (e.exercices || []).forEach(x => {
      L.push('   [' + (x.statut === 'termine' ? '✅' : x.statut === 'en_cours' ? '▶' : '🔒') +
             '] ' + x.titre + (x.score !== null && x.score !== undefined
             ? ' — ' + x.score + '/' + x.max : ' — ' + x.statut));
    });
    L.push('');
    L.push('── 📜 البرنامج الرسمي ──');
    (e.programme_officiel || []).forEach(t => {
      L.push('   ' + t.icon + ' ' + t.trimestre + ' (' + t.periode + ') — ' +
             t.lecons + ' دروس — ' + t.label);
    });
    L.push('');
    L.push('── 📋 الامتحان القادم ──');
    if(e.examen_a_venir){
      const x = e.examen_a_venir;
      L.push('   ' + x.titre + ' — ' + x.quand);
      L.push('   ' + x.duree + ' · ' + x.programme + ' · ' + x.coef);
    }
    L.push('');
    L.push('── 🗓️ الحصص القادمة ──');
    (D.prochaines_seances || []).forEach(s => {
      L.push('   ' + s.mois + ' ' + s.jour + ' · ' + s.heure + ' — ' + s.matiere +
             ' · ' + s.prof + ' · ' + s.duree);
    });
    L.push('');
    L.push('── 💬 ملاحظة الأستاذ ──');
    L.push('   ' + e.appreciation_generale);
    L.push('');
    L.push('════════════════════════════════════════════════');
    L.push('  الأستاذ خريف أحمد · 📱 ' + D.contact.whatsapp_affiche);
    L.push('  « الرجوع إلى الأصل فضيلة — نرافق أبناءكم نحو النجاح... خطوة بخطوة »');
    L.push('════════════════════════════════════════════════');
    return L.join('\n');
  }

  function genererRapport(){
    const m = $('#modal'), c = $('#modalCard'); if(!m || !c) return;
    c.innerHTML = '<div class="modal-h"><div><h2 style="margin:0;font-family:var(--ff-ar-display)">' +
      '📄 تقرير الولي — ' + esc(enfant.nom_complet) + '</h2>' +
      '<div class="fiche-de">' + esc(enfant.matricule) + ' · ' + esc(enfant.section_ar) + '</div></div>' +
      '<button class="close-x" id="mClose">✕</button></div>' +
      '<div class="modal-b"><textarea class="txt-in" id="rapTxt" style="min-height:340px;' +
      'font-family:var(--ff-de);direction:rtl">' + esc(texteRapport()) + '</textarea>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:13px">' +
      '<button class="btn btn-p btn-sm" id="rapPrint">🖨️ طباعة / PDF</button>' +
      '<button class="btn btn-o btn-sm" id="rapCopy">📋 نسخ</button>' +
      '<button class="btn btn-g btn-sm" id="rapDl">📥 تنزيل .txt</button>' +
      '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" id="rapWa" href="#">💬 إرسال واتساب</a>' +
      '</div><div class="privacy" style="margin-top:13px">🔒 ' +
      esc(D._meta.confidentialite) + '</div></div>';
    m.hidden = false; document.body.style.overflow = 'hidden';
    const w = $('#rapWa');
    if(w) w.href = waLink(texteRapport().slice(0, 1800));
    const pr = $('#rapPrint');
    if(pr) pr.addEventListener('click', () => { window.print(); });
    const cp = $('#rapCopy');
    if(cp) cp.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText($('#rapTxt').value); toast('📋 نُسخ التقرير','ok'); }
      catch(e){ toast('⚠️ تعذّر النسخ','ko'); }
    });
    const dl = $('#rapDl');
    if(dl) dl.addEventListener('click', () => {
      try{
        const blob = new Blob(['\uFEFF' + $('#rapTxt').value], { type:'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url;
        a.download = 'rapport-parent-' + enfant.id + '-' + Date.now() + '.txt';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        toast('📥 تم تنزيل التقرير','ok');
      }catch(e){ toast('⚠️ تعذّر التنزيل','ko'); }
    });
  }

  /* ══════ NOTIFICATIONS ══════ */
  function notifier(){
    if(!('Notification' in window)){ toast('🔕 المتصفح لا يدعم التنبيهات','ko'); return; }
    if(Notification.permission === 'granted'){
      new Notification('🔔 التنبيهات مُفعَّلة', {
        body: 'ستصلك تنبيهات الحصص والفروض الخاصة بـ ' + enfant.nom_complet,
        icon: 'assets/logo.png'
      });
      toast('🔔 التنبيهات مُفعَّلة','ok'); sauveNotif(true);
      return;
    }
    Notification.requestPermission().then(p => {
      if(p === 'granted'){
        new Notification('🔔 التنبيهات مُفعَّلة', {
          body: 'ستصلك تنبيهات الحصص والفروض', icon: 'assets/logo.png' });
        toast('🔔 التنبيهات مُفعَّلة','ok'); sauveNotif(true);
      } else { toast('⚠️ تم رفض الإذن','ko'); sauveNotif(false); }
    }).catch(() => toast('⚠️ تعذّر طلب الإذن','ko'));
  }
  function sauveNotif(v){ try{ localStorage.setItem(K_NOT, v ? '1' : '0'); }catch(e){} }
  function verifierNotifications(){
    let on = false;
    try{ on = localStorage.getItem(K_NOT) === '1'; }catch(e){}
    if(!on || !('Notification' in window) || Notification.permission !== 'granted') return;
    const x = enfant.examen_a_venir;
    if(x){
      setTimeout(() => {
        try{
          new Notification('📋 ' + x.titre, {
            body: x.quand + ' · ' + x.duree + ' · ' + x.programme, icon:'assets/logo.png' });
        }catch(e){}
      }, 2500);
    }
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-paong]');
    if(o){ onglet = o.dataset.paong;
      $$('#paOng .ong').forEach(x => x.classList.toggle('on', x.dataset.paong === onglet));
      paint(); return; }
    const en = ev.target.closest('[data-enfant]');
    if(en){ enfant = (D.enfants||[]).filter(x => x.id === en.dataset.enfant)[0] || enfant;
      ecrireSel(enfant.id); render();
      toast('🧒 تم التبديل إلى ' + enfant.nom_complet, 'ok'); return; }
    const ex = ev.target.closest('[data-exo]');
    if(ex){ onglet = 'exercices'; paint();
      if(window.DZ && DZ.go) DZ.go('seances');
      return; }
    if(ev.target.closest('#pPdf')){ genererRapport(); return; }
    if(ev.target.closest('#pTxt')){
      try{
        const blob = new Blob(['\uFEFF' + texteRapport()], { type:'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = 'rapport-parent-' + enfant.id + '.txt';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        toast('📥 تم تنزيل التقرير النصي','ok');
      }catch(e){ toast('⚠️ تعذّر التنزيل','ko'); }
      return; }
    if(ev.target.closest('#pWa')){ window.open(waLink(texteRapport().slice(0,1800)), '_blank'); return; }
    if(ev.target.closest('#pNotif')){ notifier(); return; }

    const ms = ev.target.closest('[data-pmsg]');
    if(ms){
      const i = ms.dataset.pmsg, s = lusSet(); s[i] = true;
      try{ localStorage.setItem(K_MSG, JSON.stringify(s)); }catch(e){}
      ms.classList.add('lu');
      const dn = ms.querySelector('.dot-new'); if(dn) dn.remove();
      const bc = ms.querySelector('.badge-c'); if(bc) bc.remove();
      return;
    }
  });

  document.addEventListener('dz:view', e => {
    if(e.detail === 'parents') boot();
    else clearInterval(tReste);
  });
  window.addEventListener('beforeunload', () => clearInterval(tReste));

  /* Écrase la version légère de modules.js */
  window.renderParents = boot;
  window.DZ_PARENTS = { boot:boot, render:render, texteRapport:texteRapport,
                        moyennePonderee:moyennePonderee, readiness:readiness,
                        PRET:PRET, CONS:CONS };
})();
