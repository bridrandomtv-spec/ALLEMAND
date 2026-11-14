# Lot 316-B — rapprochement versionné et revue à deux personnes

Date : 12 novembre 2026  
Statut : outil hors ligne expérimental, données synthétiques uniquement.

## Objectif

Comparer deux extractions successives d'un référentiel d'établissements sans écrire dans une base, sans conclure automatiquement à une fermeture et sans publier d'annuaire. Le lot prépare la revue humaine d'un futur export institutionnel.

## Livrables

- `prototypes/registry-reconcile-core.mjs` : rapprochement déterministe par `identifiant_national`.
- `prototypes/registry-reconcile-core.test.mjs` : tests Node natifs.
- `docs/product/LOT-316B-RECONCILIATION-REVUE.md` : règles de décision, manifeste et checklist.

## Règles du rapprochement

| Catégorie | Définition | Traitement |
|---|---|---|
| Nouveau | Identifiant absent de la version précédente | Revue de la source et de l'acte |
| Modifié | Identifiant présent dans les deux versions, au moins un champ différent | Afficher les champs modifiés et faire valider |
| Inchangé | Identifiant et champs comparés identiques | Confirmer la présence dans le lot |
| Absent à examiner | Présent avant, absent maintenant | Quarantaine ; ne jamais inférer fermeture/suppression |

La clé de rapprochement est exclusivement l'identifiant national fourni par l'autorité. Aucun rapprochement automatique par nom, adresse ou similarité textuelle. Les identifiants manquants, dupliqués ou synthétiques font échouer le rapprochement.

## Champs comparés

`source_id`, `identifiant_national`, `nom_ar`, `nom_fr`, `wilaya_code`, `commune_code`, `statut`, `date_effet`, `reference_acte`, `source`, `annee_scolaire`.

Les différences sont descriptives. Le programme ne décide pas si un changement est juridiquement valable. Un statut `ferme` ou `fusionne` doit être corroboré par un acte et sa date d'effet, puis validé par l'autorité compétente.

## Checklist de revue à deux personnes

### Avant comparaison
- [ ] Autorité émettrice identifiée par un canal vérifié.
- [ ] Périmètre géographique et administratif explicitement indiqué.
- [ ] Année scolaire, date d'extraction et date d'effet documentées.
- [ ] Dictionnaire des champs et nomenclatures fournis.
- [ ] Original reçu conservé en lecture seule ; empreinte SHA-256 calculée indépendamment.
- [ ] Version précédente et nouvelle version clairement identifiées.

### Revue opérateur
- [ ] Contrat d'en-têtes et encodage confirmés.
- [ ] Nombre de lignes rapproché du bordereau émetteur.
- [ ] Doublons, champs absents et codes non reconnus expliqués.
- [ ] Chaque nouveau/modifié/absent associé à une source et une référence d'acte.
- [ ] Aucun enregistrement absent traité comme fermé par défaut.

### Revue approbateur distinct
- [ ] L'approbateur est distinct de l'opérateur.
- [ ] Les actes et dates d'effet sont vérifiés sur une source institutionnelle.
- [ ] Les cas ambigus sont mis en quarantaine.
- [ ] Le nombre de lignes et les écarts sont acceptés ou rejetés explicitement.
- [ ] Décision signée, datée et liée à l'empreinte du fichier.

## Manifeste de lot — modèle non exécutable

Le manifeste doit être conservé à côté de chaque version ; les valeurs entre crochets sont des placeholders, jamais des valeurs à inventer.

```json
{
  "manifest_version": "1",
  "batch_id": "[identifiant attribue par le processus]",
  "issuer": "[autorite emettrice]",
  "issuer_contact_verified": false,
  "scope": "[wilayas/communes/types couverts]",
  "school_year": "[AAAA-AAAA]",
  "extracted_at": "[horodatage ISO 8601 avec fuseau]",
  "effective_at": "[date ou intervalle]",
  "source_document": "[reference officielle]",
  "file_name": "[nom original]",
  "sha256": "[empreinte SHA-256 du fichier original]",
  "row_count": null,
  "previous_batch_id": null,
  "operator": "[identifiant professionnel]",
  "operator_review": "pending",
  "approver": null,
  "approver_review": "pending",
  "decision": "quarantine",
  "decision_at": null,
  "notes": []
}
```

L'empreinte doit être calculée sur les octets exacts du fichier original avant toute conversion, normalisation ou ré-enregistrement. Une empreinte fournie par l'émetteur est conservée séparément et comparée ; elle ne remplace pas le calcul indépendant.

## Tests

Depuis la racine du dépôt :

`node --test prototypes/registry-reconcile-core.test.mjs`

Les tests couvrent les quatre catégories, les doublons, les identifiants absents/synthétiques, l'interdiction d'inférer une fermeture et l'export CSV neutralisé contre les formules.

## Limites et décision

- Aucune donnée réelle ni aucun fichier institutionnel n'est intégré.
- Aucune connexion réseau, aucun stockage persistant, aucune écriture Supabase.
- Aucun import, aucune migration, aucun changement Auth/RLS/GRANT/Storage.
- Aucun annuaire national ni invitation Messenger activé.
- Le manifeste est un modèle de gouvernance ; il ne constitue pas une signature numérique ni une preuve d'autorité.

**GO** pour les tests et la revue sur données synthétiques uniquement. **NO-GO** pour l'utilisation institutionnelle tant que l'autorité, le format, la clé officielle, les statuts et le circuit de validation ne sont pas confirmés.
