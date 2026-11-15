# Lot 627 — séparation langue de reconnaissance et langue de réponse

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`  
Périmètre : `parle.js`, contrat de requête partagé et tests statiques. Aucun changement de Worker, Supabase ou déploiement.

## Problème identifié

Le moteur vocal utilisait `LASTLANG = detectLang(q) || lang`. Quand la détection textuelle échouait, la langue choisie pour la reconnaissance du navigateur (par exemple arabe) était envoyée comme si elle avait été détectée dans la question. Le tuteur pouvait donc répondre en arabe à une question non classée, même si le contexte pédagogique ou le contenu indiquait une autre langue.

Il s'agissait d'une confusion entre deux signaux distincts :
- langue configurée pour le moteur de reconnaissance vocale du navigateur ;
- langue effectivement détectée dans la transcription de l'élève.

## Correction appliquée

Dans `parle.js` :
- `LASTLANG` contient désormais uniquement `detectLang(q)`, sans repli sur la langue du microphone ;
- la requête envoie `detected_language: LASTLANG || ''` ;
- `selected_language` est transmis comme `auto` ;
- la langue configurée du microphone est transmise séparément comme `recognition_language: lang` ;
- le sélecteur vocal porte désormais le titre explicite « langue de reconnaissance vocale ».

Dans `ia.js`, la langue de réponse peut ainsi être déterminée à partir du texte détecté, de la Darija/Arabizi, puis du contexte de la matière lorsque la question est trop courte ou ambiguë. Une consigne explicite de langue de réponse continue de primer.

## Contrat de non-régression

`tests/tutor_request_contract.mjs` vérifie désormais la séparation entre `selected_language`, `recognition_language` et `detected_language`, et rejette l'ancien repli `detectLang(q) || lang`.

Vérification effectuée ici : syntaxe de `parle.js` analysée par le moteur JavaScript disponible et assertions statiques relues dans le fichier de test. Les tests Node natifs et GitHub Actions ne sont pas déclarés passants : les runners du dépôt ont précédemment échoué avant leurs premières étapes.

## Limite technique conservée

La Web Speech API du navigateur exige une langue de reconnaissance configurée et ne fournit pas un mode universel fiable d'auto-détection multilingue. La séparation corrige la langue de réponse, mais ne transforme pas la reconnaissance vocale en ASR multilingue automatique. L'élève peut encore devoir choisir la langue d'écoute du navigateur lorsque la transcription est mauvaise ou change de langue.

## Fichiers modifiés

- `parle.js`
- `tests/tutor_request_contract.mjs`
- `docs/LOTS/LOT_627_SEPARATION_LANGUE_RECONNAISSANCE_REPONSE.md`
- `docs/DOSSIER_CONTINUITE_LYCEE_VIRTUEL_ALGERIEN.md`

Aucun déploiement ni changement de `main`. PR #17 reste ouverte et indépendante.
