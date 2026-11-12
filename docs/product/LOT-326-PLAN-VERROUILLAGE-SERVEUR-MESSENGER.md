# Lot 326 — plan de verrouillage serveur Messenger

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Type : plan de migration et protocole de validation ; aucun SQL exécutable livré ou appliqué.

## 1. Objectif

Préparer la fermeture des créations DM et adhésions directes depuis PostgREST, sans interrompre les groupes officiels et les conversations historiques. Le futur système ne crée un DM que par acceptation explicite d'une invitation, traitée dans une transaction serveur.

## 2. État de départ vérifié

Dans `supabase/msg_schema.sql` :
- policy `msg conv creation` autorise actuellement l'INSERT authentifié si `created_by = auth.uid()` et si le type est `direct` ou si le créateur est modérateur ;
- policy `msg members ajout` autorise l'INSERT si `auth.uid() = user_id` et `msg_member_ok` retourne vrai ;
- `msg_member_ok` accepte tout type `direct` sans invitation ;
- `msg_guard_direct` vérifie la compatibilité scolaire uniquement si un autre membre est déjà visible au moment du trigger ;
- `msg_can_dm` impose encore wilaya+niveau+filière communs et `verif_statut='verifie'` ;
- le client Lot 324 n'insère plus directement ni conversation DM ni membre destinataire, mais le schéma serveur n'est pas encore fermé.

## 3. Protocole cible, par phases

### Phase A — inventaire préalable en lecture seule

Avant de rédiger la migration :
1. Exporter les policies réelles sur `msg_conversations`, `msg_members`, `msg_messages`, `profiles` et `storage.objects`.
2. Relever les grants de tables, séquences, fonctions et rôles effectifs (authenticated, anon, PUBLIC).
3. Relever les fonctions `SECURITY DEFINER`, leur propriétaire, leur `search_path`, les EXECUTE grants et leurs appels transitifs.
4. Vérifier les dépendances de l'interface et des workflows de modération.
5. Faire l'inventaire des DM historiques : conversations avec 0, 1, 2 ou plus de deux membres ; ne jamais corriger ou supprimer automatiquement les données.

**Arrêt obligatoire** si la réalité de la base diverge du dépôt ou si les propriétaires/grants des fonctions ne sont pas compris.

### Phase B — conception du schéma invitations

Table logique proposée `msg_invites` :
- identifiant interne ;
- `sender_id`, `recipient_id` ;
- état contrôlé par contrainte ;
- dates de création, expiration et décision ;
- `conversation_id` nullable, unique lorsqu'il est renseigné ;
- clé d'idempotence opaque ;
- version de la règle d'éligibilité et référence d'affiliation institutionnelle, sans copie de données personnelles sensibles ;
- journal de décision séparé ou événement append-only.

Contraintes :
- sender différent du recipient ;
- une seule invitation active équivalente pour une paire orientée ;
- pas de transition d'état depuis le client ;
- l'ID de conversation ne devient disponible qu'après acceptation ;
- les invitations expirées/refusées/annulées ne peuvent pas être réactivées.

Le modèle doit définir explicitement si une invitation inverse est autorisée lorsqu'une invitation est déjà en attente dans l'autre sens. Choix recommandé : retourner l'invitation existante à l'expéditeur concerné ou permettre une acceptation réciproque contrôlée, sans créer deux conversations.

### Phase C — fermeture des chemins d'écriture directs

La migration future devra :
- refuser les INSERT client dans `msg_conversations` de type direct ;
- refuser les INSERT client dans `msg_members` pour tout DM ;
- ne pas autoriser l'auto-ajout à un DM, même pour un UUID de conversation connu ;
- maintenir un chemin d'administration distinct pour les groupes officiels ;
- ne pas exposer de fonction générique permettant au client de fournir librement les deux membres ;
- ne jamais utiliser une clé `service_role` dans le navigateur.

Ne pas supprimer globalement les droits des groupes avant d'avoir identifié les appels existants qui en dépendent.

### Phase D — RPC d'acceptation transactionnelle

