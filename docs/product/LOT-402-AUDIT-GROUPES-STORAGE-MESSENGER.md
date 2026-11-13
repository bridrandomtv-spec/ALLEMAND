# Lot 402 — audit des groupes Messenger et du Storage privé

Date : 13 novembre 2026  
Statut : inventaire de métadonnées en lecture seule.

## 1. Périmètre

Lecture des policies `public.msg_*`, des fonctions d'accès groupe déjà inspectées, des privilèges effectifs sur les tables Messenger, des policies `storage.objects` et de la configuration du bucket `prive`. Aucun objet Storage, message, profil ou fichier d'élève n'a été lu.

Aucun SQL de changement, DDL/DML, migration, policy, GRANT, Auth, RLS, Storage ou Realtime modifié. Aucun test comportemental.

## 2. Modèle d'accès aux groupes Messenger

La fonction `msg_is_member(uid,cid)` considère l'utilisateur comme membre :
- s'il existe une ligne dans `msg_members` ; ou
- si la conversation est de type `groupe` et que le profil courant correspond à la wilaya et au niveau de la conversation, ainsi qu'à la filière lorsque celle-ci est renseignée.

La fonction `msg_member_ok(cid,uid)` permet également l'INSERT de l'utilisateur lui-même dans un groupe si ces critères géographiques/scolaires correspondent. La policy `msg members ajout` interdit d'ajouter un autre compte, car elle impose `user_id = auth.uid()`.

Conséquence : l'accès aux groupes de type `groupe` est en partie fondé sur l'affiliation scolaire correspondante, et non exclusivement sur une invitation ou une liste de membres explicite. Le même prédicat sert à la lecture des conversations/messages et à la lecture des pièces jointes.

**Décision requise avant d'étendre les groupes sociaux :** déterminer si les groupes Messenger actuels sont des espaces institutionnels ouverts automatiquement aux élèves de la même wilaya/niveau/filière, ou s'ils doivent devenir des groupes sur invitation. Ne pas réutiliser ce modèle pour `المجموعات الدراسية` du réseau social sans décision produit séparée.

## 3. Privilèges de tables

Le rôle `authenticated` possède des privilèges SQL SELECT/INSERT/UPDATE/DELETE sur plusieurs tables Messenger, dont `msg_conversations` et `msg_members`. Pour `msg_messages`, SELECT/INSERT/DELETE sont présents, UPDATE non. Pour `msg_attachments`, SELECT/INSERT/DELETE sont présents, UPDATE non.

Ces privilèges ne signifient pas un accès universel aux lignes : les policies RLS restent déterminantes. Leur comportement réel n'a pas été testé dans ce lot.

## 4. Storage privé

Configuration du bucket `prive` :
- `public = false` ;
- `file_size_limit = NULL` au niveau bucket ;
- `allowed_mime_types = NULL` au niveau bucket.

Policies recensées sur `storage.objects` :

- `msg storage lecture` : lecture des objets sous `prive/msg/{conversation_id}/...` si l'utilisateur est membre Messenger de la conversation, ou modérateur.
- `msg storage upload` : upload sous le préfixe `msg`, si owner = auth.uid(), utilisateur membre de la conversation, taille metadata entre 1 et 5 242 880 octets, MIME parmi PNG/JPEG/WebP/PDF.
- `owner read` et `owner delete` : lecture/suppression des objets dont le premier segment du chemin est l'UUID du propriétaire.
- `owner upload` : insertion sous le dossier personnel de l'utilisateur ; cette policy générique ne reprend pas les contraintes MIME/taille propres au chemin `msg`.
- Aucune policy UPDATE de `storage.objects` n'a été relevée dans cet inventaire.

Pour les chemins Messenger, la policy dédiée impose donc 5 Mio et une liste MIME, malgré l'absence de limite au niveau bucket. La sécurité antivirus/antimalware n'est pas démontrée par ces métadonnées.

## 5. Conséquences pour ملتقى الطلاب

- Ne pas stocker les photos/vidéos sociales dans le bucket `prive` en supposant que les règles Messenger conviennent.
- Le bucket actuel n'a pas de limite globale ni de MIME allowlist au niveau bucket ; les limites Messenger sont portées par des policies spécifiques.
- Le modèle actuel d'accès groupe Messenger est distinct des groupes sociaux et de leurs adhésions.
- Le blocage bilatéral n'est pas intégré au prédicat de lecture Storage observé ; le traitement des pièces jointes historiques après blocage reste une décision de sécurité/produit.
- Les publications sociales photo/vidéo nécessiteront un bucket/chemin et des policies conçus pour leurs audiences, taille, types réellement acceptés, suppression, modération et contrôle d'accès. Aucune table ou policy n'est proposée comme active.

## 6. Points non démontrés

- Aucun test RLS réel, aucune simulation d'utilisateurs, aucune tentative d'upload.
- Aucun scan antivirus, détection de contenu malveillant ou traitement de transcodage vidéo confirmé.
- Aucune preuve qu'un flux d'invitation sociale ou de groupes sociaux soit opérationnel.
- Aucun audit exhaustif des fonctions et policies hors périmètre `msg_*` / `storage.objects`.

## 7. Suite proposée — Lot 403

Concevoir séparément le modèle d'accès des groupes sociaux et le pipeline sécurisé des médias sociaux : audiences, visibilité, demandes d'adhésion, révocation, limites, MIME, taille, contrôle du propriétaire, modération et cycle de vie des fichiers. Garder Messenger et son bucket actuel isolés. Aucune implémentation avant environnement PostgreSQL/Storage de test gratuit, fidèle et autorisé.

## 8. Décision

**NO-GO pour réutiliser directement le bucket Messenger ou ses règles de groupes dans ملتقى الطلاب.** Lot documentaire seulement ; aucun changement de production, aucun déploiement, merge, coût ou service payant.
