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
