# Lot 296 — audit sécurité et faisabilité du prototype de tableau de bord administratif global

**Date :** 11 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Statut :** audit statique du HTML/JavaScript fourni et comparaison avec les sources du dépôt ; aucune intégration ni modification Supabase

## 1. Périmètre et décision

Le matériel reçu est un document HTML autonome RTL comprenant sept vues : aperçu, utilisateurs, sécurité, finances, wilayas, système et journal d'audit. Le code a été examiné statiquement. Aucun lancement navigateur, test mobile réel, appel réseau de ce prototype ni test de données en production n'a été effectué.

**Décision : NO-GO pour intégrer ou publier ce prototype en l'état.** Il peut servir de référence de composition visuelle, mais pas de base fonctionnelle ou de source de vérité. La plupart des chiffres, alertes, activités, états de services et entrées du journal sont codés en dur. Plusieurs actions affichées ne font rien ou simulent une réussite. L'absence de garde d'accès côté serveur dans ce fichier rendrait son intégration dangereuse sans reconstruction de l'accès à partir des RPC et politiques existantes.

Aucune donnée de démonstration ne doit être présentée comme une donnée réelle.

## 2. Écarts fonctionnels observés dans le prototype

| Zone | Ce que le code fourni fait réellement | Conclusion |
|---|---|---|
| Cartes KPI | Valeurs littérales : 1 245 utilisateurs, 342 actifs, 7 menaces, 12,5 M DZD | Données fictives, aucune requête |
| Croissance et rôles | Tableaux statiques transmis à Chart.js | Aucun calcul à partir de la base |
| Activité « en direct » | Tableau JavaScript constant ; aucune souscription Realtime, polling ou source d'événements | Simulation, pas du direct |
| Alertes sécurité | Deux cartes HTML préremplies | Aucun flux d'alertes démontré |
| Utilisateurs | Trois lignes fictives ; filtres et pagination sans gestionnaire | Pas de recherche, pagination ni gestion effective |
| Boutons utilisateur | Voir, modifier, supprimer et ajouter sans action associée | Contrôles inertes |
| Sécurité | Score et compteurs codés en dur ; boutons de décision sans traitement | Ni détection ni réponse exécutée |
| Finance | Chiffres, abonnements et reçus fictifs ; aucun calcul comptable | Aucun rapport financier vérifiable |
| Wilayas | Trois cartes seulement, malgré le titre « 58 wilayas » | Couverture nationale non implémentée |
| Système | Disponibilité, état Supabase et capacité de stockage écrits en dur | Aucun contrôle de santé ou télémétrie |
| Audit | Deux lignes statiques ; aucun chargement depuis le journal | L'affirmation « non modifiable » n'est pas démontrée |
| Recherche et notifications | Boutons sans gestionnaires | Inertes |
| Déconnexion | Affiche uniquement une notification ; n'appelle pas Supabase Auth signOut | La session ne serait pas fermée |

Le libellé « dernière mise à jour : il y a 30 secondes » et les indicateurs « مباشر » ne sont pas synchronisés avec une horloge ni avec une source distante.

## 3. Constats de sécurité et de gouvernance

### A01 — Absence de contrôle d'accès dans le prototype (critique)

Le fichier autonome ne valide aucune session, aucun utilisateur et aucun rôle avant d'afficher les vues. Le contrôle visuel d'un bouton ou le masquage d'une page ne constitue jamais une autorisation. Si les données réelles étaient injectées dans ce HTML, elles pourraient être exposées à toute personne pouvant charger la page, sauf contrôle serveur indépendant.

**Exigence :** l'API/RPC doit authentifier le JWT et vérifier la permission pour chaque opération. Aucun accès aux données administratives ne doit dépendre d'un booléen JavaScript ou d'un rôle transmis par le navigateur.

### A02 — Modèle « accès complet » incompatible avec le moindre privilège (élevé)

Le profil « المدير العام / صلاحيات كاملة » et la navigation uniforme ne distinguent pas les tâches ni les périmètres. Le dépôt contient déjà un modèle plus précis : rôles administratifs, permissions telles que `students.read`, `payments.validate`, `reports.read`, et affectations par wilaya. Les fonctions SQL `admin_dashboard`, `admin_report` et `admin_student` vérifient les permissions côté serveur et appliquent le périmètre géographique.

**Exigence :** conserver les rôles et permissions serveur existants ; masquer/afficher les sections selon les permissions retournées, mais faire respecter chaque permission et chaque wilaya dans SQL/RLS/RPC. Un agent d'une wilaya ne doit jamais recevoir les données nationales.

