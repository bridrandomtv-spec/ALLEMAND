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
