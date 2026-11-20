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
    def test_legacy_ingest_skips_pdf_without_extracting_or_copying_it(self):
        module = load_tool("legacy_ingest_corpus", "tools/ingest_corpus.py")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source"
            source.mkdir()
            pdf = source / "unverified.pdf"
            pdf.write_bytes(b"%PDF-1.4 fake")
            previous = Path.cwd()
            try:
                os.chdir(root)
                with patch.object(module, "texte_pdf",
                                  side_effect=AssertionError("PDF extraction must not run")) as extract:
                    module.main(str(source))
                extract.assert_not_called()
                self.assertFalse((root / "assets/corpus").exists())
                self.assertEqual(
                    __import__("json").loads(
                        (root / "assets/bdd/corpus.json").read_text(encoding="utf-8")
                    )["documents"],
                    [],
                )
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
