# Lot 401 — contrat correctif du blocage bilatéral et du consentement DM

Date : 13 novembre 2026  
Statut : spécification documentaire — aucune implémentation autorisée par ce lot.

## 1. Objectif

Définir une règle serveur cohérente pour que le blocage soit bilatéral et qu'aucune relation sociale « زملائي » ne crée implicitement une conversation Messenger. La règle doit s'appliquer à tous les chemins d'écriture, pas seulement à l'interface.

## 2. Invariants obligatoires

1. Un blocage A → B empêche les opérations de communication entre A et B dans les deux sens.
2. Le contrôle doit être appliqué à l'ouverture d'un DM, à chaque ajout de membre à un DM et à chaque envoi de message.
3. Le contrôle doit considérer les deux sources si elles coexistent : `msg_blocks` et `social_blocks`. Une erreur de lecture, une table absente ou un état ambigu doit refuser l'opération (fail closed).
4. Un compte ne peut pas contourner la règle en appelant directement une table, une RPC, un trigger, une route alternative ou en réutilisant un ancien identifiant de conversation.
5. L'acceptation d'une invitation sociale « زمالة » ne vaut jamais consentement à recevoir un DM.
6. Les réponses publiques ne doivent pas révéler qui a bloqué qui ni permettre d'énumérer les comptes.

## 3. Contrat logique du prédicat

Nom indicatif : `msg_pair_can_communicate(actor_id, other_id)`.

Résultat autorisant uniquement si toutes les conditions sont vraies :
- utilisateur authentifié et acteur égal à `auth.uid()` ;
- deux identifiants distincts et profils admissibles selon la règle d'identité actuellement approuvée ;
- aucun blocage dans `msg_blocks` dans l'une ou l'autre direction ;
- aucun blocage dans `social_blocks` dans l'une ou l'autre direction ;
- consentement DM valide, selon la règle décidée pour le destinataire.

Le prédicat ne doit pas être un simple booléen appelable avec des UUID arbitraires pour sonder l'annuaire. Les fonctions exposées doivent vérifier l'acteur authentifié et retourner des erreurs génériques.

## 4. Consentement et ouverture d'une conversation

Règle de séparation :
- `زملائي` = relation sociale acceptée ;
- invitation Messenger = demande explicite d'ouverture de conversation ;
- `msg_conversations` direct = conversation créée uniquement après acceptation de la demande Messenger, ou après une règle de consentement explicite que le produit aura validée.

La future opération d'acceptation doit être atomique : vérifier la demande en attente, les deux comptes, les blocages dans les deux directions, puis créer ou retrouver un DM unique et inscrire exactement les deux membres. Les appels concurrents doivent aboutir à un seul DM, sans double création.

À décider avant implémentation :
- une réponse à une publication peut-elle initier une invitation Messenger, ou seulement ouvrir un formulaire de demande ?
- une demande Messenger entrante peut-elle être envoyée par tout élève vérifié, ou seulement par un contact social accepté ?
- que se passe-t-il si un blocage intervient entre l'envoi et l'acceptation de l'invitation ? Proposition : refuser l'acceptation et ne créer aucun DM.

## 5. Points d'application obligatoires

| Chemin | Contrôle exigé |
|---|---|
| RPC d'ouverture DM | authentification, consentement, blocage bilatéral, unicité atomique |
| INSERT direct `msg_members` | même contrôle au trigger et policy ; aucun chemin direct plus permissif |
| Ajout à un groupe Messenger | vérifier si la règle de blocage doit s'appliquer entre tous les membres et l'ajoutant ; ne pas supposer que les règles DM s'appliquent aux groupes |
| INSERT `msg_messages` | blocage bilatéral à l'instant de l'envoi ; conversation et membre vérifiés |
| Réutilisation d'un DM historique | recontrôler blocage et consentement, ne pas considérer l'existence du DM comme un consentement permanent |
| Pièces jointes | mêmes autorisations que le message parent ; aucun accès par chemin Storage deviné |
| Modération | accès réservé aux permissions de modération existantes ; audit des consultations et actions |

