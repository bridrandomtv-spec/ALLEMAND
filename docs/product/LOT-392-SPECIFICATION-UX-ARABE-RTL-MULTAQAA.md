# Lot 392 — spécification UX arabe RTL de « ملتقى الطلاب »

Date : 13 novembre 2026
Statut : spécification UX et intégration, non implémentée.

## 1. Base technique vérifiée
- PR #17 ouverte, non fusionnée ; HEAD au contrôle : 8cc4b74cab89ba77c24e82c54334658f14cde2b8 ; base main : 51acfe8c97b6e152208d592dbd2c5bbde5c5c38e ; mergeable=true.
- app.js contient VIEWS, TABS, NAVCATS, NAVSOLO_TOP. Les vues principales sont rendues via data-view et la navigation par data-go.
- index.html contient déjà data-view=msg et data-view=dashboard. Le tableau de bord contient un raccourci vers الرسائل والتواصل.
- msg.js s'auto-enregistre dans VIEWS/NAVSOLO_TOP si nécessaire et gère la vue Messenger existante. Il ne faut ni remplacer ni renommer msg.
- La vue Messenger actuelle affiche الرسائل et une description de messagerie nationale/groupes. Le code comporte conversations/groupes, fil, présence, pièces jointes et signalements ; il ne démontre pas encore les demandes sociales de contact.
- supabase.js expose myNotifications et notifMarkRead via la table notifications, utilisée dans un contexte de compte/administration ; pas de preuve d'un flux de notifications sociales complet.
- La vue msg.js lit actuellement pseudo/role/niveau depuis profiles pour les membres d'une conversation. Cette lecture existante ne doit pas être copiée dans un annuaire national ; l'annuaire doit utiliser une projection serveur dédiée.
- Fichiers consultés : app.js SHA bd1483976194fea20f35638cc14862684ae1d51a ; msg.js SHA fea5c3e8be5cb9edd9eb9f7b3f6466cb6afb41fc ; index.html SHA 32116f2bd114a528f45c99d59431152a570dcf9d ; supabase/supabase.js SHA d4c111cdd30eb3722a234b41a9974a17a1dbdaf1 ; style.css SHA d2f35668db399f3c8157b30bebbedc13221b35a0.

## 2. Décision d'intégration
Créer ultérieurement une vue sociale dédiée, identifiant technique provisoire `social`, sans modifier `msg`.
Entrée principale recommandée : bouton autonome dans la navigation supérieure `ملتقى الطلاب` avec icône `🌐`, placé près de `💬 الرسائل` et accessible aussi depuis le tableau de bord. Sur mobile, l'entrée doit être dans la navigation rapide ou au premier niveau de « المزيد », jamais cachée au fond d'une longue liste.
Le réseau social ne doit pas être fusionné dans la vue Messenger : les conversations privées et les communautés sociales ont des règles, des objets et des audiences différents.
Éviter de faire du réseau social un onglet noyé dans les catégories pédagogiques. Il s'agit d'un espace communautaire transversal.

## 3. Structure du bureau
En-tête de l'espace social :
- titre « ملتقى الطلاب » et sous-titre court « تواصل، تعلّم، وشارك أفكارك مع زملائك في مختلف أنحاء الجزائر ».
- barre de recherche « ابحث عن منشور أو طالب أو مجموعة… » ; recherche soumise à autorisations, pagination et limitation de débit.
- raccourcis « آخر الأخبار », « اكتشف الطلاب », « زملائي », « المجموعات ».
Disposition desktop à trois zones, sans sidebar persistante qui écrase le fil :
- colonne principale centrale : compositeur de publication puis fil.
- colonne secondaire : groupes suivis, sujets scolaires et événements pertinents.
- colonne utilitaire compacte : profil résumé et demandes reçues ; masquable sur écrans étroits.
Ne pas afficher de compteurs fictifs, de suggestions d'élèves non vérifiées ni de contenus de démonstration présentés comme réels.

## 4. Fil « آخر الأخبار »
Compositeur « بماذا تفكر اليوم؟ » avec actions « صورة », « ملف », « استطلاع » (sondages en phase ultérieure), sélecteur d'audience et bouton « نشر ».
Carte de publication : avatar/nom affichable, badge de contexte (élève vérifié seulement si pertinent), date, audience ; texte développé/replié ; média avec aperçu contrôlé ; actions « أعجبني », « تعليق », « مشاركة » et menu « إبلاغ / إخفاء / حظر ».
Les réactions sont des états explicites et uniques par utilisateur ; les commentaires suivent l'audience du post ; le partage ne doit jamais élargir l'audience de l'original.
Filtres du fil : « الكل », « زملائي », « مجموعاتي ». Ne pas exposer publiquement les posts de groupes privés.
État vide : expliquer comment suivre un groupe ou ajouter des contacts, sans inventer de publications.

