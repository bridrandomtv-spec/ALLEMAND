#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ingestion PDF dédiée au RAG distant.

N'écrase jamais corpus.json ni corpus_index.json (index vocabulaire).
Usage: python tools/ingest_corpus_rag.py DOSSIER --output-dir .
Chaque PDF doit avoir un fichier compagnon _NOM.json avec:
  {"titre":"...", "licence":"production_propre", "droits_confirmes":true}
Licences admises: production_propre, domaine_public, cc_by, cc_by_sa,
autorisation_ecrite. Sans preuve explicite, le document est ignoré.
OCR: option --ocr ; nécessite tesseract, pdf2image, Poppler et les langues Tesseract.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import sys
from pathlib import Path

ALLOWED_LICENSES = {
    "production_propre", "domaine_public", "cc_by", "cc_by_sa",
    "autorisation_ecrite",
}
CHUNK_WORDS = 850
MIN_PAGE_CHARS = 80
CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")
GLYPH_RE = re.compile(r"(?:/g\d{1,4}){3,}", re.I)


def text_quality(text):
    value = str(text or "")
    compact = re.sub(r"\s+", "", value)
    if len(compact) < MIN_PAGE_CHARS:
        return {"ok": False, "reason": "texte_insuffisant", "chars": len(compact)}
    controls = len(CONTROL_RE.findall(value))
    if controls / max(len(value), 1) > 0.01:
        return {"ok": False, "reason": "caracteres_controle", "chars": len(compact)}
    if GLYPH_RE.search(value):
        return {"ok": False, "reason": "encodage_glyphes", "chars": len(compact)}
    return {"ok": True, "reason": "texte_exploitable", "chars": len(compact)}


def split_chunks(text, size=CHUNK_WORDS):
    words = str(text or "").split()
    return [" ".join(words[i:i + size]) for i in range(0, len(words), size)]


def _ocr_pages(path, page_count, languages):
    if not shutil.which("tesseract"):
        raise RuntimeError("tesseract_absent")
    try:
        from pdf2image import convert_from_path
        import pytesseract
    except ImportError as exc:
        raise RuntimeError("dependances_ocr_absentes") from exc
    images = convert_from_path(str(path), first_page=1, last_page=page_count)
    return [pytesseract.image_to_string(img, lang=languages) for img in images]


def extract_pdf(path, use_ocr=False, languages="deu+fra+ara"):
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path))
        pages = [(page.extract_text() or "") for page in reader.pages]
    except Exception as exc:
        return [], "lecture_pdf_echec:" + type(exc).__name__
    quality = [text_quality(value) for value in pages]
    if use_ocr and any(not item["ok"] for item in quality):
        try:
            scanned = _ocr_pages(path, len(pages), languages)
            for i, value in enumerate(scanned[:len(pages)]):
                if not quality[i]["ok"] and text_quality(value)["ok"]:
                    pages[i] = value
                    quality[i] = text_quality(value)
        except RuntimeError as exc:
            return [], str(exc)
        except Exception as exc:
            return [], "ocr_echec:" + type(exc).__name__
    usable = [(i + 1, value) for i, value in enumerate(pages) if text_quality(value)["ok"]]
    if not usable:
        reasons = sorted({item["reason"] for item in quality})
        return [], "aucun_texte_exploitable:" + ",".join(reasons)
    return usable, "ok"


def read_metadata(pdf_path):
    meta_path = pdf_path.with_name("_" + pdf_path.stem + ".json")
    if not meta_path.is_file():
        return None
    try:
        return json.loads(meta_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def ingest(source_dir, output_dir, use_ocr=False, languages="deu+fra+ara"):
    source_dir, output_dir = Path(source_dir), Path(output_dir)
    chunks, documents, skipped = [], [], []
    if not source_dir.is_dir():
        raise ValueError("dossier_source_invalide")
    for pdf in sorted(source_dir.glob("*.pdf")):
        meta = read_metadata(pdf)
        if not isinstance(meta, dict):
            skipped.append({"file": pdf.name, "reason": "metadonnees_absentes"})
            continue
        license_name = str(meta.get("licence", "")).strip().lower()
        if meta.get("droits_confirmes") is not True or license_name not in ALLOWED_LICENSES:
            skipped.append({"file": pdf.name, "reason": "droits_non_confirmes"})
            continue
        pages, status = extract_pdf(pdf, use_ocr=use_ocr, languages=languages)
        if status != "ok":
            skipped.append({"file": pdf.name, "reason": status})
            continue
        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        doc_id = str(meta.get("id") or ("pdf-" + digest[:16]))
        if not re.fullmatch(r"[A-Za-z0-9_-]{3,80}", doc_id):
            skipped.append({"file": pdf.name, "reason": "identifiant_invalide"})
            continue
        doc_chunks = 0
        for page_number, page_text in pages:
            for part_number, body in enumerate(split_chunks(page_text)):
                chunk_id = f"{doc_id}-p{page_number}-c{part_number}"
                chunks.append({
                    "id": chunk_id, "document_id": doc_id,
                    "page": page_number, "part": part_number, "text": body,
                })
                doc_chunks += 1
        documents.append({
            "id": doc_id, "title": str(meta.get("titre") or pdf.stem)[:240],
            "source_file": pdf.name, "sha256": digest,
            "license": license_name, "rights_confirmed": True,
            "subject": str(meta.get("matiere") or "allemand")[:80],
            "level": str(meta.get("niveau") or "")[:40],
            "chunk_count": doc_chunks,
        })
    output_dir.mkdir(parents=True, exist_ok=True)
    chunks_path = output_dir / "assets/bdd/corpus_rag_chunks.json"
    manifest_path = output_dir / "assets/bdd/corpus_rag_manifest.json"
    chunks_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"version": 1, "documents": documents, "chunks": chunks}
    manifest = {
        "version": 1, "status": "staged_not_connected",
        "document_count": len(documents), "chunk_count": len(chunks),
        "skipped": skipped,
        "note": "Artefact hors ligne ; ne pas servir au Worker avant validation d'accès et de provenance.",
    }
    chunks_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir")
    parser.add_argument("--output-dir", default=".")
    parser.add_argument("--ocr", action="store_true")
    parser.add_argument("--ocr-languages", default="deu+fra+ara")
    args = parser.parse_args(argv)
    try:
        result = ingest(args.source_dir, args.output_dir, args.ocr, args.ocr_languages)
    except (OSError, ValueError) as exc:
        print("ERREUR:", exc, file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
