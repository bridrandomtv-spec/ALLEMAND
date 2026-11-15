# Lot 623 — Normalisation commune et activation du routage de l’ontologie

Date : 15 novembre 2026  
Dépôt : `bridrandomtv-spec/ALLEMAND`  
Branche : `audit/lot-603-corpus-contract-tests`  
HEAD avant documentation : `5e3ada89883977e71a948dd4fac191b637237f1e`

## Objectif

Réduire les divergences de normalisation entre les questions arabes, la darija, l’Arabizi et les formulations multilingues ; conserver la question originale pour l’analyse ; connecter le routeur d’ontologie au parcours local lorsque les routeurs historiques ne reconnaissent pas la demande.

## Changements appliqués

### 1. Module partagé `js/text-normalizer.js`

Création d’un module sans dépendance externe, exposant `window.DZ_TEXT` :

- `normalize()` : normalisation Unicode NFKC, casse, variantes arabes, diacritiques et ponctuation arabe ;
- `tokens()` : tokenisation qui ne colle plus les points d’interrogation arabes aux mots latins ;
- `arabiziToArabic()` : petit lexique déterministe de formes fréquentes (wach, chno, kifach, 3lach, 3tini, nsta3mel, etc.) et conversion de chiffres Arabizi 3/7/5/9/2 ;
- `withArabizi()` : forme de recherche combinant la formulation d’origine et ses équivalents connus ;
- `isArabizi()` : détection lexicale initiale de l’Arabizi.

Les caractères latins accentués sont préservés pour ne pas dégrader le français, l’espagnol, l’italien et l’allemand.

### 2. QUST raccordé au normaliseur

`js/qust.js` utilise maintenant le module commun lorsqu’il est chargé, tout en conservant un repli autonome si le module est absent. La détection du dialecte et les intentions s’appuient sur les équivalents Arabizi connus. Les comparaisons sont reconnues dans les formulations anglaises, françaises, espagnoles, italiennes, allemandes, arabes et mixtes. L’extraction des conjonctions `weil` et `dass` utilise des tokens nettoyés.

### 3. RAG : question originale préservée

`reponsePedagogique()` conserve désormais `rawQuestion` avant les substitutions de présentation Darija. QUST reçoit cette formulation originale, et non la version réécrite par `darja()`.

Le normaliseur partagé est utilisé par `normOnto()` et `tokOnto()`, ce qui harmonise la recherche dans les formulations de l’ontologie et évite que la ponctuation arabe reste attachée aux mots latins.

### 4. Ontologie activée en repli

Quand `matchType()` ne reconnaît pas une question, `reponsePedagogique()` tente maintenant `ontoRoute(rawQuestion)` avant le repli QUST. L’ontologie n’est donc plus seulement chargée et définie : elle est effectivement appelée dans ce chemin de réponse local.

Le branchement reste volontairement en dernier recours après les gestionnaires pédagogiques existants afin de ne pas les remplacer.

### 5. Chargement, cache et CI

- `index.html` charge le normaliseur avant QUST.
- `sw.js` précache le nouveau module et QUST, avec une nouvelle version de cache pour éviter de conserver l’ancien assemblage.
- `.github/workflows/tutor-audit.yml` surveille le nouveau fichier et vérifie la syntaxe de `text-normalizer.js`, `qust.js` et `rag.js`.
- `tests/qust_runtime_contract.mjs` couvre Arabizi avec chiffres, Darija/allemand mélangés, ponctuation arabe, comparaisons françaises, espagnoles et italiennes.
- `tests/rag_loader_contract.mjs` vérifie le branchement de l’ontologie et la conservation de la question brute.

## Vérifications effectuées dans cet environnement

- Syntaxe JavaScript analysée avec `new Function` : PASS pour `js/text-normalizer.js`, `js/qust.js` et `rag.js`.
- Exécution isolée de QUST avec le normaliseur : PASS sur six formulations ciblées :
  - `3lach nsta3mel weil hna?` → Darija/Arabizi + allemand, intention `explain_rule`, conjonction `weil`.
  - `wach الفرق بين weil و dass؟` → comparaison, dialecte Darija, extraction de `weil` et `dass`.
  - question arabe sur Akkusativ → `explain_rule`.
  - question de comparaison espagnole → `compare`.
  - question de comparaison italienne → `compare`.
  - question de comparaison française avec `weil/dass` → `compare`.
- Contrôles statiques : script chargé avant QUST, précache SW, version de cache modifiée, workflow surveillant le normaliseur, route ontologique appelée et question originale transmise à QUST : PASS.

## Limites non résolues dans ce lot

- Le petit dictionnaire Arabizi couvre des formes fréquentes, pas toutes les variantes orthographiques algériennes. Il faudra l’étendre à partir de questions réelles anonymisées et validées.
- La normalisation commune n’est pas encore raccordée à chaque ancien composant lexical indépendant de la plateforme ; BIBLIO et les chemins vocaux doivent encore être audités et unifiés.
- L’index documentaire RAG reste absent/incomplet comme décrit dans le Lot 622. Le normaliseur ne crée pas les chunks documentaires.
- L’ontologie n’est tentée que lorsque `matchType()` ne renvoie aucun type ; l’évaluation de ses 25 intentions sur l’ensemble du corpus doit être exécutée dans Node et en CI.
- La prononciation TTS et la reconnaissance vocale multilingues ne sont pas corrigées ici.

## Validation et sécurité

Les fichiers de tests MJS ont été mis à jour mais leur exécution native par Node n’a pas été effectuée dans cet environnement. Aucun résultat GitHub Actions n’est revendiqué. Aucun Worker en production, microphone ou TTS réel n’a été testé.

Aucun changement Supabase, Auth, RLS, schéma, donnée, paiement ou secret. Aucun déploiement, aucun merge, aucune modification de `main`. PR #17 et les diagnostics Messenger restent séparés.
