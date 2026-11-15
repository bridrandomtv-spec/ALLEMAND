# Lot 626 — inventaire documentaire, droits et diagnostic des runners CI

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`  
Périmètre : lecture du dépôt GitHub et métadonnées Actions uniquement. Aucun déploiement, aucune écriture Supabase, aucun changement de `main`.

## 1. Inventaire réel

L'arbre Git du commit de tête contient 1 461 chemins, dont 293 fichiers PDF :
- 264 PDF dans `docs/archive/documents/`, pour 152 195 181 octets (environ 145,1 Mio).
- 29 PDF à la racine du dépôt, hors du dossier surveillé par l'indexeur.
- Aucun sidecar JSON `_<nom>.json` dans l'arbre Git.
- Aucun fichier DOC/DOCX/TXT/MD source identifié dans `docs/archive/documents/`.

Le workflow `indexer.yml` ne surveille que `docs/archive/documents/**`. Les 29 PDF de la racine sont donc également hors de son périmètre actuel.

## 2. Droits et métadonnées

L'indexeur Lot 625 exige une licence explicite dans chaque sidecar. Aucun sidecar n'existe actuellement : aucun des 264 PDF archivés ne peut être déclaré indexable par cette procédure.

Le registre `assets/bdd/corpus.json` contient déjà des entrées pédagogiques existantes, mais les libellés de licence visibles ne correspondent pas tous à l'énumération stricte de l'indexeur (par exemple `production propre` et `usage pédagogique` au lieu des identifiants normalisés). Il faut clarifier la provenance et les droits document par document avant toute normalisation. La mention « sujet officiel publié » ne suffit pas, à elle seule, à établir une autorisation de réutilisation intégrale dans un index RAG.

Décision : aucun sidecar automatique, aucune licence supposée, aucun contenu PDF importé. Le refus d'indexer est actuellement le comportement sûr.

## 3. OCR et qualité d'extraction

Aucun outil ou script OCR dédié n'a été trouvé dans l'arbre du dépôt (pas de chemin Tesseract, EasyOCR, PaddleOCR, DocTR ou pipeline PDF image détecté). `tools/indexer_pdf.py` utilise seulement `pypdf` et ignore les PDF dont le texte extrait est inférieur à 60 caractères ; son message précise que l'OCR n'est pas exécuté.

Avant d'ajouter l'OCR, il faut choisir et figer une dépendance disponible dans les runners, définir les langues (arabe, allemand, français), contrôler la qualité d'extraction et limiter les faux textes. Aucun OCR n'a été lancé dans ce lot.

## 4. Diagnostic GitHub Actions

Les exécutions observées :
- Indexer : run `43756829069`, job `132949186066`, échec en quelques secondes, `steps: []`, `runner_id: 0`.
- Sharder : run `43756820944`, job en échec, sans étape démarrée dans le relevé précédent.
- Audit tuteur : run `43756821072`, job `132949945227`, échec en quelques secondes, `steps: []`, `runner_id: 0`.

Les journaux du run indexer ne sont pas accessibles via l'API utilisée (réponse vide/indisponible). Aucun message de step n'indique un défaut du code. Les métadonnées situent donc l'échec avant l'exécution des étapes, au niveau de la mise à disposition du runner ou de l'environnement GitHub Actions. La cause précise (facturation, limite, capacité ou autre restriction du compte) n'est pas exposée par ces éléments et n'est pas affirmée.

Le dépôt possède déjà `.github/workflows/diag-runner-provisioning.yml`, un test minimal sans checkout ni dépendance, déclenchable manuellement ou sur une PR vers main. Il n'a pas été déclenché ici : aucune PR vers main ni consommation supplémentaire n'a été initiée.

## 5. État du pipeline RAG

- `assets/bdd/shards_manifest.json` reste en version `1.0.0`, avec zéro shard et zéro chunk.
- `assets/bdd/corpus_rag_index.json` n'est pas encore alimenté par des sources autorisées.
- Le catalogue BIBLIO `assets/bdd/corpus_index.json` reste distinct et n'a pas été remplacé.
- Les tests Python n'ont pas été exécutés localement dans cet environnement.
- Aucun index ni shard de production n'a été généré.

## 6. Prochaines actions sûres

1. Obtenir une décision de droits pour les documents produits par le professeur et pour les sujets/ressources provenant de tiers.
2. Créer les sidecars uniquement à partir de preuves de provenance et de licence confirmées.
3. Écarter explicitement les livres commerciaux et scans non autorisés.
4. Mettre en place un essai OCR sur un petit échantillon autorisé, avec validation humaine du texte arabe/allemand.
5. Déclencher le diagnostic minimal du runner quand l'accès GitHub Actions est disponible, puis relancer les contrats.
6. Générer le RAG et les shards uniquement après validation des sources.

## 7. Périmètre protégé

Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare, aucune opération Supabase/Auth/RLS/schéma/données/paiement/secrets. PR #17 reste indépendante et ouverte en attente de validation visuelle.
