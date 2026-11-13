# Lot 430 — plan d'implémentation contrôlé, fichier par fichier

**Date :** 13 novembre 2026  
**Branche cible :** `design/prototypes-67-74-alignment`  
**Statut :** plan technique préparatoire — aucun code applicatif ni backend modifié.

## 1. État du dépôt vérifié

Fichiers relus sur la branche :
- `index.html` — SHA `ede77df9b188f1353b952aa88934269fa07f7195` : contient déjà `data-view="multaqa"`, une maquette statique et la navigation vers `data-go="msg"`. `msg.js` est chargé séparément avec un numéro de cache.
- `msg.js` — SHA `fea5c3e8be5cb9edd9eb9f7b3f6466cb6afb41fc` : module IIFE autonome, enregistre la vue `msg`, construit `#msgBody`, écoute les actions `data-act`, gère les conversations et groupes existants, l'envoi, les pièces jointes, le signalement et les rôles de modération.
- `supabase/supabase.js` — SHA `d4c111cdd30eb3722a234b41a9974a17a1dbdaf1` : expose les helpers `msgConvs`, `msgMessages`, `msgSend`, `msgCanDm`, `msgOpenDirect`, `msgBlock`, `msgUnblock`, et le parcours de vérification.
- `style-prototype-dz.css` : contient déjà les règles `.mtq-*` et les correctifs responsive/contraste du Lot 408. Ne pas recréer une seconde feuille de style ni dupliquer les règles.
- `style.css` : contient les styles existants de la messagerie `.msg-*`.

Le module `msg.js` filtre le texte saisi dans la liste de conversations/groupes ; il ne fait pas de recherche nationale de profils. Le module `msg.js` ne branche pas encore l'interface de blocage, même si les helpers `msgBlock` et `msgUnblock` sont exposés. Le formulaire de vérification actuel demande un numéro d'abonnement et exige un abonnement actif dans le client.

## 2. Principes non négociables

1. Ne pas toucher à `main`, ne pas fusionner PR #17 et ne pas déployer Cloudflare.
2. Ne pas exécuter de SQL sur le projet Supabase actif : l'autorisation précédente ne couvrait que les SELECT du Lot 427.
3. Les demandes sociales `زمالة` et les invitations privées `دعوة إلى محادثة` sont deux objets métier indépendants.
4. L'acceptation d'une زمالة ne crée aucun DM. Un DM n'existe qu'après acceptation de son invitation Messenger dédiée.
5. Les fonctions sociales et de messagerie essentielles sont gratuites pour tous les élèves vérifiés, abonnés ou non.
6. L'identité et les droits sont validés côté serveur ; aucun contrôle client ne constitue une autorisation.
7. Ne jamais exposer dans l'annuaire ou les profils sociaux les champs privés de `profiles` (matricule, section, métadonnées de vérification, e-mail, téléphone, UUID ou données Auth).
8. Ne pas modifier les contrats existants des groupes officiels, des fils de discussion, des pièces jointes et de la modération sans tests de non-régression.

## 3. Séquence par fichiers

### Étape 0 — préflight sans modification
- Capturer le SHA de tête de branche et vérifier que PR #17 est toujours ouverte.
- Vérifier les versions et les points d'entrée réels de `index.html`, `msg.js`, `supabase/supabase.js`, `style.css`, `style-prototype-dz.css` et des workflows CI.
- Conserver les identifiants `data-view="multaqa"`, `data-view="msg"`, `#msgBody`, les événements `data-act` et `data-go`; ne pas renommer les routes.
- Ne pas synchroniser la branche avec `main` : elle est divergente et son retard connu doit être traité séparément, après décision explicite.

### Étape 1 — contrat serveur et tests isolés (bloquant)
- Préparer des migrations SQL versionnées et des tests transactionnels, sans les exécuter sur la production.
- Réutiliser le modèle de conception du Lot 387 pour `msg_invitations`, après comparaison exacte avec le catalogue actif.
- Définir une table sociale distincte pour les demandes de زمالة et la relation acceptée.
- Créer des opérations serveur distinctes : envoi/réponse/annulation d'invitation sociale ; envoi/réponse/annulation d'invitation Messenger.
- L'acceptation Messenger doit, dans une seule transaction, revalider statut scolaire, découvrabilité, expiration, quotas et blocages dans les deux sens, puis créer/récupérer le DM unique et ajouter exactement les deux membres.
- Retirer les chemins d'insertion directe de conversation/membership qui contournent le consentement ; bloquer les appels RPC directs non conformes.
- Corriger le contrôle de blocage dans les deux sens pour la recherche, l'invitation, l'acceptation, l'accès au fil et l'envoi.
- Remplacer l'accès large aux profils par une projection minimale et des privilèges/policies limités.
- Découpler la demande de vérification scolaire du paiement. Le justificatif et le matricule restent privés et réservés à l'agent habilité.
- Tests sous JWT de comptes synthétiques A/B/C/D, jamais sous `service_role` pour valider les permissions d'un élève.

**Critère de sortie :** aucun chemin SQL/RPC/REST ne peut créer un DM sans invitation Messenger acceptée ; les blocages sont bilatéraux ; la projection publique ne révèle aucun champ privé ; tous les tests négatifs passent.

### Étape 2 — `supabase/supabase.js`
- Ajouter des wrappers client uniquement pour les RPC et lectures minimales approuvées : recherche de profils découvrables, invitations sociales, invitations Messenger, liste des blocages et préférences de découvrabilité.
- Garder `msgOpenDirect` comme réouverture d'un DM déjà autorisé ; ne pas l'utiliser pour créer un nouveau DM.
- Ajouter des retours d'erreur normalisés et des limites de taille/pagination ; ne jamais faire confiance à un `user_id` fourni pour agir au nom d'un autre compte.
- Remplacer `msgRequestVerification(subscriptionNumber, section)` seulement après définition et validation du contrat serveur gratuit. Ne pas renommer `matricule` en numéro d'abonnement ni réutiliser ce champ pour une autre identité.

