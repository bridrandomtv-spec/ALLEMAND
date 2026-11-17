# Continuité — intelligence du professeur IA

Date : 17 novembre 2026

## Objectif
Livrer uniquement les changements liés au professeur IA : authentification du Worker, disponibilité pour tout compte authentifié, respect des cadenas, compréhension Darija/Arabizi, continuité du transcript et tests associés.

## Périmètre de cette branche
- `.github/workflows/deploy.yml` : exécution des deux suites de tests IA.
- `access.js`, `app.js`, `ia.js`, `rag.js` : contrôles d'accès aux ressources pédagogiques dans les chemins locaux et distants.
- `worker/ia-ask.js` : validation du JWT Supabase, contrôle des demandes reconnues comme verrouillées, refus du `ctx` client et récupération serveur des pages du manuel via `lesson_content` avec le JWT utilisateur.
- `js/qust.js`, `parle.js` : compréhension Darija/Arabizi et conservation du transcript brut/normalisé.
- `tests/worker-ai-auth.test.mjs`, `tests/qust-darja.test.mjs` : tests de sécurité et de compréhension linguistique.

## Règles d'accès à préserver
- Tout utilisateur authentifié peut utiliser le professeur IA distant, même sans abonnement actif.
- Le professeur IA ne doit pas expliquer une leçon, corriger un exercice ou fournir une conjugaison liée à une ressource verrouillée.
- Les ressources explicitement gratuites restent accessibles selon `assets/bdd/access_config.json`, notamment les résumés et la banque générale d'exercices.
- Les utilisateurs abonnés actifs conservent l'accès aux contenus payants.
- Aucun changement Supabase : ni Auth, ni RLS, ni schéma, ni données, ni abonnements, ni migrations.

## Récupération documentaire sécurisée — pages du manuel
- `rag.js` ne fait plus confiance à `ACCESS.entitlement().ok` côté navigateur pour révéler un corps de page marqué verrouillé dans l'index public. Même si l'état local est falsifié, le corps doit provenir de la lecture `lesson_content` protégée par RLS. La requête locale filtre également `subject='allemand'` afin d'éviter toute collision entre matières.
- Le fichier public `unite3as1_free.js` est désormais extrait de `unites3as_a.js` et ne contient que les séances 1 et 2 de l'unité 1 3AS (sans devoir ni corrigé). `app.js` le charge avant le lot complet protégé : pour un compte gratuit, le Worker refuse toujours `unites3as_a.js` et l'application ne reçoit que l'artefact limité ; pour un abonné, le lot complet peut ensuite remplacer l'aperçu limité. Le test vérifie l'exécution de l'artefact, les séances `[1,2]`, l'absence de devoir/corrigé et l'absence de marqueurs d'unités/séances payantes.
- `worker/ia-ask.js` ne retourne plus immédiatement « accès gratuit » dès qu'une demande mentionne unité 1 / séance 1 ou 2 : les autres contrôles continuent, notamment les conjugaisons explicitement verrouillées. Un test couvre `Conjugaison sein unité 1 séance 1`, tentative de contournement qui était auparavant acceptée par le Worker.
- `ia.js` transmet uniquement un sélecteur `{type:'book_page', page, level}` pour une page dont l'index public indique `locked:true` ; les pages statiques gratuites ne partent pas vers le Worker. Il ne transmet plus les extraits BIBLIO ni la réponse locale dans `ctx`.
- Le Worker valide strictement le type, le niveau et les bornes de page. Il applique d'abord le quota utilisateur, puis effectue un GET en lecture seule sur `public.lesson_content`, filtré par `subject=allemand`, `level` et `page`, avec l'anon key et le JWT de l'utilisateur. Le test vérifie qu'aucune lecture documentaire n'est effectuée après le quota.
- La décision d'accès au corps de page dépend du RLS existant ; aucune clé service-role n'est utilisée. Si aucun corps n'est renvoyé, le Worker refuse avec `content-locked`. Si la lecture échoue, il échoue fermé avec `access-unavailable`.
- Seul le contenu récupéré côté Worker est marqué `CONTENU PÉDAGOGIQUE AUTORISÉ` et transmis au modèle. Le champ `ctx` libre du navigateur reste ignoré.
- Limite restante : ce premier connecteur couvre les pages du manuel (`lesson_content`, colonnes `page`, `level`, `body`, `titre`). Les devoirs, exercices et autres documents de BIBLIO ne sont pas encore récupérés côté Worker ; ils nécessitent chacun un identifiant de ressource stable et une lecture serveur protégée par le RLS déjà en place.
- Vérification Supabase en lecture seule du projet actif : `public.lesson_content` existe, RLS est activé, 375 lignes recensées : 2AS = 212 (5 marquées `free`), 3AS = 163 (0 marquée `free`) ; colonnes `subject`, `level`, `page`, `titre`, `body`, `free` présentes. La politique SELECT `lc lecture selon entitlement` s'applique à `public` avec `free OR active_entitlement(auth.uid()) OR is_admin()` ; le privilège SELECT existe pour `anon` et `authenticated`. La policy d'écriture admin est distincte. `lesson_content_trad` contient 4 379 lignes et sa policy SELECT réserve la lecture aux traductions liées à une ligne `lesson_content.free`, aux abonnés actifs et aux admins.
- Écart identifié sans modification : `access_config.json` déclare 3AS unité 1 séances 1–2 gratuites, mais `src/site-worker.js` protège le fichier global `unites3as_a.js` par la présence d'une ligne payante RLS (`free=false`) ; la table active ne compte aucune ligne 3AS `free=true`. Le fichier contient plusieurs unités, donc il ne faut pas simplement retirer sa protection. Il faudra isoler les deux séances gratuites dans un artefact public distinct avant de pouvoir les servir au professeur IA distant aux comptes gratuits.
- Les tests automatisés simulent les réponses REST/RLS ; ils vérifient que le Worker utilise le JWT et que l'absence de ligne bloque, mais ne simulent pas le moteur RLS PostgreSQL lui-même. Aucun test de lecture avec une session utilisateur réelle n'a été effectué. Aucune écriture Supabase, aucun changement de schéma ou de politique n'a été effectué.

