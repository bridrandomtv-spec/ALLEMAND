import importlib.util
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]


def load_tool(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class LegacyPdfIngestionGuardTests(unittest.TestCase):
    def test_legacy_ingest_refuses_all_formats_before_extracting_or_writing(self):
        module = load_tool("legacy_ingest_corpus", "tools/ingest_corpus.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source"
            source.mkdir()
            for name in ("unverified.pdf", "unverified.docx", "unverified.txt", "unverified.md"):
                (source / name).write_bytes(b"unverified document")
            previous = Path.cwd()
            try:
                os.chdir(root)
                with patch.object(module, "texte_pdf",
                                  side_effect=AssertionError("PDF extraction must not run")) as pdf_extract, \
                     patch.object(module, "texte_docx",
                                  side_effect=AssertionError("DOCX extraction must not run")) as docx_extract, \
                     patch.object(module, "texte_brut",
                                  side_effect=AssertionError("text extraction must not run")) as text_extract:
                    with self.assertRaisesRegex(SystemExit, "ingest_corpus_desactive"):
                        module.main(str(source))
                pdf_extract.assert_not_called()
                docx_extract.assert_not_called()
                text_extract.assert_not_called()
                self.assertFalse((root / "assets/corpus").exists())
                self.assertFalse((root / "assets/bdd/corpus.json").exists())
                self.assertFalse((root / "assets/bdd/corpus_index.json").exists())
            finally:
                os.chdir(previous)

    def test_historical_pdf_indexer_stops_before_reading_or_mutating_corpus(self):
        module = load_tool("legacy_indexer_pdf", "tools/indexer_pdf.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "pdfs"
            source.mkdir()
            (source / "unverified.pdf").write_bytes(b"%PDF-1.4 fake")
            previous = Path.cwd()
            try:
                os.chdir(root)
                with self.assertRaisesRegex(SystemExit, "indexer_pdf_desactive"):
                    module.main(str(source))
                self.assertFalse((root / "assets/bdd/corpus.json").exists())
                self.assertFalse((root / "assets/bdd/corpus_index.json").exists())
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
