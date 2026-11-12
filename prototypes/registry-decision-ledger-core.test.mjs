import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createDecisionLedger, appendDecisionEvent, verifyDecisionLedger, decisionLedgerJson } from "./registry-decision-ledger-core.mjs";

function reviewed() {
  const ledger = createDecisionLedger({ caseId: "SYN-CASE-01", createdAt: "2026-11-12T10:00:00Z", sourceReference: "SYNTHETIC-SOURCE" });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-1", role: "operateur", at: "2026-11-12T10:05:00Z", reason: "Contrôle fictif effectué." });
  return ledger;
}
function forgedLedger(events) {
  const ledger = createDecisionLedger({ caseId: "SYN-FORGED-01", createdAt: "2026-11-12T10:00:00Z", sourceReference: "SYNTHETIC-SOURCE" });
  let previousHash = ledger.headHash;
  ledger.events = events.map((input, index) => {
    const payload = { sequence: index + 1, evidenceReference: "", ...input, previousHash };
    const hash = createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");
    previousHash = hash;
    return { ...payload, hash };
  });
  ledger.headHash = previousHash;
  return ledger;
}

test("creates a verifiable append-only hash chain", () => {
  const ledger = reviewed();
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "2026-11-12T10:10:00Z", reason: "Décision de démonstration.", evidenceReference: "SYN-ACT-02" });
  assert.equal(verifyDecisionLedger(ledger).valid, true);
  assert.equal(verifyDecisionLedger(ledger).checked, 2);
  assert.match(decisionLedgerJson(ledger), /SYN-CASE-01/);
});

test("requires an operator review and distinct approver", () => {
  const ledger = createDecisionLedger({ caseId: "SYN-2", createdAt: "t0", sourceReference: "" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "A", role: "approbateur", at: "t1", reason: "ok", evidenceReference: "ACT" }), /sans revue opérateur/);
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "A", role: "operateur", at: "t1", reason: "revue" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "A", role: "approbateur", at: "t2", reason: "ok", evidenceReference: "ACT" }), /distincts/);
});

test("requires justification and documentary reference for acceptance", () => {
  const ledger = reviewed();
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "", evidenceReference: "ACT" }), /Justification obligatoire/);
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "Décision", evidenceReference: "" }), /Référence de preuve/);
});

test("rejects tampering and refuses export of a modified ledger", () => {
  const ledger = reviewed();
  ledger.events[0].reason = "altéré";
  assert.equal(verifyDecisionLedger(ledger).valid, false);
  assert.throws(() => decisionLedgerJson(ledger), /journal invalide/);
});

test("rejects unknown roles and illegal operator decisions", () => {
  const ledger = createDecisionLedger({ caseId: "SYN-3", createdAt: "t0", sourceReference: "" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "X", role: "admin", at: "t1", reason: "x" }), /Rôle non autorisé/);
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "X", role: "operateur", at: "t1", reason: "x" }), /interdit à l'opérateur/);
});

test("allows a documented correction cycle and requires a final decision before reopening", () => {
  const ledger = reviewed();
  assert.throws(() => appendDecisionEvent(ledger, { type: "reouvert", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "Réouverture", evidenceReference: "SYN-REF" }), /Aucune décision finale/);
  appendDecisionEvent(ledger, { type: "correction_demandee", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "Compléter la référence." });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-3", role: "operateur", at: "t3", reason: "Correction effectuée." });
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-4", role: "approbateur", at: "t4", reason: "Dossier corrigé.", evidenceReference: "SYN-ACT-04" });
  assert.equal(verifyDecisionLedger(ledger).valid, true);
});

test("requires a reasoned reopening before a second final decision", () => {
  const ledger = reviewed();
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "Accepté.", evidenceReference: "SYN-ACT-1" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-3", role: "operateur", at: "t3", reason: "Nouvelle revue." }), /sans correction ou réouverture/);
  appendDecisionEvent(ledger, { type: "reouvert", actorId: "SYN-AP-4", role: "approbateur", at: "t3", reason: "Réexamen demandé.", evidenceReference: "SYN-DECISION-REOUVERTURE" });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-3", role: "operateur", at: "t4", reason: "Nouvelle pièce examinée." });
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-5", role: "approbateur", at: "t5", reason: "Réexamen terminé.", evidenceReference: "SYN-ACT-2" });
  assert.equal(verifyDecisionLedger(ledger).valid, true);
});

test("rejects a hash-valid chain with impossible decision transitions", () => {
  const forged = forgedLedger([
    { type: "revue_operateur", actorId: "SYN-OP-1", role: "operateur", at: "t1", reason: "Revue." },
    { type: "revue_operateur", actorId: "SYN-OP-2", role: "operateur", at: "t2", reason: "Deuxième revue sans correction." }
  ]);
  assert.equal(verifyDecisionLedger(forged).valid, false);
  assert.throws(() => decisionLedgerJson(forged), /journal invalide/);
});

test("rejects a hash-valid approval without prior operator review", () => {
  const forged = forgedLedger([
    { type: "accepte", actorId: "SYN-AP-1", role: "approbateur", at: "t1", reason: "Accepté.", evidenceReference: "SYN-ACT-1" }
  ]);
  assert.equal(verifyDecisionLedger(forged).valid, false);
});
