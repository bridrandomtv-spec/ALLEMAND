# LOT 340 — Plan de tests fonctionnels multi-comptes du Messenger national

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : plan de tests exécutable à préparer pour un PostgreSQL jetable ; aucun compte réel, aucune migration, aucun SQL appliqué.

## 1. Contrôle préalable

- CI #3213 : `success`, run [43313195696](https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43313195696), commit `44f3bf3e3dc9820e6ca881ba814f60bca4a90d32`.
- CI #3212 : `success`, run [43312993874](https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43312993874).
- PR #17 : ouverte, non fusionnée, fusionnable ; aucun changement `main`.

## 2. Objectif et principe de test

Valider que l'autorisation est décidée côté PostgreSQL à partir de l'identité authentifiée, et non à partir des paramètres du navigateur. La suite doit tester les accès par PostgREST/RPC sous des JWT de rôles distincts, et les courses par plusieurs sessions PostgreSQL.

Les tests ne doivent jamais utiliser le projet Supabase actif comme banc d'essai. L'environnement requis est un PostgreSQL isolé jetable, avec schéma et migrations reproductibles, comptes synthétiques et données réinitialisables.

## 3. Identités synthétiques

| Identifiant | Rôle de test | Établissement / périmètre | But |
|---|---|---|---|
| `SYN-STU-A1` | Élève | Établissement A, wilaya A | Demande, annuaire, groupes |
| `SYN-STU-A2` | Élève | Établissement A, wilaya A | Deuxième élève même établissement |
| `SYN-STU-B1` | Élève | Établissement B, wilaya B | Vérifier le parcours inter-wilayas |
| `SYN-STU-NO-AFF` | Élève | Aucune affiliation officielle | Vérifier refus d'éligibilité |
| `SYN-STU-OPT-OUT` | Élève | Affiliation active, annuaire désactivé | Vérifier le consentement |
| `SYN-VER-A` | Vérificateur scolaire | Établissement A seulement | Vérification limitée à A |
| `SYN-VER-B` | Vérificateur scolaire | Établissement B seulement | Refus hors périmètre |
| `SYN-MOD-A` | Modérateur | Périmètre de modération A | Signalements et modération |
| `SYN-ADMIN` | Administrateur | Autorisations administratives explicites | Parcours admin séparé |
| `SYN-OUTSIDER` | Compte authentifié sans relation | Aucun groupe/DM partagé | Tests d'accès refusé |

Tous les identifiants, noms, écoles, matricules et contenus sont synthétiques. Les tests ne doivent pas utiliser de vraies données d'élèves.

## 4. Préconditions d'environnement

Avant d'écrire les tests d'intégration :
1. Obtenir la chaîne SQL complète et versionnée de construction du schéma réellement attendu. Le fichier `supabase/msg_schema.sql` seul n'est pas considéré comme historique complet.
2. Définir une base PostgreSQL isolée, sans liaison au projet actif ni secrets de production.
3. Installer le schéma dans un ordre déterministe, puis vérifier les extensions, rôles, fonctions, triggers, policies, grants et publications Realtime.
4. Préparer des helpers de test qui ouvrent une transaction/session avec JWT synthétique et rôle effectif correspondant.
5. Charger le jeu synthétique : deux établissements, deux wilayas, année scolaire 2026-2027, affiliations vérifiées/en attente/révoquées, préférences d'annuaire opt-in/opt-out.
6. Prévoir reset complet entre scénarios et collecte des journaux SQL d'échec.
7. Exécuter la suite contre le schéma reconstruit, puis vérifier le comportement via PostgREST/RPC ; les tests unitaires Node statiques restent complémentaires.

**Blocage actuel :** l'environnement de travail précédemment audité ne disposait ni de `psql`, ni de serveur PostgreSQL local, ni de Docker/Podman ; aucune chaîne de migrations versionnée complète n'a été identifiée dans le dépôt. La suite réelle n'est donc pas exécutable aujourd'hui sans résoudre ces prérequis. Aucun projet Supabase de test ne sera créé si cela implique un coût ou un abonnement non autorisé.

## 5. Matrice de tests fonctionnels et sécurité

### A. Annuaire national

