# Lot 387 — proposition de modèle SQL des invitations Messenger

Date : 13 novembre 2026  
Statut : conception uniquement — **NON EXÉCUTABLE / NON DÉPLOYÉE**  
Cible : branche `design/prototypes-67-74-alignment`, PR #17.

## 1. Base réelle examinée

L'examen croisé du catalogue actif et des fichiers du dépôt confirme :
- Les tables existantes restent `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`.
- `msg_conversations.id` est un bigint identity ; `msg_members` a la clé primaire (conversation_id,user_id).
- `msg_blocks` a la clé primaire (blocker_id,blocked_id), donc le blocage est directionnel et doit être testé dans les deux sens par les RPC.
- Les DM doivent être créés côté serveur dans une transaction, jamais par deux INSERT clients successifs.
- La méthode client `msgOpenDirect` est déjà documentée comme fermée à la création client : elle ne doit retrouver qu'un DM partagé existant ou renvoyer `msg_invitation_requise`.
- Le script historique `supabase/msg_schema.sql` est explicitement un ancien schéma préparatoire non exécuté. Il ne peut pas être utilisé comme reflet de la base active.

### Écart de schéma à conserver dans le manifeste
Le catalogue actif indique `msg_attachments.message_id NOT NULL`, alors que le fichier historique `supabase/msg_schema.sql` le déclare nullable. La base active fait foi. Ne pas recopier la définition historique dans une future restauration.

## 2. Modèle proposé : une table `public.msg_invitations`

Une invitation est une demande de contact, pas une conversation. Tant qu'elle est `pending`, elle ne crée :
- aucune ligne dans `msg_conversations` ;
- aucune ligne dans `msg_members` ;
- aucun droit de lecture ou d'envoi de message.

Colonnes proposées :

| Colonne | Type | Règle |
|---|---|---|
| id | bigint identity | PK |
| requester_id | uuid | FK auth.users, NOT NULL |
| recipient_id | uuid | FK auth.users, NOT NULL |
| status | text | pending / accepted / rejected / cancelled / expired |
| created_at | timestamptz | NOT NULL, default now() |
| expires_at | timestamptz | NOT NULL |
| responded_at | timestamptz | nullable, défini à la décision/annulation/expiration |
| conversation_id | bigint | nullable FK msg_conversations(id), renseigné seulement après acceptation et création atomique |

Contraintes :
- `requester_id <> recipient_id`.
- `expires_at > created_at`.
- état limité aux cinq valeurs documentées.
- `conversation_id` doit être NULL tant que l'état n'est pas accepted ; pour accepted, il doit référencer le DM correspondant une fois l'opération atomique terminée.
- Les transitions d'état sont validées par RPC serveur ; aucun UPDATE direct depuis le client.
- Une invitation ne peut pas être acceptée après expiration.
- Les deux sens de blocage sont vérifiés : `(A bloque B) OR (B bloque A)`.

Index proposés :
1. UNIQUE partiel sur `(LEAST(requester_id,recipient_id), GREATEST(requester_id,recipient_id)) WHERE status='pending'` : empêche deux demandes en attente simultanées dans les deux sens.
2. Index `(recipient_id, status, created_at DESC)` : boîte de réception des demandes.
3. Index `(requester_id, status, created_at DESC)` : demandes envoyées.
4. Index partiel sur `conversation_id WHERE conversation_id IS NOT NULL` si les requêtes de rapprochement le justifient après EXPLAIN.

La contrainte unique ne porte volontairement pas sur les invitations acceptées : le produit doit pouvoir conserver l'historique des décisions. La RPC doit toutefois réutiliser le DM existant et refuser les doublons actifs.

## 3. Cycle de vie et RPC

### `msg_invite_send(p_recipient uuid)`
- exige `auth.uid()` ; requester_id est toujours dérivé du JWT, jamais fourni par le navigateur ;
- refuse soi-même, compte inexistant, compte non éligible, compte suspendu si ce statut est établi, ou blocage dans un sens ou l'autre ;
- refuse ou renvoie l'invitation pending existante pour cette paire ;
- contrôle un quota anti-spam côté serveur ;
- insère seulement l'invitation pending et sa date d'expiration.

### `msg_invite_respond(p_invitation_id bigint, p_accept boolean)`
- seul `recipient_id=auth.uid()` peut répondre ;
- verrouille la ligne `FOR UPDATE` pour sérialiser les réponses concurrentes ;
- vérifie status=pending, expiration, éligibilité et blocages dans les deux sens ;
- si refus : passe à rejected, sans créer de conversation ;
- si acceptation : dans la même transaction, passe à accepted, crée ou retrouve le DM et les deux adhésions, lie `conversation_id`, puis commit ;
- si une étape échoue, toute la transaction est annulée : pas de DM orphelin ni d'invitation acceptée sans conversation.

