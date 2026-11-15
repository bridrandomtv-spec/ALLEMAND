# Lot 625 — Unification et sécurisation du pipeline RAG

Date : 15 novembre 2026  
Dépôt : `bridrandomtv-spec/ALLEMAND`  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Réparer les contrats entre l'indexeur documentaire, le catalogue BIBLIO, le générateur de shards et les workflows. L'ingestion doit être bloquante en l'absence d'une licence explicite et ne doit jamais publier un index vide.

## Changements appliqués

### 1. Séparation stricte BIBLIO / RAG

- `tools/indexer_pdf.py` écrit désormais dans `assets/bdd/corpus_rag_index.json`.
- `assets/bdd/corpus_index.json` n'est plus ouvert ni modifié par l'indexeur PDF ; il reste le catalogue lexical consommé par BIBLIO.
- Les chunks produits portent un `global_id` stable dans l'index généré, `doc`, `n` local et `texte`, conformément au contrat attendu par le sharder et le lecteur.

### 2. Licences explicites obligatoires

Les fichiers PDF et documents d'ingestion doivent avoir un sidecar `_<nom>.json` avec une licence admise :
- `production_propre`
- `domaine_public`
- `autorisation_ecrite`
- `licence_libre`

Les fichiers sans sidecar ou avec une autre valeur sont ignorés. La valeur permissive implicite « production propre » et la qualification automatique « document utilisateur » ont été supprimées. Aucun droit n'est déduit du seul fait qu'un document se trouve dans le dépôt.

### 3. Indexeur PDF protégé contre les publications vides

- Les PDF sans texte extrait suffisant sont ignorés explicitement ; aucun OCR n'est lancé dans cette version du pipeline.
- Si aucun chunk autorisé n'est produit, le script s'arrête avant d'écraser les artefacts existants.
- Les fichiers JSON sont écrits dans un fichier temporaire puis remplacés atomiquement.
- Les documents déjà présents dans le catalogue et qui ne sont pas issus du préfixe PDF sont préservés.

### 4. Sharder strict

- Refus d'un index vide, d'un chunk sans texte/document, d'un identifiant global absent/dupliqué et de postings invalides ou dupliqués.
- Les postings sont filtrés par identifiants globaux.
- Les shards sont écrits avant le remplacement du manifeste ; les anciens shards surnuméraires sont nettoyés après construction.
- Le manifeste publié est toujours au format v2.0.0 et décrit un nombre non nul de chunks.

### 5. Workflows réalignés

- `indexer.yml` surveille les documents sources et l'indexeur ; il exécute les tests de contrat avant l'indexation.
- `sharder.yml` surveille désormais `corpus_rag_index.json`, le fichier réellement lu par le sharder, et non le catalogue BIBLIO.
- Les deux workflows sont bloqués sur `main` et poussent leurs artefacts sur la branche qui a déclenché le workflow. Ils ne font plus de rebase/push automatique sur `main`.

### 6. Tests ajoutés

`tests/test_corpus_pipeline.py` vérifie :
- la séparation des chemins BIBLIO et RAG ;
- l'absence de licence implicite ;
- le refus d'un index vide ;
- la génération de plusieurs shards avec IDs globaux ;
- le rejet d'un posting orphelin.

## Limites et vérifications

- Les fichiers sources et workflows ont été modifiés sur la branche d'audit.
- Les tests Python ont été ajoutés et sont appelés par le workflow indexer avant l'ingestion.
- L'exécution locale de Python et des tests, ainsi que les résultats GitHub Actions, ne sont pas confirmés dans cet environnement.
- Aucun PDF source n'a été réindexé ; aucun artefact documentaire n'a été généré artificiellement.
- Le traitement OCR des scans est temporairement désactivé dans ce pipeline corrigé : les PDF sans couche texte sont ignorés plutôt que d'être ajoutés comme documents vides. L'OCR sera réintroduit avec des tests et un contrôle de qualité explicite.
- La construction d'un index complet de production attend des documents autorisés munis de leurs sidecars de métadonnées. Le manifeste actuel n'est pas remplacé par un manifeste vide.

## Sécurité et périmètre

Aucun changement Supabase/Auth/RLS/schéma/données/paiement/secrets. Aucun déploiement, aucun merge, aucune modification de `main`. PR #17 reste séparée et ouverte ; Messenger reste un chantier indépendant.

## Étape suivante

Lot 626 : vérifier les déclenchements et résultats des workflows sur la branche, puis traiter le corpus réel (inventaire des PDF, sidecars/licences, extraction OCR contrôlée) sans fabriquer de contenu. Ensuite, connecter le RAG validé à BIBLIO et aux réponses pédagogiques.
