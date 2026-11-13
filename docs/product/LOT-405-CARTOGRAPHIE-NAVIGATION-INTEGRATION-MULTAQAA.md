# Lot 405 — cartographie de navigation et point d'intégration de ملتقى الطلاب

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : lecture seule de `index.html`, `app.js`, `msg.js`, `masar.js` et de la maquette sociale.

## 1. Constat : Messenger existe déjà dans l'application

La page principale contient déjà une vue :
- `<section data-view="msg" class="view" hidden>`
- titre affiché : `💬 الرسائل`
- conteneur : `#msgBody`

Le moteur `app.js` déclare la route `msg` dans `VIEWS`, la liste des onglets `TABS` et le raccourci supérieur de navigation. La navigation mobile possède également un raccourci `💬 الرسائل`.

Le module `msg.js` écoute l'événement `dz:view` et déclenche le rendu de la liste lorsque la vue `msg` est ouverte. Il gère les conversations et le fil, avec appels au client Supabase existant. Le module annonce explicitement qu'il ne crée pas de DM depuis l'interface.

**Conclusion utilisateur :** dans la plateforme actuellement codée, Messenger se trouve sous le nom arabe **الرسائل**, et non sous la marque « Messenger ». Il s'ouvre depuis l'onglet supérieur « 💬 الرسائل » ou le raccourci mobile correspondant, après connexion avec un compte autorisé.

## 2. Architecture de navigation actuelle

- Le header contient `#tabs`, généré dynamiquement par `renderTabs()`.
- La navigation desktop place des raccourcis en tête : matières, tableau de bord élève (si autorisé), مسارك, فضائي الدراسي, الرسائل.
- Les autres rubriques sont regroupées dans `NAVCATS`.
- La navigation mobile dispose d'une barre de raccourcis et d'un panneau « المزيد ».
- `go(view)` vérifie que la route est déclarée dans `VIEWS`, applique les restrictions de rôle/abonnement, masque toutes les autres vues, met à jour les onglets et émet `dz:view`.

Il ne faut donc pas créer un second header, un tiroir latéral concurrent ou une navigation indépendante dans la maquette sociale.

## 3. Point d'intégration recommandé

Pour ajouter `ملتقى الطلاب` proprement, le point d'entrée doit être un raccourci autonome dans le même système de navigation :
- identifiant de vue proposé : `multaqa` (nom technique stable, distinct du libellé arabe) ;
- libellé desktop/mobile : `🌐 ملتقى الطلاب` ;
- entrée visible pour les comptes élèves connectés ;
- Messenger reste séparé et garde le libellé `💬 الرسائل` ;
- l'ordre recommandé dans les raccourcis : `لوحة التلميذ`, `مسارك`, `ملتقى الطلاب`, `الرسائل`, puis le reste des rubriques.

La vue sociale doit être une section dédiée dans `index.html`, et le routage doit passer par `VIEWS`, `TABS`, `renderTabs()` et `go()`. Le code de navigation mobile doit être mis à jour dans la même modification. Ne pas détourner la vue `msg` ni renommer son identifiant.

## 4. Contrat de séparation des fonctions

- `ملتقى الطلاب` : fil social, publications, commentaires, réactions, relations, découverte, groupes et notifications sociales.
- `الرسائل` : conversations privées et groupes de discussion Messenger existants.
- Un bouton « مراسلة » depuis un profil social ne doit pas créer un DM automatiquement ; il ouvre le parcours de consentement Messenger.
- La relation `زملائي` ne doit pas équivaloir à une invitation Messenger ou à une adhésion à un groupe.
- Les routes sociales doivent être réservées au rôle et à l'état de vérification prévus par la politique produit. Ne pas rendre le contenu social accessible aux visiteurs par simple URL.

## 5. Fichiers et modules à préserver

- `index.html` : header existant et conteneurs `data-view`.
- `app.js` : `VIEWS`, `TABS`, `NAVSOLO_TOP`, `renderTabs()`, `go()` et délégation `[data-go]`.
- `msg.js` : module Messenger existant, non renommé et non réécrit.
- `style.css` et `style-prototype-dz.css` : styles partagés, à compléter avec classes préfixées `mtq-` pour éviter les collisions.
- `prototypes/multaqa-students-preview.html` : référence de conception seulement ; ne pas injecter sa page HTML complète dans la page principale.

## 6. Risques et garde-fous

1. Ajouter uniquement un item à `TABS` ne suffit pas : la vue doit aussi exister dans le DOM et dans `VIEWS`.
2. Le mobile a une liste de raccourcis distincte de la barre desktop ; les deux doivent être testées.
3. `renderTabs()` filtre les vues par rôle pour certaines rubriques ; le contrôle social doit être explicite et côté serveur, pas seulement un masquage d'onglet.
4. Ne pas ajouter une route sociale à `NAVCATS` si le produit la veut comme entrée principale : elle disparaîtrait dans un sous-menu.
5. Le script `msg.js` dépend de `dz:view` ; préserver l'émission d'événement pour ne pas casser Messenger.
6. Aucun accès direct à `profiles` ne doit être ajouté pour créer un annuaire national ; reprendre les conclusions des lots 336–401 et attendre des projections serveur validées.
7. Ne pas connecter la maquette à la base active avant d'avoir un environnement de test gratuit et fidèle et les opérations serveur autorisées.

## 7. Plan de modification proposé — Lot 406

Modification front-end isolée et réversible, sans backend :
1. ajouter la route `multaqa` et une section vide/placeholder sécurisée ;
2. ajouter `🌐 ملتقى الطلاب` aux raccourcis desktop et mobile, visible seulement aux élèves connectés selon le contrat de rôle ;
3. préserver `💬 الرسائل` et sa route `msg` sans changement fonctionnel ;
4. ajouter un lien explicite entre les deux espaces sans créer de conversation ;
5. ajouter des styles `mtq-` isolés et vérifier le responsive ;
6. tester que toutes les anciennes routes et le cycle `dz:view` restent fonctionnels.

Aucun backend, Auth, RLS, Storage, Realtime, table, RPC ou politique ne doit être modifié dans ce lot front-end.

## 8. État d'exécution et décision

Ce lot est une cartographie documentaire. Aucun code applicatif n'a été modifié et aucun test navigateur n'est revendiqué.

**GO conditionnel pour le Lot 406 front-end uniquement**, après revue du patch ciblé. **NO-GO pour toute connexion aux données sociales réelles** tant que les contrats serveur, tests multi-comptes et environnement PostgreSQL/Storage de test ne sont pas établis.

Aucun SQL, migration, Auth/RLS/Storage/Realtime, déploiement Cloudflare, merge ou coût effectué.
