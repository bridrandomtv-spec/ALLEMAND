# Lot 418 — protocole de baseline PostgreSQL isolée sans coût

Date : 13 novembre 2026  
Statut : protocole préparatoire uniquement ; aucun environnement créé, aucune connexion DB ouverte

## 1. Objectif

Définir une méthode de reconstruction et de test de la sécurité Messenger/vérification scolaire sans modifier le projet Supabase actif, sans créer de branche Supabase et sans engager de dépense.

Le banc de test doit reproduire les structures et les autorisations nécessaires, pas les données réelles des élèves.

## 2. Règle de coût et d'autorisation

- Ne pas activer de plan payant Supabase, de compute additionnel, d'extension facturée, de stockage supplémentaire ou de service externe.
- Ne pas créer de nouveau projet cloud Supabase pour les tests.
- Ne pas activer de branche Supabase payante.
- Ne pas déployer Cloudflare ni créer de Worker.
- Le candidat prioritaire est PostgreSQL local sur le PC de travail, uniquement si PostgreSQL ou un environnement local compatible est déjà disponible.
- Docker n'est qu'une option si déjà installé et opérationnel ; ne pas l'installer ni télécharger des images volumineuses sans validation.
- Si aucun moteur local n'est disponible, s'arrêter et présenter les options gratuites et leurs prérequis avant toute installation.
- Aucun changement de configuration Windows, installation de logiciel, ouverture de port, synchronisation cloud ou création de ressource sans accord distinct.

## 3. Sources exactes requises

### Source A — migrations réellement appliquées

- Récupérer les 27 corps SQL exacts déjà répertoriés dans le Lot 333/341 depuis la source autorisée qui les a déployés ou depuis l'historique contrôlé disponible.
- Vérifier les versions, noms et empreintes SHA-256 du manifeste Lot 342 pour les 11 migrations archivées.
- Les archives sous `docs/architecture/migration-archive/` sont des preuves historiques, pas un lot à rejouer en plus des mêmes migrations.
- Vérifier l'ordre chronologique exact et identifier les migrations manquantes du dépôt.
- Le catalogue de migrations seul n'est pas une baseline initiale complète.

### Source B — baseline de schéma

Préparer un export contrôlé, en lecture seule, qui couvre au minimum :

- schémas, tables, colonnes, types, valeurs par défaut, contraintes et index ;
- fonctions, signatures, propriétaires, langage, `SECURITY DEFINER/INVOKER`, `search_path` et ACL EXECUTE ;
- triggers et fonctions appelées ;
- policies RLS, commandes, rôles cibles, expressions USING et WITH CHECK ;
- GRANT/REVOKE de tables, colonnes, schémas, séquences et fonctions ;
- rôles, memberships, attributs pertinents et privilèges hérités ;
- vues et propriétés de sécurité ;
- buckets Storage, limites et policies liées à Messenger ;
- publications Realtime et tables publiées ;
- extensions requises et versions compatibles.

L'export ne doit inclure aucune ligne de données utilisateur, message, pièce jointe, e-mail, numéro scolaire ou secret.

### Source C — paramètres et versions

- Version PostgreSQL de référence (les rapports précédents indiquent PostgreSQL 17.6 pour le projet source ; confirmer la version exacte avant reproduction).
- Versions Supabase/PostgREST/Auth pertinentes si des fonctions `auth.uid()`, `auth.jwt()` ou schémas Supabase sont simulés.
- Paramètres de rôle et de claims synthétiques, sans token ni clé du projet réel.
- Scripts de test et CI de la branche, avec commit et empreinte consignés.

## 4. Préparation du moteur local

Avant toute commande d'installation :

1. Vérifier en lecture seule si `psql`, `pg_dump`, `pg_restore`, `postgres`, Docker ou Podman sont déjà présents.
2. Relever leurs versions et l'espace disque disponible.
3. Ne pas exposer le serveur local sur le réseau ; utiliser localhost et un compte de test dédié.
4. Ne pas copier de secret, URI de connexion, clé API ou fichier `.env` du projet actif.
5. Ne pas connecter le banc local au projet Supabase distant.
6. Si le moteur local est absent, produire un plan d'installation optionnel et attendre l'accord avant de l'installer.

Le protocole ne suppose pas que Docker, PostgreSQL local ou WSL soient déjà installés sur le PC.

## 5. Séquence de reconstruction

