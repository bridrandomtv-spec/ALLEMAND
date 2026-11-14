# Lot 411 — audit identité scolaire, abonnement et accès Messenger

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : audit statique du dépôt uniquement ; aucune lecture de données personnelles ni de base Supabase active.

## 1. Conclusion exécutive

La règle produit recommandée reste : `🌐 ملتقى الطلاب` accessible aux élèves inscrits, avec contenu personnel réservé aux élèves dont l'affiliation est vérifiée ; `💬 الرسائل` accessible aux élèves vérifiés, avec demande de contact/consentement et sans abonnement obligatoire pour les échanges textuels essentiels.

Le dépôt contient déjà un mécanisme de vérification scolaire pour Messenger, mais son parcours client utilise actuellement un numéro d'abonnement actif comme condition d'envoi de la demande. Cette dépendance doit être clarifiée et, si l'objectif est de laisser les échanges essentiels gratuits, remplacée par une preuve scolaire indépendante du paiement.

## 2. Points d'entrée constatés

### Authentification et rôle d'interface
- `auth.js` possède un mécanisme local basé sur `localStorage` et crée une session avec rôle/niveau/filière ; cette session ne porte pas d'état de vérification scolaire ni d'abonnement.
- `app.js` utilise cette session locale pour afficher la vue `multaqa` aux comptes de rôle `eleve`. Il s'agit d'une garde d'interface, pas d'une preuve d'identité ni d'une autorisation serveur.
- Le client Supabase distinct, exposé par `supabase/supabase.js`, utilise `auth.getSession()` et `auth.getUser()` pour ses opérations backend. Les deux modèles de session ne doivent pas être confondus.

### Abonnement pédagogique
- `access.js` consulte les abonnements actifs par le backend/RLS pour débloquer le contenu pédagogique payant.
- `paywall.js` affiche les offres ; rien dans les fichiers examinés ne justifie de réutiliser ce paywall pour fermer l'accès à la communauté scolaire.
- L'état d'abonnement doit rester séparé du statut d'élève vérifié.

### Vérification scolaire Messenger
- `msgMyVerification` lit `verif_statut`, `matricule` et `section` depuis le profil.
- `msgRequestVerification` exige actuellement un identifiant numérique correspondant à une ligne `subscriptions` active appartenant au compte connecté, puis demande le passage à `en_attente`.
- La file de vérification expose les demandes aux personnes habilitées ; la validation finale est une action distincte.
- La fonction SQL `msg_can_dm` présente dans `supabase/msg_schema.sql` exige deux profils au statut `verifie` et un groupe scolaire commun (wilaya, niveau, filière). C'est le bon principe de séparation entre compte inscrit et identité vérifiée.
- Le script SQL est un artefact du dépôt ; cet audit ne confirme pas qu'il soit identique au schéma actuellement déployé.

## 3. Écarts et risques à traiter avant activation sociale

1. **Couplage produit paiement/vérification :** l'interface client impose un abonnement actif avant la demande de vérification. Cela rend la messagerie essentielle indirectement payante, contrairement à la politique recommandée.
2. **Contrôle d'abonnement côté client :** le parcours JS vérifie l'abonnement avant l'UPDATE du profil. Le trigger `profiles_verif_guard` décrit dans le SQL autorise à l'utilisateur sa propre transition vers `en_attente`, mais ne vérifie pas lui-même l'existence d'un abonnement actif. Il faut valider les droits de colonnes, policies et triggers réellement déployés ; le client seul ne doit jamais être la frontière de sécurité.
3. **Profil visible aux membres :** le script Messenger contient une policy de visibilité entre membres sur la table `profiles`. Comme une policy RLS contrôle les lignes et non automatiquement les colonnes, il faut auditer les grants de colonnes et vérifier qu'aucun matricule, e-mail ou autre identifiant sensible n'est lisible par les pairs.
4. **Consentement DM :** `msg_can_dm` impose vérification et groupe scolaire commun, mais ce contrôle n'est pas à lui seul une demande de contact acceptée. Le flux d'invitation/consentement doit être audité séparément avant de déclarer la règle complète.
5. **ملتقى الطلاب :** le garde actuel dans `app.js` ne sécurise pas les futures lectures/écritures de publications. Chaque audience, recherche, compteur, commentaire et notification devra avoir un contrôle serveur/RLS.
6. **Sources de vérité :** les rôles locaux, profils Supabase, état de vérification et abonnement ne doivent pas être fusionnés en un seul booléen côté navigateur.

## 4. Matrice d'accès cible proposée

| État du compte | ملتقى الطلاب | الرسائل |
|---|---|---|
| Inscrit, non vérifié | Présentation et annonces institutionnelles uniquement ; pas de contenu personnel élève | Pas d'annuaire privé ni de DM ; accès au parcours de vérification |
| Élève vérifié, sans abonnement | Fil et interactions autorisés par audience | Texte essentiel, demandes de contact et conversations acceptées |
| Élève vérifié, abonnement actif | Mêmes droits sociaux de base ; avantages premium éventuels hors fonctions essentielles | Mêmes droits essentiels ; options avancées uniquement si validées et sans contourner le consentement |
| Abonnement actif, non vérifié | Aucun accès au contenu personnel des élèves | Aucun DM avant vérification |
| Vérification expirée/révoquée ou compte suspendu | Suspension des actions et contenus sensibles selon politique | Suspension des nouveaux DM et accès selon politique de rétention |
| Professeur/parent/administrateur | Vue propre à son rôle ; aucune élévation par URL | Permissions distinctes ; modération ne signifie pas lecture générale des conversations privées |

## 5. Décisions techniques préalables

- Définir une source de preuve scolaire gratuite et vérifiable indépendamment du paiement : validation par établissement/autorité autorisée ou autre source officiellement disponible.
- Conserver l'identifiant d'abonnement dans le système de facturation, pas comme preuve d'identité scolaire ni comme champ de profil visible.
- Ne jamais exposer numéro d'inscription, numéro d'abonnement, téléphone, e-mail ou document justificatif aux autres élèves.
- Utiliser une projection minimale de profil pour les listes de contacts.
- Mettre en place un vrai flux de demande de contact, acceptation/refus, révocation et blocage ; une relation sociale ne crée pas de DM.
- Faire des tests avec comptes synthétiques : non vérifié, vérifié sans abonnement, vérifié avec abonnement, abonnement sans vérification, rôle professeur/parent/admin, vérification révoquée, blocage, refus de DM, accès direct aux identifiants et lecture de colonnes sensibles.
- Vérifier le schéma et les policies sur un environnement de test isolé, puis seulement proposer une migration ; aucune modification de base active dans ce lot.

## 6. Périmètre exécuté

- Lecture de `auth.js`, `app.js`, `access.js`, `paywall.js`, `supabase/supabase.js`, `supabase/schema.sql`, `supabase/msg_schema.sql` et des deux migrations d'archive de séparation/scoping de la vérification.
- Aucun appel à la base Supabase active, aucune lecture de profil ou de message d'élève, aucun SQL exécuté, aucune migration, aucune modification Auth/RLS/Storage/Realtime, aucun paiement, aucun déploiement Cloudflare et aucune fusion.
- Les constats décrivent le dépôt et ses scripts ; ils ne certifient pas l'état de la base active.

## 7. Décision à retenir

**Ne pas conditionner l'accès essentiel à `ملتقى الطلاب` ou à `الرسائل` à l'abonnement.** Conditionner les contenus sociaux personnels et les conversations privées à la vérification scolaire, au rôle, à l'état du compte et au consentement. L'abonnement reste une couche commerciale séparée.
