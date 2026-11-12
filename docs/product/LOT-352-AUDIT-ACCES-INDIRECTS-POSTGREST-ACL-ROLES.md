# LOT 352 — Audit des accès indirects PostgREST, rôles hérités et ACL par défaut

Date : 12 novembre 2026  
Projet Supabase : `azjwcybivirvpxbfhyzk`  
Nature : inspection catalogue PostgreSQL en lecture seule.

## 1. Décision

**NO-GO maintenu pour ouverture nationale et migration en production.**

Le lot 352 complète la revue des accès Messenger en examinant les routines publiques qui référencent les tables `msg_*`, les vues exposées, les privilèges de rôles, les schémas PostgREST et les ACL par défaut.

Aucune écriture n'a été effectuée.

## 2. Exposition directe des tables Messenger

Les sept tables contrôlées (`msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`) ont :
- RLS activée ;
- FORCE ROW LEVEL SECURITY désactivé ;
- aucun privilège SELECT ou INSERT direct pour `anon` ;
- privilèges SELECT et INSERT pour `authenticated`, sous réserve des policies RLS.

Cela confirme que le rôle anonyme ne peut pas interroger/insérer directement dans ces tables avec les privilèges observés. Le rôle authentifié atteint les policies, qui restent la frontière ligne par ligne. FORCE RLS désactivé n'est pas en soi une vulnérabilité pour les élèves : les rôles privilégiés/propriétaires doivent être considérés séparément.

## 3. Routines exposées qui référencent Messenger

Recherche catalogue de fonctions `public` et `graphql_public` exécutables par anon ou authenticated et dont le corps contient une référence `msg_*` :

### 3.1 `admin_dashboard()`

- SECURITY DEFINER, propriétaire postgres, search_path fixé à `pg_catalog, public`.
- EXECUTE authenticated : oui ; anon : non.
- La fonction vérifie d'abord `admin_can(auth.uid(), 'reports.read')`.
- Elle renvoie des agrégats administratifs, dont le nombre de signalements ouverts, calculé depuis `msg_reports` et `msg_messages`, limité au périmètre de wilayas ou au périmètre national selon le droit administratif.
- Aucun corps de message, contenu de pièce jointe, ni identité de reporter n'est renvoyé par cette métrique.
- À tester avec compte élève, modérateur local, admin wilaya et admin général : le refus doit être effectif pour les rôles non autorisés et le périmètre doit rester cloisonné.

Cette fonction est un accès indirect à des agrégats Messenger, pas une voie de création de DM. Son garde-fou dépend des fonctions administratives appelées ; leur audit d'autorisation doit précéder toute modification.

### 3.2 Fonctions Messenger directement exposées

Les fonctions `msg_open_direct`, `msg_can_dm`, `msg_is_member`, `msg_is_moderator`, `msg_member_ok` et `msg_not_blocked` sont exécutables par authenticated et non par anon dans l'état inspecté.

- `msg_open_direct` demeure une voie RPC de création DM sans invitation acceptée.
- Les fonctions de contrôle vérifient pour la plupart que l'identifiant utilisateur fourni correspond à `auth.uid()`; cela limite les appels de contrôle à l'identité courante, mais ne transforme pas leurs règles métier en preuve d'affiliation.
- Les fonctions trigger `msg_guard_direct`, `msg_logfn`, `msg_rate_limit`, `msg_touch_conversation_fn` et `msg_tr_taille_fn` ne sont pas exécutables directement par authenticated/anon ; elles sont invoquées par leurs triggers.

Aucune vue ou vue matérialisée de `public`/ `graphql_public` dont la définition référence les tables Messenger n'a été trouvée par la recherche catalogue effectuée.

## 4. Rôles, héritage et bypass RLS

