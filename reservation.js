/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — reservation.js
   🗓️ حجز الحصص الخصوصية · Réservation de cours particuliers
   Reproduit la fenêtre « احجز » de la maquette officielle :
     Type de cours → Durée (30/60/90) → Date et créneau (14:00→19:00)
     → Cours + Frais de service (10 %) = Total → Confirmer la réservation
   + « Mes réservations » avec statuts et annulation gratuite à 24 h
   Prix en د.ج (la maquette affichait des euros ; même mécanisme de calcul)
   Réservations strictement locales (localStorage) — confirmation par WhatsApp
   ══════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (m,t) => { if(window.DZ && DZ.toast) DZ.toast(m, t); };

  const SRC   = 'assets/bdd/reservation.json';
  const K_RSV = 'dz_de_reservations_v1';
  const K_GRATUIT = 'dz_de_premiere_gratuite_v1';

  let D = null;
  let vue = 'liste';                  /* liste | resa | mes */
  let choix = { prof:null, type:null, duree:null, date:null, heure:null, eleve:'', note:'' };

  /* ── Chargement ── */
  async function boot(){
    const box = $('#reservationBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل قائمة الأساتذة…</div>';
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
  function resas(){ try{ return JSON.parse(localStorage.getItem(K_RSV) || '[]'); }catch(e){ return []; } }
  function saveResas(liste){
    try{ localStorage.setItem(K_RSV, JSON.stringify(liste.slice(-60))); }catch(e){}
  }
  function gratuitUtilise(){ try{ return localStorage.getItem(K_GRATUIT) === '1'; }catch(e){ return false; } }
  function marquerGratuit(){ try{ localStorage.setItem(K_GRATUIT, '1'); }catch(e){} }

  /* ── Calcul du prix — cours + frais de service = total ── */
  function calculer(prof, duree, gratuit){
    if(!prof || !duree) return { cours:0, frais:0, total:0, gratuit:false };
    let cours = Math.round(prof.prix_n * duree.coef);
    const isGratuit = Boolean(gratuit) && duree.min === D._meta.premiere_seance_gratuite_min;
    if(isGratuit) cours = 0;
    const pct = D._meta.frais_service_pct || 10;
    const frais = Math.round(cours * pct / 100);
    return { cours: cours, frais: frais, total: cours + frais, gratuit: isGratuit };
  }

  /* ── Référence de réservation ── */
  function reference(prof, date, heure){
    const base = (prof.id + date + heure + Date.now()).toUpperCase();
    let h = 0;
    for(let i = 0; i < base.length; i++){ h = (h * 31 + base.charCodeAt(i)) % 46656; }
    const s = h.toString(36).toUpperCase();
    return 'DZ-' + prof.id.slice(0, 2).toUpperCase() + '-' +
      date.replace(/-/g, '').slice(2) + '-' + heure.replace(':', '') + '-' +
      ('000' + s).slice(-3);
  }

  /* ── Rendu ── */
  function render(){
    const box = $('#reservationBody'); if(!box) return;
    box.innerHTML = entete() + onglets() +
      '<div id="rsvContenu">' +
        (vue === 'liste' ? vueListe() : (vue === 'resa' ? vueResa() : vueMes())) +
      '</div>';
    if(vue === 'resa') majPrix();
  }

  function entete(){
    const m = D._meta;
    const min = Math.min.apply(null, D.profs.map(p => p.prix_n));
    const max = Math.max.apply(null, D.profs.map(p => p.prix_n));
    return '<div class="card rs-hero">' +
      '<div><div class="ch-badge">🗓️ حجز الحصص الخصوصية — ' +
        (D.profs.length) + ' أساتذة متاحون</div>' +
      '<h2>' + esc(m.titre_de) + '</h2>' +
      '<div class="ch-sub">' + esc(D.tarifs_reference.marche) + ' في السوق · ' +
        'نحن : <b>' + min.toLocaleString('fr-FR') + ' – ' + max.toLocaleString('fr-FR') +
        ' د.ج/ساعة</b> · frais de service ' + m.frais_service_pct + ' %</div>' +
      '<div class="chips" style="margin-top:10px">' +
        '<span class="sec-pill">🎁 الحصّة الأولى مجانية (٣٠ د) حتى ' +
          (m.offre_gratuite_jusqu_au || '') + '</span>' +
        '<span class="sec-pill or">⏱️ إلغاء مجاني حتى ' + m.delai_annulation_h + ' سا</span>' +
        '<span class="sec-pill rg">💳 ' + D.moyens_paiement.length + ' وسائل دفع</span>' +
      '</div></div>' +
      '<div class="rs-act">' +
        '<button class="btn btn-p" id="rsNouveau">🗓️ حجز جديد</button>' +
        '<button class="btn btn-o" id="rsMes">📋 حجوزاتي (' + resas().length + ')</button>' +
      '</div></div>';
  }

  function onglets(){
    return '<div class="onglets" id="rsOng">' +
      '<button class="ong' + (vue==='liste'?' on':'') + '" data-rsvue="liste">👨‍🏫 الأساتذة</button>' +
      '<button class="ong' + (vue==='resa'?' on':'') + '" data-rsvue="resa">🗓️ الحجز</button>' +
      '<button class="ong' + (vue==='mes'?' on':'') + '" data-rsvue="mes">📋 حجوزاتي</button>' +
      '</div>';
  }

  /* ══════ 1. Liste des professeurs ══════ */
  function vueListe(){
    return '<div class="rs-grid">' + D.profs.map(profCard).join('') + '</div>' +
      '<div class="card"><h2>📜 شروط الحجز</h2><ul class="rs-regles">' +
        D.regles.map(r => '<li>' + r + '</li>').join('') + '</ul>' +
      '<div class="privacy" style="margin-top:12px">🔒 ' + esc(D._meta.confidentialite) +
      '</div></div>';
  }

  function profCard(p){
    const types = (p.types || []).map(t => D.types_cours.filter(x => x.id === t)[0])
      .filter(Boolean);
    return '<article class="rs-card' + (p.fondateur ? ' fondateur' : '') + '">' +
      '<div class="rs-h"><span class="rs-av">' + esc(p.init) + '</span>' +
        '<div class="rs-t"><b>' + esc(p.nom) + '</b>' +
        '<i class="de-display">' + esc(p.nom_de) + '</i>' +
        '<i>' + esc(p.titre) + ' · ' + esc(p.ville) + ' • ' + esc(p.exp) + '</i></div>' +
        (p.fondateur ? '<span class="rs-badge">👑 المؤسس</span>' : '') + '</div>' +
      '<div class="rs-note">★★★★★ <b>' + esc(p.note) + '</b>' +
        '<span>(' + esc(p.avis) + ' رأي)</span></div>' +
      '<p class="rs-desc">' + esc(p.desc) + '</p>' +
      '<div class="chips">' + p.tags.map(t =>
        '<span class="fchip on">' + esc(t) + '</span>').join('') + '</div>' +
      '<div class="rs-types">' + types.map(t =>
        '<span class="rs-ty">' + t.icon + ' ' + esc(t.ar) + '</span>').join('') + '</div>' +
      '<div class="rs-f"><div class="rs-p"><b>' + p.prix_n.toLocaleString('fr-FR') +
        '</b> د.ج / ساعة</div>' +
        '<button class="btn btn-g btn-sm" data-reserver="' + esc(p.id) + '">احجز</button></div>' +
      '</article>';
  }

  /* ══════ 2. Fenêtre de réservation ══════ */
  function vueResa(){
    const profs = D.profs;
    const sel = choix.prof ? D.profs.filter(p => p.id === choix.prof)[0] : null;
    const types = sel ? (sel.types || []).map(t =>
        D.types_cours.filter(x => x.id === t)[0]).filter(Boolean) : D.types_cours;

    return '<div class="card rs-form">' +
      '<h2>🗓️ حجز حصّة خصوصية</h2>' +
      '<div class="privacy" style="margin-bottom:15px">' +
        'اختر الأستاذ ثم نوع الحصّة ثم المدة ثم التاريخ والتوقيت — الحساب فوري وشفّاف.</div>' +

      /* — Professeur — */
      '<div class="rs-fld"><label>👨‍🏫 الأستاذ</label>' +
        '<select data-champ="prof">' +
          profs.map(p => '<option value="' + esc(p.id) + '"' +
            (choix.prof === p.id ? ' selected' : '') + '>' +
            esc(p.nom) + ' — ' + esc(p.ville) + ' · ' +
            p.prix_n.toLocaleString('fr-FR') + ' د.ج/س · ★' + esc(p.note) +
            '</option>').join('') +
        '</select></div>' +

      /* — Type de cours — */
      '<div class="rs-fld"><label>📚 نوع الحصّة</label>' +
        '<div class="rs-opts">' + types.map(t =>
          '<button type="button" class="rs-o' + (choix.type === t.id ? ' on' : '') +
          '" data-champ="type" data-v="' + esc(t.id) + '">' + t.icon + ' ' + esc(t.ar) +
          '<i class="de-display">' + esc(t.de) + '</i></button>').join('') + '</div></div>' +

      /* — Durée — */
      '<div class="rs-fld"><label>⏱️ المدة</label>' +
        '<div class="rs-opts">' + D.durees.map(d =>
          '<button type="button" class="rs-o' + (choix.duree === d.min ? ' on' : '') +
          '" data-champ="duree" data-v="' + d.min + '">' + esc(d.ar) +
          (sel ? '<i>' + Math.round(sel.prix_n * d.coef).toLocaleString('fr-FR') + ' د.ج</i>' : '') +
          '</button>').join('') + '</div></div>' +

      /* — Date — */
      '<div class="rs-fld"><label>📅 التاريخ</label>' +
        '<input type="date" data-champ="date" value="' + esc(choix.date || '') + '" min="' +
        aujourdHui() + '" max="' + dansNDays(21) + '"></div>' +

      /* — Créneau — */
      '<div class="rs-fld"><label>🕒 التوقيت</label>' +
        '<div class="rs-opts heures">' + D.creneaux.map(c =>
          '<button type="button" class="rs-o hr' + (choix.heure === c.h ? ' on' : '') +
          '" data-champ="heure" data-v="' + esc(c.h) + '">' + esc(c.ar) + '</button>').join('') +
        '</div></div>' +

      /* — Élève + note — */
      '<div class="rs-fld"><label>🧑‍🎓 اسم التلميذ</label>' +
        '<input type="text" data-champ="eleve" value="' + esc(choix.eleve || '') +
        '" placeholder="مثال : أحمد محمد"></div>' +
      '<div class="rs-fld"><label>📝 ملاحظة للأستاذ (اختياري)</label>' +
        '<textarea class="txt-in" data-champ="note" rows="2" placeholder="المستوى، الهدف، الصعوبات…">' +
        esc(choix.note || '') + '</textarea></div>' +

      /* — Récapitulatif de prix — */
      '<div class="rs-prix" id="rsPrix">' + recPrix() + '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:15px">' +
        '<button class="btn btn-p" id="rsConfirmer">✅ Confirmer la réservation</button>' +
        '<button class="btn btn-o" id="rsAnnuler">↩️ رجوع</button>' +
      '</div>' +
      '<div id="rsMsg"></div>' +
      '</div>';
  }

  function recPrix(){
    const sel = choix.prof ? D.profs.filter(p => p.id === choix.prof)[0] : null;
    const dur = choix.duree ? D.durees.filter(d => d.min === +choix.duree)[0] : null;
    if(!sel || !dur){
      return '<div class="rs-pr"><span>🧮 الحساب</span><b>—</b></div>' +
        '<div class="rs-hint">اختر الأستاذ والمدة لعرض الحساب.</div>';
    }
    const peutGratuit = !gratuitUtilise() && !offreExpiree();
    const c = calculer(sel, dur, peutGratuit);
    const ty = choix.type ? D.types_cours.filter(t => t.id === choix.type)[0] : null;
    return '<div class="rs-pr"><span>' + (ty ? ty.icon + ' ' + esc(ty.ar) : '📚 الحصّة') +
        ' (' + dur.min + ' دقيقة)</span><b>' +
        c.cours.toLocaleString('fr-FR') + ' د.ج</b></div>' +
      (c.gratuit
        ? '<div class="rs-pr ok"><span>🎁 الحصّة الأولى مجانية</span><b>−' +
          Math.round(sel.prix_n * dur.coef).toLocaleString('fr-FR') + ' د.ج</b></div>'
        : '') +
      '<div class="rs-pr"><span>💼 Frais de service (' + D._meta.frais_service_pct + ' %)</span>' +
        '<b>' + c.frais.toLocaleString('fr-FR') + ' د.ج</b></div>' +
      '<div class="rs-total"><span>Total</span><b>' + c.total.toLocaleString('fr-FR') +
        ' د.ج</b></div>' +
      (c.gratuit ? '<div class="rs-hint">🎁 تستفيد من الحصّة الأولى المجانية (٣٠ دقيقة) — ' +
        'لا تُحتسب سوى رسوم الخدمة.</div>' : '');
  }

  function majPrix(){
    const el = $('#rsPrix');
    if(el) el.innerHTML = recPrix();
  }

  function aujourdHui(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function dansNDays(n){
    const d = new Date(Date.now() + n * 864e5);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function offreExpiree(){
    const f = D._meta.offre_gratuite_jusqu_au;
    if(!f) return false;
    return Date.now() > Date.parse(f + 'T23:59:59');
  }
  function libelleDate(iso){
    if(!iso) return '—';
    const j = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const m = ['جانفي','فيفري','مارس','أفريل','ماي','جوان','جويلية','أوت','سبتمبر',
               'أكتوبر','نوفمبر','ديسمبر'];
    const d = new Date(iso + 'T12:00:00');
    if(isNaN(d.getTime())) return iso;
    return j[d.getDay()] + ' ' + d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ══════ Confirmation ══════ */
  function confirmer(){
    const manquants = [];
    if(!choix.prof)   manquants.push('الأستاذ');
    if(!choix.type)   manquants.push('نوع الحصّة');
    if(!choix.duree)  manquants.push('المدة');
    if(!choix.date)   manquants.push('التاريخ');
    if(!choix.heure)  manquants.push('التوقيت');
    if(!choix.eleve || !choix.eleve.trim()) manquants.push('اسم التلميذ');

    const msg = $('#rsMsg');
    if(manquants.length){
      if(msg) msg.innerHTML = '<div class="fbk ko" style="margin-top:13px">⚠️ الحقول الناقصة : ' +
        manquants.join(' · ') + '</div>';
      toast('⚠️ أكمل : ' + manquants.join('، '), 'ko');
      return;
    }
    const sel = D.profs.filter(p => p.id === choix.prof)[0];
    const dur = D.durees.filter(d => d.min === +choix.duree)[0];
    const peutGratuit = !gratuitUtilise() && !offreExpiree();
    const c = calculer(sel, dur, peutGratuit);
    const ty = D.types_cours.filter(t => t.id === choix.type)[0];
    const ref = reference(sel, choix.date, choix.heure);

    const liste = resas();
    liste.push({
      ref: ref, prof_id: sel.id, prof_nom: sel.nom, prof_init: sel.init,
      prof_ville: sel.ville, type: ty.ar, type_de: ty.de, icon: ty.icon,
      duree: dur.min, date: choix.date, date_ar: libelleDate(choix.date),
      heure: choix.heure, eleve: choix.eleve.trim(), note: (choix.note || '').trim(),
      cours: c.cours, frais: c.frais, total: c.total, gratuit: c.gratuit,
      statut: 'en_attente', cree_le: new Date().toISOString(),
      peut_annuler_jusqu: Date.parse(choix.date + 'T' + choix.heure + ':00') -
        (D._meta.delai_annulation_h * 36e5)
    });
    saveResas(liste);
    if(c.gratuit) marquerGratuit();

    const txt = texteConfirmation(liste[liste.length - 1]);
    if(msg){
      msg.innerHTML = '<div class="fbk ok" style="margin-top:15px">' +
        '<b>✅ تم إرسال طلب الحجز</b>' +
        '<div class="rs-ref">🔖 رقم الحجز : <b>' + esc(ref) + '</b></div>' +
        '<div class="reading" style="margin-top:11px">' + esc(txt).replace(/\n/g, '<br>') + '</div>' +
        '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:13px">' +
          '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" href="' +
            waLink(txt) + '">💬 إرسال عبر واتساب</a>' +
          '<button class="btn btn-o btn-sm" id="rsCopier">📋 نسخ</button>' +
          '<button class="btn btn-g btn-sm" id="rsVoirMes">📋 حجوزاتي</button>' +
        '</div>' +
        '<div class="privacy" style="margin-top:11px">⏳ فريق الدعم يؤكد الحجز خلال ساعة. ' +
        'الإلغاء مجاني حتى ' + D._meta.delai_annulation_h + ' ساعة قبل الموعد.</div></div>';
    }
    toast('✅ تم إرسال طلب الحجز · ' + ref, 'ok');
    const cp = $('#rsCopier');
    if(cp) cp.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText(txt); toast('📋 نُسخ الحجز','ok'); }
      catch(e){ toast('⚠️ تعذّر النسخ','ko'); }
    });
    const vm = $('#rsVoirMes');
    if(vm) vm.addEventListener('click', () => { vue = 'mes'; render(); });
    choix = { prof:null, type:null, duree:null, date:null, heure:null, eleve:'', note:'' };
  }

  function texteConfirmation(r){
    return [
      '════════════════════════════════',
      '  طلب حجز حصّة خصوصية — Deutsche Akademie',
      '════════════════════════════════',
      '🔖 رقم الحجز : ' + r.ref,
      '👨‍🏫 الأستاذ   : ' + r.prof_nom + ' (' + r.prof_ville + ')',
      '🧑‍🎓 التلميذ   : ' + r.eleve,
      '📚 النوع     : ' + r.type + ' — ' + r.type_de,
      '⏱️ المدة      : ' + r.duree + ' دقيقة',
      '📅 الموعد    : ' + r.date_ar + ' · ' + r.heure,
      (r.note ? '📝 ملاحظة    : ' + r.note : ''),
      '────────────────────────────────',
      '💰 الحصّة     : ' + r.cours.toLocaleString('fr-FR') + ' د.ج' +
        (r.gratuit ? '  (🎁 مجانية)' : ''),
      '💼 رسوم الخدمة: ' + r.frais.toLocaleString('fr-FR') + ' د.ج',
      '🧮 المجموع    : ' + r.total.toLocaleString('fr-FR') + ' د.ج',
      '💳 الدفع      : CIB · Edahabia · BaridiMob · CCP · نقداً',
      '────────────────────────────────',
      '⏳ في انتظار التأكيد (خلال ساعة)',
      '📱 ' + D._meta.contact.whatsapp_affiche,
      '« الرجوع إلى الأصل فضيلة — نرافق أبناءكم نحو النجاح »'
    ].join('\n');
  }

  function waLink(txt){
    return 'https://wa.me/' + (D._meta.contact.whatsapp || '213555577931').replace('+', '') +
      '?text=' + encodeURIComponent(txt);
  }

  /* ══════ 3. Mes réservations ══════ */
  function vueMes(){
    const liste = resas().slice().reverse();
    if(!liste.length){
      return '<div class="card empty"><div class="empty-i">📋</div>' +
        '<h3>لا توجد حجوزات بعد</h3><p>اختر أستاذاً واضغط «احجز» لبدء أول حجز.</p>' +
        '<button class="btn btn-p" data-rsvue="liste" style="margin-top:13px">' +
        '👨‍🏫 تصفّح الأساتذة</button></div>';
    }
    const stats = liste.reduce((a, r) => { a[r.statut] = (a[r.statut] || 0) + 1; return a; }, {});
    const depense = liste.filter(r => r.statut !== 'annulee')
      .reduce((a, r) => a + r.total, 0);
    const gratuit = liste.filter(r => r.gratuit).length;

    return '<div class="card"><div class="rs-stats">' +
        stat('📋', liste.length, 'حجز') +
        stat('⏳', stats.en_attente || 0, 'في الانتظار') +
        stat('✅', stats.confirmee || 0, 'مؤكَّدة') +
        stat('🏁', stats.terminee || 0, 'منجزة') +
        stat('❌', stats.annulee || 0, 'ملغاة') +
        stat('🎁', gratuit, 'مجانية') +
        stat('💰', depense.toLocaleString('fr-FR'), 'د.ج ملتزم بها') +
      '</div></div>' +
      '<div class="rs-liste">' + liste.map(r => {
        const st = (D.statuts || []).filter(s => s.id === r.statut)[0] ||
          { ar: r.statut, de: '' };
        const maintenant = Date.now();
        const peutAnnuler = r.statut === 'en_attente' || r.statut === 'confirmee';
        const dansDelai = peutAnnuler && maintenant < (r.peut_annuler_jusqu || 0);
        return '<article class="rs-item ' + r.statut + '">' +
          '<div class="rs-ih"><span class="rs-av sm">' + esc(r.prof_init) + '</span>' +
          '<div class="rs-it"><b>' + esc(r.icon || '📚') + ' ' + esc(r.type) + '</b>' +
            '<i>مع ' + esc(r.prof_nom) + ' · ' + esc(r.prof_ville) + '</i>' +
            '<i>🧑‍🎓 ' + esc(r.eleve) + '</i></div>' +
          '<span class="chip ' + (r.statut === 'annulee' ? 'ko' :
            r.statut === 'confirmee' ? 'ok' : '') + '">' + esc(st.ar) + '</span></div>' +
          '<div class="rs-ib">' +
            '<span class="rs-k">📅</span><span>' + esc(r.date_ar) + ' · <b class="de-in">' +
              esc(r.heure) + '</b></span>' +
            '<span class="rs-k">⏱️</span><span>' + r.duree + ' دقيقة</span>' +
            '<span class="rs-k">💰</span><span>' + (r.gratuit ? '🎁 مجانية + ' : '') +
              r.total.toLocaleString('fr-FR') + ' د.ج</span>' +
            '<span class="rs-k">🔖</span><span class="de-in">' + esc(r.ref) + '</span>' +
          '</div>' +
          (r.note ? '<div class="rs-note">📝 ' + esc(r.note) + '</div>' : '') +
          '<div class="rs-ia">' +
            '<a class="btn btn-w btn-sm" target="_blank" rel="noopener" href="' +
              waLink(texteConfirmation(r)) + '">💬 واتساب</a>' +
            '<button class="btn btn-o btn-sm" data-recopie="' + esc(r.ref) + '">📋 نسخ</button>' +
            (dansDelai
              ? '<button class="btn btn-o btn-sm" data-annuler="' + esc(r.ref) +
                '">❌ إلغاء (مجاني)</button>'
              : (peutAnnuler
                ? '<span class="rs-late">⚠️ تجاوزت مهلة الـ' +
                  D._meta.delai_annulation_h + ' سا — اتصل بالأستاذ</span>'
                : '')) +
          '</div></article>';
      }).join('') + '</div>' +
      '<div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<button class="btn btn-p" id="rsNouveau2">🗓️ حجز جديد</button>' +
        '<button class="btn btn-o" id="rsVider">🗑️ مسح السجل</button>' +
      '</div><div class="privacy" style="margin-top:12px">🔒 ' +
        esc(D._meta.confidentialite) + '</div></div>';

    function stat(i, n, l){
      return '<div class="rs-st"><div class="rs-sti">' + i + '</div>' +
        '<div class="rs-stn">' + n + '</div><div class="rs-stl">' + l + '</div></div>';
    }
  }

  function annuler(ref){
    const liste = resas();
    const r = liste.filter(x => x.ref === ref)[0];
    if(!r) return;
    const limite = r.peut_annuler_jusqu || 0;
    if(Date.now() >= limite){
      toast('⚠️ تجاوزت مهلة الإلغاء المجاني (' + D._meta.delai_annulation_h +
            ' سا) — اتصل بالأستاذ', 'ko');
      return;
    }
    if(!confirm('إلغاء الحجز ' + ref + ' ؟')) return;
    r.statut = 'annulee';
    r.annule_le = new Date().toISOString();
    saveResas(liste);
    render();
    toast('❌ تم إلغاء الحجز ' + ref, 'ok');
  }

  /* ══════ Événements ══════ */
  document.addEventListener('click', ev => {
    const o = ev.target.closest('[data-rsvue]');
    if(o){
      vue = o.dataset.rsvue;
      if(vue === 'resa' && !choix.prof && D.profs.length) choix.prof = D.profs[0].id;
      render();
      return;
    }
    const p = ev.target.closest('[data-reserver]');
    if(p){
      choix = { prof:p.dataset.reserver, type:null, duree:null, date:aujourdHui(),
                heure:null, eleve:choix.eleve || '', note:'' };
      const sel = D.profs.filter(x => x.id === choix.prof)[0];
      if(sel && sel.types && sel.types.length) choix.type = sel.types[0];
      choix.duree = 60;
      vue = 'resa';
      render();
      window.scrollTo({ top:0, behavior:'smooth' });
      return;
    }
    if(ev.target.closest('#rsNouveau, #rsNouveau2')){
      vue = 'resa';
      if(!choix.prof && D.profs.length){
        choix.prof = D.profs[0].id;
        const s0 = D.profs[0];
        choix.type = (s0.types && s0.types[0]) || null;
      }
      if(!choix.duree) choix.duree = 60;
      if(!choix.date) choix.date = aujourdHui();
      render();
      window.scrollTo({ top:0, behavior:'smooth' });
      return;
    }
    if(ev.target.closest('#rsMes')){ vue = 'mes'; render(); return; }
    if(ev.target.closest('#rsAnnuler')){ vue = 'liste'; render(); return; }
    if(ev.target.closest('#rsConfirmer')){ confirmer(); return; }
    if(ev.target.closest('#rsVider')){
      if(!confirm('مسح كل سجلّ الحجوزات من هذا الجهاز؟')) return;
      saveResas([]); render(); toast('🗑️ تم مسح السجل','ok'); return;
    }
    const a = ev.target.closest('[data-annuler]');
    if(a){ annuler(a.dataset.annuler); return; }
    const cp = ev.target.closest('[data-recopie]');
    if(cp){
      const r = resas().filter(x => x.ref === cp.dataset.recopie)[0];
      if(r){
        navigator.clipboard.writeText(texteConfirmation(r))
          .then(() => toast('📋 نُسخ الحجز','ok')).catch(() => toast('⚠️ تعذّر النسخ','ko'));
      }
      return;
    }
    const op = ev.target.closest('[data-champ]');
    if(op && op.tagName === 'BUTTON'){
      const ch = op.dataset.champ;
      choix[ch] = ch === 'duree' ? +op.dataset.v : op.dataset.v;
      if(ch === 'prof'){
        const sel = D.profs.filter(x => x.id === choix.prof)[0];
        choix.type = (sel && sel.types && sel.types.length) ? sel.types[0] : null;
      }
      render();
      return;
    }
  });

  document.addEventListener('input', ev => {
    const i = ev.target.closest('[data-champ]');
    if(!i || i.tagName === 'BUTTON') return;
    choix[i.dataset.champ] = i.value;
    majPrix();
  });
  document.addEventListener('change', ev => {
    const s = ev.target.closest('select[data-champ]');
    if(!s) return;
    choix[s.dataset.champ] = s.value;
    if(s.dataset.champ === 'prof'){
      const sel = D.profs.filter(x => x.id === choix.prof)[0];
      choix.type = (sel && sel.types && sel.types.length) ? sel.types[0] : null;
    }
    render();
  });

  document.addEventListener('dz:view', e => { if(e.detail === 'reservation') boot(); });
  window.renderReservation = boot;
  window.DZ_RESERVATION = { boot:boot, render:render, calculer:calculer,
                            reference:reference, resas:resas };
})();
