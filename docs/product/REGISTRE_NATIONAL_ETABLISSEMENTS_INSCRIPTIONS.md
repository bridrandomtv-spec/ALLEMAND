# Registre national des établissements et inscriptions scolaires — conception

Date : 12 novembre 2026  
Branche de travail : `design/prototypes-67-74-alignment`  
Statut : **conception produit et sécurité uniquement — aucune migration exécutable, aucun déploiement**

## 1. Objectif et séparation des responsabilités

Le registre doit fournir deux vérités distinctes :

1. **Référentiel des établissements** : quels lycées existent, où ils se trouvent, sous quel identifiant administratif stable, et s'ils sont actifs.
2. **Inscription d'un élève** : quel compte correspond à quel élève inscrit dans quel établissement, pour quelle année scolaire, classe/niveau et filière, avec quelle preuve et quelle validation.

L'existence d'un lycée dans le référentiel ne prouve jamais qu'un compte y est inscrit. Le profil utilisateur ne constitue pas le registre institutionnel.

Le service de messagerie ne doit lire que des affiliations vérifiées et actives par une interface serveur limitée. Il ne doit pas interroger directement les tables administratives.

## 2. Sources officielles : ce qui est établi et ce qui ne l'est pas

### Sources trouvées

- Le Bulletin officiel de l'Éducation nationale n° 618 (juillet–août 2022), publié sur le domaine officiel du ministère, contient notamment des décrets de création et d'annulation d'établissements et des références à des lycées. Il constitue une source juridique utile pour justifier des changements précis, mais ce n'est pas un export exhaustif et actualisé de tous les lycées. Référence : https://www.education.gov.dz/wp-content/uploads/2023/06/boen-618-1.pdf
- L'Office national des statistiques publie des tableaux agrégés du nombre de lycées par wilaya pour des années scolaires antérieures. Ces statistiques ne donnent pas la liste nominative ni les affiliations individuelles. Référence : https://www.ons.dz/IMG/pdf/Education-3.pdf

### Sources non établies

Aucun endpoint public, fichier CSV complet, API, registre central ou export officiel actualisé contenant la liste exhaustive des lycées et leurs identifiants administratifs n'a été confirmé dans cette enquête. Aucun registre nominatif d'inscriptions d'élèves n'a été découvert dans le dépôt ou le schéma Supabase actif.

**Conséquence :** ne pas fabriquer une liste présentée comme officielle à partir de recherches web, de cartes, de statistiques, de données ouvertes non vérifiées ou de fichiers de maquette. La prochaine démarche d'approvisionnement devra obtenir un export ou une validation écrite auprès du ministère / des Directions de l'Éducation de wilaya (DEW).

## 3. Modèle métier cible (conceptuel, non SQL)

### Référentiel géographique
- Wilaya : code administratif officiel, noms arabe/français, dates de validité.
- Commune : code officiel, noms arabe/français, rattachement à une wilaya, dates de validité.
- Ne pas figer arbitrairement le nombre de wilayas : versionner le référentiel administratif officiel et ses dates d'effet.

