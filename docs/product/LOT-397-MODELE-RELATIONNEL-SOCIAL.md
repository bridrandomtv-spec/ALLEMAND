# Lot 397 — Modèle relationnel de ملتقى الطلاب

Date : 13 novembre 2026  
Statut : proposition d'architecture — document seulement, non déployée  
Base de référence : projet Supabase Free existant, inventaire catalogue en lecture seule

## 1. Décision d'architecture

Le réseau social **ملتقى الطلاب** doit être séparé fonctionnellement de **ماسنجر**, tout en partageant la même identité Auth et la table de profils existante.

Le modèle proposé couvre uniquement :
- préférences de découverte et visibilité sociale ;
- invitations de زمالة ;
- relations acceptées « زملائي » ;
- blocages sociaux ;
- signalements sociaux de profils ;
- réutilisation encadrée des notifications existantes.

Les publications, médias, commentaires, réactions, groupes d'étude et événements feront l'objet de modèles ultérieurs. Aucun de ces objets n'est créé dans ce lot.

## 2. Constat du schéma actif (catalogue uniquement)

L'inventaire du projet actif confirme :
- `public.profiles` existe avec `id`, `pseudo`, `role`, `niveau`, `filiere`, `wilaya`, `verif_statut`, `verif_by`, `verif_at`, `matricule` et `section`.
- `matricule` est présent dans le profil : il doit rester strictement privé et ne doit jamais apparaître dans l'annuaire ou les réponses publiques.
- `public.notifications` existe déjà avec `user_id`, `cle`, `payload`, `lue`, `created_at`. Il s'agit d'une table générique existante ; ne pas créer une seconde table de notifications sociales à ce stade.
- Messenger possède déjà `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports` et `msg_log`.
- `msg_blocks` et `msg_reports` ont un périmètre Messenger. Ils ne doivent pas être détournés pour représenter les relations sociales, ni leurs règles actuelles être présumées suffisantes pour le réseau social.
- Les tables `msg_*` restent hors périmètre de ce lot.

La vérification a porté sur les métadonnées de colonnes via `information_schema.columns` et l'inventaire des tables. Aucune ligne d'élève ni aucun contenu privé n'a été lu.

## 3. Modèle logique proposé

### 3.1 `social_profile_settings`

Une ligne par profil, avec FK `user_id -> profiles.id` et suppression en cascade seulement après validation de la politique de conservation.

