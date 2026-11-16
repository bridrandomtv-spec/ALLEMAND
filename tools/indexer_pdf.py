#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""tools/indexer_pdf.py - extrait le texte des PDF (couche texte OU OCR) et indexe.
Si le PDF n'a pas de couche texte, OCR via tesseract (deu+ara) si disponible.
Ne copie AUCUN fichier : url = chemin d'origine.
Usage : python tools/indexer_pdf.py docs/archive/documents
"""
import json, os, re, sys
from metadata_contract import valide_metadonnees, ajoute_quarantaine
from rag_normalization import termes_index
CORPUS = os.path.join('assets', 'bdd', 'corpus.json')
INDEX = os.path.join('assets', 'bdd', 'corpus_chunks_index.json')
CHUNK_MOTS = 1200
OCR_DISPO = None
def _init_ocr():
    global OCR_DISPO
    if OCR_DISPO is not None:
        return OCR_DISPO
    try:
        import pytesseract, pdf2image
        from pdf2image import convert_from_path
        pytesseract.get_tesseract_version()
        OCR_DISPO = True
    except Exception:
        OCR_DISPO = False
    return OCR_DISPO

def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')[:60]

def texte_pdf(ch):
    try:
        from pypdf import PdfReader
        return '\n'.join((p.extract_text() or '') for p in PdfReader(ch).pages)
    except Exception:
        return ''

def ocr_pdf(ch, max_pages=40):
    if not _init_ocr():
        return ''
    try:
        from pdf2image import convert_from_path
        import pytesseract
        imgs = convert_from_path(ch, dpi=200, first_page=1, last_page=max_pages)
        return '\n'.join(pytesseract.image_to_string(i, lang='deu+ara') for i in imgs)
    except Exception:
        return ''

def chunks(t):
    m = t.split()
    return [' '.join(m[i:i+CHUNK_MOTS]) for i in range(0, len(m), CHUNK_MOTS)]

def main(dossier):
    corp = json.load(open(CORPUS, encoding='utf-8'))
    try:
        idx = json.load(open(INDEX, encoding='utf-8'))
    except (OSError, ValueError):
        idx = {'version': '1.0.0', 'schema': 'rag-chunks-v1', 'termes': {}, 'chunks': []}
    docs = corp.setdefault('documents', [])
    chunks_l = idx.setdefault('chunks', [])
    termes = idx.setdefault('termes', {})

    # Pré-valider les PDF : un fichier sans preuve de droits ou sans métadonnées
    # complètes reste en quarantaine et ne remplace pas une version déjà indexée.
    candidats = []
    for nom in sorted(os.listdir(dossier)):
        if not nom.lower().endswith('.pdf'):
            continue
        ch = os.path.join(dossier, nom)
        meta_path = os.path.join(dossier, '_' + nom.rsplit('.', 1)[0] + '.json')
        try:
            meta = json.load(open(meta_path, encoding='utf-8'))
        except (OSError, ValueError):
            meta = None
        erreurs = valide_metadonnees(meta)
        did = 'pdf-' + slug(nom)
        if erreurs:
            ajoute_quarantaine({'id': did, 'fichier': nom, 'format': 'pdf',
                                'statut': 'a_verifier', 'motifs': erreurs})
            print('  MIS EN QUARANTAINE :', nom, '·', '; '.join(erreurs))
            continue
        candidats.append((nom, ch, did, meta))

    ids_remplaces = {item[2] for item in candidats}
    docs[:] = [d for d in docs if d.get('id') not in ids_remplaces]
    chunks_l[:] = [c for c in chunks_l if c.get('doc') not in ids_remplaces]
    # Réindexer les chunks conservés avant de créer de nouveaux postings.
    for cid, chunk in enumerate(chunks_l):
        chunk['n'] = cid
    termes.clear()
    for cid, chunk in enumerate(chunks_l):
        for mot in termes_index(chunk.get('texte', '')):
            termes.setdefault(mot, []).append(cid)

    nb_doc = nb_chunk = nb_scan = nb_ocr = 0
    for nom, ch, did, meta in candidats:
        t = texte_pdf(ch)
        via = 'texte'
        if len(t.strip()) < 60:
            t = ocr_pdf(ch)
            via = 'ocr'
            if len(t.strip()) >= 60:
                nb_ocr += 1
        if len(t.strip()) < 60:
            nb_scan += 1
            docs.append({'id': did, 'titre': meta['titre'], 'matiere': meta['matiere'],
                         'niveau': meta['niveau'], 'type': 'scan', 'langue': meta['langue'],
                         'annee': meta.get('annee', ''), 'format': 'pdf', 'url': ch,
                         'source': meta['source'], 'licence': meta['licence'],
                         'droits_statut': 'verifies', 'droits_reference': meta['droits_reference'],
                         'tags': meta.get('tags', []) + ['scan'],
                         'extrait': '(scan sans couche texte - OCR indisponible)'})
            nb_doc += 1
            continue
        docs.append({'id': did, 'titre': meta['titre'], 'matiere': meta['matiere'],
                     'niveau': meta['niveau'], 'type': meta['type'], 'langue': meta['langue'],
                     'annee': meta.get('annee', ''), 'format': 'pdf', 'url': ch,
                     'source': meta['source'], 'licence': meta['licence'],
                     'droits_statut': 'verifies', 'droits_reference': meta['droits_reference'],
                     'tags': meta.get('tags', []) + ['pdf', via],
                     'extrait': t[:300].replace('\n', ' ')})
        nb_doc += 1
        for cc in chunks(t):
            cid = len(chunks_l)
            chunks_l.append({'doc': did, 'n': cid, 'texte': cc})
            nb_chunk += 1
            for mot in termes_index(cc):
                termes.setdefault(mot, []).append(cid)

    idx['version'] = '1.0.0'
    idx['schema'] = 'rag-chunks-v1'
    idx['_meta'] = {'version': '3.0.0', 'nb_chunks': len(chunks_l),
                    'nb_termes': len(termes), 'ocr': nb_ocr,
                    'source': 'corpus + documents PDF validés'}
    json.dump(corp, open(CORPUS, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump(idx, open(INDEX, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('indexe : %d docs (%d via OCR, %d scans restants), %d nouveaux chunks' %
          (nb_doc, nb_ocr, nb_scan, nb_chunk))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join('docs', 'archive', 'documents'))
