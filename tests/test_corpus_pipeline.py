import importlib.util
import hashlib
import json
import os
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

indexer = load_module("tools/indexer_pdf.py", "indexer_pdf")
sharder = load_module("tools/sharder_index.py", "sharder_index")
rights = load_module("tools/rights_metadata.py", "rights_metadata")
contracts = load_module("tools/corpus_contracts.py", "corpus_contracts")
ingest = load_module("tools/ingest_corpus.py", "ingest_corpus")

class CorpusPipelineContract(unittest.TestCase):
    def test_pdf_indexer_keeps_biblio_catalogue_separate(self):
        self.assertEqual(indexer.INDEX, "assets/bdd/corpus_rag_index.json")
        self.assertNotEqual(indexer.INDEX, "assets/bdd/corpus_index.json")

    def test_missing_license_is_not_an_authorized_default(self):
        self.assertNotIn("", indexer.LICENCES_AUTORISEES)
        self.assertNotIn("document utilisateur", indexer.LICENCES_AUTORISEES)

    def test_license_label_alone_is_not_enough(self):
        self.assertFalse(rights.valider_metadonnees({"licence": "production_propre"})[0])

    def test_verified_author_declaration_is_accepted(self):
        meta = {
            "licence": "production_propre",
            "source": "Cours rédigé par l'enseignant",
            "titulaire_droits": "Auteur du cours",
            "declarant": "Auteur du cours",
            "date_declaration": "2026-11-15",
            "declaration_droits": True,
            "usages_autorises": ["hebergement_source", "extraction_texte", "indexation_rag", "restitution_extraits"],
            "validation": {
                "statut": "valide", "verificateur": "Responsable pédagogique",
                "date": "2026-11-15", "reference_preuve": "declaration-interne-001"
            }
        }
        self.assertTrue(rights.valider_metadonnees(meta)[0])

    def test_ingestion_requires_explicit_exploitation_scope(self):
        meta = self._metadata_authorisee()
        del meta["usages_autorises"]
        self.assertFalse(rights.valider_metadonnees(meta)[0])

    def test_ingestion_rejects_incomplete_or_unknown_scope(self):
        meta = self._metadata_authorisee()
        meta["usages_autorises"] = ["indexation_rag", "restitution_extraits"]
        self.assertFalse(rights.valider_metadonnees(meta)[0])
        meta["usages_autorises"] = [
            "hebergement_source", "extraction_texte", "indexation_rag",
            "restitution_extraits", "usage_invente"
        ]
        self.assertFalse(rights.valider_metadonnees(meta)[0])

    def test_full_document_redistribution_is_not_implicitly_granted(self):
        meta = self._metadata_authorisee()
        self.assertTrue(rights.valider_metadonnees(meta)[0])
        self.assertNotIn("redistribution_document", meta["usages_autorises"])

    def test_missing_human_validation_is_rejected(self):
        meta = {
            "licence": "production_propre", "source": "cours",
            "titulaire_droits": "auteur", "declarant": "auteur",
            "date_declaration": "2026-11-15", "declaration_droits": True
        }
        self.assertFalse(rights.valider_metadonnees(meta)[0])


    def test_pdf_chunks_keep_page_boundaries(self):
        chunks = contracts.decouper_pages(["un deux trois", "quatre cinq"], taille=2)
        self.assertEqual([(c["page_start"], c["page_end"]) for c in chunks],
                         [(1, 1), (1, 1), (2, 2)])
        self.assertEqual(chunks[0]["texte"], "un deux")

    def test_pdf_chunks_never_cross_page(self):
        chunks = contracts.decouper_pages(["a b", "c d"], taille=10)
        self.assertEqual(len(chunks), 2)
        self.assertEqual([c["texte"] for c in chunks], ["a b", "c d"])

    def test_document_merge_preserves_unmentioned_documents(self):
        merged = contracts.fusionner_documents(
            [{"id": "old", "titre": "Ancien"}, {"id": "same", "titre": "V1"}],
            [{"id": "same", "titre": "V2"}, {"id": "new", "titre": "Nouveau"}]
        )
        self.assertEqual([d["id"] for d in merged], ["old", "same", "new"])
        self.assertEqual(merged[1]["titre"], "V2")

    def test_chunk_requires_valid_sha256_and_single_page_range(self):
        digest = "a" * 64
        chunk = contracts.construire_chunk(0, "doc", 0, "texte", digest, 3, 3)
        self.assertEqual(chunk["page_start"], 3)
        with self.assertRaises(ValueError):
            contracts.construire_chunk(0, "doc", 0, "texte", "bad", 3, 3)
        with self.assertRaises(ValueError):
            contracts.construire_chunk(0, "doc", 0, "texte", digest, 3, 4)

    def test_sharder_preserves_and_validates_page_provenance(self):
        chunk = {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha beta",
                 "page_start": 2, "page_end": 2, "source_sha256": "b" * 64}
        shards, _ = sharder.build_shards({"chunks": [chunk], "termes": {"alpha": [0]}})
        self.assertEqual(shards[0]["chunks"][0], chunk)
        bad = dict(chunk, page_end=3)
        with self.assertRaises(ValueError):
            sharder.build_shards({"chunks": [bad], "termes": {"alpha": [0]}})


    def _metadata_authorisee(self):
        return {
            "licence": "production_propre", "source": "PDF de test synthétique",
            "titulaire_droits": "Auteur du test", "declarant": "Auteur du test",
            "date_declaration": "2026-11-15", "declaration_droits": True,
            "usages_autorises": ["hebergement_source", "extraction_texte", "indexation_rag", "restitution_extraits"],
            "validation": {"statut": "valide", "verificateur": "Test",
                           "date": "2026-11-15", "reference_preuve": "fixture-test"}
        }

    def test_multiformat_ingestion_merges_catalogue_and_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = os.path.join(tmp, "cours.txt")
            with open(source, "w", encoding="utf-8") as stream:
                stream.write(" ".join(["contenu"] * 35))
            with open(os.path.join(tmp, "_cours.json"), "w", encoding="utf-8") as stream:
                json.dump(self._metadata_authorisee(), stream)
            catalogue, index, ignores, copies = ingest.construire(
                tmp, [{"id": "ancien", "titre": "Conservé"}])
            self.assertEqual(ignores, 0)
            self.assertIn("ancien", [d["id"] for d in catalogue])
            self.assertEqual(len(copies), 1)
            self.assertTrue(index["chunks"][0]["source_sha256"])
            merged = contracts.fusionner_index_rag(
                {"_meta": {}, "chunks": [
                    {"global_id": 0, "doc": "ancien", "n": 0, "texte": "alpha beta"},
                    {"global_id": 1, "doc": catalogue[-1]["id"], "n": 0, "texte": "ancienne version"}
                ]}, index["chunks"], {catalogue[-1]["id"]})
            self.assertEqual(merged["chunks"][0]["doc"], "ancien")
            self.assertEqual(len(merged["chunks"]), 2)
            self.assertEqual([c["global_id"] for c in merged["chunks"]], [0, 1])

    def test_pdf_ingestion_preserves_page_and_sha256_end_to_end(self):
        class Page:
            def __init__(self, value): self.value = value
            def extract_text(self): return self.value
        class Reader:
            def __init__(self, _path):
                self.pages = [Page(" ".join(["pageun"] * 15)),
                              Page(" ".join(["pagedeux"] * 15))]
        fake_pypdf = types.SimpleNamespace(PdfReader=Reader)
        with tempfile.TemporaryDirectory() as tmp:
            source = os.path.join(tmp, "manuel.pdf")
            with open(source, "wb") as stream: stream.write(b"synthetic-pdf-fixture")
            with open(os.path.join(tmp, "_manuel.json"), "w", encoding="utf-8") as stream:
                json.dump(self._metadata_authorisee(), stream)
            with patch.dict(sys.modules, {"pypdf": fake_pypdf}):
                catalogue, index, ignores, _ = ingest.construire(tmp, [])
            self.assertEqual(ignores, 0)
            self.assertEqual([c["page_start"] for c in index["chunks"]], [1, 2])
            self.assertEqual([c["page_end"] for c in index["chunks"]], [1, 2])
            expected = hashlib.sha256(b"synthetic-pdf-fixture").hexdigest()
            self.assertEqual(catalogue[0]["source_sha256"], expected)
            self.assertTrue(all(c["source_sha256"] == expected for c in index["chunks"]))

    def test_unauthorized_multiformat_batch_is_refused_without_chunks(self):
        with tempfile.TemporaryDirectory() as tmp:
            with open(os.path.join(tmp, "sans_droits.txt"), "w", encoding="utf-8") as stream:
                stream.write(" ".join(["texte"] * 30))
            with self.assertRaisesRegex(RuntimeError, "Aucun chunk autorisé"):
                ingest.construire(tmp, [{"id": "stable", "titre": "Stable"}])

    def test_sidecar_without_scope_is_rejected_before_extraction(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = os.path.join(tmp, "manuel.txt")
            with open(source, "w", encoding="utf-8") as stream:
                stream.write(" ".join(["texte"] * 30))
            meta = self._metadata_authorisee()
            del meta["usages_autorises"]
            with open(os.path.join(tmp, "_manuel.json"), "w", encoding="utf-8") as stream:
                json.dump(meta, stream)
            with patch.object(ingest, "extraire_pages",
                              side_effect=AssertionError("extraction interdite")):
                with self.assertRaisesRegex(RuntimeError, "Aucun chunk autorisé"):
                    ingest.construire(tmp, [{"id": "stable", "titre": "Stable"}])


    def test_shared_index_merge_preserves_unmentioned_documents(self):
        merged = contracts.fusionner_index_rag(
            {"_meta": {}, "chunks": [
                {"global_id": 7, "doc": "ancien", "n": 0, "texte": "ancien texte"},
                {"global_id": 8, "doc": "remplace", "n": 0, "texte": "ancienne version"}
            ]},
            [{"global_id": 0, "doc": "remplace", "n": 0, "texte": "nouvelle version",
              "page_start": 1, "page_end": 1, "source_sha256": "c" * 64}],
            {"remplace"}
        )
        self.assertEqual([c["doc"] for c in merged["chunks"]], ["ancien", "remplace"])
        self.assertEqual([c["global_id"] for c in merged["chunks"]], [0, 1])
        self.assertEqual(merged["termes"]["ancien"], [0])
        self.assertEqual(merged["termes"]["nouvelle"], [1])


    def test_transactional_json_write_rolls_back_on_second_replace_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            first = os.path.join(tmp, "corpus.json")
            second = os.path.join(tmp, "index.json")
            with open(first, "w", encoding="utf-8") as stream:
                stream.write('{"old":"catalogue"}')
            with open(second, "w", encoding="utf-8") as stream:
                stream.write('{"old":"index"}')
            original_replace = os.replace
            failed = {"value": False}

            def replace_with_one_failure(src, dst):
                if dst == second and os.path.basename(src).startswith(".corpus-tmp-") and not failed["value"]:
                    failed["value"] = True
                    raise OSError("simulation panne disque")
                return original_replace(src, dst)

            with patch("os.replace", side_effect=replace_with_one_failure):
                with self.assertRaises(OSError):
                    contracts.ecrire_json_transactionnel({
                        first: {"new": "catalogue"},
                        second: {"new": "index"}
                    })
            with open(first, encoding="utf-8") as stream:
                self.assertEqual(stream.read(), '{"old":"catalogue"}')
            with open(second, encoding="utf-8") as stream:
                self.assertEqual(stream.read(), '{"old":"index"}')
            self.assertEqual(os.listdir(tmp), ["corpus.json", "index.json"])

    def test_multiformat_main_rolls_back_copied_sources_if_json_publish_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            source_dir = os.path.join(tmp, "source")
            destination = os.path.join(tmp, "published")
            bdd = os.path.join(tmp, "bdd")
            os.makedirs(source_dir)
            os.makedirs(bdd)
            with open(os.path.join(source_dir, "cours.txt"), "w", encoding="utf-8") as stream:
                stream.write(" ".join(["contenu"] * 35))
            with open(os.path.join(source_dir, "_cours.json"), "w", encoding="utf-8") as stream:
                json.dump(self._metadata_authorisee(), stream)
            corpus_path = os.path.join(bdd, "corpus.json")
            index_path = os.path.join(bdd, "corpus_rag_index.json")
            with open(corpus_path, "w", encoding="utf-8") as stream:
                json.dump({"documents": []}, stream)
            with open(index_path, "w", encoding="utf-8") as stream:
                json.dump({"chunks": []}, stream)
            with patch.object(ingest, "DESTINATION", destination), \
                 patch.object(ingest, "CORPUS", corpus_path), \
                 patch.object(ingest, "INDEX", index_path), \
                 patch.object(ingest, "ecrire_json_transactionnel",
                              side_effect=OSError("simulation échec publication JSON")):
                with self.assertRaises(OSError):
                    ingest.main(source_dir)
            self.assertEqual(os.listdir(destination), [])
            with open(corpus_path, encoding="utf-8") as stream:
                self.assertEqual(json.load(stream), {"documents": []})
            with open(index_path, encoding="utf-8") as stream:
                self.assertEqual(json.load(stream), {"chunks": []})

    def test_transactional_json_write_creates_both_valid_artifacts(self):
        with tempfile.TemporaryDirectory() as tmp:
            first = os.path.join(tmp, "corpus.json")
            second = os.path.join(tmp, "index.json")
            contracts.ecrire_json_transactionnel({
                first: {"documents": [1]},
                second: {"chunks": [2]}
            })
            with open(first, encoding="utf-8") as stream:
                self.assertEqual(json.load(stream), {"documents": [1]})
            with open(second, encoding="utf-8") as stream:
                self.assertEqual(json.load(stream), {"chunks": [2]})

    def test_empty_index_is_rejected(self):
        with self.assertRaises(ValueError):
            sharder.build_shards({"chunks": [], "termes": {}})

    def test_global_ids_and_postings_are_validated(self):
        valid = {"chunks": [
            {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha beta"},
            {"global_id": 250, "doc": "doc-b", "n": 0, "texte": "gamma delta"}
        ], "termes": {"alpha": [0], "gamma": [250]}}
        shards, manifest = sharder.build_shards(valid, taille=1)
        self.assertEqual(manifest["version"], "2.0.0")
        self.assertRegex(manifest["generation"], r"^[0-9a-f]{64}$")
        self.assertEqual(manifest["total_chunks"], 2)
        self.assertEqual(shards[0]["file"], "shard_00.json")
        self.assertEqual(len(shards), 2)

    def test_shard_generation_matches_manifest(self):
        index = {"_meta": {"version": "2.1.0"}, "chunks": [
            {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha beta"}
        ], "termes": {"alpha": [0]}}
        shards_a, manifest_a = sharder.build_shards(index)
        shards_b, manifest_b = sharder.build_shards(index)
        self.assertEqual(manifest_a["generation"], manifest_b["generation"])
        self.assertEqual(shards_a, shards_b)
        changed = {"_meta": {"version": "2.1.0"}, "chunks": [
            {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha gamma"}
        ], "termes": {"alpha": [0]}}
        self.assertNotEqual(manifest_a["generation"], sharder.build_shards(changed)[1]["generation"])

    def test_dangling_posting_is_rejected(self):
        invalid = {"chunks": [
            {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha beta"}
        ], "termes": {"alpha": [99]}}
        with self.assertRaises(ValueError):
            sharder.build_shards(invalid)


    def test_catalogue_index_coherence_accepts_legacy_unindexed_documents(self):
        catalogue = {"documents": [
            {"id": "doc-a", "matiere": "allemand", "niveau": "2AS", "langue": "de",
             "source_sha256": "a" * 64},
            {"id": "doc-b", "matiere": "anglais", "niveau": "1AS", "langue": "en"}
        ]}
        index = {"chunks": [{"doc": "doc-a", "texte": "Hallo", "source_sha256": "a" * 64}]}
        result = contracts.valider_coherence_catalogue_index(catalogue, index)
        self.assertEqual(result["documents_indexes"], 1)
        self.assertEqual(result["documents_sans_chunks"], 1)

    def test_catalogue_index_rejects_orphan_chunk(self):
        with self.assertRaisesRegex(ValueError, "orphelin"):
            contracts.valider_coherence_catalogue_index(
                {"documents": []}, {"chunks": [{"doc": "missing", "texte": "texte"}]})

    def test_catalogue_index_rejects_duplicate_document_ids(self):
        doc = {"id": "dup", "matiere": "allemand", "niveau": "2AS", "langue": "de"}
        with self.assertRaisesRegex(ValueError, "dupliqué"):
            contracts.valider_coherence_catalogue_index(
                {"documents": [doc, dict(doc)]}, {"chunks": []})

    def test_catalogue_index_rejects_missing_language_metadata(self):
        with self.assertRaisesRegex(ValueError, "langue"):
            contracts.valider_coherence_catalogue_index(
                {"documents": [{"id": "doc-a", "matiere": "allemand", "niveau": "2AS"}]},
                {"chunks": [{"doc": "doc-a", "texte": "Hallo"}]})

    def test_catalogue_index_rejects_source_hash_mismatch(self):
        with self.assertRaisesRegex(ValueError, "divergente"):
            contracts.valider_coherence_catalogue_index(
                {"documents": [{"id": "doc-a", "matiere": "allemand", "niveau": "2AS",
                                "langue": "de", "source_sha256": "a" * 64}]},
                {"chunks": [{"doc": "doc-a", "texte": "Hallo", "source_sha256": "b" * 64}]})


    def test_catalogue_index_accepts_multilingual_document_metadata(self):
        documents = [
            {"id": "de", "matiere": "allemand", "niveau": "2AS", "langue": "de"},
            {"id": "ar", "matiere": "arabe", "niveau": "1AS", "langue": "ar"},
            {"id": "fr", "matiere": "francais", "niveau": "3AS", "langue": "fr"},
            {"id": "es", "matiere": "espanol", "niveau": "2AS", "langue": "es"},
            {"id": "it", "matiere": "italien", "niveau": "2AS", "langue": "it"}
        ]
        index = {"chunks": [{"doc": doc["id"], "texte": "synthetic lesson"}
                            for doc in documents]}
        result = contracts.valider_coherence_catalogue_index(
            {"documents": documents}, index)
        self.assertEqual(result["documents_indexes"], 5)
        self.assertEqual(result["documents_sans_chunks"], 0)

if __name__ == "__main__":
    unittest.main()
