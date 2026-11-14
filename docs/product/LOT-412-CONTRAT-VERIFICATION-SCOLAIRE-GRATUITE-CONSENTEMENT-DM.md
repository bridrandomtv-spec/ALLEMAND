# Lot 412 — proposition de vérification scolaire indépendante du paiement et de consentement Messenger

Date : 13 novembre 2026  
Branche : design/prototypes-67-74-alignment  
Statut : proposition produit/technique à valider ; aucune implémentation, migration ou modification de base.

## 1. Objectif

Permettre à tout élève réellement inscrit de participer à la communauté scolaire sans payer un abonnement, tout en empêchant les comptes non vérifiés d'accéder aux contenus personnels et aux conversations privées.

Trois états doivent rester indépendants :
1. **Compte** : inscription et connexion à la plateforme.
2. **Identité scolaire** : affiliation vérifiée par une source autorisée.
3. **Abonnement** : droits commerciaux pour les contenus pédagogiques ou options premium.

Un paiement ne prouve pas qu'une personne est élève. Une identité scolaire vérifiée ne doit pas exiger un paiement.

## 2. Vérification scolaire gratuite proposée

### Source de preuve
Ordre de préférence :
1. Vérification par une source officielle ou un établissement partenaire, si une intégration autorisée existe.
2. À défaut, contrôle manuel par un vérificateur habilité, limité à son établissement ou périmètre de wilaya.
3. Si aucune source fiable n'est disponible, maintenir le compte en attente ; ne pas transformer le paiement en preuve de remplacement.

Le numéro d'inscription scolaire peut servir d'identifiant de rapprochement interne s'il est effectivement vérifiable. Il ne doit jamais être visible par les autres élèves. Le numéro d'abonnement reste réservé à la facturation et à la gestion commerciale.

### Parcours candidat
- Le compte demande une vérification scolaire gratuite.
- Il fournit uniquement les données minimales nécessaires au rapprochement : établissement/périmètre, niveau, filière/classe et identifiant scolaire privé si une source autorisée permet de le vérifier.
- Le système place la demande en attente ; aucune permission sociale n'est accordée avant décision.
- Un vérificateur autorisé accepte ou refuse avec motif interne minimal.
- L'état final est verifie ou rejete, avec acteur et horodatage d'audit.
- Les pièces justificatives, si exceptionnellement nécessaires, doivent être traitées dans un canal privé et temporaire ; aucune pièce ne doit être publiée dans le profil ou le fil social. La conservation doit être définie avant activation.

### Données à ne jamais exposer
Numéro d'inscription, numéro d'abonnement, document scolaire, pièce d'identité, téléphone, e-mail, adresse et localisation précise. Les autres élèves ne voient qu'un profil minimal : nom d'affichage/pseudonyme, avatar facultatif, niveau/classe si autorisé.

## 3. Règles d'accès proposées

| État | ملتقى الطلاب | الرسائل |
|---|---|---|
| Compte inscrit, vérification en attente | Présentation, règles et annonces institutionnelles seulement | Pas d'annuaire privé ni de DM ; accès à la demande de vérification |
| Élève vérifié, sans abonnement | Fil social autorisé par audience ; publication/commentaire/réaction selon limites | Messagerie textuelle essentielle disponible ; contact soumis au consentement |
| Élève vérifié, abonnement actif | Même accès social de base ; aucun privilège de visibilité supplémentaire | Même messagerie essentielle ; options avancées éventuelles séparées |
| Abonné non vérifié | Aucun contenu personnel d'élève | Aucun DM ni annuaire privé |
| Vérification suspendue/révoquée | Suspension des actions et contenus sociaux sensibles | Pas de nouvelle demande ni de nouveau DM ; politique de conservation explicite |

L'abonnement ne doit jamais contourner le statut scolaire, le blocage, le refus ou les restrictions de sécurité.

## 4. Consentement Messenger proposé

Le fait de voir un profil, d'être dans la même classe ou de devenir relation dans le ملتقى ne crée pas automatiquement une conversation.

