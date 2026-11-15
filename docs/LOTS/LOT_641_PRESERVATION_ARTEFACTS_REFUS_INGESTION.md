# Lot 641 — conservation des artefacts lors d’un refus d’ingestion

Date : 2026-11-16

## Objectif

Prouver qu’un lot documentaire refusé pour absence de preuve et de périmètre de droits ne modifie ni le catalogue, ni l’index RAG déjà publiés, ni les fichiers sources entrants.

## Modification

- Ajout de `test_main_rejected_batch_preserves_existing_json_and_source` dans `tests/test_corpus_pipeline.py`.
- Le test prépare un catalogue et un index existants avec contenu sentinelle, ainsi qu’un fichier source sans sidecar de droits.
- Il appelle `ingest.main()` avec les chemins de publication isolés dans un répertoire temporaire.
- Il attend le refus contractuel `RuntimeError: Aucun chunk autorisé`.
- Il compare ensuite les octets des deux artefacts avant/après, vérifie que le fichier source entrant est intact et que le répertoire de publication n’a pas été créé.

## Portée et limites

- La suite contient désormais 32 méthodes de test (31 précédemment + 1).
- Le nouveau test n’a pas été exécuté dans cette session : aucun runner local du dépôt n’est monté et aucun résultat GitHub Actions vérifiable n’est encore disponible.
- Le test est synthétique ; il ne valide pas les droits réels des documents du fonds, l’extraction PDF/OCR ni la qualité des réponses du tuteur.
- Aucun document réel n’a été ingéré, copié, extrait, OCRisé ou indexé.
- Aucun changement Supabase/Auth/RLS/schéma/données/paiements/secrets ; aucun déploiement et aucune fusion.

## État Git

- Branche : `audit/lot-603-corpus-contract-tests`.
- Commit de test : `9eb4765ce2f8537b0b75f9c4c56372a56d2d0561`.
- `main` reste la branche de référence inchangée.

## Suite

Lot 642 : créer un corpus RAG synthétique totalement isolé (documents fictifs, pages, SHA-256, chunks et génération de shards), puis vérifier le parcours complet catalogue → index → shards sans toucher aux données réelles. Après cela, instrumenter le contrat de réponse du tuteur afin de distinguer réponse sourcée, absence de source et réponse hors corpus.
