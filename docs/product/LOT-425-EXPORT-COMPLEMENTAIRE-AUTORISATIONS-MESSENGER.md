# Lot 425 — Export complémentaire des autorisations du catalogue Messenger

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Nature :** ajout d'un script SQL de consultation des catalogues PostgreSQL uniquement.  
**Statut :** script versionné ; aucune exécution.

## 1. Livrable

Nouveau fichier : `tests/messenger/catalog_security_export.sql`.

Ce script complète `tests/messenger/baseline_catalog_export.sql` en couvrant :
- policies RLS sur les tables Messenger publiques et `storage.objects` ;
- triggers, état d'activation, fonction déclenchée, propriétaire et paramètres de sécurité ;
- fonctions Messenger nommées, fonctions référencées par les expressions de policies et fonctions déclenchées par les tables du périmètre ;
- ACL `EXECUTE` développées en grantee/privilege/grant option/grantor, sur le même périmètre de fonctions ;
- métadonnées des rôles applicatifs connus et appartenances pertinentes ;
- grants des schémas `public`, `storage`, `auth`, séquences publiques et ACL par défaut ;
- tables Messenger présentes dans les publications Realtime.

Le script ne lit aucune ligne de profil, Auth, message, conversation, pièce jointe, journal ou objet Storage. Il ne contient que des SELECT sur les catalogues PostgreSQL.

## 2. Pourquoi ce complément était nécessaire

Les lots 423–424 ont identifié des limites précises :
- le préflight ne matérialise pas les tables ayant zéro policy ou zéro trigger ;
- l'export détaillé ne couvrait pas les policies Storage ni les memberships des rôles ;
- l'export des fonctions n'exposait pas les ACL EXECUTE développées par grantee ;
- le manifeste compact ne contenait pas les grants ;
- les tests de présence/comptage ne prouvaient pas les expressions de sécurité.

Le Lot 425 ajoute un export complémentaire ciblé. Il ne remplace pas les scripts existants et ne constitue pas un dump restaurable.

## 3. Limites connues

- L'inventaire des fonctions auxiliaires dépend des dépendances de catalogue enregistrées pour les policies et triggers, plus les noms de fonctions Messenger ciblés. Les appels dynamiques et appels internes dans le corps PL/pgSQL peuvent ne pas être détectés automatiquement.
- Les rôles et memberships visibles dépendent des droits du rôle d'exécution ; une sortie partielle doit être signalée, jamais interprétée comme une absence.
- La configuration réelle des schémas exposés par PostgREST/Data API n'est pas entièrement déductible des catalogues SQL interrogés ici ; elle doit être rapprochée de la configuration Supabase disponible.
- Les politiques Storage sont extraites, mais aucune ligne de `storage.buckets` ni de `storage.objects` n'est lue.
- Aucune requête n'a été exécutée pour confirmer la compatibilité de syntaxe avec la version PostgreSQL du projet. La syntaxe doit être validée sur une base locale isolée avant toute utilisation sur le projet actif.

## 4. Ordre d'utilisation prévu

Sur une copie locale fidèle et gratuite, après disponibilité de l'environnement :
1. exécuter `catalog_preflight.sql` ;
2. exécuter les SELECT de `baseline_catalog_export.sql` ;
3. exécuter `catalog_security_export.sql` ;
4. générer `export_catalog_manifest.sql` ;
5. comparer les sorties à la baseline approuvée ;
6. lancer les tests RLS comportementaux avec des sessions synthétiques `authenticated`, jamais `postgres` ou `service_role` comme preuve de RLS.

Une éventuelle lecture du catalogue actif exige toujours l'autorisation explicite de l'utilisateur et doit rester strictement read-only.

## 5. Sécurité et validation

- SQL exécuté : non.
- Vérification syntaxique PostgreSQL : non, environnement local non confirmé.
- Test comportemental / RLS : non.
- Accès Supabase actif : non.
- Lecture de données applicatives : non.
- Modification Auth, RLS, grants, RPC, triggers, schéma, Storage, Realtime ou paiement : non.
- Installation PC, création de ressources payantes ou dépense : non.
- Déploiement Cloudflare, modification de `main`, rebase ou fusion PR #17 : non.

**Décision :** le script est un outil d'export préparatoire, pas une preuve que le catalogue actif est conforme. Le NO-GO reste maintenu pour déclarer le Messenger privé terminé.


### Historique de correction du script

- Création : `bcd69091684d69e7b7e64320a68cf824c7abec40`.
- Extension du périmètre ACL aux fonctions liées aux policies et triggers : `c615bcd12f734760081175ea03c9f9fb2383f628`.
- Correction du caractère d'échappement dans le filtre `LIKE` de la requête ACL : `710e8f6acf97e702edcff668e3ceec4a21163381`.
- Cette correction est une revue statique du texte SQL ; aucune exécution PostgreSQL ni validation de syntaxe n'est revendiquée.
