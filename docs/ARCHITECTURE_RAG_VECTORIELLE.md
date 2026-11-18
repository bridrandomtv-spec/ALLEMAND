# Lot 622 — préparation de la recherche vectorielle multilingue (18 novembre 2026)

## État vérifié avant conception
- Le code de `worker/ia-ask.js` utilise déjà la liaison Cloudflare Workers AI `env.AI` pour la génération des réponses.
- Le RAG PDF récupère les chunks depuis `corpus_rag_chunks.json` après lecture protégée par JWT/RLS, puis applique BM25 et expansion terminologique FR/AR/Darija → allemand.
- `corpus_rag_chunks.json` et `corpus_rag_manifest.json` sont actuellement vides : 0 document, 0 chunk. Les 225 PDF du corpus utilisateur restent exclus faute de droits confirmés.
- La suite autonome Professeur IA du run `44214054953` est réussie sur le commit applicatif `27b1aa308a755c9d17ecf254effec09fbe7c6c87`. La CI globale échoue sur la validation Messenger EduDZ, hors périmètre IA.

## Modèle candidat étudié
- `@cf/google/embeddinggemma-2` est disponible dans Workers AI depuis le 12 novembre 2026. Cloudflare annonce plus de 100 langues, une sortie de 768 dimensions par défaut et des dimensions configurables de 128, 256 ou 512. Le tarif publié est de 0,0017 USD par million de tokens d'entrée.
- Workers AI est inclus dans les plans Workers Free et Paid avec une allocation commune de 10 000 Neurons par jour. Au-delà, un plan Paid facture 0,011 USD par 1 000 Neurons ; sur le plan Free, les opérations au-delà de la limite échouent. L'usage d'embeddings n'est donc pas illimité ni garanti sans coût.
- Ce modèle réutiliserait la liaison `env.AI` déjà présente : aucun fournisseur ou service vectoriel externe supplémentaire n'est nécessaire. Les appels d'embedding consommeraient toutefois le quota Workers AI partagé avec la génération existante.

## Architecture proposée — non activée
1. Ingestion : après validation des métadonnées de droits et de la licence, calculer les embeddings des chunks approuvés ; ne jamais vectoriser un document rejeté par le contrôle de droits.
2. Modèle : `@cf/google/embeddinggemma-2`, dimension initiale proposée 256 pour limiter le stockage, avec les mêmes paramètres et préfixes de tâche pour les documents et les requêtes.
3. Versionnement : enregistrer modèle, dimensions, version de schéma, stratégie de normalisation, identifiant/hash du chunk et empreinte du corpus. Rejeter les vecteurs d'un modèle, d'une dimension ou d'une version incompatible.
4. Stockage : artefact vectoriel séparé, statique et protégé par le Worker du site avec le même JWT/RLS que les chunks. Aucun stockage Supabase, aucune table et aucune migration.
5. Recherche : authentifier l'utilisateur ; récupérer les documents/chunks via le Worker protégé ; filtrer les licences et droits confirmés ; seulement ensuite classer les chunks autorisés par similarité cosinus. BM25 reste disponible et sert de repli si les vecteurs sont absents, incompatibles ou si l'embedding échoue.
6. Recherche hybride : comparer sur un corpus de test contrôlé la fusion BM25 + vectorielle (RRF) avec BM25 seul avant de choisir les seuils et le nombre d'extraits. Ne pas supposer qu'un score vectoriel constitue une autorisation.
7. Activation : drapeau `RAG_VECTOR_ENABLED` désactivé par défaut. Aucun appel d'embedding en production tant que le drapeau n'est pas explicitement activé et que le quota/coût n'a pas été vérifié.

## Tests exigés avant activation
- Validation de la forme, de la dimension, de la normalisation et de la version des vecteurs.
- Recherche croisée arabe/Darija/Arabizi/français ↔ allemand sur des documents de test dont les droits sont explicitement autorisés.
- Vérification que les documents non autorisés sont exclus avant classement et qu'aucun de leurs extraits n'est transmis au modèle.
- Repli BM25 si l'IA d'embedding est indisponible, si le vecteur est absent ou si la version diffère.
- Vérification que le drapeau désactivé n'appelle jamais le modèle d'embedding.
- Mesure de taille des artefacts et du coût/Neurons sur un petit corpus autorisé avant toute indexation large.

