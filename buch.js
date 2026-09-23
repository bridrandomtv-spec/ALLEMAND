/* buch.js — 📗 Livre officiel 2AS : Lektion 1 interactive (textes, vocab, tables,
   57 exercices en allemand corrigés automatiquement, note /20) */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let B = null;
  async function livre(){
    if(B !== null) return B;
    try{ const r = await fetch('assets/bdd/buch_2as.json', { cache:'no-store' });
         B = r.ok ? await r.json() : null; }catch(e){ B = null; }
    return B;
  }
  const PERS = ['ich','du','er/sie/es','wir','ihr','sie/Sie'];
  const GRP = { vf:'Richtig oder falsch? (1 Pkt)', gap:'Ergänze das Verb (1 Pkt)',
    mcq:'Wähle die richtige Antwort (1 Pkt)', num:'Zahlen (1 Pkt)',
    prod:'Textproduktion (4 Pkt)' };

  async function render(){
    const box = $('#buchBody'); if(!box) return;
    const b = await livre();
    if(!b){ box.innerHTML = '<div class="dn-sub">📗 contenu du livre indisponible.</div>'; return; }
    let h = '<div class="dn-hero"><span class="dn-crest">📗</span><div><h2>'
      + esc(b._meta.titre) + '</h2><p class="dn-sub">manuel officiel ' + esc(b._meta.niveau)
      + ' · ' + b.exos.length + ' exercices en allemand · textes & dialogues du livre</p></div></div>'
      + '<div class="card"><b>🎯 objectifs</b><div class="dn-check">'
      + b.objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div>'
      + '<b style="margin-top:9px">📘 grammaire</b><div class="dn-check">'
      + b.grammaire_objectifs.map(o => '<span>' + esc(o) + '</span>').join('') + '</div></div>'
      + '<div class="card"><b>📖 textes & dialogues du livre</b>'
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
      + '<div class="card"><b>✍️ Übungen — ' + b.exos.length + ' exercices (comme un devoir)</b>'
      + b.exos.map((x, i) => exoHtml(x, i)).join('')
      + '<button class="btn btn-p btn-block" id="bkCorr">✅ corriger ma copie</button>'
      + '<div id="bkNote"></div></div>';
    box.innerHTML = h;
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
      + '<div class="dn-self">auto-note : <select id="bkp' + i + '"><option value="0">0</option>'
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
          fb.textContent = 'auto-note : ' + n + ' / 4'; }
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
          comp: 'livre-L1', unite: 1, src: 'buch' }); }catch(e){}
      }
      if(fb){ fb.hidden = false; fb.className = 'bk-fb ' + (ok ? 'ok' : 'ko');
        fb.innerHTML = (ok ? '✅ ' : '❌ ') + (ok ? '' : '→ ' + esc(
          x.a === true ? 'richtig' : x.a === false ? 'falsch'
          : (x.opts ? x.opts[x.a] : x.a)) + (x.why ? ' · ' + esc(x.why) : '')); }
    });
    const note = pts / tot * 20;
    $('#bkNote').innerHTML = '<div class="dn-res">Note : <b>' + note.toFixed(1) + ' / 20</b> · '
      + (pts) + '/' + tot + ' points · ' + errs + ' erreur(s)'
      + '<br><span>chaque erreur est devenue une carte 🧠 mémoire (Lektion 1)</span></div>';
    $('#bkNote').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.renderBuch = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'buch') render(); });
})();
