#!/usr/bin/env python3
"""Lot 605 — vérifie le sharder corrigé sur une fixture temporaire multi-documents.

Depuis la racine du dépôt :
    python tests/sharder_fixture.py

Le script copie tools/sharder_index.py dans un répertoire temporaire, y écrit
un index synthétique, puis exécute le véritable fichier de production copié.
Aucun fichier assets/ du dépôt n'est lu ou modifié.
Le test doit être vert avec le sharder corrigé : il vérifie
les postings globaux et résoudre chaque posting vers le bon document.
"""
import json
import pathlib
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SHARDER = ROOT / "tools" / "sharder_index.py"


class SharderMultiDocumentFixture(unittest.TestCase):
    def test_global_postings_survive_and_resolve_to_their_document(self):
        fixture = {
            "chunks": [
                {"doc": "doc-A", "n": 0, "texte": "A chunk zero"},
                {"doc": "doc-A", "n": 1, "texte": "A chunk one"},
                {"doc": "doc-B", "n": 0, "texte": "B chunk zero"},
                {"doc": "doc-B", "n": 1, "texte": "B chunk one"},
            ],
            "termes": {
                "commun": [0, 1, 2, 3],
                "mot-b": [2, 3],
            },
        }

        with tempfile.TemporaryDirectory(prefix="allemand-sharder-") as tmp:
            work = pathlib.Path(tmp)
            (work / "tools").mkdir()
            bdd = work / "assets" / "bdd"
            bdd.mkdir(parents=True)
            shutil.copy2(SHARDER, work / "tools" / "sharder_index.py")
            (bdd / "corpus_index.json").write_text(
                json.dumps(fixture, ensure_ascii=False), encoding="utf-8"
            )

            run = subprocess.run(
                [sys.executable, "tools/sharder_index.py"],
                cwd=work, capture_output=True, text=True, check=False,
            )
            self.assertEqual(run.returncode, 0, run.stderr)

            shard_path = bdd / "shards" / "shard_00.json"
            shard = json.loads(shard_path.read_text(encoding="utf-8"))

            # Les postings globaux des chunks du document B ne doivent pas disparaître.
            self.assertEqual(
                shard["termes"].get("mot-b"), [2, 3],
                "postings globaux 2 et 3 perdus : le sharder les compare aux n locaux",
            )

            # Le shard doit exposer une identité globale, distincte de n local.
            by_global_id = {
                chunk.get("global_id"): chunk for chunk in shard["chunks"]
            }
            self.assertEqual(
                set(by_global_id), {0, 1, 2, 3},
                "chaque chunk doit conserver son identifiant global",
            )
            self.assertEqual(by_global_id[2]["doc"], "doc-B")
            self.assertEqual(by_global_id[3]["doc"], "doc-B")
            self.assertEqual(by_global_id[2]["n"], 0)
            self.assertEqual(by_global_id[3]["n"], 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
