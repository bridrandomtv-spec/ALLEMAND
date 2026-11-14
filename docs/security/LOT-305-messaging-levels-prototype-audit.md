# Lot 305 — audit du prototype « المراسلة المدرسية (0→7) » (12 novembre 2026)

## Décision

**NO-GO pour intégrer le prototype tel quel ou exécuter son SQL.** Le fichier est une maquette HTML autonome : les conversations et messages sont codés en dur, les boutons ne sont pas reliés au backend, et les fonctions d'envoi / escalade ne font que produire des notifications locales.

La plateforme possède déjà une messagerie Supabase opérationnelle d'une autre architecture. Le travail doit partir de `msg.js`, `supabase/supabase.js` et des tables `msg_*` actives, sans créer une seconde messagerie `public.messages`.

## Références et méthode

- Prototype reçu : fichier HTML « المراسلة المدرسية (0→7) », 544 lignes.
- Branche examinée : `design/prototypes-67-74-alignment`, PR #17.
- Code source lu : `msg.js`, `supabase/supabase.js`, `supabase/msg_schema.sql`, `ci/check-msg.mjs`, `tests/msg_test.mjs`.
- Supabase actif inspecté en lecture seule : catalogues PostgreSQL, colonnes, RLS, ACL des fonctions, triggers et publication Realtime.
- Aucune donnée personnelle de message, aucun contenu de conversation, aucun compte de test et aucun appel d'exploitation n'ont été utilisés.

## Architecture réellement présente

Les tables actives sont :

- `msg_conversations`, `msg_members`, `msg_messages`
- `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`

Les sept tables ont RLS activé. Les politiques de lecture des messages exigent l'appartenance à la conversation ou un droit de modération. L'insertion vérifie `auth.uid() = sender_id`, l'appartenance à la conversation et l'absence de blocage. Les fonctions `msg_*` inspectées n'accordent pas EXECUTE à `anon`; les fonctions utilitaires accessibles à `authenticated` lient l'identifiant utilisateur à `auth.uid()`. La publication `supabase_realtime` contient `msg_messages` et `msg_conversations`.

Le schéma réel de `msg_messages` est : `id`, `conversation_id`, `sender_id`, `body`, `attachment_id`, `flagged`, `created_at`, `edited_at`, `deleted_at`. Il n'existe pas de table `public.messages`. Les colonnes `level`, `subject_id`, `class_id` et `is_read` du prototype n'existent pas dans cette table. Le système actuel utilise le périmètre wilaya / niveau / filière et non un périmètre matière / classe.

Le client existant expose déjà les opérations de conversations, lecture et envoi de messages, ouverture DM, groupes officiels, vérification scolaire, signalements, blocage, pièces jointes et modération. `msg.js` utilise ces wrappers ; il ne réalise pas les écritures directement dans les tables.

## Écarts fonctionnels du prototype

- `selectLevel()` ne fait que sélectionner une carte et afficher un toast ; aucune autorisation n'est modifiée.
- `sendMessage()` n'appelle pas Supabase et ne crée aucune ligne ; le message de réponse est simulé par `setTimeout`.
- `escalateToLevel(3)` affiche une notification locale ; aucun transfert, contexte de conversation, destinataire administratif ou avis serveur n'est créé.
- Les conversations, noms, extraits, statuts de lecture, heures et compteurs sont des exemples codés en dur.
- Le champ de recherche, les boutons « nouvelle », fichier, exercice et récompense ne sont pas reliés à des opérations réelles.
- L'indicateur « Realtime متصل » est statique. Le système existant utilise Realtime pour les messages et la présence de membres, mais le prototype ne s'y abonne pas.
- Aucun mécanisme de lecture par destinataire ni de saisie « typing » n'est implémenté. Un booléen global `is_read` ne suffirait pas pour des conversations de groupe.
- Le niveau 7 ne peut pas promettre une prise en charge immédiate sans circuit d'astreinte, destinataires, notification fiable et objectif de délai mesuré.

## Écarts de sécurité confirmés

### 1. Règle « étudiant → professeur uniquement » non appliquée dans la fonction DM active

La fonction active `msg_can_dm(a,b)` vérifie que les deux profils sont vérifiés et partagent wilaya, niveau et filière. Elle ne teste pas les rôles `profiles.role`. Les rôles présents dans les profils sont `admin`, `eleve` et `prof`. Le garde d'ajout de membres `msg_member_ok` et le trigger `msg_guard_direct` réutilisent cette fonction.

Conséquence : la base ne garantit pas la règle annoncée par le prototype « un élève ne peut pas écrire directement à un autre élève ». Deux profils étudiants vérifiés du même groupe peuvent satisfaire le prédicat actuel. Il s'agit d'un écart de règle métier confirmé, pas d'une preuve d'accès à une autre wilaya.

**Correction proposée, non appliquée :** définir une matrice serveur explicite des paires de rôles autorisées (notamment élève ↔ professeur), puis la faire appliquer par la fonction appelée depuis les politiques / triggers. Ajouter des tests négatifs élève→élève, élève→professeur, professeur→élève, profils non vérifiés, groupes différents et rôles administratifs. Le contrôle doit être côté base, jamais seulement dans les boutons de l'interface.

### 2. Le SQL fourni ne peut pas être repris tel quel

