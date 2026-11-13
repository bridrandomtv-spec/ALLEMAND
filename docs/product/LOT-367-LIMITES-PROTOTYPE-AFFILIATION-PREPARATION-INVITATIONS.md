# Lot 367 — limites du prototype d'affiliation et préparation du cycle d'invitations

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Nature : audit statique des contrats et du prototype hors ligne. Aucun changement applicatif, aucune migration et aucune écriture Supabase.

## 1. Vérification de continuité

Les lots 322, 327 et 337 existent déjà et restent la référence :
- Lot 322 définit le modèle relationnel logique du registre, sans DDL.
- Lot 327 distingue le référentiel des établissements de la preuve individuelle d'inscription.
- Lot 337 définit le contrat serveur de l'annuaire et des invitations nationales.

Le prototype `prototypes/registry-affiliation-scenarios-core.mjs` est explicitement hors ligne et synthétique. Il n'est connecté ni à Supabase Auth, ni à PostgreSQL, ni à un registre scolaire.

## 2. Ce que les tests actuels prouvent réellement

Les huit scénarios automatisés couvrent :
- habilitation d'un vérificateur pour le lycée exact ;
- interdiction de l'auto-validation ;
- rejet d'une source non vérifiée/révoquée ;
- refus des décisions répétées après clôture ;
- transfert avant validation dans un autre lycée ;
- séparation opérateur/approbateur pour la révocation ;
- expiration et consentement d'annuaire ;
- refus des transitions inconnues.

Ils valident des règles métier unitaires sur des objets synthétiques. Ils ne prouvent ni l'isolation concurrente de transactions PostgreSQL, ni les droits RLS, ni l'identité d'un agent réel.

## 3. Limites détectées dans le prototype

1. **Unicité globale non garantie par le moteur de démonstration.** La fonction `decideAffiliation` reçoit éventuellement `previousEnrollment`, mais elle ne possède aucun dépôt partagé permettant de rechercher toutes les affiliations d'un élève pour une année. Si l'appelant omet ce paramètre, le prototype ne peut pas garantir l'unicité globale. Cette contrainte doit être imposée par une contrainte/index transactionnel en base et testée en concurrence.
2. **Éligibilité annuaire volontairement partielle.** `canAppearInNationalDirectory` contrôle le statut `verified`, l'année scolaire, l'état de la source et l'opt-in. Il ne contrôle pas un compte suspendu, le rôle du compte, les dates d'effet, les blocages Messenger, les quotas ni la révocation d'une habilitation d'approbateur. Ces exigences figurent au contrat Lot 337 mais ne sont pas implémentées dans ce helper.
3. **Aucune invitation Messenger opérationnelle.** Les méthodes serveur `msg_invite_create`, `msg_invite_respond`, `msg_invite_cancel`, `msg_invite_inbox` et `msg_invite_outbox` restent des noms contractuels ; aucune RPC active ni interface connectée n'a été confirmée.
4. **Aucune garantie d'atomicité démontrée.** La création de l'invitation acceptée et du DM avec exactement deux membres doit être une transaction serveur unique. Le prototype d'affiliation ne teste pas ce mécanisme.

## 4. Décisions de mise en œuvre

- Ne pas transformer le prototype actuel en preuve officielle ou en source d'autorisation de production.
- Ne pas ajouter une migration sur la base active à partir de fichiers historiques divergents.
- Préserver les DM historiques et la création des groupes de modération ; ne pas révoquer globalement les INSERT sur `msg_conversations` ou `msg_members`.
- Préparer la migration Messenger uniquement à partir d'un baseline PostgreSQL fiable et la tester sur une instance jetable locale, avec des comptes synthétiques.
- Pour l'affiliation, exiger une source institutionnelle approuvée et une décision d'approbateur dont l'habilitation est contrôlée côté serveur.

## 5. Scénarios obligatoires avant tout GO production

### Affiliation
- deux demandes concurrentes pour le même élève et la même année ;
- double affiliation active malgré une requête concurrente ;
- source désactivée ou version remplacée entre demande et approbation ;
- vérificateur suspendu ou affecté à un autre établissement ;
- transfert, expiration, révocation et réouverture avec historique conservé ;
- annuaire refusé si compte suspendu, non opt-in, affiliation expirée ou source révoquée.

### Invitations et DM
- expéditeur/destinataire inversés, auto-invitation, compte suspendu ;
- blocage dans chaque sens ;
- invitation dupliquée/rejouée avec même clé d'idempotence ;
- acceptation et acceptation concurrente ;
- acceptation simultanée à l'expiration ou à l'annulation ;
- refus/annulation/expiration sans création de conversation ;
- acceptation créant un seul DM et exactement les deux membres ;
- RPC historique `msg_open_direct` incapable de créer un nouveau DM ;
- INSERT direct et auto-adhésion à un DM refusés ;
- réouverture d'un DM historique et création de groupe modéré toujours fonctionnelles.

## 6. État des environnements

- Supabase actif : aucune écriture, aucun DDL, aucune modification Auth/RLS/GRANT/Storage.
- Données : aucun profil nominatif, message ou contenu de conversation consulté.
- Git : branche de la PR #17 uniquement ; aucun changement de `main`, aucun merge.
- Cloudflare : aucun déploiement dans ce lot.

## 7. Décision

**GO** pour maintenir les contrats et prototypes synthétiques, et préparer des tests locaux isolés.  
**NO-GO** pour déclarer le Messenger national terminé, activer l'annuaire réel, appliquer les migrations ou ouvrir les invitations inter-lycées avant les tests transactionnels et l'obtention de la preuve institutionnelle.
