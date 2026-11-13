# Lot 433 — préflight de compatibilité et plan de migration ordonné

**Date :** 13 novembre 2026  
**Branche :** design/prototypes-67-74-alignment · PR #17  
**Statut :** préflight documentaire ; aucun SQL exécuté, aucune migration créée ou appliquée.

## 1. Périmètre réellement inspecté

Références relues :
- Lot 427 : photographie en lecture seule du catalogue actif Supabase ;
- Lot 430 : plan d'implémentation fichier par fichier ;
- Lot 432 : contrat serveur consolidé ;
- `supabase/msg_schema.sql` : SHA `24293ac6294bc2cff370c50fb525603defed949d`.

Le fichier `supabase/msg_schema.sql` est explicitement marqué dans son en-tête comme préparé et jamais exécuté par un robot. Il constitue un historique de conception, pas la vérité de la base active. Le dépôt contient un dossier `supabase/` avec des scripts SQL historiques, mais aucun dossier `supabase/migrations/` n'a été trouvé dans le listing consulté. Il n'y a donc pas de chaîne de migrations versionnées fiable à rejouer.

Le catalogue actif observé au Lot 427 reste la seule base de comparaison disponible, mais il ne fournit pas dans le présent lot une nouvelle capture complète de toutes les dépendances. Aucun nouveau SELECT n'a été lancé.

## 2. Écarts de compatibilité à ne pas ignorer

### 2.1 SQL historique contre catalogue actif
Le script historique :
- crée les tables Messenger et leurs policies ;
- définit plusieurs fonctions `SECURITY DEFINER` avec `search_path = public` ;
- autorise des insertions directes de conversations et membres via des policies ;
- inclut une politique de lecture de profils complets entre membres ;
- définit un contrôle de blocage à sens unique ;
- impose une règle de DM même wilaya/niveau/filière ;
- ajoute le parcours de vérification dans `profiles`.

Le Lot 427 constate des dérives et changements actifs, notamment la RPC `msg_open_direct(uuid)` exécutable par `authenticated`. Il serait dangereux de rejouer le fichier historique, même s'il utilise `IF NOT EXISTS`, `CREATE OR REPLACE` ou `DROP POLICY IF EXISTS` : ces constructions ne garantissent ni la compatibilité des données ni la conservation des règles actives.

### 2.2 RLS et privilèges : cumul des politiques
Les policies permissives PostgreSQL d'une même commande/rôle peuvent s'additionner avec une logique OR. Ajouter une policy restrictive apparente sans inventorier les policies existantes peut donc laisser un ancien chemin ouvert. Les GRANT SQL et RLS sont deux couches distinctes : retirer une policy ne retire pas un privilège de table ou de colonne ; créer une vue minimale ne masque pas les colonnes si le rôle garde un SELECT direct sur `profiles`.

