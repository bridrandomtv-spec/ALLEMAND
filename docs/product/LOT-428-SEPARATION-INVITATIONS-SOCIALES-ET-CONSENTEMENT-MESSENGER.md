# Lot 428 — séparation des invitations sociales et du consentement Messenger

**Date :** 13 novembre 2026  
**Branche cible :** `design/prototypes-67-74-alignment`  
**Statut :** conception et décision d'architecture uniquement — NON EXÉCUTÉE / NON DÉPLOYÉE  
**Références :** Lots 387, 396, 413, 420, 427.

## 1. Décision d'architecture

Les invitations de `ملتقى الطلاب` et le consentement d'ouverture d'une conversation dans `الرسائل` sont deux objets métier distincts.

Le Lot 387 proposait une invitation Messenger dont l'acceptation crée un DM. Le Lot 396 définit séparément la relation sociale `زمالة` et précise que l'acceptation d'une invitation sociale ne crée jamais un DM. Il ne faut ni fusionner ces deux flux ni faire dépendre automatiquement l'un de l'autre.

Décision de conception :
- `social_invitations` (ou nom final validé au moment du schéma) gère les demandes de زمالة dans `ملتقى الطلاب`. L'acceptation crée uniquement une relation sociale.
- `msg_invitations` gère le consentement spécifique à une conversation privée. L'acceptation par le destinataire crée ou retrouve atomiquement le DM et ses deux membres.
- Une زمالة acceptée ne donne pas à elle seule le droit d'envoyer un message privé.
- Une invitation Messenger acceptée ne doit pas créer implicitement une زمالة.
- Les deux fonctionnalités restent gratuites pour les élèves vérifiés, abonnés ou non. L'abonnement ne change jamais la confiance, la visibilité, le consentement ou les possibilités de blocage.

## 2. Parcours fonctionnels

### 2.1 ملتقى الطلاب — زمالة

1. Un élève vérifié et autorisé découvre un profil qui a activé sa découvrabilité.
2. Il envoie une demande de زمالة.
3. Le destinataire peut accepter ou refuser ; l'expéditeur peut annuler tant que la demande est en attente.
4. L'acceptation crée uniquement le lien social réciproque.
5. Aucun DM, aucune ligne dans `msg_conversations` et aucun membre Messenger ne sont créés par ce flux.
6. Le retrait de زمالة retire la relation sociale selon une transaction dédiée, sans supprimer automatiquement l'historique Messenger.

États recommandés : `pending`, `accepted`, `declined`, `cancelled`, `expired`. Les états terminaux sont conservés dans l'historique ; les demandes répétées sont soumises à une période de refroidissement et à des quotas.

### 2.2 الرسائل — consentement privé

1. Un élève vérifié peut envoyer une invitation Messenger à un profil découvrable, sous réserve des préférences et limites de sécurité.
2. Une demande en attente ne crée aucune conversation, aucun membre et aucun droit de lecture/écriture.
3. Seul le destinataire peut accepter ou refuser ; seul l'expéditeur peut annuler.
4. L'acceptation est une opération serveur transactionnelle : verrouiller l'invitation, revérifier l'identité, l'éligibilité, l'expiration et les blocages dans les deux sens, puis créer ou retrouver un DM unique, ajouter exactement les deux membres et lier la conversation à l'invitation.
5. Si une étape échoue, toute la transaction est annulée.
6. Après acceptation, les messages restent soumis aux contrôles d'accès, au blocage, au signalement et à la modération. Le blocage doit pouvoir interrompre les échanges même si le DM existe déjà.

États recommandés : `pending`, `accepted`, `declined`, `cancelled`, `expired`. Une demande de زمالة acceptée n'est pas une preuve d'acceptation Messenger.

## 3. Invariants communs

- L'identité de l'acteur provient exclusivement de la session authentifiée (`auth.uid()`), jamais d'un UUID fourni par le navigateur.
- Les deux comptes doivent être actifs, vérifiés selon une source scolaire autorisée et éligibles à la fonctionnalité.
- Les préférences de découvrabilité sont respectées ; une recherche ne confirme pas l'existence d'un compte masqué ou protégé.
- Les blocages A→B et B→A sont tous deux vérifiés sur recherche, invitation, acceptation, création/réouverture de DM et envoi.
- Un blocage neutralise transactionnellement les demandes en attente entre les deux comptes.
- Aucune donnée d'inscription, preuve scolaire, téléphone, e-mail, UUID/Auth ID ou métadonnée administrative n'est exposée dans les résultats sociaux ou les profils Messenger.
- Les commandes de mutation sont idempotentes, limitées en débit et auditées sans journaliser le contenu des messages.
- Les erreurs publiques ne permettent pas d'énumérer les comptes.
- Les filtres wilaya/niveau/filière sont des filtres facultatifs, non des frontières d'autorisation. L'ouverture nationale doit être décidée explicitement et protégée par la découvrabilité.

## 4. Schéma et RPC — principes, pas SQL exécutable

Conserver le modèle de `msg_invitations` proposé au Lot 387 pour le consentement DM, sous réserve de révision de ses contraintes et de son intégration au catalogue actif.

Prévoir un modèle distinct pour la relation sociale :
- demandeur et destinataire ;
- statut et horodatages de création/réponse/expiration ;
- contrainte empêchant les demandes actives dupliquées dans les deux sens ;
- historique des décisions terminales ;
- opérations serveur d'envoi, liste reçue/envoyée, acceptation, refus, annulation et retrait de relation.

