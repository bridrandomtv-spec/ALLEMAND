# Lot 399 — migration progressive du blocage bilatéral et ouverture DM

Date : 13 novembre 2026  
Statut : spécification documentaire uniquement — aucune migration SQL exécutable ni aucun changement Supabase appliqué.

## 1. Objectif et limites

Préparer une correction sûre des contrôles de blocage dans ماسنجر et définir les conditions d'ouverture d'une conversation directe, en tenant compte du futur réseau ملتقى الطلاب.

Contraintes impératives :
- ne pas modifier la base Supabase active ;
- ne pas supposer que les fichiers SQL historiques du dépôt reflètent les 27 migrations déjà appliquées ;
- ne pas créer de conversation automatiquement lors de l'acceptation d'une relation زملائي ;
- ne pas réactiver les DM nationaux ou inter-niveaux avant validation de la règle produit et des contrôles serveur ;
- aucune dépense, aucun service payant, aucune branche Supabase payante ;
- tests comportementaux uniquement dans une copie isolée et fidèle, avec comptes synthétiques et rôle `authenticated`, jamais avec `postgres` ou `service_role` comme preuve de RLS.

Ce document n'est ni une migration à exécuter, ni une autorisation d'écrire sur le projet actif.

## 2. Faits confirmés par l'audit en lecture seule

Les constats suivants sont directement issus des définitions et métadonnées du projet actif consultées lors du Lot 398 :

1. `msg_blocks` contient les blocages Messenger, avec insertion autorisée au bloqueur, lecture limitée aux acteurs concernés/modérateur et suppression par le bloqueur.
2. `msg_not_blocked(cid, snd)` est appelée par la policy d'insertion de `msg_messages`. Sa recherche couvre les blocages dirigés d'un membre vers l'expéditeur courant ; elle ne teste pas explicitement le sens inverse.
3. Ce prédicat ne consulte pas `social_blocks`, table proposée pour le futur réseau social mais non créée.
4. `msg_open_direct(p_other)` appelle `msg_can_dm`, puis réutilise ou crée une conversation et ajoute ses membres.
5. `msg_can_dm` impose actuellement la vérification des profils et l'égalité wilaya/niveau/filière ; l'audit n'a trouvé dans cette fonction aucun contrôle explicite des blocages ni d'une invitation sociale acceptée.
6. La fonction d'ouverture n'impose pas actuellement une invitation Messenger acceptée identifiée dans l'audit.
7. Le client dispose des méthodes `msgBlock` et `msgUnblock`, mais une protection côté client ne constitue pas une frontière d'autorisation suffisante.

Ces constats décrivent le code et le catalogue inspectés à la date du lot. Ils ne démontrent pas le comportement effectif de tous les chemins applicatifs ou déclencheurs non examinés.

## 3. Points non encore établis — à ne pas traiter comme des faits

Avant toute migration, il reste à vérifier :

- toutes les surcharges/signatures de fonctions et dépendances SQL réelles ;
- tous les appels RPC et chemins d'ajout de membres à une conversation ;
- si une conversation directe peut être créée par un autre chemin que `msg_open_direct` ;
- la politique métier définitive : invitation Messenger explicite, autorisation de message entrant, ou autre règle validée ;
- le traitement des conversations déjà existantes lors d'un blocage ;
- la politique de conservation des messages et pièces jointes après blocage, retrait de contact ou suppression de compte ;
- les droits effectifs EXECUTE sur chaque fonction, son propriétaire, son search_path et son mode SECURITY INVOKER/DEFINER ;
- les éventuelles contraintes uniques, verrous et stratégies de concurrence déjà présentes.

Aucune décision sur ces points ne doit être déduite des seuls prototypes ou d'un ancien fichier SQL.

## 4. Contrat de sécurité cible

### 4.1 Prédicat bilatéral unique

Concevoir un contrôle serveur interne, appelé de manière cohérente par toutes les opérations sensibles. Le nom `social_interaction_allowed` reste indicatif.

Pour deux identités distinctes A et B, l'interaction est interdite si au moins une des conditions suivantes est vraie :

- A a bloqué B dans `msg_blocks` ;
- B a bloqué A dans `msg_blocks` ;
- A a bloqué B dans `social_blocks` ;
- B a bloqué A dans `social_blocks`.

