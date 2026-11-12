# Lot 330 — audit en lecture seule du schéma Supabase vivant

Date : 12 novembre 2026  
Branche GitHub : `design/prototypes-67-74-alignment`  
Base consultée : projet Supabase connecté, PostgreSQL 17.6  
Mode : lecture seule — aucune écriture, aucun DDL, aucune migration appliquée.

## 1. Résultat de la CI précédente

- CI #3193 : succès.
- CI #3194 : succès sur le test du garde d'affiliation du Lot 329.
- CI #3195 : succès sur le document Lot 329.
- CI #3196 : succès sur le dossier de continuité du Lot 329.

## 2. Registre scolaire : absence confirmée dans la base vivante

L'inventaire des tables du schéma public ne trouve aucune table correspondant à un registre d'établissements, aux affiliations scolaires, aux inscriptions annuelles ou aux invitations Messenger.

Les tables existantes `profiles` ne contiennent que les champs de profil et de vérification historique (wilaya, niveau, filière, matricule, section, statut de vérification, auteur et date de vérification). Il n'existe pas de relation canonique vers un établissement identifié ni d'année scolaire d'inscription.

Conséquence : `profiles.verif_statut = 'verifie'` ne prouve toujours pas qu'un élève est inscrit dans un lycée donné pour l'année scolaire donnée. Aucun annuaire national fondé sur l'inscription officielle ne peut être activé à partir de ce modèle.

## 3. Messenger : éléments effectivement renforcés en base

Les migrations vivantes incluent notamment :
- `secure_direct_message_membership`
- `close_direct_chat_join_and_lock_trigger_functions`
- `restrict_message_membership_helper_access`
- `enforce_message_attachment_metadata_constraints`
- `scope_message_edits_and_attachment_moderation`
- `enforce_message_storage_upload_limits`

La fonction `public.msg_open_direct(uuid)` existe en base :
- `SECURITY DEFINER`, `search_path = ''`, références de tables qualifiées ;
- authentifie l'appelant via `auth.uid()` et refuse l'auto-conversation ;
- prend un verrou transactionnel consultatif calculé sur la paire d'identifiants triée ;
- recherche une conversation directe ayant exactement les deux membres ;
- crée la conversation et les deux adhésions dans la même transaction si elle n'existe pas ;
- son ACL accorde EXECUTE à `authenticated` et `service_role`, pas à `PUBLIC` ni à `anon`.

Le trigger `msg_guard_direct` verrouille la ligne de conversation `FOR UPDATE`, vérifie le créateur du premier membre et empêche plus de deux membres dans un DM. Les helpers `msg_is_member`, `msg_member_ok`, `msg_can_dm` et `msg_not_blocked` vérifient l'identité appelante. Les fonctions sensibles sont accordées de manière plus restrictive que les valeurs par défaut PostgreSQL.

Ces mécanismes constituent un vrai durcissement de la création concurrente des DM. Ils ne sont toutefois pas un système d'invitations.

## 4. Contradiction d'API : DM sans invitation

Le client `supabase/supabase.js` n'appelle pas `msg_open_direct` pour un nouveau DM. Il cherche une conversation directe existante partagée, puis renvoie `msg_invitation_requise` si aucune n'existe.

En revanche, la fonction SQL `msg_open_direct` reste directement exécutable par le rôle `authenticated` et crée un DM lorsque `msg_can_dm` l'autorise. Elle n'exige aucun enregistrement d'invitation acceptée. Il existe donc deux contrats contradictoires : le parcours UI prétend exiger une invitation, l'API SQL peut ouvrir directement le DM.

En outre :
- la politique INSERT sur `msg_conversations` autorise toujours un utilisateur authentifié à créer une conversation de type `direct` dont il est le créateur ;
- la politique INSERT sur `msg_members` autorise l'utilisateur à s'ajouter lui-même si `msg_member_ok` l'autorise ;
- le helper et le trigger contrôlent le nombre de membres et la compatibilité, mais pas l'existence d'une invitation acceptée ;
- aucune table `msg_invites`, ni RPC create/list/respond/cancel/expire invitation, n'a été trouvée dans les tables ou migrations vivantes.

**Priorité S1** : avant d'annoncer le modèle « invitation Meta Messenger », définir un seul contrat serveur. L'ouverture d'un DM doit être déclenchée uniquement par l'acceptation atomique d'une invitation ; les anciens DM doivent rester compatibles sans être convertis implicitement.

## 5. Limitation nationale persistante

La fonction vivante `msg_can_dm(a,b)` exige encore :
- deux profils existants et marqués `verifie` ;
- une même wilaya ;
- un même niveau ;
- une même filière ;
- un appelant authentifié qui est l'un des deux participants.

