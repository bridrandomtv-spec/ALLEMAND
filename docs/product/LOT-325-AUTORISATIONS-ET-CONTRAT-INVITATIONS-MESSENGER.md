# Lot 325 — revue des autorisations Messenger et contrat d'invitation

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : lecture de `supabase/msg_schema.sql`, `supabase/supabase.js`, `msg.js` et des contrôles CI.  
Nature : audit et conception documentaire uniquement. Aucun SQL ni aucune règle RLS modifiés.

## 1. Décision

Le système actuel ne doit pas être ouvert à un annuaire national ni à des DM inter-wilayas. Il manque encore une preuve d'affiliation institutionnelle et un mécanisme d'invitation transactionnel. La correction du Lot 324 a supprimé la création de DM depuis le navigateur, mais le schéma SQL contient encore des chemins d'adhésion directe à fermer avant toute ouverture.

## 2. Constat de sécurité confirmé

### S1 — Adhésion directe à une conversation privée sans invitation (critique avant ouverture)

Le contrat SQL actuel permet :
- à un utilisateur authentifié de créer une ligne `msg_conversations` de type `direct` avec `created_by = auth.uid()` ;
- à un utilisateur d'insérer sa propre ligne dans `msg_members` si `msg_member_ok` accepte le type `direct` ;
- au trigger `msg_guard_direct` de contrôler la compatibilité des deux profils quand un autre membre existe déjà, mais il ne vérifie pas l'existence d'une invitation acceptée.

Conséquence : le schéma ne représente pas le consentement du destinataire. Un ID de conversation divulgué ou deviné peut permettre un parcours d'auto-adhésion si les autres contrôles sont satisfaits. La protection du client Lot 324 ne suffit donc pas à rendre le modèle serveur sûr.

**Décision cible :** aucune écriture directe authentifiée dans les conversations DM ou leurs membres. Seules des fonctions serveur transactionnelles, après acceptation d'une invitation valide, doivent créer le DM et ses deux adhésions.

### S2 — Vérification scolaire non institutionnelle (bloquant produit)

Le statut `profiles.verif_statut='verifie'` est attribuable par un rôle `prof` ou `admin` dans le trigger `profiles_verif_guard`. La demande repose sur un matricule et une section déclarés par l'élève. Le schéma n'associe pas cette validation à un établissement canonique, une année scolaire, une source officielle, un dossier probant ni un historique de décision à deux personnes.

Cette validation peut servir de prototype de contrôle humain, mais elle ne prouve pas l'inscription dans un lycée déterminé et ne permet pas de garantir un annuaire national exact.

**Décision cible :** remplacer le simple statut par une inscription liée à un établissement du registre officiel, à une année scolaire, une classe/filière et une décision traçable. Le rôle technique `admin` ne doit pas être confondu avec un valideur institutionnel.

### S3 — Autorisation DM limitée à wilaya + niveau + filière

La version finale de `msg_can_dm` exige que les deux profils soient vérifiés et aient la même wilaya, le même niveau et la même filière. Cela contredit l'objectif de conversations inter-lycées et inter-wilayas.

**Décision cible :** ne pas élargir simplement la comparaison en supprimant les critères géographiques. La règle doit s'appuyer sur deux affiliations institutionnelles actives et vérifiées, l'éligibilité des deux comptes, l'acceptation explicite de l'invitation et l'absence de blocage.

### S4 — Gestion des blocages asymétrique à revalider

La fonction `msg_not_blocked(cid, snd)` bloque l'envoi lorsque l'un des autres membres a bloqué l'expéditeur. La lecture du SQL suggère que le cas inverse (l'expéditeur a bloqué un destinataire) n'est pas traité de manière symétrique. Les règles attendues doivent être explicites pour les DM et groupes, et testées dans les deux sens.

### S5 — Modération et vérification trop largement confondues

`msg_is_moderator` assimile les rôles `prof` et `admin`. Le trigger de vérification autorise ces deux rôles à changer le statut. Pour le produit national, les droits doivent distinguer :
- modération de contenu ;
- validation d'une inscription par un responsable habilité de l'établissement concerné ;
- administration technique du service ;
- gestion des incidents et audit.

Un professeur ne doit pas valider arbitrairement des élèves de tous les établissements.

### S6 — Contrôles des pièces jointes à approfondir avant l'ouverture