## Décision et limites
- Lot 622 est une étude d'architecture et de coût ; aucun embedding n'a été généré, aucun PDF utilisateur n'a été débloqué et aucune recherche vectorielle n'est activée.
- Le candidat recommandé est EmbeddingGemma 2 sur la liaison Workers AI déjà utilisée, sous réserve de respecter le quota gratuit et de garder l'activation désactivée par défaut.
- Le prochain travail de code devra être isolé derrière le drapeau, testé avec des fixtures synthétiques/explicitement autorisées et ne devra pas modifier Supabase, main, les abonnements ou le déploiement.
- PR #22 reste ouverte en brouillon, non fusionnée.


# Lot 623 — première implémentation de la recherche vectorielle facultative (18 novembre 2026)

## Modifications de code
- `worker/ia-ask.js` accepte maintenant une recherche vectorielle facultative pour `corpus_search` / `corpus_document`, derrière le drapeau strict `env.RAG_VECTOR_ENABLED === 'true'`.
- Sans ce drapeau, aucun chargement du fichier vectoriel et aucun appel d'embedding ne sont effectués : le comportement reste BM25.
- Lorsque le drapeau est activé et que l'index contient des vecteurs valides, le Worker calcule l'embedding de la question avec `@cf/google/embeddinggemma-2` (256 dimensions), calcule la similarité cosinus et fusionne le classement sémantique et BM25 par Reciprocal Rank Fusion (RRF).
- Si le fichier vectoriel est absent/invalide, si le binding AI est absent, ou si l'inférence échoue, le Worker revient au classement BM25. Aucun échec d'embedding ne bloque une recherche lexicale valide.
- Le classement vectoriel ne voit que les chunks déjà filtrés par `rights_confirmed`, licence autorisée et sélection documentaire serveur. Un vecteur n'est jamais une preuve d'autorisation.

## Protection de l'index
- `src/site-worker.js` protège désormais `/assets/bdd/corpus_rag_vectors.json` avec le même contrôle JWT/RLS existant que `corpus_rag_chunks.json`.
- Tests ajoutés pour refuser la lecture directe sans JWT / sans entitlement RLS et autoriser la lecture uniquement après validation RLS.
- Nouveau fichier `assets/bdd/corpus_rag_vectors.json` versionné : modèle `@cf/google/embeddinggemma-2`, 256 dimensions, normalisation L2, zéro vecteur. Aucun document utilisateur n'a été vectorisé.

## Tests ajoutés
- Récupération sémantique d'un passage allemand depuis une question arabe sans correspondance lexicale, avec exclusion d'un document sans licence autorisée.
- Vérification que le drapeau désactivé n'effectue aucune requête vers l'index vectoriel.
- Vérification du repli BM25 en cas d'échec du modèle d'embedding.
- Vérification du contrôle JWT/RLS pour l'artefact vectoriel.

## Limites et état de validation
- Cette première étape implémente le chemin de recherche côté Worker, pas encore la génération des embeddings documentaires à l'ingestion. L'index reste vide (0 vecteur) et BM25 reste le seul mode opérationnel par défaut.
- Le drapeau n'est pas activé dans la configuration de production. Aucun appel d'embedding ni coût d'inférence n'a été déclenché par cette modification.
- Aucun changement de `wrangler.toml`, Supabase, Auth, RLS, SQL, abonnements, `main` ou Cloudflare déployé.
- PR #22 reste ouverte en brouillon, non fusionnée. Les tests CI du nouveau HEAD doivent être vérifiés avant de déclarer ce lot validé.

## Prochaine étape
Lot 624 — construire l'ingestion vectorielle reproductible des seuls chunks autorisés, avec préfixes de tâche document, batch contrôlé, normalisation L2, empreinte/version de modèle, tests de dimension et sans déclencher d'indexation des 225 PDF non autorisés.


