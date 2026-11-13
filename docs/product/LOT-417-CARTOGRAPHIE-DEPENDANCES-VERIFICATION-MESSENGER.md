# Lot 417 — cartographie des dépendances de la vérification scolaire Messenger

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : inventaire statique du dépôt et rapprochement avec les audits historiques documentés ; aucune écriture sur Supabase.

## 1. Synthèse

Le changement de numéro d'abonnement vers une vérification scolaire gratuite ne peut pas être réalisé en remplaçant simplement un champ de formulaire. Les données et fonctions de vérification sont imbriquées dans le profil, le trigger de protection, les policies RLS, le contrôle d'ouverture des DM, la file de supervision, l'interface et les tests CI.

Deux générations de règles doivent être distinguées :

- Le script agrégé historique `supabase/msg_schema.sql` contient une garde ancienne fondée sur le rôle global `admin/prof`.
- Les migrations archivées `20261030171556_separate_global_moderation_and_student_verification.sql` et `20261030171618_scope_student_verification_by_wilaya.sql` introduisent le droit `students.verify`, la séparation de la modération globale et de la vérification scolaire, puis la portée wilaya.

Le manifeste du Lot 342 indique que ces fichiers d'archive sont des copies de migrations déjà appliquées à la source Supabase, à ne pas rejouer. Les audits des Lots 335, 350 et 351 documentent aussi des observations du catalogue vivant à leurs dates respectives. Cela ne constitue pas une nouvelle interrogation du catalogue actif au cours du Lot 417.

## 2. Carte des dépendances confirmées dans le dépôt

### A. Colonnes du profil

Le script `supabase/msg_schema.sql` ajoute ou utilise :

| Champ | Dépendance observée | Risque lors de la transition |
|---|---|---|
| `verif_statut` | États `non_verifie`, `en_attente`, `verifie`, `rejete` ; contrôle DM | Changer les états sans migration de compatibilité peut casser les DM |
| `verif_by` | Identifiant du décideur et garde du trigger | Garder l'historique et distinguer vérificateur de l'ancien modérateur |
| `verif_at` | Horodatage de validation dans le profil | Vérifier les consommateurs et la politique d'audit |
| `matricule` | Champ modifié par la demande et comparé par le trigger ; exposé dans la file de supervision | Ne pas réaffecter ce champ à un autre sens sans migration et inventaire des usages |
| `section` | Déclarée par le candidat, lue par l'interface et contrôlée dans la transition | Clarifier s'il s'agit de classe, filière ou section avant normalisation |

### B. Code client

- `msg.js` : les identifiants DOM `vfMat` et `vfSec`, le bouton `verif-req`, le texte demandant le numéro d'abonnement et les messages d'état sont directement liés au parcours actuel.
- `msg.js` : l'écran de supervision affiche `q.matricule` et `q.section` depuis la file et expose les actions de décision.
- `supabase/supabase.js` : `msgMyVerification()` sélectionne `verif_statut,matricule,section`.
- `supabase/supabase.js` : `msgRequestVerification(subscriptionNumber, section)` vérifie une ligne `subscriptions` active appartenant à l'utilisateur, puis écrit `verif_statut='en_attente'`, `matricule=number` et `section`.
- `supabase/supabase.js` : `msgVerificationQueue()` lit la file dans `profiles`, dont le champ `matricule`.
- `supabase/supabase.js` : `msgSetVerification` est la voie client de décision ; ses droits réels dépendent des fonctions/triggers/RLS serveur.

### C. Garde SQL et policies

Dans le script historique `supabase/msg_schema.sql` :

- `profiles_verif_guard()` protège les changements de `verif_statut`, `verif_by`, `matricule` et `section`.
- La version agrégée initiale reconnaît `admin/prof` comme modérateurs globaux.
- La policy `profils en attente visibles modérateurs` et la policy `verif update par modérateurs` utilisent `msg_is_moderator` et les lignes en attente.
- Le script remplace ensuite `msg_can_dm` pour exiger deux profils `verifie` et une correspondance wilaya/niveau/filière.

Dans les migrations archivées :

- `separate_global_moderation_and_student_verification` utilise `admin_can(auth.uid(), 'students.verify')` en plus de l'administrateur et sépare le droit de vérification de la modération globale.
- `scope_student_verification_by_wilaya` ajoute un contrôle de périmètre wilaya dans la garde et dans les policies de lecture/mise à jour des dossiers en attente.
- Ces fichiers sont des archives de migrations historiques appliquées selon le manifeste Lot 342 ; ils ne doivent pas être exécutés à nouveau.

### D. Dépendances Messenger et accès DM

- `msg_can_dm(a,b)` dépend de l'état `verifie` des deux profils et de wilaya/niveau/filière communs.
- `msg_guard_direct()` / trigger `msg_tr_direct` sur `msg_members` appelle `msg_can_dm` lors de l'ajout du second membre.
- `msg_member_ok` est utilisé par la policy d'ajout des membres.
- `msg_open_direct` et les policies historiques restent des chemins à examiner pour le consentement et le blocage. Les Lots 350–351 et 379 documentent des chemins DM qui ne vérifient pas tous une invitation acceptée et des contrôles de blocage incomplets.
- Une migration de vérification ne doit pas être utilisée pour prétendre corriger le consentement ou le blocage DM : ces sujets nécessitent des tests et une migration séparés.

### E. Administration et indicateurs

- `supabase/adm4_schema.sql` inclut un compteur des profils `en_attente` et une projection qui expose l'état `verif` dans une sortie de tableau de bord.
- Il faut conserver la capacité de supervision tout en évitant d'afficher le matricule ou d'autres données scolaires privées lorsque le statut et un identifiant de dossier suffisent.
- La portée wilaya et les autorisations des agents doivent être vérifiées côté serveur, pas inférées d'un rôle UI.

