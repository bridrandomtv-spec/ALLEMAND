# Lot 420 — Audit statique des écarts entre Messenger actuel et le contrat de sécurité

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Périmètre :** `msg.js`, `supabase/supabase.js`, `supabase/msg_schema.sql`, archives SQL de migrations et contrôles CI.  
**Nature :** audit documentaire/statique uniquement. Aucun SQL exécuté, aucune requête à Supabase actif, aucune modification applicative ou de base.

## 1. Résumé décisionnel

**Messenger ne peut pas encore être déclaré conforme au parcours cible.** La CI passe, mais elle contrôle surtout la présence de motifs textuels et des invariants statiques. Elle ne démontre ni le consentement réel avant création d'un DM, ni le blocage de tous les chemins RPC, ni la gratuité de la vérification scolaire.

Trois écarts prioritaires sont confirmés dans les fichiers de la branche :

1. **Vérification liée au paiement dans le client actuel.** `msgRequestVerification(subscriptionNumber, section)` exige un abonnement de l'utilisateur au statut `actif`, puis copie son identifiant dans `profiles.matricule`. C'est contraire à la décision de vérification scolaire gratuite et indépendante de l'abonnement.
2. **Garde d'invitation présente dans la méthode cliente, mais preuve SQL incomplète.** `msgOpenDirect(otherId)` ne crée plus de nouveau DM dans le client et retourne `msg_invitation_requise` s'il ne trouve pas de conversation existante partagée. Cependant, l'archive de migration `20261030131545_harden_messages_attachments_sponsors_and_direct_rpc.sql` définit `msg_open_direct(uuid)`, accorde son exécution à `authenticated` et ne vérifie que `msg_can_dm`. Les migrations archivées suivantes verrouillent l'ajout des membres, mais ne montrent pas de condition d'invitation acceptée.
3. **Le contrôle bilatéral du blocage n'est pas prouvé pour tous les chemins.** Le SQL agrégé `supabase/msg_schema.sql` et la fonction `msg_not_blocked` doivent être rapprochés du catalogue actif et de toutes les fonctions/RPC. Le client `msgBlock` ne constitue pas une garantie serveur à lui seul.

## 2. Constats vérifiés dans les fichiers de la branche

### 2.1 Vérification scolaire

Dans `supabase/supabase.js` :
- `msgRequestVerification` exige un numéro numérique ;
- recherche ce numéro dans `subscriptions` avec `user_id = u.id` et `statut = 'actif'` ;
- refuse la demande si l'abonnement n'est pas trouvé ;
- écrit `verif_statut = 'en_attente'`, `matricule = number` et `section`.

Dans `msg.js`, le formulaire de demande appelle cette méthode avec les champs `vfMat` et `vfSec`. La maquette du Lot 414 est distincte et n'est pas branchée à cette méthode.

**Conclusion :** la vérification gratuite n'est pas implémentée dans le client réel de cette branche. Ne pas annoncer le contraire.

### 2.2 Création et ouverture des DM

Dans `supabase/supabase.js`, `msgOpenDirect(otherId)` :
- cherche les conversations auxquelles les deux utilisateurs appartiennent déjà ;
- ne crée pas de conversation ni de membre destinataire dans cette méthode ;
- renvoie `msg_invitation_requise` si aucune conversation directe existante n'est trouvée.

C'est une protection utile du chemin client, mais elle ne suffit pas si une RPC SQL reste appelable directement.

L'archive `20261030131545_harden_messages_attachments_sponsors_and_direct_rpc.sql` :
- crée `public.msg_open_direct(p_other uuid)` ;
- appelle `msg_can_dm(v_uid, p_other)` ;
- crée une conversation et ajoute les deux membres si aucune n'existe ;
- accorde `EXECUTE` à `authenticated`.

Les archives ultérieures `20261030132222_secure_direct_message_membership.sql` et `20261030132512_close_direct_chat_join_and_lock_trigger_functions.sql` ferment certains chemins d'ajout de membres et verrouillent les conversations directes à deux membres. Dans les fichiers archivés inspectés, aucune vérification d'une invitation acceptée n'est ajoutée à `msg_open_direct` ou à `msg_can_dm`.

**Risque à vérifier sur le catalogue actif :** si cette RPC demeure exposée à `authenticated` sans contrôle d'invitation, le garde-fou de `msgOpenDirect` côté navigateur peut être contourné en appelant directement la RPC.

