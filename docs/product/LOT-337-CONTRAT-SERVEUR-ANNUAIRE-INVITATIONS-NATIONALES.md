# LOT 337 — Contrat serveur de l'annuaire national et des invitations Messenger

Date : 12 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Nature : conception contractuelle et préparation des tests. Aucun SQL exécutable ni changement du client ou de Supabase actif.

## 1. Décision d'architecture

Le Messenger national doit conserver les conversations existantes, les groupes officiels et le temps réel, tout en ajoutant une véritable découverte nationale des élèves et un consentement explicite avant chaque nouveau DM.

Les surfaces sont séparées :

1. **Annuaire national** : recherche de personnes ayant choisi d'être visibles, avec affiliation scolaire officielle active.
2. **Invitations** : demande de conversation envoyée à une personne précise, visible dans une boîte de réception.
3. **DM** : conversation privée créée uniquement après acceptation du destinataire.
4. **Groupes officiels** : parcours indépendant, gouverné par l'affiliation et les règles d'établissement/wilaya/niveau/filière.
5. **Profil privé et vérification** : données nominatives/administratives séparées de l'annuaire public.

Le client ne reçoit jamais les privilèges de décider qui est éligible. Toute décision est recalculée côté serveur au moment de la commande.

## 2. Modèle logique proposé

Ces objets sont des contrats logiques, pas des tables déjà présentes dans la base.

### 2.1 `msg_directory_preferences`

- `user_id` : PK/FK compte.
- `discoverable` : consentement explicite, false par défaut.
- `display_name` : nom public choisi ou pseudo contrôlé.
- `updated_at`.
- `updated_by` ou provenance de consentement si nécessaire.

L'opt-in est distinct du statut d'affiliation. Le désactiver doit immédiatement retirer le profil des recherches futures, sans effacer les conversations existantes.

### 2.2 `msg_invites`

- `id` : UUID opaque.
- `sender_id`, `recipient_id` : comptes distincts.
- `status` : pending / accepted / declined / cancelled / expired.
- `message_preview` : facultatif, texte court et soumis aux mêmes contrôles de sécurité.
- `created_at`, `expires_at`, `responded_at`.
- `conversation_id` : nullable, renseigné uniquement après acceptation.
- `idempotency_key` : clé de rejeu liée à l'expéditeur et à l'opération.
- `request_fingerprint` : empreinte des paramètres normalisés, pas un secret.
- `decision_reason_code` : code interne minimal, sans fuite d'informations privées.

Contraintes logiques requises :
- sender différent de recipient ;
- statut dans la liste autorisée ;
- clés d'idempotence uniques par acteur/opération ;
- au plus une invitation active équivalente par paire ordonnée selon la politique retenue ;
- une invitation acceptée référence une conversation directe contenant exactement les deux comptes ;
- `conversation_id` reste NULL pour declined/cancelled/expired.

La durée de validité doit être une constante serveur configurable et documentée ; le navigateur ne peut pas fixer `expires_at`.

### 2.3 Journal d'événements

Chaque transition importante produit un événement minimal : acteur, invitation, transition, date serveur, résultat et identifiant de corrélation. Pas de copie du matricule, de la section, de l'établissement privé ou du contenu intégral des messages dans le journal.

## 3. Contrat des opérations serveur

Noms de fonctions proposés ; ils n'existent pas encore dans la base.

