# Lot 410 — contrat MVP social, accès et confidentialité

Date : 13 novembre 2026  
Branche : `design/prototypes-67-74-alignment`  
Statut : décision produit proposée et contrat de sécurité documentaire ; aucune activation backend.

## 1. Décision produit recommandée

Le réseau social et la messagerie ne doivent pas être entièrement payants. L'accès doit être gouverné par l'identité scolaire vérifiée, le consentement et l'état du compte, et non par le seul paiement.

| Espace | Compte inscrit non vérifié | Élève vérifié | Abonnement payant |
|---|---|---|---|
| `🌐 ملتقى الطلاب` | Peut ouvrir l'espace et voir uniquement les informations de présentation/annonces publiques institutionnelles ; aucun contenu personnel d'élève | Peut consulter le fil autorisé, publier et interagir selon les audiences et permissions | Aucun privilège de visibilité supplémentaire par défaut |
| `💬 الرسائل` | Aucun accès aux conversations ni aux annuaires ; parcours de vérification expliqué | Messagerie texte essentielle, demandes de contact consenties et conversations acceptées | Fonctions avancées possibles ultérieurement, sans réserver les échanges essentiels au paiement |
| Médias, vidéo et stockage avancé | Non | À définir après MVP et audit de sécurité | Candidats à des options premium, uniquement si le coût réel est maîtrisé |

**Règle de base :** l'inscription crée un compte, pas une identité scolaire vérifiée. L'abonnement confirme un droit commercial, pas le statut d'élève. Ces trois états doivent rester indépendants : compte, affiliation scolaire vérifiée, abonnement.

## 2. États et autorisations

- `registered_pending_verification` : compte créé ; accès à l'onboarding, aux informations générales et au processus de vérification uniquement.
- `student_verified_active` : affiliation vérifiée par une source/autorité autorisée ; accès aux fonctions sociales correspondant aux permissions.
- `student_verification_expired` ou `revoked` : les actions et données sociales sensibles sont suspendues selon une politique de rétention à valider ; aucune réactivation implicite.
- `subscription_active` / `subscription_inactive` : état commercial indépendant, qui ne doit pas modifier l'identité scolaire ni ouvrir les conversations privées.
- Les comptes professeur, parent, modérateur et administrateur suivent des autorisations propres. Une fonction de modération ne donne pas automatiquement accès à tous les messages privés.

La vérification ne doit pas exposer publiquement le numéro d'inscription, le numéro d'abonnement, les justificatifs, le téléphone, l'adresse e-mail ou la localisation précise.

## 3. ملتقى الطلاب — MVP

### Contenu et audience
- MVP limité aux publications textuelles, sans pièce jointe ni vidéo.
- Chaque publication a un auteur, un horodatage serveur, un état de modération et une audience explicite.
- Valeurs d'audience possibles à examiner : `private`, `connections`, `class`, `school`. L'audience `wilaya` et surtout `public` restent désactivées par défaut pour les élèves mineurs.
- Les contenus visibles dans le fil, la recherche, les notifications, les aperçus, les compteurs et les liens directs doivent appliquer exactement la même règle d'autorisation côté serveur.
- Pas de publication anonyme au lancement.
- La publication, la modification et la suppression sont limitées à l'auteur et aux rôles de modération explicitement autorisés.
- Longueur maximale, fréquence, délai anti-spam et limites de compte doivent être définis avant mise en production.
- Tout texte doit être rendu comme texte non fiable (échappement/sanitisation), jamais injecté comme HTML brut.

### Commentaires et réactions
- Un commentaire hérite au minimum de l'audience de la publication ; il ne peut jamais élargir sa visibilité.
- L'auteur d'une publication peut désactiver les commentaires.
- L'utilisateur peut modifier/supprimer ses propres commentaires ; modération avec motif et journalisation.
- Une seule réaction active par utilisateur et publication ; changement ou retrait idempotent.
- Les listes nominatives de réactions ne sont visibles qu'aux personnes autorisées à voir la publication.

### Relations et blocage
- Demande, acceptation, refus, annulation, retrait et blocage sont des états distincts.
- Une relation sociale n'accorde aucun accès implicite à un groupe ni à une conversation Messenger.
- Le blocage social empêche au minimum les recherches réciproques, invitations, interactions et nouveaux contacts sociaux entre les deux comptes.
- Le blocage Messenger reste géré par le module Messenger ; les effets croisés doivent être spécifiés et testés avant toute intégration. Aucun DM ne doit être créé automatiquement depuis une relation sociale.
- Les actions de signalement et de blocage doivent rester accessibles sur les profils, publications et commentaires.

## 4. الرسائل — séparation et consentement

- Le module Messenger existant et sa route `msg` restent distincts de `multaqa`.
- La messagerie essentielle en texte est réservée aux comptes élèves vérifiés et actifs, sous réserve de règles de protection adaptées aux mineurs.
- Aucun compte nouvellement inscrit/non vérifié ne peut rechercher un élève dans un annuaire privé ni envoyer un DM.
- Une conversation ne peut commencer qu'après une demande de contact et un consentement explicite, ou une autre règle de contact approuvée par l'utilisateur. Les invitations doivent être limitées et révocables.
- L'abonnement ne doit pas permettre de contourner un refus, un blocage ou une restriction de sécurité.
- Pas de publicité, vente de données, ni exploitation commerciale du contenu des conversations.
- Les messages privés ne doivent pas être accessibles aux modérateurs ordinaires. Tout accès exceptionnel doit être limité, justifié, audité et soumis à une procédure définie.

## 5. Profils et découverte

