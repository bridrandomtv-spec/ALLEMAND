# Lot 721 — releases, tags et artefacts GitHub Actions — 20/11/2026

## Périmètre
Vérification des releases, tags et artefacts CI du dépôt public `bridrandomtv-spec/ALLEMAND`, au HEAD de PR #23 `9133fe5845f59c54010500711fcec2bb093db21d`. Lecture seule ; aucun artefact n'a été supprimé.

## 1. Releases et tags
- Endpoint Releases : aucune release publiée retournée.
- Références Git `refs/tags/` : liste vide au moment du contrôle.
- Cette observation porte sur les releases/tags visibles via l'API GitHub au moment du contrôle ; elle ne couvre pas les archives externes ou les copies faites par des tiers.

## 2. Artefacts Actions
Les artefacts des quatre workflows associés au HEAD ont été examinés :
- CI principale : un artefact `pdf-rights-and-readiness`.
- Trois workflows PostgreSQL isolés : aucun artefact retourné pour chacun.
- Artefact ID `14668693491`, taille 4 781 octets, créé le 20/11/2026 à 20:57 UTC, expiration annoncée le 04/12/2026 à 20:57 UTC (rétention configurée : 14 jours).
- L'archive a été téléchargée et inspectée. Elle contient un CSV de 293 lignes, avec chemins de PDF et compteurs techniques de pages/extraction ainsi que les colonnes de suivi des droits. Aucun texte PDF n'est inclus.
- Bilan CSV : 293 lignes ; 293 entrées marquées présentes dans l'inventaire ; 293 statuts « à vérifier — aucune preuve compagnon trouvée » ; 0 droits confirmés ; 0 licence renseignée ; 0 champ erreur non vide.
- Le CSV ne contient pas d'extrait pédagogique, de texte extrait ou de coordonnées personnelles dans les champs examinés. Les chemins de fichiers restent des métadonnées d'inventaire.
- Le workflow `.github/workflows/deploy.yml` exécute `tools/audit_pdf_text_readiness.py` avec `--summary-only`, produit le CSV dans le répertoire temporaire du runner puis le publie via `actions/upload-artifact@v4`, avec `retention-days: 14`.

## 3. Interprétation de l'accès
L'artefact est téléchargeable via l'API GitHub Actions pour une identité disposant des droits de lecture du dépôt. Le test effectué ici a réussi via la connexion GitHub active. L'accès anonyme direct à l'archive n'a pas été testé séparément ; ce rapport ne le présente donc pas comme une exposition anonyme prouvée. Le dépôt étant public, les métadonnées du workflow et de l'artefact sont visibles publiquement.

## 4. Contrôle du HEAD
Sur `9133fe5845f59c54010500711fcec2bb093db21d`, les contrôles CI ont terminé avec succès :
- Workers Builds : success ;
- Tests autonomes Professeur IA : success ;
- Validation structurelle & pédagogique : success ;
- Messenger invitation PostgreSQL : success ;
- Messenger discovery PostgreSQL : success ;
- Multaqa PostgreSQL : success ;
- Supabase Preview : skipped.

## 5. Décisions et actions
- L'artefact n'a pas été supprimé : sa suppression nécessiterait une décision explicite et ne corrigerait pas l'absence de preuves de droits sur les PDF eux-mêmes.
- Ne pas désactiver l'audit ni supprimer son artefact automatiquement sans besoin opérationnel établi : il fournit une trace technique utile et ne contient pas le texte des documents.
- Si une politique de confidentialité plus stricte est souhaitée, décider de conserver ou non le rapport CSV comme artefact de CI, et ajuster explicitement sa rétention/visibilité dans un lot séparé.
- La question majeure demeure les droits des 293 PDF suivis dans le dépôt, non le CSV d'audit.

## 6. État des opérations
- Aucun artefact, release, tag, PDF, JSON, historique Git ou réglage de rétention modifié.
- Aucun changement de `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/paiement.
- PR #23 reste ouverte, en brouillon et non fusionnée.
