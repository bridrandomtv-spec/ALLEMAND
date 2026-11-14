# Lot 383 — adaptateur Auth local PostgreSQL 17

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`

## Inventaire Auth → profil complémentaire

Extraction SELECT-only des colonnes (aucune ligne) :
- `public.profiles` : id UUID, pseudo, role, niveau, filiere, wilaya, created_at, verif_statut, verif_by, verif_at, matricule, section.
- `public.parent_role_requests` : id bigint, user_id UUID, status text, created_at, decided_at, decided_by.
- La fonction `handle_new_user()` lit `NEW.id` et `NEW.raw_user_meta_data`, insère le profil et peut créer une demande parent.

## Livrable

`tests/messenger/auth_local_adapter_postgres17.sql` :
- exige le marqueur `app.messenger_test_environment='isolated-postgres-only'` ;
- exige la présence du baseline `profiles`, `parent_role_requests` et `handle_new_user()` ;
- crée une table `auth.users` locale minimale limitée à `id` et `raw_user_meta_data` ;
- ajoute un trigger local distinct `auth_local_user_created_test` qui appelle la vraie fonction applicative restaurée ;
- contient des exemples d'insertion commentés et synthétiques, jamais exécutés.

L'adaptateur n'est pas le schéma Auth de Supabase et ne remplace aucun trigger géré. Il ne contient ni email, ni mot de passe, ni token. Les fixtures de test ne donnent pas de statut vérifié ni de permissions admin par défaut.

## Point de vigilance

Les exemples de création Auth locale sont volontairement commentés. Les tests devront d'abord restaurer le baseline complet, le shim Auth et les tables de dépendances. Les statuts `verifie` / `rejete` et les permissions de modération doivent être établis dans l'environnement jetable par des scénarios contrôlés, pas en important des données réelles.

## Statut

- Colonnes profiles et parent_role_requests extraites : oui, SELECT-only.
- Adaptateur Auth local préparé : oui.
- Adaptateur exécuté : non.
- Utilisateurs synthétiques créés : non.
- Tests trigger/RLS exécutés : non.
- Production Supabase modifiée : non.
- Dépense : 0 USD.
- PR #17 : ouverte et non fusionnée ; main inchangée.
