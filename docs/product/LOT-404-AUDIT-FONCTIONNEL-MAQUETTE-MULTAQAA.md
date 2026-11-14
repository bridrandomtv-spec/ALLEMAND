# Lot 404 — audit fonctionnel statique de la maquette ملتقى الطلاب

Date : 13 novembre 2026  
Fichier audité : `prototypes/multaqa-students-preview.html`  
Commit du fichier audité : `294a60e102fbb62b44f1fa14bf585deafbc1c1c2`  
Statut : audit statique du code source ; aucun test navigateur automatisé ou manuel n'est revendiqué.

## 1. Méthode

Lecture du fichier HTML autonome et inspection statique des identifiants, boutons, liens, attributs disabled, écouteurs JavaScript et dépendances. Aucun serveur, compte élève, API, Supabase ou stockage n'a été utilisé.

## 2. Inventaire

- 33 attributs `id` ; aucun identifiant dupliqué détecté.
- 25 boutons HTML.
- 9 boutons explicitement désactivés.
- 11 écouteurs `click` dans le script.
- Aucun appel `fetch()`, aucune référence Supabase, aucun `localStorage` ou `sessionStorage`.
- Aucune dépendance externe HTTP(S) détectée dans les attributs `src` ou `href`.
- Les quatre liens de navigation sont des ancres internes vers des sections de la maquette.

## 3. Interactions présentes dans le script

- Ouvrir/fermer les menus de demandes et notifications.
- Basculer entre le fil et la vue du profil.
- Ouvrir/fermer l'édition du profil et modifier localement le texte/champs d'aperçu.
- Basculer les onglets du profil.
- Le bouton de création ramène au fil et place le focus sur le champ de composition.

Ces interactions sont locales à la page et ne sauvegardent rien côté serveur. Le bouton « حفظ المعاينة » ne doit pas être présenté comme une sauvegarde réelle.

## 4. Contrôles visibles mais non opérationnels

Neuf boutons sont désactivés dans le fichier :
- accepter et refuser une demande ;
- retirer une relation ;
- ajouter une photo, une vidéo ou un fichier ;
- publier ;
- inviter deux profils d'exemple.

Le compteur de demandes et de notifications, les profils, les publications et les groupes sont des exemples statiques. Aucun vrai flux de publication, upload, commentaire, réaction, invitation, recherche nationale, notification persistante, adhésion ou Messenger n'est raccordé.

La maquette ne prouve donc pas que ces services sont déployés ou utilisables dans la plateforme. Elle sert à visualiser l'organisation et quelques interactions de présentation.

## 5. Conséquence produit

Le prochain travail ne doit pas ajouter un nouveau design par-dessus cette page. Il doit transformer les éléments en parcours fonctionnels par étapes, après sécurisation de l'architecture :

MVP 1 (sans média) :
1. navigation réelle depuis la plateforme vers `ملتقى الطلاب` ;
2. lecture du fil depuis des données autorisées ;
3. création de publication texte avec audience explicite ;
4. commentaires et réactions contrôlés ;
5. signalement et blocage bilatéral ;
6. demandes de relation sociale et acceptation/refus ;
7. recherche nationale uniquement selon consentement de visibilité ;
8. liens vers Messenger sans création automatique de DM.

MVP 2 :
- groupes sociaux avec adhésion explicite, rôles et contrôle d'affiliation scolaire ;
- médias image dans une zone privée/quarantaine après validation du stockage et de la modération.

MVP 3 :
- vidéo, transcodage, miniatures, albums et modération média, seulement si l'infrastructure disponible le permet sans coûts non autorisés.

## 6. Critères de passage de maquette à fonctionnalité

Chaque contrôle doit avoir un état de chargement, succès, erreur, absence de données et permissions refusées. Les mutations doivent être idempotentes ou protégées contre les doubles clics ; les erreurs ne doivent pas exposer les données privées. Les validations client ne remplacent pas les contrôles serveur. Les tests doivent couvrir plusieurs comptes synthétiques et des rôles différents.

## 7. Décision

**État : maquette de présentation, pas application sociale opérationnelle.** Les boutons désactivés sont volontairement visibles comme éléments de parcours mais ne doivent pas être décrits comme des fonctions achevées.

Aucun fichier de l'application n'a été modifié dans ce lot ; seul ce rapport documentaire est ajouté. Aucun SQL, migration, Auth, RLS, Storage, Realtime, déploiement, merge ou dépense.
