# Lot 621 — correction du routage du dialecte demandé

Date : 15 novembre 2026  
Branche : `audit/lot-603-corpus-contract-tests`

## Défaut confirmé
Le client vocal envoyait toujours `dialect: detectDialect(q)`, qui retourne la chaîne `unknown` lorsque la question ne contient pas de marqueur lexical Darija. Dans `ia.js`, cette chaîne non vide était traitée comme une valeur explicite et empêchait le repli vers le dialecte calculé par QUST. Une demande « réponds en darija » sans autre marqueur pouvait donc être classée Fusha par le Worker.

## Correction
- `ia.js` : seules les valeurs reconnues `darija/arabizi` ou `fusha/msa` du client sont considérées explicites ; `unknown` déclenche le repli vers QUST et les lexiques ; les formulations explicites « بالدارجة », « بالجزائرية », « en darija », etc. définissent le style darija.
- `tests/tutor_language_matrix.mjs` et `tests/tutor_request_contract.mjs` : assertions contre la régression.
- `tests/tutor_matrix.json` : cas DAR-007, question en anglais demandant explicitement une réponse en darija.

## Validation
- Parsing JSON de la matrice : PASS.
- Ancres des modifications vérifiées avant écriture.
- Le test Node complet et GitHub Actions restent à exécuter ; aucun résultat d'exécution n'est revendiqué ici.
- Le comportement réel du Worker/TTS sur navigateur reste à tester.

## Périmètre
Aucun merge, aucun déploiement, aucun changement Supabase/Auth/RLS/schéma/données/paiement. La branche `main` n'est pas modifiée.

## Commits
- `d119cbe438a843107683d9ec860ca73769166d8e` — `ia.js`
- `7b243f38db3bc9059e805596a152512ce3e21e42` — `tests/tutor_language_matrix.mjs`
- `4c0df9c566acd9d48859cdf21566f3226d224a78` — `tests/tutor_request_contract.mjs`
- `6cc4c50aafdb26765adecb3bfc442f35939185a0` — `tests/tutor_matrix.json`
