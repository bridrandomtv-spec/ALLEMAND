# LOT 351 — Audit des dépendances SECURITY DEFINER, triggers et policies Messenger

Date : 12 novembre 2026  
Projet Supabase : `azjwcybivirvpxbfhyzk`  
Nature : audit du catalogue PostgreSQL en lecture seule ; aucun changement actif.

## 1. Décision

**NO-GO maintenu pour l'ouverture nationale et pour la migration de fermeture des DM tant que la baseline isolée et les tests multi-sessions ne sont pas disponibles.**

Le lot 351 complète les lots 349–350 : il cartographie les dépendances SQL qui rendent les barrières d'accès effectives. Il confirme que le trigger de garde DM impose une limite de deux membres et une compatibilité de profil, mais ne vérifie pas le consentement d'une invitation.

## 2. Graphe des fonctions impliquées dans les DM

### Fonctions SECURITY DEFINER appelées par policies ou RPC

| Fonction | Exécutable authenticated | Contrôle observé | Limite |
|---|---:|---|---|
| `msg_open_direct(uuid)` | oui | auth.uid, destinataire distinct, compatibilité, verrou de paire | crée sans invitation acceptée |
| `msg_can_dm(uuid,uuid)` | oui | appelant parmi les deux, même wilaya/niveau/filière, deux profils verifiés | pas d'affiliation officielle, bloque inter-wilayas |
| `msg_member_ok(bigint,uuid)` | oui | uid doit être auth.uid ; branche direct et branche groupe | second membre direct admis sans invitation |
| `msg_not_blocked(bigint,uuid)` | oui | sender doit être auth.uid | vérification directionnelle seulement |
| `msg_is_member(uuid,bigint)` | oui | uid doit être auth.uid ; membership ou groupe correspondant au profil | groupe fondé sur profil déclaratif |
| `msg_is_moderator(uuid)` | oui | uid doit être auth.uid ; admin ou permission `messaging.moderate` | contrôle de rôle, pas de preuve scolaire |

Ces fonctions appartiennent à `postgres`, sont SECURITY DEFINER et utilisent `search_path=pg_catalog, public`. Les ACL relevées donnent EXECUTE à authenticated pour les fonctions de contrôle ci-dessus et pour `msg_open_direct`; aucune entrée PUBLIC n'a été observée dans leurs ACL explicites. Cette observation ne remplace pas un audit des rôles hérités, des wrappers, ni des objets d'autres schémas.

Les contrôles `uid = auth.uid()` dans `msg_is_member` et `msg_is_moderator` réduisent l'usage de ces fonctions à l'identité courante ; leur EXECUTE exposé ne signifie donc pas qu'un appelant peut demander librement le statut d'un autre UUID.

## 3. Trigger de garde DM — `msg_guard_direct()`

Le trigger `msg_tr_direct` est actif sur INSERT dans `msg_members` et exécute `msg_guard_direct()`, SECURITY DEFINER, propriétaire postgres.

Pour une conversation `direct`, le trigger :
- verrouille la ligne de conversation avec `FOR UPDATE` ;
- refuse un troisième membre si deux sont déjà présents ;
- impose que le premier membre soit le créateur ;
- pour le second, recherche l'autre membre et appelle `msg_can_dm(NEW.user_id, v_other)` ;
- refuse si la paire n'est pas compatible selon les champs actuels du profil.

**Lacune :** aucune consultation d'invitation, aucun état `accepted`, aucun contrôle d'affiliation institutionnelle. Le trigger protège la cardinalité et la compatibilité déclarative, pas le consentement. Il constitue une défense de cohérence supplémentaire, mais ne ferme pas la voie d'auto-ajout.

L'ACL de la fonction trigger ne donne pas EXECUTE à authenticated dans l'état relevé ; son invocation via le trigger reste assurée par PostgreSQL. Ne pas tenter de la rendre appelable directement par le client.

## 4. Triggers Messenger dépendants

| Trigger | Table/événement | Fonction | Effet observé |
|---|---|---|---|
| `msg_tr_direct` | msg_members BEFORE INSERT | `msg_guard_direct` | limite DM à deux membres et contrôle compatibilité |
| `msg_tr_rate` | msg_messages BEFORE INSERT | `msg_rate_limit` | 20 messages/minute par sender, 2 000 caractères, marque les URL |
| `msg_touch_conversation` | msg_messages AFTER INSERT | `msg_touch_conversation_fn` | actualise last_activity |
| `msg_tr_taille` | msg_attachments BEFORE INSERT | `msg_tr_taille_fn` | limite taille à 5 MiB |
| `msg_tr_log_att` | msg_attachments AFTER UPDATE | `msg_logfn` | journalise l'opération |
| `msg_tr_log_del` | msg_messages UPDATE deleted_at | `msg_logfn` | journalise l'opération |
| `msg_tr_log_rep` | msg_reports AFTER UPDATE | `msg_logfn` | journalise l'opération |

