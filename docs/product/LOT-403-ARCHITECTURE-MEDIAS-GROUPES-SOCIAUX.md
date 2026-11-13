# Lot 403 — architecture des médias et groupes sociaux de ملتقى الطلاب

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : conception technique et règles produit ; aucune implémentation ni migration.

## 1. Objectif et séparation des domaines

Définir les règles de stockage, de visibilité, d'adhésion et de modération pour le réseau social scolaire `ملتقى الطلاب`, sans réutiliser implicitement les règles du Messenger.

Trois domaines doivent rester distincts :
- **Réseau social** : publications, commentaires, réactions, albums, groupes sociaux et médias associés.
- **Messenger** : conversations privées et groupes de discussion existants, régis par les contrats Messenger des lots 400–402.
- **Identité scolaire** : statut de vérification et affiliation institutionnelle, sans exposer publiquement matricule ou données administratives.

Un lien vers Messenger peut être proposé depuis un profil ou une publication, mais il doit déclencher le flux de consentement Messenger approuvé. L'amitié/la relation `زملائي`, l'adhésion à un groupe social et le consentement à une conversation privée sont trois autorisations indépendantes.

## 2. Modèle de visibilité des publications

Valeurs fonctionnelles proposées :
- `public` : visible par tous les visiteurs autorisés de la plateforme, y compris sans relation scolaire ; ne pas activer tant que la politique de modération et les risques d'exposition des mineurs ne sont pas validés.
- `school` : visible par les comptes dont l'affiliation vérifiée correspond au lycée/établissement explicitement ciblé.
- `wilaya` : visible aux comptes vérifiés de la wilaya sélectionnée.
- `class` : visible au groupe scolaire précis (niveau, filière et établissement) sélectionné.
- `connections` : visible aux relations sociales acceptées, sous réserve du blocage.
- `private` : auteur uniquement.

Règles :
1. Chaque publication possède une audience explicite ; aucune audience implicite « tout le monde ».
2. L'audience est fixée à la création. Toute extension ultérieure doit être une action explicite de l'auteur.
3. Les contrôles sont appliqués côté serveur à chaque lecture, recherche, aperçu, notification et URL média. Masquer un post côté navigateur n'est pas une protection.
4. Les réponses, réactions, compteurs et résultats de recherche ne doivent pas divulguer l'existence d'une publication inaccessible.
5. Le blocage bilatéral doit masquer les interactions sociales dans les deux sens, sans effacer les éléments nécessaires à la modération.
6. Les changements d'établissement, de wilaya ou de niveau déclenchent une réévaluation d'accès ; pas de conservation automatique d'un accès devenu invalide.

## 3. Groupes sociaux

Types fonctionnels proposés :
- `subject` : matière ou langue (ex. allemand, anglais).
- `level` : niveau scolaire.
- `school` : établissement.
- `wilaya` : communauté territoriale.
- `project` : projet ou club scolaire encadré.

Chaque groupe définit :
- propriétaire, administrateurs et modérateurs ;
- visibilité `discoverable` ou `unlisted` ;
- adhésion `open`, `approval` ou `invite_only` ;
- règles et description ;
- capacité maximale, à fixer avant lancement ;
- état `active`, `restricted`, `archived`.

L'accès au contenu dépend d'une adhésion explicite active, et non d'une simple égalité de wilaya/niveau/filière. Pour les groupes institutionnels ciblant un lycée, l'affiliation officielle doit être vérifiée côté serveur. Les administrateurs ne peuvent pas contourner les règles de blocage ou de protection des mineurs.

Cycle d'adhésion : découverte → demande/invitation → approbation ou acceptation → adhésion active → suspension/expulsion/départ. Les changements de rôle et expulsions doivent être journalisés. Une invitation ne doit pas ajouter silencieusement le destinataire sans consentement lorsque le modèle choisi exige une acceptation.

## 4. Architecture médias — principe de séparation

Ne pas stocker les médias sociaux dans le bucket Messenger `prive`. Ne pas modifier ce bucket dans ce lot.

Créer, après validation et tests, un espace de stockage distinct pour les médias sociaux, privé par défaut. L'accès aux médias doit passer par une décision serveur basée sur la visibilité du post et l'état de l'utilisateur. Ne pas utiliser d'URL publique permanente pour un contenu restreint.

Modèle de cycle de vie proposé :
1. Création d'une intention d'upload autorisée par serveur.
2. Vérification de l'identité, de l'audience cible et des quotas.
3. Upload dans une zone de quarantaine non lisible par les autres utilisateurs.
4. Contrôle réel du type de fichier par signature/magic bytes, pas seulement par extension ou MIME déclaré.
5. Limites de taille et de dimensions ; quotas par utilisateur et par période.
6. Scan antimalware et modération des images/vidéos avant publication.
7. Transcodage vidéo et génération de miniatures dans un environnement contrôlé.
8. Passage à l'état `ready` uniquement après validation ; sinon `rejected` ou `quarantined`.
9. Délivrance d'un accès court et autorisé, vérifié à chaque consultation.
10. Suppression logique, puis purge des objets et dérivés selon une durée de conservation documentée.

États média : `pending_upload`, `quarantined`, `scanning`, `processing`, `ready`, `rejected`, `deleted`.