Flux cible :
1. L'élève A envoie une demande de contact à B, seulement si les deux comptes sont vérifiés et compatibles avec le périmètre scolaire autorisé.
2. La demande ne révèle pas de contenu privé et peut être acceptée, refusée, bloquée ou ignorée.
3. Une conversation directe n'est créée qu'après acceptation explicite de B.
4. Le refus ne révèle pas d'information supplémentaire à A ; les répétitions sont limitées par un anti-spam serveur.
5. Chaque participant peut bloquer ou signaler ; le blocage empêche les nouveaux contacts et interactions conformément à une règle cohérente entre les deux modules.
6. Une demande acceptée peut être révoquée ; les effets sur l'historique et la rétention doivent être définis avant implémentation.

Le périmètre scolaire commun (wilaya/niveau/filière ou une granularité plus précise validée) demeure une condition supplémentaire, pas un substitut au consentement.

## 5. Contrat de sécurité serveur
- Toute décision d'identité, audience, relation, invitation, blocage et message doit être contrôlée côté serveur/RLS.
- Ne jamais faire confiance à AUTH.session(), au DOM, à un rôle local ou à un indicateur fourni par le navigateur pour accorder un accès social.
- La vérification doit être décidée par une autorité habilitée ; le compte élève ne peut que déposer une demande.
- L'API de profil destinée aux pairs doit retourner une projection minimale, pas la ligne complète de profiles.
- Les colonnes d'identification et de preuve doivent être protégées par des privilèges adaptés, en plus des policies RLS.
- Les opérations de demande et d'acceptation doivent être idempotentes, journalisées et limitées en fréquence.
- Les notifications ne contiennent aucun identifiant privé ni contenu de message.
- Les fonctions de modération ne donnent pas un accès général aux conversations privées.

## 6. Tests bloquants avant activation
1. Élève vérifié sans abonnement : accès au fil autorisé et aux messages essentiels.
2. Abonné non vérifié : aucune lecture du contenu personnel ni DM.
3. Demande de vérification sans paiement : possible.
4. Demande de vérification avec identifiant inventé : reste en attente/refusée, jamais vérifiée automatiquement.
5. Un élève ne peut pas modifier lui-même son statut vers verifie.
6. Un élève ne peut pas lire le matricule ou l'identifiant d'un autre élève.
7. Une demande DM non acceptée ne crée aucune conversation.
8. Une relation sociale ne crée aucun DM.
9. Un refus bloque les répétitions abusives et ne révèle pas le motif privé.
10. Un blocage empêche les nouveaux contacts dans les deux sens selon la politique retenue.
11. Un abonnement actif ne contourne ni blocage ni refus.
12. Les rôles professeur, parent et administrateur ne reçoivent que les permissions explicitement prévues.
13. Une révocation de vérification retire immédiatement les nouvelles autorisations sociales.
14. Accès direct à un post, profil, conversation ou notification par identifiant : refus si non autorisé.
15. Les données sensibles sont absentes des logs, notifications et résultats de recherche.

## 7. Décisions qui nécessitent validation avant code
- Quelle source officielle ou quel responsable scolaire pourra confirmer l'inscription ?
- Le numéro d'inscription scolaire est-il vérifiable dans un registre autorisé, ou faut-il une procédure manuelle ?
- Quelle granularité définit le groupe scolaire commun pour le premier contact : même classe, même établissement, ou même wilaya/niveau/filière ?
- Les demandes de contact doivent-elles être limitées à une seule demande en attente par paire de comptes ? Proposition : oui.

Aucune de ces questions ne justifie de bloquer la conception de la maquette, mais elles doivent être tranchées avant toute migration ou activation backend.

## 8. Hors périmètre
Aucun changement de schéma, trigger, policy RLS, Auth, Storage, Realtime, Messenger existant, paiement ou abonnement n'est effectué dans ce lot. Aucun accès à la base active ni aux données d'élèves. Aucun service payant, déploiement Cloudflare ou fusion.