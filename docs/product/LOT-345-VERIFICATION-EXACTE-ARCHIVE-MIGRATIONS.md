# LOT 345 — Vérification exacte de l'archive SQL Messenger

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Méthode : comparaison caractère par caractère entre le contenu des fichiers GitHub et `supabase_migrations.schema_migrations.statements[1]`, via lecture seule.

## Résultat

**11 fichiers sur 11 correspondent exactement au SQL source.**

| Version | Correspondance | Longueur |
|---|---:|---:|
| 20261030131545 | exacte | 2 862 caractères |
| 20261030132222 | exacte | 1 751 |
| 20261030132512 | exacte | 2 703 |
| 20261030132541 | exacte | 159 |
| 20261030133016 | exacte | 502 |
| 20261030155716 | exacte | 2 558 |
| 20261030171035 | exacte | 721 |
| 20261030171056 | exacte | 665 |
| 20261030171127 | exacte | 559 |
| 20261030171556 | exacte | 1 667 |
| 20261030171618 | exacte | 1 916 |

La comparaison a porté sur le texte UTF-8 décodé retourné par GitHub et sur la valeur SQL source retournée par le catalogue Supabase. Les longueurs concordent pour chaque fichier et les chaînes sont strictement identiques. Les SHA-256 consignés dans le manifeste du Lot 342 restent ceux calculés sur le SQL source avec pgcrypto.

## Portée de cette validation

- Confirme la fidélité des 11 fichiers archivés aux instructions SQL source.
- Ne valide pas la sûreté de ces migrations.
- Ne prouve pas que l'ensemble des 27 migrations ou le baseline initial est archivé.
- Ne constitue pas un dump restaurable.
- N'autorise pas à rejouer ces fichiers sur le projet Supabase actif.

## Contrôles de sécurité

- SELECT uniquement sur le catalogue de migrations ; aucune donnée élève/message récupérée.
- Aucun SQL d'écriture, DDL, migration, modification Auth/RLS/GRANT/Storage.
- Aucun environnement payant créé.
- Aucun déploiement Cloudflare, aucun changement `main`, aucun merge PR #17.

## Suite

Passer à l'inventaire des objets applicatifs nécessaires à un baseline contrôlé : tables, types, séquences, contraintes, index, fonctions, triggers, policies, ACL et dépendances. Les services Supabase managés doivent rester séparés du socle PostgreSQL applicatif.
