# Lot 391 — architecture fonctionnelle du réseau social « ملتقى الطلاب »

Date : 13 novembre 2026. Audit du code et conception ; aucune modification runtime ni base active.

## État GitHub au début du lot
- PR #17 : OPEN, non fusionnée, mergeable=true, mergeable_state=clean.
- HEAD observé : 344ef908150ff77bb196a4823c25c577723d3ada.
- Base observée : 51acfe8c97b6e152208d592dbd2c5bbde5c5c38e.
- Branche : design/prototypes-67-74-alignment. Instantané du début du lot.

## Cartographie du code réel
Fichiers examinés : app.js, msg.js, supabase/supabase.js, supabase/schema.sql et supabase/adm5_schema.sql.
1. app.js déclare VIEWS (ligne 450) et NAVSOLO_TOP (ligne 500). La vue msg existe déjà et doit être conservée.
2. Aucun module applicatif social dédié (fil, publications, relations) n'a été trouvé dans l'inventaire des fichiers applicatifs consulté.
3. msg.js reste le module Messenger existant ; ne pas créer une seconde messagerie.
4. supabase.js expose myNotifications et notifMarkRead, mais le système actuel est rattaché aux usages compte/administration ; il ne démontre pas un système complet de notifications sociales.
5. Le client effectue des lectures profiles. L'audit du lot 336 interdit d'ouvrir directement profiles comme annuaire national ; prévoir une projection serveur minimale avec liste blanche de champs.
6. Les scripts SQL versionnés sont historiques et ne prouvent pas l'existence de tables sociales dans le schéma actif.

## Produit et navigation cible
- Réseau social : ملتقى الطلاب
- Messagerie existante : ماسنجر
- Relations : زملائي
- Communautés : المجموعات الدراسية
Écrans proposés (pas encore codés) : آخر الأخبار, اكتشف الطلاب, زملائي, المجموعات الدراسية, الصور والفيديوهات, الفعاليات, الإشعارات, ملفي الشخصي, الخصوصية والأمان.

## Fonctionnalités à prévoir
- Profils : pseudonyme/nom affichable, photo facultative, présentation ; informations de niveau/filière/lycée/wilaya uniquement si vérifiées et partageables.
- Découverte nationale : opt-in, pagination, filtres facultatifs et protection anti-énumération.
- Relations : demande, accepter, refuser, annuler, retirer ; états explicites et unicité.
- Fil : publications autorisées, pagination par curseur, ordre pertinent et signalement.
- Publications : texte, images/fichiers, audience contrôlée, modification/suppression par auteur.
- Interactions : commentaires, réactions, partage avec attribution et respect de l'audience originale.
- Stories : phase ultérieure, expiration serveur et audience explicite.
- Groupes sociaux : adhésion, rôles, règles et modération ; séparés des groupes de conversations Messenger.
- Notifications sociales : événements, préférences, lecture et anti-spam ; distinctes des alertes administratives existantes.
- Modération : blocage bilatéral, signalement, masquage, traitement autorisé et journal d'audit.

## Confidentialité et sécurité
- Aucun annuaire national directement sur profiles ; projection serveur dédiée et champs allowlistés.
- Ne jamais exposer email, téléphone, UUID Auth, matricule, justificatifs ou données administratives privées.
- Découverte nationale réservée aux élèves vérifiés qui choisissent d'être découvrables ; consentement révocable.
- Les élèves vérifiés de 1AS, 2AS et 3AS peuvent se découvrir nationalement ; niveau, filière et wilaya sont des filtres, pas des barrières.
- Les données déclarées par l'élève ne prouvent pas son affiliation ; la source officielle individuelle reste à établir.
- Contrôles serveur/RLS sur chaque lecture et écriture ; blocage bilatéral appliqué à tous les domaines.
- Limitation de débit, pagination, modération, conservation proportionnée et protections par défaut adaptées aux mineurs.

## Médias et notifications
Le bucket privé prive est déjà utilisé par Messenger et possède ses propres règles. Ne pas réutiliser ses chemins ni modifier ses policies pour le social sans audit. Concevoir un stockage distinct, décider privé/signé versus public explicite, imposer limites MIME/taille, validation de contenu, quotas et suppression.
La table/fonction notifications repérée est orientée gestion. Examiner son schéma actif et ses producteurs avant toute réutilisation ; à défaut, séparer les événements sociaux.

## Ordre recommandé
1. Spécification UX arabe RTL et navigation sans toucher à msg.
2. Contrat de profil social minimal et source d'affiliation vérifiée.
3. Relations et politiques d'accès, puis tests négatifs isolés.
4. Publications, commentaires, réactions et audiences.
5. Groupes sociaux et modération.
6. Médias avec stockage distinct.
7. Notifications sociales et préférences.
8. Action مراسلة vers le Messenger existant, seulement après sécurisation du flux d'invitations des lots 385–390.
9. Déploiement après validation et autorisation explicite.

## Interdictions maintenues
- Ne pas dupliquer msg_conversations, msg_members, msg_messages, msg_attachments, msg_blocks, msg_reports ou msg_log.
- Aucune table/migration/RPC/policy/GRANT/Auth/RLS/Storage/Realtime modifiée sur Supabase actif.
- Aucun second projet ni branche payante ; aucun coût.
- Aucun test PostgreSQL/RLS réel n'est revendiqué : environnement isolé indisponible.
- Pas de modification main, pas de merge PR #17, pas de déploiement Cloudflare, pas de CI hébergé déclenché.
- Préserver IDs, routes, data-view, handlers et modules existants.

Conclusion : le code possède déjà Messenger et des notifications de gestion, mais l'audit ne démontre pas de fil social, de demandes de contact ni d'annuaire national. Ce lot fixe l'architecture sans activer de fonction sociale en production.