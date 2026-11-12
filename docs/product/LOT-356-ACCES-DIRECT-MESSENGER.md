# Lot 356 — Accès direct à Messenger (12 novembre 2026)

## Objectif

Éviter que l'élève doive ouvrir une catégorie secondaire pour trouver la messagerie. Le Lot 355 avait rétabli Messenger dans « القسم والتواصل », mais le retour utilisateur montre que ce niveau de menu n'est pas suffisamment découvrable.

## Modifications sur la branche PR #17

- Desktop : ajout d'un bouton direct « 💬 الرسائل » à côté des accès principaux.
- Mobile : ajout de « 💬 الرسائل » dans la barre de navigation rapide, sans passer par « ☰ المزيد ».
- Retrait de `msg` de la catégorie « القسم والتواصل » afin d'éviter les doublons.
- Ajout de `msg` à l'ensemble des vues déjà traitées dans la navigation desktop pour éviter sa réapparition dans la boucle de secours.
- Tests `ci/check-msg.mjs` étendus : raccourci desktop, entrée mobile, absence d'exclusion, prévention du doublon.

## Comportement attendu

- Ordinateur : le bouton « 💬 الرسائل » est directement visible dans la navigation principale.
- Mobile : « 💬 الرسائل » est directement accessible depuis la barre rapide.
- Le bouton conserve `data-go="msg"` et ouvre la vue existante `data-view="msg"`.
- La carte Messenger du tableau de bord reste intacte.

## Limites

Ce lot améliore uniquement l'accès à l'écran. Il ne termine pas les invitations nationales, l'ouverture serveur des DM après acceptation, l'annuaire inter-wilayas ni l'affiliation officielle. Les constats de sécurité des lots précédents restent valides.

## Sécurité et déploiement

Aucun changement Supabase, aucun déploiement Cloudflare, aucune modification de `main`, aucune fusion de PR. PR #17 reste ouverte. MFA/2FA et facturation restent hors périmètre.

## Commits

- Raccourcis desktop/mobile : `89de542f5bb879ea4c0d887ea6725f39b2511ea5`.
- Protection contre le doublon : `2144774410cb9d1a310a088c2bef6f51394ef7a5`.
- Tests de non-régression : `3e96799fe13fad368444f8d46dd54c887a855a0c` et `6d7715d4736a04cc2932c823c8a851f81a3e446d`.

## Vérification

La CI doit confirmer que le code et les assertions passent. Le rendu graphique réel dans le navigateur Cloudflare n'a pas été inspecté dans ce lot ; l'aperçu de PR doit être contrôlé avant fusion.
