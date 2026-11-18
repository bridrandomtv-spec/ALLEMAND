#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit technique PDF sans conserver le texte ni produire de corpus RAG.

Le script mesure uniquement les pages et la présence de texte extractible.
Il ne lance pas l'OCR, n'écrit aucun fichier et n'indexe aucun document.
Les droits ne sont pas évalués ici : l'audit ne vaut jamais autorisation.
"""
import argparse
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


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir", help="Dossier racine à auditer récursivement")
    parser.add_argument("--summary-only", action="store_true",
                        help="N'affiche que les compteurs agrégés")
    args = parser.parse_args(argv)
    try:
        result = audit_directory(args.source_dir)
    except (OSError, ValueError) as exc:
        print("ERREUR:", exc, file=sys.stderr)
        return 1
    output = result["summary"] if args.summary_only else result
    print(json.dumps(output, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
