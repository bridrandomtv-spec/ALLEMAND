# Lot 429 — cartographie des écrans arabes de ملتقى الطلاب et الرسائل

**Date :** 13 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Statut :** audit statique et spécification d'interface — aucun code applicatif modifié.

## 1. Sources réelles inspectées

### index.html
La vue data-view="multaqa" existe vers les lignes 892–912. Elle est explicitement commentée comme « واجهة أولية مدمجة، بلا بيانات أو اتصال اجتماعي فعلي ». Son bandeau précise que publications, commentaires, recherche et demandes de زمالة ne sont pas activés et qu'aucune donnée d'élève n'est lue. Les exemples affichés sont fictifs. Le lien vers Messenger est un simple data-go="msg".

### msg.js
Le module est chargé dans index.html par msg.js?v=3514. Il gère actuellement :
- la liste des groupes officiels et des conversations existantes ;
- l'ouverture d'une conversation existante ;
- la lecture et l'envoi de messages, pièces jointes et mises à jour Realtime ;
- le signalement d'un message ;
- l'interface de modération pour les rôles professeur/administration ;
- la demande de vérification actuelle, liée dans le client à un abonnement actif.

Le champ de recherche actuel filtre uniquement les conversations et groupes déjà chargés dans la liste. Ce n'est pas un annuaire national. Aucun écran de demandes Messenger reçues/envoyées, d'acceptation/refus, de recherche nationale ou de blocage n'est branché dans ce module.

### supabase/supabase.js
Les helpers msgBlock et msgUnblock existent, mais le module msg.js ne propose pas de commandes UI correspondantes. msgOpenDirect côté client cherche une conversation déjà partagée et refuse d'en créer une nouvelle ; cette précaution cliente ne corrige pas la RPC serveur active relevée au Lot 427. msgRequestVerification exige actuellement un abonnement actif et stocke son numéro dans profiles.matricule : le parcours doit être remplacé, pas seulement renommé dans l'écran.

## 2. Cartographie des écrans — ملتقى الطلاب

| Écran / composant | Contenu et actions arabes attendus | État actuel |
|---|---|---|
| الصفحة الرئيسية للملتقى | Fil paginé, tri récent/pertinent, publications d'élèves autorisés | Maquette statique, exemples fictifs |
| إنشاء منشور | Composer texte, pièce jointe autorisée, audience, aperçu, publier/annuler | Bouton désactivé |
| المنشورات | Réagir, commenter, répondre, signaler, modifier/supprimer son propre contenu | Exemples non interactifs |
| البحث والاستكشاف | Recherche limitée aux profils découvrables, filtres facultatifs wilaya/niveau/filière | Non branché |
| زملائي | Liste des relations acceptées, retirer une relation, ouvrir le profil autorisé | Non branché |
| طلبات الزمالة | الواردة / المرسلة, accepter, refuser, annuler | Non branché |
| المجموعات الدراسية | Découvrir, demander/rejoindre selon règles de groupe, quitter, signaler | Présence uniquement illustrative |
| الإشعارات | Notifications sociales, préférences, marquer comme lues | Non branché |
| الملف الشخصي والخصوصية | Pseudonyme/avatar et champs explicitement visibles, contrôle de découvrabilité | Non branché |
| الحظر والبلاغات | Liste des comptes bloqués, débloquer, signaler contenu/profil | Non branché |

Le bouton « 💬 الانتقال إلى الرسائل » reste une navigation vers le module Messenger ; accepter une زمالة ne doit jamais déclencher cette navigation ni créer un DM.

## 3. Cartographie des écrans — الرسائل

| Écran / composant | Contenu et actions arabes attendus | État actuel |
|---|---|---|
| قائمة المحادثات | Conversations autorisées, recherche locale, filtres خاصة / مجموعات | Présent |
| المجموعات الرسمية | Groupes institutionnels autorisés et ouverture | Présent |
| البحث عن تلميذ | Annuaire national minimal, profils découvrables uniquement | Absent |
| دعوة إلى محادثة | Envoyer une demande Messenger distincte de زمالة | Absent |
| الطلبات الواردة | Accepter / refuser une invitation Messenger | Absent |
| الطلبات المرسلة | Voir l'état, annuler une invitation en attente | Absent |
| المحادثة الخاصة | Historique, envoi, pièces jointes, signalement, présence | Présent pour DM existants |
| الحظر | Bloquer, consulter les comptes bloqués, débloquer | Helpers présents, UI absente |
| الإبلاغ | Signaler un message avec motif structuré ; signaler un compte | Signalement message présent, profil absent |
| إعدادات الخصوصية | Découvrabilité, qui peut envoyer une demande, notifications | Absent |
| التحقق من الهوية المدرسية | Demande gratuite, statut, instructions, recours | Formulaire présent mais lié à l'abonnement — à remplacer |

