# Lot 318 — chronologie de consultation du journal (prototype)

Date : 12 novembre 2026  
Statut : maquette autonome RTL, données synthétiques uniquement.

## Objectif

Rendre lisible le journal conçu au Lot 317 : ordre des événements, rôle déclaré, acteur fictif, horodatage fourni dans le jeu de démonstration, justification et référence illustrative. La maquette permet de filtrer par dossier et de rechercher dans les événements.

## Livrables

- `prototypes/registry-decision-timeline-preview.html` : écran autonome arabe RTL, responsive, liste chronologique et panneau de détail.
- `prototypes/registry-decision-timeline-preview.test.mjs` : test Node natif d'isolation et de présence des garde-fous.
- Export JSON de la sélection visible, généré localement par le navigateur ; aucun envoi réseau et aucune persistance applicative.

## Jeu de démonstration

Deux dossiers SYN fictifs, avec six événements au total : revue opérateur, demande de correction, nouvelle revue, acceptation de démonstration et mise en quarantaine. Les acteurs, dates, références et marqueurs de chaîne sont inventés.

## Limites

- La page ne lit pas le journal Node du Lot 317 : celui-ci utilise `node:crypto`, non disponible directement dans un navigateur statique. La page est un jeu de démonstration indépendant, pas un visualiseur branché sur un registre.
- Les chaînes `DEMO-HASH-...` sont des marqueurs illustratifs, pas des empreintes SHA-256 calculées ou vérifiées.
- Les identités et rôles ne sont pas authentifiés ; les horodatages ne sont pas fiables ; aucune signature ni preuve institutionnelle.
- Aucun appel réseau, Supabase/Auth/RLS/GRANT/Storage, stockage navigateur, base de données, migration, configuration Cloudflare ou déploiement.
- Le téléchargement JSON ne contient que les événements fictifs visibles et ne constitue pas un export administratif.

## Vérifications

`node --test prototypes/registry-decision-timeline-preview.test.mjs`

GO pour revue UX sur données fictives uniquement. NO-GO pour tout dossier réel, toute approbation officielle ou intégration à la plateforme.
