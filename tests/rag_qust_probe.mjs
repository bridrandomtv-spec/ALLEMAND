/* rag_qust_probe.mjs — sonde d'intégration QUST -> RAG, diagnostic non-gating.
   Exécution depuis la racine : node tests/rag_qust_probe.mjs
   Aucun réseau n'est autorisé. Les fichiers locaux absents répondent 404.
   Cette sonde observe les arguments reçus par QUST; elle ne note pas la qualité pédagogique.
*/
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fetchLog = [];
const qlog = [];
const store = Object.create(null);

const sandbox = {
  console,
  navigator: { onLine: true, language: 'ar' },
  localStorage: {
    getItem: k => Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  },
  document: {
    addEventListener(){},
    dispatchEvent(){ return true; },
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    getElementById(){ return null; },
    createElement(){ return { style:{}, appendChild(){}, addEventListener(){}, setAttribute(){} }; },
    body: { appendChild(){} }
  },
  CustomEvent: class { constructor(type, options){ this.type = type; this.detail = options?.detail; } },
  Event: class { constructor(type, options){ this.type = type; this.cancelable = !!options?.cancelable; } },
  speechSynthesis: { speak(){}, cancel(){}, getVoices(){ return []; } },
  setTimeout,
  clearTimeout,
  fetch: async input => {
    const raw = String(input);
    if (/^https?:\/\//i.test(raw)) {
      fetchLog.push({ url: raw, result: 'BLOCKED_NETWORK' });
      throw new Error('Network disabled by rag_qust_probe');
    }
    const rel = raw.replace(/^\/+/, '').split('?')[0];
    const full = path.resolve(root, rel);
    if (full !== root && !full.startsWith(root + path.sep)) {
      fetchLog.push({ url: raw, result: 'BLOCKED_PATH' });
      throw new Error('Path outside repository blocked by rag_qust_probe');
    }
    try {
      const body = fs.readFileSync(full, 'utf8');
      fetchLog.push({ url: raw, result: 'LOCAL_FILE' });
      return {
        ok: true, status: 200,
        json: async () => JSON.parse(body),
        text: async () => body
      };
    } catch {
      fetchLog.push({ url: raw, result: 'NOT_FOUND' });
      return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
    }
  }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.SUBJECT = { active: () => ({ id: 'allemand' }) };
sandbox.CONTEXT = {
  ctx: () => ({ subject: 'allemand', level: '3AS', track: 'test-track' })
};

const context = vm.createContext(sandbox, { name: 'rag-qust-isolated' });
vm.runInContext(read('js/qust.js'), context, { filename: 'js/qust.js', timeout: 1000 });
const originalUnderstand = context.QUST?.understand;
if (typeof originalUnderstand !== 'function') {
  throw new Error('QUST.understand absent après chargement de js/qust.js');
}
context.QUST.understand = function(question, ctx) {
  const result = originalUnderstand(question, ctx);
  qlog.push({
    received_text: String(question ?? ''),
    context: ctx ?? null,
    result: {
      norm: result.norm,
      langs: result.langs,
      intent: result.intent,
      entities: result.entities,
      confidence: result.confidence
    }
  });
  return result;
};

vm.runInContext(read('rag.js'), context, { filename: 'rag.js', timeout: 3000 });
if (typeof context.reponsePedagogique !== 'function') {
  throw new Error('reponsePedagogique absent après chargement de rag.js');
}

const inputs = [
  'واش الفرق بين Dativ و Akkusativ؟',
  'كيفاش نستعمل weil؟',
  'علاش le verbe yji f lekher m3a weil؟',
  'ما فهمتش Konjunktiv II، شرحلي ببساطة',
  'عطيني تمرين على Dativ'
];

const observations = [];
for (const raw of inputs) {
  const before = qlog.length;
  let outcome = 'returned';
  let error = null;
  try {
    await context.reponsePedagogique(raw);
  } catch (e) {
    outcome = 'threw';
    error = String(e?.message || e);
  }
  const calls = qlog.slice(before);
  observations.push({
    raw_input: raw,
    outcome,
    error,
    qust_calls: calls,
    raw_preserved_at_qust: calls.some(c => c.received_text === raw),
    transformed_before_qust: calls.length > 0 && calls.every(c => c.received_text !== raw)
  });
}

console.log('=== SONDE QUST / RAG — DIAGNOSTIC, PAS UN TEST DE QUALITÉ ===');
for (const item of observations) {
  console.log('\nQUESTION BRUTE : ' + item.raw_input);
  console.log('Résultat RAG : ' + item.outcome + (item.error ? ' — ' + item.error : ''));
  if (!item.qust_calls.length) {
    console.log('QUST : aucun appel observé');
    continue;
  }
  for (const call of item.qust_calls) {
    console.log('Texte reçu par QUST : ' + call.received_text);
    console.log('Langues : ' + JSON.stringify(call.result.langs));
    console.log('Intention : ' + String(call.result.intent));
    console.log('Contexte : ' + JSON.stringify(call.context));
  }
  console.log('Texte brut conservé : ' + (item.raw_preserved_at_qust ? 'OUI' : 'NON'));
}
const blocked = fetchLog.filter(x => x.result.startsWith('BLOCKED'));
console.log('\nFichiers locaux consultés : ' + fetchLog.filter(x => x.result === 'LOCAL_FILE').length);
console.log('Ressources locales absentes : ' + fetchLog.filter(x => x.result === 'NOT_FOUND').length);
console.log('Tentatives réseau bloquées : ' + blocked.length);
if (blocked.length) {
  for (const item of blocked) console.log('RÉSEAU BLOQUÉ : ' + item.url);
}
console.log('\nNOTE : un retour RAG non vide ne constitue pas une validation de réponse. Les différences de texte sont des observations, pas un score.');
