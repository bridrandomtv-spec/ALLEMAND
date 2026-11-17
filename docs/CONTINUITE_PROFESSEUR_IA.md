# Continuité — intelligence du professeur IA

Date : 17 novembre 2026

## Objectif
Livrer uniquement les changements liés au professeur IA : authentification du Worker, disponibilité pour tout compte authentifié, respect des cadenas, compréhension Darija/Arabizi, continuité du transcript et tests associés.

## Périmètre de cette branche
- `.github/workflows/deploy.yml` : exécution des deux suites de tests IA.
- `unite3as1_free.js` : artefact public strictement limité aux deux séances gratuites de l'unité 1 en 3AS.
- `access.js`, `app.js`, `ia.js`, `rag.js` : contrôles d'accès aux ressources pédagogiques dans les chemins locaux et distants.
- `worker/ia-ask.js` : validation du JWT Supabase, contrôle des demandes reconnues comme verrouillées, refus du `ctx` client, récupération des pages via `lesson_content`/JWT RLS et récupération du seul artefact public gratuit 3AS borné.
- `js/qust.js`, `parle.js` : compréhension Darija/Arabizi et conservation du transcript brut/normalisé.
- `tests/worker-ai-auth.test.mjs`, `tests/qust-darja.test.mjs` : tests de sécurité et de compréhension linguistique.

## Règles d'accès à préserver
- Tout utilisateur authentifié peut utiliser le professeur IA distant, même sans abonnement actif.
- Le professeur IA ne doit pas expliquer une leçon, corriger un exercice ou fournir une conjugaison liée à une ressource verrouillée.
- Les ressources explicitement gratuites restent accessibles selon `assets/bdd/access_config.json`, notamment les résumés et la banque générale d'exercices.
- Les utilisateurs abonnés actifs conservent l'accès aux contenus payants.
- Aucun changement Supabase : ni Auth, ni RLS, ni schéma, ni données, ni abonnements, ni migrations.

## Récupération documentaire sécurisée — manuel et séances gratuites
- `rag.js` ne fait plus confiance à `ACCESS.entitlement().ok` côté navigateur pour révéler un corps de page marqué verrouillé dans l'index public. Même si l'état local est falsifié, le corps doit provenir de la lecture `lesson_content` protégée par RLS. La requête locale filtre également `subject='allemand'` afin d'éviter toute collision entre matières.
- Le fichier public `unite3as1_free.js` est désormais extrait de `unites3as_a.js` et ne contient que les séances 1 et 2 de l'unité 1 3AS (sans devoir ni corrigé). `app.js` le charge avant le lot complet protégé : pour un compte gratuit, le Worker refuse toujours `unites3as_a.js` et l'application ne reçoit que l'artefact limité ; pour un abonné, le lot complet peut ensuite remplacer l'aperçu limité. Le test vérifie l'exécution de l'artefact, les séances `[1,2]`, l'absence de devoir/corrigé et l'absence de marqueurs d'unités/séances payantes.
- `worker/ia-ask.js` ne retourne plus immédiatement « accès gratuit » dès qu'une demande mentionne unité 1 / séance 1 ou 2 : les autres contrôles continuent, notamment les conjugaisons explicitement verrouillées. Un test couvre `Conjugaison sein unité 1 séance 1`, tentative de contournement qui était auparavant acceptée par le Worker.
- `ia.js` transmet soit un sélecteur `{type:'book_page', page, level}` pour une page verrouillée du manuel, soit `{type:'free_unit_lesson', level:'3AS', unit:1, lesson:1|2}` pour les deux séances gratuites. Il ne transmet plus les extraits BIBLIO ni la réponse locale dans `ctx`.
- Le Worker valide strictement le type, le niveau et les bornes des ressources. Pour une page du manuel, il applique d'abord le quota puis effectue un GET en lecture seule sur `public.lesson_content`, filtré par `subject=allemand`, `level` et `page`, avec l'anon key et le JWT de l'utilisateur. Pour une séance gratuite 3AS, il ne lit qu'un chemin statique fixe qui ne contient que les deux séances explicitement gratuites. Les tests vérifient que le quota précède toute lecture RLS.
- La décision d'accès au corps de page dépend du RLS existant ; aucune clé service-role n'est utilisée. Si aucun corps n'est renvoyé, le Worker refuse avec `content-locked`. Si la lecture échoue, il échoue fermé avec `access-unavailable`.
- Seul le contenu récupéré côté Worker est marqué `CONTENU PÉDAGOGIQUE AUTORISÉ` et transmis au modèle. Le champ `ctx` libre du navigateur reste ignoré.
- Limite restante : le RAG distant couvre les pages du manuel via `lesson_content` et les deux séances gratuites 3AS via l'artefact statique isolé. Les séances payantes, exercices, devoirs, corrections et autres documents de BIBLIO ne sont pas encore récupérés côté Worker ; ils nécessitent un identifiant stable et une lecture serveur protégée par le Worker/RLS existant.
- Vérification Supabase en lecture seule du projet actif : `public.lesson_content` existe, RLS est activé, 375 lignes recensées : 2AS = 212 (5 marquées `free`), 3AS = 163 (0 marquée `free`) ; colonnes `subject`, `level`, `page`, `titre`, `body`, `free` présentes. La politique SELECT `lc lecture selon entitlement` s'applique à `public` avec `free OR active_entitlement(auth.uid()) OR is_admin()` ; le privilège SELECT existe pour `anon` et `authenticated`. La policy d'écriture admin est distincte. `lesson_content_trad` contient 4 379 lignes et sa policy SELECT réserve la lecture aux traductions liées à une ligne `lesson_content.free`, aux abonnés actifs et aux admins.
- La table `lesson_content` ne contient toujours aucune ligne 3AS `free=true` ; aucune écriture ni politique RLS n'a été ajoutée. L'écart de gratuité 3AS est traité par l'artefact statique public isolé `unite3as1_free.js`, tandis que `unites3as_a.js` reste intégralement protégé. Le Worker IA récupère lui-même l'artefact gratuit depuis l'origine fixe du site ; le navigateur ne fournit pas le contenu.
- Les tests automatisés simulent les réponses REST/RLS ; ils vérifient que le Worker utilise le JWT et que l'absence de ligne bloque, mais ne simulent pas le moteur RLS PostgreSQL lui-même. Aucun test de lecture avec une session utilisateur réelle n'a été effectué. Aucune écriture Supabase, aucun changement de schéma ou de politique n'a été effectué.

