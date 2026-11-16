# Lot 654 — application du périmètre d'autorisation à tous les indexeurs

Date : 16 novembre 2026  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Faire appliquer le contrôle du périmètre documentaire des autorisations écrites aussi bien par l'ingestion multi-format que par l'indexeur PDF historique. Le contrôle doit intervenir avant l'extraction du contenu.

## Corrections

- `tools/ingest_corpus.py` : l'import de repli utilisé lors d'une exécution directe importe maintenant aussi `document_couvert`. Le chemin d'exécution direct ne provoque plus de référence non définie lors du contrôle du périmètre.
- `tools/indexer_pdf.py` : l'indexeur PDF calcule l'identifiant documentaire déterministe et le SHA-256 du fichier, puis vérifie la couverture de l'autorisation avant d'extraire le PDF. Un fichier hors périmètre est ignoré et n'engendre aucun document ni chunk.
- Les deux modes d'autorisation restent couverts : identifiant documentaire exact ou empreinte SHA-256 exacte. Aucun périmètre n'est élargi implicitement. Le type de licence est normalisé (espaces et casse) avant de décider si le contrôle spécifique à l'autorisation écrite s'applique.
- Trois tests ajoutés : import de repli en exécution directe, refus avant extraction hors périmètre, acceptation d'une empreinte explicitement couverte.

## Portée et limites

Les autorisations utilisées dans les tests sont des fixtures synthétiques, uniquement destinées à tester le logiciel. Elles ne constituent pas une autorisation ministérielle réelle et ne qualifient aucun des PDF existants. Aucun PDF du corpus réel n'a été extrait, OCRisé, indexé ou redistribué.

## Validation

Les tests sont ajoutés mais leur exécution doit être confirmée par un runner. Après les commits du Lot 654, les workflows `43843641257` et `43843634363` se sont également terminés en échec avant les étapes : les jobs n'exposent aucune étape (`steps=null`) et le téléchargement des logs renvoie 404 (aucun journal disponible). Cela confirme un blocage d'exécution côté runner/infrastructure, pas un résultat de tests. Les tests restent donc non exécutés et non certifiés.

## Sécurité et déploiement

Aucune modification de `main`, Supabase, Auth, RLS, schéma, données, paiement ou secrets. Aucun merge et aucun déploiement.
