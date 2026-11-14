

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


## Lot 439 — contrôle des déclencheurs et concurrence des invitations (13 novembre 2026)
- Catalogue Supabase lu en SELECT uniquement : politiques RLS réelles confirmées sur msg_conversations, msg_members et msg_messages. La policy msg conv creation est permissive et autorisait historiquement type=direct; msg members ajout s'appuie bien sur msg_member_ok. Les noms ciblés par la migration correspondent aux politiques actives.
- Déclencheur existant msg_tr_direct exécutant msg_guard_direct confirmé. La garde existante exige que le créateur soit le premier membre, limite le DM à deux membres et appelle msg_can_dm pour le second. msg_can_dm impose auth.uid() dans la paire et vérifie les deux profils scolaires au statut verifie. Le nouveau déclencheur de consentement est ajouté en complément, sans supprimer le garde historique.
- Deux risques de concurrence corrigés dans la migration préparatoire : verrou transactionnel par expéditeur avant le comptage des invitations sur 24 h; verrou transactionnel par paire avant le verrou de ligne d'invitation lors de l'acceptation. L'ordre du verrou de paire avant le FOR UPDATE évite le deadlock lorsque les deux élèves ont envoyé une invitation réciproque.
- Après acceptation, une éventuelle invitation réciproque encore pending est annulée afin qu'elle ne reste pas affichée comme demande active après création du DM.
- Contrôles statiques ajoutés dans ci/check-msg.mjs pour les verrous, l'ordre des verrous et l'annulation réciproque. Vérification locale des motifs statiques : délimiteurs SQL appariés, absence de terminateur isolé, verrous et assertions présents. Cela ne remplace pas une exécution PostgreSQL.
- Aucun environnement PostgreSQL isolé n'est disponible dans les outils de cette session. La liste des branches Supabase ne contient que main; la création d'une branche de développement peut entraîner une facturation horaire. Conformément à la contrainte de gratuité, aucune branche/projet n'a été créé.
- Aucun DDL/DML n'a été exécuté sur Supabase actif; aucune donnée personnelle, aucun contenu de message et aucun compte n'ont été lus ou modifiés. La migration reste non appliquée.
- Commit de code Lot 439 : 612e4d7a9ce3c22b51f529fb1a537652341502c2 (verrous initiaux), f8e6dca8344d9e8ebf4171a2b6e2be6ecc1fd41e (ordre de verrouillage), 6acd5519de7cb86f077ad441ecf60025635d83d6 (délimiteur SQL), 79cbc3992802d1b2a54c8c2e6456195db4d78948 (tests statiques).
- État PR #17 au dernier contrôle : ouverte, non fusionnée, mergeable=true, base main, HEAD 79cbc3992802d1b2a54c8c2e6456195db4d78948. Aucun workflow CI associé n'est retourné par GitHub pour ce commit.
- Prochaine étape sûre : faire exécuter les tests d'intégration PostgreSQL sur une machine/environnement local gratuit contrôlé par le propriétaire, sans Supabase production; ensuite seulement câbler l'écran arabe des invitations entrantes et sortantes.


## Lot 440 — expiration robuste et notifications Realtime des invitations (13 novembre 2026)
- Nouveau point de logique détecté : une invitation restée pending plus de 7 jours pouvait bloquer une nouvelle demande identique à cause de l'index unique partiel, et l'idempotence pouvait retourner indéfiniment cette ancienne demande. Correction dans msg_invite_send : les invitations sortantes pending de plus de 7 jours sont passées à expired avant la vérification d'idempotence.
- Les RPC de refus et d'annulation passent également une demande ancienne à expired au lieu de lui attribuer un faux statut declined/cancelled. L'acceptation conserve son retour NULL pour une invitation expirée et enregistre bien l'état sans lever d'exception qui annulerait la transaction.
- Realtime : le catalogue actif confirme que la publication supabase_realtime existe et publie déjà msg_messages, mais pas msg_invites. La migration préparatoire ajoute désormais msg_invites à cette publication de manière conditionnelle. La policy SELECT RLS de la table ne laisse voir que les invitations où auth.uid() est expéditeur ou destinataire; les événements Realtime sont donc limités par cette policy.
- CI statique complétée pour la publication Realtime, la policy participant, les états expirés et les contrôles de concurrence.
- Vérification des motifs statiques sur le dernier contenu : aucune clôture SQL isolée; délimiteurs de fonctions appariés; bloc DO Realtime apparié; contrôles expiration, verrouillage et policy participant présents. Ce contrôle de texte ne vaut pas compilation ni exécution PostgreSQL.
- Commits récents : f96ae0f28e321682d8e0dc35d6fa800d88bd6012 (expiration des anciennes demandes), 17fd8a2d6b6ec09445e1f55e4723578542b82c5e (assertions expiration), 316828610b729f5508c149388143f5158baa35e6 (délimiteurs RPC), 8387888b552d3c9673f13bda862b02730acfe478 (Realtime), 5f56ac9afbcd2423517bc9c02f729fd7721b93a7 (assertions Realtime), 87d1a783d2da1a4e13ff9cdf8cc2241438bf4265 (délimiteurs du bloc DO).
- Toujours aucune migration exécutée sur Supabase actif. Aucun environnement de test gratuit existant n'a été trouvé : la seule branche Supabase listée est main. Ne pas créer de branche/projet payant.
- État PR #17 au dernier contrôle : ouverte, non fusionnée, mergeable=true, base main, HEAD 87d1a783d2da1a4e13ff9cdf8cc2241438bf4265. Aucun workflow CI associé retourné pour le commit.
- Étape suivante : fournir un harnais d'intégration exécutable sur PostgreSQL local gratuit (ou machine de développement existante) et obtenir un résultat réel avant toute application cloud; ensuite intégrer les abonnements Realtime d'invitations et les panneaux arabes الواردة / المرسلة.


## Lot 441 — interface pédagogique professionnelle de la messagerie (13 novembre 2026)
- Recomposition de l'accueil réel de الرسائل : bandeau éditorial pédagogique, compteurs calculés exclusivement à partir des groupes et conversations réellement retournés par Supabase, recherche, filtres, repères d'usage scolaire et cartes mieux hiérarchisées.
- Les groupes affichent les métadonnées réellement disponibles (wilaya, niveau, filière, dernier échange). Les conversations privées ne révèlent plus leur identifiant technique dans le titre visible.
- Correction du libellé de groupe qui appelait une chaîne comme une fonction, ainsi que du sélecteur de délégation de clic : les boutons de filtre étaient affichés mais non interceptés par le gestionnaire global.
- Ajout d'un traitement CSS ciblé, RTL, responsive et compatible avec les thèmes clair/sombre. Aucun framework ni dépendance ajoutés.
- Cache actualisé : msg.js?v=3515, style-prototype-dz.css?v=198, service worker dz-de-v3.185.0.0.149.
- Aucun faux message, faux contact, faux compteur ou faux contenu pédagogique n'est injecté : les compteurs sont dérivés des résultats réels des fonctions existantes.
- Limites fonctionnelles inchangées : les invitations de conversation et les nouvelles règles de consentement restent indisponibles tant que la migration préparée n'a pas été testée dans PostgreSQL puis appliquée avec autorisation. Le forum ملتقى الطلاب reste une interface sans backend de publication.
- Aucun changement Auth, RLS, schéma actif, paiement, données Supabase, main ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.


## Lot 442 — écran de conversation Messenger (13 novembre 2026)
- Refonte de l'écran intérieur des conversations : barre de retour, en-tête de dialogue sans identifiant technique visible, présence, zone de lecture distincte, bulles entrantes/sortantes, horodatage, signalement, aperçus de pièces jointes et compositeur de message.
- Styles RTL responsives, thèmes clair/sombre, hauteur de fil adaptée aux écrans mobiles. Les mécanismes existants de lecture, envoi, Realtime, pièces jointes et signalement sont conservés.
- Recherche accessible : le libellé aria-label garde l'expression « ابحث في محادثاتي ومجموعاتي » tout en précisant les nouveaux critères.
- Cache : msg.js?v=3516, style-prototype-dz.css?v=199, service worker dz-de-v3.185.0.0.150.
- CI : correction du test de blocage bilatéral afin qu'il vérifie la condition réellement implémentée dans msg_is_member (DM + msg_pair_blocked sur le membre pair). Synchronisation des assertions de précache.
- Aucun message fictif ajouté. Aucun changement de schéma actif, Auth, RLS, données Supabase, paiement, main ou déploiement. PR #17 reste ouverte et non fusionnée. Migration des invitations toujours non appliquée.


## Lot 443 — application du modèle communautaire professionnel à la vue réelle (13 novembre 2026)
- Application du modèle de composition du prototype à la vue réelle `data-view="multaqa"` : fil principal prioritaire, panneau latéral de profil/navigation et panneau de découverte regroupés en seconde colonne, au lieu de trois colonnes étroites.
- Hiérarchie visuelle renforcée : bandeau d'accueil, cartes, profil communautaire, navigation, composition de publication, état vide et découverte. Les couleurs DZ, les thèmes clair/sombre et les styles RTL sont conservés.
- Responsive revu : tablette avec fil en premier puis panneaux latéraux en deux colonnes; mobile en une colonne avec actions pleine largeur. Le CSS est strictement ciblé sur `section[data-view="multaqa"]`.
- Aucun profil, publication, commentaire, réaction ou compteur fictif ajouté. Le bouton de publication reste désactivé tant que le service de publication n'existe pas. Le message d'état vide continue d'expliquer que le fil n'est pas raccordé à la base.
- Cache CSS mis à jour à `style-prototype-dz.css?v=200`; service worker `dz-de-v3.185.0.0.151`.
- Correction du contrôle statique Messenger : l'expression régulière de l'assertion de blocage bilatéral avait des échappements doublés et ne reconnaissait pas la fonction SQL réellement présente. L'assertion vérifie maintenant `msg_is_member`, le type direct et `msg_pair_blocked(uid,peer.user_id)`.
- Contrôle forum synchronisé avec le véritable état vide de l'interface, au lieu d'exiger un ancien avertissement de maquette supprimé.
- Aucun changement Supabase, SQL appliqué, Auth, RLS, données, paiement, `main` ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Validation visuelle dans un navigateur non effectuée à ce stade; la CI du nouveau commit doit encore être consultée avant toute déclaration de réussite.


## Lot 444 — audit du backend communautaire et première migration préparatoire (13 novembre 2026)
- Relecture du dossier et des Lots 432/434/413 avant toute nouvelle intervention. Le Lot 443 reste la dernière refonte visuelle ; aucune publication réelle n'était raccordée.
- Audit du catalogue Supabase en SELECT uniquement : aucune table ni RPC publique existante correspondant à ملتقى الطلاب, forum, posts, commentaires, réactions, relations sociales ou communauté. Aucun contenu d'élève ni aucune ligne de profil/message n'a été lu.
- Métadonnées profiles confirmées : id, pseudo, role, niveau, filiere, wilaya, created_at, verif_statut, verif_by, verif_at, matricule, section. La table accorde SELECT à authenticated et comporte plusieurs policies de visibilité. En conséquence, le fil ne doit jamais sélectionner la ligne profiles entière : les RPC préparées ne projettent que pseudo.
- Aucun champ de suspension propre à profiles n'a été trouvé dans le catalogue consulté. Le contrôle préparé exige une session Supabase et profiles.role='eleve', sans abonnement ni vérification scolaire. La gestion d'une suspension applicative doit être confirmée avant activation si elle existe hors de cette table.
- Création sur la branche de supabase/migrations/202611130002_multaqa_community_feed.sql : tables posts/commentaires/réactions/signalements, RLS activée, accès REST direct révoqué, RPC de lecture paginée, publication, commentaire/réponse, réaction, signalement et suppression de ses propres contenus. Quotas préparés : 10 publications, 30 commentaires et 20 signalements par 24 h, avec verrous transactionnels par compte.
- Les publications ne sont pas encore reliées à l'interface. Le HTML conserve l'état vide transparent tant que la migration n'est pas testée puis appliquée. Aucun contenu de démonstration n'est ajouté.
- ci/check-multaqa.mjs renforcé pour vérifier la présence des tables/RLS, l'absence d'accès REST direct, les RPC, le rôle élève, la projection pseudo et les quotas. ci/check-msg.mjs corrigé pour attendre les caches réellement présents après le Lot 443 (msg.js?v=3516, CSS v200, service worker .151).
- Correctifs CI de synchronisation : commit 1c82c77c795e14a3929b97becf633d1ed97a08bd ; migration forum : a8344ea02a35a5102917b9a46e7f1f1676ce4161 ; assertions CI : ec20bb475af878da4f18f3da5ed105dbb3267916 ; quota signalements : 15c827df57ab4ab008038db84d1013986616151f.
- Validation non acquise : aucun PostgreSQL isolé disponible/confirmé ; la migration n'a pas été compilée ni exécutée sur une base de test. La CI du commit ec20bb4 était encore en attente lors du contrôle ; le commit courant après ajout du quota doit également recevoir son run. Ne pas annoncer le backend prêt ni appliquer la migration à Supabase actif.
- Aucun DDL/DML sur Supabase actif, aucune modification Auth/RLS/Storage/Realtime/paiement en production, aucune lecture de données personnelles, aucun changement main, aucune fusion ni déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Étape suivante : obtenir le résultat CI du HEAD courant, faire une revue SQL ciblée et un test PostgreSQL réel multi-comptes sans données réelles ; ensuite seulement câbler le client ملتقى الطلاب aux RPC et demander une autorisation distincte avant toute application sur Supabase actif.

### Addendum Lot 444 — cohérence CI du portail public
- La CI #3523/#3524 a ensuite révélé que ci/check-public-portal.mjs attendait encore style-prototype-dz.css?v=197 et le service worker dz-de-v3.185.0.0.147. Ces références étaient dépassées par le Lot 443.
- Assertions et messages de contrôle synchronisés vers CSS v200 et service worker .151 dans le commit e135a23cb09484dd163220da8fe798146231d239.
- Run CI #3526 associé à ce HEAD : en attente au moment de cette note. Ne pas déclarer la validation globale réussie avant son résultat.

### Addendum Lot 444 — contrôle d'accès rectifié après confrontation à la décision produit
- La lecture de LOT-413 a mis en évidence une divergence dans la première version de la migration : elle laissait accéder au fil personnel aux comptes non vérifiés. Ce n'était pas conforme à la décision produit (fil personnel réservé aux élèves vérifiés ; comptes en attente limités aux annonces institutionnelles/aide, hors périmètre de cette première tranche).
- Le catalogue Supabase a confirmé par contrainte CHECK les valeurs exactes de verif_statut : non_verifie, en_attente, verifie, rejete ; valeur par défaut non_verifie. Aucune ligne de profil n'a été lue.
- Migration corrigée : les six RPC de lecture/interactions (fil, commentaires, création publication, création commentaire, réaction, signalement) exigent role='eleve' ET verif_statut='verifie'. L'abonnement n'est pas vérifié. La suppression de ses propres contenus reste possible à un élève auteur même si sa vérification a été révoquée, pour permettre le retrait de son contenu.
- ci/check-multaqa.mjs vérifie maintenant les six contrôles verif_statut et la séparation entre vérification scolaire et abonnement. Commit migration : 750c1b1b8c585380bbae69255dcc71c9de3b3665 ; CI : e99d0625b3f6240d35fd34c3ecfe2ba752e6e775.
- La CI #3527 a échoué sur ci/check-masar.mjs, qui attendait encore CSS v196 ; correction vers v200 commit 8466b426f827cb1eadb2aa19328e776588cdc8a5. Le résultat du run déclenché pour ce correctif doit être suivi.

- Suite au run #3528, le contrôle Masar a révélé une seconde attente périmée dans le même script : le service worker .147. Le contrôle a été aligné sur .151 dans le commit 55e705be78acaed4ff8a4a19a5ec06b260aeac2b. Le run #3529, lancé avant ce second correctif, a reproduit ce défaut ; il ne valide donc pas le commit correctif. Attendre le run suivant pour juger.

### Addendum Lot 444 — premier raccordement du client du fil
- Création de multaqa.js : client de la vue ملتقى qui appelle exclusivement les RPC multaqa_feed, multaqa_comments, multaqa_create_post, multaqa_create_comment, multaqa_toggle_reaction et multaqa_report. Les contenus utilisateurs sont échappés avant rendu HTML. Le client vérifie le rôle élève et verif_statut='verifie' avant d'afficher le fil personnel ; la sécurité réelle reste dans les RPC.
- index.html remplace le formulaire factice désactivé et l'état statique par un conteneur mtqApp ; le module gère l'état de service non activé sans fausses données. Aucun enregistrement n'est créé tant que la RPC serveur n'existe pas.
- Les publications du flux exposent un booléen my_post pour distinguer le propriétaire sans divulguer son Auth ID. La projection publique conserve le pseudo seulement.
- style-prototype-dz.css reçoit les styles du fil dynamique ; cache CSS v201. sw.js passe en dz-de-v3.185.0.0.152 et précache multaqa.js?v=1. Les contrôles check-public-portal, check-masar, check-msg et check-multaqa ont été synchronisés avec ces versions et le client RPC.
- Correction du contrôle d'accès : conformément au Lot 413, le fil personnel est réservé aux élèves vérifiés ; les comptes en attente/non vérifiés ne peuvent pas voir le contenu personnel. L'abonnement n'intervient pas dans cette décision.
- Limites actuelles : aucun test navigateur visuel/exécution réelle de bout en bout ; migration toujours non appliquée ; pas de test PostgreSQL multi-comptes ; les fonctions de fichiers/images, groupes, الزمالة, modération administrative et Realtime ne sont pas dans cette première tranche.
- Aucun DDL/DML exécuté sur Supabase actif, aucune lecture de contenu d'élève, aucune modification de main, aucune fusion PR #17, aucun déploiement.

- Revue complémentaire des privilèges RPC : chaque fonction préparée révoque maintenant explicitement EXECUTE à PUBLIC, anon et authenticated avant le GRANT ciblé à authenticated. Le contrôle CI vérifie cette révocation préalable. Commits : migration 94d1a288af26dec4207956abd190e1c3e2d57a53 ; assertion CI ca709b02450b988091c8be6f268b694507627392.
- Le client dynamique reste un raccordement préparatoire : l'appel RPC renverra une erreur explicite tant que la migration n'est pas appliquée. Aucun test réel de navigateur ou PostgreSQL n'a encore été effectué.

- Le contrôle `ci/check-multaqa.mjs` n'était pas appelé par le workflow CI actif. Pour éviter un contrôle isolé non exécuté, il est maintenant importé à la fin de `ci/check-msg.mjs`, étape effectivement exécutée par le workflow `CI — ALLEMAND`. Commit : 79af97adc3a697e22864478604a76fd3ae9e17b0. Les assertions locales sur les fichiers confirment : 8 contrôles de rôle, 6 contrôles de vérification, 8 révocations RPC explicites, échappement des contenus, client précaché et intégration du contrôle au pipeline. Ces vérifications statiques ne remplacent pas l'exécution Node complète du workflow ni les tests PostgreSQL.
- Une autre référence de cache v196 a été trouvée dans `ci/check-gamification.mjs` et corrigée vers v201 (commit a64d5389681f428dbf00ecd510c93ab40f246076). Le workflow courant doit confirmer la disparition de cette assertion obsolète.

- Le contrôle communautaire intégré à check-msg inclut désormais `node --check multaqa.js` afin que la CI valide aussi la syntaxe du nouveau client (commit d1efbfc58bd5b5f7c21c0abe3bb8c0e3fa79cd4f). Le workflow doit encore terminer sur le HEAD final.


## Lot 445 — validation CI du premier raccordement communautaire (13 novembre 2026)
- Le workflow GitHub Actions #3552, déclenché sur le HEAD `fac74e314273782f09d7a6f4800aca2efa00c98e`, est terminé avec la conclusion **success**.
- Le job « Validation structurelle & pédagogique » a exécuté avec succès l'étape « Valider les accès et la navigation de ملتقى الطلاب » (étape 35), ainsi que les étapes de syntaxe JavaScript, de validation des contenus et les autres contrôles du workflow.
- La vérification communautaire inclut maintenant le contrôle de syntaxe réel `node --check multaqa.js`, les appels RPC attendus, l'échappement HTML, les garde-fous rôle/vérification, RLS, révocations de privilèges, projection pseudo et précache du client.
- PR #17 contrôlée après le run : toujours `open`, `merged=false`, `mergeable=true`, HEAD `fac74e314273782f09d7a6f4800aca2efa00c98e`. Aucune fusion.
- **Portée exacte de ce succès : CI structurelle/statique uniquement.** Il ne prouve ni la compilation/exécution de la migration PostgreSQL, ni les autorisations multi-comptes à l'exécution, ni le rendu visuel dans un navigateur, ni le fonctionnement du fil sur le site.
- La migration `202611130002_multaqa_community_feed.sql` reste préparée dans GitHub et non appliquée. Aucun DDL/DML, Auth, RLS, donnée ou paramètre de Supabase actif n'a été modifié.
- Prochaine étape : obtenir une validation PostgreSQL réelle sans utiliser la base active et sans créer de branche/projet payant. Tant qu'aucun environnement de test gratuit contrôlé n'est disponible, conserver le fil en état explicite « service non activé » plutôt que prétendre que les publications fonctionnent.
- Aucun changement sur `main`, aucune fusion PR #17, aucun déploiement Cloudflare.


## Lot 446 — préparation contrôlée de l'activation PostgreSQL de ملتقى الطلاب (13 novembre 2026)
- Accord utilisateur reçu pour préparer l'activation sur le projet Supabase gratuit existant. Cet accord n'autorise ni la migration Messenger, ni une modification de main, ni une fusion, ni un déploiement Cloudflare.
- Préflight en lecture seule sur le projet actif `azjwcybivirvpxbfhyzk` : connexion confirmée ; tables `profiles`, `msg_conversations`, `msg_members`, `msg_blocks` présentes ; colonnes `profiles.id/role/verif_statut/pseudo` présentes ; contrainte CHECK de `verif_statut` cohérente avec les quatre valeurs documentées.
- Historique Supabase : aucune migration communautaire `multaqa` enregistrée. Les quatre tables `multaqa_posts/comments/reactions/reports` et les RPC `multaqa_*` n'existent pas encore. Aucun profil, message, contenu d'élève ou enregistrement métier n'a été lu.
- Revue des dépendances : `auth.users` est la cible des clés étrangères ; `profiles` fournit rôle, statut de vérification et pseudo. Les dépendances structurelles requises sont présentes. Les migrations Messenger restent distinctes et non appliquées.
- Création d'un test PostgreSQL isolé dans GitHub Actions : `ci/multaqa-postgres-test.sql` et `.github/workflows/multaqa-postgres-test.yml`. Le workflow démarre un PostgreSQL 17 jetable, construit uniquement des comptes synthétiques, applique la migration communautaire dans cette base éphémère et teste privilèges, refus anon/non-élève/non-vérifié, fil, publication, commentaire, réaction, signalement et suppression auteur.
- Commit du test SQL : `00e0e718bcd0de05f5289963d8fc3220688338ce`. Commit du workflow : `52fade90b98d8da16901d1d787addd1191aeca93`. Run GitHub Actions #1 : `43499787337`, statut en cours au moment de cette note ; ne pas déclarer le test réussi avant conclusion GitHub.
- Le projet Supabase actif n'a subi aucune écriture : migration non appliquée, aucun DDL/DML, aucune modification RLS/Auth/Realtime, aucun changement Messenger. Aucun coût ou projet payant ajouté.
- Blocage avant activation réelle : attendre le résultat du test PostgreSQL isolé et corriger tout échec. Même après réussite, confirmer explicitement l'application de la migration sur le projet Supabase actif avant exécution ; cette note ne vaut pas autorisation d'appliquer la migration.
- PR #17 : toujours ouverte, non fusionnée ; branche `design/prototypes-67-74-alignment`, HEAD `52fade90b98d8da16901d1d787addd1191aeca93`, base `main`. Aucun déploiement Cloudflare.


### Addendum Lot 446-B — résultat du test PostgreSQL isolé
- Le run GitHub Actions #1 `43499787337` du commit `52fade90b98d8da16901d1d787addd1191aeca93` est terminé avec la conclusion **success**.
- Le job a exécuté avec succès la migration communautaire dans PostgreSQL 17 éphémère, puis les assertions de privilèges (aucun accès direct aux tables, RPC non exécutables par anon), accès élève vérifié, refus des comptes en attente/non-élèves/sans identité, publication, lecture du fil, commentaire, réaction, signalement et suppression par l'auteur.
- Ce résultat valide la syntaxe et les scénarios couverts par le test isolé ; il ne remplace pas un test réel avec JWT/Supabase Auth, ni la vérification navigateur, ni les tests de charge/concurrence complets.
- Un second run du même workflow est en cours sur le commit documentaire `29041aeacc9f4bfdad6053230d1b6c7526ccb51d` ; suivre son résultat avant de conclure le pipeline du HEAD.
- La migration n'a toujours pas été appliquée au projet Supabase actif. Toute application en production reste une opération DDL distincte qui nécessite une confirmation explicite ; aucun changement Auth, RLS, données, Messenger ou Realtime n'a été fait.


## Lot 447 — application contrôlée de la première migration de ملتقى الطلاب (13 novembre 2026)
- Confirmation explicite de l'utilisateur reçue pour appliquer uniquement la migration communautaire sur le projet Supabase gratuit existant. La confirmation ne couvre ni la migration Messenger, ni les changements Auth hors de ce périmètre, ni une fusion ou un déploiement.
- Vérification juste avant exécution : historique Supabase sans migration multaqa antérieure ; aucune table `multaqa_posts`, `multaqa_comments`, `multaqa_reactions`, `multaqa_reports` ni RPC `multaqa_*` préexistante. Aucun conflit d'objet détecté.
- Application réussie via l'opération de migration Supabase, enregistrée sous `20261113201922_multaqa_community_feed`. Le lot crée quatre tables, leurs index, active RLS, révoque tout accès REST direct aux tables pour `anon` et `authenticated`, puis expose huit RPC SECURITY DEFINER exclusivement à `authenticated`.
- Vérification post-application en lecture seule : les quatre tables sont présentes et RLS est activée ; SELECT/INSERT/UPDATE/DELETE directs sont refusés à anon et authenticated ; les huit RPC ont EXECUTE refusé à anon et accordé à authenticated ; les huit fonctions sont SECURITY DEFINER. L'historique Supabase contient maintenant la migration `multaqa_community_feed`.
- Les garde-fous serveur contrôlent `auth.uid()`, `profiles.role='eleve'` et `profiles.verif_statut='verifie'` pour le fil, la publication, les commentaires, les réactions et les signalements. Aucun abonnement n'est exigé. Les RPC de lecture ne projettent que le pseudo public et les champs du contenu.
- Le test PostgreSQL 17 isolé du Lot 446 avait réussi sur des comptes synthétiques avant cette application. Il valide les scénarios inclus dans le harnais, mais ne prouve pas encore le fonctionnement réel avec JWT/Supabase Auth dans le navigateur.
- Aucun profil, compte, message privé, contenu scolaire existant ou autre donnée métier n'a été lu ou modifié. Aucune migration Messenger, modification de paiement, Storage, Auth, Realtime ou table existante n'a été appliquée.
- État produit : **backend de base installé**, mais l'expérience complète n'est pas encore déclarée opérationnelle. Étape suivante obligatoire : vérifier le raccordement de `multaqa.js` aux RPC dans une session élève vérifié réelle, contrôler l'affichage et les erreurs dans le navigateur, puis tester publication/commentaire/réaction/signalement avec des comptes de test autorisés. Aucun contenu fictif ne doit être ajouté.
- PR #17 reste ouverte et non fusionnée, base `main`. Aucun changement sur `main`, aucune fusion et aucun déploiement Cloudflare.


## Lot 448 — fiabilisation du démarrage du fil communautaire (13 novembre 2026)
- Revue du raccordement réel entre `multaqa.js`, `app.js` et le module ES Supabase : le client communautaire était chargé avant l'initialisation asynchrone de `window.SB`. Une navigation très rapide pouvait donc produire un faux état d'indisponibilité, alors que le client finissait ensuite son initialisation.
- Correction de `multaqa.js` : attente explicite de l'événement `dz:sbready` avec délai maximal de 12 secondes, contrôle de disponibilité des méthodes `sb/me/myProfile`, distinction d'une erreur de lecture de profil d'une absence de profil, et reprise du rendu si la vue ملتقى est déjà ouverte au chargement du module.
- Cache client incrémenté à `multaqa.js?v=2`, précache synchronisé et Service Worker porté à `dz-de-v3.185.0.0.153`.
- Contrôles CI synchronisés : vérification de l'attente Supabase, de la version v2 du client, du précache et de l'état réel « migration appliquée » dans l'en-tête SQL. Le contrôle Messenger a également été synchronisé sur le Service Worker v153.
- Le test PostgreSQL 17 isolé du workflow dédié reste distinct du test réel avec session JWT dans un navigateur. Aucun compte de test élève réel n'a été utilisé, aucune publication ni aucun commentaire n'a été créé sur la base active.
- Les workflows déclenchés sur les commits intermédiaires ont montré un échec transitoire du contrôle Messenger dû à une seconde assertion restée sur le Service Worker v152 ; assertion corrigée vers v153. Ne considérer le lot validé qu'après conclusion positive des workflows sur le HEAD final.
- Aucun changement de schéma Supabase dans ce lot ; aucune donnée élève ou message privé lue/modifiée ; aucune migration Messenger ; aucune fusion PR #17 ; aucun déploiement Cloudflare.


### Clôture du Lot 448 — contrôles finaux
- Les premières exécutions de CI ont révélé trois assertions de version restées en v152 dans les contrôles check-public-portal.mjs, check-masar.mjs et check-msg.mjs. Elles ont été synchronisées sur le Service Worker v153 ; aucun code métier de ces modules n'a été modifié pour contourner les tests.
- Sur le commit 3dcc929ca18f9d4a665b45b27be200d8c981dec7, les trois contrôles décisifs sont terminés avec succès : Validation structurelle & pédagogique, multaqa-postgres (PostgreSQL 17 isolé) et Workers Builds: allemand.
- Le contrôle dédié « Contrôler les accès et la navigation de ملتقى الطلاب » est success dans la CI générale. Le test PostgreSQL isolé a également terminé success sur le même commit.
- Le build Cloudflare associé au commit est validé. Cela ne vaut pas approbation de fusion ni autorisation de déploiement manuel ; PR #17 demeure ouverte, non fusionnée, base main.
- Le dernier commit documentaire de ce dossier peut déclencher une nouvelle exécution CI ; les résultats cités ci-dessus portent précisément sur le commit de code 3dcc929.
- Le point restant pour qualifier l'expérience de réellement opérationnelle est un test de bout en bout dans le navigateur avec une session d'élève vérifié autorisée. Aucun compte réel n'a été utilisé pour publier ou commenter pendant ce lot.


## Lot 449 — carte de profil réelle dans ملتقى الطلاب (13 novembre 2026)
- Revue de la vue `multaqa` : la carte latérale affichait encore un message périmé (« le profil apparaîtra après liaison du service »), alors que la lecture du profil via le client Supabase existait déjà.
- La carte a maintenant des cibles DOM identifiées et reçoit après contrôle serveur le pseudo du compte courant et, si disponible, le niveau 2AS/3AS. Elle n'affiche pas de nom réel, d'adresse, de wilaya ni d'identifiant ; aucun profil d'un autre élève n'est interrogé.
- Les comptes non connectés, non élèves ou non vérifiés n'obtiennent pas la carte personnelle ni le fil ; la règle serveur reste inchangée.
- Version client passée à `multaqa.js?v=3`, précache Service Worker synchronisé, version `dz-de-v3.185.0.0.154`. Assertions CI ajoutées pour le rendu du profil et synchronisées avec le client v3.
- Les premiers contrôles CI ont détecté des assertions de cache encore en v2 dans `check-multaqa.mjs` et une assertion v153 dans `check-masar.mjs`. Ces références ont été corrigées ; ne déclarer le lot validé qu'après les workflows sur le HEAD final.
- Aucun changement Supabase, aucune lecture de données d'élèves autres que les champs du profil courant via le mécanisme existant, aucune publication de test, aucune modification Messenger, aucune fusion ni déploiement manuel.
- Le test navigateur avec une session élève vérifiée reste requis pour confirmer visuellement la carte et les opérations réelles du fil.

### Clôture du Lot 449 — validation CI finale
- Les premières exécutions ont signalé deux assertions de cache encore en v2 dans `check-multaqa.mjs` ; correction effectuée en ciblant les assertions exactes. Une assertion Masar v153 avait également été synchronisée en v154 avant la validation finale.
- Sur le commit de code `4c404e87117be6e2c46a94a1e90373120fa9f881`, les trois contrôles requis sont **success** : `Validation structurelle & pédagogique`, `multaqa-postgres` (PostgreSQL 17 isolé) et `Workers Builds: allemand`.
- Le test PostgreSQL isolé confirme encore la migration et les scénarios d'accès synthétiques ; il ne teste pas l'affichage du pseudo dans un vrai navigateur.
- PR #17 reste ouverte, non fusionnée et mergeable, base `main`. Aucun déploiement manuel ni modification Supabase.
- La validation visuelle et fonctionnelle avec un compte élève vérifié réel reste le seul point de contrôle bloquant avant de qualifier l'expérience utilisateur de bout en bout.


## Lot 450 — harmonisation Messenger et vérification scolaire gratuite (13 novembre 2026)
- Correction d'une contradiction produit repérée dans le parcours réel Messenger : l'écran et le client exigeaient encore un numéro d'abonnement actif pour déposer une demande de vérification scolaire.
- Le formulaire demande désormais le numéro d'inscription scolaire et précise explicitement que la vérification est gratuite. Le client ne consulte plus la table des abonnements et dépose le statut en_attente ainsi que le numéro et la section sur le profil du compte connecté. La décision finale reste réservée à l'équipe d'administration ; aucun statut verifie n'est attribué automatiquement.
- Harmonisation visuelle ciblée du centre Messenger : barre de recherche, filtres, titres de sections, cartes de groupes/conversations, boutons et variantes clair/sombre/mobile. Le comportement des groupes, conversations, filtres et contrôles existants est conservé ; aucune fonction de recherche nationale n'est revendiquée.
- Cache : msg.js?v=3517, style-prototype-dz.css?v=202, Service Worker dz-de-v3.185.0.0.155.
- CI statique actualisée pour exiger la vérification gratuite et les nouvelles références de cache. Les contrôles finaux doivent être confirmés sur le HEAD documentaire final.
- Aucun SQL, changement RLS/Auth, aucune donnée Supabase, aucun abonnement, aucun profil d'élève, aucun message privé, main, fusion ou déploiement manuel n'a été modifié.
- Limite de sécurité : la demande client réutilise la mise à jour de profil déjà présente dans le parcours historique. Avant toute fusion/déploiement, confirmer que la policy RLS active n'autorise que le titulaire à déposer sa propre demande et que seul un rôle autorisé peut faire passer en_attente à verifie ou rejete. Aucun audit RLS supplémentaire ni test navigateur réel n'est revendiqué dans ce lot.


### Complément de validation Lot 450 — 13 novembre 2026
- Après les premiers échecs CI, inspection des logs a isolé des assertions historiques de cache restées sur CSS v201 et Service Worker v154. Les contrôles check-gamification.mjs, check-masar.mjs et check-public-portal.mjs ont été synchronisés sur CSS v202 et SW v155 ; les contrôles métier n'ont pas été désactivés.
- Le contrôle check-masar.mjs garde volontairement masar.js?v=3516, qui est bien la référence réelle présente dans index.html et sw.js.
- Les premières relances sur les commits intermédiaires ont encore échoué sur une assertion Masar v154, puis cette assertion a été corrigée précisément. Le commit de correction est 994d808e33fe03e2170e178e10b7b59434f1f4fe; les workflows CI et PostgreSQL 17 correspondants sont en cours au moment de cette note.
- Diagnostic catalogue Supabase strictement SELECT-only sur pg_policies et pg_trigger pour public.profiles : policy update own limitée à la ligne auth.uid() = id, et trigger profiles_tr_verif qui autorise le titulaire uniquement à déposer une demande depuis non_verifie ou rejete vers en_attente, sans lui permettre de passer à verifie; la décision reste modérateur/admin autorisé. Aucun enregistrement de profil n'a été lu.
- La vérification scolaire gratuite du Lot 450 est donc compatible avec les protections existantes constatées ; aucune migration ni modification RLS n'est requise pour ce flux.
- PR #17 reste ouverte, non fusionnée, base main; aucun changement direct sur main, aucune écriture Supabase, aucun déploiement manuel. Le test navigateur réel avec compte élève vérifié et la confirmation de prévisualisation à jour restent à effectuer.


## Lot 451 — cohérence finale du parcours de vérification gratuite (13 novembre 2026)
- Relecture du code réel après le Lot 450 : la demande côté client utilise bien le champ `profiles.matricule`, passe uniquement le profil connecté à `en_attente`, et ne consulte aucune table d'abonnement. Le contrôle catalogue RLS/trigger déjà documenté confirme que l'élève ne peut pas s'attribuer le statut `verifie`; aucune nouvelle lecture de données personnelles n'a été faite.
- Trois anciens libellés visibles dans `msg.js` continuaient néanmoins à dire « numéro d'abonnement » (étapes d'accueil, rejet de demande, libellé de la file de modération). Ils ont été remplacés par « numéro d'inscription scolaire » pour rendre l'interface cohérente avec le parcours gratuit.
- Le contrôle CI `ci/check-msg.mjs` a été renforcé pour empêcher la réapparition des anciens libellés payants et vérifier la mention de gratuité. Une première exécution intermédiaire a détecté une variable de test mal nommée (`msg` au lieu de `msgjs`); elle a été corrigée avant le contrôle du HEAD final.
- Cache mis à jour après modification de `msg.js` : `msg.js?v=3518`, Service Worker `dz-de-v3.185.0.0.156`, précache synchronisé dans `sw.js`, `index.html` et les assertions CI correspondantes. CSS professionnel reste `style-prototype-dz.css?v=202`.
- Le modèle visuel Messenger déjà intégré conserve son bandeau, ses statistiques issues des données réelles, la recherche locale dans les conversations chargées, les filtres, les cartes et les variantes responsive/clair/sombre. Il ne constitue pas un annuaire national et n'ajoute aucun faux profil ni compteur.
- Aucun changement Supabase actif, aucune écriture RLS/Auth, aucune migration Messenger, aucune donnée élève ou conversation privée consultée, aucune modification de `main`, aucune fusion ni déploiement manuel.
- Les workflows CI et PostgreSQL 17 isolés déclenchés sur les commits précédents ont été suivis ; le contrôle final doit être jugé uniquement sur le HEAD après correction `3eb3817851270e40b9b501436f3014c2728536f5` et après clôture de ses workflows. Le test navigateur réel et la prévisualisation à jour restent à confirmer.
- PR #17 reste ouverte et non fusionnée. Le dernier contrôle API avant le Lot 451 indiquait `mergeable=true`; vérifier à nouveau l'état après le dernier commit.


### Complément Lot 451 — clôture du contrôle CI (13 novembre 2026)
- Le workflow CI sur le commit `4e97f46040fa4835ae4de4f53ccae9e2116eb8c1` a échoué sur une référence de variable erronée dans `ci/check-msg.mjs` (`msg` au lieu de `msgjs`). Le test PostgreSQL 17 isolé du même HEAD a réussi.
- Correction exacte dans le commit `aefad2f9694841a1b01247b190784d11fcee05b8`. Le CI a ensuite révélé une assertion de cache historique dans `ci/check-masar.mjs`, qui attendait encore le Service Worker v155 alors que le code est en v156.
- Assertion synchronisée sur v156 dans le commit `bf977125f6240e8e562d11fdc7bac487416f9995`; aucune vérification métier n'a été supprimée ou contournée.
- CI — ALLEMAND : run `43507427751`, réussite sur le HEAD `bf977125f6240e8e562d11fdc7bac487416f9995`. Les contrôles Messenger, Masar, portail public, sécurité d'accès, navigation Multaqa et contrôle pédagogique sont réussis.
- Tests PostgreSQL isolés — Multaqa : run `43507427746`, dernière observation pendant la phase de nettoyage des conteneurs; attendre la conclusion terminale avant de déclarer le test réussi.
- Aucun changement Supabase actif, aucune migration Messenger exécutée, aucun message privé ni profil élève consulté, aucun déploiement manuel, aucune fusion et aucun changement direct sur `main`.
- PR #17 reste ouverte et non fusionnée, branche `design/prototypes-67-74-alignment`, base `main`. Le test navigateur réel avec compte élève vérifié et la confirmation de prévisualisation Cloudflare du HEAD courant restent à faire.


## Lot 452 — centre des invitations Messenger (13 novembre 2026)
- Ajout côté client dans `supabase/supabase.js` des fonctions de lecture des invitations participantes et des RPC `msg_invite_send`, `msg_invite_accept`, `msg_invite_decline`, `msg_invite_cancel`. Les changements de statut passent exclusivement par les fonctions serveur prévues dans la migration de consentement; aucun INSERT/UPDATE direct sur `msg_invites`.
- Ajout dans `msg.js` d'un centre des invitations entrantes et sortantes : le destinataire peut accepter ou refuser, l'expéditeur peut annuler, et une conversation acceptée peut être rouverte. L'identité de l'autre participant et ses UUID ne sont pas affichés dans la carte; seules les dates et les états sont montrés.
- Le texte de l'interface précise que l'acceptation d'une invitation de conversation privée ne crée pas automatiquement une relation de `زمالة`. Aucun annuaire d'élèves ni recherche par UUID n'a été ajouté : le parcours d'envoi depuis une fiche élève reste à raccorder à une source de profils publics autorisée.
- Si la table d'invitations ou ses RPC ne sont pas disponibles, l'interface affiche une indisponibilité explicite et ne prétend pas qu'une demande a été créée. La migration `202611130001_msg_invitation_consent.sql` reste NON appliquée à Supabase; le centre ne sera réellement opérationnel qu'après activation approuvée et testée de cette migration.
- Cache : `msg.js?v=3519`, Service Worker `dz-de-v3.185.0.0.157`; précache et contrôles `check-msg.mjs`, `check-masar.mjs`, `check-public-portal.mjs` synchronisés. CSS inchangé `style-prototype-dz.css?v=202`.
- CI renforcée pour vérifier la présence des quatre RPC côté client, des trois actions d'invitation dans l'interface et la séparation explicite entre `زمالة` et conversation privée.
- Aucun SQL exécuté, aucune écriture Supabase, aucun changement RLS/Auth, aucun accès aux messages privés ou aux lignes de profils, aucun déploiement manuel, aucune modification de `main`, aucune fusion de PR #17.
- Tests GitHub du HEAD de ce lot à suivre jusqu'à conclusion terminale. Prévisualisation Cloudflare et test navigateur authentifié non confirmés.


### Validation finale Lot 452 — 13 novembre 2026
- Le client `supabase/supabase.js` ayant reçu les nouvelles fonctions d'invitation, son cache a également été incrémenté : `supabase.js?v=3521` dans `index.html` et le précache.
- Références finales : `msg.js?v=3519`, `supabase.js?v=3521`, Service Worker `dz-de-v3.185.0.0.158`, CSS `style-prototype-dz.css?v=202`. Les assertions CI Messenger, Masar et portail public sont synchronisées.
- CI — ALLEMAND : run `43509116776`, succès sur le commit de code `ebcc980da2fe2af8ca4763886b76c90a1e425305`.
- Tests PostgreSQL 17 isolés — Multaqa : run `43509116739`, succès sur le même commit. Ces tests portent sur le forum; ils ne valident pas la migration Messenger non appliquée.
- Une exécution CI intermédiaire sur `ec97ca503aa06763bb1bb4c214e6d37cbd6649ba` a échoué parce que le contrôle du portail attendait encore la version SW v157 alors que le précache était déjà en v158. Le contrôle a été synchronisé dans le commit final `ebcc980da2fe2af8ca4763886b76c90a1e425305`, dont la CI complète est verte.
- Ces résultats ne constituent ni un test navigateur réel, ni une confirmation de prévisualisation Cloudflare actualisée, ni une validation du backend Messenger en production.

## Lot 453 — découverte sécurisée des élèves et invitation Messenger (14 novembre 2026)
- Audit du parcours existant : la lecture des profils des membres d'une conversation (fetchNames) n'est pas un annuaire ; elle ne doit pas être réutilisée pour rechercher librement des élèves.
- Nouvelle migration préparatoire supabase/migrations/202611130003_msg_student_discovery.sql, dépendante de 202611130001_msg_invitation_consent.sql et du schéma Messenger existant. **Migration non appliquée sur Supabase.**
- Correction serveur importante : msg_can_dm(a,b) exige désormais deux comptes role='eleve', deux identités verif_statut='verifie', une même wilaya, un même niveau et une même filière, ainsi qu'aucun blocage bilatéral. L'ancienne fonction ne vérifiait que la classe commune ; le contrôle de vérification est donc désormais imposé au niveau SQL, et non seulement dans l'interface.
- RPC msg_student_search(text,integer) : recherche sur le pseudo uniquement, requête de 3 à 40 caractères, résultats limités à 15, uniquement élèves vérifiés partageant la même classe scolaire ; champs retournés : identifiant technique (utilisé en mémoire par le client), pseudo, niveau, filière et wilaya. Aucun e-mail, nom réel ou numéro d'inscription retourné.
- Protection anti-scraping : quota de 8 recherches par compte sur une fenêtre de 10 minutes, verrou consultatif et table de compteur inaccessible directement aux rôles anon/authenticated. Aucun annuaire global ni export.
- Client supabase/supabase.js : ajout de msgStudentSearch() via RPC exclusivement.
- Interface msg.js : recherche en arabe depuis la vue « الرسائل », résultats limités, action « إرسال طلب محادثة ». L'UUID du destinataire reste dans une table d'état JavaScript éphémère (state.peers) et n'est pas injecté dans le DOM ; l'envoi passe par msgInviteSend() et reste soumis au consentement du destinataire.
- Tests ajoutés dans ci/msg-discovery-postgres-test.sql et intégrés au test PostgreSQL éphémère existant ci/multaqa-postgres-test.sql : paire vérifiée autorisée, compte non vérifié refusé, compte non élève refusé, profil hors classe exclu, recherche trop courte refusée, quota dépassé refusé, table de quota et fonction interne non exposées.
- Nouveau workflow préparatoire .github/workflows/msg-discovery-postgres-test.yml également ajouté ; le workflow PostgreSQL déjà présent dans la PR reste la voie de test déclenchée sur la PR.
- Cache actualisé : msg.js?v=3520, supabase/supabase.js?v=3522, service worker dz-de-v3.185.0.0.159 ; contrôles check-msg, check-masar et check-public-portal synchronisés.
- **Limites de validation :** aucune exécution navigateur réelle, aucun compte élève réel utilisé, aucune migration Messenger appliquée, aucun déploiement Cloudflare. Les tests PostgreSQL doivent réussir dans GitHub Actions avant de considérer le SQL validé.
- Aucun accès à des messages privés ni lecture de profils réels. Aucun changement sur main. PR #17 doit rester ouverte et non fusionnée.

### Validation finale du Lot 453 — 14 novembre 2026
- Deux premiers essais du nouveau test PostgreSQL ont échoué sur des délimiteurs PL/pgSQL mal formés dans les scripts de test ; les blocs DO ont été corrigés, puis les tests ont été relancés. Ces échecs concernaient les scripts de test isolés, pas une base Supabase.
- Sur le commit code d60638f197db67dee2826e19dddf94c5b075a62e :
  - CI — ALLEMAND run 43531607530 : **success**.
  - Tests PostgreSQL isolés — découverte Messenger run 43531607736 : **success**.
  - Tests PostgreSQL isolés — ملتقى الطلاب run 43531607933 : **success**.
- Ces tests s'exécutent sur PostgreSQL 17 éphémère. Ils valident le contrat de recherche et les contrôles de privilèges dans un environnement isolé ; ils ne prouvent pas encore le comportement sur les JWT réels du projet Supabase ni le parcours navigateur.
- Le module client et le formulaire de recherche sont prêts dans la branche. Tant que les migrations Messenger 001 et 003 ne sont pas appliquées, le serveur de production ne connaît pas les RPC d'invitation/recherche : l'interface doit afficher un état d'indisponibilité et ne doit pas prétendre envoyer une invitation.
- PR #17 reste ouverte, non fusionnée ; aucune modification de main, aucun déploiement Cloudflare et aucune écriture sur Supabase.


## Lot 454 — harnais PostgreSQL isolé du cycle de consentement Messenger (14 novembre 2026)
- Ajout de `ci/msg-invitation-postgres-test.sql` et du workflow `.github/workflows/msg-invitation-postgres-test.yml`, exécuté sur PostgreSQL 17 jetable dans GitHub Actions.
- Le harnais reconstitue les tables et fonctions historiques minimales (comptes/profils synthétiques, conversations, membres, blocages et garde DM historique), puis exécute la migration préparatoire `202611130001_msg_invitation_consent.sql`.
- Scénarios exercés : envoi sans création prématurée de DM, refus d'une acceptation par l'expéditeur, acceptation par le seul destinataire, création d'un DM avec exactement deux membres, idempotence de l'acceptation, annulation par l'expéditeur, refus par le destinataire, impossibilité d'accepter une demande refusée, révocation de l'ancienne RPC directe et refus de l'INSERT direct de conversation.
- Commits du harnais : `1d22d9d06f0641ab11131fc94ef81e5dc5e61516` (test + workflow), `b0788c60a5b1db7cf3184b1b0beab449e5fbc9a1` (modélisation de l'ancienne policy d'adhésion avant migration).
- Workflow GitHub Actions : run `43532909278`, déclenché sur PR #17 et toujours en cours au moment de cette mise à jour. **Aucun succès PostgreSQL du Lot 454 n'est encore revendiqué.** Si le run échoue, lire le journal, corriger le test ou la migration sur la branche puis relancer.
- L'audit du parcours client confirme que la vue distingue les demandes entrantes/sortantes, réserve accepter/refuser au destinataire et annuler à l'expéditeur, et n'assimile pas l'acceptation à une création de زمالة. Le client n'écrit pas directement dans les tables d'invitations.
- Les migrations `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` restent préparées dans Git uniquement et **non appliquées** à Supabase. Aucune écriture Supabase, aucun accès aux messages privés réels, aucun déploiement Cloudflare.
- PR #17 reste ouverte, non fusionnée, cible `main`; HEAD observé : `b0788c60a5b1db7cf3184b1b0beab449e5fbc9a1`. Aucun changement direct sur `main`.

### Correctif de validation Lot 454
- Premier run `43532909278` : échec au démarrage du harnais, avant l'exécution de la migration, sur un délimiteur dollar du stub `msg_member_ok` tronqué dans le fichier de test. Ce résultat ne signale pas un défaut de la migration Messenger.
- Correctif du fichier de test : `dafa489353a1862adcfab0dcb700f4677344ad48`. Le bloc PL/pgSQL a été remis en `$$ ... $$`.
- Le workflow doit être relu sur le nouveau HEAD avant de déclarer le test réussi. Le Lot 454 reste non validé tant que cette exécution n'est pas terminée.


### Suite du Lot 454 — expiration et blocage bilatéral (14 novembre 2026)
- Après correction du harnais SQL (commit `1284f614b89784c1c04b0988deeea8bffbfd1d5b`), les quatre workflows ont réussi : CI principale run `43534924307`, tests consentement Messenger run `43534924354`, tests découverte Messenger run `43534924331`, tests PostgreSQL `ملتقى الطلاب` run `43534924333`. Ces exécutions validaient les scénarios du harnais avant ajout des tests supplémentaires ci-dessous.
- Extension du harnais `ci/msg-invitation-postgres-test.sql` dans le commit `58f92b70ed143eaf7601f0a9cfa3a473fb2d00a6` :
  - invitation de plus de sept jours : acceptation renvoie `NULL`, statut devient `expired`, aucun DM supplémentaire n'est créé ;
  - blocage dans le sens destinataire → expéditeur : acceptation refusée avec `user_blocked` ;
  - blocage dans le sens expéditeur → destinataire : nouvel envoi refusé avec `user_blocked`.
- Les quatre workflows du commit `58f92b7` ont été déclenchés et étaient encore en cours lors de la rédaction de cette note : CI principale run `43535465882`, consentement Messenger run `43535465836`, découverte Messenger run `43535465842`, PostgreSQL `ملتقى الطلاب` run `43535465837`. Ne pas déclarer cette extension validée avant leurs conclusions finales.
- Les tests restent limités à PostgreSQL 17 éphémère avec comptes synthétiques. Ils ne valident pas encore les JWT Supabase réels, l'expérience navigateur, les notifications Realtime en environnement actif ni la disponibilité de Messenger en production.
- Les migrations Messenger `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` demeurent préparatoires et non appliquées à Supabase. Aucun message privé réel consulté, aucune modification de `main`, aucun déploiement. PR #17 reste ouverte et non fusionnée.


### Résultats définitifs — Lot 454, commit `848d232b0ea5a900da20de699b667ae2ec54f475` (14 novembre 2026)
- Correction du SQL de test : les blocs anonymes des scénarios d'expiration et de blocage utilisent désormais les délimiteurs dollar `$$` correctement appariés.
- Les quatre workflows sur le commit `848d232b` sont terminés avec succès :
  - CI principale ALLEMAND : run `43535588239` — succès.
  - PostgreSQL isolé — consentement Messenger : run `43535588296` — succès.
  - PostgreSQL isolé — découverte Messenger : run `43535588243` — succès.
  - PostgreSQL isolé — `ملتقى الطلاب` : run `43535588234` — succès.
- Le test de consentement couvre désormais, dans le harnais PostgreSQL temporaire, l'envoi sans création immédiate de DM, l'acceptation uniquement par le destinataire, l'idempotence, l'annulation, le refus, l'expiration au-delà de sept jours sans création de DM, et les blocages dans les deux sens.
- Ces succès sont des validations automatisées en environnement PostgreSQL isolé avec identités synthétiques. Ils ne constituent pas une preuve de fonctionnement en production : restent à effectuer les tests d'intégration avec JWT Supabase réels dans un environnement de test autorisé, les parcours navigateur multi-comptes, ainsi que la vérification Realtime/notifications.
- État inchangé des protections : PR #17 ouverte et non fusionnée ; `main` non modifiée ; aucune migration Messenger appliquée au projet Supabase actif ; aucun déploiement ; aucune lecture de messages privés réels.
- Étape suivante recommandée : préparer un environnement Supabase de test distinct (sans facturation ni modification du projet actif), puis valider les RPC avec deux comptes synthétiques et les parcours UI avant toute décision d'activation.


### Contrôle complémentaire après le Lot 454 — HEAD documentaire `83e8c1815ca100d0840fa6a44c26f616d3d67295` (14 novembre 2026)
- Nouvelle consultation des exécutions GitHub Actions associées au HEAD `83e8c181` : les quatre workflows sont terminés avec succès :
  - CI — ALLEMAND, run `43535785784` (run #3649), job « Validation structurelle & pédagogique » : success.
  - PostgreSQL isolé — consentement Messenger, run `43535785772` (run #17) : success.
  - PostgreSQL isolé — ملتقى الطلاب, run `43535785797` (run #96) : success.
  - PostgreSQL isolé — découverte Messenger, run `43535785814` (run #35) : success.
- Les étapes déterminantes des trois tests PostgreSQL sont terminées avec succès : initialisation du conteneur PostgreSQL 17, installation du client et exécution du script SQL de test.
- Relecture du harnais : `auth.uid()` est simulé par une fonction SQL qui lit le paramètre de session `request.jwt.claim.sub`; les rôles PostgreSQL `anon` et `authenticated` sont créés localement. **Ce harnais ne valide pas la signature d'un JWT Supabase, GoTrue, PostgREST, les claims réellement émis par Auth ni les échanges HTTP du Data API.** Il valide les fonctions SQL et leurs privilèges dans un PostgreSQL jetable.
- Inventaire Supabase en lecture seule : une seule organisation (`yhigaygkffkdygpaglaf`) et un seul projet (`azjwcybivirvpxbfhyzk`, région `eu-west-2`, PostgreSQL 17) sont visibles. L'inventaire des branches ne retourne que `main`; aucun environnement de test Supabase distinct n'est actuellement disponible.
- Aucune branche ou aucun projet Supabase n'a été créé : la création d'une branche peut entraîner une facturation horaire, et la contrainte utilisateur est de ne rien payer. Aucun coût n'a été accepté ni engagé. Aucun accès au contenu des messages privés ou aux profils nominatifs n'a été effectué.
- Le PR #17 est toujours ouvert selon la consultation GitHub. Il reste non fusionné conformément à la consigne de validation visuelle préalable. Aucun changement sur `main`, aucune migration Messenger appliquée au projet actif, aucun déploiement Cloudflare.
- **Conclusion :** le cycle SQL de consentement et de découverte est validé sur PostgreSQL 17 isolé, mais Messenger n'est toujours pas opérationnel sur le projet Supabase actif. Les migrations `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` restent non appliquées.
- Prochaine étape sans frais ni risque de production : préparer un test d'intégration reproductible avec Supabase local (Auth + API + PostgreSQL) dans un environnement Docker/CI isolé, après vérification de la disponibilité Docker et de la configuration CLI. Ne pas utiliser le projet cloud actif, ne pas créer de branche cloud, et ne pas ajouter de secret de production aux workflows. Si cet environnement local ne peut pas être exécuté dans GitHub Actions sans configuration ou secret supplémentaire, documenter le blocage et demander uniquement l'action utilisateur indispensable.


### Lot 455 — banc d'intégration Supabase local pour Messenger (14 novembre 2026)
- Préparation d'un nouveau workflow dédié : `.github/workflows/msg-supabase-local-test.yml`.
- Fichiers ajoutés :
  - `ci/msg-supabase-local-bootstrap.sql` : schéma minimal et synthétique pour les dépendances Messenger (profils, conversations, membres, blocages et fonctions historiques attendues).
  - `ci/msg-supabase-local-test.mjs` : création de deux comptes synthétiques via l'API Admin Auth locale, connexion par mot de passe pour obtenir des access tokens émis par GoTrue, puis appels REST/RPC PostgREST avec les JWT signés.
  - `.github/workflows/msg-supabase-local-test.yml` : initialise Supabase CLI, démarre la pile locale, prépare le schéma de test, applique uniquement les migrations Messenger 001 et 003 à la base locale, puis exécute le scénario HTTP.
- Scénario d'intégration visé : l'expéditeur crée une invitation en attente ; aucune conversation directe n'est visible avant le consentement ; l'expéditeur ne peut pas accepter sa propre invitation ; le destinataire accepte ; les deux comptes peuvent ensuite lire la conversation et ses deux membres via les politiques RLS.
- Aucun compte réel, aucune donnée privée et aucun secret de production ne sont utilisés. Le service_role et les JWT de ce test sont ceux générés par l'instance locale éphémère du runner GitHub. La migration `202611130002_multaqa_community_feed.sql` n'est pas concernée par ce banc d'essai.
- Supabase CLI est épinglé à `2.122.1` pour ce premier banc. La version 3 publiée en novembre 2026 modifie les cibles par défaut des commandes et le consentement requis pour les changements distants ; la migration vers CLI v3 devra faire l'objet d'une étape distincte, sans risque de viser le projet hébergé par erreur.
- Premier run du nouveau workflow : `43536384262`, déclenché sur le commit `93adcbfc`. Au dernier contrôle, l'initialisation CLI et la configuration Auth locale étaient réussies ; l'étape de démarrage des conteneurs Supabase était encore en cours. **Aucun résultat positif n'est encore revendiqué pour le scénario JWT/PostgREST/RLS.**
- Corrections apportées ensuite dans le workflow : export des variables locales via `supabase status -o env` puis transfert explicite vers `GITHUB_ENV`, et suppression de `mailpit` de la liste d'exclusions afin de ne garder que les noms de services documentés. Dernier HEAD de la PR au moment de la mise à jour : `30914eedcf7ed7b4682655c25869756258be583c`. Le run initial ne porte pas encore sur ce dernier HEAD.
- Contrôles existants sur le commit `93adcbfc` : CI générale, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL ملتقى الطلاب terminés avec succès. Cela ne valide pas encore le nouveau workflow local.
- Garde-fous inchangés : PR #17 ouverte et non fusionnée ; `main` non modifiée ; aucune migration Messenger exécutée sur Supabase cloud ; aucun déploiement Cloudflare ; aucun coût cloud engagé.
- Prochaine étape : obtenir un résultat complet du workflow Supabase local sur le HEAD courant, consulter ses logs, corriger les erreurs de démarrage ou d'intégration puis relancer jusqu'à un résultat reproductible. Tant que ce workflow n'est pas vert, Messenger reste non validé avec Auth/JWT/PostgREST réels, et n'est pas déclaré opérationnel.


#### Diagnostic et correction du premier lancement Supabase local — 14 novembre 2026
- Le run `43536384262` a échoué à l'étape « Démarrer Supabase local isolé ». Les logs montrent que `supabase start` a automatiquement tenté d'appliquer `202611130001_msg_invitation_consent.sql` avant le bootstrap et a échoué sur `relation public.msg_conversations does not exist`. La cause est donc l'ordre d'initialisation des migrations, pas une modification de la base cloud.
- Correction du workflow au commit `8942b889ba9a0978e996069dfeb2609321b3b108` : les fichiers SQL du dossier de migrations sont copiés temporairement hors de `supabase/migrations` pendant le démarrage local, puis restaurés après le démarrage. Le bootstrap synthétique est exécuté avant l'application explicite des migrations 001 et 003. La migration Multaqa 002 n'est pas appliquée dans ce scénario.
- La syntaxe du script Node a été vérifiée avec `node --check` et a réussi dans le run `43536593612`. Le CLI local initialise également sa configuration et le paramètre Auth sans erreur.
- Deuxième run de l'intégration locale : `43536593612`, sur le commit `8942b889`, encore en cours au dernier contrôle, à l'étape de démarrage de la pile. Aucun succès JWT/PostgREST/RLS n'est encore revendiqué.
- Le déclenchement du workflow est conservé sur les événements pull_request pour que les prochaines mises à jour de la PR relancent ce contrôle. HEAD documentaire actuel : `d4b733469f278df0d545d6d3431b523cf2b7447a`.
- Les workflows classiques sur le commit `8942b889` sont en cours ; le précédent lot sur `93adcbfc` avait sa CI générale et ses trois suites PostgreSQL existantes réussies.


#### Point de contrôle après correction — HEAD `d16bf090f93a24ba90dd397be4fe9545747225a9`
- Sur le commit de code `d4b73346`, les quatre workflows classiques sont tous terminés avec succès : CI `43536613782`, consentement `43536613783`, découverte `43536613836`, et Multaqa `43536613871`.
- Le nouveau workflow Supabase local correspondant à ce commit, run `43536613808`, est encore en cours à l'étape de démarrage de la pile Supabase. La syntaxe Node et les étapes préalables de configuration/isolement des migrations sont terminées avec succès. Le scénario Auth/JWT/RPC/RLS n'a pas encore commencé.
- PR #17 : toujours ouverte, non fusionnée ; `mergeable_state=clean` au dernier contrôle. Le HEAD documentaire a avancé à `d16bf090` pour consigner ce point. `main` reste inchangée.


#### Résultat final du banc Supabase local — HEAD `8f5a2cf66189130f748e0afcaf7474e7dbd1405d` (14 novembre 2026)
- Le workflow local Messenger est maintenant **terminé avec succès** sur le HEAD de la PR : run `43536751470`, job `messenger-supabase-local`, étape 13 « Vérifier Auth GoTrue, JWT signés, RPC PostgREST et RLS avec deux élèves synthétiques » : success.
- Le journal contient la confirmation explicite : `PASS: GoTrue JWT réel local, RPC PostgREST, consentement du destinataire et RLS des deux membres`.
- Les logs confirment que la pile Supabase locale démarre, que le bootstrap synthétique s'exécute, que les migrations Messenger 001 et 003 sont appliquées **uniquement à la base locale éphémère**, puis que le script HTTP Node s'exécute. La pile locale est arrêtée à la fin du job.
- Assertions du scénario validé : création de deux comptes synthétiques par l'API Admin GoTrue locale ; connexion par mot de passe pour obtenir des JWT signés localement ; appel de RPC via PostgREST avec les JWT des utilisateurs ; invitation en attente sans DM prématuré ; impossibilité pour l'expéditeur d'accepter sa propre invitation ; acceptation par le destinataire ; visibilité de la conversation pour les deux membres et présence de deux membres exactement via RLS.
- Runs sur le même HEAD `8f5a2cf` tous terminés avec succès : CI générale `43536751420`, consentement PostgreSQL `43536751448`, découverte PostgreSQL `43536751406`, ملتقى الطلاب PostgreSQL `43536751390`, et intégration Supabase locale `43536751470`.
- Cette validation est un vrai test d'intégration Auth/JWT/PostgREST/RLS, mais **reste une validation locale synthétique** : elle ne prouve pas que les migrations sont installées sur le projet Supabase hébergé, que les comptes réels sont prêts, que l'interface navigateur est validée en multi-comptes, ni que Realtime/notifications sont opérationnels.
- Aucune migration Messenger n'a été appliquée au projet Supabase cloud ; aucun compte ou message réel n'a été consulté ; aucun déploiement Cloudflare ni coût cloud n'a été engagé. La migration Multaqa 002 n'est pas incluse dans ce test.
- PR #17 vérifiée au même HEAD : ouverte, non fusionnée, base `main`, état mergeable positif. Conserver impérativement cette PR ouverte pour validation visuelle utilisateur ; aucune modification directe sur `main`.
- Étape suivante : auditer les chemins d'intégration de l'interface réelle `msg.js` avec les RPC et le consentement, puis construire des tests navigateur multi-comptes et Realtime dans un environnement local. Ne pas annoncer Messenger opérationnel sur le cloud avant validation et autorisation distincte d'installation des migrations 001/003.


#### Extension du banc d'intégration Auth/RLS — commit code `1628087e73f2f9dbec2528fda880efaa7b1a6359` (14 novembre 2026)
- Après le premier succès Auth/JWT/PostgREST/RLS, le script `ci/msg-supabase-local-test.mjs` a été étendu sans modifier le runtime Messenger ni les migrations.
- Nouveaux scénarios ajoutés : contrat minimal de découverte (uniquement `student_id,pseudo,niveau,filiere,wilaya`, sans e-mail) ; confidentialité d'une invitation vis-à-vis d'un troisième compte non participant ; impossibilité pour le destinataire d'annuler une invitation sortante ; annulation possible par l'expéditeur ; impossibilité pour l'expéditeur de refuser sa propre invitation ; refus possible par le destinataire ; absence de conversation directe après annulation/refus.
- Le run correspondant au commit `1628087e`, ID `43537268300`, a commencé. Au dernier contrôle : syntaxe Node réussie, initialisation CLI et configuration Auth réussies, démarrage des conteneurs locaux en cours ; les scénarios HTTP étendus n'ont pas encore été exécutés. Ne pas anticiper leur résultat.
- Le test local précédent reste vert : run `43536751470`, avec le succès explicite GoTrue/JWT/PostgREST/consentement/RLS. La CI générale du HEAD documentaire précédent `8eb31f24` est verte ; les autres contrôles de ce HEAD sont en cours.
- Prochaine étape : attendre le run `43537268300`, examiner le journal détaillé, corriger si nécessaire, puis inscrire le résultat définitif. Aucun changement Supabase cloud, aucune migration Messenger cloud, aucun déploiement, aucune fusion.


#### Centre des invitations — actualisation Realtime côté interface (14 novembre 2026)
- Le banc étendu du commit `997bbf213fad62a7db49b1f3f457df42001f6bea` a terminé avec succès : run Supabase local `43537329747`, job `messenger-supabase-local`. Journal : `PASS: GoTrue JWT, PostgREST, RLS, consentement, recherche minimale, confidentialité des invitations, annulation et refus`. Les quatre autres workflows sur ce HEAD sont également verts : CI `43537329715`, consentement `43537329785`, découverte `43537329828`, Multaqa `43537329719`.
- Audit interface : `supabase/supabase.js` expose les RPC `msg_invite_send/accept/decline/cancel`, la recherche `msg_student_search` et la lecture des invitations ; `msg.js` affichait le centre, mais ne s'abonnait pas aux événements Realtime de `msg_invites`. Les messages en direct avaient déjà leur canal Realtime distinct.
- Correction apportée dans `msg.js` : ajout d'un canal Realtime `msg-invites-<userId>` abonné aux changements de `public.msg_invites` ; les changements déclenchent le rechargement du centre uniquement si le même compte est actif et qu'aucun fil de conversation n'est ouvert. Le canal est fermé au changement de vue et à l'ouverture d'un fil, puis réabonné lors du retour à la liste. Aucun payload de message privé n'est diffusé par ce canal ; les lignes d'invitation restent soumises à la RLS.
- Tests statiques de garde ajoutés à `tests/msg_test.mjs` pour vérifier l'abonnement, le nettoyage et la condition de rafraîchissement.
- Commits interface/tests : `b88831a2479e11206ac068f6d9391cf6b2fbd6e4`, `c8c7e6636fd209ab2379c41e26919cacfc6e1854`, puis correction de nettoyage `ad2e81c1f1e1857a16717a4f1143236f081cde7b`.
- Les workflows lancés sur `c8c7e663` étaient encore en cours lors du contrôle ; ils ne valident donc pas encore le canal Realtime. Le commit final `ad2e81c` déclenche également une nouvelle série CI. Attendre les résultats avant de déclarer cette modification vérifiée.
- API GitHub PR #17 au dernier contrôle : ouverte, non fusionnée ; `mergeable=true`, `mergeable_state=unstable` pendant les contrôles Actions. Ne pas confondre cet état transitoire avec un conflit confirmé.
- Aucun changement sur `main`, aucune migration Messenger appliquée à Supabase hébergé, aucun déploiement Cloudflare. Realtime des invitations est implémenté dans le code de la branche, mais pas encore prouvé en navigateur multi-comptes ni sur l'instance cloud.


## Lot 456 — fermeture des courses asynchrones Realtime Messenger (14 novembre 2026)
- Revue du cycle de vie du canal d'invitations dans `msg.js` après validation CI du Lot 455.
- Défaut identifié : `startInviteChannel()` attendait la création du client Supabase avant d'enregistrer le canal. Si l'utilisateur quittait Messenger ou ouvrait un fil pendant cette attente, la fermeture pouvait arriver avant l'affectation de `state.inviteCh`; l'opération asynchrone pouvait ensuite créer un abonnement devenu inutile.
- Correction : ajout d'un compteur de génération `inviteEpoch`; chaque fermeture invalide les opérations asynchrones antérieures. Après l'attente du client Supabase, l'abonnement vérifie encore la génération, l'identité active, l'état hors fil et l'activité de la vue Messenger.
- Le gestionnaire `dz:view` met désormais explicitement à jour `inviteViewActive`, ferme les canaux et ne relance le rendu que lorsque la vue Messenger est réellement active.
- Ajout de deux assertions statiques dans `tests/msg_test.mjs` pour vérifier l'invalidation des opérations obsolètes et l'interdiction de démarrer le canal hors de la vue Messenger.
- Commits : code `aa89e6112b63fdf97641c5841f85369f7ce2946c`; tests `7ad3cb9d1d7ac68ff29cdac8d58d5965835c93aa`. Le présent dossier est mis à jour séparément ci-dessous.
- CI antérieure sur le code Realtime initial : cinq workflows réussis (validation générale, consentement PostgreSQL, découverte PostgreSQL, Multaqa PostgreSQL, Supabase local GoTrue/JWT/PostgREST/RLS). Ces résultats ne valident pas encore ce correctif Lot 456; ses propres workflows doivent s'exécuter après les commits ci-dessus.
- Limite : aucune session navigateur multi-compte ni livraison WebSocket Realtime réelle n'a encore été exercée. Le test reste statique côté client et intégration serveur locale; ne pas présenter les notifications live comme opérationnelles en production.
- Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune opération sur Supabase en production. PR #17 reste ouverte et non fusionnée.


### Lot 457 — correction du contrôle statique Realtime (14 novembre 2026)
- La CI principale du commit `e5ae61ea0af7ca82997ee21acb47303eb381eeee` a échoué uniquement dans `tests/msg_test.mjs`, sur l'assertion qui cherchait une condition JavaScript sous forme compacte.
- Le code réel `msg.js` applique bien les quatre gardes dans le callback Realtime : génération d'abonnement toujours valide, vue Messenger active, même utilisateur connecté et absence de fil ouvert. Le contrôle statique attendait à tort une expression sur une seule ligne et ne tenait pas compte des gardes supplémentaires.
- Correction du test au commit `870f6431ed535203b53efeceb489181da0dc6aec` : assertion regex tolérant les espaces/retours à la ligne, tout en exigeant explicitement les quatre conditions et l'appel à `renderList()`. Aucun affaiblissement du code runtime ni des règles serveur.
- Le run de référence sur le HEAD précédent a montré les quatre workflows Messenger/PostgreSQL et Supabase local verts ; seul le contrôle structurel principal échouait sur cette assertion. Le nouveau commit doit encore être validé par ses propres workflows avant toute conclusion.
- PR #17 reste ouverte et non fusionnée. Aucun changement sur `main`, aucune migration Messenger appliquée à Supabase cloud, aucun déploiement ni coût cloud engagé.
- Étape suivante : contrôler les nouveaux runs déclenchés par `870f643`, corriger uniquement les erreurs réellement remontées, puis tester le canal Realtime avec deux sessions synthétiques si un banc local adapté peut être ajouté sans dépendance frontend payante.


### Lot 458 — test de réception WebSocket Realtime avec comptes synthétiques (14 novembre 2026)
- Ajout dans `ci/msg-supabase-local-test.mjs` d'un test de transport réel vers le service Realtime de la pile Supabase locale, avec le WebSocket natif de Node 22 et le JWT GoTrue signé du compte destinataire.
- Le test ouvre le canal PostgreSQL `public.msg_invites`, attend la confirmation du `phx_join`, crée une invitation depuis le compte expéditeur par RPC PostgREST, puis attend l'événement INSERT reçu par le destinataire. Il vérifie l'identifiant, l'expéditeur et le statut de l'invitation, puis annule l'invitation synthétique et ferme le socket dans un bloc `finally`.
- Le test utilise exclusivement les trois comptes synthétiques déjà créés dans la base locale éphémère. Aucun message privé ni profil réel n'est consulté.
- Commit du test : `8ef0132c8d95827b4ea21ae8fc8735ca8e0c416c`.
- Ce test n'est pas encore validé : son workflow doit confirmer le protocole WebSocket, la publication locale et la réception RLS effective. Le succès des tests HTTP/RPC antérieurs ne suffit pas à déclarer Realtime opérationnel.
- PR #17 reste ouverte/non fusionnée. Aucun changement sur `main`, aucun déploiement Cloudflare, aucune migration appliquée au Supabase hébergé.
- Si le test échoue, examiner le message de jointure et la forme du payload du protocole local, puis corriger le banc de test sans désactiver RLS ni élargir la publication.

## Lot 459 — correction du protocole Phoenix du test Realtime (14 novembre 2026)
- Vérification des cinq workflows sur le HEAD précédent `f6a629f1d64f2d23f08d33514d6902b355a94bdd` : CI générale, tests PostgreSQL de découverte, tests PostgreSQL de consentement et tests PostgreSQL de `ملتقى الطلاب` réussis; le workflow d'intégration Supabase local a échoué uniquement au nouveau test WebSocket Realtime.
- Diagnostic tiré du journal GitHub Actions : Supabase local démarrait correctement, les migrations Messenger s'appliquaient dans la base éphémère, puis le client de test expirait en attendant `SUBSCRIBED`. Le test envoyait les trames Phoenix sous forme de tableau JSON tout en déclarant `vsn=1.0.0`.
- La documentation officielle du protocole Realtime distingue précisément les formats : `1.0.0` utilise un objet JSON; `2.0.0` utilise le tableau ordonné `[join_ref, ref, topic, event, payload]`. La cause identifiée est donc une incohérence de version de protocole dans le harnais, et non une preuve d'échec de la policy RLS ou de la publication SQL.
- Correction limitée à `ci/msg-supabase-local-test.mjs` : alignement du paramètre WebSocket sur `vsn=2.0.0`, qui correspond au tableau JSON déjà envoyé. Aucun changement au code applicatif Messenger, aux migrations SQL, à Supabase hébergé, aux données, à Auth/RLS ou aux paiements.
- Commit correctif : `f365c77fe82d88cb6ea444ceeea5a487b7082f07`.
- Validation : en attente de la nouvelle exécution GitHub Actions sur ce commit. Ne pas déclarer le transport Realtime validé avant que le test reçoive effectivement le `phx_reply` de souscription et l'événement INSERT synthétique.
- La migration `202611130001_msg_invitation_consent.sql` et la migration `202611130003_msg_student_discovery.sql` restent non appliquées sur Supabase hébergé; elles sont utilisées uniquement dans la pile locale éphémère du workflow.
- PR #17 doit rester ouverte et non fusionnée; aucune modification de `main`, aucun déploiement Cloudflare.

## Lot 460 — diagnostic de la livraison Realtime (14 novembre 2026)
- Après l'alignement du protocole Phoenix sur `vsn=2.0.0`, le serveur accepte désormais la souscription du client WebSocket (le test dépasse l'attente de `SUBSCRIBED`). Le workflow échoue ensuite car aucun événement `msg_invites INSERT` n'est observé dans les 12 secondes.
- Les quatre autres workflows sur le commit `f365c77f` réussissent : CI générale, PostgreSQL consentement, PostgreSQL découverte, PostgreSQL `ملتقى الطلاب`. Le workflow Supabase local confirme également que la pile locale démarre, que les deux migrations Messenger s'appliquent et que l'étape de test GoTrue/PostgREST/RLS démarre; l'échec est désormais localisé à la réception de l'événement Realtime.
- Ajout d'une instrumentation limitée au harnais `ci/msg-supabase-local-test.mjs` : conservation des dernières trames WebSocket reçues et inclusion de ces trames dans le message d'échec, afin de distinguer la réponse d'abonnement, les notifications serveur, les données de ligne et les éventuelles erreurs de canal.
- Commit diagnostic : `a4cd51a59ed033b71965216e4c5817a81626238f`.
- État : le diagnostic doit encore être exécuté par GitHub Actions; aucun résultat de livraison Realtime n'est déclaré. Pas de changement au code applicatif Messenger, aux migrations, à Supabase hébergé, aux données réelles ou aux paramètres Auth/RLS de production.
- PR #17 reste ouverte et non fusionnée; aucun changement sur `main`, aucun déploiement Cloudflare.


## Lot 461 — instrumentation publication et journaux Realtime (14 novembre 2026)
- Lecture du run du commit `a4cd51a5` : la souscription WebSocket est acceptée. Les seules trames reçues sont le `phx_reply` de souscription et le message système `Subscribed to PostgreSQL`; aucune trame `postgres_changes`, aucun `phx_error` et aucun événement de ligne n'arrivent avant l'expiration.
- Le journal confirme que le test utilise bien le JWT GoTrue du destinataire et que la RPC d'envoi est appelée après la souscription. Le problème ne vient donc plus du format de trame Phoenix ni d'un rejet explicite du canal.
- Ajout au workflow local de deux diagnostics avant le test : présence effective de `public.msg_invites` dans `pg_publication_tables`, et état de réplication/RLS de la table. Ajout aussi de la capture des 300 dernières lignes du conteneur Realtime même si le test échoue, avant l'arrêt de la pile.
- Modification limitée à `.github/workflows/msg-supabase-local-test.yml`; aucune migration, aucun code Messenger runtime, aucune policy, aucune donnée de production et aucun réglage Supabase hébergé modifiés.
- Commit instrumentation : `62a87c37c4ded3fc422c9d51d5c865307393fcdd`. Les contrôles de ce nouveau commit sont à attendre; le diagnostic n'est pas encore exécuté.
- Résultats confirmés sur le commit antérieur `95ebce7a` : CI générale, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL `ملتقى الطلاب` réussis; intégration Supabase locale échouée uniquement à la réception de l'événement Realtime.
- La PR #17 reste ouverte et non fusionnée. Aucun changement sur `main`, aucun déploiement Cloudflare. Les migrations Messenger 001 et 003 restent non appliquées sur Supabase hébergé.


## Lot 462 — vérification de la persistance et de la réplication Realtime (14 novembre 2026)
- Résultat des diagnostics du Lot 461 sur le commit `89bc8345` : la requête catalogue confirme que `public.msg_invites` appartient à `supabase_realtime`; `relreplident=d` (identité par défaut), RLS est activé. La souscription Phoenix répond `status=ok`, puis le serveur annonce `Subscribed to PostgreSQL`, mais aucun événement n'est livré.
- La clé primaire de `msg_invites.id` est bien définie dans la migration. Il n'y a donc pas d'indice justifiant de modifier arbitrairement l'identité de réplication ou de désactiver RLS.
- Ajout au test local de deux vérifications explicites immédiatement après la RPC d'invitation : la ligne doit être visible avec la clé service_role, puis lisible par le destinataire avec son JWT GoTrue et la policy RLS. Cela distingue une absence d'écriture d'un défaut de diffusion Realtime.
- Ajout au workflow d'une capture systématique des slots de réplication, des connexions `pg_stat_replication` et des options de la publication `supabase_realtime`, même en cas d'échec.
- Commits : test persistance/RLS `f76f376a24e570634df62d0ca26934ba2a7c6fdd`; diagnostic PostgreSQL `c6bc87c95a5bdd447599122d63b73ccb9331a528`.
- Les nouveaux contrôles sont à attendre. Aucun changement au runtime Messenger, aux migrations, à Supabase hébergé, à Auth/RLS de production ou aux données réelles.
- PR #17 reste ouverte et non fusionnée; aucun changement sur `main`, aucun déploiement Cloudflare.

## Lot 463 — Diagnostic ciblé du pipeline CDC Realtime (14 novembre 2026)

- Les exécutions du test local Supabase sur `fab6451c` échouent encore uniquement au contrôle de livraison WebSocket : abonnement accepté (`phx_reply status=ok`, puis `Subscribed to PostgreSQL`), mais aucun événement `postgres_changes INSERT` reçu dans les 12 secondes.
- Les contrôles précédant l'attente événementielle ne lèvent aucune erreur : l'appel RPC d'envoi persiste l'invitation (lecture service_role vérifiée), et le destinataire peut lire sa propre invitation via son JWT GoTrue/RLS. L'échec est donc postérieur à l'écriture SQL et à la lecture RLS.
- Diagnostic PostgreSQL : `public.msg_invites` est bien dans `supabase_realtime`; la table a RLS activé et replica identity `d` (normal avec sa clé primaire); la publication indique `pubinsert=true`. Deux slots logiques actifs existent : `supabase_realtime_replication_slot_` (wal2json) et `supabase_realtime_messages_replication_slot_` (pgoutput). La connexion `realtime_replication_connection` observée dans `pg_stat_replication` est celle du flux broadcast `realtime.messages`; elle ne suffit pas à prouver le traitement CDC de `msg_invites`.
- Lot 463 ajoute des diagnostics non destructifs au workflow local : connexions `pg_stat_activity`, structure de `realtime.subscription` et variables non secrètes de configuration Realtime (`PUBLICATIONS`, `SLOT_NAME`, `TEMPORARY_SLOT`, paramètres DB non sensibles). Aucun schéma de production ni aucune migration hébergée n'est modifié.
- Commit workflow : `32f1376612b477fa461ef63163c71d1294ddc67a`. Exécutions déclenchées automatiquement par la PR; résultat à contrôler avant de conclure.
- Les workflows isolés CI, consentement, découverte et `ملتقى الطلاب` sont verts sur le commit précédent. PR #17 reste ouverte et non fusionnée.
- Prochaine étape : exploiter les nouveaux diagnostics pour vérifier si le serveur Realtime lance bien son consommateur Postgres Changes/wal2json et s'il enregistre le canal dans `realtime.subscription`. Ne pas changer arbitrairement replica identity, RLS ou migrations.

## Lot 464 — Stabilisation du diagnostic Realtime (14 novembre 2026)

- La nouvelle exécution sur `087733f5` confirme le même défaut : RPC persistée, lecture RLS du destinataire réussie, abonnement WebSocket accepté, mais aucun événement INSERT délivré.
- Les diagnostics confirment encore deux slots actifs (`wal2json` pour `supabase_realtime_replication_slot_`, `pgoutput` pour le slot Broadcast `realtime.messages`) et `pubinsert=true`. Les logs Realtime observés démarrent explicitement le flux Broadcast, mais ne montrent pas le démarrage d'un consommateur CDC pour `public.msg_invites`.
- Le contrôle additionnel du Lot 463 était lui-même marqué en échec et interrompait la collecte de certaines informations. Lot 464 le rend non bloquant, sépare les requêtes, liste les tables du schéma `realtime` et garde la capture des variables de configuration non sensibles. Cela évite qu'un diagnostic auxiliaire masque la cause initiale.
- Commit workflow : `559cd3cbd879bb8a4b38ec32e7ad46d68a3a6fa3`. Tests déclenchés automatiquement; résultats à vérifier.
- Aucune modification de schéma/migration, RLS ou service hébergé. PR #17 reste ouverte et non fusionnée.
- Étape suivante : examiner les objets `realtime`, les variables effectives du conteneur et les logs complets pour déterminer si le mode CDC Postgres Changes est désactivé ou si le service Realtime ne lance pas son worker de réplication. Ne pas déclarer Messenger opérationnel tant que l'événement temps réel n'est pas effectivement reçu.


## Lot 465 — inspection de la souscription CDC en direct (14 novembre 2026)

- Le run `43542139984` sur le HEAD `6a4915fc` termine en échec uniquement sur l'attente d'un événement Realtime : l'invitation est persistée (contrôle service_role), lisible par le destinataire (JWT GoTrue + RLS), la souscription WebSocket est acceptée (`phx_reply status=ok` et `Subscribed to PostgreSQL`), mais aucun `postgres_changes INSERT` n'arrive en 12 secondes.
- Les journaux précisent que le slot `wal2json` est actif et que la connexion logique visible dans `pg_stat_replication` correspond au slot `pgoutput` du flux Broadcast `realtime.messages`. La publication `supabase_realtime` autorise INSERT/UPDATE/DELETE/TRUNCATE et contient bien `public.msg_invites`; la table garde sa PK, replica identity `d` et RLS activé.
- Le diagnostic du conteneur du Lot 464 contenait une continuation de ligne shell invalide (`\\` doublé), qui a interrompu l'inspection des variables. Lot 465 remplace la commande par un pipeline sur une seule ligne et capture aussi `DB_AFTER_CONNECT_QUERY` et `PORT` sans exposer de secrets.
- Le test Node interroge maintenant `realtime.subscription` pendant que le WebSocket destinataire est effectivement souscrit, et affiche uniquement les champs de diagnostic non secrets (identifiant de souscription, table, filtres, rôle, action). Cela doit confirmer si la souscription CDC est enregistrée pour `public.msg_invites` au moment précis de l'envoi.
- Commits : workflow `70c0ce2f80952daf3eb2eb88d30dee04a8ddf2ee`; test `58a285dff8212ff3439240f9f349301f1c00d26e`. Le dossier est mis à jour dans le commit suivant; exécutions automatiques à contrôler.
- Aucune modification des migrations, du runtime Messenger, des policies, de la base Supabase hébergée ou des données réelles. PR #17 reste ouverte et non fusionnée; aucun changement sur `main` et aucun déploiement Cloudflare.
- Ne pas déclarer Messenger opérationnel tant que le destinataire n'a pas reçu l'événement temps réel dans le test.


## Lot 466 — diagnostic CDC après délai (14 novembre 2026)

- Le run d’intégration Supabase locale `43542582148` sur le commit `cc802a73` a échoué ; les quatre autres workflows du même commit sont réussis.
- La publication `supabase_realtime` contient `public.msg_invites` ; la table a une clé primaire, `relreplident=d` et RLS activé. L’utilisateur destinataire lit bien sa propre invitation via son JWT.
- Le WebSocket accepte la souscription et répond `Subscribed to PostgreSQL`, mais aucun événement INSERT n’arrive en 12 secondes.
- La table `realtime.subscription` existe avec les colonnes attendues, mais la première lecture immédiatement après l’accusé de souscription ne retourne aucune ligne pour `public.msg_invites`. Le conteneur indique `DB_AFTER_CONNECT_QUERY=SET search_path TO _realtime` ; cela ne suffit pas à conclure que le schéma interrogé est incorrect, car la table est effectivement présente dans `realtime`.
- Le test est renforcé pour relire `realtime.subscription` à l’expiration des 12 secondes et inclure le résultat dans l’erreur. Cela distinguera une simple course au moment de l’inspection d’une absence persistante d’enregistrement CDC.
- Les diagnostics du conteneur ne montrent pas les variables `PUBLICATIONS` ou `SLOT_NAME` dans l’environnement sélectionné ; cette observation est conservée comme piste, pas comme cause prouvée.
- Aucune modification de Supabase hébergé, aucune migration de production, aucune modification de `main` et aucun déploiement.



## Lot 467 — diagnostic des échecs de démarrage GitHub Actions (14 novembre 2026)

- Vérification du commit HEAD `c9b69c5ba0a46cda6e049a1abe68c8da79665bb4`: les cinq workflows CI, Supabase local Messenger, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL `ملتقى الطلاب` ont tous échoué avant toute étape de test.
- Inspection directe des objets Jobs GitHub : chacun affiche `runner_id=0`, `runner_name` vide, `steps=[]` et une durée d'environ deux secondes entre démarrage et clôture. Les cinq jobs demandent pourtant le label `ubuntu-latest`.
- Comparaison avec l'exécution précédente `435425...` : les runners étaient alors affectés (IDs `1000003838` à `1000003842`) et les étapes étaient bien exécutées. Cela confirme que les échecs du Lot 466 sont des échecs de provisionnement/affectation du runner GitHub Actions, et non des échecs fonctionnels démontrés par les tests.
- Les journaux des jobs échoués ne sont pas disponibles (réponse BlobNotFound) ; aucune annotation exploitable n'a pu être obtenue par les interfaces GitHub disponibles. Il serait incorrect d'inventer une cause plus précise ou de modifier le code pour masquer ce défaut d'infrastructure.
- Les relances des cinq jobs ont reproduit le même symptôme. Aucune autre relance en boucle n'est lancée ; attendre une exécution où un runner est effectivement attribué, puis reprendre l'analyse fonctionnelle.
- La PR #17 est toujours ouverte, non fusionnée et mergeable au dernier contrôle. Aucun changement sur `main`, aucune migration hébergée, aucun changement Auth/RLS de production et aucun déploiement Cloudflare.
- Le défaut Realtime de Messenger reste distinct et non résolu : le destinataire n'a toujours pas reçu d'événement INSERT dans le test local. Messenger ne doit donc pas être annoncé comme opérationnel.

## Lot 468 — validation explicite de l'ACK Postgres Changes (14 novembre 2026)

- L'analyse du protocole officiel Realtime confirme que le `phx_reply` positif à `phx_join` doit contenir `response.postgres_changes` avec l'identifiant et la cible de chaque abonnement. Les événements `system` de l'extension `postgres_changes` donnent séparément le statut de l'inscription CDC ; l'architecture Realtime utilise un worker Postgres CDC distinct du flux Broadcast.
- Le test local vérifiait seulement `payload.status === "ok"` et conservait les trames brutes en cas de timeout. Il ne validait pas que la réponse d'adhésion confirme explicitement `public.msg_invites` ni ne classait les statuts `system` de l'extension CDC.
- Le test vérifie désormais que `phx_reply.response.postgres_changes` contient effectivement `schema=public` et `table=msg_invites`. Un ACK positif sans cette entrée est maintenant rejeté immédiatement avec la réponse du serveur.
- Les événements `system` dont `extension=postgres_changes` sont conservés dans un journal borné et ajoutés au message d'échec, avec les lignes `realtime.subscription` relues après le délai. Cela permettra de distinguer un ACK incomplet, une erreur d'inscription CDC et une souscription correcte sans livraison WAL.
- Commit du test : `d36af34a1b5c3d9e333ec1e06564927ecc18f9e2`. Exécution CI à contrôler ; les workflows précédents avaient échoué avant affectation de runner (`runner_id=0`), donc aucune conclusion d'exécution n'est encore possible pour ce changement.
- Aucun changement des migrations, du runtime Messenger, des politiques, des données réelles ou de Supabase hébergé. PR #17 reste ouverte et non fusionnée ; `main` reste inchangée. Messenger n'est pas déclaré opérationnel tant que le test n'a pas confirmé la réception effective de l'événement par le destinataire.
## Lot 469 — attendre la confirmation CDC avant l'écriture de test (14 novembre 2026)

- La documentation officielle du protocole Realtime précise que le `phx_reply` positif confirme l'adhésion au canal et retourne la liste des souscriptions PostgresChanges, mais que le message `system` avec `extension=postgres_changes` et `status=ok` confirme séparément que la souscription PostgreSQL est active. La base de connaissances Supabase recommande explicitement d'attendre ce signal avant d'effectuer l'INSERT de test, car l'écriture juste après l'ACK de souscription peut créer une course.
- Source protocole : https://supabase.com/docs/guides/realtime/protocol ; source diagnostic : https://supabase.com/kb/troubleshooting/realtime-postgres-changes-troubleshooting
- Lot 468 validait la liste `response.postgres_changes` et journalisait les messages `system`, mais `readyPromise` était encore résolue dès le `phx_reply`. Le test pouvait donc envoyer la RPC avant que le worker CDC ait confirmé son état prêt.
- Le test attend désormais les deux conditions, dans n'importe quel ordre : (1) `phx_reply` positif contenant `public.msg_invites`; (2) message `system` avec `extension=postgres_changes` et `status=ok`. Le signal `error` ou `timeout` fait échouer l'initialisation avec le message serveur. L'insertion synthétique ne démarre qu'après ces deux confirmations.
- Le délai de 12 secondes signale maintenant explicitement l'absence de disponibilité CDC et inclut l'ACK ainsi que les derniers messages système reçus. Aucun délai arbitraire ajouté après l'ACK : le test se synchronise sur le signal serveur documenté.
- Commit test : `590c0023932b362423b64c08a7d6eb227c0520db`. Le contrôle Node `node --check` est configuré dans le workflow mais ne peut pas encore être revendiqué : les jobs GitHub Actions précédents ne reçoivent aucun runner (`runner_id=0`, aucune étape).
- Aucun changement des migrations, du runtime de production Messenger, des policies RLS, des données réelles ou de Supabase hébergé. PR #17 reste ouverte et non fusionnée; `main` inchangée. Messenger reste non déclaré opérationnel jusqu'à réception effective de l'INSERT par le destinataire.
- Après le commit du test, les cinq workflows ont été relancés automatiquement (runs `43581310517`, `43581310576`, `43581310510`, `43581310519`, `43581310531`). Ils échouent tous en 1–2 secondes avec `runner_id=0`, `runner_name` vide et `steps=[]`. Le job d'intégration Supabase local a également été relancé individuellement (tentative 2 du run `43581182404`) et reproduit le même défaut d'affectation. Le code Lot 469 n'a donc pas été exécuté par GitHub Actions.
- La PR #17 reste ouverte, non fusionnée et mergeable au dernier contrôle. Aucune modification de `main`, des migrations hébergées, d'Auth/RLS de production ou des données réelles.
## Lot 470 — contrôle des exécutions CI après synchronisation CDC (14 novembre 2026)

- Vérification du HEAD `b33207eb6284af3d3742eb1ca1338886affc3ea8` et des cinq exécutions déclenchées par l'actualisation du dossier : `43581342941` (Supabase local Messenger), `43581343007` (PostgreSQL ملتقى الطلاب), `43581342943` (PostgreSQL consentement), `43581342978` (CI ALLEMAND), `43581342975` (PostgreSQL découverte). Tous les jobs sont terminés en échec après environ 1–2 secondes, avec `runner_id=0`, `runner_name` vide et aucune étape (`steps=[]`).
- Les Check Runs correspondants exposent deux annotations chacun mais aucune sortie textuelle (`output.title`, `summary`, `text` tous nuls). L'endpoint d'annotations est refusé par l'interface GitHub connectée ; les journaux des jobs ne sont donc toujours pas récupérables. Ne pas attribuer une cause précise (quota, indisponibilité GitHub ou paramètres de dépôt) sans preuve.
- Le workflow `msg-supabase-local-test.yml` a été relu sur la branche : il utilise `runs-on: ubuntu-latest`, puis checkout, Node 22 et `node --check` avant le démarrage de Supabase local. Rien dans le YAML ne permet d'expliquer les jobs sans runner ; aucun changement de workflow n'est justifié sur la seule base de ces échecs.
- Le code Lot 469 est confirmé présent dans `ci/msg-supabase-local-test.mjs` : la résolution de la disponibilité exige à la fois l'ACK `phx_join` listant `public.msg_invites` et le message `system` `postgres_changes/status=ok`. Ce code n'a pas encore été exécuté par GitHub Actions.
- PR #17 reste ouverte et non fusionnée. `main`, les migrations hébergées, Auth/RLS de production, les données réelles et Cloudflare n'ont pas été modifiés. Messenger n'est toujours pas déclaré opérationnel : l'événement INSERT destinataire n'a pas été confirmé.
## Lot 471 — nouvelle tentative ciblée du job Messenger local (14 novembre 2026)

- Après le constat du Lot 470, une seule relance ciblée a été faite sur le job `messenger-supabase-local` de l'exécution `43581342941` (job initial `132406521875`). GitHub a créé la tentative/job `132406991047`.
- Le job est brièvement passé en file d'attente, puis s'est terminé en échec sans étapes disponibles. Les journaux de ce job retournent `BlobNotFound`; aucun runner ni log de démarrage n'est exposé par les interfaces connectées. Cette relance ne valide donc ni n'invalide le test Realtime : le script n'a pas pu être observé en exécution.
- Aucun changement de code ou de configuration CI n'a été effectué : faute de diagnostic exploitable, ne pas bricoler les workflows ni ajouter des runners auto-hébergés. La prochaine action utile est de consulter les détails/annotations de ce Check Run dans GitHub Actions avec un accès administrateur au dépôt, ou de vérifier le service de runners GitHub côté compte.
- PR #17 reste ouverte et non fusionnée ; `main`, Supabase hébergé, les migrations de production, les données élèves et Cloudflare restent inchangés. Messenger reste non certifié opérationnel tant que le vrai `INSERT` n'est pas reçu par le destinataire.
## Lot 472 — contrôle de la tentative 2 et de l'état de la PR (14 novembre 2026)

- Inspection de la tentative 2 du workflow `43581342941` après la relance ciblée : job `132406991047`, `runner_id=0`, `runner_name` vide, `steps=[]`, échec en environ deux secondes. Le journal reste indisponible (`BlobNotFound`). La relance ne fait donc pas avancer l'exécution du test.
- Le check-run du workflow est maintenant en tentative 2 ; la même signature d'échec pré-run persiste. Les cinq workflows du commit initial restent en échec ; aucune preuve ne permet d'accuser le code Messenger ni de confirmer un incident de compte/quota.
- État de la PR #17 revérifié : `open`, `merged=false`, `mergeable=true`, branche `design/prototypes-67-74-alignment`, base `main` au SHA `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`. Le nouveau HEAD est `78a31ac850daf247d16b186ffeb70c069a6a8660`.
- Un Check Run Cloudflare `Workers Builds: allemand` apparaît en succès avec un Build ID de preview `5684d4b5-7cea-4820-9c7c-d453103832c6`. C'est uniquement le statut du build de preview fourni par l'intégration ; aucune action de déploiement ni validation visuelle n'a été effectuée.
- Aucun changement applicatif ou de configuration n'a été fait dans ce lot. `main`, Supabase hébergé, migrations de production, données élèves et déploiement Cloudflare restent hors intervention. Messenger demeure non certifié tant que le test ne reçoit pas le vrai événement `INSERT` côté destinataire.
## Lot 473 — fiabilisation des délais du test Realtime Messenger (14 novembre 2026)

- Relecture ciblée de `ci/msg-supabase-local-test.mjs` : le même délai de 12 secondes couvrait auparavant à la fois l'attente de l'ACK/du signal CDC-ready et l'attente de l'événement INSERT. Si l'abonnement devenait prêt tardivement, le test disposait de moins de 12 secondes pour observer l'invitation ; le message d'erreur pouvait donc être prématuré.
- Correction appliquée : délai CDC-ready de 12 secondes, puis redémarrage d'un délai indépendant de 12 secondes après réception conjointe de `phx_reply` valide et `system postgres_changes/status=ok`. Le diagnostic `realtime.subscription` est exécuté à l'expiration du second délai. Le message précise maintenant que les 12 secondes de réception commencent après CDC readiness.
- Correction complémentaire : une erreur de parsing/traitement d'une trame WebSocket avant l'état prêt rejette désormais `readyPromise` immédiatement (`rejectReady`) au lieu de rejeter uniquement `eventPromise`, ce qui évite d'attendre inutilement le timeout CDC-ready.
- Commit du script : `862046974c35da422c4f4d6c290c426cd44624e0`. Relecture du bloc modifié effectuée sur la branche. Aucune exécution Node ou CI réussie n'est revendiquée : GitHub Actions reste bloqué avant runner et le test doit encore être exécuté.
- Aucun changement des migrations, du client `msg.js`, de Supabase hébergé, des données, Auth/RLS ou Cloudflare. PR #17 reste ouverte et non fusionnée ; `main` non modifiée. Messenger n'est pas déclaré opérationnel tant que l'INSERT destinataire n'a pas été reçu et vérifié.
### Résultat CI du commit Lot 473

- Le changement de `ci/msg-supabase-local-test.mjs` a déclenché les cinq workflows : `43581817328`, `43581817377`, `43581817369`, `43581817332` et `43581817370`. Tous ont échoué en environ une seconde avant la première étape ; l'API Jobs confirme pour chacun `runner_id=0`, `runner_name` vide et `steps=[]`.
- Le nouveau délai distinct CDC-ready/événement n'a donc pas encore été exécuté. Il reste une correction de logique du test, relue dans le dépôt, pas un test validé en CI.

## Lot 474 — validation stricte du type d'événement Realtime (14 novembre 2026)

- Relecture du bloc de réception dans `ci/msg-supabase-local-test.mjs` : le test acceptait un événement ciblé si son type était absent, en le traitant implicitement comme un INSERT. Ce fallback pouvait produire un faux positif si le serveur envoyait une trame incomplète ou différente du protocole attendu.
- Le filtre exige maintenant explicitement `data.type`, `data.eventType` ou `payload.eventType` égal à `INSERT` (insensible à la casse), en plus de l'identifiant destinataire et du statut `pending`. L'assertion ultérieure vérifie toujours que l'UUID reçu est exactement celui créé par la RPC, puis contrôle l'expéditeur.
- Changement limité au harnais de test local avec comptes synthétiques ; aucune modification de `msg.js`, des migrations, des policies, d'Auth/RLS hébergé, des données réelles ou de Cloudflare.
- Vérification disponible à ce stade : diff ciblé relu et prédicat confirmé dans le dépôt. Aucun résultat d'exécution n'est revendiqué : les derniers jobs Actions (ex. run `43581868013`, job `132408113216`) se terminent avant toute étape, sans runner attribué. Il faudra exécuter le test dès qu'un runner démarre réellement.
- PR #17 reste ouverte et non fusionnée. `main` n'a pas été modifiée. Messenger n'est toujours pas certifié opérationnel tant que le vrai événement INSERT n'a pas été reçu par le destinataire synthétique.

### Résultat CI du Lot 474

- Le commit de code `69e59576eccc08db19869cf0c935fd236e3e6200` et la mise à jour du dossier `67d5b48b9c11b1e3d262da337869c6a2e52d7365` ont déclenché les cinq contrôles : CI ALLEMAND `43582007156`, PostgreSQL `ملتقى الطلاب` `43582007232`, Supabase local Messenger `43582007190`, PostgreSQL découverte `43582007137`, PostgreSQL consentement `43582007152`.
- L'inspection directe des cinq objets Jobs confirme la même signature : clôture en deux secondes, `runner_id=0`, `runner_name` vide et `steps=[]`. Le script `node --check` et les tests SQL/Realtime n'ont donc pas été exécutés. Il s'agit d'un échec pré-run commun aux jobs, pas d'un résultat négatif des tests.
- Les Check Runs GitHub n'exposent toujours aucun résumé textuel; l'endpoint des annotations n'est pas accessible via la connexion GitHub disponible. La cause précise du défaut d'affectation reste indéterminée. Ne pas modifier les workflows ni ajouter de runner auto-hébergé sans diagnostic et décision explicites.
- Le prédicat Realtime strict du Lot 474 est présent sur le HEAD, mais non exécuté. Le test exige désormais un type INSERT explicite et l'identité exacte de l'invitation. Messenger reste non certifié opérationnel.
- État final vérifié : PR #17 ouverte, non fusionnée, base `main`, HEAD `67d5b48b9c11b1e3d262da337869c6a2e52d7365`, `mergeable=true` au dernier contrôle. Aucun changement direct sur `main`, aucune migration Supabase hébergée, aucun changement de données réelles et aucun déploiement Cloudflare.

## Lot 475 — nouvelle tentative ciblée du runner GitHub Actions (14 novembre 2026)

- Pour éviter de relancer inutilement les cinq workflows, une seule relance ciblée a été effectuée sur le job Messenger local du run `43582066252` (job initial `132408702929`). GitHub a accepté la relance et créé la tentative 2, job `132408975893`.
- La tentative est passée de `queued` à `completed/failure` en environ deux secondes. Lecture de l'endpoint REST du job : `runner_id=0`, `runner_name=""`, `steps=[]`, label demandé `ubuntu-latest`. Les journaux restent absents (`logs_url=null`).
- Cette répétition confirme que la relance manuelle d'un job unique ne résout pas le défaut d'attribution du runner. Elle ne permet toujours pas d'identifier sa cause exacte (quota, politique, incident GitHub ou autre) ; aucune de ces hypothèses n'est affirmée.
- Aucun changement de workflow, aucune modification de configuration GitHub Actions et aucun runner auto-hébergé n'ont été ajoutés. Le code de test du Lot 474 reste inchangé.
- État PR #17 contrôlé après la relance : ouverte, non fusionnée, base `main`, HEAD `2fa40b1ccfe4b48822020f7b8c7c0adfe5656695`, `mergeable=true` à cet instant. Aucun changement sur `main`, aucune action sur Supabase hébergé ni sur Cloudflare.
- Prochaine action technique : obtenir un diagnostic GitHub exploitable sur l'échec d'allocation de runner ou attendre le rétablissement de l'exécution standard. Ne pas contourner ce blocage en modifiant arbitrairement les workflows ; dès qu'un runner démarre, exécuter le test de bout en bout et confirmer la réception effective de l'INSERT côté destinataire synthétique.


## Lot 476 — protection contre les souscriptions Messenger obsolètes (14 novembre 2026)

- Audit ciblé de `msg.js` : `startChannel(id)` attendait la résolution asynchrone de `window.SB.sb()` sans vérifier si l'utilisateur avait entre-temps quitté le fil ou ouvert une autre conversation. Une résolution tardive pouvait donc créer un canal Realtime inutile et conserver un abonnement obsolète. Le callback INSERT attendait aussi les noms et métadonnées de pièce jointe sans revalider que le fil était toujours actif avant son insertion DOM.
- Correctif appliqué : ajout d'un compteur `channelEpoch`. Chaque fermeture invalide les initialisations en cours ; après la résolution du client Supabase, le code vérifie l'époque et l'identifiant de conversation avant de créer le canal. Le callback INSERT revérifie ces deux conditions après ses appels asynchrones avant de modifier le fil.
- Ce correctif traite une course de cycle de vie côté navigateur. Il ne corrige pas et ne prouve pas la réception CDC côté serveur ; le test d'intégration Supabase local reste la preuve requise pour le transport `public.msg_invites`.
- Validation : relecture statique des points d'entrée et des gardes modifiés. Aucun test JavaScript ou workflow GitHub Actions n'a été exécuté dans cet environnement ; les récents jobs GitHub restent bloqués avant attribution d'un runner. Ne pas présenter ce correctif comme testé en exécution.
- Aucun changement de schéma, migration, Auth/RLS, données hébergées, `main` ou déploiement de production. PR #17 reste ouverte et non fusionnée.


## Lot 477 — protection contre les rendus asynchrones obsolètes (14 novembre 2026)

- Les cinq workflows déclenchés après le Lot 476 ont terminé en échec. L'API des jobs renvoie `steps=[]` pour chacun des cinq jobs ; les journaux ne sont pas disponibles (BlobNotFound). Aucun test applicatif n'a donc été exécuté par ces jobs, et leur conclusion ne permet pas d'attribuer un défaut aux scripts SQL ou au code Messenger.
- Une seconde revue du cycle de vie de `msg.js` a révélé une autre course : `renderThread(id)` attend plusieurs appels asynchrones (session, messages, noms, pièces jointes) avant d'écrire dans `#msgBody`. Si l'utilisateur change de conversation ou revient à la liste pendant ces attentes, un ancien rendu pouvait remplacer la vue plus récente. Le même risque existait entre plusieurs appels concurrents à `renderList()`.
- Correctif appliqué : compteur global `renderEpoch`, invalidation à chaque rendu liste/fil, et contrôles après les attentes asynchrones avant de poursuivre ou d'écrire le DOM. Le fil sélectionné est posé dès l'entrée dans `renderThread`, et l'ancien assignement tardif a été supprimé.
- Commit code : `b51d0386b86d816fa715bb8c965d6aaef5f5e834`.
- Validation : revue statique des ancres modifiées et vérification de présence des contrôles. Aucun test navigateur ni exécution locale n'a été réalisée ; les workflows GitHub précédents n'ont exécuté aucune étape.
- La réception CDC `public.msg_invites` demeure non démontrée. Aucun changement de schéma, migration, Auth/RLS, données hébergées, `main` ou déploiement de production.


### Complément Lot 477 — couverture de tous les appels asynchrones de la liste

- Relecture après le premier commit : `renderList()` comporte aussi des chargements asynchrones des invitations, signalements et file de vérification réservés à certains profils. J'ai ajouté les contrôles `renderEpoch` après chacun de ces appels (y compris entre les deux chargements de modération) pour qu'aucun résultat tardif ne poursuive la construction d'un ancien écran.
- Commit complémentaire code : `c8d9a6b` (voir SHA complet dans l'historique Git de la branche).
- Contrôle : vérification statique des emplacements d'attente et des gardes. Pas d'exécution locale ni navigateur ; CI reste non probante tant que les jobs n'exécutent aucune étape.


## Lot 478 — investigation du blocage GitHub Actions et état PR (14 novembre 2026)

- Vérification du statut public GitHub : le dernier incident public trouvé qui mentionne Actions est celui du 11 novembre 2026 (impact Actions, Pages, Copilot), marqué résolu à 21:21 UTC après traitement du backlog. La page publique ne signale pas, dans les résultats consultés, un incident Actions actif le 14 novembre. Cela n'exclut pas un problème localisé au dépôt, au compte ou à l'attribution de runners.
- Les cinq exécutions déclenchées après Lot 476 (runs `43582584592`, `43582584717`, `43582584720`, `43582584619`, `43582584689`) sont terminées en échec. L'API GitHub retourne `steps=[]` pour les cinq jobs. Les journaux sont absents/BlobNotFound. Il n'y a donc aucune preuve que les commandes de tests aient commencé ; ne pas traiter ces conclusions comme des échecs de tests applicatifs.
- Contrôle des paramètres accessibles : dépôt privé, branche par défaut `main`, accès connecté avec permissions admin/maintain/push. La lecture de `/actions/permissions` n'est pas autorisée par l'interface GitHub disponible ; la lecture de la protection de branche est refusée à l'intégration ; l'endpoint des rulesets renvoie 403 avec indication GitHub Pro ou dépôt public. Ces réponses ne prouvent pas que les Actions sont désactivées ni qu'une limite de minutes est atteinte. Aucun paramètre n'a été modifié.
- PR #17 relue : toujours ouverte, non fusionnée, base `main`, branche `design/prototypes-67-74-alignment`, `mergeable=true` au contrôle ; aucun avis de revue enregistré dans la liste retournée.
- Décision : ne pas ajouter de runner auto-hébergé, ne pas modifier les workflows ou permissions sans diagnostic plus probant. Ne pas relancer les mêmes jobs à répétition tant que l'attribution runner reste le point d'échec. La prochaine vérification utile est de contrôler dans l'interface GitHub du propriétaire du dépôt les paramètres Actions (autorisation des actions, politique de runners hébergés, limites/quota de minutes et éventuelles restrictions organisationnelles), puis faire un seul workflow minimal de diagnostic lorsque ces paramètres sont confirmés.
- Aucun changement de code, workflow, paramètres GitHub, `main`, Supabase hébergé ou Cloudflare dans ce lot. Messenger reste non certifié : réception Realtime réelle non démontrée.


### Complément correctif Lot 478 — architecture Cloudflare–Supabase et état réel du backend (14 novembre 2026)

- Relecture approfondie des audits de sécurité Lots 353–354 et des fichiers runtime actuels. Le Worker principal Cloudflare `allemand` est défini par `wrangler.toml` (entrypoint `src/site-worker.js`, assets statiques via binding `ASSETS`). Il sert le site et, pour l'allowlist des contenus protégés, appelle le Data API Supabase avec les bindings `SUPABASE_URL` et `SUPABASE_ANON_KEY` ainsi que le Bearer JWT de l'utilisateur. Il n'utilise pas de clé `service_role`. Cloudflare est donc le point d'entrée/de distribution edge et porte les bindings de connexion ; le projet PostgreSQL/Auth/Realtime reste le service Supabase connecté, pas une base PostgreSQL hébergée dans le Worker.
- Le workflow `.github/workflows/deploy.yml` est un workflow de validation CI sans job de déploiement ; l'intégration Cloudflare Workers Builds est séparée et automatique. Sur le HEAD documentaire `7197c1bc6eac3e3cdb3feb842a83de797a8dbbf2`, le check Cloudflare `Workers Builds: allemand` est **success**, Build ID `8207e2e3-e133-4d79-9932-3aef64698f64`, URL de preview de la branche `design-prototypes-67-74-alignment`. C'est un build de prévisualisation, pas une preuve de déploiement production ni un test navigateur authentifié.
- Inspection en lecture seule via le connecteur Supabase du projet actif `azjwcybivirvpxbfhyzk` : statut `ACTIVE_HEALTHY`, PostgreSQL 17.6, région `eu-west-2`. L'historique de migrations cloud comprend `20261113201922 multaqa_community_feed`, mais ne comprend pas les migrations Messenger `202611130001_msg_invitation_consent` et `202611130003_msg_student_discovery`.
- Requête de catalogue en lecture seule : `to_regclass('public.msg_invites') IS NULL`; aucune fonction `public.msg_invite_%` trouvée. La publication `supabase_realtime` active contient `public.msg_conversations` et `public.msg_messages`, pas `public.msg_invites`. Le backend cloud ne peut donc pas accepter les RPC d'invitation ni émettre les événements CDC de cette table tant que les migrations 001/003 ne sont pas appliquées.
- Journaux Supabase `realtime_logs` consultés sur la fenêtre disponible : le seul événement retourné est un contrôle de santé `GET /api/tenants/.../health` réussi ; aucun événement de souscription ou d'insertion relatif à `msg_invites` n'est présent. Cela est cohérent avec l'absence de la table en production et ne permet pas de diagnostiquer la panne CDC du test local.
- Distinction de diagnostic désormais obligatoire : (1) Cloudflare preview build : réussi ; (2) Supabase cloud : sain, mais sans migrations Messenger 001/003 ; (3) Supabase local dans GitHub Actions : test de transport CDC bloqué par des jobs qui n'obtiennent pas de runner, aucun test exécuté sur les runs récents. Ne pas mélanger ces trois plans.
- Correction de formulation du Lot 478 : la phrase « aucun déploiement Cloudflare » était trop générale. Le build automatique de preview Cloudflare a bien eu lieu ; aucun déploiement manuel/production n'a été effectué dans ce lot. Les bindings/secrets Cloudflare runtime n'ont pas été lus ni affichés.
- Aucune migration Messenger appliquée au projet Supabase actif, aucune modification de données, Auth, RLS ou paramètres Cloudflare, aucun changement direct sur `main`, PR #17 reste ouverte et non fusionnée.
- Prochaine étape technique : traiter le backend Messenger en deux étapes contrôlées : finaliser la validation des migrations 001/003 et du parcours Realtime dans un environnement de test exécutable, puis planifier leur activation cloud uniquement avec l'autorisation explicite déjà requise. Ne pas continuer à modifier le harnais GitHub sans nouveau signal technique exploitable.


## Lot 479 — prévol réel Supabase et durcissement de la migration découverte (14 novembre 2026)

- Reprise du diagnostic depuis l'architecture Cloudflare–Supabase consignée aux Lots 353–354 et le complément Lot 478. Le build Cloudflare preview est un contrôle distinct de la base Supabase active ; ne pas confondre la réussite du build Worker avec l'installation des migrations SQL.
- Prévol Supabase cloud en lecture seule : les tables prérequises `msg_conversations`, `msg_members`, `msg_blocks` et `profiles) existent ; leurs colonnes utilisées par la migration 001 correspondent aux attentes (IDs UUID, conversation ID bigint, created_by, type, wilaya/niveau/filiere, colonnes de blocage et vérification scolaire). Les helpers historiques `msg_can_dm`, `msg_guard_direct`, `msg_member_ok`, `msg_not_blocked`, `msg_open_direct` et `msg_is_moderator` existent également.
- Comparaison de sécurité ciblée : la définition actuellement installée de `public.msg_can_dm(a,b)` lie explicitement la paire au JWT appelant via `auth.uid() in (a,b)), en plus de la vérification des deux profils vérifiés. La version préparatoire de la migration 003 conservait les critères scolaires et le blocage, mais avait omis cette liaison d'identité présente en production. Même si les RPC prévues contrôlent séparément l'appelant, cette omission affaiblissait inutilement l'invariant de la fonction interne et créait une régression par rapport au helper actif.
- Correctif de sécurité sur la branche : ajout dans `202611130003_msg_student_discovery.sql` de `and auth.uid() in (a, b)` immédiatement après le contrôle non-null de `auth.uid()`. Ajout d'une assertion dans `ci/check-msg.mjs` pour empêcher une future suppression de cette liaison. Vérification statique ciblée : l'expression de contrôle correspond bien à la fonction SQL corrigée et l'assertion est présente.
- Commits : migration `19bebf549c3728d7f02f25cd9c65197b193d2a49` ; assertion CI `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d`.
- Limites de validation : pas d'exécution PostgreSQL ni de workflow GitHub Actions pour ce correctif à ce stade ; seule la vérification statique du texte et de l'expression de contrôle a été faite. Le correctif n'est pas appliqué à Supabase cloud. Les migrations 001/003 restent absentes du journal cloud et ne sont pas appliquées.
- État cloud confirmé : projet Supabase `azjwcybivirvpxbfhyzk` sain ; `msg_invites` et les quatre RPC d'invitation toujours absents ; publication Realtime limitée actuellement à `msg_conversations` et `msg_messages`. Aucune donnée de conversation ou message privé n'a été consultée.
- Cloudflare Workers Build preview du HEAD Lot 478 : success, Build ID `8207e2e3-e133-4d79-9932-3aef64698f64`. Aucun déploiement production ou changement de bindings/secrets.
- PR #17 reste ouverte, non fusionnée, base `main`. Aucun changement direct sur `main`, aucune migration/écriture cloud, aucune modification Auth/RLS ou paiement.


### Résultats d'exécution après le correctif Lot 479
- Sur le commit code `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d`, les cinq jobs GitHub Actions (CI structurelle, Messenger local, consentement PostgreSQL, découverte PostgreSQL, Multaqa PostgreSQL) se sont terminés en échec avec `runner_id=0`, `runner_name=""` et `steps=[]`. Aucune assertion, commande Node ou migration de test n'a été exécutée ; aucune conclusion sur la validité runtime du correctif ne peut être tirée de ces jobs.
- Le check `Supabase Preview` est `skipped` (pas de branche Supabase Preview provisionnée pour cette PR). Le check Cloudflare Workers Builds du commit code `09e3f223`, Build ID `8a1bacf8-de85-44e8-84c1-54300dc756f7`, était encore `in_progress` lors de la dernière lecture ; ne pas le déclarer réussi avant sa conclusion.
- Ces résultats ne changent pas l'état de la base active : migrations Messenger 001/003 absentes et non appliquées. Aucune action cloud ou déploiement production n'a été réalisé.


### Clôture des checks Lot 479 et synchronisation PR
- Le check Cloudflare Workers Builds du commit code `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d` est finalement `success`, Build ID `8a1bacf8-de85-44e8-84c1-54300dc756f7`, preview Cloudflare de la branche PR. Cela valide le build du Worker et des assets pour ce commit, pas le parcours utilisateur authentifié ni les migrations Supabase.
- Le check `Supabase Preview` reste `skipped`.
- Les cinq jobs GitHub Actions restent en échec pré-run sur le commit code : `runner_id=0`, aucune étape. Aucun test n'a exécuté l'assertion Lot 479.
- Après mise à jour du dossier, la lecture REST directe de PR #17 donne `state=open`, `merged=false`, `mergeable=true`, `mergeable_state=unstable`. La branche est en divergence avec `main` (2712 commits en avance côté PR, 4 commits de base non intégrés). Ne pas interpréter `unstable` comme une fusion ou une validation CI ; conserver la PR ouverte et non fusionnée.
- HEAD documentaire : `1cd36accbff5ea9bbb20d4793b1b21dce26b6dd1`. Aucun merge, aucune modification de `main`, aucune migration cloud.


## Lot 480 — confidentialité de l'annuaire Messenger : suppression de l'exposition des UUID élèves (14 novembre 2026)

- Audit ciblé du contrat de découverte (migration 003, wrapper Supabase, UI et tests) : la RPC `msg_student_search` renvoyait directement `profiles.id` sous le champ `student_id`. Le fait de ne pas placer cet UUID dans le DOM ne le protégeait pas : il était déjà livré au navigateur dans la réponse PostgREST. Cela contredisait le contrat de découverte minimale/pseudo-only consigné dans les lots précédents.
- Correction sur la branche : la RPC renvoie maintenant un `student_key` aléatoire, non réversible et à durée de vie de cinq minutes. La table privée `msg_discovery_targets` associe le jeton au compte demandeur et au compte cible ; RLS activée et tous les privilèges retirés à `public`, `anon`, `authenticated`. Les anciennes clés expirées de l'acteur sont nettoyées lors d'une recherche.
- Nouvelle RPC `msg_invite_send_by_key(p_student_key)` : exige une session authentifiée, retrouve le jeton uniquement pour `auth.uid()`, vérifie son expiration puis délègue au contrôle serveur `msg_invite_send`. Un autre compte ne peut pas réutiliser le jeton. Les contrôles de vérification scolaire, blocage bilatéral et quota d'invitations restent exécutés dans la RPC d'origine.
- Le wrapper `supabase/supabase.js` transmet désormais le jeton via `msg_invite_send_by_key`. L'interface `msg.js` ne conserve plus que `student_key` dans `state.peers` et n'envoie plus de UUID cible. Le UUID de l'élève reste uniquement côté serveur dans la table privée de correspondance.
- Tests renforcés : `ci/msg-supabase-local-test.mjs` exige la présence de jetons différents des UUID Auth, vérifie le contrat exact des champs publics, rejette l'utilisation du jeton par un autre compte et envoie une invitation avec le jeton du bon acteur. `ci/check-msg.mjs` vérifie le contrat SQL/client et le branchement UI. Les assertions statiques ont été adaptées au nouveau nom de fonction et au parcours par jeton.
- Vérification textuelle des cinq fichiers après modifications : migration, wrapper, UI, test structurel et test Supabase local. Le seul `student_id` restant dans le parcours de découverte est dans la table privée et dans les opérations SQL internes ; il n'est plus retourné au client. Aucun test d'exécution n'a encore été lancé avec succès : les runners GitHub précédents ne démarraient pas les étapes. Ne pas présenter le correctif comme testé en runtime.
- Le prévol Supabase cloud reste en lecture seule : migration 003 non appliquée, table privée et RPC de jeton absentes de la production tant que la migration n'a pas été activée. Aucun accès ni changement de données réelles. Aucun secret Cloudflare/Supabase lu ou affiché.
- Contrat produit inchangé : seuls les élèves vérifiés du même niveau, filière et wilaya sont découvrables ; la découverte n'ouvre pas un DM ; l'invitation nécessite toujours le consentement explicite du destinataire.


### Complément Lot 480 — rétention des jetons et résultat des workflows
- Durcissement complémentaire de la rétention : ajout d'un index dédié sur `expires_at` et nettoyage des jetons expirés de tous les acteurs à chaque nouvelle recherche. Cela évite de conserver indéfiniment les correspondances expirées des comptes qui ne reviennent pas dans l'annuaire. Assertion correspondante ajoutée dans `ci/check-msg.mjs`.
- Dernière exécution des cinq workflows sur le premier commit de Lot 480 : `43583691064` consentement PostgreSQL, `43583691047` validation structurelle, `43583691045` découverte PostgreSQL, `43583691040` Multaqa PostgreSQL, `43583690984` Messenger local. Tous sont en échec avant exécution : `runner_id=0`, aucun runner et `steps=[]`. Les tests d'intégration n'ont donc pas validé ce lot en runtime.
- Le check Cloudflare de la version antérieure du code (Lot 479) a réussi ; aucun résultat Cloudflare n'est revendiqué pour les derniers commits du Lot 480 tant qu'un check correspondant n'a pas été relu.
- Aucun changement sur Supabase cloud, aucun déploiement production et aucune modification de secrets/bindings Cloudflare. Migrations 001/003 toujours préparées uniquement sur la branche.


### Clôture des contrôles Lot 480
- Les cinq workflows relancés sur le HEAD documentaire `10ca9ccc3e4187e5033e59a8e0ebc33278b4f778` (`43583756048` découverte PostgreSQL, `43583755998` validation structurelle, `43583755968` consentement PostgreSQL, `43583756023` Messenger local, `43583756009` Multaqa PostgreSQL) ont tous échoué avant la première étape : `runner_id=0`, `steps=[]`. Aucun résultat d'exécution SQL/Node ne valide ni n'invalide le nouveau parcours opaque.
- Le check Supabase Preview reste `skipped` : aucune branche Supabase Preview n'est associée à cette PR. Il n'y a donc pas de base preview Supabase pour exécuter les migrations dans cette PR.
- État de PR #17 vérifié après les commits : ouverte, non fusionnée, `mergeable=true`, `mergeable_state=clean`, branche `design/prototypes-67-74-alignment`, base `main`. HEAD documentaire `10ca9ccc3e4187e5033e59a8e0ebc33278b4f778`.
- Lot 480 est un correctif de confidentialité préparé, pas une mise en production. Les migrations Messenger restent non appliquées sur le projet Supabase cloud ; aucun déploiement Cloudflare production, aucun changement sur `main`, aucune modification de secrets/bindings.


### Rectification de méthode — aucune branche Supabase payante (14 novembre 2026)
- La proposition de créer une branche Supabase facturée à l'heure était une erreur de reprise de contexte. Elle est retirée : la contrainte « aucun coût / aucun service payant » était déjà explicitement enregistrée aux Lots 439–440. Ne jamais reproposer une branche ou un projet Supabase payant pour les tests Messenger.
- La solution gratuite déjà définie et partiellement exécutée est la pile Supabase locale éphémère lancée dans GitHub Actions : Supabase CLI épinglée à `2.122.1`, Docker fourni par le runner, GoTrue + JWT synthétiques, PostgREST/RLS, PostgreSQL local et Realtime local. Les migrations 001 et 003 sont appliquées uniquement à cette base jetable du workflow ; elles ne touchent pas au projet cloud. Cette architecture a déjà démarré et validé les tests HTTP/RPC/RLS dans les Lots 456 et 459 ; le dernier point restant est la réception CDC de l'événement Realtime.
- Les échecs actuels des workflows avec `runner_id=0` et `steps=[]` sont un problème d'attribution du runner GitHub, pas une raison de créer une branche Supabase. Les Lots 467–478 demandent de ne pas multiplier les relances ni de bricoler les workflows sans diagnostic. Les précédentes exécutions où un runner avait été attribué prouvent que le banc local a déjà fonctionné.
- Alternative locale gratuite déjà prévue dans les Lots 439–440 : exécuter le même harnais sur la machine de développement existante avec Docker, sans service cloud supplémentaire. Aucun achat, branche payante, nouveau projet, migration de production ou modification des secrets n'est nécessaire.
- La demande de confirmation de création d'une branche Supabase payante posée après le Lot 480 est annulée. La suite reprend le banc local gratuit existant et résout le blocage runner/Realtime sans facturation.

## Lot 481 — diagnostic des exécutions GitHub Actions et continuité du banc local gratuit (14 novembre 2026)

- Reprise à partir du HEAD de la branche `design/prototypes-67-74-alignment`, sans recommencer les lots précédents.
- PR #17 vérifiée : état `open`, fusionnée = `false`, base = `inconnue`, HEAD = `non exposé`. La PR reste ouverte et non fusionnée ; aucune action de fusion/fermeture n'a été effectuée.
- Les runs associés au commit de continuité `8a55482ece551c5335ea72ada9414adfcb423eb4` incluent :
  - `43584029260` — Tests intégration Supabase local — Messenger ;
  - `43584029258` — CI — ALLEMAND ;
  - `43584029216` — Tests PostgreSQL isolés — découverte Messenger ;
  - `43584029259` — Tests PostgreSQL isolés — ملتقى الطلاب ;
  - `43584029305` — Tests PostgreSQL isolés — consentement Messenger.
- Pour les trois premiers runs inspectés, GitHub retourne des jobs terminés en échec mais sans étapes (`steps=null`). La récupération des journaux de jobs renvoie `BlobNotFound`. Cela ne prouve pas une défaillance des tests : aucune étape de test n'est disponible à examiner. Ne pas classer ces exécutions comme des échecs SQL, RLS ou Realtime.
- Le workflow local gratuit reste inchangé : Supabase CLI épinglée à `2.122.1`, pile locale éphémère, comptes GoTrue synthétiques, PostgREST/JWT/RLS/PostgreSQL/Realtime ; aucune branche Supabase hébergée, aucun service payant.
- Relecture statique des fichiers `ci/msg-supabase-local-test.mjs`, `.github/workflows/msg-supabase-local-test.yml`, `ci/msg-supabase-local-bootstrap.sql`, migrations Messenger 001/003 et `ci/check-msg.mjs). Le test Realtime attend toujours à la fois l'ACK de jointure et le signal système `postgres_changes` avant de démarrer le délai de réception INSERT. Aucune preuve nouvelle ne permet de déclarer la réception Realtime réparée.
- La migration 003 continue de remplacer l'identifiant Auth exposé par un jeton opaque de découverte lié à l'acteur et valable cinq minutes. Les vérifications de ce lot sont statiques ; aucune exécution locale du banc n'a été possible depuis les runs sans étapes.
- Aucun changement de code, de schéma, de données, d'Auth, de RLS, de Realtime ou de secrets en production. Aucune migration 001/003 appliquée à Supabase actif. Aucun changement sur `main`.
- Prochaine action : rétablir un environnement d'exécution GitHub Actions qui fournit réellement un runner et des journaux, ou exécuter le même banc sur la machine de développement existante avec Docker. Une fois un runner opérationnel, reprendre par le workflow local Messenger et examiner les logs Realtime complets ; ne pas relancer aveuglément des lots ni modifier le protocole à partir d'une exécution sans étapes.

## Lot 482 — contrôle du workflow local et limites d'exécution disponibles (14 novembre 2026)

- Inspection du workflow `.github/workflows/msg-supabase-local-test.yml` : il cible explicitement `ubuntu-latest`, utilise Node 22, Supabase CLI `2.122.1`, démarre la pile Supabase locale, applique les migrations Messenger 001/003 uniquement à cette base éphémère, puis lance `ci/msg-supabase-local-test.mjs`. Les étapes de diagnostic `if: always()` capturent les slots, connexions PostgreSQL et journaux du conteneur Realtime.
- Les workflows PostgreSQL isolés utilisent également `ubuntu-latest` et un service PostgreSQL 17. Aucun runner auto-hébergé n'est requis par leur configuration. Les échecs sans étapes observés ne révèlent donc pas un défaut SQL ou une mauvaise configuration de service ; ils se produisent avant le démarrage des étapes du job.
- Vérification de l'environnement d'exécution disponible pour cette session : Node.js `v22.16.0` est présent, mais Docker et Supabase CLI ne sont pas installés et le dépôt n'est pas cloné dans cet environnement. Il est donc impossible d'exécuter honnêtement ici le banc Supabase local ou d'affirmer une validation runtime.
- Aucun changement apporté au workflow, aux migrations, à la configuration Supabase, aux secrets ou aux données. Aucun nouveau lancement aveugle des workflows.
- Conclusion opérationnelle : le code du workflow est configuré pour un runner GitHub hébergé standard ; le blocage actuel est la fourniture d'un runner/journaux par les exécutions GitHub observées. La voie gratuite prévue reste inchangée : attendre que GitHub fournisse un runner normal, ou utiliser la machine de développement existante avec Docker et le même banc local. Il n'y a aucun besoin de créer une branche Supabase hébergée ni d'activer une facturation.
- État PR #17 : ouverte, non fusionnée ; base `main`. Ne pas fusionner avant validation visuelle et runtime requise.

## Lot 483 — confirmation du dernier preview Cloudflare et nouvel échantillon des runs CI (14 novembre 2026)

- HEAD de la PR #17 : `e4897668821635d9c3259f37bc78c89052c464dc`; état `open`, fusionnée = `false`, base `main`. La PR reste ouverte et non fusionnée.
- Le commentaire automatique Cloudflare sur la PR confirme que le commit `e4897668821635d9c3259f37bc78c89052c464dc` a été construit et déployé avec succès en preview. URL stable de preview affichée : `https://design-prototypes-67-74-alignment-allemand.bridrandomtv.workers.dev`. Cela confirme la livraison du bundle Worker en environnement preview, pas le fonctionnement du flux Messenger ni une validation de production.
- Runs PR déclenchés sur ce HEAD :
  - `43584505476` — tests PostgreSQL isolés ملتقى الطلاب ;
  - `43584505462` — intégration Supabase local Messenger ;
  - `43584505589` — PostgreSQL consentement Messenger ;
  - `43584505565` — PostgreSQL découverte Messenger ;
  - `43584505558` — CI ALLEMAND.
- Inspection des jobs pour Messenger local (`132416011278`), CI (`132416011996`) et découverte PostgreSQL (`132416011348`) : tous sont terminés en échec avec `steps=null` et `logs_url=null`. Aucun script, commande ou étape de test n'a été exécuté selon les données disponibles. Ce nouvel échantillon confirme le blocage en amont de l'exécution ; il ne constitue pas un résultat de test applicatif.
- Relecture complémentaire du script d'intégration : le scénario synthétique ouvre le WebSocket avec le JWT du destinataire, attend l'ACK du canal et l'état système `postgres_changes`, vérifie l'accès RLS du destinataire, crée l'invitation via RPC, attend l'INSERT correspondant, puis annule l'invitation. Le test inclut également l'usage du jeton opaque de découverte, lié à l'acteur.
- Aucun changement de code ou de configuration déclenché par ce lot ; aucune migration Messenger appliquée en production, aucune modification Auth/RLS/Realtime/secret, aucun coût, aucun changement sur `main`.
- Conclusion : le preview Cloudflare de la branche est disponible ; le test Messenger Realtime reste non validé, car le runner GitHub n'a toujours pas fourni d'étapes ni de journaux. Reprendre dès qu'un run fournit un job réellement exécuté, ou depuis le poste local avec Docker et le banc gratuit existant. Ne pas assimiler le succès Cloudflare preview à une validation Messenger.

## Lot 484 — correction d'une assertion CI obsolète pour les invitations Messenger (14 novembre 2026)

- Audit croisé des sources actuelles `supabase/supabase.js`, `msg.js`, `ci/check-msg.mjs`, `ci/msg-supabase-local-test.mjs` et de la migration de découverte.
- Défaut confirmé : `msgInviteSend` accepte maintenant `studentKey` et appelle `msg_invite_send_by_key(p_student_key)`, mais un contrôle statique du lot précédent cherchait encore l'ancienne signature `msgInviteSend(recipientId)` et l'ancien RPC `msg_invite_send`. Ce contrôle aurait rejeté la nouvelle implémentation au prochain passage réel de la CI.
- Correction limitée dans `ci/check-msg.mjs` : assertion alignée sur la signature `studentKey` et sur l'appel RPC `msg_invite_send_by_key`. Les contrôles de versions CSS/JS ont été comparés aux références courantes de `index.html` et `sw.js` et restent cohérents (CSS v202, Messenger JS v3520).
- Commit de code : `705f30be460e4c195e976b7a49d7d363c1b75128`.
- La suite locale Supabase n'a pas été exécutée dans cet environnement : Docker et Supabase CLI ne sont pas disponibles ici. La correction est une mise en cohérence du test statique, pas une preuve de réception Realtime.
- Les workflows associés à ce commit ne sont pas encore retournés par l'API au moment de la rédaction. Aucun résultat d'exécution n'est revendiqué.
- Aucun changement de migration, schéma, données, Auth, RLS, publication Realtime ou secret en production ; aucun service payant ; aucun changement sur `main`.
- La PR #17 reste le seul canal de travail et doit rester ouverte/non fusionnée jusqu'à validation visuelle et fonctionnelle explicite.


## Lot 485 — jetons de découverte à usage unique (14 novembre 2026)

- Audit du flux de découverte Messenger : le jeton opaque était lié au compte demandeur et expirait après cinq minutes, mais pouvait être rejoué plusieurs fois pendant sa période de validité.
- Migration `202611130003_msg_student_discovery.sql` : ajout de `used_at` à `msg_discovery_targets` ; `msg_invite_send_by_key` consomme maintenant le jeton par un `UPDATE ... WHERE used_at IS NULL ... RETURNING` atomique. Un rejeu, un jeton expiré ou un jeton d'un autre acteur est rejeté. Si l'envoi de l'invitation échoue, la transaction annule également la consommation.
- Test d'intégration `ci/msg-supabase-local-test.mjs` : ajout d'un test négatif qui rejoue le même jeton après son premier usage et attend un refus.
- Contrôle statique `ci/check-msg.mjs` : assertions sur la consommation atomique et le test de rejeu.
- Commits code : migration `eddf385f3a4658b41825e68c0cd5581a8fe36e3d` ; test `5105a74df5f8de9638a70fc13eea57752888a7d1` ; contrôle statique `d184ac7d0078397294c5c5b9aaacd9c33fe3e7ec`.
- Les fichiers ont été relus sur la branche après écriture : les trois modifications sont présentes. La validation SQL/PostgreSQL réelle reste en attente d'un runner GitHub fonctionnel ; aucune exécution locale Docker n'est possible dans l'environnement actuel.
- Aucun déploiement de migration sur Supabase actif, aucun changement Auth/RLS/données/Realtime de production, aucun secret modifié, aucun service payant. `main` reste inchangée.
- PR #17 vérifiée après les commits : ouverte, non fusionnée, cible `main`, fusionnabilité signalée true.
- Les workflows observés sur le commit précédent `0ebabf0` ont échoué avant leurs étapes (`steps=null`) ; aucun runner n'a été attribué. Les commits de ce lot nécessitent encore leur propre exécution CI pour valider les tests.


## Lot 486 — cohérence des retours d'expiration (14 novembre 2026)

- Audit du cycle de vie : les RPC `msg_invite_decline` et `msg_invite_cancel` effectuaient d'abord la transition `pending → expired` pour une demande de plus de sept jours, puis retournaient `FOUND` après une seconde mise à jour `pending → declined/cancelled`. Cette seconde mise à jour ne trouvait aucune ligne ; l'API retournait donc `false` alors que l'expiration avait bien été enregistrée.
- Correction dans `202611130001_msg_invitation_consent.sql` : capture du `ROW_COUNT` de la première mise à jour et retour `true` si la transition vers `expired` a modifié une ligne. Le traitement des demandes encore valides reste inchangé.
- Ajout dans `ci/msg-invitation-postgres-test.sql` de deux scénarios isolés : annulation par l'expéditeur d'une demande expirée et refus par le destinataire d'une demande expirée. Ils vérifient le retour positif et le statut final `expired`.
- Contrôle statique `ci/check-msg.mjs` : assertions sur les deux RPC et lecture explicite du fichier SQL PostgreSQL. Une première révision de ce contrôle a omis la déclaration de `postgresSql`; elle a été corrigée avant clôture du lot.
- Commits : migration `c99f65a1cf4eb8bb8d9bce37bab7c2168e3739d7` ; tests PostgreSQL `0bf98985d55cb8f5745b80ab9255bab0dc0ccd98` ; assertions CI `40eec72b31f8b2699e81c93ce52df89857250d46` ; correction de la déclaration du fichier de test `f899f3d293e5b9b12059286475ab9c9dad092145`.
- Vérification GitHub : modifications relues sur la branche. L'exécution réelle PostgreSQL n'a pas été réalisée dans cet environnement ; les nouveaux tests attendent un runner disponible. Ne pas présenter les assertions statiques comme une validation runtime.
- Aucune migration appliquée au projet Supabase actif ; aucun changement de données, Auth, RLS, publication Realtime ou secret en production. Aucun service payant.
- PR #17 reste ouverte et non fusionnée, cible `main`. Aucun changement sur `main`.


## Lot 487 — idempotence des invitations et contrôle du quota (14 novembre 2026)

- Audit du cycle d'acceptation : les acceptations réciproques acquièrent le même verrou transactionnel de paire avant le verrou de ligne. La relecture `FOR UPDATE` vérifie le statut après attente. L'annulation/refus d'une invitation donnée se sérialise avec l'acceptation via le verrou de ligne PostgreSQL ; ce contrôle statique ne remplace pas un test concurrent à deux sessions.
- Défaut corrigé dans `msg_invite_send` : la recherche d'une invitation déjà pendante intervient désormais avant le contrôle du quota de 20 créations sur 24 h. Une répétition idempotente ne consomme pas une nouvelle création et ne doit pas échouer au plafond.
- Test ajouté à `ci/msg-invitation-postgres-test.sql` : crée une demande pendante, ajoute 20 invitations antérieures dans la fenêtre, puis vérifie que le même appel renvoie le même UUID. Les lignes de surcharge sont vieillies après le test afin de ne pas perturber les scénarios suivants.
- Assertions statiques renforcées dans `ci/check-msg.mjs`.
- Contrôle final de la migration : deux fonctions PL/pgSQL (`msg_invite_decline` et `msg_invite_cancel`) utilisaient un délimiteur dollar incomplet (`

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


## Lot 439 — contrôle des déclencheurs et concurrence des invitations (13 novembre 2026)
- Catalogue Supabase lu en SELECT uniquement : politiques RLS réelles confirmées sur msg_conversations, msg_members et msg_messages. La policy msg conv creation est permissive et autorisait historiquement type=direct; msg members ajout s'appuie bien sur msg_member_ok. Les noms ciblés par la migration correspondent aux politiques actives.
- Déclencheur existant msg_tr_direct exécutant msg_guard_direct confirmé. La garde existante exige que le créateur soit le premier membre, limite le DM à deux membres et appelle msg_can_dm pour le second. msg_can_dm impose auth.uid() dans la paire et vérifie les deux profils scolaires au statut verifie. Le nouveau déclencheur de consentement est ajouté en complément, sans supprimer le garde historique.
- Deux risques de concurrence corrigés dans la migration préparatoire : verrou transactionnel par expéditeur avant le comptage des invitations sur 24 h; verrou transactionnel par paire avant le verrou de ligne d'invitation lors de l'acceptation. L'ordre du verrou de paire avant le FOR UPDATE évite le deadlock lorsque les deux élèves ont envoyé une invitation réciproque.
- Après acceptation, une éventuelle invitation réciproque encore pending est annulée afin qu'elle ne reste pas affichée comme demande active après création du DM.
- Contrôles statiques ajoutés dans ci/check-msg.mjs pour les verrous, l'ordre des verrous et l'annulation réciproque. Vérification locale des motifs statiques : délimiteurs SQL appariés, absence de terminateur isolé, verrous et assertions présents. Cela ne remplace pas une exécution PostgreSQL.
- Aucun environnement PostgreSQL isolé n'est disponible dans les outils de cette session. La liste des branches Supabase ne contient que main; la création d'une branche de développement peut entraîner une facturation horaire. Conformément à la contrainte de gratuité, aucune branche/projet n'a été créé.
- Aucun DDL/DML n'a été exécuté sur Supabase actif; aucune donnée personnelle, aucun contenu de message et aucun compte n'ont été lus ou modifiés. La migration reste non appliquée.
- Commit de code Lot 439 : 612e4d7a9ce3c22b51f529fb1a537652341502c2 (verrous initiaux), f8e6dca8344d9e8ebf4171a2b6e2be6ecc1fd41e (ordre de verrouillage), 6acd5519de7cb86f077ad441ecf60025635d83d6 (délimiteur SQL), 79cbc3992802d1b2a54c8c2e6456195db4d78948 (tests statiques).
- État PR #17 au dernier contrôle : ouverte, non fusionnée, mergeable=true, base main, HEAD 79cbc3992802d1b2a54c8c2e6456195db4d78948. Aucun workflow CI associé n'est retourné par GitHub pour ce commit.
- Prochaine étape sûre : faire exécuter les tests d'intégration PostgreSQL sur une machine/environnement local gratuit contrôlé par le propriétaire, sans Supabase production; ensuite seulement câbler l'écran arabe des invitations entrantes et sortantes.


## Lot 440 — expiration robuste et notifications Realtime des invitations (13 novembre 2026)
- Nouveau point de logique détecté : une invitation restée pending plus de 7 jours pouvait bloquer une nouvelle demande identique à cause de l'index unique partiel, et l'idempotence pouvait retourner indéfiniment cette ancienne demande. Correction dans msg_invite_send : les invitations sortantes pending de plus de 7 jours sont passées à expired avant la vérification d'idempotence.
- Les RPC de refus et d'annulation passent également une demande ancienne à expired au lieu de lui attribuer un faux statut declined/cancelled. L'acceptation conserve son retour NULL pour une invitation expirée et enregistre bien l'état sans lever d'exception qui annulerait la transaction.
- Realtime : le catalogue actif confirme que la publication supabase_realtime existe et publie déjà msg_messages, mais pas msg_invites. La migration préparatoire ajoute désormais msg_invites à cette publication de manière conditionnelle. La policy SELECT RLS de la table ne laisse voir que les invitations où auth.uid() est expéditeur ou destinataire; les événements Realtime sont donc limités par cette policy.
- CI statique complétée pour la publication Realtime, la policy participant, les états expirés et les contrôles de concurrence.
- Vérification des motifs statiques sur le dernier contenu : aucune clôture SQL isolée; délimiteurs de fonctions appariés; bloc DO Realtime apparié; contrôles expiration, verrouillage et policy participant présents. Ce contrôle de texte ne vaut pas compilation ni exécution PostgreSQL.
- Commits récents : f96ae0f28e321682d8e0dc35d6fa800d88bd6012 (expiration des anciennes demandes), 17fd8a2d6b6ec09445e1f55e4723578542b82c5e (assertions expiration), 316828610b729f5508c149388143f5158baa35e6 (délimiteurs RPC), 8387888b552d3c9673f13bda862b02730acfe478 (Realtime), 5f56ac9afbcd2423517bc9c02f729fd7721b93a7 (assertions Realtime), 87d1a783d2da1a4e13ff9cdf8cc2241438bf4265 (délimiteurs du bloc DO).
- Toujours aucune migration exécutée sur Supabase actif. Aucun environnement de test gratuit existant n'a été trouvé : la seule branche Supabase listée est main. Ne pas créer de branche/projet payant.
- État PR #17 au dernier contrôle : ouverte, non fusionnée, mergeable=true, base main, HEAD 87d1a783d2da1a4e13ff9cdf8cc2241438bf4265. Aucun workflow CI associé retourné pour le commit.
- Étape suivante : fournir un harnais d'intégration exécutable sur PostgreSQL local gratuit (ou machine de développement existante) et obtenir un résultat réel avant toute application cloud; ensuite intégrer les abonnements Realtime d'invitations et les panneaux arabes الواردة / المرسلة.


## Lot 441 — interface pédagogique professionnelle de la messagerie (13 novembre 2026)
- Recomposition de l'accueil réel de الرسائل : bandeau éditorial pédagogique, compteurs calculés exclusivement à partir des groupes et conversations réellement retournés par Supabase, recherche, filtres, repères d'usage scolaire et cartes mieux hiérarchisées.
- Les groupes affichent les métadonnées réellement disponibles (wilaya, niveau, filière, dernier échange). Les conversations privées ne révèlent plus leur identifiant technique dans le titre visible.
- Correction du libellé de groupe qui appelait une chaîne comme une fonction, ainsi que du sélecteur de délégation de clic : les boutons de filtre étaient affichés mais non interceptés par le gestionnaire global.
- Ajout d'un traitement CSS ciblé, RTL, responsive et compatible avec les thèmes clair/sombre. Aucun framework ni dépendance ajoutés.
- Cache actualisé : msg.js?v=3515, style-prototype-dz.css?v=198, service worker dz-de-v3.185.0.0.149.
- Aucun faux message, faux contact, faux compteur ou faux contenu pédagogique n'est injecté : les compteurs sont dérivés des résultats réels des fonctions existantes.
- Limites fonctionnelles inchangées : les invitations de conversation et les nouvelles règles de consentement restent indisponibles tant que la migration préparée n'a pas été testée dans PostgreSQL puis appliquée avec autorisation. Le forum ملتقى الطلاب reste une interface sans backend de publication.
- Aucun changement Auth, RLS, schéma actif, paiement, données Supabase, main ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.


## Lot 442 — écran de conversation Messenger (13 novembre 2026)
- Refonte de l'écran intérieur des conversations : barre de retour, en-tête de dialogue sans identifiant technique visible, présence, zone de lecture distincte, bulles entrantes/sortantes, horodatage, signalement, aperçus de pièces jointes et compositeur de message.
- Styles RTL responsives, thèmes clair/sombre, hauteur de fil adaptée aux écrans mobiles. Les mécanismes existants de lecture, envoi, Realtime, pièces jointes et signalement sont conservés.
- Recherche accessible : le libellé aria-label garde l'expression « ابحث في محادثاتي ومجموعاتي » tout en précisant les nouveaux critères.
- Cache : msg.js?v=3516, style-prototype-dz.css?v=199, service worker dz-de-v3.185.0.0.150.
- CI : correction du test de blocage bilatéral afin qu'il vérifie la condition réellement implémentée dans msg_is_member (DM + msg_pair_blocked sur le membre pair). Synchronisation des assertions de précache.
- Aucun message fictif ajouté. Aucun changement de schéma actif, Auth, RLS, données Supabase, paiement, main ou déploiement. PR #17 reste ouverte et non fusionnée. Migration des invitations toujours non appliquée.


## Lot 443 — application du modèle communautaire professionnel à la vue réelle (13 novembre 2026)
- Application du modèle de composition du prototype à la vue réelle `data-view="multaqa"` : fil principal prioritaire, panneau latéral de profil/navigation et panneau de découverte regroupés en seconde colonne, au lieu de trois colonnes étroites.
- Hiérarchie visuelle renforcée : bandeau d'accueil, cartes, profil communautaire, navigation, composition de publication, état vide et découverte. Les couleurs DZ, les thèmes clair/sombre et les styles RTL sont conservés.
- Responsive revu : tablette avec fil en premier puis panneaux latéraux en deux colonnes; mobile en une colonne avec actions pleine largeur. Le CSS est strictement ciblé sur `section[data-view="multaqa"]`.
- Aucun profil, publication, commentaire, réaction ou compteur fictif ajouté. Le bouton de publication reste désactivé tant que le service de publication n'existe pas. Le message d'état vide continue d'expliquer que le fil n'est pas raccordé à la base.
- Cache CSS mis à jour à `style-prototype-dz.css?v=200`; service worker `dz-de-v3.185.0.0.151`.
- Correction du contrôle statique Messenger : l'expression régulière de l'assertion de blocage bilatéral avait des échappements doublés et ne reconnaissait pas la fonction SQL réellement présente. L'assertion vérifie maintenant `msg_is_member`, le type direct et `msg_pair_blocked(uid,peer.user_id)`.
- Contrôle forum synchronisé avec le véritable état vide de l'interface, au lieu d'exiger un ancien avertissement de maquette supprimé.
- Aucun changement Supabase, SQL appliqué, Auth, RLS, données, paiement, `main` ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Validation visuelle dans un navigateur non effectuée à ce stade; la CI du nouveau commit doit encore être consultée avant toute déclaration de réussite.


## Lot 444 — audit du backend communautaire et première migration préparatoire (13 novembre 2026)
- Relecture du dossier et des Lots 432/434/413 avant toute nouvelle intervention. Le Lot 443 reste la dernière refonte visuelle ; aucune publication réelle n'était raccordée.
- Audit du catalogue Supabase en SELECT uniquement : aucune table ni RPC publique existante correspondant à ملتقى الطلاب, forum, posts, commentaires, réactions, relations sociales ou communauté. Aucun contenu d'élève ni aucune ligne de profil/message n'a été lu.
- Métadonnées profiles confirmées : id, pseudo, role, niveau, filiere, wilaya, created_at, verif_statut, verif_by, verif_at, matricule, section. La table accorde SELECT à authenticated et comporte plusieurs policies de visibilité. En conséquence, le fil ne doit jamais sélectionner la ligne profiles entière : les RPC préparées ne projettent que pseudo.
- Aucun champ de suspension propre à profiles n'a été trouvé dans le catalogue consulté. Le contrôle préparé exige une session Supabase et profiles.role='eleve', sans abonnement ni vérification scolaire. La gestion d'une suspension applicative doit être confirmée avant activation si elle existe hors de cette table.
- Création sur la branche de supabase/migrations/202611130002_multaqa_community_feed.sql : tables posts/commentaires/réactions/signalements, RLS activée, accès REST direct révoqué, RPC de lecture paginée, publication, commentaire/réponse, réaction, signalement et suppression de ses propres contenus. Quotas préparés : 10 publications, 30 commentaires et 20 signalements par 24 h, avec verrous transactionnels par compte.
- Les publications ne sont pas encore reliées à l'interface. Le HTML conserve l'état vide transparent tant que la migration n'est pas testée puis appliquée. Aucun contenu de démonstration n'est ajouté.
- ci/check-multaqa.mjs renforcé pour vérifier la présence des tables/RLS, l'absence d'accès REST direct, les RPC, le rôle élève, la projection pseudo et les quotas. ci/check-msg.mjs corrigé pour attendre les caches réellement présents après le Lot 443 (msg.js?v=3516, CSS v200, service worker .151).
- Correctifs CI de synchronisation : commit 1c82c77c795e14a3929b97becf633d1ed97a08bd ; migration forum : a8344ea02a35a5102917b9a46e7f1f1676ce4161 ; assertions CI : ec20bb475af878da4f18f3da5ed105dbb3267916 ; quota signalements : 15c827df57ab4ab008038db84d1013986616151f.
- Validation non acquise : aucun PostgreSQL isolé disponible/confirmé ; la migration n'a pas été compilée ni exécutée sur une base de test. La CI du commit ec20bb4 était encore en attente lors du contrôle ; le commit courant après ajout du quota doit également recevoir son run. Ne pas annoncer le backend prêt ni appliquer la migration à Supabase actif.
- Aucun DDL/DML sur Supabase actif, aucune modification Auth/RLS/Storage/Realtime/paiement en production, aucune lecture de données personnelles, aucun changement main, aucune fusion ni déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Étape suivante : obtenir le résultat CI du HEAD courant, faire une revue SQL ciblée et un test PostgreSQL réel multi-comptes sans données réelles ; ensuite seulement câbler le client ملتقى الطلاب aux RPC et demander une autorisation distincte avant toute application sur Supabase actif.

### Addendum Lot 444 — cohérence CI du portail public
- La CI #3523/#3524 a ensuite révélé que ci/check-public-portal.mjs attendait encore style-prototype-dz.css?v=197 et le service worker dz-de-v3.185.0.0.147. Ces références étaient dépassées par le Lot 443.
- Assertions et messages de contrôle synchronisés vers CSS v200 et service worker .151 dans le commit e135a23cb09484dd163220da8fe798146231d239.
- Run CI #3526 associé à ce HEAD : en attente au moment de cette note. Ne pas déclarer la validation globale réussie avant son résultat.

### Addendum Lot 444 — contrôle d'accès rectifié après confrontation à la décision produit
- La lecture de LOT-413 a mis en évidence une divergence dans la première version de la migration : elle laissait accéder au fil personnel aux comptes non vérifiés. Ce n'était pas conforme à la décision produit (fil personnel réservé aux élèves vérifiés ; comptes en attente limités aux annonces institutionnelles/aide, hors périmètre de cette première tranche).
- Le catalogue Supabase a confirmé par contrainte CHECK les valeurs exactes de verif_statut : non_verifie, en_attente, verifie, rejete ; valeur par défaut non_verifie. Aucune ligne de profil n'a été lue.
- Migration corrigée : les six RPC de lecture/interactions (fil, commentaires, création publication, création commentaire, réaction, signalement) exigent role='eleve' ET verif_statut='verifie'. L'abonnement n'est pas vérifié. La suppression de ses propres contenus reste possible à un élève auteur même si sa vérification a été révoquée, pour permettre le retrait de son contenu.
- ci/check-multaqa.mjs vérifie maintenant les six contrôles verif_statut et la séparation entre vérification scolaire et abonnement. Commit migration : 750c1b1b8c585380bbae69255dcc71c9de3b3665 ; CI : e99d0625b3f6240d35fd34c3ecfe2ba752e6e775.
- La CI #3527 a échoué sur ci/check-masar.mjs, qui attendait encore CSS v196 ; correction vers v200 commit 8466b426f827cb1eadb2aa19328e776588cdc8a5. Le résultat du run déclenché pour ce correctif doit être suivi.

- Suite au run #3528, le contrôle Masar a révélé une seconde attente périmée dans le même script : le service worker .147. Le contrôle a été aligné sur .151 dans le commit 55e705be78acaed4ff8a4a19a5ec06b260aeac2b. Le run #3529, lancé avant ce second correctif, a reproduit ce défaut ; il ne valide donc pas le commit correctif. Attendre le run suivant pour juger.

### Addendum Lot 444 — premier raccordement du client du fil
- Création de multaqa.js : client de la vue ملتقى qui appelle exclusivement les RPC multaqa_feed, multaqa_comments, multaqa_create_post, multaqa_create_comment, multaqa_toggle_reaction et multaqa_report. Les contenus utilisateurs sont échappés avant rendu HTML. Le client vérifie le rôle élève et verif_statut='verifie' avant d'afficher le fil personnel ; la sécurité réelle reste dans les RPC.
- index.html remplace le formulaire factice désactivé et l'état statique par un conteneur mtqApp ; le module gère l'état de service non activé sans fausses données. Aucun enregistrement n'est créé tant que la RPC serveur n'existe pas.
- Les publications du flux exposent un booléen my_post pour distinguer le propriétaire sans divulguer son Auth ID. La projection publique conserve le pseudo seulement.
- style-prototype-dz.css reçoit les styles du fil dynamique ; cache CSS v201. sw.js passe en dz-de-v3.185.0.0.152 et précache multaqa.js?v=1. Les contrôles check-public-portal, check-masar, check-msg et check-multaqa ont été synchronisés avec ces versions et le client RPC.
- Correction du contrôle d'accès : conformément au Lot 413, le fil personnel est réservé aux élèves vérifiés ; les comptes en attente/non vérifiés ne peuvent pas voir le contenu personnel. L'abonnement n'intervient pas dans cette décision.
- Limites actuelles : aucun test navigateur visuel/exécution réelle de bout en bout ; migration toujours non appliquée ; pas de test PostgreSQL multi-comptes ; les fonctions de fichiers/images, groupes, الزمالة, modération administrative et Realtime ne sont pas dans cette première tranche.
- Aucun DDL/DML exécuté sur Supabase actif, aucune lecture de contenu d'élève, aucune modification de main, aucune fusion PR #17, aucun déploiement.

- Revue complémentaire des privilèges RPC : chaque fonction préparée révoque maintenant explicitement EXECUTE à PUBLIC, anon et authenticated avant le GRANT ciblé à authenticated. Le contrôle CI vérifie cette révocation préalable. Commits : migration 94d1a288af26dec4207956abd190e1c3e2d57a53 ; assertion CI ca709b02450b988091c8be6f268b694507627392.
- Le client dynamique reste un raccordement préparatoire : l'appel RPC renverra une erreur explicite tant que la migration n'est pas appliquée. Aucun test réel de navigateur ou PostgreSQL n'a encore été effectué.

- Le contrôle `ci/check-multaqa.mjs` n'était pas appelé par le workflow CI actif. Pour éviter un contrôle isolé non exécuté, il est maintenant importé à la fin de `ci/check-msg.mjs`, étape effectivement exécutée par le workflow `CI — ALLEMAND`. Commit : 79af97adc3a697e22864478604a76fd3ae9e17b0. Les assertions locales sur les fichiers confirment : 8 contrôles de rôle, 6 contrôles de vérification, 8 révocations RPC explicites, échappement des contenus, client précaché et intégration du contrôle au pipeline. Ces vérifications statiques ne remplacent pas l'exécution Node complète du workflow ni les tests PostgreSQL.
- Une autre référence de cache v196 a été trouvée dans `ci/check-gamification.mjs` et corrigée vers v201 (commit a64d5389681f428dbf00ecd510c93ab40f246076). Le workflow courant doit confirmer la disparition de cette assertion obsolète.

- Le contrôle communautaire intégré à check-msg inclut désormais `node --check multaqa.js` afin que la CI valide aussi la syntaxe du nouveau client (commit d1efbfc58bd5b5f7c21c0abe3bb8c0e3fa79cd4f). Le workflow doit encore terminer sur le HEAD final.


## Lot 445 — validation CI du premier raccordement communautaire (13 novembre 2026)
- Le workflow GitHub Actions #3552, déclenché sur le HEAD `fac74e314273782f09d7a6f4800aca2efa00c98e`, est terminé avec la conclusion **success**.
- Le job « Validation structurelle & pédagogique » a exécuté avec succès l'étape « Valider les accès et la navigation de ملتقى الطلاب » (étape 35), ainsi que les étapes de syntaxe JavaScript, de validation des contenus et les autres contrôles du workflow.
- La vérification communautaire inclut maintenant le contrôle de syntaxe réel `node --check multaqa.js`, les appels RPC attendus, l'échappement HTML, les garde-fous rôle/vérification, RLS, révocations de privilèges, projection pseudo et précache du client.
- PR #17 contrôlée après le run : toujours `open`, `merged=false`, `mergeable=true`, HEAD `fac74e314273782f09d7a6f4800aca2efa00c98e`. Aucune fusion.
- **Portée exacte de ce succès : CI structurelle/statique uniquement.** Il ne prouve ni la compilation/exécution de la migration PostgreSQL, ni les autorisations multi-comptes à l'exécution, ni le rendu visuel dans un navigateur, ni le fonctionnement du fil sur le site.
- La migration `202611130002_multaqa_community_feed.sql` reste préparée dans GitHub et non appliquée. Aucun DDL/DML, Auth, RLS, donnée ou paramètre de Supabase actif n'a été modifié.
- Prochaine étape : obtenir une validation PostgreSQL réelle sans utiliser la base active et sans créer de branche/projet payant. Tant qu'aucun environnement de test gratuit contrôlé n'est disponible, conserver le fil en état explicite « service non activé » plutôt que prétendre que les publications fonctionnent.
- Aucun changement sur `main`, aucune fusion PR #17, aucun déploiement Cloudflare.


## Lot 446 — préparation contrôlée de l'activation PostgreSQL de ملتقى الطلاب (13 novembre 2026)
- Accord utilisateur reçu pour préparer l'activation sur le projet Supabase gratuit existant. Cet accord n'autorise ni la migration Messenger, ni une modification de main, ni une fusion, ni un déploiement Cloudflare.
- Préflight en lecture seule sur le projet actif `azjwcybivirvpxbfhyzk` : connexion confirmée ; tables `profiles`, `msg_conversations`, `msg_members`, `msg_blocks` présentes ; colonnes `profiles.id/role/verif_statut/pseudo` présentes ; contrainte CHECK de `verif_statut` cohérente avec les quatre valeurs documentées.
- Historique Supabase : aucune migration communautaire `multaqa` enregistrée. Les quatre tables `multaqa_posts/comments/reactions/reports` et les RPC `multaqa_*` n'existent pas encore. Aucun profil, message, contenu d'élève ou enregistrement métier n'a été lu.
- Revue des dépendances : `auth.users` est la cible des clés étrangères ; `profiles` fournit rôle, statut de vérification et pseudo. Les dépendances structurelles requises sont présentes. Les migrations Messenger restent distinctes et non appliquées.
- Création d'un test PostgreSQL isolé dans GitHub Actions : `ci/multaqa-postgres-test.sql` et `.github/workflows/multaqa-postgres-test.yml`. Le workflow démarre un PostgreSQL 17 jetable, construit uniquement des comptes synthétiques, applique la migration communautaire dans cette base éphémère et teste privilèges, refus anon/non-élève/non-vérifié, fil, publication, commentaire, réaction, signalement et suppression auteur.
- Commit du test SQL : `00e0e718bcd0de05f5289963d8fc3220688338ce`. Commit du workflow : `52fade90b98d8da16901d1d787addd1191aeca93`. Run GitHub Actions #1 : `43499787337`, statut en cours au moment de cette note ; ne pas déclarer le test réussi avant conclusion GitHub.
- Le projet Supabase actif n'a subi aucune écriture : migration non appliquée, aucun DDL/DML, aucune modification RLS/Auth/Realtime, aucun changement Messenger. Aucun coût ou projet payant ajouté.
- Blocage avant activation réelle : attendre le résultat du test PostgreSQL isolé et corriger tout échec. Même après réussite, confirmer explicitement l'application de la migration sur le projet Supabase actif avant exécution ; cette note ne vaut pas autorisation d'appliquer la migration.
- PR #17 : toujours ouverte, non fusionnée ; branche `design/prototypes-67-74-alignment`, HEAD `52fade90b98d8da16901d1d787addd1191aeca93`, base `main`. Aucun déploiement Cloudflare.


### Addendum Lot 446-B — résultat du test PostgreSQL isolé
- Le run GitHub Actions #1 `43499787337` du commit `52fade90b98d8da16901d1d787addd1191aeca93` est terminé avec la conclusion **success**.
- Le job a exécuté avec succès la migration communautaire dans PostgreSQL 17 éphémère, puis les assertions de privilèges (aucun accès direct aux tables, RPC non exécutables par anon), accès élève vérifié, refus des comptes en attente/non-élèves/sans identité, publication, lecture du fil, commentaire, réaction, signalement et suppression par l'auteur.
- Ce résultat valide la syntaxe et les scénarios couverts par le test isolé ; il ne remplace pas un test réel avec JWT/Supabase Auth, ni la vérification navigateur, ni les tests de charge/concurrence complets.
- Un second run du même workflow est en cours sur le commit documentaire `29041aeacc9f4bfdad6053230d1b6c7526ccb51d` ; suivre son résultat avant de conclure le pipeline du HEAD.
- La migration n'a toujours pas été appliquée au projet Supabase actif. Toute application en production reste une opération DDL distincte qui nécessite une confirmation explicite ; aucun changement Auth, RLS, données, Messenger ou Realtime n'a été fait.


## Lot 447 — application contrôlée de la première migration de ملتقى الطلاب (13 novembre 2026)
- Confirmation explicite de l'utilisateur reçue pour appliquer uniquement la migration communautaire sur le projet Supabase gratuit existant. La confirmation ne couvre ni la migration Messenger, ni les changements Auth hors de ce périmètre, ni une fusion ou un déploiement.
- Vérification juste avant exécution : historique Supabase sans migration multaqa antérieure ; aucune table `multaqa_posts`, `multaqa_comments`, `multaqa_reactions`, `multaqa_reports` ni RPC `multaqa_*` préexistante. Aucun conflit d'objet détecté.
- Application réussie via l'opération de migration Supabase, enregistrée sous `20261113201922_multaqa_community_feed`. Le lot crée quatre tables, leurs index, active RLS, révoque tout accès REST direct aux tables pour `anon` et `authenticated`, puis expose huit RPC SECURITY DEFINER exclusivement à `authenticated`.
- Vérification post-application en lecture seule : les quatre tables sont présentes et RLS est activée ; SELECT/INSERT/UPDATE/DELETE directs sont refusés à anon et authenticated ; les huit RPC ont EXECUTE refusé à anon et accordé à authenticated ; les huit fonctions sont SECURITY DEFINER. L'historique Supabase contient maintenant la migration `multaqa_community_feed`.
- Les garde-fous serveur contrôlent `auth.uid()`, `profiles.role='eleve'` et `profiles.verif_statut='verifie'` pour le fil, la publication, les commentaires, les réactions et les signalements. Aucun abonnement n'est exigé. Les RPC de lecture ne projettent que le pseudo public et les champs du contenu.
- Le test PostgreSQL 17 isolé du Lot 446 avait réussi sur des comptes synthétiques avant cette application. Il valide les scénarios inclus dans le harnais, mais ne prouve pas encore le fonctionnement réel avec JWT/Supabase Auth dans le navigateur.
- Aucun profil, compte, message privé, contenu scolaire existant ou autre donnée métier n'a été lu ou modifié. Aucune migration Messenger, modification de paiement, Storage, Auth, Realtime ou table existante n'a été appliquée.
- État produit : **backend de base installé**, mais l'expérience complète n'est pas encore déclarée opérationnelle. Étape suivante obligatoire : vérifier le raccordement de `multaqa.js` aux RPC dans une session élève vérifié réelle, contrôler l'affichage et les erreurs dans le navigateur, puis tester publication/commentaire/réaction/signalement avec des comptes de test autorisés. Aucun contenu fictif ne doit être ajouté.
- PR #17 reste ouverte et non fusionnée, base `main`. Aucun changement sur `main`, aucune fusion et aucun déploiement Cloudflare.


## Lot 448 — fiabilisation du démarrage du fil communautaire (13 novembre 2026)
- Revue du raccordement réel entre `multaqa.js`, `app.js` et le module ES Supabase : le client communautaire était chargé avant l'initialisation asynchrone de `window.SB`. Une navigation très rapide pouvait donc produire un faux état d'indisponibilité, alors que le client finissait ensuite son initialisation.
- Correction de `multaqa.js` : attente explicite de l'événement `dz:sbready` avec délai maximal de 12 secondes, contrôle de disponibilité des méthodes `sb/me/myProfile`, distinction d'une erreur de lecture de profil d'une absence de profil, et reprise du rendu si la vue ملتقى est déjà ouverte au chargement du module.
- Cache client incrémenté à `multaqa.js?v=2`, précache synchronisé et Service Worker porté à `dz-de-v3.185.0.0.153`.
- Contrôles CI synchronisés : vérification de l'attente Supabase, de la version v2 du client, du précache et de l'état réel « migration appliquée » dans l'en-tête SQL. Le contrôle Messenger a également été synchronisé sur le Service Worker v153.
- Le test PostgreSQL 17 isolé du workflow dédié reste distinct du test réel avec session JWT dans un navigateur. Aucun compte de test élève réel n'a été utilisé, aucune publication ni aucun commentaire n'a été créé sur la base active.
- Les workflows déclenchés sur les commits intermédiaires ont montré un échec transitoire du contrôle Messenger dû à une seconde assertion restée sur le Service Worker v152 ; assertion corrigée vers v153. Ne considérer le lot validé qu'après conclusion positive des workflows sur le HEAD final.
- Aucun changement de schéma Supabase dans ce lot ; aucune donnée élève ou message privé lue/modifiée ; aucune migration Messenger ; aucune fusion PR #17 ; aucun déploiement Cloudflare.


### Clôture du Lot 448 — contrôles finaux
- Les premières exécutions de CI ont révélé trois assertions de version restées en v152 dans les contrôles check-public-portal.mjs, check-masar.mjs et check-msg.mjs. Elles ont été synchronisées sur le Service Worker v153 ; aucun code métier de ces modules n'a été modifié pour contourner les tests.
- Sur le commit 3dcc929ca18f9d4a665b45b27be200d8c981dec7, les trois contrôles décisifs sont terminés avec succès : Validation structurelle & pédagogique, multaqa-postgres (PostgreSQL 17 isolé) et Workers Builds: allemand.
- Le contrôle dédié « Contrôler les accès et la navigation de ملتقى الطلاب » est success dans la CI générale. Le test PostgreSQL isolé a également terminé success sur le même commit.
- Le build Cloudflare associé au commit est validé. Cela ne vaut pas approbation de fusion ni autorisation de déploiement manuel ; PR #17 demeure ouverte, non fusionnée, base main.
- Le dernier commit documentaire de ce dossier peut déclencher une nouvelle exécution CI ; les résultats cités ci-dessus portent précisément sur le commit de code 3dcc929.
- Le point restant pour qualifier l'expérience de réellement opérationnelle est un test de bout en bout dans le navigateur avec une session d'élève vérifié autorisée. Aucun compte réel n'a été utilisé pour publier ou commenter pendant ce lot.


## Lot 449 — carte de profil réelle dans ملتقى الطلاب (13 novembre 2026)
- Revue de la vue `multaqa` : la carte latérale affichait encore un message périmé (« le profil apparaîtra après liaison du service »), alors que la lecture du profil via le client Supabase existait déjà.
- La carte a maintenant des cibles DOM identifiées et reçoit après contrôle serveur le pseudo du compte courant et, si disponible, le niveau 2AS/3AS. Elle n'affiche pas de nom réel, d'adresse, de wilaya ni d'identifiant ; aucun profil d'un autre élève n'est interrogé.
- Les comptes non connectés, non élèves ou non vérifiés n'obtiennent pas la carte personnelle ni le fil ; la règle serveur reste inchangée.
- Version client passée à `multaqa.js?v=3`, précache Service Worker synchronisé, version `dz-de-v3.185.0.0.154`. Assertions CI ajoutées pour le rendu du profil et synchronisées avec le client v3.
- Les premiers contrôles CI ont détecté des assertions de cache encore en v2 dans `check-multaqa.mjs` et une assertion v153 dans `check-masar.mjs`. Ces références ont été corrigées ; ne déclarer le lot validé qu'après les workflows sur le HEAD final.
- Aucun changement Supabase, aucune lecture de données d'élèves autres que les champs du profil courant via le mécanisme existant, aucune publication de test, aucune modification Messenger, aucune fusion ni déploiement manuel.
- Le test navigateur avec une session élève vérifiée reste requis pour confirmer visuellement la carte et les opérations réelles du fil.

### Clôture du Lot 449 — validation CI finale
- Les premières exécutions ont signalé deux assertions de cache encore en v2 dans `check-multaqa.mjs` ; correction effectuée en ciblant les assertions exactes. Une assertion Masar v153 avait également été synchronisée en v154 avant la validation finale.
- Sur le commit de code `4c404e87117be6e2c46a94a1e90373120fa9f881`, les trois contrôles requis sont **success** : `Validation structurelle & pédagogique`, `multaqa-postgres` (PostgreSQL 17 isolé) et `Workers Builds: allemand`.
- Le test PostgreSQL isolé confirme encore la migration et les scénarios d'accès synthétiques ; il ne teste pas l'affichage du pseudo dans un vrai navigateur.
- PR #17 reste ouverte, non fusionnée et mergeable, base `main`. Aucun déploiement manuel ni modification Supabase.
- La validation visuelle et fonctionnelle avec un compte élève vérifié réel reste le seul point de contrôle bloquant avant de qualifier l'expérience utilisateur de bout en bout.


## Lot 450 — harmonisation Messenger et vérification scolaire gratuite (13 novembre 2026)
- Correction d'une contradiction produit repérée dans le parcours réel Messenger : l'écran et le client exigeaient encore un numéro d'abonnement actif pour déposer une demande de vérification scolaire.
- Le formulaire demande désormais le numéro d'inscription scolaire et précise explicitement que la vérification est gratuite. Le client ne consulte plus la table des abonnements et dépose le statut en_attente ainsi que le numéro et la section sur le profil du compte connecté. La décision finale reste réservée à l'équipe d'administration ; aucun statut verifie n'est attribué automatiquement.
- Harmonisation visuelle ciblée du centre Messenger : barre de recherche, filtres, titres de sections, cartes de groupes/conversations, boutons et variantes clair/sombre/mobile. Le comportement des groupes, conversations, filtres et contrôles existants est conservé ; aucune fonction de recherche nationale n'est revendiquée.
- Cache : msg.js?v=3517, style-prototype-dz.css?v=202, Service Worker dz-de-v3.185.0.0.155.
- CI statique actualisée pour exiger la vérification gratuite et les nouvelles références de cache. Les contrôles finaux doivent être confirmés sur le HEAD documentaire final.
- Aucun SQL, changement RLS/Auth, aucune donnée Supabase, aucun abonnement, aucun profil d'élève, aucun message privé, main, fusion ou déploiement manuel n'a été modifié.
- Limite de sécurité : la demande client réutilise la mise à jour de profil déjà présente dans le parcours historique. Avant toute fusion/déploiement, confirmer que la policy RLS active n'autorise que le titulaire à déposer sa propre demande et que seul un rôle autorisé peut faire passer en_attente à verifie ou rejete. Aucun audit RLS supplémentaire ni test navigateur réel n'est revendiqué dans ce lot.


### Complément de validation Lot 450 — 13 novembre 2026
- Après les premiers échecs CI, inspection des logs a isolé des assertions historiques de cache restées sur CSS v201 et Service Worker v154. Les contrôles check-gamification.mjs, check-masar.mjs et check-public-portal.mjs ont été synchronisés sur CSS v202 et SW v155 ; les contrôles métier n'ont pas été désactivés.
- Le contrôle check-masar.mjs garde volontairement masar.js?v=3516, qui est bien la référence réelle présente dans index.html et sw.js.
- Les premières relances sur les commits intermédiaires ont encore échoué sur une assertion Masar v154, puis cette assertion a été corrigée précisément. Le commit de correction est 994d808e33fe03e2170e178e10b7b59434f1f4fe; les workflows CI et PostgreSQL 17 correspondants sont en cours au moment de cette note.
- Diagnostic catalogue Supabase strictement SELECT-only sur pg_policies et pg_trigger pour public.profiles : policy update own limitée à la ligne auth.uid() = id, et trigger profiles_tr_verif qui autorise le titulaire uniquement à déposer une demande depuis non_verifie ou rejete vers en_attente, sans lui permettre de passer à verifie; la décision reste modérateur/admin autorisé. Aucun enregistrement de profil n'a été lu.
- La vérification scolaire gratuite du Lot 450 est donc compatible avec les protections existantes constatées ; aucune migration ni modification RLS n'est requise pour ce flux.
- PR #17 reste ouverte, non fusionnée, base main; aucun changement direct sur main, aucune écriture Supabase, aucun déploiement manuel. Le test navigateur réel avec compte élève vérifié et la confirmation de prévisualisation à jour restent à effectuer.


## Lot 451 — cohérence finale du parcours de vérification gratuite (13 novembre 2026)
- Relecture du code réel après le Lot 450 : la demande côté client utilise bien le champ `profiles.matricule`, passe uniquement le profil connecté à `en_attente`, et ne consulte aucune table d'abonnement. Le contrôle catalogue RLS/trigger déjà documenté confirme que l'élève ne peut pas s'attribuer le statut `verifie`; aucune nouvelle lecture de données personnelles n'a été faite.
- Trois anciens libellés visibles dans `msg.js` continuaient néanmoins à dire « numéro d'abonnement » (étapes d'accueil, rejet de demande, libellé de la file de modération). Ils ont été remplacés par « numéro d'inscription scolaire » pour rendre l'interface cohérente avec le parcours gratuit.
- Le contrôle CI `ci/check-msg.mjs` a été renforcé pour empêcher la réapparition des anciens libellés payants et vérifier la mention de gratuité. Une première exécution intermédiaire a détecté une variable de test mal nommée (`msg` au lieu de `msgjs`); elle a été corrigée avant le contrôle du HEAD final.
- Cache mis à jour après modification de `msg.js` : `msg.js?v=3518`, Service Worker `dz-de-v3.185.0.0.156`, précache synchronisé dans `sw.js`, `index.html` et les assertions CI correspondantes. CSS professionnel reste `style-prototype-dz.css?v=202`.
- Le modèle visuel Messenger déjà intégré conserve son bandeau, ses statistiques issues des données réelles, la recherche locale dans les conversations chargées, les filtres, les cartes et les variantes responsive/clair/sombre. Il ne constitue pas un annuaire national et n'ajoute aucun faux profil ni compteur.
- Aucun changement Supabase actif, aucune écriture RLS/Auth, aucune migration Messenger, aucune donnée élève ou conversation privée consultée, aucune modification de `main`, aucune fusion ni déploiement manuel.
- Les workflows CI et PostgreSQL 17 isolés déclenchés sur les commits précédents ont été suivis ; le contrôle final doit être jugé uniquement sur le HEAD après correction `3eb3817851270e40b9b501436f3014c2728536f5` et après clôture de ses workflows. Le test navigateur réel et la prévisualisation à jour restent à confirmer.
- PR #17 reste ouverte et non fusionnée. Le dernier contrôle API avant le Lot 451 indiquait `mergeable=true`; vérifier à nouveau l'état après le dernier commit.


### Complément Lot 451 — clôture du contrôle CI (13 novembre 2026)
- Le workflow CI sur le commit `4e97f46040fa4835ae4de4f53ccae9e2116eb8c1` a échoué sur une référence de variable erronée dans `ci/check-msg.mjs` (`msg` au lieu de `msgjs`). Le test PostgreSQL 17 isolé du même HEAD a réussi.
- Correction exacte dans le commit `aefad2f9694841a1b01247b190784d11fcee05b8`. Le CI a ensuite révélé une assertion de cache historique dans `ci/check-masar.mjs`, qui attendait encore le Service Worker v155 alors que le code est en v156.
- Assertion synchronisée sur v156 dans le commit `bf977125f6240e8e562d11fdc7bac487416f9995`; aucune vérification métier n'a été supprimée ou contournée.
- CI — ALLEMAND : run `43507427751`, réussite sur le HEAD `bf977125f6240e8e562d11fdc7bac487416f9995`. Les contrôles Messenger, Masar, portail public, sécurité d'accès, navigation Multaqa et contrôle pédagogique sont réussis.
- Tests PostgreSQL isolés — Multaqa : run `43507427746`, dernière observation pendant la phase de nettoyage des conteneurs; attendre la conclusion terminale avant de déclarer le test réussi.
- Aucun changement Supabase actif, aucune migration Messenger exécutée, aucun message privé ni profil élève consulté, aucun déploiement manuel, aucune fusion et aucun changement direct sur `main`.
- PR #17 reste ouverte et non fusionnée, branche `design/prototypes-67-74-alignment`, base `main`. Le test navigateur réel avec compte élève vérifié et la confirmation de prévisualisation Cloudflare du HEAD courant restent à faire.


## Lot 452 — centre des invitations Messenger (13 novembre 2026)
- Ajout côté client dans `supabase/supabase.js` des fonctions de lecture des invitations participantes et des RPC `msg_invite_send`, `msg_invite_accept`, `msg_invite_decline`, `msg_invite_cancel`. Les changements de statut passent exclusivement par les fonctions serveur prévues dans la migration de consentement; aucun INSERT/UPDATE direct sur `msg_invites`.
- Ajout dans `msg.js` d'un centre des invitations entrantes et sortantes : le destinataire peut accepter ou refuser, l'expéditeur peut annuler, et une conversation acceptée peut être rouverte. L'identité de l'autre participant et ses UUID ne sont pas affichés dans la carte; seules les dates et les états sont montrés.
- Le texte de l'interface précise que l'acceptation d'une invitation de conversation privée ne crée pas automatiquement une relation de `زمالة`. Aucun annuaire d'élèves ni recherche par UUID n'a été ajouté : le parcours d'envoi depuis une fiche élève reste à raccorder à une source de profils publics autorisée.
- Si la table d'invitations ou ses RPC ne sont pas disponibles, l'interface affiche une indisponibilité explicite et ne prétend pas qu'une demande a été créée. La migration `202611130001_msg_invitation_consent.sql` reste NON appliquée à Supabase; le centre ne sera réellement opérationnel qu'après activation approuvée et testée de cette migration.
- Cache : `msg.js?v=3519`, Service Worker `dz-de-v3.185.0.0.157`; précache et contrôles `check-msg.mjs`, `check-masar.mjs`, `check-public-portal.mjs` synchronisés. CSS inchangé `style-prototype-dz.css?v=202`.
- CI renforcée pour vérifier la présence des quatre RPC côté client, des trois actions d'invitation dans l'interface et la séparation explicite entre `زمالة` et conversation privée.
- Aucun SQL exécuté, aucune écriture Supabase, aucun changement RLS/Auth, aucun accès aux messages privés ou aux lignes de profils, aucun déploiement manuel, aucune modification de `main`, aucune fusion de PR #17.
- Tests GitHub du HEAD de ce lot à suivre jusqu'à conclusion terminale. Prévisualisation Cloudflare et test navigateur authentifié non confirmés.


### Validation finale Lot 452 — 13 novembre 2026
- Le client `supabase/supabase.js` ayant reçu les nouvelles fonctions d'invitation, son cache a également été incrémenté : `supabase.js?v=3521` dans `index.html` et le précache.
- Références finales : `msg.js?v=3519`, `supabase.js?v=3521`, Service Worker `dz-de-v3.185.0.0.158`, CSS `style-prototype-dz.css?v=202`. Les assertions CI Messenger, Masar et portail public sont synchronisées.
- CI — ALLEMAND : run `43509116776`, succès sur le commit de code `ebcc980da2fe2af8ca4763886b76c90a1e425305`.
- Tests PostgreSQL 17 isolés — Multaqa : run `43509116739`, succès sur le même commit. Ces tests portent sur le forum; ils ne valident pas la migration Messenger non appliquée.
- Une exécution CI intermédiaire sur `ec97ca503aa06763bb1bb4c214e6d37cbd6649ba` a échoué parce que le contrôle du portail attendait encore la version SW v157 alors que le précache était déjà en v158. Le contrôle a été synchronisé dans le commit final `ebcc980da2fe2af8ca4763886b76c90a1e425305`, dont la CI complète est verte.
- Ces résultats ne constituent ni un test navigateur réel, ni une confirmation de prévisualisation Cloudflare actualisée, ni une validation du backend Messenger en production.

## Lot 453 — découverte sécurisée des élèves et invitation Messenger (14 novembre 2026)
- Audit du parcours existant : la lecture des profils des membres d'une conversation (fetchNames) n'est pas un annuaire ; elle ne doit pas être réutilisée pour rechercher librement des élèves.
- Nouvelle migration préparatoire supabase/migrations/202611130003_msg_student_discovery.sql, dépendante de 202611130001_msg_invitation_consent.sql et du schéma Messenger existant. **Migration non appliquée sur Supabase.**
- Correction serveur importante : msg_can_dm(a,b) exige désormais deux comptes role='eleve', deux identités verif_statut='verifie', une même wilaya, un même niveau et une même filière, ainsi qu'aucun blocage bilatéral. L'ancienne fonction ne vérifiait que la classe commune ; le contrôle de vérification est donc désormais imposé au niveau SQL, et non seulement dans l'interface.
- RPC msg_student_search(text,integer) : recherche sur le pseudo uniquement, requête de 3 à 40 caractères, résultats limités à 15, uniquement élèves vérifiés partageant la même classe scolaire ; champs retournés : identifiant technique (utilisé en mémoire par le client), pseudo, niveau, filière et wilaya. Aucun e-mail, nom réel ou numéro d'inscription retourné.
- Protection anti-scraping : quota de 8 recherches par compte sur une fenêtre de 10 minutes, verrou consultatif et table de compteur inaccessible directement aux rôles anon/authenticated. Aucun annuaire global ni export.
- Client supabase/supabase.js : ajout de msgStudentSearch() via RPC exclusivement.
- Interface msg.js : recherche en arabe depuis la vue « الرسائل », résultats limités, action « إرسال طلب محادثة ». L'UUID du destinataire reste dans une table d'état JavaScript éphémère (state.peers) et n'est pas injecté dans le DOM ; l'envoi passe par msgInviteSend() et reste soumis au consentement du destinataire.
- Tests ajoutés dans ci/msg-discovery-postgres-test.sql et intégrés au test PostgreSQL éphémère existant ci/multaqa-postgres-test.sql : paire vérifiée autorisée, compte non vérifié refusé, compte non élève refusé, profil hors classe exclu, recherche trop courte refusée, quota dépassé refusé, table de quota et fonction interne non exposées.
- Nouveau workflow préparatoire .github/workflows/msg-discovery-postgres-test.yml également ajouté ; le workflow PostgreSQL déjà présent dans la PR reste la voie de test déclenchée sur la PR.
- Cache actualisé : msg.js?v=3520, supabase/supabase.js?v=3522, service worker dz-de-v3.185.0.0.159 ; contrôles check-msg, check-masar et check-public-portal synchronisés.
- **Limites de validation :** aucune exécution navigateur réelle, aucun compte élève réel utilisé, aucune migration Messenger appliquée, aucun déploiement Cloudflare. Les tests PostgreSQL doivent réussir dans GitHub Actions avant de considérer le SQL validé.
- Aucun accès à des messages privés ni lecture de profils réels. Aucun changement sur main. PR #17 doit rester ouverte et non fusionnée.

### Validation finale du Lot 453 — 14 novembre 2026
- Deux premiers essais du nouveau test PostgreSQL ont échoué sur des délimiteurs PL/pgSQL mal formés dans les scripts de test ; les blocs DO ont été corrigés, puis les tests ont été relancés. Ces échecs concernaient les scripts de test isolés, pas une base Supabase.
- Sur le commit code d60638f197db67dee2826e19dddf94c5b075a62e :
  - CI — ALLEMAND run 43531607530 : **success**.
  - Tests PostgreSQL isolés — découverte Messenger run 43531607736 : **success**.
  - Tests PostgreSQL isolés — ملتقى الطلاب run 43531607933 : **success**.
- Ces tests s'exécutent sur PostgreSQL 17 éphémère. Ils valident le contrat de recherche et les contrôles de privilèges dans un environnement isolé ; ils ne prouvent pas encore le comportement sur les JWT réels du projet Supabase ni le parcours navigateur.
- Le module client et le formulaire de recherche sont prêts dans la branche. Tant que les migrations Messenger 001 et 003 ne sont pas appliquées, le serveur de production ne connaît pas les RPC d'invitation/recherche : l'interface doit afficher un état d'indisponibilité et ne doit pas prétendre envoyer une invitation.
- PR #17 reste ouverte, non fusionnée ; aucune modification de main, aucun déploiement Cloudflare et aucune écriture sur Supabase.


## Lot 454 — harnais PostgreSQL isolé du cycle de consentement Messenger (14 novembre 2026)
- Ajout de `ci/msg-invitation-postgres-test.sql` et du workflow `.github/workflows/msg-invitation-postgres-test.yml`, exécuté sur PostgreSQL 17 jetable dans GitHub Actions.
- Le harnais reconstitue les tables et fonctions historiques minimales (comptes/profils synthétiques, conversations, membres, blocages et garde DM historique), puis exécute la migration préparatoire `202611130001_msg_invitation_consent.sql`.
- Scénarios exercés : envoi sans création prématurée de DM, refus d'une acceptation par l'expéditeur, acceptation par le seul destinataire, création d'un DM avec exactement deux membres, idempotence de l'acceptation, annulation par l'expéditeur, refus par le destinataire, impossibilité d'accepter une demande refusée, révocation de l'ancienne RPC directe et refus de l'INSERT direct de conversation.
- Commits du harnais : `1d22d9d06f0641ab11131fc94ef81e5dc5e61516` (test + workflow), `b0788c60a5b1db7cf3184b1b0beab449e5fbc9a1` (modélisation de l'ancienne policy d'adhésion avant migration).
- Workflow GitHub Actions : run `43532909278`, déclenché sur PR #17 et toujours en cours au moment de cette mise à jour. **Aucun succès PostgreSQL du Lot 454 n'est encore revendiqué.** Si le run échoue, lire le journal, corriger le test ou la migration sur la branche puis relancer.
- L'audit du parcours client confirme que la vue distingue les demandes entrantes/sortantes, réserve accepter/refuser au destinataire et annuler à l'expéditeur, et n'assimile pas l'acceptation à une création de زمالة. Le client n'écrit pas directement dans les tables d'invitations.
- Les migrations `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` restent préparées dans Git uniquement et **non appliquées** à Supabase. Aucune écriture Supabase, aucun accès aux messages privés réels, aucun déploiement Cloudflare.
- PR #17 reste ouverte, non fusionnée, cible `main`; HEAD observé : `b0788c60a5b1db7cf3184b1b0beab449e5fbc9a1`. Aucun changement direct sur `main`.

### Correctif de validation Lot 454
- Premier run `43532909278` : échec au démarrage du harnais, avant l'exécution de la migration, sur un délimiteur dollar du stub `msg_member_ok` tronqué dans le fichier de test. Ce résultat ne signale pas un défaut de la migration Messenger.
- Correctif du fichier de test : `dafa489353a1862adcfab0dcb700f4677344ad48`. Le bloc PL/pgSQL a été remis en `$$ ... $$`.
- Le workflow doit être relu sur le nouveau HEAD avant de déclarer le test réussi. Le Lot 454 reste non validé tant que cette exécution n'est pas terminée.


### Suite du Lot 454 — expiration et blocage bilatéral (14 novembre 2026)
- Après correction du harnais SQL (commit `1284f614b89784c1c04b0988deeea8bffbfd1d5b`), les quatre workflows ont réussi : CI principale run `43534924307`, tests consentement Messenger run `43534924354`, tests découverte Messenger run `43534924331`, tests PostgreSQL `ملتقى الطلاب` run `43534924333`. Ces exécutions validaient les scénarios du harnais avant ajout des tests supplémentaires ci-dessous.
- Extension du harnais `ci/msg-invitation-postgres-test.sql` dans le commit `58f92b70ed143eaf7601f0a9cfa3a473fb2d00a6` :
  - invitation de plus de sept jours : acceptation renvoie `NULL`, statut devient `expired`, aucun DM supplémentaire n'est créé ;
  - blocage dans le sens destinataire → expéditeur : acceptation refusée avec `user_blocked` ;
  - blocage dans le sens expéditeur → destinataire : nouvel envoi refusé avec `user_blocked`.
- Les quatre workflows du commit `58f92b7` ont été déclenchés et étaient encore en cours lors de la rédaction de cette note : CI principale run `43535465882`, consentement Messenger run `43535465836`, découverte Messenger run `43535465842`, PostgreSQL `ملتقى الطلاب` run `43535465837`. Ne pas déclarer cette extension validée avant leurs conclusions finales.
- Les tests restent limités à PostgreSQL 17 éphémère avec comptes synthétiques. Ils ne valident pas encore les JWT Supabase réels, l'expérience navigateur, les notifications Realtime en environnement actif ni la disponibilité de Messenger en production.
- Les migrations Messenger `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` demeurent préparatoires et non appliquées à Supabase. Aucun message privé réel consulté, aucune modification de `main`, aucun déploiement. PR #17 reste ouverte et non fusionnée.


### Résultats définitifs — Lot 454, commit `848d232b0ea5a900da20de699b667ae2ec54f475` (14 novembre 2026)
- Correction du SQL de test : les blocs anonymes des scénarios d'expiration et de blocage utilisent désormais les délimiteurs dollar `$$` correctement appariés.
- Les quatre workflows sur le commit `848d232b` sont terminés avec succès :
  - CI principale ALLEMAND : run `43535588239` — succès.
  - PostgreSQL isolé — consentement Messenger : run `43535588296` — succès.
  - PostgreSQL isolé — découverte Messenger : run `43535588243` — succès.
  - PostgreSQL isolé — `ملتقى الطلاب` : run `43535588234` — succès.
- Le test de consentement couvre désormais, dans le harnais PostgreSQL temporaire, l'envoi sans création immédiate de DM, l'acceptation uniquement par le destinataire, l'idempotence, l'annulation, le refus, l'expiration au-delà de sept jours sans création de DM, et les blocages dans les deux sens.
- Ces succès sont des validations automatisées en environnement PostgreSQL isolé avec identités synthétiques. Ils ne constituent pas une preuve de fonctionnement en production : restent à effectuer les tests d'intégration avec JWT Supabase réels dans un environnement de test autorisé, les parcours navigateur multi-comptes, ainsi que la vérification Realtime/notifications.
- État inchangé des protections : PR #17 ouverte et non fusionnée ; `main` non modifiée ; aucune migration Messenger appliquée au projet Supabase actif ; aucun déploiement ; aucune lecture de messages privés réels.
- Étape suivante recommandée : préparer un environnement Supabase de test distinct (sans facturation ni modification du projet actif), puis valider les RPC avec deux comptes synthétiques et les parcours UI avant toute décision d'activation.


### Contrôle complémentaire après le Lot 454 — HEAD documentaire `83e8c1815ca100d0840fa6a44c26f616d3d67295` (14 novembre 2026)
- Nouvelle consultation des exécutions GitHub Actions associées au HEAD `83e8c181` : les quatre workflows sont terminés avec succès :
  - CI — ALLEMAND, run `43535785784` (run #3649), job « Validation structurelle & pédagogique » : success.
  - PostgreSQL isolé — consentement Messenger, run `43535785772` (run #17) : success.
  - PostgreSQL isolé — ملتقى الطلاب, run `43535785797` (run #96) : success.
  - PostgreSQL isolé — découverte Messenger, run `43535785814` (run #35) : success.
- Les étapes déterminantes des trois tests PostgreSQL sont terminées avec succès : initialisation du conteneur PostgreSQL 17, installation du client et exécution du script SQL de test.
- Relecture du harnais : `auth.uid()` est simulé par une fonction SQL qui lit le paramètre de session `request.jwt.claim.sub`; les rôles PostgreSQL `anon` et `authenticated` sont créés localement. **Ce harnais ne valide pas la signature d'un JWT Supabase, GoTrue, PostgREST, les claims réellement émis par Auth ni les échanges HTTP du Data API.** Il valide les fonctions SQL et leurs privilèges dans un PostgreSQL jetable.
- Inventaire Supabase en lecture seule : une seule organisation (`yhigaygkffkdygpaglaf`) et un seul projet (`azjwcybivirvpxbfhyzk`, région `eu-west-2`, PostgreSQL 17) sont visibles. L'inventaire des branches ne retourne que `main`; aucun environnement de test Supabase distinct n'est actuellement disponible.
- Aucune branche ou aucun projet Supabase n'a été créé : la création d'une branche peut entraîner une facturation horaire, et la contrainte utilisateur est de ne rien payer. Aucun coût n'a été accepté ni engagé. Aucun accès au contenu des messages privés ou aux profils nominatifs n'a été effectué.
- Le PR #17 est toujours ouvert selon la consultation GitHub. Il reste non fusionné conformément à la consigne de validation visuelle préalable. Aucun changement sur `main`, aucune migration Messenger appliquée au projet actif, aucun déploiement Cloudflare.
- **Conclusion :** le cycle SQL de consentement et de découverte est validé sur PostgreSQL 17 isolé, mais Messenger n'est toujours pas opérationnel sur le projet Supabase actif. Les migrations `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql` restent non appliquées.
- Prochaine étape sans frais ni risque de production : préparer un test d'intégration reproductible avec Supabase local (Auth + API + PostgreSQL) dans un environnement Docker/CI isolé, après vérification de la disponibilité Docker et de la configuration CLI. Ne pas utiliser le projet cloud actif, ne pas créer de branche cloud, et ne pas ajouter de secret de production aux workflows. Si cet environnement local ne peut pas être exécuté dans GitHub Actions sans configuration ou secret supplémentaire, documenter le blocage et demander uniquement l'action utilisateur indispensable.


### Lot 455 — banc d'intégration Supabase local pour Messenger (14 novembre 2026)
- Préparation d'un nouveau workflow dédié : `.github/workflows/msg-supabase-local-test.yml`.
- Fichiers ajoutés :
  - `ci/msg-supabase-local-bootstrap.sql` : schéma minimal et synthétique pour les dépendances Messenger (profils, conversations, membres, blocages et fonctions historiques attendues).
  - `ci/msg-supabase-local-test.mjs` : création de deux comptes synthétiques via l'API Admin Auth locale, connexion par mot de passe pour obtenir des access tokens émis par GoTrue, puis appels REST/RPC PostgREST avec les JWT signés.
  - `.github/workflows/msg-supabase-local-test.yml` : initialise Supabase CLI, démarre la pile locale, prépare le schéma de test, applique uniquement les migrations Messenger 001 et 003 à la base locale, puis exécute le scénario HTTP.
- Scénario d'intégration visé : l'expéditeur crée une invitation en attente ; aucune conversation directe n'est visible avant le consentement ; l'expéditeur ne peut pas accepter sa propre invitation ; le destinataire accepte ; les deux comptes peuvent ensuite lire la conversation et ses deux membres via les politiques RLS.
- Aucun compte réel, aucune donnée privée et aucun secret de production ne sont utilisés. Le service_role et les JWT de ce test sont ceux générés par l'instance locale éphémère du runner GitHub. La migration `202611130002_multaqa_community_feed.sql` n'est pas concernée par ce banc d'essai.
- Supabase CLI est épinglé à `2.122.1` pour ce premier banc. La version 3 publiée en novembre 2026 modifie les cibles par défaut des commandes et le consentement requis pour les changements distants ; la migration vers CLI v3 devra faire l'objet d'une étape distincte, sans risque de viser le projet hébergé par erreur.
- Premier run du nouveau workflow : `43536384262`, déclenché sur le commit `93adcbfc`. Au dernier contrôle, l'initialisation CLI et la configuration Auth locale étaient réussies ; l'étape de démarrage des conteneurs Supabase était encore en cours. **Aucun résultat positif n'est encore revendiqué pour le scénario JWT/PostgREST/RLS.**
- Corrections apportées ensuite dans le workflow : export des variables locales via `supabase status -o env` puis transfert explicite vers `GITHUB_ENV`, et suppression de `mailpit` de la liste d'exclusions afin de ne garder que les noms de services documentés. Dernier HEAD de la PR au moment de la mise à jour : `30914eedcf7ed7b4682655c25869756258be583c`. Le run initial ne porte pas encore sur ce dernier HEAD.
- Contrôles existants sur le commit `93adcbfc` : CI générale, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL ملتقى الطلاب terminés avec succès. Cela ne valide pas encore le nouveau workflow local.
- Garde-fous inchangés : PR #17 ouverte et non fusionnée ; `main` non modifiée ; aucune migration Messenger exécutée sur Supabase cloud ; aucun déploiement Cloudflare ; aucun coût cloud engagé.
- Prochaine étape : obtenir un résultat complet du workflow Supabase local sur le HEAD courant, consulter ses logs, corriger les erreurs de démarrage ou d'intégration puis relancer jusqu'à un résultat reproductible. Tant que ce workflow n'est pas vert, Messenger reste non validé avec Auth/JWT/PostgREST réels, et n'est pas déclaré opérationnel.


#### Diagnostic et correction du premier lancement Supabase local — 14 novembre 2026
- Le run `43536384262` a échoué à l'étape « Démarrer Supabase local isolé ». Les logs montrent que `supabase start` a automatiquement tenté d'appliquer `202611130001_msg_invitation_consent.sql` avant le bootstrap et a échoué sur `relation public.msg_conversations does not exist`. La cause est donc l'ordre d'initialisation des migrations, pas une modification de la base cloud.
- Correction du workflow au commit `8942b889ba9a0978e996069dfeb2609321b3b108` : les fichiers SQL du dossier de migrations sont copiés temporairement hors de `supabase/migrations` pendant le démarrage local, puis restaurés après le démarrage. Le bootstrap synthétique est exécuté avant l'application explicite des migrations 001 et 003. La migration Multaqa 002 n'est pas appliquée dans ce scénario.
- La syntaxe du script Node a été vérifiée avec `node --check` et a réussi dans le run `43536593612`. Le CLI local initialise également sa configuration et le paramètre Auth sans erreur.
- Deuxième run de l'intégration locale : `43536593612`, sur le commit `8942b889`, encore en cours au dernier contrôle, à l'étape de démarrage de la pile. Aucun succès JWT/PostgREST/RLS n'est encore revendiqué.
- Le déclenchement du workflow est conservé sur les événements pull_request pour que les prochaines mises à jour de la PR relancent ce contrôle. HEAD documentaire actuel : `d4b733469f278df0d545d6d3431b523cf2b7447a`.
- Les workflows classiques sur le commit `8942b889` sont en cours ; le précédent lot sur `93adcbfc` avait sa CI générale et ses trois suites PostgreSQL existantes réussies.


#### Point de contrôle après correction — HEAD `d16bf090f93a24ba90dd397be4fe9545747225a9`
- Sur le commit de code `d4b73346`, les quatre workflows classiques sont tous terminés avec succès : CI `43536613782`, consentement `43536613783`, découverte `43536613836`, et Multaqa `43536613871`.
- Le nouveau workflow Supabase local correspondant à ce commit, run `43536613808`, est encore en cours à l'étape de démarrage de la pile Supabase. La syntaxe Node et les étapes préalables de configuration/isolement des migrations sont terminées avec succès. Le scénario Auth/JWT/RPC/RLS n'a pas encore commencé.
- PR #17 : toujours ouverte, non fusionnée ; `mergeable_state=clean` au dernier contrôle. Le HEAD documentaire a avancé à `d16bf090` pour consigner ce point. `main` reste inchangée.


#### Résultat final du banc Supabase local — HEAD `8f5a2cf66189130f748e0afcaf7474e7dbd1405d` (14 novembre 2026)
- Le workflow local Messenger est maintenant **terminé avec succès** sur le HEAD de la PR : run `43536751470`, job `messenger-supabase-local`, étape 13 « Vérifier Auth GoTrue, JWT signés, RPC PostgREST et RLS avec deux élèves synthétiques » : success.
- Le journal contient la confirmation explicite : `PASS: GoTrue JWT réel local, RPC PostgREST, consentement du destinataire et RLS des deux membres`.
- Les logs confirment que la pile Supabase locale démarre, que le bootstrap synthétique s'exécute, que les migrations Messenger 001 et 003 sont appliquées **uniquement à la base locale éphémère**, puis que le script HTTP Node s'exécute. La pile locale est arrêtée à la fin du job.
- Assertions du scénario validé : création de deux comptes synthétiques par l'API Admin GoTrue locale ; connexion par mot de passe pour obtenir des JWT signés localement ; appel de RPC via PostgREST avec les JWT des utilisateurs ; invitation en attente sans DM prématuré ; impossibilité pour l'expéditeur d'accepter sa propre invitation ; acceptation par le destinataire ; visibilité de la conversation pour les deux membres et présence de deux membres exactement via RLS.
- Runs sur le même HEAD `8f5a2cf` tous terminés avec succès : CI générale `43536751420`, consentement PostgreSQL `43536751448`, découverte PostgreSQL `43536751406`, ملتقى الطلاب PostgreSQL `43536751390`, et intégration Supabase locale `43536751470`.
- Cette validation est un vrai test d'intégration Auth/JWT/PostgREST/RLS, mais **reste une validation locale synthétique** : elle ne prouve pas que les migrations sont installées sur le projet Supabase hébergé, que les comptes réels sont prêts, que l'interface navigateur est validée en multi-comptes, ni que Realtime/notifications sont opérationnels.
- Aucune migration Messenger n'a été appliquée au projet Supabase cloud ; aucun compte ou message réel n'a été consulté ; aucun déploiement Cloudflare ni coût cloud n'a été engagé. La migration Multaqa 002 n'est pas incluse dans ce test.
- PR #17 vérifiée au même HEAD : ouverte, non fusionnée, base `main`, état mergeable positif. Conserver impérativement cette PR ouverte pour validation visuelle utilisateur ; aucune modification directe sur `main`.
- Étape suivante : auditer les chemins d'intégration de l'interface réelle `msg.js` avec les RPC et le consentement, puis construire des tests navigateur multi-comptes et Realtime dans un environnement local. Ne pas annoncer Messenger opérationnel sur le cloud avant validation et autorisation distincte d'installation des migrations 001/003.


#### Extension du banc d'intégration Auth/RLS — commit code `1628087e73f2f9dbec2528fda880efaa7b1a6359` (14 novembre 2026)
- Après le premier succès Auth/JWT/PostgREST/RLS, le script `ci/msg-supabase-local-test.mjs` a été étendu sans modifier le runtime Messenger ni les migrations.
- Nouveaux scénarios ajoutés : contrat minimal de découverte (uniquement `student_id,pseudo,niveau,filiere,wilaya`, sans e-mail) ; confidentialité d'une invitation vis-à-vis d'un troisième compte non participant ; impossibilité pour le destinataire d'annuler une invitation sortante ; annulation possible par l'expéditeur ; impossibilité pour l'expéditeur de refuser sa propre invitation ; refus possible par le destinataire ; absence de conversation directe après annulation/refus.
- Le run correspondant au commit `1628087e`, ID `43537268300`, a commencé. Au dernier contrôle : syntaxe Node réussie, initialisation CLI et configuration Auth réussies, démarrage des conteneurs locaux en cours ; les scénarios HTTP étendus n'ont pas encore été exécutés. Ne pas anticiper leur résultat.
- Le test local précédent reste vert : run `43536751470`, avec le succès explicite GoTrue/JWT/PostgREST/consentement/RLS. La CI générale du HEAD documentaire précédent `8eb31f24` est verte ; les autres contrôles de ce HEAD sont en cours.
- Prochaine étape : attendre le run `43537268300`, examiner le journal détaillé, corriger si nécessaire, puis inscrire le résultat définitif. Aucun changement Supabase cloud, aucune migration Messenger cloud, aucun déploiement, aucune fusion.


#### Centre des invitations — actualisation Realtime côté interface (14 novembre 2026)
- Le banc étendu du commit `997bbf213fad62a7db49b1f3f457df42001f6bea` a terminé avec succès : run Supabase local `43537329747`, job `messenger-supabase-local`. Journal : `PASS: GoTrue JWT, PostgREST, RLS, consentement, recherche minimale, confidentialité des invitations, annulation et refus`. Les quatre autres workflows sur ce HEAD sont également verts : CI `43537329715`, consentement `43537329785`, découverte `43537329828`, Multaqa `43537329719`.
- Audit interface : `supabase/supabase.js` expose les RPC `msg_invite_send/accept/decline/cancel`, la recherche `msg_student_search` et la lecture des invitations ; `msg.js` affichait le centre, mais ne s'abonnait pas aux événements Realtime de `msg_invites`. Les messages en direct avaient déjà leur canal Realtime distinct.
- Correction apportée dans `msg.js` : ajout d'un canal Realtime `msg-invites-<userId>` abonné aux changements de `public.msg_invites` ; les changements déclenchent le rechargement du centre uniquement si le même compte est actif et qu'aucun fil de conversation n'est ouvert. Le canal est fermé au changement de vue et à l'ouverture d'un fil, puis réabonné lors du retour à la liste. Aucun payload de message privé n'est diffusé par ce canal ; les lignes d'invitation restent soumises à la RLS.
- Tests statiques de garde ajoutés à `tests/msg_test.mjs` pour vérifier l'abonnement, le nettoyage et la condition de rafraîchissement.
- Commits interface/tests : `b88831a2479e11206ac068f6d9391cf6b2fbd6e4`, `c8c7e6636fd209ab2379c41e26919cacfc6e1854`, puis correction de nettoyage `ad2e81c1f1e1857a16717a4f1143236f081cde7b`.
- Les workflows lancés sur `c8c7e663` étaient encore en cours lors du contrôle ; ils ne valident donc pas encore le canal Realtime. Le commit final `ad2e81c` déclenche également une nouvelle série CI. Attendre les résultats avant de déclarer cette modification vérifiée.
- API GitHub PR #17 au dernier contrôle : ouverte, non fusionnée ; `mergeable=true`, `mergeable_state=unstable` pendant les contrôles Actions. Ne pas confondre cet état transitoire avec un conflit confirmé.
- Aucun changement sur `main`, aucune migration Messenger appliquée à Supabase hébergé, aucun déploiement Cloudflare. Realtime des invitations est implémenté dans le code de la branche, mais pas encore prouvé en navigateur multi-comptes ni sur l'instance cloud.


## Lot 456 — fermeture des courses asynchrones Realtime Messenger (14 novembre 2026)
- Revue du cycle de vie du canal d'invitations dans `msg.js` après validation CI du Lot 455.
- Défaut identifié : `startInviteChannel()` attendait la création du client Supabase avant d'enregistrer le canal. Si l'utilisateur quittait Messenger ou ouvrait un fil pendant cette attente, la fermeture pouvait arriver avant l'affectation de `state.inviteCh`; l'opération asynchrone pouvait ensuite créer un abonnement devenu inutile.
- Correction : ajout d'un compteur de génération `inviteEpoch`; chaque fermeture invalide les opérations asynchrones antérieures. Après l'attente du client Supabase, l'abonnement vérifie encore la génération, l'identité active, l'état hors fil et l'activité de la vue Messenger.
- Le gestionnaire `dz:view` met désormais explicitement à jour `inviteViewActive`, ferme les canaux et ne relance le rendu que lorsque la vue Messenger est réellement active.
- Ajout de deux assertions statiques dans `tests/msg_test.mjs` pour vérifier l'invalidation des opérations obsolètes et l'interdiction de démarrer le canal hors de la vue Messenger.
- Commits : code `aa89e6112b63fdf97641c5841f85369f7ce2946c`; tests `7ad3cb9d1d7ac68ff29cdac8d58d5965835c93aa`. Le présent dossier est mis à jour séparément ci-dessous.
- CI antérieure sur le code Realtime initial : cinq workflows réussis (validation générale, consentement PostgreSQL, découverte PostgreSQL, Multaqa PostgreSQL, Supabase local GoTrue/JWT/PostgREST/RLS). Ces résultats ne valident pas encore ce correctif Lot 456; ses propres workflows doivent s'exécuter après les commits ci-dessus.
- Limite : aucune session navigateur multi-compte ni livraison WebSocket Realtime réelle n'a encore été exercée. Le test reste statique côté client et intégration serveur locale; ne pas présenter les notifications live comme opérationnelles en production.
- Aucun changement sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune opération sur Supabase en production. PR #17 reste ouverte et non fusionnée.


### Lot 457 — correction du contrôle statique Realtime (14 novembre 2026)
- La CI principale du commit `e5ae61ea0af7ca82997ee21acb47303eb381eeee` a échoué uniquement dans `tests/msg_test.mjs`, sur l'assertion qui cherchait une condition JavaScript sous forme compacte.
- Le code réel `msg.js` applique bien les quatre gardes dans le callback Realtime : génération d'abonnement toujours valide, vue Messenger active, même utilisateur connecté et absence de fil ouvert. Le contrôle statique attendait à tort une expression sur une seule ligne et ne tenait pas compte des gardes supplémentaires.
- Correction du test au commit `870f6431ed535203b53efeceb489181da0dc6aec` : assertion regex tolérant les espaces/retours à la ligne, tout en exigeant explicitement les quatre conditions et l'appel à `renderList()`. Aucun affaiblissement du code runtime ni des règles serveur.
- Le run de référence sur le HEAD précédent a montré les quatre workflows Messenger/PostgreSQL et Supabase local verts ; seul le contrôle structurel principal échouait sur cette assertion. Le nouveau commit doit encore être validé par ses propres workflows avant toute conclusion.
- PR #17 reste ouverte et non fusionnée. Aucun changement sur `main`, aucune migration Messenger appliquée à Supabase cloud, aucun déploiement ni coût cloud engagé.
- Étape suivante : contrôler les nouveaux runs déclenchés par `870f643`, corriger uniquement les erreurs réellement remontées, puis tester le canal Realtime avec deux sessions synthétiques si un banc local adapté peut être ajouté sans dépendance frontend payante.


### Lot 458 — test de réception WebSocket Realtime avec comptes synthétiques (14 novembre 2026)
- Ajout dans `ci/msg-supabase-local-test.mjs` d'un test de transport réel vers le service Realtime de la pile Supabase locale, avec le WebSocket natif de Node 22 et le JWT GoTrue signé du compte destinataire.
- Le test ouvre le canal PostgreSQL `public.msg_invites`, attend la confirmation du `phx_join`, crée une invitation depuis le compte expéditeur par RPC PostgREST, puis attend l'événement INSERT reçu par le destinataire. Il vérifie l'identifiant, l'expéditeur et le statut de l'invitation, puis annule l'invitation synthétique et ferme le socket dans un bloc `finally`.
- Le test utilise exclusivement les trois comptes synthétiques déjà créés dans la base locale éphémère. Aucun message privé ni profil réel n'est consulté.
- Commit du test : `8ef0132c8d95827b4ea21ae8fc8735ca8e0c416c`.
- Ce test n'est pas encore validé : son workflow doit confirmer le protocole WebSocket, la publication locale et la réception RLS effective. Le succès des tests HTTP/RPC antérieurs ne suffit pas à déclarer Realtime opérationnel.
- PR #17 reste ouverte/non fusionnée. Aucun changement sur `main`, aucun déploiement Cloudflare, aucune migration appliquée au Supabase hébergé.
- Si le test échoue, examiner le message de jointure et la forme du payload du protocole local, puis corriger le banc de test sans désactiver RLS ni élargir la publication.

## Lot 459 — correction du protocole Phoenix du test Realtime (14 novembre 2026)
- Vérification des cinq workflows sur le HEAD précédent `f6a629f1d64f2d23f08d33514d6902b355a94bdd` : CI générale, tests PostgreSQL de découverte, tests PostgreSQL de consentement et tests PostgreSQL de `ملتقى الطلاب` réussis; le workflow d'intégration Supabase local a échoué uniquement au nouveau test WebSocket Realtime.
- Diagnostic tiré du journal GitHub Actions : Supabase local démarrait correctement, les migrations Messenger s'appliquaient dans la base éphémère, puis le client de test expirait en attendant `SUBSCRIBED`. Le test envoyait les trames Phoenix sous forme de tableau JSON tout en déclarant `vsn=1.0.0`.
- La documentation officielle du protocole Realtime distingue précisément les formats : `1.0.0` utilise un objet JSON; `2.0.0` utilise le tableau ordonné `[join_ref, ref, topic, event, payload]`. La cause identifiée est donc une incohérence de version de protocole dans le harnais, et non une preuve d'échec de la policy RLS ou de la publication SQL.
- Correction limitée à `ci/msg-supabase-local-test.mjs` : alignement du paramètre WebSocket sur `vsn=2.0.0`, qui correspond au tableau JSON déjà envoyé. Aucun changement au code applicatif Messenger, aux migrations SQL, à Supabase hébergé, aux données, à Auth/RLS ou aux paiements.
- Commit correctif : `f365c77fe82d88cb6ea444ceeea5a487b7082f07`.
- Validation : en attente de la nouvelle exécution GitHub Actions sur ce commit. Ne pas déclarer le transport Realtime validé avant que le test reçoive effectivement le `phx_reply` de souscription et l'événement INSERT synthétique.
- La migration `202611130001_msg_invitation_consent.sql` et la migration `202611130003_msg_student_discovery.sql` restent non appliquées sur Supabase hébergé; elles sont utilisées uniquement dans la pile locale éphémère du workflow.
- PR #17 doit rester ouverte et non fusionnée; aucune modification de `main`, aucun déploiement Cloudflare.

## Lot 460 — diagnostic de la livraison Realtime (14 novembre 2026)
- Après l'alignement du protocole Phoenix sur `vsn=2.0.0`, le serveur accepte désormais la souscription du client WebSocket (le test dépasse l'attente de `SUBSCRIBED`). Le workflow échoue ensuite car aucun événement `msg_invites INSERT` n'est observé dans les 12 secondes.
- Les quatre autres workflows sur le commit `f365c77f` réussissent : CI générale, PostgreSQL consentement, PostgreSQL découverte, PostgreSQL `ملتقى الطلاب`. Le workflow Supabase local confirme également que la pile locale démarre, que les deux migrations Messenger s'appliquent et que l'étape de test GoTrue/PostgREST/RLS démarre; l'échec est désormais localisé à la réception de l'événement Realtime.
- Ajout d'une instrumentation limitée au harnais `ci/msg-supabase-local-test.mjs` : conservation des dernières trames WebSocket reçues et inclusion de ces trames dans le message d'échec, afin de distinguer la réponse d'abonnement, les notifications serveur, les données de ligne et les éventuelles erreurs de canal.
- Commit diagnostic : `a4cd51a59ed033b71965216e4c5817a81626238f`.
- État : le diagnostic doit encore être exécuté par GitHub Actions; aucun résultat de livraison Realtime n'est déclaré. Pas de changement au code applicatif Messenger, aux migrations, à Supabase hébergé, aux données réelles ou aux paramètres Auth/RLS de production.
- PR #17 reste ouverte et non fusionnée; aucun changement sur `main`, aucun déploiement Cloudflare.


## Lot 461 — instrumentation publication et journaux Realtime (14 novembre 2026)
- Lecture du run du commit `a4cd51a5` : la souscription WebSocket est acceptée. Les seules trames reçues sont le `phx_reply` de souscription et le message système `Subscribed to PostgreSQL`; aucune trame `postgres_changes`, aucun `phx_error` et aucun événement de ligne n'arrivent avant l'expiration.
- Le journal confirme que le test utilise bien le JWT GoTrue du destinataire et que la RPC d'envoi est appelée après la souscription. Le problème ne vient donc plus du format de trame Phoenix ni d'un rejet explicite du canal.
- Ajout au workflow local de deux diagnostics avant le test : présence effective de `public.msg_invites` dans `pg_publication_tables`, et état de réplication/RLS de la table. Ajout aussi de la capture des 300 dernières lignes du conteneur Realtime même si le test échoue, avant l'arrêt de la pile.
- Modification limitée à `.github/workflows/msg-supabase-local-test.yml`; aucune migration, aucun code Messenger runtime, aucune policy, aucune donnée de production et aucun réglage Supabase hébergé modifiés.
- Commit instrumentation : `62a87c37c4ded3fc422c9d51d5c865307393fcdd`. Les contrôles de ce nouveau commit sont à attendre; le diagnostic n'est pas encore exécuté.
- Résultats confirmés sur le commit antérieur `95ebce7a` : CI générale, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL `ملتقى الطلاب` réussis; intégration Supabase locale échouée uniquement à la réception de l'événement Realtime.
- La PR #17 reste ouverte et non fusionnée. Aucun changement sur `main`, aucun déploiement Cloudflare. Les migrations Messenger 001 et 003 restent non appliquées sur Supabase hébergé.


## Lot 462 — vérification de la persistance et de la réplication Realtime (14 novembre 2026)
- Résultat des diagnostics du Lot 461 sur le commit `89bc8345` : la requête catalogue confirme que `public.msg_invites` appartient à `supabase_realtime`; `relreplident=d` (identité par défaut), RLS est activé. La souscription Phoenix répond `status=ok`, puis le serveur annonce `Subscribed to PostgreSQL`, mais aucun événement n'est livré.
- La clé primaire de `msg_invites.id` est bien définie dans la migration. Il n'y a donc pas d'indice justifiant de modifier arbitrairement l'identité de réplication ou de désactiver RLS.
- Ajout au test local de deux vérifications explicites immédiatement après la RPC d'invitation : la ligne doit être visible avec la clé service_role, puis lisible par le destinataire avec son JWT GoTrue et la policy RLS. Cela distingue une absence d'écriture d'un défaut de diffusion Realtime.
- Ajout au workflow d'une capture systématique des slots de réplication, des connexions `pg_stat_replication` et des options de la publication `supabase_realtime`, même en cas d'échec.
- Commits : test persistance/RLS `f76f376a24e570634df62d0ca26934ba2a7c6fdd`; diagnostic PostgreSQL `c6bc87c95a5bdd447599122d63b73ccb9331a528`.
- Les nouveaux contrôles sont à attendre. Aucun changement au runtime Messenger, aux migrations, à Supabase hébergé, à Auth/RLS de production ou aux données réelles.
- PR #17 reste ouverte et non fusionnée; aucun changement sur `main`, aucun déploiement Cloudflare.

## Lot 463 — Diagnostic ciblé du pipeline CDC Realtime (14 novembre 2026)

- Les exécutions du test local Supabase sur `fab6451c` échouent encore uniquement au contrôle de livraison WebSocket : abonnement accepté (`phx_reply status=ok`, puis `Subscribed to PostgreSQL`), mais aucun événement `postgres_changes INSERT` reçu dans les 12 secondes.
- Les contrôles précédant l'attente événementielle ne lèvent aucune erreur : l'appel RPC d'envoi persiste l'invitation (lecture service_role vérifiée), et le destinataire peut lire sa propre invitation via son JWT GoTrue/RLS. L'échec est donc postérieur à l'écriture SQL et à la lecture RLS.
- Diagnostic PostgreSQL : `public.msg_invites` est bien dans `supabase_realtime`; la table a RLS activé et replica identity `d` (normal avec sa clé primaire); la publication indique `pubinsert=true`. Deux slots logiques actifs existent : `supabase_realtime_replication_slot_` (wal2json) et `supabase_realtime_messages_replication_slot_` (pgoutput). La connexion `realtime_replication_connection` observée dans `pg_stat_replication` est celle du flux broadcast `realtime.messages`; elle ne suffit pas à prouver le traitement CDC de `msg_invites`.
- Lot 463 ajoute des diagnostics non destructifs au workflow local : connexions `pg_stat_activity`, structure de `realtime.subscription` et variables non secrètes de configuration Realtime (`PUBLICATIONS`, `SLOT_NAME`, `TEMPORARY_SLOT`, paramètres DB non sensibles). Aucun schéma de production ni aucune migration hébergée n'est modifié.
- Commit workflow : `32f1376612b477fa461ef63163c71d1294ddc67a`. Exécutions déclenchées automatiquement par la PR; résultat à contrôler avant de conclure.
- Les workflows isolés CI, consentement, découverte et `ملتقى الطلاب` sont verts sur le commit précédent. PR #17 reste ouverte et non fusionnée.
- Prochaine étape : exploiter les nouveaux diagnostics pour vérifier si le serveur Realtime lance bien son consommateur Postgres Changes/wal2json et s'il enregistre le canal dans `realtime.subscription`. Ne pas changer arbitrairement replica identity, RLS ou migrations.

## Lot 464 — Stabilisation du diagnostic Realtime (14 novembre 2026)

- La nouvelle exécution sur `087733f5` confirme le même défaut : RPC persistée, lecture RLS du destinataire réussie, abonnement WebSocket accepté, mais aucun événement INSERT délivré.
- Les diagnostics confirment encore deux slots actifs (`wal2json` pour `supabase_realtime_replication_slot_`, `pgoutput` pour le slot Broadcast `realtime.messages`) et `pubinsert=true`. Les logs Realtime observés démarrent explicitement le flux Broadcast, mais ne montrent pas le démarrage d'un consommateur CDC pour `public.msg_invites`.
- Le contrôle additionnel du Lot 463 était lui-même marqué en échec et interrompait la collecte de certaines informations. Lot 464 le rend non bloquant, sépare les requêtes, liste les tables du schéma `realtime` et garde la capture des variables de configuration non sensibles. Cela évite qu'un diagnostic auxiliaire masque la cause initiale.
- Commit workflow : `559cd3cbd879bb8a4b38ec32e7ad46d68a3a6fa3`. Tests déclenchés automatiquement; résultats à vérifier.
- Aucune modification de schéma/migration, RLS ou service hébergé. PR #17 reste ouverte et non fusionnée.
- Étape suivante : examiner les objets `realtime`, les variables effectives du conteneur et les logs complets pour déterminer si le mode CDC Postgres Changes est désactivé ou si le service Realtime ne lance pas son worker de réplication. Ne pas déclarer Messenger opérationnel tant que l'événement temps réel n'est pas effectivement reçu.


## Lot 465 — inspection de la souscription CDC en direct (14 novembre 2026)

- Le run `43542139984` sur le HEAD `6a4915fc` termine en échec uniquement sur l'attente d'un événement Realtime : l'invitation est persistée (contrôle service_role), lisible par le destinataire (JWT GoTrue + RLS), la souscription WebSocket est acceptée (`phx_reply status=ok` et `Subscribed to PostgreSQL`), mais aucun `postgres_changes INSERT` n'arrive en 12 secondes.
- Les journaux précisent que le slot `wal2json` est actif et que la connexion logique visible dans `pg_stat_replication` correspond au slot `pgoutput` du flux Broadcast `realtime.messages`. La publication `supabase_realtime` autorise INSERT/UPDATE/DELETE/TRUNCATE et contient bien `public.msg_invites`; la table garde sa PK, replica identity `d` et RLS activé.
- Le diagnostic du conteneur du Lot 464 contenait une continuation de ligne shell invalide (`\\` doublé), qui a interrompu l'inspection des variables. Lot 465 remplace la commande par un pipeline sur une seule ligne et capture aussi `DB_AFTER_CONNECT_QUERY` et `PORT` sans exposer de secrets.
- Le test Node interroge maintenant `realtime.subscription` pendant que le WebSocket destinataire est effectivement souscrit, et affiche uniquement les champs de diagnostic non secrets (identifiant de souscription, table, filtres, rôle, action). Cela doit confirmer si la souscription CDC est enregistrée pour `public.msg_invites` au moment précis de l'envoi.
- Commits : workflow `70c0ce2f80952daf3eb2eb88d30dee04a8ddf2ee`; test `58a285dff8212ff3439240f9f349301f1c00d26e`. Le dossier est mis à jour dans le commit suivant; exécutions automatiques à contrôler.
- Aucune modification des migrations, du runtime Messenger, des policies, de la base Supabase hébergée ou des données réelles. PR #17 reste ouverte et non fusionnée; aucun changement sur `main` et aucun déploiement Cloudflare.
- Ne pas déclarer Messenger opérationnel tant que le destinataire n'a pas reçu l'événement temps réel dans le test.


## Lot 466 — diagnostic CDC après délai (14 novembre 2026)

- Le run d’intégration Supabase locale `43542582148` sur le commit `cc802a73` a échoué ; les quatre autres workflows du même commit sont réussis.
- La publication `supabase_realtime` contient `public.msg_invites` ; la table a une clé primaire, `relreplident=d` et RLS activé. L’utilisateur destinataire lit bien sa propre invitation via son JWT.
- Le WebSocket accepte la souscription et répond `Subscribed to PostgreSQL`, mais aucun événement INSERT n’arrive en 12 secondes.
- La table `realtime.subscription` existe avec les colonnes attendues, mais la première lecture immédiatement après l’accusé de souscription ne retourne aucune ligne pour `public.msg_invites`. Le conteneur indique `DB_AFTER_CONNECT_QUERY=SET search_path TO _realtime` ; cela ne suffit pas à conclure que le schéma interrogé est incorrect, car la table est effectivement présente dans `realtime`.
- Le test est renforcé pour relire `realtime.subscription` à l’expiration des 12 secondes et inclure le résultat dans l’erreur. Cela distinguera une simple course au moment de l’inspection d’une absence persistante d’enregistrement CDC.
- Les diagnostics du conteneur ne montrent pas les variables `PUBLICATIONS` ou `SLOT_NAME` dans l’environnement sélectionné ; cette observation est conservée comme piste, pas comme cause prouvée.
- Aucune modification de Supabase hébergé, aucune migration de production, aucune modification de `main` et aucun déploiement.



## Lot 467 — diagnostic des échecs de démarrage GitHub Actions (14 novembre 2026)

- Vérification du commit HEAD `c9b69c5ba0a46cda6e049a1abe68c8da79665bb4`: les cinq workflows CI, Supabase local Messenger, PostgreSQL consentement, PostgreSQL découverte et PostgreSQL `ملتقى الطلاب` ont tous échoué avant toute étape de test.
- Inspection directe des objets Jobs GitHub : chacun affiche `runner_id=0`, `runner_name` vide, `steps=[]` et une durée d'environ deux secondes entre démarrage et clôture. Les cinq jobs demandent pourtant le label `ubuntu-latest`.
- Comparaison avec l'exécution précédente `435425...` : les runners étaient alors affectés (IDs `1000003838` à `1000003842`) et les étapes étaient bien exécutées. Cela confirme que les échecs du Lot 466 sont des échecs de provisionnement/affectation du runner GitHub Actions, et non des échecs fonctionnels démontrés par les tests.
- Les journaux des jobs échoués ne sont pas disponibles (réponse BlobNotFound) ; aucune annotation exploitable n'a pu être obtenue par les interfaces GitHub disponibles. Il serait incorrect d'inventer une cause plus précise ou de modifier le code pour masquer ce défaut d'infrastructure.
- Les relances des cinq jobs ont reproduit le même symptôme. Aucune autre relance en boucle n'est lancée ; attendre une exécution où un runner est effectivement attribué, puis reprendre l'analyse fonctionnelle.
- La PR #17 est toujours ouverte, non fusionnée et mergeable au dernier contrôle. Aucun changement sur `main`, aucune migration hébergée, aucun changement Auth/RLS de production et aucun déploiement Cloudflare.
- Le défaut Realtime de Messenger reste distinct et non résolu : le destinataire n'a toujours pas reçu d'événement INSERT dans le test local. Messenger ne doit donc pas être annoncé comme opérationnel.

## Lot 468 — validation explicite de l'ACK Postgres Changes (14 novembre 2026)

- L'analyse du protocole officiel Realtime confirme que le `phx_reply` positif à `phx_join` doit contenir `response.postgres_changes` avec l'identifiant et la cible de chaque abonnement. Les événements `system` de l'extension `postgres_changes` donnent séparément le statut de l'inscription CDC ; l'architecture Realtime utilise un worker Postgres CDC distinct du flux Broadcast.
- Le test local vérifiait seulement `payload.status === "ok"` et conservait les trames brutes en cas de timeout. Il ne validait pas que la réponse d'adhésion confirme explicitement `public.msg_invites` ni ne classait les statuts `system` de l'extension CDC.
- Le test vérifie désormais que `phx_reply.response.postgres_changes` contient effectivement `schema=public` et `table=msg_invites`. Un ACK positif sans cette entrée est maintenant rejeté immédiatement avec la réponse du serveur.
- Les événements `system` dont `extension=postgres_changes` sont conservés dans un journal borné et ajoutés au message d'échec, avec les lignes `realtime.subscription` relues après le délai. Cela permettra de distinguer un ACK incomplet, une erreur d'inscription CDC et une souscription correcte sans livraison WAL.
- Commit du test : `d36af34a1b5c3d9e333ec1e06564927ecc18f9e2`. Exécution CI à contrôler ; les workflows précédents avaient échoué avant affectation de runner (`runner_id=0`), donc aucune conclusion d'exécution n'est encore possible pour ce changement.
- Aucun changement des migrations, du runtime Messenger, des politiques, des données réelles ou de Supabase hébergé. PR #17 reste ouverte et non fusionnée ; `main` reste inchangée. Messenger n'est pas déclaré opérationnel tant que le test n'a pas confirmé la réception effective de l'événement par le destinataire.
## Lot 469 — attendre la confirmation CDC avant l'écriture de test (14 novembre 2026)

- La documentation officielle du protocole Realtime précise que le `phx_reply` positif confirme l'adhésion au canal et retourne la liste des souscriptions PostgresChanges, mais que le message `system` avec `extension=postgres_changes` et `status=ok` confirme séparément que la souscription PostgreSQL est active. La base de connaissances Supabase recommande explicitement d'attendre ce signal avant d'effectuer l'INSERT de test, car l'écriture juste après l'ACK de souscription peut créer une course.
- Source protocole : https://supabase.com/docs/guides/realtime/protocol ; source diagnostic : https://supabase.com/kb/troubleshooting/realtime-postgres-changes-troubleshooting
- Lot 468 validait la liste `response.postgres_changes` et journalisait les messages `system`, mais `readyPromise` était encore résolue dès le `phx_reply`. Le test pouvait donc envoyer la RPC avant que le worker CDC ait confirmé son état prêt.
- Le test attend désormais les deux conditions, dans n'importe quel ordre : (1) `phx_reply` positif contenant `public.msg_invites`; (2) message `system` avec `extension=postgres_changes` et `status=ok`. Le signal `error` ou `timeout` fait échouer l'initialisation avec le message serveur. L'insertion synthétique ne démarre qu'après ces deux confirmations.
- Le délai de 12 secondes signale maintenant explicitement l'absence de disponibilité CDC et inclut l'ACK ainsi que les derniers messages système reçus. Aucun délai arbitraire ajouté après l'ACK : le test se synchronise sur le signal serveur documenté.
- Commit test : `590c0023932b362423b64c08a7d6eb227c0520db`. Le contrôle Node `node --check` est configuré dans le workflow mais ne peut pas encore être revendiqué : les jobs GitHub Actions précédents ne reçoivent aucun runner (`runner_id=0`, aucune étape).
- Aucun changement des migrations, du runtime de production Messenger, des policies RLS, des données réelles ou de Supabase hébergé. PR #17 reste ouverte et non fusionnée; `main` inchangée. Messenger reste non déclaré opérationnel jusqu'à réception effective de l'INSERT par le destinataire.
- Après le commit du test, les cinq workflows ont été relancés automatiquement (runs `43581310517`, `43581310576`, `43581310510`, `43581310519`, `43581310531`). Ils échouent tous en 1–2 secondes avec `runner_id=0`, `runner_name` vide et `steps=[]`. Le job d'intégration Supabase local a également été relancé individuellement (tentative 2 du run `43581182404`) et reproduit le même défaut d'affectation. Le code Lot 469 n'a donc pas été exécuté par GitHub Actions.
- La PR #17 reste ouverte, non fusionnée et mergeable au dernier contrôle. Aucune modification de `main`, des migrations hébergées, d'Auth/RLS de production ou des données réelles.
## Lot 470 — contrôle des exécutions CI après synchronisation CDC (14 novembre 2026)

- Vérification du HEAD `b33207eb6284af3d3742eb1ca1338886affc3ea8` et des cinq exécutions déclenchées par l'actualisation du dossier : `43581342941` (Supabase local Messenger), `43581343007` (PostgreSQL ملتقى الطلاب), `43581342943` (PostgreSQL consentement), `43581342978` (CI ALLEMAND), `43581342975` (PostgreSQL découverte). Tous les jobs sont terminés en échec après environ 1–2 secondes, avec `runner_id=0`, `runner_name` vide et aucune étape (`steps=[]`).
- Les Check Runs correspondants exposent deux annotations chacun mais aucune sortie textuelle (`output.title`, `summary`, `text` tous nuls). L'endpoint d'annotations est refusé par l'interface GitHub connectée ; les journaux des jobs ne sont donc toujours pas récupérables. Ne pas attribuer une cause précise (quota, indisponibilité GitHub ou paramètres de dépôt) sans preuve.
- Le workflow `msg-supabase-local-test.yml` a été relu sur la branche : il utilise `runs-on: ubuntu-latest`, puis checkout, Node 22 et `node --check` avant le démarrage de Supabase local. Rien dans le YAML ne permet d'expliquer les jobs sans runner ; aucun changement de workflow n'est justifié sur la seule base de ces échecs.
- Le code Lot 469 est confirmé présent dans `ci/msg-supabase-local-test.mjs` : la résolution de la disponibilité exige à la fois l'ACK `phx_join` listant `public.msg_invites` et le message `system` `postgres_changes/status=ok`. Ce code n'a pas encore été exécuté par GitHub Actions.
- PR #17 reste ouverte et non fusionnée. `main`, les migrations hébergées, Auth/RLS de production, les données réelles et Cloudflare n'ont pas été modifiés. Messenger n'est toujours pas déclaré opérationnel : l'événement INSERT destinataire n'a pas été confirmé.
## Lot 471 — nouvelle tentative ciblée du job Messenger local (14 novembre 2026)

- Après le constat du Lot 470, une seule relance ciblée a été faite sur le job `messenger-supabase-local` de l'exécution `43581342941` (job initial `132406521875`). GitHub a créé la tentative/job `132406991047`.
- Le job est brièvement passé en file d'attente, puis s'est terminé en échec sans étapes disponibles. Les journaux de ce job retournent `BlobNotFound`; aucun runner ni log de démarrage n'est exposé par les interfaces connectées. Cette relance ne valide donc ni n'invalide le test Realtime : le script n'a pas pu être observé en exécution.
- Aucun changement de code ou de configuration CI n'a été effectué : faute de diagnostic exploitable, ne pas bricoler les workflows ni ajouter des runners auto-hébergés. La prochaine action utile est de consulter les détails/annotations de ce Check Run dans GitHub Actions avec un accès administrateur au dépôt, ou de vérifier le service de runners GitHub côté compte.
- PR #17 reste ouverte et non fusionnée ; `main`, Supabase hébergé, les migrations de production, les données élèves et Cloudflare restent inchangés. Messenger reste non certifié opérationnel tant que le vrai `INSERT` n'est pas reçu par le destinataire.
## Lot 472 — contrôle de la tentative 2 et de l'état de la PR (14 novembre 2026)

- Inspection de la tentative 2 du workflow `43581342941` après la relance ciblée : job `132406991047`, `runner_id=0`, `runner_name` vide, `steps=[]`, échec en environ deux secondes. Le journal reste indisponible (`BlobNotFound`). La relance ne fait donc pas avancer l'exécution du test.
- Le check-run du workflow est maintenant en tentative 2 ; la même signature d'échec pré-run persiste. Les cinq workflows du commit initial restent en échec ; aucune preuve ne permet d'accuser le code Messenger ni de confirmer un incident de compte/quota.
- État de la PR #17 revérifié : `open`, `merged=false`, `mergeable=true`, branche `design/prototypes-67-74-alignment`, base `main` au SHA `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`. Le nouveau HEAD est `78a31ac850daf247d16b186ffeb70c069a6a8660`.
- Un Check Run Cloudflare `Workers Builds: allemand` apparaît en succès avec un Build ID de preview `5684d4b5-7cea-4820-9c7c-d453103832c6`. C'est uniquement le statut du build de preview fourni par l'intégration ; aucune action de déploiement ni validation visuelle n'a été effectuée.
- Aucun changement applicatif ou de configuration n'a été fait dans ce lot. `main`, Supabase hébergé, migrations de production, données élèves et déploiement Cloudflare restent hors intervention. Messenger demeure non certifié tant que le test ne reçoit pas le vrai événement `INSERT` côté destinataire.
## Lot 473 — fiabilisation des délais du test Realtime Messenger (14 novembre 2026)

- Relecture ciblée de `ci/msg-supabase-local-test.mjs` : le même délai de 12 secondes couvrait auparavant à la fois l'attente de l'ACK/du signal CDC-ready et l'attente de l'événement INSERT. Si l'abonnement devenait prêt tardivement, le test disposait de moins de 12 secondes pour observer l'invitation ; le message d'erreur pouvait donc être prématuré.
- Correction appliquée : délai CDC-ready de 12 secondes, puis redémarrage d'un délai indépendant de 12 secondes après réception conjointe de `phx_reply` valide et `system postgres_changes/status=ok`. Le diagnostic `realtime.subscription` est exécuté à l'expiration du second délai. Le message précise maintenant que les 12 secondes de réception commencent après CDC readiness.
- Correction complémentaire : une erreur de parsing/traitement d'une trame WebSocket avant l'état prêt rejette désormais `readyPromise` immédiatement (`rejectReady`) au lieu de rejeter uniquement `eventPromise`, ce qui évite d'attendre inutilement le timeout CDC-ready.
- Commit du script : `862046974c35da422c4f4d6c290c426cd44624e0`. Relecture du bloc modifié effectuée sur la branche. Aucune exécution Node ou CI réussie n'est revendiquée : GitHub Actions reste bloqué avant runner et le test doit encore être exécuté.
- Aucun changement des migrations, du client `msg.js`, de Supabase hébergé, des données, Auth/RLS ou Cloudflare. PR #17 reste ouverte et non fusionnée ; `main` non modifiée. Messenger n'est pas déclaré opérationnel tant que l'INSERT destinataire n'a pas été reçu et vérifié.
### Résultat CI du commit Lot 473

- Le changement de `ci/msg-supabase-local-test.mjs` a déclenché les cinq workflows : `43581817328`, `43581817377`, `43581817369`, `43581817332` et `43581817370`. Tous ont échoué en environ une seconde avant la première étape ; l'API Jobs confirme pour chacun `runner_id=0`, `runner_name` vide et `steps=[]`.
- Le nouveau délai distinct CDC-ready/événement n'a donc pas encore été exécuté. Il reste une correction de logique du test, relue dans le dépôt, pas un test validé en CI.

## Lot 474 — validation stricte du type d'événement Realtime (14 novembre 2026)

- Relecture du bloc de réception dans `ci/msg-supabase-local-test.mjs` : le test acceptait un événement ciblé si son type était absent, en le traitant implicitement comme un INSERT. Ce fallback pouvait produire un faux positif si le serveur envoyait une trame incomplète ou différente du protocole attendu.
- Le filtre exige maintenant explicitement `data.type`, `data.eventType` ou `payload.eventType` égal à `INSERT` (insensible à la casse), en plus de l'identifiant destinataire et du statut `pending`. L'assertion ultérieure vérifie toujours que l'UUID reçu est exactement celui créé par la RPC, puis contrôle l'expéditeur.
- Changement limité au harnais de test local avec comptes synthétiques ; aucune modification de `msg.js`, des migrations, des policies, d'Auth/RLS hébergé, des données réelles ou de Cloudflare.
- Vérification disponible à ce stade : diff ciblé relu et prédicat confirmé dans le dépôt. Aucun résultat d'exécution n'est revendiqué : les derniers jobs Actions (ex. run `43581868013`, job `132408113216`) se terminent avant toute étape, sans runner attribué. Il faudra exécuter le test dès qu'un runner démarre réellement.
- PR #17 reste ouverte et non fusionnée. `main` n'a pas été modifiée. Messenger n'est toujours pas certifié opérationnel tant que le vrai événement INSERT n'a pas été reçu par le destinataire synthétique.

### Résultat CI du Lot 474

- Le commit de code `69e59576eccc08db19869cf0c935fd236e3e6200` et la mise à jour du dossier `67d5b48b9c11b1e3d262da337869c6a2e52d7365` ont déclenché les cinq contrôles : CI ALLEMAND `43582007156`, PostgreSQL `ملتقى الطلاب` `43582007232`, Supabase local Messenger `43582007190`, PostgreSQL découverte `43582007137`, PostgreSQL consentement `43582007152`.
- L'inspection directe des cinq objets Jobs confirme la même signature : clôture en deux secondes, `runner_id=0`, `runner_name` vide et `steps=[]`. Le script `node --check` et les tests SQL/Realtime n'ont donc pas été exécutés. Il s'agit d'un échec pré-run commun aux jobs, pas d'un résultat négatif des tests.
- Les Check Runs GitHub n'exposent toujours aucun résumé textuel; l'endpoint des annotations n'est pas accessible via la connexion GitHub disponible. La cause précise du défaut d'affectation reste indéterminée. Ne pas modifier les workflows ni ajouter de runner auto-hébergé sans diagnostic et décision explicites.
- Le prédicat Realtime strict du Lot 474 est présent sur le HEAD, mais non exécuté. Le test exige désormais un type INSERT explicite et l'identité exacte de l'invitation. Messenger reste non certifié opérationnel.
- État final vérifié : PR #17 ouverte, non fusionnée, base `main`, HEAD `67d5b48b9c11b1e3d262da337869c6a2e52d7365`, `mergeable=true` au dernier contrôle. Aucun changement direct sur `main`, aucune migration Supabase hébergée, aucun changement de données réelles et aucun déploiement Cloudflare.

## Lot 475 — nouvelle tentative ciblée du runner GitHub Actions (14 novembre 2026)

- Pour éviter de relancer inutilement les cinq workflows, une seule relance ciblée a été effectuée sur le job Messenger local du run `43582066252` (job initial `132408702929`). GitHub a accepté la relance et créé la tentative 2, job `132408975893`.
- La tentative est passée de `queued` à `completed/failure` en environ deux secondes. Lecture de l'endpoint REST du job : `runner_id=0`, `runner_name=""`, `steps=[]`, label demandé `ubuntu-latest`. Les journaux restent absents (`logs_url=null`).
- Cette répétition confirme que la relance manuelle d'un job unique ne résout pas le défaut d'attribution du runner. Elle ne permet toujours pas d'identifier sa cause exacte (quota, politique, incident GitHub ou autre) ; aucune de ces hypothèses n'est affirmée.
- Aucun changement de workflow, aucune modification de configuration GitHub Actions et aucun runner auto-hébergé n'ont été ajoutés. Le code de test du Lot 474 reste inchangé.
- État PR #17 contrôlé après la relance : ouverte, non fusionnée, base `main`, HEAD `2fa40b1ccfe4b48822020f7b8c7c0adfe5656695`, `mergeable=true` à cet instant. Aucun changement sur `main`, aucune action sur Supabase hébergé ni sur Cloudflare.
- Prochaine action technique : obtenir un diagnostic GitHub exploitable sur l'échec d'allocation de runner ou attendre le rétablissement de l'exécution standard. Ne pas contourner ce blocage en modifiant arbitrairement les workflows ; dès qu'un runner démarre, exécuter le test de bout en bout et confirmer la réception effective de l'INSERT côté destinataire synthétique.


## Lot 476 — protection contre les souscriptions Messenger obsolètes (14 novembre 2026)

- Audit ciblé de `msg.js` : `startChannel(id)` attendait la résolution asynchrone de `window.SB.sb()` sans vérifier si l'utilisateur avait entre-temps quitté le fil ou ouvert une autre conversation. Une résolution tardive pouvait donc créer un canal Realtime inutile et conserver un abonnement obsolète. Le callback INSERT attendait aussi les noms et métadonnées de pièce jointe sans revalider que le fil était toujours actif avant son insertion DOM.
- Correctif appliqué : ajout d'un compteur `channelEpoch`. Chaque fermeture invalide les initialisations en cours ; après la résolution du client Supabase, le code vérifie l'époque et l'identifiant de conversation avant de créer le canal. Le callback INSERT revérifie ces deux conditions après ses appels asynchrones avant de modifier le fil.
- Ce correctif traite une course de cycle de vie côté navigateur. Il ne corrige pas et ne prouve pas la réception CDC côté serveur ; le test d'intégration Supabase local reste la preuve requise pour le transport `public.msg_invites`.
- Validation : relecture statique des points d'entrée et des gardes modifiés. Aucun test JavaScript ou workflow GitHub Actions n'a été exécuté dans cet environnement ; les récents jobs GitHub restent bloqués avant attribution d'un runner. Ne pas présenter ce correctif comme testé en exécution.
- Aucun changement de schéma, migration, Auth/RLS, données hébergées, `main` ou déploiement de production. PR #17 reste ouverte et non fusionnée.


## Lot 477 — protection contre les rendus asynchrones obsolètes (14 novembre 2026)

- Les cinq workflows déclenchés après le Lot 476 ont terminé en échec. L'API des jobs renvoie `steps=[]` pour chacun des cinq jobs ; les journaux ne sont pas disponibles (BlobNotFound). Aucun test applicatif n'a donc été exécuté par ces jobs, et leur conclusion ne permet pas d'attribuer un défaut aux scripts SQL ou au code Messenger.
- Une seconde revue du cycle de vie de `msg.js` a révélé une autre course : `renderThread(id)` attend plusieurs appels asynchrones (session, messages, noms, pièces jointes) avant d'écrire dans `#msgBody`. Si l'utilisateur change de conversation ou revient à la liste pendant ces attentes, un ancien rendu pouvait remplacer la vue plus récente. Le même risque existait entre plusieurs appels concurrents à `renderList()`.
- Correctif appliqué : compteur global `renderEpoch`, invalidation à chaque rendu liste/fil, et contrôles après les attentes asynchrones avant de poursuivre ou d'écrire le DOM. Le fil sélectionné est posé dès l'entrée dans `renderThread`, et l'ancien assignement tardif a été supprimé.
- Commit code : `b51d0386b86d816fa715bb8c965d6aaef5f5e834`.
- Validation : revue statique des ancres modifiées et vérification de présence des contrôles. Aucun test navigateur ni exécution locale n'a été réalisée ; les workflows GitHub précédents n'ont exécuté aucune étape.
- La réception CDC `public.msg_invites` demeure non démontrée. Aucun changement de schéma, migration, Auth/RLS, données hébergées, `main` ou déploiement de production.


### Complément Lot 477 — couverture de tous les appels asynchrones de la liste

- Relecture après le premier commit : `renderList()` comporte aussi des chargements asynchrones des invitations, signalements et file de vérification réservés à certains profils. J'ai ajouté les contrôles `renderEpoch` après chacun de ces appels (y compris entre les deux chargements de modération) pour qu'aucun résultat tardif ne poursuive la construction d'un ancien écran.
- Commit complémentaire code : `c8d9a6b` (voir SHA complet dans l'historique Git de la branche).
- Contrôle : vérification statique des emplacements d'attente et des gardes. Pas d'exécution locale ni navigateur ; CI reste non probante tant que les jobs n'exécutent aucune étape.


## Lot 478 — investigation du blocage GitHub Actions et état PR (14 novembre 2026)

- Vérification du statut public GitHub : le dernier incident public trouvé qui mentionne Actions est celui du 11 novembre 2026 (impact Actions, Pages, Copilot), marqué résolu à 21:21 UTC après traitement du backlog. La page publique ne signale pas, dans les résultats consultés, un incident Actions actif le 14 novembre. Cela n'exclut pas un problème localisé au dépôt, au compte ou à l'attribution de runners.
- Les cinq exécutions déclenchées après Lot 476 (runs `43582584592`, `43582584717`, `43582584720`, `43582584619`, `43582584689`) sont terminées en échec. L'API GitHub retourne `steps=[]` pour les cinq jobs. Les journaux sont absents/BlobNotFound. Il n'y a donc aucune preuve que les commandes de tests aient commencé ; ne pas traiter ces conclusions comme des échecs de tests applicatifs.
- Contrôle des paramètres accessibles : dépôt privé, branche par défaut `main`, accès connecté avec permissions admin/maintain/push. La lecture de `/actions/permissions` n'est pas autorisée par l'interface GitHub disponible ; la lecture de la protection de branche est refusée à l'intégration ; l'endpoint des rulesets renvoie 403 avec indication GitHub Pro ou dépôt public. Ces réponses ne prouvent pas que les Actions sont désactivées ni qu'une limite de minutes est atteinte. Aucun paramètre n'a été modifié.
- PR #17 relue : toujours ouverte, non fusionnée, base `main`, branche `design/prototypes-67-74-alignment`, `mergeable=true` au contrôle ; aucun avis de revue enregistré dans la liste retournée.
- Décision : ne pas ajouter de runner auto-hébergé, ne pas modifier les workflows ou permissions sans diagnostic plus probant. Ne pas relancer les mêmes jobs à répétition tant que l'attribution runner reste le point d'échec. La prochaine vérification utile est de contrôler dans l'interface GitHub du propriétaire du dépôt les paramètres Actions (autorisation des actions, politique de runners hébergés, limites/quota de minutes et éventuelles restrictions organisationnelles), puis faire un seul workflow minimal de diagnostic lorsque ces paramètres sont confirmés.
- Aucun changement de code, workflow, paramètres GitHub, `main`, Supabase hébergé ou Cloudflare dans ce lot. Messenger reste non certifié : réception Realtime réelle non démontrée.


### Complément correctif Lot 478 — architecture Cloudflare–Supabase et état réel du backend (14 novembre 2026)

- Relecture approfondie des audits de sécurité Lots 353–354 et des fichiers runtime actuels. Le Worker principal Cloudflare `allemand` est défini par `wrangler.toml` (entrypoint `src/site-worker.js`, assets statiques via binding `ASSETS`). Il sert le site et, pour l'allowlist des contenus protégés, appelle le Data API Supabase avec les bindings `SUPABASE_URL` et `SUPABASE_ANON_KEY` ainsi que le Bearer JWT de l'utilisateur. Il n'utilise pas de clé `service_role`. Cloudflare est donc le point d'entrée/de distribution edge et porte les bindings de connexion ; le projet PostgreSQL/Auth/Realtime reste le service Supabase connecté, pas une base PostgreSQL hébergée dans le Worker.
- Le workflow `.github/workflows/deploy.yml` est un workflow de validation CI sans job de déploiement ; l'intégration Cloudflare Workers Builds est séparée et automatique. Sur le HEAD documentaire `7197c1bc6eac3e3cdb3feb842a83de797a8dbbf2`, le check Cloudflare `Workers Builds: allemand` est **success**, Build ID `8207e2e3-e133-4d79-9932-3aef64698f64`, URL de preview de la branche `design-prototypes-67-74-alignment`. C'est un build de prévisualisation, pas une preuve de déploiement production ni un test navigateur authentifié.
- Inspection en lecture seule via le connecteur Supabase du projet actif `azjwcybivirvpxbfhyzk` : statut `ACTIVE_HEALTHY`, PostgreSQL 17.6, région `eu-west-2`. L'historique de migrations cloud comprend `20261113201922 multaqa_community_feed`, mais ne comprend pas les migrations Messenger `202611130001_msg_invitation_consent` et `202611130003_msg_student_discovery`.
- Requête de catalogue en lecture seule : `to_regclass('public.msg_invites') IS NULL`; aucune fonction `public.msg_invite_%` trouvée. La publication `supabase_realtime` active contient `public.msg_conversations` et `public.msg_messages`, pas `public.msg_invites`. Le backend cloud ne peut donc pas accepter les RPC d'invitation ni émettre les événements CDC de cette table tant que les migrations 001/003 ne sont pas appliquées.
- Journaux Supabase `realtime_logs` consultés sur la fenêtre disponible : le seul événement retourné est un contrôle de santé `GET /api/tenants/.../health` réussi ; aucun événement de souscription ou d'insertion relatif à `msg_invites` n'est présent. Cela est cohérent avec l'absence de la table en production et ne permet pas de diagnostiquer la panne CDC du test local.
- Distinction de diagnostic désormais obligatoire : (1) Cloudflare preview build : réussi ; (2) Supabase cloud : sain, mais sans migrations Messenger 001/003 ; (3) Supabase local dans GitHub Actions : test de transport CDC bloqué par des jobs qui n'obtiennent pas de runner, aucun test exécuté sur les runs récents. Ne pas mélanger ces trois plans.
- Correction de formulation du Lot 478 : la phrase « aucun déploiement Cloudflare » était trop générale. Le build automatique de preview Cloudflare a bien eu lieu ; aucun déploiement manuel/production n'a été effectué dans ce lot. Les bindings/secrets Cloudflare runtime n'ont pas été lus ni affichés.
- Aucune migration Messenger appliquée au projet Supabase actif, aucune modification de données, Auth, RLS ou paramètres Cloudflare, aucun changement direct sur `main`, PR #17 reste ouverte et non fusionnée.
- Prochaine étape technique : traiter le backend Messenger en deux étapes contrôlées : finaliser la validation des migrations 001/003 et du parcours Realtime dans un environnement de test exécutable, puis planifier leur activation cloud uniquement avec l'autorisation explicite déjà requise. Ne pas continuer à modifier le harnais GitHub sans nouveau signal technique exploitable.


## Lot 479 — prévol réel Supabase et durcissement de la migration découverte (14 novembre 2026)

- Reprise du diagnostic depuis l'architecture Cloudflare–Supabase consignée aux Lots 353–354 et le complément Lot 478. Le build Cloudflare preview est un contrôle distinct de la base Supabase active ; ne pas confondre la réussite du build Worker avec l'installation des migrations SQL.
- Prévol Supabase cloud en lecture seule : les tables prérequises `msg_conversations`, `msg_members`, `msg_blocks` et `profiles) existent ; leurs colonnes utilisées par la migration 001 correspondent aux attentes (IDs UUID, conversation ID bigint, created_by, type, wilaya/niveau/filiere, colonnes de blocage et vérification scolaire). Les helpers historiques `msg_can_dm`, `msg_guard_direct`, `msg_member_ok`, `msg_not_blocked`, `msg_open_direct` et `msg_is_moderator` existent également.
- Comparaison de sécurité ciblée : la définition actuellement installée de `public.msg_can_dm(a,b)` lie explicitement la paire au JWT appelant via `auth.uid() in (a,b)), en plus de la vérification des deux profils vérifiés. La version préparatoire de la migration 003 conservait les critères scolaires et le blocage, mais avait omis cette liaison d'identité présente en production. Même si les RPC prévues contrôlent séparément l'appelant, cette omission affaiblissait inutilement l'invariant de la fonction interne et créait une régression par rapport au helper actif.
- Correctif de sécurité sur la branche : ajout dans `202611130003_msg_student_discovery.sql` de `and auth.uid() in (a, b)` immédiatement après le contrôle non-null de `auth.uid()`. Ajout d'une assertion dans `ci/check-msg.mjs` pour empêcher une future suppression de cette liaison. Vérification statique ciblée : l'expression de contrôle correspond bien à la fonction SQL corrigée et l'assertion est présente.
- Commits : migration `19bebf549c3728d7f02f25cd9c65197b193d2a49` ; assertion CI `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d`.
- Limites de validation : pas d'exécution PostgreSQL ni de workflow GitHub Actions pour ce correctif à ce stade ; seule la vérification statique du texte et de l'expression de contrôle a été faite. Le correctif n'est pas appliqué à Supabase cloud. Les migrations 001/003 restent absentes du journal cloud et ne sont pas appliquées.
- État cloud confirmé : projet Supabase `azjwcybivirvpxbfhyzk` sain ; `msg_invites` et les quatre RPC d'invitation toujours absents ; publication Realtime limitée actuellement à `msg_conversations` et `msg_messages`. Aucune donnée de conversation ou message privé n'a été consultée.
- Cloudflare Workers Build preview du HEAD Lot 478 : success, Build ID `8207e2e3-e133-4d79-9932-3aef64698f64`. Aucun déploiement production ou changement de bindings/secrets.
- PR #17 reste ouverte, non fusionnée, base `main`. Aucun changement direct sur `main`, aucune migration/écriture cloud, aucune modification Auth/RLS ou paiement.


### Résultats d'exécution après le correctif Lot 479
- Sur le commit code `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d`, les cinq jobs GitHub Actions (CI structurelle, Messenger local, consentement PostgreSQL, découverte PostgreSQL, Multaqa PostgreSQL) se sont terminés en échec avec `runner_id=0`, `runner_name=""` et `steps=[]`. Aucune assertion, commande Node ou migration de test n'a été exécutée ; aucune conclusion sur la validité runtime du correctif ne peut être tirée de ces jobs.
- Le check `Supabase Preview` est `skipped` (pas de branche Supabase Preview provisionnée pour cette PR). Le check Cloudflare Workers Builds du commit code `09e3f223`, Build ID `8a1bacf8-de85-44e8-84c1-54300dc756f7`, était encore `in_progress` lors de la dernière lecture ; ne pas le déclarer réussi avant sa conclusion.
- Ces résultats ne changent pas l'état de la base active : migrations Messenger 001/003 absentes et non appliquées. Aucune action cloud ou déploiement production n'a été réalisé.


### Clôture des checks Lot 479 et synchronisation PR
- Le check Cloudflare Workers Builds du commit code `09e3f223454eb0ce6d3722d3cbde4567d8f2a40d` est finalement `success`, Build ID `8a1bacf8-de85-44e8-84c1-54300dc756f7`, preview Cloudflare de la branche PR. Cela valide le build du Worker et des assets pour ce commit, pas le parcours utilisateur authentifié ni les migrations Supabase.
- Le check `Supabase Preview` reste `skipped`.
- Les cinq jobs GitHub Actions restent en échec pré-run sur le commit code : `runner_id=0`, aucune étape. Aucun test n'a exécuté l'assertion Lot 479.
- Après mise à jour du dossier, la lecture REST directe de PR #17 donne `state=open`, `merged=false`, `mergeable=true`, `mergeable_state=unstable`. La branche est en divergence avec `main` (2712 commits en avance côté PR, 4 commits de base non intégrés). Ne pas interpréter `unstable` comme une fusion ou une validation CI ; conserver la PR ouverte et non fusionnée.
- HEAD documentaire : `1cd36accbff5ea9bbb20d4793b1b21dce26b6dd1`. Aucun merge, aucune modification de `main`, aucune migration cloud.


## Lot 480 — confidentialité de l'annuaire Messenger : suppression de l'exposition des UUID élèves (14 novembre 2026)

- Audit ciblé du contrat de découverte (migration 003, wrapper Supabase, UI et tests) : la RPC `msg_student_search` renvoyait directement `profiles.id` sous le champ `student_id`. Le fait de ne pas placer cet UUID dans le DOM ne le protégeait pas : il était déjà livré au navigateur dans la réponse PostgREST. Cela contredisait le contrat de découverte minimale/pseudo-only consigné dans les lots précédents.
- Correction sur la branche : la RPC renvoie maintenant un `student_key` aléatoire, non réversible et à durée de vie de cinq minutes. La table privée `msg_discovery_targets` associe le jeton au compte demandeur et au compte cible ; RLS activée et tous les privilèges retirés à `public`, `anon`, `authenticated`. Les anciennes clés expirées de l'acteur sont nettoyées lors d'une recherche.
- Nouvelle RPC `msg_invite_send_by_key(p_student_key)` : exige une session authentifiée, retrouve le jeton uniquement pour `auth.uid()`, vérifie son expiration puis délègue au contrôle serveur `msg_invite_send`. Un autre compte ne peut pas réutiliser le jeton. Les contrôles de vérification scolaire, blocage bilatéral et quota d'invitations restent exécutés dans la RPC d'origine.
- Le wrapper `supabase/supabase.js` transmet désormais le jeton via `msg_invite_send_by_key`. L'interface `msg.js` ne conserve plus que `student_key` dans `state.peers` et n'envoie plus de UUID cible. Le UUID de l'élève reste uniquement côté serveur dans la table privée de correspondance.
- Tests renforcés : `ci/msg-supabase-local-test.mjs` exige la présence de jetons différents des UUID Auth, vérifie le contrat exact des champs publics, rejette l'utilisation du jeton par un autre compte et envoie une invitation avec le jeton du bon acteur. `ci/check-msg.mjs` vérifie le contrat SQL/client et le branchement UI. Les assertions statiques ont été adaptées au nouveau nom de fonction et au parcours par jeton.
- Vérification textuelle des cinq fichiers après modifications : migration, wrapper, UI, test structurel et test Supabase local. Le seul `student_id` restant dans le parcours de découverte est dans la table privée et dans les opérations SQL internes ; il n'est plus retourné au client. Aucun test d'exécution n'a encore été lancé avec succès : les runners GitHub précédents ne démarraient pas les étapes. Ne pas présenter le correctif comme testé en runtime.
- Le prévol Supabase cloud reste en lecture seule : migration 003 non appliquée, table privée et RPC de jeton absentes de la production tant que la migration n'a pas été activée. Aucun accès ni changement de données réelles. Aucun secret Cloudflare/Supabase lu ou affiché.
- Contrat produit inchangé : seuls les élèves vérifiés du même niveau, filière et wilaya sont découvrables ; la découverte n'ouvre pas un DM ; l'invitation nécessite toujours le consentement explicite du destinataire.


### Complément Lot 480 — rétention des jetons et résultat des workflows
- Durcissement complémentaire de la rétention : ajout d'un index dédié sur `expires_at` et nettoyage des jetons expirés de tous les acteurs à chaque nouvelle recherche. Cela évite de conserver indéfiniment les correspondances expirées des comptes qui ne reviennent pas dans l'annuaire. Assertion correspondante ajoutée dans `ci/check-msg.mjs`.
- Dernière exécution des cinq workflows sur le premier commit de Lot 480 : `43583691064` consentement PostgreSQL, `43583691047` validation structurelle, `43583691045` découverte PostgreSQL, `43583691040` Multaqa PostgreSQL, `43583690984` Messenger local. Tous sont en échec avant exécution : `runner_id=0`, aucun runner et `steps=[]`. Les tests d'intégration n'ont donc pas validé ce lot en runtime.
- Le check Cloudflare de la version antérieure du code (Lot 479) a réussi ; aucun résultat Cloudflare n'est revendiqué pour les derniers commits du Lot 480 tant qu'un check correspondant n'a pas été relu.
- Aucun changement sur Supabase cloud, aucun déploiement production et aucune modification de secrets/bindings Cloudflare. Migrations 001/003 toujours préparées uniquement sur la branche.


### Clôture des contrôles Lot 480
- Les cinq workflows relancés sur le HEAD documentaire `10ca9ccc3e4187e5033e59a8e0ebc33278b4f778` (`43583756048` découverte PostgreSQL, `43583755998` validation structurelle, `43583755968` consentement PostgreSQL, `43583756023` Messenger local, `43583756009` Multaqa PostgreSQL) ont tous échoué avant la première étape : `runner_id=0`, `steps=[]`. Aucun résultat d'exécution SQL/Node ne valide ni n'invalide le nouveau parcours opaque.
- Le check Supabase Preview reste `skipped` : aucune branche Supabase Preview n'est associée à cette PR. Il n'y a donc pas de base preview Supabase pour exécuter les migrations dans cette PR.
- État de PR #17 vérifié après les commits : ouverte, non fusionnée, `mergeable=true`, `mergeable_state=clean`, branche `design/prototypes-67-74-alignment`, base `main`. HEAD documentaire `10ca9ccc3e4187e5033e59a8e0ebc33278b4f778`.
- Lot 480 est un correctif de confidentialité préparé, pas une mise en production. Les migrations Messenger restent non appliquées sur le projet Supabase cloud ; aucun déploiement Cloudflare production, aucun changement sur `main`, aucune modification de secrets/bindings.


### Rectification de méthode — aucune branche Supabase payante (14 novembre 2026)
- La proposition de créer une branche Supabase facturée à l'heure était une erreur de reprise de contexte. Elle est retirée : la contrainte « aucun coût / aucun service payant » était déjà explicitement enregistrée aux Lots 439–440. Ne jamais reproposer une branche ou un projet Supabase payant pour les tests Messenger.
- La solution gratuite déjà définie et partiellement exécutée est la pile Supabase locale éphémère lancée dans GitHub Actions : Supabase CLI épinglée à `2.122.1`, Docker fourni par le runner, GoTrue + JWT synthétiques, PostgREST/RLS, PostgreSQL local et Realtime local. Les migrations 001 et 003 sont appliquées uniquement à cette base jetable du workflow ; elles ne touchent pas au projet cloud. Cette architecture a déjà démarré et validé les tests HTTP/RPC/RLS dans les Lots 456 et 459 ; le dernier point restant est la réception CDC de l'événement Realtime.
- Les échecs actuels des workflows avec `runner_id=0` et `steps=[]` sont un problème d'attribution du runner GitHub, pas une raison de créer une branche Supabase. Les Lots 467–478 demandent de ne pas multiplier les relances ni de bricoler les workflows sans diagnostic. Les précédentes exécutions où un runner avait été attribué prouvent que le banc local a déjà fonctionné.
- Alternative locale gratuite déjà prévue dans les Lots 439–440 : exécuter le même harnais sur la machine de développement existante avec Docker, sans service cloud supplémentaire. Aucun achat, branche payante, nouveau projet, migration de production ou modification des secrets n'est nécessaire.
- La demande de confirmation de création d'une branche Supabase payante posée après le Lot 480 est annulée. La suite reprend le banc local gratuit existant et résout le blocage runner/Realtime sans facturation.

## Lot 481 — diagnostic des exécutions GitHub Actions et continuité du banc local gratuit (14 novembre 2026)

- Reprise à partir du HEAD de la branche `design/prototypes-67-74-alignment`, sans recommencer les lots précédents.
- PR #17 vérifiée : état `open`, fusionnée = `false`, base = `inconnue`, HEAD = `non exposé`. La PR reste ouverte et non fusionnée ; aucune action de fusion/fermeture n'a été effectuée.
- Les runs associés au commit de continuité `8a55482ece551c5335ea72ada9414adfcb423eb4` incluent :
  - `43584029260` — Tests intégration Supabase local — Messenger ;
  - `43584029258` — CI — ALLEMAND ;
  - `43584029216` — Tests PostgreSQL isolés — découverte Messenger ;
  - `43584029259` — Tests PostgreSQL isolés — ملتقى الطلاب ;
  - `43584029305` — Tests PostgreSQL isolés — consentement Messenger.
- Pour les trois premiers runs inspectés, GitHub retourne des jobs terminés en échec mais sans étapes (`steps=null`). La récupération des journaux de jobs renvoie `BlobNotFound`. Cela ne prouve pas une défaillance des tests : aucune étape de test n'est disponible à examiner. Ne pas classer ces exécutions comme des échecs SQL, RLS ou Realtime.
- Le workflow local gratuit reste inchangé : Supabase CLI épinglée à `2.122.1`, pile locale éphémère, comptes GoTrue synthétiques, PostgREST/JWT/RLS/PostgreSQL/Realtime ; aucune branche Supabase hébergée, aucun service payant.
- Relecture statique des fichiers `ci/msg-supabase-local-test.mjs`, `.github/workflows/msg-supabase-local-test.yml`, `ci/msg-supabase-local-bootstrap.sql`, migrations Messenger 001/003 et `ci/check-msg.mjs). Le test Realtime attend toujours à la fois l'ACK de jointure et le signal système `postgres_changes` avant de démarrer le délai de réception INSERT. Aucune preuve nouvelle ne permet de déclarer la réception Realtime réparée.
- La migration 003 continue de remplacer l'identifiant Auth exposé par un jeton opaque de découverte lié à l'acteur et valable cinq minutes. Les vérifications de ce lot sont statiques ; aucune exécution locale du banc n'a été possible depuis les runs sans étapes.
- Aucun changement de code, de schéma, de données, d'Auth, de RLS, de Realtime ou de secrets en production. Aucune migration 001/003 appliquée à Supabase actif. Aucun changement sur `main`.
- Prochaine action : rétablir un environnement d'exécution GitHub Actions qui fournit réellement un runner et des journaux, ou exécuter le même banc sur la machine de développement existante avec Docker. Une fois un runner opérationnel, reprendre par le workflow local Messenger et examiner les logs Realtime complets ; ne pas relancer aveuglément des lots ni modifier le protocole à partir d'une exécution sans étapes.

## Lot 482 — contrôle du workflow local et limites d'exécution disponibles (14 novembre 2026)

- Inspection du workflow `.github/workflows/msg-supabase-local-test.yml` : il cible explicitement `ubuntu-latest`, utilise Node 22, Supabase CLI `2.122.1`, démarre la pile Supabase locale, applique les migrations Messenger 001/003 uniquement à cette base éphémère, puis lance `ci/msg-supabase-local-test.mjs`. Les étapes de diagnostic `if: always()` capturent les slots, connexions PostgreSQL et journaux du conteneur Realtime.
- Les workflows PostgreSQL isolés utilisent également `ubuntu-latest` et un service PostgreSQL 17. Aucun runner auto-hébergé n'est requis par leur configuration. Les échecs sans étapes observés ne révèlent donc pas un défaut SQL ou une mauvaise configuration de service ; ils se produisent avant le démarrage des étapes du job.
- Vérification de l'environnement d'exécution disponible pour cette session : Node.js `v22.16.0` est présent, mais Docker et Supabase CLI ne sont pas installés et le dépôt n'est pas cloné dans cet environnement. Il est donc impossible d'exécuter honnêtement ici le banc Supabase local ou d'affirmer une validation runtime.
- Aucun changement apporté au workflow, aux migrations, à la configuration Supabase, aux secrets ou aux données. Aucun nouveau lancement aveugle des workflows.
- Conclusion opérationnelle : le code du workflow est configuré pour un runner GitHub hébergé standard ; le blocage actuel est la fourniture d'un runner/journaux par les exécutions GitHub observées. La voie gratuite prévue reste inchangée : attendre que GitHub fournisse un runner normal, ou utiliser la machine de développement existante avec Docker et le même banc local. Il n'y a aucun besoin de créer une branche Supabase hébergée ni d'activer une facturation.
- État PR #17 : ouverte, non fusionnée ; base `main`. Ne pas fusionner avant validation visuelle et runtime requise.

## Lot 483 — confirmation du dernier preview Cloudflare et nouvel échantillon des runs CI (14 novembre 2026)

- HEAD de la PR #17 : `e4897668821635d9c3259f37bc78c89052c464dc`; état `open`, fusionnée = `false`, base `main`. La PR reste ouverte et non fusionnée.
- Le commentaire automatique Cloudflare sur la PR confirme que le commit `e4897668821635d9c3259f37bc78c89052c464dc` a été construit et déployé avec succès en preview. URL stable de preview affichée : `https://design-prototypes-67-74-alignment-allemand.bridrandomtv.workers.dev`. Cela confirme la livraison du bundle Worker en environnement preview, pas le fonctionnement du flux Messenger ni une validation de production.
- Runs PR déclenchés sur ce HEAD :
  - `43584505476` — tests PostgreSQL isolés ملتقى الطلاب ;
  - `43584505462` — intégration Supabase local Messenger ;
  - `43584505589` — PostgreSQL consentement Messenger ;
  - `43584505565` — PostgreSQL découverte Messenger ;
  - `43584505558` — CI ALLEMAND.
- Inspection des jobs pour Messenger local (`132416011278`), CI (`132416011996`) et découverte PostgreSQL (`132416011348`) : tous sont terminés en échec avec `steps=null` et `logs_url=null`. Aucun script, commande ou étape de test n'a été exécuté selon les données disponibles. Ce nouvel échantillon confirme le blocage en amont de l'exécution ; il ne constitue pas un résultat de test applicatif.
- Relecture complémentaire du script d'intégration : le scénario synthétique ouvre le WebSocket avec le JWT du destinataire, attend l'ACK du canal et l'état système `postgres_changes`, vérifie l'accès RLS du destinataire, crée l'invitation via RPC, attend l'INSERT correspondant, puis annule l'invitation. Le test inclut également l'usage du jeton opaque de découverte, lié à l'acteur.
- Aucun changement de code ou de configuration déclenché par ce lot ; aucune migration Messenger appliquée en production, aucune modification Auth/RLS/Realtime/secret, aucun coût, aucun changement sur `main`.
- Conclusion : le preview Cloudflare de la branche est disponible ; le test Messenger Realtime reste non validé, car le runner GitHub n'a toujours pas fourni d'étapes ni de journaux. Reprendre dès qu'un run fournit un job réellement exécuté, ou depuis le poste local avec Docker et le banc gratuit existant. Ne pas assimiler le succès Cloudflare preview à une validation Messenger.

## Lot 484 — correction d'une assertion CI obsolète pour les invitations Messenger (14 novembre 2026)

- Audit croisé des sources actuelles `supabase/supabase.js`, `msg.js`, `ci/check-msg.mjs`, `ci/msg-supabase-local-test.mjs` et de la migration de découverte.
- Défaut confirmé : `msgInviteSend` accepte maintenant `studentKey` et appelle `msg_invite_send_by_key(p_student_key)`, mais un contrôle statique du lot précédent cherchait encore l'ancienne signature `msgInviteSend(recipientId)` et l'ancien RPC `msg_invite_send`. Ce contrôle aurait rejeté la nouvelle implémentation au prochain passage réel de la CI.
- Correction limitée dans `ci/check-msg.mjs` : assertion alignée sur la signature `studentKey` et sur l'appel RPC `msg_invite_send_by_key`. Les contrôles de versions CSS/JS ont été comparés aux références courantes de `index.html` et `sw.js` et restent cohérents (CSS v202, Messenger JS v3520).
- Commit de code : `705f30be460e4c195e976b7a49d7d363c1b75128`.
- La suite locale Supabase n'a pas été exécutée dans cet environnement : Docker et Supabase CLI ne sont pas disponibles ici. La correction est une mise en cohérence du test statique, pas une preuve de réception Realtime.
- Les workflows associés à ce commit ne sont pas encore retournés par l'API au moment de la rédaction. Aucun résultat d'exécution n'est revendiqué.
- Aucun changement de migration, schéma, données, Auth, RLS, publication Realtime ou secret en production ; aucun service payant ; aucun changement sur `main`.
- La PR #17 reste le seul canal de travail et doit rester ouverte/non fusionnée jusqu'à validation visuelle et fonctionnelle explicite.


## Lot 485 — jetons de découverte à usage unique (14 novembre 2026)

- Audit du flux de découverte Messenger : le jeton opaque était lié au compte demandeur et expirait après cinq minutes, mais pouvait être rejoué plusieurs fois pendant sa période de validité.
- Migration `202611130003_msg_student_discovery.sql` : ajout de `used_at` à `msg_discovery_targets` ; `msg_invite_send_by_key` consomme maintenant le jeton par un `UPDATE ... WHERE used_at IS NULL ... RETURNING` atomique. Un rejeu, un jeton expiré ou un jeton d'un autre acteur est rejeté. Si l'envoi de l'invitation échoue, la transaction annule également la consommation.
- Test d'intégration `ci/msg-supabase-local-test.mjs` : ajout d'un test négatif qui rejoue le même jeton après son premier usage et attend un refus.
- Contrôle statique `ci/check-msg.mjs` : assertions sur la consommation atomique et le test de rejeu.
- Commits code : migration `eddf385f3a4658b41825e68c0cd5581a8fe36e3d` ; test `5105a74df5f8de9638a70fc13eea57752888a7d1` ; contrôle statique `d184ac7d0078397294c5c5b9aaacd9c33fe3e7ec`.
- Les fichiers ont été relus sur la branche après écriture : les trois modifications sont présentes. La validation SQL/PostgreSQL réelle reste en attente d'un runner GitHub fonctionnel ; aucune exécution locale Docker n'est possible dans l'environnement actuel.
- Aucun déploiement de migration sur Supabase actif, aucun changement Auth/RLS/données/Realtime de production, aucun secret modifié, aucun service payant. `main` reste inchangée.
- PR #17 vérifiée après les commits : ouverte, non fusionnée, cible `main`, fusionnabilité signalée true.
- Les workflows observés sur le commit précédent `0ebabf0` ont échoué avant leurs étapes (`steps=null`) ; aucun runner n'a été attribué. Les commits de ce lot nécessitent encore leur propre exécution CI pour valider les tests.


## Lot 486 — cohérence des retours d'expiration (14 novembre 2026)

- Audit du cycle de vie : les RPC `msg_invite_decline` et `msg_invite_cancel` effectuaient d'abord la transition `pending → expired` pour une demande de plus de sept jours, puis retournaient `FOUND` après une seconde mise à jour `pending → declined/cancelled`. Cette seconde mise à jour ne trouvait aucune ligne ; l'API retournait donc `false` alors que l'expiration avait bien été enregistrée.
- Correction dans `202611130001_msg_invitation_consent.sql` : capture du `ROW_COUNT` de la première mise à jour et retour `true` si la transition vers `expired` a modifié une ligne. Le traitement des demandes encore valides reste inchangé.
- Ajout dans `ci/msg-invitation-postgres-test.sql` de deux scénarios isolés : annulation par l'expéditeur d'une demande expirée et refus par le destinataire d'une demande expirée. Ils vérifient le retour positif et le statut final `expired`.
- Contrôle statique `ci/check-msg.mjs` : assertions sur les deux RPC et lecture explicite du fichier SQL PostgreSQL. Une première révision de ce contrôle a omis la déclaration de `postgresSql`; elle a été corrigée avant clôture du lot.
- Commits : migration `c99f65a1cf4eb8bb8d9bce37bab7c2168e3739d7` ; tests PostgreSQL `0bf98985d55cb8f5745b80ab9255bab0dc0ccd98` ; assertions CI `40eec72b31f8b2699e81c93ce52df89857250d46` ; correction de la déclaration du fichier de test `f899f3d293e5b9b12059286475ab9c9dad092145`.
- Vérification GitHub : modifications relues sur la branche. L'exécution réelle PostgreSQL n'a pas été réalisée dans cet environnement ; les nouveaux tests attendent un runner disponible. Ne pas présenter les assertions statiques comme une validation runtime.
- Aucune migration appliquée au projet Supabase actif ; aucun changement de données, Auth, RLS, publication Realtime ou secret en production. Aucun service payant.
- PR #17 reste ouverte et non fusionnée, cible `main`. Aucun changement sur `main`.


## Lot 487 — idempotence des invitations et contrôle du quota (14 novembre 2026)

- Audit du cycle d'acceptation : les acceptations réciproques acquièrent le même verrou transactionnel de paire avant le verrou de ligne. La relecture `FOR UPDATE` vérifie le statut après attente. L'annulation/refus d'une invitation donnée se sérialise avec l'acceptation via le verrou de ligne PostgreSQL ; ce contrôle statique ne remplace pas un test concurrent à deux sessions.
- Défaut corrigé dans `msg_invite_send` : la recherche d'une invitation déjà pendante intervient désormais avant le contrôle du quota de 20 créations sur 24 h. Une répétition idempotente ne consomme pas une nouvelle création et ne doit pas échouer au plafond.
- Test ajouté à `ci/msg-invitation-postgres-test.sql` : crée une demande pendante, ajoute 20 invitations antérieures dans la fenêtre, puis vérifie que le même appel renvoie le même UUID. Les lignes de surcharge sont vieillies après le test afin de ne pas perturber les scénarios suivants.
). Correction en délimiteurs `$` ouvrant/fermant, et conservation du contrôle statique qui interdit cette régression.
- Validation : modifications versionnées uniquement sur la branche de PR. Aucun test PostgreSQL n'a été exécuté dans cette session (Docker/Supabase CLI indisponibles ici) ; le nouveau test reste à confirmer dans l'environnement PostgreSQL éphémère. Aucun changement sur Supabase actif, Auth, RLS, Realtime, secrets, facturation ou `main`. PR #17 reste ouverte et non fusionnée.


## Lot 488 — test concurrent à deux sessions PostgreSQL (14 novembre 2026)

- Audit du test existant : le scénario de quota du Lot 487 avait introduit quatre blocs PL/pgSQL avec délimiteurs `$` incomplets dans `ci/msg-invitation-postgres-test.sql`. Correction en `$$` ouvrant/fermant ; le contrôle statique vérifie désormais également le fichier de test.
- Nouveau script `ci/msg-invitation-concurrency-test.sh`, exécuté sur le PostgreSQL 17 éphémère du workflow, avec sessions `psql` distinctes et identités synthétiques : (1) acceptation simultanée de deux invitations réciproques, (2) annulation gagnante face à une acceptation, (3) acceptation gagnante face à une annulation.
- Synchronisation des courses par observation de `pg_stat_activity` pendant un `pg_sleep` dans un trigger temporaire de test ; vérification des statuts, du nombre de conversations directes par paire et des deux membres. Le trigger est supprimé par le nettoyage shell.
- Le workflow PostgreSQL exécute d'abord `bash -n` puis le test concurrent après le cycle de vie séquentiel. Le contrôle statique vérifie la présence des trois scénarios.
- Validation locale non exécutée dans cette session : aucun Docker/PostgreSQL/Supabase CLI disponible. Le test est versionné pour GitHub Actions ; aucun résultat vert n'est revendiqué. Le job PostgreSQL Messenger a été relancé une fois (run `43586374810`, tentative 2) : il a de nouveau échoué avant toute étape, avec `steps=null` et sans URL de logs ; cela confirme un échec d'allocation/exécution du runner, pas un échec du nouveau test SQL. Aucun test applicatif n'a donc été exécuté. Aucun changement Supabase actif, Auth, RLS, Realtime, secrets, facturation ou `main`. PR #17 reste ouverte et non fusionnée.


## Lot 489 — diagnostic différencié Realtime / GitHub Actions (14 novembre 2026)

- Vérification du dernier état de la PR #17 : ouverte, non fusionnée, cible `main`, `mergeable=true`. Le dernier déploiement Cloudflare Preview associé au commit `a46cb219f7ce920aa91b48d922db0ca22716967e` est annoncé Build Success / Deployment Success. Cela valide le build et le déploiement de prévisualisation, pas les tests PostgreSQL ni la réception Realtime.
- Les trois workflows du commit `a46cb21` ont échoué avant exécution : runs `43586472578` (PostgreSQL invitations), `43586472584` (Supabase local Messenger), `43586472636` (CI structurelle). Jobs `132421945043`, `132421945387`, `132421945741` ; l'API GitHub renvoie `steps=null` et le téléchargement des logs retourne `BlobNotFound`. Aucun runner/step/log exploitable n'est disponible ; il ne s'agit donc pas d'un échec démontré d'une assertion applicative.
- Vérification de la page officielle GitHub Status le 14 novembre : Actions est indiqué Operational et aucun incident n'est déclaré ce jour-là. La page d'historique mentionne toutefois des incidents Actions les 9 et 11 novembre, désormais résolus. Des discussions publiques récentes rapportent indépendamment la même signature `runner_id=0 / steps=null / BlobNotFound`, mais ces témoignages ne prouvent pas la cause de ce dépôt. Ne pas attribuer l'incident à GitHub sans confirmation.
- Audit du test concurrent Lot 488 : le script utilise bien quatre identités synthétiques supplémentaires (IDs 005–008 après les quatre fixtures 001–004 du test SQL), des sessions `psql` séparées et des verrous de ligne/advisory lock conformes aux trois ordres de course testés. Le raisonnement statique ne remplace pas son exécution réelle ; les scénarios restent NON VALIDÉS en runtime.
- Audit du test Realtime : le WebSocket attend séparément l'ACK Phoenix et le message système `postgres_changes/status=ok`, puis vérifie un véritable INSERT ciblé sur le destinataire. La ligne existe en base et est lisible par le destinataire, mais l'événement n'arrive pas. La publication, la PK et RLS avaient été contrôlées auparavant. Aucun correctif de schéma ou de réplication n'est justifié par les éléments disponibles.
- Recherche de changement Supabase pertinent : la note de version Docker Supabase `0.8.3` (16 octobre 2026) signale un défaut Realtime où les Postgres Changes peuvent être manqués pendant quelques secondes lors d'un redémarrage périodique de la connexion/replication. C'est une piste à confronter à la version réelle du conteneur Realtime de la pile locale, pas une explication démontrée d'une absence persistante d'événement. La CI épingle Supabase CLI `2.122.1` ; ne pas migrer vers CLI v3 dans ce lot.
- Décision technique : ne pas relancer en boucle les mêmes jobs et ne pas changer de runner/OS à l'aveugle. La prochaine vérification utile doit établir la version exacte du conteneur Realtime de la pile éphémère, ses logs de démarrage CDC et les métadonnées de la souscription avant de modifier le protocole ou le schéma.
- Aucun changement appliqué au projet Supabase actif, aucune migration, aucun changement Auth/RLS/données/publication/secret, aucun service payant, aucun changement sur `main`. PR #17 maintenue ouverte et non fusionnée.

- Addendum Lot 489 : après constat officiel « Actions Operational », relance ciblée du seul job PostgreSQL Messenger (job initial `132421945043`). La tentative `132422867634` a de nouveau terminé en échec avec `steps=[]` ; aucun test n'a démarré. La disponibilité générale annoncée par GitHub Status ne garantit donc pas que ce job précis obtienne un runner. Arrêt des relances répétitives ; conserver les preuves de run/job pour une éventuelle demande d'assistance GitHub.


## Lot 490 — instrumenter la version réelle de Realtime (14 novembre 2026)

- Réexamen du workflow `.github/workflows/msg-supabase-local-test.yml` : la pile est créée par Supabase CLI `2.122.1`, mais le dépôt ne consignait pas explicitement l'image Docker Realtime réellement tirée par cette version du CLI. Il était donc prématuré d'affirmer que le défaut de Realtime Docker 0.8.3 affectait le test.
- La documentation officielle Supabase Docker distingue deux cas : la version Realtime `v2.143.3` (Docker 0.8.3, 16 octobre) avait un défaut de reconnexion périodique pouvant manquer les changements pendant quelques secondes toutes les 10 minutes ; le changelog Docker 0.8.4 du 5 novembre annonce le correctif dans Realtime `v2.148.3`. Il faut comparer cette plage à l'image effective du runner avant de retenir cette hypothèse.
- Instrumentation ajoutée à l'étape de capture des logs du workflow : image configurée, image ID/digest, labels de build, date de démarrage et état du conteneur ; interrogation du health endpoint Realtime interne ; puis les 300 dernières lignes des journaux. Les diagnostics restent non sensibles : aucune valeur d'environnement complète, clé API, JWT ou mot de passe n'est imprimé.
- Le workflow continue d'utiliser le Supabase CLI épinglé `2.122.1`. Aucun changement de version d'image forcé, aucune mise à niveau CLI, aucun contournement de Realtime et aucune modification de schéma ne sont introduits avant d'avoir identifié le binaire exact.
- Les runs précédents n'ayant pas alloué de runner (`steps=[]`), cette instrumentation est ajoutée mais pas encore exécutée. La réception Realtime et les scénarios concurrents restent NON VALIDÉS en runtime.
- Aucune modification du projet Supabase actif, des données, Auth, RLS, migrations, publication, secrets ou facturation. Aucun changement sur `main`. PR #17 conservée ouverte et non fusionnée.


## Lot 491 — recoupement des versions officielles Realtime et état des contrôles (14 novembre 2026)

- Relecture indépendante des notes officielles Supabase Docker : la version 0.8.3 du 16 octobre épingle `supabase/realtime:v2.143.3` et décrit un défaut de reconnexion périodique de la connexion DB / réplication Postgres Changes, avec perte temporaire d'événements toutes les dix minutes. La version Docker 0.8.4 du 5 novembre met à jour Realtime vers `v2.148.3` et annonce explicitement le correctif de ce défaut.
- Le dépôt amont Realtime publie des versions ultérieures, jusqu'à `v2.161.0` le 13 novembre. Cela ne prouve pas que le CLI local épinglé `2.122.1` tire l'une de ces versions : seule l'image inspectée dans le runner (image configurée, image ID/digest, labels) permettra de trancher.
- Vérification GitHub du HEAD PR #17 : `035bc9e757779391b9023e80ec455aa2778b1a2d`, PR ouverte, non fusionnée, cible `main`, `mergeable=true`. Le statut combiné de ce SHA ne renvoie aucun status check et la recherche de runs PR associée ne renvoie aucun workflow. Cela ne démontre ni succès ni échec du test ; aucun runtime Realtime n'est validé.
- Relecture du test `ci/msg-supabase-local-test.mjs` : il attend séparément l'ACK Phoenix et le signal système `postgres_changes/status=ok`, inspecte ensuite `realtime.subscription`, crée une invitation via RPC, vérifie sa présence côté service_role et sa lecture côté destinataire, puis attend l'INSERT correspondant. La capture de timeout inclut les frames reçues et un contrôle tardif de la souscription CDC.
- La configuration du workflow `.github/workflows/msg-supabase-local-test.yml` contient désormais la capture de l'image effective, de son digest/labels, du health endpoint et des 300 dernières lignes du journal Realtime. L'instrumentation n'a pas encore été exécutée faute de job avec étapes et logs exploitables.
- Conclusion : la piste Realtime v2.143.3 est techniquement cohérente avec le symptôme, mais reste non confirmée pour notre pile locale. Ne pas forcer une version Realtime, ne pas modifier le schéma/la publication/RLS et ne pas modifier le protocole avant d'avoir la preuve de l'image et des logs.
- Aucun changement sur Supabase actif, Auth, RLS, schéma, données, publication, secrets ou facturation. Aucun changement sur `main`, aucune fusion PR #17, aucun déploiement de production. PR #17 reste ouverte et non fusionnée.
- Prochaine étape : obtenir une exécution effective du workflow instrumenté (ou lancer le même workflow sur un poste disposant déjà de Docker), puis comparer l'image/digest réellement démarrée aux versions v2.143.3 et v2.148.3 et lire les journaux CDC avant toute correction.


### Addendum Lot 491 — divergence de la branche constatée après documentation

- Comparaison GitHub au 14 novembre : la branche de PR #17 est en avance de 2 766 commits et en retard de 4 commits sur `main` (état `diverged`, base commune `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`). Les quatre commits propres à `main` touchent uniquement `brand/85.PNG`, `brand/86.jpeg` et `brand/87.jpeg` ; aucune modification des workflows, scripts de test, migrations ou fichiers Messenger n'apparaît dans ce delta de `main`.
- Après les commits documentaires Lot 491, GitHub a momentanément retourné `mergeable=false` pour la PR. Ne pas interpréter ce champ seul comme une preuve de conflit de contenu : la branche est simplement en retard de quatre commits, et l'API peut recalculer l'état de fusion. Aucune mise à jour de base, rebase, fusion ou modification de `main` n'a été effectuée.
- Décision conservatoire : garder la PR ouverte et ne pas la rebaser automatiquement ; vérifier à nouveau le statut de fusion après stabilisation de GitHub et avant toute demande de revue. Le travail Messenger continue sur la branche dédiée.


## Lot 492 — cinq nouvelles exécutions Actions sans allocation d'étapes (14 novembre 2026)

- Après le commit documentaire `4d9b1d9f63a7fb7e6c8eacc0acea06929846e8b0`, cinq workflows ont été associés au HEAD de la PR :
  - Supabase local Messenger : run `43587502337`, job `132425048004`.
  - Découverte Messenger PostgreSQL : run `43587502316`, job `132425048025`.
  - Consentement / invitations PostgreSQL : run `43587502354`, job `132425048084`.
  - CI structurelle : run `43587502331`, job `132425048057`.
  - ملتقى الطلاب PostgreSQL : run `43587502323`, job `132425047926`.
- Les cinq runs sont terminés en échec. L'API GitHub renvoie `steps=[]` pour chacun des cinq jobs. Le téléchargement des journaux du job Supabase local Messenger échoue avec HTTP 404 `BlobNotFound` (horodatage API 10:55:51 UTC) ; les runs ne fournissent donc aucun log d'étape, aucune trace Docker et aucune sortie SQL. Le résultat est un défaut d'exécution/allocation en amont des étapes, pas un test applicatif rouge.
- La relance en boucle est suspendue : les cinq échecs concordants ne justifient pas de nouvelles tentatives identiques. Conserver les IDs des runs/jobs comme éléments de diagnostic pour une éventuelle demande au support GitHub.
- Revue statique complémentaire du script `ci/msg-invitation-concurrency-test.sh` : trois courses sont couvertes (acceptations réciproques, annulation gagnante, acceptation gagnante). Le verrou advisory de paire dans `msg_invite_accept` sérialise les acceptations réciproques ; les scénarios acceptation/annulation attendent le verrou de ligne et contrôlent l'état final. Le trigger de pause `pg_sleep` rend la fenêtre de concurrence observable. Aucun défaut statique décisif n'a été confirmé dans ce script ; les trois scénarios restent NON VALIDÉS faute d'exécution PostgreSQL.
- Revue statique du workflow Supabase local : le diagnostic de l'image, du digest, de la santé et des journaux Realtime est bien placé en `if: always()` et `continue-on-error: true` pour les inspections non bloquantes. Il ne peut toutefois produire de preuve lorsque le runner n'exécute aucune étape.
- État PR #17 revérifié après ces runs : ouverte, non fusionnée, `mergeable=true`, HEAD `4d9b1d9f63a7fb7e6c8eacc0acea06929846e8b0`. Comparaison avec `main` : branche divergente, 2 767 commits en avance et 4 en retard. Aucun rebase ni changement sur `main`.
- Aucun test PostgreSQL ou Realtime n'a été exécuté dans ces cinq runs ; aucune version réelle du conteneur Realtime n'a donc été récupérée. L'hypothèse du défaut v2.143.3 demeure non confirmée.
- Aucun changement du projet Supabase actif, d'Auth, RLS, publication, données, secrets ou facturation. Aucun déploiement de production. PR #17 reste ouverte et non fusionnée.
- Suite : ne pas confondre les échecs sans étapes avec les résultats des tests. Reprendre l'exécution uniquement quand un runner fournit une étape/log exploitable, ou reproduire la pile sur un environnement local Docker déjà disponible. À la première exécution réelle, relever l'image/digest Realtime et les journaux CDC avant tout correctif.



## Lot 493 — audit de compatibilité Messenger client / Supabase actif (14 novembre 2026)

- Audit réalisé sans modification de code ni écriture dans Supabase. PR #17 observée ouverte et non fusionnée ; HEAD avant documentation : `f231057ecc7d68b30d29b020848b51cb193b00d7`.
- Comparaison historique : au commit `66ee5cd5d3c407e5768d2d244c5c42ab0e7b4867`, avant l'ajout du centre des invitations, `msg.js` ne contenait ni appel à `msgInvites()` ni parcours `msgStudentSearch()`. Le client `supabase/supabase.js` de cette révision n'appelait pas les RPC d'invitation/découverte. La base active conserve aujourd'hui l'ancien contrat avec `msg_open_direct(uuid)` et `msg_can_dm(uuid,uuid)`.
- Historique précis du décalage :
  - Commit `a4c33ea0b57a423347c449dfd8a9995514f5d441` : ajout dans le client des appels à `msg_invites`, `msg_invite_send`, `msg_invite_accept`, `msg_invite_decline`, `msg_invite_cancel`. Le commentaire du code précise que le centre est disponible après migration serveur.
  - Commit `614340fb0c1874131e3a3261255a817f309014f5` : appel inconditionnel à `msgInvites()` depuis le rendu de la liste et affichage du centre des invitations.
  - Commit `cd12f4ea73cd34f5e0cf229144f12a405e024124` : ajout de la recherche de camarades et du parcours d'envoi.
  - Commit `a24dabcae19c72c9c960513723dd8b02f741ea72` puis `cfea362aad8ca605adffe19c880e8cecb3b46727` / `b5806bac17123609fd8d1dc90ae1f08ec51e7e4f` : remplacement du contrat par jeton opaque ; le client appelle désormais `msg_student_search` et `msg_invite_send_by_key`.
- Contrôle en lecture seule du projet Supabase actif le 14 novembre :
  - `to_regclass('public.msg_invites')`, `msg_discovery_limits` et `msg_discovery_targets` retournent tous `NULL` : les tables du nouveau parcours sont absentes.
  - Le catalogue `public` contient `msg_open_direct(p_other uuid)` et `msg_can_dm(a uuid,b uuid)`, mais aucune des RPC `msg_student_search`, `msg_invite_send_by_key`, `msg_invite_send`, `msg_invite_accept`, `msg_invite_decline` ou `msg_invite_cancel`.
  - L'historique des migrations actives ne contient pas les migrations de branche `202611130001_msg_invitation_consent.sql` ni `202611130003_msg_student_discovery.sql`.
  - La définition de `msg_open_direct` reste présente et contrôle `msg_can_dm` avant de créer/réutiliser un DM. Aucune ligne de compte, de profil, de conversation ou de message n'a été lue.
- Conséquence confirmée : le client actuel utilise un contrat serveur non déployé. L'ouverture de la liste tente de lire `msg_invites` et affiche le message d'indisponibilité du centre ; les élèves vérifiés voient une recherche dont la RPC n'existe pas ; l'envoi/acceptation/refus/annulation des invitations ne peut pas fonctionner sur la base active. Cela ne prouve pas que la lecture des groupes ou des anciennes conversations est cassée : ces parcours sont distincts et doivent être testés séparément.
- Cause à distinguer du problème GitHub Actions : les jobs sans étapes expliquent l'absence de tests automatisés, mais ne causent pas le décalage client/base ci-dessus. L'hypothèse de version Realtime n'est pas nécessaire pour expliquer l'échec des invitations.
- Décision de sécurité : ne pas appliquer les migrations à Supabase actif et ne pas réactiver silencieusement `msg_open_direct` depuis le client pour contourner le consentement. Le nouveau flux doit soit être masqué/neutralisé tant que son backend n'est pas déployé, soit être déployé après validation PostgreSQL isolée et autorisation explicite distincte.
- Aucun code applicatif modifié dans ce lot. Seul ce dossier de continuité est mis à jour sur la branche. Aucun changement Supabase actif, Auth, RLS, schéma, données, Realtime, secrets, facturation, `main` ou déploiement de production. PR #17 reste ouverte et non fusionnée.
- Prochaine étape recommandée : décider de la stratégie de compatibilité avant toute modification : (A) retour temporaire au parcours client historique compatible avec la base actuelle, en examinant séparément les garanties de consentement ; ou (B) finalisation des migrations et tests PostgreSQL isolés, puis demande d'autorisation avant application au projet actif. Aucun choix n'est appliqué par ce lot.



## Lot 494 — précision des droits du contrat historique actif (14 novembre 2026)

- Complément de l'audit SQL en lecture seule du projet Supabase actif. Cette vérification affine le Lot 493 : le backend historique n'est pas simplement « sans vérification scolaire ».
- Le catalogue actif confirme :
  - `msg_can_dm(uuid,uuid)` exige déjà un utilisateur authentifié membre de la paire, des profils de même wilaya/niveau/filière et `verif_statut='verifie'` pour les deux profils.
  - `msg_member_ok(bigint,uuid)` autorise encore le parcours historique d'ajout des membres à un DM, en s'appuyant sur `msg_can_dm` et l'état des membres.
  - `msg_open_direct(uuid)` est toujours exécutable par `authenticated` et crée/réutilise un DM après `msg_can_dm`. Il ne requiert pas une invitation explicitement acceptée.
  - `msg_is_member` et `msg_not_blocked` restent les définitions historiques et ne sont pas encore remplacées par les versions du Lot 437.
- Conclusion affinée : l'ancien backend impose déjà une vérification scolaire bilatérale, mais n'impose pas encore le nouveau consentement explicite côté serveur. Le nouveau frontend attend `msg_invites` et les RPC de consentement/découverte qui sont absentes. La migration 001 est précisément conçue pour remplacer ce contrat : révoquer `msg_open_direct`, verrouiller l'ajout direct de membres et créer les RPC d'invitation.
- Ne pas confondre « l'ancien parcours peut encore fonctionner » et « le nouveau parcours est opérationnel ». L'ancien chemin ne doit pas être remis dans le nouveau frontend comme contournement du consentement.
- Aucun changement effectué sur Supabase actif. Aucun test d'action (création de DM, invitation, message, publication Realtime) n'a été exécuté : seulement lecture du catalogue, définitions et privilèges. Aucune donnée utilisateur consultée.
- Aucun code applicatif modifié. Seul le dossier de continuité est mis à jour sur la branche. PR #17 reste ouverte/non fusionnée ; `main`, production, données, schéma, RLS, Auth, Realtime et facturation inchangés.
- Étape suivante : exécuter les migrations 001 + 003 sur une instance PostgreSQL/Supabase locale jetable, vérifier les droits avant/après et faire passer les tests d'intégration et de concurrence. Tant que les runners GitHub n'exécutent aucun step, ne pas interpréter l'absence de résultat comme un échec fonctionnel SQL. Pas de déploiement actif sans autorisation distincte.



## Lot 495 — revue statique des migrations et capacité d'exécution isolée (14 novembre 2026)

- Relecture complète de `202611130001_msg_invitation_consent.sql`, `202611130003_msg_student_discovery.sql`, `ci/msg-supabase-local-bootstrap.sql`, `.github/workflows/msg-supabase-local-test.yml`, `ci/msg-supabase-local-test.mjs` et `ci/msg-invitation-concurrency-test.sh`.
- Contrat client / SQL vérifié statiquement :
  - `msgInvites()` lit les sept colonnes effectivement créées dans `msg_invites`, avec filtre participant.
  - `msgInviteSend(studentKey)` appelle `msg_invite_send_by_key(p_student_key)`, qui consomme atomiquement le jeton lié à l'acteur puis appelle `msg_invite_send`.
  - Acceptation/refus/annulation appellent les RPC et paramètres présents dans la migration 001.
  - `msgStudentSearch(query,limit)` appelle `msg_student_search(p_query,p_limit)`, dont le contrat renvoie le jeton opaque et les quatre champs de profil prévus.
  - Le contrôle des profils vérifiés et l'égalité wilaya/niveau/filière est refait côté serveur ; les tables de jetons et de limites n'accordent aucun accès direct aux rôles publics.
  - La migration 001 révoque l'ouverture directe historique et l'ajout client de membres DM ; le trigger n'autorise les membres d'un nouveau DM que lorsqu'une invitation acceptée référence cette conversation.
- Revue de concurrence : le verrou consultatif par paire dans `msg_invite_accept` sérialise les acceptations réciproques ; les mises à jour `FOR UPDATE` permettent à acceptation/refus/annulation de converger sur un seul statut. Le script couvre les trois courses opposées. Cela reste une analyse du code, pas un test exécuté.
- Le workflow local est conçu pour démarrer une pile Supabase CLI éphémère, retirer temporairement les migrations générales, installer le fixture synthétique Messenger, appliquer seulement les migrations 001/003, puis tester Auth/JWT, PostgREST, RLS, recherche, consentement, Realtime et concurrence. Aucun secret ou identifiant réel ne devrait être utilisé par le fixture.
- Limite d'exécution constatée dans cet environnement : aucun binaire `psql`, `postgres` ou `docker` n'est disponible. Dans le projet Supabase connecté, `list_branches` ne retourne que la branche `main` ; aucune base de développement isolée déjà existante n'est disponible. La création d'une branche Supabase peut générer des frais horaires ; elle n'a pas été demandée ni tentée. Les jobs GitHub précédemment consultés n'avaient enregistré aucune étape, et leurs logs n'étaient pas récupérables (404 BlobNotFound). En conséquence, aucune preuve d'exécution SQL isolée n'est disponible à ce stade.
- Aucun défaut SQL supplémentaire certain n'a été établi par cette revue statique ; aucun résultat PASS ne doit être revendiqué. Les scénarios négatifs et Realtime restent à exécuter dans l'environnement éphémère du workflow.
- Aucun changement de code ou de schéma. Aucune action d'écriture sur Supabase actif. Seul le dossier de continuité est mis à jour sur la branche ; `main`, production, Auth, RLS, données, Realtime, facturation et PR #17 (ouverte/non fusionnée) restent inchangés.
- Prochaine étape sans coût Supabase supplémentaire : faire exécuter le workflow d'intégration local par GitHub Actions lorsqu'un runner est disponible, puis exploiter les vrais logs/artefacts. Ne pas déclarer le système validé tant que les tests SQL, Auth, RLS, Realtime et concurrence ne sont pas réellement passés.



## Lot 496 — diagnostic des exécutions GitHub Actions (14 novembre 2026)

- Vérification des cinq workflows associés au HEAD `c705eae674276d16b9683b888272883ea2385d52` :
  - Messenger Supabase local : run `43588318883`, job `132427473975`
  - Tests PostgreSQL `ملتقى الطلاب` : run `43588318866`, job `132427473888`
  - CI générale : run `43588318848`, job `132427473959`
  - Découverte Messenger : run `43588318936`, job `132427474212`
  - Consentement Messenger : run `43588318962`, job `132427474220`
- Les cinq runs ont été déclenchés par `pull_request`, créés vers 11:05:08 UTC et terminés vers 11:05:11 UTC (durée observée d'environ trois secondes pour le run Messenger local). Pour chacun, l'API Jobs renvoie `status=completed`, `conclusion=failure`, `steps=null` et `logs_url=null`.
- Tentative de récupération des cinq journaux via l'API GitHub : chaque téléchargement renvoie HTTP 404 `BlobNotFound`. Aucune trace de checkout, setup-node, Supabase CLI, psql ou test applicatif n'est exposée.
- Conclusion strictement étayée : ces cinq exécutions n'apportent aucune preuve d'un échec dans le SQL Messenger, Realtime ou les tests métier, car aucune étape de workflow n'est disponible. Le point de blocage est antérieur à toute étape visible du job ; la cause précise (runner/plateforme/permissions ou autre) reste inconnue. Ne pas présenter ces échecs comme des tests SQL exécutés et ratés.
- L'état PR relu après actualisation indique `mergeable=true`, `state=open`, `merged=false`. La comparaison de branches reste `diverged` avec 2 771 commits en avance et 4 en retard. Le booléen mergeable est une appréciation GitHub, pas une validation produit ni une autorisation de fusion.
- Aucun endpoint de lancement `workflow_dispatch` n'est exposé par les actions GitHub disponibles dans cette session. Aucun rerun n'a été demandé, afin d'éviter de multiplier des exécutions potentiellement facturées sans avoir résolu l'absence d'étapes/logs.
- Aucun code applicatif, workflow, configuration, branche Supabase ou donnée n'a été modifié. Seul ce dossier est complété. `main`, Supabase actif, production et PR #17 restent inchangés et la PR demeure ouverte/non fusionnée.
- Suite : déterminer pourquoi GitHub Actions termine les jobs avant la première étape (état des runners/permissions/quota dans l'interface du dépôt), puis relancer une seule exécution contrôlée du workflow local. Une fois les étapes exécutées, traiter les éventuels vrais défauts SQL/Realtime révélés.


## Lot 497 — neutralisation de l'interface Messenger non prise en charge par le backend actif (14 novembre 2026)

- Relecture ciblée du parcours réel dans `msg.js` et `supabase/supabase.js`. Le rendu de la liste appelait `msgInvites()` (table `msg_invites`) et affichait en parallèle le formulaire de recherche de camarades à tout élève vérifié, même lorsque le backend ne disposait pas des migrations de consentement et de découverte.
- Le contrôle du projet Supabase actif documenté au Lot 493 établit que `msg_invites`, `msg_discovery_limits`, `msg_discovery_targets` et les RPC correspondantes sont absentes. Le formulaire de recherche et le centre d'invitations étaient donc visibles alors qu'ils ne pouvaient pas fonctionner sur le backend actif. Ce défaut d'expérience est distinct de l'échec des runners GitHub Actions.
- Correctif appliqué uniquement à `msg.js` sur la branche de PR : le résultat de `msgInvites()` est maintenant récupéré une seule fois et réutilisé pour le rendu ; le formulaire de recherche de camarades n'est affiché que si le centre d'invitations répond correctement ; lorsque le backend ne prend pas en charge le consentement, l'élève reçoit un message explicite, et les groupes ainsi que les conversations existantes restent rendus normalement. Aucun retour à `msg_open_direct` ni contournement de l'acceptation explicite n'est introduit.
- Vérifications statiques locales du texte modifié : un seul appel `msgInvites()` dans le rendu, formulaire de recherche conditionné par `inv.ok`, message de repli de sécurité présent, et réutilisation du même résultat pour le centre des invitations. Ces assertions portent sur le contenu source ; elles ne remplacent pas un test navigateur ou une exécution PostgreSQL.
- Commit applicatif : `f1fd68a1f6e6d657b87d85bac94fc446196811f1`.
- Aucun changement sur Supabase actif, Auth, RLS, schéma, données, Realtime, secrets, facturation, `main` ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Suite : obtenir un vrai runner pour exécuter les tests isolés des migrations 001/003, puis décider séparément de la validation et de l'éventuel déploiement backend. Le présent correctif améliore le repli UI mais ne rend pas les invitations opérationnelles tant que le backend n'est pas déployé.

- Ajustement de finition après vérification du rendu source : suppression du message de repli redondant afin de ne présenter qu'une seule alerte lorsque le backend d'invitations est indisponible. Commit complémentaire : `8aa3818cea86bdf1a64ae16e614b6e9975753bef`. Le contrôle statique confirme un seul appel `msgInvites()`, un formulaire de recherche conditionné par `inv.ok` et une seule alerte de repli.


## Lot 498 — rattrapage des messages après abonnement Realtime (14 novembre 2026)

- Revue ciblée du cycle de vie des conversations : `renderThread()` charge les 50 derniers messages avant de démarrer le canal Realtime. Un message pouvait donc être publié après la lecture initiale mais avant que l'abonnement soit confirmé ; dans cette fenêtre, l'événement INSERT pouvait être manqué et le message ne pas apparaître avant une actualisation manuelle.
- Correctif sur la branche de PR : à chaque état `SUBSCRIBED` (abonnement initial ou reconnexion), le client relit les 50 derniers messages, compare leurs identifiants aux lignes déjà affichées et ajoute uniquement les messages manquants. Les contrôles d'époque du canal et de conversation empêchent une réponse asynchrone d'une ancienne conversation de modifier la vue courante. Les états `CHANNEL_ERROR` et `TIMED_OUT` affichent désormais une indication de connexion instable.
- Le rattrapage réutilise les fonctions existantes `msgMessages`, `fetchNames`, `attachmentsFor` et `rowHtml` ; aucune nouvelle dépendance ni RPC n'est introduite. Les droits de lecture restent déterminés par RLS et le rattrapage ne crée ni conversation ni membre.
- Vérifications statiques réalisées avant commit : présence de la lecture de rattrapage, déduplication par `data-mid`, garde d'époque/conversation et traitement des états d'erreur du canal. Aucun test navigateur, test multi-utilisateur ou test Realtime réel n'a été exécuté dans cette session ; ne pas présenter ce correctif comme une validation de transport.
- Commit applicatif : `fef181db62dfa7a43e24ffb23350cdc60eaf76bf`.
- Aucun changement sur Supabase actif, Auth, RLS, schéma, données, secrets, facturation, `main` ou déploiement Cloudflare. PR #17 reste ouverte et non fusionnée.
- Suite : vérifier les mises à jour/suppressions pendant une reconnexion et tester deux sessions réelles lorsque le runner isolé sera disponible. Examiner séparément le statut de fusion PR #17 ; ne pas rebaser ou fusionner automatiquement la branche fortement divergée.


## Lot 499 — réconciliation des messages après reconnexion et signalement Realtime des pièces jointes (14 novembre 2026)

- Reprise sur le HEAD de la PR #17 et audit ciblé de `msg.js`, `supabase/supabase.js`, `supabase/msg_schema.sql`, ainsi que du catalogue PostgreSQL actif en lecture seule.
- Défaut confirmé dans le rattrapage du Lot 498 : après `SUBSCRIBED`, le code ajoutait uniquement les identifiants absents du DOM. Il ne remplaçait pas le contenu des messages déjà affichés et ne retirait pas les messages supprimés pendant la déconnexion. Une édition ou suppression hors ligne pouvait donc laisser un affichage périmé jusqu'au prochain rendu complet.
- Correctif `msg.js` : après l'établissement ou le rétablissement de l'abonnement, appeler le rendu serveur complet du fil avec `keepChannel=true`. Le fil relit les 50 derniers messages non supprimés, récupère les noms et URL signées des pièces jointes, puis reconstruit la vue sans détruire/récréer le canal courant. Les éditions et suppressions hors ligne sont ainsi réconciliées avec l'instantané serveur.
- Défaut pièces jointes confirmé : l'envoi créait d'abord le message, puis le fichier et la ligne `msg_attachments`, mais ne modifiait jamais le message. Le destinataire pouvait recevoir l'INSERT Realtime du message avant la création de la pièce jointe ; aucune publication Realtime de `msg_attachments` n'est présente dans la publication active consultée. Il pouvait donc voir le texte « 📎 nom-du-fichier » sans recevoir l'aperçu/le lien avant un rafraîchissement.
- Correctif `supabase/supabase.js` : l'insertion de la pièce jointe retourne désormais son identifiant, puis met à jour `msg_messages.attachment_id`, avec filtre sur message, conversation, expéditeur et message non supprimé. Cette UPDATE utilise `msg_messages`, table déjà présente dans `supabase_realtime`, et déclenche le handler UPDATE existant qui recharge le fil et ses URL signées. Le code signale aussi le cas où aucune ligne du message n'est modifiable.
- Vérifications catalogue actives en lecture seule : les quatre tables `msg_messages`, `msg_attachments`, `msg_conversations`, `msg_members` existent ; `msg_messages.attachment_id` existe ; `msg_messages` et `msg_conversations` figurent dans `supabase_realtime`, tandis que `msg_attachments` n'y figure pas. La politique active UPDATE de `msg_messages` comporte `USING` et `WITH CHECK` limités à l'expéditeur membre ou au modérateur. Aucune donnée de message ou de compte n'a été lue.
- Contrôles statiques après écriture : vérification des deux parcours de réconciliation et de liaison d'identifiant, ainsi que du filtrage par conversation/expéditeur. Ces contrôles ne remplacent pas un test navigateur avec deux comptes ni une exécution de bout en bout Realtime/Storage.
- Aucun changement SQL, migration, Auth, RLS, donnée, Storage ou publication Realtime n'a été exécuté sur Supabase actif. Aucun déploiement Cloudflare, dépense, modification de `main`, fusion ou rebase.
- PR #17 vérifiée après les commits : ouverte, non fusionnée ; GitHub retourne actuellement `mergeable=true`. Les valeurs d'avance/retard sont conservées dans la réponse de comparaison associée à ce lot ; ne pas réutiliser les anciennes valeurs de Lots 497/498 sans nouvelle comparaison.
- Commits du lot : `a53912a38de392ff91ca4b8a39c932b1b1f0a17a` (réconciliation Messenger), puis `46e4c0bf699fee91cdc108e04a9bdaa55337d69d` (liaison pièce jointe). Le dossier de continuité est ensuite mis à jour dans un commit distinct.
- Étape suivante : exécuter le workflow d'intégration local lorsque GitHub Actions fournit un runner exploitable ; sinon préparer des tests unitaires statiques ciblés du cycle upload → lien message → UPDATE Realtime et des scénarios d'édition/suppression hors ligne, sans toucher à la base active.


## Lot 500 — commandes personnelles d'édition et de suppression (14 novembre 2026)

- Audit du fil réel : `msgEdit` et `msgDelete` existaient dans `supabase/supabase.js` et étaient exposées dans `window.SB`, mais `rowHtml` ne rendait aucune action pour l'expéditeur et le gestionnaire de clics ne traitait pas ces actions.
- Défaut de contrat supplémentaire : les deux fonctions faisaient un UPDATE filtré par identifiant/expéditeur, mais retournaient `ok:true` dès lors que PostgREST ne retournait pas d'erreur, même si zéro ligne avait été modifiée (message inexistant, déjà supprimé ou filtre RLS sans ligne visible).
- Correctif interface dans `msg.js` : les messages de l'utilisateur courant affichent désormais des commandes modifier/supprimer ; les messages d'autrui gardent uniquement le signalement. Les commandes sont déléguées par le gestionnaire de clic existant, contrôlent que la ligne DOM est bien marquée comme appartenant à l'utilisateur courant, utilisent une confirmation pour la suppression et limitent la saisie d'édition à 1–2000 caractères. La suppression reste logique via `deleted_at`, pas un DELETE physique.
- Correctif client Supabase : `msgEdit` valide le texte, demande la ligne affectée avec `select('id').maybeSingle()` et ne retourne le succès que si une ligne existe. `msgDelete` applique le même contrat de résultat et exige `deleted_at IS NULL` avant la mise à jour. Les filtres expéditeur/ID restent en place ; RLS continue de décider l'autorisation effective.
- Contrôles statiques après écriture : commandes visibles uniquement sur les messages marqués comme propres, délégation des deux actions, vérification de propriété côté DOM, appel aux fonctions existantes, retour de succès conditionné à une ligne affectée, longueur maximale et suppression logique. Pas de test navigateur, multi-compte, ni exécution PostgREST/Realtime en direct.
- Aucun changement SQL/migration/RLS, aucune écriture Supabase, aucune donnée de compte/message lue, aucun déploiement Cloudflare, aucune dépense, aucun changement de `main`, aucun rebase ou merge.
- Commits applicatifs : `db6d517f132d480227990bebc9fbe9adcbfb1f9a` (actions d'interface) et `fdad5d09169dc42a0549c365ae2e3fdfce546f2b` (contrat de succès du client).
- Suite : audit de la politique UPDATE réellement active sur les messages et vérification de la propagation Realtime de l'édition/suppression ; tests d'intégration isolés dès qu'un runner fiable est disponible.

## Lot 501 — stabilité des réconciliations Realtime et audit du cycle Storage (14 novembre 2026)

- Audit du code actuel : le handler Realtime UPDATE de `msg_messages` appelait `renderThread(id)` sans `keepChannel`. Or `renderThread` démarre un nouveau canal lorsque ce paramètre est absent ; chaque édition, suppression logique ou liaison de pièce jointe pouvait donc fermer puis recréer l'abonnement courant. Cela n'améliorait pas la réconciliation des données et augmentait inutilement le churn des canaux.
- Correctif applicatif : le handler UPDATE appelle désormais `renderThread(id, true)`, ce qui recharge l'instantané serveur (messages non supprimés et métadonnées des pièces jointes) tout en conservant l'abonnement Realtime existant. Les rafraîchissements après édition/suppression conservent également le canal.
- Correctif de concurrence UI : les actions d'édition/suppression capturent maintenant l'identifiant de conversation au moment du clic. Leur callback ne rafraîchit plus une conversation différente si l'utilisateur a navigué pendant la requête.
- Audit SQL actif strictement en lecture seule : la politique `msg storage upload` exige les chemins `msg/<conversation_id>/...`; la politique `msg storage lecture` vérifie le deuxième dossier comme identifiant de conversation et autorise les membres/modérateurs. En revanche, la politique `owner delete` exige que le premier dossier soit l'UUID de l'utilisateur. Elle ne correspond donc pas aux chemins des pièces jointes Messenger et ne permet pas à leur expéditeur de les supprimer via cette politique.
- Conséquence opérationnelle : si l'upload Storage réussit puis que l'insertion `msg_attachments` ou la liaison `msg_messages.attachment_id` échoue, le client ne peut pas compenser en supprimant l'objet avec les politiques actuellement actives. Le code actuel retourne une erreur mais ne supprime pas l'objet ; un objet orphelin est donc possible. De même, la suppression de message est logique (`deleted_at`) et ne retire pas physiquement l'objet ni sa métadonnée. Les messages supprimés sont exclus de `msgMessages`, donc leurs pièces jointes ne sont plus rendues dans le fil normal ; les URL signées déjà émises restent toutefois valides jusqu'à leur expiration (durée demandée : 900 secondes).
- Aucune suppression Storage, modification de politique, migration, changement RLS, écriture Supabase ou lecture de contenu utilisateur n'a été effectuée. Ne pas ajouter un nettoyage client tant que la politique DELETE n'est pas corrigée et testée dans un environnement isolé. La solution durable devra définir une autorisation DELETE alignée sur le chemin Messenger (propriétaire/uploader vérifié via métadonnées ou fonction contrôlée), puis tester les cas d'échec upload → insert metadata → link message et la rétention après suppression logique. Ne pas élargir une politique DELETE générique à tous les membres d'une conversation.
- Contrôles statiques après modification : présence de `renderThread(id, true)` dans le handler UPDATE, capture de `actionConv`, rafraîchissement conditionnel uniquement si la conversation est toujours active. Aucun test navigateur, multi-compte, Realtime réel, Storage upload/delete ni test SQL d'intégration n'a été exécuté.
- Commit applicatif : `3efcdd153aa7238e66d3ecc9039ad666cad6c34f` (`fix(msg): preserve realtime channel during thread reconciliation`).
- PR #17 doit rester ouverte et non fusionnée. Aucun rebase, merge, déploiement Cloudflare ou changement de `main`.
- Étape suivante : concevoir et tester une migration minimale isolée pour le cycle de vie Storage (règle DELETE exacte + stratégie d'orphelins et de rétention), sans l'appliquer à la base active. Compléter ensuite par un test d'intégration Realtime avec deux comptes.

## Lot 502 — candidat de migration pour nettoyage Storage limité au propriétaire (14 novembre 2026)

- Reprise du constat Lot 501 avec lecture des politiques actives complètes. La politique Storage actuelle `owner delete` ne vise que les objets dont le premier dossier est l'UUID utilisateur ; elle ne couvre pas `msg/<conversation_id>/<uploader>-<timestamp>-<nom>`. La politique `msg storage upload` active impose déjà le bucket `prive`, le préfixe `msg/<conversation_id>/`, `owner = auth.uid()`, l'appartenance à la conversation et le nom de fichier commençant par l'UUID du propriétaire suivi de `-`.
- Audit supplémentaire de `public.msg_attachments` actif : politiques SELECT, INSERT et UPDATE seulement ; aucune politique DELETE n'est présente. Le rôle `authenticated` possède néanmoins le privilège SQL DELETE, qui reste bloqué par RLS en l'absence de politique DELETE. Les triggers actifs journalisent les UPDATE et vérifient la taille à l'INSERT ; aucun trigger DELETE n'a été constaté.
- Un candidat de migration a été ajouté à la branche : `supabase/migrations/202611140001_msg_storage_owner_cleanup.sql`. Il ajoute une politique Storage DELETE séparée, sans supprimer ni élargir la politique `owner delete` existante. La nouvelle règle exige simultanément le bucket `prive`, le propriétaire Storage égal à `auth.uid()`, le préfixe de dossier `msg`, exactement deux dossiers, et un nom de fichier commençant par l'UUID de l'utilisateur suivi de `-`. Le deuxième dossier est contrôlé par regex sans cast numérique, afin qu'un chemin malformé soit refusé sans erreur de conversion.
- Le candidat ajoute aussi une politique DELETE sur `msg_attachments` réservée à l'uploader authentifié, pour une ligne encore `pending`, dont le message appartient au même expéditeur et dont `msg_messages.attachment_id` n'est pas égal à l'identifiant de la pièce jointe. Les pièces jointes déjà liées ne sont donc pas supprimables par cette règle de compensation.
- La politique Storage est volontairement fondée sur la propriété et la convention de nommage, pas sur l'appartenance actuelle à la conversation : l'expéditeur doit pouvoir nettoyer son propre objet orphelin même s'il a quitté la conversation. Aucun autre membre ne peut supprimer l'objet car son UUID ne correspond ni à `owner` ni au préfixe du nom. Le droit de suppression ne porte pas sur les objets Messenger d'autrui.
- Matrice de tests ajoutée : `tests/messenger/LOT-502-STORAGE-OWNER-CLEANUP.md`. Elle couvre l'autorisation du propriétaire, les refus pour un autre compte, les mauvais préfixes, buckets et profondeurs, les chemins malformés, la suppression d'une ligne pending non liée et le refus sur les pièces jointes liées. Elle prévoit aussi la compensation client après vérification de l'état de liaison, et interdit toute suppression lorsque la réponse réseau est ambiguë.
- Contrôles statiques du candidat : transaction BEGIN/COMMIT, filtre bucket, propriétaire, préfixe Messenger, profondeur exacte, préfixe UUID, garde de chemin malformé, statut pending et absence de liaison ; matrice négative pour l'autre utilisateur présente. Ces assertions sont des contrôles de texte SQL, pas une exécution PostgreSQL.
- Aucun changement de `msg.js` ou `supabase/supabase.js` dans ce lot : ne pas activer de suppression compensatoire côté client avant que la migration soit testée et effectivement déployée, sinon les appels Storage DELETE échoueraient encore sur la base active. La suppression logique d'un message et la rétention des pièces jointes déjà liées restent inchangées ; ce lot ne programme aucun nettoyage automatique de ces fichiers.
- Contrôle Supabase actif en lecture seule : `authenticated` possède le privilège DELETE sur `storage.objects` et `public.msg_attachments`, mais RLS ne présente pas de politique DELETE Messenger active pour ces objets/métadonnées. Aucun contenu utilisateur, objet Storage ou chemin de fichier réel n'a été lu.
- Le candidat de migration n'a pas été appliqué à Supabase actif ; aucune écriture, migration, modification RLS, Auth, Realtime, donnée, dépense ou branche Supabase n'a été effectuée. Aucun déploiement Cloudflare, changement de `main`, rebase ou fusion.
- Commits : migration candidate `fcd485d1ef7ab73a7ae9a48616f8628d03cdc627` ; matrice de tests `ba4ed16a1510345286639b850af626f8dc33c2dc`.
- PR #17 revérifiée : `state=open`, `merged=false`, `mergeable=true`. Le HEAD courant comprend le commit de la matrice.
- Étape suivante : exécuter la migration candidate et la matrice dans une pile Supabase locale/éphémère avec identités synthétiques, puis vérifier les appels réels Storage API/PostgREST et les politiques permissives combinées par OR. Après réussite seulement, ajouter au client une compensation sûre : après erreur d'insertion metadata, tenter le retrait du seul chemin uploadé ; après erreur de liaison, relire `attachment_id` et ne nettoyer que si la non-liaison est confirmée. En cas de lecture ambiguë, conserver l'objet et signaler un nettoyage différé.
- Limite CI vérifiée pendant le lot : le workflow existant `.github/workflows/msg-supabase-local-test.yml` démarre Supabase avec `-x ... storage-api ...`, donc le service HTTP Storage est explicitement désactivé. Il applique uniquement les migrations 001/003 et son bootstrap ne crée pas le schéma complet `msg_messages/msg_attachments` ni les fixtures de bucket Messenger. Il ne peut donc pas valider ce candidat Storage tel quel. Ne pas ajouter simplement la migration 004 à cette séquence : elle échouerait sur le schéma incomplet. Il faut un workflow de test Storage distinct, avec un bootstrap minimal dédié, le service Storage activé, un bucket privé synthétique et deux comptes synthétiques ; tester via l'API Storage réelle ainsi que via PostgREST/RLS.
- La valeur GitHub `mergeable=false` a été observée après les commits du Lot 502. La comparaison reste `diverged`, 2 789 commits en avance et 4 en retard. L'origine précise de l'indicateur false n'a pas été démontrée par les outils disponibles ; aucun conflit de fichier précis n'a été identifié. Aucun rebase ou merge n'a été tenté.


---

## Lot 503 — workflow Storage Messenger isolé (14 novembre 2026)

### Objectif et périmètre
Créer une voie de test distincte pour la migration candidate `202611140001_msg_storage_owner_cleanup.sql`. Le workflow Realtime existant n'est pas modifié : il continue d'exclure `storage-api`, alors que ce lot a besoin de tester le vrai service HTTP Storage. Aucun accès en écriture au projet Supabase actif, aucune donnée réelle, aucun déploiement Cloudflare et aucun changement sur `main`.

### Fichiers ajoutés
- `.github/workflows/msg-storage-local-test.yml` : workflow CI autonome, déclenché sur les changements du candidat, du bootstrap ou du test ; Supabase CLI épinglé en `2.122.1`, Node 22, Storage non exclu du démarrage.
- `ci/msg-storage-local-bootstrap.sql` : tables Messenger minimales synthétiques, RLS de lecture nécessaire à l'évaluation de la politique DELETE, bucket privé `prive` et politique INSERT Storage limitée au chemin `msg/<conversation>/<uploader>-...`.
- `ci/msg-storage-local-test.mjs` : crée deux utilisateurs locaux par Auth Admin, obtient leurs JWT GoTrue, puis appelle Storage API et PostgREST sous les identités A et B.
- `tests/messenger/LOT-502-STORAGE-OWNER-CLEANUP.md` : couverture et limites du harness ajoutées à la matrice existante.

### Scénarios couverts par le script
- Upload d'un objet par chacun des deux comptes synthétiques.
- B ne peut pas supprimer l'objet appartenant à A.
- A peut supprimer son objet ; B peut supprimer le sien.
- B ne peut pas supprimer les métadonnées de A.
- A peut supprimer sa métadonnée `pending` non liée.
- A ne peut supprimer ni une métadonnée liée à son message, ni une métadonnée dont le statut est passé à `ok`.

### Limites et statut de validation
- Le workflow et le script sont ajoutés au dépôt, mais **l'exécution CI n'est pas encore confirmée**. La simple présence du workflow ne prouve pas le fonctionnement de la pile ni le succès des appels HTTP.
- Le premier harness ne couvre pas encore les noms de fichiers non conformes, les chemins mal formés/profondeurs incorrectes, les objets d'un autre bucket, ni l'inventaire exhaustif des politiques permissives Storage préexistantes. Ces scénarios restent ouverts avant de considérer la matrice complète.
- Aucun résultat PostgreSQL/Storage runtime n'est revendiqué dans ce lot. La migration reste candidate uniquement et ne doit pas être appliquée à la base active.
- Aucune compensation automatique n'a été ajoutée à `msgUpload` : la sécurité du nettoyage doit être démontrée par les tests avant de modifier le flux utilisateur.

### PR #17 et intégrité du périmètre
- Vérification GitHub après les changements du Lot 502 : `state=open`, `merged=false`, `mergeable=true`.
- Comparaison `main...design/prototypes-67-74-alignment` : `diverged`, 2 790 commits en avance et 4 en retard ; merge-base observé : `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`.
- L'indicateur `mergeable` est désormais `true` dans la réponse GitHub ; cela ne constitue pas une autorisation de fusion. PR #17 reste ouverte et non fusionnée.
- Aucun rebase, merge, commit sur `main`, déploiement Cloudflare, écriture Supabase active, migration appliquée ou branche payante créée.

### Prochaine étape
Vérifier l'exécution du workflow Lot 503 sur GitHub. En cas d'échec, diagnostiquer les journaux et corriger le harness sans toucher à la production. Ensuite compléter les scénarios négatifs manquants et vérifier les politiques Storage permissives combinées par OR. Seulement après réussite complète, réévaluer la compensation côté client et le déploiement séparé de la migration.


### Addendum Lot 503 — résultat CI et revue du test négatif (14 novembre 2026)
- Le workflow Storage distinct a bien été détecté par GitHub Actions et lancé (run #5, commit HEAD `2f75e695661e9e094441a7e4aa2e3fbfafba0d97`), mais son job se termine en échec avec `steps=null` et `logs_url=null`. La récupération des journaux du run précédent a renvoyé `BlobNotFound`. Impossible de savoir si le runner a commencé les étapes ou si le script Node a été exécuté ; aucun résultat fonctionnel n'est donc attribué au test.
- Le bootstrap a été complété pour recréer la politique Storage permissive historique `owner delete`, afin que les prochains essais évaluent la coexistence OR de cette règle avec la politique candidate.
- Revue du script : le contrôle actuel `removeObject` assimile encore succès HTTP et suppression effective. Ce n'est pas une preuve suffisante, car RLS peut masquer une suppression de zéro ligne. Le test doit vérifier l'existence de l'objet après l'appel, via un GET sous service-role limité à la pile locale, puis comparer l'état attendu. Cette correction du script reste à faire ; ne pas présenter le test négatif comme validé.
- Le premier harness ne couvre toujours pas les chemins mal formés/profondeur incorrecte, les noms de fichiers non conformes ni le second bucket. La couverture demeure partielle.
- PR #17 au dernier contrôle : ouverte, non fusionnée, `mergeable=true`; comparaison divergente, 2 798 commits en avance et 4 en retard. Aucun rebase ni fusion.
- Aucun changement Supabase actif, aucun déploiement, aucune action sur `main`. Le candidat SQL demeure non appliqué.


---

## Lot 504 — durcissement du harness Storage et diagnostic CI (14 novembre 2026)

### Correctifs apportés au harness isolé
- Le DELETE Storage utilise maintenant l'API batch documentée `DELETE /storage/v1/object/{bucket}` avec `{prefixes:[path]}`, au lieu d'un chemin d'objet ajouté à l'URL DELETE.
- Après chaque tentative de suppression, le script effectue un GET de contrôle avec la clé service-role **locale uniquement** pour vérifier l'existence réelle de l'objet. Un HTTP 2xx de DELETE n'est plus considéré seul comme preuve d'une suppression.
- Le bootstrap comprend les politiques INSERT/UPDATE nécessaires aux opérations PostgREST des deux utilisateurs synthétiques ; auparavant les tables RLS n'autorisaient que SELECT, ce qui aurait bloqué la création des messages et pièces jointes de test.
- Le workflow désactive la confirmation e-mail uniquement dans la configuration Auth locale et met les migrations du dépôt de côté avant `supabase start`, puis les restaure et applique explicitement le seul candidat Storage après le bootstrap. Cela évite d'exécuter implicitement toutes les migrations historiques dans la pile de test.
- Ajout d'un inventaire strict des politiques DELETE permissives applicables à `authenticated` sur `storage.objects` : le test attend uniquement la politique historique `owner delete` et la nouvelle politique Messenger.
- Le bootstrap crée un second bucket privé synthétique et des chemins de fixture réservés aux cas négatifs. Le script vérifie désormais le refus de suppression pour : autre utilisateur, autre bucket, segment de conversation non numérique, profondeur de chemin incorrecte et nom de fichier ne commençant pas par l'UUID du propriétaire.
- La matrice metadata conserve les cas : suppression pending non liée autorisée, autre utilisateur refusé, pièce jointe liée protégée, statut non-pending protégé.

### Résultat CI observé
- Le workflow Storage a été redéclenché et apparaît comme run #13 (`43590914771`) ; le job se termine en échec avec `steps=null`, `logs_url=null`. L'endpoint des étapes renvoie une liste vide et le téléchargement des journaux renvoie `BlobNotFound`.
- Les workflows PostgreSQL, Realtime et CI générale du même commit échouent également sans étapes exposées. Cela pointe vers un problème en amont de l'exécution des étapes GitHub Actions, mais les données disponibles ne permettent pas d'identifier si la cause est l'allocation runner, le service de logs ou un autre incident GitHub.
- **Aucun test du script Node, aucun bootstrap SQL et aucune migration candidate ne sont déclarés exécutés ou réussis.** Le code et le workflow sont prêts à être testés, mais l'état fonctionnel reste non validé tant qu'un run ne fournit pas des étapes et des journaux exploitables.

### Intégrité et état
- PR #17 au dernier contrôle : `state=open`, `merged=false`, `mergeable=true`.
- Comparaison `main...design/prototypes-67-74-alignment` : `diverged`, 2 808 commits en avance et 4 en retard.
- Aucun rebase, merge, modification de `main`, déploiement Cloudflare, écriture Supabase active ou branche payante.
- La migration `202611140001_msg_storage_owner_cleanup.sql` reste un candidat non appliqué. Aucun changement de code client Messenger n'est entrepris avant validation effective des tests.

### Suite immédiate
Obtenir une exécution GitHub Actions avec étapes/journaux exploitables ou exécuter ce workflow dans un environnement local Docker/Supabase isolé. Si les tests démarrent, traiter les erreurs SQL/API réelles, puis seulement après succès décider si le nettoyage compensatoire peut être ajouté au client Messenger.


---

## Lot 505 — correction du contrôle SQL et état d'exécution CI (14 novembre 2026)

- Revue du workflow `.github/workflows/msg-storage-local-test.yml` : le bloc anonyme PostgreSQL chargé de compter les politiques DELETE permissives était délimité par `DO $ ... END $;`, syntaxe invalide. Correction en `DO $$ ... END $$;`, commit `a935ca64692a9c0ed7bd0d2585c5f29a38dc5c55` sur `design/prototypes-67-74-alignment`.
- Le run Storage déclenché sur ce commit (`43591195498`, run #16) est terminé en échec, mais GitHub renvoie `steps=[]`, `steps=null` dans le résumé du job et `logs_url=null`; le téléchargement renvoie `BlobNotFound`. Les runs CI générale, PostgreSQL Messenger et découverte PostgreSQL du même commit présentent le même état sans étapes exposées. Impossible d'attribuer cet échec à la syntaxe SQL corrigée, au runner, au script ou à la migration : aucune étape du job n'est consultable.
- Vérification locale de l'environnement : Node.js `v22.16.0` est disponible, mais `docker`, `supabase` et `psql` sont absents. Il n'est donc pas possible d'exécuter le harness dans ce conteneur. Aucun résultat d'intégration Storage/PostgREST n'est revendiqué.
- Revue statique du schéma réel `supabase/msg_schema.sql` : les noms/colonnes ciblés par le candidat correspondent aux tables (`msg_messages.id/sender_id/attachment_id`, `msg_attachments.message_id/uploader/statut`). Les tables du bootstrap sont volontairement réduites et synthétiques ; elles ne remplacent pas une validation contre la base réelle.
- La migration `202611140001_msg_storage_owner_cleanup.sql` reste candidate, non appliquée. Aucun code client de compensation n'a été activé. Aucun accès en écriture au projet Supabase actif, aucun déploiement Cloudflare, aucune modification de `main`, aucun rebase ni fusion.
- PR #17 revérifiée après le correctif : `state=open`, `merged=false`, `mergeable=true`, HEAD `a935ca64692a9c0ed7bd0d2585c5f29a38dc5c55`. Elle reste ouverte pour validation visuelle et technique.
- Suite : obtenir un run GitHub Actions avec étapes/journaux disponibles ou exécuter la pile dans un environnement disposant réellement de Docker/Supabase CLI/psql. Ne pas ajouter de nouveaux correctifs spéculatifs avant d'avoir les premiers résultats d'exécution.


---

## Lot 506 — protection des pièces jointes déjà liées (14 novembre 2026)

### Défaut critique identifié
- La revue de la migration candidate a montré que la politique Storage autorisait l'uploader à supprimer son objet Messenger dès lors que le chemin et le propriétaire correspondaient, sans vérifier si msg_messages.attachment_id pointait déjà vers la ligne msg_attachments correspondante. Un utilisateur aurait donc pu supprimer directement via Storage un fichier encore lié à un message.
- La politique metadata utilisait une sous-requête soumise au RLS de msg_messages. Dans le schéma réel, la lecture des messages dépend de l'appartenance à la conversation ; ce contrôle n'était donc pas suffisamment robuste pour une opération de nettoyage indépendante de cette visibilité.

### Correction candidate
- Migration candidate réécrite pour ajouter deux fonctions SECURITY DEFINER à search_path fixe, qui dérivent l'identité de auth.uid() et ne prennent jamais un UUID utilisateur fourni par le client.
- msg_storage_cleanup_allowed(path) refuse explicitement tout chemin qui n'est pas de forme msg/<id numérique>/<UUID-auth-...> et refuse tout objet dont les métadonnées sont liées par msg_messages.attachment_id.
- msg_attachment_cleanup_allowed(id) n'autorise que la suppression d'une ligne appartenant à l'utilisateur, en statut pending, dont le message lui appartient et n'est pas lié à cette pièce jointe.
- Exécution des helpers révoquée à public et anon, accordée uniquement à authenticated. Le contrôle de chemin dans le helper borne aussi son usage RPC au namespace Messenger de l'utilisateur courant.
- Le script d'intégration ajoute désormais un objet synthétique lié à un message et vérifie que même son propriétaire ne peut pas le supprimer via Storage. Le scénario metadata pending utilise aussi un objet propre à A plutôt que le chemin de B.

### État de validation
- Commits de migration et test : 47fbc52, 02a8e75, puis durcissement du helper 91d5588.
- Le correctif est uniquement sur la branche de la PR. Migration non appliquée au Supabase actif ; aucun code client de compensation activé.
- Aucun runtime n'est disponible ici (Docker, Supabase CLI et psql absents). GitHub Actions continue de terminer les jobs sans étapes/journaux exposés ; la migration et les tests ne sont donc pas déclarés validés.
- Prochaine étape : obtenir une exécution réelle du workflow et vérifier particulièrement les permissions EXECUTE, la politique Storage et le refus de suppression d'un objet lié. Aucun déploiement ni fusion avant cette preuve.



## Lot 507 — réparation du SQL candidat Storage Messenger (14 novembre 2026)

- Inspection du run Storage #20 (`43591530104`) : un seul job terminé en échec ; endpoint des étapes = liste vide ; `logs_url=null` ; téléchargement des journaux = `BlobNotFound`. Le run ne permet pas d'établir si le runner a commencé le workflow ni quelle étape aurait échoué.
- La relecture directe du blob de `supabase/migrations/202611140001_msg_storage_owner_cleanup.sql` a révélé une corruption réelle du fichier : la fonction `msg_storage_cleanup_allowed(text)` était coupée après le motif regex `^[0-9]+`, et un fragment du corps SQL réapparaissait après `COMMIT`. Le candidat n'était pas exécutable en l'état.
- Remplacement intégral du fichier par un SQL cohérent : contrôle du namespace `msg/`, exactement deux dossiers, identifiant de conversation numérique, nom commençant par l'UUID de `auth.uid()`, exclusion des objets liés par `msg_messages.attachment_id`, helper metadata limité à l'uploader, au statut `pending`, au message du même expéditeur et à l'absence de liaison. Les fonctions gardent un `search_path` fixe ; EXECUTE est révoqué à `public/anon` et accordé à `authenticated`.
- Commit de réparation SQL : `673ef228f82046187688874dd87f37b7d1a8f3e6`.
- Le commit prouve seulement l'enregistrement du texte dans GitHub. Il ne prouve ni syntaxe/exécution PostgreSQL ni comportement Storage API. Relecture du blob après commit et nouveau run CI à contrôler.
- PR #17 au contrôle : ouverte, non fusionnée, `mergeable=true`, HEAD antérieur à la réparation `b49379c8edc389bf168887d9f62c2587b69d4618). Ne pas fusionner.
- Aucun accès en écriture à Supabase actif, aucune migration appliquée, aucun déploiement Cloudflare, aucun changement sur `main`, aucun rebase/fusion, aucune branche payante.
- Suite : vérifier le blob réparé, attendre/inspecter le workflow déclenché par le commit, corriger uniquement sur la base d'une erreur reproductible. Ne pas activer la compensation côté client avant validation intégrale.

### Addendum Lot 507 — contrôle après correction et nouvelle tentative CI

- Relecture du blob SQL après commit : un seul `BEGIN`, un seul `COMMIT`, quatre délimiteurs `$$` correspondant aux deux fonctions ; les motifs tronqués et fragment SQL après `COMMIT` ne sont plus présents. Il s'agit d'un contrôle textuel du blob, pas d'une validation PostgreSQL.
- Le commit SQL `673ef228f82046187688874dd87f37b7d1a8f3e6` a déclenché le workflow Storage #22 (`43591834159`). Le run s'est d'abord terminé en échec sans étapes ni logs de job (`steps=null`, `logs_url=null`, `BlobNotFound`). Une relance des jobs échoués a été demandée ; le job relancé s'est de nouveau terminé en échec sans étapes exposées. Aucun résultat de script Node, bootstrap ou SQL ne peut être inféré.
- Les workflows PostgreSQL Messenger et la CI générale du même commit se sont également terminés en échec. Les données disponibles ne permettent toujours pas d'attribuer la cause à la migration, au code, au runner ou au service de logs.
- PR #17 revérifiée après les commits de documentation : ouverte, non fusionnée, `mergeable=true`, HEAD `0d488ae2e18042b26762e34f5adfaa85d3a9c7c6`.
- Aucune migration appliquée à Supabase actif, aucune écriture de données, aucun déploiement Cloudflare, aucune modification de `main`, aucun rebase ni fusion. Aucun changement client Messenger.
- Suite : débloquer l'observabilité de GitHub Actions ou disposer d'un environnement local Docker/Supabase/psql. Le candidat reste non validé et ne doit pas être déployé.

### Vérification croisée des journaux GitHub Actions — Lot 507

Sur le même commit, les jobs de trois workflows indépendants ont été interrogés : CI générale (`43591834136`), tests PostgreSQL consentement (`43591834145`) et intégration Supabase locale Messenger (`43591834111`). Tous renvoient une liste d'étapes vide et un téléchargement de logs `BlobNotFound`, comme le workflow Storage #22. Cette convergence confirme que l'absence de journaux n'est pas isolée au seul workflow Storage ; elle ne permet toutefois pas d'identifier la cause sous-jacente ni de conclure que le code a été exécuté.

## Lot 508 — diagnostic isolé du démarrage des runners (14 novembre 2026)

**Changement de méthode :** ajout de `.github/workflows/diag-runner-provisioning.yml`, workflow minimal sans checkout, sans installation, sans secret et sans accès réseau applicatif. Il lance uniquement trois commandes `echo/date`, sur deux images indépendantes (`ubuntu-latest` et `ubuntu-22.04`). Commit : `cbe97eb31c37aa43a59d0d49f31dbd6bfd3a41ea`.

**Résultat discriminant :** le run diagnostic #1 (`43592180990`) a échoué sur les deux jobs. Pour chacun : `steps=[]`, `logs_url=null`, téléchargement des logs = `BlobNotFound`. Aucun des deux n'a exécuté la première commande `echo`. Au même commit, Storage #27 (`43592180931`) et CI générale #3802 (`43592180902`) montrent le même motif.

**Conclusion technique :** le problème observé est en amont des commandes YAML, du checkout, de Node, de Supabase CLI, de PostgreSQL et du code Messenger. Le test minimal ne prouve pas à lui seul quelle composante GitHub est en cause, mais il permet d'écarter comme explication immédiate une erreur dans le script Storage ou dans son SQL. L'hypothèse principale devient un échec de dispatch/provisionnement/initialisation des runners hébergés, ou une restriction de service au niveau du dépôt/compte. Seuls les diagnostics côté GitHub peuvent départager ces causes.

**Vérification de l'environnement local :** le conteneur de travail ne possède ni Docker, Podman, Supabase CLI, PostgreSQL/psql, ni les modules Python/Node de parsing PostgreSQL. Il n'offre donc pas de voie locale immédiate pour exécuter la migration. Aucun téléchargement ni installation non autorisés n'ont été tentés.

**Actions sûres à effectuer côté GitHub :**
1. Dans Actions, ouvrir le run `43592180990` et vérifier si GitHub expose une annotation de job, un runner ID/name ou un motif de refus avant le démarrage.
2. Vérifier dans Settings → Actions que Actions est activé pour le dépôt et que les GitHub-hosted runners sont autorisés ; vérifier également les limites/quota Actions et les éventuelles restrictions du compte/organisation.
3. Si les deux runners minimaux continuent d'échouer sans étapes, transmettre à GitHub Support les run IDs `43592180990`, `43592180931`, `43592180902` et les job IDs `132439053353`, `132439053538`, `132439053173`, `132439053254`, en demandant l'inspection des événements d'assignation et de provisionnement côté serveur. Les logs n'existent pas côté job pour cette tentative.

**État inchangé :** PR #17 ouverte, non fusionnée ; aucune action sur `main`, aucun déploiement Cloudflare, aucune écriture/migration sur Supabase actif, aucune activation de compensation client. La migration Storage reste candidate non validée.


## Lot 508 — diagnostic de la chaîne édition/suppression Messenger (14 novembre 2026)
- Reprise sur la tête réelle de PR #17 (`560329618c1b37d35731ddf893be4df895e3c4b3` au début du lot), sans repartir des anciens SHA cités dans les résumés précédents.
- Constat : `msg.js` contient déjà les commandes personnelles ✏️/🗑️, affichées uniquement sur les lignes de l'expéditeur; les gestionnaires appellent `SB.msgEdit()` et `SB.msgDelete()`. Les fonctions clientes existent dans `supabase/supabase.js`.
- `msgEdit` met à jour uniquement `body` et `edited_at`, avec filtres `id`, `sender_id=auth.uid()` et `deleted_at IS NULL`. `msgDelete` réalise une suppression logique via `deleted_at` avec les mêmes filtres. Les deux vérifient le résultat `select('id').maybeSingle()` et renvoient une erreur si aucune ligne n'a été modifiée.
- Lecture en SELECT du catalogue Supabase actif : la policy `msg messages edition` autorise UPDATE au membre expéditeur (ou au modérateur) et sa clause `WITH CHECK` conserve cette condition. La policy SELECT exige l'appartenance à la conversation ou le rôle modérateur. Les triggers actifs `msg_tr_log_del` et `msg_touch_conversation` existent. Aucun changement de politique, trigger ou donnée en production.
- Défaut d'interface trouvé et corrigé : l'expression qui retire le suffixe « · عُدّلت » / « · تم الإبلاغ عنها » avant d'ouvrir le prompt contenait `\\\\s` au lieu de `\\s`. La regex cherchait donc un antislash littéral plutôt que des espaces; rééditer une ligne marquée pouvait réinjecter le suffixe d'état dans le corps du message. Correction limitée à `msg.js`.
- Commit applicatif : `164b160d588c05af321c21cc69c7afa30c116873`.
- Validation : comparaison du texte source avant/après et confirmation du motif corrigé dans le contenu GitHub. Pas encore de test navigateur avec deux comptes ni de test Realtime réel.
- Le run de diagnostic minimal #2 (SHA antérieur) échoue sur les deux jobs Ubuntu avant de publier les étapes; GitHub renvoie `BlobNotFound` pour les journaux. Le run Storage #28 et les autres workflows du même commit ont le même symptôme. Cela isole un problème commun de runner/logs GitHub Actions, mais ne prouve pas si l'échec survient à l'allocation du runner, à l'initialisation du job ou au stockage des journaux.
- PR #17 doit rester ouverte et non fusionnée. Aucun rebase, aucun changement de `main`, aucun déploiement Cloudflare, aucune migration Supabase appliquée, aucune dépense ou branche Supabase payante.
- Suite : auditer les champs modifiables par la policy UPDATE (la policy autorise une ligne, pas seulement des colonnes précises), puis préparer des tests à deux utilisateurs pour édition, suppression logique, absence de droits sur le message d'autrui et réception des événements UPDATE après reconnexion.

### Complément Lot 508 — privilèges SQL limités aux colonnes autorisées
- Vérification complémentaire du catalogue actif : `authenticated` ne possède pas de privilège UPDATE au niveau global de la table `msg_messages`; les seuls privilèges UPDATE par colonne sont `body`, `deleted_at` et `edited_at`. Les colonnes `sender_id`, `conversation_id`, `attachment_id`, `flagged` et `id` n'ont pas de privilège UPDATE pour ce rôle.
- Ce garde-fou complète la policy RLS : même si elle autorise l'UPDATE de la ligne à l'expéditeur membre (ou au modérateur), les droits SQL limitent les champs modifiables. La chaîne client `msgEdit` et `msgDelete` correspond aux colonnes autorisées.
- Contrôle réalisé en SELECT sur `information_schema.table_privileges` et `information_schema.column_privileges`; aucune modification de la base active.


---

## Lot 509 — distinguer le code Messenger de la cible Cloudflare réellement testée (14 novembre 2026)

### Constat décisif sur les branches
- Relecture indépendante de `msg.js` sur `main` et sur `design/prototypes-67-74-alignment` :
  - `main` : 20 656 caractères ; pas de `channelEpoch`, pas de garde contre une création tardive d'un canal, et pas de réconciliation `renderThread(id, true)` après `SUBSCRIBED`.
  - branche PR #17 : 37 702 caractères ; contient les gardes `channelEpoch`, les contrôles d'époque/conversation et la réconciliation du fil après abonnement/reconnexion.
- Les modifications des lots 498, 499 et 501 sont des commits de la branche PR #17. Les diffs de ces commits ne changent pas `main`. La version améliorée du moteur Messenger n'est donc pas présente dans le code de la branche de production tant que PR #17 n'est pas intégrée.
- Le workflow `.github/workflows/deploy.yml` confirme un déclencheur `push` limité à `main` et un déclencheur `pull_request` ciblant `main`. Il ne contient aucun job `deploy` ; son étape d'information indique que la production publique est assurée par Cloudflare Workers et que le build de production est automatique à chaque push via l'intégration OAuth Cloudflare.
- Conséquence : si le test Messenger est effectué sur `https://allemand.brid-randomtv.workers.dev` (production), il teste le code issu de `main`, pas les corrections Realtime non fusionnées des lots 498–501. C'est une explication opérationnelle forte de l'écart entre les corrections commitées et le comportement observé en production. Elle ne démontre pas encore que le code de la PR résout à lui seul toute la panne Realtime.

### État du build de la branche
- Le check Cloudflare `Workers Builds: allemand` du HEAD `d5da9c1d783b44dafb883a3435a1ed6fc68bab17` est terminé avec `success`, build ID `1ee91949-d769-4254-8f86-e5ec6917a3cb`, dans le chemin Cloudflare de preview `design-prototypes-67-74-alignment`.
- Cela prouve que Cloudflare a construit le code de la branche PR. Le check ne fournit pas d'URL publique exacte du preview ; aucune URL de preview n'est inventée ou réutilisée.
- Le check Supabase Preview est `skipped` avec le motif : « This git branch is not associated with any Supabase Branch ». Aucune branche Supabase n'a été créée. Le fichier client de la branche référence toujours le projet Supabase actif `azjwcybivirvpxbfhyzk` ; un test fonctionnel sur ce preview pourrait donc écrire dans la base active. Ne pas effectuer de test d'envoi avec des comptes réels sans décision explicite et sans comptes de test dédiés.

### Décision et limites
- La priorité n'est plus d'ajouter un nouveau patch Realtime à l'aveugle : il faut comparer le comportement sur le build Cloudflare de preview de la branche PR avec celui de la production, en sachant que le preview utilise le projet Supabase actif tant qu'aucune branche Supabase isolée n'existe.
- Aucune fusion, aucun push sur `main`, aucun déploiement de production, aucune écriture ou migration Supabase, aucune création de branche payante et aucun test d'envoi multi-compte n'ont été effectués dans ce lot.
- PR #17 revérifiée : `state=open`, `merged=false`, `mergeable=true`, HEAD `d5da9c1d783b44dafb883a3435a1ed6fc68bab17`.
- Aucun défaut supplémentaire du transport Realtime n'est déclaré corrigé. Le test navigateur à deux comptes reste à faire sur une cible explicitement choisie et avec des comptes de test.


### Addendum Lot 509 — actualisation après commit du dossier
- Commit du présent addendum : `6e8e86544fd2f59d8da225c60420a67ffc74d2cb`.
- PR #17 relue après ce commit : `state=open`, `merged=false`, `mergeable=true`, HEAD `6e8e86544fd2f59d8da225c60420a67ffc74d2cb`. Une lecture intermédiaire immédiatement après le push avait retourné `mergeable=false`, puis la lecture suivante `true` ; conserver la dernière valeur et ne pas interpréter ce champ comme une validation de fusion.
- Comparaison recalculée : branche divergente, 2 830 commits en avance et 4 en retard, merge-base `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`. Aucun rebase ni merge tenté.
- Les checks GitHub Actions déclenchés sur ce HEAD étaient encore en file d'attente lors du dernier contrôle, y compris les deux jobs minimaux Ubuntu. Aucun résultat d'exécution n'est anticipé.


---

## Lot 510 — ajouter le test Realtime du vrai flux de messages (14 novembre 2026)

### Lacune trouvée dans la suite existante
- Le test local `ci/msg-supabase-local-test.mjs` ouvrait un WebSocket Realtime avec le JWT du destinataire et vérifiait la livraison d'une invitation `msg_invites`.
- Il n'existait pas de test équivalent pour `msg_messages`, la table réellement utilisée par la réception des messages de conversation.
- `tests/msg_test.mjs` et `ci/check-msg.mjs` contrôlent principalement des invariants statiques du code et du SQL ; ils ne prouvent pas la livraison d'un INSERT `msg_messages` par le transport WebSocket.
- Les lots 340 et 377 avaient déjà prescrit un environnement Supabase local/isolé, mais le test multi-compte exécuté jusque-là couvrait surtout invitations, consentement, RLS et annuaire.

### Modifications de test commitées sur la branche PR #17
- `ci/msg-supabase-local-bootstrap.sql` :
  - ajout d'une table `msg_messages` de fixture avec les colonnes essentielles alignées sur `supabase/msg_schema.sql` ;
  - RLS activé ;
  - politiques SELECT membre/modérateur et INSERT expéditeur + membre + non bloqué ;
  - droits authentifiés et séquence d'identité ;
  - ajout de `public.msg_messages` à la publication locale `supabase_realtime`.
- `ci/msg-supabase-local-test.mjs` :
  - ajout de `subscribeToMessageChanges(user, conversationId)` : WebSocket réel sur la pile Supabase CLI locale, JWT GoTrue du destinataire, événement INSERT et filtre `conversation_id=eq.<id>) ;
  - après acceptation d'une invitation et création du DM synthétique, l'expéditeur insère un message via PostgREST avec son propre JWT ;
  - le test attend l'événement CDC/WebSocket, vérifie conversation, expéditeur, corps et identifiant ;
  - le destinataire relit le message sous son propre JWT (preuve de visibilité RLS) ;
  - un troisième compte non membre doit obtenir zéro ligne (contrôle négatif RLS).
- `.github/workflows/msg-supabase-local-test.yml` :
  - précontrôle de publication étendu à `msg_invites` et `msg_messages`.
- Aucun code applicatif `msg.js` / `supabase/supabase.js` n'a été modifié dans ce lot.

### Résultat CI et limite
- Le run `43593417351` (`messenger-supabase-local`) s'est terminé en échec, mais l'API GitHub retourne `steps=null`, `logs_url=null`; la récupération des logs renvoie `BlobNotFound`.
- Les deux jobs minimaux Ubuntu et la validation structurelle du même HEAD ont également échoué sans étapes ni journaux (`steps=null`, `logs_url=null`). Il est donc impossible d'attribuer l'échec au nouveau test, à une étape du workflow ou à l'initialisation du runner. Aucun résultat positif ou négatif du test Realtime `msg_messages` n'est revendiqué.
- Le code du test et les fichiers de fixture sont présents sur la branche, mais la validation dynamique reste **non démontrée** jusqu'à obtention d'une exécution GitHub avec logs exploitables ou d'un runtime local Supabase disponible.

### Sécurité et état
- La pile de test est démarrée par Supabase CLI dans le workflow GitHub et utilise des utilisateurs synthétiques `@example.test`; aucun compte réel ni clé de production n'est utilisé par ce script.
- La seule branche Supabase recensée est `main` du projet actif `azjwcybivirvpxbfhyzk`. Aucune branche payante ni second projet n'a été créé.
- Aucun SQL, migration, Auth, RLS, GRANT, Storage ou Realtime n'a été modifié sur le projet Supabase actif.
- Aucun déploiement Cloudflare, aucune fusion, aucun changement `main`.
- PR #17 reste ouverte et non fusionnée ; dernier HEAD observé avant le présent addendum : `04525d1360923b9f550650e3baeece933060a316`.

### Étape suivante
- Obtenir un run exploitable de `messenger-supabase-local` et examiner en premier lieu l'accusé de réception de l'abonnement CDC, le filtre de conversation, puis la trame INSERT.
- Si le test passe, seulement alors ajouter les tests UPDATE (édition/suppression logique) et reconnexion. Ne pas déduire ces comportements du test INSERT.


### Addendum Lot 510 — précision du protocole Realtime et état final
- Le contrôle de l'accusé de réception du `phx_join` a été rendu tolérant aux différences de représentation du filtre dans la réponse serveur : il vérifie que la table `public.msg_messages` est bien reconnue ; le test vérifie ensuite sur l'événement livré que `conversation_id` correspond exactement au fil demandé. Cela évite de rejeter un abonnement valide uniquement parce que le serveur ne sérialise pas le champ `filter` de la même façon.
- Commit du test : `319abbd8c9f77242528474158726c72af8b8c4a8`.
- Le run précédent `43593417351` reste inexploitable : job terminé en échec, mais aucune étape ni URL de logs ; tentative de lecture des logs = `BlobNotFound`. Il ne permet pas de conclure sur le nouveau scénario.
- Sur le HEAD `319abbd8c9f77242528474158726c72af8b8c4a8`, le dernier relevé de checks exposait seulement le check Supabase Preview `skipped`; aucun résultat de test `msg_messages` n'est donc déclaré.
- PR #17 : toujours `open`, `merged=false`. Le champ `mergeable` a retourné `false` lors de cette lecture ; aucune fusion ni rebase n'a été tentée. Recalculer l'état avant toute décision future.


---

## Lot 511 — audit de sûreté du test Messenger et diagnostic du runner GitHub (14 novembre 2026)

### Vérifications réalisées
- Relecture du HEAD réel de PR #17 : `2f2f43962a5eaf3d3b4723f71e94a2f927303332`, branche `design/prototypes-67-74-alignment`.
- Relecture du test `ci/msg-supabase-local-test.mjs`, de sa fixture `ci/msg-supabase-local-bootstrap.sql`, du workflow `.github/workflows/msg-supabase-local-test.yml`, du schéma historique `supabase/msg_schema.sql` et des deux migrations explicitement appliquées par ce workflow.
- La fixture `msg_messages` contient les colonnes essentielles utilisées par le test INSERT/Realtime/SELECT : `id`, `conversation_id`, `sender_id`, `body`, `created_at`, `edited_at`, `deleted_at`. Le schéma historique contient en plus `attachment_id`, qui n'est pas nécessaire au scénario de message texte.
- Le scénario de test utilise trois comptes synthétiques `@example.test` dans la pile Supabase CLI locale : expéditeur, destinataire et observateur non membre. Il ne référence ni URL ni clé de production dans son code ; les clés sont lues depuis les variables d'environnement éphémères du service local.
- Le workflow démarre explicitement une pile Supabase locale, applique le bootstrap et les migrations ciblées sur cette base locale, puis exécute le test. Aucune étape de ce workflow ne déploie Cloudflare ou n'applique une migration à Supabase de production.

### Diagnostic GitHub Actions plus précis
- Lecture directe de l'API GitHub pour le run Messenger `43593541383` : état `completed/failure`, job `messenger-supabase-local`, commencé à `12:11:03Z`, terminé à `12:11:05Z`.
- Le job expose `runner_id=0`, `runner_name=""`, `runner_group_id=0`, `steps=[]`. Aucune commande du workflow n'a donc été exécutée par un runner identifiable.
- Cette observation confirme que ce run ne constitue pas un échec du test SQL, de PostgREST ou de Realtime : le script de test n'a pas été lancé. La cause côté service GitHub Actions reste à établir ; ne pas l'attribuer plus précisément sans journaux ou diagnostic GitHub.
- Le test d'intégration `msg_messages INSERT → CDC → WebSocket → SELECT RLS` reste donc non exécuté et non validé. Aucun résultat positif ou négatif ne doit lui être attribué.

### Décision de préservation
- Aucun changement de `msg.js`, `supabase/supabase.js`, des migrations, du schéma de production, des politiques RLS, des conversations ou des messages réels dans ce lot.
- Aucun nouveau test d'envoi sur les comptes réels, aucune écriture Supabase de production, aucune branche payante, aucun déploiement Cloudflare.
- Aucun correctif applicatif supplémentaire n'est justifié par le seul échec de runner. Priorité : obtenir une exécution GitHub avec runner attribué et étapes visibles, puis examiner le premier vrai résultat du test avant d'étendre le périmètre aux UPDATE, suppressions logiques et reconnexions.
- PR #17 reste ouverte et non fusionnée ; `main` reste intacte. Aucun rebase ni merge tenté.


---

## Lot 512 — recontrôle après Lot 511 : état PR, runner et preview (14 novembre 2026)

### État confirmé sur le HEAD du Lot 511
- HEAD de branche : `afda8427ed0b7a4880bb2e2de958aefc6e4466df`.
- PR #17 : `open`, `merged=false`, cible `main`. Le champ GitHub `mergeable` est revenu à `true` lors du recontrôle ; la valeur `false` de la lecture précédente était transitoire/non stabilisée. Aucune fusion ni rebase n'a été effectuée.
- La comparaison avec `main` conserve un écart important de branche : `2838` commits en avance et `4` en retard selon l'API compare. Le merge-base indiqué est `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`. Ne pas interpréter `mergeable=true` comme une approbation de fusion ou comme une validation fonctionnelle.
- Le commit `afda842` ne modifie que le dossier de continuité ; aucun fichier Messenger applicatif n'a été modifié dans ce commit.

### Nouveaux résultats CI / Cloudflare
- Les workflows déclenchés sur `afda842` ont de nouveau échoué quasi immédiatement. Le diagnostic minimal présente deux jobs (`ubuntu-latest` et `ubuntu-22.04`) terminés en échec, avec `steps=null`; le job Messenger local présente également `steps=null`.
- Téléchargement des logs des jobs de diagnostic et Messenger : réponse `BlobNotFound`. Aucun script de test n'a pu être confirmé comme exécuté. Le problème reste en amont du test et sa cause précise n'est pas démontrée.
- Le check Cloudflare `Workers Builds: allemand` sur `afda842` est `success`, avec build ID `a7d069d8-6a3d-4196-a831-965b10fb0cb3`, présenté par le check comme un build de preview `design-prototypes-67-74-alignment`. Ce résultat confirme la construction du preview, pas une validation Messenger ni un déploiement production.
- Le check Supabase Preview est `skipped` : la branche n'est associée à aucune branche Supabase dédiée. Aucun environnement Supabase isolé n'est donc disponible pour un essai navigateur sûr avec plusieurs comptes.

### Décision
- Pas de nouveau changement applicatif Messenger : l'absence de runner/logs ne fournit aucun signal permettant de choisir un correctif client, SQL, Realtime ou RLS.
- Pas de test d'envoi via le preview Cloudflare : en l'absence de branche Supabase isolée, le preview peut utiliser la configuration Supabase active ; ne pas risquer d'écrire dans les conversations réelles.
- Production Supabase, données réelles et `main` non modifiées dans ce lot. PR #17 demeure ouverte et non fusionnée.
- Prochaine action technique : rétablir une exécution CI observable (runner attribué, étapes et logs) ou obtenir un environnement Supabase local/isolé exécutable, puis reprendre le test de réception. Ne pas multiplier les modifications de `msg.js` sans résultat de ce test.


---

## Lot 513 — nouvelle exécution du diagnostic runner sur le HEAD courant (14 novembre 2026)

### Vérification de la branche et de la PR
- Relecture de la PR #17 : état `open`, `merged=false`, base `main`, HEAD au début du lot `3f61e0c2afbc77312a58f7af44e37ba14ee046cb`. Le champ `mergeable` retourné par GitHub était `true`, ce qui ne constitue ni une validation fonctionnelle ni une autorisation de fusion.
- Aucun merge, rebase, changement de base ou push vers `main` effectué.

### Nouveau diagnostic GitHub Actions
- Le workflow minimal `.github/workflows/diag-runner-provisioning.yml` a été relancé automatiquement sur le HEAD courant : run `43594239166`, créé à `12:19:24Z`, terminé en échec à `12:19:27Z`.
- Les deux jobs matriciels, `ubuntu-latest` (job `132445241908`) et `ubuntu-22.04` (job `132445242099`), sont terminés en échec. L'API dédiée aux étapes renvoie une liste vide `steps=[]` pour chacun ; aucun checkout, script shell ou commande du workflow n'a donc été exécuté.
- Le téléchargement des logs pour ces nouveaux jobs renvoie encore `BlobNotFound`. Il n'existe donc pas de message d'erreur runner exploitable dans les journaux accessibles.
- Le workflow de diagnostic ne contient pourtant qu'une matrice de deux runners Ubuntu et une étape shell qui imprime `RUNNER_BOOTSTRAP_OK`, sans checkout, dépendance, secret ni accès Supabase. Le test est ainsi indépendant de Messenger et de Supabase.
- Le workflow Messenger local est bien configuré pour utiliser une pile Supabase CLI locale éphémère, mais son test ne peut pas être considéré comme exécuté tant que l'attribution du runner échoue avant la première étape.

### Conclusion technique affinée
- Le nouvel essai confirme que le blocage n'est pas une erreur produite par le code du test Realtime : même le workflow minimal sans dépendance échoue avant sa première étape, sur deux images Ubuntu différentes.
- Les données disponibles ne permettent toujours pas d'identifier la cause exacte (quota, politique de dépôt, service GitHub, capacité runner ou autre). Il serait incorrect d'affirmer qu'il s'agit nécessairement d'un quota ou d'une panne générale GitHub.
- Ne pas modifier `msg.js`, `supabase/supabase.js`, les migrations ou les politiques RLS sur la base de ce signal. Ne pas multiplier les relances identiques : le prochain diagnostic utile doit obtenir un message d'échec de provisionnement via l'interface GitHub Actions ou un contrôle de configuration/limites du dépôt effectué par le propriétaire.
- Aucun test n'a écrit dans Supabase de production ; aucun message réel n'a été envoyé ; aucun déploiement Cloudflare n'a été demandé dans ce lot.
- PR #17 reste ouverte et non fusionnée ; `main` reste intacte.


---

## Lot 514 — vérification de la présence de 🌐 ملتقى الطلاب (14 novembre 2026)

### Résultat de l'inspection des sources
- Recherche effectuée dans l'arbre Git complet de `main` (1 180 chemins, arbre non tronqué) : aucun fichier ou chemin correspondant à `multaqa`, `forum`, `community` ou `student` n'est présent. Les recherches dans `index.html`, `app.js`, `modules.js`, `classe.js` et `supabase/supabase.js` de `main` ne trouvent aucune occurrence de `ملتقى الطلاب`/route `multaqa`.
- Sur la branche `design/prototypes-67-74-alignment` (PR #17), la fonctionnalité est bien présente : `index.html` contient le panneau et l'en-tête 🌐 ملتقى الطلاب (autour des lignes 890–906) ; `app.js` inclut l'onglet `multaqa`, son raccourci de navigation et le contrôle d'accès étudiant (autour des lignes 451, 522, 547 et 632).
- Le dossier ne contient pas, dans ce lot, d'élément prouvant qu'une suppression a été effectuée par les Lots 498–513. Ces lots portaient sur Messenger/Realtime et les diagnostics CI ; le Lot 513 n'a modifié que le dossier.

### Interprétation et précaution
- La version source de `main`, qui alimente la production Cloudflare selon la configuration connue du projet, ne contient actuellement pas le module/route du ملتقى. La branche PR #17, elle, le contient. Cela explique une différence possible entre l'aperçu de PR et la plateforme de production, mais ne permet pas à lui seul de dater ni d'attribuer la disparition initiale.
- Ne pas fusionner PR #17 pour rétablir le ملتقى : cette PR contient aussi d'autres changements et reste non approuvée/non fusionnée. Ne pas modifier la production dans le cadre de ce diagnostic.
- Aucun fichier applicatif, aucune route, aucune donnée Supabase et aucun déploiement n'ont été modifiés dans ce lot. PR #17 reste ouverte et non fusionnée.


---

## Lot 515 — traçage historique de 🌐 ملتقى الطلاب (14 novembre 2026)

- L'historique de `design/prototypes-67-74-alignment` situe l'ajout initial de la vue au Lot 406 (commit `d55319b2b165e6cc8c3e775e9990d71b614fb466`, 13 novembre), la refonte visuelle au Lot 434 (`07bbee5bc9e23cde64062ddec73193a79e76fb09`) et le raccordement du client RPC au Lot 444 (`08442cdbe98a4e9a42564bcb9299d85d952d16fc`).
- L'arbre Git de `main` ne contenait ni `multaqa.js`, ni `data-view="multaqa"`, ni la route. Les changements communautaires sont restés sur la branche de la PR #17 et n'ont pas été promus vers `main`. Les lots Messenger 498–513 n'ont supprimé aucun de ces éléments.
- Le dossier confirme déjà l'application de la migration communautaire sur le projet Supabase actif sous l'identifiant `20261113201922_multaqa_community_feed`, puis la vérification en lecture seule des quatre tables, de RLS et des huit RPC. Aucune nouvelle migration n'est nécessaire pour réintroduire le client.

## Lot 516 — PR isolée de restauration du forum (14 novembre 2026)

- Création de la branche indépendante `fix/restore-multaqa-only` depuis le `main` courant `12367172a6038cfd9de709be37e6de9fa62b9462`. Aucun commit sur `main` et aucun changement de la PR #17.
- PR brouillon #19 ouverte vers `main` : https://github.com/bridrandomtv-spec/ALLEMAND/pull/19 ; HEAD initial `0fabc72ee848fdd146777b0e8745dffe4c0bef11`.
- Périmètre limité à cinq fichiers : `app.js`, `index.html`, `multaqa.js`, `style-prototype-dz.css`, `sw.js`. Restauration de la vue, du client RPC, des styles responsive, du routage et du précache.
- La navigation et l'accès direct au `multaqa` sont filtrés au rôle `eleve`. La route `msg` a aussi été ajoutée à `VIEWS` sur cette base `main`, où l'onglet et la vue Messenger existaient déjà mais la route manquait ; aucune logique de conversation Messenger n'a été modifiée.
- La PR ne contient aucun SQL/migration, aucune modification de `supabase/supabase.js`, Auth, RLS, Storage ou donnée. Elle ne déclenche aucune opération Supabase et aucun déploiement Cloudflare volontaire.
- Contrôle statique des cinq fichiers : vue HTML, script client, route, filtre de rôle, RPC attendues et précache présents. Aucun test runtime n'est revendiqué ; les jobs GitHub Actions observés échouent encore avant la première étape, sans runner ni logs.
- PR #19 est un brouillon, ouvert et non fusionné. PR #17 demeure ouverte et non fusionnée. Production et `main` restent inchangés.


### Addendum Lot 516 — précision du client et statut CI (14 novembre 2026)

- Relecture du diff de la PR #19 : exactement cinq fichiers applicatifs, aucun SQL/migration ni modification Supabase. La branche est à 6 commits au-dessus de `main`, 0 en retard ; la PR #19 reste brouillon, ouverte et non fusionnée.
- Correction documentaire du commentaire d'en-tête de `multaqa.js` : les publications/commentaires/réactions utilisent les RPC ; la carte latérale appelle le helper existant `SB.myProfile()` pour le compte connecté, sous les règles RLS existantes. Le commentaire précédent affirmait à tort qu'aucune lecture de profil REST n'avait lieu.
- Le run CI principal déclenché à l'ouverture de la PR #19 (`43596204451`) s'est terminé en échec. Son job `Validation structurelle & pédagogique` (`132451124276`) renvoie `steps=[]`; aucun contrôle du code n'a été exécuté. Cela ne constitue ni un échec fonctionnel du forum ni une validation runtime.
- La PR #17 reste ouverte et non fusionnée. Aucun déploiement, test sur compte réel, écriture Supabase ou changement de `main` n'a été effectué.



## Lot 517 — cause confirmée du blocage GitHub Actions et reprise du diagnostic Realtime (14 novembre 2026)

### Cause du non-démarrage des runners désormais confirmée
- L'annotation exacte fournie depuis l'interface GitHub Actions indique : « The job was not started because recent account payments have failed or your spending limit needs to be increased. Please check the 'Billing & plans' section in your settings ».
- Cette information explique les jobs terminés avant leur première étape, avec `steps=[]` / `steps=null`, sans runner attribué et sans journaux exploitables. Les scripts CI, y compris le test local Realtime de `msg_messages`, n'ont donc pas été exécutés dans ces runs.
- Cette annotation remplace la conclusion des Lots 511 à 516 selon laquelle la cause exacte restait inconnue : le blocage de provisionnement est maintenant associé à l'état de facturation ou à la limite de dépenses du compte GitHub.
- L'avis séparé sur la migration de `ubuntu-latest` vers Ubuntu 26 à compter du 19 octobre 2026 est informatif et n'explique pas le non-démarrage des jobs. Aucun changement de runner/workflow n'est justifié par cet avis.
- Aucune modification de facturation ni augmentation de limite n'a été effectuée ou demandée. Les validations doivent continuer par revue statique et tests locaux réellement exécutables ; ne pas relancer en boucle les mêmes workflows tant que le blocage GitHub n'est pas levé par le propriétaire du compte.

### État des PR et périmètres
- PR #17 : toujours ouverte, non fusionnée, base `main`, HEAD observé `5f921b07bf90d7acda3cc1e1feba64b6120af8d7`; GitHub retourne `mergeable=true`, sans que cela vaille validation fonctionnelle ou autorisation de fusion.
- PR #19 : ouverte, brouillon, non fusionnée, base `main`, branche `fix/restore-multaqa-only`, HEAD observé `f56663fb66d0a872488258032d5e8c943097ea6a`; cinq fichiers modifiés. Elle reste indépendante de la PR #17.
- Aucun changement direct sur `main`, aucune fusion, aucun déploiement Cloudflare et aucune écriture Supabase de production dans ce lot.

### Conséquence pour le diagnostic Messenger Realtime
- Le test d'intégration ajouté au Lot 510 (`msg_messages INSERT → CDC → WebSocket → SELECT RLS`) demeure non exécuté et non validé : le blocage GitHub intervient avant les étapes du job, pas dans le test lui-même.
- Il n'est pas correct de conclure que Realtime fonctionne ou échoue à partir de ces runs. Il faut conserver le test et reprendre son exécution uniquement dans un environnement local réellement disponible ou après rétablissement du runner GitHub.
- Les correctifs applicatifs Realtime des Lots 498, 499 et 501 sont présents dans la branche de la PR #17 mais absents de `main`. La production issue de `main` ne peut donc pas être considérée comme bénéficiant de ces correctifs tant qu'ils n'ont pas été promus ; aucune fusion n'est autorisée implicitement.
- Le preview Cloudflare ne constitue pas un bac à sable Supabase : le contrôle Supabase Preview est ignoré et le client du preview peut viser le projet Supabase actif. Ne pas envoyer de messages de test depuis ce preview avec des comptes réels.
- Prochaine action sûre : poursuivre la comparaison statique des versions `msg.js` / `supabase/supabase.js` et vérifier les mécanismes de cycle de vie des canaux Realtime, sans écrire dans la base active. Une correction ne sera proposée que si un défaut concret est démontré par le code ou par un test isolé exécutable.

### Décisions de sûreté
- Pas de paiement, pas d'augmentation de limite, pas de création de branche Supabase payante.
- Pas de test de message avec des comptes réels, pas de DDL/DML, pas de changement Auth/RLS/Realtime/Storage de production.
- PR #17 et PR #19 restent ouvertes et non fusionnées ; `main` et la production restent inchangées.



## Lot 518 — première cause applicative plausible isolée dans le cycle Realtime (14 novembre 2026)

### Comparaison directe de `msg.js` entre `main` et PR #17
- `main` : blob `msg.js` `1b4e2223ee587dfb12f4855700b37c96b7f8ae80` (20 656 caractères).
- PR #17 : blob `msg.js` `4a3f1b331c1a91a95a8fdf8926bd6e40657f2ecd` (37 702 caractères).
- Le client Realtime de `main` charge l'instantané des 50 derniers messages dans `renderThread(id)`, injecte le HTML, puis appelle `startChannel(id)`. Il n'effectue aucun rechargement de réconciliation après le statut `SUBSCRIBED`.
- Il existe donc une fenêtre de perte : si un message est inséré après la lecture initiale `msgMessages(id)` mais avant que l'abonnement Realtime soit effectivement confirmé, l'événement INSERT peut ne pas être reçu et le message n'apparaît pas dans le fil jusqu'à un rafraîchissement manuel ou une nouvelle ouverture.
- La branche PR #17 ajoute précisément une réconciliation après `SUBSCRIBED` : `renderThread(id, true)` recharge l'instantané serveur sans recréer le canal. C'est le correctif ciblé pour fermer cette fenêtre de course.
- Autre défaut confirmé sur `main` : le handler UPDATE appelle `renderThread(id)` sans préserver le canal. Comme le rendu termine par `startChannel(id)`, chaque UPDATE peut fermer puis recréer l'abonnement. La branche PR #17 utilise `renderThread(id, true)` et conserve le canal.
- La branche PR #17 ajoute également `channelEpoch` et `renderEpoch` pour ignorer les réponses asynchrones devenues obsolètes lors d'un changement de conversation, et vérifie l'identité de la conversation après l'attente de création du client Supabase.
- Le handler INSERT de PR #17 protège aussi l'insertion DOM après les lectures asynchrones des noms et des pièces jointes en revérifiant l'époque du canal et la conversation courante.

### Portée de la conclusion
- Ces différences établissent des défauts de cycle de vie et une fenêtre de course réels dans le code de `main`. Elles rendent plausible une réception intermittente/incomplète sur la production, particulièrement lors de l'ouverture du fil et des UPDATE.
- Elles ne prouvent pas à elles seules que tous les symptômes observés proviennent de cette fenêtre, ni que le transport Supabase Realtime est sain. Le test isolé `msg_messages INSERT → CDC → WebSocket → SELECT RLS` du Lot 510 reste nécessaire pour distinguer un défaut applicatif d'un défaut du transport/RLS.
- `supabase/supabase.js` conserve la même fonction utilitaire `msgSubscribe` sur les deux branches ; le différentiel pertinent de ce diagnostic se trouve dans le cycle de vie géré par `msg.js`, pas dans cette fonction utilitaire.
- La production basée sur `main` ne bénéficie pas des protections ajoutées dans la branche PR #17. Ne pas fusionner PR #17 automatiquement : elle contient un grand ensemble de changements sans rapport avec le correctif Messenger.
- Aucun code applicatif n'a été modifié dans ce lot ; diagnostic fondé sur lecture comparative des deux versions.
- Aucun message réel, aucune écriture Supabase, aucun changement Auth/RLS/Realtime/Storage, aucune fusion, aucun changement de `main`, aucun déploiement.
- Validation dynamique non réalisée : GitHub Actions reste bloqué avant la première étape par l'annotation de facturation documentée au Lot 517.

### Prochaine étape
- Auditer le test local Lot 510 et sa fixture pour vérifier que son protocole WebSocket démontre bien l'accusé de réception de l'abonnement, l'événement INSERT et la lecture RLS, sans dépendre d'un état de runner inaccessible.
- Ne pas créer un nouveau correctif applicatif tant que le test local n'est pas exécutable ; conserver les protections déjà présentes dans PR #17 comme correctif candidat, sans les promouvoir en production.



## Lot 519 — audit statique approfondi du test CDC `msg_messages` (14 novembre 2026)

### Éléments vérifiés
- Lecture complète de `ci/msg-supabase-local-test.mjs`, `ci/msg-supabase-local-bootstrap.sql`, `.github/workflows/msg-supabase-local-test.yml`, ainsi que des migrations locales `202611130001_msg_invitation_consent.sql` et `202611130003_msg_student_discovery.sql`.
- Le test de message est bien séquencé après l'acceptation d'une invitation synthétique : le destinataire est donc déjà membre de la conversation avant l'ouverture du canal.
- Le WebSocket utilise le JWT du destinataire et une souscription `postgres_changes` ciblée sur `public.msg_messages`, événement `INSERT`, filtre `conversation_id=eq.<id>`.
- Le test attend à la fois l'accusé de réception `phx_reply` contenant la table attendue et le message système `postgres_changes` avec `status=ok` avant d'insérer le message. Il ne confond donc pas simplement l'ouverture TCP/WebSocket avec la disponibilité CDC.
- L'insertion HTTP utilise le JWT de l'expéditeur. Le test vérifie ensuite le contenu, l'identifiant, le conversation_id et le sender_id de l'événement, relit le message avec le JWT du destinataire et vérifie qu'un troisième compte non membre ne peut pas le lire.
- La fixture active RLS sur `msg_messages`, accorde les privilèges SQL nécessaires à `authenticated`, ajoute la table à `supabase_realtime` et laisse les migrations ciblées installer les règles d'accès et RPC de consentement.
- Le workflow démarre une pile Supabase CLI locale éphémère, prépare le schéma synthétique, applique uniquement les deux migrations Messenger ciblées, puis exécute le test Node 22. Les contrôles et diagnostics sont exécutés dans ce job local ; aucune URL de projet Supabase hébergé n'est fournie par ce workflow.

### Résultat de l'audit
- Aucun défaut certain dans le scénario INSERT/CDC/lecture RLS n'a été démontré par la lecture statique. Le test couvre bien le trajet qui manquait et attend explicitement la disponibilité CDC.
- Cette conclusion est uniquement statique : elle ne prouve pas que le test passe sur une pile locale. Les versions effectives des images Realtime/Postgres, le handshake réel et le format des trames ne peuvent être validés sans exécution.
- Les assertions de confidentialité portent sur la lecture PostgREST du tiers non membre ; le test ne crée pas encore de seconde souscription Realtime par un tiers pour démontrer directement l'absence d'événement chez cet abonné. Cela constitue une extension possible, mais elle ne doit pas être confondue avec le test de réception principal.
- Le scénario n'ajoute pas encore UPDATE, suppression logique ou reconnexion. Ces cas restent volontairement en attente du succès du test INSERT de base.
- Aucun changement applicatif, SQL ou workflow n'a été effectué au Lot 519 ; aucune relance identique des workflows n'a été faite, car l'annotation GitHub de blocage de facturation empêche les jobs de démarrer.

### État GitHub revérifié
- PR #17 : ouverte, non fusionnée, branche `design/prototypes-67-74-alignment`, HEAD `f6509d8a4a199c6a856b79717b2b672bbe2d3c15`, 2 845 commits / 235 fichiers dans cette PR. Le volume de cette PR renforce la décision de ne pas l'utiliser comme véhicule de promotion isolé du correctif Messenger.
- PR #19 : ouverte, brouillon, non fusionnée, branche `fix/restore-multaqa-only`, HEAD `f56663fb66d0a872488258032d5e8c943097ea6a`, exactement cinq fichiers modifiés (`app.js`, `index.html`, `multaqa.js`, `style-prototype-dz.css`, `sw.js`). Elle reste distincte du diagnostic Messenger.
- Les deux PR ont un indicateur GitHub `mergeable=true` au moment de la lecture ; cela ne constitue ni un résultat de tests ni une autorisation de fusion.
- `main` n'a pas été modifiée. Pas de fusion, pas de déploiement Cloudflare, pas d'accès en écriture à Supabase hébergé.

### Suite du diagnostic
- Ne pas élargir les tests tant que le test INSERT n'a pas une première exécution réelle.
- La prochaine validation doit être un lancement local isolé de la pile Supabase CLI ou une exécution GitHub après résolution volontaire du blocage de provisionnement. Aucun changement de facturation n'est entrepris.
- Après réussite du test de base, ajouter séparément une souscription tiers pour vérifier le filtrage RLS Realtime, puis UPDATE, soft-delete et reconnexion. Si le test échoue, exploiter d'abord le premier message d'erreur et les journaux Realtime du conteneur avant de modifier le code applicatif.

## Lot 520 — Parité du schéma de test Realtime avec la table réelle

### Contrôle effectué
- Comparaison statique de `supabase/msg_schema.sql` avec `ci/msg-supabase-local-bootstrap.sql` et le scénario `ci/msg-supabase-local-test.mjs`.
- La table réelle `public.msg_messages` contient notamment `id`, `conversation_id`, `sender_id`, `body`, `attachment_id`, `flagged`, `created_at`, `edited_at`, `deleted_at`. Le fixture local omettait `attachment_id`.
- Le scénario actuel envoie un message texte et contrôle l'événement CDC ; l'absence de cette colonne n'expliquait pas à elle seule le blocage de runner ni ne prouvait la cause du défaut de réception, mais elle réduisait la fidélité du schéma de test.

### Correction locale
- Ajout de `attachment_id bigint` au fixture éphémère, à la même position logique que dans le schéma applicatif.
- Fichier modifié : `ci/msg-supabase-local-bootstrap.sql`.
- Commit : `3461ff7adf1dbda677be61bf36954fb44fd628df`.
- Aucun changement de code applicatif, de migration de production, de politique RLS hébergée ou de workflow.

### Limites et suites
- Le fixture demeure volontairement minimal : il ne reproduit pas tous les triggers métier de `msg_schema.sql` (limitation assumée pour isoler le transport INSERT/CDC/RLS). Il faut donc lire le résultat du futur test comme un test d'intégration ciblé du chemin Realtime, pas comme une reproduction exhaustive de la base de production.
- L'annotation du run GitHub Actions 43596842138 confirme que le runner n'a pas été provisionné en raison d'un problème de facturation/limite de dépenses ; l'avertissement Ubuntu 26 est indépendant et informatif.
- Le test reste non exécuté. Aucun résultat dynamique ne peut être annoncé.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée ; aucun déploiement Cloudflare et aucune écriture sur Supabase hébergé.

## Lot 521 — contrôle de confidentialité Realtime pour les non-membres

- Audit statique comparatif de `supabase/msg_schema.sql` et `ci/msg-supabase-local-bootstrap.sql` : le schéma de production définit sur `msg_messages` les colonnes `id`, `conversation_id`, `sender_id`, `body`, `attachment_id`, `flagged`, `created_at`, `edited_at`, `deleted_at`. Le fixture local reprend maintenant ces colonnes (dont `attachment_id`, ajouté au Lot 520).
- Le schéma de référence protège la lecture de `msg_messages` par la politique `msg messages lecture`, limitée aux membres de la conversation et aux modérateurs. La publication Realtime contient `public.msg_messages`. Le fixture local reproduit la politique de lecture membre/non-membre et l'ajout à la publication, mais reste volontairement minimal : il ne reproduit pas les triggers de limitation de débit, auto-flag, journalisation ni l'ensemble du modèle de modération.
- Lot 521 : ajout dans `ci/msg-supabase-local-test.mjs` d'un second abonné WebSocket synthétique, authentifié mais extérieur à la conversation. Il doit d'abord obtenir l'accusé de souscription et l'état CDC-ready ; ensuite l'expéditeur insère un message, le destinataire doit le recevoir, et le test observe pendant 2 secondes que le compte extérieur ne reçoit aucun événement pour cette conversation. Le test vérifie toujours séparément le refus de lecture REST du non-membre.
- Commit du test : `85dfa323d4526912912d16050a9a163cdc892b35`.
- Ce contrôle est ajouté au test local éphémère uniquement. Il ne touche ni les comptes réels, ni le projet Supabase hébergé, ni les politiques RLS de production, ni Cloudflare.
- **Non exécuté** : le runner GitHub Actions demeure bloqué avant démarrage par l'annotation de facturation du compte. Le nouveau contrôle est donc une assertion préparée, pas un résultat de test. Il faudra exécuter le workflow dans un environnement local isolé ou après rétablissement indépendant de l'accès aux runners, sans modifier le plafond de dépenses.
- PR #17 demeure ouverte et non fusionnée ; `main` reste inchangée. Aucun déploiement.

## Lot 522 — parité UPDATE, édition et suppression logique des messages

- L'audit du dossier a retrouvé le résultat de l'inspection antérieure du catalogue Supabase actif : `authenticated` ne possède pas de privilège UPDATE global sur `msg_messages`; seuls `body`, `edited_at` et `deleted_at` sont modifiables. Les colonnes `sender_id`, `conversation_id`, `attachment_id`, `flagged` et `id` ne sont pas modifiables par ce rôle. La policy active limite l'UPDATE à l'expéditeur ou au modérateur, avec contrôle de la ligne après mise à jour.
- Écart constaté dans le test synthétique : le bootstrap accordait auparavant UPDATE sur toute la table et ne créait pas la policy `msg messages edition`. Il ne pouvait donc pas valider les garde-fous de l'édition/suppression.
- Correctif du bootstrap local : ajout de la policy UPDATE expéditeur/modérateur avec `USING` et `WITH CHECK`; retrait du privilège UPDATE global ; attribution du privilège UPDATE uniquement sur `body`, `edited_at` et `deleted_at`.
- Extension de `ci/msg-supabase-local-test.mjs` : la souscription destinataire écoute désormais tous les événements `msg_messages` ; le test vérifie l'édition par l'expéditeur et l'événement Realtime UPDATE, le refus d'édition par le non-membre, le refus de modification de `sender_id` malgré l'identité de l'expéditeur, puis la suppression logique via `deleted_at` et son événement UPDATE. L'abonné extérieur observe les événements INSERT et UPDATE et doit n'en recevoir aucun.
- Commits : bootstrap RLS/grants `0a44aa60a5536fac053d189aeaecdcbe929629f0` ; tests édition/suppression `b1d7438924b660953d500e33d9d5a13d59684d87` ; observation de tous les événements privés `e339ff8f9b32d70429766d0cf9add0bc8f28e5b2`.
- Limite : ce fixture est un environnement synthétique ciblé, pas une copie complète des triggers et objets de production. Les tests restent **non exécutés** tant que les runners GitHub sont bloqués par l'annotation de facturation. Aucun changement sur la base Supabase hébergée, aucune donnée réelle, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée ; `main` n'est pas modifiée.

## Lot 523 — durcissement du cycle de vie Realtime et reprise au premier plan

- Audit de `msg.js` : le callback `SUBSCRIBED` d'un canal de conversation ne vérifiait pas son `channelEpoch`. Un canal fermé pouvait donc encore déclencher `renderThread(id, true)` après un changement de conversation. Les callbacks INSERT, UPDATE et Presence n'étaient pas tous protégés par la génération du canal.
- Correctif : les callbacks SUBSCRIBED, INSERT, UPDATE et Presence vérifient maintenant la génération courante ; SUBSCRIBED vérifie aussi que `state.ch` référence encore le canal concerné. Les états `CHANNEL_ERROR`, `TIMED_OUT` et `CLOSED` sont signalés comme connexion instable.
- Reprise : au retour réseau (`online`), au retour de page (`pageshow`) et au retour de visibilité (`visibilitychange` vers visible), une réconciliation différée recharge le fil depuis l'API et recrée le canal. Les réponses anciennes restent neutralisées par `renderEpoch`. Le timer de reprise est annulé à la fermeture du canal et à la sortie de la vue Messenger ; la conversation courante est invalidée lorsqu'on quitte cette vue.
- Ajout de contrôles statiques Lot 523 dans `ci/check-msg.mjs` pour prévenir la régression des gardes de génération, des événements de reprise et de l'annulation du timer.
- Commits : correction du filtrage des callbacks et reprise `8be1b0aea55189b6780228694a1bb4ca1c0c1321` ; annulation de la reprise après navigation `30972cc2524dc39a8e02876b3ee4a8230fd128aa` ; contrôles statiques `0e9a1d2437f90c8158a46f82d00c19ef4f55f9ad`.
- Référence Supabase consultée : le guide Realtime documente la reconnexion avec backoff après `phx_error`, le traitement des fermetures inattendues et la nécessité de distinguer `SUBSCRIBED`, `CHANNEL_ERROR`, `CLOSED` et `TIMED_OUT`. La KB récente recommande également de journaliser les statuts et de vérifier les abonnements obsolètes. Sources : https://supabase.com/docs/guides/realtime/protocol et https://supabase.com/kb/troubleshooting/realtime-postgres-changes-troubleshooting.
- **Non validé dynamiquement** : les runners GitHub Actions restent bloqués par la restriction de facturation déjà constatée. Les nouveaux contrôles statiques sont ajoutés au script CI, mais n'ont pas été exécutés ici. Aucun test sur des comptes réels, aucune modification de Supabase hébergé, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.

## Lot 524 — sécurisation de la fin asynchrone d'envoi Messenger

- Audit du parcours `send()` / `SB.msgSend()` : après un INSERT réussi, l'ancien code appelait toujours `renderThread(conv)`. Si l'utilisateur changeait de conversation pendant que la requête réseau était en cours, la réponse tardive pouvait le ramener à l'ancienne conversation et remplacer son écran courant.
- Correctif dans `msg.js` : après la résolution ou le rejet de l'envoi, la fonction vérifie que `state.conv` correspond toujours à la conversation d'origine avant de toucher l'interface. Elle récupère les éléments d'erreur/bouton courants plutôt que de modifier des nœuds DOM potentiellement détachés. Les erreurs réseau rejetées sont désormais interceptées et le bouton courant est réactivé. Le composeur n'est vidé que s'il s'agit toujours du même élément.
- Analyse de livraison : l'expéditeur ignore volontairement son propre événement INSERT Realtime ; le rafraîchissement après confirmation de `msgSend` reste donc nécessaire pour afficher le message envoyé. Le destinataire, lui, reçoit l'événement INSERT et l'ajoute sans doublon si son identifiant existe déjà dans le fil. Le rafraîchissement complet remplace le contenu du fil, il ne concatène pas un second exemplaire.
- Contrôles statiques Lot 524 ajoutés à `ci/check-msg.mjs` : réponse d'envoi tardive après navigation, capture des erreurs réseau, protection du composeur remplacé.
- Commits : correctif `fc4fd174263bd7364935320c26de51d44a6ac4d7` ; assertions CI `24039f3aacb14ad44e9257d2474223c1fad4a7d1`.
- Limite identifiée : une coupure réseau après validation côté serveur mais avant réception de la réponse HTTP peut rendre l'issue de l'INSERT ambiguë pour le client. Il n'existe pas dans le schéma actuellement audité de clé d'idempotence client pour garantir qu'une répétition manuelle ne crée jamais un doublon. Je n'ajoute pas de colonne ni de migration sans autorisation explicite et test local dynamique.
- **Non validé dynamiquement** : les contrôles CI ne sont pas exécutés car les runners GitHub Actions restent bloqués par la restriction de facturation. Aucun changement Supabase hébergé, aucun compte réel, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.


## Lot 525 — ordre déterministe de l'historique et limite d'idempotence

- Audit ciblé de supabase/supabase.js, supabase/msg_schema.sql, msg.js et du fixture PostgreSQL local. Le fil charge actuellement les 50 derniers messages, puis les remet en ordre chronologique pour l'affichage. La requête ne triait que sur created_at; plusieurs INSERT pouvant partager le même horodatage, leur ordre relatif n'était pas déterministe.
- Correctif sans changement de schéma : msgMessages() trie maintenant par created_at DESC, puis id DESC. Le rendu conserve ensuite l'ordre chronologique. L'identifiant primaire bigint sert de second critère stable; aucun champ métier n'est réinterprété.
- Vérification de l'idempotence : le schéma msg_messages ne comporte que l'identifiant serveur, la conversation, l'expéditeur, le corps, la pièce jointe, les indicateurs et les horodatages. Aucun client_nonce, idempotency_key ou request_id n'existe dans le schéma versionné ni dans le fixture de test. L'INSERT client ne transmet donc aucun identifiant de requête persistant. Une garantie exactement une fois après perte de la réponse HTTP ne peut pas être construite honnêtement côté navigateur avec les colonnes actuelles; comparer le texte et l'heure serait ambigu si un élève envoie deux fois le même texte.
- Aucun faux mécanisme d'idempotence ajouté. Une garantie robuste nécessiterait un jeton client stocké et protégé par contrainte unique, puis une adaptation SQL/RLS et des tests PostgreSQL; cela implique une évolution du schéma et n'est pas engagé sans autorisation.
- Le paramètre before de msgMessages() existe mais aucun appelant actuel ne l'utilise : renderThread() demande toujours null, 50. La pagination historique n'est donc pas encore exposée dans l'interface. Si elle est activée, le curseur devra être composite (created_at, id) afin de ne pas sauter les messages partageant le même timestamp.
- Contrôle statique ajouté dans ci/check-msg.mjs pour le tri secondaire et l'absence documentée de clé d'idempotence dans le schéma.
- Commits Lot 525 : tri stable d159940ff3841193258e1824ee6ba464b65890ea; assertions statiques 7eb33c5b8aed886a0260c49d76ec3bc9120f6301; dossier à suivre.
- Validation dynamique non acquise : les runners GitHub Actions restent bloqués par l'annotation de facturation. Aucun test PostgreSQL local n'a été exécuté dans cette session. Aucun accès en écriture à Supabase hébergé, aucune migration, aucun changement Auth/RLS/Realtime/Storage/paiement, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée; main reste inchangée.

## Lot 526 — correction d'une course INSERT Realtime / rendu DOM

- Audit du callback INSERT dans msg.js : le callback capturait l'élément `.msg-thread` avant deux opérations asynchrones (`fetchNames()` et `attachmentsFor()`). Pendant ces attentes, un événement UPDATE ou une réconciliation `SUBSCRIBED` pouvait appeler `renderThread(id, true)`, remplacer le contenu de `#msgBody` et détacher l'ancien fil. Le callback INSERT continuait ensuite à écrire dans l'ancien élément DOM, sans erreur visible : le message était reçu par Realtime mais n'apparaissait pas dans l'écran courant jusqu'au prochain rechargement.
- Correctif : capture de `state.renderEpoch` au début du traitement asynchrone; après les lectures, abandon si le rendu a changé. Le callback récupère ensuite le `.msg-thread` actuellement monté, vérifie `isConnected`, puis recontrôle l'absence du `data-mid` avant insertion. Le contrôle de `channelEpoch` et de la conversation reste en place.
- Ce défaut explique un scénario précis de réception intermittente côté interface; il ne prouve pas à lui seul que tous les symptômes Realtime ont la même cause. Il est distinct d'un refus CDC/RLS côté serveur.
- Contrôle statique Lot 526 ajouté dans ci/check-msg.mjs pour exiger le garde `renderEpoch`, la récupération du DOM courant, `isConnected` et la déduplication juste avant insertion.
- Commits : correctif msg.js db4f6a1aea84c2602e995d78e6dc6c4bde0b2c11; assertion CI a1fd163d1d3f742910b80089baa7847b56b388f2; dossier à suivre.
- Validation dynamique non effectuée : GitHub Actions reste bloqué par l'annotation de facturation. Le test Supabase local de bout en bout existe mais n'a pas pu démarrer. Aucun test sur Supabase hébergé, aucun changement DB/RLS/Realtime/Auth/Storage, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée; main inchangée.


## Lot 527 — regroupement des rafales UPDATE Realtime

- L'audit du fil confirme que chaque événement UPDATE déclenchait immédiatement un rendu complet. Une modification de message, son ajout de pièce jointe et plusieurs changements rapprochés pouvaient donc lancer plusieurs chaînes concurrentes de session + lecture des 50 messages + profils + métadonnées de pièces jointes.
- Les générations renderEpoch empêchaient déjà une réponse ancienne de remplacer un rendu plus récent : aucun défaut de perte de données n'est démontré ici. Le problème identifié est une amplification inutile des requêtes et des rendus concurrents sous rafale CDC, qui augmente la latence et multiplie les occasions de courses DOM.
- Correctif dans msg.js : les UPDATE d'une même conversation sont regroupés sur une fenêtre de 90 ms. Chaque nouvel UPDATE repousse l'échéance; à la fin de la rafale, un seul instantané HTTP du fil réconcilie le texte, l'édition, la suppression logique et les métadonnées de pièce jointe. Le callback vérifie toujours la génération du canal et la conversation courante. Le timer est annulé dans closeChannel() pour empêcher un rafraîchissement après navigation ou fermeture.
- Assertion statique Lot 527 ajoutée à ci/check-msg.mjs : présence du debounce, garde de génération/conversation, rendu conservant le canal et annulation du timer.
- Limite : ce regroupement ne répare pas une souscription serveur qui ne reçoit aucun événement; il réduit seulement le travail déclenché par les UPDATE effectivement reçus. Le flux INSERT conserve son chemin dédié et la protection DOM du Lot 526.
- Validation dynamique toujours non acquise : les jobs GitHub Actions sont bloqués avant démarrage par la restriction de facturation déjà signalée. Aucun test réel, aucun accès en écriture à Supabase hébergé, aucune modification de schéma/RLS/Auth/Realtime/Storage, aucun déploiement Cloudflare.
- PR #17 demeure ouverte et non fusionnée; main inchangée.


## Lot 528 — diagnostic des statuts et reprise bornée des canaux Realtime

- Audit du callback subscribe : le code recevait seulement le statut et ignorait le second argument err. Les statuts CHANNEL_ERROR, TIMED_OUT et CLOSED étaient affichés à l'écran mais ne laissaient aucune trace technique exploitable dans la console.
- Documentation Supabase consultée le 14 novembre 2026 : le callback subscribe(status, err) expose l'erreur complète, dont cause et les champs structurés; la KB Realtime distingue les trois statuts et recommande de diagnostiquer les erreurs et de reprendre après un CLOSED/TIMED_OUT inattendu. Le client gère déjà la reprise interne de certains CHANNEL_ERROR; le code ne force donc pas la destruction du canal pour ce statut. Sources : https://supabase.com/docs/reference/javascript/subscribe ; https://supabase.com/kb/troubleshooting/realtime-messages-not-arriving ; https://supabase.com/changelog?tags=realtime.
- Correctif msg.js : le callback reçoit désormais (st2, err) et journalise l'objet d'erreur complet avec console.warn, sans afficher de jeton ni de contenu de message. TIMED_OUT et CLOSED inattendus planifient une réconciliation HTTP suivie de la création d'un nouveau canal. Si le client se rétablit entre-temps et émet SUBSCRIBED, le timer est annulé et le compteur de reprises remis à zéro.
- Protection anti-boucle : délai de reprise exponentiel à partir de 250 ms, plafonné à 32 secondes; une reprise déjà planifiée n'est pas repoussée par les notifications suivantes. CHANNEL_ERROR reste confié au mécanisme de retry interne du client, afin d'éviter de créer un canal concurrent pendant sa propre reconnexion.
- Assertion statique ajoutée à ci/check-msg.mjs pour le diagnostic de l'erreur, le traitement distinct des statuts, l'annulation après SUBSCRIBED et le backoff.
- Limite : cette modification améliore l'observabilité et le traitement des fermetures/timeouts; elle ne démontre pas encore que la réception fonctionne sur le projet hébergé. Le test d'intégration local Supabase reste non exécuté à cause du blocage GitHub Actions déjà documenté.
- Aucun test sur des comptes réels, aucune écriture ou modification de configuration sur Supabase hébergé, aucun changement de schéma/RLS/Auth/Realtime/Storage, aucun déploiement Cloudflare. PR #17 reste ouverte et non fusionnée; main inchangée.


## Lot 529 — initialisation single-flight du client Supabase

- Audit de l'initialisation dans supabase/supabase.js : le chemin UMD construit le client de façon synchrone. En revanche, si le global UMD n'est pas disponible et que l'un des imports CDN est utilisé, plusieurs appels simultanés à sb() pouvaient tous entrer dans la boucle import() avant l'affectation de client. Ils pouvaient alors construire plusieurs instances Supabase indépendantes.
- Risque Messenger : le canal Realtime peut être créé avec une instance, tandis qu'une lecture HTTP ou un autre module récupère une autre instance. Les deux utilisent la même configuration et le stockage de session, mais leurs cycles de vie Auth/Realtime ne sont pas mutualisés.
- Correctif : ajout de clientPromise (single-flight). Le premier appel crée la promesse d'initialisation; tous les appels concurrents attendent cette même promesse. En cas d'échec complet des CDN, la promesse est réinitialisée afin qu'un appel ultérieur puisse retenter le chargement. Le chemin UMD normal reste inchangé.
- Contrôle statique ajouté à ci/check-msg.mjs pour vérifier la promesse partagée, le retour du client existant et la remise à zéro après échec.
- Audit de session : le client est configuré avec persistSession:true; autoRefreshToken reste sur sa valeur par défaut du SDK (activée). La session Messenger interrogée par SB.me() est la session Auth Supabase; la session locale dz_de_session_v1 ne constitue pas le JWT Supabase et ne doit pas être utilisée pour autoriser les lectures Realtime.
- Limite : le défaut de concurrence est corrigé dans le code, mais aucun test navigateur avec panne CDN simulée ni vérification de l'instance runtime n'a pu être exécuté dans cette session. Les tests CI restent soumis au blocage de démarrage des runners.
- Aucun test sur comptes réels, aucune modification Supabase hébergé, aucune migration ni modification Auth/RLS/Realtime/Storage, aucun déploiement Cloudflare. PR #17 reste ouverte et non fusionnée; main inchangée.

## Lot 530 — cycle de vie Auth et renouvellement du JWT Realtime

- Vérification du SDK réellement chargé par la plateforme : @supabase/supabase-js@2.119.0 est référencé dans le script UMD de index.html et dans le repli ESM de supabase/supabase.js. Inspection du code source exact de cette version (SupabaseClient.ts, méthodes _listenForAuthEvents / _handleTokenChanged) : le client écoute déjà ses propres événements Auth et appelle realtime.setAuth(token) sur TOKEN_REFRESHED, SIGNED_IN et INITIAL_SESSION; il retire le jeton Realtime sur SIGNED_OUT. Le renouvellement du JWT pendant une souscription active est donc pris en charge par le SDK. Ajouter un second setAuth() applicatif aurait été redondant et risquait de créer une course de synchronisation.
- Défaut complémentaire observé dans msg.js : l'application ne suivait pas les événements d'identité Auth. Si le compte changeait ou se déconnectait alors que Messenger était affiché, le canal et l'état state.me pouvaient rester associés à l'ancien compte jusqu'à une navigation ou une reconnexion manuelle, même si le SDK mettait à jour son propre jeton.
- Correctif dans msg.js : abonnement unique à client.auth.onAuthStateChange pour le client Supabase mutualisé. TOKEN_REFRESHED et INITIAL_SESSION sont laissés au traitement interne du SDK; seuls SIGNED_IN et SIGNED_OUT déclenchent une réconciliation UI différée hors du callback Auth (pour ne pas lancer de requêtes Supabase à l'intérieur du callback). À la déconnexion, les canaux conversation/invitations sont fermés et l'identité locale est invalidée; à la connexion, la liste ou le fil courant est rechargé. Aucun jeton n'est journalisé ou exposé.
- Cache applicatif : version de msg.js portée à 3521 et version du service worker à dz-de-v3.185.0.0.160; le précache et les assertions CI sont alignés pour éviter de servir le module précédent après publication du correctif.
- Contrôles statiques Lot 530 ajoutés à ci/check-msg.mjs : présence de l'écoute Auth, filtrage des événements d'identité, invalidation à la déconnexion et absence d'un realtime.setAuth() manuel dans Messenger.
- Source technique vérifiée : https://github.com/supabase/supabase-js/blob/v2.119.0/packages/core/supabase-js/src/SupabaseClient.ts (méthodes _listenForAuthEvents et _handleTokenChanged).
- Validation : inspection statique du code du SDK et du dépôt uniquement. Le test navigateur de renouvellement réel pendant un canal ouvert n'a pas été exécuté; GitHub Actions reste bloqué avant démarrage par l'annotation de facturation déjà documentée. Aucun test avec compte réel, aucune modification du projet Supabase hébergé (Auth, DB, RLS, Realtime ou Storage), aucun changement de configuration Cloudflare, aucun déploiement.
- PR #17 reste ouverte et non fusionnée; main reste inchangée.

## Lot 531 — reprise autonome du canal Realtime des invitations

- Audit distinct du canal de conversation et du canal d'invitations : `startChannel()` disposait déjà d'un callback de statut, d'un diagnostic et d'une reprise bornée pour `TIMED_OUT` / `CLOSED`. En revanche, `startInviteChannel()` appelait `subscribe()` sans callback. Une fermeture ou un timeout du flux `msg_invites` pouvait donc laisser la liste d'invitations sans réception temps réel, sans journal d'erreur et sans tentative de remplacement.
- Correctif dans `msg.js` : ajout d'un cycle de reprise propre aux invitations, indépendant du canal de conversation (`inviteRecoveryTimer`, compteur et indicateur dédiés). Le callback vérifie la génération du canal, son identité et l'utilisateur courant; `SUBSCRIBED` annule le timer et remet le backoff à zéro. `TIMED_OUT` / `CLOSED` déclenchent une nouvelle lecture de la liste puis une nouvelle souscription. `CHANNEL_ERROR` est journalisé mais laissé au mécanisme de retry interne du SDK, comme pour le canal principal.
- La reprise est exponentielle, démarre à 500 ms et plafonne à 32 secondes. Les événements `online`, `pageshow` et le retour à l'onglet visible relancent uniquement une reprise déjà nécessaire; ils ne recréent pas les canaux actifs. Les timers sont annulés lors de la fermeture/navigation pour éviter une réouverture sur une vue ou une identité obsolète.
- Assertions statiques Lot 531 ajoutées à `ci/check-msg.mjs` pour le cycle dédié, les gardes génération/identité, les statuts, le backoff et les événements de reconnexion.
- Cache applicatif : `msg.js?v=3522`, service worker `dz-de-v3.185.0.0.161`, précache et assertions CI alignés.
- Validation : relecture du code modifié et vérification statique des marqueurs/contrats; aucun test dynamique Realtime n'a pu être exécuté, car les runners Actions ne démarrent toujours pas en raison de la restriction de facturation. Aucun test sur compte réel, aucune modification Supabase hébergé, aucune migration/RLS/Auth/Realtime/Storage, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée; `main` reste inchangée.

## Lot 532 — vérification du retrait effectif des canaux Realtime

Objectif : vérifier si les fermetures de canaux Messenger laissent des abonnements fantômes dans `RealtimeClient.channels`, ce qui pourrait accumuler des canaux après changements de conversation, fermeture de la vue ou reconnexions.

Vérification de la version réellement utilisée par le projet (`@supabase/supabase-js@2.119.0`) dans les sources officielles du tag `v2.119.0` :

- `RealtimeChannel` enregistre un hook `_onClose(() => this.socket._remove(this))` lors de sa construction.
- `RealtimeClient._remove(channel)` filtre le canal correspondant de `this.channels` et planifie la déconnexion du transport lorsqu'il ne reste plus de canaux.
- `channel.unsubscribe()` déclenche le processus de désabonnement/fermeture ; le hook `_onClose` effectue donc le retrait du tableau du client.
- `client.removeChannel(channel)` attend en plus le résultat du désabonnement et appelle `channel.teardown()` uniquement si le statut est `ok`. Ce n'est pas nécessaire pour obtenir le retrait du tableau : celui-ci est déjà assuré par le hook de fermeture du canal.

Conclusion : l'hypothèse d'une accumulation systématique des canaux due à l'utilisation actuelle de `unsubscribe()` n'est pas confirmée. Remplacer mécaniquement les fermetures par `removeChannel()` ne serait pas un correctif démontré et introduirait une complexité asynchrone inutile dans les fonctions de fermeture synchrones. Aucun changement applicatif ou Supabase n'est effectué pour ce lot.

Fichiers Messenger consultés sur la branche PR #17 : `msg.js` (fermetures `closeChannel()` et `closeInviteChannel()`, toutes deux utilisant `unsubscribe()`). Source SDK consultée : `packages/core/realtime-js/src/RealtimeChannel.ts` et `RealtimeClient.ts`, tag officiel `v2.119.0`.

Vérification limitée à l'inspection des sources : aucun test Realtime dynamique n'a été exécuté. Le blocage de démarrage des runners GitHub Actions lié à la facturation demeure distinct de ce résultat. Aucun accès à la base de production, aucune modification Auth/RLS/Realtime/Storage, aucun déploiement et aucune fusion de PR ne sont effectués.

## Lot 533 — invalidation des opérations UI lors d'un changement d'identité Auth

Constat : le listener Auth de Messenger traitait `SIGNED_OUT` en fermant les canaux et en effaçant `state.me`, mais ne changeait pas `state.renderEpoch`. Une lecture de liste ou de fil déjà en attente pouvait donc conserver le même jeton de rendu et continuer après la transition d'identité. De plus, une opération d'envoi/édition/suppression pouvait terminer après une reconnexion sur le même identifiant de conversation : le seul contrôle `state.conv` ne distinguait pas les deux sessions.

Correctif sur la branche PR #17 :

- Ajout de `state.authEpoch`, compteur de génération d'identité.
- À chaque `SIGNED_IN` ou `SIGNED_OUT`, incrément de `authEpoch` et de `renderEpoch`, fermeture des canaux conversation/invitations, effacement de l'identité locale et purge des jetons de recherche de pairs (`state.peers`).
- `SIGNED_OUT` efface aussi la conversation active. `SIGNED_IN` reconstruit la vue active après invalidation des opérations précédentes.
- `send()` capture l'epoch d'identité et ignore les réponses/résultats d'une session antérieure.
- Les callbacks d'édition et de suppression ne relancent plus le rendu si l'identité a changé pendant l'opération.
- Assertions statiques ajoutées à `ci/check-msg.mjs`; références cache alignées sur `msg.js?v=3523` et `dz-de-v3.185.0.0.162`.

Limites : ce lot traite les transitions Auth observées par le client et les opérations UI explicitement protégées. Il ne prouve pas l'issue côté serveur d'une requête déjà envoyée avant la déconnexion ; seul un test avec deux sessions synthétiques peut vérifier cette frontière. Aucun test Realtime dynamique n'a été exécuté, les runners Actions restant bloqués avant démarrage pour le motif de facturation déjà documenté.

Aucune modification de schéma, de données, d'Auth/RLS/Realtime/Storage en production, aucun déploiement et aucune fusion. PR #17 reste à confirmer visuellement et fonctionnellement avant toute fusion.


## Lot 534 — isolation des réponses de recherche et d'invitation entre sessions Auth

Constat : après le Lot 533, l'identité de session est invalidée avec `authEpoch`, mais trois opérations asynchrones du parcours de découverte/mise en relation n'en capturaient pas la génération. Une recherche de camarades commencée sous le compte A pouvait terminer après reconnexion sous le compte B et repeupler `state.peers` avec des jetons opaques liés à A. De même, une réponse tardive d'envoi, d'acceptation, de refus ou d'annulation d'invitation pouvait afficher un résultat ou relancer `renderList()` dans la nouvelle session.

Correctif sur la branche PR #17 :

- La recherche de camarades capture `state.authEpoch`; résultat et erreur sont ignorés si l'identité a changé. Le rendu d'erreur vérifie également que le conteneur de résultats est toujours connecté au document.
- L'envoi d'une invitation par jeton opaque capture l'epoch de session et ignore les callbacks de succès/erreur obsolètes.
- Les actions d'acceptation, refus et annulation d'invitation appliquent le même contrôle avant toute alerte ou navigation/rendu.
- Les requêtes déjà transmises au serveur ne sont pas annulées par ce garde-fou client : il empêche uniquement une réponse d'une ancienne session de modifier l'interface de la session courante. L'autorisation serveur reste déterminante.
- Assertions statiques dédiées ajoutées à `ci/check-msg.mjs`; cache du module aligné sur `msg.js?v=3524` et service worker sur `dz-de-v3.185.0.0.163`.

Validation : relecture des branches de callbacks et vérification des assertions source/cache. Aucun test dynamique n'a été exécuté : GitHub Actions ne démarre toujours pas ses runners en raison de la restriction de facturation déjà signalée. Aucun test sur compte réel, aucune modification Supabase hébergé (schéma, données, Auth, RLS, Realtime ou Storage), aucun déploiement Cloudflare et aucune fusion. PR #17 reste ouverte et non fusionnée.


## Lot 535 — sécurisation du parcours asynchrone des pièces jointes

Constat : le changement de compte ou de conversation pouvait survenir pendant les deux étapes du parcours fichier (création du message puis upload Storage). Le gestionnaire réutilisait ensuite des références DOM potentiellement détachées et pouvait lancer la seconde étape sous une session différente de celle qui avait initié le parcours.

Correctif sur la branche PR #17 :

- Capture de `state.authEpoch` et de l'identifiant de conversation au début du parcours fichier.
- Après chaque attente asynchrone, arrêt immédiat du traitement UI si l'identité ou la conversation a changé.
- Contrôle supplémentaire avant l'appel Storage : si la session a changé après la création du message, l'upload n'est pas démarré.
- Vérification de la connexion au document des éléments DOM avant de les modifier; gestion des exceptions réseau avec restauration du bouton uniquement s'il est encore présent.
- Cache actualisé : `msg.js?v=3525`, service worker `dz-de-v3.185.0.0.164`; assertions statiques ajoutées.

Limite importante : si la création du message a déjà été acceptée côté serveur avant la transition d'identité, ce message texte de pièce jointe peut rester sans fichier associé. Le garde-fou empêche la poursuite de l'upload et les mutations de l'ancienne interface, mais ne supprime pas rétroactivement une opération serveur déjà validée. Aucun test dynamique n'a été exécuté; les runners GitHub Actions restent bloqués avant démarrage par l'annotation de facturation. Aucune modification de Supabase hébergé, aucun déploiement et aucune fusion; PR #17 reste ouverte.


## Lot 536 — isolation des callbacks de modération et de vérification scolaire

Audit du gestionnaire d'événements : les actions de demande de vérification, création de groupe, décision de vérification d'un élève, traitement d'un signalement et signalement d'un message n'étaient pas toutes liées à la génération d'identité. Une réponse asynchrone pouvait donc déclencher une alerte, un rendu de liste ou modifier un bouton après déconnexion/reconnexion.

Correctifs sur PR #17 :
- Capture de `state.authEpoch` pour chacune de ces actions.
- Les callbacks de succès et d'erreur ignorent désormais les réponses d'une ancienne session.
- Le signalement utilisateur vérifie aussi que le bouton est toujours connecté au document avant toute mutation.
- Les exceptions sont traitées sans laisser de promesse rejetée sans gestion.
- Les attentes CI historiques relatives aux versions du module/service worker ont été alignées sur les versions réellement présentes; nouvelles assertions dédiées au Lot 536.
- Cache : `msg.js?v=3526`; service worker : `dz-de-v3.185.0.0.165`.

Validation : relecture des callbacks et vérification statique après écriture. Les opérations déjà transmises au serveur ne sont pas annulées par ce mécanisme; seule leur réponse côté interface est neutralisée si l'identité change. Les tests dynamiques restent non exécutés tant que GitHub Actions ne démarre pas de runner. Aucun changement Supabase hébergé, aucune modification SQL/RLS/Auth/Realtime/Storage, aucun déploiement et aucune fusion. PR #17 reste ouverte.

## Lot 537 — invalidation synchrone à la notification Auth

Constat : même après le Lot 533, le listener `onAuthStateChange` effectuait l'incrément de `authEpoch` et de `renderEpoch` à l'intérieur d'un `setTimeout(0)`. Entre la réception de `SIGNED_OUT` / `SIGNED_IN` et l'exécution de ce timer, une promesse de lecture ou un callback déjà planifié pouvait encore constater les anciennes générations et modifier l'interface.

Correctif sur la branche PR #17 :

- L'incrément de `authEpoch` et de `renderEpoch` est maintenant synchrone dès la réception de l'événement Auth. Les continuations asynchrones de l'ancienne identité deviennent immédiatement obsolètes.
- Les canaux conversation et invitations sont fermés immédiatement; l'identité locale et les jetons de pairs sont purgés avant le travail différé.
- À `SIGNED_OUT`, la conversation active est effacée immédiatement. À `SIGNED_IN`, la vue précédemment active est reconstruite dans le timer uniquement si sa génération d'identité est toujours la plus récente.
- Les opérations réseau de reconstruction restent hors du callback Auth : le timer ne fait que démarrer le rendu après validation du client et de l'epoch. Les transitions Auth successives rendent leurs timers antérieurs inopérants.
- Assertions statiques ajoutées/mises à jour dans `ci/check-msg.mjs` pour vérifier l'ordre d'invalidation synchrone et l'alignement des caches.
- Cache : `msg.js?v=3527`; service worker : `dz-de-v3.185.0.0.166`.

Validation : inspection du code et contrôle statique des marqueurs et références cache après écriture. Aucun test dynamique n'a été exécuté : les workflows GitHub Actions sont toujours bloqués avant le démarrage d'un runner par la restriction de facturation déjà signalée. Aucun compte réel, aucune modification de Supabase hébergé (schéma, données, Auth, RLS, Realtime ou Storage), aucun changement Cloudflare, aucun déploiement et aucune fusion. PR #17 reste ouverte et non fusionnée; `main` reste inchangée.

## Lot 538 — isolation du cache des noms entre sessions Auth

Constat : `fetchNames(ids)` charge les pseudos/niveaux des profils puis les écrit dans `state.names`, cache partagé du module Messenger. Le rendu de fil vérifiait bien son `renderEpoch` après `await fetchNames()`, mais la fonction elle-même pouvait encore alimenter le cache après une transition `SIGNED_IN` / `SIGNED_OUT`. Le garde-fou du rendu empêchait l'affichage immédiat dans l'ancien fil, mais ne protégeait pas cet état partagé; de plus, `state.names` n'était pas purgé au changement d'identité.

Correctif sur PR #17 :

- `fetchNames()` capture `state.authEpoch` au démarrage.
- La génération est vérifiée après l'initialisation/obtention du client Supabase et immédiatement après la lecture de `profiles`, avant toute écriture dans `state.names`.
- Le chemin d'erreur vérifie également la génération avant de réutiliser les valeurs du cache.
- Le listener Auth vide désormais `state.names` en même temps que `state.peers`, de façon synchrone avec l'invalidation des rendus et la fermeture des canaux.
- Assertions statiques ajoutées dans `ci/check-msg.mjs` pour la capture d'epoch, les vérifications post-await et la purge du cache.
- Cache : `msg.js?v=3528`; service worker : `dz-de-v3.185.0.0.167`; index, précache et assertions CI alignés.

Validation : vérification statique du chemin d'exécution et relecture des fichiers après écriture. Aucun test dynamique n'a été exécuté, les runners GitHub Actions restant bloqués avant démarrage par la restriction de facturation déjà documentée. Aucun compte réel, aucune modification Supabase hébergé (schéma, données, Auth, RLS, Realtime, Storage), aucun déploiement Cloudflare et aucune fusion. PR #17 reste ouverte et non fusionnée; `main` reste inchangée.


## Lot 539 — audit des lectures asynchrones du fil et du tableau Messenger

Audit effectué sur le HEAD réellement présent de la PR #17 (branche `design/prototypes-67-74-alignment`), après constat que le Lot 538 est déjà intégré dans le dossier et dans le code courant (`msg.js?v=3528`, service worker `.167`).

- `renderList()` vérifie son `renderEpoch` après la lecture de session, des groupes, des conversations, de la vérification, des invitations et des lectures de modération (signalements, journal et file de vérification) avant de poursuivre le rendu.
- `renderThread()` vérifie `renderEpoch` et l'identifiant de conversation après la session, le chargement des messages, la résolution des noms et la lecture des métadonnées de pièces jointes.
- `fetchNames()` capture `authEpoch`, vérifie la génération après obtention du client et après la lecture de `profiles`, puis seulement alimente `state.names`; le listener Auth vide ce cache à chaque changement d'identité.
- Les callbacks Realtime du fil contrôlent l'epoch du canal, la conversation et l'epoch de rendu avant toute insertion DOM; ils retrouvent le conteneur courant et vérifient `isConnected`.
- Les opérations de récupération des canaux sont annulées à la fermeture; leurs callbacks vérifient la conversation et l'état de vue avant de relancer un rendu.
- `session()` délègue la lecture à `SB.me()`, qui utilise `auth.getSession()`; ses appelants `renderList()` et `renderThread()` invalident ensuite le résultat par `renderEpoch` si une transition Auth a été observée. Aucun défaut supplémentaire démontrable dans ce parcours n'a été identifié pendant cette passe.

Décision : aucun changement applicatif spéculatif n'est apporté à `msg.js`, à `supabase/supabase.js` ou aux appels Realtime. Le Lot 538 est déjà présent dans le HEAD consulté; ce Lot 539 consigne la vérification du parcours de lectures et la décision de ne pas multiplier les garde-fous redondants.

Validation : inspection statique des fichiers de la branche uniquement. Aucun test navigateur ni test Realtime dynamique n'a été exécuté. Les workflows Actions restent à vérifier lorsqu'un runner pourra effectivement démarrer. Aucune modification de Supabase hébergé (schéma, données, Auth, RLS, Realtime, Storage), aucun changement Cloudflare, aucun déploiement et aucune fusion. PR #17 reste ouverte et non fusionnée; `main` reste inchangée.

## Lot 540 — rendre les diagnostics CDC stricts et vérifiables

Audit du transport Realtime sur le HEAD de la PR #17 :

- La migration `202611130001_msg_invitation_consent.sql` ajoute bien `public.msg_invites` à `supabase_realtime` (avec vérification préalable d'absence). Le bootstrap local ajoute séparément `public.msg_messages`; le workflow applique ensuite la migration d'invitation. Le constat initial d'une table d'invitation absente du seul bootstrap était donc incomplet et ne justifiait pas une modification SQL.
- Le workflow listait les tables de la publication, mais ne faisait pas échouer le job si l'une manquait. Le contrôle est désormais bloquant : les deux tables `msg_invites` et `msg_messages` doivent être présentes.
- Le test WebSocket de `msg_messages` vérifiait que le serveur accusait réception de la table, mais pas du filtre exact `conversation_id=eq.<id>`. Il exige maintenant que le `phx_reply` confirme aussi ce filtre. Cela permet de distinguer une souscription acceptée sur la mauvaise portée d'une souscription correctement filtrée.
- Les tests existants continuent de séparer l'ACK `phx_join`, le signal CDC `system/postgres_changes` prêt, la réception INSERT/UPDATE par le destinataire, et l'absence d'événement pour le non-membre. Ils vérifient aussi la lecture RLS HTTP indépendamment du transport.

Fichiers modifiés : `ci/msg-supabase-local-test.mjs`, `.github/workflows/msg-supabase-local-test.yml`, et le présent dossier. Aucun changement applicatif `msg.js`, aucune migration SQL, aucun changement de schéma ou de publication Supabase hébergée. Aucun déploiement Cloudflare ni fusion. PR #17 reste ouverte et non fusionnée.

Validation : relecture statique des modifications et vérification des assertions source uniquement. Le workflow n'a pas été exécuté : les runners GitHub Actions ne démarrent toujours pas à cause du blocage de facturation. Le contrôle renforcé n'est donc pas présenté comme un test dynamique réussi.


## Lot 541 — distinguer le silence RLS d'une perte du canal non-membre

Audit ciblé du test WebSocket du compte témoin non-membre dans `ci/msg-supabase-local-test.mjs`.

Constat : le test attendait que le compte extérieur ne reçoive aucun événement privé après avoir atteint l'état CDC-ready. Toutefois, après cet état, les événements `phx_error`, `phx_close` et l'erreur de transport n'étaient pas conservés comme erreur fatale. Un canal qui se fermait après l'ACK et la disponibilité CDC pouvait donc être interprété à tort comme une preuve d'absence de fuite : aucun événement n'arrivait simplement parce que le canal n'était plus vivant. En outre, l'ACK du témoin vérifiait la table `msg_messages`, mais pas le filtre exact `conversation_id=eq.<id>`.

Correctif sur la branche PR #17 :
- L'ACK `phx_reply` du témoin doit confirmer simultanément `public.msg_messages` et le filtre exact de conversation demandé.
- Les événements `phx_error` / `phx_close` et les erreurs WebSocket reçus après CDC-ready sont mémorisés comme erreurs terminales.
- Avant de conclure que le témoin n'a reçu aucun événement privé, le test vérifie que le canal n'a signalé aucune erreur et que le WebSocket est toujours ouvert. Le silence n'est donc accepté que si le canal témoin est encore vivant.
- Le contrôle est limité au harnais d'intégration local; aucun changement dans `msg.js`, aucune migration ni modification de la configuration Supabase hébergée.

Fichier modifié : `ci/msg-supabase-local-test.mjs` (commit `247a1babf7c9808a7782226c99e29ed64a374b92`).

Rectification de l'audit : le chemin `msg_invites` traitait déjà explicitement le `phx_reply` négatif. Aucune modification n'a été faite sur ce point.

Validation : contrôle de cohérence par relecture des blocs modifiés et de leurs appels. Le test Node/Supabase local n'a pas été exécuté dans cette session; aucune réussite dynamique n'est revendiquée. Les runners GitHub Actions restent soumis au blocage de démarrage lié à la facturation précédemment observé. Aucun accès ni changement sur Supabase hébergé, aucune modification Auth/RLS/Realtime/Storage en production, aucun déploiement Cloudflare et aucune fusion. PR #17 reste ouverte et non fusionnée.


## Lot 542 — borner les attentes UPDATE et propager les fermetures WebSocket

Audit du cycle de vie de `subscribeToMessageChanges()` dans `ci/msg-supabase-local-test.mjs`.

Défaut confirmé : `waitForUpdate()` créait une promesse sans délai maximal et ajoutait un simple callback dans `updateWaiters`. Si le canal Realtime se fermait ou si le transport échouait après CDC-ready, le code rejetait l'attente du premier événement mais ne rejetait pas les attentes UPDATE déjà en attente. Le scénario pouvait donc rester suspendu indéfiniment au lieu de produire un échec exploitable.

Correctif sur PR #17 :
- Chaque attente UPDATE dispose maintenant d'un délai maximal de 12 secondes et retire son propre waiter à expiration.
- Les événements `phx_error`, `phx_close`, la fermeture WebSocket inattendue et l'erreur de transport propagent une erreur aux attentes UPDATE actives.
- Les erreurs CDC tardives et les erreurs de décodage de trame après CDC-ready passent par le même chemin d'échec.
- L'arrivée d'un INSERT annule le délai de surveillance de cet INSERT; les délais des UPDATE sont gérés indépendamment.
- La fermeture volontaire du socket par le test est distinguée d'une fermeture inattendue afin de ne pas créer de faux échec pendant le nettoyage.
- Les sockets des observateurs destinataire et témoin restent fermés dans le bloc `finally` déjà présent.

Fichier modifié : `ci/msg-supabase-local-test.mjs` (commits `47e113f8` et `b845a263`).

Validation : relecture du cycle d'attente, des chemins d'erreur, du timeout et du nettoyage. Aucun test Node/Supabase dynamique n'a été exécuté dans cette session; les Actions ne démarrent toujours pas de runner en raison de la restriction de facturation documentée. Aucun compte réel, aucune modification de Supabase hébergé (schéma, données, Auth, RLS, Realtime ou Storage), aucun déploiement Cloudflare et aucune fusion. PR #17 reste ouverte et non fusionnée.


## Lot 543 — associer chaque UPDATE Realtime au bon message et à la bonne modification

Audit du mécanisme d'attente UPDATE dans `ci/msg-supabase-local-test.mjs`.

Défaut confirmé : le dispatcher retirait systématiquement le premier waiter de `updateWaiters`, sans comparer l'identifiant de ligne ni le contenu de l'événement. La file `queuedUpdates` était également consommée en FIFO sans filtre. Un UPDATE retardé ou relatif à une autre ligne de la même conversation pouvait donc satisfaire une attente qui concernait une édition ou une suppression logique différente.

Correctif sur PR #17 :

- `waitForUpdate()` exige désormais l'identifiant du message attendu et accepte un prédicat portant sur les champs du record, ainsi qu'un libellé de diagnostic.
- Le dispatcher recherche le premier waiter dont l'identifiant et le prédicat correspondent à l'événement reçu; les autres attentes restent en place.
- Les événements arrivés avant l'installation d'un waiter sont recherchés dans la file par le même critère, au lieu d'être consommés aveuglément. La file est bornée à 50 événements pour éviter une croissance non limitée du harnais.
- Le test d'édition attend explicitement le bon `message_id` et le nouveau corps; il vérifie également l'identifiant du record reçu.
- Le test de suppression logique attend le bon identifiant et la valeur exacte de `deleted_at`, puis vérifie ces deux éléments dans l'événement.
- Les timeouts de 12 secondes et la propagation d'erreurs/fermetures introduits au Lot 542 sont conservés.

Fichier modifié : `ci/msg-supabase-local-test.mjs` (commit `80c1d57c4973d0cf8a9b595d6515abee86ee799d`).

Validation : relecture du dispatcher, des prédicats, des attentes d'édition et de suppression et des assertions de correspondance. Aucun test Node/Supabase dynamique n'a été exécuté; le blocage des runners GitHub Actions avant démarrage demeure. Aucun accès ni changement sur Supabase hébergé, aucune modification de schéma, données, Auth, RLS, Realtime ou Storage en production, aucun déploiement Cloudflare et aucune fusion. PR #17 reste ouverte et non fusionnée.
