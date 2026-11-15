# Lot 622 — Inventaire de l’intelligence, des lexiques et des index (15 novembre 2026)

## Périmètre et méthode

- Dépôt : `bridrandomtv-spec/ALLEMAND`.
- Branche examinée : `audit/lot-603-corpus-contract-tests`.
- HEAD confirmé : `f72b80e54871e267b633850ab643c662fba8f6ea`.
- Arborescence : 1 426 fichiers au total.
- Lecture individuelle des familles techniques : fichiers JavaScript, modules de test MJS, JSON, Python et workflows YAML ; les ressources de données, les moteurs, les tests et les pipelines d’indexation ont été examinés par leur contenu et leurs références croisées. Les documents techniques directement liés à l’IA ont également été consultés. Les images, PDF et documents métier sans lien avec le moteur n’ont pas été assimilés à du code IA.

Aucun fichier applicatif, aucune donnée et aucun workflow n’ont été modifiés pendant cet audit. Aucun test Node/GitHub Actions, appel réel au Worker, microphone, TTS réel ou déploiement n’a été exécuté.

## 1. Inventaire des ressources cognitives et lexicales

| Ressource | Contenu constaté | Rôle réel |
|---|---:|---|
| `assets/bdd/intent_ontology.json` | 25 intentions, 313 formulations, 251 expansions | Ontologie de demandes pédagogiques multilingues |
| `assets/bdd/intent_eval_set.json` | 146 exemples, 111 questions distinctes | Jeu d’évaluation des intentions |
| `assets/bdd/intent_eval_results.json` | 75,3 % exact-intent, 100 % catégorie | Résultat archivé, non recalculé par la CI |
| `assets/bdd/questions_eleve.json` | 10 types, 134 motifs | Ancien routeur local par formulations |
| `assets/bdd/darja.json` | 98 entrées | Banque d’explications et de formulations en derja ; pas un normaliseur Arabizi complet |
| `assets/bdd/corpus_index.json` | 490 entrées lexicales | Catalogue lexical consommé par BIBLIO, malgré le mot « index » |
| `assets/bdd/corpus.json` | 239 documents et 450 entrées lexicales | Catalogue documentaire et données historiques |
| `assets/bdd/vocabulaire_eleve.json` | 53 mots | Petit lexique pédagogique |
| `assets/bdd/biblio_multimatieres.json` | 1 213 entrées, 25 catégories | Bibliothèque en réalité limitée à la matière allemand ; 168 modèles de phrases et 120 phrases à compléter |
| `assets/bdd/traductions_livre.json` | 761 entrées | Traductions de phrases du manuel |
| `assets/bdd/grammaire.json` | 86 règles | Base grammaticale allemande |
| `assets/bdd/malakhiss.json` | 19 unités, 128 leçons | Résumés et contenus pédagogiques par unité |
| `assets/bdd/sharh.json` | unités 1 à 4 seulement | Explications approfondies, couverture incomplète des 19 unités |

### Ressources anglaises

- `english_vocab.json` : 34 mots dans `mots` et 155 entrées dans `vocab`.
- `english_grammaire.json` : 23 règles.
- `english_pages.json` : 20 pages.
- `english_malakhiss.json` : 5 unités.
- `english_devoirs.json` : 5 devoirs.
- `english_exercises.json` : 283 exercices.

### Espagnol et italien

- `subjects.json` les classe encore comme matières planifiées.
- `languages.json` ne déclare que l’allemand et l’anglais comme langues actives.
- Aucun corpus lexical, dictionnaire, grammaire, résumé ou index pédagogique dédié à l’espagnol ou à l’italien n’a été trouvé dans les ressources BDD examinées.
- Le Worker sait traiter ces langues au niveau conversationnel, mais cela ne constitue pas une bibliothèque pédagogique officielle pour ces matières.

## 2. Défauts d’intégration constatés

### A. Ontologie d’intentions non branchée

Dans `rag.js`, `matchOnto()` et `ontoRoute()` sont définis. La recherche complète du fichier ne trouve aucun appel à `ontoRoute()` en dehors de sa déclaration. L’ontologie de 25 intentions n’alimente donc pas le parcours normal de réponse local.

En outre, le routeur QUST de `js/qust.js` possède un vocabulaire d’intentions différent et plus réduit. Les identifiants de l’ontologie ne sont pas tous mappés vers les intentions comprises par le Worker ; plusieurs intentions n’ont pas de branche de traitement dans `ontoRoute()`.

