

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