## Livraison
Cette branche est créée depuis `main` pour isoler les changements IA de la PR #21, qui contient également des changements Messenger, Multaqa, Masar et Gamification. La PR #21 reste ouverte et en brouillon ; elle ne doit pas être fusionnée dans le cadre de cette livraison IA seule.

## Validation
- Après ajout du connecteur `lesson_content`, le job indépendant `Tests autonomes — Professeur IA` a réussi au run `44187832982` : Worker JWT/RLS (38 tests ; alias unité 10 et refus unité 11 en attente CI), QUST/Darja/Arabizi et régression RAG/prof/union tous `success`.
- Le job global `Validation structurelle & pédagogique` échoue toujours avant les tests IA sur une erreur de syntaxe préexistante dans `ci/check-msg.mjs:231` (`SyntaxError: missing ) after argument list`). Les étapes IA du job global sont donc sautées, mais le job IA indépendant du même run est vert. Les cas de référence du professeur (9/9) et la suite T1-T6 sont également `success` avant l'étape Messenger.
- Les workflows PostgreSQL hors périmètre Messenger/Multaqa restent séparés ; leurs échecs ne sont pas des échecs du code IA. Le run global n'est pas déclaré vert.
- Run `44189436952` : job autonome IA `success` ; Worker JWT/RLS 31/31, QUST/Darja/Arabizi 9/9 et régression RAG/prof/union `success`. Le job global échoue sur la validation Messenger hors périmètre, après succès des 9 cas de référence du professeur et de la suite T1-T6.
- Aucun test E2E navigateur n'est déclaré réussi ici.
- Aucun déploiement, aucune fusion et aucune écriture Supabase.


### Isolation et RAG distant du contenu gratuit 3AS — 37/37 validés, dernier cas alias 10/11 en attente CI
- Nouveau fichier `unite3as1_free.js` généré uniquement à partir de `U3AS_1.meta` et des séances 1 et 2. Il n'embarque ni séances 3–6, ni devoir, ni corrigé, ni unités 2–3.
- Le chargeur `CONTENT1` le récupère avant `unites3as_a.js`. Le Worker du site continue de protéger le lot complet avec le contrôle RLS existant ; aucune règle d'accès Supabase n'a été modifiée.
- `access.js` mappe désormais les identifiants visibles 3AS `10→19` vers les clés de configuration `1→10`. Sans cette correspondance, `ACCESS.canAccessLesson(10,1)` n'appliquait pas les deux séances gratuites configurées sous la clé `1`.
- `ia.js` transmet un sélecteur `free_unit_lesson` uniquement pour 3AS unité 1 séances 1–2 (niveau actif + unité active ou référence explicite). Le Worker IA n'accepte que cette combinaison exacte, récupère lui-même `unite3as1_free.js` depuis l'origine fixe du site, vérifie la taille et les marqueurs attendus, puis transmet le contenu au modèle. Le client ne transmet aucun extrait libre ; le champ `ctx` reste ignoré.
- Tests ajoutés : récupération serveur du contenu gratuit, refus d'un sélecteur falsifié hors unité/séances gratuites, refus d'une question sur séance 3 même avec sélecteur falsifié, et échec fermé si l'artefact est indisponible.
- Test ajouté dans `tests/worker-ai-auth.test.mjs` pour exécuter le fichier et vérifier strictement le contenu exposé.
