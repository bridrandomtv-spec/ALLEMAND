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


## Complément Lot 312 — vérification du schéma Supabase actif et du parcours d'inscription (12 novembre 2026)

### Conclusion vérifiée
La source officielle d'affiliation élève↔lycée **n'existe pas actuellement dans le schéma actif inspecté**. Il n'y a donc aucune table/colonne permettant d'affirmer qu'un compte appartient officiellement à un lycée déterminé.

### Preuves relevées
- Introspection en lecture seule du projet Supabase actif `azjwcybivirvpxbfhyzk` (PostgreSQL 17.6) : dans `public.profiles`, les seules colonnes scolaires sont `niveau`, `filiere`, `wilaya`, puis `matricule` et `section`. Aucune colonne `lycee_id`, `etablissement_id`, aucun identifiant d'établissement et aucune table de relation d'inscription élève↔établissement n'ont été trouvés dans `public` / `auth` par recherche des noms et colonnes pertinents.
- Les migrations actives listées s'arrêtent à `20261109210413_add_email_mfa_challenge_store` ; aucune migration d'affiliation ou d'inscription scolaire n'apparaît.
- `supabase/schema.sql` crée le profil depuis les métadonnées d'inscription : `pseudo`, `niveau`, `filiere`, `wilaya`. Le rôle est imposé à `eleve`. Aucun lycée n'est demandé ni enregistré dans ce trigger.
- `app.js` transmet à `SB.signup` exactement `pseudo`, `niveau`, `filiere`, `wilaya`. Aucun établissement n'est transmis.
- Le Lot 6 de `supabase/msg_schema.sql` ajoute `matricule` et `section`. Le commentaire SQL prévoit que l'élève les déclare lui-même avant de demander le statut `en_attente`. Le garde autorise ce passage à l'attente ; un profil `prof` ou `admin` peut ensuite modifier le statut. Aucun document justificatif, numéro d'établissement, registre officiel ou rapprochement externe n'est vérifié par ce mécanisme.
- `msg.js` affiche « matricule scolaire » et « section / classe » dans deux champs texte, puis propose aux modérateurs les boutons « vérifier » / « rejeter ». La validation actuelle prouve donc au mieux une revue manuelle de valeurs déclarées, pas une affiliation institutionnelle documentée.
- La base active contient actuellement 5 profils élèves, tous `non_verifie`, avec 0 matricule renseigné et 0 section renseignée (agrégat seulement ; aucune donnée nominative consultée).
- `assets/bdd/classe.json` contient cinq classes et des effectifs/statistiques de maquette. Il s'agit d'un fichier JSON statique de démonstration, non relié aux identifiants Auth ni à une table d'inscriptions : **il ne peut pas servir de source de vérité**.
- Les fichiers Worker repérés (`worker/ia-ask.js`, `worker/resend-welcome.js`) ne fournissent pas de service d'affiliation scolaire ou de registre d'élèves.

### Décision technique
- Ne pas demander à l'utilisateur de localiser cette source : l'audit a établi qu'elle n'est pas présente dans l'architecture active inspectée.
- Ne pas traiter `wilaya+niveau+filiere`, `section`, `matricule` auto-déclarés, le statut de vérification manuel, ni `classe.json` comme preuve officielle d'inscription.
- L'annuaire national inter-lycées et les invitations nationales restent bloqués pour les élèves tant qu'une source institutionnelle vérifiable n'est pas intégrée (ou qu'un processus d'admission contrôlé, traçable et approuvé n'est pas défini).
- Ne pas élargir `msg_can_dm` ni modifier les policies/RLS pour contourner cette absence.

### Périmètre de l'opération
Introspection Supabase strictement en lecture seule et lecture GitHub. Aucun compte individuel, email, message ou document personnel consulté. Aucune donnée, table, migration, fonction, policy, GRANT, Auth, Storage ou configuration Cloudflare modifié. Aucun merge, déploiement ou changement de `main` ; PR #17 reste ouverte.

### Suite
Documenter avec le propriétaire du produit la future source officielle attendue (par exemple un registre d'établissements et une inscription validée par l'administration), puis concevoir son modèle et son processus d'import/validation. En attendant, conserver les invitations nationales en NO-GO.
