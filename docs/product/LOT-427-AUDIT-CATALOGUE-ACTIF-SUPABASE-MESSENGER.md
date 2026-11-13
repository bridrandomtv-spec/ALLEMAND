# Lot 427 — Audit en lecture seule du catalogue Supabase actif Messenger

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**HEAD audité avant rapport :** `60354725ec82d47f108944d7d1b50b6cb61794a1`  
**Périmètre :** catalogues PostgreSQL, définitions de fonctions, politiques RLS, ACL, triggers, colonnes et métadonnées Storage.  
**Nature :** SELECT uniquement sur le projet Supabase existant, complété par une revue statique du client GitHub.  
**Aucune donnée applicative d'élève n'a été lue.**

## 1. Résumé exécutif

L'inspection du catalogue actif confirme que le Messenger dispose de ses tables principales, de politiques RLS, de triggers, de fonctions serveur et d'un bucket privé. Elle confirme aussi que les invariants produit retenus ne sont pas encore garantis par le backend.

**Verdict : NO-GO pour l'ouverture nationale des DM et pour déclarer Messenger conforme au modèle de consentement.**

Trois écarts bloquants sont confirmés dans le catalogue actif :

1. `msg_open_direct(uuid)` reste une fonction `SECURITY DEFINER` exécutable par `authenticated`. Elle crée une conversation et ajoute les deux membres sans vérifier une invitation acceptée.
2. `msg_not_blocked(bigint, uuid)` vérifie le cas où un autre membre a bloqué l'expéditeur, mais ne vérifie pas le sens où l'expéditeur a lui-même bloqué l'autre participant.
3. La politique `profils visibles entre membres` autorise la lecture de la ligne complète du profil d'un autre membre de conversation ; les droits SELECT de `authenticated` couvrent les 12 colonnes de `profiles`, dont `matricule`, `section`, `verif_by` et `verif_at`.

Autres écarts :
- aucune table d'invitation/contact ni fonction d'invitation n'a été trouvée dans le périmètre des tables et fonctions publiques examinées ;
- le client `msg.js` indique lui-même que la recherche nationale et le système d'invitations restent à ajouter ;
- `msgBlock` et `msgUnblock` existent comme helpers dans `supabase/supabase.js`, mais aucun appel correspondant ni commande de blocage n'a été trouvé dans `msg.js` ;
- la demande de vérification du client exige un abonnement actif, alors que le trigger serveur autorise la transition personnelle vers `en_attente` sans vérifier l'abonnement. Le contrôle du paiement est donc côté client, pas une preuve serveur de statut scolaire.

## 2. Résultats structurels observés

Les tables suivantes existent et ont RLS activé : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`, `profiles`, `audit_logs`, `admin_roles`, `admin_permissions` et `wilaya_assignments`.

Le préflight a relevé :
- 2 policies sur `msg_conversations) ;
- 3 policies sur `msg_members) ;
- 3 policies sur `msg_messages) ;
- 3 policies sur `msg_blocks) ;
- 3 policies sur `msg_attachments) ;
- 5 policies sur `storage.objects`.

