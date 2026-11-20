import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const corpus = fs.readFileSync(new URL('../corpus.js', import.meta.url), 'utf8');

test('les PDF historiques ne sont plus exposés par GitHub Raw', () => {
  assert.match(corpus, /function urlDoc\(u\)/);
  assert.match(corpus, /docs\/archive/);
  assert.match(corpus, /dzexams-/);
  assert.match(corpus, /return '#';/);
  assert.doesNotMatch(corpus, /raw\.githubusercontent\.com\/bridrandomtv-spec\/ALLEMAND\/main/);
});

test('les deux rendus du catalogue signalent la suspension des PDF', () => {
  const warning = 'PDF suspendu — accès protégé en préparation';
  assert.equal(corpus.split(warning).length - 1, 2);
  assert.match(corpus, /ouvreUrl\(d\) === '#'/);
});
