# Lot 646 — intégration de l’orchestration RAG et des citations

Date : 2026-11-16

## Objectif

Vérifier le contrat de `ia.js` entre la question originale, le contexte scolaire, le résultat RAG et l'appel `/ask`, en simulant l'endpoint et sans réseau ni modèle externe.

## Ajout

- Nouveau test `tests/ia_rag_orchestration_runtime.mjs`.
- Le test charge `ia.js` dans un VM Node isolé et simule les dépendances navigateur minimales (session, contexte scolaire, QUST, BIBLIO, RAG, stockage local).
- Le `fetch` simulé capture le corps POST `/ask` et renvoie une réponse pédagogique déterministe.
- Trois scénarios : source RAG vérifiée, source non disponible, provenance non concordante.
- Le scénario vérifié exige la transmission de la question brute, du contexte documentaire, du titre et de la page dans la citation affichée.
- Les deux scénarios non vérifiés exigent le marqueur « provenance non certifiée » dans le contexte et l'absence de citation documentaire présentée comme vérifiée dans la réponse.
- Le workflow `.github/workflows/tutor-audit.yml` déclenche sur le nouveau test et l'exécute avec Node 22.

## Limites

- Le test utilise des dépendances RAG et un endpoint `/ask` simulés ; il vérifie l'orchestration `ia.js`, pas le réseau Cloudflare ni l'inférence réelle.
- Le lecteur RAG et le Worker disposent de leurs propres tests VM ; l'ensemble n'a pas encore de résultat CI attesté dans cette session.
- Le test n'évalue pas la pertinence de la recherche, la qualité pédagogique, la détection réelle du dialecte ou la qualité de la voix.
- Aucun document réel n'a été ingéré/OCRisé/indexé ; aucun index de production n'a été modifié ; aucun déploiement ni changement Supabase/Auth/RLS/schéma/données/paiements/secrets ; aucune fusion.

## Suite

Lot 647 : renforcer le contrat d'abstention côté Worker pour les questions exigeant une référence de programme/page/exercice lorsqu'aucun extrait pertinent n'est fourni, tout en autorisant explicitement les explications générales de grammaire clairement identifiées comme générales.
