/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — devoirs_unite.js
   📝 Module DEVOIRS_UNITE : filtre les documents de la bibliothèque
   par unité officielle (U1-U9 du manuel 2AS, U10-U19 pour 3AS).
   
   Utilisé quand une unité n'a pas de devoir codé en dur :
   → affiche la liste des فروض/اختبارات/حوليات de l'unité courante.
   
   Redistribution officielle : 9 Lektionen du manuel 2AS
   (Vorwärts mit Deutsch, ONPS) + 10 unités 3AS
   ══════════════════════════════════════════════════════════════ */
'use strict';

const DEVOIRS_UNITE = (function(){
  
  /* ── Cache des documents chargés ── */
  let _cache = null;
  let _loading = false;
  const _waiters = [];
  
  /* ── Métadonnées des unités officielles ── */
  const UNITES_META = {
    1:  { de:'Sich vorstellen',        ar:'التعريف بالنفس',        icon:'👋', pages:[5,29],   lektion:1 },
    2:  { de:'Haus und Familie',       ar:'البيت والعائلة',        icon:'🏠', pages:[31,55],  lektion:2 },
    3:  { de:'Schule und Unterricht',  ar:'المدرسة والدرس',        icon:'🏫', pages:[57,76],  lektion:3 },
    4:  { de:'Zeit und Wetter',        ar:'الوقت والطقس',          icon:'⏰', pages:[77,101], lektion:4 },
    5:  { de:'Freizeit',               ar:'أوقات الفراغ',          icon:'⚽', pages:[103,127],lektion:5 },
    6:  { de:'Mensch und Gesundheit',  ar:'الإنسان والصحة',        icon:'🏥', pages:[129,149],lektion:6 },
    7:  { de:'Essen und Trinken',      ar:'المأكل والمشرب',        icon:'🍽️', pages:[151,180],lektion:7 },
    8:  { de:'Aussehen und Charakter', ar:'المظهر والشخصية',       icon:'🪞', pages:[181,205],lektion:8 },
    9:  { de:'Stadtleben – Landleben', ar:'حياة المدينة والريف',   icon:'🏙️', pages:[207,223],lektion:9 },
    10: { de:'Persönlichkeit und Identität', ar:'الشخصية والهوية',  icon:'🧠', pages:null, lektion:null },
    11: { de:'Staatsbürgerschaft',     ar:'المواطنة',              icon:'🏛️', pages:null, lektion:null },
    12: { de:'Leben in der Gesellschaft', ar:'الحياة في المجتمع',  icon:'👥', pages:null, lektion:null },
    13: { de:'Wissenschaft und Technologie', ar:'العلوم والتكنولوجيا', icon:'🔬', pages:null, lektion:null },
    14: { de:'Wirtschaft und Arbeit',  ar:'الاقتصاد والعمل',       icon:'💼', pages:null, lektion:null },
    15: { de:'Umweltprobleme',         ar:'مشاكل البيئة',          icon:'🌍', pages:null, lektion:null },
    16: { de:'Gesundheit und Lebensweise', ar:'الصحة ونمط الحياة', icon:'🏥', pages:null, lektion:null },
    17: { de:'Globalisierung',         ar:'العولمة',               icon:'🌐', pages:null, lektion:null },
    18: { de:'Medienwelt',             ar:'عالم الإعلام',          icon:'📰', pages:null, lektion:null },
    19: { de:'Kultureller Dialog',     ar:'الحوار الثقافي',        icon:'🤝', pages:null, lektion:null }
  };
  
  /* ── Chemins des fichiers BDD ── */
  const FICHIERS = [
    { url:'assets/bdd/devoirs.json',      type:'فرض',     icon:'📝' },
    { url:'assets/bdd/compositions.json', type:'اختبار',  icon:'📘' },
    { url:'assets/bdd/annales.json',      type:'حوليات',  icon:'📚' }
  ];
  
  /* ── Charger tous les documents (une seule fois) ── */
  async function charger(){
    if(_cache) return _cache;
    if(_loading){
      return new Promise(function(resolve){ _waiters.push(resolve); });
    }
    _loading = true;
    const tous = [];
    
    for(const f of FICHIERS){
      try{
        const r = await fetch(f.url, { cache:'no-store' });
        if(!r.ok) continue;
        const data = await r.json();
        const items = (data && data.items) ? data.items : [];
        for(const it of items){
          tous.push(Object.assign({}, it, { _type:f.type, _icon:f.icon, _source:f.url }));
        }
      }catch(e){
        console.warn('[DEVOIRS_UNITE] échec chargement', f.url, e);
      }
    }
    
    _cache = tous;
    _loading = false;
    for(const w of _waiters){ try{ w(tous); }catch(e){} }
    _waiters.length = 0;
    return tous;
  }
  
  /* ── Filtrer les documents d'une unité ── */
  function parUnite(unite, docs){
    const list = docs || _cache || [];
    return list.filter(function(d){ return Number(d.unite) === Number(unite); });
  }
  
  /* ── Compter les documents par unité (stats globales) ── */
  function compter(docs){
    const list = docs || _cache || [];
    const counts = {};
    for(const d of list){
      const u = Number(d.unite);
      if(!isNaN(u)){
        counts[u] = (counts[u] || 0) + 1;
      }
    }
    return counts;
  }
  
  /* ── Rendre la liste des documents d'une unité dans un conteneur ── */
  function rendre(unite, conteneur, options){
    const opts = options || {};
    const el = (typeof conteneur === 'string') ? document.querySelector(conteneur) : conteneur;
    if(!el) return;
    
    const meta = UNITES_META[unite] || { de:'—', ar:'—', icon:'📄', pages:null };
    const docs = parUnite(unite);
    
    if(docs.length === 0){
      el.innerHTML =
        '<div class="card" style="text-align:center;padding:30px 20px;">' +
        '  <div style="font-size:48px;margin-bottom:12px;">📭</div>' +
        '  <h3 style="margin-bottom:8px;">لا توجد وثائق لهذه الوحدة بعد</h3>' +
        '  <p style="opacity:.75;font-size:14px;">' +
        '    الوحدة ' + unite + ' · ' + meta.ar + ' — ' + meta.de +
        '  </p>' +
        (meta.pages ? '  <p style="opacity:.6;font-size:13px;margin-top:8px;">📖 Livre : p' + meta.pages[0] + '-p' + meta.pages[1] + '</p>' : '') +
        '  <p style="margin-top:14px;font-size:13px;opacity:.7;">' +
        '    💡 اطلب من أستاذك إضافة وثائق هذه الوحدة، أو تصفح 📚 المكتبة الكاملة.' +
        '  </p>' +
        '</div>';
      return;
    }
    
    /* Regrouper par type */
    const parType = {};
    for(const d of docs){
      const t = d._type || 'autre';
      if(!parType[t]) parType[t] = [];
      parType[t].push(d);
    }
    
    /* Trier chaque groupe par année décroissante */
    for(const t in parType){
      parType[t].sort(function(a, b){
        return (Number(b.annee) || 0) - (Number(a.annee) || 0);
      });
    }
    
    let html = '';
    
    /* En-tête */
    html += '<div class="card du-head" style="padding:16px 18px;margin-bottom:14px;">';
    html += '  <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">';
    html += '    <div style="font-size:32px;">' + meta.icon + '</div>';
    html += '    <div style="flex:1;min-width:200px;">';
    html += '      <h2 style="margin:0;font-size:18px;">الوحدة ' + unite + ' · ' + meta.ar + '</h2>';
    html += '      <p style="margin:4px 0 0;opacity:.75;font-size:13px;" dir="ltr">' + meta.de + '</p>';
    html += '    </div>';
    html += '    <div style="text-align:center;background:rgba(0,98,51,.15);padding:8px 14px;border-radius:10px;">';
    html += '      <div style="font-size:22px;font-weight:700;color:var(--or,#e8b64c);">' + docs.length + '</div>';
    html += '      <div style="font-size:11px;opacity:.8;">وثيقة</div>';
    html += '    </div>';
    html += '  </div>';
    if(meta.pages){
      html += '  <p style="margin:10px 0 0;font-size:12px;opacity:.7;">📖 الصفحات في الكتاب : p' + meta.pages[0] + ' – p' + meta.pages[1] + ' · Lektion ' + meta.lektion + '</p>';
    }
    html += '</div>';
    
    /* Groupes par type */
    const ordre = ['فرض', 'اختبار', 'حوليات', 'autre'];
    for(const t of ordre){
      if(!parType[t] || parType[t].length === 0) continue;
      const icon = parType[t][0]._icon || '📄';
      html += '<div class="du-groupe" style="margin-bottom:18px;">';
      html += '  <h3 style="display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:15px;">';
      html += '    <span>' + icon + '</span>';
      html += '    <span>' + t + 'ات الوحدة ' + unite + '</span>';
      html += '    <span class="pill" style="font-size:11px;opacity:.7;">' + parType[t].length + '</span>';
      html += '  </h3>';
      html += '  <div class="du-liste" style="display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));">';
      
      for(const d of parType[t]){
        const titre = d.titre || d.titre_de || d.id || '—';
        const annee = d.annee_scolaire || d.annee || '';
        const wilaya = d.wilaya || '';
        const bareme = d.bareme || 20;
        const duree = d.duree_minutes || 45;
        const corrige = d.corrige_inclus ? '✅' : '—';
        const diff = d.difficulte || 0;
        const diffEtoiles = '★'.repeat(Math.min(5, diff)) + '☆'.repeat(Math.max(0, 5 - diff));
        
        html += '    <div class="card du-doc" data-id="' + (d.id || '') + '" style="padding:12px 14px;cursor:pointer;transition:transform .15s,border-color .15s;" ';
        html += '         onmouseover="this.style.borderColor=\'var(--or,#e8b64c)\';this.style.transform=\'translateY(-2px)\'" ';
        html += '         onmouseout="this.style.borderColor=\'\';this.style.transform=\'\'">';
        html += '      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">';
        html += '        <h4 style="margin:0;font-size:14px;line-height:1.4;flex:1;">' + titre + '</h4>';
        html += '        <span style="font-size:11px;opacity:.7;white-space:nowrap;">' + corrige + '</span>';
        html += '      </div>';
        html += '      <div style="display:flex;flex-wrap:wrap;gap:6px;font-size:11px;opacity:.8;margin-bottom:8px;">';
        if(annee) html += '<span>📅 ' + annee + '</span>';
        if(wilaya) html += '<span>📍 ' + wilaya + '</span>';
        html += '<span>⏱️ ' + duree + ' د</span>';
        html += '<span>🧮 /' + bareme + '</span>';
        html += '      </div>';
        if(diff > 0){
          html += '      <div style="font-size:11px;color:var(--or,#e8b64c);letter-spacing:1px;">' + diffEtoiles + '</div>';
        }
        html += '    </div>';
      }
      
      html += '  </div>';
      html += '</div>';
    }
    
    /* Note de bas de page */
    html += '<div style="text-align:center;padding:14px;opacity:.65;font-size:12px;">';
    html += '  📚 إجمالي الوثائق في المكتبة : ' + (_cache ? _cache.length : '...') + ' · ';
    html += '  <a href="#library" onclick="go(\'library\');return false;" style="color:var(--or,#e8b64c);">تصفح المكتبة الكاملة →</a>';
    html += '</div>';
    
    el.innerHTML = html;
    
    /* Clic sur un document → ouvrir dans la bibliothèque */
    el.querySelectorAll('.du-doc').forEach(function(card){
      card.addEventListener('click', function(){
        const id = card.getAttribute('data-id');
        if(id && window.LIBRARY && typeof LIBRARY.ouvrirDoc === 'function'){
          LIBRARY.ouvrirDoc(id);
        }else{
          /* Repli : basculer vers la bibliothèque avec recherche */
          if(typeof go === 'function') go('library');
          setTimeout(function(){
            const search = document.querySelector('#libraryBody input[type="search"]');
            if(search){
              search.value = id;
              search.dispatchEvent(new Event('input', { bubbles:true }));
            }
          }, 200);
        }
      });
    });
  }
  
  /* ── Hook : intercepter le rendu du devoir quand il est null ── */
  function hook(){
    /* Surveiller les changements d'unité via l'événement dz:unite */
    document.addEventListener('dz:unite', function(ev){
      const unite = ev.detail && ev.detail.n;
      if(!unite) return;
      
      /* Vérifier si l'unité a un devoir codé en dur */
      const aDevoirCode = (window.UNITES || []).some(function(u){
        return u.n === unite && u.devoir !== null && u.devoir !== undefined;
      });
      
      if(!aDevoirCode){
        /* Pas de devoir codé en dur → afficher la liste de la bibliothèque */
        const body = document.querySelector('#devoirBody');
        if(body){
          /* Charger si nécessaire, puis rendre */
          charger().then(function(){
            rendre(unite, body);
          });
          
          /* Mettre à jour le titre */
          const meta = UNITES_META[unite];
          const dt = document.querySelector('#devoirTitle');
          if(dt && meta){
            dt.innerHTML = '📝 وثائق الوحدة ' + unite + ' <span class="pill">' + meta.ar + '</span>';
          }
          const ds = document.querySelector('#devoirSub');
          if(ds && meta){
            const docs = parUnite(unite);
            ds.textContent = '📚 ' + docs.length + ' وثيقة (فروض + اختبارات + حوليات) · ' +
              (meta.pages ? 'الكتاب ص ' + meta.pages[0] + '-' + meta.pages[1] : 'مستوى 3AS');
          }
        }
      }
    });
    
    /* Au chargement initial : si on est déjà sur une unité sans devoir, rendre */
    setTimeout(function(){
      const uniteCourante = (window.UNITES && window.UNITES[0] && window.UNITES[0].n) || 1;
      const aDevoirCode = (window.UNITES || []).some(function(u){
        return u.n === uniteCourante && u.devoir !== null && u.devoir !== undefined;
      });
      if(!aDevoirCode){
        const body = document.querySelector('#devoirBody');
        const view = document.querySelector('[data-view="devoir"]');
        if(body && view && !view.hidden){
          charger().then(function(){ rendre(uniteCourante, body); });
        }
      }
    }, 1500);
  }
  
  /* ── Démarrage ── */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      hook();
      charger();
    });
  }else{
    hook();
    charger();
  }
  
  return {
    charger: charger,
    parUnite: parUnite,
    compter: compter,
    rendre: rendre,
    meta: UNITES_META,
    hook: hook
  };
})();

window.DEVOIRS_UNITE = DEVOIRS_UNITE;
