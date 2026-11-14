# Lot 287 — spécification technique des rapports périodiques

**Date :** 11 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Statut :** conception documentaire uniquement — aucune activation

## 1. Décision d'architecture
La maquette ne peut pas être intégrée telle quelle : ses statistiques, son historique et ses confirmations d'envoi sont fictifs. La fonctionnalité réelle doit être construite en étapes indépendantes, avec une source de données vérifiable et sans afficher de réussite fictive.
Le rapport est destiné au titulaire du compte connecté. Le destinataire ne doit pas être librement fourni par le navigateur : le serveur devra récupérer l'adresse auprès de Supabase Auth et vérifier qu'elle est confirmée. Aucun rapport ne doit être envoyé à une adresse arbitraire.

## 2. Contrats fonctionnels
### Préférences
- Fréquence : désactivée, quotidienne, hebdomadaire ou mensuelle.
- Jour de semaine pour la fréquence hebdomadaire ; jour du mois pour la fréquence mensuelle, avec règle explicite pour les mois plus courts.
- Heure locale et fuseau IANA explicite ; langue arabe, français ou anglais ; catégories activables individuellement.
- Valeurs initiales : rapports désactivés, aucune date programmée. L'enregistrement d'une préférence ne déclenche jamais un e-mail.

### Contenu du rapport
Le rapport ne contient que des événements réellement collectés et attribuables au compte : période couverte, date de génération, accès authentifié observé côté serveur et événements de sécurité dont la signification est documentée. Les appareils ou navigateurs ne sont inclus que si une collecte minimale, justifiée et autorisée est conçue séparément.
Ne pas afficher de taux d'ouverture, de nombre total de rapports, d'alertes, de sessions ou de connexions sans données persistantes qui les justifient. Une observation d'accès ne prouve ni l'identité humaine, ni une présence continue, ni une déconnexion.

### Historique
Chaque tentative possède un état distinct : queued, sending, sent, failed ou cancelled, avec horodatages, période, langue, identifiant fournisseur éventuel et erreur expurgée. sent signifie que le fournisseur a accepté le message, pas qu'il a été livré, ouvert ou lu.

## 3. Modèle de données à examiner avant toute migration
Quatre ensembles logiques sont proposés :
1. Préférences : une ligne par utilisateur, fréquence, fuseau, heure, langue, catégories et activation.
2. Événements : utilisateur, type autorisé, horodatage serveur, source et métadonnées minimales.
3. Exécutions : utilisateur, période, instantané agrégé, état et clé d'idempotence.
4. Livraisons : exécution, destinataire résolu côté serveur, fournisseur, identifiant fournisseur, état et erreur expurgée.

Règles proposées : user_id est dérivé de l'identité authentifiée côté serveur ; RLS est activée sur les tables exposées ; l'utilisateur ne lit/modifie que ses préférences et ne lit que son historique ; événements, exécutions et livraisons sont écrits côté serveur ; aucune clé privilégiée dans le client ; suppression cohérente à la suppression du compte ; rétention et purge définies avant activation. Ceci est une proposition, pas un schéma SQL approuvé.

## 4. Source des événements : limite déterminante
Les journaux d'audit Auth de l'administration Supabase ne sont pas automatiquement lisibles par l'application. Le hook de jeton examiné précédemment intervient avant l'émission du jeton : il ne prouve ni sa réception par le navigateur ni l'ouverture effective de l'application.
Pour un indicateur fiable d'utilisation, la solution à évaluer est un point d'observation serveur après authentification : le navigateur présente son jeton ; le serveur le valide auprès de Supabase Auth (/auth/v1/user) ; l'identifiant utilisateur est dérivé de la réponse validée ; le serveur enregistre app_access_observed avec l'heure serveur. L'échec de journalisation doit être visible dans l'exploitation.
Cet événement ne doit pas être nommé login_success : il indique seulement qu'un accès authentifié à l'application a été observé. Il ne couvre pas les tentatives échouées et ne permet pas de reconstruire l'historique antérieur. Le point d'intégration, la limitation de débit, la déduplication et le comportement en cas d'indisponibilité restent à concevoir et tester.

