# Lot 327 — preuve de provenance des établissements et des affiliations élèves

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : audit documentaire et spécification ; aucune donnée réelle importée, aucune migration, aucun accès à une base active.

## 1. Résultat de l'audit du dépôt

Les lots antérieurs sont présents :
- Lot 314 : inventaire de sources juridiques officielles.
- Lot 315 : prototype CSV autonome, explicitement synthétique, sans endpoint ni stockage.
- Lots 316-A à 316-D : protocole institutionnel proposé, rapprochement et revue hors ligne.
- Lots 317 à 321 : journal de décisions et contrôles de cohérence/chronologie.
- Lot 322 : modèle relationnel logique du registre.
- Lots 323 à 326 : audit Messenger, défauts d'autorisation et plan de verrouillage serveur.

Le dépôt contient des références au JORADP et des prototypes de traitement, mais aucun export ministériel complet et courant, aucun connecteur à un registre ministériel, aucune base de données nominative d'inscriptions et aucun mécanisme serveur établissant actuellement une relation vérifiée compte-élève ↔ lycée ↔ année scolaire.

Les données SYN/TEST du prototype ne sont pas des établissements réels. Un statut simulé « accepté » dans les outils hors ligne ne constitue pas une décision administrative.

## 2. Sources confirmées et portée probante

### 2.1 Journal officiel — actes de création/suppression

Le Lot 314 a identifié les textes suivants sur le domaine officiel JORADP :
- Décret exécutif n° 24-224 du 2 juillet 2024, JO n° 48 du 14 juillet 2024 : https://www.joradp.dz/FTP/jo-francais/2024/F2024048.pdf
- Décret exécutif n° 22-253 du 30 juin 2022, JO n° 48 du 17 juillet 2022 : https://www.joradp.dz/FTP/jo-francais/2022/F2022048.pdf
- Décret exécutif n° 21-519 du 26 décembre 2021, JO n° 97 du 27 décembre 2021 : https://www.joradp.dz/FTP/jo-francais/2021/F2021097.pdf

Ces actes peuvent justifier un événement juridique précis et certains attributs d'identification d'un établissement. Ils ne représentent pas à eux seuls un instantané exhaustif des lycées actifs à la rentrée 2026-2027. Un décret de création ne prouve pas l'ouverture actuelle ; une liste partielle ne permet pas de conclure qu'un établissement absent est fermé.

La loi n° 08-04, article 82, est également référencée par le Lot 314 : https://www.premier-ministre.gov.dz/fr/document/loi-n0-08-04-portant-loi-d-orientation-sur-l-education-nationale

### 2.2 Sources insuffisantes pour certifier un répertoire courant

Les statistiques ONS citées dans les lots antérieurs sont agrégées et ne fournissent pas la liste nominative exhaustive. Les annuaires privés, cartes contributives, résultats de moteur de recherche et listes de démonstration ne sont pas des substituts à un export institutionnel.

### 2.3 Preuve d'inscription individuelle

Aucun des actes ci-dessus ne prouve qu'un élève précis est inscrit dans un lycée. Cette preuve doit provenir d'une source distincte autorisée : idéalement un flux institutionnel de scolarité ou un export signé/transmis par le service compétent ; à défaut, une confirmation par un responsable d'établissement dont le mandat et le périmètre ont été vérifiés hors bande.

Un matricule, une carte téléversée sans contrôle, un nom de lycée choisi dans une liste, une wilaya, une classe ou un statut `profiles.verif_statut='verifie'` ne suffisent pas à prouver l'affiliation officielle.

## 3. Deux niveaux de confiance obligatoires

| Niveau | Question | Preuve admissible | Ce que cela autorise |
|---|---|---|---|
| Référentiel établissement | Ce lycée existe-t-il et quel est son statut administratif pour la période ? | Export émis par l'autorité compétente, ou actes officiels complets et rapprochement institutionnel approuvé | Référencer le lycée dans le catalogue interne avec provenance et dates |
| Affiliation élève | Cet élève est-il inscrit dans ce lycée pour cette année scolaire ? | Export nominatif autorisé, intégration officielle, ou confirmation traçable d'un responsable habilité dans son établissement | Créer/renouveler une affiliation vérifiée après contrôle serveur |

Les deux niveaux ne doivent jamais être confondus ni hérités automatiquement l'un de l'autre.

## 4. Demande institutionnelle à préparer

Destinataires à confirmer par voie officielle : ministère de l'Éducation nationale et, pour un périmètre local, Direction de l'Éducation de wilaya compétente.

