# Lot 288 — contrat de données et matrice des accès des rapports périodiques

**Date :** 11 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Statut :** proposition documentaire ; aucune migration ni modification distante

## 1. Principes non négociables
- Séparer les préférences visibles par leur propriétaire des journaux et états de traitement réservés au serveur.
- Ne jamais accepter `user_id`, le destinataire, le statut `sent`, l'heure d'envoi ou l'identifiant fournisseur comme valeurs faisant autorité lorsqu'ils proviennent du navigateur.
- Dériver l'identité de `auth.uid()` pour les opérations directes de l'élève et du résultat d'une validation serveur Supabase Auth pour les opérations Worker.
- Ne conserver ni access token, refresh token, adresse IP, user-agent, mot de passe, contenu de message privé ni adresse e-mail en clair dans le journal d'événements.
- Toute donnée d'activité doit être qualifiée par sa source et sa sémantique exacte. Pas de rétroactivité ni de métriques inventées.
- Ne pas exposer le schéma privé via la Data API Supabase. Les tables de traitement sont réservées au serveur.

## 2. Modèle logique proposé

### 2.1 `public.security_report_preferences` — préférences du propriétaire
Une ligne au plus par compte, clé primaire `user_id` avec référence à `auth.users(id)` et suppression en cascade. `user_id` est fourni par défaut via `auth.uid()` et n'est pas modifiable par l'utilisateur après création.

| Champ | Type logique | Règle |
|---|---|---|
| user_id | uuid | PK, FK auth.users, valeur issue de auth.uid() |
| enabled | boolean | false par défaut ; aucun envoi tant que false |
| frequency | enum/texte contrôlé | disabled, daily, weekly, monthly |
| weekday | smallint nullable | 0–6 ; requis uniquement pour weekly |
| monthday | smallint nullable | 1–31 ; requis uniquement pour monthly |
| local_time | time nullable | heure locale choisie |
| timezone | text nullable | identifiant IANA, validé côté serveur |
| language | texte contrôlé | ar, fr ou en |
| categories | jsonb contrôlé | objet de booléens avec les six clés confirmées dans la maquette : login_history, security_alerts, active_devices, security_score, geographic_locations, security_recommendations |
| created_at / updated_at | timestamptz | générés côté base, jamais fournis par le navigateur |

Contraintes : `enabled = false` et `frequency = disabled` par défaut ; fréquence hebdomadaire exige weekday ; fréquence mensuelle exige monthday ; les champs non pertinents doivent être NULL. Une fréquence active exige heure, fuseau et langue valides. La règle de fin de mois (par exemple jour 31) doit être fixée explicitement avant migration ; aucune règle implicite n'est supposée.

La maquette source confirme exactement six catégories : سجل الدخول (historique des connexions), التنبيهات الأمنية (alertes de sécurité), الأجهزة النشطة (appareils actifs), درجة الأمان (score de sécurité), المواقع الجغرافية (localisations géographiques) et التوصيات الأمنية (recommandations de sécurité). Ces libellés sont la liste blanche fonctionnelle de référence. Leur présence dans la maquette ne prouve toutefois pas que les données existent : chaque catégorie reste indisponible tant qu'une source fiable, autorisée et suffisamment complète n'est pas définie. Aucun score, lieu, appareil ou alerte ne doit être inventé.

### 2.2 `private.security_report_events` — événements observés côté serveur
Journal append-only, non exposé à la Data API. Champs proposés :
- `id uuid` : identifiant généré par la base ;
- `actor_id uuid` : compte concerné, FK vers `auth.users(id)` avec suppression en cascade ;
- `event_type text` : liste fermée, initialement `app_access_observed` seulement ;
- `source text` : composant serveur ayant observé l'événement ;
- `occurred_at timestamptz` : horodatage serveur ;
- `dedupe_key text` : clé opaque créée côté serveur, unique dans le périmètre défini ;
- `schema_version smallint` : version du contrat d'événement.

