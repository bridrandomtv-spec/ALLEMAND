# ALLEMAND — الثانوية الافتراضية / Lycée virtuel

Plateforme éducative algérienne (multi-matières à terme, allemand aujourd'hui) : site statique vanilla JS sur **Cloudflare Workers**, backend **Supabase** (auth, Postgres RLS, bucket privé `prive`, Realtime). Messagerie scolaire et centre de gestion complets, toute la logique sensible côté base.

## État (v8 — 13/10/2026)
- CI : 29/29 steps (structurel, pédagogique, messagerie, administration, gardes d'accès).
- Base = dépôt : parité vérifiée par 19 compteurs catalogue (recette : `docs/qa/reference.html`).
- Audit indépendant 8 phases : vulnérabilités D-1 → D-6 toutes closes (correctifs F1 → F6).

## Cartographie
- Front : `index.html`, `app.js`, `admin.js`, `auth.js`, `msg.js`, `paywall.js`, `live.js`, `prof_core.js`, `unite*.js`, `brand/favicon.svg`.
- `supabase/supabase.js` — client cloud fin : aucune décision côté client, tout passe par RLS/fonctions serveur.
- Couches base (`supabase/*.sql`) : `schema.sql` (profiles, unités, documents) · `billing.sql` + `payments.sql` (abonnements, paiements) · `plans.sql` · `msg_schema.sql` (messagerie + gardes role/verif) · `fix_scope_guard.sql` (périmètre scolaire) · `adm_schema.sql` → `adm5_schema.sql` (centre de gestion : agents wilayas, reçus, audit, accords, paramètres, comptabilité, support, notifications, rapprochement, clôtures).
- Gardes CI : `ci/check-access.mjs`, `ci/check-msg.mjs`, `tests/msg_test.mjs`, `tests/adm_test.mjs` (vérifications structurelles, aucune exécution SQL).
- `src/site-worker.js` + `wrangler.toml` — worker versionné : `Cache-Control: no-store` sur `/sw.js`, `/`, `/index.html`, `/assets/bdd/*`.
- `docs/qa/reference.html` — checklists de recette interactives (promotions, admin, agent, utilisateurs, messagerie 0→7, collages).

## Sécurité (règles d'or)
1. Le client ne décide jamais : permissions via `admin_can()` + RLS ; rôle imposé `eleve` à l'inscription ; changement de rôle = console ou admin (trigger).
2. Périmètre wilaya appliqué en base (`admin_sees_wilaya`) : paiements, subscriptions, fiches élèves, tickets, rapports, dashboard.
3. Écritures financières et preuves immuables : reçus numérotés (`REC-AAAA-NNNNNN`, index unique par paiement), `audit_logs`, `accounting_entries`, acceptations d'accords — corrections tracées, jamais de suppression ; clôtures mensuelles bloquantes.
4. Collages base : transactionnels, idempotents, vérifications chiffrées en fin de bloc.

## Méthode de travail
Lecture seule sans ordre explicite · un lot = un commit réversible · ancres vérifiées avant écriture · esprima/yaml rejoués avant commit · jamais de SQL exécuté par l'assistant · jamais de déploiement manuel · toute erreur divulguée.

## Recette
Ouvrir `docs/qa/reference.html` et suivre les checklists dans l'ordre : promotions → admin → agent régional → utilisateurs → messagerie → re-vérification base.
