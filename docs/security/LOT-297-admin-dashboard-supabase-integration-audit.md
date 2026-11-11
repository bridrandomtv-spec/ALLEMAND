# Lot 297 — audit du descriptif du tableau de bord administratif et des requêtes Supabase proposées

**Date :** 11 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Matériel reçu :** descriptif fonctionnel arabe des sept sections et quatre extraits de requêtes Supabase. Aucun fichier HTML/JavaScript complet ni capture d'écran n'est joint à ce transmission.  
**Statut :** audit de spécification et revue statique des sources du dépôt ; aucune intégration, aucun test navigateur et aucune introspection distante Supabase.

## 1. Périmètre et relation avec le Lot 296

Le Lot 296 audite le prototype HTML/JavaScript autonome de tableau de bord administratif : aperçu, utilisateurs, sécurité, finances, wilayas, système et journal d'audit.

Le présent Lot 297 consigne séparément le descriptif fonctionnel et les requêtes de branchement Supabase fournis ensuite. Il ne remplace pas le Lot 296 et ne prétend pas réexaminer un HTML qui n'a pas été transmis dans ce message. Les deux lots décrivent les mêmes sept domaines, mais le Lot 297 porte surtout sur les hypothèses de données, les accès directs PostgREST et la compatibilité avec les contrats administratifs déjà présents dans le dépôt.

**Décision : NO-GO pour copier/exécuter les quatre requêtes telles quelles ou présenter les huit indicateurs comme des données opérationnelles.** Le descriptif peut rester une référence fonctionnelle. Le raccordement doit réutiliser les permissions/RPC existantes et faire l'objet d'une vérification des objets réellement déployés avant tout affichage de données réelles.

## 2. Analyse des quatre requêtes proposées

### Q1 — Liste de tous les profils

```js
const { data: users } = await supabase
  .from('profiles')
  .select('*, user_roles(role), wilayas(name)')
  .order('created_at', { ascending: false });
```

Constats :

- `profiles` existe dans le code du dépôt, mais les relations `user_roles(role)` et `wilayas(name)` ne sont pas établies par les schémas administratifs examinés. PostgREST exige des relations/FK détectables ; cette sélection peut échouer avec une erreur de relation.
- Le modèle administratif visible dans les fichiers versionnés utilise `profiles.role` pour les rôles applicatifs et, séparément, `admin_roles`, `admin_permissions` et `wilaya_assignments` pour les rôles/permissions administratifs et leurs périmètres. Il ne faut pas inventer une troisième table de rôles.
- `select('*')` expose potentiellement des champs de profil inutiles (coordonnées, données scolaires ou autres attributs personnels) et viole le principe de minimisation.
- Charger tous les profils côté navigateur n'est pas une pagination serveur et ne garantit pas le périmètre d'une wilaya.
- Le wrapper existant `SB.admSearchStudents` effectue une recherche limitée à 20 profils élèves ; `SB.admStudent` appelle la RPC `admin_student`. Ce n'est pas une API générique de consultation/modification de tous les utilisateurs. Les permissions et les opérations manquantes doivent être définies explicitement.

**Décision Q1 :** ne pas utiliser cette requête. Définir les écrans et champs minimaux par permission, avec pagination et filtrage côté serveur ; réutiliser les RPC existantes quand elles couvrent réellement le besoin.

### Q2 — Compte global des utilisateurs

```js
const { count: totalUsers } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true });
```

Constats :

- Une requête de comptage globale n'est pas une preuve d'un total national autorisé. Le résultat dépend des politiques RLS et peut être incomplet ou trop large selon le rôle.
- Elle ne vérifie pas à elle seule la permission `reports.read` ni le périmètre serveur.
- Le dépôt contient déjà `SB.admDashboard()`, qui appelle la RPC `admin_dashboard`, ainsi que `SB.admReport()`, qui appelle `admin_report`. Le SQL versionné de `admin_report` vérifie `reports.read` et applique le périmètre national/régional dans la base.
- La présence de ces fonctions dans Git ne prouve pas qu'elles sont déployées dans le projet Supabase actif.

