/* recu_overlay.js — lot ADM-VUE-1 · overlay additif (0 ligne d'admin.js modifiée)
   Chargé APRÈS admin.js (index.html : 1 ligne). Réversible : supprimer fichier + ligne. */
(function () {
  'use strict';
  var URI_RE = /data:[A-Za-z0-9+\/.-]+;base64,[A-Za-z0-9+\/=\s]+/g;

  function clean(u) { return String(u).replace(/\s/g, ''); }
  function koct(u) { return Math.round(u.length * 3 / 4 / 1024); }

  function openBlob(uri) {
    fetch(uri).then(function (r) { return r.blob(); }).then(function (b) {
      var u = URL.createObjectURL(b);
      var w = window.open(u, '_blank');
      if (!w) { var a = document.createElement('a'); a.href = u; a.download = 'recu-' + Date.now() + '.bin'; a.click(); }
    }).catch(function (e) { window.alert('⛔ ouverture impossible : ' + e); });
  }

  function mkBtn(label, uri, mode) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'recu-btn';
    b.textContent = label;
    b.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      if (mode === 'dl') {
        var a = document.createElement('a');
        a.href = uri; a.download = 'recu-' + Date.now() + '.bin'; a.click();
      } else { openBlob(uri); }
    });
    return b;
  }

  /* 1) le base64 brut (phase 6) devient 2 boutons : voir (blob) + télécharger */
  function enrichTextNodes() {
    var hosts = document.querySelectorAll('td, div, p, span');
    for (var i = 0; i < hosts.length; i++) {
      var el = hosts[i];
      if (el.getAttribute('data-recu-done')) continue;
      var kids = el.childNodes, hit = null;
      for (var k = 0; k < kids.length; k++) {
        var n = kids[k];
        if (n.nodeType === 3 && n.nodeValue && n.nodeValue.indexOf('data:') !== -1) { hit = n; break; }
      }
      if (!hit) continue;
      URI_RE.lastIndex = 0;
      var m = URI_RE.exec(hit.nodeValue);
      if (!m) continue;
      el.setAttribute('data-recu-done', '1');
      var uri = clean(m[0]);
      var wrap = document.createElement('span');
      wrap.className = 'recu-wrap';
      wrap.appendChild(mkBtn('📎 voir le reçu (' + koct(uri) + ' Ko)', uri, 'open'));
      wrap.appendChild(mkBtn('⬇ télécharger', uri, 'dl'));
      hit.parentNode.replaceChild(wrap, hit);
    }
  }

  /* 2) les ancres href="data:" (phase 7, bloquées par Chrome/Firefox) s'ouvrent en blob */
  function fixDataAnchors() {
    var as = document.querySelectorAll('a[href^="data:"]');
    for (var j = 0; j < as.length; j++) {
      var a = as[j];
      if (a.getAttribute('data-recu-done')) continue;
      a.setAttribute('data-recu-done', '1');
      a.setAttribute('title', 'ouverture sécurisée (blob) — lot ADM-VUE-1');
      a.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        openBlob(clean(this.getAttribute('href')));
      });
    }
  }

  /* 3) badge read-only : même ref_banque sur plusieurs paiements = ⚠ ref vue ×N */
  function badgeDupRefs() {
    var tables = document.querySelectorAll('table');
    for (var t = 0; t < tables.length; t++) {
      var ths = tables[t].querySelectorAll('th');
      var idx = -1;
      for (var h = 0; h < ths.length; h++) {
        if ((ths[h].textContent || '').indexOf('مرجع البنك') !== -1) { idx = h; break; }
      }
      if (idx === -1) continue;
      var rows = tables[t].querySelectorAll('tr');
      var counts = {}, cells = [];
      for (var r = 0; r < rows.length; r++) {
        var tds = rows[r].querySelectorAll('td');
        if (tds.length <= idx) continue;
        var v = (tds[idx].textContent || '').trim();
        if (!v || v === 'reçu-joint') continue;
        counts[v] = (counts[v] || 0) + 1;
        cells.push({ td: tds[idx], v: v });
      }
      for (var c = 0; c < cells.length; c++) {
        var td = cells[c].td;
        if (td.getAttribute('data-dup-done')) continue;
        if (counts[cells[c].v] > 1) {
          td.setAttribute('data-dup-done', '1');
          var s = document.createElement('span');
          s.className = 'recu-dup';
          s.textContent = ' ⚠ ref vue ×' + counts[cells[c].v];
          td.appendChild(s);
        }
      }
    }
  }

  /* 4) confirmer (ADM-2) → id pré-rempli dans #admRecPid + rappel d'émettre le reçu REC- */
  function prefillRecu() {
    document.addEventListener('click', function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('[data-adm2-conf]') : null;
      if (!t) return;
      var id = t.getAttribute('data-adm2-conf');
      setTimeout(function () {
        var inp = document.getElementById('admRecPid');
        if (inp) {
          inp.value = id;
          inp.style.outline = '2px solid var(--g, #0f9d58)';
          var out = document.getElementById('admRecOut');
          if (out && !out.textContent) out.textContent = '✅ confirmé — pense à émettre le reçu REC- (id pré-rempli)';
        }
      }, 600);
    }, true);
  }

  function enrich() { enrichTextNodes(); fixDataAnchors(); badgeDupRefs(); }

  var timer = null;
  function queueEnrich() {
    if (timer) return;
    timer = setTimeout(function () { timer = null; enrich(); }, 250);
  }

  if (window.MutationObserver) {
    new MutationObserver(queueEnrich).observe(document.documentElement, { childList: true, subtree: true });
  }
  document.addEventListener('dz:view', queueEnrich);
  document.addEventListener('dz:sbready', queueEnrich);
  prefillRecu();
  enrich();

  var st = document.createElement('style');
  st.textContent = '.recu-btn{border:1px solid var(--b,#1d4b31);background:var(--p2,#091f14);color:var(--t,#eaf5ee);border-radius:8px;padding:4px 10px;font-size:11px;cursor:pointer;margin:2px;font-family:inherit}.recu-btn:hover{background:var(--b,#1d4b31)}.recu-wrap{display:inline-block}.recu-dup{color:var(--am,#ffb454);font-size:10px;font-weight:700}';
  document.head.appendChild(st);
})();