- Profil minimal : nom d'affichage/pseudonyme contrôlé, avatar facultatif, niveau/classe si nécessaire et autorisé.
- Ne jamais publier numéro d'inscription scolaire, numéro d'abonnement, téléphone, e-mail, pièce d'identité, adresse ou position exacte.
- Découverte par défaut limitée au périmètre scolaire pertinent et aux utilisateurs vérifiés ; aucun annuaire national ouvert aux visiteurs.
- Les profils non vérifiés, suspendus, expirés ou ayant désactivé la découverte ne doivent pas apparaître dans les résultats.
- Ne pas lire directement une table brute de profils pour constituer un annuaire client. Utiliser une projection serveur minimale, filtrée par autorisation.

## 6. Groupes et médias — hors MVP initial

- Les groupes sociaux viennent après la validation du fil textuel et des contrôles multi-comptes.
- Adhésion explicite : groupe ouvert avec consentement, approbation ou invitation privée. Pas de déduction automatique par wilaya/niveau/filière.
- Rôles distincts : propriétaire, modérateur, membre ; journaliser les changements d'adhésion et de rôle.
- Les images viennent après le MVP texte, puis les vidéos en dernier.
- Ne pas réutiliser le bucket Messenger `prive`. Un stockage social futur doit être privé par défaut, avec quotas, allowlist MIME, contrôle du contenu réel, quarantaine/scan, URLs temporaires, règles d'accès et purge.
- Ne pas ajouter de fournisseur payant. Si aucun outil de scan/transcodage gratuit et fiable n'est disponible, différer les médias.

## 7. Contrat serveur et données

Toute lecture ou mutation sociale doit être autorisée côté serveur ; le masquage d'un bouton ou la garde `app.js` ne constitue pas une sécurité.

Opérations logiques à spécifier avant implémentation :
- créer/lire/modifier/supprimer une publication ;
- lire le fil selon l'audience et les relations autorisées ;
- créer/modifier/supprimer un commentaire ;
- ajouter/retirer une réaction ;
- créer/traiter/annuler une demande de relation ;
- bloquer/débloquer et signaler ;
- obtenir une projection de découverte minimale ;
- créer une demande de contact Messenger sans créer la conversation avant consentement.

Exigences transversales :
- RLS restrictive par défaut et contrôle serveur pour chaque chemin d'accès ;
- validation de l'état de l'affiliation scolaire côté serveur, jamais à partir d'une valeur fournie par le navigateur ;
- idempotence des mutations sensibles ;
- limitation de débit et anti-énumération des identifiants ;
- journal d'audit des actions de modération et changements d'état ;
- règles explicites de conservation, suppression et export ;
- aucune donnée privée dans les notifications push ou les journaux techniques.

Aucune table, fonction, policy, RPC, GRANT, bucket ou migration n'est créée par ce document.

## 8. Tests bloquants avant activation

Prévoir au minimum une matrice multi-comptes couvrant :
1. compte inscrit non vérifié : aucune lecture de contenu élève ;
2. élève vérifié : accès seulement aux audiences autorisées ;
3. compte expiré/révoqué : suspension immédiate des actions sensibles ;
4. abonnement actif sans vérification : aucun privilège social ;
5. élève vérifié sans abonnement : fonctions sociales et messagerie textuelle essentielles disponibles ;
6. professeur/parent/admin : aucune vue élève par simple modification d'URL ;
7. lecture directe d'un post par identifiant non autorisé ;
8. fuite d'un commentaire via un post privé ;
9. recherche/compteurs/aperçus/notifications sans fuite de métadonnées ;
10. tentative d'usurpation de l'auteur ;
11. XSS et HTML malveillant dans post/commentaire/profil ;
12. spam, limites de débit et création massive de demandes ;
13. acceptation/refus/annulation de relation et répétition idempotente ;
14. blocage bilatéral et absence de nouvelles interactions ;
15. relation sociale sans ouverture automatique de DM ;
16. DM refusé, accepté, bloqué et révoqué ;
17. absence d'accès modérateur ordinaire au contenu privé Messenger ;
18. commentaires désactivés ;
19. suppression auteur/modération et traitement des commentaires liés ;
20. audience de classe avec changement d'affiliation ;
21. découverte désactivée et compte non indexé ;
22. tentative d'énumération des profils ;
23. groupe inaccessible sans adhésion explicite (phase ultérieure) ;
24. stockage social séparé du bucket Messenger (phase média) ;
25. journaux et notifications sans données personnelles sensibles.

## 9. Conditions de mise en œuvre

Aucun branchement au backend réel tant que les points suivants ne sont pas réunis :
- environnement Supabase de test isolé et sans facturation, ou base locale PostgreSQL de test fidèle ;
- comptes synthétiques couvrant les rôles et états ci-dessus ;
- politiques RLS et tests d'accès validés sur cet environnement ;
- revue des règles de confidentialité et de protection des mineurs ;
- sauvegarde, procédure de retour arrière et validation explicite avant toute évolution de la base active ;
- contrôle des coûts : aucun service payant ni option de facturation activée.

## 10. Décisions retenues pour la suite du produit

1. `ملتقى الطلاب` : accessible comme espace aux comptes inscrits, mais le contenu social des élèves est réservé aux élèves vérifiés et autorisés.
2. `الرسائل` : fonctions textuelles essentielles accessibles aux élèves vérifiés, avec demandes et consentement ; pas d'ouverture aux comptes simplement inscrits.
3. Abonnement : ne sert ni de preuve d'identité ni de passe-droit de sécurité ; les options premium éventuelles seront définies séparément.
4. Pas de paiement requis pour les fonctions essentielles d'entraide entre élèves.
5. Groupes, images et vidéos différés ; aucune donnée réelle ni migration avant les tests isolés.

**Périmètre de ce lot :** contrat documentaire uniquement. Aucun changement Auth, RLS, schéma, migration, Storage, Realtime, application ou déploiement.
