# Lot 717 — audit complémentaire des JSON pédagogiques et du corpus — 20/11/2026

## Périmètre et méthode
Audit documentaire en lecture seule de la totalité des 30 fichiers JSON restants du répertoire `assets/bdd/` après les Lots 706–716. Contrôle des structures, métadonnées, cardinalités, références documentaires, et consommateurs JavaScript pertinents. Aucun contenu personnel ou coordonnée sensible n'est reproduit ici.

## Résultats

### 1. `devoirs.json` — incohérence de cardinalité et provenance non démontrée
- Lecture complète du blob Git (environ 1,13 Mo) et analyse des 379 entrées.
- `_meta.nombre` annonce 363 entrées ; le tableau contient 379 éléments, soit un écart de 16.
- `redistribution_v3` annonce 113 entrées 2AS + 237 entrées 3AS = 350, alors que le contenu contient 131 entrées 2AS, 246 entrées 3AS et deux entrées aux niveaux A2-B1/A1-B1.
- 348 éléments sont de type devoir ; 31 sont d'autres types (lectures, citations, énigme et modèle).
- Les 379 entrées ont un champ `source`, mais aucune n'a de `source_url` ni de `document_id`. Les libellés de provenance incluent des attributions institutionnelles ou génériques, sans pièce primaire vérifiable dans ce fichier.
- 133 entrées ont des références de pages de livre. 22 fiches renseignent un champ lycée ; aucun champ wilaya ou ville n'est renseigné avec une valeur non-placeholder dans le comptage.
- Les 379 entrées contiennent un corrigé inclus ; cela ne prouve ni l'authenticité de la source ni la validation indépendante des réponses.
- Le fichier est chargé par `devoirnote.js` et `devoirs_unite.js`. Le Worker protège bien le chemin `/assets/bdd/devoirs.json`, mais le dépôt GitHub public permet toujours l'accès direct Raw/API.

### 2. Bibliothèque et index
- `biblio_multimatieres.json` : 1 213 entrées réelles, conforme au compteur déclaré ; identifiants uniques et champs allemand/français/arabe renseignés dans toutes les entrées contrôlées.
- `corpus_index.json` : 490 éléments ; deux groupes de numéros `n` dupliqués. Sa métadonnée décrit un ancien segment de 354–379 mots et ne correspond pas à la cardinalité actuelle. Fichier chargé par `biblio.js`.
- `corriges_gen.json` : 22 entrées, sans métadonnées de provenance primaire dans le fichier.
- `traductions_livre.json` : 761 entrées. Les métadonnées décrivent des lots et une relecture, mais le fichier ne contient pas de référence primaire par entrée permettant de vérifier indépendamment l'origine ou les droits.
- `contenu_original.json` déclare une production pédagogique originale et une licence propriétaire ; cette déclaration est une métadonnée du dépôt, pas une preuve externe indépendante.

### 3. Livres 3AS, unités 4 à 8
- `buch_3as_l4.json` à `buch_3as_l8.json` contiennent des textes qualifiés d'extraits, avec renvois à des pages de manuel.
- Leurs métadonnées visibles se limitent au titre et au niveau ; aucune licence, autorisation ou référence documentaire primaire n'est jointe à ces cinq fichiers.
- Le Worker inclut ces chemins dans `PROT` ; cela protège le service Worker contre l'accès anonyme au contenu protégé, mais ne retire pas les blobs du dépôt GitHub public ni l'accès Raw/API.
- Risque de droits à résoudre avant fusion : la présence des extraits dans le dépôt public n'est pas justifiée par une preuve de licence dans les fichiers audités.

### 4. RAG et ressources linguistiques
- `corpus_rag_chunks.json` : tableau `documents` vide et tableau `chunks` vide.
- `corpus_rag_vectors.json` : configuration de modèle/dimension présente, mais tableau `vectors` vide. Aucun embedding effectif n'est stocké dans cet artefact.
- Les ressources `darja.json`, `sharh.json`, `grammaire.json`, `malakhiss.json`, `english_grammaire.json`, `english_malakhiss.json`, `english_pages.json`, `english_vocab.json`, `english_exercises.json` et `english_devoirs.json` sont des contenus linguistiques/pédagogiques structurés. Les contrôles de clés n'ont pas révélé de schéma de profil personnel ni de secret d'authentification.
- Les contenus d'anglais incluent sujets et corrigés d'exemple. Leur caractère libre ou réservé à un niveau d'accès doit être confirmé selon la politique commerciale attendue ; aucune modification n'a été faite.

### 5. Référentiels
- `intent_ontology.json`, `languages.json`, `matieres.json`, `referentiel.json`, `subjects.json`, `wilaya.json` et `wilayas_geo.json` contiennent des taxonomies, référentiels scolaires ou données géographiques. Aucun secret d'authentification ni champ de profil individuel n'a été détecté dans les structures examinées.
- Les champs géographiques et noms de wilayas sont des référentiels territoriaux, pas des données de localisation d'élèves.

## Risques et décisions nécessaires
1. **Bloquant droits :** justifier les droits/licences des extraits présents dans les cinq fichiers `buch_3as_l4` à `buch_3as_l8`, ou décider de leur retrait du dépôt public et de leur migration vers un stockage privé. Ne pas confondre garde Worker et confidentialité GitHub.
2. **Provenance :** les 379 devoirs ne possèdent aucune référence primaire par entrée ; les attributions de source ne peuvent pas être considérées comme vérifiées. Conserver le statut non vérifié tant qu'une URL/document primaire n'est pas attaché.
3. **Fiabilité des métadonnées :** réconcilier le compteur 363, les totaux de redistribution 350 et les 379 éléments réels avant de publier des métriques ou de bâtir des contrôles de complétude.
4. **Index vocabulaire :** réconcilier les 490 éléments et les deux numéros dupliqués dans `corpus_index.json`, puis corriger sa métadonnée obsolète.
5. **Accès GitHub :** les protections Worker ne révoquent pas la lecture des blobs du dépôt public. Les documents protégés en runtime demeurent récupérables via GitHub Raw/API tant que le dépôt est public.

## Actions réalisées
- Audit en lecture seule ; aucun JSON, JS, Worker ou contenu pédagogique modifié.
- Aucun changement Supabase, Auth, RLS, schéma, abonnement, paiement ou infrastructure.
- Aucun changement sur `main`, aucune fusion et aucun déploiement.
- PR #23 maintenue ouverte et en brouillon.
