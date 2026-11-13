# Lot 390 — audit de l'intégration du Messenger existant au futur réseau social

Date : 13 novembre 2026  
Périmètre : lecture du code de la branche de travail ; aucune modification runtime ni base de données.

## Décision de continuité

Le Messenger existe déjà dans la plateforme. Le réseau social « ملتقى الطلاب » doit le réutiliser comme service de conversations privées ; il ne faut ni créer une deuxième messagerie ni remplacer les écrans et composants déjà réalisés.

## Vérification du code

Fichiers inspectés :
- `msg.js` — interface RTL, boîte de conversations, affichage des groupes, fil de discussion, recherche locale dans la liste, présence Realtime, pièces jointes, signalement et actions de blocage.
- `supabase/supabase.js` — fonctions client de lecture des conversations/messages, envoi, ouverture d'un DM existant, liste des groupes, pièces jointes, signalement et blocage.
- `docs/product/MESSAGERIE_MESSENGER_SCOLAIRE_SPEC.md` et `docs/product/LOT-357-AUDIT-FONCTIONNEL-MESSENGER.md) — spécifications et audit fonctionnel antérieurs.

Constats vérifiables dans le code actuel :
1. `msg.js` est bien enregistré dans les vues et la navigation ; il affiche les conversations existantes et les groupes.
2. La barre de recherche actuelle est libellée « ابحث في محادثاتي ومجموعاتي… » : elle filtre les conversations et groupes déjà affichés. Ce n'est pas encore un annuaire national d'élèves.
3. Le code examiné ne contient pas de liste d'amis/contacts ni de commandes client d'envoi, acceptation ou refus d'invitations. Les opérations de conversation existante et les groupes sont présentes.
4. `msgOpenDirect` côté client contient un garde-fou `msg_invitation_requise` et ne crée pas de nouveau DM depuis le navigateur. Toutefois, l'audit serveur des lots 385–388 a identifié le RPC SECURITY DEFINER actif `msg_open_direct` et le helper `msg_member_ok` comme chemins à durcir ; le garde-fou client seul n'est pas une garantie de sécurité.
5. Le Messenger actuel possède donc une base de messagerie réelle dans le code, mais cela ne signifie pas que le parcours national d'annuaire + invitations est déjà complet ou activé.

## Architecture cible : complément, pas duplication

- `ملتقى الطلاب` : fil social, publications, photos, commentaires, réactions, partages, profils, notifications et groupes communautaires.
- `ماسنجر` : réutilisation du module et des tables de conversations/messages existants pour les échanges privés, avec intégration depuis les profils et notifications du réseau.
- `زملائي` : relation sociale / contacts et demandes de connexion, distincts des membres d'une conversation.
- `المجموعات الدراسية` : communautés du réseau social ; les groupes de discussion Messenger existants restent des conversations, avec des permissions distinctes.

Ne pas confondre « ami/connexion sociale » avec « membre d'une conversation privée » : l'ajout d'un contact ne doit pas créer automatiquement un DM ni autoriser un message sans consentement.

## Portée nationale confirmée au lot 389

Les élèves vérifiés de 1AS, 2AS et 3AS peuvent découvrir et inviter des élèves de tous les niveaux, lycées et wilayas. Le niveau, la filière et la wilaya servent de filtres facultatifs, pas de barrières de compatibilité. L'invitation acceptée, la vérification institutionnelle, le blocage bilatéral et les contrôles anti-abus restent obligatoires.

## Prochaine séquence de conception

1. Cartographier les routes et vues existantes pour ajouter une entrée « ملتقى الطلاب » sans casser les identifiants ni les handlers.
2. Définir le modèle social distinct : profils publics minimaux, visibilité, demandes de connexion, relations acceptées, abonnements éventuels et blocages.
3. Concevoir le fil d'actualité, les publications et commentaires, réactions, partages, médias, notifications et communautés.
4. Relier chaque profil à l'action « مراسلة » qui ouvre le Messenger existant ; si aucun DM autorisé n'existe, démarrer le flux d'invitation sécurisé déjà spécifié.
5. Préparer les tests de confidentialité et d'accès avant tout branchement aux données réelles.

## Limites et sécurité

- Ne pas annoncer que l'annuaire national, les amis ou le fil social sont déjà fonctionnels.
- Ne pas exposer l'email, le numéro de téléphone, l'identifiant Auth ou les données sensibles dans l'annuaire.
- Prévoir visibilité du profil, invitations contrôlées, anti-énumération, signalement, blocage et modération.
- Aucun changement runtime dans ce lot ; aucune table sociale créée.
- Aucun changement Supabase actif, aucune migration/RPC/RLS/ACL/Auth/Storage/Realtime, aucun test RLS réel, aucun CI hébergé, aucun déploiement, aucun merge, aucun coût.

**Conclusion :** Messenger est le socle de messagerie existant. Le chantier suivant est le réseau social « ملتقى الطلاب » et ses relations sociales, puis son intégration à Messenger sans le dupliquer.
