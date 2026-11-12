import test from "node:test";
import assert from "node:assert/strict";
import { createAffiliationCase, decideAffiliation, canAppearInNationalDirectory } from "./registry-affiliation-scenarios-core.mjs";

const base = () => createAffiliationCase({
  caseId:"SYN-CASE-01", studentId:"SYN-STUDENT-01", schoolId:"SYN-SCHOOL-A",
  schoolYear:"2026-2027", sourceId:"SYN-SOURCE-01", createdAt:"2026-11-12T09:00:00.000Z"
});
const verify = (r, overrides={}) => decideAffiliation(r, {
  type:"verify", actorId:"SYN-VERIFIER-A", actorRole:"school_verifier",
  actorSchoolId:"SYN-SCHOOL-A", sourceState:"verified",
  at:"2026-11-12T10:00:00.000Z", reason:"Contrôle synthétique.", ...overrides
});

test("accepts only an authorized verifier for the exact school", () => {
  const r=base(); verify(r); assert.equal(r.status,"verified");
  assert.throws(()=>verify(base(),{actorSchoolId:"SYN-SCHOOL-B"}),/hors périmètre/);
  assert.throws(()=>verify(base(),{actorRole:"prof"}),/Rôle de validation/);
});

test("rejects self-approval and unverified or revoked source", () => {
  assert.throws(()=>verify(base(),{actorId:"SYN-STUDENT-01"}),/Auto-validation/);
  assert.throws(()=>verify(base(),{sourceState:"revoked"}),/Source institutionnelle/);
  assert.throws(()=>verify(base(),{sourceState:"pending"}),/Source institutionnelle/);
});

test("blocks duplicate final decisions and keeps a decision history", () => {
  const r=base(); verify(r);
  assert.throws(()=>verify(r,{at:"2026-11-12T11:00:00.000Z"}),/déjà clôturé/);
  assert.equal(r.events.length,2);
});

test("transfer closes the source affiliation before destination verification", () => {
  const old=base(); verify(old);
  decideAffiliation(old,{type:"transfer",actorId:"SYN-VERIFIER-A",actorRole:"school_verifier",actorSchoolId:"SYN-SCHOOL-A",at:"2026-11-12T11:00:00.000Z",reason:"Transfert synthétique."});
  assert.equal(old.status,"transferred");
  const next=createAffiliationCase({caseId:"SYN-CASE-02",studentId:"SYN-STUDENT-01",schoolId:"SYN-SCHOOL-B",schoolYear:"2026-2027",sourceId:"SYN-SOURCE-02",createdAt:"2026-11-12T11:05:00.000Z"});
  verify(next,{actorId:"SYN-VERIFIER-B",actorSchoolId:"SYN-SCHOOL-B",at:"2026-11-12T11:10:00.000Z"});
  assert.equal(next.status,"verified");
});

test("prevents unauthorized revocation and permits an approver to revoke", () => {
  const r=base(); verify(r);
  assert.throws(()=>decideAffiliation(r,{type:"revoke",actorId:"SYN-OP",actorRole:"registry_operator",at:"2026-11-12T11:00:00.000Z",reason:"test"}),/ne peut pas révoquer/);
  decideAffiliation(r,{type:"revoke",actorId:"SYN-AP",actorRole:"registry_approver",at:"2026-11-12T11:05:00.000Z",reason:"Source retirée."});
  assert.equal(r.status,"revoked");
});

test("expires only verified affiliations and hides stale or opted-out students", () => {
  const r=base(); verify(r);
  assert.equal(canAppearInNationalDirectory(r,{currentSchoolYear:"2026-2027",sourceState:"verified",optedIn:true}),true);
  assert.equal(canAppearInNationalDirectory(r,{currentSchoolYear:"2027-2028",sourceState:"verified",optedIn:true}),false);
  assert.equal(canAppearInNationalDirectory(r,{currentSchoolYear:"2026-2027",sourceState:"revoked",optedIn:true}),false);
  assert.equal(canAppearInNationalDirectory(r,{currentSchoolYear:"2026-2027",sourceState:"verified",optedIn:false}),false);
  decideAffiliation(r,{type:"expire",actorId:"SYN-SYSTEM",actorRole:"system_expiry",at:"2027-07-01T00:00:00.000Z",reason:"Fin d'année."});
  assert.equal(r.status,"expired");
});

test("rejects unknown transitions and invalid actor roles", () => {
  assert.throws(()=>decideAffiliation(base(),{type:"promote",actorId:"X",actorRole:"admin",at:"2026-11-12T10:00:00.000Z",reason:"test"}),/Transition inconnue/);
});
