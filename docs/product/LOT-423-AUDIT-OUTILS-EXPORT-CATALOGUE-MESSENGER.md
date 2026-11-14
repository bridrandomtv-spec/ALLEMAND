# Lot 423 — Audit des outils d'export du catalogue et correction des références

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Nature :** audit statique des scripts d'extraction déjà présents et des chemins d'archives.  
**Statut :** scripts présents ; exécution sur Supabase actif non autorisée/non réalisée.

## 1. Correction de traçabilité

Le Lot 421 avait proposé cinq requêtes SELECT autonomes comme préparation d'un export. L'examen plus approfondi de l'arbre GitHub montre que le dépôt contient déjà des outils plus complets, issus des lots antérieurs. Les migrations archivées ne sont pas sous `supabase/migrations/` : elles sont sous `docs/architecture/migration-archive/`.

Références exactes :
- `tests/messenger/catalog_preflight.sql`
- `tests/messenger/baseline_catalog_export.sql`
- `tests/messenger/export_catalog_manifest.sql`
- `tests/messenger/baseline_structure_check.sql`
- `docs/architecture/LOT-342-MANIFEST-ARCHIVE-MIGRATIONS-MESSENGER.md`
- `docs/architecture/migration-archive/`

Cette correction de chemin ne change pas le fait que ces archives ne doivent pas être rejouées sur la base active.

## 2. Audit des scripts existants

### 2.1 `catalog_preflight.sql`

- SELECT uniquement.
- Contrôle présence de tables, RLS activé/forcé, nombre/noms de policies, triggers et signatures d'un ensemble ciblé de fonctions.
- Produit un résumé de présence ; ne fournit pas les définitions SQL, ACL détaillées, rôles/grants ou dépendances.
- Le nombre de policies ne prouve pas que les policies sont sûres : il faut lire leurs expressions et tenir compte des règles permissives/restrictives cumulées.

**Usage recommandé :** premier diagnostic structurel sur une base isolée ou, après autorisation, sur le catalogue actif ; ne suffit pas comme preuve finale.

### 2.2 `baseline_catalog_export.sql`

- SELECT uniquement et commentaire explicite interdisant l'export des lignes de profils, Auth, messages, conversations et journaux.
- Extrait les colonnes/defaults, contraintes, index, policies, triggers et définitions de fonctions.
- Extrait les ACL de relations et les privilèges de colonnes.
- Enregistre extensions et appartenance à la publication Realtime pour les tables ciblées.
- La liste des fonctions est ciblée et ne couvre pas automatiquement toutes les surcharges/fonctions auxiliaires pouvant être appelées indirectement.
- Les ACL de fonctions sont exposées en texte `proacl`, mais une expansion par grantee/privilege et l'inventaire des rôles rendent la revue plus lisible.
- Le script ne constitue pas un dump restaurable et ne capture pas l'ensemble du projet Supabase (Auth, Storage, secrets/configuration, paramètres Data API, tous les schémas et toutes les dépendances externes).

**Usage recommandé :** export principal de métadonnées, à compléter par l'inventaire des rôles et l'expansion ACL des fonctions.

### 2.3 `export_catalog_manifest.sql`

- SELECT uniquement ; produit un manifeste JSON des tables, policies, triggers, contraintes, index et fonctions ciblés.
- Très pratique pour comparer un catalogue actif à une copie locale.
- Son manifeste est plus compact que l'export détaillé ; il ne contient pas les grants relation/colonne/fonction, et sa liste de fonctions est explicitement limitée.
- Il ne doit pas remplacer l'export détaillé pour une revue de sécurité.

**Usage recommandé :** empreinte comparative, pas audit exhaustif des autorisations.

### 2.4 `baseline_structure_check.sql`

- SELECT uniquement ; produit des PASS/FAIL/INFO fondés sur le nombre attendu de tables, policies et triggers et la présence de fonctions/colonnes.
- C'est un contrôle de cohérence par rapport à une baseline codée en dur.
- Les nombres attendus peuvent être obsolètes si une migration légitime a ajouté ou retiré une policy/trigger.
- Un PASS de présence et de comptage ne prouve ni la sûreté des expressions RLS, ni les ACL, ni l'absence de chemins RPC alternatifs.

