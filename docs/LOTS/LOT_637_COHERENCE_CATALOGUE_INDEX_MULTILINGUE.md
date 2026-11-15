# Lot 637 — cohérence catalogue pédagogique ↔ index RAG

## Constat sur les artefacts présents
- `assets/bdd/corpus.json` contient 239 fiches documentaires.
- Les 239 fiches ont un ID non vide et unique ; les champs `matiere`, `niveau` et `langue` sont renseignés.
- Langues déclarées dans ce catalogue : `ar+de`, `de`, `de+ar`, `en`.
- Matières déclarées : `allemand`, `anglais`. Les langues/matières espagnol et italien ne sont pas encore présentes dans ce catalogue.
- `assets/bdd/corpus_rag_index.json` n'est pas présent sur la branche audit. Il est donc impossible de calculer les références orphelines réelles ou de confirmer la couverture RAG des 239 documents.
- Incohérence documentaire supplémentaire : la description d'architecture intégrée dans les métadonnées de `corpus.json` mentionne encore `corpus_index.json` comme index plein texte, alors que les indexeurs récents ciblent `corpus_rag_index.json`. Ce libellé historique doit être clarifié dans un lot documentaire dédié ; aucun artefact de corpus n'a été réécrit ici.
- `tests/tutor_matrix.json` contient 23 cas couvrant notamment darija, arabe, français, allemand, anglais, espagnol et italien, mais son statut est `prepared_not_executed`.

## Corrections apportées
- Ajout de `valider_coherence_catalogue_index(catalogue, index)` dans `tools/corpus_contracts.py`.
- Le validateur refuse les IDs documentaires absents/dupliqués, les chunks sans document catalogue, les métadonnées de matière/niveau/langue manquantes sur les documents effectivement référencés, et les divergences SHA-256 entre fiche et chunk lorsque les deux empreintes sont fournies.
- Il n'exige pas que chaque fiche catalogue possède déjà un chunk : cela préserve les ressources structurées/legacy encore exploitées par BIBLIO et évite de supprimer artificiellement les fiches non extraites.
- Le validateur est appelé avant publication par `tools/ingest_corpus.py` et `tools/indexer_pdf.py`.
- Six tests synthétiques couvrent les fiches non indexées conservées, les chunks orphelins, les IDs dupliqués, la langue absente, les empreintes divergentes et cinq métadonnées linguistiques (allemand, arabe, français, espagnol, italien).

## Limites
- Tests non exécutés dans cette session ; aucun runner CI exploitable n'a été confirmé. Ne pas annoncer une CI verte.
- Le fichier d'index RAG absent empêche toute mesure sur les données indexées réelles.
- Aucun document réel, PDF ou OCR n'a été ingéré ; aucun manifeste ou catalogue de production n'a été modifié.
- Aucune modification Supabase/Auth/RLS/paiement, aucun déploiement Cloudflare, aucune fusion dans main.

## Suite proposée
Lot 638 : auditer le décalage documentaire `corpus_index.json` / `corpus_rag_index.json`, puis exécuter la matrice de 23 cas sur les parcours locaux/cloud en gardant la séparation entre test synthétique et preuve issue d'un manuel.
