# LOT 339 — Compatibilité des groupes et des conversations historiques Messenger

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : décision de compatibilité basée sur un comptage agrégé en lecture seule du schéma actif. Aucun contenu de message ni donnée nominative consultés.

## 1. Vérification de l'état vivant

Sur le projet Supabase `azjwcybivirvpxbfhyzk`, requêtes agrégées uniquement :

| Objet | Nombre constaté |
|---|---:|
| Conversations au total | 1 |
| Conversations directes | 0 |
| Groupes | 1 |
| Adhésions (`msg_members`) | 0 |
| Messages | 0 |
| Pièces jointes | 0 |
| Signalements | 0 |
| Blocages | 0 |

Le groupe présent n'a aucune adhésion. Aucun DM historique n'est actuellement enregistré dans les tables vivantes interrogées. Ce constat est un instantané du projet actif ; il ne prouve pas l'absence de données dans des exports, sauvegardes ou environnements distincts.

## 2. Conséquence produit

- Le nouveau Messenger ne doit pas annoncer qu'il migre ou préserve des conversations privées actives qui ne sont pas présentes dans le schéma vivant observé.
- Le groupe isolé doit rester intact pendant la préparation ; son absence d'adhésion signifie qu'il n'est pas démontré comme groupe utilisé par des élèves.
- Aucun utilisateur ne doit être ajouté automatiquement au groupe existant sur la base de wilaya/niveau/filière.
- Les groupes officiels à venir doivent être attribués par une politique institutionnelle distincte, liée à une affiliation vérifiée ; le profil déclaratif ne suffit pas.
- Si un dump ou une sauvegarde antérieure révèle des DMs, les règles de conservation du Lot 337 s'appliquent : garder les conversations et messages, ne pas fabriquer d'invitations acceptées rétroactivement, inventorier les cardinalités 0/1/2/>2 membres avant toute contrainte.

## 3. Modèle de compatibilité recommandé

### 3.1 Trois catégories explicites

1. **Groupe historique non certifié** : ligne de conversation déjà présente, conservée en lecture/inventaire ; aucun élargissement automatique des droits. Son accès reste fermé tant qu'une règle de transition sûre n'a pas été définie.
2. **Groupe officiel certifié** : groupe dont la portée (établissement, classe, niveau/filière, wilaya ou national) est définie par une politique produit et dont l'accès est vérifié côté serveur à partir d'une affiliation active et d'une source approuvée.
3. **Groupe communautaire volontaire** : groupe créé par un organisateur habilité, avec adhésion explicite et modération ; il ne doit pas se présenter comme classe officielle ni exposer les listes d'élèves sans consentement.

Le type technique `groupe` ne suffit pas à distinguer ces catégories. La future conception devra ajouter une classification explicite et une provenance de création, sans réinterpréter automatiquement les lignes existantes.

### 3.2 Contrat d'accès

Pour chaque ouverture/lecture d'un groupe certifié, le serveur doit :
- identifier le demandeur depuis `auth.uid()` ;
- vérifier l'affiliation active, l'année scolaire, l'établissement et la portée du groupe ;
- contrôler que la source institutionnelle de l'affiliation est approuvée et non révoquée ;
- vérifier les restrictions/suspensions et la politique de blocage applicable ;
- renvoyer uniquement les groupes auxquels le compte a droit, avec pagination serveur.

L'adhésion implicite fondée sur l'égalité de trois champs de profil doit cesser d'être le contrôle final des groupes scolaires.

### 3.3 Transfert d'établissement

- Une affiliation transférée/expirée ne donne plus accès aux groupes de l'ancien établissement après application de la date d'effet.
- L'historique des messages et les obligations de conservation sont traités séparément des droits d'accès futurs.
- L'arrivée dans un nouvel établissement n'ajoute pas automatiquement à tous les groupes ; les groupes de classe doivent être attribués par une source officielle ou un responsable autorisé.
- Les groupes nationaux transversaux doivent avoir une règle d'éligibilité explicitement documentée, sans dépendre d'une égalité de wilaya.

## 4. DMs historiques

L'instantané actif indique zéro DM et zéro message. Malgré cela, le protocole de migration doit couvrir les sauvegardes ou imports futurs :

- 0 membre : conversation orpheline, à mettre en quarantaine/inventaire, jamais à attribuer automatiquement.
- 1 membre : conversation incomplète ; ne pas inventer le second participant.
- 2 membres : conserver la paire et les messages ; autoriser la réouverture par les deux membres selon la politique transitoire ; ne pas fabriquer une invitation historique.
- Plus de 2 membres : cas non conforme à un DM strict ; classer pour examen avant conversion, sans supprimer ni tronquer les participants.

La future fonction `msg_direct_open_existing` doit retrouver un DM exact partagé, sans scanner une fenêtre arbitraire de 500 adhésions côté navigateur.

## 5. Migration en étapes (non exécutée)

1. Obtenir un export contrôlé/versionné de la base active et, si disponibles, les sauvegardes utiles ; conserver un hash et la date du snapshot.
2. Classer toutes les conversations par type et cardinalité des membres, sans lire les contenus privés pour le simple inventaire.
3. Identifier l'origine et la portée du groupe isolé ; ne pas lui ajouter de membres et ne pas le supprimer automatiquement.
4. Définir les règles d'affiliation officielle et la classification des groupes avant d'écrire les nouvelles politiques.
5. Implémenter les RPC serveur d'accès et d'attribution, fermer les chemins d'auto-adhésion non autorisés, puis tester en PostgreSQL jetable avec comptes et rôles distincts.
6. Migrer le client après validation : liste paginée des groupes accessibles, recherche nationale indépendante, invitations DM et ouverture des DMs historiques.
7. Faire une validation multi-compte et une vérification de non-régression des fichiers, du temps réel, des signalements et des historiques avant toute activation.

## 6. Tests requis

- Élève avec affiliation active à l'établissement A : voit uniquement les groupes autorisés de A.
- Élève sans affiliation ou avec simple profil `verif_statut='verifie'` : n'accède pas aux groupes certifiés par ce seul statut.
- Affiliation expirée/révoquée/source révoquée : accès retiré selon la date d'effet.
- Transfert A vers B : accès A retiré, accès B seulement après validation officielle et attribution correcte.
- Groupe national : élèves de wilayas différentes éligibles selon règle explicite.
- Groupe communautaire : invitation/adhésion explicite, sans fausse étiquette de groupe scolaire.
- Groupe historique vide : conservé sans adhésion implicite.
- DMs historiques 0/1/2/>2 membres : aucun participant inventé, aucun message supprimé.
- Courses concurrentes d'attribution/révocation : résultat transactionnel cohérent.
- RLS et RPC : accès refusé même si le client appelle directement l'API PostgREST.

## 7. Décision et limites

Le comptage agrégé du schéma actif montre une seule conversation de type groupe, zéro adhésion et aucune conversation directe ni message/pièce jointe/signalement/blocage. Il n'y a donc pas de DM actif à migrer dans cet instantané, mais le protocole de compatibilité reste nécessaire pour les sauvegardes, imports ou environnements non inspectés.

Aucune écriture SQL, DDL, migration, changement Auth/RLS/GRANT/Storage, modification du client, branche Supabase, déploiement Cloudflare, changement `main) ou merge PR #17. Aucun contenu de message n'a été lu. Pas de MFA/2FA ni facturation.

**Décision :** ne pas convertir le groupe isolé ni activer les groupes scolaires nationaux avant la disponibilité du registre d'affiliation et des contrôles serveur testés. Le Messenger national reste en NO-GO d'activation.
