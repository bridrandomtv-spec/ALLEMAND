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
- `ia.js` transmet un sélecteur `{type:'book_page', page, level}` pour toute page indexée du manuel (gratuite ou payante ; le navigateur ne décide pas du droit d'accès), soit `{type:'free_unit_lesson', level:'3AS', unit:1, lesson:1|2}` pour les deux séances gratuites, soit `{type:'unit_lesson', level:'3AS', unit:1..3, lesson:1..6}` pour les séances 3AS protégées, soit `{type:'free_summary', level, unit}` pour les résumés gratuits 2AS/3AS, soit `{type:'free_exercise_bank', level}` pour la banque générale libre. Il ne transmet plus les extraits BIBLIO ni la réponse locale dans `ctx`.
- Le Worker valide strictement le type, le niveau et les bornes des ressources. Pour une page du manuel, il applique d'abord le quota puis effectue un GET en lecture seule sur `public.lesson_content`, filtré par `subject=allemand`, `level` et `page`, avec l'anon key et le JWT de l'utilisateur. Pour une séance gratuite 3AS, il ne lit qu'un chemin statique fixe qui ne contient que les deux séances explicitement gratuites. Pour un résumé, il lit `malakhiss.json` et sélectionne uniquement l'entrée `niveau/unite` demandée, en tenant compte du décalage des unités 3AS (`unité pédagogique + 6`). Les tests vérifient que le quota précède toute lecture RLS.
- La décision d'accès au corps de page dépend du RLS existant ; aucune clé service-role n'est utilisée. Si aucun corps n'est renvoyé, le Worker refuse avec `content-locked`. Si la lecture échoue, il échoue fermé avec `access-unavailable`.
- Seul le contenu récupéré côté Worker est marqué `CONTENU PÉDAGOGIQUE AUTORISÉ` et transmis au modèle. Le champ `ctx` libre du navigateur reste ignoré.
- Limite restante : le RAG distant couvre les pages du manuel via `lesson_content`, les deux séances gratuites 3AS via l'artefact statique isolé et les résumés gratuits 2AS/3AS via `malakhiss.json`. Les séances payantes, exercices, devoirs, corrections et autres documents de BIBLIO ne sont pas encore récupérés côté Worker ; ils nécessitent un identifiant stable et une lecture serveur protégée par le Worker/RLS existant.
- Vérification Supabase en lecture seule du projet actif : `public.lesson_content` existe, RLS est activé, 375 lignes recensées : 2AS = 212 (5 marquées `free`), 3AS = 163 (0 marquée `free`) ; colonnes `subject`, `level`, `page`, `titre`, `body`, `free` présentes. La politique SELECT `lc lecture selon entitlement` s'applique à `public` avec `free OR active_entitlement(auth.uid()) OR is_admin()` ; le privilège SELECT existe pour `anon` et `authenticated`. La policy d'écriture admin est distincte. `lesson_content_trad` contient 4 379 lignes et sa policy SELECT réserve la lecture aux traductions liées à une ligne `lesson_content.free`, aux abonnés actifs et aux admins.
- La table `lesson_content` ne contient toujours aucune ligne 3AS `free=true` ; aucune écriture ni politique RLS n'a été ajoutée. L'écart de gratuité 3AS est traité par l'artefact statique public isolé `unite3as1_free.js`, tandis que `unites3as_a.js` reste intégralement protégé. Le Worker IA récupère lui-même l'artefact gratuit depuis l'origine fixe du site ; le navigateur ne fournit pas le contenu.
- Les tests automatisés simulent les réponses REST/RLS ; ils vérifient que le Worker utilise le JWT et que l'absence de ligne bloque, mais ne simulent pas le moteur RLS PostgreSQL lui-même. Aucun test de lecture avec une session utilisateur réelle n'a été effectué. Aucune écriture Supabase, aucun changement de schéma ou de politique n'a été effectué.

## Livraison
Cette branche est créée depuis `main` pour isoler les changements IA de la PR #21, qui contient également des changements Messenger, Multaqa, Masar et Gamification. La PR #21 reste ouverte et en brouillon ; elle ne doit pas être fusionnée dans le cadre de cette livraison IA seule.

## Validation
- Run `44194453497` sur la tête de branche documentée : job autonome IA `success`, Worker JWT/RLS **53/53**, QUST/Darja/Arabizi **9/9**, régression RAG/professeur `success`. Les 9 cas de référence du professeur et le build T1–T6 sont également `success`.
- Le job global `Validation structurelle & pédagogique` échoue sur la validation Messenger hors périmètre IA ; les étapes JWT et Darija du job global sont sautées après cet échec. Le job autonome IA, lui, est vert.
- Les tests PostgreSQL Messenger/Multaqa restent indépendants et leurs éventuels échecs ne sont pas des échecs du code IA.
- Les tests Worker simulent les réponses REST et le fichier statique ; ils ne remplacent pas un test réel avec JWT utilisateur ni une vérification du moteur RLS PostgreSQL.
- Aucun test E2E navigateur sur un déploiement correspondant à cette tête n'a été réalisé. L'origine de production ne contient pas encore le nouveau fichier tant que la branche n'est pas fusionnée/déployée.
- Aucune fusion, aucun déploiement Cloudflare, aucune modification de `main`, aucune écriture Supabase.

### RAG distant des ressources gratuites, séances 2AS/3AS et pages RLS — 53/53 validés
- `unite3as1_free.js` est construit uniquement à partir de `U3AS_1.meta` et des séances 1 et 2. Il n'embarque ni séances 3–6, ni devoir, ni corrigé, ni unités 2–3.
- `app.js` charge l'artefact gratuit avant `unites3as_a.js`. Pour un compte gratuit, le Worker du site refuse toujours le lot complet protégé ; l'application ne reçoit que l'artefact limité. Pour un abonné, le lot complet peut ensuite remplacer l'aperçu limité.
- `access.js` mappe les identifiants visibles 3AS `10→19` vers les clés de configuration `1→10`, afin que `ACCESS.canAccessLesson(10,1)` reconnaisse les deux séances gratuites configurées sous la clé `1`.
- `ia.js` transmet un sélecteur borné pour les séances 1–2 de l'unité 1 3AS. Le Worker n'accepte que cette combinaison, récupère lui-même le fichier depuis `https://allemand.brid-randomtv.workers.dev/unite3as1_free.js`, vérifie la taille et les marqueurs attendus, puis le transmet au modèle avec le marqueur `CONTENU PÉDAGOGIQUE AUTORISÉ`.
- Le Worker interprète l'identifiant visible 3AS unité `10` comme unité pédagogique `1` uniquement avec le sélecteur gratuit borné ; l'unité visible `11` reste verrouillée pour un compte sans abonnement.
- Tests : isolation du fichier public, mapping des unités 3AS, récupération serveur du contenu gratuit, refus des sélecteurs falsifiés, refus d'une question sur séance 3 même avec sélecteur gratuit, échec fermé si le fichier est indisponible.

- `fetchFreeSummary` filtre côté Worker l'entrée de résumé par niveau et unité ; les tests prouvent que 3AS unité 1 utilise bien `m07` (unité 7 du fichier de résumé), sans mélanger le résumé 2AS unité 7 ni 3AS unité 2.

- La banque générale `B_exercices` de `assets/bdd/contenu_original.json` est désormais récupérée côté Worker, filtrée sur le niveau 2AS/3AS et explicitement marquée comme ressource gratuite. Le Worker ajoute aussi les mots-clés d'exercice aux contrôles d'accès : une demande rattachée à une unité payante reste refusée, même si le navigateur envoie le sélecteur de banque libre ; les demandes générales sans unité restent accessibles.

- Pour les séances payantes 3AS des unités 1–10, le Worker IA transmet le JWT à `https://allemand.brid-randomtv.workers.dev/unites3as_a.js`, chemin déjà protégé par le Worker du site et le RLS existant. Il n'envoie au modèle que la séance demandée, extraite par un scanner de délimiteurs qui ignore chaînes et commentaires ; le fichier complet et les autres séances ne sont pas transmis. Le sélecteur exclut explicitement les deux séances gratuites de l'unité 1, qui passent par l'artefact public séparé.
- Tests : compte abonné actif → séance 3 extraite ; compte gratuit → refus avant lecture ; sélecteur sans contexte explicite → refus RLS du Worker du site ; extraction réelle de la séance 3 depuis `unites3as_a.js` sans inclure les séances 4–6.

- `pageResource` ne filtre plus les pages selon le marqueur `locked` du navigateur : toute page présente dans l'index peut être demandée au Worker. Le Worker relit le corps avec le JWT utilisateur ; le RLS renvoie les pages gratuites et refuse les pages payantes aux comptes sans abonnement. Les pages du manuel 2AS et 3AS utilisent donc le même chemin sécurisé.

- Les séances 2AS sont maintenant résolues à partir des tableaux `SEANCES_U1` à `SEANCES_U9` déjà présents dans le client : le sélecteur envoie la ou les pages du manuel associées à la séance (`book_page`/`book_pages`). Le Worker récupère chaque page avec le JWT et RLS ; les deux premières séances de l'unité 1 correspondent aux pages gratuites 5–6 et 7–10–25, tandis que les autres pages restent payantes selon RLS. Le test confirme la récupération multi-pages 5 et 6.


### Durcissement des demandes de conjugaison génériques — 18/11/2026
- Le contrôle Worker ne dépend plus uniquement de la liste historique de neuf verbes : toute demande explicite de conjugaison sans sélecteur de leçon vérifiable (`book_page`, `book_pages`, `free_unit_lesson`, `unit_lesson`) est maintenant soumise au contrôle d'abonnement.
- La banque générale d'exercices reste utilisable gratuitement pour une demande explicitement formulée comme exercice ; un simple sélecteur de banque ne permet pas de demander une conjugaison libre hors de ce contexte.
- Les demandes utilisant l'artefact gratuit 3AS doivent aussi préciser l'unité et la séance dans la question ; les verbes/règles déjà identifiés comme verrouillés restent refusés même si une séance gratuite est mentionnée.
- Régression ajoutée pour « Konjugiere arbeiten », « Conjugate bleiben in the present tense » et « كيفاش نصرف arbeiten؟ » : un compte sans abonnement reçoit `content-locked` et aucun message n'est envoyé au modèle.
- Ce durcissement ne modifie ni les ressources libres déclarées, ni Supabase, ni les droits RLS. Validation CI à effectuer sur le nouveau commit.


### Correction du test Worker — fixture de séance gratuite 3AS — 18/11/2026
- Analyse du run CI `44199281414` : le job autonome IA échouait à 55/56 tests, au test `refuse côté Worker une séance verrouillée et laisse passer les deux séances gratuites` (ligne 414). Le Worker répondait `503` au lieu de `200` pour une séance gratuite.
- Cause démontrée : la fixture simulée par `tests/worker-ai-auth.test.mjs` ne contenait pas le marqueur `duree_totale:120`, alors que `fetchFreeUnitLesson` vérifie explicitement ce marqueur dans l'artefact public réel `unite3as1_free.js`. Le fichier réel contient bien ce marqueur dans `meta`.
- Correction limitée au test : la fixture simulée inclut maintenant `meta.duree_totale:120`. Aucun changement du Worker, des règles d'accès, de Supabase, de `main` ou du déploiement.
- À revalider sur le nouveau commit : les 56 tests Worker, puis QUST/Darja/Arabizi et les régressions RAG/professeur. Le correctif est une correction de fixture, pas une modification de sécurité en production.


### Lot 610 — extension ciblée du verrou grammatical et test des sélecteurs falsifiés — 18/11/2026
- L'audit du catalogue `assets/bdd/grammaire.json` (86 fiches déclarées, niveaux 2AS/3AS/BAC) a montré que la liste `LOCKED_RULES` du Worker ne couvrait qu'un petit sous-ensemble des notions avancées du programme. Exemples absents : Genitiv, Partizip, Infinitiv, Nominalisierung/Verbalisierung, Nomen-Verb-Verbindungen, Zweiteilige Konnektoren, Konzessivsätze, Relativsätze, Imperativ, Reflexive Verben, Adjektivdeklination, Komposita et Wechselpräpositionen.
- Extension de la liste avec les notions de grammaire/structure relevées dans les ressources 2AS/3AS, plus les formulations arabes explicites. Le contrôle reste conditionné à une intention d'explication grammaticale ; les questions générales non pédagogiques restent sur le chemin d'accès IA authentifié.
- Ajout d'un test Worker de régression utilisant trois sélecteurs gratuits falsifiés (`free_summary`, `free_exercise_bank`, `free_unit_lesson`) avec des demandes sur Genitiv, Nomen-Verb-Verbindungen et التحويل الاسمي. Attendu : HTTP 403, aucun document gratuit lu et aucun message transmis au modèle.
- Limite de preuve : le catalogue `grammaire.json` ne porte pas de métadonnée de verrouillage par fiche et `grammaire.js` le charge sans contrôle d'accès visible. La liste élargie est donc une défense du Worker fondée sur les notions du programme, pas une preuve que chacune des 86 fiches est payante. Les règles de gratuité déclarées et le RLS existant ne sont pas modifiés.
- Tests non encore exécutés sur le nouveau HEAD : le précédent run avait révélé un défaut de fixture corrigé au Lot 609 ; le run automatique ne s'est pas déclenché après les commits API. Ne pas déclarer les nouveaux tests réussis avant une exécution réelle.
- Aucun changement Supabase, `main`, PR fusionnée ou déploiement.


### Complément de vérification des sélecteurs — 18/11/2026
- Le test anti-contournement couvre maintenant les six types de sélecteurs acceptés : `free_summary`, `free_exercise_bank`, `free_unit_lesson`, `book_page`, `book_pages` et `unit_lesson`.
- Pour une demande de règle verrouillée (`Genitiv`), chaque sélecteur doit être rejeté en HTTP 403 avant toute lecture documentaire et avant tout appel au modèle. Le but est de vérifier que le type de ressource déclaré par le navigateur ne peut pas neutraliser la classification de la question.
- Le run #4313 a validé 57/57 tests Worker, 9/9 tests QUST/Darja/Arabizi et les trois suites de régression. Le job autonome IA est `success`. Le job global reste `failure` sur `ci/check-msg.mjs` / messagerie EduDZ, hors périmètre IA.
- Le test élargi à six sélecteurs vient d'être ajouté et doit être validé par le prochain run CI ; aucun résultat n'est anticipé.


### Résultats confirmés — CI #4314 — 18/11/2026
- Run `44204308402` : job autonome « Tests autonomes — Professeur IA » terminé `success`.
- `tests/worker-ai-auth.test.mjs` : **57/57 PASS**, dont le test de règles grammaticales verrouillées avec les six sélecteurs `free_summary`, `free_exercise_bank`, `free_unit_lesson`, `book_page`, `book_pages` et `unit_lesson`. Aucun document n'est lu et aucun appel modèle n'est fait pour les demandes refusées.
- `tests/qust-darja.test.mjs` : **9/9 PASS**.
- Régressions : RAG **12/12**, PROF **18/18**, union combinée exécutée avec succès.
- Le job global « Validation structurelle & pédagogique » reste `failure` sur `ci/check-msg.mjs:231` : `SyntaxError: missing ) after argument list`. Les étapes IA globales sont sautées après cette erreur, mais le job IA autonome a exécuté ses propres tests et est vert. Ce défaut Messenger est hors périmètre de cette PR IA ; aucune modification Messenger n'a été faite.
- Les tests automatisés restent des simulations REST/RLS : pas de session Supabase utilisateur réelle ni de test E2E navigateur sur un déploiement correspondant à cette branche.
- Le test de six sélecteurs a été exécuté sur le commit de test `7aa6eb2c6b315efdc82d4a51562f17948142eb90`. Les commits suivants ne changent que les deux documents de continuité ; le code testé est identique au code actuel de la branche.


### Lot 611 — audit de la correspondance grammaire / droits d'accès — 18/11/2026
- Vérification du catalogue réel `assets/bdd/grammaire.json` : 86 fiches, réparties en 2AS T1 (16), 2AS T2 (15), 2AS T3 (14), 3AS T1/BAC (18) et BAC (23). Les fiches ont des identifiants (`GR-...`) et des champs niveau/trimestre, mais aucun champ `free`, `locked`, `unit`, `lesson` ou droit d'accès par fiche.
- Vérification de `grammaire.js` : le navigateur télécharge directement `assets/bdd/grammaire.json` par `fetch()` puis affiche les fiches. Aucun appel à `ACCESS.canAccessView`, `ACCESS.canAccessLesson`, ni contrôle d'entitlement n'apparaît dans le chargeur ou le rendu de la bibliothèque grammaticale.
- Vérification de `app.js` et `assets/bdd/access_config.json` : la vue `grammaire` est une vue normale ; `paid_views` contient seulement `corpus` et `biblio`. Les fonctions d'accès des leçons sont appliquées aux séances, mais aucun verrou de vue ou de fiche grammaticale n'est déclaré.
- Conclusion démontrée par le code : les 86 fiches de la bibliothèque grammaticale sont actuellement servies comme ressources publiques de la plateforme. Il n'existe pas de correspondance fiable entre ces fiches et des séances verrouillées. Les titres « Akkusativ », « Perfekt », « Genitiv », « Relativsätze », etc. ne peuvent donc pas, à eux seuls, être qualifiés de contenus payants.
- Risque fonctionnel identifié : `LOCKED_RULES` dans `worker/ia-ask.js` bloque plusieurs demandes générales de règles par mot-clé pour les comptes sans abonnement, y compris des notions présentes dans le catalogue grammatical public. Cela peut faire refuser au professeur IA une explication que l'élève peut pourtant consulter dans la vue « القواعد ». Ce n'est pas un contournement de contenu protégé prouvé ; c'est une incohérence de classification/droits.
- Aucun changement de `LOCKED_RULES` n'a été appliqué : supprimer ou conserver ces blocages sans une décision explicite sur la gratuité de la bibliothèque créerait soit un faux refus, soit un risque d'accès indu. Aucun fichier Supabase, schéma, RLS, Auth, abonnement, `main`, Worker déployé ou production n'a été modifié.
- Décision technique nécessaire pour la suite : soit confirmer que les 86 fiches de grammaire sont gratuites et aligner le professeur IA sur cette règle ; soit définir explicitement les fiches payantes par identifiant, puis les servir via un chemin protégé existant (JWT/RLS) au lieu de les laisser dans le JSON public. Une simple liste de mots-clés dans le Worker ne peut pas remplacer cette matrice de droits.
- Prochaine tâche proposée : Lot 612 — construire la matrice de droits à partir des identifiants de fiches et des ressources réellement protégées, sans écrire dans Supabase ; ensuite corriger uniquement les faux refus démontrés et ajouter des tests positifs/négatifs.


## Lot 612 — protection des archives d'exercices et première récupération RAG distante — 18 novembre 2026

### 1. Protection des fichiers sources
- Constat confirmé : `src/site-worker.js` protégeait le script `/devoirs_unite.js`, mais pas les fichiers JSON que ce script charge : `assets/bdd/compositions.json` (171 documents) et `assets/bdd/annales.json` (126 documents). `access_config.json` déclare `free.devoirs=[]`. Un accès direct aux URL JSON contournait donc la protection du script.
- Ajout de `/assets/bdd/(devoirs|compositions|annales).json` à la liste `PROT` du Worker du site. L'accès nécessite désormais un JWT et une ligne `lesson_content free=false` visible par ce JWT via le RLS existant. Le Worker reste fail-closed si la configuration Supabase manque ou si la vérification RLS échoue.
- `devoirs_unite.js` transmet maintenant `CONTENT1.authHeaders()` lors du chargement des trois archives. `devoirnote.js` transmet aussi le JWT pour `devoirs.json` (actuellement vide). Les contenus publics `malakhiss.json` et `contenu_original.json` restent chargés sans exigence d'abonnement.
- Nouveau test `tests/site-worker-content-guard.test.mjs` : refus sans JWT sur les trois chemins, refus sans ligne RLS, autorisation simulée d'un abonné, échec fermé si configuration absente, maintien de l'accès public à `grammaire.json` et vérification des en-têtes des chargeurs. Le workflow ajoute cette suite au job autonome IA.

### 2. Première extension du RAG distant aux documents officiels
- Ajout d'un sélecteur strict `official_document` limité aux collections `compositions` et `annales` et à un identifiant exact (`CP-YYYY-T-NNNN` ou `AN-YYYY-T-NNNN`). Aucun chemin de fichier, URL ou champ libre n'est accepté depuis le navigateur.
- `ia.js` reconnaît ces identifiants exacts et les transmet au Worker IA. Le Worker IA relit le JSON côté serveur avec le même JWT via le Worker du site ; le RLS du site décide de l'accès. Un refus 401/403 devient `content-locked` avant tout appel au modèle. Le Worker ne renvoie au modèle que le document identifié et un ensemble limité de champs (`sujet`, `corrige`, métadonnées, parties).
- Tests ajoutés : résolution des identifiants CP/AN côté client, récupération exacte avec JWT, refus si le Worker du site signale un verrou, rejet d'un sélecteur falsifié. Les documents ne sont pas choisis par un numéro d'unité tant que les métadonnées ne sont pas corrigées.

### 3. Anomalies de rattachement des archives — blocage du filtrage par unité
- Audit des 171 compositions : 51 entrées déclarées `niveau=2AS` portent `unite` entre 10 et 18, hors plage 2AS (1–9). Plusieurs ont en plus `unite_de='Sich vorstellen'` alors que leur titre concerne Umwelt, Kultur, Wissenschaft, Arbeit ou Medien.
- Audit des 126 annales : 76 entrées déclarées `niveau=2AS` portent `unite` entre 10 et 18. Les titres et `unite_de` sont parfois contradictoires (ex. thème Umwelt avec `unite_de='Sich vorstellen'`).
- Total : 127/297 documents présentent un rattachement niveau/unité incohérent. Il serait dangereux de sélectionner un exercice « unité 15 » sur la seule base de ces champs. Le RAG distant ne prend donc pour l'instant que l'identifiant exact comme clé ; aucune correction automatique de niveau/unité n'est appliquée.

### 4. État de validation et limites
- Les modifications sont enregistrées sur `ai/intelligence-only-lots-601-608`. Le test CI de ces nouveaux changements n'a pas encore été observé ; aucun résultat de réussite n'est revendiqué pour les tests du Lot 612.
- La CI #4314 antérieure reste la preuve des 57/57 tests Worker, 9/9 QUST, 12/12 RAG et 18/18 PROF sur le code antérieur à ces nouveaux ajouts.
- Aucun changement Supabase (SQL, RLS, Auth, abonnement ou données), aucune modification de `main`, aucun merge et aucun déploiement Cloudflare.
- Audit distinct à poursuivre avant toute extension supplémentaire : `examen.js` charge `bac_archive.json` et `bac.json` sans en-tête visible ; `officiels.js` charge `devoirs_officiels.json` sans en-tête visible. Le statut payant/gratuit de ces deux parcours doit être confronté à `access_config.json` et aux fonctions d'accès avant d'ajouter des protections, pour éviter de casser un contenu réellement gratuit.

### 5. Prochaine étape
- Lot 613 : établir une table de correspondance fiable pour les 127 documents mal classés (titre, sujet, tags, niveau, unité), corriger les données seulement après vérification de chaque groupe ; ensuite permettre une recherche distante par thème/unité sans utiliser des métadonnées erronées. En parallèle, auditer les droits des archives BAC et `devoirs_officiels.json` avant toute modification.


## Lot 613 — audit des droits des archives BAC et des devoirs officiels — 18 novembre 2026
- `access_config.json` déclare explicitement `paid_views=['corpus','biblio']` et sa note précise que ce sont les seules vues entières paywallisées par configuration. `ACCESS.canAccessView()` retourne donc `true` pour `examen` et `officiels` dans la configuration actuelle.
- En parallèle, `ACCESS.canAccessBac()` retourne `entActive()` mais n'est appelé ni dans `examen.js` ni dans le routeur `app.js` observé. `ACCESS.canAccessDevoir(id)` existe et `free.devoirs=[]`, mais `officiels.js` ne l'appelle pas.
- `examen.js` charge directement `assets/bdd/bac_archive.json` (68 sujets) et `assets/bdd/bac.json` (79 sujets complémentaires), sans `Authorization` visible. `officiels.js` charge directement `assets/bdd/devoirs_officiels.json` (55 devoirs), sans `Authorization` visible.
- Le code présente donc une contradiction de politique : les helpers d'accès suggèrent un contrôle payant BAC/devoirs, mais `paid_views` et les routes actuelles laissent ces vues accessibles. Les métadonnées de `bac_archive.json` décrivent la confidentialité des résultats locaux, pas le statut payant des sujets. Les données seules ne permettent pas de trancher.
- Aucune protection supplémentaire n'a été ajoutée à ces trois fichiers et aucune vue n'a été modifiée : il faut confirmer la règle produit avant de bloquer ces archives, afin de ne pas transformer par erreur des ressources publiques en contenus payants.
- Aucun changement Supabase, `main`, merge ou déploiement.
- Point de décision requis avant Lot 614 : préciser si les vues `examen` (68+79 sujets BAC) et `officiels` (55 devoirs) sont gratuites pour tous les utilisateurs connectés ou réservées aux abonnés actifs. Dès cette règle fixée, l'implémentation sera cohérente dans `access_config.json`, les chargeurs et le Worker du site.

## Lot 614 — audit de l’ingestion PDF et de son raccordement au professeur IA — 18 novembre 2026

### Constat vérifié sur la tête de branche
- assets/bdd/corpus.json référence 239 documents, dont 225 PDF. Les PDF sont référencés principalement dans docs/archive/documents ; corpus.js les ouvre dans PDF.js pour la lecture visuelle. Cette ouverture n’extrait pas leur texte pour le professeur IA.
- La bibliothèque et le RAG local ne constituent pas le RAG distant : rag.js charge corpus.json pour afficher/rechercher des métadonnées, tandis que ia.js ne construit aucun sélecteur corpus_document ou PDF. worker/ia-ask.js ne récupère donc pas les PDF ni leurs chunks avant l’appel au modèle.
- assets/bdd/shards_manifest.json annonce nb_shards=0 et total_chunks=0. Le assets/bdd/corpus_index.json actuel contient _meta et items de vocabulaire, pas les clés termes/chunks attendues par le moteur RAG. Le générateur tools/ingest_corpus.py écrirait dans ce même fichier et risquerait donc d’écraser l’index de vocabulaire.
- Audit qualitatif des extraits PDF déjà enregistrés : 16 extraits contiennent de nombreux caractères de contrôle ; 11 contiennent des séquences de glyphes de type /g39/g72/... (ces groupes peuvent se chevaucher). Exemples : comparatif.pdf, prep.genetif.pdf, substantifs heit.pdf, superlatif.pdf. D’autres PDF ont déjà un extrait texte lisible : le problème n’est donc pas une absence totale de conversion, mais une conversion incomplète et non validée.
- tools/ingest_corpus.py annonce un OCR Tesseract pour les scans, mais texte_pdf() appelle uniquement pypdf.PdfReader(...).pages[].extract_text() ; aucun appel Tesseract, rendu de page ou OCR n’existe. Le script ajoute aussi une fiche même si le texte extrait est vide ou illisible.
- Le script écrit corpus_index.json au format termes/chunks, alors que le fichier actuel est un index de vocabulaire items : collision de responsabilités à corriger avant toute nouvelle ingestion.

### Décision technique pour l’intégration
- Ne pas injecter le PDF brut dans le prompt et ne pas faire confiance à un extrait envoyé par le navigateur.
- Créer un artefact documentaire distinct du vocabulaire, avec des chunks traçables (document_id, numéro de page, texte, empreinte/source et métadonnées de licence), puis un index RAG dédié. Ne pas remplacer corpus_index.json tant que ses consommateurs vocabulaire ne sont pas migrés.
- Le client doit envoyer uniquement un identifiant documentaire stable ; le Worker IA doit retrouver lui-même les chunks autorisés côté serveur, appliquer les règles d’accès de la vue Corpus (actuellement déclarée payante), borner le nombre de chunks et leur taille, puis seulement les joindre au prompt. Pas de chemin, URL, texte ou licence fourni par le navigateur.
- Corriger l’ingestion : extraction PDF texte, détection de qualité (texte vide, caractères de contrôle, encodage glyphes), OCR réel uniquement si l’outil est installé et autorisé, sinon marquer le document needs_ocr et ne pas l’indexer. Ajouter des tests avec PDF texte, PDF image/scanné, PDF mal encodé et PDF vide.
- Vérifier la licence et la provenance avant indexation. Les fiches existantes portent des valeurs comme document utilisateur ; elles ne constituent pas à elles seules une autorisation de republier ou d’indexer un ouvrage tiers. Les contenus éditeur/commerciaux ou sans droit clair restent exclus.

### Validation et périmètre
- Aucun PDF binaire n’a été téléchargé ni converti durant cet audit ; les chiffres de qualité portent sur les extraits déjà présents dans corpus.json, pas sur une nouvelle extraction des fichiers source.
- Aucune modification Supabase, RLS, Auth, abonnement, main ou déploiement Cloudflare.
- La PR #22 reste ouverte, en brouillon et non fusionnée.
- CI observée sur le commit 1fc6ebda76dbcab4976e3e607aea0a57738c1819 : le job autonome IA échoue à 60/61 sur l’assertion d’URL du test du document officiel ; le job global échoue aussi sur une erreur de syntaxe de ci/check-msg.mjs:231 (hors périmètre IA). Une correction limitée à l’assertion du test IA a été poussée ; elle doit être revalidée par une nouvelle CI.

### Prochaine étape
- Lot 615 : construire et tester le pipeline d’ingestion PDF sans collision avec l’index vocabulaire, puis connecter un sélecteur documentaire strict au RAG serveur avec contrôle d’accès Corpus. Commencer par les PDF de production propre/droits confirmés ; ne pas indexer automatiquement l’ensemble des 225 PDF.

## Lot 615 — pipeline d’ingestion PDF dédié au RAG — 18 novembre 2026

### Implémentation sur la branche de la PR #22
- Ajout de tools/ingest_corpus_rag.py, séparé de l’ancien tools/ingest_corpus.py.
- L’outil ne modifie jamais corpus.json ni corpus_index.json : il écrit dans assets/bdd/corpus_rag_chunks.json et assets/bdd/corpus_rag_manifest.json, avec statut staged_not_connected.
- Extraction page par page via pypdf ; contrôle de qualité (texte trop court, caractères de contrôle, glyphes /gNN/) ; chunking avec conservation du numéro de page et d’un identifiant stable.
- OCR réel optionnel via Tesseract + pdf2image + Poppler + pytesseract (langues par défaut deu+fra+ara). Si OCR indisponible, les pages déjà extraites et lisibles sont conservées ; les pages illisibles ne sont pas indexées. Un PDF sans aucune page exploitable est rejeté.
- Sécurité de provenance : aucun PDF n’est indexé sans fichier compagnon _NOM.json contenant droits_confirmes=true et une licence dans l’allowlist (production_propre, domaine_public, cc_by, cc_by_sa, autorisation_ecrite). Pas de licence implicite par défaut.
- Ajout de tests Python : PDF texte, scan avec OCR simulé, scan sans OCR, encodage glyphes, caractères de contrôle, refus sans métadonnées/licence, préservation de corpus_index.json, indexation d’un document explicitement autorisé, et préservation des pages lisibles si l’OCR est absent.
- CI professor-ai enrichie d’une étape Python 3.12 pour exécuter ces tests avant les tests Worker IA.

### Limites assumées
- Aucun des 225 PDF existants n’a été automatiquement ingéré : il faut d’abord examiner les droits, compléter les métadonnées explicites et exécuter l’outil sur un dossier local autorisé.
- Le RAG distant n’est pas encore connecté à corpus_rag_chunks.json. Le manifeste indique volontairement staged_not_connected : aucun client ne peut fournir du texte ou des chunks non vérifiés au modèle.
- Le verrou Corpus et les accès existants doivent être appliqués au Worker avant toute activation de ce nouvel index. La politique actuelle déclare Corpus payant ; elle ne doit pas être contournée.
- Les tests viennent d’être ajoutés ; aucune exécution CI verte n’est encore confirmée sur la tête de branche au moment de cette note.

### Prochaine étape
- Lot 616 : valider l’exécution CI, puis concevoir un lecteur Worker côté serveur du nouvel artefact, avec sélection par ID strict, vérification d’accès Corpus existante, limite de taille/chunks et tests anti-forgery. Ne pas activer tant que la provenance/licence des documents n’est pas validée.

## Lot 616 — raccordement sécurisé du corpus PDF au RAG distant — 18 novembre 2026

- Le Worker du site protège désormais /assets/bdd/corpus_rag_chunks.json dans PROT : sans JWT, 401 ; avec JWT sans ligne lesson_content free=false visible via le RLS existant, 403 ; l’asset n’est servi qu’après cette vérification. Le test site-worker inclut ce chemin.
- worker/ia-ask.js accepte un sélecteur strict {type:"corpus_document", id:"pdf-<16 hex>"} ; tout champ supplémentaire, identifiant non conforme ou type falsifié est refusé. Il récupère lui-même l’artefact protégé avec le JWT, jamais depuis un URL ou texte transmis par le navigateur.
- Le Worker vérifie la présence du document, rights_confirmed=true et une licence dans la même allowlist que l’ingestion. Il classe les chunks du document par recouvrement lexical avec la question, ne retient que 4 chunks maximum, borne chaque extrait à 1 800 caractères et le contexte à 7 200 caractères. Les textes du document restent non fiables et ne peuvent pas devenir des instructions système.
- ia.js reconnaît uniquement les identifiants générés pdf-<16 hex> explicitement présents dans la question. L’outil d’ingestion génère maintenant cet identifiant depuis SHA-256 du PDF ; il ne reprend pas un ID libre fourni dans les métadonnées.
- Ajout d’un conteneur JSON vide corpus_rag_chunks.json et d’un manifeste corpus_rag_manifest.json au statut staged_not_connected. Aucun PDF réel n’est publié/indexé pour l’instant.
- CI vérifie désormais la présence de ces artefacts et exécute les tests Python d’ingestion, ainsi que les tests Worker IA et garde d’accès. La CI de la nouvelle tête n’est pas encore visible/confirmée.
- Limite : le ranking est lexical (pas d’embeddings/vector DB). Il s’agit d’une première récupération déterministe par document explicite, pas encore d’une recherche sémantique globale. Pas d’activation automatique des PDF ni de changement des règles d’accès Corpus.

### Validation attendue
- Vérifier dans CI les tests Python, les tests worker-ai-auth et site-worker-content-guard.
- Après CI verte, sélectionner un petit lot de PDF produits par l’équipe et confirmer leurs droits, puis lancer l’ingestion locale et contrôler les extraits avant de les committer.
- Ne pas fusionner ni déployer tant que les tests et les droits des documents ne sont pas confirmés.

### Complément Lot 616 — couverture des tests
- Les tests du Worker IA couvrent maintenant : résolution client de l’ID PDF, récupération des chunks avec JWT, sélection lexicale, refus 403 du Worker de site, refus de licence non autorisée et rejet d’un sélecteur falsifié avec URL supplémentaire.
- Les tests du Worker de site couvrent explicitement le nouvel asset PDF : absence de JWT, absence d’entitlement RLS et accès après entitlement RLS.
- Le scénario de récupération avec le mot-clé Perfekt utilise un abonnement actif de test afin de franchir le garde de règle grammaticale ; cela ne change pas la règle d’accès réelle.

### Audit des droits — corpus existant
- Vérification complète de assets/bdd/corpus.json : les 225 PDF portent tous licence="document utilisateur" et source="docs archive eleve". Aucun PDF existant ne satisfait l’allowlist explicite du nouvel outil. En conséquence, le nouvel index reste vide ; aucun de ces fichiers n’a été intégré au RAG. Il faut obtenir une preuve de droits ou utiliser des documents produits par l’équipe.


## Lot 617 — cohérence du manifeste RAG PDF et validation CI — 18 novembre 2026

- Audit du dernier run GitHub Actions sur le commit précédent `6a2a798d93eb9681a045f8db41a429bc1dab5e6f` : le job autonome `Tests autonomes — Professeur IA` est `success` (run `44208219325`), avec succès des tests Python d’ingestion PDF/OCR/droits, Worker IA JWT/RLS, protection du corpus et documents officiels, QUST/Darja/Arabizi et régressions RAG/professeur.
- Le job global `Validation structurelle & pédagogique` échoue uniquement à l’étape `Valider la messagerie EduDZ (schéma RLS + client + vue)`; les étapes précédentes, y compris les 9 cas de référence IA, le build T1-T6 et la syntaxe JavaScript, sont réussies. Les étapes suivantes sont ignorées à cause de cette dépendance. Échec hors périmètre IA, non corrigé ici.
- Le workflow CI déclenche aussi des jobs PostgreSQL isolés Multaqa et consentement Messenger en échec sur ce même commit ; ils concernent des domaines hors périmètre IA. Le job PostgreSQL de découverte Messenger est réussi. Aucun de ces tests n’écrit dans le Supabase actif.
- Correction de cohérence : le pipeline PDF écrivait encore `staged_not_connected` alors que le Worker IA récupère déjà l’artefact via le Worker de site protégé JWT/RLS. Le statut est désormais `connected_protected`, avec une note explicite sur le chemin protégé. Le manifeste livré reste vide : 0 document, 0 chunk, car aucun des 225 PDF existants n’a de droits confirmés.
- Le test d’ingestion vérifie maintenant le statut `connected_protected` pour éviter cette régression.
- Ces trois modifications sont postérieures au run `44208219325` et nécessitent donc une nouvelle exécution CI sur la tête actuelle. Ne pas déclarer cette nouvelle tête validée avant le résultat.
- PR #22 reste ouverte, en brouillon et non fusionnée. PR #21 reste également ouverte et en brouillon. Aucun changement Supabase, main, merge ou déploiement Cloudflare.

### Prochaine étape
- Vérifier le nouveau run CI déclenché par les commits du Lot 617. Si le job autonome IA échoue, corriger uniquement les erreurs de ce job. L’échec Messenger/Multaqa doit rester identifié comme externe au périmètre IA et ne doit pas déclencher une modification de ces modules.
- Obtenir des PDF produits par l’équipe ou une preuve écrite de droits pour les documents à intégrer ; ne pas indexer automatiquement les 225 archives utilisateur.


### Résultat final CI Lot 617 — tête 2d2e37fec208e31520573ff0bb4e75cc6169cfa5

- Run GitHub Actions `44209920032` terminé : job `Tests autonomes — Professeur IA` = `success`. Les tests d’ingestion PDF/OCR/droits, Worker IA JWT/RLS, garde corpus et documents officiels, QUST/Darja/Arabizi et régressions sont tous passés sur la tête actuelle.
- Job global = `failure` sur l’étape `Valider la messagerie EduDZ (schéma RLS + client + vue)`, avant l’exécution des autres suites conditionnelles. Cette erreur reste hors périmètre du professeur IA et n’a pas été modifiée.
- Conclusion : la suite autonome du professeur IA est validée sur la tête actuelle ; la CI globale du dépôt ne l’est pas. Aucun test E2E navigateur réel ni validation avec une vraie session utilisateur n’est revendiqué.


## Lot 618 — recherche naturelle dans le corpus PDF protégé — 18 novembre 2026

- Le professeur IA ne dépend plus exclusivement d’un identifiant technique `pdf-<hash>` : les questions qui mentionnent explicitement un PDF, un document, un fichier ou une archive, avec une intention de recherche/explication/résumé, déclenchent désormais `corpus_search`.
- Le client force le passage cloud pour cette intention documentaire, même si le moteur local produit déjà une réponse ; il ne fournit aucun extrait ni identifiant choisi par lui.
- Le Worker récupère l’index uniquement via le Worker du site avec le JWT de l’utilisateur. Il ne retient que les documents dont `rights_confirmed === true` et dont la licence figure dans l’allowlist. Il classe les chunks lexicalement sur la question, renvoie au maximum quatre extraits / 7 200 caractères et étiquette document + page. Les sélecteurs `corpus_document` exacts restent compatibles.
- Tests ajoutés : détection française et arabe, refus sans intention documentaire, récupération naturelle multi-documents, exclusion d’un document utilisateur sans licence, refus si le Worker du site retourne 403 et rejet des sélecteurs forgés.
- Limite maintenue : classement lexical, pas encore embeddings/vector search. L’index de production reste vide (0 PDF / 0 chunk) tant qu’aucun document avec droits confirmés n’est fourni ; les 225 PDF utilisateur ne sont pas inclus.
- La nouvelle tête de branche est `1eec9512557feec9c0b782e22b3c33d7891b88e2`. CI run `44211660464` déclenché et en cours au moment de cette note ; aucun résultat n’est présumé.
- Aucun changement Supabase, main, fusion ou déploiement. PR #22 reste ouverte et en brouillon.


### Résultat CI Lot 618

- Run `44211660464` sur le commit applicatif `1eec9512557feec9c0b782e22b3c33d7891b88e2` terminé : `Tests autonomes — Professeur IA` = `success`. Les nouveaux tests de recherche PDF naturelle et les tests existants du professeur IA passent.
- La CI globale = `failure` uniquement sur `Valider la messagerie EduDZ (schéma RLS + client + vue)`. Les jobs conditionnels ultérieurs sont ignorés par le workflow après cette erreur.
- Les commits ultérieurs `ed59f21` et `47154cc` ne contiennent que les deux mises à jour de continuité ; le run applicatif ci-dessus valide le code IA du Lot 618, mais le SHA exact de tête documentaire n’a pas de run distinct visible.


### Lot 619 — rappel documentaire interlingue (18 novembre 2026)
- Le classement PDF ne repose plus sur le simple nombre de sous-chaînes présentes : il utilise un score BM25 léger, calculé uniquement sur les chunks dont le document a déjà passé le filtre de droits/licence et le contrôle JWT/RLS.
- Ajout d'un petit glossaire de rappel FR/AR vers les termes allemands pour les notions courantes du programme (Perfekt, Akkusativ, Dativ, Passiv, Konjunktiv II, Präteritum, Präsens, Komparativ). Une question en arabe « الماضي المركب » peut ainsi retrouver un passage qui ne contient que « Perfekt ».
- Le glossaire sert uniquement à retrouver des extraits autorisés ; il ne déverrouille aucun contenu, ne fournit pas de texte documentaire et ne modifie pas la décision d'accès. Les extraits restent limités à quatre chunks et 7 200 caractères.
- Test de régression ajouté : recherche arabe « اشرح الماضي المركب في ملفات PDF » → passage allemand Perfekt, sans sélectionner le document non pertinent sur Präsens.
- Cette amélioration est une recherche lexicale BM25 avec expansion terminologique, pas un modèle d'embeddings ni une recherche vectorielle. Le Worker possède déjà un chemin d'inférence AI, mais aucun index vectoriel ni vecteur de chunk n'est configuré dans cette branche. Une vraie recherche sémantique nécessitera une étape d'embedding à l'ingestion et une politique de coût/stockage explicite ; elle ne doit pas être simulée en prétendant que BM25 est vectoriel.
- Le corpus PDF réel reste vide : les 225 PDF précédemment recensés sont étiquetés « document utilisateur » et aucun n'a encore de preuve de droits validée. Aucun document n'a été indexé.
- Aucune modification Supabase, Auth, RLS, paiement, main, aucun merge ni déploiement Cloudflare.


### Complément Lot 619 — verrouillage des alias traduits
- Revue de sécurité après ajout du glossaire de recherche : les formulations arabes/françaises des mêmes règles payantes pouvaient sinon éviter la liste de termes allemands.
- Ajout des alias « الماضي المركب », « الماضي التام », « حالة النصب », « حالة الجر », « المبني للمجهول », « صيغة الشرط », « الماضي البسيط », « المضارع », « صيغة المقارنة » et des formes françaises courantes à LOCKED_RULES.
- Tests négatifs : compte gratuit + alias arabe/français + sélecteur de résumé gratuit ou page gratuite → 403 content-locked, aucun message transmis au modèle. Le test de recherche arabe PDF utilise désormais un abonnement actif pour vérifier le résultat documentaire sans affaiblir le cadenas.
- La règle reste : tout compte authentifié utilise le professeur distant, mais les notions et ressources verrouillées restent protégées côté Worker.


### Complément sécurité — normalisation arabe (Lot 620)
- Le garde des sujets verrouillés normalise désormais les signes diacritiques arabes (harakat), le tatweel et plusieurs variantes d'alif/ya avant de comparer les alias. Une règle payante ne peut donc pas être demandée avec des voyelles ajoutées pour contourner la détection.
- Tests négatifs ajoutés pour « الماضي المركب », sa forme vocalisée « المَاضِي المُرَكَّب » et une variante d'alif, en plus des formulations françaises/arabe déjà couvertes. Le Worker doit refuser en 403 sans transmettre le contenu au modèle.
- Cette normalisation ne change pas les règles d'accès ni l'accès général au professeur IA ; elle rend uniquement la détection des sujets déjà verrouillés plus robuste.


### Validation finale Lot 620
- Une première exécution CI a détecté une expression régulière mal échappée dans la normalisation arabe ; elle a été corrigée en construisant les plages Unicode avec `String.fromCharCode`, sans séquence échappée ambiguë dans le littéral regex.
- Run `44213809534` sur le commit `ce2e58a3e6d5b96d1190467e9e3a45d2c647eefe` : job `Tests autonomes — Professeur IA` = `success`, incluant ingestion PDF/OCR/droits, Worker IA, garde des documents officiels, QUST/Darja/Arabizi et régressions RAG/professeur.
- La CI globale reste `failure` uniquement sur `Valider la messagerie EduDZ (schéma RLS + client + vue)`, hors périmètre du Professeur IA. Les tests autonomes IA sont verts.


### Lot 621 — normalisation des requêtes PDF vocalisées
- Le même normaliseur arabe que celui du garde des cadenas est maintenant appliqué à la tokenisation BM25. Les harakat/tatweel et variantes d'alif/ya sont traités de façon identique côté question et côté chunk.
- Le test de recherche PDF interlingue utilise désormais une question arabe vocalisée pour vérifier que « الماضي المركب » retrouve toujours le passage allemand sur Perfekt.
- Cette évolution reste du BM25 lexical avec expansion de concepts ; elle ne prétend pas être une recherche vectorielle.


### Validation Lot 621 — BM25 arabe vocalisé
- Run `44214054953` sur le commit applicatif `27b1aa308a755c9d17ecf254effec09fbe7c6c87` : `Tests autonomes — Professeur IA` = `success`. Les tests d'ingestion PDF/OCR/droits, Worker IA, documents officiels, QUST/Darja/Arabizi et régressions RAG/professeur passent.
- La CI globale reste `failure` sur `Valider la messagerie EduDZ (schéma RLS + client + vue)` ; les contrôles conditionnels après ce point sont sautés. Aucun changement n'a été apporté à Messenger/Multaqa pour masquer cet échec.


# Lot 622 — préparation de la recherche vectorielle multilingue (18 novembre 2026)

## État vérifié avant conception
- Le code de `worker/ia-ask.js` utilise déjà la liaison Cloudflare Workers AI `env.AI` pour la génération des réponses.
- Le RAG PDF récupère les chunks depuis `corpus_rag_chunks.json` après lecture protégée par JWT/RLS, puis applique BM25 et expansion terminologique FR/AR/Darija → allemand.
- `corpus_rag_chunks.json` et `corpus_rag_manifest.json` sont actuellement vides : 0 document, 0 chunk. Les 225 PDF du corpus utilisateur restent exclus faute de droits confirmés.
- La suite autonome Professeur IA du run `44214054953` est réussie sur le commit applicatif `27b1aa308a755c9d17ecf254effec09fbe7c6c87`. La CI globale échoue sur la validation Messenger EduDZ, hors périmètre IA.

## Modèle candidat étudié
- `@cf/google/embeddinggemma-2` est disponible dans Workers AI depuis le 12 novembre 2026. Cloudflare annonce plus de 100 langues, une sortie de 768 dimensions par défaut et des dimensions configurables de 128, 256 ou 512. Le tarif publié est de 0,0017 USD par million de tokens d'entrée.
- Workers AI est inclus dans les plans Workers Free et Paid avec une allocation commune de 10 000 Neurons par jour. Au-delà, un plan Paid facture 0,011 USD par 1 000 Neurons ; sur le plan Free, les opérations au-delà de la limite échouent. L'usage d'embeddings n'est donc pas illimité ni garanti sans coût.
- Ce modèle réutiliserait la liaison `env.AI` déjà présente : aucun fournisseur ou service vectoriel externe supplémentaire n'est nécessaire. Les appels d'embedding consommeraient toutefois le quota Workers AI partagé avec la génération existante.

## Architecture proposée — non activée
1. Ingestion : après validation des métadonnées de droits et de la licence, calculer les embeddings des chunks approuvés ; ne jamais vectoriser un document rejeté par le contrôle de droits.
2. Modèle : `@cf/google/embeddinggemma-2`, dimension initiale proposée 256 pour limiter le stockage, avec les mêmes paramètres et préfixes de tâche pour les documents et les requêtes.
3. Versionnement : enregistrer modèle, dimensions, version de schéma, stratégie de normalisation, identifiant/hash du chunk et empreinte du corpus. Rejeter les vecteurs d'un modèle, d'une dimension ou d'une version incompatible.
4. Stockage : artefact vectoriel séparé, statique et protégé par le Worker du site avec le même JWT/RLS que les chunks. Aucun stockage Supabase, aucune table et aucune migration.
5. Recherche : authentifier l'utilisateur ; récupérer les documents/chunks via le Worker protégé ; filtrer les licences et droits confirmés ; seulement ensuite classer les chunks autorisés par similarité cosinus. BM25 reste disponible et sert de repli si les vecteurs sont absents, incompatibles ou si l'embedding échoue.
6. Recherche hybride : comparer sur un corpus de test contrôlé la fusion BM25 + vectorielle (RRF) avec BM25 seul avant de choisir les seuils et le nombre d'extraits. Ne pas supposer qu'un score vectoriel constitue une autorisation.
7. Activation : drapeau `RAG_VECTOR_ENABLED` désactivé par défaut. Aucun appel d'embedding en production tant que le drapeau n'est pas explicitement activé et que le quota/coût n'a pas été vérifié.

## Tests exigés avant activation
- Validation de la forme, de la dimension, de la normalisation et de la version des vecteurs.
- Recherche croisée arabe/Darija/Arabizi/français ↔ allemand sur des documents de test dont les droits sont explicitement autorisés.
- Vérification que les documents non autorisés sont exclus avant classement et qu'aucun de leurs extraits n'est transmis au modèle.
- Repli BM25 si l'IA d'embedding est indisponible, si le vecteur est absent ou si la version diffère.
- Vérification que le drapeau désactivé n'appelle jamais le modèle d'embedding.
- Mesure de taille des artefacts et du coût/Neurons sur un petit corpus autorisé avant toute indexation large.

## Décision et limites
- Lot 622 est une étude d'architecture et de coût ; aucun embedding n'a été généré, aucun PDF utilisateur n'a été débloqué et aucune recherche vectorielle n'est activée.
- Le candidat recommandé est EmbeddingGemma 2 sur la liaison Workers AI déjà utilisée, sous réserve de respecter le quota gratuit et de garder l'activation désactivée par défaut.
- Le prochain travail de code devra être isolé derrière le drapeau, testé avec des fixtures synthétiques/explicitement autorisées et ne devra pas modifier Supabase, main, les abonnements ou le déploiement.
- PR #22 reste ouverte en brouillon, non fusionnée.


# Lot 623 — première implémentation de la recherche vectorielle facultative (18 novembre 2026)

## Modifications de code
- `worker/ia-ask.js` accepte maintenant une recherche vectorielle facultative pour `corpus_search` / `corpus_document`, derrière le drapeau strict `env.RAG_VECTOR_ENABLED === 'true'`.
- Sans ce drapeau, aucun chargement du fichier vectoriel et aucun appel d'embedding ne sont effectués : le comportement reste BM25.
- Lorsque le drapeau est activé et que l'index contient des vecteurs valides, le Worker calcule l'embedding de la question avec `@cf/google/embeddinggemma-2` (256 dimensions), calcule la similarité cosinus et fusionne le classement sémantique et BM25 par Reciprocal Rank Fusion (RRF).
- Si le fichier vectoriel est absent/invalide, si le binding AI est absent, ou si l'inférence échoue, le Worker revient au classement BM25. Aucun échec d'embedding ne bloque une recherche lexicale valide.
- Le classement vectoriel ne voit que les chunks déjà filtrés par `rights_confirmed`, licence autorisée et sélection documentaire serveur. Un vecteur n'est jamais une preuve d'autorisation.

## Protection de l'index
- `src/site-worker.js` protège désormais `/assets/bdd/corpus_rag_vectors.json` avec le même contrôle JWT/RLS existant que `corpus_rag_chunks.json`.
- Tests ajoutés pour refuser la lecture directe sans JWT / sans entitlement RLS et autoriser la lecture uniquement après validation RLS.
- Nouveau fichier `assets/bdd/corpus_rag_vectors.json` versionné : modèle `@cf/google/embeddinggemma-2`, 256 dimensions, normalisation L2, zéro vecteur. Aucun document utilisateur n'a été vectorisé.

## Tests ajoutés
- Récupération sémantique d'un passage allemand depuis une question arabe sans correspondance lexicale, avec exclusion d'un document sans licence autorisée.
- Vérification que le drapeau désactivé n'effectue aucune requête vers l'index vectoriel.
- Vérification du repli BM25 en cas d'échec du modèle d'embedding.
- Vérification du contrôle JWT/RLS pour l'artefact vectoriel.

## Limites et état de validation
- Cette première étape implémente le chemin de recherche côté Worker, pas encore la génération des embeddings documentaires à l'ingestion. L'index reste vide (0 vecteur) et BM25 reste le seul mode opérationnel par défaut.
- Le drapeau n'est pas activé dans la configuration de production. Aucun appel d'embedding ni coût d'inférence n'a été déclenché par cette modification.
- Aucun changement de `wrangler.toml`, Supabase, Auth, RLS, SQL, abonnements, `main` ou Cloudflare déployé.
- PR #22 reste ouverte en brouillon, non fusionnée. Les tests CI du nouveau HEAD doivent être vérifiés avant de déclarer ce lot validé.

## Prochaine étape
Lot 624 — construire l'ingestion vectorielle reproductible des seuls chunks autorisés, avec préfixes de tâche document, batch contrôlé, normalisation L2, empreinte/version de modèle, tests de dimension et sans déclencher d'indexation des 225 PDF non autorisés.


# Lot 624 — générateur reproductible des embeddings documentaires (18 novembre 2026)

## Audit réel du corpus
- `assets/bdd/corpus_rag_chunks.json` : 0 document et 0 chunk.
- `assets/bdd/corpus_rag_manifest.json` : 0 document, 0 chunk ; aucune source n'est actuellement admissible à la vectorisation.
- Conséquence : aucun appel Workers AI n'a été exécuté et aucun vecteur documentaire n'a été généré. Les PDF sans droits confirmés restent exclus.

## Implémentation
- Nouveau script `tools/build_corpus_rag_vectors.py` : lit uniquement les deux artefacts RAG existants ; vérifie versions, cohérence des compteurs du manifeste, `rights_confirmed === true` et appartenance à la liste des licences autorisées avant de construire les entrées API.
- Le texte envoyé au modèle utilise le préfixe documentaire officiel `title: ... | text: ...` ; le Worker conserve son préfixe de requête `task: search result | query: ...`.
- Lots bornés (8 par défaut, 32 maximum), validation stricte du nombre et des indices de réponse, dimension exacte 256, valeurs finies et normalisation L2.
- Le schéma de sortie reprend exactement les identifiants attendus par le Worker : `chunk_id`, `document_id`, `embedding`. Cette correspondance a été vérifiée dans `worker/ia-ask.js`.
- Empreintes SHA-256 du fichier de chunks et du manifeste enregistrées dans l'artefact pour tracer la provenance. Écriture atomique uniquement après réussite de tous les lots.
- Aucun package Python supplémentaire ; API Cloudflare REST documentée, secrets uniquement via `CLOUDFLARE_ACCOUNT_ID` et `CLOUDFLARE_API_TOKEN` en variables d'environnement.

## Barrières de coût et de sécurité
- Mode par défaut : dry-run local, zéro requête réseau, zéro écriture du fichier vectoriel.
- L'exécution réelle exige à la fois `--execute` et `--confirm-cloudflare-billing`, plus des identifiants Cloudflare valides.
- Un corpus vide provoque un arrêt explicite en mode exécution ; aucune génération d'embeddings vides ou aucun coût inutile.
- Aucun PDF sans droits confirmés ne peut entrer dans le lot envoyé au modèle.
- Aucun changement Supabase, Auth, RLS, SQL, abonnement, `wrangler.toml`, `main` ou déploiement Cloudflare.

## Tests et validation
- Nouveau fichier `tests/test_build_corpus_rag_vectors.py` : filtre de droits, incohérence manifeste, dimension, NaN/Inf, normalisation, index API, batching, métadonnées et dry-run sans appel API.
- La CI `professor-ai` est étendue pour exécuter ces tests en plus des tests d'ingestion PDF existants.
- Les tests sont ajoutés à la CI mais ne sont pas encore déclarés réussis : le nouveau HEAD doit être exécuté par GitHub Actions.

## Suite
- Attendre l'exécution CI du nouveau HEAD.
- Dès que le propriétaire fournit des documents avec licences et droits vérifiables, générer un petit lot autorisé seulement après validation explicite du coût/quota Workers AI.
- Comparer ensuite la qualité retrieval BM25 vs hybride sur un jeu d'évaluation multilingue autorisé avant toute activation du drapeau en production.


## Contrôle CI après le Lot 624 — 18 novembre 2026
- Run `44216234225` sur le HEAD `e941fb60094fc71c89f94c484eae42c2c1c63e70` : les 8 tests d'ingestion PDF passent et les 8 tests du nouveau générateur vectoriel passent.
- Dans `tests/worker-ai-auth.test.mjs`, 73 tests sur 74 passent. L'unique échec était une assertion de fixture qui attendait `Das Perfekt wird` alors que le corpus de test fournit `Der Perfekt wird`. Le test a été corrigé dans le commit `7f9aadd6230e44deb8534a0bcfd9549aa3880663` ; il s'agissait d'une attente textuelle incorrecte, pas d'une panne du repli BM25.
- Le job global échoue aussi sur une erreur de syntaxe préexistante et hors périmètre dans `ci/check-msg.mjs:231` (Messenger EduDZ). Les étapes de validation structurelle précédentes, dont YAML/JSON, moteur IA 9 cas, suite de build T1–T6 et syntaxe JS 37/37, étaient réussies. Ce chantier IA ne modifie pas Messenger.
- Le correctif `7f9aadd` n'a pas encore de nouveau run CI associé au moment de cette mise à jour. Il n'est donc pas présenté comme validé.
- Le job Worker doit être rejoué sur ce nouveau HEAD pour confirmer les 74/74 tests et reprendre les étapes RAG/QUST/PROF qui ont été sautées après le premier échec.


## Lot 625 — tests multilingues et validation CI (18 novembre 2026)
- Ajout d'un test de contrat de recherche hybride sur quatre formulations : arabe standard, darija, Arabizi et français, toutes ciblant un extrait allemand. Le test vérifie le passage par le modèle d'embedding et le préfixe de requête Cloudflare exact `task: search result | query: ...`. Il s'agit d'un test de pipeline avec vecteurs contrôlés, pas d'une mesure de qualité réelle du modèle.
- Correctif de l'assertion BM25 de repli inclus ; la recherche reste fonctionnelle si l'inférence d'embedding échoue.
- CI `44278364370` sur le commit `4662bb36f9a79049c8800d5c93a563ef31d25fb9` : job autonome Professeur IA `success`.
- Résultats confirmés dans les logs :
  - Ingestion PDF/OCR/droits : 8/8.
  - Générateur d'embeddings : 8/8.
  - Worker IA/JWT/RAG : 75/75.
  - Garde d'accès du Worker du site : 14/14.
  - QUST Darija/Arabizi : 9/9.
  - Régressions : RAG 12/12, PROF 18/18, suite combinée exécutée.
- Le job structurel global échoue toujours sur l'erreur indépendante de Messenger `ci/check-msg.mjs:231` (SyntaxError, expression `currentThread.querySelector`), sans rapport avec le professeur IA. Les validations antérieures de ce job étaient réussies. Aucun changement Messenger n'est inclus dans cette branche IA.
- Aucun benchmark de rappel/précision sur documents réels n'est possible : le manifeste PDF contient toujours zéro document et zéro chunk. Les tests multilingues actuels valident le câblage et la sécurité du classement avec des fixtures synthétiques.
- Le dernier HEAD applicatif testé est `4662bb36f9a79049c8800d5c93a563ef31d25fb9`. Les commits documentaires qui suivent ne modifient pas le code testé. La PR reste ouverte et en brouillon, sans fusion ni déploiement.


## Lot 626 — inventaire PDF réel et découverte récursive (18 novembre 2026)
- Audit de l'arbre Git complet du dépôt : 293 fichiers PDF versionnés, dont 264 dans `docs/archive/documents/` et 29 à la racine.
- Aucun des 293 PDF ne possède le compagnon de droits attendu par l'ingestion (`_<nom_du_pdf>.json`) dans son propre dossier. Le pipeline ne peut donc en indexer aucun sans validation explicite des droits.
- Le manifeste RAG reste inchangé à 0 document / 0 chunk. Aucun PDF n'a été envoyé au modèle d'embedding, et aucune licence n'a été supposée à partir du nom, du dossier ou du contenu.
- Défaut de couverture corrigé : `tools/ingest_corpus_rag.py` parcourait uniquement les PDF du premier niveau (`glob`). Il utilise maintenant une découverte récursive déterministe (`rglob`) et conserve le chemin relatif dans `source_file` et les rapports d'exclusion, pour éviter les collisions entre fichiers de même nom.
- Nouveau test : un PDF situé dans un sous-dossier n'est ingéré que si son compagnon local confirme `droits_confirmes: true` et une licence autorisée ; son chemin relatif est conservé.
- Ce changement améliore la couverture technique, mais ne change pas la politique de droits : les 293 PDF restent exclus tant que leurs preuves ne sont pas fournies.
- Validation CI du Lot 626 en attente sur le nouveau HEAD ; ne pas annoncer les tests comme réussis avant le résultat du job autonome Professeur IA.


## Résultat CI du Lot 626 — 18 novembre 2026
- Run `44278714245` sur le commit applicatif `dccec914d60bb7af6c24e2ab52a34ea8d91b3686` : job autonome Professeur IA `success`.
- Ingestion PDF : 9/9 tests réussis, y compris la découverte récursive d'un PDF imbriqué avec compagnon de droits.
- Générateur vectoriel : 8/8 tests réussis.
- Worker IA/JWT/RAG : 75/75 ; garde d'accès Worker du site : 14/14 ; QUST Darija/Arabizi : 9/9.
- Régressions : RAG 12/12, PROF 18/18 et suite combinée exécutées sans erreur dans le job autonome.
- Le job global reste en échec uniquement sur l'erreur de syntaxe Messenger déjà identifiée dans `ci/check-msg.mjs:231`. Le job autonome IA, qui est le périmètre de cette PR, est vert.
- Le code de Lot 626 est validé. Les trois commits documentaires postérieurs ne modifient pas le code testé. Aucun index PDF réel n'a été créé : les 293 fichiers restent sans compagnon de droits.


## Lot 627 — inventaire exploitable des droits PDF
- Création de `docs/inventaire_pdf_droits.csv` avec une ligne par PDF détecté dans l'arbre Git : 293 lignes.
- Chaque ligne fournit le chemin du PDF et le nom exact du compagnon attendu (`_<nom>.json`), avec les champs de licence et de confirmation laissés volontairement vides et un statut « à vérifier ».
- Cet inventaire sert de feuille de revue des droits ; il ne constitue pas une autorisation et ne doit pas être rempli automatiquement à partir des noms de fichiers.
- Les 293 documents restent exclus de l'index tant que la preuve n'est pas confirmée.


## Lot 628 — validation contrôlée de l'inventaire des droits PDF (18 novembre 2026)
- Ajout de `tools/validate_pdf_rights_inventory.py`, validateur local en lecture seule de `docs/inventaire_pdf_droits.csv`.
- Le validateur exige les cinq colonnes attendues, vérifie que chaque PDF existe dans le dépôt, rejette les chemins absolus / traversées de répertoire, contrôle le nom exact du compagnon attendu, les doublons et les valeurs de confirmation.
- Une ligne n'est admissible que si `rights_confirmed=true` ET si `license` appartient strictement à la liste déjà admise par l'ingestion : `production_propre`, `domaine_public`, `cc_by`, `cc_by_sa`, `autorisation_ecrite`.
- Les lignes vides restent en attente. Une confirmation sans licence, une licence inconnue, un chemin incohérent ou un PDF absent déclenche une erreur.
- Le script ne modifie aucun CSV, ne crée aucun compagnon JSON, ne déduit aucun droit et ne lance ni extraction PDF ni embedding.
- Ajout de 10 tests unitaires couvrant les lignes en attente, les licences admises/refusées, les confirmations invalides, les chemins, les doublons et les fichiers absents. La suite est ajoutée au job autonome Professeur IA.
- État du corpus : 293 PDF inventoriés, 0 compagnon de droits trouvé lors de l'audit, 0 document / 0 chunk dans le manifeste RAG. Aucun PDF réel indexé et aucun appel Workers AI supplémentaire.
- Le comptage de 225 PDF présent dans certaines notes antérieures correspond à un inventaire partiel historique ; l'audit récursif complet du Lot 626 établit le total actuel à 293.
- Validation CI de ce nouveau lot en attente : ne pas annoncer les tests comme passés avant le résultat du job autonome.
- PR #22 reste ouverte en brouillon, non fusionnée ; aucune modification Supabase, de `main`, aucun déploiement Cloudflare.


### Résultat CI du Lot 628 — run 44282039020
- Job autonome « Tests autonomes — Professeur IA » : `success` sur le commit de code `8ce4dc01ae6c066d247b753819e780cc4aaabce2`.
- Validateur d'inventaire : 10/10 ; ingestion PDF : 9/9 ; générateur vectoriel : 8/8 ; Worker IA/JWT/RAG : 75/75 ; garde du Worker de site : 14/14 ; QUST : 9/9 ; régressions RAG 12/12 et PROF 18/18, suite combinée exécutée.
- Le job « Validation structurelle & pédagogique » était encore en cours au moment de cette note. Ce succès autonome IA ne vaut pas feu vert global du dépôt.
- Les commits documentaires qui suivent ne modifient pas le code testé. Aucun PDF réel ni embedding n'a été ajouté.


### Complément Lot 628 — vérification du compagnon de droits réel
- Durcissement après revue : une ligne CSV confirmée ne suffit plus. Le validateur exige maintenant que le fichier compagnon JSON existe, soit lisible, contienne `droits_confirmes: true` et déclare exactement la même licence que le CSV.
- Un compagnon absent, JSON invalide, non confirmé ou avec licence divergente est refusé. Cette règle aligne le rapport d'admissibilité avec ce que `tools/ingest_corpus_rag.py` peut réellement ingérer.
- La suite comprend désormais 14 tests. Le premier run 44282039020 validait la version précédente à 10/10 ; la version durcie doit encore être validée par une nouvelle CI.


### Validation finale du Lot 628 durci — 18 novembre 2026
- Run CI `44282741104`, commit de code `4665f8ce55b4f2eec3a9bb910ce567246ca817e9` : job autonome Professeur IA = `success`.
- Validateur des droits PDF : 15/15 ; ingestion PDF/OCR : 9/9 ; générateur vectoriel : 8/8 ; Worker IA/JWT/RAG : 75/75 ; garde Worker du site : 14/14 ; QUST : 9/9 ; régressions RAG 12/12 et PROF 18/18, suite combinée exécutée.
- Le job structurel global échoue sur `ci/check-msg.mjs:231`, `SyntaxError: missing ) after argument list`, dans la validation Messenger hors périmètre IA. Aucun fichier Messenger n'est modifié dans cette PR.
- Le commit `4665f8c` contient le dernier durcissement applicatif testé. Les notes de continuité ajoutées ensuite sont documentaires uniquement.


## Lot 629 — audit de disponibilité du texte PDF (18 novembre 2026)
- Ajout de `tools/audit_pdf_text_readiness.py` : audit récursif en lecture seule des PDF, avec classification `extractable`, `mixed`, `ocr_candidate`, `encrypted`, `empty` ou `unreadable`.
- Le script compte les pages, pages contenant du texte exploitable et caractères extractibles ; il ne conserve aucun extrait de texte, ne lance pas l'OCR, ne modifie aucun PDF et ne produit aucun artefact RAG.
- Les liens symboliques qui sortent du dossier racine sont signalés et ne sont pas lus. L'audit n'établit aucun droit et ne rend aucun document admissible.
- Six tests unitaires ajoutés ; la CI installe `pypdf`, exécute les tests puis audite le dépôt complet en mode résumé uniquement.
- Résultat du run déclenché sur HEAD `7fbb15d8fccac8eb54b87718b2b262e0b732e042` en attente au moment de cette note. Ne pas annoncer les compteurs PDF avant le résultat du job.


### Résultats réels du diagnostic Lot 629 — CI 44285230823
- Le job autonome Professeur IA est `success`. Les tests Python : ingestion 9/9, droits PDF 15/15, audit de disponibilité du texte 6/6, générateur vectoriel 8/8 ; Worker IA/JWT/RAG 75/75 ; garde Worker du site 14/14 ; QUST 9/9 ; régressions RAG 12/12 et PROF 18/18, suite combinée exécutée.
- Audit réel de 293 PDF : 1 173 pages ; 767 pages avec texte extractible ; 406 pages sans texte extractible ; 747 140 caractères extractibles mesurés sans conservation.
- Classification des fichiers : 186 `extractable`, 28 `mixed`, 78 `ocr_candidate`, 1 `encrypted`, 0 `empty`, 0 `unreadable`, 0 lien sortant.
- Interprétation : 106 fichiers ont au moins une page nécessitant potentiellement un OCR (28 mixtes + 78 sans texte extractible). Le chiffre est un indicateur technique, pas une preuve que l'OCR donnera un résultat correct.
- Aucun OCR n'a été exécuté, aucun texte n'a été écrit dans un fichier, aucun PDF n'a été indexé ; les droits restent non vérifiés. Les documents restent exclus du RAG tant que leur preuve de droits n'est pas validée.
- Le job global demeure en échec indépendant sur la validation Messenger EduDZ ; les tests IA autonomes sont verts.


## Lot 630 — rapport PDF individuel téléchargeable (18 novembre 2026)
- L'audit non destructif produit désormais un CSV technique par PDF : chemin relatif, statut d'extractibilité, nombre de pages, pages avec/sans texte, nombre de caractères extractibles et type d'erreur éventuel. Aucun texte pédagogique n'est inclus.
- Le CSV est écrit uniquement hors du dossier source ; le script refuse explicitement un emplacement de rapport situé dans le corpus PDF.
- Le job CI publie ce rapport comme artefact GitHub Actions pendant 14 jours : run `44286206424`, artefact `pdf-text-readiness`, ID `14418154476`.
- CI autonome Professeur IA : succès. Tests Python : ingestion 9/9, droits 15/15, audit PDF 8/8, builder vectoriel 8/8 ; Worker IA/JWT/RAG 75/75 ; garde Worker 14/14 ; QUST 9/9 ; régressions RAG 12/12 et PROF 18/18 ; suite combinée exécutée.
- Le diagnostic du dépôt reste 293 PDF / 1 173 pages : 186 extractibles, 28 mixtes, 78 candidats OCR, 1 chiffré. Aucune extraction de texte n'est conservée dans le rapport, aucun OCR ni indexation n'est lancé.


## Lot 631 — registre PDF unifié (18 novembre 2026)
- Le CSV d'audit technique est enrichi par jointure exacte avec docs/inventaire_pdf_droits.csv.
- Les valeurs rights_confirmed, license, review_status et le compagnon attendu sont reproduites sans attribution automatique de droits.
- Les écarts de chemins sont signalés ; les doublons d'inventaire sont une erreur bloquante.
- Artefact CI : pdf-rights-and-readiness (14 jours), limité aux chemins et métadonnées, sans texte extrait.
- Aucun PDF n'est rendu admissible par ce rapport. OCR, indexation et embeddings restent suspendus à une preuve de droits vérifiée.
- Résultat du nouveau run CI à consigner après validation du HEAD Lot 631.


### Lot 631 — validation et rapport CSV droits + extractibilité
- Correctif CSV validé : l'export écrit la sortie fusionnée, y compris les entrées d'inventaire sans fichier correspondant ; un test de bout en bout du writer couvre ces lignes.
- CI run `44289483381`, commit `697bb55b7c2160cc0a0aeb585e0dff16e9c64949` : job autonome IA réussi. Ingestion 9/9, droits 15/15, audit PDF 11/11, builder vecteur 8/8, Worker IA/JWT/RAG 75/75, garde site 14/14, QUST 9/9, RAG 12/12, PROF 18/18.
- Audit : 293 PDF / 1 173 pages ; 186 extractibles, 28 mixtes, 78 candidats OCR, 1 chiffré. 767 pages avec texte et 406 sans texte extractible. Aucun texte n'est sauvegardé.
- Rapprochement exact : 293 correspondances sur 293, aucun orphelin. Zéro droit confirmé ; les 293 licences et confirmations restent vides / à vérifier.
- Artefact CI `pdf-rights-and-readiness`, ID `14421110680`, rétention 14 jours : https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/44289483381/artifacts/14421110680
- OCR, indexation et embeddings réels non exécutés. Le rapport n'accorde aucun droit et ne rend aucun document admissible.
- Échec structurel global toujours isolé à `ci/check-msg.mjs:231` (Messenger). Job autonome Professeur IA vert ; PR #22 ouverte, brouillon, non fusionnée.
