# Lot 624 — Audit du pipeline documentaire RAG

Date : 15 novembre 2026  
Dépôt : `bridrandomtv-spec/ALLEMAND`  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Comprendre pourquoi le moteur RAG ne dispose pas d'un index documentaire chargeable, vérifier les chemins de génération, les schémas des index et les déclencheurs GitHub Actions. Aucun contenu documentaire fictif n'est ajouté.

## Constat vérifié

### 1. Le runtime attend un artefact qui n'existe pas

- `rag.js` charge `assets/bdd/shards_manifest.json` et exige la version `2.0.0`, au moins un shard et au moins un chunk.
- Le manifeste présent est en version `1.0.0`, avec `nb_shards: 0` et `total_chunks: 0`.
- Le runtime prévoit un repli vers `assets/bdd/corpus_rag_index.json`, mais ce fichier n'existe pas sur la branche audit (404).
- Résultat : la recherche documentaire RAG ne peut renvoyer aucun extrait via l'index complet ni via les shards.

### 2. Le script PDF écrit dans le mauvais fichier

`tools/indexer_pdf.py` :
- lit `assets/bdd/corpus_index.json` ;
- y ajoute les clés `chunks` et `termes` ;
- écrit de nouveau ce fichier ;
- ne produit pas `corpus_rag_index.json`.

Or `biblio.js` charge `corpus_index.json` comme catalogue lexical/vocabulaire (`items[]`, champs `de/ar/n`). Le script PDF mélange donc deux contrats de données distincts. Ce n'est pas le fichier attendu par le lecteur RAG.

### 3. Le générateur de shards attend un autre chemin

`tools/sharder_index.py` lit exclusivement `assets/bdd/corpus_rag_index.json`, puis écrit `assets/bdd/shards/shard_XX.json` et un manifeste version `2.0.0`.

Le workflow `.github/workflows/sharder.yml` est déclenché notamment par `assets/bdd/corpus_index.json`, mais le script consomme `corpus_rag_index.json`. Le déclencheur et le fichier source ne correspondent donc pas.

### 4. Deux pipelines concurrents existent

`tools/ingest_corpus.py` sait déjà produire le couple attendu :
- `corpus.json` ;
- `corpus_rag_index.json` avec `global_id`, `doc`, `texte` et postings inversés.

Mais le workflow `indexer.yml` exécute `tools/indexer_pdf.py`, pas `tools/ingest_corpus.py`. Les deux scripts ont des comportements et des règles de licence différents ; les substituer sans harmonisation serait dangereux.

### 5. Garde-fou de licence insuffisant dans l'indexeur PDF

`tools/indexer_pdf.py` indexe tous les PDF du dossier et leur attribue automatiquement `licence: document utilisateur`, sans vérifier la licence réelle. Le catalogue contient notamment des références de documents dont la nature peut être commerciale. Il ne faut pas relancer l'indexation massive avant d'avoir une règle de validation des droits.

`tools/ingest_corpus.py` refuse certaines valeurs de licence interdites, mais sa valeur par défaut est `production propre` lorsqu'aucun fichier de métadonnées n'est fourni. Ce défaut permissif doit également être corrigé avant d'en faire le pipeline de production.

## Cause racine

Le pipeline est fragmenté en trois contrats incompatibles :
1. indexeur PDF : `corpus_index.json` ;
2. générateur de shards : `corpus_rag_index.json` ;
3. runtime : manifeste v2 + shards, avec repli sur `corpus_rag_index.json`.

Le workflow déclenche la génération des shards sur le fichier qui n'est pas consommé par le générateur. C'est la cause structurelle vérifiée du manifeste vide et de l'absence de recherche RAG documentaire.

## Plan de correction sûr

1. Unifier la génération autour d'un seul artefact RAG séparé : `corpus_rag_index.json`. Ne jamais réutiliser `corpus_index.json`, qui reste le catalogue lexical BIBLIO.
2. Faire produire par l'indexeur le schéma exact attendu par `rag.js` et `sharder_index.py` ; reconstruire les IDs et postings de façon déterministe.
3. Aligner les chemins `paths` des workflows sur les fichiers réellement lus et écrits.
4. Refuser par défaut tout document sans licence explicite autorisée ; ne pas convertir automatiquement « document utilisateur » en autorisation de réindexation.
5. Ajouter des tests de contrat Python/Node sur les chemins, le schéma, les IDs uniques, les postings et le manifeste.
6. Générer les shards seulement après validation de l'index complet ; vérifier qu'aucun artefact incomplet ne remplace le dernier index valide.

## Vérifications effectuées

- Lecture des sources : `rag.js`, `biblio.js`, `tools/indexer_pdf.py`, `tools/ingest_corpus.py`, `tools/sharder_index.py`, `.github/workflows/indexer.yml`, `.github/workflows/sharder.yml`, `corpus.json`, `corpus_index.json`, `shards_manifest.json`.
- Présence de `corpus_rag_index.json) vérifiée : absent.
- Manifeste observé : version 1.0.0, zéro shard, zéro chunk.
- Exécution des scripts Python, génération des shards, tests natifs et Actions : non effectuées dans cet environnement. Aucun résultat runtime n'est revendiqué.

## Limites et sécurité

Aucun PDF n'a été réindexé ; aucun contenu fictif n'a été créé. Aucun fichier de données n'a été modifié. Aucun changement Supabase/Auth/RLS/schéma/données/paiement/secrets. Aucun déploiement, aucun merge, aucune modification de `main`. PR #17 et Messenger restent des chantiers séparés.

## Étape suivante

Lot 625 : corriger les contrats de génération et de workflow, avec validation stricte des licences et tests avant toute production de shards.
