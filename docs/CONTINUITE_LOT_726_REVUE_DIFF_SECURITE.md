# Lot 726 — revue du diff et des contrôles de sécurité PR #23

Date : 21 novembre 2026  
PR : https://github.com/bridrandomtv-spec/ALLEMAND/pull/23  
Branche : `ai/rag-corpus-integrity-lot-635`  
HEAD revu : `8d8836d649d7c9817644171ddafb9ffe4c49e238`  
Base/main : `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`

## 1. État GitHub et CI

- PR #23 : ouverte, brouillon, non fusionnée, `mergeable=true`.
- Comparaison GitHub : 405 commits en avance, 0 en retard, 58 fichiers modifiés ; 8 150 additions et 840 suppressions selon les métadonnées PR.
- `main` reste à `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`.
- Workflows associés au HEAD : CI principale #4821 (run `44890081991`) réussie ; trois workflows PostgreSQL (runs `44890081992`, `44890081983`, `44890082019`) réussis.
- Aucun déploiement n'a été lancé par ce lot.

## 2. Périmètre du diff

Le diff complet de la PR contient 58 chemins :
- CI et automatisation : `.github/workflows/deploy.yml` modifié ; workflows historiques `indexer.yml` et `sharder.yml` supprimés.
- Données pédagogiques/provenance : `annales.json`, `bac.json`, `bac_archive.json`, `buch_pages.json`, `compositions.json`, `corpus.json`, `devoirs_officiels.json`, jeux d'évaluation d'intentions et ontologie.
- Interface : `bdd.js`, `corpus.js`, `devoirs_unite.js`, `examen.js`, `ia.js`, `library.js`, `officiels.js`, `rag.js`.
- Sécurité/ingestion : `src/site-worker.js`, `worker/ia-ask.js`, outils d'ingestion et de génération d'embeddings.
- Tests : suites de provenance, qualité des corrections, Worker, RAG, ingestion et inventaire des droits.
- Documentation : dossiers de continuité des Lots 709–725 et document général.

Aucun fichier de schéma SQL, migration, configuration Supabase, Auth, RLS, abonnement ou paiement n'apparaît dans la liste des 58 fichiers modifiés.

## 3. Points techniques examinés

### 3.1 RAG serveur et intégrité des artefacts
- Le navigateur ne lit plus les shards/index PDF statiques pour obtenir un extrait : `rag.js` renvoie désormais `null` depuis la recherche documentaire locale. Les requêtes de documents sont dirigées par `ia.js` vers le Worker authentifié.
- Le Worker relit les chunks et leur manifeste avec le JWT transmis ; il vérifie le SHA-256 du fichier chunks, les compteurs documents/chunks, l'unicité des IDs, les références documentaires, les pages, les longueurs de texte et les comptes de chunks déclarés.
- Les documents ne sont candidats au modèle que si `rights_confirmed === true` et si la licence appartient à la liste autorisée. Les chunks non autorisés ne sont pas transmis au modèle.
- Les vecteurs sont liés aux chunks et au manifeste par empreintes, modèle, dimension et normalisation ; les incohérences invalident l'index vectoriel et la recherche lexicale peut servir de repli.
- Les identifiants PDF sont désormais des SHA-256 complets de 64 caractères hexadécimaux.
- Les tests couvrent les doublons JSON, collisions d'identifiants, incohérences de manifeste, documents/chunks inconnus, pages invalides, vecteurs invalides et filtrage des droits avant embeddings.

### 3.2 Worker du site
- Le chemin est décodé de façon répétée avant l'application des règles `PROT`, avec refus des encodages malformés/résiduels, antislash et NUL, puis normalisation des segments `.` et `..`.
- Le manifeste RAG a été ajouté aux chemins protégés.
- Les réponses des chemins JSON sensibles reçoivent `Cache-Control: no-store`.
- Les tests ajoutés couvrent des variantes de chemins encodés et vérifient le refus avant appel à ASSETS.

