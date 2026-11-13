# Lot 431 — rapprochement du modèle d'invitations avec le catalogue actif

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment · PR #17  
**Statut :** analyse documentaire et conception uniquement — aucun SQL exécuté.

## 1. Sources relues

- LOT-387-PROPOSITION-SCHEMA-INVITATIONS-MESSENGER.md
- LOT-388-REVUE-CANDIDAT-MIGRATION-ET-CONTournements-MESSENGER.md
- LOT-396-CONTRAT-INVITATIONS-SOCIALES-ET-PRIVACITE.md
- LOT-413-POLITIQUE-ACCES-MULTAQA-MESSENGER.md
- LOT-420-AUDIT-ECARTS-MESSENGER-VERIFICATION-CONSENTEMENT-BLOCAGE.md
- LOT-427-AUDIT-CATALOGUE-ACTIF-SUPABASE-MESSENGER.md
- LOT-430-PLAN-IMPLEMENTATION-FICHIER-PAR-FICHIER.md
- CONTINUITE-LOT-430.md

Les résultats du Lot 427 sont la référence disponible pour le catalogue actif. Le SQL agrégé supabase/msg_schema.sql et les migrations archivées ne sont pas considérés comme une photographie de la base actuelle.

## 2. Rapprochement du modèle Lot 387 et du catalogue actif

| Élément | Proposition Lot 387 | Catalogue actif Lot 427 | Décision |
|---|---|---|---|
| Table d'invitations Messenger | public.msg_invitations proposée | Aucune table d'invitation/contact trouvée dans le périmètre examiné | Nouvelle table nécessaire, mais non créée |
| Identifiants | UUID requester/recipient liés à Auth | Tables existantes utilisent UUID pour les membres ; conversations en bigint identity | FK et types à revalider sur contraintes actives avant migration |
| Lien vers conversation | conversation_id bigint nullable | msg_conversations.id bigint identity | Type cohérent avec le constat, FK exacte à revalider |
| Création du DM | RPC transactionnelle à l'acceptation | msg_open_direct(uuid) SECURITY DEFINER crée conversation et membres sans invitation acceptée | Bloqueur critique : RPC à remplacer/verrouiller |
| Ajout du second membre | Contrôle d'invitation acceptée dans le garde serveur | Trigger msg_guard_direct appelle msg_can_dm, sans preuve d'invitation | Bloqueur critique : contrôler aussi trigger et chemin d'insertion |
| Blocage | Vérification des deux sens | msg_not_blocked ne couvre qu'une orientation | Bloqueur critique : fonction commune bilatérale |
| Profils | Projection publique minimale | Policy de conversation autorise SELECT de la ligne complète profiles, grants sur 12 colonnes | Bloqueur confidentialité : projection dédiée et privilèges minimaux |
| Vérification | Élève éligible indépendamment du paiement | Client exige abonnement actif ; trigger permet seulement une transition en attente | Parcours réel gratuit à implémenter, preuve institutionnelle à définir |
| RLS invitations | SELECT participants, aucune écriture directe, mutations RPC | Pas de table d'invitation existante à auditer | Définir policies/grants après revue de la baseline exacte |

## 3. Points à corriger dans la proposition avant toute migration

### 3.1 États et séparation métier

Le Lot 387 emploie les états Messenger pending / accepted / rejected / cancelled / expired. Le contrat social du Lot 396 emploie pending / accepted / declined / cancelled. Ces vocabulaires ne doivent pas être fusionnés dans une table commune.

Décision :
- garder deux modèles séparés : invitation Messenger et demande de زمالة ;
- conserver des états propres à chaque domaine ;
- l'acceptation d'une زمالة ne crée jamais de DM ;
- l'acceptation Messenger crée/récupère le DM seulement dans la transaction dédiée.

### 3.2 Unicité et demandes croisées

L'index unique partiel sur la paire non ordonnée protège contre deux invitations pending simultanées en sens inverse. Il faut néanmoins spécifier le comportement fonctionnel d'une invitation croisée : retourner la demande existante au destinataire, sans créer une deuxième ligne, et ne pas transformer silencieusement une demande en acceptation.

Les commandes d'envoi, réponse et annulation doivent être idempotentes et sérialisées. Le destinataire seul accepte/refuse ; le demandeur seul annule. Le verrouillage de la ligne d'invitation doit être effectué dans la transaction de réponse.

### 3.3 Expiration

La colonne expires_at ne suffit pas : toutes les lectures et mutations doivent traiter une invitation expirée comme non active, même si aucun job n'a encore changé son statut en expired. Un éventuel traitement de matérialisation du statut doit être serveur et idempotent. Aucun cron payant ou service externe n'est requis pour appliquer la règle à la lecture/réponse.

