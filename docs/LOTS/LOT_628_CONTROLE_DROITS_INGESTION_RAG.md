# Lot 628 — contrôle des droits avant conversion et injection RAG

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## 1. Clarification de principe

La conversion PDF → texte ne crée pas de droit d'exploitation. Une étiquette de licence inventée, ou la seule mention « document utilisateur », ne prouve ni la titularité des droits ni l'autorisation de reproduire/indexer le document. Le pipeline ne doit pas transformer une simple présence dans le dépôt en permission d'alimenter le RAG.

Les livres 2AS/3AS déjà convertis constituent un précédent technique d'extraction et de structuration ; cette opération ne suffit pas à établir les droits sur les autres documents.

## 2. État réel du registre

Lecture de `assets/bdd/corpus.json` :
- 239 fiches documentaires.
- 225 fiches PDF, toutes étiquetées historiquement `document utilisateur`.
- Répartition de toutes les fiches : 4 `production propre`, 8 `usage pédagogique`, 2 déclarations explicites de documents fournis par l'utilisateur, 225 `document utilisateur`.
- Les 225 valeurs `document utilisateur` ne sont pas des licences reconnues par l'indexeur et ne démontrent pas les droits d'exploitation.
- L'inventaire Git précédent trouvait 264 PDF dans le dossier d'archives et 29 PDF hors de ce dossier. Le registre n'en catalogue donc pas nécessairement la totalité.

Aucune licence n'a été inventée et aucun texte PDF n'a été injecté.

## 3. Durcissement du pipeline

Nouveau module `tools/rights_metadata.py` : un simple champ `licence` n'est plus suffisant. L'indexation exige désormais :
- un type de licence admis ;
- la source et le titulaire des droits ;
- l'identité du déclarant et une date de déclaration ISO ;
- une déclaration explicite du titulaire ;
- une validation humaine avec vérificateur, date et référence de preuve ;
- pour une licence libre : nom et URL HTTPS de la licence ;
- pour le domaine public : juridiction et fondement juridique ;
- pour une autorisation écrite : référence de l'autorisation.

Les deux chemins d'ingestion (`tools/indexer_pdf.py` et `tools/ingest_corpus.py`) appliquent ce validateur avant extraction/indexation et avant copie dans `assets/corpus/`. Les scripts supportent leur exécution directe par les workflows et l'import comme module.

Tests ajoutés dans `tests/test_corpus_pipeline.py` : refus d'une simple étiquette, acceptation d'une déclaration de production propre complétée et validée, refus d'une déclaration sans validation humaine.

## 4. Exemple de sidecar — uniquement si les faits sont vrais

```json
{
  "licence": "production_propre",
  "titre": "Cours rédigé par l'enseignant",
  "source": "Rédaction originale de l'enseignant",
  "titulaire_droits": "Auteur réel du cours",
  "declarant": "Auteur réel du cours",
  "date_declaration": "2026-11-15",
  "declaration_droits": true,
  "validation": {
    "statut": "valide",
    "verificateur": "Responsable pédagogique",
    "date": "2026-11-15",
    "reference_preuve": "declaration-interne-001"
  }
}
```

Cet exemple est un modèle de structure, pas une déclaration faite pour un document existant. Les noms, dates et références doivent être remplacés par des informations exactes et vérifiées. Pour une ressource tierce, il faut utiliser le type correspondant et la référence de licence/autorisation réelle. Ne jamais utiliser `production_propre` pour un manuel d'éditeur ou un document tiers.

## 5. Conversion et qualité

Une fois un document validé :
1. extraction du texte avec `pypdf` si le PDF contient du texte ;
2. OCR uniquement si nécessaire, avec dépendances et langues explicitement choisies ;
3. contrôle de qualité (pages vides, caractères illisibles, ordre des colonnes, tableaux, arabe/allemand) ;
4. correction humaine des erreurs OCR ;
5. segmentation en chunks avec identifiants de source/page ;
6. indexation RAG et citation du document source par le tuteur.

Un document non validé peut être inventorié et classé, mais il reste hors du corpus d'indexation.

## 6. Limites de validation de ce lot

Les sources ont été modifiées sur la branche d'audit. Les tests Python natifs et les workflows GitHub Actions ne sont pas déclarés passants : les runners du dépôt échouent avant la première étape (`steps: []`, `runner_id: 0`). Aucun PDF n'a été extrait, OCRisé, copié ou indexé dans ce lot.

Aucun changement sur `main`, aucune fusion, aucun déploiement, aucune opération Supabase/Auth/RLS/schéma/données/paiement/secrets. PR #17 reste ouverte et indépendante.
