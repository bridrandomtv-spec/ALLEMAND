# Lot 632 — sécurisation de l'ingestion multi-format et diagnostic CI

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## 1. Ingestion multi-format rendue incrémentale

Mise à jour de `tools/ingest_corpus.py` :
- extraction PDF page par page ; DOCX/TXT/MD traités comme flux textuels sans numéro de page inventé ;
- calcul de SHA-256 pour chaque source et conservation dans la fiche documentaire et les chunks ;
- validation obligatoire du sidecar par `rights_metadata.py` avant indexation/copie ;
- fusion du catalogue existant par identifiant ; les documents non concernés par le lot sont conservés ;
- fusion de l'index RAG par document, reconstruction des `global_id` et des postings lexicaux ; seuls les chunks du document remplacé sont renouvelés ;
- refus d'écrire si le lot ne produit aucun chunk autorisé.

## 2. Même protection pour l'indexeur PDF

Ajout de `fusionner_index_rag` dans `tools/corpus_contracts.py`, puis migration de `tools/indexer_pdf.py` :
- les imports PDF partiels ne suppriment plus les chunks de documents non concernés ;
- les IDs et postings sont reconstruits sur l'index fusionné ;
- les métadonnées de provenance existantes sont conservées.

Le contrat commun refuse désormais les chunks existants non structurés au lieu de les ignorer silencieusement.

## 3. Tests ajoutés

Dans `tests/test_corpus_pipeline.py` :
- import TXT avec catalogue préexistant et index existant ;
- conservation des chunks non remplacés et reconstruction des postings ;
- test PDF synthétique à deux pages avec faux lecteur pypdf, vérifiant les numéros de pages 1 et 2 et le SHA-256 de bout en bout ;
- refus d'un lot multi-format non autorisé sans écriture de données.

Ces tests sont **ajoutés mais pas exécutés** : les jobs GitHub Actions n'ont pas démarré sur un runner.

## 4. Séparation des tests et de l'indexation

- Nouveau workflow `.github/workflows/corpus-contract-tests.yml` : exécute uniquement les tests Python, avec permissions `contents: read`, sans ingestion, commit, secret ni déploiement.
- Workflow `.github/workflows/indexer.yml` : l'indexation automatique n'est plus déclenchée par une modification de code ; elle reste déclenchable manuellement ou par ajout/modification de fichiers dans `docs/archive/documents/**`.
- Objectif : éviter qu'un simple changement de script lance l'import réel du dossier documentaire.

## 5. Diagnostic GitHub Actions observé

Exécutions constatées sur la branche :
- `43763688204` — workflow Indexer PDF — échec ;
- `43763794404` et `43763827591` — workflow de contrats RAG — échec ;
- `43763126164` — audit tuteur IA — échec.

Pour le job récent `132964363940`, l'API GitHub renvoie `runner_id: 0`, `runner_name: ""`, `steps: []`, avec échec en deux secondes. Le job de l'indexeur `132963910647` présente le même profil. Les journaux de job ne sont pas disponibles (404 BlobNotFound).

**Conclusion limitée aux éléments observés :** GitHub n'a affecté aucun runner à ces jobs ; aucune étape de checkout, installation ou test n'est répertoriée. Ce n'est pas la preuve d'un échec du code Python, mais ce n'est pas non plus une réussite. Les tests restent non certifiés jusqu'à une exécution réelle avec un runner et des étapes terminées.

## 6. Périmètre et sécurité

- Aucun PDF réel traité ; aucun OCR ni ingestion de ressources scolaires.
- Aucun catalogue, index, shard ou manifeste de données réelles généré.
- Aucune modification de `main`, aucune fusion, aucun déploiement.
- Aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets.
- Aucune modification de PR #17.

## 7. Suite — Lot 633

1. Diagnostiquer la disponibilité des runners GitHub (jobs smoke-test, limites et configuration de l'organisation/dépôt).
2. Une fois un runner disponible, exécuter le workflow de contrats et corriger les vrais échecs éventuels.
3. Ajouter une vérification d'intégrité transactionnelle des artefacts (préparation temporaire, validation, remplacement coordonné et sauvegarde).
4. Unifier le chemin PDF et le chemin multi-format pour éviter deux commandes d'ingestion concurrentes.
5. Finaliser la preuve documentaire et son périmètre avant toute ingestion de manuels réels.


## Mise à jour de vérification après refactor commun

- La fusion RAG est centralisée dans `tools/corpus_contracts.py::fusionner_index_rag` et utilisée par les deux indexeurs (`indexer_pdf.py` et `ingest_corpus.py`).
- Le test multi-format appelle désormais ce contrat commun.
- Dernière exécution du workflow de tests : `43763939718`, job `132964729277`, échec avec `runner_id: 0` et `steps: []`. Aucun test n'a été exécuté ; blocage d'allocation du runner toujours présent.
