#!/usr/bin/env python3
"""Audit en lecture seule des métadonnées du registre documentaire."""
import json
import os
from metadata_contract import valide_metadonnees

CORPUS = os.path.join("assets", "bdd", "corpus.json")


def main():
    with open(CORPUS, encoding="utf-8") as f:
        corpus = json.load(f)
    documents = corpus.get("documents", [])
    conformes = []
    a_revoir = []
    for doc in documents:
        erreurs = valide_metadonnees(doc)
        entree = {"id": doc.get("id"), "titre": doc.get("titre"),
                  "motifs": erreurs}
        (a_revoir if erreurs else conformes).append(entree)
    rapport = {
        "version": "1.0.0",
        "mode": "lecture_seule",
        "total": len(documents),
        "conformes_au_contrat": len(conformes),
        "a_revoir": len(a_revoir),
        "documents_a_revoir": a_revoir,
    }
    print(json.dumps(rapport, ensure_ascii=False, indent=2))
    return 1 if a_revoir else 0


if __name__ == "__main__":
    raise SystemExit(main())
