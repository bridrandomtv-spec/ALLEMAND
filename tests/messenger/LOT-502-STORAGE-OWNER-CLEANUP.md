# Lot 502 — matrice de validation Storage Messenger

Statut : plan de tests pour environnement Supabase local/éphémère uniquement. Aucun test de ce document n'a été exécuté contre la production.

## Fixtures synthétiques requises

- Deux comptes authentifiés distincts A et B.
- Une conversation de test C à laquelle A et B appartiennent.
- Un message de A dans C.
- Un objet Storage synthétique dans le bucket privé avec le chemin exact `msg/C/A-<nonce>-fixture.pdf`, propriétaire Storage A.
- Un second objet identique mais appartenant à B.
- Une pièce jointe `pending` de A non liée (`message_id` renseigné, `msg_messages.attachment_id` différent de son identifiant).

Ne jamais utiliser de comptes, messages, fichiers ou chemins de production.

## Scénarios attendus

| Identité / objet | Opération DELETE | Résultat attendu |
|---|---|---|
| A / son objet Messenger dans C | Storage DELETE | Autorisé |
| B / objet Messenger appartenant à A | Storage DELETE | Refusé |
| A / objet Messenger dont le nom ne commence pas par `A-` | Storage DELETE | Refusé |
| A / objet d'un autre bucket | Storage DELETE | Refusé par cette politique |
| A / chemin Messenger mal formé (segment conversation non numérique ou profondeur différente) | Storage DELETE | Refusé sans erreur de cast |
| A / sa ligne `msg_attachments` pending non liée à son message | SQL DELETE sous rôle authenticated | Autorisé |
| B / ligne de métadonnées de A | SQL DELETE | Refusé |
| A / pièce jointe déjà liée (`attachment_id = id`) | SQL DELETE | Refusé |
| A / ligne non-pending ou liée à un message d'un autre expéditeur | SQL DELETE | Refusé |

## Tests de compensation client à ajouter après validation de la migration

1. Upload Storage réussi, insertion `msg_attachments` refusée : le client tente `storage.remove([path])`; confirmer suppression si propriétaire A, et signaler explicitement l'échec de nettoyage si refus/réseau.
2. Upload et insertion metadata réussis, liaison message refusée : relire `msg_messages.attachment_id` avant toute compensation. Si la liaison est confirmée, conserver l'objet. Si la lecture confirme qu'il n'est pas lié, supprimer d'abord l'objet puis supprimer uniquement la ligne metadata pending non liée.
3. Si la lecture de confirmation échoue ou reste ambiguë, ne rien supprimer ; signaler que le nettoyage est différé. Ne jamais supprimer un fichier sur la seule base d'une erreur réseau de l'UPDATE.
4. Après suppression logique du message, appliquer la politique de rétention décidée séparément ; cette migration n'autorise pas la suppression automatique des pièces jointes liées.

## Critères de sortie

- Tous les scénarios positifs et négatifs ci-dessus passent sur une pile Supabase locale/éphémère.
- Le client ne nettoie jamais un objet dont la propriété ou l'état de liaison n'est pas confirmé.
- Vérifier qu'aucune politique permissive existante ne donne à B un droit plus large : les politiques RLS permissives se combinent par OR.
- Vérifier les droits réels Storage API et PostgREST, pas uniquement une simulation SQL de l'expression.
- Tant que les tests ne sont pas exécutés, ne pas annoncer le nettoyage comme opérationnel et ne pas appliquer la migration à la base active.


## Lot 503 — harness d'intégration local ajouté

Le workflow distinct `.github/workflows/msg-storage-local-test.yml` démarre la pile Supabase CLI éphémère avec Storage activé, crée un bucket privé synthétique, applique le bootstrap dédié puis la migration candidate et utilise deux utilisateurs Auth synthétiques.

Le script `ci/msg-storage-local-test.mjs` vérifie via HTTP :
- upload Storage sous JWT A et B ;
- refus du DELETE de l'objet A par B ;
- suppression de l'objet A par A et de l'objet B par B ;
- refus de suppression par B des métadonnées de A ;
- suppression par A d'une métadonnée `pending` non liée ;
- refus par A de supprimer une métadonnée liée ;
- refus par A de supprimer une métadonnée dont le statut n'est plus `pending`.

