# Lot 400 — audit en lecture seule des fonctions critiques Messenger

Date : 13 novembre 2026  
Dépôt : `bridrandomtv-spec/ALLEMAND`  
Branche : `design/prototypes-67-74-alignment`

## Périmètre et méthode

Audit du catalogue PostgreSQL Supabase actif en lecture seule. Les requêtes portent exclusivement sur les métadonnées PostgreSQL : définitions de fonctions, propriétaires, attributs SECURITY DEFINER, search_path, ACL/EXECUTE, politiques RLS et triggers. Aucun contenu de profil, message, pièce jointe ou notification n'a été lu.

Aucun DDL/DML, migration, modification de fonction, policy, GRANT, Auth, RLS, Storage ou Realtime n'a été exécuté. Aucun test comportemental PostgreSQL/RLS n'a été lancé.

## 1. Fonctions critiques

| Fonction | Signature | SECURITY | search_path | EXECUTE |
|---|---|---|---|---|
| `msg_can_dm` | `(uuid, uuid)` | DEFINER, propriétaire postgres | `pg_catalog, public` | authenticated, service_role, postgres |
| `msg_member_ok` | `(bigint, uuid)` | DEFINER, propriétaire postgres | `pg_catalog, public` | authenticated, service_role, postgres |
| `msg_not_blocked` | `(bigint, uuid)` | DEFINER, propriétaire postgres | `pg_catalog, public` | authenticated, service_role, postgres |
| `msg_open_direct` | `(uuid)` | DEFINER, propriétaire postgres | vide (`search_path = ''`) | authenticated, service_role, postgres |
| `msg_is_member` | `(uuid, bigint)` | DEFINER, propriétaire postgres | `pg_catalog, public` | authenticated, service_role, postgres |
| `msg_is_moderator` | `(uuid)` | DEFINER, propriétaire postgres | `pg_catalog, public` | authenticated, service_role, postgres |
| `msg_guard_direct` | trigger | DEFINER, propriétaire postgres | `pg_catalog, public` | postgres, service_role |
| `msg_rate_limit` | trigger | DEFINER, propriétaire postgres | `pg_catalog, public` | postgres, service_role |

Les ACL explicites des fonctions inspectées n'accordent pas EXECUTE à `PUBLIC` ni à `anon`. Contrôle de privilèges effectifs confirmé : `anon` ne peut pas exécuter `msg_can_dm` ni `msg_open_direct`; `authenticated` peut exécuter les RPC prévues. Les fonctions trigger ne sont pas directement exécutables par authenticated.

Les fonctions SECURITY DEFINER ont un search_path fixé ; `msg_open_direct` utilise le search_path vide et qualifie ses objets applicatifs par `public.`. Ces constats portent sur les fonctions inspectées, pas sur toutes les fonctions du projet.

## 2. Chemins d'ouverture et d'ajout de membres

### RPC `msg_open_direct(p_other uuid)`

