#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construit des shards depuis le seul index RAG corpus_rag_index.json."""
import json
import os
import re

SRC = os.path.join("assets", "bdd", "corpus_rag_index.json")
OUT = os.path.join("assets", "bdd", "shards")
MAN = os.path.join("assets", "bdd", "shards_manifest.json")
TAILLE = 250


def build_shards(index, taille=TAILLE):
    if not isinstance(index, dict):
        raise ValueError("index RAG invalide")
    raw_chunks, raw_terms = index.get("chunks"), index.get("termes")
    if not isinstance(raw_chunks, list) or not isinstance(raw_terms, dict):
        raise ValueError("schéma RAG invalide: chunks[] et termes{} requis")
    if not raw_chunks:
        raise ValueError("index RAG vide: refus de publier un manifeste sans shard")
    if not isinstance(taille, int) or taille < 1:
        raise ValueError("taille de shard invalide")

    chunks, ids = [], set()
    for position, raw in enumerate(raw_chunks):
        if not isinstance(raw, dict):
            raise ValueError("chunk invalide à la position %d" % position)
        chunk = dict(raw)
        gid = chunk.get("global_id")
        if not isinstance(gid, int) or isinstance(gid, bool) or gid < 0 or gid in ids:
            raise ValueError("global_id absent, invalide ou dupliqué à la position %d" % position)
        if not isinstance(chunk.get("doc"), str) or not chunk["doc"] or not isinstance(chunk.get("texte"), str) or not chunk["texte"].strip():
            raise ValueError("document/texte absent pour le chunk %d" % gid)
        ids.add(gid)
        chunks.append(chunk)

    for term, postings in raw_terms.items():
        if not isinstance(term, str) or not term.strip() or not isinstance(postings, list):
            raise ValueError("terme ou postings invalides: %r" % term)
        vus_postings = set()
        for posting in postings:
            if not isinstance(posting, int) or isinstance(posting, bool) or posting not in ids:
                raise ValueError("posting sans chunk correspondant: %r (%s)" % (posting, term))
            if posting in vus_postings:
                raise ValueError("posting dupliqué pour le terme %s" % term)
            vus_postings.add(posting)

    shards = []
    for start in range(0, len(chunks), taille):
        part = chunks[start:start + taille]
        shard_ids = {c["global_id"] for c in part}
        terms = {term: [pid for pid in postings if pid in shard_ids]
                 for term, postings in raw_terms.items()}
        terms = {term: postings for term, postings in terms.items() if postings}
        shards.append({"file": "shard_%02d.json" % (start // taille),
                       "chunks": part, "termes": terms})
    manifest = {"version": "2.0.0", "nb_shards": len(shards),
                "total_chunks": len(chunks),
                "shards": [{"file": s["file"], "nb_chunks": len(s["chunks"]),
                            "nb_termes": len(s["termes"])} for s in shards]}
    return shards, manifest


def ecrire_atomiquement(path, value):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(value, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, path)


def main():
    with open(SRC, encoding="utf-8") as f:
        index = json.load(f)
    shards, manifest = build_shards(index)
    os.makedirs(OUT, exist_ok=True)
    # Tous les shards sont écrits avant de remplacer le manifeste public.
    for shard in shards:
        ecrire_atomiquement(os.path.join(OUT, shard["file"]),
                            {"chunks": shard["chunks"], "termes": shard["termes"]})
    attendus = {s["file"] for s in shards}
    for filename in os.listdir(OUT):
        if re.fullmatch(r"shard_[0-9]{2,}\.json", filename) and filename not in attendus:
            os.remove(os.path.join(OUT, filename))
    ecrire_atomiquement(MAN, manifest)
    print("shards:", len(shards), "- total chunks:", manifest["total_chunks"])


if __name__ == "__main__":
    main()
