# Lot 328 — scénarios d'affiliation et contrôles de cycle de vie

Date : 12 novembre 2026  
Statut : prototype local hors ligne sur identifiants SYN ; aucune intégration à Supabase/Auth, aucune donnée réelle.

## Objectif

Tester les transitions essentielles d'une affiliation scolaire avant toute conception de migration : demande, validation par établissement, refus, transfert, révocation, expiration et éligibilité à l'annuaire national.

## Livrables

- `prototypes/registry-affiliation-scenarios-core.mjs` : machine d'états pédagogique hors ligne.
- `prototypes/registry-affiliation-scenarios-core.test.mjs` : tests Node natifs.
- Tous les identifiants, établissements, acteurs et sources des tests sont fictifs (`SYN-*`).

## Règles exercées

1. Seul un rôle explicitement désigné `school_verifier`, dans le périmètre exact de son établissement, peut valider ou refuser.
2. Un élève ne peut pas valider sa propre affiliation.
3. Une validation exige une source dont l'état est `verified`; une source en attente ou révoquée bloque la validation.
4. Une décision finale clôt le dossier ; aucune deuxième décision ne peut être ajoutée sur le même dossier.
5. Un transfert clôt l'affiliation source avant l'ouverture de la nouvelle demande auprès de l'établissement cible.
6. Un opérateur technique ne peut pas révoquer une affiliation vérifiée ; la révocation est réservée à un approbateur registre dans ce modèle de test.
7. L'expiration est un événement distinct, réservé au traitement système.
8. L'annuaire n'affiche un élève que si l'affiliation est vérifiée, liée à l'année courante, la source reste vérifiée et l'élève a activé sa visibilité.

## Limites importantes

Ce code est un simulateur de règles, pas une sécurité de production : les rôles sont des paramètres d'entrée non authentifiés, l'état est en mémoire, il n'y a ni concurrence PostgreSQL, ni transaction, ni audit serveur, ni preuve cryptographique de source, ni validation juridique. Le test de transfert ne prouve pas l'exclusivité concurrente d'une affiliation. La règle de visibilité est une politique cible à faire approuver, pas une politique actuellement activée.

Les vrais contrôles devront être exécutés dans des RPC serveur atomiques, avec rôles vérifiés côté serveur, contraintes uniques et verrouillage transactionnel, tests multi-session PostgreSQL et intégration aux sources officielles autorisées.

## Résultat attendu

Exécuter depuis la racine du dépôt :

`node --test prototypes/registry-affiliation-scenarios-core.test.mjs`

**GO** pour tests synthétiques hors ligne uniquement. **NO-GO** pour import, annuaire, invitations nationales, SQL, migration, Auth/RLS/GRANT/Storage ou changement de base active.
