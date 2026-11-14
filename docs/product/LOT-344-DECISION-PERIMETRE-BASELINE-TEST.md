# LOT 344 — Décision de périmètre pour un baseline de test PostgreSQL

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : architecture et traçabilité, sans changement de base active.

## 1. Vérifications de départ

- PR #17 ouverte, non fusionnée, `mergeable=true`.
- HEAD vérifié : `0ffbc14f89827580906b9d3f2207d29efd55a15f`.
- CI #3225 : succès sur ce HEAD.
- Le catalogue Supabase `supabase_migrations.schema_migrations` contient 27 lignes ; les 27 ont exactement un élément non vide dans `statements`.
- Le manifeste du Lot 342 référence 11 migrations archivées du périmètre Messenger. Les 16 autres ne sont pas incluses dans cette archive.

## 2. Décision

Le futur environnement de test ne doit pas tenter de cloner tout Supabase dans PostgreSQL vanilla. Le baseline doit séparer :

1. **Socle applicatif contrôlé** : objets du schéma `public` nécessaires à l'application, avec tables, types, séquences, contraintes, index, fonctions, triggers, policies, ACL et default privileges.
2. **Contrats de services managés** : Auth, Storage, Realtime et Vault, documentés comme dépendances externes avec leurs interfaces nécessaires.
3. **Données synthétiques** : comptes et affiliations fictifs, aucun profil ni message réel.
4. **Assertions de parité** : comparaison structurée du catalogue après restauration avec le snapshot de référence, en excluant explicitement les objets internes non portables.

## 3. Pourquoi le dump complet n'est pas la prochaine action

L'inventaire du Lot 343 recense 37 tables publiques, 74 fonctions publiques, 24 fonctions Storage, 51 triggers et 76 policies dans son périmètre. Les objets Auth/Realtime/Storage/Vault sont gérés en partie par Supabase et ne doivent pas être reproduits naïvement dans un PostgreSQL standard.

Le dépôt ne contient pas de chaîne de migrations complète ni de baseline initial validé. Les 11 deltas Messenger archivés ne peuvent pas créer le schéma initial. Les 27 corps SQL du journal ne remplacent pas les DDL des objets préexistants.

## 4. Séquence de travail requise

1. Extraire les définitions DDL des seuls objets applicatifs contrôlés, en lecture seule.
2. Capturer séparément propriétaires, rôles nécessaires, ACL, ACL de colonnes, séquences et default privileges.
3. Capturer les définitions exactes des fonctions, triggers et policies, avec dépendances.
4. Définir des substituts de test explicites pour Auth, Storage et Realtime ; ne pas prétendre reproduire leur sécurité native.
5. Produire un baseline versionné et un manifeste de provenance.
6. Obtenir un moteur PostgreSQL jetable déjà disponible et sans coût additionnel ; sinon suspendre l'exécution d'intégration.
7. Restaurer le baseline, injecter uniquement des identités synthétiques et exécuter les tests multi-rôles/concurrence.
8. Comparer le catalogue restauré à la référence avant d'utiliser les résultats pour décider d'une migration.

## 5. Exclusions

- Pas de dump des données d'élèves, messages, pièces jointes ou secrets.
- Pas d'export ni de réintroduction de code MFA/2FA.
- Pas de travail facturation/paiement.
- Pas de création d'instance payante, de branche Supabase ou de conteneur distant.
- Pas de SQL d'écriture, DDL ou migration sur le projet actif.
- Pas de déploiement Cloudflare, pas de modification de `main`, pas de fusion PR #17.

## 6. Décision Messenger

Le Messenger national reste **NO-GO** pour l'ouverture nationale tant que :
- l'affiliation scolaire officielle et sa période de validité ne sont pas vérifiées côté serveur ;
- une invitation acceptée n'est pas une condition obligatoire de création d'un DM ;
- les insertions directes de conversations/membres ne contournent pas le workflow d'invitation ;
- les règles de blocage bilatéral et la projection minimale de l'annuaire ne sont pas validées ;
- les tests multi-comptes ne passent pas sur un environnement isolé.

Le Lot 344 est un cadrage de reconstruction et non une validation de sécurité ou un test d'intégration.