Les archives sont des copies historiques de migrations déclarées déjà appliquées par le manifeste Lot 342. Elles ne doivent pas être rejouées. Cet audit de dépôt ne prouve pas que la définition active actuelle est identique ; une lecture du catalogue actif est nécessaire avant toute conclusion définitive.

### 2.3 Vérification de l'identité dans la fonction d'éligibilité

Le fichier agrégé `supabase/msg_schema.sql` contient une définition de `msg_can_dm` fondée sur la correspondance wilaya/niveau/filière, sans condition `verif_statut = 'verifie'`. Le Lot 399 avait auparavant rapporté, depuis un audit en lecture seule du catalogue vivant, une définition exigeant des profils vérifiés. Il existe donc une divergence documentaire entre le SQL agrégé et le constat historique du catalogue actif.

**Conclusion :** ne pas traiter le SQL agrégé comme une preuve de l'état actuel ; récupérer la définition active exacte et ses dépendances avant de modifier quoi que ce soit.

### 2.4 Blocage

Le client possède `msgBlock` et `msgUnblock`. Le SQL agrégé contient une fonction `msg_not_blocked` utilisée dans la policy d'insertion des messages. Les archives de migrations ne démontrent pas à elles seules que chaque voie de création, réouverture, ajout de membre et envoi applique une règle bilatérale cohérente.

Il faut tester au minimum :
- A bloque B, puis A et B tentent chacun d'envoyer ;
- B bloque A, puis A et B tentent chacun d'envoyer ;
- un DM existe avant le blocage ;
- tentative de réouverture via le client et via RPC ;
- ajout d'un membre par chaque chemin disponible.

## 3. Pourquoi la CI verte ne suffit pas

`ci/check-msg.mjs` et `tests/msg_test.mjs` vérifient des chaînes, des fragments SQL, la présence de méthodes et quelques invariants textuels. Ils ne démarrent pas PostgreSQL, ne créent pas deux sessions authentifiées indépendantes, ne simulent pas des appels RPC directs et ne testent pas l'état réel du catalogue Supabase.

Une assertion telle que « le client retourne `msg_invitation_requise` » ne prouve pas qu'une RPC SQL parallèle ne peut pas créer le DM.

## 4. Plan de correction — sans exécution dans ce lot

1. Inventorier toutes les fonctions SQL actives et leurs ACL : `msg_open_direct`, `msg_can_dm`, triggers de `msg_members`, policies RLS et fonctions de blocage.
2. Concevoir une invitation Messenger dédiée avec états explicites (pending/accepted/rejected/cancelled), acceptation par le destinataire, expiration, limitation anti-spam et journalisation.
3. Exiger côté serveur une invitation acceptée avant création d'un DM, y compris dans toute RPC et tout chemin direct d'insertion ; révoquer les voies historiques non conformes.
4. Remplacer la demande de vérification liée à l'abonnement par un parcours gratuit et indépendant ; ne jamais utiliser le numéro d'abonnement comme preuve d'identité scolaire.
5. Garantir le blocage dans les deux sens sur création, réouverture, ajout de membres et envoi, avec politique explicite sur les conversations déjà ouvertes.
6. Exécuter les scénarios avec comptes synthétiques sur un PostgreSQL local isolé, seulement après établissement d'un baseline fidèle.

## 5. Décision de sécurité

**NO-GO pour annoncer le Messenger privé comme terminé ou pour activer le nouveau parcours.** Le code client contient une partie des garde-fous, mais les voies SQL/RPC, la vérification gratuite et les tests multi-comptes ne sont pas encore prouvés.

Aucun changement Auth, RLS, schéma, migration, Storage, Realtime, paiement ou donnée d'élève n'a été réalisé. Aucun déploiement Cloudflare, aucune fusion et aucun changement de `main`.

## 6. Étape bloquante suivante

Le Lot 421 devra établir, en lecture seule et sans exposer de données personnelles, le catalogue exact des fonctions RPC, leurs signatures, propriétaires, paramètres de sécurité et ACL, ainsi que les définitions effectives des policies/triggers pertinents. Cette étape nécessite un accès autorisé au catalogue actif ou un export de schéma expurgé. En parallèle, l'utilisateur doit fournir la sortie du contrôle PowerShell du Lot 419 pour préparer un environnement PostgreSQL local sans installation ni coût.
