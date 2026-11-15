# Lot 645 — harnais d’intégration Worker sans modèle externe

Date : 2026-11-16

## Objectif

Tester le contrat HTTP du Worker CERVEAU et le contenu réellement transmis au modèle sans clé, appel réseau, coût d'inférence ni déploiement.

## Ajouts

- Création de `tests/worker_request_runtime.mjs`.
- Le test charge `worker/ia-ask.js` dans un VM Node isolé en remplaçant uniquement l'export ES-module par une référence de test.
- Une liaison `env.AI.run` simulée capture les messages et retourne une réponse synthétique.
- Assertions sur le statut HTTP, le format JSON, la langue de sortie, la formulation originale, la normalisation technique, le contexte RAG, les indices QUST et la consigne système anti-injection documentaire.
- Ajout du fichier aux déclencheurs `push.paths` et à l'étape d'exécution du workflow `.github/workflows/tutor-audit.yml`.

## Ce que le test ne démontre pas

- Il ne mesure ni la qualité linguistique/pédagogique d'un modèle réel, ni sa latence, ni sa disponibilité Cloudflare.
- Il ne valide pas les droits des documents ni l'existence d'un index RAG de production.
- Le test et les autres vérifications n'ont pas été exécutés dans un runner attesté durant cette session ; aucun PASS n'est revendiqué.
- Aucun secret ou token n'est utilisé. Aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/données/paiements, aucune ingestion réelle et aucun merge.

## Suite

Lot 646 : vérifier la chaîne complète du navigateur au Worker avec un stub contrôlé de `fetch` dans `ia.js`, incluant la citation SHA-256 concordante et les cas sans source / hash divergent. Ensuite seulement, lancer les cas de la matrice multilingue dans un environnement de test réel, avec les documents autorisés et un endpoint explicitement contrôlé.
