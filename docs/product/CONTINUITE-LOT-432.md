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
