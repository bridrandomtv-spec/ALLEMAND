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
