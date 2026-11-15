# Lot 638 — séparation explicite des index BIBLIO et RAG

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Diagnostic vérifié

- `biblio.js` consomme `assets/bdd/corpus_index.json`, un index lexical historique au format `items[]`.
- `tools/ingest_corpus.py` et `tools/indexer_pdf.py` écrivent `assets/bdd/corpus_rag_index.json`, au format RAG `chunks[]` / `termes{}`.
- `tools/sharder_index.py` lit le seul `corpus_rag_index.json`.
- `rag.js` tente les shards puis l'index complet `corpus_rag_index.json`; il ne confond pas cet index avec le catalogue lexical de BIBLIO.
- Le catalogue `assets/bdd/corpus.json` portait encore une architecture historique décrivant `corpus_index.json` comme index plein texte régénéré par l'ingestion. Cette description était devenue fausse.
- Le fichier `corpus_index.json` existe et contient `items[]`. Le fichier `corpus_rag_index.json` est absent sur cette branche. Le manifeste de shards est en version 1.0.0 avec zéro shard ; il ne constitue donc pas une génération RAG utilisable par le lecteur actuel.

## Modifications

1. Mise à jour de `assets/bdd/corpus.json::_meta.architecture` : distinction documentée entre registre, fichiers sources, index lexical BIBLIO et index documentaire RAG. L'ingestion RAG est explicitement décrite comme ne remplaçant pas `corpus_index.json`.
2. Ajout de `tests/index_paths_contract.mjs` : contrôle statique des chemins consommés/produits par BIBLIO, ingestion, indexeur PDF, sharder et lecteur RAG ; contrôle du format de l'index lexical ; diagnostic non bloquant si l'index RAG ou les shards ne sont pas encore publiés.
3. Intégration du nouveau contrôle au workflow `.github/workflows/corpus-contract-tests.yml` et ajout de ses fichiers aux filtres de déclenchement.

## Audit de droits et de couverture

- Le catalogue compte 239 fiches : 225 portent la mention `document utilisateur`, 8 `usage pédagogique`, 4 `production propre`, 2 une mention de document fourni par l'utilisateur.
- Le validateur d'ingestion exige un sidecar avec type de licence reconnu, source, titulaire des droits, déclarant, date, déclaration explicite, validation humaine et référence de preuve ; une simple étiquette de catalogue n'est pas suffisante.
- Ces statistiques ne prouvent ni une violation ni une autorisation. Elles indiquent que les pièces et périmètres de droits doivent être vérifiés avant ingestion. Aucun PDF, OCR ou index RAG réel n'a été traité pendant ce lot.

## Matrice du tuteur

- `tests/tutor_matrix.json` contient 23 cas et porte toujours `execution_status: prepared_not_executed`.
- `tests/tutor_language_matrix.mjs` contrôle les heuristiques, les lexiques et le câblage statique ; son commentaire précise qu'il ne valide pas la qualité réelle du LLM.
- Les 23 réponses attendues n'ont donc pas été exécutées contre le Worker / modèle. Ce lot ne revendique pas une validation fonctionnelle de l'enseignant vocal ou de la qualité pédagogique.

## Validation et limites

- Les fichiers et références ont été contrôlés via GitHub ; le nouveau test et le workflow ont été ajoutés.
- Exécution Node/Python non attestée dans cet environnement. Le runner GitHub Actions a déjà été indisponible sur les précédents lots ; aucun statut vert n'est revendiqué pour ce lot.
- La présence du workflow modifié ne signifie pas que les tests ont tourné.
- Aucune modification de `main`, aucune fusion, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/données/paiements/secrets.

## Suite — Lot 639

- Vérifier le runner Actions et obtenir une exécution effective des suites Python/Node.
- Examiner les sources PDF une à une avec les preuves de droits correspondantes avant tout traitement.
- Construire un index RAG de test uniquement à partir de ressources dont les droits sont établis, puis valider provenance/page/hash et lecture RAG.
- Préparer un vrai harnais de tests de requêtes/réponses du tuteur (Worker isolé et réponses observables), sans présenter les tests statiques comme des tests du modèle.
