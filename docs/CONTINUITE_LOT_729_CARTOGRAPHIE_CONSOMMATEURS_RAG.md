# Lot 729 — cartographie des consommateurs et dépendances de déploiement RAG

Date : 21 novembre 2026

## Périmètre et HEAD
Audit en lecture seule de la branche PR #23 au HEAD de référence `b3366aed1c88242b8a8fc1c319a8455cb9f89fae`.

PR #23 : ouverte, brouillon, non fusionnée, techniquement mergeable.
Base/main : `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`.
Branche : `ai/rag-corpus-integrity-lot-635`.
Écart : 410 commits en avance, 0 en retard ; 60 fichiers modifiés.

## État des artefacts au HEAD audité
- `assets/bdd/corpus_rag_chunks.json` : 54 caractères ; version 1 ; 0 document ; 0 chunk.
- `assets/bdd/corpus_rag_manifest.json` : 318 caractères ; 0 document ; 0 chunk ; statut `connected_protected`.
- `assets/bdd/corpus_rag_vectors.json` : 124 caractères ; 0 vecteur ; modèle déclaré `@cf/google/embeddinggemma-2`, 256 dimensions.
- `assets/bdd/shards_manifest.json` : 0 shard ; 0 chunk.
- `assets/bdd/corpus_index.json` : index historique de vocabulaire, distinct du corpus PDF RAG. Il ne doit pas être confondu avec les artefacts `corpus_rag_*`.

Les trois artefacts RAG serveur sont vides. Aucun document PDF n'est publié dans ce pipeline et aucun embedding réel n'est présent.

## Cartographie des consommateurs

### Worker serveur
`worker/ia-ask.js` :
- récupère `corpus_rag_chunks.json` lors d'une recherche ou d'une demande de document PDF ;
- récupère ensuite `corpus_rag_manifest.json` et vérifie SHA-256, version, nombres de documents/chunks, identifiants et associations ;
- filtre les documents selon les droits/licences avant classement lexical ;
- récupère `corpus_rag_vectors.json` uniquement si `env.RAG_VECTOR_ENABLED === 'true'` et `env.AI.run` est disponible ;
- vérifie pour l'index vectoriel les empreintes chunks + manifeste, modèle, dimensions, normalisation, couverture des chunks autorisés, unicité et rattachement document/chunk ;
- si l'index vectoriel est invalide ou absent, le classement lexical BM25 reste la voie de repli.

### Navigateur
`rag.js` contient encore des fonctions de lecture de `shards_manifest.json` et `corpus_index.json`, mais la fonction de recherche documentaire `cherche()` retourne immédiatement `null`. Le commentaire de sécurité indique que les PDF ne doivent pas être lus directement depuis le navigateur et que les demandes documentaires sont déléguées au Worker. Ces shards ne constituent donc pas un consommateur actif du corpus PDF dans le chemin audité.

### Génération
`tools/ingest_corpus_rag.py` produit les deux fichiers chunks + manifeste.
`tools/build_corpus_rag_vectors.py` lit ces deux fichiers et écrit l'index vectoriel séparément ; le mode par défaut est dry-run sans écriture ni appel API. L'exécution réelle exige `--execute`, une confirmation explicite de facturation, des identifiants Cloudflare et au moins un chunk éligible.

### Tests
- `tests/worker-ai-auth.test.mjs` simule les réponses chunks, manifeste et vecteurs et teste les appels Worker, JWT, refus fermé et sélection de documents.
- `tests/test_ingest_corpus_rag.py` couvre la génération et les empreintes chunks/manifeste.
- `tests/test_build_corpus_rag_vectors.py` couvre les empreintes, droits, doublons, données invalides et mode dry-run.
- Ces tests sont des tests locaux/simulés ; ils ne démontrent pas encore un parcours E2E avec JWT réel sur un Worker de préproduction.

## Écarts de configuration confirmés

### 1. Artefact vecteurs absent de la liste d'assets du workflow
Dans `.github/workflows/deploy.yml`, la liste explicite des assets requis contient :
- `assets/bdd/corpus_rag_chunks.json`
- `assets/bdd/corpus_rag_manifest.json`

Elle ne contient pas `assets/bdd/corpus_rag_vectors.json`.

Le Worker tente pourtant de récupérer ce troisième artefact lorsque `RAG_VECTOR_ENABLED=true`. Le workflow ne garantit donc pas que le fichier vecteurs sera présent dans l'artefact de déploiement. Tant que ce point n'est pas corrigé et testé, l'activation du mode vectoriel ne doit pas être autorisée. Le repli lexical limite l'impact fonctionnel, mais n'est pas une validation de la chaîne vectorielle.

### 2. URL de production codée en dur dans le Worker
Les appels chunks, manifeste et vecteurs utilisent l'hôte absolu `https://allemand.brid-randomtv.workers.dev`.

Conséquence : une instance Worker de preview/staging peut aller lire les artefacts du site de production au lieu de ses propres assets. Un test de preview peut donc donner un faux résultat positif ou ne pas valider la version candidate. Il faut rendre la source d'assets propre à l'environnement (binding local/ASSETS ou configuration explicite sûre), sans faire de fallback silencieux vers la production. Le test doit prouver qu'une preview n'émet aucun appel vers l'hôte de production.

### 3. Publication chunks/manifeste non atomique
Le Lot 728 a confirmé deux remplacements séparés dans l'ingestion. Le Worker compare le hash des chunks au manifeste et échoue fermé si les versions ne correspondent pas. Cela protège l'intégrité, mais une interruption peut rendre le service documentaire indisponible. La solution de publication versionnée ou l'artefact unique reste à concevoir.

## CI au HEAD audité
Sur `b3366aed1c88242b8a8fc1c319a8455cb9f89fae` :
- PostgreSQL — ملتقى الطلاب : run `44898568654`, réussi.
- CI principale : run `44898568637`, en cours au contrôle.
- PostgreSQL — consentement Messenger : run `44898568632`, réussi.
- PostgreSQL — découverte Messenger : run `44898568684`, réussi.

La CI n'est donc pas déclarée complète à ce stade. Les workflows déclenchés par le commit documentaire du Lot 729 devront aussi être vérifiés après écriture du rapport.

## Décision et tâches suivantes
Aucune modification de code n'est faite dans ce lot.

Avant l'activation du RAG vectoriel ou un E2E :
1. inclure et valider l'artefact vecteurs dans la chaîne de build/déploiement, ou désactiver explicitement et durablement le mode vectoriel jusqu'à cette correction ;
2. remplacer les URL de production codées en dur par une résolution d'assets liée à l'environnement ;
3. tester qu'un Worker de preview ne lit jamais les artefacts de production ;
4. concevoir la publication atomique chunks/manifeste/vecteurs et les tests d'arrêt/reprise ;
5. réaliser ensuite un test E2E de préproduction avec JWT réel, sans données PDF dont les droits ne sont pas confirmés.

## Risques documentaires et garde-fous
Les 293 PDF restent sans preuve de droits confirmée et présents dans le dépôt public. Les expositions Raw des livres, sauvegardes et ressources JSON recensées aux Lots 712–724 ne sont pas résolues. Aucun OCR, ingestion réelle, embedding réel, appel Workers AI d'indexation, fusion ou déploiement n'a été lancé.

Aucun changement de `main`, Supabase/Auth/RLS/schéma/abonnement/paiement, aucune suppression de fichier et aucune réécriture d'historique. PR #23 reste ouverte et en brouillon.
