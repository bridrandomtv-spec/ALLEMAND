# Lot 295 — audit sécurité et faisabilité du prototype de détection intelligente des activités suspectes

**Date :** 11 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Statut :** audit du descriptif et du code fourni ; aucune implémentation ni modification Supabase

## 1. Périmètre réellement reçu

Le matériel transmis est une spécification fonctionnelle en arabe accompagnée d'un extrait TypeScript/Deno et de deux définitions SQL. Aucun fichier HTML autonome, capture d'écran ni prototype visuel interactif n'est joint dans ce message. Le présent lot audite donc le contenu textuel et le code fourni ; il ne prétend pas avoir ouvert une page dans un navigateur.

Fonctions annoncées : moteur d'analyse, détection d'anomalies, profil comportemental, détail des menaces, terminal, simulation, réponses graduées et recommandations.

## 2. Écarts entre promesse et code fourni

| Promesse | Réalité de l'extrait | Conclusion |
|---|---|---|
| Analyse de six facteurs | Le code ne teste que localisation, heure, appareil et fréquence | Deux facteurs annoncés ne sont pas implémentés |
| Analyse comportementale | Comparaisons directes avec quelques valeurs du profil | Pas de modèle comportemental statistique/ML démontré |
| 99,2 % de précision / 0,8 % de faux positifs | Aucun jeu de test, échantillon, protocole ou métrique fourni | Chiffres non vérifiés, à retirer de l'interface |
| Réponse inférieure à 200 ms | Aucun benchmark ni mesure de bout en bout | Non démontré |
| Analyse IA complète en arabe | `analyzeEvent` est une fonction heuristique déterministe ; aucune API ou inférence IA | Ne pas présenter comme analyse IA réelle |
| Score de risque en pourcentage | Somme de poids fixes plafonnée à 100 | Indice heuristique, pas probabilité calibrée |
| Alertes détaillées | `triggerSecurityAlert` n'est pas défini dans l'extrait | Fonction d'alerte absente/non vérifiable |
| Terminal exécutable | Aucun parseur de commandes ni API d'action fourni | Interface annoncée, non implémentée |
| Simulation de menace | Aucun mécanisme fourni | À réaliser uniquement avec événements synthétiques isolés |
| Réponses automatiques | Aucun moteur de politique ni mécanisme d'exécution fourni | Non implémentées ; toute action sensible doit être explicitement autorisée et contrôlée |
| Graphiques et recommandations | Aucune source ni logique d'affichage fournie | Non démontrés |

## 3. Vulnérabilités et défauts critiques du code fourni

### C01 — Identité utilisateur contrôlée par le client (critique)

L'extrait lit `userId` depuis le JSON et l'utilise dans les requêtes et insertions. Un appelant peut substituer l'identifiant d'un autre compte. Le code n'extrait ni ne valide le Bearer token et ne prouve pas que l'appelant est propriétaire du compte ciblé.

**Correction requise :** authentifier la requête côté serveur avec Supabase Auth ; dériver l'identifiant exclusivement de l'utilisateur retourné par la validation serveur ; ignorer/refuser tout `userId` fourni dans le corps. Le compte d'analyse doit toujours être celui du jeton validé.

### C02 — Entrée événement entièrement non fiable (critique)

L'objet `event` est reçu directement du client. L'appelant peut falsifier localisation, horodatage, appareil, fréquence et type. Le score résultant peut être arbitrairement abaissé ou élevé.

**Correction requise :** collecter les événements à partir de points d'observation serveur fiables ; définir un schéma strict, une liste fermée de types, des bornes, un horodatage serveur et une protection anti-rejeu. Les champs calculés côté serveur ne doivent pas être acceptés comme faits déclarés par le navigateur.

### C03 — Accès service privilégié sans modèle de confiance (critique)

La fonction instancie un client avec `SUPABASE_SERVICE_ROLE_KEY`, qui contourne les politiques RLS. L'extrait ne montre ni authentification préalable ni autorisation. La clé ne doit jamais être exposée au navigateur et l'usage d'un rôle privilégié doit être limité au minimum.

