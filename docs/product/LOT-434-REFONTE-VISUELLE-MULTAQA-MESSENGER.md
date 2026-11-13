# Lot 434 — première refonte visuelle de ملتقى الطلاب et الرسائل

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment` · **PR :** #17  
**Nature :** modification front-end réelle, limitée à la présentation. Ce lot ne prétend pas livrer les fonctionnalités sociales/backend.

## 1. Problème traité

L'écran `data-view="multaqa"` affichait explicitement une maquette statique avec des exemples fictifs et des actions désactivées. La liste de `msg.js` utilisait une présentation générique en cartes et ne ressemblait pas à une boîte de réception de messagerie moderne.

## 2. Modifications réalisées

### `index.html`
- Remplacement de l'ancien bloc du forum par une composition RTL en trois zones : navigation communautaire, fil central, découverte/règles.
- Suppression des deux publications d'exemple qui pouvaient être confondues avec de vraies publications.
- Ajout d'un état vide honnête indiquant que le fil réel n'est pas encore raccordé à la base.
- Conservation des routes `data-view="multaqa"`, `data-view="msg"` et du lien `data-go="msg"`.
- Invalidation du cache CSS : `style-prototype-dz.css?v=197`.

### `style-prototype-dz.css`
- Nouvelle hiérarchie visuelle du forum : bandeau d'accueil, navigation latérale, composition de publication, état vide et panneau de découverte.
- Adaptation responsive pour tablette et mobile.
- Amélioration de la présentation des éléments existants de `#msgBody` : en-tête, recherche locale, filtres, cartes de groupes/conversations, fil et zone de saisie.
- Les styles restent additifs et utilisent les variables du thème existant.

## 3. Ce qui n'est PAS livré

- Aucun fil réel de publications, aucune création de publication, aucun commentaire, réaction ou partage.
- Aucun annuaire national, recherche de profils, invitation Messenger ou demande de زمالة fonctionnelle.
- Aucun changement de `msg.js`, `supabase/supabase.js`, schéma SQL, RLS, ACL, RPC, trigger, Auth, Storage ou Realtime.
- Aucun test multi-comptes, aucune validation des permissions serveur et aucun déploiement Cloudflare.
- L'écran Messenger garde les fonctions déjà présentes (groupes/conversations, lecture/envoi, pièces jointes et Realtime) ; le lot améliore leur présentation seulement. La recherche reste limitée aux conversations/groupes déjà chargés.

## 4. Contrôles effectués

- Vérification GitHub des deux fichiers après commit : nouvelle section présente, anciens exemples fictifs absents, version CSS 197 présente.
- Contrôle de PR #17 : ouverte, non fusionnée, base `main`, HEAD `00db0a0f0b9e2fb413922e2b82b870b91f559d72`.
- GitHub a retourné `mergeable=true) au contrôle.
- Aucun workflow CI associé à ce commit n'a été retourné ; CI non confirmée.
- Aucun déploiement ou changement de base n'a été effectué.

## 5. Prochaine étape indispensable

Passer du visuel au produit réel : établir le contrat backend actif, puis implémenter le fil communautaire et les invitations sociales, suivis de la recherche nationale et des invitations Messenger. Le catalogue de production doit être relu en SELECT uniquement après autorisation explicite distincte. Tant que les tables, fonctions et permissions actives ne sont pas vérifiées, ne pas prétendre que les boutons sociaux sont fonctionnels et ne pas exécuter de migration sur Supabase.
