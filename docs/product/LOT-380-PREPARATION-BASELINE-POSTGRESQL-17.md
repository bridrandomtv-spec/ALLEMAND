# Lot 380 — préparation du baseline PostgreSQL 17 reproductible

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Périmètre : inventaire de définitions de schéma en lecture seule et préparation d'un export catalogue SELECT-only.

## 1. Livrable

Fichier ajouté :
- `tests/messenger/baseline_catalog_export.sql`

Ce script regroupe des requêtes SELECT indépendantes pour exporter les définitions de :
- tables et colonnes (types, nullabilité, defaults, identity/generated, RLS/FORCE RLS) ;
- contraintes et index ;
- policies RLS ;
- triggers et fonctions déclenchées ;
- fonctions métier, signatures, langage, SECURITY DEFINER, search_path/configuration, propriétaire, ACL et corps ;
- ACL relationnelles et ACL de colonnes ;
- extensions et tables de la publication Realtime.

**Ce fichier est un export de catalogue, pas un dump PostgreSQL et pas un script de restauration.** Chaque SELECT doit être exécuté indépendamment et ses résultats conservés en artefacts de baseline. Il n'exporte aucune ligne applicative.

## 2. Vérifications réellement exécutées sur Supabase actif

Les requêtes suivantes ont été exécutées en lecture seule :
- colonnes des 12 tables cibles, types, defaults, identité et séquences attachées ;
- contraintes et leur définition ;
- index, état valid/ready, unicité et clé primaire ;
- policies RLS et fonctions ciblées déjà examinées aux lots précédents.

Aucun SELECT sur les lignes de profils, messages, conversations, comptes Auth, pièces jointes ou audit_logs.

### 12 tables du périmètre

`msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`, `profiles`, `audit_logs`, `admin_roles`, `admin_permissions`, `wilaya_assignments`.

### Résultats supplémentaires découverts

- Les colonnes d'identifiants des tables `msg_conversations`, `msg_messages`, `msg_attachments`, `msg_reports`, `msg_log` et `audit_logs` sont des colonnes identity ALWAYS avec leurs séquences attachées.
- Les contraintes réelles de `msg_attachments` incluent notamment MIME allowlist, taille 1 à 5 242 880 octets, format SHA-256, statut et chemin `msg/<conversation>/<uploader>-<nom>`.
- La contrainte `msg_attachments.message_id` référence `msg_messages(id)` avec ON DELETE CASCADE.
- Les dépendances Auth sont explicites : les clés étrangères des membres, créateurs, auteurs, bloqueurs et profils référencent `auth.users`.
- `wilaya_assignments.role_cle` référence `admin_roles(cle)` avec ON DELETE RESTRICT ; `admin_permissions.role_cle` référence `admin_roles(cle)` avec ON DELETE CASCADE.
- Les index cibles retournés par le catalogue sont valides et prêts (indisvalid=true, indisready=true). Le détail exact reste dans l'extraction de catalogue, pas dans une reconstruction approximative.

## 3. Pourquoi msg_schema.sql ne peut pas être le baseline

La comparaison des fichiers historiques avec le catalogue vivant confirme que `supabase/msg_schema.sql` ne couvre pas seul la base active :
- il ne contient pas le périmètre complet `audit_logs`, `admin_roles`, `admin_permissions`, `wilaya_assignments` ;
- la fonction active `msg_open_direct` et ses dépendances doivent être exportées depuis le catalogue, et ne peuvent pas être reconstituées depuis ce fichier historique ;
- le fichier historique contient des définitions et des commentaires de conception qui ne garantissent pas la parité des contraintes, ACL, policies et triggers actuels ;
- les dépendances `auth.users`, `auth.uid()`, `auth.jwt()`, Storage et Realtime sont des services gérés ou des objets de plateforme ; leur simple présence dans du SQL applicatif ne les restaure pas.

Il est donc interdit d'utiliser ce fichier comme migration de restauration fidèle.

## 4. Architecture de restauration retenue

### Couche A — PostgreSQL applicatif
Tables, séquences/identity, contraintes, index, fonctions applicatives, triggers, policies RLS, grants et données de référence synthétiques uniquement.

### Couche B — shim Auth de test
Pour un PostgreSQL générique seulement : rôles `anon` et `authenticated` sans BYPASSRLS, fonctions shim `auth.uid()`, `auth.jwt()`, `auth.role()`, claims synthétiques par transaction/session. Toute différence avec Supabase doit être explicitée. Ce shim ne simule pas le vrai service Auth.

### Couche C — services Supabase gérés
Auth réel, Storage API, Realtime et publication : tests d'intégration séparés. Un test PostgreSQL générique ne peut pas certifier ces services.

## 5. Point de blocage et coût

- L'environnement courant ne dispose toujours pas de PostgreSQL local, Docker, Podman ou Supabase CLI.
- Les branches Supabase sont exclues car elles ne sont pas disponibles sur le plan Free.
- Le deuxième projet indépendant Free reste la seule piste Supabase potentielle sans coût additionnel, sous réserve des quotas du plan. Aucun deuxième projet n'a été créé dans ce lot.
- GitHub Actions hébergé n'est pas utilisé comme substitut tant que le quota gratuit disponible n'a pas été confirmé. Aucun workflow n'a été déclenché manuellement.
- Dépense engagée : 0 USD.

## 6. Statut exact

- Export catalogue SELECT-only préparé : oui.
- Requêtes catalogue colonnes/contraintes/index exécutées sur l'actif : oui, lecture seule.
- Dump SQL fidèle complet produit : non.
- Baseline restauré : non.
- PostgreSQL de test disponible : non.
- Tests RLS multi-comptes : non exécutés.
- Écriture sur Supabase actif : aucune.
- Auth/RLS/Storage/Realtime modifiés : non.
- PR #17 : ouverte et non fusionnée ; main inchangée ; aucun déploiement.

## 7. Suite

1. Consolider les résultats complets des SELECT du fichier d'export dans un manifeste versionné (sans données).
2. Préparer la couche Auth shim et le script de création des comptes synthétiques, sans l'exécuter sur le projet actif.
3. Vérifier les limites et quotas du deuxième projet Free, puis demander une confirmation distincte avant toute création.
4. Seulement après obtention d'un environnement isolé, assembler le baseline et exécuter les scénarios RLS sous `authenticated` avec claims synthétiques.
