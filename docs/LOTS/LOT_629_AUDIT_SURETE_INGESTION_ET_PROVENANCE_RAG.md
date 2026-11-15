# Lot 629 — audit de sûreté de l'ingestion et traçabilité des pages RAG

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`  
Base relue : `68beb61f100fd0a9442e4b0535d0e5aca60d0196`

## Objectif

Poursuivre le contrôle préalable à toute conversion des PDF en vérifiant non seulement les droits, mais aussi la non-destruction du catalogue, la conservation des pages et la capacité du tuteur à citer une source précise. Audit statique uniquement ; aucune ingestion ni exécution de test n'est revendiquée.

## Constats confirmés

### 1. Perte de pages dans les chunks RAG

- `tools/indexer_pdf.py` concatène le texte de toutes les pages avec `"\n".join(...)`, puis découpe le texte aplati par blocs de 1 200 mots.
- `tools/ingest_corpus.py` suit le même principe : extraction d'un texte global puis segmentation par mots.
- Les chunks produits ne contiennent que `global_id`, `doc`, `n` et `texte`. Aucun numéro de page, aucune plage de pages, ni identifiant d'empreinte du PDF n'est conservé.
- `tools/sharder_index.py` copie les chunks sans ajouter de provenance. `rag.js` valide les champs `doc` et `texte`, puis son meilleur résultat ne retourne que score, texte et identifiant de document.
- Conséquence : même si le RAG retrouve un passage, le tuteur ne peut pas garantir une citation de page PDF. Un chunk peut traverser une frontière de page.

### 2. Risque de remplacement destructif du catalogue par le chemin DOCX/TXT

- `tools/ingest_corpus.py::construire()` initialise `docs = []` et ne recharge pas les documents déjà présents dans `assets/bdd/corpus.json`.
- `main()` remplace ensuite `assets/bdd/corpus.json` par le seul lot détecté dans le dossier transmis.
- Une exécution sur un sous-dossier ou un lot partiel peut donc effacer du registre les fiches pédagogiques préexistantes qui ne figurent pas dans ce lot. Le fichier `corpus_index.json` BIBLIO est préservé, mais le registre `corpus.json` ne l'est pas.
- Ce chemin ne doit pas être utilisé en production avant une stratégie explicite de fusion, déduplication, validation et sauvegarde.

### 3. Contrats d'ingestion encore dupliqués

- `indexer_pdf.py` ne traite que les PDF et conserve les fiches non-PDF existantes.
- `ingest_corpus.py` traite PDF/DOCX/TXT/MD, mais remplace le registre par le lot et copie les fichiers dans `assets/corpus/`.
- Les deux scripts partagent le validateur des droits, mais divergent encore sur la fusion du registre, les champs documentaires, la segmentation et les effets de bord.
- Il faut désigner un seul orchestrateur de production après tests de non-régression ; ne pas lancer les deux pipelines l'un après l'autre.

### 4. La référence de preuve n'est pas encore reliée à une pièce contrôlable

- `rights_metadata.py` exige une chaîne `validation.reference_preuve`, mais ne vérifie pas que la pièce existe, qu'elle est accessible, ni que son périmètre couvre le document, son édition, son territoire et les usages autorisés.
- Pour une autorisation ministérielle ou collective, le registre doit relier chaque document à une preuve et à une portée explicite (documents/collections, versions, formats, extraction, indexation RAG, affichage, redistribution éventuelle, territoire et durée).
- La politique « utilité publique » ne doit jamais être convertie automatiquement en licence ou en autorisation. Une autorisation générale réellement délivrée peut être enregistrée comme telle, avec sa pièce et son champ d'application vérifiés.

## Décisions de sûreté

1. Aucun PDF existant n'est réputé autorisé par sa seule présence dans le dépôt ou par l'étiquette historique `document utilisateur`.
2. Ne pas créer de sidecars fictifs et ne pas modifier les 225 fiches PDF historiques pour leur attribuer une licence.
3. Bloquer l'exécution de `ingest_corpus.py` en production tant que la fusion non destructive du registre n'est pas garantie.
4. Avant d'activer le RAG documentaire, imposer une provenance page par page : `doc`, `page_start`, `page_end`, `global_id`, `n`, texte et empreinte SHA-256 du fichier source.
5. Ajouter des tests de contrat : conservation des fiches préexistantes, absence d'écrasement si lot vide/invalide, stabilité des IDs, conservation des pages à travers sharding et réponse RAG, vérification de la portée de preuve.
6. Faire afficher au tuteur le titre, la page et la référence de la source ; si la page n'est pas connue, ne pas en inventer une.

## Étape suivante — Lot 630

Concevoir puis tester isolément le schéma de provenance page-aware et la fusion non destructive du registre. Ajouter des fixtures PDF synthétiques de deux pages (sans contenu protégé) pour vérifier les frontières de page, puis tester le comportement RAG sur ces fixtures. Le code de production ne sera modifié qu'après validation des contrats et du runner.

## Limites et périmètre

- Audit effectué par lecture statique des fichiers `tools/rights_metadata.py`, `tools/indexer_pdf.py`, `tools/ingest_corpus.py`, `tools/sharder_index.py`, `tests/test_corpus_pipeline.py`, `rag.js` et `assets/bdd/corpus.json`.
- Aucun test Python/Node, aucune Action GitHub, aucun OCR, aucune extraction PDF réelle et aucun RAG live exécutés dans ce lot.
- Aucun PDF converti, copié ou indexé ; aucun sidecar ajouté ; aucun index ou manifeste généré.
- Aucun changement sur `main), aucune fusion, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/données/paiement/secrets. PR #17 reste indépendante et ouverte.
