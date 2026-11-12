# LOT 354 — Contrat d'authentification et d'autorisation des Workers

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Base d'audit : Lot 353, HEAD `e7e251897d400c7ebb75f9911749a8a7182f3ad5`  
Nature : spécification technique préalable, sans modification runtime.

## 1. Décision

Les Workers IA, e-mail et contenu doivent appliquer une authentification vérifiée côté serveur. Un en-tête Origin/CORS, un identifiant utilisateur transmis dans le JSON, le localStorage ou une variable JavaScript ne sont jamais une preuve d'identité.

**Aucun secret `service_role` dans le navigateur.** Le modèle retenu privilégie la clé Supabase publishable/anon pour vérifier l'identité via Auth et les appels PostgREST exécutés avec le JWT utilisateur. Un secret privilégié n'est introduit que si une nécessité serveur est démontrée, stocké dans un binding secret Cloudflare et limité au strict minimum ; il ne doit jamais servir de raccourci pour contourner RLS.

## 2. Réalité du client actuel à respecter

- `supabase/supabase.js` initialise le client avec une clé `sb_publishable_...` et expose `SB.getSession()`, qui retourne la session Supabase, notamment son `access_token`.
- Le client dispose d'un helper `authHeaders()` qui peut fournir `Authorization: Bearer <access_token>`.
- `app.js` appelle actuellement le Worker IA `/ask` sans Authorization.
- `auth.js` contient encore un mécanisme localStorage autonome avec hash non cryptographique et comptes de démonstration ; ses valeurs de session ne doivent jamais être acceptées comme preuve par un Worker.
- Le Worker doit être capable de refuser les appels venant d'une session locale seulement, d'un compte déconnecté ou d'un JWT expiré.

Conséquence : le raccordement frontend doit récupérer le jeton de `SB.getSession()` et le transmettre ; il ne doit jamais utiliser `AUTH.session()`, `localStorage`, un email ou un UUID comme substitut de JWT.

## 3. Contrat commun de vérification JWT

### Requête

- En-tête obligatoire : `Authorization: Bearer <Supabase access_token>`.
- Refus si absent, vide, mal formé, trop long ou répété de manière ambiguë.
- Accepter uniquement les méthodes et routes explicitement documentées.
- Limite du corps HTTP appliquée avant lecture complète ; JSON valide et schéma strict.
- Ne jamais accepter `user_id`, `role`, `wilaya`, `classe`, `is_admin`, `subscription_active` ou `entitlement` depuis le corps comme autorité.

### Vérification côté Worker

Option initiale recommandée pour réduire les erreurs de validation cryptographique : appeler Supabase Auth `/auth/v1/user` avec la clé publishable/anon dans `apikey` et le jeton utilisateur dans `Authorization`. Refuser tout résultat non-2xx, corps invalide, utilisateur absent ou erreur réseau/timeout. Cette vérification est serveur-à-serveur et doit être bornée en temps.

Une validation locale JWT via JWKS n'est acceptable qu'après documentation de l'algorithme, de l'émetteur, de l'audience, de la rotation des clés et des règles de révocation ; ne pas supposer que tous les projets utilisent le même algorithme. Une simple décodification Base64 des claims n'est jamais suffisante.

### Identité et autorisation

- L'identité est exclusivement l'utilisateur retourné par Supabase Auth.
- Les rôles et droits sont relus depuis les données serveur / RPC autorisées, jamais depuis les métadonnées modifiables du client.
- Une erreur de vérification, un timeout ou une indisponibilité donne un refus (fail closed).
- Les réponses ne révèlent ni token, ni clé, ni stack trace, ni détails internes.
- Aucun JWT complet n'est écrit dans les logs.

## 4. Contrat Worker IA `POST /ask`

### Accès

- Session Supabase valide obligatoire.
- Éligibilité définie explicitement par produit : utilisateur connecté et compte actif ; aucune confiance dans un rôle envoyé par le client.
- Si une limite d'usage dépend de l'abonnement, elle est déterminée par une source serveur autorisée et non par `config.json` ou une valeur UI.
- Les demandes d'élèves anonymes ou les sessions locales de `auth.js` sont refusées.

### Validation et quotas

- JSON objet strict ; `q` obligatoire, chaîne non vide, longueur maximale 600 caractères.
- `ctx` optionnel, longueur maximale 3 000 caractères ; le serveur doit considérer ce champ comme contenu non fiable fourni par le client, pas comme « contexte vérifié ».
- Limite maximale du corps brut, par exemple 8 KiB, appliquée via lecture en flux avant JSON.parse.
- Quota initial à calibrer : par utilisateur, par minute et par jour, avec plafond global de sécurité et limite de concurrence.
- Le stockage de quota doit être partagé/durable (Durable Object ou mécanisme équivalent validé), avec comportement défini en cas d'indisponibilité : refus temporaire, pas de bascule vers quota mémoire.
- Timeout de l'appel modèle, taille de sortie bornée, contrôle de coût et circuit breaker.
- Journalisation minimale : identifiant interne pseudonymisé, horodatage, route, résultat, consommation ; pas de question/contexte complet par défaut.

### Réponse

- 200 seulement si le modèle renvoie une réponse valide.
- 400 schéma invalide ; 401 jeton absent/invalide/expiré ; 403 compte non autorisé ; 413 corps trop grand ; 429 quota atteint ; 503 Auth/quota/modèle indisponible.
- Ne pas renvoyer les messages bruts d'erreur Cloudflare AI ou les détails d'exception.

