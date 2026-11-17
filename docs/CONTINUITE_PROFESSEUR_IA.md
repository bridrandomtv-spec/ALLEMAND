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
- `ia.js` transmet uniquement un sélecteur `{type:'book_page', page, level}` pour une page dont l'index public indique `locked:true` ; les pages statiques gratuites ne partent pas vers le Worker. Il ne transmet plus les extraits BIBLIO ni la réponse locale dans `ctx`.
- Le Worker valide strictement le type, le niveau et les bornes de page. Il applique d'abord le quota utilisateur, puis effectue un GET en lecture seule sur `public.lesson_content`, filtré par `subject=allemand`, `level` et `page`, avec l'anon key et le JWT de l'utilisateur. Le test vérifie qu'aucune lecture documentaire n'est effectuée après le quota.
- La décision d'accès au corps de page dépend du RLS existant ; aucune clé service-role n'est utilisée. Si aucun corps n'est renvoyé, le Worker refuse avec `content-locked`. Si la lecture échoue, il échoue fermé avec `access-unavailable`.
- Seul le contenu récupéré côté Worker est marqué `CONTENU PÉDAGOGIQUE AUTORISÉ` et transmis au modèle. Le champ `ctx` libre du navigateur reste ignoré.
- Limite restante : ce premier connecteur couvre les pages du manuel (`lesson_content`, colonnes `page`, `level`, `body`, `titre`). Les devoirs, exercices et autres documents de BIBLIO ne sont pas encore récupérés côté Worker ; ils nécessitent chacun un identifiant de ressource stable et une lecture serveur protégée par le RLS déjà en place.
- Vérification Supabase en lecture seule du projet actif : `public.lesson_content` existe, RLS est activé, 375 lignes recensées : 2AS = 212 (5 marquées `free`), 3AS = 163 (0 marquée `free`) ; colonnes `subject`, `level`, `page`, `titre`, `body`, `free` présentes. La politique SELECT `lc lecture selon entitlement` s'applique à `public` avec `free OR active_entitlement(auth.uid()) OR is_admin()` ; le privilège SELECT existe pour `anon` et `authenticated`. La policy d'écriture admin est distincte.
- Les tests automatisés simulent les réponses REST/RLS ; ils vérifient que le Worker utilise le JWT et que l'absence de ligne bloque, mais ne simulent pas le moteur RLS PostgreSQL lui-même. Aucun test de lecture avec une session utilisateur réelle n'a été effectué. Aucune écriture Supabase, aucun changement de schéma ou de politique n'a été effectué.

## Livraison
Cette branche est créée depuis `main` pour isoler les changements IA de la PR #21, qui contient également des changements Messenger, Multaqa, Masar et Gamification. La PR #21 reste ouverte et en brouillon ; elle ne doit pas être fusionnée dans le cadre de cette livraison IA seule.

## Validation
- Après ajout du connecteur `lesson_content`, le job indépendant `Tests autonomes — Professeur IA` a réussi au run `44187832982` : Worker JWT/RLS (30 tests), QUST/Darja/Arabizi et régression RAG/prof/union tous `success`.
- Le job global `Validation structurelle & pédagogique` échoue toujours avant les tests IA sur une erreur de syntaxe préexistante dans `ci/check-msg.mjs:231` (`SyntaxError: missing ) after argument list`). Les étapes IA du job global sont donc sautées, mais le job IA indépendant du même run est vert. Les cas de référence du professeur (9/9) et la suite T1-T6 sont également `success` avant l'étape Messenger.
- Les workflows PostgreSQL hors périmètre Messenger/Multaqa restent séparés ; leurs échecs ne sont pas des échecs du code IA. Le run global n'est pas déclaré vert.
- Aucun test E2E navigateur n'est déclaré réussi ici.
- Aucun déploiement, aucune fusion et aucune écriture Supabase.
