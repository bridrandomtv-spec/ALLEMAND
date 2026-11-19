#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valide l'inventaire des droits PDF sans modifier le dépôt ni créer de preuves.

Le CSV est une feuille de revue humaine. Ce contrôle ne déduit jamais une licence
et ne crée aucun fichier compagnon. Un document n'est admissible que si
rights_confirmed=true ET license appartient à ALLOWED_LICENSES.
"""
import argparse
import csv
import json
import sys
from pathlib import Path, PurePosixPath

ALLOWED_LICENSES = {
    "production_propre", "domaine_public", "cc_by", "cc_by_sa",
    "autorisation_ecrite",
}
REQUIRED_COLUMNS = {
    "pdf_path", "expected_companion_metadata", "rights_confirmed",
    "license", "review_status",
}


def _safe_repo_file(repo_root, relative_path):
    raw = str(relative_path or "").strip()
    posix = PurePosixPath(raw)
    if not raw or posix.is_absolute() or ".." in posix.parts or "\\" in raw:
        return None
    root = Path(repo_root).resolve()
    candidate = (root / Path(*posix.parts)).resolve()
    try:
        candidate.relative_to(root)
    except ValueError:
        return None
    return candidate


def validate_inventory(csv_path, repo_root):
    csv_path, repo_root = Path(csv_path), Path(repo_root)
    errors, approved, seen = [], [], set()
    total = 0
    try:
        handle = csv_path.open("r", encoding="utf-8-sig", newline="")
    except OSError as exc:
        return {"total": 0, "approved_count": 0, "pending_count": 0,
                "errors": [f"csv_illisible:{type(exc).__name__}"], "approved": []}

    with handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []
        if len(fieldnames) != len(set(fieldnames)):
            return {"total": 0, "approved_count": 0, "pending_count": 0,
                    "errors": ["entetes_csv_dupliquees"], "approved": []}
        headers = set(fieldnames)
        missing = sorted(REQUIRED_COLUMNS - headers)
        if missing:
            return {"total": 0, "approved_count": 0, "pending_count": 0,
                    "errors": ["colonnes_absentes:" + ",".join(missing)],
                    "approved": []}

        for line_number, row in enumerate(reader, start=2):
            total += 1
            pdf_label = (row.get("pdf_path") or "").strip()
            pdf = _safe_repo_file(repo_root, pdf_label)
            if pdf is None:
                errors.append(f"ligne_{line_number}:chemin_pdf_invalide")
                continue
            normalized_path = pdf.relative_to(repo_root.resolve()).as_posix()
            if normalized_path in seen:
                errors.append(f"ligne_{line_number}:pdf_duplique:{normalized_path}")
                continue
            seen.add(normalized_path)
            if not pdf.is_file() or pdf.suffix.lower() != ".pdf":
                errors.append(f"ligne_{line_number}:pdf_absent_ou_invalide:{normalized_path}")
                continue

            expected = (pdf.parent / ("_" + pdf.stem + ".json")).relative_to(repo_root.resolve()).as_posix()
            supplied = (row.get("expected_companion_metadata") or "").strip()
            if supplied != expected:
                errors.append(f"ligne_{line_number}:compagnon_incoherent:{normalized_path}")
                continue

            rights = (row.get("rights_confirmed") or "").strip().lower()
            license_name = (row.get("license") or "").strip().lower()
            if rights not in {"", "true", "false"}:
                errors.append(f"ligne_{line_number}:valeur_droits_invalide:{normalized_path}")
                continue
            if license_name and license_name not in ALLOWED_LICENSES:
                errors.append(f"ligne_{line_number}:licence_non_autorisee:{normalized_path}")
                continue
            if rights == "true" and not license_name:
                errors.append(f"ligne_{line_number}:licence_manquante:{normalized_path}")
                continue
            if rights == "true" and license_name in ALLOWED_LICENSES:
                companion = _safe_repo_file(repo_root, expected)
                if companion is None:
                    errors.append(f"ligne_{line_number}:chemin_compagnon_invalide:{normalized_path}")
                    continue
                if not companion.is_file():
                    errors.append(f"ligne_{line_number}:compagnon_absent:{normalized_path}")
                    continue
                try:
                    metadata = json.loads(companion.read_text(encoding="utf-8"))
                except (OSError, json.JSONDecodeError):
                    errors.append(f"ligne_{line_number}:compagnon_illisible:{normalized_path}")
                    continue
                if not isinstance(metadata, dict) or metadata.get("droits_confirmes") is not True:
                    errors.append(f"ligne_{line_number}:confirmation_compagnon_absente:{normalized_path}")
                    continue
                companion_license = str(metadata.get("licence", "")).strip().lower()
                if companion_license != license_name:
                    errors.append(f"ligne_{line_number}:licence_compagnon_incoherente:{normalized_path}")
                    continue
                approved.append({
                    "pdf_path": normalized_path,
                    "companion_metadata": expected,
                    "license": license_name,
                })

    return {
        "total": total,
        "approved_count": len(approved),
        "pending_count": max(total - len(approved) - len(errors), 0),
        "errors": errors,
        "approved": approved,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", help="Inventaire CSV à contrôler")
    parser.add_argument("--repo-root", default=".", help="Racine du dépôt")
    parser.add_argument("--strict", action="store_true",
                        help="Retourne un code non nul tant qu'il reste des lignes en attente")
    args = parser.parse_args(argv)
    result = validate_inventory(args.csv_path, args.repo_root)
    summary = {key: value for key, value in result.items() if key != "approved"}
    summary["approved"] = result["approved"]
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if result["errors"] or (args.strict and result["pending_count"]):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