Champs proposés :
- `user_id uuid PRIMARY KEY`
- `discoverable boolean NOT NULL DEFAULT false`
- `allow_contact_requests boolean NOT NULL DEFAULT true`
- `show_level boolean NOT NULL DEFAULT false`
- `show_wilaya boolean NOT NULL DEFAULT false`
- `show_filiere boolean NOT NULL DEFAULT false`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()`

La visibilité de l'établissement et tout statut de vérification ne sont pas exposés par défaut. Le numéro de matricule, les coordonnées et les justificatifs sont exclus du modèle public.

### 3.2 `social_invitations`

Une demande directionnelle entre deux profils :
- `id bigint GENERATED ... PRIMARY KEY`
- `sender_id uuid NOT NULL REFERENCES profiles(id)`
- `recipient_id uuid NOT NULL REFERENCES profiles(id)`
- `status text NOT NULL` avec valeurs strictes `pending`, `accepted`, `declined`, `cancelled`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `decided_at timestamptz NULL`
- `updated_at timestamptz NOT NULL DEFAULT now()`
- `idempotency_key uuid NULL` ou clé opaque équivalente, unique par expéditeur lorsque présente
- `pair_low uuid` et `pair_high uuid`, valeurs canoniques dérivées des deux profils pour garantir l'unicité de la paire non ordonnée

Contraintes :
- `sender_id <> recipient_id`
- `pair_low < pair_high`
- `pair_low = LEAST(sender_id, recipient_id)` et `pair_high = GREATEST(sender_id, recipient_id)` via contrainte vérifiable ou trigger strict.
- Un seul enregistrement `pending` par paire non ordonnée : index unique partiel sur `(pair_low, pair_high) WHERE status = 'pending'`.
- FK sur les deux profils ; index de liste par `recipient_id, created_at DESC` et `sender_id, created_at DESC`.
- Les transitions d'état sont limitées au contrat du Lot 396 ; aucun client ne peut modifier librement expéditeur, destinataire, paire ou état.
- Une demande inverse pendant qu'une demande est en attente ne crée pas une deuxième ligne ; elle retourne l'état de la demande existante sans révéler d'informations supplémentaires.
- Les états terminaux sont conservés pour l'audit. Une nouvelle demande après refus dépend du délai anti-harcèlement.

### 3.3 `social_contacts`

La relation acceptée, distincte de la demande historique :
- `user_low_id uuid NOT NULL REFERENCES profiles(id)`
- `user_high_id uuid NOT NULL REFERENCES profiles(id)`
- `created_at timestamptz NOT NULL DEFAULT now()`
- clé primaire composite `(user_low_id, user_high_id)`
- contrainte `user_low_id < user_high_id`
- index inverse utile pour retrouver les contacts d'un membre.

Cette table ne contient aucune conversation, aucun message et aucun droit implicite d'envoyer un DM. Elle est créée transactionnellement à l'acceptation, une seule fois. Le retrait d'une relation supprime ou clôt la relation selon la politique de conservation qui sera validée ; l'historique des invitations demeure.

### 3.4 `social_blocks`

Blocage social dirigé :
- `blocker_id uuid NOT NULL REFERENCES profiles(id)`
- `blocked_id uuid NOT NULL REFERENCES profiles(id)`
- `created_at timestamptz NOT NULL DEFAULT now()`
- clé primaire composite `(blocker_id, blocked_id)`
- contrainte `blocker_id <> blocked_id`
- index sur `blocked_id` pour contrôler rapidement les blocages dans les deux sens.

Le contrôle d'interaction doit rechercher A→B **et** B→A. Créer un blocage neutralise les invitations en attente entre les deux comptes et retire la relation sociale selon une opération atomique. Un blocage social doit également être pris en compte par les contrôles Messenger ; la table `msg_blocks` existante ne doit pas être supposée équivalente sans audit et adaptation distincts.

### 3.5 `social_reports`

Signalement de profil :
- `id bigint GENERATED ... PRIMARY KEY`
- `reporter_id uuid NOT NULL REFERENCES profiles(id)`
- `target_profile_id uuid NOT NULL REFERENCES profiles(id)`
- `category text NOT NULL` avec liste contrôlée : harcèlement, usurpation, contenu inapproprié, spam, menace, autre
- `note text NULL` avec longueur maximale stricte et avertissement de ne pas inclure de données sensibles
- `status text NOT NULL DEFAULT 'open'` avec états de modération contrôlés
- `created_at timestamptz NOT NULL DEFAULT now()`
- `handled_by uuid NULL`, `handled_at timestamptz NULL`

Contraintes : auteur différent de la cible ; limitation anti-abus par compte et période ; un élève ne lit que ses propres signalements et ne peut ni les traiter ni changer leur statut. La modération est réservée à un rôle serveur vérifié, avec audit. Les signalements de publications/commentaires seront conçus lorsque ces tables existeront, avec des FK réelles plutôt qu'un identifiant polymorphe non vérifiable.

## 4. Relations et cardinalités

- `profiles 1 — 0..1 social_profile_settings`
- `profiles 1 — N social_invitations` comme expéditeur et comme destinataire
- `profiles N — N profiles` via `social_contacts`, paire canonique
- `profiles 1 — N social_blocks` comme auteur et comme cible
- `profiles 1 — N social_reports` comme déclarant et comme profil signalé
- `notifications.user_id -> profiles.id` reste le canal de notification existant.

## 5. Politique RLS attendue (à concevoir et tester, pas à appliquer)

Toutes les nouvelles tables du schéma exposé `public` devront avoir RLS activée avant tout accès Data API.

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| social_profile_settings | propriétaire seulement | propriétaire seulement | propriétaire, colonnes autorisées uniquement | propriétaire ou processus de suppression encadré |
| social_invitations | expéditeur ou destinataire seulement | expéditeur authentifié, identité dérivée de `auth.uid()` | destinataire pour accepter/refuser ; expéditeur pour annuler, avec transition validée | aucun accès direct |
| social_contacts | l'un des deux membres | aucun accès direct ; création par opération d'acceptation atomique | aucun | aucun accès direct ; retrait par opération contrôlée |
| social_blocks | auteur du blocage seulement | `blocker_id = auth.uid()` | aucun | auteur du blocage seulement |
| social_reports | déclarant seulement ; modération selon rôle validé côté serveur | déclarant authentifié | modération uniquement | aucun accès direct |

Règles techniques :
- Les politiques combinent `TO authenticated` avec des prédicats de propriété ; le rôle seul n'est jamais une autorisation suffisante.
- Les décisions utilisent `auth.uid()`, jamais un `actor_id` fourni par le navigateur.
- Les mises à jour vérifient à la fois `USING` et `WITH CHECK`.
- Aucune décision d'autorisation ne repose sur `user_metadata` modifiable par l'utilisateur.
- Pas de vue publique brute sur `profiles`. L'annuaire passe par une projection minimale contrôlée, limitée aux champs dont la visibilité est autorisée.
- Toute fonction privilégiée éventuelle devra être justifiée, à privilèges minimaux, avec `search_path` fixé, vérification de l'identité, EXECUTE restreint et tests d'abus. Préférer SECURITY INVOKER et ne pas ajouter de SECURITY DEFINER par commodité.
- Pas de policy permissive générique, pas de lecture de masse, pas de recherche par email, téléphone, matricule ou UUID.

## 6. Notifications

Réutiliser `public.notifications` après audit de ses policies et consommateurs applicatifs :
- clés de type explicites, par exemple `social_invitation_received`, `social_invitation_accepted`, `social_contact_removed` ;
- `user_id` est toujours le destinataire ;
- payload minimal : identifiant de l'objet social et libellés non sensibles ; aucune donnée privée de profil ;
- seules les fonctions serveur fiables écrivent les notifications d'événements sociaux ;
- le propriétaire peut lire et marquer ses notifications comme lues ;
- aucun changement des notifications administratives existantes sans compatibilité vérifiée.

## 7. Transactions et invariants critiques

1. Envoi : vérifier compte autorisé, découverte active du destinataire, préférence de demandes, absence de blocage dans les deux sens, quotas, absence de contact et absence de demande active.
2. Acceptation : vérifier que l'acteur est le destinataire, statut pending, aucun blocage, puis transition + insertion idempotente du contact + notification dans une seule transaction.
3. Refus/annulation : acteur et état vérifiés ; conserver l'historique.
4. Blocage : insertion idempotente, neutralisation des invitations en attente et retrait de contact dans la même transaction.
5. Aucune opération de relation sociale ne crée ou n'ouvre de conversation Messenger.
6. Réponses publiques génériques pour les cibles inexistantes, non découvrables ou protégées afin de limiter l'énumération.
7. Pagination bornée, quotas configurables, limitation de débit et journalisation minimale sans contenu privé.

## 8. Index à prévoir

- `social_invitations(recipient_id, created_at DESC)`
- `social_invitations(sender_id, created_at DESC)`
- index unique partiel `social_invitations(pair_low, pair_high) WHERE status = 'pending'`
- `social_contacts(user_low_id, created_at DESC)` et `social_contacts(user_high_id, created_at DESC)`
- `social_blocks(blocker_id, blocked_id)` (PK) et index `social_blocks(blocked_id, blocker_id)`
- `social_reports(reporter_id, created_at DESC)`, `social_reports(status, created_at DESC)` réservé au traitement autorisé
- `social_profile_settings(discoverable)` seulement si le plan de requête de l'annuaire le justifie ; ne pas indexer chaque booléen sans mesure.

## 9. Points non décidés / à valider

- Durée de conservation des invitations refusées/annulées et des relations retirées.
- Politique de suppression de compte et anonymisation des signalements.
- Autorité et source officielle permettant de confirmer le lycée d'inscription ; aucun champ actuel ne prouve à lui seul l'établissement.
- Règles de modération applicables aux mineurs et procédure d'escalade.
- Seuils de quotas et de refroidissement, à calibrer sur données synthétiques.
- Compatibilité exacte des notifications existantes et leurs policies.
- Intégration des blocages sociaux dans Messenger, après audit des fonctions `msg_*`.

## 10. Validation effectuée et limites

- Lecture de métadonnées uniquement : tables, colonnes, types, nullabilité et clés exposées par l'inventaire.
- Contrôle ciblé de `profiles`, `notifications` et des tables Messenger via `information_schema.columns`.
- Aucun SELECT de lignes d'élèves ou de messages.
- Aucun DDL, INSERT, UPDATE, DELETE, RPC, GRANT, policy, changement Auth/RLS/Storage/Realtime.
- Aucun test comportemental PostgreSQL/RLS ; aucun environnement local fidèle disponible dans le cadre gratuit vérifié.
- Aucun CI hébergé, déploiement, merge ou dépense.

### Prochaine étape — Lot 398

Faire une revue de compatibilité applicative en lecture seule : identifier les consommateurs actuels de `notifications`, les fonctions et policies de `msg_blocks`, puis concevoir le contrat d'intégration du blocage social avec Messenger sans modifier le runtime ni la base active. Maintenir l'interdiction de DM automatique après acceptation d'une زمالة.
