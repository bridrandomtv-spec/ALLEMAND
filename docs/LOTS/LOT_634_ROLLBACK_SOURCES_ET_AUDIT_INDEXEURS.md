# Lot 634 — rollback des sources et audit de cohérence des indexeurs

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## 1. Défaut confirmé et correction

L'audit a confirmé que `tools/ingest_corpus.py::main()` copiait les documents vers `assets/corpus/` avant de publier `corpus.json` et `corpus_rag_index.json`. Si l'écriture JSON échouait, les fichiers copiés pouvaient rester orphelins, sans entrée de catalogue/index.

Correction :
- ajout de `publier_sources_et_artefacts()` dans `tools/ingest_corpus.py` ;
- préparation de toutes les copies dans des fichiers temporaires avant de toucher aux destinations ;
- sauvegarde des fichiers déjà présents avant remplacement ;
- publication du catalogue et de l'index après les copies ;
- en cas d'exception Python, suppression des nouvelles copies et restauration des versions précédentes ;
- conservation d'une sauvegarde sur disque si la restauration elle-même échoue.

## 2. Test de non-régression ajouté

`tests/test_corpus_pipeline.py` contient un test d'intégration du chemin `main()` :
- lot TXT synthétique et sidecar de test ;
- destinations catalogue/index temporaires ;
- simulation d'un échec de publication JSON ;
- vérification que le dossier des sources publiées est vide après rollback ;
- vérification que les deux artefacts JSON existants restent inchangés.

Le test est ajouté mais **non exécuté** : aucun résultat CI ou local ne permet encore de le certifier.

## 3. Vérifications de cohérence

- Le pipeline PDF et le pipeline multi-format utilisent le même helper `fusionner_index_rag()` pour préserver les chunks des documents non remplacés et reconstruire les IDs/postings.
- Les deux indexeurs utilisent le writer JSON transactionnel du Lot 633.
- Les deux chemins appellent le validateur commun `valider_metadonnees()`.
- La validation exige une référence textuelle de preuve et une validation humaine, mais ne vérifie pas l'existence matérielle de la pièce ni son périmètre exact (documents/éditions, extraction, indexation, affichage, redistribution, territoire et durée).

## 4. Limites restantes

- Le rollback couvre les exceptions Python détectées ; il ne garantit pas une transaction résistante à une coupure brutale du processus ou de la machine pendant la séquence.
- Les deux JSON sont toujours remplacés séparément. Une atomicité stricte après crash nécessitera une génération versionnée et un manifeste/pointeur unique, après audit des consommateurs actuels des chemins `assets/bdd/corpus.json` et `assets/bdd/corpus_rag_index.json`.
- Le blocage runner GitHub Actions n'est pas levé. Les derniers diagnostics disponibles montraient `runner_id: 0`, aucun nom de runner et `steps: []`. Le propriétaire doit vérifier GitHub > Billing & plans / Actions spending limit ; l'API ne confirme pas la cause précise.
- Aucun PDF réel n'a été extrait, copié, OCRisé ou indexé.

## 5. Périmètre de sécurité

Aucun changement de `main` conservé, aucune fusion, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets. Aucun document réel n'a été ingéré. Les tests restent non certifiés.

## 6. Suite — Lot 635

1. Obtenir un runner opérationnel et exécuter l'ensemble des tests.
2. Auditer les consommateurs de catalogue/index avant toute migration vers des générations versionnées.
3. Renforcer la validation de la preuve de droits pour relier la référence à une pièce réelle et à un périmètre précis.
4. Préparer des tests synthétiques bout en bout pour la restitution BIBLIO/RAG : titre, matière, niveau, page, source et empreinte.
5. Ne lancer aucune ingestion de manuels réels avant vérification de la pièce d'autorisation et de son champ d'application.
