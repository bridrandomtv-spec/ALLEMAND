# Lot 633 — protection transactionnelle des artefacts et blocage des runners

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## 1. Remplacement coordonné du catalogue et de l'index

Ajout dans `tools/corpus_contracts.py` de `ecrire_json_transactionnel(artefacts)` :
- sérialise tous les artefacts dans des fichiers temporaires placés dans les répertoires de destination ;
- flush et fsync avant remplacement ;
- remplace les fichiers avec `os.replace` (atomicité par fichier) ;
- conserve les octets originaux et restaure les fichiers déjà remplacés si un remplacement suivant échoue ;
- supprime les temporaires résiduels.

Les deux pipelines (`tools/ingest_corpus.py` et `tools/indexer_pdf.py`) utilisent maintenant cette fonction pour publier ensemble catalogue et index, avec rollback en cas d'exception pendant la séquence.

Limite technique explicite : deux fichiers distincts ne peuvent pas être rendus atomiques face à une coupure électrique/processus brutal entre les deux `os.replace` avec cette architecture. Le rollback couvre les exceptions Python détectées, pas une panne de machine au milieu de la séquence. Une génération versionnée avec pointeur/manifest unique serait nécessaire pour une atomicité stricte après crash.

## 2. Tests ajoutés

Dans `tests/test_corpus_pipeline.py` :
- test de succès de création de deux JSON ;
- simulation d'échec au second remplacement ;
- vérification que le premier fichier est restauré et que le second reste inchangé ;
- vérification qu'aucun fichier temporaire ne reste après rollback.

Les tests précédemment ajoutés pour TXT, PDF synthétique deux pages, SHA-256 et conservation des chunks restent en place.

## 3. Imports directs corrigés

Les chemins d'import package et exécution directe de `ingest_corpus.py` et `indexer_pdf.py` incluent tous deux le writer transactionnel. Vérification statique du texte des fichiers effectuée ; aucune exécution Python locale ni CI n'a certifié ces chemins.

## 4. Blocage GitHub Actions

Les exécutions récentes du workflow `Contrats du pipeline documentaire RAG` continuent de terminer en échec quasi immédiat. Exemple :
- run `43764379138`, job `132966072695` ;
- `runner_id: 0`, `runner_name: ""`, `steps: []`, durée d'environ deux secondes.

Cela confirme que le runner n'a pas été affecté et que les étapes checkout/setup/test n'ont pas démarré. Les tests restent non exécutés et non certifiés.

Le contexte des diagnostics précédents comporte un avertissement GitHub Actions indiquant que des paiements récents ont échoué ou que la limite de dépenses doit être augmentée. L'API des runs ne révèle pas elle-même la cause de facturation ; le propriétaire doit vérifier GitHub > Billing & plans / Actions spending limit et rétablir un moyen de paiement ou une limite suffisante. Aucune modification de facturation n'a été faite ici.

## 5. Sécurité et périmètre

- Aucun PDF réel importé, aucun OCR, aucune indexation réelle.
- Aucun artefact de production remplacé.
- Aucun changement de `main`, fusion, déploiement, Supabase/Auth/RLS/schéma/données/paiements/secrets.
- PR #17 n'a pas été modifiée.

## 6. Suite — Lot 634

1. Une fois le blocage de facturation/runners levé, lancer les tests et corriger les erreurs réelles.
2. Pour l'atomicité stricte après crash, migrer vers des générations versionnées (catalogue + index dans un même dossier versionné) et un pointeur de génération remplacé atomiquement.
3. Faire un test d'intégration de bout en bout du chemin PDF et multi-format sur fixtures synthétiques uniquement.
4. Vérifier l'affichage utilisateur du titre documentaire, de la page et de l'empreinte source dans la réponse RAG.
5. Maintenir l'interdiction d'ingérer les manuels réels tant que l'autorisation et son périmètre exact ne sont pas rattachés à chaque source.


## Vérification complémentaire de PR #17

La lecture de l'état GitHub actuel montre que la PR #17 est déjà `closed` et `merged`, avec fusion le **2026-11-14 à 14:50:08 UTC**, commit de fusion `ef781da525eb4df062841c4362a999811fe35831`. Cette fusion précède les opérations du Lot 633 ; aucun appel de fusion n'a été effectué pendant ce lot. La branche d'audit reste à jour par rapport à `main` au moment du contrôle : 248 commits en avance, 0 en retard.
