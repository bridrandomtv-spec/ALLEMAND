import { createHash } from "node:crypto";

const ROLES = new Set(["operateur", "approbateur"]);
const OPERATOR_EVENTS = new Set(["revue_operateur", "mise_en_quarantaine_operateur"]);
const APPROVER_EVENTS = new Set(["accepte", "rejete", "quarantaine", "correction_demandee", "reouvert"]);
const FINAL_DECISIONS = new Set(["accepte", "rejete", "quarantaine"]);
const REOPENING_EVENTS = new Set(["correction_demandee", "reouvert"]);

function clean(value) { return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim(); }
function required(value, label) {
  const v = clean(value);
  if (!v) throw new Error(label + " obligatoire.");
  return v;
}
function canonical(value) { return JSON.stringify(value); }
function digest(value) { return createHash("sha256").update(canonical(value), "utf8").digest("hex"); }
function utcMillis(value) {
  if (typeof value !== "string") return null;
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) return null;
  return new Date(millis).toISOString() === value ? millis : null;
}

function validateDecisionSequence(events, createdAt) {
  let previousTimestamp = utcMillis(createdAt);
  if (previousTimestamp === null) return { valid: false, error: "Horodatage initial ISO-8601 UTC invalide." };
  let lastOperator = null;
  let lastApprover = null;
  const approverActors = new Set();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const n = i + 1;
    if (!event || typeof event !== "object") return { valid: false, error: "Événement invalide à la position " + n + "." };
    for (const [key, label] of [["actorId", "Identifiant acteur"], ["at", "Horodatage"], ["reason", "Justification"]]) {
      if (typeof event[key] !== "string" || !event[key].trim()) return { valid: false, error: label + " manquant à l'événement " + n + "." };
    }
    const eventTimestamp = utcMillis(event.at);
    if (eventTimestamp === null || eventTimestamp <= previousTimestamp) return { valid: false, error: "Horodatage ISO-8601 invalide ou non croissant au numéro " + n + "." };
    previousTimestamp = eventTimestamp;
    if (!ROLES.has(event.role)) return { valid: false, error: "Rôle non autorisé à l'événement " + n + "." };

    if (event.role === "operateur") {
      if (!OPERATOR_EVENTS.has(event.type)) return { valid: false, error: "Événement interdit à l'opérateur (" + n + ")." };
      if (approverActors.has(event.actorId)) return { valid: false, error: "Un approbateur ne peut pas reprendre le dossier comme opérateur." };
      if (lastOperator && (!lastApprover || !REOPENING_EVENTS.has(lastApprover.type) || lastApprover.sequence < lastOperator.sequence)) {
        return { valid: false, error: "Nouvelle revue opérateur sans correction ou réouverture préalable (" + n + ")." };
      }
      lastOperator = event;
      continue;
    }

    if (!APPROVER_EVENTS.has(event.type)) return { valid: false, error: "Décision d'approbateur inconnue (" + n + ")." };
    if (!lastOperator) return { valid: false, error: "Décision sans revue opérateur préalable (" + n + ")." };
    if (lastApprover && lastApprover.sequence > lastOperator.sequence && event.type !== "reouvert") {
      return { valid: false, error: "Décision approbateur répétée sans nouvelle revue opérateur (" + n + ")." };
    }
    if (lastOperator.actorId === event.actorId) return { valid: false, error: "Séparation des tâches : deux acteurs distincts sont requis (" + n + ")." };
    const finalDecisionExists = Boolean(lastApprover && FINAL_DECISIONS.has(lastApprover.type));
    if (finalDecisionExists && event.type !== "reouvert") return { valid: false, error: "Dossier déjà décidé ; une réouverture explicite est requise (" + n + ")." };
    if (event.type === "reouvert" && !finalDecisionExists) return { valid: false, error: "Aucune décision finale à réouvrir (" + n + ")." };
    if ((event.type === "accepte" || event.type === "reouvert") && (typeof event.evidenceReference !== "string" || !event.evidenceReference.trim())) {
      return { valid: false, error: event.type === "accepte" ? "Référence de preuve/acte obligatoire (" + n + ")." : "Référence de réouverture obligatoire (" + n + ")." };
    }
    lastApprover = event;
    approverActors.add(event.actorId);
  }
  return { valid: true };
}

export function createDecisionLedger({ caseId, createdAt, sourceReference }) {
  const id = required(caseId, "Identifiant du dossier");
  const timestamp = required(createdAt, "Horodatage initial");
  if (utcMillis(timestamp) === null) throw new Error("Horodatage initial ISO-8601 UTC invalide.");
  const source = clean(sourceReference);
  const genesis = { version: 1, caseId: id, createdAt: timestamp, sourceReference: source };
  return { ...genesis, events: [], headHash: digest(genesis) };
}

export function appendDecisionEvent(ledger, input) {
  if (!ledger || !Array.isArray(ledger.events) || !verifyDecisionLedger(ledger).valid) {
    throw new Error("Journal invalide ou chaîne d'intégrité rompue.");
  }
  const payload = {
    sequence: ledger.events.length + 1,
    type: required(input?.type, "Type d'événement"),
    actorId: required(input?.actorId, "Identifiant acteur"),
    role: required(input?.role, "Rôle"),
    at: required(input?.at, "Horodatage"),
    reason: required(input?.reason, "Justification"),
    evidenceReference: clean(input?.evidenceReference),
    previousHash: ledger.headHash
  };
  const candidate = [...ledger.events, payload];
  const sequence = validateDecisionSequence(candidate, ledger.createdAt);
  if (!sequence.valid) throw new Error(sequence.error);
  const event = { ...payload, hash: digest(payload) };
  ledger.events.push(event);
  ledger.headHash = event.hash;
  return event;
}

export function verifyDecisionLedger(ledger) {
  if (!ledger || ledger.version !== 1 || typeof ledger.caseId !== "string" || !ledger.caseId.trim() ||
      typeof ledger.createdAt !== "string" || !ledger.createdAt.trim() ||
      typeof ledger.sourceReference !== "string" || !Array.isArray(ledger.events)) {
    return { valid: false, checked: 0, error: "En-tête ou structure du journal invalide." };
  }
  const genesis = {
    version: ledger.version,
    caseId: ledger.caseId,
    createdAt: ledger.createdAt,
    sourceReference: ledger.sourceReference
  };
  let previous = digest(genesis);
  for (let i = 0; i < ledger.events.length; i++) {
    const event = ledger.events[i];
    if (!event || typeof event !== "object") return { valid: false, checked: i, error: "Événement invalide à la position " + (i + 1) + "." };
    const { hash, ...payload } = event;
    if (payload.sequence !== i + 1 || payload.previousHash !== previous || digest(payload) !== hash) {
      return { valid: false, checked: i, error: "Chaîne d'intégrité invalide à l'événement " + (i + 1) + "." };
    }
    previous = hash;
  }
  if (ledger.headHash !== previous) return { valid: false, checked: ledger.events.length, error: "Empreinte de tête incohérente." };
  const sequence = validateDecisionSequence(ledger.events, ledger.createdAt);
  if (!sequence.valid) return { valid: false, checked: ledger.events.length, error: sequence.error };
  return { valid: true, checked: ledger.events.length, headHash: previous };
}

export function decisionLedgerJson(ledger) {
  if (!verifyDecisionLedger(ledger).valid) throw new Error("Export refusé : journal invalide.");
  return JSON.stringify(ledger, null, 2);
}
