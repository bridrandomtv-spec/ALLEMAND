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
