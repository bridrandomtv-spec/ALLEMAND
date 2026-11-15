#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Contrats communs de provenance et segmentation documentaire."""
import hashlib
import re


def sha256_fichier(path):
    digest = hashlib.sha256()
    with open(path, "rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def decouper_pages(pages, taille=1200):
    """Découpe sans jamais fusionner deux pages PDF dans un même chunk."""
    if not isinstance(taille, int) or isinstance(taille, bool) or taille < 1:
        raise ValueError("taille de chunk invalide")
    chunks = []
    for page_number, page_text in enumerate(pages, start=1):
        words = str(page_text or "").split()
        for offset in range(0, len(words), taille):
            part = words[offset:offset + taille]
            if not part:
                continue
            chunks.append({
                "page_start": page_number,
                "page_end": page_number,
                "texte": " ".join(part)
            })
    return chunks


def fusionner_documents(existants, entrants):
    """Fusion déterministe par ID ; les documents absents du lot sont conservés."""
    if not isinstance(existants, list) or not isinstance(entrants, list):
        raise ValueError("documents existants/entrants doivent être des listes")
    resultat = []
    positions = {}
    for doc in existants + entrants:
        if not isinstance(doc, dict) or not str(doc.get("id", "")).strip():
            raise ValueError("document sans ID valide")
        identifiant = doc["id"]
        if identifiant in positions:
            resultat[positions[identifiant]] = dict(doc)
        else:
            positions[identifiant] = len(resultat)
            resultat.append(dict(doc))
    return resultat


def construire_chunk(global_id, doc_id, numero, texte, sha256, page_start=None, page_end=None):
    if not isinstance(sha256, str) or not re.fullmatch(r"[0-9a-f]{64}", sha256):
        raise ValueError("empreinte SHA-256 source invalide")
    chunk = {
        "global_id": global_id, "doc": doc_id, "n": numero,
        "texte": texte, "source_sha256": sha256
    }
    if page_start is not None or page_end is not None:
        if (not isinstance(page_start, int) or isinstance(page_start, bool) or page_start < 1
                or page_end != page_start):
            raise ValueError("plage de page invalide : un chunk doit rester dans une seule page")
        chunk.update({"page_start": page_start, "page_end": page_end})
    return chunk


def fusionner_index_rag(existant, entrants, docs_remplaces):
    """Fusionne l'index par document et reconstruit les IDs et postings."""
    if not isinstance(existant, dict) or not isinstance(existant.get("chunks"), list):
        raise ValueError("index RAG existant invalide")
    remplaces = set(docs_remplaces)
    if any(not isinstance(c, dict) for c in existant["chunks"]):
        raise ValueError("chunk existant invalide : fusion interrompue sans perte silencieuse")
    conserves = [dict(c) for c in existant["chunks"] if c.get("doc") not in remplaces]
    combines = conserves + [dict(c) for c in entrants]
    chunks, termes = [], {}
    for gid, chunk in enumerate(combines):
        if not isinstance(chunk.get("doc"), str) or not chunk["doc"]:
            raise ValueError("chunk sans document pendant la fusion")
        if not isinstance(chunk.get("texte"), str) or not chunk["texte"].strip():
            raise ValueError("chunk sans texte pendant la fusion")
        chunk["global_id"] = gid
        chunks.append(chunk)
        for terme in set(re.findall(r"[A-Za-zÀ-ÿ\u0600-\u06ff]{3,}", chunk["texte"].lower())):
            termes.setdefault(terme, []).append(gid)
    meta = dict(existant.get("_meta", {}))
    meta.update({"version": "2.1.0", "nb_chunks": len(chunks),
                 "nb_termes": len(termes), "source": "fusion incrémentale"})
    return {"_meta": meta, "chunks": chunks, "termes": termes}


def ecrire_json_transactionnel(artefacts):
    """Prépare plusieurs JSON puis les remplace ; restaure les originaux si un replace échoue.

    Chaque fichier temporaire est créé dans le même répertoire que sa destination,
    afin que os.replace reste atomique à l'échelle du fichier. En cas d'exception
    pendant la séquence, les fichiers déjà remplacés sont restaurés.
    """
    import json
    import os
    import tempfile

    temporaires = {}
    originaux = {}
    remplaces = []
    try:
        for destination, valeur in artefacts.items():
            dossier = os.path.dirname(destination) or "."
            os.makedirs(dossier, exist_ok=True)
            if os.path.isfile(destination):
                with open(destination, "rb") as original:
                    originaux[destination] = original.read()
            else:
                originaux[destination] = None
            fd, temporaire = tempfile.mkstemp(
                prefix=".corpus-tmp-", suffix=".json", dir=dossier
            )
            temporaires[destination] = temporaire
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                json.dump(valeur, stream, ensure_ascii=False, separators=(",", ":"))
                stream.flush()
                os.fsync(stream.fileno())
        for destination, temporaire in temporaires.items():
            os.replace(temporaire, destination)
            remplaces.append(destination)
    except Exception:
        for destination in reversed(remplaces):
            contenu = originaux[destination]
            if contenu is None:
                try:
                    os.remove(destination)
                except FileNotFoundError:
                    pass
            else:
                dossier = os.path.dirname(destination) or "."
                fd, restauration = tempfile.mkstemp(
                    prefix=".corpus-restore-", suffix=".json", dir=dossier
                )
                with os.fdopen(fd, "wb") as stream:
                    stream.write(contenu)
                    stream.flush()
                    os.fsync(stream.fileno())
                os.replace(restauration, destination)
        raise
    finally:
        for temporaire in temporaires.values():
            try:
                os.remove(temporaire)
            except FileNotFoundError:
                pass
