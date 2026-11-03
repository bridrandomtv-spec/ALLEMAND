# Audit sécurité — modération et vérification scolaire
Date : 2026-10-30
Projet : ALLEMAND / Supabase
Branche : security/parent-child-confirmation

## Périmètre
Analyse statique de `supabase/msg_schema.sql`, `supabase/adm_schema.sql` et `supabase/supabase.js`.
Aucune modification de la base de production n'a été effectuée pendant cette étape.
Les requêtes Supabase directes étaient indisponibles pendant le contrôle ; les constats ci-dessous sont des constats de code, pas une nouvelle vérification de l'état live.

## Constat P0 — périmètre trop large du rôle modérateur
Dans `msg_schema.sql`, `msg_is_moderator(uid)` retourne vrai pour les profils dont le rôle est `admin` ou `prof`.
Cette fonction est réutilisée par les politiques RLS de :
- lecture de toutes les conversations ;
- lecture de tous les membres ;
- lecture de tous les messages ;
- accès aux pièces jointes ;
- lecture et traitement de tous les signalements ;
- lecture des blocages ;
- lecture du journal de modération ;
- suppression de membres ;
- modération des pièces jointes.

Conséquence : si la définition correspond à la production (elle a aussi été retrouvée dans le code de référence et la définition précédemment inspectée), un professeur reçoit un accès de modérateur transversal, sans contrôle explicite de wilaya, niveau ou filière dans ces politiques. Cela peut exposer les conversations privées de tous les utilisateurs.
Sévérité : CRITIQUE — à confirmer par test RLS réel et à corriger avant ouverture générale.

## Constat P0 — validation scolaire ouverte à tous les professeurs
`profiles_verif_guard()` considère `admin` et `prof` comme modérateurs.
Les politiques `profils en attente visibles modérateurs` et `verif update par modérateurs` reposent également sur `msg_is_moderator(auth.uid())`.
Conséquence : un professeur peut voir la file d'attente et valider/refuser des comptes sans contrôle territorial ou pédagogique explicite dans cette logique.
Sévérité : ÉLEVÉE.

## Constat P1 — modération non atomique côté navigateur
Dans `supabase/supabase.js`, `msgHandle(reportId, decision, opts)` effectue plusieurs opérations séparées : lecture du rapport, retrait éventuel des pièces jointes, suppression logique éventuelle du message, puis mise à jour du rapport et de son modérateur.
Une erreur intermédiaire peut laisser un état partiellement traité.
Recommandation : une RPC PostgreSQL transactionnelle `msg_handle_report` doit verrouiller le rapport (`FOR UPDATE`), vérifier l'identité, permission et périmètre du modérateur, effectuer les changements, et écrire un journal dans la même transaction.

## Constat P1 — permission administrative non spécifique
`adm_schema.sql` définit `admin_can(uid, perm)` à partir de `wilaya_assignments` et `admin_permissions`. Les permissions semées couvrent paiements, élèves, plans, tickets, rapports et gestion d'agents, mais aucune permission `messaging.moderate` n'apparaît dans ce fichier.
Recommandation : créer une permission dédiée, attribuée explicitement aux rôles administratifs choisis ; ne jamais utiliser le rôle pédagogique `prof` comme substitut à cette permission.

## Architecture de correction recommandée
1. Séparer `msg_is_moderator` (capacité d'accès globale) de `msg_can_moderate_conversation(uid,cid)` (permission + wilaya des participants).
2. Réserver l'accès national aux comptes `is_admin()` ou `admin_general`.
3. Pour les agents régionaux, exiger `admin_can(auth.uid(),'messaging.moderate')` ET `admin_sees_wilaya(auth.uid(), wilaya)` pour tous les participants concernés.
4. Réserver les journaux globaux à l'administrateur national ; créer une vue ou RPC filtrée pour les agents régionaux.
5. Distinguer la permission `students.verify` de `messaging.moderate` et limiter la file de vérification aux profils du périmètre autorisé.
6. Remplacer `msgHandle` par une RPC transactionnelle ; le navigateur ne doit plus effectuer plusieurs mutations indépendantes pour un même traitement.
7. Réaliser des tests avec trois sessions distinctes : professeur, agent régional, administrateur national. Vérifier les lectures RLS et les mutations positives/négatives.

## État des changements
Aucune correction de production n'a été appliquée dans cette étape.
Aucun rôle, compte, lien ou message utilisateur n'a été modifié.
