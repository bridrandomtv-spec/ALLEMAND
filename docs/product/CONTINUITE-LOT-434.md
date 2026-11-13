# Continuité — Lot 434

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Rapport :** [LOT-434-REFONTE-VISUELLE-MULTAQA-MESSENGER.md](LOT-434-REFONTE-VISUELLE-MULTAQA-MESSENGER.md)

## Travail effectué
- Remplacement de la maquette du forum par une structure visuelle RTL en trois colonnes.
- Suppression des publications fictives et ajout d'un état vide qui annonce honnêtement l'absence de raccordement du fil réel.
- Refonte additive des styles du forum et amélioration de la présentation de la liste et des fils Messenger existants.
- Adaptation responsive et invalidation du cache CSS (`style-prototype-dz.css?v=197`).
- Routes et identifiants principaux préservés.

## Limites explicites
- Lot 434 est une première étape visuelle, PAS la livraison de Facebook/Messenger.
- Le fil réel, les publications, commentaires, réactions, profils, annuaire national, invitations sociales et invitations Messenger restent à développer.
- La recherche actuelle dans `msg.js` ne cherche que dans les conversations et groupes déjà chargés.
- Aucun changement backend, SQL, Supabase, Auth, RLS, ACL, RPC, trigger, Storage, Realtime ou paiement.
- Aucun test de permissions multi-comptes ni déploiement Cloudflare.

## Contrôles GitHub
- PR #17 : ouverte, non fusionnée, base `main), HEAD au contrôle : `00db0a0f0b9e2fb413922e2b82b870b91f559d72`.
- `mergeable=true) au contrôle.
- Aucun workflow CI associé à ce HEAD retourné ; CI non confirmée.
- Pas de rebase, synchronisation, changement de base ou fusion.

## Prochaine étape
Construire le véritable fil communautaire et les interactions sociales sur des contrats serveur vérifiés, puis le répertoire national et les invitations Messenger. Avant toute requête sur le projet Supabase actif, demander une autorisation distincte et rester strictement en SELECT catalogue ; aucun frais ni ressource payante.

## Lot 435 — synchronisation du cache après le Lot 434

- Diagnostic CI : le run #3477 échouait dans `ci/check-public-portal.mjs`, car le HTML chargeait `style-prototype-dz.css?v=197`, tandis que le Service Worker et les assertions CI attendaient encore `v=196`.
- Correction réelle : `sw.js` précache désormais `style-prototype-dz.css?v=197` et passe à `dz-de-v3.185.0.0.148` pour forcer le renouvellement du cache statique.
- Le contrôle `ci/check-public-portal.mjs` attend maintenant la référence CSS `v=197` dans le HTML et le Service Worker.
- Commits : Service Worker `dcdbd71`, contrôle CI `e660278`.
- Vérifications : PR #17 toujours ouverte, non fusionnée ; GitHub indique `mergeable=true`. Aucun workflow n'était encore associé au HEAD après ces deux commits lors du contrôle.
- Aucun changement de `main`, aucune fusion, aucun déploiement Cloudflare, aucune requête Supabase et aucune modification de données.
- Le Lot 435 ne construit pas encore les fonctions sociales/Messenger ; il répare uniquement la cohérence du cache et son test CI.


## Lot 436 — synchronisation du contrôle CI Messenger (13 novembre 2026)
- Contrôle du PR #17 : PR toujours ouverte et non fusionnée. HEAD observé avant correction : `c11e5bb14a7d8f216ffba9891e2582e224edb9cc`.
- CI #3480 échouait dans `ci/check-msg.mjs` car le test exigeait encore la version du service worker `dz-de-v3.185.0.0.147`, alors que `sw.js` est déjà en `.148`; le précache `./msg.js?v=3514` et la référence HTML `msg.js?v=3514` concordent.
- Correction limitée au contrôle CI : attente de `dz-de-v3.185.0.0.148`. Aucun changement de `msg.js`, `sw.js`, `index.html`, Supabase, SQL, Auth, RLS, stockage, paiement ou données.
- Commit correctif : `e257c527b8b6f3aea1653280cd3bf98c3286c36f`.
- À ce stade, aucun run CI n'était encore retourné pour ce nouveau commit. La correction n'est donc pas déclarée validée avant exécution de la CI.
- Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune opération Supabase.
