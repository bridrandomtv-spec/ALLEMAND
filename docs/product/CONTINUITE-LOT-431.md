# Continuité — Lot 431

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Rapport :** [LOT-431-RAPPROCHEMENT-SCHEMA-INVITATIONS-CATALOGUE-ACTIF.md](LOT-431-RAPPROCHEMENT-SCHEMA-INVITATIONS-CATALOGUE-ACTIF.md)

## Travail effectué
- Relecture des contrats des Lots 387, 388, 396, 413 et 420.
- Rapprochement avec l'audit du catalogue Supabase actif du Lot 427 et le plan fichier par fichier du Lot 430.
- Identification des écarts entre le schéma d'invitation proposé et les garanties réellement observées dans la base.
- Clarification des différences entre états d'invitation sociale et états Messenger, du traitement des demandes croisées, de l'expiration, de l'idempotence et de l'atomicité de création du DM.
- Définition de la liste des chemins SQL/RPC/RLS qui doivent être corrigés ensemble.

## Conclusions maintenues
- ملتقى الطلاب et الرسائل ne sont pas encore des fonctionnalités nationales achevées.
- L'accès communautaire de base reste gratuit pour les comptes élèves actifs inscrits, conformément à la décision produit la plus récente du Lot 414 ; les fonctions privées de contact restent conditionnées à la vérification scolaire et au consentement explicite.
- Une demande de زمالة reste indépendante d'une invitation Messenger.
- L'actuelle RPC msg_open_direct(uuid), le contrôle d'ajout de membre, le blocage asymétrique et la lecture trop large de profiles sont des bloqueurs de sécurité confirmés par le Lot 427.
- La source institutionnelle de vérification scolaire nationale reste à établir.

## État des opérations
- Documentation uniquement.
- Aucun SQL exécuté dans ce lot.
- Aucun changement Supabase/Auth/RLS/ACL/RPC/trigger/Storage/Realtime/paiement.
- Aucun code applicatif modifié.
- Aucun test réel PostgreSQL multi-comptes exécuté.
- Aucun déploiement Cloudflare, aucune modification de main, aucun merge.

## État PR #17 au contrôle du Lot 431
- PR #17 : ouverte, non fusionnée, mergeable=true, draft=false.
- HEAD constaté avant les commits documentaires de ce lot : 90ab1b28f9e72d066bed3e37776c7308a7f92b0d.
- Ne pas fusionner sans accord explicite de l'utilisateur.

## Prochaine étape — Lot 432
Rédiger une spécification serveur consolidée (pas encore un script exécutable) qui traite ensemble la RPC directe, les insertions de conversations/membres, le blocage bilatéral, la projection de profil minimale et l'éligibilité scolaire nationale. Le point bloquant préalable reste la source officielle d'affiliation et le choix d'un environnement de test isolé sans coût.

## Contrôle après commits documentaires
- Commits du Lot 431 : rapport 49666ae117ffc7e277ed22472e9b8b1d31db585d ; continuité 28f85768022538de7db0be2258f472ebbf272c18 ; lien de continuité Lot 430 mis à jour par fd8606e02f4fe9c973b84ec21072f73dd171d608.
- HEAD PR #17 relu : fd8606e02f4fe9c973b84ec21072f73dd171d608.
- PR #17 : ouverte, non fusionnée, draft=false ; GitHub retourne mergeable=false au dernier contrôle. La cause n'a pas été diagnostiquée dans ce lot ; ne pas lancer de synchronisation/rebase automatique.
- Recherche des exécutions CI associées au dernier commit : aucune exécution retournée. La CI n'est donc pas déclarée réussie.
- Aucun déploiement Cloudflare.

---

## Prolongement — Lot 432

Le contrat serveur consolidé est documenté dans [LOT-432-SPECIFICATION-SERVEUR-CONSOLIDEE-MULTAQA-MESSENGER.md](LOT-432-SPECIFICATION-SERVEUR-CONSOLIDEE-MULTAQA-MESSENGER.md) et son suivi dans [CONTINUITE-LOT-432.md](CONTINUITE-LOT-432.md).

Le Lot 432 fixe les invariants de consentement, la séparation زمالة/Messenger, le blocage bilatéral, la projection de profil minimale, le parcours gratuit de vérification, les règles d'accès au forum et la matrice de tests. Il reste une spécification de conception : aucun SQL ni code n'a été exécuté ou modifié.