| ID | Scénario | Résultat attendu |
|---|---|---|
| DIR-01 | Élève A1 opt-in + affiliation active, recherche B1 opt-in d'une autre wilaya | B1 apparaît dans la projection publique minimale |
| DIR-02 | Élève sans affiliation officielle, même si profil `verif_statut='verifie'` | N'apparaît pas |
| DIR-03 | Affiliation expirée, révoquée ou source révoquée | N'apparaît pas |
| DIR-04 | Profil opt-out | N'apparaît pas immédiatement |
| DIR-05 | Recherche vide, trop courte ou par matricule/UUID | Refus/aucun résultat selon contrat anti-énumération |
| DIR-06 | Pagination répétée avec curseur | Pas de doublons ni de saut sous jeu stable |
| DIR-07 | Demande de plus que le plafond | Limite serveur appliquée |
| DIR-08 | Requête directe avec tentative de demander matricule, section, email, rôle interne, vérificateur | Champs absents de la réponse |
| DIR-09 | Utilisateur non authentifié | Refus |
| DIR-10 | Rafale de requêtes | Limitation de débit côté serveur |

### B. Invitations et DM

| ID | Scénario | Résultat attendu |
|---|---|---|
| DM-01 | A1 invite B1 inter-wilayas | Invitation pending créée si les deux comptes sont éligibles |
| DM-02 | B1 refuse | Statut declined, aucun DM créé |
| DM-03 | B1 accepte | Une conversation et exactement deux adhésions créées atomiquement |
| DM-04 | A1 tente d'accepter sa propre invitation | Refus |
| DM-05 | Un tiers tente de répondre | Refus |
| DM-06 | A1 annule sa demande pending | Statut cancelled, aucun DM |
| DM-07 | Invitation expirée | Acceptation refusée |
| DM-08 | Rejeu de création avec même clé d'idempotence | Même invitation, aucune duplication |
| DM-09 | Double acceptation simultanée dans deux sessions | Une conversation unique, deux adhésions, résultat cohérent |
| DM-10 | Invitation inverse simultanée | Pas de conversations doubles ; règle d'invitation croisée appliquée |
| DM-11 | Affiliation révoquée avant acceptation | Acceptation refusée |
| DM-12 | Blocage A→B puis invitation B→A | Refus symétrique |
| DM-13 | Compte suspendu ou rôle non éligible | Refus |
| DM-14 | Échec au milieu de la transaction d'acceptation | Rollback total, aucune ligne orpheline |
| DM-15 | Appel direct de l'ancienne `msg_open_direct` sans invitation acceptée | Refus ou ouverture d'un DM historique partagé seulement ; aucune création |
| DM-16 | INSERT PostgREST direct dans `msg_conversations` type direct | Refus |
| DM-17 | Auto-ajout direct à `msg_members` d'un DM | Refus |
| DM-18 | Tentative d'ajouter un troisième membre à un DM | Refus |
| DM-19 | Réouverture d'un DM historique dont le demandeur est membre | Accès conservé selon politique transitoire |
| DM-20 | Compte non membre tente de lire membres/messages/pièces jointes | Refus |

### C. Groupes

| ID | Scénario | Résultat attendu |
|---|---|---|
| GRP-01 | Élève A1 avec affiliation A active | Accès au groupe certifié de A si attribution autorisée |
| GRP-02 | Élève B1 tente d'accéder au groupe établissement A | Refus |
| GRP-03 | Groupe national avec règle explicite | A1 et B1 éligibles selon règle, malgré wilayas différentes |
| GRP-04 | Profil simplement marqué vérifié, sans affiliation officielle | Aucun accès certifié par ce seul statut |
| GRP-05 | Transfert A vers B | Ancien accès retiré à date d'effet ; nouveau accès seulement après validation |
| GRP-06 | Groupe communautaire | Adhésion explicite ; pas d'étiquette « classe officielle » |
| GRP-07 | Groupe historique vide actuellement recensé | Préservé, sans auto-attribution |
| GRP-08 | Non-membre tente de lire messages/participants | Refus |
| GRP-09 | Blocage dans un groupe partagé | N'accorde pas de privilèges supplémentaires et ne bloque pas les autres membres |
| GRP-10 | Révocation d'affiliation pendant une session | Réévaluation serveur lors du prochain accès/événement défini |

### D. Vérification scolaire et administration