**Décision Q2 :** utiliser une RPC de synthèse avec autorisation et agrégation côté serveur, après vérification de sa disponibilité et de son comportement sur chaque rôle.

### Q3 — Revenus depuis la table payments

```js
const { data: revenue } = await supabase
  .from('payments')
  .select('amount, created_at')
  .gte('created_at', '2026-01-01');
```

Constats :

- Les chemins de paiement déjà présents dans `supabase.js` et les scripts ADM utilisent notamment `montant`, `devise`, `statut`, `methode`, `user_id` ; l'extrait propose `amount`, qui ne correspond pas au nom de montant utilisé par ces contrats.
- Une somme des lignes `payments` ne représente pas nécessairement le chiffre d'affaires encaissé : il faut distinguer les déclarations, paiements en attente, confirmations, remboursements et dépenses.
- Le dépôt contient `accounting_entries` et la RPC `admin_report(debut, fin)`, qui séparent recettes, remboursements et dépenses et filtrent par permission/périmètre.
- Les reçus numérotés sont dans `receipts` ; le numéro est généré côté base avec le format `REC-YYYY-######`. L'interface doit afficher le numéro réellement persisté, pas fabriquer un identifiant `REC-2026-*`.
- Cette revue ne crée aucune nouvelle fonctionnalité de facturation, de paiement, de tarification ou de monétisation. Elle porte uniquement sur la lecture contrôlée d'écritures déjà existantes, si elles sont réellement déployées et autorisées.

**Décision Q3 :** ne pas calculer les revenus à partir d'une lecture brute de `payments`. Utiliser la RPC comptable autorisée et les écritures validées ; les périodes, devise, statuts et périmètres doivent être explicites.

### Q4 — Menaces depuis security_analyses

```js
const { data: threats } = await supabase
  .from('security_analyses')
  .select('*')
  .gte('risk_score', 70)
  .order('created_at', { ascending: false });
```

Constats :

- Le Lot 295 a déjà audité le SQL proposé pour `security_analyses` comme un brouillon incomplet : RLS/policies/grants, contraintes, rétention et séparation des événements/analyses/alertes/actions n'étaient pas définis dans les éléments transmis.
- Rien ne prouve que cette table et ses politiques existent dans le projet Supabase actif. Sa présence dans un extrait de prototype ne constitue pas une source de données fiable.
- Le Lot 295 a aussi relevé que les événements fournis par le client peuvent être falsifiés, que l'identité ne doit pas être acceptée depuis le corps JSON, et que le score heuristique n'est pas une probabilité calibrée.
- `select('*')` peut révéler des données comportementales, appareil ou localisation au-delà du besoin d'affichage.
- Un seuil `risk_score >= 70` ne définit ni une politique de triage validée, ni une autorisation de blocage. Les commandes « حظر / مراقبة » n'ont aucun contrat serveur fourni ici.

**Décision Q4 :** aucune lecture ni action de sécurité ne doit être activée sur la base de cette hypothèse. La source d'événements, l'identité, le schéma, les autorisations, la rétention et le processus de revue humaine doivent être définis et testés séparément. Aucun blocage automatique n'est autorisé par ce descriptif.

## 3. Constats transversaux sur les sept sections

### F01 — Le périmètre administratif doit rester serveur (critique)

Les rôles administratifs versionnés sont fondés sur `admin_roles`, `admin_permissions`, `wilaya_assignments`, `admin_can` et `admin_sees_wilaya`. Un rôle ou filtre JavaScript ne remplace pas ces contrôles. Chaque RPC/lecture/écriture doit appliquer la permission et le périmètre côté base.

### F02 — Les rôles proposés ne correspondent pas au modèle administratif (élevé)

Les libellés « طالب/أستاذ/وكيل/مدير » sont des catégories d'interface, pas une preuve d'une relation `user_roles`. Les agents administratifs sont affectés par wilaya via `wilaya_assignments`. Il faut distinguer rôle pédagogique du profil et rôle/permission d'administration.