- Exige une session et un destinataire différent de l'appelant.
- Appelle `msg_can_dm`, qui exige actuellement que les deux profils soient vérifiés et partagent wilaya, niveau et filière.
- Verrouille la paire avec un advisory transaction lock, recherche un DM existant avec exactement deux membres, puis crée conversation et deux membres si nécessaire.
- Ne consulte ni `msg_blocks), ni une future table `social_blocks`, ni une invitation Messenger acceptée.
- L'acceptation d'une relation sociale n'est donc pas un prérequis dans cette RPC.

### INSERT direct sur les tables

Les privilèges effectifs indiquent que `authenticated` possède INSERT sur `msg_conversations` et `msg_members`. Les policies RLS et triggers sont donc essentiels :

- `msg conv creation` : autorise la création si `created_by = auth.uid()` et si le type est direct, ou si l'appelant est modérateur.
- `msg members ajout` : impose `user_id = auth.uid()` et `msg_member_ok(conversation_id, auth.uid())`.
- Trigger `msg_tr_direct` / `msg_guard_direct()` : verrouille la conversation ; exige le créateur comme premier membre ; limite le direct à deux membres ; sur le second membre appelle `msg_can_dm`.
- `msg_member_ok` : pour un direct, permet le créateur lorsque la conversation n'a aucun membre, puis un membre supplémentaire si l'autre membre satisfait `msg_can_dm`. Pour les groupes, contrôle la correspondance wilaya/niveau et, le cas échéant, filière.

La voie RPC n'est donc pas l'unique voie d'écriture : l'INSERT direct reste techniquement ouvert au rôle authenticated, sous les contrôles combinés RLS + trigger. La revue statique ne démontre pas la résistance aux courses ni à tous les scénarios d'abus.

## 3. Écart de blocage confirmé

La définition actuelle de `msg_not_blocked(cid, snd)` vérifie seulement si un membre de la conversation a bloqué l'expéditeur courant (`blocker_id = membre`, `blocked_id = auth.uid()`).

Elle ne vérifie pas le sens inverse : si l'expéditeur courant a bloqué un autre membre (`blocker_id = auth.uid()`, `blocked_id = membre`).

Autres constats concordants :

- La policy `msg messages envoi` appelle `msg_not_blocked`.
- `msg_open_direct`, `msg_can_dm`, `msg_member_ok` et `msg_guard_direct` ne consultent pas `msg_blocks`.
- La policy d'ajout de membres ne comporte pas de contrôle explicite de blocage.
- Aucune de ces fonctions ne consulte encore `social_blocks`.

**Conclusion sécurité :** le blocage bilatéral n'est pas garanti. Un blocage existant ne constitue pas actuellement une barrière centrale à la création/ouverture d'un DM. Le contrôle d'envoi ne couvre qu'un sens du blocage. Cela confirme un NO-GO pour annoncer le blocage bilatéral comme opérationnel et pour raccorder le nouveau réseau social au Messenger.

## 4. Policies et triggers recensés

Policies observées sur les tables Messenger : `msg_attachments` (SELECT/INSERT/UPDATE), `msg_blocks` (SELECT/INSERT/DELETE), `msg_conversations` (SELECT/INSERT), `msg_members` (SELECT/INSERT/DELETE), `msg_messages` (SELECT/INSERT/UPDATE), `msg_reports` (SELECT/INSERT/UPDATE), `msg_log` (SELECT).

Triggers non internes recensés :
- `msg_attachments` : `msg_tr_log_att`, `msg_tr_taille`.
- `msg_members` : `msg_tr_direct`.
- `msg_messages` : `msg_touch_conversation`, `msg_tr_log_del`, `msg_tr_rate`.
- `msg_reports` : `msg_tr_log_rep`.

Ce relevé est limité aux objets `msg_%` du schéma public et aux fonctions critiques nommées dans le contrat précédent ; il ne constitue pas un export exhaustif de toutes les dépendances SQL.

## 5. Matrice de statut

| Point | Statut |
|---|---|
| Définitions et signatures des fonctions ciblées | Vérifiées en lecture seule |
| Propriétaires, SECURITY DEFINER et search_path ciblés | Vérifiés |
| ACL explicites et EXECUTE effectif ciblés | Vérifiés |
| Policies RLS des tables msg_* | Inventoriées |
| Triggers non internes des tables msg_* | Inventoriés |
| RPC d'ouverture DM | Inspectée |
| INSERT direct membres/conversations | Privilèges, policy et trigger inspectés |
| Blocage bilatéral | Écart confirmé |
| Tests comportementaux RLS/concurrence | Non exécutés |
| Baseline SQL complète des 27 migrations | Toujours indisponible dans Git |

## Suite — Lot 401

Préparer une spécification corrective sans exécution : prédicat central de blocage bilatéral, contrôles identiques sur ouverture DM, ajout de membres et envoi, règle explicite de consentement Messenger, traitement des conversations historiques et tests négatifs isolés. Avant tout changement, il faudra retrouver les définitions SQL complètes et dépendances des autres fonctions appelées par ces chemins, puis disposer d'un PostgreSQL jetable fidèle et gratuit. Aucune dépense ou modification de production n'est autorisée.
