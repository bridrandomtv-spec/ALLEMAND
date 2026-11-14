# Lot 422 — Registre des écarts et critères de preuve Messenger

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Périmètre :** consolidation documentaire des Lots 414–421 et préparation de la comparaison avec le catalogue Supabase actif.  
**Statut :** BLOQUÉ pour la comparaison du catalogue actif — export non fourni et autorisation de lecture active non reçue.

## 1. Résultat

Le Lot 422 consolide les preuves disponibles sans prétendre connaître le schéma actuellement installé sur Supabase. Les fichiers SQL du dépôt, les migrations archivées et les anciens constats de catalogue sont des sources historiques ou statiques. Ils ne permettent pas de conclure sur les droits, policies et RPC en production aujourd'hui.

La comparaison active reste bloquée pour deux raisons indépendantes :
- aucun export du catalogue actif n'a été fourni ;
- aucune autorisation explicite n'a été donnée pour interroger en lecture seule le projet Supabase actif.

Aucun appel au projet actif n'a été effectué dans ce lot.

## 2. Registre des écarts consolidé

| ID | Domaine | Preuve disponible | Attendu produit/sécurité | État réel actif |
|---|---|---|---|---|
| V-01 | Vérification gratuite | Le client du dépôt exige un abonnement actif dans `msgRequestVerification` et réutilise `profiles.matricule` | Vérification scolaire gratuite, indépendante du paiement ; numéro confidentiel | Inconnu |
| V-02 | Autorité de validation | Lots 415–417 décrivent une séparation de rôles et de périmètres ; les tests textuels ne prouvent pas les ACL actives | Vérificateur limité à son mandat ; appel différent pour recours ; modérateur sans preuve d'identité | Inconnu |
| D-01 | Création DM | Le client `msgOpenDirect` renvoie `msg_invitation_requise` pour un nouveau DM ; une RPC historique archivée a été signalée comme créatrice de DM | Invitation explicite puis acceptation du destinataire ; aucun chemin RPC/INSERT ne contourne le consentement | Inconnu |
| D-02 | Contrôle d'éligibilité | Le SQL agrégé et l'observation historique Lot 399 divergent sur `msg_can_dm` | Éligibilité vérifiée selon la politique scolaire actuelle | Inconnu |
| B-01 | Blocage | La définition agrégée de `msg_not_blocked` paraît asymétrique | Blocage appliqué à tous les chemins, dans les deux sens selon la règle retenue | Inconnu |
| R-01 | RLS cumulatives | Les tests de dépôt sont principalement textuels ; aucune preuve de l'ensemble des policies actives | Aucune policy permissive héritée ne doit neutraliser les restrictions attendues | Inconnu |
| P-01 | Privilèges RPC | Les migrations archivées et SQL agrégé ne suffisent pas à établir les ACL actuelles, propriétaires et `search_path` | Fonctions privilégiées minimales, droits explicites et absence d'accès public involontaire | Inconnu |
| F-01 | Forum | Décision produit confirmée dans les lots précédents | `ملتقى الطلاب` accessible gratuitement aux comptes élèves actifs, sans vérification ni abonnement | À vérifier dans l'application réelle |

**Règle d'interprétation :** « Inconnu » ne signifie ni « vulnérable » ni « sécurisé ». Cela signifie qu'aucune preuve actuelle suffisante n'est disponible.

## 3. Ordre de preuve requis

Pour chaque ligne, l'audit devra conserver les éléments suivants :
1. définition de fonction complète et signature exacte ;
2. propriétaire, `SECURITY DEFINER`, paramètres `search_path`, volatilité et ACL ;
3. grants sur tables, séquences et fonctions, y compris `PUBLIC` ;
4. liste complète des policies pour chaque table et leur caractère permissif/restrictif ;
5. triggers installés, fonctions déclenchées et état activé/désactivé ;
6. configuration Data API / schémas exposés pour les RPC PostgREST ;
7. tests authentifiés multi-comptes sur baseline isolée, avec identités synthétiques uniquement.

Une migration historique ne sera jamais rejouée pour « corriger » l'état actif. Une différence sera d'abord documentée, puis évaluée dans une branche isolée et une baseline de test.

## 4. Décisions produit maintenues

- `ملتقى الطلاب` : accès gratuit pour tous les comptes élèves actifs, sans abonnement et sans vérification scolaire comme condition d'accès de base.
- `الرسائل` : messagerie privée distincte du forum ; vérification scolaire préalable, puis acceptation explicite du destinataire avant ouverture du DM.
- Vérification : gratuite, indépendante du paiement et de l'abonnement.
- Numéro d'inscription scolaire : privé, non affiché publiquement et non réutilisé comme numéro d'abonnement.
- Blocage : doit empêcher les interactions privées selon une règle bilatérale cohérente et testée.
- Modération sociale : séparation stricte des preuves d'identité et des contenus privés, selon le mandat.

## 5. Actions permises et actions interdites à ce stade

### Permises
- Recevoir et examiner un export de catalogue expurgé.
- Exécuter les cinq requêtes SELECT du Lot 421 après autorisation explicite.
- Continuer les audits statiques de dépôt et la documentation.
- Préparer les scénarios de test PostgreSQL synthétiques.

### Non autorisées / non réalisées
- Aucune écriture sur Supabase actif.
- Aucune migration, modification RLS, grant, RPC, trigger, schéma, Auth, Storage, Realtime ou paiement.
- Aucune lecture de lignes d'élèves, de messages, de pièces d'identité ou de données Auth.
- Aucune création de projet/branche Supabase payante.
- Aucune installation sur le PC, aucun conteneur lancé et aucun service démarré.
- Aucun déploiement Cloudflare, aucune modification de `main), aucun rebase ni fusion PR #17.

## 6. Deux éléments nécessaires pour débloquer le Lot 423

**A. Catalogue Supabase :** l'utilisateur peut soit transmettre les résultats expurgés des cinq requêtes du Lot 421, soit donner une autorisation explicite et limitée à une consultation en lecture seule du catalogue (sans lecture des lignes applicatives).

**B. Environnement local :** fournir la sortie PowerShell en lecture seule demandée au Lot 419 pour déterminer si `psql`, `pg_dump`, Docker ou WSL sont déjà disponibles. Aucun outil ne sera installé sans consentement.

Une fois ces éléments obtenus, le Lot 423 produira une comparaison factuelle « dépôt / catalogue actif / tests » et un verdict par invariant. Tant que les éléments manquent, le verdict global reste **NO-GO pour déclarer Messenger privé terminé**, et non une affirmation que le service est nécessairement exploitable ou nécessairement compromis.
