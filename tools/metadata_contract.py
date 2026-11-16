"""Validation stricte des métadonnées avant admission au corpus RAG."""
import json
import os

CHAMPS_OBLIGATOIRES = (
    "titre", "matiere", "niveau", "type", "langue", "source",
    "licence", "droits_verifies", "droits_reference",
)
LICENCES_ADMISES = {
    "production_propre", "licence_libre", "autorisation_titulaire",
    "domaine_public", "usage_pedagogique",
}


def valide_metadonnees(meta):
    erreurs = []
    if not isinstance(meta, dict):
        return ["fichier de métadonnées absent ou non-objet JSON"]
    for champ in CHAMPS_OBLIGATOIRES:
        valeur = meta.get(champ)
        if valeur is None or (isinstance(valeur, str) and not valeur.strip()):
            erreurs.append("champ obligatoire absent : " + champ)
    licence = str(meta.get("licence", "")).strip().lower()
    if licence and licence not in LICENCES_ADMISES:
        erreurs.append("licence non normalisée ou non admise : " + licence)
    if meta.get("droits_verifies") is not True:
        erreurs.append("droits non vérifiés explicitement")
    reference = meta.get("droits_reference")
    if not isinstance(reference, str) or len(reference.strip()) < 3:
        erreurs.append("référence de preuve des droits absente")
    return erreurs


def ajoute_quarantaine(entree, chemin="assets/bdd/corpus_quarantaine.json"):
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    try:
        with open(chemin, encoding="utf-8") as f:
            registre = json.load(f)
    except (OSError, ValueError):
        registre = {"version": "1.0.0", "documents": []}
    docs = registre.setdefault("documents", [])
    docs[:] = [d for d in docs if d.get("id") != entree.get("id")]
    docs.append(entree)
    with open(chemin, "w", encoding="utf-8") as f:
        json.dump(registre, f, ensure_ascii=False, indent=2)
