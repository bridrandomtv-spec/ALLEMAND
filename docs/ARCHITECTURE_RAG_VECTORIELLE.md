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
