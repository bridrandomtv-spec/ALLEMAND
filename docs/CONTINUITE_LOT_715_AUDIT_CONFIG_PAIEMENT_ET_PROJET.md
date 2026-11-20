# Continuité — Lot 715 : audit des configurations de paiement et documents de projet

Date : 2026-11-20  
Branche : `ai/rag-corpus-integrity-lot-635`  
PR : #23  
Portée : audit en lecture seule des JSON publics et de leurs consommateurs. Aucune valeur de compte, numéro de téléphone ou coordonnée personnelle n'est reproduite dans ce rapport.

## 1. Résultat critique — `assets/bdd/config.json`

Le fichier est dans `assets/bdd/`, donc servi comme ressource statique. Il ne correspond à aucun motif `PROT` dans `src/site-worker.js`. Le Worker applique `Cache-Control: no-store` à ce répertoire, ce qui ne constitue pas un contrôle d'accès.

Le fichier contient :
- le nom du titulaire d'un moyen de paiement ;
- un identifiant de compte CCP et sa clé ;
- un identifiant BaridiMob ;
- des tarifs d'abonnement ;
- l'URL publique du Worker IA.

**Le contenu de paiement est exposé publiquement.** Les identifiants de paiement sont des données financières sensibles. Ils ne doivent pas être considérés comme secrets d'authentification bancaire, mais leur publication non maîtrisée crée un risque de fraude, d'usurpation de coordonnées de paiement ou de redirection des paiements.

## 2. Le code applicatif ne justifie pas cette exposition

L'unique chargement repéré de `assets/bdd/config.json` dans `app.js` lit uniquement la propriété `ia_proxy` pour joindre le Worker IA. Le code ne lit pas les propriétés `paiement`, `ccp` ou `baridimob`.

Ainsi, les coordonnées de paiement présentes dans le JSON ne sont pas nécessaires au flux actuellement vérifié dans `app.js`. La solution minimale probable est de séparer la configuration publique du proxy IA des données de paiement, mais toute modification doit préserver le comportement de paiement validé par le propriétaire.

## 3. Document de projet marqué confidentiel

`assets/bdd/plan_projet.json` porte explicitement la mention « Document confidentiel » et décrit un dossier destiné aux partenaires, investisseurs et tuteurs. Il contient notamment des éléments de marché, de revenus, de tarifs, de concurrence, d'équipe et de feuille de route, ainsi que des coordonnées de contact.

Le fichier est directement accessible dans le dépôt et sous forme de ressource statique. `projet.js` le charge sans contrôle de rôle préalable. L'absence de motif `PROT` dans le Worker confirme qu'aucune garde d'accès serveur n'est appliquée.

Il faut confirmer si le contenu a vocation à être public. Si non, il faut retirer le document de la surface publique et définir une voie d'accès authentifiée adaptée. L'exclusion du bundle Cloudflare seule ne protégerait toujours pas le contenu du dépôt GitHub public.

## 4. Réservations et contacts

`assets/bdd/reservation.json` contient des coordonnées de contact utilisées par `reservation.js` pour afficher les informations et composer une confirmation WhatsApp. Ce fichier est donc intentionnellement consommé par une interface publique de réservation ; les coordonnées semblent constituer un canal de contact affiché aux utilisateurs, et non un secret technique.

Aucun changement recommandé sur ces coordonnées sans confirmation de leur caractère public et de leur exactitude. Les champs de contact de `plan_projet.json` doivent en revanche être considérés dans la décision de publication du document confidentiel.

## 5. Contrôles Worker

Le Worker protège plusieurs corpus pédagogiques, mais aucun des chemins suivants n'est dans `PROT` :
- `/assets/bdd/config.json`
- `/assets/bdd/plan_projet.json`
- `/assets/bdd/reservation.json`

Leur présence sous `/assets/bdd/` ne fait qu'ajouter `no-store` aux réponses. Cela n'empêche pas les requêtes directes, anonymes ou l'accès GitHub Raw/API.

## 6. Décisions et corrections proposées

Priorité 1 — `config.json` :
1. Retirer les coordonnées de paiement de tout JSON public.
2. Conserver une configuration publique minimale contenant uniquement `ia_proxy) si c'est le seul champ requis par `app.js`.
3. Déterminer séparément le flux sûr et autorisé de publication des coordonnées de paiement aux abonnés, sans introduire de changement Supabase/RLS sans approbation.

Priorité 2 — `plan_projet.json` :
1. Confirmer si le dossier marqué confidentiel doit être accessible à tous les visiteurs.
2. S'il est confidentiel, le retirer de la surface publique et concevoir l'accès authentifié ; ne pas simplement l'ajouter à `PROT` sans vérifier le chargement et les autorisations de `projet.js`.

Priorité 3 — `reservation.json` :
- Maintenir le flux public uniquement si les coordonnées affichées sont destinées à être publiques et validées par le propriétaire.

## 7. État du dépôt

- Audit uniquement : aucun JSON, JS, Worker ou fichier de configuration modifié.
- Aucun compte, identifiant financier ou numéro de téléphone copié dans le rapport.
- Aucun changement Supabase, Auth, RLS, schéma, abonnement ou paiement.
- Aucune modification de `main`, aucune fusion et aucun déploiement.
- PR #23 reste ouverte et en brouillon.

Les identifiants financiers ne sont pas reproduits dans les commentaires de PR ou les documents de continuité.