### A03 — Deux chemins d'administration coexistent dans le dépôt (élevé)

Le fichier existant `admin.js` comporte un chemin historique basé sur `profiles.role === 'admin'` et des appels génériques (`listProfiles`, `listNotes`, `listSubs`, `adminPayments`, etc.). Le même client expose aussi les appels plus récents `admMyPerms`, `admDashboard`, `admStudent`, `admReport`, `admQueue` et `admAuditLast`, conçus pour s'appuyer sur les contrôles serveur et les périmètres.

Ce dédoublement peut produire des vues et des autorisations incohérentes. Le prototype ne choisit ni n'intègre explicitement l'un de ces chemins.

**Exigence :** avant toute intégration, établir une matrice unique « écran → permission → RPC/table → périmètre » et retirer de ce nouvel écran les lectures/écritures génériques non nécessaires. Ne pas ajouter un troisième modèle de rôles.

### A04 — Données personnelles excessives dans les tableaux (élevé)

Le prototype montre des adresses e-mail complètes, des noms, des rôles, des lieux et des heures d'activité. Il ne définit ni finalité, ni masquage, ni journalisation des consultations, ni limitation par rôle, ni durée de conservation.

**Exigence :** afficher les identifiants minimaux nécessaires ; masquer les coordonnées dans les listes ; charger les détails sur demande avec permission dédiée ; tracer les consultations sensibles et appliquer une rétention approuvée.

### A05 — « Activité en direct » sans source de données fiable (élevé)

Le dépôt ne fournit pas, dans le Worker inspecté, de flux d'activité administrative ou de point d'entrée Realtime pour alimenter ces cartes. Les audits précédents ont également établi que les journaux existants ne constituent pas un historique exhaustif des connexions et de l'activité pédagogique. Le journal administratif `audit_logs` ne doit pas être présenté comme un flux complet de toutes les actions des élèves.

**Exigence :** définir les événements collectés, leur provenance serveur, leur granularité, les permissions, la rétention et les limites avant d'afficher une activité. En attendant, retirer l'étiquette « direct » et afficher un état vide honnête.

### A06 — Actions sensibles non reliées à une autorisation serveur (critique)

Les boutons de blocage, de surveillance, de suppression, de modification et de validation sont purement décoratifs dans le code fourni. Une future implémentation ne doit pas relier ces boutons à des mises à jour directes de tables ou à des identifiants contrôlés par le client.

**Exigence :** chaque action doit appeler une RPC dédiée qui revalide la permission, la cible et le périmètre ; prévoir confirmation, motif, résultat explicite, idempotence et trace d'audit. Les opérations irréversibles doivent être exclues tant que leur politique et leur procédure de récupération ne sont pas approuvées.

### A07 — Indicateurs de sécurité non étayés (élevé)

Le score 99,2 %, le nombre de menaces et les alertes ne sont associés à aucun jeu d'événements, aucune formule, aucun protocole de mesure ni aucun endpoint. Le prototype ne contient pas de moteur de détection.

**Exigence :** retirer les pourcentages et compteurs non mesurés. Distinguer « événements observés », « alertes confirmées » et « éléments en cours d'examen ». Une mesure de précision exige un protocole reproductible et un échantillon évalué.

### A08 — Indicateurs système non vérifiables (élevé)

Les valeurs 99,9 %, « Supabase sain » et 78 % de stockage sont des constantes. Le Worker inspecté ne publie pas de route de santé ou de métriques pour cette interface ; le prototype ne réalise aucun contrôle de disponibilité.

**Exigence :** ne présenter que des mesures réellement collectées, avec source, horodatage, période et état d'indisponibilité. Ne jamais déduire la disponibilité globale d'un seul test client.

### A09 — Chiffres financiers et sémantique comptable non définis (élevé)

Les montants de revenu, les paiements en attente et les abonnements actifs sont statiques. Un total d'abonnements actifs n'est pas automatiquement un encaissement : il faut distinguer paiements confirmés, remboursements, dépenses, écritures comptables et rapprochements. Le dépôt contient des contrats SQL distincts pour paiements, écritures comptables et rapports scopés, mais leur présence dans Git ne prouve pas qu'ils sont appliqués au projet distant.

