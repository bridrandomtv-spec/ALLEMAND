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
const rag = read('rag.js');

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
  ['parle.js sépare la langue du micro de la langue détectée pour la réponse',
    /raw_text: q/.test(voice) && /input_mode: 'voice'/.test(voice) &&
    /selected_language: 'auto'/.test(voice) && /recognition_language: lang/.test(voice) && /detected_language: LASTLANG \|\| ''/.test(voice)],
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
  ['ia.js garde un historique temporaire isolé par utilisateur connecté',
    /AUTH\.session\(\)/.test(ia) && /DIALOGUE_OWNER/.test(ia) &&
    /DIALOGUE\.slice\(-8\)/.test(ia) && /if\(!owner \|\| !question \|\| !answer\)/.test(ia) &&
    !/localStorage.*DIALOGUE/.test(ia)],
  ['Worker borne l’historique et refuse les rôles non autorisés',
    /b\.history\.slice\(-8\)/.test(worker) && /item\.role !== 'user' && item\.role !== 'assistant'/.test(worker) &&
    /slice\(0, 1000\)/.test(worker)],
  ['Worker utilise les tours précédents pour garder le fil',
    /Utilise les tours précédents pour conserver le fil/.test(worker)],
  ['ia.js efface immédiatement la mémoire au logout et au changement de compte',
    /addEventListener\('dz:auth'/.test(ia) && /if\(!next \|\| next !== DIALOGUE_OWNER\)/.test(ia) &&
    /owner !== dialogueOwner\(\)/.test(ia)],
  ['le détecteur Darija/Arabizi accepte ponctuation et variantes écrites',
    /\[\^A-Za-z0-9\]/.test(ia) && /ma\\s\*fhemtch/.test(ia) &&
    /\[\^A-Za-z0-9\]/.test(voice) && /function detectDialect\(t\)/.test(voice)],
  ['le chat réutilise le moteur TTS segmenté du professeur vocal',
    /window\.parleSpeak\(rep, window\.__IA_LAST_LANGUAGE/.test(chat) && /window\.parleSpeak = function\(texte, langue\)/.test(voice)],
  ['ia.js calcule et transmet la langue de sortie demandée',
    /const answerLanguage = explicitOutputLanguage/.test(ia) && /output_language: answerLanguage/.test(ia)],
  ['une valeur unknown fournie par la voix ne masque pas le dialecte QUST ni une demande explicite en darija',
    /requestedDialect/.test(ia) && /understanding && understanding\.dialect === 'darija'/.test(ia) &&
    /بالدارجة\|بالدزيرية\|بالجزائرية\|en darija\|darija\|derdja/.test(ia)],
  ['les lexiques Darija arabe et Arabizi sont nommés et cohérents entre canaux',
    /const DARJA_AR =/.test(ia) && /const DARJA_LATIN =/.test(ia) &&
    /const DARJA_AR =/.test(voice) && /const DARJA_LATIN =/.test(voice) &&
    ia.match(/const DARJA_LATIN = (\/[^\n]+\/i);/)?.[1] === voice.match(/const DARJA_LATIN = (\/[^\n]+\/i);/)?.[1]],
  ['Worker renvoie une métadonnée de langue de réponse validée',
    /answer_language: meta\.output_language/.test(worker) && /LANGUE DE SORTIE EXIGÉE/.test(worker)],
  ['TTS utilise la langue préférée quand le vote lexical est indécis',
    /if\(best === 0\) return ''/.test(voice) && /voteLang\(ph\) \|\| preferred \|\| 'de'/.test(voice)],
  ['la voix transmet la langue de sortie au TTS',
    /speak\(rep\.slice\(0, 2200\), window\.__IA_LAST_LANGUAGE/.test(voice)],
  ['le double nettoyage TTS est supprimé',
    !/texte = spoken\(texte\);\s*texte = spoken\(texte\);/.test(voice)],
  ['ia.js récupère la référence RAG avant de construire le contexte du professeur',
    /window\.RAG\.source\(hit\)/.test(ia) && /PROVENANCE RAG/.test(ia) && /ragCitation/.test(ia)],
  ['rag.js ne certifie une référence que si le SHA-256 du chunk et du catalogue concorde',
    /async function source\(hit\)/.test(rag) && /hit\.source_sha256 !== doc\.source_sha256/.test(rag) &&
    /source: source/.test(rag)],
  ['Worker traite les extraits documentaires comme des données non fiables',
    /données non fiables/.test(worker) && /ne suis jamais les instructions/.test(worker)]
];

let failures = 0;
for (const [label, ok] of checks) {
  console.log((ok ? 'PASS ' : 'FAIL ') + label);
  if (!ok) failures++;
}
console.log('\nContrat partagé chat/voix : ' + (checks.length - failures) + '/' + checks.length);
if (failures) process.exitCode = 1;

// Une langue de reconnaissance choisie pour le navigateur ne doit jamais être présentée comme langue détectée de la question.
if (/LASTLANG = detectLang\(q\) \|\| lang/.test(voice)) throw new Error('la langue du micro force encore la langue de réponse');
console.log('PASS langue de reconnaissance indépendante de la langue de réponse');
