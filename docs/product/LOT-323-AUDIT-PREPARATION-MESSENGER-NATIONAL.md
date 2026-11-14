# Lot 323 — audit de préparation du vrai Messenger national

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : audit du code et des schémas versionnés ; aucune modification applicative ou base active.

## Conclusion

**Le Messenger national n'est pas terminé.** Le dépôt contient un socle de messagerie utilisable dans un périmètre scolaire restreint, mais pas encore le produit national inter-lycées demandé. L'interface elle-même annonce que la recherche nationale de contacts et les invitations seront ajoutées ultérieurement.

## Éléments effectivement présents

- `msg.js` (25 292 caractères au HEAD audité) construit une liste de groupes officiels, une liste de conversations privées, un champ de recherche limité aux conversations/groupes déjà chargés et des filtres Tout/Privées/Groupes.
- Le module affiche un fil de conversation et utilise un canal Supabase Realtime par conversation.
- Les fonctions clientes référencées dans la CI couvrent notamment conversations, messages, envoi, DM, groupes, signalement, blocage/déblocage, édition/suppression, upload, abonnement Realtime, modération et création de groupe.
- `supabase/msg_schema.sql` définit les tables `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_reports`, `msg_blocks` et `msg_log`.
- Le schéma contient des contrôles RLS et une fonction `msg_can_dm`, mais sa règle actuelle repose sur la correspondance wilaya+niveau+filière ; elle n'implémente donc pas l'ouverture nationale inter-wilayas voulue.

## Écarts bloquants constatés

1. **Annuaire national absent de l'interface actuelle.** La recherche de `msg.js` filtre les conversations déjà présentes ; elle ne recherche pas des élèves dans l'ensemble du réseau.
2. **Invitations absentes du schéma versionné.** Aucune table `msg_invites` ni RPC de création/réponse/annulation/inbox/outbox n'a été trouvée dans le contrat audité. Le flux direct existant ne remplace pas le consentement préalable.
3. **Affiliation institutionnelle non prouvée.** `public.profiles` ne porte que les attributs de profil scolaires déclaratifs connus dans le schéma versionné ; aucune relation canonique élève↔établissement avec source institutionnelle n'est établie. Le matricule et la section saisis par l'élève ne sont pas une preuve officielle.
4. **Règle DM incompatible avec l'objectif national.** `msg_can_dm` compare actuellement wilaya, niveau et filière. Il faut remplacer cette règle uniquement après définition d'une éligibilité nationale vérifiable et tests serveur.
5. **Groupes actuels limités.** L'interface et le modèle courant mettent en avant les groupes officiels par wilaya/niveau/filière ; les groupes nationaux thématiques avec découverte, adhésion et modération dédiée ne sont pas démontrés comme livrés.
6. **États Messenger avancés non démontrés.** Les reçus individuels, présence fiable, indicateur de saisie, réactions, réponses, épingles, archivage et recherche plein texte ne sont pas établis par le schéma de messages actuel.
7. **Tests insuffisants pour une ouverture nationale.** `tests/msg_test.mjs` et `ci/check-msg.mjs` sont principalement des contrôles statiques du contrat ; ils ne remplacent pas des tests d'intégration PostgreSQL/RLS avec identités synthétiques ni une recette multi-utilisateurs en temps réel.

## Découpage de réalisation retenu

- **323-A — compatibilité et contrat de sécurité :** confirmer schéma, fonctions, policies, privilèges et points d'entrée ; établir la matrice d'accès nationale (élève vérifié, professeur affecté, autre élève, parent, admin).
- **323-B — preuve d'affiliation :** finaliser le registre institutionnel et le processus de validation ; ne jamais convertir une déclaration libre en preuve.
- **323-C — invitations :** table et RPC transactionnelles versionnées, consentement du destinataire, idempotence, expiration, blocages, anti-spam et tests négatifs.
- **323-D — annuaire national :** recherche paginée côté serveur, champs publics minimaux, paramètres de visibilité et limitation anti-énumération.
- **323-E — DM national :** autorisation côté serveur fondée sur les affiliations vérifiées ; création atomique du DM et des membres seulement après acceptation.
- **323-F — groupes nationaux :** découverte, création, adhésion, rôles de modération et règles propres aux groupes.
- **323-G — finition Messenger :** reçus, présence, notifications et autres fonctions enrichies seulement lorsqu'elles sont alimentées par un mécanisme réel.
- **323-H — recette :** tests PostgreSQL/RLS isolés, tests multi-comptes, pièces jointes, Realtime, pagination, mobile, RTL, clair/sombre et régression.

## Ordre de travail et garde-fous

La priorité n'est pas d'ajouter des boutons à l'interface : c'est de rendre sûrs et cohérents le statut scolaire, l'annuaire, les invitations et les DM. Le shell UX peut être amélioré en parallèle avec des données explicitement synthétiques, jamais présentées comme réelles.

Aucune modification de `supabase/msg_schema.sql`, aucune migration, aucun changement Auth/RLS/GRANT/Storage, aucune écriture dans Supabase actif, aucune modification de `main`, aucun merge et aucun déploiement n'ont été effectués dans ce lot. PR #17 reste ouverte et non fusionnée. Pas de facturation ni de MFA/2FA.
