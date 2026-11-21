# Lot 724 — vérification Raw des JSON ciblés et comparaison main/PR — 20/11/2026

## Périmètre
Vérification technique des 18 chemins JSON ciblés lors des Lots 712 à 718 et cartographie de leurs blobs entre `main` et le HEAD de PR #23 (`8f1cc2a75ad68794d3442b105a78bb9b2e96cb0e`). Les réponses Raw ont été consommées uniquement pour vérifier leur lecture ; aucun contenu de fixture, de contact ou de configuration n'est reproduit dans ce rapport.

## Résultats — accès Raw
- 18/18 requêtes directes vers `raw.githubusercontent.com` ont retourné un contenu lisible au HEAD PR testé.
- Chemins contrôlés : `config.json`, `plan_projet.json`, `reservation.json`, `eleves.json`, `parents.json`, `live.json`, `classe.json`, `journee.json`, `sujet14_farid.json`, `buch_2as.json`, `buch_l2.json`, `buch_l3.json`, `buch_3as_l4.json` à `buch_3as_l8.json`, et `docs/private/buch_pages_full.json`.
- Les contenus reçus ont été traités comme des données non fiables et n'ont pas été affichés, copiés dans les rapports, ni utilisés pour extraire des informations personnelles. Le test constate seulement la lisibilité Raw et la taille de réponse.

## Comparaison avec main
- Arbres récursifs complets (non tronqués) pour `main` (`fadae5ee13fa89c47dd6a567d6db4c15df34a19c`) et le HEAD PR testé.
- 18/18 chemins existent dans les deux arbres.
- 18/18 possèdent exactement le même blob SHA sur `main` et sur le HEAD PR.
- Les fichiers ciblés et leur contenu Git sont donc antérieurs aux commits documentaires récents de PR #23 ; le contrôle ne met pas en évidence d'introduction ou de modification de ces blobs par les Lots 723–724.

## Interprétation et limites
- Le dépôt étant public, la lecture Raw confirme que les exclusions `.assetsignore`, les gardes Worker et le nom de dossier `docs/private` ne protègent pas ces chemins GitHub.
- La comparaison de blobs démontre l'identité des versions entre les deux références examinées, mais ne constitue pas une analyse de tous les historiques, forks, clones, caches ou copies téléchargées.
- Les PDF binaires n'ont pas été téléchargés par ce contrôle ; leur présence dans les arbres Git publics a été documentée séparément aux Lots 719, 720, 722 et 723.
- La lecture Raw ne permet pas à elle seule de décider si chaque donnée est confidentielle, fictive, publiable ou licenciée. Les décisions propriétaires et les vérifications de droits restent nécessaires.

## Actions et garanties
- Vérification en lecture seule ; aucun JSON, PDF, blob, historique, branche, règle d'accès ou réglage de dépôt modifié.
- Aucun changement `main`, aucune purge, privatisation, réécriture Git, migration de stockage ou déploiement.
- Aucun changement Supabase/Auth/RLS/schéma/paiement/infrastructure.
- PR #23 reste ouverte, en brouillon et non fusionnée. Une décision explicite reste requise pour toute révocation d'accès, purge ou privatisation.
