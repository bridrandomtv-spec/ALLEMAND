#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Validation stricte des déclarations de droits avant ingestion RAG."""
import re
from datetime import date

LICENCES_AUTORISEES = {
    "production_propre", "domaine_public", "autorisation_ecrite", "licence_libre"
}


def valider_metadonnees(meta):
    """Retourne (ok, raison). Une simple étiquette de licence ne suffit pas."""
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
