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