Le résultat archivé annonce 75,3 % d’intentions exactes et 100 % de catégories sur 146 exemples. La reproduction de la logique de correspondance sur ce jeu retrouve 75,3 %. Le jeu contient 35 répétitions de questions (111 formulations distinctes) et l’ontologie comporte 22 formulations partagées entre plusieurs intentions. Le score de catégorie ne prouve donc pas que le bon sous-intent est choisi dans une conversation réelle.

### B. Darija et Arabizi ne passent pas par une normalisation commune

Les traitements sont dispersés entre :
- les marqueurs Darija/Arabizi de `ia.js` ;
- un second jeu de marqueurs dans `parle.js` ;
- les listes `DZ`, `DZ_AR`, `FR`, `DE`, `EN`, `ES`, `IT` de QUST ;
- le tableau de substitutions `DAR` de `rag.js` ;
- la normalisation de l’ontologie dans `normOnto()` ;
- la tokenisation propre à BIBLIO et au lecteur RAG.

Défauts concrets :
- `rag.js` transforme la question avec `darja(q)` avant d’appeler QUST. Des marqueurs tels que « واش », « كيفاش » et « علاش » sont remplacés par « ما », « كيف » et « لماذا ». QUST perd alors une partie des indices qui lui permettaient de reconnaître le dialecte dans le texte original.
- `darja(q)` ne translittère pas les questions Arabizi.
- QUST détecte certains marqueurs Arabizi, mais ne normalise pas les chiffres 3/7/5/9 vers les caractères arabes.
- `normOnto()` ne convertit les chiffres Arabizi que lorsqu’il ne reste aucune lettre latine ; cette condition exclut précisément la plupart des mots Arabizi.
- Les tokeniseurs de QUST, BIBLIO et RAG incluent toute la plage Unicode arabe, ponctuation comprise. Une ponctuation arabe finale peut donc rester attachée à un mot latin : dans le test « weil و dass؟ », l’entité grammaticale `dass` n’est pas extraite.
- Les lexiques Darija synchronisés entre `ia.js` et `parle.js` ne sont pas contractuellement synchronisés avec QUST, BIBLIO et RAG.

### C. Limites observées dans QUST

Exécution directe de `js/qust.js` dans le présent environnement, sur des exemples ciblés :
- « wach الفرق بين weil و dass؟ » : comparaison reconnue, dialecte Darija reconnu ; l’entité `dass` est perdue à cause de la ponctuation.
- « 3lach kansta3mlo weil hna? » : Darija/Arabizi et allemand reconnus, mais intention nulle et confiance 0,1.
- « 3lach le verbe yji f lekher m3a weil? » : intention nulle.
- « What is the difference between present simple and past simple? » : langue anglaise reconnue, intention de comparaison nulle.
- « ¿Cuál es la diferencia entre ser y estar? » et « Qual è la differenza tra essere e avere? » : langue espagnole/italienne reconnue, intention de comparaison nulle.
- « علاش؟ » et « donne-moi un autre exemple » : aucune intention locale ; ces suivis peuvent être interprétés par le Worker grâce à l’historique du chat, mais le routeur local RAG ne reçoit pas cet historique.

L’extraction de `germanWord` prend le premier mot capitalisé sans validation lexicale suffisante : des débuts de phrases comme « What », « Cu » ou « Qual » peuvent être remontés comme faux mots allemands.

### D. Index RAG absent et pipeline incompatible

État réel de la branche :
- `assets/bdd/corpus_rag_index.json` est absent.
- Le dossier `assets/bdd/shards/` est absent.
- `shards_manifest.json` contient la version 1.0.0, zéro shard et zéro chunk.
- `rag.js` exige la version 2.0.0 pour accepter un manifeste et cherche l’index de repli `corpus_rag_index.json`. En l’état, la recherche plein texte RAG ne dispose d’aucun index exploitable et renvoie `null`.

Incompatibilités du pipeline :
- `tools/indexer_pdf.py` écrit les chunks dans `corpus_index.json`, qui est aussi le catalogue lexical chargé par BIBLIO. Ses chunks utilisent `n`, pas le champ `global_id` exigé par le lecteur RAG.
- `tools/ingest_corpus.py` sait produire `corpus_rag_index.json` avec des identifiants globaux, mais aucun workflow ne l’exécute.
- `tools/sharder_index.py` lit `corpus_rag_index.json` et produit un manifeste 2.0.0.
- `.github/workflows/sharder.yml` se déclenche pourtant sur `corpus_index.json`, pas sur `corpus_rag_index.json`.
- `.github/workflows/indexer.yml` exécute `indexer_pdf.py`, pas `ingest_corpus.py`.

