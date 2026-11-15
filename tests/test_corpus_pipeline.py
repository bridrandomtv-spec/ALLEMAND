import importlib.util
import unittest

def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

indexer = load_module("tools/indexer_pdf.py", "indexer_pdf")
sharder = load_module("tools/sharder_index.py", "sharder_index")
rights = load_module("tools/rights_metadata.py", "rights_metadata")
contracts = load_module("tools/corpus_contracts.py", "corpus_contracts")

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
            "validation": {
                "statut": "valide", "verificateur": "Responsable pédagogique",
                "date": "2026-11-15", "reference_preuve": "declaration-interne-001"
            }
        }
        self.assertTrue(rights.valider_metadonnees(meta)[0])

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
        self.assertEqual(manifest["total_chunks"], 2)
        self.assertEqual(len(shards), 2)

    def test_dangling_posting_is_rejected(self):
        invalid = {"chunks": [
            {"global_id": 0, "doc": "doc-a", "n": 0, "texte": "alpha beta"}
        ], "termes": {"alpha": [99]}}
        with self.assertRaises(ValueError):
            sharder.build_shards(invalid)

if __name__ == "__main__":
    unittest.main()
