/* methode.js — 🎯 Méthode : protocole 3 passes sur TES devoirs/compositions/حوليات réels */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let DV = null, CO = null, AN = null;
  async function cj(u){ try{ const r = await fetch(u, { cache:'no-store' });
      return r.ok ? await r.json() : null; }catch(e){ return null; } }
  async function data(){
    if(DV === null){ DV = await cj('assets/bdd/devoirs.json'); }
    if(CO === null){ CO = await cj('assets/bdd/compositions.json'); }
    if(AN === null){ AN = await cj('assets/bdd/annales.json'); }
    return { dv: (DV && DV.items) || [], co: (CO && CO.items) || [], an: (AN && AN.items) || [] };
  }
  const FICHES = {
    I: ['Lis d’abord les QUESTIONS (pas le texte)', 'Surligne les mots-clés dans le texte',
        'Réponds en PHRASES complètes, jamais un mot seul', 'Cite le passage qui prouve'],
    II: ['Identifie la règle testée (conjugaison / cas / ordre / préposition)',
         'Réécris la phrase au brouillon avec la règle sous les yeux',
         'Vérifie : verbe en 2e position · accord · casse du COD/COI'],
    III: ['Plan en 3 temps : idée → exemple → conclusion',
         'Utilise 2 connecteurs (weil, obwohl, deshalb…)',
         'Relecture : 5 phrases minimum · verbes conjugués · majuscules des noms']
  };

  async function render(){
    const box = $('#methodeBody'); if(!box) return;
    const d = await data();
    const unites = [...new Set(d.dv.map(x => x.unite).filter(Boolean))].sort((a, b) => a - b);
    box.innerHTML =
        '<div class="mt-hero"><span class="mt-crest">🎯</span><div>'
      + '<h2>Méthode efficace — devoirs réels</h2><p class="mt-sub">'
      + d.dv.length + ' devoirs · ' + d.co.length + ' compositions · ' + d.an.length
      + ' حوليات — protocole en 3 passes, aligné sur le manuel officiel</p></div></div>'
      + '<div class="mt-pick"><b>choisis ton unité :</b> '
      + unites.map(u => '<button class="mt-u" data-u="' + u + '">U' + u + '</button>').join('')
      + '</div><div id="mtList"></div><div id="mtPlan"></div>';
    box.querySelectorAll('.mt-u').forEach(b => b.addEventListener('click', () => liste(+b.dataset.u, d)));
    plan(d);
  }

  function liste(u, d){
    const ex = d.dv.filter(x => x.unite === u)
      .sort((a, b) => (a.difficulte || 0) - (b.difficulte || 0));
    const host = $('#mtList');
    host.innerHTML = '<div class="card"><b>📗 Unité ' + u + ' — ' + ex.length
      + ' devoirs (du plus facile au plus dur)</b>'
      + ex.slice(0, 6).map((x, i) =>
          '<div class="mt-d"><div class="mt-dh"><b>' + esc(x.titre) + '</b>'
        + '<span class="mt-bad">' + esc(x.niveau) + ' · ' + esc(x.wilaya) + ' · '
        + (x.annee_scolaire || '') + '</span></div>'
        + '<div class="mt-meta">⏱ ' + x.duree_minutes + ' min · /' + x.bareme
        + ' · difficulté ' + (x.difficulte || '?') + ' · moyenne classe '
        + (x.note_moyenne || '—') + '</div>'
        + '<div class="mt-comp">' + (x.parties || []).map(p =>
            '<span class="mt-p" title="' + esc((p.competences || []).join(' · ')) + '">'
            + esc(p.id) + ' · ' + esc(p.titre) + ' /' + p.points + '</span>').join('') + '</div>'
        + '<div class="mt-btns"><button class="btn btn-o btn-sm" data-analyse="' + i
        + '">1️⃣ analyser</button> <button class="btn btn-p btn-sm" data-compose="' + i
        + '">2️⃣ composer</button> <button class="btn btn-g btn-sm" data-corrige="' + i
        + '">3️⃣ corrigé</button></div>'
        + '<div class="mt-zone" id="mtz' + i + '"></div></div>').join('') + '</div>';
    host.querySelectorAll('[data-analyse]').forEach(b => b.addEventListener('click', () => {
      const x = ex[+b.dataset.analyse];
      $('#mtz' + b.dataset.analyse).innerHTML =
        '<div class="mt-fiche"><b>🔍 Passe 1 — ce qui est testé</b><ul>'
        + (x.parties || []).map(p => '<li><b>' + esc(p.id) + '</b> '
            + esc((p.competences || []).join(' · ')) + '</li>').join('')
        + '</ul><p>📗 manuel officiel : relis l’unité ' + x.unite + ' avant de composer.</p></div>';
    }));
    host.querySelectorAll('[data-compose]').forEach(b => b.addEventListener('click', () => {
      const x = ex[+b.dataset.compose];
      const z = $('#mtz' + b.dataset.compose);
      z.innerHTML = '<div class="mt-fiche"><b>⏱ Passe 2 — compose en ' + x.duree_minutes
        + ' min</b><pre class="mt-sujet">' + esc(x.sujet || x.texte || '(sujet)') + '</pre>'
        + '<div class="mt-btns"><button class="btn btn-p btn-sm" id="mtFin'
        + b.dataset.compose + '">j’ai fini → auto-évaluation</button></div>'
        + '<div id="mtEv' + b.dataset.compose + '"></div></div>';
      $('#mtFin' + b.dataset.compose).addEventListener('click', () => autoEval(x,
        $('#mtEv' + b.dataset.compose)));
    }));
    host.querySelectorAll('[data-corrige]').forEach(b => b.addEventListener('click', () => {
      const x = ex[+b.dataset.corrige];
      $('#mtz' + b.dataset.corrige).innerHTML = '<div class="mt-fiche"><b>✅ Passe 3 — corrigé</b>'
        + '<pre class="mt-sujet">' + esc(x.corrige || x.corrigé || x.corrige_text
            || 'Corrigé type : compare ta copie partie par partie avec la fiche méthode '
             + 'ci-dessous, puis note chaque compétence manquée.') + '</pre>'
        + '<div class="mt-fiches">' + Object.keys(FICHES).map(k =>
            '<div><b>' + k + '</b><ul>' + FICHES[k].map(f => '<li>' + f + '</li>').join('')
            + '</ul></div>').join('') + '</div></div>';
    }));
  }

  function autoEval(x, host){
    host.innerHTML = '<b>Auto-évaluation honnête (chaque échec devient carte mémoire) :</b>'
      + (x.parties || []).map(p => '<div class="mt-ev" data-p="' + esc(p.id) + '"><b>'
          + esc(p.id) + '</b> '
          + ['réussi','partiel','raté'].map(v => '<label><input type="radio" name="ev'
              + esc(p.id) + '" value="' + v + '"> ' + v + '</label>').join('')
          + '</div>').join('')
      + '<button class="btn btn-p btn-sm" id="mtEvOk">enregistrer</button>';
    $('#mtEvOk').addEventListener('click', () => {
      host.querySelectorAll('.mt-ev').forEach(ev => {
        const sel = ev.querySelector('input:checked');
        if(!sel || sel.value === 'réussi') return;
        const p = (x.parties || []).filter(q => q.id === ev.dataset.p)[0];
        (p.competences || []).forEach(c => {
          if(window.MEMOIRE) try{ window.MEMOIRE.record({ q: x.titre + ' — ' + p.id,
            bad: c, good: 'revoir unité ' + x.unite + ' + fiche ' + p.id,
            comp: c, unite: x.unite, src: 'methode' }); }catch(e){}
        });
      });
      host.innerHTML = '<div class="mt-ok">✅ enregistré — tes compétences manquées sont '
        + 'dans 🧠 mémoire et reviendront en J+1 / J+3 / J+7.</div>';
    });
  }

  function plan(d){
    const sem = [
      ['Lun', 'devoir ciblé (unité faible)', d.dv[0]],
      ['Mer', 'composition chronométrée', d.co[0]],
      ['Sam', 'حولية BAC en mode examen', d.an[0]]
    ];
    $('#mtPlan').innerHTML = '<div class="card"><b> Ta semaine type</b><div class="mt-plan">'
      + sem.map(s => '<div class="mt-j"><b>' + s[0] + '</b><i>' + s[1] + '</i><span>'
        + esc(s[2] ? s[2].titre : '—') + '</span></div>').join('') + '</div>'
      + '<p class="mt-note">Règle d’or : un devoir raté = cartes mémoire créées = '
      + 'revue automatique en J+1/3/7. Aucun exercice ne « sert à rien ».</p></div>';
  }

  window.renderMethode = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'methode') render(); });
})();
