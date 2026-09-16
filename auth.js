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
    { id:'2AS-1', ar:'٢AS-١', niveau:'2AS', eleves:32, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'2AS-2', ar:'٢AS-٢', niveau:'2AS', eleves:28, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'2AS-3', ar:'٢AS-٣', niveau:'2AS', eleves:32, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'3AS-1', ar:'٣AS-١', niveau:'3AS', eleves:26, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' },
    { id:'3AS-2', ar:'٣AS-٢', niveau:'3AS', eleves:24, prof:'الأستاذ خريف أحمد', matiere:'اللغة الألمانية' }
  ];

  const FILIERES = ['Lettres et Langues','Langues Étrangères','Gestion et Économie',
                    'Sciences Expérimentales','Mathématiques','Techniques Mathématiques'];
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
                filiere:o.filiere || FILIERES[0], wilaya:o.wilaya || 'Bouira',
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
    if(cl) cl.innerHTML = SECTIONS.map(c =>
      '<option value="' + c.id + '">' + c.ar + ' — ' + c.niveau + ' · ' + c.eleves + ' تلميذ</option>').join('');
    const nv = document.getElementById('suNiveau');
    if(nv) nv.innerHTML = ['2AS','3AS'].map(n =>
      '<option value="' + n + '">' + (n === '2AS' ? 'السنة الثانية ثانوي' : 'السنة الثالثة ثانوي') + '</option>').join('');
    const fi = document.getElementById('suFiliere');
    if(fi) fi.innerHTML = FILIERES.map(f => '<option value="' + f + '">' + f + '</option>').join('');
    const wi = document.getElementById('suWilaya');
    if(wi && wilayas && wilayas.length){
      wi.innerHTML = wilayas.map(w =>
        '<option value="' + w.code + '|' + w.nom + '">' + w.code + ' — ' + w.nom + '</option>').join('');
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
