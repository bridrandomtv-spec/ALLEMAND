/* ══════════════════════════════════════════════════════════════
   الثانوية الافتراضية الجزائرية — auth.js
   Connexion · Inscription · Rôles · Sessions · Sections
   Données 100% locales (localStorage) — aucun serveur externe
   ══════════════════════════════════════════════════════════════ */
'use strict';

const AUTH = (function(){
  const K_USERS   = 'dz_de_users_v1';
  const K_SESSION = 'dz_de_session_v1';
  const K_CLASSE  = 'dz_de_classe_v1';

  /* ── Sections de la classe virtuelle (comme sur la photo) ── */
  const SECTIONS = [
    { id:'1AS-1', ar:'١AS-١', niveau:'1AS', eleves:30, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'1AS-2', ar:'١AS-٢', niveau:'1AS', eleves:28, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'2AS-1', ar:'٢AS-١', niveau:'2AS', eleves:32, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'2AS-2', ar:'٢AS-٢', niveau:'2AS', eleves:28, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'2AS-3', ar:'٢AS-٣', niveau:'2AS', eleves:32, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'3AS-1', ar:'٣AS-١', niveau:'3AS', eleves:26, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'3AS-2', ar:'٣AS-٢', niveau:'3AS', eleves:24, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' }
  ];

  /* ── Niveaux et filières RÉELS 2026-2027, libellés en arabe ──
     Source : organisation officielle du secondaire algérien.
     1AS : 2 troncs communs.  2AS et 3AS : 6 filières, dont تقني رياضي
     décliné en 4 spécialités d'ingénierie. */
  const NIVEAUX = [
    { id:'1AS', ar:'السنة الأولى ثانوي' },
    { id:'2AS', ar:'السنة الثانية ثانوي' },
    { id:'3AS', ar:'السنة الثالثة ثانوي' }
  ];
  const FILIERES_23 = [
    { id:'sciences', ar:'علوم تجريبية' },
    { id:'math',     ar:'رياضيات' },
    { id:'tech',     ar:'تقني رياضي', specialites:[
        { id:'elec',     ar:'هندسة كهربائية' },
        { id:'civil',    ar:'هندسة مدنية' },
        { id:'meca',     ar:'هندسة ميكانيكية' },
        { id:'procedes', ar:'هندسة الطرائق' } ] },
    { id:'gestion',  ar:'تسيير واقتصاد' },
    { id:'philo',    ar:'آداب وفلسفة' },
    { id:'langues',  ar:'لغات أجنبية' }
  ];
  const FILIERES = {
    '1AS': [ { id:'tc-lettres',  ar:'جذع مشترك آداب' },
             { id:'tc-sciences', ar:'جذع مشترك علوم وتكنولوجيا' } ],
    '2AS': FILIERES_23,
    '3AS': FILIERES_23
  };
  const FILIERES_LISTE = FILIERES_23.map(f => f.ar);   /* compatibilité ancien format */

  /* 58 wilayas officielles — miroir de assets/bdd/wilaya.json.
     Statique pour que #suWilaya soit peuplé IMMÉDIATEMENT au chargement du
     portail, sans attendre le fetch asynchrone de la BDD. */
  const WILAYAS = [
    ['01','أدرار'], ['02','الشلف'], ['03','الأغواط'], ['04','أم البواقي'],
    ['05','باتنة'], ['06','بجاية'], ['07','بسكرة'], ['08','بشار'],
    ['09','البليدة'], ['10','البويرة'], ['11','تمنراست'], ['12','تبسة'],
    ['13','تلمسان'], ['14','تيارت'], ['15','تيزي وزو'], ['16','الجزائر'],
    ['17','الجلفة'], ['18','جيجل'], ['19','سطيف'], ['20','سعيدة'],
    ['21','سكيكدة'], ['22','سيدي بلعباس'], ['23','عنابة'], ['24','قالمة'],
    ['25','قسنطينة'], ['26','المدية'], ['27','مستغانم'], ['28','المسيلة'],
    ['29','معسكر'], ['30','ورقلة'], ['31','وهران'], ['32','البيض'],
    ['33','إليزي'], ['34','برج بوعريريج'], ['35','بومرداس'], ['36','الطارف'],
    ['37','تندوف'], ['38','تيسمسيلت'], ['39','الوادي'], ['40','خنشلة'],
    ['41','سوق أهراس'], ['42','تيبازة'], ['43','ميلة'], ['44','عين الدفلى'],
    ['45','النعامة'], ['46','عين تموشنت'], ['47','غرداية'], ['48','غليزان'],
    ['49','تيميمون'], ['50','برج باجي مختار'], ['51','أولاد جلال'], ['52','بني عباس'],
    ['53','عين صالح'], ['54','عين قزام'], ['55','تقرت'], ['56','جانت'],
    ['57','المغير'], ['58','المنيعة']
  ];

  /* Peuple #suFiliere selon le niveau, et #suSpecialite si تقني رياضي. */
  function peuplerFilieres(niveau){
    const fi = document.getElementById('suFiliere');
    const sp = document.getElementById('suSpecialite');
    const liste = FILIERES[niveau] || FILIERES['2AS'];
    if(fi){
      fi.innerHTML = liste.map(f =>
        '<option value="' + f.id + '">' + f.ar + '</option>').join('');
    }
    majSpecialite();
    function majSpecialite(){
      if(!sp) return;
      const sel = liste.filter(f => f.id === (fi ? fi.value : ''))[0];
      if(sel && sel.specialites && sel.specialites.length){
        sp.hidden = false;
        sp.innerHTML = sel.specialites.map(s =>
          '<option value="' + s.id + '">' + s.ar + '</option>').join('');
      }else{
        sp.hidden = true;
        sp.innerHTML = '';
      }
    }
    if(fi && !fi._casc){
      fi._casc = true;
      fi.addEventListener('change', majSpecialite);
    }
  }

  const ROLES = { eleve:'تلميذ', parent:'ولي', prof:'أستاذ' };

  /* ── Utilitaires ── */
  const rd = (k,d) => { try{ const v=localStorage.getItem(k); return v===null?d:JSON.parse(v); }catch(e){ return d; } };
  const wr = (k,v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };
  const now = () => new Date().toISOString();
  const norm = s => String(s||'').trim().toLowerCase();

  function hash(pass){
    let h = 5381; const s = String(pass) + '::dz-de-salt-2026';
    for(let i=0;i<s.length;i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ── Compte de démonstration ── */
  function seedDemo(){
    const users = rd(K_USERS, {});
    if(!users['ahmed']){
      users['ahmed'] = {
        user:'ahmed', pass:hash('1234'), nom:'أحمد محمد', mail:'ahmed@lycee.dz',
        role:'eleve', niveau:'2AS', filiere:'Lettres et Langues',
        wilaya:'Bouira', code_wilaya:'10', classe:'2AS-3',
        points:850, created:now(), lastLogin:null
      };
    }
    if(!users['prof']){
      users['prof'] = {
        user:'prof', pass:hash('1234'), nom:'الأستاذ خريف أحمد', mail:'kharif@deutsch-dz.edu',
        role:'prof', niveau:'2AS', filiere:'Lettres et Langues',
        wilaya:'Bouira', code_wilaya:'10', classe:'2AS-3',
        points:0, created:now(), lastLogin:null
      };
    }
    u.genre = o.genre || '';
    wr(K_USERS, users);
    return users;
  }

  function listClasses(){
    const s = session();
    return SECTIONS.map(c => Object.assign({}, c, { me: !!(s && s.classe === c.id) }));
  }

  function session(){ return rd(K_SESSION, null); }

  function login(user, pass, classe){
    const users = seedDemo();
    const u = users[norm(user)] || users[norm(String(user).split('@')[0])];
    if(!u) return { ok:false, err:'❌ اسم المستخدم غير موجود — أنشئ حساباً جديداً' };
    if(u.pass !== hash(pass)) return { ok:false, err:'🔒 كلمة السر غير صحيحة' };
    u.lastLogin = now();
    if(classe) u.classe = classe;
    users[norm(user)] = u; wr(K_USERS, users);
    const sec = SECTIONS.filter(c => c.id === (classe || u.classe))[0] || SECTIONS[2];
    const s = { user:u.user, nom:u.nom, role:u.role, niveau:u.niveau, filiere:u.filiere,
                wilaya:u.wilaya, code_wilaya:u.code_wilaya, points:u.points || 0,
                classe:sec.id, classe_ar:sec.ar, eleves:sec.eleves, prof:sec.prof,
                matiere:sec.matiere, loginAt:now() };
    wr(K_SESSION, s);
    document.dispatchEvent(new CustomEvent('dz:auth', { detail:s }));
    return { ok:true, session:s };
  }

  function signup(o){
    const users = seedDemo();
    const mail = norm(o.mail);
    const key  = norm(String(o.mail).split('@')[0]);
    if(!o.nom || o.nom.trim().length < 3) return { ok:false, err:'✍️ الاسم الكامل قصير جداً' };
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return { ok:false, err:'📧 البريد الإلكتروني غير صالح' };
    if(String(o.pass).length < 4) return { ok:false, err:'🔒 كلمة السر : 4 أحرف على الأقل' };
    if(users[key]) return { ok:false, err:'⚠️ هذا الحساب موجود — سجّل الدخول' };
    const sec = SECTIONS.filter(c => c.id === o.classe)[0] ||
                SECTIONS.filter(c => c.niveau === o.niveau)[0] || SECTIONS[2];
    const u = { user:key, pass:hash(o.pass), nom:o.nom.trim(), mail:mail,
                role:o.role || 'eleve', niveau:o.niveau || '2AS',
                filiere:o.filiere, filiere_ar:o.filiere_ar || '', specialite:o.specialite || '' || FILIERES[0], wilaya:o.wilaya || 'Bouira',
                code_wilaya:o.code_wilaya || '10', classe:sec.id,
                points:0, created:now(), lastLogin:now() };
    users[key] = u; wr(K_USERS, users);
    return login(key, o.pass, sec.id);
  }

  function logout(){
    try{ localStorage.removeItem(K_SESSION); }catch(e){}
    document.dispatchEvent(new CustomEvent('dz:auth', { detail:null }));
  }

  function update(patch){
    const s = session(); if(!s) return null;
    Object.assign(s, patch); wr(K_SESSION, s);
    document.dispatchEvent(new CustomEvent('dz:auth', { detail:s }));
    return s;
  }

  function addUserPoints(n){
    const s = session(); if(!s) return 0;
    s.points = (s.points || 0) + n;
    const users = seedDemo();
    if(users[s.user]) { users[s.user].points = s.points; wr(K_USERS, users); }
    wr(K_SESSION, s);
    return s.points;
  }

    function initSelects(wilayas){
    const cl = document.getElementById('loginClasse');
    if(cl) cl.innerHTML = SECTIONS.map(c => {
      const niv = (NIVEAUX.filter(n => n.id === c.niveau)[0] || {}).ar || c.niveau;
      return '<option value="' + c.id + '">' + c.ar + ' — ' + niv + ' · ' + c.eleves + ' تلميذ</option>';
    }).join('');
    const nv = document.getElementById('suNiveau');
    if(nv){
      nv.innerHTML = NIVEAUX.map(n =>
        '<option value="' + n.id + '">' + n.ar + '</option>').join('');
      if(!nv._casc){
        nv._casc = true;
        nv.addEventListener('change', () => peuplerFilieres(nv.value));
      }
      peuplerFilieres(nv.value || '2AS');
    }
    const wi = document.getElementById('suWilaya');
    if(wi){
      /* wilayas fournies (BDD) sinon le miroir statique : le select n'est JAMAIS vide. */
      const src = (wilayas && wilayas.length)
        ? wilayas.map(w => [w.code || w.c, w.nom_ar || w.nom || w.ar])
        : WILAYAS;
      wi.innerHTML = src.map(w =>
        '<option value="' + w[0] + '|' + w[1] + '">' + w[0] + ' — ' + w[1] + '</option>').join('');
    }
  }

  function stats(){
    const users = seedDemo();
    const total = Object.keys(users).length;
    const eleves = SECTIONS.reduce((a,c) => a + c.eleves, 0);
    return { comptes:total, sections:SECTIONS.length, eleves:eleves, wilayas:58 };
  }

  return { SECTIONS:SECTIONS, FILIERES:FILIERES, ROLES:ROLES,
           session:session, login:login, signup:signup, logout:logout,
           update:update, addUserPoints:addUserPoints,
           listClasses:listClasses, initSelects:initSelects, stats:stats, hash:hash };
})();

/* ══ Exposition explicite sur window ══
   Un `const`/`function` au niveau racine d'un script CLASSIQUE crée une
   liaison dans l'environnement lexical global, PAS une propriété de window.
   Les consommateurs testent `window.X` : sans cette ligne ils voyaient
   undefined et le module restait muet (portail de connexion vide). */
window.AUTH = AUTH;
