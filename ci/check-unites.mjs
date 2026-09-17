/* ══════════════════════════════════════════════════════════════════════
   ci/check-unites.mjs — GARDE-FOU ANTI-UNITÉ-VIDE
   ──────────────────────────────────────────────────────────────────────
   Pourquoi ce fichier existe :
   le commit 6215dd89b3 a renommé l'export `window.UNITES_3AS_A` en
   `window.U3AS_A` et déplacé `duree_totale` sous `.meta`. app.js lisait
   toujours `UNITES_3AS_A[i].seances` → les 3 ternaires tombaient sur leurs
   replis (`[]`, `null`, `360`). U7/U8/U9 s'affichaient VIDES en production,
   sans AUCUNE erreur en console : panne silencieuse.

   Ce script ferme cette classe de bug définitivement : il CHARGE réellement
   les fichiers d'unités dans Node, puis RÉSOUT chaque entrée du registre
   UNITES d'app.js exactement comme le navigateur le ferait, et exige
   `seances.length > 0` et `devoir !== null` pour les 12 unités.

   Usage : node ci/check-unites.mjs   (depuis la racine du dépôt)
   Sortie : 0 = tout va bien · 1 = au moins une unité vide ou non résolue
   ══════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';

globalThis.window = globalThis;

const FICHIERS = [
  'unite2.js', 'unite3.js', 'unite4.js', 'unite5.js', 'unite6.js',
  'unites3as_a.js', 'unite10.js', 'unite11.js', 'unite12.js',
  'unite13.js', 'unite14.js', 'unite15.js', 'unite16.js',
];
const fails = [];
const charge = [];

/* ── 1) Chargement réel des fichiers d'unités ──────────────────────────
   Chaque fichier se termine par `window.X = …`, donc les données deviennent
   de vraies globals après un eval indirect (portée globale).               */
for (const f of FICHIERS) {
  if (!fs.existsSync(f)) { fails.push(`${f} : fichier absent du dépôt`); continue; }
  try {
    (0, eval)(fs.readFileSync(f, 'utf8'));
    charge.push(f);
  } catch (e) {
    fails.push(`${f} : échec de chargement — ${e.message}`);
  }
}
console.log(`  fichiers chargés dans Node : ${charge.length}/${FICHIERS.length}`);

/* ── 2) Extraction du registre UNITES depuis app.js ──────────────────── */
if (!fs.existsSync('app.js')) {
  console.error('::error::app.js introuvable');
  process.exit(1);
}
const app = fs.readFileSync('app.js', 'utf8');
const blk = app.match(/const UNITES = \[([\s\S]*?)\n\];/);
if (!blk) {
  console.error('::error::app.js : registre « const UNITES = [ … ]; » introuvable');
  process.exit(1);
}

