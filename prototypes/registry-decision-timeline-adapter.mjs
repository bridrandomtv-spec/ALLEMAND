import { verifyDecisionLedger } from "./registry-decision-ledger-core.mjs";

const LABELS = {
  revue_operateur: "مراجعة الموظف",
  mise_en_quarantaine_operateur: "إحالة إلى الحجر",
  accepte: "قبول",
  rejete: "رفض",
  quarantaine: "حجر",
  correction_demandee: "طلب استكمال",
  reouvert: "إعادة فتح"
};
const OPERATOR_TYPES = new Set(["revue_operateur", "mise_en_quarantaine_operateur"]);
const APPROVER_TYPES = new Set(["accepte", "rejete", "quarantaine", "correction_demandee", "reouvert"]);

function required(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(label + " manquant.");
  return value.trim();
}

export function ledgerToTimeline(ledger) {
  const integrity = verifyDecisionLedger(ledger);
  if (!integrity.valid) throw new Error("Journal invalide : " + integrity.error);
  const caseId = required(ledger.caseId, "Identifiant du dossier");
  const sourceReference = String(ledger.sourceReference ?? "").trim();
  const events = ledger.events.map((event, index) => {
    const validType = event.role === "operateur"
      ? OPERATOR_TYPES.has(event.type)
      : event.role === "approbateur" && APPROVER_TYPES.has(event.type);
    if (!validType) throw new Error("Type ou rôle non reconnu à l'événement " + (index + 1) + ".");
    return {
      caseId,
      sequence: event.sequence,
      type: event.type,
      label: LABELS[event.type],
      role: event.role,
      actorId: required(event.actorId, "Acteur événement " + (index + 1)),
      at: required(event.at, "Horodatage événement " + (index + 1)),
      reason: required(event.reason, "Justification événement " + (index + 1)),
      evidenceReference: String(event.evidenceReference ?? ""),
      hash: event.hash,
      previousHash: event.previousHash
    };
  });
  return {
    caseId,
    createdAt: required(ledger.createdAt, "Date de création"),
    sourceReference,
    integrity: "sha256-chain-verified",
    checkedEvents: integrity.checked,
    events
  };
}