Le contrôle doit :
- refuser les identités nulles, identiques, non authentifiées ou non autorisées ;
- utiliser l'identité de session vérifiée côté serveur, pas un identifiant d'expéditeur fourni librement par le client ;
- échouer en mode fermé si une dépendance nécessaire est absente ou ne peut être évaluée ;
- retourner un résultat générique à l'appelant, sans révéler qui a bloqué qui ;
- être utilisé par l'ouverture d'un DM et l'envoi de messages, et être évalué pour les invitations sociales ;
- éviter les chemins alternatifs d'ajout de membres qui contourneraient ce contrôle.

Ne pas exposer ce prédicat comme endpoint public permettant de sonder l'existence d'un blocage.

### 4.2 Autorisation distincte d'ouverture DM

Un contact social accepté n'est pas, à lui seul, une autorisation d'ouvrir une conversation.

Avant ouverture, le serveur doit vérifier :
1. session authentifiée et identité appelante égale à `auth.uid()` ;
2. destinataire distinct et admissible ;
3. absence de blocage bilatéral dans les deux systèmes ;
4. condition de vérification d'identité scolaire exigée par la politique retenue ;
5. autorisation Messenger explicite selon une règle produit validée ;
6. compatibilité avec les paramètres de confidentialité et éventuelles restrictions/modérations ;
7. absence de conversation interdite ou état de compte empêchant l'action.

La règle actuelle d'égalité wilaya/niveau/filière est un fait du code observé, mais son remplacement par une règle nationale n'est pas encore autorisé par ce lot. Il faut décider si l'ouverture nationale exige une invitation Messenger acceptée, une autorisation de réception configurée, ou un autre consentement explicite. Ne pas transformer automatiquement l'acceptation d'une invitation sociale en consentement Messenger.

### 4.3 Opération de blocage atomique

Une future opération serveur de blocage devra, dans une transaction :
- enregistrer le blocage dans le système concerné ;
- neutraliser les invitations sociales en attente entre les deux comptes, selon la règle produit ;
- retirer la relation sociale si la politique approuvée le prévoit ;
- empêcher immédiatement l'ouverture de nouveaux DM et l'envoi de nouveaux messages dans les deux sens ;
- conserver les conversations et contenus historiques selon une politique explicite, sans suppression implicite.

Le déblocage d'un côté ne réautorise rien si l'autre côté conserve un blocage.

## 5. Séquence de migration proposée — non exécutable

### Étape 0 — inventaire exact
Obtenir une source fidèle de l'état actif : historique réel des migrations, définitions complètes des fonctions, policies, triggers, grants, dépendances et contraintes. Le dossier actuel ne possède pas les corps SQL des 27 migrations appliquées. Les scripts historiques du dépôt sont donc insuffisants pour produire une migration sûre.

### Étape 1 — environnement isolé gratuit
Établir une base PostgreSQL locale jetable, sans service payant et sans connexion d'écriture au projet actif. La copie doit inclure le schéma pertinent, les fonctions Auth de test, les policies et triggers requis. Les données personnelles réelles ne doivent pas être copiées ; utiliser uniquement des comptes et données synthétiques.

Si la fidélité du schéma/RLS ne peut être démontrée, suspendre les tests comportementaux plutôt que prétendre qu'ils sont représentatifs.

### Étape 2 — prédicat de blocage
Concevoir et tester le prédicat bilatéral avant de modifier les fonctions d'ouverture ou d'envoi. Vérifier les deux directions et les deux tables de blocage. Prévoir un comportement sûr si la table sociale n'existe pas encore : la migration des fonctions dépendantes ne doit être déployée qu'après création contrôlée du modèle social.

### Étape 3 — ouverture DM et ajout de membres
Renforcer le chemin central d'ouverture, puis examiner chaque chemin d'ajout de membres et les policies d'insertion. Refuser toute auto-adhésion qui contourne l'autorisation d'invitation. Préserver la réutilisation idempotente d'une conversation existante autorisée.

### Étape 4 — envoi de messages
Brancher le même contrôle bilatéral au contrôle d'envoi. Vérifier que l'INSERT direct via Data API ne peut pas contourner le RPC. Examiner également les pièces jointes et les opérations Realtime pour qu'elles ne divulguent pas de nouveau contenu après blocage.

### Étape 5 — validation et seulement ensuite décision de déploiement
Exécuter la matrice complète en environnement isolé, examiner les grants et les politiques, vérifier les fonctions privilégiées et leurs search_path, puis faire une revue humaine du SQL final. Toute application au projet actif nécessitera une autorisation explicite distincte et un plan de retour arrière.

