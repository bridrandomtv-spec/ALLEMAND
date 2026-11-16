#!/usr/bin/env python3
"""Contrats isolés pour l'indexeur PDF et le partitionnement RAG."""
import importlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PdfIndexerContractTests(unittest.TestCase):
    def test_pdf_replacement_rebuilds_chunk_positions_and_rights(self):
        sys.path.insert(0, str(ROOT / "tools"))
        try:
            indexer = importlib.import_module("indexer_pdf")
            with tempfile.TemporaryDirectory() as tmp:
                work = Path(tmp)
                bdd = work / "assets" / "bdd"
                docs = work / "archive"
                bdd.mkdir(parents=True)
                docs.mkdir()
                (docs / "sample.pdf").write_bytes(b"fixture PDF")
                corpus = {"_meta": {"keep": True}, "items": [{"id": "keep"}],
                          "documents": [
                              {"id": "pdf-old", "titre": "Old PDF"},
                              {"id": "manual-other", "titre": "Other"}
                          ]}
                chunks = [
                    {"doc": "manual-other", "n": 0, "texte": "Andere Quelle bleibt"},
                    {"doc": "pdf-old", "n": 1, "texte": "Veralteter PDF Inhalt"}
                ]
                terms = {"andere": [0], "quelle": [0], "bleibt": [0],
                         "veralteter": [1], "inhalt": [1]}
                (bdd / "corpus.json").write_text(json.dumps(corpus), encoding="utf-8")
                (bdd / "corpus_chunks_index.json").write_text(json.dumps({
                    "version": "1.0.0", "schema": "rag-chunks-v1",
                    "chunks": chunks, "termes": terms
                }), encoding="utf-8")
                old_cwd = os.getcwd()
                old_pdf = indexer.texte_pdf
                try:
                    os.chdir(work)
                    indexer.texte_pdf = lambda _path: "Neuer Unterricht mit Schule und Sprache " * 30
                    indexer.main(str(docs))
                finally:
                    indexer.texte_pdf = old_pdf
                    os.chdir(old_cwd)

                after_corpus = json.loads((bdd / "corpus.json").read_text(encoding="utf-8"))
                after_index = json.loads((bdd / "corpus_chunks_index.json").read_text(encoding="utf-8"))
                self.assertEqual(after_corpus["_meta"], corpus["_meta"])
                self.assertEqual(after_corpus["items"], corpus["items"])
                self.assertEqual([c["doc"] for c in after_index["chunks"]],
                                 ["manual-other", "pdf-sample-pdf"])
                self.assertEqual([c["n"] for c in after_index["chunks"]], [0, 1])
                self.assertEqual(after_index["termes"]["andere"], [0])
                self.assertEqual(after_index["termes"]["neuer"], [1])
                pdf_doc = next(d for d in after_corpus["documents"] if d["id"] == "pdf-sample-pdf")
                self.assertEqual(pdf_doc["licence"], "non_verifiee")
                self.assertEqual(pdf_doc["droits_statut"], "a_verifier")
        finally:
            if str(ROOT / "tools") in sys.path:
                sys.path.remove(str(ROOT / "tools"))


class SharderContractTests(unittest.TestCase):
    def test_sharder_rejects_broken_chunk_positions_before_writing(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            bdd = work / "assets" / "bdd"
            bdd.mkdir(parents=True)
            (bdd / "corpus_chunks_index.json").write_text(json.dumps({
                "chunks": [{"doc": "d1", "n": 4, "texte": "Haus Schule"}],
                "termes": {"haus": [0]}
            }), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(ROOT / "tools" / "sharder_index.py")],
                cwd=work, capture_output=True, text=True
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("chunks[].n", result.stderr)


if __name__ == "__main__":
    unittest.main()
