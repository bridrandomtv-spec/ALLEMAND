# Lot 370 — extraction complémentaire des dépendances PostgreSQL actives de Messenger

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Source : requêtes SELECT sur les catalogues PostgreSQL du projet Supabase actif `azjwcybivirvpxbfhyzk`.  
Limite : aucune donnée applicative, aucun profil réel, message ou conversation n'a été lu. Aucune écriture, DDL, migration ou modification de privilèges n'a été exécutée.

## 1. Résultat

Une nouvelle extraction ciblée a confirmé les définitions réellement installées des huit tables du périmètre, de leurs policies RLS, de leurs fonctions principales et de plusieurs dépendances d'administration. Elle permet de préciser les tests et les objets indispensables à la reconstitution. Ce n'est toujours pas un dump restaurable complet.

## 2. Structure et RLS

Tables inspectées : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`, `profiles`.

Les huit tables ont `relrowsecurity=true` et `relforcerowsecurity=false`. Les colonnes et valeurs par défaut ont été relues directement depuis `pg_attribute` / `pg_attrdef`. Exemples structurants :
- Conversations : identité bigint, type, wilaya/niveau/filiere, créateur, dates et activité.
- Membres : conversation bigint, utilisateur UUID, rôle, date d'arrivée et sourdine.
- Messages : conversation, expéditeur UUID, corps, pièce jointe éventuelle, indicateur, dates.
- Pièces jointes : message, uploader UUID, chemin, MIME, octets, SHA-256 et statut.
- Profils : UUID, pseudo, rôle, niveau, filière, wilaya, statut de vérification, vérificateur/date et champs historiques matricule/section.

Les tables de dépendance directement appelées par les helpers d'administration ont également été identifiées : `wilaya_assignments`, `admin_permissions`, `admin_roles`. Elles ont elles aussi RLS activé et FORCE RLS désactivé. La définition complète de leur sécurité et leurs contraintes reste à exporter avant restauration.

## 3. Définitions actives qui changent la matrice de test

### Ouverture des DM

La fonction active `public.msg_open_direct(uuid)` est `SECURITY DEFINER`, avec `search_path = ''`, exécutable par `authenticated` selon l'inventaire précédent. Elle :
1. exige une session Auth ;
2. refuse un destinataire nul ou identique à l'appelant ;
3. appelle `msg_can_dm(v_uid, p_other)` ;
4. prend un verrou transactionnel consultatif calculé à partir de la paire d'UUID ;
5. recherche un DM existant à deux membres ;
6. sinon insère la conversation et les deux membres.

**Précision importante :** la fonction n'est pas sans contrôle de compatibilité ; elle appelle bien `msg_can_dm`. Le défaut de conception confirmé reste qu'elle ne vérifie pas l'existence d'une invitation acceptée. La compatibilité actuelle repose sur wilaya/niveau/filière et `profiles.verif_statut='verifie'`, et non sur une affiliation scolaire officielle ou un consentement explicite du destinataire.

### Création et auto-ajout

Policies actives confirmées :
- `msg conv creation` : `created_by = auth.uid()` et type direct, ou modérateur pour les groupes.
- `msg members ajout` : l'utilisateur s'ajoute lui-même si `msg_member_ok(conversation_id, auth.uid())` renvoie vrai.
- `msg_member_ok` accepte le premier membre créateur d'un DM vide, puis un second membre compatible via `msg_can_dm`, sans invitation acceptée.

### Blocage

`msg_not_blocked(cid,snd)` cherche un blocage où un membre existant a bloqué l'expéditeur courant. Cette condition n'est pas une règle bilatérale générale explicite : tester les deux orientations A→B et B→A, et ne pas supposer qu'un seul cas couvre l'autre.

### Pièces jointes

La policy active `msg att upload` est plus restrictive que le simple contrôle uploader/membre : elle impose aussi MIME autorisé, 1 à 5 242 880 octets, statut `pending`, existence du message, appartenance à la conversation et un chemin commençant par `msg/<conversation>/<auth.uid()>-`. Elle ne compare toutefois pas explicitement `msg_messages.sender_id` à l'uploader. Le test doit vérifier si un membre peut joindre un fichier à un message envoyé par un autre membre.

## 4. Triggers actifs observés

- `msg_members.msg_tr_direct` — avant insertion, appelle `msg_guard_direct()`.
- `msg_messages.msg_tr_rate` — avant insertion, appelle `msg_rate_limit()`.
- `msg_messages.msg_touch_conversation` — après insertion, met à jour l'activité de la conversation.
- `msg_messages.msg_tr_log_del` — journalise la mise à jour de suppression.
- `msg_attachments.msg_tr_taille` — refuse une pièce jointe supérieure à 5 MiB.
- `msg_attachments.msg_tr_log_att` et `msg_reports.msg_tr_log_rep` — journalisation après mise à jour.
- `profiles.profiles_tr_role`, `profiles.profiles_tr_scope`, `profiles.profiles_tr_verif` — gardes rôle, périmètre et vérification.
- `profiles.profiles_tr_audit_role` et `profiles.trg_protect_role_niveau` — autres gardes/audit profil à inclure dans le baseline complet.

Ne pas reconstruire les seuls triggers Messenger en oubliant ceux de `profiles` : ils sont activés sur la table référencée par les helpers.

## 5. Dépendances d'administration

Fonctions actives observées :
- `is_admin()` lit `profiles.role='admin'`.
- `admin_can(uid,perm)` joint `wilaya_assignments` et `admin_permissions`, et exige que `uid=auth.uid()`.
- `admin_role_of(uid)` joint `wilaya_assignments` et `admin_roles`.
- `admin_wilayas(uid)` lit les affectations actives.
- `admin_sees_wilaya(uid,w)` combine rôle et wilayas autorisées.
- `msg_is_moderator` dépend de `is_admin()` et `admin_can(...,'messaging.moderate')`.

Toutes ces fonctions extraites sont SECURITY DEFINER, STABLE, avec `search_path` limité à `pg_catalog, public`. La restauration exige donc les tables, contraintes, droits, fonctions et données de référence synthétiques de ces dépendances. Il faut aussi reconstruire correctement le schéma `auth`, `auth.uid()`, les claims JWT et les rôles gérés par Supabase ; une base PostgreSQL ordinaire ne les fournit pas automatiquement.

## 6. Matrice de test affinée

| Identités synthétiques | Cas | Résultat attendu |
|---|---|---|
| A, B compatibles | A appelle `msg_open_direct(B)` sans invitation | À refuser selon le contrat Messenger visé |
| A, B compatibles | A crée un direct par INSERT puis ajoute B | À refuser sans invitation acceptée |
| A, B non compatibles | RPC d'ouverture | Refus par `msg_can_dm` |
| A, B compatibles | B s'ajoute lui-même au DM de A sans invitation | À refuser |
| A, B, C | C lit le DM A-B | Zéro ligne / refus |
| A membre, B auteur | A attache un fichier à un message de B | Refus attendu ; vérifier si policy actuelle le permet |
| A bloque B | B tente d'envoyer | Refus |
| B bloque A | A tente d'envoyer | Refus |
| Modérateur avec permission | Création d'un groupe dans son périmètre | Autorisé |
| Élève ordinaire | Création d'un groupe | Refus |
| A et B simultanés | Ouverture répétée du même DM | Une seule conversation, aucun membre en double |
| Élève / modérateur / admin | Lecture et mutation des profils | Résultats conformes aux policies et triggers réellement actifs |

Les résultats attendus sont des critères de recette, pas des tests exécutés.

## 7. État de la reconstitution et prochaines opérations

Avant toute restauration, il reste à exporter de manière reproductible :
1. contraintes, index, séquences et defaults des huit tables et des tables admin ;
2. toutes les fonctions et triggers référencés, y compris `protect_role_niveau` et `profiles_tr_audit_role_fn` ;
3. policies et ACL de `profiles`, tables admin, `storage.objects`, séquences et RPC ;
4. bucket `prive` et tables de publication Realtime ;
5. objets/extensions Auth nécessaires, ou un harnais de test explicite reproduisant les claims sans prétendre tester le service Auth hébergé.

Aucune donnée de production ne sera copiée. Les identités et affectations de test seront entièrement synthétiques.

## 8. Garde-fous

- SELECT catalogue seulement sur le projet actif.
- Aucun test comportemental SQL/RLS multi-rôle exécuté.
- Aucun projet Supabase supplémentaire créé dans ce lot.
- Aucun frais engagé ; aucun service payant.
- Aucun changement sur `main`, aucune fusion PR #17, aucun déploiement Cloudflare.
