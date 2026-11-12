# Lot 306 — vision produit « Messenger scolaire » (12 novembre 2026)

## Décision produit

Le besoin exprimé est un **véritable système de messagerie conversationnel inspiré de l'expérience Messenger de Meta**, intégré à la plateforme « الثانوية الافتراضية الجزائرية ». Il ne s'agit pas de reproduire la marque, les logos ou le code de Meta, mais de reprendre les conventions d'usage qui rendent une messagerie moderne et naturelle : boîte de réception, conversations directes et de groupe, fil continu, recherche, présence, notifications et actions rapides.

Le modèle « niveaux 0→7 » ne doit plus être le centre de l'expérience. Les niveaux sont remplacés par des **types de conversations, des badges de contexte et des actions institutionnelles**. Les permissions restent indépendantes de l'apparence.

## Principe d'expérience

L'utilisateur ouvre « الرسائل » et arrive directement dans sa boîte de réception. Il ne choisit pas un niveau avant de parler.

### Structure de l'interface cible

1. **Navigation latérale des conversations**
   - Recherche des conversations et des contacts autorisés.
   - Filtres : Tous, Non lus, Individuels, Groupes, Épinglés, Archivés.
   - Aperçu du dernier message, auteur, heure et compteur non lu.
   - Indicateur de présence lorsque la donnée est réellement disponible.
2. **Zone de conversation**
   - En-tête avec nom / photo / participants, statut et actions.
   - Historique chronologique avec pagination / chargement progressif.
   - Bulles distinctes selon l'auteur, date, regroupement des messages.
   - Composer multi-ligne, envoi clavier, pièces jointes et états d'envoi.
   - État vide, chargement, hors ligne, erreur et conversation inaccessible.
3. **Panneau de détails**
   - Membres, informations du groupe, fichiers partagés et actions de sécurité.
   - Masqué sur petits écrans et accessible depuis l'en-tête.
4. **Mobile**
   - Liste puis conversation en plein écran avec retour clair.
   - Barre de composition accessible, sans panneau latéral permanent.
5. **Accessibilité et identité**
   - RTL arabe natif, français si nécessaire, vert/blanc/rouge discret.
   - Clair/sombre, clavier, focus visible, contrastes lisibles.
   - Pas de Tailwind, pas de nouvelle dépendance frontend imposée.

## Fonctions attendues

### Socle prioritaire (MVP)

- Boîte de réception réelle, alimentée par Supabase.
- Conversations individuelles et groupes officiels.
- Recherche de conversations et recherche de personnes limitée aux contacts autorisés.
- Envoi/réception en temps réel via le Realtime déjà configuré.
- Pagination des messages et rafraîchissement robuste.
- Pièces jointes conformes aux règles actuelles : bucket privé `prive`, PNG/JPEG/WebP/PDF, limite serveur 5 Mio.
- Compteur non lu fiable et action « marquer comme lu ».
- Blocage, signalement et modération existants conservés.
- Notifications de nouveau message, sans prétendre qu'une notification push existe avant sa mise en place.
- États de chargement, réseau, erreur et reprise.

### Expérience enrichie (après stabilisation du socle)

- Accusés « envoyé / distribué / lu » par destinataire.
- Présence en ligne individuelle et « écrit… » via événements éphémères Realtime.
- Réactions emoji, réponse à un message, modification et suppression avec horodatage.
- Épinglage de conversations et messages, archivage et muet.
- Partage de photos et documents ; notes vocales après validation du stockage, formats et limites.
- Recherche dans le contenu des messages, avec indexation et filtrage par conversation.
- Aperçu des fichiers partagés et panneau de détails du groupe.

Ces fonctions ne doivent pas être simulées. Chaque badge d'état doit être alimenté par un signal réel et documenté.

## Adaptation scolaire — couche métier séparée

La messagerie doit être simple comme Messenger, mais les relations autorisées sont spécifiques à l'école.

