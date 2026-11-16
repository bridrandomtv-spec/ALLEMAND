# Lot 649 — preuve RAG HMAC vérifiée côté Worker

Date : 2026-11-16

## Constat d'architecture

Le Worker CERVEAU `worker/ia-ask.js` est autonome et ne dispose pas du binding `ASSETS` déclaré par `wrangler.toml` pour le Worker du site (`src/site-worker.js`). Il ne peut donc pas lire directement le catalogue et les shards du site dans son environnement actuel.

L'état réel du dépôt confirme une seconde limite : `assets/bdd/shards_manifest.json` vaut actuellement `{"version":"1.0.0","nb_shards":0,"total_chunks":0,"shards":[]}`, aucun shard attendu n'est présent et `assets/bdd/corpus_rag_index.json` n'est pas disponible dans la branche. Aucun émetteur ne peut donc aujourd'hui attester un extrait RAG réel à partir de cet index.

## Changements

### Worker CERVEAU `worker/ia-ask.js`

- Le Worker extrait lui-même la portée demandée depuis la question originale (page, unité, exercice), y compris les chiffres arabes et persans.
- Il ignore les statuts `rag_source_status`, `rag_scope_status`, `rag_scope_type` et `rag_scope_value` envoyés par le navigateur.
- Il accepte une preuve `rag_evidence_token` signée HMAC-SHA-256 uniquement si la clé serveur `RAG_EVIDENCE_HMAC_KEY` est présente et fait au moins 32 caractères.
- Le jeton doit avoir l'émetteur `lycee-virtuel-rag`, l'audience `ia-ask`, une portée exactement identique à la question, une durée maximale de cinq minutes, un document, un chunk, une empreinte SHA-256 et l'empreinte SHA-256 du contexte exact transmis.
- Signature, format, durée, portée, empreintes et contexte sont vérifiés côté Worker. Toute erreur ferme le contrôle.
- Une demande précise sans preuve valide est refusée avant tout appel au modèle.
- Une réponse normale indique `rag_evidence_verified: true` uniquement après validation cryptographique.

### Orchestrateur `ia.js`

- Une citation RAG n'est désormais affichée que si le Worker retourne explicitement `rag_evidence_verified: true`, en plus des contrôles locaux de provenance et de portée.
- Un statut local vérifié ne suffit plus à afficher une citation.

### Tests

- Preuve HMAC valide pour la page exacte.
- Contexte modifié après signature.
- Jeton expiré.
- Jeton signé pour une autre page.
- Statuts falsifiés envoyés par le client sans clé serveur.
- Demande de page avec chiffres arabes.
- Contrôle du non-appel au modèle en cas de refus.
- Contrôle du drapeau `rag_evidence_verified` et de l'absence de citation si le Worker ne l'atteste pas.

## Limites et activation

- Le contrat HMAC et son vérificateur sont implémentés, mais aucun émetteur de jeton n'est encore déployé ni intégré au Worker du site.
- `RAG_EVIDENCE_HMAC_KEY` n'est ni configurée ni créée. Aucun secret n'a été ajouté ou modifié.
- Comme le manifeste RAG publié est vide, le parcours normal ne peut pas encore obtenir de preuve signée. En conséquence, les demandes précises de page/unité/exercice s'abstiennent désormais de façon sûre, même si le navigateur possède localement un extrait. C'est volontaire jusqu'à la mise en place de l'émetteur.
- Les tests utilisent une clé et un corpus synthétiques en mémoire ; ils ne prouvent pas le fonctionnement avec Cloudflare réel, les documents scolaires ni le modèle réel.
- Aucun test n'est déclaré PASS avant un résultat Actions consultable.
- Aucun PDF réel ingéré/OCRisé/indexé ; aucun changement de droits ou de licence.
- Aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets, aucune fusion dans `main`.

## Suite

Lot 650 : concevoir l'émetteur côté Worker du site, qui utilise son binding `ASSETS` pour retrouver le document et le chunk exacts, vérifier les métadonnées et construire le contexte canonique avant de signer. Le service doit refuser toute preuve tant que le manifeste et les shards ne sont pas cohérents. Il faudra ensuite traiter explicitement la création/configuration de la clé partagée avant toute activation réelle.
