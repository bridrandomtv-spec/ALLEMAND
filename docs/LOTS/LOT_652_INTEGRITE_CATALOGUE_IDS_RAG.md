# Lot 652 — intégrité stricte du catalogue et des identifiants RAG

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Renforcer le point d'émission des preuves HMAC avant tout chargement réel du corpus. Le Worker doit refuser un catalogue ambigu ou une génération dont les identifiants globaux ne représentent pas une séquence complète.

## Défauts corrigés

1. **Identifiants documentaires dupliqués** : la construction précédente de la table `Map` remplaçait silencieusement la première fiche par la suivante. Un catalogue contenant deux fiches portant le même ID pouvait donc rendre la provenance ambiguë. Le Worker renvoie désormais `503 rag_catalogue_duplicate_id` dès qu'un doublon est rencontré.
2. **Identifiants de chunks discontinus** : le contrôle précédent comparait le nombre de chunks au compteur du manifeste, mais n'exigeait pas que les IDs soient exactement `0..total_chunks-1`. Un shard contenant un seul chunk d'ID 7 pouvait satisfaire le comptage. Le Worker vérifie maintenant chaque ID attendu et refuse avec `503 rag_generation_incomplete` si un trou existe.

## Tests négatifs ajoutés

Dans `tests/site_worker_rag_evidence_runtime.mjs` :
- doublon d'ID documentaire ;
- séquence de `global_id` incomplète malgré un compteur égal ;
- divergence entre `doc.source` et `doc.droits.source` ;
- absence d'un usage obligatoire (`indexation_rag`) ;
- méthode HTTP non autorisée.

Les fixtures restent entièrement synthétiques et en mémoire. Elles ne représentent ni une autorisation réelle ni un document scolaire réel.

## CI observée

Le commit de tests a déclenché le workflow `Audit tuteur IA — tests sans déploiement` :
- run : `43835144150` ;
- commit : `dc446e9080754e4784bd8f087a99d16430937fd8` ;
- job : `133189793602` ;
- conclusion : `failure` ;
- `runner_id=0`, `runner_name=""`, `steps=[]`, aucune étape et aucun log.

Le job s'est terminé en environ deux secondes sans exécuter de commande. Ce résultat **ne prouve pas un échec des tests** et ne permet pas de déclarer les modifications validées. La cause du non-démarrage du runner reste inconnue avec les informations exposées.

## État du corpus réel

Aucun changement aux 239 fiches du catalogue, aux 225 PDF, aux droits, aux sidecars, aux index ou aux shards réels. Aucun SHA-256 réel n'a été publié. Aucun OCR, aucune ingestion, aucun secret HMAC et aucun déploiement.

## Limites et suite

- Obtenir une exécution GitHub Actions qui démarre réellement un runner et fournit les étapes/logs.
- Exécuter les tests Node et Python et le pré-audit non destructif.
- Examiner la pièce d'autorisation institutionnelle réelle et son périmètre avant d'associer une référence à des documents.
- Construire ensuite un lot pilote synthétique complet puis un petit lot réel expressément qualifié.

Aucune fusion dans `main`, aucun déploiement et aucune opération Supabase/Auth/RLS/schéma/données/paiements.
