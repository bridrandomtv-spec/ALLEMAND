# Lot 432 — spécification serveur consolidée pour ملتقى الطلاب et الرسائل

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment · PR #17  
**Nature :** contrat de conception, non exécutable. Ce document n'est ni une migration SQL ni une autorisation d'intervention sur Supabase.

## 1. Objectif et périmètre

Définir une frontière serveur cohérente pour :
- le forum communautaire gratuit ملتقى الطلاب ;
- les demandes de زمالة ;
- les invitations privées الرسائل ;
- le blocage bilatéral ;
- les profils publics minimaux ;
- la vérification scolaire gratuite et les rôles de validation.

Les décisions produit les plus récentes priment sur les formulations plus anciennes : compte élève actif inscrit = accès communautaire de base au forum, sans abonnement et sans exiger la vérification pour lire/participer au périmètre public défini ; les contacts privés restent réservés aux identités scolaires validées et au consentement explicite du destinataire. Les limites anti-abus et la modération s'appliquent à tous.

## 2. Principes de sécurité obligatoires

1. L'identité de l'appelant provient exclusivement de la session/JWT validée par Supabase ; aucun UUID client ne permet d'usurper un acteur.
2. Toute décision d'autorisation est réévaluée côté serveur à chaque lecture sensible et mutation.
3. Les tables sensibles ne sont pas directement modifiables par les rôles clients ; les mutations passent par des opérations serveur étroitement autorisées.
4. Les fonctions privilégiées ont un propriétaire maîtrisé, un search_path fixé, des références qualifiées, des ACL minimales et des contrôles explicites de l'acteur.
5. Les règles doivent rester vraies via RPC, REST, PostgREST, triggers, insertions directes et appels concurrents ; masquer un bouton ou vérifier côté navigateur ne suffit pas.
6. Les droits de lecture sur les profils sont séparés des droits de lecture des dossiers de vérification.
7. Aucun droit social ou privé ne découle du paiement ou de l'abonnement.

## 3. Séparation des trois relations

### 3.1 Relation sociale زمالة

- Une demande sociale relie un demandeur et un destinataire.
- Seul le destinataire peut accepter ou refuser ; le demandeur peut annuler tant qu'elle est en attente.
- Une acceptation crée uniquement la relation sociale.
- Elle ne crée ni conversation, ni membre Messenger, ni permission de lire un fil privé.
- Les états, quotas, règles de visibilité et politiques de retrait sont propres au domaine social.

### 3.2 Invitation Messenger

- Une invitation privée est un objet distinct de la relation sociale.
- Le demandeur doit être un élève dont l'affiliation scolaire a été validée et dont le compte est actif.
- Le destinataire doit être autorisé à recevoir des invitations selon ses préférences, son statut et les règles anti-abus.
- Le destinataire seul peut accepter ou refuser ; le demandeur seul peut annuler une invitation en attente.
- Une invitation pending, refusée, annulée ou expirée ne donne aucun accès au fil et ne crée aucune conversation.
- L'acceptation ne donne accès qu'à la conversation concernée et aux deux participants autorisés.
- Accepter une invitation Messenger ne crée pas automatiquement une relation sociale.

### 3.3 Blocage

Un blocage dans l'un ou l'autre sens doit interdire :
- la découverte réciproque dans les résultats de recherche ;
- l'envoi et l'acceptation d'une invitation ;
- la création ou la réouverture d'une conversation ;
- l'ajout d'un membre ;
- la lecture et l'envoi de nouveaux messages selon la politique de sécurité ;
- la reprise d'une invitation déjà en attente.

Le contrôle est bilatéral et centralisé. Le blocage doit être revérifié au moment de chaque mutation, pas uniquement lors de l'affichage initial. Débloquer ne réactive pas automatiquement les invitations ou conversations antérieurement refusées.

## 4. Invariant de création d'un DM

**Invariant :** une conversation directe nouvelle ne peut être créée que par l'opération serveur d'acceptation d'une invitation Messenger précise, encore pending, non expirée, adressée à l'utilisateur authentifié, et après revalidation de tous les critères.

L'opération d'acceptation doit exécuter atomiquement :
1. identifier l'appelant depuis le JWT ;
2. verrouiller l'invitation ciblée ;
3. vérifier que l'appelant est exactement le destinataire ;
4. vérifier l'état pending et l'expiration ;
5. vérifier les deux comptes actifs et les affiliations scolaires valides ;
6. vérifier les préférences de contact et les quotas ;
7. vérifier l'absence de blocage dans les deux sens ;
8. créer ou retrouver la conversation directe unique correspondant à la paire autorisée ;
9. créer exactement les deux appartenances nécessaires ;
10. enregistrer l'état accepted et le lien de conversation ;
11. retourner un résultat minimal.

