#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/ingest_corpus.py — construit le corpus pédagogique depuis UN dossier local.

Usage :
    python tools/ingest_corpus.py ./mes_documents

Le dossier doit contenir des fichiers .pdf / .docx / .txt / .md, et OPTIONNELLEMENT
un fichier _meta.json par document :
    {"titre": "...", "matiere": "allemand", "niveau": "2AS", "type": "cours",
     "annee": "2026/2027", "source": "...", "licence": "production propre",
     "tags": ["..."]}

Ce script :
  1. extrait le texte (pypdf pour PDF, python-docx pour DOCX, brut pour txt/md ;
     OCR via tesseract SEULEMENT si installé et si le PDF est un scan),
  2. REFUSE tout document dont la licence est interdite (manuel éditeur, livre commercial),
  3. découpe en chunks (~1200 mots) pour la recherche et le RAG futur,
  4. écrit assets/bdd/corpus.json (métadonnées) + assets/bdd/corpus_index.json
     (index inversé plein-texte, utilisable côté client, hors-ligne),
  5. copie les fichiers originaux vers assets/corpus/<id>.<ext>.

Aucun fichier protégé n'est téléchargé : tout vient de VOTRE dossier local.
"""
import json, os, re, shutil, sys, hashlib

INTERDITS = {"manuel_scolaire_editeur", "livre_commercial", "scan_livre_protege"}
TAILLE_CHUNK = 1200  # mots


def texte_pdf(chemin):
    try:
        from pypdf import PdfReader
        return "\n".join((p.extract_text() or "") for p in PdfReader(chemin).pages)
    except Exception:
        return ""


def texte_docx(chemin):
    try:
        import docx
        return "\n".join(p.text for p in docx.Document(chemin).paragraphs)
    except Exception:
        return ""


def texte_brut(chemin):
    with open(chemin, encoding="utf-8", errors="ignore") as f:
        return f.read()


def chunks(texte):
    mots = texte.split()
    return [" ".join(mots[i:i + TAILLE_CHUNK]) for i in range(0, len(mots), TAILLE_CHUNK)]


def main(dossier):
    docs, index = [], {"termes": {}, "chunks": []}
    for nom in sorted(os.listdir(dossier)):
        chemin = os.path.join(dossier, nom)
        if not os.path.isfile(chemin):
            continue
        ext = nom.rsplit(".", 1)[-1].lower()
        if ext not in ("pdf", "docx", "txt", "md"):
            continue
        meta = {}
        mp = os.path.join(dossier, "_" + nom.rsplit(".", 1)[0] + ".json")
        if os.path.exists(mp):
            meta = json.load(open(mp, encoding="utf-8"))
        licence = meta.get("licence", "production propre")
        if licence in INTERDITS:
            print("  REFUSÉ (licence) :", nom)
            continue
        texte = {"pdf": texte_pdf, "docx": texte_docx}.get(ext, texte_brut)(chemin)
        did = "c-" + hashlib.md5(nom.encode()).hexdigest()[:8]
        docs.append({
            "id": did,
            "titre": meta.get("titre", nom),
            "matiere": meta.get("matiere", "allemand"),
            "niveau": meta.get("niveau", "2AS"),
            "type": meta.get("type", "cours"),
            "annee": meta.get("annee", "2026/2027"),
            "format": ext,
            "url": "assets/corpus/" + did + "." + ext,
            "source": meta.get("source", "document local"),
            "licence": licence,
            "tags": meta.get("tags", []),
            "extrait": texte[:300].replace("\n", " "),
        })
        for ci, ch in enumerate(chunks(texte)):
            cid = len(index["chunks"])
            index["chunks"].append({"doc": did, "n": ci, "texte": ch})
            for mot in set(re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06FF]{3,}", ch.lower())):
                index["termes"].setdefault(mot, []).append(cid)
        os.makedirs("assets/corpus", exist_ok=True)
        shutil.copy(chemin, "assets/corpus/" + did + "." + ext)
        print("  indexé :", nom, "→", did, "·", len(chunks(texte)), "chunks")
    os.makedirs("assets/bdd", exist_ok=True)
    json.dump({"_meta": {"version": "1.0.0", "nb": len(docs)}, "documents": docs},
              open("assets/bdd/corpus.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    json.dump(index, open("assets/bdd/corpus_index.json", "w", encoding="utf-8"),
              ensure_ascii=False)
    print("  corpus.json :", len(docs), "documents ·", len(index["chunks"]), "chunks")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