| Opération | Acteur autorisé | Résultat |
|---|---|---|
| `msg_directory_search(query,cursor,limit)` | élève authentifié | page de profils opt-in et affiliés, projection minimale |
| `msg_directory_set_visibility(enabled,display_name)` | propriétaire | enregistre ou retire le consentement |
| `msg_invite_create(recipient_id,idempotency_key)` | expéditeur | crée ou retourne la même invitation pending |
| `msg_invite_inbox(cursor,limit)` | destinataire | invitations reçues, projection minimale |
| `msg_invite_outbox(cursor,limit)` | expéditeur | invitations envoyées, état et destinataire public |
| `msg_invite_respond(invite_id,decision,idempotency_key)` | destinataire seulement | accepte ou refuse |
| `msg_invite_cancel(invite_id,idempotency_key)` | expéditeur seulement | annule une demande pending |
| `msg_invite_expire_due()` | service restreint | expire les demandes arrivées à échéance |
| `msg_direct_open_existing(other_user_id)` | membre de la paire | retrouve uniquement un DM déjà partagé |
| `msg_member_labels(user_ids)` | membre des conversations concernées | labels minimaux pour l'interface de fil |

Aucune RPC accessible à authenticated ne doit créer un nouveau DM sans invitation acceptée. L'ancienne `msg_open_direct(uuid)` doit être remplacée ou rendue incapable de créer un nouveau DM avant toute ouverture publique du nouveau parcours.

## 4. Contrat de l'annuaire national

### Éligibilité à chaque recherche

Le serveur vérifie toutes les conditions suivantes :

- compte authentifié et non suspendu ;
- rôle étudiant autorisé pour cette fonctionnalité ;
- préférence `discoverable=true` ;
- affiliation institutionnelle vérifiée, non révoquée, non expirée et valide pour l'année scolaire courante ;
- source officielle de l'affiliation toujours approuvée ;
- aucune exclusion légale ou de sécurité applicable ;
- compte distinct du demandeur.

La seule présence de `profiles.verif_statut='verifie'`, d'un matricule ou d'une section déclarés ne suffit pas.

### Projection autorisée

- identifiant opaque nécessaire à l'action ;
- nom public choisi/pseudo ;
- niveau et filière uniquement si utiles à la recherche et approuvés ;
- wilaya ou établissement public uniquement si le titulaire a explicitement choisi de les afficher.

Exclusions impératives : matricule, section, date de naissance, email, téléphone, rôle interne, `verif_statut`, `verif_by`, `verif_at`, justificatifs, jetons, traces d'administration et historique des décisions.

### Anti-abus

- pagination serveur avec curseur opaque et stable ;
- taille de page plafonnée (proposition : 20 résultats, plafond dur 50) ;
- longueur minimale de recherche et normalisation serveur ;
- limitation de débit par compte et par fenêtre ;
- pas d'énumération par UUID ni de recherche vide renvoyant l'ensemble du pays ;
- journaliser les abus et bloquer les extractions massives ;
- aucun compteur global qui permettrait d'inférer l'existence de profils non visibles.

Le moteur de recherche peut chercher par pseudo public et critères choisis. Il ne doit pas accepter matricule ou identifiant administratif comme clé de découverte.

## 5. Cycle de vie d'une invitation

### Création

1. Authentifier l'expéditeur depuis `auth.uid()`.
2. Vérifier que le destinataire existe, est distinct, éligible et découvrable.
3. Vérifier l'affiliation active des deux comptes à l'instant de la création.
4. Vérifier les blocages dans les deux sens, restrictions et quotas anti-spam.
5. Vérifier s'il existe déjà un DM entre les deux comptes : si oui, retourner ce DM existant selon la politique de compatibilité, sans créer une fausse invitation.
6. Normaliser la paire, vérifier les doublons actifs et l'idempotence.
7. Insérer l'invitation pending et son événement d'audit dans la même transaction.

Réponse publique uniforme en cas de destinataire non éligible, absent, non découvrable ou bloquant : ne pas révéler la raison ni permettre l'énumération de comptes. Le client peut afficher « invitation impossible pour le moment ».

### Acceptation

