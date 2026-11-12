# LOT 338 — Cartographie des dépendances client Messenger et plan de migration

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : audit en lecture seule du client, du SQL versionné et du catalogue Supabase actif. Aucun changement applicatif ni SQL.

## 1. État de contrôle préalable

- CI #3211 : `success`, run [43312289674](https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43312289674), HEAD `ebcd13741d793d540e8b0b0e4539f2d455498416`.
- PR #17 : `open`, `merged=false`, `mergeable=true`, HEAD `ebcd13741d793d540e8b0b0e4539f2d455498416`, base `main`.
- La PR reste ouverte et non fusionnée. Aucun changement sur `main`.

## 2. Cartographie des appels dans `msg.js`

| Zone | Appel actuel | Dépendance / comportement | Cible de migration |
|---|---|---|---|
| Libellés de membres | `fetchNames()`, vers `profiles.select('id,pseudo,role,niveau')` | Lecture directe pour afficher les noms et niveaux des participants ; le champ `role` n'est pas utilisé dans le libellé. | `msg_member_labels(user_ids)`, autorisé uniquement pour les conversations dont le demandeur est membre ; retourner pseudo public minimal et niveau seulement si nécessaire. |
| Liste principale | `msgGroups()`, `msgConvs()`, `msgMyVerification()` | Liste des groupes et conversations du compte ; statut personnel de vérification. | Garder une opération dédiée pour les conversations et groupes ; remplacer le statut personnel par une lecture de profil privé dédiée. |
| Modération | `msgReportsOpen()`, `msgLogLast()`, `msgVerificationQueue()` | Rapports/journal et file de vérification affichée aux modérateurs. | Conserver la surface de modération distincte ; migrer la file vers une RPC de vérification scoppée, sans exposer ces champs à l'annuaire. |
| Fil et temps réel | `msgMessages()`, Realtime sur `msg_messages`, `msgAttachmentInfos()` | Chargement paginé du fil (50) et notifications d'insertion/mise à jour. | Préserver le contrat de fil et le temps réel ; vérifier l'accès par appartenance au DM/groupe côté serveur. |
| Envoi | `msgSend()`, `msgUpload()` | Message et pièces jointes privées (PNG/JPEG/WebP/PDF, 5 Mio côté client et contrôle RLS/métadonnées). | Ne pas coupler l'annuaire/invitation à l'envoi ; conserver les pièces jointes, renforcer ultérieurement validation binaire/quotas côté serveur. |
| Ouverture DM | `msgOpenDirect(otherId)` | Recherche d'une conversation partagée ; lecture des 500 dernières adhésions maximum ; sinon retourne `msg_invitation_requise`. | Remplacer le scan client plafonné par `msg_direct_open_existing(other_user_id)` côté serveur, paginé/transactionnel. |
| Recherche UI | `msgListSearch` | Filtre uniquement les conversations/groupes déjà chargés dans le DOM. | Ajouter une recherche nationale distincte, avec consentement, affiliation officielle, pagination et anti-énumération. |

**Constat fonctionnel :** aucune recherche nationale de personnes n'est implémentée dans `msg.js`. Le champ de recherche actuel n'est pas un annuaire et ne découvre pas les élèves d'autres lycées ou wilayas.

## 3. Dépendances dans `supabase/supabase.js`

### 3.1 Accès Messenger directs

- `msgConvs()` : lecture des conversations de l'utilisateur via ses adhésions.
- `msgMessages()` / `msgSend()` : fil et envoi.
- `msgCanDm()` : appelle `msg_can_dm`, fonction de compatibilité actuelle ; son contrat actuel ne permet pas le DM national inter-wilayas.
- `msgOpenDirect()` : ne crée plus de nouveau DM dans le client ; retrouve seulement un DM existant partagé, mais sa stratégie de recherche est limitée à 500 adhésions.
- `msgGroups()` : retourne jusqu'à 50 groupes.
- `msgReport()`, `msgBlock()`, `msgUnblock()`, `msgEdit()`, `msgDelete()`, `msgUpload()`, `msgAttachmentInfos()`, `msgSubscribe()`, `msgReportsOpen()`, `msgHandle()`, `msgLogLast()`, `msgCreateGroup()` : opérations de message, blocage, pièce jointe, Realtime, modération et groupes.
- `msgMyVerification()` : lit directement `verif_statut,matricule,section` dans le profil courant.
- `msgRequestVerification()` : écrit `verif_statut,matricule,section` dans le profil courant.
- `msgVerificationQueue()` : lit `id,pseudo,role,niveau,filiere,wilaya,matricule,section,created_at` pour les demandes en attente.
- `msgSetVerification()` : met à jour statut, acteur et date de vérification.

Les quatre derniers appels sont un sous-système de vérification scolaire, pas un annuaire. Ils doivent être migrés vers des opérations dédiées et scoppées avant de rendre les données de profil plus restrictives. La vérification par matricule/section déclarés ne doit pas être présentée comme preuve d'inscription officielle.

### 3.2 Fonctions profil hors Messenger à ne pas casser