**Usage recommandé :** contrôle de dérive après comparaison avec la baseline approuvée, pas verdict de sécurité isolé.

## 3. Sources d'archives : localisation correcte

Les trois fichiers archivés déjà examinés sont :
- `docs/architecture/migration-archive/20261030131545_harden_messages_attachments_sponsors_and_direct_rpc.sql`
- `docs/architecture/migration-archive/20261030132222_secure_direct_message_membership.sql`
- `docs/architecture/migration-archive/20261030132512_close_direct_chat_join_and_lock_trigger_functions.sql`

Le premier contient une RPC `msg_open_direct(uuid)` accordée à `authenticated`, avec vérification `msg_can_dm`, mais sans preuve explicite d'une invitation acceptée dans ce corps SQL. Les deux suivants durcissent l'ajout de membres directs et les triggers. Ils n'établissent pas à eux seuls le catalogue actif ni le respect du nouveau consentement exigé par la décision produit.

Les archives sont des références historiques et des éléments de comparaison. Ne pas les exécuter ni les rejouer.

## 4. Séquence d'export recommandée

Sur le projet Supabase existant, après autorisation explicite limitée à la lecture du catalogue, exécuter dans cet ordre :
1. `catalog_preflight.sql` pour confirmer la structure générale.
2. `baseline_catalog_export.sql` pour obtenir les définitions détaillées et les ACL des relations/colonnes.
3. Ajouter une extraction exhaustive de `pg_proc` et `aclexplode(proacl)` pour toutes les fonctions du périmètre Messenger, y compris surcharges et fonctions auxiliaires.
4. Exporter les policies et triggers des schémas `public` et `storage`, les buckets/policies Storage sans lignes d'objets, et la publication Realtime.
5. `export_catalog_manifest.sql` pour créer une empreinte compacte qui sera comparée à la base locale.
6. `baseline_structure_check.sql` seulement après validation de la baseline attendue.

Ne pas partager de secrets, JWT, URL avec clés, variables d'environnement ou données personnelles. Le résultat attendu est du DDL/catalogue uniquement.

## 5. Comparaison de branches — constat GitHub

La comparaison actuelle `main...design/prototypes-67-74-alignment` renvoie :
- branche de travail : **2 385 commits en avance** ;
- branche de travail : **4 commits en retard** sur `main` ;
- état de comparaison : `diverged`.

Cette information ne signifie pas que la PR est fusionnée. Elle signifie qu'il existe quatre commits de `main` absents de la branche de travail au moment du contrôle.

**Aucune synchronisation/rebase/merge ne sera effectuée** sans autorisation explicite. La PR #17 doit rester ouverte et non fusionnée conformément à la consigne existante. Le fait que le compare endpoint indique `diverged` n'est pas une recommandation de rebase automatique.

Aucun workflow run n'a été retourné pour le nouveau commit de continuité Lot 422 au moment de ce contrôle. Ne pas annoncer de CI réussie pour les Lots 421–423 sur la seule base des succès antérieurs.

## 6. Limites et actions

- Aucun script SQL n'a été exécuté sur Supabase actif ou local.
- Aucun accès à des lignes applicatives, comptes Auth, profils, messages ou fichiers.
- Aucun changement Auth, RLS, grants, fonctions, triggers, schéma, Storage, Realtime ou paiements.
- Aucun projet/compute payant, aucune installation PC, aucun déploiement Cloudflare.
- Aucun changement sur `main), aucun rebase, aucune fusion PR #17.

## 7. Prochaine étape — Lot 424

Après réception de l'autorisation de lecture seule ou de l'export catalogue expurgé, comparer les définitions actives aux archives et scripts agrégés, puis classer chaque différence comme :
- identique ;
- différence attendue/documentée ;
- divergence non expliquée ;
- risque potentiel nécessitant test isolé ;
- non vérifiable avec l'export fourni.

En parallèle, récupérer la sortie PowerShell du Lot 419 pour confirmer l'existence éventuelle d'un PostgreSQL/Docker/WSL déjà installé. Aucun nouvel outil ne sera installé sans consentement.