Ces fonctions sont SECURITY DEFINER, détenues par postgres, avec `search_path=pg_catalog, public`. Les ACL observées pour les fonctions de trigger ne donnent pas EXECUTE à authenticated ; elles restent déclenchées par les événements de table.

Les fonctions de journalisation utilisent `auth.uid()` ou un UUID nul pour les événements sans contexte d'utilisateur. Le lot n'a pas vérifié l'exhaustivité métier du journal ni la résistance aux modifications administratives ; ce n'est pas une certification d'audit append-only.

## 5. Policies RLS dépendantes — points critiques

- `msg_conversations.msg conv creation` : autorise le créateur authentifié pour le type direct ; pour les autres types, passe par `msg_is_moderator`. La branche direct doit être retirée ou rendue impossible pour authenticated.
- `msg_members.msg members ajout` : auto-ajout sur son propre user_id si `msg_member_ok` passe. La branche direct doit être fermée ; ne pas casser la gestion distincte des groupes.
- `msg_messages.msg messages envoi` : sender = auth.uid, membership, et `msg_not_blocked`. Le contrôle de blocage reste unidirectionnel ; il faut une règle symétrique.
- Policies de lecture conversation/messages/membres : s'appuient sur `msg_is_member` ou `msg_is_moderator`.
- Pièces jointes : lecture par membre/modérateur ; upload exige uploader courant, message existant, membership, chemin `msg/{conversation}/{uid}-...`, MIME PNG/JPEG/WEBP/PDF, 1 à 5 MiB, statut pending.
- Signalements : création par reporter courant si membre de la conversation ; lecture reporter/modérateur ; traitement modérateur.
- Blocages : création par blocker courant, lecture par les deux parties/modérateur, suppression par blocker.

Aucune autre policy permissive sur les tables Messenger n'a été observée dans le relevé de ce lot. Toute migration devra refaire l'inventaire exhaustif au moment du déploiement, car une policy permissive ajoutée ultérieurement pourrait élargir les droits.

## 6. Conséquences pour le correctif

1. Fermer simultanément la RPC historique, l'INSERT direct de conversation et l'auto-ajout membre.
2. Faire du trigger une garde de cohérence complémentaire : pour le nouveau chemin contrôlé, il doit pouvoir distinguer l'acceptation autorisée sans exposer un flag falsifiable par le client.
3. Réserver les helpers internes au chemin serveur ; pas d'EXECUTE client sur un helper qui insère les memberships.
4. Ne pas révoquer globalement les fonctions utilisées par les policies : `msg_is_member`, `msg_is_moderator`, `msg_can_dm`, `msg_member_ok` sont des dépendances de plusieurs parcours. Changer leurs signatures ou ACL sans cartographie des références pourrait casser lecture, groupes, pièces jointes et modération.
5. La future règle de blocage doit couvrir A bloque B et B bloque A à la création d'invitation, à l'acceptation et à l'envoi ; préserver l'historique.
6. Refaire les tests Storage/Realtime, groupes et signalements après chaque changement de policy.
7. Contrôler explicitement les ACL par défaut, PUBLIC, rôles hérités, grants sur schéma, propriétaires, search_path, wrappers RPC et politiques cumulatives.

## 7. Tests à ajouter à la matrice du lot 349

- TRG-01 : insertion du premier membre par le créateur dans DM via chemin historique — doit échouer après migration.
- TRG-02 : insertion du second membre sans invitation acceptée — doit échouer.
- TRG-03 : insertion du second membre via acceptation valide — réussit une seule fois.
- TRG-04 : troisième membre dans un DM — refus.
- TRG-05 : deux acceptations concurrentes — un seul DM, deux membres.
- POL-01 : chaque policy permissive cumulée est inspectée ; aucun chemin alternatif direct.
- POL-02 : un élève ne peut appeler les helpers internes ni usurper uid.
- POL-03 : membership/lecture groupes conservés.
- BLK-04 : expéditeur qui a bloqué le destinataire ne peut plus envoyer.
- BLK-05 : destinataire qui a bloqué l'expéditeur empêche l'envoi.
- REG-04 : journalisation des décisions d'invitation et de l'ouverture du DM vérifiable en test.

Tests non exécutés sur PostgreSQL isolé : ils restent des critères d'acceptation.

## 8. Limites de l'inspection

- SELECT catalogue uniquement ; aucune donnée personnelle, conversation ou pièce jointe lue.
- Aucune écriture Supabase, DDL, migration, policy, GRANT, Auth, Storage ou Realtime.
- Aucun test JWT/PostgREST multi-comptes, aucune concurrence réelle.
- Les fonctions et policies relevées reflètent le projet actif au moment de l'inspection.
- Ce rapport n'est ni une certification de sécurité, ni une autorisation de migration.

## 9. État du dépôt

- Lot 351 : rapport d'audit uniquement.
- Dossier de continuité mis à jour après création du rapport.
- PR #17 doit rester ouverte/non fusionnée ; main inchangée.
- Aucun déploiement Cloudflare, aucune ressource payante.
- MFA/2FA et facturation hors périmètre.
