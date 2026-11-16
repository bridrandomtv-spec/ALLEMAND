import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const fixture = JSON.parse(fs.readFileSync(
  new URL('./fixtures/rag-eval/questions-v1.json', import.meta.url), 'utf8'
));
const ragSource = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');

// All corpus/index data below exists only in memory and is synthetic.
const corpus = {
  documents: fixture.documents.map(doc => ({
    id: doc.id, titre: doc.title, matiere: doc.subject, niveau: doc.level,
    type: 'synthetic-test', langue: doc.language,
    droits_statut: 'verifies',
    droits_reference: 'SYNTHETIC-TEST-ONLY-NOT-A-REAL-LICENCE'
  }))
};
const chunks = fixture.documents.map((doc, index) => ({
  n: index + 1, doc: doc.id, texte: doc.passage
}));
const terms = {};
const files = {
  'assets/bdd/corpus.json': corpus,
  'assets/bdd/shards_manifest.json': { shards: [{ file: 'benchmark-synthetic.json' }] },
  'assets/bdd/shards/benchmark-synthetic.json': { termes: terms, chunks }
};
const document = { addEventListener() {}, querySelector() { return null; }, getElementById() { return null; } };
const window = { document };
const fetch = async url => Object.prototype.hasOwnProperty.call(files, url)
  ? { ok: true, json: async () => files[url] }
  : { ok: false, json: async () => null };
const sandbox = {
  window, document, fetch, console, setTimeout, clearTimeout,
  Object, Array, String, Number, JSON, Math, Set, Map, RegExp
};
vm.runInNewContext(ragSource, sandbox, { filename: 'rag.js' });

// Build the synthetic shard with the exact same query/index normalizer exposed
// by rag.js, so the fixture tests the production matching contract.
for (const chunk of chunks) {
  for (const term of window.RAG.termes(chunk.texte)) (terms[term] ||= []).push(chunk.n);
}
const normalizationChecks = [
  ['Darija Arabic', 'واش الفرق بين المبتدأ والخبر؟ عطيني مثال بسيط.', ['مبتدا', 'خبر']],
  ['Arabizi', 'Chrahli el-jomla el-ismiya b darja, b exemple sahl.', ['الجملة', 'الاسمية']]
];
for (const [label, query, expected] of normalizationChecks) {
  const normalized = window.RAG.termes(query);
  for (const term of expected) {
    assert.ok(normalized.includes(term), label + ' normalization must include ' + term);
  }
}

const rows = [];
const failures = [];
for (const item of fixture.cases) {
  const result = await window.RAG.cherche(item.query);
  const source = result ? window.RAG.provenance(result) : null;
  const retrievedDocumentId = result?.doc || null;
  const abstained = result === null;
  const expectedHit = item.abstain
    ? abstained
    : retrievedDocumentId === item.expectedDocumentId;
  const row = {
    caseId: item.id,
    queryLanguage: item.queryLanguage,
    expectedDocumentId: item.expectedDocumentId,
    retrievedDocumentId,
    chunkId: result?.chunk ?? null,
    lexicalScore: result?.score ?? null,
    abstentionExpected: item.abstain,
    abstained,
    expectedHit,
    provenanceAvailable: !!source,
    provenanceTrust: source?.trust || null
  };
  rows.push(row);
  if (!item.abstain && retrievedDocumentId !== item.expectedDocumentId) {
    failures.push({
      caseId: item.id,
      reason: 'expected_document_not_retrieved',
      expectedDocumentId: item.expectedDocumentId,
      retrievedDocumentId
    });
  }
  if (result && !source) failures.push({ caseId: item.id, reason: 'missing_admitted_provenance' });
  if (source && source.trust !== 'client_unverified') {
    failures.push({ caseId: item.id, reason: 'unexpected_provenance_trust', actual: source.trust });
  }
  if (source && !corpus.documents.some(doc => doc.id === source.documentId)) {
    failures.push({ caseId: item.id, reason: 'provenance_document_not_in_synthetic_registry' });
  }
  if (item.abstain && !abstained) {
    failures.push({ caseId: item.id, reason: 'expected_abstention_but_retrieved', retrievedDocumentId });
  }
}
const eligible = rows.filter(row => row.expectedDocumentId !== null);
const abstentionRows = rows.filter(row => row.abstentionExpected);
const summary = {
  benchmark: fixture.schema,
  dataStatus: fixture.datasetStatus,
  engine: 'existing browser lexical RAG (single best result)',
  environment: 'isolated-node-vm-synthetic-fixture',
  cases: rows.length,
  retrievalEligible: eligible.length,
  hitAt1: eligible.length
    ? eligible.filter(row => row.retrievedDocumentId === row.expectedDocumentId).length / eligible.length
    : null,
  expectedAbstentions: abstentionRows.length,
  correctAbstentions: abstentionRows.filter(row => row.abstained).length,
  abstentionAccuracy: abstentionRows.length
    ? abstentionRows.filter(row => row.abstained).length / abstentionRows.length
    : null,
  failures,
  limitations: [
    'One best result only: hit@k is not measurable with the current RAG API.',
    'No Worker generation or answer-language evaluation is performed.',
    'The corpus, rights registry and shard are synthetic and exist only in memory.',
    'The test does not validate any real textbook, rights record or production index.',
    'A high retrieval score is not a pedagogical or linguistic quality approval.'
  ],
  rows
};

// CI sets this variable; local runs do not leave generated files in the repository.
if (process.env.RAG_EVAL_REPORT_PATH) {
  fs.writeFileSync(
    process.env.RAG_EVAL_REPORT_PATH,
    JSON.stringify(summary, null, 2) + '\n',
    'utf8'
  );
}
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
assert.deepEqual(failures, [], 'benchmark contract failures are recorded in the JSON report');
