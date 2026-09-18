/* ══════════════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — matieres.js
   📚 سجل المواد : l'application devient un lycée virtuel complet.
   Chaque matière a son registre d'unités/séances branché sur le MÊME moteur
   que l'allemand. L'allemand est la première matière active ; les autres sont
   déclarées dans assets/bdd/matieres.json et se branchent une à une.
   ══════════════════════════════════════════════════════════════════════ */
'use strict';

(function(){
  const $  = (s,c) => (c||document).querySelector(s);
  const $$ = (s,c) => Array.prototype.slice.call((c||document).querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let D = null;
  let niveau = '2AS';
  let filiere = 'sciences';

  async function boot(){
    const box = $('#matieresBody'); if(!box) return;
    if(!D){
      box.innerHTML = '<div class="bdd-status">⏳ جارٍ تحميل سجل المواد…</div>';
      try{
        const r = await fetch('assets/bdd/matieres.json', { cache:'force-cache' });
        if(!r.ok) throw new Error('HTTP ' + r.status);
        D = await r.json();
      }catch(e){
        box.innerHTML = '<div class="bdd-status err">❌ تعذّر تحميل سجل المواد : ' +
                        esc(e.message) + '</div>';
        return;
      }
    }
    /* niveau / filière courants de la session, sinon défauts */
    try{
      const s = (window.AUTH && AUTH.session) ? AUTH.session() : null;
      if(s){ niveau = s.niveau || niveau; filiere = filiereId(s.filiere_ar) || filiere; }
    }catch(e){}
    render();
  }

  function filiereId(lib){
    if(!D) return null;
    const toutes = (D.par_niveau['2AS'] || {});
    for(const niv in D.par_niveau){
      for(const fid in D.par_niveau[niv]){
        /* on ne dispose que des ids ici ; on compare via le registre auth si dispo */
      }
    }
    /* correspondance libellé arabe → id, via une table locale miroir de auth.js */
    const MAP = { 'علوم تجريبية':'sciences', 'رياضيات':'math', 'تقني رياضي':'tech',
                  'تسيير واقتصاد':'gestion', 'آداب وفلسفة':'philo', 'لغات أجنبية':'langues',
                  'جذع مشترك آداب':'tc-lettres', 'جذع مشترك علوم وتكنولوجيا':'tc-sciences' };
    return MAP[lib] || null;
  }

  function listeMatieres(){
    if(!D) return [];
    const parNiv = D.par_niveau[niveau] || {};
    const ids = parNiv[filiere] || parNiv['sciences'] || [];
    const parId = {};
    D.matieres.forEach(m => { parId[m.id] = m; });
    return ids.map(id => parId[id]).filter(Boolean);
  }

  function render(){
    const box = $('#matieresBody'); if(!box || !D) return;
    const liste = listeMatieres();
    const actifs = liste.filter(m => m.statut === 'actif').length;

    let h = '<div class="card mat-hero">'
      + '<div class="mat-t"><span class="mat-crest">🏫</span><div>'
      + '<h2>الثانوية الافتراضية الجزائرية</h2>'
      + '<p class="mat-sub">كل المواد · كل المستويات · كل الشعب — '
      + esc(D._meta.annee) + '</p></div></div>'
      + '<div class="mat-sel">'
      + selNiveau() + selFiliere()
      + '</div>'
      + '<div class="mat-stats">'
      + '<div class="mat-st"><b>' + liste.length + '</b><span>مادة في شعبتك</span></div>'
      + '<div class="mat-st"><b>' + actifs + '</b><span>نشطة الآن</span></div>'
      + '<div class="mat-st"><b>' + (liste.length - actifs) + '</b><span>مبرمجة — قريبًا</span></div>'
      + '<div class="mat-st"><b>' + D.matieres.length + '</b><span>مادة في السجل</span></div>'
      + '</div></div>';

    h += '<div class="mat-grid">' + liste.map(m => carte(m)).join('') + '</div>';

    h += '<div class="card mat-vision"><h3>🧭 كيف تُضاف مادة جديدة ؟</h3>'
      + '<ol class="mat-how">'
      + '<li>أنشئ <code>assets/bdd/&lt;matiere&gt;.json</code> على نموذج '
      + '<code>referentiel.json</code> (وحدات → حصص → تمارين).</li>'
      + '<li>أنشئ <code>&lt;matiere&gt;.js</code> sur le modèle de <code>unite2.js</code> '
      + '(mêmes clés <code>meta / seances / devoir / corrige</b>).</li>'
      + '<li>Déclare-la dans <code>matieres.json → par_niveau</code> : elle apparaît ici '
      + 'automatiquement.</li>'
      + '<li>Le moteur (séances, devoir /20, correction, progression) est déjà commun : '
      + 'rien d’autre à écrire.</li>'
      + '</ol></div>';

    box.innerHTML = h;
    bind();
  }

  function selNiveau(){
    const NIV = [['1AS','السنة الأولى ثانوي'],['2AS','السنة الثانية ثانوي'],
                 ['3AS','السنة الثالثة ثانوي']];
    return '<label class="fld mat-f"><span>🎓 المستوى</span><select id="matNiveau">'
      + NIV.map(n => '<option value="' + n[0] + '"' + (n[0] === niveau ? ' selected' : '') + '>'
        + n[1] + '</option>').join('') + '</select></label>';
  }
  function selFiliere(){
    const FIL = { '1AS': [['tc-lettres','جذع مشترك آداب'],['tc-sciences','جذع مشترك علوم وتكنولوجيا']],
                  '2AS': FIL23(), '3AS': FIL23() };
    const liste = FIL[niveau] || FIL['2AS'];
    return '<label class="fld mat-f"><span>🏫 الشعبة</span><select id="matFiliere">'
      + liste.map(f => '<option value="' + f[0] + '"' + (f[0] === filiere ? ' selected' : '') + '>'
        + f[1] + '</option>').join('') + '</select></label>';
  }
  function FIL23(){
    return [['sciences','علوم تجريبية'],['math','رياضيات'],['tech','تقني رياضي'],
            ['gestion','تسيير واقتصاد'],['philo','آداب وفلسفة'],['langues','لغات أجنبية']];
  }

  function carte(m){
    const st = (D.statuts || {})[m.statut] || { ar:m.statut, icon:'•' };
    const actif = m.statut === 'actif';
    return '<div class="mat-c' + (actif ? ' on' : '') + '">'
      + '<div class="mat-ch"><span class="mat-i">' + esc(m.icon || '📘') + '</span>'
      + '<span class="mat-stt ' + (actif ? 'ok' : '') + '">' + esc(st.icon) + ' ' + esc(st.ar) + '</span></div>'
      + '<b class="mat-n">' + esc(m.ar) + '</b>'
      + (m.de ? '<i class="mat-de de-display">' + esc(m.de) + '</i>' : '')
      + '<p class="mat-d">' + esc(m.desc || '') + '</p>'
      + (actif
          ? '<div class="mat-kv"><span><b>' + (m.unites || 0) + '</b> وحدة</span>'
            + '<span><b>' + (m.seances || 0) + '</b> حصة</span></div>'
            + '<button class="btn btn-p btn-sm" data-go="seances">📚 فتح الحصص</button>'
          : '<button class="btn btn-o btn-sm" disabled>🗓️ قريبًا</button>')
      + '</div>';
  }

  function bind(){
    const n = $('#matNiveau'), f = $('#matFiliere');
    if(n) n.addEventListener('change', () => { niveau = n.value;
      /* si la filière n'existe pas dans ce niveau, on retombe sur la première */
      const ids = Object.keys((D.par_niveau[niveau] || {}));
      if(ids.indexOf(filiere) === -1) filiere = ids[0] || 'sciences';
      render(); });
    if(f) f.addEventListener('change', () => { filiere = f.value; render(); });
  }

  window.renderMatieres = boot;
  document.addEventListener('dz:view', e => { if(e.detail === 'matieres') boot(); });
})();