### F03 — L'activité dite « مباشرة » n'a pas de source fournie (élevé)

Le Worker inspecté sert les actifs et protège certains contenus ; aucun flux d'activité administrative en direct n'est démontré dans le contrat transmis. Le journal `audit_logs` ne représente que des actions administratives instrumentées, pas l'ensemble des connexions ou activités des élèves. Sans source et fraîcheur vérifiables, afficher « indisponible » plutôt qu'un flux fictif.

### F04 — Les 58 wilayas ne sont pas une statistique en soi (élevé)

La liste des 58 wilayas, leur libellé et le comptage par territoire doivent venir d'une source de référence et d'une agrégation autorisée côté serveur. Le code existant connaît les périmètres `code_wilaya` ; il ne prouve pas qu'une table relationnelle `wilayas(name)` soit disponible. Un agent ne doit jamais obtenir le classement national s'il n'a qu'un périmètre local.

### F05 — Les indicateurs d'état système ne sont pas mesurés (élevé)

Le « 99,9 % uptime » Cloudflare, l'état Supabase et le pourcentage de stockage ne peuvent pas être déduits des tables de profils/paiements. Ils nécessitent des sources de télémétrie ou APIs fournisseur, une période de mesure, un horodatage et une gestion des secrets côté serveur. Aucun chiffre de disponibilité ou de capacité ne doit être prérempli comme réel.

### F06 — « Immutable comme GitHub » est une affirmation trop large (critique)

Le dépôt contient `audit_logs` et un trigger de protection contre certaines modifications/suppressions par utilisateur authentifié. Cependant, le code SQL versionné de `immutable_row()` retourne `OLD` lorsque `auth.uid()` est NULL ; pour un trigger BEFORE DELETE, retourner OLD permet à la suppression de continuer. Les rôles privilégiés et les opérations hors contexte utilisateur ne sont donc pas couverts par une affirmation d'immutabilité absolue. Un propriétaire de base/administrateur privilégié reste hors de portée d'une garantie équivalente à un journal externe append-only. La formulation UI doit être limitée à ce qui est effectivement garanti et testé.

### F07 — Les reçus doivent être lus depuis la table et la fonction prévues (moyen)

Le dépôt prévoit `receipts`, une séquence et un trigger de numérotation, ainsi que la RPC `issue_receipt`. Un écran ne doit pas créer localement un numéro ou laisser croire qu'un reçu existe avant confirmation de la base. Le contrat d'accès réel et le périmètre restent à vérifier.

### F08 — Les actions utilisateurs/sécurité ne sont pas définies par les requêtes (critique)

Les extraits sont en lecture seule. Ils ne définissent pas les contrats sécurisés de consultation détaillée, modification, suppression, suspension, blocage ou surveillance. Aucun `UPDATE`/ `DELETE` direct depuis le navigateur ne doit être ajouté sans permission dédiée, contrôle serveur, audit, confirmation et tests négatifs.

### F09 — Recherche, filtres et pagination doivent être bornés côté serveur (élevé)

`order(created_at)` seul ne fournit ni pagination, ni limite maximale, ni filtre autorisé. Une récupération complète des profils ou des événements est à proscrire. Le serveur doit appliquer tri allowlisté, pagination stable, bornes et périmètre.

### F10 — Les états de chargement/erreur doivent être honnêtes (moyen)

Le code proposé ignore les erreurs et ne montre pas de contrat pour données nulles, permission refusée, table absente ou source indisponible. Une erreur ne doit jamais faire réapparaître des valeurs de démonstration ou un faux état « opérationnel ».

## 4. Réutilisation possible dans le dépôt — sous réserve de disponibilité distante

Le client versionné expose déjà notamment :

- `SB.admMyPerms()` pour les permissions et wilayas affectées ;
- `SB.admDashboard()` → RPC `admin_dashboard` ;
- `SB.admSearchStudents(q)` et `SB.admStudent(uid)` ;
- `SB.admReport(debut, fin)` → RPC `admin_report` ;
- `SB.admAuditLast(n)` pour les dernières entrées `audit_logs` ;
- `SB.admEntries()` pour les écritures comptables ;
- `SB.admQueue()`, `SB.admIssueReceipt(pid)` et `SB.admSetPaymentStatut(...)` pour les flux de paiement déjà prévus.