Ne pas recopier les tables ni les migrations historiques sans comparaison avec le catalogue actif. Le schéma exact, les noms finaux, les index, contraintes, ACL et policies devront être préparés après inventaire des objets actifs et revue de sécurité.

RPC logiques distinctes :
- Social : `social_invitation_send`, `social_invitation_respond`, `social_invitation_cancel`, `social_contact_remove`.
- Messenger : `msg_invite_send`, `msg_invite_respond`, `msg_invite_cancel`, `msg_open_direct`.
- Recherche : une projection publique minimale, indépendante de la table complète `profiles`.

Aucune RPC client ne doit permettre de créer directement un DM ou d'ajouter arbitrairement un membre sans preuve d'invitation Messenger acceptée.

## 5. Écarts du catalogue actif à traiter avant ouverture

Le Lot 427 a constaté sur le projet Supabase existant :
1. `msg_open_direct(uuid)` peut créer un DM et ses membres sans invitation acceptée.
2. Le contrôle de blocage n'est pas bilatéral sur tous les chemins.
3. Une policy de lecture entre membres autorise potentiellement l'accès à toutes les colonnes SELECT de `profiles`, dont des champs administratifs.
4. Le parcours client de vérification dépend d'un abonnement, contrairement à la décision produit de vérification gratuite.
5. Le client `msg.js` ne branche pas encore la recherche nationale, les invitations reçues/envoyées, l'acceptation/refus et le blocage.

Ces constats maintiennent le verdict **NO-GO pour l'ouverture nationale de Messenger**. La CI verte n'est pas une preuve de sécurité SQL/RLS.

## 6. Vérification scolaire et tarification

La vérification scolaire est gratuite et indépendante de l'abonnement. Le numéro d'abonnement ne doit jamais être utilisé comme matricule scolaire ou preuve d'identité.

Avant implémentation, il faut déterminer la source officielle ou le justificatif accepté, les agents habilités, le traitement des dossiers en attente/refusés et les règles adaptées aux mineurs. Les documents justificatifs restent privés et ne sont jamais visibles par les autres élèves.

Les comptes non vérifiés peuvent accéder aux informations institutionnelles publiques et au parcours de vérification, mais ne peuvent pas publier dans les espaces réservés, consulter l'annuaire personnel ni envoyer/recevoir des DM.

## 7. Matrice de tests obligatoire en environnement isolé

Utiliser au minimum quatre comptes synthétiques A/B/C/D avec sessions `authenticated` indépendantes et JWT distincts.

### Social
- Une demande en attente ne crée qu'une demande, pas de DM.
- Seul le destinataire accepte/refuse ; seul l'expéditeur annule.
- L'acceptation crée une relation sociale et aucun objet Messenger.
- Les demandes croisées et doubles clics ne créent aucun doublon.
- Le retrait de زمالة ne supprime pas un DM existant.

### Messenger
- Une invitation en attente ne crée ni conversation ni membre.
- Seul le destinataire peut accepter ; un tiers ne peut pas agir.
- L'acceptation crée exactement un DM et deux membres, une seule fois.
- Refus, annulation et expiration ne peuvent pas ouvrir de DM.
- La زمالة acceptée sans invitation Messenger acceptée ne permet pas d'envoyer un DM.
- Une invitation Messenger acceptée ne crée aucune زمالة.

### Sécurité transversale
- Tester les deux sens de blocage avant et après création du DM.
- Tester les appels RPC directs, INSERT/UPDATE directs et chemins de membership, pas seulement le navigateur.
- Vérifier les profils avec une projection minimale et tenter explicitement de lire les champs interdits.
- Vérifier anon, authenticated, propriétaire et rôles de modération avec des privilèges distincts.
- Tester quotas, énumération, demandes répétées, concurrence et idempotence.
- Ne jamais utiliser `postgres` ou `service_role` pour prétendre valider les droits d'un élève.

## 8. Séquence de réalisation proposée

1. Figer le contrat fonctionnel des deux flux et les règles de découvrabilité.
2. Préparer un patch SQL non exécuté pour un environnement isolé, après comparaison du schéma actif.
3. Corriger d'abord les frontières serveur : RPC, RLS, ACL, triggers, blocage bilatéral et profils minimaux.
4. Découpler la vérification gratuite du paiement.
5. Brancher ensuite les écrans arabes dans `ملتقى الطلاب` et `msg.js` : recherche, demandes reçues/envoyées, accepter/refuser/annuler, زمالة, blocage, signalement.
6. Exécuter les tests multi-comptes isolés et faire relire les résultats.
7. Obtenir une autorisation explicite distincte avant toute modification du projet Supabase actif.
8. Ne déployer ni fusionner PR #17 avant validation visuelle et sécurité.

## 9. Limites et opérations de ce lot

- Conception documentaire uniquement.
- Aucune requête SQL exécutée dans ce lot ; l'autorisation précédente était limitée aux SELECT du Lot 427.
- Aucune écriture ou modification Supabase, Auth, RLS, ACL, RPC, trigger, Storage, Realtime ou paiement.
- Aucun compte ou message d'élève lu.
- Aucun environnement payant, installation, dépense ou déploiement.
- `main` inchangée ; PR #17 doit rester ouverte et non fusionnée.

**Décision :** maintenir deux consentements séparés — زمالة pour le réseau social, invitation Messenger pour le DM. Les deux restent gratuits pour les élèves vérifiés ; aucun lien social ni abonnement ne remplace le consentement explicite à une conversation privée.
