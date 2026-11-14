# Lot 386 — invariants invitations privées et blocage Messenger

Statut : spécification de test, non déployée.  
Cible d'exécution : PostgreSQL 17 isolé avec rôles `authenticated` et JWT synthétiques.  
Interdit : exécuter les scénarios d'écriture sur Supabase actif.

## 1. Modèle d'état proposé pour une invitation privée

États :
- `pending` : demande envoyée, aucune conversation privée accessible.
- `accepted` : destinataire a explicitement accepté ; le DM peut être créé/réutilisé.
- `rejected` : refus explicite ; aucun DM créé par cette demande.
- `cancelled` : demandeur a retiré sa demande avant acceptation.
- `expired` : demande arrivée à expiration selon une durée définie par le produit.

Transitions permises :
- demandeur : aucun état → pending ;
- destinataire : pending → accepted ou rejected ;
- demandeur : pending → cancelled ;
- système : pending → expired ;
- aucun acteur ne peut transformer rejected/cancelled/expired en accepted ; une nouvelle demande doit être créée.

Une invitation acceptée ne doit pas accorder d'accès aux autres conversations, groupes ou profils non autorisés. L'acceptation ne doit concerner que la paire d'utilisateurs et le DM visé.

## 2. Invariants d'autorisation

1. Seul un utilisateur authentifié peut créer une demande.
2. L'expéditeur ne peut pas s'envoyer une invitation à lui-même.
3. Le destinataire doit exister et satisfaire les critères d'éligibilité de messagerie.
4. L'éligibilité (identité/affiliation vérifiées) et le consentement (invitation acceptée) sont deux contrôles distincts.
5. Une demande pending ne permet ni création du DM, ni auto-ajout du destinataire comme membre, ni lecture de messages.
6. Seul le destinataire de la demande peut l'accepter ou la refuser.
7. Le demandeur peut annuler uniquement sa demande pending.
8. Les transitions concurrentes doivent être sérialisées/atomiques : un refus et une acceptation simultanés ne peuvent tous deux réussir.
9. Le DM ne peut être ouvert que si une invitation acceptée correspond exactement aux deux participants.
10. Une invitation ne doit pas contourner un blocage actif.
11. Une réouverture de DM existant doit revalider l'état du blocage ; l'ancien DM ne doit pas neutraliser un blocage.
12. Les contrôles doivent être appliqués côté SQL/RLS, pas uniquement dans le client JavaScript.

## 3. Invariants de blocage

- Le blocage est directionnel : A bloque B signifie que B ne peut pas initier/continuer une interaction privée avec A selon la politique produit.
- La règle s'applique à l'envoi d'invitation, à l'acceptation, à la création/réouverture du DM et à l'envoi de message.
- L'utilisateur bloqué ne reçoit pas de détail révélant inutilement l'identité ou l'action du bloqueur ; définir un retour générique.
- Le retrait du blocage ne réactive pas automatiquement une ancienne invitation rejetée/expirée ni une conversation supprimée.
- Un modérateur ne peut pas annuler un blocage privé au nom d'un utilisateur, sauf politique administrative explicitement approuvée et auditée.

## 4. Matrice de tests négatifs et positifs

Comptes synthétiques : A demandeur, B destinataire, C tiers, D compte non vérifié, E compte d'une autre wilaya/niveau/filière, M modérateur. Tous les UUID sont synthétiques et ne doivent jamais correspondre à des utilisateurs réels.

| ID | Précondition / action | Résultat attendu |
|---|---|---|
| INV-01 | A crée une demande vers B éligible | pending créé |
| INV-02 | A tente de s'inviter lui-même | refus |
| INV-03 | A crée une seconde demande pending identique vers B | refus ou retour idempotent, aucune duplication |
| INV-04 | C tente d'accepter la demande A→B | refus |
| INV-05 | A tente d'accepter sa propre demande | refus |
| INV-06 | B accepte A→B | état accepted |
| INV-07 | B refuse A→B | état rejected, DM impossible |
| INV-08 | A annule A→B pending | état cancelled |
| INV-09 | A tente d'ouvrir le DM avant acceptation | refus, aucun membre/DM créé |
| INV-10 | B s'ajoute directement au DM sans invitation accepted | refus |
| INV-11 | A ouvre DM après acceptation B→A correspondante | DM créé ou existant retourné |
| INV-12 | A réutilise une invitation accepted pour ouvrir un DM avec C | refus |
| INV-13 | acceptation et refus concurrents sur la même demande | une seule transition réussit |
| INV-14 | invitation expirée puis acceptation tardive | refus |
| BLK-01 | A bloque B avant invitation | invitation refusée |
| BLK-02 | A bloque B, B tente l'ouverture DM | refus |
| BLK-03 | DM existant, A bloque B, B tente réouverture | refus |
| BLK-04 | DM existant, A bloque B, B envoie message | refus |
| BLK-05 | B bloque A, A tente d'envoyer un message | refus |
| BLK-06 | B débloque A après refus | ancienne demande ne devient pas accepted |
| BLK-07 | C non bloqué échange avec A | autorisé si invitation accepted et éligibilité valide |
| AUTH-01 | anon tente de créer invitation | refus |
| AUTH-02 | authenticated falsifie requester_id=A alors que JWT= C | refus |
| AUTH-03 | utilisateur modifie directement état=accepted | refus |
| AUTH-04 | modérateur tente d'accepter au nom de B | refus par défaut ; aucune délégation implicite |

## 5. Conditions d'acceptation avant implémentation

- Définir la durée d'expiration des demandes.
- Définir si l'acceptation est requise dans les deux sens ou seulement par le destinataire.
- Définir les règles d'accès à l'historique après blocage/déblocage.
- Définir si les enseignants peuvent recevoir des invitations d'élèves et les règles d'encadrement.
- Définir la source officielle de l'affiliation scolaire ; les métadonnées déclaratives du profil ne suffisent pas.
- Implémenter les invariants dans SQL/RLS avec fonctions SECURITY DEFINER à search_path maîtrisé et ACL EXECUTE minimales.
- Tester les cas sous rôle `authenticated` avec claims JWT cohérents, jamais sous postgres/service_role.
- Exécuter la suite complète sur une restauration isolée PostgreSQL 17 avant toute proposition de migration.

## 6. Décision

Cette matrice est une spécification de sécurité et un plan de tests. Elle ne crée aucune table, fonction, policy, invitation ou donnée. Aucune modification du projet Supabase actif n'est autorisée dans ce lot.
