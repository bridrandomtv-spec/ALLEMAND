# Lot 413 — décision produit sur l'accès à ملتقى الطلاب et الرسائل

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : décision produit recommandée et documentation uniquement ; aucune activation backend.

## 1. Décision recommandée

**Ne pas réserver ملتقى الطلاب ni la messagerie essentielle aux abonnés payants.**

Le modèle sépare trois notions qui ne doivent jamais être confondues :
- compte créé sur la plateforme ;
- identité/affiliation scolaire vérifiée ;
- abonnement donnant accès aux services pédagogiques premium.

L'abonnement ne prouve pas qu'une personne est élève et ne doit jamais acheter un accès qui contourne les règles de sécurité.

## 2. Accès proposé par état du compte

| État | ملتقى الطلاب | الرسائل |
|---|---|---|
| Inscrit, vérification en attente | Accueil, règlement, aide et annonces institutionnelles ; pas de publication personnelle ni d'annuaire d'élèves | Pas de DM ni d'annuaire privé ; accès au parcours de vérification |
| Élève vérifié, sans abonnement | Accès gratuit au fil, publications, réactions, commentaires et groupes autorisés, avec limites anti-abus | Messagerie textuelle essentielle gratuite ; demande de contact et acceptation explicite avant création d'un DM |
| Élève vérifié, abonnement actif | Même accès social de base | Même messagerie essentielle ; aucun privilège de confiance ou de visibilité supplémentaire |
| Abonné non vérifié | Aucun accès aux contenus personnels réservés aux élèves vérifiés | Aucun annuaire privé ni DM |
| Vérification suspendue/révoquée | Gel des nouvelles publications/interactions sensibles selon procédure documentée | Pas de nouveaux contacts/DM ; traitement de l'historique selon une politique de conservation définie |

Les annonces institutionnelles peuvent être visibles aux comptes inscrits sans exposer les publications, profils ou échanges personnels des élèves.

## 3. Pourquoi ce modèle est préférable

1. **Effet réseau :** une communauté scolaire doit réunir les élèves, pas seulement les clients payants. Un paywall sur le fil social ralentirait fortement son adoption.
2. **Équité :** les élèves non abonnés doivent pouvoir échanger et s'entraider dans les fonctions essentielles.
3. **Sécurité :** la vérification scolaire, le consentement, le blocage et la modération sont des contrôles de confiance ; ils ne s'achètent pas.
4. **Monétisation lisible :** l'abonnement finance les cours, contenus premium, outils avancés et services pédagogiques ; il ne donne pas plus de droits sur les autres élèves.
5. **Cohérence :** devenir contact dans ملتقى الطلاب ne crée jamais automatiquement une conversation Messenger.

## 4. Limites de lancement

- Vérification scolaire gratuite, indépendante du paiement, par une source autorisée ou un vérificateur habilité.
- Tant que la vérification réelle et les autorisations serveur ne sont pas opérationnelles, le prototype reste une maquette et ne doit pas être présenté comme un réseau social national actif.
- Avant toute activation Messenger : corriger et tester le blocage bilatéral, le consentement, l'acceptation atomique, les limites anti-spam, les projections minimales de profils et les autorisations serveur/RLS.
- Ne jamais exposer numéro d'inscription scolaire, numéro d'abonnement, téléphone, e-mail ou justificatif aux autres élèves.
- Les comptes mineurs nécessitent des règles de sécurité et de modération adaptées ; les fonctions de découverte et de contact doivent rester limitées par défaut.

## 5. Place de l'abonnement

L'abonnement peut financer les fonctionnalités pédagogiques premium de la plateforme. Il ne doit pas :
- déverrouiller l'identité d'un élève ;
- contourner une vérification refusée ou en attente ;
- autoriser un DM sans consentement ;
- contourner un blocage, un refus ou une sanction ;
- augmenter la visibilité d'un profil personnel dans le fil social.

Les éventuelles fonctions sociales avancées (par exemple des outils de gestion de communauté) ne pourront être étudiées qu'après stabilisation de la sécurité ; elles ne doivent pas fragmenter les fonctions essentielles entre élèves.

## 6. Conditions avant développement backend

1. Déterminer la source autorisée de vérification scolaire et les rôles habilités.
2. Décider la première granularité de découverte : même établissement en priorité ; extension par wilaya/niveau/filière seulement après validation de la confidentialité.
3. Valider les règles de demande de contact, refus, blocage, signalement et révocation.
4. Reconstituer un environnement de test isolé et sans frais, puis exécuter les tests multi-comptes.
5. Faire auditer les permissions réelles avant toute migration ou activation.

## 7. Périmètre de ce lot

- Documentation produit uniquement.
- Aucun changement de code applicatif, Auth, Supabase, schéma, migration, RLS, Storage, Realtime ou paiement.
- Aucun accès aux données personnelles ou aux messages des élèves.
- Aucun déploiement Cloudflare, aucun service payant, aucune modification de `main`, aucune fusion de PR.

## 8. Décision synthétique

**ملتقى الطلاب : gratuit pour les élèves vérifiés, qu'ils soient abonnés ou non.**  
**الرسائل : fonctions essentielles gratuites pour les élèves vérifiés, avec consentement et protections serveur.**  
**Abonnement : réservé aux avantages pédagogiques premium, jamais à la confiance ou à la sécurité.**
