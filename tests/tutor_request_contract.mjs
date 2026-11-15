/* Lot 611 — contrôles statiques du contrat partagé chat/voix/Worker.
   Exécution depuis la racine : node tests/tutor_request_contract.mjs
   Ce fichier vérifie le câblage source, pas la qualité réelle du modèle ni du micro.
*/
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const ia = read('ia.js');
const voice = read('parle.js');
const chat = read('app.js');
const worker = read('worker/ia-ask.js');

const checks = [
  ['ia.js accepte les requêtes structurées et les chaînes historiques',
    /input && typeof input === 'object/.test(ia) && /raw_text: input/.test(ia)],
  ['ia.js conserve séparément le texte brut et le texte normalisé',
    /req\.raw_text/.test(ia) && /req\.normalized_text/.test(ia)],
  ['ia.js transmet matière, niveau et filière du contexte actif',
    /window\.CONTEXT\.ctx\(\)/.test(ia) && /subject: schoolContext\.subject/.test(ia) &&
    /level: schoolContext\.level/.test(ia) && /track: schoolContext\.track/.test(ia)],
  ['ia.js enrichit le Worker avec BIBLIO et RAG allemand',
    /BIBLIO\.context\(q/.test(ia) && /window\.RAG\.cherche\(q\)/.test(ia)],
  ['parle.js transmet transcription brute, mode voix et langues',
    /raw_text: q/.test(voice) && /input_mode: 'voice'/.test(voice) &&
    /selected_language: lang/.test(voice) && /detected_language: LASTLANG/.test(voice)],
  ['parle.js distingue des marqueurs Darija/Arabizi',
    /function detectDialect\(t\)/.test(voice) && /3lach|kifach|bezaf/.test(voice)],
  ['app.js appelle le même orchestrateur pour le chat écrit',
    /window\.reponseIA\(\{[\s\S]*?input_mode: 'text'/.test(chat)],
  ['le chat n’appelle plus directement le Worker /ask',
    !/fetch\(proxy \+ '\/ask'/.test(chat)],
  ['Worker valide les métadonnées et conserve la question originale',
    /detected_language: safeField/.test(worker) && /subject: safeField/.test(worker) &&
    /QUESTION ORIGINALE DE L’ÉLÈVE/.test(worker)],
  ['Worker reçoit une consigne pédagogique sensible à la darija',
    /DIALECTE DÉTECTÉ = darija/.test(worker) && /explique étape par étape/.test(worker)],
  ['ia.js garde un historique temporaire isolé par utilisateur',
    /AUTH\.session\(\)/.test(ia) && /DIALOGUE_OWNER/.test(ia) &&
    /DIALOGUE\.slice\(-8\)/.test(ia) && !/localStorage.*DIALOGUE/.test(ia)],
  ['Worker borne l’historique et refuse les rôles non autorisés',
    /b\.history\.slice\(-8\)/.test(worker) && /item\.role !== 'user' && item\.role !== 'assistant'/.test(worker) &&
    /slice\(0, 1000\)/.test(worker)],
  ['Worker utilise les tours précédents pour garder le fil',
    /Utilise les tours précédents pour conserver le fil/.test(worker)]
];

let failures = 0;
for (const [label, ok] of checks) {
  console.log((ok ? 'PASS ' : 'FAIL ') + label);
  if (!ok) failures++;
}
console.log('\nContrat partagé chat/voix : ' + (checks.length - failures) + '/' + checks.length);
if (failures) process.exitCode = 1;
