import assert from 'node:assert/strict';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync(
  new URL('./fixtures/rag-eval/questions-v1.json', import.meta.url), 'utf8'
));

export function scorePredictions(cases, predictions, k = 3) {
  const byId = new Map(predictions.map(item => [item.caseId, item]));
  let retrievalEligible = 0, hitAt1 = 0, hitAtK = 0;
  let abstentionCorrect = 0, languageCorrect = 0, reviewed = 0, grounded = 0;
  for (const item of cases) {
    const prediction = byId.get(item.id);
    if (!prediction) continue;
    if (item.abstain) {
      if (prediction.abstained === true) abstentionCorrect++;
    } else {
      retrievalEligible++;
      const ranked = Array.isArray(prediction.rankedDocumentIds) ? prediction.rankedDocumentIds : [];
      if (ranked[0] === item.expectedDocumentId) hitAt1++;
      if (ranked.slice(0, k).includes(item.expectedDocumentId)) hitAtK++;
    }
    if (prediction.answerLanguage === item.answerLanguage) languageCorrect++;
    if (typeof prediction.humanGrounded === 'boolean') {
      reviewed++;
      if (prediction.humanGrounded) grounded++;
    }
  }
  const total = predictions.length;
  return {
    evaluated: total,
    retrievalEligible,
    hitAt1: retrievalEligible ? hitAt1 / retrievalEligible : null,
    hitAtK: retrievalEligible ? hitAtK / retrievalEligible : null,
    abstentionAccuracy: cases.filter(item => item.abstain).length
      ? abstentionCorrect / cases.filter(item => item.abstain).length : null,
    answerLanguageAccuracy: total ? languageCorrect / total : null,
    humanGroundingRate: reviewed ? grounded / reviewed : null,
    humanReviewed: reviewed
  };
}

assert.equal(fixture.schema, 'rag-evaluation-set-v1');
assert.equal(fixture.datasetStatus, 'synthetic_test_only');
assert.equal(fixture.authority, 'non_official');
assert.equal(fixture.scoringPolicy.humanReviewRequired, true);
assert.ok(fixture.documents.length >= 1);
assert.ok(fixture.cases.length >= 1);

const documents = new Map();
for (const doc of fixture.documents) {
  assert.ok(doc.id && !documents.has(doc.id), 'document ids must be unique');
  documents.set(doc.id, doc);
  assert.equal(doc.status, 'synthetic_test_only');
  assert.ok(doc.passage.length > 20);
  assert.ok(doc.title && doc.subject && doc.level && doc.language);
}

const caseIds = new Set();
for (const item of fixture.cases) {
  assert.ok(item.id && !caseIds.has(item.id), 'case ids must be unique');
  caseIds.add(item.id);
  assert.ok(item.query.trim().length >= 8);
  assert.ok(item.queryLanguage && item.answerLanguage && item.level);
  assert.ok(['implemented', 'partial', 'planned'].includes(item.capabilityStatus));
  if (item.abstain) {
    assert.equal(item.expectedDocumentId, null);
    assert.equal(item.expectedConcepts.length, 0);
    assert.ok(item.expectedBehavior, 'abstention cases need an explicit expected behavior');
  } else {
    assert.ok(documents.has(item.expectedDocumentId), 'supported case must point to a fixture document');
    assert.ok(item.expectedConcepts.length >= 1);
  }
  if (item.capabilityStatus === 'planned') assert.equal(item.abstain, true);
  if (item.capabilityStatus === 'partial') assert.equal(item.abstain, false);
}

const metricCases = [
  { id: 'a', expectedDocumentId: 'doc-1', abstain: false, answerLanguage: 'fr' },
  { id: 'b', expectedDocumentId: null, abstain: true, answerLanguage: 'it' }
];
const metrics = scorePredictions(metricCases, [
  { caseId: 'a', rankedDocumentIds: ['doc-2', 'doc-1'], answerLanguage: 'fr', humanGrounded: true },
  { caseId: 'b', rankedDocumentIds: [], abstained: true, answerLanguage: 'it', humanGrounded: false }
], 2);
assert.equal(metrics.hitAt1, 0);
assert.equal(metrics.hitAtK, 1);
assert.equal(metrics.abstentionAccuracy, 1);
assert.equal(metrics.answerLanguageAccuracy, 1);
assert.equal(metrics.humanGroundingRate, 0.5);
assert.equal(metrics.humanReviewed, 2);

process.stdout.write(`RAG evaluation fixture contract: passed (${fixture.cases.length} cases, ${fixture.documents.length} synthetic passages).\\n`);
