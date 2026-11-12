# LOT 353 — Audit des secrets navigateur, Workers Cloudflare et endpoints publics

Date : 12 novembre 2026  
Référence : branche `design/prototypes-67-74-alignment`  
HEAD audité : `d11d5d5cf6630544e09ff08a68baa69764f78f42`  
Nature : revue statique des sources suivies par Git ; aucune inspection des secrets Cloudflare en runtime.

## 1. Résumé exécutif

**NO-GO pour considérer les Workers IA/e-mail comme des endpoints protégés.** Deux surfaces publiques sont présentes dans le dépôt :

1. Le Worker IA `worker/ia-ask.js`, référencé par la configuration publique `assets/bdd/config.json`, accepte `POST /ask` sans authentification utilisateur.
2. Le Worker e-mail `worker/resend-welcome.js` accepte `POST /send-welcome` sans authentification ni autorisation métier ; il permet de demander l'envoi d'un e-mail à une adresse arbitraire valide, en utilisant la clé Resend conservée côté Worker.

CORS ne constitue pas une authentification : un client HTTP non navigateur peut appeler directement ces endpoints. Le quota IA en mémoire d'instance n'est pas une limite durable, globale ou par utilisateur.

## 2. Inventaire du navigateur et des clés Supabase

### 2.1 Client Supabase

`supabase/supabase.js` contient :
- URL du projet Supabase ;
- clé `sb_publishable_...` utilisée par `createClient`.

La clé est explicitement une clé publishable destinée au navigateur, pas une clé `service_role`. Elle n'accorde pas à elle seule un accès illimité : les politiques RLS et privilèges SQL restent déterminants.

Aucune occurrence d'une clé `service_role`, d'un secret Supabase `sb_secret_...`, d'une clé Resend réelle, d'un token Cloudflare réel ou d'une clé GitHub au format courant n'a été trouvée dans les 11 fichiers ciblés de l'inventaire (configurations, client Supabase, Auth, paywall, Workers et workflow). **Ce résultat est ciblé, pas une certification exhaustive de tout l'historique Git ou de tous les blobs du dépôt.**

### 2.2 Configuration publique

`assets/bdd/config.json` :
- expose l'URL publique du Worker IA `https://ia-ask.bridrandomtv.workers.dev` ;
- laisse `resend_proxy` vide.

Le navigateur appelle le Worker IA depuis `app.js` sans jeton utilisateur. Le proxy e-mail n'est donc pas configuré dans cette configuration de site au moment de l'audit ; cela ne prouve pas qu'un Worker e-mail manuel n'existe pas ou n'est pas déployé ailleurs.

## 3. Worker IA — constat prioritaire

Fichier : `worker/ia-ask.js`.

- Route `POST /ask` publique, sans vérification de session Supabase, JWT, compte, rôle ou abonnement.
- La protection CORS limite les origines navigateur listées, mais n'empêche pas les appels directs par curl, scripts ou serveurs.
- Le quota `HITS` est un tableau global au niveau du module/instance Worker, plafonné à 20 requêtes sur 60 secondes. Il n'est ni durable, ni global à toutes les instances, ni lié à une identité ou adresse réseau.
- Le corps HTTP est lu intégralement avec `req.text()` avant troncature des champs question/contexte ; une limite de taille de requête au niveau entrée est absente du code.
- Le Worker utilise des bindings `env.AI` ou `env.CF_AI_TOKEN` + `env.CF_ACCOUNT_ID`. Aucun secret concret n'est codé en dur dans le fichier.
- `/health` expose l'état booléen `ai: !!env.AI`, sans exposer le secret.
- Le navigateur appelle `/ask` sans authentification dans `app.js`.

**Risque :** consommation abusive de capacité IA et coût/quota/indisponibilité, génération non attribuable à un compte et absence de limitation fiable par utilisateur. Les secrets Cloudflare ne sont pas divulgués par le code inspecté, mais la route est utilisable sans eux par un appelant.

### Correction cible

- Exiger un JWT Supabase valide ; le valider côté Worker auprès de Supabase Auth ou par mécanisme cryptographique documenté, sans faire confiance à un identifiant fourni dans le JSON.
- Vérifier compte actif et droits nécessaires ; si le service est destiné aux élèves connectés, refuser les appels anonymes.
- Appliquer une limitation durable par utilisateur et IP via un composant de stockage/coordination disponible (KV avec limites connues, Durable Object ou service de quota), plus limite stricte du corps.
- Ajouter contrôle de concurrence, timeout, journalisation minimale sans conserver le contenu pédagogique sensible, et réponses d'erreur qui ne divulguent pas les détails internes.
- Garder les secrets exclusivement dans les bindings Cloudflare.
- Tester les cas anon, JWT absent/invalide/expiré, élève authentifié, quota dépassé et abus multi-instance.

## 4. Worker e-mail — constat prioritaire si activé

Fichier : `worker/resend-welcome.js`.

