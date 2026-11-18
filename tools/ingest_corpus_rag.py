#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ingestion PDF dédiée au RAG distant.

N'écrase jamais corpus.json ni corpus_index.json (index vocabulaire).
Usage: python tools/ingest_corpus_rag.py DOSSIER --output-dir . --rights-inventory docs/inventaire_pdf_droits.csv
Chaque PDF doit avoir un compagnon _NOM.json ET une ligne confirmée dans l'inventaire central.
  {"titre":"...", "licence":"production_propre", "droits_confirmes":true}
Licences admises: production_propre, domaine_public, cc_by, cc_by_sa,
autorisation_ecrite. Les droits et la licence doivent correspondre dans les deux sources ; sinon le document est ignoré.
OCR: option --ocr ; nécessite tesseract, pdf2image, Poppler et les langues Tesseract.
"""
import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import sys
from pathlib import Path, PurePosixPath

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
    ocr_status = ""
    if use_ocr and any(not item["ok"] for item in quality):
        try:
            scanned = _ocr_pages(path, len(pages), languages)
            for i, value in enumerate(scanned[:len(pages)]):
                if not quality[i]["ok"] and text_quality(value)["ok"]:
                    pages[i] = value
                    quality[i] = text_quality(value)
        except RuntimeError as exc:
            ocr_status = str(exc)
        except Exception as exc:
            ocr_status = "ocr_echec:" + type(exc).__name__
    usable = [(i + 1, value) for i, value in enumerate(pages) if text_quality(value)["ok"]]
    if not usable:
        reasons = sorted({item["reason"] for item in quality})
        return [], ocr_status or ("aucun_texte_exploitable:" + ",".join(reasons))
    return usable, ("ok" if not ocr_status else "ok_partiel:" + ocr_status)


def read_metadata(pdf_path):
    meta_path = pdf_path.with_name("_" + pdf_path.stem + ".json")
    if not meta_path.is_file():
        return None
    try:
        return json.loads(meta_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None



def load_rights_inventory(inventory_path):
    """Charge les autorisations humaines, en échouant fermé sur un inventaire ambigu."""
    if not inventory_path:
        return {}
    path = Path(inventory_path)
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"pdf_path", "expected_companion_metadata", "rights_confirmed", "license"}
        if not required.issubset(set(reader.fieldnames or [])):
            raise ValueError("colonnes_inventaire_droits_invalides")
        rows = {}
        for row in reader:
            pdf_label = (row.get("pdf_path") or "").strip()
            parsed = PurePosixPath(pdf_label)
            if not pdf_label or parsed.is_absolute() or ".." in parsed.parts or "\\" in pdf_label:
                raise ValueError("chemin_inventaire_droits_invalide")
            if pdf_label in rows:
                raise ValueError("pdf_droits_inventaire_duplique:" + pdf_label)
            rows[pdf_label] = row
    return rows


def inventory_authorizes_pdf(pdf, repo_root, rights_rows, companion_license):
    """Exige une ligne d'inventaire explicite, cohérente avec le compagnon."""
    try:
        pdf_label = pdf.resolve().relative_to(Path(repo_root).resolve()).as_posix()
    except ValueError:
        return False, "pdf_hors_racine_inventaire"
    row = rights_rows.get(pdf_label)
    if row is None:
        return False, "inventaire_droits_absent"
    expected_companion = (pdf.parent / ("_" + pdf.stem + ".json")).resolve()
    try:
        expected_label = expected_companion.relative_to(Path(repo_root).resolve()).as_posix()
    except ValueError:
        return False, "compagnon_hors_racine_inventaire"
    supplied_companion = (row.get("expected_companion_metadata") or "").strip()
    if supplied_companion != expected_label:
        return False, "compagnon_inventaire_incoherent"
    if (row.get("rights_confirmed") or "").strip().lower() != "true":
        return False, "droits_non_confirmes_dans_inventaire"
    inventory_license = (row.get("license") or "").strip().lower()
    if inventory_license not in ALLOWED_LICENSES:
        return False, "licence_inventaire_non_autorisee"
    if inventory_license != companion_license:
        return False, "licence_inventaire_incoherente"
    return True, "ok"


