# Lot 379 — policies RLS, fonctions DM et capacité Supabase Free

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Périmètre : extraction de catalogues et définitions SQL en lecture seule ; aucune donnée applicative consultée.

## 1. Capacité réelle de l'organisation Supabase

Contrôles effectués via l'API Supabase :
- Organisation `yhigaygkffkdygpaglaf` : plan `free`.
- Projet ALLEMAND `azjwcybivirvpxbfhyzk` : actif, PostgreSQL 17.6.1.166, région eu-west-2.
- Liste des projets accessibles : un seul projet, ALLEMAND.
- Liste des branches : une seule branche `main`, aucun environnement de test.
- Aucun projet, aucune branche et aucune ressource supplémentaire créés.

La documentation officielle Supabase consultée le 13 novembre 2026 indique deux projets Free actifs au maximum par utilisateur Owner/Admin, tous organismes confondus ; un projet Free est à 0 USD tant que les quotas gratuits sont respectés. Les branches de développement restent une fonctionnalité Pro et ne constituent pas une solution gratuite. Sources : https://supabase.com/docs/guides/platform/billing-on-supabase et https://supabase.com/docs/guides/platform/billing-faq.

Attention : « deux projets gratuits autorisés » ne signifie pas absence absolue de limites. Chaque projet a des quotas Free, peut être mis en pause après une semaine d'inactivité, et un dépassement des quotas peut entraîner des restrictions. Aucun dépassement ou frais n'a été engagé ici. La création d'un second projet n'a pas été effectuée ; ce lot se limite à vérifier l'éligibilité et l'état actuel.

## 2. Policies RLS exactes — constats prioritaires

Extraction des définitions `pg_policies` sur les tables Messenger et profiles :

### `msg_conversations`
- INSERT « msg conv creation » : `auth.uid() = created_by` et type direct ou modérateur.
- SELECT : membre de la conversation ou modérateur.
- La policy INSERT ne requiert aucune invitation acceptée.

### `msg_members`
- INSERT « msg members ajout » : `auth.uid() = user_id` et `msg_member_ok(conversation_id, auth.uid())`.
- SELECT : membre ou modérateur.
- DELETE : l'utilisateur peut retirer sa propre appartenance ; modérateur également.
- La policy d'ajout n'exige aucun enregistrement d'invitation accepté. Elle s'appuie sur la fonction `msg_member_ok`.

### `profiles`
- SELECT : profil personnel, administrateur, profils en attente visibles par vérificateurs autorisés, profils accessibles par agents scoppés, et profils des personnes partageant une conversation.
- Les règles filtrent les lignes, mais les privilèges SELECT sur la table restent accordés au rôle authenticated ; il n'existe pas de restriction de colonnes permettant de considérer les données sensibles comme non exposables par simple SELECT autorisé. Le projet doit conserver une projection serveur minimale pour un futur annuaire national.
- UPDATE : règles personnelles et règles de vérification par administrateur/agent habilité ; triggers de garde complémentaires.

### `msg_messages`
- INSERT : auteur = auth.uid(), membre de la conversation, et fonction `msg_not_blocked`.
- SELECT : membre ou modérateur.
- UPDATE : auteur membre ou modérateur, avec contrôle USING et WITH CHECK.

### Blocages
- INSERT : seul le bloqueur peut créer son blocage.
- DELETE : seul le bloqueur peut le retirer.
- SELECT : bloqueur, bloqué ou modérateur.

## 3. Fonctions de sécurité — définitions effectives

Les fonctions suivantes sont SECURITY DEFINER, propriétaires postgres, avec search_path fixé :

- `msg_can_dm(a,b)` : exige utilisateur connecté participant à la paire, profils existants, même wilaya/niveau/filière et statut `verifie`. Aucun contrôle d'invitation ni de blocage n'est effectué dans cette fonction.
- `msg_member_ok(cid,uid)` : permet l'ajout du créateur quand la conversation directe est vide ; permet aussi l'ajout de l'autre utilisateur lorsque la conversation contient déjà un membre et que `msg_can_dm` est vrai. Aucun contrôle d'invitation acceptée.
- `msg_open_direct(p_other)` : vérifie auth, destinataire, `msg_can_dm`, prend un verrou consultatif pour la paire, retrouve un DM existant ou insère une conversation et ses deux membres. Aucun contrôle d'invitation acceptée ni appel à `msg_not_blocked`.
- `msg_not_blocked(cid,snd)` : recherche les blocages où un membre existant a bloqué l'expéditeur courant. La recherche ne couvre pas le sens inverse où l'expéditeur courant aurait bloqué un autre membre.

Les fonctions SECURITY DEFINER ont un search_path explicite, ce qui réduit le risque de résolution d'objets non fiables. Leur privilège élevé ne remplace cependant pas les contrôles métier manquants.

## 4. Risques confirmés à corriger sur un environnement isolé

1. **Consentement absent dans les chemins SQL** : INSERT direct d'une conversation et ajout de membres peuvent être autorisés sans invitation acceptée, sous réserve des conditions de compatibilité.
2. **RPC sans invitation** : `msg_open_direct` crée les deux appartenances après `msg_can_dm`, sans état d'invitation.
3. **Blocage asymétrique** : `msg_not_blocked` ne vérifie qu'un sens ; `msg_open_direct` ne vérifie aucun blocage.
4. **Annuaire national** : RLS de lignes et grants SELECT ne constituent pas une projection sûre des données personnelles ; ne pas ouvrir directement `profiles`.
5. **Pièces jointes** : la policy vérifie le propriétaire de l'enregistrement, le membre, le chemin, le MIME et la taille ; la cohérence stricte entre auteur du message et uploader doit être testée/corrigée sur la base de test.

Aucune de ces règles n'a été modifiée dans Supabase actif. Les constats sont des analyses de définition SQL, pas des tests comportementaux multi-comptes.

## 5. Correction de comptage du Lot 378

Le total exact des triggers non internes ciblés est **13**, et non 12 :
- msg_members : 1
- msg_messages : 3
- msg_attachments : 2
- msg_reports : 1
- profiles : 5
- audit_logs : 1

Le total est confirmé par une requête `count(*)` sur `pg_trigger`. Aucun trigger n'est présent dans le périmètre ciblé sur `msg_blocks` ou `msg_conversations`.

## 6. État de sécurité et limites

- Toutes les requêtes Supabase exécutées dans ce lot sont des SELECT de catalogues et définitions ; aucune ligne de profil, compte, message, conversation, pièce jointe ou journal réel n'a été lue.
- Aucun INSERT, UPDATE, DELETE, DDL, migration, GRANT ou changement Auth/RLS/Storage/Realtime.
- Aucun projet de test, branche, ressource payante ou dépense créée.
- Aucun test PostgreSQL/RLS multi-compte exécuté.
- PR #17 reste ouverte et non fusionnée ; main et production inchangées.

## 7. Prochaine étape technique

Préparer un export SQL contrôlé des définitions d'objets applicatifs à partir des catalogues (tables, colonnes, contraintes, index, fonctions, triggers, policies et ACL), en séparant explicitement les dépendances managées Auth/Storage/Realtime. Ensuite, préparer un harness de test pour le deuxième projet Free, mais ne créer ce projet qu'après confirmation explicite de sa création. Aucun service payant ne sera utilisé.