Le verrouillage de concurrence ne change donc pas le périmètre fonctionnel. Le DM inter-wilayas reste impossible par cette fonction. Il ne faut pas simplement retirer les filtres géographiques : il faut les remplacer par une affiliation institutionnelle vérifiée, active et consentie, pour l'année scolaire correspondante.

## 6. Risque de confidentialité des profils

La politique vivante `profils visibles entre membres` autorise la lecture des lignes de profils des utilisateurs partageant une conversation. Les privilèges de colonnes accordent SELECT à `authenticated` sur l'ensemble des colonnes actuelles de `profiles`, y compris :
- `matricule` et `section` ;
- `verif_statut`, `verif_by`, `verif_at` ;
- `role`, `wilaya`, `niveau`, `filiere` et `created_at`.

Le client contient `listProfiles()` avec `select('*')`. Une politique RLS filtre les lignes ; elle ne masque pas les colonnes. Le commentaire du script historique parlant d'un affichage limité au pseudo/niveau ne suffit donc pas à garantir cette limitation.

**Priorité S1 — confidentialité des mineurs** : remplacer l'accès général à `profiles` par une projection minimale d'annuaire (par exemple pseudo et champs strictement nécessaires), avec consentement explicite et affiliation officielle active. Protéger les colonnes de vérification et d'identité par des privilèges distincts. Toute vue éventuelle devra être conçue en `security_invoker = true` sur PostgreSQL 15+, ou par une RPC contrôlée, et testée sous le rôle `authenticated`.

## 7. Blocage et pièces jointes

- `msg_not_blocked` vérifie qu'un membre de la conversation a bloqué l'expéditeur courant. Le comportement dans les deux sens doit être testé explicitement ; le contrat fonctionnel de blocage bilatéral n'est pas démontré par le seul test de cette branche.
- Les métadonnées de pièces jointes ont des contraintes de type MIME, taille maximale 5 Mio, état, empreinte SHA-256 et chemin. Le stockage privé a des politiques de lecture et d'envoi limitées au bucket `prive`, au membre de la conversation et à 5 Mio.
- Ces contrôles portent sur les métadonnées et les permissions ; ils ne démontrent pas une inspection antivirus ou une validation du contenu binaire réel.
- La publication Realtime contient `msg_messages` et `msg_conversations`. Aucun test multi-compte temps réel n'a été exécuté dans ce lot.

## 8. État MFA et périmètre demandé

L'inventaire vivant trouve toujours les trois tables :
- `mfa_email_factors`
- `mfa_email_challenges`
- `mfa_email_sessions`

La liste des migrations contient `20261109210413_add_email_mfa_challenge_store`. Cela prouve la persistance du stockage MFA dans le schéma, pas à elle seule l'activation d'une obligation MFA dans les flux de connexion. Le MFA/2FA reste exclu du périmètre demandé. Aucun code ni table n'a été supprimé dans cet audit en lecture seule ; le résidu doit être traité dans un lot séparé, après inventaire des dépendances et autorisation de mutation.

Les tables historiques `subscriptions`, `payments` et comptabilité restent également présentes dans le schéma. Aucun travail de facturation n'a été réalisé ni ajouté dans ce lot.

## 9. État des données observé

Le comptage agrégé des tables Messenger indique une conversation, zéro adhésion, zéro message, zéro pièce jointe, zéro signalement et zéro blocage. Aucun contenu de message ni profil individuel n'a été lu. Ce comptage ne prouve pas le fonctionnement multi-utilisateur.

## 10. Décisions et NO-GO

- GO : poursuivre la préparation documentaire et les tests synthétiques.
- GO : préparer une suite d'intégration sur une base PostgreSQL jetable, avec au moins deux sessions concurrentes.
- NO-GO : annuaire national, invitations inter-wilayas et validation d'inscription réelle tant que le registre officiel et les affiliations annuelles n'existent pas.
- NO-GO : exposition nationale de `profiles` tant que la minimisation des colonnes n'est pas corrigée.
- NO-GO : considérer le parcours invitation comme implémenté tant que l'API directe `msg_open_direct` n'exige pas une invitation acceptée.
- NO-GO : modifier la base active, supprimer les tables MFA, appliquer une migration ou changer Auth/RLS/GRANT/Storage sans autorisation distincte.

Aucune écriture SQL, aucun DDL, aucune migration appliquée, aucun changement Auth/RLS/GRANT/Storage, aucun déploiement Cloudflare, aucun changement sur `main`, aucune fusion de PR #17.
