# Lot 728 — publication cohérente des artefacts RAG

Date : 21 novembre 2026

## Périmètre
Analyse en lecture seule de la branche de PR #23 au HEAD `f5dc510845563e2909ff75f160b5667b26d4d69c`. Objectif : examiner le risque de publication partielle chunks/manifeste relevé au Lot 726 et déterminer une voie de correction compatible avec le Worker existant.

Aucun code, donnée pédagogique, configuration, infrastructure ou politique d'accès n'a été modifié dans ce lot.

## État GitHub vérifié
- PR #23 : ouverte, brouillon, non fusionnée, mergeable=true.
- Branche : `ai/rag-corpus-integrity-lot-635`.
- Base `main` : `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`.
- HEAD : `f5dc510845563e2909ff75f160b5667b26d4d69c`.
- Comparaison : 408 commits en avance, 0 en retard ; 59 fichiers modifiés.
- CI du HEAD exact : CI principale run `44892601622` réussie ; PostgreSQL runs `44892601633`, `44892601645`, `44892601683` réussis. Donc 4/4 workflows réussis sur ce HEAD.
- `main` reste à son SHA de base. Aucune fusion ni aucun déploiement.

## Constat vérifié dans le code
Dans `tools/ingest_corpus_rag.py` :
1. Les octets du fichier chunks et le manifeste sont sérialisés.
2. Deux fichiers temporaires distincts sont écrits.
3. `chunks_tmp.replace(chunks_path)` remplace le corpus actif.
4. `manifest_tmp.replace(manifest_path)` remplace ensuite le manifeste actif.

Les deux remplacements sont deux opérations distinctes. Une interruption entre les deux peut donc laisser un corpus et un manifeste de générations différentes. Le contrôle des empreintes côté Worker détecte l'incohérence et échoue fermé ; cela protège la confidentialité/intégrité, mais peut provoquer une indisponibilité documentaire.

Le Worker `worker/ia-ask.js` consomme séparément les ressources chunks et manifeste. L'index vectoriel reste facultatif et ses empreintes sont comparées aux fichiers sources ; en cas d'index vectoriel inutilisable, le code retombe sur le classement lexical BM25. Aucun vecteur ne doit constituer une preuve de droit : le filtrage rights_confirmed/licence intervient avant le classement.

## Couverture de tests constatée
- `tests/test_ingest_corpus_rag.py` couvre les droits, métadonnées, extraction, inventaire, empreintes et la production des deux artefacts.
- `tests/test_build_corpus_rag_vectors.py` couvre les incohérences manifeste/chunks, doublons, droits et vecteurs.
- Aucun test identifié dans ces suites ne simule une interruption entre les deux appels `replace`, ni ne démontre une reprise transactionnelle de la paire d'artefacts.
- Les tests Worker valident les contrôles d'intégrité mais ne constituent pas un test d'endurance/arrêt brutal du processus d'ingestion.

## Options évaluées
### Option A — conserver deux fichiers actifs et ajouter rollback
Un rollback applicatif après échec du second remplacement améliore les erreurs ordinaires, mais ne garantit pas la cohérence après arrêt brutal du processus, coupure machine ou interruption entre les deux remplacements. Option insuffisante comme garantie d'atomicité.

### Option B — publier une génération immuable puis basculer un pointeur
Écrire les chunks, manifeste et éventuels vecteurs dans un répertoire de génération immuable ; vérifier intégralement les empreintes et les comptes ; ensuite basculer un unique pointeur de génération active par remplacement atomique. Le Worker lit le pointeur une fois puis récupère tous les artefacts sous la même génération. Il faut traiter le cache du pointeur, les chemins autorisés, l'absence de traversée, la rétention des anciennes générations et le comportement en cas de génération absente. Cette option est robuste mais exige une modification coordonnée du format, de l'ingestion, du Worker et des tests.

### Option C — artefact corpus unique
Regrouper les métadonnées de manifeste et les chunks dans un seul fichier JSON publié par un unique remplacement atomique. Cela élimine le décalage chunks/manifeste, mais peut augmenter la taille mémoire/lecture et impose de mesurer la taille réelle du corpus, les limites d'assets et la consommation Worker. Les vecteurs restent un artefact optionnel lié par SHA-256 au corpus unique.

## Décision technique de ce lot
Aucune option n'est implémentée dans ce lot. La solution B est la cible recommandée si les limites Cloudflare/static assets et les usages historiques sont compatibles ; la solution C est une alternative plus simple si la taille finale reste raisonnable. Un rollback seul n'est pas suffisant.

Avant tout changement de format, le Lot 729 devra :
1. inventorier tous les consommateurs et URL actuels des chunks, du manifeste et des vecteurs ;
2. mesurer les limites réelles de taille des assets et de lecture Worker sans générer d'embeddings ;
3. définir un schéma de génération versionnée et une stratégie de cache cohérente ;
4. écrire des tests d'arrêt simulé à chaque frontière de publication et de reprise ;
5. prouver qu'un Worker ne peut jamais mélanger deux générations et qu'il échoue fermé si la génération active est absente/incomplète.

## Sécurité et gouvernance non résolues
- Les 293 PDF restent sans preuve de droits confirmée et présents dans le dépôt public.
- Les expositions Raw des livres, sauvegardes et ressources JSON recensées aux Lots 712–724 demeurent.
- Les décisions du registre Lot 725 restent à obtenir.
- Aucun OCR, aucune ingestion réelle, aucun embedding réel et aucun appel Workers AI pour indexation documentaire n'ont été lancés.
- Aucun test E2E sur Worker déployé avec JWT utilisateur réel n'a été réalisé.

## Garanties de périmètre
Aucun changement de `main`, aucune fusion, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement, aucun retrait de fichiers et aucune réécriture d'historique. PR #23 reste ouverte et en brouillon.