## 4. Vocabulaire UI recommandé

Employer exclusivement des libellés arabes dans les interfaces :
- ملتقى الطلاب : espace social ;
- زمالة : relation sociale acceptée ;
- طلبات الزمالة : invitations sociales ;
- الرسائل : Messenger ;
- دعوة إلى محادثة : consentement pour un DM ;
- طلبات المحادثة : invitations Messenger ;
- الواردة / المرسلة : reçues / envoyées ;
- قبول / رفض / إلغاء : accepter / refuser / annuler ;
- حظر / إلغاء الحظر : bloquer / débloquer ;
- الإبلاغ عن محتوى : signaler un contenu ;
- إعدادات الخصوصية : paramètres de confidentialité ;
- التحقق من الهوية المدرسية : vérification scolaire.

Ne pas afficher « Messenger » en anglais dans la navigation destinée aux élèves. Le nom visible reste الرسائل.

## 5. Règles de navigation et de consentement

1. Depuis une publication ou un profil, l'action sociale est إرسال طلب زمالة.
2. Depuis un profil découvrable, l'action privée séparée est دعوة إلى محادثة, si la politique du compte l'autorise.
3. Accepter طلب زمالة crée uniquement une relation sociale.
4. Accepter دعوة إلى محادثة crée ou retrouve le DM par transaction serveur.
5. Le retrait de زمالة ne supprime pas automatiquement les conversations existantes.
6. Bloquer un compte neutralise les interactions sociales et privées dans les deux sens.
7. Les actions masquées côté client doivent aussi être interdites côté serveur.
8. Les élèves non vérifiés voient les informations institutionnelles et le parcours de vérification, pas l'annuaire personnel, la publication ou les DM.
9. Les élèves vérifiés non abonnés disposent des mêmes fonctions sociales et de messagerie essentielles que les abonnés.
10. Aucun abonnement ne peut acheter une visibilité, un accès au profil privé ou un consentement.

## 6. Ordre de réalisation recommandé

**Phase A — sécurité serveur (bloquante) :** invitation sociale, invitation Messenger séparée, consentement atomique, blocage bilatéral, profils minimaux, vérification gratuite, quotas, modération et tests isolés.

**Phase B — ملتقى الطلاب :** brancher d'abord la navigation/annuaire et les demandes de زمالة, puis publications/commentaires/réactions, groupes et notifications, avec pagination et modération.

**Phase C — الرسائل :** ajouter recherche nationale, invitations reçues/envoyées, accepter/refuser/annuler, blocage et préférences ; conserver la liste et le fil existants sans régression.

**Phase D — lancement contrôlé :** comptes de test synthétiques, revue des droits RLS sous JWT authentifiés, essais mobile/desktop, observation des signalements et activation graduelle seulement après validation.

## 7. Limites et opérations

- Lecture statique de index.html, msg.js et des fonctions ciblées de supabase/supabase.js.
- Aucun code applicatif modifié ; aucune donnée Supabase lue dans ce lot.
- Aucun SQL, migration, changement Auth/RLS/ACL/RPC/trigger/Storage/Realtime/paiement.
- Aucun déploiement ; main inchangée ; PR #17 reste ouverte et non fusionnée.
- Le résultat confirme que ملتقى الطلاب est actuellement une maquette statique et que الرسائل fonctionne pour les groupes/DM déjà existants, mais ne possède pas encore le parcours social national complet.

**Décision :** la prochaine réalisation ne doit pas simplement ajouter des boutons à la maquette. Elle doit brancher les écrans arabes sur des opérations serveur sûres, en conservant la séparation entre زمالة et consentement Messenger.