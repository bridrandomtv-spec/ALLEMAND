#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit en lecture seule du registre BIBLIO/RAG et des fichiers sources.

Le script ne modifie ni le catalogue, ni les PDF, ni les sidecars. Il calcule
les SHA-256 localement et distingue la présence physique de la qualification
des droits. Une étiquette historique de licence n'est jamais une preuve.
"""
import argparse
import collections
import hashlib
import json
import os
import re
from pathlib import Path

try:
    from tools.rights_metadata import valider_metadonnees
except ModuleNotFoundError:
    from rights_metadata import valider_metadonnees


HASH_RE = re.compile(r"^[0-9a-f]{64}$")


def _safe_relative(value):
    raw = str(value or "").strip()
    if not raw or raw.startswith("#") or "://" in raw:
        return None
    raw = raw.split("#", 1)[0].split("?", 1)[0].lstrip("/")
    path = Path(raw)
    if path.is_absolute() or ".." in path.parts:
        return None
    return path


def _sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _sidecar_for(source):
    return source.with_name("_" + source.stem + ".json")


def auditer(corpus_path, repo_root):
    corpus_path = Path(corpus_path)
    repo_root = Path(repo_root).resolve()
    with open(corpus_path, encoding="utf-8") as stream:
        corpus = json.load(stream)
    if not isinstance(corpus, dict) or not isinstance(corpus.get("documents"), list):
        raise ValueError("Catalogue invalide : documents[] absent")

    records = []
    seen_ids = set()
    seen_urls = set()
    duplicate_ids = []
    duplicate_urls = []
    for doc in corpus["documents"]:
        if not isinstance(doc, dict):
            records.append({"status": "invalid_record", "reason": "fiche non structurée"})
            continue
        did = str(doc.get("id") or "").strip()
        url = str(doc.get("url") or "").strip()
        if did in seen_ids:
            duplicate_ids.append(did)
        seen_ids.add(did)
        if url in seen_urls:
            duplicate_urls.append(url)
        seen_urls.add(url)

        relative = _safe_relative(url)
        source = (repo_root / relative).resolve() if relative else None
        safe = bool(source and (source == repo_root or repo_root in source.parents))
        exists = bool(safe and source.is_file())
        source_hash = _sha256(source) if exists else None
        recorded_hash = str(doc.get("source_sha256") or "").strip().lower()
        hash_valid = bool(HASH_RE.fullmatch(recorded_hash))
        hash_matches = (source_hash == recorded_hash) if hash_valid and exists else None

        sidecar = _sidecar_for(source) if exists else None
        sidecar_exists = bool(sidecar and sidecar.is_file())
        rights = None
        rights_reason = "sidecar absent"
        if sidecar_exists:
            try:
                with open(sidecar, encoding="utf-8") as stream:
                    rights = json.load(stream)
                rights_ok, rights_reason = valider_metadonnees(rights)
            except (OSError, UnicodeError, json.JSONDecodeError) as exc:
                rights_ok, rights_reason = False, "sidecar illisible: " + str(exc)
        else:
            rights_ok = False

        findings = []
        if not safe:
            findings.append("path_unusable")
        elif not exists:
            findings.append("source_missing")
        if exists and not hash_valid:
            findings.append("catalogue_hash_missing_or_invalid")
        elif exists and hash_matches is False:
            findings.append("hash_mismatch")
        if not sidecar_exists:
            findings.append("rights_sidecar_missing")
        elif not rights_ok:
            findings.append("rights_metadata_invalid")
        if not safe:
            status = "path_unusable"
        elif not exists:
            status = "source_missing"
        elif hash_valid and hash_matches is False:
            status = "hash_mismatch"
        elif not hash_valid:
            status = "catalogue_hash_missing"
        elif not rights_ok:
            status = "rights_unverified"
        else:
            status = "eligible_for_review"
        records.append({
            "id": did, "title": str(doc.get("titre") or ""),
            "format": str(doc.get("format") or ""),
            "url": url, "source_exists": exists,
            "source_size_bytes": source.stat().st_size if exists else None,
            "computed_sha256": source_hash,
            "catalogue_sha256": recorded_hash or None,
            "catalogue_hash_valid": hash_valid,
            "catalogue_hash_matches": hash_matches,
            "sidecar_path": str(sidecar.relative_to(repo_root)) if sidecar and safe else None,
            "sidecar_exists": sidecar_exists,
            "rights_valid": bool(rights_ok),
            "rights_reason": rights_reason,
            "legacy_license_label": str(doc.get("licence") or ""),
            "findings": findings,
            "status": status
        })

    counts = collections.Counter(row["status"] for row in records)
    finding_counts = collections.Counter(
        finding for row in records for finding in row.get("findings", [])
    )
    formats = collections.Counter(row.get("format", "") for row in records)
    legacy = collections.Counter(row.get("legacy_license_label", "") for row in records)
    return {
        "audit_version": "1.0.0",
        "read_only": True,
        "catalogue": str(corpus_path),
        "total_documents": len(records),
        "status_counts": dict(sorted(counts.items())),
        "finding_counts": dict(sorted(finding_counts.items())),
        "format_counts": dict(sorted(formats.items())),
        "legacy_license_label_counts": dict(sorted(legacy.items())),
        "duplicate_ids": sorted(set(duplicate_ids)),
        "duplicate_urls": sorted(set(duplicate_urls)),
        "documents": records
    }


def markdown_report(report):
    lines = [
        "# Audit du registre documentaire",
        "",
        "- Mode : lecture seule",
        "- Fiches : %d" % report["total_documents"],
        "",
        "## Répartition",
        "",
        "| Statut | Nombre |",
        "|---|---:|"
    ]
    for status, count in report["status_counts"].items():
        lines.append("| %s | %d |" % (status, count))
    lines += ["", "## Anomalies d'identifiants", "",
              "- IDs dupliqués : %d" % len(report["duplicate_ids"]),
              "- URLs dupliquées : %d" % len(report["duplicate_urls"]),
              "", "## Fiches à examiner", "",
              "| ID | Format | Source présente | Droits validés | Statut |",
              "|---|---|---:|---:|---|"]
    for row in report["documents"]:
        lines.append("| %s | %s | %s | %s | %s |" % (
            row.get("id", ""), row.get("format", ""),
            "oui" if row.get("source_exists") else "non",
            "oui" if row.get("rights_valid") else "non",
            row.get("status", "")
        ))
    lines += ["", "Les étiquettes historiques ne constituent pas une preuve de droits.",
              "Le SHA Git d'un blob n'est pas assimilé au SHA-256 du fichier source.", ""]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", default="assets/bdd/corpus.json")
    parser.add_argument("--root", default=".")
    parser.add_argument("--json-out", default="audit-corpus-report.json")
    parser.add_argument("--markdown-out", default="audit-corpus-report.md")
    args = parser.parse_args()
    report = auditer(args.corpus, args.root)
    with open(args.json_out, "w", encoding="utf-8") as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
    with open(args.markdown_out, "w", encoding="utf-8") as stream:
        stream.write(markdown_report(report))
    print("Audit en lecture seule :", report["total_documents"], "fiches")
    for status, count in report["status_counts"].items():
        print("%s: %d" % (status, count))
    print("Rapports :", args.json_out, "et", args.markdown_out)


if __name__ == "__main__":
    main()
