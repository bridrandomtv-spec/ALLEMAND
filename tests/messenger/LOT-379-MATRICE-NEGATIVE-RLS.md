# Lot 379 — matrice des scénarios négatifs RLS Messenger

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`

## Objet

Transformer les policies RLS réellement extraites de Supabase en scénarios de test multi-identités. Ce document est une spécification de test ; aucun compte, profil, message ou conversation fictive n'a été inséré dans la base active. Aucun test comportemental n'est déclaré exécuté.

## Identités synthétiques prévues

- A : élève vérifié, créateur potentiel.
- B : élève vérifié, destinataire potentiel.
- C : élève vérifié, tiers sans relation avec A ou B.
- D : élève vérifié ayant bloqué A.
- M : modérateur habilité, uniquement pour vérifier les opérations de modération autorisées.

Les comptes devront être créés uniquement dans une base de test isolée. Les UUID et claims JWT seront synthétiques. Les tests devront s'exécuter sous le rôle SQL `authenticated` avec `request.jwt.claim.sub` et `request.jwt.claims` configurés pour l'identité testée. Ne jamais utiliser postgres ou service_role pour conclure sur le comportement RLS.

## Matrice de scénarios négatifs

| ID | Acteur | Action | Résultat de sécurité attendu |
|---|---|---|---|
| INV-01 | A | INSERT direct d'une conversation DM avec B, sans invitation | Refusé |
| INV-02 | A | INSERT direct de sa propre ligne msg_members sur un DM vide | Refusé hors procédure d'invitation |
| INV-03 | B | Auto-ajout à un DM créé par A sans invitation acceptée | Refusé |
| INV-04 | C | S'ajouter à une conversation A-B | Refusé |
| INV-05 | A | Appeler msg_open_direct(B) sans invitation acceptée | Refusé |
| INV-06 | B | Appeler msg_open_direct(A) après refus ou annulation | Refusé |
| INV-07 | A | Créer un DM avec B après blocage de A par B | Refusé |
| INV-08 | A | Créer un DM avec D après que A a bloqué D | Refusé |
| MEM-01 | C | Lire les membres d'une conversation dont C n'est pas membre | Zéro ligne |
| MEM-02 | C | Retirer l'appartenance de B | Refusé |
| MEM-03 | A | Retirer sa propre appartenance | Autorisé uniquement si le modèle métier permet de quitter le DM |
| PROF-01 | A | Lire le profil complet de B sans conversation commune | Zéro ligne |
| PROF-02 | A | Lire matricule, données scolaires ou champs de vérification de B via un accès annuaire | Refusé ; seule une projection publique minimale peut être retournée après consentement |
| PROF-03 | C | Lire le profil de A sans relation, habilitation ou consentement | Zéro ligne |
| PROF-04 | Vérificateur hors wilaya | Lire une fiche en attente hors de son périmètre | Zéro ligne |
| MSG-01 | C | Lire les messages du DM A-B | Zéro ligne |
| MSG-02 | C | Insérer un message dans le DM A-B | Refusé |
| MSG-03 | A | Envoyer un message après blocage bilatéral | Refusé |
| ATT-01 | A | Créer une pièce jointe pour un message envoyé par B | Refusé |
| ATT-02 | C | Télécharger un fichier d'une conversation dont C n'est pas membre | Refusé |
| ATT-03 | A | Téléverser un MIME non autorisé ou un fichier supérieur à 5 Mio | Refusé |

## Scénarios positifs de contrôle (anti-régression)

- POS-01 : B accepte une invitation valide de A ; la création du DM et des deux adhésions se fait atomiquement, une seule fois.
- POS-02 : un membre lit les messages de sa conversation.
- POS-03 : un membre peut consulter uniquement la projection minimale des autres participants de sa conversation.
- POS-04 : un modérateur habilité conserve les opérations strictement prévues sur les groupes, sans obtenir de privilèges globaux implicites.
- POS-05 : une ancienne conversation historique demeure lisible par ses membres légitimes après migration.

## Conditions d'exécution

1. Environnement PostgreSQL 17 isolé et gratuit confirmé.
2. Baseline restauré et comparé au manifeste du catalogue actif.
3. Rôles, fonctions Auth simulées et claims JWT installés dans le périmètre de test.
4. Chaque scénario exécuté dans une transaction indépendante, avec assertions sur succès/erreur et nombre de lignes.
5. Tests concurrents d'acceptation exécutés avec deux sessions pour vérifier l'unicité du DM.
6. Nettoyage limité à la base de test.

## Ce que les tests doivent prouver

- Une conversation privée ne peut pas être créée par INSERT direct ou RPC sans invitation acceptée.
- L'ajout du destinataire ne peut pas être obtenu par auto-ajout.
- Le blocage est bilatéral et appliqué à la création, l'acceptation et l'envoi.
- Les profils ne sont pas un annuaire national implicite.
- Les pièces jointes sont rattachées à un message dont l'auteur correspond à l'uploader.
- Les groupes officiels et les conversations historiques restent compatibles.

## Statut

- Extraction des policies catalogues : exécutée en lecture seule le 13 novembre 2026.
- Scénarios définis : oui.
- Tests PostgreSQL/RLS multi-comptes : **non exécutés**.
- Base de test : **non créée**.
- Écriture Supabase active : **aucune**.
- Dépense : **0 USD**.
- PR #17 : à contrôler avant clôture du lot ; aucune fusion autorisée.