- Le trigger `check_msg_permission()` ne contrôle que le cas `NEW.level = 1` ; les niveaux 0, 2 à 7 n'ont pas de règles serveur.
- Le corps ne lie pas explicitement `NEW.sender_id` à `auth.uid()`.
- Le snippet active RLS et ne fournit qu'une policy SELECT ; aucune policy INSERT n'est fournie. Avec RLS activé, l'envoi Data API est donc refusé par défaut tant qu'une policy INSERT sûre n'est pas définie.
- La fonction est déclarée `SECURITY DEFINER` sans `SET search_path` fixe et utilise des noms non qualifiés. C'est un risque de sécurité pour une fonction privilégiée.
- Aucun `CREATE TRIGGER ... EXECUTE FUNCTION check_msg_permission()` n'est fourni : même la fonction déclarée ne serait pas exécutée automatiquement.
- La vérification fournie ne contrôle pas la cohérence entre classe, matière, inscription et professeur destinataire.
- Le prototype annonce `verif_guard`, mais le SQL fourni ne définit pas cette fonction.

### 3. Le journal d'audit proposé ne correspond pas au schéma actif

La table `public.audit_logs` existe, mais ses colonnes sont `id`, `at`, `acteur`, `action`, `cible_type`, `cible_id`, `avant`, `apres`, `wilaya`. Les colonnes `user_id` et `details` utilisées dans le snippet n'existent pas : son INSERT échouerait.

Par ailleurs, aucun trigger actif sur INSERT de `msg_messages` n'écrit dans `audit_logs`. Le journal dédié `msg_log` est en lecture seule pour les clients et les triggers existants consignent surtout des changements de modération / suppression, pas chaque message envoyé. La promesse « chaque message est enregistré dans audit_logs » n'est donc pas satisfaite par l'architecture actuelle.

**Correction proposée, non appliquée :** définir précisément quels événements doivent être audités (création, modification, suppression, signalement, traitement, escalade), choisir le format canonique compatible avec `audit_logs` ou `msg_log`, puis ajouter des écritures serveur atomiques et des tests de complétude. Ne pas dupliquer les journaux sans raison.

## Correspondance des niveaux 0→7

| Niveau prototype | Écart avec le système existant | Décision |
|---|---|---|
| 0 — système | Pas de type de message système dans `msg_messages` | À concevoir via le système de notifications existant, pas en usurpant un expéditeur |
| 1 — élève→professeur | DM existant, mais contrôle des rôles insuffisant | Priorité sécurité : corriger la matrice de rôles |
| 2 — professeur→élève | DM existant, même contrôle de rôle insuffisant | À inclure dans la matrice serveur |
| 3 — professeur→administration | Pas de routage de niveau ni de fil d'escalade dans le schéma | À concevoir avec destinataires / permissions |
| 4 — administration→professeur | Pas de niveau stocké ; rôles admin/prof uniquement | À concevoir avec RBAC existant |
| 5 — agent de wilaya / rapports financiers | Aucun niveau dans le schéma ; la formulation financière est hors périmètre produit | Ne pas intégrer de rapports financiers ni de module de paiement |
| 6 — parents | Le modèle de messagerie actif ne contient pas de rôle parent dans `profiles.role` ni de lien parent intégré aux membres DM | À concevoir seulement après vérification du lien parent-enfant et de son autorisation |
| 7 — urgence | Pas de circuit d'astreinte ni de SLA | Ne pas afficher « immédiat » comme garantie sans chaîne opérationnelle réelle |

Les niveaux ne doivent pas être traités comme des permissions simplement parce qu'une valeur entière est comprise entre 0 et 7. Chaque flux doit avoir une matrice rôle/permission, un contrôle de périmètre et des tests négatifs dédiés.

## Éléments réutilisables sans refaire la messagerie

- La présentation générale en deux panneaux (liste / conversation), le thème clair/sombre et les repères de niveau peuvent inspirer une amélioration de `msg.js`.
- Les conversations et messages doivent continuer à venir de `SB.msgConvs()`, `SB.msgMessages()` et `SB.msgSend()`.
- Le statut en ligne peut s'appuyer sur la présence Realtime existante, mais ne doit pas être renommé « écrit ».
- Les pièces jointes existantes sont limitées côté serveur à PNG/JPEG/WebP/PDF et 5 Mio, dans le bucket privé `prive`.
- Les actions de signalement, blocage, vérification d'identité et modération existantes doivent être conservées et rester autorisées par RLS.

Le prototype charge Tailwind et Lucide par CDN, alors que la règle projet est de ne pas ajouter Tailwind ni de dépendances frontend supplémentaires. Il utilise aussi des gestionnaires inline et construit les notifications avec `innerHTML`; ces éléments ne doivent pas être copiés tels quels.

## Plan de suite recommandé

1. Traiter en premier l'écart `msg_can_dm` avec une matrice de rôles validée et des tests négatifs, sans exécuter le SQL du prototype.
2. Définir si les niveaux 0→7 sont des catégories d'affichage ou de véritables flux d'autorisation ; exclure le volet financier.
3. Concevoir le modèle d'escalade / notifications / parents avant d'ajouter des boutons.
4. Si le design est retenu, adapter uniquement la vue existante `msg.js` et ses styles, en réutilisant les wrappers existants.
5. Compléter les tests `ci/check-msg.mjs` et `tests/msg_test.mjs` avec les nouvelles règles de rôle et les invariants d'audit.

## Validation / hors périmètre

- CI #3063 / run `43269906495` sur le commit documentaire Lot 304 : **success** ; l'étape de validation de la messagerie et les autres étapes du job ont réussi. Cela valide les assertions du dépôt, pas les tests d'autorisation avec de vrais comptes ni une recette navigateur.
- Aucun changement applicatif, aucun SQL, aucune migration, aucune policy RLS, aucun GRANT, aucun changement Auth ou Storage.
- Aucun MFA/2FA, aucun module de facturation/paiement, aucune donnée Supabase modifiée.
- Aucun déploiement Cloudflare/Supabase, aucune fusion et aucune modification de `main`. PR #17 reste ouverte et non fusionnée.

