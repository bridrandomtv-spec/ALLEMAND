# Lot 377 — manifeste de restauration et plan de tests Messenger isolés

Date : 13 novembre 2026  
Nature : consolidation documentaire des Lots 366–376. Aucun SQL appliqué, aucun test prétendument exécuté.

## 1. Objectif

Définir un ordre de reconstruction vérifiable du Messenger réel, sans utiliser le fichier historique supabase/msg_schema.sql comme baseline et sans exporter de données de production.

## 2. Manifeste par couche

### Couche A — objets applicatifs à reconstruire

- Tables Messenger : msg_conversations, msg_members, msg_messages, msg_attachments, msg_blocks, msg_reports, msg_log.
- Profil et audit : profiles, audit_logs.
- Dépendances de décision administrative : admin_roles, admin_permissions, wilaya_assignments.
- Dépendances de profil à inclure uniquement si les triggers/fonctions ou policies retenus les référencent : parent_role_requests et autres tables explicitement identifiées dans les définitions.
- Contraintes, index, séquences, defaults, policies RLS, ACL tables/colonnes, ACL EXECUTE, fonctions, triggers, publication Realtime et configuration Storage à documenter séparément.

### Couche B — contrat Auth simulable

- Rôles API anon et authenticated sans BYPASSRLS.
- Fonctions auth.uid(), auth.jwt(), auth.role() ou shim strictement limité au harness, avec comportement documenté.
- Claims JWT synthétiques : sub, role et autres claims explicitement nécessaires.
- UUID et emails de test uniquement ; aucun utilisateur, mot de passe, token, session ou identité de production.
- Le trigger handle_new_user doit être testé seulement dans un environnement compatible Auth ou via un test isolé clairement étiqueté comme simulation.

### Couche C — services Supabase managés, non équivalents à PostgreSQL générique

- Auth complet et cycle de session ;
- Storage API, objets binaires, URLs signées, lifecycle et suppression ;
- Realtime publication/écoute et transport ;
- rôles internes, extensions managées et composants de plateforme.

Un test SQL de policy storage.objects ne prouve pas qu'un upload/download réel fonctionne. Un test de publication PostgreSQL ne prouve pas le transport Realtime. Ces validations exigent un projet Supabase de test explicitement autorisé.

## 3. Ordre de restauration envisagé

1. Vérifier l'instance cible isolée, sa version PostgreSQL et les extensions disponibles.
2. Préparer les rôles de test minimaux, sans reproduire les privilèges superuser/BYPASSRLS pour les comptes ordinaires.
3. Installer les shims Auth uniquement si le moteur cible n'est pas Supabase, en signalant les différences.
4. Créer les tables dépendances et tables applicatives dans l'ordre des clés étrangères.
5. Ajouter contraintes, index, séquences et defaults.
6. Ajouter fonctions de sécurité et triggers dans l'ordre des dépendances.
7. Activer RLS et reproduire policies et ACL à l'identique pour le baseline de test.
8. Créer les comptes et profils SYNTHÉTIQUES, affectations admin synthétiques et données de conversations fictives.
9. Exécuter les tests sous les rôles anon/authenticated et les claims correspondants.
10. Exécuter séparément les tests Storage/Realtime via services Supabase si un projet de test est autorisé.

Aucune étape ne doit se connecter au projet actif pour écrire ou appliquer une migration.

## 4. Jeu minimal de comptes synthétiques

- ELEVE_A : élève vérifié de test, wilaya W01, niveau 2AS, filière F1.
- ELEVE_B : même périmètre, statut vérifié.
- ELEVE_C : même périmètre, statut non vérifié.
- ELEVE_D : wilaya W02, même niveau/filière, statut vérifié.
- MOD_W01 : agent synthétique avec students.verify et périmètre W01.
- MOD_W02 : agent synthétique avec students.verify et périmètre W02.
- ADMIN_TEST : administrateur de test uniquement si le rôle admin doit être couvert.
- ANON : requêtes sans identité.

Les UUID, pseudo, emails et codes de périmètre seront générés pour le test ; aucun identifiant réel ne sera copié.

## 5. Matrice fonctionnelle prioritaire

### Profil et vérification

- Auto-demande non_verifie/rejete → en_attente : autorisée dans les conditions du trigger.
- Auto-passage à verifie : refusé.
- Auto-modification matricule/section/verif_by : refusée.
- Modérateur W01 vérifie un élève W01 : autorisé.
- Modérateur W01 vérifie un élève W02 : refusé.
- Modification par l'élève de wilaya/niveau/filiere : refusée.
- Métadonnées user modifiables à la création : ne confèrent ni rôle privilégié ni statut vérifié.

### Conversations et consentement

- Création directe par INSERT : vérifier les policies et le trigger.
- RPC msg_open_direct sans invitation acceptée : reproduire et confirmer le chemin actuel.
- Auto-ajout par msg_member_ok : vérifier si un utilisateur peut se joindre sans invitation.
- Invitation refusée/expirée/annulée : aucune création de DM.
- Invitation acceptée : création atomique d'un seul DM, y compris deux acceptations concurrentes.
- Rejouer une invitation et accepter deux fois : idempotence.
- Blocage A→B et B→A : vérifier les deux sens pour ouverture, lecture et envoi.
- Compte non vérifié, suspendu ou supprimé : refus selon les règles métier à définir.

### Messages et fichiers

- Non-membre ne lit ni n'envoie dans un DM.
- Membre envoie seulement en son nom.
- Rate limit : 20/minute ; longueur maximale 2 000 caractères.
- Lien URL : flag attendu.
- Pièce jointe : MIME, taille, statut, propriétaire, chemin et auteur du message cohérents.
- URL signée, téléchargement, suppression et Realtime : tests d'intégration Supabase distincts.

### Administration et audit

- Modération dans le périmètre autorisé uniquement.
- Un agent hors wilaya ne voit ni ne modifie les éléments d'une autre wilaya.
- audit_logs non modifiable/supprimable par authenticated.
- Toute mutation de rôle autorisée génère l'audit attendu ; les refus ne laissent pas de mutation partielle.

## 6. Critères de sortie

Le baseline ne sera déclaré fidèle que si :
- les définitions de tables, contraintes, index, policies, fonctions, triggers et ACL ont été comparées aux catalogues actifs ;
- chaque test est exécuté sous le rôle et le claim attendus ;
- les scénarios négatifs prouvent un refus effectif, pas seulement un test de code client ;
- les limites de l'émulation Auth/Storage/Realtime sont affichées ;
- aucun test n'a touché la production ;
- les résultats, logs et versions sont conservés dans le rapport.

## 7. Blocage d'environnement et décision

- Aucun moteur PostgreSQL local ni runtime Docker/Supabase CLI n'est disponible dans l'environnement actuel (Lot 368).
- Une branche Supabase coûteuse à l'heure est exclue.
- Un second projet indépendant Free a été estimé à 0 USD/mois et le plan Free autorise deux projets actifs, mais sa création reste en attente d'une autorisation explicite. Aucun projet n'a été créé.
- Aucune facture, carte, upgrade ou ressource payante n'est autorisée.
- En attendant, le travail autorisé porte sur la préparation du manifeste et des scripts hors ligne ; aucune validation comportementale PostgreSQL ne peut être revendiquée.

## 8. État

- Manifeste et matrice de test préparés à partir des Lots 366–376.
- Aucun SQL exécuté sur une base de test, aucun test PostgreSQL/RLS multi-compte exécuté.
- Aucun changement de Supabase actif, Auth, RLS, GRANT, Storage, Realtime ou production.
- PR #17 reste ouverte et non fusionnée ; main inchangée.
