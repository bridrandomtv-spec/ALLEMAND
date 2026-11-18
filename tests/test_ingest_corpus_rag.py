import csv
import importlib.util
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "ingest_corpus_rag.py"
SPEC = importlib.util.spec_from_file_location("ingest_corpus_rag", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class FakePage:
    def __init__(self, text):
        self.text = text
    def extract_text(self):
        return self.text


class PdfIngestionTests(unittest.TestCase):
    def write_rights_inventory(self, source, pdf_paths, license_name="cc_by", rights="true"):
        inventory = source / "rights-inventory.csv"
        with inventory.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=[
                "pdf_path", "expected_companion_metadata", "rights_confirmed", "license",
                "review_status",
            ])
            writer.writeheader()
            for pdf_path in pdf_paths:
                pdf = source / pdf_path
                writer.writerow({
                    "pdf_path": pdf_path,
                    "expected_companion_metadata": (
                        (pdf.parent / ("_" + pdf.stem + ".json")).relative_to(source).as_posix()
                    ),
                    "rights_confirmed": rights,
                    "license": license_name,
                    "review_status": "confirmé" if rights == "true" else "à vérifier",
                })
        return inventory

    def test_text_pdf_extracts_pages_and_preserves_page_numbers(self):
        page_text = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(pages=[FakePage(page_text)]))
        with patch.dict(sys.modules, {"pypdf": fake}):
            pages, status = MODULE.extract_pdf("dummy.pdf")
        self.assertEqual(status, "ok")
        self.assertEqual(pages, [(1, page_text)])

    def test_scan_pdf_uses_real_ocr_when_enabled(self):
        fake_pdf = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(pages=[FakePage("")]))
        fake_images = types.SimpleNamespace(convert_from_path=lambda *_a, **_k: ["image-page"])
        fake_ocr = types.SimpleNamespace(image_to_string=lambda _img, lang: " ".join(["OCRDeutsch"] * 30))
        with patch.dict(sys.modules, {"pypdf": fake_pdf, "pdf2image": fake_images, "pytesseract": fake_ocr}):
            with patch.object(MODULE.shutil, "which", return_value="/usr/bin/tesseract"):
                pages, status = MODULE.extract_pdf("scan.pdf", use_ocr=True)
        self.assertEqual(status, "ok")
        self.assertEqual(pages[0][0], 1)
        self.assertIn("OCRDeutsch", pages[0][1])

    def test_scanned_pdf_without_ocr_is_rejected_not_silently_indexed(self):
        fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(pages=[FakePage("")]))
        with patch.dict(sys.modules, {"pypdf": fake}):
            pages, status = MODULE.extract_pdf("scan.pdf", use_ocr=False)
        self.assertEqual(pages, [])
        self.assertIn("aucun_texte_exploitable", status)

    def test_ocr_unavailable_keeps_other_pages_with_valid_text(self):
        good = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(
            pages=[FakePage(good), FakePage("")]
        ))
        with patch.dict(sys.modules, {"pypdf": fake}):
            with patch.object(MODULE, "_ocr_pages", side_effect=RuntimeError("tesseract_absent")):
                pages, status = MODULE.extract_pdf("mixed.pdf", use_ocr=True)
        self.assertEqual(pages, [(1, good)])
        self.assertIn("ok_partiel:tesseract_absent", status)

    def test_corrupt_glyph_encoding_is_rejected(self):
        self.assertFalse(MODULE.text_quality("/g39/g72/g91 " * 20)["ok"])

    def test_control_characters_are_rejected(self):
        self.assertFalse(MODULE.text_quality(("\x01" * 20) + ("Deutsch " * 30))["ok"])

    def test_no_rights_metadata_means_no_indexing_and_no_legacy_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir()
            (source / "owned.pdf").write_bytes(b"test-pdf")
            (output / "assets/bdd").mkdir(parents=True)
            legacy = output / "assets/bdd/corpus_index.json"
            legacy.write_text('{"items":[{"word":"Haus"}]}', encoding="utf-8")
            result = MODULE.ingest(source, output)
            self.assertEqual(result["document_count"], 0)
            self.assertEqual(result["skipped"][0]["reason"], "metadonnees_absentes")
            self.assertEqual(json.loads(legacy.read_text(encoding="utf-8"))["items"][0]["word"], "Haus")
            self.assertTrue((output / "assets/bdd/corpus_rag_chunks.json").is_file())

    def test_recursive_scan_indexes_nested_pdf_with_companion_rights_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            nested = source / "archive" / "unit"
            nested.mkdir(parents=True)
            pdf = nested / "lesson.pdf"
            pdf.write_bytes(b"nested-pdf")
            (nested / "_lesson.json").write_text(json.dumps({
                "titre": "Nested lesson", "licence": "cc_by",
                "droits_confirmes": True, "niveau": "3AS"
            }), encoding="utf-8")
            fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(
                pages=[FakePage(" ".join(["Deutschunterricht"] * 30))]
            ))
            inventory = self.write_rights_inventory(source, ["archive/unit/lesson.pdf"])
            with patch.dict(sys.modules, {"pypdf": fake}):
                result = MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertEqual(result["document_count"], 1)
            data = json.loads((output / "assets/bdd/corpus_rag_chunks.json").read_text(encoding="utf-8"))
            self.assertEqual(data["documents"][0]["source_file"], "archive/unit/lesson.pdf")

    def test_companion_alone_never_authorizes_without_inventory_row(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            pdf = source / "lesson.pdf"
            pdf.write_bytes(b"lesson")
            (source / "_lesson.json").write_text(json.dumps({
                "titre": "Lesson", "licence": "cc_by", "droits_confirmes": True
            }), encoding="utf-8")
            result = MODULE.ingest(source, output, repo_root=source)
            self.assertEqual(result["document_count"], 0)
            self.assertEqual(result["skipped"][0]["reason"], "inventaire_droits_absent")

    def test_duplicate_inventory_paths_abort_before_writing_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            inventory = source / "rights.csv"
            inventory.write_text(
                "pdf_path,expected_companion_metadata,rights_confirmed,license\n"
                "lesson.pdf,_lesson.json,true,cc_by\n"
                "lesson.pdf,_lesson.json,true,cc_by\n",
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ValueError, "pdf_droits_inventaire_duplique"):
                MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertFalse((output / "assets/bdd/corpus_rag_manifest.json").exists())

    def test_inventory_and_companion_must_confirm_same_license(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            pdf = source / "lesson.pdf"
            pdf.write_bytes(b"lesson")
            (source / "_lesson.json").write_text(json.dumps({
                "titre": "Lesson", "licence": "cc_by", "droits_confirmes": True
            }), encoding="utf-8")
            inventory = self.write_rights_inventory(source, ["lesson.pdf"], license_name="cc_by_sa")
            result = MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertEqual(result["document_count"], 0)
            self.assertEqual(result["skipped"][0]["reason"], "licence_inventaire_incoherente")

    def test_inventory_blank_confirmation_blocks_companion_claim(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            pdf = source / "lesson.pdf"
            pdf.write_bytes(b"lesson")
            (source / "_lesson.json").write_text(json.dumps({
                "titre": "Lesson", "licence": "cc_by", "droits_confirmes": True
            }), encoding="utf-8")
            inventory = self.write_rights_inventory(source, ["lesson.pdf"], rights="")
            result = MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertEqual(result["document_count"], 0)
            self.assertEqual(result["skipped"][0]["reason"], "droits_non_confirmes_dans_inventaire")

    def test_confirmed_license_indexes_only_approved_document(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir()
            pdf = source / "lesson.pdf"
            pdf.write_bytes(b"test-pdf-content")
            (source / "_lesson.json").write_text(json.dumps({
                "titre": "Deutsch lesson", "licence": "production_propre",
                "droits_confirmes": True, "niveau": "2AS"
            }), encoding="utf-8")
            fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(
                pages=[FakePage(" ".join(["Deutschunterricht"] * 30))]
            ))
            inventory = self.write_rights_inventory(source, ["lesson.pdf"], license_name="production_propre")
            with patch.dict(sys.modules, {"pypdf": fake}):
                result = MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertEqual(result["document_count"], 1)
            self.assertEqual(result["status"], "connected_protected")
            data = json.loads((output / "assets/bdd/corpus_rag_chunks.json").read_text(encoding="utf-8"))
            self.assertEqual(data["documents"][0]["license"], "production_propre")
            self.assertEqual(data["chunks"][0]["page"], 1)


if __name__ == "__main__":
    unittest.main()
