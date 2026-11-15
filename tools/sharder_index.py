import json, os

SRC = os.path.join('assets', 'bdd', 'corpus_rag_index.json')
OUT = os.path.join('assets', 'bdd', 'shards')
MAN = os.path.join('assets', 'bdd', 'shards_manifest.json')
TAILLE = 250


def build_shards(index, taille=TAILLE):
    """Construit des shards en conservant l'identité globale des chunks."""
    if not isinstance(index, dict):
        raise ValueError("index RAG invalide")
    raw_chunks = index.get("chunks", [])
    raw_terms = index.get("termes", {})
    if not isinstance(raw_chunks, list) or not isinstance(raw_terms, dict):
        raise ValueError("schéma RAG invalide: chunks[] et termes{} requis")
    chunks = []
    ids = set()
    for position, raw in enumerate(raw_chunks):
        if not isinstance(raw, dict):
            raise ValueError("chunk invalide à la position %d" % position)
        chunk = dict(raw)
        gid = chunk.get("global_id", position)
        if not isinstance(gid, int) or isinstance(gid, bool) or gid < 0:
            raise ValueError("global_id invalide à la position %d" % position)
        if gid in ids:
            raise ValueError("global_id dupliqué: %d" % gid)
        chunk["global_id"] = gid
        ids.add(gid)
        chunks.append(chunk)

    for term, postings in raw_terms.items():
        if not isinstance(postings, list):
            raise ValueError("postings invalides pour le terme %s" % term)
        for posting in postings:
            if not isinstance(posting, int) or isinstance(posting, bool) or posting not in ids:
                raise ValueError("posting sans chunk correspondant: %r (%s)" % (posting, term))

    shards = []
    for start in range(0, len(chunks), taille):
        part = chunks[start:start + taille]
        shard_ids = {chunk["global_id"] for chunk in part}
        terms = {
            term: [posting for posting in postings if posting in shard_ids]
            for term, postings in raw_terms.items()
        }
        terms = {term: postings for term, postings in terms.items() if postings}
        shards.append({
            "file": "shard_%02d.json" % (start // taille),
            "chunks": part,
            "termes": terms,
        })
    manifest = {
        "version": "2.0.0",
        "nb_shards": len(shards),
        "total_chunks": len(chunks),
        "shards": [
            {"file": shard["file"], "nb_chunks": len(shard["chunks"]),
             "nb_termes": len(shard["termes"])}
            for shard in shards
        ],
    }
    return shards, manifest


def main():
    with open(SRC, encoding="utf-8") as source:
        index = json.load(source)
    shards, manifest = build_shards(index)
    os.makedirs(OUT, exist_ok=True)
    # Écriture après validation complète : un index invalide ne détruit pas les anciens shards.
    for filename in os.listdir(OUT):
        if filename.startswith("shard_") and filename.endswith(".json"):
            os.remove(os.path.join(OUT, filename))
    for shard in shards:
        with open(os.path.join(OUT, shard["file"]), "w", encoding="utf-8") as target:
            json.dump({"chunks": shard["chunks"], "termes": shard["termes"]},
                      target, ensure_ascii=False, separators=(",", ":"))
    with open(MAN, "w", encoding="utf-8") as target:
        json.dump(manifest, target, ensure_ascii=False, separators=(",", ":"))
    print("shards:", len(shards), "- total chunks:", manifest["total_chunks"])


if __name__ == "__main__":
    main()
