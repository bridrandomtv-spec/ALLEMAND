# Lot 373 — dépendance audit_logs et immutabilité des journaux

Date : 13 novembre 2026  
Source : catalogues PostgreSQL Supabase actif, SELECT uniquement. Aucune donnée d'audit réelle consultée.

## 1. Table audit_logs

Structure active extraite :
- `id bigint` (PK), `at timestamptz NOT NULL DEFAULT now()`
- `acteur uuid` nullable
- `action text NOT NULL`
- `cible_type text NOT NULL DEFAULT ''`
- `cible_id text NOT NULL DEFAULT ''`
- `avant jsonb`, `apres jsonb` nullable
- `wilaya text NOT NULL DEFAULT ''`
- RLS activé ; FORCE RLS désactivé.
- Séquence `audit_logs_id_seq`, bigint, départ 1, incrément 1.
- Index primaire unique sur id.

Policy SELECT unique observée : acteur peut lire ses propres entrées ; un agent ayant `reports.read` peut lire les entrées des wilayas autorisées via `admin_can` et `admin_sees_wilaya`.
Aucune policy INSERT/UPDATE/DELETE n'a été retournée pour authenticated.

ACL observée :
- authenticated : SELECT uniquement.
- service_role : privilèges de table complets, non grantables.
- postgres : privilèges de propriétaire.

## 2. Fonction audit_log et trigger

`audit_log(action,cible_type,cible_id,avant,apres,wilaya)` est SECURITY DEFINER, search_path `pg_catalog,public`, et insère une ligne dans `public.audit_logs` avec `acteur=auth.uid()`. EXECUTE est accordé à postgres et service_role, pas à authenticated.

Trigger `audit_logs_tr_immuable` : BEFORE DELETE OR UPDATE, appelle `immutable_row()`.
Cette fonction SECURITY DEFINER :
- retourne OLD si `auth.uid()` est NULL (contexte d'exploitation serveur/SQL) ;
- sinon lève une exception `ligne_immuable_<table>`.
ACL d'exécution : fonction interne à conserver comme dépendance trigger, pas à exposer aux utilisateurs.

## 3. Pourquoi c'est nécessaire au baseline Messenger

Le trigger `profiles_tr_audit_role` appelle `audit_log` lorsque le rôle d'un profil change. Omettre `audit_logs`, `audit_log`, `immutable_row`, leur séquence, policy, ACL ou trigger rendrait la restauration incomplète et pourrait faire échouer les tests de modification de profil.

## 4. Tests synthétiques à ajouter

- authenticated ne peut ni insérer directement, ni modifier, ni supprimer une ligne audit.
- Un acteur ne lit que ses entrées, sauf permission/scoping d'audit accordés.
- service_role peut exécuter le chemin d'audit serveur dans un contexte de test.
- Une tentative UPDATE/DELETE authentifiée sur audit_logs déclenche `ligne_immuable_audit_logs`.
- Une modification de rôle autorisée provoque un événement d'audit ; une mutation refusée ne doit pas laisser une entrée partielle.
- Tester le comportement de `auth.uid() IS NULL` uniquement en environnement isolé, car il représente un contexte privilégié.

## 5. État

- Structure, PK, index, séquence, policy, ACL et trigger d'audit extraits.
- Aucun journal réel lu.
- Aucun test PostgreSQL exécuté.
- Aucun changement du projet actif ; aucun coût engagé ; aucun projet de test créé.
- PR #17 reste ouverte et non fusionnée ; main/production inchangées.
