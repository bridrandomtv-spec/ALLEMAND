# Lot 640 — contrat de refus d'ingestion et cohérence des tests

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Diagnostic

La revue du pipeline a identifié un test en contradiction avec le comportement de sécurité réel : `ingest.construire()` lève `RuntimeError("Aucun chunk autorisé...")` si le lot ne produit aucun chunk autorisé. Le test attendait auparavant un retour normal avec un index vide. Il aurait donc échoué à l'exécution.

Le workflow `.github/workflows/corpus-contract-tests.yml` inclut bien le fichier de tests et lance `python -m unittest tests/test_corpus_pipeline.py -v`, puis des contrôles Node. Il utilise `ubuntu-latest`, Python 3.11 et Node 22. Les sources de workflow ne révèlent pas de défaut de déclenchement évident ; en revanche, aucun run/status exploitable n'a été remonté pour les derniers commits. L'absence de run retourné par l'outil consulté ne prouve pas à elle seule que GitHub n'a créé aucun run, car son endpoint commit ne remonte que les runs liés aux pull requests.

## Corrections

- Le test de lot sans document autorisé attend désormais explicitement le refus `RuntimeError`.
- Un nouveau test fournit un sidecar valide sur le plan général mais dépourvu de `usages_autorises`, puis vérifie que le pipeline refuse le lot avant même d'appeler l'extracteur.
- La suite Python comporte maintenant 31 méthodes de test statiques/contractuelles, dont les tests droits, provenance, index, transactions et cohérence multilingue.
- Le workflow n'est pas élargi et n'exécute aucune ingestion de documents réels.

## Limites de validation

- Les 31 tests n'ont pas été exécutés dans un interpréteur Python dans cette session.
- Aucun statut CI ni run associé au dernier commit n'a été fourni par les interfaces consultées. Aucun PASS CI n'est annoncé.
- Le contrôle Node `tests/index_paths_contract.mjs` est statique ; il avertit si l'index RAG ou les shards sont absents, sans générer ces artefacts.
- L'index RAG réel est toujours absent du dépôt audité ; le manifeste de shards n'a pas de shards publiés. BIBLIO conserve son index lexical historique distinct.
- Aucun PDF réel n'a été copié, converti, OCRisé ou indexé. Aucun droit documentaire individuel n'a été inventé.

## État Git et sécurité

- Branche : `audit/lot-603-corpus-contract-tests`.
- Comparaison observée : 294 commits d'avance, 0 en retard ; `main` reste au SHA `034722b00739c0106cd265eefdd1c933a096217d`.
- Aucun merge, aucun déploiement, aucune écriture Supabase/Auth/RLS/schéma/données/paiement/secrets.

## Lot 641 — suite logique

1. Obtenir un vrai run Actions (ou un diagnostic d'accès/runner vérifiable) et exécuter la suite complète.
2. Exécuter le contrôle Node dans un checkout réel afin de vérifier aussi la disponibilité de `corpus_index.json`, du catalogue et du manifeste.
3. Ajouter un test de non-régression de `main()` qui prouve que le refus d'un lot sans droits conserve les deux anciens JSON et les fichiers sources.
4. Préparer un corpus RAG synthétique séparé des ressources scolaires réelles, avec pages et SHA-256 déterministes.
5. Seulement après validation, brancher les tests de requêtes tuteur sur un environnement Worker/modèle explicitement configuré ; les fixtures seules ne constituent pas une preuve de compréhension linguistique.