# Lot 624 — générateur reproductible des embeddings documentaires (18 novembre 2026)

## Audit réel du corpus
- `assets/bdd/corpus_rag_chunks.json` : 0 document et 0 chunk.
- `assets/bdd/corpus_rag_manifest.json` : 0 document, 0 chunk ; aucune source n'est actuellement admissible à la vectorisation.
- Conséquence : aucun appel Workers AI n'a été exécuté et aucun vecteur documentaire n'a été généré. Les PDF sans droits confirmés restent exclus.

## Implémentation
- Nouveau script `tools/build_corpus_rag_vectors.py` : lit uniquement les deux artefacts RAG existants ; vérifie versions, cohérence des compteurs du manifeste, `rights_confirmed === true` et appartenance à la liste des licences autorisées avant de construire les entrées API.
- Le texte envoyé au modèle utilise le préfixe documentaire officiel `title: ... | text: ...` ; le Worker conserve son préfixe de requête `task: search result | query: ...`.
- Lots bornés (8 par défaut, 32 maximum), validation stricte du nombre et des indices de réponse, dimension exacte 256, valeurs finies et normalisation L2.
- Le schéma de sortie reprend exactement les identifiants attendus par le Worker : `chunk_id`, `document_id`, `embedding`. Cette correspondance a été vérifiée dans `worker/ia-ask.js`.
- Empreintes SHA-256 du fichier de chunks et du manifeste enregistrées dans l'artefact pour tracer la provenance. Écriture atomique uniquement après réussite de tous les lots.
- Aucun package Python supplémentaire ; API Cloudflare REST documentée, secrets uniquement via `CLOUDFLARE_ACCOUNT_ID` et `CLOUDFLARE_API_TOKEN` en variables d'environnement.

## Barrières de coût et de sécurité
- Mode par défaut : dry-run local, zéro requête réseau, zéro écriture du fichier vectoriel.
- L'exécution réelle exige à la fois `--execute` et `--confirm-cloudflare-billing`, plus des identifiants Cloudflare valides.
- Un corpus vide provoque un arrêt explicite en mode exécution ; aucune génération d'embeddings vides ou aucun coût inutile.
- Aucun PDF sans droits confirmés ne peut entrer dans le lot envoyé au modèle.
- Aucun changement Supabase, Auth, RLS, SQL, abonnement, `wrangler.toml`, `main` ou déploiement Cloudflare.

## Tests et validation
- Nouveau fichier `tests/test_build_corpus_rag_vectors.py` : filtre de droits, incohérence manifeste, dimension, NaN/Inf, normalisation, index API, batching, métadonnées et dry-run sans appel API.
- La CI `professor-ai` est étendue pour exécuter ces tests en plus des tests d'ingestion PDF existants.
- Les tests sont ajoutés à la CI mais ne sont pas encore déclarés réussis : le nouveau HEAD doit être exécuté par GitHub Actions.

## Suite
- Attendre l'exécution CI du nouveau HEAD.
- Dès que le propriétaire fournit des documents avec licences et droits vérifiables, générer un petit lot autorisé seulement après validation explicite du coût/quota Workers AI.
- Comparer ensuite la qualité retrieval BM25 vs hybride sur un jeu d'évaluation multilingue autorisé avant toute activation du drapeau en production.


## Contrôle CI après le Lot 624 — 18 novembre 2026
- Run `44216234225` sur le HEAD `e941fb60094fc71c89f94c484eae42c2c1c63e70` : les 8 tests d'ingestion PDF passent et les 8 tests du nouveau générateur vectoriel passent.
- Dans `tests/worker-ai-auth.test.mjs`, 73 tests sur 74 passent. L'unique échec était une assertion de fixture qui attendait `Das Perfekt wird` alors que le corpus de test fournit `Der Perfekt wird`. Le test a été corrigé dans le commit `7f9aadd6230e44deb8534a0bcfd9549aa3880663` ; il s'agissait d'une attente textuelle incorrecte, pas d'une panne du repli BM25.
- Le job global échoue aussi sur une erreur de syntaxe préexistante et hors périmètre dans `ci/check-msg.mjs:231` (Messenger EduDZ). Les étapes de validation structurelle précédentes, dont YAML/JSON, moteur IA 9 cas, suite de build T1–T6 et syntaxe JS 37/37, étaient réussies. Ce chantier IA ne modifie pas Messenger.
- Le correctif `7f9aadd` n'a pas encore de nouveau run CI associé au moment de cette mise à jour. Il n'est donc pas présenté comme validé.
- Le job Worker doit être rejoué sur ce nouveau HEAD pour confirmer les 74/74 tests et reprendre les étapes RAG/QUST/PROF qui ont été sautées après le premier échec.