Ce sont des wrappers et scripts présents dans Git, pas une preuve que chaque migration/RPC est appliquée ou que chaque rôle passe les tests dans Supabase actif. La disponibilité distante, les policies effectives et les résultats par rôle doivent être confirmés avant raccordement. Ne pas remplacer ces contrats par les quatre requêtes brutes proposées.

## 5. Tests négatifs obligatoires avant intégration

1. Profil élève, parent ou enseignant appelle directement chaque RPC administrative → refus serveur.
2. Agent affecté à une wilaya demande les profils, paiements, recettes, audit et statistiques d'une autre wilaya → aucune donnée hors périmètre.
3. Un rôle ou code wilaya falsifié dans le navigateur → aucune élévation d'accès.
4. Appel de la jointure `user_roles/wilayas` si relation absente → erreur contrôlée, aucune donnée fictive.
5. Recherche de profils volumineuse → pagination et limite côté serveur.
6. Champ personnel non nécessaire → non sélectionné/non exposé.
7. Paiement `en_attente` ou `declare` → non comptabilisé comme recette encaissée.
8. Remboursement → déduit séparément, sans double comptabilisation.
9. Reçu non encore émis → aucun numéro affiché comme existant.
10. Table `security_analyses` absente, vide ou sans policy → état indisponible, aucune fuite.
11. Événement de sécurité falsifié depuis le navigateur → rejet/non considéré comme preuve.
12. Score élevé sans revue humaine → aucun blocage automatique.
13. Flux Realtime absent ou interrompu → pas de badge « مباشر » ni activité simulée.
14. API télémétrie indisponible → uptime/stockage « inconnu », jamais 99,9 % par défaut.
15. Tentative de suppression d'une entrée d'audit via rôle utilisateur et contexte privilégié contrôlé → résultat documenté ; la garantie d'immutabilité ne doit pas être surestimée.
16. Requête hors permission `reports.read` → refus, même si l'interface affiche la section.
17. Injection HTML dans pseudo, alerte, cible ou détail d'audit → rendu texte inerte.
18. Toute erreur PostgREST/RPC → message neutre et absence de fallback vers données de démonstration.

**Aucun de ces tests n'a été exécuté dans ce lot.** Ils constituent une matrice d'acceptation à exécuter dans un environnement autorisé avant activation.

## 6. Décision Go/No-Go

| Domaine | Décision |
|---|---|
| Descriptif des sept sections | GO comme liste de besoins, pas comme preuve de fonctionnalités |
| Quatre requêtes Supabase copiées telles quelles | NO-GO |
| Liste globale des profils | NO-GO sans permission, champs minimaux et pagination serveur |
| Synthèse utilisateurs | utiliser `admin_dashboard` après vérification distante |
| Finances | utiliser `admin_report` / `accounting_entries`, sans nouvelle fonction de facturation |
| Menaces | NO-GO tant que source fiable et contrôles Lot 295 ne sont pas validés |
| Activité directe et état système | NO-GO sans télémétrie réelle |
| 58 wilayas | agrégation serveur et périmètre requis |
| Journal d'audit | utiliser les entrées persistées ; limiter précisément la promesse d'immutabilité |
| Intégration au prototype | NO-GO en l'état |

## 7. Opérations non effectuées

Aucun fichier applicatif, route, ID, style ou module n'a été modifié. Aucune requête distante au projet Supabase n'a été exécutée. Aucun SQL, migration, table, fonction, policy RLS, grant, secret, réglage Auth, donnée, action administrative, opération financière, Worker, Cron, Realtime, e-mail, déploiement, achat ou coût n'a été créé, exécuté ou activé. Aucune nouvelle branche n'a été créée et `main` n'a pas été modifiée.

La PR #17 doit rester ouverte et non fusionnée. La validation CI du commit documentaire final doit être vérifiée séparément.