**Correction requise :** vérifier l'identité avant toute opération ; préférer un client lié au JWT utilisateur lorsque cela suffit ; si un accès privilégié est indispensable, isoler la fonction, limiter les opérations et dériver les identifiants côté serveur. Ne pas créer de table exposée sans RLS, grants minimaux et tests d'accès croisé.

### C04 — Profil absent ou incomplet non traité (élevé)

`single()` peut retourner une erreur ou aucune ligne ; `profile` peut être nul. Les appels `profile.known_locations.includes` et `profile.known_devices.includes` peuvent provoquer une exception. Les tableaux peuvent aussi être nuls ou mal formés.

**Correction requise :** traiter explicitement le profil manquant, les erreurs DB et chaque champ nullable ; définir un état « données insuffisantes » plutôt qu'un score arbitraire ; ne pas bloquer une connexion légitime sur un profil froid.

### C05 — Champs d'événement et profil non validés (élevé)

Aucune validation n'est visible pour `event.type`, `timestamp`, `frequency`, `location`, `device_fingerprint` ou les champs du profil. Les valeurs invalides, très anciennes, futures, négatives ou surdimensionnées peuvent fausser les comparaisons et la persistance.

**Correction requise :** validation runtime stricte, limite de taille du corps, types et plages, rejet des clés inconnues, gestion explicite des timestamps et normalisation serveur.

### C06 — Profil comportemental empoisonnable (élevé)

Si les événements reçus du client alimentent ensuite les heures, lieux, appareils ou fréquences habituels, un attaquant peut progressivement faire accepter son activité comme normale. Le prototype ne définit ni provenance, ni période d'apprentissage, ni robustesse contre les valeurs aberrantes.

**Correction requise :** n'apprendre qu'à partir d'événements serveur de confiance ; période d'observation, seuil minimal d'échantillons, plafonds de mise à jour, détection de dérive, validation des changements et mécanisme de remise à zéro contrôlé.

### C07 — Données personnelles et empreinte d'appareil (élevé)

Les localisations détaillées et empreintes d'appareil peuvent être des données sensibles ou fortement identifiantes. Le schéma proposé les stocke sans finalité détaillée, rétention, contrôle d'accès, minimisation ni mécanisme de suppression.

**Correction requise :** documenter la finalité et la base de traitement ; minimiser la précision géographique ; ne pas construire une empreinte persistante invasive par défaut ; préférer des signaux limités, pseudonymisés, à durée courte et avec accès restreint. Ne jamais stocker de géolocalisation précise si une région approximative suffit.

### C08 — Score présenté comme probabilité (élevé)

Les poids fixes 30/20/25/15 et le plafond 100 ne constituent pas une probabilité. L'addition n'intègre ni corrélation entre signaux, ni qualité de donnée, ni taux de base, ni calibration.

**Correction requise :** appeler ce résultat « indice heuristique » tant qu'un modèle calibré n'est pas évalué ; documenter les facteurs, leur provenance et l'incertitude ; ne jamais annoncer une précision ou un taux de faux positifs sans protocole reproductible.

### C09 — Action de blocage insuffisamment spécifiée (critique)

La recommandation `block` est seulement une chaîne renvoyée. Aucun mécanisme sûr d'application, de révocation de session ou de recours n'est décrit. Un score erroné pourrait entraîner un blocage injustifié.

**Correction requise :** séparer détection et décision d'application ; privilégier notification/observation pour les signaux faibles ; imposer une politique graduée, des seuils testés, une confirmation ou revue humaine pour les actions à fort impact, un journal d'audit et un mécanisme de récupération. Aucun blocage automatique ne doit être activé par défaut.

### C10 — Gestion HTTP, erreurs et abus absente (élevé)

L'extrait ne contrôle pas la méthode HTTP, le type de contenu, la taille du corps, CORS, le débit, les appels répétés, les erreurs Supabase ou les réponses d'erreur. Il ne montre pas non plus de validation de l'origine ou de protection anti-rejeu.

