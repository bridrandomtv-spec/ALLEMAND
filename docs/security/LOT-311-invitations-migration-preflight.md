# Lot 311 — prérequis de migration des invitations Messenger

Date : 12 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Statut : **préparation technique — migration non exécutable / NO-GO**

## Décision

Le cycle d'invitation est défini, mais le schéma versionné ne contient pas encore toutes les données d'autorité nécessaires pour autoriser en sécurité une découverte nationale entre élèves. Ce lot prépare le contrat et les tests ; il ne livre pas de SQL prêt à appliquer. Ne pas créer une table ou des RPC avant de résoudre les dépendances listées ci-dessous.

## Vérifications du schéma versionné

- `public.profiles` contient notamment `id`, `pseudo`, `role`, `niveau`, `filiere`, `wilaya` et les champs de vérification `verif_statut`, `verif_by`, `verif_at`.
- Le schéma ne démontre pas de relation d'inscription institutionnelle canonique entre un élève et un lycée (identifiant d'établissement stable), ni de préférence de réception des invitations.
- Le schéma examiné ne définit pas de statut de suspension de compte exploitable par le flux d'invitation.
- `msg_blocks` fournit déjà le blocage bilatéral à consulter côté serveur.
- `msg_conversations` et `msg_members` existent ; le DM doit être créé et ses deux membres ajoutés dans une transaction uniquement après acceptation.
- `msg_can_dm` exige actuellement wilaya, niveau et filière identiques, ainsi que des profils vérifiés dans sa dernière définition. Cette règle empêche le réseau national inter-wilayas souhaité ; la remplacer sans preuve d'affiliation scolaire serait une ouverture trop large.

## Décisions produit à respecter

1. Un élève peut découvrir un autre élève vérifié dans le réseau national uniquement si son affiliation à un lycée est confirmée par une source institutionnelle fiable.
2. La découverte ne retourne qu'un profil minimal : identifiant opaque, pseudo public, lycée et wilaya autorisés à l'affichage. Aucun email, téléphone, date de naissance, notes, informations parentales ou données privées.
3. La recherche doit être paginée, limitée en fréquence et protégée contre l'énumération. Pas de téléchargement de l'annuaire complet.
4. Une invitation `pending` ne crée ni conversation, ni adhésion, ni capacité d'envoyer un message au destinataire.
5. Seul le destinataire accepte/refuse ; seul l'expéditeur annule ; transitions idempotentes et terminales.
6. Les blocages dans les deux sens empêchent la création et l'acceptation. Une invitation active par paire, dans un seul sens canonique, au maximum.
7. Professeurs, administration et parents ne sont pas implicitement inclus dans le DM étudiant↔étudiant ; leurs matrices d'accès restent séparées.

## Contrat de données envisagé (non SQL exécutable)

Table `msg_invites` :
- `id` UUID ; `sender_id` et `recipient_id` références `auth.users` ;
- `status` limité à `pending | accepted | declined | cancelled | expired` ;
- `conversation_id` nullable jusqu'à acceptation ;
- `created_at`, `responded_at`, `expires_at` ;
- contrainte `sender_id <> recipient_id`, index destinataire/statut/date et index expéditeur/statut/date ;
- unicité d'une paire normalisée pour les invitations encore `pending` (à implémenter par index partiel ou stratégie transactionnelle vérifiée).

Mutations exclusivement via RPC transactionnelles contrôlées :
- `msg_invite_create(target_user_id)`
- `msg_invite_respond(invite_id, decision)`
- `msg_invite_cancel(invite_id)`
- `msg_invites_inbox(cursor, limit)`
- `msg_invites_outbox(cursor, limit)`

Les fonctions SECURITY DEFINER éventuelles devront fixer un `search_path` sûr, qualifier chaque objet, vérifier explicitement `auth.uid()`, révoquer PUBLIC/anon et accorder uniquement les rôles requis. Aucune mutation directe par policy client.

## Dépendances bloquantes avant SQL

- Identifier la table et les colonnes canoniques qui prouvent l'affiliation active élève↔lycée. Ne pas se baser sur un champ libre de profil ni sur la seule wilaya.
- Définir si l'annuaire national est accessible à tous les élèves vérifiés ou s'il faut un consentement de découverte ; préciser les champs publics.
- Définir une source fiable de suspension / désactivation du compte et les règles de rétention / expiration des demandes.
- Confirmer les privilèges effectifs, policies et signatures des fonctions sur la base cible par introspection en lecture seule juste avant la migration.
- Préparer tests PostgreSQL/RLS avec utilisateurs synthétiques ; ne jamais utiliser de comptes ou messages réels.

## Matrice de tests obligatoire

| Cas | Résultat attendu |
|---|---|
| Élève vérifié, affiliation canonique active, autre wilaya | Invitation possible |
| Élève non vérifié / affiliation absente ou inactive | Refus |
| Profil cible non éligible / suspendu | Refus |
| Non authentifié / rôle non élève dans ce flux | Refus |
| Blocage expéditeur→destinataire ou inverse | Refus |
| Invitation en attente déjà existante | Pas de doublon ; résultat idempotent |
| Conversation avant acceptation | Aucune ligne créée, aucun accès |
| Acceptation par un tiers ou l'expéditeur | Refus |
| Refus / annulation par le mauvais acteur | Refus |
| Acceptation valide | Conversation + deux adhésions créées atomiquement |
| Deux acceptations concurrentes | Une seule conversation directe |
| Lecture inbox/outbox d'un tiers | Zéro donnée |
| Recherche nationale | Champs minimaux, pagination et limite de fréquence |
| Ajout direct de membre ou envoi avant acceptation | Refus |

## Tests statiques préparés

La CI actuelle `ci/check-msg.mjs` contrôle le socle de messagerie, mais elle ne remplace pas les tests PostgreSQL/RLS. Un nouveau contrôle statique pourra vérifier les contrats et l'absence de création de DM avant acceptation ; il ne devra pas être présenté comme une preuve de sécurité runtime.

## Hors périmètre et interdictions

Aucune migration appliquée ; aucun SQL exécuté ; aucune écriture Supabase ; aucune modification Auth/RLS/GRANT/Storage ; aucun accès aux messages ou comptes réels ; aucun MFA/2FA ni paiement/facturation ; aucun merge, déploiement ou changement de `main`.

## Prochaine étape

Obtenir l'identifiant exact de la source institutionnelle d'affiliation élève↔lycée et confirmer la règle de découverte nationale. Ensuite seulement, produire une migration transactionnelle testée sur une base PostgreSQL isolée, avec rollback, avant toute demande d'autorisation distincte pour le projet Supabase actif.
