# Lot 310 — audit du flux d'invitations Messenger

Date : 12 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Périmètre : lecture du code et du schéma SQL versionné uniquement. Aucun accès en écriture à Supabase.

## Décision

**NO-GO pour ajouter un bouton d'invitation fonctionnel uniquement côté navigateur.** Le modèle actuel n'a pas de table d'invitations ni de statut d'acceptation/refus. Une demande Messenger doit être un objet serveur de première classe.

## Constatations vérifiées

1. `msgOpenDirect(otherId)` appelle `msgCanDm`, puis crée immédiatement une ligne `msg_conversations(type='direct')` et tente d'insérer les deux membres.
2. La politique SQL `msg members ajout` autorise uniquement une insertion où `auth.uid() = user_id`. Un client ne peut donc pas légitimement ajouter la ligne d'adhésion de l'autre étudiant. Le flux actuel d'ouverture directe n'est pas un flux d'invitation et son insertion de deux membres depuis un seul client est incompatible avec cette politique.
3. `msg_member_ok` accepte toute conversation de type `direct` ; il ne représente pas un consentement du destinataire.
4. La dernière définition de `msg_can_dm(a,b)` dans `supabase/msg_schema.sql` exige que les deux profils soient vérifiés et partagent wilaya, niveau et filière. Elle ne permet donc pas encore le réseau national inter-lycées / inter-wilayas demandé.
5. Les tables actuelles `msg_conversations`, `msg_members`, `msg_messages`, `msg_attachments`, `msg_reports`, `msg_blocks` et `msg_log` ne contiennent pas de table dédiée aux invitations.
6. Les fonctions `msgBlock` / `msgUnblock` existent déjà ; elles doivent être prises en compte dans la décision d'envoi et d'acceptation.

## Flux cible

- Un étudiant vérifié recherche un profil de découverte minimal et demande à démarrer une conversation.
- Le serveur vérifie l'authentification, la vérification scolaire des deux comptes, l'éligibilité au réseau national, l'absence de blocage bilatéral, les préférences de réception, les limites de fréquence et les invitations en attente existantes.
- Le serveur crée une invitation `pending`, sans créer de conversation ni ajouter le destinataire comme membre.
- Le destinataire peut accepter ou refuser. L'expéditeur peut annuler sa demande tant qu'elle est en attente.
- À l'acceptation seulement, une fonction transactionnelle serveur crée ou retrouve la conversation et ajoute les deux membres ; les deux étudiants reçoivent un accès au fil.
- Le blocage, le signalement, l'annulation, l'expiration et la suspension sont traités côté serveur. Les réponses répétées doivent être idempotentes.

## Modèle serveur à concevoir (non appliqué)

Table proposée `msg_invites` : identifiant, expéditeur, destinataire, statut (`pending`, `accepted`, `declined`, `cancelled`, `expired`), conversation_id nullable, timestamps, contrainte anti-doublon des demandes actives, clés étrangères et index par destinataire/statut/date.

RPC envisagées :
- `msg_invite_create(target_user_id)` : contrôle complet et création de demande.
- `msg_invite_respond(invite_id, decision)` : seul le destinataire peut accepter/refuser ; acceptation atomique avec création des membres.
- `msg_invite_cancel(invite_id)` : seul l'expéditeur peut annuler une demande pending.
- `msg_invites_inbox(cursor, limit)` et `msg_invites_outbox(cursor, limit)` : champs minimaux, pagination bornée.

RLS : lecture limitée à l'expéditeur et au destinataire ; aucune insertion ou transition de statut libre depuis le client ; mutations via RPC transactionnelles contrôlées. Pas de GRANT à `anon`. Toutes les fonctions `SECURITY DEFINER` devront fixer `search_path`, qualifier les objets et vérifier explicitement `auth.uid()`.

## Tests obligatoires avant intégration

- étudiant vérifié d'une wilaya vers étudiant vérifié d'une autre wilaya : invitation possible ; conversation absente avant acceptation.
- étudiant non vérifié, compte suspendu ou non authentifié : refus.
- destinataire bloqueur ou bloqué : invitation et acceptation refusées.
- destinataire seul autorisé à accepter/refuser ; expéditeur seul à annuler.
- invitation répétée : pas de doublon actif ; réponses répétées idempotentes.
- limite de fréquence et pagination ; impossible d'énumérer tous les profils ou invitations.
- aucun ajout direct de membre ni message possible avant acceptation.
- les professeurs et administrateurs restent régis par leurs permissions propres ; ce flux étudiant ne leur ouvre pas de droits implicites.

## Suite

Préparer une migration SQL versionnée et des tests RLS/RPC synthétiques, puis demander une validation avant toute exécution sur le projet Supabase. Ensuite seulement, intégrer les vues « Invitations reçues » et « Invitations envoyées » dans `msg.js`.

## Actions interdites / non réalisées

Aucune migration exécutée, aucun changement de `msg_schema.sql`, aucune écriture Supabase, aucune politique RLS/GRANT modifiée, aucun compte ou message lu, aucune modification MFA/2FA, paiement/facturation, aucun merge, aucun déploiement, `main` inchangé.