## Lot 625 — tests multilingues et validation CI (18 novembre 2026)
- Ajout d'un test de contrat de recherche hybride sur quatre formulations : arabe standard, darija, Arabizi et français, toutes ciblant un extrait allemand. Le test vérifie le passage par le modèle d'embedding et le préfixe de requête Cloudflare exact `task: search result | query: ...`. Il s'agit d'un test de pipeline avec vecteurs contrôlés, pas d'une mesure de qualité réelle du modèle.
- Correctif de l'assertion BM25 de repli inclus ; la recherche reste fonctionnelle si l'inférence d'embedding échoue.
- CI `44278364370` sur le commit `4662bb36f9a79049c8800d5c93a563ef31d25fb9` : job autonome Professeur IA `success`.
- Résultats confirmés dans les logs :
  - Ingestion PDF/OCR/droits : 8/8.
  - Générateur d'embeddings : 8/8.
  - Worker IA/JWT/RAG : 75/75.
  - Garde d'accès du Worker du site : 14/14.
  - QUST Darija/Arabizi : 9/9.
  - Régressions : RAG 12/12, PROF 18/18, suite combinée exécutée.
- Le job structurel global échoue toujours sur l'erreur indépendante de Messenger `ci/check-msg.mjs:231` (SyntaxError, expression `currentThread.querySelector`), sans rapport avec le professeur IA. Les validations antérieures de ce job étaient réussies. Aucun changement Messenger n'est inclus dans cette branche IA.
- Aucun benchmark de rappel/précision sur documents réels n'est possible : le manifeste PDF contient toujours zéro document et zéro chunk. Les tests multilingues actuels valident le câblage et la sécurité du classement avec des fixtures synthétiques.
- Le dernier HEAD applicatif testé est `4662bb36f9a79049c8800d5c93a563ef31d25fb9`. Les commits documentaires qui suivent ne modifient pas le code testé. La PR reste ouverte et en brouillon, sans fusion ni déploiement.


## Lot 626 — inventaire PDF réel et découverte récursive (18 novembre 2026)
- Audit de l'arbre Git complet du dépôt : 293 fichiers PDF versionnés, dont 264 dans `docs/archive/documents/` et 29 à la racine.
- Aucun des 293 PDF ne possède le compagnon de droits attendu par l'ingestion (`_<nom_du_pdf>.json`) dans son propre dossier. Le pipeline ne peut donc en indexer aucun sans validation explicite des droits.
- Le manifeste RAG reste inchangé à 0 document / 0 chunk. Aucun PDF n'a été envoyé au modèle d'embedding, et aucune licence n'a été supposée à partir du nom, du dossier ou du contenu.
- Défaut de couverture corrigé : `tools/ingest_corpus_rag.py` parcourait uniquement les PDF du premier niveau (`glob`). Il utilise maintenant une découverte récursive déterministe (`rglob`) et conserve le chemin relatif dans `source_file` et les rapports d'exclusion, pour éviter les collisions entre fichiers de même nom.
- Nouveau test : un PDF situé dans un sous-dossier n'est ingéré que si son compagnon local confirme `droits_confirmes: true` et une licence autorisée ; son chemin relatif est conservé.
- Ce changement améliore la couverture technique, mais ne change pas la politique de droits : les 293 PDF restent exclus tant que leurs preuves ne sont pas fournies.
- Validation CI du Lot 626 en attente sur le nouveau HEAD ; ne pas annoncer les tests comme réussis avant le résultat du job autonome Professeur IA.