Pas de colonne libre `metadata` dans la première version. Une nouvelle catégorie d'événement exige une revue de minimisation, un schéma explicite et des tests. L'événement `app_access_observed` signifie qu'une requête authentifiée a été validée côté serveur ; il ne signifie pas nécessairement que l'utilisateur a vu la page, est resté actif ou s'est déconnecté.

### 2.3 `private.security_report_runs` — exécutions logiques
Une exécution par compte, période et type de rapport. Champs proposés : `id`, `actor_id`, `report_type`, `period_start`, `period_end`, `language`, `status`, `idempotency_key`, `created_at`, `started_at`, `completed_at`, `error_code` expurgé et `schema_version`.
- Unicité sur `(actor_id, report_type, period_start, period_end)` et sur la clé d'idempotence.
- `period_start` inclusif et `period_end` exclusif ; les deux sont stockés en UTC après calcul selon le fuseau de préférence.
- États autorisés : `queued`, `building`, `ready`, `failed`, `cancelled`.
- Aucun HTML rendu, contenu libre sensible ou adresse destinataire n'est conservé dans la première version ; les agrégats nécessaires sont recalculables à partir des événements retenus.

### 2.4 `private.security_report_deliveries` — état d'envoi
Une ligne logique par exécution, avec `execution_id` unique, `provider`, `provider_message_id` nullable, `status`, `attempt_count`, `last_attempt_at`, `accepted_at`, `next_retry_at`, `lease_until` et `error_code` expurgé.
- États autorisés : `pending`, `sending`, `accepted`, `failed`, `cancelled`, `unknown`.
- `accepted` signifie acceptation par le fournisseur, jamais livraison, ouverture ou lecture.
- Le destinataire est résolu à l'exécution depuis l'adresse confirmée dans Supabase Auth ; il n'est pas accepté depuis le navigateur ni conservé en clair dans cette table.
- La prise en charge d'une livraison doit être atomique (verrou/claim avec bail) afin d'empêcher deux workers concurrents de l'envoyer simultanément.
- Si le fournisseur ne permet pas une clé d'idempotence fiable et qu'une réponse est perdue après acceptation possible, passer à `unknown` et réconcilier avant toute nouvelle tentative. Ne pas prétendre garantir l'exactly-once.

## 3. Matrice d'accès proposée

| Objet | Élève authentifié | `anon` | Worker/serveur privilégié |
|---|---|---|---|
| Préférences : SELECT | ses propres lignes | refusé | lecture nécessaire |
| Préférences : INSERT | sa ligne, `user_id` dérivé de `auth.uid()` | refusé | autorisé selon tâche |
| Préférences : UPDATE | colonnes de préférence de sa ligne seulement | refusé | autorisé selon tâche |
| Préférences : DELETE | refusé ; désactivation via UPDATE | refusé | suppression contrôlée lors de la suppression du compte |
| Événements | aucun accès direct | aucun accès | INSERT/SELECT minimaux nécessaires |
| Exécutions | aucun accès direct dans la première version | aucun accès | accès de traitement |
| Livraisons | aucun accès direct dans la première version | aucun accès | accès de traitement |

Pour `public.security_report_preferences`, RLS doit être activée et les politiques doivent utiliser `auth.uid() = user_id` en `USING` et `WITH CHECK`. Les privilèges SQL doivent limiter INSERT/UPDATE aux colonnes de préférence : pas de modification de `user_id`, `created_at` ou `updated_at`. La création utilise le défaut `auth.uid()` ; une contrainte garantit qu'aucune ligne d'un autre utilisateur ne peut être créée.

Pour les tables du schéma `private`, ne créer aucune policy destinée aux rôles navigateur et ne leur accorder aucun privilège de table ou de fonction. Le schéma doit rester non exposé par la configuration API. L'accès serveur devra être limité à des opérations nommées et vérifiées ; ne pas distribuer la clé `service_role` au client.

