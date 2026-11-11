# Lot 298 — audit du prototype « tableau de bord basé sur les données réelles de GitHub »

**Date :** 11 novembre 2026  
**Branche examinée :** `design/prototypes-67-74-alignment`  
**HEAD PR #17 vérifié :** `594d7a891a2475ba8e5ecac26d2ca3cde9c41d4e`  
**Matériel reçu :** HTML autonome RTL intitulé « مركز الإدارة », huit entrées de navigation, vues overview/classes/security/finance/codebase et JavaScript local.  
**Méthode :** audit statique du HTML reçu, comparaison en lecture seule avec les fichiers GitHub de la branche et vérification de l'exécution GitHub Actions associée au HEAD. Aucun navigateur, aucune connexion au projet Supabase distant.

## 1. Décision

**NO-GO pour présenter ou publier ce HTML comme un tableau de bord alimenté par des données réelles.** Il s'agit actuellement d'une maquette statique qui mélange des valeurs écrites en dur, des données de démonstration présentes dans le dépôt, des affirmations de sécurité non mesurées et quelques références à des fonctions réelles qui ne sont jamais appelées par ce HTML.

Le dépôt contient bien des briques réutilisables pour construire un tableau de bord réel : wrappers `SB.admDashboard()`, `SB.admReport()`, `SB.admAuditLast()`, `SB.admCouverture()`, permissions et périmètres administratifs, données géographiques de référence et suite CI. Mais ce prototype n'importe ni `supabase.js`, ni `admin.js`, ne crée aucun client Supabase, n'appelle aucune API GitHub et ne consomme aucune RPC.

## 2. Vérification des affirmations GitHub

### 2.1 CI Pipeline — affirmation partiellement corroborée

- Le badge HTML `29/29 ✓` est une chaîne statique ; il n'est pas calculé depuis GitHub.
- Vérification réelle du HEAD PR #17 : workflow **CI — ALLEMAND**, run **#3026**, ID `43081483343`, statut `completed`, conclusion `success`.
- Le job unique **Validation structurelle & pédagogique** a terminé avec succès. Les 29 étapes de validation métier sont toutes en succès ; les étapes de préparation et de clôture du runner s'ajoutent au décompte brut des étapes du job.
- La CI couvre notamment la structure pédagogique, les données de classe et de wilaya, le moteur professeur, la messagerie, l'administration, les gardes d'accès et les tests de fuite. Elle ne constitue pas un test navigateur de ce nouveau HTML et ne prouve pas que Supabase est connecté.
- Le badge ne doit être affiché comme état courant que si l'interface interroge le statut du dernier workflow associé au commit exact, et affiche le SHA/horodatage consulté. Un ancien succès ne doit pas être présenté comme l'état actuel d'un commit plus récent.

### 2.2 Version, date et identité

- Le sous-titre HTML affiche une date fixe `13/10/2026` et `v8`, sans lien avec le SHA courant, le commit Git ou la date du dernier déploiement.
- Le nom « الأستاذ خريف أحمد », les initiales et « صلاحيات كاملة » sont inscrits en dur. Aucune session GitHub, Supabase Auth, identité courante ou permission n'est vérifiée.
- L'état « Supabase متصل » est un badge vert statique. Aucun appel de santé, requête, horodatage ou contrôle d'erreur ne l'alimente.
- La mention « معلومات فعلية من GitHub » ne correspond à aucun appel GitHub dans le script fourni.

**Contrat recommandé pour les informations GitHub :** lire le dépôt, la branche, le SHA du HEAD PR, l'état de PR #17, les métadonnées du commit, les workflows/runs et, si nécessaire, l'arbre des fichiers via l'API GitHub. Ces lectures doivent être faites côté serveur ou via une connexion GitHub explicitement autorisée ; aucun jeton privé ne doit être placé dans le navigateur. Toujours afficher la source, le SHA et l'heure de lecture.

## 3. Comparaison avec les données versionnées du dépôt

### 3.1 Les cinq classes et les 142 élèves

Le fichier `assets/bdd/classe.json` contient bien cinq entrées et exactement les mêmes effectifs que ceux du prototype :

