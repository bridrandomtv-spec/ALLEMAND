import assert from 'node:assert/strict';
import fs from 'node:fs';

const rubric = JSON.parse(fs.readFileSync(
  new URL('./fixtures/rag-eval/review-rubric-v1.json', import.meta.url), 'utf8'
));
assert.equal(rubric.schema, 'rag-human-review-rubric-v1');
assert.equal(rubric.status, 'human_review_required');
assert.ok(rubric.dimensions.length >= 8);
assert.equal(new Set(rubric.dimensions.map(item => item.id)).size, rubric.dimensions.length);
for (const item of rubric.dimensions) {
  assert.ok(item.id && item.label);
  assert.equal(typeof item.critical, 'boolean');
}
assert.ok(rubric.dimensions.some(item => item.id === 'factual_grounding' && item.critical));
assert.ok(rubric.dimensions.some(item => item.id === 'abstention_quality' && item.critical));
assert.ok(rubric.languageCoverage.includes('arabizi'));
assert.ok(rubric.languageCoverage.includes('en-partial'));
assert.ok(rubric.rules.some(rule => rule.includes('automated retrieval metrics')));
process.stdout.write('RAG human-review rubric contract: OK\n');