## 4. Identité et destinataire
### Requête de préférences depuis le navigateur
- L'utilisateur est identifié par la session Supabase et `auth.uid()` dans PostgreSQL.
- Toute tentative de transmettre un autre `user_id` doit échouer, même si le client modifie sa requête.
- Le navigateur ne peut ni choisir ni modifier l'adresse de destination.

### Génération et envoi côté serveur
- Valider le Bearer token auprès de Supabase Auth `/auth/v1/user` avant toute lecture/écriture au nom de l'utilisateur.
- Dériver `actor_id` uniquement de la réponse validée ; ne pas se fier à un profil local, à un champ de corps ou à un état de session mis en cache.
- Lire l'adresse du compte côté serveur et exiger l'état confirmé. Si elle est absente/non confirmée, ne pas créer de tentative d'envoi.
- Les tâches planifiées ne sont pas des requêtes utilisateur : elles nécessitent une authentification interne distincte, un secret conservé côté serveur, une rotation maîtrisée et une limitation de débit.

## 5. Cycle de vie, suppression et rétention
- Les préférences sont supprimées avec le compte via FK `ON DELETE CASCADE`.
- Les événements, exécutions et livraisons doivent être supprimés ou anonymisés selon une politique documentée lors de la suppression du compte ; ne pas laisser de données orphelines.
- Les durées de rétention des événements, exécutions et états fournisseur restent à décider avant migration. Aucune durée arbitraire n'est imposée ici.
- Une purge planifiée devra être vérifiable et idempotente ; sa mise en place est hors périmètre de ce lot.
- Les erreurs persistées sont des codes bornés, jamais le corps complet d'une réponse fournisseur, un jeton ou une adresse e-mail.

## 6. Questions de conception bloquantes
1. Les six catégories sont désormais relevées dans la source ; leur disponibilité réelle reste conditionnée à l'existence d'une source fiable pour chacune.
2. Fixer la règle mensuelle pour les jours absents (ex. 29–31) et les transitions DST : heure locale inexistante ou répétée.
3. Fixer les durées de rétention et les règles d'effacement/anonymisation.
4. Décider si l'élève doit consulter un historique d'envoi dans l'interface ; si oui, exposer ultérieurement une vue/RPC filtrée sur auth.uid(), jamais les tables de livraison directement.
5. Vérifier les capacités d'idempotence et de réconciliation du fournisseur retenu avant de définir le comportement de reprise.
6. Le prototype ne comporte aucun sélecteur de fuseau horaire : le champ timezone est une exigence technique, pas un choix déjà présenté à l'élève. Décider si le fuseau est proposé depuis le navigateur puis confirmé/éditable, ou choisi explicitement.

## 7. Tests négatifs requis avant toute migration
| ID | Test | Résultat attendu |
|---|---|---|
| D01 | Élève A lit les préférences de B | 0 ligne visible / refus |
| D02 | Élève A modifie les préférences de B | refus, aucune modification |
| D03 | Élève A tente d'insérer `user_id` de B | refus par privilège/contrainte |
| D04 | `anon` lit ou modifie les préférences | refus |
| D05 | Élève modifie `created_at`, `updated_at` ou `user_id` | impossible par privilèges de colonnes |
| D06 | Rôle navigateur lit/écrit les tables `private` | refus |
| D07 | Client soumet un faux destinataire ou statut `accepted` | champ ignoré/non accepté ; aucune livraison créée |
| D08 | Jeton absent, expiré ou invalide au Worker | refus avant tout accès aux données privées |
| D09 | Email Auth absent/non confirmé | aucune livraison |
| D10 | Deux workers réclament la même livraison | un seul claim valide |
| D11 | Fournisseur accepte puis réponse réseau perdue | état `unknown`, pas de renvoi aveugle |
| D12 | Suppression de compte | préférences et données associées supprimées/anonymisées selon règle validée |
| D13 | Événement non allowlisté ou metadata inattendue | rejet ; aucune donnée libre persistée |
| D14 | Purge exécutée deux fois | résultat idempotent, aucune erreur ni rétention excessive |