| ID | Scénario | Résultat attendu |
|---|---|---|
| ADM-01 | Vérificateur A valide une affiliation de A | Autorisé si source officielle approuvée |
| ADM-02 | Vérificateur A valide une affiliation de B | Refus hors périmètre |
| ADM-03 | Élève valide sa propre affiliation | Refus |
| ADM-04 | Modérateur tente d'accéder à la file de vérification | Refus sans permission `students.verify` |
| ADM-05 | Admin lit la projection admin dédiée | Champs autorisés seulement |
| ADM-06 | Élève appelle la RPC admin | Refus |
| ADM-07 | Profil personnel | Projection privée du propriétaire, distincte de l'annuaire |
| ADM-08 | Recherche annuaire tente d'utiliser les permissions admin | Refus ; aucune élévation par paramètre client |

### E. Messages, pièces jointes, Realtime et modération

| ID | Scénario | Résultat attendu |
|---|---|---|
| MSG-01 | Membre envoie un message dans un fil autorisé | Succès |
| MSG-02 | Non-membre envoie dans un fil | Refus |
| MSG-03 | Corps vide, trop long ou rafale | Garde serveur appliquée |
| MSG-04 | Pièce jointe MIME autorisé et taille sous plafond | Acceptée après contrôles serveur |
| MSG-05 | MIME falsifié / fichier binaire incohérent | Refus après inspection serveur, pas confiance au navigateur |
| MSG-06 | Fichier supérieur à la limite | Refus |
| MSG-07 | Accès Storage par non-membre | Refus |
| MSG-08 | Événement Realtime d'un autre fil | Non livré au non-membre |
| MSG-09 | Signalement par membre | Créé et visible au périmètre autorisé |
| MSG-10 | Modérateur hors périmètre | Refus |
| MSG-11 | Journal d'audit | Append-only, sans copie de matricule/section ou contenu sensible |
| MSG-12 | Blocage unidirectionnel | Comportement symétrique défini et testé pour l'initiation de DM |

## 6. Tests de concurrence à exécuter en multi-session

- Deux acceptations simultanées de la même invitation.
- Deux invitations concurrentes A→B et B→A.
- Acceptation concurrente à une révocation d'affiliation.
- Attribution et retrait simultanés d'un membre d'un groupe.
- Blocage concurrent à la création d'une invitation.
- Deux créations idempotentes simultanées avec même clé.
- Deux créations avec même clé mais paramètres différents : conflit explicite, aucune mutation.
- Expiration concurrente à l'acceptation : une seule transition finale.

Chaque scénario doit vérifier le résultat fonctionnel et l'état final complet des lignes, contraintes uniques, événements et membres ; un simple HTTP 200 ne suffit pas.

## 7. Ordre de livraison technique recommandé

1. Résoudre le packaging reproductible du schéma/migrations et disposer d'un PostgreSQL jetable sans frais supplémentaires.
2. Écrire un harness de tests d'intégration authentifiés et multi-session.
3. Implémenter/fermer les RPC et politiques côté serveur dans un environnement isolé.
4. Faire passer les tests négatifs (accès interdit) avant les tests positifs.
5. Tester les transactions/concurrences et la non-régression des groupes/DMs.
6. Migrer ensuite le client vers les RPC dédiées.
7. Rejouer les tests statiques Node et les tests navigateur multi-comptes.
8. Obtenir une validation explicite avant toute migration sur Supabase actif, déploiement ou fusion.

## 8. Critères de sortie du lot de tests

Un futur lot ne pourra annoncer « Messenger national prêt » que si :
- tous les tests DIR/DM/GRP/ADM/MSG critiques passent sur PostgreSQL réel isolé ;
- les tests négatifs prouvent le refus des accès non autorisés ;
- la double acceptation et les autres courses sont idempotentes ;
- l'annuaire ne révèle aucune donnée administrative ;
- les groupes officiels sont rattachés à une affiliation institutionnelle validée ;
- les pièces jointes sont contrôlées côté serveur ;
- la suite multi-compte navigateur confirme les flux réels ;
- les écarts entre schéma actif, migrations et dépôt sont résolus et tracés.

**Statut actuel : plan de tests seulement.** Les tests PostgreSQL réels et multi-comptes ne sont pas exécutés. Les tests Node statiques existants ne prouvent pas la sécurité RLS réelle.

Aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage, création d'environnement payant, modification client, déploiement Cloudflare, changement `main) ou merge PR #17. Aucun travail MFA/2FA ou facturation.