Le schéma limite le MIME déclaré et la taille à 5 Mio, mais le MIME envoyé par le navigateur n'est pas une preuve du type réel du fichier. Avant l'ouverture nationale, prévoir contrôle serveur du contenu, nom/chemin générés, antivirus ou analyse adaptée, quotas, conservation et liens signés à durée limitée. Les objets privés ne doivent jamais être accessibles par URL publique.

## 3. Contrat fonctionnel cible des invitations

### États

- `pending` : créée par l'expéditeur, en attente du destinataire.
- `accepted` : acceptée explicitement par le destinataire ; une conversation directe unique est créée dans la même transaction.
- `declined` : refusée par le destinataire ; aucun DM n'est créé.
- `cancelled` : annulée par l'expéditeur avant décision.
- `expired` : délai dépassé ; aucun DM n'est créé.
- `blocked` : action empêchée par un blocage actif ; aucun DM n'est créé.

Transitions permises :
- expéditeur : `pending → cancelled` ;
- destinataire : `pending → accepted|declined` ;
- traitement serveur : `pending → expired` après échéance.

Aucune transition ne doit permettre à l'expéditeur de s'auto-accepter ou à un tiers de répondre.

### Invariants transactionnels

1. Une invitation est émise par l'utilisateur authentifié ; l'identité de l'expéditeur ne vient jamais du payload client.
2. Le destinataire est un compte existant et éligible dans l'annuaire autorisé ; les champs privés ne sont jamais retournés à l'expéditeur.
3. Les deux comptes ont une affiliation institutionnelle active pour l'année scolaire concernée, issue du registre validé.
4. L'invitation est créée seulement si aucun blocage bilatéral, refus récent ou plafond anti-spam ne l'empêche.
5. Une contrainte d'unicité/idempotence empêche plusieurs invitations actives équivalentes.
6. L'acceptation vérifie à nouveau l'identité du destinataire, l'état `pending`, l'expiration, les blocages et l'éligibilité des deux affiliations.
7. L'acceptation crée conversation + deux membres + événement d'audit dans une seule transaction. Si une étape échoue, rien n'est créé.
8. Une invitation ne peut créer qu'une seule conversation directe ; les appels répétés renvoient le résultat existant.
9. Le client ne peut ni insérer directement un DM, ni ajouter le correspondant à `msg_members`, ni changer l'état d'une invitation hors RPC autorisée.
10. Les événements d'audit ne contiennent ni matricule en clair, ni document, ni jeton secret.
11. Les refus, expirations et annulations ne créent aucune conversation.
12. La suppression/blocage ultérieur respecte les droits et ne réactive pas une invitation ancienne.

## 4. Contrat minimal des opérations serveur (à implémenter après validation du modèle)

- `msg_directory_search(query, cursor, limit)` : retourne uniquement pseudo, établissement public autorisé, niveau/filière si visibilité consentie et identifiant opaque nécessaire à l'invitation ; pagination serveur et anti-énumération.
- `msg_invite_create(recipient_id, idempotency_key)` : crée ou renvoie une invitation en attente ; pas de création de conversation.
- `msg_invite_inbox(cursor, limit)` et `msg_invite_outbox(cursor, limit)` : listes bornées, visibles uniquement par les parties.
- `msg_invite_respond(invitation_id, decision)` : destinataire seulement ; acceptation et création atomique du DM.
- `msg_invite_cancel(invitation_id)` : expéditeur seulement, tant que pending.
- `msg_invite_expire_batch()` : tâche serveur contrôlée, idempotente et auditable.
- `msg_direct_open(conversation_id)` : vérifie l'appartenance existante ; ne crée rien.

Ces noms sont des contrats de conception, pas des fonctions présentes ni déployées.

## 5. Matrice d'autorisation à tester

| Acteur | Rechercher un élève | Envoyer invitation | Répondre | Lire DM |
|---|---|---|---|---|
| Élève vérifié avec affiliation active | Oui, selon visibilité | Oui, limites anti-spam | Seulement ses invitations reçues | Membres seulement |
| Élève non vérifié / affiliation expirée | Non, ou accès très limité | Non | Peut refuser une invitation déjà reçue ; pas l'accepter si inéligible | DM existants selon politique de suspension |
| Professeur | Selon habilitation institutionnelle | Pas de DM élève par privilège | Non, sauf s'il est partie | Modération selon mandat, journalisée |
| Responsable de validation établissement | Annuaire de son périmètre | Non par défaut | Non | Pas d'accès au contenu par défaut |
| Admin technique | Métadonnées strictement nécessaires | Non par privilège | Non | Accès exceptionnel, contrôlé et audité |
| Compte bloqué par l'autre | Pas d'accès supplémentaire | Non | Aucun contournement | Aucun contournement |

