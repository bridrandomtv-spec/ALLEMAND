# Lot 357 — Audit fonctionnel réel du Messenger

Date : 13 novembre 2026
Branche : `design/prototypes-67-74-alignment`
Périmètre : lecture du code `msg.js`, `supabase/supabase.js`, `index.html`, des contrats d'invitation et des constats Supabase documentés aux lots précédents. Aucun test avec de vrais comptes élèves, aucun accès à des messages personnels, aucune écriture Supabase.

## 1. Verdict

Le dépôt contient une messagerie scolaire utilisable pour certains échanges existants : liste de conversations, groupes, messages texte, flux Realtime, présence dans un fil, pièces jointes limitées, signalements et outils de modération.

En revanche, il ne s'agit pas encore d'un Messenger national équivalent à Meta. Les contacts nationaux, invitations et acceptations ne sont pas implémentés. La découverte de contacts inter-lycées/inter-wilayas n'existe pas dans le client. Le parcours de nouveau DM est volontairement fermé côté client par `msgOpenDirect()` qui renvoie `msg_invitation_requise`, mais les voies de contournement serveur identifiées aux lots 348–350 restent un blocage de sécurité tant qu'elles ne sont pas corrigées par une migration testée.

## 2. Matrice fonctionnelle vérifiée

| Fonction | État constaté dans le code | Conclusion |
|---|---|---|
| Liste des conversations | `msgConvs()` charge au plus 50 conversations visibles selon RLS | Présente |
| Recherche | Filtre local sur les cartes déjà chargées | Présente, mais pas de recherche nationale de personnes |
| Filtres Tout / Privées / Groupes | Boutons de filtrage locaux | Présents |
| Noms des membres | Lecture `profiles(id,pseudo,role,niveau)` pour les membres d'un fil | Présente, surface de confidentialité à revoir |
| Groupes scolaires | `msgGroups()` lit les conversations `type=groupe`; UI les affiche | Présents, rattachement fondé sur le modèle historique |
| Messages texte | Envoi via `msg_messages`, limite UI 2 000 caractères | Présent |
| Temps réel | Realtime INSERT/UPDATE sur `msg_messages` par conversation | Présent dans le client |
| Présence | `channel.track()` et affichage d'un nombre « en ligne » pendant un fil ouvert | Implémentée, non validée en test multi-comptes |
| Pièces jointes | PNG/JPEG/WebP/PDF uniquement, 5 Mio max, stockage privé et URL signée | Présentes mais limitées |
| Invitations de contact | Aucun appel client ou UI d'invitation trouvé | Absentes |
| Annuaire national | Aucun écran ou appel de recherche nationale trouvé | Absent |
| Nouveau DM après consentement | Pas de flux d'invitation/acceptation; client refuse le nouveau DM | Non implémenté |
| Accès inter-wilayas | Pas de découverte ni d'invitation nationale; règles SQL historiques restrictives | Non ouvert |
| Accusés de lecture / non lus | Aucun mécanisme UI/DB correspondant observé dans le flux | Non démontrés |
| Indicateur de saisie | Aucun événement de typing observé | Absent |
| Notifications de nouveaux messages | Aucun centre de notifications Messenger identifié dans ce module | Non démontré |
| Modifier / supprimer un message | Méthodes client existent, mais pas de contrôles de message visibles dans le rendu inspecté | API client présente, UX incomplète |
| Bloquer / débloquer un contact | Méthodes client existent, pas de parcours contact visible dans cet écran | API client présente, UX incomplète |
| Appels audio/vidéo | Aucun flux trouvé dans ce module | Absents |
| Modération | Signalements, vérification de profils et création de groupes dans le bloc prof/admin | Présente, dépend des règles serveur |

## 3. Constats techniques précis

### 3.1 Recherche et liste

- `msgListSearch` filtre uniquement les éléments DOM déjà rendus.
- Les conversations privées sont présentées avec un libellé générique « Conversation privée #ID » au lieu du nom du contact.
- `msgConvs()` limite la liste à 50 entrées et ne met pas en place de pagination.
- Aucun champ de recherche d'élèves, de lycée ou de wilaya n'appelle un service serveur national.

### 3.2 Profil et confidentialité

Le module `fetchNames()` lit directement `profiles` pour obtenir `id,pseudo,role,niveau`. Les audits antérieurs ont déjà identifié une exposition trop large des colonnes de profils dans les droits SELECT authenticated. Ne pas étendre cette lecture pour construire l'annuaire national. Prévoir une projection serveur minimale, limitée aux membres de la conversation et aux données qu'ils ont consenti à partager.

### 3.3 Nouveau contact / DM

`msgOpenDirect(otherId)` recherche une conversation directe existante commune aux deux comptes. Si elle n'existe pas, elle renvoie `msg_invitation_requise`. C'est un garde-fou client, pas une autorisation serveur. Le contrat Lot349 définit la machine d'états d'invitation, mais aucune table/opération d'invitation n'a été créée ni déployée. Les trois voies SQL de création sans invitation restent à fermer en environnement contrôlé.

