#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ingestion multi-format non destructive avec provenance et droits explicites.

Chaque fichier doit posséder un sidecar _<nom>.json validé par rights_metadata.
Le catalogue et l'index RAG existants sont fusionnés ; les données sans rapport
avec le lot entrant sont conservées. Aucun document non autorisé n'est copié.
"""
import hashlib
import json
import os
import re
import shutil
import sys

try:
    from tools.rights_metadata import LICENCES_AUTORISEES, valider_metadonnees
    from tools.corpus_contracts import (
        sha256_fichier, decouper_pages, fusionner_documents, construire_chunk,
        fusionner_index_rag, ecrire_json_transactionnel
    )
except ModuleNotFoundError:  # exécution directe
    from rights_metadata import LICENCES_AUTORISEES, valider_metadonnees
    from corpus_contracts import (
        sha256_fichier, decouper_pages, fusionner_documents, construire_chunk,
        fusionner_index_rag, ecrire_json_transactionnel
    )

TAILLE_CHUNK = 1200
BDD = os.path.join("assets", "bdd")
CORPUS = os.path.join(BDD, "corpus.json")
INDEX = os.path.join(BDD, "corpus_rag_index.json")
DESTINATION = os.path.join("assets", "corpus")
EXTENSIONS = ("pdf", "docx", "txt", "md")


def extraire_pages(chemin, ext):
    if ext == "pdf":
        from pypdf import PdfReader
        return [(p.extract_text() or "") for p in PdfReader(chemin).pages]
    if ext == "docx":
        import docx
        return ["\n".join(p.text for p in docx.Document(chemin).paragraphs)]
    with open(chemin, encoding="utf-8", errors="ignore") as stream:
        return [stream.read()]


def lire_json_existant(path, cle, valeur_defaut):
    if not os.path.isfile(path):
        return valeur_defaut
    with open(path, encoding="utf-8") as stream:
        data = json.load(stream)
    if not isinstance(data, dict) or not isinstance(data.get(cle), type(valeur_defaut)):
        raise ValueError("Artefact existant invalide : " + path)
    return data[cle]


def construire(dossier, documents_existants=None):
    if not os.path.isdir(dossier):
        raise FileNotFoundError("Dossier source absent: " + dossier)
    entrants, index = [], {"_meta": {"version": "2.1.0"}, "termes": {}, "chunks": []}
    fichiers_copies = []
    ignores = 0
    for nom in sorted(os.listdir(dossier)):
        chemin = os.path.join(dossier, nom)
        if not os.path.isfile(chemin):
            continue
        ext = os.path.splitext(nom)[1].lower().lstrip(".")
        if ext not in EXTENSIONS or nom.startswith("_"):
            continue
        base = os.path.splitext(nom)[0]
        sidecar = os.path.join(dossier, "_" + base + ".json")
        if not os.path.isfile(sidecar):
            print("IGNORE (métadonnées/licence absentes):", nom)
            ignores += 1
            continue
        with open(sidecar, encoding="utf-8") as stream:
            meta = json.load(stream)
        ok_droits, raison = valider_metadonnees(meta)
        if not ok_droits:
            print("IGNORE (droits non vérifiés):", nom, "-", raison)
            ignores += 1
            continue
        pages = extraire_pages(chemin, ext)
        texte = "\n".join(pages).strip()
        if len(texte) < 20:
            print("IGNORE (contenu extrait insuffisant):", nom)
            ignores += 1
            continue
        digest = sha256_fichier(chemin)
        did = "c-" + hashlib.sha256(nom.encode("utf-8")).hexdigest()[:16]
        doc = {
            "id": did, "titre": meta.get("titre", nom),
            "matiere": meta.get("matiere", "allemand"),
            "niveau": meta.get("niveau", "2AS"),
            "type": meta.get("type", "cours"),
            "langue": meta.get("langue", "de"),
            "annee": meta.get("annee", "2026/2027"),
            "format": ext, "url": "assets/corpus/" + did + "." + ext,
            "source_sha256": digest, "source": meta.get("source", "document local"),
            "licence": str(meta.get("licence", "")).strip().lower(),
            "tags": meta.get("tags", []), "extrait": texte[:300].replace("\n", " ")
        }
        entrants.append(doc)
        fichiers_copies.append((chemin, doc["url"]))
        if ext == "pdf":
            parties = decouper_pages(pages, TAILLE_CHUNK)
        else:
            parties = [{"texte": part, "page_start": None, "page_end": None}
                       for part in (" ".join(texte.split()[i:i + TAILLE_CHUNK])
                                    for i in range(0, len(texte.split()), TAILLE_CHUNK))]
        for numero, partie in enumerate(parties):
            gid = len(index["chunks"])
            index["chunks"].append(construire_chunk(
                gid, did, numero, partie["texte"], digest,
                partie["page_start"], partie["page_end"]
            ))
    if not index["chunks"]:
        raise RuntimeError("Aucun chunk autorisé : aucun artefact existant ne sera remplacé.")
    index = fusionner_index_rag({"_meta": {}, "chunks": []}, index["chunks"], [])
    catalogue = fusionner_documents(documents_existants or [], entrants)
    return catalogue, index, ignores, fichiers_copies


def publier_sources_et_artefacts(copies, artefacts):
    """Publie les sources puis les JSON ; restaure les sources si une étape échoue."""
    import tempfile

    temporaires = {}
    sauvegardes = {}
    touches = []
    publication_reussie = False
    try:
        # Préparer toutes les copies avant de toucher aux fichiers de destination.
        for source, cible in copies:
            dossier = os.path.dirname(cible) or "."
            os.makedirs(dossier, exist_ok=True)
            fd, temporaire = tempfile.mkstemp(
                prefix=".corpus-source-tmp-", dir=dossier
            )
            os.close(fd)
            temporaires[cible] = temporaire
            shutil.copy2(source, temporaire)

        # Conserver les anciennes sources pour pouvoir annuler un lot partiel.
        for cible, temporaire in temporaires.items():
            if os.path.exists(cible):
                fd, sauvegarde = tempfile.mkstemp(
                    prefix=".corpus-source-backup-", dir=os.path.dirname(cible) or "."
                )
                os.close(fd)
                os.remove(sauvegarde)
                os.replace(cible, sauvegarde)
                sauvegardes[cible] = sauvegarde
            else:
                sauvegardes[cible] = None
            touches.append(cible)
            os.replace(temporaire, cible)

        ecrire_json_transactionnel(artefacts)
        publication_reussie = True
    except Exception:
        for cible in reversed(touches):
            sauvegarde = sauvegardes.get(cible)
            try:
                if os.path.exists(cible):
                    os.remove(cible)
                if sauvegarde and os.path.exists(sauvegarde):
                    os.replace(sauvegarde, cible)
            except OSError:
                # Ne pas masquer l'exception initiale ; laisser la sauvegarde
                # sur disque si la restauration elle-même échoue.
                pass
        raise
    finally:
        chemins_a_supprimer = list(temporaires.values())
        if publication_reussie:
            chemins_a_supprimer += [p for p in sauvegardes.values() if p]
        for chemin in chemins_a_supprimer:
            try:
                os.remove(chemin)
            except FileNotFoundError:
                pass


def main(dossier):
    docs_existants = lire_json_existant(CORPUS, "documents", [])
    chunks_existants = lire_json_existant(INDEX, "chunks", [])
    index_existant = {"_meta": {}, "chunks": chunks_existants}
    catalogue, index_nouveau, ignores, copies = construire(dossier, docs_existants)
    ids_importes = {os.path.basename(cible).rsplit(".", 1)[0] for _, cible in copies}
    # N'enlève de l'index que les versions remplacées par ce lot.
    index_final = fusionner_index_rag(index_existant, index_nouveau["chunks"], ids_importes)
    corpus_final = {"_meta": {"version": "2.1.0", "nb": len(catalogue)},
                    "documents": catalogue}
    valider_coherence_catalogue_index(corpus_final, index_final)
    # Les sources et les JSON forment un seul lot : rollback des copies si
    # la publication du catalogue/index échoue.
    os.makedirs(DESTINATION, exist_ok=True)
    publier_sources_et_artefacts(
        copies, {INDEX: index_final, CORPUS: corpus_final}
    )
    print("Documents:", len(catalogue), "| chunks:", len(index_final["chunks"]),
          "| ignorés:", ignores)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
