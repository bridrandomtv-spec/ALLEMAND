# Lot 424 — Revue technique des scripts d'export et de préflight Messenger

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Type :** revue statique des scripts SQL versionnés ; aucun script exécuté.  
**Statut :** revue terminée ; aucune preuve nouvelle sur le catalogue actif.

## 1. Synthèse

Les quatre scripts de `tests/messenger/` sont complémentaires, mais aucun ne doit être utilisé seul comme certificat de sécurité.

- `catalog_preflight.sql` : inventaire rapide de présence, RLS, nombre/noms de policies et signatures de fonctions.
- `baseline_catalog_export.sql` : export détaillé des tables, colonnes, contraintes, index, policies, triggers, fonctions et ACL relation/colonne.
- `export_catalog_manifest.sql` : empreinte JSON compacte, utile pour comparer deux catalogues, mais sans grants ni colonnes.
- `baseline_structure_check.sql` : contrôle de présence et de comptage par rapport à une baseline codée en dur, pas validation des expressions de sécurité.

La suite doit conserver ces scripts comme outils de diagnostic, puis compléter les sorties manquantes avant tout verdict. Aucun changement de ces scripts n'est nécessaire pour constater les lacunes ; elles sont documentées ici.

## 2. Défauts de couverture et risques de faux sentiment de sécurité

### 2.1 `catalog_preflight.sql`

Observations :
- Le CTE `policy_state` ne retourne que les tables ayant au moins une policy. Une table sans aucune policy ne produit pas de ligne `NO_POLICY`.
- Le CTE `trigger_state` ne retourne que les tables ayant au moins un trigger. Une table sans trigger ne produit pas de ligne `NO_TRIGGER`.
- Les fonctions sont listées par un ensemble fixe de noms. Une fonction auxiliaire ou une surcharge oubliée peut ne pas apparaître.
- Le préflight indique si au moins une surcharge est `SECURITY DEFINER`, mais ne détaille pas chaque surcharge, propriétaire, ACL, `search_path` ni définition.
- Il ne lit pas les expressions `USING` et `WITH CHECK` des policies.

Conséquence : un rapport de préflight qui ne contient pas de ligne pour une policy ou un trigger n'est pas nécessairement un succès ; l'objet peut simplement être absent du résultat agrégé.

### 2.2 `baseline_catalog_export.sql`

Couverture utile :
- colonnes, types, defaults, identity/generated ;
- contraintes et index ;
- définitions des policies et triggers ;
- définitions des fonctions ciblées, propriétaire, `SECURITY DEFINER`, volatilité, paramètres de configuration et ACL brutes ;
- grants de relations et privilèges de colonnes ;
- extensions et appartenance de certaines tables à une publication Realtime.

Lacunes :
- les policies et triggers sont limités au schéma `public` ; les policies Storage sur `storage.objects` ne sont pas exportées ;
- la liste des fonctions est ciblée et ne constitue pas l'inventaire exhaustif de toutes les fonctions appelables ou auxiliaires ;
- les ACL des fonctions sont rendues sous forme `proacl` brute, sans expansion par rôle/grantee/EXECUTE ; les rôles et appartenances de rôles ne sont pas inventoriés ;
- les privilèges des séquences, vues, schémas et objets annexes ne sont pas couverts de façon générale ;
- le script ne prouve pas quelles fonctions sont exposées via la Data API/PostgREST ni les schémas exposés dans la configuration Supabase ;
- la liste de tables ciblées doit être rapprochée des dépendances réelles, et non considérée exhaustive.

Conséquence : l'export est une bonne base de comparaison SQL, mais pas un export complet des autorisations Supabase ni de l'API exposée.

### 2.3 `export_catalog_manifest.sql`

Observations :
- le manifeste capture tables/RLS, policies, triggers, contraintes, index et fonctions d'une liste fixe ;
- il n'inclut pas les colonnes, les grants relation/colonne/fonction, les rôles, les appartenances de rôles, ni les policies Storage ;
- la liste des fonctions n'est pas identique à celle de l'export détaillé : elle omet notamment `msg_is_member` et `msg_is_moderator`, qui sont inclus dans `baseline_catalog_export.sql`.

Conséquence : deux catalogues peuvent produire un manifeste identique alors que des privilèges ont changé. Utiliser le manifeste comme empreinte structurelle uniquement, jamais comme preuve d'équivalence de sécurité.

### 2.4 `baseline_structure_check.sql`