État observé :
- `anon` : non-superuser, INHERIT, pas de rôle parent, BYPASSRLS false.
- `authenticated` : non-superuser, INHERIT, pas de rôle parent, BYPASSRLS false.
- `service_role` : non-superuser, INHERIT, BYPASSRLS true.
- `authenticator` : membre de anon, authenticated et service_role, mais INHERIT false ; il sert de rôle de connexion au routage API et ne doit pas être confondu avec le JWT d'un élève.
- `postgres) : rôle administrateur avec BYPASSRLS true et héritage de rôles gérés par la plateforme.

Aucune appartenance héritée de `anon` ou `authenticated` à un rôle privilégié n'a été trouvée. Le rôle `service_role` contourne RLS : sa clé ne doit jamais être exposée au navigateur et son usage doit rester côté serveur de confiance.

Les schémas `public`, `graphql`, `graphql_public` et `storage` accordent USAGE aux rôles anon/authenticated/service_role. USAGE sur un schéma n'accorde pas automatiquement SELECT sur ses tables.

## 5. ACL par défaut — point de vigilance de migration

Les ACL par défaut du schéma `public` diffèrent selon le propriétaire créateur des futurs objets :

| Propriétaire des futurs objets | Fonctions | Tables | Séquences |
|---|---|---|---|
| `supabase_admin` | EXECUTE par anon, authenticated, service_role | privilèges complets listés pour anon, authenticated, service_role | usage/select/update accordés aux trois |
| `postgres` | EXECUTE par postgres et service_role seulement | privilèges postgres/service_role seulement | usage/select/update postgres/service_role seulement |

Conséquence : une future fonction créée sous le propriétaire `supabase_admin` pourrait hériter d'EXECUTE pour anon/authenticated par ACL par défaut, alors qu'une fonction créée par postgres n'a pas les mêmes ACL par défaut. Il faut donc contrôler le propriétaire effectif de la migration et révoquer explicitement les droits non nécessaires dans la migration elle-même. Ne jamais supposer que les ACL d'un objet existant s'appliquent à un objet futur.

Cette différence doit figurer dans le runbook de déploiement et dans les tests post-migration. Le présent lot n'a changé aucune ACL.

## 6. Configuration PostgREST

Les paramètres PostgREST n'étaient pas exposés dans `pg_settings` sous les noms recherchés ; cela ne permet pas de conclure quels schémas sont configurés dans la couche API. Les schémas `public` et `graphql_public` ont été inspectés dans le catalogue SQL, mais la configuration effective du service doit être confirmée via les paramètres Supabase/API appropriés avant migration.

Aucun test HTTP/PostgREST authentifié ou anonyme n'a été exécuté dans ce lot.

## 7. Conséquences et tests à ajouter

- RPC-03 : compte anon appelle toutes les fonctions Messenger exposées — refus.
- RPC-04 : compte élève appelle `admin_dashboard()` — refus.
- RPC-05 : comptes admin autorisés voient uniquement leurs agrégats/périmètres.
- ACL-01 : migration exécutée sous le propriétaire prévu ; ACL de la fonction d'invitation contrôlées après création.
- ACL-02 : aucun EXECUTE PUBLIC/anon ; authenticated uniquement sur la RPC publique d'acceptation nécessaire.
- ACL-03 : helper privé non exécutable par anon/authenticated/service_role sauf besoin interne explicitement démontré.
- ACL-04 : aucune clé service_role dans le bundle navigateur, variables publiques ou logs clients.
- API-01 : tests HTTP PostgREST avec JWT anon, élève, modérateur et administrateur.
- API-02 : vérifier la configuration réelle des schémas exposés et la publication GraphQL.
- HIST-03 : aucune fonction d'agrégat ou vue ne révèle contenu ou identifiants hors périmètre.
- Rejouer les tests des lots 349–351 pour prouver la fermeture conjointe des trois chemins DM.

Ces tests sont des critères futurs ; ils ne sont pas exécutés par l'inspection SQL.

## 8. Limites

- SELECT catalogue uniquement ; aucun profil personnel, message, pièce jointe ou contenu de signalement lu.
- Aucune écriture SQL/DDL, migration, policy, GRANT, Auth, Storage ou Realtime.
- Pas de test HTTP PostgREST, pas de test multi-compte, pas de vérification des secrets du bundle en production dans ce lot.
- L'inventaire des références SQL repose sur les corps de fonctions stockés ; il ne prouve pas l'absence de SQL dynamique indirect non détecté.
- Pas de certification de sécurité.

## 9. État

- Rapport documentaire uniquement.
- Aucun déploiement Cloudflare, aucun changement main, aucun merge PR #17.
- Aucun environnement ou ressource payante créée.
- MFA/2FA et facturation hors périmètre.
