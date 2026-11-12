import test from "node:test";
import assert from "node:assert/strict";
import { createDecisionLedger, appendDecisionEvent, verifyDecisionLedger, decisionLedgerJson } from "./registry-decision-ledger-core.mjs";

function reviewed() {
  const ledger = createDecisionLedger({ caseId: "SYN-CASE-01", createdAt: "2026-11-12T10:00:00Z", sourceReference: "SYNTHETIC-SOURCE" });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-1", role: "operateur", at: "2026-11-12T10:05:00Z", reason: "Contrôle fictif effectué." });
  return ledger;
}

test("creates a verifiable append-only hash chain", () => {
  const ledger = reviewed();
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "2026-11-12T10:10:00Z", reason: "Décision de démonstration.", evidenceReference: "SYN-ACT-02" });
  assert.deepEqual(verifyDecisionLedger(ledger).valid, true);
  assert.equal(verifyDecisionLedger(ledger).checked, 2);
  assert.match(decisionLedgerJson(ledger), /SYN-CASE-01/);
});

test("requires an operator review and distinct approver", () => {
  const ledger = createDecisionLedger({ caseId: "SYN-2", createdAt: "t0" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "A", role: "approbateur", at: "t1", reason: "ok", evidenceReference: "ACT" }), /doit précéder/);
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "A", role: "operateur", at: "t1", reason: "revue" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "A", role: "approbateur", at: "t2", reason: "ok", evidenceReference: "ACT" }), /distincts/);
});

test("requires justification and documentary reference for acceptance", () => {
  const ledger = reviewed();
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "", evidenceReference: "ACT" }), /Justification obligatoire/);
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "t2", reason: "Décision", evidenceReference: "" }), /référence de preuve/);
});

test("rejects tampering and refuses export of a modified ledger", () => {
  const ledger = reviewed();
  ledger.events[0].reason = "altéré";
  assert.equal(verifyDecisionLedger(ledger).valid, false);
  assert.throws(() => decisionLedgerJson(ledger), /journal invalide/);
});

test("rejects unknown roles and illegal operator decisions", () => {
  const ledger = createDecisionLedger({ caseId: "SYN-3", createdAt: "t0" });
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "X", role: "admin", at: "t1", reason: "x" }), /Rôle non autorisé/);
  assert.throws(() => appendDecisionEvent(ledger, { type: "accepte", actorId: "X", role: "operateur", at: "t1", reason: "x" }), /interdit à l'opérateur/);
});
