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
- Extension de `tests/corpus-public-pdf-access.test.mjs` : le test vérifie désormais qu'il existe toujours 225 fiches PDF, qu'aucune ne republie un champ `extrait`, que les extraits des documents non PDF restent présents, que `.assetsignore` conserve les règles d'exclusion `docs/archive` et `dzexams-*.pdf`, et que les 225 URLs sont reconnaissables comme PDF.
- Ajout de `test_legacy_pdf_ingestion_guard.py` à la CI du workflow principal : les anciens scripts `ingest_corpus.py` et `indexer_pdf.py` doivent rester désactivés et ne doivent ni extraire ni réécrire le corpus.
- Commits de code : `78144ff3d73aacac2b3eeb36b7acfb41032476f6` (registre), `94070b190069b5d9009a95303e0211a9126d63e4` (test extraits), `65524d7b70955f1eabbac008f2bf87d58f322ed8` (tests de non-régression PDF). Le test de garde d'ingestion historique est désormais inclus dans le workflow principal.

## Limite résiduelle
- Les 293 PDF restent présents dans le dépôt GitHub public ; un utilisateur qui connaît une URL Raw peut encore demander directement le fichier. Ni le retrait des boutons, ni l'exclusion du bundle Cloudflare ne révoquent l'accès au dépôt.
- La révocation complète nécessitera de retirer ces fichiers de tout emplacement public ou de rendre leur emplacement privé, après validation des droits, de la rétention et des dépendances.
- L'inventaire des droits est toujours non confirmé pour les 293 fichiers. Aucun transfert vers un stockage protégé ne doit être fait avant validation documentaire.
- Aucun bucket R2, binding, secret, endpoint, table, politique RLS ou changement Auth n'a été provisionné.

## État opérationnel
- Branche : `ai/rag-corpus-integrity-lot-635`.
- PR #23 reste ouverte, en brouillon, non fusionnée.
- Aucune modification de `main`, aucun déploiement de production.
- Les premières validations structurelles ont réussi, mais les exécutions CI suivantes ont été annulées lors de nouvelles mises à jour de la PR. Le commit consolidé du test et de ce rapport doit être validé sur son propre HEAD avant de déclarer le Lot 710 terminé.


## Lot 711 — normalisation des chemins du Worker
- Audit du garde `src/site-worker.js` : les expressions de protection testaient directement `URL.pathname`, qui peut conserver des segments encodés (lettres, séparateurs et encodages successifs).
- Ajout d'une normalisation avec décodage borné à quatre passes avant les contrôles `PROT` et `Cache-Control`. Les segments `.` et `..` sont aussi résolus après décodage ; les encodages mal formés, ambigus ou résiduels sont refusés en `400`.
- Tests ajoutés dans `tests/site-worker-content-guard.test.mjs` pour les chemins `%64`, `%61`, les séparateurs `%2F`, le double encodage `%2564`, la traversée encodée `%252e%252e` et un encodage invalide. Ils vérifient qu'aucun actif ni appel RLS n'est atteint sans JWT.
- Le Worker transmet toujours la requête d'origine au binding ASSETS ; la normalisation sert à appliquer le garde sur un chemin canonique, sans modifier les URL de contenu servies.
- Tests du garde Worker sur le HEAD validé : 23 tests, 0 échec. Les chemins encodés `%64`, `%61`, `%2F`, `%2564`, la traversée `%252e%252e` et l'encodage invalide sont refusés avant l'accès à ASSETS ou l'appel RLS.


## Résultats finaux de l'audit PDF et de la CI
- Audit technique CI du dépôt : 293 PDF, 1 173 pages, 767 pages avec texte exploitable, 406 pages sans texte exploitable, 747 140 caractères extraits et comptabilisés (aucun texte conservé dans le rapport).
- Répartition des fichiers : 186 `extractable`, 28 `mixed`, 78 `ocr_candidate`, 1 `encrypted`, 0 `unreadable`.
- Rapprochement inventaire : 293 PDF audités, 293 lignes d'inventaire, 293 chemins rapprochés, 0 absent de l'inventaire, 0 PDF sans correspondance. Droits confirmés : 0 ; droits vides/non confirmés : 293. Aucun droit n'a été inféré.
- Le rapport CSV technique est produit comme artefact CI, avec chemins et compteurs seulement ; aucun texte PDF n'y est inclus.
- CI principale `44784903552` : les deux jobs « Validation structurelle & pédagogique » et « Tests autonomes — Professeur IA » ont réussi. La validation structurelle a terminé ses 47 étapes sans échec ; l'audit PDF, les tests d'ingestion et les tests Worker/RAG sont réussis.
- Workflows PostgreSQL `44784903563`, `44784903565`, `44784903569` : tous réussis.
- Test de garde d'ingestion historique exécuté dans la suite autonome : les anciens scripts `ingest_corpus.py` et `indexer_pdf.py` restent inertes et n'écrivent pas le corpus.
- Le contrôle `Supabase Preview` est ignoré ; aucun déploiement n'a eu lieu.
- HEAD validé : `c0f518faa2453802186fe9d858006815be494915`. Cette section est documentaire ; le commit de mise à jour du présent rapport pourra déclencher une nouvelle CI.
