# Lot 396 — Contrat des invitations sociales et de la confidentialité

Date : 13 novembre 2026  
Produit : **ملتقى الطلاب**  
Statut : spécification fonctionnelle et sécurité — non déployée

## 1. Périmètre et séparation des systèmes

- Une relation sociale se nomme « زمالة » et appartient à **ملتقى الطلاب**.
- Une conversation privée appartient à **ماسنجر**. Accepter une invitation de زمالة ne crée, n'ouvre et ne rejoint aucune conversation.
- Les groupes d'étude (المجموعات الدراسية) sont distincts des groupes de conversations Messenger.
- Les notifications sociales sont distinctes des notifications administratives et Messenger.
- La découverte nationale peut couvrir les élèves autorisés de toutes les wilayas, niveaux et filières. Ces critères sont des filtres facultatifs, jamais des restrictions automatiques.
- L'annuaire ne doit pas permettre de confirmer l'existence d'un compte ou d'obtenir des données privées.

## 2. Machine d'états d'une invitation

Une invitation est une demande unidirectionnelle entre deux comptes distincts.

| État | Sens | Transition autorisée |
|---|---|---|
| `pending` | Demande envoyée, en attente | `accepted`, `declined`, `cancelled` |
| `accepted` | Demande acceptée | État terminal ; retrait via action distincte |
| `declined` | Demande refusée | État terminal ; nouvelle demande seulement après délai anti-harcèlement |
| `cancelled` | Demande annulée par l'expéditeur | État terminal |

Règles :
1. Un compte ne peut pas s'inviter lui-même.
2. Une seule demande active par paire non ordonnée de comptes ; une demande inverse active est traitée comme invitation reçue existante, sans doublon.
3. L'expéditeur peut annuler uniquement sa demande `pending`.
4. Le destinataire peut accepter ou refuser uniquement sa demande `pending`.
5. L'acceptation crée exactement une relation sociale, sans DM Messenger.
6. Les états terminaux ne sont pas réécrits. Une nouvelle demande éventuelle est une nouvelle ligne avec historique conservé.
7. Après refus, appliquer une période de refroidissement configurable et limiter les demandes répétées.
8. Les deux membres peuvent retirer une relation acceptée. Le retrait ne supprime pas l'historique d'audit ni les messages Messenger.
9. Les commandes sont idempotentes : leur répétition ne crée ni doublon ni effet secondaire supplémentaire.

## 3. Invariants de sécurité

- `sender_id != recipient_id`.
- Les deux comptes doivent être actifs et autorisés à utiliser les fonctions sociales.
- La découverte doit être activée par le destinataire ; un profil masqué n'est pas listé.
- Aucun résultat public ne contient email, téléphone, UUID/Auth ID, numéro d'inscription, justificatif scolaire, adresse exacte, jeton ou métadonnée privée.
- Le nom affiché, l'avatar et les champs autorisés sont retournés par une vue/fonction publique minimale, jamais par une lecture générale de `profiles`.
- Niveau, filière et wilaya sont facultatifs et contrôlés par visibilité explicite.
- Les justificatifs scolaires restent privés ; le statut de vérification n'expose ni document ni numéro de référence.
- Le blocage est bilatéral pour recherche, invitation, acceptation, profil, publication, commentaire, mention et conversation privée.
- Une demande ne peut pas être acceptée si un blocage existe dans l'un ou l'autre sens.
- Les erreurs externes ne révèlent pas si un identifiant arbitraire correspond à un compte.
- Limites de débit par compte et fenêtre temporelle ; détection des rafales, invitations en série et comptes automatisés.
- Journaliser les actions sensibles sans enregistrer les contenus privés ou secrets dans les logs.

## 4. Matrice d'autorisation minimale

| Action | Acteur autorisé | Contrôle obligatoire |
|---|---|---|
| Découvrir les profils | Élève authentifié et autorisé | Profil découvrable, pagination, filtres bornés |
| Consulter un profil | Propriétaire ou visiteur autorisé | Visibilité de chaque champ |
| Envoyer une invitation | Expéditeur | Découverte active, pas de blocage, pas de doublon, quota |
| Voir une invitation reçue | Destinataire seulement | `recipient_id = auth.uid()` |
| Annuler une invitation | Expéditeur seulement | État `pending` |
| Accepter/refuser | Destinataire seulement | État `pending`, aucun blocage |
| Retirer une relation | L'un des deux membres | Relation existante |
| Bloquer/débloquer | Auteur du blocage | Blocage privé, contrôle bilatéral |
| Signaler | Élève authentifié | Cible valide, motif contrôlé, anti-abus |
| Traiter un signalement | Modérateur autorisé | Rôle vérifié côté serveur, audit |

## 5. Blocage, signalement et modération

