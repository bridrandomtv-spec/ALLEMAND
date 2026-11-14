# Lot 378 — preflight catalogue reproductible du Messenger

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : inspection des catalogues PostgreSQL, lecture seule. Aucun enregistrement applicatif consulté.

## 1. Pourquoi ce lot

L'audit du fichier `tests/msg_test.mjs` montre qu'il vérifie des motifs dans le SQL historique `supabase/msg_schema.sql` et dans le client `supabase/supabase.js`. Il ne se connecte pas à PostgreSQL et ne teste donc pas les politiques RLS actives. Il ne doit pas être présenté comme un test d'autorisation de base de données.

Un contrôle préalable reproductible a été ajouté dans `tests/messenger/catalog_preflight.sql`. Il ne contient que des SELECT sur les catalogues : présence des tables, état RLS/FORCE RLS, policies, triggers, fonctions et signatures. Il ne crée aucune fixture et n'écrit aucune donnée.

## 2. Exécution de référence sur le projet actif

La requête équivalente a été exécutée en lecture seule sur le projet Supabase actif. Résultats observés :

- 12 tables applicatives/dépendances attendues présentes : 7 tables Messenger, profiles, audit_logs, admin_roles, admin_permissions et wilaya_assignments.
- RLS activé sur les 12 tables ; FORCE RLS désactivé sur chacune.
- Policies observées : conversations 2 ; membres 3 ; messages 3 ; pièces jointes 3 ; blocages 3 ; signalements 3 ; journal Messenger 1 ; profiles 7 ; audit_logs 1 ; admin_roles 1 ; admin_permissions 1 ; wilaya_assignments 2.
- Fonctions attendues présentes : msg_open_direct, msg_can_dm, msg_member_ok, msg_not_blocked, msg_guard_direct, msg_rate_limit, profiles_verif_guard, profiles_scope_guard, handle_new_user et audit_log. Les signatures ont été récupérées pour le baseline.
- Triggers observés : msg_members 1 ; msg_messages 3 ; msg_attachments 2 ; msg_reports 1 ; profiles 5 ; audit_logs 1.
- Absence normale de trigger sur msg_blocks et msg_conversations dans le périmètre ciblé ; les contrôles de ces tables reposent notamment sur policies et fonctions.

Cette vérification confirme la présence des objets, pas leur comportement face à plusieurs utilisateurs.

## 3. Défaut de présentation corrigé

La première version du preflight traitait une agrégation de zéro trigger comme une présence. Le statut a été corrigé : zéro trigger est désormais indiqué comme `NO_TRIGGER`. Le rapport ne confond pas ce résultat avec un objet manquant.

## 4. Résultat de sécurité à retenir

Le préflight confirme que les tables sensibles sont bien sous RLS, mais FORCE RLS est désactivé. Les rôles propriétaires et les fonctions SECURITY DEFINER peuvent donc avoir des comportements distincts de ceux d'un élève connecté. Cela renforce la nécessité de tester sous `authenticated` avec des claims synthétiques, et de ne pas utiliser `postgres`/ `service_role` pour les tests ordinaires.

Le risque déjà identifié demeure : `msg_open_direct` et `msg_member_ok` ne matérialisent pas un consentement par invitation acceptée. Le préflight ne tente volontairement pas de provoquer ce chemin dans la base active.

## 5. État et limites

- Fichier ajouté : `tests/messenger/catalog_preflight.sql` (SELECT uniquement).
- Requête de référence exécutée en lecture seule sur les catalogues actifs.
- Aucune donnée de compte, profil, message, conversation, fichier ou journal applicatif consultée.
- Aucun test comportemental RLS multi-compte exécuté.
- Aucun DDL, INSERT, UPDATE, DELETE, migration, GRANT ou changement Auth/Storage/Realtime.
- Aucun projet de test créé, aucun frais engagé.
- PR #17 reste ouverte et non fusionnée ; main et production inchangées.

## 6. Étape suivante

Compléter le baseline des fonctions, policies et ACL par comparaison exacte avec les catalogues, puis écrire des tests comportementaux qui ne pourront être exécutés que sur une base isolée. La création d'un second projet Supabase Free reste en attente d'une autorisation explicite ; aucun service payant n'est envisagé.
