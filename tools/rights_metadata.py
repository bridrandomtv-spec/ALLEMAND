#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validation stricte des droits ET du périmètre d'usage avant ingestion RAG."""
import re
from datetime import date

LICENCES_AUTORISEES = {
    "production_propre", "domaine_public", "autorisation_ecrite", "licence_libre"
}

# Usages nécessaires au pipeline actuel. La redistribution du document intégral
# n'est volontairement PAS implicite et doit faire l'objet d'un droit distinct.
USAGES_REQUIS_INGESTION = {
    "hebergement_source", "extraction_texte", "indexation_rag", "restitution_extraits"
}
USAGES_AUTORISES_CONNUS = USAGES_REQUIS_INGESTION | {
    "ocr", "traduction", "redistribution_document"
}


def valider_metadonnees(meta):
    """Retourne (ok, raison). Licence, preuve humaine et périmètre sont obligatoires."""
    if not isinstance(meta, dict):
        return False, "métadonnées non structurées"
    licence = str(meta.get("licence", "")).strip().lower()
    if licence not in LICENCES_AUTORISEES:
        return False, "type de licence absent ou non reconnu"
    for champ in ("source", "titulaire_droits", "declarant", "date_declaration"):
        if not str(meta.get(champ, "")).strip():
            return False, "champ de provenance/déclaration absent: " + champ
    try:
        date.fromisoformat(str(meta["date_declaration"]))
    except (TypeError, ValueError):
        return False, "date_declaration invalide (AAAA-MM-JJ attendu)"
    if meta.get("declaration_droits") is not True:
        return False, "déclaration explicite du titulaire absente"
    validation = meta.get("validation")
    if not isinstance(validation, dict) or validation.get("statut") != "valide":
        return False, "validation humaine des droits absente"
    for champ in ("verificateur", "date", "reference_preuve"):
        if not str(validation.get(champ, "")).strip():
            return False, "validation incomplète: " + champ
    try:
        date.fromisoformat(str(validation["date"]))
    except (TypeError, ValueError):
        return False, "date de validation invalide"

    usages = meta.get("usages_autorises")
    if not isinstance(usages, list) or not usages:
        return False, "périmètre d'exploitation explicite absent"
    usages_normalises = {str(x).strip().lower() for x in usages if str(x).strip()}
    inconnus = usages_normalises - USAGES_AUTORISES_CONNUS
    if inconnus:
        return False, "usage non reconnu: " + ", ".join(sorted(inconnus))
    manquants = USAGES_REQUIS_INGESTION - usages_normalises
    if manquants:
        return False, "usages requis pour l'ingestion absents: " + ", ".join(sorted(manquants))

    if licence == "licence_libre":
        if not str(meta.get("nom_licence", "")).strip():
            return False, "nom de licence libre absent"
        url = str(meta.get("url_licence", "")).strip()
        if not re.match(r"^https://", url, re.I):
            return False, "URL officielle de licence libre absente"
    elif licence == "domaine_public":
        for champ in ("juridiction", "fondement_juridique"):
            if not str(meta.get(champ, "")).strip():
                return False, "justification domaine public absente: " + champ
    elif licence == "autorisation_ecrite":
        if not str(meta.get("reference_autorisation", "")).strip():
            return False, "référence de l'autorisation écrite absente"
    return True, "validé"


def projection_preuve_droits(meta):
    """Copie minimale et traçable des droits validés dans la fiche catalogue."""
    ok, raison = valider_metadonnees(meta)
    if not ok:
        raise ValueError("preuve de droits non valide: " + raison)
    champs = (
        "licence", "source", "titulaire_droits", "declarant",
        "date_declaration", "declaration_droits", "usages_autorises",
        "nom_licence", "url_licence", "juridiction",
        "fondement_juridique", "reference_autorisation"
    )
    preuve = {champ: meta[champ] for champ in champs if champ in meta}
    preuve["validation"] = dict(meta["validation"])
    preuve["usages_autorises"] = sorted({
        str(usage).strip().lower() for usage in meta["usages_autorises"]
    })
    return preuve
