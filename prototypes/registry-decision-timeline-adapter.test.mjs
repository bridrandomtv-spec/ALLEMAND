import test from "node:test";
import assert from "node:assert/strict";
import { createDecisionLedger, appendDecisionEvent } from "./registry-decision-ledger-core.mjs";
import { ledgerToTimeline } from "./registry-decision-timeline-adapter.mjs";

function makeLedger() {
  const ledger = createDecisionLedger({ caseId: "SYN-ADAPTER-01", createdAt: "2026-11-12T08:00:00Z", sourceReference: "SYN-SOURCE" });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "SYN-OP-1", role: "operateur", at: "2026-11-12T08:10:00Z", reason: "Revue fictive." });
  appendDecisionEvent(ledger, { type: "accepte", actorId: "SYN-AP-2", role: "approbateur", at: "2026-11-12T08:20:00Z", reason: "Décision fictive.", evidenceReference: "SYN-ACT-2" });
  return ledger;
}

test("converts a valid Lot 317 ledger into a timeline view", () => {
  const view = ledgerToTimeline(makeLedger());
  assert.equal(view.integrity, "sha256-chain-verified");
  assert.equal(view.checkedEvents, 2);
  assert.equal(view.events[0].label, "مراجعة الموظف");
  assert.equal(view.events[1].label, "قبول");
  assert.equal(view.events[1].evidenceReference, "SYN-ACT-2");
});

test("rejects a ledger whose event chain was altered", () => {
  const ledger = makeLedger();
  ledger.events[0].reason = "Contenu modifié.";
  assert.throws(() => ledgerToTimeline(ledger), /Journal invalide/);
});

test("rejects unknown event-role combinations even with a valid hash chain", () => {
  const ledger = createDecisionLedger({ caseId: "SYN-ADAPTER-02", createdAt: "t0" });
  appendDecisionEvent(ledger, { type: "revue_operateur", actorId: "OP", role: "operateur", at: "t1", reason: "Revue." });
  const { createHash } = await import("node:crypto");
  const payload = { sequence: 2, type: "accepte", actorId: "AP", role: "superadmin", at: "t2", reason: "Test de rôle.", evidenceReference: "", previousHash: ledger.headHash };
  const hash = createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");
  ledger.events.push({ ...payload, hash });
  ledger.headHash = hash;
  assert.throws(() => ledgerToTimeline(ledger), /Type ou rôle non reconnu/);
});