### 3.3 Entrées, JSON et réponses du modèle
- Le Worker IA borne la taille des corps et des réponses lues, annule les flux trop grands, utilise des délais d'expiration et rejette les clés JSON dupliquées.
- Le champ `ctx` fourni par le navigateur reste ignoré pour l'alimentation du modèle ; le contexte est reconstruit côté serveur.
- La sortie du modèle est validée comme texte non vide et limitée en longueur.
- Les outils d'ingestion valident les clés JSON, les chemins de l'inventaire des droits, les métadonnées compagnons et les licences avant de traiter un PDF.

### 3.4 Arrêt des automatisations historiques
- `.github/workflows/indexer.yml` et `.github/workflows/sharder.yml` ont été supprimés. Ils avaient des permissions `contents: write` et pouvaient extraire/OCRiser/indexer des PDF puis pousser des modifications automatiquement.
- Le workflow principal reste un workflow de validation ; aucun job de déploiement n'a été ajouté dans le diff examiné.
- La CI est maintenant isolée par workflow/PR et possède un délai maximal pour le job de validation.

### 3.5 Provenance et corrections pédagogiques
- Les fiches BAC, compositions, annales et devoirs concernés sont marquées comme provenance non vérifiée lorsque la preuve primaire manque.
- Les interfaces neutralisent les qualificatifs « officiel » non prouvés et distinguent les corrections absentes, présentes ou manifestement génériques selon les motifs contrôlés.
- Les anciennes métriques d'évaluation d'intentions sont invalidées au lieu d'être réutilisées comme précision démontrée.
- Les textes et sujets sont conservés ; le diff ajoute surtout des statuts et métadonnées de provenance.

## 4. Réserves techniques de revue

1. **Pas de validation E2E sur le Worker déployé.** Les tests du Worker IA simulent les réponses Auth/REST/RLS et les ressources distantes. Les quatre workflows verts prouvent l'exécution CI, pas le fonctionnement réel d'un déploiement Cloudflare avec un JWT utilisateur réel ni le comportement effectif du moteur RLS. Aucun test de production n'a été lancé.
2. **Publication du couple chunks/manifeste en deux remplacements.** `tools/ingest_corpus_rag.py` sérialise les deux fichiers temporaires, puis remplace successivement le fichier chunks et le manifeste. Ce n'est pas un remplacement atomique du couple. Si le second remplacement échoue, les empreintes ne correspondent plus et le Worker échoue fermé (503) : risque de disponibilité/récupération, pas de fuite de contenu. À traiter avant une ingestion réelle à grande échelle.
3. **La recherche RAG locale est volontairement neutralisée.** `rag.js` ne fait plus de recherche PDF côté navigateur ; le parcours documentaire dépend du routage `ia.js`, du JWT, du Worker et de l'état du déploiement. C'est cohérent avec l'objectif de sécurité, mais la disponibilité fonctionnelle doit être vérifiée par un test navigateur sur un environnement de préproduction autorisé.
4. **Les décisions de publication des lots 712–725 restent ouvertes.** La CI ne tranche pas la visibilité du dépôt, les droits des 293 PDF, la sauvegarde complète du manuel, les extraits 3AS, les fixtures, ni la publication des fichiers de configuration/projet/réservation. Les preuves des Lots 719–724 montrent que ces contenus sont toujours dans les arbres publics et que les 18 chemins Raw testés étaient lisibles. Les décisions du registre Lot 725 restent donc bloquantes.

## 5. Conclusion de revue

La revue du diff n'a pas identifié de modification Supabase/Auth/RLS/schéma/paiement, de changement de `main`, ni de job de déploiement ajouté. Les protections RAG et Worker sont renforcées et la CI du HEAD est verte.

**Avis : ne pas fusionner maintenant.** La fusion reste bloquée par les décisions propriétaires du Lot 725 sur les contenus publics et les droits documentaires, ainsi que par l'absence de validation E2E réelle. Le risque de disponibilité lié au remplacement séquentiel chunks/manifeste doit être corrigé ou explicitement accepté avant ingestion réelle.

## 6. Actions du Lot 726

- Revue en lecture seule ; aucun fichier applicatif ou pédagogique modifié.
- Aucun changement `main`, aucune fusion, aucun déploiement.
- Aucune modification Supabase, Auth, RLS, schéma, abonnement, paiement ou infrastructure.
- PR #23 conservée ouverte et en brouillon.
