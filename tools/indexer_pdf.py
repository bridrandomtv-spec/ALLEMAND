#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
# trigger: indexation initiale des 265 PDF de docs/archive/documents
tools/indexer_pdf.py - extrait le texte des PDF d'un dossier et indexe dans le corpus.
Ne copie AUCUN fichier : seule la texte est indexe (url = chemin d'origine).
Usage : python tools/indexer_pdf.py docs/archive/documents
"""
import json, os, re, sys
CORPUS = os.path.join('assets', 'bdd', 'corpus.json')
INDEX = os.path.join('assets', 'bdd', 'corpus_index.json')
CHUNK_MOTS = 1200

def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')[:60]

def texte_pdf(ch):
    try:
        from pypdf import PdfReader
        return '\n'.join((p.extract_text() or '') for p in PdfReader(ch).pages)
    except Exception:
        return ''

def chunks(t):
    m = t.split()
    return [' '.join(m[i:i+CHUNK_MOTS]) for i in range(0, len(m), CHUNK_MOTS)]

def main(dossier):
    corp = json.load(open(CORPUS, encoding='utf-8'))
    idx = json.load(open(INDEX, encoding='utf-8'))
    docs = corp.setdefault('documents', [])
    chunks_l = idx.setdefault('chunks', [])
    termes = idx.setdefault('termes', {})
    # retire les anciennes entrees du meme dossier (idempotence)
    prefix = 'pdf-'
    ids_avant = {d['id'] for d in docs if d['id'].startswith(prefix)}
    docs[:] = [d for d in docs if not d['id'].startswith(prefix)]
    garder = []
    for i, c in enumerate(chunks_l):
        if c.get('doc', '').startswith(prefix):
            continue
        garder.append(c)
    chunks_l[:] = garder
    for k in list(termes):
        termes[k] = [i for i in termes[k] if i < len(chunks_l)]
        if not termes[k]:
            del termes[k]
    nb_doc = nb_chunk = nb_scan = 0
    for nom in sorted(os.listdir(dossier)):
        if not nom.lower().endswith('.pdf'):
            continue
        ch = os.path.join(dossier, nom)
        t = texte_pdf(ch)
        did = prefix + slug(nom)
        if len(t.strip()) < 60:
            nb_scan += 1
            docs.append({'id': did, 'titre': nom, 'matiere': 'allemand',
                         'niveau': '2AS/3AS', 'type': 'scan', 'langue': 'de',
                         'annee': '2026/2027', 'format': 'pdf', 'url': ch,
                         'source': 'docs archive eleve', 'licence': 'document utilisateur',
                         'tags': ['scan'], 'extrait': '(scan sans couche texte - OCR requis)'})
            nb_doc += 1
            continue
        docs.append({'id': did, 'titre': nom, 'matiere': 'allemand',
                     'niveau': '2AS/3AS', 'type': 'document', 'langue': 'de',
                     'annee': '2026/2027', 'format': 'pdf', 'url': ch,
                     'source': 'docs archive eleve', 'licence': 'document utilisateur',
                     'tags': ['pdf'], 'extrait': t[:300].replace('\n', ' ')})
        nb_doc += 1
        for cc in chunks(t):
            cid = len(chunks_l)
            chunks_l.append({'doc': did, 'n': cid, 'texte': cc})
            nb_chunk += 1
            for mot in set(re.findall(r'[A-Za-z\u00c0-\u00ff\u0600-\u06ff]{3,}', cc.lower())):
                termes.setdefault(mot, []).append(cid)
    idx['_meta'] = {'version': '2.0.0', 'nb_chunks': len(chunks_l),
                    'nb_termes': len(termes), 'source': 'corpus + docs archive eleve (PDF)'}
    json.dump(corp, open(CORPUS, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump(idx, open(INDEX, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('indexe : %d documents (%d scans sans texte), %d chunks' % (nb_doc, nb_scan, nb_chunk))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join('docs', 'archive', 'documents'))