**Correction requise :** endpoint POST uniquement, authentification obligatoire, validation JSON stricte, taille maximale, réponses génériques, limitation par compte et IP lorsque légalement et techniquement justifiée, idempotence, métriques expurgées et tests de charge.

### C11 — Écriture d'analyse non vérifiée (élevé)

Le résultat de l'insertion dans `security_analyses` est ignoré. Une erreur de stockage peut laisser l'interface annoncer une analyse qui n'a pas été persistée. Le code ne définit ni unicité, ni idempotence, ni traitement des doublons.

**Correction requise :** contrôler chaque résultat, utiliser un identifiant d'événement/déduplication serveur, distinguer analyse calculée de analyse enregistrée et ne jamais déclarer une réussite si la persistance requise a échoué.

### C12 — Fonction d'alerte absente et effets secondaires non bornés (élevé)

`triggerSecurityAlert` est référencée mais non fournie. Son autorisation, son idempotence, ses limites, son canal et sa gestion d'erreur sont inconnus.

**Correction requise :** spécifier séparément les canaux d'alerte, la déduplication, les seuils, les limites de fréquence et la confidentialité avant toute implémentation.

## 4. Revue du schéma SQL proposé

Les deux tables sont des brouillons incomplets et ne doivent pas être exécutés tels quels.

- Aucune activation de RLS ni aucune policy n'est fournie.
- Aucun GRANT/REVOKE n'est défini ; l'exposition Data API n'est pas maîtrisée.
- `security_analyses.user_id` est nullable dans le SQL fourni, alors qu'une analyse doit être rattachée à un acteur validé ou à une classe d'événement système explicitement définie.
- `event_type` et `recommendation` sont des TEXT sans contraintes de valeurs autorisées.
- `risk_score` ne possède aucune contrainte de plage.
- `factors` accepte tout JSON sans schéma ni taille maximale.
- `created_at` doit être un horodatage avec fuseau et généré côté serveur.
- `last_updated` doit être maintenu côté serveur ; le client ne doit pas pouvoir modifier directement le profil de référence.
- `known_locations` et `known_devices` sont des listes non bornées, sans règle de rétention ni provenance.
- Les index nécessaires à la recherche par compte/période ne sont pas spécifiés.
- Les règles de suppression, d'export et de conservation ne sont pas définies.
- Il manque un modèle distinct pour les événements bruts de confiance, les décisions, les alertes et les actions réellement exécutées ; ne pas mélanger observation, score, recommandation et sanction dans une seule table.

## 5. Architecture cible recommandée (à concevoir, pas à déployer)

1. **Collecte fiable :** seuls des points serveur identifiés produisent les événements de sécurité ; le client ne peut que transmettre des signaux non autoritatifs et explicitement étiquetés comme tels.
2. **Authentification :** valider le JWT auprès de Supabase Auth ; dériver le propriétaire de la réponse validée.
3. **Normalisation :** schéma strict, type d'événement allowlisté, timestamp serveur, déduplication, limite de débit.
4. **Analyse :** commencer par des règles déterministes explicables et testées ; introduire un modèle ML uniquement après constitution d'un jeu de données légitime, représentatif et évalué.
5. **Stockage :** séparer événements minimisés, profils, analyses, alertes et actions ; schémas non exposés ou tables exposées avec RLS et grants minimaux.
6. **Décision :** un score ne bloque jamais seul un compte ; actions à fort impact réversibles, proportionnées et auditées.
7. **Interface :** afficher source, date, facteurs et niveau d'incertitude ; les commandes terminal ne doivent appeler que des actions serveur explicitement autorisées, jamais du SQL ni des commandes système arbitraires.
8. **Simulation :** utiliser des événements synthétiques marqués, non mélangés aux données réelles, sans effet sur les sessions ou comptes.
9. **Mesure :** mesurer précision, rappel, faux positifs, faux négatifs, latence p50/p95/p99 sur un jeu de validation séparé ; afficher « non mesuré » tant que les mesures n'existent pas.
10. **Gouvernance :** politique de conservation, accès, suppression, explication, recours et revue des décisions avant mise en service.