Demander séparément :

**A. Référentiel des lycées**
- liste des lycées actifs à la date d'extraction et pour l'année scolaire 2026-2027 ;
- identifiant national officiel et définition de sa stabilité ;
- nom officiel arabe/français, wilaya, commune, type et statut ;
- dates d'effet et références des créations, fermetures, fusions et changements ;
- autorité propriétaire, service émetteur, dictionnaire de données, version, fréquence de mise à jour et procédure de correction.

**B. Vérification des inscriptions**
- existence ou non d'un service officiel autorisé de vérification des inscriptions ;
- à défaut d'API, possibilité d'un export périodique sécurisé, signé ou transmis par canal institutionnel ;
- champs minimaux autorisés : identifiant de rapprochement, établissement officiel, année scolaire, niveau/classe/filière et état d'inscription ;
- base juridique, finalité, habilitations, règles de rectification, conservation, sécurité et conditions de partage ;
- procédure de transfert, radiation, réinscription et clôture de l'année scolaire.

Ne pas demander ni aspirer un fichier nominatif sans accord explicite, base juridique, canal sécurisé et définition des responsabilités. Ne pas supposer qu'une API existe.

## 5. Chaîne de provenance obligatoire

Chaque source reçue doit être accompagnée de :
1. autorité et service émetteurs, preuve du canal institutionnel et contact de vérification ;
2. référence du document/acte, date de publication ou d'extraction, année scolaire et périmètre ;
3. fichier original conservé en lecture seule dans un espace privé contrôlé ;
4. empreinte SHA-256, taille, format, encodage et horodatage de réception ;
5. version précédente et lien de succession, sans écrasement ;
6. opérateur, approbateur distinct, décisions, motifs et corrections ;
7. résultat de rapprochement, anomalies, couverture connue et limites.

Une empreinte SHA-256 garantit l'identité des octets comparés ; elle ne prouve ni l'identité de l'émetteur ni la signature juridique du document.

## 6. Règles de rattachement élève

- Une affiliation est datée et liée à une année scolaire explicite.
- Elle porte un établissement canonique, un niveau/classe/filière si fournis par la source, une méthode de preuve, une référence source et une décision.
- L'élève ne peut ni approuver sa propre affiliation ni changer seul l'établissement vérifié.
- L'approbateur doit être habilité pour le lycée concerné ; un professeur ou administrateur technique n'est pas automatiquement autorisé.
- Un transfert clôt l'affiliation précédente et crée un nouvel événement ; il ne réécrit pas l'historique.
- Une affiliation expirée, révoquée ou en attente ne rend pas le compte visible dans l'annuaire national des élèves.
- Le matricule et les justificatifs ne sont jamais exposés dans Messenger.
- Minimiser les données personnelles ; définir la base juridique et la rétention avant toute collecte.

## 7. Conséquences sur Messenger

Tant que les deux niveaux de preuve ne sont pas disponibles et validés :
- pas d'annuaire national présenté comme réel ;
- pas d'invitations inter-lycées fondées sur des profils déclaratifs ;
- pas de suppression de la restriction actuelle par simple retrait du filtre wilaya/niveau/filière ;
- pas d'accès aux données de scolarité depuis le navigateur.

Après obtention et validation des sources, le futur annuaire devra passer par une RPC serveur paginée et minimisée, qui ne renvoie que les champs publics autorisés, vérifie l'affiliation active de l'année courante, les préférences de visibilité, les blocages et les limites anti-énumération.

## 8. Décisions et critères de sortie

**GO maintenant :** conserver les prototypes hors ligne, préparer la demande institutionnelle, améliorer les tests sur données synthétiques.

**NO-GO :** inventer ou publier une liste exhaustive, charger des dossiers réels dans la maquette, importer des inscriptions sans autorisation, créer une table/migration, modifier Auth/RLS/GRANT/Storage, activer l'annuaire ou les invitations nationales.

Le lot ne sera considéré comme prêt pour implémentation qu'après réception d'une source établissement officielle et courante, clarification écrite du canal de vérification des inscriptions, validation des rôles habilités, de la base juridique et de la politique de conservation. La migration et les tests d'intégration devront ensuite être autorisés séparément et exécutés sur une base jetable.

## 9. État Git et opérations

Ce lot est documentaire. Aucun changement de `main`, aucun merge de PR #17, aucune migration, aucune écriture Supabase, aucun changement Cloudflare et aucun déploiement de production. PR #17 reste ouverte et non fusionnée. Aucun MFA/2FA et aucune facturation.
