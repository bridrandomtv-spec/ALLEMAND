# Lot 722 — inventaire des branches Git publiques — 20/11/2026

## Périmètre
Inventaire des branches du dépôt public et comparaison de cinq références anciennes représentatives. Lecture seule ; aucune branche n'a été supprimée, renommée ou protégée.

## Résultats
- 30 branches retournées par l'API GitHub.
- 30/30 sont marquées `protected: false` dans les métadonnées de branche.
- Les cinq références examinées en détail sont `ai/lot-583-darja-arabizi-rag`, `ai/lot-601-worker-jwt`, `audit/lot-603-corpus-contract-tests`, `design/prototypes-67-74-alignment` et `security/pr10-confirmed-links-fix`.
- Les cinq arbres sont complets (non tronqués) et contiennent chacun 293 PDF ainsi que `docs/private/buch_pages_full.json`.
- Dans ces cinq références, la sauvegarde du livre 2AS possède le même blob SHA `3114e3024995b7c7a9f22fcbdfc78218742f2084` que sur `main` et le HEAD de PR #23.

## Interprétation
Les références de branches constituent des pointeurs supplémentaires vers des historiques Git publics. Pour les cinq branches comparées, les PDF et la sauvegarde du livre ne sont pas seulement présents dans `main` ou dans PR #23 : les mêmes objets sont aussi présents dans plusieurs branches anciennes.

L'inventaire ne démontre pas que tous les arbres des 30 branches ont été parcourus : seules cinq branches anciennes ont fait l'objet d'une comparaison récursive ciblée. Il ne couvre pas non plus les forks, clones locaux, caches externes, objets Git inaccessibles, archives téléchargées ou copies de tiers.

## Risque de gouvernance
Aucune des 30 branches n'est actuellement marquée protégée. Ce constat ne prouve pas à lui seul qu'une branche peut être modifiée par n'importe qui : les permissions du dépôt et les règles d'organisation ne sont pas entièrement déduites de ce seul champ. Il indique néanmoins qu'aucune protection de branche individuelle n'est signalée dans les métadonnées retournées.

## Actions
- Aucun changement de protection ou de règle de branche sans décision explicite.
- Aucune suppression de branche ni réécriture d'historique.
- Une purge éventuelle devra coordonner toutes les références contenant les blobs, les PR ouvertes, les forks et les clones ; supprimer une branche ne révoque pas les objets encore référencés ailleurs.
- Rapport documentaire uniquement ; aucun changement `main`, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/paiement.
