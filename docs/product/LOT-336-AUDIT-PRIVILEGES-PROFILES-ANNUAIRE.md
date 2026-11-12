# LOT 336 — Revue des privilèges et politiques de la table profiles (12 novembre 2026)

## Périmètre

Lecture seule du catalogue PostgreSQL 17.6 actif (projet Supabase `azjwcybivirvpxbfhyzk`). Requêtes ciblées sur `information_schema.column_privileges`, `pg_policies`, `information_schema.views` et les définitions de triggers de protection des profils. Aucun profil individuel ni aucune donnée nominative consultés.

## Constat SELECT : privilèges colonne larges, lignes filtrées par RLS

Le rôle `authenticated` possède un privilège SELECT explicite sur toutes les colonnes actuellement listées de `public.profiles`, dont :

- identifiants et affichage : `id`, `pseudo`, `role`, `created_at` ;
- scolarité déclarative : `wilaya`, `niveau`, `filiere`, `matricule`, `section` ;
- vérification : `verif_statut`, `verif_by`, `verif_at`.

Les politiques SELECT actuellement présentes sont :

- `own profile` : sa propre ligne ;
- `admin voit tout` : soi-même ou administrateur ;
- `profils en attente visibles modérateurs` : profils en attente dans le périmètre des vérificateurs ;
- `profils lecture agents scopés` : périmètre `students.read` et wilaya autorisée ;
- `profils visibles entre membres` : soi-même, admin, ou utilisateur partageant une conversation selon `msg_members`.

Il n'existe pas de vue SQL d'annuaire/profil minimal repérée dans le schéma public par la recherche ciblée.

**Interprétation précise :** RLS limite les lignes retournées, pas les colonnes. Pour toute ligne que l'une des politiques autorise à lire, le rôle authenticated dispose aussi du SELECT sur les champs matricule, section et vérification. Cela confirme un défaut de minimisation des données pour le partage de profils entre membres. Ce contrôle catalogue ne prouve pas qu'un utilisateur quelconque peut lire toutes les lignes ; il prouve que les colonnes sensibles ne sont pas isolées par privilèges colonne.

## INSERT / UPDATE et protections par triggers

Le rôle `authenticated` possède également des privilèges INSERT et UPDATE sur plusieurs colonnes de profil, y compris `role`, `matricule`, `section`, `verif_statut`, `verif_by`, `verif_at` et les champs de périmètre.

Les fonctions de trigger examinées apportent des gardes :

- `profiles_role_guard` : refuse le changement de rôle si le compte courant n'est pas admin.
- `profiles_scope_guard` : refuse à l'utilisateur de changer son propre périmètre wilaya/niveau/filière ; réserve les changements à l'administration autorisée.
- `profiles_verif_guard` : réserve la vérification/modification des champs de vérification à l'admin ou au vérificateur autorisé dans la wilaya ; permet à l'utilisateur de soumettre un profil non vérifié/rejeté en attente selon les conditions exactes de la fonction.

La politique `update own` limite l'UPDATE à sa propre ligne et vérifie que rôle et niveau restent égaux à leurs valeurs actuelles. La politique `verif update par modérateurs` réserve la validation aux administrateurs/vérificateurs autorisés.

**Interprétation précise :** les grants larges ne signifient pas que chaque modification réussit ; les politiques et triggers interviennent. Il faut cependant conserver des tests d'intégration par rôle pour démontrer l'absence de contournement, et préférer un modèle de privilèges plus étroit plutôt que dépendre uniquement des triggers.

## Décision pour l'annuaire national Messenger

Ne pas utiliser `profiles.select('*')` pour la recherche nationale ni exposer les colonnes de la table source. Séparer au minimum :

1. **Profil personnel** : accessible à son propriétaire selon les besoins du compte.
2. **Étiquette de conversation** : strict minimum pour afficher un membre (identifiant, pseudo et éventuellement niveau si justifié).
3. **Annuaire national** : projection serveur limitée aux profils opt-in, affiliation institutionnelle active et vérifiée, résultats paginés ; aucun matricule, section, rôle interne, vérificateur ou horodatage de vérification.
4. **File de vérification** : opération dédiée réservée au personnel habilité, avec champs justificatifs nécessaires.
5. **Administration** : endpoint distinct, contrôles de rôle/périmètre côté serveur et projections dédiées.

L'annuaire doit s'appuyer sur une future affiliation scolaire officielle (établissement canonique + année scolaire + source vérifiée), pas sur les champs déclaratifs actuels de `profiles`.

## Suites et limites

- Concevoir les privilèges colonne/relations de projection et RPC dédiés avant d'ouvrir l'annuaire.
- Remplacer progressivement les SELECT génériques par les opérations adaptées à chaque écran, sans casser le panneau d'administration ni le flux de vérification.
- Ajouter des tests PostgreSQL multi-rôle : utilisateur standard, membre de conversation, vérificateur dans/hors wilaya, admin, compte anonyme ; vérifier à la fois lignes et colonnes accessibles.
- Aucun test d'exploitation multi-compte n'a été exécuté ; aucun correctif n'a été appliqué.
- Aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage, déploiement Cloudflare, changement `main), fusion PR #17 ou création de branche Supabase.

## Décision

**NO-GO pour un annuaire national basé sur la table `profiles` actuelle.** La conception doit passer par une projection minimale et des autorisations serveur dédiées, puis être validée sur PostgreSQL isolé avant toute migration active.
