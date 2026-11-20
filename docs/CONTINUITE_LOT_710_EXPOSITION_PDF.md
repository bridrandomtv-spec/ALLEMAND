# Continuité — Lot 710 : exposition des extraits PDF du catalogue

Date : 20 novembre 2026

## Audit de l'arbre Git
- Arbre contrôlé au commit de départ `4fc9655c5c796393bed383162e09d0c59d960254` : 1 437 fichiers, 293 PDF.
- Répartition : 264 PDF dans `docs/archive/documents/` et 29 PDF à la racine (`dzexams-*.pdf`). Aucun autre répertoire ne contient de PDF dans cet arbre.
- `.assetsignore` exclut `docs/archive` et le motif racine `dzexams-*.pdf` du bundle d'actifs Cloudflare. Cela ne supprime pas l'accès direct GitHub Raw au dépôt public.
- Les 225 PDF référencés dans `assets/bdd/corpus.json` avaient un champ `extrait` totalisant 66 668 caractères. Ce registre est chargé par `corpus.js` et `rag.js` sans authentification ; les extraits étaient affichés dans les cartes du catalogue.
- Les artefacts `corpus_rag_chunks.json`, `corpus_rag_manifest.json` et `corpus_rag_vectors.json` sont actuellement vides (zéro document, zéro chunk, zéro vecteur). Leur accès Worker reste sous garde.

## Correctif Lot 710
- Suppression du seul champ `extrait` pour les 225 enregistrements dont `format=pdf` dans `assets/bdd/corpus.json`.
- Conservation des identifiants, titres, matières, niveaux, dates, types, licences déclarées, URLs de référence et de tous les champs des documents non PDF.
- Aucun fichier PDF n'a été supprimé, déplacé ou modifié.
- Extension de `tests/corpus-public-pdf-access.test.mjs` : le test vérifie désormais qu'il existe toujours 225 fiches PDF, qu'aucune ne republie un champ `extrait`, que les extraits des documents non PDF restent présents, et que `.assetsignore` conserve les règles d'exclusion `docs/archive` et `dzexams-*.pdf`.
- Commits de code : `78144ff3d73aacac2b3eeb36b7acfb41032476f6` (registre), `94070b190069b5d9009a95303e0211a9126d63e4` (test extraits), `65524d7b70955f1eabbac008f2bf87d58f322ed8` (test exclusion des PDF du bundle).

## Limite résiduelle
- Les 293 PDF restent présents dans le dépôt GitHub public ; un utilisateur qui connaît une URL Raw peut encore demander directement le fichier. Ni le retrait des boutons, ni l'exclusion du bundle Cloudflare ne révoquent l'accès au dépôt.
- La révocation complète nécessitera de retirer ces fichiers de tout emplacement public ou de rendre leur emplacement privé, après validation des droits, de la rétention et des dépendances.
- L'inventaire des droits est toujours non confirmé pour les 293 fichiers. Aucun transfert vers un stockage protégé ne doit être fait avant validation documentaire.
- Aucun bucket R2, binding, secret, endpoint, table, politique RLS ou changement Auth n'a été provisionné.

## État opérationnel
- Branche : `ai/rag-corpus-integrity-lot-635`.
- PR #23 reste ouverte, en brouillon, non fusionnée.
- Aucune modification de `main`, aucun déploiement de production.
- La validation structurelle sur le commit documentaire intermédiaire `a752ddf9227bff451dea6f835661250ed0da214e` a terminé avec succès, y compris le test PDF ajouté. Le commit final `65524d7b70955f1eabbac008f2bf87d58f322ed8` doit encore être validé par la CI avant de déclarer le Lot 710 terminé.
