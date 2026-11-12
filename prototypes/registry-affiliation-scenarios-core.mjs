// Offline synthetic model only. Not connected to Auth, Supabase, or a school registry.
const ACTIVE_SOURCE_STATES = new Set(["verified"]);
const FINAL = new Set(["verified", "rejected", "revoked", "expired", "transferred"]);

function need(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(label + " obligatoire.");
  return value.trim();
}

export function createAffiliationCase({ caseId, studentId, schoolId, schoolYear, sourceId, createdAt }) {
  return {
    caseId: need(caseId, "Dossier"),
    studentId: need(studentId, "Élève"),
    schoolId: need(schoolId, "Établissement"),
    schoolYear: need(schoolYear, "Année scolaire"),
    sourceId: need(sourceId, "Source"),
    status: "pending",
    createdAt: need(createdAt, "Date"),
    events: [{ type: "requested", actorId: need(studentId, "Élève"), at: createdAt }]
  };
}

export function decideAffiliation(record, { type, actorId, actorRole, actorSchoolId, sourceState, at, reason, previousEnrollment }) {
  if (!record || !Array.isArray(record.events)) throw new Error("Dossier invalide.");
  need(actorId, "Acteur"); need(at, "Date"); need(reason, "Motif");
  if (FINAL.has(record.status)) throw new Error("Dossier déjà clôturé.");
  if (type === "verify") {
    if (actorRole !== "school_verifier") throw new Error("Rôle de validation établissement requis.");
    if (actorSchoolId !== record.schoolId) throw new Error("Responsable hors périmètre de l'établissement.");
    if (actorId === record.studentId) throw new Error("Auto-validation interdite.");
    if (!ACTIVE_SOURCE_STATES.has(sourceState)) throw new Error("Source institutionnelle non vérifiée ou révoquée.");
    if (previousEnrollment &&
        previousEnrollment.studentId === record.studentId &&
        previousEnrollment.schoolYear === record.schoolYear &&
        previousEnrollment.schoolId !== record.schoolId &&
        previousEnrollment.status !== "transferred") {
      throw new Error("Transfert préalable non clôturé.");
    }
    record.status = "verified";
  } else if (type === "reject") {
    if (actorRole !== "school_verifier" || actorSchoolId !== record.schoolId) throw new Error("Validation établissement hors périmètre.");
    if (actorId === record.studentId) throw new Error("Auto-décision interdite.");
    record.status = "rejected";
  } else if (type === "revoke") {
    if (!["registry_operator", "registry_approver"].includes(actorRole)) throw new Error("Rôle registre requis.");
    if (actorRole === "registry_operator") throw new Error("Un opérateur ne peut pas révoquer une affiliation vérifiée.");
    if (record.status !== "verified") throw new Error("Seule une affiliation vérifiée peut être révoquée.");
    record.status = "revoked";
  } else if (type === "expire") {
    if (actorRole !== "system_expiry") throw new Error("Expiration réservée au traitement système.");
    if (record.status !== "verified") throw new Error("Seule une affiliation vérifiée peut expirer.");
    record.status = "expired";
  } else if (type === "transfer") {
    if (actorRole !== "school_verifier" || actorSchoolId !== record.schoolId) throw new Error("Transfert à confirmer par l'établissement source.");
    if (record.status !== "verified") throw new Error("Seule une affiliation vérifiée peut être transférée.");
    record.status = "transferred";
  } else {
    throw new Error("Transition inconnue.");
  }
  record.events.push({ type, actorId, actorRole, actorSchoolId: actorSchoolId ?? null, at, reason, resultingStatus: record.status });
  return record;
}

export function canAppearInNationalDirectory(record, { currentSchoolYear, sourceState, optedIn }) {
  return Boolean(record && record.status === "verified" &&
    record.schoolYear === currentSchoolYear &&
    ACTIVE_SOURCE_STATES.has(sourceState) && optedIn === true);
}
