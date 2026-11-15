/* Lot 608 — vérifications statiques du contrat de chargement RAG.
   Exécution depuis la racine : node tests/rag_loader_contract.mjs
   Ces assertions inspectent le contrat source ; elles ne remplacent pas les
   tests navigateur avec un serveur HTTP et des artefacts RAG synthétiques.
*/
import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync('rag.js', 'utf8');
const checks = [
  ['version du manifeste strictement fixée', /MANIFEST_VERSION\s*=\s*'2\.0\.0'/],
  ['validation de la structure du manifeste', /function valideManifest\(m\)/],
  ['validation des identifiants uniques des chunks', /function valideChunks\(chunks, attendu\)/],
  ['validation des postings contre les IDs du shard', /function valideTermes\(termes, ids\)/],
  ['nom de shard protégé contre les chemins arbitraires', /\^shard_\[0-9\]\{2,\}\\\.json\$/],
  ['comptage total vérifié avant résultat shardé', /total === man\.total_chunks && idsVus\.size === man\.total_chunks/],
  ['repli sur index complet après incident shardé', /const idx = await chargeLegacy\(\);\s*return idx \? meilleur\(idx, ts\) : null;/],
  ['absence d’arrêt anticipé avant lecture de tous les shards', /if\(best && best\.score >= SEUIL \+ 3\) break/],
];

let failures = 0;
for (const [label, pattern] of checks) {
  const negative = label.startsWith('absence');
  const found = pattern.test(source);
  const ok = negative ? !found : found;
  console.log((ok ? 'PASS ' : 'FAIL ') + label);
  if (!ok) failures++;
}
console.log('\nContrat source RAG : ' + (checks.length - failures) + '/' + checks.length);
if (failures) process.exitCode = 1;
