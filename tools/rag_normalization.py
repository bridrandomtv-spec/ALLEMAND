#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Normalisation partagée des termes RAG : doit correspondre à rag.js."""
import re

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
    tokens = re.findall(r"[A-Za-zÀ-ÿ]+|[\u0621-\u064A\u066E-\u06D3\u06FA-\u06FC]+", str(texte or "").lower())
    resultat = set()
    for token in tokens:
        if re.search(r"[\u0600-\u06FF]", token):
            resultat.update(variantes_arabe(token))
        else:
            resultat.add(token)
            for alias in ARABIZI.get(token, []):
                resultat.update(variantes_arabe(alias))
    return resultat
