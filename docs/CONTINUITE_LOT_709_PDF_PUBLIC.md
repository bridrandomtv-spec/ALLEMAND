# Continuité — Lot 709 : suspension des liens PDF publics

Date : 20 novembre 2026

## Autorisation et périmètre
- L'utilisateur a explicitement autorisé la désactivation des liens PDF publics GitHub Raw et la préparation de leur migration vers un accès protégé.
- Intervention limitée à la branche `ai/rag-corpus-integrity-lot-635` de la PR #23.
- Aucun changement de `main`, aucun déploiement, aucune écriture Supabase, aucun changement Auth/RLS/schéma/abonnement/paiement.
- La migration vers un stockage protégé est préparée au niveau du diagnostic seulement ; aucune migration de stockage ou de backend n'est engagée.

## Modifications
- `corpus.js` ne convertit plus les chemins `docs/archive`, `dzexams-*` ou les URL PDF en URL GitHub Raw publique ; ces ressources renvoient désormais une cible neutre `#`.
- Les deux chemins de rendu de la grille du corpus affichent explicitement « PDF suspendu — accès protégé en préparation » au lieu d'un bouton d'ouverture.
- Les PDF et leurs métadonnées n'ont pas été supprimés ni modifiés ; les fiches du catalogue restent visibles.
- Nouveau test `tests/corpus-public-pdf-access.test.mjs` : vérifie l'absence de génération d'URL GitHub Raw et les deux rendus d'avertissement.
- Le test a été ajouté à l'étape CI de validation de provenance dans `.github/workflows/deploy.yml`.

## Commits
- `corpus.js` : `81213f1c70885340833d34bd4b9ea51bcb7d60c1`
- Test : `7ab7f0a19550036849445608c600ce66fa493b37`
- Workflow CI : `115ebada638c693764656e8a49fedf9a8d83ae51`

## Validation et limites
- La CI doit être vérifiée sur le HEAD final après les trois commits.
- Aucun fichier PDF n'a été déplacé, supprimé, extrait, OCRisé ou indexé.
- Aucun stockage protégé n'a encore été provisionné. La mise en place d'une destination privée nécessitera un choix d'architecture et une autorisation distincte si elle implique des changements Supabase, Storage, Auth ou RLS.
- PR #23 reste ouverte, en brouillon et non fusionnée ; aucune fusion n'est autorisée par cette intervention.
