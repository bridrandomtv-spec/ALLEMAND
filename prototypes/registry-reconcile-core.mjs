const KEY = "identifiant_national";
const FIELDS = [
  "source_id", "identifiant_national", "nom_ar", "nom_fr",
  "wilaya_code", "commune_code", "statut", "date_effet",
  "reference_acte", "source", "annee_scolaire"
];

function indexRows(rows, label) {
  if (!Array.isArray(rows)) throw new TypeError(label + " doit être un tableau.");
  const index = new Map();
  for (const [i, row] of rows.entries()) {
    const key = String(row?.[KEY] ?? "").trim();
    if (!key) throw new Error(label + " : identifiant_national absent à la ligne " + (i + 1) + ".");
    if (/^SYN-/i.test(key)) throw new Error(label + " : identifiant synthétique interdit au rapprochement.");
    if (index.has(key)) throw new Error(label + " : identifiant_national en doublon : " + key + ".");
    index.set(key, row);
  }
  return index;
}

export function reconcileRegistry(previousRows, incomingRows) {
  const previous = indexRows(previousRows, "Version précédente");
  const incoming = indexRows(incomingRows, "Nouvelle version");
  const added = [], changed = [], unchanged = [], absent = [];
  for (const [key, next] of incoming) {
    const before = previous.get(key);
    if (!before) {
      added.push({ key, before: null, after: next, changedFields: [] });
      continue;
    }
    const changedFields = FIELDS.filter(field =>
      String(before[field] ?? "").trim() !== String(next[field] ?? "").trim()
    );
    const item = { key, before, after: next, changedFields };
    (changedFields.length ? changed : unchanged).push(item);
  }
  for (const [key, before] of previous) {
    if (!incoming.has(key)) {
      absent.push({
        key,
        before,
        after: null,
        reviewRequired: true,
        warning: "Absent de la nouvelle version : ne signifie ni fermeture ni suppression."
      });
    }
  }
  const byKey = (a, b) => a.key.localeCompare(b.key, "en");
  added.sort(byKey); changed.sort(byKey); unchanged.sort(byKey); absent.sort(byKey);
  return {
    summary: {
      previousCount: previous.size,
      incomingCount: incoming.size,
      added: added.length,
      changed: changed.length,
      unchanged: unchanged.length,
      absentForReview: absent.length
    },
    added, changed, unchanged, absent
  };
}

export function toReconciliationCsv(result) {
  const rows = [["categorie", "identifiant_national", "champs_modifies", "decision", "commentaire"]];
  for (const item of result.added) rows.push(["nouveau", item.key, "", "a_revoir", "Nouvel identifiant à vérifier"]);
  for (const item of result.changed) rows.push(["modifie", item.key, item.changedFields.join(";"), "a_revoir", "Comparer la source et la référence juridique"]);
  for (const item of result.unchanged) rows.push(["inchange", item.key, "", "a_revoir", "Confirmer la présence dans le lot"]);
  for (const item of result.absent) rows.push(["absent_a_examiner", item.key, "", "quarantaine", item.warning]);
  return rows.map(row => row.map(value => {
    let cell = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
}
