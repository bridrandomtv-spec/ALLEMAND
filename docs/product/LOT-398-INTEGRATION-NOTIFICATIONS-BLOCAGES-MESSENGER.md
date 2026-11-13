# Lot 398 — Compatibilité notifications et blocages sociaux / Messenger

Date : 13 novembre 2026  
Statut : audit en lecture seule et contrat d'intégration proposé — aucune modification runtime ou SQL

## 1. Périmètre et décision

Ce lot vérifie les consommateurs actuels de `public.notifications`, les appels de blocage Messenger et les politiques/fonctions PostgreSQL actives. Il prépare l'interopérabilité entre `ملتقى الطلاب` et `ماسنجر`.

Décisions :
- Conserver `public.notifications` comme table de notifications persistantes existante ; ne pas créer de table parallèle.
- Conserver `msg_blocks` pour les blocages historiques propres à Messenger.
- Ajouter, ultérieurement et après autorisation, un contrôle centralisé qui consulte les blocages Messenger **et** sociaux dans les deux sens.
- Ne pas écrire dans les deux tables de blocage depuis le navigateur pour tenter de synchroniser les états.
- Ne jamais créer un DM lors de l'acceptation d'une invitation sociale.
- Aucun changement de base ou de code d'exécution dans ce lot.

## 2. Consommateurs actuels de notifications

### 2.1 Notifications persistées Supabase

Dans `supabase/supabase.js` :
- `myNotifications()` lit `notifications`, ordonne par `created_at DESC` et limite à 30.
- `notifMarkRead(id)` met `lue=true` sur la ligne identifiée.
- Ces fonctions sont exposées dans `window.SB`.

Dans `app.js` :
- Le panneau d'administration de notifications utilise `SB.myNotifications()`.
- Le marquage utilise `SB.notifMarkRead(id)`.
- Le tableau de bord étudiant affiche un compteur via `DZ_INTERACTIONS.unreadCount()`, qui n'est pas un compteur Supabase.

Policies actives lues via `pg_policies` :
- SELECT `notifications propres` : `user_id = auth.uid()`.
- UPDATE `notifications marquage propre` : `USING (user_id = auth.uid())` et `WITH CHECK (user_id = auth.uid())`.

Conclusion : la requête JS ne contient pas de filtre explicite `user_id`, mais la policy SELECT active limite les lignes visibles à l'utilisateur authentifié. Le marquage par ID est également limité par la policy UPDATE. Ce verrouillage dépend donc de la bonne conservation des policies ; les filtres client explicites par propriétaire seraient une défense en profondeur utile, mais aucun changement n'est fait ici.

### 2.2 Notifications locales DZ_INTERACTIONS

`dz-interactions.js` stocke ses notifications dans `localStorage`, avec une clé `dz_de_notifications_v1:<compte>`. Il affiche le centre d'alertes, permet de marquer comme lu et calcule le compteur local.

Ce système est distinct de la table Supabase `notifications`. Il ne constitue pas le canal persistant inter-appareils pour les invitations sociales. Les événements sociaux devront utiliser la table persistante existante, puis une couche d'affichage synchronisée, sans confondre les notifications locales d'interface avec les notifications serveur.

### 2.3 Contrat recommandé des événements sociaux

Types proposés : `social_invitation_received`, `social_invitation_accepted`, `social_invitation_declined`, `social_contact_removed`.

Payload minimal : identifiant de l'invitation ou relation, type d'événement et horodatage utile. Aucun email, téléphone, matricule, UUID de profil cible, justificatif ou donnée privée dans le payload présenté au client.

Les notifications sociales ne doivent être créées qu'après validation serveur de la transaction correspondante. L'utilisateur destinataire ne peut lire et marquer comme lues que ses propres notifications.

## 3. Blocage Messenger — état réel observé

### 3.1 Client

Dans `supabase/supabase.js` :
- `msgBlock(otherId)` insère `{ blocker_id: auth.uid(), blocked_id: otherId }` dans `msg_blocks`.
- `msgUnblock(otherId)` supprime uniquement la ligne dont `blocker_id` est le compte courant et `blocked_id` la cible.
- Ces méthodes sont exposées via `window.SB`.

Aucun code de blocage n'a été trouvé dans `msg.js` lui-même lors de la recherche ciblée ; l'action de blocage est encapsulée dans le client Supabase. Ce constat ne signifie pas qu'aucun composant chargé dynamiquement ne l'appelle.

### 3.2 Policies actives sur `msg_blocks`

- INSERT : `auth.uid() = blocker_id`.
- SELECT : auteur du blocage, personne bloquée ou modérateur.
- DELETE : auteur du blocage.
- Aucune policy UPDATE observée.

Ces policies limitent la manipulation directe des lignes, mais la lecture autorisée à la personne bloquée ne doit pas être utilisée comme mécanisme d'annuaire ou de découverte.

### 3.3 Fonction critique `msg_not_blocked(cid, snd)`

La définition active vérifiée est SECURITY DEFINER, STABLE, avec `search_path = pg_catalog, public`. Elle vérifie que :
- l'utilisateur est authentifié ;
- `snd = auth.uid()` ;
- aucun membre de la conversation ne possède un blocage `blocker_id = membre` et `blocked_id = snd`.

La policy INSERT de `msg_messages` appelle cette fonction.

