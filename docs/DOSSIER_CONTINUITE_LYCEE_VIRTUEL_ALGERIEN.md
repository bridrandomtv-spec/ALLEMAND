

## Lot 436 — synchronisation du contrôle CI Messenger (13 novembre 2026)
- Contrôle du PR #17 : PR toujours ouverte et non fusionnée. HEAD observé avant correction : `c11e5bb14a7d8f216ffba9891e2582e224edb9cc`.
- CI #3480 échouait dans `ci/check-msg.mjs` car le test exigeait encore la version du service worker `dz-de-v3.185.0.0.147`, alors que `sw.js` est déjà en `.148`; le précache `./msg.js?v=3514` et la référence HTML `msg.js?v=3514` concordent.
- Correction limitée au contrôle CI : attente de `dz-de-v3.185.0.0.148`. Aucun changement de `msg.js`, `sw.js`, `index.html`, Supabase, SQL, Auth, RLS, stockage, paiement ou données.
- Commit correctif : `e257c527b8b6f3aea1653280cd3bf98c3286c36f`.
- À ce stade, aucun run CI n'était encore retourné pour ce nouveau commit. La correction n'est donc pas déclarée validée avant exécution de la CI.
- Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune opération Supabase.


## Lot 437 — première tranche serveur du consentement Messenger (13 novembre 2026)
- Création sur la branche de la migration préparatoire `supabase/migrations/202611130001_msg_invitation_consent.sql`.
- Elle ajoute `msg_invites` (pending/accepted/declined/cancelled/expired), les RPC distinctes envoyer/accepter/refuser/annuler, la limite d'envoi, l'expiration à 7 jours et la vérification que seul le destinataire répond / seul l'expéditeur annule.
- Elle révoque l'ancienne RPC `msg_open_direct(uuid)` qui pouvait créer un DM sans consentement, interdit la création directe d'une conversation par la policy et ajoute un trigger serveur exigeant une invitation acceptée pour ajouter les membres d'un nouveau DM.
- Le contrôle de blocage est bilatéral et la fonction de membership refuse désormais la lecture des DM entre personnes qui se bloquent, tout en conservant la logique des groupes.
- Le contrôle statique `ci/check-msg.mjs` vérifie désormais la présence de ces garde-fous dans la migration.
- **État : migration uniquement préparée dans GitHub, non exécutée sur Supabase.** Aucun DDL/DML, compte, message ou profil n'a été modifié dans la base active. Pas de test PostgreSQL réel à ce stade; tests négatifs obligatoires listés en fin de migration.
- Fichiers modifiés : migration SQL ci-dessus; `ci/check-msg.mjs`; présent dossier de continuité.
- Commits Lot 437 : `99fec5cf9f75e2effc59b0a16ca62581b24f8b67` (migration initiale), `733bcc466bb8d596c26ab7d853942a9622422932` (lecture DM après blocage), `574d705b801fb6fdf2123d7f9c9ac51de93a828c` (contrôles CI).
- Suite immédiate : exécuter la CI sur la tête de branche, puis relire la migration avec un PostgreSQL isolé et des comptes synthétiques avant de demander l'autorisation de l'appliquer. La fonctionnalité n'est pas encore visible dans l'interface Messenger.
- PR #17 reste ouverte et non fusionnée; aucun changement sur `main`, aucun déploiement Cloudflare.
