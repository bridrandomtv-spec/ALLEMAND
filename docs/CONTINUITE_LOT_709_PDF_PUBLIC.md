# Continuité — Lot 709 : suspension des liens PDF publics

Date : 20 novembre 2026

## Autorisation et périmètre
- L'utilisateur a explicitement autorisé la désactivation des liens PDF publics GitHub Raw et la préparation de leur migration vers un accès protégé.
- Intervention limitée à la branche `ai/rag-corpus-integrity-lot-635` de la PR #23.
- Aucun changement de `main`, aucun déploiement, aucune écriture Supabase, aucun changement Auth/RLS/schéma/abonnement/paiement.
- La migration vers un stockage protégé est préparée au niveau du diagnostic seulement ; aucune migration de stockage ou de backend n'est engagée.

## Modifications
- `corpus.js` ne convertit plus les chemins `docs/archive`, `dzexams-*` ou les URL PDF en URL GitHub Raw publique ; ces ressources renvoient désormais une cible neutre `#`.
- Les deux chemins de rendu de la grille du corpus affichent explicitement « PDF suspendu — accès protégé en préparation » au lieu d'un bouton d'ouverture.
- Les PDF et leurs métadonnées n'ont pas été supprimés ni modifiés ; les fiches du catalogue restent visibles.
- Nouveau test `tests/corpus-public-pdf-access.test.mjs` : vérifie l'absence de génération d'URL GitHub Raw et les deux rendus d'avertissement.
- Le test a été ajouté à l'étape CI de validation de provenance dans `.github/workflows/deploy.yml`.

## Commits
- `corpus.js` : `81213f1c70885340833d34bd4b9ea51bcb7d60c1`
- Test : `7ab7f0a19550036849445608c600ce66fa493b37`
- Workflow CI : `115ebada638c693764656e8a49fedf9a8d83ae51`

## Validation et limites
- La CI doit être vérifiée sur le HEAD final après les trois commits.
- Aucun fichier PDF n'a été déplacé, supprimé, extrait, OCRisé ou indexé.
- Aucun stockage protégé n'a encore été provisionné. La mise en place d'une destination privée nécessitera un choix d'architecture et une autorisation distincte si elle implique des changements Supabase, Storage, Auth ou RLS.
- PR #23 reste ouverte, en brouillon et non fusionnée ; aucune fusion n'est autorisée par cette intervention.


## Préparation de la migration protégée — sans provisionnement

### Architecture cible proposée
1. Ne migrer vers un espace consultable que les documents dont les droits sont confirmés par une preuve vérifiable et une entrée d'inventaire cohérente. À ce jour, les 293 lignes ont `rights_confirmed` et `license` vides : aucun PDF ne passe donc ce prérequis.
2. Utiliser un bucket Cloudflare R2 privé, sans domaine public ni URL de téléchargement permanente. Les objets seraient adressés par identifiant interne / empreinte SHA-256, pas par nom de fichier exposé.
3. Ajouter au Worker un endpoint documentaire authentifié, par exemple `/api/corpus-documents/:id`, qui vérifie le JWT Supabase, l'admissibilité documentaire (preuve de droits, licence, hash et manifeste) et l'accès utilisateur via le contrôle d'entitlement existant.
4. Lire l'objet depuis R2 côté Worker uniquement après tous les contrôles ; retourner un flux avec `Content-Type: application/pdf`, `Cache-Control: private, no-store`, et sans URL R2 publique.
5. Remplacer dans `corpus.js` les liens locaux par l'ouverture du lecteur interne via cet endpoint ; ne jamais réintroduire une URL publique directe.

### Déploiement par étapes à prévoir
- Étape A : établir les preuves de droits et statuer document par document. Aucun transfert de PDF tant que cette étape est incomplète.
- Étape B : provisionner un bucket privé et un binding Worker dans un chantier séparé, avec secrets/configuration et politique d'accès minimale.
- Étape C : développer endpoint, manifeste et tests (absence de JWT, entitlement refusé, droits absents, hash incorrect, document absent, lecture autorisée).
- Étape D : migrer un petit lot de documents dont les droits sont confirmés, contrôler les réponses et le lecteur, puis étendre progressivement.
- Étape E : seulement après validation, supprimer les copies publiques du dépôt ou rendre leur emplacement non public ; vérifier les URL Raw directes et l'absence de fuite par les actifs statiques.

### Autorisations et limites
- Cette préparation est documentaire : aucun bucket R2, binding, secret, endpoint, table, politique RLS ou changement Auth n'a été créé.
- La création et le déploiement du stockage privé devront être autorisés séparément si cela implique des modifications d'infrastructure ou de configuration. Aucun transfert des 293 PDF n'est autorisé sur la seule base de l'inventaire actuel.

## Validation CI du Lot 709
- Run CI principal `44781922554` : jobs « Validation structurelle & pédagogique » et « Tests autonomes — Professeur IA » terminés avec succès.
- Le test `tests/corpus-public-pdf-access.test.mjs` est inclus dans l'étape de provenance de la validation structurelle ; cette étape s'est terminée avec succès.
- Workflows PostgreSQL `44781922154`, `44781922167` et `44781922383` terminés avec succès.
- Le HEAD documenté est `4fc9655c5c796393bed383162e09d0c59d960254`. La CI du code a été exécutée sur le HEAD précédent contenant les changements de code ; le commit `4fc9655` ne fait que préciser le dossier de continuité et la description PR.
- PR #23 : ouverte, en brouillon, non fusionnée ; comparaison `main...ai/rag-corpus-integrity-lot-635` : 357 commits d'avance, 0 en retard.
- Aucun changement sur `main`, aucun déploiement de production, aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement.
