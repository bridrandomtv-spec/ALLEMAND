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


## Lot 632 — double verrou d'autorisation à l'ingestion
- L'ingestion RAG ne fait plus confiance au seul compagnon `_NOM.json`. Elle exige une ligne correspondante dans `docs/inventaire_pdf_droits.csv`, avec `rights_confirmed=true`, le même nom de licence autorisée et le chemin exact du compagnon.
- Absence d'inventaire ou de ligne, confirmation vide/fausse, licence divergente, chemin hors racine/incohérent ou doublon : refus d'ingestion (fail closed).
- Tests CI `44290732499` : ingestion 13/13, droits 15/15, audit PDF 11/11, vector builder 8/8, Worker 75/75, site guard 14/14, QUST 9/9, RAG 12/12, PROF 18/18 ; job autonome IA vert.
- Le CSV réel confirme 293/293 correspondances, zéro droit confirmé et 293 documents en attente. Aucun OCR, indexation ou embedding réel.
- Artefact `pdf-rights-and-readiness`, ID `14420923665` : https://github.com/bridrandomtv-spec/ALLEMAND/actions/runs/44290732499/artifacts/14420923665
- L'échec structurel général reste le parseur Messenger `ci/check-msg.mjs:231`, hors périmètre. PR #22 reste brouillon et non fusionnée.


## Lot 633 — cohérence de version de l'index vectoriel (18 novembre 2026)
- Durcissement de `worker/ia-ask.js` : avant d'utiliser les vecteurs, le Worker calcule SHA-256 du JSON exact des chunks récupérés côté serveur.
- L'artefact `corpus_rag_vectors.json` n'est accepté que si `source_chunks_sha256` correspond à cette empreinte, en plus des contrôles existants de version, modèle, dimension, ID de chunk et ID de document.
- Un index absent, périmé ou incohérent est ignoré ; le classement BM25 reste disponible. Aucun vecteur ne peut introduire un chunk qui n'est pas déjà présent dans les documents autorisés après contrôle JWT/RLS/licence.
- Test de régression ajouté : un artefact vectoriel portant une empreinte périmée ne déclenche pas l'inférence d'embedding et conserve la réponse BM25.
- Commits applicatifs : `6348f8776d9dabdf29cc6364f5931669417c962c` (Worker), puis `b7870d51519ea7a1cc73cf80d4ff5e9aea5fade5` (test).
- HEAD PR #22 constaté après les modifications : `b7870d51519ea7a1cc73cf80d4ff5e9aea5fade5`.
- Validation CI du nouveau HEAD non encore remontée par GitHub au moment de cette note ; ne pas déclarer le Lot 633 validé avant le job autonome Professeur IA.
- Aucun embedding réel, OCR, accès PDF supplémentaire, appel Workers AI de production, changement Supabase/Auth/RLS, merge ou déploiement.
- La validation structurelle globale précédente reste distinctement bloquée par `ci/check-msg.mjs:231` (syntaxe Messenger EduDZ, hors périmètre IA).


## Lot 633 — validation CI finale
- HEAD testé : `01a72e7ba17626f6fd2d2134bc10fe96177b6f1a`.
- Run GitHub Actions `44333454974` : job `Tests autonomes — Professeur IA` = `success`. Le test d'index vectoriel périmé et le repli BM25 ont donc été exécutés dans le job autonome.
- Le job `Validation structurelle & pédagogique` est en échec à l'étape `Valider la messagerie EduDZ (schéma RLS + client + vue)`; les validations antérieures, dont le moteur IA et la syntaxe JavaScript, ont réussi. Les étapes postérieures conditionnelles ont été ignorées. Ce défaut Messenger reste hors périmètre et n'a pas été modifié.
- PR #22 vérifiée via l'API GitHub : ouverte, brouillon, non fusionnée, fusionnable ; base `main` à `034722b00739c0106cd265eefdd1c933a096217d`, tête `01a72e7ba17626f6fd2d2134bc10fe96177b6f1a`.
- Corpus réel toujours vide : 0 document, 0 chunk ; aucun PDF autorisé, OCR ou embedding documentaire réel. Le drapeau vectoriel reste désactivé par défaut.
- Aucun merge, déploiement, changement Supabase/Auth/RLS ou écriture de données.

