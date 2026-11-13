# Lot 421 — Préparation de l'audit du catalogue Supabase actif Messenger

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Nature :** audit statique complémentaire et préparation d'un export de catalogue strictement en lecture seule.  
**Décision de périmètre :** aucun accès à la base Supabase active pendant ce lot ; aucun SQL exécuté ; aucune donnée utilisateur lue.

## 1. Résultat exécutif

Le Lot 421 ne peut pas certifier l'état actif de Supabase : la session GitHub permet de lire le dépôt, pas d'affirmer qu'un script agrégé ou une migration archivée correspond au catalogue actuellement installé. L'audit statique approfondit néanmoins trois risques concrets qui doivent figurer dans le protocole de validation :

1. **La fonction agrégée `msg_can_dm` ne contrôle pas l'état de vérification scolaire.** Dans `supabase/msg_schema.sql`, elle compare wilaya/niveau/filière mais ne filtre pas `verif_statut = 'verifie'`. Le rapport Lot 399 documente une définition historique différente observée dans le catalogue vivant à cette date. La version active actuelle reste inconnue.
2. **Le contrôle agrégé `msg_not_blocked` est asymétrique par construction.** Il cherche un blocage où le membre de la conversation est `blocker_id` et l'expéditeur est `blocked_id`. Pour un envoi A→B, il vérifie donc notamment si B a bloqué A, mais ne vérifie pas si A a bloqué B. La règle produit une protection contre les messages envoyés par un compte bloqué, mais ne prouve pas que l'auteur d'un blocage ne peut plus lui-même écrire à la personne bloquée. Il faut établir la règle produit voulue puis tester les deux sens.
3. **Le SQL agrégé permet l'insertion d'une conversation directe par un utilisateur authentifié qui en est le créateur.** La policy `msg conv creation` ne réserve pas le type `direct` au modérateur. La policy d'ajout de membre n'autorise en principe l'insertion que de sa propre ligne, et le trigger direct vérifie l'éligibilité scolaire ; ces éléments ne prouvent toutefois pas l'existence d'un consentement du destinataire. Les RPC `SECURITY DEFINER` et les politiques actives doivent être vérifiées ensemble.

Ces constats décrivent le fichier agrégé du dépôt, **pas une preuve du catalogue actif**. Ils renforcent le statut NO-GO du Lot 420 : ne pas déclarer le Messenger privé terminé avant l'export actif et les tests isolés.

## 2. Éléments vérifiés dans la branche

### 2.1 `msg_can_dm`

Le fichier `supabase/msg_schema.sql` définit une fonction SQL `SECURITY DEFINER` qui compare les valeurs wilaya, niveau et filière et exige qu'elles soient renseignées. Cette définition ne contient pas de prédicat sur `profiles.verif_statut`.

Le même fichier contient une policy d'insertion de conversation qui autorise un utilisateur authentifié à créer une conversation si `auth.uid() = created_by` et si le type est `direct` ou si l'utilisateur est modérateur. La policy d'insertion des membres exige `auth.uid() = user_id` et `msg_member_ok`. Le trigger `msg_tr_direct` vérifie `msg_can_dm` lors de l'ajout du second membre.

**Conséquence :** les invariants statiques du dépôt ne doivent pas être confondus avec le contrôle de consentement. Une conversation créée avec un seul membre, puis complétée par une RPC privilégiée, doit être testée explicitement.

### 2.2 `msg_not_blocked`

Dans le SQL agrégé, la fonction examine les membres de la conversation qui ont bloqué l'expéditeur. Elle ne teste pas symétriquement les lignes où l'expéditeur a lui-même bloqué un autre membre.

**Décision de conception à confirmer :** le blocage doit-il empêcher seulement la personne bloquée d'écrire au bloqueur, ou empêcher toute communication dans les deux sens ? Pour une messagerie privée scolaire, recommandation : blocage bilatéral effectif sur l'envoi, la création/réouverture d'un DM et les invitations, sans effacer l'historique ni notifier la personne bloquée de manière révélatrice.

### 2.3 Tests CI

