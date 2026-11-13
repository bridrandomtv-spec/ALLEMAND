# Continuité — Lot 433

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Rapport :** [LOT-433-PREFLIGHT-COMPATIBILITE-PLAN-MIGRATION.md](LOT-433-PREFLIGHT-COMPATIBILITE-PLAN-MIGRATION.md)

## Travail effectué
- Relecture des documents Lots 427, 430 et 432.
- Inspection du script historique `supabase/msg_schema.sql` (SHA `24293ac6294bc2cff370c50fb525603defed949d`) et du contenu du dossier `supabase/`.
- Constat que le script historique est explicitement marqué comme jamais exécuté et ne doit pas être considéré comme le schéma actif.
- Aucun dossier `supabase/migrations/` n'a été trouvé dans le listing consulté.
- Préflight des risques de compatibilité : policies RLS cumulatives, grants indépendants du RLS, fonctions surchargées/ACL, triggers et chemins directs, DM hérités, groupes, Storage et Realtime.
- Préparation d'un ordre de migration conceptuel et d'un plan de rollback fail-closed.

## Décisions / blocages
- Ne pas rejouer `supabase/msg_schema.sql` sur le projet actif.
- Ne pas supprimer les DM existants ni inventer des invitations rétroactives.
- Les DM hérités doivent rester compatibles, mais aucun nouveau DM ne doit être créé par l'ancien chemin après activation du nouveau contrôle.
- Ne pas restaurer en rollback une ancienne policy ou un GRANT qui réintroduirait un accès trop large.
- La source officielle d'affiliation scolaire et les rôles habilités restent à définir.
- L'environnement de test isolé sans coût et les capacités de sauvegarde du plan gratuit restent à confirmer.

## État des opérations
- Documentation uniquement.
- Aucun SQL exécuté, aucune donnée applicative consultée.
- Aucun code applicatif ou fichier SQL de migration créé/modifié.
- Aucun changement Supabase/Auth/RLS/ACL/RPC/trigger/Storage/Realtime/paiement.
- Aucun test multi-comptes ou déploiement Cloudflare.
- Aucun frais engagé.

## Prochaine étape — Lot 434
Préparer un paquet de requêtes de diagnostic SELECT sur le catalogue PostgreSQL/Supabase (sans lignes de profils, messages ou conversations) pour obtenir une baseline exacte : signatures et dépendances des fonctions, ACL, triggers, policies, grants, contraintes/index, vues et publications. Les requêtes restent documentaires et ne seront exécutées qu'après autorisation explicite. En parallèle, formaliser les décisions encore nécessaires sur DM hérités et source de vérification scolaire.

## Contrôle PR / CI
- La vérification PR/CI reste à refaire après le commit du Lot 433.
- Ne pas fusionner, rebaser ou synchroniser la branche sans autorisation.