Dans une seule transaction :
1. verrouiller l'invitation `FOR UPDATE` ;
2. vérifier `auth.uid() = recipient_id` ;
3. vérifier `status='pending'` et l'expiration serveur ;
4. revalider l'affiliation, la visibilité et l'état des deux comptes ;
5. revalider le blocage dans les deux sens ;
6. prendre le verrou transactionnel de paire, ordonné par UUID ;
7. retrouver un DM existant exact ou le créer ;
8. garantir exactement deux membres distincts ;
9. passer l'invitation à accepted et lier `conversation_id` ;
10. écrire l'événement d'audit ;
11. commit.

Si une condition échoue, aucune conversation ni adhésion partielle ne subsiste. Si un DM historique exact existe, la transaction ne doit pas le dupliquer ; la politique de compatibilité doit être appliquée explicitement.

### Refus, annulation, expiration

- Seul le destinataire peut refuser.
- Seul l'expéditeur peut annuler une invitation pending.
- L'expiration est calculée avec l'horloge de la base, pas celle du navigateur.
- Une invitation terminale ne peut pas redevenir pending.
- Une clé d'idempotence rejouée retourne le résultat déjà obtenu, sans répéter les effets.
- Le refus ne crée jamais de conversation.

## 6. Politique de blocage

Le comportement doit être symétrique pour la découverte et l'invitation :

- si A bloque B, A ne découvre plus B et B ne peut pas inviter A ;
- si B bloque A, A ne peut pas inviter B ;
- les deux parties ne voient pas nécessairement la raison du refus ;
- un blocage qui gagne la course avant acceptation empêche la création du DM ;
- un blocage postérieur à un DM existant applique les règles de messagerie et de visibilité définies, sans effacer l'historique automatiquement.

Les contrôles sont exécutés côté serveur à la création et à l'acceptation, avec verrouillage/ordre transactionnel cohérent.

## 7. Groupes officiels et compatibilité historique

Les groupes ne passent pas par les invitations DM individuelles. L'accès doit dépendre d'une affiliation institutionnelle active et d'une règle explicite de groupe : établissement, classe, niveau, filière ou groupe national autorisé.

Le modèle actuel `msg_is_member` autorise une appartenance implicite selon les champs wilaya/niveau/filière du profil. Il ne prouve pas une inscription officielle et ne doit pas devenir le contrôle final d'un groupe scolaire réel.

Migration de compatibilité :
- conserver les conversations directes historiques et leurs deux membres ;
- ne pas inventer des invitations acceptées rétroactivement ;
- ne pas supprimer de messages, pièces jointes ou rapports ;
- distinguer clairement les anciens DMs des nouveaux DMs créés via consentement ;
- prévoir une résolution pour les conversations anciennes ayant zéro, un ou plus de deux membres avant toute contrainte nouvelle ;
- garder les groupes existants visibles selon une règle transitoire auditée jusqu'à disponibilité du registre institutionnel.

## 8. Matrice de tests avant migration

Tous les tests ci-dessous sont à exécuter sur PostgreSQL jetable avec rôles/JWT distincts. Ils ne sont pas exécutés dans ce lot.

