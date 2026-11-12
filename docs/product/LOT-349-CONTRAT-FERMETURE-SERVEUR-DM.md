# LOT 349 — Contrat de fermeture serveur des DM sans invitation

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : spécification consolidée et critères de tests ; aucune modification runtime ou Supabase.

## 1. Décision

**NO-GO pour l'ouverture nationale des DM tant que les trois voies de création sans consentement ne sont pas fermées et testées côté serveur.**

Le client ne crée plus de nouveau DM depuis `msgOpenDirect()`, mais cela ne constitue pas une frontière de sécurité. Le lot 348 a confirmé trois voies toujours ouvertes dans la base active :
1. RPC `msg_open_direct(uuid)` exécutable par `authenticated` ;
2. INSERT direct dans `msg_conversations` pour un DM créé par l'utilisateur ;
3. auto-ajout du second membre via `msg_member_ok`, sans invitation acceptée.

La définition vivante de `msg_member_ok` est plus stricte que le fichier `supabase/msg_schema.sql`. Toute migration future doit partir d'une baseline vérifiée, jamais d'une réapplication aveugle du fichier de schéma.

## 2. Machine d'états normative

États d'invitation :
- `pending` : créée, réponse attendue ;
- `accepted` : acceptée par le destinataire, ouverture DM transactionnelle effectuée ;
- `declined` : refusée par le destinataire ;
- `cancelled` : annulée par l'expéditeur avant décision ;
- `expired` : délai dépassé, constaté par l'horloge PostgreSQL.

Le blocage n'est **pas** un état d'invitation. Il reste une relation indépendante dans `msg_blocks`. Un blocage peut rendre une invitation impossible ou empêcher son acceptation, sans réécrire artificiellement l'historique de ses états.

Transitions autorisées :
- création → `pending` ;
- `pending` → `accepted`, uniquement par le destinataire ;
- `pending` → `declined`, uniquement par le destinataire ;
- `pending` → `cancelled`, uniquement par l'expéditeur ;
- `pending` → `expired`, par opération serveur selon l'heure DB.

Aucune transition depuis un état terminal. Un nouvel essai après refus/annulation/expiration doit être une nouvelle invitation, soumis aux limites anti-abus. Une acceptation ne peut jamais être produite par l'expéditeur, un tiers ou un paramètre fourni par le navigateur.

## 3. Création d'invitation

Opération cible : `msg_invite_create(recipient_id, idempotency_key)`.

Le serveur doit :
- établir l'expéditeur avec `auth.uid()`, jamais avec un `sender_id` fourni par le client ;
- refuser l'auto-invitation ;
- vérifier que les deux comptes sont actifs et autorisés ;
- exiger une affiliation scolaire officielle, vérifiée, active pour l'année scolaire en cours et issue d'une source institutionnelle approuvée ;
- exiger que le destinataire ait choisi d'être visible dans l'annuaire national ;
- appliquer la règle nationale inter-wilayas : la wilaya commune n'est pas une condition ;
- vérifier les blocages dans les deux sens ;
- appliquer une limite de fréquence et empêcher les invitations répétitives/spam ;
- garantir l'idempotence des retries réseau.

Unicité recommandée : une seule invitation `pending` pour une paire non ordonnée de comptes. Si A et B s'invitent simultanément, sérialiser la paire et retourner une invitation canonique ; ne jamais créer deux invitations concurrentes ni deux DM. La clé d'idempotence est liée à l'identité authentifiée et à la requête normalisée ; son rejeu avec un destinataire différent est rejeté.

Les réponses externes aux destinataires non découvrables, bloqués ou non éligibles doivent limiter l'énumération de comptes. Les détails de vérification ne sont jamais révélés à l'expéditeur.

## 4. Acceptation transactionnelle — unique porte d'entrée pour un nouveau DM

Opération cible : `msg_direct_open_from_accepted_invite(invite_id)`.

Dans une seule transaction PostgreSQL :
1. verrouiller l'invitation (`FOR UPDATE`) ;
2. vérifier `auth.uid() = recipient_id` ;
3. vérifier l'état `pending` et l'expiration avec l'horloge DB ;
4. revalider les deux comptes et leurs affiliations institutionnelles actives ;
5. revalider le consentement annuaire requis et les blocages A→B **et** B→A ;
6. prendre un verrou transactionnel de paire, avec ordre stable des UUID ;
7. rechercher un DM existant exact pour les deux mêmes membres ;
8. si aucun DM compatible n'existe, créer la conversation directe par un helper privé non exécutable par les clients ;
9. créer les deux memberships dans la même transaction ;
10. vérifier exactement deux membres distincts, ni plus ni moins ;
11. lier l'invitation à la conversation et la marquer `accepted` ;
12. écrire un événement d'audit append-only ;
13. commit.