- Le blocage empêche immédiatement toute nouvelle interaction dans les deux sens.
- Les demandes `pending` entre les deux comptes sont neutralisées transactionnellement ; aucune information privée n'est révélée.
- Le blocage n'est pas visible publiquement.
- Un signalement comprend une catégorie, un motif court facultatif, la cible et un horodatage.
- Un signalement ne donne pas au déclarant accès aux données privées du signalé.
- Motifs : harcèlement, usurpation, contenu inapproprié, spam, menace, autre.
- Prévoir traitement humain, piste d'audit et recours. Pas de sanction irréversible automatique sur la seule base d'un signalement.
- Les comptes de mineurs nécessitent règles renforcées, collecte minimale et modération adaptée.

## 6. Anti-énumération et anti-spam

- Recherche paginée, taille de page maximale, tri stable et quotas.
- Pas de recherche par email, téléphone, numéro d'inscription ou identifiant interne.
- Pas d'endpoint « ce compte existe-t-il ? ».
- Réponses génériques lorsque la cible n'est pas visible, n'existe pas ou est protégée.
- Limiter les invitations en attente et les nouvelles demandes par période ; calibrer les seuils sur environnement de test.
- Délai après refus/annulation et détection des invitations croisées.
- Contrôle anti-automatisation seulement si nécessaire, sans dépendance payante imposée.
- Les filtres wilaya/niveau/filière ne contournent jamais la préférence de découverte.

## 7. Contrat API logique proposé (noms indicatifs)

- `social_directory_search(filters, cursor)` — profils publics minimaux.
- `social_invitation_send(target_profile_id, idempotency_key)` — demande ou réponse générique.
- `social_invitation_list_received(cursor)` et `social_invitation_list_sent(cursor)`.
- `social_invitation_accept(invitation_id, idempotency_key)`.
- `social_invitation_decline(invitation_id, idempotency_key)`.
- `social_invitation_cancel(invitation_id, idempotency_key)`.
- `social_contact_remove(contact_id)`.
- `social_block_create(target_profile_id)` / `social_block_remove(target_profile_id)`.
- `social_report_create(target_type, target_id, category, note)`.

Toutes les opérations dérivent l'identité de l'acteur de la session authentifiée côté serveur. Aucun endpoint n'accepte un `actor_id` fourni librement par le client. Les mutations sont transactionnelles, vérifient les permissions et le blocage bilatéral, et écrivent un audit minimal.

## 8. Tests négatifs obligatoires avant activation

| ID | Scénario | Résultat attendu |
|---|---|---|
| INV-01 | S'inviter soi-même | Refus |
| INV-02 | Deux invitations identiques simultanées | Une seule demande |
| INV-03 | Invitation inverse alors qu'une demande est active | Pas de doublon ; état cohérent |
| INV-04 | Tiers tente d'accepter | Refus |
| INV-05 | Expéditeur tente d'accepter sa propre demande | Refus |
| INV-06 | Destinataire tente d'annuler la demande reçue | Refus |
| INV-07 | Expéditeur tente d'annuler une demande acceptée | Refus |
| INV-08 | Répéter acceptation/refus/annulation | Idempotence, aucun effet secondaire |
| INV-09 | Accepter après blocage dans un sens | Refus |
| INV-10 | Bloquer pendant une invitation active | Invitation neutralisée |
| INV-11 | Retirer un contact par un non-membre | Refus |
| INV-12 | Réinviter immédiatement après refus | Refus ou délai de refroidissement |
| PRIV-01 | Profil non découvrable dans l'annuaire | Aucun résultat |
| PRIV-02 | Recherche email/téléphone/numéro scolaire | Non prise en charge |
| PRIV-03 | Lire les invitations d'un autre élève | Refus |
| PRIV-04 | Lire email/téléphone/justificatif via profil public | Aucune donnée |
| PRIV-05 | Deviner UUID/Auth ID | Pas de confirmation d'existence |
| PRIV-06 | Accès direct à une ligne sans autorisation | Refus RLS |
| BLK-01 | Blocage A→B puis interactions inverses | Aucune interaction dans les deux sens |
| BLK-02 | Compte bloqué tente de voir/interagir | Réponse générique |
| MOD-01 | Élève tente de traiter un signalement | Refus |
| MOD-02 | Signalements répétés pour harceler | Déduplication/limitation et audit |

## 9. Critères avant tout développement serveur

1. Schéma relationnel revu avec contraintes uniques et index.
2. Matrice RLS vérifiée sous rôle `authenticated` avec JWT synthétiques de plusieurs comptes, jamais sous `postgres`/`service_role` pour valider les droits élèves.
3. Tests négatifs sur une base isolée fidèle, jamais sur la base active.
4. Test de concurrence sur invitations croisées et doubles clics.
5. Audit des fonctions `SECURITY DEFINER`, `search_path`, privilèges EXECUTE et blocage bilatéral.
6. Audit Storage policies et notifications/realtime.
7. Aucun déploiement ni activation avant revue explicite et autorisation.

## 10. Limites de ce lot

Ce document est une spécification, pas une migration ni un contrat API déployé. Aucun SQL n'a été exécuté. Aucun objet Supabase, aucune donnée d'élève, aucun compte, aucune policy, Storage, Auth, RLS ou Realtime n'a été modifié. Aucun service payant, CI hébergé, déploiement ou merge n'est utilisé.