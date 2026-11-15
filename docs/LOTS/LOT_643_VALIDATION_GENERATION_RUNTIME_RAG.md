# Lot 643 — validation de génération du lecteur RAG en runtime

Date : 2026-11-16

## Défaut découvert

Le harnais `tests/rag_loader_runtime.mjs` construisait des manifestes v2 sans champ `generation`, alors que `rag.js` exige une empreinte SHA-256 de 64 caractères. Les objets shards de succès n'avaient pas non plus `_generation`, pourtant exigé pour accepter les chunks shardés.

En conséquence, les scénarios présentés comme tests de lecture shardée pouvaient être invalides dès la validation du manifeste et exercer le fallback, au lieu de vérifier le chemin nominal.

## Corrections

- Ajout d'une empreinte synthétique stable `GENERATION` aux manifestes de test.
- Ajout de `_generation` aux réponses de shards qui doivent être valides.
- Le scénario « meilleur score dans le dernier shard » désactive maintenant volontairement l'index complet ; il ne peut réussir que si le lecteur accepte réellement les shards.
- Ajout d'un scénario qui présente un shard d'une génération différente et exige le fallback vers l'index complet.
- Les scénarios de shard absent, posting orphelin, ID dupliqué, manifeste incompatible et absence de tout index restent couverts.

## Exécution et limites

- Le harnais runtime contient désormais 7 scénarios asynchrones.
- Le workflow `.github/workflows/tutor-audit.yml` inclut ce fichier dans ses déclencheurs `push.paths` et exécute `node tests/rag_loader_runtime.mjs`.
- Le commit de correction n'a pas de statut remonté par l'interface consultée (`statuses: []`) et aucun run PR n'a été retourné. Cette dernière interface filtre les runs déclenchés par pull request ; elle ne permet donc pas de conclure qu'aucun run push n'existe.
- Les scénarios n'ont pas été exécutés dans un runner local durant cette session. Aucun PASS n'est revendiqué.
- Aucun index réel ni shard du fonds documentaire n'a été touché ; aucun déploiement, changement Supabase/Auth/RLS/schéma/données/paiements/secrets ou merge.

## Suite

Lot 644 : auditer la réponse CERVEAU/Worker et le contrat entre RAG et tuteur : une réponse issue d'un extrait doit transporter une référence vérifiable ; une absence de source doit être explicitement signalée ; une demande hors corpus ne doit pas recevoir une pseudo-réponse documentaire.
