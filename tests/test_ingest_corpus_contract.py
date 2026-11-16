#!/usr/bin/env python3
"""Tests de contrat isolés : l'ingestion ne doit jamais écraser les données BIBLIO."""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "ingest_corpus.py"


class IngestionContractTests(unittest.TestCase):
    def test_ingestion_preserves_legacy_register_and_vocabulary(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            bdd = work / "assets" / "bdd"
            docs = work / "input"
            docs.mkdir()
            bdd.mkdir(parents=True)
            historic_items = [{"id": "historic-item", "titre": "À conserver"}]
            vocabulary = {"_meta": "BIBLIO vocabulary fixture", "items": [{"n": 1, "de": "Haus", "ar": "بيت"}]}
            corpus = {"_meta": {"version": "historic"}, "documents": [], "items": historic_items}
            (bdd / "corpus.json").write_text(json.dumps(corpus), encoding="utf-8")
            (bdd / "corpus_index.json").write_text(json.dumps(vocabulary), encoding="utf-8")
            (bdd / "corpus_chunks_index.json").write_text(json.dumps({
                "version": "1.0.0", "schema": "rag-chunks-v1",
                "chunks": [{"doc": "pdf-existing", "n": 0, "texte": "Altes Dokument erhalten"}],
                "termes": {"altes": [0], "dokument": [0], "erhalten": [0]}
            }), encoding="utf-8")
            (docs / "lesson.txt").write_text("Haus Schule lernen " * 80, encoding="utf-8")
            (docs / "_lesson.json").write_text(json.dumps({
                "titre": "Leçon fixture", "matiere": "allemand", "niveau": "2AS",
                "type": "cours", "source": "fixture de test", "licence": "fixture"
            }), encoding="utf-8")

            env = dict(os.environ)
            subprocess.run([sys.executable, str(SCRIPT), str(docs)], cwd=work,
                           env=env, check=True, capture_output=True, text=True)

            after_corpus = json.loads((bdd / "corpus.json").read_text(encoding="utf-8"))
            after_vocab = json.loads((bdd / "corpus_index.json").read_text(encoding="utf-8"))
            chunks_path = bdd / "corpus_chunks_index.json"
            self.assertEqual(after_corpus["items"], historic_items)
            self.assertEqual(after_vocab, vocabulary)
            self.assertEqual(after_corpus["_meta"], corpus["_meta"])
            self.assertEqual(len(after_corpus["documents"]), 1)
            self.assertTrue(chunks_path.exists())
            chunks_index = json.loads(chunks_path.read_text(encoding="utf-8"))
            self.assertEqual(chunks_index["schema"], "rag-chunks-v1")
            self.assertEqual(len(chunks_index["chunks"]), 2)
            self.assertEqual(chunks_index["chunks"][0]["doc"], "pdf-existing")
            self.assertEqual([c["n"] for c in chunks_index["chunks"]], [0, 1])
            self.assertIn(0, chunks_index["termes"]["altes"])
            self.assertIn(1, chunks_index["termes"]["haus"])


if __name__ == "__main__":
    unittest.main()
