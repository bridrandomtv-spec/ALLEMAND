# Lot 720 — comparaison du risque avec main — 20/11/2026

## Objectif
Déterminer si les artefacts signalés au Lot 719 sont introduits par PR #23 ou s'ils sont déjà présents sur la branche publique principale. Comparaison en lecture seule des arbres Git complets, sans modification de main.

## Résultat vérifié
Arbre de `main` :
- SHA : `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`
- 1 431 blobs ;
- 293 PDF ;
- 834 blobs sous `docs/archive/` ;
- `docs/private/buch_pages_full.json` présent, 197 523 octets, blob SHA `3114e3024995b7c7a9f22fcbdfc78218742f2084`.

Arbre du HEAD de PR #23 au moment de la comparaison :
- SHA : `bd14967319c17bb7c7533f7578d2a2f085adf785`
- 1 446 blobs ;
- 293 PDF ;
- 834 blobs sous `docs/archive/` ;
- même sauvegarde `docs/private/buch_pages_full.json`, même taille et même blob SHA.

## Conclusion
Les 293 PDF, les 834 fichiers d'archive et la sauvegarde intégrale du livre 2AS sont déjà présents sur `main`, avec les mêmes objets Git. Ce risque d'exposition n'est donc pas introduit par les commits documentaires récents de PR #23 ; il préexiste sur la branche principale publique.

Cela ne réduit pas le niveau de risque : le dépôt est public et la sauvegarde du livre a été récupérée via Raw au HEAD de la PR. Mais la correction doit être traitée comme un chantier de sécurité distinct, planifié avec le propriétaire, et non comme une modification implicite de main pendant l'audit de la PR.

## Limites
La comparaison porte sur les arbres courants et l'identité du blob ciblé. Elle ne constitue pas une analyse exhaustive de tous les objets orphelins, forks, clones, caches externes, artefacts CI ou toutes les versions historiques de tous les PDF. Le téléchargement direct du PDF binaire via le connecteur n'a pas été réalisé ; leur présence dans les arbres du dépôt public est établie.

## Actions
- Aucune écriture sur `main`.
- Aucune suppression de fichier, modification de visibilité ou réécriture d'historique.
- Aucun changement Worker, Supabase/Auth/RLS/schéma/paiement ou déploiement.
- PR #23 reste ouverte/en brouillon et non fusionnée.