Le test `tests/corpus_contract.mjs` détecte explicitement l’absence de l’index RAG séparé, mais il n’est pas exécuté par le workflow `tutor-audit`. Le test de sharder CI travaille sur des fixtures temporaires ; il ne valide pas les artefacts réels du dépôt.

### E. Plusieurs moteurs et chemins vocaux

- Le chat écrit principal passe par `reponseIA()`, puis par le Worker ; le secours local passe par `PROF.repondre()`, une base déterministe limitée, pas un deuxième modèle IA.
- `assets/matching_v2.patch.js` expose un moteur de rapprochement, mais `app.js` appelle directement `PROF.repondre()` en secours ; le patch de matching n’est pas raccordé à ce chemin.
- La voix est répartie entre `parle.js`, `ecoute.js`, `voix.js` et `js/voice-chat.js`. Les chemins n’envoient pas tous les mêmes métadonnées ni les mêmes consignes.
- `parle.js` dispose d’une sélection de voix plus large ; `voix.js` ne distingue pour les segments latins que l’allemand et le français. Les boutons de lecture qui utilisent `VOIX.parler` ne garantissent donc pas une prononciation correcte de l’anglais, de l’espagnol et de l’italien.
- Le parcours local `reponsePedagogique()` ne transporte pas l’historique des échanges comme le parcours Worker.

## 3. Tests et surveillance CI

- `.github/workflows/tutor-audit.yml` ne surveille pas plusieurs ressources déterminantes : `darja.json`, `intent_ontology.json`, les jeux d’évaluation, `questions_eleve.json`, `vocabulaire_eleve.json`, `biblio_multimatieres.json`, `traductions_livre.json`, `corpus_index.json`, `corpus_rag_index.json`, les shards, ni les scripts `ingest_corpus.py` et `indexer_pdf.py`.
- Ce workflow n’exécute pas `qust_unit.mjs`, `corpus_contract.mjs`, `rag_qust_probe.mjs`, ni l’évaluation des 146 intentions.
- `tests/tutor_matrix.json` indique explicitement `prepared_not_executed` ; le workflow le surveille comme fichier mais n’exécute pas ses cas.
- `tests/qustp1test.js` cherche `assets/bdd/qust_lexicon.json`, absent du dépôt, et attend d’anciens noms d’API. Ce harnais est obsolète.
- `deploy.yml` lance les régressions RAG/PROF/union sur main et les PR vers main, mais cela ne valide ni l’ontologie active, ni le corpus RAG réel, ni les tests QUST non intégrés.

## 4. Priorités recommandées pour le lot suivant

1. Créer une normalisation canonique unique qui conserve toujours le texte brut et traite proprement arabe, Darija, Arabizi, chiffres Arabizi, ponctuation et code-switching ; la partager entre QUST, chat, voix, BIBLIO et RAG.
2. Relier l’ontologie à un routeur réellement appelé, définir une table de correspondance unique entre les 25 intentions, QUST et le Worker, et traiter explicitement les intentions non prises en charge.
3. Réparer le pipeline RAG autour d’un artefact unique `corpus_rag_index.json`, d’identifiants globaux, d’un manifeste 2.0.0, des shards réels et de déclencheurs CI cohérents ; préserver `corpus_index.json` comme catalogue lexical distinct.
4. Ajouter les fichiers de lexique et d’index aux déclencheurs CI et exécuter les contrats manquants, notamment `corpus_contract.mjs`, `qust_unit.mjs` et l’évaluation des 146 formulations.
5. Unifier les chemins de voix et faire utiliser un même moteur TTS multilingue pour les six langues annoncées.
6. Compléter les corpus anglais, espagnol et italien avant de présenter ces matières comme des enseignants spécialisés alimentés par leur propre programme.

## 5. État final

- Audit de lecture terminé pour le périmètre code, tests, données lexicales, indexation et workflows liés à l’intelligence.
- Aucun code applicatif ou contenu pédagogique modifié.
- Aucun test Node natif ni GitHub Actions revendiqué comme exécuté ; seules l’exécution isolée de QUST et l’analyse de la logique de matching ont été faites dans l’environnement d’audit.
- Aucun déploiement, aucun merge, aucune modification de main.
- Aucune modification Supabase/Auth/RLS/schéma/données/paiement/secrets.
- PR #17 reste distincte et ouverte ; les diagnostics Messenger restent séparés.
