

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


### Complément Lot 437 — fermeture d'un second chemin de contournement
- Relecture de la policy d'ajout des membres : l'ancienne fonction `msg_member_ok` autorisait un utilisateur à s'ajouter lui-même à une conversation directe existante, puisque le type `direct` retournait vrai. Cela aurait contourné l'invitation même après révocation de `msg_open_direct`.
- La migration remplace cette fonction : l'auto-ajout via le client n'est autorisé que pour les groupes scolaires compatibles; l'ajout aux DM se fait uniquement dans la RPC SECURITY DEFINER d'acceptation, avec trigger de consentement.
- Le contrôle CI vérifie aussi ce point. Son expression régulière a été relue et corrigée.
- Commits complémentaires : `7658496539c6c8c91deec65fe828d14bf74b849e` (fermeture du contournement), `7fe5814f6c71997804e938b5558e1c08b18017cc` (assertion CI), `bb197492718f0631d17333df825b8042c533f3aa` (correction du motif CI).
- État PR #17 relu après ces commits : ouverte, non fusionnée, `mergeable=true`. Aucun workflow PR n'est encore retourné pour le dernier SHA par l'outil de consultation utilisé; ne pas interpréter cette absence comme un CI réussi.


## Lot 438 — revue SQL de sécurité des invitations Messenger (13 novembre 2026)
- Relecture de la migration Lot 437 face au catalogue PostgreSQL actif en SELECT uniquement. Confirmation des colonnes utilisées dans msg_conversations, msg_members, msg_blocks et profiles, des politiques RLS actives et des fonctions installées. Aucune ligne de profil, de message ou de compte n'a été lue.
- Trois défauts bloquants ont été trouvés dans le SQL préparatoire : délimiteurs dollar invalides (as $ / $;), perte du contrôle auth.uid() = uid dans les fonctions SECURITY DEFINER msg_is_member et msg_member_ok, et perte du contrôle snd = auth.uid() dans msg_not_blocked. Le premier aurait empêché l'exécution de la migration; les autres auraient exposé des fonctions de contrôle à des appels portant sur d'autres UUID.
- Correction : délimiteurs $$ cohérents; rétablissement des contrôles d'identité dans les trois fonctions; révocation de l'exécution de msg_pair_blocked(uuid,uuid) pour authenticated afin de ne pas exposer un oracle permettant d'interroger les blocages entre deux UUID.
- Correction supplémentaire : l'expiration d'une invitation renvoie désormais NULL après avoir enregistré expired; l'ancienne séquence UPDATE puis RAISE EXCEPTION aurait annulé le changement d'état avec le rollback de la transaction.
- Contrôles statiques CI renforcés pour ces garanties. Les fichiers ne sont toujours pas exécutés contre Supabase. Aucun DDL/DML, compte, profil, message, Auth, stockage, paiement ou paramètre de production n'a été modifié.
- Commits Lot 438 : a372cd30db519d39842f5f6771c01007f15b5e56 (premières corrections), 99bf0007560e326f02beb8f099749fc5a0db4f63 (quotage SQL), a300ddda1f1243a33eb10b76f1ed9ba0bf4dcea1 (assertions), e55992c09a5e59c00a3c31c365bcab252ec2381a (correction des regex CI).
- État de validation : aucune exécution PostgreSQL isolée disponible/confirmée dans ce lot; aucun run CI retourné pour le dernier commit au moment de la vérification. Ne pas déclarer la CI réussie ni la migration prête à déployer.
- État PR #17 au dernier contrôle : ouverte, non fusionnée, base main, HEAD e55992c09a5e59c00a3c31c365bcab252ec2381a; GitHub indique actuellement mergeable=false. Ne pas fusionner; diagnostiquer l'état de la branche séparément.
- Prochaine étape : obtenir un véritable environnement PostgreSQL isolé (sans créer de compte dans Supabase actif), exécuter les tests négatifs à deux utilisateurs synthétiques, puis seulement ensuite préparer les appels RPC et l'interface arabe des invitations.