| Section | Effectif du fichier |
|---|---:|
| 2AS-1 | 32 |
| 2AS-2 | 28 |
| 2AS-3 | 32 |
| 3AS-1 | 26 |
| 3AS-2 | 24 |
| **Total arithmétique** | **142** |

Mais les métadonnées de ce JSON identifient explicitement le contenu comme une maquette de classe/enseignement et décrivent des données de démonstration. Le fichier est utilisé par `classe.js` pour afficher un environnement pédagogique ; il ne s'agit pas d'une requête de comptage des inscriptions Auth ni d'un registre transactionnel des élèves.

**Conclusion :** les cinq classes sont présentes comme contenu de maquette dans Git ; le total 142 ne peut pas être présenté comme le nombre réel d'élèves inscrits. Il faut un agrégat serveur adossé aux inscriptions/profils autorisés, avec périmètre et date de calcul.

### 3.2 Wilayas

- Le dépôt contient `assets/bdd/wilaya.json` et `assets/bdd/wilayas_geo.json` comme référentiels géographiques.
- Le client Supabase expose `SB.admCouverture()`, qui appelle la RPC `admin_couverture_wilayas`; `admin.js` consomme cette fonction pour afficher les effectifs élèves et agents par périmètre.
- Le HTML reçu ne charge aucun de ces fichiers, n'appelle pas `SB.admCouverture()` et ne présente pas de vue `wilayas` fonctionnelle.
- Un référentiel des 58 wilayas ne fournit pas, à lui seul, les effectifs réels par wilaya. L'agrégation doit être calculée par la base et filtrée par les permissions.

### 3.3 Administration et sécurité

Le code versionné contient déjà :
- `admin_roles`, `admin_permissions`, `wilaya_assignments` ;
- les helpers `admin_can`, `admin_role_of`, `admin_wilayas`, `admin_sees_wilaya` ;
- les wrappers `SB.admMyPerms()`, `SB.admDashboard()`, `SB.admSearchStudents()`, `SB.admStudent()`, `SB.admAuditLast()` ;
- des contrôles côté base dans les scripts administratifs.

Le prototype n'utilise aucun de ces éléments. Les règles affichées `role = 'admin'`, `auth.wilaya()` et « accès complet » simplifient à tort le modèle. Le code source historique de `admin.js` contient déjà des écrans raccordés à des données Supabase et un contrôle de rôle, mais cela ne rend pas le présent HTML connecté ni ne prouve l'état déployé des migrations. Les contrôles effectifs doivent rester dans les RPC/RLS ; masquer une section côté JavaScript n'est pas une autorisation.

Aucun flux de menaces ni tableau de scores de sécurité n'est alimenté par ce prototype. La présence de règles RLS versionnées dans Git ne signifie pas qu'un moniteur de menaces existe ou que l'état de sécurité du projet a été mesuré.

### 3.4 Finances et reçus

Le dépôt versionne déjà `accounting_entries`, `admin_report`, `receipts` et les fonctions de validation/émission de reçus. Les numéros de reçus sont générés côté base au format `REC-YYYY-######` après confirmation du paiement.

En revanche, les noms, montants, numéros `REC-2026-000142` / `REC-2026-000141`, prix, statuts et méthodes de paiement du HTML sont des exemples écrits en dur. Le prototype ne les lit pas depuis les RPC ou tables réelles. Il ne faut pas les considérer comme des transactions existantes.

Cette section est auditée uniquement comme contenu du prototype. **Aucune nouvelle fonction de facturation, de paiement, de tarification, d'abonnement ou de monétisation n'est demandée ni ajoutée par ce lot.**

### 3.5 Messagerie et activité

Le dépôt contient `msg.js`, `supabase/msg_schema.sql` et des méthodes client pour conversations, messages, signalements et journal de modération. Le HTML ne les appelle pas. Il ne contient ni abonnement Realtime ni requête de messages, et son activité « live » n'est donc pas réelle.

### 3.6 État système / Cloudflare / Supabase

