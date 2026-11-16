# Lot 653 — périmètre documentaire opposable pour les autorisations écrites

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Empêcher qu'une autorisation écrite générale soit appliquée à un document sans preuve que ce document entre dans le périmètre couvert. Le contrôle doit être cohérent dans le validateur Python, l'ingestion, le pré-audit et l'émetteur de preuves RAG côté Worker.

## Contrat ajouté

Pour `licence=autorisation_ecrite`, le sidecar doit maintenant fournir `perimetre_documentaire` avec au moins une liste non vide parmi :
- `identifiants_documents` : IDs documentaires exacts ;
- `empreintes_sha256` : empreintes SHA-256 exactes en minuscules (64 caractères hexadécimaux).

Les listes doivent être structurées, sans valeurs vides ni doublons. Les empreintes doivent respecter le format SHA-256. La référence d'autorisation et la validation humaine restent requises.

Une fonction commune `document_couvert(meta, document_id, source_sha256)` vérifie l'appartenance. Pour les autres catégories de licence, le comportement existant demeure inchangé.

## Contrôles raccordés

- `tools/rights_metadata.py` : valide le périmètre et le conserve dans la projection de preuve.
- `tools/ingest_corpus.py` : calcule l'ID et le SHA-256 du fichier puis vérifie la couverture **avant extraction de texte**. Un fichier hors périmètre est ignoré.
- `tools/audit_corpus_registry.py` : marque la preuve comme non valide pour le document si l'ID et l'empreinte ne correspondent pas.
- `src/site-worker.js` : ne retient pour le RAG que les chunks dont le document et le SHA-256 sont couverts par la preuve écrite.
- Tests Python et runtime Worker : couverture par ID, couverture par hash, refus d'un document extérieur au périmètre et périmètre vide.

## Prudence sur la preuve institutionnelle

Aucune référence administrative, date, autorité émettrice, copie de décision ou liste officielle de documents n'a été ajoutée par ce lot. Les valeurs de test sont synthétiques et ne constituent pas une autorisation réelle. Le déclarant devra renseigner les identifiants ou SHA-256 qui correspondent réellement au périmètre du document institutionnel.

L'inventaire Lot 629 reste donc à qualifier. Aucune des 225 entrées PDF précédemment recensées dans le registre courant n'est automatiquement autorisée par cette modification.

## Validation et état

- Modifications enregistrées sur la branche d'audit.
- Tests ajoutés mais non certifiés tant qu'un runner GitHub n'a pas exécuté les étapes.
- Aucun PDF réel extrait, OCRisé, copié ou indexé.
- Aucun sidecar réel ni référence d'autorisation inventés ou créés.
- Aucun secret HMAC, déploiement, fusion `main`, ni changement Supabase/Auth/RLS/schéma/données/paiements.

## Suite

1. Rétablir une exécution Actions avec runner et logs.
2. Exécuter les tests Python/Node et le pré-audit en lecture seule.
3. Obtenir la référence réelle de l'acte et son périmètre (catégories, fichiers, usages, dates, titulaire/autorité).
4. Constituer une liste d'IDs ou SHA-256 seulement après rapprochement avec cette preuve.
5. Préparer ensuite un pilote d'ingestion limité aux documents effectivement couverts.