## Livraison
Cette branche est créée depuis `main` pour isoler les changements IA de la PR #21, qui contient également des changements Messenger, Multaqa, Masar et Gamification. La PR #21 reste ouverte et en brouillon ; elle ne doit pas être fusionnée dans le cadre de cette livraison IA seule.

## Validation
- Run `44191520195` sur la tête de branche documentée : job autonome IA `success`, Worker JWT/RLS **38/38**, QUST/Darja/Arabizi **9/9**, régression RAG/professeur `success`. Les 9 cas de référence du professeur et le build T1–T6 sont également `success`.
- Le job global `Validation structurelle & pédagogique` échoue sur la validation Messenger hors périmètre IA ; les étapes JWT et Darija du job global sont sautées après cet échec. Le job autonome IA, lui, est vert.
- Les tests PostgreSQL Messenger/Multaqa restent indépendants et leurs éventuels échecs ne sont pas des échecs du code IA.
- Les tests Worker simulent les réponses REST et le fichier statique ; ils ne remplacent pas un test réel avec JWT utilisateur ni une vérification du moteur RLS PostgreSQL.
- Aucun test E2E navigateur sur un déploiement correspondant à cette tête n'a été réalisé. L'origine de production ne contient pas encore le nouveau fichier tant que la branche n'est pas fusionnée/déployée.
- Aucune fusion, aucun déploiement Cloudflare, aucune modification de `main`, aucune écriture Supabase.

### Isolation et RAG distant du contenu gratuit 3AS — validés
- `unite3as1_free.js` est construit uniquement à partir de `U3AS_1.meta` et des séances 1 et 2. Il n'embarque ni séances 3–6, ni devoir, ni corrigé, ni unités 2–3.
- `app.js` charge l'artefact gratuit avant `unites3as_a.js`. Pour un compte gratuit, le Worker du site refuse toujours le lot complet protégé ; l'application ne reçoit que l'artefact limité. Pour un abonné, le lot complet peut ensuite remplacer l'aperçu limité.
- `access.js` mappe les identifiants visibles 3AS `10→19` vers les clés de configuration `1→10`, afin que `ACCESS.canAccessLesson(10,1)` reconnaisse les deux séances gratuites configurées sous la clé `1`.
- `ia.js` transmet un sélecteur borné pour les séances 1–2 de l'unité 1 3AS. Le Worker n'accepte que cette combinaison, récupère lui-même le fichier depuis `https://allemand.brid-randomtv.workers.dev/unite3as1_free.js`, vérifie la taille et les marqueurs attendus, puis le transmet au modèle avec le marqueur `CONTENU PÉDAGOGIQUE AUTORISÉ`.
- Le Worker interprète l'identifiant visible 3AS unité `10` comme unité pédagogique `1` uniquement avec le sélecteur gratuit borné ; l'unité visible `11` reste verrouillée pour un compte sans abonnement.
- Tests : isolation du fichier public, mapping des unités 3AS, récupération serveur du contenu gratuit, refus des sélecteurs falsifiés, refus d'une question sur séance 3 même avec sélecteur gratuit, échec fermé si le fichier est indisponible.
