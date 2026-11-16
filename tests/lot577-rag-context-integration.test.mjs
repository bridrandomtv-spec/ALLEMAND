import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ragSource = fs.readFileSync(new URL('../rag.js', import.meta.url), 'utf8');
const contextSource = fs.readFileSync(new URL('../js/teacher-context.js', import.meta.url), 'utf8');
const corpus = { documents: [{
  id: 'authorized-course', titre: 'Lektion Freiheit', matiere: 'allemand',
  niveau: '2AS', type: 'cours', langue: 'de+ar',
  droits_statut: 'verifies', droits_reference: 'autorisation-titulaire-001'
}] };
const files = {
  'assets/bdd/corpus.json': corpus,
  'assets/bdd/shards_manifest.json': { shards: [{ file: 'lot577.json' }] },
  'assets/bdd/shards/lot577.json': {
    termes: { freiheit: [12], schule: [12] },
    chunks: [{ n: 12, doc: 'authorized-course', texte: 'Freiheit und Schule sind wichtige Themen.' }]
  }
};
const document = {
  addEventListener() {},
  querySelector() { return null; },
  getElementById(id) { return id === 'chatVoiceLang' ? { value: 'ar-DZ' } : null; }
};
const window = {
  document,
  CONTEXT: { ctx: () => ({ subject: 'allemand', level: '2AS', track: 'sciences' }) },
  SUBJECT: { get: () => ({ name: 'Allemand', status: 'implemented' }) }
};
const fetch = async url => Object.prototype.hasOwnProperty.call(files, url)
  ? { ok: true, json: async () => files[url] }
  : { ok: false, json: async () => null };
const sandbox = { window, document, fetch, console, setTimeout, clearTimeout, Object, Array, String, Number, JSON, Math, Set };
vm.runInNewContext(ragSource, sandbox, { filename: 'rag.js' });
const found = await window.RAG.cherche('freiheit schule');
assert.equal(found.doc, 'authorized-course');
const provenance = window.RAG.provenance(found);
assert.equal(provenance.title, 'Lektion Freiheit');
assert.equal(provenance.chunkId, 12);
assert.equal(provenance.trust, 'client_unverified');
vm.runInNewContext(contextSource, { window, globalThis: window, Object, Array, String, Number, JSON });
const envelope = JSON.parse(window.TEACHER_CONTEXT.build('Erkläre Freiheit', [provenance]));
assert.equal(envelope.subject.id, 'allemand');
assert.equal(envelope.level, '2AS');
assert.equal(envelope.retrievedSources.length, 1);
assert.equal(envelope.retrievedSources[0].documentId, 'authorized-course');
assert.equal(envelope.retrievedSources[0].excerpt, 'Freiheit und Schule sind wichtige Themen.');
assert.equal(envelope.retrievedSources[0].trust, 'client_unverified');
process.stdout.write('Lot 577 RAG-to-teacher integration contract: passed.\\n');
