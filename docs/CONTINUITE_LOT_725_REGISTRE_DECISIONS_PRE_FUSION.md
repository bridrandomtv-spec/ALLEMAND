# Lot 725 — registre des décisions bloquantes avant fusion — 21/11/2026

## État vérifié
- Dépôt `bridrandomtv-spec/ALLEMAND` : public (`private=false`, visibilité `public`), non archivé, autorise le fork ; métadonnées GitHub : 0 fork et `network_count=0` au moment du contrôle.
- 30 branches visibles. Les 30 ont été contrôlées pour la présence des 293 PDF et du blob `docs/private/buch_pages_full.json` aux Lots 722–723.
- HEAD PR #23 : `2a54dce3624e1ea81e718bd42af49d54aa211ff7`. Base/main : `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`, inchangée au contrôle.
- PR #23 : ouverte, brouillon, non fusionnée, techniquement mergeable ; 403 commits, 57 fichiers modifiés, 8 102 additions et 840 suppressions. La mergeabilité GitHub n'est pas une validation de sécurité ou de contenu.
- CI au HEAD : quatre workflows vérifiés en succès (CI principale et trois workflows PostgreSQL).

## Registre des décisions nécessaires

| ID | Sujet | Évidence technique disponible | Décision/prochaine preuve requise | État |
|---|---|---|---|---|
| D1 | Visibilité globale du dépôt | Dépôt public ; Raw direct lisible sur 18/18 chemins JSON testés ; 30 branches et mêmes PDF/backup | Décider si le dépôt doit rester public. Si non, autoriser explicitement la privatisation et planifier ses impacts | Bloquant |
| D2 | 293 PDF | 293 fichiers suivis dans les arbres Git ; inventaire antérieur : 0/293 droits confirmés, licences vides/non prouvées | Produire preuve de droits/licence par document ou autoriser retrait/mise en quarantaine | Bloquant |
| D3 | Sauvegarde complète du manuel | `docs/private/buch_pages_full.json` présent dans les 30 branches, Raw lisible ; contenu historique identique | Confirmer droits de diffusion et autoriser une stratégie de retrait de toutes les références si nécessaire | Bloquant |
| D4 | Extraits de livres 3AS | Fichiers `buch_3as_l4` à `buch_3as_l8` présents dans les arbres et Raw lisibles | Fournir les licences/permissions ou décider retrait/stockage privé | Bloquant |
| D5 | Livres 2AS / L2 / L3 | JSON structurés présents et lisibles ; statut gratuit/payant non confirmé ; clients les chargent directement | Confirmer la classification commerciale et définir le contrôle serveur compatible avant tout changement | Décision propriétaire |
| D6 | Fixtures élèves/parents/live/classe | Fichiers Raw lisibles ; indices de démonstration inégaux, pas de certification complète pour tous les jeux | Confirmer par écrit que toutes les données sont synthétiques et autorisées, ou classifier/retirer les données non publiables | Bloquant |
| D7 | Configuration/projet/réservation | Fichiers publics et lisibles ; champs de paiement/projet/contact repérés aux audits précédents | Confirmer explicitement les éléments destinés à la publication et retirer les éléments confidentiels si nécessaire | Bloquant |
| D8 | Sujet pédagogique nominatif | `sujet14_farid.json` lisible ; métadonnée d'autorisation déclarée mais fictivité de tous les détails non établie | Confirmer que le scénario et ses détails identifiants sont fictifs ou autorisés | Décision propriétaire |
| D9 | Retrait historique | Les mêmes blobs sont présents sur de nombreuses références ; suppression d'une seule branche insuffisante | Si retrait requis : autoriser un plan global (toutes références, historique, caches/artefacts et copies connues) après décision sur visibilité | Bloquant si retrait requis |

## Ordre de traitement recommandé
1. Décider immédiatement du statut public/privé du dépôt et de la classification des contenus (D1).
2. Établir les droits/licences des PDF et manuels (D2–D4).
3. Obtenir la certification de données synthétiques ou autorisées pour les fixtures et récits (D6, D8).
4. Valider les éléments de configuration, projet et réservation destinés à la publication (D7).
5. Concevoir ensuite, sur autorisation explicite, le retrait global ou la protection serveur des éléments classés non publics (D5, D9).
6. Réaliser une revue de diff de PR #23 et un contrôle final CI/sécurité après les décisions et correctifs.

## Ce que ce lot ne fait pas
- Aucune privatisation, purge Git, réécriture d'historique, suppression de PDF/JSON, modification de branche ou permission.
- Aucun changement `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/paiement.
- Aucun contenu de données personnelles ni valeur de configuration n'est reproduit.
- Les constats d'accessibilité concernent les chemins effectivement testés ; ils ne constituent pas une analyse de toutes les copies externes.

## Conclusion
La CI est verte et la PR est techniquement mergeable, mais la fusion ne peut pas être qualifiée de prête du seul fait de ces résultats. Les décisions D1–D4, D6–D7 et, selon la classification retenue, D5/D8/D9 restent des prérequis de gouvernance et de sécurité. PR #23 reste ouverte/en brouillon/non fusionnée.
