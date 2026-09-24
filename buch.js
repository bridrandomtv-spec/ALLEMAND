/* buch.js — 📗 Livre officiel 2AS : Lektion 1 interactive (textes, vocab, tables,
   57 exercices en allemand corrigés automatiquement, note /20) */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let LS = null, CUR = 0;
  async function livre(){
    if(LS !== null) return LS;
    LS = [];
    try{
      const r1 = await fetch('assets/bdd/buch_2as.json', { cache:'no-store' });
      if(r1.ok){ const j = await r1.json();
        LS.push(j.lektionen ? j.lektionen[0] : Object.assign({ n:1, titre: j._meta.titre }, j)); }
      const r2 = await fetch('assets/bdd/buch_l2.json', { cache:'no-store' });
      if(r2.ok) LS.push(await r2.json());
      const r3 = await fetch('assets/bdd/buch_l3.json', { cache:'no-store' });
      if(r3.ok) LS.push(await r3.json());
    }catch(e){}
    return LS;
  }
  const PERS = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const GRP = { vf:'Richtig oder falsch? (1 Pkt)', gap:'Ergänze das Verb (1 Pkt)',
    mcq:'Wähle die richtige Antwort (1 Pkt)', num:'Zahlen (1 Pkt)',
    prod:'Textproduktion (4 Pkt)' };

  async function render(){
    const box = $('#buchBody'); if(!box) return;
    const L = await livre();
    if(!L.length){ box.innerHTML = '<div class="dn-sub">📗 Buchinhalt nicht verfügbar.</div>'; return; }
    const b = L[CUR] || L[0];
    const sel = '<div class="dn-tabs">' + L.map((x, i) =>
      '<button class="btn btn-' + (i === CUR ? 'p' : 'o') + ' btn-sm" data-lk="' + i + '">📗 Lektion '
      + x.n + '</button>').join(' ') + '</div>';
    let h = sel + '<div class="dn-hero"><span class="dn-crest">📗</span><div><h2>'
      + esc(b._meta.titre) + '</h2><p class="dn-sub">offizielles Lehrbuch ' + esc(b._meta.niveau)
      + ' · ' + b.exos.length + ' Aufgaben auf Deutsch · Texte & Dialoge aus dem Buch</p></div></div>'
      + '<div class="card"><b>🎯 Ziele</b><div class="dn-check">'
      + b.objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div>'
      + '<b style="margin-top:9px">📘 Grammatik</b><div class="dn-check">'
      + b.grammaire_objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div></div>'
      + '<div class="card"><b>📖 Texte & Dialoge aus dem Buch</b>'
      + b.textes.map((t, i) => '<div class="dn-q"><span class="dn-qt"><b>' + esc(t.titre)
          + '</b><br>' + esc(t.de) + '</span>'
          + '<button class="btn btn-o btn-sm" data-t="' + i + '">🔊 hören</button></div>').join('')
      + '</div>'
      + '<div class="card"><b>🔑 Wortschatz</b><div class="dn-check">'
      + b.vocab.map(v => '<span>' + esc(v) + '</span>').join('') + '</div>'
      + '<b style="margin-top:9px">📐 Konjugation</b>'
      + b.tables.map(t => '<div class="dn-q"><span class="dn-qt"><b>' + esc(t.verbe)
          + '</b> · ' + t.formes.map((f, i) => PERS[i] + ' ' + esc(f)).join(' · ')
          + '</span></div>').join('') + '</div>'
      + '<div class="card"><b>✍️ Übungen — ' + b.exos.length + ' Aufgaben (wie eine Klassenarbeit)</b>'
      + b.exos.map((x, i) => exoHtml(x, i)).join('')
      + '<button class="btn btn-p btn-block" id="bkCorr">✅ Meine Arbeit korrigieren</button>'
      + '<div id="bkNote"></div></div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-lk]').forEach(bl => bl.addEventListener('click', () => {
      CUR = +bl.dataset.lk; render();
    }));
    box.querySelectorAll('[data-t]').forEach(bt => bt.addEventListener('click', () => {
      const t = b.textes[+bt.dataset.t];
      if(window.VOIX && window.VOIX.parler) window.VOIX.parler(t.de, 'de-DE');
    }));
    $('#bkCorr').addEventListener('click', () => corriger(b, box));
  }

  function exoHtml(x, i){
    let inner = '<span class="dn-qt">' + (i + 1) + '. ' + esc(x.q) + '</span>';
    if(x.g === 'vf') inner += '<label><input type="radio" name="bk' + i + '" value="1"> richtig</label>'
      + '<label><input type="radio" name="bk' + i + '" value="0"> falsch</label>';
    else if(x.g === 'mcq') inner += x.opts.map((o, k) => '<label><input type="radio" name="bk' + i
      + '" value="' + k + '"> ' + esc(o) + '</label>').join('');
    else if(x.g === 'prod') inner += '<textarea rows="5" placeholder="Schreibe hier…"></textarea>'
      + '<div class="dn-check">' + x.checklist.map(c => '<span>☐ ' + c + '</span>').join('') + '</div>'
      + '<div class="dn-self">Selbstnote: <select id="bkp' + i + '"><option value="0">0</option>'
      + '<option value="1">1</option><option value="2">2</option><option value="3">3</option>'
      + '<option value="4">4</option></select> / 4</div>';
    else inner += '<input class="bk-in" id="bki' + i + '" placeholder="deine Antwort">';
    return '<div class="dn-q" data-i="' + i + '">' + inner + '<div class="bk-fb" id="bkf' + i
      + '" hidden></div></div>';
  }

  function corriger(b, box){
    let pts = 0, tot = 0, errs = 0;
    b.exos.forEach((x, i) => {
      const poids = x.g === 'prod' ? 4 : 1;
      tot += poids;
      const fb = $('#bkf' + i);
      let ok = null, got = '';
      if(x.g === 'vf'){
        const s = box.querySelector('input[name="bk' + i + '"]:checked');
        got = s ? (s.value === '1' ? 'richtig' : 'falsch') : '';
        ok = s && ((s.value === '1') === x.a);
      }else if(x.g === 'mcq'){
        const s = box.querySelector('input[name="bk' + i + '"]:checked');
        got = s ? x.opts[+s.value] : '';
        ok = s && (+s.value === x.a);
      }else if(x.g === 'prod'){
        const n = Math.min(4, Math.max(0, +(($('#bkp' + i) || {}).value || 0)));
        pts += n;
        if(fb){ fb.hidden = false; fb.className = 'bk-fb ' + (n >= 3 ? 'ok' : 'ko');
          fb.textContent = 'Selbstnote: ' + n + ' / 4'; }
        return;
      }else{
        got = (($('#bki' + i) || {}).value || '').trim().toLowerCase();
        ok = got === String(x.a).toLowerCase();
      }
      if(ok) pts += poids;
      else {
        errs++;
        if(window.MEMOIRE) try{ window.MEMOIRE.record({ q: x.q, bad: got || '(vide)',
          good: x.a === true ? 'richtig' : x.a === false ? 'falsch' : String(x.a),
          comp: 'livre-L' + b.n, unite: b.n, src: 'buch' }); }catch(e){}
      }
      if(fb){ fb.hidden = false; fb.className = 'bk-fb ' + (ok ? 'ok' : 'ko');
        fb.innerHTML = (ok ? '✅ ' : '❌ ') + (ok ? '' : '→ ' + esc(
          x.a === true ? 'richtig' : x.a === false ? 'falsch'
          : (x.opts ? x.opts[x.a] : x.a)) + (x.why ? ' · ' + esc(x.why) : '')); }
    });
    const note = pts / tot * 20;
    $('#bkNote').innerHTML = '<div class="dn-res">Note: <b>' + note.toFixed(1) + ' / 20</b> · '
      + (pts) + '/' + tot + ' points · ' + errs + ' Fehler'
      + '<br><span>jeder Fehler ist eine 🧠 Lernkarte geworden (Lektion 1)</span></div>';
    $('#bkNote').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.renderBuch = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'buch') render(); });
})();
