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


### Lot 197 — fermeture de session si la finalisation MFA échoue (9 novembre 2026)

#### Défaut traité
Après validation positive du défi MFA, `finishLogin()` pouvait laisser la session Supabase ouverte et conserver le formulaire de défi affiché si le profil cloud était indisponible. Le même état intermédiaire était possible si le point d'entrée du tableau de bord n'était pas prêt ou si son appel levait une exception.

#### Correction
- Ajout de `returnToLoginAfterMfa()` : tentative explicite de fermeture de la session Supabase, remise à zéro du défi et des tentatives, puis retour à l'écran de connexion.
- Si Supabase ne confirme pas la fermeture, le message l'indique explicitement et demande de recharger la page ; aucune réussite de déconnexion n'est présumée.
- `finishLogin()` n'appelle désormais `enterApp()` qu'après chargement du profil et vérification de la disponibilité du point d'entrée. Les exceptions de finalisation passent par le même chemin de fermeture.
- Cache du module MFA passé à `v=9), Service Worker passé à `dz-de-v3.185.0.0.125`, précache et assertions CI synchronisés.
- Commits code/cache/CI : `546aaa6`, `f8d4913`, `5ce2f86`, `9c782b9`.

#### Validation et limites
- CI #2732 et #2733 : réussies pour le Lot 196.
- La CI du Lot 197 doit encore être observée.
- Les contrôles ajoutés sont statiques ; aucune simulation navigateur, aucun compte réel, aucun TOTP/SMS/Resend réel.
- Aucun changement de schéma, migration, RLS, grant, rôle, secret ou configuration Auth globale Supabase.
- Aucun déploiement Cloudflare ; PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.


#### Ajustement CI après exécution
- CI #2734 sur le commit applicatif `546aaa6` : réussie.
- CI #2737 sur le commit documentaire `1e40f41` : échec sur le contrôle Masar, qui attendait encore la version Service Worker `dz-de-v3.185.0.0.124` alors que le Lot 197 a correctement incrémenté le cache à `...125`.
- Le contrôle de version obsolète a été corrigé dans `ci/check-masar.mjs`, sans assouplir le test fonctionnel : commit correctif `e273efe54e515efa398fca37c86c3abd15b1ed5e`.
- Une nouvelle exécution CI est requise pour valider ensemble la correction et le Lot 197.


### Lot 198 — verrouillage MFA avec fermeture de session confirmée (9 novembre 2026)

#### Défaut traité
Le traitement des trois codes MFA incorrects appelait directement `SB.logout()`, puis affichait l'écran de connexion sans vérifier le résultat. Si la fermeture de session échouait, le message pouvait laisser croire à une déconnexion qui n'avait pas été confirmée.

#### Correction
- Le verrouillage après trois échecs réutilise désormais `returnToLoginAfterMfa()`, qui vérifie le résultat de `SB.logout()`, efface l'état du défi et revient à l'écran de connexion.
- En cas d'échec de fermeture, l'interface indique explicitement que la session n'a pas pu être confirmée comme fermée et demande un rechargement.
- Correction d'un fragment de message français résiduel dans le traitement d'exception ; message désormais en arabe.
- Cache MFA passé à `v=10), Service Worker à `dz-de-v3.185.0.0.126`, précache et contrôles CI synchronisés.
- Commits : correctif applicatif `b4ee45d`, cache HTML `39b07ca`, Service Worker `3a8bcbe`, assertions portail `4ad079f`, contrôle Masar `27b3c1b`.

#### Validation
- CI #2738 : réussie pour la correction du contrôle de version du Lot 197.
- CI #2739 : réussie pour le dossier de continuité du Lot 197.
- La CI du Lot 198 doit encore être observée.

#### Limites
- Assertions statiques uniquement ; pas de test navigateur ou de comptes réels.
- Aucun secret, schéma, migration, RLS, grant, rôle ou réglage Auth global Supabase modifié.
- Aucun déploiement Cloudflare ; PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.


#### Ajustement CI après exécution Lot 198
- CI #2740 sur le correctif applicatif : échec d'une assertion historique qui exigeait encore l'appel direct `SB.logout()` après trois tentatives.
- Le code a été conservé dans sa version plus sûre ; l'assertion a été adaptée pour exiger `returnToLoginAfterMfa()` et donc le contrôle du résultat de déconnexion.
- Correction du contrôle CI : commit `ea813d2967c4a2d45983ca492c4f89f8244b4560`.
- Les exécutions #2742 et #2743 doivent être vérifiées ; aucune réussite n'est présumée.


### Lot 199 — annulation du défi MFA avec fermeture confirmée (9 novembre 2026)

#### Défaut traité
Le bouton d'annulation du défi MFA appelait `SB.logout()` dans un bloc qui ignorait les erreurs, puis affichait « connexion annulée ». Le résultat de fermeture de session n'était donc pas confirmé.

#### Correction
- Le gestionnaire `data-mfa-cancel` réutilise désormais `returnToLoginAfterMfa()`.
- La fermeture de session est contrôlée ; l'état du défi est effacé et l'interface revient à la connexion.
- Si Supabase ne confirme pas la fermeture, l'utilisateur reçoit le message demandant de recharger la page avant de réessayer.
- Cache du module MFA passé à `v=11), Service Worker à `dz-de-v3.185.0.0.127`, précache et assertions CI synchronisés.
- Commits : MFA `f29c1f8`, HTML `09106b8`, Service Worker `b6c9193`, assertions portail `974bbb7`, contrôle Masar `173b4df`.

#### Validation
- CI #2746 : réussie pour le Lot 198.
- La CI du Lot 199 doit encore être observée.

#### Limites
- Validation statique CI ; aucun test navigateur ou compte réel.
- Aucun changement de schéma, migration, RLS, grant, rôle, secret ou configuration Auth globale Supabase.
- Aucun déploiement Cloudflare ; PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.


#### Ajustement CI du Lot 199
- CI #2747 a échoué parce qu'une assertion historique du Lot 196 exigeait encore `SB.logout()` directement dans le gestionnaire d'annulation.
- Le comportement applicatif plus sûr est conservé ; l'assertion historique a été adaptée pour exiger `returnToLoginAfterMfa()`.
- Correctif CI : commit `0fa84f74209ca332865a1195de09ea260aff769c`.
- L'exécution #2750 doit valider le lot après cette correction.


#### Deuxième ajustement CI du Lot 199
- CI #2751 a détecté une collision de nom de variable dans `ci/check-public-portal.mjs` : `mfaCancelBlock` était déjà déclaré par le contrôle du Lot 196.
- Le contrôle ajouté au Lot 199 utilise désormais le nom distinct `mfaCancelBlock199`. Aucun code applicatif n'a été modifié pour cette correction.
- Commit : `fe8b13b028ac1276e93412ad1eedc86d974af8f0`.
- La validation suivante doit confirmer la syntaxe et les assertions complètes.

---

## Lot 200 — renvoi des codes MFA par e-mail (9 novembre 2026)

### Défaut constaté
Le facteur e-mail personnalisé permettait de démarrer et vérifier un défi, mais l'interface ne proposait pas de réémission du code. Un retard ou une perte du premier message pouvait donc bloquer l'utilisateur pendant le défi ou l'enrôlement.

### Correction
- Ajout d'un bouton de réémission dans le défi e-mail de connexion.
- Ajout d'un bouton de réémission dans l'étape de confirmation d'enrôlement e-mail.
- Chaque réémission repasse par l'action serveur `start` avec le but correspondant (`login` ou `enroll`) ; le nouvel identifiant de défi remplace l'ancien côté interface.
- Le bouton est désactivé pendant la requête et le champ du code est vidé après émission d'un nouveau défi.
- Le serveur conserve la responsabilité des délais, quotas, invalidations de défi et contrôles d'envoi ; aucune limite serveur n'est contournée.
- Cache du module MFA passé à `v=12), précache synchronisé et Service Worker avancé à `dz-de-v3.185.0.0.128`.
- Assertions CI ajoutées pour vérifier les deux parcours de réémission et la synchronisation du cache.

### Commits
- MFA : `e4a2c5e`.
- HTML : `24dfba8`.
- Service Worker : `ca5aacd`.
- Assertions CI : `db433b9`.

### Validation et limites
- La CI déclenchée par ces commits doit encore être observée ; aucune réussite n'est anticipée.
- Aucun test d'envoi réel Resend, de réception Gmail, de navigateur ou de compte utilisateur n'a été effectué.
- La réémission reste conditionnée à la configuration effective des secrets Edge Function et d'un expéditeur Resend vérifié.
- Aucun secret n'a été lu, affiché ou ajouté au dépôt.
- Aucun changement de schéma, migration, RLS, grant, rôle ou configuration Auth globale Supabase.
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée ; aucun déploiement Cloudflare.

### Complément de validation Lot 200 — assertion CI obsolète (10 novembre 2026)
- Les workflows #2759 et #2760 ont échoué sur le contrôle du tableau de bord مسارك, avant d'atteindre les assertions ajoutées pour le renvoi MFA.
- Cause exacte relevée dans les logs : `ci/check-masar.mjs:61` attendait encore `dz-de-v3.185.0.0.127`, alors que le Service Worker et son précache sont en `.128`.
- Correction ciblée : assertion mise à jour vers `dz-de-v3.185.0.0.128`, commit `2d6d7af`.
- Aucun code applicatif Masar ni contenu du tableau de bord n'a été modifié par cette correction.
- Nouvelle CI à surveiller ; le résultat n'est pas encore connu au moment de cette note.

---

## Lot 201 — restauration des points d'entrée du portail (10 novembre 2026)

### Symptômes observés
- Console navigateur : `ReferenceError: enterApp is not defined` à la construction de `window.DZ`.
- `bootGate()` appelait `paintGateStats()`, également absente.
- `modules.js` signalait ensuite `app.js non chargé`, car l'évaluation de `app.js` s'arrêtait avant l'affectation de `window.DZ`.

### Cause racine
- L'historique Git confirme que le commit `2f4de81` (Lot 178) a supprimé les déclarations `paintGateStats()` et `enterApp()` alors qu'il conservait leurs appels.
- Les commits ultérieurs ont restauré `bindGateEvents()` et renforcé MFA, mais ces deux fonctions n'ont pas été réintroduites.
- Il s'agit donc d'une régression JavaScript de portée globale, antérieure au module `modules.js`, et non d'une erreur de configuration Supabase.

### Correction
- Restauration de `paintGateStats()` pour rendre les indicateurs descriptifs du portail.
- Restauration de `enterApp(session)` : masque le portail, affiche `#shell`, puis route vers la vue demandée si elle est valide, sinon vers `masar`.
- Conservation des gardes MFA, des flux Auth cloud et des événements existants ; aucune modification du schéma Supabase, des politiques RLS ou des données.
- Cache applicatif : `app.js?v=3563` dans `index.html` et le précache.
- Service Worker : `dz-de-v3.185.0.0.129`.
- Assertions CI ajoutées pour vérifier les deux déclarations et l'export `window.DZ.enterApp`.

### Commits
- Restauration `app.js` : `12cd619`.
- Cache HTML : `a220980`.
- Précache Service Worker : `55a3b0d`.
- Contrôles CI : `61714f3`.

### Validation et limites
- Les changements sont sur `design/prototypes-67-74-alignment` uniquement.
- La CI doit encore confirmer le nouveau HEAD ; les assertions statiques ne remplacent pas un test navigateur.
- Après mise à jour du preview, vérifier le chargement sans erreur de `app.js`, la création de `window.DZ`, le portail de connexion, le mode démo et l'accès au tableau de bord après authentification.
- Aucun déploiement Cloudflare ni fusion de PR #17 n'a été effectué.

### Ajustement CI du Lot 201
- CI #2765 a confirmé la syntaxe JavaScript, puis a échoué uniquement dans le contrôle historique de Masar : `ci/check-masar.mjs` attendait encore le Service Worker `.128` et le cache `app.js?v=3562`.
- Les assertions concernées ont été synchronisées avec les ressources effectivement livrées : `app.js?v=3563` et `dz-de-v3.185.0.0.129`.
- Correctif CI : commit `3baf00d`. Aucun changement du code applicatif n'a été nécessaire après la restauration des deux fonctions.
- La nouvelle exécution déclenchée sur ce commit doit encore être observée ; aucune réussite CI n'est anticipée.


---

## Lot 202 — MFA e-mail obligatoire et enrôlement automatique (10 novembre 2026)

### Décision fonctionnelle
- L'utilisateur a choisi la politique A : MFA par e-mail obligatoire pour les étudiants, avec enrôlement automatique lors de la première connexion.
- Le parcours ne doit plus demander à l'étudiant d'ouvrir les paramètres de son compte ni de cliquer sur un bouton d'activation.
- Le garde MFA actuellement partagé par les parcours cloud s'applique à tous les comptes cloud qui l'empruntent (élèves, mais aussi autres rôles). Une restriction aux seuls rôles élèves demanderait un contrôle de rôle explicite avant application de la politique.

### Modifications dans la PR #17
- `mfa-security.js` : si aucun facteur e-mail n'est enrôlé, le garde démarre automatiquement `mfa-email start` avec `purpose: enroll`; si le facteur existe mais que la session courante n'est pas vérifiée, il utilise `purpose: login`.
- Les deux cas utilisent le même écran de défi e-mail déjà présent au login ; le code d'enrôlement est vérifié par le serveur avant la création du facteur et l'enregistrement de la session vérifiée.
- Après toute vérification réussie, `finishLogin()` réexécute le garde afin de contrôler l'étape suivante éventuelle, notamment un facteur Supabase natif AAL2, avant de charger le profil et d'ouvrir le tableau de bord.
- Le renvoi de code conserve le but actif (`enroll` au premier accès, `login` aux connexions suivantes).
- La page des paramètres n'expose plus de bouton d'activation manuelle ni de désactivation autonome ; elle informe que l'activation se fera automatiquement au prochain login.
- `supabase/functions/mfa-email/index.ts` : l'action serveur `disable` renvoie désormais HTTP 403 / `EMAIL_FACTOR_REQUIRED` dans la version source de la PR.
- Cache du module MFA : `mfa-security.js?v=13`; Service Worker : `dz-de-v3.185.0.0.130`; précache et assertions CI synchronisés.

### Commits du lot
- MFA client : `0a962af096053464b3b203dac5a083045add3ab7`.
- Fonction Edge (source PR uniquement) : `0d81ce19aaaad1201c0698ca44906982bfbdb3c0`.
- Assertions CI : `bd9cecabdd145fceac3b0973ef9c114e334db2b0`.
- Cache HTML : `9092daded5bd45b9187adcd41aee5e3ee24bb4ed`.
- Service Worker : `a6748e675f9a23cb25f9e6392513e5a8add624d8`.
- Contrôle cache Masar : `4d35ac0ca2bc991d5490f80c78e49e00d234cc9e`.
- Correction du renvoi pour conserver `purpose: enroll` : `2c33b5217625efe34ffdaa7ca631f69783edd6a0`.

### Vérifications effectuées
- Relecture après écriture des six fichiers applicatifs/CI : 16 assertions structurelles ciblées réussies, dont enrôlement initial automatique, blocage fermé, renvoi avec le bon but, recontrôle après vérification, absence du bouton de désactivation, blocage serveur dans la source PR et cohérence des caches.
- Ces assertions ont été exécutées comme contrôles de contenu du code récupéré ; elles ne remplacent pas l'exécution du workflow CI, un test navigateur ni un test avec un compte réel.
- Le check Supabase Preview du dernier commit a été retourné `skipped` car la branche n'est pas liée à une Supabase Branch ; ce n'est pas un résultat de validation fonctionnelle.
- Aucun e-mail réel Resend, aucune réception Gmail et aucun test navigateur n'ont été exécutés.

### Limites de sécurité et déploiement
- Le facteur e-mail est personnalisé : sa validation ne transforme pas le JWT Supabase en `aal2`. La documentation Supabase précise que l'interface MFA doit être complétée par des règles d'autorisation côté serveur/API/RLS.
- L'audit antérieur n'a pas établi d'enforcement AAL dans les politiques RLS examinées. Le présent lot verrouille le parcours d'entrée de l'application, mais ne doit pas être présenté comme une enforcement complète des accès directs Data API/RPC.
- La source Edge Function modifiée appartient à la PR ; la fonction déployée sur le projet Supabase n'a pas été mise à jour. Sa version active reste inchangée tant qu'un déploiement séparé n'a pas été explicitement autorisé.
- Aucun secret Resend, réglage Auth global, schéma, migration, RLS, grant ou donnée n'a été modifié.
- Aucun déploiement Cloudflare, aucune fusion, aucun changement sur `main`.
- PR #17 reste ouverte et non fusionnée. Le workflow CI complet du nouveau HEAD reste à confirmer.

### Étapes restantes avant mise en service
1. Confirmer la réussite de la CI sur le HEAD du lot.
2. Effectuer un test navigateur contrôlé : première connexion sans facteur, réception du code, enrôlement, entrée ; puis nouvelle connexion avec défi `login`, renvoi, code erroné et expiration.
3. Vérifier l'envoi réel Resend avec un expéditeur accepté par Resend.
4. Définir séparément l'enforcement serveur/RLS nécessaire avant d'annoncer une protection MFA obligatoire de toutes les données.
5. Déployer la fonction Edge et le front uniquement après validation et autorisation distincte.


### Ajustement CI du Lot 202 — assertion de version portail obsolète
- La CI #42825970904 a passé les étapes de validation des fichiers requis, YAML/JSON, corpus, scripts pédagogiques et syntaxe JavaScript.
- Elle a ensuite échoué dans `ci/check-public-portal.mjs` avec le message `précache Service Worker non synchronisé avec le CSS du portail`.
- Cause exacte : six assertions/logs du contrôle portail attendaient encore `dz-de-v3.185.0.0.129`, alors que le Lot 202 avait synchronisé le Service Worker sur `.130`.
- Correctif ciblé : remplacement des six références historiques par `.130`, commit `1ced68a4598a7e0c13810e9d695f7eb4dd4da60a`. Aucun code de portail, CSS ou tableau de bord n'a été changé par ce correctif.
- Une nouvelle exécution CI est déclenchée sur le nouveau HEAD ; son résultat doit être vérifié avant de déclarer le lot validé.


### Deuxième ajustement CI du Lot 202 — assertion step-up devenue obsolète
- La CI #42826072402 a passé les validations précédentes, puis a échoué dans le contrôle MFA du portail avec `sécurité MFA e-mail serveur absente : RECENT_STEP_UP_REQUIRED`.
- Cause : le Lot 202 a volontairement supprimé le désenrôlement autonome et remplacé l'ancienne vérification préalable au désenrôlement par le refus serveur `EMAIL_FACTOR_REQUIRED`. L'assertion historique attendait encore le marqueur de l'ancien parcours.
- Correction ciblée : le marqueur CI historique a été remplacé par `EMAIL_FACTOR_REQUIRED`, commit `f9f2c57fd23472b5c9dee35efb5bf77826427cad`. Aucun code applicatif n'a été modifié par ce correctif.
- Une nouvelle CI est déclenchée ; le résultat reste à confirmer.


### Troisième ajustement CI du Lot 202 — assertion du garde e-mail
- La CI #42826171551 a validé la syntaxe JavaScript et les validations précédentes, puis a échoué sur une seconde assertion historique du garde e-mail qui attendait l'ancienne condition `enrolled && !verified && !nativeState.required`.
- Le nouveau parcours exige le facteur e-mail dans tous les cas : enrôlement si absent, défi login s'il existe mais que la session n'est pas vérifiée.
- Assertion mise à jour pour contrôler `!emailState.enrolled || !emailState.verified` et le choix `enroll/login`, commit `bec61ce8078ccb382c358663bf7b0bd713b4825f`.
- Aucun code applicatif n'a été modifié par ce correctif. Nouvelle exécution CI à surveiller.


### Quatrième ajustement CI du Lot 202 — marqueur du garde et cache MFA v13
- La CI #42826303991 a encore échoué sur une assertion historique : elle exigeait la condition `if(!window.SB || !SB.mfaAssurance)`, alors que le nouveau garde vérifie aussi la disponibilité de `SB.mfaEmail`.
- Le contrôle CI a été aligné sur le garde réel et les huit références de cache MFA historiques `v=12` ont été mises à jour vers `v=13`, commit `39c552b06a116dc1aefb85925928c64368bba1a6`.
- Aucun code applicatif n'a été modifié par ce correctif. Nouvelle exécution CI à confirmer.


### Cinquième ajustement CI du Lot 202 — renvoi e-mail unifié
- La CI #42826440032 a validé les assertions MFA précédentes, puis a révélé une assertion du Lot 200 qui attendait encore le renvoi séparé `purpose: login` et un ancien formulaire d'enrôlement manuel.
- Le parcours automatique utilise désormais un seul gestionnaire de renvoi : il reprend `pending.purpose` (`enroll` au premier accès, `login` ensuite) et remplace le challenge courant. La branche morte liée à l'ancien formulaire de paramètres a été supprimée.
- Les assertions CI du Lot 200 ont été réécrites pour contrôler le renvoi unifié et la réutilisation de l'écran de connexion pour l'enrôlement initial.
- Commits : MFA `a40e2506ff4f9de5ec28c6d2a6e9edc0d4383790` ; CI `825dbd125a13e6678a2225381dfaa804fc5ce062`.
- Nouvelle CI à confirmer ; aucun test navigateur ou envoi réel Resend n'a encore été effectué.


### Sixième ajustement CI du Lot 202 — bouton de renvoi dans le défi unifié
- La CI #42826549629 correspondait au commit MFA avant la mise à jour des assertions Lot 200 ; elle a échoué parce qu'un test cherchait le bouton de renvoi dans l'ancien formulaire d'enrôlement des paramètres, supprimé du parcours.
- Le renvoi existe désormais dans le défi de connexion partagé ; le test vérifie le gestionnaire `data-mfa-email-resend` et l'état e-mail en attente plutôt qu'un ancien formulaire inexistant.
- Correctif CI : commit `ed4feba3f088f55d41c814ca5fa4148359a4ef8d`. Aucun code applicatif n'a été modifié par ce correctif.
- Nouvelle CI sur le HEAD à confirmer.


### Validation CI finale du code Lot 202 (10 novembre 2026)
- CI #42826671288 sur le commit applicatif `ed4feba3f088f55d41c814ca5fa4148359a4ef8d` : **réussie, 33/33 étapes**.
- La validation du portail public, le contrôle de مسارك, la recherche/notifications, les badges/XP, les tests d'accès/fuite, la matrice des parcours et les régressions pédagogiques sont également réussis.
- Aucun échec d'étape sur cette exécution.
- Le HEAD de PR a ensuite reçu un commit documentaire `3c950f717d1260558499f6bb93fb9dd302fb36af` ; la CI correspondante #42826682599 est en cours au moment de cette note. Le code applicatif est identique au commit déjà validé.
- La validation CI reste structurelle et automatisée : aucun test navigateur réel, aucune réception Resend et aucun test sur compte étudiant réel ne sont revendiqués.



### Lot 203 — audit Supabase MFA / RLS en lecture seule (10 novembre 2026)

#### État Git et CI vérifiés
- PR #17 : toujours ouverte, non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`.
- HEAD contrôlé : `1f56b4d7f3c725f4a895321c3ce61cb0d65dd6cc`.
- CI #42826804786 : **réussie** ; job « Validation structurelle & pédagogique » terminé, toutes les 33 étapes de validation du workflow réussies.
- Aucun merge, déploiement Cloudflare ou déploiement Supabase effectué.

#### Constat du catalogue PostgreSQL
- Toutes les tables inspectées dans le schéma exposé `public` ont RLS activé.
- Les trois tables du MFA e-mail personnalisé sont présentes :
  - `public.mfa_email_challenges` : challenge, utilisateur, session, finalité, hash, expiration, consommation et compteur d'essais.
  - `public.mfa_email_factors` : facteur activé par utilisateur.
  - `public.mfa_email_sessions` : session vérifiée, date de vérification et expiration.
- RLS est activé sur ces trois tables, mais aucune politique n'y est définie. Les privilèges de table observés sont accordés à `postgres` et `service_role`, pas aux rôles API `anon` ou `authenticated`.
- Les fonctions `mfa_email_issue_challenge` et `mfa_email_consume_challenge` sont en mode SECURITY INVOKER (pas SECURITY DEFINER) et leur ACL observée limite EXECUTE à `postgres` et `service_role`.
- La fonction d'émission applique déjà un délai minimal de 60 secondes, des plafonds de 5 défis par heure et 10 par 24 heures, invalide les défis antérieurs non consommés et fixe une durée de vie de 5 minutes. La consommation vérifie l'utilisateur, la session, l'expiration, l'usage unique et bloque après 5 tentatives.

#### Conséquence sécurité
- Le stockage MFA est isolé des accès directs des rôles API ordinaires, ce qui est cohérent avec un accès serveur via `service_role`.
- En revanche, aucune politique restrictive des tables applicatives ne vérifie encore qu'une session authentifiée possède une ligne MFA e-mail vérifiée et non expirée correspondant simultanément à `auth.uid()` et à l'identifiant de session du JWT.
- Le contrôle d'entrée du navigateur ne suffit donc toujours pas à protéger les appels directs à la Data API/RPC.
- Le facteur e-mail personnalisé ne produit pas le claim Supabase `aal2` ; il ne faut donc pas ajouter une politique `auth.jwt()->>'aal' = 'aal2'` en prétendant qu'elle valide ce facteur personnalisé.

#### Avis Supabase observés
- Les Security Advisors signalent les trois tables MFA comme « RLS enabled, no policy » (niveau INFO) ; leur accès est néanmoins restreint par les privilèges de table observés.
- D'autres avertissements de fonctions SECURITY DEFINER existent dans le schéma public ; ils sont hors périmètre de ce contrôle ciblé et nécessitent un audit fonction par fonction avant toute correction.

#### Aucune modification distante
- Audit effectué en lecture seule : catalogue, colonnes, politiques, privilèges, définitions de fonctions, migrations et Security Advisors.
- Aucun SQL DDL/DML exécuté ; aucune politique, fonction, grant, table, migration, donnée, secret ou configuration Auth n'a été modifié.
- Aucun déploiement Supabase ou Cloudflare ; PR #17 toujours ouverte et non fusionnée.

#### Décisions techniques à valider avant une enforcement
1. Confirmer si l'obligation doit réellement viser uniquement les étudiants, comme le choix fonctionnel initial, ou tous les rôles cloud : le garde client du Lot 202 est actuellement partagé entre rôles.
2. Concevoir un prédicat serveur vérifiant l'utilisateur, le `session_id` du JWT, l'existence d'un facteur actif et une session MFA non expirée. Le helper éventuel devra être isolé dans un schéma non exposé, avec privilèges minimaux, contrôle explicite de `auth.uid()`, `search_path` verrouillé et EXECUTE limité.
3. Cartographier les tables applicatives sensibles, les politiques permissives existantes, les RPC et les Edge Functions avant d'ajouter des politiques RLS **restrictives**. Préserver les flux publics réellement nécessaires et les parcours admin/enseignant/parent.
4. Préparer uniquement une migration source dans la PR après validation de la matrice d'accès ; ne pas l'appliquer au projet Supabase actif sans autorisation distincte.
5. Tester les cas AAL1/non vérifié, session MFA valide, session expirée, autre utilisateur, autre session, rôles non étudiants et accès RPC direct.

**Décision en attente :** l'audit est terminé, mais aucune enforcement RLS n'est encore autorisée/appliquée. La prochaine modification de politiques ou de schéma nécessite une approbation explicite après présentation de la matrice d'accès.


---

## Lot 204 — MFA e-mail réservé aux étudiants et enforcement serveur/RLS préparé (10 novembre 2026)

### Périmètre approuvé
- L'utilisateur a explicitement autorisé la préparation du code et de la migration source dans la PR #17.
- Politique limitée aux profils dont `public.profiles.role = 'eleve'`.
- Les profils `prof`, `admin`, `parent` et les autres rôles non étudiants ne sont pas soumis au MFA e-mail obligatoire.
- Aucun merge, aucun déploiement Cloudflare, aucune application de migration au projet Supabase actif.

### Audit complémentaire
- Valeurs de rôles constatées dans les profils présents : `admin`, `eleve`, `prof`.
- Aucune vue dans le schéma `public` n'a été retournée par le catalogue `pg_views`.
- Le bucket Storage `prive` est privé. Ses politiques actuelles concernent les fichiers personnels et les pièces jointes de messagerie.
- Les tables publiques inspectées ont RLS activé. Les politiques existantes sont permissives ; l'enforcement prévu s'ajoute sous forme de politique restrictive et ne remplace pas les règles de propriété, rôle, wilaya ou modération.
- Les RPC SECURITY DEFINER exposées aux étudiants ont été identifiées : accès aux abonnements, acceptation/retrait des accords, messagerie, demandes de rattachement parent-enfant et preuve de paiement. Les RPC administratives et celles réservées aux parents conservent leurs contrôles de rôle/permission existants.

### Code préparé dans la PR
1. `supabase/functions/mfa-email/index.ts`
   - Le serveur lit le rôle réel dans `profiles` via le client privilégié.
   - `status` retourne désormais `required: true` uniquement pour `role='eleve'`.
   - Les actions `start` et `verify` refusent les autres rôles avec `STUDENT_MFA_ONLY`.
   - Une absence de profil ou une erreur de lecture bloque le parcours au lieu de supposer un rôle.
2. `mfa-security.js`
   - Le client exige un booléen explicite `required` renvoyé par la fonction Edge ; une ancienne réponse sans ce champ échoue de manière fermée.
   - L'enrôlement automatique et le défi e-mail ne sont déclenchés que si `required=true`.
   - Le contrôle MFA Supabase natif éventuel reste vérifié indépendamment.
   - Les paramètres distinguent le statut obligatoire des étudiants des autres comptes.
3. Migration source `supabase/migrations/20261110160000_enforce_student_email_mfa.sql`
   - Crée un helper `private.student_email_mfa_access_allowed()` SECURITY DEFINER, avec `search_path` vide, qui vérifie le profil, le rôle étudiant, le claim `session_id`, le facteur actif et la session MFA non expirée.
   - Le schéma `private` n'est pas ajouté aux schémas exposés ; l'exécution du helper est limitée à `authenticated`. Le rôle de confiance `service_role` conserve son bypass serveur explicite.
   - Ajoute une politique RLS **RESTRICTIVE** sur les 37 tables publiques qui ont RLS activé, sans supprimer ni réécrire les politiques permissives existantes. Le helper est appelé via un sous-SELECT stable pour éviter une réévaluation par ligne.
   - Ajoute le même garde restrictif à `storage.objects` pour le bucket privé `prive`.
   - Ajoute une vérification explicite dans les RPC SECURITY DEFINER accessibles aux parcours étudiants : `active_entitlement`, `agreement_accept`, `agreement_status_for`, `agreement_withdraw`, `msg_can_dm`, `msg_is_member`, `msg_member_ok`, `msg_not_blocked`, `msg_open_direct`, `my_parent_link_requests`, `respond_parent_link_request`, `subscription_set_preuve` et `unlink_child`.
   - Les politiques et fonctions existantes sont conservées par remplacement contrôlé des définitions nécessaires ; les fonctions administratives/parentales non concernées ne sont pas réécrites.
4. Cache : `mfa-security.js?v=14`, Service Worker `dz-de-v3.185.0.0.131`.
5. CI : assertions statiques ajoutées pour le rôle étudiant, le statut Edge, les gardes RLS, le Storage privé et les RPC ciblées.

### Limites à conserver explicitement
- La migration n'a pas été exécutée et aucune politique active du projet Supabase n'a changé.
- La validation statique CI ne remplace pas une exécution sur une base de test PostgreSQL/Supabase ni les tests d'accès avec comptes de chaque rôle.
- Les URL Storage signées déjà émises restent utilisables jusqu'à leur expiration ; RLS n'annule pas rétroactivement un lien signé.
- Les appels directs à une fonction SECURITY DEFINER non identifiée dans cette liste doivent être recontrôlés avant mise en service ; les fonctions administratives restent protégées par leurs contrôles existants de permissions, mais un audit exhaustif de toutes les RPC demeure nécessaire.
- Les clients utilisant une ancienne Edge Function sans champ `required` seront bloqués par le nouveau garde client. L'ordre de mise en service devra donc être : déployer la nouvelle Edge Function, appliquer la migration validée, puis déployer le front.
- Le facteur e-mail personnalisé ne produit toujours pas le claim natif `aal2` ; la migration utilise l'état MFA propre à l'application, pas une fausse assertion AAL2.

### Validation / opérations
- La migration est uniquement un fichier source ajouté à la branche PR #17.
- Aucun SQL DDL/DML n'a été exécuté sur le projet actif.
- Aucun secret Resend, réglage Auth global, rôle, grant distant ou donnée n'a été modifié.
- PR #17 reste ouverte, non fusionnée ; aucun déploiement Cloudflare ou Supabase.
- Les nouvelles exécutions CI du HEAD après le lot doivent être vérifiées avant de déclarer la validation réussie.



### Résultat final CI Lot 204 — commit documentaire HEAD (10 novembre 2026)
- CI #42838420154 / run #2804 sur le HEAD `6745f337a9a7088de1fee2b9657ab29265f55e59` : **réussie, 33/33 étapes**, zéro étape en échec.
- Le job unique « Validation structurelle & pédagogique » est terminé avec conclusion `success`.
- Le contrôle MFA étudiant, les assertions migration RLS/Storage/RPC, le portail, مسارك, les tests d'accès/fuite, la matrice des parcours et les régressions pédagogiques sont passés dans ce workflow.
- Cette CI valide les contrôles statiques et les tests automatisés du dépôt ; elle ne prouve pas l'exécution de la migration sur une base de test, la réception Resend ou un test navigateur avec des comptes réels.
- La PR #17 reste ouverte, non fusionnée, cible `main` ; aucun déploiement Supabase/Cloudflare ni aucune migration distante n'a été effectué.


### CI de confirmation après mise à jour finale du dossier — Lot 204
- CI #42838689058 / run #2805 sur le commit `85898309d01a37fded1818c364b927ab1f3e4fec` : **réussie, 33/33 étapes**, zéro échec.
- Le workflow a terminé avec succès après l'ajout de la note CI au dossier de continuité ; aucune étape en échec.
- Le commit ne change que la documentation par rapport au code MFA/RLS déjà validé par CI #2803/#2804.

---

## Lot 205 — correction ciblée de la migration MFA étudiant (10 novembre 2026)

### Résultat du second audit
Le contrôle approfondi de la migration Lot 204 a identifié deux défauts de portée/compatibilité avant toute application :
1. La politique restrictive initiale sur `storage.objects` n'incluait pas de condition `bucket_id`. Elle aurait donc ajouté le garde MFA aux opérations authentifiées de tous les buckets, alors que le périmètre décidé concerne uniquement le bucket privé `prive`.
2. Le helper utilisait `auth.role()`, fonction déconseillée dans les politiques RLS et le code d'autorisation Supabase actuel.

### Corrections réalisées dans la branche PR #17
- `storage.objects` : les expressions `USING` et `WITH CHECK` incluent maintenant `bucket_id <> 'prive' OR private.student_email_mfa_access_allowed()`. Les autres buckets restent soumis à leurs politiques existantes, sans ce garde supplémentaire ; le bucket `prive` exige la session MFA étudiant.
- Helper : remplacement de `auth.role()` par la lecture du claim JWT `(select auth.jwt() ->> 'role')`.
- Privilèges : `EXECUTE` du helper accordé explicitement à `authenticated` et `service_role`, nécessaire pour les appels de confiance qui peuvent passer par les RPC SECURITY DEFINER ; le branchement du rôle service reste explicite.
- Contrôles CI : assertions ajoutées pour interdire `auth.role()` et vérifier les deux clauses de portée `bucket_id <> 'prive'` (USING et WITH CHECK).

### Références Git
- Migration corrigée : commit `6dd9c9d28be466943b0ab5e97f2a9312fe95dc36`.
- Assertions CI : commit `fb7547df11d849eadc5ce0e9a6a17838451c93ae`.
- Le dossier est mis à jour dans la même branche ; le HEAD et la CI de ce dernier commit doivent être vérifiés après l'exécution du workflow.

### État opérationnel inchangé
- Aucune migration exécutée sur le projet Supabase actif.
- Aucune Edge Function déployée ; la version active reste à contrôler séparément avant mise en service.
- Aucun déploiement Cloudflare, aucun merge ; PR #17 reste ouverte.
- `main` reste inchangée.
- La CI statique ne remplace toujours pas une exécution de la migration sur une base PostgreSQL/Supabase de test ni une matrice de tests avec comptes réels (élève MFA valide/absent/expiré, professeur, admin, parent, service_role, autres buckets Storage).
- Les URL Storage signées déjà émises conservent leur validité jusqu'à expiration.

### Ordre de validation avant activation
1. Vérifier que la nouvelle migration compile et s'applique sur une base de test isolée.
2. Vérifier les accès Data API/RPC pour les sessions élève non vérifiée, vérifiée, expirée et décalée sur un autre `session_id`.
3. Vérifier que les rôles non étudiants ne sont pas bloqués.
4. Vérifier que le bucket `prive` est soumis au MFA étudiant et que les autres buckets restent sous leurs seules politiques existantes.
5. Tester les fonctions SECURITY DEFINER et les accès directs qui contournent RLS.
6. Seulement après ces validations et une autorisation séparée : déploiement Edge Function, application migration production, puis déploiement front.

### Complément de cohérence des privilèges — Lot 205
- Le helper est exécutable par `service_role` et son schéma doit également lui être accessible au niveau USAGE. Le grant de schéma est donc aligné sur les grants d'exécution : `authenticated, service_role`.
- Une assertion CI vérifie maintenant ce privilège de schéma, en plus du grant EXECUTE.
- Commit migration : `3d05d9761df6fc0cc84816444cf50db19a0df120` ; commit test : `bae3529b75caf68d8102dc0dec421b53c70ec4de`.
- Cette autorisation de schéma ne rend pas le schéma `private` exposé dans la Data API et n'accorde aucun privilège sur les tables qu'il contient.

---

## Lot 206 — CI finale et audit Supabase en lecture seule (10 novembre 2026)

### CI de la migration corrigée
- CI #2810 / run `42840220297` sur le HEAD `01e9442ee8164d8470e5fe4ceebe7a7c68123b8d` : **succès**.
- Job `Validation structurelle & pédagogique` : terminé avec succès, 33 étapes exécutées, aucune étape en échec.
- Ce résultat valide les contrôles automatisés du dépôt ; il ne constitue pas une exécution SQL de la migration ni un test de bout en bout MFA/Resend.

### Introspection du projet Supabase actif — strictement en lecture seule
Projet `azjwcybivirvpxbfhyzk` :
- 37 tables du schéma `public` ont RLS activé, cohérent avec la portée de la boucle de migration.
- Aucune politique existante ne porte déjà le nom `student_email_mfa_gate` dans `public` ; aucun helper `private.student_email_mfa_access_allowed` n'est actuellement installé.
- Le bucket Storage existant est `prive` et il est privé.
- Les tables `mfa_email_factors` et `mfa_email_sessions` existent ; aucune ligne facteur/session n'est actuellement enregistrée.
- La distribution des profils observée lors de cette lecture : 4 `eleve`, 1 `prof`, 1 `admin`. Cette observation est un instantané, pas une règle de population.
- Les 13 fonctions SECURITY DEFINER réécrites par la migration ont été retrouvées avec les signatures attendues et sont détenues par `postgres`.
- Inventaire complémentaire des autres fonctions SECURITY DEFINER exécutables par `authenticated` : les RPC additionnelles examinées sont réservées au rôle `parent`, aux contrôles administrateur, aux opérations comptables/administratives, ou à la lecture des accords actifs. Elles ne constituent pas une voie étudiante identifiée qui permettrait de remplacer le garde MFA. Les fonctions de lecture des rôles et permissions restent des sondes de rôle/autorisation, pas des points d'accès aux données pédagogiques.
- Les politiques Storage existantes sont permissives et la nouvelle politique restrictive reste limitée à `prive`, conformément au correctif Lot 205.

### Limite de validation de base de données
- Le projet Supabase connecté ne présente actuellement qu'une branche `main` ; aucune branche de développement isolée n'est disponible.
- Aucune branche Supabase n'a été créée : la création peut entraîner un coût horaire et exige de vérifier/valider le coût avant toute opération.
- La migration n'a pas été exécutée, même en lecture/écriture transactionnelle, sur le projet actif. Aucun objet, rôle, grant, politique, secret, utilisateur ou donnée n'a été modifié dans Supabase.
- L'Edge Function active reste la version 7. La source plus récente est uniquement dans la PR.
- Le test de syntaxe/effets SQL sur PostgreSQL isolé, la matrice JWT/session, et les essais Resend réels restent à faire sur un environnement de test dédié.

### État Git
- PR #17 : ouverte, non fusionnée ; HEAD `01e9442ee8164d8470e5fe4ceebe7a7c68123b8d`.
- CI #2810 réussie.
- Aucun rebase, merge, déploiement Edge Function, migration production ou déploiement Cloudflare.
- `main` inchangée.


---

## Lot 207 — confirmation CI du HEAD documentaire Lot 206 (10 novembre 2026)

- CI #2811 / run `42849377552` sur le commit `14c5bda12a0d74eb78da8c4381602f45fef02f29` : **réussie**.
- Le workflow `CI — ALLEMAND` est terminé avec conclusion `success`; le job unique « Validation structurelle & pédagogique » a réussi toutes ses étapes, y compris les contrôles MFA étudiant, RLS/Storage/RPC, syntaxe JavaScript et tests pédagogiques.
- Cette exécution confirme le HEAD documentaire du Lot 206. Elle ne constitue pas un test PostgreSQL/Supabase isolé, un test navigateur, une livraison Resend, ni un test de bout en bout sur un compte étudiant réel.
- PR #17 relue après le workflow : ouverte, non fusionnée, cible `main`, HEAD `14c5bda12a0d74eb78da8c4381602f45fef02f29`. Aucun changement de `main`.
- Aucune branche Supabase de test créée ; aucun coût engagé. Aucune migration appliquée, aucune Edge Function déployée, aucun déploiement Cloudflare.
- **Prochaine étape technique :** obtenir un environnement Supabase isolé après information et accord explicite sur son coût, puis exécuter la migration et la matrice de tests MFA/RLS/Storage/RPC sur cet environnement seulement. La production reste hors périmètre.


---

## Lot 208 — liaison MFA avec la session Auth active (10 novembre 2026)

### Constat et correction source
- La lecture du catalogue Supabase, strictement en lecture seule, a confirmé que `auth.sessions` expose `id`, `user_id` et `not_after`.
- Le helper `private.student_email_mfa_access_allowed()` vérifiait déjà le `session_id` du JWT et la session MFA e-mail applicative non expirée. Il vérifie maintenant aussi qu'une session correspondante existe encore dans `auth.sessions`, appartient au même utilisateur et n'a pas dépassé `not_after`.
- Ce contrôle réduit le risque qu'un jeton d'une session révoquée continue à être accepté uniquement parce qu'une ligne MFA personnalisée reste présente.
- Assertions CI ajoutées pour les trois contrôles `auth.sessions` (identifiant, propriétaire, expiration).

### Commits
- Migration : `49340365aec567245f7f2f4fd010f1bbe5e9c6cd`.
- Assertions CI : `b6ff000012a899f59f6621dd5da584b36e243054`.
- Le résultat CI du nouveau HEAD doit être vérifié avant de déclarer ce lot validé.

### Limites et sécurité opérationnelle
- Modification exclusivement dans la branche PR #17. Aucun SQL exécuté sur le projet actif ; aucune session, table, politique, clé, configuration Auth ou donnée n'a été modifiée.
- Le schéma réel `auth.sessions` a été inspecté en lecture seule ; aucune branche Supabase de test n'existe encore, à part `main`.
- L'Edge Function active reste v7 ; aucun déploiement Edge Function/Cloudflare, aucune migration appliquée et aucun merge.
- La livraison Resend n'est pas encore prouvée. La présence des secrets ne prouve ni que l'adresse `MFA_EMAIL_FROM` est un expéditeur autorisé par Resend, ni qu'un étudiant reçoit effectivement le code. Ce test reste obligatoire avant activation.
- La documentation Supabase actuelle confirme que `createSupabaseContext(..., { auth: 'user' })` fournit `supabaseAdmin` en plus du client RLS-scopé ; le code Edge utilise donc l'API documentée.



---

## Lot 209 — validation CI/preview et estimation du coût de test Supabase (10 novembre 2026)

### Validations GitHub
- CI #2813 / run `42850098021` : **success** sur le commit de tests `b6ff000012a899f59f6621dd5da584b36e243054`.
- CI #2814 / run `42850138153` : **success** sur le HEAD documentaire `300b59c852555319fc8417c6ff240f5515f02367`; job unique, toutes les étapes réussies.
- Le build Cloudflare associé au HEAD PR est un **preview de branche** (build `6286f3a5-7583-4a72-a393-96ea24d66e5a`), pas un déploiement de production.
- Supabase Preview est toujours `skipped`, car la branche Git n'est associée à aucune branche Supabase.
- PR #17 reste ouverte, non fusionnée, mergeable ; base `main` inchangée.

### Estimation Supabase communiquée
- Organisation : `bridrandomtv-spec's Org` (`yhigaygkffkdygpaglaf`).
- Estimation retournée par Supabase pour créer une branche : **0,01344 USD par heure**.
- Équivalent indicatif sur 730 heures : **9,81 USD**. Le montant effectif dépend de la durée réelle et de l'usage facturé.
- Aucune branche créée : accord explicite sur ce coût pas encore reçu.
- Aucun changement au projet Supabase actif : pas de migration, pas de déploiement Edge Function, pas de modification Auth/secret/données.
- Aucun déploiement Cloudflare production et aucun merge.

### Étape bloquante
Attendre l'accord explicite de l'utilisateur sur le tarif horaire de 0,01344 USD avant d'appeler `confirm_cost` puis `create_branch`. Après création, exécuter les tests sur la branche isolée uniquement et supprimer la branche de test après validation, avec autorisation explicite.

---

## Lot 210 — confirmation CI du HEAD documentaire et poursuite sans environnement payant (10 novembre 2026)

### CI du HEAD
- CI #2815 / run `42850641918` sur le commit `8feb85f0cbb352a2844199d7e10c5db3e52b1d38` : **réussie**.
- Workflow `CI — ALLEMAND`, job unique « Validation structurelle & pédagogique » : conclusion `success`.
- Toutes les étapes exécutées sont terminées avec succès, notamment les contrôles MFA étudiant, assertions migration RLS/Storage/RPC, syntaxe JavaScript, contrôles d'accès et régressions pédagogiques.
- La réussite CI reste une validation automatisée du dépôt ; elle ne prouve pas l'application SQL sur PostgreSQL/Supabase isolé, la livraison effective par Resend, ni un parcours navigateur avec comptes réels.

### Décision de coût et environnement
- L'utilisateur a indiqué que le moment n'est pas approprié pour engager une facturation.
- **Aucune branche Supabase payante ne sera créée** et aucun coût horaire ne sera engagé.
- L'estimation précédemment communiquée (0,01344 USD/heure) ne constitue pas une autorisation d'achat ou de création.
- La suite doit privilégier les vérifications statiques, les tests locaux gratuits et les validations GitHub disponibles. Toute opération payante nécessitera une nouvelle autorisation explicite.

### État opérationnel
- PR #17 : ouverte, non fusionnée, branche `design/prototypes-67-74-alignment`, cible `main`.
- HEAD contrôlé : `8feb85f0cbb352a2844199d7e10c5db3e52b1d38`.
- `main` inchangée.
- Aucune branche Supabase de test créée ; aucune migration appliquée au projet actif ; aucune Edge Function déployée ; aucun déploiement Cloudflare production.
- Le MFA e-mail obligatoire reste limité aux profils `role='eleve'`, avec enrôlement automatique à la première connexion selon la source de la PR.

### Prochaine étape sans frais
Poursuivre l'audit statique ciblé du helper SQL, des fonctions SECURITY DEFINER, du flux Edge Function et des assertions CI ; documenter toute correction dans la PR. Ne pas prétendre que l'intégration est prête pour la production tant que les tests isolés et la livraison e-mail réelle n'ont pas été validés.

---

## Lot 211 — durcissement des rôles MFA et ajout d'une CI dédiée (10 novembre 2026)

### Lacunes détectées pendant l'audit
1. Le helper SQL et la fonction Edge traitaient tout rôle différent de `eleve` comme exempt. Un profil avec rôle nul/inattendu aurait donc pu être considéré comme non étudiant sans validation explicite.
2. Le workflow GitHub exécutait des contrôles d'accès et de parcours, mais ne lançait pas de script MFA dédié. Les réussites CI précédentes ne doivent donc pas être interprétées comme une preuve de test automatisé spécifique du flux MFA.

### Corrections dans la PR #17
- Migration `supabase/migrations/20261110160000_enforce_student_email_mfa.sql` : les seuls rôles explicitement exemptés sont maintenant `prof`, `admin` et `parent`. Un profil absent ou dont le rôle est inconnu renvoie désormais `false` dans le helper.
- Edge Function `supabase/functions/mfa-email/index.ts` : même liste explicite d'exemptions ; l'action `status` renvoie HTTP 403 / `PROFILE_ROLE_NOT_ALLOWED` pour un rôle inconnu au lieu de retourner `required:false`.
- Les actions `start` et `verify` restent strictement réservées au rôle `eleve`.
- Nouveau test statique `ci/check-mfa-security.mjs` : vérifie la liste d'exemptions cohérente SQL/Edge, le refus des rôles inconnus, le périmètre étudiant des challenges et le contrôle fail-closed du client.
- Workflow `.github/workflows/deploy.yml` : exécute désormais explicitement `node ci/check-mfa-security.mjs`.

### Vérification source effectuée
- Relecture des fichiers après écriture : les deux listes de rôles sont identiques et le workflow référence bien le nouveau test.
- Le contenu du test a été relu ; son exécution réelle par GitHub Actions reste à attendre sur le nouveau HEAD.
- Cette nouvelle vérification est statique : elle ne remplace pas l'exécution PostgreSQL de la migration, les tests JWT/RLS/Storage/RPC, ni un test Resend réel.

### Commits du lot
- Migration : `2921ceedc34876cb1899ac887183bc475cdbbab0`.
- Edge Function : `28de1266f776ca885f4ae9462d38c763c4e0b00c`.
- Test CI dédié : `5c98074c99faca0d60bcf4ea36892b2e68a3d8cd`.
- Workflow CI : `47de4e61581b259837795f0933f2e728d9d26481`.
- Mise à jour du présent dossier : à confirmer par le commit résultant.

### État opérationnel inchangé
- PR #17 reste ouverte, non fusionnée ; `main` n'est pas modifiée.
- Aucune branche Supabase payante créée ; aucune facturation engagée.
- Aucune migration exécutée sur le projet Supabase actif ; aucune Edge Function déployée.
- Aucun déploiement Cloudflare en production.


---

## Lot 212 — diagnostic du message « politique de vérification indéterminée » (10 novembre 2026)

### Cause racine confirmée
- L'interface `mfa-security.js` de la PR attend un booléen `required` dans la réponse de l'action Edge Function `status`. L'absence de cette métadonnée bloque volontairement la connexion (fail-closed).
- La fonction réellement active dans Supabase est toujours `mfa-email` version **7**. La relecture de son code déployé confirme que sa réponse `status` contient `ok`, `enrolled`, `verified`, `verifiedUntil` et `emailMasked`, mais **pas** `required`.
- Les journaux Supabase en lecture seule confirment des appels navigateur `POST 200` vers `/functions/v1/mfa-email` servis par le déploiement version 7, notamment le 10 novembre 2026 à 16:50:23 UTC. Le succès HTTP ne signifie pas que le contrat de réponse est compatible avec la nouvelle interface.
- La source Edge Function dans la PR ajoute bien le champ `required`, détermine le rôle depuis `profiles` côté serveur, exempte explicitement uniquement `prof`, `admin` et `parent`, et refuse les rôles inconnus. Cette source n'est pas encore déployée.
- Conclusion : le message constaté est expliqué par un décalage de version interface/backend, et non par une preuve de mauvais paramétrage du compte. La réponse actuelle de la version 7 ne permet pas de déduire de manière sûre si l'utilisateur est élève ou non.

### Ajustement de l'interface dans la PR
- Le message générique invitant à réessayer a été remplacé par une explication exploitable : « نسخة خدمة التحقق الأمني غير متوافقة مع المنصة. يلزم تحديث الخدمة من الإدارة؛ لم يتم تجاوز فحص الأمان. »
- Le comportement de sécurité reste inchangé : l'interface refuse l'accès si `required` n'est pas un booléen. Aucun fallback permissif ni bypass n'a été ajouté.
- Le script `ci/check-mfa-security.mjs` vérifie désormais également que cette incompatibilité est expliquée explicitement à l'utilisateur.

### CI et portée des résultats
- CI #2819 / run `42854558448` : **success**. Le job unique a terminé avec succès, y compris l'étape dédiée « Vérifier le MFA e-mail obligatoire des étudiants (contrôles statiques) ».
- Cette exécution correspond au commit workflow `47de4e61581b259837795f0933f2e728d9d26481`. Après l'ajustement de message, CI #2821 / run `42859134366` sur `ab26208508e16b23d391b79d466d0989dbe41427` est **success**. CI #2822 / run `42859175770` sur `b23ef4c7c380142f795aae9d3b9a383058d0fa3b`, qui inclut aussi l'assertion CI du nouveau message, est désormais **success**. La mise à jour documentaire finale du présent lot est portée par le commit `ee6b41cfd52756eba27b270a095e06c569e0afe5`.
- Les journaux et le code de la fonction active ont été consultés en lecture seule. Aucun test n'a envoyé de code Resend ni modifié de compte.

### Étape nécessaire pour une résolution réelle
- Pour que l'interface reçoive `required`, il faudra déployer une version compatible de `mfa-email` et appliquer la migration MFA/RLS correspondante dans un environnement autorisé. Un simple rechargement du navigateur ne peut pas ajouter le champ manquant à la fonction serveur.
- Comme demandé, aucun déploiement n'est effectué maintenant. La migration n'est pas appliquée au projet Supabase actif ; aucune fonction Edge n'est déployée ; aucun changement Auth, secret, RLS, rôle ou donnée n'est effectué.
- Aucun environnement Supabase payant n'est créé et aucune facturation n'est engagée. Aucun déploiement Cloudflare de production, aucun merge et aucune modification de `main`.


---

## Lot 213 — renforcement des tests du contrat MFA (10 novembre 2026)

### Vérifications complémentaires
- Relecture en lecture seule de la fonction active Supabase : mfa-email est toujours en version 7. Son code status ne renvoie pas required. Cette réponse HTTP 200 demeure incompatible avec le client MFA de la PR.
- Relecture de la source Edge Function de la PR : le rôle est lu depuis public.profiles côté serveur ; seuls prof, admin et parent sont exemptés ; les rôles inconnus sont refusés ; les réponses de statut contiennent required ; les actions start et verify sont réservées aux élèves ; disable renvoie HTTP 403 / EMAIL_FACTOR_REQUIRED.
- Documentation Supabase actuelle consultée : createSupabaseContext(req, { auth: 'user' }) et supabaseAdmin sont bien documentés pour les Edge Functions. Les clés SUPABASE_SECRET_KEYS / SUPABASE_PUBLISHABLE_KEYS sont injectées par la plateforme ; aucun secret n'a été lu ni modifié.

### Renforcement de la CI
- ci/check-mfa-security.mjs étendu pour contrôler explicitement : lecture serveur du rôle, required:false pour les rôles exemptés, required:isStudent pour les élèves, refus des rôles inconnus, protection séparée de start et verify, refus de disable, enrôlement/défi si facteur absent ou non vérifié, et réexécution du garde avant l'entrée dans l'application.
- Commit du test renforcé : b3b1cda181e555f3242cdb922cd381aefe4b95fe.
- CI #2826 / run 42859441278 : success sur le HEAD précédent c71cdc322157e5a078abf25a301e855e4196aa41, avec l'étape MFA dédiée réussie.
- La CI du nouveau commit b3b1cda181e555f3242cdb922cd381aefe4b95fe reste à confirmer ; aucune réussite n'est anticipée dans cette entrée.

### Limites et décisions inchangées
- Ces tests restent des assertions statiques du dépôt ; ils ne constituent pas un test d'exécution Deno, PostgreSQL/RLS, JWT, Resend ou navigateur.
- Le message vu par l'utilisateur est expliqué par l'absence du champ required dans la fonction active version 7. Le code source de la PR ne peut pas corriger le backend actif tant qu'il n'est pas déployé.
- Aucun déploiement Edge Function, aucune migration, aucun changement Auth/RLS/secret/donnée Supabase, aucun déploiement Cloudflare, aucun merge, aucune modification de main.
- Aucune branche Supabase payante et aucune dépense supplémentaire.
- PR #17 conservée ouverte et non fusionnée.


---

## Lot 214 — correction de la suite MFA après échec CI (10 novembre 2026)

### Résultat de la CI #2827
- CI #2827 / run 42860957459 : **failure** sur le commit b3b1cda181e555f3242cdb922cd381aefe4b95fe.
- Le journal identifie précisément une erreur de syntaxe JavaScript dans les expressions régulières du nouveau test : SyntaxError « Unterminated group ». Il s'agit d'un défaut du test CI, pas d'un échec démontré du mécanisme MFA à l'exécution.
- Le contrôle MFA dédié n'a donc pas validé ce commit ; la précédente CI #2826 valide uniquement le HEAD précédent.

### Correction appliquée
- Le script ci/check-mfa-security.mjs a été réécrit pour utiliser des assertions de présence de fragments de code plutôt que des expressions régulières trop échappées.
- Les assertions couvrent les rôles explicitement autorisés, le refus des rôles inconnus, la politique required, les protections start/verify/disable et le contrôle client avant l'entrée dans l'application.
- Commit de correction : 5fc98ba45b7727cfe09bfa56a971fb5f5265e57d.
- La nouvelle CI déclenchée par ce commit doit encore terminer ; aucun succès n'est anticipé.

### Limites et décisions
- Les assertions sont statiques : elles ne remplacent pas l'exécution Deno, les tests PostgreSQL/RLS, les tests JWT, la livraison Resend ni le parcours navigateur.
- La fonction active Supabase reste en version 7 et ne renvoie pas required dans status ; le message d'incompatibilité à la connexion reste donc attendu tant qu'aucune mise à jour coordonnée n'est autorisée.
- Aucun changement du projet Supabase actif, aucune migration appliquée, aucune fonction Edge déployée, aucun secret ni paramètre Auth/RLS modifié.
- Aucune dépense, aucune branche Supabase payante, aucun déploiement Cloudflare de production, aucun merge ; PR #17 reste ouverte.


---

## Lot 215 — migration MFA autonome et versionnement des RPC (10 novembre 2026)

### Écart détecté
- La relecture du dépôt a montré que l'Edge Function appelle deux RPC, `mfa_email_issue_challenge` et `mfa_email_consume_challenge`, absentes de l'unique migration MFA versionnée dans la PR.
- Une inspection SQL strictement en lecture seule du projet Supabase actif a confirmé que les deux RPC et les trois tables `mfa_email_factors`, `mfa_email_sessions`, `mfa_email_challenges` existent déjà dans cet environnement.
- Les RPC actives sont invoker (non SECURITY DEFINER), détenues par postgres et accordées à `service_role` uniquement. Les trois tables ont RLS activé, aucune policy client, et des privilèges CRUD réservés à `service_role`.
- Les fonctions existantes appliquent un délai minimal de 60 secondes, un maximum de 5 émissions par heure et 10 par 24 heures, des codes expirant après 5 minutes, un verrouillage après 5 tentatives, une consommation unique et un verrouillage de ligne `FOR UPDATE`.

### Correction source dans la PR #17
- Migration rendue autonome : création idempotente des trois tables, clés étrangères vers `auth.users`, contraintes, index, activation RLS, révocation des droits des rôles clients et droits CRUD limités à `service_role`.
- Ajout des deux définitions RPC dans la migration avec les mêmes signatures et la même logique que celles relevées en production, sans exécuter de DDL sur le projet actif.
- Les RPC restent invoker, `search_path = ''`, non exécutables par `public`, `anon` ou `authenticated`; seul `service_role` peut les appeler.
- Assertions CI ajoutées pour empêcher la disparition des tables, du RLS, des RPC, des limites de challenge, des révocations de droits clients, de la consommation unique et des privilèges service_role.

### Limites
- Le contrôle SQL effectué était en lecture seule. Aucune migration appliquée, aucune table, fonction, policy, clé, donnée ou paramètre Auth modifié dans Supabase.
- La CI statique doit encore être confirmée sur les nouveaux commits ; elle ne remplace pas une exécution sur PostgreSQL isolé.
- Aucun test réel Resend/navigateur n'a été effectué ; la version Edge active n'a pas été déployée.
- Aucun coût engagé, aucune branche Supabase payante créée, aucun déploiement Cloudflare production, aucun merge ; PR #17 reste ouverte.


---

## Lot 216 — fermeture du chemin de restauration cloud en mode démo/hors ligne (10 novembre 2026)

### Constat
- L'audit de `bootGate()` a révélé que `cloudRestorePending` était conditionné par `!authLocalMode()`.
- Comme `authLocalMode()` devient vrai avec `?demo=1` ou lorsque le navigateur est hors ligne, une session cloud déjà mémorisée pouvait entrer directement dans l'interface sans appeler `DZ_MFA.requireGate()`.
- Les politiques RLS restent le contrôle serveur des données protégées, mais ce chemin contournait le contrôle de connexion côté client et pouvait afficher le shell sans MFA.

### Correction dans la PR #17
- Toute session dont `src === 'cloud'` passe désormais par la restauration cloud et le contrôle MFA, indépendamment du mode démo ou de l'état réseau.
- Les sessions locales de démonstration/hors ligne conservent leur parcours local ; elles ne sont pas transformées en sessions cloud.
- Assertions CI ajoutées pour interdire le retour de cette condition de contournement.

### Limites
- Aucun accès cloud n'est accordé hors ligne si le statut MFA ne peut pas être vérifié : le parcours reste fail-closed.
- Les contrôles CI restent statiques ; aucun test navigateur ou compte réel n'a été exécuté.
- Aucun changement Supabase actif, aucune migration, aucun déploiement Edge Function/Cloudflare production, aucun coût et aucun merge.
- PR #17 reste ouverte ; `main` inchangée.


---

## Lot 217 — correction de syntaxe du test CI MFA après ajout du contrôle cloud (10 novembre 2026)

- La relecture immédiate du script après le Lot 216 a détecté un caractère `\\n` littéral devant le `console.log`, introduit lors de l'ajout des assertions sur `bootGate()`.
- Le script a été corrigé pour rétablir un véritable saut de ligne JavaScript. Aucun code applicatif supplémentaire n'a été modifié dans ce lot.
- La CI #42864127940 a réussi sur le HEAD précédent `b6300edc548f706baea4b33c4003576c8ba99ab0`, qui incluait l'autonomie de migration et les assertions SQL, mais pas encore la correction du chemin cloud du Lot 216.
- La CI #42864403071 a réussi sur le HEAD `97eaff219dba79a35cb2512b8c25f85502b81fdd`, avec le test MFA corrigé et le contrôle cloud du Lot 216.
- Aucun changement Supabase actif, aucune migration, aucun déploiement, aucune dépense et aucun merge.


---

## Lot 218 — verrou centralisé de toute entrée cloud (10 novembre 2026)

### Constat
- Le contrôle MFA était appelé par les chemins de restauration, connexion, inscription et liaison cloud, mais `enterApp(session)` restait une fonction d'ouverture directe du shell.
- Un autre module ou un futur appel interne pouvait donc invoquer `enterApp` avec une session cloud sans consommer explicitement le résultat du contrôle MFA.

### Correction dans la PR #17
- `requireGate()` émet maintenant un permis d'entrée éphémère, utilisable une seule fois, uniquement après réussite du contrôle email et de l'éventuel contrôle natif Supabase.
- `enterApp(session)` devient le point de contrôle central : toute session `src === 'cloud'` doit consommer ce permis avant que le shell soit affiché.
- Sans permis ou si le module MFA n'est pas disponible, l'ouverture est bloquée et le message reste sur l'écran de connexion.
- Si un appel cloud arrive sans permis, `enterApp` masque d'abord le shell, réaffiche le portail de connexion, relance le contrôle et n'ouvre l'application qu'après réussite.
- Les sessions locales de démonstration/hors ligne ne changent pas de parcours.

### Validation
- Assertions CI ajoutées pour vérifier l'émission et la consommation unique du permis, et le verrouillage de la frontière `enterApp`.
- CI du Lot 218 à attendre ; les validations statiques précédentes ne suffisent pas à déclarer ce lot terminé.
- Le contrôle central reste une protection d'interface ; la migration RLS/Storage et les RPC gardent la protection serveur des données.

### Limites inchangées
- Aucun changement dans le projet Supabase actif ; aucun SQL exécuté en écriture.
- Aucun déploiement Edge Function, aucun déploiement Cloudflare production, aucun merge et aucun coût.
- PR #17 reste ouverte ; `main` inchangée.


---

## Lot 219 — adaptation du contrôle de régression du portail après centralisation MFA (10 novembre 2026)

- La première exécution CI du Lot 218 a révélé une assertion devenue trop stricte dans `ci/check-public-portal.mjs` : elle attendait exactement quatre occurrences du garde MFA, alors que le Lot 218 ajoute volontairement une cinquième vérification centrale dans `enterApp`.
- L'assertion a été remplacée par un contrôle fonctionnel : les quatre parcours cloud historiques restent présents et la frontière `enterApp` doit vérifier la session cloud, consommer le permis à usage unique et relancer le contrôle MFA si nécessaire.
- Ce changement corrige uniquement le test de régression ; il ne retire aucune protection applicative.
- La CI complète du HEAD final doit encore être confirmée.
- Aucun changement Supabase actif, aucun déploiement, aucun merge, aucune dépense ; PR #17 reste ouverte.


---

## Lot 220 — fermeture du fail-open Worker et preuve d'abonnement payant (10 novembre 2026)

### Constat de l'audit
- `src/site-worker.js` servait les fichiers protégés lorsque `SUPABASE_URL` ou `SUPABASE_ANON_KEY` manquait, en ajoutant seulement l'en-tête `X-Content-Guard: config-manquante`.
- Le contrôle interrogeait `lesson_content?select=id&limit=1`. Or la policy RLS autorise aussi les lignes `free = true`; une seule fiche gratuite suffisait donc à faire réussir le contrôle et à débloquer les fichiers d'unités protégés.
- Le garde MFA SQL de la PR ne suffisait pas à corriger cette faiblesse de logique dans le Worker.

### Correction source dans la PR #17
- Configuration Supabase absente : réponse HTTP 503 `content_guard_not_configured`; aucun fichier protégé n'est servi.
- Contrôle d'accès : la requête exige maintenant `free=eq.false`. Grâce à la policy RLS existante, une ligne payante n'est retournée que si l'utilisateur possède réellement l'entitlement (ou le rôle administrateur prévu).
- Le contrôle reste effectué côté Worker avant `ASSETS.fetch`, sans exposer la clé service_role.

### Tests
- `ci/check-access.mjs` vérifie la sélection exclusive de lignes payantes et interdit le retour du chemin fail-open.
- Les tests CI complets restent à confirmer sur le dernier HEAD.

### Limites
- Modification uniquement dans les sources de la PR ; aucun changement de variable Cloudflare ni déploiement Worker.
- Aucune modification Supabase active, aucune migration appliquée, aucun merge et aucun coût.
- PR #17 reste ouverte ; `main` inchangée.


---

## Lot 221 — synchronisation des assertions de régression MFA (10 novembre 2026)

- La CI du Lot 218 a identifié une seconde assertion obsolète dans `ci/check-public-portal.mjs` : elle attendait l'ancien retour direct `return false` de `requireGate()`.
- Depuis le Lot 218, ce retour émet volontairement un permis d'entrée à usage unique (`gatePass=true`) avant de valider l'ouverture du shell.
- Le test de régression a été synchronisé avec ce nouveau contrat, sans affaiblir le contrôle : il vérifie désormais l'émission du permis.
- Le test MFA dédié et le contrôle Worker du Lot 220 doivent être validés sur le même HEAD final.
- Aucun changement Supabase actif, aucun déploiement, aucun merge, aucune dépense ; PR #17 reste ouverte.


---

## Lot 222 — couverture exhaustive des actifs protégés par le Worker (10 novembre 2026)

### Audit
- Relevé des fichiers réellement présents à la racine : unite2.js à unite6.js, unite10.js à unite16.js, unites3as_a.js, devoirs_unite.js et la vitrine publique unites3as_vitrine.js.
- Relevé de assets/bdd : les fichiers buch_3as_*.json et traductions_livre.json sont les ressources JSON sensibles ciblées par le garde.
- Les motifs PROT actuels du Worker couvrent les unités payantes effectivement présentes, le fichier d'unités 3AS, les devoirs d'unité et les JSON privés 3AS/traductions. La vitrine unites3as_vitrine.js reste volontairement hors du garde payant.
- L'écart identifié était une faiblesse de couverture des tests : le test vérifiait l'existence du garde et son filtre d'abonnement, mais ne comparait pas l'inventaire réel des fichiers à la liste des chemins protégés.

### Renforcement CI dans la PR #17
- ci/check-access.mjs extrait maintenant les expressions PROT du Worker et les évalue dans un contexte isolé.
- Le test parcourt les fichiers unite*.js présents et échoue si l'un d'eux n'est pas protégé.
- Il contrôle aussi unites3as_a.js, devoirs_unite.js, chaque buch_3as_*.json et traductions_livre.json.
- Il vérifie explicitement que unites3as_vitrine.js reste accessible comme vitrine gratuite.
- Le contrôle évite ainsi qu'un nouveau fichier pédagogique sensible soit ajouté au dépôt sans être intégré au garde Worker.

### Validation et limites
- Le test est ajouté à la suite existante ci/check-access.mjs ; sa réussite sur GitHub Actions doit être confirmée sur le HEAD résultant.
- Il s'agit d'une vérification statique de correspondance entre inventaire et motifs Worker. Elle ne constitue ni un test HTTP en environnement Cloudflare, ni une preuve de configuration des variables du Worker, ni un test d'abonnement avec un compte réel.
- Aucun changement dans le Worker lui-même, aucune variable Cloudflare modifiée, aucun déploiement.
- Aucun changement Supabase actif, aucune migration appliquée, aucun secret/Auth/RLS/donnée modifié.
- Aucun merge, aucune modification de main, aucune dépense ou branche Supabase payante. PR #17 reste ouverte et non fusionnée.


---

## Lot 223 — contrat versionné entre le client et le service MFA e-mail (10 novembre 2026)

### Origine du message affiché
- mfa-security.js exige déjà un booléen required dans la réponse action=status.
- Le message arabe « نسخة خدمة التحقق الأمني غير متوافقة مع المنصة... » apparaît lorsque cette propriété manque ou n'est pas un booléen.
- Le code source Edge Function de la PR renvoie cette propriété, mais l'ancienne version active de la fonction ne la renvoyait pas. Le défaut observé correspond donc à un décalage entre la version du client et celle du service déployé, et non à une manipulation incorrecte de l'élève.

### Correction source dans la PR #17
- Ajout de contractVersion: 1 aux deux réponses action=status (élève et rôles exemptés) de supabase/functions/mfa-email/index.ts.
- mfa-security.js exige maintenant simultanément contractVersion === 1 et un booléen required.
- Une version ancienne, une réponse incomplète ou une version inconnue restent bloquées : aucune ouverture de session sans validation MFA.
- ci/check-mfa-security.mjs vérifie l'accord explicite entre le numéro de contrat émis par le serveur et celui exigé par le client.

### Procédure de mise en service — non exécutée
- Pour faire disparaître ce message sur le site actuellement déployé, l'administrateur devra publier la version correspondante de la fonction mfa-email depuis la branche validée, puis vérifier la réponse action=status avec un compte de test.
- La version du client et la fonction doivent être publiées de manière coordonnée. Une simple modification du navigateur ou un rechargement ne peut pas mettre à jour une Edge Function déjà active.
- Aucun déploiement n'a été effectué dans ce lot. Ne pas déployer la fonction seule avant que le code client compatible soit lui aussi disponible.
- Aucun changement de schéma, RLS, données, Auth, secret, Resend ou configuration active Supabase. Aucun merge, aucun déploiement, aucune dépense ; PR #17 reste ouverte.

### Limites
- La correction et le test sont des modifications de source. Le comportement réel dépend encore du déploiement coordonné, qui nécessite une autorisation distincte.


---

## Lot 224 — validation finale du contrat MFA et ordre de mise en service (10 novembre 2026)

### CI du HEAD complet
- Workflow GitHub Actions run `42877673227`, commit `e27673782a3730bcd1e02e1b0990a97f05237122` : **success**.
- Le job « Validation structurelle & pédagogique » et toutes ses étapes ont réussi, dont les contrôles MFA e-mail, matrice des parcours, garde d'accès et tests de régression.
- Cette réussite valide les assertions et contrôles automatisés du dépôt. Elle ne constitue pas un test réel de livraison Resend, de session Supabase, de navigateur ou de déploiement Cloudflare.

### Audit de cohérence de l'implémentation
- Le serveur Edge renvoie `contractVersion: 1` avec `required` pour les réponses `action=status`.
- Le client n'accepte que le contrat version 1 et un booléen `required`. Toute réponse ancienne ou incomplète reste bloquée (fail-closed).
- Les actions `start` et `verify` sont limitées côté serveur aux profils étudiants. La désactivation personnelle du facteur est refusée.
- L'enrôlement initial et les défis de connexion reposent sur les tables et RPC MFA de la migration dédiée. Le déploiement de la fonction Edge sans son prérequis SQL ne constitue donc pas une mise en service complète.

### Ordre de mise en service à respecter — aucune étape exécutée
1. Préparer un environnement Supabase de test isolé et autorisé, sans créer de branche payante sans accord préalable sur le coût.
2. Examiner puis appliquer la migration MFA dans cet environnement de test uniquement ; vérifier les tables, policies et RPC attendues.
3. Déployer la fonction Edge `mfa-email` issue du même commit validé que le client.
4. Publier le frontend compatible avec `contractVersion: 1`, de façon coordonnée avec la fonction Edge.
5. Tester avec un compte étudiant dédié : statut `required: true`, enrôlement initial, réception du code, validation, reconnexion et nouveau défi.
6. Tester avec les rôles exemptés : `required: false`, sans enrôlement étudiant imposé.
7. Vérifier les refus (code erroné/expiré, limitation de fréquence, session expirée, tentative de désactivation) et confirmer qu'aucune donnée protégée n'est accessible avant validation MFA.
8. Contrôler la délivrabilité e-mail réelle et les journaux sans exposer codes, secrets ni données personnelles ; seulement après réussite, préparer une demande d'autorisation distincte pour la production.

### État confirmé après le Lot 224
- PR #17 : ouverte, non fusionnée ; branche `design/prototypes-67-74-alignment`, HEAD `e27673782a3730bcd1e02e1b0990a97f05237122`.
- CI finale réussie : [run 42877673227](https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/42877673227).
- `main` inchangée ; aucun déploiement Cloudflare ou Supabase ; aucune migration appliquée ; aucun changement de configuration, secret, Auth, RLS ou donnée du projet Supabase actif.
- Aucun environnement Supabase payant créé et aucun coût engagé.
- Le MFA e-mail est **validé au niveau du code source et de la CI**, mais n'est pas déclaré opérationnel en production tant que l'ordre de test et de déploiement ci-dessus n'a pas été exécuté et vérifié.


---

## Lot 225 — durcissement des privilèges EXECUTE des RPC SECURITY DEFINER (10 novembre 2026)

### Constat
- La revue statique de la migration MFA a recensé 13 fonctions `SECURITY DEFINER` du schéma `public` utilisées par les parcours abonnement, conventions, messagerie, liens parents et justificatifs.
- PostgreSQL accorde par défaut le privilège `EXECUTE` à `PUBLIC` lors de la création d'une fonction. Le contrôle interne des fonctions rejetait déjà les sessions sans utilisateur ou sans MFA, mais le privilège d'appel anonyme n'était pas explicitement retiré dans la migration.

### Correction source dans la PR #17
- La migration révoque maintenant `EXECUTE` de `PUBLIC` et `anon` pour les 13 signatures concernées.
- Elle accorde explicitement `EXECUTE` à `authenticated` et `service_role`, rôles requis par les appels applicatifs et serveur.
- Les contrôles métier internes et le garde MFA restent présents ; cette correction complète le contrôle d'accès au niveau des privilèges PostgreSQL.
- `ci/check-mfa-security.mjs` vérifie chacune des 13 signatures, la révocation des rôles anonymes et l'octroi explicite des rôles attendus.

### Validation et limites
- Les modifications sont dans la branche PR uniquement. La nouvelle CI doit terminer avant de considérer le lot validé.
- Cette vérification statique ne remplace pas l'exécution de la migration sur une base de test ni un contrôle des privilèges effectifs via `has_function_privilege`.
- Aucun SQL exécuté sur le projet Supabase actif ; aucune migration appliquée, aucun déploiement Edge/Cloudflare, aucun changement Auth/RLS/secret/donnée active.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée ; aucun coût engagé.


---

## Lot 226 — messages MFA compréhensibles pour les élèves (10 novembre 2026)

### Constat de l'audit du parcours
- La fonction Edge renvoie des codes explicites pour le courriel non confirmé (VERIFIED_EMAIL_REQUIRED), les délais et limites d'envoi (PLEASE_WAIT, RATE_LIMITED), les codes invalides/expirés/verrouillés et les indisponibilités de livraison.
- Le client affichait certains de ces codes techniques directement à l'élève ; les erreurs réseau pouvaient également exposer le texte brut d'une exception.
- L'élève ne doit ni comprendre Supabase/Resend ni modifier des paramètres techniques pour terminer la vérification.

### Correction source dans la PR #17
- Ajout d'un traducteur central côté interface qui convertit les réponses connues du serveur en instructions arabes courtes et actionnables.
- Pour VERIFIED_EMAIL_REQUIRED, l'élève est invité à ouvrir le message de confirmation de son adresse, cliquer le lien reçu, puis reprendre la connexion. Ce cas est distinct du code MFA à six chiffres.
- Les limites d'envoi expliquent quand réessayer ; les codes erronés, expirés ou verrouillés indiquent comment demander un nouveau code ou reprendre la connexion.
- Les indisponibilités d'envoi et les erreurs réseau ne révèlent plus les détails techniques du serveur.
- Le contrôle reste fail-closed : aucune erreur ne permet d'ouvrir le compte sans validation MFA. Aucun changement du contrat Edge ni des règles serveur.

### Tests et limites
- Assertions CI ajoutées pour vérifier les principaux codes serveur et l'absence d'affichage direct des exceptions réseau.
- Validation statique seulement : aucune livraison Resend réelle, aucun parcours navigateur ni test avec un compte élève effectué.
- Aucun changement Supabase actif, aucune migration appliquée, aucun secret/Auth/RLS/donnée modifié ; aucun déploiement Edge/Cloudflare.
- PR #17 reste ouverte et non fusionnée ; main inchangée ; aucun coût engagé.


### Précision après relecture du flux (Lot 226)
- Le contrôle Edge vérifie la confirmation de l'adresse avant de traiter toutes les actions, y compris STATUS. Le cas VERIFIED_EMAIL_REQUIRED survient donc d'abord pendant la lecture du statut, pas nécessairement pendant l'envoi du code.
- Le client traduit désormais aussi cette réponse du statut : l'élève reçoit l'instruction de confirmer son adresse par le lien reçu, puis de reprendre la connexion. Le contrôle de sécurité reste bloquant tant que cette étape n'est pas faite.


---

## Lot 227 — inscription cloud et première connexion sans ambiguïté (10 novembre 2026)

### Audit du flux existant
- L'inscription Supabase peut réussir sans créer de session lorsque la confirmation d'adresse est exigée. L'interface affichait alors un message dans l'onglet inscription et laissait à l'élève le soin de retrouver lui-même le formulaire de connexion.
- Lors d'une tentative de connexion avant confirmation, Supabase Auth renvoie une erreur spécifique (`email_not_confirmed`) avant même l'appel au contrôle MFA ; le client affichait auparavant le message brut du fournisseur.
- Le MFA e-mail ne peut commencer qu'après une session Auth valide et une adresse confirmée ; cette séquence est cohérente avec la vérification côté Edge.

### Corrections dans la PR #17
- Après une inscription sans session, l'interface bascule automatiquement sur l'onglet connexion, préremplit l'adresse e-mail et affiche en arabe les étapes : ouvrir le message de confirmation, cliquer le lien, puis saisir le mot de passe. Elle invite aussi à vérifier les courriers indésirables.
- Les erreurs Auth connues (adresse non confirmée, identifiants incorrects, compte existant, limite d'envoi, mot de passe refusé et problème réseau) sont converties en messages destinés aux élèves ; les détails techniques bruts ne sont plus affichés dans les formulaires cloud concernés.
- L'erreur `email_not_confirmed` est traitée à la connexion avant l'étape MFA, tandis que `VERIFIED_EMAIL_REQUIRED` est traitée par la fonction MFA après authentification. Les deux chemins guident vers la même confirmation sans contourner le contrôle.
- Aucun changement des paramètres Auth Supabase, du minimum de mot de passe configuré côté serveur, des URLs de redirection, ni du comportement de la confirmation e-mail n'a été fait.

### Validation et limites
- Assertion CI ajoutée pour vérifier le basculement automatique vers la connexion et les messages de confirmation.
- La validation reste statique ; aucun e-mail réel, aucun compte élève réel et aucun test navigateur n'ont été exécutés. Le comportement de délivrabilité dépend toujours du fournisseur et des paramètres Auth actifs.
- Aucun changement Supabase actif, aucun secret, aucune donnée, aucune migration appliquée, aucun déploiement Edge/Cloudflare ; aucun coût engagé.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.

---

## Lot 228 — audit du défi e-mail, renvoi du code et reprise de session (10 novembre 2026)

### Vérifications du parcours source
- La CI du Lot 227 (run `42880459153`, commit `6eab7dcdc61ea2d1ebeab07217c3c4c376edda61`) est terminée avec succès ; toutes les étapes du job unique ont réussi, dont les contrôles MFA, la matrice des parcours et les tests de régression.
- Relecture de `mfa-security.js`, `supabase/supabase.js`, `app.js` et `index.html` : le défi e-mail affiche un champ de code à usage unique, un bouton de renvoi et une action d'annulation.
- Le renvoi demande un nouveau défi à la fonction Edge, remplace le `challengeId` mémorisé puis vide le champ code ; la vérification utilise ce nouvel identifiant.
- Après une vérification réussie, le client relance `requireGate()` et relit le statut côté serveur avant d'accorder le permis d'entrée à usage unique. Le contrôle central `enterApp()` consomme ce permis pour toute session cloud.
- Le parcours de restauration d'une session cloud repasse également par le contrôle MFA ; une erreur de statut, une réponse de contrat incompatible ou un service indisponible maintient le compte bloqué.

### Renforcement des tests
- `ci/check-mfa-security.mjs` vérifie maintenant la présence du champ OTP accessible et du bouton de renvoi dans `index.html`.
- Le test vérifie que le renvoi crée un nouveau défi et remplace l'identifiant utilisé ensuite par la vérification.
- Le test vérifie que la réussite du code relance le contrôle central avant l'ouverture de l'espace étudiant.

### Limites et statut
- Il s'agit d'un audit de code et de tests statiques ; aucun navigateur réel, compte étudiant de test, e-mail reçu ou livraison Resend n'a été vérifié dans ce lot.
- L'audit ne prouve pas la délivrabilité ni l'état réel des paramètres Auth/Edge de Supabase. Les essais intégrés restent nécessaires dans un environnement isolé avant toute mise en production.
- Aucun changement du code de production actif, aucune migration exécutée, aucun secret, réglage Auth, RLS ou donnée Supabase modifié ; aucun déploiement Cloudflare/Supabase.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée ; aucun environnement payant créé et aucun coût engagé.

---

## Lot 229 — audit des sessions, expiration et reconnexion (10 novembre 2026)

### Vérifications de cohérence client / Edge / PostgreSQL
- Le statut MFA étudiant ne se contente pas de vérifier l'existence d'un facteur : la fonction Edge recherche une validation liée au `session_id` Auth courant et dont `expires_at` est encore dans le futur.
- Une validation e-mail réussie crée une autorisation liée à l'utilisateur et à la session Auth courante, valable 12 heures. Le challenge lui-même lie le hachage du code à l'utilisateur, au `session_id` et à l'identifiant du défi.
- Lors d'une nouvelle session Auth, ou après expiration de la fenêtre de 12 heures, le statut courant n'est plus vérifié ; le client redemande un défi de connexion pour l'élève déjà inscrit. L'inscription initiale et la reconnexion utilisent des finalités distinctes (`enroll` / `login`).
- La migration vérifie en plus que la session de validation correspond au `session_id` du JWT, au même utilisateur dans `auth.sessions`, et que `not_after` n'est pas dépassé. L'expiration de la validation MFA seule ne suffit donc pas à autoriser l'accès.
- Les rôles non étudiants connus restent explicitement exemptés ; les rôles inconnus ou absents sont refusés par la fonction Edge et par le garde PostgreSQL.

### Renforcement CI
- `ci/check-mfa-security.mjs` contrôle désormais le lien entre statut MFA et session Auth courante, l'expiration de 12 heures, l'attachement du défi à la session, ainsi que la vérification de `auth.sessions.not_after` côté PostgreSQL.
- Ces assertions sont des contrôles statiques de cohérence du code source, pas une simulation de sessions Supabase réelles.

### Statut et limites
- Le run du Lot 228 (#42881303866) était encore en cours au moment de ce lot ; son résultat doit être vérifié séparément. Le nouveau commit déclenche une validation CI actualisée.
- Le contrôle de la session et de l'expiration a été effectué par lecture des sources Edge et SQL ; aucune session réelle n'a été créée, expirée ou renouvelée dans un environnement de test.
- Aucun déploiement, aucune migration appliquée, aucun changement de paramètres Auth, RLS, secrets ou données Supabase actives ; aucun environnement payant créé.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.


### Lot 230 — traitement explicite des interruptions réseau MFA (10 novembre 2026)
- Audit ciblé du parcours MFA après restauration de session : les erreurs réseau de `functions.invoke('mfa-email')` pouvaient remonter comme exceptions techniques, alors que le contrôle central bloquait bien l'ouverture de l'espace. Le parcours restait fermé, mais le message pouvait être générique ou exposer un libellé fournisseur.
- `supabase/supabase.js` : `mfaEmail()` intercepte désormais les exceptions réseau, distingue une session absente/invalide, et renvoie le code stable `NETWORK_UNAVAILABLE` sans exposer le texte brut de l'exception. Les erreurs serveur structurées restent conservées.
- `mfa-security.js` : traduction arabe explicite pour l'interruption réseau, indiquant que l'espace n'a pas été ouvert et invitant à vérifier la connexion puis réessayer.
- `ci/check-mfa-security.mjs` : assertion ajoutée pour le code réseau stable et son traitement côté interface.
- Validation CI à confirmer sur le nouveau HEAD. Ces tests restent statiques ; aucun essai navigateur, e-mail Resend réel ou test sur environnement Supabase isolé n'est revendiqué.
- Aucun changement Supabase distant, migration appliquée, Edge Function déployée, déploiement Cloudflare, merge ou modification de `main`. PR #17 reste ouverte et non fusionnée.


### Lot 231 — correction du contrôle CI du Lot 230 et diagnostic du message de version (10 novembre 2026)
- Le premier contrôle CI du Lot 230 a échoué sur une assertion mal ciblée : le test cherchait `error:'NETWORK_UNAVAILABLE'` dans `mfa-security.js`, alors que ce code de transport est correctement défini dans `supabase/supabase.js`. Le message utilisateur et le code réseau sont volontairement répartis entre ces deux couches.
- Correction du test : `ci/check-mfa-security.mjs` lit maintenant explicitement le client Supabase et vérifie le code stable dans le bon fichier, tout en vérifiant la traduction dans `mfa-security.js`.
- Diagnostic du message « نسخة خدمة التحقق الأمني غير متوافقة مع المنصة » : le client attend `contractVersion: 1` et `required` booléen. Le code Edge Function présent dans cette branche renvoie bien `contractVersion: 1` dans les deux réponses de statut (élève et rôles exemptés). Le message affiché par le site indique que la version exécutée à distance ne fournit pas ce contrat. Mettre à jour uniquement les fichiers de la PR ne met pas à jour la fonction distante.
- La correction distante nécessite une publication coordonnée de la fonction Edge compatible et du frontend correspondant. Cette publication reste interdite dans le cadre actuel (PR #17 sans fusion ni déploiement) ; aucun contrôle MFA n'a été assoupli et aucun contournement n'a été ajouté.
- Le contrôle CI du correctif est à relancer ; le diagnostic est fondé sur le contrat du code source et le message constaté, pas sur un nouveau test de production.
- Aucun changement Supabase distant, migration appliquée, secret modifié, déploiement Worker, fusion ou modification de `main`.


### Lot 232 — sécurisation de la reprise de session et des messages d'erreur (10 novembre 2026)
- Le contrôle de restauration a été relu : une session cloud mémorisée doit obtenir une session Supabase valide, passer DZ_MFA.requireGate(), puis seulement charger le profil via cloudAuthority() et appeler enterApp().
- Le garde central enterApp() reste fail-closed et consomme un permis MFA à usage unique. Un appel tardif sans permis rouvre le portail et relance le contrôle ; aucune ouverture directe n'est introduite.
- Correction de l'affichage des erreurs : les exceptions brutes de restauration et du garde central ne sont plus répercutées à l'étudiant. Des messages arabes génériques et actionnables évitent d'exposer des détails internes du fournisseur tout en indiquant que l'espace n'a pas été ouvert.
- ci/check-mfa-security.mjs renforce les assertions d'ordre : MFA avant chargement du profil et avant entrée, et absence d'exposition des messages d'exception bruts dans la restauration.
- Validation CI du nouveau HEAD à confirmer. Les assertions sont statiques et ne remplacent pas un test navigateur avec sessions réelles.
- Aucun déploiement Edge/Worker, aucune migration exécutée, aucun changement Auth/RLS/secrets/données Supabase, aucun merge et aucune modification de main. PR #17 reste ouverte.


### Lot 233 — audit initial du provisionnement du profil étudiant (10 novembre 2026)

- L'audit du client confirme que `SB.signup()` appelle uniquement `auth.signUp()` et que `myProfile()` lit la table `profiles` sans créer de ligne.
- Une première lecture partielle du schéma avait conduit à proposer un nouveau déclencheur. Cette conclusion a été rectifiée au Lot 234 après lecture complète de la section d'inscription de `supabase/schema.sql` : le schéma possède déjà `on_auth_user_created`, qui appelle `public.handle_new_user()` et crée le profil avec le rôle initial `eleve`.
- Le besoin fonctionnel reste valide : le profil doit exister dès la création Auth, avant la confirmation e-mail, afin que l'Edge Function puisse retrouver le rôle à la première connexion.
- Aucun deuxième déclencheur ne doit être conservé. La migration a été corrigée au Lot 234 pour renforcer la fonction canonique existante, avec un `search_path` vide, des références qualifiées, aucune lecture de métadonnée client `role`, et révocation de l'exécution directe aux rôles clients.
- Le profil initial reste `eleve`. En cas de conflit, `ON CONFLICT DO NOTHING` préserve un éventuel profil créé par un autre mécanisme de confiance ; la migration ne force donc pas la rétrogradation d'un compte provisionné séparément.
- La migration demeure non appliquée. Le déclencheur doit encore être exécuté et testé dans un environnement Supabase isolé avant toute publication.

### Lot 234 — correction du déclencheur d'inscription et durcissement SQL (10 novembre 2026)

- Découverte confirmée dans `supabase/schema.sql` : le déclencheur existant `on_auth_user_created` appelle déjà `public.handle_new_user()`. Le schéma impose le rôle initial `eleve` et ne lit pas le rôle depuis les métadonnées client.
- Suppression de la fonction et du déclencheur ajoutés au Lot 233. La migration remplace désormais la fonction existante et recrée le seul déclencheur canonique, évitant les doubles insertions et l'ordre d'exécution entre déclencheurs concurrents.
- Durcissement de `public.handle_new_user()` : `SECURITY DEFINER` conservé pour l'insertion serveur, `search_path = ''`, fonctions et table explicitement qualifiées, rôle initial fixé à `eleve`, champs pédagogiques nettoyés, et aucune confiance dans `raw_user_meta_data.role`.
- `ON CONFLICT (id) DO NOTHING` préserve une ligne de profil créée par un autre mécanisme de confiance ; la migration n'écrase pas un rôle déjà attribué par ce mécanisme.
- Révocation de l'exécution directe de la fonction trigger pour `PUBLIC`, `anon` et `authenticated`. Le déclencheur existant reste le seul chemin d'exécution.
- CI statique renforcée : comparaison explicite avec le schéma canonique, présence du déclencheur unique, recherche_path fixe, rôle imposé, absence de lecture du rôle client, absence du déclencheur secondaire et ACL de la fonction.
- Première CI du Lot 234 : échec avant le contrôle MFA, car le test du portail public exigeait l'initialisation du schéma privé et le remplacement du bloc avait omis cette instruction. Restauration de `create schema if not exists private authorization postgres;` en tête de migration. L'échec n'était pas un défaut de déclencheur.
- Nouvelle CI #42886071945 (run #2874), sur le commit migration `cd5bbf14cced5f559f895a8ae8208a2cba65913a` : réussite complète, y compris les contrôles du portail public, du garde d'accès, des contrôles MFA e-mail statiques et de la matrice des parcours. Cette réussite valide le code à ce commit ; elle ne valide ni l'exécution réelle SQL ni l'envoi d'e-mails Resend.
- Limite : les assertions CI ne prouvent pas l'owner effectif de la fonction ni l'exécution réelle du trigger dans le projet Supabase. Ces points exigent une base isolée et un test Auth réel.
- Aucun changement Supabase distant, aucune migration appliquée, aucun déploiement Edge/Worker, aucun secret modifié, aucun merge et aucune modification de `main`. PR #17 reste ouverte.


### Lot 235 — inventaire exhaustif des fonctions SECURITY DEFINER (10 novembre 2026)

- Audit statique de la migration MFA : inventaire de 15 fonctions SECURITY DEFINER : le déclencheur Auth public.handle_new_user(), le prédicat privé private.student_email_mfa_access_allowed() et 13 RPC applicatives.
- Les 13 RPC applicatives examinées contiennent toutes un contrôle auth.uid() et un appel à private.student_email_mfa_access_allowed(). Elles fixent leur search_path, révoquent l'exécution héritée de PUBLIC/anon, puis accordent explicitement authenticated et service_role.
- Le prédicat privé lie le contrôle à auth.uid(), au session_id du JWT, à une ligne MFA non expirée et à une session Auth encore valide. Son ACL est explicitement limitée aux rôles nécessaires.
- Le déclencheur d'inscription est traité séparément : search_path vide et exécution directe révoquée pour PUBLIC, anon et authenticated. Il s'exécute via le mécanisme PostgreSQL de trigger.
- CI renforcée par un inventaire exhaustif : toute fonction SECURITY DEFINER supplémentaire ou non classée fait échouer le contrôle ; chaque RPC applicative doit conserver son contrôle MFA, son identité appelante et ses ACL explicites.
- **Limite importante :** les sources ne révèlent pas le propriétaire effectif (proowner) après application, les ACL réelles calculées par PostgreSQL, ni la configuration effective des schémas exposés par PostgREST. La CI statique ne peut pas prouver ces propriétés.
- Avant toute application, une base Supabase isolée doit exécuter les contrôles catalogue ci-dessous et les tests de rôles. Les résultats attendus sont : fonctions SECURITY DEFINER détenues par un rôle serveur de confiance (normalement postgres), aucune RPC privilégiée accessible à PUBLIC/anon, aucune table applicative publique sans RLS, une politique restrictive MFA sur chaque table protégée, et schéma private non exposé au Data API.
- Contrôle catalogue des propriétaires et ACL (à exécuter uniquement dans l'environnement isolé) :

~~~sql
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_userbyid(p.proowner) as function_owner,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  coalesce(
    array_agg(distinct case
      when acl.grantee = 0 then 'PUBLIC'
      else grantee_role.rolname
    end) filter (where acl.privilege_type = 'EXECUTE'),
    array[]::text[]
  ) as execute_grantees
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n on n.oid = p.pronamespace
left join lateral pg_catalog.aclexplode(
  coalesce(p.proacl, pg_catalog.acldefault('f', p.proowner))
) acl on true
left join pg_catalog.pg_roles grantee_role on grantee_role.oid = acl.grantee
where p.prosecdef
  and n.nspname in ('public', 'private')
group by n.nspname, p.proname, p.proowner, p.prosecdef, p.proconfig
order by n.nspname, p.proname;
~~~

- Contrôle de toutes les tables publiques : toute ligne retournée exige une revue et une protection avant publication.

~~~sql
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p')
  and not c.relrowsecurity
order by c.relname;
~~~

- Contrôle du nombre et de la couverture des politiques MFA :

~~~sql
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_catalog.pg_policies
where policyname = 'student_email_mfa_gate'
order by schemaname, tablename;
~~~

- Contrôle du déclencheur Auth :

~~~sql
select t.tgname, pg_catalog.pg_get_triggerdef(t.oid) as trigger_definition,
       pg_catalog.pg_get_userbyid(p.proowner) as function_owner
from pg_catalog.pg_trigger t
join pg_catalog.pg_proc p on p.oid = t.tgfoid
join pg_catalog.pg_class c on c.oid = t.tgrelid
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'auth'
  and c.relname = 'users'
  and not t.tgisinternal;
~~~

- Première exécution du nouveau test exhaustif (CI #2877) : échec dans le parseur d'inventaire, qui n'avait extrait aucune fonction à cause d'un échappement incorrect des expressions régulières dans le test JavaScript. Le test a été corrigé ; il ne s'agissait pas d'un échec des contrôles MFA de l'application.
- CI #2878, après correction : réussite complète, y compris l'inventaire exhaustif des fonctions SECURITY DEFINER et tous les contrôles MFA/accès. Le dernier test réussi valide le script à ce commit ; les requêtes catalogue et tests PostgreSQL réels restent à exécuter en environnement isolé.
- Aucun résultat de ces requêtes n'a été simulé ni inventé : elles restent à exécuter sur une base isolée. Il faudra aussi vérifier les droits effectifs d'exposition du schéma private dans les paramètres Data API et réaliser des tests Auth réels pour les rôles eleve, prof, admin, parent et rôle inconnu.
- Aucun accès à la base distante, aucune migration appliquée, aucune Edge Function/Worker déployée, aucun secret modifié, aucune fusion et aucune modification de main.


### Lot 236 — verrouillage serveur du rôle qui pilote l'obligation MFA (10 novembre 2026)

- L'audit du client a confirmé que le tableau de bord admin appelle encore SB.setRole(), qui effectue une mise à jour directe de profiles.role. La table possède historiquement une policy UPDATE propre et des privilèges UPDATE accordés à authenticated.
- Un garde existe dans le fichier manuel supabase/msg_schema.sql, mais il était SECURITY DEFINER avec search_path = public et autorisait tout contexte auth.uid() NULL. La migration MFA ne devait pas dépendre implicitement de l'exécution préalable de ce fichier manuel.
- Risque traité : si un étudiant pouvait modifier profiles.role vers parent/admin/prof, l'Edge Function et le prédicat RLS pourraient le considérer comme exempt du MFA étudiant.
- La migration MFA définit désormais elle-même public.profiles_role_guard() et le trigger profiles_tr_role. La fonction est SECURITY INVOKER (pas SECURITY DEFINER), utilise search_path vide et refuse par défaut tout changement de rôle sauf :
  1. session SQL de maintenance postgres/supabase_admin ;
  2. JWT service_role explicite ;
  3. utilisateur authentifié dont le profil existant a déjà role = admin.
- Une mise à jour du rôle par le tableau de bord admin reste donc possible pour un administrateur déjà établi, sous réserve de la policy admin UPDATE existante. Un étudiant ne peut pas s'auto-promouvoir ; une requête sans identité fiable n'est pas considérée comme administrateur.
- Le même garde durci a été reporté dans supabase/msg_schema.sql pour éviter que le schéma de messagerie ne réintroduise l'ancienne version lors d'une installation/reprise manuelle.
- CI renforcée : présence du trigger dans la migration, SECURITY INVOKER, search_path vide, validation de l'identité SQL/service_role/admin, refus par défaut et révocation des EXECUTE clients.
- CI #2885/#2886 : le test de messagerie signalait encore l'ancienne règle (auth.uid NULL) après durcissement du trigger ; le test a été adapté à la nouvelle autorisation explicite. CI #2887 a ensuite révélé une assertion regex trop large dans le contrôle MFA ; elle a été limitée au corps de la fonction role guard.
- CI #2888, commit `4ba4413d64938d65013e295ae89c844bb4653934` : **succès complet**. Le contrôle de messagerie, l'administration, le garde d'accès, les assertions MFA, la matrice des parcours et les tests de régression ont tous réussi.
- Contrôle réel restant obligatoire : test Auth isolé prouvant qu'un étudiant ne peut modifier son propre rôle vers prof/parent/admin, qu'un admin existant peut modifier le rôle d'un autre profil, et que le compte initial de coordination peut être promu par SQL Editor. Aucun test de mutation sur le projet de production.
- Aucun changement de la structure de table ni suppression de l'interface de gestion des rôles ; aucun privilège distant modifié, aucune migration appliquée, aucun déploiement, aucun secret touché, aucun merge et aucune modification de main.


### Lot 237 — audit des fonctions historiques et verrouillage du helper de notification (10 novembre 2026)

- Inventaire statique élargi aux scripts SQL historiques versionnés : schéma principal, administration, comptabilité, accords, messagerie, abonnements, droits, contenus et migration MFA.
- Les tables déclarées dans ces scripts activent RLS dans leurs définitions versionnées. Cette observation ne prouve pas qu'aucune table supplémentaire n'existe dans la base distante ni que toutes les migrations manuelles ont été appliquées dans le même ordre.
- Découverte concrète : `public.notify(uuid,text,jsonb)` est une fonction `SECURITY DEFINER` utilisée par des triggers de paiement/reçu, mais le script historique ne lui attribuait pas d'ACL explicite. En l'absence de révocation, l'exécution directe par API ne devait pas être considérée comme réservée au serveur.
- Correction dans la migration MFA : redéfinition du helper avec `search_path = pg_catalog, public`, insertion qualifiée dans `public.notifications`, puis révocation d'EXECUTE pour `PUBLIC`, `anon`, `authenticated` et `service_role`. Le chemin d'exécution attendu reste celui des triggers serveur propriétaires de la fonction ; aucune RPC cliente ne doit appeler ce helper directement.
- CI statique renforcée pour vérifier le corps, le `search_path` et la révocation explicite des droits d'appel direct.
- L'inventaire révèle aussi des fonctions historiques `SECURITY DEFINER` de rôles et permissions administratives (notamment `admin_role_of`, `admin_wilayas`, `admin_can`, `admin_sees_wilaya`), des fonctions de liaison parent/enfant et des fonctions de gestion. Elles ne sont pas toutes des RPC destinées à être appelées directement : certaines sont des helpers RLS ou des fonctions de trigger. Leur ACL effective, leur usage réel côté client et leur propriétaire doivent être classés signature par signature avant toute révocation plus large.
- **Aucune révocation globale** des fonctions historiques n'a été effectuée : elle pourrait casser les policies RLS, les triggers ou les RPC légitimes. Le contrôle de leurs ACL calculées et de l'exposition PostgREST reste une étape obligatoire dans un environnement Supabase isolé.
- Le contrôle des schémas exposés par le Data API et les propriétaires/ACL PostgreSQL n'a pas été exécuté sur le projet distant. Aucun résultat de catalogue n'est supposé.
- Aucun changement Supabase distant, aucune migration appliquée, aucun secret modifié, aucun déploiement Edge/Worker, aucun merge et aucune modification de `main`. PR #17 reste ouverte.


#### Validation CI du Lot 237

- CI #2893 et #2894 : échecs du contrôle MFA statique, car l'inventaire exhaustif de la migration n'avait pas encore été étendu à la nouvelle fonction `public.notify`. L'échec a correctement détecté une fonction SECURITY DEFINER non classée ; l'inventaire a été complété et un contrôle spécifique de son ACL a été ajouté.
- CI #2895 / run `42890025300`, commit `67ade4d367e08596d967eca7e9ea8519dd5e08f3` : **succès complet**. Le contrôle MFA, la matrice des parcours, le test d'accès/fuite et les validations pédagogiques sont tous réussis.
- Le succès est celui des contrôles automatisés du dépôt. Il ne prouve pas les ACL effectives de la base Supabase distante, la propriété réelle des fonctions, l'exposition PostgREST, ni le comportement d'un trigger exécuté dans PostgreSQL réel.


### Lot 238 — audit PostgreSQL réel des propriétaires, ACL et RPC historiques (10 novembre 2026)

- Audit effectué en lecture seule sur le projet Supabase actif (PostgreSQL 17.6.1). Aucun DDL, DML, changement de privilège, migration ou déploiement n'a été exécuté.
- Inventaire catalogue : 71 fonctions `SECURITY DEFINER` dans `public` ; les 71 appartiennent à `postgres` et les 71 ont un `search_path` fixé. 42 sont exécutables par `authenticated`, une seule par `anon`.
- La seule fonction de cet inventaire accessible à `anon` est `public.agreement_current(text)`. Elle renvoie le composite complet de la ligne active `agreements` (id, cle, version, titre, corps, actif, cree_par, cree_at) en `SECURITY DEFINER`, alors que la policy directe de la table ne permet SELECT qu'à `authenticated`. Ce point constitue une exposition publique effective via RPC, pas une vulnérabilité d'intention déjà démontrée : les conditions d'utilisation peuvent devoir être consultables avant connexion. Il faut vérifier le parcours appelant et décider si l'API publique doit renvoyer uniquement les champs contractuels nécessaires, sans l'identifiant du créateur, ou si l'accès anonyme doit être retiré. Aucun droit n'a été changé.
- Fonctions administratives vérifiées par leur définition réelle : `admin_role_of(uid)`, `admin_wilayas(uid)`, `admin_can(uid, perm)` et `admin_sees_wilaya(uid, w)` comparent toutes le paramètre utilisateur à `auth.uid()` et retournent une valeur neutre/refusent lorsque l'identité ne correspond pas. Elles ne permettent donc pas de consulter le périmètre d'un autre administrateur en substituant un UUID.
- Fonctions parent/enfant vérifiées : `my_child_link_requests()`, `my_linked_children()`, `my_parent_link_requests()`, `request_child_link(text)`, `cancel_parent_link_request(bigint)`, `respond_parent_link_request(bigint, boolean)`, `unlink_child(uuid)`, `child_active_entitlement(uuid, uuid)` et `agreement_accept_for(...)`. Les lectures sont bornées à l'utilisateur connecté et à son rôle parent/élève ; les mutations contrôlent le rôle, la propriété de la demande ou l'existence d'un lien confirmé. `link_child(text)` est encore présent dans la base active mais son ACL n'autorise ni `anon` ni `authenticated` (service_role uniquement) ; il n'est pas réactivé par cet audit.
- Les fonctions parent-only ne portent pas toutes le garde MFA personnalisé dans leur définition historique. Cela correspond à la politique de ce lot (MFA obligatoire pour `profiles.role = 'eleve'`, parents exemptés) ; leur contrôle de rôle/propriété demeure indispensable et a été examiné. Le garde RLS restrictif doit néanmoins être testé en base isolée avec les rôles réels.
- La fonction réelle `profiles_role_guard()` est encore `SECURITY DEFINER` dans la base active ; la migration PR la remplace par une version `SECURITY INVOKER` avec `search_path` vide. C'est un état attendu tant que la migration n'est pas appliquée : ne pas le présenter comme déjà corrigé en production.
- Le helper privé `private.student_email_mfa_access_allowed()` et les tables MFA ne sont pas encore installés sur la base active ; aucun résultat de catalogue ne peut donc valider leur propriétaire effectif avant migration. Leur propriété devra être contrôlée après application sur un environnement isolé.
- Décision : pas de révocation globale sur les 42 fonctions authenticated. Les fonctions d'administration et de liaison sont utilisées par des policies/RPC métier ; une révocation non ciblée risquerait de casser les parcours légitimes. L'exception `agreement_current` doit faire l'objet d'une décision fonctionnelle distincte avant modification.
- CI #2896 / run `42890251405`, commit `c8ef451ae548d5d5e6bcf564229e3c1057bdf78c` : **succès**, job « Validation structurelle & pédagogique » terminé ; les 33 contrôles métier/sécurité listés sont réussis. Le résultat reste statique et ne constitue pas un test d'exécution PostgreSQL.
- PR #17 : ouverte, cible `main`, non fusionnée. `main` inchangée. Aucun déploiement Cloudflare ou Edge Function, aucune migration appliquée, aucune modification de secrets ou paramètres Auth.

#### Contrôles SQL de référence — lecture seule

~~~sql
-- Propriétaire, search_path et droits effectifs des fonctions SECURITY DEFINER
select n.nspname, p.proname,
       pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_userbyid(p.proowner) as owner_name,
       p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('public', 'private') and p.prosecdef
order by n.nspname, p.proname;

-- Définition réelle des fonctions administratives et parent/enfant
select p.proname, pg_get_function_identity_arguments(p.oid),
       pg_get_functiondef(p.oid)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('admin_role_of','admin_wilayas','admin_can','admin_sees_wilaya',
    'agreement_current','agreement_accept_for','child_active_entitlement',
    'my_child_link_requests','my_linked_children','my_parent_link_requests',
    'request_child_link','cancel_parent_link_request','respond_parent_link_request',
    'unlink_child','link_child');
~~~

#### Suite obligatoire

1. Vérifier dans le code client l'appel éventuel à `agreement_current` et décider de son contrat d'exposition publique.
2. Créer un environnement Supabase isolé uniquement après validation explicite de son coût ; la branche de test n'est pas créée.
3. Appliquer la migration uniquement dans cet environnement, puis contrôler le propriétaire effectif (`postgres`), les ACL, les triggers, le schéma privé, les 37 policies restrictives et le bucket `prive`.
4. Tester réellement les parcours élève MFA vérifié/non vérifié, élève tentant de changer son rôle, admin, parent, rôle inconnu, RPC et Storage ; vérifier aussi le renvoi Resend réel.
5. Ne demander aucune fusion ni déploiement avant les résultats de ces tests et une autorisation distincte.


### Lot 239 — préservation de la demande parent lors de l'inscription (10 novembre 2026)

- L'inspection du déclencheur réel `public.handle_new_user()` a révélé un effet secondaire historique absent de la version MFA proposée : lorsque `raw_user_meta_data.requested_role = 'parent'`, le trigger crée une ligne `pending` dans `public.parent_role_requests`.
- La table active est protégée par RLS, sans privilège direct SELECT/INSERT/UPDATE/DELETE accordé à `authenticated` ; sa policy de lecture est réservée aux administrateurs. Elle possède une contrainte d'état `pending/approved/rejected` et un index unique partiel garantissant au plus une demande en attente par utilisateur.
- La redéfinition de `handle_new_user()` dans la migration MFA aurait supprimé ce comportement et aurait pu casser une inscription legacy demandant le rôle parent.
- Correction ajoutée dans la migration PR : si la métadonnée `requested_role` vaut `parent` et si la table historique existe, le trigger crée une demande `pending` idempotente via l'index unique partiel. Si la table n'existe pas dans un schéma isolé minimal, le trigger n'échoue pas.
- Sécurité maintenue : le champ `role` transmis par le navigateur n'est jamais lu ; le profil est toujours créé avec `role = 'eleve'`. La demande ne promeut personne. L'approbation reste une action administrative séparée.
- Contrôle CI ajouté : vérifie la préservation conditionnelle de la demande, l'idempotence et l'absence d'attribution directe du rôle parent depuis les métadonnées client.
- Fichiers modifiés dans la PR : migration MFA et `ci/check-mfa-security.mjs`. Aucun changement sur le projet Supabase actif.
- La nouvelle CI doit encore être exécutée et réussir sur le dernier HEAD avant de valider ce lot. Aucun test PostgreSQL isolé n'a été effectué ; aucun environnement de test n'a été créé.


### Lot 241 — réduction de l'exposition de agreement_current(text) (10 novembre 2026)

- Vérification du code client sur la branche PR #17 : aucune occurrence de `agreement_current` ni aucun appel RPC correspondant. `SB.agreementText(id)` lit `agreements` via `from('agreements').select('*').eq('id', id).maybeSingle()` dans l'espace compte ; cette vue est derrière authentification/RLS. `legal.js` affiche le cadre juridique public à partir de contenu statique intégré au bundle.
- Vérification PostgreSQL active : `public.agreement_current(text)` appartient à `postgres`, est `SECURITY DEFINER`, a `search_path=pg_catalog, public`, et renvoie le composite complet de `agreements`. Son ACL comprenait `EXECUTE` pour `PUBLIC`, `anon`, `authenticated` et `service_role`. L'exécution par anon provenait aussi de l'octroi à PUBLIC.
- Risque établi : tout appelant non authentifié peut interroger cette RPC pour obtenir la ligne complète d'un accord actif, au-delà de la page légale statique. Aucune dépendance client n'a été trouvée dans les fichiers JS de la branche.
- Correction ajoutée à la migration PR : bloc DO conditionnel utilisant `pg_catalog.to_regprocedure('public.agreement_current(text)')`. Si la fonction existe, retrait de l'exécution à `PUBLIC` et `anon`, puis octroi explicite à `authenticated` et `service_role`. La garde rend la migration compatible avec un schéma isolé où la RPC historique serait absente.
- Contrôle statique ajouté à `ci/check-mfa-security.mjs` pour vérifier la présence de la garde, du REVOKE et du GRANT attendu.
- Aucun privilège n'a été modifié sur la base Supabase active ; la correction n'existe que dans la migration de la branche PR #17. Le test CI est statique et ne prouve pas encore les ACL effectives après application.
- Vérifications restantes : après application sur environnement isolé, confirmer `has_function_privilege('anon', ...)` = false, `authenticated` = true et `service_role` = true ; tester également la page légale publique et l'espace compte authentifié.


### Complément au Lot 241 — restriction minimale renforcée

- Relecture du code client confirme que la fonction RPC `agreement_current(text)` n'est pas appelée par les fichiers front-end inspectés. Le seul accès compte identifié est `SB.agreementText(id)`, soumis à l'authentification et aux politiques RLS de la table.
- En conséquence, la migration a été renforcée : `agreement_current(text)` est maintenant révoquée pour `PUBLIC`, `anon` **et** `authenticated`; seul `service_role` conserve EXECUTE si la fonction existe. Cela évite que tout compte étudiant authentifié puisse continuer à lire la ligne complète via une RPC SECURITY DEFINER non utilisée par l'interface.
- Le contrôle CI a été ajusté pour imposer cette ACL plus restrictive. Cette décision reste limitée à la migration PR #17 ; aucune ACL n'a été changée sur Supabase actif.
- Validation à réaliser en environnement isolé : `anon=false`, `authenticated=false`, `service_role=true` via `has_function_privilege`, puis parcours UI juridique public et accord du compte connecté.


### Lot 245 — cohérence du contrat ACL de agreement_current(text) (10 novembre 2026)

- Relecture croisée de la migration et du contrôle CI après la réussite de la CI #2904 : la règle SQL était déjà stricte (REVOKE pour PUBLIC/anon/authenticated, GRANT uniquement à service_role), mais le commentaire de migration et le message d'assertion CI affirmaient encore à tort que le rôle authenticated conservait EXECUTE.
- Correction documentaire : la migration indique désormais explicitement que seul le backend service_role conserve EXECUTE, si la fonction historique existe.
- Contrôle CI renforcé et clarifié : il isole le bloc DO agreement_acl, vérifie la révocation des trois rôles clients, le GRANT service_role et l'absence de GRANT authenticated.
- Aucun changement du comportement SQL effectif ; il s'agit d'aligner la documentation et l'assertion sur la règle least-privilege déjà présente.
- CI #2904 / run 42893347936 : réussite des 33 étapes sur le commit applicatif précédent. La correction de cohérence du Lot 245 déclenche une nouvelle CI, dont le résultat devra être confirmé.
- Aucun SQL exécuté sur Supabase, aucune migration appliquée, aucun déploiement, aucune modification de secrets/Auth distant, aucune fusion et aucune modification de main. PR #17 reste ouverte.


#### Suivi CI — Lot 245 (10 novembre 2026)

- CI #2906 / run `42893955276`, #2907 / run `42893961903`, #2908 / run `42894063370` et #2909 / run `42894203794` : échecs du contrôle MFA statique dus à un fragment d'assertion dupliqué et à une parenthèse orpheline laissés dans `ci/check-mfa-security.mjs` pendant l'édition du test. Les autres étapes précédant le contrôle MFA ont réussi ; aucune migration PostgreSQL n'a été exécutée.
- Correction définitive dans `ci/check-mfa-security.mjs`, commit `0e3b5c02c4c68806267c4f6e86fc9b2e3eb93dae` : suppression du fragment dupliqué ; le script se termine maintenant après la dernière assertion et son message de succès. L'assertion ACL unique repère le bloc par le marqueur `agreement_acl`, vérifie REVOKE pour PUBLIC/anon/authenticated, GRANT pour service_role et l'absence de GRANT authenticated.
- CI #2910 / run `42894353551` sur le commit `0e3b5c02c4c68806267c4f6e86fc9b2e3eb93dae` : **success, 34/34 étapes**. Le contrôle MFA statique, la matrice des parcours et les tests de régression ont réussi. Cela valide les contrôles automatisés du dépôt, pas l'exécution PostgreSQL/Auth réelle.
- CI #2911 / run `42894407199`, déclenchée par la mise à jour documentaire de cette note : en cours au moment de cette mise à jour.
- Vérification PostgreSQL active en lecture seule après ces commits : les droits de `public.agreement_current(text)` sont toujours `anon=true`, `authenticated=true`, `service_role=true`. C'est attendu : aucune migration PR n'a été appliquée au projet actif.
- PR #17 reste ouverte et non fusionnée. Aucun changement de `main`, aucune migration appliquée, aucun déploiement.


---

## Lot 246 — arrêt de la boucle MFA et diagnostic ciblé de l'inscription (10 novembre 2026)

### Décision impérative de coût
- L'utilisateur refuse toute facturation ou dépense supplémentaire non approuvée.
- **Aucune branche Supabase payante, aucun environnement payant, aucun abonnement ni service facturable ne doit être créé/activé.**
- La règle historique « ne créer aucune nouvelle branche » est maintenue. Le tarif estimé d'une branche Supabase précédemment consulté ne constitue pas une autorisation.
- Continuer avec les outils, ressources et environnements gratuits déjà disponibles. Demander une autorisation distincte avant toute opération susceptible d'engager un coût.

### État du parcours d'inscription — constat vérifié
- Le code source de la PR #17 contient déjà le flux MFA étudiant automatique du Lot 202 : après une inscription qui renvoie une session, le client exécute `DZ_MFA.requireGate()`; sans session, il revient à la connexion et attend la confirmation Auth.
- Le module `mfa-security.js` exige `contractVersion === 1` et un booléen `required` dans la réponse de l'action `status`. Une Edge Function active plus ancienne ne renvoyant pas ces champs provoquera un refus fermé lors du login. La source Edge Function dans la PR renvoie bien ces champs.
- Le dossier antérieur indique que la fonction distante `mfa-email` était encore en version 7 lors du dernier contrôle. **Il faut re-vérifier sa version distante avant tout diagnostic MFA ultérieur ; ne pas déployer sans autorisation.**
- Les journaux Auth disponibles sur la fenêtre récente consultée montrent des connexions réussies du compte de coordination, mais aucune action d'inscription (`signup` / `user_signedup`) dans les résultats ciblés. Aucune erreur Auth liée à l'envoi d'e-mail n'a été retournée par la requête ciblée. Cela ne prouve pas à lui seul qu'un clic d'inscription n'a pas eu lieu côté navigateur ; cela signifie qu'aucune tentative Auth d'inscription n'est démontrée par les journaux examinés.
- Les journaux précédemment examinés pour `mfa-email` ne démontraient aucun appel `start/enroll`. Ne pas confondre l'action `status` avec un envoi de code.

### Cause de configuration à traiter en priorité
- L'e-mail de confirmation d'inscription est envoyé par **Supabase Auth**, pas par la fonction Edge `mfa-email`.
- La présence de `RESEND_API_KEY` dans les secrets Edge Function ne configure pas SMTP Auth ni le Send Email Auth Hook.
- Selon la documentation Supabase actuelle, le fournisseur SMTP intégré est limité aux adresses membres de l'organisation et à environ 2 messages/heure ; il n'est pas adapté à l'envoi public aux élèves. Une configuration SMTP personnalisée ou un Send Email Auth Hook est nécessaire pour envoyer à des adresses externes.
- L'utilisateur n'a pas de domaine personnalisé et refuse les dépenses non approuvées. Ne pas lui demander d'acheter un domaine ni recommander un service payant comme prérequis. Étudier une voie réellement gratuite compatible avec les contraintes actuelles avant de proposer une action.
- Ne jamais désactiver la confirmation d'e-mail pour contourner l'absence de livraison.

### Prochaine séquence — sans frais et sans action sur la production
1. Ne plus reprendre les audits MFA généraux ni les corrections CI sans défaut concret.
2. Vérifier la configuration Auth/SMTP et le circuit de confirmation en lecture seule, si l'outil disponible l'autorise ; sinon, signaler précisément la limite d'accès plutôt que demander des manipulations répétées.
3. Établir un chemin de livraison gratuit, compatible avec l'absence de domaine, avant de modifier quoi que ce soit.
4. Tester d'abord le flux avec les moyens gratuits disponibles ; distinguer clairement création du compte, confirmation, première connexion et MFA.
5. Ne pas créer de branche Supabase, ne pas modifier les secrets, paramètres Auth, données, schéma, RLS, migrations ou déploiements sans autorisation explicite.

### État Git
- PR #17 : ouverte, non fusionnée ; branche `design/prototypes-67-74-alignment`.
- `main` : inchangée.
- Cette note est documentaire ; aucun changement applicatif, Auth, Supabase, secret, migration, déploiement ou coût n'est engagé par ce lot.


---

## Lot 247 — correction du mode local qui détournait l'inscription Supabase (10 novembre 2026)

### Défaut identifié
- Dans `app.js`, `authLocalMode()` considérait automatiquement `localhost` et `127.0.0.1` comme mode démo, même lorsque le navigateur était connecté à Internet.
- Les gestionnaires de connexion et d'inscription appellent `SB.login()` / `SB.signup()` uniquement lorsque `authLocalMode()` est faux. Sur un serveur local en ligne, le formulaire utilisait donc le stockage local et ne déclenchait pas Supabase Auth.
- Cette condition est cohérente avec l'absence d'événement d'inscription observé dans les journaux Auth ciblés ; les journaux seuls ne suffisaient pas à établir cette cause, mais l'inspection du code l'a confirmée.

### Correction appliquée dans la PR #17
- `authLocalMode()` n'active désormais le mode local que si le navigateur est hors ligne ou si le paramètre explicite `?demo` est présent.
- Un site exécuté sur `localhost` avec Internet utilise désormais le vrai client Supabase pour l'inscription et la connexion.
- Le bouton de démonstration conserve son comportement : il ajoute `?demo=1` et utilise le mode local.
- Aucun changement de mot de passe, de données utilisateur, de rôle, de schéma, de RLS ou de paramètres Auth/Supabase.

### Cache et contrôles
- Référence HTML : `app.js?v=3564`.
- Service Worker : `dz-de-v3.185.0.0.132`, précache aligné sur `app.js?v=3564`.
- Contrôle CI MFA : assertion ajoutée pour empêcher qu'un hôte localhost connecté soit silencieusement redirigé vers le mode local.
- Contrôle CI Masar : référence app.js mise à jour vers v3564.
- Les contrôles CI de ce nouveau HEAD sont en attente de résultat au moment de cette note. Aucun test navigateur réel n'est revendiqué.

### Portée et garde-fous
- Modification sur la branche existante `design/prototypes-67-74-alignment), PR #17 uniquement.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.
- Aucun déploiement Cloudflare manuel, aucun déploiement Edge Function, aucune migration appliquée, aucune branche Supabase créée.
- Aucun service payant ni frais supplémentaires engagés.
- La livraison des e-mails de confirmation Auth reste un problème distinct à diagnostiquer après qu'une vraie requête `SB.signup()` aura atteint Supabase. La clé Resend de la fonction MFA ne configure pas le SMTP Auth.


---

## Lot 248 — synchronisation du contrôle CI portail avec le cache réel (10 novembre 2026)

### Diagnostic vérifié
- CI #2919 / run `42897009163`, HEAD initial `9a5cc69def08468c64ef76e67b55f964db481021) : échec du job `Validation structurelle & pédagogique` à l'étape 22, `Vérifier le portail public (catalogue et inscription)`.
- Le journal confirme que les contrôles du catalogue, des routes `#connexion/#inscription`, des champs, du formulaire et de la récupération du mot de passe passent.
- L'échec exact était : `Portail public : précache Service Worker non synchronisé avec le CSS du portail`.
- La cause n'était pas le CSS livré : `index.html` et `sw.js` contenaient déjà `style-prototype-dz.css?v=193`, `app.js?v=3564` et le Service Worker `dz-de-v3.185.0.0.132). Le script `ci/check-public-portal.mjs` conservait des attentes historiques `app.js?v=3563` et `dz-de-v3.185.0.0.131` (ainsi qu'un ancien texte de diagnostic).

### Correction appliquée
- Assertions et messages du contrôle portail synchronisés avec `app.js?v=3564` et `dz-de-v3.185.0.0.132`.
- Les références CSS v193 et client Supabase v3517 étaient déjà cohérentes et sont conservées.
- Commit de correction du contrôle : `210682cc5b6bfc77f692bdc886254fa0e8dfc1a2`.
- Vérification de source après correction : aucune occurrence résiduelle de `app.js?v=3563` ou `dz-de-v3.185.0.0.131` dans `ci/check-public-portal.mjs`.

### Validation et limites
- La nouvelle CI déclenchée par ce commit doit encore terminer ; aucune réussite n'est anticipée.
- L'échec CI était un décalage d'assertions de cache, pas un test fonctionnel navigateur. La création d'un compte étudiant, la réception d'un e-mail Auth et le premier enrôlement MFA restent à tester de bout en bout.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main`.
- Aucun déploiement Cloudflare/Supabase, aucune migration appliquée, aucune modification Auth distante, aucune branche Supabase créée et aucun frais engagé.


---

## Lot 249 — synchronisation de la version Service Worker dans le contrôle Masar (10 novembre 2026)

- La CI #2921 / run `42897647482` a dépassé le contrôle du portail public après le Lot 248, puis a échoué à l'étape 23, `Contrôler le tableau de bord مسارك`.
- Le journal identifie une assertion historique dans `ci/check-masar.mjs` : le test attendait encore `dz-de-v3.185.0.0.131`, alors que `sw.js` et le HTML utilisent `dz-de-v3.185.0.0.132`. Les attentes `app.js?v=3564` étaient déjà correctes.
- Correction du contrôle Masar : version attendue alignée sur `dz-de-v3.185.0.0.132`, avec libellé Lot 248. Commit `d0c27649d8c7a84967b5979ec3875072e973ca40`.
- Vérification source après édition : le contrôle Masar n'a plus l'ancienne version .131. La CI du nouveau HEAD doit encore être exécutée et examinée.
- Aucun changement du tableau de bord étudiant, aucun changement Auth/Supabase, aucune migration, aucun déploiement, aucune fusion, aucune branche Supabase ni frais. PR #17 reste ouverte ; `main` inchangée.


### Rectification technique du Lot 249
- La première édition de `ci/check-masar.mjs` n'avait pas remplacé correctement le motif regex malgré le commit initial. La relecture du fichier a détecté cette persistance ; ne pas considérer le premier commit comme ayant corrigé l'assertion.
- Correction exacte effectuée ensuite : motif attendu `/dz-de-v3\\.185\\.0\\.0\\.132/`, commit `c8ddf7fd53be4c93cb20facbc5f5fca8652f4fc6`.
- Cette rectification est tracée explicitement afin que le dossier reflète l'état réel du dépôt. CI à relancer/contrôler sur le HEAD suivant.


---

## Lot 250 — validation CI des corrections portail et مسارك (10 novembre 2026)

- CI #2925 / run `42898023612`, sur le HEAD `56e2e1db22794def4f5f76ba9d8153266623fbe2` : **succès**, job unique `Validation structurelle & pédagogique`, 33/33 étapes réussies.
- Les étapes spécifiques « Vérifier le portail public (catalogue et inscription) » et « Contrôler le tableau de bord مسارك » sont toutes deux réussies.
- Les contrôles statiques MFA e-mail étudiant, matrice des parcours, garde d'accès/TEST DE FUITE, régressions RAG/professeur/union et contrôle pédagogique restructuré sont également réussis.
- Cette réussite confirme les assertions automatisées du dépôt ; elle ne constitue pas un test navigateur, une création réelle de compte, une réception d'e-mail Auth, un enrôlement MFA réel, un test PostgreSQL isolé ou une validation de déploiement.
- PR #17 reste ouverte, non fusionnée et fusionnable. `main` inchangée. Aucun déploiement Cloudflare/Supabase, aucune migration appliquée, aucune branche Supabase créée et aucun coût engagé.
- Étape fonctionnelle restante : vérifier depuis le navigateur que l'inscription en ligne appelle effectivement Supabase Auth, puis diagnostiquer séparément la livraison de l'e-mail de confirmation et le parcours MFA étudiant. Ne pas modifier le SMTP, les secrets ou les paramètres Auth distants sans autorisation explicite.



---

## Lot 251 — diagnostic réel du contrat MFA et du circuit e-mail Auth (10 novembre 2026)

### Validation CI
- CI #2926 / run `42898674799`, HEAD `a85de356282c61fb45352a7573292f9cef9f1cf7` : **success**, job `Validation structurelle & pédagogique`, 33 étapes terminées avec succès.
- Les étapes 22 (portail public/catalogue/inscription) et 23 (tableau de bord مسارك) sont réussies sur ce HEAD.
- La PR #17 reste ouverte, non fusionnée et fusionnable ; base `main` inchangée.

### Écart critique confirmé entre le client PR et Supabase actif
- Lecture seule du projet Supabase actif : fonction Edge `mfa-email` ACTIVE, version **7**, `verify_jwt=true`.
- Lecture du code distant v7 : la réponse `status` ne contient ni `contractVersion: 1` ni le booléen `required`, et cette version ne lit pas le rôle `profiles.role` pour appliquer l'obligation uniquement aux élèves.
- Lecture de la source de la PR : le client `mfa-security.js` exige explicitement `contractVersion === 1` et un booléen `required`, puis bloque en cas de contrat absent ou incompatible. La source Edge Function de la PR retourne ce contrat, lit le rôle réel du profil et réserve `start/verify` aux élèves.
- Conclusion : le client de la PR et la fonction distante v7 ne sont **pas compatibles**. Une connexion peut être authentifiée, mais le garde MFA côté client refuse l'entrée lorsque la fonction v7 renvoie son ancien contrat. Il ne faut ni contourner ce garde ni accepter v7 comme solution.
- Les journaux Edge montrent des appels à `mfa-email` servis par la version 7, dont un POST HTTP 500 à 19:34:25 UTC. Les logs d'exécution disponibles ne donnent pas la cause applicative de ce 500 ; aucune cause précise n'est donc attribuée.
- Les journaux Auth consultés sur la fenêtre disponible montrent des connexions `/token` réussies du compte de coordination ; aucune trace d'inscription/confirmation n'a été retrouvée dans les événements Auth retournés. Cela ne prouve pas qu'un essai n'a jamais été fait, mais ne permet pas de valider un appel `signUp` réel ni une livraison d'e-mail.

### Circuit d'inscription et e-mail de confirmation
- La fonction `mfa-email` et sa clé Resend servent au code MFA personnalisé ; elles ne configurent pas le fournisseur SMTP de Supabase Auth pour les confirmations d'inscription.
- La documentation Supabase à jour (31 octobre 2026) confirme que le SMTP intégré n'envoie qu'aux adresses pré-autorisées de l'équipe du projet et recommande un SMTP personnalisé pour les utilisateurs publics.
- Le choix de ne pas désactiver la confirmation d'e-mail est maintenu. Aucun paramètre SMTP, modèle Auth, secret, utilisateur ou réglage distant n'a été modifié.

### Décisions de sécurité et prochaine étape
- Ne pas déployer la fonction v8 source PR tant que son contrat, ses dépendances de contexte admin, ses migrations requises et ses secrets n'ont pas été audités ensemble. La fonction distante v7 reste active.
- Ne pas appliquer la migration MFA de la PR sur la base active et ne pas créer de branche Supabase, compte tenu du coût et de l'interdiction déjà posée.
- Prochaine étape sûre : préparer un plan de bascule sans exécution, avec ordre précis (compatibilité fonction/migration/front), liste des prérequis de secrets SMTP/Auth et vérifications de retour arrière ; puis un essai contrôlé d'inscription uniquement après autorisation explicite et avec une adresse de test choisie par l'utilisateur.
- Aucun déploiement Edge Function/Cloudflare, aucune migration appliquée, aucune modification Auth/SMTP, aucune nouvelle branche, aucune fusion et aucun frais engagé.



---

## Lot 252 — vérification des prérequis SQL et du contexte Edge MFA (10 novembre 2026)

### CI et aperçu de la PR
- CI #2927 / run `42899071357`, HEAD `2e1efa57ce59b9139014905ff4ed8b61dae3e186` : **success**.
- Contrôle Cloudflare `Workers Builds: allemand` : **success**, URL de build sous `/previews/design-prototypes-67-74-alignment/` ; il s'agit du build d'aperçu de la branche PR, pas d'une fusion ni d'un déploiement manuel de production.
- Contrôle `Supabase Preview` : skipped ; aucune branche Supabase créée.
- PR #17 : ouverte, non fusionnée, `mergeable=true`.

### Vérification SQL en lecture seule
- Historique des migrations du projet actif contient `20261109210413 add_email_mfa_challenge_store`.
- Les tables `mfa_email_challenges`, `mfa_email_factors` et `mfa_email_sessions` existent dans `public`, avec les colonnes attendues par la fonction source.
- Les RPC `mfa_email_issue_challenge` et `mfa_email_consume_challenge` existent avec les signatures attendues.
- Les deux RPC sont non SECURITY DEFINER, avec `search_path` vide, exécution accordée à `service_role` seulement ; aucun droit EXECUTE à `authenticated` ni `anon`. Ce périmètre correspond aux appels effectués par le client admin de la fonction Edge.
- Conclusion : la migration et le stockage MFA nécessaires sont déjà présents dans le projet actif. **Aucune nouvelle migration SQL n'est identifiée comme prérequis immédiat** pour rendre la fonction source compatible.

### Contexte de la fonction Edge
- La fonction distante active reste `mfa-email` v7, `verify_jwt=true`, qui utilise l'ancien client admin construit à partir de `SUPABASE_SERVICE_ROLE_KEY` et ne retourne pas le contrat versionné attendu par le client.
- La source PR importe `createSupabaseContext` depuis `npm:@supabase/server@1`, obtient `supabaseAdmin` après validation du JWT utilisateur, vérifie le rôle `profiles.role`, retourne `contractVersion: 1` et `required`, et réserve les actions MFA aux élèves.
- La documentation Supabase officielle consultée confirme que `createSupabaseContext(req, { auth: 'user' })` est le mécanisme documenté pour valider le JWT et fournir le contexte admin ; `verify_jwt=true` doit rester activé pour cet endpoint utilisateur.
- La source utilise toujours les secrets d'envoi `RESEND_API_KEY`, `MFA_EMAIL_FROM` et `MFA_EMAIL_PEPPER`. L'outil disponible ne permet pas de confirmer sans exposition de secret si chacun est configuré ; ne pas afficher ni demander de coller des secrets dans le chat.

### Décision opérationnelle
- L'écart principal restant est désormais ciblé sur la mise à niveau de la fonction Edge v7 vers la source PR, et la vérification préalable de ses variables d'environnement. Les tables/RPC requises sont déjà présentes.
- Ne pas déployer tant que la disponibilité des variables requises et la revue finale de la source ne sont pas établies. Aucun changement distant n'a été fait.
- Pour l'inscription, le transport de confirmation Auth demeure distinct du fournisseur Resend MFA ; il reste à vérifier/configurer séparément, sans désactiver la confirmation d'adresse.
- Aucun SQL DDL, aucune donnée modifiée, aucun secret modifié, aucun déploiement Edge, aucune fusion, aucun coût engagé.


---

## Lot 253 — validation du HEAD, de la fonction Edge et de l'état de la PR (10 novembre 2026)

### État Git et CI
- HEAD contrôlé : `6e7fa44db84871bded8ba695fec9221140de5610`.
- CI #2928 / run `42899389445` : **success**, job unique « Validation structurelle & pédagogique » ; les 33 étapes utiles sont terminées avec succès, notamment les contrôles portail, مسارك, garde d'accès/TEST DE FUITE, MFA e-mail étudiant, matrice des parcours et régressions.
- Comparaison GitHub `main...design/prototypes-67-74-alignment` : statut `diverged`, branche PR en avance de 1 777 commits et en retard de 4 commits par rapport à `main`. Le point de divergence commun est `51acfe8c97b6e152208d592dbd2c5bbde5c5c38e`.
- Métadonnées de la PR #17 relues après comparaison : `state=open`, `merged=false`, `mergeable=true`, cible `main`, HEAD `6e7fa44`. GitHub indique donc actuellement qu'il n'y a pas de conflit bloquant, malgré les quatre commits d'écart.
- Aucun rebase, merge, changement de base, commit sur `main`, nouvelle branche ou déploiement n'a été effectué. Ne pas rebaser automatiquement une branche de cette taille : cela demanderait une analyse séparée des quatre commits de `main` et des éventuels chevauchements.

### Revue ciblée de la source Edge Function MFA
- Source relue dans la PR : `supabase/functions/mfa-email/index.ts`.
- Le code valide le JWT utilisateur, vérifie l'utilisateur et les claims de session, puis construit le contexte via `createSupabaseContext(req, { auth: "user" })` et utilise `supabaseAdmin` pour les seules opérations serveur nécessaires.
- Le rôle est lu depuis `profiles.role` côté serveur ; seuls les profils `eleve` sont soumis au MFA obligatoire. Les rôles explicitement exemptés sont `prof`, `admin`, `parent` ; les rôles inconnus sont refusés.
- Le contrat `contractVersion: 1` et `required` est renvoyé dans les réponses `status`. Les actions `start` et `verify` sont réservées aux élèves ; `disable` renvoie HTTP 403.
- Les variables attendues par la source sont `RESEND_API_KEY`, `MFA_EMAIL_FROM` et `MFA_EMAIL_PEPPER`, en plus du contexte Supabase. Leur présence/validité dans les secrets distants n'a pas été vérifiée et ne doit pas être supposée.
- La documentation Supabase officielle actuelle confirme l'usage de `createSupabaseContext(req, { auth: 'user' })`, l'accès au client admin via le contexte, et le maintien de `verify_jwt=true` pour une fonction appelée avec le JWT d'un utilisateur. Source : https://supabase.com/docs/guides/functions/auth
- Le test CI `ci/check-mfa-security.mjs` couvre le contrat versionné, le contrôle de rôle, le blocage de désactivation, les gardes client et les protections SQL. Ces assertions sont statiques ; elles ne prouvent pas qu'un e-mail Resend est livré ni qu'un étudiant peut terminer un enrôlement réel.

### Conclusion et prochaine action
- La CI du HEAD actuel est verte et GitHub considère la PR fusionnable, mais cela ne valide pas le parcours Auth/MFA réel.
- Le blocage de mise en service demeure l'écart entre la fonction distante v7 et le contrat v1 de la source PR, ainsi que l'incertitude sur les secrets d'envoi. Le SMTP Auth de confirmation d'inscription reste un circuit distinct.
- Prochaine action sûre : continuer l'audit en lecture seule du chemin d'inscription et de la configuration de confirmation Auth, sans modifier les paramètres distants ; ensuite préparer une checklist de bascule vérifiable avant toute demande d'autorisation.
- Aucun déploiement Edge Function/Cloudflare, aucune migration appliquée, aucun changement Auth/SMTP, secret ou donnée, aucune branche Supabase créée, aucune fusion et aucun coût engagé.


---

## Lot 254 — audit du chemin d'inscription et options SMTP sans domaine (10 novembre 2026)

### Chemin d'inscription côté code
- Relecture de `supabase/supabase.js` : `SB.signup(email, password, meta)` appelle bien `supabase.auth.signUp({ email, password, options: { data: meta || {} } })`. Le résultat renvoie la session si Supabase en fournit une, sinon l'application traite le cas « confirmation requise ».
- Relecture du gestionnaire `#signupForm` dans `app.js` : en mode cloud, il appelle `window.SB.signup`, affiche les erreurs Auth traduites et, en l'absence de session, renvoie l'élève vers l'onglet connexion avec l'adresse préremplie et l'instruction d'attendre le lien de confirmation.
- Les métadonnées transmises sont pseudo, niveau, filière et wilaya ; le rôle n'est pas fourni par le formulaire cloud. La règle serveur de rôle étudiant ne doit donc pas dépendre d'un rôle déclaré par le navigateur.
- Aucun défaut démontré dans l'appel `signUp` lui-même par cette lecture statique. Aucun essai navigateur ni événement Auth réel n'est revendiqué.
- Le paramètre `emailRedirectTo` n'est pas fourni explicitement par le client. Ne pas l'ajouter sans vérifier les URL de redirection autorisées dans Supabase Auth ; aucune configuration de ces URL n'est exposée par les outils disponibles.

### Audit de la voie e-mail gratuite sans domaine
- Documentation Supabase actuelle : le SMTP intégré refuse les destinataires qui ne sont pas membres autorisés de l'organisation et est limité à 2 e-mails/heure ; il n'est pas utilisable pour les inscriptions publiques. Source : https://supabase.com/docs/guides/auth/auth-smtp
- La documentation Supabase indique qu'un SMTP personnalisé est nécessaire pour envoyer à tous les destinataires ; le réglage doit rester avec confirmation activée (`mailer_autoconfirm=false`). La configuration du SMTP Auth est distincte des secrets de la fonction Edge MFA.
- La note Supabase sur Google SMTP (4 novembre 2026) décrit un compte Google Workspace administrateur, une adresse expéditeur/identifiant SMTP Workspace et un mot de passe d'application après activation de la 2FA. Elle ne valide pas l'utilisation d'un compte Gmail personnel `@gmail.com` comme solution gratuite fiable pour Supabase Auth. Source : https://supabase.com/kb/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y
- Les limites Gmail personnelles documentées ne constituent pas une garantie de délivrabilité Auth ni une approbation de cet usage ; aucune configuration Gmail n'est donc proposée comme solution certaine. Source : https://support.google.com/mail/answer/22839
- Conclusion provisoire : avec un compte Gmail personnel, sans domaine, sans dépense et sans configuration Auth vérifiable, aucune voie gratuite de livraison publique suffisamment étayée n'est confirmée à ce stade. Ne pas acheter de domaine, souscrire un fournisseur, ni modifier les paramètres Auth pour « essayer ».

### Limites d'accès et suite
- Les outils Supabase connectés disponibles permettent l'inspection des fonctions Edge, migrations, SQL et journaux, mais n'exposent pas de lecture directe des paramètres Auth SMTP, des modèles d'e-mail ni des URL de redirection. Leur état actuel reste donc non vérifié.
- Prochaine action sûre : préparer la checklist minimale des paramètres Auth à contrôler dans le tableau de bord, sans demander de clé ni de mot de passe dans le chat ; ne modifier aucun paramètre avant d'avoir identifié une solution gratuite réellement compatible et autorisée.
- Aucun secret, SMTP, paramètre Auth, modèle, URL de redirection, compte ou donnée n'a été modifié. Aucun déploiement, migration, nouvelle branche, fusion ni coût engagé.


---

## Lot 255 — contrôle CI du dernier HEAD et audit des rôles/migration MFA (10 novembre 2026)

### Résultats du HEAD documentaire précédent
- HEAD contrôlé : `4706f9daeaa0c634639f3a1e18d17933eba34183`.
- GitHub Actions #42900995851 : **success**, job « Validation structurelle & pédagogique », 33 étapes utiles terminées avec succès.
- Les contrôles dédiés au portail public, à مسارك, au MFA e-mail étudiant, à la matrice des parcours, aux accès/fuites et aux régressions sont réussis.
- Cloudflare Workers Build : **success**, build d'aperçu de la branche PR (pas de déploiement de production). Build ID `31e451a3-f989-4b17-a14d-17f4e5dbae06`.
- Supabase Preview : **skipped** car aucune branche Supabase n'est associée. Aucune branche créée.
- PR #17 reste ouverte, non fusionnée ; aucun rebase ni merge.

### Audit de la migration MFA — source PR seulement
- Relecture de `supabase/migrations/20261110160000_enforce_student_email_mfa.sql`.
- Le déclencheur `handle_new_user` fixe le rôle initial à `eleve` côté base ; les métadonnées client ne peuvent pas attribuer directement un rôle privilégié. Une demande de rôle parent est enregistrée comme demande en attente, sans modifier `profiles.role`.
- Le garde privé `private.student_email_mfa_access_allowed()` est SECURITY DEFINER, avec `search_path` vide, et vérifie le rôle du profil, le facteur e-mail, la session MFA liée au `session_id` du JWT et l'existence/expiration de la session Auth.
- Le garde restrictif est ajouté dynamiquement à chaque table `public` disposant déjà de RLS ; il s'ajoute aux politiques existantes. Le bucket Storage ciblé est uniquement `prive`.
- Les tables MFA restent fermées aux rôles clients ; les RPC d'émission/consommation sont réservées à `service_role`.
- Les fonctions SECURITY DEFINER qui contournent RLS sont explicitement protégées par le même garde dans les fonctions réécrites examinées.
- Cette lecture est une revue statique de la migration source. Elle ne remplace pas une exécution sur une base isolée ni des tests de régression RLS réels ; la migration n'a pas été appliquée au projet actif.

### Vérification des rôles existants — lecture seule
- Requête sur `public.profiles` : `admin = 1`, `eleve = 4`, `prof = 1`.
- Aucun profil `parent` n'est actuellement présent dans ce relevé ; les rôles réels observés correspondent aux valeurs traitées par le code. Ce relevé n'est pas une preuve de fonctionnement de la future migration.
- Aucune donnée n'a été modifiée.

### Décision et suite
- Le dernier HEAD applicatif/documentaire a une CI verte et un build d'aperçu Cloudflare vert.
- La prochaine validation technique indispensable reste une exécution de la migration et de la fonction MFA dans un environnement de test isolé. La création d'une branche Supabase peut engager des frais ; elle reste interdite sans autorisation explicite. Aucun autre environnement payant ne sera créé.
- Sans environnement de test gratuit déjà disponible, ne pas appliquer cette migration risquée au projet actif pour « essayer ».
- Aucun déploiement, aucune migration appliquée, aucun secret/SMTP/Auth modifié, aucune branche Supabase créée, aucune fusion et aucun coût engagé.


---

## Lot 256 — confirmation CI et revue de la fonction MFA e-mail (10 novembre 2026)

### État exact du HEAD
- HEAD contrôlé : `98f9e83b085f9c6a06d14d9e7771f34d3474e91a`.
- GitHub Actions #42901560337 : **success**, job unique « Validation structurelle & pédagogique », toutes les 33 étapes utiles terminées avec succès.
- Les contrôles portail public/inscription, tableau de bord مسارك, garde d'accès/TEST DE FUITE, MFA e-mail étudiant, matrice des parcours, régressions et contrôle pédagogique sont réussis.
- Cloudflare Workers Build : **success**, build ID `ce795104-26fd-40c0-8b87-313fa9185f5e`, associé à l'aperçu de la branche `design/prototypes-67-74-alignment`. Ce n'est pas un déploiement manuel de production.
- Supabase Preview : **skipped**, car aucune branche Supabase n'est associée. Aucune branche créée.
- PR #17 : `open`, `merged=false`, `mergeable=true`, cible `main`. Aucun merge, rebase, changement de base ou commit sur `main`.

### Revue ciblée de la source Edge Function MFA
- Fichier relu : `supabase/functions/mfa-email/index.ts` (236 lignes).
- Le code valide le JWT et la session, contrôle `email_confirmed_at`, lit le rôle depuis `profiles` côté serveur, puis utilise le contexte privilégié `supabaseAdmin` pour les seules opérations MFA serveur.
- Le contrat `contractVersion: 1` et le booléen `required` sont explicites ; seuls les rôles `eleve` sont obligés, les rôles `prof`, `admin`, `parent` sont exemptés, et les rôles inconnus sont refusés.
- L'émission des codes est limitée par RPC, les codes expirent après cinq minutes, les tentatives sont plafonnées à cinq et la désactivation autonome est refusée.
- Vérification documentaire actuelle : la documentation Supabase du 22 octobre 2026 confirme `createSupabaseContext(req, { auth: 'user' })`, la présence de `supabaseAdmin` dans le contexte et le maintien de `verify_jwt=true` pour les appels utilisateurs. Sources : https://supabase.com/docs/guides/functions/auth et https://supabase.com/docs/reference/server/usage-examples
- La source nécessite les variables `RESEND_API_KEY`, `MFA_EMAIL_FROM` et `MFA_EMAIL_PEPPER`. Leur présence et leur validité dans les secrets du projet actif ne sont pas vérifiables avec les accès disponibles ; aucune valeur n'a été lue, demandée ou modifiée.
- Aucun défaut statique supplémentaire suffisamment démontré n'a été retenu dans cette revue. Cela ne prouve pas l'exécution réelle de la fonction, la délivrabilité Resend, ni la réussite d'un enrôlement étudiant.

### Limites et décision
- Le décalage opérationnel reste inchangé : la fonction active du projet Supabase est toujours v7 et ne fournit pas le contrat v1 exigé par le client de la PR.
- Les paramètres SMTP Auth pour les e-mails de confirmation restent distincts de Resend MFA et ne sont pas exposés par les outils connectés.
- La CI statique et le build de preview sont verts, mais aucune validation navigateur, aucun e-mail réel, aucune migration appliquée et aucun test d'intégration sur une base isolée ne sont revendiqués.
- Ne pas déployer la fonction, ne pas appliquer la migration sur la base active, ne pas créer de branche Supabase, ne pas modifier les secrets/SMTP/Auth et ne pas engager de frais sans autorisation distincte.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.


---

## Lot 257 — confirmation de l'état Supabase actif et audit du parcours d'inscription (10 novembre 2026)

### CI et preview du HEAD précédent
- HEAD contrôlé : `1a52ad42209d56340d426d10be8ae49b9fc61a35`.
- GitHub Actions #42902211213 : **success**, job « Validation structurelle & pédagogique », 33 étapes utiles réussies.
- Cloudflare Workers Build : **success**, build ID `acd1ade2-a5ba-48ec-85af-670c68a9d4d4`, preview de la branche PR.
- Supabase Preview : **skipped**, aucune branche Supabase associée ; aucune branche créée.
- PR #17 : ouverte, non fusionnée, fusionnable ; cible `main`.

### État réel du projet Supabase — lecture seule
- Fonction Edge active `mfa-email` : **version 7**, statut ACTIVE, `verify_jwt=true`.
- La source active est encore l'ancien contrat : elle ne retourne ni `contractVersion: 1` ni `required`, ne contrôle pas le rôle étudiant et utilise directement `SUPABASE_SERVICE_ROLE_KEY`.
- Le client de la PR exige le contrat v1 et l'Edge Function de la PR utilise `createSupabaseContext(req, { auth: "user" })`. Le décalage v7/v1 est donc confirmé sur l'environnement actif.
- Historique des migrations retourné par Supabase : dernière migration MFA présente `20261109210413 add_email_mfa_challenge_store`. La migration `20261110160000_enforce_student_email_mfa` n'est pas enregistrée comme appliquée.
- Aucun déploiement de fonction, aucune migration, aucun secret, aucun paramètre Auth/SMTP et aucune donnée n'ont été modifiés.

### Revue du parcours d'inscription dans la branche PR
- `supabase/supabase.js` appelle `auth.signUp({ email, password, options: { data: meta } })` ; aucun `emailRedirectTo` n'est fourni. Le parcours dépend donc de l'URL de redirection par défaut et des URL autorisées configurées dans Supabase Auth.
- `app.js` utilise le mode Auth cloud lorsque le navigateur est en ligne ; le mode local reste réservé au hors-ligne ou au paramètre explicite `?demo`.
- Après inscription cloud, si Supabase ne retourne pas de session, l'interface bascule vers la connexion, préremplit l'adresse et indique à l'élève d'ouvrir le lien de confirmation.
- Si une session est retournée, le client exige le garde MFA puis recharge l'autorité du profil cloud avant d'entrer dans l'application.
- La source ne désactive pas la confirmation d'e-mail et ne crée pas de compte local de secours lorsque l'inscription cloud échoue.
- Aucun défaut de code statique démontrant à lui seul l'absence d'envoi du mail de confirmation n'a été trouvé dans l'appel `signUp`. La délivrabilité dépend du circuit Supabase Auth SMTP, distinct de Resend utilisé par le MFA personnalisé.
- L'absence de `emailRedirectTo` n'est pas corrigée à l'aveugle : il faut d'abord connaître l'URL Site URL et la liste Redirect URLs autorisées dans le projet Auth actif. Ces paramètres ne sont pas exposés par les outils connectés.

### Limites de diagnostic
- La lecture des journaux Supabase a échoué côté service de logs (`Failed to get project's logs`) pendant ce lot ; aucun événement d'inscription ni de livraison n'est donc revendiqué.
- La présence/validité des secrets `RESEND_API_KEY`, `MFA_EMAIL_FROM` et `MFA_EMAIL_PEPPER` reste non vérifiée ; aucune valeur secrète n'a été lue ou demandée.
- Le SMTP Auth, les modèles de confirmation, Site URL et Redirect URLs ne sont pas accessibles en lecture via les outils disponibles.
- Aucun test navigateur réel ni envoi d'e-mail de confirmation/MFA n'a été exécuté.

### Décision
- Le blocage de mise en service est confirmé : contrat Edge Function actif v7 incompatible avec le contrat client v1, migration d'enforcement absente du projet actif, et circuit SMTP Auth non vérifiable.
- Ne pas désactiver la confirmation d'e-mail, ne pas déclarer Gmail personnel compatible sans preuve, ne pas remplacer le SMTP, ne pas modifier les Redirect URLs, secrets, fonction ou migration active sans autorisation explicite.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`, aucun déploiement, aucune migration appliquée, aucune nouvelle branche Supabase et aucun coût engagé.


---

## Lot 258 — CI du Lot 257 et décision documentée sur le SMTP sans domaine (10 novembre 2026)

### Validation de la branche
- HEAD contrôlé : `36f318ebe982e09a8471652cd0c2a2922aba220a`.
- GitHub Actions #42902477391 : **success**, 33 étapes utiles terminées ; les contrôles portail/inscription, Masar, accès, MFA statique, parcours et régressions sont verts.
- Cloudflare Workers Build : **success**, build ID `ad438c91-caa8-462f-b0fc-1e812b6f8f64`, aperçu de la branche PR uniquement.
- Supabase Preview : **skipped**, aucune branche Supabase créée.
- PR #17 : ouverte, non fusionnée, fusionnable ; aucun merge ni déploiement.

### Revue complémentaire du MFA
- Relecture de la source PR `supabase/functions/mfa-email/index.ts`, du client `mfa-security.js`, de la migration d'enforcement et du contrôle statique `ci/check-mfa-security.mjs`.
- Le contrat Edge v1, le contrôle de rôle côté serveur, l'enrôlement automatique au premier accès étudiant, l'expiration à cinq minutes, le plafond de cinq tentatives et les limites d'émission par utilisateur sont explicitement présents.
- La suite CI MFA est une validation statique du code et de ses invariants ; elle ne prouve ni la bonne configuration des secrets ni un envoi réel.
- Aucun défaut supplémentaire démontré ne justifie une modification de code dans ce lot.

### Recherche officielle sur la confirmation e-mail et l'option sans frais
- La documentation Supabase « Send emails with custom SMTP », mise à jour le 31 octobre 2026, confirme que le SMTP intégré n'envoie qu'aux adresses membres de l'organisation et est limité actuellement à 2 e-mails/heure ; il n'est pas destiné à une inscription publique. Source : https://supabase.com/docs/guides/auth/auth-smtp
- Supabase recommande un fournisseur SMTP personnalisé ou le Send Email Hook pour envoyer à des utilisateurs externes. Le Send Email Hook remplace le transport SMTP mais ne fournit pas lui-même un fournisseur d'envoi. Source : https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
- La documentation Google SMTP consultée le 4 novembre 2026 décrit explicitement un compte Google Workspace administrateur et un mot de passe d'application ; elle ne valide pas un compte Gmail personnel comme solution SMTP gratuite fiable. Source : https://supabase.com/kb/troubleshooting/using-google-smtp-with-supabase-custom-smtp-ZZzU4Y
- Resend a annoncé le 25 août 2026 que son offre gratuite permet de vérifier jusqu'à trois domaines. Cela ne supprime pas l'exigence de posséder/contrôler un domaine pour établir l'identité d'expéditeur et les enregistrements DNS d'authentification. Source : https://resend.com/changelog/three-domains-on-the-free-tier
- Conclusion pour le contexte actuel (Gmail personnel, aucun domaine détenu, aucun budget autorisé) : aucune solution gratuite, fiable et documentée pour l'envoi public des confirmations Auth n'a été établie. Le SMTP intégré Supabase reste limité aux membres d'organisation ; Resend et les autres fournisseurs demandent une identité d'expéditeur/domaine vérifiable pour une délivrabilité sérieuse. Ne pas promettre que Gmail personnel fonctionnera.
- La clé Resend utilisée éventuellement par l'Edge Function MFA ne configure pas le SMTP Supabase Auth et ne règle donc pas le mail de confirmation initial.

### Décision et suite
- Ne pas désactiver la confirmation e-mail ; ne pas utiliser le SMTP intégré pour les élèves publics comme solution de production ; ne pas remplacer le SMTP ni activer un Send Email Hook sans fournisseur et expéditeur vérifiés.
- Garder le parcours cloud en échec fermé : aucun contournement local lorsqu'une opération cloud échoue.
- Le prochain jalon technique nécessite soit un domaine contrôlé et un fournisseur SMTP gratuit dans ses limites, soit une autre méthode d'identité explicitement acceptée. Aucune dépense ne doit être engagée.
- Aucun secret lu/modifié, aucun paramètre Auth changé, aucun e-mail envoyé, aucune migration ni fonction déployée, aucune branche Supabase créée.
- PR #17 demeure ouverte et non fusionnée ; `main` reste inchangée.


---

## Lot 259 — retrait complet du MFA dans la PR #17 (10 novembre 2026)

### Décision utilisateur
- Demande explicite : « supprimer mfa donne moi une inscription officielle ».
- Le MFA est retiré du parcours applicatif et du code source de la PR. L'authentification cloud officielle Supabase par e-mail + mot de passe est conservée.
- La question de la confirmation e-mail reste ouverte : faut-il conserver la confirmation (sécurité de propriété de l'adresse) ou autoriser la connexion immédiate après inscription sans confirmation ? Aucune modification de ce réglage Auth n'a été faite en attendant la décision.

### Changements sur la branche existante
- `app.js` : retrait des contrôles MFA au point d'entrée central, à la restauration de session, à la connexion, à l'inscription et au rattachement d'un compte ; maintien de Supabase comme autorité cloud et du chargement du profil/role.
- `supabase/supabase.js` : suppression des fonctions clientes MFA (AAL2, TOTP, SMS, recovery codes et fonction `mfa-email`) ; conservation de `login`, `signup`, récupération/mise à jour du mot de passe, session et profil.
- `index.html` : suppression du formulaire de défi MFA, de la carte « Protection du compte / authentification à deux facteurs » et du chargement de `mfa-security.js`.
- `sw.js` : suppression du fichier MFA du précache ; cache versionné `dz-de-v3.185.0.0.133`, références mises à jour vers `app.js?v=3565` et `supabase/supabase.js?v=3518`.
- Suppression de la source MFA dédiée `mfa-security.js`, de la fonction Edge MFA du dépôt, de la migration d'enforcement non appliquée et du test CI exclusivement MFA.
- Suppression de l'étape CI qui exécutait le test MFA.

### Vérifications statiques après modifications
- Aucune référence `DZ_MFA`, `mfaAssurance`, `mfaEmail`, `mfa-security.js`, `mfaChallengeForm`, `mfa-email` ou `enforce_student_email_mfa` ne subsiste dans les fichiers applicatifs contrôlés (`app.js`, `supabase/supabase.js`, `index.html`, `sw.js`, workflow principal).
- Le flux d'inscription cloud `SB.signup` et le flux de connexion `SB.login` sont conservés ; le formulaire garde le nom, l'e-mail, le mot de passe et les informations scolaires.
- Les contrôles de rôle/profil et les protections RLS existantes ne sont pas volontairement retirés.
- Cette vérification est statique ; le nouveau CI et le build Cloudflare doivent encore être vérifiés après ce commit.

### Limites / environnement actif
- Aucune modification des paramètres Supabase Auth, SMTP, secrets, base distante ou données utilisateurs.
- La fonction Edge `mfa-email` v7 déjà active dans le projet Supabase n'a pas été supprimée à distance ; elle n'est plus appelée par le code de cette PR. Aucune fonction n'a été déployée.
- La migration `20261110160000_enforce_student_email_mfa` n'était pas appliquée au projet actif ; elle a été retirée de la PR, sans opération SQL distante.
- Aucun test réel d'inscription, aucun e-mail envoyé, aucune confirmation Auth désactivée.
- Aucune dépense, aucun domaine, aucun SMTP ni fournisseur payant ajouté.

### État Git
- Branche existante uniquement : `design/prototypes-67-74-alignment`.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.
- Aucun déploiement de production.


## Lot 260 — synchronisation des assertions du tableau de bord après retrait MFA (10 novembre 2026)

- CI #42904443609 sur le commit `82997418f5c14bdd63acb48291d32c83bf8931af` : échec isolé à l'étape « Contrôler le tableau de bord مسارك ».
- Analyse du journal : le contrôle `ci/check-masar.mjs` attendait encore le Service Worker `.132` et `app.js?v=3564`, alors que le code applicatif du Lot 259 utilise `dz-de-v3.185.0.0.133` et `app.js?v=3565`.
- Correction ciblée de ces deux assertions uniquement, sans modifier le code fonctionnel du tableau de bord : commit `7c40874a428798fc5a55939598c386fbd044e2e7`.
- Le build Cloudflare de prévisualisation correspondant au HEAD précédent a réussi ; il s'agit d'un build de preview, pas d'une publication de production.
- La CI du nouveau HEAD doit encore terminer ; aucune réussite n'est anticipée dans cet addendum.
- Supabase Preview reste ignoré car aucune branche Supabase n'est associée. Aucune branche Supabase n'a été créée.
- Aucun réglage Auth, SMTP, secret, donnée, schéma, RLS, Edge Function ou migration distante n'a été modifié. Aucun e-mail réel ni test navigateur n'est revendiqué.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main`, aucun déploiement de production et aucune dépense.


### Lot 260 — deuxième assertion de cache corrigée
- La CI #42909226062 a confirmé que le contrôle Masar utilisait encore une seconde assertion obsolète : le précache `sw.js` attendait `app.js?v=3564` au lieu de `v3565`.
- Cette assertion distincte est maintenant alignée sur le Service Worker livré dans la PR ; commit de correction : `e593bac5b2248fd24c76380de85d93bbde3320ad`.
- La première correction (.132 → .133 et référence HTML app.js 3564 → 3565) était exacte, mais le test contenait deux références séparées à app.js ; la seconde n'avait pas été remplacée.
- Nouvelle CI déclenchée par ce commit ; résultat à confirmer. Aucun code applicatif ni paramètre Supabase modifié dans ce correctif de test.


## Lot 261 — fiabilisation du formulaire d'inscription officielle (10 novembre 2026)

- Le champ de mot de passe de l'inscription acceptait 4 caractères (`minlength=4`) alors que Supabase Auth utilise une longueur minimale par défaut de 6. Le formulaire demande maintenant au moins 6 caractères ; aucune configuration Auth distante n'a été changée. La documentation Supabase recommande 8 caractères ou davantage pour une meilleure sécurité, mais le lot s'aligne sur le minimum par défaut sans imposer une politique distante inconnue.
- Le texte d'aide après inscription ne prétend plus qu'un e-mail a nécessairement été envoyé : il indique que la confirmation dépend de l'activation de cette exigence et précise qu'un service d'envoi peut devoir être configuré.
- Le libellé de l'option élève ne promet plus une « activation immédiate » avant confirmation du compte.
- Tests statiques ajoutés dans `ci/check-public-portal.mjs` pour ces trois garanties ; assertions de cache Masar synchronisées.
- Cache actualisé : `app.js?v=3566`, Service Worker `dz-de-v3.185.0.0.134`. Le précache et les assertions CI sont alignés.
- Le flux reste l'inscription officielle Supabase Auth par e-mail/mot de passe ; aucune création locale de secours en cas d'échec cloud.
- Limite non résolue : le réglage de confirmation e-mail et le SMTP du projet actif ne sont pas vérifiés/modifiés dans ce lot. Aucun e-mail réel, compte étudiant réel ou parcours navigateur n'est revendiqué. Sans SMTP adapté, la confirmation publique peut ne pas être livrée ; le code seul ne peut pas corriger cette configuration.
- Aucun MFA réintroduit. Aucune modification distante Auth/SMTP/secrets, schéma, RLS, migration, Edge Function ou donnée. Aucun coût, aucune branche Supabase, aucun déploiement de production et aucune fusion.
- PR #17 maintenue ouverte et non fusionnée ; changements sur la branche existante uniquement.
- CI du code et du dossier à confirmer après ce lot.


### Lot 261 — synchronisation finale du contrôle Masar
- La CI #42910652748 a détecté une assertion supplémentaire dans `ci/check-masar.mjs` qui exigeait encore le Service Worker `.133` (test historique Lot 248), alors que le Lot 261 passe en `.134`.
- Assertion mise à jour vers `.134` ; commit correctif : `cc53c17a751b311ce29ca1de0712878b0ea77183`.
- L'échec précédent était un décalage du test, pas une erreur du code applicatif. La CI du HEAD corrigé doit encore terminer.



## Lot 262 — audit Supabase ciblé après retrait MFA (10 novembre 2026)

### Validation PR / aperçu
- PR #17 : ouverte, non fusionnée, fusionnable ; HEAD contrôlé `587b7df3296f7172726149f136dd5cab9d8f2626`.
- GitHub Actions #42910826362 : **success**, job « Validation structurelle & pédagogique » terminé avec succès (33 étapes utiles).
- Build Cloudflare Workers Preview du même HEAD : **success**, build ID `02abe4fd-828a-4f14-9ad5-28a22a3091cf`.
- Supabase Preview : **skipped** ; aucune branche Supabase créée.

### Audit base active — lecture seule
- Les 37 tables du schéma `public` observées ont RLS activé.
- Trois tables historiques du MFA (`mfa_email_challenges`, `mfa_email_factors`, `mfa_email_sessions`) ont RLS activé mais aucune politique. Elles restent donc sans accès via les politiques Data API ordinaires ; elles sont des reliquats de la précédente expérimentation MFA, et non une preuve que le MFA est encore appelé par le client PR.
- Security Advisors : 1 fonction `SECURITY DEFINER` exécutable par `anon`, 42 fonctions `SECURITY DEFINER` exécutables par `authenticated`, et protection Auth contre les mots de passe compromis désactivée.
- Fonction anonyme identifiée : `public.agreement_current(cle text)`. Elle a `search_path` fixé à `pg_catalog, public` et retourne la ligne complète de la convention active. La politique RLS de `public.agreements` autorise la lecture directe seulement à `authenticated`, alors que cette fonction SECURITY DEFINER est appelable par `anon` et contourne donc cette frontière RLS. Le contenu des conventions peut être destiné à la lecture publique, mais cet écart doit être explicitement validé ; recommandation : retirer EXECUTE à `anon` si l'accès public n'est pas une exigence.
- Revue manuelle ciblée de 12 fonctions privilégiées : `admin_dashboard`, `admin_report`, `admin_student`, `admin_decide_parent_role_request`, `accounting_depense`, `accounting_close_month`, `setting_set`, `subscription_decide`, `subscription_set_preuve`, `agreement_accept`, `agreement_publish` et `active_entitlement`. Les définitions observées contiennent des contrôles d'autorisation/perimètre (permission admin, rôle admin général, wilaya, identité de session ou propriété de la ressource selon la fonction). Ce contrôle ciblé ne remplace pas la revue exhaustive des 42 fonctions.
- Les fonctions privilégiées examinées fixent un `search_path` explicite (plusieurs à `pg_catalog, public`, certaines à vide avec qualification des objets). Aucun défaut d'injection de schéma n'a été démontré dans cet échantillon.
- Alerte Auth : `auth_leaked_password_protection` est désactivée. Recommandation : activer la protection contre les mots de passe compromis dans les réglages Auth après vérification des impacts de politique ; aucune modification n'a été faite.
- Les 3 alertes de tables MFA sans politique et les alertes SECURITY DEFINER sont des constats de configuration ; elles ne prouvent pas à elles seules une fuite de données. Le cas `agreement_current` est néanmoins un écart concret entre le privilège RPC et la politique RLS de la table.

### Décisions / limites
- Audit effectué en lecture seule : aucune révocation de privilège, fonction SQL, politique RLS, table, migration, paramètre Auth, secret, Edge Function ou donnée distante n'a été modifié.
- Aucun changement de sécurité n'a été poussé dans le code applicatif de ce lot ; les corrections éventuelles seront préparées séparément après validation de l'intention métier pour l'accès public aux conventions.
- Aucun test d'intrusion, test anonyme HTTP réel, test navigateur ou test de compte étudiant n'est revendiqué.
- Le retrait MFA du code PR reste inchangé. La fonction Edge distante `mfa-email` v7 et les anciennes tables restent des reliquats actifs/passifs du projet distant ; leur suppression n'a pas été autorisée ni effectuée.
- Confirmation e-mail/SMTP toujours non résolue ; aucun e-mail réel envoyé et aucun réglage Auth modifié.
- Aucun coût, aucune branche Supabase, aucun déploiement de production, aucune fusion ; `main` inchangée. PR #17 reste ouverte.



## Lot 263 — revue approfondie des RPC SECURITY DEFINER (10 novembre 2026)

### Périmètre contrôlé
- Revue statique des 42 fonctions SECURITY DEFINER signalées comme exécutables par `authenticated`, avec contrôle de leur signature, volatilité, `search_path`, présence des vérifications de session et examen ciblé des fonctions d'administration, comptabilité, conventions, messagerie et liens parent-élève.
- Contrôle ciblé supplémentaire des définitions complètes de `agreement_accept_for`, `agreement_publish`, `assignment_set_active`, `cancel_parent_link_request`, `accounting_close_month`, `accounting_depense`, `accounting_mark_rapproche` et `is_admin`.

### Résultats
- Les fonctions administratives examinées contrôlent les permissions via `admin_can` / `is_admin` et, lorsque nécessaire, le périmètre de wilaya. Les fonctions d'écriture comptable sont ainsi réservées aux administrateurs autorisés.
- `agreement_accept_for` exige un parent authentifié, un profil enfant de rôle `eleve`, un lien parent-enfant préalablement confirmé et une convention active avant d'enregistrer l'acceptation au nom de l'enfant.
- `cancel_parent_link_request` limite l'annulation au parent authentifié propriétaire de la demande encore en attente.
- `assignment_set_active` contrôle la permission de gestion des agents, refuse les affectations ambiguës et vérifie le périmètre géographique avant modification.
- Les RPC de messagerie inspectées utilisent l'identité de session et des contrôles de conversation / profil vérifié. La logique d'accès aux groupes repose en partie sur l'appartenance au même niveau, wilaya et filière ; ce comportement doit être confronté aux règles métier attendues avant toute modification.
- Les fonctions de cet échantillon utilisent un `search_path` fixé à `pg_catalog, public` ou vide avec qualification explicite des objets.
- Aucun contournement d'autorisation supplémentaire n'a été démontré dans cet échantillon. Cela reste une revue statique : aucun appel hostile avec comptes de test n'a été exécuté.

### Réserves maintenues
- L'écart précédemment identifié sur `agreement_current(text)` demeure : fonction SECURITY DEFINER exécutable par `anon`, qui retourne une convention active complète alors que la table `agreements` n'autorise pas la lecture directe anonyme par RLS. L'intention de publication publique doit être confirmée avant de révoquer ou conserver cet accès.
- La protection Auth contre les mots de passe compromis demeure désactivée.
- La revue statique ne constitue pas encore un test de pénétration ni une validation fonctionnelle de chaque RPC. Les 42 fonctions ne sont pas toutes couvertes par des scénarios de test dynamiques.
- Aucune modification Supabase, SQL, RLS, privilège, paramètre Auth ou donnée n'a été effectuée. Aucun changement applicatif dans ce lot.
- Aucun déploiement, aucune fusion, aucune branche Supabase et aucun coût. PR #17 reste ouverte ; `main` inchangée.


## Lot 264 — audit RLS des données sensibles et du stockage privé — 10 novembre 2026

Périmètre : lecture seule sur le projet Supabase actif `azjwcybivirvpxbfhyzk`. Inspection des politiques RLS, privilèges SQL accordés à `anon`/`authenticated`, colonnes et déclencheurs des tables `profiles`, `child_links`, `documents_meta`, `payments`, `receipts`, `subscriptions`, ainsi que du bucket Storage `prive`.

### Résultats vérifiés
- Aucun privilège SQL direct accordé à `anon` sur les six tables examinées. Les droits `authenticated` sont limités aux opérations listées par table ; par exemple `subscriptions` ne reçoit actuellement que SELECT et INSERT, pas UPDATE.
- `profiles` : la politique UPDATE propre à l'utilisateur protège explicitement `role` et `niveau`. Les déclencheurs `profiles_role_guard`, `profiles_scope_guard`, `profiles_verif_guard` et `protect_role_niveau` apportent des contrôles supplémentaires sur le rôle, le périmètre wilaya/niveau/filière et les champs de vérification. L'utilisateur ne peut pas s'auto-valider par une simple mise à jour de son profil ; le déclencheur réserve les changements de vérification à l'administration, avec une exception limitée au passage vers `en_attente`.
- `child_links` : lecture réservée aux deux participants ou à l'administration.
- `documents_meta` : opérations réservées au propriétaire ou à l'administration. Deux politiques permissives se recouvrent ; c'est redondant, mais les expressions observées ne montrent pas d'élargissement au-delà de ce périmètre.
- `payments` : création propre limitée à un enregistrement `en_attente` ; lecture propre ou administration, avec lecture/validation agent conditionnée par permission et wilaya. Aucun droit INSERT direct n'est accordé à `authenticated` dans les privilèges SQL relevés.
- `receipts` : lecture propre ou agent autorisé sur le périmètre wilaya ; les déclencheurs rendent les reçus immuables après création.
- `subscriptions` : création propre limitée au statut `en_attente`. Une politique UPDATE existe mais aucun privilège SQL UPDATE n'est accordé à `authenticated` : cette politique seule ne donne donc pas la capacité de modifier la table via le rôle API. Les colonnes de montant/plan/ref restent à contrôler dans le flux serveur de validation ; aucune modification n'a été faite.
- Bucket Storage `prive` : `public=false`, sans limite de taille de bucket configurée (`file_size_limit=null`). Les pièces jointes de messagerie ont une politique dédiée limitant l'envoi à 5 Mio et aux MIME PNG/JPEG/WebP/PDF, avec contrôle d'appartenance à la conversation. Une seconde politique générique `owner upload` autorise toutefois un utilisateur authentifié à envoyer dans son propre préfixe UID sans limite de taille ni filtre MIME. Cela ne rend pas le bucket public et ne donne pas accès aux fichiers d'autrui, mais laisse un risque de consommation abusive de stockage et de dépôt de fichiers non filtrés dans l'espace privé de l'utilisateur. À traiter comme durcissement recommandé, pas comme preuve d'accès inter-comptes.

### Conclusion et suites
- Aucun contournement direct des frontières entre comptes n'a été démontré dans ce lot.
- Point prioritaire de durcissement : définir une limite de taille au niveau du bucket et aligner la politique générique `owner upload` sur les limites MIME/taille correspondant aux usages réels, après inventaire des formats légitimes.
- Les politiques redondantes `documents_meta` pourront être rationalisées séparément, sans urgence démontrée.
- Ne pas modifier les politiques Storage/RLS ni les privilèges sans autorisation explicite ; aucun SQL d'écriture n'a été exécuté.
- Aucune création de compte de test, aucun test d'upload réel, aucune modification Auth, aucun secret touché, aucune nouvelle branche, aucun déploiement, aucun merge et aucun coût engagé.
- PR #17 demeure ouverte et non fusionnée. L'état brouillon a changé dans GitHub (draft=false) ; cela ne vaut ni fusion ni autorisation de fusion. Conserver strictement l'interdiction de merger.



## Lot 265 — revue des chemins d’upload et des autorisations Storage — 10 novembre 2026

### Vérifications complémentaires
- Lecture de la fonction cliente `SB.upload(file)` dans `supabase/supabase.js` : le code limite la taille à 5 Mio côté navigateur, mais ne contrôle pas le type MIME. Le chemin est construit comme `<uid>/<nom original>`, puis envoyé avec `upsert:true`. Le nom original n'est pas normalisé côté client.
- La politique Storage `owner upload` autorise INSERT dans le bucket `prive` dès que le premier segment du chemin correspond à `auth.uid()`. Elle n'impose aucune limite de taille ni liste MIME.
- Il s'agit d'une vraie différence entre contrôle client et contrôle serveur : un appel direct à l'API Storage peut contourner la limite de 5 Mio de l'interface et déposer des types de fichiers arbitraires dans le préfixe personnel. Le bucket reste privé ; les politiques de lecture/suppression limitent le périmètre au préfixe UID.
- La politique `msg storage upload` est distincte : elle impose 1 à 5 Mio, les MIME PNG/JPEG/WebP/PDF, le propriétaire UID et l'appartenance à la conversation. Le chemin des messages commence par `msg/<conversation_id>/...`, alors que l'upload général commence par `<uid>/...` ; la politique générique ne permet donc pas de remplacer la règle spécifique des pièces jointes de messagerie sur ce chemin.
- `msg_attachments` vérifie également l'uploader, la conversation, le type MIME, la taille et le statut `pending`. Les fonctions `msg_is_member` et `msg_is_moderator` vérifient l'identité appelante avant le contrôle de l'appartenance/modération.
- `fileUrl(chemin)` demande une URL signée d'une heure ; l'autorisation effective de lecture reste soumise à la politique Storage SELECT, qui exige le préfixe UID du compte connecté. Aucune URL signée ni donnée privée n'a été générée ou consultée pendant l'audit.
- Les deux politiques RLS de `documents_meta` (`admin all` et `owner only`) sont permissives et se recouvrent. Cela crée de la redondance, mais les expressions examinées ne démontrent pas d'accès inter-comptes.

### Risque confirmé
Le contrôle de taille de l'upload général est uniquement côté navigateur et donc contournable. Le contrôle MIME manque à la fois côté client et dans la politique Storage générique. Cela expose le bucket privé à des dépôts volumineux ou de formats inattendus dans le dossier de l'utilisateur ; ce n'est pas une exposition publique et aucun accès croisé n'a été démontré.

### Recommandations — aucune modification appliquée
1. Définir une limite de taille au niveau du bucket `prive` (valeur à choisir après inventaire des usages légitimes).
2. Remplacer la politique générique `owner upload` par une politique qui valide taille et MIME au niveau Storage, ou séparer les usages en politiques/buckets dédiés.
3. Ajouter une validation MIME et un nom de fichier normalisé côté interface, comme défense en profondeur, sans considérer cette validation cliente comme une frontière de sécurité.
4. Conserver la règle stricte dédiée aux pièces jointes de messagerie.
5. Vérifier si le dépôt général doit accepter des fichiers exécutables/archives ou seulement les formats pédagogiques réellement nécessaires avant de fixer la liste autorisée.

Aucun changement SQL, Storage, bucket, Auth, RLS, privilège, secret, fichier utilisateur ou compte n'a été effectué. Aucun upload de test, aucun déploiement, aucune nouvelle branche, aucun merge et aucun coût engagé. PR #17 reste ouverte et non fusionnée.



## Lot 266 — audit des preuves d’abonnement et du circuit de validation — 10 novembre 2026

### Périmètre et méthode
- Revue en lecture seule du code `supabase/supabase.js`, `billing.js`, `admin.js`, ainsi que des fonctions SQL, privilèges, politiques RLS et colonnes réelles des tables `subscriptions` et `payments`.
- Aucun compte, abonnement, paiement, fichier ou URL signée n'a été créé, modifié ou consulté. Aucun test d'attaque dynamique n'a été exécuté.

### Contrôles d'accès confirmés
- `subscription_set_preuve(bigint,text)` est une fonction `SECURITY DEFINER` avec `search_path` vide et qualification explicite. Elle exige `auth.uid()`, n'accepte pas une preuve vide et ne met à jour que l'abonnement dont `user_id = auth.uid()`, en statut `en_attente` ou `preuve`. Aucun remplacement de la preuve d'un autre compte n'est démontré par cette fonction.
- `subscriptions` : l'étudiant dispose de SELECT et INSERT, pas d'UPDATE SQL direct. La politique INSERT exige que `user_id = auth.uid()` et que le statut initial soit `en_attente`. La preuve passe donc par la RPC dédiée.
- `subscription_decide` vérifie la permission `payments.validate`, verrouille la ligne, vérifie le statut et limite la décision au périmètre wilaya de l'étudiant. L'activation ne peut pas être déclenchée par un simple UPDATE étudiant.
- `payments` : le rôle `authenticated` dispose de SELECT uniquement ; aucun privilège INSERT n'est accordé, même si une politique RLS d'insertion existe. Le code client qui tente `createPayment()` ne peut donc pas créer cette ligne avec les privilèges actuellement relevés.

### Incohérences fonctionnelles et risques
1. **Preuve non stockée dans Storage** : `billing.js` transforme le justificatif en chaîne `data:` (image compressée ou PDF) puis appelle `setPreuve`. La valeur est stockée dans `subscriptions.preuve`, pas dans le bucket privé `prive`. La limite de 1 Mo et le filtre image/PDF sont appliqués dans le navigateur seulement ; un appel direct à la RPC peut fournir un texte arbitraire ou une chaîne beaucoup plus longue. À durcir côté serveur (longueur, format MIME/signature et taille décodée) avant de considérer le justificatif fiable.
2. **Aucune preuve dans la table payments** : le schéma réel de `payments` ne contient pas de colonne `preuve`. Pourtant `admin.js` lit `r.preuve` dans la file des paiements et passe cette valeur à `ouvrirRecu()`. De plus, `admQueue()` sélectionne explicitement seulement `id,montant,devise,statut,methode,ref_plateforme,user_id`. Les boutons d'ouverture/téléchargement du justificatif dans cette file ne peuvent donc pas fonctionner avec le schéma et la requête actuels.
3. **Deux circuits non raccordés** : la preuve est enregistrée sur `subscriptions`, alors que la file de validation et les boutons de reçu lisent `payments`. La page principale d'administration affiche la valeur `subscriptions.preuve` comme texte échappé, mais ne la transforme pas en aperçu/téléchargement. L'interface présente ainsi un parcours d'envoi de justificatif sans parcours administratif cohérent pour consulter le document.
4. **Plan et montant non validés côté serveur à la création** : `createSub(plan,montant)` insère directement `plan` et `montant` depuis le navigateur. La politique RLS ne vérifie que l'identité propriétaire et le statut initial `en_attente`. Aucun déclencheur n'est présent sur `subscriptions` dans l'inventaire relevé, et `subscription_decide` ne compare pas le plan/montant à la table `plans` avant activation. Un client modifié peut donc soumettre une valeur de plan/montant différente de l'offre affichée ; la validation humaine doit actuellement détecter cet écart. C'est un défaut d'intégrité métier, pas un accès aux données d'un autre compte.
5. **Téléchargement Storage** : `fileUrl(chemin)` crée une URL signée pour le chemin fourni ; la lecture réelle reste soumise à la politique Storage. Le flux de preuve d'abonnement audité n'utilise toutefois pas ce mécanisme. Aucun accès inter-comptes via URL signée n'a été démontré.

### Conclusion et suites proposées — aucune correction appliquée
- Pas de vulnérabilité démontrée permettant à un étudiant de modifier l'abonnement ou le justificatif d'un autre étudiant.
- Défauts prioritaires à corriger dans la PR après validation du parcours métier : (a) choisir une seule source de vérité pour le justificatif et aligner le schéma, l'upload et la file admin ; (b) imposer les limites de taille/format côté serveur ; (c) valider plan et montant depuis `plans` côté serveur au moment de la création/décision ; (d) clarifier le modèle `payments`, puisque le client tente un INSERT non autorisé et que l'interface admin attend un champ `preuve` absent.
- Aucune modification du code applicatif, SQL, RLS, Storage, Auth, privilège, paramètre, secret ou donnée Supabase n'a été effectuée dans ce lot. Aucun changement de facturation ou de tarification n'est appliqué ; ce lot est un audit en lecture seule du flux déjà présent.
- Aucun déploiement, aucune fusion, aucune nouvelle branche, aucun coût et aucun changement sur `main`. PR #17 reste ouverte et non fusionnée.


## Vérification du prototype 2FA fourni — 10 novembre 2026

### Résultat de la comparaison
Le prototype transmis sous le nom `Texte collé(20261110-224451).txt` (HTML autonome, 1 144 lignes) a été lu et comparé à l'historique de ce dossier et aux décisions des Lots 259–261.

**Conclusion : oui, le sujet MFA a déjà été traité dans le projet, mais ce prototype précis n'a jamais été intégré comme système réel.**

Le fichier fourni est une maquette autonome de démonstration :
- Il simule l'écran après validation du mot de passe et le choix entre TOTP, SMS, e-mail et codes de secours.
- Il affiche un QR code décoratif et une clé TOTP codée en dur ; ce ne sont pas des données enrôlées pour un compte.
- Le code JavaScript contient explicitement `DEMO_OTP = '123456'` et une liste `DEMO_BACKUP_CODES` en dur. La vérification compare les saisies à ces valeurs locales après un `setTimeout`; aucun appel Supabase, serveur TOTP, fournisseur SMS ou service d'e-mail n'est effectué.
- Le compte à rebours de 30 secondes est une animation d'interface ; il ne génère pas un nouveau TOTP cryptographique.
- Le prototype charge Tailwind CDN et Lucide, alors que les règles du dépôt demandent de préserver l'interface vanilla et de ne pas ajouter de dépendances frontend.

### Ce qui a réellement été expérimenté dans ALLEMAND
- Une autre implémentation, distincte de cette maquette, a été développée dans la PR #17 : facteur e-mail personnalisé via Edge Function `mfa-email`, enrôlement et défi OTP, puis tentative d'obligation automatique.
- Cette implémentation n'était pas équivalente à MFA natif Supabase/AAL2 ; le dossier signalait que la barrière d'interface ne suffisait pas à protéger seule les appels directs Data API/RPC.
- À la demande ultérieure explicite « supprimer mfa donne moi une inscription officielle », les Lots 259–261 ont retiré le MFA du code de la PR et conservé l'authentification officielle Supabase e-mail/mot de passe.
- La fonction Edge distante `mfa-email` v7 et les anciennes tables MFA sont restées comme reliquats du projet Supabase ; elles ne sont plus appelées par le code PR. Leur suppression distante n'a pas été autorisée ni exécutée.

### Décision à respecter
- **Ne pas réintégrer ce prototype ni aucune de ses 4 méthodes 2FA.**
- **Ne pas réintroduire TOTP, SMS, e-mail OTP, codes de secours, écran de défi ou obligation MFA.**
- La maquette est une référence visuelle historique uniquement, pas une spécification fonctionnelle actuelle.
- Le parcours actuel reste l'inscription et la connexion cloud officielles Supabase par e-mail et mot de passe. La confirmation e-mail Auth est un sujet distinct du MFA et reste non résolue côté livraison SMTP ; ne pas la confondre avec un OTP MFA.
- Aucun code, réglage Auth, schéma, RLS, secret, fonction distante ou donnée n'a été modifié pendant cette vérification. Aucun déploiement, aucune fusion, aucun coût.



## Vérification du prototype « التقارير الأمنية / Centre de sécurité et confidentialité » — 10 novembre 2026

### Conclusion
Ce second HTML est une **maquette de tableau de bord**, pas un système de journalisation ou de détection de menaces connecté. Il peut être conservé comme référence de présentation pour une future page de sécurité/ confidentialité, mais ses chiffres, alertes et actions ne doivent jamais être présentés comme des données réelles.

### Éléments simulés ou codés en dur
- Identité « أحمد محمد », état « compte protégé », date/heure de dernière mise à jour et score de sécurité 85 % : valeurs de démonstration, sans lecture du profil ni calcul à partir de contrôles effectifs.
- Alerte de connexion suspecte depuis Oran, appareils (iPhone 15 Pro, Windows 11, appareil inconnu), lieux, dates, volumes de connexions et historique : données statiques inscrites dans le HTML ; aucune télémétrie ou journal d'authentification n'est interrogé.
- Indicateurs et graphiques Chart.js : séries de données fixes (par exemple 47 connexions, 3 tentatives suspectes) ; ils ne représentent pas l'activité réelle de la plateforme.
- Le tableau de bord affirme que 2FA est activé et attribue 25/25 points à la double authentification. Ces affirmations contredisent la décision actuelle de retrait du MFA et ne doivent pas être reprises.
- Les autres composantes du score (force du mot de passe, e-mail vérifié, téléphone, sessions, codes de secours) ne sont pas mesurées par ce prototype. Le score 85/100 et les recommandations associées sont donc fictifs.
- Le journal mentionne des méthodes SMS/TOTP, une activation 2FA, une tentative bloquée automatiquement et des sessions/appareils approuvés : aucun de ces événements n'est prouvé par une source réelle dans ce fichier.
- Les textes de protection des données et de conformité sont des déclarations génériques non étayées par une vérification de conformité.

### Actions d'interface non opérationnelles
- « Exporter le rapport PDF » affiche une notification puis annonce un téléchargement, mais ne crée aucun PDF.
- « Exporter l'historique CSV » affiche seulement une notification ; aucun fichier CSV n'est produit.
- Filtres, pagination, chargement supplémentaire, fermeture de sessions, blocage d'appareil, affichage des données, export JSON, suppression de compte et réglages de confidentialité ne sont pas reliés à un backend ni à des opérations Supabase.
- Le bouton de masquage retire uniquement l'alerte du DOM ; il ne marque pas une alerte réelle comme traitée.
- Le mode sombre utilise `localStorage`, ce qui ne constitue pas une persistance des préférences côté compte.

### Compatibilité avec le projet
- Le prototype dépend de Tailwind CDN, Chart.js, Lucide et Google Fonts ; il ne respecte donc pas directement la contrainte du projet de conserver l'architecture frontend vanilla sans nouvelle dépendance.
- Il s'agit d'une page HTML autonome et non d'un module intégré aux routes, composants et contrôles d'accès existants de la PR #17.
- Aucun contrôle d'accès n'est implémenté dans ce fichier. Une vraie page de sécurité devrait être strictement limitée aux informations de l'utilisateur connecté ; toute vue administrative devrait reposer sur des permissions serveur et des journaux vérifiables.

### Décision et conditions d'une éventuelle réutilisation
1. Conserver ce fichier uniquement comme **référence visuelle / prototype historique** ; ne pas le publier ni le présenter comme un centre de sécurité fonctionnel.
2. Ne pas réintroduire 2FA/MFA, TOTP, SMS, OTP e-mail ou codes de secours : la décision de retrait MFA consignée ci-dessus reste prioritaire.
3. Si une page de sécurité est développée ultérieurement, repartir d'une version conforme au frontend existant et n'afficher que des données effectivement disponibles et vérifiables. À défaut de journal d'événements, afficher clairement « données non disponibles » plutôt que des statistiques ou alertes inventées.
4. Ne pas promettre une détection géographique fiable, une identification d'appareil, une révocation de sessions ou une suppression de compte tant que les mécanismes serveur correspondants n'ont pas été conçus, autorisés et testés.
5. Les actions sensibles (révocation de sessions, export ou suppression des données) exigent des contrôles serveur, confirmation explicite et journalisation ; elles ne peuvent pas être simulées par des notifications UI.

### Périmètre de cette vérification
Analyse statique du HTML/JavaScript fourni uniquement. Aucun appel à Supabase, aucune lecture de données personnelles, aucune modification de code applicatif ou de configuration distante, aucun test sur un compte, aucun déploiement, aucune fusion, aucun coût. PR #17 reste ouverte et non fusionnée.


## Spécification fonctionnelle proposée — Centre de sécurité — 10 novembre 2026

### Demande utilisateur
La page cible comprend cinq onglets : vue d'ensemble avec indicateurs et graphiques sur 30 jours ; alertes et signalement ; journal de connexion filtrable avec export CSV et pagination ; activités et appareils ; confidentialité avec export JSON, suppression de compte et préférences. Les exports et interactions doivent produire un résultat réel, pas une notification simulée.

### Vérification de la disponibilité backend — lecture seule
- L'inventaire du schéma public du projet Supabase azjwcybivirvpxbfhyzk ne contient aucune table login_history, security_events ou user_devices.
- La table audit_logs existe, mais son modèle audité concerne les opérations d'administration (acteur, action, cible, wilaya) ; elle ne constitue pas un journal personnel des connexions Auth.
- La liste des Edge Functions actives ne contient que mfa-email (version 7). Aucune fonction analyze-security n'est déployée.
- Le client SB expose connexion, inscription, récupération et mise à jour du mot de passe, lecture de la session courante et déconnexion locale (signOut scope local). Aucun mécanisme de liste/révocation des sessions distantes, de gestion des appareils, d'analyse des menaces ou de suppression du compte n'a été relevé.
- L'API illustrative login_history, security_events, user_devices et analyze-security est une proposition, pas une API actuellement disponible dans ce projet.

### Conséquences pour la conception
- Ne pas créer de données fictives : score 85/100, volumes de connexions, lieux, alertes, appareils ou historique.
- Ne pas afficher une méthode 2FA et ne pas réintroduire MFA : le retrait MFA des Lots 259–261 reste la décision active.
- Ne pas présenter audit_logs comme un journal d'authentification étudiant.
- Les cinq onglets peuvent servir de structure d'interface, mais les sections dépendant d'une télémétrie absente doivent afficher « données non disponibles » ou rester désactivées, sans fausses statistiques.
- Les exports ne peuvent contenir que des données réellement disponibles et autorisées ; le bouton PDF ne doit être activé qu'après implémentation d'une génération réelle.
- La révocation de sessions distantes, le blocage d'appareils, la suppression du compte et l'effacement des données exigent une conception serveur, des autorisations et des tests spécifiques. Ne pas les simuler dans le navigateur.
- Les préférences purement visuelles peuvent être locales. Toute préférence présentée comme un réglage de sécurité/confidentialité du compte doit être persistée et appliquée côté serveur.
- Toute évolution future doit respecter le frontend vanilla, sans Tailwind, Chart.js ni nouvelle dépendance, et préserver les routes, IDs, handlers et contrôles d'accès.

### Décisions et périmètre
Aucune table, politique RLS, migration, fonction Edge, donnée ou secret n'a été créé ou modifié. Aucun paramètre Auth, MFA, SMTP, Storage, paiement ou facturation n'a été modifié. Aucun déploiement, aucune fusion, aucune nouvelle branche et aucun coût. PR #17 reste ouverte et non fusionnée.


## Prototype « التقارير الأمنية الدورية عبر البريد » — audit et cadrage — 10 novembre 2026

### Contenu demandé
L'utilisateur souhaite ajouter l'envoi de rapports de sécurité périodiques par e-mail, en complément du centre de sécurité : choix de fréquence (quotidienne, hebdomadaire, mensuelle), jour/heure, sélection du contenu, adresse destinataire, langue, alerte immédiate, aperçu du message, envoi test et historique des rapports envoyés.

### Audit du HTML fourni
- Il s'agit d'une maquette autonome, non reliée à Supabase ni au système de notification du projet.
- `saveSchedule()` et `saveEmailSettings()` affichent seulement des notifications de succès ; aucune préférence n'est enregistrée.
- `sendTestEmail()` affiche une fausse progression via `setTimeout` puis affirme un envoi réussi ; aucun e-mail n'est envoyé.
- Les chiffres 24 rapports, 92 % d'ouverture, 3 alertes, 8 jours, le score 85 %, les 12 connexions, les 2 appareils et les événements/localisations affichés sont fictifs.
- Les dates de janvier 2026 sont figées et incohérentes avec la date actuelle du projet (novembre 2026).
- Le destinataire `ahmed@email.com`, l'historique des envois, l'état « activé » et le prochain rapport sont des exemples fictifs.
- Le HTML utilise Tailwind CDN, Chart.js et Lucide ; cela ne respecte pas la contrainte du frontend vanilla sans nouvelle dépendance.
- Le modèle contient des références à TOTP, codes de secours, téléphone vérifié et activation MFA. Ces éléments doivent être retirés : MFA a été supprimée par décision utilisateur (Lots 259–261).
- Le suivi du taux d'ouverture n'est pas requis pour confirmer la livraison et augmente le suivi des utilisateurs ; ne pas l'activer par défaut. L'état à afficher doit distinguer demande, acceptation du fournisseur, livraison/échec si ces événements sont réellement disponibles.

### Vérification du mécanisme de planification et d'envoi
- Lecture seule de `pg_extension` : `pg_cron` et `pg_net` ne sont pas installés dans le projet Supabase consulté.
- Aucun schéma/table `cron` ou `net` n'a été trouvé dans l'inventaire consulté ; aucun travail périodique Supabase n'est donc configuré à ce jour.
- Aucune fonction Edge `analyze-security` ni fonction d'envoi de rapports périodiques n'est déployée. L'inventaire des Edge Functions déjà consulté ne montrait que l'ancienne fonction `mfa-email` (version 7), qui n'est pas un service de rapports et ne doit pas être réutilisée.
- Aucun journal d'authentification personnel fiable (`login_history`, `security_events`) ni registre d'appareils (`user_devices`) n'est disponible à ce stade, comme documenté dans la section précédente.
- Le SMTP Supabase intégré ne constitue pas une solution d'envoi public : ses limites et restrictions déjà relevées dans le Lot 258 restent applicables. La clé Resend précédemment évoquée dans le contexte de l'ancienne fonction MFA ne configure pas le SMTP Auth et ne prouve pas qu'un service d'envoi périodique soit prêt.
- Aucun domaine d'envoi vérifié n'est disponible dans le contexte du projet. Ne pas prétendre que l'envoi vers toutes les adresses des élèves est opérationnel ; ne pas exposer ni demander une clé secrète dans le frontend.

### Architecture recommandée, sans engagement de coût
1. Construire d'abord une source de vérité serveur pour les événements de sécurité réels, sans créer de faux historiques ni réintroduire MFA.
2. Enregistrer les préférences de rapport par utilisateur : fréquence, fuseau horaire (par défaut `Africa/Algiers`), heure, langue, catégories réellement disponibles, alertes immédiates et état d'abonnement. Le destinataire par défaut doit être l'adresse Auth confirmée ; tout changement d'adresse doit être vérifié.
3. Générer les rapports côté serveur à partir des événements autorisés du seul compte concerné. Ne jamais faire confiance à un `user_id` fourni librement par le navigateur pour décider du destinataire ou des données à inclure.
4. Ajouter un planificateur serveur seulement après décision et validation du mécanisme disponible ; chaque exécution doit être idempotente, journalisée, limitée en fréquence et protégée contre les doublons.
5. Envoyer par un fournisseur d'e-mail configuré côté serveur, avec secrets uniquement dans les secrets de fonction/environnement. Vérifier domaine, expéditeur, limites gratuites et destinataires autorisés avant d'annoncer l'envoi public. Ne pas engager de service payant ni d'achat de domaine sans autorisation explicite.
6. Conserver un historique minimal des demandes et résultats d'envoi ; distinguer `queued`, `sent/accepted`, `delivered` et `failed` uniquement si le fournisseur fournit réellement ces états. Ne pas afficher de taux d'ouverture sans besoin explicite.
7. Le rapport doit minimiser les données sensibles : pas de mot de passe, jeton, secret, code de récupération, identifiant de session, adresse IP complète ou géolocalisation précise. En cas d'alerte, envoyer un résumé prudent et un lien vers l'espace sécurisé plutôt que des détails sensibles.
8. Prévoir désactivation, modification de fréquence et désabonnement accessibles ; les alertes légalement/techniquement essentielles doivent être distinguées des rapports facultatifs.
9. Le bouton « Envoyer un test » doit déclencher un vrai appel serveur, vérifier le destinataire et afficher le résultat réel ; jamais de `setTimeout` simulant une réussite.

### Décision actuelle et limites
La maquette est conservée comme référence fonctionnelle uniquement ; elle n'est pas intégrée ni présentée comme opérationnelle. L'envoi périodique n'est pas activé car il manque actuellement une source d'événements de sécurité, un planificateur et un fournisseur/domaine d'envoi vérifié adapté aux destinataires. Aucune table, extension, migration, fonction Edge, tâche planifiée, configuration SMTP, secret, adresse e-mail ou fournisseur n'a été modifié. Aucun e-mail test n'a été envoyé. Aucun coût, déploiement ou fusion. PR #17 reste ouverte et non fusionnée.


## Lot 268 — solution cible pour les rapports périodiques personnalisés — 11 novembre 2026

### Nouvelles exigences confirmées
- Fréquences : quotidien ; hebdomadaire chaque lundi par défaut ; mensuel le premier jour du mois.
- Heure et jour personnalisables, fuseau par défaut `Africa/Algiers`.
- Six rubriques activables : journal de connexion, alertes, appareils actifs, score de sécurité, données de localisation, recommandations.
- Aperçu HTML réel, rapport urgent distinct, CTA de revue, historique des rapports et test d'envoi.
- Langues : arabe, français, anglais.
- L'état « ouvert » n'est pas une preuve de livraison et ne sera pas suivi par défaut. L'historique distinguera au minimum demandé/accepté/échec ; livré seulement si un webhook fournisseur vérifié le confirme.
- Les six rubriques restent indisponibles tant que leur source de données n'existe pas. Ne pas calculer score, géolocalisation, appareils ou alertes à partir d'hypothèses.

### Revue technique du SQL/Edge Function fourni
- Le SQL proposé est incomplet : il omet notamment `include_security_score`, `include_locations`, le fuseau horaire, le premier jour du mois, `updated_at`, l'opt-out/confirmation d'adresse et un journal d'envoi idempotent.
- La politique RLS proposée (`FOR ALL USING` sans `WITH CHECK`) ne constitue pas une politique complète d'écriture sûre ; les opérations doivent séparer SELECT/INSERT/UPDATE et vérifier que `user_id = auth.uid()` avec `USING` et `WITH CHECK`.
- Ne pas laisser le navigateur définir librement un destinataire ou un `user_id` pour un envoi privilégié. L'adresse par défaut doit venir de l'adresse Auth confirmée ; une adresse différente exige une vérification explicite.
- La fonction de diffusion ne doit pas traiter tous les utilisateurs à chaque appel public. Séparer les opérations : préférences utilisateur authentifiées (`verify_jwt=true)), demande de test de l'utilisateur courant, et dispatcher interne planifié.
- Si une fonction interne utilise `verify_jwt=false`, elle doit authentifier le secret de service dans le code/SDK selon la documentation Supabase actuelle ; ce réglage seul rendrait l'endpoint public. Ne jamais exposer de clé secrète dans le navigateur. Préférer la clé secret actuelle plutôt que de copier aveuglément les anciennes variables `SERVICE_ROLE_KEY`.
- Chaque période d'envoi doit avoir une clé d'idempotence unique par utilisateur, période et type de rapport. Verrouillage/claim atomique avant envoi, reprise après échec, limites par utilisateur, journalisation sans contenu sensible.
- Le code proposé `supabase/config.toml` avec `[functions.send-security-report.cron]` n'est pas la syntaxe de planification Supabase documentée. Supabase Cron se configure par jobs Postgres (`pg_cron`) ; l'invocation d'une Edge Function requiert `pg_net` et une clé conservée côté serveur/Vault.
- Les contrôles précédents du projet ont confirmé que `pg_cron` et `pg_net` ne sont pas installés. Aucun changement d'extension n'a été autorisé.

### Option d'ordonnancement préférable à étudier
- Le dépôt possède déjà un Cloudflare Worker principal `src/site-worker.js` et `wrangler.toml`. Cloudflare Cron Triggers peut appeler un handler `scheduled()` et le plan Free documente jusqu'à cinq triggers par compte.
- Cela offre une voie possible sans ajouter `pg_cron`/`pg_net` à Supabase : un unique déclencheur périodique UTC (par exemple toutes les 5 minutes) demande au backend de sélectionner les rapports arrivés à échéance selon `Africa/Algiers` ou le fuseau choisi.
- Il ne faut pas créer un trigger par élève. Le dispatcher doit gérer les échéances multi-fuseaux, le lotissement, l'idempotence et les limites d'exécution.
- Cette option est à confirmer avec le compte Cloudflare réellement utilisé ; aucune modification du Worker, aucun Cron Trigger et aucun déploiement n'ont été effectués. L'ajout du trigger dans `wrangler.toml` ne prend effet qu'après déploiement.
- Le fichier `worker/resend-welcome.js` est un Worker distinct d'exemple, non référencé comme entrée du Worker principal dans `wrangler.toml`. Il accepte une adresse `to` fournie par requête, sans authentification applicative ni limitation de débit ; CORS ne protège pas contre les appels serveur-à-serveur. Ne pas réutiliser tel quel pour un service d'envoi de rapports.

### Fournisseur e-mail et absence de domaine
- La page officielle Resend consultée le 11 novembre 2026 indique un niveau gratuit de 3 000 e-mails/mois, limité à 100/jour, et jusqu'à trois domaines vérifiés. Cela ne dispense pas de posséder et vérifier un domaine d'envoi.
- Sans domaine contrôlé par l'établissement et configuré DNS (SPF/DKIM, idéalement DMARC), ne pas annoncer `security@lycee-virtuel.dz` comme expéditeur opérationnel. `onboarding@resend.dev` reste un expéditeur de démarrage/test, pas une identité institutionnelle à promettre aux élèves.
- Aucun fournisseur ni forfait payant ne sera activé. Les prix et quotas doivent être revérifiés au moment de l'activation.
- Un test ne sera considéré réussi qu'après réponse réelle du fournisseur ; une livraison ne sera confirmée que par un événement webhook authentifié.

### Plan de réalisation sécurisé
1. Préparer dans la PR uniquement le contrat de données et les tests de validation des préférences, sans exécuter de SQL distant.
2. Ajouter une table de préférences et une table d'historique avec RLS stricte, destinataire Auth confirmé, catégories disponibles seulement, fuseau et idempotence ; préparer le SQL dans le dépôt après audit du modèle et de la stratégie de migration.
3. Implémenter les endpoints utilisateur et internes séparément, validation stricte, quotas et journaux.
4. Implémenter le générateur HTML multi-langue sans Tailwind/Chart.js/Lucide CDN, sans pixel de suivi par défaut, et sans afficher de MFA.
5. Ajouter le dispatcher Cloudflare Cron seulement après validation du plan Cloudflare et des secrets nécessaires ; tester en prévisualisation contrôlée, jamais en production sans autorisation.
6. Activer l'envoi réel uniquement après choix/validation du domaine d'expédition et vérification du fournisseur ; sinon conserver l'aperçu et un mode test non expéditeur clairement identifié.

### Périmètre de ce lot
- Dossier de continuité uniquement ; aucun code applicatif ni schéma distant modifié.
- Aucun changement Auth/RLS/Storage/SMTP/secret, aucune extension, aucune tâche Cron, aucun e-mail envoyé.
- Aucun coût, aucun déploiement, aucune fusion, aucune branche créée. PR #17 reste ouverte et non fusionnée.


## Lot 269 — vérification du chemin d'authentification et du Worker pour les rapports — 11 novembre 2026

### Sources relues sur la branche de la PR #17
- `index.html` charge encore `auth.js` pour compatibilité/démonstration, puis charge séparément le SDK Supabase et `supabase/supabase.js` comme module.
- Dans `app.js`, `authLocalMode()` ne bascule sur `AUTH.login/signup` que si le navigateur est hors ligne ou si le paramètre `?demo` est présent. En ligne hors mode démo, les formulaires appellent `window.SB.login/signup`.
- `supabase/supabase.js` utilise `auth.signInWithPassword`, `auth.signUp`, `auth.getSession` et `auth.signOut({scope:'local'})`. La fonction `me()` dérive l'utilisateur de la session Supabase. Le profil pédagogique est ensuite chargé par `cloudAuthority()` depuis `profiles`.
- `auth.js` conserve un système local historique basé sur `localStorage` et des comptes de démonstration. Il n'est pas le chemin d'authentification normal lorsque le site est en ligne et hors mode démo. Le mode hors ligne/démo ne doit jamais pouvoir activer l'envoi de rapports de sécurité.

### Worker et envoi e-mail
- `wrangler.toml` désigne uniquement `src/site-worker.js` comme entrée du Worker principal, avec les actifs statiques. Aucun Cron Trigger ni handler `scheduled()` n'est présent dans `src/site-worker.js` à ce commit.
- `worker/resend-welcome.js` est un fichier distinct, non déclaré comme entrée dans `wrangler.toml`. Il ne constitue donc pas un service actuellement intégré au Worker principal.
- Ce Worker d'exemple accepte `to` depuis le corps de requête et ne montre pas d'authentification applicative, de vérification de l'adresse du compte, de quota ou de protection anti-abus. Le contrôle CORS limité au navigateur n'authentifie pas les appels serveur-à-serveur. Ne pas le déployer ni le réutiliser tel quel pour des rapports sensibles.

### Conséquences pour la conception des rapports
- Source d'identité unique : session Supabase validée côté serveur ; ne jamais utiliser le pseudo, l'e-mail, le `user_id` ou la session locale fournis par le navigateur pour sélectionner le compte destinataire ou les données à extraire.
- Le mode `?demo` et le mode hors ligne doivent refuser explicitement les fonctions « envoyer », « test e-mail », « alertes immédiates » et « planification ». Ils peuvent seulement afficher un aperçu local clairement marqué comme aperçu.
- Pour les demandes individuelles, le serveur doit dériver l'identité du JWT vérifié et lire l'adresse Auth confirmée. Une adresse alternative nécessite une vérification dédiée.
- Le Worker principal pourra éventuellement héberger un `scheduled()` après conception et tests ; aucun Cron n'est ajouté dans ce lot. Le planificateur doit appeler un dispatcher authentifié, avec claim atomique/idempotence et limites, et ne pas exposer une route de diffusion publique.
- L'ancien `auth.js` ne doit pas être supprimé dans ce lot : son usage de compatibilité/démo est conservé tant qu'un audit complet des références n'a pas démontré qu'il est supprimable.

### Décision et périmètre
Audit du code uniquement, sans modification applicative ni Supabase distant. Aucun compte, session, e-mail ou secret n'a été utilisé. Aucun endpoint Resend n'a été appelé. Aucun Cron Trigger, aucune fonction Edge, aucune table, aucun secret ou paramètre SMTP n'a été créé ou modifié. Aucun déploiement, coût, fusion ou nouvelle branche. PR #17 reste ouverte et non fusionnée.


## Lot 270 — nettoyage Auth sans MFA et vérification des sources d'événements — 11 novembre 2026

### Décision MFA respectée
- Le fichier `supabase/supabase.js` contenait encore deux options client `experimental: { recoveryCodes: true }` dans les deux chemins de création du client Supabase.
- Ces options résiduelles ont été retirées. Aucun facteur, challenge, méthode TOTP/SMS/e-mail OTP, code de secours, écran MFA ou contrôle AAL n'a été ajouté.
- Vérification après commit : le fichier ne contient plus la chaîne `recoveryCodes`.
- Commit code : `f3fbee4f5862eba605da348903b368543dcebb4e`.

### Sources d'événements vérifiées
- L'inventaire réel des schémas `public` et `auth` confirme l'absence des tables applicatives `login_history`, `security_events` et `user_devices`.
- `auth.audit_log_entries` existe côté schéma Auth, mais le relevé consulté indique actuellement zéro entrée (aucune date minimale/maximale). Ses colonnes incluent `payload`, `created_at` et `ip_address` ; il ne faut pas exposer directement cette table aux élèves ni supposer qu'elle constitue un journal applicatif complet des connexions.
- Les privilèges de cette table observés dans `information_schema.role_table_grants` ne sont accordés qu'à `postgres` ; aucun accès direct n'a été observé pour `anon` ou `authenticated`.
- Le seul journal public déjà identifié, `public.audit_logs`, est un journal d'administration et ne doit pas être présenté comme l'historique de connexion personnel des élèves.
- `pg_cron` et `pg_net` figurent dans le catalogue des extensions disponibles, mais leur `installed_version` est NULL : ils ne sont pas installés dans ce projet. Aucun déclencheur de planification n'est donc prêt à être utilisé via ces extensions.

### Conséquences pratiques
- Pour l'instant, l'écran de sécurité doit afficher explicitement « historique de connexion indisponible » plutôt que fabriquer un nombre de connexions, un emplacement, un appareil ou un score.
- Une source future d'événements devra être alimentée côté serveur à partir d'événements réellement observables, avec minimisation des IP/données personnelles, rétention définie, accès strictement limité et séparation des événements Auth et des événements métier.
- Ne pas créer de pseudo-historique en lisant les sessions courantes comme si elles représentaient l'historique complet. Ne pas promettre une détection d'activité suspecte tant qu'une règle de détection et une source fiable n'existent pas.
- Le Worker principal `src/site-worker.js` ne possède toujours pas de handler `scheduled()`. Le fichier d'exemple `worker/resend-welcome.js` reste séparé de l'entrée déclarée par `wrangler.toml` et ne doit pas être réutilisé tel quel : son destinataire est fourni dans le corps de requête et le contrôle CORS ne constitue pas une authentification.

### Périmètre de ce lot
- Un seul changement de code local à la PR : retrait des options client résiduelles liées aux recovery codes.
- Le reste est un audit en lecture seule. Aucun schéma, politique RLS, fonction, extension, secret, SMTP, réglage Auth ou donnée distante n'a été modifié. Aucun e-mail envoyé, aucun Cron ajouté, aucun déploiement, aucune dépense, aucune fusion et aucune nouvelle branche.


## Lot 271 — validation des journaux Auth disponibles pour les rapports — 11 novembre 2026

### Découverte importante : les événements Auth existent dans les logs unifiés
- Le contrôle SQL précédent de `auth.audit_log_entries` retournait zéro ligne et les rôles API n'avaient aucun privilège direct sur cette table. Cela ne signifie pas que Supabase ne produit aucun événement : l'exploration en lecture seule du flux unifié de logs a identifié une source distincte `auth_audit_logs`.
- Sur la fenêtre des dernières 24 heures au moment de l'audit, le flux exposait 37 événements : 23 `login` via le fournisseur `email`, 7 `token_refreshed` et 7 `token_revoked`. Ces chiffres sont des observations globales du projet pour cette fenêtre, pas des statistiques par élève et ne doivent pas être affichés comme données personnelles.
- Les événements incluent un identifiant d'acteur, une date, une action, un fournisseur, un user-agent et un identifiant de requête. Dans les 37 événements observés, le champ IP était vide ; aucune géolocalisation fiable ne peut donc être déduite.
- Les autres sources unifiées présentes incluent notamment `auth_logs`, `edge_logs`, `postgres_logs`, `function_edge_logs`, `function_logs`, `storage_logs` et `realtime_logs`.

### Limites et implications d'architecture
- `auth_audit_logs` est un flux de logs de plateforme consultable via les outils d'observabilité du projet, pas une table applicative exposée au navigateur. Ne pas donner à un étudiant un accès direct au flux de logs ni créer une vue publique qui le réplique.
- L'accès de production aux événements devra passer par un composant serveur de confiance qui authentifie l'utilisateur à partir du JWT vérifié, filtre impérativement sur son propre `actor_id`, limite les colonnes et la période, puis renvoie un schéma de réponse minimal. Ne jamais accepter `user_id`, email, actor_id ou destinataire comme critère d'autorisation fourni par le navigateur.
- Ne pas assimiler `token_refreshed` à une nouvelle connexion. Pour l'historique, distinguer au minimum « connexion » (`login`) et « activité de session » (rafraîchissement/révocation de jeton). Les événements de révocation ne prouvent pas à eux seuls une déconnexion manuelle explicite.
- L'IP n'étant pas renseignée dans les événements observés, les fonctions « localisation », « pays/ville » et « connexion suspecte par géolocalisation » restent indisponibles. Le user-agent est une chaîne déclarative et ne prouve pas l'identité réelle de l'appareil.
- Les résultats couvrent uniquement la fenêtre d'observabilité interrogée (maximum 24 h par requête selon l'outil), et ne prouvent pas la rétention complète des logs. Avant de promettre un historique sur 7/30/90 jours ou d'envoyer un rapport périodique, vérifier la rétention réelle et la disponibilité du flux sur cette période.
- Les rapports peuvent, à terme, compter les événements Auth réels par compte et par période si un accès serveur supporté et stable est validé. Si cette source n'est pas accessible dans le runtime applicatif, afficher « données indisponibles » plutôt que reconstituer ou inventer un historique.

### Décision technique
- Étape suivante recommandée : tester en environnement de prévisualisation un adaptateur serveur isolé qui consomme uniquement une source officiellement supportée, valide l'identité côté serveur, applique un filtre propriétaire et retourne des événements minimisés. Aucun endpoint de ce type n'est encore créé ni déployé.
- Le tableau de bord et les e-mails périodiques restent non fonctionnels tant que l'adaptateur, la rétention, la politique d'accès et le fournisseur d'envoi ne sont pas validés.
- Aucun changement Auth, SQL, RLS, fonction distante, secret, SMTP, Worker déployé ou paramètre de production n'a été effectué dans ce lot. Aucun e-mail envoyé, aucune dépense, aucun déploiement, aucune fusion et aucune nouvelle branche.


## Lot 272 — validation de la voie d'accès technique aux logs Auth — 11 novembre 2026

### Documentation Supabase officielle vérifiée
- La documentation Auth Audit Logs confirme deux stockages distincts : stockage externe de logs (utilisable via l'observabilité) et stockage PostgreSQL facultatif dans `auth.audit_log_entries`. Le stockage PostgreSQL se règle dans Authentication > Audit Logs > « Write audit logs to the database » et consomme de l'espace DB.
- Cela explique le constat local : des événements Auth sont présents dans le flux externe `auth_audit_logs`, alors que `auth.audit_log_entries` reste vide.
- La documentation « Query logs with SQL » indique que l'accès programmatique passe par le Supabase MCP ou la Management API `GET /v1/projects/{ref}/analytics/endpoints/logs`. L'API exige un jeton Management API autorisé avec le scope `analytics_logs_read` et une fenêtre maximale de 24 heures par requête.
- La documentation Log Drains précise que les drains ne sont disponibles que sur les plans Pro, Team et Enterprise. Cette option n'est donc pas retenue : pas de changement de plan, de service externe ou de dépense.
- Références officielles : https://supabase.com/docs/guides/auth/audit-logs ; https://supabase.com/docs/guides/observability/advanced-log-filtering ; https://supabase.com/docs/reference/api/v1-get-project-logs ; https://supabase.com/docs/guides/observability/log-drains

### Choix d'architecture
- Ne pas intégrer un jeton personnel Supabase Management API dans le navigateur, le dépôt, les paramètres publics ni dans une fonction accessible sans contrôle. Ce jeton est un secret d'administration et son scope doit être limité au strict nécessaire.
- La voie à privilégier pour une fonctionnalité durable est d'abord de décider si le stockage PostgreSQL facultatif des logs Auth peut être activé, puis de concevoir un accès serveur limité qui ne renvoie que les événements du compte authentifié. Cette activation est un changement de configuration distante et n'a pas été effectuée.
- Alternative possible mais non retenue à ce stade : un Worker serveur avec un secret Management API restreint, appels par tranches de 24 h, quotas, filtrage actor_id et rétention contrôlée. Cette voie dépend d'un secret personnel à forte portée et doit être évaluée séparément avant toute création.
- Aucun code d'accès aux logs n'a été ajouté ; aucune table, vue, RPC, migration, politique RLS, réglage Auth, secret, Worker Cron, Log Drain ou intégration tierce n'a été créé ou activé.

### État de la fonctionnalité
- Le prototype de rapports périodiques demeure une maquette ; il n'envoie aucun e-mail et n'a pas de planificateur actif.
- L'historique individuel et les rapports ne peuvent pas encore être activés proprement depuis l'application. Les données affichées doivent rester « indisponibles » jusqu'à la mise en place et la validation d'un accès serveur sécurisé.
- Aucun 2FA n'est dans le périmètre de ce lot. Aucun déploiement, aucun e-mail, aucune dépense, aucune fusion et aucune nouvelle branche.



## Lot 273 — vérification du schéma réel des attributs Auth et granularité des événements — 11 novembre 2026

### État du projet et CI
- Lecture seule du projet Supabase : statut `ACTIVE_HEALTHY`, région `eu-west-2`, PostgreSQL `17.6.1.166`.
- CI GitHub #2966 / run `43008079677` sur le HEAD documentaire précédent `d1311ac15e25c2bdecb78b7095c23bc71935895e` : **success**.
- CI du Lot 271 #2965 / run `43008025308` : **success**.
- PR #17 vérifiée ouverte, `merged = false`, tête `d1311ac15e25c2bdecb78b7095c23bc71935895e`.

### Correction de la lecture des logs Auth
- La première requête de vérification utilisait des clés de premier niveau qui ne correspondent pas au schéma réel des événements ; elle renvoyait des chaînes vides. Aucune conclusion sur l'absence de ces champs ne doit être tirée de cette requête initiale.
- L'inventaire des clés de `log_attributes` révèle les champs réels : `auth_audit_event.action`, `auth_audit_event.actor_id`, `auth_audit_event.actor_username`, `auth_audit_event.created_at`, `auth_audit_event.log_type`, `auth_audit_event.request_id`, `auth_audit_event.traits.provider` et `auth_audit_event.user_agent`.
- Aucun attribut IP n'apparaît dans les clés observées de ces 37 événements. La géolocalisation reste donc non prise en charge par cette source.
- Requête agrégée corrigée sur la fenêtre par défaut des dernières 24 heures : 23 événements `login`, 7 `token_refreshed`, 7 `token_revoked`. Les 23 connexions couvrent 2 acteurs distincts ; chaque catégorie de 7 événements de session couvre 1 acteur distinct. Tous les événements ont un `actor_id` et un `user_agent` non vides ; le fournisseur est présent sur les 23 événements `login`.
- Ces nombres sont des agrégats projet. Les identifiants d'acteur n'ont pas été affichés ni ajoutés au dossier ; ces données ne constituent pas l'historique d'un compte particulier.

### Conséquence pour l'implémentation
- Un filtre individuel peut s'appuyer sur `auth_audit_event.actor_id`, mais uniquement après validation serveur du JWT et extraction de l'identité depuis ce JWT ; le navigateur ne doit jamais choisir l'acteur, le destinataire ou l'identifiant de compte.
- Les réponses applicatives devront distinguer `login`, `token_refreshed` et `token_revoked`, avec période bornée et colonnes minimisées. Le user-agent est une indication déclarative, pas une preuve d'identité d'appareil.
- Cette vérification n'établit toujours pas la rétention au-delà de la fenêtre interrogée ni une API applicative stable permettant d'interroger ces logs depuis le Worker. Aucun endpoint de consultation n'est donc ajouté.
- Prochaine étape sans changement distant : vérifier les capacités disponibles dans le Worker et la configuration de logs accessible en lecture seule ; préparer ensuite une spécification d'adaptateur serveur sans l'activer tant que sa source et son identité ne sont pas garanties.

### Périmètre
- Lecture seule : projet Supabase et flux unifié de logs.
- Aucun réglage Auth/Audit Logs, table, vue, RPC, migration, politique RLS, secret, fonction Edge, Cron, SMTP ou fournisseur d'e-mail modifié.
- Aucun e-mail, coût, déploiement, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.



## Lot 274 — audit de capacité du Worker pour les rapports — 11 novembre 2026

### Entrée Worker et routes
- Lecture de `wrangler.toml` : l'entrée unique est `src/site-worker.js`, avec le binding d'actifs statiques `ASSETS`. Aucun bloc `[triggers]`, `crons` ou autre planification n'est déclaré.
- Lecture complète de `src/site-worker.js` : le Worker expose un handler `fetch(request, env, ctx)` et aucun handler `scheduled()`.
- Le seul contrôle serveur applicatif identifié dans ce Worker concerne les ressources pédagogiques protégées : il vérifie la présence d'un Bearer token et interroge Supabase REST sur `lesson_content` en transmettant le jeton utilisateur et la clé publishable/anon. Les autres chemins sont servis via `ASSETS.fetch(request)`.
- Aucun endpoint de rapports, d'historique Auth, de préférences de rapport, d'envoi e-mail ou de dispatcher n'existe dans cette entrée Worker au HEAD audité.
- Le contrôle de ressources pédagogiques ne peut pas être réutilisé comme preuve d'identité/autorisation pour des rapports : son objectif est l'entitlement des contenus et il ne fournit pas l'interface d'événements Auth requise.

### Décision d'architecture confirmée
- Le Worker existant ne peut pas actuellement produire des rapports périodiques : il manque à la fois une source de données Auth accessible au runtime, une route authentifiée dédiée, un stockage des préférences/historique et un planificateur.
- Une future route devra valider le JWT avec Supabase Auth côté serveur, dériver l'identité depuis la réponse de validation, appliquer une période maximale et ne retourner que les événements du propriétaire. Les paramètres `actor_id`, `user_id`, adresse e-mail ou destinataire fournis par le client ne seront jamais utilisés comme autorité.
- La planification devra être un déclencheur distinct, idempotent et limité ; aucun Cron n'est ajouté tant que l'accès aux événements, le stockage, les quotas et le canal d'envoi ne sont pas validés.
- Aucun usage du fichier d'exemple `worker/resend-welcome.js` n'est retenu pour les rapports : il n'est pas l'entrée Worker déclarée et son modèle de destinataire fourni par le client n'est pas adapté à un rapport de sécurité.

### Périmètre
- Audit en lecture seule de `src/site-worker.js` et `wrangler.toml`, sans changement applicatif.
- Aucun secret, variable Cloudflare, route, binding, Cron, fournisseur e-mail, paramètre Supabase ou donnée distante modifié.
- Aucun déploiement, e-mail, coût, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.



## Lot 275 — audit de la validation d'identité JWT côté Worker — 11 novembre 2026

### Code client observé
- `supabase/supabase.js` expose `getSession()`, qui appelle `c.auth.getSession()` et renvoie la session conservée par le SDK ; `me()` retourne le user inclus dans cette session.
- `app.js` appelle `cloudAuthority()`, qui récupère le profil via `SB.myProfile()`, puis écrit une représentation locale dans `dz_de_session_v1`. Cette représentation sert à l'interface/niveau et ne constitue pas une preuve d'identité pour une ressource de sécurité.
- Le code de connexion en ligne utilise `SB.login()` puis `cloudAuthority()`. Le mode local reste séparé (hors ligne ou `?demo`) et ne doit jamais être accepté par un endpoint de rapport.
- Une fonction de chargement de contenu récupère l'`access_token` depuis `getSession()` et le transmet au Worker comme Bearer. Ce jeton est une donnée de transport ; son objet `user` local ne doit pas être considéré comme validé par le serveur.

### Worker observé
- `src/site-worker.js` ne vérifie actuellement pas explicitement le sujet d'un utilisateur pour un endpoint de compte. Pour les ressources protégées, il transmet le Bearer à Supabase REST et laisse le contexte Auth/RLS existant décider si une ligne de contenu est visible.
- Cette délégation RLS est appropriée à la garde actuelle de contenus, mais ne fournit pas encore un identifiant utilisateur validé à un futur gestionnaire de rapports.
- Aucun endpoint de rapport n'est créé dans ce lot.

### Contrat d'authentification proposé pour un futur endpoint
1. Accepter uniquement une requête HTTPS avec un unique en-tête `Authorization: Bearer <access_token>` ; rejeter les absences, formats multiples et jetons vides.
2. Valider le jeton côté serveur auprès de l'instance Auth du projet, par exemple avec `GET /auth/v1/user` et la clé publishable/anon dans `apikey`, en transmettant le Bearer reçu. Ne pas se fier à `getSession().user`, à `localStorage`, au profil affiché ou à un `user_id` du corps.
3. En cas de réponse Auth non 2xx, réponse invalide, utilisateur absent ou erreur réseau, refuser l'accès (fail closed) ; ne jamais basculer vers une identité locale ou une adresse e-mail saisie.
4. Extraire le seul identifiant de compte depuis le user retourné par Auth ; cet identifiant est la source de vérité pour tout filtrage. Ignorer tout `actor_id`, `user_id`, destinataire ou adresse e-mail fournis par le navigateur.
5. Ne renvoyer que les champs explicitement nécessaires, avec période bornée, pagination contrôlée, limites de fréquence, réponses `Cache-Control: no-store` et journalisation sans jeton ni donnée sensible.
6. Distinguer les événements `login`, `token_refreshed` et `token_revoked`. Un user-agent est indicatif et ne prouve pas qu'il s'agit d'un appareil unique. Aucune géolocalisation n'est disponible dans les attributs audités.
7. Si la future lecture s'appuie sur une table PostgreSQL, exécuter les requêtes avec le contexte Auth de l'utilisateur et RLS ; ne jamais exposer une clé `service_role`/secret au client. Si une source de logs externe administrative est retenue, le service doit filtrer sur l'identité validée et ne jamais accepter une identité fournie par le client.

### Documentation Supabase vérifiée
- Le guide officiel « Build a User Management App » distingue explicitement `getSession()` (session chargée depuis le stockage local, non revalidée) de `getUser()` (appel réseau Auth) et `getClaims()` (validation cryptographique des claims, selon la configuration de signature). Pour une réponse utilisateur à jour, `getUser()` est la voie retenue ici.
- Le guide officiel « Integrating With Supabase Auth » pour les fonctions montre l'extraction du Bearer, l'appel `auth.getUser(token)` et l'utilisation du contexte Auth pour appliquer RLS.
- Références : https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs ; https://supabase.com/docs/guides/functions/auth-legacy-jwt ; https://supabase.com/docs/reference/javascript/auth-getuser

### Décision / périmètre
- Contrat d'authentification documenté uniquement ; aucune route, fonction Edge, RPC, table, politique RLS, secret, configuration Auth ou variable Cloudflare n'a été modifié.
- Aucun jeton Management API, service_role ou secret administratif introduit.
- Aucun déploiement, e-mail, coût, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.


## Lot 276 — disponibilité réelle de la source Auth pour les rapports — 11 novembre 2026

### État de la PR et validation
- PR #17 vérifiée : ouverte, non fusionnée, branche `design/prototypes-67-74-alignment`, tête `4ef7f92970510034e4e50acc44151519809c4f2f`.
- CI #2969 / run `43008844732` sur ce HEAD : **success**.
- Le dossier de continuité est la seule modification prévue pour ce lot ; aucun changement applicatif n'est justifié tant que la source d'événements n'est pas disponible au runtime.

### Vérification PostgreSQL en lecture seule
- La table `auth.audit_log_entries` existe et expose les colonnes `instance_id`, `id`, `payload`, `created_at` et `ip_address`.
- Comptage effectué directement sur la table : **0 ligne** au moment de la vérification.
- Inventaire des privilèges : les droits SELECT/INSERT/UPDATE/DELETE relevés appartiennent au rôle `postgres`. Aucun droit n'a été relevé pour `anon` ou `authenticated`.
- En parallèle, le flux externe unifié a déjà montré des événements Auth réels sur une fenêtre de 24 heures. La table PostgreSQL vide ne signifie donc pas qu'il n'y a eu aucune connexion ; elle indique seulement qu'aucun événement n'est actuellement disponible dans cette table.
- Le réglage du tableau de bord qui contrôle l'écriture des journaux Auth dans PostgreSQL n'a pas été modifié ni confirmé dans ce lot.

### Documentation et décision technique
- La documentation officielle « Auth Audit Logs » décrit les événements suivis et la possibilité de conserver les entrées dans `auth.audit_log_entries`, tout en conservant un stockage externe consultable depuis le tableau de bord : https://supabase.com/docs/guides/auth/audit-logs
- La lecture de cette table n'est pas une voie applicative prête à l'emploi : aucun droit navigateur n'existe et il ne faut pas en ajouter pour contourner le problème.
- La validation JWT par `GET /auth/v1/user` établit l'identité d'une session, mais ne fournit pas les événements historiques Auth.
- Le flux externe unifié observé via l'outil d'exploitation n'est pas une API applicative accessible directement au Worker. L'API Management correspondante requiert un jeton administratif ; aucun jeton de ce type ne sera placé dans le navigateur, le dépôt ou un secret Worker sans décision de sécurité et autorisation explicites.
- Conclusion : aucun endpoint d'historique, rapport périodique, faux résultat vide, stockage, RPC ou planificateur n'est ajouté. La fonctionnalité reste indisponible côté application jusqu'à la validation d'une source de données runtime alimentée et d'un accès serveur de moindre privilège.

### Périmètre
- Requêtes SQL strictement en lecture seule ; documentation officielle consultée.
- Aucun réglage Auth/Audit Logs, privilège, table, vue, RPC, migration, politique RLS, secret, fonction Edge, Worker, Cron, SMTP ou fournisseur d'e-mail modifié.
- Aucun e-mail envoyé, coût engagé, déploiement, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.


## Lot 277 — audit des journaux applicatifs existants — 11 novembre 2026

### Inventaire des tables candidates (lecture seule)
- Inventaire des noms/colonnes des schémas `public` et `auth` : les seules tables pertinentes détectées sont `auth.audit_log_entries`, `auth.sessions`, `public.audit_logs` et `public.msg_log`. Aucun journal applicatif dédié aux connexions/activités des élèves n'a été identifié.
- `public.audit_logs` contient les opérations administratives : agrégats observés par action/type = statuts de paiement (6), affectations d'agents (6), publication d'accords (3), acceptations d'accords (2), révocation d'affectation (1), changement de rôle (1). Ces données ne constituent pas un historique de connexions étudiantes.
- RLS est activé sur `public.audit_logs`. Sa politique SELECT autorise la lecture par l'acteur concerné ou par certains administrateurs selon leur périmètre territorial. Le rôle `authenticated` ne possède que SELECT sur cette table ; aucune insertion directe n'est accordée à ce rôle.
- La fonction `public.audit_log(action, cible_type, cible_id, avant, apres, wilaya)` est SECURITY DEFINER et insère avec `auth.uid()`, mais l'inventaire des privilèges indique qu'elle n'est pas exécutable par `anon` ni `authenticated`. Elle ne constitue donc pas une API de journalisation utilisateur réutilisable.
- `public.msg_log` est un journal de modération/messages. Sa politique SELECT est limitée aux modérateurs ; il ne doit pas être détourné en journal de sécurité ou d'activité générale.
- `auth.sessions` contient des métadonnées de sessions (dates, user-agent, IP, expiration, etc.), mais les privilèges relevés ne donnent l'accès qu'à `postgres`. Cette table décrit les sessions Auth, pas un historique applicatif durable des actions, et n'est pas exposée au Worker.
- `auth.audit_log_entries` demeure vide (0 ligne au contrôle précédent) et non accessible aux rôles navigateur.

### Conséquence pour la solution « accès observés par le Worker »
- Le Worker `src/site-worker.js` ne comporte toujours qu'un handler `fetch` pour les actifs et la garde des contenus protégés ; `wrangler.toml` ne déclare que le binding `ASSETS`.
- Aucun stockage durable de type KV/D1/Analytics Engine n'est configuré dans le dépôt. Les journaux d'observabilité Cloudflare ne sont pas une table de données applicative consultable par l'élève.
- Instrumenter une route de ping ou compter les requêtes dans le Worker sans stockage durable ne fournirait pas un historique fiable ; enregistrer les identifiants et user-agents dans des logs généraux exposerait inutilement des données personnelles.
- Un véritable journal d'accès applicatif nécessite un stockage dédié, une politique de rétention, un schéma d'événements minimal, une identité validée côté serveur et un mécanisme d'écriture avec privilèges restreints. Ce serait une évolution de schéma/infra et doit faire l'objet d'une autorisation distincte avant toute mise en œuvre.
- Les événements « ouverture de page », « activité récente », « connexion Auth » et « session active » devront rester des catégories distinctes. Un simple appel au Worker ne prouve pas une connexion Auth ; un user-agent ne prouve pas un appareil unique ; une session active ne reconstitue pas l'historique.

### Décision
- Ne pas réutiliser `audit_logs`, `msg_log` ou `auth.sessions` pour fabriquer un historique étudiant.
- Ne pas ajouter de route de suivi qui prétendrait produire des rapports durables sans stockage.
- Prochaine décision d'architecture, avant toute modification : autoriser ou non un stockage dédié sans coût additionnel, puis définir la source d'identité, les événements minimaux, la durée de conservation et le contrôle d'accès. Aucune solution payante ni aucun service externe n'est présumé acceptable.

### Périmètre
- Introspection SQL et lecture du Worker/Wrangler uniquement.
- Aucun enregistrement créé, aucune donnée utilisateur consultée individuellement, aucun privilège, table, vue, RPC, migration, RLS, secret ou binding modifié.
- Aucun déploiement, e-mail, coût, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.


## Lot 278 — comparaison des stockages pour les rapports de sécurité — 11 novembre 2026

### État vérifié avant décision
- PR #17 : ouverte, non fusionnée ; HEAD avant ce lot : `cea140e8cbe51eb2dd534e6b28cee8b98896f403`.
- CI du HEAD précédent : run #2971 / workflow #43009399444, **success**.
- `wrangler.toml` relu sur la branche : seul binding déclaré = `ASSETS`. Aucun binding KV, D1, Durable Object ou Analytics Engine, aucune tâche Cron.
- Le dossier des lots 276–277 établit qu'aucune table applicative existante ne convient et qu'aucun accès runtime aux journaux Auth externes n'est configuré.

### Comparaison des options

| Option | Avantages | Limites et risques | Décision |
|---|---|---|---|
| Table dédiée dans Supabase Postgres | SQL relationnel, filtres par utilisateur, pagination et rétention explicites ; réutilise le projet déjà connecté | Migration, grants, RLS et tests nécessaires ; l'écriture doit être exclusivement serveur pour éviter les événements falsifiés ; quotas du projet à vérifier avant toute charge | **Option privilégiée à étudier**, sans l'implémenter dans ce lot |
| Cloudflare D1 | Stockage SQL proche du Worker, adapté à des événements datés et indexés | Nouvelle ressource, binding, migrations et contrôle d'accès à créer ; quotas/offre et éventuels coûts à vérifier dans le compte | Alternative, non retenue à ce stade |
| Cloudflare KV | Simple stockage clé/valeur | Pas adapté aux requêtes chronologiques, filtres multi-critères et pagination d'un journal ; index et cohérence à gérer séparément | Rejeté pour l'historique d'audit |
| Analytics Engine / logs d'observabilité | Utile pour métriques agrégées et diagnostic technique | Pas conçu comme registre transactionnel individuel garantissant un historique consultable et exportable par élève ; disponibilité et quotas à confirmer | Ne pas utiliser comme source officielle du rapport individuel |
| API Management des logs Supabase | Donne accès aux journaux Auth externes déjà observés | Jeton administratif requis, fenêtres de requête limitées, secret à protéger et filtrage strict côté serveur ; risque disproportionné pour une fonctionnalité élève | Non retenue |
| `auth.sessions` / tables existantes | Déjà présentes | Accès non disponible au Worker et sémantique différente d'un historique ; aucune table existante ne représente les connexions et actions de l'élève | Rejeté |

### Architecture cible proposée (non implémentée)
1. **Séparer les catégories d'événements.** Un événement de connexion Auth doit provenir d'une source Auth fiable ; une requête authentifiée vers un endpoint pédagogique peut seulement prouver un accès à cet endpoint ; une ouverture de page côté navigateur est une télémétrie déclarative et ne doit pas être présentée comme une preuve de connexion.
2. **Valider l'identité côté serveur.** Le serveur valide le Bearer auprès de Supabase Auth et dérive l'UUID du compte de la réponse Auth. Il ignore tout identifiant, rôle, adresse ou destinataire transmis dans le corps HTTP.
3. **Écrire côté serveur uniquement.** Une Edge Function ou un endpoint Worker authentifié reçoit les événements autorisés et effectue une insertion contrôlée dans une table dédiée. Aucun secret administratif ou `service_role` ne doit être envoyé au navigateur, inclus dans le dépôt ou exposé dans une réponse. Toute clé serveur éventuelle reste dans le gestionnaire de secrets et ses privilèges doivent être réduits au strict nécessaire.
4. **Protéger la lecture.** RLS propriétaire, filtrage obligatoire sur l'identité validée, pagination bornée, période maximale, `Cache-Control: no-store`, limitation de fréquence et absence d'accès inter-élèves. Les administrateurs ne voient que les données explicitement autorisées par leur rôle et périmètre.
5. **Minimiser et expirer.** Enregistrer uniquement type d'événement, compte, horodatage serveur, résultat et métadonnées techniques strictement nécessaires. Définir une durée de conservation et une purge avant d'activer la collecte. Ne pas collecter de géolocalisation ni d'empreinte d'appareil.
6. **Ne pas confondre les rapports et leur envoi.** Le stockage d'événements, les préférences, l'historique des rapports, le planificateur et le fournisseur e-mail sont des composants distincts. Aucun envoi périodique ne doit être annoncé avant validation de chacun.

### Recommandation
- Pour limiter la multiplication des services, étudier en premier une table dédiée Supabase Postgres et une écriture serveur contrôlée, avec lecture strictement propriétaire via RLS.
- Cette recommandation ne signifie pas que la fonction est prête : elle nécessite une migration, des politiques et privilèges, une fonction serveur, des tests d'accès négatifs (autre élève, jeton invalide, mode démo, rôle non autorisé), une stratégie de rétention et la vérification des quotas actuels.
- Les événements de connexion Auth ne doivent pas être inventés à partir d'un appel Worker. Tant qu'une source Auth exploitable au runtime n'est pas validée, le rapport doit indiquer clairement que l'historique de connexions Auth n'est pas disponible plutôt que d'afficher zéro.
- Aucune ressource Cloudflare/Supabase ne doit être créée sur la seule base de cette comparaison. Aucun service payant, branche de test ou dépassement de quota n'est présumé autorisé.

### Décisions et périmètre de ce lot
- Analyse documentaire et lecture seule de `wrangler.toml` ; aucun code applicatif, SQL ou configuration distante modifié.
- Aucune table, migration, vue, RPC, politique RLS, binding, ressource D1/KV, Cron, secret, fournisseur e-mail, réglage Auth ou journalisation activé.
- Aucun rapport fictif, e-mail, déploiement, coût, fusion, nouvelle branche ou modification de `main`.
- PR #17 reste ouverte et non fusionnée. Toute mise en œuvre d'un stockage dédié exige une autorisation explicite préalable.


## Lot 279 — spécification minimale du journal de sécurité — 11 novembre 2026

### Objectif et séparation des preuves
Le journal doit permettre à l'élève de consulter les événements réellement observés, sans transformer une interaction déclarée par le navigateur en preuve d'authentification.
- `auth_login_success` : uniquement si l'événement provient d'une source Auth de confiance et que son ingestion serveur est opérationnelle.
- `worker_endpoint_access` : uniquement lorsqu'un endpoint Worker protégé a validé le Bearer et exécuté l'opération.
- `report_generated` et `report_email_sent` : uniquement après confirmation de l'opération côté serveur / fournisseur ; une demande ou une tentative échouée n'est pas un envoi réussi.
- `client_page_view` : événement déclaratif non probant, désactivé par défaut et toujours affiché séparément des connexions Auth. Il n'est pas requis pour le premier périmètre.

### Schéma logique proposé (pas de SQL exécuté)
Table candidate : `private.security_events` dans un schéma non exposé par la Data API.

| Champ | Type logique | Règle |
|---|---|---|
| `id` | UUID | Clé primaire générée côté serveur |
| `actor_id` | UUID | Compte concerné, dérivé de l'identité validée côté serveur ; jamais accepté depuis le corps client |
| `event_type` | texte contrôlé / CHECK | Liste blanche des événements autorisés |
| `source` | texte contrôlé | `auth_ingest`, `worker` ou `report_service` ; jamais librement défini par le navigateur |
| `occurred_at` | timestamptz | Horodatage serveur UTC, non modifiable par le client |
| `outcome` | texte contrôlé | `success` ou `failure` selon les événements où cela s'applique |
| `request_id` | UUID nullable | Corrélation technique sans jeton ni donnée personnelle |
| `details` | JSONB | Objet réduit à une liste blanche de propriétés non sensibles ; taille maximale à imposer |
| `source_event_id` | texte nullable | Identifiant d'événement source pour déduplication ; index unique partiel si une source fiable le fournit |

### Index et contraintes
- Index B-tree `(actor_id, occurred_at DESC, id DESC)` pour l'historique personnel paginé.
- Index unique partiel sur `(source, source_event_id)` lorsque `source_event_id` n'est pas NULL, afin de rendre l'ingestion idempotente.
- CHECK sur `event_type`, `source`, `outcome` et la forme/longueur de `details` ; aucun champ libre permettant de stocker des jetons, mots de passe, codes, adresses e-mail ou contenus de messages.
- `occurred_at` est défini par la base ou le service de confiance ; aucune date arbitraire envoyée par le navigateur.
- La clé étrangère vers `auth.users` et le comportement de suppression du compte doivent être décidés avec la politique de conservation et de suppression des données avant migration ; ne pas choisir silencieusement CASCADE ou SET NULL.

### Accès et frontière de confiance
- Schéma `private` non exposé par la Data API ; aucun GRANT direct à `anon` ou `authenticated` sur la table.
- Les insertions sont réservées au service serveur qui a validé l'événement et l'identité. Ne pas ouvrir une politique INSERT générale `actor_id = auth.uid()` pour ce journal : un client authentifié pourrait appeler directement l'API et fabriquer des événements.
- Les lectures passent par un endpoint serveur authentifié qui valide le jeton, prend `actor_id` depuis la réponse Auth et applique ce filtre côté serveur. Aucun `actor_id` fourni par le client n'est utilisé.
- Ne pas créer de fonction `SECURITY DEFINER` dans un schéma exposé. Si une fonction privilégiée est finalement nécessaire, la placer dans un schéma non exposé, fixer `search_path`, valider l'identité et les paramètres, révoquer les privilèges par défaut et n'accorder EXECUTE qu'au rôle serveur nécessaire. Préférer une exécution invoker lorsque cela permet le même contrôle.
- Un secret serveur ne doit jamais être inclus dans le JavaScript, les réponses HTTP, les commits ou les journaux. Une clé `service_role` est très privilégiée ; son usage éventuel doit être strictement serveur, documenté et évalué séparément, pas considéré comme un mécanisme de moindre privilège.
- La lecture d'un élève est limitée à son compte. Toute lecture administrative éventuelle est un besoin séparé, autorisé par rôle et périmètre ; elle n'est pas implicite dans ce schéma.

### Rétention et minimisation
- Valeur initiale proposée à arbitrer avant activation : conserver les événements individuels 90 jours, puis purge automatisée ; aucun archivage illimité.
- Pas d'adresse IP, géolocalisation, empreinte d'appareil, user-agent complet, email, contenu de requête, jeton ou secret dans la première version.
- Si une métadonnée technique devient indispensable, documenter sa finalité, sa durée et son accès avant collecte.
- Pagination par curseur `(occurred_at, id)`, limite de page courte (par exemple 50), période de recherche bornée et réponses `Cache-Control: no-store`.
- Les événements absents de la source ne doivent jamais être représentés par « aucune connexion » ; l'interface doit distinguer « aucun événement trouvé » de « source indisponible / historique non collecté ».

### Tests de sécurité obligatoires avant toute mise en service
1. Jeton absent, mal formé, expiré ou révoqué : refus sans écriture.
2. Mode démo / session locale : refus sans écriture.
3. Élève A tente de lire l'UUID de B : aucune donnée de B retournée.
4. Élève tente d'insérer directement un événement ou de modifier `actor_id`, `occurred_at`, `source` ou `event_type` : refus.
5. Rejeu du même événement source : une seule ligne conservée.
6. Paramètres de pagination, période et JSONB trop grands / invalides : rejet.
7. Compte supprimé, purge de rétention et panne de source : comportement explicite, sans divulgation ni fabrication d'historique.
8. Vérifier les grants effectifs, RLS, schémas exposés, fonctions et vues ; tests négatifs avec rôles anon/authenticated et contrôle de régression des fonctions privilégiées.

### Hors périmètre et décisions encore nécessaires
- Ce schéma ne rend pas les journaux Auth externes accessibles au Worker. Un mécanisme fiable d'ingestion `auth_login_success` reste à choisir et à valider séparément.
- Le schéma ne crée ni préférences de rapport, ni planificateur, ni historique d'envoi, ni fournisseur e-mail. Ces composants auront leurs propres spécifications et autorisations.
- La durée de 90 jours est une proposition technique à confirmer, pas une politique déjà adoptée.
- Avant migration : valider quotas/ressources actuels, choix du composant serveur, stratégie de suppression de compte, rétention, coûts éventuels et tests sur environnement autorisé.

### Périmètre du lot
- Spécification documentaire uniquement ; correction d'une coquille de balisage dans l'entrée du Lot 278.
- Aucun fichier SQL ou migration ajouté ; aucun SQL exécuté ; aucune table, fonction, vue, politique RLS, grant ou donnée modifié.
- Aucun secret, réglage Auth, binding, ressource Cloudflare, Cron, SMTP, fournisseur e-mail ou service payant ajouté.
- Aucun déploiement, e-mail, coût, fusion, nouvelle branche ou modification de `main`. PR #17 reste ouverte et non fusionnée.


## Lot 280 — source fiable des événements de session Auth — 11 novembre 2026

### Vérifications réalisées
- PR #17 avant le lot : ouverte, non fusionnée ; HEAD `87ce2d61d3c6c59a32361ee4bca955ce01db8ae5`.
- Documentation officielle Supabase relue via la recherche documentaire :
  - Auth Audit Logs : `https://supabase.com/docs/guides/auth/audit-logs`
  - Auth Hooks : `https://supabase.com/docs/guides/auth/auth-hooks`
  - Custom Access Token Hook : `https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook`
  - Password Verification Hook : `https://supabase.com/docs/guides/auth/auth-hooks/password-verification-hook`
  - Sessions : `https://supabase.com/docs/guides/auth/sessions`
  - Management API logs : `https://supabase.com/docs/reference/api/v1-get-project-logs`
  - Log Drains : `https://supabase.com/docs/guides/platform/manage-your-usage/log-drains`
- La documentation Auth Hooks indique que le Custom Access Token Hook est disponible sur Free et Pro ; il est appelé avant l'émission d'un JWT et reçoit `user_id`, `claims` et `authentication_method`. La liste documentée comprend notamment `password`, `otp`, `totp`, `magiclink`, `recovery`, `invite`, `sso/saml`, `oauth_provider/authorization_code`, `email/signup`, `anonymous` et `token_refresh`.
- La documentation Sessions confirme que `session_id` identifie une session et reste le même lors des renouvellements de jeton.
- Inventaire SQL en lecture seule des fonctions : aucune fonction nommée selon les motifs `custom_access_token` ou `login_event` n'a été trouvée. Cela ne prouve pas à lui seul l'absence d'un HTTP Hook configuré ; le réglage Auth Hooks distant n'a pas été modifié et sa configuration complète n'a pas été inspectée.
- Consultation du flux unifié `auth_audit_logs` : 37 événements observés dans le résultat disponible, dont 23 `login`, 7 `token_refreshed` et 7 `token_revoked`. Le dernier événement `login` observé date du 10 novembre 2026 à 22:39:34 UTC. Ces résultats proviennent de l'outil d'observabilité, pas d'une API accessible au Worker.
- `auth.audit_log_entries` était vide (0 ligne lors du contrôle précédent). La table n'est pas accessible aux rôles navigateur. La documentation décrit la conservation PostgreSQL et externe ; aucun réglage de stockage n'a été modifié.

### Découverte : Custom Access Token Hook
- C'est la meilleure piste native pour enregistrer un événement au moment où Supabase Auth prépare l'émission d'un jeton, sans consulter les journaux externes ni utiliser de Personal Access Token Management API.
- Le hook reçoit le `user_id` et le `session_id` des claims côté Auth, ainsi que `authentication_method`. Il permet donc de distinguer une authentification qui ouvre une session d'un renouvellement `token_refresh`.
- Architecture proposée : une fonction Postgres hook, appelée par Supabase Auth, écrit une ligne dans `private.security_events` avec `actor_id = user_id`, `source = 'auth_token_hook'`, `source_event_id = session_id`, horodatage serveur et méthode d'authentification limitée à une liste blanche. Une contrainte unique sur `(source, source_event_id)` empêche qu'un renouvellement crée une nouvelle ligne pour la même session.
- Enregistrer l'événement sous le nom sémantique `auth_session_started` / « session Auth ouverte », pas comme preuve d'une activité continue ni comme inventaire d'appareils. Le hook s'exécute avant l'émission du JWT ; le rapport doit donc refléter cette frontière technique et ne pas prétendre mesurer l'utilisation réelle après connexion.
- Traiter `token_refresh` comme renouvellement et ne pas le compter comme nouvelle connexion. Traiter `email/signup` comme création de compte, et `anonymous` séparément ou l'exclure du rapport élève. Les autres méthodes reconnues sont conservées comme attribut `authentication_method` contrôlé, sans exposer le jeton.
- L'événement n'est fiable que si le hook est effectivement configuré, sa fonction est exécutée avec les permissions attendues et les tests démontrent que les erreurs/échecs d'émission ne produisent pas de fausse entrée. Le comportement de transaction et l'ordre exact des opérations doivent être vérifiés dans un test autorisé avant production.

### Permissions et sécurité prévues
- Préférer un hook Postgres plutôt qu'un HTTP Hook afin de ne pas introduire de secret de webhook, de service externe ou d'appel réseau.
- Fonction dans un schéma non exposé, par exemple `private`, avec `search_path` fixé et validation stricte des propriétés d'entrée.
- Accorder uniquement `USAGE` sur le schéma et `EXECUTE` sur la fonction au rôle `supabase_auth_admin`, et uniquement le droit INSERT requis sur la table. Révoquer l'accès de `anon`, `authenticated` et `PUBLIC` à la fonction et à la table selon le modèle retenu.
- Ne pas utiliser `SECURITY DEFINER` par commodité. Préférer une fonction invoker avec privilèges explicites au rôle Auth ; toute exception doit être justifiée et auditée.
- Aucun `service_role`, clé secrète ou jeton Management API n'est nécessaire pour cette voie Postgres Hook.
- La lecture par l'élève reste une opération séparée, protégée par l'endpoint/RPC de lecture défini au Lot 279 et un filtrage propriétaire strict.

### Limites identifiées
- Le hook ne fournit pas un flux complet de tentatives de connexion échouées. Le Password Verification Hook documenté reçoit `user_id` et `valid`, mais il est indiqué comme disponible uniquement sur Team et Enterprise ; il est donc exclu de la solution sans coût supplémentaire.
- Le Custom Access Token Hook ne remplace pas les journaux Auth complets de Supabase et ne fournit pas à lui seul les événements de révocation, de logout, d'échec de connexion ou de sécurité de compte.
- L'API Management des logs reste administrative, limitée à des fenêtres d'au plus 24 heures, et peut répondre `402 Usage exceeded`. Elle n'est pas retenue comme API de production pour les élèves.
- Les Log Drains sont réservés aux plans Pro, Team et Enterprise et sont facturés en supplément selon la documentation d'usage ; ils sont exclus du périmètre.
- Aucun historique antérieur ne peut être reconstitué depuis le hook : les événements ne commenceront qu'après son activation. Le rapport devra afficher clairement la date de début de collecte.

### Recommandation / suite
- Retenir le Custom Access Token Hook Postgres comme source primaire future des ouvertures de sessions Auth, sous réserve de validation sur environnement autorisé.
- Avant toute mise en œuvre, il faudra obtenir l'autorisation explicite pour : migration de la table, création de la fonction, grants minimaux et activation du hook dans Authentication > Hooks. Ces opérations changent le schéma et la configuration Auth du projet actif ; elles ne sont pas exécutées dans ce lot.
- Tests à préparer : méthodes de connexion autorisées, renouvellement répété du même `session_id`, signup, session anonyme, jeton invalide, panne/exception du hook, unicité, insertion et lecture propriétaire. Aucun test de connexion utilisateur n'a été déclenché pour ce lot.

### Périmètre
- Recherche documentaire Supabase, inventaire de fonctions en lecture seule et consultation agrégée des journaux Auth.
- Aucun hook créé ou activé ; aucune fonction, table, migration, vue, politique RLS, grant, secret, paramètre Auth ou configuration SMTP modifié.
- Aucun e-mail, déploiement, nouvelle ressource, coût, fusion, nouvelle branche ou modification de `main`.
- PR #17 reste ouverte et non fusionnée.


## Lot 281 — architecture opérationnelle des rapports périodiques — 11 novembre 2026

### Réconciliation avec les demandes et prototypes transmis
Le périmètre fonctionnel consolidé comprend :
- Centre de sécurité à cinq onglets : aperçu, connexions, activités, appareils, confidentialité.
- Rapports périodiques quotidiens, hebdomadaires et mensuels ; jour/heure personnalisables.
- Valeur initiale : lundi 09:00, fuseau `Africa/Algiers`.
- Six rubriques configurables : historique des connexions, alertes de sécurité, appareils actifs, niveau/score de sécurité, localisation, recommandations.
- Aperçu HTML trilingue (arabe/français/anglais), historique des rapports, export et test d'envoi réel.
- Alertes immédiates uniquement si une règle de détection réelle et vérifiable déclenche l'événement.
- Adresse e-mail Auth confirmée par défaut ; adresse alternative uniquement après vérification.
- Aucune statistique, alerte, localisation, appareil, score, rapport envoyé ou état « ouvert/livré » fictif. Les anciennes mentions MFA et la colonne « méthode 2FA » ne font pas partie de ce périmètre.

### Vérification de l'état actuel du dépôt
- PR #17 : ouverte, non fusionnée, mergeable ; HEAD observé : `8d796d24cd0de6910cf2e686b7a40e5191b535e2`.
- Le dossier de continuité lu sur ce HEAD contient les Lots 279 et 280 ; cette mise à jour constitue le Lot 281.
- `wrangler.toml` contient actuellement uniquement le binding statique `ASSETS`, sans section `[triggers] / crons`.
- `src/site-worker.js` ne contient qu'un handler `fetch`, sans `scheduled()`, endpoint de rapports, gestion de préférences ou traitement d'e-mails.
- Aucun `supabase/config.toml` n'a été trouvé à la racine attendue du dépôt.
- Le run CI associé au HEAD vérifié (run #2974 / ID `43010490504`) est terminé avec conclusion `success`. Cette validation ne prouve pas le fonctionnement d'un système de rapports, qui n'est pas encore implémenté.

### Architecture recommandée — un seul planificateur Cloudflare, traitement serveur
1. Le navigateur gère uniquement l'interface et appelle un endpoint authentifié pour lire/modifier les préférences du compte courant. Il ne fournit jamais `user_id`, destinataire arbitraire, date d'envoi ou résultat d'envoi comme autorité.
2. Une table privée dédiée stocke les préférences, le fuseau, les rubriques, l'adresse destinataire vérifiée, l'état d'activation, la prochaine échéance et l'historique des envois. Les tables `login_history`, `security_events` et `user_devices` n'existent pas dans l'état audité ; elles ne doivent pas être supposées présentes.
3. Un unique Cron Trigger Cloudflare périodique (proposition : toutes les 15 minutes) appelle le traitement serveur. Le traitement sélectionne un petit lot d'envois échus, calcule les échéances dans le fuseau IANA de chaque compte, réserve atomiquement chaque période et évite les doubles envois.
4. Un endpoint serveur protégé produit le rapport à partir des seules sources disponibles, puis appelle le fournisseur d'e-mail. L'identité du compte, les données, l'adresse et l'échéance sont revalidées côté serveur.
5. L'historique conserve séparément les états `queued`, `sent`, `delivered`, `bounced` et `failed` lorsque ces états sont réellement connus. Une réponse HTTP positive du fournisseur ne doit pas être décrite comme une livraison confirmée ; la livraison nécessite un webhook fournisseur vérifié.
6. Les événements immédiats passent par la même chaîne serveur et la même idempotence ; aucune alerte n'est émise sur la base d'une règle de détection simulée.

### Pourquoi un Cron unique toutes les 15 minutes
- Cloudflare Cron Triggers exécutent le handler `scheduled()` et utilisent UTC ; les échéances des utilisateurs doivent donc être calculées à partir du fuseau IANA enregistré, et non codées en dur dans une expression Cron.
- L'heure locale de référence lundi 09:00 à Sétif/Alger (`Africa/Algiers`, UTC+1 à la date de l'audit) correspond à lundi 08:00 UTC. Le calcul doit toujours utiliser le fuseau et la date locale, pour rester correct si les règles de fuseau changent.
- Un seul Cron périodique est préférable à un Cron par utilisateur ou fréquence : les préférences quotidiennes, hebdomadaires, mensuelles et personnalisées sont évaluées en base.
- Limites Cloudflare vérifiées dans la documentation au 11 novembre 2026 : cinq Cron Triggers par compte Workers Free, 100 000 requêtes quotidiennes, CPU de 10 ms par invocation Cron sur Free et durée murale maximale de 15 minutes par invocation. Le traitement doit donc rester borné, paginé et idempotent ; le quota et le compte Cloudflare réel doivent être vérifiés avant activation.
- Le Cron Trigger et le handler `scheduled()` n'existent pas encore dans ce dépôt. Ajouter leur configuration activerait une tâche planifiée après déploiement ; aucun déclencheur n'est ajouté dans ce lot.

### Fournisseur d'e-mail et blocage de domaine
- Resend reste le fournisseur envisagé, sous réserve de la disponibilité réelle du compte et de la clé API côté serveur.
- Pour envoyer aux adresses des élèves depuis une identité institutionnelle, le domaine expéditeur doit être possédé et vérifié, avec les enregistrements DNS SPF/DKIM requis. L'adresse Gmail personnelle `coordination34000@gmail.com` n'est pas un domaine d'envoi institutionnel vérifié.
- Le domaine de test Resend `onboarding@resend.dev` est réservé aux essais contrôlés vers l'adresse du propriétaire du compte ; il ne permet pas de lancer une campagne vers tous les élèves.
- Tant qu'aucun domaine d'envoi n'est vérifié, le système peut préparer les préférences, générer un aperçu local et exécuter les tests de logique, mais il ne doit pas annoncer l'envoi aux étudiants comme disponible.
- Aucun prix ou quota gratuit n'est garanti dans cette spécification ; les conditions du fournisseur doivent être relues au moment de l'activation. Aucun achat ou abonnement n'est autorisé par ce lot.

### Correction importante apportée à la piste du Lot 280
- Le Custom Access Token Hook reçoit bien `user_id`, `claims.session_id` et `authentication_method`, notamment `token_refresh`. Cependant, il s'exécute avant l'émission du jeton, dans le flux critique d'authentification. La documentation Supabase précise que les erreurs d'un Postgres Hook sont propagées à Auth et ne sont pas réessayées.
- En conséquence, ce hook ne doit pas être adopté automatiquement comme mécanisme principal de journalisation : une panne de journalisation pourrait compromettre l'émission du jeton. Son éventuel usage pour enregistrer les ouvertures de session reste conditionné à un test de disponibilité, de transaction et de comportement en cas d'erreur, et à une décision explicite.
- Une autre piste native à évaluer avant activation est le stockage PostgreSQL des Auth Audit Logs dans `auth.audit_log_entries`, actuellement vide au contrôle précédent et non accessible directement aux rôles navigateur. L'activation du stockage et l'exposition d'une lecture limitée demanderaient une modification de configuration Auth et une interface serveur privée ; aucune n'est effectuée ici.
- Les sessions, les journaux Auth, les événements applicatifs et les rapports e-mail restent des sources distinctes. Le rapport doit indiquer explicitement les catégories non collectées plutôt que de les remplacer par zéro.

### Sécurité du traitement périodique
- Pas de `verify_jwt = false` sans authentification de service alternative robuste. Le déclencheur serveur doit utiliser une authentification inter-service forte, avec secret uniquement côté serveur, rotation et limitation d'accès.
- Aucun service_role, Resend API key ou secret de déclencheur dans le navigateur, les réponses, les logs ou le dépôt. Tout accès privilégié reste côté serveur et strictement limité au traitement requis.
- Réservation atomique des échéances, clé d'idempotence par compte/période/type, reprise contrôlée après panne, limites de lots, rate limit et journalisation minimale.
- Préférences : contrôle de propriété `auth.uid()` à la lecture et à l'écriture, validation des champs et `WITH CHECK` sur les changements de propriétaire ; adresse alternative vérifiée séparément.
- Le « test d'envoi » n'utilise que le compte connecté et un destinataire vérifié ; résultat affiché selon la réponse réelle du fournisseur.
- Les taux d'ouverture sont désactivés par défaut pour les rapports sensibles ; un pixel d'ouverture n'est ni une preuve de lecture ni un état de sécurité fiable.
- Le score de sécurité n'est pas affiché tant qu'une formule explicite, auditable et alimentée par des événements réels n'a pas été approuvée.

### Ordre de réalisation proposé
A. Spécification/migration des préférences et de l'historique, avec RLS et tests négatifs.
B. Source réelle des événements de connexion et des activités ; préciser les limites et la date de début de collecte.
C. Générateur de rapport trilingue, avec aperçus et tests sans envoi.
D. Endpoint serveur d'envoi avec destinataire confirmé, idempotence, journal d'état et tests de sécurité.
E. Handler Cron et déclencheur Cloudflare ajoutés seulement après tests locaux et autorisation distincte de déploiement.
F. Activation de l'envoi aux élèves seulement après vérification du domaine expéditeur et confirmation du fournisseur.

### Périmètre et autorisations
- Lot documentaire uniquement : aucune page intégrée, table, migration, fonction, hook, politique RLS, grant, secret, configuration Auth, binding, Cron Trigger ou fournisseur n'a été créé ou activé.
- Aucun e-mail envoyé, aucun test fournisseur, aucun déploiement Cloudflare/Supabase, aucune dépense, aucune fusion, aucune nouvelle branche et aucune modification de `main`.
- PR #17 reste ouverte et non fusionnée. Les étapes A à F devront être développées et vérifiées séparément ; toute opération distante ou activation planifiée nécessitera une autorisation explicite.


### Lot 282 — brouillon SQL prudent du Custom Access Token Hook — 11 novembre 2026

#### Vérification documentaire
- La documentation officielle Supabase confirme que le hook reçoit `user_id`, `claims.session_id` et `authentication_method`, avec notamment la valeur `token_refresh`.
- Le hook s'exécute avant l'émission du jeton. Il ne constitue donc pas, à lui seul, une preuve que le client a effectivement reçu le jeton ou terminé l'ouverture de l'application.
- Le hook fait partie du chemin critique d'authentification. Le brouillon ci-dessous isole les erreurs d'insertion (fail-open) pour que l'indisponibilité du journal ne bloque pas les connexions ; cette tolérance implique que l'historique puisse être incomplet.

#### Artefact créé dans la PR
- Nouveau fichier documentaire : `docs/security/LOT-282-custom-access-token-hook-draft.sql`.
- Le brouillon prévoit un schéma privé, une table inaccessible aux rôles navigateur, un enregistrement minimal sans jeton/e-mail/IP/user-agent, une déduplication par `session_id`, l'exclusion des renouvellements `token_refresh` et le retour des claims d'origine.
- Le type d'événement est volontairement nommé `auth_token_preissue` et non `auth_login_success` : la nuance reflète exactement ce que le hook permet d'observer.
- La fonction est conçue pour n'être exécutable que par `supabase_auth_admin`, avec `SECURITY DEFINER`, `search_path` vide et noms de schéma qualifiés. Cette configuration reste à valider sur un projet de test avant toute activation.
- Le fichier se termine par `ROLLBACK` : même exécuté tel quel, il ne conserve aucun changement. Il s'agit d'un support de revue, pas d'une migration exécutable de mise en service.

#### Tests obligatoires avant toute adoption
1. Vérifier que le tableau de bord Supabase accepte la fonction dans le schéma `public` et que le rôle d'exécution est bien `supabase_auth_admin`.
2. Vérifier l'identité concordante `event.user_id = claims.sub` et le format UUID de `session_id`.
3. Tester chaque méthode d'authentification réellement activée, puis vérifier l'exclusion de `token_refresh` et `email_change`.
4. Répéter plusieurs émissions pour une même session et confirmer une seule ligne.
5. Simuler une erreur d'insertion et vérifier que l'authentification reste fonctionnelle tout en signalant explicitement la lacune de journalisation.
6. Vérifier qu'aucun rôle `anon` ou `authenticated` ne peut lire la table ou exécuter la fonction.
7. Vérifier les cas signup, invitation et session anonyme : ils ne doivent pas être présentés comme des connexions ordinaires.
8. Vérifier le comportement en cas de suppression d'utilisateur, de session invalide et de claims mal formés.

#### Limites non résolues
- Le hook ne journalise pas les tentatives échouées avant son invocation.
- Il ne prouve pas la réception du jeton par le navigateur ; l'événement doit rester nommé et présenté comme un passage du hook avant émission.
- Le mécanisme ne fournit aucun historique rétroactif.
- Le brouillon n'ajoute pas encore de lecture élève, de rapport, de purge automatique ni de planificateur.
- L'adoption nécessite un projet de test isolé et une autorisation distincte pour la table, la fonction, les privilèges et l'activation du hook.

#### État et périmètre
- Commit du brouillon SQL : `d727155aba8c4d2dcb814f4ead92ce6c0f5672bb`.
- Dossier de continuité mis à jour dans ce lot.
- PR #17 maintenue ouverte et non fusionnée ; aucun changement direct sur `main`.
- Aucun SQL exécuté, aucune table/fonction/hook activé sur Supabase, aucun secret ou réglage Auth modifié, aucun e-mail, déploiement ou coût.
- CI du commit documentaire final à vérifier séparément.


#### Correction de prudence du Lot 282
- Le premier brouillon utilisait un nom générique `private.security_events`, qui aurait pu entrer en conflit avec le schéma global prévu au Lot 279. Il a été corrigé avant la clôture du lot.
- La table du brouillon porte maintenant un nom dédié : `private.security_auth_hook_events`. Elle ne prétend pas remplacer la future table générique des événements de sécurité.
- Les révocations de privilèges au niveau du schéma `private` ont été retirées afin de ne pas modifier les droits d'autres objets déjà présents dans ce schéma.
- La fonction est créée avec `CREATE FUNCTION` (et non `CREATE OR REPLACE`) afin d'échouer si une fonction homonyme existe déjà, plutôt que de la remplacer silencieusement.
- Le SQL final a été relu : table dédiée, exclusion des renouvellements, déduplication par session, bloc d'exception fail-open, privilèges de fonction restreints et `ROLLBACK` de sécurité présents.
- Le brouillon demeure non exécuté et non validé par un moteur PostgreSQL. Un contrôle de compatibilité sur une base isolée reste obligatoire.


### Lot 283 — matrice de tests négatifs du hook Auth — 11 novembre 2026

#### Artefact ajouté
- Nouveau document : `docs/security/LOT-283-auth-hook-negative-test-matrix.md`.
- Matrice de 16 scénarios : identité discordante, session absente/mal formée, renouvellements répétés, déduplication, méthodes signup/invitation, comptes anonymes, panne d'insertion, claims invalides, privilèges des rôles navigateur, minimisation des données et suppression de compte.
- Ajout des contrôles de privilèges effectifs (`has_table_privilege`, `has_schema_privilege`, `has_function_privilege`) à effectuer uniquement dans un projet isolé.
- Critères de sortie explicites : tests critiques/hauts réussis, propriétaire et permissions effectifs confirmés, traitement signup/invitation/anonyme décidé, rétention et suppression définies.
- Aucun scénario n'est déclaré réussi : il s'agit d'une matrice de tests à exécuter, pas d'un rapport de tests passés.

#### Revue technique importante
- Le rôle Auth qui exécute le hook et le propriétaire de la fonction `SECURITY DEFINER` sont deux identités distinctes. Le seul `GRANT EXECUTE` au rôle `supabase_auth_admin` ne prouve pas que l'insertion fonctionnera : il faut vérifier le propriétaire effectif de la fonction et ses droits sur la table dans un projet isolé.
- Le traitement `fail-open` préserve le parcours d'authentification si l'insertion échoue, mais peut rendre le journal incomplet. Cette limite doit être visible aux administrateurs.
- Les méthodes `email/signup`, `invite` et les comptes anonymes ne doivent pas être assimilés automatiquement à une connexion élève ordinaire. Leur classification reste une décision métier à prendre avant activation.
- Le nom d'événement reste `auth_token_preissue`, jamais `auth_login_success`, car le hook intervient avant l'émission du jeton.

#### État et périmètre
- Commit de la matrice : `2d465cc734d258af0d5edd563622ab06b306bed4`.
- Dossier de continuité complété dans ce lot.
- PR #17 reste ouverte et non fusionnée.
- Aucun test exécuté contre Supabase, aucun SQL appliqué, aucune permission distante changée, aucun hook activé, aucun secret modifié, aucun e-mail, déploiement ou coût.
- Validation CI du commit documentaire final à vérifier séparément.


### Lot 284 — prochaine séance strictement liée au niveau du compte — 11 novembre 2026

#### Constat
- La fonction `renderStudentDashboard()` construisait la liste `units` à partir du niveau de la session élève, mais obtenait la prochaine séance par `prochaineSeance()`, fonction qui dépend de l'état global `niveauActif`.
- En cas de décalage pendant la synchronisation du niveau, la carte « prochaine séance » pouvait donc afficher une unité hors de la liste filtrée utilisée par le tableau de bord.
- Le défaut concernait la cohérence entre le niveau de compte et l'action suivante ; il ne justifiait ni une modification du stockage des séances ni une modification Auth/RLS.

#### Correction intégrée dans la PR #17
- La prochaine unité est maintenant recherchée directement dans `units`, déjà filtrées selon le niveau de la session.
- La première séance non terminée est choisie à partir de `loadSeancesFor(unit.n)`, donc du suivi propre à cette unité.
- Le rendu du parcours, la carte de prochaine séance et l'action de reprise partagent désormais la même source filtrée.
- Un contrôle de régression dans `ci/check-masar.mjs` vérifie que `renderStudentDashboard()` calcule `nextUnit` depuis `units` et n'appelle plus `prochaineSeance()`.

#### Cache et contrôles
- `app.js` : version de cache incrémentée de `3566` à `3567`.
- Service Worker : version incrémentée de `dz-de-v3.185.0.0.134` à `dz-de-v3.185.0.0.135`.
- Références de cache synchronisées dans `index.html`, `sw.js`, `ci/check-masar.mjs` et `ci/check-public-portal.mjs`.
- La CI doit confirmer les assertions après ces changements ; aucune réussite n'est déclarée avant le résultat du workflow.

#### État et limites
- Correctif appliqué uniquement à la branche `design/prototypes-67-74-alignment) de la PR #17.
- Aucun changement à `main), aucune fusion, aucun déploiement.
- Aucun changement Supabase, Auth, RLS, schéma, secret, fournisseur e-mail ou paiement.
- Le rendu réel dans le navigateur sur ordinateur et mobile reste à vérifier ; les tests structurels ne remplacent pas cette revue visuelle.


#### Addendum de validation du Lot 284
- Le premier contrôle CI du nouveau garde-fou a échoué à cause d'une expression régulière mal échappée dans le test lui-même ; le diagnostic du journal confirme une erreur de syntaxe du test, pas une erreur d'exécution de `renderStudentDashboard()`.
- Les expressions du test ont été corrigées dans le commit `897b8c61ec6f12d70a994119f43916280c638fa7`.
- Une nouvelle exécution CI est attendue sur le HEAD corrigé. Le lot reste non validé jusqu'à son résultat.


#### Second diagnostic CI du Lot 284
- Après correction de la syntaxe des regex, la CI a identifié une deuxième assertion restée sur l'ancienne version Service Worker `dz-de-v3.185.0.0.134` dans `ci/check-masar.mjs`.
- Cette assertion a été alignée sur `dz-de-v3.185.0.0.135` dans le commit `7386114d4cc19a53a84570f506e0ed59f8d6b402`.
- Le test du tableau de bord doit être rejoué sur le HEAD courant ; le lot reste en attente de validation CI.


#### Validation confirmée du Lot 284 — 11 novembre 2026
- CI #2991 : réussite sur le commit de code `7386114d4cc19a53a84570f506e0ed59f8d6b402`.
- CI #2992 : réussite sur le commit documentaire `c83ef65b691e814dfe93ab018802b6e1f34a1655`.
- Le contrôle « Contrôler le tableau de bord مسارك » ainsi que les autres contrôles de la suite ont réussi sur ces exécutions.
- Cette réussite valide les contrôles automatisés ; elle ne remplace pas la vérification visuelle dans le navigateur sur ordinateur, tablette et téléphone.


### Lot 285 — inscription officielle sans création locale de secours — 11 novembre 2026

#### Constat
- Le gestionnaire `#signupForm` utilisait `authLocalMode()` ; le mode démo (`?demo=1`) ou hors ligne pouvait donc diriger l'inscription vers `AUTH.signup()` et créer un compte local.
- Ce comportement ne convient pas au parcours d'inscription officiel : un compte local de démonstration ne doit jamais être présenté comme un compte étudiant créé sur Supabase.

#### Correction dans la PR #17
- Le formulaire d'inscription exige maintenant une connexion réseau et `window.SB.signup`.
- Toute création de compte passe par `supabase.auth.signUp` via le module existant.
- Le mode démo/hors ligne reste réservé à l'exploration et à la connexion de démonstration ; il ne peut plus créer de compte depuis le formulaire officiel.
- En cas d'absence de réseau, d'indisponibilité du client Supabase ou d'erreur Auth, le formulaire affiche un message et ne crée aucun compte local.
- Si Supabase renvoie un utilisateur sans session (cas de confirmation e-mail), l'interface demande de vérifier le courrier puis de revenir se connecter ; elle ne prétend pas que le compte est connecté.
- Le contrôle CI `ci/check-public-portal.mjs` vérifie désormais que le gestionnaire d'inscription n'appelle ni `authLocalMode()` ni `AUTH.signup()`, et qu'il exige `navigator.onLine` et `window.SB.signup`.

#### Cache et périmètre
- `app.js` : cache `3568`.
- Service Worker : `dz-de-v3.185.0.0.136`.
- Références actualisées dans `index.html`, `sw.js`, `ci/check-masar.mjs` et `ci/check-public-portal.mjs`.
- Aucun changement Supabase distant, aucune modification Auth/SMTP, aucun secret ajouté, aucun e-mail envoyé, aucun compte réel créé ou testé.
- Le problème de distribution des e-mails de confirmation n'est pas résolu par cette correction : il dépend toujours de la configuration SMTP du projet et doit être validé séparément.
- PR #17 reste ouverte et non fusionnée ; aucun déploiement de production ni aucune dépense.
- Validation CI à attendre sur le HEAD du lot.


#### Validation intermédiaire et précision du libellé — Lot 285
- CI #2998 : réussite sur le commit `f6d1cccbc116415f8f80d98bf6966abb4d5dac0b`. Le contrôle du portail public et les autres vérifications de la suite ont réussi.
- Le bouton du formulaire a été renommé de « إنشاء الحساب والدخول » à « إنشاء الحساب » : la création d'un compte ne garantit pas une connexion immédiate lorsque la confirmation e-mail est requise.
- Un contrôle CI vérifie ce libellé afin d'éviter une promesse d'accès immédiat.
- Le Service Worker est passé à `dz-de-v3.185.0.0.137` ; les assertions correspondantes ont été actualisées.
- Une nouvelle CI est attendue sur le HEAD comprenant le changement de libellé et ses tests.


#### Validation du libellé d'inscription et de l'ensemble Lot 285
- CI #3000 : réussite sur le commit `730ada625eeb39ca4b4386bcbe2c030c15b4f572`.
- Les contrôles du portail public, de l'inscription officielle, du tableau de bord, des permissions et des régressions ont réussi.
- La création d'un compte local depuis le formulaire d'inscription est bloquée par le code et vérifiée par le test CI.
- Le libellé du bouton ne promet plus une connexion immédiate.
- L'envoi effectif du message de confirmation n'a pas été testé et reste dépendant du SMTP Auth configuré dans le projet Supabase.


### Lot 286 — audit du prototype « التقارير الأمنية الدورية » — 11 novembre 2026

#### Prototype source examiné
- Fichier fourni : `Texte collé(20261111-170408).txt`, maquette HTML autonome de 759 lignes.
- La maquette contient la sélection quotidien/hebdomadaire/mensuel, le choix du jour et de l'heure, six catégories de contenu, une adresse de réception, une langue, une option d'alerte immédiate, un aperçu et un historique.
- Elle affiche des valeurs statiques de démonstration : 24 rapports, 92 % d'ouverture, 3 alertes, une prochaine date fixe, une adresse fictive `ahmed@email.com` et des entrées d'historique préremplies.
- `saveSchedule()` et `saveEmailSettings()` affichent seulement une notification de succès ; elles ne sauvegardent aucune préférence.
- `sendTestEmail()` affiche une notification puis simule un succès après deux secondes via `setTimeout` ; aucun appel réseau ou fournisseur d'e-mail n'est effectué.
- Le choix de fréquence ne fait que modifier l'état visuel des cartes ; les paramètres des champs, les interrupteurs et l'historique ne sont reliés à aucune donnée persistante.

#### État de l'application sur la branche de la PR #17
- Aucun écran intégré `data-view` relatif aux rapports périodiques n'est présent dans `index.html` ou `app.js).
- Aucun stockage de préférences de rapport, historique de rapports ou source applicative complète des événements de connexion n'est ajouté par ce prototype.
- `wrangler.toml` ne déclare que le binding statique `ASSETS` ; aucun `triggers.crons` n'est configuré.
- `src/site-worker.js` sert les ressources et ne comporte pas de handler `scheduled()`.
- Les audits antérieurs des Lots 274, 276 et 277 restent applicables : pas de planificateur Worker, pas de journal applicatif élève complet et pas de table existante adaptée pour fournir l'historique demandé.

#### Revue de sécurité du worker e-mail existant
- `worker/resend-welcome.js` est un endpoint distinct destiné à l'e-mail de bienvenue, pas un moteur de rapports périodiques.
- Il accepte le destinataire depuis le corps de la requête et ne démontre pas de validation d'identité du compte, d'autorisation propriétaire, de limitation de débit ou de clé d'idempotence.
- CORS ne constitue pas une authentification et ne protège pas cet endpoint contre les appels serveur-à-serveur.
- Le fichier n'est pas relié au Worker principal dans `wrangler.toml`. Il ne doit pas être réutilisé pour envoyer des rapports sensibles sans conception et contrôles serveur séparés.

#### Décision et étapes bloquantes
- Ne pas intégrer les statistiques, dates, historiques ou confirmations de la maquette comme des données réelles.
- Ne pas afficher un succès d'envoi tant qu'une réponse réelle du fournisseur n'a pas confirmé l'envoi.
- La réalisation reste conditionnée aux étapes A à F déjà définies dans le dossier : stockage minimal et RLS des préférences, source fiable des événements, générateur de rapport, endpoint sécurisé et idempotent, planification, puis activation après validation du fournisseur d'e-mail.
- Aucun SQL, table, fonction, politique RLS, secret, réglage Auth/SMTP, Worker, Cron Trigger, e-mail ou déploiement n'a été créé ou activé dans ce lot.
- Aucun coût ni achat n'est engagé ; PR #17 reste ouverte et non fusionnée.


### Lot 287 — spécification technique des rapports périodiques — 11 novembre 2026

- Création de `docs/security/LOT-287-periodic-security-reports-technical-spec.md`.
- Définition des préférences (fréquence, calendrier, fuseau, langue, catégories), du contenu autorisé, des états d'historique et des quatre ensembles de données proposés.
- Règle de confidentialité : l'identité et le destinataire sont résolus côté serveur à partir d'un jeton vérifié et d'une adresse confirmée ; le navigateur ne choisit pas librement le destinataire.
- Distinction sémantique : `app_access_observed` décrit une observation d'accès authentifié après validation serveur ; ce n'est pas une preuve de connexion complète, de présence continue ou de déconnexion.
- Le hook de jeton pré-émission ne prouve pas la réception du jeton ni l'ouverture de l'application. Aucun historique rétroactif n'est disponible.
- L'endpoint de bienvenue existant est exclu du périmètre d'envoi des rapports privés en l'état.
- Définition des tests obligatoires : isolation RLS, identité, destinataire confirmé, idempotence, calendrier, confidentialité, pannes et rendu trilingue.
- Découpage proposé des Lots 288 à 293, depuis le contrat de données jusqu'à une éventuelle activation distinctement autorisée.
- Aucun code applicatif, SQL, migration, table, fonction, politique RLS, secret, endpoint, Cron, e-mail ou déploiement n'a été créé ou activé. Aucun achat ni coût.
- La spécification est documentaire et ne constitue pas une autorisation de modifier Supabase ou d'activer un fournisseur.


### Lot 288 — contrat de données et matrice d'accès des rapports périodiques — 11 novembre 2026

- Création de `docs/security/LOT-288-periodic-reports-data-contract-access-matrix.md`.
- Séparation proposée entre les préférences élève dans `public.security_report_preferences` (RLS propriétaire, privilèges limités aux colonnes de préférence) et les événements, exécutions et livraisons dans le schéma privé non exposé à la Data API.
- Identité dérivée de `auth.uid()` pour les préférences et de la réponse serveur validée à Supabase Auth `/auth/v1/user` pour les traitements Worker. Le destinataire doit être résolu côté serveur à partir d'une adresse confirmée ; le navigateur ne choisit ni destinataire ni statut d'envoi.
- Définition des contrats logiques pour les événements `app_access_observed`, les exécutions idempotentes et les livraisons avec états distincts. L'acceptation fournisseur n'est pas présentée comme une livraison ; les cas ambigus passent en état `unknown` et ne déclenchent pas de renvoi aveugle.
- Matrice d'accès et 14 tests négatifs documentés : accès croisé, falsification d'identité, accès anon, privilèges de colonnes, schéma privé, destinataire, validation de jeton, concurrence, réponse fournisseur perdue, suppression et purge.
- Points bloquants laissés explicitement ouverts : liste exacte des catégories issue de la maquette, règles fin de mois/DST, rétention, exposition éventuelle d'un historique à l'élève et capacités d'idempotence/réconciliation du fournisseur.
- Aucun test n'est déclaré réussi ; aucune migration SQL, table, fonction, policy RLS, grant, secret, réglage Auth, endpoint, Worker, Cron, e-mail ou déploiement n'a été créé ou modifié. Aucun coût.
- Le Lot 288 est documentaire ; toute migration ou opération distante requiert une revue et une autorisation distinctes.


### Lot 289 — vérification des catégories du prototype des rapports périodiques — 11 novembre 2026

- Relecture ciblée du fichier source `Texte collé(20261111-170408).txt` (759 lignes), sections de planification, contenu du rapport et paramètres e-mail.
- Les six catégories exactes sont confirmées : `سجل الدخول` (historique des connexions), `التنبيهات الأمنية` (alertes de sécurité), `الأجهزة النشطة` (appareils actifs), `درجة الأمان` (score de sécurité), `المواقع الجغرافية` (localisations géographiques), `التوصيات الأمنية` (recommandations de sécurité). Elles sont désormais inscrites comme liste blanche dans `docs/security/LOT-288-periodic-reports-data-contract-access-matrix.md`.
- Le prototype ne comporte aucun sélecteur de fuseau horaire. Le champ IANA `timezone` reste nécessaire au contrat technique, mais son origine et son éventuelle confirmation par l'élève restent à décider.
- Les sources de données ne sont pas toutes disponibles : pas de journal applicatif complet, pas de catalogue d'alertes défini, pas de source fiable d'appareils actifs, pas de formule de score ni de source géographique spécifiée. Les recommandations peuvent être éditoriales, mais doivent être distinguées des observations propres au compte.
- Les statistiques, dates, appareils, lieux, score, adresse e-mail et historique préremplis de l'aperçu sont des valeurs fictives. Le bouton de test simule un succès et n'envoie aucun e-mail.
- Les règles de fin de mois, DST, rétention/suppression et idempotence fournisseur restent ouvertes.
- Mise à jour documentaire du contrat : commit `2fa8d5b14be77ff93f86dce2030d5bf662efe70d`.
- Aucun SQL exécuté, aucun objet Supabase, privilège, RLS, secret, réglage Auth/SMTP, endpoint, Worker, Cron, e-mail ou déploiement modifié. Aucun coût.
- PR #17 reste la seule branche de travail ; ne pas fusionner ni déployer. Vérifier son état et la CI sur le HEAD après la mise à jour du dossier.

### Lot 290 — proposition de règles calendaires des rapports périodiques — 11 novembre 2026

- Documenté dans `docs/security/LOT-288-periodic-reports-data-contract-access-matrix.md` : calcul hebdomadaire en calendrier local, report des jours mensuels inexistants au dernier jour du mois, traitement déterministe des heures DST inexistantes/répétées, rattrapage borné et idempotence par période locale.
- Ces règles sont des propositions techniques non approuvées ; elles ne sont pas codées et ne déclenchent aucun rapport.
- Le fuseau IANA doit être explicite ; le prototype n'offre pas de sélecteur. Le choix entre détection navigateur confirmée et paramètre choisi par l'élève reste ouvert.
- Les durées de conservation et la fenêtre de rattrapage restent à approuver ; aucune durée arbitraire n'a été inventée.
- Contrat enrichi au commit `eb86db7383288490c3640ab07fbfb11e79bae191`.
- Vérification de l'exécution CI #3009 sur le commit précédent `51b83bc65822fec569c767c30d325a543b5a8d22` : conclusion `success`, job « Validation structurelle & pédagogique » terminé avec succès. Cette validation ne couvre pas le nouveau texte Lot 290, qui déclenchera une nouvelle exécution.
- Aucun SQL, objet Supabase, RLS, privilège, secret, réglage Auth/SMTP, Worker, Cron, e-mail ou déploiement modifié. Aucun coût.
- PR #17 reste ouverte et non fusionnée.


### Lot 291 — politique de conservation, purge et suppression des rapports périodiques — 11 novembre 2026

- Création de `docs/security/LOT-291-periodic-reports-retention-deletion-policy.md`.
- Classification du cycle de vie : préférences, événements observés, exécutions, livraisons, copies du fournisseur et e-mails déjà remis.
- Définition des principes de minimisation, suppression liée au compte, annulation des rapports en attente, traitement des éventuelles obligations de conservation et limites de suppression des copies externes.
- Spécification d'une purge serveur idempotente : échéances calculées côté serveur, mode simulation préalable, lots bornés, reprise après panne, journaux agrégés et vérification post-purge.
- Définition de 12 tests négatifs couvrant échéances, suppression de compte, appels navigateur, panne partielle, données sensibles et rétention fournisseur.
- Aucune durée chiffrée n'a été inventée : les durées par type de données, le délai de suppression du compte, la rétention des sauvegardes et celle du fournisseur restent des décisions à approuver avant toute activation.
- Le séquencement du programme est corrigé : Lot 291 rétention/suppression, Lot 292 endpoint sécurisé, Lot 293 planification/historique, Lot 294 activation éventuelle. Le tableau de la spécification Lot 287 a été actualisé en conséquence.
- Commits : document Lot 291 `3f5a790859ab04ce103dd66543ab75cbab401f76` ; séquencement Lot 287 `860dab9ec780fc2d25bd3750effe3ccf46f05412`.
- Aucun SQL, migration, table, fonction, policy RLS, grant, secret, réglage Auth/SMTP, endpoint, Worker, Cron, e-mail ou purge n'a été créé, exécuté ou activé. Aucun déploiement, achat ou coût.
- La validation CI #3011 a réussi sur le HEAD précédent `588f6ae69a08a6bac19e0a6d9710c9715b8ce22b). Elle ne valide pas les deux commits documentaires de ce Lot 291 ; la CI déclenchée sur le nouveau HEAD doit être vérifiée séparément.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`. Aucune modification directe de `main`.


### Lot 292 — contrat de sécurité de l'endpoint d'envoi — 11 novembre 2026

- Création de `docs/security/LOT-292-periodic-reports-secure-delivery-endpoint-contract.md`.
- Séparation des appels utilisateur (Bearer token validé côté serveur auprès de Supabase Auth) et des tâches internes planifiées (authentification interne distincte).
- Le serveur dérive l'identité du compte et résout lui-même l'adresse Auth confirmée ; aucun destinataire, statut, identifiant fournisseur ou contenu HTML n'est accepté comme autorité depuis le navigateur.
- Contrat de génération côté serveur, contrôle d'appartenance, limites de débit, verrou/lease, idempotence par compte/période, gestion de l'état ambigu unknown et codes d'erreur expurgés.
- Définition de 18 tests négatifs couvrant appels anonymes, jetons, accès croisés, destinataire falsifié, comptes supprimés, rapports désactivés, secret interne, concurrence, fournisseur, injection HTML, données indisponibles, pannes et fuite d'informations.
- Le document est une spécification, pas un endpoint implémenté. Le fournisseur, les seuils de limitation et les paramètres de conservation restent à approuver ; la politique Lot 291 et les sources de données fiables sont des préconditions.
- Aucun code Worker/endpoint, secret, réglage Supabase Auth/SMTP, SQL, table, fonction, RLS, grant, Cron, e-mail, purge ou déploiement créé/exécuté/activé. Aucun achat ni coût.
- Commit du contrat Lot 292 : `914732e654e8751fbf5bbe7f85ee750a2e74ab4a`.
- La CI #3011 est réussie sur le HEAD antérieur `588f6ae69a08a6bac19e0a6d9710c9715b8ce22b). Les exécutions #3012 et #3013 déclenchées par les commits Lot 291 étaient encore en cours/en attente lors de la dernière vérification ; elles ne valident pas le HEAD final Lot 292. Nouvelle vérification CI requise.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`. Aucune modification directe de `main`.


### Lot 293 — contrat de planification et d'historique des rapports — 11 novembre 2026

- Création de `docs/security/LOT-293-periodic-reports-scheduling-history-contract.md`.
- Définition du calcul des échéances selon le calendrier local et le fuseau IANA, avec conversion UTC, règles DST proposées, fin de mois, changement de fuseau et rattrapage borné.
- Définition des états de traitement, des leases anti-concurrence et de l'idempotence des occurrences.
- Définition des règles d'un éventuel historique élève : données limitées au propriétaire, statut compréhensible, aucune adresse, erreur interne ou donnée fournisseur exposée ; historique vide tant qu'aucun rapport réel n'existe.
- 14 tests de calendrier, concurrence, suppression, accès croisé, rétention et données absentes spécifiés.
- Les règles de calendrier Lot 290 restent proposées et non approuvées. La fenêtre de rattrapage, le fuseau à confirmer, l'affichage d'un historique et les durées Lot 291 restent ouverts.
- L'infrastructure n'a pas été modifiée : aucun handler scheduled(), Cron Trigger, Worker, endpoint ou table ajouté.
- Aucun SQL, migration, RLS, grant, secret, réglage Auth/SMTP, e-mail, purge, déploiement, achat ou coût.
- Commit du contrat Lot 293 : `2e35e6607f5bdd5a0723bdeb4bbef25fa048f3aa`.
- La CI du HEAD final de documentation reste à vérifier ; les résultats #3012/#3014 concernent des commits antérieurs et ne valident pas ce nouveau fichier.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`.


### Lot 294 — clôture de l'audit du prototype des rapports périodiques — 11 novembre 2026

- Création de `docs/security/LOT-294-periodic-reports-go-no-go-review.md`.
- Conclusion : audit de la maquette et documentation des contrats Lots 287–293 terminés ; fonctionnalité non implémentée et mise en service NO-GO.
- Les blocages sont explicités : sources réelles de catégories, durées de conservation/suppression, fuseau et règles calendrier, fenêtre de rattrapage, tests isolés, fournisseur/SMTP, planificateur et éventuel historique élève.
- Les statistiques, historiques, dates, adresses et succès simulés de la maquette ne doivent pas être repris dans l'application comme des données réelles.
- Les conditions cumulatives d'une éventuelle activation sont documentées ; chaque changement distant, secret, migration, endpoint, Cron, envoi et déploiement exige une autorisation explicite distincte.
- Commit de la revue Go/No-Go : `eac84524948b68b09a8b176f09b6a1f3dea14364`.
- Aucun code fonctionnel, SQL, migration, table, fonction, RLS, grant, secret, Auth/SMTP, endpoint, Worker, Cron, e-mail, purge, déploiement, achat ou coût.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`. Aucun changement direct de `main`.
- La revue documentaire de ce prototype est close. Le prochain prototype peut être transmis pour une analyse indépendante.


### Lot 295 — audit sécurité du prototype d'analyse intelligente des activités suspectes — 11 novembre 2026

- Matériel reçu : descriptif fonctionnel arabe, extrait Edge Function TypeScript/Deno et SQL de deux tables. Aucun fichier HTML ni capture n'était joint ; l'audit porte donc sur le texte et le code transmis, pas sur une inspection navigateur.
- Création de `docs/security/LOT-295-ai-threat-detection-prototype-security-audit.md`.
- Écarts fonctionnels relevés : six facteurs annoncés mais quatre seulement codés ; fonction heuristique déterministe et non modèle IA ; score pondéré non probabiliste ; précision 99,2 %, faux positifs 0,8 % et latence <200 ms non démontrés ; alertes, terminal, simulation, recommandations et réponses automatiques non fournis dans l'extrait.
- 12 constats principaux documentés, dont identité `userId` contrôlée par le client, événement falsifiable, absence de validation du JWT, usage non encadré de la clé privilégiée, profil absent/null, validation insuffisante, empoisonnement du profil, données de localisation/appareil, score non calibré, blocage sans gouvernance, contrôles HTTP/anti-abus manquants et erreurs de persistance/alertes non traitées.
- Le SQL proposé est incomplet : RLS/policies/grants absents, colonnes sans contraintes, dates et données comportementales insuffisamment protégées, rétention et suppression non définies.
- 22 tests négatifs et une architecture cible en étapes sont spécifiés.
- Décision : NO-GO pour exécuter le code ou créer les objets dans le projet Supabase réel. Les actions de réponse restent désactivées par défaut ; aucune donnée ou mesure fictive ne doit être affichée comme réelle.
- Le descriptif est audité ; une maquette HTML ou des captures restent nécessaires pour l'audit visuel et des interactions.
- Commit du rapport Lot 295 : `d9f82f6e217c17d640b357895b3118c38ff8b97f`.
- Aucun SQL, migration, table, fonction Edge, policy RLS, grant, secret, paramètre Auth, trigger, modèle ML, alerte, action de blocage, terminal connecté, collecte d'appareil/localisation, e-mail ou déploiement créé/activé. Aucun achat ni coût.
- PR #17 demeure ouverte et non fusionnée sur `design/prototypes-67-74-alignment`, cible `main`.


### Lot 296 — audit sécurité du prototype de tableau de bord administratif global — 11 novembre 2026

- Matériel reçu : HTML/JavaScript RTL autonome avec sept vues (aperçu, utilisateurs, sécurité, finances, wilayas, système, audit). Audit statique du code fourni ; aucun test navigateur ni appel réseau de la maquette.
- Création de `docs/security/LOT-296-admin-dashboard-prototype-security-audit.md`.
- Conclusion : NO-GO pour intégrer ou publier le prototype en l'état. Les KPI, graphiques, activités « directes », alertes, états système, chiffres financiers et lignes d'audit sont statiques/fictifs. Recherche, pagination, notifications, boutons utilisateurs, actions de sécurité et déconnexion ne sont pas reliés à un service réel.
- 15 constats documentés : absence de garde d'accès dans le HTML autonome ; modèle « accès complet » non conforme au moindre privilège ; coexistence de chemins d'administration historiques et récents dans le dépôt ; exposition de données personnelles ; absence de source fiable pour l'activité et les alertes ; actions sensibles non implémentées ; métriques sécurité/système non étayées ; finance sans source comptable connectée ; journal d'audit statique malgré l'affirmation d'immutabilité ; risque XSS lors du futur branchement de données à `innerHTML` ; dépendances CDN et thème divergents ; navigation mobile incomplète ; pagination/export non opérationnels ; séparation démonstration/production absente.
- Comparaison en lecture seule de `admin.js`, `supabase/supabase.js`, `supabase/adm_schema.sql`, `supabase/adm2_schema.sql`, `supabase/adm5_schema.sql` et `src/site-worker.js`. Le dépôt contient déjà des permissions et périmètres administratifs, ainsi que des RPC de synthèse, fiches élèves et rapports ; le prototype ne les utilise pas.
- Le modèle cible doit réutiliser les autorisations serveur `admin_can` et les périmètres par wilaya ; ne pas ajouter un troisième modèle de rôles ni faire confiance aux contrôles JavaScript. Les données d'activité, de sécurité et de santé système doivent avoir des sources distinctes et documentées.
- La présence de scripts SQL/RPC dans Git ne prouve pas leur application au projet Supabase actif. Aucune introspection distante n'a été effectuée dans ce lot ; disponibilité et politiques en production restent à vérifier avant tout branchement.
- La section financière reste non intégrée : les chiffres sont fictifs et aucune nouvelle fonction de facturation, d'encaissement, de tarification ou de monétisation n'a été ajoutée. Aucun chiffre ne doit être déduit d'abonnements actifs sans rapprochement comptable.
- 15 tests négatifs sont spécifiés ; aucun n'est déclaré exécuté.
- Commit du rapport Lot 296 : `57f215cd1c41f66251e02683b7e1d239fcc23a38`.
- Aucun code applicatif, route, ID ou style modifié ; aucun SQL, migration, table, fonction, RLS, grant, secret, réglage Auth, donnée, opération financière, Worker, Cron, Realtime, e-mail, déploiement, achat ou coût. Aucune requête au projet Supabase distant.
- PR #17 reste ouverte et non fusionnée ; branche `design/prototypes-67-74-alignment`, cible `main`. La CI du commit documentaire final doit être vérifiée séparément.



### Lot 297 — audit du descriptif du tableau de bord et des requêtes Supabase — 11 novembre 2026

- Deuxième pièce reçue concernant le même tableau de bord à sept sections : descriptif fonctionnel arabe et quatre extraits PostgREST pour profils, comptage, paiements et analyses de sécurité. Aucun nouveau HTML/JavaScript complet ni capture n'était joint ; ce lot est donc une revue de spécification et de raccordement, pas un audit visuel.
- Le dossier conserve deux entrées distinctes et complémentaires :
  - **Lot 296** : audit du prototype HTML/JavaScript autonome (maquette, données statiques, boutons inertes, absence de garde d'accès).
  - **Lot 297** : audit du descriptif fonctionnel et des quatre requêtes de branchement Supabase proposées.
- Création de `docs/security/LOT-297-admin-dashboard-supabase-integration-audit.md`.
- Conclusion : **NO-GO pour copier/exécuter les quatre requêtes telles quelles**. Les relations `user_roles(role)` et `wilayas(name)` ne sont pas établies par les schémas administratifs examinés ; le modèle versionné utilise `profiles.role` et les tables `admin_roles`, `admin_permissions`, `wilaya_assignments`. `select('*')` et le comptage global ne garantissent ni minimisation ni périmètre.
- La requête financière propose `amount`, alors que les contrats versionnés utilisent `montant`, `devise` et `statut`. Les recettes doivent être lues via `admin_report` / `accounting_entries`, qui distinguent recettes, remboursements et dépenses, et non déduites de toutes les lignes `payments`.
- La table `security_analyses` et ses policies ne sont pas établies comme déployées ; le Lot 295 a déjà identifié les défauts de confiance de ses événements, de l'identité et du score. Aucune action de blocage n'est autorisée par cette maquette.
- Les wrappers existants `SB.admMyPerms`, `SB.admDashboard`, `SB.admSearchStudents`, `SB.admStudent`, `SB.admReport`, `SB.admAuditLast`, `SB.admEntries` et les fonctions de reçus/paiements sont à réutiliser uniquement après vérification de leur disponibilité et des policies réellement installées.
- Le journal `audit_logs` existe dans les scripts versionnés, mais la promesse « immuable comme GitHub » est trop absolue : le trigger SQL présent dans Git retourne `OLD` lorsque `auth.uid()` est NULL, ce qui laisse notamment le contexte privilégié hors de la garantie annoncée. La portée exacte doit être testée et décrite sans surpromesse.
- 10 constats transversaux et 18 tests négatifs sont documentés. Aucun test n'est déclaré exécuté ; aucune introspection distante Supabase n'a été effectuée.
- Aucun code applicatif, SQL, migration, table, fonction, policy RLS, grant, secret, donnée, action admin, opération financière, Worker, Cron, Realtime, e-mail, déploiement, achat ou coût n'a été modifié/créé/exécuté. Aucune nouvelle branche ; `main` inchangée.
- Rapport Lot 297 créé au commit `b158fc354dfa65527b70356d48a3af303fb628e5`.
- La CI du commit documentaire final doit être vérifiée séparément. PR #17 doit rester ouverte et non fusionnée.



### Lot 298 — audit du prototype « tableau de bord basé sur les données réelles de GitHub » — 11 novembre 2026

- Nouveau prototype HTML autonome reçu : huit entrées de navigation (overview, classes, security, finance, messaging, wilayas, audit, codebase). Audit statique du HTML/JS et comparaison en lecture seule avec la branche GitHub PR #17.
- Création de `docs/security/LOT-298-github-real-data-admin-dashboard-audit.md`.
- Décision : **NO-GO pour présenter/intégrer ce HTML comme un tableau de bord réel**. Le HTML ne charge ni `supabase.js`, ni `admin.js`, ne crée aucun client Supabase, n'appelle aucune API GitHub/RPC et n'a aucune souscription Realtime. Les badges « Supabase connecté », profil admin et chiffres sont codés en dur.
- Vérification GitHub réelle au HEAD `594d7a891a2475ba8e5ecac26d2ca3cde9c41d4e` : PR #17 ouverte et non fusionnée ; CI #3026 / run `43081483343` terminée avec succès. Les 29 étapes de validation métier du job ont réussi. Cette preuve concerne le commit consulté et la CI du dépôt, pas l'exécution navigateur du HTML.
- Le fichier `assets/bdd/classe.json` contient les cinq classes et effectifs 32/28/32/26/24 (total arithmétique 142), mais ses métadonnées le définissent comme maquette pédagogique. Le chiffre 142 ne peut donc pas être présenté comme le nombre réel d'inscrits.
- Les référentiels `assets/bdd/wilaya.json` et `assets/bdd/wilayas_geo.json` existent ; le client contient `SB.admCouverture()` → RPC `admin_couverture_wilayas`. Le HTML ne les utilise pas.
- Briques réelles repérées dans le dépôt : `SB.admMyPerms`, `SB.admDashboard`, `SB.admReport`, `SB.admAuditLast`, `SB.admCouverture`, recherche/fiches élèves et wrappers messagerie. Leur présence dans Git ne prouve pas leur déploiement effectif dans Supabase actif.
- Les chiffres/états financiers et numéros de reçus sont statiques ; les règles de sécurité affichées ne constituent pas une mesure du niveau de sécurité ; aucune source de menaces ou de télémétrie système n'alimente l'interface.
- Défauts fonctionnels : vues `messaging`, `wilayas`, `audit` absentes alors que les boutons les appellent (exception JS au clic) ; vue classes limitée à trois cartes ; Chart.js chargé sans graphique ; déconnexion sans action ; navigation mobile partielle ; thème isolé ; dépendances CDN inutilisées/non conformes à la préférence vanilla ; `showNotification` injecte ses paramètres via `innerHTML` sans échappement.
- 18 tests d'acceptation/négatifs consignés ; aucun test navigateur ou Supabase réel n'a été exécuté dans ce lot.
- Aucune modification applicative, aucun SQL/migration/RLS/grant/secret/Auth, aucune donnée Supabase, aucune action financière, aucun Worker/Cron/Realtime/e-mail, aucun déploiement, aucune branche, aucun merge, aucun achat ni coût. Aucune nouvelle fonction de facturation ou paiement.
- Rapport Lot 298 créé au commit `772c198c3e77ceb057e2a80a5dbed4f31c280aab`. Mise à jour du présent dossier effectuée séparément ; PR #17 doit rester ouverte et non fusionnée.



## Lot 299 — synthèse des deux prototypes et première évolution réelle de la لوحة التحكم (11 novembre 2026)

### Décision de conception
- Les prototypes des Lots 296 et 298 sont traités comme des références d'expérience utilisateur, pas comme des sources de chiffres à recopier.
- La véritable vue administrative reste celle de `index.html` (`section[data-view="admin"]`, `#adminBody`) et de `admin.js`. Aucun second tableau de bord autonome n'est introduit.
- Séparation stricte des sources :
  1. données opérationnelles : RPC Supabase et tables soumises aux permissions/RLS ;
  2. référentiels pédagogiques et territoriaux : fichiers versionnés dans GitHub ;
  3. état du dépôt et CI : GitHub Actions, à afficher uniquement si un flux fiable est raccordé ;
  4. indicateurs indisponibles : signalés comme indisponibles, jamais remplacés par des chiffres de démonstration.
- `assets/bdd/classe.json` décrit une maquette/référence de classes. Les cinq classes et le total arithmétique 142 ne sont pas présentés comme 142 comptes élèves actifs.
- Le dépôt ne fournit pas à ce stade de télémétrie vérifiable pour l'uptime Cloudflare, la santé instantanée de Supabase ou le taux d'utilisation du stockage. Aucun faux badge « connecté », « 99,9 % » ou « temps réel » ne sera ajouté.
- Le prototype financier n'est pas repris dans le nouvel accueil. Les données financières restent hors du périmètre de cette évolution.

### Inventaire des sources opérationnelles existantes
- `SB.admMyPerms()` retourne le rôle administratif, les permissions et les wilayas affectées.
- `SB.admDashboard()` appelle le RPC serveur `admin_dashboard()`, qui contrôle `reports.read` et calcule dans le périmètre autorisé : élèves, vérifications en attente, signalements ouverts, ainsi que d'autres champs opérationnels historiques.
- `SB.admAuditLast(n)` lit les dernières lignes de `audit_logs`, sous réserve des règles RLS.
- `SB.admCouverture()` appelle le RPC `admin_couverture_wilayas()` pour les vues de couverture autorisées.
- Les fonctions `admin_can()` et `admin_sees_wilaya()` restent les autorités de permission et de périmètre côté base ; l'interface ne devient jamais l'autorité d'accès.

### Première tranche implémentée — ADM-DASH-1
- La vue par défaut de la barre d'onglets administrative devient le tableau de bord, au lieu de l'ancien panneau historique.
- Le panneau historique `#adminBody` est isolé dans l'onglet « opérations » et masqué dans les autres onglets, y compris les vues auxiliaires.
- Le tableau de bord affiche quatre indicateurs issus des sources existantes : nombre d'élèves dans le périmètre, vérifications en attente, signalements ouverts et périmètre des wilayas (national ou nombre d'affectations).
- Ajout des huit dernières lignes du journal d'audit, avec action, cible, date, wilaya éventuelle et identifiant d'acteur abrégé. Les champs dynamiques sont échappés avant insertion HTML.
- Suppression des compteurs financiers de la vue d'accueil. Aucun nouveau module financier, paiement, tarification ou facturation n'est créé.
- Initialisation directe de `#admin` corrigée pour charger aussi les données du tableau de bord.
- Tests statiques ajoutés dans `tests/adm_test.mjs` pour la vue par défaut, la visibilité du panneau historique, les sources de données, le périmètre, le chargement direct, l'absence de métriques financières et l'échappement du journal.
- Commits applicatifs/tests : `4adcdfaeefeb44eea7f00e4483c7c34a13e3301f`, `8abd231e8ca16943b53bbde88da9b121f5192de5`, `a4e7bddf8534a444329697b9e5b441ffba5f51a4`, `19fc4ea9a89d24f620dfcb54f6488d7c971e8012`.
- CI #3030 sur le premier changement admin : succès confirmé. CI #3031 sur le changement de visibilité auxiliaire : en cours au dernier contrôle. CI #3032 sur les assertions finales : en attente au dernier contrôle ; ne pas déclarer le lot validé avant leur fin.
- Aucun test navigateur, aucune session Supabase réelle et aucune validation visuelle mobile/ordinateur effectués dans ce lot.
- Aucun SQL, migration, RLS, grant, Auth, secret, donnée ou configuration Supabase distante modifié. Aucun Worker, Cron, Realtime, e-mail, déploiement, nouvelle branche ou fusion. PR #17 reste ouverte et non fusionnée ; `main` inchangée.

### Suite recommandée
1. Confirmer CI #3031 et #3032 sur les commits correspondants.
2. Vérifier en navigateur avec un administrateur autorisé et un compte sans permission que l'accueil, le journal et le périmètre sont corrects.
3. Ajouter ensuite, séparément, un panneau de référentiel des classes clairement identifié comme catalogue de configuration (pas comme inscriptions réelles).
4. N'ajouter une vue système ou GitHub dynamique que lorsqu'une source de télémétrie/API sécurisée existe ; ne jamais exposer un token GitHub dans le navigateur.



### Validation CI Lot 299 — mise à jour du 11 novembre 2026
- CI #3031 / run `43082683771` sur `a4e7bddf8534a444329697b9e5b441ffba5f51a4` : **success**, job de validation terminé.
- CI #3032 / run `43082695013` sur `19fc4ea9a89d24f620dfcb54f6488d7c971e8012` : **success**. Les étapes « Valider la syntaxe JavaScript (esprima) » et « Valider l'administration EduDZ (schéma ADM + permissions) » sont en succès ; le job complet est réussi.
- La mise à jour documentaire du présent dossier a déclenché CI #3033 / run `43082782842` sur le commit `600e40a24fb8a01eff65db65ba4a5ed9e04ef987` ; état **queued** au dernier contrôle. Cette dernière exécution documentaire reste à confirmer.
- PR #17 : ouverte, non fusionnée, HEAD `600e40a24fb8a01eff65db65ba4a5ed9e04ef987`, base `main`. Aucun changement sur `main`.
- CI valide les contrôles automatisés du dépôt ; elle ne remplace pas l'essai navigateur avec les vrais rôles administratifs ni la vérification visuelle responsive.



## Lot 300 — vues de référence des classes et des wilayas (11 novembre 2026)

### Objectif et décision
- Poursuite de la transformation de la console administrative existante, sans importer le HTML autonome du prototype.
- Ajout de deux onglets en lecture seule dans la barre administrative : `🏫 الأقسام · Classes` et `🗺️ الولايات · Wilayas`.
- Ces vues sont accessibles derrière la permission existante `reports.read`. Elles ne créent ni permission nouvelle ni élargissement de périmètre pour les données opérationnelles.

### Vue Classes — source et limites
- Source chargée à la demande depuis `assets/bdd/classe.json`.
- Le fichier contient 5 entrées : 2AS-1 (32), 2AS-2 (28), 2AS-3 (32), 3AS-1 (26), 3AS-2 (24), soit 142 par addition.
- Les métadonnées du fichier qualifient explicitement les contenus comme maquette pédagogique. La vue affiche donc les 5 entrées comme catalogue de référence et avertit que les nombres 32/28/32/26/24 et leur somme 142 ne prouvent ni les inscriptions réelles, ni les comptes actifs, ni la présence.
- Les noms des professeurs ne sont pas repris dans ces cartes ; le fichier contient des chaînes de nom altérées/encodées dans certains champs.
- Aucune requête `profiles`, aucun décompte d'élèves Supabase et aucune donnée nominative ne sont ajoutés à cette vue.

### Vue Wilayas — source et limites
- Source chargée à la demande depuis `assets/bdd/wilaya.json`.
- Vérification du JSON du dépôt : 58 entrées exactement, réparties dans les régions référentielles (Centre, Est, Ouest, Sud, Grand Sud, Hauts-Plateaux).
- Affichage des codes, noms arabes/français et régions, avec recherche locale côté navigateur ; aucune requête distante n'est déclenchée par la recherche.
- Cette liste géographique n'est pas une liste d'affectations administratives. Les wilayas autorisées à un compte restent issues de `SB.admMyPerms()` et les contrôles de la base (`admin_can()`, `admin_sees_wilaya()`, RLS) restent souverains.

### Détails techniques et garde-fous
- Ajout de `loadAdminReference()`, `renderClasses()`, `renderWilayas()` dans `admin.js`; chargement des JSON via les assets statiques existants.
- Ajout des deux cartes à `KNOWN` pour éviter qu'elles ne soient classées dans le panneau historique « opérations ».
- Recherche des wilayas limitée aux attributs déjà chargés ; les valeurs injectées dans le HTML passent par `esq5()`.
- Tests dans `tests/adm_test.mjs` couvrant les deux onglets, les sources GitHub, l'avertissement de maquette, les cinq classes/le total indicatif, les 58 wilayas, la recherche locale et la garde `reports.read`.
- Commits : `b52b44636826dee4918d818d544bdda079fe6697` (vues), `e1888438ab32a9f961fbf32e4b1244b82ae7e9a2` (simplification du chemin fetch), `2446846e59c8872ee4281f2e13fbe236f105e124` (tests initiaux), `beff4320863fcb88a74ae9d8cab49e5b737b3fc3` (correction d'une assertion de test).
- CI #3035 / run `43083392935` sur le commit `b52b446...` : success.
- CI #3036 / run `43083436676` sur `2446846...` : failure due à une assertion de test dont le texte ne correspondait pas exactement à l'avertissement UI ; les journaux montrent que les autres assertions ADM-REF-1 passaient. Aucun échec de syntaxe JavaScript.
- Correction de l'assertion pour vérifier le libellé arabe exact présent dans l'interface.
- CI #3037 / run `43083476345` sur `beff432...` : **success**, y compris la validation syntaxique JavaScript et la suite d'administration.
- Aucun test navigateur ni contrôle visuel responsive effectué. Aucun test d'une session Supabase active ni d'un utilisateur réel effectué.

### Hors périmètre confirmé
- Aucun SQL, migration, table, fonction, RLS, grant, rôle, affectation ou donnée Supabase modifié.
- Aucun changement Auth, Worker, Cron, Realtime, e-mail, API GitHub publique ou secret.
- Aucun module de paiement/facturation, tarif, encaissement ou fonctionnalité financière ajouté.
- Aucun déploiement, nouvelle branche ou fusion ; `main` reste inchangée. PR #17 reste ouverte et non fusionnée.

### Suite recommandée
1. Vérifier les deux onglets dans le navigateur, en particulier l'affichage mobile et les erreurs réseau de chargement des assets.
2. Vérifier avec un compte admin ayant `reports.read` et un compte sans cette permission que l'accès reste correctement refusé.
3. Passer ensuite à l'audit et à la présentation des vues de sécurité, en réutilisant uniquement les sources opérationnelles déjà disponibles et sans inventer de télémétrie.



## Lot 301 — vue « accès administratif et audit » (11 novembre 2026)

### Objectif
- Ajouter une vue de transparence sur les autorisations du compte administratif connecté et les dernières opérations d'audit disponibles.
- Ne pas la présenter comme un centre de détection des menaces, une surveillance des sessions ou un tableau de télémétrie en temps réel : les sources actuelles ne fournissent pas ces fonctions.

### Sources réutilisées
- `SB.admMyPerms()` : rôle effectif, clés de permissions et codes des wilayas affectées au compte courant (affectations actives).
- `SB.admAuditLast(20)` : jusqu'à 20 opérations récentes de `audit_logs`, selon ce que les politiques RLS autorisent à lire.
- Aucun nouvel endpoint, RPC, table, trigger, événement ou stockage ajouté.

### Réalisation
- Nouvel onglet `🛡️ الوصول والتدقيق · Access & Audit`, derrière la permission existante `reports.read`.
- Affiche le code de rôle, le nombre et les clés de permissions renvoyées, le nombre et les codes des wilayas affectées.
- Affiche les opérations renvoyées par le journal avec date, action, type/identifiant de cible, wilaya et identifiant d'acteur abrégé.
- Les valeurs dynamiques affichées sont échappées par `esq5()`.
- Un avertissement visible précise que cette page ne détecte pas les menaces et ne surveille pas les sessions en direct.
- Ajout des assertions `ADM-SEC-1` dans `tests/adm_test.mjs`.
- Commits : `d3403653f8520dd7f7d865fe259e5989c4b6f439` (vue) et `31339e724955fc5946d9485a3c3fd88b91a4d6da` (tests).
- CI #3039 / run `43083828141` sur le commit `d340365...` : **success**.
- CI #3040 / run `43083855288` sur le commit `31339e...` : en cours au moment de cette mise à jour documentaire ; vérifier le résultat final avant de déclarer le lot validé.
- CI #3038 / run `43083687815` sur le commit documentaire du Lot 300 : **success**.

### Limites et périmètre
- Le journal est un journal administratif selon RLS, pas un flux d'alertes de sécurité ni un historique complet des connexions.
- L'affichage des permissions ne remplace pas les contrôles SQL : `admin_can()`, `admin_sees_wilaya()` et les policies RLS restent souverains.
- Aucun contrôle de navigateur, de compte réel, de rôle réel ou d'affichage responsive exécuté.
- Aucun SQL/migration, aucune donnée ni configuration Supabase distante modifiée. Aucun changement Auth, secret, Worker, Cron, Realtime, e-mail, API GitHub, déploiement ou branche. Aucun module financier ajouté.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.

### Suite
1. Confirmer CI #3040.
2. Effectuer une vérification navigateur avec plusieurs profils administratifs autorisés et non autorisés.
3. Examiner ensuite les vues système uniquement si une source serveur fiable et sécurisée est identifiée ; aucune métrique de disponibilité ou de menaces ne doit être simulée.


### Rectification CI Lot 301 — suite de test ADM-SEC-1
- CI #3040 / run `43083855288` sur `31339e724955fc5946d9485a3c3fd88b91a4d6da` : failure due à une assertion trop stricte sur le texte de déclaration de carte (`id:'admSecurityCard'` alors que l'identifiant est créé par `box.id` et référencé dans `cards:[...]`). Les autres assertions ADM-SEC-1 étaient en succès.
- Correction limitée au test : l'assertion vérifie maintenant `cards:['admSecurityCard']`, sans modifier le code de production.
- Commit de correction : `c9a457f9aceeb51e06a09b6da1803245196e5b79`.
- CI #3042 / run `43084081392` sur ce commit : **success** ; le journal confirme les six assertions `ADM-SEC-1`, `adm_test : TOUT PASSE`, et la validation complète de l'administration.
- CI #3041 / run `43083993004` sur le commit documentaire précédent a échoué parce qu'il validait le HEAD de code antérieur à la correction du test. Une nouvelle CI est déclenchée par la présente mise à jour.


### Validation documentaire finale — Lot 301
- CI #3043 / run `43084185301` sur le commit documentaire `95e65224cac75d27217c02600c8f7c72f8d543ca` : **success**. Le contrôle des fichiers requis et la validation administration ont réussi.
- PR #17 reste ouverte, non fusionnée ; le commit applicatif corrigé `c9a457f9aceeb51e06a09b6da1803245196e5b79` a une CI complète en succès. La présente mise à jour déclenche une nouvelle CI documentaire à contrôler séparément.


### Lot 300/301 — cohérence du cache et du Service Worker (11 novembre 2026)
- Découverte : `index.html` chargeait encore `admin.js?v=3510`, tandis que les nouvelles vues et leurs assets n'étaient pas alignés sur les URL versionnées du Service Worker.
- Correction : `index.html` passe à `admin.js?v=3511` ; `sw.js` précache maintenant `./admin.js?v=3511`, `./assets/bdd/classe.json?v=3511` et `./assets/bdd/wilaya.json?v=3511`. La version du cache Service Worker est passée de `dz-de-v3.185.0.0.137` à `dz-de-v3.185.0.0.138`.
- `admin.js` charge les deux référentiels avec les mêmes paramètres de version ; les fichiers JSON eux-mêmes n'ont pas été modifiés.
- `ci/check-masar.mjs` vérifie désormais la version SW .138 et les versions précachées du script admin et des deux référentiels.
- Le contrôle `ci/check-public-portal.mjs` contenait également l'ancienne version SW .137. Il a été synchronisé vers .138 après que CI #3048 l'a signalé.
- Commits de cache : `0d277062002fb25f4caf8c588d8ba158b35833f8` (admin.js), `cb654a6f8a1272f23f61481b3fdde14afbf093ac` (index.html), `9f03de2592b503a39ac0452a6f93c97a82622415` (sw.js), `89f703cf097dd5292ff1da0e77f73b834ef2e723` (check-masar), `58452442ef233cd1ec048166f836a0fab7c1887e` (tests), `074ada2d23e1ea891c135d7d2205accc04e738a4` (assertions de cache), `434e82b1000041ce4252e59a0863dba74a0ee4b3` (check-public-portal).
- CI #3048 / run `43084923162` : failure car `ci/check-public-portal.mjs` attendait encore l'ancienne version .137 ; les tests admin et syntaxe JS étaient en succès.
- Après correction de ce contrôle, CI #3049 / run `43085197538` sur le commit `434e82b...` : **success**. Les logs confirment que le contrôle portail public reconnaît maintenant le Service Worker v3.185.0.0.138.
- Aucune donnée de référence n'a été modifiée ; aucun SQL, changement Supabase, Worker déployé ou modification de production n'a eu lieu.

### État d'exécution après Lot 301
- Vues présentes dans le code : tableau de bord, catalogue des classes, référentiel des wilayas, accès & audit, élèves/parents, opérations et paramètres selon permissions.
- Tests statiques ADM-DASH-1, ADM-REF-1 et ADM-SEC-1 présents ; CI applicative #3042 et CI complète cache/portail #3049 réussies.
- Le commit documentaire courant déclenchera une CI distincte ; vérifier son résultat séparément.
- Toujours aucune validation navigateur réelle, aucune session Supabase réelle, aucune preuve de rendu responsive, aucune fusion et aucun déploiement. PR #17 reste ouverte ; `main` inchangée.


## Lot 302 — inventaire technique vérifiable de l’administration (12 novembre 2026)

### Objectif et périmètre
- Ajouter une vue « 🖥️ النظام والبنية التقنية · System » à la console administrative existante.
- La vue est protégée par la permission déjà utilisée par les vues de référence, `reports.read`.
- Elle présente uniquement la configuration lisible dans le dépôt ; elle ne prétend pas mesurer la santé d'un service en production.

### Faits vérifiés dans le dépôt
- `wrangler.toml` désigne `src/site-worker.js` comme entrée du Worker.
- Le binding `ASSETS` sert le contenu statique depuis `./`.
- La date de compatibilité déclarée est `2024-09-01`.
- Le Worker contient un garde serveur sur certains chemins de contenus : il exige un Bearer token et vérifie l'accès à `lesson_content` via Supabase REST en utilisant les politiques existantes.
- Le code attend les noms de variables d'environnement `SUPABASE_URL` et `SUPABASE_ANON_KEY`. La vue n'expose aucune valeur de secret.
- Le Worker renvoie HTTP 503 sur les chemins protégés si ces variables ne sont pas configurées ; il refuse aussi l'accès si le jeton manque ou si le contrôle d'accès échoue.

### Limites explicitement affichées
- Le Worker inspecté n'implémente pas de route `/health` ou `/metrics`, ni de gestionnaire planifié `scheduled()`.
- Les fichiers consultés ne permettent pas de connaître l'uptime, la latence réelle, le CPU, la mémoire, la disponibilité actuelle de Supabase ou l'état d'un déploiement Cloudflare.
- La vue indique ces mesures comme « non mesurées / non vérifiées » au lieu de produire des valeurs fictives.
- Aucun appel de surveillance, aucune API GitHub côté navigateur, aucun token et aucune nouvelle dépendance ne sont ajoutés.

### Réalisation et tests
- `admin.js` : nouvel onglet `system`, carte `admSystemCard` et fonction `renderSystem()`.
- Les données présentées sont des libellés statiques dérivés de `wrangler.toml` et `src/site-worker.js`; la carte est intégrée au filtrage existant des onglets et ne réapparaît pas dans « Opérations ».
- `tests/adm_test.mjs` : cinq assertions `ADM-SYS-1` couvrent le contrôle `reports.read`, les sources, les noms des variables, l'absence de métriques inventées et le branchement de la navigation.
- Cache : `admin.js?v=3512`, Service Worker `dz-de-v3.185.0.0.139`; `index.html`, `sw.js`, `ci/check-masar.mjs` et `ci/check-public-portal.mjs` sont synchronisés.
- Commits : `7744ff3fc4ca2023f909733aadee761f0bced07b` (vue système), `3d55638fb18725eb0f0db203a75d3dee0d38e6c7` (tests), `8f8a31e5c1e46f9e4708582e793893433cbeb10c` (Service Worker), `6611801577b27d6db44e4a672a3d643f0d9ab4d3` (index), `d75224acaeac6d77e9df6d34213e524163b34c6b` (contrôle portail), `cf4cb2b32a093e2a7dc8a8336772e96aa4bededd` (contrôle Masar).

### Validation et état de livraison
- CI #3056 / run `43119052071` sur le commit `cf4cb2b32a093e2a7dc8a8336772e96aa4bededd` : en attente au dernier contrôle ; ne pas déclarer le lot validé avant le résultat final.
- Aucun essai navigateur, aucune vérification visuelle responsive, aucune mesure runtime et aucun test d'une session administrative réelle ne sont revendiqués.
- Aucun changement de schéma, migration, RLS, Auth, secret, donnée ou configuration Supabase distante ; aucun déploiement Cloudflare, aucune fusion et aucune modification de `main`.
- PR #17 reste ouverte et non fusionnée.

### Suite
1. Confirmer CI #3056 et la CI déclenchée par le présent addendum.
2. Vérifier visuellement l'onglet System sur ordinateur et mobile avec un compte autorisé.
3. N'afficher des indicateurs d'exploitation en direct qu'après mise en place et validation d'une source de télémétrie serveur adaptée, sans exposer de secret au navigateur.


### Rectification CI et validation finale — Lot 302
- Les exécutions intermédiaires #3054 à #3057 ont échoué sur des assertions de cache restées temporairement désynchronisées pendant les commits successifs : version SW attendue, version de `admin.js`, puis version attendue des JSON de référence.
- Les sources de référence `classe.json` et `wilaya.json` restent en v3511 ; seul `admin.js` passe en v3512. Les assertions ont été corrigées en conséquence dans `ci/check-masar.mjs`.
- CI #3058 / run `43119235099` sur le commit `1ce03711e831aa182297d972562d13d9bbf0dca2` : **success**. Le job « Validation structurelle & pédagogique » est terminé avec succès ; les contrôles d'administration, de syntaxe JavaScript, de cache et du portail sont passés.
- Les échecs intermédiaires étaient des incohérences d'assertions de cache, pas des échecs des cinq assertions `ADM-SYS-1` ; l'étape de validation administration est en succès dans le run final.
- Le commit documentaire du présent addendum déclenche une CI distincte ; son résultat doit être vérifié séparément.
- PR #17 reste ouverte et non fusionnée ; HEAD applicatif validé : `1ce03711e831aa182297d972562d13d9bbf0dca2`. Aucun changement sur `main`, aucun déploiement.


### Correctif immédiat — SyntaxError admin.js:602 (12 novembre 2026)
- Signalement navigateur : `Unexpected identifier 'un' SyntaxError: Unexpected identifier 'un' admin.js:602`.
- Cause confirmée dans `renderWilayas()` : apostrophe ASCII non échappée dans la chaîne JavaScript entre apostrophes simples, dans `autorisations d'un administrateur`.
- Correction appliquée : reformulation en `autorisations de chaque administrateur`, sans apostrophe à l'intérieur de la chaîne.
- Fichier : `admin.js`; commit correctif `811a1e04cba9699ab9c61014b6ea720e4aeab259`.
- Cette erreur de parsing empêchait le navigateur d'analyser le fichier entier, donc l'initialisation de l'administration pouvait être interrompue.
- À ce stade, le correctif est enregistré sur la branche de la PR #17. Les CI #3058/#3059 réussies sont antérieures à ce correctif et ne le valident donc pas. Attendre la CI déclenchée par le commit `811a1e0` avant de déclarer la correction vérifiée.
- Aucun changement Supabase, aucun déploiement, aucune fusion ; PR #17 reste ouverte.


## Lot 303 — audit en lecture seule des fonctions SECURITY DEFINER et dérive des scripts SQL (12 novembre 2026)

### Périmètre
- Reprise après les Lots 295–302, sans répéter leurs audits de prototypes et de tableau de bord.
- Inspection des scripts versionnés `supabase/schema.sql`, `supabase/fix_rls.sql`, `supabase/p0_locks.sql`, `supabase/plans.sql` et `supabase/msg_schema.sql`.
- Introspection PostgreSQL en lecture seule du projet Supabase actif : catalogue `pg_proc`, propriétaires, `search_path`, ACL effectives et triggers associés.
- Aucune requête de modification, aucun test d'exploitation, aucune migration ou modification distante.

### État réel du catalogue PostgreSQL
- 71 fonctions `SECURITY DEFINER` dans le schéma `public`.
- Les 71 appartiennent à `postgres` et les 71 possèdent une configuration `search_path` explicite.
- 42 fonctions sont exécutables par `authenticated`.
- Une seule fonction est exécutable par `anon` : `public.agreement_current(text)`.
- `public.agreement_current(text)` est également exécutable par `authenticated`. Son ACL effective conserve `EXECUTE` pour `PUBLIC`, `anon`, `authenticated` et `service_role`.
- Son corps renvoie la ligne complète de l'accord actif (`select *` sur `public.agreements`) : identifiant, clé, version, titre, corps, statut, créateur et date. Cela contourne la frontière de lecture directe RLS de la table pour les rôles anon/authenticated.
- Le correctif prévu au Lot 225 (révocation de `PUBLIC`, `anon` et `authenticated`, conservation de `service_role`) n'est pas reflété dans l'ACL actuellement observée. Le point reste ouvert ; aucune correction n'a été appliquée.
- Rectification du signalement antérieur sur `public.audit_log(...)` : son ACL réelle est limitée à `postgres` et `service_role`; `anon` et `authenticated` n'ont pas EXECUTE. L'absence d'un REVOKE visible dans un ancien extrait de script ne prouve donc pas une exposition dans la base active.
- `public.profiles_role_guard()` et `public.protect_role_niveau()` sont toutes deux attachées à `public.profiles`, en `BEFORE UPDATE`, avec `SECURITY DEFINER` et `search_path=pg_catalog, public`. `protect_role_niveau()` utilise `current_user` pour distinguer les rôles privilégiés ; dans une fonction SECURITY DEFINER, ce contexte est celui du propriétaire de la fonction. Ce test ne constitue donc pas, à lui seul, une distinction fiable de l'appelant. Les triggers séparés `profiles_role_guard` et `profiles_scope_guard` sont également présents ; aucun contournement effectif n'a été testé ni démontré dans ce lot.

### Dérive détectée entre scripts historiques et fonctions actives
- `supabase/msg_schema.sql` contient des définitions anciennes de helpers SECURITY DEFINER (`msg_is_moderator`, `msg_is_member`, `msg_member_ok`, `msg_not_blocked`, etc.) qui ne lient pas systématiquement l'argument utilisateur à `auth.uid()`. Les définitions actuellement installées contrôlées dans la base appliquent notamment cette liaison et, pour la modération, la permission `messaging.moderate`.
- `supabase/plans.sql` contient des versions historiques de `link_child` et `child_active_entitlement`, avec des GRANT et sans révocation explicite des droits par défaut. Dans la base active contrôlée, ces deux fonctions ne sont exécutables ni par `anon` ni par `authenticated`.
- `supabase/p0_locks.sql` contient l'ancienne version de `protect_role_niveau()` décrite ci-dessus.
- **Consigne de sécurité : ne pas réexécuter ces scripts historiques sur le projet actif.** Ils peuvent remplacer des définitions plus récentes et réintroduire une logique moins restrictive. Toute remise en cohérence devra partir d'un diff explicite entre script, migration et catalogue actif, après autorisation distincte.

### Résultat et limites
- Point confirmé à traiter en priorité : ACL trop large de `public.agreement_current(text)` et retour du composite complet.
- Point de conception à revoir : le test `current_user` dans le trigger SECURITY DEFINER `protect_role_niveau()`; la présence d'autres triggers protecteurs doit être conservée et testée avant toute proposition.
- Pas de vulnérabilité supplémentaire confirmée par le seul inventaire des ACL. Les 42 fonctions accessibles à `authenticated` doivent rester classées selon leur corps, leurs contrôles d'identité/permission, leur usage client et leur signature ; le nombre seul n'est pas une preuve de vulnérabilité.
- CI #3060 / run `43120208905` sur le commit `811a1e04cba9699ab9c61014b6ea720e4aeab259` : **success**, y compris syntaxe JavaScript et validation administration. Cela valide le correctif de parsing `admin.js:602`, pas les tests navigateur ni le présent audit SQL.

### Hors périmètre confirmé
- Aucune modification SQL, table, fonction, policy RLS, grant, migration, Auth, donnée ou paramètre distant.
- Aucun MFA/2FA, aucune facturation/paiement ajouté ou réactivé dans l'interface.
- Aucun déploiement Supabase/Cloudflare, aucune fusion, aucune modification de `main`. PR #17 reste ouverte et non fusionnée.

### Suite exacte
1. Continuer la revue fonction par fonction des RPC SECURITY DEFINER exécutables par `authenticated`, en donnant priorité aux fonctions administratives et aux fonctions qui retournent des données personnelles ; vérifier les contrôles `auth.uid()`, permission, périmètre wilaya et minimisation des colonnes.
2. Comparer chaque fonction à son usage réel dans le client et aux scripts/migrations versionnés, sans réexécuter les scripts historiques.
3. Conserver `agreement_current(text)` comme anomalie ouverte à documenter ; ne pas appliquer de REVOKE ni de migration sans instruction distincte.
4. La recette navigateur desktop/mobile et le contrôle de session admin réelle restent des étapes séparées, non réalisées.


## Lot 304 — contrôle du moindre privilège sur la fiche élève (12 novembre 2026)

### Périmètre
- Suite du Lot 303 : comparaison des RPC SECURITY DEFINER actives avec les permissions réellement définies et leur usage dans `admin.js` / `supabase/supabase.js`.
- Introspection PostgreSQL en lecture seule ; lecture du code de la branche `design/prototypes-67-74-alignment`.
- Aucun appel RPC avec un compte réel, aucune lecture de fiche personnelle, aucun test d'accès inter-comptes et aucune modification.

### Anomalie confirmée — `admin_student(uuid)`
- La fonction active vérifie uniquement `admin_can(auth.uid(), 'students.read')`, puis le périmètre de wilaya via `admin_sees_wilaya()`.
- Une fois ces contrôles passés, elle renvoie dans le même JSON :
  - le profil élève ;
  - les paiements (identifiant, montant, statut, méthode) ;
  - les reçus (numéro, montant, date) ;
  - les acceptations d'accords et leurs métadonnées.
- La matrice active des rôles confirme que `responsable_pedagogique` possède `students.read`, mais ne possède ni `payments.validate` ni `accounting.manage`.
- Le client `SB.admStudent()` appelle directement cette RPC. Dans `admin.js`, le résultat complet est sérialisé dans un bloc `<pre>` après échappement HTML. Un responsable pédagogique autorisé à consulter une fiche peut donc également recevoir et voir les montants, paiements, reçus et métadonnées d'accords de l'élève.
- Il s'agit d'un défaut confirmé de moindre privilège et de minimisation des données. Ce n'est pas une preuve d'accès inter-wilayas : le contrôle `admin_sees_wilaya()` reste appliqué.

### Mesure corrective recommandée — non appliquée
1. Limiter `admin_student()` aux données pédagogiques et d'identité strictement nécessaires à `students.read`.
2. Si un besoin administratif distinct le justifie, créer une réponse séparée pour les données de paiement/reçus, protégée par une permission financière dédiée et le même contrôle de wilaya. Ne pas réintroduire ces données dans la fiche pédagogique.
3. Retirer le rendu JSON brut de la fiche au profit d'une présentation explicite des champs autorisés.
4. Ajouter des tests de permissions couvrant au minimum `responsable_pedagogique`, `responsable_regional` et `admin_general`, avec des données synthétiques ; vérifier qu'un rôle pédagogique ne reçoit aucune donnée de paiement/reçu.
5. Cette correction doit respecter la décision produit de ne pas ajouter ni remettre en avant de module de facturation/paiement. Aucun écran financier nouveau n'est proposé par ce lot.

### Contrôles de cohérence associés
- `admin_dashboard()` renvoie aussi des agrégats `paiements_attente`, `recettes_confirmees_da` et `remboursements` sous la seule permission `reports.read`, même si le rendu actuel de `admin.js` n'affiche que les élèves, les vérifications, les signalements et le périmètre. À conserver comme point de minimisation secondaire : le serveur devrait idéalement ne retourner que les champs réellement nécessaires à cette vue.
- `admin_parent_role_requests()` et `admin_decide_parent_role_request()` utilisent `is_admin()` (profil `role='admin'`) au lieu de la matrice `admin_permissions`. Le contrôle est actuellement limité aux profils admin, mais ce chemin historique doit être confronté à la politique de gestion des rôles avant toute évolution. Aucun accès ou abus n'a été démontré.
- `admin_couverture_wilayas()` utilise aussi `is_admin()` comme voie d'accès globale, sinon exige `reports.read` et applique le périmètre de wilaya. Le comportement est cohérent avec le rôle admin général tel que défini dans la base, sous réserve de conserver l'alignement entre profil et affectations.

### Validation documentaire et CI
- CI #3062 / run `43264373044` sur le commit documentaire `edab5d15d966e7566d61ed47ec2b7ac6832debfa` : **success**. Les validations structurelles, pédagogiques, administration, messagerie, JavaScript et contrôles du dépôt ont terminé avec succès.
- Cette CI valide le dépôt et le correctif `admin.js:602`; elle ne teste pas l'autorisation SQL décrite dans ce lot.
- Le présent addendum déclenche une nouvelle CI documentaire ; son résultat doit être contrôlé séparément.

### Hors périmètre confirmé
- Aucune modification SQL, RPC, RLS, GRANT, table, donnée, Auth ou paramètre Supabase.
- Aucune modification de `admin.js` ou `supabase/supabase.js`.
- Aucun MFA/2FA, aucune facturation ou paiement ajouté, aucune nouvelle dépendance.
- Aucun déploiement, aucune fusion et aucune modification de `main`. PR #17 reste ouverte et non fusionnée.

### Suite exacte
1. Corriger ultérieurement `admin_student()` et son rendu client, uniquement dans la branche de la PR après validation de cette correction de moindre privilège.
2. Ajouter des tests négatifs par rôle avec fixtures synthétiques ; ne pas utiliser de vrais dossiers élèves.
3. Vérifier séparément `agreement_current(text)` (Lot 303), qui reste exécutable par `anon` et retourne le composite complet.
4. Une fois ces points de sécurité documentés et la CI confirmée, clôturer cette passe d'audit et attendre le prochain prototype fourni par l'utilisateur.


## Lot 305 — audit du prototype « المراسلة المدرسية (0→7) » (12 novembre 2026)

- Prototype HTML de 544 lignes examiné et comparé à la messagerie existante de la PR et à la base Supabase active.
- Rapport détaillé : [docs/security/LOT-305-messaging-levels-prototype-audit.md](security/LOT-305-messaging-levels-prototype-audit.md), commit rapport `f135000ccca62bee5155ee45f7ab25a7cc0c6682`.
- Décision : **NO-GO pour intégrer le prototype tel quel ou exécuter son SQL**. La page est une maquette statique : messages/conversations codés en dur, envoi simulé, escalade simulée, boutons de recherche/nouvelle conversation/fichier/exercice/récompense non reliés au backend.
- Architecture active confirmée en lecture seule : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`, toutes avec RLS activé. Aucun `public.messages`; les colonnes `level`, `subject_id`, `class_id`, `is_read` du prototype ne sont pas dans `msg_messages`.
- La publication Realtime active inclut `msg_messages` et `msg_conversations`. Le client existant `msg.js` / `supabase/supabase.js` gère déjà conversations, groupes, DM, envoi, présence, pièces jointes, vérification, signalements, blocage et modération. Ne pas créer une deuxième messagerie.
- Écart de rôle confirmé : `msg_can_dm(a,b)` exige deux profils vérifiés du même wilaya/niveau/filière, mais ne contrôle pas `profiles.role`. La base ne garantit donc pas la règle prototype « élève → professeur uniquement » ; deux élèves vérifiés du même groupe peuvent satisfaire la condition. Correction recommandée côté SQL/RLS avec matrice de rôles et tests négatifs, non appliquée.
- Écart d'audit confirmé : `audit_logs` existe, mais ses colonnes sont `acteur`, `action`, `cible_type`, `cible_id`, `avant`, `apres`, `wilaya` ; le snippet utilise les colonnes inexistantes `user_id` et `details`. Aucun trigger actif n'a été constaté pour journaliser chaque INSERT de `msg_messages`. `msg_log` journalise des actions de modération/suppression, pas chaque message envoyé.
- Autres lacunes du SQL prototype : seul le niveau 1 est contrôlé ; pas de liaison explicite `NEW.sender_id = auth.uid()`, pas de policy INSERT dans le snippet, pas de trigger de déclenchement, pas de `verif_guard`, pas de validation cohérente classe/matière/enseignant, et fonction SECURITY DEFINER sans search_path fixé.
- Niveau 5 « rapports financiers » exclu du périmètre ; ne pas réintroduire de module de paiement/facturation. Niveau 7 ne doit pas promettre une réponse immédiate sans chaîne d'astreinte et SLA.
- CI #3063 / run `43269906495` sur le commit documentaire précédent : **success**, y compris l'étape de validation de la messagerie. Cette CI ne teste pas l'autorisation réelle avec des comptes ni le navigateur.
- Aucun changement applicatif, SQL, migration, RLS, GRANT, Auth, Storage ou données Supabase. Aucun MFA/2FA, paiement, déploiement, merge ou changement sur `main`. PR #17 reste ouverte et non fusionnée.
- Prochaine priorité : décider et corriger la matrice de rôles DM (élève ↔ professeur) côté serveur, avec tests négatifs, avant toute adaptation visuelle des niveaux 0→7. Les autres niveaux exigent une définition explicite des rôles, permissions, destinataires et notifications.



## Lot 306 — nouvelle orientation : Messenger scolaire (12 novembre 2026)

- Préférence produit clarifiée par l'utilisateur : il souhaite un **véritable système de messagerie de type Messenger de Facebook/Meta**, plutôt qu'une page structurée autour de 8 niveaux fixes.
- Décision UX : expérience conversationnelle centrée sur la boîte de réception, la recherche, les DM autorisés, les groupes, le fil, les pièces jointes, les états de présence/lecture et les notifications. Les niveaux 0→7 deviennent au mieux des catégories ou actions institutionnelles secondaires, jamais la navigation principale.
- Spécification produit : [docs/product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md](product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md), commit `e1255333987af3ea10edf15a30983c72f1c72bdb`.
- La référence est l'expérience d'usage Messenger (liste de conversations, fil, détails, mobile), sans copier marque, identité ou code Meta.
- La plateforme conserve son backend `msg_*` existant : `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_blocks`, `msg_reports`, `msg_log`. Aucun second `public.messages`.
- Fonctions déjà présentes côté client : liste des conversations, lecture paginée, envoi, DM, groupes, upload, édition/suppression, blocage, signalements et modération. Realtime est déjà utilisé pour les nouveaux messages et une présence agrégée ; ne pas afficher « écrit… » ni les reçus de lecture comme actifs avant leur implémentation réelle.
- Évolutions futures (après audit) : reçus individuels par membre, saisie éphémère, réactions, réponses, épingles, archivage, notes vocales et recherche dans les messages. Les statuts doivent être basés sur des données/événements réels, jamais simulés.
- Garde sécurité prioritaire : corriger la matrice des rôles et le rattachement pédagogique de `msg_can_dm(a,b)`, qui ne suffit pas actuellement à interdire le DM élève→élève. Tests négatifs RLS requis avant ouverture générale.
- Découpage prévu : A UX shell Messenger dans `msg.js`; B sécurité DM; C MVP conversation réel; D états sociaux; E interactions avancées; F services scolaires (groupes de classe, parents et transfert administratif).
- Aucun code applicatif, SQL, migration, RLS, GRANT, Auth, Storage ou donnée Supabase modifié dans ce lot de conception. Aucun MFA/2FA, paiement/facturation, dépendance frontend, déploiement, merge ou changement sur `main`. PR #17 reste ouverte et non fusionnée.
- Prochaine étape : démarrer la composition UX de la boîte de réception Messenger dans la vue existante, en parallèle de la préparation des tests de rôle ; toute migration reste séparée et soumise à validation avant application.



## Lot 307 — décision de réseau scolaire national (12 novembre 2026)

- Nouvelle précision utilisateur : **les étudiants doivent pouvoir discuter avec des étudiants de tous les lycées et de toutes les wilayas d'Algérie**, et non uniquement avec leur établissement ou leur groupe local.
- Décision produit : faire évoluer la vision Messenger scolaire vers un réseau national couvrant les 58 wilayas et les lycées présents sur la plateforme.
- La règle antérieure « élève ↔ élève interdit en DM par défaut » est donc remplacée pour le produit cible : les DM entre étudiants vérifiés de lycées/wilayas différents sont autorisés, sous réserve de confidentialité, invitation/acceptation si nécessaire, blocage, signalement, limitation anti-spam et modération.
- L'appartenance à la même wilaya, au même lycée, au même niveau ou à la même filière ne doit pas être une condition pour communiquer entre étudiants. Cette contrainte actuelle de `msg_can_dm(a,b)` doit être réévaluée côté serveur ; aucune modification SQL/RLS n'a été faite.
- Expérience prévue : annuaire national avec recherche et filtres lycée/wilaya/niveau/filière ; profils publics minimisés ; demandes de contact ; DM inter-lycées ; groupes nationaux par matière, langue, préparation BAC et entraide ; groupes locaux conservés en parallèle.
- Les emails, téléphones, matricules, adresses et identifiants internes ne doivent jamais être exposés dans l'annuaire. Un profil visible n'implique pas que les messages entrants soient ouverts à tous.
- Sécurité : authentification et vérification scolaire côté serveur, paramètres de confidentialité, contrôle des invitations, limitation de fréquence, anti-énumération, modération nationale et tests RLS synthétiques incluant les cas inter-wilayas, bloqués, non vérifiés et suspendus.
- Les DM élève ↔ professeur restent séparés et exigent un rattachement pédagogique réel. Les règles de rôles professionnels et d'administration restent inchangées.
- Spécification mise à jour : [docs/product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md](product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md), commit `a48efa39a1b4b68fd83896184ec027d3099c7ab8`.
- Aucun code applicatif, SQL, migration, RLS, GRANT, Auth, Storage ou donnée Supabase modifié. Aucun MFA/2FA, paiement/facturation, déploiement, merge ou changement sur `main`. PR #17 reste ouverte et non fusionnée.
- Prochaine étape : concevoir l'annuaire national et l'UX de découverte dans `msg.js`, après inspection des fonctions de recherche de profils et des règles RLS existantes. La recherche ne doit pas exposer directement la table `profiles` ni charger tous les profils côté client.


## Lot 308 — première évolution fonctionnelle de la boîte de réception Messenger (12 novembre 2026)

### Référence visuelle reçue
- Deux captures Messenger mobile fournies par l'utilisateur servent de référence UX : menu (communautés, invitations par message, archives, invitations à rejoindre un canal, paramètres) et boîte de réception (recherche, contacts/raccourcis, conversations récentes, non-lus, nouvelle conversation).
- Direction retenue : reprendre les conventions d'usage, sans copier la marque, le logo ou le code Meta, et conserver l'identité algérienne / arabe RTL.

### Changements réalisés sur la branche PR #17
- `msg.js` : ajout d'une barre de recherche locale dans les conversations et groupes déjà chargés, et de filtres « Tout / Privées / Groupes ».
- Les éléments filtrables sont alimentés par les vraies lignes renvoyées par `msgGroups()` et `msgConvs()`. Aucun faux contact, faux message, statut fictif ou donnée de démonstration n'est ajouté.
- Le libellé de l'espace est repositionné comme une messagerie scolaire nationale ; l'absence de DM est explicitement décrite sans suggérer qu'une recherche nationale de contacts existe déjà.
- `style-prototype-dz.css` : styles responsive pour l'en-tête Messenger, la recherche, les filtres et les cartes ; prise en charge clair/sombre.
- `index.html` : cache CSS incrémenté de `v193` à `v194`.

### Limites fonctionnelles constatées — à ne pas masquer
- La recherche actuelle ne cherche que dans les conversations et groupes déjà retournés par le compte (limite actuelle de 50) ; elle ne constitue PAS l'annuaire national des étudiants.
- L'interface de demande d'invitation, la boîte « invitations par message », l'archive, les canaux, la découverte des communautés, les avatars réels et les reçus de lecture ne sont pas encore implémentés comme fonctions complètes.
- L'envoi de fichiers existe côté client (PNG/JPEG/WebP/PDF, 5 Mo), mais le fil actuel ne présente pas encore une expérience complète de pièce jointe avec aperçu image, téléchargement sécurisé, progression et reprise d'erreur. Ne pas annoncer cette fonction comme finalisée.
- Les états de présence/temps réel existants ne doivent pas être assimilés à des reçus de lecture ni à un indicateur « écrit… ».

### Sécurité et suite
- Avant annuaire national / invitations / DM inter-wilayas : définir une RPC ou une couche serveur de recherche minimisée, vérifier identité scolaire, visibilité, consentement, blocage, signalement, quotas, anti-énumération et RLS ; la restriction de même wilaya dans `msg_can_dm` doit être revue côté serveur.
- Avant d'afficher les pièces jointes : lire les métadonnées depuis `msg_attachments` sous RLS et créer des URL signées de courte durée depuis le bucket privé `prive`, sans rendre le bucket public.
- Aucun SQL, migration, politique RLS, GRANT, Auth, Storage, donnée Supabase, MFA/2FA ou paiement modifié dans le Lot 308.
- Aucun changement direct sur `main`, aucun merge ni déploiement. PR #17 reste ouverte.
- CI structurelle déclenchée par les commits du lot ; validation navigateur réelle ordinateur/mobile et test de compte cloud restent à effectuer.

### Commits Lot 308
- `msg.js` : `51e0dc80a785991d9eb75c13feb36bfc25970aca`.
- `style-prototype-dz.css` : `cd85d343269153cec08a7cd27ca210b34f37cdbf`.
- `index.html` : `d55b5517bca974b8d77871b1b0bfca306e4eb75b`.

### Prochaine séquence de réalisation
1. Construire la vue fil Messenger et les vraies pièces jointes (aperçu, téléchargement signé, erreurs d'upload) à partir des tables et politiques existantes.
2. Concevoir le menu et les vues Invitations / Archivées / Communautés seulement après confirmation du modèle serveur correspondant.
3. Préparer la recherche nationale et les invitations en backend, puis tests RLS synthétiques ; pas de lecture directe non bornée de `profiles`.


## Lot 309 — pièces jointes Messenger dans les fils (12 novembre 2026)

### Modifications réalisées sur la branche PR #17
- `msg.js` : le rendu des messages récupère maintenant les métadonnées de pièce jointe par message et affiche les images dans le fil (aperçu avec ouverture en grand) ou un lien d'ouverture pour les PDF. Les lignes Realtime nouvellement reçues utilisent le même rendu.
- `supabase/supabase.js` : ajout de `msgAttachmentInfo(messageId)`. La fonction interroge `msg_attachments` avec le filtre `message_id`, puis génère une URL signée temporaire (15 minutes) dans le bucket privé `prive`. L'accès réel reste conditionné par les politiques RLS et Storage existantes.
- Statuts vérifiés dans `supabase/msg_schema.sql` : valeurs autorisées `pending`, `ok`, `retire`. L'interface masque les pièces jointes retirées ; les pièces en attente restent accessibles uniquement si les politiques Storage/RLS l'autorisent. Aucun faux statut « approved/active » n'est utilisé.
- Sélection de fichier : contrôle client du MIME (PNG/JPEG/WebP/PDF) et du plafond 5 Mo avant envoi ; message d'erreur visible si l'envoi ou le téléversement échoue ; indication de téléversement et confirmation après réussite.
- Zone de rédaction : Entrée envoie le message, Maj+Entrée conserve le saut de ligne.
- CSS ciblé pour les aperçus, liens de fichiers et états d'envoi, avec variante sombre.
- Cache actualisé : `style-prototype-dz.css?v=195`, `msg.js?v=3511`, `supabase/supabase.js?v=3519`, Service Worker `dz-de-v3.185.0.0.140`.

### Limites et vérifications restantes
- Les pièces jointes ne sont pas encore testées en conditions réelles avec deux comptes scolaires distincts ; les liens signés et l'accès inter-membres dépendent des règles RLS/Storage déjà déployées.
- La valeur `statut='pending'` est autorisée par le schéma ; aucune nouvelle validation de modération n'a été ajoutée. Les pièces `retire` ne sont pas rendues.
- Le message de pièce jointe est créé avant le téléversement : si le téléversement échoue, un message de référence peut rester dans la conversation. L'erreur est désormais affichée, mais le nettoyage atomique demanderait une évolution serveur.
- Aucun changement SQL, migration, RLS, GRANT, Auth, Storage policy, données, MFA/2FA, paiement ou facturation. Aucun déploiement ni merge ; `main` inchangé et PR #17 reste ouverte.

### Prochaine étape
- Vérifier la CI du Lot 309, puis concevoir les invitations par message (accepter/refuser) et l'annuaire national via une RPC sécurisée. Ne pas exposer `profiles` directement ni réutiliser sans correction la règle locale actuelle de `msg_can_dm`.


### Optimisation Lot 309 — chargement groupé des pièces jointes
- Après revue du premier rendu, remplacement des requêtes unitaires par message par une lecture groupée des pièces jointes de la page de conversation, suivie de la création des URLs signées nécessaires. Cela évite une requête PostgREST par message dans un fil de 50 éléments.
- Méthode cliente finale : `msgAttachmentInfos(messageIds)`; le rendu Realtime utilise le même chemin avec un seul identifiant.
- Cache final : `msg.js?v=3512`, `supabase/supabase.js?v=3520`, `style-prototype-dz.css?v=195`, Service Worker `dz-de-v3.185.0.0.141`.
- CI #3076 et #3077 échouent tous deux sur un contrôle préexistant du portail public : `style.css?v=3515` alors que `ci/check-public-portal.mjs` attend `v176`. Les contrôles messagerie `ci/check-msg.mjs` et `tests/msg_test.mjs` passent dans le log #3076. Le contrôle du portail est hors périmètre du lot ; il n'a pas été modifié pour éviter un changement non justifié.
- Le correctif regex de détection d'image et le chargement groupé ont été poussés après ces exécutions : nouvelle CI à examiner sur le HEAD courant avant de déclarer le lot validé.

- Résultat final de la CI #3079 (HEAD code batch `7437c687`) : échec identique au contrôle « Vérifier le portail public (catalogue et inscription) ». Le job n'échoue pas sur les étapes messagerie ; le motif détaillé reste la divergence de version du CSS du portail public documentée ci-dessus. La validation globale du lot 309 reste donc bloquée par ce contrôle hors périmètre.


## Lot 310 — audit des invitations Messenger (12 novembre 2026)

- Audit réalisé en lecture seule de `msg.js`, `supabase/supabase.js` et `supabase/msg_schema.sql`.
- Constat : `msgOpenDirect(otherId)` crée directement un DM et tente d'insérer expéditeur + destinataire. La politique `msg members ajout` exige `auth.uid() = user_id` ; le client ne peut donc pas ajouter le destinataire. `msg_member_ok` accepte tout type direct et ne constitue pas un consentement.
- La définition finale de `msg_can_dm` exige deux profils vérifiés avec wilaya, niveau et filière identiques : cela bloque actuellement les DM nationaux inter-lycées/inter-wilayas.
- Aucune table `msg_invites` n'existe. Le cycle d'invitation ne peut pas être livré correctement par un simple changement d'interface.
- Rapport : `docs/security/LOT-310-audit-invitations-messenger.md`, commit `c0fef879`.
- Spécification mise à jour : `docs/product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md`, commit `f95f0dfc`.
- Décision : invitation `pending` sans conversation ; acceptation/refus par le destinataire ; annulation par l'expéditeur ; création transactionnelle du DM uniquement à l'acceptation. Contrôles serveur : identité vérifiée, blocage bilatéral, préférences, limites anti-spam, statut du compte et idempotence.
- Aucun code applicatif, SQL, migration, RLS, GRANT, Auth, Storage, donnée Supabase modifié ou exécuté. Aucun MFA/2FA, paiement/facturation, merge ou déploiement ; PR #17 reste ouverte et `main` inchangé.
- Prochaine étape : préparer une migration SQL et des tests RLS/RPC synthétiques, sans exécution, puis intégrer les écrans de demandes reçues/envoyées après validation du modèle.


## Lot 311 — prérequis des invitations nationales Messenger (12 novembre 2026)

- Vérification du schéma versionné `schema.sql` et `msg_schema.sql` : `profiles` expose notamment rôle, niveau, filière, wilaya et statut de vérification ; `msg_blocks`, `msg_conversations` et `msg_members` existent déjà.
- Bloquant identifié : aucune relation canonique active élève↔lycée ni préférence de découverte / statut de suspension exploitable n'a été démontrée. Les seuls champs wilaya/niveau/filière ne prouvent pas une affiliation scolaire nationale.
- Préparation du contrat de migration et de la matrice de tests dans `docs/security/LOT-311-invitations-migration-preflight.md`. La migration SQL exécutable est volontairement suspendue jusqu'à confirmation de la source d'affiliation et des règles de visibilité.
- Décision : réseau national inter-lycées/inter-wilayas maintenu comme objectif, mais invitations `pending` sans conversation ; création du DM et des deux membres atomique uniquement à l'acceptation par le destinataire. Anti-blocage bilatéral, anti-doublon, idempotence, pagination, anti-énumération et profils minimaux requis.
- Aucun code applicatif, SQL exécutable, migration, RPC, RLS, GRANT, Auth, Storage ou donnée Supabase modifié/exécuté. Aucun MFA/2FA, paiement/facturation, merge ou déploiement ; `main` inchangée.
- Prochaine action : confirmer la source institutionnelle canonique de l'affiliation élève↔lycée et les champs visibles dans l'annuaire. Après cela : migration + tests PostgreSQL isolés ; pas d'application sur Supabase actif sans autorisation distincte.


## Lot 312 — réponse établie : aucune source officielle lycée↔élève n'est présente (12 novembre 2026)

L'enquête a été menée directement dans le dépôt GitHub, les migrations et le projet Supabase actif `azjwcybivirvpxbfhyzk`, en lecture seule. La question précédemment posée à l'utilisateur est donc résolue par l'audit : **la source d'affiliation officielle n'existe pas actuellement dans l'architecture inspectée**.

- Le schéma actif `public.profiles` contient `niveau`, `filiere`, `wilaya`, `matricule`, `section`, mais aucun identifiant de lycée/établissement et aucune relation d'inscription. La recherche dans les tables/colonnes `public` et `auth` n'a révélé aucune table `schools/lycees/etablissements/enrollments/inscriptions/classes` faisant autorité.
- Le trigger d'inscription de `supabase/schema.sql` enregistre uniquement pseudo, niveau, filière et wilaya depuis les métadonnées utilisateur ; `app.js` envoie les mêmes quatre valeurs. Aucun lycée n'est collecté.
- `matricule` et `section` ont été ajoutés pour la vérification de messagerie ; l'élève les saisit dans deux champs texte, puis un professeur/admin peut marquer le profil vérifié. Aucun justificatif ou registre d'établissement n'est contrôlé : ce statut n'est pas une preuve d'inscription au lycée.
- L'état réel agrégé de la base au moment de l'audit : 5 profils élèves, tous `non_verifie`, 0 avec matricule, 0 avec section. Aucune identité individuelle n'a été consultée.
- `assets/bdd/classe.json` est une maquette statique (cinq classes, effectifs fictifs/illustratifs), sans lien avec les comptes Auth. Ne pas l'utiliser comme source d'autorité.
- Les Workers Cloudflare présents dans le dépôt traitent l'IA et l'envoi d'emails ; aucun service de registre scolaire n'a été trouvé.

**Conséquence :** ne pas ouvrir la recherche nationale ni les invitations inter-lycées en s'appuyant sur wilaya/niveau/filière ou sur la vérification actuelle. Ne pas assouplir `msg_can_dm`. Une source institutionnelle ou un processus d'admission administratif traçable devra être conçu avant la migration des invitations.

Aucun changement applicatif ou Supabase, aucune migration/SQL d'écriture, aucun changement Auth/RLS/GRANT/Storage/Cloudflare, aucun merge ni déploiement. PR #17 reste ouverte, `main` inchangée.


## Lot 313 — conception du registre national des établissements et inscriptions (12 novembre 2026)

- Le travail continue sans solliciter l'utilisateur pour localiser une source technique : l'audit avait établi que la source d'affiliation n'existe pas dans le schéma actif inspecté.
- Création de `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md` : modèle séparant référentiel des lycées et inscriptions annuelles individuelles, preuves, rôles de validation, imports traçables, cycle annuel, confidentialité et contrat de découverte Messenger.
- Piste officielle vérifiée : Bulletin officiel du ministère n° 618 (juillet–août 2022) publie des actes de création/annulation d'établissements ; utile comme source juridique de changements mais pas comme annuaire national complet et actualisé. URL : https://www.education.gov.dz/wp-content/uploads/2023/06/boen-618-1.pdf
- Les tableaux ONS trouvés fournissent des effectifs agrégés de lycées par wilaya pour des années antérieures ; ils ne contiennent pas les identités des établissements ni les inscriptions des élèves : https://www.ons.dz/IMG/pdf/Education-3.pdf
- Aucun endpoint ou export officiel exhaustif actualisé n'a été confirmé. Étape suivante : rechercher/obtenir un export officiel nominatif ou un protocole de validation via ministère/DEW ; ne pas inventer le référentiel à partir de données de maquette ou de sources non autorisées.
- Décision : référentiel géographique versionné ; code officiel établissement ; inscriptions historisées par année scolaire ; preuve contrôlée (code à usage unique émis par établissement privilégié, import institutionnel signé en alternative, vérification documentaire minimale en dernier recours). Un profil professeur/admin ordinaire ne reçoit pas automatiquement le droit de valider des inscriptions.
- Annuaire Messenger uniquement pour comptes avec inscription courante vérifiée, profils minimaux, pagination, rate-limit, anti-énumération, préférences et blocage bilatéral. Les profils en attente/non inscrits ne sont pas découvrables.
- Aucun code applicatif ni SQL/Migration/RLS/GRANT/Auth/Storage exécuté ou appliqué ; aucun changement Cloudflare, déploiement, merge ou modification de `main`. PR #17 reste ouverte et non fusionnée.
- CI du commit documentaire à vérifier avant de qualifier le lot de validé.


## Lot 314 — inventaire des sources officielles du registre des lycées (12 novembre 2026)

- Recherche documentaire terminée et consignée dans `docs/product/LOT-314-INVENTAIRE-SOURCES-OFFICIELLES-LYCEES.md`.
- Source primaire confirmée : JORADP, décret exécutif n° 24-224 (JO n° 48 du 14 juillet 2024), annexes de créations/suppressions applicables à la rentrée 2022-2023. Les lignes contiennent codes wilaya/commune, numéro d'identification nationale, dénomination et adresse. Source : https://www.joradp.dz/FTP/jo-francais/2024/F2024048.pdf.
- Sources complémentaires : décret n° 22-253 (JO n° 48 du 17 juillet 2022) et décret n° 21-519 (JO n° 97 du 27 décembre 2021). L'article 82 de la loi n° 08-04 établit que la création/suppression des lycées intervient par décret.
- Ces actes constituent un historique partiel de changements, pas un registre exhaustif et actuel des lycées actifs en 2026-2027. Aucun export public centralisé et actualisé n'a été confirmé. Les annuaires privés/cartographiques et statistiques agrégées ONS ne sont pas des substituts.
- Décision : demande institutionnelle d'un export courant au ministère/DEW, avec codes, identifiants, statuts, dates d'effet, provenance et mécanisme de mise à jour. NO-GO pour une liste publique prétendument exhaustive, import production ou annuaire/invitations Messenger avant validation officielle.
- Prochaine étape : Lot 315, prototype de prévisualisation/import avec données synthétiques, sans écriture Supabase.
- Contrôle CI du HEAD précédent `5e712a7b83ef30ad77eb2d8a5047783da15feb98` : run 43279775155, échec unique au contrôle portail public car `ci/check-public-portal.mjs` attend le cache-busting CSS `v176`. Les validations structurelles, données, JavaScript, messagerie et administration listées avant ce contrôle sont passées. Le diagnostic exact est indépendant du lot 314 ; aucune correction n'a été apportée dans ce lot et le CI n'est pas déclaré vert.
- Aucun code applicatif, SQL/migration, donnée Supabase, Auth/RLS/GRANT/Storage, configuration Cloudflare ou déploiement modifié. Aucun merge ni changement de `main`. PR #17 reste ouverte et non fusionnée.


### Correctif CI/cache public — synchronisation vérifiée statiquement (12 novembre 2026)

- Diagnostic : le HTML de la branche chargeait `style-prototype-dz.css?v=195`, tandis que le précache du Service Worker et les assertions CI attendaient encore `v193`. Le contrôle CI comportait aussi une attente de version SW `dz-de-v3.185.0.0.139`, alors que le SW était déjà en `.141`. Les messages de diagnostic étaient eux-mêmes restés sur v176/.138.
- Correction limitée : `sw.js` passe à `dz-de-v3.185.0.0.142` et précache le CSS `v195`. `ci/check-public-portal.mjs` vérifie maintenant CSS `v195` et SW `.142`, avec messages alignés.
- Commits : SW `7e84ec0da3d6306079f5a6a08bd72e4000ce162d`; contrôle CI `613c981c7da627806437e1499cbe61bd70a19ba0`.
- Le contrôle structurel doit encore être exécuté par GitHub Actions sur le nouveau HEAD. Ne pas annoncer le CI vert avant résultat effectif.
- Aucun déploiement Cloudflare ni merge. PR #17 reste ouverte ; `main` inchangée.


## Lot 315 — prototype de prévisualisation/import du registre (12 novembre 2026)

### Livrables sur la branche PR #17

- `prototypes/registry-import-preview.html` : écran autonome de prévisualisation CSV, statistiques de validation, modèle CSV et export du rapport d'anomalies.
- `prototypes/registry-import-core.mjs` : parseur CSV et validations structurelles/métier.
- `prototypes/registry-import-core.test.mjs` : 8 tests Node natifs.
- `docs/product/LOT-315-PROTOTYPE-IMPORT-REGISTRE.md` : périmètre, contrat CSV, limites et protocole de test.
- `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md` : section Lot 315 ajoutée.

### Contrôles implémentés

- En-têtes exacts requis ; en-têtes inconnus/dupliqués et colonnes excédentaires rejetés.
- CSV avec virgules et guillemets échappés.
- Champs obligatoires, statuts provisoires et date ISO calendaire contrôlés.
- Doublons détectés pour `source_id` et `identifiant_national`.
- Identifiants `SYN-*` et sources/références de démonstration marqués non importables.
- Rapport CSV avec neutralisation des cellules de formule pour éviter l'exécution accidentelle dans un tableur.
- Trois lignes de démo fictives, avec doublon volontaire, affichées par défaut.

### Limites de sécurité

Prototype séparé dans `prototypes/`, non raccordé à la navigation de l'application. Aucun appel réseau, aucun envoi de fichier, aucun stockage local, aucune connexion Supabase. Le bouton d'import est désactivé. Aucune authentification, preuve officielle, activité réelle d'un lycée ou affiliation d'élève n'est vérifiée. Le vocabulaire de statut est provisoire et doit être confirmé par l'autorité émettrice.

### Tests

- 7 contrôles de parsing/validation ont été exécutés localement avec Node lors de la revue de la logique (CSV cité, guillemet non fermé, ligne structurée, doublon, identifiant synthétique, date/statut invalides, en-têtes/colonnes incorrects).
- Le fichier de test automatisé contient 8 cas ; la commande prévue est `node --test prototypes/registry-import-core.test.mjs`.
- L'exécution de ce fichier exact et le résultat GitHub Actions restent à confirmer ; ne pas annoncer le CI vert avant résultat réel.

### Décision

GO pour la maquette isolée uniquement. NO-GO pour l'import, le déploiement, l'annuaire national, les affiliations ou toute écriture Supabase. Le lot suivant doit être une revue du contrat et du protocole d'approbation institutionnel, avant toute conception de migration.

Aucun changement Supabase (schéma/données/RLS/GRANT/Auth/Storage), aucun changement Cloudflare, aucun déploiement, aucun merge, aucune modification de `main`. PR #17 doit rester ouverte.


### Contrôle CI supplémentaire — cache Supabase et exécution des tests Lot 315

- Le run précédent `43281953862` a échoué au contrôle portail public : `index.html` chargeait `supabase/supabase.js?v=3520`, mais `sw.js` et `ci/check-public-portal.mjs` attendaient encore `v3518`.
- Correctif : précache SW synchronisé sur `v3520`, version SW incrémentée à `dz-de-v3.185.0.0.143`, assertions CI/messages mises à jour.
- Commits : SW `6f993ddc1d45a913ce7de89fd2ccd395f938861c`; contrôle CI `36fae020ae89afd2d4e8e4498af877c364b6d257`.
- Pour ne pas laisser les tests du prototype hors CI, `.github/workflows/deploy.yml` vérifie désormais la présence des trois fichiers Lot 315 et exécute `node --test prototypes/registry-import-core.test.mjs`. Le workflow consulté est un job de validation ; aucune étape de déploiement n'y a été ajoutée.
- Commit workflow : `b7b39f3f9e7634bfb308ea05cbf29e94417778ca`.
- Nouveau run PR #17 : `43282238264`, en cours au dernier contrôle. Le résultat du test Lot 315 et le statut global restent à confirmer.


### Résultat CI du run 43282238264 et second correctif de cache

- Le nouveau test automatisé Lot 315 a bien été exécuté par GitHub Actions et a terminé avec succès dans le job (étape `Tester le prototype CSV du registre des lycées (Lot 315)`).
- Le job global a encore échoué plus loin dans `ci/check-public-portal.mjs`, cette fois à la ligne 442 : l'assertion du guide de bienvenue attendait toujours la version SW `dz-de-v3.185.0.0.139`, alors que le Service Worker a été incrémenté à `.143`.
- Correctif appliqué dans `ci/check-public-portal.mjs` : assertion du guide alignée sur `.143`. Commit `1d246c52e00c4568d96a0582ec7679d088c5da1c`.
- Le run suivant doit confirmer l'ensemble ; CI global non déclaré vert à ce stade.


### Correctif CI — assertions historiques du dashboard مسارك

- Run `43282427341` : contrôle portail public réussi, y compris l'assertion guide/Service Worker après correction.
- L'échec suivant se trouvait dans `ci/check-masar.mjs` : trois assertions conservaient CSS `v193` et Service Worker `.139`, alors que HTML/SW sont désormais synchronisés sur CSS `v195` et SW `.143`.
- Assertions du contrôle مسارك mises à jour sur ces versions : commit `cc3fbfad4c5795a53c7b360094097a034dbb11db`.
- Le test Lot 315 a réussi dans le run précédent. Le prochain run doit reprendre la suite complète ; résultat global encore en attente.


### Correctif CI — assertion cache CSS de la gamification

- Run `43282610083` : les contrôles portail public et مسارك sont maintenant passés. L'étape suivante a révélé une assertion historique dans `ci/check-gamification.mjs` qui attendait encore le CSS précaché `v193`.
- Assertion mise à jour vers `style-prototype-dz.css?v=195` : commit `81517d8fd5eb12252370f0d912bf6afe12ae493c`.
- Le test Lot 315 reste réussi dans le run précédent. Le prochain run doit confirmer la suite restante et le statut global.


### Résultat final du run CI 43282792809 — SUCCÈS

- Le run `43282792809` (commit de code `81517d8fd5eb12252370f0d912bf6afe12ae493c`) est terminé avec `conclusion=success`.
- L'étape dédiée `Tester le prototype CSV du registre des lycées (Lot 315)` est réussie.
- Les contrôles portail public, مسارك, interactions, gamification, contrôle d'accès, matrice des parcours, régressions RAG/professeur et contrôle pédagogique restructuré sont tous terminés avec succès.
- Cette réussite couvre le code et workflow testés à ce commit. Les commits postérieurs ont uniquement complété ce dossier de continuité ; aucun code applicatif n'a été modifié après ce run.
- Le CI est donc vert pour le commit testé. PR #17 demeure ouverte et non fusionnée.


## Lot 316-A — projet de protocole institutionnel (12 novembre 2026)

- Document créé : `docs/product/LOT-316A-PROTOCOLE-INSTITUTIONNEL-REGISTRE.md`.
- Il formalise la demande d'export au ministère/DEW, la provenance, la conservation immuable de l'original et son empreinte SHA-256, la prévalidation isolée, le rapprochement versionné, l'approbation à deux personnes, la correction/retrait et les critères de quarantaine.
- Le protocole distingue registre des établissements et affiliation des élèves ; les droits d'un modérateur de messagerie ne donnent aucune autorité de certification.
- Document ajouté en référence dans `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md`.
- Proposition à faire valider par l'autorité institutionnelle ; aucune donnée réelle reçue ni traitée. Aucun SQL/migration, aucune écriture Supabase, aucune connexion au registre, aucun annuaire ni invitation nationale activé.
- Le dernier CI code `43282792809` sur `81517d8fd5eb12252370f0d912bf6afe12ae493c` est vert. Les changements suivants sont documentaires uniquement.


## Lot 316-B — rapprochement versionné et revue du registre (12 novembre 2026)

### Livrables ajoutés sur la branche PR #17

- `prototypes/registry-reconcile-core.mjs` : rapprochement déterministe de deux versions par `identifiant_national`.
- `prototypes/registry-reconcile-core.test.mjs` : tests Node natifs couvrant catégories, doublons, identifiants manquants/synthétiques, absences et export CSV.
- `docs/product/LOT-316B-RECONCILIATION-REVUE.md` : règles de comparaison, checklist de revue à deux personnes et modèle de manifeste de lot.
- `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md` : section Lot 316-B ajoutée.

### Règles de rapprochement

- Catégories séparées : nouveau, modifié, inchangé, absent à examiner.
- Clé unique : identifiant national fourni par l'autorité ; aucun rapprochement automatique par nom/adresse.
- Identifiant manquant, doublon ou identifiant synthétique : rapprochement rejeté.
- Une ligne absente de la nouvelle version est mise en quarantaine et ne signifie jamais automatiquement fermeture ou suppression.
- Une modification de statut doit être corroborée par un acte et une date d'effet, puis validée par l'autorité compétente.
- Le manifeste prévoit émetteur, périmètre, année scolaire, dates, référence source, nom du fichier original, empreinte SHA-256, nombre de lignes, version précédente, opérateur, approbateur distinct et décision.

### CI

- Le workflow `.github/workflows/deploy.yml` vérifie la présence des deux nouveaux fichiers et exécute `node --test prototypes/registry-reconcile-core.test.mjs`.
- Commit du workflow : `acf6cc15ebf8832f6185d6cb327773ad95d2e2c9`.
- Commit de documentation registre : `a2c120fd920ca236c83158681734af708e77c9aa`.
- La CI déclenchée par ces changements doit terminer avant de déclarer Lot 316-B validé. Le run vert Lot 315 #43282792809 ne couvre pas ces nouveaux tests.

### État de sécurité

- Démonstration et tests uniquement ; aucun fichier réel ni aucune donnée d'élève.
- Aucun appel réseau dans le prototype ; aucun import ni stockage persistant.
- Aucun changement Supabase (schéma, données, RLS, GRANT, Auth, Storage), aucune migration, aucune modification Cloudflare, aucun déploiement.
- Aucun annuaire national ni invitation Messenger activé.
- PR #17 confirmée ouverte et non fusionnée avant ce lot ; ne pas fusionner ni déployer.

### Prochaine étape

Attendre le résultat de la CI du Lot 316-B, puis poursuivre avec une revue de robustesse des règles de rapprochement et un modèle de rapport d'écarts lisible par un responsable administratif. Ne pas créer de schéma ni manipuler de vrais dossiers avant réception et validation institutionnelle du référentiel.


### Point de contrôle CI Lot 316-B (12 novembre 2026)

- Run GitHub Actions `43283998214` : les étapes `Tester le prototype CSV du registre des lycées (Lot 315)` et `Tester le rapprochement versionné du registre (Lot 316-B)` sont toutes deux terminées avec `success`.
- Les étapes de validation suivantes, jusqu'au contrôle pédagogique restructuré et à l'étape Information, apparaissent également réussies dans le job.
- Au dernier relevé, le statut global du run est encore `in_progress` (conclusion non disponible). Lot 316-B n'est donc pas encore déclaré CI globalement vert.
- Suivi : https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43283998214


## Lot 316-C — rapport administratif de revue des écarts (12 novembre 2026)

### Livrables sur la branche PR #17

- `prototypes/registry-review-report-core.mjs` : rapport de revue trié P1/P2/P3, export CSV neutralisé et garde de séquence opérateur/approbateur.
- `prototypes/registry-review-report-core.test.mjs` : tests du classement, de la quarantaine, des rôles, de l'ordre de validation et de l'export.
- `docs/product/LOT-316C-RAPPORT-REVUE-ECARTS.md` : protocole administratif, priorités, décisions et limites.
- `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md` : section Lot 316-C ajoutée.
- `.github/workflows/deploy.yml` : fichiers ajoutés à la liste des prérequis et test Node dédié.

### Règles métier

- P1 : nouvel identifiant, ligne absente entre versions, ou changement de statut/date/référence/source.
- P2 : changement de nom, identité, rattachement géographique ou champ descriptif.
- P3 : aucun changement détecté sur les champs comparés.
- Les priorités P1/P2/P3 organisent la file de travail ; elles ne constituent pas un jugement juridique.
- L'opérateur peut seulement documenter « à revoir » ou mettre en quarantaine.
- Un approbateur distinct peut accepter, rejeter ou mettre en quarantaine après revue opérateur.
- Les identifiants opérateur/approbateur sont simulés : le prototype ne fournit ni authentification, ni contrôle serveur, ni signature, ni journal d'audit inviolable.

### Sécurité et limites

- CSV neutralisé contre les formules de tableur ; colonnes séparées pour commentaires opérateur et approbateur.
- Aucun établissement réel ni donnée d'élève.
- Aucun stockage durable, aucun appel réseau, aucun import ou publication.
- Aucun changement Supabase (schéma/données/RLS/GRANT/Auth/Storage), aucune migration, aucune modification Cloudflare et aucun déploiement.
- Le registre national et les invitations Messenger restent désactivés tant que la source institutionnelle et la preuve d'affiliation ne sont pas validées.

### CI et état de la PR

- L'étape `Tester le rapport administratif de revue des écarts (Lot 316-C)` est ajoutée au workflow. Son résultat doit être contrôlé avant de déclarer ce lot validé.
- Lot 316-B : CI globale précédemment terminée avec succès, run `43283998214`.
- PR #17 doit rester ouverte et non fusionnée ; aucun déploiement n'est autorisé.

### Suite proposée

Après succès CI, effectuer une revue statique ciblée du traitement des priorités, des rôles et des exports. Ensuite, concevoir une maquette d'écran de revue administrative hors ligne, sans brancher de données réelles ni de service d'authentification.


## Lot 316-D — maquette UX de revue administrative (12 novembre 2026)

### Livrables

- `prototypes/registry-review-preview.html` : maquette autonome RTL, filtres P1/P2/P3, recherche, détails, revue opérateur et approbateur.
- `prototypes/registry-review-preview.test.mjs` : contrôle automatisé des garde-fous d'isolation.
- `docs/product/LOT-316D-MAQUETTE-REVUE-ADMINISTRATIVE.md` : guide, limites et décision.
- `docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md` : section Lot 316-D ajoutée.
- Workflow : vérification des deux nouveaux fichiers et exécution du test Node dédié.

### Sécurité

- Quatre identifiants SYN fictifs uniquement.
- Aucune requête réseau, API, Supabase, Auth, RLS, Storage, Cloudflare ou persistance navigateur.
- Les actions sont simulées en mémoire ; rechargement = remise à zéro.
- Les identifiants opérateur/approbateur sont libres et non authentifiés ; aucune décision réelle, signature ou traçabilité institutionnelle n'est créée.
- Maquette hors navigation et hors production.

### État CI

Le run du Lot 316-C `43286385705` est terminé avec succès ; les tests Lot 315, 316-B et 316-C ont réussi. Le test du Lot 316-D vient d'être ajouté et doit être confirmé dans le run déclenché par le nouveau commit de workflow.

### Décision

GO pour revue UX locale sur données fictives. NO-GO pour l'usage administratif réel. PR #17 reste ouverte, non fusionnée ; aucun déploiement ni changement Supabase.


## Lot 317 — traçabilité des décisions de revue (12 novembre 2026)

### Livrables ajoutés sur la branche PR #17

- prototypes/registry-decision-ledger-core.mjs : journal séquentiel des événements, chaîne d'intégrité SHA-256 et export JSON vérifié.
- prototypes/registry-decision-ledger-core.test.mjs : tests Node natifs.
- docs/product/LOT-317-TRACEABILITE-DECISIONS.md : règles métier, protocole de test et limites cryptographiques.
- docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md : section Lot 317 ajoutée.
- .github/workflows/deploy.yml : fichiers déclarés dans les prérequis et test Lot 317 ajouté à la CI.

### Contrôles

- Horodatage fourni explicitement par l'appelant ; tests déterministes.
- Justification obligatoire pour chaque événement.
- Revue opérateur avant décision d'approbateur ; identifiants distincts.
- Référence de preuve/acte obligatoire pour accepter ou rouvrir.
- Vérification de la chaîne SHA-256 et refus d'export JSON si une altération est détectée.

### Limites et sécurité

- SHA-256 sans signature ni stockage append-only ne constitue pas une preuve d'identité, d'horodatage fiable ou d'inaltérabilité face à un acteur privilégié.
- Identités, dossiers et références synthétiques ; aucun document réel.
- Aucun réseau, stockage navigateur, Supabase/Auth/RLS/GRANT/Storage, SQL/migration, Cloudflare ou déploiement modifié.
- Le test CI du Lot 317 doit terminer avant de déclarer le lot validé.
- PR #17 doit rester ouverte et non fusionnée ; main inchangée.

### Suite

Après CI verte, effectuer une revue des transitions et de l'export, puis concevoir un écran chronologique de consultation du journal en données fictives. Ne pas intégrer de vrais dossiers avant validation institutionnelle et conception de l'audit serveur.


### Complément Lot 317 — transitions et tests étendus

- La revue opérateur peut être répétée uniquement après une demande de correction ou une réouverture explicite de l'approbateur.
- Une décision finale bloque toute nouvelle revue jusqu'à une réouverture motivée et référencée.
- Une nouvelle décision finale est possible après la nouvelle revue, avec un approbateur distinct de l'opérateur du cycle.
- Tests additionnels : cycle correction → nouvelle revue → décision, et décision finale → réouverture → nouvelle revue → nouvelle décision.
- Correctifs de normalisation des caractères de contrôle et de garde de transition intégrés. Le dernier run CI doit couvrir le HEAD final avant validation du Lot 317.


### Validation finale du Lot 317 — 12 novembre 2026

- Run GitHub Actions **43289871367** sur le commit de code 1e9d154c16e075a5511ca3c3410ac7ead4c54edf : **success**, job unique et 38/38 étapes réussies.
- L'étape « Tester la traçabilité des décisions (Lot 317) » est réussie ; les contrôles Lots 315, 316-B, 316-C et 316-D sont également réussis.
- Le run a couvert le correctif de réouverture et les deux tests de cycle correction/réouverture. Les premiers échecs ciblés ont été corrigés avant cette validation finale.
- Le présent ajout documentaire déclenche sa propre CI ; il ne modifie aucun code.
- PR #17 confirmée ouverte, non fusionnée, base main. Aucun déploiement Cloudflare/Supabase, aucune migration ni écriture Supabase.


## Lot 318 — chronologie de consultation du journal (12 novembre 2026)

### Livrables
- prototypes/registry-decision-timeline-preview.html : maquette arabe RTL responsive, chronologie, recherche, filtre par dossier, panneau de détail et export JSON de la sélection visible.
- prototypes/registry-decision-timeline-preview.test.mjs : test Node natif d'isolation.
- docs/product/LOT-318-CHRONOLOGIE-JOURNAL.md : périmètre, mode d'emploi, limites et décision.
- docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md : section Lot 318 ajoutée.
- .github/workflows/deploy.yml : fichiers requis et test Lot 318 ajoutés.

### Jeu de données et garde-fous
- Deux dossiers SYN fictifs, six événements, identités, horodatages et références inventés.
- Marqueurs DEMO-HASH illustratifs seulement ; aucune empreinte réelle n'est recalculée ou vérifiée dans la page.
- La maquette est indépendante du module Node du Lot 317 ; elle n'est pas connectée à un journal réel.
- Aucun appel réseau, aucune persistance navigateur, aucune authentification, aucun backend, aucune modification Supabase/Auth/RLS/GRANT/Storage, SQL/migration, Cloudflare ou déploiement.
- Export JSON local limité aux événements synthétiques filtrés ; aucun envoi de données.

### Validation
Le test de présence/isolation est ajouté à la CI. Attendre le résultat du run déclenché par ce commit avant de déclarer Lot 318 validé. PR #17 doit rester ouverte et non fusionnée, base main.


## Lot 319 — liaison contrôlée entre moteur et chronologie (12 novembre 2026)

### Livrables
- prototypes/registry-decision-timeline-adapter.mjs : projection Node du journal Lot 317 après vérification SHA-256 et contrôle rôle/type.
- prototypes/registry-decision-timeline-adapter.test.mjs : tests de journal valide, détection d'altération et rôle/type non autorisé.
- prototypes/registry-decision-timeline-preview.html : import local JSON avec Web Crypto, vérification de la genèse, de chaque événement, de previousHash et headHash ; affichage des événements et références.
- prototypes/registry-decision-timeline-preview.test.mjs : assertions de présence/isolation et garde SYN-only.
- docs/product/LOT-319-IMPORT-VERIFIE-JOURNAL.md : contrat, tests et limites.
- docs/product/REGISTRE_NATIONAL_ETABLISSEMENTS_INSCRIPTIONS.md : section Lot 319 ajoutée.
- .github/workflows/deploy.yml : deux fichiers adapter ajoutés aux prérequis et test dédié ajouté à la CI.

### Garde-fous
- Import de fichiers locaux uniquement ; aucun upload.
- Identifiant dossier commençant par SYN- obligatoire.
- Si Web Crypto est indisponible, le fichier est refusé.
- Une altération, un ordre incorrect, un hash de liaison invalide, un headHash incohérent ou un type/rôle non reconnu bloque l'import.
- Une chaîne valide ne prouve pas l'identité, la date réelle, la légitimité de la pièce ou l'absence de recalcul de toute la chaîne.
- Aucun dossier réel, réseau, persistance navigateur, backend, Supabase/Auth/RLS/GRANT/Storage, SQL/migration, Cloudflare ou déploiement.
- L'export depuis l'interface reste un modèle de vue JSON et non le journal original signé.

### Validation
Attendre la CI du HEAD final avant de déclarer le Lot 319 validé. PR #17 reste ouverte et non fusionnée, base main.


### Validation CI finale du Lot 319 — 12 novembre 2026

- Run GitHub Actions **43292271080** sur le HEAD 240b6e1afe9ee2686392b32b1f84bcccb35a4024 : **success**, job unique, 40/40 étapes réussies.
- Étapes Lots 318 et 319 réussies : test de la maquette chronologique et test de l'adaptateur du journal Lot 317.
- Le run antérieur 43292098443 avait échoué sur l'assertion de libellé du bouton d'export après évolution de l'interface ; l'assertion a été mise à jour et le run suivant 43292184775 a confirmé les deux tests. Le run final du HEAD a ensuite réussi.
- PR #17 confirmée ouverte, non fusionnée, base main. Aucun déploiement, aucune modification Supabase/Auth/RLS/GRANT/Storage, aucune migration ni donnée réelle.


## Lot 320 — validation sémantique du journal de décisions (12 novembre 2026)

### Constat de revue
- Les Lots 317–319 vérifiaient la cohérence SHA-256, l'ordre des séquences et les combinaisons rôle/type, mais ne rejouaient pas intégralement les transitions métier lors de la vérification d'un JSON importé.
- Un fichier pouvait donc présenter une chaîne de hash recalculée cohérente tout en décrivant une séquence impossible (par exemple deux revues opérateur successives sans demande de correction/réouverture, ou une approbation sans revue préalable).

### Correctifs préparés sur la branche PR #17
- `prototypes/registry-decision-ledger-core.mjs` : validation centralisée de l'en-tête, des champs obligatoires, des rôles/types, de la séparation des tâches et des transitions de revue/correction/décision/réouverture ; `appendDecisionEvent` et `verifyDecisionLedger` appliquent la même machine d'état.
- `prototypes/registry-decision-ledger-core.test.mjs` : ajout de chaînes synthétiques dont les hashes sont valides mais dont les transitions sont interdites ; l'import/export doit les refuser.
- `prototypes/registry-decision-timeline-preview.html` : même contrôle sémantique exécuté localement dans le navigateur avant d'afficher un journal.
- `prototypes/registry-decision-timeline-preview.test.mjs` : assertions de présence des gardes de transitions côté navigateur.

### Limites inchangées
- Les identifiants SYN restent fictifs ; les rôles et identités ne sont pas authentifiés.
- SHA-256 prouve seulement la cohérence de la chaîne présentée, pas l'identité, l'horodatage fiable, l'autorité de la preuve ni l'absence d'un recalcul complet malveillant.
- Aucun dossier réel, aucune collecte, aucun service réseau, aucun stockage durable, aucune connexion Supabase, Auth, RLS, GRANT ou Storage.
- Aucun SQL, aucune migration, aucun changement de base active, aucun déploiement Cloudflare et aucune fusion.

### Validation
- Les tests Lot 320 sont ajoutés aux tests existants Lot 317 et Lot 319 ; le workflow CI les exécute via les mêmes commandes Node.
- Attendre le résultat CI du HEAD final avant de déclarer le lot validé.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.

### Décision et suite
- GO pour durcir et tester les prototypes hors ligne avec des données SYN uniquement.
- NO-GO pour le schéma SQL/migration et les tests PostgreSQL contre un environnement réel tant que le protocole institutionnel n'a pas été validé et qu'un environnement isolé n'a pas été autorisé.
- Prochaine étape après validation institutionnelle : rédiger le modèle de données et la migration versionnée, puis exécuter les tests d'intégration PostgreSQL dans une base jetable dédiée, jamais dans la base active.


### Complément Lot 320 — cohérence de l'en-tête importé
- Le validateur navigateur exige désormais aussi que `sourceReference` soit une chaîne, conformément au validateur Node ; les fichiers JSON dont l'en-tête diverge sont rejetés.
- Assertion statique ajoutée au test de la maquette. La validation finale reste suspendue au run CI du HEAD documentaire final.


## Lot 321 — validation chronologique des journaux importés (12 novembre 2026)

### Constat
Le contrôle sémantique du Lot 320 vérifiait l'ordre logique des décisions, mais acceptait encore des horodatages non normalisés ou non croissants. Un journal pouvait donc contenir une date invalide ou une approbation antérieure à la revue tout en respectant les transitions de rôles.

### Correctifs sur la branche PR #17
- `prototypes/registry-decision-ledger-core.mjs` : ajout d'une validation stricte des horodatages UTC ISO-8601 normalisés (format accepté par `Date.prototype.toISOString()`). La date de création doit être valide ; chaque événement doit avoir une date valide strictement postérieure à la création et à l'événement précédent.
- `prototypes/registry-decision-ledger-core.test.mjs` : les scénarios synthétiques utilisent désormais des dates ISO-8601 ; ajout d'un test de date initiale invalide, d'événement antidaté et de chaîne hash-valide mais chronologiquement incohérente.
- `prototypes/registry-decision-timeline-preview.html` : vérification identique côté navigateur avant affichage du journal importé.
- `prototypes/registry-decision-timeline-preview.test.mjs` : assertions de présence des contrôles temporels côté navigateur.

### Limites
- Une date ISO valide et croissante reste une valeur fournie par le fichier ; elle ne prouve pas l'heure réelle, l'identité de l'acteur, la signature d'une autorité ou l'intégrité d'une horloge de confiance.
- SHA-256 non signé n'est pas une signature et ne rend pas le journal inviolable si un acteur peut recalculer toute la chaîne.
- Données SYN uniquement, traitement local, aucun service réseau ni persistance.
- Aucun SQL, migration, PostgreSQL, Supabase/Auth/RLS/GRANT/Storage, modification de `main`, ni déploiement de production.

### Validation CI
- HEAD testé : `2bc9134cb8cdb32efad6f0d20e600ebca17ebdc4`.
- Run GitHub Actions #3169 / `43297481014` : en cours lors de la rédaction. Le job a passé les contrôles de préparation et de structure ; la validation messagerie était encore en cours et les tests du registre n'avaient pas encore démarré. Ne pas déclarer le lot réussi avant la conclusion finale.

### Décision
- GO pour les tests hors ligne sur données synthétiques.
- NO-GO pour tout modèle SQL/migration et tout test sur la base active. Une base PostgreSQL jetable nécessitera un environnement local ou isolé explicitement autorisé, sans coût cloud implicite.
- PR #17 reste ouverte et non fusionnée.


### Correctifs finaux et validation CI — Lot 321 (12 novembre 2026)

- Analyse des échecs intermédiaires #3166 à #3173 : le journal révélait un défaut supplémentaire dans `clean()`. L'expression régulière était doublement échappée et supprimait les lettres ordinaires `r`, `n` et `t` au lieu de ne neutraliser que CR/LF/TAB. Elle est corrigée en `/[\\r\\n\\t]+/g`, ce qui préserve les rôles `operateur`, les identifiants SYN et les références.
- Les fixtures des tests du moteur et de l'adaptateur ont été normalisées en UTC ISO-8601 avec millisecondes. Le test d'association de rôle a été aligné sur le rejet central du moteur lorsqu'un rôle inconnu est rencontré.
- Validation finale : GitHub Actions **#3174**, run `43298187072`, commit `10e919749b85238c03dfde19eefcae00c27247cb` : **success, 40/40 étapes**. Les tests du journal Lot 317, de la chronologie Lot 318 et de l'adaptateur Lot 319 sont passés dans cette exécution.
- Les runs antérieurs de la série étaient en échec pendant les corrections successives ; ils ne sont pas comptés comme validation. #3174 est le résultat vert de référence pour le code Lot 321.
- PR #17 reste ouverte, non fusionnée ; HEAD au moment de ce constat : `10e919749b85238c03dfde19eefcae00c27247cb`. Comparaison avec `main` : 2 072 commits en avance et 4 en retard ; `main` reste au commit `12367172a6038cfd9de709be37e6de9fa62b9462` dans la comparaison consultée.
- La description de la PR a été nettoyée : les addenda MFA historiques 181–209 ont été remplacés par une exclusion explicite MFA/2FA. Ce changement de description n'est pas une suppression de code ; aucun fichier MFA n'apparaît dans la liste des fichiers actuellement modifiés de la PR. Un audit séparé de toute source résiduelle reste obligatoire avant fusion.
- GitHub contient une notification Cloudflare confirmant un **déploiement de prévisualisation de branche** pour le commit `74b1f99`. Il ne s'agit pas d'une publication de production. Le déploiement de prévisualisation automatique ne doit pas être confondu avec un déploiement de production ; la prévisualisation exacte du HEAD `10e9197` n'a pas été confirmée dans cette vérification.
- Aucun SQL exécuté, aucune migration appliquée, aucune base PostgreSQL/Supabase active modifiée, aucun changement direct sur `main`, aucun déploiement de production.

### Décision après validation
- Lot 321 : validation structurelle CI acquise sur le commit indiqué.
- GO pour préparer le modèle relationnel PostgreSQL en documentation et les tests sur base jetable locale.
- NO-GO pour appliquer une migration, créer une branche Supabase payante, ou utiliser une base distante sans autorisation explicite distincte.
- Le protocole institutionnel du registre reste une proposition à faire valider ; aucun établissement réel ni aucune inscription officielle n'est importé.


## Lot 322 — modèle relationnel logique (12 novembre 2026)
- Nouveau document : `docs/product/LOT-322-MODELE-RELATIONNEL-REGISTRE.md`.
- Sépare établissements, sources versionnées, lots/lignes d'import, affiliations annuelles, codes de vérification, journal de décisions et projection d'annuaire Messenger.
- Définit les règles d'idempotence, de conservation historique, de minimisation des données et de séparation opérateur/approbateur.
- Les références exactes à `profiles`, les clés et types doivent être confirmés sur le schéma réel avant DDL.
- GO documentaire uniquement ; NO-GO DDL, migration, PostgreSQL/Supabase actif, Auth/RLS/GRANT/Storage, import réel, activation de l'annuaire et déploiement.
- Les tests futurs doivent utiliser une base PostgreSQL jetable locale ; aucune branche cloud payante ne sera créée sans autorisation distincte.


## Lot 323 — audit de préparation du Messenger national (12 novembre 2026)

- Audit du code réel `msg.js`, du contrat `supabase/msg_schema.sql`, de `tests/msg_test.mjs`, de `ci/check-msg.mjs` et du cahier des charges Messenger.
- Conclusion : **Messenger national non terminé**. Le dépôt contient une messagerie scolaire restreinte (groupes par wilaya/niveau/filière, conversations privées existantes, fil, Realtime par conversation, pièces jointes et modération), mais pas encore un réseau national inter-lycées opérationnel.
- Constat UI : la recherche actuelle filtre les conversations/groupes chargés ; elle ne constitue pas un annuaire national. Le code indique explicitement que la recherche nationale et les invitations seront ajoutées après sécurisation serveur.
- Constat schéma : tables `msg_*` présentes ; pas de table/RPC d'invitations dans le schéma audité ; `msg_can_dm` reste fondée sur l'égalité wilaya+niveau+filière.
- Blocage majeur confirmé : aucune relation institutionnelle canonique élève↔lycée prouvée par une source officielle n'est présente dans le schéma versionné. Les champs déclaratifs du profil et le matricule/section saisis ne sont pas une preuve d'affiliation.
- Tests actuels : assertions statiques de contrat/présence ; elles ne prouvent pas les autorisations runtime RLS, le parcours d'invitation concurrent, ni la recette multi-utilisateurs Realtime.
- Nouveau document : `docs/product/LOT-323-AUDIT-PREPARATION-MESSENGER-NATIONAL.md` (audit, écarts, séquencement 323-A à 323-H).
- Prochaine priorité : finaliser la compatibilité du registre avec le schéma réel et la matrice d'accès, puis concevoir invitations et annuaire avant tout élargissement de `msg_can_dm`.
- Aucun changement applicatif, SQL, migration, Auth/RLS/GRANT/Storage, base Supabase active, `main`, merge ou déploiement effectué. PR #17 reste ouverte et non fusionnée. Pas de facturation ni MFA/2FA.


## Lot 324 — fermeture du parcours DM direct côté client (12 novembre 2026)

- Audit de `supabase/supabase.js` : `msgOpenDirect` créait le DM côté navigateur puis tentait d'ajouter expéditeur et destinataire dans `msg_members`. La policy RLS impose `auth.uid() = user_id`, donc le client ne peut pas ajouter le destinataire ; l'appel séparé pouvait laisser une conversation orpheline.
- Correction sur la branche : `msgOpenDirect` ne crée plus de conversation ni de membre. Il ne rouvre qu'un DM existant partagé ; sinon il retourne `msg_invitation_requise`. Les erreurs de lecture sont propagées.
- Ajout de garde-fous statiques dans `tests/msg_test.mjs` et `ci/check-msg.mjs) : interdiction d'INSERT client dans `msg_conversations` / `msg_members` depuis cette méthode.
- Spécification complétée dans `docs/product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md` (Addendum Lot 324).
- CI #3180 et #3181 : succès ; l'étape CI « Valider la messagerie EduDZ (schéma RLS + client + vue) » est verte sur #3181 (commit `6e3f1ee`). Le correctif est validé au niveau des contrôles statiques du dépôt, sans prétendre à une recette runtime.
- Ce lot ne livre pas encore le système d'invitations : aucune table/RPC d'invitation, annuaire national, ni DM inter-wilayas. La preuve institutionnelle d'affiliation et la règle `msg_can_dm` restent bloquantes.
- Aucun SQL, migration, Auth/RLS/GRANT/Storage, écriture Supabase active, merge, déploiement ou changement de `main). PR #17 reste ouverte. Pas de MFA/2FA ni facturation.


## Lot 325 — revue des autorisations et contrat d'invitation Messenger (12 novembre 2026)

- Relecture ciblée du schéma `supabase/msg_schema.sql` (RLS, fonctions, triggers, GRANT, stockage), du client `supabase/supabase.js` et de l'interface `msg.js`.
- **S1 critique avant ouverture :** le schéma autorise encore la création d'une conversation `direct` par un utilisateur authentifié et l'auto-insertion de sa propre ligne `msg_members` pour un DM ; le trigger `msg_guard_direct` contrôle l'appartenance au groupe scolaire commun quand le second membre existe, mais n'exige aucune invitation acceptée. Le correctif client Lot 324 ne ferme donc pas à lui seul le chemin serveur. À corriger dans une migration/RPC transactionnelle distincte après autorisation.
- **S2 bloquant produit :** `verif_statut='verifie'` reste fondé sur matricule/section déclarés et validation prof/admin ; il ne constitue pas une preuve d'inscription à un établissement canonique. Le registre institutionnel doit être relié à l'affiliation et à l'année scolaire.
- **S3 bloquant objectif national :** `msg_can_dm` exige actuellement deux profils vérifiés partageant wilaya+niveau+filière ; cette règle ne permet pas les DM inter-wilayas et ne doit pas être simplement supprimée.
- **S4 à corriger/tester :** la logique `msg_not_blocked` semble traiter le blocage par le destinataire sur l'expéditeur sans symétrie complète ; tests bilatéraux nécessaires.
- **S5 à cloisonner :** les rôles `prof` et `admin` sont tous deux modérateurs et peuvent agir sur la vérification ; distinguer modération du contenu, validation institutionnelle et administration technique.
- **S6 à renforcer avant ouverture :** le MIME déclaré et la taille ne suffisent pas à valider le contenu réel des pièces jointes ; prévoir analyse serveur, quotas et accès privé à durée limitée.
- Nouveau document : `docs/product/LOT-325-AUTORISATIONS-ET-CONTRAT-INVITATIONS-MESSENGER.md`, avec états/transitions des invitations, invariants transactionnels, opérations serveur cibles, matrice d'autorisation et tests négatifs.
- Aucun SQL/RLS/GRANT/Auth/Storage, aucune migration, aucune écriture Supabase active, aucun merge, déploiement ou changement de `main`. PR #17 reste ouverte. Pas de MFA/2FA ni facturation.


## Lot 326 — plan de verrouillage serveur Messenger (12 novembre 2026)

- Précisions ajoutées au Lot 325 : `msg_guard_direct` s'appuie sur la visibilité du second membre au moment du trigger ; deux INSERT concurrents peuvent ne pas voir la ligne non validée de l'autre. Ce contrôle n'est pas un verrou transactionnel. Le client `msgOpenDirect` limite aussi la recherche de conversations communes aux 500 adhésions les plus récentes ; une RPC paginée côté serveur sera préférable.
- CI #3184 (SHA `e3dac5d`) et #3185 (SHA `a5f087d`) confirmées en succès.
- Nouveau document : `docs/product/LOT-326-PLAN-VERROUILLAGE-SERVEUR-MESSENGER.md`. Il détaille inventaire préalable des grants/policies/fonctions, modèle logique des invitations, fermeture des INSERT directs, RPC transactionnelle avec verrouillage `FOR UPDATE`, blocage bilatéral, tests PostgreSQL multi-session et compatibilité des DM historiques.
- Le plan recommande de ne jamais convertir automatiquement les DM historiques en invitations acceptées. Il distingue également blocage individuel et appartenance à un groupe commun.
- Aucun SQL exécutable livré, aucune modification de schéma/RLS/GRANT/Auth/Storage, aucune écriture Supabase active, aucun merge, déploiement ou changement de `main`. PR #17 reste ouverte. Pas de MFA/2FA ni facturation.


## Lot 327 — preuve de provenance et affiliation officielle (12 novembre 2026)

- Inspection du tree GitHub et relecture des lots 314, 315, 316-A/316-C, 322, 323 et 326.
- Le dépôt contient des références JORADP et des prototypes isolés ; aucun export ministériel complet/courant, aucun connecteur officiel, aucune base nominative d'inscriptions ni relation active prouvant compte-élève ↔ lycée ↔ année scolaire n'a été trouvé dans les fichiers audités.
- Les décrets JORADP n° 21-519, 22-253 et 24-224 sont des sources primaires pour les événements juridiques qu'ils publient, mais ne forment pas un instantané exhaustif des lycées actifs en 2026-2027.
- Distinction désormais explicite : (A) preuve de l'existence/statut administratif de l'établissement ; (B) preuve de l'inscription d'un élève précis pour une année scolaire. La preuve A ne permet jamais d'inférer B.
- Nouveau document : `docs/product/LOT-327-PREUVE-PROVENANCE-ET-AFFILIATION.md`. Il formalise la demande institutionnelle au ministère/DEW, la provenance et chaîne de conservation, les preuves admissibles, les rôles habilités, les transferts annuels et les critères NO-GO du Messenger national.
- Aucun fichier nominatif réel collecté ou importé ; aucun changement SQL, migration, Auth/RLS/GRANT/Storage, Supabase actif, Cloudflare, `main`, merge ou déploiement. Données de prototype SYN/TEST uniquement. Pas de MFA/2FA ni facturation.
- PR #17 était ouverte et non fusionnée au début du lot, HEAD initial `e41f13d328cdf58abba6fa90369b07bdb5a62765`. CI #3188 sur ce HEAD : succès. Nouveau commit documentaire Lot 327 à valider par CI.
- Prochaine étape : vérifier la CI du nouveau HEAD, puis poursuivre le registre par une matrice de décision et scénarios d'affiliation synthétiques (transfert, réinscription, doublon, source révoquée, approbateur hors périmètre), sans créer de migration.


## Lot 328 — scénarios synthétiques du cycle d'affiliation (12 novembre 2026)

- Création d'un simulateur hors ligne `prototypes/registry-affiliation-scenarios-core.mjs` et de ses tests `prototypes/registry-affiliation-scenarios-core.test.mjs`.
- Scénarios couverts : validation par responsable du bon établissement, refus d'un responsable hors périmètre, interdiction d'auto-validation, source non vérifiée/révoquée, décision finale non répétable, transfert avec clôture de l'affiliation source, révocation réservée à l'approbateur, expiration système et critères d'éligibilité à l'annuaire.
- Tous les identifiants et acteurs sont SYN-* ; aucune donnée réelle, aucun appel réseau, aucun stockage, aucune intégration Auth/Supabase.
- Nouveau document : `docs/product/LOT-328-SCENARIOS-CYCLE-AFFILIATION.md`.
- Limite : simulateur pédagogique non sécurisé, sans concurrence ni transactions PostgreSQL ; ne prouve pas l'exclusivité des affiliations ni la validité d'une source. Les règles de rôle/visibilité sont une proposition de test, pas des droits activés.
- Commande de test : `node --test prototypes/registry-affiliation-scenarios-core.test.mjs`. Exécution locale non revendiquée ici ; CI GitHub à confirmer.
- Lot 327 : CI #3189 réussie sur le premier commit documentaire ; CI #3190 réussie sur le HEAD `3cffad6` (continuity). PR #17 ouverte, non fusionnée et fusionnable au dernier contrôle.
- Commits Lot 328 : core `8cc6a6e`, tests `177e9f0`, documentation `894774e`; mise à jour du dossier de continuité en attente de commit/CI.
- Aucun SQL, migration, changement Auth/RLS/GRANT/Storage, écriture Supabase, changement Cloudflare, merge ou déploiement. Aucun changement sur `main`. Pas de MFA/2FA ni facturation.
- Étape suivante : lancer/consulter la CI sur le HEAD final, puis traiter les scénarios de concurrence et d'idempotence uniquement dans un PostgreSQL jetable si les outils de test locaux disponibles le permettent ; sinon documenter les tests requis sans les prétendre exécutés.


## Lot 329 — concurrence, idempotence et unicité des affiliations (12 novembre 2026)

- La CI #3193 est confirmée réussie sur le HEAD du lot 328 (`65ccd1f`).
- Correction d'un défaut dans le simulateur Lot 328 : la condition de contrôle de `previousEnrollment` était contradictoire et ne pouvait pas détecter une affiliation précédente encore `verified`. Le contrôle refuse désormais une seconde affiliation pour le même élève, la même année et un autre établissement tant que l'affiliation source n'est pas explicitement `transferred`.
- Test synthétique ajouté pour couvrir : affiliation précédente vérifiée (refus), transférée (acceptation), autre année (non bloquante), autre élève (non bloquante).
- Nouveau document `docs/product/LOT-329-CONCURRENCE-IDEMPOTENCE-AFFILIATIONS.md` : matrice des courses (validations concurrentes, transferts concurrents, source révoquée, approbateurs contradictoires), contrat transactionnel cible, clés d'idempotence, contraintes d'unicité, ordre de verrouillage et critères NO-GO.
- Limite essentielle : les nouveaux tests du simulateur sont séquentiels et en mémoire. Aucun test multi-session PostgreSQL n'a été exécuté ; aucune garantie de concurrence réelle n'est revendiquée.
- Commits : correctif modèle `803e21c`, test `2e84825`, documentation `e79a3f4`. Dossier de continuité mis à jour dans le commit qui suit.
- Aucun SQL, migration, RPC, changement Auth/RLS/GRANT/Storage, écriture Supabase active, import nominatif, changement Cloudflare, déploiement ou changement sur `main`. PR #17 reste ouverte et non fusionnée. Pas de MFA/2FA ni facturation.
- Étape suivante : contrôler les exécutions CI du HEAD final. Si les tests passent, passer à la préparation du protocole de test PostgreSQL multi-session et à la revue du schéma réel en lecture seule, sans exécuter de migration.


## Lot 330 — audit en lecture seule du schéma Supabase vivant (12 novembre 2026)

- CI Lot 329 confirmées : #3194 succès, #3195 succès, #3196 succès.
- Audit strictement en lecture seule du projet Supabase connecté : PostgreSQL 17.6 ; inventaire des tables, migrations, colonnes, contraintes, politiques RLS, privilèges de colonnes, fonctions SECURITY DEFINER, ACL, triggers et publication Realtime. Aucun contenu de message ni profil individuel n'a été lu.
- Aucun registre d'établissements, aucune affiliation scolaire annuelle et aucune table/RPC d'invitation n'existent dans le schéma public vivant ou la liste des migrations consultée. `profiles` ne contient pas de référence canonique à un lycée ni d'année scolaire.
- Durcissement DM effectivement présent : `msg_open_direct` utilise un advisory transaction lock par paire, crée conversation et deux adhésions dans la transaction ; `msg_guard_direct` verrouille la conversation `FOR UPDATE` et limite le DM à deux membres. Helpers d'accès avec contrôle `auth.uid()`, ACL plus restrictives et search_path configuré.
- Contradiction toujours présente : le client `msgOpenDirect` refuse un nouveau DM sans invitation, mais `msg_open_direct` reste exécutable par `authenticated` et ouvre un DM sans invitation si `msg_can_dm` l'autorise. Les politiques INSERT direct sur `msg_conversations` et auto-adhésion `msg_members` ne vérifient pas une invitation acceptée. Aucun `msg_invites` ou RPC d'invitation n'a été trouvé.
- `msg_can_dm` impose toujours wilaya+niveau+filière identiques et `verif_statut='verifie'` : DM inter-wilayas impossible et preuve institutionnelle toujours absente.
- Risque S1 de confidentialité : la politique `profils visibles entre membres` filtre les lignes mais les privilèges SELECT `authenticated` couvrent toutes les colonnes de `profiles`, notamment matricule, section et champs de vérification. Le client `listProfiles()` utilise `select('*')`. Une projection minimale d'annuaire et des privilèges colonne doivent être conçus avant l'ouverture nationale.
- Blocage : `msg_not_blocked` vérifie qu'un membre a bloqué l'expéditeur courant ; le contrat bilatéral doit être éprouvé. Pièces jointes : contraintes MIME/5 Mio/chemin/empreinte et politiques Storage privées présentes, mais aucune inspection binaire/antivirus démontrée.
- Résidu de périmètre constaté : tables `mfa_email_factors`, `mfa_email_challenges`, `mfa_email_sessions` et migration `20261109210413_add_email_mfa_challenge_store` encore présentes. Leur présence ne prouve pas que MFA est imposé, mais le stockage n'a pas été retiré. MFA/2FA reste exclu ; aucune suppression n'a été faite en lecture seule. Tables historiques subscriptions/payments/comptabilité également présentes ; aucune facturation travaillée.
- Comptage agrégé Messenger : 1 conversation, 0 adhésion, 0 message, 0 pièce jointe, 0 signalement, 0 blocage. Pas de lecture du contenu des données.
- Nouveau document `docs/product/LOT-330-AUDIT-LECTURE-SEULE-SCHEMA-VIVANT.md`. Commit documentaire : `de3dfd8` ; mise à jour du présent dossier à suivre.
- Aucun SQL de modification, DDL, migration, changement Auth/RLS/GRANT/Storage, déploiement Cloudflare, changement `main` ou merge PR #17. PR #17 reste ouverte et non fusionnée.
- Étape suivante : lot 331 — protocole d'intégration PostgreSQL jetable à deux sessions et matrice de tests RLS/ACL/DM/invitations/profil minimal. Ne pas créer de branche Supabase payante ni modifier le projet actif sans accord.


### Addendum Lot 330 — Supabase Advisors

- Consultation des Advisors en lecture seule : sécurité — 3 tables MFA avec RLS sans politique, 1 fonction SECURITY DEFINER publique (`agreement_current`), 42 fonctions SECURITY DEFINER exécutables par `authenticated`, protection des mots de passe compromis désactivée. Ces avertissements doivent être évalués au cas par cas ; le nombre de fonctions n'est pas une preuve de vulnérabilité. `agreement_current` ne retourne que le texte actif d'un accord, accès public à confirmer comme intentionnel.
- Performance — 20 clés étrangères sans index couvrant (dont cinq sur Messenger), 53 politiques RLS avec initplan Auth, 57 cas de politiques permissives multiples, 6 index non utilisés dont trois index Messenger. Pas de suppression automatique d'index ; données Messenger quasi inexistantes, donc l'usage observé ne permet pas de juger la charge future.
- Les tables MFA n'accordent des privilèges qu'à `postgres` et `service_role`, pas à `anon`/`authenticated`. MFA/2FA reste exclu ; aucun changement Auth ni suppression de table dans ce lot.
- Aucun correctif Advisor appliqué. Priorités suivantes : minimisation de `profiles`, cohérence API invitation/DM, puis revue des fonctions SECURITY DEFINER et des politiques permissives.
- CI #3197 (commit initial du document Lot 330 `de3dfd8`) était en cours lors du dernier contrôle ; l'addendum Advisor et la présente mise à jour déclenchent de nouveaux contrôles.



## Lot 331 — contrat de confidentialité de l'annuaire et d'invitations Messenger (12 novembre 2026)

- CI #3199 confirmée en succès sur le commit `161ba65d94143389061b0ced761359848c4edfee`.
- PR #17 contrôlée via l'API GitHub : ouverte, `merged=false`, `mergeable=true`, `mergeable_state=clean`, HEAD au contrôle `972a1e2709fd36194273aba09b74e514c27fdfb5`. La PR reste non fusionnée.
- Revue des consommateurs réels dans `supabase/supabase.js`, `msg.js` et `admin.js`. `listProfiles()` utilise `select('*')` et son appel repéré est le panneau d'administration `admin.js) ; il ne faut pas le supprimer sans migrer cet écran vers une opération admin à projection minimale. `myProfile()` fait aussi `select('*')), mais sur la seule ligne `auth.uid()`. `msg.js` lit `id,pseudo,role,niveau` pour afficher les membres ; le rôle paraît superflu à cet usage. Le flux de vérification lit matricule/section et la file de vérification doit rester réservée aux vérificateurs habilités. `admListProfiles()` utilise déjà une projection plus restreinte `id,pseudo,role,niveau,wilaya`.
- Nouveau document `docs/product/LOT-331-CONTRAT-ANNUAIRE-MINIMAL-ET-INVITATIONS.md` : contrat de confidentialité séparant profil personnel, libellés de membres, annuaire national, file de vérification et administration ; contrats RPC proposés ; états et transitions d'invitation ; contraintes de transaction/verrouillage ; matrice d'intégration PostgreSQL jetable à deux sessions ; critères NO-GO.
- Décision technique : ne pas masquer uniquement des colonnes dans l'interface. Il faut remplacer les SELECT génériques par des opérations serveur dédiées, limiter les privilèges de colonnes, contrôler les permissions côté serveur et paginer l'annuaire. Les champs matricule, section, statut de vérification, vérificateur et date de vérification ne doivent jamais être retournés par l'annuaire Messenger.
- Le DM ne doit être créé qu'à la suite de l'acceptation atomique d'une invitation. Les INSERT directs de conversations privées et d'adhésions doivent être fermés au rôle client ; les DM historiques doivent rester accessibles sans être convertis rétroactivement en invitations.
- Limite : les tests PostgreSQL multi-session décrits sont un protocole à exécuter sur une base jetable ; aucun test de concurrence PostgreSQL n'a été exécuté dans ce lot. Aucun changement de code client ni SQL exécutable livré.
- Aucune modification de Supabase actif, aucune migration/DDL/RLS/GRANT/Auth/Storage, aucune écriture SQL, aucun déploiement Cloudflare, aucun changement sur `main), aucun merge PR #17. Pas de MFA/2FA ni facturation.
- Commits documentaires : Lot 331 `dfb95231c61136e61635fa3c557ebe4288c3d225`; mise à jour du présent dossier à suivre. CI du Lot 331 à contrôler après le commit final.
- Étape suivante : préparer un environnement PostgreSQL jetable et exécuter réellement les tests ACL/RLS/colonnes/DM/invitations à deux sessions. Tant que cet environnement n'est pas disponible, ne pas présenter la matrice comme validée. Après validation, implémenter par étapes les RPC minimales et les invitations, sans toucher au projet Supabase actif avant autorisation explicite.



## Lot 332 — préparation des tests PostgreSQL isolés (12 novembre 2026)

- CI #3201 confirmée en succès sur le document Lot 331 (`dfb95231c61136e61635fa3c557ebe4288c3d225`) ; CI #3202 confirmée en succès sur le précédent HEAD continuité (`4884807f8db6a83786279cab72ff568149763727`).
- Vérification des outils locaux : Node.js v22.16.0 disponible ; `psql`, `postgres`, `initdb`, `docker` et `podman` absents. Aucun moteur PostgreSQL local isolé n'est disponible.
- Vérification du tree GitHub : pas de `supabase/migrations/` ni de `config.toml` local. Les scripts `supabase/*.sql) sont historiques ; `supabase/msg_schema.sql` porte explicitement la mention « JAMAIS exécuté par un robot » et ne peut pas reconstruire à lui seul la base vivante.
- Lecture des métadonnées Supabase : projet `azjwcybivirvpxbfhyzk`, 27 migrations répertoriées de `20261030131545` à `20261109210413`, une seule branche Supabase `main`, aucune branche de développement existante. Aucune requête de modification ni test applicatif n'a été exécuté sur le projet actif.
- La création d'une branche Supabase peut générer des coûts horaires. Le périmètre exclut les frais et la facturation ; aucune branche n'a été créée, aucun coût engagé.
- Nouveau rapport `docs/product/LOT-332-ENVIRONNEMENT-TESTS-POSTGRESQL-ISOLE.md`. Il consigne les vérifications, la distinction entre tests statiques et intégration PostgreSQL, les prérequis de reconstruction fidèle des migrations et les scénarios multi-session à exécuter.
- Conclusion : les tests PostgreSQL multi-session ne sont **pas exécutés** et aucune validation RLS/ACL nouvelle n'est revendiquée. Les tests Node existants analysent du texte et ne prouvent pas les droits effectifs ni la concurrence.
- Aucun DDL, migration, modification Auth/RLS/GRANT/Storage, écriture SQL, déploiement Cloudflare, changement sur `main) ou merge PR #17. Pas de MFA/2FA et pas de facturation.
- Commit rapport Lot 332 : `6adb449af0139af6db2a307e86a6ea5d64560054`. Mise à jour du dossier de continuité à suivre ; CI du rapport et de la continuité à contrôler.
- Étape suivante : récupérer/constituer les migrations SQL exactes versionnées et préparer un harnais reproductible. L'exécution réelle attend un moteur PostgreSQL isolé sans coût ou une autorisation explicite après présentation du coût d'une branche Supabase.


---

## LOT 333 — Traçabilité des migrations SQL actives (12 novembre 2026)

- CI #3203 confirmée `success` sur le commit `6adb449af0139af6db2a307e86a6ea5d64560054`.
- Inventaire GitHub de l'arbre complet : aucun répertoire/fichier `migrations/` sur la branche ; 17 scripts SQL historiques sous `supabase/`.
- Supabase retourne 27 migrations actives (versions 20261030131545 à 20261109210413). Le connecteur fournit les versions/noms, pas les corps SQL historiques.
- Aucun des 17 scripts SQL n'est identifié comme le fichier horodaté correspondant à ces migrations. Ne pas exécuter ces scripts agrégés pour prétendre reconstruire la base active.
- Rapport détaillé : [LOT-333-TRAÇABILITÉ-MIGRATIONS-SQL-ACTIVES.md](product/LOT-333-TRAÇABILITÉ-MIGRATIONS-SQL-ACTIVES.md).
- PR #17 confirmée ouverte, non fusionnée, mergeable=true, mergeable_state=clean ; HEAD `6da36ebe0a1aacd29216fbf90f57a35c3daa2b23`.
- Aucun SQL d'écriture/DDL/migration appliqué ; aucune branche Supabase créée ; aucune modification Auth/RLS/GRANT/Storage ; aucun déploiement Cloudflare ; aucun changement `main` ; aucun merge.
- Suite : rechercher une copie authentique et complète des 27 corps de migration (historique de déploiement ou source originale). Si introuvable, proposer un baseline versionné dérivé d'un export contrôlé, sans le confondre avec l'historique original.


---

## LOT 334 — Provenance GitHub des migrations Supabase (12 novembre 2026)

- CI #3205 et #3206 confirmées `success`.
- Recherche de commits sur `supabase/migrations` : aucun résultat ; aucun répertoire migrations dans l'arbre Git.
- Workflow `.github/workflows/deploy.yml` : un seul job `validate`, aucun déploiement/migration Supabase ; les assertions Messenger restent statiques.
- Historique `supabase/msg_schema.sql` : 8 commits du 11 au 13 octobre 2026. Le commit `a63e6b323eaa34c11e5daf64be05213549b338a8` documente explicitement une dérive : politique `profils visibles entre membres` présente dans la base vivante mais absente du dépôt. Le commit `6f529c67e6f83212242ac62d505bb5e117c0e643` ajoute les gardes de taille 5 Mo.
- Conclusion : aucun moyen démontré de reconstituer les 27 corps SQL historiques à partir du dépôt accessible. Ne pas exécuter les scripts agrégés comme substitut.
- Rapport : [LOT-334-PROVENANCE-GITHUB-MIGRATIONS.md](product/LOT-334-PROVENANCE-GITHUB-MIGRATIONS.md).
- Suite : rechercher la source de déploiement d'origine ; à défaut, produire un baseline de référence daté à partir d'un export contrôlé, explicitement distinct de l'historique original, puis tester sur PostgreSQL jetable.
- Aucun SQL d'écriture/DDL/migration, aucune branche Supabase, aucun changement Auth/RLS/GRANT/Storage, aucun déploiement Cloudflare, aucun changement `main), aucun merge PR. Aucun travail facturation ni MFA/2FA.


---

## LOT 335 — Baseline partiel du schéma Messenger vivant (12 novembre 2026)

- CI #3207 confirmée en succès sur le HEAD précédent `77c70c2` ; PR #17 relue : ouverte, `merged=false`, `mergeable=true`, HEAD `77c70c22a15c0e8a7285085fbd92dacff066df96`.
- Nouvelle extraction strictement en lecture seule du catalogue PostgreSQL 17.6 actif : colonnes des six tables Messenger, contraintes/index, politiques RLS Messenger et Storage, fonctions Messenger ciblées avec définitions et ACL, triggers et métadonnées du bucket `prive`.
- Confirmation technique majeure : `msg_open_direct` reste exécutable par `authenticated` et crée conversation + deux membres sans invitation. Les politiques INSERT `msg_conversations` et `msg_members` permettent également création directe/auto-adhésion selon `msg_member_ok`. L'interface client qui exige une invitation ne constitue donc pas une protection serveur.
- `msg_can_dm` exige encore égalité wilaya+niveau+filière et deux profils vérifiés : le DM inter-wilayas est bloqué. `msg_not_blocked` est directionnel dans son test ; le blocage bilatéral n'est pas démontré.
- Storage `prive` est privé. Les politiques contrôlent les chemins et métadonnées MIME/taille à 5 Mio, mais les paramètres globaux `file_size_limit` et `allowed_mime_types` du bucket sont nuls ; aucune analyse antivirus ou validation binaire serveur n'est démontrée.
- Rapport ajouté : [LOT-335-BASELINE-PARTIEL-SCHEMA-MESSENGER-VIVANT.md](product/LOT-335-BASELINE-PARTIEL-SCHEMA-MESSENGER-VIVANT.md). Il est explicitement un baseline partiel daté, pas un pg_dump complet ni un historique de migrations/restauration.
- Aucun test PostgreSQL multi-session, aucune migration, aucun DDL, aucune écriture SQL, aucun changement Auth/RLS/GRANT/Storage, aucune branche Supabase payante, aucun déploiement Cloudflare, aucun changement `main` ni merge. PR #17 reste ouverte et non fusionnée. MFA/2FA et facturation restent hors périmètre.
- Étape suivante : étendre le baseline contrôlé aux fonctions et privilèges de profil/annuaire, puis préparer la matrice PostgreSQL multi-rôle. L'implémentation des invitations ne commencera qu'après environnement isolé et tests serveur ; aucune modification du projet Supabase actif sans autorisation distincte.


---

## LOT 336 — Privilèges profiles et annuaire national (12 novembre 2026)

- Revue catalogue en lecture seule des privilèges colonne, politiques RLS, vues publiques et triggers de protection de `public.profiles`.
- `authenticated` possède SELECT explicite sur toutes les colonnes de profil, dont matricule, section, statut, vérificateur et date de vérification. Les politiques RLS filtrent les lignes, pas les colonnes ; toute ligne visible via la politique « profils visibles entre membres » expose donc aussi ces colonnes au rôle.
- INSERT/UPDATE authenticated couvrent également plusieurs champs sensibles ; les triggers `profiles_role_guard`, `profiles_scope_guard` et `profiles_verif_guard` bloquent certaines modifications selon le rôle et le périmètre. Cela doit être éprouvé en intégration, pas seulement présumé sûr sur lecture du code.
- Aucune vue publique dédiée d'annuaire/profil minimal n'a été repérée dans le schéma public par la recherche ciblée.
- Décision : **NO-GO annuaire national sur `profiles` actuel**. Il faut des projections/RPC minimales distinctes (profil personnel, étiquette conversation, annuaire opt-in, file de vérification, administration) et une affiliation scolaire officielle active ; aucun matricule/section/champ de vérification ne doit sortir dans l'annuaire.
- Rapport : [LOT-336-AUDIT-PRIVILEGES-PROFILES-ANNUAIRE.md](product/LOT-336-AUDIT-PRIVILEGES-PROFILES-ANNUAIRE.md).
- Aucun correctif ni test multi-rôle appliqué ; aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage, déploiement Cloudflare, changement `main`, fusion PR #17 ou branche Supabase créée. Pas de MFA/2FA ni facturation.
- Suite : préparer les projections minimales et la matrice d'essais PostgreSQL multi-rôle, sans toucher au projet actif avant environnement isolé et autorisation distincte.


---

## LOT 337 — Contrat serveur annuaire et invitations nationales (12 novembre 2026)

- Contrat d'architecture ajouté : `docs/product/LOT-337-CONTRAT-SERVEUR-ANNUAIRE-INVITATIONS-NATIONALES.md`.
- Définit les surfaces séparées : annuaire opt-in, invitations, DM, groupes officiels, profil privé et vérification institutionnelle.
- Propose le modèle logique `msg_directory_preferences` et `msg_invites`, les RPC de recherche paginée, boîte inbox/outbox, création/réponse/annulation/expiration d'invitation et résolution des labels de membres.
- L'annuaire doit vérifier une affiliation officielle active et une source approuvée à chaque requête ; `profiles.verif_statut='verifie'` et les champs déclaratifs ne suffisent pas. Projection minimale sans matricule, section, rôle interne, statut/acteur/date de vérification.
- L'acceptation doit verrouiller l'invitation et la paire, revalider affiliation/blocage/expiration, puis créer ou retrouver le DM et ses deux membres dans une transaction unique ; refus/annulation/expiration ne créent jamais de conversation.
- Ajout de 40+ scénarios de tests couvrant annuaire, opt-in, anti-scraping, idempotence, acteur, courses concurrentes, blocages, transferts, DM historiques, groupes, confidentialité, Realtime et Storage. Tests non exécutés : matrice contractuelle seulement.
- Audit client lié : `msg.js` récupère encore `profiles(id,pseudo,role,niveau)` pour les noms ; `msgVerificationQueue` lit directement les champs sensibles de `profiles`. Ces appels doivent migrer vers des opérations dédiées avant l'ouverture nationale.
- Aucun SQL exécutable ni changement applicatif/DB réalisé ; aucune migration, Auth/RLS/GRANT/Storage, déploiement Cloudflare, changement `main` ou merge PR #17. PR #17 reste ouverte, non fusionnée. MFA/2FA et facturation hors périmètre.
- Suite : compléter la baseline catalogue pour les relations d'affiliation et les dépendances exactes du client, puis établir un environnement PostgreSQL jetable avant d'écrire et tester les migrations. Ne pas modifier le projet Supabase actif sans autorisation distincte.


---

## LOT 338 — Cartographie des dépendances client Messenger (12 novembre 2026)

- CI #3211 confirmée `success` sur HEAD `ebcd13741d793d540e8b0b0e4539f2d455498416` ; PR #17 reste `open`, `merged=false`, `mergeable=true`, sans fusion.
- Audit en lecture seule des fichiers `msg.js`, `supabase/supabase.js`, `admin.js`, `supabase/msg_schema.sql`, plus des politiques et fonctions Messenger ciblées du catalogue Supabase actif.
- `msg.js` ne possède pas d'annuaire national : `msgListSearch` filtre uniquement les conversations et groupes déjà chargés. `fetchNames()` lit directement `profiles(id,pseudo,role,niveau)` pour les libellés ; `role` est inutile à ce rendu.
- Dépendances de vérification identifiées : `msgMyVerification()` lit statut/matricule/section ; `msgRequestVerification()` écrit les champs déclaratifs ; `msgVerificationQueue()` lit des champs personnels/administratifs ; `msgSetVerification()` modifie statut, acteur et date. Ces opérations doivent devenir des RPC scoppées, séparées de l'annuaire.
- `msgOpenDirect()` côté client ne crée plus de nouveau DM, mais cherche dans les 500 dernières adhésions ; un RPC `msg_direct_open_existing` doit remplacer ce scan limité.
- `myProfile()` et `listProfiles()` utilisent `select('*')`. L'ancien écran admin appelle `listProfiles()` ; ne pas le supprimer avant migration admin dédiée. `admListProfiles()` et `admQueue()` ont leurs propres projections et usages à préserver.
- Catalogue vivant : `msg_open_direct(uuid)` reste SECURITY DEFINER et exécutable par authenticated/service_role ; la politique d'insertion des conversations autorise les DM directs ; la politique d'ajout des membres permet encore l'auto-ajout selon `msg_member_ok`. Les chemins serveur directs ne sont donc pas fermés par la seule correction client du Lot 324.
- Le rapport définit l'ordre de migration : libellés de membres, statut personnel, file de vérification, commande de demande, ouverture des DM historiques, annuaire/invitations, puis écrans admin séparés. Il fixe les critères de non-régression des DMs historiques, groupes, Realtime, modération et pièces jointes.
- Rapport : `docs/product/LOT-338-CARTOGRAPHIE-DEPENDANCES-CLIENT-MESSENGER.md`.
- Aucun test multi-compte ni PostgreSQL isolé exécuté. Aucune écriture SQL, DDL, migration, Auth/RLS/GRANT/Storage, modification du client, branche Supabase supplémentaire, déploiement Cloudflare, changement `main` ou merge PR #17. Pas de MFA/2FA ni facturation.
- Décision : NO-GO pour ouverture nationale tant que les chemins DM directs ne sont pas fermés côté serveur, que les affiliations officielles ne sont pas disponibles et que les contrats n'ont pas passé les tests PostgreSQL réels.
- Étape suivante : définir le protocole de compatibilité des groupes officiels et des DMs historiques avec l'affiliation scolaire, sans convertir les groupes actuels en preuve d'inscription ni modifier les données vivantes.


---

## LOT 339 — Compatibilité groupes et DMs historiques (12 novembre 2026)

- Comptage agrégé strictement en lecture seule sur Supabase actif `azjwcybivirvpxbfhyzk` : 1 conversation au total, 0 DM, 1 groupe, 0 adhésion, 0 message, 0 pièce jointe, 0 signalement, 0 blocage.
- Aucun contenu de message ni donnée nominative n'a été consulté. Cet instantané ne prouve pas l'absence de données dans des sauvegardes, exports ou environnements distincts.
- Le groupe unique est sans adhésion. Il doit être conservé pendant la préparation, sans ajout automatique d'élèves ni suppression. Il n'est pas démontré comme groupe actif.
- Le rapport distingue groupe historique non certifié, groupe officiel certifié par affiliation institutionnelle, et groupe communautaire à adhésion volontaire. Le type SQL `groupe` ne suffit pas à distinguer ces catégories.
- Les règles proposées retirent à l'égalité wilaya/niveau/filière le rôle de contrôle final des groupes scolaires. Les accès futurs doivent reposer sur l'affiliation officielle active, l'année scolaire, la source approuvée et une portée de groupe explicite.
- Protocole DM historique conservé pour cardinalités 0/1/2/>2, même si aucun DM n'existe dans l'instantané vivant ; aucune invitation rétroactive ni participant inventé.
- Rapport : `docs/product/LOT-339-COMPATIBILITE-GROUPES-DM-HISTORIQUES.md`.
- CI #3212 sur le Lot 338 était `in_progress` au dernier contrôle ; à repoller. Aucun test PostgreSQL multi-rôle exécuté.
- Aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage, modification client, branche Supabase, déploiement Cloudflare, changement `main` ou merge PR #17. Pas de MFA/2FA ni facturation.
- Décision : ne pas convertir le groupe isolé ni activer les groupes scolaires nationaux avant disponibilité du registre d'affiliation et contrôles serveur testés. Messenger national reste NO-GO.
- Étape suivante : contrôler CI des Lots 338/339 puis préparer le plan de test fonctionnel multi-compte (élève, vérificateur, modérateur, administrateur) sur PostgreSQL isolé, sans utiliser la base active comme banc d'essai.


---

## LOT 340 — Plan de tests fonctionnels multi-comptes Messenger (12 novembre 2026)

- CI #3213 confirmé `success` sur commit `44f3bf3e3dc9820e6ca881ba814f60bca4a90d32` ; CI #3212 `success`. PR #17 reste ouverte, non fusionnée et fusionnable.
- Créé `docs/product/LOT-340-PLAN-TESTS-MULTICOMPTES-MESSENGER.md` : jeu d'identités synthétiques pour élèves de deux établissements/wilayas, élève sans affiliation, élève opt-out, vérificateurs limités par établissement, modérateur, admin et compte extérieur.
- Matrice de tests couvrant annuaire (projection minimale, opt-in, affiliation, pagination, anti-énumération), invitations/DM (consentement, accept/refuse/cancel/expire, idempotence, courses, blocages, fermeture des INSERT directs), groupes (établissement, national, communautaire, transfert), vérification/admin, messages, pièces jointes, Realtime et modération.
- Le plan distingue tests négatifs d'autorisation, tests fonctionnels et tests multi-session/concurrence ; un simple succès HTTP ne suffit pas : l'état final transactionnel doit être vérifié.
- Blocage d'exécution confirmé par l'audit antérieur : pas de `psql`, moteur PostgreSQL, Docker ou Podman dans l'environnement ; aucune chaîne complète de migrations versionnées dans le dépôt. Pas de base de test Supabase créée (risque de coût, non autorisé).
- Le lot 340 est une spécification de tests, pas une exécution PostgreSQL ni une validation de sécurité. Les tests Node statiques existants ne remplacent pas les tests RLS multi-comptes.
- Aucun SQL d'écriture, DDL, migration, Auth/RLS/GRANT/Storage, environnement payant, modification client, déploiement Cloudflare, changement `main` ou merge PR #17. Aucun MFA/2FA ni facturation.
- Étape suivante : établir une chaîne de schéma/migrations reproductible et non payante, puis implémenter le harness PostgreSQL isolé. Ne pas utiliser la base active comme banc d'essai.


---

## LOT 341 — Récupération de la source SQL des migrations (12 novembre 2026)

- Découverte importante : `supabase_migrations.schema_migrations` possède les colonnes `version`, `name`, `statements` (ARRAY), `created_by`, `idempotency_key`, `rollback` (ARRAY). Les corps SQL exacts des 27 migrations appliquées sont récupérables depuis `statements[1]` par SELECT en lecture seule.
- Les 27 entrées ont exactement une instruction SQL chacune ; `rollback` est NULL pour les 27. Les versions s'étendent du 30 octobre au 9 novembre 2026.
- 11 migrations pertinentes Messenger/profils/pièces jointes/vérification ont été lues : `20261030131545`, `132222`, `132512`, `132541`, `133016`, `155716`, `171035`, `171056`, `171127`, `171556`, `171618` (préfixe complet `20261030...`). Les corps confirment que `msg_open_direct` crée un DM après `msg_can_dm`, sans vérifier une invitation acceptée ; les guards membership n'ajoutent pas ce consentement.
- Correction des Lots 333/334 : GitHub n'a aucun dossier/commit `supabase/migrations`, mais les corps SQL ne sont pas perdus ; le catalogue actif les conserve. Les rapports 333 et 334 reçoivent chacun un addendum de correction.
- Rapport Lot 341 : `docs/product/LOT-341-RECUPERATION-SOURCE-SQL-MIGRATIONS.md`.
- Les 27 deltas ne fournissent pas à eux seuls le baseline initial complet. Les scripts `schema.sql`/`msg_schema.sql` restent des scripts agrégés historiques ; aucun baseline n'est validé pour une reconstruction à neuf. Aucun moteur PostgreSQL isolé disponible ; aucun test d'intégration exécuté.
- CI #3214 et #3215 : success ; #3212 et #3213 : success. PR #17 toujours ouverte, non fusionnée, mergeable=true.
- Aucune écriture SQL/DDL/migration, aucun changement Auth/RLS/GRANT/Storage, aucune ressource payante, aucune modification client, aucun déploiement Cloudflare, aucun changement `main`, aucun merge PR #17. Pas de travail MFA/2FA ni facturation.
- Étape suivante : archiver sans transformation les 27 corps SQL avec leurs versions et empreintes SHA-256, puis construire un baseline initial séparé et le faire vérifier avant tout banc PostgreSQL.


---

## LOT 342 — Archive des migrations SQL Messenger (12 novembre 2026)

- CI #3216 et #3217 confirmés success avant les commits d'archivage ; PR #17 ouverte/non fusionnée.
- Extraction en lecture seule des 11 migrations Messenger/profils/pièces jointes/vérification depuis `supabase_migrations.schema_migrations.statements[1]` du projet actif. SHA-256 calculé côté PostgreSQL sur `convert_to(sql,'UTF8')` puis `digest(...,'sha256')`.
- 11 copies exactes créées sous `docs/architecture/migration-archive/`, une par version. Elles sont volontairement hors `supabase/migrations/` et ne doivent pas être rejouées automatiquement.
- Manifest et empreintes : `docs/architecture/LOT-342-MANIFEST-ARCHIVE-MIGRATIONS-MESSENGER.md`.
- Le lot exclut les 16 autres migrations hors périmètre, notamment comptabilité/paiements/Auth et le stockage MFA. Aucun travail de facturation ou MFA/2FA.
- Ces 11 deltas ne constituent pas un baseline initial ni une chaîne de reconstruction complète ; le journal de migration n'offre aucun rollback pour les 27 entrées. Pas de PostgreSQL isolé disponible, donc aucun test de restauration/rejeu exécuté.
- Aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage en base active, création de ressource payante, modification client, déploiement Cloudflare, changement `main` ou merge PR #17.
- Étape suivante : établir le baseline initial et l'inventaire des objets dépendants (extensions, rôles, fonctions, triggers, policies, grants, publications Realtime, Storage), puis vérifier la reconstruction dans un PostgreSQL isolé avant d'ajouter des migrations nationales Messenger.


---

## LOT 343 — Inventaire baseline PostgreSQL vivant (12 novembre 2026)

- Inventaire en lecture seule des catalogues Supabase actifs : schémas `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `realtime`, `storage`, `supabase_migrations`, `vault` ; tables de base : public 37, auth 27, realtime 10, storage 10, supabase_migrations 1, vault 1.
- RLS activé sur les 37 tables public et 10 tables storage ; FORCE RLS non activé sur ces tables lors de l'instantané.
- Extensions : pg_stat_statements 1.11, pgcrypto 1.3, plpgsql 1.0, supabase_vault 0.3.1, uuid-ossp 1.1.
- Fonctions : public 74 dont 71 SECURITY DEFINER ; storage 24 dont 3 ; auth 4 dont 0. Les fonctions SECURITY DEFINER publiques ont un search_path défini ; `msg_open_direct` utilise `search_path=''`.
- Triggers : public 37, storage 13, auth 1. Policies : public 71 couvrant 34 tables ; storage 5 couvrant `storage.objects`.
- Realtime : `supabase_realtime` publie `public.msg_conversations` et `public.msg_messages` ; publication interne distincte contient huit partitions `realtime.messages_2026_10_12` à `2026_10_18`.
- Storage : bucket `prive`, privé, `file_size_limit=NULL`, `allowed_mime_types=NULL`. Les restrictions Messenger reposent sur policies/métadonnées et ne prouvent pas une inspection du contenu binaire.
- Les politiques permissives Storage incluent des règles génériques de propriétaire et les règles Messenger dédiées ; elles se combinent par OR et doivent être testées ensemble.
- Rapport : `docs/product/LOT-343-INVENTAIRE-BASELINE-POSTGRESQL-VIVANT.md`.
- Le rapport est un inventaire de catalogues, pas un dump reconstructible. Il manque encore DDL complet, définitions fonctions/triggers, ACL détaillées, séquences/default privileges, publication complète, dépendances des services Supabase et protocole de restauration.
- Aucun SQL d'écriture, DDL, migration, changement Auth/RLS/GRANT/Storage, export de données personnelles, ressource payante, modification client, déploiement Cloudflare, changement `main` ou merge PR #17. Pas de MFA/2FA ni facturation.
- Étape suivante : établir un baseline applicatif public (hors schémas internes managés) et un manifeste des dépendances Supabase, puis comparer ce baseline à un environnement isolé avant tout développement des invitations nationales.


---

## 10. Reprise du 12 novembre 2026 — Lots 341 à 344 (source SQL et baseline)

### État GitHub vérifié à 23:04 (heure Algérie)

- PR #17 : ouverte, non fusionnée, `mergeable=true`.
- Branche : `design/prototypes-67-74-alignment`.
- HEAD observé : `0ffbc14f89827580906b9d3f2207d29efd55a15f`.
- CI #3225 : `success` sur ce HEAD (run https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/43315988376).
- Aucun changement direct sur `main`, aucune fusion et aucun déploiement effectué pendant cette reprise.

### Lots 341–342 — Source SQL et archive Messenger

- Le catalogue `supabase_migrations.schema_migrations` contient 27 migrations, chacune avec un élément SQL non vide dans `statements`.
- Les 11 migrations ciblées Messenger/profils/Storage/vérification ont été archivées sous `docs/architecture/migration-archive/`, hors de `supabase/migrations/` pour éviter toute application automatique.
- Le manifeste `docs/architecture/LOT-342-MANIFEST-ARCHIVE-MIGRATIONS-MESSENGER.md` consigne leurs versions et empreintes SHA-256 calculées depuis le SQL UTF-8 exact en base.
- Les 16 autres migrations ne sont pas archivées dans ce lot. Aucune migration liée au MFA/2FA n'est remise dans le périmètre.
- Les 11 deltas ne constituent pas un baseline initial complet ; les rollbacks du journal sont NULL.

### Lot 343 — Inventaire baseline vivant

- Rapport : `docs/product/LOT-343-INVENTAIRE-BASELINE-POSTGRESQL-VIVANT.md`.
- Inventaire catalogué : 37 tables `public`, 10 tables `storage`, 74 fonctions `public`, 24 fonctions `storage`, 51 triggers et 76 policies recensées selon le périmètre du rapport.
- La reproduction complète doit distinguer les objets applicatifs de ceux gérés par Supabase (Auth, Storage, Realtime, Vault, rôles et extensions).
- Le rapport est un inventaire, pas un dump restaurable.

### Lot 344 — Décision de périmètre du baseline de test

- Construire un baseline applicatif contrôlé centré sur `public` et ses dépendances explicites, puis un manifeste séparé des services Supabase managés.
- Ne pas copier les schémas internes `auth`, `realtime`, `storage` ou `vault` dans PostgreSQL vanilla.
- Avant tout test d'intégration, il faudra un export DDL contrôlé et validé des objets applicatifs, ACL, politiques, fonctions, triggers, extensions et publications nécessaires, puis comparer le catalogue restauré au snapshot source.
- L'environnement actuel ne dispose pas d'un moteur PostgreSQL local/isolé confirmé. Aucun environnement payant ne sera créé sans autorisation.

### Garde-fous toujours actifs

- Supabase actif : lecture seule ; aucune écriture SQL, DDL, migration, changement Auth/RLS/GRANT/Storage.
- Aucun changement client Messenger dans ce lot ; aucun déploiement Cloudflare.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée.
- Le Messenger national reste NO-GO jusqu'à l'affiliation scolaire officielle, l'invitation acceptée imposée côté serveur, la fermeture des voies de création DM directes et des tests multi-comptes réels sur environnement isolé.


## 11. Lot 345 — Vérification exacte de l'archive SQL Messenger (12 novembre 2026)

- Rapport : `docs/product/LOT-345-VERIFICATION-EXACTE-ARCHIVE-MIGRATIONS.md`.
- Comparaison caractère par caractère des 11 fichiers GitHub de `docs/architecture/migration-archive/` avec `supabase_migrations.schema_migrations.statements[1]` dans le projet actif.
- Résultat : **11/11 correspondances exactes** ; longueurs de texte concordantes pour chaque version.
- Les SHA-256 du manifeste Lot 342 sont ceux calculés depuis le SQL source avec pgcrypto.
- Cette vérification prouve la fidélité des copies archivées, pas la sûreté du SQL, ni la complétude du baseline initial, ni la restaurabilité de l'ensemble.
- Supabase actif consulté en lecture seule. Aucune écriture SQL, DDL, migration, modification Auth/RLS/GRANT/Storage.
- Aucun déploiement Cloudflare, aucune modification de `main`, aucun merge PR #17.
- PR #17 : ouverte, non fusionnée ; après recalcul GitHub, `mergeable=true`.
- CI #3226 déclenché sur le HEAD `ab3f585ddfb38dd185eb140c14f0387648c0c8a2` ; statut à confirmer avant clôture.


## 12. Lot 346 — Inventaire DDL ciblé Messenger/profils (12 novembre 2026)

- Rapport : `docs/product/LOT-346-INVENTAIRE-DDL-MESSENGER-PROFILES.md`.
- Extraction catalogue en lecture seule de 8 tables : les 7 tables Messenger et `profiles`, soit 66 colonnes au total.
- Contraintes PK/FK/CHECK/UNIQUE extraites ; références directes à `auth.users` confirmées.
- Aucun lien d'affiliation scolaire canonique/annuelle n'est présent dans `profiles`.
- Aucune table d'invitations n'existe dans ce périmètre.
- Observation à vérifier : aucune FK de `msg_messages.attachment_id` vers `msg_attachments` n'apparaît dans les contraintes recensées ; ne pas modifier avant audit triggers et usage client.
- Le rapport reste un inventaire, pas un DDL restaurable. Les index complets, séquences, ACL, fonctions, triggers et policies doivent encore être capturés.
- Aucune écriture Supabase, aucune migration, aucun déploiement, aucun merge PR #17, aucune modification de `main`.


---

## 13. Lot 347 — Audit fonctions, triggers, RLS et flux Messenger (12 novembre 2026)

- Rapport : `docs/product/LOT-347-AUDIT-FONCTIONS-TRIGGERS-RLS-MESSENGER.md`.
- Audit en lecture seule des fonctions `msg_%`, triggers sur conversations/membres/messages/pièces jointes, policies, index, publication Realtime et flux client.
- **NO-GO DM sans invitation côté serveur** : `msg_open_direct(uuid)` reste exécutable par `authenticated` et crée une conversation directe + deux membres sans consulter d'invitation. Le client `msgOpenDirect()` refuse désormais de créer un nouveau DM, mais ce garde-fou est contournable par appel RPC direct.
- Les policies permettent toujours l'INSERT d'une conversation directe par son créateur et l'auto-ajout d'un membre si `msg_member_ok` l'autorise ; le trigger limite à deux membres et vérifie `msg_can_dm`, mais ne vérifie pas le consentement.
- `msg_can_dm` exige même wilaya/niveau/filière et `verif_statut='verifie'` : incompatible avec le Messenger national et non équivalent à une preuve officielle d'affiliation.
- `msg_not_blocked` vérifie le blocage posé par un autre membre contre l'expéditeur, mais pas le blocage posé par l'expéditeur contre l'autre membre : sémantique directionnelle à arbitrer et tester.
- Le client rattache les pièces jointes via `msg_attachments.message_id`; `msg_messages.attachment_id` existe mais n'est pas utilisé par le flux client observé. Ne pas ajouter/supprimer de FK avant recherche exhaustive.
- Policy d'upload des métadonnées : membre de conversation, uploader courant, message existant, chemin et MIME autorisés, taille max 5 Mio ; elle ne vérifie pas que l'uploader est aussi l'auteur du message référencé. Le contrôle du MIME déclaré ne prouve pas l'analyse du contenu binaire.
- Triggers constatés : contrôle de DM, limitation messages (20/minute et 2 000 caractères), actualisation activité, taille pièces jointes, journalisation partielle des mises à jour.
- Realtime publie conversations et messages, pas membres ni métadonnées des pièces jointes. Index Messenger principaux recensés ; index dédié sur `msg_blocks.blocked_id` non observé.
- Aucun test d'attaque RPC, PostgreSQL isolé, multi-comptes ou Storage n'a été exécuté ; résultats = audit statique catalogue/code, pas certification de sécurité.
- Aucune écriture SQL/DDL/migration, modification Auth/RLS/GRANT/Storage, donnée personnelle consultée, ressource payante créée ou déploiement Cloudflare.
- PR #17 reste ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.
- Étape suivante : spécifier le contrat de consentement et de blocage, inventorier toutes les voies RPC/INSERT encore ouvertes, puis préparer des tests multi-comptes sur PostgreSQL isolé avant toute modification de la base active.


---

## 14. Lot 348 — Cartographie des points d'entrée Messenger (12 novembre 2026)

- Rapport : `docs/product/LOT-348-CARTOGRAPHIE-POINTS-ENTREE-MESSENGER.md`.
- Cartographie des méthodes client `SB`, de la vue `msg.js`, des opérations directes sur les tables, du RPC DM et des policies vivantes.
- `msg.js` passe par `window.SB` et ne fait pas d'écriture directe dans les tables `msg_*`. `msgOpenDirect()` ne crée plus de DM ; il retrouve seulement un DM partagé ou retourne `msg_invitation_requise`.
- **Trois voies serveur de DM sans invitation restent ouvertes** : RPC `msg_open_direct(uuid)` ; INSERT direct d'une conversation `type='direct'` par son créateur ; auto-ajout du deuxième membre via `msg_member_ok` lorsque le DM contient déjà un membre compatible. Aucun chemin ne consulte un enregistrement d'invitation.
- La fonction vivante `msg_member_ok` est plus stricte que celle du fichier versionné `supabase/msg_schema.sql` : elle réserve le premier membership au créateur et permet le deuxième membre compatible à s'ajouter lui-même. La version durcie correspond à l'archive migration `20261030132512_close_direct_chat_join_and_lock_trigger_functions.sql`. Elle ne garantit toutefois pas le consentement.
- **Drift dépôt/base confirmé** : ne pas réappliquer `supabase/msg_schema.sql` à l'aveugle ; il pourrait remplacer une fonction vivante plus stricte par une définition plus faible. L'archive est source de provenance, pas une chaîne de déploiement.
- `msgCreateGroup()` réalise un INSERT groupe, mais la policy vivante exige un modérateur ; ne pas confondre ce chemin avec l'ouverture d'un DM.
- `msgSend()` est un INSERT de message sous RLS ; il ne crée pas de conversation. `msgUpload()` passe par Storage puis métadonnées, avec politiques distinctes.
- Les tests statiques vérifient l'absence d'INSERT DM dans le client, mais ne testent pas les appels RPC directs, INSERT REST, consentement ni concurrence. Prévoir tests PostgreSQL isolés multi-comptes.
- Contrat cible : seule opération transactionnelle serveur depuis une invitation acceptée ; fermer INSERT DM client, auto-ajout membre DM et RPC historique ; valider destinataire, expiration, affiliation officielle, blocage bilatéral ; créer conversation + deux membres + audit atomiquement et idempotemment.
- Aucun changement base/code runtime, aucun déploiement ou ressource payante ; PR #17 reste ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.


---

## 15. Lot 349 — Contrat de fermeture serveur des DM sans invitation (12 novembre 2026)

- Rapport : `docs/product/LOT-349-CONTRAT-FERMETURE-SERVEUR-DM.md`.
- Spécification consolidée de la machine d'états des invitations : `pending`, `accepted`, `declined`, `cancelled`, `expired`. Le blocage reste une relation indépendante dans `msg_blocks`, pas un état d'invitation.
- Création d'invitation : identité expéditeur issue de `auth.uid()`, anti-auto-invitation, idempotence, limitation anti-spam, opt-in annuaire, affiliation institutionnelle active et vérifiée, prise en charge nationale inter-wilayas, contrôle des blocages dans les deux sens.
- Acceptation cible : RPC `msg_direct_open_from_accepted_invite(invite_id)`, destinataire uniquement, verrouillage de l'invitation et de la paire, revalidation de l'affiliation/consentement/blocage, création conversation + exactement deux memberships + audit dans une transaction, rollback intégral en cas d'échec.
- Contrat de fermeture des trois voies découvertes au lot 348 : RPC historique `msg_open_direct(uuid)`, INSERT direct `msg_conversations` type direct, auto-ajout `msg_members`. Les groupes gardent une voie d'autorisation distincte.
- Compatibilité : aucun DM historique converti artificiellement en invitation acceptée ; aucun historique supprimé ; conversations à 0/1/3+ membres isolées pour revue ; groupes, pièces jointes, signalements et Realtime soumis à des tests de régression.
- Blocage : vérification symétrique A→B et B→A à la création et à l'acceptation ; préservation de l'historique des DM existants et interdiction des nouveaux envois selon règle serveur à valider.
- Affiliation : le statut `profiles.verif_statut`, le matricule ou la wilaya déclarés ne sont pas une preuve officielle. Le futur annuaire national doit exiger une affiliation institutionnelle vérifiée, active pour l'année en cours, avec source approuvée et consentement explicite.
- Matrice d'intégration ajoutée : appels RPC directs, INSERT REST, auto-adhésion, course double acceptation, annulation/refus/expiration, blocages, révocation/transfert d'affiliation, historique, groupes, Storage et Realtime. Tests à exécuter uniquement sur PostgreSQL isolé avec identités synthétiques.
- **Aucune implémentation runtime, écriture Supabase, migration, modification Auth/RLS/GRANT/Storage, création de ressource payante ou déploiement Cloudflare** dans ce lot. Les tests multi-comptes réels restent à exécuter ; le Messenger n'est pas déclaré prêt pour ouverture nationale.
- CI #3230 : `success` sur le HEAD précédent `fe017a397f5e5d225532c6f5e3b13561003744d5`. Le rapport et la présente mise à jour de continuité déclenchent une nouvelle CI à contrôler.
- PR #17 reste ouverte et non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.


---

## 16. Lot 350 — Vérification des définitions SQL vivantes Messenger (12 novembre 2026)

- Rapport : `docs/product/LOT-350-VERIFICATION-DEFINITIONS-SQL-VIVANTES-MESSENGER.md`.
- Inspection SELECT du catalogue Supabase actif : définitions de `msg_open_direct(uuid)`, `msg_can_dm(uuid,uuid)`, `msg_member_ok(bigint,uuid)`, `msg_not_blocked(bigint,uuid)`, ACL fonctions/tables et policies INSERT sur `msg_conversations` / `msg_members`.
- `msg_open_direct` est SECURITY DEFINER, propriétaire postgres, exécutable par authenticated/postgres/service_role ; elle vérifie auth.uid, la compatibilité de profil, verrouille la paire, puis crée conversation et deux membres sans consulter d'invitation.
- `msg_can_dm` exige même wilaya/niveau/filière et `profiles.verif_statut='verifie'` ; aucune affiliation institutionnelle canonique/année scolaire ; blocage du scénario national inter-wilayas.
- `msg_member_ok` autorise le premier membership au créateur et le second auto-ajout si compatible via `msg_can_dm`, sans invitation acceptée.
- `msg_not_blocked` vérifie le cas où un autre membre a bloqué l'expéditeur, mais pas le cas où l'expéditeur a bloqué l'autre membre : contrôle directionnel confirmé.
- RLS vivante : INSERT conversation autorisé au créateur pour type direct (ou modérateur pour groupe) ; INSERT membre autorisé à l'utilisateur sur son propre identifiant si `msg_member_ok` passe. GRANT INSERT est accordé à authenticated, sous réserve RLS.
- Le rapport confirme les trois voies de création DM sans consentement et précise qu'aucune correction isolée n'est suffisante : RPC, INSERT conversation et auto-ajout doivent être fermés de manière cohérente.
- Aucun SELECT de données personnelles/contenus, aucune écriture Supabase, DDL, migration, changement Auth/RLS/GRANT/Storage/Realtime ou ressource payante. Aucun test multi-comptes/JWT ou concurrence exécuté.
- PR #17 reste ouverte/non fusionnée ; `main` inchangée. Aucun déploiement Cloudflare. MFA/2FA et facturation hors périmètre.


---

## 17. Lot 351 — Audit des dépendances SECURITY DEFINER, triggers et policies (12 novembre 2026)

- Rapport : `docs/product/LOT-351-AUDIT-DEPENDANCES-SECURITY-DEFINER-RLS-TRIGGERS.md`.
- Inspection en lecture seule du graphe des fonctions `msg_*`, ACL, search_path, SECURITY DEFINER, triggers et policies RLS Messenger.
- Fonctions SECURITY DEFINER et dépendances relevées : `msg_open_direct`, `msg_can_dm`, `msg_member_ok`, `msg_not_blocked`, `msg_is_member`, `msg_is_moderator`. Les helpers de contrôle uid vérifient `uid=auth.uid()` ; leur EXECUTE ne permet pas, à lui seul, d'interroger librement le statut d'un tiers.
- Trigger `msg_tr_direct` → `msg_guard_direct()` : verrouille la conversation, limite les DM à deux membres, exige le créateur comme premier membre et vérifie la compatibilité de profil pour le second. **Il ne vérifie pas d'invitation acceptée** ; il protège la cardinalité, pas le consentement.
- Triggers complémentaires : limite 20 messages/minute et 2 000 caractères, actualisation `last_activity`, plafond pièces jointes 5 MiB, journalisation de mises à jour. Tous les détails et ACL sont dans le rapport.
- Policies dépendantes : création de conversation directe par le créateur ; auto-ajout via `msg_member_ok` ; envoi message via `msg_not_blocked` directionnel ; lecture via `msg_is_member`/`msg_is_moderator` ; règles distinctes fichiers, blocs et signalements.
- La migration future doit fermer ensemble RPC historique, INSERT direct conversation et auto-ajout membre ; préserver les fonctions de lecture/modération/groupes et refaire l'inventaire des policies permissives cumulées, grants hérités, wrappers RPC et search_path au moment de l'application.
- Matrice de tests complémentaire ajoutée : trigger sans invitation, chemin d'acceptation, troisième membre, appels helpers, blocage dans les deux sens, groupes, pièces jointes, signalements et journalisation.
- Aucune donnée personnelle/contenu lue ; aucune écriture Supabase, DDL, migration, changement Auth/RLS/GRANT/Storage/Realtime, test multi-compte ou ressource payante. Pas de déploiement Cloudflare.
- CI #3233 réussie sur le commit rapport Lot350 `7ccf9ddc7879ab05db8475f7fd2f1cb3b6641ab1`. Le rapport Lot351 et la mise à jour de continuité déclenchent les CI suivantes à contrôler.
- PR #17 ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.


---

## 18. Lot 352 — Audit accès indirects PostgREST, rôles et ACL par défaut (12 novembre 2026)

- Rapport : `docs/product/LOT-352-AUDIT-ACCES-INDIRECTS-POSTGREST-ACL-ROLES.md`.
- Tables Messenger : RLS activée sur les sept tables vérifiées ; aucun SELECT/INSERT direct pour anon ; SELECT/INSERT pour authenticated sous réserve des policies ; FORCE RLS désactivé.
- Routines référant à `msg_*` : `admin_dashboard()` et les fonctions Messenger connues. `admin_dashboard()` est SECURITY DEFINER, non exécutable par anon, exécutable par authenticated mais vérifie `admin_can(auth.uid(),'reports.read')` avant de renvoyer des agrégats administratifs, dont le nombre de signalements ouverts dans le périmètre autorisé. Tests de refus élève et cloisonnement admin à ajouter.
- Aucune vue/vue matérialisée public/graphql_public référençant les tables Messenger détectée dans l'inspection.
- Rôles : anon et authenticated sans BYPASSRLS ni appartenance héritée à un rôle privilégié ; service_role BYPASSRLS ; authenticator hérite désactivé et sert au routage API. La clé service_role doit rester strictement côté serveur.
- ACL par défaut : pour objets futurs créés par supabase_admin, EXECUTE fonctions et privilèges de tables/séquences sont accordés par défaut à anon/authenticated/service_role ; pour objets créés par postgres, ACL par défaut plus restrictives (postgres/service_role). La migration devra fixer propriétaire et révoquer explicitement les droits non nécessaires. Aucun changement ACL effectué.
- Les paramètres PostgREST n'étaient pas visibles dans pg_settings ; configuration effective des schémas exposés non confirmée. Aucun test HTTP/PostgREST dans ce lot.
- Tests ajoutés au plan : RPC anon, élève/admin_dashboard, périmètres administratifs, ACL post-migration, helper privé, service_role absent du client, schémas PostgREST, vues/agrégats, tests HTTP multi-JWT.
- Aucune donnée personnelle ou contenu de message lu ; aucune écriture SQL/DDL, migration, Auth/RLS/GRANT/Storage/Realtime, aucun déploiement Cloudflare, aucune ressource payante.
- CI #3235 réussie sur commit rapport Lot351 `4ea88d71efd832323b230fefe758cc8783db1048`. Les commits Lot352 et continuité déclenchent les prochaines CI à contrôler.
- PR #17 reste ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.


---

## 19. Lot 353 — Audit navigateur, secrets et Workers Cloudflare (12 novembre 2026)

- Rapport : `docs/security/LOT-353-AUDIT-SECRETS-NAVIGATEUR-WORKERS-CLOUDFLARE.md`.
- Audit statique ciblé de 11 fichiers de configuration, client, Workers, workflow et authentification ; aucun secret concret `service_role`, `sb_secret_`, Resend, Cloudflare ou GitHub détecté dans ces fichiers. La clé `sb_publishable_...` dans `supabase/supabase.js` est une clé publishable destinée au navigateur, pas une clé service_role. Ce n'est pas un scan exhaustif de tout l'historique Git.
- `assets/bdd/config.json` expose l'URL publique du Worker IA `ia-ask.bridrandomtv.workers.dev` ; `resend_proxy` est vide dans la configuration auditée.
- `worker/ia-ask.js` : `POST /ask` sans JWT/session/compte/abonnement. CORS n'est pas une authentification ; le quota de 20/minute est stocké dans un tableau en mémoire d'instance, non durable, non global, non par utilisateur. Le corps est lu intégralement avant troncature. Risque d'abus de capacité IA.
- `worker/resend-welcome.js` : `POST /send-welcome` sans authentification ni preuve d'inscription, destinataire arbitraire validé syntaxiquement, sans rate limit ni idempotence. La clé Resend est seulement lue via `env.RESEND_API_KEY`, pas présente en clair. Le proxy n'est pas activé par la config du site ; déploiement effectif non vérifié.
- `src/site-worker.js` : les chemins dans PROT exigent un Bearer et consultent `lesson_content` avec clé anon + JWT ; fail-closed si bindings absents. Couverture de l'allowlist et règle RLS d'abonnement à tester avec JWT anon, élève non abonné, abonné, expiré et chemins non listés.
- Workflow GitHub : validation uniquement, pas de job deploy ; wrangler.toml déclare le Worker principal seulement. Les secrets/bindings Cloudflare réels ne sont pas visibles dans le dépôt.
- Corrections prioritaires documentées : JWT validé pour IA, quota durable par utilisateur/IP, limite du corps, protection et idempotence e-mail côté serveur, vérification complète de l'allowlist contenus, tests HTTP et secret scanning CI.
- Aucune écriture Supabase, migration, changement Auth/RLS/GRANT/Storage/Realtime, modification Worker ou déploiement Cloudflare. Pas de scan complet de l'historique Git, pas de test HTTP production, aucun secret runtime consulté.
- CI #3239 réussie sur le HEAD précédent `d11d5d5cf6630544e09ff08a68baa69764f78f42`. Le rapport Lot353 et le présent dossier déclenchent de nouveaux runs.
- PR #17 reste ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation hors périmètre.


---

## 20. Lot 354 — Contrat d'authentification des Workers (12 novembre 2026)

- Contrat : `docs/security/LOT-354-CONTRAT-AUTHENTIFICATION-WORKERS.md`.
- CI #3240 et #3241 : succès ; #3241 sur le HEAD du dossier Lot353 `e7e251897d400c7ebb75f9911749a8a7182f3ad5`.
- Constat de raccordement client : `supabase/supabase.js` expose `SB.getSession()` et un helper `authHeaders()` pour le JWT ; l'appel IA dans `app.js` ne transmet actuellement pas Authorization.
- Point de vigilance : `auth.js` possède encore une session locale/localStorage indépendante. Un Worker ne doit jamais accepter cette session locale comme preuve d'identité ; seul un JWT Supabase validé côté serveur est recevable.
- Contrat commun : Bearer Supabase obligatoire, validation serveur via Auth `/auth/v1/user` avec clé publishable/anon, refus fail-closed, rôles/abonnements relus côté serveur, corps borné avant parsing, erreurs neutres, aucun JWT dans les logs.
- IA : session active, quotas durables partagés par utilisateur et limites globales, contrôle concurrence/timeout, contexte fourni par client traité comme non fiable. L'ancienne limite mémoire 20/minute n'est pas un contrôle robuste.
- E-mail : décision par défaut de désactiver `/send-welcome` public et garder `resend_proxy` vide ; privilégier événement serveur d'inscription/confirmation, destinataire dérivé d'Auth, idempotence et anti-abus.
- Contenus : vérifier le droit sur la ressource précise et couvrir toute l'allowlist ; PostgREST avec clé publishable/anon + JWT utilisateur pour préserver RLS.
- Matrice de 16 tests WKR-01 à WKR-16, incluant anon, JWT invalide/expiré, session locale seule, compte suspendu, non-abonné, quota multi-instance, timeout Auth, chemins non autorisés et rejeu e-mail.
- Ce lot est une spécification seulement : aucun code Worker/app modifié, aucun déploiement, aucune écriture Supabase ni modification Auth/RLS/GRANT/Storage/Realtime.
- PR #17 demeure ouverte/non fusionnée ; `main` inchangée. MFA/2FA et facturation exclus.

---

## 21. Lot 355 — Messenger visible dans la navigation (12 novembre 2026)

- Rapport : `docs/product/LOT-355-MESSENGER-NAVIGATION-VISIBLE.md`.
- Cause confirmée : `TABS` contenait déjà la vue `msg`, mais `renderTabs()` la supprimait du tableau `visible`; la catégorie `NAVCATS` « القسم والتواصل » ne contenait pas `msg`, et le fallback l'excluait aussi.
- Correction sur la branche `design/prototypes-67-74-alignment` : ajout de `msg` à « القسم والتواصل », suppression des deux exclusions. L'entrée doit maintenant apparaître dans le menu desktop et dans le panneau « ☰ المزيد » mobile.
- Contrôles de non-régression ajoutés à `ci/check-msg.mjs` : vérifier que `msg` est classé dans la navigation et qu'il n'est plus filtré.
- Commits : app.js `9b88ae270b68f3e51c3692934e95852d9522d3a7`; test `d8c26ae488c658c5251dff4586f33a18c8229781`; rapport `77bd0087879a5acf6b34b4c336212831bfce9df1`.
- Ce lot ne modifie pas le moteur Messenger, les autorisations ni la base active. L'invitation nationale, l'affiliation officielle et les protections serveur restent inachevées.
- Aucun changement Supabase, aucun déploiement Cloudflare, aucune modification de `main), aucune fusion de PR. MFA/2FA et facturation hors périmètre.

---

## 22. Lot 356 — Accès direct à Messenger (12 novembre 2026)

- Rapport : `docs/product/LOT-356-ACCES-DIRECT-MESSENGER.md`.
- Retour utilisateur après Lot355 : la messagerie restait trop enfouie dans une catégorie. Décision : accès direct depuis les deux formats.
- Desktop : bouton « 💬 الرسائل » ajouté aux accès principaux. Mobile : même entrée ajoutée à la barre rapide, sans ouvrir « ☰ المزيد ».
- `msg` retiré de NAVCATS pour éviter le doublon et ajouté à l'ensemble `used` pour empêcher le fallback desktop de recréer une seconde entrée.
- Tests de non-régression étendus dans `ci/check-msg.mjs` pour le raccourci desktop, l'entrée mobile, l'absence d'exclusion et l'absence de doublon.
- Commits : raccourcis `89de542f5bb879ea4c0d887ea6725f39b2511ea5`; protection doublon `2144774410cb9d1a310a088c2bef6f51394ef7a5`; tests `3e96799fe13fad368444f8d46dd54c887a855a0c` et `6d7715d4736a04cc2932c823c8a851f81a3e446d`; rapport `ce8a5c4e4238ded1bced8a50a60420488c485752`.
- Contrôle visuel navigateur Cloudflare non effectué dans ce lot. La correction doit être validée sur l'aperçu PR avant fusion.
- Aucun changement Supabase, aucun déploiement Cloudflare, aucune modification de `main), aucune fusion de PR. PR #17 demeure ouverte/non fusionnée. MFA/2FA et facturation hors périmètre.

---

## 23. Lot 357 — Audit fonctionnel du Messenger (13 novembre 2026)

- Rapport : `docs/product/LOT-357-AUDIT-FONCTIONNEL-MESSENGER.md` (commit `7205bd4adc5a8d7757247a79b27095855863e871`).
- Verdict : le dépôt possède une messagerie scolaire partielle (groupes, liste de conversations, messages texte, Realtime, présence par fil, fichiers limités, signalement/modération). Ce n'est pas encore un Messenger national équivalent à Meta.
- Recherche : le champ actuel filtre uniquement les 50 conversations/cartes déjà chargées; aucun annuaire national ou recherche d'élèves/lycées/wilayas n'est appelé. Les DM sont affichés sous un libellé générique « Conversation privée #ID ».
- Nouveau DM : `msgOpenDirect()` ne réouvre qu'un DM existant partagé et renvoie `msg_invitation_requise` pour un nouveau contact. Aucun flux d'invitation/acceptation n'est implémenté dans le client ni aucune table/opération d'invitation déployée.
- Fichiers : PNG/JPEG/WebP/PDF, 5 Mio max; Storage privé et URL signée. Pas d'analyse antivirus démontrée.
- Temps réel : INSERT/UPDATE messages et présence Realtime pendant un fil; accusés de lecture, non-lus, typing, push et synchronisation multi-appareils non démontrés.
- Actions modifier/supprimer/bloquer existent en méthodes client mais ne disposent pas de parcours complet visible dans l'écran audité.
- Risque confidentialité : `fetchNames()` lit directement `profiles(id,pseudo,role,niveau)`; ne pas réutiliser cette lecture pour l'annuaire national. Construire une projection serveur minimale avec consentement.
- Priorités : P0 fermer les trois voies serveur DM sans invitation et vérifier blocage bilatéral; P1 affiliation institutionnelle officielle, invitations transactionnelles, annuaire opt-in national; P2 UX contacts, non-lus, lecture, pagination, notifications et durcissement médias.
- Lot 358 prévu : plan de tests serveur multi-comptes et inventaire final des dépendances avant toute migration isolée.
- Aucun code runtime modifié, aucun changement Supabase, aucun déploiement Cloudflare, aucune modification de `main), aucune fusion PR #17. PR #17 demeure ouverte/non fusionnée. MFA/2FA et facturation hors périmètre.

### Rectificatif de continuité — Lot 357 (13 novembre 2026)

- Le Lot 357 est une synthèse de vérification, pas une demande de refaire Messenger. Les travaux UX Lot 308 (recherche locale, filtres, responsive) et Lot 309 (photos/PDF, upload privé, fil) restent acquis et ne sont pas à réimplémenter.
- Le prototype messagerie à niveaux 0→7 a déjà été audité au Lot 305. Les invitations ont été étudiées aux lots 310–311 et spécifiées dans les lots 323–340 et 348–352. Le plan multi-comptes Lot 340 et le plan de verrouillage Lot 326 existent déjà : ne pas les réécrire.
- Les lots 355–356 ont traité la visibilité et l'accès direct à Messenger. Ces corrections restent conservées.
- La prochaine suite doit réutiliser les prototypes, écrans, contrats et tests déjà réalisés. Seuls les écarts non livrés sont à traiter : affiliation institutionnelle officielle, fermeture et tests serveur dans PostgreSQL isolé, intégration du flux d'invitation/annuaire déjà spécifié, puis recette de non-régression.
- Aucun nouveau chantier de refonte UX ni de reconstruction Messenger n'est autorisé par ce rectificatif. Aucun changement Supabase actif, déploiement Cloudflare, modification de main ou fusion PR #17.



## 24. Lot 358 — Correction du routage Messenger (13 novembre 2026)

- Problème reproductible identifié dans `app.js` : le raccourci desktop/mobile pointait bien vers `data-go="msg"`, et `index.html` contenait `data-view="msg"`, mais la constante `VIEWS` ne déclarait pas `msg`. La fonction `go(view)` rejetait donc cette vue et redirigeait vers `accueil`. Le bouton pouvait être visible sans ouvrir Messenger.
- Correction minimale : ajout de `msg` dans la liste des vues autorisées. Aucun nouvel écran ni refonte Messenger ; les lots UX et les prototypes précédents sont conservés.
- Non-régression : `ci/check-msg.mjs` vérifie désormais explicitement que la route `msg` figure dans `VIEWS`. Le contrôle `ci/check-public-portal.mjs` a également été synchronisé avec `app.js?v=3569` et la version service worker `dz-de-v3.185.0.0.144` ; son premier passage a révélé des attentes de cache encore fixées sur les numéros précédents, corrigées dans le commit `9e1d5b2`. Un second passage a révélé une assertion historique supplémentaire (ligne navigation Lot 99) qui attendait encore `app.js?v=3568`; corrigée dans `9a677a4`. Relancer et attendre la CI du nouveau HEAD avant de considérer le lot vert. Le run suivant a ensuite mis en évidence des attentes historiques dans `ci/check-masar.mjs` (SW `.143` et `app.js?v=3568`) ; elles sont alignées sur `.144`/`v3569` dans `d169d96`.
- Cache : référence `app.js?v=3569` dans `index.html` et le précache du service worker ; version du worker `dz-de-v3.185.0.0.144`.
- Commits du lot : `ed80c1e` (route), `99576a9` (test), `abf2bee` (cache index), `4d6ceb4` (service worker).
- Validation navigateur réelle non revendiquée à ce stade ; attendre la CI et vérifier l'URL de prévisualisation Cloudflare du nouveau HEAD. La correction n'est pas en production.
- Aucun changement Supabase/Auth/RLS/schéma, aucun déploiement de production, aucune modification de `main), aucune fusion de PR #17. PR #17 reste ouverte et non fusionnée.


## 25. Lot 359 — Harmonisation arabe de la messagerie (13 novembre 2026)

- Constat confirmé dans `msg.js` : l'entrée de navigation était déjà « 💬 الرسائل », mais l'accueil non connecté, les explications, les filtres, la recherche, les groupes, les conversations, la modération, les formulaires de vérification et la rédaction contenaient encore des libellés français ou mixtes.
- Harmonisation des textes visibles de la messagerie en arabe : accueil et états de session, présentation des fonctionnalités, filtres et recherche, groupes et conversations, vérification scolaire, modération, fil de discussion, envoi et pièces jointes.
- Conservation des identifiants DOM, attributs `data-act`/`data-mod`, méthodes `window.SB`, événements, routes, limites de fichiers et contrats serveur. Les noms techniques internes et les commentaires de développement ne sont pas des libellés d'interface et restent inchangés.
- Ajout de contrôles ciblés dans `ci/check-msg.mjs` pour les libellés arabes et l'absence des principaux textes français visibles.
- Aucun changement Supabase/Auth/RLS/schéma/Storage, aucune modification de `main`, aucun déploiement de production et aucune fusion de PR #17.
- Validation visuelle navigateur non revendiquée ; attendre la CI et la preview Cloudflare de ce HEAD, puis vérifier le rendu arabe RTL sur ordinateur et mobile.

- Commits du lot 359 : traduction initiale de l'interface `21c2576`, garde CI `21fe9fc`, dossier `a62e124`, corrections de libellés résiduels `14d1d1d`, assertions CI replacées avant la condition d'échec `14bb710`.
- Vérification CI GitHub déclenchée sur `14bb710` : run #3269, état **pending** au moment de cette mise à jour ; aucune réussite n'est revendiquée avant la fin du workflow.
- Relecture statique après correction : aucun libellé français statique détecté dans les éléments HTML visibles ciblés. Les messages d'erreur dynamiques renvoyés par les fonctions serveur restent affichés tels quels afin de ne pas modifier les contrats métier dans ce lot.


## 26. Lot 359-B — Correction du bandeau et du cache Messenger (13 novembre 2026)

- La relecture après CI a détecté que le bandeau de la vue `data-view="msg"` dans `index.html` était encore en français ; il est désormais en arabe.
- Correction de deux identifiants internes affectés par une substitution trop large dans le lot précédent : restauration de `isMod0` et `isMod`. Le libellé de modération et le libellé de groupe résiduel ont été harmonisés en arabe.
- Cache navigateur synchronisé : `msg.js?v=3513`, précache correspondant ajouté au service worker et version SW portée à `dz-de-v3.185.0.0.145`.
- Contrôle CI étendu au bandeau HTML, au cache de `msg.js`, au précache SW et à l'intégrité des identifiants de modération.
- La CI #3269 avait réussi sur le commit antérieur `14bb710`; cette validation ne couvre pas le présent correctif 359-B. Une nouvelle exécution est requise.
- La dernière preview Cloudflare connue pointait sur le commit `27533e1`, antérieur au lot 359. Aucun déploiement preview du HEAD `db48a25` ni de ce correctif n'est encore confirmé. Aucun test visuel en navigateur n'est revendiqué.
- Aucun changement Supabase/Auth/RLS/schéma/Storage, aucune modification de `main`, aucun déploiement production et aucune fusion de PR #17.


## 27. Lot 359-C — Dernier libellé résiduel de pièce jointe (13 novembre 2026)

- Relecture de `msg.js` après le lot 359-B : un état d'erreur de pièce jointe affichait encore « indisponible pour ce compte » en français.
- Texte visible remplacé par `تعذّر الوصول إلى الملف المرفق من هذا الحساب.` ; aucun identifiant DOM, événement, méthode Supabase ou contrat métier modifié.
- Test `ci/check-msg.mjs` complété pour interdire la réintroduction de ce libellé français.
- Cette correction est une finition de localisation, pas une reconstruction de Messenger. Les lots UX 305, 308–310, 323–352 et les lots de navigation/routage 355–358 restent la référence et ne sont pas repris.
- Aucun changement Supabase/Auth/RLS/schéma/Storage, aucune modification de `main`, aucun déploiement Cloudflare et aucune fusion de PR #17.
- Validation CI et aperçu navigateur du HEAD mis à jour encore à effectuer ; aucune réussite CI ni validation visuelle n'est revendiquée dans ce lot.


## 28. Lot 359-D — Correction du test CI Messenger (13 novembre 2026)

- La CI #3275 sur le commit `6ed6799` a échoué dans l'étape de validation Messenger avant l'exécution des assertions : expression régulière JavaScript invalide dans `ci/check-msg.mjs` (parenthèse de « Modération (signalements) » mal échappée).
- Correction limitée à l'échappement du motif de test ; aucun code fonctionnel de Messenger, aucune donnée, aucun accès ou contrat serveur modifié.
- Commit correctif : `6a5694e`. Une nouvelle exécution CI doit confirmer la reprise complète des assertions.
- Le commentaire Cloudflare de la PR confirme un déploiement Preview réussi du commit `6ed6799` (URL de branche et URL de commit fournies dans le commentaire). Ce déploiement ne comprend pas le correctif CI `6a5694e` tant qu'un nouveau build n'est pas confirmé.
- Aucun déploiement production, aucune fusion, aucune modification de `main`, aucun changement Supabase/Auth/RLS/schéma/Storage.


## 29. Lot 359-E — Alignement du contrôle CI sur le Service Worker v145 (13 novembre 2026)

- La CI #3276 a exécuté avec succès les validations de syntaxe, de Messenger, d'administration, du registre et des unités pédagogiques. Elle s'est arrêtée ensuite sur le contrôle du portail public.
- Cause exacte : `sw.js` et `index.html` référencent correctement `style-prototype-dz.css?v=195` et le Service Worker est déjà en version `dz-de-v3.185.0.0.145`. Le test `ci/check-public-portal.mjs` conservait deux assertions historiques sur la version `.144`, provoquant un faux échec.
- Correction limitée au test : les deux attentes de version du Service Worker sont alignées sur `.145`. Aucun CSS, HTML, code runtime, route, identifiant ou contrat serveur modifié dans ce correctif.
- Commit du correctif CI : `e498fdb`. Une nouvelle CI doit confirmer le passage complet du workflow ; aucun succès n'est présumé avant sa conclusion.
- Les contrôles Messenger de la CI #3276 ont tous réussi, y compris l'harmonisation arabe et les assertions ajoutées au lot 359-D.
- Aucun changement Supabase/Auth/RLS/schéma/Storage, aucune modification de `main`, aucun déploiement de production et aucune fusion de PR #17. PR #17 reste ouverte et non fusionnée.


## 30. Lot 360 — Numéro d’abonnement pour la vérification Messenger (13 novembre 2026)

- Remplacement du champ étudiant « رقم التسجيل المدرسي » par « رقم الاشتراك بعد تفعيل الدفع » ; la saisie est numérique et la section/classe reste demandée.
- Source du numéro : `public.subscriptions.id`, identifiant `GENERATED ALWAYS AS IDENTITY PRIMARY KEY`, donc attribué par PostgreSQL et unique. Le numéro n’est affiché dans la page الاشتراك المميز qu’après activation (`statut = 'actif'`).
- Le formulaire vérifie que ce numéro correspond à une ligne d’abonnement active du compte connecté (`user_id = auth.uid()`), sous la politique RLS de lecture des abonnements propres au compte. Un numéro d’un autre compte ou non activé est refusé par le parcours normal.
- La colonne historique `profiles.matricule` est réutilisée pour stocker ce numéro, afin d’éviter toute migration de schéma. Les libellés visibles de la file de modération sont renommés en « رقم الاشتراك ».
- `billing.js` versionné en v3511 ; `msg.js` en v3514 ; Service Worker `dz-de-v3.185.0.0.146`, avec précache de `msg.js` et `billing.js`. Assertions ajoutées à `ci/check-msg.mjs`.
- Limite de sécurité explicitement conservée : le déclencheur SQL historique `profiles_verif_guard` ne lie pas encore lui-même `matricule` à un abonnement actif. Le parcours applicatif vérifie le lien, et la validation reste manuelle par un modérateur ; une garantie contre un appel API forgé nécessiterait une évolution SQL/RPC/RLS. Aucune de ces modifications n’est déployée ni ajoutée au schéma actif dans ce lot.
- Le contrôle CI précédent (#3278) avait échoué sur une attente historique `.144` dans `ci/check-masar.mjs` ; l’attente est maintenant alignée sur `.146`. Le nouveau workflow doit confirmer l’ensemble.
- Aucun changement de base Supabase active, Auth, RLS, schéma ou paiement ; aucune modification de `main`, aucun déploiement de production et aucune fusion de PR #17.


### Lot 360-A — Ajustement du test CI

- Le workflow #3284 a confirmé que les assertions du nouveau numéro et le contrôle d’abonnement actif passent. Le test s’arrêtait uniquement parce que `billing.js` n’était pas encore chargé dans `ci/check-msg.mjs` avant l’assertion qui vérifie l’affichage du numéro.
- Déclaration de lecture de `billing.js` ajoutée au test. Aucun code applicatif ni aucune donnée Supabase modifiés par ce correctif.
- Nouveau workflow attendu avant de déclarer le lot vert.


### Lot 360-B — Synchronisation du test du portail public

- La CI #3285 a validé le contrôle Messenger du lot 360, y compris la vérification d’un abonnement actif propre au compte et l’affichage du numéro dans la page d’abonnement.
- Le run s’est ensuite arrêté sur deux assertions historiques de `ci/check-public-portal.mjs` qui attendaient le Service Worker `.145` après le passage légitime à `.146`. Les deux attentes et le message de diagnostic sont alignés sur `.146`.
- Aucun code d’exécution supplémentaire ni aucune donnée Supabase modifiés dans ce correctif.


### Lot 360-C — Validation complète

- Workflow GitHub Actions #3287 : `success`. Le contrôle Messenger passe, y compris les quatre assertions Lot 360 ; le portail public, le cache, le tableau مسارك et les autres contrôles structurels/pédagogiques passent également.
- Le correctif `.145` → `.146` de `ci/check-public-portal.mjs` a supprimé le dernier échec CI connu.
- La prévisualisation Cloudflare n’a pas encore publié de commentaire de déploiement pour les commits Lot 360 ; le dernier déploiement confirmé reste `9add8b1`. Ne pas présenter ce lien comme contenant la nouvelle interface tant qu’un nouveau déploiement n’est pas confirmé.
- PR #17 reste ouverte et non fusionnée. Aucun déploiement de production ni aucune modification de `main` ou de la base Supabase active.


## Lot 361 — contrôle de continuité Messenger et prévisualisation publiée (13 novembre 2026)

### État vérifié sur le HEAD du PR #17

- Branche : `design/prototypes-67-74-alignment`.
- HEAD contrôlé : `4500a722fbd4723569fb36c4455a123084de82a8`.
- PR #17 : ouverte, non fusionnée, base `main`.
- CI #3288 / run GitHub Actions `43407890297` : `success`, job « Validation structurelle & pédagogique » terminé sans étape en échec.
- Cloudflare a publié le commit `4500a72` en prévisualisation : build et déploiement réussis le 13 novembre 2026 à 10:17:06 UTC. URL du déploiement précis : `https://efde7e82-allemand.brid-randomtv.workers.dev`. URL de branche : `https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev`.
- Cette prévisualisation est un déploiement de PR, pas une publication de production.

### Découvrabilité de Messenger

- Relecture de `app.js` et `index.html` : route `msg`, vue `data-view="msg"` et module `msg.js` sont raccordés.
- Ordinateur : bouton direct `💬 الرسائل` dans la navigation principale, à côté des accès principaux.
- Mobile : entrée `💬 الرسائل` dans la navigation rapide.
- Les assertions correspondantes existent dans `ci/check-msg.mjs` et passent dans la CI #3288.
- Il s'agit d'une confirmation du câblage du code et des tests. La recette visuelle interactive dans le navigateur reste distincte.

### Contrôle de continuité du vrai Messenger

La relecture du code courant confirme les limites déjà documentées aux lots 310–357 ; elles ne doivent pas être traitées comme des fonctions livrées :

- Le filtre de recherche de l'écran porte sur les conversations et groupes déjà chargés ; il ne constitue pas un annuaire national des élèves.
- `msgOpenDirect(otherId)` peut rouvrir un DM déjà partagé, mais renvoie `msg_invitation_requise` lorsqu'il n'existe pas. Il ne crée pas de conversation et n'enrôle pas le destinataire.
- Le schéma versionné `supabase/msg_schema.sql` contient les tables de conversations, membres, messages, pièces jointes, signalements, blocages et journal ; il ne contient toujours pas de table `msg_invites` ni de RPC d'invitation, réponse ou annulation.
- La spécification existante reste la référence : invitation `pending` sans conversation, acceptation/refus par le destinataire, annulation par l'expéditeur et création atomique du DM uniquement à l'acceptation. Aucun nouvel écran d'invitation ne doit être ajouté comme s'il était opérationnel avant le contrat serveur.
- La règle actuelle `msg_can_dm` repose encore sur la correspondance wilaya+niveau+filière et la vérification des profils. Elle ne démontre pas une affiliation officielle à un lycée et ne répond pas à l'objectif de réseau national inter-wilayas.
- Les travaux antérieurs sur les prototypes, la spécification des invitations, la matrice de tests multi-comptes et le verrouillage serveur sont conservés. Ce lot ne les réécrit pas.

### Numéro d'abonnement et sécurité

- Le lot 360 est bien présent dans le HEAD contrôlé : le formulaire arabe demande le numéro d'abonnement ; le client vérifie que l'identifiant correspond à un abonnement actif du compte connecté ; la page abonnement affiche l'identifiant après activation.
- La clé primaire de l'abonnement empêche deux lignes d'abonnement d'avoir le même identifiant.
- Limite inchangée : le lien profil↔abonnement n'est pas encore imposé par le garde SQL historique lors d'une modification directe du profil. Le contrôle client ne constitue pas une protection contre un appel API forgé. Le renforcement serveur reste en attente d'une autorisation distincte pour les changements de schéma/règles sur la base active.

### Décision et prochaine étape

- Ne pas déclarer le Messenger national terminé : l'annuaire national, le cycle d'invitation réel, l'affiliation institutionnelle prouvée et la création transactionnelle des DM ne sont pas livrés.
- Ne pas contourner l'absence de registre d'affiliation en se fondant sur des champs de profil déclaratifs, la wilaya ou le numéro d'abonnement. Le numéro d'abonnement prouve le lien avec l'abonnement de la plateforme, pas l'inscription officielle dans un lycée.
- Réutiliser les contrats et plans déjà écrits ; prochaine étape technique sûre : préparer/valider un environnement PostgreSQL isolé pour exécuter la matrice de tests existante et éprouver les fonctions, triggers, RLS et chemins de création DM, sans toucher à la base active. L'annuaire national et les invitations inter-wilayas restent bloqués jusqu'à preuve institutionnelle et autorisation de migration.
- Aucun SQL ou migration exécuté ; aucune écriture Supabase ; aucun changement Auth/RLS/GRANT/Storage ; aucun changement de `main` ; aucun merge ; aucune publication de production.


## Lot 362 — intégration des tests d'affiliation synthétique à la CI (13 novembre 2026)

### Constat

- Les tests du prototype `prototypes/registry-affiliation-scenarios-core.test.mjs` existaient déjà, mais n'étaient pas appelés par `.github/workflows/deploy.yml`.
- Ces scénarios couvrent l'habilitation d'un vérificateur au périmètre exact d'un lycée, l'interdiction d'auto-validation, la provenance de source vérifiée, la clôture des décisions, le transfert, la révocation, l'expiration et l'éligibilité conditionnelle à l'annuaire.
- Les identifiants utilisés sont synthétiques (`SYN-*`). Ces tests ne constituent pas une preuve administrative ni un test PostgreSQL/RLS.

### Modification sur la branche

- Commit : `bd10a426f34e603694f02e8a25b04e7bc7a9b6b1`.
- Fichier modifié : `.github/workflows/deploy.yml`.
- Ajout des deux fichiers du moteur de scénarios d'affiliation dans la liste des fichiers requis.
- Ajout d'une étape CI dédiée qui exécute `node --test prototypes/registry-affiliation-scenarios-core.test.mjs`.
- La CI du commit est en attente au moment de la rédaction ; ne pas déclarer les tests passés avant la fin du workflow.

### Garde-fous et décisions inchangés

- Aucun dossier élève réel ni export ministériel n'est présent dans le dépôt. Les sources JORADP identifiées au lot 314 documentent des actes de création/suppression d'établissements, pas un instantané exhaustif des lycées actifs ni les inscriptions individuelles.
- Aucun changement SQL, Auth, RLS, GRANT, Storage ou donnée Supabase.
- Aucun environnement de base jetable créé ; aucun coût engagé.
- PR #17 reste ouverte, non fusionnée ; aucun changement sur `main), aucun déploiement de production.
- Le défaut serveur `msg_open_direct` et les INSERT directs décrits au lot 347 restent bloquants. La correction doit être préparée après test PostgreSQL isolé et revue des dépendances ; le client seul ne suffit pas.

### Suite

Attendre le résultat CI du commit, puis poursuivre l'audit des contrats serveur et des dépendances de l'ancienne RPC sans l'exécuter ni la modifier dans la base active. Le cycle réel d'invitations et l'annuaire national restent non livrés tant que les preuves d'affiliation institutionnelle et les contrôles serveur atomiques ne sont pas disponibles.


### Correctif découvert par la nouvelle exécution CI — Lot 362-A

- La première exécution du test nouvellement branché a échoué : 5 scénarios sur 8 passaient, 3 échouaient.
- Cause racine : le moteur hors ligne classait `verified` comme état terminal. Cela empêchait ensuite les transitions pourtant prévues de transfert, révocation et expiration.
- Correction sur la branche : commit `4f9b4023cddb5c6e2fc25ae5cc2430ababfd864a`, fichier `prototypes/registry-affiliation-scenarios-core.mjs`. L'état `verified` n'est plus dans l'ensemble des états finaux ; les états réellement clôturés restent `rejected`, `revoked`, `expired` et `transferred`.
- Les tests existants couvrent directement les trois transitions précédemment bloquées. La CI du commit correctif doit encore confirmer le résultat ; aucun succès n'est présumé.
- Cette correction concerne uniquement le simulateur synthétique hors ligne. Elle ne change ni une règle de base active ni une affiliation réelle.


### Lot 362-B — précision de la machine d'états après second passage CI

- Après le premier correctif, la CI a fait passer 7 scénarios sur 8. Le test de non-répétition d'une décision finale a alors révélé qu'une deuxième validation pouvait être tentée sur un dossier déjà `verified`.
- Correctif complémentaire : commit `c837747ae60d1ee563d9fd7e6f42152ec4d8f379`. Les transitions `verify` et `reject` sont maintenant réservées à un dossier `pending`, tandis que les transitions autorisées depuis `verified` (transfert, révocation, expiration) restent possibles.
- Résultat CI de ce commit : en attente de confirmation. Le prototype reste synthétique et hors ligne.


### Lot 362-C — alignement du message de garde avec le test existant

- La CI a confirmé les 7 autres scénarios ; le dernier échec était uniquement une divergence de texte entre le message d'erreur de la nouvelle garde et l'expression attendue par le test de non-répétition.
- Le comportement était correct : la seconde validation était bien refusée. Le message a été aligné sur le contrat historique `Dossier déjà clôturé.`.
- Commit correctif : `fd9805218b5a427299063fb152678b374a894d5d`.
- Nouvelle exécution CI requise ; résultat non présumé à la rédaction.


### Lot 362-D — validation CI réussie

- Le commit de code `fd9805218b5a427299063fb152678b374a894d5d` a été validé par le workflow GitHub Actions `43413853042`.
- Conclusion : `success`, job « Validation structurelle & pédagogique » terminé sans étape en échec.
- Les 8 scénarios du cycle d'affiliation synthétique sont désormais exécutés dans la CI et passent.
- Cela valide uniquement le simulateur hors ligne et les assertions automatisées. Cela ne valide pas encore une implémentation PostgreSQL, RLS, une source institutionnelle réelle ou l'annuaire national.


## Lot 363 — confirmation en lecture seule du contournement DM dans Supabase actif (13 novembre 2026)

### Recontrôle du catalogue PostgreSQL actif

Projet contrôlé : `azjwcybivirvpxbfhyzk`. Requêtes strictement SELECT sur `pg_proc`, ACL des fonctions, `pg_policies` et `information_schema.role_table_grants`. Aucune donnée personnelle, aucun message ni contenu de conversation lu.

Résultats observés :

- `public.msg_open_direct(p_other uuid)` existe toujours.
- La fonction est `SECURITY DEFINER`, avec `search_path = ''`.
- Son ACL inclut explicitement `authenticated` pour EXECUTE.
- Sa définition vérifie `auth.uid()), le destinataire et `msg_can_dm`, recherche un DM existant, puis crée une nouvelle conversation et les deux lignes membres si aucun DM n'existe. Elle ne vérifie aucune invitation acceptée.
- `public.msg_can_dm(a uuid,b uuid)` est également SECURITY DEFINER et exécutable par authenticated.
- La policy INSERT `msg conv creation` sur `msg_conversations` autorise authenticated à créer un direct lorsque `auth.uid() = created_by).
- La policy INSERT `msg members ajout` sur `msg_members` autorise authenticated à s'ajouter lui-même si `msg_member_ok(conversation_id,auth.uid())` passe.
- Le rôle authenticated possède les privilèges INSERT sur `msg_conversations` et `msg_members`.

### Conclusion de sécurité

Le contournement identifié au lot 347 est confirmé sur le catalogue actif à la date du contrôle. Le blocage côté navigateur ne constitue pas une protection suffisante. **NO-GO confirmé** pour l'ouverture générale du Messenger et pour annoncer que les invitations protègent déjà les nouveaux DM.

### Décision opérationnelle

Ne pas révoquer isolément l'ancienne RPC ni retirer les policies immédiatement : cela pourrait casser les parcours de conversations existants sans que le cycle d'invitations serveur soit prêt. La correction doit être une migration coordonnée qui :
1. introduit et teste les opérations serveur d'invitation ;
2. rend la création directe impossible hors acceptation atomique ;
3. retire les droits d'insertion directs incompatibles après inventaire des consommateurs ;
4. conserve les groupes officiels et les DM historiques ;
5. passe une matrice PostgreSQL multi-rôle et les tests de non-régression sur une base jetable.

Aucune écriture, migration, révocation de privilège ou modification de policy n'a été effectuée sur Supabase actif.

## Lot 364 — inventaire des chemins de création Messenger et compatibilité des droits (13 novembre 2026)

### Périmètre contrôlé

Lecture de `msg.js`, `supabase/supabase.js`, `supabase/msg_schema.sql`, des tests Messenger et des anciennes migrations archivées. Complément par introspection SELECT du catalogue PostgreSQL actif (`azjwcybivirvpxbfhyzk`). Aucun message, profil nominatif ou contenu de conversation consulté.

### Chemins applicatifs identifiés

- `msgOpenDirect(otherId)` dans `supabase/supabase.js` ne crée pas de conversation depuis le navigateur : il recherche un DM partagé existant, puis renvoie `msg_invitation_requise` si aucun n'existe.
- `msgCreateGroup(wilaya,niveau,filiere,titre)` crée en revanche un groupe par INSERT direct dans `msg_conversations`. Ce chemin est utilisé par l'interface de modération des groupes officiels.
- Les opérations ordinaires de lecture, envoi, fichiers et modération utilisent les tables `msg_*` et leurs policies ; elles ne doivent pas être neutralisées par une révocation globale mal ciblée.
- Les tests `tests/msg_test.mjs` et `ci/check-msg.mjs` vérifient l'absence de création DM côté client, mais ne démontrent pas à eux seuls que la base active refuse les INSERT/API/RPC forgés.

### Définition serveur observée sur la base active

- `msg_open_direct(uuid)` reste une fonction SECURITY DEFINER accordée à `authenticated`. Son corps vérifie `msg_can_dm`, cherche une conversation existante, puis crée la conversation et les deux adhésions dans la même transaction. Il ne consulte aucune invitation acceptée.
- `msg_can_dm(a,b)` exige que l'appelant soit l'un des deux UUID et que les deux profils soient vérifiés et partagent wilaya, niveau et filière. Cette règle ne couvre donc pas le réseau national inter-wilayas souhaité et ne prouve pas une inscription à un lycée.
- `msg_member_ok(cid,uid)` vérifie que `uid=auth.uid()`. Pour un DM, il permet au créateur de s'ajouter quand la conversation ne contient aucun membre, puis permet à l'autre utilisateur de s'ajouter si `msg_can_dm` l'autorise. Le trigger `msg_guard_direct` vérifie le nombre de membres et `msg_can_dm`, mais ne vérifie pas d'invitation.
- La policy INSERT `msg conv creation` autorise un utilisateur authentifié à créer une conversation de type `direct` dont il est le créateur. La policy INSERT `msg members ajout` autorise l'utilisateur à s'ajouter lui-même si `msg_member_ok` passe. Ensemble, ces chemins permettent encore de contourner le garde du navigateur ; l'ancienne RPC constitue un second chemin indépendant.
- Le trigger `msg_tr_direct` est présent sur `msg_members`. Il ne remplace pas une vérification d'invitation : il délègue actuellement à `msg_can_dm`.

### Matrice de compatibilité à respecter pour la future migration

| Chemin | État actuel | Exigence de correction |
|---|---|---|
| Création d'un groupe officiel par un modérateur | INSERT client existant, soumis à policy | Préserver uniquement pour les rôles habilités et les contrôles de groupe |
| Auto-adhésion à un groupe | Contrôle de correspondance wilaya/niveau/filière | Préserver provisoirement sans présenter ces champs comme une preuve d'inscription officielle |
| Réouverture d'un DM historique | Lecture d'un DM dont l'utilisateur est déjà membre | Préserver sans recréer ni ré-enrôler un membre |
| Nouveau DM par `msg_open_direct` | RPC SECURITY DEFINER sans invitation | Remplacer par acceptation d'invitation atomique ; ne pas laisser l'ancienne RPC créer de nouveaux DM |
| Nouveau DM par INSERT direct | Policies + trigger ne demandent pas d'invitation | Refuser toute création/adhésion directe à un DM hors RPC d'acceptation |
| Lecture/envoi/messages/pièces jointes | Policies dédiées | Conserver les accès des membres et les restrictions existantes |

### Décision technique

La correction ne doit pas consister à supprimer indistinctement les INSERT sur les deux tables : cela casserait `msgCreateGroup` et potentiellement des parcours de modération. Il faut séparer les autorisations selon le type de conversation, déplacer la création du DM dans une RPC d'acceptation transactionnelle, puis retirer l'accès direct aux chemins DM après tests d'intégration. Les DM historiques doivent rester accessibles à leurs membres, sans que leur existence autorise l'ajout d'un nouveau membre.

Les migrations archivées des 30 octobre (notamment `20261030132222`, `20261030132512` et `20261030131545`) sont des versions antérieures du durcissement de l'adhésion/RPC ; elles ne constituent pas une migration d'invitation et ne doivent pas être rejouées telles quelles sur la base active.

### Suite immédiate

1. Construire une migration candidate séparant explicitement les INSERT groupe/direct et l'acceptation des invitations.
2. Tester sur PostgreSQL isolé avec deux élèves synthétiques, un modérateur et un tiers : RPC historique, INSERT conversation direct, auto-adhésion au DM, acceptation valide, double acceptation concurrente, réouverture historique et création de groupe.
3. Vérifier les droits effectifs et le comportement RLS après migration candidate ; fournir un rollback.
4. Garder l'annuaire national inter-lycées bloqué jusqu'à l'intégration d'une source institutionnelle d'affiliation.

Aucun SQL n'a été appliqué à Supabase actif. Aucun fichier applicatif, Auth, RLS, GRANT, Storage ou donnée active n'a été modifié dans ce lot. Aucun changement sur `main), aucun merge et aucun déploiement de production.

## Lot 365 — vérification finale des consommateurs Messenger et correction de la chronologie (13 novembre 2026)

### Relecture ciblée du client réel

Fichiers relus sur la branche :
- `supabase/supabase.js` (fonctions Messenger et vérification scolaire) ;
- `msg.js` (actions d'interface) ;
- `tests/msg_test.mjs` ;
- `ci/check-msg.mjs` ;
- `supabase/msg_schema.sql` ;
- contrats Lots 310 et 311.

Constats exacts dans le HEAD :

1. `msgOpenDirect(otherId)` ne fait plus appel à `msg_can_dm` pour créer un DM. Il recherche un identifiant de conversation où les deux utilisateurs sont déjà membres, puis renvoie `msg_invitation_requise` si aucun DM partagé n'existe. Il n'effectue aucun INSERT.
2. Les tests `tests/msg_test.mjs` et `ci/check-msg.mjs` vérifient explicitement l'absence d'INSERT client dans cette fonction. La CI valide ce garde du client, pas les garanties de la base active.
3. `msgCreateGroup(wilaya,niveau,filiere,titre)` conserve un INSERT direct dans `msg_conversations` avec `type='groupe'`. Il est appelé depuis l'action de modération `creategroup` dans `msg.js`. Toute migration doit préserver ce parcours uniquement pour les modérateurs autorisés par la policy serveur.
4. Le client ne possède pas encore de méthodes `msgInviteCreate`, `msgInviteRespond`, `msgInviteCancel`, `msgInvitesInbox` ou `msgInvitesOutbox`. Aucun écran d'invitations réellement connecté au backend n'est livré.
5. `msgCanDm(otherId)` reste exposée côté client et appelle la RPC `msg_can_dm`. Elle ne doit jamais être utilisée comme autorisation finale par le navigateur ; seule la vérification atomique serveur doit décider.
6. `msgRequestVerification` vérifie un abonnement actif associé au compte, puis inscrit un numéro dans `profiles.matricule` et un statut `en_attente`. Cela ne constitue pas une preuve institutionnelle d'affiliation à un lycée. La validation manuelle `msgSetVerification` ne remplace pas non plus un registre officiel.

### Rectification de lecture historique

Le texte initial du Lot 310 décrivait l'ancien comportement client de `msgOpenDirect` (appel `msgCanDm`, tentative de création et d'insertion de deux membres). Ce comportement n'est plus celui du HEAD actuel : il a été remplacé par la recherche d'un DM existant et le refus `msg_invitation_requise`. La faille du serveur actif reste distincte et confirmée au Lot 363 : l'ancienne RPC `msg_open_direct` et les politiques/privileges INSERT actifs permettent encore des créations directes hors du client. Il ne faut donc ni attribuer la faille actuelle au code client corrigé, ni confondre la protection du client avec la sécurité serveur.

### État de validation

- Commit documentaire précédent : `de97391e11c1716e940b7a47cacb828b8a0de193`.
- Workflow CI de ce commit : `43415464389`, conclusion `success`.
- PR #17 toujours ouverte, non fusionnée ; HEAD documentaire mis à jour dans la continuité de la branche.
- Aucune migration candidate SQL ajoutée : la dépendance institutionnelle du Lot 311 reste non résolue. Créer maintenant une table d'invitations qui s'appuierait sur `verif_statut`, `matricule`, `wilaya` ou `niveau` reviendrait à présenter une vérification de plateforme comme preuve d'inscription officielle.
- Aucun SQL appliqué, aucune écriture Supabase, aucune modification Auth/RLS/GRANT/Storage, aucun compte ni message réel consulté ; aucun changement de `main), aucun merge, aucun déploiement de production.

### Décision et prochaine étape

Le travail serveur doit rester en deux phases indépendantes :
- **Phase de prérequis institutionnel** : définir et intégrer une relation vérifiable et traçable élève↔lycée, un statut d'activité/suspension et les règles de visibilité/consentement de l'annuaire.
- **Phase Messenger** : préparer la migration d'invitations et le durcissement des DM sur PostgreSQL isolé, en gardant la création de groupes modérés et la lecture des DM historiques, puis tester tous les contournements directs et RPC.

Le lot ne peut pas être déclaré « Messenger terminé ». L'interface de navigation existe, mais le véritable cycle d'invitation, l'annuaire national et l'autorisation serveur sans contournement ne sont pas encore livrés.



## Lot 366 — confirmation du référentiel scolaire et des affiliations sur la base active (13 novembre 2026)

- Reprise des lots 314, 315, 322, 327 et 337 : les sources JORADP, le prototype d'import hors ligne, le modèle relationnel logique, la provenance des preuves et le contrat serveur Messenger sont déjà documentés. Aucun de ces travaux n'est réécrit.
- Introspection en lecture seule du catalogue PostgreSQL actif `azjwcybivirvpxbfhyzk` : aucune table publique nommée comme un registre scolaire, un lycée, une école, une inscription ou une affiliation n'a été trouvée.
- Les colonnes existantes de `profiles` incluent `wilaya`, `niveau`, `filiere`, `matricule`, `section`, `verif_statut`, `verif_by` et `verif_at`. `wilaya_assignments` représente des affectations d'agents par wilaya, pas une inscription d'élève dans un lycée.
- Seuls les catalogues `information_schema` ont été interrogés : aucune ligne de profil, d'affectation, d'audit ou de Messenger n'a été lue. Aucun SQL d'écriture, DDL, migration, Auth, RLS, GRANT ou Storage n'a été modifié.
- Conclusion : aucun élément du schéma public actif ne permet actuellement de certifier une relation élève↔lycée. Les champs déclaratifs du profil, le matricule et la vérification interne ne doivent pas alimenter l'annuaire national comme preuves officielles.
- La conception SQL est déjà suffisamment documentée dans le Lot 322 ; le blocage est institutionnel : obtenir un référentiel courant émis par une autorité habilitée, puis un mécanisme autorisé de vérification des inscriptions individuelles, avec rôles, base juridique, consentement et rétention définis.
- Nouveau rapport détaillé : `docs/product/LOT-366-CONFIRMATION-REFERENTIEL-AFFILIATION-ACTIVE.md`.
- Aucun changement sur `main), aucune fusion de PR #17, aucun déploiement Cloudflare. PR #17 est toujours ouverte et non fusionnée au contrôle API ; son indicateur `draft` est actuellement `false`, sans intervention de ce lot.
- Décision : NO-GO pour l'annuaire national réel et les invitations inter-lycées tant que la preuve institutionnelle n'est pas obtenue ; GO pour les tests hors ligne sur données synthétiques.


## Lot 367 — limites du prototype d'affiliation et préparation du cycle d'invitations (13 novembre 2026)

- Relecture des contrats Lots 322, 327 et 337 et des deux fichiers du prototype synthétique `registry-affiliation-scenarios-core`.
- Les huit tests actuels valident des transitions unitaires sur des identifiants SYN ; ils ne valident ni PostgreSQL, ni RLS, ni les rôles réels, ni la concurrence transactionnelle.
- Limite importante : l'unicité élève/année dépend actuellement d'un paramètre facultatif `previousEnrollment`. Le helper ne possède pas de dépôt global ; il ne peut donc pas garantir à lui seul l'unicité des affiliations actives.
- Limite annuaire : `canAppearInNationalDirectory` vérifie statut, année, état de source et opt-in, mais pas encore compte suspendu, rôle étudiant, dates d'effet, blocages Messenger, quotas ou habilitation de l'approbateur. Ces contrôles restent des exigences du contrat serveur Lot 337, pas des fonctions livrées.
- Aucune méthode réelle d'invitation n'a été ajoutée : les opérations du Lot 337 sont toujours contractuelles. La création du DM après acceptation devra être atomique et testée en concurrence.
- Rapport détaillé : `docs/product/LOT-367-LIMITES-PROTOTYPE-AFFILIATION-PREPARATION-INVITATIONS.md`.
- Décision : GO pour prototypes et tests synthétiques isolés ; NO-GO pour annuaire national, invitations inter-lycées et migrations de production avant source institutionnelle, baseline PostgreSQL fiable et tests transactionnels.
- Aucun SQL appliqué à Supabase actif ; aucune donnée personnelle ou conversation consultée ; aucune modification Auth/RLS/GRANT/Storage ; aucun changement sur `main), aucun merge, aucun déploiement Cloudflare.


## Lot 368 — pré-reconstitution du baseline PostgreSQL Messenger (13 novembre 2026)

- Reprise de la tâche prioritaire : reconstituer une base de test PostgreSQL fidèle puis tester les autorisations avec plusieurs comptes synthétiques. Aucun écran Messenger ni parcours d'invitation n'a été reconstruit dans ce lot.
- Contrôle de l'environnement d'exécution : Node.js 22.16.0 présent ; `psql`, `postgres`, `initdb`, `pg_ctl`, Docker, Podman et Supabase CLI absents ; aucun paquet PostgreSQL disponible dans les index apt locaux.
- Contrôle Supabase : PostgreSQL actif version 17.6 ; 27 versions de migration appliquées listées, mais les noms seuls ne reconstituent pas leurs corps SQL ; la liste des branches ne contient que `main` (`with_data=false`), aucune branche de test.
- Vérification du coût : création d'une branche Supabase de développement chiffrée à 0,01344 USD/heure. Aucune branche créée, aucune dépense engagée.
- Extraction SELECT des catalogues pour huit tables (sept tables Messenger et `profiles`) : colonnes, types, defaults, identity, contraintes, index, état RLS, policies, triggers, fonctions/ACL EXECUTE, privilèges table/colonnes, policies Storage et publication Realtime. Aucune donnée applicative ou nominative consultée.
- Faits serveur reconfirmés : `msg_open_direct(uuid)` SECURITY DEFINER exécutable par authenticated crée un DM sans invitation ; INSERT direct sur conversations et auto-adhésion par `msg_member_ok` restent ouverts sous RLS ; la règle `msg_can_dm` dépend encore de wilaya/niveau/filière et du statut de profil ; blocage directionnel ; policy d'attachement non liée explicitement à l'auteur du message ; bucket `prive` privé, limites MIME/taille portées par policies/metadata ; Realtime sur conversations/messages.
- Les tables ont RLS activé mais `FORCE ROW LEVEL SECURITY=false` sur le périmètre extrait : les tests doivent utiliser les rôles applicatifs non propriétaires. Le harness doit initialiser correctement `auth.uid()` et les claims de test ; les tests propriétaires ne prouvent pas RLS.
- Aucun moteur PostgreSQL local n'est disponible et la branche Supabase a un coût horaire non nul. Aucun test PostgreSQL multi-rôle/concurrent n'a été exécuté. Un émulateur JS ne sera pas présenté comme équivalent à PostgreSQL.
- Rapport : `docs/product/LOT-368-PREBASELINE-POSTGRESQL-MESSENGER-ET-ENVIRONNEMENT.md`.
- Décision : GO pour compléter le baseline documentaire et le harness ; NO-GO pour déclarer la restauration ou les tests multi-comptes terminés. La création d'une branche Supabase payante attend une autorisation explicite.
- Aucun SQL d'écriture, migration, changement Auth/RLS/GRANT/Storage/Realtime, aucun compte ni contenu de message lu ; aucun changement sur `main), aucun merge PR #17, aucun déploiement Cloudflare.

## Lot 369 — validation d'un second projet Supabase gratuit (13 novembre 2026)

- Lecture directe des métadonnées de l'organisation Supabase `yhigaygkffkdygpaglaf` : plan confirmé `free` / `tier_free`.
- Inventaire de l'organisation : un seul projet actif connu, `azjwcybivirvpxbfhyzk` (PostgreSQL 17.6.1.166, région `eu-west-2`).
- Devis API Supabase pour un nouveau projet dans cette organisation : `0 USD/mois`. Aucun projet n'a été créé pendant cette vérification.
- Documentation officielle Supabase consultée le 13 novembre 2026 : deux projets Free actifs sont autorisés ; quotas partagés au niveau de l'organisation ; les projets Free peuvent être mis en pause après une semaine d'inactivité. Le branching reste indisponible sur Free.
- Sources : https://supabase.com/docs/guides/platform/billing-on-supabase ; https://supabase.com/docs/guides/platform/billing-faq ; https://supabase.com/docs/guides/platform/free-project-pausing
- Décision de sécurité : ne pas créer le second projet sans confirmation explicite de l'utilisateur. Aucun coût, aucune carte, aucun upgrade, aucun changement de projet actif.
- Une fois autorisé, créer uniquement un projet de test séparé dans l'organisation Free, en région `eu-west-2`, sans données de production. Le restaurer à partir du baseline Messenger reconstruit, puis exécuter les tests PostgreSQL avec comptes synthétiques. Contrôler les quotas Free avant d'importer quoi que ce soit.
- État de test : aucun test PostgreSQL/RLS multi-compte n'est encore exécuté ; le fichier historique `supabase/msg_schema.sql` reste non fiable comme miroir exact de la base active.
- PR #17 reste ouverte, non fusionnée ; aucune modification de `main`, aucune migration sur le projet actif, aucun déploiement Cloudflare.

## Lot 370 — extraction complémentaire des dépendances PostgreSQL Messenger (13 novembre 2026)

- Nouvelle lecture SELECT des catalogues du projet Supabase actif : colonnes et état RLS des huit tables Messenger/profiles, policies actives, définitions des fonctions Messenger, triggers et dépendances d'administration.
- Confirmation : `msg_open_direct(uuid)` est SECURITY DEFINER, exige Auth, valide la compatibilité via `msg_can_dm`, prend un verrou consultatif transactionnel, réutilise un DM existant ou crée conversation + membres. **Elle ne vérifie toujours pas une invitation acceptée**. Correction de précision par rapport au résumé précédent : la fonction vérifie bien la compatibilité, mais pas le consentement préalable.
- Confirmation : `msg_member_ok` autorise l'auto-ajout du second membre compatible sans invitation acceptée ; policies direct creation / member add encore présentes.
- `msg_not_blocked` ne constitue pas une vérification bilatérale générale ; tests séparés A→B et B→A requis.
- Policy upload active : uploader courant, MIME whitelist, 1–5 242 880 octets, statut pending, message existant, membre de conversation et chemin préfixé par conversation + UUID uploader. Elle ne compare pas explicitement l'uploader à `msg_messages.sender_id`.
- Dépendances admin actives identifiées : `wilaya_assignments`, `admin_permissions`, `admin_roles`, fonctions `is_admin`, `admin_can`, `admin_role_of`, `admin_wilayas`, `admin_sees_wilaya`. Triggers additionnels de `profiles` à capturer : `profiles_tr_audit_role` et `trg_protect_role_niveau`.
- Rapport créé : `docs/product/LOT-370-EXTRACTION-CATALOGUE-DEPENDANCES-MESSENGER.md`, commit `a71432c61fba73340e4ba5fb0a1a47d3df74982e`.
- Aucun test PostgreSQL/RLS multi-compte exécuté ; aucune donnée applicative lue ; aucun DDL, migration, écriture ou changement Auth/RLS/GRANT/Storage/Realtime.
- Le second projet Free n'a pas été créé : le devis précédent est à 0 USD/mois, mais la création reste en attente d'une autorisation explicite. Aucun frais engagé.
- PR #17 reste ouverte et non fusionnée ; aucun changement sur `main`, aucun déploiement Cloudflare.
- Prochaine étape technique : terminer l'export reproductible des contraintes/index/ACL/fonctions/triggers/storage/realtime, puis assembler le baseline et les scripts de tests synthétiques à exécuter sur une instance isolée autorisée.

## Lot 371 — contraintes, index et ACL Messenger (13 novembre 2026)

- Extraction SELECT des contraintes PK/FK/CHECK/UNIQUE, index, ACL table et ACL EXECUTE des fonctions Messenger et helpers admin.
- Dépendances Auth confirmées : plusieurs clés étrangères Messenger pointent directement vers `auth.users(id)`; `profiles.id` référence également Auth. La reconstruction doit inclure le modèle de rôles et de claims Auth, pas seulement le schéma public.
- Contraintes importantes : membres PK composite conversation/user ; blocages PK blocker/blocked ; signalements uniques par message/reporter ; pièces jointes avec MIME allowlist, taille 1–5 MiB, chemin contraint et SHA-256 ; affectations admin liées aux rôles.
- ACL observées : RPC `msg_open_direct` exécutable par authenticated/service_role ; helpers de lecture/décision exposés aux rôles prévus ; fonctions internes de triggers non accordées à authenticated. Ces distinctions doivent être conservées.
- Dépendance additionnelle : `profiles_tr_audit_role_fn()` appelle `audit_log(...)`, dont EXECUTE est réservé à postgres/service_role. `protect_role_niveau()` dépend de `is_admin()` et du contexte current_user.
- Rapport : `docs/product/LOT-371-CONTRAINTES-INDEX-ACL-MESSENGER.md`, commit `7fca7274892fb1c43db027d16c49a2bee205e79b`.
- La requête ciblée Storage n'a pas retourné de policy via son filtre de nom ; cela ne prouve pas l'absence de policies. Export complet storage.objects/bucket encore requis.
- Aucun test PostgreSQL/RLS multi-compte exécuté ; aucune écriture/DDL/migration sur le projet actif ; aucun projet additionnel créé et aucun coût engagé.
- PR #17 toujours ouverte et non fusionnée ; main et production inchangées.
- Suite : exporter policies Storage intégrales, bucket `prive`, Realtime, audit_log et ACL séquences, puis produire le baseline SQL reproductible.

## Lot 372 — Storage privé et Realtime Messenger (13 novembre 2026)

- Lecture SELECT de l'ensemble des policies `storage.objects` : policies Messenger lecture/upload et policies génériques owner read/upload/delete.
- Bucket `prive` confirmé privé (`public=false`) ; limites globales taille/MIME NULL. La policy Messenger upload impose néanmoins owner courant, membership, taille metadata 1–5 MiB et MIME PNG/JPEG/WEBP/PDF.
- Les policies génériques utilisent le premier segment du chemin égal à auth.uid() ; les chemins Messenger commencent par `msg`. Leur combinaison permissive OR doit être reproduite et testée, pas supposée.
- Publication `supabase_realtime` : `public.msg_conversations` et `public.msg_messages`.
- `audit_log` SECURITY DEFINER insère dans `public.audit_logs`, EXECUTE réservé à postgres/service_role selon ACL observée ; la structure et la sécurité de `audit_logs` restent à extraire.
- Séquences Messenger identifiées : attachments, conversations, log, messages, reports.
- Rapport : `docs/product/LOT-372-STORAGE-REALTIME-MESSENGER.md`, commit `bea7cdc7517dd2b11d67aba914a533a7e6282830`.
- Aucun objet Storage consulté, aucun fichier téléchargé, aucune modification de bucket/policy, aucun test Storage/Realtime exécuté.
- Aucun projet de test créé ni coût engagé ; projet actif intact ; PR #17 ouverte et non fusionnée ; aucun changement main ni déploiement.
- Suite : exporter `audit_logs`, ses policies/ACL, fonctions/triggers de dépendance, puis assembler un baseline SQL synthétique et testable.

## Lot 373 — audit_logs et immutabilité des journaux (13 novembre 2026)

- Extraction SELECT de la table `audit_logs` sans lire aucune ligne réelle : colonnes, PK, index, séquence, RLS, policy de lecture et ACL.
- Policy active : acteur lit ses entrées ; les agents avec `reports.read` lisent les wilayas autorisées.
- `audit_log(...)` SECURITY DEFINER écrit avec `acteur=auth.uid()`, EXECUTE réservé à postgres/service_role.
- Trigger `audit_logs_tr_immuable` appelle `immutable_row()` ; UPDATE/DELETE authentifiés lèvent une exception, le contexte sans auth.uid() retourne OLD selon la fonction active.
- Cette dépendance est requise par `profiles_tr_audit_role` ; omission de la table/fonction/trigger rendrait le baseline incomplet.
- Rapport : `docs/product/LOT-373-AUDIT-LOGS-IMMUTABILITE-MESSENGER.md`, commit `568e99be7e58acc9b510d39f84d03d503d64b8d4`.
- Aucun journal réel lu, aucune écriture ou modification Supabase, aucun test comportemental PostgreSQL exécuté.
- Aucun second projet créé ; aucun coût engagé. PR #17 toujours ouverte et non fusionnée ; main/production intactes.
- Suite : inventorier précisément les rôles, extensions et dépendances Auth nécessaires, puis préparer l'assemblage reproductible du schéma et le jeu de comptes synthétiques.


## Lot 374 — gardes de vérification des profils et triggers Messenger (13 novembre 2026)

- Extraction SELECT des définitions complètes des fonctions et triggers liés aux profils, conversations, membres, messages, pièces jointes, signalements et journaux.
- Découverte confirmée : `profiles_verif_guard()` autorise l'élève à demander le statut `en_attente` sous conditions, mais réserve le passage à `verifie` et les modifications de `matricule`, `section`, `verif_by` à un administrateur ou à un agent `students.verify` habilité sur la wilaya du profil.
- `profiles_scope_guard()` interdit l'auto-modification du périmètre wilaya/niveau/filière et encadre les modifications administratives par rôle et wilaya. Les triggers de rôle et d'audit sont également dépendances nécessaires du baseline.
- Triggers Messenger confirmés : garde de DM à deux membres et compatibilité, rate limit 20 messages/minute et corps de 2 000 caractères, mise à jour d'activité, journalisation, limite pièce jointe 5 MiB et immutabilité des audit_logs.
- Conséquence : `verif_statut='verifie'` est une validation interne de plateforme, pas une preuve institutionnelle d'inscription élève↔lycée. Elle ne suffit pas à autoriser un annuaire national inter-lycées.
- Matrice de tests synthétiques préparée : auto-demande vs auto-validation, modérateur autorisé/hors wilaya, protection du périmètre, audit des changements de rôle, création DM sans invitation, blocage dans les deux sens, pièces jointes et limites de débit.
- Rapport : `docs/product/LOT-374-VERIFICATION-PROFILS-ET-TRIGGERS-MESSENGER.md`, commit `d318c21c8ee69f99b4a2edae2d079fd750d6a278`.
- Aucun profil, message, fichier ou journal réel consulté ; aucune écriture/DDL/migration sur Supabase actif ; aucun changement Auth/RLS/GRANT/Storage/Realtime ; aucun projet de test créé ni frais engagé.
- Aucun test PostgreSQL/RLS multi-compte exécuté : le lot est une extraction et une spécification de tests, pas une validation comportementale.
- PR #17 reste ouverte et non fusionnée ; main/production inchangées.
- Suite recommandée : terminer l'inventaire des rôles/claims/extensions et préparer un export SQL de baseline reproductible, en distinguant clairement les objets Supabase managés (`auth`, `storage`, rôles) des objets applicatifs. La création du second projet Free estimé à 0 USD/mois reste en attente d'une autorisation explicite.


## Lot 375 — rôles PostgreSQL, extensions et claims JWT (13 novembre 2026)

- Extraction SELECT des rôles SQL, memberships, propriétés BYPASSRLS, extensions et définitions auth.uid(), auth.jwt(), auth.role(), ainsi que des fonctions Storage de chemin.
- PostgreSQL actif confirmé en 17.6. Extensions observées : pg_stat_statements 1.11, pgcrypto 1.3, plpgsql 1.0, supabase_vault 0.3.1, uuid-ossp 1.1.
- Rôles clés : anon et authenticated sans BYPASSRLS ; authenticator rôle de connexion ; service_role et postgres avec BYPASSRLS ; supabase_admin superuser. Les tests RLS ordinaires doivent s'exécuter en authenticated/anon, jamais sous postgres ou service_role.
- auth.uid() lit le claim sub depuis request.jwt.claim.sub ou request.jwt.claims ; auth.jwt()/auth.role() lisent également les paramètres de claims. Le harness devra fixer des claims synthétiques cohérents ET le rôle SQL effectif pour chaque cas.
- Rapport : docs/product/LOT-375-ROLES-EXTENSIONS-CLAIMS-JWT-MESSENGER.md, commit a3338ab233ba6270289e57f4df5bac716f2f4b03.
- Aucun secret/JWT réel ou donnée applicative consulté ; aucun test PostgreSQL/RLS exécuté ; aucune écriture/DDL/migration ou modification Auth/RLS/GRANT/Storage/Realtime.
- Aucun projet de test créé ni frais engagé. PR #17 reste ouverte et non fusionnée ; main et production inchangées.
- Suite : identifier les objets managés auth/storage nécessaires et assembler un manifeste de restauration qui sépare le schéma applicatif des composants Supabase non reproductibles par un PostgreSQL générique. La création d'un second projet Free reste en attente d'une autorisation explicite.
