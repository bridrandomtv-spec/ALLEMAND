import { createHash } from "node:crypto";

const ROLES = new Set(["operateur", "approbateur"]);
const OPERATOR_EVENTS = new Set(["revue_operateur", "mise_en_quarantaine_operateur"]);
const APPROVER_DECISIONS = new Set(["accepte", "rejete", "quarantaine", "correction_demandee", "reouvert"]);

function clean(value) { return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim(); }
function required(value, label) {
  const v = clean(value);
  if (!v) throw new Error(label + " obligatoire.");
  return v;
}
function canonical(value) { return JSON.stringify(value); }
function digest(value) { return createHash("sha256").update(canonical(value), "utf8").digest("hex"); }

export function createDecisionLedger({ caseId, createdAt, sourceReference }) {
  const id = required(caseId, "Identifiant du dossier");
  const timestamp = required(createdAt, "Horodatage initial");
  const source = clean(sourceReference);
  const genesis = { version: 1, caseId: id, createdAt: timestamp, sourceReference: source };
  return { ...genesis, events: [], headHash: digest(genesis) };
}

export function appendDecisionEvent(ledger, input) {
  if (!ledger || !Array.isArray(ledger.events) || !verifyDecisionLedger(ledger).valid) {
    throw new Error("Journal invalide ou chaîne d'intégrité rompue.");
  }
  const actorId = required(input?.actorId, "Identifiant acteur");
  const role = required(input?.role, "Rôle");
  const eventType = required(input?.type, "Type d'événement");
  const at = required(input?.at, "Horodatage");
  const reason = required(input?.reason, "Justification");
  if (!ROLES.has(role)) throw new Error("Rôle non autorisé.");
  if (ledger.events.some(e => e.actorId === actorId && e.role === "approbateur") && role === "operateur") {
    throw new Error("Un approbateur ne peut pas reprendre le dossier comme opérateur.");
  }
  const operatorEvent = ledger.events.find(e => OPERATOR_EVENTS.has(e.type));
  if (role === "operateur") {
    if (!OPERATOR_EVENTS.has(eventType)) throw new Error("Événement interdit à l'opérateur.");
    if (ledger.events.some(e => OPERATOR_EVENTS.has(e.type))) throw new Error("La revue opérateur existe déjà ; utiliser une demande de correction.");
  } else {
    if (!APPROVER_DECISIONS.has(eventType)) throw new Error("Décision d'approbateur inconnue.");
    if (!operatorEvent) throw new Error("La revue opérateur doit précéder la décision.");
    if (operatorEvent.actorId === actorId) throw new Error("Séparation des tâches : deux acteurs distincts sont requis.");
    if (ledger.events.some(e => e.role === "approbateur" && ["accepte", "rejete", "quarantaine"].includes(e.type))) {
      if (eventType !== "reouvert") throw new Error("Dossier déjà décidé ; une réouverture explicite est requise.");
    }
    if (eventType === "accepte" && !clean(input.evidenceReference)) {
      throw new Error("Une référence de preuve/acte est obligatoire pour accepter.");
    }
    if (eventType === "reouvert" && !clean(input.evidenceReference)) {
      throw new Error("La référence justifiant la réouverture est obligatoire.");
    }
  }
  const payload = {
    sequence: ledger.events.length + 1,
    type: eventType,
    actorId,
    role,
    at,
    reason,
    evidenceReference: clean(input.evidenceReference),
    previousHash: ledger.headHash
  };
  const event = { ...payload, hash: digest(payload) };
  ledger.events.push(event);
  ledger.headHash = event.hash;
  return event;
}

export function verifyDecisionLedger(ledger) {
  if (!ledger || !Array.isArray(ledger.events)) return { valid: false, checked: 0, error: "Journal invalide." };
  const genesis = {
    version: ledger.version,
    caseId: ledger.caseId,
    createdAt: ledger.createdAt,
    sourceReference: ledger.sourceReference
  };
  let previous = digest(genesis);
  for (let i = 0; i < ledger.events.length; i++) {
    const event = ledger.events[i];
    const { hash, ...payload } = event;
    if (payload.sequence !== i + 1 || payload.previousHash !== previous || digest(payload) !== hash) {
      return { valid: false, checked: i, error: "Chaîne d'intégrité invalide à l'événement " + (i + 1) + "." };
    }
    previous = hash;
  }
  if (ledger.headHash !== previous) return { valid: false, checked: ledger.events.length, error: "Empreinte de tête incohérente." };
  return { valid: true, checked: ledger.events.length, headHash: previous };
}

export function decisionLedgerJson(ledger) {
  if (!verifyDecisionLedger(ledger).valid) throw new Error("Export refusé : journal invalide.");
  return JSON.stringify(ledger, null, 2);
}