Toute erreur avant commit annule l'ensemble : pas de conversation orpheline, pas de membership partiel, pas d'invitation acceptée sans DM correspondant.

La fonction publique vérifie elle-même l'identité, les droits, l'état et les conditions. Un helper interne ne doit pas être exécutable par `PUBLIC`, `anon` ou `authenticated`. Les privilèges EXECUTE, le propriétaire, `SECURITY DEFINER` et `search_path` doivent être explicitement audités. Ne jamais faire confiance à un simple appel depuis l'interface.

### DM historique déjà existant

Si un DM exact existe déjà, ne pas en créer un second. Le contrat doit retourner/réutiliser ce DM uniquement après vérification de ses deux memberships et de son état. L'invitation peut être liée au DM existant et auditée comme consentement actuel ; aucune invitation fictive rétroactive n'est créée pour les conversations anciennes.

Les conversations historiques à 0, 1 ou plus de 2 membres doivent être mises en quarantaine de migration et examinées séparément. Aucune suppression, conversion silencieuse ou réparation automatique.

## 5. Fermeture des trois voies de contournement

### 5.1 RPC historique `msg_open_direct(uuid)`

- Retirer l'exécution client `authenticated` après inventaire exhaustif de ses appelants et dépendances.
- Vérifier aussi les grants hérités `PUBLIC`, `anon` et les wrappers RPC éventuels.
- Ne pas conserver un helper générique acceptant librement deux identifiants utilisateur.
- Ne pas révoquer aveuglément `service_role` ou casser des traitements internes : inventorier leurs usages, puis réserver toute opération interne à un chemin contrôlé non exposé au navigateur.
- Après retrait, tester l'appel RPC direct par PostgREST avec un JWT élève : refus.

### 5.2 INSERT direct `msg_conversations`

- Refuser à `authenticated` tout INSERT de type `direct`.
- Les INSERT de groupes doivent rester sur leur autorisation distincte de modération et être testés séparément.
- Ne pas accorder un droit global de création au motif qu'un utilisateur est membre ou créateur.

### 5.3 INSERT direct `msg_members`

- Refuser l'auto-ajout client dans une conversation directe, y compris si l'utilisateur connaît l'UUID.
- Les deux memberships d'un nouveau DM sont créés exclusivement dans la transaction d'acceptation.
- Maintenir séparément les règles de groupes et leur gestion par les rôles habilités.
- Vérifier qu'aucune policy permissive parallèle ne réautorise l'insertion.

Un trigger de cohérence est une défense supplémentaire, pas un substitut à RLS/GRANT et à la validation de la RPC. Il doit distinguer le chemin contrôlé d'acceptation et les conversations historiques.

## 6. Blocage bilatéral et comportement après ouverture

Règle normative pour les nouveaux contacts :
- si A bloque B, A ne peut pas inviter B et B ne peut pas inviter A ;
- si B bloque A, la même interdiction s'applique ;
- le contrôle est refait au moment de l'acceptation, sous verrou transactionnel ;
- une course blocage/acceptation est sérialisée : si le blocage est effectif avant la décision d'acceptation, aucun nouveau DM n'est créé.

Pour un DM historique, le blocage ne supprime ni la conversation ni les messages passés. Il doit empêcher les nouveaux envois entre les deux comptes selon une règle serveur symétrique, tout en préservant l'accès à l'historique et au signalement. Les règles exactes de visibilité et de notification doivent être testées avant migration ; ne pas déduire une sémantique bilatérale de la fonction actuelle `msg_not_blocked`, qui a été observée comme directionnelle.

## 7. Affiliation scolaire et portée nationale

`profiles.verif_statut='verifie'`, matricule, section, niveau, filière ou wilaya déclarés ne sont pas une preuve d'inscription officielle.

L'éligibilité nationale doit dépendre d'une affiliation canonique rattachée à :
- un établissement identifié par une source institutionnelle approuvée ;
- un élève dont le lien d'identité a été vérifié selon le processus autorisé ;
- une année scolaire déterminée ;
- un statut actif et non révoqué ;
- une décision et une provenance auditables.

Un transfert clôt l'affiliation précédente avant activation de la nouvelle, selon la transaction métier. Une source révoquée, une affiliation expirée, en attente ou transférée ne donne pas accès à l'annuaire national. Le contrôle doit être fait à la recherche, à l'invitation et à l'acceptation.

## 8. Compatibilité : groupes, fichiers et modération

- Les groupes ne passent pas par les invitations DM individuelles.
- Conserver les groupes historiques et leurs règles transitoires ; ne pas auto-ajouter les membres sur la base de profils déclaratifs.
- Préserver messages, pièces jointes, signalements et journaux.
- Rejouer les tests Storage et Realtime après fermeture des INSERT DM.
- L'upload et les métadonnées restent deux autorisations distinctes ; l'audit binaire/antivirus et la vérification que l'uploader est l'auteur du message sont des sujets séparés, non résolus par ce lot.
- Ne pas modifier `msg_messages.attachment_id` ni ajouter/supprimer de FK sans audit d'usage complet.