## 5. Worker e-mail `POST /send-welcome`

**Décision par défaut : désactiver l'endpoint public et laisser `resend_proxy` vide.**

L'envoi de bienvenue doit être déclenché par un événement serveur fiable lié à l'inscription/confirmation, pas par un client qui choisit librement le destinataire.

Si un endpoint client reste nécessaire :
- JWT valide obligatoire ;
- le destinataire est dérivé côté serveur de l'utilisateur Auth, jamais du champ `to` fourni ;
- rôle et événement d'inscription vérifiés côté serveur ;
- idempotence sur l'événement d'inscription ;
- quota par utilisateur et limite globale ;
- protection anti-abus et journal d'audit sans contenu personnel excessif ;
- réponse neutre ne confirmant pas l'existence d'un compte tiers.

La clé Resend reste un secret de binding Cloudflare. Pas de secret dans `config.json`, HTML, JavaScript, logs ou réponses HTTP.

## 6. Worker principal de contenus payants

- Conserver le principe fail-closed.
- Authentifier le JWT utilisateur.
- Pour chaque chemin protégé, établir une correspondance explicite avec un contenu serveur déterminé ; ne pas se contenter d'une ligne payante générique si elle ne prouve pas le droit sur la ressource demandée.
- L'appel PostgREST doit utiliser la clé publishable/anon + JWT utilisateur, afin que RLS applique les droits du compte.
- Couvrir toutes les variantes d'unités, livres, traductions, téléchargements et chemins alternatifs ; les ressources publiques restent publiques par décision documentée.
- Ne pas faire confiance à un paramètre client `free`, `paid`, `subscribed` ou `role`.
- Réponses 401/403/404 cohérentes sans divulguer l'existence d'un contenu privé.

## 7. Matrice de tests négatifs et positifs

| ID | Identité / scénario | IA | E-mail | Contenu payant |
|---|---|---|---|---|
| WKR-01 | Sans Authorization | 401 | 401/endpoint désactivé | 401 |
| WKR-02 | Bearer mal formé | 401 | 401 | 401 |
| WKR-03 | JWT invalide/signature altérée | 401 | 401 | 401 |
| WKR-04 | JWT expiré | 401 | 401 | 401 |
| WKR-05 | Session locale `AUTH` seulement, sans JWT Supabase | 401 | 401 | 401 |
| WKR-06 | Utilisateur Supabase valide et actif | 200 selon quota | pas d'envoi direct | selon entitlement |
| WKR-07 | Compte suspendu / non éligible | 403 | 403 | 403 |
| WKR-08 | Élève sans abonnement | selon politique IA publiée | sans objet | 403 |
| WKR-09 | Élève abonné | selon quota | sans objet | accès à la ressource autorisée |
| WKR-10 | Paramètre client `user_id` remplacé | identité JWT conservée | destinataire ignoré | identité JWT conservée |
| WKR-11 | Corps supérieur à la limite | 413 avant parsing complet | 413 | sans objet |
| WKR-12 | Rafale multi-instance | quota partagé appliqué | quota partagé appliqué | rate limit si nécessaire |
| WKR-13 | Backend Auth indisponible/timeout | 503 fail closed | 503/endpoint fermé | 503 fail closed |
| WKR-14 | Ressource payante hors allowlist | sans objet | sans objet | refus/aucune fuite |
| WKR-15 | Ressource non autorisée par RLS | sans objet | sans objet | 403 |
| WKR-16 | Rejeu du même événement bienvenue | sans objet | un seul e-mail | sans objet |

Tests de régression supplémentaires :
- OPTIONS CORS depuis origine approuvée et origine inconnue ; confirmer que CORS ne remplace pas les tests sans Origin.
- Méthodes GET/PUT/DELETE sur chaque endpoint.
- JSON malformé, types inattendus, chaînes gigantesques, champs inconnus.
- JWT valide d'un autre projet Supabase (issuer incorrect).
- Requêtes concurrentes au quota et au même événement d'e-mail.
- Vérifier qu'aucun secret/token n'apparaît dans logs, erreurs ou réponses.

## 8. Ordre d'implémentation recommandé

1. Ajouter une fonction Worker partagée de vérification JWT et tests unitaires avec mocks Auth.
2. Protéger `/ask`, puis adapter l'appel `app.js` pour envoyer le JWT de `SB.getSession()`.
3. Remplacer le quota mémoire par un mécanisme durable ; tester multi-instance.
4. Désactiver `/send-welcome` public ; décider d'un déclencheur serveur d'inscription avant de réactiver.
5. Durcir la correspondance ressource ↔ entitlement du Worker principal.
6. Ajouter tests négatifs CI et scan secret.
7. Après validation de la PR et autorisation explicite, déployer d'abord sur une prévisualisation Cloudflare isolée, jamais directement en production.

## 9. Garde-fous et limites

- Ce document est un contrat, pas une implémentation.
- Aucun Worker modifié ; aucune requête de déploiement Cloudflare.
- Aucun secret Cloudflare consulté ou exporté.
- Aucune écriture SQL, migration, GRANT, RLS, Auth, Storage ou Realtime sur Supabase actif.
- Aucun changement de `main), aucun merge PR #17.
- MFA/2FA et facturation hors périmètre.