Triggers actifs observés :
- `msg_tr_direct` sur `msg_members` ;
- `msg_tr_rate` et `msg_touch_conversation` sur `msg_messages` ;
- `msg_tr_taille` sur `msg_attachments) ;
- triggers de journalisation sur messages, pièces jointes et signalements.

Le bucket `prive` est déclaré non public. Sa limite `file_size_limit` et sa liste `allowed_mime_types` au niveau du bucket sont nulles ; les limites de 5 Mio et les types MIME autorisés sont notamment contrôlés par les policies d'upload et le client. Cela ne démontre pas l'existence d'un antivirus.

## 3. Consentement : RPC active et chemins RLS

La définition active de `public.msg_open_direct(p_other uuid)` :
- exige une session authentifiée ;
- appelle `msg_can_dm(v_uid, p_other)` ;
- recherche une conversation directe existante ;
- sinon insère une conversation directe ;
- insère les deux lignes de membres dans la même fonction.

L'ACL active accorde `EXECUTE` à `authenticated`. La fonction est `SECURITY DEFINER`, propriétaire `postgres`, avec `search_path = ''` et des références qualifiées par schéma.

La fonction `msg_can_dm` vérifie que les deux profils sont vérifiés, ont wilaya/niveau/filière identiques et que l'utilisateur appelant figure parmi les deux UUID. Elle ne vérifie ni invitation acceptée ni blocage.

Le trigger `msg_guard_direct` appelle lui aussi `msg_can_dm` lors de l'ajout du second membre ; il ne contrôle pas l'acceptation d'une invitation.

La policy d'insertion de `msg_conversations` autorise un utilisateur authentifié à créer une conversation directe dont il est le créateur. La policy d'insertion de `msg_members` et la fonction `msg_member_ok` contrôlent l'identité du membre et l'éligibilité scolaire, mais ne matérialisent pas un consentement par invitation acceptée.

**Conséquence :** le garde présent dans le navigateur (`msgOpenDirect` renvoie `msg_invitation_requise`) n'est pas une frontière de sécurité. L'appel direct de la RPC active peut contourner le client et créer le DM avec les deux participants.

## 4. Blocage : asymétrie confirmée

La définition active de `msg_not_blocked(cid, snd)` recherche une ligne de blocage telle que :
- le bloqueur est un membre de la conversation ;
- la personne bloquée est l'utilisateur qui envoie le message.

Cela bloque le cas « le destinataire a bloqué l'expéditeur ». Cela ne bloque pas le cas « l'expéditeur a bloqué le destinataire ». La fonction est appelée par la policy d'insertion de `msg_messages`.

La création de DM par `msg_open_direct` n'appelle pas non plus de contrôle de blocage.

**Conséquence :** le blocage bilatéral n'est pas garanti à tous les points d'entrée. Il faut une règle serveur commune à la création, l'adhésion, l'envoi et la reprise d'une conversation.

## 5. Confidentialité de profiles

La policy `profils visibles entre membres` permet le SELECT si l'utilisateur est membre d'une conversation partagée avec le profil ciblé. Les droits SELECT de `authenticated` portent sur les 12 colonnes de `profiles` :
- `id`, `pseudo`, `role`, `niveau`, `filiere`, `wilaya`, `created_at` ;
- `verif_statut`, `verif_by`, `verif_at`, `matricule`, `section`.

RLS filtre les lignes ; il ne masque pas à lui seul les colonnes d'une ligne autorisée. Ainsi, un membre d'une conversation peut potentiellement lire les champs administratifs du profil de son co-participant.

**Décision :** ne pas ouvrir un annuaire national sur `profiles`. Créer ultérieurement une projection minimale dédiée, limitée au pseudonyme et aux champs scolaires non sensibles strictement nécessaires, et maintenir les identifiants scolaires dans un périmètre de vérification réservé.

## 6. Vérification scolaire et abonnement

Dans `msg.js`, le formulaire demande un « numéro d'abonnement après activation du paiement ». Dans `supabase/supabase.js`, `msgRequestVerification` recherche une ligne `subscriptions` appartenant à l'utilisateur et au statut `actif` avant d'envoyer la demande.

Le trigger actif `profiles_verif_guard` permet toutefois à l'utilisateur de passer de `non_verifie` ou `rejete` à `en_attente`, en conservant `verif_by`, sans effectuer de contrôle de la table `subscriptions`. La validation finale reste réservée à l'administration ou aux agents autorisés.

**Conséquence :** le numéro d'abonnement n'est pas une preuve d'identité scolaire côté serveur. Le parcours actuel contredit la décision produit du Lot 413 : vérification gratuite, indépendante du paiement. Il faut une preuve scolaire vérifiable et un flux anti-abus, sans réutiliser l'identifiant d'abonnement comme matricule.

## 7. État du client et visibilité de Messenger

La revue statique de `msg.js` et `supabase/supabase.js` confirme :
- l'entrée de navigation `msg` et la vue `💬 الرسائل` sont présentes ;
- le client affiche les groupes officiels et les conversations directes existantes ;
- en l'absence de DM, l'interface annonce que la recherche nationale et les invitations seront ajoutées après sécurisation du serveur ;
- aucun écran de recherche nationale, de demande de contact, d'acceptation/refus ou de blocage n'est branché dans `msg.js` ;
- le client a un helper `msgBlock`, mais l'interface examinée ne l'appelle pas.

Cela explique pourquoi l'utilisateur peut voir l'entrée « الرسائل » sans trouver un véritable Messenger national avec recherche et invitations.

## 8. Décisions produit conservées

- `ملتقى الطلاب` : gratuit pour les élèves vérifiés, avec publication, commentaires et interactions selon les audiences et protections serveur.
- `💬 الرسائل` : fonctions textuelles essentielles gratuites pour les élèves vérifiés, mais uniquement après demande de contact et acceptation explicite.
- L'abonnement finance les services pédagogiques premium ; il ne donne aucun droit supplémentaire sur l'identité, la visibilité ou les contacts d'un autre élève.
- La vérification scolaire est gratuite et indépendante du paiement.
- Aucun DM ne doit être créé par le seul fait d'être abonné, d'être dans le même niveau ou d'appartenir à la même wilaya/filière.

## 9. Prochain plan technique — sans exécution

1. Concevoir une table de demandes de contact avec états `pending / accepted / rejected / cancelled`, unicité du couple, expiration et idempotence.
2. Concevoir une RPC transactionnelle d'acceptation qui crée la conversation et les deux membres uniquement après acceptation par le destinataire.
3. Faire appliquer le blocage bilatéral dans les policies et fonctions serveur pour DM, adhésion et envoi.
4. Remplacer la lecture des lignes complètes de `profiles` par une projection minimale et auditer les grants de colonnes.
5. Découpler le parcours de vérification du paiement ; prévoir des preuves scolaires et une file de vérification limitée aux agents habilités.
6. Brancher dans `msg.js` les écrans arabes de recherche, demandes reçues/envoyées, acceptation/refus et blocage.
7. Définir les tests multi-comptes synthétiques. Ne pas les exécuter sur la production.

## 10. Périmètre, limites et opérations

- Requêtes exécutées : SELECT uniquement sur les catalogues et métadonnées.
- Données de profils, Auth, messages, conversations, rapports et objets Storage : non lues.
- Écritures SQL, migrations, DDL, DML, GRANT/REVOKE, RPC, triggers, policies, Auth, Storage, Realtime : aucune.
- Tests comportementaux avec plusieurs sessions : non exécutés.
- Environnement PostgreSQL local ou payant : aucun créé, aucune installation.
- Déploiement Cloudflare : aucun.
- `main) : inchangée.
- PR #17 : laissée ouverte et non fusionnée.
- Le rapport est un diagnostic de catalogue actif à la date du contrôle ; il ne constitue pas une certification complète de sécurité.

**Verdict final du Lot 427 :** infrastructure Messenger présente ; consentement DM, blocage bilatéral, minimisation des profils et parcours de vérification gratuite non conformes ou incomplets. NO-GO pour l'ouverture nationale avant correction et tests isolés.