### Étape 3 — nouveau `multaqa.js`
- Créer un module dédié à la vue `multaqa`, sans surcharger `msg.js`.
- Charger un fil paginé depuis le service serveur ; supprimer les cartes d'exemple fictives une fois le vrai fil prêt.
- Implémenter composer, publications, commentaires/réponses, réactions, signalements, demandes de زمالة reçues/envoyées et liste des زملاء.
- Accepter une demande sociale ne doit appeler aucune fonction Messenger.
- Implémenter états de chargement, vide, erreur, pagination, anti double-clic et confirmations avant suppression/retrait.
- N'afficher que les champs autorisés par la projection publique ; échapper le contenu utilisateur avant insertion DOM.

### Étape 4 — `msg.js`
- Préserver les groupes officiels et les conversations existantes.
- Ajouter des vues/onglets distincts : `المحادثات`, `طلبات المحادثة الواردة`, `طلبات المحادثة المرسلة`, `البحث عن تلميذ`, `المحظورون`.
- Le bouton de recherche national envoie une invitation Messenger ; il ne crée pas un fil et n'appelle pas `msgOpenDirect`.
- L'acceptation appelle exclusivement la RPC d'acceptation Messenger. Le refus et l'annulation appellent les RPC correspondantes.
- Ajouter bloquer/débloquer et signaler un profil ; après blocage, actualiser les demandes et fermer/neutraliser le fil concerné selon le contrat serveur.
- Garder les contrôles de l'éditeur, fichiers autorisés et limite 5 Mo ; ne pas élargir les types MIME sans politique Storage et contrôle serveur.
- Corriger le texte de vérification arabe pour supprimer la référence au paiement uniquement après disponibilité du nouveau parcours serveur.

### Étape 5 — `index.html`
- Garder `data-view="multaqa"`, `data-view="msg"`, les routes et les points d'ancrage utilisés par `app.js`.
- Transformer la maquette statique en conteneurs dynamiques avec IDs stables pour le fil, le composeur, les demandes et les états vides.
- Charger `multaqa.js` une seule fois, après que `window.SB` soit disponible ; vérifier l'ordre réel des scripts et les événements de navigation avant de choisir `defer` ou `type="module"`.
- Mettre à jour les paramètres de cache des seuls fichiers modifiés ; ne pas changer arbitrairement toutes les versions.
- Conserver la langue arabe, RTL, les libellés `ملتقى الطلاب` et `الرسائل`.

### Étape 6 — CSS existant
- Étendre les règles `.mtq-*` existantes dans `style-prototype-dz.css` et `.msg-*` dans `style.css` uniquement si nécessaire.
- Tester mobile étroit, tablette, desktop, thème clair et sombre ; éviter les menus qui débordent et les actions tactiles inférieures à 44 px.
- Aucun nouveau framework ni dépendance frontend : conserver HTML/CSS/JavaScript natifs.

## 4. Matrice minimale de tests avant revue

| Domaine | Test négatif essentiel | Résultat attendu |
|---|---|---|
| زمالة | Accepter une demande sociale | Relation créée, aucun DM/membre Messenger |
| Messenger | Invitation en attente | Aucun DM, aucun membre, aucun accès au fil |
| Messenger | Accepter comme tiers ou expéditeur | Refus serveur |
| Messenger | Accepter deux fois / appels concurrents | Un seul DM et exactement deux membres |
| Messenger | Refuser/annuler/expiration | Aucun DM créé |
| Blocage | A bloque B puis B tente d'inviter A | Refus des deux côtés |
| Blocage | Blocage après création d'un DM | Accès et envoi interrompus selon la politique |
| Profil | Lecture des profils par un élève | Seulement les colonnes publiques autorisées |
| Vérification | Élève gratuit demande vérification | Parcours possible sans abonnement |
| Vérification | Non vérifié tente publication/DM | Refus serveur, même si le client est manipulé |
| RLS | Requêtes REST/RPC directes et insertions directes | Pas de contournement des RPC autorisées |
| Régression | Groupes, anciens DM, pièces jointes, Realtime | Fonctions existantes conservées |

## 5. Ordre de livraison recommandé

1. Spécification SQL et tests isolés non exécutés en production.
2. Revue sécurité serveur et autorisation distincte pour toute écriture sur le projet Supabase actif.
3. Wrappers `supabase/supabase.js`.
4. `multaqa.js` et ses conteneurs `index.html`.
5. Extension `msg.js` pour invitations privées et blocage.
6. CSS responsive, tests navigateur et contrôles CI.
7. Déploiement preview seulement après autorisation ; revue visuelle par l'utilisateur ; aucune fusion de PR #17 sans son accord.

## 6. Limites de ce lot

- Lot 430 est une planification basée sur la lecture statique des fichiers listés ; aucun code applicatif n'a été changé.
- Aucune requête SQL n'a été exécutée et aucune donnée élève/message/conversation n'a été consultée.
- Aucun changement Supabase, Auth, RLS, ACL, RPC, trigger, Storage, Realtime ou paiement.
- Aucun déploiement, aucune synchronisation avec `main`, aucun merge.
- Les schémas et RPC finaux restent à comparer au catalogue actif avant de produire une migration exécutable.

**Décision :** commencer l'implémentation uniquement dans l'ordre ci-dessus. La sécurité serveur et les tests multi-comptes sont des prérequis, pas une phase à remettre après l'interface.