- `wrangler.toml` déclare le Worker `src/site-worker.js` et le binding d'actifs `ASSETS`.
- Le Worker sert les actifs et applique des en-têtes ciblés ; ce code ne fournit pas à cette maquette une mesure d'uptime Cloudflare, de disponibilité Supabase ou d'utilisation du stockage.
- Aucun pourcentage de disponibilité ou d'occupation ne peut être affirmé sans télémétrie, période, source et horodatage. Le badge « connecté » doit être remplacé par un état vérifié ou « non vérifié ».

### 3.7 Journal d'audit

Le dépôt possède `audit_logs` et le client `SB.admAuditLast(n)`. Le prototype n'appelle pas cette méthode et affiche une vue de journal annoncée dans la navigation sans implémenter le conteneur HTML correspondant. Les entrées doivent être lues dans le périmètre autorisé ; ne pas promettre une immutabilité absolue au-delà des garanties SQL effectivement testées.

## 4. Défauts fonctionnels du HTML transmis

1. **Trois vues référencées sont absentes :** les boutons `messaging`, `wilayas` et `audit` appellent `switchView()`, mais aucun élément `view-messaging`, `view-wilayas` ou `view-audit` n'existe. Le code déréférence alors `null.classList` et provoque une erreur JavaScript.
2. **Vue classes incomplète :** le panneau principal affiche cinq classes, mais la vue détaillée n'en contient que trois ; les boutons « إدارة القسم » n'ont pas de gestionnaire.
3. **Graphiques non construits :** Chart.js est chargé, mais aucun graphique n'est instancié.
4. **Aucune intégration de données :** aucune initialisation Supabase/GitHub, aucun `fetch`, aucun appel RPC, aucune pagination et aucune souscription Realtime.
5. **Aucune authentification/autorisation :** le nom et les permissions affichés sont statiques ; aucun garde n'empêche un visiteur d'ouvrir ce HTML ou d'en inspecter les sections.
6. **Déconnexion inactive :** le bouton de sortie ne possède aucun gestionnaire.
7. **Navigation mobile partielle :** elle ne présente que quatre entrées sur huit ; aucune couche de fond ni gestion complète du clavier/échappement.
8. **Thème indépendant :** `localStorage.darkMode` et la classe `.dark` ne sont pas raccordés aux conventions existantes de l'application.
9. **Dépendances CDN :** Tailwind, Chart.js, Lucide et Google Fonts sont chargés à distance. Le prototype ne respecte pas la préférence du projet pour une interface vanilla sans dépendances frontend supplémentaires ; Chart.js est en outre inutilisé.
10. **Risque XSS futur :** `showNotification()` injecte `title` et `message` via `innerHTML`. Si ces valeurs proviennent ensuite de GitHub, de Supabase ou d'un utilisateur, elles doivent être échappées ou insérées comme texte.
11. **Indicateurs sans provenance :** les statuts vert, les nombres et les mentions « actif », « connecté », « complet » n'affichent ni source, ni date de lecture, ni erreur de rafraîchissement.
12. **Fichiers affichés :** l'arborescence du terminal est une liste illustrative, pas une vue dynamique de l'arbre GitHub.

## 5. Architecture cible pour une vraie version

- **GitHub — métadonnées du projet :** dépôt, branche, SHA, PR, commit, dernier run CI, jobs et étapes. Afficher les données de l'API avec heure de consultation et lien vers la ressource GitHub. Ne pas mélanger ces données avec les données métier Supabase.
- **Supabase — données administratives :** réutiliser les wrappers/RPC existants adaptés (`admMyPerms`, `admDashboard`, `admReport`, `admAuditLast`, `admCouverture`, recherche et fiches élèves). Confirmer la présence réelle des migrations et policies dans le projet actif avant toute mise en service.
- **Classes :** conserver `classe.json` uniquement pour l'aperçu pédagogique de démonstration ; utiliser un agrégat serveur issu des inscriptions réelles pour les effectifs administratifs.
- **Sécurité :** afficher seulement les contrôles et événements réellement disponibles ; ne pas inventer un flux de menaces ni des scores.
- **Messagerie :** distinguer les statistiques de messagerie, les signalements et les événements en direct ; chaque bloc doit indiquer sa source et sa fraîcheur.
- **Wilayas :** référentiel géographique distinct des agrégats d'effectifs, calculés et bornés côté serveur.
- **Système :** afficher « non mesuré » tant qu'une télémétrie fiable n'est pas intégrée.
- **Audit :** utiliser les entrées persistées et leur périmètre d'accès ; préciser les limites de garantie.
- **UI :** garder HTML/CSS/JS traditionnel, les routes et identifiants existants ; aucune dépendance frontend supplémentaire n'est justifiée par ce prototype.

