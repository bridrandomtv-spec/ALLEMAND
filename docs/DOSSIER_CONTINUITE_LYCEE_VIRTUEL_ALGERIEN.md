# Dossier de continuité — Lycée Virtuel Algérien (ALLEMAND)

**Dernière mise à jour : 4 novembre 2026**  
**Dépôt :** `bridrandomtv-spec/ALLEMAND`  
**PR de travail :** [#17](https://github.com/bridrandomtv-spec/ALLEMAND/pull/17)  
**Branche :** `design/prototypes-67-74-alignment`  
**Preview Cloudflare actuelle (commit `a224879`, déployée avec succès le 3 novembre à 16:21 UTC ; validation visuelle utilisateur encore attendue) :** https://097931a2-allemand.brid-randomtv.workers.dev/#accueil
**Dernière preview visuellement acceptée auparavant :** https://ec6160ef-allemand.brid-randomtv.workers.dev (commit `29aafce`, historique)  
**Production :** https://allemand.brid-randomtv.workers.dev/#accueil

---

## 1. État de référence confirmé

- L'utilisateur a testé la preview Cloudflare du commit `29aafce` et a confirmé : **« tout est super »**.
- Commit : `29aafce28bec6e5ac8541d5e5e52beddccce78ff`.
- Build Cloudflare : réussi.
- Déploiement Cloudflare : réussi, le 3 novembre 2026 à 14:46 UTC.
- CI GitHub : réussie (run #1812).
- PR #17 : ouverte, en brouillon, non fusionnée.
- `main` : inchangée par ce travail.
- Le cache du service worker est en `dz-de-v3.138.0`. Les références CSS, favicon et patch IA ont été alignées.

**Ne pas rouvrir ces vérifications sans nouvel indice concret ou demande de l'utilisateur.** Le rendu de cette preview est accepté par l'utilisateur.

## 2. Règles impératives pour la suite

1. Continuer sur la PR #17 et sa branche existante.
2. Ne créer aucune nouvelle branche.
3. Ne pas fusionner, fermer ou sortir la PR du brouillon.
4. Ne pas modifier `main`.
5. Ne pas lancer de déploiement manuel et ne pas modifier les paramètres Cloudflare.
6. Pas de Tailwind ni de nouvelle dépendance frontend.
7. Préserver les IDs, routes, événements, fonctions et modules existants.
8. Pour les tâches de design, ne pas modifier Supabase, Auth, RLS, schémas ou paiements.
9. Faire des changements ciblés, utiles et vérifiables. Pas de commits cosmétiques ni de réécritures générales.
10. Ne jamais prétendre à un test visuel ou fonctionnel qui n'a pas réellement été exécuté.
11. Ne pas refaire une vérification déjà concluante simplement pour remplir une réponse.
12. Après chaque action, indiquer clairement : ce qui a été modifié, le commit, le résultat des tests et la prochaine action concrète.

## 3. Objectifs produit et design déjà exprimés

- Plateforme secondaire algérienne multi-matières, interface arabe RTL.
- Identité visuelle algérienne : vert, blanc, rouge.
- Navigation horizontale dans l'en-tête, sans barre latérale sur ordinateur ni tiroir latéral sur mobile.
- Typographie arabe élégante et lisible.
- Mode sombre lisible pour le logo, le titre, les textes, les cartes, les champs et la navigation.
- Supprimer complètement « التربية البدنية » de l'offre de matières à étudier.
- Conserver le style apprécié pour les titres d'exercices, par exemple : « تمرين 1: المفردات - الأوقات ».
- Ne pas présenter une matière partielle comme entièrement opérationnelle.
- Préserver les fonctionnalités pédagogiques et les parcours existants.

## 4. Périmètre actuel de la PR #17

La PR comprend des changements visuels mais aussi fonctionnels. Les fichiers examinés dans le dernier audit incluent notamment :

- `app.js` : registre des unités, navigation, flux de réponse du professeur IA.
- `public-portal.js` : exploration publique des matières et des niveaux.
- `js/voice-chat.js` : dictée vocale.
- `index.html` : structure de l'accueil public et de l'application.
- CSS et `sw.js` : présentation, thème et cache.
- `masar.js` : libellés arabes du parcours.

L'audit a relevé que la PR ne doit pas être considérée comme purement graphique. Cela justifie des tests ciblés, pas une boucle de vérifications générales.

## 5. État de la dernière session

L'utilisateur a confirmé que la preview `29aafce` lui convient visuellement (« tout est super »).

L'assistant a ensuite commencé un audit de non-régression et a annoncé vouloir vérifier inscription, connexion, navigation et professeur IA. Aucun nouveau changement de code n'a été effectué pendant cet audit.

L'utilisateur a signalé à juste titre que le travail tourne en rond et qu'il manque un document de continuité réutilisable.

## 6. Prochaine méthode de travail — arrêter les audits circulaires

À la reprise :

1. Lire ce dossier avant toute action.
2. Ne pas refaire le contrôle du cache, de la preview ou du mode sombre : ils sont déjà validés à ce stade.
3. Identifier une seule prochaine tâche produit utile, à partir des demandes encore ouvertes et des changements de la PR.
4. Pour cette tâche, inspecter uniquement les fichiers et fonctions nécessaires.
5. Si une correction est justifiée, la faire directement sur la branche existante de la PR #17, sans nouvelle branche.
6. Exécuter les tests ciblés pertinents et vérifier le résultat.
7. Fournir un compte rendu court avec le commit et le résultat concret.
8. Si aucune action n'est possible sans une information de l'utilisateur, poser une seule question précise au lieu de répéter l'audit.

**Priorité : faire progresser la plateforme par des changements utiles, pas multiplier les vérifications sans résultat.**

## 7. Liens utiles

- PR #17 : https://github.com/bridrandomtv-spec/ALLEMAND/pull/17
- Preview validée : https://ec6160ef-allemand.brid-randomtv.workers.dev
- Production : https://allemand.brid-randomtv.workers.dev/#accueil
- Dépôt : https://github.com/bridrandomtv-spec/ALLEMAND
- Branche de travail : https://github.com/bridrandomtv-spec/ALLEMAND/tree/design/prototypes-67-74-alignment

---

**Règle de reprise :** ce document est la référence de continuité. Ne pas demander à l'utilisateur de répéter les décisions déjà consignées. Mettre à jour ce document lorsqu'un changement réel intervient.


## 8. Avancement du 3 novembre 2026 — garde du portail public

- Comparaison de la PR #13 avec la PR #17 : aucun élément de navigation latérale de la PR #13 n'a été repris, car il contredit la navigation horizontale validée.
- Contrôle des données du portail : 1AS (2 troncs communs), 2AS et 3AS (6 filières chacun) ; allemand uniquement en 2AS/3AS ; anglais marqué partiel ; « التربية البدنية » absent.
- Ajout de `ci/check-public-portal.mjs` pour contrôler automatiquement la cohérence des filières, les matières référencées, les statuts de disponibilité et la transmission du niveau/de la filière vers le formulaire d'inscription existant.
- Ajout de cette vérification au workflow `.github/workflows/deploy.yml`.
- Commit de la garde : `1aa3f0adff71a6ff42a3afd86598bbf703c690ab`.
- Commit d'intégration CI : `7bf6bf0e8d1392f0c14a8412a88b365e1586163d`.
- Exécution GitHub Actions #1815 créée pour `7bf6bf0` ; son état au moment de cette mise à jour est **pending**. Ne pas annoncer le test comme réussi avant la fin du workflow.
- Aucun changement dans `auth.js`, Supabase, Auth côté serveur, RLS, paiements ou production.


### Résultat CI confirmé — 3 novembre 2026

- GitHub Actions #1815 : **success**, terminé à 15:20:54 UTC.
- La nouvelle étape « Vérifier le portail public (catalogue et inscription) » s'est exécutée avec succès.
- Le contrôle de syntaxe JavaScript et les étapes précédentes du workflow ont également terminé sans échec.
- Le test est automatisé dans la CI ; aucun test manuel du navigateur ni validation visuelle nouvelle n'est revendiqué.
- PR #17 reste ouverte, en brouillon et non fusionnée. `main` et la production restent inchangées.


## 9. Revue ciblée du parcours public d'inscription — 3 novembre 2026

- Relecture de `public-portal.js`, `auth.js`, `app.js`, `index.html` et de la garde `ci/check-public-portal.mjs`, sur la branche `design/prototypes-67-74-alignment`.
- Le parcours de préremplissage est cohérent dans le code : le portail affecte le niveau, déclenche son événement `change` (qui recharge les filières), puis affecte la filière avant d'ouvrir l'onglet d'inscription existant.
- `bootGate()` initialise les listes du formulaire et `bindGateEvents()` est appelé sur le portail sans session ; le gestionnaire de soumission lit ensuite les valeurs des champs existants.
- Aucun défaut certain n'a été établi par cette revue statique. Aucun fichier applicatif n'a été modifié et aucun changement Auth/Supabase/RLS n'a été effectué.
- Limite explicite : cette lecture du code et le test CI ne remplacent pas un essai manuel dans un navigateur, de la sélection de la filière jusqu'à la création du compte et à l'ouverture de l'espace.
- Vérification GitHub du commit `533921d` : workflow CI #41663000157 terminé avec succès ; toutes les étapes du job, dont « Vérifier le portail public (catalogue et inscription) », sont en succès.
- État PR #17 au contrôle : ouverte, `mergeable=true`, toujours en brouillon ; base `main` ; aucun merge effectué.
- Prochaine étape avant fusion : un essai navigateur réel du parcours d'inscription/connexion. Tant qu'il n'est pas réalisé, ne pas présenter la validation fonctionnelle complète comme acquise.


### Suivi après la revue — 3 novembre 2026

- CI du commit documentaire `68e4990` : run #41667525171 **success**.
- Dernière preview Cloudflare confirmée dans les commentaires de la PR : `533921d`, build et déploiement réussis ; URL de branche : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev ; URL propre au commit : https://4a490678-allemand.brid-randomtv.workers.dev.
- Le commit `68e4990` ne contient qu'une mise à jour documentaire ; la preview Cloudflare confirmée pointe sur `533921d`, qui contient les derniers changements applicatifs et les tests CI, pas le commit documentaire.
- Aucun test interactif dans un navigateur n'a été exécuté par l'assistant. L'essai de bout en bout inscription → connexion → espace utilisateur reste donc à valider manuellement.
- PR #17 toujours ouverte, brouillon, non fusionnée ; `main` inchangée.


### État confirmé après le contrôle CI — 3 novembre 2026, 22 h (heure d'Algérie)

- HEAD actuel de la branche : `84f259b4cb1b45b010495598bc0d2113d3367159`.
- GitHub Actions #1819 (run `41667815989`) : **success** sur ce HEAD.
- Détail du job « Validation structurelle & pédagogique » : toutes les étapes sont en succès, notamment « Vérifier le portail public (catalogue et inscription) », la garde d'accès, la matrice des parcours et les tests de régression.
- Métadonnées GitHub de la PR #17 relues : `state=open`, `draft=true`, `merged=false`, `mergeable=true`. Le signal de fusion est donc actuellement favorable, mais la PR reste volontairement en brouillon.
- **Information historique obsolète à ne plus utiliser :** la preview `533921d` / `4a490678-allemand.brid-randomtv.workers.dev` a été remplacée. La preview actuelle est celle du commit `a224879` (voir l'en-tête et la section 15 mise à jour).
- Aucune navigation interactive complète n'a pu être exécutée depuis cet environnement. Le test réel inscription → création du compte → connexion → espace utilisateur et le contrôle visuel mobile/ordinateur ne sont donc pas revendiqués.
- Aucun fichier applicatif modifié pendant ce contrôle ; aucune fusion, aucun changement sur `main`, aucun déploiement de production.
- Prochaine décision : validation manuelle du parcours par l'utilisateur sur la preview. Après confirmation, demander séparément l'autorisation de sortir la PR du brouillon, puis l'autorisation de fusionner.


## 10. Point de reprise — ne pas oublier لوحة التحكم (3 novembre 2026)

- La « لوحة التحكم » administrative fait explicitement partie du périmètre de suivi de la PR #17 ; ne pas limiter la validation à l'accueil public ou à l'espace élève.
- La vue administrative réelle est déclarée dans `index.html` avec `data-view="admin"` et le conteneur `#adminBody`. `app.js` appelle `renderAdmin()` à l'ouverture de cette vue.
- `admin.js` contrôle la session Supabase et le rôle `admin` avant d'afficher les données. Le tableau de bord présente notamment les indicateurs de comptes/élèves/professeurs/notes, les profils et rôles, les notes, les abonnements, les plans, les sponsors/publicités et le registre des paiements ; les tests `tests/adm_test.mjs` couvrent les phases ADM-1 à ADM-5 et les garde-fous associés.
- Les styles de la vue administrative sont présents dans `style-prototype-dz.css`, y compris les règles de thème clair/sombre et les adaptations des tableaux/cartes. Une ancienne règle CSS décrit une barre latérale de prototype, mais les règles RTL finales V8.9/V8.10 rétablissent la navigation horizontale sous l'en-tête sur ordinateur et mobile, sans tiroir latéral ; ne pas réintroduire cette barre latérale.
- Cette lecture est une revue statique du dépôt, pas une validation visuelle ni un test de commandes administrateur en production. À la prochaine validation navigateur, inclure explicitement la لوحة التحكم : accès autorisé avec compte admin, refus avec compte non-admin, lisibilité en clair/sombre et adaptation ordinateur/téléphone.
- Aucun fichier applicatif ni code d'administration n'a été modifié pendant cette revue. Pas de modification Supabase/Auth/RLS, pas de nouvelle branche, pas de fusion et aucun changement sur `main`.


## 11. Correctif ciblé de la لوحة التحكم — 3 novembre 2026

- Revue statique complémentaire de `admin.js` : trois reliquats de libellés allemands étaient encore visibles dans le tableau de bord (comptes « Konten », notes « Noten », abonnements « DA aktiv »), alors que le test existant ne détectait que certains autres termes allemands.
- Correctif appliqué sur la branche existante : remplacement par les libellés arabes « الحسابات », « النقاط » et « دج نشطة ». Aucun changement de logique, de permission, de requête Supabase, de schéma, de paiement ou de navigation.
- Renforcement de `tests/adm_test.mjs` par une assertion dédiée qui détecte ces trois reliquats si l'un d'eux réapparaît.
- Commits : `949e541` (admin.js) puis `c6f4590` (tests/adm_test.mjs). HEAD PR vérifié : `c6f4590778fc76dea9a304d9d416608e29efcf8f`; PR #17 toujours ouverte, en brouillon, non fusionnée, mergeable.
- CI du nouveau HEAD : en attente de déclenchement/achèvement au moment de cette note. Ne pas présenter le correctif comme validé par CI avant le résultat du run correspondant.
- Aucun test navigateur réel ni contrôle visuel clair/sombre effectué ici. La validation admin avec un compte administrateur et un compte non-administrateur reste à faire sur la prévisualisation.
- Aucun changement sur `main`, aucune nouvelle branche, aucune fusion, aucun déploiement manuel ou de production.


## 12. Contrôle de visibilité de la لوحة التحكم dans la navigation — 3 novembre 2026

- L'audit de `app.js` a révélé un écart entre le commentaire LANG-4 (qui indique que `#admin` ne doit pas apparaître dans la navigation ordinaire) et le code effectif : `renderTabs()` retirait uniquement `msg`, laissant le lien « الإدارة » visible à tous les rôles.
- Correctif ciblé sur la branche existante : ajout de `isAdmin()` fondé sur la session applicative et filtrage du lien `admin` pour les sessions qui ne portent pas le rôle `admin`. Le contrôle réel de l'accès aux données reste côté Supabase dans `admin.js` ; ce masquage de navigation n'est pas présenté comme une mesure de sécurité serveur.
- Test ajouté dans `tests/adm_test.mjs` : `NAV-ADM-1` vérifie la condition de filtrage du lien administration.
- Commits : `7da56b3` (`app.js`) et `b29db0d` (`tests/adm_test.mjs`). Le run #1824 pour le correctif applicatif est terminé avec succès ; le run #1825 associé au test est en cours au moment de cette note.
- Vérification statique : le lien est désormais conditionné au rôle dans `renderTabs()`. Le rôle côté session doit correspondre au profil administrateur pour afficher le lien. Le contrôle navigateur avec sessions réelle admin/non-admin reste requis.
- Le CSS contient des règles dédiées au thème sombre pour la vue admin (cartes, statistiques, tableaux et en-tête), mais la lisibilité visuelle ne peut pas être certifiée sans contrôle navigateur.
- Aucun changement Auth/Supabase/RLS/schéma/paiement, aucune nouvelle branche, aucune fusion, aucun changement sur `main`, aucun déploiement manuel ou de production.


## 13. Vérification de la continuité du rôle admin et du thème sombre — 3 novembre 2026

- Vérification du parcours d'authentification : `cloudAuthority()` récupère le profil Supabase, conserve `p.role` dans l'objet de session, puis écrit cet objet dans `dz_de_session_v1`. `AUTH.session()` lit cette même clé (`K_SESSION`). Le filtre `isAdmin()` de la navigation utilise donc le rôle du profil cloud dans le parcours normal de connexion. Cette vérification statique ne remplace pas un essai navigateur avec un vrai compte administrateur.
- Test supplémentaire ajouté : `NAV-ADM-2` vérifie le raccord entre le rôle admin lu par la navigation, la persistance de la session cloud et la clé utilisée par `AUTH.session()`. Commit : `b4472a7`.
- Contrôle CSS statique : des règles spécifiques au thème sombre existent pour l'en-tête admin, les cartes statistiques, les cartes du tableau de bord et les tableaux. Les en-têtes et cellules de tableau reçoivent également des couleurs de contraste dédiées. Cela confirme la présence des règles, pas la lisibilité réelle sur écran.
- CI #1826, correspondant au correctif précédent de navigation, est terminée avec succès. La CI du nouveau commit `b4472a7` doit encore être vérifiée.
- Les vérifications de connexion admin/non-admin et le contrôle visuel clair/sombre sur ordinateur et mobile restent manuels et non effectués ici.
- Aucun changement de logique d'authentification, de Supabase, de RLS, de schéma ou de données ; aucun changement sur `main`, aucune nouvelle branche, aucune fusion ni déploiement manuel.


## 14. Renforcement du test de refus d'accès admin — 3 novembre 2026

- Relecture de `admin.js` : le rendu principal vérifie l'existence de l'utilisateur Supabase et du profil, puis exige strictement `p.role === 'admin'` avant d'appeler les fonctions de lecture des listes de profils et de notes.
- Ajout de `NAV-ADM-3` dans `tests/adm_test.mjs` : vérifie statiquement que la condition de refus des profils non-admin précède les lectures du tableau de bord.
- Commit du test : `ba19413`. CI à attendre.
- Attention : ce contrôle statique couvre le rendu principal de `admin.js`, pas tous les modules secondaires montés sur la vue `#admin`. Les permissions effectives des données restent à vérifier côté Supabase/RLS ; aucun changement de politique ou de schéma n'a été fait.
- La CI #1827 (commit `b4472a7`) est réussie. La CI #1828 (mise à jour documentaire précédente) était encore en cours au dernier contrôle.
- Cette indication a été dépassée par le déploiement Cloudflare réussi du commit `a224879` le 3 novembre à 16:21 UTC. Ne plus utiliser la preview `533921d`.
- PR #17 reste ouverte, en brouillon, non fusionnée. `main` reste inchangée ; aucune nouvelle branche créée.


## 15. Revue des permissions des modules administratifs ADM-1 à ADM-5 — 3 novembre 2026

- Revue statique des modules indépendants de `admin.js` : agents/wilayas, validation des paiements et reçus, publication des accords, tableau de bord/fiches élèves/paramètres, comptabilité et support.
- Point vérifié : les modules ADM-1/2/3/4/5 ne reposent pas uniquement sur le masquage des boutons. Les fonctions sensibles côté SQL contrôlent `auth.uid()` et la permission requise via `admin_can(...)`, et plusieurs opérations vérifient également le périmètre wilaya via `admin_sees_wilaya(...)`. Les lectures directes sont encadrées par des politiques RLS dans les scripts audités.
- Fausse alerte écartée après lecture complète : `accounting.manage` est attribué à `admin_general` dans `supabase/adm5_schema.sql` (ligne 211), et le test existant vérifie cette attribution. Aucun correctif SQL n'est nécessaire ; aucun script Supabase n'a été modifié.
- Tests `NAV-ADM-3` : CI #1829 réussie ; CI #1830 (mise à jour documentaire) réussie.
- Limite : audit statique du dépôt uniquement. Il ne prouve pas que toutes les migrations sont appliquées sur Supabase distant et ne remplace pas les essais avec de vrais comptes.
- **Preview Cloudflare actuelle :** commit `a22487933e4927cf46e35df575d49b672c386f1f`, build et déploiement réussis le 3 novembre 2026 à 16:21:04 UTC.
  - Accueil : https://097931a2-allemand.brid-randomtv.workers.dev/#accueil
  - Administration : https://097931a2-allemand.brid-randomtv.workers.dev/#admin
  - Preview de branche : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev
- **Anciennes previews à ne plus utiliser :** `533921d` (`4a490678-allemand.brid-randomtv.workers.dev`), `29aafce` (`ec6160ef-allemand.brid-randomtv.workers.dev`) et les autres URLs de commits antérieurs. Elles restent des déploiements historiques dans Cloudflare ; leur suppression effective nécessite l'accès de gestion Cloudflare, qui n'est pas disponible dans les outils de cette session.
- PR #17 : ouverte, en brouillon, non fusionnée ; `main` inchangée. Aucun déploiement manuel n'a été lancé.
- **Validation encore attendue :** essai utilisateur sur la preview actuelle, notamment `لوحة التحكم`, les rôles admin/non-admin, le mode sombre et l'affichage ordinateur/mobile. Aucun test navigateur réel n'est revendiqué ici.

## 2026-11-03 — correction du contraste du portail public (V8.21)
- Retour utilisateur : textes du bandeau supérieur (titre, sous-titre, logo/écusson), navigation publique (بوابة الزوار، المواد، السنوات، تسجيل الدخول، إنشاء حساب) et grand titre de la page d'accueil à peine lisibles, avec impression de texte clair sur fond clair.
- Cause identifiée dans `style-prototype-dz.css` : le bloc V8.19 de palette publique, ajouté après les règles du thème sombre, appliquait des fonds clairs et des couleurs de texte fixes sans condition de thème. Il pouvait donc écraser les couleurs prévues pour le mode sombre.
- Correction ciblée : ajout de règles explicites `html[data-theme="light"] #gate` et `html[data-theme="dark"] #gate` pour le bandeau, titre/sous-titre, navigation, grand titre, sous-titre en italique, accroche 2026/2027, cartes, boutons et textes secondaires. Le thème sombre reçoit des surfaces sombres et des textes clairs ; le thème clair conserve des textes foncés sur surfaces claires.
- Seul `style-prototype-dz.css` est modifié pour cette correction. Aucun changement HTML/JS, identifiant, navigation, authentification, Supabase, RLS, schéma ou paiement.
- Commit : `0c8e36e076876fdb0eb7a5a73446d546f09d9adb`, sur `design/prototypes-67-74-alignment` (PR #17 vers `main`).
- Validation restante : CI et publication Cloudflare à contrôler, puis vérification visuelle réelle par l'utilisateur en clair/sombre et sur ordinateur/mobile. Aucune validation visuelle navigateur n'est revendiquée par cette modification CSS seule.


## 2026-11-03 — validation utilisateur des accès administrateur et du portail public

- L'utilisateur confirme avoir testé la preview Cloudflare du commit `4053334eae3b075d9e5c12afa83beaa5867bd4f0` avec un compte élève : ce compte ne peut pas accéder à `لوحة التحكم` ni consulter les données administratives.
- Cette confirmation est un test manuel effectué par l'utilisateur sur la preview ; elle complète les contrôles statiques `NAV-ADM-1` à `NAV-ADM-3` et la revue des modules ADM-1 à ADM-5. Ne pas la présenter comme un test automatisé ni comme un audit indépendant des politiques RLS distantes.
- L'utilisateur confirme également que le rendu visuel du portail public est corrigé sur cette preview : correction V8.21 acceptée visuellement.
- Commit applicatif : `0c8e36e` ; dernier HEAD PR au moment de la validation : `4053334eae3b075d9e5c12afa83beaa5867bd4f0`.
- Contrôles de ce HEAD : validation structurelle et pédagogique réussie ; build Cloudflare réussi. Le contrôle Supabase Preview est `skipped` (aucune branche Supabase associée), il n'est donc pas compté comme réussi.
- Preview correspondant au HEAD : https://cb0c9363-allemand.brid-randomtv.workers.dev/#accueil ; accès direct à la vue admin : https://cb0c9363-allemand.brid-randomtv.workers.dev/#admin.
- PR #17 demeure ouverte, en brouillon, non fusionnée ; base `main`. Aucun changement sur `main`, aucune nouvelle branche et aucune modification Auth/Supabase/RLS/schéma/paiements dans le cadre de cette validation.
- Prochaine étape : terminer la revue des conditions de fusion et des vérifications de la PR. Ne pas sortir du brouillon ni fusionner sans autorisation explicite de l'utilisateur.


## 2026-11-03 — refonte esthétique globale V9.0 (nouveau prototype)

- Demande utilisateur : faire évoluer visuellement la plateforme réelle pour qu'elle se rapproche de la direction artistique du prototype complet (vert algérien #006233, blanc, rouge #D21034), avec une présentation professionnelle et contrastée ; priorité explicite donnée à l'esthétique visuelle.
- Audit préalable : le projet possède déjà des couches de style substantielles, un portail public séparé, des composants partagés (.topbar, #tabs, .page-head, .card, .panel, .btn, .seance) et une gestion distincte des thèmes clair/sombre. Le prototype HTML autonome utilise Tailwind/Chart.js/Lucide et des données de démonstration ; ces dépendances et données fictives ne sont pas copiées dans l'application.
- Réalisation V9.0 : ajout d'une couche CSS additive dans style-prototype-dz.css pour l'application connectée : en-tête vert national à contraste élevé, navigation plus lisible, hiérarchie des titres, cartes et panneaux, boutons, formulaires, tableaux, parcours de cours, bannière d'accueil, états de focus et adaptation mobile. Déclinaisons explicites en thème clair et sombre.
- Cache : version de feuille de style portée à style-prototype-dz.css?v=79 dans index.html et sw.js ; version du service worker portée à dz-de-v3.139.0.
- Fichiers modifiés uniquement : style-prototype-dz.css, index.html, sw.js. Aucun JS métier, identifiant, route, données, rôle, auth, politique RLS, schéma, migration ou paiement modifié.
- Commit V9.0 : 922fa6025a4fc3630146ad632d8a24de58e99493, branche design/prototypes-67-74-alignment, PR #17 vers main. main inchangée, PR ouverte, Ready for review, non fusionnée.
- Contrôles : la cohérence des références CSS/version dans index.html et sw.js a été vérifiée par lecture du commit. GitHub Actions #41734602778 a été lancée et était in_progress au dernier contrôle. Aucune validation visuelle navigateur n'est revendiquée.
- Prévisualisation à utiliser après publication réussie : consulter le commentaire Cloudflare du commit 922fa60 ou la preview de branche. Ne pas réutiliser les anciennes URLs de commits précédents.
- Validation utilisateur encore nécessaire : comparer le rendu réel en clair et sombre, ordinateur et mobile, particulièrement l'accueil connecté, les matières, le parcours, le tableau de bord professeur et لوحة التحكم. Corriger à partir des observations concrètes avant d'envisager la fusion.
- État du PR au 3 novembre : ouverte, Ready for review (draft=false), non fusionnée ; dernier HEAD 922fa6025a4fc3630146ad632d8a24de58e99493. Aucun changement sur main, aucune nouvelle branche et aucun déploiement manuel.

## 16. Refonte structurelle du bandeau d'accueil élève — 4 novembre 2026

- Demande : rapprocher réellement l'application du prototype de référence, au-delà d'une harmonisation générale des couleurs.
- Audit ciblé : le tableau de bord connecté utilisait encore un bandeau d'accueil bleu générique. Le rendu était produit par `renderWelcome()` dans `app.js`, avec des données de session, les séances accomplies et la prochaine séance.
- Modification : reconstruction du bandeau en composition « hero » DZ (vert profond, accent rouge, emblème algérien, hiérarchie de titres, progression visuelle et actions pédagogiques).
- Les actions existantes `data-go="seances"`, `data-go="biblio"` et `data-go="devoir"` sont conservées ; la progression est calculée à partir des séances réelles déjà chargées par l'application. Aucun indicateur fictif nouveau n'a été ajouté.
- CSS dédié et responsive ajouté dans `style-prototype-dz.css`, sans bibliothèque externe. Référence CSS portée à `v=80` dans `index.html` et le précache du service worker ; version du cache portée à `dz-de-v3.140.0`.
- Commits applicatifs : `2e91410` (app.js), `d651078` (CSS), `d8d46e3` (index), `de0afe7` (service worker).
- Aucun changement aux routes, aux contrôles de rôle, à Auth, Supabase, RLS, schémas, migrations ou paiements.
- Validation effectuée à ce stade : contrôle statique de l'équilibre des accolades CSS (0 différence). La CI GitHub doit encore confirmer la syntaxe et les tests du dépôt ; aucun test navigateur ni rendu visuel n'est revendiqué.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main`.

## 17. Recomposition de l'espace professeur IA — 4 novembre 2026

- Objectif : rapprocher la page « الأستاذ الافتراضي » du prototype en lui donnant une composition éditoriale et pédagogique dédiée, et non une simple carte de chat isolée.
- Structure HTML : bandeau d'introduction DZ, capacités décrites sans promettre de fonctions non vérifiées, zone de dialogue et panneau de conseils d'utilisation.
- Tous les identifiants et contrôles du dialogue existant sont conservés : `chatLog`, `chatSug`, `chatVoiceLang`, `chatVoiceStatus`, `chatForm`, `chatInput`, `chatMicBtn`. Le moteur IA et les scripts vocaux ne sont pas remplacés.
- CSS dédié : hiérarchie visuelle, orbe décorative animée, colonnes desktop, adaptation mobile et règles de contraste sombre.
- Cache CSS : `v=81`; cache service worker : `dz-de-v3.141.0`.
- Aucun changement de route, de rôle, d'authentification, de base Supabase, RLS, paiement ou API.
- Validation statique : équilibre des accolades CSS à zéro ; conservation vérifiée des six identifiants de dialogue dans le HTML. Tests CI GitHub en attente au moment de la consignation. Aucun rendu navigateur revendiqué.
- PR #17 reste ouverte, non fusionnée ; aucun changement sur `main`.


## 18. Recomposition visuelle de l'espace cours et séances — 4 novembre 2026

- Périmètre : vue réelle `data-view="seances"`, catalogue des unités, cartes de séances et panneau de détail.
- Audit du moteur : le rendu des unités et séances est produit par `renderSeances()`, `uniteSelector()` et `openSeance()` dans `app.js`. Les états terminés/verrouillés, la progression, le contrôle d'accès payant et les contenus pédagogiques restent calculés par ces fonctions.
- Recomposition : ajout de classes de présentation ciblées (`dz-course-page`, `dz-course-hero`, `dz-course-catalog`) autour des éléments existants. Le bandeau devient un hero vert profond avec accents rouge/blanc et barre de progression ; le catalogue présente les filtres de niveau, unités et séances sous forme de cartes hiérarchisées ; le détail de séance reçoit un panneau dédié.
- Responsive : grille d'unités en 3 colonnes sur grand écran, 2 sur tablette et 1 sur mobile. Adaptations explicites du thème sombre, des états actifs/terminés et du mouvement réduit.
- Préservation : IDs `seancesHead`, `progSeances`, `progLbl`, `seancesGrid`, `seanceDetail` inchangés ; attributs `data-niveau`, `data-unite`, `data-seance` inchangés. Aucune logique métier, progression, verrouillage, abonnement, route, authentification, Supabase, RLS, schéma ou paiement modifié.
- Cache : feuille CSS portée à `v=82` dans `index.html` et `sw.js` ; service worker porté à `dz-de-v3.142.0`.
- Validation statique à effectuer après commits : syntaxe/équilibre CSS, présence des IDs et attributs interactifs, cohérence des versions de cache, CI GitHub. Aucun rendu navigateur réel n'est revendiqué par cette modification.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 19. Refonte de « مسارك » avec graphiques de progression — 4 novembre 2026

- Périmètre : vue `data-view="masar"`, module réel `masar.js` et présentation CSS ciblée.
- Nouvelle composition : hero de parcours avec anneau SVG de progression générale, indicateurs de séances terminées/restantes et unités disponibles ; carte d'action prioritaire conservée ; graphique horizontal des taux de réussite par compétence ; progression détaillée de l'unité en cours.
- Source des données : progression calculée à partir de `UNITES` et `loadSeancesFor()` (stockage local des séances réellement terminées). Graphique de compétences calculé depuis `MEMOIRE.carteErreurs()`, dont le taux correspond au rapport réponses correctes / tentatives. Si aucune donnée de compétence n'existe, affichage d'un état vide explicatif plutôt que de valeurs fictives.
- La règle métier « révision due avant nouvelle séance » reste inchangée ; les destinations `data-go="revision"`, `data-go="seances"` et `data-go="examen"` sont conservées.
- Présentation : thème DZ vert profond/blanc/rouge, anneau SVG, barres de données, surfaces hiérarchisées, adaptations mobile et mode sombre. Aucun Chart.js, Tailwind ou autre dépendance ajoutée.
- Cache : `masar.js?v=3514`, CSS `v=83`, service worker `dz-de-v3.143.0`.
- Aucun changement d'authentification, rôle, route, RLS, schéma, paiement ou backend. Aucune donnée de démonstration n'est injectée.
- Contrôles statiques et CI à vérifier après commits ; aucun rendu navigateur ni déploiement Cloudflare n'est déclaré validé ici.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : non fusionnée ; aucun nouveau branch ni changement direct sur `main`.


## 20. Recomposition esthétique de l'espace professeur — 4 novembre 2026

- Périmètre : vue réelle `data-view="profboard"` et module `prof.js`.
- Audit préalable : l'espace est réservé au rôle `prof` via `accesAutorise()`. Les données proviennent du registre local `assets/bdd/eleves.json`; les corrections locales sont stockées dans `dz_de_prof_notes_v1`, le journal dans `dz_de_prof_audit_v1`. Les indicateurs, histogrammes et répartitions existaient déjà et sont calculés depuis ces données.
- Modification structurelle limitée : ajout d'un conteneur de présentation `dz-prof-dashboard` autour du rendu existant, sans modifier les fonctions de chargement, calcul, filtrage, saisie, export, impression, audit ou événements.
- Design : hero vert DZ profond avec accent rouge, badge d'accès, actions CSV/impression/réinitialisation mieux contrastées ; navigation par onglets plus nette ; cartes KPI mieux hiérarchisées ; histogramme des moyennes et barre de préparation visuellement renforcés ; tableaux, filtres et alertes affinés.
- Responsive et accessibilité : grille KPI 4 colonnes desktop, 2 colonnes tablette/mobile ; adaptations de l'en-tête, des onglets et du graphique ; règles de contraste sombre et respect de `prefers-reduced-motion`.
- Préservation : aucun ID, rôle, permission, dataset, calcul de note, seuil de préparation, événement ou fonctionnalité modifié. Aucune modification Auth, Supabase, RLS, schéma, migration ou paiement.
- Cache : `style-prototype-dz.css?v=84` dans `index.html` et le précache du service worker ; version du cache `dz-de-v3.144.0`.
- Contrôles statiques : conservation des points d'ancrage `profBody`, `prOng`, `prContenu`, `pCsv`, `pPrint`, `pReset` ; structure du wrapper vérifiée ; CSS ajouté avec accolades équilibrées à contrôler dans la validation finale. Aucun rendu navigateur ou déploiement Cloudflare n'est déclaré visuellement confirmé.
- CI antérieure : l'exécution #1850 du commit `73c64baa7d8182cec73d41f4f4c73877837e95f9` est terminée avec succès ; elle précède les changements de cette section.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : aucun nouveau branch, aucune modification directe de `main`, aucune fusion ni déploiement manuel.


## 21. Recomposition visuelle de l'administration — 4 novembre 2026

- Périmètre : vue réelle `data-view="admin"`, styles ciblés sur `#adminBody`.
- Audit : `admin.js` vérifie la présence du client Supabase, récupère l'utilisateur et son profil, puis exige explicitement `p.role === 'admin'` avant les lectures des profils et des notes. Les autres données administratives sont chargées via les fonctions Supabase existantes.
- Modification : couche CSS additive uniquement. Hero DZ vert profond avec accent rouge, cartes KPI, grilles de comptes/notes, tableaux, gestion des plans, abonnements, sponsors et paiements, états de chargement et refus d'accès. Déclinaisons mobile, sombre et mouvement réduit.
- Préservation stricte : aucun changement de `admin.js`, aucun changement des appels Supabase, des contrôles de rôle, des permissions, des actions de modification de rôle, d'abonnement, de sponsor ou d'annonce. Aucun changement Auth, RLS, schéma, migration ou paiement.
- Cache : CSS `v=85` dans `index.html` et le précache du service worker ; cache `dz-de-v3.145.0`.
- Validation statique : les sélecteurs sont limités à la vue admin ; les classes ciblées existent dans le rendu actuel de `admin.js`. Aucun test d'accès réel, rendu navigateur ou déploiement Cloudflare n'est revendiqué par ce seul changement.
- La CI du travail professeur (HEAD précédent `a523431`) était en file d'attente au moment de ce contrôle ; elle ne valide pas encore cette modification administrative.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : aucune nouvelle branche, aucune modification directe de `main`, aucune fusion et aucun déploiement manuel.


## 22. Recomposition du catalogue des matières — 4 novembre 2026

- Périmètre : vue `data-view="matieres"`, module `matieres.js`, styles limités à la vue.
- Données : le catalogue reste alimenté par `assets/bdd/matieres.json`, filtré selon le niveau et la filière de session. Les statuts du registre sont conservés ; la vue n'annonce pas une matière planifiée comme déjà opérationnelle.
- Présentation : hero DZ vert profond, sélecteurs de niveau/filière plus lisibles, statistiques du registre, cartes matières avec statut, volumes d'unités/séances existants, accès aux séances pour les matières actives, bloc explicatif.
- Structure : ajout du wrapper de présentation `dz-subjects`. Correction d'une fermeture HTML erronée d'une balise `code` dans le bloc explicatif. Les IDs `matNiveau` et `matFiliere`, événements de changement, filtre de niveau/filière et action `data-go="seances"` restent inchangés.
- Aucun ajout de fausses matières, d'unités, de séances, de statistiques ou de capacités. Aucun nouveau moteur ni dépendance.
- Cache : `style-prototype-dz.css?v=86` dans `index.html` et précache du service worker ; version `dz-de-v3.146.0`.
- Contrôles statiques à effectuer après commit : balance CSS, présence des sélecteurs et IDs, références cache cohérentes, syntaxe JavaScript. Aucun rendu navigateur ou déploiement Cloudflare n'est déclaré visuellement validé.
- CI #1854 et #1855 du HEAD précédent `f27ecbc` : toutes deux terminées avec succès. Cette validation précède les modifications de cette section.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion, aucun déploiement manuel.


## 23. Recomposition des espaces d'évaluation — 4 novembre 2026

- Périmètre visuel : vues `devoir`, `devoirs`, `examen`, `quiz`, `simulation` et `officiels`.
- Modules audités : `devoirs_unite.js`, `devoirnote.js`, `examen.js`, `quiz.js`, `officiels.js`. Les rendus existants s'appuient sur les archives de sujets, les devoirs, les banques de questions, les corrigés et l'historique local.
- Travail : composition des en-têtes, cartes d'années et de sujets, statistiques d'archive, onglets, filtres, cartes de quiz, choix de réponses, feedback, corrigés, sections et résultats. Couleurs DZ saturées, hiérarchie typographique, grilles responsives, contrastes sombres.
- Préservation : aucune logique de notation, minuteur, calcul de correction, contenu d'exercice, banque de questions, source de données ou stockage local n'a été changée. Les boutons, sélecteurs, filtres et gestionnaires restent dans les modules actuels. Aucune bibliothèque graphique ou dépendance ajoutée.
- Cache : `style-prototype-dz.css?v=87` dans `index.html` et précache du service worker ; version `dz-de-v3.147.0`.
- Contrôles préalables : CI #1856 et #1857 du HEAD `2c25400` ont réussi. Les contrôles de CSS, de cohérence des références et les tests CI du nouveau HEAD doivent être exécutés après ces commits. Pas de validation navigateur ni de déploiement Cloudflare revendiqué.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : pas de branche supplémentaire, aucun changement direct sur `main`, aucune fusion, aucun déploiement manuel.


## 24. Refonte bibliothèque, résumés et méthodologie — 4 novembre 2026

- Vues concernées : `biblio`, `malakhiss`, `methode` et en-tête `revision`.
- Bibliothèque : statut de la base, KPI, filtres, recherche, résultats, fiches, pagination et détail de fiche/corrigé.
- Résumés : cartes d'unités, détails dépliables, vocabulaire, grammaire, structures, conseils, filtres de niveau/unité et onglets.
- Méthodologie : choix d'unité, fiches de devoirs réels, métadonnées, protocole en étapes, auto-évaluation et plan hebdomadaire.
- Préservation : aucune donnée de bibliothèque, fiche, résumé, question, règle de révision, stockage ou logique de rendu n'a été remplacée. Les identifiants `bddStatus`, `biblioBody`, `malakhissBody`, `methodeBody`, `memoBody`, les contrôles de filtre et les événements existants sont conservés. Pas de dépendance ajoutée.
- Présentation : compositions RTL, palette DZ profonde, cartes et hiérarchie, grilles desktop/tablette/mobile, contraste sombre.
- Cache : `style-prototype-dz.css?v=88` ; service worker `dz-de-v3.148.0`.
- CI avant ce lot : #1858 et #1859 réussies sur les commits précédents. Les tests du nouveau HEAD restent à confirmer. Aucune vérification visuelle navigateur ni déploiement Cloudflare revendiqué.
- Même branche `design/prototypes-67-74-alignment`, PR #17 vers `main`. Aucun changement direct de `main`, aucune fusion et aucun déploiement manuel.

## 25. Recomposition esthétique de la messagerie nationale — 4 novembre 2026

- Périmètre : vue réelle `data-view="msg"`, section `#msgBody` et composants produits par `msg.js`.
- Audit préalable : la messagerie possède déjà son moteur (groupes officiels, conversations, fil de messages, pièces jointes, présence Realtime, vérification scolaire et modération prof/admin). Les styles fonctionnels existants étaient dans `style.css`; la nouvelle couche est limitée à la présentation de cette vue.
- Composition ajoutée : bandeau de page DZ, accueil explicatif vert profond, cartes de services, étapes, titres de sections, cartes de groupes, bulles de messages, zone de rédaction, états de vérification et panneau de modération.
- Responsive : cartes en une colonne sur petit écran, fil et composer adaptés au mobile ; déclinaisons explicites clair/sombre et respect de `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `msg.js`, aux IDs `msgBody`, `msgPres`, `msgText`, `msgFile`, aux attributs `data-act`, `data-conv`, `data-mod`, aux appels Supabase, à Realtime, aux vérifications, aux rôles ou aux permissions. Aucune modification Auth, RLS, schéma, migration ou paiement.
- Cache : `style-prototype-dz.css?v=89` dans `index.html` et le précache du service worker ; version `dz-de-v3.149.0`.
- Contrôles CI antérieurs : #1860 (commit index v88) et #1861 (commit documentaire v88) terminées avec succès. Les workflows déclenchés par le présent lot doivent encore être vérifiés sur les nouveaux commits.
- Contrôles statiques après écriture : cohérence des versions de cache, équilibre des accolades CSS, présence des sélecteurs de la vue message et conservation des points d'ancrage du module. Aucun test navigateur, aucune validation visuelle mobile/desktop et aucun déploiement Cloudflare ne sont revendiqués à ce stade.
- Branche inchangée `design/prototypes-67-74-alignment`, PR #17 vers `main`. Aucun changement direct sur `main`, aucune nouvelle branche, aucune fusion et aucun déploiement manuel.

## 26. Recomposition esthétique du guide d'utilisation — 4 novembre 2026

- Périmètre : vue réelle `data-view="guide"`, module `guide.js` et données `assets/bdd/onboarding.json`.
- Audit préalable : le guide est personnalisé par rôle (élève, professeur, parent) et construit depuis les données d'onboarding ; le changement ne remplace ni les textes, ni les rôles, ni le comportement de sélection.
- Présentation : hero DZ vert profond, sélecteur de rôle, cartes de l'objectif, étapes d'utilisation et premiers pas ; hiérarchie RTL et contrastes renforcés.
- Responsive : sélecteur vertical sur mobile, cartes adaptatives, variantes clair/sombre et mouvement réduit.
- Préservation : aucun changement à `guide.js`, au chargement des données, aux clés de session, au parcours d'onboarding, aux événements ou aux permissions. Aucune modification Auth, Supabase, RLS, schéma, migration ou paiement.
- Cache : `style-prototype-dz.css?v=90` dans `index.html` et le précache du service worker ; version `dz-de-v3.150.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, présence des classes réellement produites par `guide.js`, cohérence des références cache et CI. Aucun test navigateur ni validation visuelle utilisateur n'est revendiqué.
- Lot précédent messagerie : CI #1862, #1863 et #1864 terminées avec succès. Le nouveau lot guide déclenche ses propres workflows.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` : aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 27. Recomposition des espaces classe, salle live et statistiques nationales — 4 novembre 2026

- Audit préalable des modules réels `classe.js`, `live.js`, `stats.js`, des vues `data-view="classe"`, `data-view="live"`, `data-view="stats"` et des styles existants.
- Classe virtuelle : hero de section, encart de prochaine séance, navigation par onglets, six indicateurs, emploi du temps, leçons, présence et notes ; présentation responsive en cartes, sans modifier les données de classe.
- Salle live : hero de séance, identité du professeur, compteur, zone vidéo, contrôles micro/caméra/main levée, onglets chat/tableau blanc/présence/programme ; seuls les styles sont ciblés.
- Statistiques nationales : hero et KPI calculés par le module, navigation des six vues, conteneur cartographique, légende et classement des wilayas ; la carte SVG et les agrégats réels sont conservés.
- Thèmes clair/sombre, adaptation mobile et prise en compte de `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `classe.js`, `live.js`, `stats.js`, aux données JSON, aux IDs `classeBody`, `liveBody`, `statsBody`, `clContenu`, `stContenu`, `panChat`, `panTableau`, `panPresence`, aux événements, aux contrôles ou aux sources des statistiques. Aucune modification Auth, Supabase, RLS, schéma, migration ou paiement.
- Cache : `style-prototype-dz.css?v=91` dans `index.html`, précache actualisé et service worker `dz-de-v3.151.0`.
- Contrôles statiques à effectuer après écriture : accolades CSS équilibrées, présence des sélecteurs de vues et composants audités, cohérence des références cache, CI sur le nouveau HEAD.
- Aucun test visuel navigateur, aucune vérification réelle de caméra/micro/flux live et aucun déploiement Cloudflare ne sont revendiqués à ce stade.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 28. Recomposition de l'espace parents, des réservations et du dossier projet — 4 novembre 2026

- Audit préalable des vues `data-view="parents"`, `data-view="reservation"`, `data-view="projet"` et des modules réels `parents.js`, `reservation.js`, `projet.js`.
- Espace parents : hero, actions de rapport, sélection multi-enfants, navigation par onglets, KPI, synthèse, informations scolaires, examens, présence et messages ; les données affichées continuent de provenir de `parents.json`.
- Réservations : hero, catalogue des professeurs, cartes de profils, onglets, formulaire de choix, créneaux, récapitulatif de prix et règles ; le calcul des frais, l'offre de première séance et la persistance locale restent ceux de `reservation.js`.
- Dossier projet : hero de présentation, badges, navigation des 13 sections, cartes de contenu, ressources, tarifs et roadmap ; les données continuent de provenir de `plan_projet.json`.
- Responsive mobile/tablette, thèmes clair/sombre et réduction des animations.
- Préservation stricte : aucun changement aux trois modules JavaScript, aux JSON, aux clés localStorage, aux exports PDF/TXT, aux interactions WhatsApp, aux calculs ou aux événements. Aucun changement Auth, Supabase, RLS, schéma, migration ou paiement.
- Point de vigilance documenté : les modules parents et réservation déclarent leurs données et réservations comme locales (localStorage/fichiers JSON) ; leur habillage visuel ne transforme pas ces données en synchronisation serveur ni en réservation centralisée.
- Cache : `style-prototype-dz.css?v=92` dans `index.html`, précache du service worker actualisé et version `dz-de-v3.152.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, classes réellement émises par les modules, vues et cache cohérents, CI sur le nouveau HEAD.
- Aucun test visuel navigateur, aucun test de réservation réelle et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 29. Recomposition de l'espace personnel / mon compte — 4 novembre 2026

- Audit du rendu réel `renderCompte()` dans `app.js` et de la liaison locale/cloud `renderLienCloud()`. La vue présente les informations du profil, le rôle, le niveau, la filière, la wilaya, les points, la progression locale, les paramètres de prononciation, la confidentialité et la déconnexion.
- Présentation ciblée : en-tête DZ, panneaux profil et progression en grille, lignes de données hiérarchisées, bloc confidentialité, formulaire de liaison cloud et actions de compte.
- Responsive : deux colonnes sur grand écran, une colonne sur tablette/mobile ; variantes clair/sombre et prise en compte de `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `app.js`, `renderCompte()`, `renderLienCloud()`, `#compteBody`, `#lcCard`, `#lcMail`, `#lcPass`, `#lcBtn`, `#btnSound2`, `#btnLogout`, aux calculs de progression, à la session, au stockage local, au parcours de liaison ou à la déconnexion.
- Point de transparence conservé : les données de progression et la confidentialité affichées par le compte décrivent toujours le fonctionnement local existant ; le style ne les transforme pas en données cloud synchronisées.
- La messagerie nationale était déjà stylée dans le bloc de la vue `msg` et documentée en section 25 ; aucun doublon ni changement à `msg.js` n'a été introduit.
- Cache : `style-prototype-dz.css?v=93` dans `index.html`, précache actualisé et service worker `dz-de-v3.153.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, présence des sélecteurs du compte, cohérence des références de cache, CI sur le nouveau HEAD.
- Aucun test navigateur, aucune validation réelle de liaison cloud ou de déconnexion et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 30. Recomposition de la grammaire, du cadre légal et du manuel officiel — 4 novembre 2026

- Audit des vues réelles `grammaire`, `legal`, `buch` et de leurs modules `grammaire.js`, `legal.js`, `buch.js`.
- Bibliothèque grammaticale : filtres de recherche, niveau, CEFR, chapitres, puces actives, grille de fiches, explications, métadonnées, exemples, avertissements et astuces ; la fiche modale reste lisible.
- Cadre légal : en-tête distinctif, emblème, sections juridiques et note finale structurés sans réécrire ni raccourcir le contenu juridique.
- Manuel officiel : hero, navigation des leçons, objectifs, grammaire, textes/dialogues, vocabulaire, tableaux, exercices, champs de réponse et résultat de correction.
- Variantes clair/sombre, adaptation mobile et prise en compte de `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `grammaire.js`, `legal.js`, `buch.js`, aux contenus de cours, aux filtres, à la recherche, à la correction, aux notes /20, aux contrôles d'accès, à la lecture vocale, aux pages du manuel ou aux boutons `data-go`.
- Aucune donnée d'exemple ni statistique artificielle ajoutée ; les contenus continuent de provenir des fichiers JSON et du moteur existants.
- Cache : `style-prototype-dz.css?v=94` dans `index.html`, précache actualisé et service worker `dz-de-v3.154.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, présence des sélecteurs ciblés, cohérence des références de cache, CI sur le nouveau HEAD.
- Aucun test navigateur, aucune correction de cours réelle et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 31. Recomposition du cloud privé, des abonnements et de l'espace partenaires — 4 novembre 2026

- Audit des modules réels `cloud.js` et `billing.js`, des vues `cloud`, `abonne` et `sponsor`.
- Cloud privé : présentation différenciée de la connexion, de la mémoire à synchroniser, des documents privés, de l'état de synchronisation et de la liaison parent-enfant.
- Abonnements : parcours d'explication, cartes de plans, prix issus du système existant, données CCP/BaridiMob, état des demandes, historique de paiement et formulaire de preuve. Aucun tarif ni statut n'a été ajouté ou modifié par le CSS.
- Partenaires : présentation des trois emplacements publicitaires existants, formulaire de demande, champs de contact et kit sponsor imprimable.
- Modes clair/sombre, responsive tablette/mobile, réduction des animations.
- Préservation stricte : aucun changement à `cloud.js`, `billing.js`, `paywall.js`, `trial.js`, aux identifiants des formulaires, aux appels Supabase, aux RPC, au bucket privé, aux règles RLS, aux liaisons enfant-parent, aux calculs de prix, à la création/validation des abonnements, au dépôt de preuve, aux paiements ou aux demandes sponsor.
- Les abonnements restent activés manuellement par l'administration ; aucun traitement de carte bancaire ni renouvellement automatique n'a été ajouté. Le CSS ne modifie ni les autorisations ni les règles de stockage cloud.
- Cache : `style-prototype-dz.css?v=95` dans `index.html`, précache actualisé et service worker `dz-de-v3.155.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, présence des sélecteurs et IDs ciblés, cohérence des références de cache, CI sur le nouveau HEAD.
- Aucun test de paiement réel, aucune validation réelle d'upload/synchronisation, aucun test visuel navigateur et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 32. Correction des styles réels du corpus documentaire et de la banque d'exercices — 4 novembre 2026

- Audit croisé de `corpus.js`, `banque.js` et du CSS historique.
- Défaut identifié : plusieurs sélecteurs existants visaient `.cp-card`, `.bq-card` ou `.bq-item`, alors que les modules émettent effectivement `.cp-c`, `.cp-ti`, `.cp-x`, `.bq-c`, `.bq-f` et `.bq-s`. Ces règles ne pouvaient donc pas habiller les cartes dynamiques concernées.
- Corpus : correction des cartes documentaires, titre/extrait, type/niveau, métadonnées/licence, actions d'ouverture, filtres et état vide.
- Banque : correction des cartes d'exercices, fiches de règles et sujets, onglets, filtres, choix de réponse, retours de correction et affichage des réponses.
- Modes clair/sombre, responsive mobile et réduction des animations.
- Préservation stricte : aucun changement à `corpus.js`, `banque.js`, aux fichiers documentaires, au contenu des exercices, aux réponses, aux corrections, aux filtres ou aux événements.
- Cache : `style-prototype-dz.css?v=96` dans `index.html`, précache actualisé et service worker `dz-de-v3.156.0`.
- Contrôles statiques à effectuer après écriture : équilibre des accolades CSS, classes émises présentes dans les sélecteurs, cohérence des références de cache, CI sur le nouveau HEAD.
- Aucun test navigateur, aucune correction pédagogique de contenu et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 33. Finition ciblée du statut de disponibilité dans le portail public — 4 novembre 2026

- Audit croisé de `public-portal.js` et de `style-prototype-dz.css` : le module génère la classe `.pub-branch-availability` pour présenter le nombre de matières complètes/partielles ou l'état « contenu en préparation ».
- Le rendu héritait seulement de la règle générique `.pub-branch-foot span`, sans style propre pour distinguer le statut. Ajout d'un badge compact avec bordure, fond, contraste et typographie dédiés.
- Ajout des variantes du thème sombre et d'un ajustement mobile ; aucune modification du catalogue, des statuts des matières, des parcours de navigation ou du code JavaScript.
- Préservation stricte : aucun changement à `public-portal.js`, `assets/bdd/subjects.json`, `assets/bdd/matieres.json`, à l'inscription, à l'authentification, aux données ou aux permissions.
- Cache : `style-prototype-dz.css?v=97` dans `index.html`, précache actualisé et service worker `dz-de-v3.157.0`.
- Contrôles statiques réalisés après écriture : présence du sélecteur du statut, références de cache v97 cohérentes, conservation de la classe émise par le module, équilibre des accolades CSS à recontrôler sur le fichier final, CI à suivre sur le nouveau HEAD.
- Le workflow #1887 associé au HEAD précédent est terminé avec succès, y compris les 27 étapes de validation structurelle et pédagogique. Le nouveau lot déclenche une nouvelle CI ; aucun test visuel navigateur ni déploiement Cloudflare du nouveau HEAD n'est revendiqué.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune nouvelle branche, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 34. Finition visuelle de la carte et des classements nationaux — 4 novembre 2026

- Audit ciblé de `stats.js` : la vue produit une carte SVG des wilayas, des points interactifs `.wpt`, un panneau d'information `.st-tip`, une légende et des classements `.wrow` avec barres de progression.
- Les règles de base existaient déjà dans `style.css` ; le travail a donc été limité à une couche esthétique complémentaire sur les vrais sélecteurs : infobulle à contraste élevé, accent DZ rouge/vert, survol discret des lignes de classement et transition des barres.
- Variantes explicites clair/sombre, largeur mobile et respect de `prefers-reduced-motion`.
- Aucun changement à `stats.js`, aux données géographiques, aux statistiques, aux calculs d'agrégation ou à la sécurité.
- Cache CSS actualisé à `style-prototype-dz.css?v=98` ; service worker `dz-de-v3.158.0` et précache CSS aligné.
- Validation statique après écriture : accolades CSS équilibrées, sélecteurs présents, thème sombre/mobile/réduction des animations et références de cache à vérifier sur le HEAD final.
- CI #1890 du HEAD précédent réussie. Une nouvelle CI est attendue sur le nouveau HEAD ; aucun rendu navigateur ni déploiement Cloudflare n'est déclaré vérifié.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 35. Recomposition de la grille du tableau de bord élève à partir du prototype — 4 novembre 2026

- Comparaison directe du prototype HTML avec le vrai accueil connecté de `index.html`, `app.js` et les styles existants.
- Le prototype présente une hiérarchie en deux zones : contenu pédagogique principal (matières, progression et actions) et colonne de soutien (assistant, recommandations, messages). L'accueil réel dispose déjà de données et composants distincts : `welcomeBox`, `subjHome`, `statsHome`, cartes `grid3` et panneaux `home-side`.
- Écart constaté : l'ordre visuel de la grille réelle ne suivait pas la hiérarchie du prototype ; les cartes d'accès rapide conservaient une grille générique à trois colonnes et une illustration séparée faisait doublon avec l'emblème du bandeau élève.
- Correction ciblée dans `style-prototype-dz.css` : colonne principale à droite en RTL, colonne de soutien à gauche, cartes d'accès rapide redessinées avec une grille adaptative, panneaux latéraux harmonisés et suppression de l'illustration décorative redondante. Empilement mobile explicite : contenu principal puis panneaux de soutien.
- Les règles sont limitées à `section[data-view="accueil"]` dans `#shell #app`, avec variantes sombre, tablette/mobile et `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `app.js`, `masar.js`, `matieres.js`, aux données des élèves, aux calculs de progression, aux routes, aux identifiants, aux événements, à l'authentification ou à Supabase.
- Garde-fou de fidélité des données : le prototype contient des exemples fictifs (plusieurs matières, pourcentages, points, recommandations et messages). Ces valeurs n'ont pas été recopiées. Le catalogue réel continue d'indiquer les matières effectivement disponibles ou partielles.
- Cache : CSS `style-prototype-dz.css?v=99` ; service worker `dz-de-v3.159.0` avec précache CSS v99.
- Contrôles statiques à exécuter sur le HEAD final : équilibre des accolades CSS, présence des sélecteurs et breakpoints, cohérence index/SW/cache et CI GitHub.
- Limite de validation : aucun test visuel réel sur navigateur mobile/ordinateur, aucune vérification de déploiement Cloudflare et aucune confirmation utilisateur du rendu de ce lot ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 36. Finition de la zone centrale de l'accueil élève — matières, indicateurs et accès rapides — 4 novembre 2026

- Audit du DOM réel dans `index.html` et du rendu dynamique dans `app.js` : `#subjHome` reçoit le catalogue de matières depuis `SUBJECT.ready()` et `assets/bdd/matieres.json` ; `#statsHome` affiche les indicateurs existants ; la grille `.grid3` est déplacée par la phase D3 de `app.js` dans `#quickBody` au sein de `#panelQuick`.
- Constat important : la règle du lot 35 visant `.home-main > .grid3` ne ciblait plus les cartes rapides après leur déplacement DOM par D3. Le lot 36 corrige ce décalage en stylisant le vrai emplacement `#homeSide #panelQuick #quickBody > .grid3` ; les cartes deviennent des raccourcis compacts, sans supposer qu'elles restent dans la colonne principale.
- Catalogue : cartes matières hiérarchisées, distinction visuelle de la matière active, badges de disponibilité (complète/partielle/en préparation), rangée des langues et lien d'exploration. Les statuts restent issus du registre réel ; l'anglais demeure partiel.
- Indicateurs : cartes `#statsHome` mises en forme sans recalculer ni remplacer leurs valeurs.
- Raccourcis : présentation compacte adaptée à la colonne de soutien ; les attributs `data-go`, `data-subj` et les gestionnaires existants ne sont pas modifiés.
- Variantes clair/sombre, responsive mobile/tablette et respect de `prefers-reduced-motion`.
- Préservation stricte : aucun changement à `app.js`, `masar.js`, `matieres.js`, `subjects.json`, `matieres.json`, aux données, calculs, routes, identifiants, événements, authentification ou permissions.
- Cache : `style.css?v=3515` ; service worker `dz-de-v3.160.0` avec précache mis à jour.
- Contrôles statiques : équilibre des accolades CSS, présence des sélecteurs du vrai DOM, références cache index/SW et CI à vérifier sur le HEAD final.
- Aucun test visuel navigateur mobile/ordinateur, aucune validation Cloudflare et aucune confirmation utilisateur du rendu ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.

## 37. Portail public — cohérence visuelle du panneau IA avec l'identité algérienne — 4 novembre 2026

- Audit de la composition publique dans `index.html` et du rendu du catalogue dans `public-portal.js` : le panneau IA du hero était isolé par une palette violette/violette-rose, alors que le reste du portail s'appuie sur le vert, le blanc et le rouge nationaux.
- Harmonisation ciblée du panneau IA : carte et démo en verts profonds/verts très clairs, icône verte, vague audio vert/rouge, réponse et CTA en dégradés DZ ; le rappel rouge reste discret pour préserver la lisibilité.
- Mode sombre explicite pour la carte, les surfaces de dialogue, les libellés et le statut ; respect de `prefers-reduced-motion` pour la vague animée.
- Aucun changement à `public-portal.js`, aux textes, aux liens, aux événements `data-public-view`/`data-public-action`, au catalogue, aux états de disponibilité, à l'inscription, à l'authentification ou aux données. Le panneau reste une présentation visuelle et ne prétend pas fournir une interaction vocale qui n'est pas démontrée par ce composant.
- Cache : `style-prototype-dz.css?v=100` ; service worker `dz-de-v3.161.0` avec précache aligné.
- Validation statique à faire sur le HEAD final : accolades CSS, présence des sélecteurs et variantes sombres, cohérence index/SW et CI.
- Aucun test visuel navigateur mobile/ordinateur, aucune validation de déploiement Cloudflare et aucune confirmation utilisateur du rendu ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 38. Refonte ciblée de l'accueil public — composition visuelle inspirée du prototype — 4 novembre 2026

- Décision de recentrer les travaux sur l'accueil public uniquement, avant toute reprise de l'accueil élève ou des autres vues.
- Comparaison directe du prototype HTML de référence avec la structure réellement servie dans `index.html`. Le prototype apporte une hiérarchie éditoriale plus affirmée : navigation institutionnelle, grand hero en deux colonnes, panneau de démonstration pédagogique, cartes de services, catalogue de matières et choix des années.
- Recomposition CSS dédiée et strictement isolée sous `#gate` : en-tête/navigation, hero, typographie, appels à l'action, indicateurs, panneau IA de présentation, cartes de services, catalogue, cartes des trois années et espace d'inscription.
- Renforcement de la palette DZ (vert profond `#006233`, vert `#00843d`, rouge `#d21034`) et de la profondeur visuelle : fonds superposés, bordures fines, ombres mesurées, rayons cohérents, états hover/focus.
- Déclinaisons mobile/tablette et mode sombre explicite ; respect de `prefers-reduced-motion`. La règle `[hidden]` et les classes de navigation/actions existantes restent prioritaires.
- Aucun changement à `public-portal.js`, aux gestionnaires `data-public-view` / `data-public-action`, au flux d'inscription/connexion, aux routes, aux données, à Supabase/Auth/RLS ou aux permissions. Aucun framework ni dépendance frontend ajouté.
- Les contenus fictifs du prototype (nombres d'élèves, progrès, notes, messages, statistiques de démonstration) ne sont pas importés dans la plateforme.
- Cache CSS : `style-prototype-dz.css?v=101` ; service worker `dz-de-v3.162.0`, précache aligné.
- Validation statique effectuée : équilibre des accolades CSS et cohérence des références CSS/index/service worker. Les tests CI et le déploiement Cloudflare doivent encore être vérifiés.
- Limite : aucun navigateur réel n'a été utilisé dans cette opération ; le rendu visuel mobile/ordinateur n'est donc pas déclaré validé. Le résultat doit être contrôlé sur l'URL Preview de la branche puis ajusté à partir des observations.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 39. Accueil public — catalogue des matières et statuts réels sur les cartes — 4 novembre 2026

- Suite à l'audit du lot 38, constat que les 14 cartes visibles sur l'accueil étaient codées en dur dans index.html et ne présentaient pas les statuts issus du registre pédagogique.
- Ajout dans public-portal.js d'un rendu du mini-catalogue à partir de assets/bdd/matieres.json et assets/bdd/subjects.json, en conservant les cartes HTML comme solution de repli si le chargement des registres échoue.
- Les six langues du registre sont regroupées en premier, puis les autres matières. Chaque carte affiche désormais un statut réel : disponible, partiellement disponible ou en préparation. Le statut allemand et anglais suit le registre subjects.json ; les autres matières suivent matieres.json.
- Ajout d'icônes de repli pour les entrées dont le registre ne fournit pas d'icône, notamment les sciences physiques.
- Finition visuelle des badges de statut dans les thèmes clair et sombre, avec adaptation mobile. Les cartes restent informatives et ne prétendent pas rendre accessibles des matières non publiées.
- Préservation : aucune modification des données pédagogiques, du moteur de navigation, des événements de connexion/inscription, des accès, d'Auth, Supabase, RLS ou des paiements. Aucun framework ni dépendance ajoutés.
- Versions : public-portal.js?v=6, style-prototype-dz.css?v=102, service worker dz-de-v3.163.0 avec précache aligné.
- Vérifications statiques à réaliser sur le HEAD final : syntaxe JavaScript, cohérence des références index/service worker, présence des statuts et équilibre des accolades CSS ; CI à suivre.
- Aucun rendu navigateur mobile/ordinateur ni déploiement Cloudflare du HEAD final n'est revendiqué à ce stade.
- Branche design/prototypes-67-74-alignment, PR #17 vers main ; aucune branche créée, aucun changement direct sur main, aucune fusion et aucun déploiement manuel.


## 40. Accueil public — exactitude de la promesse éditoriale — 4 novembre 2026

- Audit de cohérence entre le bandeau de marque et le registre des matières : le slogan antérieur « tous les matières et langues » pouvait laisser croire que les 14 matières étaient toutes déjà opérationnelles.
- Remplacement par « منصة متعددة المواد • التوفر حسب كل مادة », cohérent avec les statuts disponibles, partiels et en préparation présentés sur les cartes.
- Aucun changement de catalogue, de contenu pédagogique, de logique d'accès, d'authentification, de navigation ou de données.
- Cache CSS de l'accueil public passé à style-prototype-dz.css?v=103 ; service worker dz-de-v3.164.0.
- Vérification navigateur et publication Cloudflare du HEAD final non revendiquées tant qu'elles ne sont pas confirmées.
- Travail limité à la branche design/prototypes-67-74-alignment et à la PR #17 ; main reste intacte et aucune fusion n'est effectuée.


## 41. Accueil public — reconstruction du hero et de la scène pédagogique — 4 novembre 2026

- Reprise de la composition du premier écran public, au-delà des retouches de couleurs : hiérarchie du titre, texte d'introduction, appels à l'action, indicateurs et panneau pédagogique ont été réorganisés visuellement.
- Remplacement de l'ancienne imitation de forme d'onde par une scène pédagogique illustrative explicitant trois étapes : année, filière/matières, puis cours et ressources. Cette illustration ne prétend pas être un outil interactif.
- Renforcement de la direction artistique DZ : panneau vert profond, accent rouge, surfaces blanches structurées, profondeur et contraste, cartes de services en trois colonnes sur grand écran.
- Réécriture des bénéfices pour éviter de promettre des fonctions vocales ou des matières non confirmées comme opérationnelles.
- Adaptations tablette/mobile et mode sombre ; respect de prefers-reduced-motion. Les boutons et événements existants, les liens data-public-view/data-gate-open, le formulaire, les routes et le catalogue dynamique restent inchangés.
- Cache CSS : style-prototype-dz.css?v=104 ; service worker dz-de-v3.165.0 avec précache aligné.
- CI et déploiement Preview Cloudflare à contrôler sur le HEAD final. Aucun test visuel réel navigateur ni validation esthétique finale n'est revendiqué à ce stade.
- Périmètre inchangé : branche design/prototypes-67-74-alignment, PR #17 vers main ; aucun changement direct sur main, aucune fusion et aucun déploiement manuel.


## 42. Fiabilisation du catalogue d'accueil en cas d'échec réseau — 4 novembre 2026

- Le catalogue dynamique conserve son chargement depuis les fichiers de données existants et continue d'afficher les états « disponible », « partiellement disponible » ou « en préparation » lorsqu'ils sont récupérés.
- Correction du cas d'échec réseau : les cartes HTML de secours ne donnent plus l'impression que l'état de disponibilité a été vérifié. Elles affichent désormais « حالة التوفر غير متاحة » jusqu'au prochain chargement réussi.
- Ajout des attributs aria-live et aria-busy pour signaler l'actualisation du catalogue aux technologies d'assistance.
- Ajout du style de cet état neutre, y compris en mode sombre.
- Versions alignées : public-portal.js?v=7, style-prototype-dz.css?v=105, service worker dz-de-v3.166.0.
- Aucun changement d'authentification, de droits, de données, de routes ni de navigation.
- À vérifier sur le Preview Cloudflare du HEAD : CI, déploiement, affichage réel desktop/mobile. Aucun résultat visuel navigateur n'est revendiqué ici.


## 43. Accueil public — preuve pédagogique et tableau de qualité d'apprentissage — 4 novembre 2026

- Ajout d'une section éditoriale destinée aux élèves et aux parents : ressources d'entraînement, correction et suivi des apprentissages.
- Mise en avant de trois volumes vérifiables du parcours allemand : 234 exercices corrigés du manuel de 2AS, 55 sujets officiels corrigés de 2AS et 19 unités pédagogiques réparties entre 2AS et 3AS. Ces nombres décrivent les ressources disponibles, pas des résultats de réussite.
- Ajout d'une composition graphique de tableau de bord avec trois anneaux : taux de réussite, maîtrise des leçons et réalisation des exercices.
- Intégrité statistique : les valeurs restent volontairement « — % » tant qu'aucun jeu de résultats d'évaluation réels, agrégés et anonymisés n'est relié à l'accueil public. Le texte précise que la publication future devra mentionner période, effectif et méthode de calcul ; aucune donnée fictive ni taux de réussite inventé.
- Mise en forme ciblée sous #gate : cartes de preuve, anneaux graphiques sans valeur de progression simulée, thème clair/sombre, tablette et mobile.
- Aucun changement de logique métier, calcul d'évaluation, données d'élèves, authentification, Supabase, RLS, paiement, navigation ou accès privé. Aucun framework ni dépendance ajouté.
- Références : style-prototype-dz.css?v=106 ; service worker dz-de-v3.167.0.0.0 et précache CSS aligné.
- Contrôles statiques et CI à effectuer sur le nouveau HEAD. Aucun test visuel réel navigateur ni déploiement Cloudflare n'est revendiqué avant confirmation.
- Branche design/prototypes-67-74-alignment, PR #17 vers main ; aucune nouvelle branche, aucun changement direct sur main, aucune fusion et aucun déploiement manuel.


## 44. Accueil public — identification explicite du parcours allemand dans les indicateurs pédagogiques — 4 novembre 2026

- Clarification demandée : la section « الجودة التعليمية والمتابعة » concerne exclusivement le parcours de langue allemande, et non l'ensemble des matières ou langues de la plateforme.
- Ajout d'un libellé visible « مسار اللغة الألمانية · Deutsch » et précision explicite dans le texte introductif.
- Les trois ressources sont désormais qualifiées sans ambiguïté : 234 exercices corrigés du manuel d'allemand de 2AS, 55 sujets officiels corrigés d'allemand de 2AS et 19 unités pédagogiques d'allemand réparties entre 2AS et 3AS.
- Le périmètre des anneaux statistiques reste inchangé : aucune valeur de réussite, maîtrise ou réalisation n'est inventée ; les emplacements restent « — % » jusqu'à la disponibilité de résultats réels agrégés et anonymisés.
- Style ciblé du libellé de parcours ajouté à style-prototype-dz.css ; référence CSS portée à v107 ; service worker porté à dz-de-v3.168.0.0.0 avec précache aligné.
- Aucun changement de catalogue, de disponibilité des autres matières, de logique métier, d'authentification, de Supabase, RLS, paiement, routes ou navigation. Aucune nouvelle dépendance.
- Contrôles statiques et CI à effectuer sur le HEAD final ; aucune validation visuelle navigateur ni publication Cloudflare n'est revendiquée avant confirmation.
- Opération limitée à la branche design/prototypes-67-74-alignment et à la PR #17 ; main reste intacte, PR non fusionnée, aucun déploiement manuel.


## 45. Accueil public — transparence sur la disponibilité des statistiques de réussite — 4 novembre 2026

- Audit des sources de résultats avant toute publication de pourcentages : `quiz.js` conserve les meilleurs scores et l'historique dans le `localStorage` du navigateur ; `examen.js` indique explicitement que les résultats de simulation du bac restent locaux et ne sont pas transmis.
- Le fichier `assets/bdd/eleves.json` contient des profils de démonstration et des données personnelles structurées ; il ne constitue pas une source valide pour calculer ni publier des statistiques publiques. Il n'est pas utilisé pour alimenter les graphiques.
- Conclusion : aucun agrégat central fiable, anonymisé et représentatif n'est actuellement disponible pour justifier un taux global de réussite. Les anneaux restent sans pourcentage ; aucun résultat local d'un élève n'est exposé à l'accueil.
- Clarification éditoriale du badge : « بيانات غير مجمّعة » au lieu de laisser entendre qu'une collecte statistique est déjà en cours.
- Note de transparence ajoutée : les résultats des quiz et simulations sont conservés sur l'appareil de l'élève et ne sont pas envoyés à un serveur central ; les taux ne seront publiés qu'après mise en place d'un agrégat sûr et anonyme, avec période, effectif et méthode de calcul.
- Fichiers modifiés : `index.html` et `sw.js` uniquement ; service worker porté de `dz-de-v3.168.0.0.0` à `dz-de-v3.168.0.0.1`. Aucun changement CSS, Auth, Supabase, RLS, schéma, migration, notes individuelles, accès ou paiement.
- Contrôles à effectuer sur le HEAD final : présence du nouveau libellé et de la note, absence des anciennes formulations, version SW mise à jour, CI et build Cloudflare. Aucun rendu navigateur réel n'est revendiqué.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune branche créée, aucun changement direct sur `main`, aucune fusion et aucun déploiement manuel.


## 46. Accueil public — FAQ de confiance pour les élèves et les parents — 4 novembre 2026

- Ajout, après les cartes des trois années scolaires et avant la fin du bloc d'accueil, d'une FAQ accessible en accordéon natif `details/summary`, sans JavaScript ni dépendance supplémentaire.
- Quatre réponses concrètes : disponibilité variable des matières ; périmètre exact des ressources 234/55/19 limité à l'allemand ; absence actuelle de taux globaux de réussite faute d'agrégation centrale ; possibilité pour les parents d'examiner les années, le catalogue et les statuts de disponibilité avant inscription.
- L'objectif est de répondre aux objections essentielles des familles sans promettre une couverture complète des matières ni inventer un service ou une statistique.
- Style dédié ajouté à `style-prototype-dz.css` : palette algérienne verte/blanche/rouge cohérente, cartes et accordéons, état ouvert, adaptation mobile (≤760 px), thème sombre et respect de `prefers-reduced-motion`.
- Cache : référence CSS portée de `v107` à `v108` dans `index.html` et le précache du service worker ; version portée à `dz-de-v3.168.0.0.2`.
- Aucun identifiant, route, gestionnaire d'événement, logique métier, catalogue, authentification, Supabase, RLS, schéma, migration, paiement ou tableau de bord connecté modifié.
- Contrôles attendus sur le HEAD final : structure HTML/accordéons, présence des quatre réponses, références CSS alignées, version SW, CI et build Cloudflare. Aucune validation visuelle réelle ne sera revendiquée sans navigateur.
- Travail effectué exclusivement sur `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucune fusion et aucun déploiement manuel.


## 47. Lisibilité typographique renforcée sur ordinateur — 4 novembre 2026

- Demande : les textes apparaissaient trop petits sur ordinateur ; l'objectif est de retrouver une taille de lecture comparable aux sites web actuels.
- Ajout d'une couche typographique dédiée aux écrans larges (à partir de 1024 px) : taille de base portée à 17 px, corps de texte, listes, formulaires, cellules de tableaux, descriptions et métadonnées avec un plancher de 15 px et une hauteur de ligne confortable ; hiérarchie des titres renforcée.
- La règle est limitée aux espaces #gate et #shell #app : elle ne modifie ni les dimensions des composants ni les fonctions. Les écrans mobiles conservent leur échelle actuelle.
- Le thème clair/sombre et les polices Cairo/Tajawal/Inter existantes sont conservés. Aucun framework ni aucune dépendance ajoutés.
- Références alignées : style-prototype-dz.css?v=109 dans index.html et le précache de sw.js ; service worker dz-de-v3.168.0.0.3.
- Vérifications statiques : média desktop, seuil 15 px, base 17 px, cohérence des références et version du service worker. La validation visuelle réelle sur écran d'ordinateur reste nécessaire ; aucun rendu navigateur n'est revendiqué ici.
- Aucun changement d'ID, route, événement, logique métier, données, Auth, Supabase, RLS, schéma, migration, paiement ou tableau de bord métier.
- Opération exclusivement sur design/prototypes-67-74-alignment, PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## 48. Complément de lisibilité des libellés et liens sur ordinateur — 4 novembre 2026

- Après le premier contrôle, extension ciblée de la règle desktop aux liens, libellés en ligne, résumés d'accordéons, définitions, légendes et sorties de formulaire, qui pouvaient encore conserver des tailles trop petites.
- Plancher de 15 px avec facteur relatif de 0,88 em pour préserver la hiérarchie dans les titres et composants ; règle active uniquement à partir de 1024 px.
- Aucun changement mobile, structure, navigation, fonctionnalité ou donnée. Aucun ajout de dépendance.
- Correction de cache effectuée après revue : référence CSS portée à v110 dans index.html et sw.js, et version du service worker portée à dz-de-v3.168.0.0.4. Cette invalidation garantit le rechargement de la feuille CSS modifiée au lot 48, y compris pour les clients qui disposent d'une ancienne copie en cache.
- CI/Workers Build du HEAD précédent e68c9df : succès. Le présent complément doit encore passer les contrôles automatiques ; validation visuelle réelle sur ordinateur toujours requise.
- Travail limité à la branche design/prototypes-67-74-alignment et à la PR #17 ; main inchangée, PR non fusionnée.

## 49. Préservation des pictogrammes dans la typographie desktop — 4 novembre 2026

- Revue de la règle de lisibilité du lot 48 : son sélecteur générique sur tous les éléments span pouvait aussi agrandir des pictogrammes, emblèmes, badges et numéros décoratifs.
- Règle affinée : liens et libellés textuels restent lisibles à partir de 1024 px ; les spans explicitement décoratifs (aria-hidden, classes d'icônes, emblèmes, badges, numéros et emoji) sont exclus de l'agrandissement.
- Aucun changement de structure HTML, navigation, JavaScript, données, mobile, Auth, Supabase, RLS, schéma ou paiement. Aucun ajout de dépendance.
- Cache invalidé : style-prototype-dz.css?v=111 dans index.html et sw.js ; service worker dz-de-v3.168.0.0.5.
- Contrôles CI et Workers Build à effectuer sur le nouveau HEAD. Le rendu visuel navigateur sur ordinateur reste à confirmer ; aucune validation visuelle n'est revendiquée.
- Opération limitée à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion et aucun changement direct sur main.


## 50. Accueil public — typographie desktop sans agrandissement des badges — 4 novembre 2026

- Revue du correctif typographique du lot 49 : malgré les exclusions par noms de classes, le sélecteur générique ciblant presque tous les `span` pouvait encore agrandir des étiquettes d'état, compteurs ou éléments décoratifs dépourvus de classes explicites.
- Suppression de ce ciblage générique. La lisibilité desktop est désormais appliquée à une liste explicite de textes éditoriaux de l'accueil public (libellés des indicateurs, descriptions de services, textes de la scène pédagogique, descriptions des ressources et notes de suivi/FAQ).
- Les badges de disponibilité, pastilles, repères numériques, icônes et libellés compacts conservent leurs tailles définies par leurs composants. Les règles typographiques générales existantes restent en place ; aucune modification du tableau de bord connecté.
- Référence CSS portée à `style-prototype-dz.css?v=112` dans `index.html` et le précache de `sw.js) ; version du service worker : `dz-de-v3.168.0.0.6`.
- Aucun changement HTML structurel, JavaScript, navigation, données, Auth, Supabase, RLS, schéma, paiement ou permissions. Aucun framework ni dépendance ajoutés.
- Vérifications statiques après écriture : ancien sélecteur générique absent, sélecteurs éditoriaux présents, références CSS synchronisées et version du service worker alignée. CI et Workers Build à suivre sur le HEAD résultant.
- Limite explicite : aucun navigateur réel n'est disponible pour cette opération ; le rendu desktop/mobile n'est pas déclaré visuellement validé.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main` ; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## 51. Accueil public — statut du catalogue matières explicite — 4 novembre 2026

- L'audit du contenu a relevé une ambiguïté : les cartes statiques de la page d'accueil affichent les 14 matières et 6 langues du catalogue, alors que leur état de publication n'est pas indiqué sur ces cartes.
- Le texte d'introduction précise maintenant que le contrôle de disponibilité se fait dans le catalogue avant de commencer.
- Ajout d'un bandeau d'information directement au-dessus des cartes matières : il distingue explicitement la présence dans le catalogue de la publication effective du contenu et renvoie vers la vue « matières » existante via `data-public-view="subjects"`.
- Le bandeau possède des styles dédiés desktop/mobile et thème sombre. Il réutilise la navigation existante ; aucun nouveau gestionnaire JavaScript.
- CSS cache-bust : `style-prototype-dz.css?v=113` dans `index.html` et `sw.js`; version SW `dz-de-v3.168.0.0.7`.
- Aucun changement de données, de registre des matières, de statut éditorial, d'authentification, Supabase, RLS, schéma ou paiement. Aucun chiffre ou taux de réussite inventé.
- Vérifications statiques à effectuer après écriture ; rendu visuel réel non certifié sans navigateur.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; aucun merge ni déploiement manuel.

- Correction de synchronisation du cache : après contrôle du HEAD, le lien CSS de `index.html` était resté en `v112` ; il est maintenant aligné sur `v113`, comme le précache de `sw.js`.


## Lot 52 — Lisibilité des textes secondaires sur mobile (4 novembre 2026)

- Audit du CSS public mobile : plusieurs libellés informatifs restaient définis à 9–10 px dans les étapes visuelles, les indicateurs circulaires et les réponses FAQ, malgré l'amélioration typographique desktop du lot 50.
- Ajout de règles ciblées sous 620 px : étapes visuelles et notes de ressources à 11 px ; libellés des indicateurs à 10,5–11 px ; note pédagogique, FAQ et information catalogue à 12–13 px.
- Aucun redimensionnement global des icônes, badges, chiffres ou boutons ; aucun HTML, identifiant, gestionnaire, route ou flux de données modifié.
- Cache CSS aligné sur `v114` dans `index.html` et le précache du service worker ; version du service worker `dz-de-v3.168.0.0.8`.
- Vérification statique : règles ciblées présentes, références CSS synchronisées, accolades CSS équilibrées. Aucun test de rendu navigateur/mobile effectué ; ne pas présenter cette vérification comme une validation visuelle.


## Lot 53 — Lisibilité des libellés de navigation et de contexte sur ordinateur (4 novembre 2026)

- L'audit du portail public a relevé plusieurs libellés secondaires encore trop petits sur grand écran : boutons de navigation, badge d'introduction, repère de version du panneau pédagogique et badge de disponibilité des indicateurs.
- Ajout de règles ciblées à partir de 1024 px : navigation à 14 px avec hauteur minimale de 44 px ; libellés de contexte à 12–13 px. Les icônes, nombres, badges de catalogue et composants hors de #gate ne sont pas redimensionnés par ce lot.
- Les styles mobile et tablette ne sont pas modifiés. Les règles restent limitées à l'accueil public et conservent les couleurs de thème existantes.
- Références synchronisées : style-prototype-dz.css?v=115 dans index.html et sw.js ; service worker dz-de-v3.168.0.0.9.
- Vérification statique à effectuer sur le HEAD final : sélecteurs ciblés, références CSS identiques, version SW, équilibre des accolades et CI/Workers Build.
- Limite : aucun navigateur réel n'est disponible pour cette opération ; la validation visuelle sur ordinateur et mobile reste à effectuer et n'est pas revendiquée.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 54 — Libellés pédagogiques de la navigation publique (4 novembre 2026)

- Dans la navigation du portail public, « بوابة الزوار » devient « استكشف المنصة » et « المواد » devient « المواد التعليمية ». Le libellé « السنوات » est remplacé par « المستويات الدراسية », plus précis pour les classes 1AS, 2AS et 3AS.
- Dans l'en-tête de la section correspondante, « المسار الدراسي / كل السنوات وكل الشعب » devient « المستويات الدراسية / اختر مستواك وشعبتك » ; le bouton devient « استكشف المستويات ».
- Les libellés d'authentification (« تسجيل الدخول », « إنشاء حساب ») sont conservés : ils sont standards et non ambigus. Aucun titre supplémentaire n'est ajouté à la barre de navigation afin d'éviter sa surcharge ; le titre et le sous-titre de la page d'accueil remplissent déjà le rôle d'introduction.
- Modification limitée aux textes HTML et à l'incrément de version du service worker (dz-de-v3.168.0.0.10). Les attributs data-public-view, data-gate-open, identifiants, routes, gestionnaires et données restent inchangés.
- À vérifier sur le HEAD final : absence des anciens libellés dans la navigation ciblée, présence des nouveaux textes, conservation des attributs fonctionnels, cohérence de la version SW et réussite de la CI/Workers Build.
- Limite : aucune validation visuelle réelle sur navigateur ordinateur/mobile n'est revendiquée.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 55 — Cohérence du vocabulaire destiné aux parents (4 novembre 2026)

- Harmonisation de la réponse FAQ destinée aux parents : « تصفح السنوات الدراسية » devient « استكشاف المستويات الدراسية », cohérent avec le nouveau libellé de navigation « المستويات الدراسية ».
- Aucune modification de parcours, de logique, de données ou de droits ; seul le texte de la FAQ est ajusté.
- Version du service worker incrémentée en dz-de-v3.168.0.0.11 pour actualiser le contenu mis en cache.
- Validation visuelle réelle non effectuée ; CI/Workers Build à contrôler sur le dernier commit.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 56 — Navigation publique mobile plus lisible (4 novembre 2026)

- Sur les écrans jusqu'à 700 px, la navigation publique passe de trois colonnes à deux colonnes afin de donner plus de largeur aux nouveaux libellés arabes.
- Les cinq boutons conservent leur ordre et leurs attributs ; le bouton d'inscription occupe la largeur des deux colonnes. Hauteur minimale portée à 42 px, taille de texte à 12 px et retour à la ligne autorisé.
- Aucun changement sur la navigation desktop, les routes, les événements, les données ou l'authentification.
- Cache CSS synchronisé en v116 dans index.html et sw.js ; service worker incrémenté en dz-de-v3.168.0.0.12.
- Validation statique et CI/Workers Build à effectuer sur le dernier HEAD. Pas de validation visuelle navigateur revendiquée.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 57 — Accueil public : rendre les indicateurs pédagogiques compréhensibles sans faux graphiques (4 novembre 2026)

- Constat : les trois anneaux de progression affichaient uniquement « — % ». Même si l'absence de taux fictifs était correcte, cette représentation ressemblait à des graphiques vides et n'expliquait pas concrètement ce que chaque indicateur mesurera.
- Remplacement des anneaux vides par trois cartes éditoriales : **معدل النجاح**, **إتقان الدروس** et **إنجاز التمارين**. Chaque carte décrit la base de calcul attendue et indique explicitement que la valeur n'est pas encore disponible faute de données agrégées fiables.
- Les cartes distinguent les trois dimensions de suivi sans afficher de pourcentage, de barre de progression ou de résultat simulé. La note de transparence existante sur le stockage local des résultats et l'absence de données centralisées est conservée.
- Styles dédiés desktop, mobile et thème sombre ; grille de trois cartes sur grand écran et empilement sur petit écran. Aucun JavaScript, identifiant fonctionnel, route, événement, donnée, Auth, Supabase, RLS, schéma ou paiement modifié. Aucun framework ni dépendance ajoutés.
- Cache CSS synchronisé en v117 dans index.html et sw.js ; version du service worker dz-de-v3.168.0.0.13.
- Contrôles statiques à effectuer sur le HEAD final : absence des anneaux/valeurs fictives, présence des trois cartes et de leurs descriptions, références CSS synchronisées, équilibre des accolades CSS, dossier mis à jour et CI/Workers Build.
- Limite : aucun navigateur réel n'est disponible dans cette opération ; aucune validation visuelle desktop/mobile n'est revendiquée.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main ; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 58 — Authentification sur une page dédiée (4 novembre 2026)

- Retour utilisateur : les onglets « 🔐 تسجيل الدخول » et « 📝 حساب جديد » étaient affichés dans la page d'accueil publique, sous les sections de présentation. L'authentification doit constituer un écran séparé.
- Les accès de connexion et d'inscription ouvrent désormais un écran d'authentification dédié dans le portail, avec les URL `#connexion` et `#inscription`. La page d'accueil, ses sections pédagogiques et son catalogue ne sont pas affichés sur cet écran.
- Ajout d'un bouton de retour explicite vers l'accueil. Les liens de connexion/inscription existants, les deux formulaires, leurs identifiants, la validation, le choix du niveau et de la filière, le bouton de démonstration et les gestionnaires d'authentification sont conservés.
- Les liens depuis le catalogue qui préparent un niveau/une filière puis ouvrent l'inscription continuent d'utiliser le formulaire existant. Les URL de connexion et d'inscription peuvent être ouvertes directement et sont synchronisées avec le hash.
- Styles dédiés pour l'écran d'authentification, desktop/mobile et thème sombre. Aucun changement de compte, de session, d'Auth, Supabase, RLS, schéma, paiement ou rôle ; aucune dépendance ajoutée.
- Cache CSS porté à v118 et script portail à v8 dans le précache de `sw.js`; service worker `dz-de-v3.168.0.0.14`.
- Vérifications statiques à effectuer : gestionnaire d'écran et hash, bouton retour, conservation des IDs de formulaires et actions existantes, références de cache, équilibre CSS, CI/Workers Build. Validation visuelle réelle non revendiquée sans navigateur.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main` ; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## Lot 59 — Accueil public : hiérarchie visuelle du premier écran (4 novembre 2026)

- Renforcement ciblé du bloc d'introduction de l'accueil public : panneau éditorial distinct, liseré tricolore discret, titre mieux hiérarchisé et paragraphe plus lisible. La composition conserve le visuel de parcours existant à côté du texte sur grand écran.
- Hiérarchie des appels à l'action clarifiée : action principale verte avec profondeur visuelle, action secondaire blanche et bordure verte. États de survol sobres ; respect de `prefers-reduced-motion`.
- Les quatre tuiles de repères (3 années, 6 langues au catalogue, 14 matières au catalogue, accompagnement IA) sont alignées, plus lisibles et visuellement différenciées. Elles restent des données de catalogue/présentation et ne prétendent pas mesurer l'activité ou la réussite.
- La rangée des trois services est harmonisée avec les cartes du premier écran. Adaptation tablette/mobile : actions empilées et repères en grille 2 × 2. Adaptation du thème sombre.
- Aucun texte métier, lien, identifiant, événement, script, parcours d'authentification, donnée, Auth, Supabase, RLS, schéma ou paiement modifié. Aucun framework ni dépendance ajoutés.
- Cache CSS synchronisé en v119 dans `index.html` et `sw.js`; version du service worker `dz-de-v3.168.0.0.15`.
- Contrôles statiques à effectuer sur le HEAD final : versions synchronisées, règles desktop/tablette/mobile et thème sombre présentes, accolades CSS équilibrées, actions de navigation conservées, dossier complété et CI/Workers Build.
- Limite : aucune validation visuelle réelle sur navigateur/écrans n'est revendiquée dans cette opération.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main` ; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## Lot 60 — Catalogue public et cartes des niveaux (4 novembre 2026)

- Refonte visuelle ciblée des 14 cartes de catalogue : cartes plus aérées, icônes dans des pastilles, titres et descriptions mieux hiérarchisés, relief discret et survol. Les six langues portent un liseré tricolore distinct ; les autres cartes gardent un repère vert.
- Les trois cartes des années scolaires sont agrandies et structurées : repère numérique, libellé du niveau, description et accent inférieur. Le lien `data-public-view="levels"` de chaque carte est conservé.
- Adaptations spécifiques tablette/mobile et thème sombre ; animations neutralisées si `prefers-reduced-motion` est demandé.
- Aucun statut de disponibilité n'est inventé, aucun contenu/catalogue modifié, aucun chiffre ajouté. Aucun identifiant, lien, gestionnaire, route, script, Auth, Supabase, RLS, schéma ou paiement modifié. Aucun framework ou dépendance ajoutés.
- Référence CSS synchronisée en v120 dans `index.html` et `sw.js`; service worker `dz-de-v3.168.0.0.16`.
- Vérifications statiques à effectuer sur le HEAD final : 14 cartes et 6 langues conservées, trois liens de niveaux conservés, CSS v120 synchronisé, règles desktop/tablette/mobile et sombre présentes, accolades CSS équilibrées, dossier et CI/Workers Build.
- Limite : pas de navigateur visuel disponible pour valider le rendu final sur appareils réels ; aucune validation visuelle n'est revendiquée.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main`; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## Lot 61 — Mise en valeur de la preuve pédagogique et des indicateurs (4 novembre 2026)

- Renforcement de la section « الجودة التعليمية والمتابعة » comme bloc éditorial autonome : fond nuancé vert/blanc avec accent tricolore, titre plus fort et meilleure respiration.
- Cartes de ressources du parcours allemand (234 exercices corrigés, 55 sujets officiels corrigés, 19 unités) retravaillées : nombre plus visible, icône structurée, descriptions lisibles et accent coloré inférieur. Les nombres restent explicitement rattachés au seul parcours allemand.
- Tableau des trois dimensions de suivi réorganisé visuellement : cartes plus lisibles, états « en attente de données fiables » conservés, aucune jauge ni aucun taux inventé. La note sur l'absence d'agrégation centrale reste visible.
- Adaptations du thème sombre, du mobile/tablette et de `prefers-reduced-motion`. Aucun contenu métier ni donnée modifié ; aucun identifiant, lien, gestionnaire, script, Auth, Supabase, RLS, schéma ou paiement modifié. Aucune dépendance ajoutée.
- Référence CSS synchronisée en v121 dans `index.html` et `sw.js`; service worker `dz-de-v3.168.0.0.17`.
- Vérifications statiques à effectuer sur le HEAD final : trois cartes de ressources, trois cartes d'indicateurs, libellés de disponibilité conservés, cache CSS et SW synchronisés, styles sombre/mobile présents, accolades équilibrées, dossier et CI/Workers Build.
- Limite : aucune validation visuelle réelle sur navigateur n'est revendiquée.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main`; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## Lot 62 — FAQ parents et accès direct au catalogue (4 novembre 2026)

- Renforcement de la FAQ publique destinée aux familles : ajout de deux actions explicites sous l'introduction, « استكشف المواد المتاحة » et « اختر المستوى الدراسي ».
- Les deux actions réutilisent exclusivement les mécanismes de navigation déjà présents (data-public-view="subjects" et data-public-view="levels"). Aucun nouveau gestionnaire JavaScript ni aucune nouvelle route n'est introduit.
- Les réponses de la FAQ restent prudentes sur la disponibilité des contenus, la portée des ressources allemandes (234 exercices, 55 sujets, 19 unités) et l'absence de statistiques agrégées fiables. Aucun taux de réussite ni témoignage inventé.
- Présentation des actions travaillée pour desktop et mobile, thème sombre et prefers-reduced-motion. Pas de framework ni de dépendance ajoutés.
- Cache CSS synchronisé en v122 dans index.html et sw.js; service worker dz-de-v3.168.0.0.18.
- Contrôles statiques à effectuer sur le HEAD final : présence des deux actions et de leurs attributs existants, synchronisation CSS/SW, règles responsive/sombre, accolades CSS équilibrées, écran d'authentification séparé toujours présent, CI/Workers Build.
- Aucun changement aux formulaires, Auth, Supabase, RLS, schéma, paiements, données ou tableaux de bord. Travail limité à l'accueil public.
- Limite : aucune validation visuelle réelle sur navigateur ordinateur/mobile n'est revendiquée dans cette opération.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 63 — Cohérence éditoriale de l'accueil public (4 novembre 2026)

- Audit de la hiérarchie de l'accueil : le premier écran, le catalogue, les niveaux et la FAQ utilisent désormais un langage visuel de section plus cohérent, avec repère vertical vert/rouge, titres hiérarchisés et séparateurs sobres.
- Espacement vertical harmonisé entre le catalogue des 14 matières/langues et les trois cartes de niveaux. Les actions secondaires des titres sont présentées comme des liens d'exploration clairement identifiables.
- Adaptations dédiées au mobile (titres/actions empilés), au thème sombre et au mode de réduction des animations. Aucun contenu métier, nombre, statut de disponibilité, identifiant, route, événement ou gestionnaire modifié.
- Référence CSS synchronisée en v123 dans index.html et sw.js; service worker dz-de-v3.168.0.0.19.
- Vérifications statiques à effectuer sur le HEAD final : cache CSS/SW synchronisé, présence des sélecteurs de cohérence, règles mobile/sombre, accolades CSS équilibrées, navigation et écran d'authentification séparé préservés, CI/Workers Build.
- Aucun changement aux tableaux de bord, Auth, Supabase, RLS, schéma, migrations, paiements ou données. Aucun framework ni dépendance ajoutés.
- Limite : aucune validation visuelle réelle sur navigateur ordinateur/mobile n'est revendiquée ; la revue visuelle sur les deux formats reste nécessaire.
- Travail limité à design/prototypes-67-74-alignment / PR #17 vers main; aucune fusion, aucun déploiement manuel et aucun changement direct sur main.


## Lot 64 — Premier écran : démonstration de l'enseignant intelligent (4 novembre 2026)

- Recomposition du panneau de droite du hero public via le module existant `public-portal.js` : le visuel générique du parcours est transformé en exemple pédagogique de l'enseignant intelligent, avec microphone illustratif, représentation des ondes vocales, question d'élève sur `Nominativ/Akkusativ`, explication et phrase d'exemple.
- Le panneau est explicitement étiqueté « مثال توضيحي ». La note précise qu'il ne s'agit ni d'une conversation directe ni d'une session vocale active. Aucun micro fonctionnel, appel réseau, moteur vocal ou nouvelle interaction n'est simulé.
- Le titre du panneau devient « الأستاذ الذكي ». Le CTA conserve l'action de navigation existante vers le catalogue des matières ; le CTA d'inscription reste inchangé.
- Dans le bloc éditorial, les repères du catalogue sont replacés avant la ligne de confiance et les actions, pour retrouver l'ordre du prototype : titre, explication, repères, puis boutons.
- Styles ciblés injectés par le module du portail : variantes ordinateur/mobile, thème sombre et prise en compte de `prefers-reduced-motion`. Aucun framework ni dépendance ajoutés.
- Le service worker est incrémenté en `dz-de-v3.168.0.0.20`. Le script `public-portal.js?v=8` reste référencé dans la page et le précache ; l'installation du nouveau service worker recharge explicitement les ressources avec `cache: reload`.
- Aucun changement à Auth, Supabase, RLS, schéma, données, paiements, tableaux de bord, routes ou contrôle d'accès. Les formulaires de connexion et d'inscription restent sur l'écran dédié.
- Contrôles statiques à effectuer sur le HEAD final : syntaxe JavaScript, présence des éléments du panneau, ordre des repères/actions, préservation des attributs de navigation, version du service worker et CI/Workers Build.
- Limite : le rendu n'a pas été ouvert dans un navigateur ; aucune validation visuelle desktop/mobile ni publication Cloudflare n'est revendiquée.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main` ; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


## Lot 65 — Correction du parcours « découvrir les matières » (4 novembre 2026)

### Problème constaté
Depuis l'accueil public, les CTA « اكتشف المواد » et « اكتشف المواد وموارد التعلّم » déclenchaient bien `renderSubjects()`, mais l'utilisateur restait visuellement sur l'accueil/menu au lieu d'arriver clairement sur le catalogue. La cause identifiée est une collision CSS : `.public-landing` possède des déclarations `display: ... !important`, qui peuvent neutraliser le comportement natif de l'attribut HTML `hidden`. La navigation activait en parallèle le lien « المواد التعليمية », donnant l'impression qu'une seconde action était nécessaire.

### Correction intégrée
- Dans `public-portal.js`, ajout de règles prioritaires et ciblées pour garantir que `[hidden]` masque réellement `.public-landing`, `.public-explorer` et `.gate-card`.
- Après le rendu du catalogue (succès ou erreur), défilement vers `#publicExplorer` pour présenter directement le contenu, et non le menu.
- Ajout de `scroll-margin-top` au catalogue pour éviter un alignement collé au bord supérieur.
- Les deux CTA continuent d'utiliser le même parcours catalogue que l'entrée « المواد التعليمية » ; aucune navigation parallèle ni modification des données.
- Aucun changement aux routes, à l'authentification, à Supabase/RLS, au tableau de bord élève ou aux paiements.

### Vérifications et limites
- Contrôle statique du code modifié : règle de masquage `[hidden]` présente et défilement après rendu présent.
- À confirmer par un test navigateur réel : clic sur les deux CTA depuis ordinateur et mobile, vérifier que le catalogue apparaît immédiatement et que le menu ne reste pas affiché comme écran actif.
- Aucun rendu navigateur ni capture visuelle n'a été exécuté dans cet environnement.
- Travail effectué uniquement sur `design/prototypes-67-74-alignment`, PR #17 ; aucune fusion et aucune modification de `main`.


## Lot 66 — Afficher la destination avant le chargement (4 novembre 2026)

### Analyse complémentaire du comportement
Le premier correctif assurait le masquage de l'accueil et le défilement après génération du catalogue. L'inspection de `show(screen)` a révélé une seconde cause de l'impression « cliquer encore sur المواد التعليمية » : la fonction faisait immédiatement `window.scrollTo({top:0})`, puis `renderSubjects()` attendait le chargement asynchrone des fichiers JSON avant de faire défiler vers le catalogue. Pendant cette attente, l'utilisateur restait au niveau de la navigation, avec l'entrée « المواد التعليمية » activée.

### Ajustement
- `show(screen)` affiche maintenant la zone `#publicExplorer` et déclenche son défilement immédiatement après avoir masqué l'accueil, sans attendre le chargement du catalogue.
- L'indicateur « جارٍ تحميل سجل المواد… » apparaît ainsi dans la zone de destination pendant la lecture des catalogues.
- Suppression du défilement tardif redondant dans `renderSubjects()`.
- Cette transition immédiate bénéficie aussi aux autres vues publiques qui utilisent `show(screen)` (niveaux et détails), sans toucher à leurs données ni à leurs routes.
- Les règles de masquage `[hidden]` ajoutées au Lot 65 sont conservées.

### Vérifications et limites
- Contrôle statique : le défilement est désormais déclenché dans `show(screen)` après `r.hidden = false`; aucun défilement vers le haut ne précède le chargement.
- Vérifier dans le navigateur : clic sur « اكتشف المواد » et « اكتشف المواد وموارد التعلّم » ; la zone du catalogue doit apparaître immédiatement avec son indicateur de chargement, puis les matières.
- Aucun test visuel navigateur n'a été exécuté dans cet environnement.
- Même branche `design/prototypes-67-74-alignment`, PR #17 ouverte ; aucune fusion, aucune modification de `main`, aucun déploiement manuel.


## Lot 67 — Réalignement du visuel principal avec le prototype (4 novembre 2026)

### Écart détecté lors de l'audit
L'inspection du HTML réellement présent sur la branche a montré que la carte à droite du hero affichait encore une illustration générique en trois étapes (année, matières, ressources). Les styles de l'enseignant intelligent existaient déjà, mais le contenu HTML ne présentait pas le dialogue pédagogique attendu. Le hero ne correspondait donc pas encore à l'intention du prototype.

### Ajustements ciblés
- Remplacement de l'illustration générique par une carte « الأستاذ الذكي » avec question d'élève et explication d'un point grammatical allemand (Nominativ/Akkusativ), cohérente avec le parcours allemand déjà avancé.
- Ajout d'une forme d'onde décorative et d'un exemple de réponse, sans prétendre activer le microphone, une session vocale ou un chat en direct.
- Le bouton conserve `data-public-view="subjects"` et conduit au catalogue public existant ; aucun nouveau parcours ni API n'est ajouté.
- Augmentation ciblée de la lisibilité des textes de la carte sur ordinateur et ajout d'une règle `prefers-reduced-motion` pour supprimer l'animation si l'utilisateur préfère réduire les mouvements.
- Les ajustements CSS sont limités à `.public-ai-card` dans le thème clair ; aucun style de tableau de bord ni composant authentifié n'est modifié.

### Vérifications et limites
- Contrôle statique : ancienne illustration de parcours retirée du hero ; carte `الأستاذ الذكي`, exemple de dialogue, mention explicite de démonstration et CTA catalogue présents.
- À valider dans le navigateur : hiérarchie visuelle, dimensions, contraste et lisibilité sur ordinateur et mobile.
- Aucun test visuel navigateur n'a été exécuté ici.
- Travail sur la même branche `design/prototypes-67-74-alignment` / PR #17 ; aucune fusion, aucune modification de `main`, aucun déploiement manuel.


### Lot 68 — alignement du catalogue sous l’en-tête public fixe (4 novembre 2026)
- Diagnostic confirmé dans les styles : `#gate .public-header` est en `position:fixed`, avec une hauteur minimale de 88 px sur ordinateur ; le défilement du catalogue utilisait auparavant `scrollIntoView()` avec une marge de 18 px.
- Cette différence pouvait placer le début du catalogue sous l’en-tête et laisser le bouton « المواد التعليمية » visible/sélectionné, donnant l’impression qu’un second clic était nécessaire.
- Correction ciblée dans `public-portal.js` : calcul de la position de défilement à partir de la hauteur réelle de l’en-tête mesurée par `getBoundingClientRect()`, puis défilement vers le catalogue avec un dégagement de 16 px.
- Marge CSS de secours du catalogue portée à 112 px ; la mesure JavaScript reste prioritaire et s’adapte à la hauteur réelle sur mobile et ordinateur.
- Service Worker : version portée de `dz-de-v3.168.0.0.20` à `dz-de-v3.168.0.0.21` pour invalider les caches statiques précédents ; le pré-cache conserve `public-portal.js?v=8`.
- Aucun changement aux routes, événements, données, authentification, Supabase, RLS, paiements ou tableau de bord élève.
- Vérification statique à effectuer sur le commit : présence du calcul dynamique, suppression de l’ancien `scrollIntoView()` dans `show()`, cohérence des références de cache.
- Validation navigateur réelle ordinateur/mobile toujours requise ; aucune conformité visuelle n’est revendiquée avant ce test.


## Lot 69 — Hiérarchie éditoriale du premier écran public (4 novembre 2026)

- Comparaison du DOM de l'accueil avec le prototype pédagogique : les quatre repères synthétiques étaient placés **après** les deux appels à l'action, alors que le prototype construit la lecture dans l'ordre « promesse → explication → repères concrets → action ».
- Réordonnancement limité dans `index.html` : indicateurs (3 années, 6 langues, 14 matières, accompagnement IA), puis repère institutionnel, puis boutons d'inscription et de découverte.
- Aucun texte, identifiant, attribut `data-public-view`, `data-gate-open`, route ou comportement d'inscription n'a été modifié.
- Aucun changement de CSS, dépendance, Auth, Supabase, RLS ou tableau de bord.
- Service Worker : `dz-de-v3.168.0.0.22` pour invalider l'ancien HTML en cache.
- Contrôle statique : ordre des blocs et conservation des deux actions à vérifier après commit ; rendu visuel réel à confirmer sur la preview Cloudflare, sur ordinateur et mobile.


## Lot 70 — Suppression de la double carte dans le héros public (4 novembre 2026)

- Audit CSS : `.public-landing` est déjà le grand panneau principal de l'accueil. Le Lot 59 avait ajouté un second fond, cadre, rayon et ombre sur `.public-copy`, créant une carte imbriquée qui éloignait le rendu du prototype éditorial.
- Correction de la règle Lot 59 à sa source : `.public-copy` redevient un bloc éditorial transparent, sans bordure ni ombre, avec son espacement propre ; le panneau principal et la carte `.public-ai-card` sont conservés.
- Suppression de la variante de carte en mode sombre et de son padding/cadre mobile ; le texte garde les règles typographiques existantes.
- Aucun changement aux boutons, IDs, attributs `data-*`, navigation, contenu, Auth, Supabase, RLS ou vues connectées.
- Service Worker : `dz-de-v3.168.0.0.23`.
- Contrôles attendus : cohérence des règles desktop/mobile/dark et CI. Validation esthétique réelle encore requise via preview sur ordinateur et mobile.


## Lot 71 — Signature institutionnelle du pied de page public (4 novembre 2026)

- Remplacement de la mention nominative « © 2026 — الأستاذ خريف أحمد 🇩🇿 » par « الثانوية الافتراضية الجزائرية · منصة تعليمية شاملة © 2026 ».
- Le slogan secondaire et la mention du programme restent inchangés ; aucun autre contenu du portail ni comportement n'est modifié.
- Service Worker : version portée à `dz-de-v3.168.0.0.24` pour renouveler le cache.
- La demande concernant la barre de défilement de l'accueil public et des écrans de connexion/inscription reste à préciser : conserver une barre verticale visible avec un style plus soigné, ou la masquer ? La navigation verticale ne doit pas être rendue inaccessible.
- PR #17 / branche `design/prototypes-67-74-alignment` ; aucune fusion et aucune modification de `main`.


## Lot 72 — Harmonisation de la signature de l’écran de connexion

- Cause identifiée après retour utilisateur : une seconde signature subsistait dans `index.html`, dans le bloc `.gate-foot` de l’écran de connexion. Le script de langue lui appliquait ensuite « Deutsche Sprache », reconstituant l’ancienne signature observée.
- Remplacement de cette seconde occurrence par : `الثانوية الافتراضية الجزائرية · منصة تعليمية شاملة © 2026`.
- Le pied de page principal conserve la même signature institutionnelle.
- Version du service worker incrémentée à `dz-de-v3.168.0.0.25` pour renouveler le cache de la page.
- Aucune règle de défilement modifiée ; cette demande a été abandonnée par l’utilisateur.
- Modifications limitées à `index.html`, `sw.js` et au présent dossier, sur `design/prototypes-67-74-alignment` / PR #17. Aucun changement sur `main`, aucune fusion.


## Lot 73 — Fiabilisation du premier écran de l’accueil élève (4 novembre 2026)

- Recomposition des accès rapides dans `index.html` : les cartes mettent désormais en avant les parcours d’apprentissage (cours, matières, bibliothèque, professeur IA, entraînement, évaluations, préparation au bac et suivi du parcours). Les chiffres statiques non vérifiés et les promesses de présence en direct ont été retirés de ces cartes.
- `app.js` : les indicateurs de l’accueil distinguent maintenant les séances réalisées, les séances restantes, le meilleur résultat de simulation et le nombre de documents de la bibliothèque lorsque le catalogue est chargé. Le rendu des indicateurs est relancé à la fin du chargement asynchrone du catalogue pour éviter de laisser le compteur sur `—` après l’arrivée des données. Le total de points maximal du devoir n’est plus présenté comme une note personnelle ; le numéro WhatsApp a été retiré des statistiques.
- Le bandeau de bienvenue et la barre institutionnelle ne présentent plus l’effectif théorique de la section comme un nombre de camarades réellement présents, ni de mention de présence en ligne du professeur. La barre affiche la classe, la matière, le niveau et le nombre de documents si le catalogue est chargé.
- Identifiants de navigation conservés, dont `cBdd` afin de garder le compteur documentaire branché sur le catalogue chargé ; aucune modification de l’authentification, des données, de Supabase, des RLS, du schéma ou des droits d’accès.
- Cache : référence `app.js?v=3523` et Service Worker `dz-de-v3.168.0.0.28`.
- Commits : `983fd98`, `2b6f597`, `fe766bc` et `1fd0576` (index), `6e3b225`, `015be29` et `fc9605b` (app.js), `f42b068`, `7c3c21d` et `7c7b172` (Service Worker), sur `design/prototypes-67-74-alignment` / PR #17.
- CI déclenchée sur le dernier commit : en attente au moment de cette note. Contrôle navigateur et validation visuelle ordinateur/mobile non effectués ; ne pas considérer l’accueil connecté comme validé avant ces vérifications et le retour de l’utilisateur.


## Lot 74 — Neutraliser les horaires fictifs dans l’accueil élève (4 novembre 2026)

- Constat : `assets/bdd/journee.json` indique explicitement « Données de démonstration », avec une date de référence au 16 septembre 2026. L’ancienne interface montrait pourtant « جارية الآن » et un bouton « انضم الآن » comme si la séance était réelle.
- `journee.js` : détection du statut de démonstration via la métadonnée de confidentialité ; ajout d’un avertissement visible en arabe ; remplacement des statuts de présence par « نموذج توضيحي » ; suppression des boutons d’accès à une séance et des compteurs présentés comme programme réel dans ce cas. Le tableau hebdomadaire porte également un avertissement et n’affiche plus de statuts de présence réels.
- `style-prototype-dz.css` : style de l’avertissement avec signalétique ambre, compatible avec les thèmes clair et sombre.
- `index.html` : versions des ressources `journee.js?v=3511` et `style-prototype-dz.css?v=124` ; Service Worker `dz-de-v3.168.0.0.29`.
- Commits : `faf5f1a` (`journee.js`), `3c961d2` (CSS), `7f2cb6c` (index), `e9f0103` (Service Worker).
- Les raccourcis génériques vers les sections d’apprentissage restent disponibles. Aucun changement d’authentification, de données personnelles, de Supabase, de RLS, de schéma ou de permissions.
- CI : à vérifier sur le dernier commit. Vérification navigateur/visuelle ordinateur et mobile encore nécessaire ; ce lot ne constitue pas la validation finale de l’accueil connecté.


## Lot 75 — Progression pédagogique séparée par niveau (4 novembre 2026)

- Audit du calcul de progression : le tableau « مسارك » additionnait auparavant toutes les unités 2AS et 3AS, même lorsque le compte élève était rattaché à un seul niveau. Le bandeau de bienvenue additionnait lui aussi toutes les unités et comptait les entrées de stockage sans vérifier qu'elles correspondaient à une séance existante.
- `masar.js` : la progression utilise maintenant le niveau du compte lorsqu'il est disponible, sinon le niveau actif du sélecteur. Les séances sont agrégées uniquement dans ce périmètre ; les unités sans séances chargées sont exclues. Le cercle affiche « — » plutôt qu'un faux 0 % lorsqu'aucune séance n'est disponible pour le niveau choisi.
- `app.js` : le bandeau de bienvenue calcule le même périmètre de niveau, ne compte que les séances réellement présentes dans le programme et indique explicitement le niveau concerné. Si aucune séance n'est disponible, il affiche un état d'attente au lieu d'un pourcentage artificiel.
- Aucun nouveau graphique synthétique, aucune série temporelle inventée et aucune donnée de démonstration ajoutée. Les résultats par compétence déjà issus de la mémoire locale restent fondés sur les réponses réellement enregistrées.
- Cache : `app.js?v=3524` et Service Worker `dz-de-v3.168.0.0.30` ; pré-cache synchronisé.
- Aucun changement de structure de base, Supabase, Auth, RLS, paiements, droits ou données personnelles. Travail limité à la branche `design/prototypes-67-74-alignment` / PR #17, sans fusion ni modification de `main`.
- Contrôles statiques et CI à exécuter sur le commit final. Validation visuelle réelle sur ordinateur et mobile toujours nécessaire ; elle n'est pas revendiquée dans ce lot.


## Lot 76 — Recomposition visuelle de l’accueil connecté élève (4 novembre 2026)

- Constat après audit : l’accueil connecté conservait une composition héritée malgré plusieurs couches CSS successives. Plusieurs règles redéfinissaient les mêmes zones (grille principale, héros, matières et cartes), ce qui entretenait l’impression de retouches ponctuelles et rendait le résultat difficile à maîtriser.
- Ajout d’une couche de style dédiée et strictement limitée à `#shell #app [data-view="accueil"]` dans `style-prototype-dz.css` :
  - nouvelle composition desktop avec zone pédagogique principale et panneaux latéraux réorganisés ;
  - héros élève plus ample, hiérarchie typographique renforcée, actions et progression intégrées dans un panneau visuel unique ;
  - catalogue des matières et indicateurs de progression traités comme des sections distinctes, avec titres éditoriaux, cartes et espaces cohérents ;
  - raccourcis pédagogiques réorganisés en grille, sans réintroduire les anciens blocs allemands statiques ;
  - déclinaisons tablette/mobile et mode sombre.
- Aucun identifiant, route, fonction métier, événement, donnée, Auth, Supabase, RLS, schéma, paiement ou permission modifié. Les contenus et indicateurs restent alimentés par les modules et données existants.
- Cache : `style-prototype-dz.css?v=125`, Service Worker `dz-de-v3.168.0.0.31`.
- Fichiers modifiés : `style-prototype-dz.css`, `index.html`, `sw.js`, présent dossier de continuité.
- Commits : CSS `b8666d6`, index `13d5567` ; commits du Service Worker et du dossier à relever après écriture.
- Validation statique, CI et publication preview à vérifier. Aucune validation visuelle navigateur ordinateur/mobile n'est revendiquée tant que les deux rendus n'ont pas été inspectés.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`. Aucune modification directe de `main`.


### Complément Lot 76 — correction de grille et ordre du premier écran

- Audit du DOM réel : `aside.home-side` précède `.home-main` dans `index.html`. La première règle de grille ne déclarait pas explicitement les zones et pouvait attribuer la grande colonne à l'aside. Correction par `grid-template-areas`, `grid-area`, `grid-column` et `grid-row` explicites.
- Ordre du contenu dans `.home-main` : héros de bienvenue en premier, catalogue des matières ensuite, indicateurs puis contenus du jour et aperçu. L'illustration SVG générique héritée est masquée pour éviter un doublon visuel.
- Déclinaison tablette/mobile : grille à une colonne avec héros/contenu principal avant les panneaux latéraux.
- Références actualisées : CSS `v126`, Service Worker `dz-de-v3.168.0.0.32`.
- CI du commit précédent `d92007f` réussie. Nouvelle CI à attendre sur le commit de correction.
- Point de publication : le workflow GitHub `.github/workflows/deploy.yml` ne déploie pas vers Cloudflare ; il contient des contrôles et un message informatif indiquant que le déploiement est géré par l'intégration OAuth Cloudflare. Aucun aperçu Cloudflare de ce nouveau HEAD n'a pu être confirmé à cette étape. La production `allemand.brid-randomtv.workers.dev` n'est donc pas déclarée mise à jour.


## Lot 77 — recomposition du tableau de bord « مساري » (4 novembre 2026)

- Audit du rendu réel : les éléments de progression étaient empilés verticalement malgré la présence d'un héros, d'une prochaine action, d'un graphique de compétences et d'une progression d'unité. Les libellés du graphique masquaient aussi le nombre de tentatives et de cartes.
- Nouvelle composition desktop en grille éditoriale : héros pleine largeur, prochaine action et analyse des compétences côte à côte, progression de l'unité en pleine largeur. À moins de 980 px, retour à une colonne pour préserver la lisibilité.
- Les libellés de compétences sont maintenant lisibles sur plusieurs lignes et leurs métadonnées existantes (tentatives/cartes) sont affichées. Les barres et pourcentages restent ceux calculés par `MEMOIRE.carteErreurs()`.
- Aucun calcul JS, contenu, identifiant, route, événement, donnée, Auth, Supabase, RLS, schéma, paiement ou permission modifié. Aucun faux résultat, série temporelle ou statistique de démonstration ajouté.
- Cache : `style-prototype-dz.css?v=127`, Service Worker `dz-de-v3.168.0.0.33`.
- Fichiers du lot : `style-prototype-dz.css`, `index.html`, `sw.js`, présent dossier de continuité.
- Contrôles statiques et CI à exécuter sur le commit final. Recette visuelle navigateur ordinateur/mobile toujours requise ; aucune validation visuelle n'est revendiquée sans aperçu accessible.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17. PR maintenue ouverte et non fusionnée ; aucune modification directe de `main`.


## Lot 78 — مساري
Refonte CSS ciblée de la page de parcours : en-tête éditorial, hero vert avec anneau de progression, carte d'action prioritaire, analyse des compétences et progression d'unité. Déclinaisons mobile et thème sombre. `masar.js` reste inchangé : données et actions pédagogiques conservées. Cache CSS `v128`, Service Worker `dz-de-v3.168.0.0.34` avec précache CSS `v128`. Aucune modification Auth, Supabase, RLS, schéma ou paiement. CI et vérification visuelle à confirmer. PR #17 reste ouverte et non fusionnée.


## Lot 79 — correction de la composition réelle de « مساري » (4 novembre 2026)

- Analyse des captures du preview `444bef02` : le panneau vert du parcours était bien stylé, mais les cartes de prochaine action, d'analyse et de progression ne formaient pas la grille annoncée.
- Cause identifiée dans Lot 78 : `grid-template-areas` était déclaré sans activer `display:grid` sur `#masarBody` et sans affecter les cartes à leurs zones (`grid-area`). Le navigateur conservait donc le flux normal.
- `style-prototype-dz.css` : activation de la grille, affectation explicite de `hero / next / chart / progress`, disposition deux colonnes sur grand écran et une colonne sous 980 px.
- `index.html` : cache CSS `v129` et remplacement du sous-titre statique « شيء واحد فقط الآن — والباقي ينتظر » par « تابع إنجازك، واكتشف خطوتك التعليمية التالية ».
- `sw.js` : version `dz-de-v3.168.0.0.35` et précache CSS `v129`.
- `masar.js` reste inchangé : calculs, données de mémoire, progression et actions sont préservés. Aucun changement Auth, Supabase, RLS, schéma, paiement ou permission.
- Vérification visuelle du nouveau preview et CI encore à effectuer. PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`.


## Lot 80 — correction du texte réellement rendu dans « مساري » (4 novembre 2026)

- Retour utilisateur sur le preview `5570bd56` : les textes visibles restaient « كل خطوة تقرّبك من النجاح » et « تقدّمك الحقيقي، مهاراتك، وخطوتك القادمة في مكان واحد ».
- Cause : ces textes sont générés dynamiquement dans `masar.js` (fonction `render()`), et non dans `index.html`. La modification précédente de `index.html` ne pouvait donc pas les changer.
- Correction dans `masar.js` : titre « مسارك الدراسي، خطوة بخطوة نحو التميّز » et sous-titre « خطة تعلّم واضحة، حصصك المنجزة، ومهاراتك التي تتطور مع كل تدريب — كل ذلك في لوحة واحدة. ».
- Cache du script actualisé à `masar.js?v=3515` dans `index.html` et `sw.js`; version Service Worker `dz-de-v3.168.0.0.36`.
- Les calculs, les chiffres de progression, les données réelles et les actions de navigation restent inchangés. Aucun changement Auth, Supabase, RLS, schéma, paiement ou permissions.
- Attendre le nouveau preview Cloudflare puis contrôler que le titre/sous-titre ont changé ; ne pas considérer le lot terminé avant vérification visuelle.


## Lot 81 — renforcement du rendu visuel de « مساري » (4 novembre 2026)

- Retour utilisateur : la page paraît vide, sans cartes visuellement marquées et sans ressemblance avec le tableau de bord de référence.
- Audit du CSS : les règles de grille et les styles de cartes existaient, mais la page ne présentait pas une hiérarchie visuelle suffisamment forte et le rendu navigateur n'avait pas été validé.
- Ajout d'une couche CSS de finition fortement ciblée sur `section[data-view="masar"]` : fond de page doux, en-tête éditorial encadré, grand panneau héro, cartes distinctes avec bordures/ombres/rayons, prochaine action mise en avant, zone d'analyse et panneau de progression.
- Grille desktop explicite : héro pleine largeur, prochaine action et analyse côte à côte, progression pleine largeur. Passage à une colonne sur tablette/mobile.
- Aucun chiffre, graphique, résultat, séance ou contenu de démonstration ajouté. Les valeurs continuent de provenir des fonctions et données existantes.
- Cache CSS porté à `v130`; Service Worker porté à `dz-de-v3.168.0.0.37` avec précache CSS v130.
- Fichiers modifiés : `style-prototype-dz.css`, `index.html`, `sw.js`, présent dossier.
- Commit CSS : `af8c8099e6fa976b6b424580430b3325ed458963`; commit index : `150848e9712d7d3cf15d1ecfbffca61817cd4196`; commit SW : `2fa4c12b4bedf2b2d16b4557172efa578aa814cc`.
- État : correction de code poussée sur `design/prototypes-67-74-alignment`. Attendre le preview Cloudflare, tester ordinateur et mobile, puis comparer les captures au modèle. Aucune validation visuelle ni publication production revendiquée à ce stade.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main`, Auth, Supabase, RLS, schéma, paiements ou permissions.


## Lot 82 — respecter l’attribut hidden de la vue مسارك (4 novembre 2026)

- Audit du DOM : `#shell`, `#app`, `section[data-view="masar"].dz-masar-page`, `#masarBody` et l’appel à `renderMasar()` sont présents. L’hypothèse d’un conteneur absent est écartée.
- Défaut CSS confirmé dans le lot 81 : `display:block!important` sur la section `masar` avait une spécificité supérieure à la règle globale `[hidden]{display:none!important}`. Cette déclaration pouvait afficher la vue même lorsque l’application lui appliquait `hidden`.
- Correction ciblée dans le sélecteur du lot 81 : retrait de `display:block!important` de la section ; le navigateur peut donc respecter l’état `hidden`. Aucun changement à `masar.js`, aux données, aux actions ou aux calculs.
- Référence CSS portée à `v132`; Service Worker porté à `dz-de-v3.168.0.0.39` et précache CSS aligné.
- Un premier remplacement trop large avait modifié une autre déclaration sans retirer celle du lot 81 ; ce second commit corrige explicitement le bon bloc. Contrôle source après commit requis ; CI et test navigateur restent à vérifier. Aucune validation visuelle revendiquée.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`, Auth, Supabase, RLS, schéma, paiements ou permissions.


## Lot 83 — préserver la carte de connexion publique (4 novembre 2026)

- Audit de régression du correctif précédent : la suppression trop large de `display:block!important` avait également touché `#gate.public-auth-page .gate-card:not([hidden])`.
- Restauration de `display:block!important` sur cette carte, dont le sélecteur `:not([hidden])` garantit que les cartes masquées ne sont pas ciblées.
- La section `[data-view="masar"].dz-masar-page` reste sans forçage `display:block` ; son attribut `hidden` reste respecté.
- CSS porté à `v133`, Service Worker à `dz-de-v3.168.0.0.40` avec précache aligné.
- Validation de la règle source après commit et CI à relancer ; aucun test visuel navigateur n'est revendiqué.
- PR #17 reste ouverte, non fusionnée, cible `main` ; aucun changement de données, Auth, Supabase, RLS, schéma, paiements ou permissions.


## Lot 84 — distinguer validation CI et publication Cloudflare (5 novembre 2026)

- Le run GitHub Actions `41929906445` associé au commit `a8aad86cc4e7a1cfd2919c2c3076fdc3403eca3d` est terminé avec succès : le job « Validation structurelle & pédagogique » et ses 27 étapes sont verts.
- Inspection complète de `.github/workflows/deploy.yml` sur la branche : un seul job existe, `validate`. Aucun job `deploy`, aucune commande `wrangler deploy`, aucune action Cloudflare n'y publie le Worker. Le nom « CI + Deploy » et le message final parlant d'un build automatique via OAuth ne constituent donc pas une preuve de déploiement.
- `wrangler.toml` définit bien le Worker `allemand`, son entrée `src/site-worker.js` et les actifs statiques, mais ne prouve pas à lui seul qu'un déploiement de la branche PR a été exécuté.
- Conclusion : CI verte = validation structurelle/pédagogique réussie ; publication du preview Cloudflare et rendu navigateur = non vérifiés. Ne pas confondre les deux états et ne pas annoncer la page corrigée comme visible avant vérification réelle.
- Aucun workflow de déploiement n'a été ajouté : les identifiants/secrets Cloudflare et la configuration Git Integration du compte ne sont pas inspectables depuis les outils disponibles. Ne pas inventer de secret, ne pas modifier la production ni `main`.
- Suite : vérifier le déploiement de la branche `design/prototypes-67-74-alignment` dans Cloudflare Workers Builds / Deployments, puis comparer les vues « مسارك » sur ordinateur et mobile. Si aucun preview n'existe, demander l'accès ou une capture d'écran avant tout nouveau patch CSS.
- PR #17 reste ouverte et non fusionnée ; aucun changement Auth, Supabase, RLS, schéma, paiements ou permissions.


## Lot 85 — un seul gestionnaire pour les boutons d’authentification publics

- Retour utilisateur : le bouton de navigation « تسجيل الدخول » ne déclenche pas l’ouverture de la page de connexion, alors que « 🚀 الدخول إلى القسم » (soumission du formulaire) fonctionne.
- Diagnostic statique : le bouton de navigation porte bien `data-gate-open="login"`. Deux gestionnaires distincts traitaient les éléments `[data-gate-open]` : un gestionnaire direct dans `app.js` et un gestionnaire délégué dans `public-portal.js`. Le second contrôle l’état de page publique (`public-auth-page`), la visibilité de la carte et le hash `#connexion`; le premier ne faisait que cliquer l’onglet et déplacer le focus/la page. Cette double prise en charge créait un chemin d’interaction redondant et un défilement déclenché alors que la carte pouvait encore être masquée.
- Correction ciblée : retrait du gestionnaire direct redondant de `app.js`. `public-portal.js` reste l’unique propriétaire des boutons `data-gate-open`, pour la connexion comme pour l’inscription. Le gestionnaire de soumission `#loginForm`, l’authentification Supabase/locale et le bouton « 🚀 الدخول إلى القسم » ne sont pas modifiés.
- Cache : référence `app.js?v=3525` synchronisée dans `index.html` et le précache de `sw.js` ; version du cache statique du service worker portée à `dz-de-v3.168.0.0.41`.
- Périmètre : branche `design/prototypes-67-74-alignment` uniquement ; aucun changement sur `main`, aucune fusion de PR, aucune modification Supabase/Auth/RLS/base de données.
- Validation : vérification statique du retrait du gestionnaire en double, de la conservation du gestionnaire délégué et de la cohérence des références de cache. Le clic réel dans un navigateur et le déploiement Cloudflare restent à confirmer ; cette correction n’est pas déclarée validée visuellement.


## Lot 86 — ouverture autonome de la page de connexion depuis la navigation

- Retour utilisateur après le lot 85 : « تسجيل الدخول » ne fonctionnait toujours pas.
- Nouvelle analyse : le gestionnaire historique d'`app.js` ne rendait pas la carte visible ; il cliquait sur l'onglet puis appelait seulement `scrollIntoView()`. La correction précédente avait supprimé ce gestionnaire en supposant que le gestionnaire délégué de `public-portal.js` suffisait. Le retour utilisateur montre que ce chemin ne fonctionne pas dans son environnement publié.
- Correction : `app.js` reprend un gestionnaire direct autonome pour les boutons `[data-gate-open]`. Il démasque explicitement `#gate` et `.gate-card`, active le bon onglet, met à jour `#connexion` ou `#inscription`, place le focus dans le champ correspondant et revient en haut de page. Le formulaire `#loginForm` et sa logique d'authentification ne sont pas modifiés.
- Cache : `app.js?v=3526` synchronisé dans `index.html` et le précache ; service worker `dz-de-v3.168.0.0.42`.
- Périmètre : branche `design/prototypes-67-74-alignment` uniquement ; PR #17 reste ouverte et non fusionnée ; aucune modification de `main`, Supabase, Auth, RLS ou base de données.
- Validation : vérification statique de la visibilité explicite du formulaire, du gestionnaire direct, des versions de cache et des ancres conservées. Test navigateur réel et publication Cloudflare restent à confirmer.


## Lot 87 — dévoiler explicitement le conteneur du portail de connexion (5 novembre 2026)

- URL de prévisualisation communiquée et ciblée : `https://75be659c-allemand.brid-randomtv.workers.dev/#connexion`.
- Défaut confirmé dans `public-portal.js` : `setAuthPage()` affichait `.gate-card` mais ne retirait pas l'attribut `hidden` du parent `#gate`, pourtant masqué au chargement dans `index.html`. Le chemin de navigation publique dépend de cette fonction, y compris lors de l'ouverture via le hash `#connexion`.
- Correction : `gate.hidden = false` est maintenant exécuté dans `setAuthPage()` avant l'affichage de la carte et l'activation de l'onglet. Le repli direct de `app.js` est conservé ; aucune logique de soumission ou d'authentification n'est modifiée.
- Cache : `public-portal.js?v=9` synchronisé dans `index.html` et le précache du Service Worker ; version du cache portée à `dz-de-v3.168.0.0.43`.
- Périmètre : branche `design/prototypes-67-74-alignment` et PR #17 uniquement ; aucune modification de `main`, aucune fusion, aucun changement Supabase/Auth/RLS/base de données.
- Validation : modification source et synchronisation des références vérifiables dans GitHub. L'accès au Worker de prévisualisation a échoué depuis l'outil de consultation ; aucun clic navigateur ni déploiement Cloudflare n'est revendiqué. Il reste à confirmer que ce commit est effectivement publié sur le preview puis à tester le clic réel.


## Lot 88 — page de connexion e-learning (5 novembre 2026)

- Recomposition réelle de l'écran d'authentification existant : panneau de présentation pédagogique, formulaire principal hiérarchisé, onglets connexion/inscription, champs et actions mieux lisibles.
- Le portail public et l'écran d'authentification restent deux états visuels distincts via les routes existantes #connexion et #inscription ; le retour vers l'accueil conserve son contrôle actuel.
- Libellés clarifiés : « البريد الإلكتروني أو اسم المستخدم », « تسجيل الدخول إلى المنصة » et bouton secondaire de démonstration sans divulgation des identifiants de démonstration dans le texte public.
- Préservation stricte des identifiants DOM (loginForm, loginUser, loginPass, loginClasse, btnDemo, signupForm, etc.), des gestionnaires app.js/public-portal.js et des appels Supabase/AUTH. Aucun changement au mécanisme d'authentification.
- Aucun lien « mot de passe oublié » ajouté : le client Supabase de cette branche n'expose actuellement aucun parcours de récupération, et afficher un lien inopérant serait trompeur. À traiter dans un lot fonctionnel distinct si demandé.
- CSS classique uniquement, avec variantes clair/sombre et mise en page responsive ; aucune dépendance ajoutée.
- Cache : style-prototype-dz.css?v=134 synchronisé dans index.html et le précache ; version du service worker portée à dz-de-v3.168.0.0.44.
- Validation : contrôles statiques de présence des ancres/formulaires, conservation des IDs et handlers, références CSS/SW cohérentes, délimiteurs CSS équilibrés. Aucun test visuel navigateur ordinateur/mobile ni déploiement Cloudflare n'est revendiqué à ce stade.
- PR #17 reste ouverte et non fusionnée ; aucune modification de main, de Supabase, Auth, RLS ou de la base de données.

## Lot 89 — un seul propriétaire des routes de connexion publiques (5 novembre 2026)

- Relecture du code après les lots 85 à 88 : le gestionnaire direct `[data-gate-open]` était encore présent dans `app.js`, en plus du gestionnaire délégué de `public-portal.js`. Le doublon avait été réintroduit au lot 86 pour contourner le parent masqué ; le lot 87 a depuis corrigé la cause réelle en exécutant `gate.hidden = false` dans `setAuthPage()`.
- Correction ciblée : retrait du gestionnaire direct redondant dans `app.js`. `public-portal.js` devient l'unique propriétaire de l'ouverture de `#connexion` et `#inscription`, du dévoilement de `#gate`, du changement d'onglet et du focus initial.
- Le gestionnaire de soumission `#loginForm`, les appels Supabase/AUTH, `btnDemo`, les formulaires et les identifiants DOM sont conservés sans modification.
- Cache synchronisé : `app.js?v=3527`, Service Worker `dz-de-v3.168.0.0.45`, précache `./app.js?v=3527`.
- Test de non-régression ajouté à `ci/check-public-portal.mjs` : interdit le double gestionnaire dans `app.js` et vérifie que le portail dévoile `#gate` avant l'écran d'authentification.
- Contrôles navigateur réel mobile/ordinateur et publication Cloudflare non revendiqués ; à confirmer après la CI et une prévisualisation accessible.
- Travail limité à `design/prototypes-67-74-alignment` / PR #17. PR maintenue ouverte et non fusionnée ; aucun changement sur `main`, Supabase, Auth, RLS, schéma, données ou paiements.


## Lot 90 — renforcer les tests du parcours de connexion (5 novembre 2026)

- La CI #2061 est terminée avec succès sur le commit `d1f2729`, qui était la tête de la PR #17 au moment du contrôle. Elle a exécuté le job « Validation structurelle & pédagogique » ; ce workflow PR ne lance pas de publication Cloudflare.
- Relecture du workflow `.github/workflows/deploy.yml` : pour un événement `pull_request`, le seul job déclaré est `validate`. La mention « CI + Deploy » ne constitue donc pas une preuve de déploiement du preview ou de la production.
- Renforcement de `ci/check-public-portal.mjs` : le test vérifie maintenant le formulaire `#loginForm`, les champs utilisateur/mot de passe et leurs attributs autocomplete, le bouton submit, les deux routes de hash, le gestionnaire délégué, les onglets, ainsi que la présence des deux chemins de soumission Supabase/AUTH existants.
- Aucun code d'authentification, formulaire, identifiant DOM, configuration Supabase ou règle d'accès n'a été modifié ; seul le contrôle de non-régression a été étendu.
- Validation du nouveau test à attendre sur le commit de ce lot. Aucun test navigateur réel, aucune validation visuelle mobile/ordinateur et aucun déploiement Cloudflare ne sont revendiqués.
- Branche `design/prototypes-67-74-alignment`, PR #17 vers `main` ; PR maintenue ouverte et non fusionnée. Aucun changement direct sur `main`.


## Lot 91 — accessibilité des onglets de connexion (5 novembre 2026)

- CI du lot 90 confirmée verte : run #2064, commit `8ecfc9d`, job unique « Validation structurelle & pédagogique » et toutes ses étapes réussies.
- Audit du formulaire : les deux boutons d'onglet n'exposaient pas leur état aux technologies d'assistance. Ajout de `role=tablist`, `role=tab`, `aria-selected`, `aria-controls`, d'un ordre de tabulation roving (`tabindex=0/-1`) et des relations `aria-labelledby` sur les panneaux formulaires.
- Le gestionnaire existant synchronise maintenant classe CSS, état ARIA et tabulation lorsqu'on change d'onglet. Les identifiants DOM, les routes, les champs et les gestionnaires d'authentification restent inchangés.
- Test CI étendu pour contrôler la présence des attributs ARIA et la synchronisation de l'état accessible.
- Cache synchronisé : `app.js?v=3528`, Service Worker `dz-de-v3.168.0.0.46`, précache `./app.js?v=3528`.
- Nouveau run CI du lot 91 à attendre. Aucun test navigateur réel, test lecteur d'écran ou déploiement Cloudflare n'est revendiqué.
- Travail sur `design/prototypes-67-74-alignment` / PR #17 vers `main`, maintenue ouverte et non fusionnée. Aucun changement Auth/Supabase/RLS/schéma/paiement.


## Lot 92 — refonte structurelle du tableau de bord « مسارك » (5 novembre 2026)

- Retour utilisateur : la page « مسارك » restait très éloignée du niveau visuel et de la composition attendus des prototypes 67–74. Le problème ne se résumait pas aux couleurs : la vue ne présentait pas de véritable carte des unités et la prochaine séance pouvait provenir d'un niveau différent de celui utilisé pour le calcul global.
- Audit du calcul : `progressData()` calculait le total par unité via `loadSeancesFor(u.n)`, tandis que la carte « prochaine séance » appelait séparément `prochaineSeance()`, qui dépend de `niveauActif` et de `loadSeances()` (unité actuellement sélectionnée). Ces deux sources pouvaient diverger.
- Refonte de `masar.js` : une seule résolution du niveau actif ; calcul des séances faites/restantes pour chaque unité avec `loadSeancesFor(u.n)` ; sélection de la prochaine séance dans le même ensemble d'unités que le total affiché. L'action de prochaine séance sélectionne désormais l'unité correspondante avant d'ouvrir la vue des séances.
- La composition comprend maintenant : hero avec progression réelle, action prioritaire (révisions dues ou prochaine séance), analyse des compétences à partir des tentatives enregistrées dans MEMOIRE, résumé global, et grille de progression unité par unité avec statuts « لم تبدأ / قيد الإنجاز / مكتملة ».
- Les états vides sont explicites : aucune valeur fictive n'est créée. Les indicateurs de compétences restent basés sur les tentatives mémorisées ; les unités et séances viennent du registre `UNITES` et du stockage de progression existant.
- CSS ajouté en fin de `style-prototype-dz.css` : grille desktop à deux colonnes pour action/analyse, résumé et unités en pleine largeur ; adaptation tablette/mobile ; surfaces, hiérarchie typographique, barres et cartes ; thème sombre pris en charge. Pas de Tailwind ni dépendance ajoutée.
- Cache : CSS `v135`, script `masar.js?v=3516`, Service Worker `dz-de-v3.168.0.0.47`, précache aligné.
- Nouveau contrôle `ci/check-masar.mjs` intégré à `.github/workflows/deploy.yml` ; `masar.js` ajouté au contrôle de syntaxe JavaScript.
- Fichiers : `masar.js`, `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-masar.mjs`, `.github/workflows/deploy.yml`, présent dossier.
- Validation en attente : CI du lot 92, puis vérification visuelle réelle du preview sur ordinateur et mobile. Une CI verte ne prouvera ni le déploiement Cloudflare ni la fidélité visuelle finale. Aucun test navigateur n'est revendiqué à ce stade.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement ; PR ouverte et non fusionnée ; aucun changement sur `main`, Auth, Supabase, RLS, schéma, paiements ou production.


### Suivi de déploiement du lot 92 — 5 novembre 2026, 10:45 (heure Algérie)

- CI GitHub Actions **#2076** (run ID `41998407623`) terminée avec succès sur le commit `bd2fbcd1e4883c4a1eaccf32cddd634a49e7b1cc`. Les étapes « Valider la syntaxe JavaScript (esprima) » et « Contrôler le tableau de bord مسارك » sont vertes.
- Le commentaire de déploiement Cloudflare de la PR confirme le build et le déploiement Preview réussis pour `bd2fbcd`, déploiement `ccb248dd-e857-4c46-8e5c-facbc6b129d5`.
- URL de prévisualisation de branche : `https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev`. URL immuable du déploiement : `https://ccb248dd-allemand.brid-randomtv.workers.dev`.
- La consultation automatique de la page via l'outil web a été refusée par l'environnement (DisabledError). Le déploiement est confirmé par Cloudflare, mais le rendu après authentification et les interactions de la page n'ont pas été vérifiés par navigateur. Une validation manuelle par l'utilisateur sur ordinateur et mobile reste nécessaire.
- PR #17 toujours ouverte, non fusionnée, base `main`. Aucun déploiement production ni changement de `main` revendiqué.


## Lot 93 — récupération autonome du mot de passe (5 novembre 2026)
- Ajout au formulaire de connexion d'un accès « نسيت كلمة المرور؟ » ouvrant un écran de demande de réinitialisation, sans ajouter de lien décoratif ou inopérant.
- Ajout des formulaires de demande et de définition d'un nouveau mot de passe, avec validation de la confirmation et messages accessibles.
- Extension minimale de `supabase/supabase.js` : `resetPassword(email)` utilise `auth.resetPasswordForEmail`, et `updatePassword(password)` utilise `auth.updateUser`. Aucun stockage local du mot de passe ni changement de schéma/RLS.
- Routes dédiées `#mot-de-passe-oublie` et `#reinitialiser-mot-de-passe`. Le retour Supabase est également reconnu via `type=recovery` dans le fragment OAuth, sans écraser le jeton de récupération.
- Lien de récupération envoyé avec une URL de retour sur la page actuelle. La configuration Supabase Auth doit autoriser le domaine de production et, si utilisé, le domaine de prévisualisation dans les Redirect URLs ; cette configuration n'a pas été modifiée.
- Cache actualisé : CSS `v136`, app `v3529`, portail `v10`, Service Worker `dz-de-v3.168.0.0.48`.
- Contrôles CI ciblés ajoutés dans `ci/check-public-portal.mjs` pour les formulaires, les méthodes Supabase, les routes et les gestionnaires.
- Le réglage Supabase existant `persistSession: true` conserve déjà la session sur cet appareil ; aucun faux bouton « se souvenir de moi » n'a été ajouté, car une option décochable nécessiterait une stratégie distincte de persistance de session.
- Aucun changement de rôle, de compte, de politique RLS, de base de données, de paiement ou de moteur métier. PR #17 reste ouverte et non fusionnée.
- Validation navigateur ordinateur/mobile et essai réel du courriel de récupération non encore effectués. La CI doit encore confirmer les nouveaux contrôles ; la configuration de redirection Supabase doit être vérifiée avant d'annoncer le parcours opérationnel en production.
## Lot 94 — correction du contrôle CI de récupération (5 novembre 2026)
- Analyse du run GitHub Actions #2088 (commit `c65af542b85264d025c17130587d998709826186`) : les validations précédentes du portail et de la connexion réussissaient, puis `ci/check-public-portal.mjs` échouait sur le marqueur `'#reinitialiser-mot-de-passe'`.
- Cause : le test cherchait ce marqueur dans `supabase/supabase.js`, alors que la route appartient à `public-portal.js`. Le code applicatif contenait bien la route ; c'était une erreur d'affectation dans le test, pas une absence de méthode Supabase.
- Correction ciblée du seul fichier `ci/check-public-portal.mjs` : retrait du marqueur de la liste des API Supabase et contrôle des deux routes ainsi que du callback `isPasswordRecoveryCallback()` dans le fichier du portail.
- Commit de correction : `095a55367ee4bf0b1555c07c1516494738275384`.
- Le run #2088 reste historiquement en échec ; le nouveau commit doit encore être validé par une nouvelle exécution CI. Aucun succès CI n'est revendiqué à ce stade.
- L'audit confirme que `bindGateEvents()` est appelé par `bootGate()` au démarrage, avant la soumission des formulaires ; les gestionnaires de demande et de mise à jour sont donc enregistrés sur la visite initiale, sans dépendre d'une connexion préalable.
- À vérifier encore : nouvelle CI, allowlist des Redirect URLs Supabase, réception réelle du courriel, échange du lien et changement du mot de passe, puis test navigateur sur ordinateur et mobile.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement ; PR laissée ouverte et non fusionnée. Aucun changement sur `main`, les comptes, rôles, RLS, schéma, paiements ou configuration Supabase.
## Lot 95 — synchronisation du test de cache « مسارك » (5 novembre 2026)
- Après la correction du contrôle de récupération, le run #2089 sur le commit `095a553` a bien passé l'étape « Vérifier le portail public (catalogue et inscription) », y compris les nouveaux contrôles de récupération.
- Le même run a ensuite échoué dans `ci/check-masar.mjs` : le test exigeait encore `style-prototype-dz.css?v=135` et `dz-de-v3.168.0.0.47`, alors que les fichiers actifs utilisent déjà `v136` et `dz-de-v3.168.0.0.48` depuis le lot 93.
- Correction limitée au contrat de test `ci/check-masar.mjs` : les deux références attendues sont alignées sur les versions présentes dans `index.html` et `sw.js`. Aucun CSS, JavaScript applicatif ou cache réellement servi n'a été modifié par ce lot.
- Commit : `b5766c966c3ce881f577ab0b56f9e9a6726c6448`.
- Nouvelle CI déclenchée par ce commit à confirmer ; aucune CI verte n'est encore revendiquée.
- Le run #2089 prouve que le contrôle du portail et le contrôle de récupération sont désormais franchis. Le contrôle `مسارك` avait échoué uniquement sur les références de cache obsolètes ; les étapes suivantes ont été ignorées par arrêt anticipé.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement ; PR ouverte et non fusionnée. Aucun changement sur `main`, Supabase, Auth, RLS, schéma, rôles, comptes ou paiements.
## Lot 96 — validation CI finale de la récupération (5 novembre 2026)
- Le run GitHub Actions #2091 (`42056320655`) sur le commit `9855f948917bc9f4bea0a718c2487f6d809a2331` s'est terminé avec `success`.
- Le run #2090 (`42056295255`) sur `b5766c966c3ce881f577ab0b56f9e9a6726c6448` s'est également terminé avec `success`. Les contrôles du portail public, de la récupération, du tableau `مسارك`, de la garde d'accès, des parcours et de la régression pédagogique sont passés.
- Le commit `9855f94` ne modifie que ce dossier de continuité ; la CI verte confirme donc l'état de code testé sur `b5766c9` et la documentation mise à jour sur `9855f94`.
- Audit statique complémentaire : les formulaires de récupération sont présents dans `index.html`, les gestionnaires sont enregistrés par `bindGateEvents()` depuis `bootGate()`, les méthodes Supabase sont exportées sur `window.SB`, et le portail interprète le fragment `type=recovery`.
- Limite importante : la CI ne prouve pas la délivrabilité du courriel ni le fonctionnement du lien envoyé. La Redirect URL de production (origine + chemin de `index.html`) doit être autorisée dans Supabase Authentication → URL Configuration → Redirect URLs ; ce réglage n'a pas été modifié ni vérifié par les outils disponibles.
- Test manuel restant : demander une récupération avec une adresse de test autorisée, ouvrir le courriel, vérifier le retour sur `#reinitialiser-mot-de-passe`, définir un nouveau mot de passe puis se reconnecter. Effectuer ensuite le même contrôle d'affichage sur ordinateur et mobile.
- État de PR au moment du contrôle : #17 ouverte, branche `design/prototypes-67-74-alignment`, base `main`, non fusionnée. Aucun changement de `main`, aucun changement de configuration Supabase, de données, de rôles, de RLS, de schéma ou de paiements.


## Lot 97 — placement des formulaires de récupération sur la page de connexion (5 novembre 2026)

- Audit CSS du portail : la carte d'authentification publique utilise une grille nommée `intro / tabs / form`. Les formulaires de connexion et d'inscription étaient explicitement placés dans `form`, mais les formulaires `#passwordResetForm` et `#passwordUpdateForm` ne l'étaient pas.
- Correction ciblée sur `style-prototype-dz.css` : les deux formulaires de récupération occupent désormais la zone `form`, avec une largeur maximale cohérente, un alignement vertical en haut et des espacements adaptés. Les règles mobiles reprennent les marges et espacements de la page de connexion.
- Aucun changement de HTML, d'identifiant, de route, de gestionnaire JavaScript, de méthode Supabase ou de logique d'authentification. Le masquage des formulaires inactifs reste assuré par la règle globale `[hidden]{display:none!important}`.
- Cache actualisé : CSS `v137`, Service Worker `dz-de-v3.168.0.0.49`, précache synchronisé.
- Contrôle CI étendu : vérification des deux zones `grid-area:form`, de la référence CSS chargée et de la version du précache.
- Fichiers modifiés : `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-public-portal.mjs`, présent dossier.
- Commit(s) du lot 97 : CSS `e76121a`, cache HTML `f3fd04b`, Service Worker `fceec80`, contrôle CI `3c96483` ; mise à jour documentaire à suivre.
- Validation visuelle réelle sur navigateur ordinateur/mobile et test réel du courriel de récupération toujours non effectués. La réussite CI ne sera pas assimilée à une preuve de rendu ou de fonctionnement Supabase.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. PR maintenue ouverte et non fusionnée ; aucun changement de `main`, de configuration Supabase, de comptes, rôles, RLS, schéma ou paiements.


### Complément au lot 97 — synchronisation CI et audit statique des vues (5 novembre 2026)

- Le premier run déclenché après la correction de placement a échoué uniquement parce que `ci/check-masar.mjs` attendait encore l'ancien cache CSS `v136` et l'ancienne version Service Worker `.48`. Les contrôles du portail public, y compris les nouveaux contrôles de placement des formulaires, avaient réussi.
- Les assertions de cache du contrôle `مسارك` ont été synchronisées sur CSS `v137` et Service Worker `.49`. Correction du contrat de test uniquement, sans changement de `masar.js` ni de ses données.
- CI #2095 (run ID `42067231554`) sur `d47dcc9a77108303409ccfaf038625281a2f30db` : succès ; job « Validation structurelle & pédagogique » terminé avec succès. Lien : https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/42067231554.
- Audit statique des vues : les 34 valeurs `data-view` présentes dans `index.html` disposent chacune d'au moins une règle CSS ciblant la vue correspondante. Les espaces matières, مسارك, professeur IA, لوحة الأستاذ et الإدارة possèdent des styles et compositions dédiés. Les contenus dynamiques de plusieurs vues sont rendus par leurs modules JavaScript ; l'audit de présence des sélecteurs ne remplace donc pas un test de rendu navigateur.
- Écart de navigation confirmé : sur ordinateur, `#tabs` est une barre horizontale dans l'en-tête ; sur mobile, elle reste une barre horizontale défilante, positionnée dans le flux et non fixée en bas. La suppression du tiroir latéral mobile est bien présente, mais cela ne correspond pas à une barre inférieure fixe. Ce point reste à traiter dans un lot UX distinct, sans toucher aux routes ni aux permissions.
- Aucun rendu navigateur réel, capture desktop/mobile ou parcours interactif authentifié n'est revendiqué. Aucun changement de `main`, Auth, Supabase, RLS, schéma, rôles, comptes ou paiements.


## Lot 98 — navigation basse fixe sur mobile (5 novembre 2026)

- Audit du rendu CSS et du générateur `renderTabs()` : la navigation est construite à partir des mêmes boutons `data-go` et des mêmes vues `TABS` / `allTabs()`. Sur desktop elle reste une barre horizontale dans l'en-tête. Sur mobile, elle était auparavant horizontale mais dans le flux du document.
- Correction CSS ciblée : à largeur ≤ 900 px, `#tabs` devient une barre fixe au bas de l'écran, avec défilement horizontal tactile, zone de sécurité `env(safe-area-inset-bottom)`, boutons d'au moins 48 px et espace inférieur réservé au contenu pour éviter le masquage par la barre. Sur desktop, les règles de navigation existantes restent inchangées.
- Aucun changement à `renderTabs()`, `TABS`, `NAVCATS`, `go()`, aux identifiants, aux routes, aux rôles ou aux événements. Aucun bouton de navigation n'a été supprimé ; les entrées existantes restent accessibles par défilement horizontal. Cette première étape ne crée pas encore un menu « Plus » regroupant les rubriques.
- Cache actualisé : CSS `v138`, Service Worker `dz-de-v3.168.0.0.50`, précache synchronisé.
- Contrôles CI mis à jour : assertions des versions dans `ci/check-public-portal.mjs` et `ci/check-masar.mjs`, plus vérification de la position fixe en bas, du marqueur Lot 98 et de l'espace inférieur de sécurité.
- Fichiers modifiés : `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-public-portal.mjs`, `ci/check-masar.mjs`, présent dossier.
- Limite de validation : cette correction est une modification CSS statique ; aucune capture réelle sur téléphone ni test tactile dans navigateur n'a encore été effectué. Vérifier aussi que les éventuels boutons flottants du site ne recouvrent pas la barre sur les appareils réels.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. PR maintenue ouverte et non fusionnée ; aucun changement de `main`, d'Auth, Supabase, RLS, schéma, rôles, comptes ou paiements.


## Lot 99 — Navigation mobile compacte avec menu « Plus » (5 novembre 2026)

- Sur les écrans ≤ 900 px, la barre mobile présente quatre destinations directes — accueil, matières (ou English selon la matière active), مساري et الأستاذ الذكي — ainsi qu'un bouton « المزيد » ouvrant un panneau secondaire.
- Les entrées secondaires sont générées depuis `allTabs()` et filtrées selon les règles de visibilité existantes (messages exclus, administration uniquement pour le rôle admin). Les routes conservent `data-go` et le gestionnaire de navigation actuel.
- Le panneau se ferme après navigation, avec le bouton de fermeture, par clic extérieur ou avec Échap. Le bouton « Plus » expose `aria-expanded` et `aria-controls`. Le basculement de matière reste accessible.
- Sur ordinateur, la navigation existante est conservée dans `.desktop-nav`. Aucun changement des vues, identifiants de sections, rôles, permissions, authentification ou données.
- Cache actualisé : `app.js?v=3530`, CSS `v139`, Service Worker `dz-de-v3.168.0.0.51`. Précache synchronisé.
- Contrôles statiques ajoutés dans `ci/check-public-portal.mjs` et synchronisation des assertions de cache dans `ci/check-masar.mjs`.
- Limite : CI statique ne remplace pas un essai visuel/tactile réel sur navigateur mobile et desktop. PR #17 ouverte et non fusionnée ; aucun changement sur `main` ou Supabase.


### Complément Lot 99 — disposition ordinateur et corrections CI

- Audit CSS après encapsulation : sur les écrans ≥1024 px, la navigation existante est une barre latérale verticale. Le nouveau conteneur `.desktop-nav` reçoit explicitement cette disposition afin de ne pas transformer les liens en une rangée horizontale dans la sidebar. Entre 901 et 1023 px, les liens restent sur une rangée qui peut revenir à la ligne.
- Cache CSS porté à `v140`, Service Worker à `.52`. Le JavaScript reste à `app.js?v=3530`.
- La première CI du lot 99 a échoué sur les assertions de cache dans `ci/check-masar.mjs`. Le diagnostic des journaux a montré des expressions régulières incorrectement échappées ; elles ont été corrigées, puis les versions CSS/SW actualisées à nouveau.
- Toujours aucune validation visuelle navigateur : la CI à venir doit confirmer les contrôles automatisés uniquement.

## Lot 100 — correction du précache Service Worker (5 novembre 2026)

- Diagnostic du build Cloudflare de l'aperçu `ef441862` : les six feuilles de polices Fontsource étaient demandées en mode `no-cors`, puis ajoutées via `Cache.add()`. Les réponses opaques sont refusées par `Cache.add()`, ce qui produisait les avertissements `An opaque response cannot be added`.
- Correction : téléchargement des ressources CDN avec `fetch()`, puis mise en cache par `Cache.put()`, qui accepte les réponses opaques. L'échec éventuel du CDN reste toléré ; le chargement normal des polices par le navigateur n'est pas bloqué.
- Deuxième constat : `assets/bdd/shards_manifest.json` déclare `nb_shards: 0` et `shards: []`. Le fichier `assets/bdd/shards/shard_00.json` n'existe pas dans la branche ; sa présence dans `BDD_FILES` provoquait le 404 observé dans le build. Retrait de cette seule entrée de précache ; le manifeste et le corpus documentaire existants restent inchangés.
- Version Service Worker portée à `dz-de-v3.168.0.0.53`. Assertions de cache synchronisées dans `ci/check-public-portal.mjs` et `ci/check-masar.mjs`. Le contrôle public vérifie aussi l'absence de l'ancien shard et l'utilisation de `Cache.put()` pour les polices.
- Fichiers modifiés : `sw.js`, `ci/check-public-portal.mjs`, `ci/check-masar.mjs`, présent dossier.
- Périmètre strict : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement à `main`, aux données documentaires, à l'authentification, à Supabase, aux RLS, au schéma, aux rôles, aux comptes ou aux paiements.
- Validation en attente : le nouveau run GitHub Actions doit confirmer les contrôles statiques. Le prochain build Cloudflare devra confirmer la disparition des avertissements et du 404. Aucun rendu visuel navigateur n'est revendiqué.

## Lot 101 — masquage des formulaires de récupération sur la connexion publique (5 novembre 2026)

- Cause isolée dans `style-prototype-dz.css` : la règle `#gate.public-auth-page #passwordUpdateForm` imposait `display:grid!important`, avec une spécificité supérieure au masquage HTML `[hidden]`. Ainsi, le formulaire « تعيين كلمة مرور جديدة » pouvait apparaître dès l'ouverture de l'écran de connexion, même lorsque `public-portal.js` affectait `hidden=true`.
- Correction ciblée : ajout de sélecteurs `[hidden]` plus spécifiques pour `#passwordResetForm` et `#passwordUpdateForm`, avec `display:none!important`. Le formulaire de nouveau mot de passe reste donc masqué dans les écrans de connexion et d'inscription ; il ne s'affiche que lorsque le routage de récupération le demande explicitement.
- Garde anti-régression ajoutée à `ci/check-public-portal.mjs` pour vérifier la présence des règles de masquage prioritaires.
- Fichiers modifiés : `style-prototype-dz.css`, `ci/check-public-portal.mjs`, présent dossier.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement à `main`, au JavaScript d'authentification, à Supabase, aux comptes, mots de passe, rôles, RLS, schéma ou paiements.
- Validation : correction et garde statique ajoutées ; CI et nouveau déploiement Cloudflare à contrôler. Aucun test visuel navigateur n'est revendiqué à ce stade.

## Lot 102 — invalidation du cache CSS et robustesse d'activation du Service Worker (5 novembre 2026)

- Retour utilisateur après Lot 101 : le formulaire de nouveau mot de passe restait visible dans la prévisualisation. Analyse : le correctif CSS était bien présent dans la branche, mais l'URL CSS conservait `?v=140` dans `index.html` et dans le précache du Service Worker. Un navigateur ou un worker pouvait donc continuer à servir l'ancienne ressource.
- Correction : incrément de l'URL CSS à `style-prototype-dz.css?v=141` dans `index.html` et `sw.js`, et incrément du cache Service Worker à `.54` afin de déclencher une nouvelle installation et de nouveaux caches.
- Erreur observée : `InvalidStateError: Only the active worker can claim clients`. La seule invocation `clients.claim()` se trouve dans le gestionnaire `activate`. Elle est désormais protégée contre cette erreur de cycle de vie précise ; les autres erreurs restent propagées.
- CI : assertions mises à jour pour exiger la synchronisation de la version CSS entre HTML et précache, la version SW `.54` et la gestion de l'InvalidStateError.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement à `main`, à l'authentification, à Supabase, aux comptes, mots de passe, rôles, RLS, schéma ou paiements.
- Validation : correctifs committés ; CI et prévisualisation Cloudflare à confirmer. Aucun test visuel navigateur revendiqué.

## Complément Lot 102 — maintenance GitHub Actions

- L'avertissement Node.js 20 provenait de `actions/setup-python@v5` dans `.github/workflows/deploy.yml`. Le workflow utilise désormais `actions/setup-python@v6`, compatible avec l'environnement Node.js 24 annoncé par GitHub Actions.
- Cet avertissement était une alerte de dépréciation, pas la cause directe du formulaire de réinitialisation ni de l'exception `clients.claim()`.

### Complément Lot 102 — synchronisation du contrôle مسارك

- La première exécution après mise à jour du cache a atteint `ci/check-masar.mjs`, qui conservait encore les références historiques CSS `v=140` et Service Worker `.53`.
- Les assertions ont été synchronisées avec `style-prototype-dz.css?v=141` et le Service Worker `.54`.
- Le run précédent a donc échoué sur un contrôle CI obsolète, pas sur le code fonctionnel de مسارك. Une nouvelle validation doit confirmer ce correctif.

### Lot 103 — correction de l'itération du tiroir de navigation

- Erreur signalée dans le navigateur : `app.js?v=3530:609` — `forEach is not a function`.
- Cause confirmée : le helper `$` utilise `document.querySelector()` et renvoie un seul élément, alors que la ligne 609 appelait `.forEach()` sur le résultat d'un sélecteur CSS multiple.
- Correction : remplacement par `Array.from(document.querySelectorAll(...))`, afin de retirer la classe `open` de tous les tiroirs correspondants.
- Cache : `app.js?v=3531`, Service Worker `dz-de-v3.168.0.0.55`, précache et assertions CI synchronisés.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17. Aucun changement à `main`, aux données, à Supabase ou à l'authentification.
- Validation navigateur et déploiement Cloudflare : en attente des contrôles du dernier commit ; ne pas considérer le correctif comme vérifié en production avant ces étapes.


### Lot 104 — synchronisation du contrôle automatisé مسارك (5 novembre 2026)

- Échec CI observé dans `ci/check-masar.mjs:22` : l'assertion attendait encore `dz-de-v3.168.0.0.54`, alors que `sw.js` et son précache utilisent déjà `.55` depuis le Lot 103.
- Les assertions précédentes du contrôle مسارك (progression par unité, niveau actif, prochaine séance, compétences, grilles desktop/mobile, thème sombre et versions des ressources) avaient été franchies avant cet échec.
- Correction limitée : mise à jour de l'attente du Service Worker à `.55`. Aucun changement au code métier de `masar.js`, aux styles, aux données ou au comportement du tableau de bord.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement à `main`, à Supabase, aux rôles, aux comptes, aux paiements ou à l'authentification.
- Validation : un nouveau run GitHub Actions doit confirmer le contrôle. Cette correction de l'assertion ne constitue pas une validation visuelle du tableau de bord dans un navigateur.


### Lot 105 — déclencheur explicite du bouton « 🔐 تسجيل الدخول » (5 novembre 2026)

- Symptôme signalé après stabilisation des autres éléments : cliquer sur le bouton/onglet `🔐 تسجيل الدخول` ne provoquait aucune navigation visible.
- Analyse : le bouton `#loginTab` portait uniquement `data-gate="login"`, consommé par le gestionnaire local des onglets dans `app.js`. Contrairement au déclencheur public de navigation, il ne portait pas `data-gate-open="login"` et ne sollicitait donc pas la route `#connexion` gérée par `public-portal.js`.
- Correction ciblée : ajout de `data-gate-open="login"` au bouton `#loginTab`. Le gestionnaire public existant ouvre alors explicitement la carte d'authentification, synchronise `#connexion` et focalise le champ utilisateur. Le gestionnaire d'onglets existant reste responsable de l'affichage du formulaire ; aucune logique d'authentification n'est remplacée.
- Garde CI ajoutée : vérifier que `#loginTab` possède les deux attributs de routage attendus.
- Aucun changement à `auth.js`, à Supabase, aux rôles, aux comptes, aux paiements, à `main` ou à la configuration Cloudflare. PR #17 uniquement.
- La correction doit encore être confirmée par le nouveau run CI et par un clic réel sur la dernière prévisualisation Cloudflare ; aucune validation navigateur n'est revendiquée à ce stade.


### Lot 106 — correction de la récursion du bouton public de connexion (5 novembre 2026)

- Retour utilisateur : le bouton « تسجيل الدخول » du menu de l’accueil public ne réagissait toujours pas.
- Cause exacte : le Lot 105 avait ajouté `data-gate-open="login"` à l’onglet interne `#loginTab`. Or `setAuthPage()` appelle déjà `tab.click()` pour sélectionner cet onglet. Le clic synthétique remontait jusqu’au gestionnaire délégué de `public-portal.js`, qui rappelait immédiatement `setAuthPage()` : récursion sans fin.
- Correction : retrait de `data-gate-open="login"` de `#loginTab`. L’onglet conserve uniquement `data-gate="login"` et reste géré par `app.js`. Le bouton du menu public conserve son propre `data-gate-open="login"` et reste le seul déclencheur de la route publique `#connexion`.
- Contrôle anti-régression corrigé : vérifier séparément que le menu public possède le déclencheur de route et que l’onglet interne ne le possède pas. Cela empêche de réintroduire la récursion.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement à `main`, à l’authentification, à Supabase, aux rôles, aux comptes, aux paiements ou au schéma.
- Validation restante : exécuter CI sur le nouveau commit, obtenir le build de prévisualisation Cloudflare puis tester le clic dans le navigateur. Le correctif de code ne constitue pas à lui seul une preuve de fonctionnement en production.

### Lot 107 — retrait de la barre latérale après connexion (5 novembre 2026)

- Retour utilisateur sur la prévisualisation `8322ab5a` : après connexion, la route `#masar` s'ouvre, mais toutes les rubriques apparaissent dans une longue colonne latérale à droite.
- Cause CSS identifiée : une règle ancienne du Lot 99 réimposait, à partir de 1024 px, `flex-direction: column` sur `.desktop-nav`, tandis qu'une ancienne règle de prototype réservait 288 px à une sidebar. Ces règles tardives contredisaient la direction NAV V2 (« navigation intégrée au header, sans sidebar ni barre basse »).
- Correction limitée à `style-prototype-dz.css` : à partir de 901 px, neutraliser le padding latéral réservé à la sidebar et rétablir une navigation horizontale intégrée à l'en-tête, avec retour à la ligne si nécessaire. Les boutons, `data-go`, routes et fonctions restent inchangés.
- Cache : feuille CSS passée de v141 à v142 ; service worker passé de `dz-de-v3.168.0.0.55` à `dz-de-v3.169.0.0.55`, avec le nouveau CSS dans le précache.
- Aucun changement à l'authentification, Supabase, RLS, comptes, rôles, paiements ou données. Branche `design/prototypes-67-74-alignment` / PR #17 uniquement ; `main` n'est pas modifiée.
- Validation restant à effectuer : CI sur le nouveau HEAD, déploiement de prévisualisation Cloudflare correspondant au HEAD, puis vérification visuelle réelle sur ordinateur et mobile. Le lien précédent `8322ab5a` ne doit pas être considéré comme contenant ce correctif tant qu'un nouveau build correspondant n'est pas confirmé.


### Lot 108 — réalignement du contrôle CI sur la navigation v142 (5 novembre 2026)

- Audit du HEAD de la branche après le Lot 107 : la règle CSS de fin de fichier rétablit bien, à partir de 901 px, `.desktop-nav` en ligne et retire le padding réservé à l'ancienne sidebar. Le HTML et le Service Worker référencent bien `style-prototype-dz.css?v=142` et `dz-de-v3.169.0.0.55`.
- L'audit a révélé que `ci/check-public-portal.mjs` conservait des attentes du Lot 99 : cache CSS v141 / Service Worker v3.168 et disposition desktop verticale. Ces assertions contredisaient le Lot 107 et pouvaient faire échouer CI même lorsque la nouvelle règle CSS était présente.
- Correction du contrôle CI : références attendues mises à jour vers CSS v142 / SW v3.169 ; le test desktop vérifie désormais NAV V2 et la navigation horizontale, tandis que les contrôles de navigation mobile compacte restent présents.
- Commit du contrôle CI : `f5e908e`.
- Validation : attendre le workflow associé à ce nouveau commit et contrôler ses logs. Aucun build Cloudflare ni test navigateur ordinateur/mobile n'est encore revendiqué.
- Périmètre inchangé : PR #17 / branche `design/prototypes-67-74-alignment` uniquement ; aucun changement sur `main`, Auth, Supabase, RLS, schéma, rôles, paiements ou données.


### Lot 109 — synchronisation du contrôle CI de مسارك avec CSS v142 (5 novembre 2026)

- Analyse du workflow `42120837164`, job `127572451118` : le contrôle `ci/check-public-portal.mjs` passe, y compris ses assertions de navigation sans sidebar.
- L'étape suivante échoue dans `ci/check-masar.mjs:20` avec `AssertionError: cache CSS non actualisé`. La cause est une référence restée à `style-prototype-dz.css?v=141` et à Service Worker `dz-de-v3.168.0.0.55`, alors que `index.html` et `sw.js` référencent CSS v142 et SW v3.169.0.0.55.
- Vérification croisée des fichiers : HTML et précache SW concordent sur CSS v142, `masar.js?v=3516` et `app.js?v=3531`. Le contrôle de مسارك a été mis à jour vers CSS v142 et SW v3.169 ; les attentes JS inchangées sont conservées.
- Commit du contrôle : `84cdaa6ec93e59c21d6e7b2e3cecb385d6f414e3`.
- Validation à suivre : nouveau workflow sur ce commit. Aucun succès CI final, déploiement Cloudflare ou test visuel navigateur n'est revendiqué à ce stade.
- Périmètre : branche `design/prototypes-67-74-alignment` uniquement ; PR #17 non fusionnée ; `main` intacte. Aucun changement Auth, Supabase, RLS, schéma ou données.


## Lot 110 — correction du contrôle de précache CSS de « مسارك » (5 novembre 2026)

- Le workflow GitHub Actions `42121353028`, job `127574248516` (« Validation structurelle & pédagogique »), échouait à l'étape « Contrôler le tableau de bord مسارك ».
- Le diagnostic des logs localise l'échec dans `ci/check-masar.mjs:23` : le message annonçait « précache CSS v142 », mais l'expression régulière contrôlait encore `style-prototype-dz.css?v=141`.
- La lecture croisée des fichiers de la branche `design/prototypes-67-74-alignment` confirme que `index.html` référence `style-prototype-dz.css?v=142` et que `sw.js` précache bien `./style-prototype-dz.css?v=142`, avec le service worker `dz-de-v3.169.0.0.55`.
- Correction ciblée : l'assertion de `ci/check-masar.mjs` attend désormais `v=142`. Aucun fichier applicatif, CSS, service worker, authentification ou donnée n'a été modifié dans ce lot.
- Commit correctif : `26e60ca3b123e95aca4730515e6250040b30ac01`.
- À ce stade, le correctif est commité sur la branche de la PR #17 ; le succès d'un nouveau workflow n'est pas encore établi. Ne pas déclarer la CI verte avant lecture de son résultat.
- PR #17 reste ouverte, non fusionnée et ciblée sur `main`. Aucun changement direct sur `main`, aucune publication Cloudflare ni validation visuelle navigateur ne sont revendiqués.


---

## Lot 111 — navigation hiérarchique par catégories et sous-menus

**Objectif :** éviter d'afficher toutes les rubriques de l'espace étudiant simultanément. La navigation desktop est désormais organisée comme un explorateur : quelques entrées principales et des catégories compactes ouvrant leurs sous-rubriques au survol, au focus clavier ou au clic.

**Implémentation sur la branche `design/prototypes-67-74-alignment` :**
- `app.js` : rendu desktop à partir de catégories thématiques (الدراسة، التدريب والتقييم، الموارد التعليمية، التواصل والتفاعل، فضاء الأستاذ، فضاء الأولياء، المتابعة والمشاريع، الخدمات والاشتراك، الحساب والقانون). Chaque sous-rubrique conserve son `data-go` existant ; aucune route ni vue n'est renommée.
- `style-prototype-dz.css` : sous-menus flottants RTL, ouverture au survol et au focus clavier, état actif visible, styles clair/sombre.
- `index.html` : références de cache portées à `app.js?v=3532` et `style-prototype-dz.css?v=143`.
- `sw.js` : précache synchronisé, version `dz-de-v3.170.0.0.55`.
- CI : contrôles du rendu hiérarchique, du survol/focus et des versions de cache actualisés dans `ci/check-public-portal.mjs` et `ci/check-masar.mjs`.

**Limites et vérifications :** le menu mobile conserve son panneau « المزيد » existant ; le survol desktop n'est pas utilisé sur écran tactile. Les tests CI n'ont pas encore été exécutés pour ce lot. Le rendu réel après connexion devra être confirmé sur l'aperçu Cloudflare desktop et mobile. PR #17 reste ouverte et non fusionnée ; `main` et la production ne sont pas modifiés par ce lot.


## Lot 112 — synchronisation du contrôle CI du Service Worker

Le workflow `42126923374` a échoué dans `ci/check-public-portal.mjs` (ligne 233) : le contrôle vérifiait encore `dz-de-v3.169.0.0.55`, alors que `sw.js` est passé à `dz-de-v3.170.0.0.55` avec le Lot 111. Les références CSS v143 et app.js v3532 étaient déjà cohérentes. Le contrôle CI a été aligné sur la version réelle du Service Worker ; aucune logique applicative supplémentaire n'a été modifiée dans ce correctif. Le workflow suivant doit confirmer le résultat. PR #17 reste ouverte/non fusionnée ; `main` et la production restent hors périmètre.

**Résultat du workflow 42133392051 :** terminé avec succès. Les étapes `Vérifier le portail public`, `Contrôler le tableau de bord مسارك`, `Garde d'accès + TEST DE FUITE`, `Matrice des parcours`, `Test de régression 3 niveaux` et `Contrôle pédagogique restructuré` sont toutes en succès. La correction de version du Service Worker a donc levé l'échec du workflow précédent. Cela valide les contrôles automatisés, pas encore l'affichage visuel réel dans le navigateur ni la disponibilité d'un nouveau déploiement Cloudflare.


## Lot 113 — correction de superposition des sous-menus desktop (6 novembre 2026)

- Retour utilisateur : les sous-rubriques du menu hiérarchique apparaissaient derrière l’ancienne zone latérale et restaient donc illisibles.
- Cause identifiée dans la cascade CSS : une règle tardive V8.5 ramenait `#shell .topbar` à `z-index:100` avec `isolation:isolate`. Le tiroir latéral historique conservait `z-index:700`. Le `z-index:500` du sous-menu, même augmenté à l’intérieur de `#tabs`, ne pouvait pas dépasser le contexte d’empilement parent du header.
- Correction desktop ciblée (≥901 px) : le header repasse à `z-index:1800`, la navigation à 1801, son conteneur à 1802, la catégorie ouverte à 1803 et le panneau déroulant à 1804. Le header garde `overflow:visible`. Le menu mobile et le tiroir mobile ne sont pas modifiés.
- Cache : CSS v144 ; Service Worker `dz-de-v3.171.0.0.55`, précache actualisé. Le JavaScript et les routes `data-go` restent inchangés.
- CI : assertions du portail public renforcées pour contrôler le marqueur Lot 113 et les niveaux d’empilement ; contrôle de cache de مسارك synchronisé.
- Fichiers modifiés : `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-public-portal.mjs`, `ci/check-masar.mjs`, présent dossier.
- Périmètre : branche `design/prototypes-67-74-alignment` / PR #17 uniquement. Aucun changement sur `main`, aux routes, à l’authentification, à Supabase, RLS, schéma, paiements ou données.
- Limite de validation : le correctif CSS et les garde-fous CI sont committés ; attendre le workflow GitHub et le build Cloudflare correspondant. Le rendu visuel réel desktop/mobile n’est pas encore revendiqué.

## Lot 114 — fiabilisation de l’assertion CI Lot 113 (6 novembre 2026)

- Le workflow 42135039889 a échoué à l’étape « Vérifier le portail public » : l’apostrophe droite dans `l'ancien` était incluse dans une chaîne JavaScript délimitée par apostrophes simples, provoquant une erreur de syntaxe avant l’exécution des assertions.
- Correction : l’assertion du marqueur CSS Lot 113 utilise désormais des chaînes délimitées par guillemets doubles, compatibles avec l’apostrophe du texte attendu.
- Le commit correctif est `0be2eb3f14b7bcee6b062a34977bba2a32dcb0cd`, sur `design/prototypes-67-74-alignment`. Le prochain workflow doit confirmer la réussite ; aucun résultat CI n’est présumé.
- Les validations précédant l’étape du portail dans le workflow 42135039889 ont réussi ; les contrôles ultérieurs ont été ignorés après cet échec.
- Aucun changement de code applicatif, de CSS, de routes, d’authentification ou de données dans ce lot. PR #17 maintenue ouverte, aucune fusion et aucun changement de `main`.
- Le rendu navigateur et le déploiement Cloudflare du nouveau commit restent à vérifier séparément.

## Lot 115 — alignement exact du marqueur CSS dans le test (6 novembre 2026)

- Le workflow 42135133777 a dépassé l’erreur de syntaxe JavaScript, mais le test du portail public a échoué sur l’assertion du marqueur Lot 113.
- Cause : le test contenait l’apostrophe typographique `’` alors que le commentaire CSS réel utilise l’apostrophe ASCII `'`. Les niveaux z-index attendus sont présents dans le CSS ; c’était la comparaison du marqueur qui échouait.
- Correction : l’assertion est maintenant délimitée par guillemets doubles et reprend exactement l’apostrophe ASCII du commentaire CSS.
- Commit : `aed6d350371fa6e86ca7a945e4ac25f141b6efe0`, branche `design/prototypes-67-74-alignment`.
- Aucun changement applicatif ni CSS dans ce lot ; test seulement. Attendre le nouveau workflow pour conclure.
- PR #17 reste ouverte/non fusionnée ; `main` non modifiée. Déploiement Cloudflare et contrôle navigateur restent à confirmer.


## Lot 116 — correction de découpage des sous-menus desktop
- Retour utilisateur : les sous-menus restent coupés à la limite du conteneur de navigation malgré le relèvement des z-index du lot 113.
- Cause confirmée dans la cascade CSS : le thème clair V8.5 applique `overflow-x:auto!important` à `#shell #tabs.tabs` et `overflow-y:visible!important`. Selon les règles CSS de calcul des axes overflow, la valeur verticale visible devient auto lorsque l'axe horizontal est auto ; le sous-menu est donc découpé par son conteneur. Le relèvement des z-index ne peut pas contourner ce découpage.
- Correction ciblée : sur desktop uniquement (≥901 px), surcharger avec une spécificité supérieure les deux axes en `overflow:visible!important` pour la barre de navigation et ses conteneurs immédiats. Le comportement mobile reste inchangé.
- Cache : CSS `style-prototype-dz.css?v=145` dans `index.html` et le précache ; service worker `dz-de-v3.172.0.0.55`.
- Contrôles CI : ajout d'une assertion vérifiant le marqueur du lot 116 et les deux axes overflow visibles ; synchronisation des références CSS/SW dans les contrôles du portail et de مسارك.
- Aucun changement de JavaScript, DOM fonctionnel, identifiant, route `data-go`, gestionnaire, authentification, Supabase, RLS, schéma, migration ou paiement. PR #17 reste ouverte et non fusionnée ; `main` n'est pas modifiée.


## Lot 117 — simplification du menu en six espaces (6 novembre 2026)

- Retour utilisateur : le menu restait trop long pour une plateforme pédagogique professionnelle ; plusieurs intitulés représentaient des fonctions voisines ou des sous-rubriques qui n'avaient pas besoin d'être des catégories principales.
- Décision UX : réduire les catégories desktop de neuf à six, sans supprimer de destination ni de fonctionnalité :
  1. **التعلّم** : séances, grammaire, guide, bibliothèque, corpus, résumés, méthodologie, livre scolaire, banque d'exercices et fichiers.
  2. **التدريب والاختبارات** : révision, quiz, devoirs, sujets officiels, simulations et examens.
  3. **القسم والتواصل** : classe, salle directe et questions à l'assistant.
  4. **فضاءات التأطير** : professeur, tableau de bord enseignant (lorsqu'il est fourni par le rôle existant) et espace parents.
  5. **التقدم الدراسي** : statistiques et projet scolaire.
  6. **الخدمات والحساب** : réservation, abonnement, compte, informations légales et administration (toujours filtrée par le contrôle de rôle existant).
- Les trois accès rapides restent visibles : accueil, matières (ou langue active) et مسارك. Sur mobile, les quatre accès rapides et le panneau « المزيد » restent inchangés.
- Tous les identifiants de destination data-go sont conservés. Aucun module, vue, route, libellé de page, contenu pédagogique ou fonction métier n'est supprimé ; seule l'affectation aux six catégories a été réorganisée.
- Fichiers modifiés : app.js, index.html, sw.js, ci/check-public-portal.mjs, ci/check-masar.mjs et ce dossier.
- Cache : app.js?v=3533 ; CSS inchangé à style-prototype-dz.css?v=145 ; Service Worker dz-de-v3.173.0.0.55. Le précache et les contrôles de cache ont été synchronisés.
- Garde CI ajoutée : exactement six catégories, présence des six intitulés et vérification que chaque ancienne destination reste classée. La vérification existante des sous-menus, du clavier, du survol et du débordement Lot 116 est conservée.
- Aucun changement de CSS, de DOM des vues, d'authentification, de rôles, de Supabase, RLS, schéma, migration, abonnement/paiement ou données. PR #17 reste ouverte et non fusionnée ; main n'est pas modifiée.
- Validation restante : attendre le résultat du workflow GitHub déclenché par le dernier commit, puis vérifier le rendu sur l'aperçu Cloudflare correspondant au nouveau HEAD. La simplification du code est committée ; elle n'est pas encore déclarée visuellement validée par l'utilisateur.


### Complément Lot 117 — raccourci de sponsoring retiré du menu général

- Vérification du commentaire historique UI-6 : la gestion du sponsoring doit être accessible depuis l'administration, et non comme rubrique générale de navigation.
- Le filtre de navigation exclut désormais la destination sponsor du rendu desktop et du panneau mobile « المزيد ». La vue et sa route ne sont pas supprimées ; les accès directs déjà utilisés restent possibles.
- Le contrôle CI vérifie que cette destination ne réapparaît pas dans le menu général. Aucun changement au contrôle d'accès administratif ni au module de sponsoring.


### Complément Lot 117 — correction du contrôle CI de version SW

- Le workflow 42137467159 a échoué au contrôle du portail public, après réussite des validations précédentes, car une assertion de ce contrôle attendait encore Service Worker v3.172 alors que le précache était passé à v3.173.
- Diagnostic confirmé dans les logs : le code du portail et les fichiers de cache étaient synchronisés ; c'est l'assertion de version du test qui était restée obsolète.
- Assertion corrigée vers dz-de-v3.173.0.0.55. Le run 42137467159 porte sur un état antérieur de la branche et son échec ne valide ni n'invalide le dernier HEAD ; un nouveau workflow doit confirmer la correction.


## Lot 118 — menu mobile organisé comme le menu desktop (6 novembre 2026)

- Constat : après Lot 117, le menu desktop était organisé en six espaces, mais le panneau mobile « المزيد » conservait encore une longue grille plate de liens. L'expérience n'était donc pas cohérente entre les formats.
- Correction : le panneau mobile réutilise désormais les six catégories NAVCATS comme accordéons repliables ; les destinations apparaissent à l'intérieur de leur espace. L'espace actif est automatiquement ouvert à l'affichage du panneau.
- Le raccourci de changement de matière reste au-dessus des catégories ; les quatre accès rapides en bas (accueil, matières, مساري, الأستاذ الذكي) sont conservés.
- Les routes non classées qui pourraient être ajoutées ultérieurement restent accessibles dans une section de secours « أقسام أخرى » ; elles ne sont pas perdues silencieusement.
- CSS mobile ajouté sans modifier les règles desktop ni le correctif de débordement des sous-menus Lot 116. Aucun changement des destinations, des handlers, des vues, de l'authentification, des rôles, de Supabase, des données ou des paiements.
- Fichiers modifiés : app.js, style-prototype-dz.css, index.html, sw.js, ci/check-public-portal.mjs, ci/check-masar.mjs et ce dossier.
- Cache : app.js?v=3534 ; style-prototype-dz.css?v=146 ; Service Worker dz-de-v3.174.0.0.55.
- Garde CI ajoutée pour vérifier la présence des accordéons mobiles et de leurs styles ; contrôles de synchronisation des caches actualisés.
- PR #17 reste ouverte et non fusionnée ; main non modifiée. Validation CI du Lot 118 et contrôle visuel mobile sur l'aperçu Cloudflare restent à confirmer.


## Lot 119 — retrait complet des statistiques nationales et de la rubrique « التقدم الدراسي » (6 novembre 2026)

- Demande utilisateur : supprimer complètement l'espace de navigation « التقدم الدراسي » et la vue « الإحصائيات الوطنية » (carte des 58 wilayas, distribution, évolution temporelle, difficulté, baccalauréat et tableau national).
- Navigation : retrait de la destination stats de VIEWS/TABS/NAVCATS et retrait de la catégorie « التقدم الدراسي » ; le menu hiérarchique comporte désormais cinq espaces. La destination « مشروعي الدراسي » reste classée dans « التعلّم » et conserve sa vue projet.
- Vue : suppression de la section HTML data-view=stats, de l'appel de rendu dans app.js, de la balise stats.js et de son entrée dans le précache du Service Worker. Le fichier stats.js sera supprimé après vérification de ses dépendances.
- La progression individuelle de l'élève, « مسارك », les indicateurs personnels de l'accueil et le suivi des séances ne sont pas supprimés. Les fichiers de données documentaires/géographiques ne sont pas effacés à l'aveugle : ils peuvent être partagés avec la bibliothèque ou d'autres corpus.
- Cache app.js : v3535 ; Service Worker : dz-de-v3.175.0.0.55. Le CSS n'a pas été modifié.
- Garde CI ajoutée : absence de l'ancienne route, de la vue HTML et du module précaché ; cinq espaces de navigation attendus.
- PR #17 reste ouverte et non fusionnée ; main n'est pas modifiée. Le workflow et le rendu visuel du portail restent à valider après ce lot.


### Complément Lot 119 — retrait de l'ancienne exigence CI

- Le premier run après suppression du module a échoué dès le contrôle des fichiers requis, car .github/workflows/deploy.yml listait encore stats.js comme fichier obligatoire et comme fichier à analyser par Esprima.
- Cette référence obsolète a été retirée du workflow ; le module stats.js n'est plus livré ni attendu par la CI. Les contrôles des données documentaires/géographiques restent en place, sans charger l'ancienne interface nationale.
- Un nouveau run sur le HEAD corrigé doit confirmer l'ensemble des contrôles.


### Complément Lot 119 — synchronisation des assertions de cache (6 novembre 2026)

- Le workflow 42139626522 a échoué dans `ci/check-public-portal.mjs`, non sur la suppression de la vue nationale : les contrôles de navigation, de retrait de `stats.js`, des unités et du portail public avaient passé jusque-là.
- Cause exacte : après le retrait de la vue, `index.html` et `sw.js` chargent `app.js?v=3535`, mais deux contrôles CI attendaient encore `app.js?v=3534` (dans `check-public-portal.mjs` et `check-masar.mjs`). Des messages de diagnostic affichaient aussi d'anciennes versions de cache.
- Assertions mises à jour vers app.js v3535 ; messages de version CSS corrigés vers v146. Le code applicatif, les données et les règles d'accès ne sont pas modifiés par ce correctif.
- Un nouveau workflow doit confirmer les contrôles. Aucun merge, aucune modification de `main`, aucune publication Cloudflare revendiquée.


### Complément Lot 120 — correction du contrôle Service Worker (6 novembre 2026)

- Après le correctif app.js v3535, le workflow 42139982984 a échoué sur une seconde assertion obsolète : `ci/check-masar.mjs` attendait encore `dz-de-v3.174.0.0.55`, alors que `index.html` et `sw.js` sont à `dz-de-v3.175.0.0.55`.
- Assertion et message de diagnostic actualisés vers v3.175. La vue nationale et le module `stats.js` restent exclus du chargement ; aucune logique métier ni donnée n'a été modifiée.
- Attendre le prochain résultat CI pour conclure. PR #17 reste ouverte et non fusionnée ; `main` n'est pas modifiée.


### Complément Lot 120 — rectification de la référence CI réellement présente (6 novembre 2026)

- Le workflow 42140544658 a confirmé que le contrôle « مسارك » échouait encore : la branche contenait toujours dans `ci/check-masar.mjs` l'expression attendue `dz-de-v3.174.0.0.55`, malgré la note précédente qui indiquait sa correction.
- Vérification croisée : `sw.js` et le précache de la branche sont bien à `dz-de-v3.175.0.0.55`; la référence erronée était uniquement dans le test CI.
- Correction effective cette fois : assertion de `ci/check-masar.mjs` portée à `dz-de-v3.175.0.0.55`.
- Commit : `bc380cedbe3f12d6f1498e747369a5c220fcbda9`. Le nouveau workflow doit encore confirmer le résultat.
- Aucun fichier applicatif, aucune progression individuelle, aucune route, aucun contenu national de données et aucune configuration Auth/Supabase/RLS n'ont été modifiés dans ce correctif. PR #17 reste ouverte et non fusionnée ; `main` reste intacte.


### Lot 121 — CI validée et audit du retrait des statistiques nationales (6 novembre 2026)

- Workflow PR #17 #2205 (`42141218371`) : job « Validation structurelle & pédagogique » terminé avec succès ; les 28 étapes exécutées sont vertes, dont le contrôle du portail public et le contrôle `مسارك`.
- La référence de cache du Service Worker dans `ci/check-masar.mjs` est désormais cohérente avec `dz-de-v3.175.0.0.55`.
- Audit textuel ciblé de `app.js`, `public-portal.js`, `style-prototype-dz.css` et `style.css` : aucune occurrence des libellés de statistiques nationales ni de « التقدم الدراسي ». `stats.js` est retiré du chargement et du précache. Dans `index.html`, `statsHome` reste le conteneur d'indicateurs personnels de l'accueil ; `masar.js` continue de calculer la progression individuelle à partir des séances et des cartes mémoire.
- Les fichiers de données géographiques nationaux et leurs validations restent présents : ils ne sont pas supprimés à l'aveugle, car le dépôt les utilise encore dans des validations et contenus pédagogiques. Leur conservation ne réintroduit pas la vue nationale dans la navigation ou le portail.
- Point important de publication : inspection de `.github/workflows/deploy.yml` sur la branche : le workflow ne déclare qu'un job `validate`. Il n'existe pas de job de déploiement Cloudflare dans ce fichier. Le texte informatif qui évoque un build automatique Cloudflare n'est pas une étape de déploiement. Par conséquent, le succès CI ne signifie pas que le site public a été publié.
- PR #17 : ouverte, non fusionnée, mergeable ; base `main` ; dernier HEAD `f425b13b5371559a020206065f9d849f3ce831d4`. Aucune modification directe de `main`, aucune fusion et aucune publication ne sont effectuées dans ce lot.
- Validation visuelle navigateur desktop/mobile et validation du site public restent à réaliser après publication autorisée.

## Lot 122 — fiabilisation du contrôle T1 du workflow (6 novembre 2026)

- Audit du contrôle T1 dans `.github/workflows/deploy.yml` : l'ancien test cherchait les chaînes `actions/checkout@v4`, `actions/deploy-pages@v4` et `github-pages` dans le fichier workflow lui-même. Ces chaînes étaient présentes dans le script de test embarqué, ce qui rendait le contrôle auto-référentiel et ne prouvait pas l'existence d'une publication.
- Correction sur la branche `design/prototypes-67-74-alignment`, commit `470ceb356ab9ff78470f16a5a36fd0c67132e842` : T1 contrôle maintenant la présence du job `validate`, les actions réellement utilisées `actions/checkout@v5` et `actions/setup-python@v6`, et l'absence d'un job `deploy`. Le libellé indique explicitement que ce contrôle valide la CI et ne revendique pas un déploiement.
- Aucun job Cloudflare/Wrangler n'a été ajouté : aucun mécanisme de déploiement autorisé/configuré n'a été établi par les éléments consultés. Le message informatif du workflow sur OAuth Cloudflare ne constitue pas une preuve de publication.
- Cette correction ne modifie ni `main`, ni Auth/Supabase/RLS, ni les données pédagogiques. PR #17 reste ouverte et non fusionnée.
- CI du commit de correction : à vérifier après déclenchement. Aucune validation visuelle du portail public n'est revendiquée.


## Lot 123 — correction de syntaxe du test T1 (6 novembre 2026)
- La CI #2208 (run 42141852023, HEAD précédent 57a85047) a échoué à l'étape « Rejouer la suite de build T1-T6 du professeur ».
- Le journal montre une erreur Python de syntaxe : la chaîne regex T1 était coupée après `r'^jobs:\\s*`, avec une nouvelle ligne littérale insérée dans la chaîne. Ce n'était pas un échec fonctionnel des contrôles pédagogiques T2-T6 : le script s'est arrêté avant leur affichage.
- Correction sur la branche de la PR uniquement : T1 utilise désormais `splitlines()` et vérifie les lignes exactes `jobs:` et `  validate:`, les actions checkout@v5 et setup-python@v6, ainsi que l'absence d'un job `  deploy:`.
- Aucun job de déploiement Cloudflare n'a été ajouté ni revendiqué. Aucun changement sur `main`, Auth, Supabase, RLS, schéma ou paiements.
- Commit correctif workflow : 68af3bc7cd2be73c33969c6b1f74209d4f38c853. Nouvelle exécution CI à attendre avant de conclure.
- La PR #17 reste ouverte et non fusionnée. Aucune validation visuelle réelle ordinateur/mobile ni publication Cloudflare n'est revendiquée.


## Lot 124 — suppression des blocs dupliqués après Information (6 novembre 2026)
- CI #2210 (run 42142065788) : la suite T1-T6 passe bien à 6/6 après la correction du lot 123.
- Le job échouait ensuite dans l'étape « Information » : le workflow contenait quatre occurrences de plusieurs blocs de validation après la première étape Information. Du code Python résiduel était ainsi interprété par Bash, d'où `syntax error near unexpected token ')'`.
- Nettoyage limité à `.github/workflows/deploy.yml` : conservation de la séquence unique des validations et du seul bloc Information, suppression du contenu dupliqué situé après celui-ci. Le workflow passe de 1931 lignes avant nettoyage à 1204 lignes après la correction T1 et le nettoyage dupliqué.
- Aucun test pédagogique, fichier applicatif, contenu de cours, Auth, Supabase, RLS, schéma ou paiement n'a été modifié dans ce lot. Aucun job Cloudflare n'a été ajouté ; le texte Information n'est pas une preuve de déploiement.
- Commit de nettoyage workflow : 1e9defc4689a0b85d508f82079b5c124151af103. Le présent dossier doit être validé par une nouvelle CI.
- PR #17 reste ouverte et non fusionnée ; aucune publication Cloudflare ni validation visuelle ordinateur/mobile n'est revendiquée.
## Lot 126 — purge des styles orphelins de la vue nationale (6 novembre 2026)

- Audit après le retrait fonctionnel du lot 119 : la navigation NAVCATS comporte cinq espaces, VIEWS/TABS n’exposent plus stats, index.html ne contient plus de section data-view=stats et le fichier stats.js n’est plus présent dans la branche.
- Reliquat découvert : style-prototype-dz.css contenait encore les styles de #statsBody, de la carte SVG nationale, des classements .wrow, des infobulles .st-tip et plusieurs règles ciblant section[data-view=stats].
- Nettoyage limité à ces règles CSS orphelines et à leurs commentaires. Aucun style générique .wlist/.wrow utilisé ailleurs, aucune carte de couverture de l’administration, aucune donnée géographique et aucun contenu documentaire n’ont été supprimés.
- Préservation vérifiée dans le code : index.html conserve #statsHome, app.js conserve renderStats() pour les indicateurs personnels de l’accueil, et masar.js reste intact pour le suivi individuel.
- Garde CI renforcée dans ci/check-public-portal.mjs : échec si des sélecteurs section[data-view=stats] ou #statsBody subsistent dans le CSS ; échec également si #statsHome ou son rendu personnel disparaît.
- Cache du CSS incrémenté de v146 à v147 dans index.html et sw.js, avec synchronisation des attentes dans ci/check-public-portal.mjs et ci/check-masar.mjs. Le contrôle de géographie dans le workflow vérifie les données de référence, sans annoncer une carte nationale ni ses onglets/heatmap.
- Commit CSS principal : 00725fa52648053153bee48672eb68d1eb283a2f. Commits suivants : commentaire CSS f290f59a0c3269d30da7d0f88cce33b5a9765947, assertions CI bbc37d8aac939cb80569a8f0264f679c84843574, cache HTML/SW/tests jusqu’au HEAD 9a9305f83a74d56fb1f6cbcef47a3876905ad16a.
- CI de ce HEAD à attendre. PR #17 reste ouverte et non fusionnée ; aucune modification directe de main, aucun déploiement Cloudflare ni validation visuelle du site public ne sont revendiqués.


## Lot 128 — CI #2220 et clarification du contrôle géographique (6 novembre 2026)
- CI #2220 (run 42188766246) réussie sur le commit `1e46241b77037eaa6cd07d40df8b5d82fa2159c5` : job de validation terminé sans échec.
- Contrôle du code : la navigation ne contient plus `التقدم الدراسي`; `index.html` ne contient plus la vue nationale; le code applicatif ne référence plus la route `'stats'`; `statsHome` et `renderStats()` restent présents pour les indicateurs personnels; `masar.js` reste précaché.
- `ci/check-public-portal.mjs` conserve des chaînes relatives à l'ancienne rubrique uniquement pour détecter une régression; ce ne sont pas des liens de navigation ni des fonctionnalités exposées.
- Le référentiel `wilayas_geo.json` reste utilisé et vérifié comme donnée géographique. Renommage de l'étape CI pour ne plus la présenter comme une validation de statistiques nationales.
- Aucun changement de `main`, aucune fusion, aucun déploiement Cloudflare ni contrôle visuel public revendiqué.

## Lot 129 — retrait des statistiques nationales résiduelles dans les archives (2026-11-06)

- Audit du commit précédent : la rubrique nationale avait disparu de la navigation, mais les cartes d'années de l'archive du BAC affichaient encore les candidats, la moyenne et le taux de réussite nationaux ; les devoirs officiels exposaient un taux agrégé ainsi que des compteurs globaux.
- Suppression de ces métriques dans les rendus examen.js et officiels.js, puis retrait des champs statistiques correspondants des données assets/bdd/bac_archive.json et assets/bdd/devoirs_officiels.json.
- Le workflow de validation ne demande plus le bloc stats national pour les sujets d'archive. Les sujets, corrigés, années, thèmes, wilayas comme métadonnées pédagogiques et filtres d'examen restent conservés.
- Les indicateurs individuels restent en place : tentatives, note personnelle, niveau de préparation et nombre de réponses de l'élève. La progression مسارك et statsHome restent intacts.
- Ajout de contrôles CI qui vérifient l'absence des métriques nationales dans les rendus et fichiers JSON, et la présence des indicateurs personnels.
- Aucun changement Supabase/Auth/RLS/paiement, aucune modification de main, aucune fusion ni déploiement Cloudflare revendiqué.

## Lot 130 — alignement du contrôle CI des devoirs officiels (2026-11-06)

- Le premier CI du lot 129 a signalé un contrôle historique dans deploy.yml qui exigeait encore les champs stats.vues, stats.telechargements et stats.reussite_pct sur les 10 devoirs de schéma officiel_v1.
- Le contrôle a été ajusté : il continue de vérifier les identifiants, les sources, les structures d'épreuves, les barèmes et les corrigés, mais ne réclame plus de bloc stats agrégé supprimé du jeu de données.
- Échec du CI 2224 expliqué et corrigé à la source ; une nouvelle exécution est nécessaire pour valider l'ensemble du lot.
- Aucun changement de main, aucune fusion et aucun déploiement Cloudflare revendiqué.

## Lot 131 — correction de la dernière assertion CI résiduelle (2026-11-06)

- Le CI #2226 a échoué avec `KeyError: 'stats'` dans le contrôle Python des devoirs officiels : une seconde assertion, distincte de celle corrigée au lot 130, exigeait encore les champs vues, telechargements et reussite_pct.
- Suppression de ce dernier bloc de validation devenu obsolète. Les contrôles des 10 devoirs officiels, des structures, barèmes 8+8+4, corrigés, wilayas et unités restent inchangés.
- Le retrait des statistiques agrégées est conservé ; les notes et réponses individuelles ne sont pas touchées.
- Relancer et vérifier le CI sur le nouveau commit avant de déclarer le lot validé. PR toujours non fusionnée ; aucune modification de main ni déploiement Cloudflare revendiqué.

## Lot 138 — création d’un tableau de bord étudiant indépendant (7 novembre 2026)

- Clarification fonctionnelle : la vue existante `فضائي الدراسي` (`data-view="accueil"`) reste distincte et n'est pas remplacée. Le nouveau tableau de bord est une vue dédiée `data-view="dashboard"`, accessible par l'onglet `🎓 لوحة التلميذ`.
- Reprise de la structure des deux prototypes HTML conservés dans la Library : bandeau personnel, raccourcis, parcours et prochaine leçon, cartes de matière, activité hebdomadaire, professeur IA, recommandation et zone de notifications.
- Adaptation au produit réel : identité et niveau issus de la session, progression calculée sur les séances réellement enregistrées, prochaine séance issue de `prochaineSeance()`, XP/série issus de `DZ_GAMIFICATION`, révisions issues de `MEMOIRE.dues()`, notifications non lues issues de `DZ_INTERACTIONS`.
- Les valeurs de démonstration des prototypes (nom « Ahmed », pourcentages par matière, objectifs, nombres de messages et scores) ne sont pas reprises. Le tableau affiche uniquement les données disponibles ; le graphique hebdomadaire indique les jours d'activité enregistrés, sans inventer de minutes d'étude.
- L'accès à l'onglet et à la route est limité aux comptes élèves ; les rôles professeur, parent et administrateur ne reçoivent pas cette vue. Aucun changement de schéma, Supabase, Auth, RLS, paiement ou permission serveur.
- Fichiers applicatifs : `index.html`, `app.js`, `style-prototype-dz.css`, `sw.js`. Cache : CSS v161, app.js v3541, Service Worker `dz-de-v3.185.0.0.75`.
- Contrôles CI renforcés dans `ci/check-gamification.mjs` pour la présence de la vue autonome, son rendu, sa route et sa restriction de rôle ; références de cache synchronisées dans les contrôles `check-masar` et `check-public-portal`.
- Correction de périmètre après revue : retrait de `studentFocus`, `studentContinue`, `renderStudentFocus()` et de leurs styles du DOM/CSS/JS de `فضائي الدراسي`. Les blocs de reprise et raccourcis ajoutés à l'accueil sont annulés ; la vue `dashboard` autonome conserve ses propres composants et son propre rendu.
- Les assertions CI vérifient désormais aussi l'absence de ces anciennes injections dans `accueil`. Cache après retrait : CSS v162, app.js v3542, Service Worker `dz-de-v3.185.0.0.76`.
- La CI #2399 (run 42401434155) a validé le tableau de bord autonome avant le nettoyage de l'accueil. La validation finale du périmètre complet est enregistrée ci-dessous.

- Extension de la vue : les cartes de matières sont maintenant alimentées par `assets/bdd/matieres.json`, filtrées par niveau et filière du compte. Les états `actif`, `partiel` et `programme` sont distingués ; seul le contenu actif affiche sa progression réelle, et aucun pourcentage fictif n'est affiché pour les matières non branchées. Le catalogue reste local, sans service externe.
- Cache mis à jour pour cette extension : CSS v163, app.js v3543, Service Worker `dz-de-v3.185.0.0.77`. La CI contrôle le chargement du registre et le rendu des états de disponibilité.
- Aucune validation visuelle ordinateur/mobile n'est revendiquée à ce stade. PR #17 reste ouverte et non fusionnée ; `main` et la production ne sont pas modifiées.
- Validation finale du lot : CI #2413 (run `42402018216`) réussie sur le commit `23d4e154a22941eb9a0a730861a1cc680ffe8303` ; contrôles structurels, pédagogiques, accès par rôle, registre des matières et caches synchronisés. Références finales : CSS v163, app.js v3543, Service Worker `dz-de-v3.185.0.0.77`.

## Lot 139 — graphique de progression réel des unités (7 novembre 2026)

- Comparaison du tableau de bord indépendant avec les deux prototypes : la vue existante présentait déjà le bandeau personnel, les quatre accès rapides, la reprise de séance, les matières, l’activité hebdomadaire, l’accès au professeur IA, les recommandations et les notifications.
- Élément visuel pédagogique manquant ajouté : un graphique par unité, dans une carte distincte, pour rendre la progression comparable d’une unité à l’autre.
- Chaque barre est calculée à partir des séances réellement enregistrées pour l’unité (loadSeancesFor) ; le numérateur, le total et le pourcentage sont dérivés des séances présentes dans UNITES. Aucun score, minute, pourcentage ou matière fictive n’est ajouté.
- Le graphique reste indépendant de فضائي الدراسي, sans Chart.js ni autre dépendance. Il utilise le CSS existant, avec adaptation en grille sur petit écran et les variables de thème déjà utilisées par la plateforme.
- Contrôles CI ajoutés dans ci/check-gamification.mjs pour vérifier la zone HTML, le calcul depuis les séances réelles, le rendu et les styles du graphique.
- Références de cache synchronisées : CSS v164, app.js v3544, Service Worker dz-de-v3.185.0.0.78.
- Fichiers concernés : index.html, app.js, style-prototype-dz.css, sw.js, ci/check-gamification.mjs, ci/check-masar.mjs, ci/check-public-portal.mjs et le présent dossier.
- Aucun changement aux routes, à Auth, Supabase, RLS, schéma, migrations, paiement ou permissions. Aucun changement direct sur main.
- La validation CI du nouveau commit et la vérification visuelle sur ordinateur/mobile restent à effectuer. PR #17 demeure ouverte et non fusionnée.

## Lot 140 — correction de la référence de cache du contrôle مسارك (7 novembre 2026)

- Analyse des logs CI #2419 : les contrôles structurels et pédagogiques antérieurs ont réussi ; le job échouait au contrôle مسارك sur l'assertion de cache CSS qui attendait encore v163 alors que le lot 139 avait correctement actualisé index.html et le précache à v164.
- L'assertion de version Service Worker attendait elle aussi l'ancienne v3.185.0.0.77 ; synchronisation du test avec v3.185.0.0.78.
- Aucune modification du comportement de مسارك, des routes, de l'authentification, des permissions ou des données. Le cache de masar.js reste inchangé car ce fichier n'a pas été modifié.
- Fichier modifié : ci/check-masar.mjs. Le dossier de continuité est mis à jour.
- La nouvelle exécution CI déclenchée par ce commit doit confirmer la correction. Aucun déploiement ni fusion de la PR #17 n'est demandé.

## Lot 141 — aperçu des badges dans le tableau de bord étudiant (7 novembre 2026)

- Ajout d'une carte « الشارات والمكافآت » directement dans la vue autonome data-view="dashboard", sans modifier فضائي الدراسي ni le panneau historique de مسارك.
- Les badges affichés sont lus depuis DZ_GAMIFICATION.badges(g), donc depuis le moteur existant et ses critères réels (leçons, quiz, scores, XP, jours actifs et unités complétées). Aucun badge n'est attribué par ce nouvel aperçu.
- Affichage du nombre de badges réellement ouverts, puis des quatre badges ouverts les plus récents dans l'ordre du moteur ; si aucun n'est ouvert, présentation des quatre prochains badges verrouillés. L'accès « عرض جميع الشارات والإنجازات » renvoie au registre existant de مسارك.
- États visuels distincts ouvert/verrouillé, adaptation mobile en une colonne, thème sombre pris en charge.
- Assertions CI ajoutées pour vérifier le conteneur, la liaison au moteur de badges, l'état réel et l'accès au registre.
- Cache synchronisé : CSS v165 ; Service Worker dz-de-v3.185.0.0.79. app.js reste v3544 car son contenu n'a pas changé dans ce lot.
- Aucun changement Auth, Supabase, RLS, schéma, permissions, routes ou espace étudiant historique. Aucun déploiement ni fusion.

## Lot 142 — cinquième accès rapide aux messages (7 novembre 2026)

- Alignement sur le prototype du tableau de bord à cinq raccourcis : ajout d'un accès direct « الرسائل والتواصل » vers la vue existante data-view="msg".
- Grille desktop ajustée à cinq colonnes ; la règle responsive existante conserve deux colonnes sur tablette/téléphone.
- Aucun compteur fictif : le raccourci ne prétend pas qu'il existe des messages non lus. Le centre de notifications garde son propre compteur réel.
- Contrôles CI ajoutés pour vérifier les cinq cartes, la route message et les grilles desktop/mobile.
- Cache synchronisé : CSS v166 ; Service Worker dz-de-v3.185.0.0.80. Aucun changement app.js.
- Aucune modification de la messagerie elle-même, des routes, Auth, Supabase, RLS ou permissions.


## Lot 143 — carte professeur IA du tableau de bord étudiant (7 novembre 2026)

- Enrichissement de la carte « الأستاذ الذكي » dans la vue indépendante `data-view="dashboard"` : le texte distingue les usages pédagogiques (explication des cours, correction de phrases et interaction vocale) et renvoie vers l'espace professeur déjà existant.
- Les trois repères sont informatifs ; aucun faux bouton de lancement vocal ni nouveau moteur n'est introduit. L'action réelle reste le bouton `data-go="prof"`, qui ouvre la vue du professeur et conserve ses commandes existantes.
- Présentation responsive par pastilles flexibles, contraste blanc sur fond violet et libellés lisibles. Aucun changement à `prof.js`, `ia.js`, `voix.js`, `js/voice-chat.js`, à l'API IA ou aux permissions.
- Contrôles CI ajoutés pour vérifier les repères, le lien fonctionnel vers `prof` et les styles dédiés.
- Cache synchronisé : CSS v167 ; Service Worker `dz-de-v3.185.0.0.81`. `app.js` reste v3544 car il n'a pas été modifié.
- La CI #2428 du lot 142 est réussie. Le lot 143 attend sa propre exécution CI. PR #17 reste ouverte et non fusionnée ; aucune publication Cloudflare n'est effectuée.

- Correctif CI du lot 143 : le premier passage a signalé une assertion `ci/check-public-portal.mjs` qui attendait encore le Service Worker v3.185.0.0.80. L'assertion a été alignée sur v3.185.0.0.81 ; le nouveau passage doit encore confirmer l'ensemble.


## Lot 144 — résultats réels des quiz par unité (7 novembre 2026)

- Audit : `quiz.js` enregistrait l'historique général sous une clé `localStorage` commune au navigateur. Ce journal n'est pas utilisé pour le nouveau graphique personnel.
- À la fin de chaque série, `quiz.js` calcule, pour les unités réellement rencontrées dans les cinq questions, le nombre de réponses correctes et le nombre de réponses données. Le détail des questions et les réponses de l'élève ne sont pas stockés par ce nouveau mécanisme.
- `dz-gamification.js` agrège ces compteurs dans `unitQuiz`, à l'intérieur de la clé de progression déjà isolée par compte via `AUTH.session()`. Le mécanisme anti-doublon des événements reste actif.
- La vue indépendante `data-view="dashboard"` affiche maintenant les résultats cumulés par unité, le nombre d'items évalués et le nombre de séries contributrices. Les unités avec moins de dix réponses portent la mention « عينة محدودة ». Le texte précise qu'il s'agit de taux de réponses correctes, et non d'une certification d'« maîtrise ».
- Les comptes sans résultats voient un état vide qui renvoie vers la vue de quiz existante. Aucune donnée de démonstration n'est ajoutée ; l'ancien historique local partagé n'est pas repris pour éviter les mélanges entre utilisateurs.
- Aucun changement Supabase, Auth, RLS, schéma ou paiement. Les modifications concernent le suivi local déjà existant et la présentation du tableau de bord.
- Cache synchronisé : CSS v168, `quiz.js` v3513, `dz-gamification.js` v5, Service Worker `dz-de-v3.185.0.0.82`. `app.js` reste v3544.
- Validation du commit `3673bc53cebb44fedd6cf3a0c846a76b5c530ebf` : CI #2440 réussie (validation structurelle & pédagogique) et build Cloudflare de prévisualisation de la branche réussi. Le check Supabase est ignoré, sans changement de base. PR #17 reste ouverte et non fusionnée ; aucun déploiement de production.


## Lot 145 — objectifs pédagogiques dynamiques du tableau de bord étudiant (7 novembre 2026)

- Ajout d'une section « أهدافك التعليمية » dans la vue autonome `data-view="dashboard"`, sans toucher à l'accueil historique `فضائي الدراسي`.
- Les objectifs sont présentés comme des stations de travail personnalisées, alimentées par les données réellement disponibles : progression des séances de l'unité en cours, nombre de séries de quiz enregistrées pour cette unité et nombre de cartes de mémoire actuellement dues.
- La première station calcule le ratio de séances accomplies et restantes depuis `loadSeancesFor` et `UNITES`. La deuxième affiche uniquement le nombre d'essais déjà enregistré dans `unitQuiz`. La troisième s'appuie sur `MEMOIRE.dues()`. Les actions renvoient aux vues existantes des séances, quiz et révision.
- Aucun objectif chiffré hebdomadaire, score, durée ou résultat fictif n'est ajouté. Une note précise qu'il s'agit de stations proposées à partir de l'activité réelle, et non de résultats ou échéances supposés.
- Présentation en grille de cartes, responsive et compatible avec le thème sombre ; styles confinés aux classes `sd-goal*` de la vue.
- Contrôles CI renforcés dans `ci/check-gamification.mjs`, `ci/check-masar.mjs` et `ci/check-public-portal.mjs` pour la présence des objectifs et la cohérence du cache.
- Cache synchronisé : CSS v169, app.js v3545, Service Worker `dz-de-v3.185.0.0.83`. Les versions des modules non modifiés restent inchangées.
- Aucun changement Auth, Supabase, RLS, schéma, migration, paiement, permissions ou routes. Aucun changement direct sur `main`. PR #17 reste ouverte et non fusionnée.
- Validation du commit `a31de4828477287e40ab430f4aa5b883dbcc8d10` : CI #2450 (run `42406050729`) réussie ; les contrôles `check-public-portal`, `check-masar` et `check-gamification` passent notamment avec les versions de cache synchronisées. Build Cloudflare de prévisualisation `design-prototypes-67-74-alignment` réussi (Build ID `0739f4c4-70cc-4390-9d76-61a933cc6825`). Le contrôle Supabase Preview est ignoré, sans changement de base. Aucune validation visuelle navigateur ordinateur/mobile n'est revendiquée.

- Correctifs de validation du lot : CI #2446 et #2448 ont révélé des assertions de cache anciennes (app.js v3544, CSS v168) ; CI #2449 a ensuite révélé l'assertion CSS v168 restante dans le contrôle XP. Les contrôles `check-masar`, `check-public-portal` et `check-gamification` ont été alignés sur app.js v3545, CSS v169 et SW v3.185.0.0.83. Le passage final #2450 est entièrement réussi.


## Lot 146 — rangée de quatre indicateurs visuels du tableau de bord étudiant (7 novembre 2026)

- Comparaison avec les prototypes étudiants : le premier prototype prévoit une rangée dédiée de quatre cartes de synthèse sous la bannière de bienvenue. Cette hiérarchie manquait dans la vue autonome actuelle.
- Ajout de `#sdStats` immédiatement après `#studentDashboardHero`, sans modifier la vue historique `فضائي الدراسي`.
- Quatre indicateurs sont calculés par compte : séances achevées / séances enregistrées, nombre d'unités du niveau, réponses correctes / réponses de quiz enregistrées, nombre de tentatives de quiz par unité. Les tentatives et réponses sont agrégées depuis `DZ_GAMIFICATION.read().unitQuiz`, qui est isolé par compte.
- Aucun temps d'étude, variation en pourcentage, classement, cible hebdomadaire ou chiffre d'exemple du prototype n'est repris. Les valeurs absentes restent à zéro, avec un sous-libellé qui explicite leur base de calcul.
- Présentation en quatre cartes à accents visuels distincts, quatre colonnes sur grand écran, deux sur tablette et mobile, et couleurs adaptées au thème sombre. Styles confinés aux classes `sd-stat*`.
- Contrôles CI étendus dans `ci/check-gamification.mjs` et références de cache synchronisées dans les contrôles de la branche.
- Cache synchronisé : CSS v170, app.js v3546, Service Worker `dz-de-v3.185.0.0.84`.
- Aucun changement des routes, handlers, données métier, Supabase, Auth, RLS, schéma, migration, paiement ou permissions. `فضائي الدراسي` reste inchangé ; `main` n'est pas modifiée ; PR #17 reste ouverte et non fusionnée.
- CI et build de prévisualisation à contrôler après ce lot ; aucune validation visuelle navigateur n'est revendiquée.


## 16. Lot 147 — carte pédagogique complète du tableau de bord étudiant (7 novembre 2026)

- Reprise de la composition « خريطة التعلم البيداغوجية » du prototype `Qwen_html_20261021_bxmtbklup.html`, sans importer ses données de démonstration, ses pourcentages, ses objectifs hebdomadaires ni ses badges fictifs.
- Dans `app.js`, la zone `#sdPath` n'affiche plus uniquement une fenêtre de cinq séances autour de la prochaine leçon. Elle présente désormais les unités du niveau du compte, chacune avec le nombre de séances terminées, le taux calculé, et les jalons correspondant aux séances réelles.
- La séance suivante est mise en évidence à partir de `prochaineSeance()`. Les unités terminées, en cours, commencées et non commencées sont distinguées sans transformer les séances restantes en faux verrouillage.
- L'action « متابعة الآن » conserve la navigation existante `data-go="seances"`. Aucun nouvel identifiant de vue, route, module ou moteur pédagogique n'a été créé.
- La présentation est limitée à la vue `data-view="dashboard"`, avec variantes responsive et sombre dans `style-prototype-dz.css`.
- Cache : CSS `v171`, app `v3547`, Service Worker `dz-de-v3.185.0.0.85`. Le contrôle `ci/check-masar.mjs` vérifie désormais la présence de la carte, des unités, des jalons de séances et des variantes sombres.
- Périmètre préservé : PR #17 et branche existante ; aucun changement direct sur `main`, aucune fusion, aucun déploiement manuel ; aucun changement Supabase/Auth/RLS/schéma/paiement.
- CI #2464 : réussie sur le commit `15c4d87d9be8a4decd38dfbd8517395517b70ab3` ; les contrôles structurels, portail, tableau de bord مسارك, XP/badges, permissions, matrice des parcours et régression pédagogique sont verts.
- Cette réussite CI ne constitue pas une validation visuelle navigateur. Aucun test visuel ordinateur/mobile ni build Cloudflare de prévisualisation pour ce HEAD n'est revendiqué ; un essai réel de la preview reste nécessaire.


## 17. Lot 148 — palette chromatique du tableau de bord étudiant (7 novembre 2026)

- Diagnostic après le lot 147 : les cartes KPI possédaient déjà quatre accents, mais la carte pédagogique utilisait essentiellement le vert, avec le rouge pour la prochaine séance ; les graphiques de progression des unités et des résultats de quiz étaient majoritairement monochromes.
- Ajout d'une palette cohérente à cinq accents (vert, bleu, ambre, violet, corail) pour distinguer les unités, les barres de progression par unité, les résultats par unité, les cartes matières, les objectifs et les badges débloqués.
- La palette est appliquée par CSS selon l'ordre des cartes ; elle ne modifie aucune donnée, aucun calcul de progression ni aucune logique de réussite. L'unité en cours garde un signal corail/rouge distinct et les unités terminées restent identifiables en vert.
- Ajout des variantes sombres pour préserver le contraste et la lisibilité.
- Cache : CSS `v172`, Service Worker `dz-de-v3.185.0.0.86`. Les contrôles de cache `check-masar`, `check-public-portal` et `check-gamification` ont été synchronisés.
- Aucun changement sur les routes, identifiants, modules pédagogiques, Supabase/Auth/RLS/schéma/paiement, ni sur `main`. PR #17 reste ouverte et non fusionnée.
- CI GitHub Actions #42407935163 : réussie sur le HEAD `fd1fca18f5b14c80f1daf9d94d373e48000ab6a9` ; job « Validation structurelle & pédagogique » terminé avec succès. Les runs annulés sur les commits intermédiaires ne représentent pas l'état final de la branche.
- La comparaison visuelle réelle avec les deux prototypes reste à effectuer dans le navigateur ; la réussite CI ne la remplace pas.


## 18. Lot 149 — harmonisation chromatique de toutes les cartes matières (7 novembre 2026)

- Comparaison du tableau de bord avec le prototype étudiant `الثانوية_الافتراضية_الجزائرية_design_v2.html` : les matières y sont présentées comme des cartes distinctes avec fonds pastel, icône accentuée, statut et progression. Dans la version ALLEMAND, le lot 148 colorait déjà les cartes actives et partielles, mais les matières planifiées restaient visuellement neutres.
- Correction CSS : chaque carte matière reçoit maintenant son accent (vert, bleu, violet ou ambre) et son fond pastel, y compris lorsqu'elle est planifiée. Les statuts et la progression métier ne changent pas.
- Ajout de l'équivalent en thème sombre, avec fonds teintés par accent et bordures adaptées.
- Cache synchronisé : CSS `v173`, Service Worker `dz-de-v3.185.0.0.87`, app.js conservé en `v3547`. Assertions mises à jour dans `check-masar`, `check-public-portal` et `check-gamification`.
- Aucun changement des routes, identifiants, gestionnaires d'événements, données pédagogiques, Supabase/Auth/RLS/schéma/paiement. PR #17 reste sur sa branche, non fusionnée ; `main` reste intacte.
- Première CI du lot (#42408382754) : échec isolé dans `ci/check-masar.mjs`, dont l'assertion Service Worker attendait encore `.86` alors que le précache avait été correctement porté à `.87`. Correction de cette assertion et actualisation des messages de version CSS dans `check-public-portal.mjs`.
- Nouvelle CI à contrôler sur le HEAD après correction. La validation structurelle ne remplace pas la comparaison visuelle navigateur, ordinateur et mobile avec les prototypes.


## 19. Lot 150 — recomposition de la grille du tableau de bord étudiant (7 novembre 2026)

- Relecture des deux prototypes HTML conservés dans la bibliothèque : `Qwen_html_20261021_bxmtbklup.html` (806 lignes) et `Qwen_html_20261021_juv5xelun.html` (704 lignes). Le premier place le parcours pédagogique en grand panneau, puis associe les compétences aux recommandations et les objectifs aux badges ; le second organise les matières dans une colonne principale avec l'assistant IA et les recommandations dans une colonne latérale.
- Réorganisation du seul HTML de `data-view="dashboard"` : la carte de parcours pédagogique passe au-dessus de la grille et occupe toute la largeur ; les matières, le graphique de progression et l'activité gardent une largeur complète ; compétences et recommandation forment une paire ; objectifs et badges forment une seconde paire ; l'assistant IA et les notifications restent dans la colonne latérale.
- Aucun contenu fictif des prototypes n'est repris. Les identifiants des zones dynamiques (`sdPath`, `sdSubjects`, `sdUnitProgress`, `sdSkills`, `sdRecommendation`, `sdGoals`, `sdAchievements`, `sdActivity`, `sdUpdates`) sont conservés pour maintenir les fonctions JavaScript existantes.
- Responsive : deux colonnes internes sur grand écran et tablette ; une colonne sur téléphone. Les vues publiques, `فضائي الدراسي`, les routes, les modules et les événements ne sont pas modifiés.
- Cache : CSS `v174`, Service Worker `dz-de-v3.185.0.0.88`, app.js inchangé (`v3547`). Contrôles de cache synchronisés.
- Périmètre : branche `design/prototypes-67-74-alignment`, PR #17 ouverte et non fusionnée ; aucun changement direct sur `main`, aucun déploiement ; aucun changement Supabase/Auth/RLS/schéma/paiement.
- Validation visuelle réelle navigateur non revendiquée à ce stade ; la CI doit confirmer le lot avant toute conclusion technique.

- Suite CI : le premier run du Lot 150 a révélé des assertions regex échappées qui conservaient l'attente CSS `v173` et Service Worker `.87` dans `check-masar.mjs` (les contrôles littéraux avaient été actualisés, pas ces motifs regex). Les motifs de cache des scripts concernés ont été alignés sur CSS `v174` et Service Worker `.88`. Le nouveau run sur le HEAD doit confirmer la correction.

- Deuxième constat CI du Lot 150 : après l'alignement du CSS, le motif regex de `check-masar.mjs` conservait encore l'attente Service Worker `.87` (les antislashs du motif empêchaient le remplacement littéral initial). Le motif est maintenant corrigé vers `.88` dans le commit `221c5d4`. CI #2483 est déclenchée sur le commit de correction ; son résultat sera contrôlé avant de conclure.


## 20. Lot 151 — activation effective de la grille interne du tableau de bord (7 novembre 2026)

- Audit structurel du HTML/CSS du Lot 150 : les règles `grid-template-columns` et `grid-column` avaient été ajoutées à `.sd-main`, mais le conteneur n'avait pas `display:grid`. Les colonnes et placements des panneaux ne pouvaient donc pas être appliqués par le navigateur.
- Correction : activation explicite de `display:grid` sur `.sd-main`, avec `min-width:0` pour éviter les débordements ; maintien des deux colonnes internes sur grand écran/tablette et d'une colonne sur mobile.
- Ajout d'assertions dans `ci/check-masar.mjs` pour exiger les panneaux parcours/matières/compétences/recommandation, l'activation effective de la grille et la règle responsive mobile.
- Cache synchronisé : CSS `v175`, Service Worker `dz-de-v3.185.0.0.89`, app.js conservé en `v3547`. Contrôles `check-masar` et `check-public-portal` mis à jour.
- Vérifications de structure déjà faites : chaque zone dynamique du dashboard apparaît une seule fois dans le HTML ; les neuf identifiants attendus sont présents et le moteur `renderStudentDashboard()` les référence toujours.
- Périmètre inchangé : branche `design/prototypes-67-74-alignment`, PR #17 ouverte/non fusionnée, aucun changement sur `main`, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/paiement.
- Validation visuelle réelle navigateur encore nécessaire ; ce lot corrige un défaut CSS objectivement identifié et ajoute un garde-fou CI, sans prétendre à la parité visuelle complète avec les prototypes.

- Validation Lot 151 : CI GitHub Actions #2492 réussie sur le commit `5f6bb82fa2f67f9c078c498a577f23beecb2e0a7` ; job « Validation structurelle & pédagogique » terminé avec succès. Le run #2491, antérieur à l'alignement du contrôle gamification, n'est pas le résultat de référence. Le contrôle #2492 inclut les assertions dashboard et les caches CSS `v175` / SW `.89`.


## 21. Lot 152 — proportions de grille fidèles au prototype pédagogique (7 novembre 2026)

- Lecture ciblée des deux prototypes HTML sur les sections du tableau de bord : le prototype 1 répartit « إتقان المهارات اللغوية » et « توصيات مخصصة » sur une grille 2/3–1/3, puis les objectifs et les badges à parts égales ; le prototype 2 place les matières et le graphique dans la colonne principale (2/3) et l'assistant IA/recommandations dans la colonne latérale (1/3).
- Ajustement de la grille interne `.sd-main` sur six fractions : compétences sur 4/6, recommandations sur 2/6, objectifs sur 3/6 et badges sur 3/6. Matières, progression par unité et activité restent pleine largeur. La colonne latérale du tableau de bord conserve l'assistant IA et les notifications.
- Au breakpoint mobile (640 px), tous les panneaux repassent en une seule colonne ; la grille de six fractions ne s'applique plus.
- Ajout de contrôles CI explicites pour les ratios 2/3, 1/3 et 1/2 ; cache CSS `v176`, Service Worker `dz-de-v3.185.0.0.90`, app.js `v3547` inchangé. Contrôles de cache alignés dans `check-masar`, `check-public-portal` et `check-gamification`.
- Aucun faux résultat des prototypes n'est repris : les données restent issues du compte étudiant et des modules pédagogiques existants. Routes, identifiants dynamiques, événements, Auth/Supabase/RLS/schéma/paiement inchangés ; PR #17 reste ouverte et non fusionnée ; `main` intacte.
- Validation visuelle navigateur non revendiquée ; CI à contrôler après ce lot.

- Validation Lot 152 : CI GitHub Actions #2497 réussie sur le commit `b9523ae63fbfb99e8241ce1a828aa43dce3e1cf5` ; job « Validation structurelle & pédagogique » terminé avec succès. Les contrôles de proportion des panneaux, de grille mobile et de cache CSS `v176` / Service Worker `.90` sont passés.

---

## Lot 153 — aperçu réel des messages dans le tableau de bord étudiant

Date : 7 novembre 2026

### Objectif
Rapprocher la colonne latérale du tableau de bord du deuxième prototype, qui prévoit un espace « الرسائل », sans importer les noms, messages ou compteurs fictifs du prototype.

### Réalisation
- Ajout d'un panneau « الرسائل والمجموعات » entre l'assistant intelligent et les notifications.
- Le panneau interroge la fonction existante `window.SB.msgConvs()` et affiche uniquement les conversations réellement retournées pour le compte connecté.
- Présentation limitée aux métadonnées disponibles : nombre de conversations, titre/type et date de dernière activité. Aucun extrait de message ni compteur de non-lus n'est inventé.
- Le bouton renvoie vers la vue de messagerie existante (`data-go="msg"`).
- En cas de session cloud indisponible ou d'erreur de lecture, le panneau propose simplement d'ouvrir la messagerie ; il ne simule aucune conversation.
- Le chargement est abandonné si l'élève quitte le tableau de bord avant la réponse.

### Fichiers modifiés
- `app.js` : chargement asynchrone des conversations réelles.
- `index.html` : ajout du panneau `sdMessages`.
- `style-prototype-dz.css` : styles du panneau, compatibles avec le thème sombre.
- `sw.js` : précache mis à jour.
- `ci/check-masar.mjs` : assertions sur le panneau et sa source de données.
- `ci/check-public-portal.mjs` et `ci/check-gamification.mjs` : références de cache actualisées.

### Versions
- CSS : `style-prototype-dz.css?v=177`
- JS : `app.js?v=3548`
- Service Worker : `dz-de-v3.185.0.0.91`
- `masar.js?v=3516` inchangé.

### Garanties et limites
- Aucun nom d'enseignant, message, nombre de messages non lus ou aperçu fictif repris du prototype.
- La lecture utilise exclusivement l'API client déjà existante et reste soumise aux politiques RLS en place.
- Aucun changement de schéma, SQL, Auth, RLS, paiement, routes principales ou identifiants fonctionnels existants.
- Aucun changement sur `main`, aucune fusion et aucun déploiement de production.
- La CI #2507 a réussi sur le commit `ca39eee63ab64c1cf58350b424cf617eb3d544ba` (workflow #42411786815). Les contrôles du portail public, du tableau de bord, de la messagerie, de la syntaxe JavaScript, des badges et des parcours ont réussi. Deux assertions de cache héritées ont été synchronisées pendant la validation.


## Validation complémentaire — Lot 153 / CI #2508 (7 novembre 2026)

- La PR #17 pointe sur le commit `9f7136b0c475b4d15dd552972f85b9d7111d9a30`.
- Le workflow GitHub Actions #2508 (`42411850502`) est terminé avec succès sur ce HEAD ; le job « Validation structurelle & pédagogique » est entièrement réussi.
- Les contrôles exécutés couvrent notamment la syntaxe JavaScript, les unités pédagogiques, le portail public, le tableau de bord « مسارك », les données de gamification, la messagerie et les parcours d'accès.
- Cette réussite confirme les contrôles automatisés, mais ne constitue pas une recette visuelle navigateur et ne prouve pas l'identité graphique avec les deux prototypes.
- Audit source complémentaire : les graphiques de résultats du tableau de bord affichent les taux de réponses correctes agrégés par unité ; ils ne mesurent pas séparément vocabulaire, grammaire, compréhension orale ou expression. Conserver cet intitulé par unité et ne pas présenter ces agrégats comme un radar de compétences linguistiques.
- Les deux fichiers prototypes `Qwen_html_20261021_bxmtbklup.html` et `Qwen_html_20261021_juv5xelun.html` ne sont pas présents à la racine de cette branche. Ne pas inventer leur structure exacte : la comparaison pixel/structure nécessite de disposer à nouveau de leurs sources ou d'une prévisualisation accessible.
- PR #17 maintenue ouverte et non fusionnée ; `main` inchangée ; aucun déploiement revendiqué ; aucun changement Supabase/Auth/RLS/schéma/paiement.


## Audit fonctionnel — recherche, notifications et gamification (8 novembre 2026)

### État réellement présent dans la branche
- Recherche globale : module dédié `dz-interactions.js?v=5`, raccourci `Ctrl+K` / `Cmd+K`, recherche instantanée dans les vues présentes, les unités et séances de `UNITES`, les groupes de `QUIZ_BANK`, ainsi que l'index documentaire `assets/bdd/grammaire.json`. Les résultats ouvrent les vues et contenus existants ; aucun moteur de recherche externe ni contenu de démonstration n'est ajouté.
- Centre de notifications : notifications locales créées à partir des toasts applicatifs, classées en succès/erreur/avertissement/information, conservées par compte dans `localStorage` (maximum 60), avec compteur non lu, lecture individuelle et action « تحديد الكل كمقروء ». Les cartes de révision dues sont présentées séparément comme rappel.
- Limite de portée des notifications : ce centre n'est pas un miroir des notifications distantes Supabase. Les notifications du compte affichées dans d'autres espaces via `SB.myNotifications()` restent un parcours distinct ; ne pas présenter les deux sources comme un flux unifié.
- Gamification : module `dz-gamification.js?v=5`, état local associé au compte authentifié, XP attribués aux événements réels `dz:lesson-complete` et `dz:quiz-complete`, déduplication des événements, progression sur 10 niveaux, 20 badges calculés selon les accomplissements, activité des sept derniers jours et fenêtre de célébration avec confettis.
- Le tableau de bord étudiant lit ces données via `DZ_GAMIFICATION` ; il ne reprend pas les 1 250 XP, les 12 badges, le niveau 5 ou les chiffres d'exemple du prototype. Le nombre de badges ouverts dépend du compte et de ses événements.
- La conservation locale est limitée aux états explicitement gérés par ces modules. Elle ne remplace pas la persistance cloud des cours, des évaluations ou des autres données de la plateforme.

### Écarts conservés volontairement par rapport au prototype de démonstration
- Pas de classement étudiant fictif : aucune table de classement réelle, validée et autorisée n'a été identifiée dans le périmètre de cette évolution.
- Pas d'attribution XP arbitraire à chaque clic : seuls les événements pédagogiques d'achèvement effectivement émis par les modules existants sont récompensés.
- Pas de notification de démonstration au chargement : les entrées proviennent des actions réelles de l'application.
- Pas de données d'activité, de durée d'étude ou de résultats inventés.

### Contrôles et périmètre
- Le HTML charge `dz-interactions.js?v=5` et `dz-gamification.js?v=5` ; le Service Worker les inclut dans le précache.
- Le contrôle CI contient les étapes « Vérifier recherche globale et centre de notifications » et « Vérifier XP et badges fondés sur les activités réelles ».
- Workflow de validation du HEAD `0432b6fa9a9846e535e7f55c2ffac0a032e278e3` : run `42414839758`, job « Validation structurelle & pédagogique » terminé avec succès ; les contrôles recherche/notifications, gamification, syntaxe JS, accès et parcours ont réussi.
- Cette CI valide les assertions automatisées, pas le rendu ni les interactions dans un vrai navigateur. La recette visuelle desktop/mobile et le test manuel du raccourci clavier restent à faire.
- PR #17 reste ouverte et non fusionnée ; `main` reste intacte. Aucun déploiement de production et aucun changement Auth, Supabase, RLS, schéma, migration ou paiement.


## Validation complémentaire — Lot 154 / CI #2510 (8 novembre 2026)

- HEAD contrôlé : `ee4cfb1378d3b232cb30d811f0b47f5f490cbf4b`.
- Workflow GitHub Actions #2510 (`42425364837`) : terminé avec succès. Le job « Validation structurelle & pédagogique » a réussi l'ensemble de ses étapes.
- Étapes pertinentes confirmées : contrôle du tableau de bord « مسارك », recherche globale et centre de notifications, XP et badges fondés sur les activités réelles, syntaxe JavaScript, accès et parcours pédagogiques.
- Build Cloudflare Workers associé au même HEAD : terminé avec succès sur la prévisualisation de la branche `design/prototypes-67-74-alignment`. Il s'agit d'un build de prévisualisation, pas d'une publication de production.
- Contrôle Supabase Preview : `skipped`, car aucune branche Supabase de prévisualisation n'est associée à cette PR ; aucun changement de base n'a été effectué.
- Le succès CI/build ne remplace toujours pas la recette visuelle réelle dans un navigateur : vérifier le tableau de bord sur ordinateur et mobile, les interactions de recherche/notifications et la fidélité aux deux prototypes avant toute décision de fusion.
- PR #17 toujours ouverte, non fusionnée et fusionnable ; branche cible `main` inchangée. Aucun déploiement de production, aucun changement Auth/Supabase/RLS/schéma/migration/paiement.


## Lot 155 — confirmation du déploiement de prévisualisation (8 novembre 2026)

- Commit documentaire HEAD : `7adb5f2b31e408aba6eb2cb21c58e59377daa006`.
- CI GitHub Actions #2511 (`42426457378`) : succès ; le job « Validation structurelle & pédagogique » et ses 30 étapes utiles, dont les contrôles مسارك, recherche/notifications et gamification, sont terminés avec succès.
- Cloudflare Workers Build : succès ; déploiement de prévisualisation confirmé pour le commit `7adb5f2`.
- URL de prévisualisation du commit : https://ebb2ec63-allemand.brid-randomtv.workers.dev
- URL de prévisualisation de branche : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev
- Supabase Preview : `skipped` (aucune branche Supabase liée à la PR) ; aucun changement base de données.
- Limite : les résultats CI et le déploiement confirment que le build est disponible, pas que la qualité visuelle, le responsive ou les interactions ont été vérifiés dans un navigateur réel. La validation visuelle reste à réaliser sur les deux largeurs et à comparer aux sources prototypes.
- PR #17 reste ouverte, non fusionnée et fusionnable ; `main` inchangée. Aucun déploiement de production ni changement Auth/Supabase/RLS/schéma/migration/paiement.

## Lot 156 — audit de la page publique, du coach et du tableau de bord (8 novembre 2026)

### État de la prévisualisation
- HEAD contrôlé : `df13e0cd20376bde83cfc93063a5cc1b0bd484fc`.
- CI GitHub Actions : run `42426655001`, conclusion `success`, job « Validation structurelle & pédagogique » réussi.
- Cloudflare confirme le build et le déploiement de prévisualisation du commit `df13e0c`.
- URL de prévisualisation du commit : https://dbe8984d-allemand.brid-randomtv.workers.dev
- PR #17 toujours ouverte et non fusionnée. Aucun changement direct sur `main`.

### Page publique et barre vocale
- Le contenu textuel transmis par l'utilisateur correspond à la composition publique codée dans `index.html` et rendue par `public-portal.js` : accueil, démonstration IA explicitement signalée comme exemple, preuves pédagogiques allemandes, catalogue des matières, niveaux et FAQ.
- Les compteurs 234 exercices, 55 sujets et 19 unités sont présentés comme ressources du parcours allemand, pas comme statistiques de toutes les matières.
- La barre vocale `parle.js` est injectée globalement au chargement. Son état initial est « en attente » ; l'écoute n'est pas activée automatiquement et dépend d'une action explicite sur les commandes vocales.
- Les six langues du catalogue pédagogique et les neuf langues du sélecteur vocal sont deux périmètres distincts.

### Défauts fonctionnels confirmés — coach v4
- `app.js` programme `show()` quatre secondes après le chargement du DOM, sans garde de session/authentification. La carte « 🧭 1/8 » peut donc recouvrir le portail public avant connexion.
- Le bouton `✕` retire uniquement la carte courante ; aucun état de refus/masquage n'est conservé. Elle réapparaît au rechargement.
- Le bouton « التالي » fait tourner l'index avec modulo `STEPS.length` : après la dernière étape, le coach recommence au lieu de se terminer.
- L'étape 1 promet un « تشخيص » mais son action est `view:"masar"` ; elle ouvre la vue مسارك, pas un test diagnostique. Aucun parcours de diagnostic n'est branché par cette étape.
- L'étape de révision cible `view:"memoire"`, alors que `VIEWS` contient `revision` et non `memoire`. `go()` remplace une vue inconnue par `accueil` : le bouton ne mène donc pas à la mémoire de révision attendue.
- Le mini-quiz est composé de trois affirmations codées dans `QB`, corrige son score dans la fenêtre uniquement et ne déclenche pas l'événement réel `dz:quiz-complete`. Il ne doit pas être présenté comme un diagnostic enregistré ni comme une évaluation intégrée à la progression.

### Cohérence du guide de bienvenue
- `guide.js` charge `assets/bdd/onboarding.json` pour la modale de bienvenue et le guide persistant.
- Ce fichier promet encore que toutes les leçons, tous les devoirs et corrigés sont disponibles, que la plateforme est entièrement gratuite, qu'un classement, une présence et un rapport hebdomadaire aux parents sont assurés, et que les contenus fonctionnent hors ligne après le premier chargement.
- Ces formulations sont plus larges que l'état de disponibilité présenté sur le portail public. Le tableau de bord observé dans le code calcule principalement les séances, les résultats de quiz, les badges et les jours d'activité ; cela ne justifie pas à lui seul des affirmations de présence scolaire, de classement national ou de rapport hebdomadaire envoyé.
- Revoir ces affirmations avant de les conserver dans le parcours d'accueil ; ne pas inventer de remplacement chiffré.

### Tableau de bord étudiant — état source, sans recette visuelle
- `index.html` contient une vue distincte `data-view="dashboard"`, protégée par `canSeeStudentDashboard()` dans `app.js`.
- La composition source comprend un hero, cinq raccourcis, une carte pédagogique unités/séances, matières, graphiques de progression et de résultats, recommandations, objectifs, badges, activité, assistant, messages et notifications.
- `style-prototype-dz.css` prévoit un hero en dégradé, des icônes colorées, une grille desktop et des adaptations mobile. Les données de progression sont calculées depuis les séances et les événements du compte ; les résultats par unité proviennent des quiz enregistrés.
- `ci/check-masar.mjs` contrôle la présence de ces structures et des règles responsive, mais ne valide ni le rendu réel dans le navigateur ni la fidélité exacte aux deux prototypes.

### Décision et suites de l'audit
- Priorité P1 : corriger l'apparition automatique du coach sur le portail public, le comportement de fermeture/fin de parcours et les deux destinations erronées.
- Priorité P1 : aligner le contenu de `onboarding.json` et les textes générés par `guide.js` sur les services et contenus effectivement disponibles.
- Priorité P2 : recette visuelle du tableau de bord après connexion sur ordinateur et mobile, avec captures réelles et comparaison aux prototypes sources.
- Aucun fichier applicatif n'a été modifié pendant cet audit ; cette mise à jour est documentaire uniquement. Aucun changement Auth, Supabase, RLS, schéma, migration ou paiement ; aucun déploiement de production.

## Lot 157 — correction du coach étudiant et fiabilisation du guide (8 novembre 2026)

### Coach v4 — correctifs appliqués
- Le coach n'est plus injecté pour les visiteurs : il vérifie la session `AUTH.session()` et le rôle `eleve`. Il est proposé après l'événement `dz:auth` ou après le chargement si un élève est déjà connecté.
- La progression, la fermeture volontaire et la fin du parcours sont mémorisées séparément par compte dans `localStorage` (`userStorageKey`). Le bouton de fermeture masque le coach pour ce compte ; la dernière étape termine le parcours au lieu de revenir à la première.
- La première étape ne promet plus un diagnostic inexistant : elle invite à ouvrir « مسارك » et choisir la prochaine unité.
- La destination de révision est corrigée de `memoire` vers la vue existante `revision`.
- Le mini-quiz est clairement annoncé comme entraînement illustratif non sauvegardé et non comptabilisé dans la progression.
- Deux clés de correction ont été rectifiées : « Ich trage einen Hut. → einen masc Akk. » et « Er lebt in einer reichen Gesellschaft. → einer Datif. » sont toutes deux des affirmations vraies.
- Les étapes du coach ne promettent plus de correction immédiate systématique, de fréquence hebdomadaire fixe, ni de disponibilité audio ou d'évaluations non garanties. Elles renvoient aux ressources effectivement publiées.

### Guide de bienvenue — textes alignés sur le disponible
- `assets/bdd/onboarding.json` ne promet plus une gratuité universelle, l'intégralité des cours/fichiers, le fonctionnement complet hors ligne, la correction immédiate de chaque exercice, un classement général, une présence automatique ou des rapports hebdomadaires.
- Les formulations distinguent désormais les ressources publiées, les activités corrigées lorsqu'un corrigé est fourni, les fonctions nécessitant Internet et les outils activés selon le compte.
- Les consignes élèves, professeurs et parents sont conditionnées à la disponibilité effective des matières, sessions, évaluations, messageries et réservations.
- Les sauts de ligne des messages de bienvenue élève et parent sont conservés comme de vrais retours à la ligne.

### Fichiers modifiés
- `app.js` : logique et textes du Coach ; corrections du mini-quiz.
- `assets/bdd/onboarding.json` : textes de bienvenue, objectif, guide et premiers pas.
- `index.html` : cache `app.js?v=3551`.
- `sw.js` : Service Worker `dz-de-v3.185.0.0.94`, précache `app.js?v=3551` et ressources actualisées.
- `ci/check-masar.mjs` : assertions sur l'accès élève, la fermeture, la fin, la destination révision, les promesses du coach et les deux réponses du mini-quiz.
- `ci/check-public-portal.mjs` : assertions interdisant le retour des promesses non vérifiées dans le guide.

### Validation
- CI #2517 — run `42427369832` : succès pour le correctif initial du coach.
- CI #2521 — run `42427523815` : succès pour l'alignement du guide de bienvenue.
- CI #2524 — run `42427635853` : succès pour les deux corrections de réponses du mini-quiz et les caches synchronisés.
- CI #2527 — run `42427713696` : succès sur le HEAD `e878952bad4eafc483da6a93e407577a721ddd39`, avec les assertions finales du coach, du mini-quiz et du guide.
- Cloudflare Workers Preview : build et déploiement réussis pour le commit `e878952`.
- URL de prévisualisation du commit : https://6a2cee22-allemand.brid-randomtv.workers.dev
- URL de prévisualisation de branche : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev
- Supabase Preview : `skipped`, aucune branche Supabase associée à la PR ; aucune migration ou modification de base.
- Limite : la prévisualisation est déployée, mais le navigateur de contrôle ne peut pas charger cette URL. Aucune recette visuelle navigateur n'est revendiquée. La vérification manuelle du coach après connexion et la comparaison desktop/mobile restent à effectuer.

### Périmètre préservé
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.
- Aucun déploiement de production.
- Aucun changement Auth, Supabase, RLS, schéma, migration ou paiement.
- Les routes, identifiants et gestionnaires de navigation existants sont conservés.


## Lot 158 — synchronisation du courriel de bienvenue (9 novembre 2026)

### Défaut constaté
- Le guide affiché dans la modale et la vue « الدليل » utilisait les contenus corrigés de `assets/bdd/onboarding.json`, mais la fonction `htmlAccueil(s)` de `guide.js` construisait encore un courriel parallèle codé en dur.
- Ce courriel conservait des promesses obsolètes (rapport hebdomadaire et présence, correction immédiate systématique, disponibilité 24/7, gratuité universelle et conformité générale non vérifiée).

### Correctif
- Le courriel est désormais construit à partir des points de l'objectif et des étapes du rôle courant dans `onboarding.json`.
- Les textes sont échappés avant insertion HTML.
- `envoiResend(s)` charge explicitement les données d'onboarding avant de produire le courriel, y compris depuis la carte de compte.
- Le lien du courriel renvoie vers la plateforme Cloudflare actuelle.
- Cache guide : `guide.js?v=3511`.
- Service Worker : `dz-de-v3.185.0.0.95`, précache guide synchronisé.
- Contrôle CI ajouté dans `ci/check-public-portal.mjs` pour interdire le retour des anciennes promesses et vérifier que le courriel dérive bien de `onboarding.json`.
- Contrôle cache `ci/check-masar.mjs` et garde du portail synchronisés avec le Service Worker v0.95.

### Commits et validation
- Correctif fonctionnel : `15e97c6`, puis ajout du chargement garanti des données : `325c84a`.
- Cache et contrôles CI : `46935d3`, puis synchronisation de l'assertion héritée du portail : `cc1bdb1`.
- CI #2529 : succès sur le commit intermédiaire `15e97c6`.
- CI #2530 et #2531 : échecs sur une assertion héritée qui attendait encore le Service Worker v0.94 alors que le code était passé à v0.95. L'assertion a été corrigée dans `cc1bdb1`.
- À la dernière vérification, aucun résultat CI n'était encore disponible pour le HEAD `cc1bdb12ac3d638782aaab4ea2623596caa96e0b`. Ne pas annoncer la validation finale avant un workflow réussi sur ce HEAD ou son successeur.
- Aucun build Cloudflare n'est revendiqué pour ce lot.

### Périmètre et suite
- PR #17 reste ouverte et non fusionnée ; base `main`. Aucun changement direct sur `main`, aucun déploiement de production.
- Aucun changement Auth, Supabase, RLS, schéma, migration ou paiement.
- La recette visuelle navigateur du tableau de bord étudiant et sa comparaison desktop/mobile avec les deux prototypes restent non réalisées.
- Prochaine action : confirmer la CI du HEAD après synchronisation des assertions, puis reprendre le travail visuel sur `data-view="dashboard"` sans modifier `فضائي الدراسي`.


## Lot 159 — lisibilité et hiérarchie typographique du tableau de bord (9 novembre 2026)

### Comparaison des prototypes
- Le prototype `Qwen_html_20261021_bxmtbklup.html` organise le tableau autour d'une bannière de bienvenue, du parcours pédagogique, d'une zone compétences/recommandations, des objectifs/badges et de l'activité.
- Le prototype `Qwen_html_20261021_juv5xelun.html` place les raccourcis sous la bannière, puis les matières et le graphique dans la colonne principale, avec l'assistant, les recommandations et les messages en colonne latérale.
- La version actuelle conserve sa composition hybride déjà intégrée (bannière, indicateurs réels, raccourcis, parcours, matières et indicateurs d'unité, compétences, objectifs, badges, activité, assistant et communications). L'écart typographique identifié est important : de nombreux libellés et descriptions de cartes étaient encore réglés entre 8 et 11 px, alors que les prototypes utilisent une hiérarchie plus généreuse.

### Modifications du lot
- Renforcement de la hiérarchie des titres de panneaux, sous-titres, raccourcis, cartes de matières, progression, assistant, recommandations et notifications.
- Agrandissement des espacements et des marges internes sur ordinateur.
- Règles mobiles spécifiques pour conserver des libellés lisibles sans faire déborder les cartes.
- Le thème sombre garde les couleurs et variables existantes ; le lot agit sur la typographie, les proportions et l'espacement, pas sur une recoloration générale.
- Fichiers : `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-masar.mjs`, `ci/check-public-portal.mjs`.
- Cache CSS : `style-prototype-dz.css?v=178`.
- Service Worker : `dz-de-v3.185.0.0.96`.

### Validation et limites
- La CI #2534 avait confirmé le commit précédent `d622bda`.
- Les workflows du Lot 159 ont été déclenchés successivement par les mises à jour des fichiers. Le dernier commit de code/contrôles est `faf8a09a70437b7d35906ec983a67cd298837062`; la CI #2537 était en attente au moment de la rédaction. Ne pas annoncer la réussite du Lot 159 avant le résultat final sur le HEAD.
- Aucun rendu navigateur réel ni capture desktop/tablette/mobile n'a été réalisé dans ce lot. Les règles CSS ont été mises à jour et les breakpoints explicitement définis, mais cela ne vaut pas recette visuelle.
- Le tableau de bord reste à comparer visuellement avec les deux prototypes et à corriger sur la base des écarts observés.

### Périmètre préservé
- PR #17 ouverte et non fusionnée ; aucune modification de `main`.
- Aucun changement de routes, identifiants, handlers, `data-view="dashboard"` ou de la vue existante `فضائي الدراسي`.
- Aucun changement Auth, Supabase, RLS, schéma, migrations ou paiement.
- Aucun déploiement de production revendiqué.


### Addendum Lot 159 — résultat de validation (9 novembre 2026, 10:07 UTC)
- CI #2540 : **succès** sur le commit `3066563fe295d53511c39f8ae8b3c4d00eb4518b`.
- Contrôles réussis sur ce commit : portail public, tableau de bord مسارك, recherche/notifications, XP et badges, accès et tests de fuite, matrice des parcours, régression des trois niveaux et contrôle pédagogique.
- Les échecs intermédiaires #2537–#2539 ont révélé des assertions de cache non synchronisées dans `check-masar.mjs`, `check-gamification.mjs` et `check-public-portal.mjs`. Elles ont été corrigées ; la validation finale #2540 est verte.
- Le dernier commit de code est donc validé. L'ajout de cette note de continuité crée un commit documentaire distinct ; vérifier l'état de la PR et de ses validations après cet ajout.


## Lot 160 — correction des sélecteurs typographiques des cartes matières (9 novembre 2026)

### Défaut confirmé dans le code source
- Le HTML produit par `renderStudentDashboardSubjects()` utilise `.sd-subject-name`, `.sd-subject-language`, `.sd-subject-meta`, `.sd-subject-progress` et `.sd-subject-open`.
- Les règles ajoutées au Lot 159 ciblaient encore les anciennes classes `.sd-subject-copy` et `.sd-subject-card > strong`, qui ne sont pas générées par cette fonction.
- Résultat : les tailles annoncées pour les noms et descriptions de matières n'étaient pas appliquées à ces éléments. Il s'agissait d'un défaut concret de ciblage CSS, pas d'un problème de données.

### Correctif
- Remplacement des sélecteurs obsolètes par les classes réellement produites par le rendu JavaScript.
- Hiérarchie desktop : nom de matière 15 px, langue 12 px, métadonnées 11 px, libellé de progression 11 px, action 12 px et statut 10 px.
- Adaptation mobile dédiée : nom 13 px, langue/métadonnées 10 px, progression 9 px et action 10 px.
- Le layout flex des cartes est conservé ; suppression de l'ancienne tentative de colonnes CSS Grid sur ces cartes.
- Cache CSS : `style-prototype-dz.css?v=179`.
- Service Worker : `dz-de-v3.185.0.0.97`, précache CSS synchronisé.
- Assertions ajoutées à `ci/check-masar.mjs` pour vérifier les sélecteurs et tailles réellement attendus.

### Fichiers modifiés
- `style-prototype-dz.css`, `index.html`, `sw.js`.
- `ci/check-masar.mjs`, `ci/check-public-portal.mjs`, `ci/check-gamification.mjs`.
- Présent dossier de continuité.

### Validation et limites
- Correctif appliqué sur `design/prototypes-67-74-alignment`, exclusivement dans la PR #17.
- La CI doit encore être exécutée sur le nouveau HEAD ; aucune réussite n'est revendiquée avant son résultat.
- Aucun nouveau déploiement Cloudflare n'est revendiqué pour ce lot.
- Aucune recette navigateur ou capture desktop/mobile n'a été effectuée ; le correctif est confirmé par correspondance source HTML/CSS et garde CI.
- PR #17 reste ouverte et non fusionnée ; `main` n'est pas modifiée.
- Aucun changement Auth, Supabase, RLS, schéma, migration, paiement, route, identifiant ou gestionnaire d'événement.


## Lot 162 — palette chromatique distincte des cartes matières (9 novembre 2026)

### Comparaison avec les prototypes
- Le prototype multi-matières présente des cartes visuellement différenciées par discipline (jaune, indigo, violet, vert, etc.).
- Le rendu réel du tableau de bord affichait les matières actives/partielles sur des fonds presque uniformes, et les matières programmées partageaient un fond neutre.
- Le catalogue réel `assets/bdd/matieres.json` fournit des identifiants stables pour 14 matières. Aucun pourcentage de progression fictif n'est ajouté.

### Correctif
- Attribution d'une classe de palette à partir d'une liste blanche d'identifiants : allemand ambre, mathématiques indigo, physique violet, SVT émeraude, espagnol rose, italien turquoise, français bleu, anglais rouge, arabe vert, philosophie ardoise, histoire-géographie cyan, économie orange, informatique bleu ciel, islam olive.
- La palette distingue les disciplines sans modifier les statuts pédagogiques « active », « partielle » ou « programmée ».
- Application aux fonds, bordures, icônes, barres de progression et liens d'action.
- Variantes dédiées au thème sombre avec fonds assombris et contrastes conservés.
- Cache CSS : `style-prototype-dz.css?v=180`.
- Service Worker : `dz-de-v3.185.0.0.98`, précache synchronisé.
- Assertions CI ajoutées pour contrôler la correspondance des identifiants, les palettes et le thème sombre.

### Fichiers modifiés
- `app.js`, `style-prototype-dz.css`, `index.html`, `sw.js`.
- `ci/check-masar.mjs`, `ci/check-public-portal.mjs`, `ci/check-gamification.mjs`.
- Présent dossier de continuité.

### Validation et limites
- Modifications effectuées exclusivement sur `design/prototypes-67-74-alignment` / PR #17.
- La CI du nouveau HEAD doit confirmer les assertions ; aucune réussite n'est revendiquée avant son résultat.
- Pas de déploiement Cloudflare revendiqué pour ce lot.
- Aucune capture navigateur n'a été prise ; la comparaison est fondée sur le HTML des prototypes et le rendu source du dépôt.
- PR #17 reste ouverte/non fusionnée ; `main` inchangée.
- Aucun changement de routes, identifiants de vues, gestionnaires de navigation, Supabase, Auth, RLS, schéma, migration ou paiement.


## Lot 163 — accessibilité du graphique d’activité hebdomadaire (9 novembre 2026)

### Audit des indicateurs et comparaison prototype
- Le prototype multi-matières contient un radar « تطوري في المواد » avec des valeurs fixes (65, 45, 80, 70, 75, 68). Ces valeurs sont des données de démonstration : elles ne sont pas reprises dans le tableau de bord réel.
- Le tableau de bord réel affiche les résultats par unité depuis `unitQuiz` et la progression des unités depuis les séances réellement terminées. Le titre existant « مؤشرات الأداء حسب الوحدة » décrit correctement ces résultats ; aucune compétence linguistique indépendante n'est inventée.
- Le graphique hebdomadaire est un indicateur binaire de présence d'activité, et non une mesure de durée ou d'intensité. Sa source est `g.activeDays`, limitée à la fenêtre des sept derniers jours.

### Correctif
- Ajout d'un rôle de groupe et d'un nom accessible en arabe au graphique hebdomadaire.
- Chaque barre/jour expose maintenant un libellé accessible comprenant le jour, la date ISO locale et l'état « jour actif » ou « aucune activité enregistrée ».
- Les données, la fenêtre temporelle, les calculs et l'apparence visible du graphique restent inchangés.
- Cache application : `app.js?v=3552`.
- Service Worker : `dz-de-v3.185.0.0.99`, précache de l'application synchronisé.
- Assertions ajoutées au contrôle du tableau de bord ; références de cache synchronisées dans le contrôle du portail.

### Périmètre et validation
- Lot limité à l'accessibilité du graphique et aux références de cache ; aucun changement Auth, Supabase, RLS, schéma, migration, paiement, route, identifiant de vue ou gestionnaire métier.
- Modifications exclusivement sur `design/prototypes-67-74-alignment` / PR #17.
- Pas de capture navigateur, de validation visuelle manuelle ni de nouveau déploiement Cloudflare revendiqué.
- PR #17 doit rester ouverte et non fusionnée ; `main` reste inchangée.


### Addendum de cohérence CI — Lot 163
- Les contrôles `ci/check-masar.mjs` et `ci/check-public-portal.mjs` vérifient tous deux la version réelle du Service Worker `dz-de-v3.185.0.0.99`.
- Le contrôle du graphique hebdomadaire vérifie le rôle de groupe et le libellé date/état de chaque barre.
- Le premier passage CI a détecté des assertions de version restées sur v98 ; elles ont été synchronisées avec le worker v99. Un passage CI sur le HEAD final reste à confirmer.


### Addendum cache — Lot 163
- Le cache de l'application passe à `app.js?v=3553` et le Service Worker à `dz-de-v3.185.0.0.100`.
- Les contrôles du portail et du tableau de bord ont été synchronisés avec ces références.
- Une infobulle native reprend le même libellé jour/date/activité que l'alternative accessible du graphique hebdomadaire.


### Addendum accessibilité — Lot 163
- Le conteneur hebdomadaire porte également une description de rôle (« مخطط نشاط ») afin d'annoncer la nature du composant aux lecteurs d'écran.
- Cache : `app.js?v=3554` ; Service Worker : `dz-de-v3.185.0.0.101`.
- Les assertions CI et le précache sont alignés sur ces versions.


## Lot 164 — composition des métriques du bandeau étudiant (9 novembre 2026)

### Référence prototype
- Le prototype étudiant présente une bannière d'accueil colorée, avec les métriques secondaires regroupées en cartes compactes à côté du message de bienvenue et de l'objectif hebdomadaire.
- Dans la version réelle, les valeurs disponibles sont différentes et restent inchangées : XP du compte, série d'activité calculée depuis les jours enregistrés et niveau calculé par le module de gamification.

### Ajustement visuel
- Sur les grands écrans (à partir de 981 px), les trois métriques réelles passent d'une pile verticale à trois cartes compactes alignées dans la colonne latérale de la bannière.
- Les libellés et valeurs restent lisibles, avec une disposition verticale interne et un espacement cohérent.
- Les règles tablette et mobile existantes sont conservées : bannière sur une colonne à 980 px et moins, métriques sur une colonne à 640 px et moins.
- Aucun chiffre de démonstration du prototype n'est importé.

### Cache et contrôles
- CSS : `style-prototype-dz.css?v=181`.
- Service Worker : `dz-de-v3.185.0.0.102`, précache synchronisé.
- Les contrôles CI du portail, du tableau de bord et de la gamification sont alignés ; une assertion vérifie la nouvelle composition desktop.

### Périmètre
- Modification CSS uniquement pour l'interface ; références de cache, tests et dossier mis à jour.
- Aucune modification des routes, identifiants de vue, données, calculs de progression, modules métier, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`.
- Validation visuelle navigateur et nouveau déploiement Cloudflare non revendiqués.


## Lot 165 — équilibre des panneaux matières et progression (9 novembre 2026)

### Comparaison structurelle
- Le prototype étudiant organise le contenu en panneaux de poids distincts : un bloc principal, un bloc secondaire et des paires équilibrées pour les résultats et recommandations.
- Dans le tableau de bord réel, « مواد شعبتك » et « إنجاز الوحدات » occupaient chacun toute la largeur de la grille principale. Cela créait deux grands panneaux successifs malgré leur complémentarité.
- Le catalogue réel reste issu de assets/bdd/matieres.json ; la progression des unités reste calculée depuis les séances terminées enregistrées.

### Ajustement de composition
- À partir de 641 px, le panneau « مواد شعبتك » occupe 4 colonnes sur 6 (2/3) et « إنجاز الوحدات » 2 colonnes sur 6 (1/3).
- Cette proportion donne la priorité visuelle au catalogue de matières et transforme le graphique des unités en indicateur compact complémentaire.
- À 640 px et moins, les deux panneaux reprennent chacun toute la largeur afin d’éviter un graphique trop étroit et des cartes comprimées.
- Aucun composant, ordre métier, contenu pédagogique, calcul, statut ou action n’est remplacé.

### Cache et contrôles
- CSS : style-prototype-dz.css?v=182.
- Service Worker : dz-de-v3.185.0.0.103, précache CSS synchronisé.
- Les contrôles CI du tableau de bord, du portail public et de la gamification sont synchronisés sur les nouvelles références.
- Le contrôle du tableau de bord vérifie désormais explicitement le panneau et le conteneur de progression des unités, le graphique généré et son état vide, ainsi que les proportions 2/3–1/3.

### Périmètre et limites
- Modifications CSS, références de cache, assertions CI et documentation uniquement.
- Aucun changement Auth, Supabase, RLS, schéma, migration, paiement, route, identifiant de vue, donnée pédagogique ou gestionnaire d’événement.
- PR #17 reste ouverte et non fusionnée ; main n’est pas modifiée.
- La CI doit confirmer le nouveau HEAD après ces commits.
- Aucune capture réelle de navigateur ni publication Cloudflare du nouveau HEAD n’est revendiquée. La validation visuelle desktop/tablette/mobile reste à effectuer sur le rendu déployé.


## Lot 166 — finition responsive des cartes matières et indicateurs (9 novembre 2026)

### Ajustements de composition
- Le ratio catalogue/progression 2:1 du Lot 165 est conservé sur desktop.
- Entre 641 et 980 px, « مواد شعبتك » et « إنجاز الوحدات » occupent chacun toute la largeur de la grille principale. Cela évite de comprimer le graphique des unités dans les largeurs tablette.
- Sous 640 px, l'empilement pleine largeur déjà établi est conservé.

### Lisibilité des contenus
- Les statuts de matière peuvent revenir à la ligne sans dépasser la carte.
- Les titres, langues, descriptions, libellés de progression et actions disposent de tailles et interlignes explicites ; les tailles mobiles restent plus compactes.
- Les barres du graphique des unités conservent leurs pourcentages réels ; les libellés passent à 10 px et la hauteur des pistes est ajustée à 88 px pour densifier le panneau.
- Les détails des résultats de quiz sont portés à 11 px, avec davantage d'espacement vertical. Les données restent les résultats enregistrés par unité, sans extrapolation en compétences linguistiques.

### Cache et contrôles
- CSS : style-prototype-dz.css?v=183.
- Service Worker : dz-de-v3.185.0.0.104 ; précache CSS synchronisé.
- Les contrôles CI du tableau de bord, du portail public et de la gamification sont alignés sur les nouvelles références.
- Le contrôle du tableau de bord vérifie la pleine largeur tablette, l'adaptation des statuts et la lisibilité des libellés des graphiques et résultats.

### Périmètre et état
- Modifications limitées à CSS, références de cache, assertions CI et dossier de continuité.
- Aucun changement JavaScript métier, donnée, route, identifiant de vue, événement, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur main.
- La validation CI du nouveau HEAD, les captures réelles navigateur sur desktop/tablette/mobile et le déploiement Cloudflare restent à confirmer séparément.


### Addendum CI — Lot 166
- Après la mise à jour des références, deux assertions regex conservaient les anciennes valeurs v182 / worker .103. Elles ont été alignées sur CSS v183 et worker .104 dans les contrôles du tableau de bord et de la gamification.
- Les assertions couvrent les nouvelles règles responsive et la lisibilité des libellés ; le résultat d'exécution GitHub Actions sur le HEAD final reste à confirmer.


## Lot 167 — finition visuelle des objectifs et badges (9 novembre 2026)

### Rectification de l'audit comparatif
- La relecture du HTML réel confirme que « أهدافك التعليمية » et « الشارات والمكافآت » sont déjà deux panneaux côte à côte sur desktop (grille principale 6 colonnes, 3 colonnes par panneau).
- Le panneau de recommandations est déjà placé à côté des résultats de quiz (4/2 colonnes) et l'assistant intelligent reste dans la colonne latérale dédiée.
- La précédente observation selon laquelle objectifs et badges seraient empilés était donc inexacte : aucun déplacement HTML n'était nécessaire. La composition existante est conservée.

### Finition graphique réalisée
- Les trois familles d'objectifs réels (unité, quiz, révision) disposent désormais de tuiles d'icônes colorées distinctes et de fonds légèrement teintés.
- Les badges effectivement débloqués reprennent des tuiles plus grandes, avec des dégradés alternés (or, bleu, vert, violet) dans l'esprit des badges illustrés du prototype.
- Les badges verrouillés restent visuellement atténués ; leur statut demeure explicite. Aucun badge fictif ou nouvel objectif de démonstration n'est ajouté.
- Les panneaux conservent leur disposition responsive ; les styles sombres ont des fonds adaptés et les animations respectent `prefers-reduced-motion`.

### Cache et contrôles
- CSS : `style-prototype-dz.css?v=184`.
- Service Worker : `dz-de-v3.185.0.0.105`, précache synchronisé.
- Assertions ajoutées aux contrôles du tableau de bord et de gamification pour les palettes d'objectifs, les badges ouverts, le thème sombre et la réduction des animations.
- Références CSS et Service Worker alignées dans le contrôle du portail public.

### Périmètre et état
- Modification limitée à CSS, références de cache, assertions CI et documentation.
- Aucun changement JavaScript métier, HTML structurel, donnée, calcul, route, identifiant de vue, gestionnaire d'événement, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`.
- La CI du nouveau HEAD doit encore s'exécuter. Aucun déploiement Cloudflare ni contrôle visuel navigateur n'est revendiqué.


## Lot 168 — bannière horizontale de l'assistant pédagogique (9 novembre 2026)

### Écart confirmé sur le prototype
- Le prototype étudiant présente « الأستاذ الافتراضي الذكي » comme une bannière horizontale mise en évidence, avec un bloc descriptif, des capacités visibles et un appel à l'action.
- Dans le tableau de bord réel, le même assistant était enfermé dans la colonne latérale, ce qui réduisait fortement sa présence visuelle et s'écartait de cette composition.

### Correction réalisée
- La carte existante de l'assistant a été déplacée hors de `.sd-aside`, après la grille principale du tableau de bord.
- Elle devient une bannière à deux zones : présentation et capacités à gauche, accès à l'espace professeur à droite.
- Sous 720 px, les éléments s'empilent dans un ordre lisible et le bouton reprend toute la largeur.
- Les messages et notifications restent dans la colonne latérale.
- Le contenu descriptif, les capacités affichées et l'action `data-go="prof"` sont conservés ; aucun moteur IA ni événement métier n'a été modifié.

### Cache et contrôles
- CSS : `style-prototype-dz.css?v=185`.
- Service Worker : `dz-de-v3.185.0.0.106`, précache CSS synchronisé.
- Le contrôle du tableau de bord vérifie désormais la position de la bannière, sa grille horizontale et son empilement mobile.

### Périmètre et limites
- Modification HTML de présentation, CSS, références de cache, assertions CI et dossier de continuité uniquement.
- Aucun changement de route, identifiant de vue, données, calculs, événements métier, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`.
- Le contrôle navigateur réel et la publication Cloudflare du nouveau HEAD restent à effectuer séparément ; la CI ne vaut pas validation visuelle.


### Addendum CI — Lot 168
- La première exécution après déplacement de la bannière a échoué uniquement parce que `ci/check-masar.mjs` conservait deux expressions de version CSS v184 et Service Worker .105.
- Les assertions ont été corrigées vers CSS v185 et Service Worker .106. La nouvelle exécution sur le HEAD corrigé doit confirmer l'ensemble du lot.

- Une seconde assertion de précache dans `ci/check-gamification.mjs` conservait elle aussi CSS v184 ; elle a été alignée sur v185 après la première exécution. Le contrôle du tableau de bord et celui des interactions ont passé lors de cette exécution ; le contrôle XP/badges doit être rejoué sur le HEAD corrigé.


## Lot 169 — ordre du tableau de bord et correction HTML (9 novembre 2026)

### Comparaison avec le prototype étudiant
- La relecture de `Qwen_html_20261021_bxmtbklup.html` confirme que la bannière « الأستاذ الافتراضي الذكي » est présentée juste après la zone de bienvenue et de progression, avant la carte de la خريطة التعلم البيداغوجية.
- Dans la composition de la PR, elle avait été déplacée à la fin du tableau de bord. La bannière est donc repositionnée avant `.sd-path-panel` pour rétablir l'ordre narratif du prototype : accueil → assistant → parcours pédagogique → panneaux de suivi.

### Correction de structure
- Suppression d'une balise fermante `</section>` orpheline découverte dans `.sd-aside` lors de la relecture du HTML final du lot 168.
- Les panneaux messages et notifications restent dans la colonne latérale.
- Ajout d'assertions CI sur l'ordre assistant/parcours et l'absence de cette balise orpheline.
- Aucun contenu de données, fonction JavaScript, route, identifiant de vue ou action utilisateur n'a été modifié.

### Périmètre
- Fichiers modifiés : `index.html`, `ci/check-masar.mjs`, présent dossier de continuité.
- CSS v185 et Service Worker .106 inchangés : aucune modification de ressource CSS ni de cache n'est nécessaire pour ce déplacement HTML.
- PR #17 maintenue ouverte et non fusionnée ; `main` non modifiée. Validation navigateur et déploiement restent à faire.


### Addendum CI — Lot 169
- La CI #2609 a révélé une erreur de syntaxe dans l'expression régulière ajoutée pour détecter une balise orpheline : les antislashs étaient doublés dans le littéral regex, ce qui faisait interpréter le séparateur final comme des indicateurs invalides.
- Le littéral a été corrigé avec les échappements JavaScript appropriés (`\\s` et `\\/`). La vérification porte toujours sur le même défaut HTML ; elle ne change pas le rendu ni le comportement applicatif.
- La CI doit être relancée sur le nouveau HEAD. La PR reste ouverte et non fusionnée.


## Lot 170 — rétablissement de l'ordre exact du prototype étudiant (9 novembre 2026)

### Rectification après relecture intégrale du prototype
- La lecture complète de `Qwen_html_20261021_bxmtbklup.html` montre que le prototype étudiant place la carte de la خريطة التعلم البيداغوجية juste après le bandeau d'accueil, puis les panneaux d'analyse, objectifs et badges, et enfin la bannière de l'assistant virtuel.
- L'ordre « assistant avant parcours » documenté au Lot 169 était donc une interprétation erronée de l'ordre visuel du prototype. Le lot 169 avait remis la bannière trop tôt ; cette position est corrigée ici.

### Correction réalisée
- La bannière existante `sd-ai-feature` est replacée après la grille principale `sd-layout`, donc après les panneaux de suivi et la colonne messages/notifications.
- Son contenu, son style horizontal, son bouton `data-go="prof"` et ses capacités restent inchangés.
- L'assertion CI vérifie désormais que la carte du parcours précède la bannière assistant, conformément au prototype étudiant.
- Les cinq raccourcis existants et leurs actions sont conservés ; aucune route, donnée, logique métier ou accès n'est supprimé.

### Périmètre
- Fichiers modifiés : `index.html`, `ci/check-masar.mjs`, présent dossier de continuité.
- Aucun changement CSS/cache, JavaScript métier, route, identifiant de vue, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée. La CI du nouveau HEAD doit confirmer le déplacement. La validation visuelle navigateur reste distincte.


## Lot 171 — hiérarchie du tableau de bord et raccourcis secondaires (9 novembre 2026)

### Écart constaté à la comparaison du prototype
- Le prototype étudiant enchaîne le bandeau d'accueil directement avec la carte du parcours pédagogique. La grille des cinq raccourcis `sd-quick` n'existe pas dans cette maquette de référence et, placée avant le parcours, repoussait le contenu pédagogique principal vers le bas.
- Ces cinq raccourcis restent une fonction utile déjà présente dans le produit ; ils ne sont donc pas supprimés. Ils sont reclassés comme accès complémentaires après la bannière de l'assistant, en fin de tableau de bord.

### Correction
- Ordre principal : accueil → parcours pédagogique → panneaux de matières/progression/compétences/recommandations/objectifs/badges/activité et colonne latérale → assistant virtuel → raccourcis complémentaires.
- Les cinq boutons et leurs destinations `data-go` sont conservés à l'identique.
- Ajout d'une assertion CI vérifiant que les raccourcis ne précèdent plus le parcours et l'assistant.

### Périmètre
- Fichiers modifiés : `index.html`, `ci/check-masar.mjs`, présent dossier de continuité.
- Aucun changement de CSS, de cache, de logique métier, de route, de données, d'authentification, de Supabase/RLS, de schéma, de migration ou de paiement.
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée. Validation CI en attente ; aucune validation visuelle navigateur ni aucun déploiement revendiqué.


## Lot 172 — différenciation visuelle des graphiques et indicateurs (9 novembre 2026)

### Comparaison avec les deux prototypes
- Relecture des prototypes originaux Qwen_html_20261021_bxmtbklup.html et Qwen_html_20261021_juv5xelun.html retrouvés dans la bibliothèque.
- Le second prototype présente les matières sous forme de cartes multicolores et un graphique radar de démonstration ; le premier emploie un radar illustratif pour six compétences.
- Les données de démonstration ne sont pas transposables telles quelles dans les comptes réels. Le tableau de bord actuel possède des résultats de quiz cumulés par unité, pas une mesure valide des six compétences linguistiques du prototype.

### Correction appliquée
- Le graphique vertical des unités distingue désormais les états calculés depuis les séances : terminée (émeraude), commencée (indigo) et non commencée (ardoise).
- Ajout d'une légende explicite et d'un libellé accessible pour chaque unité ; nombres, pourcentages et décomptes existants inchangés.
- Les résultats de quiz par unité reçoivent une palette chromatique alternée (ambre, indigo, violet, émeraude, rose et bleu), avec une hiérarchie renforcée des cartes et des barres.
- Variantes clair/sombre, mobile et préférence de réduction des animations couvertes.
- Aucun radar artificiel ni indicateur de maîtrise linguistique non mesuré n'est ajouté.

### Cache et contrôles
- CSS : style-prototype-dz.css?v=186.
- Application : app.js?v=3555.
- Service Worker : dz-de-v3.185.0.0.107, précache synchronisé.
- Contrôles CI du tableau de bord et du portail public actualisés ; assertions ajoutées pour les trois états, la légende, la palette des résultats et le thème sombre.
- CI #2617 réussie sur le commit a9e9029d154f64a3907c6708d89a78796f61a849 : contrôles مسارك, XP/badges, accès, régressions et parcours pédagogiques tous réussis.

### Périmètre et limites
- Fichiers modifiés : app.js, style-prototype-dz.css, index.html, sw.js, ci/check-masar.mjs, ci/check-public-portal.mjs et le présent dossier.
- Aucun changement aux données pédagogiques, calculs, routes, identifiants HTML, événements métier, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; main n'est pas modifiée.
- Aucun déploiement Cloudflare ni validation visuelle navigateur n'est revendiqué. Vérification du rendu desktop/tablette/mobile à effectuer sur la prévisualisation correspondant au nouveau HEAD.


### Addendum pré-validation — Lot 172
- Relecture du contrôle après création du commit : deux familles d'assertions devaient suivre le nouveau cache CSS v186 et les sélecteurs CSS ajoutés devaient être échappés avec un seul niveau dans les littéraux regex JavaScript.
- Les assertions de version et de palette ont été alignées avant de considérer le Lot 172 validé. La validation complète du nouveau HEAD reste à attendre.


### Addendum CI — alignement XP et badges
- La CI #2616 a confirmé les contrôles du tableau de bord et de مسارك, puis a détecté une dernière assertion de précache CSS v185 dans ci/check-gamification.mjs.
- Cette assertion a été alignée sur la version v186. Le contrôle XP/badges et la suite complète doivent être rejoués sur le nouveau HEAD.


### Validation finale — Lot 172
- CI #2615 : échec initial sur l'assertion de cache CSS restée en v185 dans le contrôle du tableau de bord.
- CI #2616 : les contrôles du tableau de bord ont passé ; le contrôle XP/badges a révélé une seconde assertion de précache CSS v185.
- Les deux assertions ont été actualisées (check-masar.mjs et check-gamification.mjs), ainsi que le contrôle du portail public.
- CI #2617 : réussie sur a9e9029d154f64a3907c6708d89a78796f61a849. La suite complète des validations structurelles, pédagogiques, d'accès, XP/badges et de régression est passée.
- Le résultat CI ne remplace pas la vérification visuelle du rendu réel ; aucun déploiement Cloudflare n'est déclaré.


## Lot 173 — cartes matières : hiérarchie et responsive (9 novembre 2026)

### Comparaison avec le deuxième prototype
- Le prototype utilise des cartes de matières en deux colonnes sur les écrans larges, avec icônes de 48 px, titres proéminents, descriptions lisibles, surfaces teintées et barres de progression épaisses.
- Le tableau de bord réel disposait déjà de deux colonnes internes, d'une palette par matière et de statuts réels, mais les icônes restaient à 38 px et les cartes gardaient des espacements/typographies plus compacts.
- La grille ne passait à une colonne qu'à 420 px ; elle restait donc trop serrée sur plusieurs formats de téléphone.

### Ajustements appliqués
- Icônes portées à 48 px sur desktop, titres à 16 px, descriptions/langues à 12 px, statuts à 11 px et barres de progression à 8 px.
- Cartes mieux respirées : padding 17 px, rayon 18 px, ombre discrète et élévation au survol.
- Sous 640 px, les cartes passent sur une seule colonne ; icônes à 42 px et tailles typographiques adaptées sans devenir microscopiques.
- Les accents chromatiques par matière, statuts actif/partiel/planifié, données et destinations restent inchangés.
- Le mode sombre et prefers-reduced-motion sont pris en charge.

### Cache et contrôles
- CSS : style-prototype-dz.css?v=187.
- Service Worker : dz-de-v3.185.0.0.108 ; précache synchronisé.
- Assertions ajoutées pour les dimensions d'icônes, la typographie et la grille mobile.
- Le Lot 172 a passé la CI #2617 sur le commit a9e9029 ; la validation du nouveau lot reste à attendre.

### Périmètre
- Fichiers modifiés : style-prototype-dz.css, index.html, sw.js, ci/check-masar.mjs, ci/check-gamification.mjs, ci/check-public-portal.mjs et ce dossier.
- Aucun changement HTML, JavaScript métier, donnée pédagogique, route, événement, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée. Aucun commit n'est effectué sur main.
- Aucune validation navigateur ni publication Cloudflare n'est revendiquée.


### Addendum CI — Lot 173
- La CI #2619 a validé les ressources, la syntaxe JavaScript et le contrôle du portail, puis a échoué sur la nouvelle assertion regex du breakpoint mobile.
- La règle CSS mobile était bien présente ; c'est l'assertion qui avait un niveau d'échappement incorrect. Elle est remplacée par une vérification directe de la règle CSS exacte afin d'éviter une nouvelle erreur regex.
- Le nouveau HEAD doit repasser la suite complète avant validation du Lot 173.


### Validation finale — Lot 173
- CI #2619 : échec sur une assertion regex responsive mal échappée ; le contrôle a été remplacé par une vérification directe de la règle CSS attendue.
- CI #2620 : réussie sur dd2c2f92f95a7a733cefd5de5d1df59aa186fa4d. Contrôles du tableau de bord, XP/badges, accès, régressions et validations pédagogiques réussis.
- Le Lot 173 est validé structurellement. La vérification du rendu réel sur navigateur reste à effectuer ; aucune publication Cloudflare n'est revendiquée.


## Lot 174 — graphiques : cohérence des couleurs et interprétation (9 novembre 2026)

### Référence prototypes
- Le prototype Qwen_html_20261021_bxmtbklup.html présente un graphique radar des compétences linguistiques (vocabulaire, grammaire, compréhension, expression, écoute, écriture), accompagné de quatre cartes colorées. Ses pourcentages sont des données de démonstration et ne doivent pas être importés.
- Le prototype Qwen_html_20261021_juv5xelun.html présente un radar comparatif des matières, lui aussi alimenté par des valeurs statiques fictives.
- Le tableau de bord réel ne dispose pas de résultats structurés fiables par compétence linguistique ou par matière. Il expose des résultats par unité issus des tentatives enregistrées. Le graphique radar des prototypes ne peut donc pas être reproduit honnêtement avec les données actuelles.

### Défaut constaté et correction
- Les lignes du panneau « مؤشرات الأداء حسب الوحدة » recevaient leurs couleurs via nth-child. La couleur dépendait de la position DOM et non de l'identifiant de l'unité.
- Remplacement par une classe de palette stable calculée depuis le numéro d'unité (is-tone-1 à is-tone-6). La même unité conserve ainsi son accent même si l'ordre ou le sous-ensemble affiché change.
- Ajout d'une explication visible : les couleurs distinguent les unités, elles ne représentent pas un niveau de réussite.
- Les pourcentages, nombres de réponses correctes, tentatives, seuil de petite taille d'échantillon et données sources restent inchangés.
- Les barres d'avancement des unités restent colorées selon leur état réel (complétée, commencée, non commencée).

### Cache et contrôles
- CSS : style-prototype-dz.css?v=188.
- Application : app.js?v=3556.
- Service Worker : dz-de-v3.185.0.0.109 ; précache synchronisé.
- Contrôle مسارك : vérification de la palette stable et de l'explication des couleurs ; interdiction de revenir aux couleurs indexées sur nth-child.
- CI du Lot 173 : #2620 réussie sur dd2c2f92f95a7a733cefd5de5d1df59aa186fa4d.

### Limites et périmètre
- Le radar des prototypes n'est pas reproduit car les axes/compétences et les valeurs du prototype ne correspondent pas à une source de données fiable par élève.
- Aucun ajout de Chart.js, aucune dépendance frontend.
- Aucune modification des résultats, du moteur de quiz, des routes, des événements, des données pédagogiques, Auth, Supabase, RLS, schéma, migration ou paiement.
- PR #17 reste ouverte et non fusionnée ; main n'est pas modifiée.
- CI et contrôle visuel navigateur du nouveau HEAD restent à attendre ; aucun déploiement Cloudflare n'est revendiqué.


### Addendum CI — Lot 174
- La CI #2622 a exécuté les contrôles jusqu'au tableau de bord, puis a échoué car check-masar.mjs exigeait encore l'ancienne règle CSS nth-child(6n+1), supprimée au profit des classes stables is-tone-1 à is-tone-6.
- Le défaut est dans l'assertion CI, pas dans le rendu : le contrôle est actualisé pour vérifier les sélecteurs stables is-tone-1 et is-tone-6, et continue à interdire le retour à nth-child.
- La suite complète doit être rejouée sur le nouveau HEAD.


### Validation CI — Lot 174
- CI #2622 : échec initial uniquement sur une ancienne assertion de palette nth-child dans ci/check-masar.mjs, alors que les nouvelles classes stables is-tone-* étaient déjà présentes.
- Correction de l'assertion : vérification des classes is-tone-1 et is-tone-6, et interdiction du retour à nth-child.
- CI #2623 : réussie sur le commit d372ac5215b2bcf30336c7610db27bdde3bd1ad0. Le contrôle مسارك et l'ensemble des contrôles suivants sont passés.
- Le changement est validé structurellement. La vérification visuelle navigateur sur ordinateur/tablette/téléphone reste à faire ; aucune publication Cloudflare n'est déclarée.


## Lot 175 — badges : palette stable par catégorie (9 novembre 2026)

### Défaut identifié
- Dans l’aperçu du tableau de bord, les accents des badges ouverts étaient distribués avec nth-child. La couleur dépendait donc de l’ordre de présentation (notamment du sous-ensemble des quatre badges récents), pas de la nature de la réussite.

### Correction appliquée
- Attribution de six tons sémantiques à partir de l’identifiant réel du badge : séances, quiz, résultats, XP, régularité et unités terminées.
- Les classes is-tone-1 à is-tone-6 sont ajoutées au rendu des badges sans changer leur identifiant, leur condition d’obtention, leur ordre, ni le calcul des récompenses.
- Les badges ouverts conservent une palette colorée cohérente ; les badges non ouverts restent visuellement distincts par une surface atténuée et un contour discontinu, sans rendre leur titre illisible.
- Ajustement de la palette en thème sombre et maintien de la grille responsive.

### Cache et contrôles
- CSS : style-prototype-dz.css?v=189 ; application : app.js?v=3557.
- Service Worker : dz-de-v3.185.0.0.110 ; précache synchronisé.
- Assertions ajoutées pour les six catégories, la stabilité des tons, le thème sombre et l’absence de sélecteurs nth-child pour les badges.
- CI #2627 : réussie sur le commit 318753942382330a37e4175a5841a1b109bb3b1a ; contrôles du tableau de bord, XP/badges, accès, régressions et validations pédagogiques passés.

### Périmètre et limites
- Changement limité au rendu des badges et aux contrôles de cohérence/cache.
- Aucun changement au moteur XP, aux données, aux objectifs pédagogiques, aux routes, aux événements, à Auth, Supabase, RLS, schéma, migrations ou paiements.
- PR #17 reste ouverte et non fusionnée ; aucun commit sur main.
- Aucun rendu navigateur ni déploiement Cloudflare n’est déclaré.


### Addendum CI — Lot 175
- La CI #2625 a validé la syntaxe JavaScript, les contrôles documentaires, le portail public et les vérifications précédant le tableau de bord. Elle s’est arrêtée sur une assertion de version du Service Worker restée en v3.185.0.0.109 dans ci/check-masar.mjs ; le Service Worker et le précache étaient déjà en v3.185.0.0.110.
- L’assertion de contrôle est alignée sur v3.185.0.0.110. La suite complète doit être relancée sur le nouveau commit avant de déclarer le Lot 175 validé.

- La CI #2626 a ensuite détecté deux assertions historiques nth-child(4n+2) dans ci/check-masar.mjs. Elles exigeaient l’ancienne palette positionnelle que le Lot 175 remplace volontairement. Elles sont alignées sur les tons sémantiques is-tone-2/is-tone-6, avec un garde-fou empêchant le retour à nth-child. Relancer la suite complète sur le prochain commit.


### Validation finale — Lot 175
- CI #2625 : échec sur une assertion de version du Service Worker restée en v3.185.0.0.109 ; corrigée dans ci/check-masar.mjs.
- CI #2626 : échec sur deux assertions historiques nth-child de la palette badges ; elles ont été remplacées par des contrôles is-tone-* stables.
- CI #2627 : réussie sur le commit 318753942382330a37e4175a5841a1b109bb3b1a. Les 33 étapes du job de validation sont terminées avec succès.
- La validation structurelle ne remplace pas un contrôle visuel du rendu navigateur ; aucune prévisualisation Cloudflare n’est déclarée vérifiée.


## Lot 176 — fiabilisation du flux Supabase Auth et retour visuel (9 novembre 2026)

### Audit du flux existant
- Le client Supabase JS v2 était déjà initialisé dans `supabase/supabase.js` ; aucun second client ni nouveau CDN n'est ajouté.
- Le formulaire de connexion pouvait poursuivre vers `AUTH.login` local après un refus Supabase en ligne. Le formulaire d'inscription pouvait de même créer un compte local après un échec cloud ou une inscription nécessitant une confirmation email.
- Ce repli rendait l'état affiché ambigu et pouvait créer deux identités non synchronisées.
- Le déclencheur SQL existant impose déjà le rôle `eleve` à l'inscription, sans lire un rôle fourni dans les métadonnées client. Aucun SQL ni politique RLS n'a été modifié.

### Corrections
- En ligne, connexion et inscription utilisent exclusivement Supabase ; une erreur d'identifiants, un client indisponible ou un profil cloud introuvable affiche une erreur et ne crée pas de session locale.
- Le mode local reste disponible explicitement hors ligne, sur localhost et via le mode démo.
- L'inscription retourne désormais la session Supabase lorsqu'elle existe. Si la confirmation email est activée et qu'aucune session n'est encore fournie, l'interface demande de vérifier le courriel au lieu de déclarer une connexion locale réussie.
- Ajout de `getSession()` dans le client et retour structuré des erreurs de déconnexion ; `signOut({scope:'local'})` évite de fermer les autres appareils.
- États d'erreur plus visibles dans le portail clair/sombre.

### Cache et contrôles
- Application : `app.js?v=3558` ; client : `supabase/supabase.js?v=3512`.
- CSS : `style-prototype-dz.css?v=190` ; Service Worker : `dz-de-v3.185.0.0.111`.
- Assertions Auth ajoutées au contrôle existant `ci/check-public-portal.mjs`.

### Périmètre et limites
- Fichiers modifiés : `app.js`, `supabase/supabase.js`, `style-prototype-dz.css`, `index.html`, `sw.js`, `ci/check-public-portal.mjs` et présent dossier.
- Aucune modification du schéma, des migrations, des politiques RLS, des profils existants, des paiements ou des autorisations administratives.
- PR #17 reste ouverte et non fusionnée ; `main` n'est pas modifiée.
- La CI doit valider le nouveau HEAD. Les essais réels d'inscription, confirmation email, connexion, persistance de session et déconnexion nécessitent la prévisualisation Cloudflare et un compte de test ; aucun résultat navigateur ou déploiement n'est présumé.

### Suite esthétique
- Reprendre le tableau de bord étudiant sur les deux prototypes : composition globale, rapport entre bandeau, grille des matières, graphique réel, colonne latérale, assistant vocal, recommandations et messagerie.
- Conserver exclusivement les données et indicateurs réellement disponibles ; les chiffres et graphiques de démonstration des prototypes ne doivent pas devenir des données d'élève.
- Vérifier les proportions desktop, tablette et mobile, la lisibilité RTL et les variantes clair/sombre avant validation visuelle utilisateur.

- Addendum Lot 176 : le retour `session` du signup est explicitement contrôlé séparément de celui du login afin de traiter correctement la confirmation email.


### Addendum CI — Lot 176
- La première CI du Lot 176 a validé le contrôle du portail public et le nouveau contrat Auth, puis le contrôle de مسارك a révélé deux références de cache historiques (CSS v189 et application v3557) dans `ci/check-masar.mjs`. Le contrôle XP/badges référençait lui aussi le CSS v189.
- Les assertions sont alignées sur CSS v190 et app.js v3558 ; aucun rendu métier ni calcul pédagogique n'est modifié par cette correction.
- Relancer la suite complète sur le HEAD suivant ; la validation navigateur et le test Supabase réel restent à effectuer séparément.

- Addendum CI : le contrôle de `مسارك` conservait également une assertion sur l'identifiant du Service Worker v3.185.0.0.110 ; elle est alignée sur v3.185.0.0.111.


## Lot 177 — recomposition esthétique du tableau de bord étudiant (9 novembre 2026)
- Comparaison réalisée entre les deux prototypes HTML fournis et la composition réelle de `data-view="dashboard"`.
- Constat : les éléments existaient déjà (bandeau, 4 indicateurs, parcours, matières, graphiques, recommandations, messages, notifications, assistant IA, raccourcis), mais leur ordre et leur distribution ne reprenaient pas la composition des prototypes ; la carte IA et les raccourcis se retrouvaient notamment en fin de page.
- Réorganisation CSS par zones de grille, sans modifier le HTML, les IDs, les routes, les données, les calculs ou les gestionnaires d'événements : bandeau et statistiques en tête, parcours pédagogique pleine largeur, raccourcis sous le parcours, matières dans la colonne principale et assistant IA dans la colonne latérale ; progression, recommandations, compétences, messagerie, objectifs, notifications, badges et activité répartis ensuite en deux colonnes équilibrées.
- Sous 820 px, la grille devient une colonne avec ordre de lecture explicite ; sous 520 px, densité, marges, titres et raccourcis sont adaptés au mobile.
- Renforcement de la hiérarchie des titres, de la séparation des panneaux, des accents colorés des quatre indicateurs et des ombres ; les couleurs ne représentent aucune note ni aucun niveau de performance.
- Thème sombre conservé et renforcé pour les panneaux et indicateurs.
- Aucun chiffre fictif des prototypes, Chart.js, Tailwind, nouvelle dépendance, changement Supabase, RLS, schéma, paiement ou logique pédagogique ajouté.
- Cache CSS : `style-prototype-dz.css?v=191` ; Service Worker : `dz-de-v3.185.0.0.112`.
- Assertions de cache et de composition ajoutées aux contrôles existants ; CI à exécuter sur le nouveau HEAD.
- Limite : validation CSS structurelle uniquement à ce stade ; il faut encore contrôler la prévisualisation sur grand écran, tablette et mobile avant validation visuelle définitive.

- Addendum CI Lot 177 : les assertions de cache du contrôle `مسارك` sont alignées sur CSS v191 et Service Worker v3.185.0.0.112 ; le contrôle XP/badges vérifie les noms des zones de la grille sans dépendre de l'espacement typographique du CSS.

- Dernier alignement CI Lot 177 : le contrôle XP/badges conservait une seule assertion de précache CSS v190 ; elle est maintenant alignée sur v191. Les autres contrôles de cache et la vérification de `مسارك` ont passé sur le commit précédent.


## Lot 178 — vérification de la session au rechargement (9 novembre 2026)
- L'audit complémentaire a révélé que `bootGate()` ouvrait automatiquement toute session présente dans localStorage, sans distinguer les sessions cloud et les comptes locaux.
- Une session locale n'est désormais acceptée qu'en mode hors ligne, sur localhost ou avec le paramètre de démonstration explicite.
- Une session marquée `src: cloud` est vérifiée avec `SB.getSession()` avant d'ouvrir l'espace étudiant ; le profil Supabase est ensuite rechargé via `cloudAuthority()`.
- Si le jeton ou le profil cloud n'est plus valide, le cache local est effacé et le portail de connexion reste affiché. En mode hors ligne, le cache local continue de permettre l'accès au parcours hors ligne.
- Aucune modification de la base, du déclencheur SQL, des rôles, des politiques RLS ou des paiements.
- Cache application : `app.js?v=3559` ; Service Worker : `dz-de-v3.185.0.0.113`.
- Contrôle Auth ajouté au validateur existant ; CI à relancer. Le test réel de persistance nécessite encore un navigateur et un compte cloud de test.

- Addendum CI Lot 178 : les contrôles de `مسارك` doivent également suivre app.js v3559 et le Service Worker v3.185.0.0.113 ; assertions synchronisées avant la nouvelle validation.


## Lot 179 — restauration du pont d'authentification et des formulaires (9 novembre 2026)
- Le contrôle CI d'administration a détecté que le dernier remplacement de `bootGate()` avait englobé par erreur le bloc adjacent `bindGateEvents()`. Ce bloc contenait les gestionnaires des onglets, des formulaires login/signup, de la récupération de mot de passe et le pont `cloudAuthority()`.
- Le bloc complet a été restauré depuis le HEAD validé précédemment, en conservant les corrections Auth du Lot 176 et les fonctions globales `authLocalMode()` / `showGateError()`.
- Le pont `cloudAuthority()` continue de lire le profil Supabase, de préserver le rôle renvoyé par `profiles.role` dans la session et d'écrire `dz_de_session_v1`. Aucun rôle client n'est accepté comme source d'autorité.
- `bootGate()` peut maintenant vérifier la session au rechargement sans perdre les gestionnaires des formulaires.
- Cache application : `app.js?v=3560` ; Service Worker : `dz-de-v3.185.0.0.114`.
- Le contrôle du portail vérifie désormais explicitement la présence de `bindGateEvents`, `cloudAuthority`, des deux formulaires et des garde-fous Auth.
- La CI précédente a échoué sur `tests/adm_test.mjs` (NAV-ADM-2), précisément parce que le pont de persistance du rôle n'était plus présent ; relancer l'ensemble après restauration.


### Validation du Lot 179 — CI #2638
- La restauration des gestionnaires Auth et du pont cloud a été validée par la CI #2638 sur le HEAD `517a56df3752f009535f164ef5ddebb1d59ba5d2`.
- Le job « Validation structurelle & pédagogique » est terminé avec succès ; ses 33 étapes numérotées sont réussies.
- Cette validation CI ne remplace pas les essais navigateur avec un compte Supabase de test.

## Lot 180 — rééquilibrage du tableau de bord étudiant selon les prototypes (9 novembre 2026)
- Comparaison effectuée avec les deux prototypes Qwen conservés dans la bibliothèque : `Qwen_html_20261021_bxmtbklup.html` et `Qwen_html_20261021_juv5xelun.html`.
- Écart identifié dans la vue indépendante `data-view="dashboard"` : les accès rapides étaient relégués après les panneaux, et l'assistant intelligent occupait une bannière pleine largeur sous la grille. Le prototype 2 place les accès rapides sous le bandeau et l'assistant dans la colonne latérale, avec les recommandations et les messages.
- Réorganisation de la structure HTML : bandeau et statistiques, carte pédagogique, accès rapides, puis grille principale/latérale. L'assistant et les recommandations sont maintenant dans la colonne latérale, avant les messages et les notifications.
- La colonne principale conserve les matières, les graphiques de progression et de résultats, les objectifs, les badges et l'activité.
- Les identifiants `sdPath`, `sdSubjects`, `sdUnitProgress`, `sdSkills`, `sdRecommendation`, `sdGoals`, `sdAchievements`, `sdActivity`, `sdMessages`, `sdUpdates` et les destinations `data-go` sont conservés ; aucun gestionnaire ni moteur pédagogique n'est modifié.
- Adaptation CSS du panneau IA à la largeur de la colonne latérale et de la recommandation à la grille latérale ; thème clair/sombre conservé.
- CSS : `style-prototype-dz.css?v=192` ; Service Worker : `dz-de-v3.185.0.0.115`.
- Contrôles CI mis à jour pour vérifier l'ordre des blocs et leur appartenance à la colonne latérale. La validation complète du nouveau HEAD reste à obtenir.
- Aucun changement Auth, Supabase, RLS, schéma, migration, paiement, données de progression ou logique de récompense. Aucun déploiement Cloudflare ni rendu navigateur n'est revendiqué.
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.


### Validation finale — Lot 180
- CI #2644 : réussie sur le commit de code `3e8ffe8f123bd4d94a639c05307163a50b1db8d6`.
- Le job « Validation structurelle & pédagogique » est terminé avec succès ; les 30 contrôles fonctionnels/pédagogiques et les étapes de préparation/nettoyage sont réussis.
- Les assertions vérifient maintenant l'ordre parcours → accès rapides → grille, ainsi que la présence de l'assistant et des recommandations dans la colonne latérale.
- Les contrôles de cache vérifient CSS v192 et Service Worker v3.185.0.0.115.
- La validation est structurelle et CI uniquement : pas de capture navigateur, pas de test visuel desktop/tablette/mobile, pas de test réel de compte Supabase, et aucun déploiement Cloudflare correspondant n'est déclaré.


## Lot 181 — intégration initiale du MFA Supabase natif (9 novembre 2026)
- Ajout du module mfa-security.js et des wrappers MFA dans supabase/supabase.js : lecture AAL, liste des facteurs vérifiés, challenge, vérification, enrôlement TOTP, désenrôlement et API expérimentale de codes de récupération.
- Le client active l'option auth.experimental.recoveryCodes. L'activation côté client ne suffit pas : la fonctionnalité expérimentale doit aussi être activée dans le projet Supabase Auth ; aucun réglage distant n'a été modifié depuis ce lot.
- La connexion et la restauration d'une session cloud interrogent getAuthenticatorAssuranceLevel(). Si Supabase indique aal1 avec aal2 comme niveau suivant, l'application reste bloquée et affiche le défi MFA.
- Les facteurs TOTP vérifiés sont proposés en priorité ; un facteur téléphone déjà vérifié peut aussi être challengé. L'envoi SMS dépend du fournisseur configuré dans le projet.
- Limitation d'interface à trois essais par défi, puis fermeture de la session locale et retour à la connexion. Ce compteur navigateur n'est pas une protection anti-abus serveur ; les limites Auth Supabase restent nécessaires.
- Ajout dans « حسابي » d'un panneau d'enrôlement TOTP : QR code et secret proviennent de Supabase, affichés uniquement pendant l'enrôlement et non stockés dans localStorage ni dans une table applicative.
- Ajout de la génération native expérimentale des codes de récupération ; les codes en clair sont présentés une seule fois et ne sont pas conservés par l'application. Supabase gère leur vérification et leur consommation unitaire.
- Aucun otplib, secret TOTP statique, OTP de démonstration, table de secrets, migration SQL, changement RLS, Edge Function, fournisseur SMS ou changement de rôle n'est ajouté.
- Fichiers concernés : supabase/supabase.js, mfa-security.js (nouveau), app.js, index.html, style-prototype-dz.css, sw.js et ci/check-public-portal.mjs.
- Références cache : supabase/supabase.js?v=3513, mfa-security.js?v=1, app.js?v=3561, style-prototype-dz.css?v=193, Service Worker dz-de-v3.185.0.0.116.
- Prérequis avant activation réelle : activer la fonctionnalité recovery codes expérimentale dans Supabase Auth ; vérifier la prise en charge côté serveur ; tester avec un compte dédié ; confirmer l'affichage du QR code sur téléphone et la délivrabilité SMS si un facteur téléphone est utilisé.
- La CI structurelle ne prouve pas le fonctionnement réel auprès du projet Supabase : les tests navigateur avec un compte de test restent à faire. Aucune capture navigateur ni aucun déploiement Cloudflare n'est revendiqué.
- L'obligation AAL2 par rôle et les règles d'autorisation des ressources sensibles restent à auditer côté serveur/RLS avant de déclarer le MFA obligatoire pour enseignants, agents ou administrateurs.
- PR #17 reste ouverte et non fusionnée ; main reste inchangée.


### Validation Lot 181 — CI #2660
- La CI #2652 a échoué sur une ancienne assertion CSS v192 dans check-masar ; la CI #2653 a révélé une seconde référence v192 dans check-gamification.
- Les assertions de cache de مسارك, des badges XP et du portail public ont été alignées sur CSS v193, app.js v3561 et Service Worker v3.185.0.0.116.
- Le contrôle CI #2660 est réussi. La syntaxe JS a également été vérifiée séparément pour app.js, mfa-security.js, supabase/supabase.js et sw.js.
- Aucun test navigateur avec un compte Supabase n'a encore été effectué ; le fonctionnement réel MFA et l'activation serveur des codes de récupération restent à confirmer.

## Lot 182 — enrôlement MFA par SMS via Supabase Auth (9 novembre 2026)
- Ajout de l'enrôlement d'un facteur téléphone via l'API native supabase.auth.mfa.enroll({factorType:'phone'}), avec validation E.164.
- Le code SMS est demandé via challenge() puis vérifié via verify() ; le facteur n'est marqué actif qu'après vérification réussie.
- Les facteurs téléphone vérifiés sont affichés dans « حسابي », peuvent être utilisés lors du défi de connexion et peuvent être retirés depuis les réglages de sécurité.
- L'envoi du SMS utilise la configuration du fournisseur de messagerie du projet Supabase Auth, partagée avec l'authentification téléphonique. Aucun SMS n'a été envoyé pendant ce lot et aucun fournisseur n'a été configuré à distance.
- Si un fournisseur spécifique différent de ceux pris en charge nativement est nécessaire, Supabase documente un Send SMS Hook ; aucune Edge Function, clé Twilio ou passerelle locale n'est créée ici.
- Les codes e-mail ne sont pas ajoutés comme second facteur : le MFA natif Supabase documenté prend en charge TOTP et téléphone. L'e-mail reste utilisé pour les parcours de connexion/récupération existants, pas comme facteur AAL2 dans ce lot.
- Cache : supabase/supabase.js?v=3515, mfa-security.js?v=3, CSS v193, app.js v3561, Service Worker dz-de-v3.185.0.0.118.
- Aucun schéma, migration, RLS, rôle, paiement, secret serveur ou déploiement n'est modifié.
- PR #17 reste ouverte et non fusionnée ; main reste inchangée.


### Validation Lot 182 — CI #2670
- CI #2668 a détecté une assertion qui cherchait le formulaire SMS dans index.html alors que ce formulaire est généré dynamiquement par mfa-security.js ; le contrôle a été corrigé pour vérifier le module propriétaire.
- CI #2669 a ensuite révélé une référence Service Worker v3.185.0.0.116 restée dans check-masar ; elle a été alignée sur v3.185.0.0.118.
- CI #2670 : réussite complète du job « Validation structurelle & pédagogique » (33 étapes réussies).
- La validation confirme la cohérence structurelle du module MFA, des formulaires, des appels Supabase et des références de cache ; elle ne prouve pas l'envoi SMS réel ni l'enrôlement sur un compte utilisateur.
- Le projet Supabase est visible et actif, mais les réglages Auth du fournisseur SMS et l'activation serveur des codes de récupération expérimentaux n'ont pas été consultés ni modifiés via les outils disponibles.
- Aucun test navigateur visuel, aucun test réel avec compte utilisateur, aucun SMS envoyé, aucun déploiement Cloudflare.


## Lot 183 — renvoi du SMS pendant le défi MFA de connexion (9 novembre 2026)
- Audit du parcours MFA après les Lots 181–182 : l'envoi d'un nouveau code était disponible pendant l'enrôlement du téléphone, mais pas dans le défi présenté après le mot de passe.
- Ajout d'un bouton « إعادة إرسال رمز SMS » dans le formulaire de défi MFA. Il n'apparaît que lorsque le facteur sélectionné est de type téléphone ; il reste masqué pour TOTP et les codes de récupération.
- Le bouton appelle le challenge natif Supabase sur le facteur téléphone sélectionné. En cas de succès, le nouvel identifiant de challenge remplace celui utilisé par la vérification suivante. Le bouton est temporairement désactivé pendant la requête et les erreurs sont affichées dans la zone de statut existante.
- Aucun délai artificiel, minuteur simulé, envoi local, code fictif ou fournisseur SMS supplémentaire n'est ajouté. La délivrabilité dépend toujours du fournisseur déjà configuré dans Supabase Auth.
- Fichiers modifiés : mfa-security.js, index.html, sw.js, ci/check-public-portal.mjs et ce dossier.
- Cache : mfa-security.js?v=4 ; Service Worker dz-de-v3.185.0.0.119. Les références CSS, client Supabase et app.js restent inchangées.
- Assertions structurelles ajoutées pour vérifier le bouton, sa visibilité limitée au facteur téléphone, l'appel challenge et la mise à jour du challenge actif.
- Aucun changement de schéma, migration, RLS, rôle, secret, Edge Function, réglage Auth distant, paiement ou déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée ; main reste inchangée.

### Validation Lot 183 — en attente de CI
- La vérification des fichiers confirme la présence du gestionnaire de renvoi, la mise à jour du challenge, la synchronisation HTML/Service Worker et les assertions CI.
- La CI complète doit encore confirmer le nouveau HEAD. Aucun SMS réel, test de navigateur ou test de compte Supabase n'est revendiqué.

### Correctif CI Lot 183
- CI #2676 a exécuté les contrôles jusqu'au portail public, puis a échoué sur une assertion de cache du guide de bienvenue qui conservait encore l'identifiant Service Worker v3.185.0.0.118.
- Le code du renvoi SMS et les assertions MFA ont passé les contrôles précédents du même job ; l'échec observé était une référence de version historique dans le validateur.
- Les deux occurrences restantes de v3.185.0.0.118 dans ci/check-public-portal.mjs ont été alignées sur v3.185.0.0.119.
- Le nouveau HEAD doit être revalidé par une CI complète ; aucun résultat de réussite n'est présumé.

- CI #2677 : le contrôle du portail public est désormais réussi, y compris les assertions Lot 183. Le job a ensuite échoué sur une assertion indépendante de مسارك qui attendait encore le Service Worker v3.185.0.0.118.
- L'assertion de version dans ci/check-masar.mjs est alignée sur v3.185.0.0.119. Une nouvelle CI complète doit confirmer le HEAD suivant.

- Diagnostic complémentaire de CI #2677 : la chaîne de diagnostic du contrôle مسارك montrait que le motif regex lui-même contenait encore « .118 » ; la première correction avait modifié le texte d'erreur mais pas les chiffres dans le motif. Le motif est maintenant effectivement aligné sur « .119 ».
- Ce correctif de validateur est enregistré dans ci/check-masar.mjs ; nouvelle validation CI requise.

### Validation finale Lot 183 — CI #2683
- CI #2683, sur le HEAD de documentation `43e24bb09604c5fc9dee3ab360855899f94d6814`, est réussie : job « Validation structurelle & pédagogique », 33 étapes terminées avec succès.
- Les assertions MFA du portail public, le renvoi SMS conditionnel, le renouvellement du challenge et le contrôle مسارك avec Service Worker v3.185.0.0.119 sont validés structurellement.
- Cette réussite CI ne remplace pas un essai navigateur ou un test SMS réel avec un compte Supabase ; aucun de ces tests n'a été effectué.


## Lot 184 — audit en lecture seule de l'application AAL2 et des politiques Supabase (9 novembre 2026)

### Périmètre réellement contrôlé
- Lecture de la branche PR `design/prototypes-67-74-alignment`, fichiers `supabase/supabase.js`, `mfa-security.js` et `app.js` ; aucune modification de code d'authentification pendant cet audit.
- Interrogation en lecture seule du catalogue PostgreSQL (`pg_policies`, `pg_class`) et consultation des Security Advisors Supabase.
- Aucune requête de modification, migration, mise à jour de réglage Auth, rotation de clé, changement de rôle, de secret ou de politique.

### Constat AAL2 — point bloquant
- La requête sur les politiques RLS des schémas exposés `public` et `storage` ne trouve aucune expression faisant référence à `aal` ou à `auth.jwt()` pour le contrôle du niveau d'assurance.
- Les 34 tables du schéma `public` observées ont RLS activé ; aucune n'a `FORCE ROW LEVEL SECURITY` activé dans le catalogue au moment de l'audit. Cela ne signifie pas que les politiques existantes sont absentes : elles existent, mais elles ne conditionnent pas leurs autorisations au niveau AAL2.
- Conclusion : la protection MFA actuelle est une barrière côté interface. Les appels directs à la Data API/RPC avec un JWT AAL1 ne sont pas globalement bloqués par une règle AAL2 restrictive dans les politiques inspectées. Ne pas annoncer le MFA comme enforcement serveur achevé.
- La documentation Supabase consultée recommande une politique RLS restrictive (`AS RESTRICTIVE`) vérifiant `(select auth.jwt()->>'aal') = 'aal2'`, ou une règle conditionnelle aux facteurs vérifiés pour le mode « utilisateurs ayant activé MFA ». Référence : https://supabase.com/docs/guides/auth/auth-mfa ; https://supabase.com/docs/guides/database/postgres/row-level-security.

### Constats côté application
- `app.js` appelle `DZ_MFA.requireGate()` après connexion cloud par mot de passe et pendant la restauration d'une session cloud.
- Le parcours local/démo et le mode hors ligne ont des branches distinctes ; ils ne sont pas une preuve d'authentification cloud AAL2. Les fonctions locales et cloud doivent rester distinguées dans les tests.
- Le parcours d'inscription cloud qui reçoit immédiatement une session appelle `cloudAuthority()` et `enterApp()` sans défi MFA ; un compte nouvellement créé n'a normalement pas encore de facteur vérifié. Ce comportement doit être clarifié si une politique future rend MFA obligatoire pour tous les comptes.
- La gestion de facteur dans l'interface ne remplace pas les contrôles d'accès des tables, RPC, Storage et éventuelles API externes.

### Security Advisors — observations à examiner, sans correction automatique
- Un avertissement signale `public.agreement_current(cle text)` exécutable par `anon` comme fonction `SECURITY DEFINER`.
- 42 fonctions `SECURITY DEFINER` sont signalées comme exécutables par `authenticated`. Ces alertes nécessitent un examen fonction par fonction des vérifications d'identité, de rôle, des paramètres et du périmètre ; elles ne sont pas toutes automatiquement des vulnérabilités.
- La protection des mots de passe compromis (contrôle HaveIBeenPwned) est signalée comme désactivée.
- Les tables contrôlées ont RLS activé, mais la configuration non forcée et les fonctions `SECURITY DEFINER` imposent de vérifier aussi les chemins d'accès privilégiés.

### Décision de sécurité / autorisation requise
- Ne pas appliquer une politique AAL2 à toutes les tables sans matrice de rôles et de flux : élèves, parents, enseignants, agents, responsables et administrateurs peuvent avoir des besoins d'accès différents.
- Une politique restrictive AAL2 globale pourrait bloquer des flux existants (lecture de contenu, messagerie, renouvellement de session, inscription, mode parent, fonctions de service). Il faut d'abord cartographier les tables et RPC sensibles, puis définir explicitement quels rôles et quelles opérations exigent AAL2.
- Conformément au périmètre autorisé, aucune politique RLS, fonction SQL, grant ou configuration distante n'a été modifié. Une autorisation explicite est nécessaire avant toute évolution de la base.

### Suite proposée
1. Cartographier les tables/RPC sensibles par rôle et action (SELECT/INSERT/UPDATE/DELETE/EXECUTE/Storage).
2. Définir une matrice MFA : obligatoire ou optionnel pour chaque rôle et opération ; distinguer AAL2 obligatoire et simple session authentifiée.
3. Préparer un plan de migration SQL isolé et testable, sans l'appliquer, avec politiques restrictives adaptées et stratégie de retour arrière.
4. Après autorisation explicite, appliquer en environnement de test, tester les parcours AAL1/AAL2 pour chaque rôle et vérifier les fonctions `SECURITY DEFINER`.

### Validation Lot 184
- Audit catalogue et Security Advisors exécuté en lecture seule ; aucun changement distant effectué.
- CI du commit de documentation à venir. Aucun test d'accès avec JWT AAL1/AAL2 dédié n'a été exécuté ; l'absence d'expression AAL dans les politiques consultées est un constat catalogue, pas un test d'intrusion.

- CI #2685 : réussite du job « Validation structurelle & pédagogique », 33 étapes terminées avec succès sur le commit d'audit initial `d58513f9625477589b9c9f78e443d761ac52ed0a`.


## Lot 185 — cartographie des tables, politiques RLS et fonctions privilégiées (9 novembre 2026)

### Périmètre et méthode
- Audit réalisé en lecture seule sur le projet Supabase actif `azjwcybivirvpxbfhyzk`, sans exécuter de DDL ni de DML.
- Inventaire des tables et colonnes du schéma `public`, lecture de `pg_policies` pour `public` et `storage`, inventaire des fonctions `SECURITY DEFINER`, de leurs droits EXECUTE et de marqueurs d'autorisation dans leur définition.
- Aucun compte utilisateur, JWT AAL1/AAL2 ou flux métier n'a été utilisé pour un test d'accès en direct. Les constats ci-dessous décrivent le catalogue et le code SQL observés, pas une preuve de comportement runtime.

### Résultats quantifiés
- 34 tables du schéma `public` recensées.
- 76 politiques RLS recensées dans les schémas `public` et `storage`.
- 0 politique contenant une condition AAL dans `qual` ou `with_check`.
- 23 politiques ciblent le rôle PostgreSQL `PUBLIC` (à distinguer du rôle explicite `anon`) ; 1 politique cible explicitement `anon`. Les politiques `PUBLIC` doivent être lues comme applicables à tous les rôles concernés, sous réserve de leurs expressions de filtrage.
- 71 fonctions `SECURITY DEFINER` dans `public` ; 42 sont exécutables par `authenticated`, 1 par `anon`. 51 définitions contiennent `auth.uid()`, 18 contiennent `admin_can(`. Ces marqueurs textuels ne constituent pas à eux seuls une validation de sécurité : les arguments, branches, appels indirects et droits effectifs doivent être vérifiés fonction par fonction.
- Les fonctions trigger sans droit EXECUTE direct par les rôles applicatifs ne doivent pas être assimilées aux RPC exposées ; les déclencheurs et les fonctions RPC doivent être traités dans deux catégories distinctes.

### Matrice fonctionnelle préliminaire (à confirmer par les flux applicatifs)
| Domaine / tables | Opérations observées | Acteurs / garde-fous présents dans les politiques |
|---|---|---|
| Identité et profils : `profiles`, `admin_roles`, `admin_permissions`, `wilaya_assignments` | SELECT, UPDATE, ALL | Profil propre, administrateur, membres d'une conversation, agents avec permissions et périmètre wilaya ; certaines tables de rôles/permissions sont lisibles par tout utilisateur authentifié. |
| Scolarité : `notes`, `seances_done`, `memoire_cards`, `lesson_content`, `lesson_content_trad` | SELECT, INSERT, UPDATE, ALL | Élève/propriétaire, enseignant, administrateur ; contenu conditionné par gratuité/abonnement. Les tables de progression personnelle ont des règles de propriété. |
| Parent/enfant : `child_links`, `parent_link_requests`, `parent_role_requests` | SELECT et RPC dédiées | Participants au lien et administrateur ; les demandes de rôle parent sont réservées à l'administrateur dans la politique de lecture. |
| Messagerie et modération : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_reports`, `msg_log`, `msg_blocks`, `storage.objects` | SELECT, INSERT, UPDATE, DELETE | Membres de conversation, expéditeur, modérateur ; Storage limite les objets privés aux membres/modérateurs ou au propriétaire selon le chemin. |
| Paiement/comptabilité : `payments`, `subscriptions`, `plans`, `receipts`, `accounting_entries`, `accounting_closures` | SELECT, INSERT, UPDATE, ALL et RPC comptables | Propriétaire, administrateur, agent de validation/comptabilité avec permission et périmètre wilaya ; plusieurs RPC privilégiées contrôlent `admin_can`. |
| Gouvernance et support : `agreements`, `agreement_acceptances`, `audit_logs`, `notifications`, `support_tickets`, `platform_settings`, `ads`, `sponsors`, `documents_meta` | SELECT, INSERT, UPDATE, ALL et RPC | Propriétaire, auteur, agents/modérateurs ou administrateur selon la table ; certains flux publics de dépôt (sponsors) sont intentionnels et doivent rester séparés des accès sensibles. |

### Points d'attention qui ressortent de la cartographie
1. **AAL2 absent partout dans les politiques inspectées.** Le contrôle MFA reste côté client tant qu'une règle serveur adaptée n'est pas définie et testée.
2. **Politiques `PUBLIC` nombreuses.** Elles ne signifient pas automatiquement accès anonyme aux données : leurs expressions utilisent souvent `auth.uid()`, `is_admin()` ou une propriété de ligne. Elles nécessitent néanmoins un examen de l'exposition réelle aux rôles `anon` et `authenticated`, table par table.
3. **Données à fort impact.** Profils, notes, demandes parentales, messagerie, pièces jointes, paiements, abonnements, reçus, comptabilité et journaux d'audit sont les premiers domaines à intégrer à une matrice de criticité et de rôles.
4. **RPC privilégiées.** Les fonctions de validation des paiements/abonnements, gestion des rôles, paramètres, clôture comptable, émission de reçus, modération et support doivent être auditées individuellement. La présence de `auth.uid()` ou `admin_can()` ne suffit pas à conclure qu'elles sont sûres.
5. **Fonction accessible à anon.** `agreement_current(cle text)` est la seule fonction `SECURITY DEFINER` du périmètre public pour laquelle le privilège EXECUTE de `anon` est observé. Le lot suivant doit lire son corps complet et confirmer qu'elle ne divulgue que le texte/version d'un accord actif et qu'aucune donnée privée ne peut être obtenue par le paramètre.
6. **Rôles métier à expliciter.** La base distingue les permissions d'agents et de responsables régionaux par `admin_can`, `admin_role_of` et `admin_sees_wilaya`. La future matrice devra inclure élève, parent, enseignant, modérateur, agent de wilaya, responsable régional, administrateur général, anon et service_role.

### Décisions et suite
- Aucun changement SQL, RLS, rôle, grant, fonction, paramètre Auth ou secret n'a été effectué.
- Ne pas ajouter une politique restrictive AAL2 globale avant d'avoir identifié les flux qui doivent rester accessibles en AAL1 (inscription, lecture publique/gratuite, connexion, récupération, contenus gratuits, dépôts publics intentionnels et fonctions de service).
- Étape suivante : examiner le corps complet de `agreement_current`, puis établir la liste des RPC mutatrices et leur garde d'autorisation réelle ; construire une matrice rôle × ressource × opération × niveau AAL recommandé, avec exceptions justifiées.
- Toute proposition SQL restera un plan non appliqué tant qu'une autorisation explicite n'aura pas été donnée.

### Validation Lot 185
- CI #2686 : réussite du job « Validation structurelle & pédagogique » sur le commit `e05ff3a3d931271dc8e5dc8d6adef01852ec3c25`.
- L'audit catalogue du présent lot est en lecture seule. Aucun test navigateur, test de compte réel, test JWT AAL1/AAL2 ou déploiement n'est revendiqué.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main` et aucun déploiement Cloudflare.


### Complément ciblé — RPC `agreement_current`
- Lecture du corps SQL complet : `agreement_current(cle text)` renvoie `select *` sur la ligne `agreements` active de version la plus élevée pour la clé fournie.
- Le privilège EXECUTE est accordé à `anon` et la fonction est `SECURITY DEFINER`. La table `agreements` possède une politique de lecture limitée aux utilisateurs authentifiés ; la fonction privilégiée constitue donc un chemin distinct de lecture publique.
- Le résultat contient toutes les colonnes de la ligne (`id`, `cle`, `version`, `titre`, `corps`, `actif`, `cree_par`, `cree_at`), et pas seulement le texte public de l'accord. Le corps du texte actif semble être la donnée fonctionnelle recherchée, mais l'exposition de métadonnées (`cree_par`, `cree_at`) est plus large que nécessaire en principe.
- Recherche dans `supabase/supabase.js` : aucun appel à `agreement_current` trouvé ; ce fichier lit les accords par la table `agreements` après authentification. Cela ne prouve pas qu'aucun autre module du dépôt n'appelle la RPC.
- Qualification : **surface d'exposition publique à examiner**, pas vulnérabilité confirmée. Avant toute révocation de grant ou changement SQL, rechercher les appels dans l'ensemble du dépôt et confirmer si la lecture anonyme des accords est une exigence publique. Si non requise, préparer une correction minimale (projection explicite des champs publics et privilèges alignés), sans l'appliquer dans ce lot.



## Lot 186 — audit ciblé des RPC privilégiées et statut réel du 2FA à trois méthodes (9 novembre 2026)

### A. Résultat de l'audit des 42 fonctions SECURITY DEFINER accessibles à authenticated
Périmètre : lecture des définitions SQL et des privilèges EXECUTE dans le projet Supabase actif. Aucun appel métier n'a été exécuté et aucune donnée métier n'a été modifiée.

- 42 fonctions `SECURITY DEFINER` exécutables par `authenticated` ont été inventoriées.
- 19 de ces fonctions contiennent une opération d'écriture SQL (INSERT, UPDATE ou DELETE).
- 41/42 contiennent un marqueur d'identité `auth.uid()`, `is_admin()` ou `admin_can()`. Une fonction ne contient aucun de ces marqueurs : `agreement_current(text)`.
- 42/42 ont un `search_path` explicite dans `proconfig`; aucune occurrence de SQL dynamique `EXECUTE` n'a été détectée dans ce groupe.
- Attention : ces marqueurs sont des filtres de triage statique, pas une preuve d'autorisation correcte. Une fonction peut être protégée par une condition de propriété, un rôle, une relation ou un contrôle territorial sans appeler `admin_can`.

### B. RPC mutatrices examinées
Les 19 fonctions mutatrices observées sont :
`accounting_close_month`, `accounting_depense`, `accounting_mark_rapproche`, `admin_decide_parent_role_request`, `agreement_accept`, `agreement_accept_for`, `agreement_publish`, `agreement_withdraw`, `assignment_set_active`, `cancel_parent_link_request`, `issue_receipt`, `msg_open_direct`, `request_child_link`, `respond_parent_link_request`, `setting_set`, `subscription_decide`, `subscription_set_preuve`, `ticket_set_statut`, `unlink_child`.

Contrôles positifs observés dans le code :
- Comptabilité : permission `accounting.manage`, restriction au rôle `admin_general` pour la clôture, contrôle de wilaya pour le rapprochement, wilaya unique pour l'écriture de dépense.
- Paiements/abonnements : permission `payments.validate` et vérification de la wilaya pour la décision ; `subscription_set_preuve` limite l'UPDATE à l'abonnement du propriétaire connecté et à des statuts admissibles.
- Reçus : permission `receipts.issue`, paiement confirmé/validé, contrôle de périmètre wilaya, prévention d'émission en double.
- Agents : permission `agents.manage`, contrôle du nombre d'affectations et périmètre territorial avant modification.
- Tickets : permission `tickets.handle`, contrôle du périmètre du demandeur et de l'agent assigné.
- Parent/enfant : demandes et réponses liées à l'identité du parent ou de l'élève, vérification des rôles et de la relation confirmée ; retrait du lien réservé aux parties ou à l'administrateur.
- Messagerie : ouverture d'un DM conditionnée par `msg_can_dm`.
- Accords : acceptation propre, ou acceptation par un parent pour un enfant lié ; publication réservée à `agreements.manage`.

Points à approfondir avant toute modification :
1. `admin_decide_parent_role_request` utilise `is_admin()` comme contrôle de rôle global ; confirmer que cette opération doit être limitée au seul administrateur général et pas à d'autres profils administratifs.
2. `accounting_depense` accepte un paramètre `meta jsonb` qui est stocké tel quel ; définir un schéma/une taille maximale et contrôler l'absence de données sensibles superflues.
3. `subscription_set_preuve` enregistre `p_preuve` sans validation de format/taille dans la fonction ; vérifier le format attendu par le client et la politique de stockage avant de proposer une restriction.
4. `agreement_current` reste l'unique RPC du groupe accessible à `anon` sans contrôle d'identité dans son corps et renvoie `SELECT *` sur l'accord actif. Sa projection de colonnes est trop large par rapport au besoin public probable ; confirmer l'usage dans tout le dépôt avant de préparer une correction.
5. Les contrôles `auth.uid()`/permissions protègent l'identité et le périmètre, mais ne prouvent pas AAL2. Aucun contrôle AAL n'a été détecté dans les définitions RLS inspectées au Lot 184 ni dans les RPC examinées ici.

### C. Statut vérifié du système 2FA (TOTP, SMS, e-mail)
**Conclusion : le système n'est pas terminé comme 2FA à trois méthodes.** Il existe une base fonctionnelle à deux facteurs natifs, mais il manque le facteur e-mail et plusieurs validations de production.

| Méthode | État du code | Nature réelle |
|---|---|---|
| Application d'authentification TOTP | Implémentation présente | Facteur MFA natif Supabase, enrôlement QR/secret, challenge et vérification |
| SMS | Implémentation présente | Facteur téléphone MFA natif Supabase, enrôlement E.164, challenge, vérification et renvoi |
| E-mail comme second facteur | Non implémenté | Supabase Email OTP/Magic Link est documenté comme méthode de connexion primaire (AAL1), pas comme facteur MFA enrôlable/éligible à AAL2 |

La documentation officielle Supabase consultée le 9 novembre 2026 expose les facteurs MFA Authenticator TOTP et Phone ; les API de facteurs et `listFactors()` sont structurées autour de `totp` et `phone`. L'e-mail OTP est une méthode de connexion passwordless et reste AAL1. Il ne faut donc pas l'ajouter dans l'interface sous l'étiquette « troisième facteur MFA AAL2 » sans mécanisme d'identité et d'autorisation distinct, explicitement conçu et validé.
Références officielles :
- https://supabase.com/docs/guides/auth/auth-mfa
- https://supabase.com/docs/guides/auth/auth-mfa/phone
- https://supabase.com/docs/guides/auth/auth-email-passwordless

### D. Lacunes fonctionnelles et de sécurité constatées
1. Le module `mfa-security.js` et le wrapper `supabase/supabase.js` n'exposent que `totp` et `phone` dans l'enrôlement, le challenge et la liste des facteurs. Aucun facteur e-mail MFA n'est codé.
2. Le contrôle MFA est actuellement un verrou client. Le Lot 184 a établi qu'aucune politique RLS inspectée ne vérifie `aal2`. Il n'est donc pas exact de présenter l'ensemble des données/RPC sensibles comme protégées côté serveur par le MFA.
3. Le flux d'inscription cloud qui reçoit immédiatement une session appelle `cloudAuthority()` puis `enterApp()` sans appeler explicitement `DZ_MFA.requireGate()`. Un nouvel utilisateur ne possède normalement aucun facteur enrôlé à cet instant, mais le flux doit être harmonisé avant une éventuelle politique MFA obligatoire.
4. Le flux de liaison d'un compte cloud depuis une session locale appelle `SB.login()` puis `cloudAuthority()` sans passer par `DZ_MFA.requireGate()`. Il s'agit d'un chemin alternatif à intégrer au contrôle de connexion avant de considérer le verrou client exhaustif.
5. Le code active `auth.experimental.recoveryCodes: true` et appelle une API `mfa.recoveryCodes`. Cette fonctionnalité doit être traitée comme expérimentale et vérifiée sur la version exacte de `supabase-js` réellement chargée (le code utilise un CDN `@supabase/supabase-js@2` non épinglé). La documentation Auth MFA consultée ne présente pas les recovery codes comme un facteur natif stable.
6. Le renvoi SMS, la vérification d'enrôlement et le défi TOTP/SMS existent dans le code, mais aucun test de bout en bout avec un vrai compte, un vrai SMS ou un fournisseur configuré n'est revendiqué.

### E. Architecture recommandée pour la méthode e-mail
- Ne pas détourner `signInWithOtp` après le mot de passe en affirmant que cela élève automatiquement la session à `aal2` : ce n'est pas le contrat MFA documenté.
- Si l'exigence produit est de proposer trois choix de second contrôle, il faudra une conception dédiée : code aléatoire généré côté serveur, stockage uniquement sous forme hachée, expiration courte, liaison au compte et à la tentative de connexion, usage unique, limites de tentatives, limitation d'envoi, anti-énumération, journalisation et révocation.
- Un tel facteur e-mail personnalisé ne sera pas reconnu comme facteur MFA natif par Supabase et ne fera pas monter automatiquement le JWT à `aal2`. Il faudra soit accepter explicitement un niveau d'assurance personnalisé et protéger les opérations sensibles via un serveur de confiance, soit choisir un fournisseur d'identité supportant nativement ce facteur. Ne pas prétendre que les politiques RLS `aal2` couvrent un facteur e-mail personnalisé.
- Pour l'instant, ne pas coder cette méthode sans arbitrage architectural et sans tests de sécurité. Ne pas créer de tables, Edge Functions, triggers, secrets ou migrations dans ce lot.

### F. Validation et suite
- CI #2688 : réussite, 33 étapes, sur le commit documentaire `e7ba9db4b1b24c59f4f6c0e726306538b5d4bb36`.
- PR #17 : ouverte, non fusionnée, base `main`, tête `design/prototypes-67-74-alignment`.
- Aucun changement de schéma/RLS/grants/Auth distant, aucun test réel de compte, aucun SMS réel, aucun test navigateur, aucun déploiement.
- Prochain lot : corriger/valider les chemins alternatifs d'authentification dans le client (inscription et liaison de compte), vérifier l'API recovery codes sur une version `supabase-js` épinglée, puis rédiger une décision d'architecture pour l'e-mail. Les politiques AAL2 restent un chantier serveur séparé soumis à autorisation explicite.

---

## Lot 187 — audit des parcours alternatifs MFA et de la dépendance Supabase JS (9 novembre 2026)

### 1. Périmètre
Audit en lecture seule du HEAD de la PR #17 (3836c963b64ea4d580439c7e6046f00a97c440ce), portant sur la connexion par mot de passe, la restauration de session, l'inscription cloud, la liaison d'un compte cloud depuis une session locale, et le chargement de Supabase JS / l'API des codes de récupération.

Aucun fichier applicatif, paramètre distant, schéma, rôle, grant, politique RLS ou déploiement n'a été modifié dans ce lot.

### 2. Résultats sur les parcours

**Parcours couverts par le garde MFA côté client**
- Connexion cloud : app.js appelle DZ_MFA.requireGate() après SB.login() et avant cloudAuthority() / enterApp().
- Restauration de session cloud : le flux vérifie la présence de DZ_MFA.requireGate() puis l'exécute avant de charger le profil et d'entrer dans l'application.
- Si le module MFA manque sur ces deux parcours, l'accès est bloqué côté client.

**Parcours alternatifs non harmonisés**
- Inscription cloud avec session immédiate : app.js appelle cloudAuthority() puis enterApp() sans appel explicite à DZ_MFA.requireGate(). L'inscription sans session retourne vers la confirmation e-mail.
- Liaison d'un compte cloud depuis une session locale (lcBtn) : le code appelle SB.login() puis cloudAuthority() sans vérifier le résultat {ok, err} de SB.login() et sans passer par DZ_MFA.requireGate().
- Le wrapper SB.login() renvoie un objet d'échec plutôt que de lever systématiquement une exception. Le try/catch du parcours de liaison ne suffit donc pas à traiter correctement un échec. Le flux doit vérifier explicitement result.ok avant de poursuivre ; sinon, un état cloud préexistant pourrait être pris en compte par cloudAuthority().

Ces deux parcours sont des lacunes de cohérence du garde client. Ils ne prouvent pas à eux seuls un contournement des politiques serveur ; le Lot 184 a établi qu'aucune politique RLS inspectée ne vérifiait AAL2.

### 3. Vérification de l'API des codes de récupération
- Le dépôt active auth.experimental.recoveryCodes: true et utilise auth.mfa.recoveryCodes.generate/verify/regenerate/getStatus.
- Le changelog officiel de @supabase/supabase-js indique l'ajout de l'API MFA Recovery Codes en version **2.116.0** (7 septembre 2026).
- La documentation officielle confirme que le flag auth.experimental.recoveryCodes est requis et que la vérification d'un code élève la session à aal2. Les codes sont à usage unique et les codes en clair ne sont remis qu'une seule fois.
- Il est donc inexact de conclure que l'API est absente de supabase-js : elle existe depuis 2.116.0. Elle reste toutefois explicitement **expérimentale**.
- Le dépôt charge actuellement Supabase JS via des URL CDN en @2 (UMD et imports ESM de secours), sans version exacte. Le code ne permet donc pas de prouver quelle version est réellement exécutée dans le navigateur. L'absence d'épinglage empêche de garantir que les trois chemins de chargement utilisent la même version.

Références consultées le 9 novembre 2026 :
- Changelog : https://github.com/supabase/supabase-js/blob/master/packages/core/supabase-js/CHANGELOG.md
- API generate : https://supabase.com/docs/reference/javascript/auth-mfa-recovery-codes-generate
- API verify : https://supabase.com/docs/reference/javascript/auth-mfa-recovery-codes-verify

Le registre npm indiquait 2.119.0 comme dernière version publiée au moment de l'audit. Ce numéro est une référence de contrôle, pas une modification effectuée dans le dépôt.

### 4. Actions recommandées pour le Lot 188
1. Harmoniser l'inscription avec session immédiate : exécuter le garde MFA avant toute entrée dans l'application lorsque la session cloud est créée.
2. Corriger la liaison cloud depuis une session locale : contrôler result.ok, interrompre le flux en cas d'échec, puis exécuter le défi MFA avant de charger/valider le profil cloud.
3. Épingler une version exacte de Supabase JS identique dans le script UMD et les imports ESM de secours ; vérifier la compatibilité réelle de l'API recovery codes avec cette version.
4. Ajouter des assertions CI couvrant connexion, restauration, inscription et liaison ; puis effectuer des tests navigateur avec un compte de test.
5. Garder séparé le chantier serveur AAL2 : une correction JavaScript ne remplace jamais les contrôles RLS/RPC côté serveur.

### 5. Statut du système 2FA à trois méthodes
- TOTP : code présent, facteur natif Supabase ; tests réels de compte et navigateur non effectués.
- SMS : code présent, facteur téléphone natif Supabase ; réception réelle et fournisseur SMS non testés.
- E-mail : aucun facteur e-mail indépendant implémenté. L'OTP e-mail de connexion ne doit pas être présenté comme facteur MFA AAL2 natif.
- Verdict : **2 méthodes codées (TOTP + SMS), 1 méthode manquante (e-mail), et validation de production incomplète**. Le système 2FA à trois méthodes n'est pas terminé.

### 6. Validation et limites
- PR #17 : ouverte, non fusionnée, base main ; HEAD contrôlé : 3836c963b64ea4d580439c7e6046f00a97c440ce.
- CI #2689 : réussite, 33 étapes sur le commit de la PR contrôlé dans cet audit.
- Audit du code source GitHub effectué ; aucun test navigateur, aucun test SMS réel, aucun test avec compte MFA réel.
- Aucun changement applicatif, aucune modification Supabase distante, aucune migration, aucun changement RLS/grants, aucun déploiement.
- Le prochain lot doit corriger les deux parcours alternatifs et épingler la dépendance, sans étendre le périmètre aux politiques serveur tant qu'une autorisation distincte n'a pas été donnée.


---

## Lot 188 — harmonisation des parcours MFA et épinglage Supabase JS (9 novembre 2026)

### 1. Corrections applicatives réalisées sur la branche PR #17

**Inscription cloud avec session immédiate**
- Après une inscription réussie qui retourne effectivement une session, app.js vérifie désormais la disponibilité de DZ_MFA.requireGate().
- Le garde MFA est exécuté avant cloudAuthority() et enterApp().
- Si le défi MFA est nécessaire, le flux s'arrête et le module MFA reprend la main sur la finalisation de connexion. Si le module est absent, le parcours est bloqué avec un message explicite.
- Le parcours d'inscription nécessitant une confirmation e-mail, sans session immédiate, conserve son message de confirmation et ne tente pas d'ouvrir l'application.

**Liaison d'un compte cloud depuis une session locale**
- Le résultat de SB.login() est désormais contrôlé explicitement par result.ok.
- Un échec arrête le flux ; il n'est plus suivi d'une tentative implicite de création de compte par SB.signup(). L'interface indique à l'utilisateur de créer un compte depuis la page d'inscription si nécessaire.
- Le garde MFA est exécuté avant cloudAuthority() et avant la validation de la liaison.
- L'absence du module MFA bloque le parcours.
- Si le défi MFA est nécessaire, le parcours s'arrête et laisse le module MFA finaliser l'authentification.

Cette correction réduit le risque de poursuivre une liaison sur la base d'une session cloud préexistante après un échec de mot de passe. Elle ne remplace pas une autorisation AAL2 côté serveur.

### 2. Dépendance Supabase JS épinglée

La version **2.119.0** est confirmée comme publiée le 4 novembre 2026 :
- https://github.com/supabase/supabase-js/releases/tag/v2.119.0
- https://www.npmjs.com/package/@supabase/supabase-js

Tous les chemins de chargement présents dans le dépôt ont été épinglés à cette version :
- Script UMD dans index.html : jsDelivr @2.119.0/dist/umd/supabase.js.
- Import ESM principal : jsDelivr @2.119.0/+esm.
- Repli ESM : unpkg @2.119.0/dist/module/index.js.
- Second repli ESM : esm.sh @2.119.0.

Les options auth.experimental.recoveryCodes: true restent activées. L'épinglage garantit la cohérence de version déclarée dans le code, mais ne constitue pas un test navigateur de disponibilité de chaque URL CDN ni une validation de stabilité de l'API expérimentale.

### 3. Cache et assertions CI

- app.js : version de cache portée de v=3561 à v=3562.
- supabase/supabase.js : version de cache portée de v=3515 à v=3516.
- Service Worker : dz-de-v3.185.0.0.120.
- index.html et le précache du Service Worker ont été synchronisés.
- ci/check-public-portal.mjs : assertions ajoutées pour la version Supabase 2.119.0, le garde MFA d'inscription, le résultat de connexion dans le flux de liaison et le garde MFA de liaison.
- ci/check-masar.mjs : assertions de version du cache actualisées.

### 4. État de validation au moment de la mise à jour du dossier

- PR #17 : ouverte, non fusionnée, base main.
- HEAD contrôlé avant ce commit documentaire : 4be00a6fce89e3bd548cf4a8b1c4274b594a8790.
- CI #2689 : réussite sur un commit précédent du Lot 187.
- CI du Lot 188 : exécution déclenchée, état initial pending (run ID 42697338289) ; ne pas la déclarer réussie avant réception de sa conclusion.
- Modifications réalisées uniquement sur design/prototypes-67-74-alignment.
- Aucun changement de schéma, migration, politique RLS, grant, rôle, paramètre distant Supabase ou déploiement Cloudflare.
- Aucun test réel avec compte, facteur TOTP, SMS ou navigateur n'a été réalisé dans ce lot.

### 5. Statut du 2FA à trois méthodes après Lot 188

- TOTP : implémentation existante ; validation réelle de bout en bout encore requise.
- SMS : implémentation existante ; fournisseur, réception et défi réels encore à tester.
- E-mail : facteur MFA indépendant non implémenté.
- Parcours client : inscription avec session immédiate et liaison cloud désormais harmonisés dans le code.
- Protection serveur AAL2 : toujours non établie dans les politiques RLS auditées au Lot 184.
- Codes de récupération : API Supabase toujours expérimentale ; version du SDK désormais épinglée, mais validation réelle encore nécessaire.

**Verdict inchangé : le système 2FA professionnel à trois méthodes n'est pas terminé.** Le Lot 188 corrige des lacunes du client et la cohérence de dépendance ; il n'ajoute pas le facteur e-mail et n'instaure pas AAL2 côté serveur.

### 6. Prochaines étapes
1. Laisser la CI du Lot 188 terminer et corriger toute assertion qui échoue.
2. Tester en navigateur avec un compte cloud de test : inscription, liaison, connexion, restauration, challenge TOTP et SMS.
3. Concevoir le facteur e-mail comme une méthode distincte, avec décision explicite sur son niveau d'assurance ; ne pas le présenter comme AAL2 natif Supabase.
4. Traiter séparément la protection serveur AAL2, après autorisation explicite pour toute migration ou modification RLS.


---

## Lot 189 — correction de l’assertion CI MFA et cadrage du facteur e-mail (9 novembre 2026)

### 1. Diagnostic CI du Lot 188

- La CI #2694 (run 42697338289) s’est terminée en échec sur l’étape « Vérifier le portail public (catalogue et inscription) » ; les étapes structurelles précédentes étaient réussies.
- Le défaut provenait d’une assertion devenue obsolète dans `ci/check-public-portal.mjs` : elle attendait exactement deux appels au garde MFA, alors que le Lot 188 a étendu le garde aux quatre parcours cloud concernés : connexion, restauration de session, inscription avec session immédiate et liaison d’un compte cloud.
- Le code réel contient quatre vérifications de disponibilité du module MFA et quatre appels à `requireGate()`. L’assertion a été alignée sur ces quatre parcours et son message d’échec précise désormais les quatre flux.
- Commit de correction CI : `be186d48a359c5a347d7e50f7be3910989868d00`.
- Cette correction ne modifie ni les flux Auth applicatifs, ni les règles d’accès, ni les données ; elle corrige uniquement le contrat du test structurel.

### 2. Inspection du projet Supabase connecté (lecture seule)

- Projet connecté : `azjwcybivirvpxbfhyzk`, statut ACTIVE_HEALTHY, région eu-west-2.
- Inventaire Edge Functions : **aucune fonction déployée** (`functions: []`).
- Aucun service serveur e-mail MFA personnalisé n’existe donc actuellement dans ce projet.
- Aucune fonction Edge, table, migration, politique RLS, grant, rôle ou configuration Auth n’a été créée ou modifiée dans ce lot.

### 3. Décision technique sur le facteur e-mail

- La documentation Supabase Auth MFA consultée indique que les facteurs MFA natifs disponibles sont TOTP et téléphone ; les OTP e-mail et SMS employés comme méthodes conventionnelles de connexion sont classés parmi les méthodes AAL1.
- L’API MFA JavaScript documentée expose actuellement TOTP et téléphone comme seconds facteurs ; l’e-mail n’est pas proposé comme facteur MFA natif.
- En conséquence, un code reçu par e-mail via `signInWithOtp` ne doit pas être présenté comme un troisième facteur MFA indépendant ni comme une élévation AAL2.
- Pour offrir un véritable facteur e-mail supplémentaire, il faudrait concevoir un service serveur dédié : défi aléatoire à forte entropie, stockage uniquement d’un vérificateur haché, durée de vie courte, consommation atomique à usage unique, limitation des tentatives et des envois, liaison stricte au compte et à la session, prévention du rejeu, journalisation et validation serveur avant l’accès aux opérations protégées.
- Le client ne doit jamais générer ou valider seul le code, ni le stocker dans localStorage/sessionStorage. Une interface e-mail seule serait trompeuse et insuffisante.

### 4. Autorisation requise avant implémentation serveur

La mise en œuvre réelle du facteur e-mail nécessitera un service serveur (par exemple Edge Function) et un stockage sécurisé des défis, ainsi qu’un mécanisme d’envoi e-mail fiable. Le périmètre actuel interdit toute modification distante du schéma/RLS/configuration sans autorisation distincte. Le Lot 189 s’arrête donc volontairement au diagnostic et à la correction CI ; aucune fausse méthode e-mail n’a été ajoutée au navigateur.

### 5. État de validation et périmètre

- CI #2694 : échec identifié, cause corrigée dans le test structurel par le commit ci-dessus ; nouvelle exécution à vérifier avant de déclarer la CI verte.
- PR #17 : reste ouverte, non fusionnée, cible `main`.
- Aucun changement direct sur `main`, aucune fusion et aucun déploiement Cloudflare.
- Aucun test navigateur, test de compte MFA réel, réception SMS ou réception e-mail n’a été réalisé.
- Aucune modification distante Supabase ; inventaire des fonctions effectué en lecture seule.

### 6. Statut honnête du 2FA à trois méthodes

- TOTP : implémentation client native Supabase présente ; validation réelle encore requise.
- SMS : implémentation client native Supabase présente ; fournisseur et livraison réels à tester.
- E-mail : non implémenté ; aucun facteur e-mail MFA natif Supabase documenté, aucun backend personnalisé déployé.
- AAL2 côté serveur : non établi dans les politiques RLS auditées précédemment.
- Verdict : **2 méthodes codées sur 3, mais aucun 2FA professionnel à trois méthodes n’est encore achevé ni validé de bout en bout.**

Références techniques consultées :
- Supabase Auth MFA : https://supabase.com/docs/guides/auth/auth-mfa
- Référence JavaScript Auth MFA : https://supabase.com/docs/reference/javascript/auth-mfa
- Changelog supabase-js (API recovery codes en 2.116.0) : https://github.com/supabase/supabase-js/blob/master/packages/core/supabase-js/CHANGELOG.md


---

## Lot 190 — stockage sécurisé et service serveur du second contrôle e-mail (9 novembre 2026)

### 1. Autorisation et périmètre
- L'utilisateur a explicitement autorisé la création des composants Supabase nécessaires au facteur e-mail personnalisé.
- Projet : `azjwcybivirvpxbfhyzk`, région `eu-west-2`, statut `ACTIVE_HEALTHY`.
- Le périmètre a été limité à trois nouvelles tables, deux fonctions SQL internes et une Edge Function dédiée. Aucune table existante, politique RLS existante, rôle métier, grant existant, paramètre Auth global, paiement ou règle de sécurité d'une fonctionnalité préexistante n'a été modifié.
- Aucun déploiement Cloudflare et aucune fusion de PR n'ont été effectués.

### 2. Stockage Supabase créé
Migration distante appliquée avec succès : `add_email_mfa_challenge_store`.
Nouvelles tables :
- `public.mfa_email_factors` : état d'activation du facteur e-mail par utilisateur.
- `public.mfa_email_challenges` : défis à usage unique, liés à l'utilisateur et à la session, avec empreinte HMAC, expiration de cinq minutes et plafond de cinq essais.
- `public.mfa_email_sessions` : validation e-mail enregistrée côté serveur et liée à une session Auth, durée de douze heures.

Mesures de protection :
- RLS activée sur les trois tables.
- Aucun accès direct accordé à `anon` ou `authenticated`.
- Droits limités à `service_role` pour ces tables.
- Deux fonctions SQL `SECURITY INVOKER`, avec `search_path` verrouillé, pour émettre et consommer les défis.
- Verrou transactionnel par utilisateur, délai minimal entre envois, plafonds de 5 défis/heure et 10/jour, invalidation des défis précédents, consommation atomique, expiration et verrouillage après cinq essais.
- Les tables restent dans le schéma `public` mais ne sont pas exposées aux clients par des privilèges directs ; l'accès est opéré par le backend.

### 3. Edge Function déployée
- Nom : `mfa-email`.
- Version déployée : 1.
- Statut Supabase : ACTIVE.
- Vérification JWT de la plateforme : activée (`verify_jwt=true`).
- SDK serveur épinglé à `@supabase/supabase-js@2.119.0`.
- La fonction vérifie le jeton utilisateur auprès de Supabase Auth, exige un e-mail confirmé, récupère le `session_id` du JWT validé, puis effectue les opérations sensibles avec le client serveur.
- Actions codées : `status`, `start` (enrôlement ou connexion), `verify`, `disable`.
- Le code à six chiffres est généré côté serveur ; seule son empreinte HMAC-SHA-256 est conservée en base. Le secret HMAC n'est jamais placé dans le dépôt ou dans le navigateur.
- Envoi via l'API Resend, avec expéditeur et clé lus exclusivement depuis les secrets d'environnement.

### 4. Intégration du client sur la branche PR #17
- `supabase/supabase.js` expose désormais `SB.mfaEmail()`, qui appelle la fonction via le client Auth de l'utilisateur courant.
- `mfa-security.js` ajoute l'affichage de l'état du facteur e-mail, son enrôlement, la vérification du code, la désactivation et le défi e-mail au parcours de connexion.
- Le garde existant continue à traiter TOTP/SMS et codes de récupération natifs ; le défi e-mail personnalisé est ajouté sans le confondre avec les facteurs natifs.
- Correction de sûreté ajoutée après relecture : si Supabase exige déjà AAL2 pour un facteur natif, le défi e-mail personnalisé ne peut pas remplacer ce défi natif. Le facteur e-mail personnalisé est demandé uniquement lorsque le contrôle natif ne requiert pas AAL2.
- Cache : `supabase/supabase.js?v=3517`, `mfa-security.js?v=5`, Service Worker `dz-de-v3.185.0.0.121`. Le précache et les références HTML sont alignés.
- Assertions structurelles CI ajoutées pour le service e-mail, le statut, la vérification, l'enrôlement et la désactivation. Une première exécution CI a relevé un contrat historique sur la garde MFA fail-closed ; la condition a été conservée explicitement et le cache du module a été réincrémenté.

### 5. Limites importantes — aucune fausse déclaration de sécurité
- Supabase Auth ne reconnaît pas ce facteur personnalisé comme facteur MFA natif et il ne fait pas passer le JWT à `aal2`.
- Le défi e-mail est un second contrôle applicatif côté serveur, lié à la session, mais les politiques RLS et RPC métier existantes ne vérifient pas cette preuve. L'accès direct à ces API n'est donc pas universellement bloqué par ce facteur.
- Aucune politique RLS existante n'a été modifiée, conformément à la limite fixée. Une protection serveur globale nécessiterait un chantier distinct de contrôle des opérations sensibles.
- Le déploiement de la fonction est effectué, mais l'envoi est **non opérationnel tant que les secrets `MFA_EMAIL_PEPPER`, `RESEND_API_KEY` et `MFA_EMAIL_FROM` ne sont pas configurés** dans Supabase Edge Function Secrets. La fonction renvoie volontairement une erreur de configuration au lieu de simuler un envoi.
- Aucun secret n'a été inventé, demandé dans le chat ou inscrit dans Git.
- Aucun e-mail réel n'a été envoyé et aucun test de compte de bout en bout n'a encore été exécuté.

### 6. Audit de sécurité après migration
- L'advisor Supabase relève trois notices informatives `RLS Enabled No Policy` pour les trois tables MFA nouvelles. C'est intentionnel : les clients ne doivent pas disposer de politiques directes ; seuls les appels serveur avec `service_role` y accèdent.
- Les alertes préexistantes sur `agreement_current` et les fonctions `SECURITY DEFINER` authentifiées restent présentes et n'ont pas été modifiées dans ce lot.
- Le déploiement Edge Function est confirmé ACTIVE, version 1, avec vérification JWT activée.
- La migration et l'inventaire des tables ont été confirmés après application.

### 7. État de la validation et suite
- CI #2696 : réussite sur le commit `be186d48a359c5a347d7e50f7be3910989868d00` (Lot 189), 33 étapes. Ce résultat précède les changements du Lot 190 et ne valide donc pas encore ceux-ci.
- Nouvelle CI attendue après les commits du Lot 190 ; son résultat doit être contrôlé avant toute déclaration de validation.
- PR #17 reste ouverte et non fusionnée ; `main` n'a pas été modifiée.
- Aucun test navigateur, SMS réel, TOTP avec compte de production, ou e-mail réel n'est revendiqué.
- Statut honnête : TOTP + SMS natifs sont codés ; le backend e-mail personnalisé est déployé et son interface est intégrée, mais le transport e-mail attend la configuration des secrets. Le 2FA à trois méthodes n'est donc **pas encore validé de bout en bout**.


### Complément Lot 190 — diagnostic CI et fournisseur e-mail
- L'Edge Function `mfa-email` utilise explicitement l'API HTTP Resend ; aucun autre fournisseur n'est branché dans ce code.
- Le transport n'est pas prêt : il exige les secrets Supabase `MFA_EMAIL_PEPPER`, `RESEND_API_KEY` et `MFA_EMAIL_FROM`. Aucun secret n'a été lu, exposé ou configuré par le dépôt. Les outils disponibles ne permettent pas de confirmer la présence de secrets existants sans en exposer les valeurs ; leur état reste donc à vérifier dans Supabase Dashboard.
- Le SMTP configuré pour les e-mails transactionnels natifs Supabase Auth, s'il existe, n'est pas automatiquement réutilisé par l'Edge Function. Pour ce second facteur applicatif, il faut un fournisseur d'envoi HTTP tel que Resend, ou adapter explicitement le code à un autre fournisseur.
- CI #2710 a échoué sur une assertion historique de `ci/check-masar.mjs` qui exigeait encore la version Service Worker `v3.185.0.0.120`, alors que le Lot 190 avait correctement avancé à `v3.185.0.0.123`. L'assertion a été corrigée dans le commit `8f27308dcf6f3241c3bb795d39e961cfd9cda322`.
- La correction CI attend une nouvelle exécution. Aucune validation verte du Lot 190 n'est revendiquée à ce stade.
- PR #17 toujours ouverte et non fusionnée ; aucun changement de `main`, aucun déploiement Cloudflare.


---

## Lot 191 — Correctif MFA e-mail et versionnement de la fonction Edge (2026-11-09)

### Défaut détecté et corrigé
- L'audit de la fonction Edge déployée `mfa-email` a révélé une expression régulière trop échappée dans le contrôle du code à six chiffres.
- Le contrôle rejetait les codes numériques pourtant valides.
- Correctif appliqué : validation effective avec `/^\\d{6}$/` côté TypeScript (six chiffres ASCII exactement).
- Fonction Edge redéployée avec succès : version **2**, statut **ACTIVE**, `verify_jwt=true`.
- Source complète ajoutée au dépôt sous `supabase/functions/mfa-email/index.ts`, commit `203cb24992acad33cd7216261de97c7491f68c97`.

### État de validation
- Le déploiement Supabase confirme la publication de la version 2.
- La source de la fonction est désormais versionnée dans la branche PR.
- Aucun secret Resend n'a été transmis, affiché ou ajouté au dépôt.
- L'envoi réel d'e-mails reste conditionné à la configuration de `MFA_EMAIL_PEPPER`, `RESEND_API_KEY` et `MFA_EMAIL_FROM` dans les secrets Edge Functions.
- Aucun test de livraison réelle ni test MFA complet avec un compte utilisateur n'a été effectué dans ce lot.
- La version 2 corrige le contrôle de format, mais ne constitue pas à elle seule une validation complète de sécurité ou de bout en bout.

### Périmètre inchangé
- PR #17 reste ouverte et non fusionnée.
- Aucun changement sur `main`.
- Aucun déploiement Cloudflare.
- Aucune modification des politiques RLS, rôles, grants ou configuration Auth globale existants.

---

## Lot 192 — durcissement du facteur e-mail MFA sans domaine d'expédition (9 novembre 2026)

### 1. Objectif
Permettre de consulter correctement l'état du facteur e-mail tant que le domaine d'expédition Resend n'est pas acquis, sans transformer l'absence de configuration en contournement MFA.

### 2. Correctifs Edge Function
- mfa-email déployée en version **7**, statut **ACTIVE**, verify_jwt=true.
- L'action status ne dépend plus de MFA_EMAIL_PEPPER, RESEND_API_KEY ou MFA_EMAIL_FROM : elle peut donc restituer l'état d'inscription sans transport e-mail configuré.
- Les erreurs de lecture des tables de facteur/session sont désormais renvoyées comme erreurs serveur explicites (STATUS_LOOKUP_FAILED) ; elles ne sont plus interprétées comme un facteur non inscrit.
- L'action start vérifie la présence des secrets du fournisseur et du pepper avant de créer un défi. En l'absence de configuration, elle renvoie EMAIL_FACTOR_NOT_CONFIGURED sans créer un défi inutilisable ni consommer le quota d'envoi.
- L'action verify exige également le pepper avant de calculer l'empreinte HMAC.
- L'enrôlement e-mail marque la session courante comme récemment vérifiée après confirmation du code, afin que l'utilisateur ne soit pas immédiatement bloqué par le contrôle renforcé lors de la gestion du facteur.
- L'action disable exige une preuve récente enregistrée côté serveur (ou une session native aal2) avant de supprimer le facteur ; les erreurs de lecture de cette preuve échouent fermées.

### 3. Garde de connexion et cache
- mfa-security.js bloque désormais la connexion si l'état du facteur e-mail ne peut pas être vérifié ; une erreur de lecture n'est plus assimilée à l'absence de facteur.
- Référence du module dans index.html et le précache : mfa-security.js?v=8.
- Service Worker avancé à dz-de-v3.185.0.0.124.
- La version déployée de la fonction a été comparée à la source versionnée avant le lot ; après les correctifs, le déploiement version 7 a été confirmé.

### 4. Limites et vérifications non revendiquées
- Aucun domaine d'expédition n'est configuré à ce stade ; l'adresse Gmail de contact n'est pas utilisée comme expéditeur Resend non vérifié.
- Aucun secret Resend ou pepper n'a été lu, exposé, demandé dans le chat ou ajouté à Git.
- Aucun e-mail réel n'a été envoyé ; aucun test de compte complet, de TOTP, de SMS ou de réception Resend n'est revendiqué.
- Le facteur e-mail demeure un second contrôle applicatif personnalisé, pas un facteur Supabase natif AAL2 et pas une protection globale automatique de toutes les politiques RLS/RPC.
- Les mécanismes TOTP/SMS natifs et les politiques RLS existantes n'ont pas été modifiés par ce lot.
- Aucun déploiement Cloudflare, aucune modification de main et aucune fusion de PR #17.

### 5. Validation à effectuer
- Exécuter et contrôler la CI après les commits du lot.
- Vérifier en navigateur que l'action status fonctionne sans secrets Resend, que start affiche une indisponibilité propre tant que le fournisseur n'est pas configuré, et que les erreurs de statut bloquent bien la connexion.
- Après acquisition d'un domaine et validation DNS SPF/DKIM, configurer MFA_EMAIL_FROM, RESEND_API_KEY et MFA_EMAIL_PEPPER, puis réaliser un test d'envoi et de vérification réel.

### Complément Lot 192 — contrôle CI du Service Worker
- CI #2716 (garde MFA côté client) : réussite.
- CI #2717 (source Edge Function MFA e-mail) : réussite.
- CI #2719 a échoué sur une assertion de portail préexistante qui imposait encore le numéro de Service Worker dz-de-v3.185.0.0.123 après son incrément à .124 ; les contrôles précédents du job, dont les unités et les vérifications du portail jusqu'au contrôle du précache, étaient réussis.
- Assertion corrigée dans ci/check-public-portal.mjs pour attendre dz-de-v3.185.0.0.124. Une nouvelle exécution CI sur le HEAD intégrant cette correction reste à confirmer.
- Aucun test navigateur ou test de compte réel n'est remplacé par cette CI structurelle.
---

## Lot 193 — alignement CI et tests de régression MFA (9 novembre 2026)

- Audit croisé de `mfa-security.js`, `supabase/supabase.js`, `supabase/functions/mfa-email/index.ts`, `index.html` et `sw.js`.
- Confirmation des références réellement livrées : `mfa-security.js?v=8` dans HTML et précache ; Service Worker `dz-de-v3.185.0.0.124`.
- Correction de l'assertion CI qui attendait encore `mfa-security.js?v=7` ; alignement du libellé de version Service Worker.
- Ajout de contrôles de régression statiques pour le statut e-mail, l'échec fermé du contrôle client, l'indisponibilité Resend avant émission, la vérification HMAC et la preuve récente avant désactivation.
- Les premières exécutions CI du Lot 192 avaient mis en évidence deux assertions obsolètes : version SW `.123` puis module MFA `v7`. Les deux assertions ont été corrigées ; le résultat d'une nouvelle exécution complète sur le HEAD courant reste à confirmer.
- Aucune simulation de test navigateur, aucune connexion réelle d'élève, aucun envoi e-mail Resend et aucun test réel TOTP/SMS ne sont revendiqués.
- Aucun changement de `main`, aucune fusion de PR #17, aucun déploiement Cloudflare.
- Complément CI : l'exécution 2723 a ensuite révélé une seconde assertion obsolète, cette fois dans `ci/check-masar.mjs`, qui attendait encore `dz-de-v3.185.0.0.123`. Elle a été alignée sur `.124`. Une nouvelle exécution après ce dernier correctif est en attente.
- Les contrôles du portail public et du module MFA avaient passé dans l'exécution 2723 ; l'échec se produisait dans le contrôle Masar sur cette seule version de cache obsolète.

---

## Lot 194 — validation CI et audit du parcours de connexion MFA (9 novembre 2026)

### 1. Validation automatisée
- CI #2727 : réussite sur le commit `b6e75f75a4219a4e1da1d5a88c99db6a15a505b6`.
- CI #2728 : réussite sur le HEAD `2202ca475f91c4a5b4c1ca7783667ff435de6660`.
- Le job `Validation structurelle & pédagogique` de #2728 est terminé avec succès.
- Les assertions de versions du Service Worker et de `mfa-security.js?v=8` sont donc validées sur ce HEAD.

### 2. Audit statique du parcours de connexion
- Restauration d'une session cloud : `bootGate()` récupère la session Supabase, exige la présence du module MFA, exécute `DZ_MFA.requireGate()` avant de charger le profil et d'ouvrir l'espace étudiant.
- Connexion par mot de passe : le résultat de `SB.login()` est contrôlé, puis le garde MFA est exécuté avant `cloudAuthority()` et `enterApp()`.
- Inscription cloud avec session immédiate : le garde MFA est également appelé avant l'entrée dans l'espace.
- Liaison d'un compte local à un compte cloud : le résultat du login et le garde MFA sont contrôlés avant la validation de la liaison.
- Les quatre parcours comportent un arrêt si le module MFA est absent ou si le garde exige une vérification supplémentaire.
- L'API native utilise `getAuthenticatorAssuranceLevel()` et ne demande un facteur natif que lorsque Supabase indique la transition `aal1` vers `aal2`. Les facteurs vérifiés TOTP/téléphone sont utilisés pour le défi.
- Le code de récupération natif passe par l'API expérimentale Supabase activée dans le chargeur client.

### 3. Limites de cet audit
- Il s'agit d'une revue statique du code versionné et des assertions CI, pas d'un test navigateur ni d'un test de compte réel.
- Aucun test réel TOTP, SMS, code de récupération ou e-mail n'est revendiqué.
- Le facteur e-mail reste personnalisé et ne transforme pas le JWT Supabase en `aal2`.
- Le contrôle du parcours client ne remplace pas une politique d'autorisation serveur indépendante pour chaque API/RPC sensible. Les politiques RLS et la configuration Auth globale restent hors périmètre.
- Aucun secret Resend n'a été consulté ou modifié ; l'envoi e-mail attend toujours un domaine d'expédition vérifié et la configuration des secrets Edge Function.

### 4. État Git et périmètre
- PR #17 : ouverte, non fusionnée ; HEAD contrôlé : `2202ca475f91c4a5b4c1ca7783667ff435de6660`.
- `main` n'a pas été modifiée.
- Aucun changement Supabase, aucune migration, aucune modification RLS/Auth globale et aucun déploiement Cloudflare n'ont été effectués dans ce lot.
- Prochaine étape : tests contrôlés avec un compte de test pour la connexion, restauration après rechargement, challenge TOTP/SMS et codes de récupération ; tester l'e-mail seulement après configuration d'un expéditeur vérifié.


---

## Lot 195 — assertions CI du défi MFA et de l'entrée après vérification (9 novembre 2026)

### Modifications
- Extension de `ci/check-public-portal.mjs` pour contrôler la logique du garde MFA, et pas seulement la présence de ses fonctions.
- Le contrôle vérifie que l'échec de lecture du statut e-mail reste bloquant, que le facteur e-mail non vérifié déclenche un défi lorsque le facteur natif n'impose pas déjà AAL2, et que l'absence d'exigence native permet de poursuivre uniquement après le contrôle du statut e-mail.
- Le traitement du défi doit appeler `finishLogin()` uniquement après un résultat de vérification positif.
- Le script vérifie aussi la voie de récupération, la limite de trois tentatives avec déconnexion et le chargement du profil cloud avant `enterApp()`.
- Commit code : `c161be4cb22605cf79af0e54e5ae399b91af7966`.

### Résultat et limites
- Les assertions viennent d'être ajoutées ; l'exécution CI associée doit encore être observée. Aucune réussite n'est anticipée.
- Ces contrôles restent structurels : ils ne simulent pas les appels Supabase, les codes TOTP/SMS, le courrier Resend ni les interactions du navigateur.
- Aucun changement de logique d'authentification applicative, de configuration Auth globale, de RLS, de schéma ou de fonction Edge n'a été effectué dans ce lot.
- Aucun secret Resend n'a été lu ou modifié ; l'envoi e-mail reste en attente d'un domaine expéditeur vérifié.
- PR #17 reste ouverte et non fusionnée ; `main` et Cloudflare production restent inchangés.

### État CI antérieur
- CI #2729 : réussite sur le commit documentaire `8ded41915f725776c8ec92662b4fae399381491f`.
- Le commit `c161be4` introduit les nouvelles assertions et nécessite sa propre exécution CI.


### Lot 196 — contrôles des transitions du défi MFA (9 novembre 2026)

#### Audit effectué
- Relecture du flux de changement de méthode dans `mfa-security.js` : le choix d'un code de récupération invalide le challenge précédent côté interface (`pending=null`) ; le retour à un facteur TOTP/SMS crée un nouveau challenge avant de remplacer l'état actif.
- Vérification du chemin d'annulation : la commande d'annulation ferme la session Supabase, efface le challenge en mémoire et revient au formulaire de connexion.
- Vérification de l'enrôlement SMS : si Supabase ne parvient pas à démarrer le challenge initial après création du facteur téléphone, le facteur en attente est retiré.
- Ces constats sont une revue statique du code, pas une preuve de comportement réel sur un appareil ou un compte de test.

#### Modifications
- Ajout dans `ci/check-public-portal.mjs` d'assertions couvrant les trois transitions ci-dessus.
- Aucun changement de logique applicative MFA dans ce lot.
- Commit des assertions : `4c9b18db60c2e1fc0c16e9eed736de13235482f8`.

#### Validation
- CI #2730 sur `c161be4` : réussie.
- CI #2731 sur `98936b7` : réussie ; ces deux exécutions valident les assertions du Lot 195 et le dossier correspondant.
- La CI du nouveau commit Lot 196 doit encore être observée ; aucune réussite n'est anticipée.

#### Limites et garde-fous
- Aucun test navigateur, TOTP réel, SMS réel, e-mail Resend réel ou test multi-compte n'a été exécuté.
- Aucun secret, schéma, migration, RLS, grant, rôle ou configuration Auth globale Supabase n'a été modifié.
- Aucun déploiement Cloudflare ; PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.