/* Découpe en entrées : chaque entrée commence par « { n:<numéro>, » */
const morceaux = blk[1].split(/\{\s*n:/).slice(1);
console.log(`  entrées du registre : ${morceaux.length}`);
if (morceaux.length !== 16) {
  fails.push(`app.js : registre UNITES = ${morceaux.length} entrées, attendu 16`);
}

/* ── 3) Résolution de chaque unité, comme le ferait le navigateur ────── */
const resolues = [];
for (const m of morceaux) {
  const n = (m.match(/^\s*(\d+)/) || [])[1];
  if (!n) { fails.push('app.js : entrée de registre sans numéro'); continue; }

  /* 3a) Cas indexé : UNITES_3AS_A[0].seances */
  const idx = m.match(/([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]\s*\.\s*seances/);
  /* 3b) Cas simple : window.UNITE2 ? UNITE2.seances */
  const simple = m.match(/window\.([A-Za-z_][A-Za-z0-9_]*)\s*\?\s*\1\s*\.\s*seances/);

  let src = null;
  let origine = '';
  if (idx) {
    const nom = idx[1];
    const i = Number(idx[2]);
    const tab = globalThis[nom];
    origine = `${nom}[${i}]`;
    if (!Array.isArray(tab)) {
      fails.push(`U${n} : ${nom} n'est pas un tableau (window.${nom} = ${typeof tab})`
                 + ' — unité VIDE en ligne');
    } else if (tab.length <= i) {
      fails.push(`U${n} : ${nom} ne contient que ${tab.length} élément(s), index ${i} inexistant`
                 + ' — unité VIDE en ligne');
    } else {
      src = tab[i];
    }
  } else if (simple) {
    const nom = simple[1];
    origine = nom;
    src = globalThis[nom] || null;
    if (!src) {
      fails.push(`U${n} : window.${nom} est undefined — unité VIDE en ligne`);
    }
  } else {
    /* 3c) Unité 1 : données internes à app.js (SEANCES_U1 / DEVOIR_U1) */
    const ns = (app.match(/\{\s*n:\d+,\s*de:'/g) || []).length;
    origine = 'app.js:SEANCES_U1';
    if (!/const SEANCES_U1\s*=\s*\[/.test(app)) {
      fails.push('U1 : const SEANCES_U1 introuvable dans app.js');
    } else if (!/const DEVOIR_U1\s*=\s*\{/.test(app)) {
      fails.push('U1 : const DEVOIR_U1 introuvable dans app.js');
    } else {
      const deb = app.indexOf('const SEANCES_U1');
      const fin = app.indexOf('const DEVOIR_U1', deb);
      const corps = app.slice(deb, fin > deb ? fin : app.length);
      const nb = (corps.match(/\{\s*n:\d+,\s*de:'/g) || []).length;
      if (nb < 8) fails.push(`U1 : SEANCES_U1 ne contient que ${nb} séances (< 8)`);
      /* Mesure RÉELLE du devoir U1 dans app.js — jamais de valeur codée en dur. */
      const dDeb = app.indexOf('const DEVOIR_U1');
      const dFin = app.indexOf('const CORRIGE_U1', dDeb);
      const dCorps = app.slice(dDeb, dFin > dDeb ? dFin : app.length);
      const nParties = (dCorps.match(/id:\s*'(?:I|II|III)'\s*,/g) || []).length;
      if (nParties !== 3) {
        fails.push(`U1 : DEVOIR_U1 a ${nParties} parties, attendu 3 (I/II/III)`);
      }
      const ptsU1 = [...dCorps.matchAll(/id:\s*'(?:I|II|III)'[^}]*?pts:\s*(\d+)/g)]
        .map(mm => Number(mm[1]));
      const sommeU1 = ptsU1.reduce((a, b) => a + b, 0);
      if (ptsU1.length === 3 && sommeU1 !== 20) {
        fails.push(`U1 : barème ${sommeU1}/20 ≠ 20`);
      }
      const mDuree = m.match(/duree:\s*(\d+)/);
      resolues.push({
        n: Number(n), origine, seances: nb, devoir: nParties === 3,
        parties: nParties, duree: mDuree ? Number(mDuree[1]) : null, de: '',
      });
      continue;
    }
  }

  if (!src) continue;

  /* ── 4) Vérification du contenu résolu ── */
  const seances = Array.isArray(src.seances) ? src.seances : [];
  if (seances.length === 0) {
    fails.push(`U${n} (${origine}) : seances VIDE — l'élève verrait une unité sans contenu`);
  }
  if (!src.devoir || typeof src.devoir !== 'object') {
    fails.push(`U${n} (${origine}) : devoir absent ou null — pas de /20 évaluables`);
  } else {
    const parties = Array.isArray(src.devoir.parties) ? src.devoir.parties : [];
    if (parties.length !== 3) {
      fails.push(`U${n} (${origine}) : devoir à ${parties.length} parties, attendu 3 (I/II/III)`);
    } else {
      const somme = parties.reduce(
        (a, p) => a + (Number(p.points !== undefined ? p.points : p.pts) || 0), 0);
      if (somme !== 20) {
        fails.push(`U${n} (${origine}) : barème ${somme}/20 ≠ 20`);
      }
    }
  }
  /* duree_totale : app.js la lit AU PREMIER NIVEAU pour le lot 3AS */
  const duree = src.duree_totale || (src.meta && src.meta.duree_totale);
  if (!duree) {
    fails.push(`U${n} (${origine}) : duree_totale introuvable (ni au 1er niveau ni sous .meta)`);
  }
  resolues.push({
    n: Number(n), origine,
    seances: seances.length,
    devoir: Boolean(src.devoir),
    parties: (src.devoir && Array.isArray(src.devoir.parties)) ? src.devoir.parties.length : 0,
    duree: duree || 0,
    de: (src.meta && src.meta.de) || '',
  });
}

/* ── 5) Rapport ─────────────────────────────────────────────────────── */
console.log('');
console.log('  ── Unités résolues à l\'exécution ──');
for (const u of resolues) {
  const drapeau = (u.seances > 0 && u.devoir) ? '✅' : '❌';
  console.log(`     ${drapeau} U${String(u.n).padStart(2)}  ${String(u.seances).padStart(2)} séances`
    + ` · devoir ${u.devoir ? '✓' : '✗'} (${u.parties}/3 parties)`
    + ` · ${u.duree === null || u.duree === undefined
        ? '  —' : String(u.duree).padStart(3)} min · via ${u.origine}`
    + (u.de ? ` · ${u.de}` : ''));
}

const vides = resolues.filter(u => u.seances === 0 || !u.devoir);
const manquantes = 16 - resolues.length;
if (manquantes > 0) {
  fails.push(`${manquantes} unité(s) du registre non résolue(s) — voir les erreurs ci-dessus`);
}
if (vides.length > 0) {
  fails.push(`${vides.length} unité(s) VIDES : ` + vides.map(u => 'U' + u.n).join(', '));
}

console.log('');
if (fails.length) {
  console.log(`::error::${fails.length} unité(s) non conformes — ${fails.join(' | ')}`);
  for (const f of fails) console.log('  ❌ ' + f);
  process.exit(1);
}
console.log(`  ✅ ${resolues.length}/${morceaux.length} unités résolues à l'exécution, aucune vide`);
console.log('     (seances > 0 · devoir non null · 3 parties · barème /20 · duree_totale présente)');
process.exit(0);
