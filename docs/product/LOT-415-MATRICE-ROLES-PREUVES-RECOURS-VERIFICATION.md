# Lot 415 — matrice des rôles, preuves et recours de vérification scolaire

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : spécification produit et sécurité — documentation uniquement

## 1. Décisions de référence

1. `ملتقى الطلاب` reste accessible gratuitement à tout compte élève actif inscrit sur la plateforme, qu'il soit vérifié ou non. L'accès aux contenus et interactions reste soumis aux règles de modération, anti-spam, blocage et autorisations serveur.
2. `الرسائل` : la vérification scolaire est un prérequis à l'envoi d'une demande de contact privée ; le destinataire doit ensuite accepter explicitement avant toute création de conversation directe.
3. L'abonnement, le paiement et le numéro d'abonnement ne constituent jamais une preuve d'identité scolaire.
4. La vérification est gratuite. Le numéro d'inscription scolaire, s'il est nécessaire et légalement utilisable, reste confidentiel et ne doit jamais être un identifiant public.
5. Un compte non vérifié conserve l'accès au forum. Il ne peut pas initier de contact privé tant que la vérification n'est pas validée.
6. Aucun écran client, champ modifiable du profil ou rôle local stocké dans le navigateur ne constitue une preuve d'autorisation.

## 2. Matrice des rôles proposés

| Rôle | Périmètre autorisé | Actions permises | Interdictions |
|---|---|---|---|
| Élève demandeur | Son propre dossier uniquement | Soumettre, consulter l'état, compléter une demande, faire appel | Approuver sa demande, consulter les dossiers d'autres élèves, modifier son état vérifié |
| Vérificateur d'établissement | Un ou plusieurs établissements explicitement affectés | Examiner les demandes des établissements affectés, demander un complément, recommander une décision | Rechercher des élèves hors périmètre, approuver un autre établissement, exporter un registre national |
| Vérificateur de wilaya | Établissements d'une wilaya explicitement attribuée | Traiter les dossiers sans vérificateur local, contrôler les décisions locales selon délégation, gérer les escalades prévues | Étendre son périmètre à une autre wilaya, consulter des données sans motif de dossier |
| Superviseur central | Paramétrage des habilitations et supervision nationale | Nommer/révoquer des vérificateurs, définir les référentiels, examiner les recours de second niveau, auditer les journaux | Parcourir librement les pièces privées ou modifier silencieusement une décision |
| Modérateur du forum | Contenus sociaux selon règles de modération | Traiter signalements, masquer contenus, appliquer sanctions proportionnées | Accéder aux preuves d'identité ou valider une affiliation scolaire |
| Administrateur technique | Exploitation technique strictement nécessaire | Gérer disponibilité et sécurité du service selon procédure contrôlée | S'attribuer une validation scolaire ou consulter les pièces par simple privilège technique |

Ces rôles sont des propositions. Ils ne sont pas réputés exister dans Supabase ou dans l'application actuelle. Leur attribution doit reposer sur une habilitation formelle, une portée explicite et une révocation traçable.

## 3. Portée et attribution des habilitations

- Chaque vérificateur est associé à un identifiant interne, un rôle, un périmètre (établissement ou wilaya), une date de début, une date d'expiration et un état actif/révoqué.
- Le périmètre est déterminé par un référentiel d'établissements validé côté serveur ; il ne doit pas être déduit d'un champ `wilaya` librement modifiable par le demandeur.
- Un vérificateur d'établissement ne traite que les dossiers de son établissement.
- Un vérificateur de wilaya ne traite que les établissements explicitement rattachés à sa wilaya.
- Le superviseur central attribue et révoque les habilitations ; il ne peut pas s'auto-attribuer un rôle sans journalisation et contrôle indépendant.
- L'auteur d'une première décision ne traite pas l'appel de cette même décision.
- Les comptes suspendus, expirés ou révoqués perdent immédiatement leurs capacités de vérification.
- Toute action sensible est contrôlée côté serveur à chaque requête ; masquer un bouton dans l'interface ne suffit pas.

## 4. Preuves acceptables — ordre de préférence

### Niveau A — source institutionnelle autorisée (préféré)

Confirmation par un registre officiel ou un référent institutionnel autorisé, consulté selon une procédure documentée. La réponse conservée doit être minimale : correspondance oui/non, établissement, période scolaire et référence de vérification non réversible ou identifiant de dossier.

### Niveau B — confirmation directe par l'établissement

Un responsable habilité confirme l'inscription à partir de ses propres registres. La plateforme conserve le résultat, le rôle du vérificateur, l'établissement concerné, la date et un motif normalisé ; elle ne copie pas le registre de l'établissement.

### Niveau C — justificatif fourni par l'élève (solution de dernier recours)

À n'envisager qu'après définition d'un canal sécurisé dédié, d'une base juridique, d'une durée de conservation courte, d'une procédure de suppression et d'un contrôle d'accès strict. Aucun envoi de document par Messenger, forum, commentaire ou stockage public. Aucun document d'identité ou photo de carte scolaire ne doit être demandé par défaut.

### Éléments insuffisants

- Numéro d'abonnement ou preuve de paiement.
- Adresse e-mail seule, nom affiché, photo de profil ou déclaration libre.
- Appartenance déclarée à une classe ou à un groupe social.
- Capture d'écran non vérifiable ou validation par un autre élève.
- Valeur `wilaya`, `school` ou `section` auto-déclarée sans rapprochement fiable.

## 5. Données minimales et confidentialité