Ces tests sont une matrice à exécuter dans un environnement isolé ; aucun résultat n'est déclaré réussi dans ce document.

## 8. Décision de sortie du Lot 288
Le contrat sépare les préférences utilisateur des données de traitement privées et fixe les frontières d'identité, de destinataire, de statut et de rétention. Les catégories exactes, règles de calendrier, rétention et capacité d'idempotence fournisseur restent des décisions bloquantes.

**Aucune migration SQL, table, fonction, policy RLS, grant, secret, réglage Auth, endpoint, Worker, Cron, e-mail ou déploiement n'a été créé ou modifié.** La prochaine étape ne peut être une migration qu'après validation explicite des points bloquants et autorisation distincte.

## 9. Addendum Lot 289 — vérification de la maquette source

La maquette HTML source de 759 lignes a été relue, notamment les blocs « محتوى التقرير », « جدولة الإرسال » et « إعدادات البريد ».

### Liste blanche exacte confirmée
1. سجل الدخول — historique des connexions.
2. التنبيهات الأمنية — alertes de sécurité.
3. الأجهزة النشطة — appareils actifs.
4. درجة الأمان — score de sécurité.
5. المواقع الجغرافية — localisations géographiques.
6. التوصيات الأمنية — recommandations de sécurité.

La maquette ne présente pas de sélecteur de fuseau horaire. Elle propose la fréquence quotidien/hebdomadaire/mensuel, le jour pour la fréquence hebdomadaire et des heures prédéfinies. Le champ IANA timezone reste donc une exigence technique, mais son mode d'alimentation est une décision produit à prendre avant l'implémentation.

### Correspondance avec les données réellement disponibles
- Historique des connexions : pas encore de journal applicatif élève complet ; la source doit être construite et sa sémantique limitée à ce qui est effectivement observé.
- Alertes de sécurité : la maquette ne définit ni catalogue d'alertes ni source d'événements. Les alertes fictives de l'aperçu ne sont pas des alertes réelles.
- Appareils actifs : aucune source applicative complète n'a été identifiée ; ne pas déduire les appareils depuis un simple nombre de sessions.
- Score de sécurité : aucune formule, pondération ou référence comparative n'est spécifiée ; ne pas afficher le score de démonstration ni un pourcentage inventé.
- Localisations géographiques : la maquette ne définit ni provenance ni précision ; aucune géolocalisation ne doit être inventée ou déduite d'une adresse IP non collectée.
- Recommandations de sécurité : elles peuvent être éditoriales et statiques, mais doivent être séparées des constats personnalisés issus des événements du compte.

### Autres champs de la maquette à ne pas reprendre tels quels
- Adresse ahmed@email.com : valeur fictive préremplie ; le destinataire doit être résolu côté serveur depuis l'adresse Auth confirmée.
- Date, statistiques, historique, appareil, lieu et score de l'aperçu : valeurs de démonstration, pas des données utilisateur.
- Bouton « إرسال تجريبي » : le prototype simule un succès via temporisation ; il ne prouve aucun envoi.
- Fuseau horaire : absent de l'interface source, décision produit/technique encore ouverte.

### Décisions restant bloquantes
- Règle mensuelle pour les jours 29–31 et règle DST pour les heures inexistantes ou répétées.
- Politique et durées de rétention/suppression.
- Mode d'obtention et de confirmation du fuseau horaire.
- Sources et définitions métier acceptables pour alertes, appareils, score et géographie.
- Idempotence et procédure de réconciliation du fournisseur d'e-mail.

**Résultat :** les six libellés du prototype sont confirmés dans le contrat. Cela clôt la vérification documentaire des catégories, mais pas la disponibilité des données ni l'autorisation d'implémenter. Aucun SQL, objet Supabase, secret, e-mail, Worker, Cron ou déploiement n'a été modifié.