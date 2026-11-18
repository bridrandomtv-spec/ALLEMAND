import csv
import importlib.util
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "audit_pdf_text_readiness.py"
SPEC = importlib.util.spec_from_file_location("audit_pdf_text_readiness", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class FakePage:
    def __init__(self, text):
        self.text = text

    def extract_text(self):
        return self.text


class PdfTextReadinessTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "lesson.pdf").write_bytes(b"%PDF-test")

    def tearDown(self):
        self.tmp.cleanup()

    def fake_reader(self, pages, encrypted=False):
        return types.SimpleNamespace(pages=pages, is_encrypted=encrypted)

    def test_text_pdf_is_classified_extractable_without_retaining_text(self):
        text = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: self.fake_reader([FakePage(text)]))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_pdf(self.root / "lesson.pdf")
        self.assertEqual(result["status"], "extractable")
        self.assertEqual(result["pages_with_text"], 1)
        self.assertNotIn("text", result)

    def test_scan_pdf_is_flagged_as_ocr_candidate_without_running_ocr(self):
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: self.fake_reader([FakePage("")]))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_pdf(self.root / "lesson.pdf")
        self.assertEqual(result["status"], "ocr_candidate")
        self.assertEqual(result["pages_without_text"], 1)

    def test_mixed_pdf_counts_text_and_scan_pages(self):
        text = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: self.fake_reader([FakePage(text), FakePage("")]))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_pdf(self.root / "lesson.pdf")
        self.assertEqual(result["status"], "mixed")
        self.assertEqual(result["pages_with_text"], 1)
        self.assertEqual(result["pages_without_text"], 1)

    def test_encrypted_pdf_is_not_opened_for_extraction(self):
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: self.fake_reader([], encrypted=True))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_pdf(self.root / "lesson.pdf")
        self.assertEqual(result["status"], "encrypted")

    def test_unreadable_pdf_is_reported_without_crashing_the_audit(self):
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: (_ for _ in ()).throw(ValueError("bad pdf")))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_pdf(self.root / "lesson.pdf")
        self.assertEqual(result["status"], "unreadable")
        self.assertEqual(result["error"], "ValueError")

    def test_csv_report_contains_metadata_only_and_stays_outside_source(self):
        text = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda *_a, **_k: self.fake_reader([FakePage(text)]))
        output = self.root.parent / (self.root.name + "-audit.csv")
        try:
            with patch.dict(sys.modules, {"pypdf": fake}):
                result = MODULE.audit_directory(self.root)
            MODULE.write_csv_report(result, output, self.root)
            with output.open(encoding="utf-8", newline="") as handle:
                rows = list(csv.DictReader(handle))
            self.assertEqual(rows[0]["pdf_path"], "lesson.pdf")
            self.assertEqual(rows[0]["status"], "extractable")
            self.assertNotIn("Deutschunterricht", output.read_text(encoding="utf-8"))
        finally:
            output.unlink(missing_ok=True)

    def test_rights_inventory_is_joined_by_exact_path_without_inference(self):
        inventory = self.root.parent / (self.root.name + "-rights.csv")
        inventory.write_text(
            "pdf_path,expected_companion_metadata,rights_confirmed,license,review_status\n"
            "lesson.pdf,_lesson.json,,,à vérifier\n"
            "missing.pdf,_missing.json,true,cc_by,confirmé\n",
            encoding="utf-8",
        )
        try:
            rows, summary = MODULE.merge_rights_inventory(
                [{"pdf_path": "lesson.pdf", "status": "extractable", "pages": 2}],
                inventory,
            )
            self.assertEqual(len(rows), 2)
            lesson = next(row for row in rows if row["pdf_path"] == "lesson.pdf")
            missing = next(row for row in rows if row["pdf_path"] == "missing.pdf")
            self.assertEqual(lesson["rights_confirmed"], "")
            self.assertEqual(lesson["license"], "")
            self.assertEqual(lesson["rights_inventory_match"], "présent_dans_inventaire")
            self.assertEqual(missing["status"], "pdf_absent_du_corpus_audite")
            self.assertEqual(summary["matched_paths"], 1)
            self.assertEqual(summary["inventory_without_pdf"], 1)
            self.assertFalse(summary["rights_inferred"])
        finally:
            inventory.unlink(missing_ok=True)

    def test_csv_report_writes_joined_rights_rows_and_orphan_paths(self):
        inventory = self.root.parent / (self.root.name + "-csv-rights.csv")
        output = self.root.parent / (self.root.name + "-joined.csv")
        inventory.write_text(
            "pdf_path,expected_companion_metadata,rights_confirmed,license,review_status\n"
            "lesson.pdf,_lesson.json,,,à vérifier\n"
            "missing.pdf,_missing.json,,,à examiner\n",
            encoding="utf-8",
        )
        result = {"files": [{
            "pdf_path": "lesson.pdf", "status": "extractable", "pages": 3,
            "pages_with_text": 3, "pages_without_text": 0,
            "extractable_chars": 900, "error": "",
        }]}
        try:
            MODULE.write_csv_report(result, output, self.root, inventory)
            with output.open(encoding="utf-8", newline="") as handle:
                rows = list(csv.DictReader(handle))
            self.assertEqual(len(rows), 2)
            lesson = next(row for row in rows if row["pdf_path"] == "lesson.pdf")
            orphan = next(row for row in rows if row["pdf_path"] == "missing.pdf")
            self.assertEqual(lesson["rights_inventory_match"], "présent_dans_inventaire")
            self.assertEqual(lesson["rights_confirmed"], "")
            self.assertEqual(orphan["status"], "pdf_absent_du_corpus_audite")
            self.assertEqual(orphan["rights_inventory_match"], "présent_dans_inventaire")
        finally:
            inventory.unlink(missing_ok=True)
            output.unlink(missing_ok=True)

    def test_rights_inventory_rejects_duplicate_paths(self):
        inventory = self.root.parent / (self.root.name + "-duplicate-rights.csv")
        inventory.write_text(
            "pdf_path,expected_companion_metadata,rights_confirmed,license,review_status\n"
            "lesson.pdf,_lesson.json,,,à vérifier\n"
            "lesson.pdf,_lesson.json,true,cc_by,confirmé\n",
            encoding="utf-8",
        )
        try:
            with self.assertRaisesRegex(ValueError, "chemin_inventaire_duplique"):
                MODULE.merge_rights_inventory([], inventory)
        finally:
            inventory.unlink(missing_ok=True)

    def test_csv_report_refuses_to_write_inside_pdf_source(self):
        result = {"files": []}
        with self.assertRaisesRegex(ValueError, "rapport_doit_rester_hors_corpus"):
            MODULE.write_csv_report(result, self.root / "report.csv", self.root)

    def test_recursive_audit_counts_files_and_never_claims_rights_or_indexing(self):
        (self.root / "nested").mkdir()
        (self.root / "nested" / "scan.pdf").write_bytes(b"%PDF-test")
        text = " ".join(["Deutschunterricht"] * 30)
        fake = types.SimpleNamespace(PdfReader=lambda path, **_k: self.fake_reader(
            [FakePage("")] if str(path).endswith("scan.pdf") else [FakePage(text)]
        ))
        with patch.dict(sys.modules, {"pypdf": fake}):
            result = MODULE.audit_directory(self.root)
        self.assertEqual(result["summary"]["pdf_count"], 2)
        self.assertEqual(result["summary"]["files_by_status"]["ocr_candidate"], 1)
        self.assertFalse(result["summary"]["rights_verified"])
        self.assertFalse(result["summary"]["rag_indexed"])
        self.assertTrue(result["summary"]["text_is_not_saved"])


if __name__ == "__main__":
    unittest.main()
