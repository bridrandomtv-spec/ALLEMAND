# LOT 348 — Cartographie exhaustive des points d'entrée Messenger

Date : 12 novembre 2026  
Périmètre : dépôt GitHub sur la branche de travail + comparaison ciblée au catalogue Supabase actif (lecture seule).

## Décision

**NO-GO : le consentement à l'ouverture d'un DM n'est pas garanti côté serveur.** La recherche confirme plusieurs voies indépendantes de l'interface. Le lot est documentaire et ne modifie ni code applicatif ni base active.

## 1. Points d'entrée applicatifs identifiés

| Méthode client | Opération | Autorisation attendue |
|---|---|---|
| `msgConvs()` | SELECT conversations | RLS membre/modérateur |
| `msgMessages()` | SELECT messages | RLS membre/modérateur |
| `msgSend()` | INSERT message | RLS expéditeur/membre/blocage |
| `msgCanDm()` | RPC de pré-vérification | `msg_can_dm` |
| `msgOpenDirect()` | recherche d'un DM partagé existant | n'insère plus de DM |
| `msgGroups()` | SELECT groupes | RLS |
| `msgCreateGroup()` | INSERT groupe | policy modérateur |
| `msgBlock()/msgUnblock()` | INSERT/DELETE blocage | RLS propriétaire |
| `msgUpload()` | Storage upload puis INSERT métadonnées | Storage RLS + table RLS |
| `msgReport()/msgHandle()` | signalement/modération | RLS |
| `msgEdit()/msgDelete()` | UPDATE message | RLS |
| `msgSubscribe()` | Realtime INSERT messages | publication + RLS |

La vue `msg.js` ne fait pas d'écriture directe sur les tables `msg_*` : elle passe par `window.SB`. La vue présente les DM existants et n'offre pas de recherche nationale ni de flux d'invitations. La création de groupe est exposée uniquement dans le bloc d'interface prof/admin, et la policy serveur exige un modérateur.

## 2. Voies de création DM encore ouvertes

### A. RPC `msg_open_direct(uuid)`

- `SECURITY DEFINER`, exécutable par `authenticated`.
- Vérifie `msg_can_dm`, verrouille la paire, crée le DM et les deux memberships.
- Aucun contrôle d'invitation/consentement.
- Le client ne l'appelle plus, mais un appel RPC direct reste possible.

### B. INSERT direct `msg_conversations`

Policy active : créateur authentifié autorisé si `created_by=auth.uid()` et `type='direct'` (ou modérateur pour groupe). Cela permet de créer la coquille du DM directement.

### C. INSERT direct `msg_members`

Policy active : `auth.uid()=user_id AND msg_member_ok(conversation_id,auth.uid())`. La fonction vivante `msg_member_ok` a été renforcée par rapport au fichier du dépôt :
- premier membre : seul le créateur peut s'ajouter si la conversation n'a encore aucun membre ;
- deuxième membre : peut s'ajouter lui-même si un seul membre existe déjà et si `msg_can_dm` le permet ;
- aucun état d'invitation n'est consulté.

La combinaison A/B/C permet donc encore de construire un DM sans invitation acceptée.

## 3. Écart critique entre dépôt et base vivante

Le fichier versionné `supabase/msg_schema.sql` contient une version ancienne de `msg_member_ok` qui accepte un membre pour un DM sans contrôler le nombre de membres ni l'identité du créateur.

L'archive `docs/architecture/migration-archive/20261030132512_close_direct_chat_join_and_lock_trigger_functions.sql` contient la version renforcée qui correspond à la fonction actuellement observée en base. La base vivante a donc une protection plus stricte que le schéma versionné, mais cette protection n'exige toujours pas d'invitation acceptée.

Le dépôt et la base ne sont pas équivalents : réappliquer le schéma versionné pourrait réintroduire une version moins restrictive. L'archive de migration est une preuve de provenance, pas un mécanisme de déploiement ni une chaîne complète de migrations reproductibles.

## 4. Autres voies et limites

- `msgCreateGroup()` effectue un INSERT direct dans `msg_conversations`, mais avec `type='groupe'`. La policy serveur active réserve cette création aux modérateurs. Ne pas confondre cette voie de groupe avec l'ouverture d'un DM.
- `msgSend()` insère directement un message, mais RLS exige le compte expéditeur, l'appartenance à la conversation et `msg_not_blocked`. Cette voie ne crée pas elle-même une conversation.
- `msgUpload()` téléverse dans le bucket privé puis insère les métadonnées ; les deux contrôles sont distincts. La policy vivante impose notamment message non nul, membre, chemin sous `msg/{conversation}/{uid}-...`, statut pending, MIME allowlist et taille max 5 Mio.
- `msg.js` ne réalise pas de requêtes directes vers les tables Messenger. Aucun autre appelant client n'a été trouvé dans les fichiers ciblés de ce lot ; la cartographie n'est pas une preuve formelle d'absence de code dynamique ou de consommateurs externes.

## 5. Tests et CI : lacune

Les tests `tests/msg_test.mjs` et `ci/check-msg.mjs` vérifient principalement des chaînes dans le schéma et l'absence d'INSERT DM dans la méthode client `msgOpenDirect()`. Ils ne démontrent pas :
- que la RPC `msg_open_direct` rejette un appel sans invitation ;
- que l'INSERT direct conversation + memberships est refusé ;
- que les états pending/accepted/declined/cancelled/expired sont correctement imposés ;
- que les appels directs RPC/REST ne contournent pas l'interface ;
- que les courses concurrentes ne créent pas de doublons ou de memberships incohérents.

Les tests statiques doivent être complétés par des tests PostgreSQL multi-comptes sur environnement isolé avant toute migration.

## 6. Contrat cible à implémenter plus tard

1. Une seule opération serveur autorisée à créer/ouvrir un nouveau DM : `msg_direct_open_from_accepted_invite(invite_id)`.
2. Aucune création DM via INSERT client sur `msg_conversations`.
3. Aucun auto-ajout direct d'un membre dans un DM via `msg_members`.
4. Acceptation par le destinataire seulement, avec transaction et verrouillage de l'invitation.
5. Revalidation dans la transaction : identité du destinataire, statut pending, échéance, affiliation officielle active, blocage dans les deux sens, absence de révocation.
6. Création atomique conversation + exactement deux membres + événement d'audit.
7. Idempotence sur double clic, retry réseau et appels concurrents.
8. Préserver les DM historiques ; ne pas les convertir implicitement en invitations acceptées.
9. Tester explicitement les voies RPC, REST, RLS, triggers, Storage et Realtime dans PostgreSQL isolé.

## 7. Garde-fous

- Aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage ou déploiement.
- Aucun contenu privé ni données personnelles consultés.
- Pas de ressource Supabase payante créée.
- PR #17 reste ouverte et non fusionnée ; `main` non modifiée.
- MFA/2FA et facturation hors périmètre.