**Exigence :** aucune valeur financière ne doit être inventée ou calculée depuis des abonnements non encaissés. Toute consultation éventuelle doit réutiliser une source comptable validée, un périmètre autorisé et des dates explicites. Ce lot n'ajoute aucun parcours de facturation, de paiement, de tarification ou de monétisation.

### A10 — Journal déclaré immuable sans preuve de connexion (élevé)

Le titre « سجل التدقيق (غير قابل للتغيير) » est suivi de deux événements codés en dur. Le prototype ne lit pas `audit_logs` et ne démontre aucune propriété d'immutabilité. Le dépôt contient un journal et des protections SQL documentées pour certaines opérations administratives ; cela ne transforme pas les deux lignes de la maquette en journal réel.

**Exigence :** afficher les lignes issues du journal serveur, avec pagination, horodatage, acteur, action, cible et périmètre. L'immutabilité doit être garantie par la base et testée, pas annoncée par un titre.

### A11 — Injection DOM potentielle lors du branchement des données (élevé)

Les fonctions `populateLiveActivity` et `showNotification` construisent du HTML via `innerHTML` et interpolent des valeurs. Les tableaux actuels sont constants, mais les mêmes fonctions deviendraient un vecteur XSS si elles recevaient ultérieurement des noms, libellés ou messages issus de profils, événements ou alertes.

**Exigence :** utiliser `textContent` et les API DOM pour les valeurs textuelles ; si du HTML doit être construit, échapper systématiquement chaque donnée non fiable et valider les noms de classes/icônes avec des listes fermées.

### A12 — Dépendances externes et divergence de thème (moyen)

La maquette charge Tailwind depuis son CDN, Chart.js et Lucide depuis des CDN externes, sans versions intégrées au dépôt ni stratégie d'intégrité/CSP visible. Elle ne respecte pas la préférence de l'application pour le JavaScript/CSS natif sans ajout de dépendance frontend. Le prototype bascule la classe `dark` et stocke `darkMode`, alors que l'application existante utilise `data-theme` et la clé `dz_theme_v1` ; les deux systèmes ne sont pas alignés.

**Exigence :** ne pas importer ce bundle de dépendances. Réutiliser les composants, icônes, graphiques SVG/CSS et le thème déjà présents dans l'application.

### A13 — Navigation mobile incomplète et accessibilité insuffisante (moyen)

La barre latérale mobile ne reprend que quatre des sept entrées. Aucun voile de fermeture, gestion de la touche Échap, gestion du focus, attributs ARIA ou état `aria-expanded` n'est défini. Les commandes interactives ne disposent pas toutes d'un nom accessible.

**Exigence :** une seule source de navigation pour desktop/mobile, navigation clavier, focus visible, fermeture accessible, titres et libellés explicites, et vérification RTL sur petits écrans.

### A14 — Recherche, pagination et tableaux non opérationnels (moyen)

Les filtres, la recherche, les boutons de pagination et l'ajout ne modifient aucun état. Une récupération globale de milliers de profils ou d'événements dans le navigateur ne serait pas acceptable.

**Exigence :** pagination côté serveur, limites maximales, recherche filtrée côté serveur, tri sur colonnes autorisées et états de chargement/vide/erreur. Ne jamais exporter une liste complète par défaut.

### A15 — Données de démonstration et données réelles non séparées (élevé)

Les exemples de personnes, d'adresses, d'événements, de reçus et de statistiques sont insérés dans le HTML/JavaScript. Le prototype n'a pas de bannière « démonstration » ni de mécanisme qui empêche leur affichage en production.

**Exigence :** données synthétiques uniquement dans un mode de démonstration isolé, explicitement signalé et désactivé par défaut en production. Les vues réelles doivent afficher « données indisponibles » lorsqu'une source échoue, jamais les valeurs de démonstration en repli.

## 4. Comparaison avec les capacités présentes dans le dépôt

L'examen en lecture seule de la branche `design/prototypes-67-74-alignment` a relevé :

- `admin.js` : interface administrative existante, avec un ancien contrôle de rôle d'affichage et des lectures génériques, plus des modules ADM plus récents.
- `supabase/supabase.js` : méthodes client `admMyPerms`, `admDashboard`, `admSearchStudents`, `admStudent`, `admQueue`, `admAuditLast`, `admReport` et fonctions associées.
- `supabase/adm_schema.sql` : rôles administratifs, permissions et affectations géographiques.
- `supabase/adm2_schema.sql` : reçus, journal d'audit et transitions de paiement.
- `supabase/adm5_schema.sql` : écritures comptables, rapports et contrôles d'accès par permission/périmètre.
- `src/site-worker.js` : Worker centré sur la distribution d'actifs et la garde de contenus ; aucune API d'administration, télémétrie ou activité en direct n'est exposée dans le fichier inspecté.

