# Lot 315 — prototype isolé de prévisualisation/import du registre

Date : 12 novembre 2026  
Statut : prototype documentaire et front-end autonome ; aucune connexion backend.

## Objectif

Permettre aux responsables de contrôler un export officiel avant d'envisager un import. Le lot ne constitue ni un registre officiel ni une fonctionnalité de production. Le module est isolé dans `prototypes/` et n'est pas raccordé à la navigation de la plateforme.

## Fichiers

- `prototypes/registry-import-preview.html` : interface autonome de prévisualisation.
- `prototypes/registry-import-core.mjs` : parseur CSV et contrôles déterministes.
- `prototypes/registry-import-core.test.mjs` : tests Node natifs.
- Rapport de continuité : `docs/DOSSIER_CONTINUITE_LYCEE_VIRTUEL_ALGERIEN.md`.

## Contrat CSV proposé

Encodage UTF-8, séparateur virgule, en-têtes obligatoires exacts :

`source_id, identifiant_national, nom_ar, nom_fr, wilaya_code, commune_code, statut, date_effet, reference_acte, source, annee_scolaire`

Les valeurs de `statut` acceptées par cette maquette sont `actif`, `suspendu`, `ferme`, `fusionne`. Ce vocabulaire est une normalisation technique provisoire ; il ne remplace pas les statuts officiels du ministère. Les codes géographiques sont conservés comme chaînes et ne sont pas validés contre une nomenclature réelle tant que la source officielle n'a pas été obtenue.

## Contrôles réalisés par le prototype

- Parseur CSV avec guillemets, virgules et guillemets échappés.
- Refus des en-têtes manquants, inconnus ou dupliqués.
- Refus des lignes comportant davantage de colonnes que les en-têtes.
- Contrôle des champs obligatoires, des statuts autorisés et du format/calendrier de `date_effet`.
- Détection des doublons de `source_id` et `identifiant_national` dans le fichier.
- Marquage explicite des identifiants `SYN-*` et des sources/références de démonstration comme non importables.
- Prévisualisation des anomalies et export d'un rapport CSV ; neutralisation des cellules susceptibles d'être interprétées comme formules par un tableur.

## Démonstration et limites

L'écran charge trois lignes fictives, dont un doublon volontaire. Les identifiants `SYN-*`, les codes `TEST-*`, les noms et les références de démonstration ne correspondent à aucun établissement réel. Le prototype n'appelle aucun endpoint, n'envoie aucun fichier, n'utilise aucun stockage local et ne conserve rien après fermeture de la page. Le bouton d'import est désactivé.

La maquette ne valide pas l'authenticité d'un décret, la réalité d'un identifiant national, l'activité d'un lycée ni l'autorité du producteur du fichier. Elle ne prouve aucune affiliation d'élève. Ces vérifications nécessitent un export institutionnel et un protocole d'approbation.

## Tests et exécution locale

Commande de test à exécuter depuis la racine du dépôt :

`node --test prototypes/registry-import-core.test.mjs`

La logique a été contrôlée avec Node sur les cas suivants : CSV cité avec virgules/guillemets, guillemet non refermé, ligne complète, doublon d'identifiant national, identifiant synthétique, date impossible/statut inconnu, en-têtes incomplets et colonnes excédentaires. Le test automatisé est livré dans le dépôt ; le CI GitHub doit encore confirmer son exécution sur le HEAD de la PR.

## Décision

- GO pour la maquette isolée et les tests de parsing/validation.
- NO-GO pour tout import, toute publication d'un annuaire, toute écriture Supabase ou toute attribution d'affiliation.
- Prochaine étape : revue du contrat de données et du processus de validation par une autorité institutionnelle ; ensuite seulement, concevoir une migration versionnée et des tests RLS/RPC isolés, sans appliquer de changement en production.
