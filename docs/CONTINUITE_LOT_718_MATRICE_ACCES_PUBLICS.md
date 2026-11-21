# Lot 718 — matrice consolidée des accès publics et des gardes Worker — 20/11/2026

## Périmètre
Relecture croisée de `src/site-worker.js`, `tests/site-worker-content-guard.test.mjs`, `wrangler.toml`, `.assetsignore`, `.gitignore`, du workflow CI et des consommateurs JavaScript. Ce lot consolide les constats des Lots 709–717 ; il ne modifie aucune donnée ni politique d'accès.

## 1. Ce que le Worker protège réellement

La liste `PROT` applique une vérification serveur avant l'appel à ASSETS pour :
- scripts d'unités listés et `devoirs_unite.js` ;
- `assets/bdd/devoirs.json`, `compositions.json`, `annales.json` ;
- `corpus_rag_chunks.json`, `corpus_rag_manifest.json`, `corpus_rag_vectors.json` ;
- `buch_3as_*.json` ;
- `traductions_livre.json`.

Pour ces chemins, l'absence de configuration Supabase renvoie 503, l'absence de Bearer JWT 401 et l'échec de la vérification de l'entitlement 403. Les tests couvrent les chemins protégés directs et encodés, les échecs fermés et l'absence d'appel ASSETS quand l'accès est refusé.

La vérification utilisée interroge `lesson_content` avec `free=eq.false` sous le JWT fourni ; le Worker conserve donc le RLS existant, sans le modifier.

## 2. Ce qui n'est pas protégé par PROT

Les chemins suivants sont transmis directement à ASSETS par le Worker, sans authentification serveur :
- `assets/bdd/config.json` — inclut des coordonnées de paiement et des informations de titulaire ; valeurs non reproduites.
- `assets/bdd/plan_projet.json` — document explicitement qualifié de confidentiel, avec éléments de stratégie, tarifs, marché, revenus et équipe.
- `assets/bdd/reservation.json` — paramètres de réservation et coordonnées de contact, utilisés par l'interface publique.
- `assets/bdd/eleves.json`, `parents.json`, `live.json`, `classe.json` — fixtures de profils, classe et session. Les métadonnées déclarent un usage local/démonstration, mais l'accès direct ne dépend pas de cette déclaration.
- `assets/bdd/journee.json` et `sujet14_farid.json` — ressources déclarées de démonstration ou fournies avec autorisation d'intégration ; le statut de publication et le caractère entièrement fictif ne sont pas une protection technique.
- `assets/bdd/buch_2as.json`, `buch_l2.json`, `buch_l3.json` — chargés directement par `buch.js` sans Bearer JWT visible dans les fetch examinés. La classification gratuite/payante de chaque partie reste à confirmer.
- `assets/bdd/buch_pages.json` — index public de pages ; les corps payants sont indiqués comme résidant dans `public.lesson_content`, mais le backup complet `docs/private/buch_pages_full.json` demeure un fichier du dépôt public.
- `assets/bdd/corpus.json`, `corpus_index.json`, `biblio_multimatieres.json`, `grammaire.json`, `darja.json`, `sharh.json` et les référentiels : ressources publiques/non protégées selon le Worker ; valider les droits de publication pour chaque contenu source, indépendamment du statut d'accès technique.

## 3. La distinction essentielle : Cloudflare, cache et GitHub

- `.assetsignore` exclut `docs/archive`, `docs/private` et certains PDF du bundle d'actifs Cloudflare. Cela ne retire pas ces fichiers de l'historique GitHub public.
- `.gitignore` empêche de nouveaux ajouts de certains fichiers secrets dans les conditions normales de travail, mais ne retire aucun fichier déjà suivi.
- `wrangler.toml` sert le répertoire racine comme actifs statiques via `ASSETS`; le Worker ajoute `Cache-Control: no-store` aux JSON de `assets/bdd/`. `no-store` ne constitue pas une authentification.
- Le dépôt étant public, les fichiers suivis peuvent rester accessibles par GitHub Raw/API même lorsque leur URL applicative est retirée, qu'ils sont exclus du bundle Cloudflare, ou qu'une garde Worker protège le domaine Cloudflare.

## 4. Couverture des tests et limites

- `tests/site-worker-content-guard.test.mjs` couvre les chemins PROT énumérés, les variantes encodées, les refus 401/403/503 et l'accès public de `grammaire.json`.
- Le test ne constitue pas un inventaire de tous les JSON non protégés : il ne teste pas explicitement les chemins `config.json`, `plan_projet.json`, `reservation.json`, fixtures élèves/parents/live/classe, ni les livres 2AS.
- L'absence de test de refus sur ces chemins est cohérente avec le Worker actuel qui les laisse passer ; ce n'est pas une preuve qu'ils doivent être publics.
- Les fetch de `projet.js`, `reservation.js`, `parents.js`, `live.js`, `classe.js`, `journee.js` et `buch.js` confirment les chargements directs relevés dans les lots précédents. Des contrôles de rôle dans le navigateur ne remplacent pas une autorisation serveur.

## 5. Décisions bloquantes avant toute fermeture de la PR

1. Confirmer si `config.json` peut être publié sans ses données de paiement et si les coordonnées actuellement présentes sont destinées à l'affichage public.
2. Confirmer si `plan_projet.json` est réellement destiné au public malgré son étiquette « confidentiel ».
3. Confirmer la publication volontaire des contacts dans `reservation.json`.
4. Certifier que toutes les entrées des fixtures `eleves/parents/live/classe` sont synthétiques, ou traiter ces fichiers comme potentiellement personnels.
5. Définir le statut gratuit/payé des contenus `buch_2as/l2/l3` avant de toucher aux chemins PROT ; éviter un verrouillage qui casserait les parcours gratuits.
6. Fournir les licences/permissions des extraits des livres 3AS et déterminer la stratégie de retrait des blobs historiques du dépôt public.
7. Décider explicitement si le dépôt doit rester public. Un déplacement vers stockage privé/Cloudflare R2 ne révoque pas à lui seul les anciennes URL GitHub Raw si les fichiers restent dans l'historique public ; il faut une stratégie dédiée de retrait/historique, avec évaluation de ses impacts.

## 6. Actions et état
- Rapport de consolidation uniquement ; aucun code, JSON, PDF, fixture, secret, Worker, règle RLS ou paramètre d'infrastructure modifié.
- Aucun changement Supabase/Auth/RLS/schéma/abonnement/paiement.
- Aucun changement sur `main`, aucune fusion et aucun déploiement.
- PR #23 maintenue ouverte et en brouillon.
- CI du HEAD antérieur `6c08e96dfed044e24b06e90aa69942e75412ed6f` : validation structurelle/pédagogique réussie, tests autonomes Professeur IA réussis, trois workflows PostgreSQL réussis ; Supabase Preview ignoré.
