# Lot 319 — import local et vérification du journal Lot 317

Date : 12 novembre 2026  
Statut : prototype local, limité aux identifiants synthétiques SYN-*.

## Objectif

Relier la chronologie du Lot 318 au format du journal produit par le moteur Lot 317, sans service distant ni base de données. L'utilisateur peut sélectionner un JSON de journal ; le navigateur vérifie localement la chaîne SHA-256 avant de présenter les événements.

## Livrables

- `prototypes/registry-decision-timeline-adapter.mjs` : adaptateur Node qui vérifie le journal avec le moteur Lot 317, contrôle les rôles/types et projette les événements vers le modèle de chronologie.
- `prototypes/registry-decision-timeline-adapter.test.mjs` : tests de projection, altération et combinaison rôle/type invalide.
- `prototypes/registry-decision-timeline-preview.html` : import de fichier JSON local, validation SHA-256 avec Web Crypto, affichage des détails et filtre par identifiant SYN.
- `prototypes/registry-decision-timeline-preview.test.mjs` : assertions d'isolation et de présence du contrôle d'import.
- Workflow CI : fichiers requis et test Node de l'adaptateur.

## Contrat d'import

Le fichier doit être un journal version 1 issu du Lot 317, avec un identifiant de dossier commençant par `SYN-`. La page recalcule l'empreinte du bloc initial, puis celle de chaque événement dans son ordre exact ; elle vérifie le numéro de séquence, le lien `previousHash`, le hash de chaque événement et `headHash`. Elle refuse aussi les combinaisons rôle/type non reconnues et les champs obligatoires manquants. En cas d'erreur, le jeu de démonstration déjà affiché reste intact.

Le navigateur doit fournir Web Crypto (`crypto.subtle`) dans un contexte compatible. Le fichier est lu localement via le sélecteur de fichiers ; aucun upload n'est effectué.

## Limites de sécurité

- L'import est limité aux dossiers SYN fictifs ; aucun dossier réel n'est accepté par cette maquette.
- Une chaîne SHA-256 valide prouve uniquement la cohérence interne du contenu par rapport aux empreintes présentes. Elle ne prouve ni l'identité de l'acteur, ni l'exactitude de l'horodatage, ni l'autorité de la référence, ni l'absence de recalcul malveillant complet.
- Aucun certificat, signature, horodatage de confiance, serveur ou stockage append-only.
- L'export de la page est un modèle de vue JSON, pas le journal original signé.
- Aucun réseau, backend, stockage navigateur, Supabase/Auth/RLS/GRANT/Storage, SQL/migration, configuration Cloudflare ou déploiement.

## Tests

`node --test prototypes/registry-decision-timeline-adapter.test.mjs`  
`node --test prototypes/registry-decision-timeline-preview.test.mjs`

GO pour démonstration et tests sur données SYN uniquement. NO-GO pour toute décision officielle, dossier réel ou intégration production.
