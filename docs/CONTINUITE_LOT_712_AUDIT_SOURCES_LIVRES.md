# Continuité — Lot 712 : audit des sources de livres et sauvegardes

Date : 2026-11-20  
Branche : `ai/rag-corpus-integrity-lot-635`  
PR : #23  
Portée : audit en lecture seule ; aucune modification des fichiers pédagogiques, du Worker, de Supabase/Auth/RLS ou de `main`.

## 1. Vérification du CI précédent

Le workflow lancé sur le HEAD `bf0ac7a45b1ecb99a1d7510c463d8fa2a080dfb6` est terminé avec succès :
- validation structurelle et pédagogique : succès ;
- tests autonomes Professeur IA, audit PDF et Worker/RAG : succès ;
- trois workflows PostgreSQL : succès.

## 2. Exposition confirmée : sauvegarde dite privée dans le dépôt public

Le fichier `docs/private/buch_pages_full.json` est présent dans l'arbre Git de la branche et lisible via l'API de contenu GitHub du dépôt public. Il contient les 212 pages du manuel 2AS, avec des champs `titre` et `lignes`.

Le fichier `assets/bdd/buch_pages.json` confirme dans ses métadonnées que les corps des pages payantes ont été retirés du catalogue et que la sauvegarde intégrale est placée dans `docs/private/buch_pages_full.json`.

Le motif `docs/private` dans `.assetsignore` exclut le dossier des actifs statiques Cloudflare, mais ne retire pas les blobs de Git et ne protège pas les URLs GitHub/API/Raw. Cette exclusion n'est donc pas un contrôle d'accès au dépôt.

**Impact :** la copie intégrale du contenu 2AS demeure récupérable directement depuis le dépôt public, indépendamment du Worker du site.

## 3. Cartographie des fichiers livre exposés par le catalogue

Fichiers 2AS trouvés dans `assets/bdd` :
- `buch_pages.json` : index de 212 pages ; métadonnées indiquant que les corps payants sont retirés, avec cinq pages gratuites déclarées.
- `buch_2as.json`, `buch_l2.json`, `buch_l3.json` : fichiers structurés contenant des champs pédagogiques (`textes`, `vocab`, `tables`, `exos`). Le chargeur `buch.js` les récupère directement sans ajouter d'en-tête JWT.
- `buch3as_pages.json` : index 3AS dont les métadonnées indiquent que les corps de texte résident dans `public.lesson_content`, avec accès par RLS.
- `buch_3as_l4.json` à `buch_3as_l8.json` : fichiers de leçons 3AS ; ils correspondent au motif de protection existant du Worker.

Le Worker protège actuellement les chemins `buch_3as_*.json`, mais pas les fichiers `buch_2as.json`, `buch_l2.json` et `buch_l3.json`. Leur présence publique peut être volontaire pour des contenus gratuits ; leur classification exacte doit être confirmée avant de modifier la règle d'accès, afin de ne pas casser les aperçus gratuits ni le parcours pédagogique.

## 4. Mesures prises dans ce lot

- Audit Git de l'ensemble des chemins `docs/private/` : un seul fichier trouvé.
- Inspection des chargeurs `buch.js` et `biblio.js`.
- Comparaison des fichiers de livres avec les motifs `PROT` du Worker et les tests existants.
- Aucun contenu de manuel copié dans ce rapport.
- Aucun fichier supprimé, déplacé ou modifié.
- Aucune modification de `main`, de Supabase/Auth/RLS, du schéma ou du déploiement.

## 5. Blocages et décisions nécessaires

1. La sauvegarde intégrale `docs/private/buch_pages_full.json` reste exposée tant qu'elle demeure dans l'historique accessible du dépôt public. La masquer dans le bundle Cloudflare ne suffit pas.
2. La révocation complète de cette exposition nécessite une décision distincte sur le retrait du fichier de la branche publique et, si l'on veut empêcher l'accès aux anciennes versions, sur le traitement de l'historique Git ou de la visibilité du dépôt. Aucune de ces opérations n'a été exécutée.
3. Confirmer si `buch_2as.json`, `buch_l2.json` et `buch_l3.json` sont des ressources gratuites intentionnelles ou des contenus à protéger avant tout élargissement de `PROT`.

## État de PR

PR #23 reste ouverte, brouillon, non fusionnée. Aucun déploiement n'a été effectué.
