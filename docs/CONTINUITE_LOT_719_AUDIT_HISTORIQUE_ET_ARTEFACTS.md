# Lot 719 — vérification des artefacts suivis et de l'historique Git — 20/11/2026

## Périmètre et méthode
Vérification en lecture seule de l'arbre Git du HEAD `bdbe32bf3dd0dcec7369e0f8eee9dba17e69f6a8`, des métadonnées du dépôt, des historiques par chemin et d'une URL Raw textuelle. Aucun contenu de livre, donnée personnelle ou coordonnée confidentielle n'est reproduit ici.

## 1. État réel du dépôt au HEAD de la PR
L'arbre récursif Git du commit est complet (non tronqué) et contient :
- 1 445 blobs ;
- 293 fichiers PDF suivis ;
- 834 blobs sous `docs/archive/` ;
- `docs/private/buch_pages_full.json`, 197 523 octets dans l'arbre Git.

Le dépôt `bridrandomtv-spec/ALLEMAND` est toujours public (`private=false`), branche par défaut `main`. Le HEAD de PR #23 référence le même dépôt public ; un fichier présent dans son arbre n'est donc pas isolé du public par le fait qu'il soit dans un dossier nommé `private`.

## 2. Test d'accès Raw : sauvegarde du livre 2AS
La récupération de l'URL Raw du fichier `docs/private/buch_pages_full.json` au SHA du HEAD de PR a réussi. Le corps a été reçu (190 337 caractères), mais n'a pas été affiché, copié dans le rapport ni réémis dans la conversation.

Historique GitHub par chemin :
- un commit d'introduction, `f56921c2d2fb6d14afa53c38b816bcbfbd17dab7`, daté du 29 septembre 2026 ;
- message de commit indiquant explicitement qu'il s'agit d'une sauvegarde intégrale avant migration vers `lesson_content`, placée dans `docs/private` et hors build public.

Le fichier est encore présent dans l'arbre actuel et son URL Raw est récupérable. L'exclusion du bundle Cloudflare n'a donc pas supprimé son exposition GitHub.

## 3. PDFs et archive
- L'arbre Git actuel contient 293 PDF, y compris sous `docs/archive/documents/`.
- `.assetsignore` contient les exclusions `docs/archive`, `docs/private` et `dzexams-*.pdf`. Elles concernent le bundle d'actifs Cloudflare, pas le dépôt Git.
- L'historique du PDF d'exemple `docs/archive/documents/dzexams-2as-allemand-100524.pdf` remonte à un commit de tri de l'archive du 19 septembre 2026. Le fichier est encore suivi au HEAD.
- Les historiques de déplacement de `docs/archive` montrent des opérations de classement en dossiers `images/` et `documents/`, pas une purge de l'ensemble des fichiers.
- La lecture directe d'un PDF binaire n'a pas été utilisée comme preuve d'accès Raw ; le constat repose sur sa présence dans l'arbre Git du dépôt public. Le test Raw réussi concerne le JSON textuel ci-dessus.

## 4. Conclusion sécurité
1. La sauvegarde complète du livre est actuellement récupérable depuis GitHub Raw : c'est un blocage confirmé, pas une simple hypothèse liée au nom du dossier.
2. Les 293 PDF sont toujours des objets suivis dans le dépôt public. Leur exclusion du bundle Cloudflare ne les retire pas de GitHub.
3. La suppression du fichier au HEAD ne suffirait pas à révoquer les anciennes versions dans l'historique Git. Une éventuelle purge d'historique serait une opération distincte, à impact élevé sur les clones, forks, PR et SHA ; elle nécessite une autorisation explicite et une stratégie de coordination.
4. Le dépôt ne doit pas être rendu privé ni son historique réécrit sans décision explicite du propriétaire. Aucune de ces opérations n'a été entreprise.

## 5. État des opérations
- Audit en lecture seule ; aucun PDF, JSON, backup, secret, blob ou historique modifié.
- Aucun changement de visibilité du dépôt, aucun retrait de fichier, aucune réécriture Git.
- Aucun changement de code, Worker, Supabase/Auth/RLS/schéma/paiement ou déploiement.
- Aucun changement de `main`, aucune fusion. PR #23 reste ouverte et en brouillon.
- CI du HEAD `bdbe32bf3dd0dcec7369e0f8eee9dba17e69f6a8` : Workers Builds, validation structurelle/pédagogique, tests autonomes Professeur IA et les trois workflows PostgreSQL réussis ; Supabase Preview ignoré.

## Décisions nécessaires avant fusion
- Décider de la stratégie de retrait de `docs/private/buch_pages_full.json` et de ses versions historiques.
- Décider du sort des 293 PDF et vérifier les droits document par document.
- Confirmer si le dépôt doit rester public.
- Préparer, si nécessaire, une migration vers un stockage privé avec autorisation serveur et URLs temporaires ; déplacer les fichiers ne purge pas les anciens blobs GitHub.
