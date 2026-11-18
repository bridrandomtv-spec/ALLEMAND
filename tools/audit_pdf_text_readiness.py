#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit technique PDF sans conserver le texte ni produire de corpus RAG.

Le script mesure uniquement les pages et la présence de texte extractible.
Il ne lance pas l'OCR et n'indexe aucun document. Le rapport CSV optionnel
contient uniquement des chemins et compteurs techniques, jamais le texte PDF.
Les droits ne sont pas évalués ici : l'audit ne vaut jamais autorisation.
"""
import argparse
import csv
import json
import re
import sys
from pathlib import Path

MIN_PAGE_CHARS = 80
CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")
GLYPH_RE = re.compile(r"(?:/g\d{1,4}){3,}", re.I)


def _page_has_extractable_text(value):
    text = str(value or "")
    compact = re.sub(r"\s+", "", text)
    if len(compact) < MIN_PAGE_CHARS:
        return False
    if len(CONTROL_RE.findall(text)) / max(len(text), 1) > 0.01:
        return False
    if GLYPH_RE.search(text):
        return False
    return True


def audit_pdf(pdf_path):
    path = Path(pdf_path)
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path), strict=False)
        if getattr(reader, "is_encrypted", False):
            return {
                "status": "encrypted", "pages": 0,
                "pages_with_text": 0, "pages_without_text": 0,
                "extractable_chars": 0,
            }
        pages = reader.pages
        page_count = len(pages)
        with_text = 0
        extractable_chars = 0
        for page in pages:
            value = page.extract_text() or ""
            if _page_has_extractable_text(value):
                with_text += 1
                extractable_chars += len(re.sub(r"\s+", "", value))
            del value
        without_text = page_count - with_text
        if page_count == 0:
            status = "empty"
        elif with_text == 0:
            status = "ocr_candidate"
        elif without_text:
            status = "mixed"
        else:
            status = "extractable"
        return {
            "status": status, "pages": page_count,
            "pages_with_text": with_text,
            "pages_without_text": without_text,
            "extractable_chars": extractable_chars,
        }
    except Exception as exc:
        return {
            "status": "unreadable", "pages": 0,
            "pages_with_text": 0, "pages_without_text": 0,
            "extractable_chars": 0,
            "error": type(exc).__name__,
        }


def audit_directory(source_dir):
    root = Path(source_dir).resolve()
    if not root.is_dir():
        raise ValueError("dossier_source_invalide")
    files = []
    for candidate in sorted(root.rglob("*")):
        if candidate.suffix.lower() != ".pdf" or not candidate.is_file():
            continue
        resolved = candidate.resolve()
        try:
            relative = resolved.relative_to(root).as_posix()
        except ValueError:
            files.append({
                "pdf_path": candidate.relative_to(root).as_posix(),
                "status": "outside_root", "pages": 0,
                "pages_with_text": 0, "pages_without_text": 0,
                "extractable_chars": 0,
            })
            continue
        files.append({"pdf_path": relative, **audit_pdf(resolved)})

    counts = {
        key: sum(1 for item in files if item["status"] == key)
        for key in ("extractable", "mixed", "ocr_candidate", "encrypted",
                    "empty", "unreadable", "outside_root")
    }
    summary = {
        "pdf_count": len(files),
        "page_count": sum(item["pages"] for item in files),
        "pages_with_text": sum(item["pages_with_text"] for item in files),
        "pages_without_text": sum(item["pages_without_text"] for item in files),
        "extractable_chars": sum(item["extractable_chars"] for item in files),
        "files_by_status": counts,
        "text_is_not_saved": True,
        "ocr_executed": False,
        "rights_verified": False,
        "rag_indexed": False,
    }
    return {"summary": summary, "files": files}


def merge_rights_inventory(files, inventory_path):
    """Joint l'audit et l'inventaire sur le chemin PDF exact, sans inférer les droits."""
    inventory_file = Path(inventory_path)
    if not inventory_file.is_file():
        raise ValueError("inventaire_droits_introuvable")
    with inventory_file.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"pdf_path", "expected_companion_metadata", "rights_confirmed",
                    "license", "review_status"}
        if not required.issubset(set(reader.fieldnames or [])):
            raise ValueError("colonnes_inventaire_droits_invalides")
        rights_by_path = {}
        for row in reader:
            key = (row.get("pdf_path") or "").strip().replace("\\", "/")
            if not key or key.startswith("/") or ".." in Path(key).parts:
                raise ValueError("chemin_inventaire_invalide")
            if key in rights_by_path:
                raise ValueError("chemin_inventaire_duplique:" + key)
            rights_by_path[key] = row

    audit_by_path = {}
    for item in files:
        key = item["pdf_path"]
        if key in audit_by_path:
            raise ValueError("chemin_audit_duplique:" + key)
        audit_by_path[key] = item

    fields = ("expected_companion_metadata", "rights_confirmed", "license", "review_status")
    merged = []
    for key in sorted(set(audit_by_path) | set(rights_by_path)):
        technical = dict(audit_by_path.get(key, {}))
        rights = rights_by_path.get(key)
        if rights is None:
            technical.update({"rights_inventory_match": "absent_de_inventaire",
                              **{field: "" for field in fields}})
        else:
            technical.update({"rights_inventory_match": "présent_dans_inventaire",
                              **{field: rights.get(field, "") or "" for field in fields}})
        if key not in audit_by_path:
            technical.update({"status": "pdf_absent_du_corpus_audite", "pages": "",
                              "pages_with_text": "", "pages_without_text": "",
                              "extractable_chars": "", "error": ""})
        merged.append(technical)

    reconciliation = {
        "audit_pdf_count": len(audit_by_path),
        "inventory_rows": len(rights_by_path),
        "matched_paths": len(set(audit_by_path) & set(rights_by_path)),
        "audit_without_inventory": len(set(audit_by_path) - set(rights_by_path)),
        "inventory_without_pdf": len(set(rights_by_path) - set(audit_by_path)),
        "rights_confirmed_count": sum(1 for row in rights_by_path.values()
            if str(row.get("rights_confirmed", "")).strip().lower() == "true"),
        "rights_unconfirmed_or_blank_count": sum(1 for row in rights_by_path.values()
            if str(row.get("rights_confirmed", "")).strip().lower() != "true"),
        "rights_inferred": False,
    }
    return merged, reconciliation


def write_csv_report(result, output_path, source_dir, rights_inventory=None):
    root = Path(source_dir).resolve()
    target = Path(output_path).resolve()
    if target == root or root in target.parents:
        raise ValueError("rapport_doit_rester_hors_corpus")
    target.parent.mkdir(parents=True, exist_ok=True)
    rows = result["files"]
    if rights_inventory:
        rows, _ = merge_rights_inventory(rows, rights_inventory)
    fields = (
        "pdf_path", "status", "pages", "pages_with_text",
        "pages_without_text", "extractable_chars", "error",
        "rights_inventory_match", "expected_companion_metadata",
        "rights_confirmed", "license", "review_status",
    )
    with target.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for item in result["files"]:
            writer.writerow(item)
    return target


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir", help="Dossier racine à auditer récursivement")
    parser.add_argument("--summary-only", action="store_true",
                        help="N'affiche que les compteurs agrégés")
    parser.add_argument("--csv-output",
                        help="Écrit un rapport de chemins et compteurs hors du dossier source")
    parser.add_argument("--rights-inventory",
                        help="Inventaire CSV des droits à joindre par chemin exact (aucune inférence)")
    args = parser.parse_args(argv)
    try:
        result = audit_directory(args.source_dir)
        if args.csv_output:
            report_path = write_csv_report(
                result, args.csv_output, args.source_dir, args.rights_inventory
            )
            print(f"Rapport PDF technique + droits écrit : {report_path}", file=sys.stderr)
            if args.rights_inventory:
                _, reconciliation = merge_rights_inventory(result["files"], args.rights_inventory)
                print(json.dumps({"reconciliation": reconciliation}, ensure_ascii=False),
                      file=sys.stderr)
        elif args.rights_inventory:
            raise ValueError("--rights-inventory exige --csv-output")
    except (OSError, ValueError) as exc:
        print("ERREUR:", exc, file=sys.stderr)
        return 1
    output = result["summary"] if args.summary_only else result
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
