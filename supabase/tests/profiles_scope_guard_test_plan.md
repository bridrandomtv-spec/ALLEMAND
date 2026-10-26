# Test plan — protection du périmètre des profils

**Statut : plan manuel, non exécuté.** À utiliser uniquement dans un projet Supabase/PostgreSQL de test, jamais directement en production.

## Objectif

Valider que seul un administrateur peut modifier le champ `profiles.niveau`, et vérifier l'interaction entre les politiques RLS et les triggers de protection.

## Préconditions

1. Créer un projet/base de test isolé, sans données de production.
2. Vérifier les scripts effectivement appliqués : `schema.sql`, `fix_rls.sql`, `admin.sql`, `p0_locks.sql` et `fix_scope_guard.sql`.
3. Vérifier les définitions actives avec `pg_policies`, `pg_trigger` et `pg_get_functiondef()`. Ne pas supposer que l'ordre des fichiers reflète l'état de la base.
4. Préparer des comptes distincts et authentifiés pour `eleve`, `parent`, `prof` et `admin`, ainsi que deux profils élèves de test.
5. Vérifier qu'aucune clé `service_role` n'est utilisée pour les tests de permissions utilisateur : elle peut contourner RLS.

## Matrice de tests

| ID | Acteur | Opération | Résultat attendu |
|---|---|---|---|
| T01 | élève A | Modifier son propre `niveau` | Refus |
| T02 | élève A | Modifier son propre `role` en `admin` | Refus |
| T03 | parent | Modifier le `niveau` d'un profil enfant | Refus |
| T04 | professeur | Modifier le `niveau` d'un élève B | Refus |
| T05 | administrateur | Modifier le `niveau` d'un élève B | Autorisé |
| T06 | administrateur | Modifier simultanément `niveau` et `filiere` d'un élève B | Autorisé |
| T07 | professeur | Modifier seulement `filiere` d'un autre profil, sans changer `niveau` | Vérifier la règle métier et les politiques RLS réelles |
| T08 | professeur | Modifier seulement `wilaya` d'un autre profil, sans changer `niveau` | Vérifier la règle métier et les politiques RLS réelles |
| T09 | utilisateur non authentifié | Tenter une mise à jour de profil | Refus |
| T10 | élève A | Modifier un champ non sensible de son propre profil | Autorisé uniquement si la politique le permet |
| T11 | administrateur | Mettre à jour un champ sans changer `niveau` | Autorisé selon la politique admin effective |
| T12 | tout rôle non admin | Envoyer une mise à jour dont `niveau` reste inchangé | Confirmer qu'aucun trigger ne bloque à tort l'opération |
| T13 | professeur / parent / élève | Changer `niveau` et un autre champ dans la même requête | Refus, même si l'autre champ est normalement modifiable |

## Procédure pour chaque cas

1. Ouvrir une session avec le compte du rôle testé dans l'application ou le client Supabase utilisant sa session utilisateur.
2. Exécuter une seule opération correspondant au scénario.
3. Consigner : rôle, opération, code SQLSTATE/message, lignes affectées et résultat.
4. Vérifier l'état du profil après l'opération, depuis un compte autorisé.
5. Réinitialiser les données de test avant le scénario suivant.

## Contrôles spécifiques aux triggers

- Inventorier tous les triggers `BEFORE UPDATE` actifs sur `public.profiles`, notamment `trg_protect_role_niveau` et `profiles_tr_scope`.
- Tester les mises à jour qui ne modifient pas `niveau`, car un trigger peut bloquer une opération même si un autre trigger l'autorise.
- Vérifier la priorité et la coexistence des triggers ; PostgreSQL exécute les triggers du même événement dans l'ordre alphabétique de leur nom.
- Vérifier le comportement des mises à jour avec `auth.uid() IS NULL` dans un contexte contrôlé. Ne pas considérer ce cas comme équivalent à une session authentifiée.
- Confirmer que les fonctions `SECURITY DEFINER` fixent un `search_path` sûr et n'accordent pas de privilèges excessifs.

## Critères d'acceptation

- Tous les changements de `niveau` par un rôle non admin sont refusés.
- Les changements autorisés par un admin passent via les politiques RLS réellement installées.
- Les rôles non admin ne peuvent pas s'auto-attribuer `admin` ou `prof`.
- Aucun scénario autorisé attendu n'échoue à cause d'un conflit entre triggers.
- Les résultats sont reproduits sur une base de test et documentés avant toute fusion.

## Limites

Ce document ne lance aucune requête et ne prouve pas que les politiques/triggers actuellement installés correspondent aux scripts du dépôt. Il ne remplace pas un test d'intégration PostgreSQL/Supabase. Ne pas fusionner ni appliquer les scripts en production sur la seule base de cette matrice.
