# Lot 639 — périmètre d'exploitation explicite avant ingestion

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Décision

Une déclaration générale d'autorisation ne doit pas être transformée en permission implicite pour chaque opération. BIBLIO distingue désormais le statut de droits (production propre, domaine public, autorisation écrite, licence libre) du périmètre concret accordé au pipeline.

La redistribution du document intégral n'est jamais déduite du seul droit d'extraction ou d'indexation. Elle doit être explicitement déclarée comme usage autorisé.

## Modifications

- `tools/rights_metadata.py` exige désormais une liste `usages_autorises` explicite.
- Les usages minimaux requis pour le pipeline actuel sont : `hebergement_source`, `extraction_texte`, `indexation_rag`, `restitution_extraits`.
- Les valeurs inconnues sont rejetées. `ocr`, `traduction` et `redistribution_document` sont des usages distincts ; ils ne sont pas accordés implicitement.
- La preuve humaine, la source, le titulaire, le déclarant, les dates et les conditions propres au type de licence restent obligatoires.
- Trois tests supplémentaires couvrent l'absence de périmètre, un périmètre incomplet/inconnu et la non-implication de la redistribution intégrale. Les fixtures synthétiques autorisées ont été complétées avec le périmètre minimal.

## Ce que les données démontrent — et ne démontrent pas

- Le registre contient 239 fiches ; les mentions historiques de licence sont 225 « document utilisateur », 8 « usage pédagogique », 4 « production propre » et 2 mentions de document fourni par l'utilisateur. Ces étiquettes ne valent pas preuve d'autorisation.
- L'inventaire Git comporte 293 PDF, tous encore « à qualifier / à rapprocher de l'autorisation » dans le CSV du Lot 629 ; aucune référence d'autorisation ni preuve vérifiée n'y est renseignée.
- Le fichier `assets/bdd/corpus_rag_index.json` est absent et `shards_manifest.json` annonce zéro shard. Aucun index RAG réel ne peut être contrôlé ou présenté comme opérationnel sur cette branche.
- La déclaration du propriétaire sur l'autorisation ministérielle est conservée comme information de projet, mais le numéro/date/autorité émettrice/périmètre et la preuve consultable ne sont pas présents dans les artefacts audités. Aucun document n'a donc été déclaré autorisé individuellement sur la seule base de cette déclaration.

## Validation

- Les changements ont été enregistrés sur la branche d'audit.
- Les tests Python n'ont pas été exécutés localement dans cette session.
- Le workflow GitHub peut se déclencher sur les fichiers modifiés, mais un commit ne prouve pas que le runner a démarré ni que les tests ont réussi. Le statut Actions doit être vérifié séparément.
- Aucun PDF n'a été extrait, OCRisé, copié ou indexé. Aucun index ou manifeste réel n'a été généré.
- Aucun changement sur `main`, aucune fusion, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/données/paiements/secrets.

## Suite — Lot 640

1. Vérifier l'état effectif des runs Actions associés aux commits du Lot 639 et diagnostiquer un éventuel blocage de runner sans supposer sa cause.
2. Ajouter un vrai test de refus d'ingestion d'un sidecar dont le périmètre ne couvre pas les usages requis.
3. Obtenir/référencer la preuve d'autorisation et qualifier les PDF par lots homogènes ; ne pas inventer de licence ni de numéro d'acte.
4. Construire un corpus RAG synthétique et isolé, puis un harnais d'échanges Worker/modèle observables pour les 23 cas du tuteur. Les fixtures ne doivent jamais être présentées comme des réponses réelles du modèle.
5. Commencer ensuite le moteur de maîtrise BKT/FSRS sur des données pédagogiques synthétiques, avant toute persistance de progression réelle.