## 6. Matrice de tests négatifs à ajouter

| ID | Scénario | Résultat attendu |
|---|---|---|
| T01 | Appel sans jeton | 401, aucune lecture/écriture |
| T02 | Jeton invalide/expiré | Refus, aucun effet |
| T03 | userId d'un autre compte dans le corps | Ignoré/refusé ; compte issu du JWT uniquement |
| T04 | Événement avec lieu/appareil/fréquence falsifiés | Signaux non fiables exclus de l'analyse autoritative |
| T05 | Profil absent | Résultat « données insuffisantes », aucune exception |
| T06 | Profil avec tableaux null/malformés | Traitement sûr, aucune exception |
| T07 | Timestamp futur/ancien ou invalide | Rejet ou quarantaine selon règle explicite |
| T08 | Corps trop volumineux / champs inconnus | 400/413, aucune écriture |
| T09 | Rafale d'événements ou rejeu | Limitation et déduplication |
| T10 | Accès lecture/écriture croisé entre deux comptes | Refus RLS/serveur |
| T11 | Rôle anon | Aucun accès aux tables privées |
| T12 | Profil modifié directement par le client | Refus |
| T13 | Événement synthétique de simulation | Isolé, aucun blocage/alerte réelle |
| T14 | Score élevé isolé | Pas de blocage automatique non autorisé |
| T15 | Échec insertion analyse | État d'erreur honnête, aucune fausse réussite |
| T16 | Alerte déjà émise pour événement identique | Déduplication |
| T17 | Injection dans facteurs/recommandations | Encodage UI, aucun HTML/script exécuté |
| T18 | Suppression de compte | Effacement/expiration selon politique approuvée |
| T19 | Tentative d'exposition de la clé privilégiée | Aucun secret dans client, réponse ou logs |
| T20 | Profil empoisonné par répétition de signaux | Pas d'apprentissage automatique non borné |
| T21 | Données de localisation absentes | Analyse fonctionne sans inventer une localisation |
| T22 | Temps de calcul élevé ou dépendance indisponible | Timeout maîtrisé, aucun état incohérent |

## 7. Conditions de sortie avant toute implémentation

- Authentification et autorisation par propriétaire démontrées.
- Sources serveur réelles et sémantique des événements inventoriées.
- Modèle de menace, minimisation, rétention et suppression approuvés.
- Schéma SQL final, RLS, grants, index et tests d'accès croisé revus.
- Analyse initiale explicable et gestion du profil froid testées.
- Aucune mesure de performance ou de précision affichée sans benchmark documenté.
- Simulation isolée et actions de réponse désactivées par défaut.
- Tests négatifs T01–T22 exécutés dans un environnement isolé avant toute activation.

## 8. Décision du Lot 295

**NO-GO pour l'exécution du code fourni et pour toute création de tables/fonctions dans le projet réel.** Le code présente des risques majeurs d'usurpation d'identité, d'entrée falsifiable et d'usage non encadré d'un rôle privilégié. Le schéma SQL ne contient pas les contrôles d'accès indispensables. Les chiffres de performance ne sont pas démontrés.

Le prototype est suffisamment décrit pour clore son audit textuel initial, mais une maquette HTML/captures reste nécessaire pour auditer l'interface, les graphiques, les interactions et le rendu mobile/desktop.

## 9. Opérations non effectuées

Aucun SQL ni migration exécuté. Aucune table, fonction Edge, policy RLS, grant, secret, réglage Auth, trigger, modèle ML, alerte, action de blocage, terminal connecté ou collecte d'appareil/localisation créé ou activé. Aucun e-mail, déploiement, achat ou coût. PR #17 reste ouverte et non fusionnée ; `main` inchangée.
