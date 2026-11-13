

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