| ID | Scénario | Attendu |
|---|---|---|
| D01 | utilisateur non authentifié recherche l'annuaire | refus |
| D02 | recherche vide | aucun export national |
| D03 | élève opt-out | absent |
| D04 | affiliation expirée | absent |
| D05 | source institutionnelle révoquée | absent |
| D06 | statut profile verifie sans affiliation | absent |
| D07 | résultat annuaire | aucun champ privé |
| D08 | pagination curseur rejoué | pas de doublon ni saut |
| D09 | limite supérieure demandée | plafonnée serveur |
| D10 | scan rapide de l'annuaire | rate-limit |
| I01 | A invite B éligible | une invitation pending |
| I02 | A invite A | refus |
| I03 | A invite B non découvrable | réponse uniforme, aucune donnée divulguée |
| I04 | invitation répétée même clé | même résultat |
| I05 | même clé avec autre destinataire | rejet de réutilisation |
| I06 | B accepte l'invitation | un DM, exactement deux membres |
| I07 | A tente d'accepter sa propre invitation | refus |
| I08 | C tente de répondre à l'invitation | refus |
| I09 | B refuse | declined, aucun DM |
| I10 | A annule | cancelled, acceptation ultérieure refusée |
| I11 | acceptation après expiration | expired, aucun DM |
| I12 | deux acceptations concurrentes | un DM, deux membres |
| I13 | deux invitations concurrentes de la paire | résultat unique, aucune conversation double |
| I14 | blocage A→B avant création | invitation impossible |
| I15 | blocage B→A avant création | invitation impossible |
| I16 | blocage concurrent avec acceptation | ordre sérialisé, pas de DM si blocage préalable |
| I17 | affiliation révoquée après invitation | acceptation refusée |
| I18 | utilisateur cible supprimé/suspendu | acceptation refusée |
| I19 | rejeu après timeout client | résultat idempotent |
| I20 | erreur au milieu de l'acceptation | rollback complet |
| H01 | DM historique exact | réouverture sans invitation fictive |
| H02 | DM historique avec 1 membre | état signalé, pas de réparation silencieuse |
| H03 | conversation directe avec 3+ membres | quarantaine de migration, pas de suppression |
| G01 | élève transféré d'établissement | groupes source/target recalculés |
| G02 | élève hors wilaya | pas d'accès par simple profil déclaratif |
| P01 | SELECT profiles.* par authenticated | refus |
| P02 | lecture d'un label participant | id/pseudo seulement |
| P03 | non-admin appelle la file de vérification | refus |
| P04 | vérificateur hors périmètre | refus |
| P05 | service_role absent du navigateur | vérifié par analyse statique |
| R01 | message realtime nouveau DM | visible seulement aux deux membres |
| R02 | stockage d'une pièce jointe | objet privé et autorisation membre |
| R03 | blocage dans groupe | règles de visibilité/envoi cohérentes |

## 9. Séquence d'implémentation recommandée

1. Obtenir un environnement PostgreSQL jetable sans coût ou une autorisation explicite pour le coût.
2. Reconstituer une baseline fiable depuis le catalogue vivant et récupérer les migrations manquantes.
3. Écrire les tests d'échec d'abord : SELECT sensible, INSERT direct DM, auto-adhésion, accès groupe par profil déclaratif.
4. Construire les RPC d'annuaire minimal et remplacer les lectures directes de profils dans l'interface Messenger.
5. Tester séparément le flux de vérification existant et l'administration ; ne pas casser le panneau admin.
6. Construire les invitations et l'acceptation atomique.
7. Fermer les chemins SQL directs de création/adhésion seulement après tests de compatibilité.
8. Intégrer l'affiliation institutionnelle et élargir les conversations entre wilayas après preuve officielle.
9. Rejouer tous les tests Realtime, groupes, DM historiques, fichiers privés, modération et régression.

## 10. Critères de livraison

Aucune fonctionnalité ne sera déclarée réelle tant que :
- les RPC existent dans une migration versionnée et appliquée à l'environnement de test ;
- les privilèges et politiques sont testés avec plusieurs rôles ;
- les tests concurrents sont exécutés avec deux sessions PostgreSQL ;
- le client consomme les RPC au lieu de lire directement les profils ;
- aucun contournement par INSERT ou ancienne RPC ne crée de DM ;
- l'annuaire ne renvoie que des profils consentants et institutionnellement actifs ;
- les groupes historiques et pièces jointes continuent de fonctionner ;
- les résultats CI et l'environnement de prévisualisation sont vérifiés.

## 11. Hors périmètre et garde-fous

Aucune table, fonction ou politique n'a été créée dans Supabase actif. Aucun SQL d'écriture, DDL, migration, Auth/RLS/GRANT/Storage, déploiement Cloudflare ou changement `main`. PR #17 reste ouverte et non fusionnée. Aucun travail MFA/2FA ou facturation. Ce lot est une spécification, pas une implémentation ni une preuve d'exécution.