Tout échec doit annuler la transaction complète. Il ne doit pas exister d'état accepted sans conversation liée, ni de conversation nouvelle issue d'une invitation non acceptée. Les appels répétés doivent retourner le même résultat autorisé sans ajouter de conversation ou de membre supplémentaire.

## 5. Verrouillage des anciens chemins de contournement

Avant activation, établir et prouver le comportement de chaque point d'entrée existant :
- RPC historique msg_open_direct(uuid) ;
- INSERT/UPDATE sur msg_conversations ;
- INSERT/UPDATE sur msg_members ;
- trigger msg_guard_direct et fonction msg_can_dm ;
- fonction msg_member_ok ;
- politiques RLS cumulatives et privilèges de table/colonnes ;
- fonctions de lecture des conversations et messages ;
- envoi de message, pièces jointes, Realtime et réouverture d'un fil.

Contrat attendu :
- la RPC historique ne peut plus créer un nouveau DM sans invitation acceptée ;
- les insertions REST directes ne peuvent pas ajouter une conversation ou un membre pour contourner le consentement ;
- les triggers défendent les invariants même si un appelant atteint une table par un autre chemin ;
- une conversation existante ne contourne jamais un blocage nouvellement posé ;
- les fonctions SECURITY DEFINER n'exposent pas de capacités plus larges que leur contrat ;
- les grants EXECUTE et les grants de colonnes sont explicitement documentés.