## Lot 634 — intégrité des identifiants RAG (en validation)
- Le Worker refuse désormais le corpus si deux documents partagent le même identifiant, ou si deux chunks partagent le même identifiant. Il refuse aussi les entrées sans identifiant document/chunk exploitable.
- Motif : les IDs sont les clés de jointure entre documents, chunks et vecteurs. Une collision pourrait rendre la provenance d'un extrait ambiguë ou associer un vecteur au mauvais chunk ; le Worker échoue maintenant fermé au lieu de choisir arbitrairement.
- Tests de régression ajoutés pour collision d'ID document (dont un doublon autorisé/non autorisé) et collision d'ID chunk ; les deux attendent HTTP 503 et aucune transmission au modèle.
- Commit Worker : `172f500b27774af274785416d28231c20b6e8f5c`. Commit tests : `91bc8247e7367f7c60b88cf6399206a87ffcba84`.
- Validation CI du nouveau HEAD à attendre. Ne pas déclarer le Lot 634 validé avant le job autonome Professeur IA.
- Aucun PDF n'est ajouté au corpus ; aucune extraction OCR, indexation, génération réelle de vecteurs, modification Supabase/Auth/RLS, merge ou déploiement.
## Lot 634 — correction des fixtures et relance CI (18 novembre 2026)
- Le premier run `44334853192` a révélé trois fixtures de tests PDF qui ne respectaient pas le nouveau contrat d'identifiants obligatoires : deux jeux de chunks de recherche et le chunk du test de licence n'avaient pas d'ID stable. Le Worker répondait correctement en fail-closed (503) à ces données mal formées ; les fixtures ont été corrigées pour refléter le format attendu, sans assouplir la validation serveur.
- Commit de tests : `e5387cec29a1965fe345426d0c74ef288ecb9eb3`.
- Le même run a révélé une erreur de syntaxe préexistante dans l'assertion de `ci/check-msg.mjs:231`. L'expression de recherche du sélecteur DOM a été réécrite en template literal, sans modifier le code fonctionnel Messenger.
- Commit CI : `926483f4168824f1b4545527250e309d65092e3c`.
- La nouvelle exécution CI sur le HEAD `926483f4168824f1b4545527250e309d65092e3c` est en attente/en cours. Ne pas fusionner avant réussite des tests autonomes IA et des contrôles requis du PR.
- Corpus réel toujours vide (0 document, 0 chunk) ; aucun droit PDF confirmé. Aucun OCR, indexation, embedding réel, modification Supabase/Auth/RLS, déploiement ou fusion effectués.
### Lot 634 — état de validation après correction CI
- Sur le HEAD `e5387cec29a1965fe345426d0c74ef288ecb9eb3`, le job `Tests autonomes — Professeur IA` est vert : Worker IA/RAG 78/78, garde d'accès 14/14 et QUST 9/9. Les tests de collision d'ID document/chunk passent également.
- Le contrôle structurel du HEAD `94670492ff6ebfe0c9611c363e686d2180d8ee04` passe désormais la syntaxe JavaScript ; `ci/check-msg.mjs` reste rouge sur quatre assertions Messenger fonctionnelles (réponses asynchrones obsolètes, actions de modération, validation SQL dollar-quoting et idempotence de l'invitation). Ce périmètre n'est pas lié au Professeur IA.
- Les workflows PostgreSQL indépendants restent partiellement rouges : le test consentement Messenger échoue sur une permission de table de fixture ; le test Multaqa ne trouve pas `supabase/migrations/202611130002_multaqa_community_feed.sql`. Le workflow découverte Messenger a réussi sur le HEAD `f3880e3a...` ; son run le plus récent était encore en cours au dernier contrôle.
- Le build Cloudflare Preview du HEAD `94670492ff6ebfe0c9611c363e686d2180d8ee04` est réussi. Aucun déploiement de production n'a été effectué.
- Décision : PR #22 reste ouverte et en brouillon, non fusionnée. Les échecs hors IA ne sont ni masqués ni corrigés en modifiant Supabase/Messenger dans ce lot. `main` reste inchangée.
### Lots 635–636 — stabilisation des contrôles CI (18 novembre 2026)
- Les trois workflows PostgreSQL isolés ont tous réussi sur le HEAD `7340cf96e2560f49ddafd3d0b9422060a5c0695a` : consentement Messenger, découverte Messenger et Multaqa.
- Corrections strictement limitées aux fixtures/tests CI : droits SELECT explicites sur les tables temporaires de test consultées sous `authenticated` ; chemin du test Multaqa aligné sur le nom réel de migration `20261113201922_multaqa_community_feed.sql`.
- Le contrôle `check-msg` avait plusieurs assertions obsolètes par rapport au code actuel (ordre de garde asynchrone, sélecteur délégué, dollar-quoting `$$`, commentaire d'idempotence). Elles ont été alignées sans modifier le comportement Messenger.
- Un run global sur `7340cf96...` a encore échoué sur deux assertions de vérification scolaire qui attendaient un ancien libellé et une ancienne signature ; elles ont été corrigées dans le commit `8f36e0816cc93e3eb838710df83d76a3de50c833`. Le CI de ce HEAD est en cours/en file d'attente au moment de cette mise à jour.
- Aucun fichier de migration Supabase n'a été modifié, aucune migration n'a été exécutée sur le projet connecté, aucun déploiement ni fusion. Les seules modifications hors Worker/tests IA sont des contrôles et fixtures CI.
## Lot 634 — validation finale et stabilisation CI (18 novembre 2026)
- Lot 634 : le Worker refuse désormais les identifiants document/chunk absents ou dupliqués. Les tests vérifient qu'une collision entre documents autorisé/non autorisé ou entre chunks provoque un refus fail-closed sans appel au modèle.
- Lot 633 : l'index vectoriel n'est utilisé que si son `source_chunks_sha256` correspond au JSON chunks réellement servi ; sinon l'index périmé est ignoré et BM25 reste disponible.
- CI globale `44376445359`, HEAD `ea692ad27d0a80a2ba38f16f0d080b413d060650` : `Validation structurelle & pédagogique` = success ; `Tests autonomes — Professeur IA` = success ; trois workflows PostgreSQL isolés = success ; build Cloudflare Worker Preview = success ; Supabase Preview = skipped (aucune migration/branche Supabase créée).
- Résultats des tests IA : Worker/RAG 78/78 ; garde serveur du contenu 14/14 ; QUST/transcript Darija-Arabizi 9/9 ; contrats RAG 12/12 ; audit PDF et tests droits/licences réussis ; protections devoirs/annales et suite combinée réussies.
- Corrections de contrôles CI hors code fonctionnel : assertions Messenger alignées sur les callbacks et gardes réels ; fixtures temporaires de tests PostgreSQL corrigées ; chemin de migration Multaqa aligné sur le fichier existant ; versions CSS/SW/JS des contrôles public, Masar et gamification synchronisées avec les fichiers livrés ; vérification des six accès rapides (dont l'identité scolaire). Aucune migration SQL ni règle RLS/Auth n'a été modifiée.
- Le rapport d'audit du run `44376445359` confirme 293 PDF, 293 entrées d'inventaire, 293 chemins appariés, zéro droit confirmé, 767 pages extractibles et 406 pages sans texte extractible. Aucun PDF n'est indexé : 0 document autorisé / 0 chunk. Aucun OCR persistant ni embedding documentaire réel.
- La PR #22 est prête à être marquée Ready for review puis fusionnée si le nouveau HEAD documentaire conserve tous les contrôles verts. Le HEAD validé avant cette mise à jour est `ea692ad27d0a80a2ba38f16f0d080b413d060650`; `main` est toujours `034722b00739c0106cd265eefdd1c933a096217d`.
- Aucun déploiement de production. Le build Cloudflare est une prévisualisation de la branche. Aucune écriture Supabase, aucun changement de schéma, Auth, RLS, abonnements ou paiement.


## Fusion de la PR #22 — 18 novembre 2026
- Autorisation explicite de l'utilisateur reçue avant la fusion, après avertissement que le push sur `main` pouvait déclencher le build/déploiement Cloudflare de production.
- PR #22 passée de brouillon à prête pour revue, puis fusionnée par squash.
- Tête fusionnée : `39ae574f028f29e58c414bfff6106e3ae818156b` ; commit squash sur `main` : `24186d10a9fa9f85c0eff208ee29e94fb1600c29`.
- Vérification GitHub : PR #22 fermée avec `merged=true`, et branche `main` pointe sur le commit squash ci-dessus.
- CI post-fusion déclenchée par push : run `44390411300` (`CI — ALLEMAND`) sur le commit `24186d10a9fa9f85c0eff208ee29e94fb1600c29`. Au moment de cette note, les jobs `Validation structurelle & pédagogique` et `Tests autonomes — Professeur IA` sont encore en cours ; aucun résultat final n'est revendiqué.
- La fusion a bien eu lieu. Le déploiement Cloudflare de production n'est pas encore confirmé par un statut de déploiement vérifié ; ne pas annoncer le site en production avant confirmation.
- Les limites PDF restent inchangées : 293 PDF inventoriés, zéro droit confirmé, zéro document/chunk indexé, pas d'OCR persistant ni d'embeddings documentaires réels.
- Aucun changement de schéma, Auth, RLS, migration SQL, abonnement ou paiement n'a été introduit dans cette fusion.


## Audit de la PR #21 après fusion de la PR #22 — 18 novembre 2026
- PR #21 (ai/lot-601-worker-jwt) reste ouverte en brouillon, non fusionnée. Son HEAD est d5e36a2a2bf0f33f5b3ad4953360a9fe3aa5c9c2.
- Comparaison avec main (6547105ba95186785f348c837e58076ef8148612) : branche divergente, 107 commits en avance depuis l'ancêtre commun et 2 commits en retard ; GitHub indique mergeable=false.
- Audit des fichiers : les fonctions de la PR #21 sont déjà présentes dans main après la PR #22 : authentification JWT Supabase, envoi du Bearer par le chat et la voix, garde des cadenas avant RAG/Worker, conservation du transcript brut et de sa normalisation Darija/Arabizi, correction des accès gratuits 3AS et tests associés.
- Les fichiers de la PR #21 sont des versions anciennes par rapport à main. En particulier, son worker/ia-ask.js (13 Ko) est nettement antérieur au Worker actuel (45 Ko), qui contient les contrôles RAG supplémentaires : empreinte SHA-256 des chunks, identifiants document/chunk uniques et obligatoires, normalisation renforcée des verrous et contrôles fail-closed.
- Conclusion : ne pas fusionner la PR #21 directement. Une telle fusion risquerait de réintroduire une version antérieure du Worker et d'écraser des protections livrées par la PR #22. Commentaire d'audit publié dans la discussion de la PR #21 (18 novembre 2026). La PR #21 est considérée comme supersédée ; sa fermeture reste à décider.
- CI de la PR #21 sur son ancien HEAD : succès, mais ce résultat ne valide pas sa compatibilité avec le main actuel.
- CI post-fusion sur le commit 24186d10a9fa9f85c0eff208ee29e94fb1600c29, run 44390411300 : succès. CI après mise à jour documentaire, HEAD 6547105ba95186785f348c837e58076ef8148612, run 44390498930 : succès pour les jobs Validation structurelle & pédagogique et Tests autonomes — Professeur IA.
- Aucun changement Supabase, schéma, Auth, RLS, migration SQL, abonnement ou paiement n'a été effectué pendant cet audit.


## Clôture de la PR #21 — 18 novembre 2026
- Sur confirmation explicite de l'utilisateur, PR #21 a été fermée sans fusion (state=closed, merged=false).
- Motif : ses changements fonctionnels sont déjà intégrés dans main par la PR #22 ; la branche est ancienne et divergente. Elle ne doit pas être fusionnée telle quelle.
- Aucun code applicatif ni configuration Supabase n'a été modifié lors de cette clôture.
- CI du commit documentaire précédent `523a7720fa8f1ebfaea60ee15a44f0e7d53e93b3`, run `44392224029` : `success`.
- État courant : poursuivre les prochains lots d'intelligence directement depuis `main`, après vérification de son HEAD et des contrôles CI.


## Lot 635 — intégrité de l'ingestion documentaire et du générateur vectoriel (18 novembre 2026)
- Branche de travail : `ai/rag-corpus-integrity-lot-635`, créée depuis le HEAD `fadae5ee13fa89c47dd6a567d6db4c15df34a19c`. Aucun changement sur `main`.
- Le générateur d'embeddings échoue maintenant fermé si le corpus contient des identifiants documentaires absents/invalides ou dupliqués, des identifiants de chunks absents/dupliqués (y compris dans les documents non autorisés), ou un `document_id` absent/invalide. Les chunks non autorisés ne sont toujours jamais transmis au modèle.
- L'ingestion utilise désormais le SHA-256 complet du PDF dans l'identifiant documentaire, au lieu de tronquer à 16 caractères. Les PDF de contenu strictement identique ne créent plus de collision documentaire : le doublon est ignoré et signalé `contenu_pdf_duplique`.
- Les deux artefacts (chunks et manifeste) sont sérialisés dans des fichiers temporaires avant remplacement des fichiers actifs ; les temporaires sont nettoyés en cas d'erreur.
- Tests de régression ajoutés pour collisions d'identifiants documents/chunks, références documentaires absentes et PDF identiques. Résultats CI à confirmer sur la PR dédiée.
- Aucun embedding n'a été généré, aucun OCR n'a été exécuté, aucun droit documentaire n'a été ajouté ou présumé. Aucune modification Supabase/Auth/RLS, aucune fusion et aucun déploiement.



### Lot 636 — cohérence référentielle corpus/manifeste/chunks — 18/11/2026
- La revue du builder RAG a révélé une lacune distincte de l'intégrité des identifiants : un chunk pouvait référencer un document inexistant, et le nombre de chunks réellement présents pouvait diverger de `documents[].chunk_count` sans que le générateur d'embeddings ne le détecte.
- `eligible_chunks` valide maintenant que chaque document possède un `chunk_count` entier positif ou nul, que chaque chunk référence un document existant, et que le nombre de chunks observé correspond exactement au nombre déclaré pour chaque document.
- Ces contrôles couvrent aussi les documents non autorisés : leur contenu reste exclu des embeddings, mais leurs références et leurs comptes doivent être structurellement cohérents. Une anomalie entraîne un refus fermé avant tout appel à Cloudflare.
- Tests de régression ajoutés : document référencé inexistant, compteur de chunks divergent et compteur absent. Les fixtures déclarent désormais explicitement leurs comptes.
- Aucun PDF n'a été ingéré, aucun OCR/embedding n'a été exécuté, aucun droit n'a été présumé. Aucun changement Supabase/Auth/RLS/paiement, aucun changement de `main`, aucune fusion et aucun déploiement.
- Commits du lot : `2d872ea` (validation builder) et `2adca14` (tests). CI à revalider sur la nouvelle tête de PR #23.



### Lot 637 — alignement Worker avec les identifiants PDF SHA-256 — 18/11/2026
- La revue croisée ingestion → Worker a révélé une incompatibilité bloquante : l'ingestion du lot 635 produit désormais `pdf-` suivi des 64 caractères du SHA-256, tandis que le Worker acceptait encore uniquement 16 caractères. Les nouveaux documents ingérés auraient donc été rejetés lors d'une demande ciblée `corpus_document`.
- Le Worker accepte maintenant le format complet `pdf-[a-f0-9]{64}`. Les fixtures des tests Worker ont été migrées vers ce format, ce qui valide aussi les chemins de recherche PDF avec les identifiants réellement produits par l'ingestion.
- Le Worker vérifie désormais également que chaque chunk référence un document présent dans le manifeste, en plus de l'unicité des identifiants de document et de chunk. Un chunk orphelin déclenche un refus fermé avant transmission au modèle.
- Régression ajoutée pour un chunk orphelin. Les tests existants de collisions document/chunk et de filtrage droits sont conservés.
- Commits : `19a1f35` (Worker), `3da5506` (fixtures SHA-256), `9673597` (test chunk orphelin). CI à revalider sur la tête actuelle de PR #23.
- Aucun document n'a été ingéré, aucun embedding/OCR exécuté, aucun droit présumé, aucune modification Supabase/Auth/RLS/paiement, aucune fusion ni aucun déploiement.



### Lot 638 — propagation des identifiants PDF complets dans le client — 18/11/2026
- La CI a isolé une dernière incompatibilité de format : `ia.js` extrayait encore uniquement `pdf-[a-f0-9]{16}` des questions, alors que l'ingestion et le Worker utilisent désormais les 64 caractères SHA-256.
- Le motif de détection dans `ia.js` accepte maintenant les 64 caractères. Le test d'intégration existant, dont l'identifiant attendu avait été migré au format long, couvre ce chemin de bout en bout.
- La première exécution CI sur le lot 637 avait échoué sur ce seul test : 78/79 tests Worker passaient, y compris les nouveaux contrôles de chunks orphelins, collisions, filtrage des droits, BM25 et repli vectoriel. Le job structurel a également échoué sur le même test d'authentification qui exécute la suite Worker.
- Correction appliquée dans `ia.js`, commit `a5c1089`. Une nouvelle exécution CI sur la tête actuelle est nécessaire avant toute conclusion.
- Aucun document réel ingéré, aucun OCR/embedding exécuté, aucun droit présumé. Aucun changement Supabase/Auth/RLS/paiement, aucune fusion, aucun déploiement.



### Lot 639 — correction de la fixture de résolution PDF — 18/11/2026
- Après correction du motif dans `ia.js`, la CI a révélé que la fixture de test contenait encore un identifiant court en majuscules (`pdf-0123456789ABCDEF`) tout en attendant un identifiant long. Le code se comportait correctement en refusant cet identifiant désormais invalide ; c'était le test qui ne représentait pas le nouveau contrat.
- La question de test utilise maintenant le SHA-256 complet en majuscules, et vérifie donc à la fois la détection insensible à la casse et la normalisation en minuscules.
- Commit : `93bd96d`. Nouvelle CI déclenchée.



### Lot 640 — contrôle d'intégrité des compteurs de chunks dans le Worker — 18/11/2026
- La revue du chemin de lecture RAG a révélé que le Worker contrôlait déjà les identifiants uniques et les références documentaires, mais ne comparait pas le nombre de chunks réellement chargés avec `documents[].chunk_count`.
- Le Worker refuse maintenant le corpus avec une réponse fail-closed (`503 access-unavailable`) si un document du manifeste n'a pas un compteur entier positif ou nul, si un chunk référence un document absent, ou si le nombre réel de chunks diffère du compteur déclaré. La vérification est appliquée au manifeste complet, avant toute transmission au modèle.
- Un test de régression couvre un manifeste qui déclare deux chunks alors qu'un seul est fourni. Les fixtures de test complètent automatiquement les compteurs absents pour préserver les scénarios historiques qui ne testaient pas ce contrat.
- Commits : `1bdda02452a0d602302610a423703ff1b4b1f5eb` (Worker) et `296fd07dc2506d8329fcf9ccbb73d7de73f87f80` (tests).
- CI sur le HEAD `296fd07dc2506d8329fcf9ccbb73d7de73f87f80`, run `44399677539` : succès. Les jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont tous deux terminés avec `success`. Les trois workflows PostgreSQL isolés du même HEAD sont également terminés avec succès (runs `44399677636`, `44399677646`, `44399677638`).
- PR #23 reste ouverte en brouillon, non fusionnée ; GitHub indique `mergeable=true`, `mergeable_state=clean`. Aucun changement sur `main`, aucun déploiement.
- Aucun PDF réel n'a été ingéré, aucun OCR ni embedding documentaire n'a été exécuté, et aucun droit n'a été présumé. Aucune modification Supabase, Auth, RLS, schéma, abonnement ou paiement.


### Lot 641 — optimisation des contrôles référentiels du corpus — 18/11/2026
- La validation du manifeste et des chunks effectuait des recherches répétées dans le tableau des documents. Pour un corpus volumineux, la recherche d'un document pour chaque chunk et pour chaque compteur pouvait entraîner un coût quadratique.
- Le Worker construit désormais une table `Map` indexée par identifiant de document pendant la validation des identifiants uniques. Les contrôles de référence des chunks et de cohérence des compteurs réutilisent cette table. La logique de sécurité et le comportement fail-closed restent inchangés ; l'objectif est de ramener ces recherches à un coût moyen linéaire en fonction du nombre de documents et de chunks.
- Commit du lot : `6ce08555413fb9d4976a878f222fc91132984f90`.
- CI sur ce HEAD, run `44400539473` : succès. « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont terminés avec `success`. Les trois workflows PostgreSQL isolés sont également terminés avec succès : `44400539391`, `44400539460` et `44400539546`.
- Le PR #23 (`ai/rag-corpus-integrity-lot-635`) reste ouvert en brouillon et non fusionné ; GitHub indique `mergeable=true` et `mergeable_state=clean` au moment de cette mise à jour. Aucun déploiement n'a été effectué.
- Le travail ne signifie pas que les PDF sont intégrés au savoir pédagogique : aucun OCR ni embedding documentaire réel n'a été exécuté et aucun droit d'utilisation n'a été présumé. La génération vectorielle reste conditionnée à la validation des droits et à une exécution contrôlée. Aucune modification Supabase, Auth, RLS, schéma, abonnement ou paiement.


### Lot 642 — intégrité stricte de l’index vectoriel — 18/11/2026
- Le Worker refusait déjà les artefacts vectoriels dont la version, le modèle, les dimensions ou l’empreinte des chunks ne correspondaient pas au corpus courant. L’audit a révélé deux cas insuffisamment stricts : deux entrées pouvaient partager le même `chunk_id` et la seconde écraser la première dans la table de correspondance ; un vecteur de norme nulle pouvait aussi être accepté.
- Le Worker invalide maintenant l’index vectoriel complet si une entrée liée à un chunk autorisé a un identifiant dupliqué, une dimension incorrecte, une valeur non finie ou une norme nulle/non finie. Il vide alors la table vectorielle et conserve le classement BM25. Les entrées étrangères ou associées à des chunks non candidats restent ignorées, sans pouvoir injecter du contenu non autorisé.
- Tests de régression ajoutés : collision de `chunk_id` et vecteur de norme nulle ; les deux cas doivent laisser la recherche BM25 répondre sans appeler le modèle d’embedding.
- Commits : Worker `f5c16f4e2166297037fbd8a7538c668a69c97bf5`, tests `03b21ec0da14f90649cbe687e97d4998ea1c8040`.
- CI sur le HEAD `03b21ec0da14f90649cbe687e97d4998ea1c8040`, run `44401824398` : succès. « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont terminés avec `success`, sans étape en échec. Les trois workflows PostgreSQL isolés sont également réussis : `44401824349`, `44401824410`, `44401824405`.
- Le PR #23 reste ouvert en brouillon, non fusionné ; GitHub indique `mergeable=true`, `mergeable_state=clean`. Aucun déploiement n'a été effectué.
- Aucun PDF réel n'a été intégré au corpus pédagogique par ce lot ; aucun OCR ni embedding documentaire réel n'a été exécuté et aucun droit d'utilisation n'a été présumé. Aucune modification Supabase, Auth, RLS, schéma, abonnement ou paiement.


### Lot 643 — gestion des débordements numériques dans les embeddings — 18/11/2026
- L'audit du générateur vectoriel a identifié un cas limite : une valeur entière JSON extrêmement grande peut provoquer une exception Python `OverflowError` lors de sa conversion en flottant. Cette exception n'était pas convertie en erreur métier contrôlée et pouvait interrompre le CLI avec une trace technique.
- `normalize_embedding` intercepte maintenant `OverflowError` et `ValueError` pendant la conversion et renvoie `ValueError("embedding_valeur_invalide")`. Le flux CLI conserve ainsi son comportement d'échec contrôlé, sans écrire d'artefact incomplet.
- Test de régression ajouté avec un entier de très grande taille (`10 ** 400`).
- Commits : générateur `ccc27fc8353e86f10da82d579cd6bbecc096611c` ; test `beca71accde35ca0fdda1a46dba870af7524c88a`.
- CI sur le HEAD `beca71accde35ca0fdda1a46dba870af7524c88a`, run `44405260871` : terminé avec `success`. Les jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont réussis. Les trois workflows PostgreSQL isolés `44405260965`, `44405260915`, `44405260898` sont également réussis. Le build Worker `allemand` sur le commit documentaire `cff7833b0b32a1bd1a383c4c640eb38d5c89bbdb` est lui aussi terminé avec `success`.
- PR #23 reste ouverte en brouillon, non fusionnée. Aucun changement sur `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ni embedding réel n'a été exécuté et aucun droit documentaire n'a été présumé.


### Lot 644 — empêcher l'écrasement des sources par le générateur vectoriel — 18/11/2026
- L'audit du CLI a identifié un risque destructif de configuration : l'option `--output` pouvait désigner le même chemin que `--chunks` ou `--manifest`. En mode exécution, le générateur aurait alors remplacé le corpus source ou son manifeste par l'artefact vectoriel.
- Le CLI résout et compare les trois chemins avant toute lecture/génération et refuse les collisions avec `sortie_confondue_avec_source`. La garde s'applique aussi au dry-run et avant tout appel à Cloudflare.
- Test de régression ajouté : sortie identique au fichier chunks, code retour 1, contenu source inchangé et aucun appel API.
- Commits : garde CLI `9e7d7ee8f8776e186c0e45038272ac36497a4b20` ; test `7e4883d42567330e0867050a30a6ec4c63bbe940`.
- CI du lot 643 (HEAD `beca71accde35ca0fdda1a46dba870af7524c88a`, run `44405260871`) : succès complet. Le build Worker et les validations lancés par la mise à jour documentaire précédente ont également réussi. CI du lot 644 à confirmer.
- PR #23 reste ouverte en brouillon, non fusionnée ; aucun changement sur `main`, aucun déploiement et aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement.


### Lot 645 — refuser les associations documentaires contradictoires dans l’index vectoriel — 18/11/2026
- L'audit du chargement des vecteurs a relevé un cas subtil : une entrée portant l'identifiant d'un chunk candidat mais un `document_id` contradictoire était ignorée. Une seconde entrée portant le même chunk et le bon document pouvait ensuite être acceptée. Cela masquait une collision de provenance au lieu d'invalider l'artefact.
- Le Worker invalide maintenant l'index vectoriel complet dès qu'un chunk candidat est associé à un document différent de celui du corpus, ou qu'un identifiant candidat est dupliqué. Il conserve le repli BM25 et n'appelle pas le modèle d'embedding.
- Test de régression ajouté : une entrée contradictoire suivie d'une entrée apparemment valide pour le même chunk doit invalider l'index complet.
- Modifications limitées à `worker/ia-ask.js`, `tests/worker-ai-auth.test.mjs` et ce dossier de continuité. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucun OCR, aucun embedding réel, aucune fusion et aucun déploiement.


### Lot 646 — cohérence cryptographique entre corpus et manifeste — 18/11/2026
- L'ingestion remplace deux fichiers distincts ; une interruption entre les opérations peut laisser un état intermédiaire. Deux renommages indépendants ne constituent pas une transaction atomique.
- Le générateur calcule `chunks_sha256` sur les octets UTF-8 exacts du corpus et l'inscrit dans le manifeste avec les compteurs de documents et chunks.
- Le Worker récupère le manifeste avec le JWT, recalcule l'empreinte du corpus brut et refuse en `503 access-unavailable` si l'empreinte, la version ou les compteurs diffèrent. Un état intermédiaire n'est donc pas servi comme corpus valide. Ce contrôle fail-closed ne prétend pas rendre le système de fichiers atomique.
- Le harnais Worker génère un manifeste cohérent pour ses fixtures ; un test d'ingestion vérifie l'empreinte exacte des octets écrits.
- Aucun OCR ni embedding réel, aucun droit documentaire présumé, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement, aucune fusion et aucun déploiement.

- Correctif de sérialisation du lot : le fichier chunks est écrit depuis les mêmes octets UTF-8 que ceux utilisés pour calculer `chunks_sha256` (commit `388254b2f949768725d1198d3b51a4510eba70a1`). La sérialisation conserve le saut de ligne final ; l'empreinte couvre donc exactement le contenu publié.
- CI déclenchée sur ce commit : run `44407671878` en attente au moment de la mise à jour ; résultats à confirmer.

- Diagnostic CI intermédiaire : le run `44407613737` a détecté deux défauts dans les nouveaux changements du lot 646 : le test d'ingestion comparait une empreinte calculée sur une sérialisation différente des octets réellement écrits ; le harnais Node contenait un séparateur de ligne littéral invalide. Correctifs appliqués : sérialisation unique suivie d'une écriture binaire (commit `388254b2f949768725d1198d3b51a4510eba70a1`) et déclaration du cache de fixture sur deux lignes (commit `7158567c1d40cbdcd21fc1fedc21ebbfb83b67dd`).
- Nouvelle CI sur le commit correctif : run `44407794088` (CI — ALLEMAND) en attente ; trois workflows PostgreSQL associés sont également en cours. Ne pas déclarer le lot 646 validé avant leur résultat final.

- Test Worker supplémentaire ajouté sur la tête `a8547d0064aa65591651087bc539526a96103fad` : un manifeste dont `chunks_sha256` ne correspond pas aux octets réellement reçus doit provoquer `503 access-unavailable`, sans message envoyé au modèle ni appel Workers AI. Commit du test : `a8547d0064aa65591651087bc539526a96103fad`.
- CI complète sur ce HEAD : run `44408193841` terminé avec `success`. Les deux jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont réussis ; les tests Worker/RAG et la régression combinée sont inclus dans le job autonome. Les trois workflows PostgreSQL isolés sont également réussis : `44408193713`, `44408193691`, `44408193933`.
- Conclusion du lot 646 : intégrité cryptographique du couple corpus/manifeste couverte par tests d'ingestion et Worker, y compris le scénario de désynchronisation. Cette réussite CI valide les tests et contrôles automatisés, pas l'intégration de PDF réels ni la qualité pédagogique du RAG.
- PR #23 toujours ouverte, brouillon, non fusionnée ; aucune modification de `main`, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ou embedding réel n'a été exécuté et aucun droit documentaire n'a été présumé.


### Lot 647 — audit technique réel des PDF et réconciliation des droits — 18/11/2026
- Le workflow CI du HEAD documentaire `3ef01603c8a77347750be6ed70fbd82e84821bc1` a terminé avec succès : run `44408600341`. Les jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont tous deux `success`. Les trois workflows PostgreSQL isolés `44408600248`, `44408600107` et `44408600170` sont également `success`.
- L'audit a examiné les métadonnées techniques des PDF sans conserver ni publier leur contenu pédagogique. Réconciliation : 293 PDF détectés, 293 lignes d'inventaire, 293 chemins appariés, aucun PDF sans ligne d'inventaire et aucune ligne orpheline.
- Résultat des droits : 0/293 PDF confirmés ; 293/293 restent non confirmés ou vides. Aucun droit n'a été inféré. En conséquence, aucun de ces PDF n'est éligible à l'ingestion RAG actuellement.
- Extraction textuelle : 767 pages avec texte exploitable et 406 pages sans texte exploitable. 78 PDF sont signalés comme candidats OCR. L'OCR n'a pas été exécuté (`ocr_executed=false`) ; ces chiffres sont un diagnostic de préparation, pas une validation pédagogique.
- Le rapport CSV technique sans contenu pédagogique a été publié comme artefact CI `pdf-rights-and-readiness`, ID `14475377504`, run `44408600341` (conservation annoncée jusqu'au 02/12/2026).
- Les tests de l'ingestion PDF (14), de validation de l'inventaire des droits (15) et d'audit de préparation textuelle (10) sont réussis. Les tests Worker/RAG et les contrôles d'accès du même workflow sont également réussis.
- Conclusion opérationnelle : le pipeline d'audit et les garde-fous sont testés, mais le corpus PDF reste vide/non éligible faute de preuves de droits. La prochaine étape documentaire est la vérification humaine des licences/autorisations, PDF par PDF ; ensuite seulement, les documents admissibles pourront être extraits, et les pages sans texte pourront être traitées par OCR après autorisation.
- PR #23 reste ouverte en brouillon, non fusionnée ; aucun changement sur `main`, aucun déploiement et aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ni embedding documentaire réel n'a été exécuté.


### Lot 648 — fermeture du contournement de conjugaison locale et audit du routage d'intentions — 18/11/2026
- Défaut identifié dans `rag.js` : `verifieAccesContenuIA()` ne bloquait pas une conjugaison connue du tableau local lorsque le catalogue ne pouvait pas rattacher le verbe à une ressource pédagogique vérifiable. Le contrôle retournait alors `null`, puis `reponsePedagogique()` pouvait renvoyer le tableau local.
- Correctif : le moteur local échoue désormais de manière fermée pour les demandes de conjugaison si `ACCESS` est absent, ou si aucun rattachement pédagogique vérifiable n'est trouvé. Lorsqu'une ressource est trouvée, les contrôles d'accès existants continuent de décider selon la séance et l'entitlement. Aucun changement au Worker distant, à Supabase, Auth ou RLS.
- Test de régression ajouté dans `tests/regression_rag.mjs` : le verbe `mögen` doit rester verrouillé sans `ACCESS` et sans ressource catalogue, même s'il existe dans le tableau de conjugaison local.
- CI finale sur le HEAD `e83e4feaf47430262b3b21aa13e5f15992b20635` : run `44410678663` réussi. Validation structurelle/pédagogique et tests autonomes Professeur IA réussis. Logs : `RAG contrat : 12/12`, `RAG lock : conjugaison refusée sans ACCESS et sans ressource vérifiable`. Les trois workflows PostgreSQL isolés `44410678660`, `44410678681`, `44410678851` sont également réussis.
- Audit complémentaire du routage : `assets/bdd/intent_ontology.json` est chargé par `rag.js`, et `matchOnto()` / `ontoRoute()` sont définis, mais aucun appel à `ontoRoute()` n'existe dans le chemin `reponsePedagogique()` / `render()`. Ni `ia.js` ni `worker/ia-ask.js` ne consomment cette ontologie. Elle ne doit donc pas être considérée comme active en production.
- L'évaluation d'intentions annonce 146 exemples, 75,3 % d'exactitude d'intention et 100 % de routage de catégorie. L'inspection du jeu révèle cependant des formulations génériques identiques étiquetées pour plusieurs intentions (ex. « explique-moi ça simplement », « was bedeutet das? », « résume-moi la leçon », « donne-moi un exercice »). Ces collisions rendent l'exactitude exacte d'intention ambiguë et imposent de nettoyer le jeu d'évaluation avant de l'utiliser comme mesure de qualité.
- La fonction `ontoRoute()` contient des réponses statiques de résumé/recherche/exercices ; elle ne doit pas être activée telle quelle avant de lui appliquer les contrôles de ressources et de cadenas. Prochaine étape : concevoir un routage d'intentions réellement branché, avec détection des ambiguïtés, clarification ou repli sûr, et vérification des droits avant tout accès au contenu.
- PR #23 reste ouverte, en brouillon et non fusionnée ; aucun changement sur `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ou embedding documentaire réel n'a été exécuté.


### Lot 649 — nettoyage des collisions d’intentions et garde CI — 18/11/2026
- L’audit a confirmé 22 formulations partagées entre plusieurs intentions de l’ontologie, dont des expressions génériques françaises, allemandes et darija. Le moteur de correspondance choisissait auparavant le premier meilleur score en cas d’égalité ; ces formulations pouvaient donc orienter arbitrairement une question.
- Nettoyage de `assets/bdd/intent_ontology.json` : les formulations génériques conservées sont affectées à une seule intention sémantiquement appropriée ; les associations contradictoires sont retirées. La vérification après normalisation Unicode, ponctuation, diacritiques arabes et variantes de lettres donne 0 collision entre intentions.
- Nettoyage de `assets/bdd/intent_eval_set.json` : 43 lignes appartenant à 8 formulations répétées sous plusieurs intentions ont été exclues. Le jeu conserve 103 questions non ambiguës, couvrant les 25 intentions.
- Les anciennes métriques `75,3 %` d’exactitude d’intention et `100 %` de catégorie ont été invalidées dans `intent_eval_results.json`. Aucune nouvelle précision n’est annoncée : il n’existe pas encore d’évaluateur fidèle du routeur réel, et l’ontologie n’est toujours pas branchée au chemin de réponse.
- Nouveau test `tests/intent-ontology-integrity.test.mjs` : contrôle les collisions après normalisation arabe/Unicode, les étiquettes contradictoires, les intentions inconnues et la présence d’au moins un exemple par intention. Le test est ajouté à la CI autonome du Professeur IA.
- Vérification statique sur le commit de correction : 0 collision dans l’ontologie, 0 collision dans le jeu d’évaluation, 103 exemples pour 25 intentions. L’exécution CI du nouveau test reste à confirmer par le workflow GitHub.
- Cette étape ne branche pas encore `ontoRoute()` et n’active aucune réponse statique. Le routage en production devra ensuite gérer les scores ex aequo par abstention/clarification et faire passer chaque réponse documentaire par les vérifications de ressource et de cadenas. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucun changement sur `main`, aucune fusion et aucun déploiement.
- PR #23 reste ouverte, en brouillon et non fusionnée.

- Complément de sécurité Lot 649 : `matchOnto()` ne choisit plus le premier résultat lorsqu'au moins deux intentions atteignent le même meilleur score. Il renvoie un résultat explicitement ambigu avec la liste des candidats ; `ontoRoute()` s'abstient et ne produit aucune réponse statique dans ce cas. Le test RAG combine une question contenant deux demandes distinctes pour vérifier l'abstention, ainsi qu'une question univoque pour vérifier la conservation de l'intention. Cette protection ne branche pas encore l'ontologie au chemin utilisateur.

- Correction du test de non-régression après revue du premier CI : le classifieur était lexical dans `rag.js`, mais non exposé ; le test conditionnel pouvait donc être sauté. `window.RAG.matchOnto` expose maintenant explicitement la fonction au banc de test, et `tests/regression_rag.mjs` échoue si elle est absente. Les deux cas (égalité ambiguë et intention unique) sont désormais obligatoires. Le résultat CI précédent ne valide pas ce test de comportement ; le nouveau commit doit repasser la CI.

- Ajustement du scénario de collision : la requête de test est `هاد الدرس`, fragment réellement présent dans plusieurs formulations de l’ontologie et donnant un score de sous-chaîne identique (75) à plusieurs intentions. Le précédent scénario combinant deux demandes n’atteignait pas le seuil de confiance du classifieur et testait un non-match plutôt qu’une égalité. Le cas retenu vérifie donc bien l’abstention sur un ex aequo réel.

- Revue de surface d'API : seul `matchOnto` est exposé dans `window.RAG` pour le test du classifieur. `ontoRoute` reste privé et non appelé ; il n'est volontairement pas exposé car ses réponses pédagogiques statiques ne sont pas encore protégées par une vérification uniforme des droits et de la ressource ciblée. Aucun raccordement production n'est activé dans ce lot.


### Lot 650 — fermeture du contournement des unités entières — 18/11/2026
- L'audit de `verifieAccesContenuIA()` a montré que les séances explicites et les conjugaisons étaient contrôlées, mais qu'une requête portant sur une unité entière (ex. résumé complet d'une unité) pouvait continuer sans objet `ACCESS`.
- Le garde vérifie maintenant les demandes d'unité/séance et les règles identifiées avant toute réponse pédagogique locale. Sans `ACCESS`, ces demandes échouent fermées. Une unité complète exige un entitlement backend actif (`src === backend`), tandis qu'une séance précise passe par `canAccessLesson`. Un contrôle backend absent ou en erreur bloque également la réponse.
- Une règle grammaticale qui ne peut pas être rattachée à une ressource vérifiable est désormais refusée plutôt que renvoyée depuis le corpus local sans preuve d'accès. Les vérifications de quiz échouent également fermées si la fonction d'accès est absente.
- Le test de régression couvre : absence d'ACCESS, absence d'entitlement actif et exception de rafraîchissement backend pour `résume unité 3`. Le professeur IA distant reste accessible aux utilisateurs connectés sans abonnement pour les questions générales ; seuls les contenus pédagogiques verrouillés sont refusés.
- Aucun changement Supabase, Auth, RLS, schéma, abonnement ou paiement. Aucun changement sur `main`, aucune fusion ni déploiement. PR #23 reste ouverte et en brouillon.

- Extension Lot 650 : la garde couvre aussi une séance explicitement demandée sans unité déterminable, ainsi que le résumé de l'unité actuellement active (si le contexte de navigation la fournit). Ces cas échouent fermés en l'absence de preuve. Les tests couvrent maintenant l'unité active sans ACCESS et une séance sans unité vérifiable.

- Revue du test après insertion : suppression du retour anticipé historique qui quittait `verifieAccesContenuIA()` avant même de classifier les unités et séances lorsqu'`ACCESS` était absent. Sans cette suppression, le nouveau garde et ses tests n'auraient pas été atteints. Le flux exécute maintenant la classification de portée avant de décider le refus fail-closed.

- Précision de périmètre après vérification du Worker : `free_summary` est un type de ressource explicitement gratuit, servi par `fetchFreeSummary()`. Le garde Lot 650 ne doit donc pas bloquer les résumés gratuits déjà prévus. Il bloque les demandes d'explication pédagogique complète d'une unité (y compris depuis l'unité active), les séances sans unité vérifiable et les règles sans ressource liée. Les tests ont été ajustés pour vérifier ce périmètre : explication d'unité refusée sans preuve, sans entitlement et si le backend échoue ; le résumé gratuit n'est pas assimilé à une leçon verrouillée.

- Test complémentaire Lot 650 : le banc RAG vérifie explicitement qu'un résumé déclaré gratuit (`اشرح الوحدة 2`) n'est pas transformé en réponse verrouillée en l'absence d'ACCESS. La protection vise l'explication complète d'une unité non classée comme résumé gratuit, sans dégrader le parcours gratuit existant.


### Lot 651 — alignement du verrouillage grammatical local et Worker — 18/11/2026
- Comparaison de `LOCKED_RULES` du Worker avec `REGLES` de `rag.js` : le Worker protège plusieurs notions absentes de la liste locale (Genitiv, nominalisation, Partizip, propositions relatives, déclinaisons adjectivales, prépositions, etc.). Le navigateur pouvait donc fournir une réponse locale avant que le contrôle Worker n'intervienne.
- Ajout dans `rag.js` d'une classification des mêmes règles protégées et d'une détection de l'intention grammaticale multilingue (arabe, français, allemand, anglais, Darija/Arabizi), avec normalisation des diacritiques arabes, tatweel et variantes d'alif/ya. Une règle protégée exige maintenant un entitlement backend actif avant toute réponse locale ; sans ACCESS, sans preuve backend ou si le rafraîchissement échoue, la réponse est verrouillée.
- Les résumés `free_summary` explicitement gratuits restent exclus de cette règle de blocage, conformément au Worker et à ses tests existants.
- Tests RAG ajoutés pour Genitiv en français, nominalisation en arabe avec diacritiques, absence d'ACCESS, absence d'entitlement actif et conservation d'un résumé gratuit. La validation CI du dernier commit reste à obtenir.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion ni déploiement. PR #23 reste ouverte et en brouillon.

- Extension Lot 651 après CI : la suite existante attendait que `تمارين الوحدة 2` soit autorisé côté client, alors que le Worker le classe comme exercice d'une unité payante. Le garde local utilise maintenant `ACCESS.canAccessQuiz` pour toute demande d'exercices/évaluation rattachée à une unité. Le test distingue explicitement l'unité 1 gratuite (autorisée) de l'unité 2 payante (refusée). La banque générale gratuite sans unité reste disponible.


### Résultats de validation — Lots 650–651 — 18/11/2026
- CI complète du commit `1ba1ab5973b5c5398ec02e1fd81d45df13bd899e` : run `44415987029` terminé avec succès. Validation structurelle/pédagogique et tests autonomes Professeur IA tous réussis.
- Suite Worker IA : 84 tests réussis, 0 échec. Les tests RAG/QUST/intégration et les tests d'intégrité d'intentions ont également réussi ; les journaux confirment l'abstention sur les intentions ex aequo, la conservation des intentions uniques, le refus de conjugaison sans ACCESS/ressource et le refus d'explication d'unité sans entitlement ou si le backend échoue.
- Trois workflows PostgreSQL isolés du même commit : `44415987056`, `44415987066`, `44415986989` — tous réussis.
- Comparaison automatisée de `LOCKED_RULES` Worker et `LOCKED_RULES_IA` locale : 74 entrées de chaque côté, aucune entrée manquante ou supplémentaire.
- Les résumés `free_summary` et la banque générale gratuite restent autorisés ; les séances, règles et exercices rattachés à des ressources payantes restent soumis aux contrôles d'accès correspondants.
- Le commit de documentation qui consigne ces résultats déclenche sa propre CI ; celle-ci reste à vérifier séparément. PR #23 demeure ouverte, en brouillon et non fusionnée.


### Lot 652 — première activation sûre de l’ontologie dans le parcours réel — 18/11/2026
- `matchOnto()` était jusque-là uniquement testée comme fonction isolée ; `ontoRoute()` demeure volontairement non appelée car elle contient encore des réponses pédagogiques statiques sans contrôle uniforme des ressources.
- Activation minimale dans `reponsePedagogique()` : après le garde d'accès et avant toute réponse locale, l'ontologie est interrogée. Si le meilleur score est partagé entre plusieurs intentions, le moteur s'abstient et demande à l'élève de préciser (expliquer, résumer, exemples/exercices, unité ou séance). Aucun contenu pédagogique n'est délivré dans ce cas.
- Une intention unique ne déclenche pas cette clarification et continue dans le pipeline existant. Cette étape active donc uniquement la désambiguïsation ; elle ne branche pas encore les routes statiques de `ontoRoute()`.
- Tests de régression ajoutés sur le parcours réel : `هاد الدرس` doit produire une demande de précision ; `شرحلي هاد الدرس` ne doit pas être déclaré ambigu.
- Les contrôles d'accès Lot 650–651 restent exécutés avant l'ontologie. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion ni déploiement. CI du nouveau commit à confirmer.

- Garde anti-faux positifs Lot 652 : `matchOnto()` ignore maintenant les fragments latins de moins de quatre caractères (ex. `was`, `ich`) qui pouvaient correspondre comme sous-chaînes à de nombreuses formulations et déclencher une clarification injustifiée. Les fragments arabes restent évalués, car certains termes courts peuvent porter une intention. Test ajouté.


### Lot 653 — mesure réelle du classifieur d'intentions — 19/11/2026
- Ajout dans `tests/regression_rag.mjs` d'une évaluation des 103 exemples étiquetés de `assets/bdd/intent_eval_set.json` en appelant directement `window.RAG.matchOnto()` issue de `rag.js`. Aucun score n'est réimplémenté dans le test.
- Le rapport CI sépare les classifications correctes, erronées, les ambiguïtés (abstention volontaire) et les absences de correspondance ; il calcule la couverture, l'exactitude sur les cas classés et l'exactitude stricte sur l'ensemble. Les résultats par intention sont également consignés dans les logs CI.
- Cette mesure ne prétend pas évaluer la qualité de la réponse RAG, la sécurité des ressources, ni la compréhension sémantique hors jeu de test. Les chiffres seront reportés après exécution du CI.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion ni déploiement. PR #23 reste ouverte.

### Résultats confirmés — Lot 653 — 19/11/2026
- CI principale du HEAD `16d6274926857f4fb20fd54f7e9b028627f085c1` : run `44556644937` terminé avec succès. Les jobs « Validation structurelle & pédagogique » et « Tests autonomes — Professeur IA » sont tous deux `success`.
- Évaluation exécutée par le classifieur réel `window.RAG.matchOnto()` sur le jeu nettoyé : **103/103 corrects**, 0 erreur, 0 ambiguïté et 0 abstention ; couverture 100 %, exactitude sur les cas classés 100 %, exactitude stricte 100 %. Les 25 intentions sont représentées et chacune obtient le résultat attendu dans ce jeu.
- Ces chiffres décrivent exclusivement les 103 exemples non ambigus du jeu de test préparé. Ils ne mesurent ni les questions inédites des élèves, ni la qualité des réponses générées, ni la justesse pédagogique, ni la sécurité documentaire en conditions réelles. Les formulations génériques ambiguës ont été retirées du score exact et doivent continuer à déclencher une clarification en production.
- Régressions RAG/professeur : **84/84 tests Worker** réussis ; QUST/Darja/Arabizi **9/9** ; intégrité de l’ontologie **2/2** ; vérifications RAG/contrat et protections de cadenas réussies. Le journal confirme notamment que la recherche vectorielle reste inactive sans drapeau et n'appelle aucun embedding.
- Trois workflows PostgreSQL isolés du même HEAD sont terminés avec succès : `44556644431` (ملتقى الطلاب), `44556644706` (consentement Messenger) et `44556644596` (découverte Messenger). Ils ne constituent pas une modification du schéma ou des politiques.
- PR #23 reste ouverte, en brouillon, non fusionnée et mergeable. Aucun changement sur `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ni embedding documentaire réel n'a été exécuté.

### Lot 654 — fermeture du contournement du lecteur local de manuel et sécurisation de la route d'intentions — 19/11/2026
- Audit du parcours réel : `intentLecture()` chargeait directement `assets/bdd/buch_lN.json` pour les demandes de texte, dialogue ou vocabulaire (ex. « lis le dialogue 2 »). Ces fichiers contiennent le contenu complet d'une unité, alors que `access_config.json` ne déclare gratuites que les séances 1 et 2 de l'unité 1 ; le code de `buch.js` indique également que les Lektionen 2/3 sont réservées aux abonnés. Les formulations qui nommaient explicitement « unité/Lektion » étaient déjà interceptées, mais pas les demandes génériques « texte 2 » / « dialogue 2 ».
- Correctif dans `rag.js` : avant tout appel à `loadBuch()`, le moteur exige maintenant `ACCESS.refresh()` réussi puis un entitlement `ok === true` et `src === 'backend'`. Absence d'ACCESS, compte gratuit, exception backend ou entitlement non confirmé = refus fermé et paywall. `canAccessUnit()` n'est volontairement pas utilisé seul : il autorise l'unité 1 en raison de ses séances gratuites, alors que `buch_2as.json` contient plus que ces deux séances.
- Les deux séances gratuites restent servies par les chemins dédiés et bornés existants (Worker/RLS/artefact gratuit) ; le lecteur complet `buch_2as.json` est désormais réservé à un entitlement backend actif, même pour l'unité 1.
- Régressions ajoutées : lecture texte unité 2 sans ACCESS, dialogue unité 2 et vocabulaire unité 3 avec compte gratuit, contrôle backend en panne, puis lecture texte unité 2 avec entitlement backend actif. Le cas abonné vérifie que le contenu reste accessible après validation.
- Durcissement complémentaire de `ontoRoute()`, qui reste volontairement non appelée et non exposée : elle exécute d'abord `verifieAccesContenuIA()` et ne produit plus de réponses statiques pour les intentions de leçon, règle, comparaison grammaticale, exercice, examen ou recherche documentaire. Ces demandes reviennent au pipeline principal, seul responsable de la vérification de la ressource et des droits. Le test d'intégrité garantit que cette route ne sera ni appelée ni exposée par inadvertance.
- CI sur le HEAD `5b6fc7b5196efbaed8c4be94a8d4f5a878b0ba05` : run `44568569991` terminé avec succès. Les jobs « Validation structurelle & pédagogique » et « Tests autonomes — Professeur IA » sont tous deux `success`.
- Résultats des tests autonomes : Worker IA **84/84**, Worker de contenu du site **14/14**, QUST/Darja/Arabizi **9/9**, intégrité de l'ontologie et des routes **3/3** ; les régressions RAG/professeur et le nouveau test `RAG lock : texte/dialogue depuis buch_lN refusés sans entitlement backend` sont réussis. Le journal confirme également l'évaluation du classifieur : 103/103 sur le jeu interne non ambigu, mesure limitée à ce jeu et non assimilable à une précision générale en production.
- Trois workflows PostgreSQL isolés du même HEAD sont réussis : `44568570290` (consentement Messenger), `44568570209` (ملتقى الطلاب) et `44568569993` (découverte Messenger).
- PR #23 reste ouverte, en brouillon, non fusionnée et mergeable. Aucun changement sur `main`, aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. Aucun OCR ni embedding documentaire réel n'a été exécuté ; les PDF restent soumis à la confirmation des droits.

### Lot 655 — fermeture du contournement BIBLIO et du raccourci de traduction documentaire — 19/11/2026
- Audit du flux réel : `intentBiblio()` recherchait des pages de manuel, devoirs corrigés, grammaire, corpus, vocabulaire et explications d'unités dans les index statiques. Il pouvait restituer des extraits et statistiques depuis le Professeur IA sans appliquer la règle `paid_views: ["corpus", "biblio"]` de `access_config.json`.
- Un second chemin indépendant existait dans le formulaire RAG : `BIBLIO.traduire()` était appelé avant `reponsePedagogique()` et donc avant `verifieAccesContenuIA()`. Les traductions `curated`, `page`, `prive` et `gloss` pouvaient être rendues directement depuis le raccourci.
- Ajout de `verifieAccesBibliothequeIA()` : exige `ACCESS.refresh()` et un entitlement `ok === true`, `src === "backend"`. Absence d'ACCESS, erreur réseau/backend, compte sans abonnement ou résultat non confirmé = refus fermé.
- `intentBiblio()` vérifie ce droit avant toute lecture des statistiques ou appel à `BIBLIO.search()`; les demandes générales au Professeur IA restent disponibles, mais ne peuvent pas restituer les documents de la bibliothèque payante.
- Le raccourci de traduction conserve les traductions fournies par le corpus seulement après le même contrôle. Si le contrôle échoue, le texte documentaire n'est pas affiché et un message de verrouillage est rendu. Les traductions génériques de phrases saisies par l'élève restent dans le pipeline général, sans accès au contenu documentaire.
- Régressions ajoutées : bibliothèque sans ACCESS, compte gratuit, backend indisponible, accès abonné autorisé ; vérification que ni `BIBLIO.stats()` ni `BIBLIO.search()` ne sont appelés avant autorisation. Test structurel de l'ordre des contrôles pour la recherche, les statistiques et le raccourci de traduction.
- CI sur le HEAD `2a64060dfacb632154bf8494dc918f1c7857ca2e` : run `44572087395` terminé avec succès ; validation structurelle & pédagogique et tests autonomes Professeur IA tous deux `success`.
- Journal de régression : Worker IA **84/84**, QUST/Darja/Arabizi **9/9**, intégrité ontologie **8/8**, autres suites autonomes **5/5**, **4/4**, **1/1**, **10/10**, **1/1**, **3/3** ; RAG contrat **12/12** ; message confirmé `RAG lock : bibliothèque refusée sans entitlement backend`. Évaluation du classifieur toujours 103/103 sur le jeu interne préparé, sans généralisation à la production.
- Trois workflows PostgreSQL du même HEAD réussis : `44572087314` (consentement Messenger), `44572087420` (ملتقى الطلاب), `44572087584` (découverte Messenger).
- Audit PDF CI reconfirmé : 293 PDF analysés, 293 lignes d'inventaire appariées, 0 fichier orphelin, **0 droit confirmé / 293 droits non confirmés ou vides** ; aucune inférence de droits. Rapport technique `pdf-rights-and-readiness`, artefact CI `14554093236`. OCR et ingestion/embeddings réels non exécutés.
- PR #23 reste ouverte, en brouillon, non fusionnée et mergeable. Aucun changement sur `main`, aucun déploiement, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement.


### Lots 656–657 — intégrité des pages du manuel et refus fermé — 19/11/2026
- Lot 656 : suppression du repli automatique vers le manuel de l'autre niveau lorsqu'une page est absente du niveau demandé. Une demande 2AS ne peut donc plus récupérer par défaut la page de même numéro du manuel 3AS (et inversement). Une page absente est signalée comme non indexée pour le niveau demandé.
- Lot 657 : le moteur local ne restitue le corps d'une page que si son entrée porte explicitement `locked === false`. Une propriété `locked` absente ne vaut plus autorisation ; le comportement est fail-closed.
- Inventaire vérifié après correction : `buch_pages.json` contient 212 pages, aucun marqueur de verrouillage manquant, aucun corps sur une page verrouillée ; seules les pages 5, 6, 7, 10 et 25 sont explicitement gratuites. `buch3as_pages.json` contient 163 pages, aucun marqueur manquant, aucun corps sur une page verrouillée et aucune page explicitement gratuite.
- Régressions ajoutées : page 5 2AS (gratuite) reste lisible ; page 8 2AS (verrouillée) ne révèle pas son corps ; page 3 2AS ne renvoie pas le contenu 3AS correspondant. Les assertions structurelles vérifient l'absence de repli inter-niveaux, l'exigence `locked === false` et le message de page non indexée.
- Le premier CI a échoué sur une syntaxe invalide dans le test structurel, pas dans le moteur. Le test a été réparé sur le commit `19953866143a2a2847d66d34547ad8e7441afe5d`, puis la CI complète a été relancée.
- Validation confirmée sur ce HEAD : CI principale run `44573507037` = success ; workflows PostgreSQL isolés `44573506105` (ملتقى الطلاب), `44573506074` (découverte Messenger) et `44573506115` (consentement Messenger) = success.
- Limite : les tests vérifient les données et les chemins locaux simulés ; ils ne remplacent pas un E2E avec une session réelle sur un déploiement de cette branche. Les droits des PDF restent non confirmés (0/293) ; aucun OCR, ingestion réelle ni embedding documentaire n'a été exécuté.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte, en brouillon et non fusionnée.


### Audit complémentaire — recherche RAG autonome et routes de réponse — 19/11/2026
- Revue du chemin `🔎 اسأل المنصة` : le formulaire appelle `cherche()` directement, sans passer par le garde pédagogique `verifieAccesContenuIA()`. Cette observation imposait de vérifier la nature exacte des données accessibles avant de qualifier le chemin de fuite.
- Vérification des artefacts actuellement publiés : `assets/bdd/shards_manifest.json` annonce `nb_shards=0` et `total_chunks=0`. Le repli `assets/bdd/corpus_index.json` contient un objet `items` de vocabulaire allemand-arabe, et non le schéma de recherche attendu (`termes` + `chunks`). Dans l'état actuel, `cherche()` ne peut donc retourner aucun extrait de corpus via ce chemin ; aucun contenu documentaire verrouillé n'est exposé par les shards actuels.
- Le corpus RAG distant dédié est également vide : `corpus_rag_manifest.json` indique 0 document / 0 chunk et `corpus_rag_chunks.json` contient des listes vides. Le Worker vérifie le hash SHA-256 du fichier de chunks contre le manifeste avant toute recherche distante.
- Conclusion limitée à l'état du HEAD audité : pas de fuite démontrée via la recherche RAG autonome, mais son index legacy est incompatible avec le schéma attendu et l'interface ne dispose actuellement d'aucun shard. Il s'agit d'une fonction RAG locale inactive/incomplète, pas d'une source documentaire utilisable.
- Revue des chemins de réponse de `reponsePedagogique()` : le garde d'accès est exécuté avant les réponses locales de conjugaison, règles, bibliothèque, pages, exercices et avant le repli QUST. Les chemins serveur de pages, séances et corpus récupèrent les ressources avec le JWT et échouent fermés en cas d'indisponibilité ou de refus RLS. Aucun correctif de code n'a été appliqué sur la seule base d'un soupçon non confirmé.
- Prochaine vérification technique : tester les chemins RAG avec des données factices autorisées et verrouillées, puis ajouter une garde dédiée à la recherche autonome avant que des shards non vides ne soient publiés. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucune fusion ni déploiement.


### Lots 658–659 — verrouillage des demandes de grammaire, exemples et exercices — 19/11/2026
- Lot 658 : extension du détecteur Worker `isLockedContentQuestion()` aux formulations de demandes d'exemples et de phrases modèles sur les règles grammaticales verrouillées : allemand (`Beispiele`, `Beispielsätze`), français et arabe. Le garde reste avant tout appel au modèle et la réponse refusée n'envoie aucun contenu pédagogique au modèle.
- Lot 659 : extension du même détecteur aux demandes d'exercices, applications, tests et corrigés associés à une règle verrouillée (allemand, français, arabe). Le verrou s'applique lorsque le nom d'une règle verrouillée apparaît dans la question avec une intention pédagogique reconnue ; les questions générales ne sont pas bloquées par le seul fait de mentionner un terme grammatical.
- Régressions ajoutées dans `tests/worker-ai-auth.test.mjs` : exemples `Perfekt Beispiele`, `Perfekt Beispielsätze`, `Exemples de Perfekt`, `Genitiv example sentences`, formulations arabes ; exercices `Perfekt Übungen`, `Übungen zum Genitiv`, `Perfekt Übungsaufgaben`, `Exercices sur le Dativ`, `Perfekt test`, formulations arabes. Chaque cas vérifie le statut 403, `content-locked` et l'absence d'appel au modèle.
- La première exécution du jeu de tests a exposé un vrai défaut : le pluriel français `Exemples` n'était pas reconnu. Le détecteur a été corrigé pour reconnaître `exemple`, `exemples` et `phrase d'exemple`. La correction est sur le commit `370943fa3a5c5adf85f321b2deed9161735efdc6`.
- Validation ciblée sur ce commit : suite Worker IA = 86/86 réussis ; validation structurelle et pédagogique = success. Workflows PostgreSQL isolés Multaqa, découverte Messenger et consentement Messenger : les deux premiers success, le troisième encore en cours au moment de cette mise à jour. CI principale globale encore en cours (audit technique PDF en cours) ; ne pas déclarer le lot 659 entièrement validé avant son achèvement.
- Le commit antérieur `6f52aa4d` avait échoué uniquement sur le cas français `Exemples de Perfekt`, ce qui a permis de corriger le pluriel avant la validation du HEAD courant.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement manuel.

### Lot 660 — alignement des gardes locaux et Worker pour exemples et exercices — 19/11/2026
- Audit du garde local `rag.js` : le classifieur `demandeRegleVerrouilleeIA()` ne reconnaissait pas explicitement plusieurs formulations d'exemples, d'exercices et de pratique. Pour certaines règles non couvertes par les alias de `trouveRegle()`, une demande telle que « Nomen-Verb-Verbindungen Übungen » pouvait ne pas être refusée par le garde local en l'absence d'ACCESS.
- Extension de l'intention grammaticale locale aux exemples (FR/DE/AR), exercices, tests, pratique et feuilles de travail (Arbeitsblatt/Übungsblatt/worksheet). Extension parallèle de `exerciseRequest` pour les demandes contextualisées.
- Correction de l'interaction avec la normalisation Unicode NFD : les motifs allemands utilisent aussi les formes ASCII normalisées (`ubung`, `ubungen`, `ubungsaufgaben`, `ubungsblatt`, `beispielsatze`) puisque les accents combinatoires sont retirés avant classification.
- Régressions ajoutées à `tests/regression_rag.mjs` pour vérifier, sans ACCESS, que les formulations allemandes, anglaises et arabes associées à des règles verrouillées retournent un refus avant toute réponse pédagogique.
- Audit du Worker : ajout des mêmes intentions `Arbeitsblatt`, `Übungsblatt`, `practice` et `worksheet` au détecteur de règles verrouillées et à la classification d'évaluation. Ajout de tests directs Worker vérifiant HTTP 403 / `content-locked`, aucun contexte de résumé chargé et aucun appel au modèle.
- Contrôle de la banque générale `B_exercices` : 50 entrées (31 en 2AS, 19 en 3AS), avec seulement les champs pédagogiques et le niveau, sans identifiant d'unité/séance ni marqueur d'accès. Le Worker la traite comme banque générale libre ; les demandes explicitement rattachées à une unité ou règle verrouillée restent filtrées par le garde.
- Première CI après ajout des tests locaux : échec ciblé sur le premier cas allemand, révélant le décalage NFD/umlaut. Le motif a été corrigé et les variantes ASCII ont été ajoutées. Validation confirmée ensuite sur le commit `522079ed46bb93c11d46a1b6b17a9260b9e64700` : CI principale run `44581581060` = success ; Worker IA `87/87` ; suites complémentaires `14/14`, `9/9` et `5/5` ; validation structurelle = success ; workflows PostgreSQL `44581581047`, `44581581196`, `44581581068` = success. Le garde local a aussi passé ses cas Lot 660 sur le run `44581272312`.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte et en brouillon.

### Lot 661 — couverture des formulations « règle / phrase / tableau » — 19/11/2026
- Extension complémentaire du détecteur local et du Worker aux formulations pédagogiques courantes qui ne contiennent ni « expliquer » ni « exercice » : `rule/rules`, `Regel/Regeln`, `règle(s)`, `sentence(s)`, `Satz/Sätze`, `phrase(s)`, `Tabelle/tableau/table`, `fiche(s)`, ainsi que les équivalents arabes `جملة/جمل/جدول`.
- La règle ne se déclenche que si la question contient aussi une notion de `LOCKED_RULES` ; les demandes générales sans notion verrouillée restent hors de ce garde.
- Ajout de cas de régression local et Worker : `Perfekt Sätze`, `Genitiv rules`, `Règles du Genitiv`, `جدول Dativ`. Les tests Worker exigent un refus `403 content-locked`, aucun chargement de résumé et aucun appel au modèle.
- Validation confirmée sur le commit `6f782aac17fa9e613a76d51bd6477e56744588d4` : CI principale run `44582245595` = success ; validation structurelle = success ; job autonome Professeur IA = success ; suite Worker IA = `87/87`, `0` échec ; régressions RAG locales = success ; workflows PostgreSQL `44582245601` (découverte Messenger), `44582245658` (consentement Messenger) et `44582245710` (ملتقى الطلاب) = success. Le test Worker de Lot 660 inclut également les variantes Lot 661 et vérifie `403 content-locked`, absence de chargement de résumé et absence d'appel au modèle.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte et en brouillon.

### Lot 662 — classifier les intentions après normalisation Unicode — 19/11/2026
- Nouveau contournement trouvé pendant l'audit : `isLockedContentQuestion()` normalisait le texte pour comparer les noms de règles, mais testait encore les intentions `grammarIntent`, `assessment` et `conjugationIntent` sur le texte brut. Des caractères décomposés (umlaut allemand sous forme base + marque combinatoire, diacritiques arabes) pouvaient donc ne pas activer le garde alors que le nom de règle était reconnu après normalisation.
- Correction : les intentions sont maintenant évaluées sur `normalizedQuestion`. Les alias ASCII attendus après NFD sont pris en compte (`ubungen`, `ubungsblatt`, `beispielsatze`, `satz/saetze`, etc.) ; les alias de translittération `tamarin/tamrin` sont également reconnus. Les noms de conjugaisons verrouillées sont comparés dans la même forme normalisée.
- Tests Worker ajoutés pour les formes décomposées allemandes (`u\\u0308bungen`, `u\\u0308bungsblatt`), arabes (`تَمارِين`) et translittérées. Ils exigent le refus `403 content-locked`, aucun chargement de résumé et aucun appel au modèle.
- Commits du lot : `f39ffc3e3a592a956fdd866ad65017d061388525`, `588d4d79ad81277d263827cb73d244e69810d123`, `6db6640168e8cceb74e751a1e15e53ae610298da`, `c81a0441d7c61dfbff0f35ad4135b57795eae665`, `627edd9944465e1febcd3ecc0baf2f48c26b6fa4`.
- État de validation : le dernier commit de code du lot est `627edd9944465e1febcd3ecc0baf2f48c26b6fa4` et la mise à jour documentaire est `b8866b269c57e36e0d68d26d8375220c76a7b615`. L'API GitHub ne retourne aucun workflow Actions associé à ces HEAD (`total_count=0`) ; le seul contrôle visible pour le commit de code est Supabase Preview, marqué `skipped`. Les tests Lot 662 ne sont donc pas déclarés validés par CI. Attendre une exécution réelle avant de conclure.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte et en brouillon.


### Lot 663 — formulations naturelles d’aide sur les règles verrouillées — 19/11/2026
- Audit de l'ordre Worker confirmé : isLockedContentQuestion(q, b.resource) s'exécute avant toute récupération documentaire et avant tout appel au modèle. Les ressources free_summary, free_exercise_bank et free_unit_lesson restent des chemins explicitement bornés ; leur existence ne doit pas neutraliser la classification d'une question portant sur une règle verrouillée.
- Contournement identifié : les formulations naturelles « Can you help me with Perfekt? », « Hilf mir bitte mit Genitiv », « Kannst du mir Perfekt erklären? », « Aide-moi avec le Dativ » et « علمني Perfekt » ne contenaient pas toujours les marqueurs d'intention déjà reconnus. Avec un sélecteur gratuit fourni par le client, le garde pouvait donc ne pas demander l'entitlement.
- Correction Worker : extension de grammarIntent aux verbes et formulations d'aide/apprentissage (help, teach, show, hilf, hilfe, erklär, erklar, bitte, aide, apprends, علمني, علّمني, تعلم). La correspondance reste conditionnée à la présence d'une notion de LOCKED_RULES ; les questions générales sans notion verrouillée ne sont pas bloquées par ces mots seuls.
- Tests Worker ajoutés pour huit formulations en anglais, allemand, français et arabe, avec les deux sélecteurs gratuits free_summary et free_exercise_bank. Chaque combinaison exige HTTP 403 / content-locked, aucun contexte envoyé au modèle, zéro appel modèle et aucune lecture des fichiers de résumé ou de banque générale.
- Commits : Worker c64e17b0568fc87cdc6672894b2d2da4d18b2a4c ; tests c86943c20c002da56bae65d6d80cac8817ebc662.
- Validation CI Lot 663 : le workflow principal 44587904122 sur c86943c20c002da56bae65d6d80cac8817ebc662 a été annulé (cancelled) lors de l'actualisation suivante de la branche ; aucun résultat de tests Worker n'est donc disponible pour ce lot. Ne pas interpréter cette annulation comme un succès ni comme un échec des tests.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de main, aucune fusion et aucun déploiement. PR #23 reste ouverte et en brouillon.


### Lot 664 — un sélecteur gratuit ne prouve pas l'accès à une séance — 19/11/2026
- Audit complémentaire du garde Worker : la condition historique laissait passer toute mention de séance 1 ou 2 dès qu'un objet resource quelconque était présent. Cela pouvait laisser une demande telle que « Explain Perfekt in lesson 1 » atteindre le modèle avec un sélecteur free_summary ou free_exercise_bank, alors que ces sélecteurs ne prouvent aucun droit sur une séance.
- Correction : les ressources free_summary et free_exercise_bank ne peuvent plus neutraliser une demande explicitement rattachée à une séance numérotée. Le contrôle d'abonnement est alors exécuté avant le chargement du résumé ou de la banque. Les séances gratuites 3AS 1–2 restent sur leur sélecteur dédié free_unit_lesson, strictement limité à l'unité 1 et aux séances 1–2 ; les ressources book_page/book_pages et unit_lesson continuent de suivre leurs contrôles RLS existants.
- Régressions ajoutées : une demande de règle verrouillée formulée comme « Explain Perfekt in lesson 1 » avec free_summary et « Genitiv exercises lesson 1 » avec free_exercise_bank doit être refusée pour un compte sans abonnement, avant toute lecture documentaire et tout appel au modèle.
- Commit Worker : 8fe05acd7497b20919e964b8bdd44ba45fa12df0. Les tests de ce lot sont ajoutés ensuite dans le commit de tests final pour déclencher une CI sur un HEAD complet.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de main, aucune fusion et aucun déploiement. PR #23 reste ouverte et en brouillon.


### État CI consolidé après Lots 663–664 — 19/11/2026
- HEAD code/tests : 1beae9104d3c557139398e3cae6038964d7b8351. Les trois workflows PostgreSQL isolés liés à ce HEAD sont terminés success : Multaqa (44588250950), découverte Messenger (44588250916) et consentement Messenger (44588250853).
- Le contrôle Supabase Preview est skipped (branche non associée à un Supabase Branch). Il ne constitue pas un test applicatif.
- Le workflow principal CI — ALLEMAND du HEAD 1beae9104d3c557139398e3cae6038964d7b8351 a été créé sous le run 44588250861 puis annulé (cancelled) avant de produire des jobs. Le run précédent 44587904122 est également cancelled. Les tests Worker des Lots 663 et 664 ne sont donc pas déclarés validés.
- PR #23 est toujours ouverte, en brouillon et non fusionnée. Aucun déploiement n'a été effectué ; aucune modification de main ou de Supabase/Auth/RLS/schéma/abonnement/paiement.

### Validation complète Lots 663–664 — CI du 19/11/2026
- HEAD testé : adc2e15af53e5d81072b2f000dfe7148293fee1e ; workflow principal CI — ALLEMAND 44588593390 terminé SUCCESS. Jobs Tests autonomes — Professeur IA et Validation structurelle & pédagogique tous deux SUCCESS. Build Cloudflare Workers Workers Builds: allemand également SUCCESS. Supabase Preview SKIPPED, sans modification ni opération Supabase.
- Tests Worker : tests/worker-ai-auth.test.mjs 89 tests, tous réussis. Les nouveaux cas Lot 663 (formulations naturelles en anglais, allemand, français et arabe avec sélecteurs gratuits) et Lot 664 (sélecteur de résumé/banque gratuite ne pouvant pas déverrouiller une séance numérotée) apparaissent explicitement dans le journal et passent.
- Protection de contenu serveur : tests/site-worker-content-guard.test.mjs 14 tests, tous réussis. QUST/Darija/Arabizi : 9 tests, zéro échec. Intégrité ontologie : 5 tests, tous réussis. Évaluation du classifieur sur 103 exemples : 103 corrects, 0 faux, 0 ambigu, couverture 100 %, exactitude 100 %. Contrat RAG : 12/12 questions.
- Contrôles PostgreSQL isolés sur le même HEAD : Multaqa (44588593252), découverte Messenger (44588593506) et consentement Messenger (44588593324) tous terminés SUCCESS.
- Audit PDF : 293 PDF, 1 173 pages ; 767 pages avec texte extractible, 406 sans texte ; 186 fichiers extractibles, 28 mixtes, 78 candidats OCR et 1 chiffré. Les 293 chemins sont rapprochés de l'inventaire sans orphelin. Droits confirmés : 0/293 ; OCR non exécuté ; texte extrait non sauvegardé ; aucun document indexé dans le RAG. Artefact CSV pdf-rights-and-readiness, ID 14562116496.
- Conclusion : Lots 663–664 techniquement validés par CI. Cela ne signifie pas que le corpus PDF est disponible au Professeur IA : les droits ne sont confirmés pour aucun PDF et l'index RAG PDF reste vide. Aucun OCR ni ingestion réelle n'a été lancé.
- Fusion : PR #23 reste ouverte, brouillon et non fusionnée. La fusion n'interviendra qu'après audit final de la PR et confirmation explicite de l'utilisateur. Aucun déploiement, aucune modification de main ni de Supabase/Auth/RLS/schéma/abonnement/paiement.
### Lot 665 — normalisation des marqueurs de séance et d'unité — 19/11/2026
- Audit du garde Worker : les noms de règles et les marqueurs d'intention étaient normalisés, mais les expressions de détection de séance/unité étaient encore appliquées au texte brut. Les accents décomposés et diacritiques arabes pouvaient empêcher la détection de « leçon 3 », « séance 3 », « الحِصّة 3 » ou « الوِحدة 2 ».
- Correction : unitMatch et lessonMatch utilisent désormais normalizedQuestion. Les variantes françaises désaccentuées lecon/seance sont explicitement reconnues après normalisation ; les marqueurs arabes sont reconnus après retrait des diacritiques et du tatweel.
- Régressions ajoutées : quatre variantes accentuées/décomposées (français et arabe) exigent 403 content-locked, aucun contexte envoyé au modèle et zéro appel modèle.
- Commits : Worker f68912cffca227546342c02ee897de3efab2f2dc ; tests 883bd977f15110e4c8c5240b1c1ed1c45de6f35b.
- Validation : workflow principal 44591681987 sur le HEAD 883bd977f15110e4c8c5240b1c1ed1c45de6f35b est pending au moment de cette note ; tests non déclarés validés avant la fin du workflow.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucune modification de main, aucune fusion, aucun déploiement. PR #23 reste ouverte et en brouillon.


### Lot 666 — fermeture du repli RAG documentaire local — 19/11/2026
- L'audit du parcours `🔎 اسأل المنصة` confirme que les questions passent d'abord par `reponsePedagogique()`, puis, si aucune réponse pédagogique n'est produite, le formulaire appelait directement `cherche(q)` dans les shards statiques du navigateur.
- Ce chemin local ne vérifie ni les droits du document ni son entitlement et ne peut pas s'appuyer sur le contrôle serveur du Worker. Le fait que les shards soient actuellement vides réduit le risque présent, mais ne constitue pas une protection durable si des chunks sont publiés ultérieurement.
- Correctif : `cherche()` s'abstient désormais systématiquement. Le formulaire RAG affiche une indisponibilité documentaire explicite au lieu de lire un shard local. La recherche PDF doit passer exclusivement par le Worker authentifié, qui valide le manifeste, `rights_confirmed === true` et une licence autorisée avant de transmettre un extrait au modèle.
- Une régression a été ajoutée dans `tests/regression_rag.mjs` : elle fournit une fixture de shard contenant volontairement un extrait marqué non autorisé et exige que la recherche locale s'abstienne.
- Commits Lot 666 : `b4041336f430d5a38344c6c51710db6870f5a797` (fermeture du chemin local) et `7370a4c6761f9875e94d96be55e942b463c0b3de` (test de régression).
- CI du HEAD `7370a4c6761f9875e94d96be55e942b463c0b3de` : workflow principal `44593318470` et trois workflows PostgreSQL `44593318529`, `44593318537`, `44593318548` lancés et encore `in_progress` au moment de cette note. Aucun test du Lot 666 n'est déclaré réussi avant la fin du workflow principal.
- Limite fonctionnelle assumée : la recherche RAG documentaire dans l'interface est temporairement désactivée tant que son raccordement au Worker authentifié n'est pas réalisé. Le Worker possède déjà un chemin `corpus_search` avec contrôle de licence/droits ; le prochain lot devra raccorder l'interface à ce chemin sans réintroduire de lecture statique locale.
- Corpus PDF : les droits restent à confirmer (0/293 selon le dernier audit), OCR non exécuté et indexation/embeddings réels toujours absents. Aucun document n'est autorisé par défaut.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte, en brouillon et non fusionnée.


### Lot 667 — raccordement de l'interface RAG au cerveau IA central — 19/11/2026
- L'audit du parcours de recherche a confirmé que le Worker possédait déjà le traitement serveur `corpus_search` / `corpus_document` : authentification JWT Supabase, lecture du corpus et de son manifeste, vérification SHA-256, intégrité documents/chunks, filtre `rights_confirmed === true` et licences autorisées, classement lexical BM25 ; le classement vectoriel reste facultatif et désactivé par défaut.
- Le défaut se situait dans l'interface `rag.js` : après abstention du moteur local, elle affichait un message d'indisponibilité sans appeler `window.reponseIA`. Le Worker sécurisé existait donc, mais le formulaire `اسأل المنصة` ne lui transmettait pas les recherches documentaires.
- Correctif : en cas d'absence de réponse locale, le formulaire délègue maintenant à `window.reponseIA(q, {source:'rag-interface'})`. `ia.js` détecte les demandes `corpus_search` ou `corpus_document`, récupère la session Supabase et transmet le JWT au Worker `/ask`. Aucun extrait ni shard PDF n'est chargé dans le navigateur.
- La réponse du cerveau est affichée comme texte échappé, avec un message d'abstention si aucun extrait autorisé ne peut être récupéré. Le libellé de l'écran a été corrigé : il ne prétend plus que chaque réponse provient toujours d'un extrait du corpus ni que les shards sont chargés côté client.
- Régression ajoutée dans `tests/regression_rag.mjs` : simule une question PDF, vérifie qu'elle est transmise à `reponseIA`, et vérifie qu'une réponse contenant du HTML est affichée sans exécution de balises.
- Commits Lot 667 : `5edd2afb` (raccordement initial), `3b204923` (libellés et commentaire cohérents), `d2e5a142` (test de raccordement et échappement).
- État de validation au moment de cette note : le HEAD de la PR est `d2e5a142582e8eb6cff91ff91e99cc8815d8ac33`. Les workflows associés à ce HEAD ne sont pas encore remontés par l'API GitHub ; les workflows précédents ne valident pas ce nouveau test. Ne pas déclarer le Lot 667 validé avant une CI verte sur ce HEAD.
- Le raccordement n'active pas l'ingestion des PDF : inventaire précédent toujours 293 PDF, droits confirmés 0/293, indexation réelle 0, OCR réel non exécuté, vecteurs réels 0. Le Worker renverra une abstention si aucun document admissible n'est publié.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun changement de `main`, aucune fusion et aucun déploiement. PR #23 reste ouverte, en brouillon et non fusionnée.


### Lot 668 — qualité d'extraction et traçabilité des pages — 19/11/2026
- Vérification préalable : CI principale du HEAD `1a5f621fb3440268eced7e2e45110825f75853b7` terminée SUCCESS ; jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » SUCCESS. Les trois workflows PostgreSQL associés au même HEAD sont SUCCESS.
- Audit de `tools/ingest_corpus_rag.py` : la qualité de page contrôlait déjà la longueur, les caractères de contrôle et les glyphes PDF bruts, mais ne rejetait pas explicitement le caractère de remplacement Unicode U+FFFD ni plusieurs signatures courantes de mojibake. En cas d'extraction partielle, les pages écartées n'étaient pas détaillées dans les métadonnées du document.
- Correctif : contrôle explicite de U+FFFD, des caractères Unicode de zone privée et de signatures de mojibake ; ajout de `extract_pdf_report` qui conserve l'API historique `extract_pdf` tout en fournissant nombre de pages, pages indexées, pages omises, motif qualité par page et indicateur d'OCR réellement tenté. Ces données sont enregistrées dans les métadonnées des documents ; les PDF entièrement inexploitable conservent aussi leur rapport dans la liste des éléments ignorés.
- Tests ajoutés : rejet U+FFFD/mojibake et rapport de pages mixtes avec numéros de page et motifs. Aucun OCR n'a été exécuté pendant ce lot ; l'indicateur `ocr_attempted` n'est renseigné à true que si l'option OCR est explicitement utilisée par l'outil.
- Portée inchangée : seuls les PDF confirmés dans l'inventaire central et le fichier compagnon cohérent peuvent être traités ; aucun droit n'est présumé. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucun changement de `main`, aucune fusion et aucun déploiement.
- CI du nouveau HEAD : en attente de déclenchement/fin d'exécution ; ne pas déclarer le Lot 668 validé avant succès sur le commit qui contient le code et les tests.

- Correctif de test en cours de lot : la première CI du Lot 668 a révélé que le contrôle U+FFFD contenait un antislash littéral supplémentaire ; deux tests ont donc échoué sur le commit intermédiaire `690591ab29d45d3a62dcda68032427d5523f95ff`. Le contrôle a été corrigé dans `43fa16e20a1962720a96f03c6ec54f63c423d389`. Cette première CI est explicitement considérée comme FAILURE, et non comme validation. Une nouvelle CI sur le HEAD corrigé est requise.


### Lot 669 — validation stricte des références de page RAG — 19/11/2026
- Après validation CI du Lot 668, audit de bout en bout du Worker RAG : le manifeste vérifiait le SHA-256, les nombres de documents/chunks, les IDs uniques, les références documentaires et les comptes de chunks. En revanche, le schéma de chaque chunk ne vérifiait pas explicitement le numéro de page ni la nature/longueur du texte ; le Worker convertissait ensuite la page avec `Number(...)` pour l'afficher dans les références.
- Correctif : chaque chunk doit maintenant porter une page entière strictement positive, un texte non vide de type chaîne et de longueur maximale 20 000 caractères. Si le document fournit `page_count`, la page du chunk ne peut pas le dépasser. Le champ optionnel `part`, lorsqu'il existe, doit être un entier positif ou nul. Tout artefact incohérent est refusé en mode fermé avant le classement et l'appel au modèle.
- Tests Worker ajoutés pour page nulle, négative, décimale, chaîne, dépassement de page_count, texte vide et chunk dépassant la limite ; chaque cas exige HTTP 503 et aucun message transmis au modèle.
- Portée : validation de cohérence/provenance des extraits, sans modifier l'algorithme de classement, l'accès général au Professeur IA ni les contrôles de droits/abonnement. Aucun OCR ni ingestion PDF réelle. Aucun changement Supabase/Auth/RLS/schéma/paiement, aucune modification de main, aucune fusion, aucun déploiement.
- CI du HEAD contenant ce lot : à vérifier avant de déclarer le Lot 669 validé.

- Précision ajoutée pendant la revue du Lot 669 : un `page_count` présent mais mal typé (ex. chaîne) ou inférieur à 1 est lui-même invalide et ne doit pas désactiver la comparaison. Le Worker exige maintenant un entier strictement positif dès que le champ est fourni ; deux cas de test supplémentaires couvrent zéro et chaîne. La CI précédente est à considérer comme obsolète pour ce HEAD modifié ; validation à refaire sur le commit final.

- Relecture des fixtures : correction de la construction du cas `page_count: 0` afin que la valeur zéro soit bien transmise au Worker (test conditionnel sur la présence de propriété, et non sur sa vérité). Ce test vérifie désormais réellement le rejet du zéro. Le commit précédent reste non final pour la validation ; attendre la CI du dernier HEAD.


### Validation finale du Lot 669 — 19/11/2026
- HEAD validé : `ed56ab7397b08fb57972bb4538f27295aef04b2d`.
- CI principale `44598579361` : SUCCESS. Les jobs « Tests autonomes — Professeur IA » et « Validation structurelle & pédagogique » sont SUCCESS.
- Workflows PostgreSQL sur le même HEAD : `44598579117` (ملتقى الطلاب), `44598578863` (découverte Messenger) et `44598578941` (consentement Messenger) : SUCCESS tous les trois.
- Le Lot 669 est donc validé sur son HEAD final. Aucun changement de périmètre : pas de fusion, pas de déploiement, pas de modification de `main`, Supabase, Auth, RLS, schéma ou paiement.

### Lot 670 — verrouillage de non-régression de l’accès général au Professeur IA — 19/11/2026
- Audit ciblé du handler `/ask` et des tests d’authentification : une question générale d’un utilisateur authentifié sans ressource pédagogique doit parvenir au modèle sans déclencher de contrôle d’abonnement. Les contenus identifiés comme verrouillés continuent, eux, à passer par le garde d’accès et le contrôle d’abonnement.
- Le comportement était déjà implémenté dans le Worker et couvert partiellement par le test « accepte un utilisateur Auth valide mais ne transmet aucun contexte client au modèle ». Le test est renforcé pour affirmer explicitement qu’aucune lecture de `subscriptions` n’est effectuée et qu’un appel au modèle a bien lieu pour cette question générale.
- Aucun changement de logique Worker, d’accès aux contenus, de configuration Supabase ou de droits n’est introduit dans ce lot ; il s’agit d’une protection de non-régression du contrat d’accès demandé.
- Commit du test : `1161ae004e3b493d2c2daad7ccb985d5be4d8786`. CI de ce nouveau HEAD à vérifier avant validation du Lot 670.
- Rappel permanent : le Professeur IA général est accessible à tout utilisateur authentifié, avec ou sans abonnement ; les contenus pédagogiques verrouillés restent soumis à leurs contrôles dédiés. Aucun OCR, aucune ingestion réelle de PDF sans droits confirmés.


### Lot 671 — rejet des en-têtes CSV ambigus dans l’inventaire des droits — 19/11/2026
- Audit complémentaire des deux chemins qui consomment l’inventaire humain : `tools/validate_pdf_rights_inventory.py` et `tools/ingest_corpus_rag.py`.
- Défaut identifié : `csv.DictReader` accepte des noms de colonnes dupliqués et conserve silencieusement une seule valeur pour la clé répétée. Un CSV pouvait donc afficher deux colonnes `rights_confirmed` contradictoires, tandis que le programme n'en lisait qu'une. Pour une preuve de droits, une telle ambiguïté doit être bloquante.
- Correctif : le validateur retourne désormais une erreur `entetes_csv_dupliquees` avant toute approbation ; le chargeur d'ingestion lève `entetes_inventaire_droits_dupliquees` avant toute écriture d'artefact. Les colonnes requises et les contrôles précédents restent inchangés.
- Régressions ajoutées dans `tests/test_validate_pdf_rights_inventory.py` et `tests/test_ingest_corpus_rag.py`, avec deux colonnes `rights_confirmed` contradictoires. Le test d'ingestion vérifie qu'aucun artefact n'est écrit.
- Commits du Lot 671 : `9913fe809629b7f7cb46640914e4280064beb962`, `1bc5386d188491902ac9f7d53883f55916c000b4`, `5a3e350c6ce9068d11945879ccf9a47ab02ec747`, `759aed4357684bd48439a4d0d5f84ee1001f5fcd`.
- Les lots 670 et 671 doivent être considérés comme non validés tant que la CI complète du HEAD qui les contient n'est pas terminée avec succès.
- Aucun PDF n'a été OCRisé ou indexé ; aucune ligne de droits n'a été confirmée par ce lot. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucune modification de `main`, aucune fusion et aucun déploiement.


- Correction de fixture du Lot 671 : la première écriture des deux CSV de test contenait un antislash supplémentaire avant le séparateur de ligne, ce qui empêchait de tester réellement les en-têtes dupliqués. Les deux fixtures ont été corrigées pour écrire de vraies lignes CSV distinctes dans `e64bac55633df4c5ab026caf26d30b8690ef948f` et `b05f08de2d4f0ca943cb10e4206f31f2a3feb179`. Les validations antérieures ne couvrent pas ces corrections ; attendre la CI du HEAD final.


### Lot 672 — vérifier l’empreinte du corpus avant les embeddings Cloudflare — 19/11/2026
- Audit de `tools/build_corpus_rag_vectors.py` : le générateur vérifiait les comptes document/chunk et les droits déclarés, puis calculait l'empreinte du corpus pour l'artefact vectoriel. Il ne comparait toutefois pas cette empreinte au champ `chunks_sha256` du manifeste avant de lancer les appels d'embedding.
- Risque : un manifeste périmé ou incohérent pouvait déclencher des appels Workers AI potentiellement facturables pour produire un index qui serait ensuite rejeté par le Worker RAG en production.
- Correctif : le mode CLI, y compris le dry-run, exige désormais un `chunks_sha256` présent et strictement égal au SHA-256 des octets du corpus. Le refus intervient avant toute demande Cloudflare et avant l'écriture de l'artefact.
- Test ajouté : manifeste à empreinte erronée avec `--execute` et confirmation explicite de facturation ; l'appel Cloudflare est simulé et doit rester absent, le code doit échouer et aucun fichier de vecteurs ne doit être créé. Le test de dry-run fournit désormais un manifeste cohérent.
- Commits : `72a4de7278ba0fb3d21039b5883b9f3d282dca12` (outil), `1f625ce4519f0fe2da7d60bdb8e9d7a855954a51` (test).
- Le Lot 672 et les corrections finales des fixtures 671 doivent être validés par la CI du nouveau HEAD avant clôture. Aucun embedding réel ni appel Cloudflare n'a été effectué par ce lot.
- Rappel : aucune ingestion PDF, aucun OCR ni vectorisation réelle sans droits confirmés. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucune modification de `main`, aucune fusion et aucun déploiement.


- Durcissement complémentaire du Lot 672 : le garde d'empreinte vérifie d'abord que le manifeste JSON est bien un objet avant d'accéder à ses champs. Un manifeste JSON valide mais de type tableau est refusé proprement avec le code d'erreur contrôlé du CLI, sans appel API ni écriture. Test ajouté. Commits : `b7c896a12b891650d440919b7a3d0876301c0d62` et `c0adadaec9be3bfe519943602df90201fe9498d8`. La CI précédente du Lot 672 ne couvre pas ce durcissement ; attendre celle du HEAD mis à jour.


- Portée interne du Lot 672 renforcée : le contrôle de hash est également appliqué dans `build_artifact()`, et pas seulement dans le CLI. Un appel direct à l'API Python ne peut donc pas contourner la vérification avant le callback d'embedding. Le test vérifie que le callback n'est jamais appelé si le manifeste ne correspond pas aux octets du corpus. Commits : `88ab7e266b39447f0634087819da02b76f728c4f` et `a08993ca75559dfdc865b98e3b4993191b5c6fbf`. Attendre la CI finale.


- Résultat de la première CI du Lot 672 sur `9c2b014a8f23fb96ae0d52fcd14b2a935738906c` : FAILURE dans un seul test. Le manifeste `[]` était correctement rejeté, mais le helper renvoyait `manifest_chunks_sha256_invalide` alors que le test attendait le code de schéma `manifest_json_invalide`. Les suites ingestion PDF (17 tests), inventaire des droits (16 tests) et audit de disponibilité PDF (11 tests) étaient vertes ; la suite vector builder avait uniquement cette assertion divergente.
- Correction : `validate_manifest_chunks_hash` distingue maintenant explicitement un manifeste qui n'est pas un objet JSON (`manifest_json_invalide`) d'un manifeste objet dont l'empreinte manque ou diffère (`manifest_chunks_sha256_invalide`). Commit : `7ca838595597f30522c090fc1be1113330a032dc`. Cette CI FAILURE est conservée dans l'historique et n'est pas comptée comme validation.


### Lot 673 — lier les vecteurs aux chunks approuvés et valider leur provenance — 19/11/2026
- Audit de l'API Python `build_artifact()` : le contrôle SHA-256 du manifeste était nécessaire, mais un appelant interne pouvait encore fournir une liste `chunks` arbitraire différente du corpus dont le hash était valide. Le CLI passait la liste filtrée, mais la fonction publique ne garantissait pas elle-même ce lien.
- Correctif : `build_artifact()` relit les octets du corpus, vérifie le manifeste et recalcule la liste exacte des chunks admissibles avec `eligible_chunks()`. Toute liste fournie qui diffère de cette liste est refusée avant l'appel du callback d'embedding.
- Alignement des validations de métadonnées sur le Worker RAG : page entière >= 1, page ne dépassant pas `page_count` lorsqu'il est présent, `page_count` valide, `part` entier >= 0 lorsqu'il est fourni, texte non vide et <= 20 000 caractères.
- Tests ajoutés : appel direct avec un chunk provenant d'un document dont les droits ne sont pas confirmés (callback jamais appelé), pages nulles/hors document, partie négative et texte trop long. Le test de construction nominale utilise maintenant un corpus et un manifeste cohérents.
- Commits : `453782805d757befe153e8c2ba9053496d4f5995`, `8f442a537dbd4e8ba66e55136319615312270368`, `19d6974a11ea516f39bf023a77fb9641279c04e4`, `0c6ca6f3ca375afcfa8af3b9440a4206491d88e4`.
- Ce lot doit être validé par la CI complète du HEAD courant. Aucun appel Cloudflare, aucun embedding réel, aucun OCR et aucune ingestion de PDF n'ont été exécutés.
- Les lots précédents restent inchangés : Professeur IA général accessible à tout utilisateur authentifié ; ressources verrouillées toujours protégées. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement, aucune modification de `main`, aucune fusion et aucun déploiement.


- Première CI du Lot 673 sur le commit intermédiaire `8f442a537dbd4e8ba66e55136319615312270368` : échec d'une assertion de test uniquement. Le test nominal comparait encore `source_chunks_sha256` au hash de l'ancien fixture `b"chunks"`, alors qu'il utilise maintenant les octets JSON réels du corpus pour satisfaire le nouveau contrôle de provenance. Les autres tests de la suite vector builder, les 17 tests d'ingestion, les 16 tests de droits et les 11 tests d'audit PDF ont réussi.
- Correction de l'assertion pour comparer avec `chunks_bytes` : commit `2888472bb0b5d44420e0f212b46125ba5465c8e3`. Cet échec intermédiaire est conservé dans le suivi et n'est pas compté comme validation. Attendre la CI du HEAD final `2f768c0b1754946e7215353b0c8675da893b2e1f` ou de son successeur.

## Lot 674 — rejet des clés JSON dupliquées dans les entrées RAG

- Risque identifié : le parseur JSON standard de Python accepte les clés dupliquées dans un même objet et conserve silencieusement la dernière valeur. Un fichier de métadonnées pouvait donc contenir deux valeurs contradictoires pour `droits_confirmes` ou `license`, tandis qu'un manifeste pouvait présenter des champs de contrôle ambigus.
- `tools/build_corpus_rag_vectors.py` utilise maintenant un parseur strict avec `object_pairs_hook` : toute clé répétée, y compris dans un objet imbriqué, provoque un refus explicite `cle_json_duplique:<clé>`. Ce contrôle s'applique au corpus et au manifeste, en CLI comme dans `build_artifact()`.
- `tools/ingest_corpus_rag.py` applique le même principe aux fichiers compagnons JSON. Une métadonnée ambiguë est traitée comme absente/invalide et ne peut jamais autoriser l'indexation.
- `worker/ia-ask.js` vérifie également les clés uniques avant de décoder les artefacts statiques du RAG (corpus, manifeste, vecteurs), les autres JSON pédagogiques servis côté Worker et le corps JSON de la requête `/ask`. Une requête contenant deux valeurs pour la même clé est refusée en `400 invalid-json` après validation du JWT mais avant tout appel au modèle ; les artefacts ambigus sont refusés dans le chemin d'erreur fermé du Worker.
- Tests ajoutés : doublon de `chunks_sha256` dans le manifeste avant callback d'embedding, doublon imbriqué de `rights_confirmed`, et refus d'un compagnon PDF présentant deux valeurs contradictoires.
- Aucun OCR, aucune ingestion réelle, aucun embedding, aucun appel Cloudflare et aucune modification Supabase n'ont été exécutés.
- Validation CI du code et des tests sur le commit `c59819c1e02728482a85b1a9bb1ccb6b196b6411` : CI principale et les trois workflows PostgreSQL réussis. Le contrôle structurel/pédagogique et les tests autonomes du Professeur IA ont également réussi.

- Extension du lot après le premier passage CI vert : le parseur strict est maintenant appliqué aussi au JSON entrant `/ask`, avec un test garantissant le refus après Auth JWT et avant le modèle. Une nouvelle validation CI est en cours sur le HEAD actualisé.

## Lot 675 — intégrité complète de l'index vectoriel côté Worker

- Audit du chemin de recherche hybride : l'index vectoriel était déjà lié au SHA-256 du corpus de chunks, mais pas au SHA-256 du manifeste qui accompagne ce corpus.
- Le Worker calcule maintenant aussi le hash exact des octets du manifeste reçu et exige que `source_manifest_sha256` corresponde à ce manifeste.
- Le Worker exige le modèle attendu, 256 dimensions et la normalisation `l2`, en cohérence avec le générateur.
- Un index vectoriel n'est désormais utilisé que si chaque chunk actuellement autorisé possède exactement un vecteur valide (document propriétaire identique, 256 valeurs finies, norme non nulle). Les entrées étrangères restent exclues ; les doublons, rattachements contradictoires, vecteurs invalides ou couverture partielle désactivent l'index complet et déclenchent le repli BM25.
- Tests ajoutés : manifeste source contradictoire et index incomplet doivent éviter tout appel d'embedding et utiliser le classement lexical ; les tests hybrides existants continuent de vérifier l'exclusion des documents non autorisés.
- Aucun appel Workers AI réel, aucune vectorisation, aucune ingestion, aucun OCR et aucune modification Supabase n'ont été exécutés.
- Validation CI de ce lot : en attente sur le HEAD actualisé.

## Lot 676 — tester réellement le chemin vectoriel complet et son repli

- La revue après le Lot 675 a révélé un faux sentiment de couverture dans le test historique « une panne des embeddings conserve le repli BM25 » : son fixture ne contenait qu'un vecteur alors que le corpus de test comporte deux chunks autorisés. Depuis l'exigence de couverture complète du Lot 675, le Worker rejetait donc l'index avant d'appeler le modèle d'embedding ; le test passait sans exercer la panne simulée.
- Le fixture du test de panne contient maintenant les deux vecteurs requis. Il atteint donc bien l'appel env.AI.run() de l'embedding de requête, déclenche l'exception simulée, puis vérifie que le classement BM25 permet toujours de répondre.
- Ajout d'un test nominal complémentaire avec un index couvrant les deux chunks autorisés : il vérifie que le Worker appelle effectivement le modèle d'embedding de requête et poursuit jusqu'à la réponse pédagogique.
- Ce lot corrige la couverture des tests, sans changement de comportement de production. Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion ni déploiement.
- Commit test : 3bf99f91652c43fb087cc3dacfe5b9281070f47f. La CI complète du nouveau HEAD doit confirmer ce lot.
- Contraintes inchangées : PR #23 reste non fusionnée ; aucune modification de main, Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun déploiement.

## Lot 677 — repli BM25 sur embedding de requête invalide

- Audit du chemin hybride confirmé : le Worker conserve le classement lexical si le modèle d'embedding échoue, renvoie une dimension incorrecte ou un vecteur de norme nulle. La validation des valeurs non finies est également couverte.
- Ajout d'une régression paramétrée couvrant trois réponses d'embedding de requête invalides : vecteur de dimension 2, vecteur nul de 256 dimensions et vecteur contenant NaN. Pour chaque cas, le test utilise un index vectoriel complet et vérifie que l'appel d'embedding a réellement eu lieu, que la réponse pédagogique BM25 reste disponible et que la requête ne tombe pas en erreur.
- Aucun changement du Worker de production : le comportement de repli existant est désormais réellement testé sur un index conforme.
- Commit test : 13d0f39cce595e431417c86a24693ce5b2a6feae. CI complète du HEAD suivant requise.
- Aucun appel Workers AI réel, aucune vectorisation, OCR, ingestion ou déploiement. PR #23 non fusionnée ; aucune modification de main ni de Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 678 — prouver que le test de panne atteint réellement l'embedding

- Relecture du test `une panne des embeddings conserve le repli BM25` après le Lot 677 : le fixture est désormais complet, mais l'assertion vérifiait seulement la réponse finale. Une régression dans le harness ou dans le chemin d'activation aurait pu faire réussir le test sans atteindre `env.AI.run()`.
- Ajout d'une assertion explicite sur `h.aiCalls` pour exiger l'appel au modèle `@cf/google/embeddinggemma-2` avant de conclure que BM25 a assuré le repli après l'exception simulée.
- Ce lot renforce uniquement la preuve du test ; aucun changement de comportement Worker en production.
- Commit du test : `aea302145442e6bac62996051cb9acef214f54ba`. Validation CI complète du HEAD final requise.
- Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion, aucun déploiement. PR #23 non fusionnée ; aucune modification de `main`, Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 679 — couvrir le débordement numérique de la norme d'embedding

- Extension des cas d'embedding de requête invalides : des composantes peuvent être individuellement finies tout en provoquant un débordement lors du calcul de la norme euclidienne (par exemple `Number.MAX_VALUE`).
- Ajout de ce cas à la régression paramétrée du repli BM25. Le test exige toujours que l'appel d'embedding soit atteint et que la réponse lexicale reste disponible.
- Le Worker calcule une norme non finie ; les similarités ne produisent alors aucun candidat sémantique exploitable et le classement lexical demeure le résultat de secours. Ce lot ajoute une preuve de non-régression sans modifier le Worker.
- Commit du test : `feb10f2763fe8bbce659953c48827b1eae980c6c`. Validation CI complète du HEAD final requise.
- Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion, aucun déploiement. PR #23 non fusionnée ; aucune modification de `main`, Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 680 — rejet explicite d'une norme de requête non finie

- L'audit du chemin hybride a confirmé que les composantes de l'embedding de requête étaient vérifiées individuellement avec `Number.isFinite`, mais que la norme calculée n'était testée que par `queryNorm > 0`.
- Un vecteur de composantes finies mais très grandes peut produire une norme `Infinity`. Le classement sémantique poursuivait alors une normalisation non valide, même si le repli BM25 évitait une erreur visible.
- Le Worker exige désormais explicitement `Number.isFinite(queryNorm) && queryNorm > 0` avant toute normalisation et tout classement vectoriel. Si le contrôle échoue, le classement lexical conservé reste la voie de secours.
- Le scénario `Number.MAX_VALUE` introduit au Lot 679 couvre ce cas. Commit Worker : `98f129fc2ff82486ac006a31b131cbbfb314cf31`. Validation CI complète du HEAD final requise.
- Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion, aucun déploiement. PR #23 non fusionnée ; aucune modification de `main`, Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 681 — bornage des lectures des artefacts RAG en octets

- L'audit des limites a identifié que le Worker appelait response.text() avant de contrôler la taille des artefacts. Le contrôle de longueur intervenait donc après lecture complète et utilisait des caractères JavaScript, pas le nombre réel d'octets reçus.
- Ajout de readTextLimited(response, maxBytes) : contrôle précoce de Content-Length lorsqu'il est disponible, lecture progressive du flux, arrêt et annulation immédiate au dépassement, puis décodage UTF-8 strict.
- Les artefacts chunks (1 500 000 octets), manifeste (200 000 octets) et vecteurs (20 000 000 octets) passent désormais par ce lecteur borné. Une réponse trop grande ou un UTF-8 invalide est refusé sans poursuivre le parsing ni appeler le modèle.
- Test ajouté : flux de corpus dépassant 1 500 000 octets ; le Worker renvoie 503, annule le flux et n'appelle pas le modèle.
- Commits Worker/test : a80032d, 8f2170a. Validation CI complète du HEAD final requise.
- Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion, aucun déploiement. PR #23 non fusionnée ; aucune modification de main, Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 682 — limites et validation des réponses du modèle

- Le Worker valide désormais la sortie de l'AI binding : elle doit être une chaîne non vide et ne pas dépasser 6 000 caractères. Les réponses mal typées ou excessives sont refusées avec une erreur générique `ai-unavailable`, sans renvoyer de contenu anormal au navigateur.
- Le chemin Cloudflare AI direct (token + account ID) utilise maintenant un délai d'attente de 20 secondes, lit le corps progressivement avec une limite de 262 144 octets, puis applique le parseur JSON strict avant d'extraire la réponse.
- Le lecteur de flux annule aussi explicitement le flux si un bloc reçu n'a pas le type binaire attendu.
- Test ajouté pour les réponses AI non textuelles et supérieures à 6 000 caractères.
- Commits : Worker `f21df5a`, test `09eddfa`. CI du HEAD final à vérifier.
- Le binding `env.AI.run` ne fournit pas de signal d'annulation dans cette interface : aucun faux engagement d'annulation n'est revendiqué pour ce chemin. Les limites de taille de sortie sont néanmoins appliquées après résolution.
- Aucun appel IA réel, aucune vectorisation/OCR/ingestion, aucun déploiement. PR #23 reste non fusionnée ; aucune modification de `main`, Supabase/Auth/RLS/schéma/abonnement/paiement.

## Lot 683 — généralisation des limites de lecture à toutes les sources Worker

- La relecture exhaustive des appels de lecture a montré qu'il restait des `response.text()` / `response.json()` non bornés dans les résolveurs de pages, séances, résumés, documents officiels, banque libre, authentification et vérification d'abonnement. Ils sont maintenant remplacés par `readTextLimited()` puis le parseur JSON strict lorsque nécessaire.
- Limites appliquées : réponses Auth/abonnement/pages 65 536 octets ; séance 3AS 100 000 ; résumé libre 90 000 ; archives officielles 800 000 ; chunks RAG 1 500 000 ; banque libre 1 500 000 (puis plafond utile de contenu 30 000 caractères) ; séance gratuite 9 000 ; index vecteur 20 000 000 ; réponse API Cloudflare AI 262 144 octets.
- Cette relecture a également corrigé un remplacement incomplet du lot précédent : le flux des chunks RAG lui-même passe maintenant effectivement par le lecteur borné, et non plus par `response.text()`.
- Commit Worker : `258fcd9`. Le test de dépassement du corpus ajouté au Lot 681 couvre maintenant ce chemin borné. CI du HEAD final à vérifier.
- Aucun appel réel à Workers AI, aucune ingestion/OCR/vectorisation, aucun déploiement. PR #23 reste non fusionnée ; `main`, Supabase/Auth/RLS/schéma/abonnement/paiement inchangés.
- Test complémentaire : le chemin Cloudflare AI direct (sans binding `env.AI`) reçoit un flux de 262 145 octets, doit l'annuler au plafond de 262 144 octets et répondre 503 sans transmettre une sortie partielle. Commit de test complémentaire : `f4693ff`.

## Lot 684 — annulation des réponses déclarées trop volumineuses

- `readTextLimited()` annule maintenant explicitement `response.body` lorsque l’en-tête `Content-Length` est invalide ou annonce une taille supérieure à la limite, avant de créer le lecteur et sans lire le corps.
- Test Worker ajouté : une réponse RAG annonçant 1 500 001 octets est rejetée en 503, son flux est annulé et aucun contexte n’atteint le modèle.
- Commits : Worker `47290b1`, test `fcca7f1`.
- Audit associé : authentification Supabase et lecture d’abonnement ont déjà un délai maximal de 5 secondes avec `AbortController`, une lecture plafonnée à 65 536 octets et un échec fermé sur erreur/JSON invalide.
- Aucun appel d’embedding, OCR ou ingestion réelle. Aucun changement Supabase, Auth, RLS, abonnement ou paiement. `main` reste inchangée ; PR #23 non fusionnée et aucun déploiement.

## Lot 685 — validation stricte du corps des requêtes entrantes

- `readLimitedBody()` valide maintenant strictement `Content-Length` : valeur décimale sûre obligatoire lorsqu’il est présent ; dépassement de 8 192 octets rejeté en 413 avec annulation du flux avant lecture.
- Chaque fragment du flux doit être un `Uint8Array`. Le lecteur est annulé sur dépassement ou erreur, puis son verrou est libéré dans `finally`.
- Décodage UTF-8 désormais fatal : les séquences invalides sont rejetées en 400 (`invalid-body`) avant le parsing JSON et avant tout appel au modèle.
- Tests ajoutés pour l’annulation d’un corps déclaré à 8 193 octets sans lecture et le rejet d’un corps contenant une séquence UTF-8 invalide.
- Commits : Worker `0393438`, tests `5c7428b`.
- Aucun changement Supabase/Auth/RLS/schéma/paiement, aucun OCR/embedding/ingestion réelle. `main` inchangée ; PR #23 ouverte, non fusionnée ; aucun déploiement.


## Lot 686 — correction du contrôle décimal de Content-Length

- La relecture du lecteur borné a détecté une double échappement dans les expressions régulières de validation de `Content-Length`, à deux endroits : `readTextLimited()` (réponses HTTP) et `readLimitedBody()` (requêtes entrantes).
- La forme erronée pouvait rejeter des longueurs décimales pourtant valides. Elle est remplacée par le contrôle `/^\\d+$/` dans les deux fonctions ; les limites en octets, l’annulation des flux et les réponses d’échec fermé restent inchangées.
- Test de régression ajouté : un corps de requête avec un `Content-Length` décimal valide et égal à sa taille réelle doit être accepté et atteindre le modèle. Les tests existants couvrent également le rejet/annulation d’un corps déclaré trop volumineux et d’un flux RAG au-delà de sa limite.
- Commits : Worker `20301ec`, test `1bd90c5`. Validation CI du HEAD final encore à obtenir ; le commit Worker a lancé les contrôles PostgreSQL et un contrôle Cloudflare, tandis que la suite CI complète a été annulée lors de l’arrivée du commit suivant et n’apparaît pas encore comme relancée.
- Le workflow GitHub `.github/workflows/deploy.yml` est une CI de validation sans job `deploy` et sans permissions de publication Pages/OIDC. Le contrôle Cloudflare du commit Worker est signalé comme build sous le chemin `production/builds` ; son statut ne suffit pas à lui seul à établir si un déploiement a eu lieu. Aucun déploiement manuel n’a été déclenché.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun OCR, embedding ou ingestion réelle. `main` inchangée ; PR #23 ouverte, en brouillon et non fusionnée.


## Lot 687 — limites réelles d’annulation du binding Workers AI et délais des lots de pages

- Vérification de la documentation Cloudflare officielle des Workers AI bindings : l’interface documentée est `env.AI.run(model, inputs)`, avec `stream` comme option d’entrée documentée ; aucun paramètre `AbortSignal` n’est documenté pour annuler une inférence non-streamée. Référence : https://developers.cloudflare.com/workers-ai/configuration/bindings/ (consultée le 20 novembre 2026).
- En conséquence, aucun `Promise.race` présenté comme un arrêt du calcul distant n’a été ajouté : une course locale pourrait seulement cesser d’attendre, sans prouver l’annulation de l’inférence ni empêcher les appels de fallback de se chevaucher.
- Le Worker conserve un chemin API HTTP direct avec délai de 20 s et `AbortController`; cette garantie ne doit pas être confondue avec le binding `env.AI.run`.
- Le `compatibility_date` de `wrangler.toml` est `2024-09-01`. La propagation de l’annulation client via `Request.signal` est activée par défaut seulement à partir du 17 novembre 2026, ou par le drapeau `enable_request_signal` pour les dates antérieures. Référence Cloudflare : https://developers.cloudflare.com/workers/configuration/compatibility-flags/ . Aucun changement de compatibilité n’a été fait dans ce lot : ce serait une modification de comportement plus large, à tester séparément.
- `fetchAuthorizedBookPages()` traite au plus cinq pages séquentiellement ; chaque lecture de page a son propre délai de 5 s. Le pire cumul théorique est donc de 25 s avant échec/succès du lot. Le comportement reste atomique : une page manquante ou inaccessible empêche la transmission d’un contexte partiel. Point de performance à traiter dans un lot séparé, sans affaiblir RLS ni les contrôles de contenu.
- CI principale du HEAD précédent toujours en état GitHub `pending`, sans job retourné par l’API GitHub ; les trois validations PostgreSQL isolées et le check de build Cloudflare du HEAD `91863b5` sont réussis. Ce statut ne prouve ni échec de test ni validation complète ; diagnostic de planification GitHub encore ouvert.
- Aucun appel Workers AI réel, aucune vectorisation, aucun OCR, aucune ingestion de PDF, aucun déploiement. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement. `main` inchangée ; PR #23 reste ouverte, en brouillon et non fusionnée.


## Lot 688 — tests d’intégrité atomique des lots de pages RLS

- Deux tests de régression ont été ajoutés dans `tests/worker-ai-auth.test.mjs` : (1) un lot 2AS contenant deux pages échoue en `403 content-locked` si la seconde page ne retourne aucune ligne RLS, sans transmettre la première page au modèle ; (2) une liste de pages contenant un doublon est rejetée en `400 invalid-resource` avant toute lecture RLS.
- Ces tests renforcent explicitement l’invariant « toutes les pages demandées ou aucune » et le rejet des sélecteurs dupliqués. Ils n’appellent pas Workers AI réel et ne touchent pas Supabase ; les réponses RLS sont simulées dans le harness autonome.
- Commit de tests : `1bde404`. Exécution CI associée à vérifier ; aucun résultat de test n’est revendiqué avant la fin du workflow sur le HEAD correspondant.
- Aucun changement de logique Worker, de droits d’accès ou de configuration. Aucun OCR, embedding, vectorisation, ingestion réelle ou déploiement. `main` inchangée ; PR #23 ouverte, en brouillon et non fusionnée.


## Lot 689 — isolation de la concurrence CI par PR

- Diagnostic GitHub : le workflow principal `CI — ALLEMAND` était bloqué en `pending` parce qu’une exécution ancienne du même workflow, sur le SHA `21ab20c93a1033888da245501d4c6fbc7d5c4b3b`, restait `in_progress` depuis le 19 novembre à 22:35 UTC. Ses deux jobs étaient encore actifs à l’étape des tests Worker IA, tandis que la nouvelle exécution sur `cd3b753` n’avait aucun job démarré.
- Cause dans `.github/workflows/deploy.yml` : groupe de concurrence global constant `pages` avec `cancel-in-progress: false`, ce qui sérialisait les PR et la branche principale dans le même groupe et laissait une ancienne exécution bloquer les suivantes.
- Correction sur la branche PR uniquement : groupe désormais distinct par numéro de PR (ou ref hors PR) avec `cancel-in-progress: true`. Une nouvelle mise à jour de la même PR remplace ainsi son exécution obsolète, sans annuler les workflows d’autres PR ni celui de `main`.
- Le workflow reste un CI de validation ; aucun job `deploy`, permission `pages: write` ou `id-token: write` n’a été ajouté. La modification ne touche ni Cloudflare configuration ni Supabase.
- Commit du correctif concurrence : `96c98cf`. Vérifier le nouveau workflow déclenché sur ce HEAD avant de considérer le lot validé.
- `main` reste inchangée ; PR #23 reste ouverte, en brouillon et non fusionnée. Aucun changement Auth/RLS/schéma/abonnement/paiement ; aucun OCR, embedding, vectorisation ou ingestion réelle.


## Lot 690 — durée maximale des jobs CI

- Le diagnostic du workflow ancien `44629991744` a montré deux jobs toujours `in_progress` plus de 90 minutes après leur lancement. Dans le job Professeur IA, l’étape `node --test tests/worker-ai-auth.test.mjs` restait active ; dans le job de validation, l’étape `node --test tests/worker-ai-auth.test.mjs` était également active.
- Pour empêcher une régression de bloquer indéfiniment le groupe CI, `validate` et `professor-ai` ont maintenant `timeout-minutes: 30`. Cela borne la durée du job ; cela ne remplace pas un diagnostic des tests s’ils atteignent ce délai.
- Le groupe de concurrence par PR du lot 689 est conservé. Les workflows PostgreSQL isolés ont leur propre workflow et n’ont pas été modifiés.
- Commit de la borne de durée : `2ff6468`. Le déclenchement d’un nouveau workflow sur le HEAD courant doit encore être confirmé : l’exécution précédente `44634989792` reste une exécution en attente créée sous l’ancienne configuration de concurrence.
- Aucun changement de code Worker, d’accès, de données Supabase ou de déploiement. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.


## Lot 691 — correction du défaut syntaxique révélé par la CI

- La première CI complète du nouveau HEAD `f3b11fd` a démarré et a fait échouer le job `Validation structurelle & pédagogique` à l’étape `node --test tests/worker-ai-auth.test.mjs`.
- Le journal GitHub identifie précisément `worker/ia-ask.js:35` : le bloc de rejet du `Content-Length` contenait les deux caractères littéraux `\\n` au lieu de vrais retours à la ligne. Le harness charge le Worker avec `vm.runInNewContext`, ce qui provoquait `SyntaxError: Invalid or unexpected token` et faisait échouer les tests qui importent le Worker.
- Correction appliquée dans `worker/ia-ask.js` : rétablissement des vrais retours à la ligne autour de l’annulation du body et du `return null`. La logique de sécurité et les limites ne changent pas.
- Commit correctif : `8be5e38`. Le résultat CI du nouveau HEAD doit être vérifié avant clôture ; la détection prouve que les vérifications de build seules ne suffisaient pas à détecter cette erreur d’analyse dans le harness.
- Aucun changement Auth/RLS/schéma/abonnement/paiement, aucun OCR/embedding/vectorisation/ingestion réelle. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.


## Lot 692 — correction des fixtures des tests HTTP du Worker

- Après correction syntaxique, la suite Worker a exécuté 107 tests : 103 réussis et 4 échecs. L’analyse des assertions montre que trois tests qui attendaient le passage au modèle utilisaient la question « Explique le Perfekt », désormais correctement classée comme notion payante ; le Worker répondait donc `403 content-locked` avant d’atteindre le chemin HTTP/modèle. Le contrôle d’accès est correct et n’a pas été affaibli.
- Les trois fixtures ont été remplacées par une question non verrouillée sur les salutations afin de tester le comportement HTTP demandé sans contourner le contrôle d’abonnement.
- Le quatrième test mesurait `reads === 0` sur un `ReadableStream` avec `highWaterMark` par défaut : le runtime pouvait appeler `pull()` de manière anticipée avant toute lecture du Worker. Le flux de test utilise désormais `highWaterMark: 0`, de sorte que le compteur mesure bien une lecture déclenchée par le consommateur. L’attente de réponse `413` et l’annulation du corps restent inchangées.
- Commit des fixtures corrigées : `cfcf90a`. Résultat CI correspondant à attendre ; aucune modification des règles de contenu premium ni de l’accès gratuit au Professeur IA.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun OCR, embedding, vectorisation ou ingestion réelle. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.


## Lot 693 — résultats réels de l’inventaire PDF CI

- L’artefact `pdf-rights-and-readiness` du workflow réussi `44643313708` a été téléchargé et analysé. Il couvre 293 fichiers PDF et 1 173 pages, sans conserver le texte extrait.
- Résultats : 186 PDF `extractable` (566 pages, 601 078 caractères extractibles) ; 28 PDF `mixed` (252 pages, dont 201 avec texte et 51 sans texte) ; 78 PDF `ocr_candidate` (355 pages sans texte extractible) ; 1 PDF `encrypted` (aucune page lisible par pypdf). Total : 767 pages avec texte et 406 pages sans texte extractible ; 747 140 caractères extractibles.
- L’inventaire des droits est présent pour les 293 chemins, mais `rights_confirmed` et `license` sont vides sur les 293 lignes ; le statut de revue est `à vérifier — aucune preuve compagnon trouvée`. Aucune autorisation d’ingestion ne peut être déduite de la présence d’un PDF ni de son caractère extractible.
- Conséquence pour le chantier : l’extraction technique est possible pour 186 PDF, partielle pour 28, et 78 nécessiteraient une OCR si les droits sont confirmés ; le PDF chiffré doit être traité séparément. Aucun OCR n’a été lancé, aucun texte n’a été sauvegardé, aucun chunk/embedding n’a été produit à partir de ces fichiers et aucun document n’a été intégré au RAG de production.
- Rapport disponible comme artefact CI `pdf-rights-and-readiness` (run `44643313708`, conservation jusqu’au 4 décembre 2026). Il contient les chemins, compteurs techniques et colonnes de droits, pas le contenu pédagogique.
- Le workflow complet sur le HEAD `6769ed4` est réussi : validation structurelle/pédagogique, suite autonome Professeur IA, audit PDF, contrôles d’accès et trois workflows PostgreSQL isolés. Le build Cloudflare est une prévisualisation uniquement.
- `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement ; aucun déploiement.


## Lot 694 — état réel du corpus RAG et distinction avec le catalogue historique

- Lecture directe de `assets/bdd/corpus_rag_manifest.json` : statut `connected_protected`, mais `document_count = 0` et `chunk_count = 0`. `assets/bdd/corpus_rag_chunks.json` contient 0 document et 0 chunk ; `assets/bdd/corpus_rag_vectors.json` contient 0 vecteur (modèle déclaré `@cf/google/embeddinggemma-2`, 256 dimensions). Le RAG PDF protégé est donc raccordé techniquement au Worker mais ne dispose actuellement d’aucun document PDF indexé.
- Le catalogue historique `assets/bdd/corpus.json` contient 239 fiches documentaires, dont 225 entrées PDF. Ces 225 entrées ont `licence = "document utilisateur"`, aucune propriété `droits_confirmes: true`, et un extrait historique limité à 300 caractères. Elles ne constituent pas un corpus RAG complet ; `assets/bdd/corpus_index.json` est un index de vocabulaire DE-AR (490 entrées), pas l’index plein-texte des PDF.
- L’inventaire technique CI dénombre 293 PDF : 68 ne sont pas représentés parmi les 225 entrées PDF du catalogue historique. Les 293 lignes de l’inventaire des droits ont confirmation et licence vides.
- La chaîne `tools/ingest_corpus_rag.py` exige cumulativement un compagnon JSON `_NOM.json`, `droits_confirmes is True`, une licence dans la liste autorisée (`production_propre`, `domaine_public`, `cc_by`, `cc_by_sa`, `autorisation_ecrite`), une ligne d’inventaire exacte avec `rights_confirmed=true`, un compagnon correspondant et la même licence. La valeur historique `document utilisateur` n’est pas autorisée. Les tests vérifient le refus en l’absence de droits ou d’inventaire.
- Le générateur `tools/build_corpus_rag_vectors.py` filtre les documents non autorisés avant embedding ; l’exécution réelle exige `--execute`, `--confirm-cloudflare-billing`, des identifiants Cloudflare valides et au moins un chunk autorisé. Aucun de ces appels de facturation ou embeddings réels n’a été lancé.
- Conclusion précise : le Professeur IA peut répondre par le modèle général et utiliser d’autres contextes autorisés déjà fournis par le Worker, mais la recherche RAG documentaire issue des 293 PDF n’est pas encore opérationnelle car son corpus protégé est vide. Les extraits de 300 caractères du catalogue historique ne remplacent pas l’ingestion RAG.
- Aucun OCR, aucune extraction enregistrée, aucun embedding, aucune vectorisation ni ingestion réelle effectués. Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.


## Lot 695 — test explicite du RAG PDF vide

- Ajout dans `tests/worker-ai-auth.test.mjs` d’un test où le Worker reçoit un manifeste et un artefact de chunks cohérents mais vides (`documents: []`, `chunks: []`). La recherche `corpus_search` doit retourner `404 resource-not-found`, ne transmettre aucun contexte et ne lancer aucun appel au modèle ni embedding.
- Ce test documente le comportement actuel du RAG vide : échec explicite de recherche documentaire, sans fabriquer un passage ni laisser le modèle croire qu’un PDF a été retrouvé. Il ne modifie pas le Worker ni la réponse HTTP.
- Commit de test : `995f1ff`. Validation CI sur le nouveau HEAD à attendre.
- Aucun OCR, aucune ingestion, aucun embedding ou vectorisation réels ; aucun changement de droits ni de configuration Supabase. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.


## Lot 696 — validation du test de corpus vide et qualité des extraits historiques

- Le test du lot 695 est réussi dans la CI du HEAD `7566eb4` : `tests/worker-ai-auth.test.mjs` totalise maintenant 108 tests réussis, 0 échec. Le test confirme qu’un corpus RAG vide retourne `404 resource-not-found`, sans contexte, sans appel au modèle et sans embedding.
- Analyse des 225 extraits PDF du catalogue historique `corpus.json` : 220 sont exactement limités à 300 caractères ; 4 sont plus courts ; 17 contiennent des caractères de contrôle. Aucun n’a de propriété `droits_confirmes: true`. Ces champs sont des aperçus historiques, pas un texte intégral validé pour le RAG.
- CI complète du HEAD `7566eb4` réussie : jobs `Validation structurelle & pédagogique` et `Tests autonomes — Professeur IA` réussis ; build Cloudflare de prévisualisation réussi ; trois validations PostgreSQL isolées réussies. Artefact PDF `pdf-rights-and-readiness` produit et conservé jusqu’au 4 décembre 2026.
- La PR reste ouverte et en brouillon, non fusionnée. `main` est toujours à `fadae5e`. Aucun déploiement de production, aucune modification Supabase/Auth/RLS/schéma/abonnement/paiement. L’ingestion PDF et la vectorisation attendent toujours une confirmation de droits document par document.


## Lot 697 — normalisation multilingue et intégrité des métadonnées d’intention

- Renforcement du normaliseur de l’audit d’ontologie : normalisation Unicode NFKD, suppression des diacritiques latins et arabes, du tatweel, harmonisation des variantes d’alif, de hamza, de ta marbuta et d’alif maqsura.
- Le contrôle élargi a été exécuté sur les formulations de l’ontologie et les 103 questions d’évaluation : aucune collision inter-intentions n’a été détectée avec cette normalisation plus stricte.
- Vérification structurelle des 25 intentions : identifiants uniques, catégories parmi les sept catégories déclarées, actions au format attendu, niveaux limités à 2AS/3AS et au moins un exemple d’évaluation par intention.
- Vérification des 103 échantillons : aucune intention inconnue, aucune catégorie d’évaluation différente de la catégorie de l’ontologie, compteur `_meta.n` cohérent.
- Le test `tests/intent-ontology-integrity.test.mjs` a été renforcé pour rendre ces invariants exécutables en CI. Une première écriture du normaliseur contenait des échappements doublés ; ils ont été corrigés avant de considérer le changement comme prêt à valider.
- Commits du test et du correctif d’échappement : `f37762e` puis `d5059d7`. Le résultat CI du nouveau HEAD doit être contrôlé avant clôture du lot.
- Aucun changement du moteur de décision en production, des droits, de l’authentification ou de la configuration Supabase. Aucun OCR, embedding, vectorisation ou ingestion réelle. `main` inchangée ; PR #23 ouverte, brouillon, non fusionnée.