- Élève ↔ professeur : autorisé uniquement si le lien pédagogique est vérifié (classe, matière, inscription ou affectation réelle).
- Élève ↔ élève : interdit en DM par défaut ; exception uniquement si une règle institutionnelle explicite est décidée.
- Professeur ↔ élève : même règle de rattachement pédagogique.
- Professeur ↔ professeur : selon l'appartenance et les règles de l'établissement.
- Administration ↔ personnels : permissions RBAC existantes et périmètre wilaya.
- Parents : à activer uniquement après vérification d'un lien parent-enfant fiable et de ses permissions de lecture/contact.
- Groupes de classe : adhésion calculée côté serveur depuis les inscriptions et affectations, pas auto-déclarée par l'utilisateur.
- Modération : signalement, blocage et traitement par les rôles autorisés, avec journal d'audit.

Les règles de rôle, d'inscription, de vérification et de wilaya sont appliquées dans PostgreSQL/RLS/RPC. Cacher un bouton dans le navigateur n'est jamais un contrôle d'accès.

## Modèle de données existant et écarts

La base active utilise déjà :
- `msg_conversations`, `msg_members`, `msg_messages`
- `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`

Le schéma des messages stocke actuellement `conversation_id`, `sender_id`, `body`, `attachment_id`, `flagged`, `created_at`, `edited_at`, `deleted_at`. Il ne contient pas encore de reçu individuel par membre, de réaction, de réponse/parent, ni de champ de type de message. Les fonctions clientes existantes fournissent déjà liste des conversations, lecture paginée, envoi, DM, groupes, upload, édition/suppression, blocage, signalements et modération.

**Ne pas créer un second tableau `public.messages`.** Toute évolution doit étendre le modèle `msg_*` après audit de compatibilité, migration versionnée dans la PR, tests RLS et stratégie de retour arrière.

## Corrections de sécurité obligatoires avant l'ouverture générale