### Établissement
- Identifiant interne UUID.
- Code établissement officiel (unique, fourni/confirmé par l'autorité ; jamais inventé).
- Nom officiel arabe et français.
- Type (lycée général/technique/autre catégorie officiellement fournie).
- Wilaya et commune par clés étrangères.
- Adresse administrative limitée à ce qui est nécessaire.
- Statut : actif, fermé, fusionné, suspendu ou à confirmer.
- Dates d'effet, source documentaire, date de dernière confirmation et historique des changements.
- Alias / anciennes dénominations conservés pour la recherche, jamais utilisés comme identifiant.

### Inscription élève
- Identifiant UUID ; compte Auth lié par FK.
- Établissement référencé par FK.
- Année scolaire ; niveau ; filière ; classe/section (si confirmées).
- Statut : brouillon, en attente, vérifiée, rejetée, expirée, transférée.
- Méthode de preuve et référence de source ; horodatages de demande et de décision.
- Décideur administratif et motif codifié de décision ; journal d'audit.
- Historique conservé : un transfert clôt l'inscription précédente et crée une nouvelle relation, sans écraser l'historique.
- Contrainte métier : au plus une inscription vérifiée active par élève et année scolaire, sauf exception explicitement modélisée.

## 4. Parcours de preuve recommandé

### Option A — code d'affiliation émis par le lycée (voie privilégiée)
1. L'établissement est importé et confirmé dans le référentiel.
2. Un responsable habilité de l'établissement reçoit un compte administratif après contrôle hors bande.
3. Le système génère des codes à usage unique, limités dans le temps et rattachés à un établissement, une année scolaire et éventuellement une classe.
4. L'élève saisit le code ; le serveur le consomme une seule fois et crée une demande d'inscription.
5. L'inscription passe à vérifiée uniquement après confirmation du responsable ou d'un rapprochement officiel autorisé.

Un code partagé sur les réseaux sociaux ou réutilisable ne doit pas suffire.

### Option B — import institutionnel de listes d'élèves
- Import CSV/XLSX signé ou transmis par un canal institutionnel vérifié.
- Modèle de colonnes approuvé et versionné ; validation des doublons et des identifiants.
- Prévisualisation, rapport d'erreurs, approbation par deux personnes pour les imports sensibles.
- Journal du fichier source, empreinte cryptographique, auteur, date et lot d'import.
- Aucun import d'une liste reçue d'un simple utilisateur comme preuve officielle.

### Option C — vérification documentaire manuelle (secours)
- Téléversement facultatif d'un justificatif uniquement si le canal et la politique de conservation sont approuvés.
- Stockage privé, accès restreint au personnel habilité, liens signés courts, aucun document dans le profil public ou le chat.
- Ne collecter que les éléments strictement nécessaires ; masquer/supprimer les informations non requises.
- Rétention courte et suppression planifiée après décision, sauf obligation réglementaire contraire.
- Une simple saisie libre de matricule/section n'est pas une preuve.

## 5. Rôles et contrôle

Rôles conceptuels à valider avant implémentation :
- Administrateur central du référentiel : gère établissements et sources.
- Responsable d'établissement : valide les affiliations de son propre lycée.
- Agent de la Direction de l'Éducation de wilaya : contrôle le périmètre de sa wilaya.
- Modérateur de la plateforme : traite les signalements Messenger, sans pouvoir créer une affiliation institutionnelle par défaut.
- Élève : demande et consulte le statut de sa propre inscription.

Ces rôles ne sont pas réputés exister dans le système actuel. Il faut une matrice RBAC dédiée, un processus de vérification des responsables et une séparation des tâches. Ne pas attribuer un rôle de validation à tout profil `prof` ou `admin` sans preuve de mandat.

## 6. Contrat de découverte Messenger

Une RPC serveur dédiée ne retourne que :
- identifiant opaque du compte ;
- nom d'affichage / pseudo choisi ;
- établissement vérifié et wilaya, uniquement si la politique de visibilité l'autorise ;
- niveau et filière, seulement si utiles et autorisés.

Ne jamais retourner email, téléphone, matricule, justificatif, date de naissance, adresse personnelle, notes, données parentales, statut de modération ni historique d'inscription.

Garde obligatoire avant découverte ou invitation :
- compte actif et éligible ;
- inscription de l'année scolaire courante vérifiée et non expirée ;
- préférences de découverte et de réception respectées ;
- blocage bilatéral absent ;
- limitation de fréquence, pagination et protection anti-énumération ;
- aucun export massif de l'annuaire.

Le profil non inscrit ou dont l'inscription est en attente ne doit pas apparaître dans l'annuaire national des élèves.

## 7. Import, qualité et cycle annuel

- Source de chaque ligne traçable (autorité, document/export, date, version, empreinte).
- Normalisation des noms arabe/français sans perdre la graphie officielle.
- Détection des doublons par code officiel ; rapprochement manuel des homonymes, jamais fusion automatique sur le seul nom.
- Contrôles : commune dans la wilaya, établissement de type lycée, statut cohérent, code stable, dates non contradictoires.
- Processus de correction et contestation.
- Révision annuelle des établissements actifs et des inscriptions ; expiration automatique à la fin de l'année scolaire, avec période de renouvellement.
- Transferts : historique conservé, une seule affiliation active par année sauf cas documenté.
- Sauvegarde, restauration et journalisation des opérations administratives.

## 8. Plan d'implémentation en lots

| Lot | Travail | Sortie |
|---|---|---|
| 313 | Modèle de données et gouvernance (ce document) | Contrat conceptuel et limites documentées |
| 314 | Inventaire des sources officielles et protocole d'obtention | Source nominative exhaustive ou décision formelle d'approvisionnement |
| 315 | Maquette admin du référentiel / import | Prévisualisation et rapport d'import sur données synthétiques |
| 316 | Migration versionnée et tests PostgreSQL isolés | Tables, contraintes, RLS et tests sans toucher au projet actif |
| 317 | Processus d'affiliation et validation des responsables | Parcours testé avec identités synthétiques |
| 318 | RPC annuaire et invitations Messenger | Découverte nationale sécurisée, seulement après preuve réelle |

## 9. Critères NO-GO

Ne pas activer le registre ni l'annuaire national tant que :
- un fichier/flux source officiel exhaustif ou une validation institutionnelle documentée n'est pas obtenu ;
- les identifiants officiels et les règles de mise à jour ne sont pas connus ;
- les responsables habilités et leur preuve de mandat ne sont pas définis ;
- les règles de confidentialité, de conservation et de contestation ne sont pas approuvées ;
- les tests RLS/RPC, anti-énumération, transfert et révocation ne sont pas passés sur un environnement isolé.

## 10. État du travail

Ce document est une conception, pas une migration. Il ne crée pas de fausse liste d'établissements et ne prétend pas disposer d'un accès au registre national du ministère.

Aucune table, colonne, policy, fonction, grant, Auth, Storage ou donnée Supabase n'est modifiée. Aucun paramètre Cloudflare, déploiement, merge ou changement de `main`. La PR #17 reste ouverte.


## 11. Lot 314 — inventaire des sources officielles (12 novembre 2026)

Une source primaire a été confirmée : le JORADP. Le décret exécutif n° 24-224 du 2 juillet 2024 (JO n° 48 du 14 juillet 2024) publie des annexes de création et de suppression de lycées pour la rentrée 2022-2023, avec code wilaya, code commune, numéro d'identification nationale, dénomination et adresse : https://www.joradp.dz/FTP/jo-francais/2024/F2024048.pdf. Les numéros 9609 à 9662 apparaissent dans les entrées de création reproduites.

Le décret exécutif n° 22-253 (JO n° 48 du 17 juillet 2022) contient des listes similaires pour la rentrée 2021-2022 : https://www.joradp.dz/FTP/jo-francais/2022/F2022048.pdf. Le décret n° 21-519 (JO n° 97 du 27 décembre 2021) constitue une source historique complémentaire : https://www.joradp.dz/FTP/jo-francais/2021/F2021097.pdf. L'article 82 de la loi n° 08-04 prévoit que la création et la suppression des lycées interviennent par décret : https://www.premier-ministre.gov.dz/fr/document/loi-n0-08-04-portant-loi-d-orientation-sur-l-education-nationale.

**Limite essentielle :** ces textes sont des journaux d'événements juridiques, pas un instantané exhaustif des lycées actifs en 2026-2027. Les statistiques ONS sont agrégées et les annuaires privés/cartographiques ne sont pas des sources officielles exhaustives. Aucun export public consolidé et actualisé n'a été confirmé pendant la recherche (cela ne prouve pas qu'un export interne n'existe pas).

Décision : demander au ministère/DEW un export officiel des établissements actifs, accompagné des identifiants, codes géographiques, statuts, dates d'effet, provenance et procédure de mise à jour. Ne pas reconstituer une liste dite exhaustive à partir des seuls actes partiels. Aucun import Supabase ni activation d'annuaire/invitations nationales. Rapport détaillé : `docs/product/LOT-314-INVENTAIRE-SOURCES-OFFICIELLES-LYCEES.md`.

Lot suivant : 315 — maquette de prévisualisation/import sur données synthétiques explicitement fictives, sans écriture dans Supabase.


## 12. Lot 315 — maquette isolée de prévisualisation CSV (12 novembre 2026)

Un prototype autonome a été ajouté sous `prototypes/` :

- `registry-import-preview.html` : interface de chargement local, indicateurs, tableau de prévisualisation, modèle CSV vide et rapport d'anomalies.
- `registry-import-core.mjs` : parseur CSV et contrôles de structure/métier.
- `registry-import-core.test.mjs` : tests Node natifs.

Le contrat provisoire comporte les champs `source_id`, `identifiant_national`, `nom_ar`, `nom_fr`, `wilaya_code`, `commune_code`, `statut`, `date_effet`, `reference_acte`, `source`, `annee_scolaire`. Les statuts techniques acceptés dans la maquette sont `actif`, `suspendu`, `ferme`, `fusionne` ; ils restent à aligner sur la nomenclature ministérielle. Les codes géographiques restent des chaînes, sans prétendre les valider sur une nomenclature officielle.

Contrôles : en-têtes exacts, lignes surdimensionnées, champs obligatoires, date calendaire ISO, statut, doublons des deux identifiants, marquage des valeurs `SYN-*` et sources fictives. Les cellules du rapport CSV sont neutralisées contre l'interprétation de formules dans un tableur.

**Sécurité et portée :** trois lignes de démonstration sont explicitement fictives et comportent un doublon volontaire. Le module est isolé, n'est pas relié à l'application ni à Supabase, n'effectue aucun appel réseau et ne persiste aucun fichier. Le bouton d'import est désactivé. Il ne peut pas vérifier l'authenticité d'une source, l'existence d'un établissement ou l'affiliation d'un élève.

Rapport détaillé : `docs/product/LOT-315-PROTOTYPE-IMPORT-REGISTRE.md`. Commande de test : `node --test prototypes/registry-import-core.test.mjs`. Les cas principaux ont été vérifiés localement avec Node ; l'exécution CI sur le HEAD de PR reste à confirmer.


## 13. Lot 316-A — protocole de réception et d'approbation institutionnelle

Un projet de protocole a été rédigé dans `docs/product/LOT-316A-PROTOCOLE-INSTITUTIONNEL-REGISTRE.md`. Il définit la demande d'export officiel, la chaîne de conservation (original en lecture seule, empreinte SHA-256, lots versionnés), la prévalidation isolée, le rapprochement historique, l'approbation à deux personnes, la correction/retrait et la séparation entre établissement et affiliation d'élève.

Ce document est une proposition à faire confirmer par le ministère/DEW ; il ne prétend pas créer une autorité interne de validation. Le prototype Lot 315 ne doit pas recevoir de fichiers réels. Pas de schéma SQL, migration, accès réel, import, annuaire ni changement Supabase. La recherche nationale et les invitations Messenger restent bloquées jusqu'à preuve d'affiliation émise/confirmée par une autorité compétente.


## 14. Lot 316-B — rapprochement versionné et revue à deux personnes

Le module isolé `prototypes/registry-reconcile-core.mjs` compare deux versions par identifiant national strict. Il distingue les lignes nouvelles, modifiées, inchangées et absentes à examiner. Les absences sont mises en quarantaine : elles ne sont jamais assimilées à une fermeture ou à une suppression. Les doublons, identifiants manquants et identifiants synthétiques bloquent le rapprochement.

Le rapport détaillé `docs/product/LOT-316B-RECONCILIATION-REVUE.md` fournit une checklist opérateur/approbateur distinct, un modèle de manifeste de lot (source, périmètre, date, SHA-256, volumes et décisions) et les limites de gouvernance. Les changements sont descriptifs ; toute modification de statut doit être corroborée par un acte et approuvée par l'autorité compétente.

Le test Node dédié est intégré au workflow de validation. Les données et tests sont synthétiques. Aucun export institutionnel n'a été reçu ; aucune connexion, écriture, migration, activation d'annuaire ou preuve d'affiliation n'est introduite.


## 15. Lot 316-C — rapport administratif de revue des écarts

Le Lot 316-C ajoute `prototypes/registry-review-report-core.mjs` et ses tests. Il transforme les catégories du Lot 316-B en priorités de revue P1/P2/P3 et actions attendues. P1 couvre les nouveaux identifiants, les absences entre versions et les changements de statut/date/référence/source ; P2 les changements d'identité ou descriptifs ; P3 les lignes sans différence détectée. Ces niveaux sont des priorités opérationnelles, jamais une qualification juridique.

Le prototype distingue l'opérateur de l'approbateur : l'opérateur peut documenter ou mettre en quarantaine, tandis que l'approbateur distinct peut accepter, rejeter ou mettre en quarantaine après revue opérateur. Le contrôle des identifiants d'acteurs est uniquement une garde de démonstration ; il ne constitue pas une authentification ni une autorisation sécurisée. L'export CSV sépare les commentaires des deux rôles et neutralise les cellules pouvant être interprétées comme des formules.

Le workflow exécute les tests Lot 316-C. Données synthétiques seulement ; aucun stockage, aucune écriture, aucune connexion, aucun changement Supabase/Auth/RLS/GRANT/Storage, aucune migration ni déploiement. L'utilisation administrative réelle reste interdite avant mise en place et validation institutionnelle de l'identité, des permissions, de la traçabilité et des signatures.


## 16. Lot 316-D — maquette hors ligne de revue administrative

La page isolée `prototypes/registry-review-preview.html` illustre la file P1/P2/P3, les filtres, le détail d'un écart et la séquence opérateur puis approbateur. Elle utilise quatre identifiants synthétiques et conserve les décisions uniquement en mémoire de la page. Aucun état n'est conservé après rechargement.

Le test `prototypes/registry-review-preview.test.mjs` est exécuté par le workflow et vérifie les avertissements de démonstration ainsi que l'absence d'appel réseau et de stockage navigateur. La maquette n'est pas reliée à l'application, à Supabase ou à Cloudflare et n'est pas publiée en production. Les identifiants saisis ne prouvent aucune identité ou permission ; les actions ne sont pas des décisions officielles.


## 17. Lot 317 — traçabilité des décisions de revue

Le module hors ligne prototypes/registry-decision-ledger-core.mjs ajoute un journal séquentiel des décisions. Chaque événement conserve le type, l'identifiant et le rôle déclarés de l'acteur, l'horodatage fourni, la justification, la référence documentaire et l'empreinte SHA-256 de l'événement précédent. L'acceptation exige une référence de preuve/acte ; la revue opérateur précède l'approbation et les deux acteurs doivent être distincts.

Le test prototypes/registry-decision-ledger-core.test.mjs vérifie l'intégrité de la chaîne, les séquences autorisées, les justifications et références obligatoires, ainsi que le refus d'export après altération. Le workflow exécute désormais ce test dans la CI.

**Limite :** une chaîne SHA-256 non signée détecte certaines altérations, mais ne prouve ni l'identité, ni l'heure, ni l'inaltérabilité face à un acteur pouvant recalculer le journal. Il n'existe aucun stockage durable ni authentification. Les identités et références sont synthétiques. Aucun changement Supabase/Auth/RLS/GRANT/Storage, aucune migration, aucun déploiement et aucune activation du registre ou de Messenger.


## 18. Lot 318 — chronologie de consultation du journal

La maquette prototypes/registry-decision-timeline-preview.html présente un fil chronologique RTL des événements, le rôle et l'identifiant fictifs de l'acteur, l'horodatage de démonstration, la justification, la référence illustrative et les marqueurs de chaîne. Elle permet la recherche, le filtrage par dossier et l'export JSON de la sélection affichée.

Le jeu de données est synthétique (deux dossiers SYN, six événements). Les marqueurs DEMO-HASH sont des libellés fictifs et ne sont ni calculés ni vérifiés. La page ne lit pas directement le module Node du Lot 317 ; il s'agit d'une maquette autonome, sans connexion ni persistance. Le test d'isolation est ajouté au workflow CI.

Aucun dossier réel, aucune authentification, aucun registre institutionnel, aucune écriture Supabase, migration, modification Auth/RLS/GRANT/Storage ou déploiement.


## 19. Lot 319 — import local vérifié du journal

Le Lot 319 ajoute un adaptateur Node vers le modèle de chronologie et un import JSON local dans la maquette du Lot 318. Le navigateur recalcule la chaîne SHA-256 (genèse, événements ordonnés, previousHash et headHash) avant d'afficher le journal. Les combinaisons rôle/type et les champs obligatoires sont contrôlés. L'import est volontairement limité aux identifiants SYN-* fictifs.

La vérification porte uniquement sur la cohérence cryptographique interne du fichier. Elle ne certifie ni l'identité des acteurs, ni les dates, ni l'autorité des pièces, ni l'inaltérabilité face à un acteur pouvant recalculer toute la chaîne. L'export de la page reste un export de vue, pas le journal original signé.

Tests CI : prototypes/registry-decision-timeline-adapter.test.mjs et prototypes/registry-decision-timeline-preview.test.mjs. Aucun dossier réel, appel réseau, persistance, écriture Supabase, migration ou déploiement.


## Lot 320 — validation sémantique du journal de décisions (12 novembre 2026)

### Constat de revue
- Les Lots 317–319 vérifiaient la cohérence SHA-256, l'ordre des séquences et les combinaisons rôle/type, mais ne rejouaient pas intégralement les transitions métier lors de la vérification d'un JSON importé.
- Un fichier pouvait donc présenter une chaîne de hash recalculée cohérente tout en décrivant une séquence impossible (par exemple deux revues opérateur successives sans demande de correction/réouverture, ou une approbation sans revue préalable).

### Correctifs préparés sur la branche PR #17
- `prototypes/registry-decision-ledger-core.mjs` : validation centralisée de l'en-tête, des champs obligatoires, des rôles/types, de la séparation des tâches et des transitions de revue/correction/décision/réouverture ; `appendDecisionEvent` et `verifyDecisionLedger` appliquent la même machine d'état.
- `prototypes/registry-decision-ledger-core.test.mjs` : ajout de chaînes synthétiques dont les hashes sont valides mais dont les transitions sont interdites ; l'import/export doit les refuser.
- `prototypes/registry-decision-timeline-preview.html` : même contrôle sémantique exécuté localement dans le navigateur avant d'afficher un journal.
- `prototypes/registry-decision-timeline-preview.test.mjs` : assertions de présence des gardes de transitions côté navigateur.

### Limites inchangées
- Les identifiants SYN restent fictifs ; les rôles et identités ne sont pas authentifiés.
- SHA-256 prouve seulement la cohérence de la chaîne présentée, pas l'identité, l'horodatage fiable, l'autorité de la preuve ni l'absence d'un recalcul complet malveillant.
- Aucun dossier réel, aucune collecte, aucun service réseau, aucun stockage durable, aucune connexion Supabase, Auth, RLS, GRANT ou Storage.
- Aucun SQL, aucune migration, aucun changement de base active, aucun déploiement Cloudflare et aucune fusion.

### Validation
- Les tests Lot 320 sont ajoutés aux tests existants Lot 317 et Lot 319 ; le workflow CI les exécute via les mêmes commandes Node.
- Attendre le résultat CI du HEAD final avant de déclarer le lot validé.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.

### Décision et suite
- GO pour durcir et tester les prototypes hors ligne avec des données SYN uniquement.
- NO-GO pour le schéma SQL/migration et les tests PostgreSQL contre un environnement réel tant que le protocole institutionnel n'a pas été validé et qu'un environnement isolé n'a pas été autorisé.
- Prochaine étape après validation institutionnelle : rédiger le modèle de données et la migration versionnée, puis exécuter les tests d'intégration PostgreSQL dans une base jetable dédiée, jamais dans la base active.


### Complément Lot 320 — cohérence de l'en-tête importé
- Le validateur navigateur exige désormais aussi que `sourceReference` soit une chaîne, conformément au validateur Node ; les fichiers JSON dont l'en-tête diverge sont rejetés.
- Assertion statique ajoutée au test de la maquette. La validation finale reste suspendue au run CI du HEAD documentaire final.


## Lot 321 — validation chronologique des journaux importés (12 novembre 2026)

### Constat
Le contrôle sémantique du Lot 320 vérifiait l'ordre logique des décisions, mais acceptait encore des horodatages non normalisés ou non croissants. Un journal pouvait donc contenir une date invalide ou une approbation antérieure à la revue tout en respectant les transitions de rôles.

### Correctifs sur la branche PR #17
- `prototypes/registry-decision-ledger-core.mjs` : ajout d'une validation stricte des horodatages UTC ISO-8601 normalisés (format accepté par `Date.prototype.toISOString()`). La date de création doit être valide ; chaque événement doit avoir une date valide strictement postérieure à la création et à l'événement précédent.
- `prototypes/registry-decision-ledger-core.test.mjs` : les scénarios synthétiques utilisent désormais des dates ISO-8601 ; ajout d'un test de date initiale invalide, d'événement antidaté et de chaîne hash-valide mais chronologiquement incohérente.
- `prototypes/registry-decision-timeline-preview.html` : vérification identique côté navigateur avant affichage du journal importé.
- `prototypes/registry-decision-timeline-preview.test.mjs` : assertions de présence des contrôles temporels côté navigateur.

### Limites
- Une date ISO valide et croissante reste une valeur fournie par le fichier ; elle ne prouve pas l'heure réelle, l'identité de l'acteur, la signature d'une autorité ou l'intégrité d'une horloge de confiance.
- SHA-256 non signé n'est pas une signature et ne rend pas le journal inviolable si un acteur peut recalculer toute la chaîne.
- Données SYN uniquement, traitement local, aucun service réseau ni persistance.
- Aucun SQL, migration, PostgreSQL, Supabase/Auth/RLS/GRANT/Storage, modification de `main`, ni déploiement de production.

### Validation CI
- HEAD testé : `2bc9134cb8cdb32efad6f0d20e600ebca17ebdc4`.
- Run GitHub Actions #3169 / `43297481014` : en cours lors de la rédaction. Le job a passé les contrôles de préparation et de structure ; la validation messagerie était encore en cours et les tests du registre n'avaient pas encore démarré. Ne pas déclarer le lot réussi avant la conclusion finale.

### Décision
- GO pour les tests hors ligne sur données synthétiques.
- NO-GO pour tout modèle SQL/migration et tout test sur la base active. Une base PostgreSQL jetable nécessitera un environnement local ou isolé explicitement autorisé, sans coût cloud implicite.
- PR #17 reste ouverte et non fusionnée.


### Correctifs finaux et validation CI — Lot 321 (12 novembre 2026)

- Analyse des échecs intermédiaires #3166 à #3173 : le journal révélait un défaut supplémentaire dans `clean()`. L'expression régulière était doublement échappée et supprimait les lettres ordinaires `r`, `n` et `t` au lieu de ne neutraliser que CR/LF/TAB. Elle est corrigée en `/[\\r\\n\\t]+/g`, ce qui préserve les rôles `operateur`, les identifiants SYN et les références.
- Les fixtures des tests du moteur et de l'adaptateur ont été normalisées en UTC ISO-8601 avec millisecondes. Le test d'association de rôle a été aligné sur le rejet central du moteur lorsqu'un rôle inconnu est rencontré.
- Validation finale : GitHub Actions **#3174**, run `43298187072`, commit `10e919749b85238c03dfde19eefcae00c27247cb` : **success, 40/40 étapes**. Les tests du journal Lot 317, de la chronologie Lot 318 et de l'adaptateur Lot 319 sont passés dans cette exécution.
- Les runs antérieurs de la série étaient en échec pendant les corrections successives ; ils ne sont pas comptés comme validation. #3174 est le résultat vert de référence pour le code Lot 321.
- PR #17 reste ouverte, non fusionnée ; HEAD au moment de ce constat : `10e919749b85238c03dfde19eefcae00c27247cb`. Comparaison avec `main` : 2 072 commits en avance et 4 en retard ; `main` reste au commit `12367172a6038cfd9de709be37e6de9fa62b9462` dans la comparaison consultée.
- La description de la PR a été nettoyée : les addenda MFA historiques 181–209 ont été remplacés par une exclusion explicite MFA/2FA. Ce changement de description n'est pas une suppression de code ; aucun fichier MFA n'apparaît dans la liste des fichiers actuellement modifiés de la PR. Un audit séparé de toute source résiduelle reste obligatoire avant fusion.
- GitHub contient une notification Cloudflare confirmant un **déploiement de prévisualisation de branche** pour le commit `74b1f99`. Il ne s'agit pas d'une publication de production. Le déploiement de prévisualisation automatique ne doit pas être confondu avec un déploiement de production ; la prévisualisation exacte du HEAD `10e9197` n'a pas été confirmée dans cette vérification.
- Aucun SQL exécuté, aucune migration appliquée, aucune base PostgreSQL/Supabase active modifiée, aucun changement direct sur `main`, aucun déploiement de production.

### Décision après validation
- Lot 321 : validation structurelle CI acquise sur le commit indiqué.
- GO pour préparer le modèle relationnel PostgreSQL en documentation et les tests sur base jetable locale.
- NO-GO pour appliquer une migration, créer une branche Supabase payante, ou utiliser une base distante sans autorisation explicite distincte.
- Le protocole institutionnel du registre reste une proposition à faire valider ; aucun établissement réel ni aucune inscription officielle n'est importé.
