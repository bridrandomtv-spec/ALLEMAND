# LOT 350 — Vérification des définitions SQL vivantes et des barrières d'accès DM

Date : 12 novembre 2026  
Projet Supabase : `azjwcybivirvpxbfhyzk`  
Nature : inspection catalogue PostgreSQL en lecture seule ; aucune écriture SQL/DDL.

## 1. Résultat exécutif

L'inspection directe du projet Supabase actif confirme les trois voies de DM sans invitation documentées au lot 348. Elle permet maintenant de rattacher les constats aux définitions SQL et policies réellement installées.

**NO-GO maintenu** : le consentement à l'ouverture d'un DM n'est pas imposé par le serveur.

## 2. Privilèges effectifs observés

Fonctions du schéma `public`, propriétaire `postgres` :

| Fonction | SECURITY DEFINER | search_path | EXECUTE observé |
|---|---:|---|---|
| `msg_open_direct(uuid)` | oui | vide | authenticated, postgres, service_role |
| `msg_can_dm(uuid,uuid)` | oui | pg_catalog, public | authenticated, postgres, service_role |
| `msg_member_ok(bigint,uuid)` | oui | pg_catalog, public | authenticated, postgres, service_role |
| `msg_not_blocked(bigint,uuid)` | oui | pg_catalog, public | authenticated, postgres, service_role |

Les tables `msg_conversations` et `msg_members` accordent notamment SELECT/INSERT/UPDATE/DELETE à `authenticated` (et les privilèges administratifs observés à postgres/service_role). L'autorisation effective des lignes dépend ensuite de RLS. Les GRANT seuls ne prouvent donc pas qu'un INSERT passe, mais ils permettent au client d'atteindre la barrière RLS.

## 3. Définitions SQL vivantes vérifiées

### 3.1 `msg_open_direct(uuid)`

La fonction :
- lit l'identité via `auth.uid()` ;
- refuse destinataire nul ou égal à l'appelant ;
- appelle `msg_can_dm` ;
- prend un advisory transaction lock sur la paire ordonnée ;
- retrouve un DM existant à exactement deux membres ;
- sinon insère une conversation `direct` et deux memberships dans la même transaction.

**Lacune déterminante :** aucune lecture de table d'invitations, aucun statut `accepted`, aucune vérification de consentement du destinataire, aucune affiliation institutionnelle canonique. L'appel RPC authentifié reste donc un chemin de création DM sans invitation.

### 3.2 `msg_can_dm(uuid,uuid)`

La fonction exige que :
- `auth.uid()` soit l'un des deux identifiants ;
- les deux profils partagent wilaya, niveau et filière ;
- les deux profils aient `verif_statut='verifie'`.

Elle ne consulte aucune affiliation officielle ni année scolaire. Elle bloque le parcours national inter-wilayas et confond le statut de profil avec une vérification institutionnelle.

### 3.3 `msg_member_ok(bigint,uuid)`

Pour les conversations directes, la définition vivante autorise :
- le premier membership si aucun membre n'existe et si l'appelant est le créateur ;
- le second membership si un membre existe déjà et si `msg_can_dm(auth.uid(), membre_existant)` retourne vrai.

Aucun contrôle d'invitation n'est effectué. Cette fonction constitue donc la condition RLS permettant encore l'auto-ajout du second membre dans une conversation directe.

Pour les groupes, la branche distincte se fonde sur les champs wilaya/niveau/filière du profil et les paramètres de conversation. Elle ne prouve pas davantage l'affiliation officielle ; ne pas modifier cette branche sans migration de compatibilité dédiée.

### 3.4 `msg_not_blocked(bigint,uuid)`

La fonction cherche un blocage dont le membre de conversation est `blocker_id` et l'expéditeur courant `blocked_id`. Elle détecte donc qu'un autre membre a bloqué l'expéditeur.

Elle ne détecte pas le cas inverse où l'expéditeur courant a bloqué l'autre membre. Le contrôle est directionnel, pas bilatéral.

## 4. Policies RLS vivantes vérifiées

| Table | Policy INSERT | Condition observée |
|---|---|---|
| `msg_conversations` | `msg conv creation` | `auth.uid() = created_by` et type direct, ou rôle modérateur pour groupe |
| `msg_members` | `msg members ajout` | `auth.uid() = user_id` et `msg_member_ok(conversation_id, auth.uid())` |

Les policies de lecture limitent les lignes à un membre ou modérateur. La policy d'ajout membre autorise l'auto-adhésion conditionnée par `msg_member_ok`. La policy de suppression permet à l'utilisateur de retirer son propre membership ou à un modérateur d'agir selon sa fonction.

La combinaison réelle est cohérente avec les trois chemins identifiés :
1. RPC SECURITY DEFINER qui crée directement les deux membres ;
2. INSERT de la conversation directe par son créateur ;
3. auto-ajout du second membre dans une conversation préexistante.

## 5. Impacts sur la conception du correctif

1. Révoquer l'accès client à `msg_open_direct(uuid)` ne suffit pas si les INSERT directs restent ouverts.
2. Fermer la policy conversation ne suffit pas si une autre policy permissive ou un rôle hérité permet encore l'INSERT.
3. Fermer l'auto-ajout dans `msg_member_ok` ne suffit pas si la RPC historique continue d'insérer les deux membres.
4. Le futur helper transactionnel doit être privé/non exposé et sa surface EXECUTE explicitement réduite ; sa fonction publique doit contrôler `auth.uid()`, invitation, destinataire, expiration, affiliation et blocage bilatéral.
5. Ne pas retirer les privilèges groupe en bloc : isoler le type `direct` tout en préservant le parcours modérateur des groupes.
6. La future migration doit vérifier les policies permissives cumulées, ACL, héritage de rôles, propriétaires, fonctions SECURITY DEFINER, search_path et wrappers RPC.
7. Toute migration doit être fondée sur la définition vivante constatée ici et sur une baseline reproductible ; ne pas réappliquer `supabase/msg_schema.sql` à l'aveugle.

## 6. Limites et sécurité de l'audit

- Requêtes SELECT de catalogue uniquement ; aucune ligne de message, profil personnel ou pièce jointe consultée.
- Aucune écriture Supabase, DDL, migration, changement Auth/RLS/GRANT/Storage/Realtime.
- Les privilèges observés sont ceux du moment de la requête ; une vérification complète devra aussi couvrir les rôles hérités, les policies non ciblées, les wrappers et les fonctions appelées transitivement avant toute migration.
- Aucun test PostgREST/JWT multi-comptes ni test de concurrence n'a été exécuté.
- Le rapport ne constitue pas une certification de sécurité.

## 7. Décision

Le plan du lot 349 est confirmé par les définitions SQL vivantes. La prochaine étape technique ne doit pas être une modification isolée de fonction : il faut d'abord produire une baseline isolée reproductible, puis écrire les tests d'échec pour les trois voies, et seulement ensuite préparer une migration atomique de fermeture.

Aucun déploiement Cloudflare, aucune modification de `main`, aucun merge PR #17. MFA/2FA et facturation hors périmètre.
