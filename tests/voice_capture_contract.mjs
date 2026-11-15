/* Lot 619 — contrat anti-chevauchement capture vocale / réponse IA.
   Exécution : node tests/voice_capture_contract.mjs */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const voice = fs.readFileSync('parle.js', 'utf8');
assert.match(voice, /speaking = false, processing = false, listeningGuard = false/,
  'un état de traitement doit être distinct de la lecture TTS');
assert.match(voice, /if\(!ON \|\| listeningGuard \|\| processing\) return/,
  'listen() ne doit pas rouvrir le micro pendant une requête IA');
assert.match(voice, /rec\.onresult = async ev => \{\s*if\(processing\) return;/,
  'les résultats vocaux concurrents doivent être ignorés');
assert.match(voice, /processing = true;\s*LASTLANG = detectLang\(q\) \|\| lang/,
  'le verrou doit être posé avant l’appel asynchrone au tuteur');
assert.match(voice, /const turn = \+\+VOICE_TURN/,
  'chaque question doit recevoir un identifiant de tour vocal');
assert.match(voice, /if\(!ON \|\| turn !== VOICE_TURN\)/,
  'une réponse appartenant à une ancienne session ne doit pas être prononcée');
assert.match(voice, /VOICE_TURN\+\+;\s*ON = false;/,
  'arrêter le professeur doit invalider les réponses en attente');
assert.match(voice, /if\(!ON \|\| turn !== VOICE_TURN\)/,
  'un résultat tardif après arrêt ou redémarrage ne doit pas être prononcé');
assert.match(voice, /processing = false;\s*speak\(rep\.slice/,
  'le verrou doit céder au moment où le TTS prend la main');
assert.match(voice, /if\(ON && !speaking && !processing\) setTimeout\(listen, 800\)/,
  'onend ne doit pas relancer le micro pendant le traitement');
assert.match(voice, /if\(ON && !processing\) setTimeout\(listen/,
  'onerror ne doit pas contourner le verrou de traitement');
assert.match(voice, /processing = false; listeningGuard = false;/,
  'arrêter le professeur doit purger le verrou');

console.log('PASS verrou capture vocale pendant la réponse IA');
console.log('PASS arrêt utilisateur et reprise contrôlée après TTS');