## 6. Tests d'acceptation à exécuter avant intégration

1. Le SHA, la branche, la PR et le workflow affichés correspondent exactement aux réponses GitHub de la consultation.
2. Un workflow en échec, annulé, en cours ou absent n'est jamais affiché comme succès.
3. Le statut CI est rafraîchi pour le HEAD courant, et non réutilisé depuis un commit antérieur.
4. Le badge Supabase n'est vert qu'après un contrôle réel réussi ; les erreurs et délais dépassés restent visibles comme indisponibles.
5. Un visiteur non authentifié ne peut afficher aucune donnée administrative.
6. Un profil sans permission `reports.read` ne peut obtenir les chiffres du tableau de bord via l'appel direct RPC.
7. Un agent régional ne reçoit que les données de ses wilayas, même en modifiant les paramètres réseau.
8. Les effectifs de `classe.json` sont explicitement identifiés comme données de maquette et jamais comme nombre d'inscrits.
9. Les effectifs réels sont comparés à un agrégat serveur d'inscriptions, pas à la somme du JSON de démonstration.
10. Les reçus affichés correspondent à des lignes persistées et à des paiements confirmés.
11. Aucun chiffre de menace n'est affiché si la source n'existe pas ou n'est pas autorisée.
12. Les vues messaging/wilayas/audit s'ouvrent sans exception et affichent un état vide/erreur honnête.
13. Chaque bouton visible exécute une action autorisée ou est présenté comme non disponible/désactivé.
14. Le rendu de valeurs GitHub/Supabase contenant du HTML est inerte ; aucune injection ne s'exécute.
15. L'interface mobile donne accès à toutes les sections et gère correctement fermeture, focus et clavier.
16. L'état « live » cesse d'être affiché si le flux ou le rafraîchissement est interrompu.
17. Les métriques système affichent source, fenêtre de mesure et horodatage.
18. Les entrées d'audit restent limitées au périmètre serveur de l'administrateur connecté.

**Ces tests ne sont pas exécutés dans le Lot 298.** Le succès de CI #3026 valide la suite automatisée du dépôt, pas les scénarios navigateur ni la connexion réelle de cette maquette.

## 7. État GitHub et opérations

- PR #17 : `open`, `merged=false`, base `main`.
- HEAD vérifié : `594d7a891a2475ba8e5ecac26d2ca3cde9c41d4e`.
- CI #3026 / run `43081483343` : **success** sur ce HEAD.
- Aucun fichier applicatif, route, identifiant, style, module ou logique runtime modifié dans ce lot.
- Aucun SQL, migration, table, fonction, policy RLS, grant, secret, configuration Auth, donnée ou action distante Supabase modifié/exécuté.
- Aucun déploiement Cloudflare/Supabase, aucune nouvelle branche, aucun merge, aucun achat ni coût.
- Aucune nouvelle fonction financière n'a été ajoutée.
- La PR #17 doit rester ouverte et non fusionnée.

## 8. Conclusion finale

Le dépôt fournit des briques réelles, mais le HTML transmis ne les consomme pas. Les effectifs de classes proviennent d'un JSON de maquette, les reçus et finances sont fictifs, les vues de messagerie/états système/menaces ne sont pas alimentées, et trois liens de navigation déclenchent une erreur faute de vue correspondante.

**Décision : conserver ce HTML comme référence visuelle uniquement ; ne pas le présenter comme une console réelle et ne pas le fusionner/intégrer tel quel.** Une future implémentation devra séparer clairement les données GitHub, les données métier Supabase et les fixtures pédagogiques, avec provenance et date de mise à jour pour chaque indicateur.
