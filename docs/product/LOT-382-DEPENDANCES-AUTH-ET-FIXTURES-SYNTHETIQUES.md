# Lot 382 — dépendances Auth et identités synthétiques Messenger

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`

## 1. Vérification du déclencheur Auth actif

Extraction en lecture seule de la définition de `public.handle_new_user()` et du trigger `auth.users.on_auth_user_created`.

Trigger actif :
`AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()`.

Corps de fonction extrait :
- insère `NEW.id` dans `public.profiles` ;
- copie `pseudo`, `niveau`, `filiere` et `wilaya` depuis `NEW.raw_user_meta_data` ;
- force le rôle initial à `eleve` ;
- si `requested_role='parent'`, crée une demande dans `public.parent_role_requests` avec statut `pending` ;
- ne donne donc pas directement le rôle parent à l'inscription.

## 2. Risque confirmé pour l'annuaire national

Les valeurs `niveau`, `filiere` et `wilaya` issues de `raw_user_meta_data` sont des données déclaratives fournies lors de l'inscription. Elles ne constituent pas une preuve indépendante d'inscription dans un lycée.

Conséquence :
- ne pas construire un annuaire national qui expose ces profils comme élèves officiellement inscrits sur la seule base de ces champs ;
- séparer vérification interne du profil et preuve d'affiliation officielle à un établissement ;
- ne pas accepter ces champs comme base d'autorisation d'un DM inter-lycées ;
- l'autorité et le référentiel officiels d'inscription restent à identifier ; aucune source officielle de rattachement élève↔lycée n'a été établie par ce lot.

## 3. Fixtures synthétiques

Fichier ajouté : `tests/messenger/LOT-382-FIXTURES-IDENTITES-SYNTHETIQUES.md`.

Il définit 11 alias synthétiques : quatre élèves vérifiés du même périmètre, un élève en attente, un rejeté, deux élèves d'autres périmètres, deux modérateurs de wilayas distinctes et un administrateur de test.

Les UUID sont réservés à l'environnement jetable. Aucun e-mail, mot de passe, token, matricule ou identifiant réel n'est inclus. Les scénarios AUTH, VER, SCOPE, DM et MOD sont spécifiés.

## 4. Tests à venir

Le prochain harness devra notamment prouver :
- qu'une demande `parent` ne confère pas le rôle parent ;
- que les métadonnées utilisateur ne permettent pas l'auto-attribution d'un rôle privilégié ;
- que les statuts en attente/rejeté ne permettent pas d'ouvrir un DM privé ;
- qu'un modérateur ne dépasse pas son périmètre de wilaya ;
- que l'absence d'invitation acceptée bloque aussi bien la RPC que les INSERT directs.

## 5. Statut exact

- Définition Auth/trigger extraite en SELECT-only : oui.
- Fixtures et scénarios documentés : oui.
- Comptes synthétiques créés : non.
- Tests exécutés : non, moteur PostgreSQL isolé indisponible.
- Projet Supabase actif modifié : non.
- Projet de test créé : non.
- Paiement : 0 USD.
- PR #17 : reste ouverte, non fusionnée ; main inchangée.
