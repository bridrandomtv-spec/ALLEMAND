# Lot 331 — contrat de confidentialité des profils et d'invitations Messenger

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : audit du code + conception de contrat + matrice de tests. **Aucune migration ni modification de Supabase actif.**

## 1. État CI et PR avant le lot

- CI #3199 : `success`, run 43306687172, commit testé `161ba65d94143389061b0ced761359848c4edfee`.
- PR #17 : ouverte, `merged=false`, `mergeable=true`, `mergeable_state=clean`.
- HEAD déclaré par l'API PR au contrôle : `972a1e2709fd36194273aba09b74e514c27fdfb5`.
- La PR #17 reste non fusionnée. Aucun changement sur `main`.

## 2. Revue des usages réels du profil dans le client

Fichiers relus sur la branche :
- `supabase/supabase.js` (blob `17619f1ae4b5aaf947bda4abf138f4f9a15f33f9`)
- `msg.js` (blob `54af377a5dd52334ce324558589caa166e3b3b11`)
- `admin.js` (blob `40441321dceb0308591456d928011cfcf43efe78`)

Usages constatés :
1. `listProfiles()` fait `profiles.select('*')`. Dans le code relu, son appel visible est dans `admin.js` : le panneau admin filtre ensuite les lignes par rôle. Le contrôle du rôle admin dans la page est côté client ; il ne doit jamais être le contrôle de sécurité de l'API.
2. `myProfile()` fait également `select('*')` mais limite la ligne à `auth.uid()`. À remplacer idéalement par une projection personnelle explicitement énumérée, en gardant uniquement les champs réellement nécessaires au profil connecté.
3. `msg.js` résout les noms des participants avec `select('id,pseudo,role,niveau')`. Le rôle n'est pas nécessaire à l'affichage d'un nom de participant ; cible minimale proposée : `id,pseudo,niveau`, ou une RPC d'annuaire qui retourne uniquement ces champs.
4. Le flux de vérification actuel lit explicitement `verif_statut,matricule,section` pour le compte courant, puis écrit une demande en attente. La file de revue lit `id,pseudo,role,niveau,filiere,wilaya,matricule,section,created_at`, puis met à jour le statut, l'identifiant du vérificateur et la date.
5. L'administration utilise aussi une projection déjà plus restreinte dans `admListProfiles()` : `id,pseudo,role,niveau,wilaya`, limitée à 200 lignes. Les vues admin associent ces champs à l'affectation des agents.
6. D'autres relations administratives embarquent `profiles(pseudo,wilaya)` ou lisent `id,pseudo,wilaya` pour afficher les paiements/support. Elles ne justifient pas un SELECT général sur toutes les colonnes.

**Conclusion :** supprimer `listProfiles()` ou réduire globalement la réponse sans inventorier ses consommateurs casserait le panneau d'administration. La correction doit remplacer chaque besoin par une opération à privilèges et une projection dédiées, sans laisser un SELECT générique sur `profiles`.

## 3. Contrat cible de confidentialité

### 3.1 Principe

- Aucune lecture générale de `profiles.*` par le rôle `authenticated`.
- RLS reste une barrière de lignes ; les privilèges de colonnes et les RPC définissent séparément les champs lisibles.
- Aucun matricule, numéro d'inscription, section, email, téléphone, statut ou preuve de vérification, identifiant de vérificateur, note administrative ou historique de décision dans l'annuaire Messenger.
- La visibilité nationale est facultative, désactivable et limitée aux élèves ayant une affiliation institutionnelle active pour l'année scolaire courante.
- Le profil privé du compte ne doit être accessible qu'à son propriétaire et aux rôles administratifs expressément autorisés pour une finalité déterminée.

### 3.2 Surfaces de lecture à séparer

| Surface | Opération cible | Projection minimale |
|---|---|---|
| Profil personnel | `profile_me()` ou SELECT strict limité à `auth.uid()` | champs de profil personnel nécessaires, jamais les secrets de vérification inutiles |
| Résolution du nom dans un fil | `msg_member_labels(ids)` | `id, pseudo, niveau` |
| Annuaire Messenger | `msg_directory_search(query, cursor, limit)` | identifiant opaque, pseudo public, niveau/filière si utiles, établissement public uniquement si l'élève l'a autorisé |
| File de vérification | `registry_verification_queue(...)` | données nominatives et matricule seulement pour vérificateurs habilités et dans leur périmètre |
| Administration des comptes | `admin_profiles_search(...)` | champs nécessaires à la tâche, pagination, contrôle serveur du rôle et du périmètre |
| Paiements / support | RPC ou vues dédiées | pseudo et wilaya strictement nécessaires, pas d'accès transversal à `profiles.*` |

