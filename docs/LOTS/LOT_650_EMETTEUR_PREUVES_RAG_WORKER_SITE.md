# Lot 650 — émetteur de preuves RAG côté Worker du site

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Remplacer la confiance accordée au navigateur par une preuve HMAC produite par le Worker du site, à partir des artefacts documentaires réellement publiés. Le navigateur ne choisit ni le chunk ni le contexte signé.

## Changements

### 1. Route serveur `POST /api/rag-evidence` dans `src/site-worker.js`

Le Worker du site utilise son binding `ASSETS` pour charger le manifeste, le catalogue et chaque shard. Il vérifie avant de sélectionner un extrait :

- manifeste version `2.0.0`, génération SHA-256, compteurs et descripteurs ;
- génération de chaque shard, nombre de chunks et de termes ;
- unicité des identifiants globaux et cohérence des postings ;
- concordance SHA-256 entre chunk et fiche catalogue ;
- provenance documentaire et preuve de droits structurée ;
- type de licence, titulaire, déclarant, déclaration explicite, validation humaine, référence de preuve, dates et usages autorisés ;
- correspondance exacte de page ; unité/exercice uniquement si des champs numériques structurés existent sur le chunk.

Les chunks dont les droits ne sont pas qualifiés sont exclus des candidats ; ils ne sont jamais signés. Une incohérence structurelle de l'index entraîne un refus global. L'endpoint n'accepte que les requêtes same-origin, les questions sont bornées à 600 caractères et la clé `RAG_EVIDENCE_HMAC_KEY` doit faire au moins 32 caractères.

Le contexte est construit côté Worker à partir du catalogue et du chunk. Le Worker signe un jeton HMAC-SHA-256 contenant la portée, le document, le chunk, l'empreinte source et l'empreinte du contexte exact ; validité 180 secondes.

### 2. Intégration tuteur

- `ia.js` appelle l'endpoint serveur pour une demande précise de page, unité ou exercice.
- Le contexte signé remplace le contexte RAG local pour éviter toute modification de l'empreinte.
- Le tuteur n'ajoute pas de réponse locale au contexte signé.
- Le jeton est transmis à `worker/ia-ask.js`, qui vérifie la signature, la portée extraite de la question originale, l'empreinte du contexte et la fenêtre temporelle.
- Une citation n'est rendue que si le Worker CERVEAU retourne `rag_evidence_verified: true`.

### 3. Conservation des preuves de droits à l'ingestion

- `tools/rights_metadata.py` expose `projection_preuve_droits()`, qui valide et copie les champs minimaux de preuve.
- `tools/ingest_corpus.py` et `tools/indexer_pdf.py` conservent cette preuve dans `documents[].droits`.
- Les tests Python vérifient la conservation de la référence de validation et des usages autorisés.
- Les imports en exécution directe ont également été mis à jour.

### 4. Tests et CI

Nouveau test `tests/site_worker_rag_evidence_runtime.mjs` : preuve HMAC, empreinte du contexte, page exacte, page divergente, unité absente, clé manquante, origine externe, droits absents/incomplets et shard incohérent.

`tests/ia_rag_orchestration_runtime.mjs` couvre la récupération du contexte signé et le maintien de son empreinte. `tests/test_corpus_pipeline.py` couvre la projection des droits et leur conservation à l'ingestion.

Le workflow `.github/workflows/tutor-audit.yml` inclut la syntaxe du Worker de site, le test runtime du signataire et la suite Python d'ingestion. Aucun résultat CI exploitable n'a été remonté au moment de la rédaction ; aucun test n'est déclaré réussi.

## État réel des données au moment du Lot 650

L'inspection du dépôt a compté 239 fiches dans `assets/bdd/corpus.json` :

- 0 fiche avec `source_sha256` ;
- 0 fiche avec un objet `droits` structuré ;
- `shards_manifest.json` est en version `1.0.0`, avec zéro shard et zéro chunk ;
- `assets/bdd/corpus_rag_index.json` est absent.

Conséquence : le nouveau signataire ne peut actuellement émettre aucune preuve issue du corpus réel. Même avec une clé configurée, le manifeste actuel serait refusé. Les documents existants ne seront pas certifiés rétroactivement par leurs anciennes étiquettes de licence. Ils devront passer par le pipeline d'ingestion et une qualification individuelle des droits.

## Limites et sécurité opérationnelle

- Aucun secret `RAG_EVIDENCE_HMAC_KEY` n'a été créé, copié ou configuré pendant ce lot. La même valeur devra être configurée comme secret côté Worker du site et Worker CERVEAU, sans l'inscrire dans Git.
- Le contrôle porte sur la concordance des empreintes du chunk et de la fiche catalogue ; le Worker ne relit pas les octets du PDF source à chaque requête.
- Le parcours de validation recharge et contrôle les shards à chaque demande ; une optimisation/cache et une protection de débit seront nécessaires avant trafic élevé.
- Les unités et exercices ne peuvent être attestés que lorsque les chunks portent des identifiants structurés exacts. Aucun identifiant n'est inventé à partir du titre ou du texte.
- Les tests utilisent des fixtures synthétiques et des secrets temporaires en mémoire ; ils ne valident ni le déploiement Cloudflare ni le modèle réel.
- Aucun PDF réel ingéré/OCRisé/indexé, aucune autorisation individuelle créée ou supposée.
- Aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets, aucune fusion dans `main`.

## Suite — Lot 651

1. Construire un pré-audit non destructif du registre existant : empreintes, preuves de droits, champs de portée et chemins source.
2. Produire un corpus RAG synthétique complet et cohérent (catalogue, index, shards, génération) pour tester la chaîne entière sans mélanger de données réelles.
3. Vérifier les exécutions CI sur le commit courant et corriger les échecs observés.
4. Planifier seulement ensuite la qualification et la réingestion réelle des documents autorisés ; aucune clé ni déploiement avant vérification et autorisation explicite.
