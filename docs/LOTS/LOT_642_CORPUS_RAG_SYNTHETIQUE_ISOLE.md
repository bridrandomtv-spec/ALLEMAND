# Lot 642 — corpus RAG synthétique isolé

Date : 2026-11-16

## Objectif

Vérifier ensemble le trajet catalogue pédagogique → chunks RAG → validation de cohérence → shards, avec des données fictives et temporaires, sans lire ni écrire dans le fonds documentaire réel.

## Test ajouté

Dans `tests/test_corpus_pipeline.py`, le test `test_synthetic_catalogue_to_rag_shards_keeps_provenance` :

1. crée un fichier source synthétique dans un répertoire temporaire et calcule son SHA-256 ;
2. construit une fiche documentaire de test (allemand, 2AS) ;
3. segmente deux pages distinctes et vérifie leur provenance page par page ;
4. construit les chunks et l’index lexical RAG ;
5. valide les références catalogue ↔ chunks ;
6. produit des shards de taille un et vérifie l’empreinte de génération, les IDs, les pages et le SHA-256 ;
7. écrit catalogue, index et manifeste dans le seul répertoire temporaire, puis relit les artefacts.

Le test n'utilise pas `assets/bdd/corpus.json`, `corpus_rag_index.json` ou le répertoire réel des shards.

## Résultat documentaire

- Nombre de méthodes de test dans le fichier : 33.
- Test ajouté mais non exécuté dans cette session ; aucun résultat PASS n’est revendiqué.
- Il s’agit d’un test de contrats de données Python, pas encore d’un test navigateur du lecteur `rag.js`, ni d’une mesure de pertinence des réponses de l’enseignant.
- Aucun PDF réel, aucune OCR, aucune ingestion du fonds, aucun changement Supabase/Auth/RLS/schéma/données/paiements/secrets, aucun déploiement ni merge.

## Suite

Lot 643 : renforcer le test de lecture des shards côté navigateur (génération, complétude, postings, fallback index complet), puis établir un contrat de réponse du tuteur avec trois états explicites : réponse sourcée, aucune source suffisante, et demande hors corpus.
