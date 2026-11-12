# Lot 332 — préparation des tests PostgreSQL isolés : état de l'environnement et blocages

Date : 12 novembre 2026  
Nature : vérification des moyens de test et inventaire des sources de schéma. Aucun test n'est présenté comme exécuté sans moteur PostgreSQL isolé.

## 1. CI et PR avant ce lot

- CI #3201 : succès sur le document Lot 331, commit `dfb95231c61136e61635fa3c557ebe4288c3d225`.
- CI #3202 : succès sur la mise à jour du dossier de continuité, commit `4884807f8db6a83786279cab72ff568149763727`.
- PR #17 : ouverte, non fusionnée, fusionnable au dernier contrôle ; HEAD `4884807f8db6a83786279cab72ff568149763727`.
- Aucun changement sur `main).

## 2. Contrôle de l'environnement d'exécution

Vérification des exécutables dans l'environnement de travail disponible :
- Node.js présent : v22.16.0.
- `psql`, `postgres`, `initdb`, `docker` et `podman` absents.
- Aucun moteur PostgreSQL local, aucune instance jetable disponible dans cet environnement.
- Le dépôt ne contient pas de répertoire `supabase/migrations/` ni de `config.toml` Supabase local ; il contient des scripts SQL historiques tels que `supabase/msg_schema.sql), `schema.sql), `grants.sql), `harden.sql` et des correctifs. Le bandeau de `msg_schema.sql` précise explicitement que le script n'a jamais été exécuté par un robot et qu'il est seulement préparé/validé statiquement.

**Conséquence :** lancer `node tests/msg_test.mjs` ou `node ci/check-msg.mjs` ne créerait pas un environnement PostgreSQL. Ces tests analysent le texte du script SQL et du client ; ils ne valident ni les ACL effectives, ni RLS, ni les triggers réellement installés, ni les courses transactionnelles.

## 3. Contrôle en lecture seule du projet Supabase connecté

Projet consulté : `azjwcybivirvpxbfhyzk).

- PostgreSQL du projet : 17.6 (établi dans l'audit Lot 330).
- Historique de migrations exposé par Supabase : 27 versions, de `20261030131545` à `20261109210413`.
- Les migrations historiques contiennent notamment `secure_direct_message_membership`, `close_direct_chat_join_and_lock_trigger_functions`, `restrict_message_membership_helper_access`, `enforce_message_attachment_metadata_constraints`, `scope_message_edits_and_attachment_moderation` et `enforce_message_storage_upload_limits`.
- Le projet ne présente qu'une branche Supabase `main` ; aucune branche de développement jetable existante n'a été trouvée.
- Aucun SQL de test n'a été exécuté contre le projet actif dans ce lot. L'inventaire des migrations est une lecture de métadonnées, pas une validation fonctionnelle.

## 4. Pourquoi je n'ai pas créé de branche de test

La création d'une branche Supabase de développement peut entraîner des coûts horaires de calcul et d'utilisation. Le mécanisme de création exige de vérifier le coût et une confirmation explicite de l'utilisateur si un montant est dû. Le périmètre actuel exclut les frais et la facturation ; aucune branche n'a donc été créée et aucun coût n'a été engagé.

Ne pas confondre :
- branche GitHub `design/prototypes-67-74-alignment` : branche de code, déjà utilisée ;
- branche Supabase : nouvelle base PostgreSQL de développement, susceptible d'être facturée.

## 5. Tests qui restent requis avant toute migration

Le protocole du Lot 331 reste la référence. Les tests doivent être exécutés sur une base jetable dont le schéma est reconstruit depuis les migrations réelles, et non depuis le seul script historique `msg_schema.sql`.

Priorités :
1. Reconstituer fidèlement les 27 migrations actives et leurs dépendances dans un environnement isolé.
2. Vérifier les privilèges effectifs de colonnes `profiles` sous `anon`, `authenticated` et rôles administratifs.
3. Vérifier les politiques RLS et les ACL de `msg_open_direct`, INSERT direct sur `msg_conversations) et auto-adhésion `msg_members`.
4. Avec deux sessions authentifiées distinctes, tenter les créations directes, acceptations concurrentes, rejouements et blocages croisés.
5. Vérifier qu'une invitation acceptée est le seul chemin de création d'un nouveau DM.
6. Vérifier la conservation des DM historiques, des groupes, de Realtime et des pièces jointes.
7. Rejouer les tests après chaque migration candidate et consigner les versions exactes.

**Précondition manquante :** un environnement PostgreSQL isolé sans coût supplémentaire, ou une autorisation explicite de créer une branche Supabase après affichage et acceptation de son coût. Aucune action de création ne sera entreprise dans le périmètre actuel.

## 6. Résultat honnête du Lot 332

- Contrôle d'environnement réalisé.
- Source de vérité clarifiée : les migrations actives de Supabase, et non le script historique du dépôt.
- CI #3202 confirmée en succès.
- Tests PostgreSQL multi-session : **non exécutés**, faute de moteur/instance isolée.
- Aucune validation RLS/ACL réelle nouvelle revendiquée.
- Aucun DDL, migration, changement Auth/RLS/GRANT/Storage ou écriture SQL sur le projet actif.
- Aucun déploiement Cloudflare, aucun changement sur `main), aucune fusion de PR #17.
- Pas de MFA/2FA et pas de facturation.

## 7. Étape suivante

La prochaine étape sans frais consiste à récupérer/constituer une copie versionnée des migrations SQL exactes dans le dépôt de travail, puis préparer un harnais reproductible. L'exécution réelle restera bloquée jusqu'à disponibilité d'un moteur PostgreSQL isolé sans coût ou autorisation explicite d'un environnement Supabase de développement après vérification du coût.
