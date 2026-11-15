/* Lot 614 — matrice de détection Darija/Arabizi et contrat de couverture.
   Exécution : node tests/tutor_language_matrix.mjs
   Ce test valide les heuristiques et la structure de la matrice, pas la qualité du LLM. */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p, 'utf8');
const ia = read('ia.js');
const voice = read('parle.js');
const worker = read('worker/ia-ask.js');
const matrix = JSON.parse(read('tests/tutor_matrix.json'));
const subjects = JSON.parse(read('assets/bdd/subjects.json'));
const matieres = JSON.parse(read('assets/bdd/matieres.json'));
const englishPages = JSON.parse(read('assets/bdd/english_pages.json'));
const englishDevoirs = JSON.parse(read('assets/bdd/english_devoirs.json'));
const englishMalakhiss = JSON.parse(read('assets/bdd/english_malakhiss.json'));

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
const englishVoice = extractRegex(voice, 'EN_WORDS');
const spanishVoice = extractRegex(voice, 'ES_WORDS');
const italianVoice = extractRegex(voice, 'IT_WORDS');
assert.equal(latinIA.source, latinVoice.source, 'lexiques Arabizi divergents entre chat et voix');
assert.equal(arabicIA.source, arabicVoice.source, 'lexiques arabes divergents entre chat et voix');
const positivesEnglish = ['What is the lesson about?', 'Can you explain this rule?', 'I have an exercise'];
const negativesEnglish = ['Wie geht es dir?', '¿Dónde está la escuela?', 'Che cosa significa?', 'Bonjour, merci beaucoup.'];
for (const q of positivesEnglish) assert.equal(englishVoice.test(q), true, 'anglais non reconnu pour la voix : ' + q);
for (const q of negativesEnglish) assert.equal(englishVoice.test(q), false, 'faux positif anglais : ' + q);
assert.ok(spanishVoice.test('¿Cuál es la diferencia entre ser y estar?'), 'espagnol non reconnu');
assert.equal(spanishVoice.test('La différence entre les langues est importante.'), false, 'français classé à tort comme espagnol');
assert.ok(italianVoice.test('Qual è la differenza tra essere e avere?'), 'italien non reconnu');
assert.equal(italianVoice.test('La différence entre les langues est importante.'), false, 'français classé à tort comme italien');

const positivesLatin = ['wach?', '3lach,', 'ma fhemtch!', 'rani fahmt', 'kifach nsta3mel?', 'bezaf'];
const negativesLatin = ['Hallo, wie geht\'s?', 'German Akkusativ', 'bonjour, merci', 'what is the verb?', 'Français et allemand'];
const positivesArabic = ['واش الفرق؟', 'ما فهمتش!', 'راني نقرا', 'علاش نستعمل kein؟'];
const negativesArabic = ['كيف أراجع الدرس؟', 'ما هو الفرق بين Dativ و Akkusativ؟'];

for (const q of positivesLatin) assert.equal(latinIA.test(q), true, 'Arabizi non reconnu : ' + q);
for (const q of negativesLatin) assert.equal(latinIA.test(q), false, 'faux positif Arabizi : ' + q);
for (const q of positivesArabic) assert.equal(arabicIA.test(q), true, 'Darija arabe non reconnue : ' + q);
for (const q of negativesArabic) assert.equal(arabicIA.test(q), false, 'arabe standard classé Darija : ' + q);