def ingest(source_dir, output_dir, use_ocr=False, languages="deu+fra+ara",
           rights_inventory=None, repo_root="."):
    source_dir, output_dir = Path(source_dir), Path(output_dir)
    chunks, documents, skipped = [], [], []
    seen_document_ids = set()
    if not source_dir.is_dir():
        raise ValueError("dossier_source_invalide")
    rights_rows = load_rights_inventory(rights_inventory)
    for pdf in sorted(source_dir.rglob("*.pdf")):
        source_label = pdf.relative_to(source_dir).as_posix()
        meta = read_metadata(pdf)
        if not isinstance(meta, dict):
            skipped.append({"file": source_label, "reason": "metadonnees_absentes"})
            continue
        license_name = str(meta.get("licence", "")).strip().lower()
        if meta.get("droits_confirmes") is not True or license_name not in ALLOWED_LICENSES:
            skipped.append({"file": source_label, "reason": "droits_non_confirmes"})
            continue
        authorized, authorization_status = inventory_authorizes_pdf(
            pdf, repo_root, rights_rows, license_name
        )
        if not authorized:
            skipped.append({"file": source_label, "reason": authorization_status})
            continue
        pages, status = extract_pdf(pdf, use_ocr=use_ocr, languages=languages)
        if not status.startswith("ok"):
            skipped.append({"file": source_label, "reason": status})
            continue
        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        doc_id = "pdf-" + digest
        if not re.fullmatch(r"pdf-[a-f0-9]{64}", doc_id):
            skipped.append({"file": source_label, "reason": "identifiant_invalide"})
            continue
        if doc_id in seen_document_ids:
            skipped.append({"file": source_label, "reason": "contenu_pdf_duplique"})
            continue
        seen_document_ids.add(doc_id)
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
            "source_file": source_label, "sha256": digest,
            "license": license_name, "rights_confirmed": True,
            "subject": str(meta.get("matiere") or "allemand")[:80],
            "level": str(meta.get("niveau") or "")[:40],
            "chunk_count": doc_chunks, "extraction_status": status,
        })
    output_dir.mkdir(parents=True, exist_ok=True)
    chunks_path = output_dir / "assets/bdd/corpus_rag_chunks.json"
    manifest_path = output_dir / "assets/bdd/corpus_rag_manifest.json"
    chunks_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"version": 1, "documents": documents, "chunks": chunks}
    chunks_serialized = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    chunks_bytes = chunks_serialized.encode("utf-8")
    manifest = {
        "version": 1, "status": "connected_protected",
        "document_count": len(documents), "chunk_count": len(chunks),
        "chunks_sha256": hashlib.sha256(chunks_bytes).hexdigest(),
        "skipped": skipped,
        "note": "Artefact raccorde au RAG serveur ; lecture uniquement via le Worker du site protege par JWT/RLS. Les documents restent soumis a la validation de provenance et de licence.",
    }
    chunks_tmp = chunks_path.with_suffix(chunks_path.suffix + ".tmp")
    manifest_tmp = manifest_path.with_suffix(manifest_path.suffix + ".tmp")
    try:
        chunks_tmp.write_bytes(chunks_bytes)
        manifest_tmp.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        # Les deux fichiers sont entièrement sérialisés avant le remplacement des actifs.
        chunks_tmp.replace(chunks_path)
        manifest_tmp.replace(manifest_path)
    finally:
        chunks_tmp.unlink(missing_ok=True)
        manifest_tmp.unlink(missing_ok=True)
    return manifest


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir")
    parser.add_argument("--output-dir", default=".")
    parser.add_argument("--ocr", action="store_true")
    parser.add_argument("--ocr-languages", default="deu+fra+ara")
    parser.add_argument("--rights-inventory", default="docs/inventaire_pdf_droits.csv",
                        help="Inventaire humain des droits ; sans ligne confirmée, le PDF est ignoré")
    parser.add_argument("--repo-root", default=".",
                        help="Racine utilisée pour faire correspondre pdf_path à l’inventaire")
    args = parser.parse_args(argv)
    try:
        result = ingest(args.source_dir, args.output_dir, args.ocr, args.ocr_languages,
                        args.rights_inventory, args.repo_root)
    except (OSError, ValueError) as exc:
        print("ERREUR:", exc, file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