### 3.4 Atomicité du DM

Le modèle doit garantir l'invariant : aucune invitation accepted sans conversation correspondante et aucune conversation directe nouvelle sans invitation Messenger acceptée exacte. La mise à jour de l'invitation, la création/récupération du DM, les deux adhésions et le lien conversation_id doivent être une transaction unique. Les appels concurrents doivent converger vers un seul DM et deux membres.

### 3.5 Chemins de contournement à fermer ensemble

La correction ne peut pas se limiter à la nouvelle RPC. Elle doit couvrir :
- msg_open_direct(uuid) et son ACL EXECUTE ;
- insertion directe de msg_conversations ;
- insertion directe de msg_members et trigger msg_guard_direct ;
- fonction msg_member_ok et dépendances ;
- policies RLS cumulatives et grants ;
- ouverture/réouverture et envoi des messages ;
- blocage dans les deux orientations.

Le garde client n'est pas une frontière de sécurité.

## 4. Écart produit : portée nationale et preuve scolaire

Le Lot 387 signale lui-même que l'ancienne règle même wilaya/niveau/filière est incompatible avec une communauté nationale. Le Lot 396 confirme que les filtres de wilaya/niveau/filière doivent être facultatifs, pas des restrictions automatiques.

Cependant, profiles.wilaya, niveau, filiere et verif_statut ne démontrent pas à eux seuls une affiliation scolaire actuelle. Le lancement national doit rester fermé tant qu'une source institutionnelle autorisée et les périmètres des vérificateurs ne sont pas établis. Le forum peut suivre la décision produit la plus récente du Lot 414 : accès communautaire de base aux comptes élèves actifs inscrits, sans paywall ; les fonctions de contact privé exigent une vérification scolaire validée et un consentement explicite.

L'abonnement ne doit jamais être une preuve d'identité ou un préalable à la demande gratuite de vérification.

## 5. Décision technique de ce lot

**GO uniquement pour la préparation et la revue du contrat ; NO-GO pour migration, activation nationale et déclarer les deux espaces terminés.**

Ordre de correction :
1. Baseline exacte des tables, colonnes, contraintes, index, fonctions, propriétaires, ACL, triggers, policies, grants et dépendances.
2. Décision documentée sur la source officielle d'affiliation et les rôles vérificateurs.
3. Contrat final distinct pour invitations sociales et Messenger.
4. Conception de toutes les migrations et RPC en cohérence avec le catalogue exact.
5. Tests négatifs multi-comptes dans un environnement isolé sans frais.
6. Revue de sécurité indépendante, puis autorisation explicite distincte avant toute écriture sur Supabase actif.
7. Implémentation client et tests de non-régression.

Aucune baseline isolée n'a été créée dans ce lot. Aucune installation locale ou ressource cloud n'a été faite.

## 6. Tests à rédiger avant exécution

- Invitation pending : aucun DM, aucune ligne membre, aucun accès au fil.
- Acceptation par le destinataire : un seul DM, exactement deux membres, lien invitation-conversation.
- Acceptation par expéditeur ou tiers : refus.
- Refus, annulation et expiration : aucun DM.
- Double clic et appels concurrents : effet unique.
- Invitations croisées : pas de doublon ni d'acceptation implicite.
- A bloque B et B bloque A : recherche, invitation, acceptation, ouverture et envoi refusés dans les deux sens.
- Insertion REST directe et appel RPC direct : aucun contournement.
- Lecture de profil : aucune colonne privée exposée.
- Forum compte actif non vérifié et non abonné : accès de base conformément à la décision produit ; actions sensibles soumises aux contrôles dédiés.
- Vérification gratuite : aucun abonnement requis ; seuls les rôles habilités voient les preuves.
- Régression des groupes officiels, DM existants, pièces jointes, Realtime et modération.

Ces tests sont un cahier de tests, pas des résultats d'exécution.

## 7. Opérations et limites

- Documents de conception relus ; aucune donnée personnelle ou aucun contenu de message lu.
- Aucun SQL exécuté, y compris SELECT dans ce lot.
- Aucun DDL/DML, migration, GRANT/REVOKE, RPC, trigger, policy, Auth, Storage, Realtime ou paiement modifié.
- Aucun test PostgreSQL/RLS multi-sessions exécuté.
- Aucun service payant, installation, déploiement Cloudflare ou modification de main.
- PR #17 reste ouverte et non fusionnée.