Les noms ci-dessus sont des contrats proposés, pas des fonctions existantes.

### 3.3 Autorisation côté serveur

- Les RPC privilégiées doivent être `SECURITY DEFINER` uniquement si nécessaire, avec `search_path = ''`, références qualifiées, paramètres validés et ACL explicites.
- Vérifier `auth.uid()` dans la fonction et déterminer les permissions depuis des tables d'habilitation côté serveur ; ne jamais accepter un rôle ou un périmètre transmis librement par le navigateur.
- Pour les opérations de vérification, vérifier le périmètre établissement/DEW et la validité de la source institutionnelle à l'instant de la décision.
- Si une vue est retenue, préférer `security_invoker = true` et tester les droits effectifs sous `authenticated`. Une vue SECURITY DEFINER ou un propriétaire contournant RLS ne doit pas être introduit sans revue ACL/RLS dédiée.
- Les colonnes sensibles doivent être retirées des privilèges généraux et exposées seulement par les RPC de finalité appropriée. La migration devra d'abord vérifier les dépendances des clients, fonctions, vues et relations PostgREST.

## 4. Contrat cible d'invitation DM

### 4.1 États et transitions

États : `pending`, `accepted`, `declined`, `cancelled`, `expired`.

- Création : l'expéditeur authentifié crée une invitation vers un destinataire distinct, éligible, non bloqué et visible dans l'annuaire.
- Acceptation/refus : seul le destinataire peut répondre à une invitation `pending), avant expiration.
- Annulation : seul l'expéditeur peut annuler une invitation encore `pending`.
- Expiration : traitée côté serveur ; une invitation expirée ne peut plus être acceptée.
- Rejeu : chaque commande porte une clé d'idempotence ; la répétition retourne le résultat déjà produit, sans seconde conversation ni seconde adhésion.
- Acceptation atomique : transition de l'invitation, création/récupération du DM et insertion exacte des deux membres dans une seule transaction.
- Un DM existant reste utilisable selon ses règles historiques ; aucune invitation acceptée fictive ne doit être créée rétroactivement.

### 4.2 Opérations serveur proposées

- `msg_invite_create(recipient_id, idempotency_key)`
- `msg_invite_inbox(cursor, limit)`
- `msg_invite_outbox(cursor, limit)`
- `msg_invite_respond(invite_id, decision, idempotency_key)`
- `msg_invite_cancel(invite_id, idempotency_key)`
- `msg_invite_expire_due()` (service/cron avec privilèges restreints)
- `msg_direct_open_existing(other_user_id)` pour retrouver uniquement un DM déjà partagé ; ne crée jamais un nouveau DM.

Aucune opération `msg_open_direct` accessible à `authenticated` ne doit permettre de créer un nouveau DM en contournant l'acceptation. Les INSERT directs dans `msg_conversations` de type direct et dans `msg_members` doivent être refusés au rôle client, sauf voie serveur explicitement contrôlée. Les groupes officiels doivent conserver un parcours distinct.

### 4.3 Verrous et contraintes transactionnelles

- Verrouiller l'invitation ciblée `FOR UPDATE` ; vérifier destinataire, état, expiration et idempotence après acquisition du verrou.
- Verrouiller la paire d'utilisateurs de façon déterministe (UUID triés, advisory transaction lock déjà utilisé par le DM existant, ou mécanisme équivalent).
- Vérifier une affiliation active et une visibilité annuaire à l'instant de l'acceptation, pas seulement à la création de l'invitation.
- Vérifier le blocage dans les deux sens avant et pendant l'acceptation.
- Garantir une seule conversation directe par paire et exactement deux membres distincts.
- Écrire un événement d'audit minimal (acteur, action, cible, horodatage, résultat), sans recopier de données personnelles inutiles.
- Éviter les courses entre révocation d'affiliation, blocage, expiration et acceptation par un ordre de verrouillage documenté et constant.

## 5. Matrice d'intégration à exécuter sur PostgreSQL jetable

Aucun de ces tests n'est déclaré exécuté dans ce lot. Ils doivent être joués avec deux sessions SQL distinctes et des rôles JWT simulés, sur une base jetable créée depuis les migrations retenues.

| Test | Session A | Session B / contrôle | Résultat attendu |
|---|---|---|---|
| DM sans invitation | appelle l'ancienne RPC | — | refus serveur |
| INSERT direct | insère conversation direct | — | refus RLS/ACL |
| Auto-adhésion | s'ajoute comme membre DM | — | refus |
| Invitation | crée invitation | destinataire voit l'inbox | une invitation pending |
| Mauvais acteur | expéditeur tente d'accepter | — | refus |
| Refus | destinataire refuse | expéditeur consulte | declined, aucun DM |
| Annulation | expéditeur annule | destinataire tente ensuite d'accepter | cancelled, refus |
| Expiration | invitation arrive à échéance | destinataire tente d'accepter | expired, aucun DM |
| Double acceptation concurrente | accepte en session A | accepte simultanément en B | un DM, deux membres, résultat idempotent |
| Rejeu réseau | rejoue la même clé | — | même résultat, aucun doublon |
| Blocage unilatéral | A bloque B | B invite A | refus selon règle bilatérale |
| Blocage concurrent | A bloque pendant acceptation | B accepte simultanément | ordre sérialisé, aucun DM si blocage gagne |
| Transfert scolaire | source affiliation révoquée/transférée | acceptation simultanée | refus si affiliation non active |
| DM historique | utilisateur ouvre un DM antérieur | aucune invitation ajoutée | accès conservé selon politique de compatibilité |
| Annuaire | élève opt-in avec affiliation active | autre élève cherche | projection minimale seulement |
| Annuaire opt-out | élève désactive visibilité | autre élève cherche | aucune ligne |
| Annuaire affiliation expirée | affiliation année précédente | autre élève cherche | aucune ligne |
| Confidentialité colonnes | rôle authenticated tente matricule/section/verif_by | — | permission refusée |
| File de vérification | élève ordinaire appelle RPC | vérificateur autorisé appelle dans son périmètre | refus / projection restreinte |
| Administration | non-admin appelle recherche admin | admin autorisé appelle | refus / résultats paginés dans le périmètre |

Pour les tests concurrents, conserver les deux connexions ouvertes, synchroniser le point de départ, puis vérifier l'état final après commit/rollback des deux transactions. Un test séquentiel ne prouve pas l'absence de race.

## 6. Ordre de livraison recommandé

1. Capturer les ACL, politiques, vues, fonctions, triggers et consommateurs exacts juste avant migration.
2. Livrer d'abord les tests négatifs de confidentialité et de création directe DM dans une base jetable.
3. Introduire les RPC de lecture minimales et remplacer les consommateurs clients ; vérifier l'admin, la vérification, les paiements/support et les noms de participants.
4. Retirer les SELECT généraux et INSERT directs au niveau SQL seulement après validation de tous les consommateurs.
5. Introduire les invitations transactionnelles et leur matrice multi-session.
6. Faire valider les preuves d'affiliation institutionnelle avant d'élargir le DM inter-wilayas.
7. Rejouer les tests de régression groupes, DM historiques, fichiers privés, Realtime et modération.

## 7. Critères NO-GO

- Une colonne privée reste lisible par `authenticated` sans finalité dédiée.
- Un utilisateur peut ouvrir un nouveau DM sans acceptation.
- Un destinataire peut être ajouté à un DM sans consentement.
- Deux acceptations concurrentes créent des conversations ou adhésions en double.
- L'annuaire expose un élève opt-out, sans affiliation active, ou des données de vérification.
- Une révocation d'affiliation ou un blocage peut être contourné par une course.
- Les tests sont uniquement statiques ou séquentiels alors que le contrat dépend de concurrence PostgreSQL.

## 8. Limites et changements réellement effectués

- Audit de code uniquement ; aucun compte, message, matricule ou dossier individuel n'a été lu.
- Le schéma actif reste inchangé : aucune migration, DDL, modification RLS/GRANT/Auth/Storage, écriture SQL ou suppression MFA.
- Aucun code d'application ni SQL exécutable n'a été modifié dans ce lot ; ce document est une spécification et une matrice de tests.
- Aucun déploiement Cloudflare, aucun changement sur `main), aucune fusion de PR #17.
- Pas de MFA/2FA et pas de facturation.
