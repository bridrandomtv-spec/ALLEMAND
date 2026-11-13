# Lot 376 — frontière entre Auth managé et profils Messenger

Date : 13 novembre 2026  
Source : catalogues PostgreSQL Supabase actif, SELECT uniquement. Aucune ligne de auth.users, auth.identities, auth.sessions ou Storage consultée.

## 1. Structures Auth observées

Les colonnes de métadonnées des tables managées suivantes ont été extraites via information_schema :
- auth.users : identifiant, email/téléphone, état de confirmation, métadonnées user/app, bannissement, suppression, compte anonyme et champs de session.
- auth.identities : provider_id, user_id, identity_data, provider et timestamps.
- auth.sessions : user_id, niveau AAL, expiration, user-agent, IP, OAuth client, scopes et compteurs de refresh.
- auth.refresh_tokens et auth.instances : structure de support des sessions/instances.
- storage.buckets et storage.objects : métadonnées, propriétaires, chemin, version et contrôle de lifecycle.

Ces objets sont gérés par Supabase. Leur inventaire sert à définir la frontière de dépendance ; il ne faut pas recopier leurs schémas internes dans une migration applicative ALLEMAND ni importer de vrais utilisateurs/tokens.

## 2. Trigger de création de profil

Le trigger actif auth.users.on_auth_user_created appelle public.handle_new_user() après INSERT.

La fonction SECURITY DEFINER crée le profil public correspondant et copie depuis raw_user_meta_data : pseudo, niveau, filière et wilaya ; le rôle initial est forcé à eleve. Si requested_role vaut parent, elle crée une demande parent en attente.

Point de sécurité : raw_user_meta_data est contrôlé par l'utilisateur et ne doit pas être considéré comme une source d'autorisation. Les valeurs niveau/filière/wilaya sont donc déclaratives à la création. Elles ne prouvent ni l'inscription scolaire ni l'affiliation à un lycée. Le statut de vérification doit rester non vérifié par défaut, et toute élévation doit passer par le garde de modération du Lot 374.

## 3. Dépendances Storage managées

Les triggers observés sur storage.buckets et storage.objects incluent les protections de nom de bucket, versioning, lifecycle, suppression via API et mise à jour de timestamp. Certaines fonctions sont SECURITY DEFINER ou dépendent de rôles internes Storage.

Conséquence : une restauration PostgreSQL générique peut reproduire les policies applicatives et les expressions de chemins, mais elle ne reproduit pas le service Storage, les fichiers, les URL signées, les règles lifecycle ou les garanties de l'API. Ces comportements devront faire l'objet de tests intégrés distincts sur un projet de test isolé si celui-ci est explicitement autorisé.

## 4. Conséquences pour le baseline

Séparer trois couches :
1. Schéma applicatif ALLEMAND : tables Messenger, profiles, dépendances admin, contraintes, index, fonctions et triggers applicatifs.
2. Contrat Auth : utilisateurs synthétiques uniquement, claims JWT de test, auth.uid()/jwt()/role() et trigger de création de profil si l'environnement le permet.
3. Services Supabase managés : Auth complet, Storage API, Realtime et rôles internes. Ne pas prétendre les reconstituer avec un simple PostgreSQL local.

Aucune donnée de production ne doit être exportée. Les comptes tests doivent être créés avec des UUID et emails synthétiques, sans mots de passe ou tokens provenant de comptes réels.

## 5. Scénarios de tests supplémentaires

- Création Auth synthétique : vérifier qu'un profil eleve est créé et qu'un requested_role=parent ne devient qu'une demande pending.
- Métadonnées malicieuses : wilaya/niveau/filière arbitraires restent des données déclaratives et n'accordent aucune vérification ni rôle privilégié.
- Vérification : aucun raw_user_meta_data ne peut définir verif_statut=verifie ou verif_by.
- Suspension/compte supprimé : définir explicitement les règles de refus Messenger lorsque le compte est banni, supprimé ou désactivé ; ne pas supposer que le seul statut de profil suffit.
- Storage : séparer tests SQL des policies et tests de service/API pour upload, download, URL signée, lifecycle et suppression.

## 6. État et limites

- Inventaire des colonnes Auth/Storage et triggers Auth/Storage effectué en lecture seule.
- Aucune ligne de compte, identité, session, refresh token, bucket ou objet consultée.
- Aucun test Auth/Storage/Reatime exécuté.
- Aucun DDL, écriture, migration, changement Auth/RLS/GRANT/Storage/Realtime.
- Aucun projet de test créé, aucun coût engagé.
- PR #17 reste ouverte et non fusionnée ; main et production inchangées.
