# Lot 723 — cartographie des blobs documentaires sur les branches — 20/11/2026

## Périmètre
Inventaire en lecture seule des arbres Git récursifs des 25 branches qui n'avaient pas été parcourues au Lot 722. Les cinq branches historiques déjà contrôlées au Lot 722 sont reprises uniquement pour la consolidation des constats explicitement établis alors. Aucun contenu de fixture personnelle n'est reproduit.

Branches nouvellement inspectées :
- `ai/intelligence-only-lots-601-608`
- `ai/rag-corpus-integrity-lot-635`
- `audit/lot-601-voice-intelligence-contract`
- `design/accueil-premium-dz-v3`
- `design/bottom-navigation-dz`
- `design/home-premium-dz-v4`
- `design/visual-premium-dz-2026`
- `design/vues-metier-dz-v5`
- `design-prototype-dz-green-red`
- `design-prototype-v1-main`
- `design-prototype-v1`
- `feat/verification-school-central-access`
- `feature/student-dashboard-enhancements`
- `fix/admin-only-student-level-2026-10-26`
- `fix/auth-fallback-guard-2026-10-26`
- `fix/mysubs-startup-error`
- `fix/navigation-multimatieres`
- `fix/restore-multaqa-only`
- `fix/schema-rls-admin-recursion-2026-10-26`
- `fix/subject-navigation-sync`
- `fix/supabase-p0-self-contained-2026-10-26`
- `main`
- `ops/supabase-readonly-inventory-2026-10-30`
- `redesign-v2`
- `security/parent-child-confirmation`

## Résultats des 25 arbres nouvellement examinés
- 25/25 arbres récursifs complets, aucun n'est signalé tronqué par l'API GitHub.
- 25/25 contiennent 293 PDF et 834 blobs sous `docs/archive/`.
- 25/25 contiennent `docs/private/buch_pages_full.json`, avec le même blob SHA `3114e3024995b7c7a9f22fcbdfc78218742f2084`.
- 25/25 contiennent les 18 chemins ciblés : `config.json`, `plan_projet.json`, `reservation.json`, fixtures `eleves/parents/live/classe`, `journee.json`, `sujet14_farid.json`, livres `buch_2as/buch_l2/buch_l3` et `buch_3as_l4` à `buch_3as_l8`.
- Les nombres totaux de blobs diffèrent selon les branches (environ 1 187 à 1 477 entrées dans les arbres retournés), mais les artefacts ciblés restent présents.

## Consolidation avec le Lot 722
Le Lot 722 avait déjà contrôlé cinq branches anciennes et confirmé, pour chacune, 293 PDF et la sauvegarde du livre avec le même blob SHA. Le dépôt compte 30 branches au total ; l'ensemble des 30 branches a donc maintenant fait l'objet d'un contrôle ciblé de présence de ces deux familles d'artefacts. Le contrôle détaillé des 18 chemins JSON ci-dessus porte sur les 25 arbres du présent lot ; il n'est pas extrapolé aux cinq arbres du Lot 722.

## Interprétation et limites
- Les exclusions `.assetsignore` ne retirent pas ces objets de l'historique Git public. Le nom de dossier `docs/private` n'est pas une barrière d'accès dans un dépôt public.
- La répétition du même blob de sauvegarde sur plusieurs références signifie qu'une suppression sur une seule branche ne suffirait pas à le retirer du dépôt.
- Cet inventaire ne couvre pas les forks, clones locaux, caches externes, archives téléchargées, objets Git inaccessibles ni copies tierces. Il ne constitue pas un audit des permissions individuelles.
- Les métadonnées `protected:false` vues au Lot 722 ne prouvent pas que tout utilisateur peut pousser sur ces branches ; les droits et règles d'organisation doivent être évalués séparément.
- Les risques et décisions déjà consignés aux Lots 712 à 721 restent ouverts : preuves de droits/licences des PDF et extraits de manuels, qualification des fixtures, statut de publication des fichiers de configuration/projet/contact, et stratégie de retrait des blobs de toutes les références publiques.

## Actions et garanties
- Aucun fichier de données, PDF, branche, tag, blob, permission, règle de protection ou historique n'a été modifié.
- Aucune purge Git, suppression de branche, privatisation du dépôt ou migration de stockage n'a été effectuée.
- Aucun changement `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/paiement/infrastructure.
- PR #23 reste ouverte, en brouillon et non fusionnée. Toute purge ou privatisation exige une décision et une autorisation explicites.
