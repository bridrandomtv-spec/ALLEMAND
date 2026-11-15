/* Lot 614 — matrice de détection Darija/Arabizi et contrat de couverture.
   Exécution : node tests/tutor_language_matrix.mjs
   Ce test valide les heuristiques et la structure de la matrice, pas la qualité du LLM. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const ia = read('ia.js');
const voice = read('parle.js');
const matrix = JSON.parse(read('tests/tutor_matrix.json'));

function extractRegex(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const found = source.match(new RegExp('const ' + escaped + ' = (\\/[^\\n]+\\/i);'));
  assert.ok(found, 'expression régulière ' + name + ' absente');
  const literal = found[1];
  const end = literal.lastIndexOf('/');
  return new RegExp(literal.slice(1, end), literal.slice(end + 1));
}

const latinIA = extractRegex(ia, 'DARJA_LATIN');
const latinVoice = extractRegex(voice, 'DARJA_LATIN');
const arabicIA = extractRegex(ia, 'DARJA_AR');
const arabicVoice = extractRegex(voice, 'DARJA_AR');
assert.equal(latinIA.source, latinVoice.source, 'lexiques Arabizi divergents entre chat et voix');
assert.equal(arabicIA.source, arabicVoice.source, 'lexiques arabes divergents entre chat et voix');

const positivesLatin = ['wach?', '3lach,', 'ma fhemtch!', 'rani fahmt', 'kifach nsta3mel?', 'bezaf'];
const negativesLatin = ['Hallo, wie geht\'s?', 'German Akkusativ', 'bonjour, merci', 'what is the verb?', 'Français et allemand'];
const positivesArabic = ['واش الفرق؟', 'ما فهمتش!', 'راني نقرا', 'علاش نستعمل kein؟'];
const negativesArabic = ['كيف أراجع الدرس؟', 'ما هو الفرق بين Dativ و Akkusativ؟'];

for (const q of positivesLatin) assert.equal(latinIA.test(q), true, 'Arabizi non reconnu : ' + q);
for (const q of negativesLatin) assert.equal(latinIA.test(q), false, 'faux positif Arabizi : ' + q);
for (const q of positivesArabic) assert.equal(arabicIA.test(q), true, 'Darija arabe non reconnue : ' + q);
for (const q of negativesArabic) assert.equal(arabicIA.test(q), false, 'arabe standard classé Darija : ' + q);

assert.ok(Array.isArray(matrix.cases), 'cases[] absent');
assert.ok(matrix.cases.length >= 16, 'la matrice doit conserver au moins 16 cas ciblés');
const ids = matrix.cases.map(x => x.id);
assert.equal(new Set(ids).size, ids.length, 'identifiants de cas dupliqués');
for (const item of matrix.cases) {
  assert.ok(item.input && item.language && item.intent && item.expected, 'cas incomplet : ' + item.id);
  assert.ok(Array.isArray(item.checks) && item.checks.length > 0, 'critères absents : ' + item.id);
}
assert.match(ia, /explicitOutputLanguage/, 'langue de sortie explicite absente du tuteur');
assert.match(voice, /voteLang\(ph\) \|\| preferred \|\| 'de'/, 'repli de langue TTS absent');
assert.match(ia, /function sortieFaible\(local, cause\)[\s\S]*?if\(answerLanguage === 'de'\)[\s\S]*?else if\(answerLanguage === 'fr'\)/, 'messages de secours non alignés sur la langue de sortie');
assert.match(ia, /explicitOutputLanguage && explicitOutputLanguage !== QL && !reponseCourteValide/, 'une réponse locale ne doit pas contourner une consigne explicite de langue');
assert.match(ia, /explicitOutputLanguage && explicitOutputLanguage !== QL\)\) \? loc : ''/, 'un extrait local de langue incompatible ne doit pas être ajouté au secours');
assert.match(ia, /if\(answerLanguage === 'ar' && !\//, 'contrôle arabe appliqué à la langue de sortie et non à la langue de la question');
for (const cue of [/بالدارجة/, /en français/, /auf deutsch/, /en español/, /in italiano/, /بالعربية/]) assert.ok(cue.test(ia), 'consigne explicite de langue absente : ' + cue);
assert.match(ia, /const fixLang = s => \(answerLanguage !== 'ar'/, 'filtre de réponse locale non aligné sur la langue de sortie');

console.log('PASS lexiques Darija/Arabizi identiques entre chat et voix');
console.log('PASS ' + positivesLatin.length + ' exemples Arabizi reconnus et ' + negativesLatin.length + ' faux positifs rejetés');
console.log('PASS ' + positivesArabic.length + ' exemples Darija arabes reconnus et ' + negativesArabic.length + ' phrases MSA rejetées');
console.log('PASS matrice pédagogique : ' + matrix.cases.length + ' cas uniques et structurés');
console.log('PASS contrat de langue de sortie et repli TTS');