## 6. Conversations historiques — décision produit requise

Le blocage ne doit pas supprimer automatiquement les messages historiques ni effacer les preuves de modération.

Avant implémentation, décider séparément :
- si la conversation historique reste visible en lecture seule aux deux parties ;
- si elle disparaît de la liste du bloqueur, du bloqué ou des deux ;
- si le déblocage rétablit la conversation, et si une nouvelle invitation est nécessaire ;
- comment traiter les groupes où les deux personnes bloquées restent membres.

Proposition de sécurité minimale : aucun nouvel envoi ni ajout de membre tant que le blocage existe ; pas de suppression destructive de l'historique ; visibilité de l'historique à arbitrer avec la politique de protection des élèves.

## 7. Matrice de tests isolés avant toute activation

1. A bloque B : A ne peut plus envoyer à B.
2. A bloque B : B ne peut plus envoyer à A.
3. B bloque A : mêmes deux refus.
4. Blocage uniquement dans `social_blocks` : refus dans les deux sens.
5. Blocage uniquement dans `msg_blocks` : refus dans les deux sens.
6. Blocage présent dans les deux tables : refus sans doublon d'erreur.
7. Erreur d'accès à l'une des sources : refus fail closed.
8. Aucun blocage : parcours d'invitation Messenger valide.
9. Relation sociale acceptée sans invitation Messenger : aucun DM créé.
10. Invitation Messenger refusée/annulée : aucun DM créé.
11. Invitation en attente : aucun DM avant acceptation.
12. Blocage après émission mais avant acceptation : acceptation refusée.
13. Deux acceptations concurrentes : un seul DM et deux membres.
14. INSERT direct de membre : même refus qu'avec la RPC.
15. Appel RPC par anon : refus.
16. Tentative d'ajouter un troisième membre à un DM : refus.
17. Tentative d'envoyer avec un ancien ID de DM : refus si blocage actif.
18. Conversation historique bloquée : comportement conforme à la décision de visibilité approuvée.
19. Déblocage : pas de reprise implicite sans règle approuvée.
20. Réponses et erreurs ne révèlent pas l'identité du bloqueur.
21. Tentative de sonder un UUID non autorisé : réponse générique.
22. Envoi avec pièce jointe : mêmes contrôles que le message.
23. Courses simultanées blocage/envoi : résultat sérialisé et sûr.
24. Courses simultanées blocage/acceptation invitation : aucun DM créé après blocage effectif.
25. Modérateur : accès conforme aux permissions dédiées, sans bypass utilisateur.

Ces tests doivent être exécutés sur une base PostgreSQL jetable et fidèle, avec comptes synthétiques uniquement. La production ne sert pas d'environnement de test.

## 8. Prérequis bloquants

- Retrouver les 27 migrations réelles et leurs dépendances ; le dépôt n'en contient pas encore la séquence fidèle.
- Disposer d'un PostgreSQL local jetable, gratuit et sans données réelles, capable de reproduire les rôles, extensions, Auth helpers et politiques Supabase.
- Finaliser la règle de consentement DM et le traitement des conversations historiques.
- Auditer séparément les chemins d'ajout aux groupes et le Storage avant intégration.
- Obtenir une revue de sécurité des fonctions SECURITY DEFINER et de leurs grants.

## 9. Décision

**NO-GO pour l'implémentation et le raccordement à ce stade.** Le lot fixe un contrat cible et des tests ; il ne modifie pas la base active, le runtime Messenger ou les routes de la plateforme.

Aucun SQL n'a été exécuté pour ce lot. Aucun DDL/DML, migration, RPC, policy, GRANT, Auth, RLS, Storage ou Realtime modifié. Aucun test comportemental, déploiement, merge, service payant ou dépense.
