import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, validateRows, REQUIRED } from "./registry-import-core.mjs";
const valid = Object.fromEntries(REQUIRED.map(k=>[k,"x"]));
valid.source_id="SRC-1";valid.identifiant_national="NAT-1";valid.statut="actif";valid.date_effet="2026-09-01";
test("parse CSV quoted commas and escaped quotes",()=>{
 const values=REQUIRED.map(k=>k==="nom_fr" ? '"Lycée, test"' : k==="nom_ar" ? '"mot ""cité"""' : "x");
 const rows=parseCsv(REQUIRED.join(",")+"\n"+values.join(","));
 assert.equal(rows[0].nom_fr,"Lycée, test");assert.equal(rows[0].nom_ar,'mot "cité"');
});
test("rejects unclosed quoted cell",()=>assert.throws(()=>parseCsv('a,b\n"bad,x'),/guillemet non refermé/));
test("validates a structurally complete official-shaped row",()=>{
 const out=validateRows([valid]);assert.equal(out[0]._errors.length,0);assert.equal(out[0]._warnings.length,0);assert.equal(out[0]._valid,true);
});
test("flags duplicate national identifiers",()=>{
 const second={...valid,source_id:"SRC-2"};
 const out=validateRows([valid,second]);assert.ok(out.every(r=>r._errors.some(x=>x.includes("identifiant_national en doublon"))));
});
test("never treats synthetic identifiers as production-ready",()=>{
 const out=validateRows([{...valid,source_id:"SYN-001",identifiant_national:"SYN-002"}]);
 assert.equal(out[0]._valid,false);assert.ok(out[0]._warnings.some(x=>x.includes("Identifiant synthétique")));
});
test("rejects invalid dates and status values",()=>{
 const out=validateRows([{...valid,date_effet:"2026-02-31",statut:"inconnu"}]);
 assert.ok(out[0]._errors.some(x=>x.includes("date_effet n'est pas une date valide")));
 assert.ok(out[0]._errors.some(x=>x.includes("Statut inconnu")));
});

test("requires the complete known header set",()=>assert.throws(()=>parseCsv("source_id,nom_ar\nA,B"),/En-têtes obligatoires absents/));
test("rejects extra CSV columns instead of silently truncating",()=>assert.throws(()=>parseCsv(REQUIRED.join(",")+"\n"+REQUIRED.map(()=> "x").join(",")+",extra"),/trop de colonnes/));
