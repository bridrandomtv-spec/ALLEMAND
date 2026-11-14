const CRITICAL_FIELDS = new Set(["statut", "date_effet", "reference_acte", "source"]);
const IDENTITY_FIELDS = new Set(["nom_ar", "nom_fr", "wilaya_code", "commune_code", "source_id", "annee_scolaire"]);

function safeText(value) {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim();
}

function classify(item, category) {
  if (category === "absent") return {
    priority: "P1",
    reason: "Absence entre deux versions : statut indéterminé",
    requiredAction: "QUARANTAINE_ET_VERIFICATION_SOURCE",
    initialDecision: "quarantaine"
  };
  if (category === "added") return {
    priority: "P1",
    reason: "Nouvel identifiant à authentifier",
    requiredAction: "VERIFIER_IDENTIFIANT_SOURCE_ET_ACTE",
    initialDecision: "a_revoir"
  };
  if (category === "changed") {
    const critical = item.changedFields.some(field => CRITICAL_FIELDS.has(field));
    const identity = item.changedFields.some(field => IDENTITY_FIELDS.has(field));
    if (critical) return {
      priority: "P1",
      reason: "Champ de statut, date ou référence de source modifié",
      requiredAction: "VERIFIER_ACTE_ET_DATE_EFFET",
      initialDecision: "a_revoir"
    };
    if (identity) return {
      priority: "P2",
      reason: "Identité ou rattachement géographique modifié",
      requiredAction: "COMPARER_SOURCE_ET_VALIDER_IDENTITE",
      initialDecision: "a_revoir"
    };
    return {
      priority: "P2",
      reason: "Autre champ descriptif modifié",
      requiredAction: "CONTROLER_DIFFERENCE",
      initialDecision: "a_revoir"
    };
  }
  return {
    priority: "P3",
    reason: "Aucun changement détecté sur les champs comparés",
    requiredAction: "CONFIRMER_PRESENCE_ET_INTEGRITE_DU_LOT",
    initialDecision: "a_revoir"
  };
}

export function buildRegistryReviewReport(reconciliation, metadata = {}) {
  if (!reconciliation || !reconciliation.summary) {
    throw new TypeError("Résultat de rapprochement invalide.");
  }
  const records = [];
  const add = (items, category) => {
    for (const item of items || []) {
      const review = classify(item, category);
      records.push({
        category,
        nationalId: safeText(item.key),
        changedFields: [...(item.changedFields || [])],
        priority: review.priority,
        reason: review.reason,
        requiredAction: review.requiredAction,
        decision: review.initialDecision,
        operatorComment: "",
        approverComment: "",
        operator: "",
        approver: "",
        sourceReference: safeText(item.after?.reference_acte ?? item.before?.reference_acte),
        metadata: {
          previousBatchId: safeText(metadata.previousBatchId),
          incomingBatchId: safeText(metadata.incomingBatchId)
        }
      });
    }
  };
  add(reconciliation.absent, "absent");
  add(reconciliation.added, "added");
  add(reconciliation.changed, "changed");
  add(reconciliation.unchanged, "unchanged");
  const rank = { P1: 1, P2: 2, P3: 3 };
  records.sort((a, b) => rank[a.priority] - rank[b.priority] ||
    a.nationalId.localeCompare(b.nationalId, "en"));
  return {
    reportVersion: "1",
    generatedForSyntheticOrAuthorizedReviewOnly: true,
    metadata: {
      previousBatchId: safeText(metadata.previousBatchId),
      incomingBatchId: safeText(metadata.incomingBatchId),
      issuer: safeText(metadata.issuer),
      extractedAt: safeText(metadata.extractedAt),
      sourceSha256: safeText(metadata.sourceSha256)
    },
    totals: {
      records: records.length,
      P1: records.filter(x => x.priority === "P1").length,
      P2: records.filter(x => x.priority === "P2").length,
      P3: records.filter(x => x.priority === "P3").length,
      pending: records.length
    },
    records
  };
}

export function registryReviewCsv(report) {
  const header = [
    "priorite", "categorie", "identifiant_national", "champs_modifies",
    "motif", "action_requise", "decision", "reference_source",
    "operateur", "commentaire_operateur", "approbateur",
    "commentaire_approbateur", "lot_precedent", "nouveau_lot"
  ];
  const rows = [header];
  for (const r of report.records) rows.push([
    r.priority, r.category, r.nationalId, r.changedFields.join(";"),
    r.reason, r.requiredAction, r.decision, r.sourceReference,
    r.operator, r.operatorComment, r.approver, r.approverComment,
    r.metadata.previousBatchId, r.metadata.incomingBatchId
  ]);
  return rows.map(row => row.map(value => {
    let cell = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replace(/"/g, '""') + '"';
  }).join(",")).join("\r\n");
}

export function recordReviewDecision(report, nationalId, decision, actor) {
  const allowed = new Set(["accepte", "rejete", "quarantaine", "a_revoir"]);
  if (!allowed.has(decision)) throw new Error("Décision inconnue.");
  if (!actor || !safeText(actor.id) || !safeText(actor.role)) {
    throw new Error("Acteur de revue non identifié.");
  }
  const record = report.records.find(x => x.nationalId === nationalId);
  if (!record) throw new Error("Enregistrement absent du rapport.");
  if (actor.role === "approbateur" && record.operator && record.operator === actor.id) {
    throw new Error("Séparation des tâches : l'opérateur ne peut pas approuver son propre dossier.");
  }
  if (actor.role === "operateur") {
    if (!["a_revoir", "quarantaine"].includes(decision)) throw new Error("L’opérateur ne peut que documenter ou mettre en quarantaine.");
    record.operator = safeText(actor.id);
    record.operatorComment = safeText(actor.comment);
  } else if (actor.role === "approbateur") {
    if (decision === "a_revoir") throw new Error("L’approbateur doit rendre une décision explicite.");
    if (!record.operator) throw new Error("La revue opérateur doit précéder l'approbation.");
    record.approver = safeText(actor.id);
    record.approverComment = safeText(actor.comment);
  } else {
    throw new Error("Rôle de revue non autorisé.");
  }
  record.decision = decision;
  return record;
}
