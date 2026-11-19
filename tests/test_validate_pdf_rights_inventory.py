import csv
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "validate_pdf_rights_inventory.py"
SPEC = importlib.util.spec_from_file_location("validate_pdf_rights_inventory", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
validate_inventory = MODULE.validate_inventory


class PdfRightsInventoryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.pdf = self.root / "docs" / "lesson.pdf"
        self.pdf.parent.mkdir(parents=True)
        self.pdf.write_bytes(b"%PDF-test")
        self.csv_path = self.root / "inventory.csv"

    def tearDown(self):
        self.tmp.cleanup()

    def write_rows(self, rows):
        fields = ["pdf_path", "expected_companion_metadata", "rights_confirmed",
                  "license", "review_status"]
        with self.csv_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)

    def write_companion(self, license_name="cc_by", rights=True):
        companion = self.pdf.parent / "_lesson.json"
        companion.write_text(
            json.dumps({
                "titre": "Lesson", "licence": license_name,
                "droits_confirmes": rights,
            }),
            encoding="utf-8",
        )

    def row(self, **updates):
        value = {
            "pdf_path": "docs/lesson.pdf",
            "expected_companion_metadata": "docs/_lesson.json",
            "rights_confirmed": "",
            "license": "",
            "review_status": "à vérifier",
        }
        value.update(updates)
        return value

    def test_blank_inventory_row_stays_pending(self):
        self.write_rows([self.row()])
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 0)
        self.assertEqual(result["pending_count"], 1)
        self.assertEqual(result["errors"], [])

    def test_explicit_confirmation_and_matching_companion_are_eligible(self):
        self.write_companion("cc_by", True)
        self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 1)
        self.assertEqual(result["approved"][0]["license"], "cc_by")

    def test_confirmed_csv_without_companion_is_rejected(self):
        self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("compagnon_absent" in item for item in result["errors"]))

    def test_companion_must_confirm_rights(self):
        self.write_companion("cc_by", False)
        self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("confirmation_compagnon_absente" in item for item in result["errors"]))

    def test_companion_license_must_match_inventory(self):
        self.write_companion("cc_by_sa", True)
        self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("licence_compagnon_incoherente" in item for item in result["errors"]))

    def test_companion_symlink_cannot_escape_repository(self):
        outside = self.root.parent / (self.root.name + "-outside.json")
        outside.write_text('{"droits_confirmes":true,"licence":"cc_by"}', encoding="utf-8")
        try:
            (self.pdf.parent / "_lesson.json").symlink_to(outside)
            self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
            result = validate_inventory(self.csv_path, self.root)
            self.assertTrue(any("chemin_compagnon_invalide" in item for item in result["errors"]))
        finally:
            outside.unlink(missing_ok=True)

    def test_invalid_companion_json_is_rejected(self):
        (self.pdf.parent / "_lesson.json").write_text("{invalid", encoding="utf-8")
        self.write_rows([self.row(rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("compagnon_illisible" in item for item in result["errors"]))

    def test_true_without_license_is_an_error(self):
        self.write_rows([self.row(rights_confirmed="true")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 0)
        self.assertIn("ligne_2:licence_manquante:docs/lesson.pdf", result["errors"])

    def test_unapproved_license_is_rejected(self):
        self.write_rows([self.row(rights_confirmed="true", license="unknown")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 0)
        self.assertTrue(any("licence_non_autorisee" in item for item in result["errors"]))

    def test_false_confirmation_never_becomes_eligible(self):
        self.write_rows([self.row(rights_confirmed="false", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 0)
        self.assertEqual(result["pending_count"], 1)

    def test_companion_path_must_match_pdf_name_and_directory(self):
        self.write_rows([self.row(expected_companion_metadata="docs/_other.json",
                                  rights_confirmed="true", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("compagnon_incoherent" in item for item in result["errors"]))

    def test_missing_pdf_is_rejected(self):
        self.write_rows([self.row(pdf_path="docs/missing.pdf",
                                  expected_companion_metadata="docs/_missing.json")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("pdf_absent_ou_invalide" in item for item in result["errors"]))

    def test_path_traversal_is_rejected(self):
        self.write_rows([self.row(pdf_path="../outside.pdf",
                                  expected_companion_metadata="../_outside.json")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("chemin_pdf_invalide" in item for item in result["errors"]))

    def test_duplicate_csv_headers_are_rejected_before_approval(self):
        self.write_companion("cc_by", True)
        self.csv_path.write_text(
            "pdf_path,expected_companion_metadata,rights_confirmed,rights_confirmed,license,review_status\\n"
            "docs/lesson.pdf,docs/_lesson.json,false,true,cc_by,confirmé\\n",
            encoding="utf-8",
        )
        result = validate_inventory(self.csv_path, self.root)
        self.assertEqual(result["approved_count"], 0)
        self.assertEqual(result["errors"], ["entetes_csv_dupliquees"])

    def test_duplicate_pdf_rows_are_rejected(self):
        self.write_rows([self.row(), self.row()])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("pdf_duplique" in item for item in result["errors"]))

    def test_invalid_confirmation_value_is_rejected(self):
        self.write_rows([self.row(rights_confirmed="yes", license="cc_by")])
        result = validate_inventory(self.csv_path, self.root)
        self.assertTrue(any("valeur_droits_invalide" in item for item in result["errors"]))


if __name__ == "__main__":
    unittest.main()
