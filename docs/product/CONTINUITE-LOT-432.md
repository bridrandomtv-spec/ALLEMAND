# Continuité — Lot 432

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Rapport :** [LOT-432-SPECIFICATION-SERVEUR-CONSOLIDEE-MULTAQA-MESSENGER.md](LOT-432-SPECIFICATION-SERVEUR-CONSOLIDEE-MULTAQA-MESSENGER.md)

## Travail effectué
- Consolidation du contrat serveur à partir des décisions produit et des constats du catalogue actif documentés au Lot 427.
- Séparation explicite des demandes de زمالة, invitations Messenger et blocages.
- Définition de l'invariant transactionnel d'acceptation Messenger et des chemins de contournement à fermer.
- Spécification d'une projection minimale de profils et des limites de confidentialité.
- Définition du parcours gratuit de vérification scolaire et des périmètres des agents.
- Formalisation du périmètre gratuit du forum pour les comptes élèves actifs inscrits, indépendamment de l'abonnement.
- Matrice de tests négatifs, de concurrence, REST/RPC et non-régression à exécuter uniquement sur environnement isolé.

## Décisions consolidées
- زمالة et invitation Messenger sont deux relations distinctes ; aucune acceptation sociale ne crée un DM.
- Un DM nouveau n'est créé que par acceptation explicite du destinataire, dans une transaction serveur atomique.
- Blocage bilatéral applicable à la recherche, invitations, acceptation, ouverture, adhésion et envoi.
- Aucun profil complet ni champ administratif de vérification ne doit être exposé dans les surfaces sociales.
- Vérification scolaire gratuite, sans numéro d'abonnement ni paiement comme preuve.
- Forum de base gratuit pour les comptes élèves actifs inscrits ; les fonctions privées gardent une vérification scolaire validée et le consentement.
- Aucun déploiement national avant preuve des contrôles serveur.

## État des opérations
- Documentation uniquement.
- Aucun SQL exécuté et aucune donnée personnelle lue.
- Aucun changement Supabase/Auth/RLS/ACL/RPC/trigger/Storage/Realtime/paiement.
- Aucun code applicatif modifié.
- Aucun test multi-comptes réel exécuté.
- Aucun déploiement Cloudflare, aucune modification de main, aucune fusion.

## Prochaine étape — Lot 433
Faire un préflight de compatibilité et de migration sur le schéma exact déjà observé, en vérifiant les dépendances de chaque fonction/RPC, policy, trigger, grant et client. La sortie sera un plan de migration ordonné avec critères de rollback, toujours documentaire. Ne pas écrire ni exécuter de SQL sur Supabase actif. L'environnement de test isolé sans coût et la source institutionnelle d'affiliation restent des prérequis non résolus.

## Contrôle après commits documentaires
- Commit de la spécification : 739ca676722692e42b876db992519b568c909331.
- Commit de la continuité Lot 432 : 8a9fd70b664e5676474ecc280b775a6f4bd31281.
- Commit ajoutant le lien Lot 432 à la continuité Lot 431 : b0f0bc7ac7fb22ac49037a492e4164ffa6c158f8.
- HEAD PR #17 relu : b0f0bc7ac7fb22ac49037a492e4164ffa6c158f8.
- PR #17 : ouverte, non fusionnée, draft=false ; GitHub retourne mergeable=false. La cause n'a pas été établie ; aucun rebase ni synchronisation n'a été lancé.
- Aucune exécution CI associée au dernier commit n'a été retournée par la recherche effectuée ; ne pas déclarer la CI réussie.
- Aucun déploiement Cloudflare.

---

## Prolongement — Lot 433

Le préflight de compatibilité et le plan de migration ordonné sont documentés dans [LOT-433-PREFLIGHT-COMPATIBILITE-PLAN-MIGRATION.md](LOT-433-PREFLIGHT-COMPATIBILITE-PLAN-MIGRATION.md), avec la continuité détaillée [CONTINUITE-LOT-433.md](CONTINUITE-LOT-433.md).

Le Lot 433 confirme que `supabase/msg_schema.sql` est un script historique marqué comme jamais exécuté, et non la référence du schéma actif. Il documente les risques de policies RLS cumulatives, grants, dépendances RPC/triggers, conversations héritées et rollback. Aucun SQL, code applicatif ou changement Supabase n'a été effectué.
