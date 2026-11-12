# LOT 347 — Audit des fonctions, triggers, policies et flux Messenger

Date : 12 novembre 2026  
Périmètre : audit catalogue Supabase actif en lecture seule + lecture du client GitHub sur la branche de travail.  
Projet Supabase : `azjwcybivirvpxbfhyzk`.

## Décision

**NO-GO pour un Messenger national et pour l'ouverture de nouveaux DM sans invitation acceptée.** Le verrouillage appliqué dans le client n'est pas encore garanti par le serveur. Aucun changement SQL, DDL, policy, grant, Auth, Storage, Realtime ou client n'a été effectué dans ce lot.

## 1. Ouverture directe : contournement serveur confirmé

La fonction `public.msg_open_direct(p_other uuid)` est `SECURITY DEFINER`, possède `search_path=''` et reste exécutable par le rôle `authenticated`. Sa définition :
- vérifie la session et le destinataire ;
- appelle `msg_can_dm` ;
- prend un verrou consultatif transactionnel sur la paire ;
- recherche un DM existant avec exactement deux membres ;
- sinon insère une conversation directe et les deux memberships ;
- ne consulte aucune invitation ni aucun consentement du destinataire.

Le client `msgOpenDirect()` de `supabase/supabase.js` (lignes 351–375) ne fait plus cet appel et retourne `msg_invitation_requise` lorsqu'aucun DM partagé n'existe. C'est une protection d'interface uniquement : un utilisateur authentifié peut encore appeler la fonction RPC directement. Le contrôle de l'interface ne constitue donc pas une barrière d'autorisation.

En outre, les policies actuelles autorisent encore :
- INSERT sur `msg_conversations` pour le créateur d'un DM ;
- INSERT sur `msg_members` pour s'ajouter soi-même lorsque `msg_member_ok` le permet.

Le trigger `msg_guard_direct` limite la composition d'un DM à deux membres et appelle `msg_can_dm`, mais ne vérifie aucune invitation acceptée. La fonction RPC et le couple policies/triggers restent donc incompatibles avec le futur contrat d'invitations.

## 2. Limitation de portée des DM

`msg_can_dm(a,b)` exige que les deux profils aient les mêmes valeurs `wilaya`, `niveau` et `filiere`, toutes non nulles, et `verif_statut='verifie'`. Cette vérification ne prouve pas une inscription scolaire officielle et interdit les échanges inter-wilayas souhaités pour le Messenger national.

## 3. Blocage : règle directionnelle

La policy d'envoi appelle `msg_not_blocked(conversation_id,sender_id)`. La fonction cherche une ligne où un autre membre est `blocker_id` et l'expéditeur est `blocked_id`.

Conséquence : si B a bloqué A, A ne peut pas envoyer dans cette conversation. En revanche, si A a bloqué B, la fonction n'empêche pas A d'envoyer à B. Le contrat produit attendu doit préciser si un blocage doit être bilatéral pour les deux sens de communication ; pour un comportement de type Messenger, recommander une interdiction symétrique des nouveaux échanges et des invitations, avec traitement séparé des messages historiques.

Le client `msgBlock` crée une ligne `blocker_id=utilisateur courant, blocked_id=autre utilisateur` ; `msgUnblock` retire uniquement cette ligne.

## 4. Pièces jointes : relation réellement utilisée

Le flux client observé :
1. charge le fichier dans le bucket privé `prive` sous `msg/{conversation}/{user}-...` ;
2. insère ensuite une ligne `msg_attachments` avec `message_id`, `uploader`, chemin, MIME, taille et statut ;
3. relit les pièces jointes par `message_id` et génère des URL signées de 900 secondes.

Le lien effectivement utilisé est donc `msg_attachments.message_id -> msg_messages.id`. Le champ `msg_messages.attachment_id` existe mais n'est pas référencé par le flux client observé ; son absence de FK ne suffit pas à conclure à une anomalie fonctionnelle. Il faut le traiter comme champ legacy/inutilisé présumé jusqu'à une recherche complète des usages et des données.

