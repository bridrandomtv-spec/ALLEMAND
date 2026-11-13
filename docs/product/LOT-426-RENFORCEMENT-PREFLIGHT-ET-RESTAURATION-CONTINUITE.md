# Lot 426 — Renforcement du préflight et restauration documentaire

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Nature :** amélioration d'un script de diagnostic SELECT-only et vérification de la continuité documentaire.

## 1. Correction du préflight Messenger

Fichier modifié : `tests/messenger/catalog_preflight.sql`.

Le préflight utilisait auparavant des agrégations sur `pg_policies` et `pg_trigger` sans partir de la liste des tables attendues. Une table ayant zéro policy ou zéro trigger ne produisait donc aucune ligne de diagnostic.

Correction apportée :
- ajout d'un périmètre explicite des relations attendues, comprenant les 12 tables publiques suivies et `storage.objects` ;
- `LEFT JOIN` depuis ce périmètre vers `pg_policies`, pour retourner également les relations ayant zéro policy ;
- `LEFT JOIN` vers les catalogues de tables et triggers, pour retourner les relations ayant zéro trigger ;
- statut explicite `NO_POLICY` lorsque le compte est égal à zéro.

Commits :
- `dbc660940f82b82655ca89ef717718577954b5de` — préflight avec résultats zéro-policy/zéro-trigger ;
- `cda3d9f26af4b9583b5d786f405254788f3554ef` — correction du statut `NO_POLICY` pour tester le compte égal à zéro.

Cette amélioration évite de confondre une absence de ligne dans le résultat et une validation positive. Les nombres de policies/triggers restent descriptifs : ils ne valident pas le contenu des expressions RLS.

## 2. Contrôle de l'environnement d'exécution disponible ici

Le runtime de travail utilisé pour cette revue ne dispose pas de `psql`, `postgres`, Docker ni de `pglast` détectables. Ce constat concerne uniquement ce runtime, pas l'ordinateur Windows de l'utilisateur.

La disponibilité de PostgreSQL, Docker ou WSL sur le PC reste inconnue tant que la sortie PowerShell du Lot 419 n'a pas été fournie. Aucun logiciel n'a été installé.

## 3. Restauration du dossier de continuité

Le fichier de continuité avait dépassé la limite de restitution du connecteur GitHub après ajout des entrées récentes ; il apparaissait vide dans les lectures API, alors que les mises à jour avaient créé des commits. Pour rétablir un état vérifiable :
- restauration du contenu historique complet depuis le commit non vide `d3f64f601330f93fbc01d4c133c1d8db1910895b` ;
- contrôle après restauration : contenu récupéré, 1 013 360 caractères, historique présent jusqu'au Lot 422 ;
- les lots 423 à 426 sont regroupés dans un addendum distinct afin de conserver le fichier de continuité principal sous la limite de restitution.

La restauration vérifiée a été effectuée au commit `174c3a010d13dd64070dd020aa8b8b546643cd17`.

## 4. Registre des lots récents

- Lot 423 : `docs/product/LOT-423-AUDIT-OUTILS-EXPORT-CATALOGUE-MESSENGER.md`.
- Lot 424 : `docs/product/LOT-424-REVUE-TECHNIQUE-SCRIPTS-EXPORT-MESSENGER.md`.
- Lot 425 : `docs/product/LOT-425-EXPORT-COMPLEMENTAIRE-AUTORISATIONS-MESSENGER.md` et `tests/messenger/catalog_security_export.sql`.
- Lot 426 : présent rapport et correction de `tests/messenger/catalog_preflight.sql`.

## 5. Validation et limites

- Revue statique des scripts : oui.
- SQL exécuté : non.
- Validation par un moteur PostgreSQL : non.
- Tests comportementaux RLS/multi-comptes : non.
- Accès au catalogue Supabase actif : non.
- Lecture de lignes applicatives : non.
- Modification de la base active, Auth, RLS, grants, RPC, triggers, Storage, Realtime ou paiements : non.
- Installation ou dépense : non.
- Déploiement Cloudflare : non.
- Modification de `main`, rebase ou fusion PR #17 : non.

**Décision :** le préflight est plus explicite sur les absences, mais Messenger n'est toujours pas certifié. Le NO-GO reste maintenu jusqu'à comparaison avec un catalogue actuel autorisé et tests comportementaux isolés.
