# Lot 620 — politique linguistique adaptative du professeur intelligent

Date : 15 novembre 2026  
Branche : `audit/lot-603-corpus-contract-tests`

## Décision produit
La réponse suit la langue et le dialecte de l’élève. Pour une sortie arabe, le style est déterminé séparément : darija algérienne si QUST identifie la darija/Arabizi ; arabe standard si l’entrée est en arabe standard. Une consigne explicite de langue de sortie reste prioritaire : une question en darija demandant une réponse en français reçoit une réponse en français.

## Modifications
- `worker/ia-ask.js` : normalisation prudente du dialecte entrant ; calcul indépendant de `output_style` (`darija`, `fusha`, `natural`) ; transmission au prompt ; retour de `answer_style` séparément de `answer_language`.
- `assets/bdd/darja.json` : métadonnées alignées sur la politique adaptative ; retrait de la note FUS-1 contradictoire.
- `tests/tutor_language_matrix.mjs` : assertions sur la séparation langue/style et la priorité de la consigne explicite.
- `tests/tutor_matrix.json` : ajout de DAR-005 (entrée arabe standard → sortie Fusha) et DAR-006 (entrée darija + consigne française → sortie française).

## Validation
- Parsing JSON du corpus Darija : PASS.
- Parsing JSON de la matrice pédagogique : PASS.
- Ancres de transformation vérifiées avant écriture.
- Tests Node du dépôt et workflow GitHub Actions non exécutés dans ce lot. Le comportement réel du LLM, du Worker déployé et du TTS navigateur reste à valider.

## Périmètre
Aucune modification de `main`, aucun merge, aucun déploiement Cloudflare, aucun changement Supabase/Auth/RLS/schéma/données/paiement/secrets. Messenger reste ouvert ; ses scénarios Realtime E2E A/B/C et reconnexion ne sont pas validés par ce lot.

## Commits
- `536192e4e4e013b80c20c9dd914802a5baec36ae` — `worker/ia-ask.js`
- `d58e22d985b05c5acdc6ab270bc36623f4cda0bd` — `assets/bdd/darja.json`
- `fcc38d89ff97bfb533c74f34df45988ba23d1a38` — `tests/tutor_language_matrix.mjs`
- `dede5e2075cc027ae9768e2b71090eeab3f74374` — `tests/tutor_matrix.json`
