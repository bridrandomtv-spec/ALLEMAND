# Lot 368 — pré-reconstitution du baseline PostgreSQL Messenger et disponibilité d'un moteur isolé

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : catalogue PostgreSQL actif lu en SELECT, inspection de l'environnement d'exécution et inventaire des environnements Supabase. Aucun test SQL multi-rôle n'a été exécuté.

## 1. Résultat exécutif

Le projet Supabase actif utilise **PostgreSQL 17.6**. Une nouvelle extraction SELECT des catalogues a confirmé et détaillé les objets Messenger ciblés : huit tables (sept tables Messenger et `profiles`), leurs colonnes, contraintes, index, état RLS, policies, triggers, fonctions et ACL EXECUTE.

Cette extraction améliore le baseline partiel du Lot 335, mais elle ne constitue toujours pas un dump restaurable de l'ensemble du projet. Les fonctions d'administration appelées par les règles Messenger dépendent d'autres objets (notamment `wilaya_assignments`, `admin_permissions`, `admin_role_of` et `admin_wilayas`). Supabase Auth et Storage sont des services gérés, et ne sont pas reconstitués par les seules tables applicatives.

**Conclusion : baseline catalogue Messenger plus complet, mais base locale fidèle non encore reconstituée et tests PostgreSQL multi-comptes non exécutés.**

## 2. État des migrations et branches Supabase

- L'API de migrations liste 27 versions appliquées, de `20261030131545` à `20261109210413`.
- La présence des versions et noms ne fournit pas les corps SQL historiques complets.
- L'inventaire des branches Supabase ne retourne que la branche `main), marquée `with_data=false`. Aucune branche de développement n'existe actuellement.
- La branche Supabase `main` n'est pas une cible de test : elle pointe sur le projet actif.
- Le coût retourné par Supabase pour une branche de développement est de **0,01344 USD par heure**. Il est non nul. Aucune branche n'a été créée.

## 3. Contrôle de l'environnement local disponible

Environnement d'exécution contrôlé :
- Node.js 22.16.0 disponible.
- `psql`, `postgres`, `initdb`, `pg_ctl`, Docker, Podman et Supabase CLI absents.
- Le gestionnaire de paquets local ne présente aucun paquet PostgreSQL candidat dans ses index.
- Aucun conteneur ou serveur PostgreSQL local utilisable n'a été trouvé.

Il n'existe donc pas, dans cet environnement de travail, de moteur PostgreSQL local gratuit immédiatement exécutable. Un émulateur JavaScript ou une simulation mémoire ne reproduirait pas fidèlement RLS, rôles, triggers, transactions, verrous consultatifs, SECURITY DEFINER, PostgREST/JWT ou Storage ; il ne sera pas présenté comme un test PostgreSQL.

## 4. Objets actifs confirmés par catalogue

### Tables et structure

Périmètre exporté :
- `public.msg_conversations`
- `public.msg_members`
- `public.msg_messages`
- `public.msg_attachments`
- `public.msg_blocks`
- `public.msg_reports`
- `public.msg_log`
- `public.profiles`

Les colonnes, types, valeurs par défaut, identity, NOT NULL, contraintes PK/FK/CHECK/UNIQUE et définitions d'index ont été extraits via `pg_catalog`. Les huit tables ont RLS activé ; `FORCE ROW LEVEL SECURITY` est false pour les tables inspectées. Les tests doivent donc être exécutés avec des rôles applicatifs non propriétaires, jamais en supposant qu'une session propriétaire subit RLS.

### Fonctions et dépendances

Définitions vivantes et ACL extraites pour les fonctions Messenger et les helpers associés :
- `msg_open_direct`, `msg_can_dm`, `msg_guard_direct`, `msg_member_ok`, `msg_is_member`, `msg_is_moderator`, `msg_not_blocked` ;
- triggers de journal, limite de débit, activité conversation et taille des pièces jointes ;
- guards de profil et helpers d'administration utilisés indirectement.

Les fonctions privilégiées observées sont majoritairement `SECURITY DEFINER`, détenues par `postgres`, avec configuration `search_path` explicite. Les définitions et ACL exactes doivent être conservées dans le baseline ; les réécrire à partir du seul fichier historique `supabase/msg_schema.sql` serait incorrect.

### Politiques et privilèges

Les policies RLS actives ont été extraites pour les huit tables, ainsi que les policies `storage.objects` liées au bucket `prive`. Les privilèges de table et les privilèges par colonne ont été interrogés séparément.

