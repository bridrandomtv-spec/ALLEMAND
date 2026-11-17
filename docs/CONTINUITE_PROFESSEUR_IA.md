# Continuité — intelligence du professeur IA

Date : 17 novembre 2026

## Objectif
Livrer uniquement les changements liés au professeur IA : authentification du Worker, disponibilité pour tout compte authentifié, respect des cadenas, compréhension Darija/Arabizi, continuité du transcript et tests associés.

## Périmètre de cette branche
- `.github/workflows/deploy.yml` : exécution des deux suites de tests IA.
- `access.js`, `app.js`, `ia.js`, `rag.js` : contrôles d'accès aux ressources pédagogiques dans les chemins locaux et distants.
- `worker/ia-ask.js` : validation du JWT Supabase, contrôle des demandes reconnues comme verrouillées, refus des contextes arbitraires fournis dans `ctx`.
- `js/qust.js`, `parle.js` : compréhension Darija/Arabizi et conservation du transcript brut/normalisé.
- `tests/worker-ai-auth.test.mjs`, `tests/qust-darja.test.mjs` : tests de sécurité et de compréhension linguistique.

## Règles d'accès à préserver
- Tout utilisateur authentifié peut utiliser le professeur IA distant, même sans abonnement actif.
- Le professeur IA ne doit pas expliquer une leçon, corriger un exercice ou fournir une conjugaison liée à une ressource verrouillée.
- Les ressources explicitement gratuites restent accessibles selon `assets/bdd/access_config.json`, notamment les résumés et la banque générale d'exercices.
- Les utilisateurs abonnés actifs conservent l'accès aux contenus payants.
- Aucun changement Supabase : ni Auth, ni RLS, ni schéma, ni données, ni abonnements, ni migrations.

## Limite de sécurité connue
Le navigateur peut fournir du texte arbitraire dans `ctx`. La branche neutralise ce champ côté Worker : aucun extrait client n'est transmis au modèle. Cela ferme le contournement par contexte injecté, mais le Worker ne récupère pas encore les documents pédagogiques depuis une source serveur authentifiée. La future récupération documentaire doit identifier les ressources et vérifier leurs droits côté serveur avant transmission au modèle.

## Livraison
Cette branche est créée depuis `main` pour isoler les changements IA de la PR #21, qui contient également des changements Messenger, Multaqa, Masar et Gamification. La PR #21 reste ouverte et en brouillon ; elle ne doit pas être fusionnée dans le cadre de cette livraison IA seule.

## Validation
- Les tests IA JWT, Darija/Arabizi et la régression RAG/prof/union ont réussi dans la CI de la branche source `ai/lot-601-worker-jwt`.
- La CI propre à cette branche doit encore être exécutée et vérifiée.
- Aucun test E2E navigateur n'est déclaré réussi ici.
- Aucun déploiement, aucune fusion et aucune écriture Supabase.
