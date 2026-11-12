# Lot 316-D — maquette hors ligne de revue administrative

Date : 12 novembre 2026  
Statut : maquette UX isolée, données fictives et actions en mémoire uniquement.

## Objectif

Présenter visuellement le circuit de revue P1/P2/P3 défini aux Lots 316-B et 316-C : file des écarts, recherche, filtres, détail d'une ligne, note opérateur et décision d'un approbateur distinct.

## Accès à la maquette

Ouvrir localement `prototypes/registry-review-preview.html` dans un navigateur. La page est autonome et n'est pas ajoutée à la navigation publique ou au tableau de bord réel.

## Contenu

- Quatre lignes de démonstration avec identifiants `SYN-OR-001` à `SYN-OR-004`.
- Compteurs P1/P2/P3, recherche et filtres.
- Détail de l'écart et action proposée.
- Étape opérateur, puis étape approbateur distinct.
- Les décisions restent en mémoire JavaScript et disparaissent au rechargement.

## Garde-fous

- Bannière explicite « données fictives uniquement ».
- Aucun appel réseau, aucune API, aucun stockage local/session/indexedDB.
- Aucun branchement Supabase, Auth, RLS, Storage, Cloudflare ou backend.
- Aucun nom réel, aucune donnée d'élève, aucune liste réelle d'établissement.
- Les identifiants saisis sont des exemples libres : ils ne prouvent aucune identité ni permission.
- Les boutons simulent le circuit ; ils ne constituent pas une approbation institutionnelle, une signature ou un audit.
- La maquette n'est pas intégrée au menu ni publiée en production.

## Tests

`node --test prototypes/registry-review-preview.test.mjs`

Le test vérifie les avertissements visibles, la présence des identifiants synthétiques, l'absence de fetch et l'absence d'API de stockage navigateur.

**GO** pour revue UX interne sur données synthétiques. **NO-GO** pour tout usage administratif réel.
