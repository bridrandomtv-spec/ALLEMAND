import importlib.util
import json
import math
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "build_corpus_rag_vectors.py"
SPEC = importlib.util.spec_from_file_location("build_corpus_rag_vectors", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def fixture():
    corpus = {
        "version": 1,
        "documents": [
            {"id": "doc-ok", "title": "Deutsch", "license": "production_propre", "rights_confirmed": True},
            {"id": "doc-no", "title": "Locked", "license": "inconnue", "rights_confirmed": False},
        ],
        "chunks": [
            {"id": "c1", "document_id": "doc-ok", "text": "Ein deutscher Beispielsatz."},
            {"id": "c2", "document_id": "doc-no", "text": "Ne doit pas être envoyé."},
        ],
    }
    manifest = {"version": 1, "document_count": 2, "chunk_count": 2}
    return corpus, manifest


class VectorBuilderTests(unittest.TestCase):
    def test_duplicate_document_ids_fail_closed_even_when_rights_differ(self):
        corpus, manifest = fixture()
        corpus["documents"].append({
            "id": "doc-ok", "title": "Collision", "license": "inconnue",
            "rights_confirmed": False,
        })
        manifest["document_count"] = len(corpus["documents"])
        with self.assertRaisesRegex(ValueError, "document_id_duplique"):
            MODULE.eligible_chunks(corpus, manifest)

    def test_duplicate_chunk_ids_fail_closed_across_authorized_and_locked_docs(self):
        corpus, manifest = fixture()
        corpus["chunks"][1]["id"] = "c1"
        with self.assertRaisesRegex(ValueError, "chunk_id_absent_ou_duplique"):
            MODULE.eligible_chunks(corpus, manifest)

    def test_chunk_without_document_id_fails_closed(self):
        corpus, manifest = fixture()
        del corpus["chunks"][1]["document_id"]
        with self.assertRaisesRegex(ValueError, "chunk_document_id_absent"):
            MODULE.eligible_chunks(corpus, manifest)

    def test_rights_filter_happens_before_embedding(self):
        corpus, manifest = fixture()
        chunks = MODULE.eligible_chunks(corpus, manifest)
        self.assertEqual([item["chunk_id"] for item in chunks], ["c1"])
        self.assertNotIn("Ne doit pas être envoyé.", MODULE.document_input(chunks[0]))

    def test_manifest_count_mismatch_fails_closed(self):
        corpus, manifest = fixture()
        manifest["chunk_count"] = 1
        with self.assertRaisesRegex(ValueError, "manifest_chunk_count"):
            MODULE.eligible_chunks(corpus, manifest)

    def test_normalization_is_l2_and_rejects_non_finite(self):
        result = MODULE.normalize_embedding([3.0] + [0.0] * 255)
        self.assertAlmostEqual(math.sqrt(sum(x*x for x in result)), 1.0)
        with self.assertRaisesRegex(ValueError, "non_fini"):
            MODULE.normalize_embedding([float("nan")] + [0.0] * 255)

    def test_wrong_dimension_fails(self):
        with self.assertRaisesRegex(ValueError, "dimension"):
            MODULE.normalize_embedding([0.1] * 255)

    def test_api_indices_are_checked_and_ordered(self):
        a, b = [1.0] + [0.0] * 255, [0.0, 1.0] + [0.0] * 254
        parsed = MODULE.parse_embeddings({"data": [
            {"index": 1, "embedding": b}, {"index": 0, "embedding": a}
        ]}, 2)
        self.assertEqual(parsed[0][0], 1.0)
        self.assertEqual(parsed[1][1], 1.0)
        with self.assertRaisesRegex(ValueError, "index_duplique"):
            MODULE.parse_embeddings({"data": [
                {"index": 0, "embedding": a}, {"index": 0, "embedding": b}
            ]}, 2)

    def test_batching_and_output_metadata(self):
        corpus, manifest = fixture()
        chunks = MODULE.eligible_chunks(corpus, manifest)
        seen = []
        def fake_embed(inputs):
            seen.extend(inputs)
            return [[1.0] + [0.0] * 255 for _ in inputs]
        artifact = MODULE.build_artifact(
            chunks, b"chunks", b"manifest", fake_embed, batch_size=1
        )
        self.assertEqual(len(seen), 1)
        self.assertEqual(artifact["vectors"][0]["chunk_id"], "c1")
        self.assertEqual(artifact["vectors"][0]["document_id"], "doc-ok")
        self.assertNotIn("doc_id", artifact["vectors"][0])
        self.assertEqual(artifact["normalization"], "l2")
        self.assertEqual(artifact["source_chunks_sha256"], MODULE.sha256_bytes(b"chunks"))

    def test_empty_authorized_corpus_does_not_call_embedding(self):
        corpus, manifest = fixture()
        corpus["documents"] = []
        corpus["chunks"] = []
        manifest.update(document_count=0, chunk_count=0)
        chunks = MODULE.eligible_chunks(corpus, manifest)
        with patch.object(MODULE, "call_cloudflare") as api:
            self.assertEqual(chunks, [])
            api.assert_not_called()

    def test_default_cli_is_dry_run_and_never_calls_api(self):
        corpus, manifest = fixture()
        with tempfile.TemporaryDirectory() as tmp:
            chunks_path, manifest_path = Path(tmp)/"chunks.json", Path(tmp)/"manifest.json"
            output = Path(tmp)/"vectors.json"
            chunks_path.write_text(json.dumps(corpus), encoding="utf-8")
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
            with patch.object(MODULE, "call_cloudflare") as api:
                code = MODULE.main([
                    "--chunks", str(chunks_path), "--manifest", str(manifest_path),
                    "--output", str(output)
                ])
            self.assertEqual(code, 0)
            api.assert_not_called()
            self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
