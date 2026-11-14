# Lot 316-C — rapport administratif de revue des écarts

Date : 12 novembre 2026  
Statut : prototype hors ligne ; aucune décision juridique ou institutionnelle automatique.

## Objectif

Transformer le résultat du rapprochement Lot 316-B en une file de revue exploitable par un opérateur administratif puis un approbateur distinct. Le rapport aide à prioriser le travail ; il ne certifie ni l'existence d'un établissement ni son statut légal.

## Priorités de traitement

| Priorité | Déclencheur | Action obligatoire |
|---|---|---|
| P1 | Identifiant nouveau, ligne absente, ou changement de statut/date/référence/source | Vérifier l'identifiant, la source et l'acte ; quarantaine si l'absence est inexpliquée |
| P2 | Changement d'identité, de nom, de code géographique ou autre champ descriptif | Comparer la source et documenter la différence |
| P3 | Aucun changement détecté | Confirmer la présence et l'intégrité du lot |

P1/P2/P3 sont des priorités opérationnelles de revue, pas une appréciation juridique du risque ni une preuve de validité.

## Livrables

- `prototypes/registry-review-report-core.mjs` : génération du rapport trié par priorité, export CSV et contrôle séquentiel des rôles.
- `prototypes/registry-review-report-core.test.mjs` : tests Node natifs.
- `docs/product/LOT-316C-RAPPORT-REVUE-ECARTS.md` : règles, modèle de décision et limites.

## Séparation des tâches

1. L'opérateur consigne son identifiant et son commentaire.
2. L'approbateur doit être une personne distincte.
3. L'approbateur ne peut intervenir avant la revue opérateur.
4. Les décisions disponibles dans le prototype sont `accepte`, `rejete` et `quarantaine`.
5. Une décision « accepte » n'est qu'un état de revue simulé : elle ne publie pas de donnée et ne remplace pas la validation de l'autorité compétente.

Le module empêche l'approbateur de réutiliser le même identifiant que l'opérateur. Cette vérification est une garde logique de prototype, pas un contrôle d'identité ou d'autorisation sécurisé : sans comptes authentifiés et journalisation serveur, elle ne doit jamais être considérée comme une mesure de production.

## Champs du rapport

Priorité, catégorie, identifiant national, champs modifiés, motif, action requise, décision, référence source, opérateur/commentaire, approbateur/commentaire, lot précédent et nouveau lot.

Les commentaires exportés en CSV sont neutralisés contre les formules de tableur. Les exports sont des rapports de travail, pas des pièces certifiées.

## Tests

`node --test prototypes/registry-review-report-core.test.mjs`

Les tests couvrent le classement P1/P2/P3, la quarantaine des absences, l'ordre de revue, la séparation des identifiants, les décisions/rôles invalides et la neutralisation CSV.

## Limites

- Aucun dossier réel, nom d'établissement réel ou dossier d'élève.
- Aucun stockage durable, appel réseau, compte opérateur, signature numérique ou journal serveur.
- Aucun import de données et aucune publication d'annuaire.
- Aucun changement Supabase/Auth/RLS/GRANT/Storage, aucune migration, aucun changement Cloudflare, aucun déploiement.
- L'outil n'authentifie pas les personnes et ne peut pas garantir la séparation des tâches en production.

**GO** pour essais synthétiques hors ligne et revue UX. **NO-GO** pour usage administratif réel ou production tant que l'identité, les permissions, la traçabilité, la signature et la validation institutionnelle ne sont pas conçues et approuvées.
