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
