# Lot 647 — état de provenance RAG et abstention pédagogique

Date : 2026-11-16

## Problème corrigé

Avant ce lot, le Worker recevait du texte de contexte, mais aucun champ structuré ne lui indiquait de façon fiable si la provenance RAG était vérifiée, non vérifiée ou absente. Un contexte BIBLIO pouvait coexister avec l'absence de citation RAG certifiée. La consigne générale ne définissait pas assez précisément la conduite à tenir pour une demande portant sur une page, une unité, un exercice ou un programme officiel.

## Changements

### Orchestrateur `ia.js`

- Ajout du statut `rag_source_status` dans la requête `/ask` :
  - `verified` : source résolue et SHA-256 concordants ;
  - `unverified` : un hit existe, mais sa provenance n'est pas certifiée ;
  - `unavailable` : aucun hit RAG pertinent ;
  - `not_applicable` : le RAG allemand ne s'applique pas à la matière active.
- Quand aucun hit RAG n'est trouvé, le contexte précise explicitement qu'aucune source RAG pertinente et vérifiée n'a été trouvée.
- Le statut est transmis séparément du texte de contexte pour ne pas dépendre de la troncature du contexte.

### Worker CERVEAU

- Validation stricte du champ de statut ; valeur absente ou inconnue = `unavailable`.
- Le statut apparaît dans les métadonnées du prompt.
- Règle pédagogique : sans source vérifiée, ne pas citer de manuel, page, unité, exercice ou programme officiel. Pour une question ciblant précisément ces éléments, signaler l'absence de source et demander le document/référence. Pour une question générale de grammaire, une explication générale reste possible, mais doit être explicitement présentée comme non vérifiée dans le manuel de la plateforme.
- Un extrait BIBLIO non certifié ne doit pas être transformé en citation officielle.

### Tests

- Le test d'orchestration couvre désormais quatre cas : source vérifiée, hit non certifié, provenance divergente et absence totale de résultat RAG.
- Le test Worker vérifie le statut transmis et la présence des consignes d'abstention.
- Le contrat statique vérifie l'existence des quatre statuts et la séparation entre explication générale et référence officielle.

## Limites

- Les tests utilisent un endpoint simulé et un modèle simulé ; ils vérifient le contrat d'entrée et les consignes, pas le comportement réel du modèle face à toutes les formulations.
- Il faut encore exécuter la suite CI et tester l'abstention sur un modèle réel avec des cas adversariaux.
- Aucun corpus documentaire réel ingéré/OCRisé/indexé ; aucune validation juridique individuelle de documents.
- Aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets, aucune fusion.

## Suite

Lot 648 : créer une matrice d'essais adversariaux d'abstention (page inconnue, unité inexistante, exercice non indexé, question générale de grammaire, hit avec hash divergent, contenu BIBLIO sans référence vérifiée), puis exécuter les contrôles dans GitHub Actions et analyser les résultats avant toute ingestion réelle.