### 2.3 RPC et fonctions partagées
Ne pas remplacer ou supprimer `msg_open_direct`, `msg_can_dm`, `msg_member_ok`, `msg_not_blocked`, `msg_is_member` ou leurs triggers avant d'avoir relevé :
- toutes les surcharges (nom + types d'arguments) ;
- propriétaire, langage, SECURITY DEFINER/INVOKER, search_path ;
- ACL EXECUTE pour PUBLIC, anon, authenticated et rôles techniques ;
- dépendances des policies, triggers, vues, autres fonctions et appels clients ;
- contrats attendus par les groupes officiels et les DM existants.

Le nom d'une fonction n'identifie pas à lui seul sa signature. Un `CREATE OR REPLACE` peut être incompatible avec des appels existants si la signature ou le type de retour change.

### 2.4 Compatibilité des données existantes
Les conversations directes déjà créées n'ont pas toutes nécessairement une invitation historique. Il ne faut ni inventer rétroactivement un consentement, ni supprimer les conversations. Il faut définir une règle de transition explicite : conserver les DM existants comme conversations héritées, ne pas créer de nouveaux DM par l'ancien chemin, et appliquer immédiatement les blocages et règles de sécurité aux accès futurs. Cette politique de transition doit être approuvée avant migration.

### 2.5 Vérification et profil
Le script historique lie le matricule et la section à `profiles` et prévoit une demande de vérification ; le parcours client exige un abonnement alors que le contrat produit veut une demande gratuite. Le changement ne doit pas réutiliser le champ `matricule` comme numéro d'abonnement ni exposer les données administratives dans la projection sociale. La nouvelle source institutionnelle et le périmètre des vérificateurs ne sont pas encore définis : le workflow final ne peut donc pas être migré.

## 3. Ordre de migration proposé — aucun script exécutable produit

| Phase | Préparation requise | Contrôle de sortie |
|---|---|---|
| 0. Baseline | Export catalogue exact : tables/colonnes/FK/check/index, policies, grants, fonctions/surcharges/ACL, triggers, vues, publications Realtime, Storage policies et dépendances | Baseline horodatée, relue et comparée au Lot 427 |
| 1. Compatibilité | Décision sur DM hérités, groupes officiels, pièces jointes, Realtime, modération et sessions clientes | Contrats existants préservés et transition approuvée |
| 2. Structures | Concevoir séparément invitations Messenger, demandes sociales, préférences et éventuel journal de vérification ; contraintes/index idempotents | Modèle relationnel relu, aucun champ privé dans les lectures publiques |
| 3. Autorisations | Concevoir RPC dédiées, ACL minimales, RLS, grants de colonnes et projection de profil ; fermer toutes les anciennes insertions directes | Matrice acteur × opération × table/colonne vérifiée |
| 4. Invariants | Transaction d'acceptation Messenger, blocage bilatéral, expiration, quotas, verrouillage et idempotence | Aucun chemin RPC/REST/trigger ne contourne le consentement |
| 5. Vérification | Parcours gratuit et source officielle, habilitations par établissement/wilaya, audit et recours | Source et rôles approuvés ; sans cela, contacts privés restent désactivés |
| 6. Client | Wrappers Supabase puis module forum et interface الرسائل | Les boutons ne sont activés qu'après disponibilité des RPC testées |
| 7. Validation | Tests multi-JWT, REST direct, concurrence, non-régression, tests mobile/desktop | Tous les tests critiques passent, preuves conservées |
| 8. Activation | Activation progressive et possibilité de désactivation immédiate | Approbation explicite et surveillance sans coût supplémentaire |

## 4. Plan de retour arrière (rollback) — garde-fous

Le rollback doit être défini migration par migration et testé sur une base jetable avant toute production.

Principes :
1. Ne jamais restaurer une ancienne policy ou un ancien GRANT qui réouvre la création libre de DM ou l'accès aux colonnes privées.
2. En cas d'incident, désactiver d'abord les nouvelles entrées UI/RPC d'invitation et la recherche nationale, sans supprimer les conversations, messages, membres ou pièces jointes existants.
3. Garder les nouvelles tables d'invitations en lecture seule pendant le diagnostic ; ne pas les supprimer si elles contiennent des états nécessaires à l'audit.
4. Restaurer les versions précédentes des fonctions seulement si leur comportement ne réintroduit aucun contournement ; sinon maintenir un mode fermé (fail closed) pour la création de nouveaux DM.
5. Préserver les groupes officiels et les conversations héritées ; toute transformation de données doit être additive et idempotente.
6. Sauvegarde/restauration : vérifier les capacités réellement disponibles dans le plan Supabase gratuit avant de compter sur un PITR ou une restauration à un instant donné. Ne pas supposer une option payante.
7. Une migration qui modifie plusieurs tables, policies et fonctions doit avoir des assertions préflight/postflight et un plan d'arrêt. Le rollback ne doit jamais être improvisé directement en production.

## 5. Conditions bloquantes avant de produire un SQL candidat

- Baseline active complète plus récente que Lot 427, obtenue en SELECT catalogue uniquement et sans lire les données personnelles.
- Inventaire des dépendances et appels clients exacts de toutes les RPC et fonctions affectées.
- Source institutionnelle autorisée pour valider l'affiliation scolaire.
- Décision produit formelle sur la transition des DM hérités.
- Environnement de test isolé déjà disponible et sans coût ; aucun nouveau projet payant.
- Plan de sauvegarde/retour arrière confirmé avec les capacités du plan gratuit.
- Autorisation explicite distincte avant tout SQL modifiant le projet actif.

## 6. Conclusion du Lot 433

**GO :** continuer la revue documentaire et préparer les requêtes de baseline SELECT à soumettre à autorisation.  
**NO-GO :** rejouer `msg_schema.sql`, créer des migrations exécutables, modifier Supabase actif, ouvrir les invitations ou annoncer les espaces terminés.

Le risque principal n'est pas seulement le nouveau modèle d'invitations : c'est la coexistence de plusieurs chemins historiques de création/adhésion, de policies RLS cumulatives et de privilèges SQL directs. Ils doivent être traités comme un seul périmètre de sécurité.

## 7. Opérations réalisées et non réalisées

- Lecture du dossier de continuité Lot 432, de la spécification Lot 432, des rapports Lot 427/430 et du script historique `supabase/msg_schema.sql`.
- Inspection de la liste des scripts sous `supabase/` ; aucun dossier `supabase/migrations/` trouvé dans le listing consulté.
- Aucun SQL exécuté (pas même SELECT) dans ce lot.
- Aucun changement de code, de base, de fonction, de policy, de privilège, d'Auth, Storage, Realtime ou paiement.
- Aucun déploiement, installation ou service payant.
- PR #17 reste ouverte et non fusionnée ; aucune modification de `main`.