1. Créer un répertoire local temporaire hors du dépôt de production, avec sauvegarde de tout fichier de travail existant.
2. Initialiser une base locale vide isolée.
3. Appliquer le baseline de référence validé.
4. Appliquer uniquement les migrations manquantes dans leur ordre authentifié, une fois leur provenance et leur empreinte vérifiées.
5. Comparer le catalogue reconstruit à l'export de référence : tables, colonnes, contraintes, fonctions, triggers, policies, grants, ACL et extensions.
6. Produire un rapport de divergences avant de lancer les tests.
7. Ne jamais masquer une différence par l'exécution improvisée d'un script agrégé historique.

## 6. Jeu de comptes synthétiques

Créer uniquement des UUID et identités fictives, sans adresse e-mail réelle ni lien avec les utilisateurs existants :

- élève A : non vérifié, sans abonnement ;
- élève B : vérifié, sans abonnement ;
- élève C : non vérifié, avec abonnement synthétique ;
- élève D : vérifié, abonnement synthétique ;
- vérificateur établissement X ;
- vérificateur établissement Y ;
- vérificateur wilaya X ;
- vérificateur wilaya Y ;
- superviseur central ;
- modérateur forum sans droit de vérification ;
- compte suspendu ;
- compte révoqué.

Les comptes de test et données de test doivent être supprimables et ne jamais être importés en production.

## 7. Batterie de tests

### Vérification scolaire

- dépôt gratuit d'une demande pour A et C ;
- absence de dépendance au statut d'abonnement ;
- refus de l'auto-validation ;
- contrôle du périmètre établissement et wilaya ;
- révocation/expiration immédiate du vérificateur ;
- appel traité par un autre agent ;
- absence de fuite de matricule et de pièces dans profils, annuaire, notifications, logs et file ;
- profil historique `verifie` traité selon une règle de compatibilité explicite.

### Messenger

- B et D peuvent demander un contact selon les règles d'éligibilité ;
- A et C ne peuvent pas contourner la vérification DM ;
- aucun DM avant acceptation explicite de l'invitation ;
- refus et blocage dans les deux sens ;
- vérification de tous les chemins : RPC, INSERT direct, ajout de membres, invitations et chemins historiques ;
- révocation de vérification et suspension empêchent les nouveaux accès selon politique ;
- absence de fuite par Realtime, Storage et recherche.

### Forum

- les élèves actifs A, B, C et D peuvent accéder à la base gratuite de `ملتقى الطلاب` ;
- l'abonnement n'augmente pas les droits sociaux de base ;
- la vérification n'est pas un prérequis à la lecture/publication/commentaire de base ;
- blocage, signalement, modération et anti-spam restent appliqués.

## 8. Critères GO / NO-GO

**GO vers préparation d'une migration (pas vers production)** uniquement si :

- provenance et intégralité de la baseline sont établies ;
- reconstruction locale reproductible sans données personnelles ;
- aucune divergence inexpliquée de schéma ou ACL ;
- tous les tests négatifs et positifs passent ;
- aucun secret ou accès au projet actif n'est requis par le banc local ;
- revue indépendante des changements SQL et du plan de retour arrière terminée.

**NO-GO** si une migration manque, si la baseline est partielle, si un test repose uniquement sur le masquage UI, si une policy permissive cumulée n'est pas comprise, ou si le seul moyen proposé entraîne une facturation non autorisée.

## 9. État à ce jour

- Aucun moteur local n'a été détecté dans le cadre du Lot 418 ; aucune inspection du PC n'a été lancée.
- Aucun export du schéma actif n'a été demandé ou exécuté dans ce lot.
- Aucun nouveau projet Supabase, branche, compute ou service payant créé.
- Aucun SQL exécuté ; aucune donnée utilisateur consultée.
- Aucun déploiement Cloudflare ; aucune modification de `main` ou fusion PR #17.

## 10. Décision avant la prochaine action

La prochaine opération autorisée doit être un contrôle local en lecture seule de la présence et des versions de PostgreSQL/Docker/WSL sur le poste de travail. Si rien n'est déjà disponible, s'arrêter et demander confirmation avant toute installation.

## Suite — Lot 419

Contrôle de prérequis local en lecture seule, puis décision sur la voie de test gratuite. Aucun accès distant, aucune installation et aucune ressource cloud sans autorisation distincte.
