# Continuité — Lot 428

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Commit :** `79ec3bde9ee37d9add732842ecf797cee8d57a0b`  
**Rapport :** [LOT-428-SEPARATION-INVITATIONS-SOCIALES-ET-CONSENTEMENT-MESSENGER.md](https://github.com/bridrandomtv-spec/ALLEMAND/blob/design/prototypes-67-74-alignment/docs/product/LOT-428-SEPARATION-INVITATIONS-SOCIALES-ET-CONSENTEMENT-MESSENGER.md)

## Travail effectué
- Relecture des contrats des Lots 387, 396, 413 et 420, et du diagnostic réel du Lot 427.
- Détection d'une ambiguïté entre invitation de زمالة et invitation d'ouverture d'un DM.
- Décision documentée de séparer les demandes sociales (`social_invitations`) du consentement Messenger (`msg_invitations`).
- Définition des parcours, états, invariants, tests négatifs et séquence de réalisation.
- Conservation de la règle : fonctionnalités sociales et messagerie essentielles gratuites pour les élèves vérifiés, sans privilège lié à l'abonnement.

## État CI précédent
Le run GitHub Actions `43472819211` (commit précédent `1a42fbc`) a terminé avec succès : job « Validation structurelle & pédagogique », 39 étapes validées. Ce résultat ne constitue pas un test SQL/RLS multi-sessions.

## Périmètre de sécurité
- Lot 427 : seules les requêtes SELECT de diagnostic avaient été autorisées et exécutées.
- Lot 428 : documentation uniquement ; aucune requête SQL supplémentaire.
- Aucune écriture Supabase, migration, DDL/DML, modification RLS/ACL/RPC/trigger, Auth, Storage, Realtime ou paiement.
- Aucune lecture de lignes d'élèves, messages ou conversations.
- Aucun PostgreSQL local installé, aucun environnement payant ou dépense.
- Aucun changement sur `main`, aucun merge, aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée.

## Prochaine étape
Préparer une matrice détaillée des écrans et des actions arabes à intégrer dans `ملتقى الطلاب` et `msg.js`, en respectant les deux flux séparés. Avant le moindre code applicatif, vérifier les composants et routes réellement présents sur la branche. Avant toute modification Supabase active, demander une nouvelle autorisation explicite ; l'autorisation SELECT du Lot 427 ne couvre aucune écriture.
