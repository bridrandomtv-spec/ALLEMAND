# Lot 631 — provenance page-aware et contrats de fusion documentaire

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## Réalisation

### 1. Contrat partagé

Ajout de `tools/corpus_contracts.py` :
- calcul d'empreinte SHA-256 par lecture en flux ;
- découpage des pages PDF séparément, sans fusionner deux pages dans un même chunk ;
- fusion déterministe des fiches documentaires par identifiant, en conservant les documents non présents dans le lot ;
- constructeur de chunk validant l'empreinte et la plage de page.

### 2. Indexation PDF

Mise à jour de `tools/indexer_pdf.py` :
- extraction page par page avec pypdf ;
- segmentation page-aware ; chaque chunk PDF porte `page_start`, `page_end` (même numéro, une page par chunk) et `source_sha256` ;
- chaque fiche PDF porte également `source_sha256` ;
- fusion du catalogue documentaire existant avec le lot nouvellement indexé ; les documents non présents dans le lot restent conservés ;
- si aucun chunk autorisé n'est produit, aucun artefact existant n'est remplacé.

### 3. Sharding et RAG

- `tools/sharder_index.py` conserve les champs de provenance (copie complète du chunk) et refuse une empreinte SHA-256 mal formée ou une plage de page incohérente.
- `rag.js` valide les métadonnées de provenance lorsqu'elles existent.
- Le meilleur résultat RAG expose désormais la page et l'empreinte ; la présentation affiche le numéro de page uniquement lorsqu'il est présent et valide.
- Les anciens chunks sans métadonnées restent compatibles ; aucune page n'est inventée pour ces ressources.

### 4. Tests de contrat ajoutés

Dans `tests/test_corpus_pipeline.py` :
- découpage séparé par page et absence de chunk traversant une frontière ;
- fusion conservant les fiches non remplacées et mettant à jour un ID identique ;
- refus d'une empreinte invalide et d'une plage multi-page ;
- conservation et validation de la provenance pendant le sharding.

## Limites importantes

- Les tests ont été ajoutés mais ne sont pas déclarés exécutés : le runner GitHub Actions est toujours en attente de vérification et aucun environnement Python local n'a été lancé dans ce lot.
- Aucun PDF réel n'a été extrait, OCRisé, copié ou indexé.
- Le chemin multi-format `tools/ingest_corpus.py` n'est pas encore migré vers le contrat page-aware et sa fusion non destructive reste à corriger avant usage de production. Ne pas l'utiliser pour remplacer le registre ou l'index existant.
- La vérification d'existence et de portée des pièces d'autorisation reste à faire dans le registre des droits.
- La fusion du catalogue `corpus.json` dans l'indexeur PDF est non destructive pour les fiches ; l'index RAG PDF est reconstruit depuis le dossier PDF autorisé. Avant de combiner plusieurs pipelines ou de lancer des imports incrémentaux, une stratégie de fusion/retrait des chunks et de reconstruction des postings doit être testée.

## Périmètre

- Fichiers ajoutés/modifiés : `tools/corpus_contracts.py`, `tools/indexer_pdf.py`, `tools/sharder_index.py`, `rag.js`, `tests/test_corpus_pipeline.py`.
- Aucun fichier PDF ou sidecar modifié.
- Aucun index, shard ou manifeste de production généré.
- Aucun changement sur `main`, aucune fusion, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/données/paiement/secrets. PR #17 reste ouverte et indépendante.

## Suite — Lot 632

1. Migrer ou neutraliser proprement `tools/ingest_corpus.py` afin qu'il ne puisse plus écraser catalogue et index en mode partiel.
2. Ajouter des tests d'intégration avec un PDF synthétique multi-page, mock pypdf et vérification SHA-256 de bout en bout.
3. Faire exécuter les tests Python/Node par un runner disponible et corriger toute régression.
4. Vérifier qu'une réponse RAG réelle présente le titre documentaire et la page, pas seulement l'identifiant interne du document.
5. Relier les références de preuve de droits à des pièces et à un périmètre vérifiables avant la première ingestion réelle.
