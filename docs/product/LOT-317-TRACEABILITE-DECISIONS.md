# Lot 317 — traçabilité des décisions de revue

Date : 12 novembre 2026  
Statut : prototype Node hors ligne, données synthétiques uniquement.

## Objectif

Compléter les Lots 316-C/D par un journal d'événements ordonné, exportable et vérifiable. Le journal conserve la justification, l'acteur déclaré, son rôle déclaré, l'horodatage fourni par l'appelant, la référence documentaire et le lien cryptographique vers l'événement précédent.

## Livrables

- `prototypes/registry-decision-ledger-core.mjs` : création du journal, ajout séquentiel d'événements, vérification SHA-256 et export JSON.
- `prototypes/registry-decision-ledger-core.test.mjs` : tests Node natifs.
- `docs/product/LOT-317-TRACEABILITE-DECISIONS.md` : règles, limites et protocole de test.

## Règles

- Chaque événement exige un identifiant d'acteur, un rôle autorisé, un horodatage et une justification.
- La revue opérateur doit précéder toute décision d'approbateur.
- Les identifiants opérateur et approbateur doivent être distincts.
- L'opérateur ne peut que consigner la revue ou mettre en quarantaine.
- L'acceptation exige une référence explicite de preuve ou d'acte ; la réouverture exige aussi une référence.
- L'export JSON est refusé si la chaîne d'intégrité ne se vérifie plus.
- Aucun horodatage n'est généré par le module : l'appelant fournit la valeur, ce qui rend les tests déterministes.

## Portée cryptographique et limites

SHA-256 détecte une modification accidentelle ou une altération non recalculée dans la chaîne. Il ne garantit PAS l'authenticité de l'auteur, l'exactitude de l'horodatage, l'inaltérabilité contre un administrateur capable de recalculer toute la chaîne, ni la conservation durable. Il n'y a ni clé de signature, ni horodatage de confiance, ni stockage append-only serveur. Les rôles et identifiants sont des déclarations de test, pas une authentification ou une autorisation.

Pour une production future, il faudra une identité serveur vérifiée, une autorisation RBAC côté serveur, un journal append-only avec contrôle d'accès, une signature détenue par un service, une politique de conservation, sauvegardes, horodatage fiable et procédure de contestation.

## Tests

`node --test prototypes/registry-decision-ledger-core.test.mjs`

Les tests couvrent la chaîne SHA-256, l'ordre opérateur/approbateur, la séparation des acteurs, les justifications et références obligatoires, les rôles/événements interdits, la détection d'altération et le refus d'export.

## Sécurité et décision

- Dossiers et références SYN-* fictifs uniquement.
- Aucun appel réseau, stockage navigateur, connexion Supabase, authentification, signature numérique ou persistance serveur.
- Aucun SQL/migration, schéma, donnée, RLS, GRANT, Auth, Storage, Cloudflare ou déploiement modifié.
- GO pour tests locaux et revue de conception ; NO-GO pour toute décision administrative réelle ou publication du registre.
