# Continuité — Lot 429

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Commit :** `ea325b5f42a96a0e1dab3282d33ebd965ecca707`  
**Rapport :** https://github.com/bridrandomtv-spec/ALLEMAND/blob/design/prototypes-67-74-alignment/docs/product/LOT-429-CARTOGRAPHIE-ECRANS-MULTAQA-MESSENGER.md

## Travail effectué
- Lecture statique de index.html, msg.js et des fonctions pertinentes de supabase/supabase.js sur la branche de travail.
- Confirmation que data-view="multaqa" est une maquette statique sans données sociales, publication, commentaires, recherche ni demandes de زمالة activés.
- Confirmation que msg.js gère les groupes et DM existants, mais que son champ de recherche ne filtre que la liste locale des conversations/groupes chargés.
- Confirmation que les écrans de recherche nationale, demandes Messenger, acceptation/refus, blocage et préférences ne sont pas branchés ; msgBlock/msgUnblock sont des helpers sans commandes UI correspondantes.
- Confirmation que le parcours client de vérification demande encore un abonnement actif et doit être remplacé par la vérification scolaire gratuite indépendante du paiement.
- Création d'une cartographie des écrans arabes, du vocabulaire, des règles de consentement et de l'ordre de réalisation.

## Décisions conservées
- زمالة et consentement Messenger sont deux flux séparés.
- Accepter une demande de زمالة ne crée jamais de DM.
- L'ouverture d'un DM exige l'acceptation explicite d'une invitation Messenger distincte, validée côté serveur.
- Les fonctionnalités sociales et de messagerie essentielles sont gratuites pour les élèves vérifiés, abonnés ou non.

## Limites et sécurité
- Lot 429 : audit statique/documentation uniquement ; aucune donnée Supabase lue et aucune écriture SQL.
- L'autorisation SELECT du Lot 427 ne permet aucune écriture ou migration.
- Aucun code applicatif, Auth, RLS, ACL, RPC, trigger, Storage, Realtime ou paiement modifié.
- Aucun déploiement Cloudflare ; main inchangée ; PR #17 reste ouverte et non fusionnée.
- Le CI vert du run 43472819211 concernait le commit antérieur ; aucun statut CI n'est revendiqué ici pour les commits des Lots 428–429.

## Prochaine étape
Avant toute modification du code, produire une séquence d'implémentation par fichiers, en contrôlant les dépendances et événements existants, puis préparer les tests négatifs serveur isolés. Les modifications du backend Supabase actif restent interdites sans nouvelle autorisation explicite.