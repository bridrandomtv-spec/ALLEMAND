# LOT 334 — Recherche de provenance GitHub des migrations Supabase

Date : 12 novembre 2026  
Périmètre : historique Git du SQL Messenger, workflows CI/CD, comparaison avec les 27 migrations actives.

## Conclusions vérifiées

1. **Aucun historique de migration versionné** : l'API GitHub renvoie zéro commit pour le chemin `supabase/migrations`. L'arbre de la branche ne contient aucun répertoire `migrations/`.
2. **Le workflow actif n'applique pas de migrations Supabase** : `.github/workflows/deploy.yml` ne comporte qu'un job `validate`. Les étapes visibles valident les fichiers, les scripts statiques et les tests Node. Aucun `supabase db push`, `supabase migration up`, exécution SQL ou déploiement de migration n'y figure. Le nom de workflow « CI » n'est donc pas une preuve de migration DB.
3. **L'historique du fichier `supabase/msg_schema.sql` comporte 8 commits**, entre le 11 et le 13 octobre 2026. Ce fichier a été utilisé comme schéma de préparation/validation, mais il ne constitue pas l'historique des 27 migrations appliquées du 30 octobre au 9 novembre.
4. **Une dérive dépôt/base a été explicitement documentée** dans le commit `a63e6b323eaa34c11e5daf64be05213549b338a8` du 13 octobre : le message du commit indique que la politique `profils visibles entre membres` existait dans la base vivante mais manquait dans `msg_schema.sql`; le commit l'a réintroduite dans le fichier et a ajouté une assertion statique. Cela prouve qu'une copie SQL du dépôt a déjà divergé de la base active.
5. Le commit `6f529c67e6f83212242ac62d505bb5e117c0e643` du 13 octobre a ajouté des triggers de limite de taille 5 Mo au fichier de schéma. Il ne permet pas d'établir que ces changements correspondent exactement aux migrations appliquées ultérieurement.

## Preuves consultables

- Historique de `supabase/msg_schema.sql` : https://github.com/bridrandomtv-spec/ALLEMAND/commits/design/prototypes-67-74-alignment/supabase/msg_schema.sql
- Commit documentant la dérive base/dépôt : https://github.com/bridrandomtv-spec/ALLEMAND/commit/a63e6b323eaa34c11e5daf64be05213549b338a8
- Commit ajoutant les gardes de taille : https://github.com/bridrandomtv-spec/ALLEMAND/commit/6f529c67e6f83212242ac62d505bb5e117c0e643
- Workflow CI : https://github.com/bridrandomtv-spec/ALLEMAND/blob/design/prototypes-67-74-alignment/.github/workflows/deploy.yml
- Inventaire des migrations actives : voir le rapport du Lot 333.

## Décision technique

Il n'existe pas, dans les sources GitHub actuellement accessibles, de chaîne de provenance suffisante pour restaurer à l'identique l'historique des 27 migrations. Le workflow actuel ne permet pas de combler cette lacune et les scripts SQL agrégés ne doivent pas être exécutés pour simuler l'historique.

La prochaine méthode sûre est :
- demander/extraire depuis la source de déploiement d'origine les 27 corps SQL exacts et leurs empreintes ;
- si ces fichiers ne sont pas récupérables, préparer un **baseline de référence distinct**, à partir d'un export contrôlé du schéma actif et d'un inventaire des fonctions, politiques, privilèges, triggers et Storage ;
- documenter explicitement ce baseline comme une reconstruction à date, jamais comme les migrations historiques originales ;
- tester le baseline sur un PostgreSQL jetable avec rôles de test, RLS et scénarios concurrents.

## État CI / PR

- CI #3205 : success, commit `c9aa3a9215d170e625fdebdfbb12fd92f11919b7`.
- CI #3206 : success, commit `95af82706fd2003aacb7c55f8b6b010f3a5530e0`.
- PR #17 : ouverte, non fusionnée, mergeable=true, mergeable_state=clean au dernier contrôle.

## Actions non réalisées

Aucune requête d'écriture, aucun DDL, aucune migration appliquée, aucune modification Auth/RLS/GRANT/Storage, aucune branche Supabase créée, aucun déploiement Cloudflare, aucun changement sur `main), aucune fusion de PR. Aucun travail de facturation ni MFA/2FA.


## Addendum Lot 341 — source SQL retrouvée (12 novembre 2026)

Correction : le catalogue actif `supabase_migrations.schema_migrations` expose `statements` (ARRAY) et contient les corps SQL exacts des 27 migrations. La recherche GitHub sur `supabase/migrations` reste vide, mais cela ne signifie pas que les corps sont irrécupérables. Les 27 lignes ont une seule instruction chacune et `rollback` est NULL. Il reste à archiver les deltas et à construire un baseline initial contrôlé ; ne pas exécuter les scripts historiques agrégés pour simuler la chaîne. Voir `docs/product/LOT-341-RECUPERATION-SOURCE-SQL-MIGRATIONS.md`.