## 5. Profil et découverte
Profil « ملفي الشخصي » : avatar facultatif, nom affichable/pseudonyme, présentation courte, niveau et filière si vérifiés et consentis, groupes communs, publications visibles selon audience.
Ne jamais afficher matricule, email, téléphone, UUID, documents de vérification, date de naissance ou données administratives.
Annuaire « اكتشف الطلاب » : consentement opt-in obligatoire, recherche paginée, filtres facultatifs (1AS/2AS/3AS, filière, wilaya), résultats minimaux et possibilité de retirer sa découvrabilité.
Les niveaux et wilayas ne sont pas des frontières d'éligibilité : les élèves 1AS, 2AS et 3AS vérifiés peuvent se découvrir à l'échelle nationale.
Actions profil : « إضافة إلى زملائي » (demande sociale), « مراسلة » (redirige vers le Messenger existant, soumis à ses invitations et contrôles), « إبلاغ », « حظر ».
Être dans زملائي ne crée jamais automatiquement une conversation Messenger.

## 6. Relations « زملائي »
Trois sous-onglets : « الطلبات الواردة », « الطلبات المرسلة », « زملائي ».
Demande entrante : afficher le profil minimal et les actions « قبول », « رفض », « حظر ». Demande sortante : « إلغاء الطلب ». Relation établie : « إزالة من زملائي » et « مراسلة » si le flux Messenger l'autorise.
Les demandes sociales et les invitations de conversation Messenger sont deux flux distincts ; accepter une relation ne vaut pas consentement à une conversation privée.

## 7. Groupes « المجموعات الدراسية »
Découverte de groupes publics/visibles et espaces privés sur demande. Fiche : nom, description, matière/thème, niveau facultatif, établissement/wilaya si vérifiés, règles, modérateurs, nombre de membres seulement si exact.
Actions : « انضمام », « طلب الانضمام », « مغادرة المجموعة », « الإبلاغ ». Contrôle de rôle serveur pour administrateurs/modérateurs. Un groupe communautaire n'est pas un groupe de discussion Messenger : un bouton distinct « فتح محادثة المجموعة » n'apparaît que si le groupe de conversation existe et que l'utilisateur y est membre.

## 8. Notifications sociales
Centre « الإشعارات » avec catégories : demandes de contact, réactions/commentaires, mentions, invitations/activité de groupes, modération. Préférences par catégorie, marquer comme lu et pagination.
Ne pas détourner la table notifications administrative sans audit du schéma actif, de ses producteurs et de ses policies. Concevoir une source sociale dédiée si la réutilisation sûre n'est pas prouvée.

## 9. Responsive et accessibilité
- RTL natif, typographie arabe existante, boutons tactiles confortables et contrastes conformes.
- Mobile : fil en une colonne ; barre de navigation sociale compacte ; composer dans le flux ; aucune grille de trois colonnes.
- Médias responsives, chargement différé, texte alternatif, états de chargement/erreur/absence de réseau.
- Navigation clavier, focus visible, libellés accessibles et prise en charge de prefers-reduced-motion.
- Thème sombre : surfaces et textes testés en contraste, pas de texte gris pâle sur fond gris.

## 10. Critères d'acceptation avant codage
1. `msg` et son comportement restent inchangés ; aucun deuxième Messenger.
2. Le réseau social possède une route/vue distincte et une entrée de navigation stable.
3. Aucun écran ne lit directement profiles pour constituer l'annuaire national.
4. Chaque contenu possède une audience explicite ; le partage ne peut l'élargir.
5. Demandes de contact, invitations Messenger et membres de groupes sont des relations séparées.
6. Blocage bilatéral et signalement s'appliquent à la découverte, aux relations, au fil, aux commentaires et aux groupes.
7. Les filtres 1AS/2AS/3AS et wilaya sont facultatifs, sans restriction nationale.
8. Aucun contenu fictif ni compteur inventé n'est présenté comme réel.
9. Tests desktop/mobile, RTL, clavier, contraste et états vides sont réalisés.
10. Tests PostgreSQL/RLS multi-comptes en environnement isolé avant toute migration active.

## 11. Hors périmètre de ce lot
Aucun code applicatif, route, CSS, SQL, table, migration, RPC, policy, GRANT, Auth, RLS, Storage ou Realtime n'a été modifié. Aucun test comportemental PostgreSQL/RLS, CI hébergé, déploiement, merge ou dépense n'a été lancé.

Conclusion : le Lot 392 fournit la carte UX et la décision d'intégration. La prochaine étape peut être une maquette HTML/CSS locale isolée ou une implémentation progressive sur la branche après validation du contrat de sécurité ; elle ne doit pas remplacer le Messenger existant ni exposer l'annuaire.