Observations :
- il compare les nombres attendus de policies et de triggers, puis la présence de fonctions et colonnes ;
- il ne compare pas le contenu des policies, leur mode permissif/restrictif, les rôles visés, les expressions `USING`/`WITH CHECK`, les grants ou les ACL des RPC ;
- le comptage des triggers ne vérifie pas leur état d'activation (`tgenabled`) ;
- le test de présence d'une fonction ne vérifie pas ses surcharges, arguments, propriétaire, `SECURITY DEFINER`, `search_path` ou droits `EXECUTE` ;
- un total conforme (12 tables, 30 policies, 14 triggers selon les valeurs codées) ne prouve pas que ce sont les bonnes policies et les bons triggers ;
- les nombres codés en dur doivent être comparés à une baseline approuvée et datée. Un changement de structure peut être légitime, mais ne doit pas être accepté automatiquement.

Conséquence : un résultat `PASS` signifie seulement que les critères de présence/comptage codés dans le script sont satisfaits.

## 3. Couverture à ajouter à l'export de métadonnées

Pour le périmètre Messenger, l'export complet devra inclure les éléments suivants, tous sans lignes applicatives :

| Domaine | Métadonnées requises |
|---|---|
| Tables | Colonnes, types, contraintes, index, RLS activé/forcé, propriétaire |
| Policies | Toutes les policies public + storage pertinentes, commande, rôles, permissive/restrictive, USING, WITH CHECK |
| Triggers | Définition, fonction appelée, état activé/désactivé, propriétaire et sécurité de la fonction |
| Fonctions | Toutes les surcharges et fonctions auxiliaires appelées, identité d'arguments, résultat, langage, propriétaire, SECURITY DEFINER, search_path, définition |
| ACL RPC | EXECUTE par rôle, PUBLIC, grantor, grant option, ACL par défaut |
| ACL objets | Tables, colonnes, séquences, schémas, vues et autres objets utilisés par les chemins Messenger |
| Rôles | Rôles applicatifs pertinents, memberships et attributs de rôle sans secrets |
| API | Schémas exposés, configuration Data API/PostgREST disponible, RPC réellement exposées |
| Storage | Buckets et policies Storage pertinentes, sans liste d'objets ni métadonnées privées |
| Realtime | Publications et tables Messenger effectivement abonnées |

Ne pas extraire les lignes de `profiles`, `auth.users`, messages, conversations, journaux, pièces jointes ou demandes de vérification.

## 4. Faits historiques à conserver avec leur date

Le rapport Lot 399 consigne des constats issus d'une inspection en lecture seule du catalogue actif au Lot 398 :
- `msg_not_blocked(cid, snd)` est utilisé par la policy d'insertion des messages et vérifie le sens où un membre a bloqué l'expéditeur, sans couvrir explicitement le sens inverse ;
- `msg_open_direct(p_other)` appelle `msg_can_dm`, puis réutilise ou crée une conversation et ajoute les membres ;
- `msg_can_dm` exigeait alors des profils vérifiés et l'égalité wilaya/niveau/filière ; aucun contrôle explicite du blocage ou d'une invitation sociale acceptée n'avait été trouvé dans cette fonction.

Ces faits sont des observations historiques datées du Lot 398. Ils ne doivent pas être présentés comme une lecture fraîche du catalogue au 13 novembre 2026. Ils doivent être confrontés à un export actuel avant toute décision technique.

## 5. Protocole recommandé pour le prochain export

Après autorisation explicite limitée à la lecture du catalogue actif, ou réception d'un export préparé par l'utilisateur :

1. Exécuter `catalog_preflight.sql` pour repérer rapidement les objets absents.
2. Exécuter chaque SELECT de `baseline_catalog_export.sql` séparément et conserver les résultats complets.
3. Extraire séparément toutes les surcharges et fonctions dépendantes du périmètre, avec ACL développées via `aclexplode`.
4. Compléter les policies et triggers du schéma `storage` et les grants des séquences/schémas.
5. Obtenir les métadonnées de configuration des schémas exposés par la Data API sans révéler de secrets.
6. Produire `export_catalog_manifest.sql` sur l'environnement source et sur la baseline locale ; comparer aussi les exports détaillés.
7. N'exécuter `baseline_structure_check.sql` qu'après approbation explicite de la baseline et interpréter ses PASS comme des contrôles de présence seulement.

## 6. Décision

- Outils existants conservés : ils restent utiles et aucun n'a été exécuté dans ce lot.
- Aucun patch SQL ou applicatif ajouté.
- Pas de preuve fraîche du catalogue Supabase actif.
- Pas de preuve comportementale RLS/multi-comptes.
- **NO-GO maintenu** pour déclarer Messenger privé terminé ou appliquer une migration de production.

## 7. Actions non réalisées

Aucun accès Supabase actif, aucune requête exécutée, aucune lecture de ligne applicative, aucun changement de données, schéma, Auth, RLS, GRANT, RPC, trigger, Storage, Realtime ou paiement ; aucune installation, dépense, déploiement Cloudflare, modification de `main`, rebase ou fusion PR #17.
