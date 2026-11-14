# Lot 329 — concurrence, idempotence et unicité des affiliations

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : modèle et tests synthétiques hors ligne, documentation de contrat serveur. Aucun changement de base active.

## 1. Défaut corrigé dans le simulateur Lot 328

La vérification de `previousEnrollment` contenait une condition contradictoire : elle n'entrait dans le bloc que si le statut était `verified`, puis testait s'il était différent de `transferred`. Le test de transfert ne couvrait pas cette branche puisqu'il ne transmettait pas d'affiliation précédente.

Le contrôle est corrigé : pour un même élève, une même année scolaire et deux établissements différents, la nouvelle validation est refusée tant que l'affiliation précédente n'est pas explicitement au statut `transferred`. Les cas d'un autre élève ou d'une autre année ne sont pas bloqués par ce contrôle. Un test synthétique couvre désormais ces variantes.

Cette correction améliore le simulateur ; elle ne crée aucune contrainte réelle en base et ne garantit pas l'exclusivité en cas de requêtes simultanées.

## 2. Matrice des courses à traiter côté serveur

| Course / répétition | Risque | Invariant serveur exigé | Test PostgreSQL requis |
|---|---|---|---|
| Deux établissements valident simultanément le même élève et la même année | Deux affiliations actives | Une seule affiliation active par élève et année, sauf exception institutionnelle explicitement modélisée | Deux sessions, barrières synchronisées, une seule transaction gagnante |
| Deux responsables valident le même dossier | Double événement / double notification | Décision finale atomique et unique ; seconde requête retourne le résultat déjà enregistré ou un conflit explicite | Rejouer la même commande avec même clé d'idempotence |
| Deux transferts concurrents depuis le même établissement | Deux établissements de destination incohérents | Un seul transfert source peut gagner ; fermeture source et ouverture destination dans une transaction | Deux destinations, même affiliation source, commits concurrents |
| Réponse perdue après commit puis retry client | Création en double | Clé d'idempotence liée à l'acteur, à l'opération et au dossier ; même clé + même empreinte = même résultat | Commit serveur puis simulation de timeout et retry |
| Même clé d'idempotence avec payload différent | Rejeu détourné | Rejet explicite ; ne jamais renvoyer silencieusement le résultat d'une autre commande | Même clé, empreintes différentes |
| Source institutionnelle révoquée pendant la validation | Validation fondée sur une source devenue invalide | Verrouiller ou relire la version de source dans la transaction ; annuler si statut/version a changé | Révocation concurrente et ordre de commit contrôlé |
| Deux approbateurs rendent des décisions opposées | Historique contradictoire | Verrou de ligne et transition conditionnelle depuis un état non final ; un seul événement final | Verify/reject concurrents sur le même dossier |
| Retry après expiration ou transfert déjà réalisé | Transition rejouée | Opérations terminales idempotentes ou conflit déterministe ; jamais de seconde clôture | Rejouer transfert/expiration après succès |

## 3. Contrat transactionnel cible

Une future RPC serveur devra, dans une seule transaction :

1. authentifier l'appelant depuis le contexte serveur ; ne jamais accepter un rôle ou un identifiant d'acteur déclarés par le navigateur comme preuve ;
2. vérifier l'autorité, le périmètre établissement, l'année scolaire et la version/statut de la source officielle ;
3. acquérir les verrous nécessaires dans un ordre stable (dossier, affiliation active de l'élève/année, source) afin de limiter les interblocages ;
4. vérifier une clé d'idempotence persistée et son empreinte de requête ;
5. imposer l'unicité de l'affiliation active par contrainte/index adapté, en tenant compte des règles institutionnelles de transfert ;
6. enregistrer décision, clôture de l'ancienne affiliation, création de la nouvelle affiliation et événement d'audit atomiquement ;
7. retourner le résultat canonique de la première exécution lors d'un retry identique.

Une simple vérification applicative `SELECT puis INSERT` ou un trigger qui ne verrouille pas une ligne commune ne suffit pas contre deux transactions concurrentes. Les contraintes exactes et l'index partiel devront être conçus après inspection du schéma réel et validation des règles métier.

## 4. Limites et critères de sortie

- Les tests ajoutés au simulateur restent séquentiels et en mémoire ; ils ne simulent ni isolation PostgreSQL, ni verrous, ni contraintes, ni sessions concurrentes.
- Aucun environnement PostgreSQL jetable n'a été utilisé dans ce lot ; aucune concurrence réelle n'est revendiquée comme testée.
- Aucun SQL, migration, RPC, Auth, RLS, GRANT, Storage, import de données ou écriture Supabase active.
- Aucun changement Cloudflare, aucune publication, aucun changement sur `main`, aucune fusion de PR #17.
- Pas de MFA/2FA, pas de facturation.

**NO-GO** pour l'annuaire national, les invitations inter-établissements et les affiliations réelles tant que les contraintes transactionnelles, les sources officielles et les tests PostgreSQL multi-session ne sont pas livrés et validés.

Commande locale attendue : `node --test prototypes/registry-affiliation-scenarios-core.test.mjs`. L'exécution doit être attestée séparément ; ce document ne prétend pas qu'elle a été lancée localement.