### `msg_invite_cancel(p_invitation_id bigint)`
- seul le demandeur peut annuler une demande pending ;
- passe à cancelled ; aucune conversation créée.

### `msg_open_direct(p_other uuid)`
- conserve l'authentification et le refus des UUID nuls/soi-même ;
- exige une invitation accepted correspondant exactement à la paire ;
- vérifie le blocage dans les deux sens à chaque ouverture/réouverture ;
- réutilise le DM associé, sans créer un second DM ;
- ne doit jamais créer/ajouter un membre si l'invitation n'est pas acceptée.

### `msg_member_ok(cid, uid)`
- pour `type='direct'`, ne doit plus autoriser un ajout basé uniquement sur la compatibilité des profils ;
- exige le lien DM ↔ invitation acceptée et les deux membres attendus ;
- les groupes officiels conservent une règle d'adhésion distincte, issue d'une affectation institutionnelle vérifiée.

## 4. RLS et ACL proposés

- RLS activé sur `msg_invitations`.
- SELECT : uniquement requester ou recipient ; modération limitée aux rôles et périmètres explicitement autorisés.
- INSERT direct depuis authenticated : idéalement aucun, toutes les créations passent par `msg_invite_send` SECURITY DEFINER.
- UPDATE / DELETE direct : aucun accès client.
- Les RPC SECURITY DEFINER ont `SET search_path = pg_catalog, public, auth` ou un chemin minimal équivalent ; toutes les relations/fonctions applicatives sont qualifiées.
- Révoquer EXECUTE à PUBLIC/anon ; accorder seulement à authenticated pour les RPC concernées.
- Vérifier les propriétaires et ACL exacts avant de préparer les GRANT/REVOKE.
- Les fonctions n'acceptent jamais requester_id, recipient_id, status, created_at ou rôle d'acteur comme données faisant autorité depuis le client.

La stratégie de lecture du profil du correspondant et les données minimales visibles doivent rester indépendantes des droits d'invitation. Une invitation acceptée ne donne pas accès à l'annuaire complet.

## 5. Règles produit encore à figer

L'objectif exprimé est une messagerie entre élèves vérifiés de lycées et wilayas différents. La règle actuelle basée sur même wilaya/niveau/filière est donc incompatible avec cet objectif national si elle est conservée telle quelle.

Mais l'ouverture nationale doit rester conditionnée à :
- une affiliation scolaire courante et officielle, vérifiée côté serveur ; les champs libres de profil et raw_user_meta_data ne suffisent pas ;
- une règle institutionnelle validée pour les invitations élève↔élève, enseignants↔élèves, parents et comptes suspendus ;
- une visibilité d'annuaire minimale et des préférences de découverte ;
- des limites anti-énumération et anti-spam ;
- un blocage bilatéral effectif sur invitation, acceptation, ouverture et envoi ;
- une politique d'expiration décidée (durée exacte non fixée dans ce lot) ;
- une politique d'historique en cas de blocage/déblocage et de fermeture du contact.

Le dépôt contient un texte client qui parle d'un « numéro d'abonnement après activation du paiement ». L'utilisateur a indiqué qu'aucune facturation ne doit être engagée pour le moment. Ne pas construire de paiement ni conditionner le développement à un paiement ; le processus transitoire de vérification doit être défini séparément avec un identifiant d'inscription institutionnel non financier.

## 6. Séquence de tests requise

Sur PostgreSQL 17 isolé seulement, avec comptes synthétiques A/B/C/D :
1. pending ne crée aucune conversation ni adhésion.
2. seul B peut accepter/refuser A→B.
3. A ne peut pas accepter sa propre demande ; C ne peut agir sur aucune des deux identités.
4. acceptation crée exactement un DM et deux membres dans la même transaction.
5. deux acceptations concurrentes n'engendrent jamais deux DM.
6. invitation expirée, annulée ou refusée ne peut pas ouvrir un DM.
7. blocage A→B et blocage B→A empêchent chacun invitation, acceptation, réouverture et envoi.
8. une invitation A→B ne donne aucun droit sur A↔C.
9. anon ne peut ni lire, ni créer, ni changer une invitation.
10. authenticated ne peut falsifier requester_id, recipient_id ou status.
11. le rôle postgres/service_role n'est jamais utilisé comme identité de test RLS ; chaque test utilise rôle authenticated et claims JWT synthétiques cohérents.

## 7. Décision de sortie du lot

**GO pour la conception ; NO-GO pour migration et déploiement.**

Le modèle est suffisamment défini pour préparer un patch SQL isolé, mais pas pour l'appliquer : il manque la source officielle d'affiliation scolaire et les décisions institutionnelles sur les catégories de contacts. Aucun SQL n'a été exécuté sur Supabase actif, aucune table créée, aucune policy/RPC/ACL modifiée, aucune donnée lue, aucun coût engagé.
