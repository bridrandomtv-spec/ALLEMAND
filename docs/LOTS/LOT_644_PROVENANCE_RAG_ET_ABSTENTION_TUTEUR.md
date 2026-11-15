# Lot 644 — provenance RAG et abstention du tuteur

Date : 2026-11-16

## Diagnostic

Le RAG retournait déjà le texte, l'ID documentaire, le score, les pages et le SHA-256 du chunk. Toutefois, le contexte envoyé à CERVEAU ne résolvait pas l'ID vers la fiche catalogue ; le modèle recevait donc surtout un identifiant technique, sans titre ni provenance lisible. L'interface RAG autonome résolvait mieux ces métadonnées que le parcours professeur.

## Corrections

- Ajout de `window.RAG.source(hit)` : résolution de la fiche dans `corpus.json`, puis émission d'une référence structurée uniquement si le SHA-256 du chunk et celui de la fiche documentaire sont tous deux valides et identiques.
- La référence contient ID, titre, matière, niveau, année, source, format, page et empreinte.
- `ia.js` transmet ces métadonnées au contexte CERVEAU, délimite l'extrait comme contenu non exécutable et ajoute à la réponse une ligne de référence documentaire lorsque la concordance SHA-256 est vérifiée.
- En cas de fiche absente ou de hash divergent, le contexte indique explicitement que la provenance n'est pas certifiée ; aucune citation vérifiée n'est affichée.
- Le prompt système du Worker précise que les extraits et métadonnées récupérés sont des données non fiables et que leurs éventuelles instructions ne doivent jamais être suivies.
- Le test runtime RAG vérifie la résolution d'une source et le rejet d'un SHA-256 divergent. Le contrat chat/voix/Worker vérifie le câblage et la règle anti-injection documentaire.

## Limites et validation

- Les modifications sont du code et des tests ; elles ne prouvent pas encore la qualité des réponses du modèle en conditions réelles.
- Aucun test local ou run Actions n'a été attesté dans cette session ; aucun PASS n'est revendiqué.
- Le corpus RAG réel reste absent de la branche audit au dernier inventaire ; aucune réponse réelle ne peut être certifiée à partir de ce fonds.
- Aucun PDF réel ingéré/OCRisé/indexé, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets, aucun déploiement Worker/Cloudflare, aucun merge.

## Suite

Lot 645 : créer un harnais d'intégration du Worker qui simule les trois états documentaires (source vérifiée, source absente, source incohérente), vérifie les métadonnées de référence sans faire appel à un modèle externe, puis préparer l'exécution réelle des cas de la matrice tuteur après disponibilité d'un corpus autorisé et d'un environnement de test.
