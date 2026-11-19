#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build a protected RAG vector artifact from rights-approved corpus chunks.

Default mode is a local dry-run. A Cloudflare Workers AI request requires BOTH
--execute and --confirm-cloudflare-billing, plus environment credentials.
No third-party Python dependency is required.
"""
import argparse
import hashlib
import json
import math
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

MODEL = "@cf/google/embeddinggemma-2"
DIMENSIONS = 256
ALLOWED_LICENSES = {
    "production_propre", "domaine_public", "cc_by", "cc_by_sa",
    "autorisation_ecrite",
}
DEFAULT_BATCH_SIZE = 8
MAX_BATCH_SIZE = 32
MAX_RETRIES = 2


def sha256_bytes(value):
    return hashlib.sha256(value).hexdigest()


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def eligible_chunks(corpus, manifest):
    if not isinstance(corpus, dict) or corpus.get("version") != 1:
        raise ValueError("corpus_version_invalide")
    if not isinstance(manifest, dict) or manifest.get("version") != 1:
        raise ValueError("manifest_version_invalide")
    documents = corpus.get("documents")
    chunks = corpus.get("chunks")
    if not isinstance(documents, list) or not isinstance(chunks, list):
        raise ValueError("corpus_schema_invalide")
    if manifest.get("document_count") != len(documents):
        raise ValueError("manifest_document_count_incoherent")
    if manifest.get("chunk_count") != len(chunks):
        raise ValueError("manifest_chunk_count_incoherent")

    approved = {}
    known_documents = set()
    expected_chunk_counts = {}
    for doc in documents:
        if not isinstance(doc, dict) or not isinstance(doc.get("id"), str) or not doc["id"].strip():
            raise ValueError("document_id_absent_ou_invalide")
        document_id = doc["id"]
        if document_id in known_documents:
            raise ValueError("document_id_duplique")
        known_documents.add(document_id)
        declared_count = doc.get("chunk_count")
        if isinstance(declared_count, bool) or not isinstance(declared_count, int) or declared_count < 0:
            raise ValueError("document_chunk_count_absent_ou_invalide")
        expected_chunk_counts[document_id] = declared_count
        if doc.get("rights_confirmed") is True and doc.get("license") in ALLOWED_LICENSES:
            approved[document_id] = str(doc.get("title") or "none")[:240]
    result, seen_chunks, actual_chunk_counts = [], set(), {doc_id: 0 for doc_id in known_documents}
    for chunk in chunks:
        if not isinstance(chunk, dict):
            raise ValueError("chunk_entree_invalide")
        chunk_id, doc_id, body = chunk.get("id"), chunk.get("document_id"), chunk.get("text")
        if not isinstance(chunk_id, str) or not chunk_id.strip() or chunk_id in seen_chunks:
            raise ValueError("chunk_id_absent_ou_duplique")
        if not isinstance(doc_id, str) or not doc_id.strip():
            raise ValueError("chunk_document_id_absent_ou_invalide")
        if doc_id not in known_documents:
            raise ValueError("chunk_document_id_inconnu")
        seen_chunks.add(chunk_id)
        actual_chunk_counts[doc_id] += 1
        if doc_id not in approved:
            continue
        if not isinstance(body, str) or not body.strip():
            raise ValueError("chunk_texte_vide")
        result.append({
            "chunk_id": chunk_id,
            "doc_id": doc_id,
            "title": approved[doc_id],
            "text": body.strip(),
        })
    for doc_id, expected in expected_chunk_counts.items():
        if actual_chunk_counts[doc_id] != expected:
            raise ValueError("document_chunk_count_incoherent:" + doc_id)
    return result


def document_input(chunk):
    return "title: " + chunk["title"] + " | text: " + chunk["text"]


def normalize_embedding(values):
    if not isinstance(values, list) or len(values) != DIMENSIONS:
        raise ValueError("embedding_dimension_invalide")
    vector = []
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("embedding_valeur_invalide")
        try:
            number = float(value)
        except (OverflowError, ValueError) as exc:
            raise ValueError("embedding_valeur_invalide") from exc
        if not math.isfinite(number):
            raise ValueError("embedding_non_fini")
        vector.append(number)
    norm = math.sqrt(sum(value * value for value in vector))
    if not math.isfinite(norm) or norm <= 0:
        raise ValueError("embedding_norme_invalide")
    return [value / norm for value in vector]


def parse_embeddings(payload, expected_count):
    if not isinstance(payload, dict):
        raise ValueError("reponse_api_invalide")
    body = payload.get("result", payload)
    data = body.get("data") if isinstance(body, dict) else None
    if not isinstance(data, list) or len(data) != expected_count:
        raise ValueError("nombre_embeddings_invalide")
    ordered = [None] * expected_count
    for item in data:
        if not isinstance(item, dict):
            raise ValueError("embedding_entree_invalide")
        index = item.get("index")
        if isinstance(index, bool) or not isinstance(index, int) or not 0 <= index < expected_count:
            raise ValueError("embedding_index_invalide")
        if ordered[index] is not None:
            raise ValueError("embedding_index_duplique")
        ordered[index] = normalize_embedding(item.get("embedding"))
    if any(item is None for item in ordered):
        raise ValueError("embedding_index_manquant")
    return ordered


def call_cloudflare(inputs, account_id, token, timeout=45, opener=None):
    url = (
        "https://api.cloudflare.com/client/v4/accounts/"
        + account_id + "/ai/run/" + MODEL
    )
    body = json.dumps({"input": inputs, "dimensions": DIMENSIONS}).encode("utf-8")
    request = urllib.request.Request(
        url, data=body, method="POST",
        headers={
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    open_request = opener or urllib.request.urlopen
    for attempt in range(MAX_RETRIES + 1):
        try:
            with open_request(request, timeout=timeout) as response:
                result = json.loads(response.read().decode("utf-8"))
            if isinstance(result, dict) and result.get("success") is False:
                raise RuntimeError("cloudflare_inference_refusee")
            return result
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or attempt >= MAX_RETRIES:
                raise RuntimeError("cloudflare_http_" + str(exc.code)) from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            if attempt >= MAX_RETRIES:
                raise RuntimeError("cloudflare_reseau_indisponible") from exc
        if attempt < MAX_RETRIES:
            time.sleep(2 ** attempt)
    raise RuntimeError("cloudflare_retries_epuises")


def build_artifact(chunks, chunks_bytes, manifest_bytes, embed_batch=None, batch_size=DEFAULT_BATCH_SIZE):
    if not 1 <= batch_size <= MAX_BATCH_SIZE:
        raise ValueError("taille_lot_invalide")
    vectors = []
    for offset in range(0, len(chunks), batch_size):
        batch = chunks[offset:offset + batch_size]
        if embed_batch is None:
            raise ValueError("embedding_callback_requis")
        embeddings = embed_batch([document_input(item) for item in batch])
        if len(embeddings) != len(batch):
            raise ValueError("nombre_embeddings_invalide")
        for item, embedding in zip(batch, embeddings):
            vectors.append({
                "chunk_id": item["chunk_id"],
                "document_id": item["doc_id"],
                "embedding": normalize_embedding(embedding),
            })
    return {
        "version": 1,
        "model": MODEL,
        "dimensions": DIMENSIONS,
        "normalization": "l2",
        "source_chunks_sha256": sha256_bytes(chunks_bytes),
        "source_manifest_sha256": sha256_bytes(manifest_bytes),
        "vectors": vectors,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--chunks", default="assets/bdd/corpus_rag_chunks.json")
    parser.add_argument("--manifest", default="assets/bdd/corpus_rag_manifest.json")
    parser.add_argument("--output", default="assets/bdd/corpus_rag_vectors.json")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    parser.add_argument("--execute", action="store_true", help="Call Cloudflare Workers AI")
    parser.add_argument("--confirm-cloudflare-billing", action="store_true",
                        help="Explicitly acknowledge Workers AI quota/billing use")
    args = parser.parse_args(argv)
    try:
        chunks_path, manifest_path = Path(args.chunks), Path(args.manifest)
        output = Path(args.output)
        if output.resolve() in {chunks_path.resolve(), manifest_path.resolve()}:
            raise ValueError("sortie_confondue_avec_source")
        chunks_bytes, manifest_bytes = chunks_path.read_bytes(), manifest_path.read_bytes()
        corpus = json.loads(chunks_bytes.decode("utf-8"))
        manifest = json.loads(manifest_bytes.decode("utf-8"))
        if not isinstance(manifest.get("chunks_sha256"), str) or manifest["chunks_sha256"] != sha256_bytes(chunks_bytes):
            raise ValueError("manifest_chunks_sha256_invalide")
        if not 1 <= args.batch_size <= MAX_BATCH_SIZE:
            raise ValueError("taille_lot_invalide")
        chunks = eligible_chunks(corpus, manifest)
        if not args.execute:
            print(json.dumps({
                "mode": "dry-run",
                "approved_chunks": len(chunks),
                "batch_size": args.batch_size,
                "batches": (len(chunks) + args.batch_size - 1) // args.batch_size,
                "api_calls": 0,
                "output_written": False,
            }, ensure_ascii=False, indent=2))
            return 0
        if not args.confirm_cloudflare_billing:
            raise ValueError("confirmation_facturation_cloudflare_requise")
        account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
        token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
        if not account_id or not token or len(account_id) != 32 or any(c not in "0123456789abcdefABCDEF" for c in account_id):
            raise ValueError("identifiants_cloudflare_absents_ou_invalides")
        if not chunks:
            raise ValueError("aucun_chunk_avec_droits_confirmes")
        def embed(inputs):
            response = call_cloudflare(inputs, account_id, token)
            return parse_embeddings(response, len(inputs))
        artifact = build_artifact(chunks, chunks_bytes, manifest_bytes, embed, args.batch_size)
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_suffix(output.suffix + ".tmp")
        temporary.write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        temporary.replace(output)
        print(json.dumps({"mode": "executed", "vectors": len(artifact["vectors"]), "output": str(output)}, indent=2))
        return 0
    except (OSError, ValueError, json.JSONDecodeError, RuntimeError) as exc:
        print("ERREUR:", str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