1. Corriger `msg_can_dm(a,b)` : son contrôle actuel de profils vérifiés et de périmètre wilaya/niveau/filière ne suffit pas à imposer les paires de rôles attendues. La matrice des rôles et le rattachement pédagogique doivent être validés côté serveur.
2. Tester les accès avec des identités synthétiques : élève, professeur affecté, professeur non affecté, autre élève, administrateur de wilaya, parent lié / non lié, profil non vérifié.
3. Vérifier chaque policy RLS sur conversations, membres, messages, pièces jointes, Storage et modération.
4. Définir les reçus de lecture par membre (par exemple `last_read_at` ou table de reçus), plutôt qu'un booléen global `is_read` qui ne décrit pas un groupe.
5. Définir les événements d'audit et les écrire dans le schéma de journal existant, sans reprendre l'INSERT incompatible du prototype (qui utilise `user_id` et `details`, colonnes absentes d'`audit_logs`).
6. Ne pas promettre une escalade « immédiate » ou une alerte d'urgence sans destinataires, notification fiable, disponibilité et SLA définis.

## Découpage de réalisation proposé

| Lot | Contenu | Critère de sortie |
|---|---|---|
| A — UX shell | Maquette de la boîte de réception Messenger dans la vue existante | Responsive, RTL, clair/sombre, sans données fictives présentées comme réelles |
| B — sécurité DM | Matrice de rôles et lien pédagogique côté serveur | Tests négatifs passés, RLS vérifiée |
| C — MVP conversation | Liste, fil, envoi, Realtime, pagination, pièces jointes | Données réelles, aucun bouton factice |
| D — états sociaux | Non lus, reçus, présence, saisie | Chaque état vient d'un mécanisme serveur/Realtime fiable |
| E — interactions | Réactions, réponses, épingles, archivage, notes vocales | Migration minimale et tests de régression |
| F — services scolaires | Groupes classe, parents, transfert administratif | Liens institutionnels et permissions prouvés |

## Hors périmètre et garde-fous

- Aucun niveau 5 « rapports financiers » : pas de facturation ni de paiement dans la messagerie.
- Pas de MFA/2FA ajouté.
- Pas de remplacement du système Auth, des profils ou du moteur de messagerie existant.
- Pas de dépendance Tailwind ou CDN supplémentaire.
- Pas de données de démonstration présentées comme des messages réels.
- Aucune migration ou commande SQL appliquée à Supabase actif dans ce lot de conception.
- Aucun déploiement, aucune fusion, aucune modification de `main`. PR #17 reste ouverte et non fusionnée.

## Prochaine action technique

Commencer par le lot A (composition de l'interface dans la vue `msg.js`) et le lot B (audit/correction de la matrice DM côté branche), mais garder deux validations distinctes : la présentation peut être développée sans changer le backend ; aucune mise en service réelle ne doit précéder les tests de sécurité et la validation explicite des migrations.


## Addendum Lot 307 — ouverture nationale entre lycées et wilayas (12 novembre 2026)

### Décision produit confirmée par l'utilisateur

La messagerie est un réseau scolaire national : **un étudiant doit pouvoir découvrir et contacter des étudiants d'autres lycées et d'autres wilayas d'Algérie**, et pas uniquement les membres de son établissement, de sa classe ou de son groupe local. La portée cible couvre les 58 wilayas et les lycées participants à la plateforme.

Cette ouverture change la règle précédente « élève ↔ élève interdit par défaut ». Elle est remplacée par une règle d'autorisation explicite : les échanges élève ↔ élève inter-lycées et inter-wilayas sont une fonction produit voulue, mais doivent être accessibles uniquement entre comptes scolaires authentifiés et selon des protections anti-abus. La vérification de l'identité scolaire ne doit pas imposer que les deux étudiants partagent la même wilaya, le même niveau ou la même filière.

### Expérience attendue

- Recherche nationale de membres autorisés, avec filtres facultatifs : wilaya, lycée, niveau, filière et centres d'intérêt scolaires.
- Profil de découverte limité : pseudonyme/nom d'affichage, lycée, wilaya, niveau et filière seulement si ces champs sont validés et que leur visibilité est autorisée. Ne jamais exposer email, téléphone, matricule, adresse ou identifiants internes.
- Demande de conversation / invitation contrôlable, possibilité de refuser, bloquer et signaler ; limitation de fréquence et protection contre le démarchage massif.
- DM entre étudiants de lycées différents et wilayas différentes, après validation du compte et des règles de sécurité nationales.
- Groupes inter-lycées et nationaux par matière, langue, niveau, préparation BAC, entraide et projets ; adhésion visible et règles de modération.
- Groupes locaux (classe/lycée/wilaya) conservés comme espaces distincts, sans enfermer l'étudiant dans son périmètre local.
- Les conversations élève ↔ professeur restent soumises à une règle séparée de rattachement pédagogique et aux permissions professionnelles.

### Sécurité obligatoire pour l'ouverture nationale

1. Distinguer visibilité dans l'annuaire, capacité à envoyer une invitation et capacité à envoyer directement un message. Un profil visible ne signifie pas qu'il accepte les messages entrants de tous.
2. Exiger un compte authentifié et un statut scolaire vérifié pour les fonctions nationales entre étudiants ; le statut doit être contrôlé côté serveur.
3. Prévoir des paramètres de confidentialité : invitations autorisées, visibilité du profil, blocage et signalement. Valeurs par défaut prudentes adaptées aux mineurs ; ne pas afficher de données personnelles sensibles.
4. Appliquer une limitation serveur des invitations/messages, détection d'abus, modération et traitement des signalements à l'échelle nationale.
5. Vérifier les politiques RLS et fonctions RPC sur tous les parcours inter-wilayas ; ne pas réutiliser telle quelle la contrainte actuelle de même wilaya/niveau/filière dans `msg_can_dm(a,b)`.
6. Tests négatifs avec comptes synthétiques : non authentifié, étudiant non vérifié, étudiant vérifié d'une autre wilaya, étudiant bloqué, invitation refusée, compte suspendu, professeur non affecté, et tentative d'énumération de profils.
7. La recherche nationale doit utiliser une RPC/endpoint minimisant les champs retournés et une pagination contrôlée ; ne pas charger directement tous les profils dans le navigateur.

### Portée et exclusions

- Le réseau national ne signifie pas accès anonyme ni accès aux données privées des établissements.
- Aucun échange avec des comptes non vérifiés ou suspendus.
- Aucun accès aux données personnelles d'un étudiant hors des champs explicitement autorisés.
- Aucun SLA d'urgence ni promesse de surveillance 24 h/24.
- Aucun module financier, aucune facturation ni paiement.
- Aucun changement Supabase/SQL/RLS appliqué par cet addendum : il s'agit d'une décision de produit et d'un cahier des charges. La mise en œuvre serveur nécessite une migration séparée, des tests et une validation explicite.

### Découpage ajusté

- A — UX Messenger : boîte de réception, annuaire national et filtres, sans données fictives.
- B — sécurité nationale : matrice des rôles, visibilité des profils, invitations, DM inter-wilayas, blocage, limites et tests RLS.
- C — MVP réel : invitations et conversations inter-lycées alimentées par le backend, Realtime et pagination.
- D — groupes nationaux : création, découverte, adhésion, modération et règles de gouvernance.
- E — états sociaux et fonctions avancées : reçus, présence, saisie, réactions et réponses uniquement avec mécanismes réels.

**Critère de réussite produit :** un étudiant vérifié d'un lycée de Bordj Bou Arréridj peut trouver et, selon les préférences de confidentialité, échanger avec un étudiant vérifié d'un lycée d'une autre wilaya, sans devoir partager son établissement, sa classe ou sa filière, tout en conservant blocage, signalement et contrôle serveur.


## Addendum Lot 310 — invitations Messenger avant DM (12 novembre 2026)

Le DM national doit suivre un consentement explicite. Le flux actuel `msgOpenDirect(otherId)` crée immédiatement une conversation et tente d'ajouter les deux membres ; ce n'est pas un système d'invitations. La politique RLS d'ajout de membres limite l'insertion à `auth.uid() = user_id`, de sorte que le client ne doit pas tenter d'ajouter lui-même le destinataire.

Le schéma actuel ne comporte pas de table d'invitations. Le flux cible est donc : invitation `pending` sans conversation ; acceptation/refus par le destinataire ; annulation par l'expéditeur ; à l'acceptation seulement, RPC transactionnelle créant/retrouvant le DM et ajoutant les deux membres. Les blocages, la vérification scolaire, les limites anti-spam et les préférences de réception sont contrôlés côté serveur.

La dernière définition de `msg_can_dm` dans `supabase/msg_schema.sql` exige actuellement la même wilaya, le même niveau et la même filière, en plus de deux identités vérifiées. Elle devra être remplacée par une autorisation nationale contrôlée (comptes scolaires vérifiés et règles anti-abus), sans ouvrir le DM direct avant acceptation.

Le modèle serveur proposé est documenté dans `docs/security/LOT-310-audit-invitations-messenger.md`. Aucun SQL ou code de production n'est modifié dans ce lot : migration et RPC doivent être préparées, testées puis validées avant toute exécution sur Supabase.


## Mise à jour Lot 311 — invitations nationales (12 novembre 2026)

Le contrat d'invitation a été préparé dans `docs/security/LOT-311-invitations-migration-preflight.md`. Décision **NO-GO pour une migration exécutable à ce stade** : le schéma versionné montre les champs de vérification et de wilaya dans `profiles`, mais ne démontre pas de relation canonique active élève↔lycée, de préférence de découverte ni de statut de suspension exploitable. La seule wilaya et les champs libres du profil ne suffisent pas pour ouvrir un annuaire national.

Le réseau national souhaité reste l'objectif produit : un élève vérifié pourra inviter un autre élève vérifié d'une autre wilaya si l'affiliation institutionnelle active est prouvée. Une invitation en attente ne crée aucune conversation ; l'acceptation du destinataire créera le DM et ses deux adhésions atomiquement. Blocage bilatéral, anti-doublon, pagination, limites anti-énumération et tests négatifs sont obligatoires.

Aucun SQL, migration, RPC, RLS, GRANT, Auth ou Storage n'a été modifié ou exécuté. Les écrans reçus/envoyés restent bloqués jusqu'à validation du contrat serveur.