- Ne jamais exposer le numéro d'inscription, les justificatifs, les notes internes ou les coordonnées privées dans les profils, l'annuaire ou les API publiques.
- Ne pas réutiliser le bucket Messenger `prive` pour les justificatifs d'identité : sa finalité actuelle est différente et l'absence d'analyse antivirus dédiée a déjà été relevée.
- Préférer une vérification par confirmation institutionnelle sans transfert de document.
- Séparer les données de compte, d'affiliation vérifiée et d'abonnement.
- Le journal de décision conserve : identifiant interne du dossier, acteur, rôle et périmètre au moment de l'action, horodatage, décision, code de motif et référence de source minimale. Ne pas dupliquer le numéro scolaire ou le document.
- Les journaux ne doivent pas contenir de pièce jointe ni de texte libre inutile. Les notes internes doivent être limitées, non visibles par les autres élèves et soumises à une politique de conservation.
- Les demandes expirées, pièces éventuelles et journaux doivent avoir des durées de conservation définies avant mise en production.

## 6. Parcours de décision

1. L'élève soumet gratuitement une demande avec les informations strictement nécessaires : établissement, wilaya, niveau et filière ; le numéro scolaire est facultatif tant qu'une source fiable ne le rend pas indispensable.
2. Le serveur crée un dossier en attente et choisit le vérificateur habilité selon le référentiel institutionnel.
3. Le vérificateur consulte la source autorisée et choisit : confirmer, demander un complément ou refuser avec un code de motif.
4. Toute demande de complément indique les informations manquantes sans révéler de données internes.
5. Une décision positive active uniquement l'état d'affiliation vérifiée. Elle ne crée aucun contact, invitation ou conversation.
6. L'élève peut demander un recours. Le recours est traité par un autre vérificateur de niveau égal ou supérieur, jamais par l'auteur de la décision contestée.
7. En cas d'absence de source fiable ou de vérificateur habilité, le dossier reste en attente ; le forum reste accessible et la messagerie privée demeure verrouillée.

## 7. Recours et qualité de décision

- Délai cible de réponse à définir avec les établissements ; ne pas promettre de délai avant validation opérationnelle.
- Le refus comporte un code de motif compréhensible et une voie de recours.
- L'appel est examiné par une personne différente, avec accès limité aux seules données nécessaires.
- Les décisions incohérentes, répétées ou suspectes peuvent être escaladées au superviseur central.
- Un mécanisme de correction permet de rectifier une erreur sans effacer l'historique d'audit.
- La révocation d'une vérification doit être motivée, notifiée et contestable ; elle ne doit pas supprimer l'accès gratuit au forum.

## 8. Matrice de tests bloquants avant toute activation

| Scénario | Résultat attendu |
|---|---|
| Élève actif non vérifié | Accès au forum ; aucune demande DM sortante |
| Élève vérifié, sans abonnement | Forum et demande de contact autorisés selon consentement |
| Élève abonné, non vérifié | Aucun contournement de la vérification DM |
| Destinataire refuse la demande | Aucune conversation directe créée |
| Un utilisateur bloque l'autre | Demande et DM refusés dans les deux sens |
| Vérificateur d'un établissement consulte un autre établissement | Refus serveur |
| Vérificateur de wilaya consulte une autre wilaya | Refus serveur |
| Vérificateur révoqué ou expiré | Toute action de décision refusée |
| Élève tente d'approuver son propre dossier | Refus serveur |
| Auteur de décision traite son propre recours | Refus serveur |
| Élève modifie son champ wilaya côté client | Aucun élargissement de portée |
| Compte suspendu | Accès social et actions de vérification selon politique de suspension |
| Demande en attente ou sans source fiable | Pas de badge vérifié ni de DM ; forum accessible |
| Deux vérificateurs traitent simultanément le même dossier | Une seule transition cohérente, journalisée |
| Appel accepté | Historique initial conservé et correction auditée |

## 9. Conditions préalables au développement

Aucun développement backend ne commence avant que les points suivants soient réunis :

1. Source officielle de vérité et procédure d'accès confirmées par écrit.
2. Responsables et délégations d'établissement/wilaya/central identifiés.
3. Politique de données, conservation, suppression et recours validée.
4. Environnement PostgreSQL de test isolé et reproductible disponible sans coût supplémentaire.
5. Baseline réelle des grants, policies RLS, fonctions et triggers récupérée sans exposer de données personnelles.
6. Tests multi-comptes synthétiques positifs et négatifs exécutés sur cet environnement.
7. Contrat serveur garantissant que vérification, consentement, blocage et révocation sont appliqués sur tous les points d'entrée.

Le prototype Lot 414 reste une maquette locale non connectée. Le mécanisme client actuel `msgRequestVerification(subscriptionNumber, section)` exige encore un abonnement actif : ce comportement est un écart connu, non corrigé par les Lots 414–415.

## 10. Périmètre exécuté dans ce lot

- Documentation produit/sécurité uniquement.
- Aucun changement de code applicatif, SQL, DDL/DML, migration, Auth, RLS, GRANT, Storage, Realtime, paiement ou données élèves.
- Aucun accès à la base Supabase active.
- Aucun déploiement Cloudflare, aucune modification de `main`, aucune synchronisation/rebase et aucune fusion de PR #17.

## Suite proposée — Lot 416

Faire un inventaire statique des écrans et fonctions de vérification déjà présents, comparer leurs champs et états au contrat des Lots 414–415, puis préparer un plan de remplacement du numéro d'abonnement par un flux scolaire gratuit. Toujours sans modifier le backend ni la base active.