Formats candidats :
- Images : JPEG, PNG, WebP ; HEIC à arbitrer et convertir si nécessaire.
- Vidéos : MP4/H.264 en cible initiale ; autres codecs à décider après mesure de compatibilité et de coût.
- Documents : désactivés par défaut dans les publications publiques ; si activés, PDF uniquement au départ, avec scan et téléchargement contrôlé.

Les fichiers SVG, HTML, scripts, exécutables, archives et formats actifs sont refusés. Les limites précises (taille, durée, résolution, quota) doivent être décidées selon les capacités réelles de l'infrastructure gratuite disponible ; ne pas promettre une capacité avant test.

## 5. Albums et pièces jointes

- Un album hérite par défaut de l'audience la plus restrictive de ses médias.
- Chaque média appartient à un propriétaire et peut être retiré par son auteur, sous réserve des obligations de conservation liées à un signalement.
- Le partage d'un lien ne doit jamais élargir l'audience.
- Les miniatures et variantes transcodées héritent exactement des autorisations de l'original.
- Les pièces jointes ne sont pas des URL librement devinables ; les identifiants ne constituent pas une autorisation.
- Les suppressions de publication déclenchent le traitement des médias dérivés et des caches, selon les règles de conservation.

## 6. Modération et protection des élèves

Fonctions nécessaires avant lancement public :
- signaler une publication, un commentaire, un groupe ou un média ;
- bloquer et débloquer un compte, avec application bilatérale ;
- filtrage anti-spam, limitation des invitations, commentaires et uploads ;
- file de modération avec rôles dédiés et journal d'audit ;
- possibilité de masquer temporairement un contenu signalé, sans suppression irréversible automatique ;
- procédure d'appel et traçabilité des décisions ;
- règles spécifiques pour harcèlement, usurpation, divulgation d'informations personnelles et contenus dangereux.

La vérification scolaire ne doit jamais publier le matricule, les justificatifs, le numéro d'abonnement ni les coordonnées privées. La preuve d'affiliation doit rester accessible uniquement aux fonctions administratives habilitées.

## 7. Matrice de tests avant activation

1. Un post `private` n'est lisible que par son auteur.
2. Un post `connections` est visible uniquement par une relation acceptée autorisée.
3. Un compte bloqué ne peut ni lire ni interagir dans les deux sens selon la règle approuvée.
4. Un post `school` n'est visible qu'à l'établissement visé et aux comptes à affiliation vérifiée.
5. Un changement d'établissement révoque les accès qui ne sont plus valides.
6. Une audience restreinte ne fuit pas dans les résultats de recherche, notifications, compteurs ou aperçus.
7. Un groupe `approval` exige l'approbation avant l'accès au contenu.
8. Un groupe `invite_only` exige une invitation valide et une acceptation.
9. Un compte non membre ne peut pas lire les médias du groupe via une URL directe.
10. Une adhésion révoquée coupe immédiatement l'accès au contenu restreint.
11. Une relation sociale acceptée ne crée aucun DM.
12. Un lien Messenger déclenche uniquement le flux de consentement prévu.
13. Upload MIME falsifié ou extension trompeuse refusé.
14. Fichier trop volumineux ou quota dépassé refusé.
15. Fichier en quarantaine inaccessible aux autres comptes.
16. Fichier rejeté non publiable et non téléchargeable.
17. Les miniatures et transcodages appliquent les mêmes ACL que l'original.
18. Un lien partagé ne contourne pas l'audience.
19. Un signalement crée une entrée de modération et un audit.
20. Un modérateur ne peut accéder qu'aux éléments couverts par son rôle.
21. Un compte ne peut pas modifier le propriétaire ou l'audience d'un média pour contourner les contrôles.
22. Suppression du post et purge des dérivés suivent la politique de rétention.
23. Les courses entre révocation d'adhésion et lecture/upload ne laissent pas un accès résiduel.
24. Les erreurs de lecture ne révèlent pas l'existence de contenu privé.
25. Les limites et protections sont vérifiées côté serveur, jamais uniquement côté client.

## 8. Décisions à obtenir avant développement

- Le fil national est-il réservé aux élèves dont l'identité scolaire est vérifiée, ou certains contenus publics peuvent-ils être vus par les visiteurs ?
- Les publications publiques sont-elles autorisées pour les élèves mineurs, ou le lancement doit-il être limité à `school`, `wilaya`, `class` et `connections` ?
- Les vidéos sont-elles nécessaires au premier lancement, ou le MVP doit-il commencer par les images seulement ?
- Les groupes d'établissement nécessitent-ils un administrateur scolaire officiel, ou un enseignant/modérateur désigné ?
- Quelle durée de conservation appliquer aux médias supprimés et aux contenus signalés ?
- Quelle infrastructure gratuite est effectivement disponible pour scan et transcodage ? Aucune promesse d'antivirus ou de vidéo ne doit être faite sans service vérifié.

## 9. Décision et limites

**NO-GO pour l'implémentation en production à ce stade.** Le présent lot est une architecture cible. Il ne crée pas de bucket, table, fonction, policy ou écran et ne modifie pas la maquette existante.

Prérequis : environnement local/test gratuit et fidèle, décisions produit ci-dessus, revue de sécurité et validation des coûts/quotas réels avant tout traitement vidéo.

Aucun DDL/DML, migration, Auth, RLS, Storage, Realtime, déploiement Cloudflare ou fusion de PR effectué. Aucune donnée personnelle ou aucun média utilisateur consulté.
