

## Lot 436 — synchronisation du contrôle CI Messenger (13 novembre 2026)
- Contrôle du PR #17 : PR toujours ouverte et non fusionnée. HEAD observé avant correction : `c11e5bb14a7d8f216ffba9891e2582e224edb9cc`.
- CI #3480 échouait dans `ci/check-msg.mjs` car le test exigeait encore la version du service worker `dz-de-v3.185.0.0.147`, alors que `sw.js` est déjà en `.148`; le précache `./msg.js?v=3514` et la référence HTML `msg.js?v=3514` concordent.
- Correction limitée au contrôle CI : attente de `dz-de-v3.185.0.0.148`. Aucun changement de `msg.js`, `sw.js`, `index.html`, Supabase, SQL, Auth, RLS, stockage, paiement ou données.
- Commit correctif : `e257c527b8b6f3aea1653280cd3bf98c3286c36f`.
- À ce stade, aucun run CI n'était encore retourné pour ce nouveau commit. La correction n'est donc pas déclarée validée avant exécution de la CI.
- Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune opération Supabase.
