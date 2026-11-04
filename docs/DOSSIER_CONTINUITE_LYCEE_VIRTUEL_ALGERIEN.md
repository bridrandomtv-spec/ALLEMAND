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
- Travail limité à `design/prototypes-67-74-alignment` / PR #17 vers `main) ; aucune fusion, aucun déploiement manuel et aucun changement direct sur `main`.


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
