# Lot 355 — Rendre Messenger visible dans la navigation (12 novembre 2026)

## Décision et périmètre

Le point d'entrée Messenger existait déjà dans le tableau de bord étudiant et la vue `data-view="msg"` était présente dans `index.html`. Le module `msg.js` était câblé. L'absence du menu principal provenait de trois incohérences dans `app.js` :

1. `TABS` contenait `['msg','💬 الرسائل']`, mais le filtre de `renderTabs()` excluait explicitement `msg`.
2. La catégorie « القسم والتواصل » (`NAVCATS`) ne référençait pas `msg`.
3. Le parcours de secours de navigation ignorait également `msg`.

## Correction appliquée sur la branche de la PR #17

- Ajout de `msg` à la catégorie « القسم والتواصل » : l'entrée est donc générée dans le menu desktop et dans le panneau de navigation mobile.
- Suppression de l'exclusion explicite de `msg` dans le filtre de visibilité.
- Suppression de l'exclusion redondante dans le parcours des rubriques non classées.
- Ajout de deux assertions dans `ci/check-msg.mjs` pour empêcher le retour de cette régression.

## Parcours attendu

- Desktop : menu principal → « القسم والتواصل » → « 💬 الرسائل ».
- Mobile : bouton « ☰ المزيد » → « القسم والتواصل » → « 💬 الرسائل ».
- Tableau de bord étudiant : la carte « الرسائل والتواصل » reste disponible.
- La vue garde son identifiant `msg`, son élément `#msgBody`, son module `msg.js` et ses handlers existants.

## Limites fonctionnelles inchangées

Ce lot corrige uniquement la découvrabilité et la navigation. Il ne prétend pas terminer le Messenger national. Les invitations nationales, l'acceptation atomique côté serveur, l'affiliation scolaire officielle et les garanties RLS identifiées dans les lots précédents restent à implémenter et à tester. La présence de l'entrée de menu ne prouve pas que les parcours multi-lycées sont ouverts en production.

## Sécurité et opérations

- Aucun changement Supabase (SQL, RLS, Auth, GRANT, Storage ou Realtime).
- Aucun déploiement Cloudflare.
- Aucun changement de `main`, aucune fusion de PR.
- PR #17 conservée ouverte et non fusionnée.
- MFA/2FA et facturation hors périmètre.

## Commits

- Correction navigation `app.js` : `9b88ae270b68f3e51c3692934e95852d9522d3a7`.
- Tests de non-régression `ci/check-msg.mjs` : `d8c26ae488c658c5251dff4586f33a18c8229781`.

## Vérifications restantes

La CI déclenchée par ces commits doit confirmer les assertions de navigation. Un contrôle visuel du rendu desktop et mobile sur l'aperçu de la PR reste nécessaire avant de considérer le point d'entrée validé à l'écran.
