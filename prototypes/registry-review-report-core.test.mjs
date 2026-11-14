import test from "node:test";
import assert from "node:assert/strict";
import { buildRegistryReviewReport, registryReviewCsv, recordReviewDecision } from "./registry-review-report-core.mjs";

const rec = {
  summary: { previousCount: 3, incomingCount: 3, added: 1, changed: 1, unchanged: 1, absentForReview: 1 },
  added: [{ key: "NEW", after: { reference_acte: "ACT-NEW" } }],
  changed: [
    { key: "CHG1", changedFields: ["statut"], before: {}, after: { reference_acte: "ACT-1" } },
    { key: "CHG2", changedFields: ["nom_fr"], before: {}, after: {} }
  ],
  unchanged: [{ key: "SAME", changedFields: [], before: {}, after: {} }],
  absent: [{ key: "MISS", before: {}, warning: "Absent" }]
};

test("builds prioritized review report without making legal decisions", () => {
  const report = buildRegistryReviewReport(rec, { previousBatchId: "B-1", incomingBatchId: "B-2" });
  assert.deepEqual(report.totals, { records: 5, P1: 3, P2: 1, P3: 1, pending: 5 });
  assert.deepEqual(report.records.map(x => x.priority), ["P1", "P1", "P1", "P2", "P3"]);
  assert.ok(report.records.every(x => ["a_revoir", "quarantaine"].includes(x.decision)));
  assert.equal(report.records.find(x => x.nationalId === "MISS").requiredAction, "QUARANTAINE_ET_VERIFICATION_SOURCE");
});

test("keeps operator and approver separate and in sequence", () => {
  const report = buildRegistryReviewReport(rec);
  assert.throws(() => recordReviewDecision(report, "CHG1", "accepte", { id: "A", role: "approbateur" }), /précéder/);
  recordReviewDecision(report, "CHG1", "a_revoir", { id: "OP-1", role: "operateur", comment: "Pièce vérifiée" });
  assert.throws(() => recordReviewDecision(report, "CHG1", "accepte", { id: "OP-1", role: "approbateur" }), /ne peut pas approuver/);
  const approved = recordReviewDecision(report, "CHG1", "accepte", { id: "AP-2", role: "approbateur", comment: "Acte contrôlé" });
  assert.equal(approved.approver, "AP-2");
  assert.equal(approved.operator, "OP-1");
});

test("rejects unknown decisions, roles and missing records", () => {
  const report = buildRegistryReviewReport(rec);
  assert.throws(() => recordReviewDecision(report, "CHG1", "valide", { id: "X", role: "operateur" }), /inconnue/);
  assert.throws(() => recordReviewDecision(report, "CHG1", "rejete", { id: "X", role: "admin" }), /non autorisé/);
  assert.throws(() => recordReviewDecision(report, "UNKNOWN", "rejete", { id: "X", role: "operateur" }), /absent/);
  assert.throws(() => recordReviewDecision(report, "CHG1", "accepte", { id: "OP-2", role: "operateur" }), /ne peut que documenter/);
});

test("exports a spreadsheet-safe CSV with separate reviewer columns", () => {
  const report = buildRegistryReviewReport(rec);
  report.records[0].operatorComment = "=HYPERLINK(\"https://example.invalid\")";
  const csv = registryReviewCsv(report);
  assert.match(csv, /commentaire_operateur/);
  assert.match(csv, /' =HYPERLINK|''=HYPERLINK|"'=HYPERLINK/);
  assert.equal(csv.includes('=HYPERLINK("https://example.invalid")'), false);
});
