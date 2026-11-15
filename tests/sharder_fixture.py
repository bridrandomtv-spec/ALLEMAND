#!/usr/bin/env python3
"""Lots 605–606 — tests isolés du sharder RAG.

Depuis la racine du dépôt :
    python tests/sharder_fixture.py

Chaque scénario copie le véritable tools/sharder_index.py dans un dossier
temporaire. Aucun fichier assets/ du dépôt n'est lu ou modifié.
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


class SharderFixture(unittest.TestCase):
    def run_sharder(self, index, seed_old_shard=False):
        tmp = tempfile.TemporaryDirectory(prefix="allemand-sharder-")
        work = pathlib.Path(tmp.name)
        (work / "tools").mkdir()
        bdd = work / "assets" / "bdd"
        bdd.mkdir(parents=True)
        out = bdd / "shards"
        out.mkdir()
        shutil.copy2(SHARDER, work / "tools" / "sharder_index.py")
        (bdd / "corpus_rag_index.json").write_text(
            json.dumps(index, ensure_ascii=False), encoding="utf-8"
        )
        old_shard = out / "shard_00.json"
        if seed_old_shard:
            old_shard.write_text('{"sentinel":"keep"}', encoding="utf-8")
        run = subprocess.run(
            [sys.executable, "tools/sharder_index.py"],
            cwd=work, capture_output=True, text=True, check=False,
        )
        return tmp, bdd, run, old_shard

    def test_global_postings_survive_across_documents(self):
        fixture = {
            "chunks": [
                {"global_id": 0, "doc": "doc-A", "n": 0},
                {"global_id": 1, "doc": "doc-A", "n": 1},
                {"global_id": 2, "doc": "doc-B", "n": 0},
                {"global_id": 3, "doc": "doc-B", "n": 1},
            ],
            "termes": {"commun": [0, 1, 2, 3], "mot-b": [2, 3]},
        }
        tmp, bdd, run, _ = self.run_sharder(fixture)
        with tmp:
            self.assertEqual(run.returncode, 0, run.stderr)
            shard = json.loads((bdd / "shards/shard_00.json").read_text(encoding="utf-8"))
            self.assertEqual(shard["termes"]["mot-b"], [2, 3])
            by_id = {c["global_id"]: c for c in shard["chunks"]}
            self.assertEqual(set(by_id), {0, 1, 2, 3})
            self.assertEqual([by_id[i]["doc"] for i in (2, 3)], ["doc-B", "doc-B"])

    def test_partition_boundary_250_and_manifest(self):
        chunks = [
            {"global_id": i, "doc": "doc-%d" % (i // 126), "n": i % 126}
            for i in range(252)
        ]
        fixture = {"chunks": chunks, "termes": {"frontiere": [249, 250, 251]}}
        tmp, bdd, run, _ = self.run_sharder(fixture)
        with tmp:
            self.assertEqual(run.returncode, 0, run.stderr)
            manifest = json.loads((bdd / "shards_manifest.json").read_text(encoding="utf-8"))
            self.assertEqual(manifest["version"], "2.0.0")
            self.assertEqual(manifest["nb_shards"], 2)
            self.assertEqual(manifest["total_chunks"], 252)
            self.assertEqual([s["nb_chunks"] for s in manifest["shards"]], [250, 2])

            shard0 = json.loads((bdd / "shards/shard_00.json").read_text(encoding="utf-8"))
            shard1 = json.loads((bdd / "shards/shard_01.json").read_text(encoding="utf-8"))
            self.assertEqual(shard0["termes"].get("frontiere"), [249])
            self.assertEqual(shard1["termes"].get("frontiere"), [250, 251])
            self.assertEqual(shard0["chunks"][-1]["global_id"], 249)
            self.assertEqual([c["global_id"] for c in shard1["chunks"]], [250, 251])

    def test_duplicate_global_id_fails_without_deleting_previous_shard(self):
        fixture = {
            "chunks": [
                {"global_id": 7, "doc": "A", "n": 0},
                {"global_id": 7, "doc": "B", "n": 0},
            ],
            "termes": {"x": [7]},
        }
        tmp, _, run, old_shard = self.run_sharder(fixture, seed_old_shard=True)
        with tmp:
            self.assertNotEqual(run.returncode, 0, "un global_id dupliqué doit être rejeté")
            self.assertEqual(old_shard.read_text(encoding="utf-8"), '{"sentinel":"keep"}')

    def test_orphan_posting_fails_without_deleting_previous_shard(self):
        fixture = {
            "chunks": [{"global_id": 0, "doc": "A", "n": 0}],
            "termes": {"orphan": [999]},
        }
        tmp, _, run, old_shard = self.run_sharder(fixture, seed_old_shard=True)
        with tmp:
            self.assertNotEqual(run.returncode, 0, "un posting orphelin doit être rejeté")
            self.assertEqual(old_shard.read_text(encoding="utf-8"), '{"sentinel":"keep"}')


if __name__ == "__main__":
    unittest.main(verbosity=2)
