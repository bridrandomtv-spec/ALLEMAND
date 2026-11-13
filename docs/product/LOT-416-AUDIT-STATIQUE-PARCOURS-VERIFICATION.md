# Lot 416 — audit statique du parcours de vérification actuellement câblé

Date : 13 novembre 2026  
Statut : audit de code en lecture seule — aucun correctif appliqué

## 1. Résultat exécutif

Le parcours de vérification présent dans la branche n'est pas encore conforme à la décision produit des Lots 414–415. L'interface demande un numéro d'abonnement après paiement ; le client vérifie cet abonnement dans la table `subscriptions` avant de placer le profil en attente. La vérification scolaire reste donc conditionnée à un paiement/abonnement dans le parcours actuel.

Ce constat porte sur le code du dépôt, pas sur un test de la base Supabase active. Aucun accès aux données d'élèves ou à la base active n'a été effectué.

## 2. Fichiers examinés

### `msg.js`

- Le rendu du parcours non vérifié affiche une instruction demandant le numéro d'abonnement après activation du paiement.
- Le champ est présenté comme « رقم الاشتراك بعد تفعيل الدفع ».
- L'action `data-act="verif-req"` lit les champs `vfMat` et `vfSec`, puis appelle `window.SB.msgRequestVerification(mv, sv)`.
- Les états `en_attente`, `rejete` et `verifie` sont affichés dans l'interface.
- Le panneau de supervision affiche le matricule reçu depuis la file de vérification et propose des actions de confirmation/refus.
- Le texte actuel associe la vérification à la consultation par un professeur ou responsable, mais le périmètre réel d'habilitation doit être prouvé côté serveur.

### `supabase/supabase.js`

- `msgMyVerification()` lit `verif_statut, matricule, section` depuis le profil du compte connecté.
- `msgRequestVerification(subscriptionNumber, section)` valide un identifiant numérique, interroge `subscriptions` pour vérifier qu'un abonnement actif appartient au compte, puis met à jour le profil en `en_attente` et copie le numéro dans `profiles.matricule`.
- Le code retourne une erreur si le numéro est absent, invalide, non lié au compte ou si l'abonnement n'est pas actif.
- `msgVerificationQueue()` lit une file depuis `profiles` avec plusieurs champs de profil, dont `matricule`. La portée et la minimisation de cette lecture doivent être confirmées dans les politiques serveur réellement déployées ; le client ne suffit pas à établir la sécurité.
- Les actions `msgSetVerification` et la gestion de file doivent être vérifiées contre les fonctions SQL, triggers, grants et politiques RLS réels avant toute confiance opérationnelle.

### `prototypes/school-verification-preview.html`

- La maquette du Lot 414 présente un formulaire scolaire gratuit et un écran de responsable habilité.
- Les actions de la maquette sont désactivées et aucune connexion Supabase n'est présente.
- La maquette n'est donc pas une fonctionnalité active et ne remplace pas encore le parcours de `msg.js`.

## 3. Écarts identifiés

| Domaine | Code actuel observé | Cible décidée |
|---|---|---|
| Condition de demande | Abonnement actif obligatoire | Demande gratuite, sans paiement |
| Identifiant | Numéro d'abonnement | Établissement et informations scolaires minimales ; identifiant scolaire privé seulement si nécessaire et vérifiable |
| Stockage | Numéro d'abonnement copié dans `profiles.matricule` | Séparation stricte abonnement / affiliation ; aucune donnée commerciale comme preuve scolaire |
| Texte UI | « après activation du paiement » | « vérification scolaire gratuite » |
| Vérificateurs | File de profils et rôles client à confirmer | Rôles nominatifs et périmètres établissement/wilaya/central contrôlés côté serveur |
| Confidentialité | File incluant `matricule` dans la sélection client | Projection minimale, données privées jamais exposées au forum ni aux profils |
| Recours | Pas de parcours de recours visible dans les extraits examinés | Recours par un autre vérificateur |
| Forum | Ne pas réutiliser la vérification comme condition d'accès | Accès gratuit aux comptes élèves actifs, vérifiés ou non |

## 4. Plan de remplacement proposé — non exécuté

1. Remplacer le libellé de l'écran par une demande gratuite et retirer toute référence au paiement.
2. Remplacer les paramètres de la demande par les données scolaires minimales définies par le contrat : établissement, wilaya issue d'un référentiel contrôlé, niveau et filière/classe.
3. Ne pas utiliser `profiles.matricule` comme conteneur du numéro d'abonnement. La destination des éventuelles données scolaires privées doit être définie séparément après audit du schéma réel.
4. Retirer la dépendance client à la table `subscriptions` pour déposer une demande scolaire.
5. Remplacer la file globale de profils par une projection de dossiers minimale et des permissions serveur scindées par périmètre.
6. Ajouter un flux de demande de complément et de recours, avec séparation entre décision initiale et appel.
7. Garantir que la vérification scolaire n'est pas un garde d'accès au forum `ملتقى الطلاب`.
8. Vérifier chaque voie d'accès DM, y compris RPC, insertion directe, groupes, invitations, notifications et chemins historiques ; exiger vérification, consentement et absence de blocage côté serveur.
9. Exécuter des tests multi-comptes synthétiques sur une base PostgreSQL isolée avant toute activation.

## 5. Risques et précautions

- Ne pas simplement supprimer le contrôle d'abonnement du client : une modification UI seule ne crée pas une vérification fiable.
- Ne pas remplacer le numéro d'abonnement par un numéro scolaire dans le même champ sans connaître les usages, triggers, contraintes, exports et grants de `profiles.matricule`.
- Ne pas élargir les droits de lecture/écriture sur `profiles` pour faciliter la file de vérification.
- Ne pas considérer le rôle `prof` ou `admin` côté client comme une preuve d'habilitation.
- Ne pas afficher le matricule dans l'écran de supervision si un identifiant de dossier et une réponse institutionnelle minimale suffisent.
- Ne pas utiliser le stockage privé Messenger pour les justificatifs scolaires.

## 6. Limites de l'audit

Audit statique des fichiers de la branche uniquement. Les définitions actives de SQL/RLS, les GRANT de colonnes, les triggers et les données de la base Supabase ne sont pas vérifiés dans ce lot. Le comportement en production ne doit pas être déduit du seul code client.

## 7. Périmètre

Aucun fichier applicatif modifié ; aucun SQL, migration, Auth, RLS, Storage, Realtime, paiement ou donnée élève touché ; aucun accès à la base active ; aucun déploiement Cloudflare ; aucune modification de `main`, rebase, synchronisation ou fusion de PR #17.

## Suite — Lot 417

Établir un inventaire exhaustif des dépendances de `profiles.matricule`, `verif_statut` et des fonctions `msg*` (code client, scripts SQL du dépôt, contrôles CI et chemins Messenger), puis préparer une stratégie de transition sans collision avec les usages historiques. Lecture seule et documentation uniquement.
