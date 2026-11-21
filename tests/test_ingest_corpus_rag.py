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

    def test_duplicate_rights_keys_in_companion_metadata_fail_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp)
            companion = source / "_lesson.json"
            companion.write_text(
                '{"titre":"Lesson","licence":"cc_by",'
                '"droits_confirmes":false,"droits_confirmes":true}',
                encoding="utf-8",
            )
            self.assertIsNone(MODULE.read_metadata(source / "lesson.pdf"))

    def test_strict_json_loader_rejects_duplicate_nested_keys(self):
        with self.assertRaisesRegex(ValueError, "cle_json_duplique:droits_confirmes"):
            MODULE.strict_json_loads(
                '{"meta":{"droits_confirmes":false,"droits_confirmes":true}}'
            )

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

    def test_replacement_character_and_mojibake_are_rejected(self):
        self.assertEqual(MODULE.text_quality(("Deutsch " * 20) + "\ufffd")["reason"],
                         "caractere_remplacement_unicode")
        self.assertEqual(MODULE.text_quality(("Deutsch " * 20) + " Ã© Â© â€")["reason"],
                         "encodage_mojibake")

    def test_extraction_report_lists_omitted_pages_and_reasons(self):
        good = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(
            pages=[FakePage(good), FakePage(""), FakePage(("Deutsch " * 20) + "\ufffd")]
        ))
        with patch.dict(sys.modules, {"pypdf": fake}):
            pages, status, report = MODULE.extract_pdf_report("mixed.pdf")
        self.assertEqual(status, "ok")
        self.assertEqual(pages, [(1, good)])
        self.assertEqual(report["page_count"], 3)
        self.assertEqual(report["indexed_pages"], [1])
        self.assertEqual(report["omitted_pages"], [2, 3])
        self.assertEqual(report["quality"][2]["reason"], "caractere_remplacement_unicode")
        self.assertFalse(report["ocr_attempted"])

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
            self.assertEqual(data["documents"][0]["page_count"], 1)
            self.assertEqual(data["documents"][0]["indexed_pages"], [1])
            self.assertEqual(data["documents"][0]["omitted_pages"], [])
            self.assertFalse(data["documents"][0]["ocr_attempted"])
            manifest = json.loads((output / "assets/bdd/corpus_rag_manifest.json").read_text(encoding="utf-8"))
            chunks_raw = (output / "assets/bdd/corpus_rag_chunks.json").read_bytes()
            self.assertEqual(manifest["chunks_sha256"], MODULE.hashlib.sha256(chunks_raw).hexdigest())
            self.assertEqual(manifest["document_count"], len(data["documents"]))
            self.assertEqual(manifest["chunk_count"], len(data["chunks"]))

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

    def test_duplicate_inventory_headers_abort_before_writing_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            inventory = source / "rights.csv"
            inventory.write_text(
                "pdf_path,expected_companion_metadata,rights_confirmed,rights_confirmed,license\n"
                "lesson.pdf,_lesson.json,false,true,cc_by\n",
                encoding="utf-8",
            )
            with self.assertRaisesRegex(ValueError, "entetes_inventaire_droits_dupliquees"):
                MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertFalse((output / "assets/bdd/corpus_rag_chunks.json").exists())

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

    def test_identical_pdf_content_is_deduplicated_before_corpus_write(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir(parents=True)
            for name in ("lesson-a.pdf", "lesson-b.pdf"):
                pdf = source / name
                pdf.write_bytes(b"identical-pdf-bytes")
                (source / ("_" + pdf.stem + ".json")).write_text(json.dumps({
                    "titre": name, "licence": "cc_by", "droits_confirmes": True
                }), encoding="utf-8")
            fake = types.SimpleNamespace(PdfReader=lambda _path: types.SimpleNamespace(
                pages=[FakePage(" ".join(["Deutschunterricht"] * 30))]
            ))
            inventory = self.write_rights_inventory(source, ["lesson-a.pdf", "lesson-b.pdf"])
            with patch.dict(sys.modules, {"pypdf": fake}):
                result = MODULE.ingest(source, output, rights_inventory=inventory, repo_root=source)
            self.assertEqual(result["document_count"], 1)
            self.assertEqual(result["skipped"][0]["reason"], "contenu_pdf_duplique")
            data = json.loads((output / "assets/bdd/corpus_rag_chunks.json").read_text(encoding="utf-8"))
            self.assertEqual(data["documents"][0]["id"], "pdf-" + MODULE.hashlib.sha256(b"identical-pdf-bytes").hexdigest())

    def test_unconfirmed_rights_prevent_ocr_and_pdf_extraction(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, output = Path(tmp) / "source", Path(tmp) / "out"
            source.mkdir()
            pdf = source / "scanned.pdf"
            pdf.write_bytes(b"scanned-pdf")
            (source / "_scanned.json").write_text(json.dumps({
                "titre": "Scanned lesson", "licence": "cc_by",
                "droits_confirmes": True
            }), encoding="utf-8")
            inventory = self.write_rights_inventory(
                source, ["scanned.pdf"], rights=""
            )
            with patch.object(MODULE, "extract_pdf_report",
                              side_effect=AssertionError("extraction/OCR must not run")) as extract:
                result = MODULE.ingest(
                    source, output, use_ocr=True,
                    rights_inventory=inventory, repo_root=source
                )
            self.assertEqual(result["document_count"], 0)
            self.assertEqual(result["skipped"][0]["reason"],
                             "droits_non_confirmes_dans_inventaire")
            extract.assert_not_called()
            self.assertEqual(json.loads(
                (output / "assets/bdd/corpus_rag_chunks.json").read_text(encoding="utf-8")
            )["chunks"], [])

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