**Limites explicites du premier harness :** les cas de nom de fichier non conforme, de chemin mal formé/profondeur incorrecte et d'objet d'un autre bucket ne sont pas encore exercés par l'API HTTP. La vérification de l'absence de politique permissive concurrente reste à compléter sur le catalogue de la pile locale. Le harness n'est pas déclaré réussi avant une exécution réelle de l'action GitHub. Aucun test ni changement n'a été effectué sur le projet Supabase actif.


## Addendum Lot 503 — limites découvertes à l'exécution CI

- Le workflow dédié a été déclenché, mais le run GitHub Actions #5 se termine avec un job sans étapes exposées (`steps=null`, `logs_url=null`) ; le téléchargement des logs renvoie `BlobNotFound`. Impossible de confirmer que le runner a exécuté le bootstrap ou le test Node.
- Le bootstrap inclut désormais une reproduction de la politique historique `owner delete` pour tester la combinaison OR.
- **Correction requise avant de faire confiance au test négatif Storage :** le script vérifie actuellement le statut HTTP de DELETE. Il doit vérifier que l'objet existe toujours après une tentative refusée (GET de contrôle avec service-role, uniquement sur la pile locale), car une suppression filtrée par RLS peut être une opération sans erreur sur zéro ligne.
- Les cas chemins mal formés, nom non conforme et bucket différent restent non couverts. Aucun critère de sortie complet n'est atteint ; ne pas appliquer la migration en production.


## Lot 504 — couverture étendue et statut

Le harness a été renforcé :
- suppression Storage par l'endpoint batch `DELETE /object/{bucket}` avec `prefixes` ;
- vérification de persistance via GET service-role local après chaque tentative ;
- fixture RLS avec insert/update authentifiés pour les messages et métadonnées ;
- deuxième bucket privé et chemins de test réservés pour segment non numérique, profondeur incorrecte et nom de fichier invalide ;
- inventaire des politiques DELETE permissives authentifiées : exactement deux attendues dans la pile synthétique (historique `owner delete` et candidate Messenger).

Le run Storage #13 échoue avant exposition des étapes (`steps=null`, `logs_url=null`), comme les autres workflows du même commit. Les journaux renvoient `BlobNotFound`. **La couverture est écrite mais non exécutée** ; ne pas qualifier les assertions de passées et ne pas appliquer la migration à la production.


## Lot 505 — correction du workflow et état des preuves (14 novembre 2026)

- Corrigé le bloc `DO` du contrôle des politiques Storage dans `.github/workflows/msg-storage-local-test.yml` : délimiteurs PostgreSQL `$$` manquants, commit `a935ca64692a9c0ed7bd0d2585c5f29a38dc5c55`.
- Run GitHub Actions Storage #16 (`43591195498`) : échec sans étapes exposées (`steps=[]`, `logs_url=null`), récupération des logs `BlobNotFound`. Les workflows CI générale et PostgreSQL du même commit ont le même défaut de visibilité. Cause d'exécution indéterminée ; ne pas déclarer le script ni la migration exécutés.
- Environnement de travail : Node `v22.16.0` présent ; Docker, Supabase CLI et psql absents. Pas de runtime local possible ici.
- Le schéma réel confirme statiquement les colonnes référencées par la politique metadata. Migration toujours candidate non appliquée ; aucun test Storage/PostgREST runtime n'est validé et aucune compensation client n'est activée.


## Lot 506 — protection des objets déjà liés

La revue du schéma réel a révélé que la politique Storage candidate initiale ne distinguait pas un objet orphelin d'un objet déjà lié à un message. Elle aurait permis à son propriétaire de supprimer directement le fichier d'un message existant. Ce comportement est interdit.

La migration candidate utilise maintenant les helpers SECURITY DEFINER msg_storage_cleanup_allowed(text) et msg_attachment_cleanup_allowed(bigint), avec search_path fixe, identité dérivée de auth.uid(), exécution révoquée à public/anon et accordée à authenticated. Le helper Storage vérifie également le format exact du chemin et l'absence de liaison msg_messages.attachment_id. Le helper metadata exige propriétaire, statut pending, message du même expéditeur et absence de liaison.

Nouveau scénario d'intégration : A téléverse un fichier, crée ses métadonnées, lie la pièce jointe à son message, puis tente de supprimer l'objet Storage. Résultat attendu : refus, objet toujours présent. La suppression de la métadonnée liée doit également être refusée.

**Statut : correctif statique uniquement.** Le workflow GitHub ne fournit toujours pas d'étapes/journaux et aucun environnement local Docker/Supabase/psql n'est disponible ici. Ne pas appliquer la migration au projet actif tant que les tests HTTP réels n'ont pas passé.