Le fichier `ci/check-msg.mjs` vérifie des chaînes du schéma agrégé, dont la présence des fonctions, policies, triggers et le garde-fou client `msg_invitation_requise`. `tests/msg_test.mjs` vérifie également des fragments textuels SQL.

Ces tests sont utiles comme contrôles de régression de dépôt, mais ne prouvent pas :
- les fonctions réellement installées sur Supabase ;
- les ACL effectives de chaque surcharge RPC ;
- l'absence d'une ancienne policy permissive qui se cumule avec une nouvelle policy ;
- les privilèges hérités via `PUBLIC` ;
- le comportement des triggers et fonctions `SECURITY DEFINER` ;
- le consentement, le blocage et la vérification avec plusieurs sessions authentifiées.

### 2.4 Vérification scolaire

Le client réel conserve le parcours historique : `msgRequestVerification(subscriptionNumber, section)` cherche un abonnement actif appartenant au compte et stocke son identifiant dans `profiles.matricule`. La file de supervision sélectionne également `matricule`.

La vérification scolaire gratuite et indépendante du paiement n'est donc toujours pas implémentée dans le client de cette branche. Ne pas réutiliser `matricule` sans analyse de compatibilité et de confidentialité.

## 3. Export de catalogue à demander — SQL SELECT uniquement

Le bloc ci-dessous est destiné à être exécuté par l'utilisateur dans le SQL Editor du projet Supabase existant, uniquement après son autorisation explicite pour cette lecture du catalogue. Il ne lit aucune ligne de profil, aucun message, aucun fichier et aucune donnée Auth personnelle. Il ne contient ni DDL ni DML. Les résultats doivent être expurgés de toute URL/secret éventuellement ajouté par l'outil avant partage.

### A. Fonctions/RPC concernées : signatures, propriétaire, sécurité et définition

```sql
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  pg_get_function_result(p.oid) as result_type,
  pg_get_userbyid(p.proowner) as owner_name,
  p.prosecdef as security_definer,
  p.provolatile as volatility,
  p.proconfig as function_settings,
  coalesce(p.proacl::text, '(default ACL)') as function_acl,
  pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    p.proname ilike 'msg_%'
    or p.proname ilike '%verif%'
    or p.proname ilike '%block%'
    or p.proname ilike '%invitation%'
  )
order by p.proname, identity_arguments;
```

### B. Droits EXECUTE effectifs exposés par les ACL des fonctions

```sql
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  coalesce(grantee.rolname, 'PUBLIC') as grantee,
  x.privilege_type,
  x.is_grantable
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) x
left join pg_roles grantee on grantee.oid = x.grantee
where n.nspname = 'public'
  and x.privilege_type = 'EXECUTE'
  and (
    p.proname ilike 'msg_%'
    or p.proname ilike '%verif%'
    or p.proname ilike '%block%'
    or p.proname ilike '%invitation%'
  )
order by p.proname, identity_arguments, grantee;
```

### C. Policies RLS sur les tables de profils et de messagerie

```sql
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
  and (
    tablename in (
      'profiles', 'msg_conversations', 'msg_members', 'msg_messages',
      'msg_blocks', 'msg_attachments', 'msg_reports'
    )
    or tablename = 'objects'
  )
order by schemaname, tablename, policyname;
```

### D. Triggers et fonctions appelées

```sql
select
  ns.nspname as schema_name,
  tbl.relname as table_name,
  trg.tgname as trigger_name,
  pg_get_triggerdef(trg.oid, true) as trigger_definition,
  fn_ns.nspname as function_schema,
  fn.proname as function_name,
  pg_get_function_identity_arguments(fn.oid) as function_arguments,
  fn.prosecdef as function_security_definer,
  fn.proconfig as function_settings
from pg_trigger trg
join pg_class tbl on tbl.oid = trg.tgrelid
join pg_namespace ns on ns.oid = tbl.relnamespace
join pg_proc fn on fn.oid = trg.tgfoid
join pg_namespace fn_ns on fn_ns.oid = fn.pronamespace
where not trg.tgisinternal
  and ns.nspname in ('public', 'storage')
  and (
    tbl.relname in (
      'profiles', 'msg_conversations', 'msg_members', 'msg_messages',
      'msg_blocks', 'msg_attachments', 'msg_reports'
    )
    or (ns.nspname = 'storage' and tbl.relname = 'objects')
  )
order by ns.nspname, tbl.relname, trg.tgname;
```

