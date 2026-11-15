#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ingestion documentaire locale avec licence explicite et index RAG séparé.

Chaque fichier doit avoir un sidecar _<nom>.json et une licence parmi :
production_propre, domaine_public, autorisation_ecrite, licence_libre.
Le catalogue lexical corpus_index.json est strictement préservé.
"""
import hashlib
import json
import os
import re
import shutil
import sys

LICENCES_AUTORISEES = {"production_propre", "domaine_public", "autorisation_ecrite", "licence_libre"}
TAILLE_CHUNK = 1200


def extraire(chemin, ext):
    if ext == "pdf":
        from pypdf import PdfReader
        return "\n".join((p.extract_text() or "") for p in PdfReader(chemin).pages)
    if ext == "docx":
        import docx
        return "\n".join(p.text for p in docx.Document(chemin).paragraphs)
    with open(chemin, encoding="utf-8", errors="ignore") as f:
        return f.read()


def construire(dossier):
    docs, index = [], {"_meta": {"version": "2.0.0"}, "termes": {}, "chunks": []}
    if not os.path.isdir(dossier):
        raise FileNotFoundError("Dossier source absent: " + dossier)
    for nom in sorted(os.listdir(dossier)):
        chemin = os.path.join(dossier, nom)
        if not os.path.isfile(chemin):
            continue
        ext = os.path.splitext(nom)[1].lower().lstrip(".")
        if ext not in ("pdf", "docx", "txt", "md"):
            continue
        base = os.path.splitext(nom)[0]
        mp = os.path.join(dossier, "_" + base + ".json")
        if not os.path.isfile(mp):
            print("IGNORE (métadonnées/licence absentes):", nom)
            continue
        with open(mp, encoding="utf-8") as f:
            meta = json.load(f)
        licence = str(meta.get("licence", "")).strip().lower()
        if licence not in LICENCES_AUTORISEES:
            print("IGNORE (licence non autorisée):", nom)
            continue
        texte = extraire(chemin, ext).strip()
        if len(texte) < 20:
            print("IGNORE (contenu extrait insuffisant):", nom)
            continue
        did = "c-" + hashlib.sha256(nom.encode("utf-8")).hexdigest()[:16]
        docs.append({
            "id": did, "titre": meta.get("titre", nom),
            "matiere": meta.get("matiere", "allemand"),
            "niveau": meta.get("niveau", "2AS"),
            "type": meta.get("type", "cours"),
            "annee": meta.get("annee", "2026/2027"),
            "format": ext, "url": "assets/corpus/" + did + "." + ext,
            "source": meta.get("source", "document local"),
            "licence": licence, "tags": meta.get("tags", []),
            "extrait": texte[:300].replace("\n", " ")
        })
        mots = texte.split()
        for numero, debut in enumerate(range(0, len(mots), TAILLE_CHUNK)):
            morceau = " ".join(mots[debut:debut + TAILLE_CHUNK])
            gid = len(index["chunks"])
            index["chunks"].append({"global_id": gid, "doc": did, "n": numero, "texte": morceau})
            for terme in set(re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06ff]{3,}", morceau.lower())):
                index["termes"].setdefault(terme, []).append(gid)
    index["_meta"].update({"nb_chunks": len(index["chunks"]), "nb_termes": len(index["termes"])})
    return docs, index


def main(dossier):
    docs, index = construire(dossier)
    if not index["chunks"]:
        raise RuntimeError("Aucun chunk autorisé : aucun fichier de production ne sera écrasé.")
    os.makedirs("assets/bdd", exist_ok=True)
    os.makedirs("assets/corpus", exist_ok=True)
    for nom in sorted(os.listdir(dossier)):
        chemin = os.path.join(dossier, nom)
        if not os.path.isfile(chemin) or nom.startswith("_"):
            continue
        ext = os.path.splitext(nom)[1].lower().lstrip(".")
        if ext not in ("pdf", "docx", "txt", "md"):
            continue
        base = os.path.splitext(nom)[0]
        mp = os.path.join(dossier, "_" + base + ".json")
        if not os.path.isfile(mp):
            continue
        with open(mp, encoding="utf-8") as f:
            meta = json.load(f)
        if str(meta.get("licence", "")).strip().lower() in LICENCES_AUTORISEES:
            did = "c-" + hashlib.sha256(nom.encode("utf-8")).hexdigest()[:16]
            shutil.copy2(chemin, "assets/corpus/" + did + "." + ext)
    corpus = {"_meta": {"version": "2.0.0", "nb": len(docs)}, "documents": docs}
    for path, value in (("assets/bdd/corpus_rag_index.json", index), ("assets/bdd/corpus.json", corpus)):
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(value, f, ensure_ascii=False, separators=(",", ":"))
        os.replace(tmp, path)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
