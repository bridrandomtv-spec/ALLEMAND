# Lot 648 — contrôle déterministe de la portée des références RAG

Date : 2026-11-16

## Constat

Le statut `rag_source_status=verified` du Lot 647 atteste la résolution de la fiche catalogue et la concordance SHA-256 entre chunk et document. Il ne prouve pas que le chunk appartient à la page, à l'unité ou à l'exercice explicitement demandé. La recherche lexicale pouvait donc retrouver un extrait authentique mais hors de la portée demandée.

## Changements

### Orchestrateur `ia.js`

- Détection des demandes explicites de page, unité et exercice en français, allemand et arabe, avec normalisation des chiffres arabes et persans.
- Transmission séparée de `rag_scope_type`, `rag_scope_value` et `rag_scope_status`.
- Une page est considérée comme correspondante uniquement si le chunk vérifié commence et se termine sur le numéro exact demandé.
- Une unité ou un exercice est classé `unsupported` tant que les chunks et le catalogue ne portent pas de métadonnées structurées permettant de prouver cette correspondance.
- Une question générale sans portée explicite garde le statut `none` et n'est pas bloquée.
- Une citation documentaire n'est ajoutée à la réponse que si aucune portée précise n'est demandée ou si la portée demandée est vérifiée ; une page voisine ne peut donc pas être citée pour répondre à une autre page.

### Worker CERVEAU

- Validation par liste blanche des nouveaux champs de portée.
- Abstention déterministe avant tout appel au modèle si une page/unité/un exercice est demandé et que la portée ou la provenance n'est pas `verified`.
- Message de refus localisé en arabe standard, darija, français, allemand, anglais, espagnol ou italien.
- Le statut de provenance documentaire et le statut de correspondance de portée restent deux contrôles distincts.

### Matrice de tests

- Page exacte (page 4) : correspondance acceptée.
- Page différente (page 42 alors que l'extrait vient de la page 4) : mismatch.
- Unité 7 et exercice 3 : unsupported faute de métadonnées de portée.
- Question générale sur `weil` : aucun blocage de portée.
- BIBLIO seul sans hit RAG certifié : aucune référence de page considérée comme vérifiée.
- Worker : vérification que le modèle n'est pas appelé pour une page divergente ou une unité non certifiée.
- Orchestrateur : vérification qu'aucune citation de page/unité/exercice hors portée n'est ajoutée à la réponse.

## Limites et validation

- Les tests sont des fixtures synthétiques et un modèle simulé ; ils vérifient le routage et l'abstention déterministe, pas la pertinence linguistique d'un modèle réel.
- Limite de confiance : le Worker reçoit encore les statuts de portée calculés par le navigateur. Il exige aussi `rag_source_status=verified`, mais ne peut pas recalculer lui-même la correspondance à partir du corpus, auquel il n'accède pas dans ce parcours. Cette protection ferme les erreurs du flux normal, pas un client modifié qui falsifierait les champs. Une attestation côté serveur ou une preuve signée reste nécessaire pour une garantie anti-falsification.
- La correspondance exacte des pages est vérifiable avec le schéma actuel ; les unités et exercices ne le sont pas encore. Il faudra enrichir le schéma des chunks avec des identifiants structurés de leçon/unité/exercice avant d'autoriser ces références.
- Aucun test n'est déclaré PASS tant qu'un run GitHub Actions sur le commit courant n'a pas été consulté.
- Aucun PDF réel ingéré/OCRisé/indexé ; aucune validation individuelle de droits documentaires nouvelle.
- Aucun déploiement Cloudflare, aucune modification Supabase/Auth/RLS/schéma/données/paiements/secrets, aucune fusion dans `main`.

## Suite

Lot 649 : vérifier le workflow Actions déclenché par ces changements, corriger les erreurs de test/syntaxe révélées, puis concevoir le schéma de métadonnées structurées unité/leçon/exercice sans réindexer le fonds réel.
