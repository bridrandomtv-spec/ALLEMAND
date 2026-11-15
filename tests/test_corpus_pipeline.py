import importlib.util
import unittest

def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

indexer = load_module("tools/indexer_pdf.py", "indexer_pdf")
sharder = load_module("tools/sharder_index.py", "sharder_index")

class CorpusPipelineContract(unittest.TestCase):
    def test_pdf_indexer_keeps_biblio_catalogue_separate(self):
        self.assertEqual(indexer.INDEX, "assets/bdd/corpus_rag_index.json")
        self.assertNotEqual(indexer.INDEX, "assets/bdd/corpus_index.json")

    def test_missing_license_is_not_an_authorized_default(self):
        self.assertNotIn("", indexer.LICENCES_AUTORISEES)
        self.assertNotIn("document utilisateur", indexer.LICENCES_AUTORISEES)

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