- `myProfile()` utilise `profiles.select('*')` pour le seul compte connecté ; à remplacer à terme par une projection de profil personnel, mais ne pas le retirer dans le lot Messenger.
- `listProfiles()` utilise `profiles.select('*')`. L'appel observé dans `admin.js` alimente un ancien écran d'administration général. Ne pas le supprimer ni le réduire sans migration explicite de cet écran.
- `admListProfiles()` utilise déjà `id,pseudo,role,niveau,wilaya`, avec limite 200 ; elle alimente des sélecteurs d'administration.
- `admQueue()` joint les profils aux paiements avec `id,pseudo,wilaya` ; cette dépendance d'administration doit rester distincte du Messenger.
- `admListAgents()` utilise également des libellés de profils associés aux affectations d'agents.

## 4. Vérification sur le schéma Supabase actif

Requête de catalogue strictement en lecture seule sur le projet `azjwcybivirvpxbfhyzk) :

- `msg_open_direct(uuid)` est toujours `SECURITY DEFINER` et exécutable par `authenticated` et `service_role`.
- La politique `msg conv creation` autorise encore à `authenticated` l'insertion d'une conversation directe créée par soi-même.
- La politique `msg members ajout` autorise l'ajout de son propre compte dès que `msg_member_ok` l'accepte ; le contrôle ne requiert pas d'invitation acceptée.
- `msg_member_ok` autorise tout DM au niveau de cette condition, et les groupes selon wilaya/niveau/filière du profil.
- `msg_can_dm` et `msg_is_member` sont des fonctions `SECURITY DEFINER) accessibles à `authenticated`.
- La politique de lecture `profils visibles entre membres` autorise une ligne de profil si deux utilisateurs partagent une conversation ; combinée aux privilèges SELECT de colonnes relevés au Lot 336, elle ne constitue pas une projection minimale.
- La file `profils en attente visibles modérateurs` est limitée par rôle/périmètre, mais le client doit cesser de lire directement la table pour cette fonction.

La protection du client `msgOpenDirect()` ne ferme donc pas les chemins SQL directs. Tant que les politiques, privilèges et fonctions actifs ne sont pas corrigés et testés côté serveur, **NO-GO pour l'ouverture nationale**.

## 5. Contrat de migration client — ordre recommandé

1. **Libellés de membres** : introduire `msg_member_labels(user_ids)`, contrôlé par `auth.uid()` et les conversations partagées ; remplacer `fetchNames()`. Ne retourner ni matricule, ni section, ni email/téléphone, ni statut/acteur/date de vérification.
2. **Vérification personnelle** : remplacer `msgMyVerification()` par une opération propriétaire limitée au statut et aux champs strictement nécessaires à l'écran ; isoler le matricule/section de la projection publique.
3. **File de vérification** : remplacer `msgVerificationQueue()` et `msgSetVerification()` par des opérations serveur qui recalculent le rôle, l'autorisation `students.verify` et le périmètre wilaya depuis l'identité authentifiée ; conserver une réponse UI compatible.
4. **Demande de vérification** : remplacer l'UPDATE direct par une commande atomique, contrôlant les transitions autorisées et journalisant l'acteur côté serveur.
5. **DM existant** : remplacer le scan de 500 adhésions par `msg_direct_open_existing`, avec pagination serveur et vérification exacte de la paire.
6. **Annuaire/invitations** : implémenter seulement après disponibilité de l'affiliation institutionnelle officielle et des RPC du Lot 337 ; aucun fallback sur matricule déclaré ou `profiles.verif_statut`.
7. **Administration** : migrer séparément `listProfiles()`, `myProfile()`, `admListProfiles()` et les écrans associés ; ne pas faire de refonte globale de `profiles` au milieu du lot Messenger.
8. **Serveur d'abord** : avant d'activer les nouveaux parcours, retirer les chemins de création DM sans invitation, verrouiller les opérations, exécuter les tests multi-rôles/concurrence sur PostgreSQL jetable, puis seulement migrer le client.

## 6. Critères de non-régression

- Les DMs historiques restent visibles et ouvrables par leurs membres ; aucune invitation rétroactive fictive.
- Les groupes officiels existants et leur affichage ne disparaissent pas pendant la migration ; leur éligibilité réelle devra être recertifiée par affiliation officielle.
- Fil, pagination, édition/suppression, Realtime, signalements, modération et pièces jointes continuent de fonctionner.
- Un utilisateur ne peut pas consulter les libellés de personnes hors de ses conversations ni accéder à la file de vérification sans permission scoppée.
- La recherche nationale est indépendante de la recherche locale des conversations.
- Aucune donnée sensible n'est renvoyée dans les résultats de l'annuaire.
- Les parcours admin existants sont préservés jusqu'à leur migration dédiée.

## 7. Limites et décision

- L'audit client porte sur les fichiers `msg.js`, `supabase/supabase.js), `admin.js) et `supabase/msg_schema.sql` de la branche indiquée, plus les politiques/fonctions ciblées du catalogue actif.
- Aucun test multi-compte navigateur, aucun test PostgreSQL isolé et aucune simulation de concurrence n'ont été exécutés.
- Les résultats de catalogue confirment les politiques/fonctions présentes au moment de la requête ; ils ne remplacent pas un dump complet ni les corps manquants des 27 migrations actives.
- Ce lot est une cartographie et un plan d'intégration, pas une livraison Messenger nationale.

Aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage, modification client, branche Supabase supplémentaire, déploiement Cloudflare ou changement `main). Aucun merge PR #17. Aucun travail MFA/2FA ou facturation.

**Décision :** maintenir le Messenger national en NO-GO fonctionnel jusqu'à la fermeture des chemins DM directs côté serveur, la disponibilité des affiliations officielles, et la validation des contrats par des tests PostgreSQL réels.
