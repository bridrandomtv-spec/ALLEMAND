export const REQUIRED = [
  "source_id", "identifiant_national", "nom_ar", "nom_fr",
  "wilaya_code", "commune_code", "statut", "date_effet",
  "reference_acte", "source", "annee_scolaire"
];
const STATUSES = new Set(["actif", "suspendu", "ferme", "fusionne"]);
export function parseCsv(input) {
  const text = String(input ?? "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell.length === 0) quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some(v => v.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (quoted) throw new Error("CSV mal formé : guillemet non refermé.");
  row.push(cell);
  if (row.some(v => v.trim() !== "")) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map(v => v.trim());
  if (new Set(headers).size !== headers.length) throw new Error("CSV mal formé : en-têtes en double.");
  const missing = REQUIRED.filter(k => !headers.includes(k));
  const unknown = headers.filter(k => !REQUIRED.includes(k));
  if (missing.length) throw new Error("En-têtes obligatoires absents : " + missing.join(", "));
  if (unknown.length) throw new Error("En-têtes inconnus : " + unknown.join(", "));
  return rows.map((values, index) => {
    if (values.length > headers.length) throw new Error("CSV mal formé : trop de colonnes à la ligne " + (index + 2) + ".");
    const item = { _line: index + 2 };
    headers.forEach((header, i) => { item[header] = String(values[i] ?? "").trim(); });
    return item;
  });
}
export function validateRows(rows) {
  const seenSource = new Map(), seenNational = new Map();
  rows.forEach((r, i) => {
    const n = i + 2;
    if (r.source_id) seenSource.set(r.source_id, [...(seenSource.get(r.source_id) || []), n]);
    if (r.identifiant_national) seenNational.set(r.identifiant_national, [...(seenNational.get(r.identifiant_national) || []), n]);
  });
  return rows.map((r, i) => {
    const errors = [], warnings = [];
    REQUIRED.forEach(k => { if (!String(r[k] || "").trim()) errors.push("Champ obligatoire absent : " + k); });
    if (r.statut && !STATUSES.has(r.statut)) errors.push("Statut inconnu : " + r.statut);
    if (r.date_effet && !/^\d{4}-\d{2}-\d{2}$/.test(r.date_effet)) errors.push("date_effet doit être au format AAAA-MM-JJ.");
    if (r.date_effet && /^\d{4}-\d{2}-\d{2}$/.test(r.date_effet)) {
      const d = new Date(r.date_effet + "T00:00:00Z");
      if (Number.isNaN(d.getTime()) || d.toISOString().slice(0,10) !== r.date_effet) errors.push("date_effet n'est pas une date valide.");
    }
    if (r.source_id && (seenSource.get(r.source_id) || []).length > 1) errors.push("source_id en doublon dans le fichier.");
    if (r.identifiant_national && (seenNational.get(r.identifiant_national) || []).length > 1) errors.push("identifiant_national en doublon dans le fichier.");
    if (/^SYN-/i.test(r.source_id || "") || /^SYN-/i.test(r.identifiant_national || "")) warnings.push("Identifiant synthétique : ligne de démonstration, jamais importable en production.");
    if (/synth[eé]tique|simulation|fictif/i.test((r.source || "") + " " + (r.reference_acte || ""))) warnings.push("Source ou référence de démonstration, non officielle.");
    return { ...r, _line: r._line || i + 2, _errors: errors, _warnings: warnings, _valid: errors.length === 0 && warnings.length === 0 };
  });
}
