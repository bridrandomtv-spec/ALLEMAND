#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construit le corpus RAG depuis des PDF explicitement autorisés.

Chaque PDF doit avoir un sidecar _<nom>.json contenant au minimum :
{"licence":"production_propre","matiere":"allemand","niveau":"2AS"}
Licences admises : production_propre, domaine_public, autorisation_ecrite,
licence_libre. Les documents sans métadonnées/licence explicite sont ignorés.
Ce script ne modifie jamais corpus_index.json (catalogue lexical BIBLIO).
"""
import hashlib
import json
import os
import re
import sys

try:
    from tools.rights_metadata import LICENCES_AUTORISEES, valider_metadonnees
    from tools.corpus_contracts import sha256_fichier, decouper_pages, fusionner_documents, construire_chunk, fusionner_index_rag, ecrire_json_transactionnel, valider_coherence_catalogue_index
except ModuleNotFoundError:  # exécution directe: python tools/script.py
    from rights_metadata import LICENCES_AUTORISEES, valider_metadonnees
    from corpus_contracts import sha256_fichier, decouper_pages, fusionner_documents, construire_chunk, fusionner_index_rag, ecrire_json_transactionnel

CORPUS = os.path.join("assets", "bdd", "corpus.json")
INDEX = os.path.join("assets", "bdd", "corpus_rag_index.json")
CHUNK_MOTS = 1200
LICENCES_AUTORISEES = {
    "production_propre", "domaine_public", "autorisation_ecrite", "licence_libre"
}


def slug(nom):
    return re.sub(r"[^a-z0-9]+", "-", nom.lower()).strip("-")[:60] or "document"


def lire_pages_pdf(chemin):
    try:
        from pypdf import PdfReader
        return [(page.extract_text() or "") for page in PdfReader(chemin).pages]
    except Exception as exc:
        raise RuntimeError("Extraction PDF impossible pour %s: %s" % (chemin, exc))


def decouper(texte, taille=CHUNK_MOTS):
    mots = texte.split()
    return [" ".join(mots[i:i + taille]) for i in range(0, len(mots), taille)]


def construire(dossier, documents_existants=None):
    docs = [d for d in (documents_existants or [])
            if not str(d.get("id", "")).startswith("pdf-")]
    index = {"_meta": {"version": "2.0.0"}, "chunks": [], "termes": {}}
    nb_ignores = 0
    if not os.path.isdir(dossier):
        raise FileNotFoundError("Dossier PDF absent: " + dossier)

    for nom in sorted(os.listdir(dossier)):
        if not nom.lower().endswith(".pdf"):
            continue
        chemin = os.path.join(dossier, nom)
        if not os.path.isfile(chemin):
            continue
        base = os.path.splitext(nom)[0]
        sidecar = os.path.join(dossier, "_" + base + ".json")
        if not os.path.isfile(sidecar):
            print("IGNORE (métadonnées/licence absentes):", nom)
            nb_ignores += 1
            continue
        with open(sidecar, encoding="utf-8") as f:
            meta = json.load(f)
        ok_droits, raison_droits = valider_metadonnees(meta)
        if not ok_droits:
            print("IGNORE (droits non vérifiés):", nom, "-", raison_droits)
            nb_ignores += 1
            continue
        licence = str(meta.get("licence", "")).strip().lower()

        pages = lire_pages_pdf(chemin)
        texte = "\n".join(pages).strip()
        if len(texte) < 60:
            print("IGNORE (texte extrait insuffisant; OCR non exécuté):", nom)
            nb_ignores += 1
            continue

        did = "pdf-" + hashlib.sha256(nom.encode("utf-8")).hexdigest()[:16]
        doc = {
            "id": did, "titre": meta.get("titre", nom),
            "matiere": meta.get("matiere", "allemand"),
            "niveau": meta.get("niveau", "2AS/3AS"),
            "type": meta.get("type", "document"),
            "langue": meta.get("langue", "de"),
            "annee": meta.get("annee", "2026/2027"),
            "format": "pdf", "url": chemin,
            "source_sha256": sha256_fichier(chemin),
            "source": meta.get("source", "document local"),
            "licence": licence, "tags": meta.get("tags", ["pdf"]),
            "extrait": texte[:300].replace("\n", " ")
        }
        docs.append(doc)
        for numero, partie in enumerate(decouper_pages(pages, CHUNK_MOTS)):
            morceau = partie["texte"]
            gid = len(index["chunks"])
            index["chunks"].append(construire_chunk(
                gid, did, numero, morceau, doc["source_sha256"],
                partie["page_start"], partie["page_end"]
            ))
            for terme in set(re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06ff]{3,}", morceau.lower())):
                index["termes"].setdefault(terme, []).append(gid)

    index["_meta"].update({
        "nb_chunks": len(index["chunks"]),
        "nb_termes": len(index["termes"]),
        "source": "PDF avec métadonnées et licence explicite"
    })
    docs = fusionner_documents(docs, [])
    return {"_meta": {"version": "2.1.0", "nb": len(docs)}, "documents": docs}, index, nb_ignores


def main(dossier):
    os.makedirs(os.path.dirname(CORPUS), exist_ok=True)
    existants = []
    if os.path.isfile(CORPUS):
        with open(CORPUS, encoding="utf-8") as f:
            existants = json.load(f).get("documents", [])
    corpus, index, ignores = construire(dossier, existants)
    corpus["documents"] = fusionner_documents(existants, corpus["documents"])
    corpus["_meta"]["nb"] = len(corpus["documents"])
    if not index["chunks"]:
        raise RuntimeError("Aucun chunk autorisé généré : index existant conservé, aucun artefact remplacé.")
    index_existant = {"_meta": {}, "chunks": []}
    if os.path.isfile(INDEX):
        with open(INDEX, encoding="utf-8") as f:
            index_existant = json.load(f)
        if not isinstance(index_existant, dict) or not isinstance(index_existant.get("chunks"), list):
            raise ValueError("Index RAG existant invalide : écriture refusée.")
    docs_remplaces = {c["doc"] for c in index["chunks"]}
    index_final = fusionner_index_rag(index_existant, index["chunks"], docs_remplaces)
    valider_coherence_catalogue_index(corpus, index_final)
    ecrire_json_transactionnel({INDEX: index_final, CORPUS: corpus})
    print("PDF indexés:", len(corpus["documents"]), "| chunks:", len(index["chunks"]), "| ignorés:", ignores)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join("docs", "archive", "documents"))