### 3.4 Fichiers

L'interface et le client acceptent uniquement PNG, JPEG, WebP et PDF, 5 Mio maximum. L'envoi crée d'abord un message « 📎 nom du fichier », puis téléverse le fichier et ajoute une ligne `msg_attachments`. Si le téléversement échoue, le message texte peut rester seul. Pas d'aperçu intégré pour PDF ni de galerie/document viewer complet. Antivirus ou analyse de contenu non démontrés.

### 3.5 Présence et temps réel

Le fil s'abonne aux INSERT et UPDATE de messages, puis suit une présence Realtime tant que le fil est ouvert. Cela ne démontre pas les accusés de lecture, la livraison hors ligne, les notifications push, la synchronisation multi-appareils ou l'indicateur de saisie.

## 4. Priorités de réalisation

1. **P0 — Sécuriser le serveur avant l'ouverture nationale** : fermer les trois voies DM sans invitation, valider blocage bilatéral, préserver les groupes et les DM historiques, tester les privilèges/RLS.
2. **P1 — Affiliation officielle** : établir une source institutionnelle vérifiable pour le lycée et l'année scolaire; ne pas assimiler un profil auto-déclaré ou `verif_statut` à une inscription officielle.
3. **P1 — Invitations** : opérations serveur idempotentes, états pending/accepted/declined/cancelled/expired, acceptation transactionnelle par le destinataire, contrôle des blocages dans les deux sens.
4. **P1 — Annuaire national avec consentement** : recherche paginée, anti-énumération, opt-in, projection serveur minimale, résultats toutes wilayas.
5. **P2 — UX Messenger** : vrais noms de contacts, avatars/initiales, dernière activité, non-lus, statut de lecture, recherche globale, boîte des invitations, actions bloquer/signaler.
6. **P2 — Fiabilité des messages et médias** : pagination historique, retries idempotents, notifications, validation serveur MIME/taille, traitement antivirus, suppression cohérente des messages et objets Storage.
7. **P3 — Fonctions avancées** : typing indicator, multi-appareils, appels audio/vidéo uniquement après stabilité des fondations.

## 5. Décisions et limites du lot

- Aucun code runtime modifié dans ce lot : audit et priorisation uniquement.
- Aucun accès aux contenus privés des élèves; audit fondé sur les définitions du code et les métadonnées déjà documentées.
- Aucun changement SQL, RLS, GRANT, Auth, Storage ou Realtime dans Supabase.
- Aucun déploiement Cloudflare.
- Aucun changement de `main`, aucune fusion de PR #17.
- MFA/2FA et facturation hors périmètre.

## 6. Prochaine étape

Lot 358 : transformer la matrice P0/P1 en plan de tests serveur multi-comptes et vérifier les dépendances exactes de chaque voie DM avant de préparer une migration isolée. Ne pas ouvrir l'annuaire national ni les nouveaux DM avant la preuve de fermeture côté serveur.

## Rectificatif — continuité des prototypes et travaux antérieurs (13 novembre 2026)

Ce lot 357 est une synthèse de confirmation de l'état courant, pas une décision de recommencer Messenger ni de refaire les prototypes déjà étudiés.

- Les travaux UX antérieurs, notamment Lot 308 (recherche locale, filtres et responsive) et Lot 309 (photos, PDF, upload privé et intégration au fil), sont conservés. Ils ne doivent pas être réimplémentés.
- Le prototype de messagerie à niveaux et ses parcours ont déjà été audités au Lot 305 ; les niveaux 0→7, les limites de rôles, les parents, les urgences et les notifications ont été documentés. On ne recommence pas leur analyse.
- Les invitations ont déjà été étudiées aux lots 310–311, puis spécifiées et approfondies dans les lots 323–340 et 348–352. Les contrats, scénarios et matrices existants sont la référence ; ils ne sont pas à réécrire.
- Les lots 355–356 ont déjà corrigé la découvrabilité de Messenger dans la navigation.
- Le tableau du Lot 357 sert uniquement à distinguer ce qui existe déjà dans le code, ce qui est prévu par les prototypes/contrats et ce qui reste réellement à intégrer ou valider. Il ne remplace pas les travaux précédents.

**Règle de continuité : ne pas refaire les prototypes, écrans, contrats ou tests déjà réalisés.** Réutiliser les éléments acceptés et ne travailler que sur les écarts non livrés : source d'affiliation institutionnelle, exécution des protections serveur dans un environnement PostgreSQL isolé, raccordement du flux d'invitation/annuaire déjà spécifié, puis validation d'intégration. Le plan multi-comptes du Lot 340 et le verrouillage du Lot 326 sont déjà disponibles : ne pas recréer un second plan équivalent.

Le Lot 357 n'a modifié aucun code runtime. Il n'a pas ouvert un nouveau chantier de refonte UX.