## 6. Matrice minimale de tests comportementaux

| ID | Identités synthétiques / état | Action | Résultat attendu |
|---|---|---|---|
| BLK-01 | A bloque B dans msg_blocks | A ouvre un DM vers B | refus, aucune conversation créée |
| BLK-02 | A bloque B dans msg_blocks | B ouvre un DM vers A | refus, aucune conversation créée |
| BLK-03 | B bloque A dans msg_blocks | A envoie un message à B | refus |
| BLK-04 | A bloque B dans social_blocks | B envoie un message à A | refus |
| BLK-05 | B bloque A dans social_blocks | A ouvre un DM vers B | refus |
| BLK-06 | blocage dans chaque sens, tables différentes | tentative d'interaction | refus |
| BLK-07 | A débloque B, B bloque toujours A | nouvelle tentative | refus |
| DM-01 | A et B sont contacts sociaux, sans consentement Messenger | A ouvre un DM | refus |
| DM-02 | invitation Messenger explicitement acceptée, aucun blocage | A ouvre un DM | autorisé selon règle approuvée |
| DM-03 | invitation en attente ou refusée | A ouvre un DM | refus |
| DM-04 | profil non vérifié lorsque la vérification est requise | ouverture | refus |
| DM-05 | compte anonyme | ouverture et envoi direct | refus |
| DM-06 | appelant tente de fournir l'UUID d'un autre expéditeur | ouverture/envoi | refus |
| DM-07 | conversation autorisée déjà existante | réouverture | réutilisation sans doublon |
| DM-08 | appels concurrents simultanés | ouverture répétée | une seule conversation directe |
| MEM-01 | membre tente de s'ajouter sans invitation valide | insertion membre | refus |
| MEM-02 | ajout via un chemin secondaire | tentative de contournement | refus |
| MSG-01 | blocage posé après création d'un DM | nouvel envoi dans chaque sens | refus immédiat |
| MSG-02 | message historique avant blocage | lecture selon politique retenue | comportement conforme à la politique de conservation |
| FILE-01 | blocage posé | lecture/téléchargement d'une pièce jointe historique | résultat conforme à la politique explicite, sans fuite nouvelle |
| PRIV-01 | A a bloqué B | B tente d'identifier l'auteur du blocage | réponse générique |
| TX-01 | échec pendant opération de blocage | transaction interrompue | aucune mise à jour partielle |
| TX-02 | invitation en attente au moment du blocage | opérations concurrentes | état final cohérent, sans invitation active |
| RLS-01 | utilisateur authenticated A tente de lire/modifier les ressources de B | accès direct Data API | refus selon RLS |
| RLS-02 | même scénario exécuté comme postgres/service_role | test de sécurité RLS | test déclaré invalide comme preuve de RLS |

Chaque cas doit vérifier aussi l'absence d'effet secondaire (aucune ligne/conversation/membre/message non autorisé) et les erreurs exposées au client.

## 7. Conditions de sortie obligatoires

Le lot d'implémentation ne pourra commencer que lorsque :
- les définitions réelles des 27 migrations appliquées ou un dump de schéma fidèle sont disponibles ;
- une base PostgreSQL locale gratuite et isolée est opérationnelle ;
- les fixtures Auth/JWT synthétiques et le rôle `authenticated` sont configurés ;
- la règle produit d'ouverture DM est approuvée ;
- la politique de blocage sur conversations et médias historiques est décidée ;
- le SQL final a été revu et peut être testé sans toucher au projet actif.

## 8. État des validations

- Revue documentaire : effectuée pour ce lot.
- Test SQL de syntaxe : non exécuté.
- Test comportemental PostgreSQL : non exécuté.
- Test RLS sous rôle authenticated : non exécuté.
- Vérification sur projet actif : aucune écriture, aucun changement.
- CI hébergé / déploiement / merge : aucun.
- Dépense ou service payant : aucun.

## 9. Décision

Le risque est suffisamment documenté pour passer à la préparation de l'environnement isolé et à la collecte des définitions SQL exactes, mais pas à une migration de production. Tant que l'environnement fidèle gratuit n'est pas disponible, la prochaine action sûre est de compléter l'inventaire de schéma et les fixtures locales, sans exécuter de SQL sur Supabase actif.
