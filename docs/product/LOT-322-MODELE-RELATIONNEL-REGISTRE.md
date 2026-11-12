# Lot 322 — Modèle relationnel logique du registre scolaire national

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : conception documentaire uniquement. Aucun DDL ni migration.

## 1. Frontières

Le registre scolaire est distinct de la messagerie. Il sépare :
1. le référentiel des établissements reconnus ;
2. les sources institutionnelles et versions reçues ;
3. les imports et leurs anomalies ;
4. les affiliations annuelles des élèves ;
5. les décisions administratives ;
6. l'annuaire minimal exposé à Messenger.

Une valeur déclarée dans `profiles` (wilaya, niveau, filière, lycée, matricule) n'est jamais une preuve d'inscription.

## 2. Entités proposées

### `school_establishments`
Identifiant interne UUID, identifiant national officiel, noms officiels arabe/français, codes wilaya et commune, adresse administrative, type, statut (actif, fermé, fusionné, remplacé, à vérifier), dates d'effet, référence de l'acte et version du référentiel.

Règle : aucun établissement créé depuis une déclaration d'élève, un annuaire commercial ou un jeu de démonstration.

### `registry_sources`
Autorité émettrice, canal de réception, type de source (export signé ministère/DEW, décret, arrêté), référence et date de l'acte, SHA-256 du fichier original, date de réception, version, période de validité, état de revue et emplacement privé contrôlé.

Une empreinte seule ne prouve ni l'autorité de l'émetteur ni l'authenticité d'une signature.

### `registry_import_batches` et `registry_import_rows`
Le lot conserve la source, version, empreinte, opérateur, état de validation et résultat. Chaque ligne conserve son numéro source, ses valeurs normalisées, anomalies, rapprochement proposé et décision.

États proposés : reçu, analysé, anomalies, en revue, approuvé, rejeté, appliqué, annulé. Un fichier déjà reçu (même empreinte/source) est détecté comme doublon ; aucune réapplication silencieuse. Une correction crée une nouvelle version/lot lié à l'original.

### `student_enrollments`
Utilisateur, établissement, année scolaire, niveau, filière, classe, état (déclarée, en attente, vérifiée, refusée, expirée, révoquée), référence de source/lot/procédure, dates d'effet et motif administratif.

La clé exacte vers `public.profiles` doit être confirmée sur le schéma réel avant DDL. Le modèle ne suppose pas qu'un `lycee_id` existe déjà.

Contraintes logiques : au plus une affiliation active vérifiée par élève et année, sauf exception institutionnelle documentée ; conserver l'historique des changements ; ne vérifier qu'après preuve institutionnelle ou code à usage limité émis par l'établissement. Un enseignant ordinaire n'obtient pas automatiquement le droit d'approuver.

### `enrollment_verification_tokens`
Si le code établissement est retenu : hash du code (jamais le code en clair), établissement, année, émission, expiration, limite d'utilisation, état, acteur habilité et date de consommation. Rotation et invalidation explicites.

### `registry_decision_events`
Journal des revues, demandes de correction, acceptations, rejets, quarantaines, réouvertures et révocations. En production, acteur authentifié, rôle vérifié côté serveur, horodatage serveur, justification et référence documentaire. Le journal SHA-256 hors ligne des lots 317–321 est un prototype, pas une signature ni une preuve juridique.

## 3. Annuaire Messenger

Ne jamais exposer directement `profiles`, matricules, justificatifs, adresse, e-mail ou téléphone. Une vue/fonction serveur dédiée ne retourne que : identifiant public opaque, nom d'affichage autorisé, établissement et wilaya issus d'une affiliation vérifiée active, niveau/filière si permis, et disponibilité à recevoir des invitations.

L'élève peut masquer sa présence. Les recherches sont paginées côté serveur ; aucun balayage de tous les profils depuis le navigateur. Invitations soumises au consentement, blocage et limites de fréquence.

## 4. Séparation des responsabilités

- Opérateur : réception, format, doublons, rapprochement proposé.
- Approbateur institutionnel : acceptation, refus, quarantaine, demande de correction.
- Administrateur technique : service et accès techniques ; ce rôle ne prouve pas une autorité scolaire.
- Élève : déclaration et preuve ; jamais approbation de sa propre inscription.

Les rôles sont déterminés côté serveur, jamais depuis le navigateur.

## 5. Intégrité, index et rétention à prévoir

Unicité de l'identifiant national officiel par version ; index wilaya/commune/statut ; index utilisateur+année+état ; idempotence des lots ; clés étrangères restrictives pour préserver les affiliations historiques ; cohérence des dates et transitions ; aucune suppression en cascade des preuves, lots ou décisions.

Ne collecter aucune pièce d'identité si un code institutionnel ou un export signé suffit. Si justificatif exceptionnel : stockage privé dédié, accès minimal, journalisation et durée définie avant activation. Ne pas inventer une durée légale.

Les noms, types UUID, clés, privilèges et politiques seront ajustés après lecture du schéma/migrations existants. Ce document n'est pas un script SQL.

## 6. Dépendances bloquantes

1. Export national actualisé ou sources institutionnelles complètes et versionnées.
2. Confirmation de l'autorité habilitée à approuver les affiliations.
3. Validation du protocole institutionnel Lot 316-A.
4. Confirmation du schéma réel `profiles`, des rôles et clés.
5. Politique de conservation des justificatifs et archives.

Les décrets historiques du Lot 314 ne forment pas à eux seuls un inventaire exhaustif des lycées actifs en 2026-2027.

## 7. Tests avant migration

Sur PostgreSQL jetable, sans connexion à la production : deux versions synthétiques ; idempotence ; fermeture/fusion/remplacement ; affiliations concurrentes ; acceptation/refus/expiration/révocation/réouverture ; impossibilité d'auto-approbation ; séparation des accès aux justificatifs ; annuaire limité aux champs autorisés ; rôles opérateur/approbateur/élève/parent ; rétention et absence de cascade.

Aucun environnement cloud payant créé implicitement. Tests locaux préférés ; ressource distante seulement après information sur le coût et autorisation distincte.

## 8. Décision

**GO :** modèle logique documentaire et scénarios de tests isolés.  
**NO-GO :** DDL définitif, migration, branche Supabase, changement Auth/RLS/GRANT/Storage, import réel, activation de l'annuaire national ou déploiement.

PR #17 reste ouverte et non fusionnée. `main` et les bases actives restent hors périmètre.
