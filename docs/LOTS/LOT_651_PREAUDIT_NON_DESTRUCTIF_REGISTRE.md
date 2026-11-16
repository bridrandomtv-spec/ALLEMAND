# Lot 651 — pré-audit non destructif du registre documentaire

Date : 2026-11-16  
Branche : `audit/lot-603-corpus-contract-tests`

## Objectif

Établir l'état des 239 fiches BIBLIO avant toute conversion PDF, OCR, ingestion RAG ou qualification de droits. Le lot n'altère aucun document source ni aucune fiche du catalogue.

## Constat vérifié dans l'arbre Git de la branche

- 239 fiches dans `assets/bdd/corpus.json`.
- Formats déclarés : 225 PDF, 8 JSON et 6 HTML.
- Les 225 chemins PDF du catalogue existent dans l'arbre Git, sous `docs/archive/documents/`.
- Taille cumulée des 225 blobs PDF selon l'arbre Git : 129 697 189 octets (environ 123,69 Mio).
- Les 8 chemins JSON du catalogue existent également.
- Les 6 entrées HTML pointent vers `#english`, qui est une ancre d'application et non un fichier HTML autonome.
- Aucune des 239 fiches ne porte `source_sha256`.
- Aucune des 239 fiches ne porte d'objet structuré `droits`.
- Aucun sidecar `_<nom>.json` n'a été trouvé à côté des 225 PDF dans `docs/archive/documents/`.
- Étiquettes historiques recensées : 225 `document utilisateur`, 8 `usage pédagogique`, 4 `production propre`, 2 déclarations d'intégration utilisateur.

Attention : le SHA Git de l'objet blob est un identifiant Git (SHA-1 dans ce dépôt), pas le SHA-256 des octets du PDF. Les tailles et présences ci-dessus proviennent de l'arbre Git ; le SHA-256 réel des 225 fichiers doit être calculé par le script local/CI.

## Interprétation

### Disponibilité

Les 225 PDF sont bien versionnés dans le dépôt. Leur chemin est traçable. Cela ne signifie pas qu'ils sont déjà extraits, OCRisés ou indexés.

### Intégrité

Les empreintes SHA-256 manquent dans toutes les fiches. Il faut calculer les empreintes sur les octets réels des fichiers, les enregistrer dans le catalogue après contrôle et vérifier les correspondances chunk/document. Il ne faut jamais convertir un SHA Git en SHA-256 source.

### Droits

L'utilisateur a indiqué disposer d'une autorisation institutionnelle pour exploiter les ressources scolaires dans un but pédagogique. Le dépôt consulté ne contient toutefois pas de pièce, référence ou périmètre documentaire vérifiable permettant d'associer cette autorisation à chacun des 225 PDF. Les libellés `document utilisateur` et `usage pédagogique` ne suffisent pas à démontrer les usages de stockage, extraction, OCR, indexation RAG et restitution d'extraits. Ils ne prouvent pas non plus une autorisation de redistribution intégrale.

Ce constat ne nie pas l'autorisation annoncée ; il indique seulement que sa preuve et son périmètre ne sont pas encore traçables dans les artefacts du dépôt. Il faudra rattacher une référence institutionnelle authentique et son périmètre aux documents concernés, sans fabriquer de licence ou de référence.

## Outil ajouté

`tools/audit_corpus_registry.py` réalise un audit en lecture seule :

- valide les chemins relatifs et bloque les traversées de répertoire ;
- contrôle la présence des fichiers ;
- calcule leur SHA-256 par blocs sans charger le fichier entier en mémoire ;
- compare l'empreinte calculée à celle du catalogue lorsqu'elle existe ;
- recherche le sidecar attendu `_<nom>.json` ;
- valide le périmètre de droits via `tools/rights_metadata.py` ;
- rapporte les constats cumulables (source manquante, empreinte absente/invalide, hash divergent, sidecar absent, métadonnées de droits invalides) ;
- produit un rapport JSON détaillé et un rapport Markdown.

Le script n'écrit jamais dans le catalogue, les PDF ou les sidecars. Seuls les deux fichiers de rapport demandés en sortie sont créés.

## Tests ajoutés

Dans `tests/test_corpus_pipeline.py` :
- source présente + sidecar de droits valide + empreinte concordante ;
- source absente ;
- chemin avec traversée de répertoire ;
- empreinte de catalogue divergente.

Le workflow `.github/workflows/tutor-audit.yml` exécute ces tests, lance le pré-audit et publie les rapports comme artefact `audit-corpus-registry`.

## État CI observé

Le workflow s'est bien déclenché sur les commits du lot, mais les exécutions récentes se terminent en échec avant de démarrer les étapes :
- dernier run observé : `43831138421` ;
- job `133176494256` : `runner_id = 0`, aucune étape déclarée ;
- aucun log de job récupérable par l'API au moment du contrôle ;
- aucun artefact produit.

Il n'est donc pas possible de conclure que les tests Python ou Node ont échoué : le runner n'a pas fourni de trace d'exécution. Les tests restent non certifiés jusqu'à une exécution réelle avec étapes/logs disponibles.

## Suite

1. Obtenir une exécution CI disposant d'un runner et de logs ; diagnostiquer le démarrage du job.
2. Exécuter le pré-audit complet pour produire les SHA-256 réels des fichiers présents.
3. Collecter et vérifier la référence institutionnelle d'autorisation et son périmètre, puis la rattacher aux documents réellement couverts.
4. Réingérer un petit lot pilote uniquement après qualification des droits ; OCR séparé pour les PDF sans texte exploitable.
5. Construire le manifeste/shards RAG à partir de l'index pilote et vérifier l'émetteur HMAC sur les vrais artefacts.

Aucun PDF n'a été converti, copié ou indexé dans ce lot. Aucun secret configuré, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/données/paiements, aucune fusion dans `main`.