## 5. Génération et envoi
Le générateur doit être déterministe et testable sans réseau. Les dates sont calculées dans le fuseau de la préférence, stockées en UTC et affichées dans le fuseau choisi.
L'endpoint devra authentifier la requête et dériver l'utilisateur du jeton vérifié ; pour les tâches planifiées, n'accepter que des appels internes authentifiés ; résoudre lui-même l'adresse confirmée ; vérifier l'activation et l'échéance ; utiliser une clé d'idempotence par utilisateur/période/type ; limiter le débit et empêcher les doublons concurrents ; enregistrer les états avant/après fournisseur ; ne jamais exposer le secret au navigateur ; déclarer sent uniquement après réponse positive ; expurger les erreurs et ne jamais journaliser jetons ou secrets.
L'endpoint de bienvenue existant n'est pas réutilisable en l'état : il accepte le destinataire dans le corps et ne démontre pas les contrôles requis pour des rapports privés.

## 6. Planification
La planification n'est ajoutée qu'après validation des préférences, de la source, du générateur et de l'endpoint. Le calcul doit être idempotent et tolérer les déclenchements répétés, retards, changements de fuseau et mois plus courts.
Le Worker principal actuel ne comporte pas de handler scheduled() et sa configuration ne déclare aucun Cron. Leur ajout constitue une modification distincte ; aucun Cron ne doit être configuré ou déployé dans ce lot.

## 7. Tests de sortie obligatoires
- RLS : lecture/modification croisée entre deux utilisateurs impossible.
- Identité : utilisateur et destinataire du corps ignorés au profit de l'identité validée.
- Destinataire absent ou non confirmé : aucun envoi.
- Appels anonymes et appels internes non authentifiés : refusés.
- Idempotence : deux déclenchements concurrents ne créent qu'une livraison.
- Fréquences quotidiennes/hebdomadaires/mensuelles, fuseaux, changements d'heure et fin de mois.
- Aucun jeton, secret, adresse d'un autre compte ou détail sensible dans les journaux.
- Pannes DB/fournisseur : reprise contrôlée et état exact.
- Rendu arabe RTL, français et anglais, mobile et desktop.
- Aucun faux succès ni taux d'ouverture sans mesure réelle.
Les tests sont exécutés sur données synthétiques dans un environnement isolé avant toute opération distante.

## 8. Dépendances et blocages
- La collecte historique n'existe pas : aucun rapport rétroactif ne peut être promis.
- L'envoi Auth et l'envoi applicatif sont deux circuits distincts.
- Le domaine expéditeur et la capacité réelle du fournisseur doivent être vérifiés avant activation. Tant que ce point n'est pas validé, la fonctionnalité reste en aperçu local sans envoi.
- Aucun environnement payant, domaine, service ou option payante ne doit être créé ou acheté sans autorisation explicite.
- Aucun changement Supabase distant, secret, configuration Auth, Worker, Cron ou déploiement n'est autorisé par cette spécification.

## 9. Découpage d'implémentation proposé
| Lot | Livrable | Condition de sortie |
|---|---|---|
| 287 | Spécification présente | Revue documentaire terminée |
| 288 | Contrat de données et politiques proposées | Revue de sécurité, sans application distante |
| 289 | Collecteur d'accès authentifié en test | Identité, déduplication et confidentialité validées |
| 290 | Générateur et aperçus trilingues | Tests déterministes, aucune donnée fictive |
| 291 | Politique de rétention, purge et suppression | Durées approuvées et tests de purge spécifiés |
| 292 | Endpoint d'envoi sécurisé | Tests négatifs, idempotence et destinataire confirmé |
| 293 | Planification et historique | Tests de calendrier, reprise et rétention |
| 294 | Activation éventuelle | Autorisation distincte, fournisseur validé et contrôles de sécurité passés |

**État à la clôture du Lot 287 :** spécification seulement. Aucun écran, SQL, table, fonction, politique RLS, secret, endpoint, e-mail, Cron ou déploiement n'a été créé ou activé.