La policy d'INSERT des métadonnées exige un uploader égal à l'utilisateur courant, un message existant, l'appartenance à la conversation, un chemin conforme et une allowlist MIME/limite de 5 Mio. **Elle ne vérifie pas que l'utilisateur courant est l'auteur du message lié** : un membre peut donc tenter d'attacher un fichier à un message d'un autre membre dans une conversation à laquelle il appartient. À corriger côté serveur avant une ouverture nationale, après test d'intégration isolé.

Le trigger de taille rejette les fichiers supérieurs à 5 242 880 octets. Aucun contrôle du contenu binaire, antivirus, détection MIME réelle ou nettoyage automatique d'un objet Storage si l'INSERT metadata échoue n'a été démontré par cet audit. Le client contrôle le MIME déclaré, ce qui n'est pas une validation du contenu.

## 5. Triggers et protections observés

- `msg_tr_direct` : verrouille la ligne conversation, limite un DM à deux membres et applique `msg_can_dm`, sans invitation.
- `msg_tr_rate` : limite à 20 messages/minute par `sender_id`, corps à 2 000 caractères, marque les URL. Le comptage simple n'a pas été validé sous concurrence.
- `msg_touch_conversation` : actualise `last_activity` après insertion d'un message.
- `msg_tr_taille` : limite les métadonnées d'attachement à 5 Mio.
- `msg_tr_log_del` et `msg_tr_log_att` : journalisent certaines mises à jour de message/pièce jointe. Le journal ne prouve pas une couverture complète de toutes les actions Messenger.

## 6. RLS et permissions principales constatées

- Conversations : SELECT membre/modérateur ; INSERT créateur pour direct, ou modérateur pour groupe.
- Membres : SELECT membre/modérateur ; INSERT auto-ajout via `msg_member_ok` ; DELETE par le membre concerné ou modérateur.
- Messages : SELECT membre/modérateur ; INSERT expéditeur courant + membre + `msg_not_blocked`.
- Pièces jointes : SELECT membre/modérateur ; INSERT par uploader courant avec message membre, MIME allowlist et taille ; UPDATE modérateur.
- Blocks : INSERT par le bloqueur ; SELECT par les deux parties/modérateur ; DELETE par le bloqueur.

Les policies permissives sont évaluées en OR au sein d'une même commande : il faudra tester les interactions complètes et les accès Storage dans un PostgreSQL isolé, pas seulement lire chaque policy séparément.

## 7. Realtime et index

La publication `supabase_realtime` contient `msg_conversations` et `msg_messages`. `msg_members` et `msg_attachments` n'y figurent pas dans l'état consulté. Le client s'abonne aux INSERT de `msg_messages` filtrés par conversation.

Index relevés : PK sur les tables, index messages par conversation/date et expéditeur/date, memberships par utilisateur, attachments par message, conversations par type et géographie. Aucun index dédié sur `msg_blocks.blocked_id` n'a été relevé ; à évaluer selon les volumes et le plan d'exécution, sans ajout automatique.

## 8. Actions requises avant le Messenger national

1. Révoquer/retirer les voies de création directe de DM et remplacer `msg_open_direct` par une opération serveur qui exige une invitation acceptée, ou modifier sa logique de façon transactionnelle.
2. Faire appliquer le consentement par les policies et triggers, pas seulement par le client.
3. Lier l'éligibilité au répertoire à une affiliation officielle active et annuelle, et non à `verif_statut` seul.
4. Définir puis tester le comportement symétrique des blocages pour DM et invitations.
5. Exiger que l'uploader soit aussi l'auteur du message auquel le fichier est rattaché, ou définir explicitement un modèle d'envoi de pièces jointes autorisant une autre relation.
6. Ajouter tests d'intégration PostgreSQL multi-comptes, RLS, RPC directes, concurrence, Storage, nettoyage d'upload et transitions d'invitation.
7. Décider du sort du champ legacy `msg_messages.attachment_id` après recherche de tous les usages, sans migration prématurée.

## 9. Limites et garde-fous

- Audit de catalogue et de code ; aucun test multi-comptes ni test d'attaque RPC n'a été exécuté.
- Aucune donnée personnelle, message, pièce jointe ou contenu privé n'a été lu.
- Supabase actif consulté en lecture seule : aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage.
- Aucun environnement payant créé ; aucun déploiement Cloudflare.
- PR #17 doit rester ouverte et non fusionnée ; aucune modification de `main`.
- MFA/2FA et facturation restent hors périmètre.