## 6. Tests négatifs obligatoires avant activation

- Un élève ne peut créer un DM par INSERT REST direct.
- Un élève ne peut s'ajouter à une conversation DM qui ne lui est pas destinée.
- Un élève ne peut ajouter un autre utilisateur dans `msg_members`.
- Un tiers ne peut accepter/refuser/annuler une invitation.
- Un expéditeur ne peut accepter sa propre invitation.
- Une invitation expirée/refusée/annulée ne crée aucun DM.
- Deux acceptations concurrentes ne créent qu'un DM et deux membres.
- Un compte bloqué ne peut pas envoyer ni recevoir de nouvelle invitation de l'autre.
- Une affiliation révoquée/expirée entre l'émission et l'acceptation bloque l'acceptation.
- Un professeur hors établissement ne peut valider l'affiliation d'un élève.
- Une recherche ne permet pas d'énumérer les UUID, matricules, emails ou téléphones.
- Un compte non membre ne lit ni messages, ni membres, ni pièces jointes, même en devinant les IDs.
- Les tests vérifient aussi les privilèges SQL effectifs, pas seulement les policies RLS.

## 7. Ordre d'exécution retenu

1. Stabiliser le registre des établissements et l'affiliation institutionnelle (Lots 322–323).
2. Produire un schéma de permissions complet, incluant les INSERT/UPDATE/DELETE directs interdits sur DM et membres.
3. Implémenter le modèle invitation + RPC transactionnelles dans une migration distincte, après autorisation explicite et revue.
4. Exécuter les tests sur une base PostgreSQL jetable, avec comptes synthétiques et rôles authentifiés.
5. Implémenter l'annuaire serveur paginé et la recherche dans l'interface.
6. Ouvrir les DM inter-lycées puis inter-wilayas uniquement après validation des critères précédents.

## 8. Garde-fous

Aucun changement SQL/RLS/GRANT/Auth/Storage, aucune migration, aucune écriture Supabase active, aucun déploiement, aucun merge, aucune modification de `main). PR #17 reste ouverte. Aucun MFA/2FA et aucune facturation.


## 9. Précisions techniques après relecture des triggers

### Course critique sur l'ajout du second membre

`msg_guard_direct` cherche le membre opposé au moment du INSERT et ne valide `msg_can_dm` que si cette ligne est déjà visible. Deux insertions concurrentes de membres distincts peuvent chacune ne pas voir l'insertion non validée de l'autre au niveau d'isolation usuel READ COMMITTED. Le contrôle du trigger n'est donc pas un verrou transactionnel garantissant à lui seul la règle DM.

**Exigence :** l'acceptation d'invitation doit verrouiller la ligne d'invitation et sérialiser la création du DM ; les deux membres doivent être insérés dans la même transaction serveur. Le contrôle de cohérence doit porter sur le couple complet, pas sur la présence opportuniste d'un autre membre.

### Fermeture des écritures directes

La future migration devra examiner les privilèges et policies effectifs sur :
- `msg_conversations` : refuser l'INSERT client pour `type='direct'`, conserver uniquement le chemin de création de groupe réservé aux personnes habilitées ;
- `msg_members` : interdire l'INSERT client sur les conversations directes, y compris l'auto-ajout ; définir séparément l'adhésion aux groupes ;
- `msg_invites` : aucune modification d'état directe par le client ; opérations limitées aux RPC dédiées ;
- séquences et fonctions : vérifier les privilèges EXECUTE et l'exposition des fonctions `SECURITY DEFINER`, avec `search_path` fixé et contrôle explicite de `auth.uid()`.

Les grants SQL et RLS doivent être vérifiés ensemble : retirer un droit trop large sans vérifier les policies, ou l'inverse, ne suffit pas. La migration doit aussi préserver la création de groupes officiels par les modérateurs habilités et ne pas casser les conversations existantes.

### Limite du client actuel

`msgOpenDirect` ne recherche les conversations communes que dans les 500 adhésions les plus récentes du compte courant. Cela peut ne pas retrouver une ancienne conversation pour un compte très actif. À terme, remplacer cette recherche client par une RPC paginée/serveur qui vérifie les deux membres et retourne uniquement une conversation déjà accessible. Ce point n'autorise jamais à créer un DM depuis le client.
