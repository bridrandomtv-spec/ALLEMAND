# Lot 635 — traçabilité documentaire dans les réponses RAG

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`

## 1. Constat de l'audit

Le moteur `rag.js` retrouvait un chunk, son identifiant documentaire, sa page éventuelle et son empreinte SHA-256. Mais `formule()` affichait principalement l'identifiant technique du document (`c-…` ou `pdf-…`) ; le titre, la matière, le niveau, l'année et la source du catalogue n'étaient pas restitués à l'élève.

Le catalogue `assets/bdd/corpus.json` était déjà chargé par le routeur pédagogique via `chargeCorp()`. Le Lot 635 réutilise ce chemin existant, uniquement lorsqu'une recherche RAG renvoie un résultat.

## 2. Correction

Dans `rag.js` :
- `formule(r, corpus)` résout l'identifiant du chunk dans `corpus.documents` ;
- affiche le titre documentaire, matière, niveau et année lorsque ces champs existent ;
- affiche la page si la provenance page est présente ;
- affiche la source déclarée et le format du document ;
- conserve l'identifiant technique et les 12 premiers caractères de l'empreinte SHA-256 pour l'audit ;
- échappe les champs textuels avant insertion HTML ;
- conserve un repli explicite sur l'identifiant technique si le catalogue ou la fiche est absente ;
- charge le catalogue uniquement après un résultat RAG, pour éviter une requête inutile lorsqu'aucun extrait n'a été trouvé.

Aucun nouveau schéma de données ni aucune dépendance applicative n'ont été introduits.

## 3. Contrôle CI ajouté

Le workflow `.github/workflows/corpus-contract-tests.yml` inclut désormais :
- installation de Node.js 22 via `actions/setup-node@v4` ;
- vérification syntaxique du moteur avec `node --check rag.js`.

Le workflow garde les tests Python existants. Aucun job d'ingestion, d'écriture de corpus, de déploiement ou de modification de données n'a été ajouté.

## 4. Limites et état de validation

- Le changement de code est enregistré sur la branche d'audit.
- La vérification a été faite statiquement dans le contenu GitHub ; `node --check` et les tests Python n'ont pas encore été exécutés dans un runner.
- Le blocage runner/actions reste à résoudre. Aucun résultat de test ne doit être considéré comme réussi avant une exécution réelle.
- L'affichage enrichi dépend de la présence d'une fiche correspondant à l'identifiant du chunk dans `corpus.json`. Si la fiche manque, le moteur conserve le repli sur l'ID.
- Les chunks TXT/MD/DOCX n'ont pas de numéro de page fiable ; l'interface ne doit donc pas en inventer. Les pages PDF sont affichées seulement si les métadonnées page existent.

## 5. Périmètre de sécurité

Aucun PDF réel traité, aucun OCR, aucune ingestion réelle, aucune modification de Supabase/Auth/RLS/schéma/données/paiements/secrets, aucun déploiement ni fusion. `main` n'a pas été modifiée dans ce lot.

## 6. Suite — Lot 636

1. Vérifier que le manifeste et les shards publiés correspondent à la même génération que le catalogue et l'index complet, sans casser les chemins consommés par `rag.js`.
2. Auditer les scripts qui génèrent et publient les shards pour détecter les états mixtes après échec.
3. Ajouter des tests automatisés ciblés sur la résolution ID → fiche documentaire et l'échappement des champs affichés.
4. Reprendre la validation CI dès qu'un runner est disponible.
5. Poursuivre ensuite les tests multilingues (arabe, darija, Arabizi, français, allemand) sur corpus synthétique avant toute expérimentation sur les manuels réels.
