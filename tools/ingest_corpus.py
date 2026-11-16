#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/ingest_corpus.py — construit le corpus pédagogique depuis UN dossier local.

Usage :
    python tools/ingest_corpus.py ./mes_documents

Chaque document doit être accompagné d'un fichier _<nom>.json contenant au minimum :
    {"titre":"...", "matiere":"allemand", "niveau":"2AS", "type":"cours",
     "langue":"de", "source":"...", "licence":"production_propre",
     "droits_verifies":true, "droits_reference":"référence vérifiable"}
Les métadonnées absentes, incomplètes ou sans preuve explicite de droits sont
placées dans assets/bdd/corpus_quarantaine.json et ne sont pas indexées.

Ce script :
  1. extrait le texte (pypdf pour PDF, python-docx pour DOCX, brut pour txt/md ;
     OCR via tesseract SEULEMENT si installé et si le PDF est un scan),
  2. REFUSE tout document dont la licence est interdite (manuel éditeur, livre commercial),
  3. découpe en chunks (~1200 mots) pour la recherche et le RAG futur,
  4. préserve assets/bdd/corpus.json et écrit les chunks RAG dans
     assets/bdd/corpus_chunks_index.json, sans toucher au vocabulaire BIBLIO,
  5. copie les fichiers originaux vers assets/corpus/<id>.<ext>.

Aucun fichier protégé n'est téléchargé : tout vient de VOTRE dossier local.
"""
import json, os, re, shutil, sys, hashlib
from metadata_contract import valide_metadonnees, ajoute_quarantaine

INTERDITS = {"manuel_scolaire_editeur", "livre_commercial", "scan_livre_protege"}
TAILLE_CHUNK = 1200  # mots

# Doit rester aligné sur RAG.termes() dans rag.js : variantes arabes
# attachées et alias Arabizi explicitement contrôlés (pas de traduction libre).
ARABIZI = {
    "chrahli": ["اشرح"], "chrah": ["اشرح"], "fassarli": ["فسر"],
    "jomla": ["الجملة"], "joumla": ["الجملة"], "eljomla": ["الجملة"],
    "ismiya": ["الاسمية"], "ismeya": ["الاسمية"],
    "exemple": ["مثال"], "mithal": ["مثال"], "sahl": ["بسيط"],
    "darja": ["الدارجة"], "derja": ["الدارجة"],
}


def variantes_arabe(mot):
    base = re.sub(r"[\u064B-\u065F\u0670\u0640]", "", str(mot or ""))
    base = re.sub(r"[أإآٱ]", "ا", base).replace("ى", "ي")
    resultat = {base}
    racine = base
    for _ in range(2):
        if len(racine) > 4 and racine.startswith("ال"):
            racine = racine[2:]
            resultat.add(racine)
        elif len(racine) > 3 and racine[:1] in "وفبكل":
            racine = racine[1:]
            resultat.add(racine)
        else:
            break
    return {mot for mot in resultat if len(mot) >= 3}


def termes_index(texte):
    tokens = re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06FF]{3,}", str(texte or "").lower())
    resultat = set()
    for token in tokens:
        if re.search(r"[\u0600-\u06FF]", token):
            resultat.update(variantes_arabe(token))
        else:
            resultat.add(token)
            for alias in ARABIZI.get(token, []):
                resultat.update(variantes_arabe(alias))
    return resultat


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
    docs, index = [], {"version": "1.0.0", "schema": "rag-chunks-v1", "termes": {}, "chunks": []}
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
            try:
                meta = json.load(open(mp, encoding="utf-8"))
            except (OSError, ValueError):
                meta = None
        did = "c-" + hashlib.md5(nom.encode()).hexdigest()[:8]
        erreurs = valide_metadonnees(meta)
        licence = meta.get("licence", "") if isinstance(meta, dict) else ""
        if licence in INTERDITS:
            erreurs.append("catégorie de document interdite")
        if erreurs:
            ajoute_quarantaine({"id": did, "fichier": nom, "format": ext,
                                "statut": "a_verifier", "motifs": erreurs})
            print("  MIS EN QUARANTAINE :", nom, "·", "; ".join(erreurs))
            continue
        texte = {"pdf": texte_pdf, "docx": texte_docx}.get(ext, texte_brut)(chemin)
        docs.append({
            "id": did,
            "titre": meta.get("titre", nom),
            "matiere": meta.get("matiere", "allemand"),
            "niveau": meta.get("niveau", "2AS"),
            "type": meta.get("type", "cours"),
            "annee": meta.get("annee", "2026/2027"),
            "format": ext,
            "url": "assets/corpus/" + did + "." + ext,
            "source": meta["source"],
            "langue": meta["langue"],
            "licence": licence,
            "droits_statut": "verifies",
            "droits_reference": meta["droits_reference"],
            "tags": meta.get("tags", []),
            "extrait": texte[:300].replace("\n", " "),
        })
        for ci, ch in enumerate(chunks(texte)):
            cid = len(index["chunks"])
            index["chunks"].append({"doc": did, "n": ci, "texte": ch})
            for mot in termes_index(ch):
                index["termes"].setdefault(mot, []).append(cid)
        os.makedirs("assets/corpus", exist_ok=True)
        shutil.copy(chemin, "assets/corpus/" + did + "." + ext)
        print("  indexé :", nom, "→", did, "·", len(chunks(texte)), "chunks")
    # Fusionner les chunks existants : une ingestion partielle ne doit pas effacer
    # les documents indexés par l'indexeur PDF ou une ingestion précédente.
    index_path = os.path.join("assets", "bdd", "corpus_chunks_index.json")
    try:
        with open(index_path, encoding="utf-8") as f:
            existant = json.load(f)
    except (OSError, ValueError):
        existant = {"version": "1.0.0", "schema": "rag-chunks-v1", "termes": {}, "chunks": []}
    ids_remplaces = {d["id"] for d in docs}
    conserves = [c for c in existant.get("chunks", []) if c.get("doc") not in ids_remplaces]
    tous_chunks = conserves + index["chunks"]
    # Les postings sont reconstruits depuis les chunks, jamais recopiés avec
    # des positions devenues obsolètes après suppression/remplacement.
    termes = {}
    for cid, chunk in enumerate(tous_chunks):
        chunk["n"] = cid
        for mot in termes_index(chunk.get("texte", "")):
            termes.setdefault(mot, []).append(cid)
    index = {"version": "1.0.0", "schema": "rag-chunks-v1",
             "termes": termes, "chunks": tous_chunks}

    os.makedirs("assets/bdd", exist_ok=True)
    # Mise à jour additive : préserver les champs historiques du registre.
    corpus_path = os.path.join("assets", "bdd", "corpus.json")
    try:
        with open(corpus_path, encoding="utf-8") as f:
            registre = json.load(f)
    except (OSError, ValueError):
        registre = {"_meta": {"version": "1.0.0"}, "documents": []}
    anciens = registre.get("documents", [])
    par_id = {d.get("id"): d for d in anciens if isinstance(d, dict) and d.get("id")}
    par_id.update({d["id"]: d for d in docs})
    registre["documents"] = list(par_id.values())
    with open(corpus_path, "w", encoding="utf-8") as f:
        json.dump(registre, f, ensure_ascii=False, indent=1)
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False)
    print("  corpus.json préservé :", len(registre["documents"]), "documents ·",
          len(index["chunks"]), "chunks RAG séparés")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1])