Ces éléments sont des fichiers présents dans Git. **Ils ne prouvent pas que les scripts SQL sont appliqués, que les RPC sont disponibles dans le projet Supabase actif, ni que les permissions ont été testées sur des comptes réels.** Aucune introspection distante n'a été effectuée pour ce lot.

## 5. Architecture cible recommandée — sans implémentation

1. Conserver la vue d'ensemble comme page de synthèse, mais ne rendre chaque carte que si sa permission est présente.
2. Alimenter les KPI via une RPC de synthèse avec permission `reports.read` et périmètre serveur ; ne pas faire de calcul global dans le navigateur.
3. Utiliser `admin_dashboard` / `admin_report` / `admin_student` et les RPC existantes après vérification de leur déploiement et de leurs politiques.
4. Définir séparément les sources d'activité, d'alertes et de santé système ; ne pas réutiliser des exemples statiques ni assimiler le journal administratif à un historique complet des élèves.
5. Séparer strictement lecture, export, modification de rôles, validation d'opérations et administration des paramètres par permissions.
6. N'afficher que les données financières déjà autorisées et vérifiées ; aucune nouvelle fonction de facturation ou d'encaissement dans ce lot.
7. Utiliser le thème, les styles et les modules natifs de l'application ; préserver les routes, IDs, événements et contrôles existants.

## 6. Tests négatifs à exiger avant toute intégration

- D01 : utilisateur anonyme ouvre directement la route administrative → aucune donnée ni métadonnée privée.
- D02 : élève authentifié appelle directement chaque RPC administrative → refus serveur.
- D03 : agent d'une wilaya demande une autre wilaya → aucune ligne hors périmètre.
- D04 : rôle d'affichage falsifié dans le navigateur → aucun changement d'autorisation.
- D05 : utilisateur révoqué/suspendu réutilise une ancienne page → chaque opération est refusée côté serveur.
- D06 : recherche/export volumineux → limites serveur et périmètre respectés.
- D07 : charge utile avec HTML/script dans un nom, message ou motif → rendu texte inerte.
- D08 : source activité indisponible → état vide/indisponible, pas de fausse activité « directe ».
- D09 : source sécurité indisponible → aucune alerte inventée ni action automatique.
- D10 : source système indisponible → état inconnu, pas de pourcentage conservé comme actuel.
- D11 : aucune écriture comptable → aucune recette supposée à partir d'un abonnement actif.
- D12 : journal vide ou inaccessible → message explicite ; aucun événement de démonstration en remplacement.
- D13 : échec de déconnexion → erreur visible et session réellement contrôlée, sans faux toast de succès.
- D14 : affichage mobile et clavier → sept vues accessibles, focus et fermeture cohérents.
- D15 : thème clair/sombre → respect de `dz_theme_v1` et `data-theme`, sans second état concurrent.

Aucun de ces tests n'a été exécuté sur le prototype ou sur une base réelle dans ce lot.

## 7. Conclusion Go/No-Go

| Domaine | Décision |
|---|---|
| Référence visuelle | GO sous réserve d'une adaptation au design natif du projet |
| Données et KPI du prototype | NO-GO — fictifs |
| Activité « en direct » | NO-GO — aucune source |
| Gestion des utilisateurs | NO-GO — contrôles inertes et autorisation non intégrée |
| Sécurité et actions sensibles | NO-GO — métriques et actions non implémentées |
| Finance | NO-GO — chiffres fictifs et source comptable non connectée |
| Wilayas et système | NO-GO — couverture/état non mesurés |
| Journal d'audit | NO-GO — contenu statique |
| Intégration au dépôt | NO-GO en l'état |

## 8. Opérations non effectuées

Aucun fichier applicatif, module, route, ID ou style de production n'a été modifié. Aucun SQL, migration, table, fonction, policy RLS, grant, secret, paramètre Auth, donnée, action administrative, opération financière, Worker, Cron, Realtime, e-mail, déploiement, achat ou coût n'a été créé, exécuté ou activé. Aucune requête de lecture n'a été lancée sur le projet Supabase distant.

La PR #17 doit rester ouverte et non fusionnée ; `main` ne doit pas être modifiée. La validation CI du commit documentaire final doit être vérifiée séparément.