## 9. Tests d'intégration obligatoires avant migration

Tous les tests doivent être exécutés sur PostgreSQL isolé, avec JWT et sessions distincts, jamais sur le projet Supabase actif.

| ID | Scénario | Résultat attendu |
|---|---|---|
| INV-01 | A invite B éligible d'une autre wilaya | pending autorisée |
| INV-02 | A s'invite lui-même | refus |
| INV-03 | A et B s'invitent simultanément | une seule invitation canonique |
| INV-04 | retry avec même clé | même résultat, aucun doublon |
| INV-05 | même clé, autre destinataire | rejet |
| INV-06 | tiers C répond à l'invitation | refus |
| INV-07 | expéditeur A accepte sa propre invitation | refus |
| INV-08 | destinataire B refuse | declined, aucun DM |
| INV-09 | expéditeur A annule pending | cancelled, aucune acceptation ultérieure |
| INV-10 | expiration dépassée | expired, aucun DM |
| INV-11 | double acceptation concurrente | un DM, deux membres |
| INV-12 | erreur entre création conversation et membership | rollback intégral |
| INV-13 | affiliation révoquée après invitation | acceptation refusée |
| INV-14 | compte suspendu/supprimé | acceptation refusée |
| BLK-01 | blocage A→B avant invitation | refus |
| BLK-02 | blocage B→A avant invitation | refus |
| BLK-03 | blocage concurrent avec acceptation | résultat sérialisé, aucun DM si blocage préalable |
| RPC-01 | appel direct à `msg_open_direct` par authenticated | refus |
| RPC-02 | tentative d'appeler le helper interne | refus |
| RLS-01 | INSERT direct conversation direct | refus |
| RLS-02 | auto-ajout membre direct | refus |
| RLS-03 | création groupe par rôle autorisé | comportement conservé |
| HIST-01 | DM historique exact à deux membres | historique conservé, pas de doublon |
| HIST-02 | conversation historique à 0/1/3+ membres | isolée pour revue, aucune réparation silencieuse |
| AFF-01 | profil déclaré vérifié sans affiliation officielle | annuaire et invitation refusés |
| AFF-02 | affiliation active, source approuvée, opt-in | découverte nationale minimale autorisée |
| AFF-03 | affiliation expirée/révoquée/opt-out | non découvrable |
| REG-01 | envoi message après blocage | refus bilatéral selon règle validée |
| REG-02 | Realtime des nouveaux DM | seuls les deux membres autorisés reçoivent |
| REG-03 | pièces jointes et signalements | comportements historiques conservés |

Les tests statiques Node restent utiles mais ne remplacent pas ces tests SQL/RLS/PostgREST et courses multi-sessions.

## 10. Ordre de migration futur et critères GO

1. Obtenir une baseline SQL reproductible et documenter la dérive dépôt/base.
2. Construire PostgreSQL isolé sans coût de service externe et charger uniquement des données synthétiques.
3. Écrire les tests d'échec RPC/INSERT/RLS avant la migration.
4. Implémenter table et transitions d'invitations, audit et RPC transactionnelle dans une migration versionnée.
5. Fermer les trois voies de contournement dans la même livraison cohérente, après preuve des dépendances.
6. Tester concurrence, blocs bilatéraux, affiliation, historique, groupes, Storage et Realtime.
7. Faire consommer les opérations serveur par le client, puis vérifier les parcours réels avec plusieurs comptes.
8. Obtenir une revue indépendante des policies, grants, fonctions SECURITY DEFINER et logs.
9. N'appliquer au projet Supabase actif qu'après autorisation explicite et plan de retour arrière validé.

GO uniquement si tous les tests critiques passent, si aucun INSERT/RPC alternatif ne crée un DM sans consentement, si les données historiques sont préservées et si l'affiliation officielle est effectivement raccordée. Avant cela, le Messenger reste un prototype fonctionnel partiel, pas un Messenger national prêt à ouvrir.

## 11. État d'exécution et limites de ce lot

- Rapport de conception uniquement ; aucun code runtime modifié.
- Aucune écriture SQL/DDL, migration, policy, GRANT, Auth, Storage ou Realtime dans Supabase actif.
- Aucun compte ou contenu personnel lu.
- Aucun environnement payant, branche Supabase ou ressource cloud créée.
- Aucun déploiement Cloudflare.
- Aucun changement direct sur `main`, aucun merge ni fermeture de PR #17.
- MFA/2FA et facturation hors périmètre.
- CI #3230 : `success` sur HEAD `fe017a397f5e5d225532c6f5e3b13561003744d5`.
- PR #17 : ouverte, non fusionnée, fusionnable au contrôle du 12 novembre 2026.
