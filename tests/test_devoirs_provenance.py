#!/usr/bin/env python3
"""Vérifie que la banque de devoirs ne revendique aucune provenance officielle non prouvée."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "assets" / "bdd" / "devoirs_officiels.json"


class DevoirsProvenanceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = json.loads(DATA.read_text(encoding="utf-8"))
        cls.meta = cls.payload.get("_meta", {})
        cls.devoirs = cls.payload.get("devoirs", [])

    def test_count_matches_metadata(self):
        self.assertEqual(len(self.devoirs), 55)
        self.assertEqual(self.meta.get("nombre"), len(self.devoirs))

    def test_metadata_does_not_claim_verified_provenance(self):
        self.assertIs(self.meta.get("provenance_verifiee"), False)

    def test_every_record_is_explicitly_unverified_and_not_official(self):
        self.assertEqual(len(self.devoirs), 55)
        for devoir in self.devoirs:
            with self.subTest(devoir=devoir.get("id")):
                self.assertIs(devoir.get("officiel"), False)
                self.assertIs(devoir.get("provenance_verifiee"), False)
                self.assertEqual(devoir.get("statut_provenance"), "non_verifiee")
                self.assertIn(devoir.get("lycee"), (None, "", "—"))
                self.assertIn(devoir.get("wilaya"), (None, "", "—"))

    def test_identifiers_are_unique(self):
        ids = [item.get("id") for item in self.devoirs]
        self.assertTrue(all(isinstance(value, str) and value for value in ids))
        self.assertEqual(len(ids), len(set(ids)))

    def test_legacy_schema_is_only_a_format_label(self):
        legacy = [item for item in self.devoirs if item.get("schema") == "officiel_v1"]
        self.assertEqual(len(legacy), 10)
        self.assertTrue(all(item.get("officiel") is False for item in legacy))
        self.assertTrue(all(item.get("provenance_verifiee") is False for item in legacy))


if __name__ == "__main__":
    unittest.main(verbosity=2)
