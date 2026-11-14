# Lot 293 — contrat de planification et d'historique des rapports périodiques

**Date :** 11 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Statut :** conception documentaire ; aucun Cron, historique élève ou envoi activé

## 1. Préconditions bloquantes

La planification ne peut pas être activée tant que les durées de conservation du Lot 291 ne sont pas approuvées, que les sources des catégories ne sont pas validées et que le contrat d'envoi du Lot 292 n'a pas passé ses tests isolés. Le fuseau IANA reste à confirmer avec l'utilisateur ; le prototype ne propose pas de sélecteur.

## 2. Calcul de l'échéance

- Stocker la fréquence, le jour, l'heure locale et le fuseau IANA validé dans les préférences.
- Calculer chaque occurrence dans le calendrier local, puis convertir la période et l'instant d'exécution en UTC.
- Pour le mensuel, appliquer la proposition Lot 290 : un jour absent du mois est ramené au dernier jour du mois.
- Pour une heure locale inexistante lors du passage à l'heure d'été, appliquer la première heure valide ; pour une heure répétée, retenir la première occurrence. Ces règles restent proposées tant qu'elles ne sont pas approuvées.
- Une clé d'occurrence stable doit être construite à partir du compte, du type de rapport et de la période locale normalisée ; les répétitions de déclencheur ne doivent pas créer de doublons.
- Les changements de fuseau ne doivent pas réécrire les périodes déjà traitées ; ils prennent effet à partir d'une date d'application explicite.
- Le comportement de rattrapage après panne (nombre de périodes manquées et durée maximale) reste à approuver ; aucun envoi rétroactif illimité.

## 3. Cycle de vie d'une occurrence

États logiques proposés :
- due : occurrence arrivée à échéance ;
- queued : occurrence enregistrée en attente ;
- building : génération en cours ;
- ready : contenu validé, en attente d'envoi ;
- sending : livraison en cours avec lease ;
- accepted : fournisseur a accepté le message ;
- failed : échec certain, avec code borné ;
- unknown : résultat fournisseur ambigu, réconciliation obligatoire ;
- cancelled : préférence désactivée, compte supprimé ou occurrence annulée.

Chaque transition doit être contrôlée côté serveur. Le navigateur ne peut pas écrire directement un état, modifier l'échéance ou forcer une nouvelle tentative.

## 4. Historique visible à l'élève

Si un historique est finalement affiché :
- exposer uniquement les lignes appartenant au compte connecté via une vue ou RPC explicitement filtrée ;
- ne jamais exposer directement les tables privées d'événements, d'exécutions ou de livraisons ;
- montrer la période, la date de traitement et un statut compréhensible ;
- distinguer « accepté par le service d'envoi » de « livré », « ouvert » ou « lu » ;
- ne jamais exposer adresse de destination, identifiant fournisseur, code interne, réponse brute ou erreur technique ;
- ne pas inventer un historique initial : état vide explicite tant qu'aucun rapport réel n'a été traité.

La maquette comporte un historique prérempli fictif. Il ne doit pas être repris. Le choix d'un historique visible dans l'application reste une décision produit ; le présent contrat ne l'active pas.

## 5. Déclenchement et concurrence

- Le déclencheur planifié ne fait que sélectionner les occurrences échues et les réclamer atomiquement.
- Une lease avec expiration empêche deux exécutions simultanées ; une lease expirée doit être récupérée sans créer une seconde livraison.
- La sélection doit être paginée et bornée ; aucune boucle non bornée sur l'ensemble des comptes.
- Chaque cycle est idempotent et supporte les répétitions, retards et redémarrages.
- La purge du Lot 291 s'exécute selon son propre calendrier et ne doit jamais supprimer une livraison en cours ou une donnée encore dans sa période de rétention.
- Les appels du planificateur sont internes et authentifiés ; aucune route publique ne doit permettre de déclencher un balayage global.

## 6. Matrice de tests

| ID | Scénario | Résultat attendu |
|---|---|---|
| S01 | Déclencheur répété pour la même occurrence | Une seule occurrence |
| S02 | Deux workers concurrents | Un seul claim actif |
| S03 | Lease expirée après arrêt brutal | Reprise contrôlée |
| S04 | Préférence désactivée avant l'envoi | Occurrence annulée |
| S05 | Compte supprimé avant l'envoi | Occurrence annulée, aucun message |
| S06 | Changement de fuseau | Application à partir de la date d'effet |
| S07 | Heure DST inexistante/répétée | Règle déterministe documentée |
| S08 | Jour 29/30/31 absent | Dernier jour du mois selon proposition |
| S09 | Retard prolongé du planificateur | Rattrapage borné, pas de rafale |
| S10 | Historique demandé par un autre compte | Aucune ligne divulguée |
| S11 | Élève tente d'écrire un statut | Refus |
| S12 | État fournisseur unknown | Pas de renvoi avant réconciliation |
| S13 | Donnée au-delà de la rétention | Purge selon politique versionnée |
| S14 | Catégorie sans source fiable | Catégorie absente, aucun contenu fictif |

## 7. État de l'infrastructure

L'audit antérieur a établi que le Worker principal ne possède pas de handler scheduled() ni de Cron Trigger dans wrangler.toml. Ce lot ne les ajoute pas. L'introduction d'un planificateur constitue un changement d'infrastructure distinct, à estimer, tester et autoriser avant toute configuration ou publication.

## 8. Opérations non effectuées

Aucun Cron, Worker, endpoint, table, fonction, migration, RLS, grant, secret ou paramètre Auth/SMTP créé ou modifié. Aucun e-mail, aucune purge, aucun déploiement, achat ou coût. PR #17 reste ouverte et non fusionnée.
