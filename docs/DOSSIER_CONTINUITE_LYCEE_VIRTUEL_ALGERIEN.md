# Dossier de continuité — Lycée Virtuel Algérien (ALLEMAND)

**Dernière mise à jour : 3 novembre 2026**  
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
