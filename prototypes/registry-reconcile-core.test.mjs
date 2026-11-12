import test from "node:test";
import assert from "node:assert/strict";
import { reconcileRegistry, toReconciliationCsv } from "./registry-reconcile-core.mjs";

const row = (id, extra = {}) => ({
  source_id: "SRC-" + id, identifiant_national: id, nom_ar: "اسم " + id,
  nom_fr: "Lycée " + id, wilaya_code: "31", commune_code: "3101",
  statut: "actif", date_effet: "2026-09-01", reference_acte: "ACTE-1",
  source: "SOURCE-TEST", annee_scolaire: "2026-2027", ...extra
});

test("classifies additions, changes, unchanged and absent separately", () => {
  const result = reconcileRegistry(
    [row("A"), row("B"), row("C")],
    [row("A"), row("B", { nom_fr: "Lycée B renommé" }), row("D")]
  );
  assert.deepEqual(result.summary, {
    previousCount: 3, incomingCount: 3, added: 1, changed: 1,
    unchanged: 1, absentForReview: 1
  });
  assert.equal(result.added[0].key, "D");
  assert.deepEqual(result.changed[0].changedFields, ["nom_fr"]);
  assert.equal(result.unchanged[0].key, "A");
  assert.equal(result.absent[0].key, "C");
  assert.equal(result.absent[0].reviewRequired, true);
});

test("rejects duplicate identifiers in either version", () => {
  assert.throws(() => reconcileRegistry([row("A"), row("A")], []), /doublon/);
  assert.throws(() => reconcileRegistry([], [row("B"), row("B")]), /doublon/);
});

test("rejects missing and synthetic identifiers", () => {
  assert.throws(() => reconcileRegistry([{}], []), /absent/);
  assert.throws(() => reconcileRegistry([], [row("SYN-9")]), /synthétique/);
});

test("does not silently infer closure from an absent row", () => {
  const result = reconcileRegistry([row("A")], []);
  assert.match(result.absent[0].warning, /ne signifie ni fermeture ni suppression/);
});

test("exports a review CSV with safe quoting and neutralized formulas", () => {
  const result = reconcileRegistry([], [row("A", { nom_fr: "=FORMULA" })]);
  const csv = toReconciliationCsv(result);
  assert.match(csv, /"nouveau","A"/);
  assert.match(csv, /Nouvel identifiant à vérifier/);
  assert.equal(csv.includes("=FORMULA"), false);
});