L'opération d'acceptation doit :
1. établir l'identité avec `auth.uid()` ; ne jamais prendre sender/recipient depuis le client ;
2. verrouiller l'invitation avec `SELECT ... FOR UPDATE` ;
3. vérifier que l'appelant est le destinataire ;
4. vérifier l'état `pending` et l'expiration ;
5. revérifier affiliation institutionnelle active des deux comptes ;
6. revérifier les blocages dans les deux sens ;
7. appliquer les limites de fréquence et règles de sécurité ;
8. créer une seule conversation `direct` ;
9. insérer exactement les deux membres ;
10. lier la conversation à l'invitation et écrire l'événement d'audit ;
11. retourner le même résultat en cas de nouvel appel idempotent.

Toute erreur doit annuler l'ensemble de la transaction. La concurrence doit être couverte par verrouillage de l'invitation, contraintes uniques et test multi-session PostgreSQL. Ne pas dépendre d'un trigger qui recherche simplement si l'autre membre est visible.

### Phase E — vérification de blocage

La règle de blocage doit être explicitement définie pour les conversations directes :
- A bloque B : A et B ne peuvent plus initier de nouvelle invitation ;
- B bloque A : même résultat ;
- blocage créé après acceptation : politique de conversation existante documentée (arrêt des envois, archivage ou maintien de lecture selon décision produit) ;
- groupe partagé : le blocage ne doit pas supprimer les droits des autres membres ni permettre un contournement par DM.

Le contrôle doit vérifier les deux orientations de la paire, sans transformer un blocage individuel en interdiction globale d'un groupe.

### Phase F — tests PostgreSQL réels

Tests obligatoires avec deux sessions concurrentes et comptes synthétiques :
- INSERT direct REST de conversation DM refusé ;
- auto-ajout à un DM refusé ;
- ajout d'un tiers dans `msg_members` refusé ;
- acceptation par un tiers ou l'expéditeur refusée ;
- invitation expirée/refusée/annulée non convertible en DM ;
- double acceptation concurrente = une conversation et deux membres exactement ;
- échec en cours de transaction = aucune ligne partielle ;
- blocage A→B et B→A testés ;
- affiliation révoquée avant acceptation = refus ;
- les groupes officiels et leurs droits préexistants continuent de fonctionner ;
- un non-membre ne lit pas conversation, membres, messages ou pièces jointes ;
- contrôle des grants et EXECUTE des fonctions, pas seulement des policies.

Les tests statiques Node existants sont utiles mais ne remplacent pas cette suite PostgreSQL.

## 4. Dépendance registre national

Le verrouillage des DM ne rend pas automatiquement l'annuaire national fiable. Avant l'activation des invitations inter-lycées, chaque compte éligible doit être lié à une inscription officielle active : établissement canonique, année scolaire, niveau, filière/classe, source et décision de validation. Le matricule saisi par l'élève ne constitue pas cette preuve.

Le registre doit distinguer le validateur institutionnel du modérateur Messenger et de l'administrateur technique. Aucun professeur ne doit pouvoir valider des élèves d'établissements hors de son périmètre.

## 5. Stratégie de compatibilité

- Conserver les conversations historiques et leurs membres.
- Ne pas convertir automatiquement les anciens DM en invitations acceptées.
- Inventorier et signaler les conversations directes qui ont moins ou plus de deux membres.
- Prévoir une stratégie de lecture des conversations historiques, sans réouvrir leur création.
- Déployer les protections et les opérations serveur dans un ordre qui évite une période où le client peut écrire mais le serveur refuse les opérations nécessaires.
- Tester le rollback sur une base jetable avant toute intervention réelle.

## 6. Conditions d'autorisation avant toute migration

Ce document n'autorise aucune opération sur la base. Avant une migration :
- le propriétaire valide explicitement le périmètre SQL/RLS/GRANT ;
- la divergence dépôt/base est documentée ;
- la migration est revue et testée sur PostgreSQL jetable ;
- le plan de sauvegarde et de retour arrière est validé ;
- l'impact sur les groupes et conversations existants est accepté.

## 7. Garde-fous de travail

Aucune exécution Supabase, aucune migration, aucune écriture Auth/RLS/GRANT/Storage, aucun déploiement, aucun merge et aucun changement de `main`. PR #17 reste ouverte. Aucun MFA/2FA et aucune facturation.
