# Lot 366 — confirmation du référentiel scolaire et des affiliations sur la base active

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Nature : audit documentaire et introspection du catalogue PostgreSQL en lecture seule. Aucune donnée d'élève, aucun contenu Messenger et aucune écriture Supabase consultés.

## 1. Résultat de l'inventaire du dépôt

Les lots précédents couvrent déjà les éléments suivants ; ils ne sont pas reconstruits ici :
- Lot 314 : sources juridiques JORADP et limites de leur portée ;
- Lot 315 : prototype CSV hors ligne, données synthétiques et bouton d'import désactivé ;
- Lot 322 : modèle relationnel logique du registre scolaire ;
- Lot 327 : provenance des sources et preuve d'affiliation ;
- Lot 337 : contrat serveur de l'annuaire et du cycle d'invitations Messenger.

Les contrats existants distinguent correctement le référentiel des établissements et la preuve individuelle d'inscription. Les décrets JORADP peuvent étayer des événements juridiques concernant des établissements ; ils ne prouvent ni l'état exhaustif des lycées actifs pour 2026-2027 ni l'inscription d'un élève donné.

## 2. Vérification du catalogue Supabase actif

Projet : `azjwcybivirvpxbfhyzk`.

Requêtes exécutées uniquement sur `information_schema`, sans lire de lignes métier :
- recherche de tables dont le nom évoque école, lycée, registre, inscription, affiliation ou étudiant ;
- inventaire des noms de tables de base du schéma `public` ;
- lecture des noms/types de colonnes de `profiles`, `wilaya_assignments`, `admin_roles`, `admin_permissions` et `audit_logs`.

Résultats :
- aucune table de registre scolaire, d'établissement, d'inscription ou d'affiliation n'apparaît dans les noms de tables publics actifs ;
- `profiles` contient notamment `wilaya`, `niveau`, `filiere`, `matricule`, `section`, `verif_statut`, `verif_by` et `verif_at` ;
- `wilaya_assignments` contient une affectation d'utilisateur à un code de wilaya et un rôle, pas une relation élève↔lycée ;
- les tables de rôles et d'audit disponibles ne constituent pas un registre de scolarité.

Cette conclusion est limitée au catalogue public interrogé. Elle ne prouve pas qu'aucun service externe ou schéma non inspecté n'existe. Aucune ligne de `profiles`, `wilaya_assignments` ou `audit_logs` n'a été consultée.

## 3. Conclusion fonctionnelle

À ce jour, la base active ne fournit pas de preuve institutionnelle d'affiliation élève↔lycée. Les champs déclaratifs de `profiles`, l'abonnement, le matricule saisi et la validation interne actuelle ne peuvent pas être élevés au rang de preuve officielle.

Il ne faut donc pas :
- construire un annuaire national à partir de `profiles.wilaya/niveau/filiere` ;
- considérer `verif_statut='verifie'` comme une inscription certifiée ;
- créer des invitations inter-lycées basées sur une sélection libre du lycée ;
- importer des noms d'élèves ou des pièces justificatives sans autorisation, base juridique et canal institutionnel ;
- appliquer maintenant le modèle logique du Lot 322 sous forme de DDL.

## 4. Prochaine étape réellement bloquante

La dépendance n'est plus une question de conception SQL : le modèle et les contrats sont déjà documentés. Il manque une source institutionnelle utilisable et l'autorisation de l'exploiter.

À obtenir séparément :
1. un référentiel courant des lycées actifs pour l'année scolaire visée, émis par le ministère ou une Direction de l'Éducation habilitée, avec identifiant national et provenance ;
2. une confirmation écrite du mécanisme autorisé pour vérifier les inscriptions individuelles (API, export sécurisé ou procédure de confirmation par établissement) ;
3. la définition des rôles habilités, du périmètre de validation, de la base juridique, du consentement d'annuaire et des durées de conservation ;
4. un échantillon technique non nominatif ou synthétique, fourni/autorisé par l'émetteur, pour bâtir les tests d'intégration sur PostgreSQL isolé.

En attendant, le travail technique sûr consiste à conserver les prototypes hors ligne et à préparer les tests d'intégration avec des identifiants synthétiques, sans simuler une validation officielle.

## 5. État de sécurité et Git

- Supabase : introspection de catalogue seulement ; aucune écriture, migration, modification Auth/RLS/GRANT/Storage.
- Données : aucun compte, profil nominatif, message, pièce jointe ou inscription réelle consulté.
- Git : travail sur la branche existante de la PR #17 ; aucun changement sur `main), aucune fusion.
- Cloudflare : aucun changement de configuration ni déploiement.
- Messenger : le cycle d'invitations et l'annuaire national ne sont pas déclarés livrés.

## 6. Décision

**NO-GO** pour l'annuaire national réel, l'affiliation certifiée et les invitations nationales tant que la source institutionnelle et le mécanisme d'habilitation ne sont pas établis.

**GO** pour les prototypes hors ligne, les contrats déjà écrits et les tests PostgreSQL isolés alimentés uniquement par des données synthétiques.