Les points critiques confirmés :
1. `authenticated` possède INSERT sur `msg_conversations` et `msg_members`, soumis aux policies RLS.
2. La policy `msg conv creation` autorise la création d'un DM par son créateur ; elle réserve le parcours groupe au modérateur.
3. La policy `msg members ajout` autorise l'auto-ajout lorsque `msg_member_ok` renvoie vrai.
4. `msg_member_ok` permet encore la constitution du DM sans invitation acceptée.
5. `msg_open_direct(uuid)` est `SECURITY DEFINER` et exécutable par `authenticated`; sa définition crée un DM et les deux memberships sans consulter une invitation.
6. `msg_can_dm` reste fondé sur la même wilaya, le même niveau, la même filière et `profiles.verif_statut='verifie'`, pas sur une affiliation officielle.
7. `msg_not_blocked` ne couvre qu'une direction du blocage.
8. La policy `msg att upload` vérifie l'appartenance à la conversation et l'uploader courant, mais ne lie pas explicitement l'uploader à `msg_messages.sender_id`.
9. Le bucket `prive` est privé ; ses paramètres globaux `file_size_limit` et `allowed_mime_types` sont NULL. Les limites MIME/taille sont dans les policies/contrôles SQL et metadata.
10. La publication Realtime inclut `msg_conversations` et `msg_messages`.

## 5. Pourquoi aucun test multi-compte n'a encore été lancé

Pour être probant, le test doit reproduire :
- rôles `anon`, `authenticated`, `service_role` et propriétaire séparés ;
- `auth.uid()` et claims JWT de test, sans utiliser de vrais comptes ;
- schémas/fonctions Auth nécessaires et dépendances des helpers admin ;
- RLS, policies permissives cumulées, ACL table/colonnes, triggers et fonctions SECURITY DEFINER ;
- verrous transactionnels et tests avec deux sessions simultanées ;
- un stockage privé de test ou une simulation explicitement limitée aux politiques SQL, sans prétendre tester l'API Storage gérée.

Un simple `SET ROLE` sans initialiser correctement les claims Auth ne suffit pas. Exécuter les scénarios comme propriétaire masquerait les défauts RLS.

## 6. Matrice de tests à exécuter sur l'instance isolée

| Acteur synthétique | Action | Résultat attendu |
|---|---|---|
| Élève A | RPC `msg_open_direct(B)` sans invitation | Échec |
| Élève A | INSERT direct d'une conversation direct | Échec |
| Élève B | Auto-ajout dans un DM créé par A sans invitation | Échec |
| Élève A | Lire un DM sans être membre | Zéro ligne / refus |
| Élève C | Lire/envoyer dans le DM A-B | Refus |
| Élève A et B | Ouvrir un DM historique partagé | Autorisé selon règles de compatibilité |
| Modérateur habilité | Créer un groupe officiel | Autorisé selon périmètre |
| Élève ordinaire | Créer un groupe officiel | Échec |
| Élève A | Envoyer après blocage A→B ou B→A | Refus dans les deux sens si la règle bilatérale est retenue |
| Élève A | Joindre un fichier au message d'un autre membre | Refus |
| Deux sessions A/B | Créer/ouvrir simultanément le même DM | Une seule conversation, aucun membre en double |
| Élève non membre | Lire message, pièce jointe ou URL signée | Refus |

Les résultats attendus constituent le plan de test ; aucun résultat n'est revendiqué comme exécuté.

## 7. Prochaine décision d'environnement

Deux voies seulement sont actuellement établies :

1. **Environnement local gratuit :** installer ou fournir un moteur PostgreSQL 17 et les outils CLI dans un environnement contrôlé. L'environnement ChatGPT courant ne les possède pas et son index apt ne fournit pas de paquet ; aucun accès réseau système n'est disponible ici.
2. **Branche Supabase isolée :** prix retourné de 0,01344 USD/heure, hors éventuelles autres consommations. Il faut une autorisation explicite avant création. Une branche neuve est annoncée `with_data=false` ; elle ne copie pas les données de production. Les migrations appliquées ne suffisent pas à garantir qu'elle reproduira le drift actif constaté : le baseline vivant doit être appliqué/validé sur la branche avant tests.

Aucune ressource payante n'a été créée. Aucune migration n'a été appliquée.

## 8. Garde-fous et décision

- SELECT catalogue uniquement sur Supabase actif ; aucun profil, message, conversation, fichier ou donnée nominative lu.
- Aucun DDL, INSERT, UPDATE, DELETE, migration ou changement Auth/RLS/GRANT/Storage/Realtime.
- Aucun environnement PostgreSQL ou Supabase de test créé.
- Aucun changement sur `main), aucune fusion PR #17, aucun déploiement Cloudflare.

**GO :** poursuivre la préparation du baseline documentaire reproductible et du jeu de tests synthétiques.  
**NO-GO :** déclarer le baseline restaurable, prétendre que les tests PostgreSQL ont réussi, ou appliquer une migration de sécurisation avant exécution sur un vrai moteur isolé.