### E. RLS activé et forcé sur les tables concernées

```sql
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  pg_get_userbyid(c.relowner) as table_owner
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('public', 'storage')
  and (
    c.relname in (
      'profiles', 'msg_conversations', 'msg_members', 'msg_messages',
      'msg_blocks', 'msg_attachments', 'msg_reports'
    )
    or (n.nspname = 'storage' and c.relname = 'objects')
  )
order by n.nspname, c.relname;
```

**Note :** les ACL de fonctions peuvent être héritées de `PUBLIC` et les politiques RLS peuvent être permissives ou restrictives. L'audit devra interpréter ensemble ACL, rôle, `SECURITY DEFINER`, `search_path`, policies cumulatives, triggers et propriétaires. La présence d'une fonction dans `pg_proc` ne prouve pas qu'elle est exposée par PostgREST ; son schéma, son grant et la configuration Data API doivent aussi être rapprochés.

## 4. Matrice de tests PostgreSQL isolés après baseline

Aucun test ne doit être lancé sur les comptes réels. Après reconstruction d'une baseline fidèle dans un PostgreSQL local sans coût, utiliser des identités synthétiques distinctes et des sessions JWT simulées :

| Scénario | Résultat attendu |
|---|---|
| Élève vérifié + abonnement inactif | Accès forum conservé ; DM seulement après consentement |
| Élève non vérifié + abonnement actif | Vérification gratuite possible ; pas de DM avant validation et consentement |
| Invitation A→B en attente | Aucun DM partagé ni message possible |
| B accepte | DM créé/accessible aux deux membres |
| B refuse ou invitation expire | Aucun DM créé ; réinvitation limitée |
| A bloque B | Aucun message ni nouvelle invitation dans les deux sens selon la règle bilatérale retenue |
| B bloque A | Même résultat, indépendamment du sens de l'appel |
| RPC directe / INSERT direct / ajout membre | Aucun contournement du consentement |
| Ancien DM | Politique de compatibilité explicite ; blocage toujours effectif |
| Agent d'une wilaya | Accès limité à son périmètre ; aucun accès aux pièces hors mandat |
| Modérateur social | Modération sans accès au numéro scolaire ou aux preuves d'identité |

## 5. Décisions et limites

- **NO-GO maintenu** pour la déclaration de fin de Messenger privé.
- Le forum `ملتقى الطلاب` doit rester gratuit pour les comptes élèves actifs ; ni vérification ni abonnement ne doivent être ajoutés comme condition d'accès de base.
- La vérification scolaire reste gratuite et séparée de l'abonnement.
- Les messages privés exigent la vérification scolaire, puis l'acceptation explicite du destinataire.
- Le blocage doit être vérifié côté serveur sur toutes les voies.
- Aucune connexion au projet Supabase actif, aucune lecture de lignes de données, aucun SQL exécuté, aucune modification Auth/RLS/schéma/GRANT/migration/Storage/Realtime/paiement.
- Aucun changement applicatif, aucun déploiement Cloudflare, aucun changement de `main`, aucune fusion PR #17.

## 6. Dépendances avant le Lot 422

1. Autorisation distincte de l'utilisateur pour consulter en lecture seule le catalogue du projet Supabase actif, ou remise de l'export des cinq requêtes ci-dessus.
2. Sortie PowerShell du Lot 419 pour savoir si PostgreSQL/Docker/WSL existe déjà sur le PC. Sans ce résultat, ne rien installer.
3. Baseline SQL complète et vérifiée, sans données personnelles, avant toute reconstruction locale.

Le prochain lot pourra comparer l'export réel aux scripts du dépôt, identifier les RPC effectivement exposées et produire une matrice d'écarts sans appliquer de changement.