**Limite de couverture constatée :** le prédicat cherche les blocages dirigés d'un membre vers l'expéditeur courant. Il ne vérifie pas explicitement le sens inverse, c'est-à-dire un expéditeur qui aurait lui-même bloqué un autre membre. Il ne consulte pas non plus le futur blocage social `social_blocks`.

### 3.4 Fonction d'ouverture `msg_open_direct(p_other)`

La fonction active :
- exige une session et un destinataire différent ;
- appelle `msg_can_dm(v_uid, p_other)` ;
- réutilise ou crée une conversation directe et ajoute les deux membres.

La fonction `msg_can_dm` vérifie actuellement la vérification de profil et l'égalité wilaya/niveau/filière. Elle ne consulte ni `msg_blocks`, ni un blocage social, ni une invitation sociale acceptée.

C'est une lacune à traiter avant l'ouverture nationale du Messenger. Le contrat social ne doit pas être utilisé comme autorisation de DM tant que le modèle et la règle nationale n'ont pas été validés.

## 4. Contrat d'intégration cible — non exécuté

Créer un unique prédicat serveur de type `social_interaction_allowed(actor, target, context)` (nom indicatif) dans un schéma interne approprié, ou une fonction existante renforcée après audit.

Il devra :
1. refuser les identités nulles, identiques ou non autorisées ;
2. vérifier `msg_blocks(actor, target)` et `msg_blocks(target, actor)` ;
3. vérifier `social_blocks(actor, target)` et `social_blocks(target, actor)` ;
4. échouer en mode fermé si les contrôles ne peuvent être évalués ;
5. ne jamais exposer à l'appelant l'existence d'un blocage posé par l'autre compte ;
6. s'appliquer à l'envoi de messages, à l'ouverture d'un DM, aux invitations sociales et aux actions d'interaction pertinentes ;
7. distinguer les autorisations : être contact social n'autorise pas à lui seul un DM ; une règle de messagerie séparée doit être satisfaite ;
8. rester transactionnel avec les opérations sensibles et être testé sous `authenticated` avec des identités synthétiques.

Les opérations de blocage devront être atomiques côté serveur : enregistrer le blocage, annuler les invitations en attente entre les deux comptes et retirer la relation sociale existante selon la politique approuvée. Aucun DM ne doit être créé, fermé ou supprimé implicitement sans politique spécifique ; les messages historiques et pièces jointes nécessitent une règle de conservation distincte.

## 5. Matrice de tests obligatoire avant activation

| Scénario | Résultat attendu |
|---|---|
| A bloque B dans Messenger ; A tente d'écrire à B | refus |
| A bloque B dans Messenger ; B tente d'écrire à A | refus |
| A bloque B dans le social ; A tente d'écrire à B | refus |
| A bloque B dans le social ; B tente d'écrire à A | refus |
| Blocage A→B, requête d'ouverture directe dans les deux sens | refus, aucune nouvelle conversation |
| A et B sont contacts sociaux sans invitation Messenger autorisée | aucun DM automatique |
| Invitation sociale en attente ; A ou B bloque l'autre | invitation neutralisée atomiquement |
| A débloque B mais B bloque toujours A | interaction toujours refusée |
| B tente de déterminer si A l'a bloqué | réponse générique, aucune fuite |
| Notification sociale de A vers B | seul B peut la lire et la marquer comme lue |
| B tente de marquer comme lue la notification de A | aucune ligne modifiée |
| Compte anonyme tente une action | refus |

Tests additionnels requis : doublons, concurrence, transaction interrompue, suppression de compte, comptes non vérifiés, modérateur, pagination et limites de débit.

## 6. Risques et ordre de correction

Priorité P0 avant activation sociale :
1. Définir et implémenter le prédicat bilatéral unifié de blocage.
2. Le brancher à l'ouverture de DM et à l'envoi de message, sans contourner les contrôles d'invitation et de vérification.
3. Faire converger le flux de blocage social et Messenger vers une opération serveur atomique.
4. Vérifier que les notifications sociales ne sont émises qu'après commit et sont protégées par les policies existantes.

Priorité P1 :
- ajouter un filtre propriétaire explicite côté client pour `myNotifications()` en défense en profondeur ;
- remplacer progressivement les notifications locales qui prétendent être persistantes par une source serveur lorsque le besoin est confirmé ;
- ajouter tests de non-régression pour le panneau administratif et le compteur étudiant.

## 7. Limites de l'audit

- Code consulté sur la branche `design/prototypes-67-74-alignment` : `app.js`, `dz-interactions.js`, `msg.js`, `supabase/supabase.js`.
- Métadonnées et définitions SQL lues dans le catalogue actif : `pg_policies`, `pg_proc`, `information_schema`.
- Aucun contenu de message, notification ou profil d'élève n'a été lu.
- Aucun INSERT, UPDATE, DELETE, DDL, RPC, GRANT, changement de policy, Auth, Storage ou Realtime.
- Aucun test comportemental PostgreSQL/RLS n'a été exécuté.
- Aucun CI hébergé, déploiement, merge ou dépense.

## 8. Suite proposée — Lot 399

Réaliser une spécification de migration progressive et un plan de tests isolés pour le prédicat de blocage bilatéral et l'ouverture de DM. Le document devra distinguer les écarts confirmés, les hypothèses, les prérequis d'invitation et les tests impossibles tant qu'aucun environnement PostgreSQL isolé gratuit et fidèle n'est disponible.