- Route `POST /send-welcome`, aucune authentification, aucune preuve d'inscription ou d'événement serveur.
- L'adresse `to` est validée par une regex, mais l'appelant peut choisir n'importe quelle adresse valide.
- CORS fixe l'origine navigateur autorisée ; il ne protège pas l'endpoint contre les appels HTTP directs.
- Aucune limitation par utilisateur/IP, aucun idempotency key ni preuve d'inscription n'apparaît dans le code.
- La clé `RESEND_API_KEY` est lue depuis `env`, pas écrite en clair dans le fichier.
- `assets/bdd/config.json` a `resend_proxy: ""` ; le site audité ne pointe donc pas vers ce Worker actuellement.

**Risque si ce Worker est déployé et accessible :** abus d'envoi d'e-mails, spam, épuisement de quota et réputation du domaine expéditeur. Son déploiement effectif n'a pas été vérifié dans le compte Cloudflare.

### Correction cible

- Déclencher l'envoi depuis un événement serveur fiable (confirmation Auth ou tâche serveur), pas sur simple demande anonyme du navigateur.
- Vérifier JWT/session si un appel client reste nécessaire, puis vérifier côté serveur l'événement et l'adresse destinataire associée au compte.
- Rate limit durable, idempotence, limites journalières, journal d'audit, gestion anti-abus.
- CORS conservé comme défense complémentaire, jamais comme contrôle d'accès.
- Ne pas activer `resend_proxy` avant ces corrections et tests.

## 5. Worker principal du site et contenus payants

Fichier : `src/site-worker.js`, configuré dans `wrangler.toml`.

- Worker principal `allemand`, assets statiques via binding `ASSETS`.
- Pour les chemins listés dans `PROT`, il exige un Bearer token et interroge `lesson_content` avec `SUPABASE_ANON_KEY` et le JWT reçu.
- Si les bindings Supabase manquent, la route protégée échoue en 503 (fail-closed).
- Le Worker n'utilise pas de clé service_role.
- L'accès dépend de la RLS active de `lesson_content` : il faut tester un utilisateur anonyme, un élève sans abonnement, un élève abonné, un jeton expiré et une ressource hors allowlist.
- La liste `PROT` est une allowlist de chemins ; chaque nouveau fichier payant doit y être ajouté et testé. Les chemins non listés passent à `ASSETS` sans contrôle d'entitlement.
- La vérification `select=id&free=eq.false&limit=1` ne lie pas explicitement la ligne au fichier demandé ; elle sert à confirmer qu'une ligne payante est visible via RLS. Il faut vérifier que la politique RLS exprime bien l'entitlement de l'utilisateur et que la même règle s'applique à tous les contenus protégés.

## 6. CI et déploiement

- `.github/workflows/deploy.yml` contient un job de validation ; le contrôle interne du workflow vérifie l'absence de job `deploy`, de permissions `pages: write` et `id-token: write`.
- `wrangler.toml` configure le Worker principal et ses assets ; les deux fichiers Worker `worker/ia-ask.js` et `worker/resend-welcome.js` ont des instructions de déploiement manuel dans leurs commentaires, mais ne sont pas déclarés comme Workers supplémentaires dans ce `wrangler.toml`.
- Aucun déploiement Cloudflare n'a été lancé. Les secrets et bindings réellement présents dans le tableau de bord Cloudflare ne sont pas visibles par cette inspection Git.

## 7. Plan de remédiation ordonné

P0 — Avant toute exposition publique supplémentaire :
1. Fermer l'accès anonyme à `/ask` par authentification et quota durable.
2. Garder `resend_proxy` vide ; ne pas déployer/activer l'envoi sans autorisation serveur, anti-abus et idempotence.
3. Vérifier que les fichiers payants sont tous couverts par `PROT` et que RLS contrôle réellement l'abonnement.
4. Confirmer dans Cloudflare les bindings et secrets sans afficher leur valeur ; faire tourner tout secret qui aurait été exposé dans l'historique ou les logs.

P1 — Avant la migration Messenger :
5. Appliquer au futur endpoint d'invitation le modèle JWT + vérification d'affiliation officielle + consentement + blocage bilatéral défini aux lots 349–352.
6. Ne jamais utiliser la clé service_role dans le navigateur ; la garder côté serveur uniquement.
7. Ajouter tests CI de détection de secrets et tests HTTP Worker avec JWT et sans JWT.

## 8. Limites et sécurité des opérations

- Revue statique de 11 fichiers ciblés ; pas de scan intégral de l'historique Git.
- Aucun secret Cloudflare runtime consulté ; aucun test HTTP contre les Workers en production.
- Aucun profil, message, pièce jointe ou autre contenu personnel lu.
- Aucune écriture Supabase, DDL, migration, GRANT, RLS, Auth, Storage ou Realtime.
- Aucun changement de Worker, aucun déploiement, aucune ressource payante créée.
- Aucun changement de `main`, aucun merge PR #17.
- MFA/2FA et facturation hors périmètre.

## 9. Conclusion

La clé publishable Supabase observée côté navigateur est attendue et n'est pas la clé service_role. Aucun secret concret n'a été repéré dans les fichiers ciblés. En revanche, le Worker IA est publiquement appelable sans identité, et le Worker e-mail serait abusivement utilisable s'il était déployé tel quel. Le contrôle CORS n'est pas une frontière de sécurité. Ces points doivent être corrigés avant l'ouverture nationale des services.