### F. Tests et CI

- `ci/check-msg.mjs` exige notamment la présence de `profiles_verif_guard`, `msg_can_dm`, le contrôle de deux profils vérifiés et les méthodes Messenger du client.
- `tests/msg_test.mjs` vérifie la garde contre l'auto-validation et le passage élève vers `en_attente`.
- Ces tests portent sur des invariants textuels du dépôt ; ils ne prouvent pas à eux seuls l'équivalence des migrations ni le comportement de la base active.
- Tout changement futur devra mettre à jour les tests sans retirer les garanties de transition, d'absence d'auto-validation et de vérification DM.

## 3. Risques de compatibilité

1. **Réutilisation sémantique de `matricule`** : risque de collision avec des données historiques. Ne pas stocker le numéro scolaire dans le champ actuellement utilisé pour l'identifiant d'abonnement sans audit complet.
2. **Profils existants** : les états `verifie` déjà enregistrés ne doivent pas être automatiquement considérés comme une preuve institutionnelle nouvelle. Prévoir une règle de migration/maintien/revalidation explicite.
3. **Rôles historiques** : les rôles `prof/admin` du script agrégé ne doivent pas réapparaître comme droits globaux si les migrations actives utilisent `students.verify` et une portée wilaya.
4. **Policies cumulatives** : l'ajout d'une policy plus stricte ne neutralise pas nécessairement les anciennes policies permissives. Refaire l'inventaire des policies, grants, ACL et rôles hérités.
5. **RPC et chemins alternatifs** : l'interface ne constitue pas la frontière de sécurité. Tester les appels RPC, INSERT direct, ajout de membres, invitations et chemins historiques.
6. **Confidentialité** : RLS filtre des lignes, pas automatiquement des colonnes. Les projections de profils et la file de vérification doivent exclure le matricule et les pièces privées pour les utilisateurs non habilités.
7. **Forum** : aucune dépendance de `ملتقى الطلاب` à `verif_statut` ou à l'abonnement ne doit être introduite. L'accès de base reste ouvert aux comptes élèves actifs.

## 4. Stratégie de transition sûre proposée

### Phase 0 — figer la référence
- Ne pas rejouer les scripts agrégés `supabase/*.sql` ni les migrations archivées.
- Obtenir une baseline complète, datée et reproductible du schéma vivant, des fonctions, triggers, policies, grants, rôles et ACL.
- Récupérer le SQL source des migrations déjà appliquées et vérifier les empreintes du manifeste Lot 342.
- Créer/reconstruire un environnement PostgreSQL isolé sans frais, sans données personnelles, à partir d'une source complète validée.

### Phase 1 — séparer les concepts
- Conserver les abonnements et paiements dans leur domaine commercial.
- Concevoir une entité/dossier d'affiliation scolaire distincte, avec identifiant interne opaque.
- Ne pas réutiliser `profiles.matricule` sans démontrer tous ses usages, ni exposer un numéro scolaire public.
- Définir les champs minimaux, source institutionnelle, statut, décideur, périmètre et audit.

### Phase 2 — compatibilité contrôlée
- Maintenir la lecture des états historiques pendant une période de transition.
- Définir comment les profils déjà `verifie` sont conservés, revus ou révalidés ; aucun basculement massif automatique.
- Introduire des projections minimales pour le profil et la file des vérificateurs.
- Maintenir l'accès gratuit au forum et ne changer l'éligibilité DM qu'après tests serveur.

### Phase 3 — tests avant migration
- Tests de rôles établissement/wilaya/central, révocation et appel indépendant.
- Tests abonné/non abonné × vérifié/non vérifié.
- Tests de fuite de matricule par profil, annuaire, notifications, logs, file et API.
- Tests DM par toutes les voies : RPC, INSERT, ajout de membre, invitation acceptée, refus, blocage bilatéral et révocation.
- Tests de non-régression de Messenger, forum, groupes, Realtime et stockage.

### Phase 4 — activation après autorisation explicite
- Préparer une migration atomique et réversible après revue du SQL exact.
- Exécuter d'abord sur environnement isolé et faire valider les résultats.
- Ne toucher au projet Supabase actif qu'après autorisation explicite distincte, sauvegarde et plan de retour arrière.
- Aucun déploiement Cloudflare ou fusion PR #17 implicite.

## 5. Limites et statut de preuve

- Cet inventaire est statique et s'appuie sur les fichiers de la branche ainsi que sur les rapports antérieurs versionnés.
- Le manifeste Lot 342 identifie les deux migrations archivées comme copies de migrations appliquées sur le projet source.
- Les Lots 335, 350 et 351 contiennent des observations antérieures du catalogue Supabase vivant, mais le Lot 417 n'a pas interrogé à nouveau la base active.
- Les scripts agrégés sous `supabase/` ne sont pas une baseline complète et ne doivent pas être traités comme une chaîne de migrations exécutable.
- Aucun contenu de profil, message ou fichier d'élève n'a été consulté.

## 6. Périmètre exécuté

Lecture du dépôt uniquement. Aucun fichier applicatif modifié ; aucun SQL, DDL/DML, migration, Auth, RLS, GRANT, Storage, Realtime, paiement ou donnée élève modifié ; aucun accès en écriture à Supabase ; aucun déploiement ; aucune modification de `main`, aucun rebase/synchronisation, aucune fusion PR #17.

## Suite — Lot 418

Préparer un protocole de baseline isolée et une liste exacte des sources nécessaires pour reconstruire PostgreSQL sans frais, en vérifiant d'abord la disponibilité d'un environnement gratuit et en évitant toute action susceptible de créer une ressource payante. Ne pas créer de branche Supabase ni exécuter de SQL actif.