assert.ok(Array.isArray(matrix.cases), 'cases[] absent');
assert.ok(matrix.cases.length >= 20, 'la matrice doit couvrir au moins 20 cas ciblés');
const ids = matrix.cases.map(x => x.id);
assert.equal(new Set(ids).size, ids.length, 'identifiants de cas dupliqués');
for (const item of matrix.cases) {
  assert.ok(item.input && item.language && item.intent && item.expected, 'cas incomplet : ' + item.id);
  assert.ok(Array.isArray(item.checks) && item.checks.length > 0, 'critères absents : ' + item.id);
}
assert.match(ia, /explicitOutputLanguage/, 'langue de sortie explicite absente du tuteur');
assert.match(ia, /declared.indexOf\('en'\) === 0/, 'anglais absent de la détection par langue déclarée');
assert.match(ia, /anglais:'en', espanol:'es', español:'es', italien:'it'/, 'correspondance matière/langue absente');
assert.match(ia, /in English\|en anglais\|بالإنجليزية/, 'consigne de sortie anglaise absente');
assert.match(ia, /en: 'I did not fully understand/, 'message de secours anglais absent');
assert.match(ia, /schoolContext.subject === 'allemand' && typeof fn === 'function'/, 'le moteur local allemand doit être isolé des autres matières');
assert.match(ia, /schoolContext.subject === 'anglais'[\s\S]*?englishContext\(q\)/, 'les ressources anglaises existantes ne sont pas raccordées au tuteur');
assert.match(ia, /if\(schoolContext.subject === 'allemand'\)[\s\S]*?BIBLIO.context/, 'BIBLIO allemande doit être limitée à la matière allemande');
assert.match(worker, /Pour l\\'anglais, l\\'espagnol et l\\'italien[\s\S]*?explication générale/, 'règle de réponse sans source pour les matières linguistiques absente');
assert.ok(Object.keys(englishPages.pages || {}).length >= 10, 'pages du corpus anglais absentes ou trop peu nombreuses');
assert.ok((englishDevoirs.items || []).length >= 1, 'devoirs anglais absents');
assert.ok((englishMalakhiss.malakhiss || []).length >= 1, 'fiches anglaises absentes');
assert.match(voice, /const EN_VOTE =/, 'vote de langue anglaise absent du TTS');
assert.match(voice, /en > Math.max\(de, fr, es, it\)/, 'anglais absent du vote TTS');
assert.match(voice, /en:'en-US'/, 'voix anglaise par défaut absente');
assert.match(worker, /MAÎTRISES SIX langues[\s\S]*?allemand, anglais/, 'anglais absent du contrat de langue du Worker');
assert.match(worker, /\['ar','de','en','fr','es','it'\]/, 'anglais refusé par la validation Worker');
for (const subject of ['anglais','espanol','italien']) assert.ok(matrix.cases.some(x => x.subject === subject), 'cas de test absent pour la matière ' + subject);
for (const subject of ['allemand','anglais','espanol','italien']) assert.ok(subjects.some(x => x.id === subject), 'matière absente de subjects.json : ' + subject);
assert.equal(subjects.find(x => x.id === 'anglais').status, 'partial', 'anglais doit rester déclaré partiel');
assert.equal(subjects.find(x => x.id === 'espanol').status, 'planned', 'espagnol ne doit pas être annoncé actif avant ses contenus');
assert.equal(subjects.find(x => x.id === 'italien').status, 'planned', 'italien ne doit pas être annoncé actif avant ses contenus');
for (const level of ['2AS','3AS']) for (const subject of ['espanol','italien']) assert.ok(matieres.par_niveau[level].langues.includes(subject), subject + ' absent du parcours langues ' + level);
assert.match(voice, /voteLang\(ph\) \|\| preferred \|\| 'de'/, 'repli de langue TTS absent');
assert.match(ia, /function sortieFaible\(local, cause\)[\s\S]*?if\(answerLanguage === 'de'\)[\s\S]*?else if\(answerLanguage === 'fr'\)/, 'messages de secours non alignés sur la langue de sortie');
assert.match(ia, /explicitOutputLanguage && !reponseCourteValide/, 'une réponse locale ne doit pas contourner une consigne explicite de langue');
assert.match(ia, /!explicitOutputLanguage\) \? loc : ''/, 'un extrait local ne doit pas être ajouté lorsqu’une langue est explicitement demandée');
assert.match(ia, /if\(answerLanguage === 'ar' && !\//, 'contrôle arabe appliqué à la langue de sortie et non à la langue de la question');
for (const cue of [/بالدارجة/, /en français/, /auf deutsch/, /en español/, /in italiano/, /بالعربية/]) assert.ok(cue.test(ia), 'consigne explicite de langue absente : ' + cue);
assert.match(ia, /const fixLang = s => \(answerLanguage !== 'ar'/, 'filtre de réponse locale non aligné sur la langue de sortie');

console.log('PASS lexiques Darija/Arabizi identiques entre chat et voix');
console.log('PASS ' + positivesLatin.length + ' exemples Arabizi reconnus et ' + negativesLatin.length + ' faux positifs rejetés');
console.log('PASS ' + positivesArabic.length + ' exemples Darija arabes reconnus et ' + negativesArabic.length + ' phrases MSA rejetées');
console.log('PASS matrice pédagogique : ' + matrix.cases.length + ' cas uniques et structurés');
console.log('PASS contrat de langue de sortie et repli TTS');
console.log('PASS ' + positivesEnglish.length + ' formulations anglaises reconnues et ' + negativesEnglish.length + ' faux positifs rejetés');
console.log('PASS détection lexicale espagnole/italienne et rejet d’une phrase française ambiguë');
console.log('PASS anglais partiel et espagnol/italien programmés dans les registres de matières');
console.log('PASS espagnol et italien référencés dans les parcours langues 2AS/3AS');
console.log('PASS ressources anglaises pages/devoirs/fiches reliées au tuteur sans contamination allemande');