La stratégie de migration (remplacement, retrait d'EXECUTE, délégation vers une nouvelle RPC, ou garde temporaire) ne sera arrêtée qu'après vérification du catalogue actif exact et des dépendances. Ne pas appliquer aveuglément un DROP/CREATE ou rejouer les migrations archivées.

## 6. Projection publique des profils

Ne pas exposer directement la ligne complète de public.profiles dans l'annuaire, le forum ou les conversations.

Créer une projection/lecture publique dédiée qui ne retourne que les champs strictement nécessaires au produit, par exemple :
- identifiant opaque de profil non réutilisable comme secret d'autorisation ;
- pseudonyme ;
- avatar si disponible et approuvé ;
- niveau/filière/wilaya seulement si nécessaires, autorisés et contrôlés par les préférences de visibilité ;
- badge d'affiliation validée sans révéler l'identité du vérificateur ou la preuve.

Exclure impérativement : matricule, section administrative, verif_by, verif_at, email, téléphone, identifiant Auth, pièces justificatives et métadonnées de paiement. Les champs exacts doivent être confirmés à partir du schéma réel et des usages UI avant implémentation.

Les droits SELECT sur les colonnes privées doivent être retirés ou rendus inaccessibles aux rôles ordinaires, après inventaire des dépendances. Une vue seule ne suffit pas si les mêmes rôles conservent l'accès direct aux colonnes sous-jacentes.

## 7. Vérification scolaire gratuite et autorisations des agents

### Demandeur
- Tout élève disposant d'un compte peut déposer gratuitement une demande.
- Aucun abonnement, reçu ou numéro de paiement n'est exigé.
- L'identifiant d'abonnement n'est pas un matricule scolaire et ne doit pas être réutilisé comme preuve.
- Collecter le minimum d'informations nécessaire ; aucun justificatif ne doit être envoyé dans Messenger ou le forum.

### Décision
- La vérification finale repose sur une source institutionnelle ou un canal officiel autorisé, à définir avant activation.
- Si une preuve documentaire est exceptionnellement nécessaire, accès privé, rétention minimale, suppression planifiée et journalisation des consultations.
- Le vérificateur d'établissement est limité à son établissement ; celui de wilaya à sa wilaya ; le superviseur central gère les habilitations et recours.
- L'auteur de la décision initiale ne traite pas seul son recours.
- Modérateurs sociaux et administrateurs techniques ne reçoivent pas automatiquement accès aux preuves.

Le catalogue actuel indique des mécanismes et rôles existants à rapprocher de cette matrice ; les habilitations réelles doivent être vérifiées dans le catalogue actif avant tout changement.

## 8. Contrat de service — opérations conceptuelles

Les noms ci-dessous décrivent des responsabilités logiques, pas des noms de fonctions SQL imposés.

| Opération | Acteur autorisé | Effet autorisé |
|---|---|---|
| rechercher des profils découvrables | élève connecté selon visibilité | projection minimale, filtrée par blocage et préférences |
| envoyer demande de زمالة | élève connecté | créer demande sociale uniquement |
| répondre à demande de زمالة | destinataire | accepter/refuser relation sociale uniquement |
| annuler demande de زمالة | demandeur | annuler demande en attente |
| envoyer invitation Messenger | élève à affiliation validée | créer invitation pending, sans DM |
| répondre invitation Messenger | destinataire uniquement | refuser ou accepter transactionnellement |
| annuler invitation Messenger | demandeur uniquement | annuler invitation pending |
| lister demandes Messenger | participants concernés | données minimales, pagination, filtrage expiration |
| bloquer/débloquer | utilisateur concerné | gérer sa propre relation de blocage |
| demander vérification | propriétaire du compte | ouvrir un dossier gratuit minimal |
| statuer sur vérification | vérificateur habilité et dans son périmètre | valider/refuser avec audit et motif minimal |
| signaler contenu/profil | utilisateur connecté | créer un signalement, sans révéler l'identité du signalant |

Aucune opération ne doit accepter un user_id arbitraire comme identité de l'appelant.

## 9. Forum ملتقى الطلاب — règles d'accès

- Les comptes élèves actifs inscrits accèdent gratuitement au périmètre communautaire de base, qu'ils soient abonnés ou non.
- La vérification scolaire n'est pas un prérequis pour consulter et participer au forum de base selon la décision produit la plus récente ; les fonctionnalités sensibles ou les contacts privés gardent leurs contrôles spécifiques.
- Les publications, commentaires et réactions sont soumis à quotas, validation des entrées, anti-spam, signalement, blocage et modération.
- Les comptes suspendus, désactivés ou supprimés ne publient pas et ne contournent pas une sanction via des endpoints alternatifs.
- Les contenus utilisateurs sont échappés/assainis avant rendu ; pièces jointes et liens ont leurs propres contrôles.
- La visibilité d'un profil dans le forum ne rend jamais accessibles les preuves d'identité ni les coordonnées privées.

## 10. Matrice de tests obligatoire en environnement isolé

Utiliser des comptes synthétiques A, B, C, D avec JWT distincts. Ne pas utiliser service_role pour prouver les permissions d'un élève.

| Cas | Précondition/action | Résultat exigé |
|---|---|---|
| S1 | A envoie une demande sociale à B | demande pending, aucun DM |
| S2 | B accepte la demande sociale | relation créée, aucun DM |
| M1 | A envoie invitation Messenger à B | pending, aucun DM/membre |
| M2 | A tente d'accepter sa propre invitation | refus |
| M3 | C tente d'accepter l'invitation A→B | refus |
| M4 | B accepte invitation valide | un DM, deux membres, lien invitation |
| M5 | B clique deux fois / appels concurrents | même résultat, aucun doublon |
| M6 | Invitation refusée/annulée/expirée | aucun DM |
| M7 | A bloque B puis B invite A | refus |
| M8 | B bloque A puis A invite B | refus |
| M9 | blocage après création DM | accès et envoi conformes au blocage, pas de contournement |
| P1 | utilisateur ordinaire lit projection profil | colonnes privées absentes |
| P2 | utilisateur tente SELECT direct sur matricule/verif_by | refus |
| V1 | compte sans abonnement demande vérification | demande gratuite recevable |
| V2 | vérificateur hors périmètre tente décision | refus |
| V3 | modérateur tente lire justificatif | refus |
| R1 | INSERT REST direct de conversation/membre | refus ou aucune création non autorisée |
| R2 | appel direct ancienne RPC msg_open_direct | aucun nouveau DM sans invitation acceptée |
| R3 | lecture/écriture après révocation, suspension ou blocage | refus |
| F1 | compte actif non abonné et non vérifié utilise forum de base | accès selon politique produit |
| F2 | compte suspendu publie via endpoint alternatif | refus |
| REG | groupes, DM existants, fichiers, Realtime, signalements | non-régression |

Les tests de concurrence doivent être réellement parallèles. Les tests doivent être exécutés sous les rôles/JWT qu'ils prétendent valider et inclure les appels REST directs, pas uniquement le client web.

## 11. Préconditions de passage à l'implémentation

Aucune migration n'est prête tant que les points suivants ne sont pas tous satisfaits :
1. baseline cataloguée et datée : contraintes, index, FKs, triggers, fonctions, propriétaires, search_path, ACL, policies, grants, vues, extensions et dépendances ;
2. définition de la source institutionnelle d'affiliation et des rôles de vérification ;
3. stratégie de compatibilité des DM/groupes déjà existants ;
4. matrice RLS/grants revue par une deuxième personne ;
5. environnement de test isolé disponible sans coût, sans données réelles ;
6. scripts de migration avec préflight, assertions post-migration, rollback/plan de restauration et ordre de déploiement ;
7. tests négatifs et de concurrence réussis sur cette baseline ;
8. autorisation distincte de l'utilisateur avant toute modification du projet Supabase actif.

Le statut actuel ne satisfait pas encore ces préconditions. Le présent document ne donne aucune autorisation d'exécution.

## 12. Limites et état du lot

- Spécification documentaire seulement.
- Aucun SQL exécuté, aucun script de migration produit ou appliqué.
- Aucun changement de tables, RLS, ACL, RPC, triggers, Auth, Storage, Realtime ou paiements.
- Aucun code applicatif, test PostgreSQL ou déploiement Cloudflare modifié.
- Aucun service payant ou installation.
- PR #17 reste non fusionnée ; aucune modification de main.
